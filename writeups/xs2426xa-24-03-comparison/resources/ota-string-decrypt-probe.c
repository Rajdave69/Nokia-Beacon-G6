#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <stdarg.h>
/* Isolated string-crypto call with explicit private key bytes. No SE database initialization, configuration daemon or network access. */
static void denied(void){_exit(90);}
int system(const char *s){denied();return -1;}
int _system(const char *s){denied();return -1;}
FILE *popen(const char *s,const char *m){denied();return NULL;}
int socket(int a,int b,int c){denied();return -1;}
int connect(int a,const struct sockaddr *b,socklen_t c){denied();return -1;}
int execve(const char *a,char *const b[],char *const c[]){denied();return -1;}
int main(int argc,char **argv){
 if(argc!=5)return 2;
 char key[256]={0}; FILE *keys=fopen(argv[4],"rb"); if(!keys)return 12; size_t key_n=fread(key,1,sizeof(key)-1,keys); fclose(keys); if(!key_n || key_n>=sizeof(key)-1)return 13;
 int fd=open(argv[2],O_RDONLY);struct stat st;if(fd<0||fstat(fd,&st)||st.st_size<1||st.st_size>32*1024*1024)return 3;
 size_t n=st.st_size;unsigned char *raw=malloc(n);if(!raw)return 4;
 size_t pos=0;while(pos<n){ssize_t v=read(fd,raw+pos,n-pos);if(v<=0)return 5;pos+=v;}close(fd);
 void *lib=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!lib){fprintf(stderr,"dlopen: %s\n",dlerror());return 6;}

 int (*crypt_fn)(int,const char*,const char*,int,char**)=dlsym(lib,"SE_encStr2StrEx"); if(!crypt_fn)return 7;
 char *input=calloc(n+1,1),*output=NULL;memcpy(input,raw,n);
 int status=crypt_fn(0,input,key,key_n,&output); fprintf(stderr,"SE_encStr2StrEx_status=%d\n",status); if(status || !output)return 8;
 size_t size=strnlen(output,4096);if(size==4096)return 11;
 fd=open(argv[3],O_WRONLY|O_CREAT|O_EXCL,0600);if(fd<0)return 9;
 if(write(fd,output,size)!=(ssize_t)size){return 10;}
 close(fd);free(input);free(raw);dlclose(lib);return 0;
}
