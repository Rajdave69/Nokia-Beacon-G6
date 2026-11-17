#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
static int launches, payloads, diagnostics;
int system(const char *cmd) { launches++; if(cmd[0]=='s' && cmd[1]=='h' && cmd[2]==' ')payloads++;else diagnostics++; printf("intercepted_system=%s\n",cmd); return 0; }
int main(int argc,char **argv){
 if(argc!=3)return 2;
 void*h=dlopen(argv[1],RTLD_NOW|RTLD_GLOBAL);if(!h){fprintf(stderr,"dlopen: %s\n",dlerror());return 3;}
 int(*saferun)(int,char**)=dlsym(h,"saferun_main");if(!saferun)return 4;
 char*args[]={"saferun",argv[2],NULL};int status=saferun(2,args);
 printf("result=%d payload_calls=%d diagnostic_calls=%d\n",status,payloads,diagnostics);return 0;
}
