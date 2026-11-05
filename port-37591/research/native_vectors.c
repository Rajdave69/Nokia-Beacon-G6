/* Offline codec oracle for supplied G6 libmeshmsg.so; no daemon started.
 * Only pure message builders/getters and framing on an AF_UNIX socket pair.
 * Synthetic RFC5737 addresses only. Uninitialized vendor header padding is
 * replaced with zero before emission; decoded framing fields are retained.
 */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/syscall.h>
#include <errno.h>
extern void *old_dlopen(const char *,int);
extern void *old_dlsym(void *,const char *);
extern char *old_dlerror(void);
__asm__(".symver old_dlopen,dlopen@GLIBC_2.17");
__asm__(".symver old_dlsym,dlsym@GLIBC_2.17");
__asm__(".symver old_dlerror,dlerror@GLIBC_2.17");
__asm__(".symver start_compat,__libc_start_main@GLIBC_2.17\n"
        ".text\n.global _start\n.type _start,%function\n_start:\n"
        "mov x5,x0\nmov x29,xzr\nmov x30,xzr\nldr x1,[sp]\nadd x2,sp,#8\n"
        "mov x6,sp\nmov x3,xzr\nmov x4,xzr\nadrp x0,main\nadd x0,x0,:lo12:main\nb start_compat\n");
