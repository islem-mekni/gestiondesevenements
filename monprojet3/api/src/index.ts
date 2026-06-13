import Fastify from "fastify";
import cors from "@fastify/cors";
import Sqlite3 from "better-sqlite3";

const db = Sqlite3("./ecole.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS etudiants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    filiere TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    etudiant_id INTEGER NOT NULL,
    matiere TEXT NOT NULL,
    note REAL NOT NULL,
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id)
  );
`);

const fastify = Fastify();
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"]
});

fastify.get("/etudiants", (request, reply) => {
  try {
    const etudiants = db.prepare("SELECT * FROM etudiants;").all();
    reply.send(etudiants);
  } catch (e) {
    reply.code(500).send();
  }
});

type NouveauEtudiant = {
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
};

fastify.post("/etudiants", (request, reply) => {
  const { nom, prenom, email, filiere } = request.body as NouveauEtudiant;
  if (!nom || !prenom || !email) {
    return reply.code(400).send({ message: "Champs obligatoires manquants" });
  }
  try {
    const result = db.prepare(`
      INSERT INTO etudiants (nom, prenom, email, filiere)
      VALUES (?, ?, ?, ?)
    `).run(nom, prenom, email, filiere);
    reply.code(201).send({ id: result.lastInsertRowid, nom, prenom, email, filiere });
  } catch (e) {
    reply.code(500).send();
  }
});

fastify.get("/etudiants/:id/notes", (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const etudiant = db.prepare("SELECT * FROM etudiants WHERE id = ?;").get(Number(id)) as any;
    const notes = db.prepare("SELECT * FROM notes WHERE etudiant_id = ?;").all(Number(id));
    reply.send({
      id: etudiant.id,
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      filiere: etudiant.filiere,
      notes
    });
  } catch (e) {
    reply.code(500).send();
  }
});

fastify.post("/notes", (request, reply) => {
  const { etudiant_id, matiere, note } = request.body as { etudiant_id: number; matiere: string; note: number };
  try {
    const result = db.prepare(`
      INSERT INTO notes (etudiant_id, matiere, note)
      VALUES (?, ?, ?)
    `).run(etudiant_id, matiere, note);
    reply.code(201).send({ id: result.lastInsertRowid, etudiant_id, matiere, note });
  } catch (e) {
    reply.code(500).send();
  }
});

fastify.delete("/etudiants/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const result = db.prepare("DELETE FROM etudiants WHERE id = ?;").run(Number(id));
    if (result.changes === 0) return reply.code(404).send();
    reply.code(200).send();
  } catch (e) {
    reply.code(500).send();
  }
});

fastify.delete("/notes/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const result = db.prepare("DELETE FROM notes WHERE id = ?;").run(Number(id));
    if (result.changes === 0) return reply.code(404).send();
    reply.code(200).send();
  } catch (e) {
    reply.code(500).send();
  }
});

fastify.listen({ port: 8080 }, () => {
  console.log("Serveur démarré sur http://localhost:8080");
});