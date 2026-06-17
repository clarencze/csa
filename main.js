/* ============================================================
   AQUINO — main.js
   Portfolio · Clarence Aquino
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------
       DOM References
    ---------------------------------------------------------- */
    const mobileMenuBtn     = document.getElementById('mobile-menu-btn');
    const mobileMenu        = document.getElementById('mobile-menu');
    const mobileNavLinks    = document.querySelectorAll('.mobile-nav-link');
    const header            = document.querySelector('header');
    const scrollTrackProgress = document.getElementById('scroll-track-progress');
    const navActiveSector   = document.getElementById('nav-active-sector');
    const pitWallStatus     = document.getElementById('pit-wall-status');
    const backToPitBtn      = document.getElementById('back-to-pit');
    const navItems          = document.querySelectorAll('.nav-item');
    const sections          = document.querySelectorAll('section');
    const cpuValSpan        = document.getElementById('cpu-load-val');
    const cpuRing           = document.getElementById('cpu-ring');
    const systemTimeSpan    = document.getElementById('system-time');
    const uptimeSpan        = document.getElementById('uptime-val');
    const contactForm       = document.getElementById('consoleContactForm');
    const contactSuccessMsg = document.getElementById('contact-success-msg');
    const contactSubmitBtn  = document.getElementById('contact-submit-btn');
    const contribGrid       = document.getElementById('contrib-grid-cells');
    const canvas            = document.getElementById('liveTelemetryCanvas');
    const showcaseModal     = document.getElementById('showcase-modal');
    const showcaseModalImage = document.getElementById('showcase-modal-image');
    const showcaseModalTitle = document.getElementById('showcase-modal-title');
    const showcaseModalCaption = document.getElementById('showcase-modal-caption');
    const showcaseModalCounter = document.getElementById('showcase-modal-counter');
    const showcasePrevButton = document.querySelector('[data-showcase-prev]');
    const showcaseNextButton = document.querySelector('[data-showcase-next]');
    const showcaseOpenButtons = document.querySelectorAll('[data-showcase-open]');
    const showcaseCloseButtons = document.querySelectorAll('[data-showcase-close]');

    /* ----------------------------------------------------------
       Mobile Navigation
    ---------------------------------------------------------- */
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    /* ----------------------------------------------------------
    Scroll — Progress Bar · Header · Status Labels · Nav
    ---------------------------------------------------------- */
    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        /* Progress bar */
        scrollTrackProgress.style.width = `${pct}%`;

        /* Header density */
        if (scrollTop > 50) {
            header.classList.add('py-1', 'shadow-2xl', 'bg-darkBg/95');
            header.classList.remove('py-3');
            backToPitBtn.classList.remove('translate-y-24', 'opacity-0');
        } else {
            header.classList.remove('py-1', 'shadow-2xl', 'bg-darkBg/95');
            header.classList.add('py-3');
            backToPitBtn.classList.add('translate-y-24', 'opacity-0');
        }

        /* Active section detection */
        let currentId = 'hero';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (scrollTop >= top && scrollTop < top + section.offsetHeight) {
                currentId = section.getAttribute('id');
            }
        });

        if (['hero', 'about'].includes(currentId)) {
            navActiveSector.textContent = 'Overview';
            pitWallStatus.innerHTML = `<i class="fa-solid fa-circle-dot text-f1Red animate-pulse"></i> Portfolio`;
        } else if (['skills', 'projects'].includes(currentId)) {
            navActiveSector.textContent = 'Work';
            pitWallStatus.innerHTML = `<i class="fa-solid fa-circle-dot text-telemetryBlue animate-pulse"></i> Portfolio`;
        } else if (['experience', 'contact'].includes(currentId)) {
            navActiveSector.textContent = 'Contact';
            pitWallStatus.innerHTML = `<i class="fa-solid fa-circle-dot text-telemetryGreen animate-pulse"></i> Portfolio`;
        }

        /* Nav highlight */
        navItems.forEach(item => {
            const target = item.getAttribute('data-section');
            if (target === currentId) {
                item.classList.add('text-f1Red', 'glow-red');
                item.classList.remove('text-subtleGray');
            } else {
                item.classList.remove('text-f1Red', 'glow-red');
                item.classList.add('text-subtleGray');
            }
        });
    });

    /* Back to top */
    backToPitBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ----------------------------------------------------------
       Showcase Modal
    ---------------------------------------------------------- */
    if (showcaseModal && showcaseModalImage && showcaseModalTitle && showcaseModalCaption) {
        let showcaseImages = [];
        let showcaseIndex = 0;

        const updateShowcaseImage = () => {
            if (!showcaseImages.length) {
                return;
            }

            const imagePath = showcaseImages[showcaseIndex];
            showcaseModalImage.src = imagePath;
            showcaseModalImage.alt = `${showcaseModalTitle.textContent} preview ${showcaseIndex + 1}`;

            if (showcaseModalCounter) {
                showcaseModalCounter.textContent = `${showcaseIndex + 1} / ${showcaseImages.length}`;
            }

            if (showcasePrevButton) {
                showcasePrevButton.classList.toggle('opacity-40', showcaseImages.length < 2);
                showcasePrevButton.disabled = showcaseImages.length < 2;
            }

            if (showcaseNextButton) {
                showcaseNextButton.classList.toggle('opacity-40', showcaseImages.length < 2);
                showcaseNextButton.disabled = showcaseImages.length < 2;
            }
        };

        const openShowcase = button => {
            const images = (button.dataset.showcaseImages || button.dataset.showcaseImage || '')
                .split('|')
                .map(image => image.trim())
                .filter(Boolean);

            showcaseImages = images.length ? images : [''];
            showcaseIndex = 0;
            showcaseModalTitle.textContent = button.dataset.showcaseTitle;
            showcaseModalCaption.textContent = button.dataset.showcaseCaption;
            showcaseModal.classList.remove('hidden');
            showcaseModal.classList.add('flex');
            showcaseModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('overflow-hidden');
            updateShowcaseImage();
        };

        const closeShowcase = () => {
            showcaseModal.classList.add('hidden');
            showcaseModal.classList.remove('flex');
            showcaseModal.setAttribute('aria-hidden', 'true');
            showcaseModalImage.src = '';
            showcaseImages = [];
            showcaseIndex = 0;
            if (showcaseModalCounter) {
                showcaseModalCounter.textContent = '1 / 1';
            }
            document.body.classList.remove('overflow-hidden');
        };

        const showPreviousImage = () => {
            if (showcaseImages.length < 2) {
                return;
            }

            showcaseIndex = (showcaseIndex - 1 + showcaseImages.length) % showcaseImages.length;
            updateShowcaseImage();
        };

        const showNextImage = () => {
            if (showcaseImages.length < 2) {
                return;
            }

            showcaseIndex = (showcaseIndex + 1) % showcaseImages.length;
            updateShowcaseImage();
        };

        showcaseOpenButtons.forEach(button => {
            button.addEventListener('click', () => openShowcase(button));
        });

        if (showcasePrevButton) {
            showcasePrevButton.addEventListener('click', showPreviousImage);
        }

        if (showcaseNextButton) {
            showcaseNextButton.addEventListener('click', showNextImage);
        }

        showcaseCloseButtons.forEach(button => {
            button.addEventListener('click', closeShowcase);
        });

        showcaseModal.addEventListener('click', event => {
            if (event.target === showcaseModal) {
                closeShowcase();
            }
        });

        window.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !showcaseModal.classList.contains('hidden')) {
                closeShowcase();
            } else if (event.key === 'ArrowLeft' && !showcaseModal.classList.contains('hidden')) {
                showPreviousImage();
            } else if (event.key === 'ArrowRight' && !showcaseModal.classList.contains('hidden')) {
                showNextImage();
            }
        });
    }

  
    /* ----------------------------------------------------------
       System Clock (GMT+8)
    ---------------------------------------------------------- */
    if (systemTimeSpan) {
        const tick = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            systemTimeSpan.textContent = `GMT+8: ${h}:${m}:${s}`;
        };
        tick();
        setInterval(tick, 1000);
    }

    /* ----------------------------------------------------------
       Contact Form
    ---------------------------------------------------------- */
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            contactSubmitBtn.disabled = true;
            contactSubmitBtn.innerHTML = `
                <span class="skew-x-[10deg] flex items-center gap-2">
                    SENDING... <i class="fa-solid fa-spinner animate-spin"></i>
                </span>`;

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            const developerEmail = "aquinoclarence89@gmail.com";

            //Map the exact text cleanly with a neat signature footer at the bottom
            const emailBody = `${message}\n\n---\nSender Details:\nName: ${name}\nContact Email: ${email}`;

            //Build the official web-based Gmail composer link scheme
            const targetUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(developerEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            window.open(targetUrl, '_blank');
            setTimeout(() => {
                contactSuccessMsg.classList.remove('hidden');

                contactForm.reset(); 
                document.getElementById('contact-message').value = "Hi Clarence, "; 
                // --------------------------

                contactSubmitBtn.disabled = false;
                contactSubmitBtn.innerHTML = `
                    <span class="skew-x-[10deg] flex items-center gap-2">
                        SEND MESSAGE <i class="fa-solid fa-paper-plane"></i>
                    </span>`;
                
                setTimeout(() => contactSuccessMsg.classList.add('hidden'), 10000);
            }, 1800);
        });
    }

});
