// Utilitaires de lecture pour les tests d'acceptation (fourni, ne pas modifier).

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const racine = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const chemin = (relatif) => join(racine, ...relatif.split('/'));
export const existe = (relatif) => existsSync(chemin(relatif));
export const lire = (relatif) => readFileSync(chemin(relatif), 'utf8').replace(/\r\n/g, '\n');

/** Texte sans accents, en minuscules : pour chercher un mot-clé sans être pointilleux. */
export const simplifier = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function valeurYaml(brut) {
  const v = brut.trim();
  if (v === '') return '';
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((x) => x.trim().replace(/^['"]|['"]$/g, ''))
      .filter((x) => x !== '');
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v.replace(/^['"]|['"]$/g, '');
}

/**
 * Lit l'en-tête YAML simple (entre deux lignes ---) d'un fichier Markdown.
 * Gère « clé: valeur », « clé: [a, b] » et les listes « - a » sous une clé.
 * @returns {{ entete: Record<string, any> | null, corps: string }}
 */
export function lireFrontmatter(texte) {
  const m = /^﻿?---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(texte);
  if (!m) return { entete: null, corps: texte };
  const entete = {};
  let cleListe = null;
  for (const ligne of m[1].split('\n')) {
    if (/^\s*#/.test(ligne) || ligne.trim() === '') continue;
    const item = /^\s+-\s+(.*)$/.exec(ligne) ?? /^-\s+(.*)$/.exec(ligne);
    if (item && cleListe) {
      if (!Array.isArray(entete[cleListe])) entete[cleListe] = [];
      entete[cleListe].push(valeurYaml(item[1]));
      continue;
    }
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(ligne);
    if (kv) {
      entete[kv[1]] = valeurYaml(kv[2]);
      cleListe = kv[2].trim() === '' ? kv[1] : null;
    } else if (/^\s+\S/.test(ligne) && cleListe === null) {
      // suite d'une valeur sur plusieurs lignes (description: >) : ignorée
    }
  }
  return { entete, corps: m[2] };
}

/** Lit un fichier JSON avec commentaires et virgules finales (format des réglages VS Code). */
export function lireJsonc(texte) {
  let sortie = '';
  let dansChaine = false;
  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (dansChaine) {
      sortie += c;
      if (c === '\\') sortie += texte[++i] ?? '';
      else if (c === '"') dansChaine = false;
      continue;
    }
    if (c === '"') {
      dansChaine = true;
      sortie += c;
    } else if (c === '/' && texte[i + 1] === '/') {
      while (i < texte.length && texte[i] !== '\n') i++;
      sortie += '\n';
    } else if (c === '/' && texte[i + 1] === '*') {
      i += 2;
      while (i < texte.length && !(texte[i] === '*' && texte[i + 1] === '/')) i++;
      i++;
    } else {
      sortie += c;
    }
  }
  return JSON.parse(sortie.replace(/,(\s*[}\]])/g, '$1'));
}
