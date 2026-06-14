# 📚 Guide Complet — Application Web Node.js + TypeScript

## 🗂️ Structure des fichiers

```
monprojet/
├── api/
│   ├── src/
│   │   └── index.ts       ← code backend
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/              ← généré automatiquement
├── index.html
├── style.css
└── script.js
```

---

## ✅ Étapes dans le bon ordre

### 1️⃣ Créer le dossier et entrer dedans
```bash
mkdir monprojet
cd monprojet
mkdir api
cd api
```

### 2️⃣ Initialiser npm — UNE SEULE FOIS
```bash
npm init -y
```

### 3️⃣ Modifier `package.json` TOUT DE SUITE
```json
{
  "name": "api",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsc && node dist/index.js"
  },
  "type": "commonjs"
}
```

### 4️⃣ Installer les packages
```bash
npm i fastify @fastify/cors better-sqlite3
npm i -D typescript @types/better-sqlite3
```

### 5️⃣ Créer tsconfig.json
Crée le fichier `tsconfig.json` dans `api/` et colle :
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "target": "ES2020",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

### 6️⃣ Créer src/index.ts
tsx --init
### et écrire le code
```typescript
import Fastify from "fastify";
import cors from "@fastify/cors";
import Sqlite3 from "better-sqlite3";

const db = Sqlite3("./mabase.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    categorie TEXT
  );
`);

const fastify = Fastify();
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"]
});

// GET — Lire tous les éléments
fastify.get("/elements", (request, reply) => {
  try {
    const elements = db.prepare("SELECT * FROM elements;").all();
    reply.send(elements);
  } catch (e) {
    reply.code(500).send();
  }
});

// POST — Ajouter un élément
type NouvelElement = {
  nom: string;
  prenom: string;
  email: string;
  categorie: string;
};

fastify.post("/elements", (request, reply) => {
  const { nom, prenom, email, categorie } = request.body as NouvelElement;
  if (!nom || !prenom || !email) {
    return reply.code(400).send({ message: "Champs obligatoires manquants" });
  }
  try {
    const result = db.prepare(`
      INSERT INTO elements (nom, prenom, email, categorie)
      VALUES (?, ?, ?, ?)
    `).run(nom, prenom, email, categorie);
    reply.code(201).send({ id: result.lastInsertRowid, nom, prenom, email, categorie });
  } catch (e) {
    reply.code(500).send();
  }
});

// DELETE — Supprimer un élément
fastify.delete("/elements/:id", (request, reply) => {
  const { id } = request.params as { id: string };
  try {
    const result = db.prepare("DELETE FROM elements WHERE id = ?;").run(Number(id));
    if (result.changes === 0) return reply.code(404).send();
    reply.code(200).send();
  } catch (e) {
    reply.code(500).send();
  }
});

fastify.listen({ port: 8080 }, () => {
  console.log("Serveur démarré sur http://localhost:8080");
});
```

### 7️⃣ Lancer le serveur
```bash
npm run dev
```
→ Le dossier `dist/` apparaît automatiquement ✅

### 8️⃣ Tester l'API dans le navigateur
```
http://localhost:8080/elements
```
Tu dois voir : `[]`

### 9️⃣ Écrire le frontend
- `index.html`
- `style.css`
- `script.js`

---

## 📄 Template `index.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon Application</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="header">
    <nav>
      <a href="index.html">Accueil</a>
    </nav>
  </div>

  <div id="main">
    <div class="card">
      <h2>Ajouter</h2>
      <form id="mon-form">
        <div class="ligne">
          <div class="champ">
            <label>Nom :</label>
            <input type="text" id="nom" placeholder="Votre nom">
          </div>
          <div class="champ">
            <label>Email :</label>
            <input type="email" id="email" placeholder="Email">
          </div>
        </div>
        <button type="button" onclick="ajouter()">Ajouter</button>
        <button type="reset">Effacer</button>
      </form>
    </div>

    <div class="card">
      <h2>Liste</h2>
      <table id="tableau">
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </table>
    </div>
  </div>

  <div id="footer">Mon application</div>
  <script src="script.js"></script>
