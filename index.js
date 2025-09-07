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
      if (entry.target.classList.contains('stat__box')) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
  // Add animation classes to elements
  const statBoxes = document.querySelectorAll('.stat__box, .metric__item');
  statBoxes.forEach((box, index) => {
    box.classList.add('animate-scale', `delay-${(index % 4) + 1}`);
    scrollObserver.observe(box);
  });
  
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('animate-on-scroll');
    scrollObserver.observe(section);
  });
  
  // Observe other elements
  document.querySelectorAll('.about__content, .testimonial, .contact__info').forEach(el => {
    el.classList.add('animate-on-scroll');
    scrollObserver.observe(el);
  });

  // Track contact button clicks
  document.querySelectorAll('a[href*="mailto"], a[href*="tel"]').forEach(link => {
    link.addEventListener('click', () => {
      const type = link.href.includes('mailto') ? 'email' : 'phone';
      trackEvent('Contact', 'Click', type);
    });
  });
  
  // Track scroll depth for engagement
  let maxScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
      maxScroll = scrollPercent;
      trackEvent('Engagement', 'Scroll_Depth', `${scrollPercent}%`);
    }
  });
  
  // Track time on page
  let timeOnPage = 0;
  setInterval(() => {
    timeOnPage += 30;
    if (timeOnPage % 120 === 0) { // Every 2 minutes
      trackEvent('Engagement', 'Time_on_Page', `${timeOnPage}s`);
    }
  }, 30000);
});

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
  Project Gallery System
 ---------------------------------------- */

class ProjectGallery {
  constructor(galleryId, triggerClass) {
    this.gallery = document.getElementById(galleryId);
    this.triggerClass = triggerClass;
    this.currentSlide = 0;
    this.slides = this.gallery.querySelectorAll('.gallery__slide');
    this.totalSlides = this.slides.length;
    
    this.init();
  }
  
  init() {
    // Gallery trigger buttons
    document.querySelectorAll(`.${this.triggerClass}`).forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
        trackEvent('Portfolio', 'Gallery_Open', this.triggerClass);
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
  
  open() {
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
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlide();
    trackEvent('Portfolio', 'Gallery_Navigate', 'Next');
  }
  
  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.updateSlide();
    trackEvent('Portfolio', 'Gallery_Navigate', 'Previous');
  }
  
  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlide();
    trackEvent('Portfolio', 'Gallery_Navigate', `Slide_${index + 1}`);
  }
}

/* -----------------------------------------
  AdventureWorks Image Gallery (Original)
 ---------------------------------------- */

class AdventureWorksGallery {
  constructor() {
    this.modal = document.getElementById('adventureworksGallery');
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
        alt: 'AdventureWorks Home Dashboard'
      },
      {
        src: './images/pbi-adventureworks-2-overview.jpg',
        alt: 'AdventureWorks Overview Dashboard'
      },
      {
        src: './images/pbi-adventureworks-3-territory.jpg',
        alt: 'Territory Performance Analysis'
      },
      {
        src: './images/pbi-adventureworks-4-products.jpg',
        alt: 'Product Analysis Dashboard'
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
    this.prevBtn.addEventListener('click', () => this.prevImage());
    this.nextBtn.addEventListener('click', () => this.nextImage());
    
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToImage(index));
    });
    
    // Close handlers
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    
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
      this.modalImage.src = '';
      this.modalCaption.textContent = '';
    }, 300);
  }
  
  updateDisplay() {
    const currentImage = this.galleryImages[this.currentIndex];
    this.modalImage.src = currentImage.src;
    this.modalCaption.textContent = currentImage.alt;
    this.counter.textContent = `${this.currentIndex + 1} / ${this.galleryImages.length}`;
    
    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
    this.updateDisplay();
  }
  
  prevImage() {
    this.currentIndex = this.currentIndex === 0 ? this.galleryImages.length - 1 : this.currentIndex - 1;
    this.updateDisplay();
  }
  
  goToImage(index) {
    this.currentIndex = index;
    this.updateDisplay();
  }
}

/* -----------------------------------------
  Case Study Modal System
 ---------------------------------------- */

