// Atelier 3 · Le document à signer (fourni, ne pas modifier)
// npm run test:atelier3

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { ErreurParafo } from '../../src/erreurs.js';
import { TAILLE_MAX, changerEtat, creerDocument, empreinteSha256, estTermine } from '../../src/document.js';

const MAINTENANT = new Date('2026-11-09T09:00:00.000Z');
const PLUS_TARD = new Date('2026-11-09T10:30:00.000Z');
const valide = { titre: '  Contrat cadre  ', contenu: 'Article 1 : objet du contrat.', auteur: ' Claire.Dumas@Parafo.example ', maintenant: MAINTENANT };
const codeErreur = (code) => (e) => e instanceof ErreurParafo && e.code === code;

describe('empreinteSha256', () => {
  it('renvoie le SHA-256 hexadécimal du contenu', () => {
    assert.equal(empreinteSha256('abc'), createHash('sha256').update('abc').digest('hex'));
  });
  it('accepte des octets (Buffer)', () => {
    assert.equal(empreinteSha256(Buffer.from('abc')), empreinteSha256('abc'));
  });
});

describe('creerDocument', () => {
  it('crée un brouillon avec titre nettoyé, auteur en minuscules, empreinte, taille et historique', () => {
    const doc = creerDocument(valide);
    const empreinte = createHash('sha256').update(valide.contenu).digest('hex');
    assert.deepEqual(doc, {
      id: `DOC-${empreinte.slice(0, 8)}`,
      titre: 'Contrat cadre',
      auteur: 'claire.dumas@parafo.example',
      empreinte,
      taille: Buffer.byteLength(valide.contenu),
      etat: 'brouillon',
      creeLe: '2026-11-09T09:00:00.000Z',
      historique: [{ etat: 'brouillon', le: '2026-11-09T09:00:00.000Z' }],
    });
  });

  it('compte la taille en octets, pas en caractères', () => {
    assert.equal(creerDocument({ ...valide, contenu: 'été' }).taille, 5);
  });

  for (const titre of [undefined, '', '  ab  ', 'x'.repeat(121), 42]) {
    it(`refuse le titre ${JSON.stringify(titre)} (TITRE_INVALIDE)`, () => {
      assert.throws(() => creerDocument({ ...valide, titre }), codeErreur('TITRE_INVALIDE'));
    });
  }

  it('accepte un titre de 3 et de 120 caractères (bornes incluses)', () => {
    assert.equal(creerDocument({ ...valide, titre: 'abc' }).titre, 'abc');
    assert.equal(creerDocument({ ...valide, titre: 'x'.repeat(120) }).titre.length, 120);
  });

  for (const contenu of [undefined, '', 12, {}]) {
    it(`refuse le contenu ${JSON.stringify(contenu)} (CONTENU_INVALIDE)`, () => {
      assert.throws(() => creerDocument({ ...valide, contenu }), codeErreur('CONTENU_INVALIDE'));
    });
  }

  it('refuse un document de plus de 10 Mo (DOCUMENT_TROP_VOLUMINEUX), accepte 10 Mo pile', () => {
    assert.equal(creerDocument({ ...valide, contenu: Buffer.alloc(TAILLE_MAX, 1) }).taille, TAILLE_MAX);
    assert.throws(() => creerDocument({ ...valide, contenu: Buffer.alloc(TAILLE_MAX + 1, 1) }), codeErreur('DOCUMENT_TROP_VOLUMINEUX'));
  });

  for (const auteur of [undefined, '', 'claire', 'claire@parafo', 'claire dumas@parafo.example']) {
    it(`refuse l’auteur ${JSON.stringify(auteur)} (AUTEUR_INVALIDE)`, () => {
      assert.throws(() => creerDocument({ ...valide, auteur }), codeErreur('AUTEUR_INVALIDE'));
    });
  }
});

describe('changerEtat', () => {
  it('fait passer un brouillon en circulation sans modifier l’original', () => {
    const doc = creerDocument(valide);
    const suivant = changerEtat(doc, 'en_circulation', PLUS_TARD);
    assert.equal(suivant.etat, 'en_circulation');
    assert.deepEqual(suivant.historique.at(-1), { etat: 'en_circulation', le: '2026-11-09T10:30:00.000Z' });
    assert.equal(doc.etat, 'brouillon');
    assert.equal(doc.historique.length, 1);
  });

  it('suit le cycle complet brouillon → en circulation → signé', () => {
    const signe = changerEtat(changerEtat(creerDocument(valide), 'en_circulation', PLUS_TARD), 'signe', PLUS_TARD);
    assert.deepEqual(signe.historique.map((h) => h.etat), ['brouillon', 'en_circulation', 'signe']);
  });

  for (const [depart, interdit] of [
    ['brouillon', 'signe'],
    ['brouillon', 'refuse'],
    ['brouillon', 'expire'],
    ['signe', 'annule'],
    ['refuse', 'en_circulation'],
    ['annule', 'brouillon'],
  ]) {
    it(`interdit ${depart} → ${interdit} (TRANSITION_INTERDITE)`, () => {
      const doc = { ...creerDocument(valide), etat: depart };
      assert.throws(() => changerEtat(doc, interdit, PLUS_TARD), codeErreur('TRANSITION_INTERDITE'));
    });
  }

  for (const [depart, permis] of [
    ['brouillon', 'annule'],
    ['en_circulation', 'refuse'],
    ['en_circulation', 'expire'],
    ['en_circulation', 'annule'],
  ]) {
    it(`permet ${depart} → ${permis}`, () => {
      const doc = { ...creerDocument(valide), etat: depart };
      assert.equal(changerEtat(doc, permis, PLUS_TARD).etat, permis);
    });
  }

  it('refuse un état inconnu (ETAT_INCONNU)', () => {
    assert.throws(() => changerEtat(creerDocument(valide), 'archive', PLUS_TARD), codeErreur('ETAT_INCONNU'));
  });
});

describe('estTermine', () => {
  for (const [etat, attendu] of [
    ['brouillon', false],
    ['en_circulation', false],
    ['signe', true],
    ['refuse', true],
    ['expire', true],
    ['annule', true],
  ]) {
    it(`${etat} → ${attendu}`, () => {
      assert.equal(estTermine({ ...creerDocument(valide), etat }), attendu);
    });
  }
});
