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
      this.modalImage.src = '';
      this.modalCaption.textContent = '';
    }, 300);
  }
  
  updateDisplay() {
    const currentImage = this.galleryImages[this.currentIndex];
    this.modalImage.src = currentImage.src;
    this.modalImage.alt = currentImage.alt;
    this.modalCaption.textContent = currentImage.alt;
    
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
  Enhanced Case Study Modal System
 ---------------------------------------- */

class CaseStudyModal {
  constructor() {
    this.modal = null;
    this.createModal();
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
              <h3>Technology Stack</h3>
              <div class="case-study-tech-stack"></div>
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
    
    // Add CSS for the case study modal
    this.addModalCSS();
  }
  
  addModalCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .case-study-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
      }
      
      .case-study-modal.active {
        display: flex;
      }
      
      .case-study-modal__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
      }
      
      .case-study-modal__content {
        position: relative;
        background: var(--white);
        border-radius: 12px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 1001;
        animation: modalSlideIn 0.3s ease-out;
      }
      
      .case-study-modal__close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: var(--white);
        border: none;
        font-size: 3rem;
        cursor: pointer;
        z-index: 1002;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        color: var(--text-color);
        transition: all 0.3s ease;
      }
      
      .case-study-modal__close:hover {
        background: var(--primary-blue);
        color: var(--white);
        transform: scale(1.1);
      }
      
      .case-study-modal__header {
        padding: var(--gutter-medium);
        text-align: center;
      }
      
      .case-study-modal__image {
        width: 100%;
        max-width: 60rem;
        height: auto;
        border-radius: 8px;
        margin-bottom: var(--gutter-normal);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
      
      .case-study-modal__title {
        color: var(--dark-gray);
        margin: 0;
      }
      
      .case-study-modal__body {
        padding: 0 var(--gutter-medium) var(--gutter-medium);
      }
      
      .case-study-section {
        margin-bottom: var(--gutter-normal);
      }
      
      .case-study-section h3 {
        color: var(--primary-blue);
        margin-bottom: var(--gutter-small);
        font-size: var(--font-size-medium);
      }
      
      .case-study-section p {
        font-size: var(--font-size-normal);
        line-height: 1.6;
        color: var(--text-color);
      }
      
      .case-study-tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .tech-badge {
        background: var(--primary-blue);
        color: var(--white);
        padding: 0.8rem 1.5rem;
        border-radius: 20px;
        font-size: 1.4rem;
        font-weight: var(--font-weight-normal);
      }
      
      .case-study-results {
        list-style: none;
        padding: 0;
      }
      
      .case-study-results li {
        padding: 0.8rem 0;
        position: relative;
        padding-left: 2.5rem;
        color: var(--text-color);
        font-size: var(--font-size-normal);
        line-height: 1.6;
      }
      
      .case-study-results li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--secondary-teal);
        font-weight: var(--font-weight-bold);
        font-size: 1.8rem;
      }
      
      .case-study-testimonial blockquote {
        background: var(--light-gray);
        padding: var(--gutter-normal);
        border-radius: 12px;
        border-left: 4px solid var(--primary-blue);
        margin: 0;
      }
      
      .testimonial-text {
        font-style: italic;
        font-size: var(--font-size-normal);
        line-height: 1.6;
        margin-bottom: var(--gutter-small);
      }
      
      .testimonial-author {
        display: block;
        font-weight: var(--font-weight-bold);
        color: var(--primary-blue);
        font-size: var(--font-size-small);
      }
      
      .case-study-modal__footer {
        padding: var(--gutter-normal) var(--gutter-medium) var(--gutter-medium);
        text-align: center;
      }
      
      @media(max-width: 900px) {
        .case-study-modal__content {
          max-width: 95vw;
          max-height: 95vh;
        }
        
        .case-study-modal__close {
          top: 1rem;
          right: 1rem;
          width: 3.5rem;
          height: 3.5rem;
          font-size: 2.5rem;
        }
        
        .case-study-modal__header,
        .case-study-modal__body,
        .case-study-modal__footer {
          padding-left: var(--gutter-normal);
          padding-right: var(--gutter-normal);
        }
        
        .case-study-tech-stack {
          gap: 0.5rem;
        }
        
        .tech-badge {
          font-size: 1.2rem;
          padding: 0.6rem 1.2rem;
        }
      }
    `;
    
    document.head.appendChild(style);
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
    
    // Populate tech stack
    const techStackContainer = this.modal.querySelector('.case-study-tech-stack');
    techStackContainer.innerHTML = '';
    caseStudy.techStack.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'tech-badge';
      badge.textContent = tech;
      techStackContainer.appendChild(badge);
    });
    
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
  ROI Calculator System
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
              <label>Average hourly rate of staff doing this work ($)</label>
              <input type="number" id="hourlyRate" placeholder="e.g., 25" min="10" max="200">
            </div>
            
            <div class="form-group">
              <label>Estimated automation project cost ($)</label>
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
    
    // Add CSS for the ROI calculator
    this.addCalculatorCSS();
  }
  
  addCalculatorCSS() {
    const style = document.createElement('style');
    style.textContent = `
      .roi-calculator {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
      }
      
      .roi-calculator.active {
        display: flex;
      }
      
      .roi-calculator__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
      }
      
      .roi-calculator__content {
        position: relative;
        background: var(--white);
        border-radius: 12px;
        max-width: 60rem;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 1001;
        padding: var(--gutter-medium);
        animation: modalSlideIn 0.3s ease-out;
      }
      
      .roi-calculator__close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: var(--white);
        border: none;
        font-size: 3rem;
        cursor: pointer;
        z-index: 1002;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        color: var(--text-color);
        transition: all 0.3s ease;
      }
      
      .roi-calculator__close:hover {
        background: var(--primary-blue);
        color: var(--white);
        transform: scale(1.1);
      }
      
      .roi-calculator__content h3 {
        color: var(--dark-gray);
        text-align: center;
        margin-bottom: var(--gutter-small);
      }
      
      .roi-calculator__content > p {
        text-align: center;
        color: var(--text-color);
        margin-bottom: var(--gutter-normal);
      }
      
      .roi-calculator__form {
        margin-bottom: var(--gutter-normal);
      }
      
      .form-group {
        margin-bottom: var(--gutter-normal);
      }
      
      .form-group label {
        display: block;
        font-weight: var(--font-weight-bold);
        margin-bottom: 0.8rem;
        color: var(--dark-gray);
        font-size: var(--font-size-small);
      }
      
      .form-group input {
        width: 100%;
        padding: 1.2rem;
        border: 2px solid var(--border-gray);
        border-radius: 6px;
        font-size: var(--font-size-small);
        font-family: inherit;
        transition: border-color 0.3s ease;
      }
      
      .form-group input:focus {
        outline: none;
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
      
      .roi-calculator__calculate {
        width: 100%;
        margin-top: var(--gutter-normal);
      }
      
      .roi-calculator__results {
        background: var(--light-gray);
        padding: var(--gutter-normal);
        border-radius: 12px;
        border-left: 4px solid var(--secondary-teal);
      }
      
      .roi-calculator__results h4 {
        color: var(--dark-gray);
        text-align: center;
        margin-bottom: var(--gutter-normal);
        font-size: var(--font-size-medium);
      }
      
      .roi-results {
        margin-bottom: var(--gutter-normal);
      }
      
      .roi-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid var(--border-gray);
      }
      
      .roi-metric:last-child {
        border-bottom: none;
      }
      
      .roi-label {
        font-weight: var(--font-weight-bold);
        color: var(--dark-gray);
        font-size: var(--font-size-small);
      }
      
      .roi-value {
        font-weight: var(--font-weight-bold);
        color: var(--secondary-teal);
        font-size: var(--font-size-normal);
      }
      
      .roi-cta {
        text-align: center;
        padding-top: var(--gutter-normal);
        border-top: 1px solid var(--border-gray);
      }
      
      .roi-cta p {
        margin-bottom: var(--gutter-normal);
        color: var(--text-color);
        font-size: var(--font-size-small);
      }
      
      @media(max-width: 900px) {
        .roi-calculator__content {
          max-width: 95vw;
          padding: var(--gutter-normal);
        }
        
        .roi-calculator__close {
          top: 1rem;
          right: 1rem;
          width: 3.5rem;
          height: 3.5rem;
          font-size: 2.5rem;
        }
        
        .roi-metric {
          flex-direction: column;
          text-align: center;
          gap: 0.5rem;
        }
      }
    `;
    
    document.head.appendChild(style);
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
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.calculator.classList.contains('active')) {
        this.close();
      }
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
    
    // Scroll to results
    this.calculator.querySelector('.roi-calculator__results').scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
    
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
            <p>Get the comprehensive analysis comparing Power Platform to alternatives, including detailed ROI calculations and implementation strategies.</p>
            <ul class="analysis-benefits">
              <li>✓ 3-Year Total Cost Comparison</li>
              <li>✓ Security & Compliance Analysis</li>
              <li>✓ Real Client Success Stories</li>
              <li>✓ Implementation Framework</li>
            </ul>
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
    
    // Add CSS for the popup
    this.addPopupCSS();
    
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
  
  addPopupCSS() {
    if (document.getElementById('lead-popup-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'lead-popup-styles';
    style.textContent = `
      .lead-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
      }
      
      .lead-popup.active {
        display: flex;
      }
      
      .lead-popup__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
      }
      
      .lead-popup__content {
        position: relative;
        background: var(--white);
        border-radius: 12px;
        max-width: 50rem;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 1001;
        padding: var(--gutter-medium);
        animation: modalSlideIn 0.3s ease-out;
      }
      
      .lead-popup__close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        background: var(--white);
        border: none;
        font-size: 3rem;
        cursor: pointer;
        z-index: 1002;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        color: var(--text-color);
        transition: all 0.3s ease;
      }
      
      .lead-popup__close:hover {
        background: var(--primary-blue);
        color: var(--white);
        transform: scale(1.1);
      }
      
      .lead-popup__header h3 {
        color: var(--dark-gray);
        text-align: center;
        margin-bottom: var(--gutter-small);
      }
      
      .lead-popup__header p {
        text-align: center;
        color: var(--text-color);
        margin-bottom: var(--gutter-normal);
        line-height: 1.6;
      }
      
      .analysis-benefits {
        list-style: none;
        padding: 0;
        margin-bottom: var(--gutter-normal);
        background: var(--light-gray);
        padding: var(--gutter-normal);
        border-radius: 8px;
      }
      
      .analysis-benefits li {
        padding: 0.5rem 0;
        color: var(--text-color);
        font-size: var(--font-size-small);
      }
      
      .lead-popup__form {
        margin-bottom: var(--gutter-normal);
      }
      
      .lead-popup__email {
        width: 100%;
        padding: 1.2rem;
        border: 2px solid var(--border-gray);
        border-radius: 6px;
        font-size: var(--font-size-small);
        font-family: inherit;
        margin-bottom: var(--gutter-normal);
        transition: border-color 0.3s ease;
      }
      
      .lead-popup__email:focus {
        outline: none;
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }
      
      .lead-popup__submit {
        width: 100%;
      }
      
      .lead-popup__privacy {
        text-align: center;
        font-size: 1.2rem;
        color: var(--text-color);
        margin: 0;
        font-style: italic;
      }
      
      .lead-popup__thank-you {
        text-align: center;
        padding: var(--gutter-normal);
      }
      
      .lead-popup__thank-you h3 {
        color: var(--secondary-teal);
        margin-bottom: var(--gutter-normal);
      }
      
      .lead-popup__thank-you p {
        color: var(--text-color);
        margin-bottom: var(--gutter-normal);
        line-height: 1.6;
      }
      
      @media(max-width: 900px) {
        .lead-popup__content {
          max-width: 95vw;
          padding: var(--gutter-normal);
        }
        
        .lead-popup__close {
          top: 1rem;
          right: 1rem;
          width: 3.5rem;
          height: 3.5rem;
          font-size: 2.5rem;
        }
      }
    `;
    
    document.head.appendChild(style);
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
    
    // Integration with your email service provider
    // This would typically be handled by your backend/form service
    console.log('Analysis download request:', requestData);
  }
  
  showAnalysisThankYou(popup) {
    const content = popup.querySelector('.lead-popup__content');
    content.innerHTML = `
      <div class="lead-popup__thank-you">
        <h3>Thank You!</h3>
        <p>Check your email for the Power Platform Analysis PDF. You'll also receive strategic automation insights to help grow your business.</p>
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
        
        // Track navigation clicks
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
    
    // Get form data
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    // Track form submission
    trackEvent('Contact', 'Form_Submit', 'Contact_Form');
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Submit form (replace with your actual form handling)
    fetch(this.action, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        // Show success message
        showFormSuccess();
        this.reset();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      showFormError();
    })
    .finally(() => {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

function showFormSuccess() {
  const successMessage = document.createElement('div');
  successMessage.className = 'form-success';
  successMessage.innerHTML = `
    <h4>Message Sent Successfully!</h4>
    <p>Thank you for your interest. I'll get back to you within 24 hours to discuss your automation needs.</p>
  `;
  
  const contactForm = document.querySelector('.contact__form-container');
  contactForm.appendChild(successMessage);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

function showFormError() {
  alert('Sorry, there was an error sending your message. Please try again or contact me directly at iamahlramz253@gmail.com');
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
  // Initialize scroll animations
  const statBoxes = document.querySelectorAll('.stat__box, .metric__item');
  statBoxes.forEach((box, index) => {
    box.classList.add('animate-scale', `delay-${(index % 4) + 1}`);
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
    if (timeOnPage % 120 === 0) { // Every 2 minutes
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
});
