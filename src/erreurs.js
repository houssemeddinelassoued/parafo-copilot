/**
 * Erreur métier de Parafo.
 *
 * Toutes les fonctions de `src/` signalent une donnée invalide en levant une
 * `ErreurParafo` : le `code` est stable (les tests le vérifient), le message
 * est en français et s'adresse à un humain.
 *
 * @example
 * throw new ErreurParafo('TITRE_INVALIDE', 'Le titre doit contenir entre 3 et 120 caractères.');
 */
export class ErreurParafo extends Error {
  /**
   * @param {string} code    Code en MAJUSCULES_AVEC_SOULIGNÉS, par exemple `TITRE_INVALIDE`.
   * @param {string} [message] Message lisible, en français.
   */
  constructor(code, message = code) {
    super(message);
    this.name = 'ErreurParafo';
    this.code = code;
  }
}
