// Atelier 8 · Serveur MCP, configuration et plugin parafo-qualite (fourni, ne pas modifier)

import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { chemin, existe, lire, lireFrontmatter, lireJsonc } from './aides/lecture.js';

/** Lance un serveur MCP stdio et renvoie une fonction requete(method, params). */
function demarrer(fichier, env = {}) {
  const proc = spawn(process.execPath, [fichier], { stdio: ['pipe', 'pipe', 'ignore'], env: { ...process.env, ...env } });
  const attentes = new Map();
  createInterface({ input: proc.stdout }).on('line', (l) => {
    const m = JSON.parse(l);
    attentes.get(m.id)?.(m);
    attentes.delete(m.id);
  });
  let id = 0;
  const requete = (method, params) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      const minuteur = setTimeout(() => reject(new Error(`pas de réponse à ${method}`)), 5000);
      attentes.set(n, (m) => {
        clearTimeout(minuteur);
        resolve(m);
      });
      proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n');
    });
  return { requete, arreter: () => proc.kill() };
}

describe('mcp/annuaire.mjs (fourni)', () => {
  const serveur = demarrer(chemin('mcp/annuaire.mjs'));
  after(() => serveur.arreter());

  it('répond à initialize avec ses capacités', async () => {
    const r = await serveur.requete('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'test', version: '1' } });
    assert.equal(r.result.serverInfo.name, 'annuaire-parafo');
    assert.ok(r.result.capabilities.tools);
  });

  it('expose rechercher_signataire', async () => {
    const r = await serveur.requete('tools/list');
    assert.ok(r.result.tools.some((t) => t.name === 'rechercher_signataire'));
  });

  it('trouve les juristes sans tenir compte des accents ni de la casse', async () => {
    const r = await serveur.requete('tools/call', { name: 'rechercher_signataire', arguments: { requete: 'JURIDIQUE' } });
    const { personnes } = JSON.parse(r.result.content[0].text);
    assert.deepEqual(personnes.map((p) => p.nom).sort(), ['Garnier', 'Leclerc']);
  });
});

describe('.vscode/mcp.json', () => {
  it('existe', () => assert.ok(existe('.vscode/mcp.json'), 'créez .vscode/mcp.json'));

  it('déclare un serveur stdio qui lance node mcp/annuaire.mjs', () => {
    const conf = lireJsonc(lire('.vscode/mcp.json'));
    const serveurs = Object.values(conf.servers ?? {});
    const annuaire = serveurs.find((s) => (s.args ?? []).some((a) => /mcp\/annuaire\.mjs$/.test(String(a).replace(/\\/g, '/'))));
    assert.ok(annuaire, 'un serveur dont args contient mcp/annuaire.mjs');
    assert.equal(annuaire.type, 'stdio');
    assert.equal(annuaire.command, 'node');
  });
});

const PLUGIN = 'plugins/parafo-qualite';

describe(`${PLUGIN} (Agent Plugins 1.0)`, () => {
  it('plugin.json déclare le schéma Agent Plugins 1.0 et un nom', () => {
    assert.ok(existe(`${PLUGIN}/plugin.json`), `créez ${PLUGIN}/plugin.json`);
    const manifeste = JSON.parse(lire(`${PLUGIN}/plugin.json`));
    assert.equal(manifeste.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
    assert.equal(manifeste.name, 'parafo-qualite');
    assert.match(String(manifeste.version ?? ''), /^\d+\.\d+\.\d+$/, 'version au format x.y.z');
  });

  it('contient les deux skills, chacune dans un dossier à son nom', () => {
    for (const nom of ['refactoring-sur', 'tests-node']) {
      const fichier = `${PLUGIN}/skills/${nom}/SKILL.md`;
      assert.ok(existe(fichier), `copiez ${fichier}`);
      assert.equal(lireFrontmatter(lire(fichier)).entete?.name, nom);
    }
  });

  it('contient l’agent Refactoreur dans com.github.copilot/agents/', () => {
    assert.ok(existe(`${PLUGIN}/com.github.copilot/agents/refactoreur.agent.md`));
  });

  it('mcp.json portable : $schema, mcpServers, chemins via ${PLUGIN_ROOT}', () => {
    const conf = JSON.parse(lire(`${PLUGIN}/mcp.json`));
    assert.equal(conf.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
    const [serveur] = Object.values(conf.mcpServers ?? {});
    assert.ok(serveur, 'déclarez un serveur dans mcpServers');
    assert.equal(serveur.type, 'stdio');
    assert.equal(serveur.command, 'node');
    assert.ok((serveur.args ?? []).some((a) => a.startsWith('${PLUGIN_ROOT}/')), 'le script du serveur est référencé par ${PLUGIN_ROOT}/…');
  });

  it('le serveur embarqué dans le plugin démarre et lit son propre annuaire', async () => {
    const conf = JSON.parse(lire(`${PLUGIN}/mcp.json`));
    const [s] = Object.values(conf.mcpServers);
    const racinePlugin = chemin(PLUGIN);
    const remplacer = (v) => String(v).replaceAll('${PLUGIN_ROOT}', racinePlugin);
    const script = remplacer(s.args.find((a) => a.startsWith('${PLUGIN_ROOT}/')));
    const env = Object.fromEntries(Object.entries(s.env ?? {}).map(([k, v]) => [k, remplacer(v)]));
    const serveur = demarrer(script, env);
    try {
      const r = await serveur.requete('tools/call', { name: 'rechercher_signataire', arguments: { requete: 'moreau' } });
      assert.equal(JSON.parse(r.result.content[0].text).nombre, 1);
    } finally {
      serveur.arreter();
    }
  });
});
