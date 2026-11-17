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
/* Isolated legacy CS_crypt type-2 experiment; returned status24 on this saved credential.
 * Not a working credential decoder. No configuration daemon initialization. */
static char static_keys[3][256];
int SE_getKeyByName(const char *name,char **out){fprintf(stderr,"key_lookup=%s\n",name);*out=NULL;if(strlen(name)==4 && !strncmp(name,"key",3) && name[3]>='0' && name[3]<='2'){*out=static_keys[name[3]-'0'];return 0;}return 608;}
static void denied(void){_exit(90);}
int system(const char *s){denied();return -1;}
int _system(const char *s){denied();return -1;}
FILE *popen(const char *s,const char *m){denied();return NULL;}
int socket(int a,int b,int c){denied();return -1;}
int connect(int a,const struct sockaddr *b,socklen_t c){denied();return -1;}
int execve(const char *a,char *const b[],char *const c[]){denied();return -1;}
int main(int argc,char **argv){
 if(argc!=5)return 2;
 FILE *keys=fopen(argv[4],"r");if(!keys)return 12;for(int k=0;k<3;k++){if(!fgets(static_keys[k],256,keys))return 13;static_keys[k][strcspn(static_keys[k],"\r\n")]=0;}fclose(keys);
 int fd=open(argv[2],O_RDONLY);struct stat st;if(fd<0||fstat(fd,&st)||st.st_size<1||st.st_size>32*1024*1024)return 3;
 size_t n=st.st_size;unsigned char *raw=malloc(n);if(!raw)return 4;
 size_t pos=0;while(pos<n){ssize_t v=read(fd,raw+pos,n-pos);if(v<=0)return 5;pos+=v;}close(fd);
 void *lib=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!lib){fprintf(stderr,"dlopen: %s\n",dlerror());return 6;}

 struct crypt_input {uint32_t type,action;const char *in;uint32_t in_bytes,pad1;char *out;uint32_t out_bytes,pad2;uint64_t extra[2];};
 int (*crypt_fn)(void*)=dlsym(lib,"CS_crypt");if(!crypt_fn)return 7;
 char *input=calloc(n+1,1),output[4096]={0};memcpy(input,raw,n);
 struct crypt_input c={.type=2,.action=0,.in=input,.in_bytes=n,.out=output,.out_bytes=sizeof(output)};
 int status=crypt_fn(&c);fprintf(stderr,"CS_crypt_status=%d\n",status);if(status)return 8;
 size_t size=strnlen(output,sizeof(output));if(size==sizeof(output))return 11;
 fd=open(argv[3],O_WRONLY|O_CREAT|O_EXCL,0600);if(fd<0)return 9;
 if(write(fd,output,size)!=(ssize_t)size){return 10;}
 close(fd);free(input);free(raw);dlclose(lib);return 0;
}
