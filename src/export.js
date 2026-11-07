// Atelier 8 · Ticket 1 : export CSV du registre (session parallèle n° 1)
//
// Tests : test/acceptance/a8-export.test.js
//
//   exporterRegistreCsv(documents, { separateur = ';', bom = true } = {})
//     colonnes, dans cet ordre : id;titre;auteur;etat;creeLe   (ligne d'en-tête)
//     une ligne par document, dans l'ordre reçu ; fin de ligne '\r\n', y compris la dernière ;
//     champ absent (undefined ou null) → champ vide ;
//     un champ contenant le séparateur, un guillemet ou un retour à la ligne est entouré
//     de guillemets, et ses guillemets sont doublés ("") ;
//     un champ qui commence par = + - @ ou une tabulation est préfixé d'une apostrophe (')
//     pour empêcher l'injection de formules dans un tableur ;
//     bom = true → le texte commence par '﻿' (Excel lit alors l'UTF-8 correctement).
//     documents n'est pas un tableau → ErreurParafo 'REGISTRE_INVALIDE'
//     separateur n'est pas un caractère unique → ErreurParafo 'SEPARATEUR_INVALIDE'

export function exporterRegistreCsv(documents, options) {
  throw new Error('À générer pendant l’Atelier 8 (ticket 1)');
}
