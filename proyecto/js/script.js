document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('a.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('back-to-top');
  const header = document.querySelector('header');

  // Manejo de la transparencia del header
  const handleHeaderTransparency = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderTransparency);
  handleHeaderTransparency(); // Llamada inicial

  // --- Menú móvil con animación y ARIA ---
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));

      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.remove('mobile-close');
        mobileMenu.classList.add('mobile-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
      } else {
        // play close animation then hide
        mobileMenu.classList.remove('mobile-open');
        mobileMenu.classList.add('mobile-close');
        mobileMenu.setAttribute('aria-hidden', 'true');
        setTimeout(() => mobileMenu.classList.add('hidden'), 220);
      }
    });

    // Cerrar menú móvil al hacer click en un enlace (mejor UX)
    mobileMenu.querySelectorAll('a.nav-link').forEach(a => {
      a.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
          menuBtn.setAttribute('aria-expanded', 'false');
          mobileMenu.classList.remove('mobile-open');
          mobileMenu.classList.add('mobile-close');
          setTimeout(() => mobileMenu.classList.add('hidden'), 220);
        }
      });
    });
  }

  // --- Scroll-Spy (IntersectionObserver) ---
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      let current = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) current = entry.target.id;
      });

      if (current) {
        navLinks.forEach(link => {
          const section = link.getAttribute('data-section') || link.getAttribute('href')?.replace('#','');
          if (section === current) {
            link.classList.add('active');
            link.classList.add('font-semibold');
            link.classList.add('text-primary');
          } else {
            link.classList.remove('active','font-semibold','text-primary');
          }
        });
      }
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }

  // --- Back to top ---
  if (backToTop) {
    const toggle = () => {
      if (window.scrollY > 420) backToTop.classList.remove('hidden');
      else backToTop.classList.add('hidden');
    };

    toggle();
    window.addEventListener('scroll', toggle);

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Copy-to-clipboard para datos de contacto ---
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.innerHTML;
        btn.innerHTML = 'Copiado ✓';
        btn.classList.add('bg-green-600');
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove('bg-green-600'); }, 1400);
      } catch (err) {
        console.error('No se pudo copiar', err);
      }
    });
  });

  // --- Animar timeline y elementos con fade-up ---
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  // Animar la línea del timeline (dibujado)
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineContainer && 'IntersectionObserver' in window) {
    const line = timelineContainer.querySelector('.timeline-line');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (line) line.classList.add('drawn');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(timelineContainer);
  }

  // Mejora accesible: mostrar texto alternativo en tooltips si existen
  document.querySelectorAll('.timeline-item').forEach(item => {
    const tooltip = item.querySelector('.timeline-tooltip');
    if (tooltip) {
      // permitimos enfocar para accesibilidad
      item.setAttribute('tabindex', '0');
      item.addEventListener('focus', () => tooltip.classList.add('visible'));
      item.addEventListener('blur', () => tooltip.classList.remove('visible'));
    }
  });
});
