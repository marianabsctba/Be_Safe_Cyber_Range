(() => {
  const labs = window.BE_SAFE_LABS || [];
  const grid = document.querySelector('#labGrid');
  const chips = document.querySelector('#filters');
  const liveCount = labs.filter(l => l.status === 'live').length;
  const tracks = [...new Set(labs.map(l => l.track))].sort();

  document.querySelectorAll('[data-total-labs]').forEach(el => el.textContent = labs.length);
  document.querySelectorAll('[data-live-labs]').forEach(el => el.textContent = liveCount);
  document.querySelectorAll('[data-track-count]').forEach(el => el.textContent = tracks.length);

  function card(lab) {
    const live = lab.status === 'live';
    const href = live ? `lab.html?id=${encodeURIComponent(lab.id)}` : '#labs';
    return `
      <a class="lab-card ${live ? '' : 'locked'}" href="${href}" style="--accent:${lab.accent}" ${live ? '' : 'aria-disabled="true"'}>
        <div class="lab-card-top">
          <span>#${String(lab.order).padStart(2,'0')} / ${lab.track}</span>
          <span class="lab-status">${live ? 'JOGÁVEL' : 'EM PRODUÇÃO'}</span>
        </div>
        <h3>${lab.title}</h3>
        <p>${lab.short}</p>
        <div class="lab-meta">
          <span class="tag">${lab.level}</span>
          <span class="tag">${lab.duration}</span>
          ${lab.skills.slice(0,2).map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
        <span class="lab-arrow">${live ? '↗' : '×'}</span>
      </a>`;
  }

  function render(filter = 'ALL') {
    const filtered = filter === 'ALL' ? labs : labs.filter(l => l.track === filter);
    grid.innerHTML = filtered.map(card).join('');
  }

  chips.innerHTML = ['ALL', ...tracks].map((t,i) => `<button class="filter-chip ${i===0?'active':''}" data-filter="${t}">${t}</button>`).join('');
  chips.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    chips.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.filter);
  });
  render();
})();
