/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }
}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

/* -----------------------------------------
  Back to Top Button
 ---------------------------------------- */

const backToTopButton = document.querySelector(".back-to-top");
if (backToTopButton) {
  let isBackToTopRendered = false;

  let alterStyles = (isBackToTopRendered) => {
    backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
    backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
    backToTopButton.style.transform = isBackToTopRendered
      ? "scale(1)"
      : "scale(0)";
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 700) {
      isBackToTopRendered = true;
      alterStyles(isBackToTopRendered);
    } else {
      isBackToTopRendered = false;
      alterStyles(isBackToTopRendered);
    }
  });
}

/* -----------------------------------------
  Analytics Tracking for Business Development
 ---------------------------------------- */

// Track important user interactions for business insights
function trackEvent(category, action, label = '') {
  // If Google Analytics is set up
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
  
  // Console log for development
  console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

/* -----------------------------------------
  Scroll Animation Observer
 ---------------------------------------- */

const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Trigger counter animation for stat boxes
      if (entry.target.classList.contains('stat__box') || entry.target.classList.contains('metric__item')) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

/* -----------------------------------------
  Animated Counter
 ---------------------------------------- */

function animateCounter(element) {
  const h3 = element.querySelector('h3');
  if (!h3 || h3.dataset.animated) return;
  
  h3.dataset.animated = 'true';
  const text = h3.textContent;
  const match = text.match(/(\d+)([%+$]?)/);
  
  if (match) {
    const target = parseInt(match[1]);
    const suffix = match[2] || '';
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        h3.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        h3.textContent = target + suffix;
      }
    };
    
    updateCounter();
  }
}

/* -----------------------------------------
  Enhanced Project Gallery System
 ---------------------------------------- */

class ProjectGallery {
  constructor(galleryId, triggerClass) {
    this.gallery = document.getElementById(galleryId);
    this.triggerClass = triggerClass;
    this.currentSlide = 0;
    this.slides = this.gallery ? this.gallery.querySelectorAll('.gallery__slide') : [];
    this.totalSlides = this.slides.length;
    
    if (this.gallery && this.totalSlides > 0) {
      this.init();
    }
  }
  
  init() {
    // Individual project button triggers with data-slide attribute
    document.querySelectorAll(`.${this.triggerClass}`).forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const slideIndex = parseInt(trigger.dataset.slide) || 0;
        this.open(slideIndex);
        trackEvent('Portfolio', 'Gallery_Open', `${this.triggerClass}_slide_${slideIndex}`);
      });
    });
    
    // Navigation buttons
    const prevBtn = this.gallery.querySelector('.gallery__btn--prev');
    const nextBtn = this.gallery.querySelector('.gallery__btn--next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Dot navigation
    const dots = this.gallery.querySelectorAll('.gallery__dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Close handlers
    const closeBtn = this.gallery.querySelector('.modal__close');
    const overlay = this.gallery.querySelector('.modal__overlay');
    
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (overlay) overlay.addEventListener('click', () => this.close());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.gallery.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prevSlide();
          break;
        case 'ArrowRight':
          this.nextSlide();
          break;
      }
    });
  }
  
  open(slideIndex = 0) {
    this.currentSlide = slideIndex;
    this.gallery.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateSlide();
  }
  
  close() {
    this.gallery.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  updateSlide() {
    // Hide all slides
    this.slides.forEach(slide => slide.classList.remove('active'));
    
    // Show current slide
    if (this.slides[this.currentSlide]) {
      this.slides[this.currentSlide].classList.add('active');
    }
    
    // Update counter
    const counter = this.gallery.querySelector('.gallery__counter');
    if (counter) {
      counter.textContent = `${this.currentSlide + 1} / ${this.totalSlides}`;
    }
    
    // Update dots
    const dots = this.gallery.querySelectorAll('.gallery__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
    
    // Update navigation button states
    const prevBtn = this.gallery.querySelector('.gallery__btn--prev');
    const nextBtn = this.gallery.querySelector('.gallery__btn--next');
    
    if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
  }
  
  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateSlide();
      trackEvent('Portfolio', 'Gallery_Navigate', 'Next');
    }
  }
  
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlide();
      trackEvent('Portfolio', 'Gallery_Navigate', 'Previous');
    }
  }
  
  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.currentSlide = index;
      this.updateSlide();
      trackEvent('Portfolio', 'Gallery_Navigate', `Slide_${index + 1}`);
    }
  }
}

