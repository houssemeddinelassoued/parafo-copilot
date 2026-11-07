# Atelier 3 · Du brief au code : `document.js` en mode Plan puis Agent

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 3 · Prompting et contexte | 35 min | Jour 1 · après-midi | `ateliers/atelier-03-document/BRIEF.md`, `src/document.js`, `test/acceptance/a3-document.test.js` |

## Objectif

Transformer un brief métier en code testé : d'abord un **plan** relu et corrigé (la spécification),
puis une mise en œuvre par l'**agent**, guidée par les tests d'acceptation. Le tout documenté en JSDoc française.

## Point de départ

`npm run test:atelier3` : 39 tests rouges (`src/document.js` ne contient que des signatures).

## Étapes

1. **Lire le brief (3 min)** : `BRIEF.md`. Repérez vous-même deux règles faciles à oublier.
2. **Plan (10 min)**. Nouvelle session, mode **Plan**. Prompt construit avec l'anatomie vue en module 3 :

   > **Objectif** : écrire `src/document.js` selon `#BRIEF.md`.
   > **Contexte** : `#erreurs.js`, les tests `#a3-document.test.js`, Node 22, aucune dépendance.
   > **Contraintes** : fonctions pures, `ErreurParafo` avec les codes du brief, JSDoc en français.
   > **Critère d'acceptation** : `npm run test:atelier3` entièrement vert, tests non modifiés.
   > **Format** : un plan numéroté, puis la liste des cas limites que tu as identifiés.

   Relisez le plan : les deux règles de l'étape 1 y sont-elles ? Corrigez-le dans le Chat si besoin.
3. **Agent (12 min)**. Lancez la mise en œuvre depuis le plan (mode **Agent**). Approuvez `npm run test:atelier3`
   quand il le demande ; **refusez** toute modification de `test/acceptance/`.
4. **Relire (5 min)**. Lisez le diff fichier par fichier **avant** de le garder. Une fonction que vous ne
   comprenez pas ? Sélectionnez-la et demandez une explication en mode Ask.
5. **Commit (5 min)** : `npm run garde`, puis `git add -A` et `git commit -m "feat : document à signer"`.

⏱ **Points d'étape** à 15 et à 25 minutes.

## Livrable

- `npm run test:atelier3` : **39 tests au vert**.
- `npm run garde` : vert (aucun test modifié).
- Chaque fonction exportée a une JSDoc en français avec ses codes d'erreur (`@throws`).

## Mode économe

Un plan bien relu évite trois allers-retours avec l'agent. Une seule session pour tout l'atelier,
et pas de `#codebase` : les fichiers cités suffisent.

## Pièges à observer

- La taille est comptée en **caractères** (`contenu.length`) au lieu des **octets** : le test « été » échoue.
- `changerEtat` modifie le document reçu (`document.etat = …`) : le test d'immuabilité échoue.
- L'agent « simplifie » un test qui échoue au lieu de corriger le code : refusez, et `npm run garde` le verrait.
- La borne de 10 Mo : `>=` au lieu de `>` refuse un document de 10 Mo pile.

## Bonus

Demandez en mode Ask : « Quels cas du brief les tests d'acceptation ne vérifient pas ? » Notez la réponse :
vous la réutiliserez à l'Atelier 7.

## Coincé ?

L'agent tourne en rond : arrêtez-le, ouvrez une nouvelle session et donnez-lui **un seul test rouge** à faire
passer. Atelier suivant sans avoir fini : `npm run reprise -- 3`.
