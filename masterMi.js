
const DEBUG = false;

function genererCombinaisonSecrete() {
  const comb = [];
  for (let i = 0; i < 4; i++) comb.push(Math.floor(Math.random() * 6) + 1);
  return comb;
}

(function init() {
  const form = document.getElementById('formProposition');
  const input = document.getElementById('proposition');
  const historiqueEl = document.getElementById('historique');
  const btnNouvellePartie = document.getElementById('btnNouvellePartie');

  if (!form || !input || !historiqueEl || !btnNouvellePartie) {
    console.error("Élément DOM introuvable — vérifie les IDs dans index.html");
    return;
  }

  let combinaisonSecrete = genererCombinaisonSecrete();
  if (DEBUG) console.log("DEBUG combinaison secrète :", combinaisonSecrete.join(""));

  function saisieValide(s) {
    return /^[1-6]{4}$/.test(s);
  }

  function ajouterHistorique(texte, statut) {
    const li = document.createElement('li');
    li.textContent = texte + " — " + new Date().toLocaleTimeString();
    li.className = statut === 'OK' ? 'ok' : 'ko';
    historiqueEl.appendChild(li);
    li.scrollIntoView({ block: "end" });
  }


  form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("submit capturé");

    const proposition = input.value.trim();
    console.log("saisie:", proposition);

    if (!saisieValide(proposition)) {
      alert("Veuillez entrer 4 chiffres entre 1 et 6 (ex: 1234).");
      input.focus();
      return;
    }

    if (proposition === combinaisonSecrete.join("")) {
      ajouterHistorique(" Bonne combinaison : " + proposition, 'OK');
      alert("Bravo ! Vous avez trouvé la combinaison.");

    } else {
      ajouterHistorique(" Mauvaise combinaison : " + proposition, 'KO');
    }

    input.value = "";
    input.focus();
  });


  btnNouvellePartie.addEventListener('click', function () {
    combinaisonSecrete = genererCombinaisonSecrete();
    historiqueEl.innerHTML = "";
    input.value = "";
    input.focus();
    if (DEBUG) console.log("DEBUG nouvelle combinaison :", combinaisonSecrete.join(""));
  });


  input.focus();
})();
