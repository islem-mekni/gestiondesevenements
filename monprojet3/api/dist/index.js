"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = (0, better_sqlite3_1.default)("./ecole.db");
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
const fastify = (0, fastify_1.default)();
fastify.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"]
});
fastify.get("/etudiants", (request, reply) => {
    try {
        const etudiants = db.prepare("SELECT * FROM etudiants;").all();
        reply.send(etudiants);
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.post("/etudiants", (request, reply) => {
    const { nom, prenom, email, filiere } = request.body;
    if (!nom || !prenom || !email) {
        return reply.code(400).send({ message: "Champs obligatoires manquants" });
    }
    try {
        const result = db.prepare(`
      INSERT INTO etudiants (nom, prenom, email, filiere)
      VALUES (?, ?, ?, ?)
    `).run(nom, prenom, email, filiere);
        reply.code(201).send({ id: result.lastInsertRowid, nom, prenom, email, filiere });
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.get("/etudiants/:id/notes", (request, reply) => {
    const { id } = request.params;
    try {
        const etudiant = db.prepare("SELECT * FROM etudiants WHERE id = ?;").get(Number(id));
        const notes = db.prepare("SELECT * FROM notes WHERE etudiant_id = ?;").all(Number(id));
        reply.send({
            id: etudiant.id,
            nom: etudiant.nom,
            prenom: etudiant.prenom,
            filiere: etudiant.filiere,
            notes
        });
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.post("/notes", (request, reply) => {
    const { etudiant_id, matiere, note } = request.body;
    try {
        const result = db.prepare(`
      INSERT INTO notes (etudiant_id, matiere, note)
      VALUES (?, ?, ?)
    `).run(etudiant_id, matiere, note);
        reply.code(201).send({ id: result.lastInsertRowid, etudiant_id, matiere, note });
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.delete("/etudiants/:id", (request, reply) => {
    const { id } = request.params;
    try {
        const result = db.prepare("DELETE FROM etudiants WHERE id = ?;").run(Number(id));
        if (result.changes === 0)
            return reply.code(404).send();
        reply.code(200).send();
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.delete("/notes/:id", (request, reply) => {
    const { id } = request.params;
    try {
        const result = db.prepare("DELETE FROM notes WHERE id = ?;").run(Number(id));
        if (result.changes === 0)
            return reply.code(404).send();
        reply.code(200).send();
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.listen({ port: 8080 }, () => {
    console.log("Serveur démarré sur http://localhost:8080");
});
