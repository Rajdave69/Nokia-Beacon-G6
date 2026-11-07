#!/usr/bin/env python3
"""Read-only, single-image HTTPS registry for an owner's private LAN smoke test."""
import argparse,hashlib,http.server,json,re,ssl,threading,time
from pathlib import Path
from urllib.parse import urlsplit,unquote

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--bind',required=True);ap.add_argument('--port',type=int,default=443)
    ap.add_argument('--package',type=Path,required=True);ap.add_argument('--cert',type=Path,required=True);ap.add_argument('--key',type=Path,required=True)
    ap.add_argument('--log',type=Path,required=True);ap.add_argument('--stop-file',type=Path,required=True)
    args=ap.parse_args();manifest=(args.package/'manifest.json').read_bytes();digest='sha256:'+hashlib.sha256(manifest).hexdigest();tag=json.loads((args.package/'package.json').read_text())['tag'];lock=threading.Lock()
    if args.stop_file.exists():raise ValueError('Choose an unused stop-file path')
    class Handler(http.server.BaseHTTPRequestHandler):
        protocol_version='HTTP/1.1'
        def log_message(self,*unused):pass
        def serve(self,head=False):
            path=unquote(urlsplit(self.path).path);status=404;body=b'{"errors":[{"code":"NAME_UNKNOWN"}]}';kind='application/json';content_digest=None
            if path.rstrip('/')=='/v2':status=200;body=b'{}'
            elif path.startswith('/v2/beacon-lcm-smoke/manifests/'):
                ref=path.rsplit('/',1)[1]
                if ref in (tag,'latest',digest):status=200;body=manifest;kind='application/vnd.oci.image.manifest.v1+json';content_digest=digest
            elif path.startswith('/v2/beacon-lcm-smoke/blobs/'):
                ref=path.rsplit('/',1)[1]
                if re.fullmatch(r'sha256:[0-9a-f]{64}',ref):
                    f=args.package/'oci/blobs/sha256'/ref.split(':')[1]
                    if f.is_file():status=200;body=f.read_bytes();kind='application/octet-stream';content_digest=ref
            with lock:
                with args.log.open('a',encoding='utf-8') as f:f.write(json.dumps({'method':self.command,'path':path,'status':status,'bytes':len(body),'accept':self.headers.get('Accept'),'user_agent':self.headers.get('User-Agent'),'peer':self.client_address[0]})+'\n')
            self.send_response(status);self.send_header('Content-Type',kind);self.send_header('Content-Length',str(len(body)));self.send_header('Docker-Distribution-Api-Version','registry/2.0')
            if content_digest:self.send_header('Docker-Content-Digest',content_digest)
            self.end_headers()
            if not head:self.wfile.write(body)
        def do_GET(self):self.serve()
        def do_HEAD(self):self.serve(True)
    server=http.server.ThreadingHTTPServer((args.bind,args.port),Handler);server.daemon_threads=True
    context=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER);context.load_cert_chain(args.cert,args.key);server.socket=context.wrap_socket(server.socket,server_side=True)
    worker=threading.Thread(target=server.serve_forever,daemon=True);worker.start();print('private single-image TLS registry ready',flush=True)
    try:
        while not args.stop_file.exists():time.sleep(.2)
    finally:server.shutdown();server.server_close();print('test registry stopped',flush=True)
if __name__=='__main__':main()
