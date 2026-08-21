(function(){
  const apps=['workqueue','slack','teams','mail','itsm','ir','soc','xdr','firewall','waf','ndr','cmdb','topology','datacenter','vuln','iam','pam','dlp','cti','cloud','backup','dfir','detections','purple','grc','clients','appsec','attack','docs','profile','terminal','report'];
  const desktopApps=['workqueue','slack','teams','mail','itsm','ir','soc','xdr','firewall','waf','ndr','datacenter','pam','dfir','attack','topology','docs','profile','terminal','report'];
  const dockApps=['workqueue','teams','slack','itsm','soc','xdr','firewall','profile'];
  let z=30, drag=null;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  function initials(n='BS'){return n.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()}
  function username(n){return n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().split(/\s+/).filter(Boolean).slice(0,2).join('.').replace(/[^a-z0-9.]/g,'')}
  function toast(title,body){const el=document.createElement('div');el.className='toast';el.innerHTML=`<strong>${BSCApps.h(title)}</strong><p>${BSCApps.h(body)}</p>`;$('#toastStack').appendChild(el);setTimeout(()=>el.remove(),5200)}
  function updateChrome(){
    const e=BSC.state.employee; if(!e)return; $('#corpClock').textContent=BSC.clock();$('#profileName').textContent=e.name;$('#profileRole').textContent=e.role;$('#profileInitials').textContent=initials(e.name);$('#wallGreeting').textContent=`BOM DIA, ${e.name.split(' ')[0].toUpperCase()}.`;
    const m=BSC_DATA.missions.find(x=>x.id===BSC.state.activeMission)||BSC_DATA.missions[0], [d,t]=BSC.missionProgress(m.id);$('#missionStatus').textContent=`${d}/${t}`;$('#notifCount').textContent=BSC.state.notifications.filter(n=>!n.read).length;
    renderMissionRail();renderNotifRail();renderStart();
  }
  function renderIcons(){
    const d=BSCV7?.appsForRole(BSC.state.employee,'desktop')||desktopApps;
    const k=BSCV7?.appsForRole(BSC.state.employee,'dock')||dockApps;
    $('#desktopIcons').innerHTML=d.map(a=>{const [i,n]=BSCApps.meta[a]||['?',a];return `<button class="desktop-icon" data-app="${a}"><span class="icon">${i}</span><small>${n}</small></button>`}).join('');
    $('#dockApps').innerHTML=k.map(a=>{const[i,n]=BSCApps.meta[a]||['?',a];return `<button class="dock-app" title="${n}" data-app="${a}">${i}</button>`}).join('');
    $$('[data-app]').forEach(b=>b.onclick=()=>openApp(b.dataset.app));
  }
  function renderMissionRail(){const rail=$('#missionRail');if(!rail)return;rail.innerHTML=`<div class="rail-head"><h3>SUAS MISSÕES</h3><button class="btn" id="closeMissionRail">×</button></div>${BSC_DATA.missions.map(m=>{const[d,t]=BSC.missionProgress(m.id);return `<article class="mission-card ${m.id===BSC.state.activeMission?'active':''}" data-set-mission="${m.id}"><header><strong>${m.id} · ${BSCApps.h(m.title)}</strong><small>${d}/${t}</small></header><p>${m.duration} · ${m.skills.join(' / ')}</p>${m.objectives.map(([k,v])=>`<div class="objective ${BSC.state.completedObjectives[k]?'done':''}"><span class="check">${BSC.state.completedObjectives[k]?'✓':''}</span><span>${BSCApps.h(v)}</span></div>`).join('')}</article>`}).join('')}`;$('#closeMissionRail').onclick=()=>rail.classList.add('hidden');rail.querySelectorAll('[data-set-mission]').forEach(x=>x.onclick=()=>{BSC.state.activeMission=x.dataset.setMission;BSC.audit('mission_selected',{mission:x.dataset.setMission,minutes:0});updateChrome()});}
  function renderNotifRail(){const rail=$('#notifRail');if(!rail)return;const ns=BSC.state.notifications;rail.innerHTML=`<div class="rail-head"><h3>NOTIFICAÇÕES</h3><button class="btn" id="closeNotifRail">×</button></div>${ns.length?ns.map(n=>`<div class="notification"><strong>${BSCApps.h(n.title)}</strong><p>${BSCApps.h(n.body)}</p><small>${BSCApps.h(n.time)} · ${BSCApps.h(n.app)}</small></div>`).join(''):'<div class="empty">Nenhuma notificação ainda.</div>'}`;$('#closeNotifRail').onclick=()=>rail.classList.add('hidden')}
  function renderStart(){const menu=$('#startMenu');if(!menu||!BSC.state.employee)return;const e=BSC.state.employee;menu.innerHTML=`<div class="rail-head"><h3>BE SAFE CORP .INC</h3><button class="btn" id="closeStart">×</button></div><div class="start-profile"><div class="avatar">${initials(e.name)}</div><div><b>${BSCApps.h(e.name)}</b><small>${BSCApps.h(e.email)}</small><small>${BSCApps.h(e.id)} · ${BSCApps.h(e.team)}</small></div></div><div class="start-apps">${apps.map(a=>{const[i,n]=BSCApps.meta[a];return `<button class="start-app" data-start-app="${a}"><span class="mini-icon">${i}</span><b>${n}</b></button>`}).join('')}</div><div class="toolbar" style="margin-top:12px"><button class="btn" id="resetRange">Resetar Cyber Range local</button></div>`;$('#closeStart').onclick=()=>menu.classList.add('hidden');menu.querySelectorAll('[data-start-app]').forEach(x=>x.onclick=()=>{menu.classList.add('hidden');openApp(x.dataset.startApp)});$('#resetRange').onclick=()=>{if(confirm('Resetar todo o progresso local deste Cyber Range?'))BSC.reset()}}
  function openApp(name,ctx={}){
    const existing=$(`.app-window[data-window="${name}"]`);if(existing){focusWindow(existing);BSCApps.render(name,existing.querySelector('.window-body'),ctx);return existing}
    const meta=BSCApps.meta[name]||['?','Application'];const win=document.createElement('section');win.className='app-window';win.dataset.window=name;win.style.zIndex=++z;win.innerHTML=`<header class="window-titlebar"><div class="window-title"><span class="mini-icon">${meta[0]}</span><strong>${meta[1]}</strong><small>Be Safe Corp .Inc</small></div><div class="window-actions"><button data-minimize>—</button><button data-maximize>□</button><button class="close" data-close>×</button></div></header><div class="window-body"></div>`;$('#windowLayer').appendChild(win);BSC.markApp(name);BSCApps.render(name,win.querySelector('.window-body'),ctx);bindWindow(win);focusWindow(win);return win;
  }
  function bindWindow(win){
    win.addEventListener('mousedown',()=>focusWindow(win));win.querySelector('[data-close]').onclick=()=>win.remove();win.querySelector('[data-minimize]').onclick=()=>{win.classList.add('hidden');const b=$(`.dock-app[data-app="${win.dataset.window}"]`);if(b)b.classList.remove('active')};win.querySelector('[data-maximize]').onclick=()=>win.classList.toggle('maximized');
    const bar=win.querySelector('.window-titlebar');bar.addEventListener('mousedown',e=>{if(e.target.closest('button')||win.classList.contains('maximized'))return;const r=win.getBoundingClientRect();drag={win,dx:e.clientX-r.left,dy:e.clientY-r.top};win.style.transform='none';win.style.left=r.left+'px';win.style.top=r.top+'px'});
  }
  function focusWindow(win){win.style.zIndex=++z;$$('.dock-app').forEach(b=>b.classList.toggle('active',b.dataset.app===win.dataset.window));win.classList.remove('hidden')}
  function modal(root,title,html){const m=document.createElement('div');m.className='modal-overlay';m.innerHTML=`<div class="modal-card"><div class="split"><h3>${BSCApps.h(title)}</h3><button class="btn" data-modal-close>×</button></div><div style="font-size:10px;line-height:1.7">${html}</div></div>`;root.appendChild(m);m.querySelector('[data-modal-close]').onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()}}
  function scheduleStory(){
    const a=BSC.state.audit.length;if(!BSC.state.storyFlags)BSC.state.storyFlags={}; const flags=BSC.state.storyFlags;
    const events=[
      [1,'intro','SOCBOT','INC-2026-0001 atribuído. Há 9 sinais correlacionados aguardando triagem.','soc'],
      [5,'finance','Renata / Infra','Financeiro fecha lote hoje. Confirme impacto antes de contenção disruptiva.','slack'],
      [12,'ha','NOC','BSC-EDGE-HA permanece degraded: HA2 session sync partial.','firewall'],
      [20,'mail','Carla Nunes','Encaminhei uma NF estranha pro SOC. Não abri o ZIP.','mail'],
      [32,'vm','Gestão de Vulnerabilidades','APP-PROD-01 entrou na fila crítica. Contexto: exposto à Internet + KEV + EPSS alto.','vuln'],
      [42,'api','AppSec de plantão','/api/login está 18x acima do baseline. Confirmem o bot score antes de aplicar bloqueio global.','waf'],
      [52,'cloud','CSPM','bsc-marketing-export está com leitura pública e houve GetObject anônimo.','cloud'],
      [62,'ransom','Líder de IR','BLACK FROST confirmado: FILE-HR-01 está criptografando e há risco real de propagação lateral. Major Incident recomendado.','ir'],
      [72,'dlp','Data Security','DLP levantou upload de clientes_Q3.xlsx por usuário executivo. Validar contexto antes de acusar qualquer coisa.','dlp'],
      [82,'pam','PAM','adm_vendor abriu sessão privilegiada sem mudança correlata. Gravação da sessão ativa.','pam'],
      [92,'ndr','NDR','Fan-out SMB leste-oeste saindo do jump host. Correlacione identidade antes de bloquear a rede inteira.','ndr'],
      [108,'dc','Operações de Datacenter','Crachá temporário de fornecedor entrou na fileira R03 sem acompanhante registrado.','datacenter'],
      [122,'mss','NOC BlueBank','P1 do cliente: parceiro de compensação indisponível após bloqueio do SOC. SLA correndo.','clients'],
      [138,'purple','Gerente de Segurança','Janela de Purple Team liberada. Operation Glasshouse está autorizada dentro do range sintético.','attack']
    ];
    for(const [n,key,title,body,app] of events){if(a>=n&&!flags[key]){flags[key]=true;if(key==='ransom')BSC.startRansomware();BSC.notify(title,body,app);toast(title,body);BSC.save();}}
  }
  function init(){
    setTimeout(()=>{$('#boot').classList.add('hidden');if(BSC.state.employee){$('#desktop').classList.remove('hidden');afterLogin()}else $('#onboarding').classList.remove('hidden')},1250);
    $('#onboardForm').addEventListener('submit',e=>{e.preventDefault();const name=$('#workerName').value.trim(),role=$('#workerRole').value,team=$('#workerTeam').value,id='BSC-'+String(Math.floor(10000+Math.random()*89999)),user=username(name),prefix={'SOC Analyst I':'SOC','Security Engineer I':'SECENG','DFIR Analyst I':'DFIR','Network Security Analyst I':'NETSEC','Cybersecurity Analyst I':'CYBER'}[role]||'CYBER',emp={name,role,team,id,username:user,email:`${user}@besafecorp.inc`,mfa:true,site:'BSC-HQ-SP',workstation:`WS-${prefix}-${String(Math.floor(10+Math.random()*89))}`};BSC.setEmployee(emp);$('#onboarding').classList.add('hidden');$('#desktop').classList.remove('hidden');afterLogin();BSCV7?.registration.increment(emp);BSCV7?.welcome(emp);toast(`Bem-vindo, ${name.split(' ')[0]}`,'Seu primeiro turno foi iniciado. Há trabalho esperando na fila.')});
    const roleTeams={'Cybersecurity Analyst I':'Cybersecurity Operations','SOC Analyst I':'SOC','Security Engineer I':'Security Engineering','DFIR Analyst I':'Incident Response','Network Security Analyst I':'Network Security'};
    $('#workerRole').addEventListener('change',e=>{const team=roleTeams[e.currentTarget.value];if(team){let opt=[...$('#workerTeam').options].find(o=>o.value===team);if(!opt){opt=document.createElement('option');opt.value=team;opt.textContent=team;$('#workerTeam').appendChild(opt)}$('#workerTeam').value=team;}});
    $('#workerRole').dispatchEvent(new Event('change'));
    window.addEventListener('mousemove',e=>{if(!drag)return;drag.win.style.left=Math.max(0,e.clientX-drag.dx)+'px';drag.win.style.top=Math.max(0,e.clientY-drag.dy)+'px'});window.addEventListener('mouseup',()=>drag=null);
    window.addEventListener('bsc:state',()=>{updateChrome();scheduleStory()});
  }
  function afterLogin(){renderIcons();updateChrome();scheduleStory();$('#missionButton').onclick=()=>$('#missionRail').classList.toggle('hidden');$('#notifButton').onclick=()=>{BSC.state.notifications.forEach(n=>n.read=true);BSC.save();$('#notifRail').classList.toggle('hidden')};$('#startButton').onclick=()=>$('#startMenu').classList.toggle('hidden');$('#profileButton').onclick=()=>openApp('profile');$('#docsButton').onclick=()=>openApp('docs');
    setInterval(()=>{$('#corpClock').textContent=BSC.clock()},15000);
    if(!BSC.state.audit.some(a=>a.action==='session_welcome')){BSC.audit('session_welcome',{minutes:0});BSC.notify('Paulo Martins / Gerente de Segurança','Bem-vindo. Comece pela Work Queue e pelo ticket atribuído. Documente o que fizer.','teams');} BSCV7?.startLive();
  }
  window.BSCUI={openApp,modal,toast,updateChrome};init();
})();
