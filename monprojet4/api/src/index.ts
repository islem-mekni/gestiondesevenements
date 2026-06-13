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
  const etudiants = db.prepare("SELECT * FROM etudiants;").all();
  reply.send(etudiants);
});

fastify.listen({ port: 8080 }, () => {
  console.log("Serveur démarré sur http://localhost:8080");
});