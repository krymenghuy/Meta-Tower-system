(function () {
    let canvas = null;
    let ctx = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let destroyed = false;

    let particles = [];
    let stars = [];
    let streaks = [];
    let buildings = [];
    let auroras = [];

    const PARTICLE_COUNT = 55;
    const STAR_COUNT = 80;
    const STREAK_COUNT = 5;
    const AURORA_COUNT = 4;

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

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        buildScene();
    }

    function buildScene() {
        createStars();
        createParticles();
        createStreaks();
        createAuroras();
        createBuildings();
    }

    function createStars() {
        stars = [];

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: rand(0, width),
                y: rand(0, height * 0.8),
                r: rand(0.8, 2.4),
                alpha: rand(0.2, 0.8),
                speed: rand(0.01, 0.05),
                phase: rand(0, Math.PI * 2)
            });
        }
    }

    function createParticles() {
        particles = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(2, 8),
                speedY: rand(0.25, 1.4),
                speedX: rand(-0.3, 0.3),
                alpha: rand(0.12, 0.4),
                pulse: rand(0, Math.PI * 2)
            });
        }
    }

    function createStreaks() {
        streaks = [];

        for (let i = 0; i < STREAK_COUNT; i++) {
            streaks.push({
                x: rand(-400, width),
                y: rand(50, height * 0.5),
                len: rand(180, 420),
                speed: rand(2, 5),
                alpha: rand(0.04, 0.12)
            });
        }
    }

    function createAuroras() {
        auroras = [];

        const colors = [
            'rgba(62,124,255,0.22)',
            'rgba(155,92,255,0.18)',
            'rgba(255,189,74,0.15)',
            'rgba(60,220,255,0.12)'
        ];

        for (let i = 0; i < AURORA_COUNT; i++) {
            auroras.push({
                x: rand(0, width),
                y: rand(40, height * 0.45),
                radius: rand(280, 650),
                dx: rand(-0.25, 0.25),
                dy: rand(-0.08, 0.08),
                color: colors[i % colors.length]
            });
        }
    }

    function createBuildings() {
        buildings = [];

        const baseY = height * 0.78;
        let x = 0;

        while (x < width + 120) {
            const w = rand(60, 130);
            const h = rand(height * 0.15, height * 0.38);

            buildings.push({
                x,
                y: baseY - h,
                w,
                h
            });

            x += w + rand(10, 20);
        }
    }

    function drawBackground() {
        const bg = ctx.createLinearGradient(0, 0, 0, height);

        bg.addColorStop(0, '#020719');
        bg.addColorStop(0.25, '#081b55');
        bg.addColorStop(0.6, '#08183d');
        bg.addColorStop(1, '#020712');

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
    }

    function drawAuroras() {
        for (const a of auroras) {
            a.x += a.dx;
            a.y += a.dy;

            if (a.x < -300) a.x = width + 300;
            if (a.x > width + 300) a.x = -300;

            const glow = ctx.createRadialGradient(
                a.x,
                a.y,
                0,
                a.x,
                a.y,
                a.radius
            );

            glow.addColorStop(0, a.color);
            glow.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
        }
    }

    function drawStars(time) {
        for (const s of stars) {
            const alpha =
                s.alpha +
                Math.sin(time * s.speed + s.phase) * 0.3;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,230,170,${Math.max(0.08, alpha)})`;
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawParticles() {
        for (const p of particles) {
            p.y -= p.speedY;
            p.x += p.speedX;
            p.pulse += 0.03;

            if (p.y < -20) {
                p.y = height + 20;
                p.x = rand(0, width);
            }

            const alpha =
                p.alpha +
                Math.sin(p.pulse) * 0.15;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,210,120,${Math.max(0.08, alpha)})`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255,210,120,0.5)';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
    }

    function drawStreaks() {
        for (const st of streaks) {
            st.x += st.speed;

            if (st.x > width + 500) {
                st.x = -500;
            }

            const grad = ctx.createLinearGradient(
                st.x,
                st.y,
                st.x + st.len,
                st.y + 40
            );

            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(0.5, `rgba(255,255,255,${st.alpha})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = grad;
            ctx.fillRect(st.x, st.y, st.len, 40);
        }
    }

    function drawBuildings() {
        ctx.save();
        ctx.globalAlpha = 0.35;

        for (const b of buildings) {
            const grad = ctx.createLinearGradient(
                0,
                b.y,
                0,
                b.y + b.h
            );

            grad.addColorStop(0, 'rgba(15,25,55,0.9)');
            grad.addColorStop(1, 'rgba(2,5,15,0.95)');

            ctx.fillStyle = grad;
            ctx.fillRect(b.x, b.y, b.w, b.h);
        }

        ctx.restore();
    }

    function animate(time) {
        if (destroyed) return;

        drawBackground();
        drawAuroras();
        drawStars(time);
        drawStreaks();
        drawBuildings();
        drawParticles();

        rafId = requestAnimationFrame(animate);
    }

    function init(targetCanvas) {
        destroy();

        canvas = targetCanvas;
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        if (!ctx) return;

        destroyed = false;

        resize();

        window.addEventListener('resize', resize, { passive: true });

        rafId = requestAnimationFrame(animate);
    }

    function destroy() {
        destroyed = true;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }

        window.removeEventListener('resize', resize);

        particles = [];
        stars = [];
        streaks = [];
        buildings = [];
        auroras = [];
    }

    window.LandingTheme = {
        name: 'aurora_luxury',
        init,
        destroy
    };
})();