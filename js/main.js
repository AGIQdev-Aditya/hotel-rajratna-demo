/**
 * Hotel Rajratna Family Garden Restaurant - Interactive Engine
 * Handles dynamic menu filtering, reservation & event modals, direct WhatsApp routing, and mobile UX.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Header Scroll Effect
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // Digital Menu Filtering & Live Search
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dietBtns = document.querySelectorAll('.diet-pill-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');
  const searchInput = document.getElementById('menuSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const emptyState = document.getElementById('menuEmptyState');
  const resetMenuBtn = document.getElementById('resetMenuBtn');

  let currentCategory = 'all';
  let currentDiet = 'all';
  let currentSearch = '';

  const applyMenuFilters = () => {
    let visibleCount = 0;
    const term = currentSearch.toLowerCase().trim();

    menuItems.forEach(item => {
      const categories = (item.getAttribute('data-category') || '').split(' ');
      const diet = item.getAttribute('data-diet') || '';

      // Category match
      const catMatch = currentCategory === 'all' || categories.includes(currentCategory);

      // Diet match
      let dietMatch = true;
      if (currentDiet === 'veg') dietMatch = diet === 'veg' || categories.includes('veg');
      else if (currentDiet === 'non-veg') dietMatch = diet === 'non-veg' || categories.includes('nonveg') || categories.includes('non-veg');

      // Search match
      let searchMatch = true;
      if (term) {
        const title = (item.querySelector('.item-title')?.textContent || '').toLowerCase();
        const desc = (item.querySelector('.item-desc')?.textContent || '').toLowerCase();
        const tag = (item.querySelector('.item-tag-pill')?.textContent || '').toLowerCase();
        const price = (item.querySelector('.item-price')?.textContent || '').toLowerCase();
        searchMatch = title.includes(term) || desc.includes(term) || tag.includes(term) || price.includes(term);
      }

      if (catMatch && dietMatch && searchMatch) {
        item.style.display = 'flex';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyMenuFilters();
    });
  });

  dietBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dietBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDiet = btn.getAttribute('data-diet') || 'all';
      applyMenuFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearch ? 'block' : 'none';
      }
      applyMenuFilters();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      clearSearchBtn.style.display = 'none';
      applyMenuFilters();
    });
  }

  if (resetMenuBtn) {
    resetMenuBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      currentCategory = 'all';
      currentDiet = 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
      dietBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-diet') === 'all'));
      applyMenuFilters();
    });
  }

  // Modals Logic
  const reservationModal = document.getElementById('reservationModal');
  const banquetModal = document.getElementById('banquetModal');
  const openReservationBtns = document.querySelectorAll('.open-reservation-modal');
  const openBanquetBtns = document.querySelectorAll('.open-banquet-modal');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-overlay');

  const openModal = (modal) => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  openReservationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(reservationModal);
    });
  });

  openBanquetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(banquetModal);
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(reservationModal);
      closeModal(banquetModal);
    });
  });

  // Close when clicking on backdrop (not inside modal-box)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(reservationModal);
        closeModal(banquetModal);
      }
    });
  });

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(reservationModal);
      closeModal(banquetModal);
    }
  });

  // Table Reservation Form Submission -> Direct WhatsApp
  const reservationForm = document.getElementById('reservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName')?.value.trim();
      const phone = document.getElementById('resPhone')?.value.trim();
      const guests = document.getElementById('resGuests')?.value;
      const date = document.getElementById('resDate')?.value;
      const time = document.getElementById('resTime')?.value;
      const seating = document.getElementById('resSeating')?.value;
      const notes = document.getElementById('resNotes')?.value.trim();

      const message = `👋 Hello Hotel Rajratna Team!%0A%0AI would like to book a table:%0A👤 *Name:* ${encodeURIComponent(name)}%0A📞 *Phone:* ${encodeURIComponent(phone)}%0A👥 *Guests:* ${encodeURIComponent(guests)} People%0A📅 *Date:* ${encodeURIComponent(date)}%0A⏰ *Time:* ${encodeURIComponent(time)}%0A🌿 *Seating Area:* ${encodeURIComponent(seating)}%0A📝 *Special Requests:* ${encodeURIComponent(notes || 'None')}%0A%0APlease confirm our reservation. Thank you!`;

      closeModal(reservationModal);
      showToast('Opening WhatsApp to confirm your table...');
      setTimeout(() => {
        window.open(`https://wa.me/919607667961?text=${message}`, '_blank');
      }, 700);
    });
  }

  // Banquet & Event Inquiry Form -> Direct WhatsApp
  const banquetForm = document.getElementById('banquetForm');
  if (banquetForm) {
    banquetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('evtName')?.value.trim();
      const phone = document.getElementById('evtPhone')?.value.trim();
      const type = document.getElementById('evtType')?.value;
      const guests = document.getElementById('evtGuests')?.value;
      const date = document.getElementById('evtDate')?.value;
      const requirements = document.getElementById('evtReq')?.value.trim();

      const message = `🎉 *Hotel Rajratna Banquet & Party Lawn Inquiry*%0A%0A👤 *Name:* ${encodeURIComponent(name)}%0A📞 *Phone:* ${encodeURIComponent(phone)}%0A🎊 *Occasion:* ${encodeURIComponent(type)}%0A👥 *Expected Guests:* ${encodeURIComponent(guests)}%0A📅 *Tentative Date:* ${encodeURIComponent(date)}%0A📋 *Details / Catering:* ${encodeURIComponent(requirements || 'Please send packages and lawn pricing')}%0A%0APlease share your availability and party package details!`;

      closeModal(banquetModal);
      showToast('Redirecting to WhatsApp for Banquet inquiry...');
      setTimeout(() => {
        window.open(`https://wa.me/919607667961?text=${message}`, '_blank');
      }, 700);
    });
  }

  // One-Click Dish Ordering on WhatsApp
  const dishOrderBtns = document.querySelectorAll('.order-dish-btn');
  dishOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dishName = btn.getAttribute('data-dish') || 'Special Dish';
      const dishPrice = btn.getAttribute('data-price') || '';
      const text = `👋 Hello Rajratna Restaurant!%0A%0AI would like to order / inquire about:*%0A🍽️ *${encodeURIComponent(dishName)}* (${encodeURIComponent(dishPrice)})%0A%0APlease let me know the availability and preparation time for pickup/dine-in.`;

      showToast(`Ordering ${dishName} via WhatsApp...`);
      setTimeout(() => {
        window.open(`https://wa.me/919607667961?text=${text}`, '_blank');
      }, 500);
    });
  });

  // English / Marathi Language Switcher
  const langToggle = document.getElementById('langToggle');
  let currentLang = 'en';

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'mr' : 'en';
      
      // Update toggle button text
      const langText = langToggle.querySelector('.lang-text');
      if (langText) {
        langText.textContent = currentLang === 'en' ? 'मराठी' : 'English';
      }

      // Translate all data-en / data-mr elements
      const translatableElements = document.querySelectorAll('[data-en][data-mr]');
      translatableElements.forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
          el.innerHTML = text;
        }
      });

      showToast(currentLang === 'mr' ? 'भाषा: मराठी निवडली' : 'Language: English selected');
    });
  }

  // Helper Toast Notification
  function showToast(message) {
    let toast = document.getElementById('siteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f3c775" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ==========================================================
  // 1. Firefly Ambient Starlight Canvas (Qissa Style)
  // ==========================================================
  const canvas = document.getElementById('fireflyCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 40;

    const resizeCanvas = () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Firefly {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 0.8;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45 - 0.15; // gentle upward drift
        this.alpha = Math.random() * 0.7 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.008;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += Math.sin(Date.now() * this.twinkleSpeed) * 0.015;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 0.85) this.alpha = 0.85;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 214, 134, ${this.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#e2ab46';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Firefly());
    }

    const animateFireflies = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateFireflies);
    };

    animateFireflies();
  }

  // ==========================================================
  // 2. Sliding Dishes Carousel (Qissa Style)
  // ==========================================================
  const dishesContainer = document.getElementById('dishesTrackContainer');
  const dishPrevBtn = document.getElementById('dishPrevBtn');
  const dishNextBtn = document.getElementById('dishNextBtn');

  if (dishesContainer) {
    let isPaused = false;
    const scrollStep = 340;

    // Auto-scroll loop
    setInterval(() => {
      if (!isPaused && dishesContainer) {
        if (dishesContainer.scrollLeft + dishesContainer.clientWidth >= dishesContainer.scrollWidth - 10) {
          dishesContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          dishesContainer.scrollBy({ left: 1, behavior: 'auto' });
        }
      }
    }, 30);

    dishesContainer.addEventListener('mouseenter', () => isPaused = true);
    dishesContainer.addEventListener('mouseleave', () => isPaused = false);
    dishesContainer.addEventListener('touchstart', () => isPaused = true, { passive: true });
    dishesContainer.addEventListener('touchend', () => isPaused = false);

    dishPrevBtn?.addEventListener('click', () => {
      isPaused = true;
      dishesContainer.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    dishNextBtn?.addEventListener('click', () => {
      isPaused = true;
      dishesContainer.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  // ==========================================================
  // 3. "Our Dining Havens" Side-Scrolling Slider (White Desert Style)
  // ==========================================================
  const havensContainer = document.getElementById('havensTrackContainer');
  const havenPrevBtn = document.getElementById('havenPrevBtn');
  const havenNextBtn = document.getElementById('havenNextBtn');
  const havenProgressBar = document.getElementById('havenProgressBar');
  const havenCounter = document.getElementById('havenCounter');

  if (havensContainer) {
    const havenStep = 440;
    const totalHavens = 4;

    const updateHavenProgress = () => {
      const scrollLeft = havensContainer.scrollLeft;
      const maxScroll = havensContainer.scrollWidth - havensContainer.clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) : 0;
      
      const currentIdx = Math.min(totalHavens, Math.max(1, Math.round(progress * (totalHavens - 1)) + 1));
      
      if (havenProgressBar) {
        havenProgressBar.style.width = `${Math.max(25, (currentIdx / totalHavens) * 100)}%`;
      }
      if (havenCounter) {
        havenCounter.textContent = `0${currentIdx} / 0${totalHavens}`;
      }
    };

    havensContainer.addEventListener('scroll', updateHavenProgress);

    havenPrevBtn?.addEventListener('click', () => {
      havensContainer.scrollBy({ left: -havenStep, behavior: 'smooth' });
    });

    havenNextBtn?.addEventListener('click', () => {
      havensContainer.scrollBy({ left: havenStep, behavior: 'smooth' });
    });
  }

  // ==========================================================
  // 4. Scroll Reveal Intersection Observer
  // ==========================================================
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }
});


