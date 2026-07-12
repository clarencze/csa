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
    let projectRenderTimer;
    let touchStartX = 0;
    let projectWasSwiped = false;

    const projIndexEl = document.getElementById("proj-index");
    const projTitleEl = document.getElementById("proj-title");
    const projDescEl = document.getElementById("proj-desc");
    const projLangEl = document.getElementById("proj-lang");
    const projInterfaceEl = document.getElementById("proj-interface");
    const projDevicesEl = document.getElementById("proj-devices");
    const projGithubEl = document.getElementById("proj-github");
    const projLiveEl = document.getElementById("proj-live");

    const galleryImgEl = document.getElementById("gallery-img");
    const galleryFallbackEl = document.getElementById("gallery-fallback");
    const galleryCaptionEl = document.getElementById("gallery-caption");
    const galleryCounterEl = document.getElementById("gallery-counter");
    const galleryLoadingEl = document.getElementById("gallery-loading");
    const galleryFallbackTextEl = document.getElementById("gallery-fallback-text");
    const galleryRetryEl = document.getElementById("gallery-retry");
    const mediaViewportEl = document.getElementById("media-viewport");
    const lightboxEl = document.getElementById("project-lightbox");
    const lightboxImageEl = document.getElementById("lightbox-image");
    const lightboxCaptionEl = document.getElementById("lightbox-caption");
    const projectFrameEl = document.querySelector(".project-frame");
    const projectPaginationEl = document.getElementById("project-pagination");
    const carouselSlideEl = document.getElementById("carousel-slide-content");

    function handleImageFallback() {
      galleryImgEl.classList.add("hidden");
      galleryLoadingEl.classList.add("is-loaded");
      galleryFallbackEl.classList.remove("hidden");
      galleryFallbackEl.classList.add("flex");
      galleryFallbackTextEl.textContent = `${projects[currentProjectIndex].title} screenshot could not be loaded.`;
    }

    galleryImgEl.addEventListener("error", handleImageFallback);
    galleryImgEl.addEventListener("load", () => {
      galleryLoadingEl.classList.add("is-loaded");
      galleryImgEl.style.opacity = 1;
    });

    galleryRetryEl.addEventListener("click", (event) => {
      event.stopPropagation();
      const activeImg = projects[currentProjectIndex].images[currentImageIndex];
      galleryFallbackEl.classList.add("hidden");
      galleryFallbackEl.classList.remove("flex");
      galleryLoadingEl.classList.remove("is-loaded");
      galleryImgEl.classList.remove("hidden");
      galleryImgEl.src = `${activeImg.src}?retry=${Date.now()}`;
    });

    projects.forEach((project, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-dot";
      button.setAttribute("aria-label", `Show project ${index + 1}: ${project.title}`);
      button.addEventListener("click", () => goToProject(index));
      projectPaginationEl.append(button);
    });

    function updateProjectPagination() {
      projectPaginationEl.querySelectorAll(".project-dot").forEach((dot, index) => {
        dot.setAttribute("aria-current", index === currentProjectIndex ? "true" : "false");
      });
    }

    function goToProject(index) {
      currentProjectIndex = (index + projects.length) % projects.length;
      renderActiveProject();
    }

    function renderActiveProject() {
      const proj = projects[currentProjectIndex];
      
      // Perform transient transition fadeout on the entire viewport content
      clearTimeout(projectRenderTimer);
      carouselSlideEl.style.opacity = 0;
      carouselSlideEl.style.transform = "translateY(8px) scale(0.995)";
      carouselSlideEl.style.transition = "opacity 0.2s ease, transform 0.2s ease";
      updateProjectPagination();
      
      projectRenderTimer = setTimeout(() => {
        // Render Details
        projIndexEl.textContent = proj.index;
        projTitleEl.textContent = proj.title;
        projDescEl.textContent = proj.desc;
        projLangEl.replaceChildren();
        const languages = Array.isArray(proj.lang) ? proj.lang : [proj.lang];
        languages.forEach((language) => {
          const badge = document.createElement("span");
          badge.className = "px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs sm:text-sm";
          badge.textContent = language;
          projLangEl.append(badge);
        });
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
        
        carouselSlideEl.style.opacity = 1;
        carouselSlideEl.style.transform = "translateY(0) scale(1)";
      }, 200);
    }

    function renderActiveGalleryImage() {
      const proj = projects[currentProjectIndex];
      const activeImg = proj.images[currentImageIndex];

      // Fade-out active image container layer
      galleryImgEl.style.opacity = 0;
      galleryLoadingEl.classList.remove("is-loaded");

      setTimeout(() => {
        // Try displaying active image asset
        galleryImgEl.classList.remove("hidden");
        galleryFallbackEl.classList.add("hidden");
        galleryFallbackEl.classList.remove("flex");
        galleryImgEl.src = activeImg.src;
        galleryImgEl.alt = `${proj.title}: ${activeImg.label}`;
        if (galleryImgEl.complete && galleryImgEl.naturalWidth > 0) {
          galleryLoadingEl.classList.add("is-loaded");
          galleryImgEl.style.opacity = 1;
        }

        // Set metadata and tracking metrics
        galleryCaptionEl.textContent = activeImg.label;
        galleryCounterEl.textContent = `${(currentImageIndex + 1).toString().padStart(2, '0')} / ${proj.images.length.toString().padStart(2, '0')}`;
      }, 100);
    }

    function updateLightbox() {
      const project = projects[currentProjectIndex];
      const image = project.images[currentImageIndex];
      lightboxImageEl.src = image.src;
      lightboxImageEl.alt = `${project.title}: ${image.label}`;
      lightboxCaptionEl.textContent = `${project.title} — ${image.label} — ${currentImageIndex + 1} / ${project.images.length}`;
    }

    function openLightbox() {
      if (projectWasSwiped) {
        projectWasSwiped = false;
        return;
      }
      if (galleryImgEl.classList.contains("hidden")) return;
      updateLightbox();
      lightboxEl.showModal();
      document.body.classList.add("overflow-hidden");
      document.getElementById("lightbox-close").focus();
    }

    function closeLightbox() {
      lightboxEl.close();
      document.body.classList.remove("overflow-hidden");
      mediaViewportEl.focus({ preventScroll: true });
    }

    function changeLightboxImage(direction) {
      const project = projects[currentProjectIndex];
      currentImageIndex = (currentImageIndex + direction + project.images.length) % project.images.length;
      renderActiveGalleryImage();
      updateLightbox();
    }

    mediaViewportEl.tabIndex = 0;
    mediaViewportEl.addEventListener("click", openLightbox);
    mediaViewportEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
      }
    });
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", () => changeLightboxImage(-1));
    document.getElementById("lightbox-next").addEventListener("click", () => changeLightboxImage(1));
    lightboxEl.addEventListener("click", (event) => {
      if (event.target === lightboxEl) closeLightbox();
    });
    lightboxEl.addEventListener("cancel", () => document.body.classList.remove("overflow-hidden"));
    lightboxEl.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") changeLightboxImage(-1);
      if (event.key === "ArrowRight") changeLightboxImage(1);
    });

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
      goToProject(currentProjectIndex - 1);
    });

    document.getElementById("carousel-next").addEventListener("click", () => {
      goToProject(currentProjectIndex + 1);
    });

    projectFrameEl.addEventListener("keydown", (event) => {
      if (event.target.closest("a, button, input, textarea")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToProject(currentProjectIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToProject(currentProjectIndex + 1);
      }
    });

    projectFrameEl.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
      projectWasSwiped = false;
    }, { passive: true });

    projectFrameEl.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) < 55) return;
      projectWasSwiped = true;
      setTimeout(() => { projectWasSwiped = false; }, 500);
      goToProject(currentProjectIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });

    // Run initial execution thread on startup
    window.addEventListener("DOMContentLoaded", () => {
      renderActiveProject();
    });

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

    function openMobileMenu() {
      mobileMenu.classList.remove("translate-x-full");
      mobileMenu.setAttribute("aria-hidden", "false");
      mobileMenu.inert = false;
      mobileMenuTrigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("overflow-hidden");
      mobileMenuClose.focus();
    }

    function closeMobileMenu({ restoreFocus = true } = {}) {
      mobileMenu.classList.add("translate-x-full");
      mobileMenu.setAttribute("aria-hidden", "true");
      mobileMenu.inert = true;
      mobileMenuTrigger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
      if (restoreFocus) mobileMenuTrigger.focus();
    }

    mobileMenuTrigger.addEventListener("click", openMobileMenu);
    mobileMenuClose.addEventListener("click", () => closeMobileMenu());

    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu({ restoreFocus: false }));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenuTrigger.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
      }
    });

    /* ----------------------------------------------------
       WANDERING PORTFOLIO MASCOT
       ---------------------------------------------------- */
    const mascot = document.getElementById("mascot");
    const mascotMessage = document.getElementById("mascot-message");
    const mascotVisibilityButton = document.getElementById("mascot-visibility");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mascotMessages = [
      "Hi. I'm Byte. I supervise the bugs.",
      "The projects are that way. Probably.",
      "Everything works on my machine.",
      "I run on one pixel of optimism.",
      "You found the smallest engineer here.",
      "Current status: pretending this is a feature.",
    ];
    const mascotDragMessages = [
      "Whoa—new coordinates!",
      "Careful, I'm not a desktop icon.",
      "This was not in my job description.",
      "Deploying me somewhere else?",
      "I can walk, you know.",
      "Okay, okay—I'm moving!",
    ];
    const mascotSectionMessages = {
      hero: "Welcome! Clarence made me work the reception desk.",
      about: "This is the human behind the code. I'm clearly the management.",
      skills: "A suspicious number of tools. I only have two feet.",
      projects: "These projects survived debugging. Mostly.",
      experience: "Experience: where bugs become lessons.",
      contact: "You made it! Say hello; I approve this message.",
    };
    let mascotMoveTimer;
    let mascotTalkTimer;
    let mascotWalkTimer;
    let mascotDragStartX = 0;
    let mascotDragStartY = 0;
    let mascotDragStartLeft = 0;
    let mascotDragStartTop = 0;
    let mascotWasDragged = false;
    let mascotSpokeDuringDrag = false;
    let mascotPointerY = 0;
    let mascotScrollFrame;
    let currentMascotSection = "hero";
    let mascotSectionTimer;

    function showMascotMessage(message, duration = 2600, excited = false) {
      mascotMessage.textContent = message;
      mascot.classList.add("is-talking");
      mascot.classList.toggle("is-excited", excited);
      clearTimeout(mascotTalkTimer);
      mascotTalkTimer = setTimeout(() => mascot.classList.remove("is-talking"), duration);
      if (excited) setTimeout(() => mascot.classList.remove("is-excited"), 450);
    }

    function makeMascotTalk() {
      const contextualMessage = mascotSectionMessages[currentMascotSection];
      const message = Math.random() < 0.65 && contextualMessage
        ? contextualMessage
        : mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
      showMascotMessage(message, 2600, true);
    }

    function makeMascotReactToDrag() {
      const message = mascotDragMessages[Math.floor(Math.random() * mascotDragMessages.length)];
      showMascotMessage(message, 2200);
    }

    function setMascotHidden(hidden, persist = true, announce = true) {
      mascot.hidden = hidden;
      mascotVisibilityButton.textContent = hidden ? "Show Byte" : "Hide Byte";
      mascotVisibilityButton.setAttribute("aria-pressed", hidden ? "true" : "false");
      if (persist) localStorage.setItem("byteHidden", hidden ? "true" : "false");
      if (hidden) {
        clearTimeout(mascotMoveTimer);
        clearTimeout(mascotTalkTimer);
        clearTimeout(mascotWalkTimer);
        mascot.classList.remove("is-walking");
        cancelAnimationFrame(mascotScrollFrame);
      } else if (announce) {
        clearTimeout(mascotMoveTimer);
        mascotMoveTimer = setTimeout(moveMascot, 500);
        showMascotMessage("Byte is back online.", 1800, true);
      }
    }

    setMascotHidden(localStorage.getItem("byteHidden") === "true", false, false);
    mascotVisibilityButton.addEventListener("click", () => setMascotHidden(!mascot.hidden));

    const mascotSectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);
      if (!visibleSection || visibleSection.target.id === currentMascotSection) return;
      currentMascotSection = visibleSection.target.id;
      if (mascot.hidden || !mascotSectionMessages[currentMascotSection]) return;
      clearTimeout(mascotSectionTimer);
      mascotSectionTimer = setTimeout(() => {
        showMascotMessage(mascotSectionMessages[currentMascotSection], 2800);
      }, 450);
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });

    document.querySelectorAll("main > section").forEach((section) => mascotSectionObserver.observe(section));

    function moveMascot() {
      if (mascot.hidden || reducedMotion.matches || document.hidden) return;
      const edgePadding = 20;
      const maximumLeft = Math.max(edgePadding, window.innerWidth - mascot.offsetWidth - edgePadding);
      const maximumTop = Math.max(edgePadding, window.innerHeight - mascot.offsetHeight - edgePadding);
      const currentPosition = mascot.getBoundingClientRect();
      const nextLeft = edgePadding + Math.random() * (maximumLeft - edgePadding);
      const nextTop = edgePadding + Math.random() * (maximumTop - edgePadding);
      mascot.classList.toggle("is-facing-left", nextLeft < currentPosition.left);
      updateMascotEdgeState(nextLeft, nextTop);
      mascot.style.bottom = "auto";
      mascot.classList.add("is-walking");
      mascot.style.left = `${nextLeft}px`;
      mascot.style.top = `${nextTop}px`;
      clearTimeout(mascotWalkTimer);
      mascotWalkTimer = setTimeout(() => mascot.classList.remove("is-walking"), 2650);
      clearTimeout(mascotMoveTimer);
      mascotMoveTimer = setTimeout(moveMascot, 4500 + Math.random() * 4500);
    }

    function updateMascotEdgeState(left, top) {
      mascot.classList.toggle("is-near-left", left < 140);
      mascot.classList.toggle("is-near-right", left > window.innerWidth - 270);
      mascot.classList.toggle("is-near-top", top < 125);
    }

    function autoScrollWhileDragging() {
      const scrollZone = Math.min(110, window.innerHeight * 0.2);
      let scrollSpeed = 0;

      if (mascotPointerY < scrollZone) {
        scrollSpeed = -18 * (1 - mascotPointerY / scrollZone);
      } else if (mascotPointerY > window.innerHeight - scrollZone) {
        scrollSpeed = 18 * ((mascotPointerY - (window.innerHeight - scrollZone)) / scrollZone);
      }

      if (scrollSpeed !== 0) window.scrollBy(0, scrollSpeed);
      mascotScrollFrame = requestAnimationFrame(autoScrollWhileDragging);
    }

    mascot.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      clearTimeout(mascotMoveTimer);
      mascotDragStartX = event.clientX;
      mascotDragStartY = event.clientY;
      mascotPointerY = event.clientY;
      const mascotPosition = mascot.getBoundingClientRect();
      mascotDragStartLeft = mascotPosition.left;
      mascotDragStartTop = mascotPosition.top;
      mascotWasDragged = false;
      mascotSpokeDuringDrag = false;
      clearTimeout(mascotWalkTimer);
      mascot.classList.add("is-dragging", "is-walking");
      mascot.style.bottom = "auto";
      mascot.style.top = `${mascotDragStartTop}px`;
      mascot.setPointerCapture(event.pointerId);
      cancelAnimationFrame(mascotScrollFrame);
      mascotScrollFrame = requestAnimationFrame(autoScrollWhileDragging);
    });

    mascot.addEventListener("pointermove", (event) => {
      if (!mascot.hasPointerCapture(event.pointerId)) return;
      const distanceX = event.clientX - mascotDragStartX;
      const distanceY = event.clientY - mascotDragStartY;
      mascotPointerY = event.clientY;
      if (Math.hypot(distanceX, distanceY) > 4) {
        mascotWasDragged = true;
        if (!mascotSpokeDuringDrag) {
          mascotSpokeDuringDrag = true;
          makeMascotReactToDrag();
        }
      }
      const edgePadding = 12;
      const maximumLeft = window.innerWidth - mascot.offsetWidth - edgePadding;
      const maximumTop = window.innerHeight - mascot.offsetHeight - edgePadding;
      const nextLeft = Math.min(maximumLeft, Math.max(edgePadding, mascotDragStartLeft + distanceX));
      const nextTop = Math.min(maximumTop, Math.max(edgePadding, mascotDragStartTop + distanceY));
      mascot.classList.toggle("is-facing-left", distanceX < 0);
      updateMascotEdgeState(nextLeft, nextTop);
      mascot.style.left = `${nextLeft}px`;
      mascot.style.top = `${nextTop}px`;
    });

    function finishMascotDrag(event) {
      if (!mascot.hasPointerCapture(event.pointerId)) return;
      mascot.releasePointerCapture(event.pointerId);
      cancelAnimationFrame(mascotScrollFrame);
      mascot.classList.remove("is-dragging", "is-walking");
      clearTimeout(mascotMoveTimer);
      mascotMoveTimer = setTimeout(moveMascot, 3500);
    }

    mascot.addEventListener("pointerup", finishMascotDrag);
    mascot.addEventListener("pointercancel", finishMascotDrag);
    mascot.addEventListener("click", (event) => {
      if (mascotWasDragged) {
        event.preventDefault();
        mascotWasDragged = false;
        return;
      }
      makeMascotTalk();
    });
    window.addEventListener("resize", moveMascot);
    document.addEventListener("visibilitychange", () => {
      clearTimeout(mascotMoveTimer);
      if (!document.hidden) moveMascot();
    });
    if (!mascot.hidden) setTimeout(moveMascot, 1600);


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

  gmailWindow.opener = null;

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
