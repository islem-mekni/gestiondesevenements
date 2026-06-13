const API2 = "http://localhost:8080/notes"
const API1 = "http://localhost:8080"

async function chargerEtudiants() {
  const response = await fetch(`${API1}/etudiants`)
  const etudiants = await response.json()
  afficherTableau(etudiants)
}
async function ajouterEtudiant() {
  const nom = document.getElementById("nom").value
  const prenom = document.getElementById("prenom").value
  const email = document.getElementById("email").value
  const filiere = document.getElementById("filiere").value

  if (!nom || !prenom || !email) {
    alert("Remplis tous les champs !")
    return
  }

  await fetch(`${API1}/etudiants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom, email, filiere })
  })

  // Vider le formulaire
  document.getElementById("nom").value = ""
  document.getElementById("prenom").value = ""
  document.getElementById("email").value = ""

  // Recharger le tableau
  chargerEtudiants()
}
// ── Supprimer un etudiant ──
async function supprimer(id) {
  const response = await fetch(`${API1}/etudiants/${id}`, { method: "DELETE" })
  
  if (response.ok) {
    chargerEtudiants()
  } else {
    alert("Erreur lors de la suppression !")
  }
}
function afficherTableau(etudiants) {
  let tableau = document.getElementById("tableau")

  tableau.innerHTML = `
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Email</th>
      <th>Filière</th>
      <th>Actions</th>
    </tr>
  `

  for (let e of etudiants) {
  tableau.innerHTML += `
    <tr>
      <td>${e.nom}</td>
      <td>${e.prenom}</td>
      <td>${e.email}</td>
      <td>${e.filiere}</td>
      <td>
        <button onclick="supprimer(${e.id})">Supprimer</button>
        <button onclick="window.location.href='notes.html?id=${e.id}'">Voir notes</button>
      </td>
    </tr>
  `
}
}

// Charger au démarrage
chargerEtudiants()


