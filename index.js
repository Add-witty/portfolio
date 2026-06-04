/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — ANIMATIONS & INTERACTIONS
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ─── Mobile Navigation ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ─── Navbar scroll behavior ───
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ─── Active nav link on scroll ───
  const sections = document.querySelectorAll('.section');
  const navAnchors = navLinks.querySelectorAll('a');

  const activateNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });

  // ═══════════════════════════════════════════════════════════════
  // INTERSECTION OBSERVER — MASTER ANIMATION CONTROLLER
  // ═══════════════════════════════════════════════════════════════

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(() => {
          el.classList.add('visible');

          // Trigger child animations based on section
          triggerChildAnimations(el);
        }, delay);

        animationObserver.unobserve(el);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('[data-animate]').forEach(el => {
    animationObserver.observe(el);
  });

  // ─── Trigger child animations ───
  function triggerChildAnimations(el) {
    // Experience card bullet stagger
    if (el.classList.contains('exp-card')) {
      const bullets = el.querySelectorAll('li[data-animate="stagger"]');
      bullets.forEach((li, i) => {
        setTimeout(() => li.classList.add('visible'), 150 * (i + 1));
      });
    }

    // Education card bullet typewriter
    if (el.classList.contains('edu-card')) {
      const bullets = el.querySelectorAll('li[data-animate="typewriter"]');
      bullets.forEach((li, i) => {
        setTimeout(() => li.classList.add('visible'), 200 * (i + 1));
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PROJECT CARDS — SPECIAL OBSERVER
  // ═══════════════════════════════════════════════════════════════

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;

        // Left panel blur-to-sharp
        const left = card.querySelector('.project-left');
        if (left) {
          left.classList.add('visible');
        }

        // Right content fade
        const right = card.querySelector('.project-right');
        if (right) {
          setTimeout(() => right.classList.add('visible'), 300);
        }

        // Outcome boxes pop in one by one
        const outcomes = card.querySelectorAll('.outcome-box[data-animate="pop"]');
        outcomes.forEach((box, i) => {
          setTimeout(() => box.classList.add('visible'), 500 + i * 120);
        });

        // Tech pills elastic bounce
        const pills = card.querySelectorAll('.tech-pill[data-animate="elastic"]');
        pills.forEach((pill, i) => {
          setTimeout(() => pill.classList.add('visible'), 800 + i * 100);
        });

        projectObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.project-card').forEach(card => {
    projectObserver.observe(card);
  });

  // ═══════════════════════════════════════════════════════════════
  // SKILLS — PROGRESS BARS & COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════════

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.dataset.delay || '0', 10);

        setTimeout(() => {
          card.classList.add('visible');

          // Animate progress bars
          const fills = card.querySelectorAll('.skill-fill');
          fills.forEach(fill => {
            const width = fill.dataset.width;
            setTimeout(() => {
              fill.style.width = width + '%';
            }, 200);
          });

          // Animate percentage counters
          const percents = card.querySelectorAll('.skill-percent');
          percents.forEach(span => {
            const target = parseInt(span.dataset.target, 10);
            animateCounter(span, 0, target, 1000);
          });
        }, delay);

        skillObserver.unobserve(card);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(card => {
    skillObserver.observe(card);
  });

  function animateCounter(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * easedProgress);
      el.textContent = current + '%';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════════════════════════════════
  // ACHIEVEMENTS — STAT COUNTERS
  // ═══════════════════════════════════════════════════════════════

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          const target = parseInt(stat.dataset.count, 10);
          animateStatCounter(stat, 0, target, 1200);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.achievements-stats');
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }

  function animateStatCounter(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + range * easedProgress);
      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ═══════════════════════════════════════════════════════════════
  // ACHIEVEMENTS CARDS — ZOOM SPRING OBSERVER
  // ═══════════════════════════════════════════════════════════════

  const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        achievementObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.achievement-card').forEach(card => {
    achievementObserver.observe(card);
  });

  // ═══════════════════════════════════════════════════════════════
  // CONTACT — PANEL ANIMATIONS
  // ═══════════════════════════════════════════════════════════════

  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Pulse the send button after form renders
        if (entry.target.classList.contains('contact-form-panel')) {
          setTimeout(() => {
            const btn = document.getElementById('btnSend');
            if (btn) btn.classList.add('pulse');
          }, 800);
        }

        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.contact-form-panel, .contact-info-panel').forEach(panel => {
    contactObserver.observe(panel);
  });

  // ═══════════════════════════════════════════════════════════════
  // ABOUT ME — SPECIAL ANIMATIONS
  // ═══════════════════════════════════════════════════════════════

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Image slide in
        const imgContainer = document.querySelector('.about-image-container');
        if (imgContainer) imgContainer.classList.add('visible');

        // Mission/Vision flip cards
        document.querySelectorAll('.mv-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), 300 + i * 200);
        });

        // View My Work buttons stagger
        document.querySelectorAll('.about-nav-btn').forEach((btn, i) => {
          setTimeout(() => btn.classList.add('visible'), 600 + i * 100);
        });

        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    aboutObserver.observe(aboutSection);
  }

  // ═══════════════════════════════════════════════════════════════
  // EXPERIENCE — CURTAIN ANIMATION OBSERVER
  // ═══════════════════════════════════════════════════════════════

  const expObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('visible');

        // Stagger bullet points
        const bullets = card.querySelectorAll('li[data-animate="stagger"]');
        bullets.forEach((li, i) => {
          setTimeout(() => li.classList.add('visible'), 300 + 150 * i);
        });

        expObserver.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.exp-card').forEach(card => {
    expObserver.observe(card);
  });

  // ═══════════════════════════════════════════════════════════════
  // EDUCATION — DROP / RISE OBSERVER
  // ═══════════════════════════════════════════════════════════════

  const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('visible');

        // Typewriter bullet points
        const bullets = card.querySelectorAll('li[data-animate="typewriter"]');
        bullets.forEach((li, i) => {
          setTimeout(() => li.classList.add('visible'), 400 + 200 * i);
        });

        eduObserver.unobserve(card);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.edu-card').forEach(card => {
    eduObserver.observe(card);
  });

  // ═══════════════════════════════════════════════════════════════
  // SMOOTH SCROLL FOR ALL ANCHOR LINKS
  // ═══════════════════════════════════════════════════════════════

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // navbar height
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // FORM SUBMISSION FEEDBACK
  // ═══════════════════════════════════════════════════════════════

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const btn = document.getElementById('btnSend');
      btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Sending...</span>';
      btn.style.opacity = '0.8';
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CURSOR GLOW EFFECT (subtle ambient)
  // ═══════════════════════════════════════════════════════════════

  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,180,216,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transition: transform 0.15s ease;
    will-change: transform;
  `;
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
  }, { passive: true });

  // Hide on touch devices
  if ('ontouchstart' in window) {
    cursorGlow.style.display = 'none';
  }
});
