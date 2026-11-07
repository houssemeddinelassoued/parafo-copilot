# Brief · le document à signer

*Rédigé par la responsable produit de Parafo. Données fictives.*

Un **document** est ce que l'on fait signer. Nous avons besoin d'un module `src/document.js`, sans
dépendance, qui crée un document et gère son cycle de vie.

## Créer un document

On fournit un titre, un contenu (texte ou octets), l'adresse e-mail de l'auteur et, pour les tests,
la date de création (par défaut : maintenant).

- Le titre est nettoyé des espaces autour ; il fait entre 3 et 120 caractères.
- Le contenu n'est jamais vide ; sa taille, **en octets**, ne dépasse pas 10 Mo (10 × 1024 × 1024).
- L'auteur est une adresse e-mail valide, enregistrée en minuscules.
- On calcule l'**empreinte SHA-256** du contenu (64 caractères hexadécimaux) : c'est la preuve que le
  document n'a pas changé. L'identifiant du document est `DOC-` suivi des 8 premiers caractères de l'empreinte.
- Un nouveau document est un **brouillon**. On garde un **historique** des états avec leur date (ISO 8601).

Toute donnée invalide lève une `ErreurParafo` (voir `src/erreurs.js`) avec un code précis :
`TITRE_INVALIDE`, `CONTENU_INVALIDE`, `DOCUMENT_TROP_VOLUMINEUX`, `AUTEUR_INVALIDE`.

## Cycle de vie

```
brouillon ──► en_circulation ──► signe
    │               ├──────────► refuse
    │               ├──────────► expire
    └───────────────┴──────────► annule
```

- On ne passe que par les flèches ci-dessus : sinon `TRANSITION_INTERDITE`. Un état qui n'existe pas : `ETAT_INCONNU`.
- Changer d'état **ne modifie jamais** le document reçu : on renvoie une copie, avec une ligne d'historique en plus.
- Signé, refusé, expiré et annulé sont des états **terminaux** : on veut une fonction qui le dit.

## Fonctions attendues

`empreinteSha256(contenu)`, `creerDocument({ titre, contenu, auteur, maintenant })`,
`changerEtat(document, nouvelEtat, maintenant)`, `estTermine(document)`, et la constante `TAILLE_MAX`.

Les tests d'acceptation `test/acceptance/a3-document.test.js` font foi.
