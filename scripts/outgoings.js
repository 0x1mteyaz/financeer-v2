document.addEventListener('DOMContentLoaded', function() {
    const outgoingForm = document.getElementById('outgoingForm');
    const outgoingTableBody = document.getElementById('outgoingTableBody');
  
    outgoingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevents the default form submission behavior
  
        const outgoingName = document.getElementById('outgoingName').value.trim();  // Trim whitespace
        const outgoingAmount = parseFloat(document.getElementById('outgoingAmount').value);
        const outgoingFrequency = document.getElementById('outgoingFrequency').value;
  
        if (isNaN(outgoingAmount) || outgoingAmount <= 0) {  // Ensure amount is a number and greater than zero
            alert('Please enter a valid outgoing amount.');
            return;
        }
  
        const outgoing = {
            name: outgoingName,
            amount: outgoingAmount,
            frequency: outgoingFrequency
        };
  
        saveOutgoing(outgoing);
        displayOutgoing(outgoing);
        outgoingForm.reset();
    });
  
    function saveOutgoing(outgoing) {
        let outgoings = JSON.parse(localStorage.getItem('outgoings')) || [];
        outgoings.push(outgoing);
        localStorage.setItem('outgoings', JSON.stringify(outgoings));
        dispatchDataUpdatedEvent('outgoingsUpdated');
    }
  
    function displayOutgoing(outgoing) {
        const outgoingRow = document.createElement('tr');
        outgoingRow.innerHTML = `
            <td>${outgoing.name}</td>
            <td>${outgoing.amount.toFixed(2)}</td>  
            <td>${outgoing.frequency}</td>
            <td><button class="delete-btn" data-name="${outgoing.name}">Delete</button></td>  
        `;
        outgoingTableBody.appendChild(outgoingRow);
    }

    outgoingTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const name = event.target.getAttribute('data-name');
            deleteOutgoing(name);
            event.target.closest('tr').remove();
            dispatchDataUpdatedEvent('outgoingsUpdated');
        }
    });

    function deleteOutgoing(outgoingName) {
        let outgoings = JSON.parse(localStorage.getItem('outgoings')) || [];
        outgoings = outgoings.filter(outgoing => outgoing.name !== outgoingName);
        localStorage.setItem('outgoings', JSON.stringify(outgoings));
        dispatchDataUpdatedEvent('outgoingsUpdated');
    }

    function loadOutgoings() {
        let outgoings = JSON.parse(localStorage.getItem('outgoings')) || [];
        outgoings.forEach(displayOutgoing);
    }

    function dispatchDataUpdatedEvent(eventName) {
        document.dispatchEvent(new CustomEvent(eventName));
    }

    loadOutgoings();
});
