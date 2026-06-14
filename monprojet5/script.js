const API = "http://localhost:8080"

let joueur = { nom: "", classe: "", score: 0 }
let questions = []
let qIndex = 0
let bonnes = 0

function afficherEcran(id) {
  document.querySelectorAll(".ecran").forEach(e => e.classList.remove("active"))
  document.getElementById(id).classList.add("active")
}

async function commencer() {
  const nom = document.getElementById("nom").value.trim()
  const classe = document.getElementById("classe").value

  console.log("nom:", nom, "classe:", classe)

  if (!nom || classe === "-- Choisir --") {
    alert("Remplis tous les champs !")
    return
  }

  try {
    console.log("Envoi joueur...")
    const res = await fetch(`${API}/joueurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, classe })
    })
    const data = await res.json()
    console.log("Joueur créé:", data)
    joueur = { id: data.id, nom, classe, score: 0 }

    console.log("Chargement questions...")
    const resQ = await fetch(`${API}/questions`)
    questions = await resQ.json()
    console.log("Questions reçues:", questions)

    if (!questions || questions.length === 0) {
      alert("Pas de questions !")
      return
    }

    qIndex = 0
    bonnes = 0
    afficherEcran("ecran-2")
    afficherQuestion()

  } catch (err) {
    console.error("ERREUR:", err)
    alert("Erreur serveur !")
  }
}

function afficherQuestion() {
  const q = questions[qIndex]
  console.log("Question:", q)

  document.getElementById("question-titre").textContent = `Question ${qIndex + 1}/${questions.length}`
  document.getElementById("question-texte").textContent = q.question
  document.getElementById("feedback").textContent = ""
  document.getElementById("feedback").className = ""
  document.getElementById("btn-suivant").style.display = "none"

  const choixDiv = document.getElementById("choix")
  choixDiv.innerHTML = ""

  const reponses = [q.reponse_a, q.reponse_b, q.reponse_c, q.reponse_d]
  reponses.forEach(r => {
    const btn = document.createElement("button")
    btn.className = "choix-btn"
    btn.textContent = r
    btn.type = "button"
    btn.onclick = () => repondre(r, btn, q)
    choixDiv.appendChild(btn)
  })
}

function calculerPoints(classe, correct) {
  switch (classe) {
    case "Guerrier": return correct ? 10 : 0
    case "Mage":     return correct ? 15 : -5
    case "Archer":   return correct ? 12 : 0
    default:         return 0
  }
}

async function repondre(rep, btn, q) {
  const correct = rep === q.bonne_reponse
  const pts = calculerPoints(joueur.classe, correct)
  joueur.score += pts

  document.querySelectorAll(".choix-btn").forEach(b => {
    b.disabled = true
    if (b.textContent === q.bonne_reponse) b.classList.add("correct")
  })
  if (!correct) btn.classList.add("wrong")

  const feedback = document.getElementById("feedback")
  if (correct) {
    feedback.textContent = `✓ Bonne réponse ! +${pts} points`
    feedback.className = "feedback-correct"
    bonnes++
  } else {
    feedback.textContent = pts < 0
      ? `✗ Mauvaise réponse ! ${pts} points. Bonne réponse : ${q.bonne_reponse}`
      : `✗ Mauvaise réponse ! Bonne réponse : ${q.bonne_reponse}`
    feedback.className = "feedback-wrong"
  }

  await fetch(`${API}/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ joueur_id: joueur.id, question_id: q.id, points: pts })
  })

  if (qIndex >= questions.length - 1) {
    setTimeout(finirJeu, 1500)
  } else {
    document.getElementById("btn-suivant").style.display = "block"
  }
}

function suivant() {
  qIndex++
  afficherQuestion()
}

async function finirJeu() {
  await fetch(`${API}/joueurs/${joueur.id}/score`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score: joueur.score })
  })

  document.getElementById("score-final").textContent =
    `${joueur.score} pts (${bonnes}/${questions.length} bonnes réponses)`

  const res = await fetch(`${API}/classement`)
  const classement = await res.json()

  const tableau = document.getElementById("tableau-classement")
  tableau.innerHTML = `
    <tr><th>Rang</th><th>Nom</th><th>Classe</th><th>Score</th></tr>
  `

  if (!classement || classement.length === 0) {
    tableau.innerHTML += `<tr><td colspan="4">Pas encore de classement</td></tr>`
  } else {
    classement.forEach((j, i) => {
      tableau.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${j.nom}</td>
          <td>${j.classe}</td>
          <td>${j.score} pts</td>
        </tr>
      `
    })
  }

  afficherEcran("ecran-3")
}

function rejouer() {
  joueur = { nom: "", classe: "", score: 0 }
  qIndex = 0
  bonnes = 0
  document.getElementById("form-personnage").reset()
  afficherEcran("ecran-1")
}
