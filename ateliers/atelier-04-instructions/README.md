# Atelier 4 · Les instructions du dépôt, testées en A/B

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 4 · Les fichiers Markdown qui guident Copilot | 45 min | Jour 1 · fin d'après-midi | `src/format.js`, `.github/copilot-instructions.md`, `.github/instructions/tests.instructions.md` |

## Objectif

Écrire les instructions de Parafo, puis **prouver** qu'elles changent le code produit : la même demande,
une fois sans instructions (A), une fois avec (B), mesurée par les mêmes tests.

## Point de départ

Atelier 3 vert (sinon `npm run reprise -- 3`). `npm run test:atelier4` : 35 tests rouges.
Il n'existe encore aucun fichier `.github/` : c'est voulu.

## Les règles maison de Parafo (à transformer en instructions)

1. Aucune dépendance npm ; modules intégrés de Node importés avec le préfixe `node:`.
2. Donnée invalide : `ErreurParafo` de `src/erreurs.js`, avec un code en MAJUSCULES (`NUMERO_INVALIDE`…),
   jamais `throw new Error`.
3. Messages, JSDoc et commentaires en français.
4. Fonctions pures : ne jamais modifier un paramètre reçu.
5. Types validés explicitement (`Number.isInteger`, `typeof`) : le texte `'42'` n'est pas un nombre.
6. Affichage : virgule décimale, unités o / Ko / Mo avec 1 Ko = 1024 o, guillemets français `« … »`.
7. Tests : `node:test`, `node:assert/strict`, ne jamais modifier `test/acceptance/`.

## Étapes

1. **Essai A, sans instructions (10 min)**. Nouvelle session, mode **Agent**, prompt **exact** :

   > Écris les trois fonctions de `src/format.js` d'après les commentaires du fichier. Ne lance pas de commande.

   Puis `npm run test:atelier4` : notez dans `JOURNAL.md` le nombre de tests verts du fichier `a4-format`.
   Gardez une copie : `src/format.js` → `ateliers/atelier-04-instructions/essai-A.js`.
   Remettez le fichier d'origine : `git checkout -- src/format.js`.
2. **Écrire les instructions (15 min)**. Ouvrez l'éditeur de personnalisation (**Chat: Open Customizations**),
   puis `+` à côté de **Workspace** › instructions du projet, ou créez directement `.github/copilot-instructions.md`.
   Reformulez les règles 1 à 6 en phrases courtes et impératives, avec une ligne de présentation du projet.
   **60 lignes au plus** : ce fichier est envoyé avec chaque requête.
3. **Instructions ciblées (5 min)**. Créez `.github/instructions/tests.instructions.md` avec un en-tête
   `applyTo: "test/**/*.test.js"` et la règle 7, plus vos conventions de test (noms en français, AAA).
4. **Essai B, avec instructions (10 min)**. **Nouvelle session**, même mode, **même prompt mot pour mot**.
   Dans la réponse, la section **Références** doit citer `copilot-instructions.md`. `npm run test:atelier4`,
   notez le résultat. Comparez `essai-A.js` et `src/format.js` : qu'est-ce qui a changé ?
5. **AGENTS.md (5 min)**. Lisez la page du module : le harnais Copilot accepte `.github/copilot-instructions.md`
   **ou** `AGENTS.md`, format partagé avec d'autres agents. Notez dans `JOURNAL.md` lequel vous choisiriez
   pour votre équipe, et pourquoi. N'en gardez **qu'un** dans le dépôt.

⏱ **Points d'étape** à 15 et à 30 minutes.

## Livrable

- `npm run test:atelier4` : **35 tests au vert** (format + forme des instructions).
- Le tableau A/B rempli dans `JOURNAL.md`.
- Commit : `docs : instructions Copilot du dépôt`.

## Mode économe

Les instructions coûtent des tokens à **chaque** requête : une règle inutile se paie toute la journée.
Préférez une règle courte et vérifiable à un paragraphe.

## Pièges à observer

- L'essai B dans **la même session** que l'essai A : le contexte de A pollue B. Nouvelle session obligatoire.
- Des instructions vagues (« écris du code propre ») ne changent rien aux tests : soyez précis.
- `applyTo` mal écrit (`tests/**` au lieu de `test/**`) : le fichier n'est jamais appliqué.
- Copier une instruction trouvée sur Internet qui contredit les vôtres : Copilot ne sait pas laquelle croire.

## Bonus

Python ou Java : créez `.github/instructions/python.instructions.md` (`applyTo: "**/*.py"`) ou l'équivalent
Java, puis faites écrire `katas/python/reference.py` ou `katas/java/Reference.java`.
Tests : `python -m unittest discover -s katas/python -v` ou `java katas/java/Reference.java`.

## Coincé ?

Les Références ne citent pas vos instructions : vérifiez le chemin exact (`.github/copilot-instructions.md`)
et que la session est neuve. Atelier suivant sans avoir fini : `npm run reprise -- 4`.
