const navToggle = document.querySelector('.nav-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');

  function toggleMenu() {
    navToggle.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  navToggle.addEventListener('click', toggleMenu);

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Mobile DevTools & Touch Parallax Engine for Servicios Section
  const serviciosSection = document.getElementById('servicios');
  const serviciosBg = document.querySelector('.servicios-parallax-bg');
  if (serviciosSection && serviciosBg) {
    let ticking = false;
    const updateParallax = () => {
      const rect = serviciosSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const movePercent = (clampedProgress - 0.5) * 35;
        serviciosBg.style.transform = `translate3d(0, ${movePercent}%, 0)`;
      }
      ticking = false;
    };
    const options = { passive: true };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, options);
    window.addEventListener('touchmove', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, options);
    window.addEventListener('resize', updateParallax, options);
    updateParallax();
  }
