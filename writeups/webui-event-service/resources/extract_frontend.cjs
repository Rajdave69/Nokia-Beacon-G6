const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path');
const dir=process.argv[2]||__dirname,rows=JSON.parse(fs.readFileSync(path.join(dir,'copied-bundles.json'),'utf8')),out=[];
fs.mkdirSync(path.join(dir,'fragments'),{recursive:true});
function compile(s,kind){try{if(kind==='class'||kind==='function')new vm.Script('('+s+')');else new vm.Script('class Extracted extends Object{'+s+'}');return true;}catch(e){return false;}}
function endOf(s,start,kind){let end=start,count=0;while((end=s.indexOf('}',end))>=0){end++;if(compile(s.slice(start,end),kind))return end;if(++count>12000)throw Error('extraction budget');}throw Error('No complete '+kind);}
function cls(s,at){let re=/\bclass(?:\s+[A-Za-z_$][\w$]*)?(?:\s+extends\s+[A-Za-z_$][\w$.[\]]*)?\s*\{/g,m,candidates=[];while((m=re.exec(s))&&m.index<=at)candidates.push(m.index);for(const start of candidates.reverse()){try{let end=endOf(s,start,'class');if(end>at)return [start,end];}catch(e){}}throw Error('Class not found');}
function fun(s,at){let re=/\bfunction\s+[A-Za-z_$][\w$]*\([^)]*\)\s*\{/g,m,last;while((m=re.exec(s))&&m.index<=at)last=m.index;if(last===undefined)throw Error('Function not found');return [last,endOf(s,last,'function')];}
function save(row,s,a,b,label,kind){const text=s.slice(a,b),data=Buffer.from(text),file=row.profile+'-'+label+'.txt';fs.writeFileSync(path.join(dir,'fragments',file),data);const item={profile:row.profile,source:row.source,path:row.path,source_sha256:row.sha256,label,kind,file,start_utf16:a,end_utf16:b,start_byte:Buffer.byteLength(s.slice(0,a)),end_byte:Buffer.byteLength(s.slice(0,b)),bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex'),compile_only:true};out.push(item);return item;}
function method(row,s,name,a=0,b=s.length,label=name){let re=new RegExp('(?:get\\s+|set\\s+)?'+name+'\\([^)]*\\)\\s*\\{','g'),m;re.lastIndex=a;while((m=re.exec(s))&&m.index<b){try{let end=endOf(s,m.index,'method');if(end<=b)return save(row,s,m.index,end,label,'method');}catch(e){}}return null;}
for(const profile of ['G6-IJL','G6-HJL','B9-JJM']){
 const main=rows.find(r=>r.profile===profile&&r.matches['60980']);const s=fs.readFileSync(main.copy,'utf8');
 // Parse modules without linking or evaluating them; script chunks need no imports resolved.
 new vm.SourceTextModule(s);
 let span=cls(s,s.indexOf('60980'));save(main,s,...span,'websocket-service','class');
 let backend=cls(s,s.indexOf('Nokia.EventService'));save(main,s,...backend,'backend-service','class');
 let transport=cls(s,s.indexOf('callUBUS('));save(main,s,...transport,'api-transport','class');
 for(const name of ['createSocketBody','createBody','request','onSuccessResponse','postWithCSRFToken'])method(main,s,name,...backend);
 method(main,s,'callUBUS',...transport);
 for(const name of ['openWebSocket','listentToWebsocketEvent','handleEvent','subscribeToEvent','send','closeConnection'])method(main,s,name,...span);
 const consumer=rows.find(r=>r.profile===profile&&r.matches['listentToWebsocketEvent']&&!r.matches['60980'])||main,cs=fs.readFileSync(consumer.copy,'utf8');
 let at=cs.indexOf('simLockMgmt(){'),component=cls(cs,at);save(consumer,cs,...component,'sim-component','class');
 for(const name of ['ngOnInit','simLockMgmt','checkSiminfo','submitPin','submitPuk'])method(consumer,cs,name,...component);
 let marker=cs.lastIndexOf('app-sim-lock-management'),template=fun(cs,marker),item=save(consumer,cs,...template,'sim-template','function');
 const fname=cs.slice(template[0],template[1]).match(/^function\s+([^ (]+)/)[1];let re=new RegExp('[,(]'+fname+'[,)]','g'),m;while((m=re.exec(cs))){if(m.index<template[1])continue;let parent=fun(cs,m.index);save(consumer,cs,...parent,'sim-parent-template','function');break;}
 let globalConfig=cls(s,s.indexOf('this.supportsFWADevice='));save(main,s,...globalConfig,'global-model-config','class');
 let productConfig=cls(s,s.lastIndexOf('this.supportsFWADevice='));save(main,s,...productConfig,'product-feature-config','class');
 let urls=cls(s,s.indexOf('service_function_web_app.cgi'));save(main,s,...urls,'url-map','class');
 try {let headers=cls(s,s.indexOf('HTTP_OPTIONS_JSON='));save(main,s,...headers,'http-options','class');}
 catch(e){let re=/\b(?:this|[A-Za-z_$][\w$]*)\.HTTP_OPTIONS_JSON=/g,m=re.exec(s);if(!m)throw e;let end=m.index;while(end<s.length){end++;if(',;'.includes(s[end])&&compile(s.slice(m.index,end),'class')){save(main,s,m.index,end,'http-options','expression');break;}}}

 method(main,s,'getRequestModel',...transport);
 console.log(profile,'exact fragments',out.filter(x=>x.profile===profile).length);
}
fs.writeFileSync(path.join(dir,'fragment-index.json'),JSON.stringify(out,null,2)+'\n');
