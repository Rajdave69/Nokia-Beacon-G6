/* OFFLINE ONLY. Exact vendor SDK under qemu-user; all device IO intercepted. */
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdarg.h>
__asm__(".symver dlopen,dlopen@GLIBC_2.17");
__asm__(".symver dlsym,dlsym@GLIBC_2.17");
__asm__(".symver dlerror,dlerror@GLIBC_2.17");
extern int compat_start(int (*)(int,char **,char **),int,char **,void (*)(void),void (*)(void),void (*)(void),void *);
__asm__(".symver compat_start,__libc_start_main@GLIBC_2.17");
int __wrap___libc_start_main(int (*f)(int,char **,char **),int n,char **v,void (*a)(void),void (*b)(void),void (*c)(void),void *s){return compat_start(f,n,v,a,b,c,s);}
static int reply,seen,opened,closed,transport_called;
static uint16_t opcode,length;
static uint8_t request[8192];
int ca_sdk_ioctl(uint16_t dev,void *msg){
 if(!msg||dev)exit(20);uint16_t *h=msg;if(h[1]+4>sizeof request)exit(21);
 opcode=h[0];length=h[1];memcpy(request,msg,length+4);seen++;
 memset((uint8_t*)msg+4,0xc3,length);return reply;
}
int open(const char *p,int flags,...){if(strcmp(p,"/dev/ca-sdk-dev")||flags!=2)exit(22);opened++;return 123;}
int close(int fd){if(fd!=123)exit(23);closed++;return 0;}
int ioctl(int fd,unsigned long req,...){if(fd!=123||req!=0)exit(24);va_list ap;va_start(ap,req);void *p=va_arg(ap,void*);va_end(ap);(void)p;transport_called++;return 0;}
struct testcase {const char *name;int kind;};
static struct testcase cases[]={
 {"ca_eth_port_link_status_get",0},{"ca_eth_port_speed_get",0},{"ca_eth_port_duplex_get",0},
 {"ca_eth_port_autoneg_get",0},{"ca_eth_port_phy_autoneg_get",0},{"ca_eth_port_link_scan_get",0},
 {"ca_eth_port_phy_enable_get",0},{"ca_eth_port_phy_speed_get",0},{"ca_eth_port_phy_duplex_get",0},
 {"ca_eth_port_phy_advert_get",0},{"ca_eth_port_eee_enable_get",0},{"ca_eth_port_phy_eee_enable_get",0},
 {"ca_eth_port_pause_quanta_get",0},{"ca_eth_port_stats_get",1},{"ca_eth_port_stats_get_ex",1},
 {"ca_port_enable_get",0},{"ca_port_pvid_vlan_get",0},{"ca_port_pvid_tpid_get",0},{"ca_port_pvid_dot1p_get",0},
 {"ca_l2_vlan_port_control_get",0},{"ca_port_discard_control_get",0},{"ca_port_tx_traffic_block_get",0},
 {"ca_port_redirect_get",0},{"ca_port_station_move_get",0},{"ca_port_stp_state_get",0},
 {"ca_port_shaper_get",0},{"ca_port_policer_get",0},{"ca_port_special_packet_profile_get",0},
 {"ca_queue_enable_get",2},{"ca_queue_length_get",2},{"ca_queue_shaper_get",2},{"ca_queue_wred_get",2},
 {"ca_queue_stats_get",3},{"ca_nat_config_get",4},{"ca_l2_vlan_learning_shared_get",4},{"ca_info_get",4}
};
int main(int argc,char **argv){
 if(argc!=2)return 1;void *lib=dlopen(argv[1],RTLD_LAZY|RTLD_LOCAL);if(!lib){fprintf(stderr,"%s\n",dlerror());return 2;}
 for(unsigned i=0;i<sizeof cases/sizeof cases[0];i++){
  void *fn=dlsym(lib,cases[i].name);if(!fn)return 3;
  for(unsigned j=0;j<3;j++){
   uint8_t out[4096];memset(out,0xa5,sizeof out);reply=j==0?0:j==1?14:15;seen=0;int rc=-99;
   switch(cases[i].kind){
    case 0:rc=((int(*)(uint16_t,uint32_t,void*))fn)(0,0x30002,out);break;
    case 1:rc=((int(*)(uint16_t,uint32_t,uint8_t,void*))fn)(0,0x30002,0,out);break;
    case 2:rc=((int(*)(uint16_t,uint32_t,uint32_t,void*))fn)(0,0x30002,3,out);break;
    case 3:rc=((int(*)(uint16_t,uint32_t,uint32_t,uint8_t,void*))fn)(0,0x30002,3,0,out);break;
    case 4:rc=((int(*)(uint16_t,void*))fn)(0,out);break;
   }
   if(seen!=1||rc!=reply)return 4;
   unsigned n=0;while(n<sizeof out&&out[n]==0xc3)n++;
   for(unsigned k=n;k<sizeof out;k++)if(out[k]!=0xa5)return 5;
   if((j<2&&n==0)||(j==2&&n))return 6;
   printf("{\"kind\":\"getter\",\"name\":\"%s\",\"status\":%d,\"opcode\":%u,\"payload_bytes\":%u,\"output_bytes\":%u,\"request_hex\":\"",cases[i].name,rc,opcode,length,n);
   for(unsigned k=0;k<length+4;k++)printf("%02x",request[k]);puts("\"}");
  }
 }
 int (*orig)(uint16_t,void*)=dlsym(lib,"ca_sdk_ioctl");uint8_t msg[8192]={0};((uint16_t*)msg)[0]=420;((uint16_t*)msg)[1]=12;
 if(orig(0,msg)||opened!=1||closed!=1||transport_called!=1)return 7;
 if(orig(0,NULL)!=15)return 8;
 ((uint16_t*)msg)[1]=8189;if(orig(0,msg)!=15||opened!=1)return 9;
 puts("{\"kind\":\"transport\",\"device_path\":\"/dev/ca-sdk-dev\",\"flags\":2,\"ioctl_request\":0,\"opens\":1,\"closes\":1,\"null_status\":15,\"oversize_status\":15}");
 return 0;
}
