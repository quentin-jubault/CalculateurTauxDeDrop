// Liste des items avec leurs taux de drop
const items = [
    { name: 'Dofus Émeraude (Dark Vlad)', rate: 0.1 },
    { name: 'Dofus Émeraude (Dopeul Dark Vlad / Bandit de Cania)', rate: 0.05 },
    { name: 'Dofus Pourpre', rate: 0.01 },
    { name: 'Dofus Ivoire', rate: 0.01 },
    { name: 'Dofus Ébène', rate: 0.01 },
    { name: 'Dofus Turquoise (Dragon Cochon)', rate: 0.02 },
    { name: 'Dofus Turquoise (Chêne Mou)', rate: 0.01 },
    { name: 'Dofus Tacheté', rate: 0.01 },
    { name: 'Dofus Vulbis', rate: 0.001 },
    { name: 'Dévoreur', rate: 0.5 },
];

// Variables d'état
let selectedItem = null;
let baseDropRate = 0;
let hasChallenge = null;

// Éléments DOM
const itemSelect = document.getElementById('itemSelect');
const prospectionInput = document.getElementById('prospectionInput');
const challengeYesBtn = document.getElementById('challengeYes');
const challengeNoBtn = document.getElementById('challengeNo');
const challengeBonusSection = document.getElementById('challengeBonusSection');
const challengeBonusInput = document.getElementById('challengeBonusInput');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const personalRateEl = document.getElementById('personalRate');
const finalRateEl = document.getElementById('finalRate');
const dropRatioEl = document.getElementById('dropRatio');
const challengeFormula = document.getElementById('challengeFormula');

// Éléments Coffre
const chestCheckbox = document.getElementById('chestCheckbox');
const chestDetailsSection = document.getElementById('chestDetailsSection');
const launcherLevelInput = document.getElementById('launcherLevelInput');
const combatProspectionInput = document.getElementById('combatProspectionInput');
const chestResultsSection = document.getElementById('chestResultsSection');
const chestProspectionEl = document.getElementById('chestProspection');
const chestPersonalRateEl = document.getElementById('chestPersonalRate');
const chestFinalRateEl = document.getElementById('chestFinalRate');

