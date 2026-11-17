#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/socket.h>
static void deny(void){_exit(90);}
int system(const char *s){deny();return -1;} int _system(const char *s){deny();return -1;}
FILE *popen(const char *s,const char *m){deny();return NULL;}
int socket(int a,int b,int c){deny();return -1;}int connect(int a,const struct sockaddr*b,socklen_t c){deny();return -1;}
int execve(const char*a,char*const b[],char*const c[]){deny();return -1;}
int main(int argc,char**argv){
 if(argc!=4)return 2; int fd=open(argv[2],O_RDONLY); if(fd<0)return 3;struct stat st;
 if(fstat(fd,&st)||st.st_size<2||st.st_size>16384)return 3;
 char *in=calloc(st.st_size+1,1);if(!in)return 4;size_t n=0;
 while(n<(size_t)st.st_size){ssize_t v=read(fd,in+n,st.st_size-n);if(v<=0)return 5;n+=v;}close(fd);
 void*h=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!h)return 6;
 void*(*parse)(const char*)=dlsym(h,"cJSON_Parse");
 int(*print)(void*,char*,int,int)=dlsym(h,"cJSON_PrintPreallocated");
 void(*del)(void*)=dlsym(h,"cJSON_Delete");if(!parse||!print||!del)return 7;
 void*j=parse(in);if(!j)return 8;char out[16384]={0};if(!print(j,out,sizeof(out),1))return 9;
 n=strnlen(out,sizeof(out));if(n==sizeof(out))return 10;
 fd=open(argv[3],O_CREAT|O_EXCL|O_WRONLY|O_NOFOLLOW,0600);if(fd<0)return 11;
 if(write(fd,out,n)!=(ssize_t)n)return 12;close(fd);del(j);free(in);return 0;
}
