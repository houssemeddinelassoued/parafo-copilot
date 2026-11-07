// Points de reprise : npm run reprise -- 5
//
// Place votre copie dans l'état « fin de l'Atelier 5 » (paquets fin-atelier-03 à 05),
// pour démarrer l'atelier suivant même si le précédent n'est pas terminé.
// Vos fichiers remplacés sont d'abord sauvegardés dans .reprises-sauvegardes/.
//
// Les paquets sont volontairement illisibles (compressés) : l'agent ne doit pas
// y « trouver la réponse » pendant que vous travaillez.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dossierPaquets = join(racine, 'reprises');
const n = Number.parseInt(process.argv[2], 10);

const disponibles = existsSync(dossierPaquets)
  ? readdirSync(dossierPaquets)
      .map((f) => /^fin-atelier-(\d\d)\.paquet$/.exec(f))
      .filter(Boolean)
      .map((m) => Number(m[1]))
      .sort((a, b) => a - b)
  : [];

if (!Number.isInteger(n) || !disponibles.includes(n)) {
  console.error(`Usage : npm run reprise -- N   (N parmi : ${disponibles.join(', ')})`);
  console.error('Exemple : npm run reprise -- 5   → état de fin de l’Atelier 5, pour démarrer l’Atelier 6.');
  process.exit(1);
}

const horodatage = new Date().toISOString().replace(/[:.]/g, '-');
const sauvegarde = join(racine, '.reprises-sauvegardes', `avant-reprise-${n}-${horodatage}`);
let remplaces = 0;
let ecrits = 0;

for (const atelier of disponibles.filter((a) => a <= n)) {
  const nomPaquet = `fin-atelier-${String(atelier).padStart(2, '0')}.paquet`;
  const brut = readFileSync(join(dossierPaquets, nomPaquet), 'utf8').trim();
  const paquet = JSON.parse(gunzipSync(Buffer.from(brut, 'base64')).toString('utf8'));
  for (const [chemin, contenu] of Object.entries(paquet.fichiers)) {
    const cible = join(racine, ...chemin.split('/'));
    if (existsSync(cible)) {
      const actuel = readFileSync(cible, 'utf8');
      if (actuel === contenu) continue;
      const copie = join(sauvegarde, ...chemin.split('/'));
      mkdirSync(dirname(copie), { recursive: true });
      copyFileSync(cible, copie);
      remplaces++;
    }
    mkdirSync(dirname(cible), { recursive: true });
    writeFileSync(cible, contenu);
    ecrits++;
    console.log(`  ✔ ${chemin}  (fin de l’Atelier ${atelier})`);
  }
}

console.log(`\nReprise ${n} appliquée : ${ecrits} fichier(s) écrit(s).`);
if (remplaces > 0) console.log(`Vos ${remplaces} fichier(s) remplacé(s) sont sauvegardés dans ${sauvegarde}`);
console.log(`Vérifiez : npm run test:atelier${n}   puis notez dans JOURNAL.md ce qui a coincé.`);
