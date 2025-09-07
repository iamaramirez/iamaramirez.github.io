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
    const roiCalculator = document.getElementById('roiCalculatorModal');
    const roiCalculatorTriggers = document.querySelectorAll('.roi-calculator-trigger');
    
    if (roiCalculator && roiCalculatorTriggers.length > 0) {
        let currentStep = 1;
        let selectedSolution = null;
        let calculatorData = {};
        let calculatedResults = {};

        // Modal elements
        const roiModal = roiCalculator;
        const roiOverlay = roiModal.querySelector('.roi-modal__overlay');
        const roiCloseBtn = roiModal.querySelector('.roi-modal__close');
        
        // Step elements
        const steps = roiModal.querySelectorAll('.roi-step');
        
        // Navigation buttons
        const calculateBtn = roiModal.querySelector('#calculateROI');
        
        // Form elements
        const solutionCards = roiModal.querySelectorAll('.roi-solution-card');
        const captureForm = roiModal.querySelector('#roiCaptureForm');

        // Calculation formulas
        const calculationFormulas = {
            email: function(emailsPerDay, timePerEmail, employeeRate, errorRate) {
                const annualEmails = emailsPerDay * 365;
                const totalMinutesPerYear = annualEmails * timePerEmail;
                const totalHoursPerYear = totalMinutesPerYear / 60;
                const timeSavings = totalHoursPerYear * 0.8; // 80% efficiency gain
                const costSavings = timeSavings * employeeRate;
                const errorReduction = (annualEmails * errorRate / 100) * (timePerEmail / 60) * employeeRate * 0.9; // 90% error reduction
                
                return {
                    annualTimeSavings: Math.round(timeSavings),
                    annualCostSavings: Math.round(costSavings + errorReduction),
                    monthlyTimeSavings: Math.round(timeSavings / 12),
                    monthlyCostSavings: Math.round((costSavings + errorReduction) / 12),
                    roiPercentage: Math.round(((costSavings + errorReduction) / 15000) * 100), // $15k implementation
                    paybackMonths: Math.round(15000 / ((costSavings + errorReduction) / 12))
                };
            },
            api: function(systemsMonitored, incidentsPerMonth, costPerHour, monitoringHours) {
                const annualDowntimeCost = (incidentsPerMonth * 12) * costPerHour * 2; // avg 2hrs per incident
                const downtimeSavings = annualDowntimeCost * 0.9; // 90% reduction
                const monitoringCostSavings = (monitoringHours * 52) * 45 * 0.9; // $45/hr IT staff, 90% reduction
                const totalSavings = downtimeSavings + monitoringCostSavings;
                
                return {
                    annualTimeSavings: Math.round((monitoringHours * 52) * 0.9),
                    annualCostSavings: Math.round(totalSavings),
                    monthlyTimeSavings: Math.round((monitoringHours * 52 * 0.9) / 12),
                    monthlyCostSavings: Math.round(totalSavings / 12),
                    roiPercentage: Math.round((totalSavings / 12000) * 100), // $12k implementation
                    paybackMonths: Math.round(12000 / (totalSavings / 12))
                };
            },
            integration: function(invoicesPerDay, reconciliationHours, accountingRate, reconciliationErrors) {
                const annualReconciliationSavings = (reconciliationHours * 52) * accountingRate * 0.95; // 95% efficiency
                const errorCostSavings = (invoicesPerDay * 365) * (reconciliationErrors / 100) * (10 / 60) * accountingRate; // 10min per error
                const totalSavings = annualReconciliationSavings + errorCostSavings;
                
                return {
                    annualTimeSavings: Math.round((reconciliationHours * 52) * 0.95),
                    annualCostSavings: Math.round(totalSavings),
                    monthlyTimeSavings: Math.round((reconciliationHours * 52 * 0.95) / 12),
                    monthlyCostSavings: Math.round(totalSavings / 12),
                    roiPercentage: Math.round((totalSavings / 25000) * 100), // $25k implementation
                    paybackMonths: Math.round(25000 / (totalSavings / 12))
                };
            }
        };

        // Open calculator modal
        function openROICalculator() {
            roiModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            showStep(1);
        }

        // Close calculator modal
        function closeROICalculator() {
            roiModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetCalculator();
        }

        // Reset calculator
        function resetCalculator() {
            currentStep = 1;
            selectedSolution = null;
            calculatorData = {};
            calculatedResults = {};
            solutionCards.forEach(card => card.classList.remove('selected'));
        }

        // Show specific step
        function showStep(stepNumber) {
            steps.forEach(step => step.classList.remove('active'));
            
            const targetStep = roiModal.querySelector(`#roiStep${stepNumber}`);
            if (targetStep) {
                targetStep.classList.add('active');
            }

            // Update navigation visibility
            const backBtns = roiModal.querySelectorAll('.roi-back-btn');
            backBtns.forEach(btn => btn.style.display = stepNumber > 1 ? 'block' : 'none');

            // Update step-specific content
            if (stepNumber === 2) {
                updateInputsForSolution();
            }
            
            currentStep = stepNumber;
        }

        // Update inputs based on selected solution
        function updateInputsForSolution() {
            const allInputGroups = roiModal.querySelectorAll('.roi-input-group');
            allInputGroups.forEach(group => group.style.display = 'none');
            
            const titleElement = roiModal.querySelector('#roiSolutionTitle');
            
            if (selectedSolution === 'email') {
                document.getElementById('emailInputs').style.display = 'block';
                if (titleElement) titleElement.textContent = 'Email Processing Automation';
            } else if (selectedSolution === 'api') {
                document.getElementById('apiInputs').style.display = 'block';
                if (titleElement) titleElement.textContent = 'API Monitoring System';
            } else if (selectedSolution === 'integration') {
                document.getElementById('integrationInputs').style.display = 'block';
                if (titleElement) titleElement.textContent = 'ServiceTitan-Xero Integration';
            }
        }

        // Calculate ROI based on inputs
        function calculateROI() {
            if (!selectedSolution) {
                alert('Please select a solution first');
                return;
            }

            let results;

            if (selectedSolution === 'email') {
                const emailsPerDay = parseInt(document.getElementById('emailsPerDay').value) || 0;
                const timePerEmail = parseInt(document.getElementById('timePerEmail').value) || 0;
                const employeeRate = parseFloat(document.getElementById('employeeRate').value) || 0;
                const errorRate = parseFloat(document.getElementById('errorRate').value) || 0;
                
                results = calculationFormulas.email(emailsPerDay, timePerEmail, employeeRate, errorRate);
                calculatorData = { emailsPerDay, timePerEmail, employeeRate, errorRate };
            } else if (selectedSolution === 'api') {
                const systemsMonitored = parseInt(document.getElementById('systemsMonitored').value) || 0;
                const incidentsPerMonth = parseInt(document.getElementById('incidentsPerMonth').value) || 0;
                const costPerHour = parseFloat(document.getElementById('costPerHour').value) || 0;
                const monitoringHours = parseInt(document.getElementById('monitoringHours').value) || 0;
                
                results = calculationFormulas.api(systemsMonitored, incidentsPerMonth, costPerHour, monitoringHours);
                calculatorData = { systemsMonitored, incidentsPerMonth, costPerHour, monitoringHours };
            } else if (selectedSolution === 'integration') {
                const invoicesPerDay = parseInt(document.getElementById('invoicesPerDay').value) || 0;
                const reconciliationHours = parseInt(document.getElementById('reconciliationHours').value) || 0;
                const accountingRate = parseFloat(document.getElementById('accountingRate').value) || 0;
                const reconciliationErrors = parseFloat(document.getElementById('reconciliationErrors').value) || 0;
                
                results = calculationFormulas.integration(invoicesPerDay, reconciliationHours, accountingRate, reconciliationErrors);
                calculatorData = { invoicesPerDay, reconciliationHours, accountingRate, reconciliationErrors };
            }

            calculatedResults = results;
            displayPreviewResults(results);
            showStep(3);
        }

        // Display preview results
        function displayPreviewResults(results) {
            const timeSavingsEl = document.getElementById('previewTimeSavings');
            const costSavingsEl = document.getElementById('previewCostSavings');
            
            if (timeSavingsEl) timeSavingsEl.textContent = `${results.annualTimeSavings.toLocaleString()}`;
            if (costSavingsEl) costSavingsEl.textContent = `$${results.annualCostSavings.toLocaleString()}`;
        }

        // Handle form submission and send email
        function handleFormSubmission(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const company = document.getElementById('companyName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value || 'Not provided';

            // Basic validation
            if (!name || !company || !email) {
                alert('Please fill in all required fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Generate detailed email content
            const solutionNames = {
                email: 'Email Processing Automation',
                api: 'API Monitoring System',
                integration: 'ServiceTitan-Xero Integration'
            };

            const solutionName = solutionNames[selectedSolution];
            const subject = `ROI Calculator Results - ${solutionName} - ${company}`;
            
            let inputDetails = '';
            if (selectedSolution === 'email') {
                inputDetails = `
CURRENT PROCESS DETAILS:
• Emails with attachments per day: ${calculatorData.emailsPerDay}
• Minutes spent per email: ${calculatorData.timePerEmail}
• Employee hourly rate: $${calculatorData.employeeRate}
• Current error rate: ${calculatorData.errorRate}%`;
            } else if (selectedSolution === 'api') {
                inputDetails = `
CURRENT PROCESS DETAILS:
• Critical systems monitored: ${calculatorData.systemsMonitored}
• Downtime incidents per month: ${calculatorData.incidentsPerMonth}
• Cost per hour of downtime: $${calculatorData.costPerHour}
• Manual monitoring hours per week: ${calculatorData.monitoringHours}`;
            } else if (selectedSolution === 'integration') {
                inputDetails = `
CURRENT PROCESS DETAILS:
• Invoices processed daily: ${calculatorData.invoicesPerDay}
• Reconciliation hours per week: ${calculatorData.reconciliationHours}
• Accounting staff hourly rate: $${calculatorData.accountingRate}
• Reconciliation error rate: ${calculatorData.reconciliationErrors}%`;
            }

            const emailBody = `Hello Allan,

A new lead has completed the ROI Calculator on your website:

CONTACT INFORMATION:
• Name: ${name}
• Company: ${company}
• Email: ${email}
• Phone: ${phone}

SOLUTION INTEREST: ${solutionName}
${inputDetails}

ROI CALCULATION RESULTS:
• Annual Time Savings: ${calculatedResults.annualTimeSavings.toLocaleString()} hours
• Annual Cost Savings: $${calculatedResults.annualCostSavings.toLocaleString()}
• Monthly Time Savings: ${calculatedResults.monthlyTimeSavings.toLocaleString()} hours
• Monthly Cost Savings: $${calculatedResults.monthlyCostSavings.toLocaleString()}
• ROI Percentage: ${calculatedResults.roiPercentage}%
• Payback Period: ${calculatedResults.paybackMonths} months

NEXT STEPS:
1. Send detailed ROI report to: ${email}
2. Follow up within 24 hours for consultation scheduling
3. Prepare solution-specific implementation plan

This lead was generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

Best regards,
Your Website ROI Calculator`;

            // Create mailto link
            const mailtoLink = `mailto:iamahlramz253@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success step
            showStep(4);
            
            // Track conversion
            trackEvent('ROI Calculator - Lead Generated', `${selectedSolution}: ${company}`);
        }

        // Event listeners
        roiCalculatorTriggers.forEach(trigger => {
            trigger.addEventListener('click', openROICalculator);
        });

        if (roiCloseBtn) roiCloseBtn.addEventListener('click', closeROICalculator);
        if (roiOverlay) roiOverlay.addEventListener('click', closeROICalculator);

        // Solution selection
        solutionCards.forEach(card => {
            card.addEventListener('click', function() {
                solutionCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                selectedSolution = this.dataset.solution;
                
                // Auto-advance to step 2
                setTimeout(() => {
                    showStep(2);
                }, 300);
                
                trackEvent('ROI Calculator - Solution Selected', selectedSolution);
            });
        });

        // Back button navigation
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('roi-back-btn')) {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            }
        });

        // Calculate button
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateROI);
        }

        // Form submission
        if (captureForm) {
            captureForm.addEventListener('submit', handleFormSubmission);
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (roiModal.style.display === 'flex' && e.key === 'Escape') {
                closeROICalculator();
            }
        });
    }

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
