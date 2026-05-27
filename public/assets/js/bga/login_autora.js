(function () {
    let canvas = null;
    let ctx = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let destroyed = false;

    let glows = [];
    let particles = [];
    let bubbles = [];
    let streaks = [];
    let sparks = [];

    const GLOW_COUNT = 5;
    const PARTICLE_COUNT = 70;
    const BUBBLE_COUNT = 18;
    const STREAK_COUNT = 6;
    const SPARK_COUNT = 55;

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function resize() {
        if (!canvas || !ctx) return;

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createScene();
    }

    function createScene() {
        createGlows();
        createParticles();
        createBubbles();
        createStreaks();
        createSparks();
    }

    function createGlows() {
        const colors = [
            "rgba(69,120,255,0.26)",
            "rgba(146,88,255,0.22)",
            "rgba(45,220,255,0.16)",
            "rgba(255,190,84,0.18)",
            "rgba(255,92,184,0.12)"
        ];

        glows = [];

        for (let i = 0; i < GLOW_COUNT; i++) {
            glows.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(280, 680),
                dx: rand(-0.35, 0.35),
                dy: rand(-0.18, 0.18),
                color: colors[i % colors.length]
            });
        }
    }

    function createParticles() {
        particles = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(1.4, 4.8),
                dx: rand(-0.25, 0.25),
                dy: rand(-1.3, -0.35),
                alpha: rand(0.12, 0.5),
                pulse: rand(0, Math.PI * 2)
            });
        }
    }

    function createBubbles() {
        bubbles = [];

        for (let i = 0; i < BUBBLE_COUNT; i++) {
            bubbles.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(22, 72),
                dx: rand(-0.22, 0.22),
                dy: rand(-0.38, -0.12),
                alpha: rand(0.025, 0.08),
                hue: rand(190, 285)
            });
        }
    }

    function createStreaks() {
        streaks = [];

        for (let i = 0; i < STREAK_COUNT; i++) {
            streaks.push({
                x: rand(-width, width),
                y: rand(60, height * 0.78),
                len: rand(260, 620),
                speed: rand(1.2, 3.6),
                alpha: rand(0.045, 0.12)
            });
        }
    }

    function createSparks() {
        sparks = [];

        for (let i = 0; i < SPARK_COUNT; i++) {
            sparks.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(0.6, 2.2),
                alpha: rand(0.15, 0.8),
                speed: rand(0.015, 0.055),
                phase: rand(0, Math.PI * 2)
            });
        }
    }

    function drawBase() {
        const bg = ctx.createLinearGradient(0, 0, width, height);

        bg.addColorStop(0, "#11194f");
        bg.addColorStop(0.32, "#2b2762");
        bg.addColorStop(0.63, "#0f2a64");
        bg.addColorStop(1, "#120a2f");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
    }

    function drawGlows() {
        for (const g of glows) {
            g.x += g.dx;
            g.y += g.dy;

            if (g.x < -300) g.x = width + 300;
            if (g.x > width + 300) g.x = -300;
            if (g.y < -300) g.y = height + 300;
            if (g.y > height + 300) g.y = -300;

            const radial = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
            radial.addColorStop(0, g.color);
            radial.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = radial;
            ctx.fillRect(0, 0, width, height);
        }
    }

    function drawBubbles() {
        ctx.save();

        for (const b of bubbles) {
            b.x += b.dx;
            b.y += b.dy;

            if (b.y < -100) {
                b.y = height + 100;
                b.x = rand(0, width);
            }

            if (b.x < -100) b.x = width + 100;
            if (b.x > width + 100) b.x = -100;

            ctx.beginPath();
            ctx.strokeStyle = `hsla(${b.hue}, 90%, 75%, ${b.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.stroke();

            const fill = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            fill.addColorStop(0, `hsla(${b.hue}, 90%, 75%, ${b.alpha * 0.7})`);
            fill.addColorStop(1, "rgba(255,255,255,0)");

            ctx.fillStyle = fill;
            ctx.fill();
        }

        ctx.restore();
    }

    function drawParticles() {
        ctx.save();

        for (const p of particles) {
            p.x += p.dx;
            p.y += p.dy;
            p.pulse += 0.035;

            if (p.y < -20) {
                p.y = height + 20;
                p.x = rand(0, width);
            }

            const a = Math.max(0.05, p.alpha + Math.sin(p.pulse) * 0.16);

            ctx.beginPath();
            ctx.shadowBlur = 18;
            ctx.shadowColor = "rgba(255,215,130,0.6)";
            ctx.fillStyle = `rgba(255,215,130,${a})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function drawStreaks() {
        for (const s of streaks) {
            s.x += s.speed;

            if (s.x > width + 700) {
                s.x = -700;
                s.y = rand(60, height * 0.78);
            }

            const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y + 35);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(0.5, `rgba(255,235,180,${s.alpha})`);
            grad.addColorStop(1, "rgba(255,255,255,0)");

            ctx.fillStyle = grad;
            ctx.fillRect(s.x, s.y, s.len, 42);
        }
    }

    function drawSparks(time) {
        for (const sp of sparks) {
            const a = Math.max(0.05, sp.alpha + Math.sin(time * sp.speed + sp.phase) * 0.35);

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,245,210,${a})`;
            ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate(time) {
        if (destroyed) return;

        drawBase();
        drawGlows();
        drawBubbles();
        drawStreaks();
        drawSparks(time);
        drawParticles();

        rafId = requestAnimationFrame(animate);
    }

    function init(targetCanvas) {
        destroy();

        canvas = targetCanvas;
        if (!canvas) return;

        ctx = canvas.getContext("2d");
        if (!ctx) return;

        destroyed = false;

        resize();

        window.addEventListener("resize", resize, { passive: true });

        rafId = requestAnimationFrame(animate);
    }

    function destroy() {
        destroyed = true;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        window.removeEventListener("resize", resize);

        glows = [];
        particles = [];
        bubbles = [];
        streaks = [];
        sparks = [];
    }

    window.LoginTheme = {
        name: "login_aurora",
        init,
        destroy
    };
})();