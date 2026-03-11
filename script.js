document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');

    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.opacity = '1';
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            });
        });

        // Hide glow when leaving window
        document.addEventListener('mouseout', () => {
            cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseover', () => {
            cursorGlow.style.opacity = '1';
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileToggle.querySelector('i').classList.remove('fa-times');
                mobileToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Link Highlight on Scroll
    const sections = document.querySelectorAll('section');
    const navConfig = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navConfig);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Button Ripple Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });

    // Enhanced Reveal Animation on Scroll
    const revealElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .hero-content, .section-title');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Optional: Stop observing once revealed
                // revealObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1)';
        revealObserver.observe(el);
    });

    // --- AI Orb Animation Integration ---
    initAIOrb();
});

function initAIOrb() {
    const canvas = document.getElementById('aiOrb');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // 3D Engine Constants
    const focalLength = 800;
    const sphereRadius = 260;
    const numDots = 1800;

    // Arrays to hold particle data
    let particles = [];
    const goldenRatio = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numDots; i++) {
        let y = 1 - (i / (numDots - 1)) * 2;
        let radiusAtY = Math.sqrt(1 - y * y);
        let theta = goldenRatio * i;

        let x = Math.cos(theta) * radiusAtY;
        let z = Math.sin(theta) * radiusAtY;

        let lat = Math.asin(y);
        let lon = Math.atan2(z, x);

        particles.push({
            lat: lat,
            lon: lon,
            orbitSpeed: (0.002 + Math.random() * 0.003) * (y > 0 ? 1 : -1),
            baseSize: 1 + Math.random() * 1.5
        });
    }

    let time = 0;

    function animate() {
        time += 0.01;

        // Clear canvas with a very slight fade
        ctx.fillStyle = 'rgba(10, 10, 15, 1)'; // Match body background
        ctx.fillRect(0, 0, width, height);

        let renderedPoints = [];

        let mainRotX = time * 0.5;
        let mainRotZ = Math.sin(time * 0.3) * 0.2;

        let cosX = Math.cos(mainRotX);
        let sinX = Math.sin(mainRotX);
        let cosZ = Math.cos(mainRotZ);
        let sinZ = Math.sin(mainRotZ);

        for (let i = 0; i < numDots; i++) {
            let p = particles[i];
            p.lon += p.orbitSpeed;

            let rCosLat = sphereRadius * Math.cos(p.lat);
            let ox = rCosLat * Math.cos(p.lon);
            let oy = sphereRadius * Math.sin(p.lat);
            let oz = rCosLat * Math.sin(p.lon);

            let y1 = oy * cosX - oz * sinX;
            let z1 = oz * cosX + oy * sinX;
            let x1 = ox;

            let x2 = x1 * cosZ - y1 * sinZ;
            let y2 = y1 * cosZ + x1 * sinZ;
            let z2 = z1;

            let wave1 = Math.sin(x2 * 0.015 + time * 4);
            let wave2 = Math.cos(y2 * 0.02 - time * 3);
            let wave3 = Math.sin(z2 * 0.01 + time * 5);

            let rawPulse = (wave1 + wave2 + wave3) / 3;
            let energy = Math.pow((rawPulse + 1) / 2, 4);

            renderedPoints.push({
                x: x2,
                y: y2,
                z: z2,
                energy: energy,
                baseSize: p.baseSize
            });
        }

        renderedPoints.sort((a, b) => b.z - a.z);

        for (let i = 0; i < numDots; i++) {
            let pt = renderedPoints[i];
            let scale = focalLength / (focalLength + pt.z + 200);
            if (scale < 0) continue;

            let screenX = cx + pt.x * scale;
            let screenY = cy + pt.y * scale;

            let zFade = (pt.z + sphereRadius) / (sphereRadius * 2);
            zFade = Math.max(0, Math.min(1, zFade));

            let baseAlpha = 0.8 - zFade * 0.7;

            let r = Math.floor(0 + pt.energy * 200);
            let g = Math.floor(100 + pt.energy * 155);
            let b = Math.floor(200 + pt.energy * 55);

            let alpha = Math.min(1, baseAlpha + pt.energy * 0.8);
            let radius = (pt.baseSize + pt.energy * 3) * scale;

            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            if (pt.energy > 0.6 && zFade < 0.5) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(0, 255, 255, ${pt.energy})`;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}
