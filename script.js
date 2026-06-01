document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STICKY HEADER & ACTIVE NAV LINK
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Sticky Header
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    // Active Section Link Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial check

  // ==========================================
  // 2. MOBILE MENU HAMBURGER TOGGLE
  // ==========================================
  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 4. STATISTICS COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const isPercent = stat.parentElement.querySelector('.stat-label').textContent.includes('Rate');
      const isPlus = !isPercent;
      let count = 0;
      const duration = 1500; // 1.5s animation
      const speed = duration / target;

      const updateCount = () => {
        count++;
        stat.textContent = count + (isPercent && count === target ? '%' : '') + (isPlus && count === target ? '+' : '');
        if (count < target) {
          setTimeout(updateCount, speed);
        } else {
          stat.textContent = target + (isPlus ? '+' : '') + (isPercent ? '%' : '');
        }
      };

      updateCount();
    });
  };

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsSection = document.querySelector('.stats-section');
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  } else if (statNumbers.length > 0) {
    // Fallback
    animateCounters();
  }

  // ==========================================
  // 5. TESTIMONIALS SLIDER / CAROUSEL
  // ==========================================
  const track = document.getElementById('testimonials-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoSlideInterval;

    // Create Navigation Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.slider-dot'));

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateSlider();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    // Auto sliding every 6 seconds
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();
  }

  // ==========================================
  // 6. COURSES ACCORDION (Learn More Drawer)
  // ==========================================
  const courseDetailToggleButtons = document.querySelectorAll('.toggle-course-details');

  courseDetailToggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = btn.getAttribute('data-course');
      const drawer = document.getElementById(`drawer-${courseId}`);
      
      if (drawer) {
        const isOpen = drawer.classList.toggle('open');
        btn.textContent = isOpen ? 'Show Less' : 'Learn More';
        
        // Accessibility updates
        btn.setAttribute('aria-expanded', isOpen);
      }
    });
  });

  // ==========================================
  // 7. COURSE CATEGORY FILTER
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Update active tab button styling
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter course cards
      courseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'adults' && category === 'adults') || (filter === 'students' && category === 'students') || (filter === 'beginners' && category === 'beginners')) {
          card.style.display = 'flex';
          // Re-trigger scroll reveal transitions for items changing visibility
          card.classList.add('active');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 8. MODAL WINDOW CONTROLLERS
  // ==========================================
  const applyModal = document.getElementById('apply-modal');
  const successModal = document.getElementById('success-modal');
  const openApplyButtons = document.querySelectorAll('.open-apply-modal');
  const closeApplyBtn = document.getElementById('close-apply-modal');
  const closeSuccessBtn = document.getElementById('close-success-modal');
  const successOkBtn = document.getElementById('btn-success-ok');

  const openModal = (modal) => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeModal = (modal) => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scroll
  };

  openApplyButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(applyModal));
  });

  if (closeApplyBtn) {
    closeApplyBtn.addEventListener('click', () => closeModal(applyModal));
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => closeModal(successModal));
  }

  if (successOkBtn) {
    successOkBtn.addEventListener('click', () => closeModal(successModal));
  }

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === applyModal) closeModal(applyModal);
    if (e.target === successModal) closeModal(successModal);
  });

  // Close modals on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (applyModal && applyModal.classList.contains('open')) closeModal(applyModal);
      if (successModal && successModal.classList.contains('open')) closeModal(successModal);
    }
  });

  // ==========================================
  // 9. FORM SUBMISSIONS WITH VALIDATION
  // ==========================================
  const demoForm = document.getElementById('demo-form');
  const applyForm = document.getElementById('apply-form');
  const successMessage = document.getElementById('success-message');

  const validateInput = (input) => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--color-error)';
      return false;
    }
    
    // Specific validations
    if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.style.borderColor = 'var(--color-error)';
        return false;
      }
    }
    
    if (input.type === 'tel') {
      const phoneRegex = /^[6-9]\d{9}$/; // 10 digit Indian numbers starting with 6-9
      if (!phoneRegex.test(input.value)) {
        input.style.borderColor = 'var(--color-error)';
        return false;
      }
    }

    input.style.borderColor = 'var(--color-border)';
    return true;
  };

  const handleFormSubmit = (form, successTxt) => {
    const inputs = Array.from(form.querySelectorAll('input, select'));
    let isValid = true;

    inputs.forEach(input => {
      if (input.required) {
        const isInputValid = validateInput(input);
        if (!isInputValid) isValid = false;
        
        // Remove error border on focus
        input.addEventListener('input', () => {
          input.style.borderColor = 'var(--color-border)';
        });
      }
    });

    if (isValid) {
      // Simulate form submission process
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // If it was the apply modal, close it first
        if (form === applyForm) {
          closeModal(applyModal);
        }
        
        // Set success modal message and open it
        if (successMessage) {
          successMessage.textContent = successTxt;
        }
        openModal(successModal);
        
        form.reset(); // Reset fields
      }, 1200); // 1.2s fake submission delay
    }
  };

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(
        demoForm, 
        'Your demo class has been booked successfully! Our study coach will phone you shortly to schedule your preferred date and time.'
      );
    });
  }

  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(
        applyForm,
        'Your admission application has been registered successfully! An admissions counselor will call you within 24 hours to clarify course fee options and batch allocations.'
      );
    });
  }
});
