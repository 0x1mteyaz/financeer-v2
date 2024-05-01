document.addEventListener('DOMContentLoaded', function() {
    updateNetValue(); // Initial calculation and update

    // Event listeners to update net value when incomes or outgoings change
    document.addEventListener('incomesUpdated', updateNetValue);
    document.addEventListener('outgoingsUpdated', updateNetValue);
});

function updateNetValue() {
    const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const outgoings = JSON.parse(localStorage.getItem('outgoings')) || [];

    // Calculate total income
    const totalIncome = incomes.reduce((sum, record) => sum + parseFloat(record.amount), 0);

    // Calculate total outgoings
    const totalOutgoings = outgoings.reduce((sum, record) => sum + parseFloat(record.amount), 0);

    // Calculate net value
    const netValue = totalIncome - totalOutgoings;

    // Display net value
    document.getElementById('netValue').textContent = `$${netValue.toFixed(2)}`;
}
