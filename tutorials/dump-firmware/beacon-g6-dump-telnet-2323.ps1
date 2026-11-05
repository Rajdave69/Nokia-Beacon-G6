#requires -Version 5.1
<#
.SYNOPSIS
Dump Nokia Beacon G6 physical NAND over an existing Telnet shell, using native .NET.
.DESCRIPTION
Windows PowerShell 5.1 / PowerShell 7. No WSL, Python, Expect or telnet.exe needed.
Reads NAND main areas (no OOB); does not upload scripts or write router settings.
Local SHA256 is not an independent source checksum. Live data is not an atomic snapshot.
.EXAMPLE
.\beacon-g6-dump-telnet-2323.ps1 -RouterIP 192.168.18.1
.EXAMPLE
.\beacon-g6-dump-telnet-2323.ps1 -DumpScope full -Out 'D:\Backups\G6'
.EXAMPLE
.\beacon-g6-dump-telnet-2323.ps1 -Credential (Get-Credential -UserName root)
#>
[CmdletBinding()]
param(
 [string]$RouterIP = $(if ($env:ROUTER_IP) { $env:ROUTER_IP } else { '192.168.18.1' }),
 [ValidateRange(1,65535)][int]$TelnetPort = $(if ($env:TELNET_PORT) { [int]$env:TELNET_PORT } else { 2323 }),
 [ValidateSet('firmware','full')][string]$DumpScope = $(if ($env:DUMP_SCOPE) { $env:DUMP_SCOPE } else { 'firmware' }),
 [string]$Out = $env:OUT,
 [string]$User = 'root',
 [System.Management.Automation.PSCredential]$Credential,
 [ValidateRange(1,7200)][int]$IdleTimeoutSeconds = 120,
 [ValidateRange(1,86400)][int]$PartitionTimeoutSeconds = 7200,
 [switch]$SkipZip
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
# C# keeps the byte stream out of slow PowerShell per-byte loops. Uses C# 5/.NET 4.x APIs.
if (-not ('BeaconG6Dump.TelnetSession' -as [type])) {
$receiverSource = @'
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
namespace BeaconG6Dump {
 public sealed class CommandResult {
  public string Output; public int ExitCode;
  public CommandResult(string output,int code) { Output=output; ExitCode=code; }
 }
 public sealed class TransferResult {
  public long Bytes; public string SHA256;
  public TransferResult(long count,string hash) { Bytes=count; SHA256=hash; }
 }
 public sealed class TelnetSession : IDisposable {
  private TcpClient client; private NetworkStream stream;
  private readonly List<byte> pending=new List<byte>();
  private readonly byte[] wire=new byte[65536];
  private int state,negotiation;
  private static readonly Encoding Text=new UTF8Encoding(false);
  public TelnetSession(string host,int port,string user,string password) {
   client=new TcpClient();
   try {
    IAsyncResult connect=client.BeginConnect(host,port,null,null);
    using (System.Threading.WaitHandle wait=connect.AsyncWaitHandle) {
     if (!wait.WaitOne(15000)) throw new TimeoutException("Telnet connect timed out.");
     client.EndConnect(connect);
    }
    client.NoDelay=true; stream=client.GetStream(); stream.ReadTimeout=1000; stream.WriteTimeout=15000;
    Login(user,password);
   } catch { Dispose(); throw; }
  }
  public void Dispose() {
   if (stream!=null) { stream.Dispose(); stream=null; }
   if (client!=null) { client.Close(); client=null; }
  }
  private void SendLine(string text) {
   if (text.IndexOfAny(new char[] {'\r','\n'})>=0) throw new ArgumentException("Unexpected newline in shell input.");
   byte[] bytes=Text.GetBytes(text+"\r\n");
   using (MemoryStream escaped=new MemoryStream()) {
    foreach (byte b in bytes) { escaped.WriteByte(b); if (b==255) escaped.WriteByte(b); }
    byte[] output=escaped.ToArray(); stream.Write(output,0,output.Length);
   }
  }
  private bool Receive() {
   int count;
   try { count=stream.Read(wire,0,wire.Length); }
   catch (IOException ex) {
    SocketException error=ex.InnerException as SocketException;
    if (error!=null && (error.SocketErrorCode==SocketError.TimedOut || error.SocketErrorCode==SocketError.WouldBlock)) return false;
    throw;
   }
   if (count==0) throw new EndOfStreamException("Telnet disconnected before command completion.");
   for (int i=0;i<count;i++) {
    byte b=wire[i];
    if (state==0) { if (b==255) state=1; else pending.Add(b); }
    else if (state==1) {
     if (b==255) { pending.Add(b); state=0; }
     else if (b==251||b==252||b==253||b==254) { negotiation=b; state=2; }
     else if (b==250) state=3; else state=0;
    } else if (state==2) {
     if (negotiation==253||negotiation==251) { byte[] reply={255,(byte)(negotiation==253?252:254),b}; stream.Write(reply,0,3); }
     state=0;
    } else if (state==3) { if (b==255) state=4; }
    else if (state==4) state=(b==240?0:3);
   }
   return true;
  }
  private void Login(string user,string password) {
   Stopwatch clock=Stopwatch.StartNew();
   while (clock.Elapsed.TotalSeconds<30) {
    string text=Text.GetString(pending.ToArray());
    if (Regex.IsMatch(text,@"(?:login|username):\s*$",RegexOptions.IgnoreCase)) { pending.Clear(); SendLine(user); }
    else if (Regex.IsMatch(text,@"password:\s*$",RegexOptions.IgnoreCase)) {
     if (password==null) throw new InvalidOperationException("Telnet requires a password. Use -Credential (Get-Credential) or TELNET_PASSWORD.");
     pending.Clear(); SendLine(password);
    } else if (Regex.IsMatch(text,@"(?:^|[\r\n])[^\r\n]{0,160}[#>$]\s*$")) { pending.Clear(); return; }
    else Receive();
    if (pending.Count>1024*1024) throw new IOException("Excessive output before shell prompt.");
   }
   throw new TimeoutException("Could not detect a Linux shell prompt within 30 seconds.");
  }
  private string WaitRegex(string pattern,int seconds) {
   Regex re=new Regex(pattern,RegexOptions.Multiline); Stopwatch clock=Stopwatch.StartNew();
   while (clock.Elapsed.TotalSeconds<seconds) {
    // Latin-1 preserves byte/character offsets for ASCII marker removal.
    string text=Encoding.GetEncoding(28591).GetString(pending.ToArray()); Match found=re.Match(text);
    if (found.Success) { pending.RemoveRange(0,found.Index+found.Length); return Text.GetString(Encoding.GetEncoding(28591).GetBytes(text.Substring(0,found.Index))); }
    if (pending.Count>4*1024*1024) throw new IOException("Excessive non-streaming command output.");
    Receive();
   }
   throw new TimeoutException("Timed out waiting for shell command marker.");
  }
  private string Begin(string command) {
   string token=Guid.NewGuid().ToString("N"),begin="__G6PS_BEGIN_"+token+"__",end="__G6PS_END_"+token+"__";
   command=command.Trim().TrimEnd(';');
   SendLine("printf '\\n%s\\n' '"+begin+"'; { "+command+"; }; g6_ps_rc=$?; printf '\\n%s:%s\\n' '"+end+"' \"$g6_ps_rc\"");
   WaitRegex(@"(?:^|[\r\n])"+Regex.Escape(begin)+@"\r?\n",30); return end;
  }
  private int ReadStatus(int seconds) {
   Stopwatch clock=Stopwatch.StartNew();
   while (clock.Elapsed.TotalSeconds<seconds) {
    string text=Encoding.ASCII.GetString(pending.ToArray()); Match status=Regex.Match(text,@"^:([0-9]{1,3})\r?\n");
    if (status.Success) { pending.RemoveRange(0,status.Length); return Int32.Parse(status.Groups[1].Value); }
    if (pending.Count>256) throw new IOException("Malformed command completion status.");
    Receive();
   }
   throw new TimeoutException("No command completion status received.");
  }
  public CommandResult Run(string command,int seconds) {
   string end=Begin(command); string output=WaitRegex(@"(?:^|[\r\n])"+Regex.Escape(end),seconds);
   return new CommandResult(output.Replace("\r", "").Trim('\n'),ReadStatus(30));
  }
  private int Find(byte[] needle) {
   for (int i=0;i<=pending.Count-needle.Length;i++) {
    if (pending[i]!=needle[0]) continue;
    int j=1; for (;j<needle.Length && pending[i+j]==needle[j];j++) { }
    if (j==needle.Length) return i;
   } return -1;
  }
  private static bool Base64Char(byte b) {
   return (b>=65&&b<=90)||(b>=97&&b<=122)||(b>=48&&b<=57)||b==43||b==47||b==61;
  }
  public TransferResult DumpMtd(int number,long size,string destination,string encoder,int idleSeconds,int totalSeconds) {
   if (number<0||number>11) throw new ArgumentException("Only physical G6 mtd0..mtd11 are supported.");
   if (size<=0) throw new ArgumentException("Invalid MTD size.");
   string partial=destination+".partial";
   if (File.Exists(destination)||File.Exists(partial)) throw new IOException("Output or partial file already exists: "+destination);
   string command;
   if (encoder=="base64") command="base64 /dev/mtd"+number;
   else if (encoder=="busybox") command="busybox base64 /dev/mtd"+number;
   else if (encoder=="openssl") command="openssl base64 -in /dev/mtd"+number;
   else throw new ArgumentException("Unknown Base64 encoder.");
   long total=0,nextReport=16L*1024*1024; char[] chars=new char[65540]; int used=0; bool padded=false;
   Stopwatch clock=Stopwatch.StartNew(); double lastData=0;
   using (FileStream file=new FileStream(partial,FileMode.CreateNew,FileAccess.Write,FileShare.Read))
   using (SHA256 hash=SHA256.Create()) {
    string end=Begin(command); byte[] marker=Encoding.ASCII.GetBytes(end); lastData=clock.Elapsed.TotalSeconds;
    while (true) {
     int at=Find(marker),take=at>=0?at:Math.Max(0,pending.Count-marker.Length+1);
     if (take>0) {
      for (int i=0;i<take;i++) {
       byte b=pending[i]; if (b==13||b==10||b==32||b==9) continue;
       if (!Base64Char(b)) throw new FormatException("Non-Base64 byte in MTD stream: 0x"+b.ToString("x2"));
       if (padded) throw new FormatException("Base64 data after final padding.");
       chars[used++]=(char)b;
       if (used>=32768 && used%4==0) {
        byte[] block=Convert.FromBase64CharArray(chars,0,used);
        if (total+block.Length>size) throw new IOException("Received more bytes than /proc/mtd reports.");
        file.Write(block,0,block.Length); hash.TransformBlock(block,0,block.Length,block,0); total+=block.Length;
        if (chars[used-1]=='=') padded=true; used=0;
       }
      }
      pending.RemoveRange(0,take); int complete=(used/4)*4;
      if (complete>0) {
       byte[] block=Convert.FromBase64CharArray(chars,0,complete);
       if (total+block.Length>size) throw new IOException("Received more bytes than /proc/mtd reports.");
       file.Write(block,0,block.Length); hash.TransformBlock(block,0,block.Length,block,0); total+=block.Length;
       if (chars[complete-1]=='=') padded=true;
       used-=complete; if (used>0) Array.Copy(chars,complete,chars,0,used);
       if (padded&&used!=0) throw new FormatException("Base64 data after padding.");
      }
     }
     if (total>=nextReport) { Console.WriteLine("  {0:P1} ({1:N0}/{2:N0} bytes)",(double)total/size,total,size); nextReport+=16L*1024*1024; }
     if (at>=0) { pending.RemoveRange(0,marker.Length); break; }
     if (clock.Elapsed.TotalSeconds>totalSeconds) throw new TimeoutException("MTD transfer exceeded total time limit.");
     if (Receive()) lastData=clock.Elapsed.TotalSeconds;
     else if (clock.Elapsed.TotalSeconds-lastData>idleSeconds) throw new TimeoutException("No MTD data within idle time limit.");
    }
    if (used!=0) throw new FormatException("Incomplete final Base64 quartet.");
    int code=ReadStatus(30);
    if (code!=0) throw new IOException("Router Base64 encoder failed with status "+code+".");
    if (total!=size) throw new IOException("Short MTD read: expected "+size+" bytes, received "+total+".");
    file.Flush(true); hash.TransformFinalBlock(new byte[0],0,0);
    string digest=BitConverter.ToString(hash.Hash).Replace("-","").ToLowerInvariant();
    file.Dispose(); File.Move(partial,destination); return new TransferResult(total,digest);
   }
  }
 }
}
'@
 Add-Type -TypeDefinition $receiverSource -Language CSharp
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Write-TextFile([string]$Path,[string]$Text) { [IO.File]::WriteAllText($Path,$Text,$utf8) }
function Get-DumpType([string]$Path) {
 $file=[IO.File]::OpenRead($Path)
 try { $bytes=New-Object byte[] 16; $length=$file.Read($bytes,0,16) } finally { $file.Dispose() }
 $magic=([BitConverter]::ToString($bytes,0,$length)).Replace('-','').ToLowerInvariant()
 $kind='raw MTD main-area data'
 if ($magic.StartsWith('55424923')) { $kind='UBI image (EC header)' }
 elseif ($magic.StartsWith('d00dfeed')) { $kind='Flattened Device Tree / FIT' }
 elseif ($magic.StartsWith('68737173')) { $kind='SquashFS (little endian)' }
 elseif ($magic.StartsWith('31181006')) { $kind='UBIFS node' }
 elseif ($magic.StartsWith('7f454c46')) { $kind='ELF image' }
 elseif ($magic.StartsWith('1f8b')) { $kind='gzip stream' }
 return ('{0}: {1}; first bytes={2}' -f [IO.Path]::GetFileName($Path),$kind,$magic)
}
$session=$null
$exitCode=0
try {
 if (-not $Out) { $Out=Join-Path ([Environment]::GetFolderPath('UserProfile')) ('beacon-g6-clean-dumps-'+(Get-Date -Format 'yyyyMMdd-HHmmss')) }
 $Out=[IO.Path]::GetFullPath($Out)
 if (Test-Path -LiteralPath $Out) { throw "Output directory already exists; choose a new -Out: $Out" }
 New-Item -ItemType Directory -Path $Out -ErrorAction Stop | Out-Null
 Write-Host "Output: $Out"
 Write-Host ("Connecting to {0}:{1} ..." -f $RouterIP,$TelnetPort)
 $password=$env:TELNET_PASSWORD
 if ($Credential) { $User=$Credential.UserName; $password=$Credential.GetNetworkCredential().Password }
 $session=[BeaconG6Dump.TelnetSession]::new($RouterIP,$TelnetPort,$User,$password)
 $password=$null
 $identity=$session.Run('id -u',30)
 if ($identity.ExitCode -ne 0 -or $identity.Output.Trim() -ne '0') { throw 'A privileged Linux shell is required (id -u must return 0).' }
 $probe=$session.Run('if command -v base64 >/dev/null 2>&1; then echo G6ENC:base64; elif busybox base64 </dev/null >/dev/null 2>&1; then echo G6ENC:busybox; elif command -v openssl >/dev/null 2>&1; then echo G6ENC:openssl; else echo G6ENC:none; fi',30)
 $encoderMatch=[regex]::Match($probe.Output,'(?m)^G6ENC:(base64|busybox|openssl|none)\s*$')
 if ($probe.ExitCode -ne 0 -or -not $encoderMatch.Success -or $encoderMatch.Groups[1].Value -eq 'none') { throw 'No supported Base64 encoder on the router.' }
 $encoder=$encoderMatch.Groups[1].Value
 Write-Host "Router encoder: $encoder"
 $table=$session.Run('cat /proc/mtd',30)
 if ($table.ExitCode -ne 0) { throw 'Could not read /proc/mtd.' }
 Write-TextFile (Join-Path $Out 'proc-mtd.txt') ($table.Output+"`n")
 $partitions=@{}
 foreach ($match in [regex]::Matches($table.Output,'(?m)^mtd(\d+):\s+([0-9a-fA-F]+)\s+([0-9a-fA-F]+)\s+"([^"\r\n]*)"\s*$')) {
  $n=[int]$match.Groups[1].Value
  if ($partitions.ContainsKey($n)) { throw "Duplicate mtd$n entry in /proc/mtd." }
  $partitions[$n]=@{Size=[Convert]::ToInt64($match.Groups[2].Value,16);Name=$match.Groups[4].Value}
 }
 $numbers=@(0,1,2,3,4,5,6,7,9,10)
 if ($DumpScope -eq 'full') { $numbers=@(0..11) }
 $expectedNames=@('ssb','uboot-env','RI','rootfs0','rootfs1','rootfs_data0','rootfs_data1','cfg','log','extfs','0:ART','user_data')
 [long]$totalSize=0
 foreach ($n in $numbers) {
  if (-not $partitions.ContainsKey($n) -or $partitions[$n].Size -le 0) { throw "Expected physical mtd$n is missing or empty; inspect proc-mtd.txt." }
  if ($partitions[$n].Name -cne $expectedNames[$n]) { throw "Unexpected name for physical mtd$n; this script requires the documented G6 layout. Inspect proc-mtd.txt." }
  $totalSize+=$partitions[$n].Size
 }
 try {
  $drive=[IO.DriveInfo]::new([IO.Path]::GetPathRoot($Out))
  [long]$needed=$totalSize+64MB
  if (-not $SkipZip) { $needed+=$totalSize }
  if ($drive.AvailableFreeSpace -lt $needed) { throw [IO.IOException]::new("Insufficient free space: need at least $needed bytes including archive allowance.") }
 } catch [IO.IOException] { throw } catch { Write-Warning 'Free-space preflight is unavailable for this path; filesystem errors will still stop the dump.' }
 $metadata=New-Object Text.StringBuilder
 $sections=@(
  @('uname','uname -a'),
  @('OpenWrt','cat /etc/openwrt_release 2>/dev/null || true'),
  @('/proc/mtd','cat /proc/mtd'),
  @('kernel cmdline','cat /proc/cmdline'),
  @('mounts','cat /proc/mounts'),
  @('UBI','ubinfo -a 2>&1 || true'),
  @('MTD geometry','for d in /sys/class/mtd/mtd*; do echo "--- $d ---"; for f in name size erasesize writesize oobsize; do if [ -f "$d/$f" ]; then printf "%s=" "$f"; cat "$d/$f"; fi; done; done'),
  @('NAND / UBI boot log','dmesg | grep -Ei "nand|mtd|ubi|ubifs|squashfs|fit" || true')
 )
 foreach ($section in $sections) {
  Write-Host ('Metadata: '+$section[0])
  $response=$session.Run($section[1],45)
  [void]$metadata.AppendLine('===== '+$section[0]+' ====='); [void]$metadata.AppendLine($response.Output)
  if ($response.ExitCode -ne 0) { [void]$metadata.AppendLine('[command exit status '+$response.ExitCode+']') }
  [void]$metadata.AppendLine()
  Write-TextFile (Join-Path $Out 'router-metadata.txt') $metadata.ToString()
 }
 $hashLines=New-Object 'System.Collections.Generic.List[string]'
 $typeLines=New-Object 'System.Collections.Generic.List[string]'
 $dumpNames=New-Object 'System.Collections.Generic.List[string]'
 foreach ($n in $numbers) {
  $name=[regex]::Replace($partitions[$n].Name,'[^A-Za-z0-9_.-]+','_')
  if (-not $name) { $name='unknown' }
  $filename='mtd{0:D2}_{1}.bin' -f $n,$name
  Write-Host ("Dumping mtd{0} ({1}): {2:N0} bytes -> {3}" -f $n,$partitions[$n].Name,$partitions[$n].Size,$filename)
  $result=$session.DumpMtd($n,$partitions[$n].Size,(Join-Path $Out $filename),$encoder,$IdleTimeoutSeconds,$PartitionTimeoutSeconds)
  $hashLines.Add($result.SHA256+'  '+$filename); $typeLines.Add((Get-DumpType (Join-Path $Out $filename))); $dumpNames.Add($filename)
  Write-TextFile (Join-Path $Out 'SHA256SUMS.txt') (($hashLines -join "`n")+"`n")
  Write-TextFile (Join-Path $Out 'FILE-TYPES.txt') (($typeLines -join "`n")+"`n")
  Write-Host ('  COMPLETE: size OK; SHA256 '+$result.SHA256)
 }
 $session.Dispose(); $session=$null
 if (-not $SkipZip) {
  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $zipPath=Join-Path $Out 'beacon-g6-clean-dumps.zip'; $zipPartial=$zipPath+'.partial'
  $zipFile=[IO.File]::Open($zipPartial,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write,[IO.FileShare]::None); $archive=$null
  try {
   $archive=[IO.Compression.ZipArchive]::new($zipFile,[IO.Compression.ZipArchiveMode]::Create,$true)
   $entries=@('router-metadata.txt','proc-mtd.txt','SHA256SUMS.txt','FILE-TYPES.txt')+$dumpNames.ToArray()
   foreach ($entry in $entries) { [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,(Join-Path $Out $entry),$entry,[IO.Compression.CompressionLevel]::Optimal) }
   $archive.Dispose(); $archive=$null; $zipFile.Flush($true)
  } finally { if ($archive) { $archive.Dispose() }; $zipFile.Dispose() }
  [IO.File]::Move($zipPartial,$zipPath); Write-Host "Archive: $zipPath"
 }
 Write-Host "SUCCESS: $Out"
 Write-Host 'NAND main areas only; no OOB. Live writable data may change during capture.'
 Write-Host 'SHA256SUMS describes received files; no independent source checksum comparison.'
} catch {
 $exitCode=1; Write-Error -Message ($_.Exception.GetBaseException().Message) -ErrorAction Continue
 if ($Out) { Write-Host "Incomplete capture retained at: $Out" }
} finally { if ($session) { $session.Dispose() } }
exit $exitCode
