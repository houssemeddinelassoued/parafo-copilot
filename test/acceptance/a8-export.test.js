// Atelier 8 · Ticket 1 : export CSV du registre (fourni, ne pas modifier)
// npm run test:atelier8

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ErreurParafo } from '../../src/erreurs.js';
import { exporterRegistreCsv } from '../../src/export.js';

const codeErreur = (code) => (e) => e instanceof ErreurParafo && e.code === code;
const doc = (champs) => ({ id: 'DOC-3f9a1c07', titre: 'Contrat', auteur: 'claire.dumas@parafo.example', etat: 'signe', creeLe: '2026-10-05T08:12:00.000Z', ...champs });
const lignes = (csv) => csv.replace(/^﻿/, '').split('\r\n');

describe('exporterRegistreCsv', () => {
  it('commence par le BOM puis l’en-tête, et termine chaque ligne par \\r\\n', () => {
    const csv = exporterRegistreCsv([doc()]);
    assert.ok(csv.startsWith('﻿id;titre;auteur;etat;creeLe\r\n'));
    assert.ok(csv.endsWith('\r\n'));
    assert.deepEqual(lignes(csv), ['id;titre;auteur;etat;creeLe', 'DOC-3f9a1c07;Contrat;claire.dumas@parafo.example;signe;2026-10-05T08:12:00.000Z', '']);
  });

  it('registre vide : l’en-tête seul', () => {
    assert.equal(exporterRegistreCsv([], { bom: false }), 'id;titre;auteur;etat;creeLe\r\n');
  });

  it('garde l’ordre reçu et ignore les champs en trop', () => {
    const csv = exporterRegistreCsv([doc({ id: 'DOC-00000002', taille: 9 }), doc({ id: 'DOC-00000001' })], { bom: false });
    assert.deepEqual(lignes(csv).slice(1, 3).map((l) => l.split(';')[0]), ['DOC-00000002', 'DOC-00000001']);
    assert.equal(lignes(csv)[1].split(';').length, 5);
  });

  it('champ absent ou null → champ vide', () => {
    assert.equal(lignes(exporterRegistreCsv([doc({ auteur: undefined, creeLe: null })], { bom: false }))[1], 'DOC-3f9a1c07;Contrat;;signe;');
  });

  it('entoure de guillemets un champ qui contient le séparateur, et double ses guillemets', () => {
    const csv = exporterRegistreCsv([doc({ titre: 'Politique "poste nomade"; v2' })], { bom: false });
    assert.equal(lignes(csv)[1].split(';')[1] + ';' + lignes(csv)[1].split(';')[2], '"Politique ""poste nomade""; v2"');
  });

  it('entoure de guillemets un champ qui contient un retour à la ligne', () => {
    const csv = exporterRegistreCsv([doc({ titre: 'Ligne 1\nLigne 2' })], { bom: false });
    assert.ok(csv.includes(';"Ligne 1\nLigne 2";'));
  });

  for (const debut of ['=', '+', '-', '@', '\t']) {
    it(`neutralise une formule qui commence par ${JSON.stringify(debut)} (apostrophe devant)`, () => {
      const csv = exporterRegistreCsv([doc({ titre: `${debut}SOMME(A1:A9)` })], { bom: false });
      assert.equal(lignes(csv)[1].split(';')[1], `'${debut}SOMME(A1:A9)`);
    });
  }

  it('neutralise ET entoure de guillemets si besoin', () => {
    const csv = exporterRegistreCsv([doc({ titre: '=Devis 2026; à valider' })], { bom: false });
    assert.ok(csv.includes(`;"'=Devis 2026; à valider";`));
  });

  it('accepte un autre séparateur', () => {
    const csv = exporterRegistreCsv([doc({ titre: 'A, B' })], { separateur: ',', bom: false });
    assert.equal(lignes(csv)[0], 'id,titre,auteur,etat,creeLe');
    assert.ok(lignes(csv)[1].includes(',"A, B",'));
  });

  it('refuse un registre qui n’est pas un tableau (REGISTRE_INVALIDE)', () => {
    assert.throws(() => exporterRegistreCsv(null), codeErreur('REGISTRE_INVALIDE'));
    assert.throws(() => exporterRegistreCsv({}), codeErreur('REGISTRE_INVALIDE'));
  });

  it('refuse un séparateur de plusieurs caractères (SEPARATEUR_INVALIDE)', () => {
    assert.throws(() => exporterRegistreCsv([], { separateur: ';;' }), codeErreur('SEPARATEUR_INVALIDE'));
    assert.throws(() => exporterRegistreCsv([], { separateur: '' }), codeErreur('SEPARATEUR_INVALIDE'));
  });
});
