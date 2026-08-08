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

  // Parallax Engine for Servicios Section
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

  // ===================== GALERÍA — CARRUSEL 3D DIAGONAL =====================
  (function () {
    const scene = document.querySelector('.carousel-scene');
    const cards = Array.from(document.querySelectorAll('.carousel-card'));
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsWrap = document.querySelector('.carousel-dots');
    if (!scene || !cards.length) return;

    let active = 0;
    const total = cards.length;

    // Crear dots
    cards.forEach(function (_, i) {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    function getW () { return cards[0].offsetWidth || 340; }

    function layout () {
      const w = getW();
      const vw = window.innerWidth;
      const mobile = vw <= 600;

      cards.forEach(function (card, i) {
        var off = i - active;
        if (off > Math.floor(total / 2)) off -= total;
        if (off < -Math.floor(total / 2)) off += total;
        var abs = Math.abs(off);

        var tx, ty, rx, ry, rz, sc, op, zi, fl;

        if (off === 0) {
          // Centro — card protagonista, levantada sutilmente
          tx = 0; ty = 0;
          rx = 2; ry = 0; rz = -0.5;
          sc = 1; op = 1; zi = 5;
          fl = 'brightness(1)';
          card.classList.add('is-active');
        } else if (abs === 1) {
          // Adyacentes — inclinadas con efecto diagonal
          tx = off * (w * 0.82);
          ty = 14;
          rx = 4; ry = off * -5; rz = off * 2.5;
          sc = 0.82; op = 0.88; zi = 4;
          fl = 'brightness(0.72)';
          card.classList.remove('is-active');
        } else if (abs === 2) {
          // Lejanas — más rotadas, más pequeñas
          tx = off * (w * 0.74);
          ty = 30;
          rx = 6; ry = off * -9; rz = off * 4;
          sc = 0.66; op = mobile ? 0 : 0.55; zi = 3;
          fl = 'brightness(0.5)';
          card.classList.remove('is-active');
        } else {
          // Ocultas
          tx = off * (w * 0.6);
          ty = 45;
          rx = 8; ry = off > 0 ? -14 : 14; rz = off > 0 ? 5 : -5;
          sc = 0.5; op = 0; zi = 1;
          fl = 'brightness(0.3)';
          card.classList.remove('is-active');
        }

        card.style.transform =
          'translate3d(' + tx + 'px,' + ty + 'px,0) ' +
          'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) rotateZ(' + rz + 'deg) ' +
          'scale(' + sc + ')';
        card.style.opacity = op;
        card.style.zIndex = zi;
        card.style.filter = fl;
        card.style.pointerEvents = abs <= 2 ? 'auto' : 'none';
      });

      dots.forEach(function (d, i) { d.classList.toggle('active', i === active); });
    }

    function goTo (i) {
      active = ((i % total) + total) % total;
      layout();
    }

    prevBtn.addEventListener('click', function () { goTo(active - 1); });
    nextBtn.addEventListener('click', function () { goTo(active + 1); });

    // Click en card para centrarla
    cards.forEach(function (c, i) {
      c.addEventListener('click', function () { if (i !== active) goTo(i); });
    });

    // Teclado
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  goTo(active - 1);
      if (e.key === 'ArrowRight') goTo(active + 1);
    });

    // Touch swipe
    var t0x = 0, t0y = 0;
    scene.addEventListener('touchstart', function (e) {
      t0x = e.touches[0].clientX;
      t0y = e.touches[0].clientY;
    }, { passive: true });
    scene.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - t0x;
      var dy = e.changedTouches[0].clientY - t0y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
        dx < 0 ? goTo(active + 1) : goTo(active - 1);
      }
    }, { passive: true });

    // Mouse drag
    var m0 = 0, dragging = false;
    scene.addEventListener('mousedown', function (e) {
      m0 = e.clientX; dragging = true; e.preventDefault();
    });
    document.addEventListener('mouseup', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - m0;
      if (Math.abs(dx) > 35) { dx < 0 ? goTo(active + 1) : goTo(active - 1); }
    });

    // Resize
    window.addEventListener('resize', layout, { passive: true });

    // Init
    layout();
  })();
