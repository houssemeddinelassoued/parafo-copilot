// Vérification du poste : npm run verifier-poste
//
// À lancer UNE SEMAINE AVANT la formation (fiche d'accueil), puis le matin du jour 1.
// Ne modifie rien sur votre poste. Copiez le résumé final dans votre réponse au formateur.

import { spawn, spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const resultats = [];

const ok = (sujet, detail = '') => resultats.push({ niveau: 'ok', sujet, detail });
const alerte = (sujet, detail) => resultats.push({ niveau: 'alerte', sujet, detail });
const echec = (sujet, detail) => resultats.push({ niveau: 'echec', sujet, detail });

function commande(ligne) {
  // shell nécessaire sous Windows pour les .cmd (npm, code) ; ligne fixe, sans donnée externe
  const r = spawnSync(ligne, { encoding: 'utf8', shell: true, timeout: 20_000 });
  return r.status === 0 ? (r.stdout || '').trim() : null;
}

// 1. Node.js
const majeure = Number(process.versions.node.split('.')[0]);
if (majeure >= 22) ok('Node.js', `v${process.versions.node}`);
else echec('Node.js', `v${process.versions.node} : installez Node.js 22 LTS ou plus récent (https://nodejs.org)`);

// 2. npm et Git
const npm = commande('npm --version');
npm ? ok('npm', npm) : echec('npm', 'introuvable : il est installé avec Node.js');
const git = commande('git --version');
git ? ok('Git', git.replace('git version ', '')) : echec('Git', 'introuvable : installez Git (https://git-scm.com)');

// 3. Dépôt Git (nécessaire pour les sessions parallèles et les worktrees du jour 2)
if (existsSync(join(racine, '.git'))) ok('Dépôt Git', 'votre copie est un dépôt Git');
else alerte('Dépôt Git', 'pas de dossier .git : lancez  git init  puis  git add -A  et  git commit -m "Départ"');

// 4. Dossier de travail
try {
  accessSync(racine, constants.W_OK);
  ok('Dossier', racine);
} catch {
  echec('Dossier', `pas de droit d'écriture sur ${racine}`);
}
if (/onedrive|dropbox|google drive/i.test(racine)) {
  alerte('Dossier synchronisé', 'évitez OneDrive/Dropbox : la synchronisation gêne Git et les agents. Préférez par exemple C:\\formation\\parafo-copilot');
}

// 5. VS Code (GitHub Copilot y est intégré : rien à installer, il suffit de se connecter)
const code = commande('code --version');
if (code) {
  ok('VS Code', `${code.split(/\r?\n/)[0]} (vérifiez dans Aide › Rechercher les mises à jour qu’il est à jour)`);
} else {
  alerte('VS Code', 'commande « code » absente du PATH : vérifiez à la main que VS Code est à jour (Aide › À propos)');
}

// 6. Réseau : GitHub et le service Copilot (toute réponse HTTP prouve que la route est ouverte)
async function joindre(url) {
  try {
    const r = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(8000) });
    return { joignable: true, statut: r.status };
  } catch (e) {
    return { joignable: false, raison: e.cause?.code || e.name };
  }
}
for (const [nom, url] of [
  ['github.com', 'https://github.com'],
  ['api.github.com', 'https://api.github.com'],
  ['Service Copilot (*.githubcopilot.com)', 'https://api.githubcopilot.com'],
]) {
  const r = await joindre(url);
  if (r.joignable) ok(`Réseau : ${nom}`, `joignable (HTTP ${r.statut})`);
  else echec(`Réseau : ${nom}`, `injoignable (${r.raison}) : proxy ou pare-feu ? Transmettez la fiche d'accueil à votre service informatique`);
}

// 7. Port 3000 (serveur de démonstration de l'Atelier 8)
const portLibre = await new Promise((resolve) => {
  const s = createServer();
  s.once('error', () => resolve(false));
  s.listen(3000, '127.0.0.1', () => s.close(() => resolve(true)));
});
portLibre ? ok('Port 3000', 'libre') : alerte('Port 3000', 'occupé : le serveur pourra utiliser un autre port (PORT=3001)');

// 8. Serveur MCP local (Atelier 8) : poignée de main initialize
const mcp = await new Promise((resolve) => {
  const p = spawn(process.execPath, [join(racine, 'mcp', 'annuaire.mjs')], { stdio: ['pipe', 'pipe', 'ignore'] });
  const minuteur = setTimeout(() => {
    p.kill();
    resolve(false);
  }, 8000);
  p.stdout.once('data', (d) => {
    clearTimeout(minuteur);
    p.kill();
    resolve(/"serverInfo"/.test(String(d)));
  });
  p.on('error', () => resolve(false));
  p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'verifier-poste', version: '1' } } }) + '\n');
});
mcp ? ok('Serveur MCP local', 'démarre et répond') : echec('Serveur MCP local', 'ne répond pas : un antivirus bloque-t-il node ?');

// Résumé
const symbole = { ok: '✔', alerte: '!', echec: '✖' };
console.log('\nParafo · vérification du poste\n');
for (const r of resultats) console.log(`  ${symbole[r.niveau]} ${r.sujet}${r.detail ? ` : ${r.detail}` : ''}`);
const echecs = resultats.filter((r) => r.niveau === 'echec').length;
const alertes = resultats.filter((r) => r.niveau === 'alerte').length;

console.log('\nÀ vérifier à la main (2 minutes) :');
console.log('  1. VS Code : l’icône Copilot de la barre d’état indique que vous êtes connecté à GitHub.');
console.log('  2. Vue Chat : le sélecteur de session propose la cible « Copilot » (harnais Copilot).');
console.log('  3. Demandez dans le Chat : « Explique ce dépôt en 3 phrases. » Une réponse arrive.');
console.log('  4. Facultatif : l’Agents window (« Open in Agents ») et l’app GitHub Copilot s’ouvrent.');

console.log(`\nRésultat : ${echecs === 0 ? 'poste prêt' : 'à corriger avant la formation'} (${echecs} échec(s), ${alertes} alerte(s)).`);
console.log(`Node ${process.versions.node} · ${process.platform} · ${new Date().toISOString().slice(0, 10)}`);
process.exitCode = echecs === 0 ? 0 : 1;
