const aboutLink = document.querySelector('.about-nav-link');
const aboutSection = document.querySelector('.about-section');
const closeAboutButton = document.querySelector('.close-about-icon');
const sideNav = document.querySelector('.sidenav');
const toggleTag = document.querySelector('a.toggle-nav');

toggleTag.addEventListener('click', () => {
  if (aboutSection.classList.contains('open')) {
    aboutSection.classList.remove('open');
  }
});

aboutLink.addEventListener('click', () => {
  aboutSection.classList.toggle('open');
});

closeAboutButton.addEventListener('click', () => {
  aboutSection.classList.toggle('open');
});
