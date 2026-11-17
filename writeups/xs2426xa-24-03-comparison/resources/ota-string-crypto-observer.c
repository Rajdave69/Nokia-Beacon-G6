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
/* Explicit action 0=decrypt / 1=encrypt. Isolated string-crypto call with explicit private key bytes. No SE database initialization, configuration daemon or network access. */
static char probe_key[256]; static size_t probe_key_n; static unsigned char probe_material[48],probe_salt[8]; static int probe_salt_set;
int PKCS5_PBKDF2_HMAC(const char *pass,int passlen,const unsigned char *salt,int saltlen,int iter,const void *md,int keylen,unsigned char *out){
 void *h=dlopen("libcrypto.so.3",RTLD_NOW|RTLD_LOCAL);if(!h)_exit(92);
 int (*real_fn)(const char*,int,const unsigned char*,int,int,const void*,int,unsigned char*)=dlsym(h,"PKCS5_PBKDF2_HMAC");
 const char *(*name_fn)(const void*)=dlsym(h,"EVP_MD_get0_name");if(!real_fn||!name_fn)_exit(93);
 fprintf(stderr,"KDF_META passbytes=%d matches_key=%d saltbytes=%d rounds=%d outputbytes=%d digest=%s\n",passlen,(passlen==(int)probe_key_n&&!memcmp(pass,probe_key,probe_key_n)),saltlen,iter,keylen,name_fn(md));
 fprintf(stderr,"KDF_SALT matches_header=%d\n",probe_salt_set?(saltlen==8&&!memcmp(salt,probe_salt,8)):-1); int r=real_fn(pass,passlen,salt,saltlen,iter,md,keylen,out); if(r&&keylen==48)memcpy(probe_material,out,48); return r;
}
int EVP_CipherInit_ex(void *ctx,const void *type,void *impl,const unsigned char *key,const unsigned char *iv,int enc){
 void *h=dlopen("libcrypto.so.3",RTLD_NOW|RTLD_LOCAL);if(!h)_exit(92);
 int (*real_fn)(void*,const void*,void*,const unsigned char*,const unsigned char*,int)=dlsym(h,"EVP_CipherInit_ex");
 const char *(*name_fn)(const void*)=dlsym(h,"EVP_CIPHER_get0_name");if(!real_fn||!name_fn)_exit(93);
 fprintf(stderr,"CIPHER_META name=%s enc=%d key_matches_material=%d iv_matches_material=%d\n",type?name_fn(type):"previous",enc,key?!memcmp(key,probe_material,32):-1,iv?!memcmp(iv,probe_material+32,16):-1);
 return real_fn(ctx,type,impl,key,iv,enc);
}
static void denied(void){_exit(90);}
int system(const char *s){denied();return -1;}
int _system(const char *s){denied();return -1;}
FILE *popen(const char *s,const char *m){denied();return NULL;}
int socket(int a,int b,int c){denied();return -1;}
int connect(int a,const struct sockaddr *b,socklen_t c){denied();return -1;}
int execve(const char *a,char *const b[],char *const c[]){denied();return -1;}
int main(int argc,char **argv){
 if(argc!=6 || (strcmp(argv[5],"0") && strcmp(argv[5],"1")))return 2;
 char *key=probe_key; FILE *keys=fopen(argv[4],"rb"); if(!keys)return 12; size_t key_n=fread(key,1,sizeof(probe_key)-1,keys); fclose(keys); probe_key_n=key_n; if(!key_n || key_n>=sizeof(probe_key)-1)return 13;
 int fd=open(argv[2],O_RDONLY);struct stat st;if(fd<0||fstat(fd,&st)||st.st_size<1||st.st_size>32*1024*1024)return 3;
 size_t n=st.st_size;unsigned char *raw=malloc(n);if(!raw)return 4;
 size_t pos=0;while(pos<n){ssize_t v=read(fd,raw+pos,n-pos);if(v<=0)return 5;pos+=v;}close(fd);
 void *lib=dlopen(argv[1],RTLD_NOW|RTLD_LOCAL);if(!lib){fprintf(stderr,"dlopen: %s\n",dlerror());return 6;}

 int (*crypt_fn)(int,const char*,const char*,int,char**)=dlsym(lib,"SE_encStr2StrEx"); if(!crypt_fn)return 7;
 char *input=calloc(n+1,1),*output=NULL;memcpy(input,raw,n);
 if(argv[5][0]=='0'){
 void *h=dlopen("libcrypto.so.3",RTLD_NOW|RTLD_LOCAL); int (*dec)(unsigned char*,const unsigned char*,int)=dlsym(h,"EVP_DecodeBlock"); unsigned char *v=malloc(n+1); if(dec&&dec(v,(const unsigned char*)input,n)>=9){memcpy(probe_salt,v+1,8);probe_salt_set=1;}free(v);}
 int status=crypt_fn(argv[5][0]-'0',input,key,key_n,&output); fprintf(stderr,"SE_encStr2StrEx_status=%d\n",status); if(status || !output)return 8;
 size_t size=strnlen(output,4096);if(size==4096)return 11;
 fd=open(argv[3],O_WRONLY|O_CREAT|O_EXCL,0600);if(fd<0)return 9;
 if(write(fd,output,size)!=(ssize_t)size){return 10;}
 close(fd);free(input);free(raw);dlclose(lib);return 0;
}
