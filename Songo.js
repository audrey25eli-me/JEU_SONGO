// le plateau en memoire
// chaque tableau représente les 7 fosses d'un joueur
let fosses = [
    [5,5,5,5,5,5,5], // joueur 1
    [5,5,5,5,5,5,5] // joueur 2
]
// Les greniers
let greniers = [0,0] //[joueur 1, joueur 2]

// Qui joue en  ce moment?(1 ou 2)
let joueurActuel = 1
console.log(fosses)
console.log(greniers)

function afficherPlateau() {
  // Pour chaque joueur (0 et 1)
  for (let j = 0; j < 2; j++) {

    // Récupère toutes les fosses de ce joueur
    let fossesHTML = document.querySelectorAll(
      `.fosse[data-joueur="${j + 1}"]`
    )

    // Met à jour chaque fosse
    for (let i = 0; i < 7; i++) {
      fossesHTML[i].querySelector("span").textContent = fosses[j][i]
    }
  }

  // Met à jour les greniers
  document.querySelector("#grenier-j1 span").textContent = greniers[0]
  document.querySelector("#grenier-j2 span").textContent = greniers[1]
}

// Appelle la fonction au démarrage
afficherPlateau()

// Récupère toutes les fosses
let toutesLesFosses = document.querySelectorAll(".fosse")

// Pour chaque fosse, on écoute le clic
toutesLesFosses.forEach(function(fosse) {

  fosse.addEventListener("click", function() {

    // On lit les infos de la fosse cliquée
    let joueur = parseInt(fosse.dataset.joueur)
    let index = parseInt(fosse.dataset.index)
    jouer(joueur, index)
  })

})

function jouer(joueur, index) {

  // Vérifie que c'est bien le tour de ce joueur
  if (joueur !== joueurActuel) return

  // Récupère le nombre de graines dans la fosse cliquée
  let graines = fosses[joueur - 1][index]

  // On ne peut pas jouer une fosse vide
  if (graines === 0) return

  // Vide la fosse cliquée
  fosses[joueur - 1][index] = 0

  // Position actuelle de distribution
  let j = joueur - 1  // 0 ou 1
  let i = index

  // Distribue les graines une par une
  while (graines > 0) {
    i++  // passe à la fosse suivante

    // Si on dépasse la dernière fosse (index 6)
    if (i > 6) {
      // Si c'est la rangée du joueur qui joue -­­> grenier
      if (j === joueur - 1) {
        greniers[joueur - 1]++
        graines--
        if (graines === 0) break
      }
      i = 0         // recommence à la fosse 0
      j = 1 - j    // change de rangée
    }

    // Dépose une graine
    fosses[j][i]++
    graines--
  }

  // Change de joueur
  joueurActuel = (joueurActuel === 1) ? 2 : 1

  if ( verifierFin()) return

  // Met à jour l'affichage
  afficherPlateau()
  // Affiche à qui c'est le tour
  document.getElementById("message").textContent = 
    "Tour du Joueur " + joueurActuel
}

function verifierFin() {

  // Additionne toutes les graines du joueur 1
  let totalJ1 = fosses[0].reduce(function(a, b) { return a + b }, 0)

  // Additionne toutes les graines du joueur 2
  let totalJ2 = fosses[1].reduce(function(a, b) { return a + b }, 0)

  // Si un côté est vide → fin de partie
  if (totalJ1 === 0 || totalJ2 === 0) {

    // Chaque joueur récupère les graines restantes
    greniers[0] += totalJ1
    greniers[1] += totalJ2

    // Vide toutes les fosses
    fosses[0] = [0,0,0,0,0,0,0]
    fosses[1] = [0,0,0,0,0,0,0]

    afficherPlateau()

    // Annonce le gagnant
    if (greniers[0] > greniers[1]) {
      document.getElementById("message").textContent = 
        "🏆 Joueur 1 gagne !"
    } else if (greniers[1] > greniers[0]) {
      document.getElementById("message").textContent = 
        "🏆 Joueur 2 gagne !"
    } else {
      document.getElementById("message").textContent = 
        "🤝 Égalité !"
    }

    return true  // la partie est finie
  }

  return false  // la partie continue
}

function rejouer() {
  fosses = [
    [5,5,5,5,5,5,5],
    [5,5,5,5,5,5,5]
  ]
  greniers = [0, 0]
  joueurActuel = 1
  document.getElementById("message").textContent = "Tour du Joueur 1"
  afficherPlateau()
}

document.getElementById("rejouer").addEventListener("click", rejouer)

toutesLesFosses.forEach(function(fosse) {
  let j = parseInt(fosse.dataset.joueur)
  if (j !== joueurActuel) {
    fosse.classList.add("inactive")
  } else {
    fosse.classList.remove("inactive")
  }
})