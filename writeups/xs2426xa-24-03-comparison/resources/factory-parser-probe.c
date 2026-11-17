#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/socket.h>
static int denied(void){fputs("Blocked unexpected command/network operation\n",stderr);_exit(90);}
int system(const char*s){return denied();}
int _system(const char*s){return denied();}
FILE *popen(const char*s,const char*m){denied();return NULL;}
int socket(int a,int b,int c){return denied();}
int connect(int a,const struct sockaddr*b,socklen_t c){return denied();}
int execve(const char*a,char*const b[],char*const c[]){return denied();}
int main(int argc,char **argv){
 if(argc!=4)return 2;
 unsigned char record[8193]={0};FILE*in=fopen(argv[2],"rb");if(!in)return 3;size_t n=fread(record,1,8192,in);fclose(in);if(n!=8192)return 4;
 void*h=dlopen(argv[1],RTLD_NOW|RTLD_GLOBAL);if(!h){fputs(dlerror(),stderr);return 5;}
 void*(*init)(void)=dlsym(h,"SecBlockInit");int(*set)(void*,const char*)=dlsym(h,"SecSetSerializedStr");char*(*get)(void*,const char*)=dlsym(h,"SecGetData");void(*done)(void*)=dlsym(h,"SecBlockFree");if(!init||!set||!get||!done)return 6;
 void*ctx=init();if(!ctx||set(ctx,(char*)record))return 7;
 int fd=open(argv[3],O_WRONLY|O_CREAT|O_EXCL,0600);if(fd<0)return 8;FILE*out=fdopen(fd,"w");if(!out)return 9;
 const char*names[]={"EXT_WEB_PWD","EXT_WEB_MGNT_PWD","EXT_SSID1_PWD","EXT_SSID5_PWD","EXT_SSID9_PWD","EXT_ACS_PWD","EXT_MD5_VAR","EXT_SHA256_VAR","EXT_SHA256CUS_VAR","EXT_RANDOM_VAR",NULL};
 int count=0;fputs("{",out);
 for(int i=0;names[i];i++){char*v=get(ctx,names[i]);if(!v)continue;fprintf(out,"%s\"%s\":\"",count?",":"",names[i]);int j;for(j=0;v[j]&&j<4096;j++)fprintf(out,"%02x",(unsigned char)v[j]);if(j==4096)return 10;fputs("\"",out);count++;}
 fputs("}\n",out);fclose(out);done(ctx);printf("parsed_fields=%d; command/network operations blocked; output private\n",count);return 0;
}
