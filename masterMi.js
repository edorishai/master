
const MAX_ATTEMPTS = 10; // nombre max d'essais autorisés
const DEBUG = false;

function genererCombinaisonSecrete() {
  const comb = [];
  for (let i = 0; i < 4; i++) comb.push(Math.floor(Math.random() * 6) + 1);
  return comb; 
}


function comparerProposition(secretArr, propositionStr) {
  const propArr = propositionStr.split('').map(ch => parseInt(ch, 10));

  let bienPlaces = 0;
  const secretRest = []; 
  const propRest   = []; 

  for (let i = 0; i < 4; i++) {
    if (propArr[i] === secretArr[i]) {
      bienPlaces++;
    } else {
      secretRest.push(secretArr[i]);
      propRest.push(propArr[i]);
    }
  }


  let malPlaces = 0;
  const counts = {}; 
  for (const v of secretRest) {
    counts[v] = (counts[v] || 0) + 1;
  }
  for (const v of propRest) {
    if (counts[v] && counts[v] > 0) {
      malPlaces++;
      counts[v]--;
    }
  }

  return { bienPlaces, malPlaces };
}

(function init() {
  const DEBUG = false; 
  const form = document.getElementById('formProposition');
  const input = document.getElementById('proposition');
  const historiqueEl = document.getElementById('historique');
  const btnNouvellePartie = document.getElementById('btnNouvellePartie');

  if (!form || !input || !historiqueEl || !btnNouvellePartie) {
    console.error("Élément DOM introuvable — vérifie les IDs.");
    return;
  }

  let combinaisonSecrete = genererCombinaisonSecrete();
  if (DEBUG) console.log("DEBUG - secret:", combinaisonSecrete.join(""));

  function saisieValide(s) {
    return /^[1-6]{4}$/.test(s);
  }

  function ajouterHistorique(proposition, bienPlaces, malPlaces, gagne) {
    const li = document.createElement('li');
    li.className = gagne ? 'ok' : 'ko';
    li.innerHTML = `<strong>${proposition}</strong>
      <div class="result-details">
        bien placés : <strong>${bienPlaces}</strong> — mal placés : <strong>${malPlaces}</strong>
        ${gagne ? ' — <em>Gagné </em>' : ''}
      </div>`;
    historiqueEl.appendChild(li);
    li.scrollIntoView({ block: "end" });
  }

  function afficherSolutionDansHistorique(secretStr) {
    const li = document.createElement('li');
    li.className = 'solution';
    li.textContent = "💡 La combinaison secrète était : " + secretStr;
    historiqueEl.appendChild(li);
    li.scrollIntoView({ block: "end" });
  }

  function resetPartie() {
    historiqueEl.innerHTML = "";
    combinaisonSecrete = genererCombinaisonSecrete();
    if (DEBUG) console.log("DEBUG - nouvelle combinaison secrète :", combinaisonSecrete.join(""));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const proposition = input.value.trim();

    if (!saisieValide(proposition)) {
      alert("Saisie invalide — entrez 4 chiffres entre 1 et 6 (ex: 1234).");
      input.focus();
      return;
    }

    const resultat = comparerProposition(combinaisonSecrete, proposition);
    const gagne = resultat.bienPlaces === 4;
    ajouterHistorique(proposition, resultat.bienPlaces, resultat.malPlaces, gagne);

    if (gagne) {
      alert("Bravo ! Vous avez trouvé la combinaison : " + combinaisonSecrete.join("") + "\nVotre nombre de tentatives : " + historiqueEl.childElementCount);
      resetPartie();
      input.value = "";
      input.focus();
      return;
    }


    if (historiqueEl.childElementCount >= MAX_ATTEMPTS) {
      afficherSolutionDansHistorique(combinaisonSecrete.join(""));

      alert("Vous avez atteint le nombre maximum de tentatives.\nLa combinaison secrète était : " + combinaisonSecrete.join("") + "\nUne nouvelle partie va commencer.");


      resetPartie();
      input.value = "";
      input.focus();
      return;
    }


    input.value = "";
    input.focus();
  });


  btnNouvellePartie.addEventListener('click', function () {
    if (confirm("Voulez-vous vraiment commencer une nouvelle partie ? L'historique sera effacé.")) {
      resetPartie();
      input.value = "";
      input.focus();
    }
  });


  input.focus();

})();