</body>
</html>
```

---

## 🎨 Template `style.css`

```css
body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #456fb4;
}
#header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 50px;
}
nav a {
    color: rgb(237, 9, 9);
    padding: 10px 20px;
    text-decoration: none;
}
#main {
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
}
.card {
    background: #fff;
    border: 1px solid #e0e7ef;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 16px;
}
.card h2 {
    color: #1a3a5c;
    border-bottom: 2px solid #378ADD;
    padding-bottom: 6px;
    margin: 0 0 14px 0;
}
.ligne {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
}
.champ {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.champ input, .champ select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}
.champ label {
    font-size: 13px;
    color: #555;
    font-weight: 500;
}
button[type="button"] {
    background: #378ADD;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
}
button[type="reset"] {
    background: #eee;
    color: #333;
    border: 1px solid #ccc;
    padding: 8px 20px;
    border-radius: 4px;
    cursor: pointer;
}
table {
    width: 100%;
    border-collapse: collapse;
}
th {
    background: #1a3a5c;
    color: white;
    padding: 10px 12px;
    text-align: left;
}
td {
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
}
tr:nth-child(even) td {
    background: #f7f9ff;
}
#footer {
    background: #1a3a5c;
    color: white;
    text-align: center;
    padding: 12px;
    margin-top: 30px;
}
```

---

## 📜 Template `script.js`

```javascript
const API = "http://localhost:8080"

// Charger les éléments au démarrage
async function charger() {
  const res = await fetch(`${API}/elements`)
  const elements = await res.json()
  afficherTableau(elements)
}

// Ajouter un élément
async function ajouter() {
  const nom = document.getElementById("nom").value.trim()
  const email = document.getElementById("email").value.trim()

  if (!nom || !email) {
    alert("Remplis tous les champs !")
    return
  }

  const res = await fetch(`${API}/elements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, email })
  })

  if (res.ok) {
    document.getElementById("mon-form").reset()
    charger()
  } else {
    alert("Erreur lors de l'ajout !")
  }
}

// Supprimer un élément
async function supprimer(id) {
  if (!confirm("Supprimer ?")) return
  const res = await fetch(`${API}/elements/${id}`, { method: "DELETE" })
  if (res.ok) {
    charger()
  } else {
    alert("Erreur lors de la suppression !")
  }
}

// Afficher le tableau
function afficherTableau(elements) {
  const tableau = document.getElementById("tableau")
  tableau.innerHTML = `
    <tr>
      <th>Nom</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  `
  for (let e of elements) {
    tableau.innerHTML += `
      <tr>
        <td>${e.nom}</td>
        <td>${e.email}</td>
        <td>
          <button onclick="supprimer(${e.id})">Supprimer</button>
        </td>
      </tr>
    `
  }
}

charger()
```

---

## 🚫 Erreurs à ne JAMAIS faire

| ❌ Erreur | ✅ Correct |
|---|---|
| `npm init -y` plusieurs fois | Une seule fois au début |
| Virgule après la dernière colonne SQL | Pas de virgule |
| Noms de tables différents | Même nom partout |
| `"types": []` dans tsconfig | Supprimer cette ligne |
| `"module": "nodenext"` | Utiliser `"commonjs"` |
| Toucher le dossier `dist/` | Jamais ! |
| 2 fichiers `index.js` et `index.ts` dans src/ | Seulement `index.ts` |
| Oublier le script `dev` | Toujours l'ajouter en premier |

---

## 🔴 Erreurs courantes et solutions

### Erreur : `Missing script: "dev"`
→ Ajouter `"dev": "tsc && node dist/index.js"` dans `package.json`

### Erreur : `Cannot open database — directory does not exist`
→ Changer `"../database/mabase.db"` par `"./mabase.db"`

### Erreur : `near ")": syntax error`
→ Supprimer la virgule après la dernière colonne SQL

### Erreur : `Route GET:/xxx not found` (404)
→ La route n'existe pas dans `index.ts` ou mauvaise URL

### Erreur : `500 Internal Server Error`
→ Mauvais nom de table dans les requêtes SQL

### Erreur : `dist/` n'apparaît pas
→ Vérifier `tsconfig.json` et que `src/index.ts` n'est pas vide

---
1. npm init -y
2. Modifier package.json → ajouter script "dev"
3. npm i fastify @fastify/cors better-sqlite3
4. npm i -D typescript @types/better-sqlite3
5. Créer tsconfig.json simplifié
6. Créer src/index.ts et écrire le code ← important !
7. npm run dev → dist/ apparaît !

## 🧠 Règle d'or

> **Setup → Code → Test API → Frontend**
> Toujours dans cet ordre !

