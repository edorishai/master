

const DEBUG = false;

(function init() {
  const form = document.getElementById('formProposition');
  const input = document.getElementById('proposition');
  const historiqueEl = document.getElementById('historique');
  const btnNouvellePartie = document.getElementById('btnNouvellePartie');
  const selectDifficulte = document.getElementById('difficulte');
  const compteurEl = document.getElementById('compteurParties'); 

  if (!form || !input || !historiqueEl || !btnNouvellePartie || !selectDifficulte || !compteurEl) {
    console.error("Élément DOM manquant : vérifie que #compteurParties est présent dans ton HTML.");
    return;
  }

  let nb_essaies = 0;
  let gamesCompleted = parseInt(localStorage.getItem('gamesCompleted') || '0', 10);

  function updateCompteurAffichage() {
    compteurEl.textContent = `Nombre de parties jouées : ${gamesCompleted}`;
  }

  updateCompteurAffichage();

  function getParamsDifficulte() {
    let maxLength = 4;
    let maxAttempts = 10;
    switch (selectDifficulte.value) {
      case 'facile': maxLength = 4; maxAttempts = 10; break;
      case 'moyen': maxLength = 5; maxAttempts = 8; break;
      case 'difficile': maxLength = 6; maxAttempts = 6; break;
      case 'hardcorp': maxLength = 7; maxAttempts = 5; break;
      case 'god': maxLength = 8; maxAttempts = 4; break;
    }
    return { maxLength, maxAttempts };
  }

  function updateMaxLength() {
    const { maxLength } = getParamsDifficulte();
    input.maxLength = maxLength;
    input.placeholder = `ex: ${'1'.repeat(maxLength)}`;
  }

  updateMaxLength();

  selectDifficulte.addEventListener('change', () => {
    updateMaxLength();
    resetPartie();
  });

  function genererCombinaisonSecrete() {
    const { maxLength } = getParamsDifficulte();
    const comb = [];
    for (let i = 0; i < maxLength; i++) comb.push(Math.floor(Math.random() * 6) + 1);
    return comb;
  }

  let combinaisonSecrete = genererCombinaisonSecrete();
  if (DEBUG) console.log("DEBUG - secret:", combinaisonSecrete.join(""));

  function saisieValide(s) {
    const { maxLength } = getParamsDifficulte();
    const regex = new RegExp(`^[1-6]{${maxLength}}$`);
    return regex.test(s);
  }

  function comparerProposition(secretArr, propositionStr) {
    const propArr = propositionStr.split('').map(ch => parseInt(ch, 10));
    let bienPlaces = 0;
    const secretRest = [];
    const propRest = [];

    for (let i = 0; i < secretArr.length; i++) {
      if (propArr[i] === secretArr[i]) bienPlaces++;
      else {
        secretRest.push(secretArr[i]);
        propRest.push(propArr[i]);
      }
    }

    let malPlaces = 0;
    const counts = {};
    for (const v of secretRest) counts[v] = (counts[v] || 0) + 1;
    for (const v of propRest) {
      if (counts[v] && counts[v] > 0) {
        malPlaces++;
        counts[v]--;
      }
    }

    return { bienPlaces, malPlaces };
  }

  function ajouterHistoriqueAvecNumero(num, proposition, bienPlaces, malPlaces, gagne) {
    const li = document.createElement('li');
    li.className = gagne ? 'ok' : 'ko';
    li.innerHTML = `<strong>#${num} — ${proposition}</strong>
      <div class="result-details">
        bien placés : <strong>${bienPlaces}</strong> — mal placés : <strong>${malPlaces}</strong>
        ${gagne ? ' — <em>Gagné 🎉</em>' : ''}
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
    nb_essaies = 0;
    combinaisonSecrete = genererCombinaisonSecrete();
    if (DEBUG) console.log("Nouvelle combinaison :", combinaisonSecrete.join(""));
    input.value = "";
    input.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const proposition = input.value.trim();

    if (!saisieValide(proposition)) {
      const { maxLength } = getParamsDifficulte();
      alert(`Saisie invalide — entrez ${maxLength} chiffres entre 1 et 6.`);
      input.focus();
      return;
    }

    nb_essaies++;
    const resultat = comparerProposition(combinaisonSecrete, proposition);
    const gagne = resultat.bienPlaces === combinaisonSecrete.length;
    ajouterHistoriqueAvecNumero(nb_essaies, proposition, resultat.bienPlaces, resultat.malPlaces, gagne);

    const { maxAttempts } = getParamsDifficulte();

    if (gagne) {
      gamesCompleted++;
      localStorage.setItem('gamesCompleted', gamesCompleted);
      updateCompteurAffichage();
      alert("Bravo ! Vous avez trouvé la combinaison : " + combinaisonSecrete.join(""));
      resetPartie();
      return;
    }

    if (nb_essaies >= maxAttempts) {
      gamesCompleted++;
      localStorage.setItem('gamesCompleted', gamesCompleted);
      updateCompteurAffichage();
      afficherSolutionDansHistorique(combinaisonSecrete.join(""));
      alert("Vous avez atteint le nombre maximum de tentatives.\nLa combinaison était : " + combinaisonSecrete.join(""));
      resetPartie();
      return;
    }

    input.value = "";
    input.focus();
  });

  btnNouvellePartie.addEventListener('click', function () {
    if (confirm("Voulez-vous recommencer ?")) {
      resetPartie();
    }
  });

  input.focus();

})();


