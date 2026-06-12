"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = (0, better_sqlite3_1.default)("../database/membres.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS membre (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    categorie TEXT
  );
`);
const fastify = (0, fastify_1.default)();
fastify.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"]
});
fastify.get("/membres", (request, reply) => {
    try {
        const query = db.prepare("SELECT * FROM membre;");
        const membres = query.all();
        reply.send(membres);
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.post("/membres", (request, reply) => {
    const { nom, prenom, email, categorie } = request.body;
    if (!nom || !prenom || !email) {
        return reply.code(400).send({ message: "Champs obligatoires manquants" });
    }
    try {
        const query = db.prepare(`
      INSERT INTO membre (nom, prenom, email, categorie)
      VALUES (?, ?, ?,?)
    `);
        const result = query.run(nom, prenom, email, categorie);
        reply.code(201).send({
            id: result.lastInsertRowid,
            nom, prenom, email, categorie
        });
    }
    catch (e) {
        reply.code(500).send();
    }
});
fastify.delete("/membres/:id", (request, reply) => {
    const { id } = request.params; // string ici
    try {
        const query = db.prepare("DELETE FROM membre WHERE id = ?;");
        const result = query.run(Number(id)); // convertir en nombre
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
