// Test de mutation du journal : npm run mutation   (Atelier 7)
//
// On introduit, un par un, de petits bugs (« mutants ») dans src/journal.js,
// puis on lance VOS tests (test/journal.test.js) sur chaque version modifiée.
// Un bon test échoue quand le code est faux : le mutant est « détecté ».
// Un mutant qui « survit » montre un comportement que vos tests ne vérifient pas.
//
// Le vrai src/journal.js n'est jamais modifié : tout se passe dans un dossier temporaire.

import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const fichierTests = join(racine, 'test', 'journal.test.js');

const MUTANTS = [
  {
    nom: 'la première entrée ne part plus de la genèse (64 zéros)',
    piste: 'vérifiez la valeur de `precedente` sur la toute première entrée',
    cherche: "export const GENESE = '0'.repeat(64);",
    remplace: "export const GENESE = '';",
  },
  {
    nom: "l'horodatage ignore l'horloge injectée",
    piste: 'injectez une horloge fixe et vérifiez `horodatage`',
    cherche: 'horodatage: horloge().toISOString(),',
    remplace: 'horodatage: new Date().toISOString(),',
  },
  {
    nom: 'lister() expose le tableau interne',
    piste: 'modifiez le tableau renvoyé par lister() : le journal ne doit pas changer',
    cherche: 'lister: () => entrees.slice(),',
    remplace: 'lister: () => entrees,',
  },
  {
    nom: 'verifierChaine() ne contrôle plus la dernière entrée',
    piste: 'falsifiez la DERNIÈRE entrée et attendez indexCorrompu',
    cherche: 'for (let i = 0; i < entrees.length; i++) {',
    remplace: 'for (let i = 0; i < entrees.length - 1; i++) {',
  },
  {
    nom: 'verifierChaine() ne contrôle plus le chaînage',
    piste: "remplacez une entrée par une autre dont l'empreinte est recalculée : le lien avec la suivante casse",
    cherche: 'if (entree.precedente !== attendue) return { valide: false, indexCorrompu: i };',
    remplace: 'if (false) return { valide: false, indexCorrompu: i };',
  },
  {
    nom: 'les types inconnus sont acceptés',
    piste: "ajoutez un événement de type inconnu et attendez l'erreur TYPE_INCONNU",
    cherche: 'if (!TYPES.includes(type)) {',
    remplace: 'if (false) {',
  },
  {
    nom: 'parDocument() renvoie les autres documents',
    piste: 'journalisez deux documents différents et filtrez-en un',
    cherche: 'entrees.filter((e) => e.documentId === documentId)',
    remplace: 'entrees.filter((e) => e.documentId !== documentId)',
  },
];

if (!existsSync(fichierTests)) {
  console.error('✖ test/journal.test.js est introuvable : c’est le fichier que vous écrivez à l’Atelier 7.');
  process.exit(1);
}

const original = readFileSync(join(racine, 'src', 'journal.js'), 'utf8').replace(/\r\n/g, '\n');
const absents = MUTANTS.filter((m) => !original.includes(m.cherche));
if (absents.length > 0) {
  console.error('✖ src/journal.js a été modifié : il doit rester tel que fourni (npm run garde).');
  process.exit(1);
}

const temporaire = mkdtempSync(join(tmpdir(), 'parafo-mutation-'));
cpSync(join(racine, 'src'), join(temporaire, 'src'), { recursive: true });
cpSync(join(racine, 'test'), join(temporaire, 'test'), { recursive: true });
const cibleJournal = join(temporaire, 'src', 'journal.js');
const testsTemporaires = join(temporaire, 'test', 'journal.test.js');

function lancerTests() {
  const r = spawnSync(process.execPath, ['--test', testsTemporaires], { cwd: temporaire, encoding: 'utf8', timeout: 60_000 });
  return r.status === 0;
}

try {
  writeFileSync(cibleJournal, original);
  if (!lancerTests()) {
    console.error('✖ Vos tests échouent déjà sur le code d’origine : corrigez-les d’abord (node --test test/journal.test.js).');
    process.exitCode = 1;
  } else {
    executerMutants();
  }
} finally {
  rmSync(temporaire, { recursive: true, force: true });
}

function executerMutants() {
  let detectes = 0;
  console.log('Test de mutation de src/journal.js\n');
  for (const [i, m] of MUTANTS.entries()) {
    writeFileSync(cibleJournal, original.replace(m.cherche, m.remplace));
    const detecte = !lancerTests();
    if (detecte) detectes++;
    console.log(`  ${detecte ? '✔ détecté ' : '✖ SURVIT  '} mutant ${i + 1} : ${m.nom}${detecte ? '' : `\n               piste : ${m.piste}`}`);
  }
  console.log(`\nScore de mutation : ${detectes}/${MUTANTS.length}`);
  if (detectes < MUTANTS.length) {
    console.log('Ajoutez un test par mutant survivant, puis relancez npm run mutation.');
    process.exitCode = 1;
  } else {
    console.log('Tous les mutants sont détectés : vos tests protègent vraiment le journal.');
  }
}