class CaseStudyModal {
  constructor() {
    this.modal = null;
    this.createModal();
    this.caseStudies = {
      'servicetitan-xero': {
        title: 'ServiceTitan to Xero Integration',
        challenge: 'ABC Plumbing was spending 12+ hours weekly manually reconciling invoices between ServiceTitan and Xero. Batch imports created single entries for multiple invoices, making reconciliation nearly impossible and leading to accounting errors.',
        solution: 'Built a custom Power Automate flow that monitors ServiceTitan for new invoices, extracts individual invoice data, creates corresponding Xero invoices with proper matching, and maintains detailed logs for audit trail.',
        results: [
          'Time Savings: Reduced from 12 hours to 30 minutes weekly (95% reduction)',
          'Accuracy: Eliminated reconciliation errors completely',
          'Cost Savings: $15,000 annually in administrative time',
          'ROI: 400% return on investment within 3 months'
        ],
        testimonial: {
          text: "This automation transformed our accounting process completely. What used to take our bookkeeper most of Monday morning now happens automatically. The accuracy is perfect, and we can focus on growing the business instead of wrestling with invoice matching.",
          author: "Sarah Johnson, Operations Manager"
        },
        image: './images/automation-servicetitan-xero.jpg'
      },
      'work-order-automation': {
        title: 'Email Work Order Automation',
        challenge: 'Manual work order processing was causing delays in job creation and impacting customer satisfaction. Email work orders required manual data entry, leading to delays and errors.',
        solution: 'Automated workflow from email work orders directly into the job management system with instant notifications to technicians and automatic customer confirmations.',
        results: [
          'Processing Time: Instant job creation from email work orders',
          'Customer Satisfaction: 40% improvement in response times',
          'Error Reduction: 90% fewer data entry mistakes',
          'Team Productivity: 8 hours weekly saved on administrative tasks'
        ],
        testimonial: {
          text: "Our response time to new work orders went from hours to minutes. Customers notice the difference, and our team can focus on actual service delivery instead of paperwork.",
          author: "Mike Rodriguez, Service Manager"
        },
        image: './images/automation-work-order.jpg'
      }
    };
    
    this.init();
  }
  
