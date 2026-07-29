const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

function initSite() {
    // Mobile menu toggle
    if (toggle && nav) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('open');
            toggle.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    if (nav) {
        document.addEventListener('click', (e) => {
            if (toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('open');
                toggle.classList.remove('active');
            }
        });
    }

    // Reveal animations
    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(el => observer.observe(el));
    } else {
        revealItems.forEach(el => el.classList.add('visible'));
    }

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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSite);
} else {
    initSite();
}