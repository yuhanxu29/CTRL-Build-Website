/* CTRL Build, v7. Plain JavaScript, no build step. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const CONTACT = 'ctrlbuildto@gmail.com';

  /* Paste the Google Apps Script web app URL here (see apps-script/Code.gs). Empty = forms ask visitors to email us. */
  const FORM_ENDPOINT = '';

  /* ---------- Art: hand-set skyline and lake (ASCII accents only) ---------- */
  function skyline(heights, widths) {
    const H = Math.max(...heights);
    const rows = [];
    for (let r = H; r >= 1; r--) {
      let s = '';
      heights.forEach((h, i) => {
        const w = widths[i];
        for (let c = 0; c < w; c++) {
          if (h < r) s += ' ';
          else if (h === r) s += '_';
          else if (c === 0 || c === w - 1) s += '|';
          else s += ((r * 7 + c * 3 + i) % 5 === 0) ? ':' : ' ';
        }
        s += ' ';
      });
      rows.push(s.replace(/\s+$/, ''));
    }
    rows.push(heights.map((h, i) => '='.repeat(widths[i]) + ' ').join('').trimEnd());
    return rows.join('\n');
  }
  function lake(cols, rows) {
    const out = [];
    for (let r = 0; r < rows; r++) {
      let s = '';
      for (let c = 0; c < cols; c++) s += ((c + r * 3) % 7 === 0) ? '~' : ((c + r) % 11 === 0 ? '-' : ' ');
      out.push(s);
    }
    return out.join('\n');
  }
  const DAY_HEIGHTS = [3, 5, 4, 7, 6, 9, 5, 4, 6, 3, 4, 8, 5, 3, 4];
  const DAY_WIDTHS = [5, 6, 4, 7, 5, 6, 4, 5, 6, 4, 5, 7, 5, 4, 6];
  /* The skyline's windows (":") get a second, amber layer that fades in as the scroll moves toward night. */
  const dayArt = $('#dayArt');
  let cityLit = null;
  if (dayArt) {
    const art = skyline(DAY_HEIGHTS, DAY_WIDTHS);
    dayArt.textContent = art;
    const wrap = document.createElement('div');
    wrap.className = 'city';
    cityLit = document.createElement('pre');
    cityLit.className = 'ascii city-lit';
    cityLit.setAttribute('aria-hidden', 'true');
    cityLit.textContent = art.replace(/[^:\n]/g, ' ');
    dayArt.replaceWith(wrap);
    wrap.append(dayArt, cityLit);
  }
  /* Footer skyline: same two-layer idea, lit as the footer scrolls into view. */
  const footArt = $('#footArt');
  let footLit = null;
  if (footArt) {
    const art = skyline(DAY_HEIGHTS.slice(4), DAY_WIDTHS.slice(4)) + '\n' + lake(120, 5);
    footArt.textContent = art;
    const wrap = document.createElement('div');
    wrap.className = 'city';
    footLit = document.createElement('pre');
    footLit.className = 'ascii foot-art city-lit';
    footLit.setAttribute('aria-hidden', 'true');
    footLit.textContent = art.replace(/[^:\n]/g, ' ');
    footArt.replaceWith(wrap);
    wrap.append(footArt, footLit);
  }
  const footEl = $('.foot');

  /* ---------- Intro: press Ctrl + B ---------- */
  const introEl = $('#intro'), kbdEl = $('#kbd'), haze = $('.haze');
  let introSeen = false; try { introSeen = sessionStorage.getItem('ctrlIntro') === '1'; } catch (e) {}
  let introPressed = false, introAuto = 0;
  function markIntroSeen() { try { sessionStorage.setItem('ctrlIntro', '1'); } catch (e) {} }
  function endIntro() {
    if (!introEl || introEl.classList.contains('leave')) return;
    clearTimeout(introAuto); markIntroSeen();
    introEl.classList.add('leave');
    setTimeout(() => { introEl.hidden = true; }, 950);
  }
  function spawnRipple() {
    const box = $('#ripple'); if (!box) return;
    box.textContent = '';
    const chars = '+*.';
    for (let i = 0; i < 28; i++) {
      const a = i / 28 * Math.PI * 2, r = 130 + ((i * 37) % 90);
      const sp = document.createElement('span');
      sp.textContent = chars[i % chars.length];
      sp.style.setProperty('--x', (Math.cos(a) * r).toFixed(1) + 'px');
      sp.style.setProperty('--y', (Math.sin(a) * r).toFixed(1) + 'px');
      sp.style.animationDelay = (i * 8) + 'ms';
      box.appendChild(sp);
    }
    box.classList.remove('go'); void box.offsetWidth; box.classList.add('go');
  }
  function pressIntro() {
    if (introPressed || !introEl || !kbdEl) return;
    introPressed = true; clearTimeout(introAuto);
    kbdEl.classList.add('down');
    setTimeout(() => kbdEl.classList.remove('down'), 260);
    spawnRipple();
    setTimeout(endIntro, 420);
  }
  function typeText(el, text) {
    if (!el) return;
    let i = 0; el.textContent = '';
    const t = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(t); }, 70);
  }
  function startIntro() {
    introEl.hidden = false;
    const narrow = matchMedia('(max-width: 900px)').matches;
    typeText($(narrow ? '.i-tap' : '.i-desk', introEl), narrow ? 'TAP CTRL + B' : 'PRESS CTRL + B');
    const fill = $('#waitFill');
    if (fill) requestAnimationFrame(() => requestAnimationFrame(() => fill.classList.add('go')));
    introAuto = setTimeout(pressIntro, 5000);
  }
  if (introEl && kbdEl) {
    if (introSeen || RM || location.hash) introEl.hidden = true; else startIntro();
    kbdEl.addEventListener('click', pressIntro);
    $('#introSkip').addEventListener('click', endIntro);
    addEventListener('keydown', e => {
      if (introEl.hidden || introEl.classList.contains('leave')) return;
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'b' || e.key === 'B')) { e.preventDefault(); pressIntro(); }
      else if (e.key === 'Escape') endIntro();
      else if (e.key === 'Enter' && !e.target.closest('button,a,input,select,textarea')) pressIntro();
    });
  }
  if (haze) addEventListener('visibilitychange', () => { haze.style.animationPlayState = document.hidden ? 'paused' : 'running'; });

  /* ---------- Bands: pause control ---------- */
  $$('.pause').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', String(!on));
    b.textContent = on ? 'Pause' : 'Play';
    b.closest('.bands').classList.toggle('paused', !on);
  }));

  /* ---------- Tape: repeat each run once so the CSS loop is seamless ---------- */
  $$('.run').forEach(r => [...r.children].forEach(c => {
    const d = c.cloneNode(true);
    d.setAttribute('aria-hidden', 'true');
    r.appendChild(d);
  }));

  /* ---------- Reveals and character flips ---------- */
  function scramble(el) {
    const final = el.dataset.text || el.textContent;
    if (RM) { el.textContent = final; return; }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let f = 0; const max = 16;
    const t = setInterval(() => {
      f++;
      el.textContent = [...final].map((c, i) => (i < f * final.length / max ? c : (c === ' ' ? ' ' : chars[Math.random() * chars.length | 0]))).join('');
      if (f >= max) { el.textContent = final; clearInterval(t); }
    }, 38);
  }
  const reveal = $$('.rv, [data-scramble]');
  if (RM || !('IntersectionObserver' in window)) {
    reveal.forEach(e => { e.classList.add('in'); if (e.hasAttribute('data-scramble')) e.textContent = e.dataset.text || e.textContent; });
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.hasAttribute('data-scramble')) scramble(en.target);
      io.unobserve(en.target);
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(e => io.observe(e));
  }

  /* ---------- Accordions (FAQ, tracks) ---------- */
  function toggleRow(btn) {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    btn.parentElement.classList.toggle('open', open);
  }
  $$('.qi > .q, .trk > .trk-h').forEach(b => b.addEventListener('click', () => toggleRow(b)));

  /* ---------- FAQ search and filters ---------- */
  const qi = $$('.qi');
  const faqQ = $('#faqQ'), faqEmpty = $('#faqEmpty');
  let faqCat = 'all';
  function faqFilter() {
    const term = (faqQ ? faqQ.value : '').trim().toLowerCase();
    let shown = 0;
    qi.forEach(item => {
      const hit = (faqCat === 'all' || item.dataset.cat === faqCat) && (!term || item.textContent.toLowerCase().includes(term));
      item.hidden = !hit;
      if (hit) shown++;
    });
    if (faqEmpty) faqEmpty.hidden = shown > 0;
  }
  $$('.chips button').forEach(b => b.addEventListener('click', () => {
    faqCat = b.dataset.cat;
    $$('.chips button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    faqFilter();
  }));
  if (faqQ) faqQ.addEventListener('input', faqFilter);

  /* ---------- Sticky header and mobile menu ---------- */
  const menuBtn = $('#menuBtn'), menu = $('#menu');
  if (menuBtn && menu) menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  });
  /* Close the mobile menu when a link is tapped, and on Escape. */
  if (menuBtn && menu) {
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }));
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        menuBtn.focus();
      }
    });
  }
  const navLinks = $$('.nav a[data-sec]');
  const secs = navLinks.map(a => $('#' + a.dataset.sec)).filter(Boolean);
  const bar = $('#bottomBar'), hero = $('#top');

  /* ---------- Scroll-linked scenes ---------- */
  const whatSec = $('#what'), whatKey = $('#whatKey'), whatWord = $('#whatWord');
  const daySec = $('#day'), dayPin = $('#dayPin'), dayTrack = $('#dayTrack'), dayClock = $('#dayClock'), dayBar = $('#dayBar');
  const stops = $$('.stop');
  const MORN = [[242, 250, 255], [202, 230, 248], [241, 232, 201]];
  const NIGHT = [[11, 26, 46], [18, 41, 71], [35, 37, 43]];
  const mixC = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const fmt = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

  function progress(sec) {
    const r = sec.getBoundingClientRect();
    const total = sec.offsetHeight - innerHeight;
    return clamp(-r.top / Math.max(total, 1));
  }
  function frame() {
    if (whatSec && whatKey && whatWord) {
      const p = progress(whatSec);
      if (!RM) {
        whatKey.style.transform = `rotateY(${p * 360}deg)`;
        whatWord.style.transform = `translate3d(${(20 - p * 80).toFixed(2)}vw,-50%,0)`;
      }
    }
    if (daySec && dayPin) {
      const p = progress(daySec);
      const top = mixC(MORN[0], NIGHT[0], p), mid = mixC(MORN[1], NIGHT[1], p), bot = mixC(MORN[2], NIGHT[2], p);
      dayPin.style.background = `linear-gradient(180deg,rgb(${top}) 0%,rgb(${mid}) 55%,rgb(${bot}) 100%)`;
      /* Lettering runs from ink in the morning to amber as the sky goes dark, with a warm glow to match. */
      const warm = clamp((p - .45) / .4);
      dayPin.style.setProperty('--ink', `rgb(${mixC([14, 37, 64], [255, 194, 75], warm)})`);
      dayPin.style.setProperty('--glow', clamp((p - .5) / .5).toFixed(2));
      const minutes = 600 + Math.round(p * 600 / 5) * 5;
      if (dayClock) dayClock.textContent = fmt(minutes);
      if (dayBar) dayBar.style.transform = `scaleX(${p})`;
      if (cityLit) cityLit.style.opacity = clamp((p - .3) / .45).toFixed(2);
      if (dayTrack) {
        const max = Math.max(0, dayTrack.offsetHeight - dayPin.clientHeight * .45);
        dayTrack.style.transform = `translate3d(0,${(-p * max).toFixed(1)}px,0)`;
      }
      stops.forEach(s => s.classList.toggle('past', +s.dataset.m <= minutes));
    }
    if (footLit && footEl) {
      const fr = footEl.getBoundingClientRect();
      footLit.style.opacity = clamp((innerHeight - fr.top) / (innerHeight * .9)).toFixed(2);
    }
    if (bar && hero) bar.classList.toggle('show', hero.getBoundingClientRect().bottom < 0);
    let current = null;
    secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .4) current = s.id; });
    navLinks.forEach(a => { if (a.dataset.sec === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  let ticking = false;
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; frame(); }); } };
  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', requestFrame);
  frame();

  /* ---------- Modal and forms ---------- */
  const modal = $('#modal'), modalBody = $('#modalBody');
  function openModal(kind, pkg) {
    const tpl = $('#tpl-' + kind);
    if (!tpl || !modal) return;
    modalBody.replaceChildren(tpl.content.cloneNode(true));
    const sel = modalBody.querySelector('select[name="package"]');
    if (sel && pkg) sel.value = pkg;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    const first = modalBody.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (!b) return;
    e.preventDefault();
    openModal(b.dataset.open, b.dataset.pkg);
  });
  if (modal) {
    $('#modalClose').addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  }

  function setStatus(form, msg, kind) {
    const s = form.querySelector('.form-status');
    if (!s) return;
    s.textContent = msg; s.dataset.kind = kind;
  }
  function validate(form) {
    let ok = true;
    $$('[required]', form).forEach(f => {
      const v = f.value.trim();
      const bad = !v || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      f.setAttribute('aria-invalid', String(bad));
      if (bad && ok) { f.focus(); ok = false; }
    });
    return ok;
  }
  async function submitForm(form) {
    const type = form.dataset.form;
    if (!validate(form)) { setStatus(form, 'Please fill in the highlighted fields.', 'error'); return; }
    if (!FORM_ENDPOINT) {
      setStatus(form, `Sign-ups are coming soon. Email ${CONTACT} and we will add you by hand.`, 'info');
      return;
    }
    const fd = new FormData(form);
    const payload = {
      type,
      name: fd.get('name') || '',
      email: fd.get('email') || '',
      company: fd.get('company') || '',
      contact: fd.get('contact') || '',
      package: fd.get('package') || '',
      message: fd.get('message') || '',
      website: fd.get('website') || '',
      page: location.href
    };
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    setStatus(form, 'Sending...', 'info');
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!j || !j.ok) throw new Error('not saved');
      form.reset();
      setStatus(form, 'Saved. Thanks, we will be in touch.', 'success');
    } catch (err) {
      setStatus(form, `That did not go through. Please email ${CONTACT} and we will sort it out.`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }
  document.addEventListener('submit', e => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    submitForm(f);
  });
  $$('[data-contact]').forEach(a => a.setAttribute('href', 'mailto:' + CONTACT));
})();
