(() => {
  const labs = window.BE_SAFE_LABS || [];
  const grid = document.querySelector('#labGrid');
  const chips = document.querySelector('#filters');
  const PROFILE_KEY = 'besafe-range:profile';
  const liveCount = labs.filter(l => l.status === 'live').length;
  const tracks = [...new Set(labs.map(l => l.track))].sort();
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const readJSON = key => { try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; } };
  const makeEmployeeId = () => `BSC-${Math.floor(10000 + Math.random()*90000)}`;
  const firstName = name => (name || '').trim().split(/\s+/)[0] || 'NOVO';
  const initials = name => (name || 'NH').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  let profile = readJSON(PROFILE_KEY);

  function labState(id) { return readJSON(`besafe-range:${id}`); }
  function stateCompleted(state) { return Boolean(state?.completedOnce || state?.finished); }
  function stateBestScore(state) { return Number.isFinite(state?.bestScore) ? state.bestScore : Number.isFinite(state?.normalizedScore) ? state.normalizedScore : null; }
  function statusOf(lab) {
    const state = labState(lab.id);
    if (stateCompleted(state)) return {kind:'done', label:'● CONCLUÍDO', score:stateBestScore(state)};
    if (state && (state.stage > 0 || state.decisions?.length)) return {kind:'active', label:'◐ EM ANDAMENTO', score:null};
    return {kind:'new', label:lab.status === 'live' ? '○ NOVO NA FILA' : 'EM PRODUÇÃO', score:null};
  }

  function progressSummary() {
    const states = labs.map(l=>({lab:l,state:labState(l.id)}));
    const done = states.filter(x=>stateCompleted(x.state));
    const active = states.filter(x=>x.state && !x.state.finished && !stateCompleted(x.state) && (x.state.stage>0 || x.state.decisions?.length));
    const scores = done.map(x=>stateBestScore(x.state)).filter(Number.isFinite);
    const latestCandidates = states.filter(x=>x.state?.updatedAt).sort((a,b)=>(b.state.updatedAt||0)-(a.state.updatedAt||0));
    return {done:done.length, active:active.length, best:scores.length?Math.max(...scores):null, latest:latestCandidates[0] || null};
  }

  function saveProfileName(name) {
    const clean = name.trim().replace(/\s+/g,' ');
    if (!clean) return false;
    profile = {
      ...(profile || {}),
      name: clean,
      employeeId: profile?.employeeId || makeEmployeeId(),
      createdAt: profile?.createdAt || Date.now(),
      role: 'CYBERSECURITY OPERATIONS // WORKER',
      department: 'SECURITY OPERATIONS',
      clearance: 'L1'
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  }

  function persistProfile() { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }

  function renderProfile() {
    const summary = progressSummary();
    const has = Boolean(profile?.name);
    document.querySelectorAll('[data-worker-full]').forEach(el=>el.textContent=has ? profile.name : 'NOVO FUNCIONÁRIO');
    document.querySelectorAll('[data-worker-id]').forEach(el=>el.textContent=has ? profile.employeeId : 'PENDING');
    document.querySelectorAll('[data-worker-initials]').forEach(el=>el.textContent=has ? initials(profile.name) : 'NH');
    document.querySelectorAll('[data-worker-meta]').forEach(el=>el.textContent=has ? `${profile.employeeId} // ${profile.department}` : 'AGUARDANDO ONBOARDING');
    const n=document.querySelector('#workerName'), m=document.querySelector('#workerMeta');
    if(n)n.textContent=has?profile.name:'NOVO FUNCIONÁRIO';
    if(m)m.textContent=has?`${profile.employeeId} // ${profile.role} // CLEARANCE ${profile.clearance}`:'CADASTRO PENDENTE';
    const c=document.querySelector('#workerCompleted'), a=document.querySelector('#workerActive'), b=document.querySelector('#workerBest');
    if(c)c.textContent=`${summary.done}/${labs.length}`;
    if(a)a.textContent=summary.active;
    if(b)b.textContent=summary.best==null?'—':summary.best;
    const appDone=document.querySelector('#appCompleted'); if(appDone)appDone.textContent=summary.done;
    const shift=document.querySelector('#shiftStatus'); if(shift)shift.textContent=has?'ONLINE':'OFFLINE';
    const greeting=document.querySelector('#heroGreeting'), heroName=document.querySelector('#heroName'), heroCopy=document.querySelector('#heroCopy'), cta=document.querySelector('#primaryCta');
    if(has && profile.onboardingComplete){
      if(greeting)greeting.textContent='BOM TURNO,';
      if(heroName)heroName.textContent=`${firstName(profile.name).toUpperCase()}.`;
      if(heroCopy)heroCopy.innerHTML=`Seu crachá está ativo. Há <strong>${liveCount} incidente${liveCount===1?'':'s'} na fila</strong>, mensagens não lidas e uma empresa inteira contando com suas decisões. Bem-vindo de volta à Be Safe Corp. Inc.`;
      if(cta){cta.textContent=summary.latest && !stateCompleted(summary.latest.state)?'CONTINUAR MEU TURNO →':'ABRIR MEU WORKSPACE →'; cta.href=summary.latest && !stateCompleted(summary.latest.state) && summary.latest.lab.status==='live'?`lab.html?id=${encodeURIComponent(summary.latest.lab.id)}`:'#workspace';}
    }
    const cont=document.querySelector('#continueShift');
    if(cont && summary.latest?.lab?.status==='live') { cont.href=`lab.html?id=${encodeURIComponent(summary.latest.lab.id)}`; cont.textContent=!stateCompleted(summary.latest.state)?'CONTINUAR TURNO →':'REVER ÚLTIMA MISSÃO →'; }
  }

  function onboardingTemplate(step) {
    const name = profile?.name || '';
    if(step===0) return `
      <div class="onboarding-kicker">BE SAFE CORP. INC. // PEOPLE OPERATIONS</div>
      <h2 id="onboardingTitle">NOVO <em>FUNCIONÁRIO.</em></h2>
      <p>Seu acesso à Be Safe Corp. Inc. está quase pronto. Antes de começar, precisamos emitir seu crachá corporativo.</p>
      <label class="worker-field"><span>NOME DO(A) FUNCIONÁRIO(A)</span><input id="workerInput" type="text" maxlength="70" autocomplete="name" placeholder="Ex.: Mariana BS" value="${safe(name)}" /></label>
      <p class="privacy-note">Esse nome será usado no crachá, Teams, relatórios e progresso. O perfil é salvo somente neste navegador. Não pedimos e-mail, telefone, CPF ou senha.</p>
      <div class="onboarding-actions"><span>HR CASE // NEW-HIRE-2026</span><button class="button button-primary" data-next="name">CONFIRMAR CONTRATAÇÃO →</button></div>`;
    if(step===1) return `
      <div class="onboarding-kicker">CONTRATAÇÃO CONCLUÍDA // STATUS: ACTIVE</div>
      <h2 id="onboardingTitle">BOAS-VINDAS,<br><em>${safe(firstName(profile.name).toUpperCase())}.</em></h2>
      <p>É muito bom ter você com a gente. A partir de agora, você faz parte da equipe de segurança da <strong>Be Safe Corp. Inc.</strong></p>
      <div class="welcome-letter"><span>FROM: Helena Costa // CISO</span><p>“${safe(firstName(profile.name))}, seu primeiro dia começa agora. Aqui ninguém espera que você saiba tudo. Esperamos que investigue, pergunte, documente e tome decisões que consiga defender tecnicamente. E por favor: não confie em alerta só porque ele está vermelho.”</p></div>
      <div class="onboarding-actions"><span>MANAGER // HELENA COSTA</span><button class="button button-lime" data-next="continue">EMITIR MEU CRACHÁ →</button></div>`;
    if(step===2) return `
      <div class="onboarding-kicker">IDENTITY SERVICES // BADGE ISSUED</div>
      <h2 id="onboardingTitle">SEU <em>CRACHÁ.</em></h2>
      <div class="onboarding-badge-wrap">
        <div class="employee-hero-card onboarding-badge">
          <div class="employee-card-head"><span>BE SAFE CORP. INC.</span><span>SECURITY</span></div>
          <div class="employee-photo">${initials(profile.name)}</div>
          <div class="employee-card-name">${safe(profile.name)}</div>
          <div class="employee-card-role">CYBERSECURITY OPERATIONS</div>
          <div class="employee-card-id"><span>EMPLOYEE ID</span><strong>${profile.employeeId}</strong></div>
          <div class="employee-card-id"><span>CLEARANCE</span><strong>${profile.clearance}</strong></div>
          <div class="employee-barcode"></div>
          <small>AUTHORIZED FOR SIMULATED CYBER RANGE OPERATIONS</small>
        </div>
        <div class="badge-notes"><div><span>DEPARTAMENTO</span><strong>SECURITY OPERATIONS</strong></div><div><span>LOCAL</span><strong>HYBRID // SOC</strong></div><div><span>STATUS</span><strong class="lime-text">ACTIVE</strong></div><div><span>EMPRESA</span><strong>BE SAFE CORP. INC.</strong></div></div>
      </div>
      <div class="onboarding-actions"><span>ACCESS PROVISIONED // L1</span><button class="button button-primary" data-next="continue">CONHECER MEU TIME →</button></div>`;
    if(step===3) return `
      <div class="onboarding-kicker">ORIENTATION // MEET THE TEAM</div>
      <h2 id="onboardingTitle">ESSAS PESSOAS VÃO <em>APARECER MUITO.</em></h2>
      <p>Você vai trabalhar com gente de vários times. Eles têm prioridades diferentes — e nem sempre vão concordar com você.</p>
      <div class="onboarding-team">
        <div><span>HC</span><strong>Helena Costa</strong><small>CISO // sua gestora</small></div>
        <div><span>LM</span><strong>Lucas Martins</strong><small>SOC N1 // ainda aprendendo</small></div>
        <div><span>JF</span><strong>Juliana Freitas</strong><small>SOC L2 // técnica e objetiva</small></div>
        <div><span>RA</span><strong>Renata Alves</strong><small>Infra // odeia indisponibilidade</small></div>
        <div><span>PM</span><strong>Paula Mendes</strong><small>Jurídico/DPO // quer evidência</small></div>
        <div><span>SB</span><strong>SOCBOT</strong><small>Automação // zero carisma</small></div>
      </div>
      <div class="onboarding-actions"><span>PEOPLE OPS // 4 OF 5</span><button class="button button-lime" data-next="continue">VER ORIENTAÇÃO →</button></div>`;
    return `
      <div class="onboarding-kicker">SECURITY ORIENTATION // FIRST DAY</div>
      <h2 id="onboardingTitle">ANTES DE COMEÇAR,<br><em>5 REGRAS.</em></h2>
      <div class="orientation-list">
        <div><b>01</b><p><strong>Evidência antes de certeza.</strong> Não afirme impacto que você ainda não provou.</p></div>
        <div><b>02</b><p><strong>Negócio também importa.</strong> Conter rápido é ótimo; derrubar produção sem necessidade não.</p></div>
        <div><b>03</b><p><strong>As pessoas são parte do cenário.</strong> Teams, clientes, jurídico e infraestrutura carregam pistas e pressão.</p></div>
        <div><b>04</b><p><strong>A empresa tem memória.</strong> Ativos, personagens e acontecimentos podem reaparecer em outras missões.</p></div>
        <div><b>05</b><p><strong>Documente.</strong> Seu relatório registra decisões, score e evolução profissional.</p></div>
      </div>
      <div class="first-ticket"><span>SEU PRIMEIRO TICKET JÁ CHEGOU</span><strong>INC-2026-0001 // SOC // HIGH</strong><p>Comportamento suspeito no Financeiro. 9 alertas aguardando triagem.</p></div>
      <div class="onboarding-actions"><span>ONBOARDING COMPLETE</span><button class="button button-primary" data-next="finish">ACESSAR MEU WORKSPACE →</button></div>`;
  }

  function openOnboarding(forceEdit=false) {
    const overlay=document.querySelector('#onboardingOverlay');
    if(!overlay)return;
    let step = (!profile?.name || forceEdit) ? 0 : (profile.onboardingComplete ? 2 : 1);
    overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
    const renderStep=()=>{
      const content=document.querySelector('#onboardingContent');
      const progress=document.querySelector('#onboardingProgress');
      const label=document.querySelector('#onboardingStepLabel');
      content.innerHTML=onboardingTemplate(step);
      progress.style.width=`${Math.min(100,((step+1)/5)*100)}%`;
      label.textContent=['PEOPLE OPS // NOVA ADMISSÃO','PEOPLE OPS // BOAS-VINDAS','IDENTITY // CRACHÁ','ORIENTATION // TIME','SECURITY // PRIMEIRO DIA'][step] || 'ONBOARDING';
      const input=content.querySelector('#workerInput'); if(input)setTimeout(()=>input.focus(),40);
      content.querySelector('[data-next]')?.addEventListener('click',()=>{
        const action=content.querySelector('[data-next]').dataset.next;
        if(action==='name'){
          if(!saveProfileName(input?.value||'')){ input?.classList.add('input-error'); return; }
          step=1; renderProfile(); renderStep(); return;
        }
        if(action==='finish'){
          profile.onboardingComplete=true; profile.onboardingCompletedAt=profile.onboardingCompletedAt||Date.now(); persistProfile();
          overlay.classList.remove('show'); overlay.setAttribute('aria-hidden','true'); renderProfile();
          document.querySelector('#workspace')?.scrollIntoView({behavior:'smooth'}); return;
        }
        step=Math.min(4,step+1); renderStep();
      });
      input?.addEventListener('keydown',e=>{if(e.key==='Enter')content.querySelector('[data-next]')?.click();});
    };
    renderStep();
  }

  function appContent(app){
    const fn=safe(firstName(profile?.name));
    const summary=progressSummary();
    const contents={
      teams:`<div class="fake-app-head"><span>TEAMS // BE SAFE CORP. INC.</span><strong># soc-war-room</strong></div><div class="chat-thread"><div><b>03:19</b><strong>Lucas Martins // SOC N1</strong><p>${fn}, tem um endpoint do Financeiro bem estranho. Pode olhar quando entrar?</p></div><div><b>03:21</b><strong>Renata Alves // Infra</strong><p>Pessoal, fechamento financeiro hoje. Antes de isolar host crítico, confirmem impacto.</p></div><div><b>03:24</b><strong>SOCBOT</strong><p>ALERT CORRELATION: comportamento semelhante observado em mais de um endpoint.</p></div><div class="chat-self"><b>AGORA</b><strong>${safe(profile?.name)} // Cybersecurity</strong><p>Você ainda não respondeu. O incidente está na sua fila.</p></div></div><a class="button button-primary" href="lab.html?id=soc-0317">ABRIR INCIDENTE →</a>`,
      mail:`<div class="fake-app-head"><span>MAIL // INBOX</span><strong>2 NÃO LIDOS</strong></div><div class="mail-list"><div class="unread"><span>Helena Costa</span><strong>Bem-vindo à Be Safe Corp. Inc.</strong><small>Seu primeiro dia, acessos e algumas recomendações.</small></div><div class="unread"><span>SOC Notifications</span><strong>[HIGH] INC-2026-0001 aberto</strong><small>Financeiro // comportamento suspeito // triagem pendente.</small></div><div><span>People Operations</span><strong>Seu crachá ${safe(profile?.employeeId)}</strong><small>Identity provisionada com clearance ${safe(profile?.clearance)}.</small></div></div>`,
      tickets:`<div class="fake-app-head"><span>ITSM // MY QUEUE</span><strong>1 PRIORIDADE ALTA</strong></div><div class="ticket-card"><div><span>INC-2026-0001</span><b>HIGH</b></div><h3>Possível comprometimento de endpoint — Financeiro</h3><p>Origem: SOCBOT • Owner: ${safe(profile?.name)} • SLA correndo</p><div class="ticket-meta"><span>STATUS // OPEN</span><span>QUEUE // SOC</span><span>CLIENT // INTERNAL</span></div><a class="button button-lime" href="lab.html?id=soc-0317">ASSUMIR TICKET →</a></div>`,
      meetings:`<div class="fake-app-head"><span>CALENDAR // TODAY</span><strong>1 REUNIÃO AGENDADA</strong></div><div class="meeting-list"><div><time>09:00</time><section><strong>New Hire Security Orientation</strong><p>People Ops + Security // concluída ao finalizar onboarding.</p></section></div><div class="meeting-live"><time>ON CALL</time><section><strong>War Room // INC-2026-0001</strong><p>Será aberta caso o incidente escale. Participantes: SOC, Infra, CISO e Jurídico.</p></section></div><div><time>16:30</time><section><strong>SOC Daily</strong><p>Revisão de alertas, handover e pendências do turno.</p></section></div></div>`,
      soc:`<div class="fake-app-head"><span>SOC CONSOLE // ALERT QUEUE</span><strong class="danger-text">9 WAITING</strong></div><div class="soc-alerts"><div><b>HIGH</b><span>FIN-WS023</span><strong>Suspicious PowerShell + external connection</strong><small>03:17 // FINANCE // CORRELATED</small></div><div><b>MED</b><span>HR-WS014</span><strong>Rare DNS lookup</strong><small>03:08 // HR // UNCONFIRMED</small></div><div><b>LOW</b><span>VPN-GW01</span><strong>Failed authentication burst</strong><small>02:56 // REMOTE ACCESS</small></div></div><a class="button button-primary" href="lab.html?id=soc-0317">INICIAR TRIAGEM →</a>`,
      assets:`<div class="fake-app-head"><span>CMDB // ASSET INVENTORY</span><strong>3.598 ATIVOS</strong></div><div class="asset-stats"><div><span>ENDPOINTS</span><strong>3.412</strong></div><div><span>SERVIDORES</span><strong>186</strong></div><div><span>FILIAIS</span><strong>7</strong></div><div><span>CLOUD</span><strong>AWS + AZURE</strong></div></div><div class="asset-focus"><span>ASSETS EM FOCO</span><p><strong>FIN-WS023</strong> // Windows 11 // Financeiro // Owner: Carlos Gomes</p><p><strong>SRV-FILE-02</strong> // Windows Server // File Services // Tier 1</p><p><strong>HR-WS014</strong> // Windows 11 // RH // Owner: Beatriz Nunes</p></div>`,
      cti:`<div class="fake-app-head"><span>THREAT INTEL // WATCHLIST</span><strong>4 OBSERVÁVEIS</strong></div><div class="intel-list"><div><span>DOMAIN</span><strong>cdn-update-check[.]com</strong><small>Confidence: medium // first seen today</small></div><div><span>IP</span><strong>198.51.100[.]24</strong><small>External connection observed // enrichment pending</small></div><div><span>HASH</span><strong>Pending collection</strong><small>Endpoint evidence required</small></div></div><p class="app-note">Atenção: observável não é automaticamente IOC confirmado. Contexto vem primeiro.</p>`,
      missions:`<div class="fake-app-head"><span>WORK QUEUE // MISSIONS</span><strong>${liveCount} ATIVA</strong></div><div class="queue-summary"><strong>INC-2026-0001</strong><p>SOC — 03:17 // prioridade HIGH // disponível agora.</p><a class="button button-primary" href="lab.html?id=soc-0317">ABRIR →</a></div><button class="button button-ghost" data-scroll-labs>VER ROADMAP COMPLETO</button>`,
      performance:`<div class="fake-app-head"><span>MY PERFORMANCE // ${safe(profile?.employeeId)}</span><strong>${summary.done}/${labs.length} CONCLUÍDAS</strong></div><div class="performance-grid"><div><span>MISSÕES</span><strong>${summary.done}</strong></div><div><span>EM ANDAMENTO</span><strong>${summary.active}</strong></div><div><span>MELHOR SCORE</span><strong>${summary.best??'—'}</strong></div><div><span>EMPLOYEE ID</span><strong>${safe(profile?.employeeId)}</strong></div></div><p class="app-note">Seu progresso fica salvo neste navegador. Relatórios nominais são gerados ao concluir cada missão.</p>`
    };
    return contents[app] || '<p>Aplicativo indisponível.</p>';
  }

  function openApp(app){
    if(!profile?.onboardingComplete){openOnboarding();return;}
    const overlay=document.querySelector('#appOverlay'), title=document.querySelector('#appWindowTitle'), body=document.querySelector('#appWindowBody');
    const labels={teams:'TEAMS',mail:'MAIL',tickets:'TICKETS',meetings:'MEETINGS',soc:'SOC CONSOLE',assets:'ASSET INVENTORY',cti:'THREAT INTEL',missions:'WORK QUEUE',performance:'MY PERFORMANCE'};
    title.textContent=`${labels[app]||'APP'} // BE SAFE CORP. INC.`; body.innerHTML=appContent(app); overlay.classList.add('show'); overlay.setAttribute('aria-hidden','false');
    body.querySelector('[data-scroll-labs]')?.addEventListener('click',()=>{closeApp();document.querySelector('#labs')?.scrollIntoView({behavior:'smooth'});});
  }
  function closeApp(){const o=document.querySelector('#appOverlay');o?.classList.remove('show');o?.setAttribute('aria-hidden','true');}

  function card(lab) {
    const live = lab.status === 'live'; const href = live ? `lab.html?id=${encodeURIComponent(lab.id)}` : '#labs';
    const st=statusOf(lab); const state=labState(lab.id);
    const best=stateBestScore(state);
    const cta=st.kind==='done' ? `BEST ${best ?? '—'}` : st.kind==='active' ? `ETAPA ${(state?.stage||0)+1}` : live ? 'ASSUMIR' : '×';
    return `<a class="lab-card ${live ? '' : 'locked'} ${st.kind}" href="${href}" style="--accent:${lab.accent}" ${live ? '' : 'aria-disabled="true"'}><div class="lab-card-top"><span>JOB #${String(lab.order).padStart(2,'0')} / ${safe(lab.track)}</span><span class="lab-status">${st.label}</span></div><h3>${safe(lab.title)}</h3><p>${safe(lab.short)}</p><div class="lab-meta"><span class="tag">${safe(lab.level)}</span><span class="tag">${safe(lab.duration)}</span>${lab.skills.slice(0,2).map(s => `<span class="tag">${safe(s)}</span>`).join('')}</div><span class="lab-arrow">${cta}</span></a>`;
  }
  function render(filter = document.querySelector('.filter-chip.active')?.dataset.filter || 'ALL') { const filtered = filter === 'ALL' ? labs : labs.filter(l => l.track === filter); grid.innerHTML = filtered.map(card).join(''); }

  document.querySelectorAll('[data-total-labs]').forEach(el=>el.textContent=labs.length);
  document.querySelectorAll('[data-live-labs]').forEach(el=>el.textContent=liveCount);
  document.querySelectorAll('[data-track-count]').forEach(el=>el.textContent=tracks.length);
  chips.innerHTML=['ALL',...tracks].map((t,i)=>`<button class="filter-chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
  chips.addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;chips.querySelectorAll('.filter-chip').forEach(b=>b.classList.remove('active'));btn.classList.add('active');render(btn.dataset.filter);});
  document.querySelector('#appGrid')?.addEventListener('click',e=>{const app=e.target.closest('[data-app]')?.dataset.app;if(app)openApp(app);});
  document.querySelector('#closeApp')?.addEventListener('click',closeApp);
  document.querySelector('#appOverlay')?.addEventListener('click',e=>{if(e.target.id==='appOverlay')closeApp();});
  document.querySelector('#editWorker')?.addEventListener('click',()=>openOnboarding(true));
  document.querySelector('#viewBadge')?.addEventListener('click',()=>{ if(!profile?.name)openOnboarding(); else openOnboarding(false); });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeApp();});

  renderProfile(); render();
  const force = new URLSearchParams(location.search).get('onboarding')==='1';
  if(!profile?.onboardingComplete || force) openOnboarding(false);
})();
