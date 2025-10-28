document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Control del Menú Móvil ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    if (menuButton) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            iconOpen.classList.toggle('hidden');
            iconClose.classList.toggle('hidden');
        });
    }

    // Cierra el menú móvil al hacer clic en un enlace
    const mobileLinks = document.querySelectorAll('.nav-link-mobile');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
                iconOpen.classList.remove('hidden');
                iconClose.classList.add('hidden');
            }
        });
    });

    // --- 2. Animación de Aparición (Fade-in) al hacer Scroll ---
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1 // El elemento se activa cuando es visible en un 10%
        });

        fadeInElements.forEach(el => observer.observe(el));
    } else {
        // Fallback para navegadores antiguos: simplemente muestra todo
        fadeInElements.forEach(el => el.classList.add('is-visible'));
    }

    // --- 3. Scroll-Spy (Resaltar enlace de navegación activo) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');

    const removeActiveClasses = () => {
        navLinks.forEach(link => link.classList.remove('nav-active'));
        mobileNavLinks.forEach(link => link.classList.remove('nav-active'));
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        let currentSectionId = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSectionId = entry.target.getAttribute('id');
            }
        });
        
        // Si hay una sección visible, actualiza los enlaces
        if (currentSectionId) {
            removeActiveClasses();
            document.querySelector(`.nav-link[data-section="${currentSectionId}"]`)?.classList.add('nav-active');
            document.querySelector(`.nav-link-mobile[data-section="${currentSectionId}"]`)?.classList.add('nav-active');
        }
    }, {
        rootMargin: "-50% 0px -50% 0px", // Activa cuando la sección está en el medio de la pantalla
        threshold: 0
    });

    sections.forEach(section => scrollSpyObserver.observe(section));
});