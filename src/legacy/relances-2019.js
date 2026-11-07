// relances.js - v1.3 - 2019
// module de relances du parapheur. NE PAS TOUCHER, ca marche !!
// (calcule les dates de relance et la date d'expiration en jours ouvres)

var FERIES = ['2019-01-01', '2019-04-22', '2019-05-01', '2019-05-08', '2019-05-30', '2019-06-10', '2019-07-14', '2019-08-15', '2019-11-01', '2019-11-11', '2019-12-25'];

function d2s(x) {
  var m = x.getUTCMonth() + 1;
  var j = x.getUTCDate();
  return x.getUTCFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (j < 10 ? '0' + j : j);
}

function ok(x, f) {
  var j = x.getUTCDay();
  if (j == 0 || j == 6) return false;
  for (var i = 0; i < f.length; i++) {
    if (f[i] == d2s(x)) return false;
  }
  return true;
}

// d = date d'envoi 'AAAA-MM-JJ', n = delai, f = feries, t = 'r' (relances) ou 'e' (expiration)
export function calc(d, n, f, t) {
  if (!f) f = FERIES;
  f.sort();
  var x = new Date(d + 'T00:00:00Z');
  var r = [];
  var c = 0;
  if (ok(x, f)) c = 1;
  while (c < n) {
    x = new Date(x.getTime() + 86400000);
    if (ok(x, f)) {
      c++;
      if (t == 'r' && c % 3 == 0 && c < n) r.push(d2s(x));
    }
  }
  if (t == 'e') return d2s(x);
  if (t == 'r') return r;
  return null;
}