/* -----------------------------------------
  AdventureWorks Image Gallery (Simple Modal)
 ---------------------------------------- */

class AdventureWorksGallery {
  constructor() {
    this.modal = document.getElementById('adventureworksGallery');
    if (!this.modal) return;
    
    this.modalImage = this.modal.querySelector('.modal__image');
    this.modalCaption = this.modal.querySelector('.modal__caption');
    this.closeBtn = this.modal.querySelector('.modal__close');
    this.overlay = this.modal.querySelector('.modal__overlay');
    this.prevBtn = this.modal.querySelector('.gallery__btn--prev');
    this.nextBtn = this.modal.querySelector('.gallery__btn--next');
    this.counter = this.modal.querySelector('.gallery__counter');
    this.dots = this.modal.querySelectorAll('.gallery__dot');
    
    this.currentIndex = 0;
    this.galleryImages = [
      {
        src: './images/pbi-adventureworks-1-home.jpg',
        alt: 'AdventureWorks Home Dashboard - Main overview with key metrics and performance indicators'
      },
      {
        src: './images/pbi-adventureworks-2-overview.jpg',
        alt: 'AdventureWorks Overview Dashboard - Comprehensive business analytics and trends'
      },
      {
        src: './images/pbi-adventureworks-3-territory.jpg',
        alt: 'Territory Performance Analysis - Geographic sales performance and territory insights'
      },
      {
        src: './images/pbi-adventureworks-4-products.jpg',
        alt: 'Product Analysis Dashboard - Product performance metrics and profitability analysis'
      }
    ];
    
    this.init();
  }
  
