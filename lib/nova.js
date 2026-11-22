// NOVA — Centrum voor Herstel. Interactions and GSAP motion, ported 1:1 from the Claude Design prototype.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CH, STORIES, PLACES, REASONS } from './content';

let started = false;

export function initNova() {
  if (started || typeof window === 'undefined') return;
  started = true;
  gsap.registerPlugin(ScrollTrigger);

  // ---------- Helpers ----------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mm = function (q) { return window.matchMedia && window.matchMedia(q).matches; };

  var force = false, reduced = false, pointerOK = false;
  var isNarrow = function () { return window.innerWidth < 1080; };

  var state = {
    choice: null, menuOpen: false, story: 0, openCard: null, loaderDone: false,
    booking: { open: false, step: 'form', place: '', reason: 'Kennismaking', error: false }
  };
  var invoker = null, safety = null, q = null, rfTimer = null;

  function g() { return gsap; }
  function animOK() { return !reduced; }
  function lock(on) { document.documentElement.style.overflow = on ? 'hidden' : ''; }
  function refresh() {
    clearTimeout(rfTimer);
    rfTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 120);
  }

  // ---------- State updates ----------
  function setChoice(i) {
    var prev = state.choice;
    if (prev === i) return;
    state.choice = i;
    $$('[data-opt]').forEach(function (b, j) {
      b.setAttribute('aria-checked', String(j === i));
      b.tabIndex = j === i ? 0 : -1;
    });
    var c = CH[i], rec = $('[data-rec]');
    $('[data-rec-title]').textContent = c.title;
    $('[data-rec-text]').textContent = c.text;
    var more = $('[data-rec-more]');
    more.textContent = c.more;
    more.setAttribute('href', c.target);
    rec.hidden = false;
    if (animOK()) {
      var G = g();
      if (prev == null) G.fromTo(rec, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.65, ease: 'expo.out', onComplete: refresh });
      else G.fromTo(rec.querySelectorAll('h3, p, .rec-actions > *'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.03, ease: 'power2.out' });
      var dot = $('[data-opt="' + i + '"] [data-dot]');
      if (dot) G.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
    }
    refresh();
  }

  function setOpenCard(i) {
    if (state.openCard === i) return;
    state.openCard = i;
    $$('[data-services] .service').forEach(function (a, j) {
      var open = j === i, more = $('[data-card-more]', a), btn = $('.service-toggle', a);
      btn.setAttribute('aria-expanded', String(open));
      $('[data-toggle-label]', btn).textContent = open ? 'Minder informatie' : 'Meer informatie';
      if (open && more.hidden) {
        more.hidden = false;
        if (animOK()) g().fromTo(more, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'expo.out', onComplete: refresh });
      } else if (!open) {
        more.hidden = true;
        gsap.set(more, { clearProps: 'height,opacity' });
      }
    });
    refresh();
  }

  function setStory(i) {
    if (state.story === i) return;
    state.story = i;
    $$('[data-stories] button').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
    var img = $('[data-story-img]');
    img.src = STORIES[i].img;
    img.alt = STORIES[i].alt;
    if (animOK()) g().fromTo('[data-story-frame]', { opacity: 0.25 }, { opacity: 1, duration: 0.7, ease: 'power2.out' });
  }

  function setMenu(open) {
    if (open && !isNarrow()) open = false;
    var was = state.menuOpen;
    state.menuOpen = open;
    var menu = $('[data-mobile-menu]'), tog = $('[data-menu-toggle]');
    menu.hidden = !open;
    tog.setAttribute('aria-expanded', String(open));
    $('[data-menu-label]').textContent = open ? 'Sluiten' : 'Menu';
    if (!was && open && animOK()) {
      g().fromTo(menu, { height: 0 }, { height: 'auto', duration: 0.55, ease: 'expo.out' });
      g().fromTo('[data-menu-item]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out' });
    }
  }

  // ---------- Booking ----------
  function renderBooking() {
    var b = state.booking;
    $$('[data-place-opt]').forEach(function (btn, i) {
      var sel = b.place === PLACES[i];
      btn.setAttribute('aria-checked', String(sel));
      btn.tabIndex = (b.place ? sel : i === 0) ? 0 : -1;
    });
    $$('[data-reason-opt]').forEach(function (btn, i) {
      var sel = b.reason === REASONS[i];
      btn.setAttribute('aria-checked', String(sel));
      btn.tabIndex = sel ? 0 : -1;
    });
    $('[data-place-group]').classList.toggle('has-error', b.error);
    $('[data-place-error]').hidden = !b.error;
    $('[data-summary]').textContent = b.place ? b.reason + ' · ' + b.place : 'Nog geen locatie gekozen';
    $('[data-step="form"]').hidden = b.step !== 'form';
    $('[data-step="done"]').hidden = b.step !== 'done';
    $('[data-modal-panel]').setAttribute('aria-labelledby', b.step === 'done' ? 'boek-titel-done' : 'boek-titel');
    $('[data-b-place]').textContent = b.place;
    $('[data-b-reason]').textContent = b.reason;
    $('[data-receipt]').textContent = b.reason + ' in ' + b.place + '. Je hebt de demo doorlopen.';
  }

  function focusSoon(sel) {
    setTimeout(function () { var n = $(sel); if (n) n.focus({ preventScroll: true }); }, 60);
  }

  function setBooking(patch) {
    var prevStep = state.booking.step;
    for (var k in patch) state.booking[k] = patch[k];
    renderBooking();
    if (state.booking.step !== prevStep) {
      if (animOK()) {
        g().fromTo('[data-step="' + state.booking.step + '"] > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out' });
        if (state.booking.step === 'done') g().fromTo('[data-done-mark]', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.out', delay: 0.15 });
      }
      focusSoon(state.booking.step === 'done' ? '[data-done-btn]' : '[data-modal-panel] [role="radio"][tabindex="0"]');
    }
  }

  function openBooking(trigger, reason, city) {
    invoker = trigger || null;
    var r = reason || (state.choice != null ? CH[state.choice].reason : 'Kennismaking');
    setMenu(false);
    state.booking = { open: true, step: 'form', place: city || '', reason: r, error: false };
    renderBooking();
    $('[data-modal]').hidden = false;
    lock(true);
    if (animOK()) {
      var G = g();
      G.fromTo('[data-modal-backdrop]', { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      G.fromTo('[data-modal-panel]', { opacity: 0, y: 36, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' });
      G.fromTo('[data-step="form"] > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.1, ease: 'power3.out' });
    }
    focusSoon('[data-modal-panel] [role="radio"][tabindex="0"]');
  }

  function closeBooking() {
    if (!state.booking.open || state.closing) return;
    var done = function () {
      state.closing = false;
      state.booking.open = false;
      $('[data-modal]').hidden = true;
      lock(false);
      if (invoker && document.contains(invoker)) invoker.focus({ preventScroll: true });
    };
    if (!animOK()) return done();
    state.closing = true;
    g().to('[data-modal-panel]', { opacity: 0, y: 24, scale: 0.98, duration: 0.25, ease: 'power2.in' });
    g().to('[data-modal-backdrop]', { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: done });
  }

  function submitBooking(e) {
    e.preventDefault();
    if (!state.booking.place) {
      setBooking({ error: true });
      setTimeout(function () {
        var n = $('[data-place-opt]');
        if (n) n.focus();
        if (animOK()) g().fromTo('[data-place-group]', { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      }, 30);
      return;
    }
    setBooking({ step: 'done', error: false });
  }

  function trap(e) {
    var panel = $('[data-modal-panel]');
    var f = $$('button, [href], input, select, textarea, [tabindex]', panel).filter(function (n) {
      return !n.disabled && n.getAttribute('tabindex') !== '-1' && n.offsetParent !== null;
    });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ---------- Navigation ----------
  function scrollToHash(hash) {
    var behavior = reduced ? 'auto' : 'smooth';
    if (hash === '#top') { window.scrollTo({ top: 0, behavior: behavior }); return; }
    var t = document.getElementById(hash.slice(1));
    if (!t) return;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 12, behavior: behavior });
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  }

  // ---------- Events ----------
  function bindEvents() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : e.target.parentElement;
      var link = t.closest('[data-nav-link]');
      if (link) {
        var h = link.getAttribute('href');
        if (h && h.charAt(0) === '#') { e.preventDefault(); setMenu(false); scrollToHash(h); }
        return;
      }
      var cityBtn = t.closest('[data-book-city]');
      if (cityBtn) return openBooking(cityBtn, null, cityBtn.getAttribute('data-book-city'));
      var book = t.closest('[data-book]');
      if (book) return openBooking(book, book.getAttribute('data-book') || null);
      if (t.closest('[data-close]')) return closeBooking();
      if (t.closest('[data-restart]')) return setBooking({ step: 'form', place: '', error: false });
    });

    $('[data-menu-toggle]').addEventListener('click', function () { setMenu(!state.menuOpen); });
    $('[data-rec-book]').addEventListener('click', function (e) {
      openBooking(e.currentTarget, state.choice != null ? CH[state.choice].reason : null);
    });
    $('[data-rec-more]').addEventListener('click', function (e) {
      e.preventDefault();
      if (state.choice == null) return;
      var c = CH[state.choice];
      if (c.card != null) setOpenCard(c.card);
      scrollToHash(c.target);
    });
    $('[data-step="form"]').addEventListener('submit', submitBooking);

    // Arrow keys move selection within every radio group.
    $$('[data-radiogroup]').forEach(function (grp) {
      grp.addEventListener('keydown', function (e) {
        var keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (!(e.key in keys)) return;
        var items = $$('[role="radio"]', grp), i = items.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        var n = items[(i + keys[e.key] + items.length) % items.length];
        n.click(); n.focus();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (state.booking.open) closeBooking();
        else if (state.menuOpen) setMenu(false);
      }
      if (e.key === 'Tab' && state.booking.open) trap(e);
    });

    var lastNarrow = isNarrow();
    window.addEventListener('resize', function () {
      var n = isNarrow();
      if (n !== lastNarrow) { lastNarrow = n; setMenu(false); }
      layoutRoute();
      refresh();
    });

    // Image zoom on hover (cards + side photo).
    $$('[data-zoom-host]').forEach(function (host) {
      var img = $('[data-zoom]', host);
      host.addEventListener('mouseenter', function () { if (animOK()) g().to(img, { scale: 1.05, duration: 0.9, ease: 'power3.out' }); });
      host.addEventListener('mouseleave', function () { if (animOK()) g().to(img, { scale: 1, duration: 0.7, ease: 'power3.out' }); });
    });

    // Hero lens follows the pointer within the photo only.
    var fig = $('[data-hero-figure]');
    fig.addEventListener('mousemove', function (e) {
      if (!q) return;
      var r = fig.getBoundingClientRect();
      var nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      var ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      q.lx(nx * 8); q.ly(ny * 5); q.ry(nx * 1.2); q.rx(-ny * 1.2); q.sx(-nx * 2); q.sy(-ny * 2);
    });
    fig.addEventListener('mouseleave', function () {
      if (!q) return;
      Object.keys(q).forEach(function (k) { q[k](0); });
    });
  }

  // ---------- Loader + intro ----------
  function removeLoader() {
    $$('[data-loader], [data-loader-logo]').forEach(function (n) { n.hidden = true; });
  }

  function skipLoader() {
    if (state.loaderDone) return;
    gsap.set(['[data-nav-logo]', '[data-nav-fade]', '[data-hero-in]', '[data-hero-line]', '[data-hero-img]', '[data-lens]', '[data-finder]', '[data-hero-photo]'], { clearProps: 'opacity,transform,clipPath' });
    state.loaderDone = true;
    clearTimeout(safety);
    removeLoader();
    lock(false);
    if (animOK()) setupScroll();
  }

  function heroReady() {
    var img = $('[data-hero-img]');
    return new Promise(function (r) {
      if (!img || img.complete) return r();
      img.addEventListener('load', r, { once: true });
      img.addEventListener('error', r, { once: true });
      setTimeout(r, 3000);
    });
  }

  function boot() {
    var G = g();
    G.set('[data-nav-logo]', { opacity: 0 });
    G.set('[data-nav-fade]', { opacity: 0 });
    G.set('[data-hero-line]', { yPercent: 110 });
    G.set('[data-hero-in]', { opacity: 0, y: 30 });
    G.set('[data-hero-photo]', { clipPath: 'inset(14% 8% 14% 44% round 24px)' });
    G.set('[data-hero-img]', { scale: 1.2 });
    G.set('[data-lens]', { opacity: 0, x: -70 });
    G.set('[data-finder]', { opacity: 0, y: 60 });
    setupPointer();
    runLoader();
  }

  // Clean loader: the arc fills, NOVA appears beneath it, and the dark field shrinks into the nav bar.
  // The arc and the word are clipped from the same raster logo, so the arc keeps its sharp ends throughout.
  function runLoader() {
    var G = g();
    var L = $('[data-loader]'), logo = $('[data-loader-logo]'), ghost = $('[data-loader-ghost]'),
      fill = $('[data-loader-fill]'), word = $('[data-loader-word]');
    if (!L || !logo || !fill || !word) return skipLoader();
    var vw = window.innerWidth, vh = window.innerHeight;
    var W = Math.min(260, vw * 0.5), H = W * 263 / 600;
    G.set(L, { top: 0, left: 0, width: vw, height: vh, borderRadius: 0 });
    G.set(logo, { left: (vw - W) / 2, top: (vh - H) / 2, width: W, xPercent: 0, yPercent: 0, x: 0, y: 0 });
    G.set(word, { y: 0.06 * H });

    var t1 = G.timeline();
    t1.from(ghost, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0)
      .to(fill, { clipPath: 'inset(0% 0% 61% 0%)', duration: 1.4, ease: 'power3.inOut' }, 0.2);

    Promise.all([t1.then(), heroReady()]).then(function () {
      if (state.loaderDone) return;
      var nav = $('[data-nav]').getBoundingClientRect();
      var nl = $('[data-nav-logo]').getBoundingClientRect();
      var t2 = G.timeline()
        .set(ghost, { opacity: 0 })
        .to(word, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
        .addLabel('morph', '+=0.35')
        .to(L, { top: nav.top, left: nav.left, width: nav.width, height: nav.height, borderRadius: 16, duration: 1.15, ease: 'expo.inOut' }, 'morph')
        .to(logo, { left: nl.left, top: nl.top, width: nl.width, duration: 1.15, ease: 'expo.inOut' }, 'morph');
      // Matches Claude Design timing: there the hero intro ran on its own timeline, starting together
      // with the NOVA reveal (behind the loader), so the hero is already in place when the field shrinks.
      oneFrameAhead(heroIntro());
      t2.call(endLoader, null, 'morph+=1.15');
    });
  }

  function endLoader() {
    if (state.loaderDone) return;
    var G = g();
    G.set('[data-nav-logo]', { opacity: 1 });
    state.loaderDone = true;
    clearTimeout(safety);
    removeLoader();
    lock(false);
    oneFrameAhead(G.to('[data-nav-fade]', { opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power2.out' }));
    if (!reduced) setupScroll();
  }

  // In Claude Design these animations were created from inside the loader's tick and started one
  // frame further along; this reproduces that exact timing.
  function oneFrameAhead(anim) {
    anim.time(gsap.ticker.deltaRatio(1000) / 1000);
    return anim;
  }

  function heroIntro() {
    var tl = g().timeline();
    tl.to('[data-hero-photo]', { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.4, ease: 'expo.out' }, 0)
      .to('[data-hero-img]', { scale: 1, duration: 1.9, ease: 'expo.out' }, 0)
      .to('[data-hero-line]', { yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out' }, 0.1)
      .to('[data-hero-in]', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.25)
      .to('[data-lens]', { opacity: 1, x: 0, duration: 1.8, ease: 'expo.out' }, 0.5)
      .to('[data-finder]', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.45);
    return tl;
  }

  function setupPointer() {
    if (!pointerOK) return;
    var G = g(), o = { duration: 1.1, ease: 'power3.out' };
    q = {
      lx: G.quickTo('[data-lens-inner]', 'x', o), ly: G.quickTo('[data-lens-inner]', 'y', o),
      ry: G.quickTo('[data-lens-inner]', 'rotationY', o), rx: G.quickTo('[data-lens-inner]', 'rotationX', o),
      sx: G.quickTo('[data-hero-shift]', 'x', o), sy: G.quickTo('[data-hero-shift]', 'y', o)
    };
  }

  function setupScroll() {
    var G = g();
    $$('[data-reveal]').forEach(function (n) {
      G.fromTo(n, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: n, start: 'top 88%', once: true } });
    });
    $$('[data-stagger]').forEach(function (gp) {
      G.fromTo(gp.children, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: gp, start: 'top 86%', once: true } });
    });
    G.to('[data-hero-shift]', { scale: 1.07, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
    G.to('[data-lens]', { y: -28, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
    G.fromTo('[data-parallax]', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '[data-story-frame]', start: 'top bottom', end: 'bottom top', scrub: true } });
    var vpath = $('[data-route-v]');
    if (vpath) {
      G.set(vpath, { strokeDasharray: 1, strokeDashoffset: 1 });
      G.to(vpath, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-route-v-svg]', start: 'top 80%', end: 'bottom 55%', scrub: true } });
    }
    var path = $('[data-route]');
    if (path) {
      var len = path.getTotalLength();
      G.set(path, { strokeDasharray: len, strokeDashoffset: len });
      G.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-spread]', start: 'top 75%', end: 'center 50%', scrub: true } });
    }
    G.fromTo('[data-signature]', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-closing]', start: 'top 80%', once: true } });
    window.addEventListener('load', refresh, { once: true });
    refresh();
  }

  // ---------- Story route: horizontal curve side by side, vertical line when the photos stack ----------
  function layoutRoute() {
    var spread = $('[data-spread]'), svg = $('[data-route-v-svg]');
    if (!spread || !svg) return;
    var main = $('.spread-main .story-frame', spread), side = $('.spread-side .zoom-frame', spread);
    var stacked = side.getBoundingClientRect().top >= main.getBoundingClientRect().bottom;
    spread.classList.toggle('is-stacked', stacked);
    if (!stacked) return;
    var s = spread.getBoundingClientRect(), m = main.getBoundingClientRect(), d = side.getBoundingClientRect();
    var top = m.bottom - s.top - 28, height = d.top - s.top + 28 - top, width = 80;
    svg.style.top = top + 'px';
    svg.style.left = (m.right - s.left - width - Math.min(56, m.width * 0.12)) + 'px';
    svg.style.width = width + 'px';
    svg.style.height = height + 'px';
  }

  // ---------- Bind server-rendered lists ----------
  function bindStatic() {
    $$('[data-opt]').forEach(function (b, i) { b.addEventListener('click', function () { setChoice(i); }); });
    $$('[data-services] .service').forEach(function (a, i) {
      $('.service-toggle', a).addEventListener('click', function () { setOpenCard(state.openCard === i ? null : i); });
    });
    $$('[data-stories] button').forEach(function (b, i) { b.addEventListener('click', function () { setStory(i); }); });
    $$('[data-place-opt]').forEach(function (b) { b.addEventListener('click', function () { setBooking({ place: b.getAttribute('data-place-opt'), error: false }); }); });
    $$('[data-reason-opt]').forEach(function (b) { b.addEventListener('click', function () { setBooking({ reason: b.getAttribute('data-reason-opt') }); }); });
  }

  // ---------- Start ----------
  force = /[?&]motion=on/.test(window.location.search);
  reduced = !force && mm('(prefers-reduced-motion: reduce)');
  pointerOK = mm('(pointer: fine)') && !reduced;
  bindStatic();
  bindEvents();
  layoutRoute();
  window.addEventListener('load', layoutRoute, { once: true });
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  window.scrollTo(0, 0);
  lock(true);
  safety = setTimeout(function () { if (!state.loaderDone) skipLoader(); }, 12000);
  boot();
}
