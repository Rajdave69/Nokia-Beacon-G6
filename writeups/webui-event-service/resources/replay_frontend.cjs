const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const dir=process.argv[2]||__dirname,index=JSON.parse(fs.readFileSync(path.join(dir,'fragment-index.json'),'utf8'));
function src(profile,label){const row=index.find(x=>x.profile===profile&&x.label===label);return fs.readFileSync(path.join(dir,'fragments',row.file),'utf8');}
function finishIterator(it){let result;try{result=it.next();}catch(e){return Promise.reject(e);}return result.done?Promise.resolve(result.value):Promise.resolve(result.value).then(v=>finishIterator(it));}
function angularAsync(fn){return function(...args){return finishIterator(fn.apply(this,args));};}
const universal=new Proxy(function(){},{get(t,k){if(k==='A')return angularAsync;if(k==='production')return true;if(['c','YM','ym','En'].includes(k))return universal;if(k==='HTTP_OPTIONS_JSON')return {headers:{'Content-Type':'application/json'},withCredentials:true};if(k==='HTTP_OPTIONS')return {};return String(k);}});
const results=[];
(async()=>{for(const profile of ['G6-IJL','G6-HJL','B9-JJM']){
 const posts=[],logs=[],storage={token:'fixture-csrf',sid:'fixture-sid'},methods=['createBody','createSocketBody','request','callUBUS'].map(x=>src(profile,x));
 const globals={};for(const match of methods.join('\n').matchAll(/\b([A-Za-z_$][\w$]*)\./g))globals[match[1]]=universal;
 Object.assign(globals,{JSON,Math,Date,console:{log:(...v)=>logs.push(v),error:(...v)=>logs.push(v)},localStorage:{getItem:k=>storage[k]??null},document:{location:{hostname:'router.invalid'}},Xi:(self,args,fn)=>finishIterator(fn.apply(self,args||[]))});
 const ctx=vm.createContext(globals,{codeGeneration:{strings:false,wasm:false}});
 const Backend=new vm.Script('(class Backend{'+methods.join('\n')+'})').runInContext(ctx,{timeout:1000});const backend=new Backend();
 backend.body={version:1,csrf_token:'',id:1,interface:'Nokia.GenericService',service:'OAM',function:'',paralist:[]};backend.webSocketBody={version:1,csrf_token:'',id:1,interface:'Nokia.EventService',service:'OAM',function:'',paralist:[]};
 backend.getRelativeUrl=key=>{assert.equal(key,'ubus');return 'http://router.invalid/service_function_web_app.cgi';};backend.getRequestModel=(action,method,url)=>({action,method,relativeUrl:url});backend.onSuccessResponse=()=>{};backend.onErrorResponse=()=>{};
 backend.http={post:(url,body,options)=>{posts.push({url,body:JSON.parse(JSON.stringify(body)),sameAsGeneric:body===backend.body,sameAsEvent:body===backend.webSocketBody,options:JSON.parse(JSON.stringify(options))});return {subscribe:()=>{}};}};
 backend.createBody('GetSIMInfo');
 let wsSource=src(profile,'websocket-service');if(wsSource.includes('static#'))wsSource=wsSource.slice(0,wsSource.indexOf('static#'))+'}';
 const WebSocketService=new vm.Script('('+wsSource+')').runInContext(ctx,{timeout:1000});const service=new WebSocketService(backend);let opened=0,completed=0,callbacks=[],auth=[];
 service.openWebSocket=function(){opened++;this.webSocket={next:value=>auth.push(JSON.parse(JSON.stringify(value))),subscribe:callback=>{callbacks.push(callback);return {};},complete:()=>completed++};};
 const channel=service.listentToWebsocketEvent([4]);assert.equal(opened,1);assert.deepEqual(auth,[{CSRFtoken:'fixture-csrf',SessionID:'fixture-sid',PasswordType:3}]);assert.equal(service.serverUrl,'ws://router.invalid:60980/');
 callbacks[0].next({wssessionid:7});await Promise.resolve();assert.equal(posts.length,1);
 const eventBody=JSON.parse(JSON.stringify(backend.webSocketBody));assert.equal(eventBody.interface,'Nokia.EventService');assert.equal(eventBody.function,'SubscribeEvents');assert.deepEqual(eventBody.paralist,[{Source:'Web'},{wssessionid:7},{timeout:''},{eventlist:[4]}]);
 assert.equal(posts[0].sameAsGeneric,true);assert.equal(posts[0].sameAsEvent,false);assert.equal(posts[0].body.function,'GetSIMInfo');assert.equal(posts[0].body.interface,'Nokia.GenericService');assert.equal(posts[0].options.withCredentials,true);
 service.listentToWebsocketEvent([4],30);assert.equal(auth.length,1);assert.equal(callbacks.length,2);service.subscribeToEvent();await Promise.resolve();assert.equal(backend.webSocketBody.paralist[2].timeout,'30');service.listentToWebsocketEvent([4],0);assert.equal(service.eventTimer,30);
 const before=posts.length;service.handleEvent({wssessionid:0});service.handleEvent({eventid:4,payload:[{Originator:'Web',Action:'RebootSystem'}]});assert.equal(posts.length,before);
 service.closeConnection();assert.equal(completed,1);assert.equal(service.webSocket,null);
 // The actual SIM event handler, with the subscription channel mocked instead of opened.
 const Sim=new vm.Script('(class Sim{'+src(profile,'simLockMgmt')+'})').runInContext(ctx,{timeout:1000});const sim=new Sim();let eventCallback,simCloses=0;sim.api={get_sim_status:{SIMStatus:'Available'}};sim.constants={PIN_TITLE:'PIN',PUK_TITLE:'PUK',CONTACT_OPERATOR:'Contact'};sim.webSocket={listentToWebsocketEvent:events=>{assert.equal(JSON.stringify(events),'[4]');return {subscribe:f=>eventCallback=f};},closeConnection:()=>simCloses++};
 sim.simLockMgmt();eventCallback({eventid:4,payload:[{Originator:'Web',Action:'RebootSystem'}]});assert.equal(simCloses,0);eventCallback({eventid:3,payload:[{Originator:'Cloud',Action:'RebootSystem'}]});assert.equal(simCloses,0);eventCallback({eventid:4,payload:[{Originator:'Cloud',Action:'Unrelated'}]});assert.equal(simCloses,0);eventCallback({eventid:4,payload:[{Originator:'Cloud',Action:'RebootSystem'}]});assert.equal(simCloses,1);assert.equal(sim.rebootAlert,true);eventCallback({eventid:4,payload:[{Originator:'ACS',Action:'Level2FactoryReset'}]});assert.equal(simCloses,2);
 const missing=new WebSocketService(backend);missing.openWebSocket=service.openWebSocket;storage.token=null;assert.throws(()=>missing.listentToWebsocketEvent([4]),/toString/);storage.token='fixture-csrf';
 results.push({profile,result:'passed',scope:'Exact extracted methods; getRequestModel, Angular generator wrapper, HTTP, localStorage and WebSocket transport mocked; no frontend module evaluated or real network called',server_url:service.serverUrl,auth_fixture:auth[0],event_body_fixture:eventBody,actual_HTTP_fixture:posts[0],findings:['SubscribeEvents updates event body, but POST_CSRF_FWA sends generic body','default timeout string empty; truthy30 becomes string;zero argument does not replace it','Repeated listener adds subscription, does not resend auth','Zero session ID ignored','Only non-Web event4 RebootSystem/Level2FactoryReset causes the tested UI alert/close','Missing token throws before auth message'],cases:12});
 console.log(profile,'passed12offlinebehaviorcases; wrong-body HTTP dispatch reproduced');
}
fs.writeFileSync(path.join(dir,'offline-frontend-results.json'),JSON.stringify({result:'passed',cases:36,router_requests:0,profiles:results},null,2)+'\n');})().catch(e=>{console.error(e);process.exitCode=1;});
