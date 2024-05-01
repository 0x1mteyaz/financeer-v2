
const tabList = document.querySelector('.tabs');
const tabButtons = tabList.querySelectorAll('.tablink'); 
const tabContent = tabList.querySelectorAll('.tabcontent');

// Hide content on load
tabContent.forEach(item => {
  item.style.display = 'none';
}); 

// Handle tab click
const handleTabClick = e => {

  // Hide all tab content
  tabContent.forEach(item => {
    item.style.display = 'none';
  });

  // Remove active class from buttons
  tabButtons.forEach(item => {
    item.classList.remove('active'); 
  });

  // Show clicked tab content
  const tabName = e.target.dataset.tab;
  document.querySelector(`#${tabName}`).style.display = 'block';
  
  // Add active class to clicked button
  e.target.classList.add('active');

};

// Add event listeners 
tabButtons.forEach(item => {
  item.addEventListener('click', handleTabClick);
});