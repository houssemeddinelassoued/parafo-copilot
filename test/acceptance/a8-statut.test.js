// Atelier 8 · Ticket 2 : GET /documents/:id/statut (fourni, ne pas modifier)

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { traiterRequete } from '../../src/api.js';

const REGISTRE = [
  { id: 'DOC-3f9a1c07', titre: 'Contrat cadre', etat: 'en_circulation' },
  { id: 'DOC-a41be2d9', titre: 'Avenant n° 3', etat: 'signe' },
  { id: 'DOC-5d6e7f80', titre: 'PV du CSE', etat: 'expire' },
];
const appeler = (methode, chemin) => {
  const r = traiterRequete({ methode, chemin }, REGISTRE);
  return { statut: r.statut, corps: JSON.parse(r.corps), type: r.entetes['content-type'] };
};

describe('GET /documents (existant, doit rester vert)', () => {
  it('liste id, titre et état', () => {
    const r = appeler('GET', '/documents');
    assert.equal(r.statut, 200);
    assert.equal(r.corps.length, 3);
  });
});

describe('GET /documents/:id/statut', () => {
  it('200 : état et « termine » pour un document en circulation', () => {
    assert.deepEqual(appeler('GET', '/documents/DOC-3f9a1c07/statut'), {
      statut: 200,
      corps: { id: 'DOC-3f9a1c07', etat: 'en_circulation', termine: false },
      type: 'application/json; charset=utf-8',
    });
  });

  it('200 : termine = true pour un document signé ou expiré', () => {
    assert.equal(appeler('GET', '/documents/DOC-a41be2d9/statut').corps.termine, true);
    assert.equal(appeler('GET', '/documents/DOC-5d6e7f80/statut').corps.termine, true);
  });

  it('ignore la chaîne de requête', () => {
    assert.equal(appeler('GET', '/documents/DOC-3f9a1c07/statut?x=1').statut, 200);
  });

  it('404 DOCUMENT_INCONNU : id valide mais absent', () => {
    assert.deepEqual(appeler('GET', '/documents/DOC-00000000/statut').corps, { erreur: 'DOCUMENT_INCONNU' });
    assert.equal(appeler('GET', '/documents/DOC-00000000/statut').statut, 404);
  });

  for (const id of ['DOC-3F9A1C07', 'DOC-3f9a1c0', 'doc-3f9a1c07', '..%2F..%2Fetc', 'DOC-3f9a1c07x', '%20DOC-3f9a1c07']) {
    it(`400 ID_INVALIDE : ${id}`, () => {
      const r = appeler('GET', `/documents/${id}/statut`);
      assert.equal(r.statut, 400);
      assert.deepEqual(r.corps, { erreur: 'ID_INVALIDE' });
    });
  }

  for (const methode of ['POST', 'DELETE', 'PUT']) {
    it(`405 pour ${methode}`, () => {
      const r = appeler(methode, '/documents/DOC-3f9a1c07/statut');
      assert.equal(r.statut, 405);
      assert.deepEqual(r.corps, { erreur: 'METHODE_NON_AUTORISEE' });
    });
  }

  it('les autres chemins restent en 404 RESSOURCE_INCONNUE', () => {
    assert.deepEqual(appeler('GET', '/documents/DOC-3f9a1c07').corps, { erreur: 'RESSOURCE_INCONNUE' });
    assert.deepEqual(appeler('GET', '/documents/DOC-3f9a1c07/statut/extra').corps, { erreur: 'RESSOURCE_INCONNUE' });
  });
});