  createModal() {
    const modalHTML = `
      <div id="caseStudyModal" class="case-study-modal">
        <div class="case-study-modal__overlay"></div>
        <div class="case-study-modal__content">
          <button class="case-study-modal__close">&times;</button>
          <div class="case-study-modal__header">
            <img class="case-study-modal__image" src="" alt="">
            <h2 class="case-study-modal__title"></h2>
          </div>
          <div class="case-study-modal__body">
            <div class="case-study-section">
              <h3>The Challenge</h3>
              <p class="case-study-challenge"></p>
            </div>
            <div class="case-study-section">
              <h3>The Solution</h3>
              <p class="case-study-solution"></p>
            </div>
            <div class="case-study-section">
              <h3>The Results</h3>
              <ul class="case-study-results"></ul>
            </div>
            <div class="case-study-section case-study-testimonial">
              <h3>Client Testimonial</h3>
              <blockquote>
                <p class="testimonial-text"></p>
                <cite class="testimonial-author"></cite>
              </blockquote>
            </div>
          </div>
          <div class="case-study-modal__footer">
            <button class="btn btn--primary case-study-cta">
              Get Similar Results for Your Business
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('caseStudyModal');
  }
  
  init() {
    // Add click handlers to case study triggers
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('case-study-trigger')) {
        const caseStudyId = e.target.dataset.caseStudy;
        this.open(caseStudyId);
      }
    });
    
    // Close modal handlers
    this.modal.querySelector('.case-study-modal__close').addEventListener('click', () => this.close());
    this.modal.querySelector('.case-study-modal__overlay').addEventListener('click', () => this.close());
    
    // CTA button handler
    this.modal.querySelector('.case-study-cta').addEventListener('click', () => {
      trackEvent('CaseStudy', 'CTA_Click', 'Contact_From_Modal');
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      this.close();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open(caseStudyId) {
    const caseStudy = this.caseStudies[caseStudyId];
    if (!caseStudy) return;
    
    // Populate modal content
    this.modal.querySelector('.case-study-modal__image').src = caseStudy.image;
    this.modal.querySelector('.case-study-modal__image').alt = caseStudy.title;
    this.modal.querySelector('.case-study-modal__title').textContent = caseStudy.title;
    this.modal.querySelector('.case-study-challenge').textContent = caseStudy.challenge;
    this.modal.querySelector('.case-study-solution').textContent = caseStudy.solution;
    
    // Populate results list
    const resultsList = this.modal.querySelector('.case-study-results');
    resultsList.innerHTML = '';
    caseStudy.results.forEach(result => {
      const li = document.createElement('li');
      li.textContent = result;
      resultsList.appendChild(li);
    });
    
    // Populate testimonial
    this.modal.querySelector('.testimonial-text').textContent = caseStudy.testimonial.text;
    this.modal.querySelector('.testimonial-author').textContent = caseStudy.testimonial.author;
    
    // Show modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track case study view
    trackEvent('CaseStudy', 'View', caseStudy.title);
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* -----------------------------------------
  Lead Capture and Engagement System
 ---------------------------------------- */

class LeadCaptureSystem {
  constructor() {
    this.hasShownIntent = false;
    this.timeOnSite = 0;
    this.scrollDepth = 0;
    this.init();
  }
  
  init() {
    // Track user engagement
    this.trackEngagement();
    
    // Show exit intent popup
    this.setupExitIntent();
    
    // Add value-first popups
    this.setupValueOffers();
  }
  
  trackEngagement() {
    // Track time on site
    setInterval(() => {
      this.timeOnSite += 5;
    }, 5000);
    
    // Track scroll depth
    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      this.scrollDepth = Math.max(this.scrollDepth, scrolled);
    });
  }
  
  setupExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitIntentShown && this.timeOnSite > 30) {
        this.showExitIntentPopup();
        exitIntentShown = true;
      }
    });
  }
  
  setupValueOffers() {
    // Show value offer after viewing portfolio
    document.addEventListener('scroll', () => {
      if (this.scrollDepth > 60 && this.timeOnSite > 45 && !this.hasShownIntent) {
        setTimeout(() => {
          this.showValueOffer();
        }, 3000);
        this.hasShownIntent = true;
      }
    });
  }
  
  showExitIntentPopup() {
    const popup = this.createPopup(
      'Before You Go...',
      'Get a free automation assessment for your business processes',
      'Get Free Checklist',
      'exit-intent'
    );
    
    trackEvent('LeadCapture', 'Exit_Intent_Shown', '');
  }
  
  showValueOffer() {
    const popup = this.createPopup(
      'Interested in Process Automation?',
      'Download our ROI calculator to see how much time and money automation could save your business',
      'Calculate ROI',
      'value-offer'
    );
    
    trackEvent('LeadCapture', 'Value_Offer_Shown', '');
  }
  
  createPopup(title, description, ctaText, type) {
    const popupHTML = `
      <div class="lead-popup" id="leadPopup">
        <div class="lead-popup__overlay"></div>
        <div class="lead-popup__content">
          <button class="lead-popup__close">&times;</button>
          <div class="lead-popup__header">
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
          <div class="lead-popup__form">
            <input type="email" placeholder="Enter your business email" class="lead-popup__email" required>
            <button class="btn btn--primary lead-popup__submit">${ctaText}</button>
          </div>
          <p class="lead-popup__privacy">
            No spam. Unsubscribe anytime. Your information is secure.
          </p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    const popup = document.getElementById('leadPopup');
    
    // Show popup with animation
    setTimeout(() => popup.classList.add('active'), 100);
    
    // Handle form submission
    popup.querySelector('.lead-popup__submit').addEventListener('click', (e) => {
      e.preventDefault();
      const email = popup.querySelector('.lead-popup__email').value;
      
      if (this.validateEmail(email)) {
        this.submitLead(email, type);
        this.showThankYou(popup);
        trackEvent('LeadCapture', 'Form_Submit', type);
      } else {
        this.showError('Please enter a valid business email address');
      }
    });
    
    // Close handlers
    popup.querySelector('.lead-popup__close').addEventListener('click', () => {
      this.closePopup(popup);
      trackEvent('LeadCapture', 'Popup_Closed', type);
    });
    
    popup.querySelector('.lead-popup__overlay').addEventListener('click', () => {
      this.closePopup(popup);
      trackEvent('LeadCapture', 'Popup_Closed', type);
    });
    
    return popup;
  }
  
  validateEmail(email) {
    const businessEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    
    return businessEmailPattern.test(email) && !freeEmailProviders.includes(domain?.toLowerCase());
  }
  
