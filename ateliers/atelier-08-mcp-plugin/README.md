# Atelier 8 · MCP, plugin et deux sessions en parallèle

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 8 · Étendre et paralléliser : MCP, connecteurs, plugins, sessions | 35 min | Jour 2 · milieu d'après-midi | `.vscode/mcp.json`, `mcp/annuaire.mjs` (fourni), `plugins/parafo-qualite/`, `src/export.js`, `src/api.js` |

## Objectif

Donner un **outil** de plus à l'agent (l'annuaire des signataires, par un serveur MCP local), **empaqueter**
vos personnalisations dans un plugin réutilisable, puis confier **deux tickets en parallèle** à deux sessions
et relire leurs changements avant de les intégrer.

## Point de départ

Atelier 7 vert (sinon `npm run reprise -- 7`). `npm run test:atelier8` : 40 tests, la plupart rouges
(le serveur MCP fourni, lui, répond déjà). Votre copie est un dépôt Git avec un commit propre.

## Étapes

1. **Brancher l'annuaire MCP (7 min)**. Créez `.vscode/mcp.json` :

   ```json
   {
     "servers": {
       "annuaire-parafo": {
         "type": "stdio",
         "command": "node",
         "args": ["${workspaceFolder}/mcp/annuaire.mjs"]
       }
     }
   }
   ```

   Démarrez le serveur (lien **Start** au-dessus de la ligne, ou **MCP: List Servers**), acceptez la
   **confiance** après avoir lu ce qu'il lance. Mode Agent : « Qui peut signer au service juridique ? »
   L'agent doit appeler `rechercher_signataire`. Lisez **toute** la réponse de l'outil.
2. **Ticket 1 et ticket 2 en parallèle (13 min)**. Ouvrez l'**Agents window** (**Open in Agents** dans la
   barre de titre, ou **Chat: Open Agents window**). Lancez deux sessions, chacune en **New Worktree** :
   - session 1 : « Implémente `src/export.js` selon son en-tête. Tests : `node --test test/acceptance/a8-export.test.js`. »
   - session 2 : « Ajoute la route `GET /documents/:id/statut` dans `src/api.js` selon le commentaire. Tests : `node --test test/acceptance/a8-statut.test.js`. »

   Pendant qu'elles travaillent, passez à l'étape 3. Ensuite, relisez les changements de **chaque** session
   avant de les intégrer à votre branche.
3. **Le plugin parafo-qualite (12 min)**. Créez `plugins/parafo-qualite/` :

   ```text
   plugins/parafo-qualite/
     plugin.json                       ← $schema Agent Plugins 1.0, name, version, description
     skills/refactoring-sur/SKILL.md   ← copies de vos deux skills
     skills/tests-node/SKILL.md
     mcp.json                          ← $schema MCP portable, mcpServers, "${PLUGIN_ROOT}/mcp/annuaire.mjs"
     mcp/annuaire.mjs                  ← copie du serveur
     data/annuaire.json                ← copie de l'annuaire
     com.github.copilot/agents/refactoreur.agent.md   ← l'agent : partie propre à Copilot
   ```

   Schémas : `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json` et `…/mcp.schema.json`.
   Pour l'essayer : **Chat: Install Plugin Source**, chemin du dossier, portée **User**, puis ouvrez un dossier
   vide dans une nouvelle fenêtre : skills, agent et serveur MCP y sont disponibles.
4. **Intégrer et vérifier (3 min)**. `npm run test:atelier8` vert, `npm run garde` vert,
   commit `feat : export CSV, statut, annuaire MCP et plugin`.

⏱ **Points d'étape** à 10 et à 25 minutes.

## Livrable

- `npm run test:atelier8` : **40 tests au vert** (export, statut, MCP, plugin).
- Deux sessions relues et intégrées ; dans `JOURNAL.md`, ce que vous avez vu dans la réponse de l'annuaire.

## Mode économe

Deux sessions en parallèle consomment deux fois : réservez-les à des tickets **indépendants** et courts,
avec leurs tests. Un serveur MCP n'expose que les outils utiles : chaque outil exposé occupe du contexte.

## Pièges à observer

- **Injection de prompt** : la fiche de Zoé Marchetti contient une « note pour l'assistant IA ». Une donnée
  n'est jamais un ordre. L'agent l'a-t-il signalée ? A-t-il tenté de la suivre ?
- Un chemin relatif dans `mcp.json` (`mcp/annuaire.mjs`) : le serveur démarre depuis un autre dossier et échoue.
- Une valeur commençant par `=` dans le CSV : sans apostrophe, Excel l'exécute comme une formule.
- Les deux sessions modifient le même fichier : conflit à l'intégration. Des tickets indépendants, d'abord.
- Installer un plugin ou un serveur MCP sans lire ce qu'il lance : c'est du code qui s'exécute sur votre poste.

## Si l'Agents window ou les plugins sont bloqués

Votre organisation peut les désactiver. Faites les deux tickets **l'un après l'autre** dans deux sessions du Chat,
et le plugin en local seulement (les tests vérifient sa structure). Le formateur montre l'installation.

## Bonus

Lancez `npm run serveur`, puis ouvrez http://localhost:3000/registre.csv et
http://localhost:3000/documents/DOC-3f9a1c07/statut. Reprenez une des sessions depuis l'app GitHub Copilot.

## Coincé ?

Le serveur MCP ne démarre pas : **MCP: List Servers** › annuaire-parafo › journal de sortie.
Essai à la main : `npm run mcp:annuaire` (consignes en tête de `mcp/annuaire.mjs`).
Atelier suivant sans avoir fini : `npm run reprise -- 8`.
