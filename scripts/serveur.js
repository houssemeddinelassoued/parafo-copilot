// Serveur HTTP de démonstration : npm run serveur, puis http://localhost:3000/documents
// Il transmet chaque requête à traiterRequete() (src/api.js).
// Bonus Atelier 8 : http://localhost:3000/registre.csv utilise exporterRegistreCsv() (src/export.js).

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { traiterRequete } from '../src/api.js';
import { exporterRegistreCsv } from '../src/export.js';

const PORT = Number(process.env.PORT) || 3000;
const registre = JSON.parse(readFileSync(new URL('../data/documents.json', import.meta.url), 'utf8'));

const serveur = createServer((req, res) => {
  if (req.url === '/registre.csv' && req.method === 'GET') {
    try {
      const csv = exporterRegistreCsv(registre);
      res.writeHead(200, { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="registre.csv"' });
      res.end(csv);
    } catch (e) {
      res.writeHead(501, { 'content-type': 'text/plain; charset=utf-8' });
      res.end(`Export pas encore disponible : ${e.message}`);
    }
    return;
  }
  const { statut, entetes, corps } = traiterRequete({ methode: req.method, chemin: req.url }, registre);
  res.writeHead(statut, entetes);
  res.end(corps);
});

serveur.listen(PORT, () => {
  console.log(`Parafo écoute sur http://localhost:${PORT}/documents  (Ctrl+C pour arrêter)`);
});
