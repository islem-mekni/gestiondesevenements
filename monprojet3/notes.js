const API = "http://localhost:8080"

// Récupère l'id de l'étudiant depuis l'URL
// Ex: notes.html?id=1 → id = "1"
const params = new URLSearchParams(window.location.search)
const id = params.get("id")

// ── Charger les notes de l'étudiant ──
async function chargerNotes() {
  // Appelle la route GET /etudiants/1/notes
  const res = await fetch(`${API}/etudiants/${id}/notes`)
  const data = await res.json()

  // Affiche le nom et la filière dans la card Informations
  document.getElementById("etudiant-nom").textContent = data.nom + " " + data.prenom
  document.getElementById("etudiant-filiere").textContent = data.filiere

  // Calcule la moyenne
  const notes = data.notes
  if (notes.length > 0) {
    const total = notes.reduce((acc, n) => acc + n.note, 0)
    document.getElementById("etudiant-moyenne").textContent = (total / notes.length).toFixed(1)
  } else {
    document.getElementById("etudiant-moyenne").textContent = "-"
  }

  // Remplit le tableau des notes
  const tableau = document.getElementById("tableau")
  while (tableau.rows.length > 1) tableau.deleteRow(1)

  notes.forEach(n => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td>${n.matiere}</td>
      <td>${n.note} / 20</td>
      <td><button onclick="supprimerNote(${n.id})">Supprimer</button></td>
    `
    tableau.appendChild(tr)
  })
}

// ── Ajouter une note ──
async function ajouterNote() {
  const matiere = document.getElementById("matiere").value
  const note = document.getElementById("note").value

  if (!matiere || matiere === "-- Choisir --" || !note) {
    alert("Remplis tous les champs !")
    return
  }

  // Envoie POST /notes avec l'id de l'étudiant
  await fetch(`${API}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      etudiant_id: Number(id),  // l'id vient de l'URL
      matiere, 
      note: Number(note)        // convertit en nombre
    })
  })

  document.getElementById("note").value = ""
  chargerNotes()  // recharge le tableau
}

// ── Supprimer une note ──
async function supprimerNote(noteId) {
  await fetch(`${API}/notes/${noteId}`, { method: "DELETE" })
  chargerNotes()  // recharge le tableau
}

// Lance au chargement de la page
chargerNotes()