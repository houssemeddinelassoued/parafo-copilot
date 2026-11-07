// Atelier 9 · L'agent Relecteur, en lecture seule (fourni, ne pas modifier)
// npm run test:atelier9 lance aussi les tests de la revue (ateliers/atelier-09-revue/).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existe, lire, lireFrontmatter, simplifier } from './aides/lecture.js';

const AGENT = '.github/agents/relecteur.agent.md';
const LECTURE_SEULE = new Set(['read', 'search']);

describe(AGENT, () => {
  it('existe', () => assert.ok(existe(AGENT), `créez ${AGENT}`));

  const { entete, corps } = existe(AGENT) ? lireFrontmatter(lire(AGENT)) : { entete: null, corps: '' };

  it('a une description', () => {
    assert.ok(typeof entete?.description === 'string' && entete.description.length >= 20);
  });

  it('n’a que des outils de lecture (read, search) : un relecteur ne modifie rien', () => {
    assert.ok(Array.isArray(entete?.tools) && entete.tools.length > 0, "déclarez tools: ['read', 'search']");
    const interdits = entete.tools.filter((t) => !LECTURE_SEULE.has(t));
    assert.deepEqual(interdits, [], `outils en trop : ${interdits.join(', ')}`);
  });

  it('suit la checklist de revue (logique, sécurité, API inventée, licence)', () => {
    const t = simplifier(corps);
    for (const mot of ['securite', 'licence', 'api']) assert.match(t, new RegExp(mot), `la checklist doit parler de ${mot}`);
  });
});
