/* HOST QEMU FIXTURE ONLY. Replaces original PCD main before it can run.
 * Calls only original configuration/parser and dependency-predicate routines.
 * No supervisor loop, process start, recovery handler or IPC initialization. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <pwd.h>
__asm__(".symver dlsym,dlsym@GLIBC_2.17");
static int32_t word(void *p,size_t n){int32_t v;memcpy(&v,(char*)p+n,4);return v;}
static void setword(void *p,size_t n,int32_t v){memcpy((char*)p+n,&v,4);}
static int fixture_main(int argc,char **argv,char **env){
 (void)env;if(argc<2)return 61;
 int (*parse)(char*)=dlsym(RTLD_DEFAULT,"PCD_parser_parse");
 void *(*first)(void)=dlsym(RTLD_DEFAULT,"PCD_rulesdb_get_first");
 void *(*next)(void)=dlsym(RTLD_DEFAULT,"PCD_rulesdb_get_next");
 void *(*find)(void*)=dlsym(RTLD_DEFAULT,"PCD_rulesdb_get_rule_by_id");
 int (*ready)(void*)=dlsym(RTLD_DEFAULT,"PCD_start_cond_check_RULE_COMPLETED");
 if(!parse||!first||!next||!find||!ready)return 62;
 int rc=parse(argv[1]);unsigned count=0;
 printf("{\"kind\":\"parse\",\"status\":%d}\n",rc);
 for(void *p=first();p;p=next()){
  if(++count>200)return 63;
  printf("{\"kind\":\"rule\",\"group\":\"%.15s\",\"name\":\"%.15s\",\"timeout_ms\":%d,\"ping_ms\":%d,\"action1\":%d,\"action2\":%d,\"action_next\":%d,\"restart_limit\":%d,\"alive_period\":%d,\"failure_interval\":%d,\"failure_reset_count\":%d,\"daemon\":%d,\"uid\":%d,\"state\":%d}\n",(char*)p,(char*)p+16,word(p,396),word(p,400),word(p,432),word(p,468),word(p,504),word(p,540),word(p,544),word(p,548),word(p,552),word(p,572),word(p,576),word(p,580));
 }
 printf("{\"kind\":\"count\",\"rules\":%u}\n",count);
 if(argc>2 && !strcmp(argv[2],"predicates") && rc==0){
  char aid[32]={0},bid[32]={0},cid[32]={0};strcpy(aid,"test");strcpy(aid+16,"a");strcpy(bid,"test");strcpy(bid+16,"b");strcpy(cid,"test");strcpy(cid+16,"c");
  void *a=find(aid),*b=find(bid),*c=find(cid);if(!a||!b||!c)return 64;
  int sa[]={4,4,3,6},sb[]={1,4,4,4};
  for(unsigned i=0;i<4;i++){setword(a,580,sa[i]);setword(b,580,sb[i]);printf("{\"kind\":\"dependency\",\"a_state\":%d,\"b_state\":%d,\"result\":%d}\n",sa[i],sb[i],ready(c));}
 }
 return 0;
}
/* Route libc startup into fixture_main; original main is never invoked. */
int __libc_start_main(int(*unused)(int,char**,char**),int argc,char **argv,void(*init)(void),void(*fini)(void),void(*rtld)(void),void *end){
 (void)unused;int(*real)(int(*)(int,char**,char**),int,char**,void(*)(void),void(*)(void),void(*)(void),void*)=dlsym(RTLD_NEXT,"__libc_start_main");
 if(!real){_exit(65);}
 return real(fixture_main,argc,argv,init,fini,rtld,end);
}
/* These operations must never be reached; fail closed if the fixture strays. */
int system(const char *s){(void)s;_exit(80);}
pid_t fork(void){_exit(81);}
pid_t vfork(void){_exit(82);}
int execvp(const char *s,char *const a[]){(void)s;(void)a;_exit(83);}
int execve(const char *s,char *const a[],char *const b[]){(void)s;(void)a;(void)b;_exit(84);}
int reboot(int n){(void)n;_exit(85);}
int kill(pid_t p,int s){(void)p;(void)s;_exit(86);}
int socket(int a,int b,int c){(void)a;(void)b;(void)c;_exit(87);}
/* Optional USER lookup uses only the synthetic root fixture. Do not use host accounts. */
struct passwd *getpwnam(const char *n){static struct passwd p;if(strcmp(n,"root"))return NULL;memset(&p,0,sizeof p);p.pw_name="root";p.pw_uid=0;p.pw_gid=0;return &p;}