  submitLead(email, type) {
    const leadData = {
      email: email,
      source: 'portfolio_website',
      type: type,
      timestamp: new Date().toISOString(),
      engagement: {
        timeOnSite: this.timeOnSite,
        scrollDepth: this.scrollDepth
      }
    };
    
    // Example integration with Formspree, Netlify Forms, or similar
    fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    }).catch(error => {
      console.log('Lead submission error:', error);
      // Still show thank you message for better UX
    });
  }
  
  showThankYou(popup) {
    const content = popup.querySelector('.lead-popup__content');
    content.innerHTML = `
      <div class="lead-popup__thank-you">
        <h3>Thank You!</h3>
        <p>Check your email for the download link. I'll also send you valuable automation insights weekly.</p>
        <button class="btn btn--primary lead-popup__continue">Continue Browsing</button>
      </div>
    `;
    
    popup.querySelector('.lead-popup__continue').addEventListener('click', () => {
      this.closePopup(popup);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      this.closePopup(popup);
    }, 5000);
  }
  
  showError(message) {
    alert(message);
  }
  
  closePopup(popup) {
    popup.classList.remove('active');
    setTimeout(() => popup.remove(), 300);
  }
}

/* -----------------------------------------
  ROI Calculator Integration
 ---------------------------------------- */

class ROICalculator {
  constructor() {
    this.createCalculator();
    this.init();
  }
  
  createCalculator() {
    const calculatorHTML = `
      <div id="roiCalculator" class="roi-calculator">
        <div class="roi-calculator__overlay"></div>
        <div class="roi-calculator__content">
          <button class="roi-calculator__close">&times;</button>
          <h3>Automation ROI Calculator</h3>
          <p>See how much time and money automation could save your business</p>
          
          <div class="roi-calculator__form">
            <div class="form-group">
              <label>Hours spent weekly on manual processes</label>
              <input type="number" id="hoursWeekly" placeholder="e.g., 10" min="1" max="80">
            </div>
            
            <div class="form-group">
              <label>Average hourly rate of staff doing this work</label>
              <input type="number" id="hourlyRate" placeholder="e.g., 25" min="10" max="200">
            </div>
            
            <div class="form-group">
              <label>Estimated automation project cost</label>
              <input type="number" id="automationCost" placeholder="e.g., 5000" min="1000" max="50000">
            </div>
            
            <button class="btn btn--primary roi-calculator__calculate">Calculate ROI</button>
          </div>
          
          <div class="roi-calculator__results" style="display: none;">
            <h4>Your Automation ROI</h4>
            <div class="roi-results">
              <div class="roi-metric">
                <span class="roi-label">Annual Cost Savings:</span>
                <span class="roi-value" id="annualSavings">$0</span>
              </div>
              <div class="roi-metric">
                <span class="roi-label">Payback Period:</span>
                <span class="roi-value" id="paybackPeriod">0 months</span>
              </div>
              <div class="roi-metric">
                <span class="roi-label">3-Year ROI:</span>
                <span class="roi-value" id="threeYearROI">0%</span>
              </div>
            </div>
            <div class="roi-cta">
              <p>Ready to achieve these results? Let's discuss your automation opportunities.</p>
              <button class="btn btn--primary roi-calculator__contact">Schedule Free Consultation</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', calculatorHTML);
    this.calculator = document.getElementById('roiCalculator');
  }
  
  init() {
    // Add trigger for ROI calculator
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('roi-calculator-trigger')) {
        e.preventDefault();
        this.open();
      }
    });
    
    // Close handlers
    this.calculator.querySelector('.roi-calculator__close').addEventListener('click', () => this.close());
    this.calculator.querySelector('.roi-calculator__overlay').addEventListener('click', () => this.close());
    
    // Calculate button
    this.calculator.querySelector('.roi-calculator__calculate').addEventListener('click', () => {
      this.calculateROI();
    });
    
    // Contact button
    this.calculator.querySelector('.roi-calculator__contact').addEventListener('click', () => {
      trackEvent('ROI_Calculator', 'Contact_Click', 'From_Results');
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      this.close();
    });
  }
  
  open() {
    this.calculator.classList.add('active');
    document.body.style.overflow = 'hidden';
    trackEvent('ROI_Calculator', 'Open', '');
  }
  
  close() {
    this.calculator.classList.remove('active');
    document.body.style.overflow = '';
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
    document.getElementById('annualSavings').textContent = `$${annualSavings.toLocaleString()}`;
    document.getElementById('paybackPeriod').textContent = `${paybackMonths} months`;
    document.getElementById('threeYearROI').textContent = `${threeYearROI}%`;
    
    // Show results
    this.calculator.querySelector('.roi-calculator__results').style.display = 'block';
    
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
    // Add trigger for platform analysis download
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('platform-analysis-trigger')) {
        e.preventDefault();
        this.showDownloadForm();
      }
    });
  }
  
  showDownloadForm() {
    const popup = this.createDownloadPopup();
    trackEvent('Platform_Analysis', 'Download_Triggered', '');
  }
  
  createDownloadPopup() {
    const popupHTML = `
      <div class="lead-popup" id="analysisDownloadPopup">
        <div class="lead-popup__overlay"></div>
        <div class="lead-popup__content">
          <button class="lead-popup__close">&times;</button>
          <div class="lead-popup__header">
            <h3>Download Complete Power Platform Analysis</h3>
            <p>Get the comprehensive 15-page analysis comparing Power Platform to alternatives, including detailed ROI calculations and implementation strategies.</p>
          </div>
          <div class="lead-popup__form">
            <input type="email" placeholder="Enter your business email" class="lead-popup__email" required>
            <button class="btn btn--primary lead-popup__submit">Download Analysis</button>
          </div>
          <p class="lead-popup__privacy">
            No spam. Unsubscribe anytime. Your information is secure.
          </p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    const popup = document.getElementById('analysisDownloadPopup');
    
    // Show popup with animation
    setTimeout(() => popup.classList.add('active'), 100);
    
    // Handle form submission
    popup.querySelector('.lead-popup__submit').addEventListener('click', (e) => {
      e.preventDefault();
      const email = popup.querySelector('.lead-popup__email').value;
      
      if (this.validateEmail(email)) {
        this.submitAnalysisRequest(email);
        this.showAnalysisThankYou(popup);
        trackEvent('Platform_Analysis', 'Download_Submit', 'Success');
      } else {
        alert('Please enter a valid business email address');
      }
    });
    
    // Close handlers
    popup.querySelector('.lead-popup__close').addEventListener('click', () => {
      this.closePopup(popup);
      trackEvent('Platform_Analysis', 'Download_Closed', '');
    });
    
    popup.querySelector('.lead-popup__overlay').addEventListener('click', () => {
      this.closePopup(popup);
      trackEvent('Platform_Analysis', 'Download_Closed', '');
    });
    
    return popup;
  }
  
