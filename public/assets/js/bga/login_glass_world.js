(function () {
    let canvas = null;
    let ctx = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let destroyed = false;

    let blobs = [];
    let bubbles = [];
    let sparks = [];
    let streaks = [];

    const BLOB_COUNT = 7;
    const BUBBLE_COUNT = 26;
    const SPARK_COUNT = 80;
    const STREAK_COUNT = 5;

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
        createBlobs();
        createBubbles();
        createSparks();
        createStreaks();
    }

    function createBlobs() {
        const colors = [
            "rgba(80, 145, 255, 0.28)",
            "rgba(145, 95, 255, 0.24)",
            "rgba(255, 190, 95, 0.18)",
            "rgba(55, 220, 255, 0.18)",
            "rgba(255, 95, 175, 0.15)"
        ];

        blobs = [];

        for (let i = 0; i < BLOB_COUNT; i++) {
            blobs.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(180, 520),
                dx: rand(-0.35, 0.35),
                dy: rand(-0.22, 0.22),
                color: colors[i % colors.length],
                phase: rand(0, Math.PI * 2),
                pulse: rand(0.0008, 0.0018)
            });
        }
    }

    function createBubbles() {
        bubbles = [];

        for (let i = 0; i < BUBBLE_COUNT; i++) {
            bubbles.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(20, 90),
                dx: rand(-0.22, 0.22),
                dy: rand(-0.55, -0.15),
                alpha: rand(0.035, 0.11),
                hue: rand(185, 292),
                lineAlpha: rand(0.06, 0.16)
            });
        }
    }

    function createSparks() {
        sparks = [];

        for (let i = 0; i < SPARK_COUNT; i++) {
            sparks.push({
                x: rand(0, width),
                y: rand(0, height),
                r: rand(0.7, 2.5),
                alpha: rand(0.18, 0.85),
                speed: rand(0.015, 0.06),
                phase: rand(0, Math.PI * 2),
                drift: rand(-0.12, 0.12)
            });
        }
    }

    function createStreaks() {
        streaks = [];

        for (let i = 0; i < STREAK_COUNT; i++) {
            streaks.push({
                x: rand(-width, width),
                y: rand(80, height * 0.82),
                len: rand(240, 680),
                speed: rand(1.0, 3.2),
                alpha: rand(0.04, 0.12)
            });
        }
    }

    function drawBase() {
        const bg = ctx.createLinearGradient(0, 0, width, height);

        bg.addColorStop(0, "#06123e");
        bg.addColorStop(0.28, "#14256d");
        bg.addColorStop(0.55, "#211755");
        bg.addColorStop(0.78, "#09284e");
        bg.addColorStop(1, "#08091f");

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
    }

    function drawBlobs(time) {
        for (const b of blobs) {
            b.x += b.dx;
            b.y += b.dy;

            if (b.x < -b.r) b.x = width + b.r;
            if (b.x > width + b.r) b.x = -b.r;
            if (b.y < -b.r) b.y = height + b.r;
            if (b.y > height + b.r) b.y = -b.r;

            const radius = b.r + Math.sin(time * b.pulse + b.phase) * 45;

            const glow = ctx.createRadialGradient(
                b.x,
                b.y,
                0,
                b.x,
                b.y,
                radius
            );

            glow.addColorStop(0, b.color);
            glow.addColorStop(0.45, b.color.replace("0.", "0."));
            glow.addColorStop(1, "rgba(0,0,0,0)");

            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
        }
    }

    function drawBubbles() {
        ctx.save();

        for (const b of bubbles) {
            b.x += b.dx;
            b.y += b.dy;

            if (b.y < -120) {
                b.y = height + 120;
                b.x = rand(0, width);
            }

            if (b.x < -120) b.x = width + 120;
            if (b.x > width + 120) b.x = -120;

            const fill = ctx.createRadialGradient(
                b.x - b.r * 0.25,
                b.y - b.r * 0.25,
                0,
                b.x,
                b.y,
                b.r
            );

            fill.addColorStop(0, `hsla(${b.hue}, 95%, 85%, ${b.alpha})`);
            fill.addColorStop(0.55, `hsla(${b.hue}, 95%, 75%, ${b.alpha * 0.45})`);
            fill.addColorStop(1, "rgba(255,255,255,0)");

            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `hsla(${b.hue}, 95%, 88%, ${b.lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawSparks(time) {
        ctx.save();

        for (const s of sparks) {
            s.y -= 0.15;
            s.x += s.drift;

            if (s.y < -10) {
                s.y = height + 10;
                s.x = rand(0, width);
            }

            const alpha = Math.max(
                0.05,
                s.alpha + Math.sin(time * s.speed + s.phase) * 0.35
            );

            ctx.beginPath();
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(255, 232, 175, 0.7)";
            ctx.fillStyle = `rgba(255, 236, 190, ${alpha})`;
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function drawStreaks() {
        for (const st of streaks) {
            st.x += st.speed;

            if (st.x > width + 800) {
                st.x = -800;
                st.y = rand(80, height * 0.82);
            }

            const grad = ctx.createLinearGradient(
                st.x,
                st.y,
                st.x + st.len,
                st.y + 42
            );

            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(0.5, `rgba(255,235,180,${st.alpha})`);
            grad.addColorStop(1, "rgba(255,255,255,0)");

            ctx.fillStyle = grad;
            ctx.fillRect(st.x, st.y, st.len, 44);
        }
    }

    function drawVignette() {
        const v = ctx.createRadialGradient(
            width * 0.5,
            height * 0.5,
            Math.min(width, height) * 0.2,
            width * 0.5,
            height * 0.5,
            Math.max(width, height) * 0.75
        );

        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(0,0,0,0.28)");

        ctx.fillStyle = v;
        ctx.fillRect(0, 0, width, height);
    }

    function animate(time) {
        if (destroyed) return;

        drawBase();
        drawBlobs(time);
        drawBubbles();
        drawStreaks();
        drawSparks(time);
        drawVignette();

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

        blobs = [];
        bubbles = [];
        sparks = [];
        streaks = [];
    }

    window.LoginTheme = {
        name: "login_glass_world",
        init,
        destroy
    };
})();