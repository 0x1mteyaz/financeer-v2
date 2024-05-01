document.getElementById('expandButton').addEventListener('click', function() {
    document.getElementById('goalForm').classList.toggle('visible');
});

document.addEventListener('DOMContentLoaded', function() {
    const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
    savedCards.forEach(card => {
        createCard(card.goalName, card.goalAmount, card.currentAmount || 0, card.backgroundImage || '');
    });
    updateNetValue();
});

document.getElementById('goalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const goalName = document.getElementById('goalName').value;
    const goalAmount = parseFloat(document.getElementById('goalAmount').value);

    createCard(goalName, goalAmount, 0, '');
    saveCard(goalName, goalAmount, 0, '');

    this.reset();
    document.getElementById('expandButton').classList.remove('hidden');
});

function createCard(goalName, goalAmount, currentAmount = 0, backgroundImage = '') {
    const card = document.createElement('div');
    card.className = 'card';
    if (backgroundImage) {
        card.style.backgroundImage = `url(${backgroundImage})`;
        card.style.backgroundSize = 'cover';
    }

    const progressPercentage = currentAmount >= goalAmount ? 100 : (currentAmount / goalAmount * 100).toFixed(1);
    const progressClass = progressPercentage >= 66 ? 'green' : progressPercentage >= 33 ? 'amber' : 'red';

    card.innerHTML = `
        <h3>${goalName}</h3>
        <p>Goal: $${goalAmount.toFixed(2)}, Raised: $${currentAmount.toFixed(2)}</p>
        <div class="progress-text ${progressClass}">${progressPercentage}% towards goal</div>
        <input type="number" placeholder="Amount" min="0" style="width: 100%;">
        <button onclick="addFunds('${goalName}', this.previousElementSibling.value)">Add Funds</button>
        <button onclick="reduceFunds('${goalName}', this.previousElementSibling.value)">Reduce Funds</button>
        <button onclick="changeBackground('${goalName}', prompt('Enter image URL'))">Set Background</button>
    `;

    document.querySelector('.main-container .pie-chart').appendChild(card);
    addCardControls(goalName, card);
}

function addCardControls(goalName, card) {
    const controls = document.createElement('div');
    controls.innerHTML = `<strong>${goalName}</strong> - `;
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Visibility';
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    controls.appendChild(toggleBtn);
    controls.appendChild(deleteBtn);
    document.querySelector('.card-controls').appendChild(controls);

    toggleBtn.addEventListener('click', () => {
        const allCards = document.querySelectorAll('.main-container .pie-chart .card');
        allCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('visible')) {
                otherCard.classList.remove('visible');
            }
        });
        card.classList.toggle('visible');
    });

    deleteBtn.addEventListener('click', () => {
        const cards = JSON.parse(localStorage.getItem('cards'));
        const filteredCards = cards.filter(c => c.goalName !== goalName);
        localStorage.setItem('cards', JSON.stringify(filteredCards));
        card.remove();
        controls.remove();
    });
}

function addFunds(goalName, amount) {
    const amountFloat = parseFloat(amount);
    const netValue = calculateNetValue();

    if (netValue < amountFloat) {
        alert("Not enough available funds.");
        return;
    }

    updateNetValueWithChange(-amountFloat);
    updateFunds(goalName, amountFloat);
}

function reduceFunds(goalName, amount) {
    const amountFloat = parseFloat(amount);
    updateNetValueWithChange(amountFloat);
    updateFunds(goalName, -amountFloat);
}

function updateNetValueWithChange(change) {
    const netValue = calculateNetValue() + change;
    localStorage.setItem('netValue', JSON.stringify(netValue));
    document.getElementById('netValue').textContent = `$${netValue.toFixed(2)}`;
}

function updateFunds(goalName, amount) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    const card = cards.find(c => c.goalName === goalName);
    if (card) {
        card.currentAmount += amount;
        localStorage.setItem('cards', JSON.stringify(cards));
        updateCardDisplay(goalName);
    }
}

function calculateNetValue() {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const outgoings = JSON.parse(localStorage.getItem('outgoings')) || [];
    const totalIncome = incomes.reduce((sum, record) => sum + parseFloat(record.amount), 0);
    const totalOutgoings = outgoings.reduce((sum, record) => sum + parseFloat(record.amount), 0);
    return totalIncome - totalOutgoings;
}

function changeBackground(goalName, imageUrl) {
    const cards = JSON.parse(localStorage.getItem('cards'));
    const card = cards.find(c => c.goalName === goalName);
    if (card && imageUrl) {
        card.backgroundImage = imageUrl;
        localStorage.setItem('cards', JSON.stringify(cards));
        updateCardDisplay(goalName);
    }
}

function updateCardDisplay(goalName) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.querySelector('h3').textContent === goalName) {
            const data = JSON.parse(localStorage.getItem('cards')).find(c => c.goalName === goalName);
            card.style.backgroundImage = `url(${data.backgroundImage})`;
            card.style.backgroundSize = 'cover';
            card.querySelector('p').textContent = `Goal: $${data.goalAmount.toFixed(2)}, Raised: $${data.currentAmount.toFixed(2)}`;
            const progressPercentage = (data.currentAmount / data.goalAmount * 100).toFixed(1);
            const progressClass = progressPercentage >= 66 ? 'green' : progressPercentage >= 33 ? 'amber' : 'red';
            card.querySelector('.progress-text').className = `progress-text ${progressClass}`;
            card.querySelector('.progress-text').textContent = `${progressPercentage}% towards goal`;
        }
    });
}
