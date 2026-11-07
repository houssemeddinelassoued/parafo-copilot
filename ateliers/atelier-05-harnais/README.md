# Atelier 5 · Régler le harnais, puis livrer le circuit de signature

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 5 · Le harnais : boucle, outils, permissions | 35 min | Jour 2 · matin | `.vscode/settings.json`, `src/circuit.js`, `test/acceptance/a5-*.test.js` |

## Objectif

Décider **ce que l'agent a le droit de faire** avant de lui confier une tâche : outils disponibles,
commandes approuvées d'office, permissions de la session. Puis lui faire livrer `src/circuit.js`
et **observer** sa boucle dans les journaux : appels d'outils, tokens, durée.

## Point de départ

Ateliers 3 et 4 verts (sinon `npm run reprise -- 4`). `npm run test:atelier5` : 35 tests, la plupart rouges.

## Étapes

1. **Permissions de la session (3 min)**. Dans la zone de saisie du Chat, ouvrez la liste des permissions :
   restez en **Manual permissions** (approbation manuelle). Repérez les autres niveaux sans les choisir.
2. **Outils (5 min)**. **Chat: Open Customizations** › onglet **Tools** : pour cet atelier, gardez lecture,
   recherche, édition et terminal ; désactivez le web et les outils dont la tâche n'a pas besoin.
   Notez combien d'outils restent actifs.
3. **Auto-approbation du terminal (7 min)**. Dans `.vscode/settings.json`, ajoutez
   `chat.tools.terminal.autoApprove` : **seuls** `npm test` et `npm run test:atelierN` passent sans demander ;
   `git push`, les suppressions et `npm install` doivent **toujours** demander. Une règle `false` l'emporte
   sur une règle `true` ; une clé entre `/…/` est une expression régulière.
   Vérifiez : `npm run test:atelier5` doit passer les tests `a5-harnais`.
4. **Bac à sable (facultatif)**. Si votre système le permet (macOS 15+, Linux ou WSL2, Windows 11 récent en
   expérimental), essayez `"chat.agent.sandbox.enabled": "on"` dans vos réglages **utilisateur**. Sinon,
   laissez-le : une commande qui ne peut pas être isolée ne se lance pas du tout.
5. **Livrer le circuit (12 min)**. Nouvelle session, mode **Agent**, modèle **Auto** :

   > Implémente `src/circuit.js` selon son en-tête. Lance `npm run test:atelier5` après chaque modification
   > et itère jusqu'au vert. Ne modifie ni `test/` ni `.vscode/`.

   Comptez les approbations demandées : `npm run test:atelier5` ne doit plus en demander.
6. **Observer (5 min)**. Menu `…` de la vue Chat › **Show Agent Debug Logs** (ou **Developer: Open Agent Debug Logs**) :
   combien d'appels d'outils ? de tours de boucle ? quelle durée ? Survolez le sélecteur de modèle : coût.
   Notez-le dans `JOURNAL.md`.

⏱ **Points d'étape** à 15 et à 25 minutes.

## Livrable

- `npm run test:atelier5` : **35 tests au vert** (circuit + règles du harnais).
- Dans `JOURNAL.md` : nombre d'outils actifs, d'appels d'outils, d'approbations demandées.
- Commit : `feat : circuit de signature`.

## Mode économe

Moins d'outils actifs = moins de tokens envoyés à chaque tour, et des choix d'outils plus sûrs.
Une auto-approbation bien bornée évite des clics, pas des risques : elle ne remplace pas la relecture.

## Pièges à observer

- `"npm": true` approuve aussi `npm install paquet-malveillant` : le test `a5-harnais` le refuse.
- « Allow all » ou l'approbation globale : l'agent peut tout lancer sans vous. Jamais sur un vrai dépôt.
- En séquentiel, `signer` accepte n'importe quel signataire : relisez l'ordre des contrôles dans l'en-tête.
- Le circuit d'origine est modifié (`etape.decision = …`) au lieu d'une copie : test d'immuabilité rouge.

## Bonus

Demandez à l'agent d'ajouter `relancer(circuit, maintenant)` (liste des e-mails à relancer) **avec** son test,
et observez s'il respecte vos règles : approbation demandée pour toute autre commande que les tests.

## Coincé ?

Les tests `a5-harnais` restent rouges : lisez leur message, il dit quelle commande est mal réglée.
Atelier suivant sans avoir fini : `npm run reprise -- 5` (vos réglages sont sauvegardés avant d'être remplacés).
