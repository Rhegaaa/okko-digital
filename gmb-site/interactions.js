export function initializeGmb(root = document) {
  const cleanups = [];
  const listen = (element, name, handler) => {
    if (!element) return;
    element.addEventListener(name, handler);
    cleanups.push(() => element.removeEventListener(name, handler));
  };
  const tabs = [...root.querySelectorAll('[data-tab]')];
  const selectTab = (name, focus = false) => {
    for (const tab of tabs) {
      const active = tab.dataset.tab === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = root.querySelector(`#${tab.getAttribute('aria-controls')}`);
      if (panel) panel.hidden = !active;
      if (active && focus) tab.focus();
    }
    const feedback = root.querySelector('.demo-feedback');
    if (feedback) feedback.textContent = '';
  };
  for (const [index, tab] of tabs.entries()) {
    listen(tab, 'click', () => selectTab(tab.dataset.tab));
    listen(tab, 'keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        selectTab(tabs[target].dataset.tab, true);
      }
    });
  }
  listen(root.querySelector('[data-open-photos]'), 'click', () => selectTab('photos'));
  listen(root.querySelector('[data-open-reviews]'), 'click', () => selectTab('reviews'));
  for (const action of root.querySelectorAll('[data-demo-action]')) {
    listen(action, 'click', () => {
      const feedback = root.querySelector('.demo-feedback');
      if (feedback) feedback.textContent = `${action.dataset.demoAction} : exemple de démonstration, aucun établissement réel n’est contacté.`;
    });
  }
  const toggle = root.querySelector('.menu-toggle');
  const menu = root.querySelector('#mobile-menu');
  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    toggle.querySelector('span').textContent = '+';
  };
  listen(toggle, 'click', () => {
    if (!menu) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    menu.hidden = open;
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.querySelector('span').textContent = open ? '+' : '−';
  });
  for (const anchor of root.querySelectorAll('#mobile-menu a')) listen(anchor, 'click', closeMenu);
  listen(menu, 'keydown', event => {
    if (event.key === 'Escape') { closeMenu(); toggle.focus(); }
  });
  const site = root.querySelector('.gmb-site');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (site && !reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    site.classList.add('has-motion');
    for (const element of site.querySelectorAll('[data-reveal]')) observer.observe(element);
    cleanups.push(() => { observer.disconnect(); site.classList.remove('has-motion'); });
    const scene = root.querySelector('.hero-scene');
    const image = root.querySelector('.scene-photo img');
    let frame = 0;
    const updateImage = () => {
      frame = 0;
      if (!scene || !image || reduced.matches || window.innerWidth < 651) return;
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const delta = Math.max(-20, Math.min(20, (innerHeight / 2 - rect.top - rect.height / 2) * 0.055));
      image.style.transform = `translateY(${delta}px)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateImage); };
    listen(window, 'scroll', onScroll);
    listen(window, 'resize', onScroll);
    listen(reduced, 'change', () => { if (image) image.style.transform = ''; });
    updateImage();
    cleanups.push(() => { if (frame) cancelAnimationFrame(frame); if (image) image.style.transform = ''; });
  }
  const form = root.querySelector('#diagnostic-form');
  const feedback = root.querySelector('#form-feedback');
    const startedAt = Date.now();
    const submissionKey = window.crypto.randomUUID();
    listen(form, 'submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      if (feedback) feedback.textContent = 'Envoi de votre demande…';
      try {
        const response = await fetch('/api/contact', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...Object.fromEntries(data.entries()),submissionKey,startedAt,sourcePath:window.location.pathname})});
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Votre demande n’a pas pu être enregistrée.');
        form.reset();
        if (feedback) feedback.textContent = 'Votre demande a bien été enregistrée. OKKO reviendra vers vous par email.';
      } catch (error) {
        if (feedback) feedback.textContent = (error.message || 'Envoi impossible.') + ' Vous pouvez aussi écrire à contact@okko-digital.fr.';
      } finally { if (button) button.disabled = false; }
    });
    const track = event => {
      const link = event.target.closest && event.target.closest('a');
      if (!link || !link.matches('a[href="/contact"],a[href="#contact"],a[data-growth-cta]')) return;
      fetch('/api/growthpilot/event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'CTA',path:window.location.pathname}),keepalive:true}).catch(()=>{});
    };
    listen(document, 'click', track);
  return () => { for (const cleanup of cleanups.reverse()) cleanup(); };
}
