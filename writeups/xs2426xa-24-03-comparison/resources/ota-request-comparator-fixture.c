#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/socket.h>
int cfg_getObj(void *out,unsigned len,unsigned flags){
 puts("TEST_STOCK_OUTPUT_MUST_NOT_ESCAPE");
 if(len!=0x8c5||flags!=0x1000||*(uint32_t*)out!=599)return 99;
 if(getenv("PROBE_REMOTE_SOCKET"))socket(AF_INET,SOCK_STREAM,0);
 if(getenv("PROBE_FAILURE"))return 9002;
 int fd=open(getenv("PROBE_FIXTURE"),O_RDONLY);if(fd<0)return 98;ssize_t n=read(fd,out,len);close(fd);return n==(ssize_t)len?0:97;
}
