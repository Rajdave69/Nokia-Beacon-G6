/* Offline tests of hash-pinned G6 U-Boot slot selection.
 * env_get/env_set/env_save and printf are intercepted; reset-status MMIO is
 * mapped to anonymous RAM. No router, flash, hardware driver or U-Boot main.
 */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#define BASE 0x4000000UL
static const char *names[]={"sb_flag","boot_fail_count","bootfail0","bootfail1","active_part","standby_part"};
static char values[6][64];
static int saves,profile_first;
static int (*select_slot)(void);
static volatile uint32_t *reset_status;
static void fatal(const char *s){fputs(s,stderr);fputc('\n',stderr);exit(2);}
static size_t index_of(const char *s){
 for(size_t i=0;i<6;i++)if(!strcmp(s,names[i]))return i;
 fatal("Unexpected environment name");return 0;
}
static char *get_env(const char *name){return values[index_of(name)];}
static int set_text(const char *name,const char *value){
 size_t n=strlen(value);if(n>=sizeof(values[0]))fatal("Environment value too long");
 memcpy(values[index_of(name)],value,n+1);return 0;
}
static int set_num(const char *name,unsigned long value){
 snprintf(values[index_of(name)],sizeof(values[0]),"%lu",value);return 0;
}
static int save_env(void){saves++;return 0;}
static int discard_print(const char *fmt,...){(void)fmt;return 0;}
static void patch(uintptr_t address,void *fn){
 uint32_t op[2]={0x58000050U,0xd61f0200U};
 memcpy((void*)address,op,8);memcpy((void*)(address+8),&fn,8);
 __builtin___clear_cache((char*)address,(char*)(address+16));
}
static void init(unsigned flags,unsigned failures,unsigned reset_bit){
 for(size_t i=0;i<6;i++)strcpy(values[i],"0");
 set_num("sb_flag",flags);set_num("boot_fail_count",failures);
 *reset_status=reset_bit;saves=0;
}
static int step(const char *label,int active,int flags){
 int rc=select_slot();
 char want_active[16],want_flags[16];
 snprintf(want_active,sizeof(want_active),"%d",active);
 snprintf(want_flags,sizeof(want_flags),"%d",flags);
 int ok=rc==0 && !strcmp(get_env("active_part"),want_active) && !strcmp(get_env("sb_flag"),want_flags) && saves>0;
 printf("case=%s active=%s sb_flag=%s failures=%s saved=%d pass=%s\n",label,get_env("active_part"),get_env("sb_flag"),get_env("boot_fail_count"),saves,ok?"true":"false");
 return !ok;
}
int main(int argc,char **argv){
 if(argc!=3)fatal("usage: probe LIBSEC BL33");
 void *lib=dlopen(argv[1],RTLD_NOW|RTLD_GLOBAL);if(!lib)fatal("Cannot load stock crypto library");
 unsigned char *(*sha)(const unsigned char*,size_t,unsigned char*)=dlsym(lib,"SHA256");if(!sha)fatal("No SHA API");
 FILE *f=fopen(argv[2],"rb");if(!f)fatal("Cannot open BL33");
 if(fseek(f,0,SEEK_END))fatal("Cannot seek BL33");
 long n=ftell(f);if(n<=0 || n>0x100000)fatal("Invalid BL33 length");rewind(f);
 unsigned char *raw=malloc((size_t)n);if(!raw)fatal("No memory");
 if(fread(raw,1,(size_t)n,f)!=(size_t)n)fatal("Short read");
 fclose(f);unsigned char digest[32];char hex[65];sha(raw,(size_t)n,digest);
 for(int i=0;i<32;i++)snprintf(hex+2*i,3,"%02x",digest[i]);
 uintptr_t entry,envget,envnum,envtext,envsave,print;
 if(!strcmp(hex,"1d7ea6b9285f895acaa8f030375b8184428e400d07ee2925b0c4eea51aa2a190")){
  profile_first=1;entry=0x400307c;envget=0x4012644;envnum=0x4012240;envtext=0x40121e8;envsave=0x404869c;print=0x4077bc0;
 }else if(!strcmp(hex,"08e49885442d61a7b3b356421b6fcd9572aec290c15e04c56494d23b191181e1")){
  profile_first=0;entry=0x400304c;envget=0x40125e4;envnum=0x40121e0;envtext=0x4012188;envsave=0x404845c;print=0x4077980;
 }else fatal("Unrecognized BL33 hash");
 void *mapped=mmap((void*)BASE,0x100000,PROT_READ|PROT_WRITE|PROT_EXEC,MAP_PRIVATE|MAP_ANONYMOUS|MAP_FIXED_NOREPLACE,-1,0);
 if(mapped==MAP_FAILED || mapped!=(void*)BASE)fatal("Cannot reserve linked address");
 memcpy(mapped,raw,(size_t)n);free(raw);
 void *reset_page=mmap((void*)0xf4320000UL,0x1000,PROT_READ|PROT_WRITE,MAP_PRIVATE|MAP_ANONYMOUS|MAP_FIXED_NOREPLACE,-1,0);
 if(reset_page==MAP_FAILED || reset_page!=(void*)0xf4320000UL)fatal("Cannot map synthetic reset page");
 reset_status=(void*)0xf4320114UL;
 patch(envget,get_env);patch(envnum,set_num);patch(envtext,set_text);patch(envsave,save_env);patch(print,discard_print);
 select_slot=(void*)entry;int failed=0;
 init(0x27,0,1);failed+=step("committed-slot0",0,0x23);
 init(0x72,0,1);failed+=step("committed-slot1",1,0x32);
 init(0x63,0,1);failed+=step("activate-slot0-first-boot",0,0xa3);
 failed+=step("slot0-uncommitted-next-boot",1,0xb2);
 init(0x27,0,1);failed+=step("slot0-simulated-commit-stays",0,0x23);
 init(0x36,0,1);failed+=step("activate-slot1-first-boot",1,0x3a);
 failed+=step("slot1-uncommitted-next-boot",0,0x2b);
 init(0x72,0,1);failed+=step("slot1-simulated-commit-stays",1,0x32);
 init(0x23,7,0);failed+=step("retry7-reset-bit0",profile_first?0:1,profile_first?0x23:0x32);
 init(0x23,7,1);failed+=step("retry7-reset-bit1",1,0x32);
 munmap(reset_page,0x1000);munmap(mapped,0x100000);dlclose(lib);
 return failed?1:0;
}
