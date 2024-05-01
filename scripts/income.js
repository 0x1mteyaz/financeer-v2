document.addEventListener('DOMContentLoaded', function() {
    const incomeForm = document.getElementById('incomeForm');
    const incomeTableBody = document.getElementById('incomeTableBody');
  
    incomeForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevents the default form submission behavior
  
      const incomeName = document.getElementById('incomeName').value;
      const incomeAmount = parseFloat(document.getElementById('incomeAmount').value);
      const incomeFrequency = document.getElementById('incomeFrequency').value;
  
      if (isNaN(incomeAmount)) {
        alert('Please enter a valid income amount.');
        return;
      }
  
      const income = {
        name: incomeName,
        amount: incomeAmount,
        frequency: incomeFrequency
      };
  
      saveIncome(income);
      displayIncome(income);
      incomeForm.reset();
    });
  
    function saveIncome(income) {
      let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
      incomes.push(income);
      localStorage.setItem('incomes', JSON.stringify(incomes));
      dispatchIncomeUpdateEvent();
    }
  
    function displayIncome(income) {
      const incomeRow = document.createElement('tr');
      incomeRow.innerHTML = `
        <td>${income.name}</td>
        <td>${income.amount}</td>
        <td>${income.frequency}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      incomeTableBody.appendChild(incomeRow);
  
      // Add event listener to the delete button
      const deleteButton = incomeRow.querySelector('.delete-btn');
      deleteButton.addEventListener('click', function() {
        deleteIncome(incomeRow);
      });
    }
    
    function calculateMonthlyIncome(amount, frequency) {
      switch (frequency) {
          case 'Weekly':
              return amount * 4; // Approximate the month as 4 weeks
          case 'Monthly':
              return amount; // Already monthly
          case 'Annually':
              return amount / 12; // Divide by 12 months
          default:
              return 0; // In case of undefined frequency or error
      }
  }
  function updateTotalMonthlyIncome() {
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    let totalMonthlyIncome = 0;
    
    incomes.forEach(income => {
        let monthlyIncome = calculateMonthlyIncome(income.amount, income.frequency);
        totalMonthlyIncome += monthlyIncome;
    });

    document.getElementById('totalMonthlyIncome').textContent = `$${totalMonthlyIncome.toFixed(2)}`;
  }
  

  function deleteIncome(row) {
    row.remove(); // Remove the row from the table
  
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const incomeName = row.querySelector('td').textContent;
    incomes = incomes.filter(income => income.name !== incomeName); // Filter out the income to remove
    localStorage.setItem('incomes', JSON.stringify(incomes));
    dispatchIncomeUpdateEvent();
  }
  
  function loadIncomes() {
    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    incomes.forEach(displayIncome);
  }
  function dispatchIncomeUpdateEvent() {
    document.dispatchEvent(new CustomEvent('incomesUpdated'));
  }
  loadIncomes();
  calculateMonthlyIncome();
  updateTotalMonthlyIncome();
});
  