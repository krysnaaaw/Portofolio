// Toggle sidebar menu
const menuToggleBtn = document.getElementById('menuToggle');
const sidebar = document.querySelector('.bar-menu');

function toggleMenu() {
    const isOpen = sidebar.classList.toggle('muncul');
    menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

menuToggleBtn.addEventListener('click', toggleMenu);

// Close sidebar when clicking a link (UX)
document.querySelectorAll('.bar-menu a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('muncul');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for internal links (enhanced)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // focus after scroll for accessibility
            setTimeout(() => target.focus({ preventScroll: true }), 600);
        }
    });
});

// Scroll effect for header
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
});

// Animate skill bars when visible (staggered)
const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-fill');
            fills.forEach((bar, i) => {
                const width = bar.dataset.width || getComputedStyle(bar).getPropertyValue('--skill-width') || '50%';
                setTimeout(() => {
                    bar.style.width = width.trim();
                }, i * 140);
            });
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

// Observe each skill-card container
document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// Fade-in observer for elements with class .fade
const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.18 });

// Observe all .fade elements
document.querySelectorAll('.fade').forEach(el => fadeObserver.observe(el));

// Accessibility: enable keyboard toggle of menu (Enter / Space)
menuToggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});