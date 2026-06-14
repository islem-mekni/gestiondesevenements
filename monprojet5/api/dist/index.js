"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const db = (0, better_sqlite3_1.default)("./quiz.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS joueurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    classe TEXT NOT NULL,
    score INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    reponse_a TEXT NOT NULL,
    reponse_b TEXT NOT NULL,
    reponse_c TEXT NOT NULL,
    reponse_d TEXT NOT NULL,
    bonne_reponse TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    joueur_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY (joueur_id) REFERENCES joueurs(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
  );
`);
// Insérer des questions si la table est vide
const count = db.prepare("SELECT COUNT(*) as n FROM questions").get();
if (count.n === 0) {
    db.exec(`
    INSERT INTO questions (question, reponse_a, reponse_b, reponse_c, reponse_d, bonne_reponse)
    VALUES
    ('Quelle est la capitale de la France ?', 'Paris', 'Londres', 'Berlin', 'Madrid', 'Paris'),
    ('Combien font 8 × 7 ?', '54', '56', '58', '52', '56'),
    ('Quel est le plus grand océan ?', 'Atlantique', 'Indien', 'Arctique', 'Pacifique', 'Pacifique'),
    ('En quelle année la Révolution Française ?', '1789', '1776', '1804', '1815', '1789'),
    ('Langage pour styliser les pages web ?', 'HTML', 'CSS', 'JavaScript', 'Python', 'CSS');
  `);
}
const fastify = (0, fastify_1.default)();
fastify.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
});
fastify.get("/joueurs", (request, reply) => {
    const joueurs = db.prepare("SELECT * FROM joueurs ORDER BY score DESC;").all();
    reply.send(joueurs);
});
// GET questions
fastify.get("/questions", (request, reply) => {
    const questions = db.prepare("SELECT * FROM questions;").all();
    reply.send(questions);
});
// POST joueur
fastify.post("/joueurs", (request, reply) => {
    const { nom, classe } = request.body;
    const result = db.prepare("INSERT INTO joueurs (nom, classe) VALUES (?, ?)").run(nom, classe);
    reply.code(201).send({ id: result.lastInsertRowid, nom, classe });
});
// POST score
fastify.post("/scores", (request, reply) => {
    const { joueur_id, question_id, points } = request.body;
    db.prepare("INSERT INTO scores (joueur_id, question_id, points) VALUES (?, ?, ?)").run(joueur_id, question_id, points);
    reply.code(201).send();
});
// PUT score joueur
fastify.put("/joueurs/:id/score", (request, reply) => {
    const { id } = request.params;
    const { score } = request.body;
    db.prepare("UPDATE joueurs SET score = ? WHERE id = ?").run(score, Number(id));
    reply.send();
});
// GET classement avec jointure
fastify.get("/classement", (request, reply) => {
    const classement = db.prepare(`
    SELECT joueurs.nom, joueurs.classe, SUM(scores.points) as score
    FROM joueurs
    JOIN scores ON joueurs.id = scores.joueur_id
    GROUP BY joueurs.id
    ORDER BY score DESC
  `).all();
    reply.send(classement);
});
const start = async () => {
    try {
        await fastify.listen({ port: 8080, host: "0.0.0.0" });
        console.log("Serveur démarré sur http://localhost:8080");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();
