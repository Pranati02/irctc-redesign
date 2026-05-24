/* ============================================================
   IRCTC Redesign — script.js
   ============================================================ */

// ── Set today as min date ──
document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('journey-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // ── Tab switching ──
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ── Swap stations ──
  const swapBtn = document.getElementById('swapBtn');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const from = document.getElementById('from-station');
      const to   = document.getElementById('to-station');
      const temp = from.value;
      from.value = to.value;
      to.value = temp;
      swapBtn.classList.add('spinning');
      setTimeout(() => swapBtn.classList.remove('spinning'), 300);
    });
  }

  // ── Hamburger menu (mobile) ──
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      const navActions = document.querySelector('.nav-actions');
      navLinks.style.display  = navLinks.style.display  === 'flex' ? 'none' : 'flex';
      navActions.style.display = navActions.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // ── Station autocomplete suggestions (demo) ──
  const suggestions = [
    'New Delhi (NDLS)', 'Mumbai Central (MMCT)', 'Howrah Jn (HWH)',
    'Chennai Central (MAS)', 'Bengaluru City (SBC)', 'Hyderabad (HYB)',
    'Ahmedabad Jn (ADI)', 'Pune Jn (PUNE)', 'Jaipur (JP)',
    'Lucknow (LKO)', 'Patna Jn (PNBE)', 'Bhopal (BPL)',
    'Nagpur (NGP)', 'Surat (ST)', 'Agra Cantt (AGC)',
    'Varanasi Jn (BSB)', 'Amritsar Jn (ASR)', 'Chandigarh (CDG)',
    'Goa (MAO)', 'Kochi (ERS)', 'Thiruvananthapuram (TVC)',
    'Visakhapatnam (VSKP)', 'Bhubaneswar (BBS)', 'Guwahati (GHY)',
  ];

  function createSuggestionBox(inputEl) {
    const wrap = inputEl.closest('.station-input-wrap');
    let box = document.createElement('div');
    box.className = 'autocomplete-box';
    wrap.style.position = 'relative';
    wrap.appendChild(box);

    inputEl.addEventListener('input', () => {
      const val = inputEl.value.toLowerCase().trim();
      box.innerHTML = '';
      if (!val) { box.style.display = 'none'; return; }

      const matched = suggestions.filter(s => s.toLowerCase().includes(val)).slice(0, 6);
      if (!matched.length) { box.style.display = 'none'; return; }

      matched.forEach(s => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = s;
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          inputEl.value = s;
          box.style.display = 'none';
        });
        box.appendChild(item);
      });
      box.style.display = 'block';
    });

    inputEl.addEventListener('blur', () => {
      setTimeout(() => { box.style.display = 'none'; }, 150);
    });
  }

  const stationInputs = document.querySelectorAll('.station-input');
  stationInputs.forEach(createSuggestionBox);
});

// ── Search handler ──
function handleSearch() {
  const from    = document.getElementById('from-station')?.value?.trim();
  const to      = document.getElementById('to-station')?.value?.trim();
  const date    = document.getElementById('journey-date')?.value;
  const cls     = document.getElementById('travel-class')?.value;

  if (!from) { showToast('Please enter departure station', 'warn'); return; }
  if (!to)   { showToast('Please enter destination station', 'warn'); return; }
  if (from === to) { showToast('Departure and destination cannot be the same', 'error'); return; }
  if (!date) { showToast('Please select a journey date', 'warn'); return; }

  // Demo: show loading then mock result
  const btn = document.querySelector('.btn-search');
  btn.innerHTML = '<span>Searching…</span> <span class="spinner"></span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>Search Trains</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
    btn.disabled = false;
    showToast(`Found trains from ${from.split('(')[0].trim()} → ${to.split('(')[0].trim()}`, 'success');
  }, 1400);
}

// ── Set route from popular cards ──
function setRoute(from, to) {
  const fromInput = document.getElementById('from-station');
  const toInput   = document.getElementById('to-station');
  if (fromInput) fromInput.value = from;
  if (toInput)   toInput.value = to;

  // Scroll to booking card
  document.querySelector('.booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('Route selected! Click Search Trains.', 'info');
}

// ── Toast notifications ──
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: '#0a9e6e',
    warn:    '#f59e0b',
    error:   '#d93025',
    info:    '#003580',
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: ${colors[type] || colors.info};
    color: #fff;
    padding: 13px 20px;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 6px 24px rgba(0,0,0,.18);
    max-width: 320px;
    animation: slideIn .25s ease;
    cursor: pointer;
  `;
  toast.textContent = message;
  toast.onclick = () => toast.remove();
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 350); }, 3000);
}

// ── Add autocomplete styles dynamically ──
const style = document.createElement('style');
style.textContent = `
  .autocomplete-box {
    display: none;
    position: absolute;
    top: calc(100% + 4px);
    left: 0; right: 0;
    background: #fff;
    border: 1.5px solid #003580;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.12);
    z-index: 50;
    overflow: hidden;
  }
  .autocomplete-item {
    padding: 11px 16px;
    font-size: 14px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
    color: #181c2e;
    cursor: pointer;
    transition: all .15s;
  }
  .autocomplete-item:hover { background: #e8eef8; color: #003580; }
  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { transform: translateX(40px); opacity:0; } to { transform: none; opacity:1; } }
`;
document.head.appendChild(style);
