// Edit this object to update the active lineup and season totals.
const TEAM_DATA = {
  stats: [
    { label: 'MATCHES PLAYED', value: 248, suffix: '+' },
    { label: 'BOOYAHS', value: 86, suffix: '' },
    { label: 'TOTAL KILLS', value: 1842, suffix: '+' },
    { label: 'WIN RATE', value: 34, suffix: '%' }
  ],
  roster: [
    { name: 'NΞXUS', role: 'IGL / CAPTAIN', uid: '7284 1093', symbol: 'N' },
    { name: 'VØRTEX', role: 'RUSHER', uid: '6192 8430', symbol: 'V' },
    { name: 'FΛTAL', role: 'SNIPER', uid: '8430 2167', symbol: 'F' },
    { name: 'ECLIPSE', role: 'SUPPORT', uid: '5027 9914', symbol: 'E' }
  ]
};

const rosterGrid = document.querySelector('#roster-grid');
rosterGrid.innerHTML = TEAM_DATA.roster.map((player, index) => `
  <article class="player-card">
    <div class="player-portrait"><span class="portrait-code">NS • 0${index + 1}</span><span class="portrait-symbol">${player.symbol}</span><span class="player-role">${player.role}</span></div>
    <div class="player-info"><h3 class="player-name">${player.name}</h3><div class="player-meta"><span>FREE FIRE UID</span><b>${player.uid}</b></div></div>
  </article>`).join('');
document.querySelector('#roster-count').textContent = `${String(TEAM_DATA.roster.length).padStart(2, '0')} PLAYERS`;
document.querySelector('#stats-grid').innerHTML = TEAM_DATA.stats.map(stat => `
  <div class="stat-card"><div class="stat-number" data-value="${stat.value}" data-suffix="${stat.suffix}">0</div><div class="stat-label">${stat.label}</div></div>`).join('');

// Count stats up when they first enter view.
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, end = Number(el.dataset.value), suffix = el.dataset.suffix;
    const duration = 1000, started = performance.now();
    const tick = now => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(end * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

// Demo applications are validated in-browser; connect this handler to an API to persist submissions.
document.querySelector('#join-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = new FormData(event.currentTarget);
  document.querySelector('#join-message').textContent = `Application ready, ${data.get('name')}! Your details have been captured in this demo. Connect a form backend to receive applications.`;
  event.currentTarget.reset();
});

// Opens the visitor's mail app with their message. Replace the address in this file to update the destination.
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`NS Esports enquiry from ${data.get('contactName')}`);
  const body = encodeURIComponent(`From: ${data.get('contactName')} (${data.get('email')})\n\n${data.get('message')}`);
  document.querySelector('#contact-message').textContent = 'Opening your email app with the message filled in…';
  window.location.href = `mailto:hello@nsesports.gg?subject=${subject}&body=${body}`;
});
