// Atelier 2 · Un même besoin, quatre modes (fourni, ne pas modifier)
// npm run test:atelier2

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ErreurParafo } from '../../src/erreurs.js';

const MODES = ['inline', 'ask', 'plan', 'agent'];

for (const mode of MODES) {
  describe(`normaliserEmail · version « ${mode} » (katas/02-quatre-modes/${mode}.js)`, async () => {
    const { normaliserEmail } = await import(`../../katas/02-quatre-modes/${mode}.js`);

    it('supprime les espaces autour et passe en minuscules', () => {
      assert.equal(normaliserEmail('  Alice.Martin@Exemple.FR '), 'alice.martin@exemple.fr');
    });

    it('retire un alias « +… » de la partie locale', () => {
      assert.equal(normaliserEmail('alice+factures@exemple.fr'), 'alice@exemple.fr');
    });

    for (const invalide of ['', '   ', 'alice', 'alice@', '@exemple.fr', 'alice@@exemple.fr', 'alice@exemple', 'ali ce@exemple.fr']) {
      it(`refuse ${JSON.stringify(invalide)} avec ErreurParafo EMAIL_INVALIDE`, () => {
        assert.throws(() => normaliserEmail(invalide), (e) => e instanceof ErreurParafo && e.code === 'EMAIL_INVALIDE');
      });
    }

    it('refuse une valeur qui n’est pas une chaîne', () => {
      assert.throws(() => normaliserEmail(42), (e) => e instanceof ErreurParafo && e.code === 'EMAIL_INVALIDE');
    });
  });
}
