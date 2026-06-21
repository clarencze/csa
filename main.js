 /* ----------------------------------------------------
       CAROUSEL PROJECT DATA MATRIX & CAROUSEL MECHANICS
       ---------------------------------------------------- */
    const projects = [
      {
        index: "01 / 04",
        title: "Digital Signal Processing Simulator",
        desc: "A real-time signal processing and visualization tool simulating analog and digital systems. Implements oscilloscope-style wave rendering with digital filter analysis (Butterworth, Chebyshev), Fourier Transform techniques (DFT/FFT), windowing functions, Z-transform concepts, and audio/image signal processing workflows for frequency-domain exploration.",
        lang: ["Python", "PyQt6", "NumPy"],
        interface: "Interactive GUI",
        devices: "Desktop Application",
        github: "https://github.com/clarence-eng/riscv-core-fpga",
        images: [
          {
            src: "img/dsp.png",
            label: "DSP",
          },
          {
            src: "img/dsp-2.png",
            label: "DSP",
          },
          {
            src: "img/dsp-3.png",
            label: "DSP",
          },
                    {
            src: "img/dsp-4.png",
            label: "DSP",
          }
        ]
      },
      {
        index: "02 / 04",
        title: "ESP32-CAM Remote Health Monitor",
        desc: "An embedded IoT system capable of real-time video transmission and environmental monitoring, integrating thermal readings, power consumption metrics, and network transmission performance tracking. Implements computer vision-based person detection using YOLO, triggering system initialization and data streaming upon detection events.",
        lang: ["C++", "Python", "YoloV8"],
        interface: "Interactive Touch Display",
        devices: "ESP32-CAM",
        github: "https://github.com/clarence-eng/telemetry-sensor-node",
        images: [
          {
            src: "img/espcam.JPG",
            label: "ESP Health",
          },
          {
            src: "img/esp-2.png",
            label: "ESP Health",
          }
        ]
      },
      {
        index: "03 / 04",
        title: "OS Scheduler & Memory Visualizer",
        desc: "Developed an interactive Operating System simulator that demonstrates CPU scheduling and page replacement algorithms through real-time visualizations. Supports FCFS, SJF, Priority, Round Robin, FIFO, LRU, and Optimal algorithms, enabling users to analyze execution flow, waiting times, turnaround times, and memory management behavior.",
        lang: ["HTML", "CSS", "JavaScript"],
        interface: "Interactive Algorithm Visualizer",
        devices: "Web Application",
        github: "https://github.com/clarencze/OS-VISUALIZER",
        live: "https://osvisualizer.onrender.com/",
        images: [
          {
            src: "img/osv.png",
            label: "OS Simulator",
          }
        ]
      },
            {
        index: "04 / 04",
        title: "Numerical Methods Engine",
        desc: "A computational tool for solving and analyzing systems of linear equations and numerical methods. Implements Cramer’s Rule, Gaussian Elimination, Gauss-Jordan Elimination, and LU Decomposition, with step-by-step solutions and result validation for educational and problem-solving purposes.",
        lang: ["HTML", "CSS", "JavaScript"],
        interface: "Interactive Problem Solver",
        devices: "Web Application",
        github: "https://github.com/Jviscoding/Numerical-Method",
        live: "https://numerical-method.pages.dev/",
        images: [
          {
            src: "img/num.png",
            label: "Numerical Methods",
          }
        ]
      }
    ];

    let currentProjectIndex = 0;
    let currentImageIndex = 0;

    const projIndexEl = document.getElementById("proj-index");
    const projTitleEl = document.getElementById("proj-title");
    const projDescEl = document.getElementById("proj-desc");
    const projLangEl = document.getElementById("proj-lang");
    const projInterfaceEl = document.getElementById("proj-interface");
    const projDevicesEl = document.getElementById("proj-devices");
    const projGithubEl = document.getElementById("proj-github");
    const projLiveEl = document.getElementById("proj-live");

    const galleryImgEl = document.getElementById("gallery-img");
    const gallerySvgContainer = document.getElementById("gallery-svg-container");
    const galleryCaptionEl = document.getElementById("gallery-caption");
    const galleryCounterEl = document.getElementById("gallery-counter");

    // Dynamic error handler when image load fails
    function handleImageFallback() {
      const proj = projects[currentProjectIndex];
      const activeImg = proj.images[currentImageIndex];
      
      galleryImgEl.classList.add("hidden");
      gallerySvgContainer.classList.remove("hidden");
      gallerySvgContainer.innerHTML = activeImg.fallbackSvg;
    }

    function renderActiveProject() {
      const proj = projects[currentProjectIndex];
      
      // Perform transient transition fadeout on the entire viewport content
      const container = document.getElementById("carousel-slide-content");
      container.style.opacity = 0;
      container.style.transform = "scale(0.99)";
      container.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      
      setTimeout(() => {
        // Render Details
        projIndexEl.textContent = proj.index;
        projTitleEl.textContent = proj.title;
        projDescEl.textContent = proj.desc;
        projLangEl.innerHTML = Array.isArray(proj.lang)
  ? proj.lang.map(lang => `
      <span class="px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm">
        ${lang}
      </span>
    `).join("")
  : `<span class="px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm">
      ${proj.lang}
    </span>`;
        projInterfaceEl.textContent = proj.interface;
        projDevicesEl.textContent = proj.devices;

        // Render Code Repository Links Dynamically
        if (proj.github) {
          projGithubEl.href = proj.github;
          projGithubEl.style.display = "inline-flex";
        } else {
          projGithubEl.style.display = "none";
        }

        if (proj.live) {
          projLiveEl.href = proj.live;
          projLiveEl.style.display = "inline-flex";
        } else {
          projLiveEl.style.display = "none";
        }

        // Reset Image Slideshow state to initial position
        currentImageIndex = 0;
        renderActiveGalleryImage();
        
        container.style.opacity = 1;
        container.style.transform = "scale(1)";
      }, 200);
    }

    function renderActiveGalleryImage() {
      const proj = projects[currentProjectIndex];
      const activeImg = proj.images[currentImageIndex];

      // Fade-out active image container layer
      galleryImgEl.style.opacity = 0;

      setTimeout(() => {
        // Try displaying active image asset
        galleryImgEl.classList.remove("hidden");
        gallerySvgContainer.classList.add("hidden");
        galleryImgEl.src = activeImg.src;
        galleryImgEl.style.opacity = 1;

        // Set metadata and tracking metrics
        galleryCaptionEl.textContent = activeImg.label;
        galleryCounterEl.textContent = `${(currentImageIndex + 1).toString().padStart(2, '0')} / ${proj.images.length.toString().padStart(2, '0')}`;
      }, 100);
    }

    // Connect Left and Right Event Triggers inside the gallery box
    document.getElementById("gallery-prev").addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid parent transition bubbles
      const proj = projects[currentProjectIndex];
      currentImageIndex = (currentImageIndex - 1 + proj.images.length) % proj.images.length;
      renderActiveGalleryImage();
    });

    document.getElementById("gallery-next").addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid parent transition bubbles
      const proj = projects[currentProjectIndex];
      currentImageIndex = (currentImageIndex + 1) % proj.images.length;
      renderActiveGalleryImage();
    });

    // Parent Slide Triggers
    document.getElementById("carousel-prev").addEventListener("click", () => {
      currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
      renderActiveProject();
    });

    document.getElementById("carousel-next").addEventListener("click", () => {
      currentProjectIndex = (currentProjectIndex + 1) % projects.length;
      renderActiveProject();
    });

    // Run initial execution thread on startup
    window.addEventListener("DOMContentLoaded", () => {
      renderActiveProject();
    });

    /* ----------------------------------------------------
       SMOOTH NAVIGATION SCROLLER INTERCEPTOR
       ---------------------------------------------------- */
    function setupScrollTo(elements) {
      elements.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // If mobile menu is open, close it instantly
            const mobileMenu = document.getElementById("mobile-menu");
            if (mobileMenu) {
              mobileMenu.classList.add("translate-x-full");
            }

            document.querySelectorAll('.nav-link').forEach(nl => {
              nl.classList.remove('text-neutral-800', 'dark:text-neutral-200');
              nl.classList.add('text-neutral-400');
            });
            this.classList.add('text-neutral-800', 'dark:text-neutral-200');
            this.classList.remove('text-neutral-400');
          }
        });
      });
    }

    setupScrollTo(document.querySelectorAll('.nav-link'));
    setupScrollTo(document.querySelectorAll('.mobile-nav-link'));

    // Handle Active State mapping during scroll
    window.addEventListener('scroll', () => {
      let currentSection = '';
      const sections = document.querySelectorAll('section');
      const scrollPos = window.scrollY + 200;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      if (currentSection) {
        document.querySelectorAll('.nav-link').forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentSection}`) {
            link.classList.add('text-neutral-800', 'dark:text-neutral-200');
            link.classList.remove('text-neutral-400');
          } else {
            link.classList.remove('text-neutral-800', 'dark:text-neutral-200');
            link.classList.add('text-neutral-400');
          }
        });
      }
    });


    /* ----------------------------------------------------
       MOBILE MENU ENGINE CONTROLLER
       ---------------------------------------------------- */
    const mobileMenuTrigger = document.getElementById("mobile-menu-trigger");
    const mobileMenuClose = document.getElementById("mobile-menu-close");
    const mobileMenu = document.getElementById("mobile-menu");

    mobileMenuTrigger.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
    });

    mobileMenuClose.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
    });


    /* ----------------------------------------------------
       THEME CONTROLLER & TRANSITION
       ---------------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const htmlEl = document.documentElement;
    const themeText = document.getElementById("mode-text");
    const transitionOverlay = document.getElementById("transition-overlay");

    // Check states
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      htmlEl.classList.add('dark');
      themeText.textContent = "LIGHT MODE";
    } else {
      htmlEl.classList.remove('dark');
      themeText.textContent = "DARK MODE";
    }

    themeToggleBtn.addEventListener("click", () => {
      // Trigger a clean fade transition
      transitionOverlay.classList.add("fading");
      
      setTimeout(() => {
        if (htmlEl.classList.contains('dark')) {
          htmlEl.classList.remove('dark');
          localStorage.theme = 'light';
          themeText.textContent = "DARK MODE";
        } else {
          htmlEl.classList.add('dark');
          localStorage.theme = 'dark';
          themeText.textContent = "LIGHT MODE";
        }
      }, 150);

      setTimeout(() => {
        transitionOverlay.classList.remove("fading");
      }, 300);
    });


    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("form-submit");
    const submitText = document.getElementById("submit-text");
    const submitIndicator = document.getElementById("submit-indicator");
    const formStatus = document.getElementById("form-status");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  // 🛡️ Honeypot (bot trap)
  const honeypot = document.getElementById("website")?.value;
  if (honeypot) return;

  const nameInput = document.getElementById("form-name");
  const emailInput = document.getElementById("form-email");
  const messageInput = document.getElementById("form-message");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  // 🛡️ Basic validation
  if (!name || !email || !message) {
    alert("Please fill out your name, email, and message.");
    return;
  }

  if (!emailInput.checkValidity()) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  // 🛡️ Anti-spam timing
  const now = Date.now();
  const startTime = form.dataset.startTime;

  if (startTime && now - parseInt(startTime, 10) < 3000) {
    alert("Please take a moment to write your message.");
    return;
  }

  // UI loading state
  submitBtn.disabled = true;
  submitText.textContent = "OPENING GMAIL...";
  submitIndicator.classList.remove("bg-neutral-400");
  submitIndicator.classList.add("bg-amber-500", "animate-ping");

  const subject = "Portfolio Contact Message";

  const body =
`Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from portfolio contact form`;

  const gmailUrl = new URL("https://mail.google.com/mail/");
  gmailUrl.searchParams.set("view", "cm");
  gmailUrl.searchParams.set("fs", "1");
  gmailUrl.searchParams.set("to", "aquinoclarence89@gmail.com");
  gmailUrl.searchParams.set("su", subject);
  gmailUrl.searchParams.set("body", body);

  const gmailWindow = window.open(gmailUrl.toString(), "_blank");
  if (!gmailWindow) {
    alert("Please allow popups for this site so Gmail can open in a new tab.");
    submitBtn.disabled = false;
    submitText.textContent = "SEND MESSAGE";
    submitIndicator.classList.remove("bg-amber-500", "animate-ping");
    submitIndicator.classList.add("bg-neutral-400");
    return;
  }

  submitText.textContent = "GMAIL OPENED";
  submitIndicator.classList.remove("bg-amber-500", "animate-ping");
  submitIndicator.classList.add("bg-emerald-500");

  formStatus.classList.remove("hidden");
  form.reset();

  // reset timer
  form.dataset.startTime = Date.now();

  setTimeout(() => {
    submitBtn.disabled = false;
    submitText.textContent = "SEND MESSAGE";
    submitIndicator.classList.remove("bg-emerald-500");
    submitIndicator.classList.add("bg-neutral-400");

    formStatus.classList.add("hidden");
  }, 2500);
});
