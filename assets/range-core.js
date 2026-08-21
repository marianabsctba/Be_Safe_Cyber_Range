(function(){
  const KEY='bsc_range_v7_state';
  const deep=x=>JSON.parse(JSON.stringify(x));
  function initial(){
    return {
      version:7, employee:null, startedAt:null, virtualMinute:0, activeMission:'M01',
      tickets:deep(BSC_DATA.tickets), xdr:deep(BSC_DATA.xdr), firewall:deep(BSC_DATA.firewall), mail:deep(BSC_DATA.mail),
      chats:deep(BSC_DATA.chats), vulnerabilities:deep(BSC_DATA.vulnerabilities), identity:deep(BSC_DATA.identity),
      cloudFindings:deep(BSC_DATA.cloudFindings||[]), waf:deep(BSC_DATA.waf||{}), ndr:deep(BSC_DATA.ndr||{}), dlp:deep(BSC_DATA.dlp||{}), pam:deep(BSC_DATA.pam||{}), backupState:deep(BSC_DATA.backupState||{}), dfir:deep(BSC_DATA.dfir||{}), detections:deep(BSC_DATA.detections||[]), purple:deep(BSC_DATA.purple||{}), grc:deep(BSC_DATA.grc||{}), datacenter:deep(BSC_DATA.datacenter||{}), clients:deep(BSC_DATA.clients||[]), appsec:deep(BSC_DATA.appsec||{}), redteam:deep(BSC_DATA.redteam||{}), ransomware:deep(BSC_DATA.ransomware||{}), dynamicLogs:[], completedObjectives:{}, gaps:[], audit:[], notes:[], notifications:[], openedApps:[], terminalHistory:[], reportGenerated:0
    };
  }
  function load(){
    try{
      const x=JSON.parse(localStorage.getItem(KEY));
      if(x&&x.version===7)return Object.assign(initial(),x);
      const old=JSON.parse(localStorage.getItem('bsc_range_v6_state'));
      if(old&&old.version===6){const migrated=Object.assign(initial(),old,{version:7});localStorage.setItem(KEY,JSON.stringify(migrated));return migrated;}
      return initial();
    }catch(e){return initial();}
  }
  let state=load();
  function save(){ localStorage.setItem(KEY,JSON.stringify(state)); window.dispatchEvent(new CustomEvent('bsc:state',{detail:state})); }
  function clock(){ const base=8*60+7+state.virtualMinute; const h=String(Math.floor(base/60)%24).padStart(2,'0'); const m=String(base%60).padStart(2,'0'); return `${h}:${m}`; }
  function ransomwareLog(source,host,event,user,src,dst,message){
    state.dynamicLogs.push({ts:clock()+':00',source,host,event,user,src,dst,message});
  }
  function ransomwareNotify(title,body,app='soc'){
    state.notifications.unshift({id:Date.now()+Math.random(),time:clock(),title,body,app,read:false});
  }
  function startRansomware(){
    const r=state.ransomware;if(!r||r.active||r.eradicated)return;
    r.active=true;r.stage='active';r.startedAt=clock();r.elapsed=0;
    ransomwareLog('xdr','FILE-HR-01','ransomware_outbreak','BSC\\hrodrigues','10.30.33.19','10.40.30.25','BLACK FROST: encryption behavior confirmed; incident engine active');
    ransomwareNotify('P1 · Ransomware behavior confirmed','FILE-HR-01 is actively encrypting. Lateral movement risk is rising while the shift continues.','soc');
  }
  function host(id){return state.ransomware?.hosts?.find(x=>x.id===id)}
  function advanceRansomware(minutes=0,action=''){
    const r=state.ransomware;if(!r||!r.active||r.eradicated||minutes<=0)return;
    r.elapsed+=minutes;
    const set=(id,status,encrypted)=>{const x=host(id);if(!x)return false;if(['Contained','Recovered','Protected'].includes(x.status)&&status!=='Recovered')return false;const changed=x.status!==status;if(changed)x.status=status;if(encrypted!=null)x.encrypted=Math.max(x.encrypted||0,encrypted);return changed};
    if(r.elapsed>=8&&!r.networkSegmented){
      if(set('WS-HR-027','Encrypting',24)){r.impact.encryptedFiles+=24;r.timeline.push({time:clock(),type:'Lateral movement',detail:'WS-HR-027 began encryption after SMB activity from HR segment.'});ransomwareLog('ndr','NDR-SENSOR-01','ransom_smb_spread','svc-hr-sync','10.40.30.25','10.30.33.27','SMB fan-out followed by ransomware-like file operations');ransomwareNotify('Blast radius increased','WS-HR-027 is now encrypting. Network containment has not been applied.','ndr');if(state.xdr.endpoints['WS-HR-027'])state.xdr.endpoints['WS-HR-027'].risk='Critical';}
    }
    if(r.elapsed>=15&&!r.credentialRevoked){
      if(set('FILE-FIN-01','Encrypting',210)){r.impact.encryptedFiles+=210;if(!r.impact.unavailableServices.includes('Finance Shared Files'))r.impact.unavailableServices.push('Finance Shared Files');r.timeline.push({time:clock(),type:'Credential propagation',detail:'Reused svc-hr-sync credential reached FILE-FIN-01; finance shares are degrading.'});ransomwareLog('windows','FILE-FIN-01','4624','svc-hr-sync','10.40.30.25','10.40.30.35','Successful network logon followed by rapid file modifications');ransomwareNotify('Finance impact detected','FILE-FIN-01 is encrypting via compromised service-account reuse.','teams');if(state.xdr.endpoints['FILE-FIN-01'])state.xdr.endpoints['FILE-FIN-01'].risk='Critical';}
    }
    if(r.elapsed>=24&&!r.networkSegmented&&!r.credentialRevoked){
      if(set('APP-PROD-01','Compromised',0)){if(!r.impact.unavailableServices.includes('ERP document export'))r.impact.unavailableServices.push('ERP document export');r.timeline.push({time:clock(),type:'Application impact',detail:'Shared administrative path exposed APP-PROD-01; ERP document export is unavailable.'});ransomwareLog('xdr','APP-PROD-01','credential_abuse','svc-hr-sync','10.40.30.35','10.40.10.21','Service-account reuse reached ERP application tier');ransomwareNotify('ERP degradation','Application tier shows credential abuse correlated with the ransomware incident.','soc');}
    }
    if(r.elapsed>=30&&!r.credentialRevoked){
      const dc=host('DC01');if(dc&&dc.status==='Protected'){dc.status='Attack blocked';r.timeline.push({time:clock(),type:'Tier-0 attempt',detail:'Compromised credential attempted privileged access toward DC01; tier boundary blocked direct impact.'});ransomwareLog('identity','DC01','4769','svc-hr-sync','10.40.30.35','10.40.1.10','Abnormal service-ticket request during BLACK FROST incident');ransomwareNotify('Tier-0 activity','Identity telemetry shows suspicious ticket requests toward DC01.','iam');}
    }
    if(r.elapsed>=35&&!r.backupProtected){
      const bk=host('BKP-CTRL-01');if(bk&&bk.status!=='Degraded'){bk.status='Degraded';state.backupState.alerts.push({time:clock(),severity:'Critical',event:'BLACK FROST attempted privileged operations against backup control plane'});r.timeline.push({time:clock(),type:'Recovery attack',detail:'Backup control plane entered degraded mode after repeated privileged attempts. Immutable copies remain protected.'});ransomwareLog('backup','BKP-CTRL-01','admin_plane_attack','svc-hr-sync','10.40.30.35','10.70.10.11','Destructive administrative operation attempt denied by repository immutability');ransomwareNotify('Backup control plane under attack','Immutable data is still protected, but controller availability is degrading.','backup');}
    }
    const compromised=r.hosts.filter(x=>['Compromised','Encrypting','Degraded','Targeted'].includes(x.status)).length;
    if(compromised>=5)r.stage='major-impact';else if(compromised>=3)r.stage='spreading';else r.stage='active';
    const primary=['WS-HR-019','FILE-HR-01','WS-HR-027','FILE-FIN-01'].filter(id=>{const x=host(id);return !x||['Contained','Recovered','Protected','At risk'].includes(x.status)}).length;
    if(r.networkSegmented&&r.credentialRevoked&&primary===4){r.contained=true;r.stage='contained';}
  }
  function tick(minutes=1){
    const mins=Math.max(0,Number(minutes)||0); if(!mins)return;
    state.virtualMinute+=mins;
    state.tickets.forEach(t=>{if(!['Resolved','Closed'].includes(t.status)&&Number.isFinite(t.sla))t.sla=Math.max(0,t.sla-mins)});
    advanceRansomware(mins,'tempo_real');
    save();
  }
  function audit(action,payload={}){ state.audit.push({ts:new Date().toISOString(),corpTime:clock(),action,payload}); const mins=Math.max(0,payload.minutes??2); state.virtualMinute+=mins; state.tickets.forEach(t=>{if(!['Resolved','Closed'].includes(t.status)&&Number.isFinite(t.sla))t.sla=Math.max(0,t.sla-mins)}); advanceRansomware(mins,action); save(); }
  function gap(code,title,detail,severity='Medium'){
    if(!state.gaps.some(g=>g.code===code)){ state.gaps.push({code,title,detail,severity,corpTime:clock()}); audit('gap_recorded',{code,severity,minutes:0}); }
  }
  function objective(key){ if(!state.completedObjectives[key]){ state.completedObjectives[key]={at:clock(),realAt:new Date().toISOString()}; audit('objective_completed',{key,minutes:0}); } }
  function notify(title,body,app='system'){ state.notifications.unshift({id:Date.now()+Math.random(),time:clock(),title,body,app,read:false}); save(); }
  function markApp(app){ if(!state.openedApps.includes(app)) state.openedApps.push(app); audit('app_opened',{app,minutes:1}); }
  function setEmployee(emp){ state.employee=emp; state.startedAt=state.startedAt||new Date().toISOString(); audit('onboarding_complete',{employeeId:emp.id,minutes:0}); objective('onboarding'); }
  function reset(){ state=initial(); save(); location.reload(); }
  function missionProgress(m){ const mission=BSC_DATA.missions.find(x=>x.id===m); if(!mission)return [0,0]; const done=mission.objectives.filter(([k])=>state.completedObjectives[k]).length; return [done,mission.objectives.length]; }
  function mutate(fn,action,payload={}){ fn(state); audit(action,payload); }
  window.BSC={get state(){return state},save,tick,audit,gap,objective,notify,markApp,setEmployee,reset,clock,missionProgress,mutate,deep,startRansomware,advanceRansomware};
})();
