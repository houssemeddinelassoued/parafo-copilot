// Atelier 6 · Tests de CARACTÉRISATION du code de 2019 (fourni, ne pas modifier)
//
// Ils figent le comportement ACTUEL de calc(), défauts compris (marqués ⚠).
// Pendant le refactoring, ils doivent rester verts : refactorer = même comportement.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calc } from '../../src/legacy/relances-2019.js';

describe('calc() · comportement de 2019, à conserver pendant le refactoring', () => {
  it('expiration : 5 jours ouvrés depuis un lundi → le vendredi (⚠ le jour d’envoi compte)', () => {
    assert.equal(calc('2026-03-02', 5, [], 'e'), '2026-03-06');
  });

  it('expiration : envoi un samedi → on compte à partir du lundi', () => {
    assert.equal(calc('2026-03-07', 5, [], 'e'), '2026-03-13');
  });

  it('expiration : 1 jour ouvré depuis un lundi → le lundi même (⚠)', () => {
    assert.equal(calc('2026-03-02', 1, [], 'e'), '2026-03-02');
  });

  it('expiration : délai 0 depuis un samedi → le samedi', () => {
    assert.equal(calc('2026-03-07', 0, [], 'e'), '2026-03-07');
  });

  it('saute les week-ends et les jours fériés fournis', () => {
    assert.equal(calc('2026-04-30', 3, ['2026-05-01'], 'e'), '2026-05-05');
  });

  it('⚠ sans liste fournie, utilise les fériés de 2019 : le 1er mai 2026 compte comme ouvré', () => {
    assert.equal(calc('2026-04-30', 3, undefined, 'e'), '2026-05-04');
  });

  it('relances : tous les 3 jours ouvrés comptés depuis le jour d’envoi, avant l’expiration', () => {
    assert.deepEqual(calc('2026-03-02', 10, [], 'r'), ['2026-03-04', '2026-03-09', '2026-03-12']);
  });

  it('⚠ accepte un délai en texte : "5" se comporte comme 5', () => {
    assert.equal(calc('2026-03-02', '5', [], 'e'), '2026-03-06');
  });

  it('⚠ trie sur place la liste des fériés reçue (effet de bord)', () => {
    const feries = ['2026-12-25', '2026-05-01'];
    calc('2026-03-02', 2, feries, 'e');
    assert.deepEqual(feries, ['2026-05-01', '2026-12-25']);
  });

  it('type inconnu → null', () => {
    assert.equal(calc('2026-03-02', 5, [], 'x'), null);
  });
});
