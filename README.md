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
npx tsx --init
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
exemple de ts en front
// ── Types ────────────────────────────────────────────────────────────────────

type Statut = "Actif" | "Congé" | "Inactif";

interface Employe {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  departement: string;
  email: string;
  telephone: string;
  dateEntree: string;
  statut: Statut;
}

// ── State ────────────────────────────────────────────────────────────────────

let employes: Employe[] = [
  {
    id: "1",
    nom: "Martin",
    prenom: "Sophie",
    poste: "Responsable RH",
    departement: "Ressources Humaines",
    email: "s.martin@entreprise.fr",
    telephone: "+33 6 12 34 56 78",
    dateEntree: "2019-03-15",
    statut: "Actif",
  },
  {
    id: "2",
    nom: "Bernard",
    prenom: "Julien",
    poste: "Développeur Senior",
    departement: "Technique",
    email: "j.bernard@entreprise.fr",
    telephone: "+33 6 98 76 54 32",
    dateEntree: "2021-07-01",
    statut: "Actif",
  },
  {
    id: "3",
    nom: "Leclerc",
    prenom: "Amina",
    poste: "Directrice Financière",
    departement: "Finance",
    email: "a.leclerc@entreprise.fr",
    telephone: "+33 6 55 44 33 22",
    dateEntree: "2017-01-10",
    statut: "Congé",
  },
];

let editingId: string | null = null;

// ── Utils ────────────────────────────────────────────────────────────────────

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function initiales(e: Employe): string {
  return (e.prenom[0] ?? "") + (e.nom[0] ?? "");
}

function formatDate(iso: string): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

// ── DOM helpers ──────────────────────────────────────────────────────────────

function $(id: string): HTMLElement {
  return document.getElementById(id) as HTMLElement;
}

function showToast(msg: string, type: "success" | "danger" | "" = ""): void {
  const toast = $("toast");
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

function showView(id: string): void {
  document.querySelectorAll<HTMLElement>(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll<HTMLButtonElement>(".nav-btn").forEach(b => b.classList.remove("active"));
  $(`${id}`).classList.add("active");
  document.querySelector<HTMLButtonElement>(`[data-target="${id}"]`)?.classList.add("active");
}

// ── Render : liste du personnel ──────────────────────────────────────────────

function renderCard(e: Employe): string {
  return `
    <div class="emp-card">
      <div class="card-top">
        <div class="avatar">${initiales(e)}</div>
        <div>
          <div class="card-name">${e.prenom} ${e.nom}</div>
          <div class="card-poste">${e.poste}</div>
        </div>
      </div>
      <div class="card-meta">
        <span class="tag">${e.departement}</span>
        <span class="statut-badge statut-${e.statut}">${e.statut}</span>
        <span class="tag">Depuis ${formatDate(e.dateEntree)}</span>
      </div>
      <div class="card-meta" style="color:var(--ink-soft);font-size:.8rem">
        <span>✉ ${e.email}</span>
      </div>
      <div class="card-actions">
        <button class="btn-edit"  data-id="${e.id}">Modifier</button>
        <button class="btn-delete" data-id="${e.id}">Supprimer</button>
      </div>
    </div>`;
}

function renderPersonnel(list: Employe[] = employes): void {
  const container = $("personnel-list");
  $("count-badge").textContent = `${employes.length} employé(s)`;
  if (list.length === 0) {
    container.innerHTML = `<p class="empty-state">Aucun employé enregistré.
      <button class="link-btn" data-target="form">Ajouter le premier →</button></p>`;
    bindLinkBtns(container);
    return;
  }
  container.innerHTML = list.map(renderCard).join("");
  container.querySelectorAll<HTMLButtonElement>(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => startEdit(btn.dataset.id!));
  });
  container.querySelectorAll<HTMLButtonElement>(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteEmploye(btn.dataset.id!));
  });
}

// ── Formulaire ───────────────────────────────────────────────────────────────

function getFormValues(): Partial<Employe> {
  return {
    nom:         (document.getElementById("f-nom")          as HTMLInputElement).value.trim(),
    prenom:      (document.getElementById("f-prenom")       as HTMLInputElement).value.trim(),
    poste:       (document.getElementById("f-poste")        as HTMLInputElement).value.trim(),
    departement: (document.getElementById("f-departement")  as HTMLSelectElement).value,
    email:       (document.getElementById("f-email")        as HTMLInputElement).value.trim(),
    telephone:   (document.getElementById("f-telephone")    as HTMLInputElement).value.trim(),
    dateEntree:  (document.getElementById("f-date")         as HTMLInputElement).value,
    statut:      (document.getElementById("f-statut")       as HTMLSelectElement).value as Statut,
  };
}

