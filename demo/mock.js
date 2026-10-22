/* Les Monsieurs — démo : base de données locale qui imite Supabase (aucun serveur, rien n'est envoyé).
   Partagée entre les onglets/fenêtres de la démo (localStorage + BroadcastChannel) pour le « temps réel ». */
(function () {
  const KEY = 'lm-demo-db-v1', bc = 'BroadcastChannel' in window ? new BroadcastChannel('lm-demo') : null;
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2));
  const now = () => new Date().toISOString();
  const clone = o => JSON.parse(JSON.stringify(o));
  let DB = null;
  function load() { try { DB = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { DB = null; } if (!DB) { DB = window.LM_SEED ? window.LM_SEED() : {}; save(); } return DB; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { } }
  window.LM_DEMO_RESET = () => { localStorage.removeItem(KEY); try { indexedDB.deleteDatabase('lm-demo-files'); indexedDB.deleteDatabase('bk-tech'); } catch (e) { } if (bc) bc.postMessage({ reset: true }); location.reload(); };
  window.addEventListener('storage', e => { if (e.key === KEY) DB = null; });
  const T = t => { load(); return DB[t] = DB[t] || []; };

  /* ---------- Temps réel ---------- */
  const subs = [];
  function emit(table, eventType, row, old, local) {
    const p = { schema: 'public', table, eventType, new: row || {}, old: old || {} };
    subs.forEach(s => { if (s.on && (s.table === table) && (s.event === '*' || s.event === eventType)) try { s.cb(p); } catch (e) { console.error(e); } });
    if (local && bc) bc.postMessage({ p });
  }
  if (bc) bc.onmessage = m => { DB = null; if (m.data.reset) return location.reload(); emit(m.data.p.table, m.data.p.eventType, m.data.p.new, m.data.p.old, false); };

  /* ---------- Schéma (valeurs par défaut, relations) ---------- */
  const SING = { interventions: 'intervention', chantiers: 'chantier', demandes: 'demande', affaires: 'affaire', pieces: 'piece', techniciens: 'tech' };
  const DEF = {
    interventions: () => ({ type: 'intervention', heure: null, duree: 1, epingle: false, statut: 'planifiee', materiel: [], recurrent: false, photos: [], commentaire: null, demande_id: null, chantier_id: null, affaire_id: null, debut_at: null, fin_at: null }),
    affaires: () => ({ source: 'telephone', lignes: [], tva: 10, montant_ht: 0, statut: 'a_chiffrer', demande_id: null }),
    chantiers: () => ({ statut: 'preparation', avancement: 0, affaire_id: null }),
    demandes: () => ({ statut: 'nouvelle', photos: [], manquantes: [] }),
  };
  function related(parent, rel) {
    const s = SING[parent];
    if (T(rel).length && (s + '_id') in (T(rel)[0] || {})) return { kind: 'many', fk: s + '_id' };
    if (rel === 'intervention_techs' || rel === 'pieces' || rel === 'chantier_journal') return { kind: 'many', fk: s + '_id' };
    if (rel === 'interventions' && parent === 'chantiers') return { kind: 'many', fk: 'chantier_id' };
    return { kind: 'one', fk: (SING[rel] || rel) + '_id' };
  }
  function splitTop(s) { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; }
  function parseSel(s) {
    return splitTop(s || '*').map(it => { const m = it.match(/^(?:(\w+):)?(\w+)(!inner)?\((.*)\)$/s);
      if (m) return { rel: m[2], alias: m[1] || m[2], inner: !!m[3], sub: parseSel(m[4]) }; return { col: it }; });
  }
  function project(table, row, sel, relFilters) {
    let o = {}; if (sel.some(x => x.col === '*')) o = clone(row);
    sel.forEach(x => { if (x.col && x.col !== '*') o[x.col] = row[x.col] === undefined ? null : clone(row[x.col]); });
    for (const x of sel.filter(x => x.rel)) {
      const r = related(table, x.rel);
      if (r.kind === 'many') { let kids = T(x.rel).filter(k => k[r.fk] === row.id); const f = relFilters[x.alias] || []; kids = kids.filter(k => f.every(fn => fn(k)));
        if (x.inner && !kids.length) return null; o[x.alias] = kids.map(k => project(x.rel, k, x.sub, {})); }
      else { const k = T(x.rel).find(k => k.id === row[r.fk]); if (x.inner && !k) return null; o[x.alias] = k ? project(x.rel, k, x.sub, {}) : null; }
    }
    return o;
  }

  /* ---------- Requêtes ---------- */
  class Q {
    constructor(t) { this.t = t; this.op = 'select'; this.sel = '*'; this.f = []; this.rf = {}; this.ord = []; this.lim = null; this.one = null; this.ret = false; this.opts = {}; }
    select(s, opts) { if (this.op === 'select') { this.sel = s || '*'; this.opts = opts || {}; } else { this.ret = true; this.sel = s || '*'; } return this; }
    insert(v) { this.op = 'insert'; this.val = v; return this; }
    upsert(v, o) { this.op = 'upsert'; this.val = v; this.conf = (o && o.onConflict || 'id').split(','); return this; }
    update(v) { this.op = 'update'; this.val = v; return this; }
    delete() { this.op = 'delete'; return this; }
    _f(c, fn) { if (c.includes('.')) { const [a, k] = c.split('.'); (this.rf[a] = this.rf[a] || []).push(r => fn(r[k])); } else this.f.push(r => fn(r[c])); return this; }
    eq(c, v) { return this._f(c, x => x === v || (x != null && v != null && String(x) === String(v))); }
    neq(c, v) { return this._f(c, x => x !== v); }
    gte(c, v) { return this._f(c, x => x != null && x >= v); }
    lte(c, v) { return this._f(c, x => x != null && x <= v); }
    in(c, v) { return this._f(c, x => v.includes(x)); }
    ilike(c, p) { const re = new RegExp('^' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*') + '$', 'i'); return this._f(c, x => re.test(x || '')); }
    match(o) { Object.entries(o).forEach(([c, v]) => this.eq(c, v)); return this; }
    order(c, o) { this.ord.push([c, !(o && o.ascending === false), o && o.nullsFirst]); return this; }
    limit(n) { this.lim = n; return this; }
    maybeSingle() { this.one = 'maybe'; return this; }
    single() { this.one = 'single'; return this; }
    then(res, rej) { return Promise.resolve().then(() => this.run()).then(res, rej); }
    rows() { return T(this.t).filter(r => this.f.every(fn => fn(r))); }
    out(list) {
      const sel = parseSel(this.sel); let data = list.map(r => project(this.t, r, sel, this.rf)).filter(Boolean);
      for (const [c, asc, nf] of [...this.ord].reverse()) data.sort((a, b) => { const x = a[c], y = b[c]; if (x == null && y == null) return 0; if (x == null) return nf ? -1 : 1; if (y == null) return nf ? 1 : -1; return (x < y ? -1 : x > y ? 1 : 0) * (asc ? 1 : -1); });
      if (this.lim != null) data = data.slice(0, this.lim);
      if (this.one) { if (!data.length) return this.one === 'single' ? { data: null, error: { message: 'Aucune ligne' } } : { data: null, error: null }; return { data: data[0], error: null }; }
      return { data, error: null };
    }
    run() {
      load(); const t = this.t, tab = T(t);
      if (this.op === 'select') { const all = this.rows(); if (this.opts.head) return { data: null, count: all.length, error: null }; const r = this.out(all); if (this.opts.count) r.count = all.length; return r; }
      if (this.op === 'insert' || this.op === 'upsert') {
        const list = (Array.isArray(this.val) ? this.val : [this.val]).map(v => ({ id: uid(), created_at: now(), updated_at: now(), ...(DEF[t] ? DEF[t]() : {}), ...clone(v) }));
        const done = [];
        for (const r of list) {
          if (this.op === 'upsert') { const ex = tab.find(x => this.conf.every(c => x[c] === r[c])); if (ex) { const old = clone(ex); Object.assign(ex, r, { id: ex.id }); done.push(ex); emit(t, 'UPDATE', ex, old, true); continue; } }
          if (t === 'affaires' && !r.ref) { DB._seq = (DB._seq || 0) + 1; r.ref = 'AF-' + String(new Date().getFullYear()).slice(2) + '-' + String(DB._seq).padStart(4, '0'); }
          tab.push(r); done.push(r);
        }
        save(); done.forEach(r => emit(t, 'INSERT', r, null, true));
        return this.ret ? this.out(done) : { data: null, error: null };
      }
      if (this.op === 'update') {
        const hit = this.rows(); hit.forEach(r => { const old = clone(r); Object.assign(r, clone(this.val), { updated_at: now() }); emit(t, 'UPDATE', r, old, true); }); save();
        return this.ret ? this.out(hit) : { data: null, error: null };
      }
      if (this.op === 'delete') {
        const hit = this.rows(); DB[t] = tab.filter(r => !hit.includes(r));
        hit.forEach(r => {
          if (t === 'interventions') { DB.intervention_techs = T('intervention_techs').filter(x => x.intervention_id !== r.id); DB.pieces = T('pieces').filter(x => x.intervention_id !== r.id); }
          if (t === 'chantiers') { DB.chantier_journal = T('chantier_journal').filter(x => x.chantier_id !== r.id); T('interventions').forEach(i => { if (i.chantier_id === r.id) i.chantier_id = null; }); }
          if (t === 'affaires') { T('interventions').forEach(i => { if (i.affaire_id === r.id) i.affaire_id = null; }); T('chantiers').forEach(c => { if (c.affaire_id === r.id) c.affaire_id = null; }); }
        });
        save(); hit.forEach(r => emit(t, 'DELETE', null, r, true)); return { data: null, error: null };
      }
    }
  }

  /* ---------- Fichiers (photos, pièces jointes) : IndexedDB locale ---------- */
  const FDB = () => new Promise((res, rej) => { const r = indexedDB.open('lm-demo-files', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const fput = (k, v) => FDB().then(db => new Promise(res => { const tx = db.transaction('f', 'readwrite'); tx.objectStore('f').put(v, k); tx.oncomplete = res; }));
  const fget = k => FDB().then(db => new Promise(res => { const q = db.transaction('f').objectStore('f').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }));
  const fdel = k => FDB().then(db => new Promise(res => { const tx = db.transaction('f', 'readwrite'); tx.objectStore('f').delete(k); tx.oncomplete = res; }));
  const urls = {};
  window.LM_FILE_PUT = fput;
  const storage = { from: b => ({
    upload: async (path, file) => { await fput(b + '/' + path, file); return { data: { path }, error: null }; },
    remove: async paths => { await Promise.all(paths.map(p => fdel(b + '/' + p))); return { data: [], error: null }; },
    list: async () => ({ data: [], error: null }),
    createSignedUrls: async paths => ({ data: await Promise.all(paths.map(async p => {
      if (p.startsWith('seed/')) return { path: p, signedUrl: window.LM_PHOTO ? window.LM_PHOTO(p) : '' };
      const k = b + '/' + p; if (urls[k]) return { path: p, signedUrl: urls[k] };
      const f = await fget(k); return { path: p, signedUrl: f ? (urls[k] = URL.createObjectURL(f)) : null }; })), error: null }),
  }) };

  /* ---------- Fonctions serveur ---------- */
  const RPC = {
    tech_statut: ({ p_id, p_statut }) => new Q('interventions').update(Object.assign({ statut: p_statut }, p_statut === 'encours' ? { debut_at: now() } : {})).eq('id', p_id).run(),
    tech_valider: ({ p_id, p_commentaire, p_photos }) => new Q('interventions').update({ statut: 'controle', commentaire: p_commentaire, photos: p_photos || [], fin_at: now() }).eq('id', p_id).run(),
    tech_annuler: ({ p_id }) => new Q('interventions').update({ statut: 'encours', fin_at: null }).eq('id', p_id).run(),
    bureau_comptes: () => ({ data: T('techniciens').map(t => ({ id: t.id, email: t.nom.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '') + '@' + (window.BRAND ? BRAND.domaine : 'demo.fr'), nom: t.nom, role: t.fonction === 'Bureau' ? 'bureau' : 'technicien', actif: true, derniere_connexion: t.ordre < 3 ? now() : null }))
      .concat([{ id: 'demo-bureau', email: 'vous@' + (window.BRAND ? BRAND.domaine : 'demo.fr'), nom: 'Vous (démo)', role: 'bureau', actif: true, derniere_connexion: now() }]), error: null }),
    bureau_mdp: () => ({ data: null, error: null }),
    envoyer_demande: ({ p }) => { const ref = 'DEM-' + Math.random().toString(36).slice(2, 8).toUpperCase(); const r = new Q('demandes').insert({ ...p, id: p.id || uid(), ref, statut: 'nouvelle', manquantes: p.manquantes || [] }).run(); return { data: ref, error: r.error }; },
  };

  /* ---------- Session : on est connecté d'office en « bureau » ---------- */
  const session = { access_token: 'demo', user: { id: 'demo-bureau', email: 'vous@demo' } };
  const authCbs = [];
  window.supabase = { createClient: () => ({
    from: t => new Q(t),
    rpc: async (n, a) => { await new Promise(r => setTimeout(r, 120)); return RPC[n] ? RPC[n](a || {}) : { data: null, error: { message: 'Fonction inconnue' } }; },
    storage,
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      onAuthStateChange: cb => { authCbs.push(cb); return { data: { subscription: { unsubscribe() { } } } }; },
      signInWithPassword: async () => ({ data: { session }, error: null }),
      signOut: async () => { if (window.LM_TOAST) LM_TOAST('Démo : la déconnexion est désactivée.'); return { error: null }; },
      updateUser: async () => ({ data: {}, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
    },
    channel: () => { const ch = { list: [], on(type, f, cb) { const s = { table: f.table, event: f.event || '*', cb, on: false }; subs.push(s); this.list.push(s); return this; }, subscribe() { this.list.forEach(s => s.on = true); return this; } }; return ch; },
    removeChannel: ch => { (ch && ch.list || []).forEach(s => { s.on = false; const i = subs.indexOf(s); if (i > -1) subs.splice(i, 1); }); },
  }) };

  /* ---------- Formulaire de demande client : appels « réseau » interceptés ---------- */
  const _fetch = window.fetch.bind(window);
  window.fetch = async (u, o) => {
    const s = String(u);
    if (s.startsWith('https://demo.local/storage/v1/object/')) { const path = s.split('/storage/v1/object/')[1]; await fput(path, o.body); return new Response('{}', { status: 200 }); }
    if (s.startsWith('https://demo.local/rest/v1/rpc/')) { const n = s.split('/rpc/')[1]; const r = await RPC[n](JSON.parse(o.body)); return new Response(JSON.stringify(r.data), { status: r.error ? 400 : 200, headers: { 'Content-Type': 'application/json' } }); }
    return _fetch(u, o);
  };
})();
