import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { createIcons, icons } from 'lucide';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lucide Icons
createIcons({ icons });

// Dark Mode setup
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isNowDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
  });
}

// Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// GSAP Animations setup
document.addEventListener("DOMContentLoaded", () => {
  // Nav bar blur and shrink on scroll
  const nav = document.querySelector('nav');
  if (nav) {
    const isTransparent = nav.classList.contains('bg-transparent');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        if (isTransparent) {
          nav.classList.add('bg-black/60', 'backdrop-blur-2xl', 'shadow-2xl', 'border-white/10');
          nav.classList.remove('bg-transparent');
        }
        nav.classList.add('py-2');
        nav.classList.remove('py-4');
      } else {
        if (isTransparent) {
          nav.classList.remove('bg-black/60', 'backdrop-blur-2xl', 'shadow-2xl', 'border-white/10');
          nav.classList.add('bg-transparent');
        }
        nav.classList.add('py-4');
        nav.classList.remove('py-2');
      }
    });
  }

  // Menu Filtering Logic
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const foodCards = document.querySelectorAll('.food-card');

  if (filterButtons.length > 0 && foodCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Reset styles for all buttons
        filterButtons.forEach(b => {
          b.classList.remove('bg-slate-900', 'text-white', 'dark:bg-white', 'dark:text-black', 'shadow-lg');
          b.classList.add('bg-white', 'text-slate-600', 'dark:bg-zinc-900', 'dark:text-slate-300');
        });

        // Add active styles to clicked button
        btn.classList.add('bg-slate-900', 'text-white', 'dark:bg-white', 'dark:text-black', 'shadow-lg');
        btn.classList.remove('bg-white', 'text-slate-600', 'dark:bg-zinc-900', 'dark:text-slate-300');

        const filter = btn.getAttribute('data-filter');

        // Filter cards
        foodCards.forEach(card => {
          if (!filter || filter === 'all' || card.getAttribute('data-category') === filter) {
            (card as HTMLElement).style.display = 'flex';
            gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
          } else {
            (card as HTMLElement).style.display = 'none';
          }
        });

        ScrollTrigger.refresh();
      });
    });
  }

  // Reveal elements on scroll
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach((el) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0, scale: 0.95, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Hero Canvas Sequence
  const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const frameCount = 40;
    const currentFrame = (index: number) => `/assets/images/Fruits_falling_out_of_bowl_delpmaspu__${String(index).padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const sequence = {
      frame: 0
    };

    let loadedCount = 0;
    let imagesLoaded = false;

    // We use Math.floor for the base frame, and the decimal part for blending
    const drawImageCover = (img: HTMLImageElement, opacity: number) => {
      if (!ctx) return;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = imgRatio * canvasHeight;
        offsetY = 0;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.globalAlpha = opacity;
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    const render = () => {
      if (!ctx || images.length === 0) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const index = Math.floor(sequence.frame);
      const img = images[index];

      if (img && img.complete) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawImageCover(img, 1);
      }
    };

    // Preload
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);

      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1 || i === Math.floor(sequence.frame)) {
          render();
        }
      };
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      render();
    };

    window.addEventListener('resize', resize);
    resize();

    gsap.to(sequence, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      },
      onUpdate: render,
    });

    gsap.to('.hero-text-content', {
      y: -50,
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: "top top",
        end: "bottom center",
        scrub: true
      }
    });
  }

  // -- CURSOR PARTICLE EFFECT (GLOBAL) --
  const initGlobalParticles = () => {
    // If it's a mobile device (width < 768), don't run heavy canvas animations
    if (window.innerWidth <= 768) return;

    let particleCanvas = document.getElementById("particle-canvas") as HTMLCanvasElement;

    // Auto-inject if not on hero page
    if (!particleCanvas) {
      particleCanvas = document.createElement("canvas");
      particleCanvas.id = "particle-canvas";
      particleCanvas.className = "fixed inset-0 z-[9999] pointer-events-none";
      document.body.appendChild(particleCanvas);
    }

    const pCtx = particleCanvas.getContext("2d");
    if (!pCtx) return;

    let particles: Particle[] = [];
    const colors = ["#4CAF50", "#2E7D32", "#81C784", "#A5D6A7"]; // Aura Green variations

    let mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      weight: number;
      speedX: number;
      speedY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1; // 1 to 6
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.weight = Math.random() * 1.5 + 0.5; // used for slight gravity/float
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
      }

      update() {
        // Move towards mouse slightly, but also drift
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        // Attraction to mouse
        const maxDistance = 200;
        let force = (maxDistance - distance) / maxDistance;
        if (force < 0) force = 0;

        // Only attract if close enough
        if (distance < maxDistance) {
          this.speedX += forceDirectionX * force * 0.5;
          this.speedY += forceDirectionY * force * 0.5;
        }

        // Apply friction/drag so they don't accelerate infinitely
        this.speedX *= 0.95;
        this.speedY *= 0.95;

        // Add base float/drift
        this.x += this.speedX + (Math.random() - 0.5) * 1.5;
        this.y += this.speedY - this.weight * 0.5; // float upwards slowly

        // Wrap around screen or respawn if out of bounds
        if (this.size < 0.2) {
          this.respawn();
        } else {
          this.size -= 0.02; // slowly shrink
        }
      }

      draw() {
        if (!pCtx) return;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = this.color;
        pCtx.globalAlpha = 0.5; // Soft glow
        pCtx.fill();
        pCtx.globalAlpha = 1.0;
      }

      respawn() {
        // Respawn near mouse with random offset
        this.x = mouse.x + (Math.random() - 0.5) * 100;
        this.y = mouse.y + (Math.random() - 0.5) * 100;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 90; i++) {
        // Start randomly spread out initially
        particles.push(new Particle(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
      }
    };

    const animateParticles = () => {
      if (!pCtx) return;
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animateParticles);
    };

    const resizeCanvas = () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("mousemove", (e) => {
      // Get exact mouse position relative to viewport
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn a burst occasionally on fast move
      if (Math.random() > 0.8) {
        particles.push(new Particle(mouse.x, mouse.y));
        if (particles.length > 150) particles.shift(); // keep array size reasonable
      }
    });

    initParticles();
    animateParticles();
  };

  const initCustomCursor = () => {
    if (window.innerWidth <= 768) return;
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'fixed top-0 left-0 w-[400px] h-[400px] bg-aura-green/10 rounded-full pointer-events-none blur-[100px] z-[9998] mix-blend-screen transform-gpu transition-all duration-300 opacity-0 group-hover:opacity-100';
    document.body.appendChild(cursorGlow);

    // Show glow on move
    let timeout: ReturnType<typeof setTimeout>;
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      gsap.to(cursorGlow, {
        x: e.clientX - 200,
        y: e.clientY - 200,
        duration: 0.8,
        ease: 'power3.out'
      });
      clearTimeout(timeout);
      timeout = setTimeout(() => { cursorGlow.style.opacity = '0.3'; }, 1000);
    });
  };

  initGlobalParticles();
  initCustomCursor();

  // Trial Banner Parallax
  const trialBanner = document.getElementById('trial-banner');
  const trialBg = document.getElementById('trial-bg');
  if (trialBanner && trialBg) {
    gsap.to(trialBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: trialBanner,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Testimonial Carousel
  const testimonials = [
    {
      text: "Absolutely delicious, healthy and freshly prepared food. For sure makes me feel lighter I look forward to having AuraBite every day.",
      name: "Divya",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "I was skeptical about food subscription, but AuraBite proves that quality delivery food exists. The meal plans are perfect for my busy work week.",
      name: "Rahul M.",
      img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "The Impossible Truffle Burger is insane! Tastes better than most high-end restaurants, and arriving hot under 30 minutes blew my mind. Outstanding.",
      name: "Ananya K.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    }
  ];

  let currentTestimonial = 0;
  const testiText = document.getElementById('testi-text');
  const testiName = document.getElementById('testi-name');
  const testiImg = document.getElementById('testi-img') as HTMLImageElement;
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');
  const testiAuthorInfo = document.getElementById('testi-author-info');

  const updateTestimonial = (index: number) => {
    if (!testiText || !testiName || !testiImg || !testiAuthorInfo) return;

    // Fade out
    testiText.style.opacity = '0';
    testiAuthorInfo.style.opacity = '0';

    setTimeout(() => {
      testiText.textContent = `"${testimonials[index].text}"`;
      testiName.textContent = testimonials[index].name;
      testiImg.src = testimonials[index].img;

      // Fade in
      testiText.style.opacity = '1';
      testiAuthorInfo.style.opacity = '1';
    }, 300);
  };

  if (testiPrev && testiNext) {
    testiPrev.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(currentTestimonial);
    });

    testiNext.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      updateTestimonial(currentTestimonial);
    });
  }

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    // Initial setup for GSAP slide animation
    gsap.set(mobileMenu, { height: 0, opacity: 0, display: "none" });
    let isMenuOpen = false;

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        gsap.to(mobileMenu, {
          height: "auto",
          opacity: 1,
          display: "flex",
          duration: 0.4,
          ease: "power3.out"
        });
      } else {
        gsap.to(mobileMenu, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // ensure it's hidden after animation
            gsap.set(mobileMenu, { display: "none" });
          }
        });
      }
    };

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link inside it
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
      });
    });
  }

  // -- LOCATION SYSTEM --
  const initLocationSystem = () => {
    let savedLocation = localStorage.getItem('aurabite_location') || 'Select Location';

    // Prepend Mobile Location Selector to Mobile Menu
    if (mobileMenu) {
      const mobileLocBtn = document.createElement('div');
      mobileLocBtn.className = 'py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between cursor-pointer location-btn group';
      mobileLocBtn.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-aura-green/10 transition-colors">
            <svg class="w-5 h-5 text-aura-green" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Deliver to</div>
            <div class="text-base font-bold text-slate-900 dark:text-white location-display-text">${savedLocation}</div>
          </div>
        </div>
        <svg class="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      `;
      mobileMenu.prepend(mobileLocBtn);
    }

    // Update all text nodes immediately
    const updateTextDisplays = () => {
      document.querySelectorAll('.location-display-text').forEach(el => {
        el.textContent = savedLocation.length > 20 ? savedLocation.substring(0, 18) + '...' : savedLocation;
      });
    };
    updateTextDisplays();
  };

  initLocationSystem();

  // -- COMING SOON POPUP --
  const initComingSoon = () => {
    const modalHTML = `
      <div id="coming-soon-modal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none opacity-0 transition-opacity duration-300">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm cs-backdrop"></div>
        <div class="bg-[#111] border border-zinc-800 w-full max-w-[400px] rounded-2xl shadow-2xl relative z-10 transform scale-95 transition-transform duration-300 cs-card p-8 flex flex-col items-center text-center pointer-events-auto">
          <button class="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cs-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div class="w-16 h-16 rounded-full bg-aura-green/10 flex items-center justify-center mb-6 border border-aura-green/20">
            <svg class="w-8 h-8 text-aura-green" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          
          <h3 class="text-2xl font-black font-heading text-white mb-4 tracking-tight">Coming Soon</h3>
          <p class="text-zinc-400 text-sm font-medium leading-relaxed mb-8">This feature is currently being upgraded for an enhanced premium experience. Please check back later!</p>
          
          <button class="w-full bg-white text-black hover:bg-zinc-200 font-bold py-3.5 rounded-xl transition-colors cs-close">Close</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('coming-soon-modal');
    const csCard = modal?.querySelector('.cs-card');

    const openModal = (e: Event) => {
      e.preventDefault();
      if (!modal || !csCard) return;
      modal.classList.remove('pointer-events-none', 'opacity-0');
      csCard.classList.remove('scale-95');
      csCard.classList.add('scale-100');
    };

    const closeModal = () => {
      if (!modal || !csCard) return;
      modal.classList.add('opacity-0', 'pointer-events-none');
      csCard.classList.remove('scale-100');
      csCard.classList.add('scale-95');
    };

    modal?.querySelector('.cs-backdrop')?.addEventListener('click', closeModal);
    modal?.querySelectorAll('.cs-close').forEach(btn => btn.addEventListener('click', closeModal));

    // Bind all buttons that need this
    const popupTriggers = [
      'a[href="#"]',
      '.signin-btn',
      '.coming-soon-trigger',
      '.location-btn',
      '.order-now-btn',
      '.coming-soon-force',
      'a[href="plans.html"]',
      '.food-card button',
      '#mobile-menu button',
      'form button[type="submit"]',
      '.view-menu-btn'
    ].join(', ');

    document.querySelectorAll(popupTriggers).forEach(btn => {
      if (btn.id === 'mobile-menu-btn') return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(e);
      });
    });
  };

  initComingSoon();

});
