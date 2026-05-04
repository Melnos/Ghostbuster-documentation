# Cahier des Charges - Algorithme PID (Robot Suiveur de Ligne)

## 1. Contexte et Objectif
Le projet **GhostBuster** consiste en la conception et la programmation d'un robot autonome suiveur de ligne et éviteur d'obstacles. L'algorithme principal de suivi de ligne reposera sur un contrôleur **PID (Proportionnel, Intégral, Dérivé)** pour garantir une trajectoire fluide, rapide et précise.

* **Objectif Principal :** Assurer que le centre du robot chevauche en permanence la ligne noire avec un temps de réponse minimal face aux courbes.

## 2. Périphériques Impliqués
* **Entrées :** Matrice de capteurs Infrarouges (ex: barrette de 8 capteurs TCRT5000). Les capteurs fourniront une valeur pondérée de l'erreur (ex: de -4 à +4, 0 étant le centre parfait).
* **Traitement :** Microcontrôleur ESP32 (calculs en temps réel avec boucle d'asservissement rapide).
* **Sorties :** Signal PWM (Pulse Width Modulation) envoyé au pont en H pour contrôler séparément la vitesse des moteurs DC gauche et droit (Motor A et Motor B).

## 3. Spécifications de l'Algorithme PID

### 3.1. Calcul de l'Erreur $(E)$
L'erreur est la différence entre la position actuelle de la ligne lue par les capteurs et la position cible (consigne = 0).
* Si le capteur extrême gauche détecte la ligne : $E = -4$
* Si le capteur extrême droit détecte la ligne : $E = +4$
* Si les deux capteurs centraux détectent la ligne : $E = 0$

### 3.2. Terme Proportionnel $(P)$
* **Rôle :** Corriger l'erreur instantanée.
* **Formule :** $P = K_p \times E$
* **Impact :** Plus le robot s'éloigne de la ligne, plus la correction est forte vers le centre.

### 3.3. Terme Intégral $(I)$
* **Rôle :** Corriger les erreurs cumulées (erreurs statiques) passées (ex: robot légèrement décalé en permanence sur une longue courbe).
* **Formule :** $I = I + (K_i \times E)$
* **Sécurité :** L'intégrale doit être bornée (clamping) pour éviter l'emballement (windup).

### 3.4. Terme Dérivé $(D)$
* **Rôle :** Anticiper les erreurs en fonction de la vitesse de variation (freinage).
* **Formule :** $D = K_d \times (E - E_{prec})$
* **Impact :** Atténue les oscillations brusques provoquées par le terme $P$ en "adoucissant" les re-centrages.

### 3.5. Calcul de la Correction Totale
$Correction = P + I + D$

## 4. Ajustement des Moteurs
La vitesse de base (V_base) est fixée à l'avance.
* **Vitesse Moteur Gauche :** $V_{gauche} = V_{base} + Correction$
* **Vitesse Moteur Droit :** $V_{droit} = V_{base} - Correction$

*Contrainte :* Les vitesses des moteurs doivent être bornées entre 0 (ou vitesse max de recul) et 255 (PWM maximal).

## 5. Exigences de Calibrage et Performances
* **Fréquence d'exécution :** La boucle de calcul PID doit s'exécuter à intervalle régulier (idéalement via un Timer interrupt, ex: toutes les 1ms à 5ms).
* **Calibration :** Prévoir une phase de calibration des capteurs IR (min/max sur blanc et noir) à l'allumage pour s'adapter à la luminosité ambiante de la piste.
* **Gestion des Perte de Ligne :** Si aucun capteur ne voit de ligne, le robot devra se souvenir de la dernière erreur ($E_{prec}$) pour continuer à tourner dans le sens de la dernière détection jusqu'à retrouver la ligne.

## 6. Variables à Ajuster (Tuning)
Les valeurs $K_p$, $K_i$ et $K_d$ devront être calibrées expérimentalement sur piste (méthode de Ziegler-Nichols ou essais successifs empiriques).