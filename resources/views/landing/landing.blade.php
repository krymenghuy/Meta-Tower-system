<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    />

    <meta
        http-equiv="X-UA-Compatible"
        content="IE=edge"
    />

    <title>Meta Tower Portal</title>

    <link
        rel="icon"
        type="image/png"
        href="{{ asset('assets/images/logo/logo.png') }}"
    />

    <?php StyleManager::render('landing-styles', 1); ?>
</head>

<body id="body">

    {{-- Animated background canvas --}}
    <canvas id="landing-bg"></canvas>

    <main class="landing-shell">

        <section class="landing-panel">

            {{-- Brand --}}
            <div class="landing-brand">
                <img
                    src="{{ asset('assets/images/logo/houexpress1.png') }}"
                    alt="Meta Tower"
                />
            </div>

            {{-- App launcher --}}
            <div class="landing-app-list">

                <a
                    href="#"
                    class="landing-app-card"
                >
                    <div class="landing-app-icon">
                        <img
                            src="{{ asset('assets/images/logo/logo.png') }}"
                            alt="Meta Estate"
                        />
                    </div>

                    <div class="landing-app-content">
                        <h3>Meta Estate</h3>

                        <div class="landing-stars">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </div>
                    </div>

                    <div class="landing-app-meta">
                        Version 1.5.1
                    </div>
                </a>

                <a
                    href="#"
                    class="landing-app-card"
                >
                    <div class="landing-app-icon">
                        <img
                            src="{{ asset('assets/images/logo/logo.png') }}"
                            alt="Authorization Manager"
                        />
                    </div>

                    <div class="landing-app-content">
                        <h3>Authorization Manager</h3>

                        <div class="landing-stars">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </div>
                    </div>

                    <div class="landing-app-meta">
                        Version 1.5.1
                    </div>
                </a>

                <a
                    href="#"
                    class="landing-app-card"
                >
                    <div class="landing-app-icon">
                        <img
                            src="{{ asset('assets/images/logo/logo.png') }}"
                            alt="Meta Client"
                        />
                    </div>

                    <div class="landing-app-content">
                        <h3>Meta Client</h3>

                        <div class="landing-stars">
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                            <i class="fa fa-star"></i>
                        </div>
                    </div>

                    <div class="landing-app-meta">
                        Version 1.5.1
                    </div>
                </a>

            </div>

            {{-- Footer --}}
            <footer class="landing-footer">
                <div>Advanced Business Solutions</div>
                <div>Powered by Vectorasoft Co., LTD.</div>
            </footer>

        </section>

    </main>

    <?php ScriptManager::render('landing-script', 1); ?>

    <script>
        (function () {

            function isMobileDevice() {
                return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                    && !window.MSStream
                    && !navigator.userAgent.match(/iPad/i);
            }

            function showMobileBlockedMessage() {
                document.body.innerHTML = `
                    <div class="landing-mobile-block">
                        Sorry, this system is not available on mobile devices.
                    </div>
                `;
            }

            function bootLandingTheme() {
                const canvas = document.getElementById('landing-bg');

                if (!canvas) return;

                if (
                    window.LandingTheme &&
                    typeof window.LandingTheme.init === 'function'
                ) {
                    window.LandingTheme.init(canvas);
                }
            }

            function destroyLandingTheme() {
                if (
                    window.LandingTheme &&
                    typeof window.LandingTheme.destroy === 'function'
                ) {
                    window.LandingTheme.destroy();
                }
            }

            document.addEventListener('DOMContentLoaded', function () {
                if (isMobileDevice()) {
                    showMobileBlockedMessage();
                    return;
                }

                bootLandingTheme();
            });

            window.addEventListener('beforeunload', destroyLandingTheme);

        })();
    </script>

</body>

</html>