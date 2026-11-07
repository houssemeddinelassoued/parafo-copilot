// Atelier 7 · La skill tests-node et sa définition de fini (fourni, ne pas modifier)
// npm run test:atelier7 lance ensuite le test de mutation (scripts/mutation.js).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existe, lire, lireFrontmatter, simplifier } from './aides/lecture.js';

const SKILL = '.github/skills/tests-node/SKILL.md';
const TESTS = 'test/journal.test.js';

describe(SKILL, () => {
  it('existe', () => assert.ok(existe(SKILL), `créez ${SKILL}`));

  const { entete, corps } = existe(SKILL) ? lireFrontmatter(lire(SKILL)) : { entete: null, corps: '' };

  it('name = tests-node, description qui contient « test »', () => {
    assert.equal(entete?.name, 'tests-node');
    assert.match(simplifier(String(entete?.description ?? '')), /test/);
  });

  it('impose node:test et le schéma Arrange / Act / Assert', () => {
    assert.match(corps, /node:test/);
    assert.match(simplifier(corps), /arrange|organiser|preparer/);
  });

  it('contient une section « Définition de fini » qui cite npm run garde et la mutation', () => {
    const t = simplifier(corps);
    assert.match(t, /#+\s*definition de fini/, 'ajoutez un titre « ## Définition de fini »');
    assert.match(t, /npm run garde/);
    assert.match(t, /mutation/);
  });
});

describe(TESTS, () => {
  it('existe (généré avec la skill)', () => assert.ok(existe(TESTS), `créez ${TESTS}`));

  it('utilise node:test et une horloge injectée', () => {
    const t = lire(TESTS);
    assert.match(t, /from ['"]node:test['"]/);
    assert.match(t, /horloge/);
  });
});
