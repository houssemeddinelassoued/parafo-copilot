// Atelier 6 · L'agent Refactoreur et la skill refactoring-sur (fourni, ne pas modifier)
// Contrôle de forme, pour le harnais Copilot (session « Copilot »).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existe, lire, lireFrontmatter, simplifier } from './aides/lecture.js';

const AGENT = '.github/agents/refactoreur.agent.md';
const SKILL = '.github/skills/refactoring-sur/SKILL.md';

describe(AGENT, () => {
  it('existe', () => assert.ok(existe(AGENT), `créez ${AGENT}`));

  const { entete, corps } = existe(AGENT) ? lireFrontmatter(lire(AGENT)) : { entete: null, corps: '' };

  it('a un en-tête YAML avec une description (obligatoire pour le harnais Copilot)', () => {
    assert.ok(entete, 'ajoutez un en-tête entre deux lignes ---');
    assert.ok(typeof entete.description === 'string' && entete.description.length >= 20, 'description : dites ce que fait l’agent et quand l’utiliser');
  });

  it('restreint explicitement ses outils (pas de « * »)', () => {
    assert.ok(Array.isArray(entete?.tools) && entete.tools.length > 0, "déclarez tools, par exemple ['read', 'search', 'edit', 'execute']");
    assert.ok(!entete.tools.includes('*'), '« * » donne tous les outils : choisissez');
    assert.ok(!entete.tools.includes('web'), 'un refactoring local n’a pas besoin du web');
  });

  it('n’utilise pas de champ propre au harnais Local (handoffs, agents)', () => {
    assert.equal(entete?.handoffs, undefined, 'handoffs est ignoré par le harnais Copilot');
    assert.equal(entete?.agents, undefined, 'agents est ignoré par le harnais Copilot');
  });

  it('demande de lancer les tests avant et après chaque pas', () => {
    assert.match(simplifier(corps), /test/);
    assert.ok(corps.trim().split('\n').length >= 5, 'au moins 5 lignes d’instructions');
  });
});

describe(SKILL, () => {
  it('existe (dossier = nom de la skill)', () => assert.ok(existe(SKILL), `créez ${SKILL}`));

  const { entete, corps } = existe(SKILL) ? lireFrontmatter(lire(SKILL)) : { entete: null, corps: '' };

  it('name identique au nom du dossier', () => {
    assert.equal(entete?.name, 'refactoring-sur');
  });

  it('description qui dit quoi ET quand (20 à 1024 caractères)', () => {
    assert.ok(typeof entete?.description === 'string', 'ajoutez description');
    assert.ok(entete.description.length >= 20 && entete.description.length <= 1024);
    assert.match(simplifier(entete.description), /refactor/);
  });

  it('décrit la méthode : caractérisation, petits pas, commit', () => {
    const t = simplifier(corps);
    assert.match(t, /caracterisation/);
    assert.match(t, /commit/);
  });
});
