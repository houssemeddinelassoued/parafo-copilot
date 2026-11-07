// Atelier 5 · Le circuit de signature (fourni, ne pas modifier)
// npm run test:atelier5

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ErreurParafo } from '../../src/erreurs.js';
import { avancement, creerCircuit, prochainsSignataires, refuser, signer } from '../../src/circuit.js';

const T1 = new Date('2026-11-10T08:00:00.000Z');
const T2 = new Date('2026-11-10T09:00:00.000Z');
const T3 = new Date('2026-11-10T10:00:00.000Z');
const SIGNATAIRES = ['Claire.Dumas@parafo.example', 'karim.benali@parafo.example', 'lea.moreau@parafo.example'];
const codeErreur = (code) => (e) => e instanceof ErreurParafo && e.code === code;
const sequentiel = () => creerCircuit({ documentId: 'DOC-3f9a1c07', signataires: SIGNATAIRES });
const parallele = () => creerCircuit({ documentId: 'DOC-3f9a1c07', signataires: SIGNATAIRES, mode: 'parallele' });

describe('creerCircuit', () => {
  it('crée un circuit séquentiel par défaut, e-mails en minuscules, étapes numérotées', () => {
    assert.deepEqual(sequentiel(), {
      documentId: 'DOC-3f9a1c07',
      mode: 'sequentiel',
      statut: 'en_cours',
      etapes: [
        { email: 'claire.dumas@parafo.example', ordre: 1, decision: null, le: null },
        { email: 'karim.benali@parafo.example', ordre: 2, decision: null, le: null },
        { email: 'lea.moreau@parafo.example', ordre: 3, decision: null, le: null },
      ],
    });
  });

  for (const signataires of [undefined, [], ['pas-un-email'], ['a@parafo.example', 'A@Parafo.example'], 'a@parafo.example']) {
    it(`refuse les signataires ${JSON.stringify(signataires)} (SIGNATAIRES_INVALIDES)`, () => {
      assert.throws(() => creerCircuit({ documentId: 'DOC-3f9a1c07', signataires }), codeErreur('SIGNATAIRES_INVALIDES'));
    });
  }

  it('refuse un mode inconnu (MODE_INVALIDE)', () => {
    assert.throws(() => creerCircuit({ documentId: 'DOC-3f9a1c07', signataires: SIGNATAIRES, mode: 'aleatoire' }), codeErreur('MODE_INVALIDE'));
  });
});

describe('prochainsSignataires', () => {
  it('séquentiel : seulement le premier sans décision', () => {
    assert.deepEqual(prochainsSignataires(sequentiel()), ['claire.dumas@parafo.example']);
    const apres = signer(sequentiel(), 'claire.dumas@parafo.example', T1);
    assert.deepEqual(prochainsSignataires(apres), ['karim.benali@parafo.example']);
  });

  it('parallèle : tous ceux qui n’ont pas décidé', () => {
    const apres = signer(parallele(), 'karim.benali@parafo.example', T1);
    assert.deepEqual(prochainsSignataires(apres), ['claire.dumas@parafo.example', 'lea.moreau@parafo.example']);
  });

  it('circuit terminé : personne', () => {
    const refuse = refuser(sequentiel(), 'claire.dumas@parafo.example', 'Montant erroné', T1);
    assert.deepEqual(prochainsSignataires(refuse), []);
  });
});

describe('signer', () => {
  it('enregistre la décision et la date, sans modifier le circuit d’origine', () => {
    const avant = sequentiel();
    const apres = signer(avant, 'CLAIRE.DUMAS@parafo.example', T1);
    assert.deepEqual(apres.etapes[0], { email: 'claire.dumas@parafo.example', ordre: 1, decision: 'signe', le: '2026-11-10T08:00:00.000Z' });
    assert.equal(avant.etapes[0].decision, null);
    assert.equal(apres.statut, 'en_cours');
  });

  it('passe le circuit à « signe » quand tout le monde a signé', () => {
    let c = sequentiel();
    c = signer(c, 'claire.dumas@parafo.example', T1);
    c = signer(c, 'karim.benali@parafo.example', T2);
    c = signer(c, 'lea.moreau@parafo.example', T3);
    assert.equal(c.statut, 'signe');
  });

  it('parallèle : l’ordre de signature est libre', () => {
    let c = parallele();
    c = signer(c, 'lea.moreau@parafo.example', T1);
    c = signer(c, 'claire.dumas@parafo.example', T2);
    c = signer(c, 'karim.benali@parafo.example', T3);
    assert.equal(c.statut, 'signe');
  });

  it('séquentiel : refuse celui dont ce n’est pas le tour (PAS_VOTRE_TOUR)', () => {
    assert.throws(() => signer(sequentiel(), 'lea.moreau@parafo.example', T1), codeErreur('PAS_VOTRE_TOUR'));
  });

  it('refuse un inconnu (SIGNATAIRE_INCONNU)', () => {
    assert.throws(() => signer(sequentiel(), 'intrus@parafo.example', T1), codeErreur('SIGNATAIRE_INCONNU'));
  });

  it('refuse une deuxième décision (DEJA_DECIDE)', () => {
    const c = signer(parallele(), 'karim.benali@parafo.example', T1);
    assert.throws(() => signer(c, 'karim.benali@parafo.example', T2), codeErreur('DEJA_DECIDE'));
  });

  it('refuse toute décision sur un circuit terminé (CIRCUIT_TERMINE), avant les autres contrôles', () => {
    const refuse = refuser(parallele(), 'karim.benali@parafo.example', 'Clause 4 à revoir', T1);
    assert.throws(() => signer(refuse, 'claire.dumas@parafo.example', T2), codeErreur('CIRCUIT_TERMINE'));
    assert.throws(() => signer(refuse, 'intrus@parafo.example', T2), codeErreur('CIRCUIT_TERMINE'));
  });
});

describe('refuser', () => {
  it('termine le circuit immédiatement et garde le motif hors des étapes des autres', () => {
    const c = refuser(sequentiel(), 'claire.dumas@parafo.example', 'Montant erroné', T1);
    assert.equal(c.statut, 'refuse');
    assert.equal(c.etapes[0].decision, 'refuse');
    assert.equal(c.etapes[0].le, '2026-11-10T08:00:00.000Z');
    assert.equal(c.etapes[1].decision, null);
  });

  for (const motif of [undefined, '', '   ']) {
    it(`exige un motif, ${JSON.stringify(motif)} refusé (MOTIF_OBLIGATOIRE)`, () => {
      assert.throws(() => refuser(sequentiel(), 'claire.dumas@parafo.example', motif, T1), codeErreur('MOTIF_OBLIGATOIRE'));
    });
  }

  it('respecte aussi le tour en séquentiel (PAS_VOTRE_TOUR)', () => {
    assert.throws(() => refuser(sequentiel(), 'lea.moreau@parafo.example', 'Non', T1), codeErreur('PAS_VOTRE_TOUR'));
  });
});

describe('avancement', () => {
  it('compte les signatures et arrondit le pourcentage', () => {
    assert.deepEqual(avancement(sequentiel()), { signes: 0, total: 3, pourcentage: 0 });
    const c = signer(sequentiel(), 'claire.dumas@parafo.example', T1);
    assert.deepEqual(avancement(c), { signes: 1, total: 3, pourcentage: 33 });
    const c2 = signer(c, 'karim.benali@parafo.example', T2);
    assert.deepEqual(avancement(c2), { signes: 2, total: 3, pourcentage: 67 });
  });
});
