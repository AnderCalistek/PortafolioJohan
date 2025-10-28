document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('a.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('back-to-top');

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

  // --- Preview de foto de perfil (upload) ---
  const photoInput = document.getElementById('profile-photo-input');
  const profilePreview = document.getElementById('profile-preview');
  if (photoInput && profilePreview) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => { profilePreview.src = reader.result; };
      reader.readAsDataURL(file);
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
});
