/* 
   Sumiksha Solanki Portfolio Redesign
   Interactive Javascript Logic
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Particle Canvas Background
    initParticles();

    // 2. Typing Effect Configuration
    initTyping();

    // 3. Count Up Stats Animation
    initCountUp();

    // 4. Project Category Filtering
    initProjectFilter();

    // 5. Services Category Filtering
    initServiceFilter();

    // 6. Scroll Reveal Observer
    initScrollReveal();

    // 7. Navbar & Back to Top Toggle
    initScrollEffects();

    // 8. Mobile Menu Toggle
    initMobileMenu();

    // 9. Contact Form Simulation
    initContactForm();
});

// Canvas Particles Network
function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust canvas size on resize
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Mouse Interaction
    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener("mousemove", (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Bounce on borders
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interact (repel effect)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        // Calculate dynamic amount of particles based on screen size
        let numberOfParticles = (width * height) / 14000;
        numberOfParticles = Math.min(numberOfParticles, 85); // Cap to preserve performance

        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 2 + 1;
            let x = Math.random() * (width - size * 2) + size;
            let y = Math.random() * (height - size * 2) + size;
            let directionX = (Math.random() - 0.5) * 0.4;
            let directionY = (Math.random() - 0.5) * 0.4;
            
            // Alternating colors
            let color = i % 2 === 0 ? "rgba(96, 165, 250, 0.25)" : "rgba(192, 132, 252, 0.25)";

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - distance / 110;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    init();
    animate();
}

// Typing Effect
function initTyping() {
    const roles = [
        "Creative Web Developer",
        "Frontend Developer",
        "Data Analyst",
        "Freelance Website Designer"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typingContainer = document.getElementById("typing");
    if (!typingContainer) return;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (!deleting) {
            typingContainer.textContent = currentRole.substring(0, charIndex++);
        } else {
            typingContainer.textContent = currentRole.substring(0, charIndex--);
        }
        
        if (!deleting && charIndex === currentRole.length + 1) {
            deleting = true;
            setTimeout(typeEffect, 1800); // Hold role
            return;
        }
        
        if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        
        setTimeout(typeEffect, deleting ? 30 : 60);
    }
    
    setTimeout(typeEffect, 500);
}

// Stats Count Up Animation
function initCountUp() {
    const stats = document.querySelectorAll(".stat-num");
    if (stats.length === 0) return;

    const countUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const limit = parseInt(target.getAttribute("data-target"));
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = Math.ceil(limit / (duration / 16)); // ~60fps

                const counterInterval = setInterval(() => {
                    count += increment;
                    if (count >= limit) {
                        target.textContent = limit + "+";
                        clearInterval(counterInterval);
                    } else {
                        target.textContent = count + "+";
                    }
                }, 16);

                observer.unobserve(target); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => countUpObserver.observe(stat));
}

// Project filter
function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card-container");
    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Toggle active state
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

// Services Category Filtering
function initServiceFilter() {
    const filterButtons = document.querySelectorAll(".s-filter-btn");
    const serviceCards = document.querySelectorAll(".service-card-container");
    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Toggle active state
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            serviceCards.forEach(card => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

// Scroll Reveal Observer
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Navbar Scroll Scrolled Style & Back to Top Toggle
function initScrollEffects() {
    const header = document.getElementById("header");
    const backToTopBtn = document.getElementById("back-to-top");
    const navItems = document.querySelectorAll(".nav-link-item");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        // Sticky Header class toggling
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }

        // Scrollspy highlight navigation links
        let scrollPosition = window.scrollY + 160;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove("active");
                    if (item.getAttribute("href") === `#${sectionId}`) {
                        item.classList.add("active");
                    }
                });
            }
        });
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// Mobile Navbar Drawer Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const navMenu = document.getElementById("nav-menu");
    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        const icon = menuBtn.querySelector("i");
        if (navMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars-staggered");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars-staggered");
        }
    });

    // Close on click link
    const navLinks = document.querySelectorAll(".nav-link-item, .btn-nav");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars-staggered");
            }
        });
    });
}

// Contact Form Simulation
function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Dynamic loading submit simulation
        const submitBtn = form.querySelector(".btn-submit");
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        
        setTimeout(() => {
            submitBtn.innerHTML = `Success! <i class="fa-solid fa-circle-check"></i>`;
            submitBtn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
            submitBtn.style.boxShadow = "0 4px 15px rgba(16, 185, 129, 0.4)";
            
            alert("Thank you! Your message was submitted successfully (demonstration only). Please email directly at sumikshasolnki@gmail.com for freelance inquiries!");
            
            form.reset();
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = "";
                submitBtn.style.boxShadow = "";
            }, 3000);
        }, 1800);
    });
}

// Clipboard copying utility
function copyToClipboard(text, tooltipId) {
    navigator.clipboard.writeText(text).then(() => {
        const container = document.getElementById(tooltipId);
        if (container) {
            container.classList.add("copied");
            setTimeout(() => {
                container.classList.remove("copied");
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