  validateEmail(email) {
    const businessEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    
    return businessEmailPattern.test(email) && !freeEmailProviders.includes(domain?.toLowerCase());
  }
  
  submitAnalysisRequest(email) {
    const requestData = {
      email: email,
      source: 'platform_analysis_download',
      document: 'power_platform_competitive_analysis',
      timestamp: new Date().toISOString()
    };
    
    // Integration with your email service provider
    fetch('/api/analysis-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    }).catch(error => {
      console.log('Analysis download error:', error);
    });
  }
  
  showAnalysisThankYou(popup) {
    const content = popup.querySelector('.lead-popup__content');
    content.innerHTML = `
      <div class="lead-popup__thank-you">
        <h3>Download Starting!</h3>
        <p>Check your email for the Power Platform Analysis PDF. You'll also receive strategic automation insights weekly.</p>
        <button class="btn btn--primary lead-popup__continue">Continue Browsing</button>
      </div>
    `;
    
    popup.querySelector('.lead-popup__continue').addEventListener('click', () => {
      this.closePopup(popup);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      this.closePopup(popup);
    }, 5000);
  }
  
  closePopup(popup) {
    popup.classList.remove('active');
    setTimeout(() => popup.remove(), 300);
  }
}

/* -----------------------------------------
  Initialize All Components
 ---------------------------------------- */

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize gallery systems
  new ProjectGallery('automationGallery', 'automation-gallery-trigger');
  new ProjectGallery('powerbiGallery', 'powerbi-gallery-trigger');
  new AdventureWorksGallery();
  
  // Initialize modal systems
  new CaseStudyModal();
  new LeadCaptureSystem();
  new ROICalculator();
  new PlatformAnalysisDownload();
});
