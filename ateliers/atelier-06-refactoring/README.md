# Atelier 6 · Un agent Refactoreur et sa skill pour le code de 2019

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 6 · Agents personnalisés et Skills : premier refactoring | 50 min | Jour 2 · fin de matinée | `.github/agents/refactoreur.agent.md`, `.github/skills/refactoring-sur/SKILL.md`, `src/legacy/relances-2019.js`, `src/relances.js` |

## Objectif

Créer un **agent personnalisé** et une **skill** qui encadrent un refactoring, puis s'en servir :
rendre lisible `calc(d, n, f, t)`, un code de 2019, **sans changer son comportement**, puis écrire sa
version moderne, **corrigée** du bug d'expiration.

## Point de départ

Atelier 5 vert (sinon `npm run reprise -- 5`). `npm run test:atelier6` : les 10 tests de caractérisation
passent, les tests de contrat et de personnalisation échouent.

## Étapes

1. **Comprendre (5 min)**. Sélectionnez `calc` dans `src/legacy/relances-2019.js`, mode **Ask** :
   « Explique cette fonction règle par règle et liste ses défauts. » Comparez avec les tests marqués ⚠
   dans `test/acceptance/a6-relances-caracterisation.test.js`.
2. **La skill (10 min)**. Créez `.github/skills/refactoring-sur/SKILL.md` (le dossier porte le nom de la skill) :

   ```markdown
   ---
   name: refactoring-sur
   description: <ce qu'elle fait ET quand l'utiliser, avec le mot « refactoring »>
   ---
   ```

   Corps : tests de caractérisation d'abord, un geste à la fois (renommer, extraire, `const`), tests après
   chaque geste, aucune correction de bug pendant un refactoring, commit `refactor : …`.
3. **L'agent (10 min)**. **Chat: Open Customizations** › Agents › `+` à côté de **Workspace**, nom `refactoreur`,
   ou créez `.github/agents/refactoreur.agent.md`. En-tête : `description`, `tools` limités
   (`['read', 'search', 'edit', 'execute']`), `skills: ['refactoring-sur']`. Corps : 5 à 8 consignes, dont
   « lance les tests avant et après chaque geste » et « ne modifie jamais `test/acceptance/` ».
   Pas de `handoffs` ni d'`agents` : ces champs ne servent qu'au harnais Local.
   `npm run test:atelier6` : les tests de personnalisation passent.
4. **Refactorer (12 min)**. Nouvelle session, choisissez l'agent **Refactoreur** dans la liste des agents :
   « Refactore `src/legacy/relances-2019.js`. » Suivez ses gestes. Les 10 tests de caractérisation restent
   **verts** à chaque étape. Relisez `git diff`, puis commit `refactor : relances 2019 lisibles`.
5. **Moderniser (10 min)**. Même agent : « Écris `src/relances.js` selon son en-tête, sous les tests de contrat. »
   Le test « lundi + 5 jours ouvrés → lundi suivant » passe : c'est **la correction**.
   Commit séparé : `fix : expiration comptée sans le jour d'envoi`.
6. **Vérifier la délégation (3 min)**. Dans la réponse ou les journaux, la skill `refactoring-sur` a-t-elle été
   chargée ? Sinon, sa description ne contient pas les mots de la demande.

⏱ **Points d'étape** à 15, 30 et 40 minutes.

## Livrable

- `npm run test:atelier6` : **46 tests au vert** (10 de caractérisation, 27 de contrat, 9 de personnalisation).
- `relances-2019.js` lisible, sans `var`, avec des fonctions nommées, **même comportement**.
- Deux commits distincts : le refactoring, puis la correction.

## Mode économe

Un agent spécialisé avec peu d'outils et une skill chargée seulement quand elle sert : moins de contexte,
moins de crédits. Une session par sujet : refactoring, puis modernisation.

## Pièges à observer

- L'agent « améliore » en remplaçant `delai` texte par un nombre, ou en arrêtant le tri des fériés : un test ⚠
  passe au rouge. Refactorer = même comportement, défauts compris.
- Skill jamais chargée : `name` différent du nom du dossier, ou description trop vague.
- Champ `handoffs` recopié d'un ancien tutoriel : ignoré par le harnais Copilot.
- L'agent veut modifier le test ⚠ « pour qu'il soit plus logique » : refusez, `npm run garde`.

## Bonus

Faites déléguer `calc(…, 'e')` à `dateExpiration` (adaptateur), puis mettez à jour **délibérément** le test ⚠
correspondant… dans une branche, avec un message de commit qui explique la décision métier.

## Coincé ?

Un test de caractérisation rouge et vous ne voyez pas pourquoi : `git diff`, annulez le dernier geste
(`git checkout -- src/legacy/relances-2019.js`), refaites-le en plus petit.
Atelier suivant sans avoir fini : `npm run reprise -- 6`.
