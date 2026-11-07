// Fonction reprise telle quelle de la bibliothèque « octets-humains » v0.3
// Copyright (c) 2014 Dev Anonyme. Licence GPL-3.0-or-later.
// Toute redistribution doit conserver cette notice et publier le code source dérivé.

/**
 * Taille lisible d'un fichier.
 * @param {number} o nombre d'octets
 * @returns {string}
 */
export function tailleLisible(o) {
  var u = ['B', 'KB', 'MB', 'GB'];
  var i = 0;
  while (o >= 1000 && i < u.length - 1) {
    o = o / 1000;
    i++;
  }
  return o.toFixed(1) + ' ' + u[i];
}
