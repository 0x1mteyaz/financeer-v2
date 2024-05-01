document.addEventListener('DOMContentLoaded', function() {
    // Initialize pie charts
    const incomeCtx = document.getElementById('incomeChart').getContext('2d');
    const outgoingCtx = document.getElementById('outgoingsChart').getContext('2d');

    let incomeChartInstance;
    let outgoingChartInstance;

    function updateCharts() {
        updateIncomeChart();
        updateOutgoingChart();
    }

    function updateIncomeChart() {
        const incomes = JSON.parse(localStorage.getItem('incomes')) || [];
        if (incomeChartInstance) {
            incomeChartInstance.destroy();
        }
        incomeChartInstance = new Chart(incomeCtx, {
            type: 'pie',
            data: {
                labels: incomes.map(income => income.name),
                datasets: [{
                    data: incomes.map(income => income.amount),
                    backgroundColor: incomes.map(() => randomColor()),
                    hoverOffset: 4
                }]
            },
            options: chartOptions('Income Distribution')
        });
    }

    function updateOutgoingChart() {
        const outgoings = JSON.parse(localStorage.getItem('outgoings')) || [];
        if (outgoingChartInstance) {
            outgoingChartInstance.destroy();
        }
        outgoingChartInstance = new Chart(outgoingCtx, {
            type: 'pie',
            data: {
                labels: outgoings.map(outgoing => outgoing.name),
                datasets: [{
                    data: outgoings.map(outgoing => outgoing.amount),
                    backgroundColor: outgoings.map(() => randomColor()),
                    hoverOffset: 4
                }]
            },
            options: chartOptions('Outgoings Distribution')
        });
    }

    function randomColor() {
        return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    }

    function chartOptions(title) {
        return {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        };
    }

    // Listen to custom events for data updates
    document.addEventListener('incomesUpdated', updateIncomeChart);
    document.addEventListener('outgoingsUpdated', updateOutgoingChart);

    // Initial chart updates
    updateCharts();
});
