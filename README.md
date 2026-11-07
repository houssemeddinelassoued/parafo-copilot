# Parafo · dépôt fil rouge « GitHub Copilot · Débutant »

Formation Docaposte Institute, 2 jours, en classe virtuelle. Pendant les deux jours, vous construisez
**Parafo**, un parapheur numérique **fictif** : des documents circulent entre signataires, avec un
circuit, des relances, un journal d'audit et une petite API. Tout est en JavaScript (Node.js 22),
sans aucune dépendance, avec GitHub Copilot dans VS Code.

## Avant la formation (15 minutes, une semaine avant)

1. Installez **Node.js 22 LTS** ou plus récent, **Git**, et **VS Code** à jour. Connectez-vous à
   GitHub Copilot dans VS Code (icône Copilot de la barre d'état). Le plan **Copilot Free** suffit.
2. Récupérez votre copie du dépôt, au choix :
   - **Use this template › Create a new repository** sur https://github.com/houssemeddinelassoued/parafo-copilot
     (dans votre compte GitHub), puis `git clone` de votre nouveau dépôt ;
   - ou **Code › Download ZIP**, décompressez, puis dans le dossier :
     `git init`, `git add -A`, `git commit -m "Départ"`.

   Choisissez un dossier simple et **non synchronisé** (pas OneDrive) : par exemple `C:\formation\parafo-copilot`.
3. Dans VS Code : **Fichier › Ouvrir le dossier** › `parafo-copilot`, puis dans le terminal intégré :

   ```
   npm run verifier-poste
   ```

   Aucun `npm install` n'est nécessaire. Envoyez le résumé affiché au formateur.
4. `npm test` : beaucoup de tests échouent, **c'est normal**, vous les ferez passer au vert.

## Commandes

| Commande | Effet |
|---|---|
| `npm run test:atelier3` (2 à 9) | les tests d'acceptation d'un atelier |
| `npm test` | tous les tests du dossier `test/` |
| `npm run reprise -- 5` | place votre copie dans l'état « fin de l'Atelier 5 » (vos fichiers sont sauvegardés avant) |
| `npm run garde` | vérifie que les fichiers protégés (tests d'acceptation…) n'ont pas été modifiés |
| `npm run mutation` | test de mutation du journal (Atelier 7) |
| `npm run couverture` | tests et couverture de code |
| `npm run serveur` | l'API sur http://localhost:3000/documents |
| `npm run verifier-poste` | contrôle du poste avant la formation |

## Ce que contient le dépôt

| Dossier | Contenu |
|---|---|
| `src/` | le code de Parafo. Les fichiers à écrire contiennent leur contrat en commentaire |
| `src/legacy/` | un code de 2019 à refactorer (Atelier 6) |
| `test/acceptance/` | les tests d'acceptation fournis : **le contrat, ne pas les modifier** |
| `ateliers/` | un énoncé par atelier (`README.md`) |
| `katas/` | les petits exercices des ateliers 1, 2 et le bonus Python / Java |
| `mcp/` | un petit serveur MCP fourni : l'annuaire des signataires (Atelier 8) |
| `data/` | des documents et des personnes **fictifs** |
| `reprises/` | les points de reprise (compressés), pour `npm run reprise` |
| `scripts/` | les scripts Node de la formation (serveur, reprise, garde, mutation…) |
| `JOURNAL.md` | votre journal de bord : temps, crédits, ce qui a marché ou non |

Les fichiers de configuration de Copilot (`.github/…`, `.vscode/…`) n'existent pas encore :
**vous les écrivez** au fil des ateliers.

## Les 9 ateliers (individuels)

| # | Atelier | Durée |
|---|---|---|
| 1 | Premier contact avec Parafo | 20 min |
| 2 | Réglages, et un même besoin en quatre modes | 30 min |
| 3 | Du brief au code : `document.js` en mode Plan puis Agent | 35 min |
| 4 | Les instructions du dépôt, testées en A/B | 45 min |
| 5 | Régler le harnais, puis livrer le circuit de signature | 35 min |
| 6 | Un agent Refactoreur et sa skill pour le code de 2019 | 50 min |
| 7 | Des tests générés par une skill, et une définition de fini | 45 min |
| 8 | MCP, plugin et deux sessions en parallèle | 35 min |
| 9 | Revue d'une PR piégée, avec un agent relecteur | 30 min |

## Règles du jeu

- **Données fictives uniquement** : aucun code client, aucun secret, aucune donnée personnelle dans un prompt.
- **Lire avant d'accepter** : une suggestion acceptée devient *votre* code.
- **On corrige le code, jamais le contrat** : un agent qui modifie `test/acceptance/` est pris par `npm run garde`.
- **Mode économe** : modèle **Auto**, demandes ciblées, une nouvelle session par sujet.
- Bloqué plus de 5 minutes ? Dites-le au prochain point d'étape, ou `npm run reprise -- N` pour repartir.