function fillForm(e: Employe): void {
  (document.getElementById("f-nom")         as HTMLInputElement).value  = e.nom;
  (document.getElementById("f-prenom")      as HTMLInputElement).value  = e.prenom;
  (document.getElementById("f-poste")       as HTMLInputElement).value  = e.poste;
  (document.getElementById("f-departement") as HTMLSelectElement).value = e.departement;
  (document.getElementById("f-email")       as HTMLInputElement).value  = e.email;
  (document.getElementById("f-telephone")   as HTMLInputElement).value  = e.telephone;
  (document.getElementById("f-date")        as HTMLInputElement).value  = e.dateEntree;
  (document.getElementById("f-statut")      as HTMLSelectElement).value = e.statut;
}

function resetForm(): void {
  ["f-nom","f-prenom","f-poste","f-email","f-telephone","f-date"].forEach(id => {
    (document.getElementById(id) as HTMLInputElement).value = "";
  });
  (document.getElementById("f-departement") as HTMLSelectElement).value = "";
  (document.getElementById("f-statut")      as HTMLSelectElement).value = "Actif";
  $("form-error").classList.add("hidden");
  $("btn-cancel").classList.add("hidden");
  $("form-title").textContent = "Nouvel employé";
  editingId = null;
}

function validateForm(data: Partial<Employe>): string | null {
  if (!data.nom)         return "Le nom est requis.";
  if (!data.prenom)      return "Le prénom est requis.";
  if (!data.poste)       return "Le poste est requis.";
  if (!data.departement) return "Veuillez sélectionner un département.";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Email invalide.";
  return null;
}

function startEdit(id: string): void {
  const e = employes.find(x => x.id === id);
  if (!e) return;
  editingId = id;
  fillForm(e);
  $("form-title").textContent = "Modifier l'employé";
  $("btn-cancel").classList.remove("hidden");
  showView("form");
}

function saveEmploye(): void {
  const data = getFormValues();
  const err  = validateForm(data);
  if (err) {
    const errEl = $("form-error");
    errEl.textContent = err;
    errEl.classList.remove("hidden");
    return;
  }
  $("form-error").classList.add("hidden");

  if (editingId) {
    const idx = employes.findIndex(e => e.id === editingId);
    employes[idx] = { ...employes[idx], ...(data as Employe) };
    showToast("Employé mis à jour ✓", "success");
  } else {
    employes.push({ id: genId(), ...(data as Omit<Employe, "id">) });
    showToast("Employé ajouté ✓", "success");
  }

  resetForm();
  renderPersonnel();
  renderSearch();
  showView("personnel");
}

function deleteEmploye(id: string): void {
  employes = employes.filter(e => e.id !== id);
  renderPersonnel();
  renderSearch();
  showToast("Employé supprimé", "danger");
}

// ── Recherche ────────────────────────────────────────────────────────────────

function renderSearch(): void {
  const q      = (document.getElementById("search-input")  as HTMLInputElement).value.toLowerCase();
  const dept   = (document.getElementById("search-dept")   as HTMLSelectElement).value;
  const stat   = (document.getElementById("search-statut") as HTMLSelectElement).value;
  const container = $("search-results");

  if (!q && !dept && !stat) {
    container.innerHTML = `<p class="empty-state">Lancez une recherche ci-dessus.</p>`;
    return;
  }

  const results = employes.filter(e => {
    const matchQ    = !q    || `${e.nom} ${e.prenom} ${e.poste} ${e.departement}`.toLowerCase().includes(q);
    const matchDept = !dept || e.departement === dept;
    const matchStat = !stat || e.statut === stat;
    return matchQ && matchDept && matchStat;
  });

  if (results.length === 0) {
    container.innerHTML = `<p class="empty-state">Aucun résultat pour cette recherche.</p>`;
    return;
  }
  container.innerHTML = results.map(renderCard).join("");

  container.querySelectorAll<HTMLButtonElement>(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => startEdit(btn.dataset.id!));
  });
  container.querySelectorAll<HTMLButtonElement>(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => { deleteEmploye(btn.dataset.id!); renderSearch(); });
  });
}

// ── Navigation ───────────────────────────────────────────────────────────────

function bindLinkBtns(root: HTMLElement = document.body): void {
  root.querySelectorAll<HTMLButtonElement>("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target!;
      if (target === "form") resetForm();
      showView(target);
    });
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  bindLinkBtns();

  $("btn-save").addEventListener("click", saveEmploye);

  $("btn-cancel").addEventListener("click", () => { resetForm(); showView("personnel"); });

  $("search-input").addEventListener("input", renderSearch);
  $("search-dept").addEventListener("change", renderSearch);
  $("search-statut").addEventListener("change", renderSearch);

  renderPersonnel();
});

## 🧠 Règle d'or

> **Setup → Code → Test API → Frontend**
> Toujours dans cet ordre !

