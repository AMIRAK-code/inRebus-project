/* ============================================================
   ANIMATIONS.JS — GSAP + Particle Canvas + Custom Cursor
   ============================================================ */

// ─── 1. PARTICLE CANVAS BACKGROUND ──────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(true); }
        reset(init = false) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.flicker = Math.random() * 0.01 + 0.003;
            this.phase = Math.random() * Math.PI * 2;
            this.color = Math.random() > 0.7
                ? `rgba(249, 115, 22, ${this.opacity})`
                : `rgba(255, 255, 255, ${this.opacity * 0.3})`;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.phase += this.flicker;
            const currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.phase));
            if (this.y < -10) this.reset();
            return currentOpacity;
        }
        draw(op) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const isOrange = this.color.includes('249');
            ctx.fillStyle = isOrange
                ? `rgba(249, 115, 22, ${op})`
                : `rgba(255, 255, 255, ${op * 0.3})`;
            ctx.fill();
        }
    }

    const COUNT = 90;
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw connection lines between nearby orange particles
        const orangePs = particles.filter((p, i) => i % 3 === 0);
        for (let i = 0; i < orangePs.length; i++) {
            for (let j = i + 1; j < orangePs.length; j++) {
                const a = orangePs[i], b = orangePs[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(249, 115, 22, ${0.04 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            const op = p.update();
            p.draw(op);
        });

        animId = requestAnimationFrame(draw);
    }

    draw();
})();


// ─── 2. CUSTOM CURSOR ────────────────────────────────────────
(function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.05, ease: 'none' });
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        gsap.set(follower, { x: followerX, y: followerY });
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('button, a, input, .role-chip, .rec-card, .nav-btn, .user-pill');
        if (el) {
            gsap.to(cursor, { scale: 2.5, background: 'transparent', border: '1px solid var(--primary)', duration: 0.2 });
            gsap.to(follower, { scale: 1.8, opacity: 0.3, duration: 0.3 });
        }
    });

    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest('button, a, input, .role-chip, .rec-card, .nav-btn, .user-pill');
        if (el) {
            gsap.to(cursor, { scale: 1, background: 'var(--primary)', border: 'none', duration: 0.2 });
            gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
        }
    });
})();


// ─── 3. ANIMATION HELPERS ────────────────────────────────────
const Animations = {

    /* Entrance for Role Selection page */
    roleSelectionEntrance() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero-badge',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo('.hero-title',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7 },
            '-=0.3'
        )
        .fromTo('.hero-subtitle',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.4'
        )
        .fromTo('#search-form',
            { opacity: 0, y: 20, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6 },
            '-=0.3'
        )
        .fromTo('#popular-roles',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.2'
        )
        .fromTo('.role-chip',
            { opacity: 0, y: 10, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.07 },
            '-=0.3'
        )
        .fromTo('#features-row',
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            '-=0.1'
        );
    },

    /* Magnetic button effect */
    magneticButton(btn) {
        if (!btn) return;
        const strength = 0.3;
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    },

    /* Dashboard entrance */
    dashboardEntrance() {
        gsap.fromTo('#hero-card',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
        );
        gsap.fromTo('#skills-card',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
        );
        gsap.fromTo('#gaps-card',
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
        );
        gsap.fromTo('.skill-tag',
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, delay: 0.45, ease: 'back.out(1.4)' }
        );
        gsap.fromTo('.rec-card',
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.5, ease: 'power3.out' }
        );

        // Animate circular progress
        this.animateProgress(STATE.matchPercentage);
    },

    animateProgress(percentage) {
        const fill = document.getElementById('progress-fill');
        const numEl = document.getElementById('progress-number');
        if (!fill || !numEl) return;

        const r = 44;
        const circum = 2 * Math.PI * r;
        const offset = circum * (1 - percentage / 100);

        gsap.fromTo(fill,
            { strokeDashoffset: circum },
            { strokeDashoffset: offset, duration: 1.5, ease: 'power2.out', delay: 0.4 }
        );

        const obj = { val: 0 };
        gsap.to(obj, {
            val: percentage,
            duration: 1.5,
            delay: 0.4,
            ease: 'power2.out',
            onUpdate() {
                numEl.textContent = Math.round(obj.val) + '%';
            }
        });
    },

    /* Loading step animation */
    animateLoadingSteps() {
        const steps = ['step-1', 'step-2', 'step-3'];
        steps.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (!el) return;
                el.classList.add('active');
                if (i > 0) {
                    const prev = document.getElementById(steps[i - 1]);
                    if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
                }
            }, i * 700);
        });
    },

    /* Sidebar nav animation */
    sidebarEntrance() {
        gsap.fromTo('.sidebar',
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
        );
        gsap.fromTo('.nav-btn',
            { x: -15, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo('.top-header',
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' }
        );
    }
};
