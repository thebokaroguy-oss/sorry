/* ============================================
   PARALLAX, SCROLL REVEALS & PETAL ANIMATIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. FALLING PETALS SYSTEM
  // ==========================================
  const petalsContainer = document.querySelector('.petals-container');

  const petalColors = [
    { fill: '#f7a4b8', stroke: '#e88da3' },
    { fill: '#ffc0cb', stroke: '#f0a0b0' },
    { fill: '#ffb6c1', stroke: '#e8a0ac' },
    { fill: '#f4c2d0', stroke: '#daa8b6' },
    { fill: '#eab2c4', stroke: '#d498ac' },
    { fill: '#c9b1ff', stroke: '#b09de6' },
    { fill: '#f5d5e0', stroke: '#dbbfc8' },
  ];

  function createPetalSVG(color) {
    const size = 12 + Math.random() * 18;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.innerHTML = `<path d="M12 2C8 2 4 6 4 10c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" 
      fill="${color.fill}" stroke="${color.stroke}" stroke-width="0.5" opacity="0.85"/>`;
    return svg;
  }

  function spawnPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const color = petalColors[Math.floor(Math.random() * petalColors.length)];
    petal.appendChild(createPetalSVG(color));

    const startX = Math.random() * window.innerWidth;
    const duration = 8 + Math.random() * 12;
    const drift = -100 + Math.random() * 200;
    const rotation = 360 + Math.random() * 720;
    const delay = Math.random() * 2;

    petal.style.left = startX + 'px';
    petal.style.setProperty('--drift', drift + 'px');
    petal.style.setProperty('--rotation', rotation + 'deg');
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';

    petalsContainer.appendChild(petal);

    // Cleanup after animation
    setTimeout(() => {
      if (petal.parentNode) petal.remove();
    }, (duration + delay) * 1000 + 500);
  }

  // Initial burst of petals
  for (let i = 0; i < 15; i++) {
    setTimeout(spawnPetal, i * 300);
  }

  // Continuous petal spawning
  setInterval(spawnPetal, 800);

  // ==========================================
  // 2. PARALLAX SCROLLING
  // ==========================================
  const parallaxElements = document.querySelectorAll('[data-parallax-speed]');

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.1;
      const rect = el.closest('.parallax-section')?.getBoundingClientRect();

      if (rect) {
        const sectionTop = rect.top + scrollY;
        const offset = (scrollY - sectionTop) * speed;
        el.style.transform = `translateY(${offset}px)`;
      } else {
        el.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  }

  // Also parallax the floating flowers with mouse movement
  const floatingFlowers = document.querySelectorAll('.parallax-flower');

  function handleMouseParallax(e) {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    floatingFlowers.forEach(flower => {
      const depth = parseFloat(flower.dataset.mouseDepth) || 20;
      const offsetX = mouseX * depth;
      const offsetY = mouseY * depth;
      const scrollOffset = flower.style.transform.match(/translateY\(([^)]+)\)/);
      const existingY = scrollOffset ? parseFloat(scrollOffset[1]) : 0;
      flower.style.transform = `translate(${offsetX}px, ${existingY + offsetY}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('mousemove', handleMouseParallax, { passive: true });
  updateParallax();

  // ==========================================
  // 3. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Keep observing for re-entry (don't unobserve)
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 4. PARALLAX BACKGROUND IMAGES
  // ==========================================
  const parallaxBgs = document.querySelectorAll('.parallax-bg');

  function updateBgParallax() {
    const scrollY = window.scrollY;

    parallaxBgs.forEach(bg => {
      const speed = parseFloat(bg.dataset.bgSpeed) || 0.3;
      const section = bg.closest('.parallax-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const distance = sectionCenter - viewCenter;

      bg.style.transform = `translateY(${distance * speed * -1}px)`;
    });
  }

  window.addEventListener('scroll', updateBgParallax, { passive: true });
  updateBgParallax();

  // ==========================================
  // 5. PARTICLES IN SECTIONS
  // ==========================================
  document.querySelectorAll('.particles').forEach(container => {
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = 6 + Math.random() * 6 + 's';
      particle.style.width = 2 + Math.random() * 4 + 'px';
      particle.style.height = particle.style.width;

      const colors = ['var(--clr-blush)', 'var(--clr-lavender)', 'var(--clr-rose)', 'var(--clr-gold)'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      container.appendChild(particle);
    }
  });

  // ==========================================
  // 6. SMOOTH SECTION PROGRESS BAR
  // ==========================================
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = progress + '%';
    }, { passive: true });
  }

  // ==========================================
  // 7. HEART CLICK BURST
  // ==========================================
  const heart = document.querySelector('.beating-heart');
  if (heart) {
    heart.addEventListener('click', () => {
      for (let i = 0; i < 20; i++) {
        const burst = document.createElement('span');
        burst.textContent = ['💖', '💕', '🌸', '✨', '💗', '🌹'][Math.floor(Math.random() * 6)];
        burst.style.cssText = `
          position: fixed;
          left: ${heart.getBoundingClientRect().left + heart.offsetWidth / 2}px;
          top: ${heart.getBoundingClientRect().top + heart.offsetHeight / 2}px;
          font-size: ${16 + Math.random() * 24}px;
          pointer-events: none;
          z-index: 9999;
          transition: all ${1 + Math.random()}s ease-out;
          opacity: 1;
        `;
        document.body.appendChild(burst);

        requestAnimationFrame(() => {
          burst.style.transform = `translate(${-100 + Math.random() * 200}px, ${-200 - Math.random() * 150}px) rotate(${Math.random() * 360}deg)`;
          burst.style.opacity = '0';
        });

        setTimeout(() => burst.remove(), 2000);
      }
    });
  }

  // ==========================================
  // 8. TYPEWRITER FOR FINAL MESSAGE
  // ==========================================
  const typewriterEl = document.querySelector('.typewriter');
  if (typewriterEl) {
    const text = typewriterEl.dataset.text || typewriterEl.textContent;
    typewriterEl.textContent = '';
    let typed = false;

    const typeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !typed) {
          typed = true;
          let i = 0;
          const interval = setInterval(() => {
            typewriterEl.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(interval);
          }, 60);
        }
      });
    }, { threshold: 0.5 });

    typeObserver.observe(typewriterEl);
  }

  console.log('💐 Apology page loaded with love...');
});

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // VIRTUAL SLAP LOGIC
  // ==========================================
  const tousifHead = document.getElementById('tousif-head');
  const slapCountEl = document.getElementById('slap-count');
  const smackText = document.getElementById('smack-text');
  const redCheek = document.getElementById('red-cheek');
  
  let slaps = 0;
  let cheekFadeTimeout;

  if (tousifHead) {
    tousifHead.addEventListener('click', (e) => {
      // Increment score
      slaps++;
      slapCountEl.textContent = slaps;
      
      // Add shake animation
      tousifHead.classList.remove('is-slapped');
      void tousifHead.offsetWidth; // trigger reflow
      tousifHead.classList.add('is-slapped');
      
      // Show BAM text
      smackText.classList.remove('show-bam');
      void smackText.offsetWidth;
      smackText.classList.add('show-bam');
      
      // Different texts based on slaps
      const texts = ['BAM!', 'SMACK!', 'OUCH!', 'THWACK!', 'WHAM!'];
      smackText.textContent = texts[Math.floor(Math.random() * texts.length)];
      
      // Position red cheek near the click (roughly)
      const rect = tousifHead.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Only show cheek on the face roughly
      redCheek.style.left = (x - 30) + 'px';
      redCheek.style.top = (y - 40) + 'px';
      
      redCheek.classList.add('show-cheek');
      
      // Fade red cheek after a bit
      clearTimeout(cheekFadeTimeout);
      cheekFadeTimeout = setTimeout(() => {
        redCheek.classList.remove('show-cheek');
      }, 2000);
      
      // Create a floating slap emoji where clicked
      const slapEmoji = document.createElement('div');
      slapEmoji.textContent = '👋';
      slapEmoji.style.position = 'absolute';
      slapEmoji.style.left = e.clientX + 'px';
      slapEmoji.style.top = e.clientY + 'px';
      slapEmoji.style.fontSize = '3rem';
      slapEmoji.style.pointerEvents = 'none';
      slapEmoji.style.zIndex = '9999';
      slapEmoji.style.transition = 'all 0.5s ease-out';
      slapEmoji.style.transform = 'translate(-50%, -50%) rotate(-20deg)';
      document.body.appendChild(slapEmoji);
      
      requestAnimationFrame(() => {
        slapEmoji.style.transform = 'translate(-50%, -150%) scale(1.5) rotate(20deg)';
        slapEmoji.style.opacity = '0';
      });
      
      setTimeout(() => slapEmoji.remove(), 500);
    });
  }
});
