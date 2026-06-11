
let personnels = []

function ajouterPersonnel() {
  let nom = document.getElementById("nom").value
  let prenom = document.getElementById("prenom").value
  let email = document.getElementById("email").value
  let niveau = document.getElementById("niveau").value
  let date = document.getElementById("date-naissance").value
  let filiere = document.getElementById("filiere").value  // corrigé

  if (nom == "" || prenom == "" || email == "") {
    alert("Remplis tous les champs !")
    return
  }

  let personnel = {
    nom: nom,
    prenom: prenom,
    email: email,
    niveau: niveau,
    date: date,
    filiere: filiere  // corrigé
  }

  personnels.push(personnel)
  afficherTableau()

  document.getElementById("nom").value = ""
  document.getElementById("prenom").value = ""
  document.getElementById("email").value = ""
}

function afficherTableau() {
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

  for (let i = 0; i < personnels.length; i++) {
    let p = personnels[i]

    tableau.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.prenom}</td>
        <td>${p.email}</td>
        <td>${p.niveau}</td>
        <td>${p.date}</td>
        <td>${p.filiere}</td>
        <td>
          <button onclick="supprimer(${i})">Supprimer</button>
        </td>
      </tr>
    `
  }
}

function supprimer(index) {
  personnels.splice(index, 1)
  afficherTableau()
}