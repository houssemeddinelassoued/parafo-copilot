import crypto from 'node:crypto';

/**
 * Vérifie que le contenu correspond à l'empreinte enregistrée au registre.
 * @param {Buffer | string} contenu
 * @param {string} empreinteAttendue SHA-256 en hexadécimal
 * @returns {boolean}
 */
export function empreinteValide(contenu, empreinteAttendue) {
  const calculee = crypto.sha256(contenu).toString('hex');
  return calculee === empreinteAttendue;
}
