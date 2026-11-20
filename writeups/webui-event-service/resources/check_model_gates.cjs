const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const dir=process.argv[2]||__dirname,index=JSON.parse(fs.readFileSync(path.join(dir,'fragment-index.json'),'utf8')),result=[];
function assignment(s,name){const marker='this.'+name+'=',start=s.indexOf(marker);if(start<0)return null;for(let end=start+marker.length;end<s.length;end++){if(!',;}'.includes(s[end]))continue;const expression=s.slice(start,end);try{new vm.Script('('+expression+')');return expression;}catch(e){}}throw Error('Assignment not found '+name);}
for(const profile of ['G6-IJL','G6-HJL','B9-JJM']){
 const row=index.find(x=>x.profile===profile&&x.label==='global-model-config'),source=fs.readFileSync(path.join(dir,'fragments',row.file),'utf8'),fields=['isFWAmmWaveReceiver','isFWAGateway','isFWAReceiver','supportsFWADevice'],expressions=fields.map(name=>assignment(source,name)).filter(Boolean),context=vm.createContext({},{codeGeneration:{strings:false,wasm:false}});
 const fn=new vm.Script('(function(){'+expressions.join(';')+';return this;})').runInContext(context,{timeout:1000}),data=JSON.parse(JSON.stringify(fn.call({isFWAmmWaveReceiver:[]})));
 for(const model of ['Beacon G6','Beacon G6.2','Beacon 9'])assert.equal(data.supportsFWADevice.includes(model),false);
 for(const model of ['5G15-12W-A','5G14-B'])assert.equal(data.supportsFWADevice.includes(model),true);
 result.push({profile,source_fragment:row.file,expressions,model_lists:data,tested_negative_models:['Beacon G6','Beacon G6.2','Beacon 9'],tested_positive_models:['5G15-12W-A','5G14-B'],scope:'Only exact declarative array assignments evaluated on an inert object; no entire config constructor evaluated. DeviceType runtime override unmeasured.'});
 console.log(profile,'FWA models',data.supportsFWADevice.length,'Beacon G6/G6.2/9 absent; two FWA models present');
}
fs.writeFileSync(path.join(dir,'model-gates.json'),JSON.stringify({result:'passed',profiles:result},null,2)+'\n');
