/* Les Monsieurs — démo : barre flottante (navigation, réinitialisation, contact) */
(function () {
  const inFrame = window.self !== window.top;
  const root = location.pathname.includes('/app/') ? '../' : './';
  const qs = location.search;
  const B = window.BRAND;
  window.LM_TOAST = m => { let t = document.getElementById('lm-toast'); if (!t) { t = document.createElement('div'); t.id = 'lm-toast'; document.body.appendChild(t); } t.textContent = m; t.className = 'on'; clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 2600); };
  if (inFrame) { try { if (window.frameElement && window.frameElement.id === 'p') document.documentElement.classList.add('in-phone'); } catch (e) { } return; }
  const el = document.createElement('div'); el.id = 'lm-bar';
  el.innerHTML = `<button class="lm-pill" aria-expanded="false"><span class="lm-dot"></span>Démo<small>${B.metierLabel}</small></button>
  <nav class="lm-menu" hidden>
    <p><b>${B.nom.replace(/[<&>]/g, '')}</b>Entreprise fictive · données d’exemple, rien n’est envoyé.</p>
    <a href="${root}index.html${qs}">Accueil de la démo</a>
    <a href="${root}app/index.html${qs}">Application bureau</a>
    <a href="${root}app/tech.html${qs}">Application technicien</a>
    <a href="${root}mixte.html${qs}">Bureau + technicien côte à côte</a>
    <a href="${root}demande.html${qs}">Formulaire client (demande avec photos)</a>
    <button type="button" id="lm-reset">Remettre la démo à zéro</button>
    <a class="lm-cta" href="${B.whatsapp}" target="_blank" rel="noopener">Je veux la même pour mon entreprise</a>
  </nav>`;
  document.body.appendChild(el);
  new MutationObserver(() => { if (!document.body.contains(el)) document.body.appendChild(el); }).observe(document.body, { childList: true });
  const pill = el.querySelector('.lm-pill'), menu = el.querySelector('.lm-menu');
  pill.onclick = e => { e.stopPropagation(); menu.hidden = !menu.hidden; pill.setAttribute('aria-expanded', String(!menu.hidden)); };
  document.addEventListener('click', e => { if (!el.contains(e.target)) { menu.hidden = true; pill.setAttribute('aria-expanded', 'false'); } });
  el.querySelector('#lm-reset').onclick = () => { if (confirm('Remettre toutes les données de la démo à zéro ?')) window.LM_DEMO_RESET(); };
})();
