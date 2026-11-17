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
/* Read only ealgo/ckn metadata for the saved OTA API-key node. No daemon initialization, key lookup or field decryption. */
static void denied(void){_exit(90);}
int system(const char *s){denied();return -1;}
int _system(const char *s){denied();return -1;}
FILE *popen(const char *s,const char *m){denied();return NULL;}
int socket(int a,int b,int c){denied();return -1;}
int connect(int a,const struct sockaddr *b,socklen_t c){denied();return -1;}
int execve(const char *a,char *const b[],char *const c[]){denied();return -1;}
static const char *uris[]={"ealgo", "ckn"};
int main(int argc,char **argv){
 if(argc!=4)return 2;
 int fd=open(argv[2],O_RDONLY);struct stat st;if(fd<0||fstat(fd,&st)||st.st_size<48||st.st_size>32*1024*1024)return 3;
 size_t n=st.st_size;unsigned char *raw=malloc(n);if(!raw)return 4;
 size_t pos=0;while(pos<n){ssize_t v=read(fd,raw+pos,n-pos);if(v<=0)return 5;pos+=v;}close(fd);
 void *lib=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!lib){fprintf(stderr,"dlopen: %s\n",dlerror());return 6;}
 void *(*dbopen)(void*,unsigned int,void*)=dlsym(lib,"dm_db_open_memory");
 void *(*node)(void*,const char*)=dlsym(lib,"dm_db_get_node");
 int (*get)(void*,const char*,void*)=dlsym(lib,"dm_node_get_attr");
 void (*str)(const void*,char*,int)=dlsym(lib,"dm_value_to_string");
 void (*unset)(void*)=dlsym(lib,"dm_value_unset");void (*close_db)(void*)=dlsym(lib,"dm_db_close");
 if(!dbopen||!node||!get||!str||!unset||!close_db)return 7;
 void *db=dbopen(raw,n,NULL);if(!db)return 8;
 fd=open(argv[3],O_WRONLY|O_CREAT|O_EXCL,0600);if(fd<0)return 9;FILE *out=fdopen(fd,"w");if(!out)return 10;
 fputs("{\n",out);
 for(size_t i=0;i<sizeof(uris)/sizeof(*uris);++i){
  void *q=node(db,"InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Client_Auth_Key");uint64_t value[16]={0};char buf[4096]={0};int ok=0;
  if(q){ok=get(q,uris[i],value);if(ok)str(value,buf,sizeof(buf));}
  size_t size=strnlen(buf,sizeof(buf));if(size==sizeof(buf))return 11;
  fprintf(out,"%s\"%s\":{\"found\":%s,\"read_status\":%d,\"value_hex\":\"",i?",\n":"",uris[i],q?"true":"false",ok);
  for(size_t j=0;j<size;++j){fprintf(out,"%02x",(unsigned char)buf[j]);}fputs("\"}",out);
  if(q&&ok)unset(value);
 }
 fputs("\n}\n",out);fclose(out);close_db(db);dlclose(lib);free(raw);return 0;
}
