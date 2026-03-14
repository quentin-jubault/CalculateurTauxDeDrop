// Liste des items avec leurs taux de drop
const items = [
    { name: 'Dofus Émeraude (Dark Vlad)', rate: 0.1 },
    { name: 'Dofus Émeraude (Dopeul Dark Vlad / Bandit de Cania)', rate: 0.05 },
    { name: 'Dofus Ivoire', rate: 0.01 },
    { name: 'Dofus Ébène', rate: 0.01 },
    { name: 'Dofus Turquoise (Dragon Cochon)', rate: 0.02 },
    { name: 'Dofus Turquoise (Chêne Mou)', rate: 0.01 },
    { name: 'Dofus Tacheté', rate: 0.01 },
    { name: 'Dofus Vulbis', rate: 0.001 }
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

 // Calcul du taux de drop
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

    // Affichage des résultats
    displayResults(personalDropRate, finalRate);
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

// Initialisation au chargement
initializeItemSelect();
