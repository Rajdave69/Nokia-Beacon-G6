/* Read the exact SwMgnt object used by nal_getSwAutoUpgradeInfo.
 * Read-only cfg_getObj(oid=599,len=0x8c5,flags=0x1000); no updater or SE init.
 * Only lengths/status/equality booleans are printed. Expected file: LE uint32
 * key length, 32 key-digest bytes, LE uint32 URL length, 32 URL-digest bytes.
 * Stock library output is suppressed before dlopen. AF_UNIX is allowed for
 * local cfgmgr IPC; Internet sockets and process launches are denied.
 */
/* v2: link against the target libdl.so.2 and bind symbols before suppressing output. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/socket.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <errno.h>
#include <signal.h>
extern void *old_dlopen(const char *,int);
extern void *old_dlsym(void *,const char *);
__asm__(".symver old_dlopen,dlopen@GLIBC_2.17");
__asm__(".symver old_dlsym,dlsym@GLIBC_2.17");
__asm__(".symver start_compat,__libc_start_main@GLIBC_2.17\n"
        ".text\n.global _start\n.type _start,%function\n_start:\n"
        "mov x5,x0\nmov x29,xzr\nmov x30,xzr\nldr x1,[sp]\nadd x2,sp,#8\n"
        "mov x6,sp\nmov x3,xzr\nmov x4,xzr\nadrp x0,main\nadd x0,x0,:lo12:main\nb start_compat\n");
static int result_fd=-1;static volatile sig_atomic_t stage;
static void timeout_handler(int signo){
 const char *s=stage==1?"{\"probe_error\":\"timeout_loading_libcfg\"}\n":stage==2?"{\"probe_error\":\"timeout_loading_libcrypto\"}\n":stage==3?"{\"probe_error\":\"timeout_reading_cfgmgr\"}\n":"{\"probe_error\":\"probe_timeout\"}\n";
 size_t n=0;while(s[n])++n;if(result_fd>=0)(void)write(result_fd,s,n);_exit(124);
}
static void denied(void){const char s[]="{\"probe_error\":\"blocked_nonlocal_or_process_operation\"}\n";if(result_fd>=0)(void)write(result_fd,s,sizeof(s)-1);_exit(90);}
int system(const char*s){denied();return -1;} int _system(const char*s){denied();return -1;}
FILE *popen(const char*s,const char*m){denied();return NULL;}
int execve(const char*a,char*const b[],char*const c[]){denied();return -1;}
pid_t fork(void){denied();return -1;}pid_t vfork(void){denied();return -1;}
int socket(int domain,int type,int protocol){if(domain!=AF_UNIX)denied();return syscall(SYS_socket,domain,type,protocol);}
int connect(int fd,const struct sockaddr *a,socklen_t n){if(!a||n<sizeof(a->sa_family)||a->sa_family!=AF_UNIX)denied();return syscall(SYS_connect,fd,a,n);}
static int fail(const char *msg){if(result_fd>=0)dprintf(result_fd,"{\"probe_error\":\"%s\"}\n",msg);return 1;}
int main(int argc,char **argv){
 result_fd=dup(STDOUT_FILENO);if(result_fd<0)return 1;
 int sink=open("/dev/null",O_WRONLY);if(sink<0)return fail("cannot_suppress_stock_output");
 if(dup2(sink,STDOUT_FILENO)<0||dup2(sink,STDERR_FILENO)<0)return fail("cannot_suppress_stock_output");close(sink);
 if(argc!=2)return fail("expected_comparison_file_argument");
 unsigned char expected[72],extra;int fd=open(argv[1],O_RDONLY|O_NOFOLLOW);if(fd<0)return fail("cannot_read_expected_file");
 size_t pos=0;while(pos<sizeof(expected)){ssize_t n=read(fd,expected+pos,sizeof(expected)-pos);if(n<=0)return fail("bad_expected_file_size");pos+=n;}
 if(read(fd,&extra,1)!=0)return fail("bad_expected_file_size");close(fd);
 uint32_t key_n,url_n;memcpy(&key_n,expected,4);memcpy(&url_n,expected+36,4);if(key_n>1024||url_n>1024)return fail("bad_expected_length");
 struct sigaction sa={0};sa.sa_handler=timeout_handler;sigemptyset(&sa.sa_mask);if(sigaction(SIGALRM,&sa,NULL))return fail("cannot_install_timeout");alarm(15);
 stage=1;void *cfg=old_dlopen("libcfg.so",RTLD_NOW|RTLD_LOCAL);if(!cfg)return fail("cannot_load_libcfg");
 stage=2;void *crypto=old_dlopen("libcrypto.so.3",RTLD_NOW|RTLD_LOCAL);if(!crypto)return fail("cannot_load_libcrypto");
 int(*get)(void*,unsigned,unsigned)=old_dlsym(cfg,"cfg_getObj");
 unsigned char*(*sha)(const unsigned char*,size_t,unsigned char*)=old_dlsym(crypto,"SHA256");
 if(!get||!sha)return fail("stock_API_missing");
 unsigned char object[0x8c5] __attribute__((aligned(8)))={0};uint32_t oid=599;memcpy(object,&oid,4);
 stage=3;int status=get(object,sizeof(object),0x1000);
 if(status){dprintf(result_fd,"{\"cfg_getObj_status\":%d,\"key_matches_requested_default\":null,\"url_matches_requested_profile\":null}\n",status);return 1;}
 size_t kn=strnlen((const char*)object+0x20,1025),un=strnlen((const char*)object+0x4a3,1025);
 if(kn==1025||un==1025)return fail("unterminated_stock_field");unsigned char kh[32],uh[32];
 if(!sha(object+0x20,kn,kh)||!sha(object+0x4a3,un,uh))return fail("hash_failed");
 alarm(0);int km=kn==key_n&&!memcmp(kh,expected+4,32),um=un==url_n&&!memcmp(uh,expected+40,32);
 dprintf(result_fd,"{\"cfg_getObj_status\":0,\"key_bytes\":%zu,\"key_matches_requested_default\":%s,\"url_matches_requested_profile\":%s,\"OTA_enabled\":%s}\n",kn,km?"true":"false",um?"true":"false",object[0x421]?"true":"false");
 memset(object,0,sizeof(object));return 0;
}
