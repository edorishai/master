# master



Mastermind est un mini-jeu web , développé en HTML, CSS et JavaScript.  
Le but du jeu est de deviner une combinaison secrète de chiffres (entre 1 et 6) en un nombre limité de tentatives, selon la difficulté choisie.  
Chaque tentative affiche le nombre de chiffres bien placés et mal placés.


**Fonctionnalités principales**

 **Choix de la difficulté :**  
- Facile → 4 chiffres, 10 tentatives  
- Moyen → 5 chiffres, 8 tentatives  
- Difficile → 6 chiffres, 6 tentatives  
- Hardcorp → 7 chiffres, 5 tentatives  
- God Mode → 8 chiffres, 4 tentatives

   pour cela on utilise les fonctions getParamsDifficulte(), updateMaxLength(), selectDifficulte.addEventListener
  La fonction getParamsDifficulte() définit pour chaque niveau :

- la longueur de la combinaison (maxLength)

- le nombre maximum de tentatives (maxAttempts)


 **Validation automatique :** 
 - creation du code secret a deviné et cela aléatoirement  

on le fait grace a la fontion genererCombinaisonSecrete()
qui crée une combinaison secrète aléatoire de chiffres (entre 1 et 6) selon la longueur déterminée par la difficulté.
Chaque chiffre est généré par Math.floor(Math.random() * 6) + 1.
Cette combinaison est stockée dans la variable combinaisonSecrete et comparée à chaque proposition du joueur.


 **Validation automatique :**  
- Le champ d’entrée s’adapte automatiquement selon la difficulté (taille du code à saisir).  
- Seules les combinaisons valides sont acceptées .

  c est fait par les fonctions
  La fonction updateMaxLength() ajuste automatiquement :

- la longueur du champ de saisie (maxlength)

- Un changement de difficulté déclenche une nouvelle partie via resetPartie().

saisieValide(s)
- qui vérifie que la saisie du joueur correspond à une suite exacte de chiffres valides :

- uniquement des chiffres de 1 à 6

- avec la longueur imposée par la difficulté

  
 **nouvelle partie :**  
- possibiliter de lancer une nouvelle partie sans finir la partie en cours.
 avec btnNouvellePartie.addEventListener('click', …)



 **Affichage dynamique de l’historique :**  
- Chaque essai est numéroté (#1, #2, …)  
- Le joueur voit pour chaque tentative :
  - Le nombre de chiffres **bien placés**
  - Le nombre de chiffres **mal placés**
    
avce ajouterHistoriqueAvecNumero(num, proposition, bienPlaces, malPlaces, gagne), afficherSolutionDansHistorique(secretStr)


Chaque tentative valide est ajoutée sous forme de nouvelle ligne (<li>) dans la liste HTML historique.
L’historique montre :

le numéro d’essai (#1, #2, …)

la proposition du joueur

le résultat (bien placés / mal placés)

et, si victoire, le message Gagné

En cas de défaite, afficherSolutionDansHistorique() ajoute la solution secrète à la fin de la liste avant de redémarrer le jeu.

 **Détection de victoire et de défaite :**  
- En cas de victoire : message de félicitations et remise à zéro automatique  
- En cas d’échec : la combinaison secrète est révélée avant le redémarrage d’une nouvelle partie

   les fonction Fonctions,form.addEventListener('submit', …) , resetPartie() sont utiliser pour que 

Chaque validation de formulaire (submit) :

- Vérifie la saisie (saisieValide)

- Incrémente le compteur nb_essaies

- Compare la proposition au secret

- Met à jour l’historique

- Vérifie les conditions de fin de partie :


resetPartie() vide l’historique, remet le compteur à zéro et génère une nouvelle combinaison.

 **Compteur de parties jouées :**  
- Le nombre total de parties (gagnées ou perdues) est conservé même après rechargement de la page (grâce au `localStorage`).
on utilise les fontion donc:

incrementerCompteurParties()

chargerCompteurParties()
Pour qu a chaque fois qu’une partie se termine (gagnée ou perdue), le compteur de parties est augmenté.
Les données sont sauvegardées dans le localStorage du navigateur, ce qui permet de conserver le total de parties même après un rechargement de la page.





