#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/socket.h>
static void deny(void){_exit(90);}
int system(const char*s){deny();return -1;}int _system(const char*s){deny();return -1;}FILE*popen(const char*s,const char*m){deny();return NULL;}
int socket(int a,int b,int c){deny();return -1;}int connect(int a,const struct sockaddr*b,socklen_t c){deny();return -1;}int execve(const char*a,char*const b[],char*const c[]){deny();return -1;}
int main(int argc,char**argv){if(argc!=5)return 2;void*h=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!h)return 3;
 void*(*load)(const char*)=dlsym(h,"SE_loadConfFile");char*(*get)(void*,const char*,const char*)=dlsym(h,"SE_getConfValue");if(!load||!get)return 4;
 void*c=load(argv[2]);if(!c)return 5;char*k=get(c,"keys","key7");if(!k)return 6;char expected[256]={0};int fd=open(argv[3],O_RDONLY);if(fd<0)return 7;ssize_t n=read(fd,expected,sizeof(expected));close(fd);if(n<=0||n>=256)return 8;
 size_t kn=strlen(k);fprintf(stderr,"NATIVE_PACKAGED_KEY bytes=%zu equals_python=%d\n",kn,kn==(size_t)n&&!memcmp(k,expected,n));fd=open(argv[4],O_CREAT|O_EXCL|O_WRONLY|O_NOFOLLOW,0600);if(fd<0)return 9;if(write(fd,k,kn)!=(ssize_t)kn)return 10;close(fd);return 0;}
