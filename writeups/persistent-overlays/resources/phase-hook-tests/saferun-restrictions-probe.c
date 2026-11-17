#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
static int payloads, diagnostics;
int system(const char *cmd){
 if(!strncmp(cmd,"sh ",3))payloads++;else diagnostics++;
 printf("intercepted_system=%s\n",cmd);return 0;
}
int main(int argc,char**argv){
 if(argc<2)return 2;
 void*h=dlopen(argv[1],RTLD_NOW|RTLD_GLOBAL);if(!h){fprintf(stderr,"dlopen:%s\n",dlerror());return 3;}
 int(*f)(int,char**)=dlsym(h,"saferun_main");if(!f)return 4;
 int n=argc-1;char**a=calloc((size_t)n+1,sizeof(char*));if(!a)return 5;
 a[0]="saferun";for(int i=2;i<argc;i++)a[i-1]=argv[i];
 int result=f(n,a);printf("result=%d payload_calls=%d diagnostic_calls=%d\n",result,payloads,diagnostics);return 0;
}
