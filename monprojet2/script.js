const API="http://localhost:8080"
async function chargerMembres() {
  const response = await fetch(`${API}/membres`)
  const membres = await response.json()
  afficherTableau(membres)
}
async function ajouterMembre() {
  const nom = document.getElementById("nom").value
  const prenom = document.getElementById("prenom").value
  const email = document.getElementById("email").value
  const categorie = document.getElementById("categorie").value

  if (!nom || !prenom || !email) {
    alert("Remplis tous les champs !")
    return
  }
  await fetch(`${API}/membres`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom, email, categorie})
 })


 // Vider le formulaire
  document.getElementById("nom").value = ""
  document.getElementById("prenom").value = ""
  document.getElementById("email").value = ""
  chargerMembres()
}
async function supprimer(id) {
  const response = await fetch(`${API}/membres/${id}`, { method: "DELETE" })
  
  if (response.ok) {
    chargermembres()
  } else {
    alert("Erreur lors de la suppression !")
  }
}
function afficherTableau(membres) {
  let tableau = document.getElementById("tableau")

  tableau.innerHTML = `
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Email</th>
      <th>Categorie</th>

    </tr>
  `
    for (let p of membres) {
    tableau.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.prenom}</td>
        <td>${p.email}</td>
        <td>${p.categorie}</td>
        <td>
          <button onclick="supprimer(${p.id})">Supprimer</button>
        </td>
      </tr>
    `
  }
}
chargerMembres()