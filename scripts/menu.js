const toggleTag = document.querySelector('a.toggle-nav');
const sideNav = document.querySelector('.sidenav');

// when I click the toggle tag, toggle a class of open on the sidenav tag
// and if it's open, make the toggle tag say closed
// and if it's shut, make the toggle tag say open;

toggleTag.addEventListener('click', function () {
  sideNav.classList.toggle('open');

  if (sideNav.classList.contains('open')) {
    toggleTag.innerHTML = `<svg class="menu-icon" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.89954 7.07104L2.82849 0L0 2.82861L7.07104 9.89966L0.00012207 16.9705L2.82849 19.7988L9.89941 12.728L16.9706 19.7991L19.7991 16.9707L12.7279 9.89941L19.7991 2.82837L16.9707 0L9.89954 7.07104Z"/>
    </svg>
    `;
  } else {
    toggleTag.innerHTML = `<svg
    id ="closed-menu-icon"
    class="menu-icon"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="2" width="18" height="3" />
    <rect x="1" y="8" width="18" height="3" />
    <rect x="1" y="14" width="18" height="3" />
  </svg>`;
  }
});