  init() {
    // Click handlers for AdventureWorks gallery triggers
    document.querySelectorAll('.adventureworks-gallery-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(0);
        trackEvent('Portfolio', 'AdventureWorks_Gallery_Open', '');
      });
    });
    
    // Navigation buttons
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevImage());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextImage());
    
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToImage(index));
    });
    
    // Close handlers
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
  }
  
  open(index = 0) {
    this.currentIndex = index;
    this.updateDisplay();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
      if (this.modalImage) this.modalImage.src = '';
      if (this.modalCaption) this.modalCaption.textContent = '';
    }, 300);
  }
  
  updateDisplay() {
    const currentImage = this.galleryImages[this.currentIndex];
    if (this.modalImage) {
      this.modalImage.src = currentImage.src;
      this.modalImage.alt = currentImage.alt;
    }
    if (this.modalCaption) {
      this.modalCaption.textContent = currentImage.alt;
    }
    
    if (this.counter) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.galleryImages.length}`;
    }
    
    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update navigation button states
    if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.galleryImages.length - 1;
  }
  
  nextImage() {
    if (this.currentIndex < this.galleryImages.length - 1) {
      this.currentIndex++;
      this.updateDisplay();
      trackEvent('Portfolio', 'AdventureWorks_Navigate', 'Next');
    }
  }
  
  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplay();
      trackEvent('Portfolio', 'AdventureWorks_Navigate', 'Previous');
    }
  }
  
  goToImage(index) {
    if (index >= 0 && index < this.galleryImages.length) {
      this.currentIndex = index;
      this.updateDisplay();
      trackEvent('Portfolio', 'AdventureWorks_Navigate', `Image_${index + 1}`);
    }
  }
}

/* -----------------------------------------
  FIXED: Case Study Modal System - Proper Modal Creation
 ---------------------------------------- */

class CaseStudyModal {
  constructor() {
    this.modal = null;
    this.modalCreated = false;
    this.caseStudies = {
      'servicetitan-xero': {
        title: 'ServiceTitan to Xero Integration',
        challenge: 'ABC Plumbing was spending 12+ hours weekly manually reconciling invoices between ServiceTitan and Xero. Batch imports created single entries for multiple invoices, making reconciliation nearly impossible and leading to accounting errors, delayed financial reporting, and frustrated administrative staff.',
        solution: 'Built a custom Power Automate flow that monitors ServiceTitan for new invoices, extracts individual invoice data, creates corresponding Xero invoices with proper matching, sends confirmation notifications to the accounting team, and maintains detailed logs for audit trail. The solution includes duplicate detection, error handling, and automated retry mechanisms.',
        results: [
          'Time Savings: Reduced from 12 hours to 30 minutes weekly (95% reduction)',
          'Accuracy: Eliminated reconciliation errors completely',
          'Cost Savings: $15,000 annually in administrative time',
          'ROI: 400% return on investment within 3 months',
          'Process Improvement: Automated audit trail for compliance'
        ],
        testimonial: {
          text: "This automation transformed our accounting process completely. What used to take our bookkeeper most of Monday morning now happens automatically. The accuracy is perfect, and we can focus on growing the business instead of wrestling with invoice matching.",
          author: "Sarah Johnson, Operations Manager, ABC Plumbing"
        },
        image: './images/automation-servicetitan-xero.jpg',
        techStack: ['Power Automate', 'ServiceTitan API', 'Xero Integration', 'Data Transformation', 'Error Handling']
      },
      'work-order-automation': {
        title: 'Email Work Order Automation',
        challenge: 'Manual work order processing was causing significant delays in job creation and impacting customer satisfaction. Email work orders required manual data entry, leading to delays, data entry errors, and missed service appointments. The manual process took 20-30 minutes per work order.',
        solution: 'Automated workflow that processes email work orders directly into the job management system with instant notifications to technicians, automatic customer confirmations, priority routing based on service type, and integration with scheduling systems for optimal resource allocation.',
        results: [
          'Processing Time: Instant job creation from email work orders',
          'Customer Satisfaction: 40% improvement in response times',
          'Error Reduction: 90% fewer data entry mistakes',
          'Team Productivity: 8 hours weekly saved on administrative tasks',
          'Service Quality: 25% increase in first-call resolution'
        ],
        testimonial: {
          text: "Our response time to new work orders went from hours to minutes. Customers notice the difference, and our team can focus on actual service delivery instead of paperwork. It's been a game-changer for our business.",
          author: "Mike Rodriguez, Service Manager, Premier HVAC"
        },
        image: './images/automation-work-order.jpg',
        techStack: ['Power Automate', 'Email Processing', 'Job Management Integration', 'Customer Notifications', 'Priority Routing']
      }
    };
    
    this.init();
  }
  
  // FIXED: Create modal only when needed and ensure proper CSS
  createModal() {
    if (this.modalCreated) return;
    
    // Create modal container with proper CSS classes for hiding
    const modalContainer = document.createElement('div');
    modalContainer.id = 'caseStudyModal';
    modalContainer.className = 'case-study-modal';
    modalContainer.style.display = 'none'; // Explicitly hide initially
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.zIndex = '9999';
    modalContainer.style.visibility = 'hidden';
    modalContainer.style.opacity = '0';
    
    modalContainer.innerHTML = `
      <div class="case-study-modal__overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9);"></div>
      <div class="case-study-modal__content" style="position: relative; background: white; border-radius: 12px; max-width: 90vw; max-height: 90vh; overflow-y: auto; z-index: 10000; margin: auto; animation: modalSlideIn 0.3s ease-out;">
        <button class="case-study-modal__close" style="position: absolute; top: 2rem; right: 2rem; background: white; border: none; font-size: 3rem; cursor: pointer; z-index: 10001; width: 4rem; height: 4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); color: #333; transition: all 0.3s ease;">&times;</button>
        <div class="case-study-modal__header" style="padding: 3rem; text-align: center;">
          <img class="case-study-modal__image" src="" alt="" style="width: 100%; max-width: 60rem; height: auto; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
          <h2 class="case-study-modal__title" style="color: #1f2937; margin: 0;"></h2>
        </div>
        <div class="case-study-modal__body" style="padding: 0 3rem 3rem;">
          <div class="case-study-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2563eb; margin-bottom: 1rem; font-size: 2.8rem;">The Challenge</h3>
            <p class="case-study-challenge" style="font-size: 2.2rem; line-height: 1.6; color: #333;"></p>
          </div>
          <div class="case-study-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2563eb; margin-bottom: 1rem; font-size: 2.8rem;">The Solution</h3>
            <p class="case-study-solution" style="font-size: 2.2rem; line-height: 1.6; color: #333;"></p>
          </div>
          <div class="case-study-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2563eb; margin-bottom: 1rem; font-size: 2.8rem;">Technology Stack</h3>
            <div class="case-study-tech-stack" style="display: flex; flex-wrap: wrap; gap: 1rem;"></div>
          </div>
          <div class="case-study-section" style="margin-bottom: 2rem;">
            <h3 style="color: #2563eb; margin-bottom: 1rem; font-size: 2.8rem;">The Results</h3>
            <ul class="case-study-results" style="list-style: none; padding: 0;"></ul>
          </div>
          <div class="case-study-section case-study-testimonial">
            <h3 style="color: #2563eb; margin-bottom: 1rem; font-size: 2.8rem;">Client Testimonial</h3>
            <blockquote style="background: #f3f4f6; padding: 2rem; border-radius: 12px; border-left: 4px solid #2563eb; margin: 0;">
              <p class="testimonial-text" style="font-style: italic; font-size: 2.2rem; line-height: 1.6; margin-bottom: 1rem;"></p>
              <cite class="testimonial-author" style="display: block; font-weight: bold; color: #2563eb; font-size: 1.8rem;"></cite>
            </blockquote>
          </div>
        </div>
        <div class="case-study-modal__footer" style="padding: 2rem 3rem 3rem; text-align: center;">
          <button class="btn btn--primary case-study-cta" style="background: linear-gradient(to right, #2563eb 0%, #059669 100%); color: white; border: none; padding: 1rem 4.2rem; border-radius: 6px; font-size: 1.8rem; cursor: pointer; transition: all 0.3s ease;">
            Get Similar Results for Your Business
          </button>
        </div>
      </div>
    `;
    
    // Append to body but keep it hidden
    document.body.appendChild(modalContainer);
    this.modal = modalContainer;
    this.modalCreated = true;
    
    console.log('Case study modal created and hidden properly');
  }
  
  init() {
    // Add click handlers to case study triggers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('case-study-trigger')) {
        e.preventDefault();
        const caseStudyId = e.target.dataset.caseStudy;
        this.open(caseStudyId);
      }
    });
  }
  
  open(caseStudyId) {
    // Create modal only when needed
    if (!this.modalCreated) {
      this.createModal();
    }
    
    const caseStudy = this.caseStudies[caseStudyId];
    if (!caseStudy || !this.modal) return;
    
    // Populate modal content
    const image = this.modal.querySelector('.case-study-modal__image');
    const title = this.modal.querySelector('.case-study-modal__title');
    const challenge = this.modal.querySelector('.case-study-challenge');
    const solution = this.modal.querySelector('.case-study-solution');
    const techStackContainer = this.modal.querySelector('.case-study-tech-stack');
    const resultsList = this.modal.querySelector('.case-study-results');
    const testimonialText = this.modal.querySelector('.testimonial-text');
    const testimonialAuthor = this.modal.querySelector('.testimonial-author');
    
    if (image) {
      image.src = caseStudy.image;
      image.alt = caseStudy.title;
    }
    if (title) title.textContent = caseStudy.title;
    if (challenge) challenge.textContent = caseStudy.challenge;
    if (solution) solution.textContent = caseStudy.solution;
    
    // Populate tech stack
    if (techStackContainer) {
      techStackContainer.innerHTML = '';
      caseStudy.techStack.forEach(tech => {
        const badge = document.createElement('span');
        badge.style.cssText = 'background: #2563eb; color: white; padding: 0.8rem 1.5rem; border-radius: 20px; font-size: 1.4rem; font-weight: normal;';
        badge.textContent = tech;
        techStackContainer.appendChild(badge);
      });
    }
    
    // Populate results list
    if (resultsList) {
      resultsList.innerHTML = '';
      caseStudy.results.forEach(result => {
        const li = document.createElement('li');
        li.style.cssText = 'padding: 0.8rem 0; position: relative; padding-left: 2.5rem; color: #333; font-size: 2.2rem; line-height: 1.6;';
        li.innerHTML = `<span style="position: absolute; left: 0; color: #059669; font-weight: bold; font-size: 1.8rem;">✓</span>${result}`;
        resultsList.appendChild(li);
      });
    }
    
    // Populate testimonial
    if (testimonialText) testimonialText.textContent = caseStudy.testimonial.text;
    if (testimonialAuthor) testimonialAuthor.textContent = caseStudy.testimonial.author;
    
    // Set up event listeners (only once)
    if (!this.modal.dataset.listenersAttached) {
      const closeBtn = this.modal.querySelector('.case-study-modal__close');
      const overlay = this.modal.querySelector('.case-study-modal__overlay');
      const ctaBtn = this.modal.querySelector('.case-study-cta');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
      if (overlay) {
        overlay.addEventListener('click', () => this.close());
      }
      if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
          trackEvent('CaseStudy', 'CTA_Click', 'Contact_From_Modal');
          const contactSection = document.querySelector('#contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
          this.close();
        });
      }
      
      // Keyboard navigation
      const keyHandler = (e) => {
        if (e.key === 'Escape' && this.modal.style.display === 'flex') {
          this.close();
        }
      };
      document.addEventListener('keydown', keyHandler);
      
      this.modal.dataset.listenersAttached = 'true';
    }
    
    // Show modal with proper animation
    this.modal.style.display = 'flex';
    this.modal.style.visibility = 'visible';
    this.modal.style.opacity = '1';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';
    
    // Track case study view
    trackEvent('CaseStudy', 'View', caseStudy.title);
  }
  
  close() {
    if (!this.modal) return;
    
    this.modal.style.opacity = '0';
    this.modal.style.visibility = 'hidden';
    
    setTimeout(() => {
      this.modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
}

/* -----------------------------------------
  ROI Calculator System
 ---------------------------------------- */

class ROICalculator {
  constructor() {
    this.calculator = null;
    this.calculatorCreated = false;
    this.init();
  }
  
  createCalculator() {
    if (this.calculatorCreated) return;
    
    const calculatorContainer = document.createElement('div');
    calculatorContainer.id = 'roiCalculator';
    calculatorContainer.className = 'roi-calculator';
    calculatorContainer.style.display = 'none';
    calculatorContainer.style.position = 'fixed';
    calculatorContainer.style.top = '0';
    calculatorContainer.style.left = '0';
    calculatorContainer.style.width = '100%';
    calculatorContainer.style.height = '100%';
    calculatorContainer.style.zIndex = '9999';
    calculatorContainer.style.visibility = 'hidden';
    calculatorContainer.style.opacity = '0';
    
    calculatorContainer.innerHTML = `
      <div class="roi-calculator__overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9);"></div>
      <div class="roi-calculator__content" style="position: relative; background: white; border-radius: 12px; max-width: 60rem; max-height: 90vh; overflow-y: auto; z-index: 10000; padding: 3rem; animation: modalSlideIn 0.3s ease-out; margin: auto;">
        <button class="roi-calculator__close" style="position: absolute; top: 2rem; right: 2rem; background: white; border: none; font-size: 3rem; cursor: pointer; z-index: 10001; width: 4rem; height: 4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); color: #333; transition: all 0.3s ease;">&times;</button>
        <h3 style="color: #1f2937; text-align: center; margin-bottom: 1rem; font-size: 3.6rem;">Automation ROI Calculator</h3>
        <p style="text-align: center; color: #333; margin-bottom: 2rem; font-size: 2.2rem;">See how much time and money automation could save your business</p>
        
        <div class="roi-calculator__form" style="margin-bottom: 2rem;">
          <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 0.8rem; color: #1f2937; font-size: 1.8rem;">Hours spent weekly on manual processes</label>
            <input type="number" id="hoursWeekly" placeholder="e.g., 10" min="1" max="80" style="width: 100%; padding: 1.2rem; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 1.8rem; font-family: inherit; transition: border-color 0.3s ease;">
          </div>
          
          <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 0.8rem; color: #1f2937; font-size: 1.8rem;">Average hourly rate of staff doing this work ($)</label>
            <input type="number" id="hourlyRate" placeholder="e.g., 25" min="10" max="200" style="width: 100%; padding: 1.2rem; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 1.8rem; font-family: inherit; transition: border-color 0.3s ease;">
          </div>
          
          <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; font-weight: bold; margin-bottom: 0.8rem; color: #1f2937; font-size: 1.8rem;">Estimated automation project cost ($)</label>
            <input type="number" id="automationCost" placeholder="e.g., 5000" min="1000" max="50000" style="width: 100%; padding: 1.2rem; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 1.8rem; font-family: inherit; transition: border-color 0.3s ease;">
          </div>
          
          <button class="roi-calculator__calculate" style="width: 100%; margin-top: 2rem; background: linear-gradient(to right, #2563eb 0%, #059669 100%); color: white; border: none; padding: 1rem 4.2rem; border-radius: 6px; font-size: 1.8rem; cursor: pointer; transition: all 0.3s ease;">Calculate ROI</button>
        </div>
        
        <div class="roi-calculator__results" style="display: none; background: #f3f4f6; padding: 2rem; border-radius: 12px; border-left: 4px solid #059669;">
          <h4 style="color: #1f2937; text-align: center; margin-bottom: 2rem; font-size: 2.8rem;">Your Automation ROI</h4>
          <div class="roi-results" style="margin-bottom: 2rem;">
            <div class="roi-metric" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e5e7eb;">
              <span class="roi-label" style="font-weight: bold; color: #1f2937; font-size: 1.8rem;">Annual Cost Savings:</span>
              <span class="roi-value" id="annualSavings" style="font-weight: bold; color: #059669; font-size: 2.2rem;">$0</span>
            </div>
            <div class="roi-metric" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #e5e7eb;">
              <span class="roi-label" style="font-weight: bold; color: #1f2937; font-size: 1.8rem;">Payback Period:</span>
              <span class="roi-value" id="paybackPeriod" style="font-weight: bold; color: #059669; font-size: 2.2rem;">0 months</span>
            </div>
            <div class="roi-metric" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0;">
              <span class="roi-label" style="font-weight: bold; color: #1f2937; font-size: 1.8rem;">3-Year ROI:</span>
              <span class="roi-value" id="threeYearROI" style="font-weight: bold; color: #059669; font-size: 2.2rem;">0%</span>
            </div>
          </div>
          <div class="roi-cta" style="text-align: center; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
            <p style="margin-bottom: 2rem; color: #333; font-size: 1.8rem;">Ready to achieve these results? Let's discuss your automation opportunities.</p>
            <button class="roi-calculator__contact" style="background: linear-gradient(to right, #2563eb 0%, #059669 100%); color: white; border: none; padding: 1rem 4.2rem; border-radius: 6px; font-size: 1.8rem; cursor: pointer; transition: all 0.3s ease;">Schedule Free Consultation</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(calculatorContainer);
    this.calculator = calculatorContainer;
    this.calculatorCreated = true;
  }
  
  init() {
    // Add trigger for ROI calculator
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('roi-calculator-trigger')) {
        e.preventDefault();
        this.open();
      }
    });
  }
  
  open() {
    if (!this.calculatorCreated) {
      this.createCalculator();
      this.setupEventListeners();
    }
    
    this.calculator.style.display = 'flex';
    this.calculator.style.visibility = 'visible';
    this.calculator.style.opacity = '1';
    this.calculator.style.alignItems = 'center';
    this.calculator.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';
    trackEvent('ROI_Calculator', 'Open', '');
  }
  
  close() {
    if (!this.calculator) return;
    
    this.calculator.style.opacity = '0';
    this.calculator.style.visibility = 'hidden';
    
    setTimeout(() => {
      this.calculator.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }
  
  setupEventListeners() {
    if (!this.calculator) return;
    
    // Close handlers
    const closeBtn = this.calculator.querySelector('.roi-calculator__close');
    const overlay = this.calculator.querySelector('.roi-calculator__overlay');
    
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (overlay) overlay.addEventListener('click', () => this.close());
    
    // Calculate button
    const calculateBtn = this.calculator.querySelector('.roi-calculator__calculate');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => this.calculateROI());
    }
    
    // Contact button
    const contactBtn = this.calculator.querySelector('.roi-calculator__contact');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        trackEvent('ROI_Calculator', 'Contact_Click', 'From_Results');
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        this.close();
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.calculator.style.display === 'flex') {
        this.close();
      }
    });
  }
  
  calculateROI() {
    const hoursWeekly = parseFloat(document.getElementById('hoursWeekly').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
    const automationCost = parseFloat(document.getElementById('automationCost').value) || 0;
    
    if (hoursWeekly <= 0 || hourlyRate <= 0 || automationCost <= 0) {
      alert('Please fill in all fields with valid numbers');
      return;
    }
    
    // Calculate savings (assuming 80% time reduction)
    const weeklySavings = hoursWeekly * hourlyRate * 0.8;
    const annualSavings = weeklySavings * 52;
    const paybackMonths = Math.ceil(automationCost / (weeklySavings * 4.33));
    const threeYearSavings = annualSavings * 3;
    const threeYearROI = Math.round(((threeYearSavings - automationCost) / automationCost) * 100);
    
    // Display results
    const annualSavingsEl = document.getElementById('annualSavings');
    const paybackPeriodEl = document.getElementById('paybackPeriod');
    const threeYearROIEl = document.getElementById('threeYearROI');
    
    if (annualSavingsEl) annualSavingsEl.textContent = `$${annualSavings.toLocaleString()}`;
    if (paybackPeriodEl) paybackPeriodEl.textContent = `${paybackMonths} months`;
    if (threeYearROIEl) threeYearROIEl.textContent = `${threeYearROI}%`;
    
    // Show results
    const resultsSection = this.calculator.querySelector('.roi-calculator__results');
    if (resultsSection) {
      resultsSection.style.display = 'block';
      
      // Scroll to results
      resultsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
    
    trackEvent('ROI_Calculator', 'Calculate', `Annual_Savings_${Math.round(annualSavings/1000)}k`);
  }
}

/* -----------------------------------------
  Platform Analysis Download System
 ---------------------------------------- */

class PlatformAnalysisDownload {
  constructor() {
    this.init();
  }
  
  init() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('platform-analysis-trigger')) {
        e.preventDefault();
        this.showDownloadForm();
      }
    });
  }
  
  showDownloadForm() {
    this.createDownloadPopup();
    trackEvent('Platform_Analysis', 'Download_Triggered', '');
  }
  
  createDownloadPopup() {
    const popup = document.createElement('div');
    popup.id = 'analysisDownloadPopup';
    popup.className = 'lead-popup';
    popup.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    
    popup.innerHTML = `
      <div class="lead-popup__overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9);"></div>
      <div class="lead-popup__content" style="position: relative; background: white; border-radius: 12px; max-width: 50rem; max-height: 90vh; overflow-y: auto; z-index: 10000; padding: 3rem; animation: modalSlideIn 0.3s ease-out;">
        <button class="lead-popup__close" style="position: absolute; top: 2rem; right: 2rem; background: white; border: none; font-size: 3rem; cursor: pointer; z-index: 10001; width: 4rem; height: 4rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); color: #333; transition: all 0.3s ease;">&times;</button>
        <div class="lead-popup__header">
          <h3 style="color: #1f2937; text-align: center; margin-bottom: 1rem; font-size: 3.6rem;">Download Complete Power Platform Analysis</h3>
          <p style="text-align: center; color: #333; margin-bottom: 2rem; line-height: 1.6; font-size: 2.2rem;">Get the comprehensive analysis comparing Power Platform to alternatives, including detailed ROI calculations and implementation strategies.</p>
          <ul class="analysis-benefits" style="list-style: none; padding: 0; margin-bottom: 2rem; background: #f3f4f6; padding: 2rem; border-radius: 8px;">
            <li style="padding: 0.5rem 0; color: #333; font-size: 1.8rem;">✓ 3-Year Total Cost Comparison</li>
            <li style="padding: 0.5rem 0; color: #333; font-size: 1.8rem;">✓ Security & Compliance Analysis</li>
            <li style="padding: 0.5rem 0; color: #333; font-size: 1.8rem;">✓ Real Client Success Stories</li>
            <li style="padding: 0.5rem 0; color: #333; font-size: 1.8rem;">✓ Implementation Framework</li>
          </ul>
        </div>
        <div class="lead-popup__form" style="margin-bottom: 2rem;">
          <input type="email" placeholder="Enter your business email" class="lead-popup__email" required style="width: 100%; padding: 1.2rem; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 1.8rem; font-family: inherit; margin-bottom: 2rem; transition: border-color 0.3s ease;">
          <button class="lead-popup__submit" style="width: 100%; background: linear-gradient(to right, #2563eb 0%, #059669 100%); color: white; border: none; padding: 1rem 4.2rem; border-radius: 6px; font-size: 1.8rem; cursor: pointer; transition: all 0.3s ease;">Download Analysis</button>
        </div>
        <p class="lead-popup__privacy" style="text-align: center; font-size: 1.2rem; color: #333; margin: 0; font-style: italic;">
          No spam. Unsubscribe anytime. Your information is secure.
        </p>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Handle form submission
    const submitBtn = popup.querySelector('.lead-popup__submit');
    const emailInput = popup.querySelector('.lead-popup__email');
    
    if (submitBtn && emailInput) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        
        if (this.validateEmail(email)) {
          this.submitAnalysisRequest(email);
          this.showAnalysisThankYou(popup);
          trackEvent('Platform_Analysis', 'Download_Submit', 'Success');
        } else {
          alert('Please enter a valid business email address');
        }
      });
    }
    
    // Close handlers
    const closeBtn = popup.querySelector('.lead-popup__close');
    const overlay = popup.querySelector('.lead-popup__overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closePopup(popup);
        trackEvent('Platform_Analysis', 'Download_Closed', '');
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closePopup(popup);
        trackEvent('Platform_Analysis', 'Download_Closed', '');
      });
    }
  }
  
  validateEmail(email) {
    const businessEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return businessEmailPattern.test(email);
  }
  
  submitAnalysisRequest(email) {
    const requestData = {
      email: email,
      source: 'platform_analysis_download',
      document: 'power_platform_competitive_analysis',
      timestamp: new Date().toISOString()
    };
    
    console.log('Analysis download request:', requestData);
  }
  
  showAnalysisThankYou(popup) {
    const content = popup.querySelector('.lead-popup__content');
    if (content) {
      content.innerHTML = `
        <div class="lead-popup__thank-you" style="text-align: center; padding: 2rem;">
          <h3 style="color: #059669; margin-bottom: 2rem; font-size: 3.6rem;">Thank You!</h3>
          <p style="color: #333; margin-bottom: 2rem; line-height: 1.6; font-size: 2.2rem;">Check your email for the Power Platform Analysis PDF. You'll also receive strategic automation insights to help grow your business.</p>
          <button class="lead-popup__continue" style="background: linear-gradient(to right, #2563eb 0%, #059669 100%); color: white; border: none; padding: 1rem 4.2rem; border-radius: 6px; font-size: 1.8rem; cursor: pointer; transition: all 0.3s ease;">Continue Browsing</button>
        </div>
      `;
      
      const continueBtn = content.querySelector('.lead-popup__continue');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          this.closePopup(popup);
        });
      }
    }
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      this.closePopup(popup);
    }, 5000);
  }
  
  closePopup(popup) {
    if (popup && popup.parentNode) {
      popup.style.opacity = '0';
      setTimeout(() => {
        popup.remove();
      }, 300);
    }
  }
}

/* -----------------------------------------
  Smooth Scrolling for Anchor Links
 ---------------------------------------- */

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        trackEvent('Navigation', 'Anchor_Click', this.getAttribute('href'));
      }
    });
  });
}

/* -----------------------------------------
  Contact Form Enhancement
 ---------------------------------------- */

function initContactForm() {
  const contactForm = document.querySelector('.contact__form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    trackEvent('Contact', 'Form_Submit', 'Contact_Form');
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      showFormSuccess();
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });
}

function showFormSuccess() {
  const successMessage = document.createElement('div');
  successMessage.className = 'form-success';
  successMessage.style.cssText = 'background: #059669; color: white; padding: 2rem; border-radius: 8px; margin: 2rem 0; text-align: center;';
  successMessage.innerHTML = `
    <h4 style="margin-bottom: 1rem; font-size: 2.8rem;">Message Sent Successfully!</h4>
    <p style="margin: 0; font-size: 2.2rem;">Thank you for your interest. I'll get back to you within 24 hours to discuss your automation needs.</p>
  `;
  
  const contactForm = document.querySelector('.contact__form-container');
  if (contactForm) {
    contactForm.appendChild(successMessage);
    
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 5000);
  }
}

/* -----------------------------------------
  Performance Optimization
 ---------------------------------------- */

function initPerformanceOptimizations() {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Preload critical images
  const criticalImages = [
    './images/header.jpg',
    './images/allan-ramirez-fun.jpg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/* -----------------------------------------
  Initialize All Components
 ---------------------------------------- */

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialization started');
  
  // Initialize scroll animations
  const statBoxes = document.querySelectorAll('.stat__box, .metric__item');
  statBoxes.forEach((box, index) => {
    scrollObserver.observe(box);
  });
  
  // Initialize gallery systems
  new ProjectGallery('automationGallery', 'automation-gallery-trigger');
  new ProjectGallery('powerbiGallery', 'powerbi-gallery-trigger');
  new AdventureWorksGallery();
  
  // Initialize modal systems
  new CaseStudyModal();
  new ROICalculator();
  new PlatformAnalysisDownload();
  
  // Initialize other functionality
  initSmoothScrolling();
  initContactForm();
  initPerformanceOptimizations();
  
  // Track page view
  trackEvent('Page', 'View', 'Portfolio_Home');
  
  // Track time on page
  let timeOnPage = 0;
  setInterval(() => {
    timeOnPage += 30;
    if (timeOnPage % 120 === 0) {
      trackEvent('Engagement', 'Time_on_Page', `${timeOnPage}s`);
    }
  }, 30000);
  
  // Track scroll depth for engagement
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      trackEvent('Engagement', 'Scroll_Depth', `${scrollPercent}%`);
    }
  });
  
  console.log('Portfolio initialization completed');
});
