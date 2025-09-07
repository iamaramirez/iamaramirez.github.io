// Updated Portfolio JavaScript with Gallery Triggers
// Allan Ramirez - Business Process Automation Expert

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact form handling
    const contactForm = document.querySelector('.contact__form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Basic form validation
            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            
            if (!name || !email) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }
        });
    }

    // ===== AUTOMATION GALLERY =====
    const automationGallery = document.getElementById('automationGallery');
    const automationGalleryTriggers = document.querySelectorAll('.automation-gallery-trigger');
    
    if (automationGallery && automationGalleryTriggers.length > 0) {
        let currentAutomationSlide = 0;
        const automationSlides = automationGallery.querySelectorAll('.gallery__slide');
        const automationDots = automationGallery.querySelectorAll('.gallery__dot');
        const automationCounter = automationGallery.querySelector('.gallery__counter');
        const automationPrevBtn = automationGallery.querySelector('.gallery__btn--prev');
        const automationNextBtn = automationGallery.querySelector('.gallery__btn--next');
        const automationCloseBtn = automationGallery.querySelector('.modal__close');
        const automationOverlay = automationGallery.querySelector('.modal__overlay');

        function showAutomationSlide(index) {
            automationSlides.forEach(slide => slide.classList.remove('active'));
            automationDots.forEach(dot => dot.classList.remove('active'));
            
            automationSlides[index].classList.add('active');
            automationDots[index].classList.add('active');
            automationCounter.textContent = `${index + 1} / ${automationSlides.length}`;
            currentAutomationSlide = index;
        }

        function openAutomationGallery(slideIndex = 0) {
            automationGallery.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            showAutomationSlide(slideIndex);
        }

        function closeAutomationGallery() {
            automationGallery.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Gallery triggers
        automationGalleryTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.slide) || 0;
                openAutomationGallery(slideIndex);
            });
        });

        // Navigation
        automationPrevBtn.addEventListener('click', function() {
            const newIndex = currentAutomationSlide > 0 ? currentAutomationSlide - 1 : automationSlides.length - 1;
            showAutomationSlide(newIndex);
        });

        automationNextBtn.addEventListener('click', function() {
            const newIndex = currentAutomationSlide < automationSlides.length - 1 ? currentAutomationSlide + 1 : 0;
            showAutomationSlide(newIndex);
        });

        // Dots navigation
        automationDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showAutomationSlide(index);
            });
        });

        // Close gallery
        automationCloseBtn.addEventListener('click', closeAutomationGallery);
        automationOverlay.addEventListener('click', closeAutomationGallery);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (automationGallery.style.display === 'flex') {
                if (e.key === 'Escape') closeAutomationGallery();
                if (e.key === 'ArrowLeft') automationPrevBtn.click();
                if (e.key === 'ArrowRight') automationNextBtn.click();
            }
        });
    }

    // ===== POWER BI GALLERY =====
    const powerbiGallery = document.getElementById('powerbiGallery');
    const powerbiGalleryTriggers = document.querySelectorAll('.powerbi-gallery-trigger');
    
    if (powerbiGallery && powerbiGalleryTriggers.length > 0) {
        let currentPowerbiSlide = 0;
        const powerbiSlides = powerbiGallery.querySelectorAll('.gallery__slide');
        const powerbiDots = powerbiGallery.querySelectorAll('.gallery__dot');
        const powerbiCounter = powerbiGallery.querySelector('.gallery__counter');
        const powerbiPrevBtn = powerbiGallery.querySelector('.gallery__btn--prev');
        const powerbiNextBtn = powerbiGallery.querySelector('.gallery__btn--next');
        const powerbiCloseBtn = powerbiGallery.querySelector('.modal__close');
        const powerbiOverlay = powerbiGallery.querySelector('.modal__overlay');

        function showPowerbiSlide(index) {
            powerbiSlides.forEach(slide => slide.classList.remove('active'));
            powerbiDots.forEach(dot => dot.classList.remove('active'));
            
            powerbiSlides[index].classList.add('active');
            powerbiDots[index].classList.add('active');
            powerbiCounter.textContent = `${index + 1} / ${powerbiSlides.length}`;
            currentPowerbiSlide = index;
        }

        function openPowerbiGallery(slideIndex = 0) {
            powerbiGallery.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            showPowerbiSlide(slideIndex);
        }

        function closePowerbiGallery() {
            powerbiGallery.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Gallery triggers
        powerbiGalleryTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                openPowerbiGallery(0);
            });
        });

        // Navigation
        powerbiPrevBtn.addEventListener('click', function() {
            const newIndex = currentPowerbiSlide > 0 ? currentPowerbiSlide - 1 : powerbiSlides.length - 1;
            showPowerbiSlide(newIndex);
        });

        powerbiNextBtn.addEventListener('click', function() {
            const newIndex = currentPowerbiSlide < powerbiSlides.length - 1 ? currentPowerbiSlide + 1 : 0;
            showPowerbiSlide(newIndex);
        });

        // Dots navigation
        powerbiDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showPowerbiSlide(index);
            });
        });

        // Close gallery
        powerbiCloseBtn.addEventListener('click', closePowerbiGallery);
        powerbiOverlay.addEventListener('click', closePowerbiGallery);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (powerbiGallery.style.display === 'flex') {
                if (e.key === 'Escape') closePowerbiGallery();
                if (e.key === 'ArrowLeft') powerbiPrevBtn.click();
                if (e.key === 'ArrowRight') powerbiNextBtn.click();
            }
        });
    }

    // ===== ADVENTUREWORKS DETAILED GALLERY =====
    const adventureworksGallery = document.getElementById('adventureworksGallery');
    const adventureworksTriggers = document.querySelectorAll('.adventureworks-gallery-trigger');

    if (adventureworksGallery && adventureworksTriggers.length > 0) {
        const adventureworksImages = [
            {
                src: './images/pbi-adventureworks-1-home.jpg',
                caption: 'AdventureWorks Home Dashboard - Executive overview with key performance metrics and sales summary'
            },
            {
                src: './images/pbi-adventureworks-2-product.jpg',
                caption: 'Product Analysis Dashboard - Detailed product performance and category insights'
            },
            {
                src: './images/pbi-adventureworks-3-customer.jpg',
                caption: 'Customer Analytics Dashboard - Customer segmentation and behavioral analysis'
            },
            {
                src: './images/pbi-adventureworks-4-sales.jpg',
                caption: 'Sales Performance Dashboard - Territory analysis and sales team performance metrics'
            }
        ];

        let currentAdventureworksIndex = 0;
        const adventureworksModalImage = adventureworksGallery.querySelector('.modal__image');
        const adventureworksModalCaption = adventureworksGallery.querySelector('.modal__caption');
        const adventureworksCounter = adventureworksGallery.querySelector('.gallery__counter');
        const adventureworksDots = adventureworksGallery.querySelectorAll('.gallery__dot');
        const adventureworksPrevBtn = adventureworksGallery.querySelector('.gallery__btn--prev');
        const adventureworksNextBtn = adventureworksGallery.querySelector('.gallery__btn--next');
        const adventureworksCloseBtn = adventureworksGallery.querySelector('.modal__close');
        const adventureworksOverlay = adventureworksGallery.querySelector('.modal__overlay');

        function showAdventureworksImage(index) {
            adventureworksModalImage.src = adventureworksImages[index].src;
            adventureworksModalImage.alt = adventureworksImages[index].caption;
            adventureworksModalCaption.textContent = adventureworksImages[index].caption;
            adventureworksCounter.textContent = `${index + 1} / ${adventureworksImages.length}`;
            
            adventureworksDots.forEach(dot => dot.classList.remove('active'));
            adventureworksDots[index].classList.add('active');
            
            currentAdventureworksIndex = index;
        }

        function openAdventureworksGallery() {
            adventureworksGallery.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            showAdventureworksImage(0);
        }

        function closeAdventureworksGallery() {
            adventureworksGallery.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Gallery triggers
        adventureworksTriggers.forEach(trigger => {
            trigger.addEventListener('click', openAdventureworksGallery);
        });

        // Navigation
        adventureworksPrevBtn.addEventListener('click', function() {
            const newIndex = currentAdventureworksIndex > 0 ? currentAdventureworksIndex - 1 : adventureworksImages.length - 1;
            showAdventureworksImage(newIndex);
        });

        adventureworksNextBtn.addEventListener('click', function() {
            const newIndex = currentAdventureworksIndex < adventureworksImages.length - 1 ? currentAdventureworksIndex + 1 : 0;
            showAdventureworksImage(newIndex);
        });

        // Dots navigation
        adventureworksDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showAdventureworksImage(index);
            });
        });

        // Close gallery
        adventureworksCloseBtn.addEventListener('click', closeAdventureworksGallery);
        adventureworksOverlay.addEventListener('click', closeAdventureworksGallery);
    }

    // ===== SUPERSTORE DETAILED GALLERY =====
    const superstoreGallery = document.getElementById('superstoreGallery');
    const superstoreTriggers = document.querySelectorAll('.superstore-gallery-trigger');

    if (superstoreGallery && superstoreTriggers.length > 0) {
        const superstoreImages = [
            {
                src: './images/pbi-superstore-1-overview.jpg',
                caption: 'Superstore Overview Dashboard - Executive summary with sales performance and profitability metrics'
            },
            {
                src: './images/pbi-superstore-2-regional.jpg',
                caption: 'Regional Analysis Dashboard - Geographic performance breakdown and market insights'
            }
        ];

        let currentSuperstoreIndex = 0;
        const superstoreModalImage = superstoreGallery.querySelector('.modal__image');
        const superstoreModalCaption = superstoreGallery.querySelector('.modal__caption');
        const superstoreCounter = superstoreGallery.querySelector('.gallery__counter');
        const superstoreDots = superstoreGallery.querySelectorAll('.gallery__dot');
        const superstorePrevBtn = superstoreGallery.querySelector('.gallery__btn--prev');
        const superstoreNextBtn = superstoreGallery.querySelector('.gallery__btn--next');
        const superstoreCloseBtn = superstoreGallery.querySelector('.modal__close');
        const superstoreOverlay = superstoreGallery.querySelector('.modal__overlay');

        function showSuperstoreImage(index) {
            superstoreModalImage.src = superstoreImages[index].src;
            superstoreModalImage.alt = superstoreImages[index].caption;
            superstoreModalCaption.textContent = superstoreImages[index].caption;
            superstoreCounter.textContent = `${index + 1} / ${superstoreImages.length}`;
            
            superstoreDots.forEach(dot => dot.classList.remove('active'));
            superstoreDots[index].classList.add('active');
            
            currentSuperstoreIndex = index;
        }

        function openSuperstoreGallery() {
            superstoreGallery.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            showSuperstoreImage(0);
        }

        function closeSuperstoreGallery() {
            superstoreGallery.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Gallery triggers
        superstoreTriggers.forEach(trigger => {
            trigger.addEventListener('click', openSuperstoreGallery);
        });

        // Navigation
        superstorePrevBtn.addEventListener('click', function() {
            const newIndex = currentSuperstoreIndex > 0 ? currentSuperstoreIndex - 1 : superstoreImages.length - 1;
            showSuperstoreImage(newIndex);
        });

        superstoreNextBtn.addEventListener('click', function() {
            const newIndex = currentSuperstoreIndex < superstoreImages.length - 1 ? currentSuperstoreIndex + 1 : 0;
            showSuperstoreImage(newIndex);
        });

        // Dots navigation
        superstoreDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSuperstoreImage(index);
            });
        });

        // Close gallery
        superstoreCloseBtn.addEventListener('click', closeSuperstoreGallery);
        superstoreOverlay.addEventListener('click', closeSuperstoreGallery);
    }

    // ===== NORTHWIND DETAILED GALLERY =====
    const northwindGallery = document.getElementById('northwindGallery');
    const northwindTriggers = document.querySelectorAll('.northwind-gallery-trigger');

    if (northwindGallery && northwindTriggers.length > 0) {
        const northwindImages = [
            {
                src: './images/pbi-northwind-1-landing.jpg',
                caption: 'Northwind Landing Page - Welcome dashboard with navigation and key business overview'
            },
            {
                src: './images/pbi-northwind-2-dashboard.jpg',
                caption: 'Executive Dashboard - High-level KPIs and performance indicators for leadership team'
            },
            {
                src: './images/pbi-northwind-3-sales.jpg',
                caption: 'Sales Analysis Dashboard - Detailed sales performance, trends, and territory analysis'
            },
            {
                src: './images/pbi-northwind-4-product.jpg',
                caption: 'Product Performance Dashboard - Product category analysis and inventory insights'
            },
            {
                src: './images/pbi-northwind-5-shipper.jpg',
                caption: 'Shipper Performance Dashboard - Logistics analysis and shipping partner evaluation'
            }
        ];

        let currentNorthwindIndex = 0;
        const northwindModalImage = northwindGallery.querySelector('.modal__image');
        const northwindModalCaption = northwindGallery.querySelector('.modal__caption');
        const northwindCounter = northwindGallery.querySelector('.gallery__counter');
        const northwindDots = northwindGallery.querySelectorAll('.gallery__dot');
        const northwindPrevBtn = northwindGallery.querySelector('.gallery__btn--prev');
        const northwindNextBtn = northwindGallery.querySelector('.gallery__btn--next');
        const northwindCloseBtn = northwindGallery.querySelector('.modal__close');
        const northwindOverlay = northwindGallery.querySelector('.modal__overlay');

        function showNorthwindImage(index) {
            northwindModalImage.src = northwindImages[index].src;
            northwindModalImage.alt = northwindImages[index].caption;
            northwindModalCaption.textContent = northwindImages[index].caption;
            northwindCounter.textContent = `${index + 1} / ${northwindImages.length}`;
            
            northwindDots.forEach(dot => dot.classList.remove('active'));
            northwindDots[index].classList.add('active');
            
            currentNorthwindIndex = index;
        }

        function openNorthwindGallery() {
            northwindGallery.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            showNorthwindImage(0);
        }

        function closeNorthwindGallery() {
            northwindGallery.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Gallery triggers
        northwindTriggers.forEach(trigger => {
            trigger.addEventListener('click', openNorthwindGallery);
        });

        // Navigation
        northwindPrevBtn.addEventListener('click', function() {
            const newIndex = currentNorthwindIndex > 0 ? currentNorthwindIndex - 1 : northwindImages.length - 1;
            showNorthwindImage(newIndex);
        });

        northwindNextBtn.addEventListener('click', function() {
            const newIndex = currentNorthwindIndex < northwindImages.length - 1 ? currentNorthwindIndex + 1 : 0;
            showNorthwindImage(newIndex);
        });

        // Dots navigation
        northwindDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showNorthwindImage(index);
            });
        });

        // Close gallery
        northwindCloseBtn.addEventListener('click', closeNorthwindGallery);
        northwindOverlay.addEventListener('click', closeNorthwindGallery);
    }

    // ===== UNIVERSAL GALLERY KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', function(e) {
        // Check which gallery is open and handle keyboard navigation
        if (adventureworksGallery && adventureworksGallery.style.display === 'flex') {
            if (e.key === 'Escape') closeAdventureworksGallery();
            if (e.key === 'ArrowLeft') adventureworksPrevBtn.click();
            if (e.key === 'ArrowRight') adventureworksNextBtn.click();
        } else if (superstoreGallery && superstoreGallery.style.display === 'flex') {
            if (e.key === 'Escape') closeSuperstoreGallery();
            if (e.key === 'ArrowLeft') superstorePrevBtn.click();
            if (e.key === 'ArrowRight') superstoreNextBtn.click();
        } else if (northwindGallery && northwindGallery.style.display === 'flex') {
            if (e.key === 'Escape') closeNorthwindGallery();
            if (e.key === 'ArrowLeft') northwindPrevBtn.click();
            if (e.key === 'ArrowRight') northwindNextBtn.click();
        }
    });

    // ===== ROI CALCULATOR =====
    const roiCalculatorTriggers = document.querySelectorAll('.roi-calculator-trigger');
    roiCalculatorTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // ROI Calculator functionality - to be implemented
            alert('ROI Calculator coming soon! Contact me for a personalized assessment.');
        });
    });

    // ===== PLATFORM ANALYSIS DOWNLOAD =====
    const platformAnalysisTriggers = document.querySelectorAll('.platform-analysis-trigger');
    platformAnalysisTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // Platform analysis download - to be implemented
            alert('Platform Analysis download coming soon! Contact me for the full report.');
        });
    });

    // ===== CASE STUDY TRIGGERS =====
    const caseStudyTriggers = document.querySelectorAll('.case-study-trigger');
    caseStudyTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const caseStudyType = this.dataset.caseStudy;
            // Case study functionality - to be implemented
            alert(`${caseStudyType} case study coming soon! Contact me for detailed project information.`);
        });
    });

    // ===== MOBILE NAVIGATION =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav__items');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__items--mobile-active');
            this.classList.toggle('nav-toggle--active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('nav__items--mobile-active');
                navToggle.classList.remove('nav-toggle--active');
            });
        });
    }

    // ===== LOADING ANIMATIONS =====
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stats, .work, .dashboards, .platform-advantages, .services, .about');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // ===== FORM ENHANCEMENTS =====
    const formInputs = document.querySelectorAll('.contact__form input, .contact__form textarea, .contact__form select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('form__group--focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('form__group--focused');
            }
        });

        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('form__group--focused');
        }
    });

    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // ===== ANALYTICS TRACKING =====
    // Track button clicks and form submissions
    function trackEvent(eventName, element) {
        // Google Analytics tracking - to be implemented when GA is set up
        console.log(`Event tracked: ${eventName}`, element);
    }

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn--primary, .btn--teal');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('CTA Click', this.textContent.trim());
        });
    });

    // Track form submissions
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('Form Submission', 'Contact Form');
        });
    }

    console.log('Portfolio JavaScript loaded successfully!');
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== WINDOW RESIZE HANDLING =====
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments
    const galleries = [
        document.getElementById('automationGallery'),
        document.getElementById('powerbiGallery'),
        document.getElementById('adventureworksGallery'),
        document.getElementById('superstoreGallery'),
        document.getElementById('northwindGallery')
    ];

    galleries.forEach(gallery => {
        if (gallery && gallery.style.display === 'flex') {
            // Adjust gallery layout for different screen sizes
            const modalContent = gallery.querySelector('.modal__content');
            if (modalContent) {
                modalContent.style.maxHeight = `${window.innerHeight * 0.9}px`;
            }
        }
    });
}, 250));

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ===== BROWSER COMPATIBILITY =====
// Check for modern browser features and provide fallbacks
if (!window.IntersectionObserver) {
    // Fallback for older browsers
    const elements = document.querySelectorAll('.stats, .work, .dashboards, .platform-advantages, .services, .about');
    elements.forEach(element => {
        element.classList.add('animate-in');
    });
}
