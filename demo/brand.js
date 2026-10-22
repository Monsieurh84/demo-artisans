/* Les Monsieurs — démo : personnalisation (métier, nom, ville, couleur) + données d'exemple réalistes.
   Lien personnalisé : ?m=electricite&e=Elec%20Martin&v=Avignon&c=E8A317  (m = métier, e = entreprise, v = ville, c = couleur) */
(function () {
  const METIERS = {
    plomberie: { label: 'Plomberie · chauffage', nom: 'Durand Plomberie', couleur: '#1E5BB8', domaine: 'durand-plomberie.fr',
      equipe: [['Lucas', 'Chef d’équipe'], ['Mehdi', 'Plombier'], ['Thomas', 'Plombier'], ['Julien', 'Apprenti'], ['Sébastien', 'Sous-traitant']],
      jobs: ['Fuite sous évier cuisine, remplacer le siphon', 'Remplacement chauffe-eau 200 L', 'WC qui fuit en continu, changer le mécanisme', 'Recherche de fuite, tache au plafond', 'Débouchage canalisation salle de bain', 'Remplacement mitigeur douche', 'Entretien chaudière gaz (contrat annuel)', 'Pose d’un adoucisseur', 'Remplacement groupe de sécurité', 'Robinet extérieur gelé à changer'],
      materiel: [['Siphon PVC Ø40', 'Téflon'], ['Chauffe-eau 200 L vertical', 'Groupe de sécurité', 'Raccords diélectriques'], ['Mécanisme WC double chasse'], ['Caméra thermique', 'Détecteur d’humidité'], ['Furet électrique'], ['Mitigeur thermostatique', 'Flexibles inox']],
      demandes: [['Remplacement chauffe-eau', 'Plus d’eau chaude depuis ce matin, le ballon a 12 ans.', ['Photo du chauffe-eau', 'Photo du groupe de sécurité', 'Photo de l’étiquette']], ['Fuite sous l’évier', 'Petite flaque tous les jours sous l’évier de la cuisine.', ['Photo sous l’évier', 'Photo du siphon']], ['Rénovation salle de bain', 'Remplacer la baignoire par une douche à l’italienne.', ['Photo de la salle de bain', 'Photo de la baignoire', 'Photo de l’arrivée d’eau']], ['WC qui fuit', 'La chasse coule en continu.', ['Photo du WC', 'Photo du réservoir ouvert']]],
      affaires: [['Remplacement chauffe-eau 200 L', [['Chauffe-eau électrique 200 L', 1, 'u', 690], ['Groupe de sécurité + raccords', 1, 'forfait', 85], ['Main d’œuvre pose et mise en service', 3, 'h', 55]]], ['Douche à l’italienne', [['Receveur extra-plat 120×90', 1, 'u', 420], ['Paroi vitrée', 1, 'u', 380], ['Colonne de douche thermostatique', 1, 'u', 260], ['Dépose baignoire et évacuation', 1, 'forfait', 350], ['Main d’œuvre', 16, 'h', 52]]], ['Contrat d’entretien chaudière', [['Entretien annuel chaudière gaz', 1, 'forfait', 149]]], ['Remplacement colonne d’eau immeuble', [['Tube multicouche Ø26', 24, 'ml', 18], ['Vannes et raccords', 1, 'forfait', 420], ['Main d’œuvre', 14, 'h', 55]]], ['Adoucisseur', [['Adoucisseur 20 L', 1, 'u', 980], ['Kit de raccordement', 1, 'u', 120], ['Main d’œuvre', 3, 'h', 55]]], ['Recherche de fuite non destructive', [['Recherche de fuite (caméra thermique)', 1, 'forfait', 290]]]],
      chantier: ['Rénovation complète salle de bain', 'Résidence Les Pins'] },
    electricite: { label: 'Électricité', nom: 'Élec Services Martin', couleur: '#D97706', domaine: 'elec-martin.fr',
      equipe: [['Karim', 'Chef d’équipe'], ['Antoine', 'Électricien'], ['Nicolas', 'Électricien'], ['Hugo', 'Apprenti'], ['David', 'Sous-traitant']],
      jobs: ['Disjoncteur qui saute, recherche de panne', 'Mise aux normes tableau électrique', 'Pose de 6 spots LED salon', 'Installation borne de recharge 7 kW', 'Ajout de prises cuisine', 'Remplacement interphone', 'Diagnostic avant vente', 'Pose d’un radiateur à inertie', 'Éclairage extérieur, détecteur de présence', 'Dépannage panne générale'],
      materiel: [['Multimètre', 'Disjoncteurs 16 A'], ['Tableau 3 rangées', 'Interrupteur différentiel 30 mA', 'Peignes'], ['Spots LED encastrables ×6', 'Gaine ICTA'], ['Borne 7 kW', 'Câble 10 mm²', 'Disjoncteur dédié'], ['Prises 16 A ×4', 'Boîtes d’encastrement'], ['Interphone vidéo']],
      demandes: [['Mise aux normes tableau', 'Vieux tableau à fusibles, maison de 1975.', ['Photo du tableau', 'Photo du compteur']], ['Borne de recharge', 'Véhicule électrique livré le mois prochain.', ['Photo du garage', 'Photo du tableau électrique']], ['Panne de courant', 'Plus de courant dans la cuisine.', ['Photo du tableau']], ['Éclairage jardin', 'Ajouter des bornes lumineuses dans l’allée.', ['Photo de l’allée']]],
      affaires: [['Mise aux normes tableau électrique', [['Tableau pré-équipé 3 rangées', 1, 'u', 420], ['Interrupteurs différentiels 30 mA', 2, 'u', 85], ['Main d’œuvre', 8, 'h', 50]]], ['Installation borne de recharge 7 kW', [['Borne 7 kW', 1, 'u', 890], ['Câblage et protection dédiée', 1, 'forfait', 320], ['Main d’œuvre', 4, 'h', 50]]], ['Rénovation électrique appartement T3', [['Rénovation complète T3', 1, 'forfait', 6800]]], ['Éclairage LED salon', [['Spots LED', 6, 'u', 28], ['Main d’œuvre', 3, 'h', 50]]], ['Contrat maintenance commerce', [['Visite semestrielle', 2, 'u', 180]]], ['Diagnostic électrique', [['Diagnostic complet', 1, 'forfait', 160]]]],
      chantier: ['Rénovation électrique complète', 'Maison Lefèvre'] },
    climatisation: { label: 'Climatisation · PAC', nom: 'Clim Confort', couleur: '#0891B2', domaine: 'clim-confort.fr',
      equipe: [['Yanis', 'Chef d’équipe'], ['Romain', 'Frigoriste'], ['Kevin', 'Frigoriste'], ['Enzo', 'Apprenti'], ['Fabrice', 'Sous-traitant']],
      jobs: ['Entretien annuel climatisation (contrat)', 'Pose climatisation réversible mono-split', 'Clim qui ne refroidit plus, recherche de fuite', 'Installation pompe à chaleur air/eau', 'Nettoyage et désinfection unités intérieures', 'Remplacement télécommande et carte', 'Mise en service PAC', 'Pose multi-split 3 pièces', 'Entretien PAC (contrat)', 'Bruit anormal unité extérieure'],
      materiel: [['Kit de nettoyage', 'Bombe désinfectante'], ['Unité 3,5 kW', 'Liaisons frigorifiques 4 m', 'Support mural'], ['Détecteur de fuite', 'Bouteille R32'], ['PAC 11 kW', 'Ballon tampon'], ['Pompe de relevage']],
      demandes: [['Pose climatisation', 'Clim dans 2 chambres avant l’été.', ['Photo de la chambre', 'Photo du mur extérieur']], ['Entretien clim', 'Contrat annuel, 3 unités.', ['Photo des unités']], ['PAC en panne', 'Code erreur E5 sur l’écran.', ['Photo de l’écran', 'Photo de l’unité extérieure']], ['Remplacement chaudière fioul par PAC', 'Maison de 120 m².', ['Photo de la chaudière', 'Photo de l’extérieur']]],
      affaires: [['Climatisation 2 chambres (bi-split)', [['Bi-split 2×2,5 kW', 1, 'u', 2350], ['Liaisons et accessoires', 1, 'forfait', 260], ['Main d’œuvre', 8, 'h', 55]]], ['PAC air/eau 11 kW', [['Pompe à chaleur 11 kW', 1, 'u', 7900], ['Dépose chaudière fioul', 1, 'forfait', 650], ['Main d’œuvre', 24, 'h', 55]]], ['Contrat d’entretien 3 unités', [['Entretien annuel par unité', 3, 'u', 89]]], ['Recherche de fuite et recharge', [['Recherche de fuite', 1, 'forfait', 190], ['Recharge R32', 1, 'kg', 95]]], ['Multi-split bureaux', [['Multi-split 4 unités', 1, 'u', 5200], ['Main d’œuvre', 20, 'h', 55]]], ['Désinfection unités', [['Nettoyage/désinfection', 4, 'u', 65]]]],
      chantier: ['Installation PAC + plancher chauffant', 'Villa Roussel'] },
    renovation: { label: 'Rénovation · multi-métiers', nom: 'Rénov Habitat', couleur: '#4D7C0F', domaine: 'renov-habitat.fr',
      equipe: [['Stéphane', 'Conducteur de travaux'], ['Ali', 'Plaquiste'], ['Bruno', 'Peintre'], ['Maxime', 'Carreleur'], ['Patrick', 'Sous-traitant']],
      jobs: ['Pose cloison placo chambre', 'Peinture séjour 35 m²', 'Carrelage salle de bain', 'Pose parquet flottant', 'Reprise fissures façade', 'Pose cuisine équipée', 'Création d’une ouverture mur porteur', 'Faux plafond avec spots', 'Remplacement fenêtres PVC', 'Ragréage et sol PVC'],
      materiel: [['Rails et montants', 'Plaques BA13 ×12', 'Bandes et enduit'], ['Peinture blanc mat 15 L', 'Rouleaux', 'Bâches'], ['Carrelage 60×60 (18 m²)', 'Colle flex', 'Croisillons'], ['Parquet 32 m²', 'Sous-couche'], ['Enduit de façade', 'Grillage'], ['Étais', 'IPN']],
      demandes: [['Rénovation salle de bain', 'Tout refaire, 6 m².', ['Photo de la salle de bain', 'Photo du sol']], ['Peinture appartement', 'T3 à repeindre avant location.', ['Photo du séjour', 'Photo d’une chambre']], ['Pose cuisine', 'Cuisine achetée, à poser.', ['Photo de la pièce', 'Photo du plan']], ['Ouverture mur', 'Ouvrir entre cuisine et salon.', ['Photo du mur']]],
      affaires: [['Rénovation salle de bain complète', [['Démolition et évacuation', 1, 'forfait', 900], ['Plomberie', 1, 'forfait', 1800], ['Carrelage sol et murs', 22, 'm²', 75], ['Main d’œuvre', 40, 'h', 48]]], ['Peinture appartement T3', [['Préparation et peinture murs et plafonds', 160, 'm²', 22]]], ['Pose cuisine équipée', [['Pose et raccordements', 1, 'forfait', 1450]]], ['Ouverture mur porteur', [['Étude et IPN', 1, 'forfait', 1600], ['Travaux', 1, 'forfait', 2400]]], ['Parquet séjour', [['Parquet flottant posé', 32, 'm²', 38]]], ['Ravalement façade', [['Ravalement', 140, 'm²', 45]]]],
      chantier: ['Rénovation appartement T3', 'Rue des Lilas'] },
    serrurerie: { label: 'Serrurerie · dépannage', nom: 'Serrurerie Express', couleur: '#B91C1C', domaine: 'serrurerie-express.fr',
      equipe: [['Mathieu', 'Chef d’équipe'], ['Samir', 'Serrurier'], ['Loïc', 'Serrurier'], ['Dylan', 'Apprenti'], ['Franck', 'Sous-traitant']],
      jobs: ['Ouverture de porte claquée', 'Remplacement cylindre après vol de clés', 'Pose serrure 3 points', 'Blindage de porte', 'Changement de barillet boîte aux lettres', 'Réparation rideau métallique', 'Pose porte blindée', 'Mise en sécurité après effraction', 'Pose ferme-porte copropriété', 'Ouverture coffre-fort'],
      materiel: [['Kit d’ouverture'], ['Cylindre européen 30×30', 'Clés ×5'], ['Serrure 3 points A2P'], ['Kit blindage'], ['Moteur rideau'], ['Contreplaqué', 'Visserie']],
      demandes: [['Serrure 3 points', 'Je veux sécuriser ma porte d’entrée.', ['Photo de la porte', 'Photo de la serrure']], ['Rideau métallique bloqué', 'Commerce, rideau bloqué à mi-hauteur.', ['Photo du rideau', 'Photo du moteur']], ['Changement cylindre', 'Clés perdues.', ['Photo de la serrure']], ['Porte blindée', 'Appartement au RDC.', ['Photo de la porte']]],
      affaires: [['Pose serrure 3 points A2P', [['Serrure 3 points A2P**', 1, 'u', 480], ['Main d’œuvre', 2, 'h', 60]]], ['Porte blindée', [['Bloc-porte blindé', 1, 'u', 2400], ['Pose', 1, 'forfait', 450]]], ['Réparation rideau métallique', [['Moteur', 1, 'u', 620], ['Main d’œuvre', 3, 'h', 60]]], ['Contrat copropriété', [['Visites annuelles', 4, 'u', 120]]], ['Blindage porte', [['Kit blindage', 1, 'u', 890], ['Pose', 1, 'forfait', 250]]], ['Mise en sécurité', [['Mise en sécurité provisoire', 1, 'forfait', 290]]]],
      chantier: ['Sécurisation résidence (32 portes)', 'Résidence Le Parc'] },
  };
  const VILLES = ['Avignon', 'Orange', 'Carpentras', 'Cavaillon', 'Bollène', 'Pertuis', 'L’Isle-sur-la-Sorgue', 'Sorgues', 'Le Pontet', 'Vedène'];
  const RUES = ['12 rue des Lilas', '4 avenue Jean Jaurès', '27 chemin des Vignes', '8 place de la République', '15 rue Victor Hugo', '3 impasse des Oliviers', '41 boulevard Gambetta', '9 rue de la Gare', '22 avenue de Verdun', '6 allée des Platanes', '18 rue Pasteur', '30 route de Marseille'];
  const CLIENTS = ['M. Garcia', 'Mme Bernard', 'Agence Immo Sud', 'Syndic Provence Gestion', 'Mme Petit', 'M. Roux', 'Foncia', 'Mme Fontaine', 'M. Chevalier', 'SCI Les Oliviers', 'Mme Robin', 'M. Faure'];
  const OCC = ['Mme Lambert', 'M. Moreau', 'Mme Girard', 'M. Mercier', 'Mme Dupuis', 'M. Blanc'];
  const COUL = ['#2563EB', '#059669', '#EA580C', '#DB2777', '#7C3AED'];

  /* ----- Lecture des paramètres + mémorisation ----- */
  const q = new URLSearchParams(location.search);
  let saved = {}; try { saved = JSON.parse(localStorage.getItem('lm-demo-brand') || '{}'); } catch (e) { }
  const m = METIERS[q.get('m')] ? q.get('m') : (METIERS[saved.m] ? saved.m : 'plomberie'), M = METIERS[m];
  const base = q.get('m') && q.get('m') !== saved.m ? {} : saved;
  const nom = (q.get('e') || base.e || M.nom).slice(0, 40);
  const ville = (q.get('v') || base.v || 'Avignon').slice(0, 40);
  let couleur = '#' + String(q.get('c') || base.c || M.couleur).replace('#', '').replace(/[^0-9a-f]/gi, '').slice(0, 6);
  if (couleur.length !== 7) couleur = M.couleur;
  const sig = [m, nom, ville, couleur].join('|');
  if (saved.sig && saved.sig !== sig && (saved.m !== m || saved.e !== nom || saved.v !== ville)) { try { localStorage.removeItem('lm-demo-db-v1'); indexedDB.deleteDatabase('bk-tech'); } catch (e) { } }
  try { localStorage.setItem('lm-demo-brand', JSON.stringify({ m, e: nom, v: ville, c: couleur, sig })); } catch (e) { }
  const villes = q.get('v') || base.v ? [ville] : VILLES;
  const words = nom.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(w => w.length > 1 && !/^(de|du|la|le|les|et|des|sarl|sas)$/i.test(w));
  const court = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : (words[0] || 'LM').slice(0, 2).toUpperCase();

  /* ----- Couleurs ----- */
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + hex(a).map((x, i) => Math.round(x + (hex(b)[i] - x) * t).toString(16).padStart(2, '0')).join('');
  const rgba = (h, a) => 'rgba(' + hex(h).join(',') + ',' + a + ')';
  const dark = mix(couleur, '#000000', .45), deep = mix(couleur, '#0B1020', .78), soft = mix(couleur, '#FFFFFF', .9);
  const logo = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${couleur}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><rect width="96" height="96" rx="24" fill="url(#g)"/><text x="48" y="61" text-anchor="middle" font-family="Sora,Manrope,Arial,sans-serif" font-size="38" font-weight="800" fill="#fff" letter-spacing="-1">${court.replace(/[<&>]/g, '')}</text></svg>`);

  window.BRAND = { metier: m, metierLabel: M.label, nom, court: nom, initiales: court, ville, villes, couleur, dark, deep, soft, logo, domaine: M.domaine, METIERS,
    whatsapp: 'https://wa.me/33652041725?text=' + encodeURIComponent('Bonjour Hatim, j’ai vu la démo de l’application (' + M.label + ') et j’aimerais en savoir plus.') };
  const css = `:root{--steel:${couleur};--indigo:${dark};--electric:${couleur};--grad:linear-gradient(100deg,${couleur},${dark});--soft:${soft};
    --blue:${couleur};--blue-50:${soft};--orange:${couleur};--orange-d:${dark};--navy:${deep};--navy-2:${mix(couleur, '#0B1020', .6)}}
  .screen .top{background:${deep}!important;background-image:radial-gradient(500px 200px at 90% -40%,${rgba(couleur, .55)},transparent 70%)!important}
  .screen .next{background:linear-gradient(135deg,${mix(couleur, '#0B1020', .35)},${deep})!important}`;
  document.write('<style id="lm-brand">' + css + '</style>');
  const ic = document.querySelector('link[rel="icon"]'); if (ic) ic.href = logo;

  /* ----- Photos d'exemple (illustrations) ----- */
  window.LM_PHOTO = path => {
    const label = decodeURIComponent(path.split('/').pop()).replace(/^\d+-/, '').replace(/\.\w+$/, '');
    const h = [...label].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7), a = mix(couleur, '#2A3142', .55 + (h % 30) / 100), b = mix('#1B2230', couleur, (h % 20) / 100);
    return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="translate(170 92) scale(2.5)"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" stroke-width="1.6"/><circle cx="12" cy="13" r="3" stroke-width="1.6"/></g><text x="200" y="232" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="19" font-weight="700" fill="#fff" fill-opacity=".9">${label.replace(/[<&>]/g, '').slice(0, 34)}</text><text x="200" y="258" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="13" fill="#fff" fill-opacity=".55">Photo d’exemple · démo</text></svg>`);
  };

  /* ----- Données d'exemple ----- */
  window.LM_SEED = () => {
    let n = 0; const id = () => 'seed-' + (++n);
    const pad = x => String(x).padStart(2, '0'), iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    const today = new Date(); today.setHours(12, 0, 0, 0);
    const mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const day = k => { const d = new Date(mon); d.setDate(mon.getDate() + k); return iso(d); };
    const dToday = (today.getDay() + 6) % 7, ago = h => new Date(Date.now() - h * 3600e3).toISOString();
    const V = k => villes[k % villes.length], R = k => RUES[k % RUES.length], C = k => CLIENTS[k % CLIENTS.length];
    const tel = k => '06 ' + ['12', '34', '56', '78', '21', '43'][k % 6] + ' ' + pad(10 + k * 7 % 89) + ' ' + pad(20 + k * 13 % 79) + ' ' + pad(30 + k * 3 % 69);
    const db = { profils: [{ id: 'demo-bureau', nom: 'Vous (démo)', role: 'bureau', actif: true }], techniciens: [], interventions: [], intervention_techs: [], pieces: [], demandes: [], affaires: [], chantiers: [], chantier_journal: [], absences: [] };
    M.equipe.forEach(([nm, fn], k) => db.techniciens.push({ id: id(), nom: nm, fonction: fn, couleur: COUL[k], ordre: k, actif: true, profil_id: null }));
    const TT = db.techniciens.map(t => t.id);
    /* Demandes du site */
    M.demandes.forEach(([svc, msg, ph], k) => { const did = id();
      db.demandes.push({ id: did, ref: 'DEM-' + (4120 + k), created_at: ago(k * 9 + 1), service_id: svc, service: svc, nom: C(k + 4), tel: tel(k), email: '', adresse: R(k + 3), cp: '84000', ville: V(k + 1), message: msg, urgence: k === 2 ? 'urgent' : (k ? 'semaine' : 'pas-presse'), profil: k === 1 ? 'Propriétaire bailleur' : 'Particulier',
        photos: ph.map((p, j) => ({ label: p, path: 'seed/' + j + '-' + p })), manquantes: [], statut: k < 2 ? 'nouvelle' : (k === 2 ? 'planifiee' : 'affaire') }); });
    /* Interventions de la semaine */
    const plan = [[0, 0, '08:00', 2], [0, 1, '10:30', 1.5], [0, 2, '14:00', 2], [1, 0, '08:30', 3], [1, 3, '09:00', 2], [1, 1, '14:00', 2], [2, 2, '08:00', 4], [2, 0, '13:30', 2], [3, 1, '08:30', 2], [3, 0, '10:00', 1.5], [3, 2, '14:00', 3], [3, 3, '15:30', 1], [4, 0, '08:00', 2], [4, 1, '09:30', 2], [4, 2, '14:00', 2], [5, 1, '09:00', 3]];
    plan.forEach(([d, t, h, du], k) => {
      const iid = id(), past = d < dToday, isToday = d === dToday;
      let statut = past ? 'cloturee' : 'planifiee';
      if (isToday && k % 3 === 0) statut = 'encours';
      const i = { id: iid, created_at: ago(72), type: 'intervention', date: day(d), heure: h, duree: du, epingle: false, statut, client: C(k), occupant: k % 2 ? OCC[k % OCC.length] : '', tel: tel(k), adresse: R(k), cp: '84000', ville: V(k), travaux: M.jobs[k % M.jobs.length], materiel: M.materiel[k % M.materiel.length] || [], recurrent: /contrat/i.test(M.jobs[k % M.jobs.length]), photos: [], commentaire: null, demande_id: null, chantier_id: null, affaire_id: null, debut_at: statut === 'encours' ? ago(1) : null, fin_at: null };
      db.interventions.push(i); db.intervention_techs.push({ id: id(), intervention_id: iid, tech_id: TT[t] });
      if (k === 6 || k === 10) db.intervention_techs.push({ id: id(), intervention_id: iid, tech_id: TT[3] });
      if (k === 4) db.pieces.push({ id: id(), intervention_id: iid, nom: 'Plan d’accès.pdf', type: 'pdf', path: 'seed/plan.pdf', created_at: ago(70) });
    });
    /* Une intervention terminée à contrôler (photos du technicien) */
    const dCtl = Math.max(0, dToday - 1), ci = db.interventions.find(x => x.date === day(dCtl)) || db.interventions[0];
    Object.assign(ci, { statut: 'controle', commentaire: 'Travaux terminés, testé avec le client. Aucune fuite. Prévoir un contrôle dans 1 an.', photos: [{ path: 'seed/0-Avant intervention', tag: 'Avant' }, { path: 'seed/1-Après intervention', tag: 'Après' }], debut_at: ago(26), fin_at: ago(24) });
    /* Intervention issue d'une demande du site */
    const dm = db.demandes[2], di = db.interventions.find(x => x.date >= day(dToday) && x.statut === 'planifiee');
    if (dm && di) Object.assign(di, { demande_id: dm.id, travaux: dm.service + ' : ' + dm.message, occupant: dm.nom, ville: dm.ville, adresse: dm.adresse });
    /* Tâches épinglées du jour */
    [['Passer chercher le matériel au fournisseur', 0], ['Déposer le devis signé chez ' + C(3), 1]].forEach(([tx, t]) => { const iid = id();
      db.interventions.push({ id: iid, created_at: ago(5), type: 'tache', date: day(Math.min(dToday, 5)), heure: null, duree: 0, epingle: true, statut: 'planifiee', client: '', occupant: '', tel: '', adresse: 'Zone artisanale', cp: '', ville: V(0), travaux: tx, materiel: [], recurrent: false, photos: [], commentaire: null, demande_id: null, chantier_id: null, affaire_id: null });
      db.intervention_techs.push({ id: id(), intervention_id: iid, tech_id: TT[t] }); });
    /* Absence */
    db.absences.push({ id: id(), tech_id: TT[2], date: day(4), motif: 'Formation' });
    /* Affaires */
    const ST = ['a_chiffrer', 'visite', 'envoye', 'envoye', 'accepte', 'accepte'];
    M.affaires.forEach(([obj, L], k) => { const lignes = L.map(([d, qq, u, pu]) => ({ d, q: qq, u, pu })), ht = Math.round(lignes.reduce((s, x) => s + x.q * x.pu, 0) * 100) / 100;
      db.affaires.push({ id: id(), ref: 'AF-' + String(today.getFullYear()).slice(2) + '-' + pad(k + 1).padStart(4, '0'), created_at: ago(200 - k * 20), updated_at: ago(30 - k * 4), source: ['telephone', 'site', 'partenaire', 'email', 'bouche', 'telephone'][k], demande_id: k === 1 && db.demandes[3] ? db.demandes[3].id : null,
        client: C(k + 2), contact: C(k + 7), tel: tel(k + 3), email: '', adresse: R(k + 5), cp: '84000', ville: V(k + 2), objet: obj, description: '', lignes, tva: 10, montant_ht: ht, statut: ST[k],
        visite_le: ST[k] === 'visite' ? day(dToday + 1) : null, envoye_le: ST[k] === 'envoye' ? day(dToday - 8 + k) : null, relance_le: ST[k] === 'envoye' ? day(dToday - 1 + (k - 2) * 3) : null, isanet_devis: ST[k] === 'accepte' ? 'D' + today.getFullYear() + '-0' + (140 + k) : '', isanet_facture: '', notes: '' }); });
    db._seq = M.affaires.length;
    /* Chantier en cours */
    const ch = { id: id(), nom: M.chantier[0] + ' — ' + M.chantier[1], affaire_id: db.affaires[5] ? db.affaires[5].id : null, client: C(9), tel: tel(9), adresse: R(9), cp: '84000', ville: V(1), debut: day(dToday - 7), fin_prevue: day(dToday + 9), statut: 'en_cours', avancement: 55, notes: 'Accès par le parking, code portail 2580.\nBennes livrées lundi.', created_at: ago(300), updated_at: ago(3) };
    db.chantiers.push(ch, { id: id(), nom: M.affaires[1][0], affaire_id: null, client: C(6), tel: tel(6), adresse: R(6), cp: '84000', ville: V(3), debut: day(dToday + 10), fin_prevue: day(dToday + 14), statut: 'preparation', avancement: 0, notes: '', created_at: ago(40), updated_at: ago(40) });
    [[1, '07:30', 8, [4]], [2, '07:30', 8, [4]], [8, '07:30', 8, [4]]].forEach(([d, h, du, ts]) => { const iid = id(), dd = Math.min(5, Math.max(0, dToday + d - 2));
      db.interventions.push({ id: iid, created_at: ago(100), type: 'intervention', date: day(dd), heure: h, duree: du, epingle: false, statut: dd < dToday ? 'cloturee' : 'planifiee', client: ch.client, occupant: '', tel: ch.tel, adresse: ch.adresse, cp: '84000', ville: ch.ville, travaux: 'Chantier : ' + ch.nom, materiel: [], recurrent: false, photos: [], commentaire: dd < dToday ? 'Journée terminée, on reprend demain à 7h30.' : null, demande_id: null, chantier_id: ch.id, affaire_id: ch.affaire_id });
      ts.forEach(t => db.intervention_techs.push({ id: id(), intervention_id: iid, tech_id: TT[t] })); });
    db.chantier_journal.push({ id: id(), chantier_id: ch.id, texte: 'Démolition terminée, évacuation faite.', auteur: M.equipe[0][0], created_at: ago(120) }, { id: id(), chantier_id: ch.id, texte: 'Réception du matériel, tout est conforme.', auteur: 'Bureau', created_at: ago(30) });
    return db;
  };
})();
