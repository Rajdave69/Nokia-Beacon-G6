/* Read-only G6 key/account comparison. No SE_Init, sedb creation, account
 * installation, configuration write, shell execution, or key values in output.
 * Baselines refer to G6-A's previously authenticated runtime capture.
 */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
static const struct { const char *name, *digest; } baselines[] = {
    {"key7_2", "487681c9fea400d051331117b276d514d6b58b940cf6216c7da0c8c10079201d"},
    {"key9", "5f1ef9b360df01aa80ae53acbc9bd8fc8fdb0de273c2274f2e2c8dde4822e786"},
    {"key10", "9e69a7b03818b8005353d641a56773abec667072b25d300a28b56f4444edc089"},
    {"key14", "f2e17da540c0bf62b9915f7245d320e52fcaa993b0d38c26f0939b82c4fe55b8"},
    {"key17", "98e338831de376baa38965ac5bd540b84bbc79e14aa22b318579dc2b70a8d34a"},
    {"key18", ""}
};
static const char *boolean(int value) { return value < 0 ? "null" : value ? "true" : "false"; }
static FILE *input_file(const char *path) {
#ifdef BEACON_DIAGNOSTIC_FIXTURES
    char full[4096];
    int n=snprintf(full,sizeof(full),"%s%s",BEACON_DIAGNOSTIC_FIXTURES,path);
    if(n<0 || (size_t)n>=sizeof(full))return NULL;
    return fopen(full,"r");
#else
    return fopen(path,"r");
#endif
}
static int shadow(const char *path,const char *user,char *out,size_t capacity) {
    FILE *f=input_file(path);if(!f)return -1;
    char line[4096];size_t u=strlen(user);int result=0;
    while(fgets(line,sizeof(line),f)) {
        if(strncmp(line,user,u) || line[u]!=':')continue;
        char *hash=line+u+1,*end=strchr(hash,':');
        if(!end) {result=-1;break;}*end='\0';
        if(strlen(hash)>=capacity) {result=-1;break;}
        strcpy(out,hash);result=1;break;
    }
    if(ferror(f))result=-1;
    fclose(f);return result;
}
static int decimal(const unsigned char *p,size_t n) {
    int v=0;for(size_t i=0;i<n;i++){if(p[i]<'0'||p[i]>'9')return -1;v=v*10+p[i]-'0';}return v;
}
static int inspect_factory(const unsigned char *data,size_t size,int *fields,int *fw,int *dbg,char *mgnt,size_t capacity) {
    size_t pos=0;*fields=0;*fw=*dbg=0;mgnt[0]=0;
    while(pos<size && data[pos]) {
        if(size-pos<10 || memcmp(data+pos,"KV",2))return -1;
        int flag=decimal(data+pos+3,1),kl=decimal(data+pos+4,2),vl=decimal(data+pos+6,4);
        if(flag<0 || kl<=0 || vl<0 || (size_t)(10+kl+vl)>size-pos)return -1;
        const unsigned char *k=data+pos+10,*v=k+kl;
        if(kl==10 && !memcmp(k,"EXT_KEY_FW",10))*fw=1;
        if(kl==11 && !memcmp(k,"EXT_DBG_PWD",11))*dbg=1;
        if(kl==16 && !memcmp(k,"EXT_WEB_MGNT_PWD",16) && flag==0 && (size_t)vl<capacity){memcpy(mgnt,v,vl);mgnt[vl]=0;}
        pos+=(size_t)(10+kl+vl);(*fields)++;
    }
    return pos<size && *fields ? 0 : -1;
}
int main(int argc,char **argv) {
    (void)argv;if(argc!=1)return 2;
    void *se=dlopen("libsec_engine.so",RTLD_NOW|RTLD_GLOBAL);
    if(!se){fputs("Cannot load stock security library.\n",stderr);return 1;}
    int (*get)(const char*,char**)=dlsym(se,"SE_getKeyByName");
    unsigned char *(*sha)(const unsigned char*,size_t,unsigned char*)=dlsym(se,"SHA256");
    if(!get || !sha){fputs("Required read/crypto API unavailable.\n",stderr);return 1;}
    puts("{\n  \"keys\": {");
    for(size_t i=0;i<sizeof(baselines)/sizeof(baselines[0]);i++) {
        char *value=NULL;int status=get(baselines[i].name,&value);size_t n=0;int match=-1;
        if(!status && value){n=strnlen(value,16384);if(n==16384){fputs("Unexpected key length.\n",stderr);return 1;}}
        if(!status && value && baselines[i].digest[0]) {
            unsigned char digest[32];char hex[65];sha((const unsigned char*)value,n,digest);
            for(int j=0;j<32;j++)snprintf(hex+2*j,3,"%02x",digest[j]);
            match=!strcmp(hex,baselines[i].digest);
        }
        printf("    \"%s\": {\"status\": %d, \"bytes\": %zu, \"matches_first_capture\": %s}%s\n",baselines[i].name,status,n,boolean(match),i+1==sizeof(baselines)/sizeof(baselines[0])?"":",");
    }
    puts("  },");
    void *ext=dlopen("libextfs.so",RTLD_NOW|RTLD_GLOBAL);
    int (*read_record)(const char*,char*,int)=ext?dlsym(ext,"extfs_get"):NULL;
    unsigned char data[8193]={0};char factory_mgnt[1024]={0};int fields=0,fw=0,dbg=0;
    int rs=read_record?read_record("SECURITY",(char*)data,8192):-1;
    int ps=rs?-1:inspect_factory(data,8192,&fields,&fw,&dbg,factory_mgnt,sizeof(factory_mgnt));
    char root[1024]={0},rom_root[1024]={0},su[1024]={0},ont[1024]={0};
    int rr=shadow("/etc/shadow","root",root,sizeof(root));
    int rt=shadow("/usr/etc/shadow","root",rom_root,sizeof(rom_root));
    int sr=shadow("/etc/shadow","superadmin",su,sizeof(su));
    int or=shadow("/etc/shadow","ONTUSER",ont,sizeof(ont));
    int rm=rr==1 && rt==1 ? !strcmp(root,rom_root):-1;
    int sm=sr==1 && !ps && factory_mgnt[0] ? !strcmp(su,factory_mgnt):-1;
    void *dm=dlopen("libdm_utility.so",RTLD_LAZY|RTLD_GLOBAL);
    int (*generate)(char*,int)=dm?dlsym(dm,"dmUtl_GenDebugUserPass"):NULL;
    void *cryptlib=dlopen("libcrypt.so.1",RTLD_NOW);
    char *(*crypt_hash)(const char*,const char*)=cryptlib?dlsym(cryptlib,"crypt"):NULL;
    char generated[128]={0};int gs=-1,om=-1;
    if(or==1 && generate && crypt_hash && ont[0]=='$') {
        gs=generate(generated,sizeof(generated));
        if(!gs){char *computed=crypt_hash(generated,ont);if(computed)om=!strcmp(computed,ont);}
    }
    memset(generated,0,sizeof(generated));
    printf("  \"factory_read_status\": %d,\n  \"factory_parse_status\": %d,\n  \"factory_fields\": %d,\n",rs,ps,fields);
    printf("  \"factory_EXT_KEY_FW_present\": %s,\n  \"factory_EXT_DBG_PWD_present\": %s,\n",boolean(ps?-1:fw),boolean(ps?-1:dbg));
    printf("  \"root_matches_rom_template\": %s,\n  \"superadmin_matches_factory_EXT_WEB_MGNT_PWD\": %s,\n",boolean(rm),boolean(sm));
    printf("  \"ONTUSER_present_in_shadow\": %s,\n  \"ONTUSER_generator_status\": %d,\n  \"ONTUSER_matches_current_build_generator\": %s\n}\n",boolean(or<0?-1:or),gs,boolean(om));
    return 0;
}
