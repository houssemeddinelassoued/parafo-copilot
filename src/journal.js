// Journal d'audit de Parafo (fourni : NE PAS MODIFIER, c'est le code à tester à l'Atelier 7)
//
// Chaque événement (dépôt, envoi, signature, refus…) est ajouté à un journal chaîné :
// une entrée porte l'empreinte SHA-256 de la précédente. Modifier une entrée passée
// casse la chaîne, et verifierChaine() le détecte.

import { createHash } from 'node:crypto';
import { ErreurParafo } from './erreurs.js';

/** Types d'événements acceptés par le journal. */
export const TYPES = Object.freeze(['depot', 'envoi', 'signature', 'refus', 'relance', 'expiration', 'annulation']);

/** Empreinte « précédente » de la toute première entrée. */
export const GENESE = '0'.repeat(64);

/**
 * Calcule l'empreinte d'une entrée à partir de tous ses champs, sauf `empreinte`.
 * @param {object} entree
 * @returns {string} SHA-256 en hexadécimal (64 caractères)
 */
export function calculerEmpreinte(entree) {
  const champs = [entree.index, entree.horodatage, entree.type, entree.documentId, entree.acteur, entree.details, entree.precedente];
  return createHash('sha256').update(JSON.stringify(champs)).digest('hex');
}

/**
 * Vérifie une chaîne d'entrées.
 * @param {ReadonlyArray<object>} entrees
 * @returns {{ valide: boolean, indexCorrompu: number | null }}
 */
export function verifierChaine(entrees) {
  for (let i = 0; i < entrees.length; i++) {
    const entree = entrees[i];
    const attendue = i === 0 ? GENESE : entrees[i - 1].empreinte;
    if (entree.precedente !== attendue) return { valide: false, indexCorrompu: i };
    if (calculerEmpreinte(entree) !== entree.empreinte) return { valide: false, indexCorrompu: i };
  }
  return { valide: true, indexCorrompu: null };
}

/**
 * Crée un journal vide.
 * @param {{ horloge?: () => Date }} [options] horloge injectable (pour les tests)
 */
export function creerJournal({ horloge = () => new Date() } = {}) {
  const entrees = [];

  function ajouter({ type, documentId, acteur, details = {} } = {}) {
    if (!TYPES.includes(type)) {
      throw new ErreurParafo('TYPE_INCONNU', `Type d'événement inconnu : ${type}`);
    }
    if (typeof documentId !== 'string' || documentId.trim() === '') {
      throw new ErreurParafo('DOCUMENT_MANQUANT', 'Chaque événement doit indiquer son document.');
    }
    if (typeof acteur !== 'string' || acteur.trim() === '') {
      throw new ErreurParafo('ACTEUR_MANQUANT', 'Chaque événement doit indiquer son acteur.');
    }
    const precedente = entrees.length > 0 ? entrees[entrees.length - 1].empreinte : GENESE;
    const entree = {
      index: entrees.length,
      horodatage: horloge().toISOString(),
      type,
      documentId,
      acteur,
      details,
      precedente,
    };
    entree.empreinte = calculerEmpreinte(entree);
    const figee = Object.freeze(entree);
    entrees.push(figee);
    return figee;
  }

  return {
    ajouter,
    lister: () => entrees.slice(),
    parDocument: (documentId) => entrees.filter((e) => e.documentId === documentId),
    verifier: () => verifierChaine(entrees),
    get taille() {
      return entrees.length;
    },
  };
}
