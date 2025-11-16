// main.js — general small scripts (placeholder for nav behavior)

// Example: highlight active nav link
(function(){
  const links = document.querySelectorAll('nav a');
  links.forEach(a=>{ if(location.pathname.endsWith(a.getAttribute('href'))) a.classList.add('active'); });
})();
