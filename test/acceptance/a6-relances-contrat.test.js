// Atelier 6 · Tests de CONTRAT de la version moderne (fourni, ne pas modifier)
// npm run test:atelier6

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ErreurParafo } from '../../src/erreurs.js';
import { ajouterJoursOuvres, dateExpiration, datesRelance, estExpire } from '../../src/relances.js';

const codeErreur = (code) => (e) => e instanceof ErreurParafo && e.code === code;

describe('ajouterJoursOuvres', () => {
  it('le jour de départ ne compte pas : lundi + 5 → lundi suivant', () => {
    assert.equal(ajouterJoursOuvres('2026-03-02', 5), '2026-03-09');
  });
  it('départ un samedi : samedi + 5 → vendredi suivant', () => {
    assert.equal(ajouterJoursOuvres('2026-03-07', 5), '2026-03-13');
  });
  it('saute les jours fériés fournis', () => {
    assert.equal(ajouterJoursOuvres('2026-04-30', 3, ['2026-05-01']), '2026-05-06');
  });
  it('n = 0 → la date elle-même', () => {
    assert.equal(ajouterJoursOuvres('2026-03-07', 0), '2026-03-07');
  });
  it('passe le changement d’année', () => {
    assert.equal(ajouterJoursOuvres('2026-12-31', 1, ['2027-01-01']), '2027-01-04');
  });
  for (const n of ['5', -1, 1.5, undefined]) {
    it(`refuse le délai ${JSON.stringify(n)} (DELAI_INVALIDE)`, () => {
      assert.throws(() => ajouterJoursOuvres('2026-03-02', n), codeErreur('DELAI_INVALIDE'));
    });
  }
  for (const date of ['2026-02-30', '2026/03/02', '', '02-03-2026', undefined]) {
    it(`refuse la date ${JSON.stringify(date)} (DATE_INVALIDE)`, () => {
      assert.throws(() => ajouterJoursOuvres(date, 1), codeErreur('DATE_INVALIDE'));
    });
  }
  it('ne modifie pas la liste des fériés reçue', () => {
    const feries = ['2026-12-25', '2026-05-01'];
    ajouterJoursOuvres('2026-04-30', 3, feries);
    assert.deepEqual(feries, ['2026-12-25', '2026-05-01']);
  });
});

describe('dateExpiration · le bug de 2019 est corrigé', () => {
  it('lundi + 5 jours ouvrés → lundi suivant (2019 donnait le vendredi)', () => {
    assert.equal(dateExpiration('2026-03-02', 5), '2026-03-09');
  });
});

describe('datesRelance', () => {
  it('tous les 3 jours ouvrés après l’envoi, strictement avant l’expiration', () => {
    assert.deepEqual(datesRelance('2026-03-02', 10), ['2026-03-05', '2026-03-10', '2026-03-13']);
  });
  it('intervalle personnalisé', () => {
    assert.deepEqual(datesRelance('2026-03-02', 10, [], 5), ['2026-03-09']);
  });
  it('délai court : aucune relance', () => {
    assert.deepEqual(datesRelance('2026-03-02', 3), []);
  });
  for (const intervalle of [0, -3, 2.5, '3']) {
    it(`refuse l’intervalle ${JSON.stringify(intervalle)} (INTERVALLE_INVALIDE)`, () => {
      assert.throws(() => datesRelance('2026-03-02', 10, [], intervalle), codeErreur('INTERVALLE_INVALIDE'));
    });
  }
});

describe('estExpire', () => {
  it('on peut encore signer le jour de l’expiration', () => {
    assert.equal(estExpire('2026-03-02', 5, '2026-03-09'), false);
  });
  it('expiré le lendemain de la date d’expiration', () => {
    assert.equal(estExpire('2026-03-02', 5, '2026-03-10'), true);
  });
  it('pas expiré avant', () => {
    assert.equal(estExpire('2026-03-02', 5, '2026-03-04'), false);
  });
  it('refuse une date du jour mal formée (DATE_INVALIDE)', () => {
    assert.throws(() => estExpire('2026-03-02', 5, '10/03/2026'), codeErreur('DATE_INVALIDE'));
  });
});
