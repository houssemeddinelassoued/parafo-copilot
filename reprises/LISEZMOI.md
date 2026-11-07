# Points de reprise

À utiliser **seulement** si vous êtes bloqué et que l'atelier suivant commence :

```
npm run reprise -- 5
```

place votre copie dans l'état « fin de l'Atelier 5 » (paquets 3, 4 puis 5). Vos fichiers remplacés
sont d'abord sauvegardés dans `.reprises-sauvegardes/`. Relancez ensuite les tests de l'atelier et
notez dans `JOURNAL.md` ce qui a coincé.

| Commande | Écrit | Pour démarrer |
|---|---|---|
| `npm run reprise -- 3` | `src/document.js` | l'Atelier 4 |
| `npm run reprise -- 4` | + `src/format.js`, `.github/copilot-instructions.md`, `.github/instructions/` | l'Atelier 5 |
| `npm run reprise -- 5` | + `src/circuit.js`, `.vscode/settings.json` | l'Atelier 6 |
| `npm run reprise -- 6` | + `src/relances.js`, `src/legacy/relances-2019.js`, l'agent Refactoreur, la skill `refactoring-sur` | l'Atelier 7 |
| `npm run reprise -- 7` | + `test/journal.test.js`, la skill `tests-node` | l'Atelier 8 |
| `npm run reprise -- 8` | + `src/export.js`, `src/api.js`, `.vscode/mcp.json`, `plugins/parafo-qualite/` | l'Atelier 9 |

Les paquets sont compressés exprès : ni vous ni l'agent ne devez y « trouver la réponse » pendant
l'atelier. La formation, c'est le chemin, pas le fichier.
