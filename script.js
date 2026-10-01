/* =========================================================
   SUMIKSHA SOLANKI — NEO-CYBER PORTFOLIO JAVASCRIPT
   Particles • Typing Loop • Fullscreen Modal • Copy Utilities
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. BACKGROUND CANVAS PARTICLES 
    ========================================================= */
    const canvas = document.getElementById("starfieldCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        class StarParticle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(124, 92, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const count = Math.min(75, Math.floor(window.innerWidth / 18));
        for (let i = 0; i < count; i++) {
            particles.push(new StarParticle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const opacity = (1 - dist / 120) * 0.12;
                        ctx.strokeStyle = `rgba(124, 92, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawLines();
            animId = requestAnimationFrame(loop);
        }
        loop();
    }


    /* =========================================================
       2. MOUSE SPOTLIGHT GLOW
    ========================================================= */
    const mouseGlow = document.getElementById("mouseGlow");
    if (mouseGlow && window.innerWidth > 768) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let posX = mouseX;
        let posY = mouseY;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            posX += (mouseX - posX) * 0.08;
            posY += (mouseY - posY) * 0.08;
            mouseGlow.style.left = `${posX}px`;
            mouseGlow.style.top = `${posY}px`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }


    /* =========================================================
       3. MOBILE NAVIGATION MENU
    ========================================================= */
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navBar = document.getElementById("navBar");

    if (mobileMenuBtn && navBar) {
        mobileMenuBtn.addEventListener("click", () => {
            navBar.classList.toggle("open");
            const icon = mobileMenuBtn.querySelector("i");
            if (navBar.classList.contains("open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        document.querySelectorAll(".nav-btn").forEach(item => {
            item.addEventListener("click", () => {
                navBar.classList.remove("open");
                if (mobileMenuBtn) {
                    const icon = mobileMenuBtn.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-bars";
                }
            });
        });
    }


    /* =========================================================
       4. DYNAMIC TYPING ANIMATION
    ========================================================= */
    const typingRole = document.getElementById("typingRole");
    if (typingRole) {
        const roles = [
            "Data Analytics Dashboards",
            "Responsive Modern Web Apps",
            "SQL & Python Data Pipelines",
            "Business Intelligence Solutions",
            "Freelance Digital Consulting"
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let speed = 80;

        function runTypeLoop() {
            const current = roles[roleIdx];

            if (isDeleting) {
                typingRole.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                speed = 40;
            } else {
                typingRole.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                speed = 90;
            }

            if (!isDeleting && charIdx === current.length) {
                speed = 1800; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                speed = 350;
            }

            setTimeout(runTypeLoop, speed);
        }
        runTypeLoop();
    }


    /* =========================================================
       5. METRICS STATS COUNTER OBSERVER
    ========================================================= */
    const counters = document.querySelectorAll(".stat-count");
    let hasCounted = false;

    function startCounters() {
        counters.forEach(c => {
            const target = parseInt(c.getAttribute("data-target"), 10);
            if (isNaN(target)) return;

            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    c.textContent = target;
                    clearInterval(interval);
                } else {
                    c.textContent = current;
                }
            }, 30);
        });
    }

    const aboutSec = document.getElementById("about");
    if (aboutSec && "IntersectionObserver" in window) {
        const statsObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    startCounters();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        statsObs.observe(aboutSec);
    }


    /* =========================================================
       6. ACTIVE NAV ON SCROLL & STICKY HEADER
    ========================================================= */
    const siteHeader = document.getElementById("siteHeader");
    const sections = document.querySelectorAll("section[id]");
    const navButtons = document.querySelectorAll(".nav-btn");
    const scrollTopBtn = document.getElementById("scrollTopBtn");

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;

        if (siteHeader) {
            if (scrollY > 60) {
                siteHeader.style.borderBottomColor = "var(--border-subtle)";
            } else {
                siteHeader.style.borderBottomColor = "transparent";
            }
        }

        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            const secId = sec.getAttribute("id");

            if (scrollY >= secTop && scrollY < secTop + secHeight) {
                navButtons.forEach(btn => {
                    btn.classList.remove("active");
                    if (btn.getAttribute("href") === `#${secId}`) {
                        btn.classList.add("active");
                    }
                });
            }
        });

        if (scrollTopBtn) {
            if (scrollY > 400) {
                scrollTopBtn.classList.add("visible");
            } else {
                scrollTopBtn.classList.remove("visible");
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =========================================================
       7. THEME SWITCHER (DARK / LIGHT)
    ========================================================= */
    const themeSwitcher = document.getElementById("themeSwitcher");
    const savedTheme = localStorage.getItem("neo_portfolio_theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        if (themeSwitcher) themeSwitcher.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeSwitcher) {
        themeSwitcher.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            localStorage.setItem("neo_portfolio_theme", isLight ? "light" : "dark");
            themeSwitcher.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }


    /* =========================================================
       8. GALLERY FILTER TABS
    ========================================================= */
    const filterTabs = document.querySelectorAll(".filter-tab");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filterVal = tab.getAttribute("data-filter");

            galleryItems.forEach(item => {
                const cat = item.getAttribute("data-category");
                if (filterVal === "all" || cat === filterVal) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });


    /* =========================================================
       9. LIGHTBOX MODAL FOR PREVIEWS
    ========================================================= */
    const lightbox = document.getElementById("lightbox");
    const lightboxMedia = document.getElementById("lightboxMedia");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxOverlay = document.getElementById("lightboxOverlay");

    function openModal(src, type, title) {
        if (!lightbox || !lightboxMedia) return;

        lightboxMedia.innerHTML = "";
        if (type === "video") {
            const vid = document.createElement("video");
            vid.src = src;
            vid.controls = true;
            vid.autoplay = true;
            vid.style.maxWidth = "100%";
            lightboxMedia.appendChild(vid);
        } else {
            const img = document.createElement("img");
            img.src = src;
            img.alt = title || "Visual Preview";
            lightboxMedia.appendChild(img);
        }

        if (lightboxCaption) lightboxCaption.textContent = title || "";

        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!lightbox) return;
        lightbox.classList.remove("active");
        if (lightboxMedia) lightboxMedia.innerHTML = "";
        document.body.style.overflow = "";
    }

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const src = item.getAttribute("data-src");
            const type = item.getAttribute("data-type") || "image";
            const title = item.getAttribute("data-title") || "";
            if (src) openModal(src, type, title);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeModal);
    if (lightboxOverlay) lightboxOverlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox && lightbox.classList.contains("active")) {
            closeModal();
        }
    });


    /* =========================================================
       10. CLIPBOARD COPY UTILITY WITH TOAST NOTIFICATION
    ========================================================= */
    const toastBox = document.getElementById("toastBox");

    function showToast(text) {
        if (!toastBox) return;
        const toast = document.createElement("div");
        toast.className = "toast-alert";
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> <span>${text}</span>`;
        toastBox.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => toast.remove(), 300);
        }, 2600);
    }

    const copyButtons = document.querySelectorAll(".copy-trigger");
    copyButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const val = btn.getAttribute("data-copy");
            if (val) {
                navigator.clipboard.writeText(val).then(() => {
                    showToast(`Copied to clipboard: ${val}`);
                }).catch(() => {
                    showToast(`Copied: ${val}`);
                });
            }
        });
    });


    /* =========================================================
       11. HORIZONTAL SLIDERS CONTROLLER (Certificates & Gallery)
    ========================================================= */
    function initSlider(trackId, prevBtnId, nextBtnId, step = 330) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!track) return;

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                track.scrollBy({ left: -step, behavior: "smooth" });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                track.scrollBy({ left: step, behavior: "smooth" });
            });
        }

        // Mouse Drag to Scroll for desktop comfort
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener("mousedown", (e) => {
            isDown = true;
            track.style.cursor = "grabbing";
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener("mouseleave", () => {
            isDown = false;
            track.style.cursor = "default";
        });

        track.addEventListener("mouseup", () => {
            isDown = false;
            track.style.cursor = "default";
        });

        track.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        });
    }

    initSlider("certSliderTrack", "certPrev", "certNext", 330);
    initSlider("gallerySliderTrack", "galleryPrev", "galleryNext", 340);


    /* =========================================================
       12. CURRENT YEAR AND CONTACT FORM
    ========================================================= */
    const currentYear = document.getElementById("currentYear");
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            }

            const formData = new FormData(contactForm);

            try {
                const res = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();

                if (data.success) {
                    formStatus.className = "form-status-msg success";
                    formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                    showToast("Message sent successfully!");
                } else {
                    formStatus.className = "form-status-msg error";
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${data.message || 'Error sending message.'}`;
                }
            } catch (err) {
                formStatus.className = "form-status-msg error";
                formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Network error. Please call +91 99874 36819 directly.';
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
                }
            }
        });
    }

});
