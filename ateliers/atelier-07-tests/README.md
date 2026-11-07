# Atelier 7 · Des tests générés par une skill, et une définition de fini

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 7 · Tests unitaires et définition de fini | 45 min | Jour 2 · début d'après-midi | `.github/skills/tests-node/SKILL.md`, `src/journal.js` (fourni, à ne pas modifier), `test/journal.test.js` |

## Objectif

Générer une vraie suite de tests pour le **journal d'audit chaîné** de Parafo, à l'aide d'une skill, puis
prouver qu'elle protège le code : couverture relue, **test de mutation** à 7/7, garde verte.
La skill porte une **définition de fini** que l'agent doit appliquer avant de dire « terminé ».

## Point de départ

Atelier 6 vert (sinon `npm run reprise -- 6`). `src/journal.js` est fourni et juste : on ne le modifie pas.
`npm run test:atelier7` : rouge (pas de skill, pas de tests).

## Étapes

1. **Lire le code à tester (5 min)**. `src/journal.js` : chaque entrée porte l'empreinte de la précédente.
   Mode Ask : « Quels comportements de ce module faut-il tester ? Liste-les, sans écrire de code. »
2. **La skill tests-node (10 min)**. Créez `.github/skills/tests-node/SKILL.md` : `name: tests-node`, une
   description avec le mot « test », puis les règles : `node:test`, Arrange / Act / Assert, horloge injectée,
   un test par code d'erreur, immuabilité. Ajoutez une section **`## Définition de fini`** :
   tests du module verts, `npm run mutation` sans survivant, `npm run garde` vert, couverture relue,
   résumé des commandes lancées.
3. **Générer (10 min)**. Nouvelle session, mode **Agent** : « Écris `test/journal.test.js` pour `src/journal.js`
   avec la skill tests-node, puis applique sa définition de fini. » Vérifiez que la skill est chargée
   (réponse ou journaux).
4. **Mesurer (10 min)**. `npm run couverture` : relisez les lignes non couvertes de `src/journal.js`.
   `npm run mutation` : chaque mutant **survivant** donne une piste ; demandez à l'agent le test manquant,
   **un mutant à la fois**. Notez le score au premier essai dans `JOURNAL.md`.
5. **Fini, vraiment (5 min)**. `npm run test:atelier7` vert, `npm run garde` vert. Commit `test : journal d'audit`.

⏱ **Points d'étape** à 15 et à 30 minutes.

## Livrable

- `npm run test:atelier7` : skill conforme et **score de mutation 7/7**.
- `npm run garde` : vert (ni `src/journal.js` ni les tests d'acceptation modifiés).
- Le score de mutation au premier essai, puis final, dans `JOURNAL.md`.

## Mode économe

Un mutant survivant = une demande courte et précise (« ajoute un test qui falsifie la DERNIÈRE entrée »),
pas « améliore les tests ». Les tests tournent en local et ne coûtent rien.

## Pièges à observer

- Tests « tautologiques » : ils recalculent l'empreinte avec le même code que le module, donc passent toujours.
- `new Date()` dans les tests au lieu d'une horloge injectée : le mutant « horloge » survit.
- L'agent modifie `src/journal.js` « pour le rendre testable » : refusez, `npm run garde` le détecte.
- 100 % de couverture et des mutants survivants : la couverture dit ce qui est **exécuté**, pas ce qui est **vérifié**.

## Bonus

Faites appliquer la même skill à `src/circuit.js` : quels comportements les tests d'acceptation de l'Atelier 5
ne couvraient-ils pas ?

## Coincé ?

« Vos tests échouent déjà sur le code d'origine » : un test attend un comportement faux ; lisez son message.
Atelier suivant sans avoir fini : `npm run reprise -- 7`.
