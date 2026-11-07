// Atelier 4 · Affichage des documents (fourni, ne pas modifier)
// npm run test:atelier4
// Ces tests vérifient le comportement ET les règles maison que vos instructions doivent imposer.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ErreurParafo } from '../../src/erreurs.js';
import { formaterReference, formaterTaille, resumerDocument } from '../../src/format.js';

const codeErreur = (code) => (e) => e instanceof ErreurParafo && e.code === code;

describe('formaterReference', () => {
  it('complète le numéro sur 4 chiffres', () => {
    assert.equal(formaterReference(42, 2026), 'PAR-2026-0042');
    assert.equal(formaterReference(1, 2000), 'PAR-2000-0001');
    assert.equal(formaterReference(9999, 2099), 'PAR-2099-9999');
  });
  for (const numero of [0, 10000, 4.5, '42', -1]) {
    it(`refuse le numéro ${JSON.stringify(numero)} (règle maison : ErreurParafo NUMERO_INVALIDE)`, () => {
      assert.throws(() => formaterReference(numero, 2026), codeErreur('NUMERO_INVALIDE'));
    });
  }
  for (const annee of [1999, 2100, '2026']) {
    it(`refuse l’année ${JSON.stringify(annee)} (ANNEE_INVALIDE)`, () => {
      assert.throws(() => formaterReference(1, annee), codeErreur('ANNEE_INVALIDE'));
    });
  }
});

describe('formaterTaille (règle maison : virgule décimale, unités o / Ko / Mo)', () => {
  for (const [octets, attendu] of [
    [0, '0 o'],
    [512, '512 o'],
    [1023, '1023 o'],
    [1024, '1,0 Ko'],
    [12_800, '12,5 Ko'],
    [1_048_575, '1024,0 Ko'],
    [1_048_576, '1,0 Mo'],
    [1_258_291, '1,2 Mo'],
  ]) {
    it(`${octets} → ${attendu}`, () => assert.equal(formaterTaille(octets), attendu));
  }
  for (const octets of [-1, 1.5, '12', undefined]) {
    it(`refuse ${JSON.stringify(octets)} (TAILLE_INVALIDE)`, () => {
      assert.throws(() => formaterTaille(octets), codeErreur('TAILLE_INVALIDE'));
    });
  }
});

describe('resumerDocument', () => {
  const doc = { id: 'DOC-1a2b3c4d', titre: 'Contrat cadre', etat: 'en_circulation', taille: 12_800 };
  it('assemble titre entre guillemets français, état lisible, taille et identifiant', () => {
    assert.equal(resumerDocument(doc), '« Contrat cadre » · en circulation · 12,5 Ko · DOC-1a2b3c4d');
  });
  for (const [etat, libelle] of [
    ['brouillon', 'brouillon'],
    ['signe', 'signé'],
    ['refuse', 'refusé'],
    ['expire', 'expiré'],
    ['annule', 'annulé'],
  ]) {
    it(`libellé de l’état ${etat} : ${libelle}`, () => {
      assert.match(resumerDocument({ ...doc, etat }), new RegExp(` · ${libelle} · `));
    });
  }
  it('refuse un état inconnu ou un document incomplet (DOCUMENT_INVALIDE)', () => {
    assert.throws(() => resumerDocument({ ...doc, etat: 'archive' }), codeErreur('DOCUMENT_INVALIDE'));
    assert.throws(() => resumerDocument({ id: 'DOC-1a2b3c4d' }), codeErreur('DOCUMENT_INVALIDE'));
    assert.throws(() => resumerDocument(null), codeErreur('DOCUMENT_INVALIDE'));
  });
});
