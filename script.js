const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Remove the hash from the URL after navigating to a section
window.addEventListener('hashchange', () => {
    setTimeout(() => {
        history.replaceState(null, '', window.location.pathname);
    }, 50);
});