/* Host QEMU probe only. Synthetic input/output comparisons; no SE initialization.
 * Process-launch and socket entry points abort. Prints no key bytes. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#ifndef KEYPROBE_MUSL
__asm__(".symver dlopen,dlopen@GLIBC_2.17");
__asm__(".symver dlsym,dlsym@GLIBC_2.17");
__asm__(".symver dlerror,dlerror@GLIBC_2.17");
__asm__(".symver __libc_start_main,__libc_start_main@GLIBC_2.17");
#endif
__asm__(".global _start\n_start:\nmov x29,0\nmov x30,0\nmov x5,x0\nldr x1,[sp]\nadd x2,sp,8\nmov x6,sp\nadrp x0,main\nadd x0,x0,:lo12:main\nmov x3,0\nmov x4,0\nbl __libc_start_main\nbrk 0\n");
int system(const char*s){_exit(90);} FILE*popen(const char*a,const char*b){_exit(90);}int socket(int a,int b,int c){_exit(90);}int connect(int a,const struct sockaddr*b,socklen_t c){_exit(90);}int execve(const char*a,char*const b[],char*const c[]){_exit(90);}
struct cryptop {int alg,mode;const void*input;int inputlen;int pad0;void*output;int outputcapacity,outputlen;const void*key;const void*iv;};
int main(int argc,char**argv){
 if(argc!=3)return 2;unsigned char expected[120]={0};FILE*f=fopen(argv[2],"rb");if(!f||fread(expected,1,120,f)!=120)return 3;fclose(f);
 void*h=dlopen(argv[1],RTLD_LAZY|RTLD_LOCAL);if(!h){fprintf(stderr,"dlopen: %s\n",dlerror());return 4;}
 int(*crypt)(void*)=dlsym(h,"CS_crypt");int(*hash)(const void*,int,const void*,int,void*)=dlsym(h,"CS_getSha256Str");int(*get)(const char*,void**)=dlsym(h,"SE_getKeyByName");if(!crypt||!hash||!get)return 5;
 char out[96]={0},sha[96]={0};const char input[]="key-role-probe";
 struct cryptop c={.alg=1,.mode=1,.input=input,.inputlen=sizeof(input)-1,.output=out,.outputcapacity=sizeof(out)};
 int a=crypt(&c);int b=hash(input,sizeof(input)-1,NULL,0,sha);
 printf("{\"cbc_status\":%d,\"cbc_bytes\":%d,\"cbc_matches_key0_key1\":%s,\"hash_status\":%d,\"hash_matches_key2_suffix\":%s",a,c.outputlen,(!a&&c.outputlen==16&&!memcmp(out,expected,16))?"true":"false",b,(!b&&!memcmp(sha,expected+32,44))?"true":"false");
 unsigned char customkey[32],customiv[16];memset(customkey,0x11,32);memset(customiv,0x22,16);memset(out,0,sizeof(out));c.key=customkey;c.iv=customiv;c.outputlen=0;int ca=crypt(&c);memset(sha,0,sizeof(sha));int cb=hash(input,sizeof(input)-1,"extra",5,sha);printf(",\"explicit_cbc_matches\":%s,\"explicit_hash_matches\":%s",(!ca&&c.outputlen==16&&!memcmp(out,expected+16,16))?"true":"false",(!cb&&!memcmp(sha,expected+76,44))?"true":"false");
 for(int i=0;i<3;i++){char name[8];snprintf(name,sizeof(name),"key%d",i);void*value=NULL;int rc=get(name,&value);printf(",\"key%d_lookup_status\":%d",i,rc);}
 puts("}");return 0;
}