static void denied(void){ fputs("unexpected network/process operation\n",stderr);_exit(90); }
int socket(int domain,int type,int protocol){ (void)domain;(void)type;(void)protocol;denied();return -1; }
int connect(int fd,const struct sockaddr *a,socklen_t n){(void)fd;(void)a;(void)n;denied();return -1;}
int bind(int fd,const struct sockaddr *a,socklen_t n){(void)fd;(void)a;(void)n;denied();return -1;}
int listen(int fd,int n){(void)fd;(void)n;denied();return -1;}
int system(const char *s){(void)s;denied();return -1;}
FILE *popen(const char*s,const char*m){(void)s;(void)m;denied();return NULL;}
int execve(const char*a,char*const b[],char*const c[]){(void)a;(void)b;(void)c;denied();return -1;}
static int (*pack_request)(void*,const void*,int);
static int (*pack_reply)(void*,const void*,int);
static int (*build_login)(void*,const char*);
static int (*build_logout)(void*,const char*);
static void (*build_hb)(void*,void*,int);
static void (*build_ack)(void*,void*,int);
static int (*get_type)(const char*);
static int (*get_seq)(const char*);
static int (*get_url)(const char*,char*,int);
static void *(*get_payload)(const char*,int,int*);
static int (*send_frame)(int,const void*,int,int);
static void *(*recv_frame)(int,int*,int);
static void hex(const unsigned char *p,size_t n){for(size_t i=0;i<n;++i)printf("%02x",p[i]);}
static int write_all(int fd,const void *buf,size_t n){const char *p=buf;while(n){ssize_t m=write(fd,p,n);if(m<=0)return -1;p+=m;n-=m;}return 0;}
static int read_all(int fd,void *buf,size_t n){char *p=buf;while(n){ssize_t m=read(fd,p,n);if(m<=0)return -1;p+=m;n-=m;}return 0;}
static size_t capacity;
static int vector(const char *name,int what,int seq,const char *payload,int nul){
 unsigned char *ch=calloc(1,0x21000),hb[0x20000],*record;
 if(!ch)return 1;
 strcpy((char*)ch+0x3e,"tcp://192.0.2.10:37592");memcpy(ch+capacity+0x80,&seq,4);
 int interval=12000,count=4,hsequence=9;
 memcpy(ch+capacity+0x1b4,&interval,4);memcpy(ch+capacity+0x1b8,&count,4);memcpy(ch+capacity+0x1c0,&hsequence,4);
 int n;
 if(what==0){n=build_login(ch,payload);record=ch+0x7f;}
 else if(what==1){n=build_logout(ch,payload);record=ch+0x7f;}
 else if(what==2){n=pack_request(ch,payload,(int)strlen(payload)+nul);record=ch+0x7f;}
 else if(what==3){n=pack_reply(ch,payload,(int)strlen(payload)+nul);record=ch+0x7f;}
 else if(what==4){build_hb(ch,hb,sizeof(hb));record=hb;n=(int)strlen((char*)hb)+1;}
 else {build_ack(ch,hb,sizeof(hb));record=hb;n=(int)strlen((char*)hb)+1;}
 if(n<=0||n>131072){fprintf(stderr,"builder %s returned %d; prefix=%.60s\n",name,n,record);free(ch);return 2;}
 char url[128]={0};int pn=-1;void *pp=get_payload((char*)record,n,&pn);get_url((char*)record,url,sizeof(url));
 int sv[2];if(socketpair(AF_UNIX,SOCK_STREAM,0,sv))return 3;
 if(send_frame(sv[0],record,n,1000)!=n)return 4;
 unsigned char *frame=malloc(n+36);if(!frame)return 5;
 if(read_all(sv[1],frame,n+36))return 6;
 if(memcmp(frame,"TCP_WATER_MARK\0",15))return 7;
 uint32_t be;memcpy(&be,frame+32,4);if(__builtin_bswap32(be)!=(uint32_t)n)return 8;
 /* Padding is not a protocol field and must not become a fixture memory leak. */
 memset(frame+15,0,17);
 if(write_all(sv[0],frame,n+36))return 9;
 int rn=0;void *received=recv_frame(sv[1],&rn,1000);
 if(!received||rn!=n||memcmp(received,record,n))return 10;
 printf("{\"name\":\"%s\",\"kind\":%d,\"sequence\":%d,\"url\":\"%s\",\"payload_length\":%d,\"record_hex\":\"",name,get_type((char*)record),get_seq((char*)record),url,pn);
 hex(record,n);printf("\",\"payload_hex\":\"");if(pp&&pn>=0)hex(pp,pn);
 printf("\",\"frame_hex\":\"");hex(frame,n+36);puts("\"}");
 close(sv[0]);close(sv[1]);free(frame);free(received);free(ch);return 0;
}
int main(int argc,char **argv){
 if(argc!=2)return 1;
 capacity=!strcmp(argv[1],"65536")?0x10000:!strcmp(argv[1],"131072")?0x20000:0;
 if(!capacity)return 1;
 alarm(15);
 void *h=old_dlopen("libmeshmsg.so",RTLD_NOW|RTLD_LOCAL);
 if(!h){fprintf(stderr,"dlopen: %s\n",old_dlerror());return 1;}
#define FN(dst,name) do{*(void**)(&dst)=old_dlsym(h,name);if(!dst){fprintf(stderr,"missing symbol %s\n",name);return 1;}}while(0)
 FN(pack_request,"pack_outgoing_rqst");FN(pack_reply,"pack_outgoing_resp");FN(build_login,"build_login_msg");FN(build_logout,"build_logout_msg");FN(build_hb,"build_heartbeat_msg");FN(build_ack,"build_heartbeat_ack_msg");FN(get_type,"get_msg_type");FN(get_seq,"get_msg_sequence");FN(get_url,"get_msg_url");FN(get_payload,"get_msg_payload");FN(send_frame,"tcp_impl_send_with_timeout");FN(recv_frame,"tcp_impl_receive_with_timeout");
 const char *json="{\"type\":\"AI\",\"sequence\":1,\"mac\":\"02:00:00:00:00:10\",\"version\":\"1.0.0\",\"ai-meshmsg-data\":{\"request_type\":5}}";
 int rc=0;
 rc|=vector("login",0,42,"tcp://192.0.2.10:37592",1);
 rc|=vector("logout",1,43,"tcp://192.0.2.10:37592",1);
 rc|=vector("request",2,44,json,1);
 rc|=vector("reply",3,45,json,1);
 rc|=vector("request_no_nul",2,46,"{\"sample\":1}",0);
 rc|=vector("heartbeat",4,47,"",1);
 rc|=vector("heartbeat_ack",5,48,"",1);
 return rc;
}
