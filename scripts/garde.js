// Garde-fou : npm run garde
//
// Vérifie que les fichiers « contrat » n'ont pas été modifiés : tests d'acceptation,
// journal fourni (src/journal.js), scripts de contrôle. Un agent qui « fait passer
// les tests » en changeant les tests est pris ici.
// Fait partie de la définition de fini (Atelier 7).

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const attendues = JSON.parse(readFileSync(join(racine, 'scripts', 'empreintes.json'), 'utf8'));

// Fins de ligne normalisées : Git sous Windows peut convertir LF en CRLF.
const empreinte = (chemin) =>
  createHash('sha256').update(readFileSync(chemin, 'utf8').replace(/\r\n/g, '\n')).digest('hex');

const problemes = [];
for (const [chemin, attendue] of Object.entries(attendues)) {
  const complet = join(racine, ...chemin.split('/'));
  if (!existsSync(complet)) problemes.push(`supprimé : ${chemin}`);
  else if (empreinte(complet) !== attendue) problemes.push(`modifié  : ${chemin}`);
}

if (problemes.length > 0) {
  console.error('✖ Garde : des fichiers protégés ont changé.\n');
  for (const p of problemes) console.error(`  ${p}`);
  console.error('\nRestaurez-les (git checkout -- <fichier>) : on corrige le code, jamais le contrat.');
  process.exit(1);
}
console.log(`✔ Garde : ${Object.keys(attendues).length} fichiers protégés intacts.`);
