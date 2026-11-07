// Atelier 4 · Les fichiers Markdown qui guident Copilot (fourni, ne pas modifier)
// Contrôle de forme : le fond (ce que Copilot en fait) se juge en A/B, dans JOURNAL.md.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existe, lire, lireFrontmatter, simplifier } from './aides/lecture.js';

const INSTRUCTIONS = '.github/copilot-instructions.md';
const TESTS = '.github/instructions/tests.instructions.md';

describe(INSTRUCTIONS, () => {
  it('existe', () => assert.ok(existe(INSTRUCTIONS), `créez ${INSTRUCTIONS}`));

  it('reste court : 60 lignes non vides au plus (il occupe le contexte de CHAQUE requête)', () => {
    const lignes = lire(INSTRUCTIONS).split('\n').filter((l) => l.trim() !== '');
    assert.ok(lignes.length >= 5, 'au moins 5 lignes : présentez le projet et ses règles');
    assert.ok(lignes.length <= 60, `${lignes.length} lignes : resserrez`);
  });

  it('impose les règles maison (ErreurParafo, aucune dépendance, français)', () => {
    const texte = simplifier(lire(INSTRUCTIONS));
    assert.match(texte, /erreurparafo/, 'citez ErreurParafo (src/erreurs.js)');
    assert.match(texte, /dependance/, 'dites qu’aucune dépendance npm n’est autorisée');
    assert.match(texte, /francais/, 'précisez la langue des messages et de la JSDoc');
  });

  it('ne contient aucun secret', () => {
    assert.doesNotMatch(lire(INSTRUCTIONS), /(ghp_|github_pat_|sk-[A-Za-z0-9]{10}|password\s*[:=])/i);
  });
});

describe(TESTS, () => {
  it('existe', () => assert.ok(existe(TESTS), `créez ${TESTS}`));

  it('cible les fichiers de test avec applyTo', () => {
    const { entete } = lireFrontmatter(lire(TESTS));
    assert.ok(entete, 'ajoutez un en-tête YAML entre deux lignes ---');
    assert.ok(typeof entete.applyTo === 'string' && /test/.test(entete.applyTo), 'applyTo doit viser les tests, par exemple "test/**/*.test.js"');
  });

  it('parle de node:test', () => {
    assert.match(lire(TESTS), /node:test/);
  });
});
