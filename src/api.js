// API HTTP de Parafo, écrite comme une fonction pure : facile à tester sans serveur.
// Le serveur (scripts/serveur.js) ne fait que lui passer les requêtes.

import { estTermine } from './document.js';

function json(statut, corps) {
  return {
    statut,
    entetes: { 'content-type': 'application/json; charset=utf-8' },
    corps: JSON.stringify(corps),
  };
}

/**
 * Traite une requête de l'API.
 * @param {{ methode: string, chemin: string }} requete
 * @param {Array<object>} registre les documents connus
 * @returns {{ statut: number, entetes: object, corps: string }}
 */
export function traiterRequete({ methode, chemin }, registre) {
  const { pathname } = new URL(chemin, 'http://parafo.local');

  if (pathname === '/documents') {
    if (methode !== 'GET') return json(405, { erreur: 'METHODE_NON_AUTORISEE' });
    return json(200, registre.map(({ id, titre, etat }) => ({ id, titre, etat })));
  }

  // Atelier 8 · Ticket 2 (session parallèle n° 2) : GET /documents/:id/statut
  // Tests : test/acceptance/a8-statut.test.js
  //   200 { id, etat, termine }   termine : réutilisez estTermine() de src/document.js
  //   400 { erreur: 'ID_INVALIDE' }        l'id ne respecte pas DOC- suivi de 8 caractères hexadécimaux minuscules
  //   404 { erreur: 'DOCUMENT_INCONNU' }   id valide mais absent du registre
  //   405 { erreur: 'METHODE_NON_AUTORISEE' } toute autre méthode que GET sur ce chemin

  return json(404, { erreur: 'RESSOURCE_INCONNUE' });
}

export { estTermine };
