(function () {
    let canvas = null;
    let ctx = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let destroyed = false;

    let stars = [];
    let particles = [];
    let buildings = [];
    let beams = [];
    let auroras = [];

    const STAR_COUNT = 60;
    const PARTICLE_COUNT = 42;
    const BEAM_COUNT = 4;
    const AURORA_COUNT = 3;

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

        createScene();
    }

    function createScene() {
        createStars();
        createParticles();
        createBuildings();
        createBeams();
        createAuroras();
    }

    function createStars() {
        stars = [];

        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: rand(0, width),
                y: rand(0, height * 0.8),
                r: rand(0.8, 2.4),
                alpha: rand(0.2, 0.8),
                speed: rand(0.01, 0.04),
                phase: rand(0, Math.PI * 2)
            });
        }
    }

    function createParticles() {
        particles = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: rand(0, width),
                y: rand(height * 0.15, height),
                r: rand(2, 7),
                speedY: rand(0.3, 1.2),
                speedX: rand(-0.25, 0.25),
                alpha: rand(0.12, 0.4),
                pulse: rand(0, Math.PI * 2)
            });
        }
    }

    function createBeams() {
        beams = [];

        for (let i = 0; i < BEAM_COUNT; i++) {
            beams.push({
                x: rand(-200, width),
                width: rand(120, 240),
                speed: rand(0.08, 0.22),
                alpha: rand(0.03, 0.08)
            });
        }
    }

    function createAuroras() {
        auroras = [];

        for (let i = 0; i < AURORA_COUNT; i++) {
            auroras.push({
                x: rand(0, width),
                y: rand(60, height * 0.45),
                radius: rand(250, 520),
                speedX: rand(-0.15, 0.15),
                speedY: rand(-0.05, 0.05),
                color: [
                    'rgba(67,110,255,0.18)',
                    'rgba(142,82,255,0.15)',
                    'rgba(255,193,76,0.12)'
                ][i % 3]
            });
        }
    }

    function createBuildings() {
        buildings = [];

        const baseY = height * 0.74;
        let x = 0;

        while (x < width + 100) {
            const w = rand(55, 120);
            const h = rand(height * 0.18, height * 0.45);

            const building = {
                x,
                y: baseY - h,
                w,
                h,
                windows: []
            };

            const cols = Math.max(2, Math.floor(w / 18));
            const rows = Math.max(4, Math.floor(h / 24));

            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    if (Math.random() > 0.45) {
                        building.windows.push({
                            x: building.x + 8 + c * 16,
                            y: building.y + 10 + r * 20,
                            alpha: rand(0.15, 0.8),
                            speed: rand(0.015, 0.08),
                            phase: rand(0, Math.PI * 2)
                        });
                    }
                }
            }

            buildings.push(building);

            x += w + rand(6, 18);
        }
    }

    function drawBaseBackground() {
        const bg = ctx.createLinearGradient(0, 0, 0, height);

        bg.addColorStop(0, '#02071d');
        bg.addColorStop(0.35, '#0a1d5e');
        bg.addColorStop(0.7, '#081438');
        bg.addColorStop(1, '#020713');

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
    }

    function drawAuroras() {
        for (const a of auroras) {
            a.x += a.speedX;
            a.y += a.speedY;

            if (a.x < -200) a.x = width + 200;
            if (a.x > width + 200) a.x = -200;

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
        for (const star of stars) {
            const alpha =
                star.alpha +
                Math.sin(time * star.speed + star.phase) * 0.3;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,230,160,${Math.max(0.08, alpha)})`;
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawBeams() {
        for (const beam of beams) {
            beam.x += beam.speed;

            if (beam.x > width + 200) {
                beam.x = -300;
            }

            const grad = ctx.createLinearGradient(
                beam.x,
                0,
                beam.x + beam.width,
                0
            );

            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(0.5, `rgba(255,255,255,${beam.alpha})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = grad;
            ctx.fillRect(beam.x, 0, beam.width, height);
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
                Math.sin(p.pulse) * 0.12;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,210,120,${Math.max(0.08, alpha)})`;
            ctx.shadowBlur = 18;
            ctx.shadowColor = 'rgba(255,210,120,0.55)';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
    }

    function drawBuildings(time) {
        for (const b of buildings) {
            const grad = ctx.createLinearGradient(
                0,
                b.y,
                0,
                b.y + b.h
            );

            grad.addColorStop(0, 'rgba(15,26,62,0.95)');
            grad.addColorStop(1, 'rgba(2,6,18,0.98)');

            ctx.fillStyle = grad;
            ctx.fillRect(b.x, b.y, b.w, b.h);

            for (const w of b.windows) {
                const alpha =
                    w.alpha +
                    Math.sin(time * w.speed + w.phase) * 0.35;

                ctx.fillStyle = `rgba(255,210,110,${Math.max(0.04, alpha)})`;
                ctx.fillRect(w.x, w.y, 5, 8);
            }
        }
    }

    function drawGroundGlow() {
        const glow = ctx.createLinearGradient(
            0,
            height * 0.7,
            0,
            height
        );

        glow.addColorStop(0, 'rgba(60,100,255,0.05)');
        glow.addColorStop(0.5, 'rgba(140,90,255,0.08)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glow;
        ctx.fillRect(0, height * 0.7, width, height);
    }

    function animate(time) {
        if (destroyed) return;

        drawBaseBackground();
        drawAuroras();
        drawBeams();
        drawStars(time);
        drawGroundGlow();
        drawBuildings(time);
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

        stars = [];
        particles = [];
        buildings = [];
        beams = [];
        auroras = [];
    }

    window.LandingTheme = {
        name: 'skyline_luxury',
        init,
        destroy
    };
})();