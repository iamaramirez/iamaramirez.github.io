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
  Gallery Modal Functionality
 ---------------------------------------- */

class GalleryModal {
  constructor() {
    this.modal = document.getElementById('galleryModal');
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
    // Click handlers for gallery triggers
    document.querySelectorAll('.gallery-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        this.open(0); // Always start with first image
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
    
    // Click handlers for regular work images (non-gallery)
    document.querySelectorAll('.work__image:not(.gallery-trigger)').forEach(img => {
      img.addEventListener('click', (e) => {
        this.openSingle(e.target.src, e.target.alt);
      });
    });
  }
  
  open(index = 0) {
    this.currentIndex = index;
    this.updateDisplay();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  openSingle(src, alt) {
    this.modalImage.src = src;
    this.modalCaption.textContent = alt;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Hide gallery controls for single images
    this.prevBtn.style.display = 'none';
    this.nextBtn.style.display = 'none';
    this.modal.querySelector('.gallery__indicators').style.display = 'none';
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Show gallery controls again
    this.prevBtn.style.display = 'flex';
    this.nextBtn.style.display = 'flex';
    this.modal.querySelector('.gallery__indicators').style.display = 'flex';
    
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

// Initialize gallery modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GalleryModal();
});
