/* Offline stock swmgnt payload/header-builder harness. The daemon main is not
 * called. Cached identity/config data and operator getter are injected from a
 * private fixture. All curl I/O and system/process calls are intercepted. This
 * tests native serialization, NOT equivalence of the injected key to a device.
 */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdarg.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/socket.h>
struct slist {char *data;struct slist *next;};
static struct slist *headers;static void *read_data;static size_t(*reader)(char*,size_t,size_t,void*);
static const char *prefix;static char op[129];static unsigned blocked_commands;static int curl_token;static int phase;
static void deny(void){_exit(91);}
int system(const char*s){blocked_commands++;return 0;}int _system(const char*s){blocked_commands++;return 0;}
FILE *popen(const char*s,const char*m){deny();return NULL;}int execve(const char*a,char*const b[],char*const c[]){deny();return -1;}
int socket(int a,int b,int c){deny();return -1;}int connect(int a,const struct sockaddr*b,socklen_t c){deny();return -1;}
int cfg_getObj(void*a,unsigned b,unsigned c){fprintf(stderr,"CFG_GUARD phase=%d oid=%u size=%u flags=%u caller=%p\n",phase,*(uint32_t*)a,b,c,__builtin_return_address(0));_exit(92);}void nalLogNotice(const char*a,...){ }void nalLogError(const char*a,...){ }
int nal_getOperatorUniqueID(char *out){out[0]=0;return 0;}
int nal_getNodeInfo(void *out){memcpy((char*)out+0x1d8,op,strlen(op)+1);return 0;}
int curl_global_init(long x){return 0;}void curl_global_cleanup(void){}void *curl_easy_init(void){return &curl_token;}
void curl_easy_cleanup(void*p){}
struct slist *curl_slist_append(struct slist *h,const char *s){struct slist*n=calloc(1,sizeof(*n));if(!n)_exit(94);n->data=strdup(s);if(!h)return n;struct slist*t=h;while(t->next)t=t->next;t->next=n;return h;}
void curl_slist_free_all(struct slist*h){while(h){struct slist*n=h->next;free(h->data);free(h);h=n;}}
int curl_easy_setopt(void*c,int option,...){va_list ap;va_start(ap,option);if(option>=10000){void*p=va_arg(ap,void*);if(option==10023)headers=p;else if(option==10009)read_data=p;else if(option==20012)reader=p;}else(void)va_arg(ap,long);va_end(ap);return 0;}
int curl_easy_getinfo(void*c,int option,void*p){*(long*)p=200;return 0;}
static FILE *newfile(const char*suffix){char p[4096];if(snprintf(p,sizeof(p),"%s%s",prefix,suffix)>=(int)sizeof(p))_exit(95);int fd=open(p,O_WRONLY|O_CREAT|O_EXCL|O_NOFOLLOW,0600);if(fd<0)_exit(96);FILE*f=fdopen(fd,"wb");if(!f)_exit(97);return f;}
int curl_easy_perform(void*c){FILE*f=newfile(".headers-private.txt");for(struct slist*h=headers;h;h=h->next)fprintf(f,"%s\r\n",h->data);fclose(f);f=newfile(".body-private.json");if(!reader||!read_data)_exit(98);char b[4096];size_t total=0,n;while((n=reader(b,1,sizeof(b),read_data))){if(n>sizeof(b)||total+n>16384)_exit(99);fwrite(b,1,n,f);total+=n;}fclose(f);return 0;}
int main(int argc,char**argv){if(argc!=4)return 2;prefix=argv[3];unsigned char fixture[472+9280];int fd=open(argv[2],O_RDONLY);if(fd<0)return 3;size_t n=0;while(n<sizeof(fixture)){ssize_t k=read(fd,fixture+n,sizeof(fixture)-n);if(k<=0)return 4;n+=k;}close(fd);
 phase=1;void*h=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!h){fputs(dlerror(),stderr);return 5;}
 void *mainfn=dlsym(h,"main");if(!mainfn)return 6;uintptr_t base=(uintptr_t)mainfn-0x41f0;
 memcpy((void*)(base+0x27aa0),fixture,472);*(uint32_t*)(base+0x27c78)=1;
 memcpy((void*)(base+0x27ca8),fixture+472,9280);*(uint32_t*)(base+0x27c80)=1;
 memcpy(op,fixture+32,128);op[128]=0;
 int(*payload)(char*,int)=(void*)(base+0x8108);int(*build)(int,void*,void*,long*)=(void*)(base+0x4e40);
 char body[4096]={0};phase=2;int payload_n=payload(body,sizeof(body));if(payload_n<=0)return 7;
 struct {char *ptr;size_t remaining,offset;} upload={body,strlen(body),0};char response[4096]={0};struct {char *ptr;size_t remaining,offset;} download={response,sizeof(response),0};long http=0;
 phase=3;int status=build(0,&upload,&download,&http);FILE*out=newfile(".summary.json");fprintf(out,"{\"native_builder_status\":%d,\"payload_return_bytes\":%d,\"body_bytes\":%zu,\"intercepted_system_calls\":%u,\"fake_HTTP_status\":%ld,\"real_network_calls\":0}\n",status,payload_n,strlen(body),blocked_commands,http);fclose(out);return status?8:0;
}
