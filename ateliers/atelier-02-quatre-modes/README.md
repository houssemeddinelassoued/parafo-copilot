# Atelier 2 · Réglages, et un même besoin en quatre modes

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 2 · Installer, configurer, choisir son mode et son modèle | 30 min | Jour 1 · avant le déjeuner | `.vscode/settings.json`, `katas/02-quatre-modes/*.js`, `JOURNAL.md` |

## Objectif

Créer les réglages du projet, puis écrire **la même petite fonction** quatre fois : suggestions inline,
Ask, Plan, Agent. Mesurer ce que chaque mode coûte et rapporte, pour choisir le bon mode demain.

## Point de départ

Atelier 1 terminé (ou non : cet atelier est indépendant). `npm run test:atelier2` : 44 tests rouges.

## Étapes

1. **Réglages du projet (5 min)**. Créez `.vscode/settings.json` :

   ```jsonc
   {
     "editor.inlineSuggest.enabled": true,
     "github.copilot.nextEditSuggestions.enabled": true,
     "files.eol": "\n"
   }
   ```

   Ouvrez les réglages (`Ctrl+,`), cherchez `copilot` : repérez où l'on désactive Copilot pour un langage.
2. **Inline (5 min)**. `katas/02-quatre-modes/inline.js` : effacez le corps et laissez les suggestions
   l'écrire, sans chat. `Alt+]` pour voir une autre proposition.
3. **Ask (5 min)**. `ask.js` : mode Ask, collez le besoin (en tête de `inline.js`), copiez la réponse.
4. **Plan (5 min)**. `plan.js` : mode Plan. Relisez le plan **avant** de le lancer : un cas oublié ? Corrigez-le.
5. **Agent (5 min)**. `agent.js` : mode Agent, demandez-lui de faire passer `npm run test:atelier2` pour la
   version « agent ». Observez chaque demande d'approbation.
6. **Mesurer (5 min)**. `npm run test:atelier2`, puis remplissez le tableau de l'Atelier 2 dans `JOURNAL.md` :
   temps, tests verts sur 11 par mode, crédits.

⏱ **Points d'étape** à 10 et à 20 minutes.

## Livrable

- `.vscode/settings.json` créé.
- Les quatre versions écrites, **au moins deux** au vert sur leurs 11 tests.
- Le tableau rempli dans `JOURNAL.md`, avec le mode que vous choisiriez pour ce type de besoin.

## Mode économe

Inline ne consomme pas de crédit IA ; Ask, Plan et Agent en consomment. Restez sur **Auto**.
Si vos crédits sont comptés, faites Plan et Agent en dernier et arrêtez-vous dès que c'est vert.

## Pièges à observer

- Ask donne souvent une regex « parfaite » qui accepte `alice@exemple` : lancez les tests, ne croyez pas la réponse.
- En mode Agent, une approbation « Toujours autoriser » donnée trop vite vaut pour toute la session.
- Plan peut proposer de modifier `inline.js` aussi : un plan se relit, il n'est pas un ordre.

## Bonus

Refaites la version Ask avec un autre modèle du sélecteur : comparez le résultat et le coût affiché au survol.

## Coincé ?

Un mode n'apparaît pas : votre organisation l'a peut-être désactivé. Notez-le et passez au suivant.
