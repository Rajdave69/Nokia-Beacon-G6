/* Restore only the mutable WebUI password from its existing preset verifier.
 * Default --check reads only; --restore performs the persistent configuration write.
 * No hash is printed. cfgcli briefly receives the hash in argv; run as root.
 */
#define _POSIX_C_SOURCE 200809L
#include <dlfcn.h>
#include <fcntl.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#ifndef CFG_LIBRARY
#define CFG_LIBRARY "/usr/lib/libcfg.so"
#endif
#ifndef CFGCLI
#define CFGCLI "/usr/bin/cfgcli"
#endif
#define CURRENT "InternetGatewayDevice.X_Authentication.WebAccount.Password"
#define PRESET "InternetGatewayDevice.X_Authentication.WebAccount.PresetPassword"
typedef int (*get_fn)(const char *, char *);
static char preset[4096], current[4096], after[4096], preset_after[4096];
static void erase(void *p, size_t n) { volatile unsigned char *v=p; while(n--) *v++=0; }
static int hash_char(char c) {
    return (c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='.'||c=='/';
}
static int valid_hash(const char *s) {
    size_t n=strnlen(s,4096), salt=0, digest=0, salt_max, digest_len;
    const char *p;
    if(n>63 || n<4 || s[0]!='$' || s[2]!='$') return 0;
    if(s[1]=='5') { salt_max=16; digest_len=43; }
    else if(s[1]=='1') { salt_max=8; digest_len=22; }
    else return 0;
    p=s+3;
    while(*p && *p!='$') { if(!hash_char(*p++)) return 0; salt++; }
    if(*p++!='$' || !salt || salt>salt_max) return 0;
    while(*p) { if(!hash_char(*p++)) return 0; digest++; }
    return digest==digest_len;
}
static int quiet_get(get_fn get, const char *uri, char *out) {
    int saved_out, saved_err, nullfd, rc;
    memset(out,0,4096);
    fflush(NULL);
    saved_out=dup(1); saved_err=dup(2); nullfd=open("/dev/null",O_WRONLY);
    if(saved_out<0 || saved_err<0 || nullfd<0) {
        if(saved_out>=0) close(saved_out);
        if(saved_err>=0) close(saved_err);
        if(nullfd>=0) close(nullfd);
        return -1;
    }
    if(dup2(nullfd,1)<0 || dup2(nullfd,2)<0) {
        dup2(saved_out,1); dup2(saved_err,2);
        close(saved_out); close(saved_err); close(nullfd); return -1;
    }
    rc=get(uri,out);
    fflush(NULL);
    dup2(saved_out,1); dup2(saved_err,2);
    close(saved_out); close(saved_err); close(nullfd);
    out[4095]=0;
    return rc;
}
static int set_preset(void) {
    pid_t child=fork(); int status;
    if(child<0) return -1;
    if(child==0) {
        int fd=open("/dev/null",O_WRONLY);
        char *args[]={CFGCLI,"--no-rts","--save-flash-now","-f","-s",CURRENT,preset,NULL};
        if(fd<0 || dup2(fd,1)<0 || dup2(fd,2)<0) _exit(126);
        close(fd);
        execv(CFGCLI,args);
        _exit(127);
    }
    while(waitpid(child,&status,0)<0) {
        /* Only an interrupted wait can be retried. */
        if(errno!=EINTR) return -1;
    }
    return WIFEXITED(status)?WEXITSTATUS(status):128+WTERMSIG(status);
}
int main(int argc,char **argv) {
    int restore=0, rc=1, status;
    void *lib; get_fn get;
    if(argc==2 && !strcmp(argv[1],"--restore")) restore=1;
    else if(argc>2 || (argc==2 && strcmp(argv[1],"--check"))) {
        fprintf(stderr,"Usage: %s [--check|--restore]\n",argv[0]); return 2;
    }
    if(geteuid()!=0) { fputs("Root is required.\n",stderr); return 2; }
    lib=dlopen(CFG_LIBRARY,RTLD_NOW|RTLD_LOCAL);
    if(!lib) { fputs("Cannot load the stock configuration library.\n",stderr); return 3; }
    get=(get_fn)dlsym(lib,"cfg_GetParamValueByUri");
    if(!get) { fputs("Raw configuration getter is unavailable.\n",stderr); goto done; }
    status=quiet_get(get,PRESET,preset);
    if(status || !valid_hash(preset)) {
        fprintf(stderr,"Preset is unavailable or not a supported crypt verifier (getter status=%d); no write.\n",status); goto done;
    }
    status=quiet_get(get,CURRENT,current);
    if(status || !valid_hash(current)) {
        fprintf(stderr,"Current value is unavailable or not a supported crypt verifier (getter status=%d); no write.\n",status); goto done;
    }
    if(!strcmp(current,preset)) {
        puts("WebUI password already matches the preset; no write."); rc=0; goto done;
    }
    if(!restore) {
        puts("Preset verifier is available; WebUI password differs. No write (--check)."); rc=0; goto done;
    }
    status=set_preset();
    if(status!=0) {
        fprintf(stderr,"Restore command failed (status=%d). Keep this shell open; configuration state requires checking.\n",status); goto done;
    }
    if(quiet_get(get,CURRENT,after) || quiet_get(get,PRESET,preset_after) ||
       strcmp(after,preset) || strcmp(preset_after,preset)) {
        fputs("Restore readback failed or preset changed concurrently. Keep this shell open; configuration may have changed.\n",stderr); goto done;
    }
    puts("WebUI password restored to the preset verifier; immediate flash save requested and live readback matches.");
    rc=0;
done:
    erase(preset,sizeof(preset)); erase(current,sizeof(current));
    erase(after,sizeof(after)); erase(preset_after,sizeof(preset_after));
    dlclose(lib);
    return rc;
}
