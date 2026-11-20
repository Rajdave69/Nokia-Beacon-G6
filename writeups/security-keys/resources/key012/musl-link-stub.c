/* Link-time symbol declarations only for sectionless musl ELF.
 * The probe runtime must load the original firmware libc.so, never this file. */
void *stderr;
long _exit(void){return 0;}
long fclose(void){return 0;}
long fopen(void){return 0;}
long fread(void){return 0;}
long dlopen(void){return 0;}
long dlerror(void){return 0;}
long dlsym(void){return 0;}
long printf(void){return 0;}
long puts(void){return 0;}
long snprintf(void){return 0;}
long memcmp(void){return 0;}
long __libc_start_main(void){return 0;}
long fprintf(void){return 0;}
