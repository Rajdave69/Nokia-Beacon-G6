/* Host-QEMU-only ACI dispatch recorder: every vendor operation is mocked. */
#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#define GET0(name) int name(void *p) { (void)p; puts("MOCK " #name); return -7; }
#define SET1(name) int name(int a) { printf("MOCK " #name " %d\n",a); return 0; }
#define GETS(name) int name(const char *a, void *out) { (void)out; printf("MOCK " #name " %s\n",a?a:"(null)"); return -7; }
GET0(ai_engine_get_version_info)
int ai_engine_getDomainInfo(void) { puts("MOCK ai_engine_getDomainInfo return=-7"); return -7; }
int nwa_startLocalRRM(void) { puts("MOCK nwa_startLocalRRM"); return 0; }
int nwa_local_rrm_contrl(const unsigned char *p) { printf("MOCK nwa_local_rrm_contrl %u\n",p[0]); return 0; }
int nwa_local_rrm_enable_radio(const unsigned char *p) { uint32_t b; __builtin_memcpy(&b,p,4); printf("MOCK nwa_local_rrm_enable_radio band=%u enable=%u\n",b,p[8]); return 0; }
SET1(ai_engine_setUtilizationThreshold)
SET1(ai_engine_setMinInterferenceThreshold)
SET1(ai_engine_setSensingPeriod)
SET1(ai_engine_setExplorationPeriod)
int ai_engine_setLogLevel(int a,int b) { printf("MOCK ai_engine_setLogLevel %d %d\n",a,b); return 0; }
int ai_engine_setForceChannel(int a,int b,int c,int d) { printf("MOCK ai_engine_setForceChannel %d %d %d %d\n",a,b,c,d); return 0; }
int ai_engine_setAvaliableChannelList(int a,const char *b) { printf("MOCK ai_engine_setAvaliableChannelList %d %s\n",a,b); return 0; }
int ai_engine_getAutoChannelStatus(int a,void *b) { (void)b; printf("MOCK ai_engine_getAutoChannelStatus %d\n",a); return -7; }
int ai_engine_getAvaliableChannelList(int a,void *b) { (void)b; printf("MOCK ai_engine_getAvaliableChannelList %d\n",a); return -7; }
GETS(ai_engine_getNodeInfo)
GETS(ai_engine_getStationInfo)
int ai_engine_getRadioInfo(const char *a,const char *b,void *c) { (void)c; printf("MOCK ai_engine_getRadioInfo %s %s\n",a,b); return -7; }
int ai_engine_getLinkInfo(const char *a,const char *b,void *c) { (void)c; printf("MOCK ai_engine_getLinkInfo %s %s\n",a,b); return -7; }
int ai_engine_getChannelScore(const char *a,int b,void *c) { (void)c; printf("MOCK ai_engine_getChannelScore %s %d\n",a,b); return -7; }
int ai_engine_getNeighbhorAlignScore(const char *a,int b,void *c) { (void)c; printf("MOCK ai_engine_getNeighbhorAlignScore %s %d\n",a,b); return -7; }
int ai_engine_getChannelLocationInfo(const char *a,int b,void *c) { (void)c; printf("MOCK ai_engine_getChannelLocationInfo %s %d\n",a,b); return -7; }
int ai_engine_getActionInfo(int a,int b,int c,int d,void *p) { memset(p,0,176); printf("MOCK ai_engine_getActionInfo %d %d %d %d\n",a,b,c,d); return -7; }
int ai_engine_getActionInfo6(int a,int b,int c,int d,void *p) { memset(p,0,176); printf("MOCK ai_engine_getActionInfo6 %d %d %d %d\n",a,b,c,d); return -7; }
SET1(ai_engine_getAllActionInfo)
int ai_engine_logBlockedChannels(void) { puts("MOCK ai_engine_logBlockedChannels"); return 0; }
int nwa_local_rrm_enable_optimize_wifi(void *p) { (void)p; puts("MOCK nwa_local_rrm_enable_optimize_wifi"); return -7; }
int nwa_retrieve_domain_info_from_localRRM(void *p) { (void)p; puts("MOCK nwa_retrieve_domain_info_from_localRRM"); return -7; }
int socket(int a,int b,int c) { (void)a;(void)b;(void)c;fputs("BLOCKED socket\n",stderr);_exit(90); }
int connect(int a,const void *b,unsigned c) { (void)a;(void)b;(void)c;fputs("BLOCKED connect\n",stderr);_exit(90); }
int system(const char *s) { (void)s;fputs("BLOCKED system\n",stderr);_exit(90); }
