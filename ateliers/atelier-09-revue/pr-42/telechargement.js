import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ErreurParafo } from '../../../src/erreurs.js';

/** Dossier où sont rangés les PDF signés. */
export const DOSSIER_SIGNES = fileURLToPath(new URL('../../../data/signes/', import.meta.url));

/**
 * Renvoie le chemin complet du fichier signé demandé dans l'URL
 * (par exemple GET /telecharger/DOC-3f9a1c07.pdf).
 * @param {string} nomFichier
 * @returns {string}
 */
export function cheminDocument(nomFichier) {
  if (!nomFichier) {
    throw new ErreurParafo('NOM_INVALIDE', 'Nom de fichier manquant.');
  }
  return join(DOSSIER_SIGNES, nomFichier);
}
