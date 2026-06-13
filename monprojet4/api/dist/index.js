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
    const etudiants = db.prepare("SELECT * FROM etudiants;").all();
    reply.send(etudiants);
});
fastify.listen({ port: 8080 }, () => {
    console.log("Serveur démarré sur http://localhost:8080");
});
