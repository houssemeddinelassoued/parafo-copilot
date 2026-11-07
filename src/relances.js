// Atelier 6 · La version moderne des relances
//
// Écrite APRÈS le refactoring de src/legacy/relances-2019.js, avec l'agent Refactoreur.
// Énoncé : ateliers/atelier-06-refactoring/README.md
// Tests de contrat : test/acceptance/a6-relances-contrat.test.js
//
// Les dates sont des chaînes 'AAAA-MM-JJ' (calcul en UTC, jamais en heure locale).
// Jours ouvrés : du lundi au vendredi, hors jours fériés fournis.
//
//   ajouterJoursOuvres(date, n, feries = [])
//     la date située n jours ouvrés APRÈS `date` (le jour de départ ne compte pas) ;
//     n = 0 → la date elle-même.
//     n doit être un entier ≥ 0 (un texte comme '5' est refusé) → sinon 'DELAI_INVALIDE'
//     date mal formée ou impossible ('2026-02-30') → 'DATE_INVALIDE'
//
//   dateExpiration(envoyeLe, delaiJours, feries = [])
//     = ajouterJoursOuvres(envoyeLe, delaiJours, feries)
//     (le code de 2019 comptait le jour d'envoi : un jour trop tôt. C'est le bug à corriger.)
//
//   datesRelance(envoyeLe, delaiJours, feries = [], intervalle = 3)
//     une relance tous les `intervalle` jours ouvrés après l'envoi, strictement avant l'expiration.
//     intervalle : entier ≥ 1 → sinon 'INTERVALLE_INVALIDE'
//
//   estExpire(envoyeLe, delaiJours, aujourdhui, feries = [])
//     vrai si `aujourdhui` est strictement après la date d'expiration
//     (on peut encore signer LE jour de l'expiration).
//
// Aucune fonction ne modifie le tableau `feries` reçu.

export function ajouterJoursOuvres(date, n, feries) {
  throw new Error('À générer pendant l’Atelier 6');
}

export function dateExpiration(envoyeLe, delaiJours, feries) {
  throw new Error('À générer pendant l’Atelier 6');
}

export function datesRelance(envoyeLe, delaiJours, feries, intervalle) {
  throw new Error('À générer pendant l’Atelier 6');
}

export function estExpire(envoyeLe, delaiJours, aujourdhui, feries) {
  throw new Error('À générer pendant l’Atelier 6');
}
