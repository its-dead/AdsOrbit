const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

// Mobile menu toggle
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// Reveal animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Smooth scroll WITHOUT hash in URL
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // close mobile nav after click (optional but good UX)
        nav?.classList.remove('open');
    });
});

// Handle direct access like /#work then remove hash cleanly
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);

        if (target) {
            target.scrollIntoView({ behavior: 'auto' });
        }

        history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search
        );
    }
});