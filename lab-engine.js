(() => {
  const allLabs = window.BE_SAFE_LABS || [];
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'soc-0317';
  const lab = allLabs.find(l => l.id === id);
  const root = document.querySelector('#labRoot');

  if (!lab || lab.status !== 'live' || !lab.scenario) {
    root.innerHTML = `<main class="player-main"><div class="scenario-kicker">LAB INDISPONÍVEL</div><h1 class="scenario-title">Esse cenário ainda não entrou em produção.</h1><p class="scenario-copy">Volte para a Cyber Range e escolha um lab jogável.</p><a class="button button-primary" href="index.html#labs">VOLTAR AOS LABS ↗</a></main>`;
    return;
  }

  const storageKey = `besafe-range:${lab.id}`;
  let state = { stage:0, score:0, decisions:[], startedAt:Date.now(), finished:false };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && !saved.finished) state = saved;
  } catch (_) {}

  const stages = lab.scenario.stages;
  let timerInterval;

  function persist() { localStorage.setItem(storageKey, JSON.stringify(state)); }
  function fmt(sec) { return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }
  function elapsed() { return Math.max(0, Math.floor((Date.now() - state.startedAt)/1000)); }

  function shell() {
    root.innerHTML = `
      <div class="lab-shell">
        <nav class="lab-nav">
          <a class="brand" href="index.html"><span>BE</span><strong>SAFE</strong><i>CYBER RANGE</i></a>
          <div class="lab-nav-mid">${lab.scenario.company} / ${lab.scenario.role}</div>
          <div class="lab-nav-right"><span class="timer" id="timer">00:00</span><a href="index.html#labs">SAIR ×</a></div>
        </nav>
        <div class="player-grid">
          <aside class="player-sidebar">
            <div class="side-label">LAB ${String(lab.order).padStart(2,'0')}</div>
            <h2 class="lab-title-small">${lab.title}</h2>
            <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
            <div class="side-label">OBJETIVOS</div>
            <div class="objective-list" id="objectives"></div>
            <div class="score-box"><span>SCORE ATUAL</span><strong id="score">0</strong></div>
            <button id="resetLab" class="button button-danger" style="width:100%;margin-top:12px">REINICIAR LAB</button>
          </aside>
          <main class="player-main" id="stageMain"></main>
          <aside class="player-evidence">
            <div class="side-label">EVIDÊNCIAS LIBERADAS</div>
            <div class="evidence-list" id="evidenceList"></div>
            <div class="mitre-mini"><div class="side-label">MITRE OBSERVADO</div><div id="mitreList"></div></div>
          </aside>
        </div>
      </div>`;

    document.querySelector('#resetLab').addEventListener('click', () => {
      if (!confirm('Reiniciar o lab e apagar o progresso deste cenário?')) return;
      localStorage.removeItem(storageKey);
      state = { stage:0, score:0, decisions:[], startedAt:Date.now(), finished:false };
      renderStage();
    });
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    const el = document.querySelector('#timer');
    if (el) el.textContent = fmt(elapsed());
  }

  function cumulativeEvidence(index) {
    return stages.slice(0,index+1).flatMap(s => s.evidence || []);
  }
  function cumulativeMitre(index) {
    return [...new Set(stages.slice(0,index+1).flatMap(s => s.mitre || []))];
  }

  function renderSidebar(index) {
    document.querySelector('#score').textContent = state.score;
    document.querySelector('#progressFill').style.width = `${Math.round((index/stages.length)*100)}%`;
    document.querySelector('#objectives').innerHTML = lab.objectives.map((o,i) => `<div class="objective ${i < index ? 'done':''}"><i></i><span>${o}</span></div>`).join('');
    const evidence = cumulativeEvidence(index);
    document.querySelector('#evidenceList').innerHTML = evidence.length ? evidence.map((e,i) => `
      <div class="evidence-card ${i >= evidence.length-(stages[index].evidence||[]).length ? 'new':''}">
        <b><span>${e.type}</span><span>${String(i+1).padStart(2,'0')}</span></b>
        <strong>${e.title}</strong><p>${e.text}</p>
      </div>`).join('') : `<p class="evidence-empty">Nenhuma evidência liberada.</p>`;
    document.querySelector('#mitreList').innerHTML = cumulativeMitre(index).map(m => `<span class="mitre-chip">${m}</span>`).join('');
  }

  function renderStage() {
    if (state.stage >= stages.length) return finish();
    const s = stages[state.stage];
    renderSidebar(state.stage);
    const previous = state.decisions.find(d => d.stage === state.stage);
    const main = document.querySelector('#stageMain');
    main.innerHTML = `
      <div class="scenario-kicker">${lab.scenario.startTime} / ETAPA ${state.stage+1} DE ${stages.length}</div>
      <h1 class="scenario-title">${state.stage === 0 ? lab.title : s.title}</h1>
      ${state.stage === 0 ? `<p class="scenario-copy">${lab.description}</p><div class="briefing"><strong>BRIEFING DE TURNO</strong><p>${lab.scenario.briefing}</p></div>` : `<p class="scenario-copy">${s.narrative}</p>`}
      ${state.stage === 0 ? `<h2 class="decision-title">${s.title}</h2>` : `<h2 class="decision-title">Sua decisão</h2>`}
      <div class="option-grid" id="options">
        ${s.options.map(o => `<button class="option" data-key="${o.key}" ${previous?'disabled':''}>
          <span class="option-key">${o.key}</span><span><strong>${o.label}</strong><small>${o.detail}</small></span><span class="option-points">DECIDIR</span>
        </button>`).join('')}
      </div>
      <div class="feedback ${previous?'show '+previous.quality:''}" id="feedback">${previous ? `<strong>${previous.quality==='good'?'BOA DECISÃO':'PONTO DE ATENÇÃO'}</strong>${previous.feedback}` : ''}</div>
      <div class="next-wrap ${previous?'show':''}" id="nextWrap"><button class="button button-lime" id="nextStage">${state.stage === stages.length-1 ? 'GERAR RELATÓRIO ↗' : 'PRÓXIMA ETAPA →'}</button></div>`;

    main.querySelector('#options').addEventListener('click', e => {
      const btn = e.target.closest('[data-key]');
      if (!btn || previous) return;
      choose(btn.dataset.key);
    });
    const next = main.querySelector('#nextStage');
    if (next) next.addEventListener('click', () => { state.stage += 1; persist(); renderStage(); });
  }

  function choose(key) {
    const s = stages[state.stage];
    const option = s.options.find(o => o.key === key);
    if (!option) return;
    state.score += option.points;
    state.decisions.push({stage:state.stage,key:option.key,label:option.label,points:option.points,quality:option.quality,feedback:option.feedback});
    persist();
    renderStage();
  }

  function grade(score) {
    if (score >= 95) return ['A+','Resposta excelente'];
    if (score >= 80) return ['A','Pronto para o próximo turno'];
    if (score >= 65) return ['B','Boa base, com decisões para revisar'];
    if (score >= 45) return ['C','Você encontrou parte do caminho'];
    return ['D','Revisão recomendada'];
  }

  function finish() {
    clearInterval(timerInterval);
    state.finished = true;
    const secs = elapsed();
    const max = stages.reduce((sum,s)=> sum + Math.max(...s.options.map(o=>o.points)),0);
    const normalized = Math.max(0, Math.min(100, Math.round((state.score/max)*100)));
    const [letter,label] = grade(normalized);
    const good = state.decisions.filter(d=>d.quality==='good').length;
    const technical = Math.round((good/stages.length)*100);
    const investigation = Math.min(100, Math.round((technical*.75)+(normalized*.25)));
    const documentation = state.decisions[state.decisions.length-1]?.quality === 'good' ? 100 : 55;
    const timeScore = secs <= 35*60 ? 100 : secs <= 50*60 ? 80 : 65;
    const summary = `BE SAFE CYBER RANGE — RELATÓRIO DE LAB\n\nCenário: ${lab.title}\nEmpresa: ${lab.scenario.company}\nFunção: ${lab.scenario.role}\nResultado: ${letter} — ${label}\nScore: ${normalized}/100\nTempo: ${fmt(secs)}\n\nDECISÕES\n${state.decisions.map((d,i)=>`${i+1}. ${d.label} (${d.points>=0?'+':''}${d.points})`).join('\n')}\n\nMITRE OBSERVADO\n${[...new Set(stages.flatMap(s=>s.mitre||[]))].join(', ')}\n\nLEITURA FINAL\nO cenário exigia priorização por contexto, correlação entre fontes, contenção proporcional, ampliação de escopo e documentação objetiva. O score mede as decisões tomadas neste simulador e não substitui avaliação profissional real.`;
    persist();

    document.querySelector('#stageMain').innerHTML = `
      <section class="report">
        <div class="report-head"><div class="scenario-kicker">LAB CONCLUÍDO / ${fmt(secs)}</div><div class="report-grade">${letter}</div><h1>${label}</h1><p class="scenario-copy">Seu turno terminou. O importante aqui não era acertar um quiz: era tomar decisões defensáveis com evidência incompleta.</p></div>
        <div class="report-grid">
          <div class="metric"><span>SCORE</span><strong>${normalized}/100</strong></div>
          <div class="metric"><span>INVESTIGAÇÃO</span><strong>${investigation}%</strong></div>
          <div class="metric"><span>DECISÕES TÉCNICAS</span><strong>${technical}%</strong></div>
          <div class="metric"><span>DOCUMENTAÇÃO</span><strong>${documentation}%</strong></div>
        </div>
        <div class="report-text" id="reportText"></div>
        <div class="hero-actions"><button class="button button-primary" id="copyReport">COPIAR RELATÓRIO</button><button class="button button-ghost" id="retry">REFAZER LAB</button><a class="button button-ghost" href="index.html#labs">VER OUTROS LABS</a></div>
      </section>`;
    document.querySelector('#reportText').textContent = summary;
    document.querySelector('#progressFill').style.width = '100%';
    document.querySelector('#score').textContent = normalized;
    document.querySelector('#objectives').innerHTML = lab.objectives.map(o => `<div class="objective done"><i></i><span>${o}</span></div>`).join('');
    document.querySelector('#copyReport').addEventListener('click', async e => {
      try { await navigator.clipboard.writeText(summary); e.target.textContent = 'COPIADO ✓'; }
      catch (_) { e.target.textContent = 'SELECIONE O RELATÓRIO'; }
    });
    document.querySelector('#retry').addEventListener('click', () => {
      localStorage.removeItem(storageKey);
      location.reload();
    });
  }

  shell();
  if (state.finished) { state = { stage:0, score:0, decisions:[], startedAt:Date.now(), finished:false }; persist(); }
  renderStage();
})();
