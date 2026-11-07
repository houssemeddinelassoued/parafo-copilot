// Atelier 2 · Mode 1 sur 4 : SUGGESTIONS INLINE (Tab, Échap, Ctrl+→, Alt+])
//
// Besoin, identique dans les quatre fichiers :
//   normaliserEmail(' Alice.Martin@Exemple.FR ') → 'alice.martin@exemple.fr'
//   retire un alias : 'alice+factures@exemple.fr' → 'alice@exemple.fr'
//   refuse (ErreurParafo 'EMAIL_INVALIDE') : non-chaîne, vide, sans @, plusieurs @,
//   partie locale ou domaine vide, domaine sans point, espace à l'intérieur.
//
// Consigne : effacez le corps, puis laissez les suggestions inline l'écrire.
// Pas de chat. Notez dans JOURNAL.md le temps passé et le nombre de Tab.

import { ErreurParafo } from '../../src/erreurs.js';

export function normaliserEmail(email) {
  throw new Error('À écrire avec les suggestions inline');
}
