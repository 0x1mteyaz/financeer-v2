document.addEventListener('DOMContentLoaded', function() {
    const incomeForm = document.getElementById('incomeForm');
    const incomeTableBody = document.getElementById('incomeTableBody');
    const outgoingForm = document.getElementById('outgoingForm');
    const outgoingTableBody = document.getElementById('outgoingTableBody');
  
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
        type: 'Income',
        name: incomeName,
        amount: incomeAmount,
        frequency: incomeFrequency
      };
  
      saveData(income, incomeTableBody);
      incomeForm.reset();
    });
  
    outgoingForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevents the default form submission behavior
  
      const outgoingName = document.getElementById('outgoingName').value;
      const outgoingAmount = parseFloat(document.getElementById('outgoingAmount').value);
      const outgoingFrequency = document.getElementById('outgoingFrequency').value;
  
      if (isNaN(outgoingAmount)) {
        alert('Please enter a valid outgoing amount.');
        return;
      }
  
      const outgoing = {
        type: 'Outgoing',
        name: outgoingName,
        amount: outgoingAmount,
        frequency: outgoingFrequency
      };
  
      saveData(outgoing, outgoingTableBody);
      outgoingForm.reset();
    });
  
    function saveData(data, tableBody) {
      let dataList = JSON.parse(localStorage.getItem('dataList')) || [];
      dataList.push(data);
      localStorage.setItem('dataList', JSON.stringify(dataList));
      displayData(data, tableBody);
    }
  
    function displayData(data, tableBody) {
      const dataRow = document.createElement('tr');
      dataRow.innerHTML = `
        <td>${data.type}</td>
        <td>${data.name}</td>
        <td>${data.amount}</td>
        <td>${data.frequency}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      tableBody.appendChild(dataRow);
  
      // Add event listener to the delete button
      const deleteButton = dataRow.querySelector('.delete-btn');
      deleteButton.addEventListener('click', function() {
        deleteData(dataRow);
      });
    }
  
    function deleteData(row) {
      row.remove(); // Remove the row from the table
  
      let dataList = JSON.parse(localStorage.getItem('dataList')) || [];
      const dataType = row.querySelector('td').textContent;
      const dataName = row.querySelector('td:nth-child(2)').textContent;
      dataList = dataList.filter(data => !(data.type === dataType && data.name === dataName)); // Filter out the data to remove
      localStorage.setItem('dataList', JSON.stringify(dataList));
    }
  
    function loadData() {
      let dataList = JSON.parse(localStorage.getItem('dataList')) || [];
      dataList.forEach(data => {
        if (data.type === 'Income') {
          displayData(data, incomeTableBody);
        } else if (data.type === 'Outgoing') {
          displayData(data, outgoingTableBody);
        }
      });
    }
  
    loadData();
  });