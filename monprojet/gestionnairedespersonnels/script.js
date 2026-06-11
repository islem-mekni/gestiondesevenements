
const API = "http://localhost:8080"

// ── Charger les personnels au démarrage ──
async function chargerPersonnels() {
  const response = await fetch(`${API}/personnels`)
  const personnels = await response.json()
  afficherTableau(personnels)
}

// ── Ajouter un personnel ──
async function ajouterPersonnel() {
  const nom = document.getElementById("nom").value
  const prenom = document.getElementById("prenom").value
  const email = document.getElementById("email").value
  const niveau = document.getElementById("niveau").value
  const date_naissance = document.getElementById("date-naissance").value
  const filiere = document.getElementById("filiere").value

  if (!nom || !prenom || !email) {
    alert("Remplis tous les champs !")
    return
  }

  await fetch(`${API}/personnels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom, email, niveau, date_naissance, filiere })
  })

  // Vider le formulaire
  document.getElementById("nom").value = ""
  document.getElementById("prenom").value = ""
  document.getElementById("email").value = ""

  // Recharger le tableau
  chargerPersonnels()
}

// ── Supprimer un personnel ──
async function supprimer(id) {
  const response = await fetch(`${API}/personnels/${id}`, { method: "DELETE" })
  
  if (response.ok) {
    chargerPersonnels()
  } else {
    alert("Erreur lors de la suppression !")
  }
}

// ── Afficher dans le tableau ──
function afficherTableau(personnels) {
  let tableau = document.getElementById("tableau")

  tableau.innerHTML = `
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Email</th>
      <th>Niveau</th>
      <th>Date naissance</th>
      <th>Filière</th>
      <th>Actions</th>
    </tr>
  `

  for (let p of personnels) {
    tableau.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.prenom}</td>
        <td>${p.email}</td>
        <td>${p.niveau}</td>
        <td>${p.date_naissance}</td>
        <td>${p.filiere}</td>
        <td>
          <button onclick="supprimer(${p.id})">Supprimer</button>
        </td>
      </tr>
    `
  }
}

// Charger au démarrage
chargerPersonnels()