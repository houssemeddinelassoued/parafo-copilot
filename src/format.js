// Atelier 4 · Affichage des documents (test A/B des instructions)
//
// Générez ce fichier DEUX fois : d'abord SANS fichier d'instructions,
// puis AVEC `.github/copilot-instructions.md`. Comparez.
// Tests : npm run test:atelier4
//
// Ce que doivent faire les trois fonctions :
//
//   formaterReference(42, 2026)        → 'PAR-2026-0042'
//     numero : entier de 1 à 9999, annee : entier de 2000 à 2099.
//
//   formaterTaille(512)                → '512 o'
//   formaterTaille(12_800)             → '12,5 Ko'
//   formaterTaille(1_258_291)          → '1,2 Mo'
//     octets : entier ≥ 0. Une décimale à partir du Ko.
//
//   resumerDocument(document)          → '« Contrat cadre » · en circulation · 12,5 Ko · DOC-1a2b3c4d'
//     libellés d'état : brouillon, en circulation, signé, refusé, expiré, annulé.
//
// Les règles maison (erreurs, langue, style) ne sont PAS écrites ici :
// elles iront dans les instructions du dépôt.

export function formaterReference(numero, annee) {
  throw new Error('À générer pendant l’Atelier 4');
}

export function formaterTaille(octets) {
  throw new Error('À générer pendant l’Atelier 4');
}

export function resumerDocument(document) {
  throw new Error('À générer pendant l’Atelier 4');
}
