// Atelier 9 · Tests de la revue de la PR n° 42 (fourni, ne pas modifier)
// Ils échouent tant que les défauts ne sont pas corrigés dans pr-42/.
// npm run test:atelier9

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { isAbsolute, relative } from 'node:path';
import { ErreurParafo } from '../../src/erreurs.js';
import { DOSSIER_SIGNES, cheminDocument } from './pr-42/telechargement.js';
import { empreinteValide } from './pr-42/verification.js';
import { tailleLisible } from './pr-42/taille.js';
import { peutEncoreSigner } from './pr-42/expiration.js';

const source = (fichier) => readFileSync(new URL(`./pr-42/${fichier}`, import.meta.url), 'utf8');
const codeErreur = (code) => (e) => e instanceof ErreurParafo && e.code === code;

describe('telechargement.js', () => {
  it('construit le chemin d’un nom de fichier normal, dans le dossier des signés', () => {
    const c = cheminDocument('DOC-3f9a1c07.pdf');
    const r = relative(DOSSIER_SIGNES, c);
    assert.ok(r === 'DOC-3f9a1c07.pdf', `chemin inattendu : ${c}`);
  });

  for (const nom of ['../../package.json', '..\\..\\package.json', 'sous-dossier/DOC-3f9a1c07.pdf', '/etc/passwd', 'C:\\Windows\\win.ini', '', 'DOC-3f9a1c07.exe']) {
    it(`refuse ${JSON.stringify(nom)} (NOM_INVALIDE) : aucune sortie du dossier`, () => {
      assert.throws(() => cheminDocument(nom), codeErreur('NOM_INVALIDE'));
    });
  }

  it('le chemin renvoyé est toujours absolu', () => {
    assert.ok(isAbsolute(cheminDocument('DOC-a41be2d9.pdf')));
  });
});

describe('verification.js', () => {
  const contenu = Buffer.from('PDF signé fictif');
  const bonne = createHash('sha256').update(contenu).digest('hex');

  it('vrai pour la bonne empreinte (l’API utilisée doit exister)', () => {
    assert.equal(empreinteValide(contenu, bonne), true);
  });

  it('faux pour une autre empreinte de même longueur', () => {
    assert.equal(empreinteValide(contenu, bonne.replace(/^./, bonne[0] === 'a' ? 'b' : 'a')), false);
  });

  it('faux, sans exception, pour une empreinte de longueur différente ou non hexadécimale', () => {
    assert.equal(empreinteValide(contenu, 'abc'), false);
    assert.equal(empreinteValide(contenu, 'z'.repeat(64)), false);
    assert.equal(empreinteValide(contenu, undefined), false);
  });

  it('compare en temps constant (crypto.timingSafeEqual)', () => {
    assert.match(source('verification.js'), /timingSafeEqual/);
  });
});

describe('taille.js', () => {
  it('suit la règle Parafo (1 Ko = 1024 o, virgule) : 12 800 o → 12,5 Ko', () => {
    assert.equal(tailleLisible(12_800), '12,5 Ko');
  });

  it('aucun extrait sous licence incompatible (GPL) dans la PR', () => {
    for (const f of readdirSync(new URL('./pr-42/', import.meta.url))) {
      assert.doesNotMatch(source(f), /GPL|Copyright \(c\)/i, `${f} contient une notice de licence copiée`);
    }
  });
});

describe('expiration.js', () => {
  it('on peut encore signer le jour de l’expiration', () => {
    assert.equal(peutEncoreSigner('2026-11-20', '2026-11-20'), true);
  });
  it('plus le lendemain', () => {
    assert.equal(peutEncoreSigner('2026-11-20', '2026-11-21'), false);
  });
  it('et bien sûr avant', () => {
    assert.equal(peutEncoreSigner('2026-11-20', '2026-11-19'), true);
  });
});