// Initialisation : Remplir la liste déroulante
function initializeItemSelect() {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} (Taux: ${item.rate}%)`;
        itemSelect.appendChild(option);
    });
}

// Gestion de la sélection d'item
itemSelect.addEventListener('change', (e) => {
    selectedItem = e.target.value;
    const item = items.find(i => i.name === selectedItem);
    baseDropRate = item ? item.rate : 0;
    resultsSection.style.display = 'none';
});

// Gestion des boutons challenge
challengeYesBtn.addEventListener('click', () => {
    hasChallenge = true;
    challengeYesBtn.classList.add('active-yes');
    challengeYesBtn.classList.remove('active-no');
    challengeNoBtn.classList.remove('active-yes', 'active-no');
    challengeBonusSection.style.display = 'block';
    resultsSection.style.display = 'none';
});

challengeNoBtn.addEventListener('click', () => {
    hasChallenge = false;
    challengeNoBtn.classList.add('active-no');
    challengeNoBtn.classList.remove('active-yes');
    challengeYesBtn.classList.remove('active-yes', 'active-no');
    challengeBonusSection.style.display = 'none';
    challengeBonusInput.value = '';
    resultsSection.style.display = 'none';
});

// Gestion de la checkbox coffre
chestCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        chestDetailsSection.style.display = 'block';
    } else {
        chestDetailsSection.style.display = 'none';
        chestResultsSection.style.display = 'none';
        launcherLevelInput.value = '';
        combatProspectionInput.value = '';
    }
});

// Fonction de calcul
function calculateDrop() {
    // Validation des inputs
    if (!selectedItem || selectedItem === '') {
        alert('⚠️ Veuillez sélectionner un item');
        return;
    }

    const prospection = parseFloat(prospectionInput.value);
    if (!prospection || prospection < 0) {
        alert('⚠️ Veuillez entrer une valeur de prospection valide');
        return;
    }

    if (hasChallenge === null) {
        alert('⚠️ Veuillez indiquer si vous avez un challenge actif');
        return;
    }

    if (hasChallenge) {
        const challengeBonus = parseFloat(challengeBonusInput.value);
        if (!challengeBonus || challengeBonus < 0) {
            alert('⚠️ Veuillez entrer un bonus de challenge valide');
            return;
        }
    }

    // Validation des inputs coffre si activé
    if (chestCheckbox.checked) {
        const launcherLevel = parseFloat(launcherLevelInput.value);
        const combatProspection = parseFloat(combatProspectionInput.value);
        
        if (!launcherLevel || launcherLevel < 1 || launcherLevel > 200) {
            alert('⚠️ Veuillez entrer un niveau de lanceur valide (1-200)');
            return;
        }
        
        if (combatProspection === null || combatProspection === undefined || combatProspection < 0) {
            alert('⚠️ Veuillez entrer une prospection acquise valide (minimum 0)');
            return;
        }
    }

    // Calcul du taux de drop du personnage
    let finalRate = 0;
    let personalDropRate = 0;

    if (hasChallenge) {
        const challengeBonus = parseFloat(challengeBonusInput.value);
        // Formule avec challenge: (Taux de base + (bonus% × Taux de base) / 100) × (Prospection/100)
        const itemRateWithChallenge = baseDropRate + (challengeBonus * baseDropRate) / 100;
        finalRate = itemRateWithChallenge * (prospection / 100);
        personalDropRate = baseDropRate * (prospection / 100);
    } else {
        // Formule sans challenge: Taux de base × (Prospection/100)
        finalRate = baseDropRate * (prospection / 100);
        personalDropRate = finalRate;
    }

    // Affichage des résultats du personnage
    displayResults(personalDropRate, finalRate);

    // Calcul du coffre si activé
    if (chestCheckbox.checked) {
        calculateChestDrop();
    }
}

// Fonction de calcul du coffre
function calculateChestDrop() {
    const launcherLevel = parseFloat(launcherLevelInput.value);
    const combatProspection = parseFloat(combatProspectionInput.value);
    
    // Calcul de la prospection du coffre: 100 (base) + Niveau + PP acquise
    const chestProspection = 100 + launcherLevel + combatProspection;
    
    // Calcul du taux de drop du coffre
    let chestFinalRate = 0;
    let chestPersonalRate = 0;

    if (hasChallenge) {
        const challengeBonus = parseFloat(challengeBonusInput.value);
        // Formule avec challenge pour le coffre
        const itemRateWithChallenge = baseDropRate + (challengeBonus * baseDropRate) / 100;
        chestFinalRate = itemRateWithChallenge * (chestProspection / 100);
        chestPersonalRate = baseDropRate * (chestProspection / 100);
    } else {
        // Formule sans challenge pour le coffre
        chestFinalRate = baseDropRate * (chestProspection / 100);
        chestPersonalRate = chestFinalRate;
    }

    // Affichage des résultats du coffre
    displayChestResults(chestProspection, chestPersonalRate, chestFinalRate);
}

// Affichage des résultats
function displayResults(personalRate, finalRate) {
    personalRateEl.textContent = (personalRate).toFixed(4) + '%';
    finalRateEl.textContent = (finalRate).toFixed(4) + '%';
    
    resultsSection.style.display = 'block';
    
    // Afficher la formule adaptée
    if (hasChallenge) {
        challengeFormula.style.display = 'block';
    } else {
        challengeFormula.style.display = 'none';
    }
    
    // Scroll vers les résultats (avec délai pour l'animation)
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Affichage des résultats du coffre
function displayChestResults(chestProspection, personalRate, finalRate) {
    chestProspectionEl.textContent = Math.round(chestProspection);
    chestPersonalRateEl.textContent = (personalRate).toFixed(4) + '%';
    chestFinalRateEl.textContent = (finalRate).toFixed(4) + '%';
    
    chestResultsSection.style.display = 'block';
    
    // Scroll vers les résultats du coffre
    setTimeout(() => {
        chestResultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

// Fonction de réinitialisation
function reset() {
    itemSelect.value = '';
    prospectionInput.value = '';
    challengeBonusInput.value = '';
    selectedItem = null;
    baseDropRate = 0;
    hasChallenge = null;
    
    challengeYesBtn.classList.remove('active-yes', 'active-no');
    challengeNoBtn.classList.remove('active-yes', 'active-no');
    challengeBonusSection.style.display = 'none';
    resultsSection.style.display = 'none';
    challengeFormula.style.display = 'none';
    
    // Reset coffre
    chestCheckbox.checked = false;
    chestDetailsSection.style.display = 'none';
    chestResultsSection.style.display = 'none';
    launcherLevelInput.value = '';
    combatProspectionInput.value = '';
}

// Event listeners
calculateBtn.addEventListener('click', calculateDrop);
resetBtn.addEventListener('click', reset);

// Permettre le calcul avec la touche Entrée
prospectionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateDrop();
    }
});

challengeBonusInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateDrop();
    }
});

launcherLevelInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateDrop();
    }
});

combatProspectionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateDrop();
    }
});

// Initialisation au chargement
initializeItemSelect();
