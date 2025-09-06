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
  const workBoxes = document.querySelectorAll('.work__box');
  workBoxes.forEach((box, index) => {
    box.classList.add('animate-on-scroll', `delay-${(index % 3) + 1}`);
    scrollObserver.observe(box);
  });
  
  const statBoxes = document.querySelectorAll('.stat__box');
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
});

/* -----------------------------------------
  Animated Counter
 ---------------------------------------- */

function animateCounter(element) {
  const h3 = element.querySelector('h3');
  if (!h3 || h3.dataset.animated) return;
  
  h3.dataset.animated = 'true';
  const text = h3.textContent;
  const match = text.match(/(\d+)([%+]?)/);
  
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
  Smooth Hover Effects for Project Cards
 ---------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Add smooth parallax effect on mouse move for project images
  const projectBoxes = document.querySelectorAll('.work__box');
  
  projectBoxes.forEach(box => {
    const image = box.querySelector('.work__image');
    if (!image) return;
    
    box.addEventListener('mousemove', (e) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      image.style.transform = `scale(1.05) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg)`;
    });
    
    box.addEventListener('mouseleave', () => {
      const image = box.querySelector('.work__image');
      if (image) {
        image.style.transform = 'scale(1) rotateY(0) rotateX(0)';
      }
    });
  });
});

/* -----------------------------------------
  Image Slider Functionality
 ---------------------------------------- */

class ImageSlider {
  constructor(container) {
    this.container = container;
    this.images = container.querySelectorAll('.slider__image');
    this.dots = container.querySelectorAll('.slider__dot');
    this.prevBtn = container.querySelector('.slider__btn--prev');
    this.nextBtn = container.querySelector('.slider__btn--next');
    this.currentSlide = 1;
    this.totalSlides = this.images.length;
    
    this.init();
  }
  
  init() {
    // Button navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Dot navigation
    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideNum = parseInt(e.target.dataset.slide);
        this.goToSlide(slideNum);
      });
    });
    
    // Auto-play
    this.startAutoPlay();
    
    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.container.closest('.work__box')) return;
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }
  
  goToSlide(slideNum) {
    // Hide all slides
    this.images.forEach(img => img.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));
    
    // Show selected slide
    const targetImage = this.container.querySelector(`[data-slide="${slideNum}"]`);
    const targetDot = this.container.querySelector(`.slider__dot[data-slide="${slideNum}"]`);
    
    if (targetImage) {
      targetImage.classList.add('active');
    }
    if (targetDot) {
      targetDot.classList.add('active');
    }
    
    this.currentSlide = slideNum;
  }
  
  nextSlide() {
    const next = this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
    this.goToSlide(next);
  }
  
  prevSlide() {
    const prev = this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
    this.goToSlide(prev);
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Change slide every 4 seconds
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}

/* -----------------------------------------
  Image Modal Functionality
 ---------------------------------------- */

class ImageModal {
  constructor() {
    this.modal = document.getElementById('imageModal');
    this.modalImage = this.modal.querySelector('.modal__image');
    this.modalCaption = this.modal.querySelector('.modal__caption');
    this.closeBtn = this.modal.querySelector('.modal__close');
    this.overlay = this.modal.querySelector('.modal__overlay');
    
    this.init();
  }
  
  init() {
    // Click handlers for all slider images
    document.querySelectorAll('.slider__image').forEach(img => {
      img.addEventListener('click', (e) => {
        this.open(e.target.src, e.target.alt);
      });
    });
    
    // Click handler for regular work images
    document.querySelectorAll('.work__image:not(.slider__image)').forEach(img => {
      img.addEventListener('click', (e) => {
        this.open(e.target.src, e.target.alt);
      });
    });
    
    // Close handlers
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open(src, alt) {
    this.modalImage.src = src;
    this.modalCaption.textContent = alt;
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
}

// Initialize sliders and modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all sliders
  document.querySelectorAll('.slider').forEach(slider => {
    new ImageSlider(slider);
  });
  
  // Initialize modal
  new ImageModal();
});
