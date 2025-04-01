// Get the navigation toggle button and menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Add event listener to navigation toggle button
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});