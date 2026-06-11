
let personnels = []

// Fonction appelée quand on clique sur Ajouter
function ajouterPersonnel() {

  // 1 - Récupérer les valeurs des champs
  let nom    = document.getElementById("nom").value
  let prenom = document.getElementById("prenom").value
  let email  = document.getElementById("email").value
  let niveau = document.getElementById("niveau").value
  let date = document.getElementById("date-naissance").value
  let filliere = document.getElementById("filliere").value


  // 2 - Vérifier que les champs ne sont pas vides
  if (nom == "" || prenom == "" || email == "") {
    alert("Remplis tous les champs !")
    return
  }

  // 3 - Créer un objet personnel
  let personnel = {
    nom: nom,
    prenom: prenom,
    email: email,
    niveau: niveau,
    date:date,
    filliere:filliere
  }

  // 4 - Ajouter à la liste
  personnels.push(personnel)

  // 5 - Afficher dans le tableau
  afficherTableau()

  // 6 - Vider le formulaire
  document.getElementById("nom").value = ""
  document.getElementById("prenom").value = ""
  document.getElementById("email").value = ""
}

// Fonction qui affiche la liste dans le tableau HTML
function afficherTableau() {

  // Récupère le tableau HTML
  let tableau = document.getElementById("tableau")

  // Recrée le contenu du tableau
  tableau.innerHTML = `
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Email</th>
      <th>Niveau</th>
      <th>Actions</th>
    </tr>
  `

  // Pour chaque personnel dans la liste
  for (let i = 0; i < personnels.length; i++) {
    let p = personnels[i]

    // Ajoute une ligne dans le tableau
    tableau.innerHTML += `
      <tr>
        <td>${p.nom}</td>
        <td>${p.prenom}</td>
        <td>${p.email}</td>
        <td>${p.niveau}</td>
        <td>${p.date}</td>
        <td>${p.filliere}</td>
        <td>
          <button onclick="supprimer(${i})">Supprimer</button>
        </td>
      </tr>
    `
  }
}

// Fonction supprimer
function supprimer(index) {
  personnels.splice(index, 1)
  afficherTableau()
}