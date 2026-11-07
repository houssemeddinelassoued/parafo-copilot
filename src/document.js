// Atelier 3 · Le document à signer
//
// Ce fichier est à construire avec Copilot (mode Plan, puis mode Agent),
// à partir du brief : ateliers/atelier-03-document/BRIEF.md
// Les tests d'acceptation : test/acceptance/a3-document.test.js
// Commande : npm run test:atelier3

import { ErreurParafo } from './erreurs.js';

const A_GENERER = 'À générer pendant l’Atelier 3 (voir ateliers/atelier-03-document/BRIEF.md)';

export const TAILLE_MAX = 10 * 1024 * 1024;

export function empreinteSha256(contenu) {
  throw new ErreurParafo('A_GENERER', A_GENERER);
}

export function creerDocument({ titre, contenu, auteur, maintenant } = {}) {
  throw new ErreurParafo('A_GENERER', A_GENERER);
}

export function changerEtat(document, nouvelEtat, maintenant) {
  throw new ErreurParafo('A_GENERER', A_GENERER);
}

export function estTermine(document) {
  throw new ErreurParafo('A_GENERER', A_GENERER);
}
