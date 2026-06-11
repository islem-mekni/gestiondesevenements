"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// Connexion à la base de données
const db = (0, better_sqlite3_1.default)("../database/personnels.db");
// Créer la table si elle n'existe pas
db.exec(`
  CREATE TABLE IF NOT EXISTS personnel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    niveau TEXT,
    date_naissance TEXT,
    filiere TEXT
  );
`);
// Créer le serveur
const fastify = (0, fastify_1.default)();
fastify.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"]
});
// ─────────────────────────────────────────
// GET /personnels → récupérer tous les personnels
// ─────────────────────────────────────────
fastify.get("/personnels", (request, reply) => {
    try {
        const query = db.prepare("SELECT * FROM personnel;");
        const personnels = query.all();
        reply.send(personnels);
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.post("/personnels", (request, reply) => {
    const { nom, prenom, email, niveau, date_naissance, filiere } = request.body;
    if (!nom || !prenom || !email) {
        return reply.code(400).send({ message: "Champs obligatoires manquants" });
    }
    try {
        const query = db.prepare(`
      INSERT INTO personnel (nom, prenom, email, niveau, date_naissance, filiere)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const result = query.run(nom, prenom, email, niveau, date_naissance, filiere);
        reply.code(201).send({
            id: result.lastInsertRowid,
            nom, prenom, email, niveau, date_naissance, filiere
        });
    }
    catch (e) {
        reply.code(500).send();
    }
});
// ─────────────────────────────────────────
// DELETE /personnels/:id → supprimer un personnel
// ─────────────────────────────────────────
fastify.delete("/personnels/:id", (request, reply) => {
    const { id } = request.params; // string ici
    try {
        const query = db.prepare("DELETE FROM personnel WHERE id = ?;");
        const result = query.run(Number(id)); // convertir en nombre
        if (result.changes === 0)
            return reply.code(404).send();
        reply.code(200).send();
    }
    catch (e) {
        reply.code(500).send();
    }
});
// Démarrer le serveur
fastify.listen({ port: 8080 }, () => {
    console.log("Serveur démarré sur http://localhost:8080");
});
