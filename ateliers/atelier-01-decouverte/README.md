# Atelier 1 · Premier contact avec Parafo

| Module | Durée | Moment | Fichiers |
|---|---|---|---|
| 1 · Introduction à GitHub Copilot | 20 min | Jour 1 · fin de matinée | `katas/01-premier-contact.js`, tout le dépôt en lecture |

## Objectif

Faire expliquer un dépôt inconnu par Copilot, obtenir une première suggestion inline et observer
ce qui entre dans le contexte d'une requête.

## Point de départ

Votre copie de `parafo-copilot` ouverte dans VS Code, `npm run verifier-poste` sans échec.
Dans la vue Chat, la cible de session est **Copilot** et le modèle **Auto**.

## Étapes

1. **Faire expliquer le dépôt (5 min)**. Vue Chat, mode **Ask** :
   « Explique ce dépôt en 5 phrases : à quoi sert Parafo, comment il est organisé, comment on lance les tests. »
   Vérifiez une affirmation au hasard en ouvrant le fichier cité. Vraie ?
2. **Observer le contexte (5 min)**. Repérez dans la réponse les fichiers que Copilot a lus (références).
   Survolez l'indicateur d'utilisation du contexte et le sélecteur de modèle : combien de tokens, quel coût ?
   Notez-le dans `JOURNAL.md`.
3. **Première suggestion inline (5 min)**. Ouvrez `katas/01-premier-contact.js`, suivez les consignes en tête
   du fichier. `Tab` accepte, `Échap` refuse, `Ctrl+→` accepte mot par mot. **Lisez avant d'accepter.**
4. **Le commentaire guide (5 min)**. Pour `joursAvant`, comparez la suggestion obtenue avec la signature seule,
   puis avec le commentaire au-dessus. Laquelle gère le calcul en UTC ?

⏱ **Point d'étape** à 10 minutes : « Où en êtes-vous : étape 1, 2 ou 3 ? »

## Livrable

- Trois lignes dans `JOURNAL.md` : ce que Copilot a bien expliqué, une erreur ou une approximation repérée,
  les tokens observés.
- `estEmailValide` et `joursAvant` écrites et **relues**.

## Mode économe

Une seule question large à l'étape 1, puis des questions courtes dans la même session.
Le modèle Auto suffit largement.

## Pièges à observer

- L'explication du dépôt est convaincante mais peut inventer une commande : vérifiez dans `package.json`.
- La suggestion inline pour `estEmailValide` accepte souvent `a@b` (domaine sans point).
- `joursAvant` sans commentaire calcule souvent en heure locale : un jour d'écart selon l'heure.

## Coincé ?

Pas de suggestion inline : vérifiez que vous êtes connecté (icône Copilot de la barre d'état) et que le
fichier est bien un `.js`. Dites-le au point d'étape : partage d'écran de 2 minutes.
