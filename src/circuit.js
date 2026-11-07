// Atelier 5 · Le circuit de signature
//
// À construire en mode Agent, harnais réglé (outils, auto-approbation de npm test).
// Énoncé : ateliers/atelier-05-harnais/README.md
// Tests : npm run test:atelier5
//
// Un circuit fait signer un document par une liste ordonnée de signataires.
//
//   creerCircuit({ documentId, signataires, mode = 'sequentiel' })
//     signataires : tableau non vide d'e-mails valides, sans doublon (casse ignorée)
//                   → sinon ErreurParafo 'SIGNATAIRES_INVALIDES'
//     mode : 'sequentiel' (chacun son tour) ou 'parallele' (tous en même temps)
//                   → sinon ErreurParafo 'MODE_INVALIDE'
//     renvoie { documentId, mode, statut: 'en_cours',
//               etapes: [{ email (en minuscules), ordre: 1.., decision: null, le: null }] }
//
//   prochainsSignataires(circuit) → e-mails attendus maintenant
//     séquentiel : le premier sans décision ; parallèle : tous ceux sans décision ;
//     circuit terminé : [].
//
//   signer(circuit, email, maintenant = new Date())
//   refuser(circuit, email, motif, maintenant = new Date())
//     renvoient un NOUVEAU circuit (l'original n'est jamais modifié).
//     decision : 'signe' ou 'refuse', le : date ISO.
//     Tout le monde a signé → statut 'signe'. Un refus → statut 'refuse' immédiatement.
//     Contrôles, dans cet ordre :
//       circuit déjà terminé           → 'CIRCUIT_TERMINE'
//       e-mail absent du circuit       → 'SIGNATAIRE_INCONNU'
//       signataire ayant déjà décidé   → 'DEJA_DECIDE'
//       pas encore son tour            → 'PAS_VOTRE_TOUR'
//       refus sans motif (vide/blancs) → 'MOTIF_OBLIGATOIRE'
//
//   avancement(circuit) → { signes, total, pourcentage } (pourcentage arrondi à l'entier)

export function creerCircuit({ documentId, signataires, mode } = {}) {
  throw new Error('À générer pendant l’Atelier 5');
}

export function prochainsSignataires(circuit) {
  throw new Error('À générer pendant l’Atelier 5');
}

export function signer(circuit, email, maintenant) {
  throw new Error('À générer pendant l’Atelier 5');
}

export function refuser(circuit, email, motif, maintenant) {
  throw new Error('À générer pendant l’Atelier 5');
}

export function avancement(circuit) {
  throw new Error('À générer pendant l’Atelier 5');
}
