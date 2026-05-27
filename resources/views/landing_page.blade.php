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
        href="{{ asset('assets/images/meta/Meta_logo.png') }}"
    />

    <?php StyleManager::render('prm-landing-styles', 1,2); ?>
</head>

<body class="landing-body">

 <?php
    $user = XAuthService::user();
    if (!$user) return;

    $apps = $user->apps->filter(fn($a) => !$a->is_mobile_app)->values();
    $total = $apps->count();
  ?>

    <canvas
        id="landing-bg"
        class="landing-bg"
        aria-hidden="true"
    ></canvas>

    <main class="landing-shell">

        <section
            class="landing-panel"
            aria-label="Meta Tower application portal"
        >

            <header class="landing-brand">
                <img
                    decoding="async"
                    fetchpriority="high"
                    alt="Meta Tower Logo"
                    src="{{ asset('assets/images/meta/Meta_logo.png') }}"
                />
            </header>
           
            @php
                $appList = $apps ?? collect();
             
                $appCount = is_countable($appList) ? count($appList) : 0;
            @endphp

            <div class="landing-app-list {{ $appCount > 3 ? 'is-grid' : 'is-stack' }}">

                @forelse ($appList as $app)
                    @php
                        $appName = $app->app_name ?? 'Application';
                        $appUrl = $app->home_route ?? '#';
                        $iconFile = $app->icon_file_name ?? 'Meta_logo.png';
                        $version = $app->version ?? '1.5.1';
                    @endphp

                    <article class="landing-app-col">
                        <a
                            href="{{ $appUrl }}"
                            class="landing-app-card"
                            aria-label="Open {{ $appName }}"
                        >
                            <span class="landing-app-icon">
                                <img
                                    loading="lazy"
                                    decoding="async"
                                    alt="{{ $appName }}"
                                    src="{{ asset('assets/images/meta/' . $iconFile) }}"
                                />
                            </span>

                            <span class="landing-app-content">
                                <span class="landing-app-name">
                                    {{ $appName }}
                                </span>

                                <span
                                    class="landing-stars"
                                    aria-label="5 star rating"
                                >
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                </span>
                            </span>

                            <span class="landing-app-version">
                                Version {{ $version }}
                            </span>
                        </a>
                    </article>
                @empty
                    <div class="landing-empty">
                        No applications are available for your account.
                    </div>
                @endforelse

            </div>

            <footer class="landing-footer">
                <div>Advanced Business Solutions</div>
                <div>Powered by Vectorasoft Co., LTD.</div>
            </footer>

        </section>

    </main>

    <?php ScriptManager::render('landing-script', 1,2); ?>

    <script>
        (() => {
            const LandingPage = {
                mobilePattern: /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i,

                isMobileDevice() {
                    return this.mobilePattern.test(navigator.userAgent)
                        && !window.MSStream
                        && !navigator.userAgent.match(/iPad/i);
                },

                blockMobile() {
                    document.body.className = 'landing-body';
                    document.body.innerHTML = `
                        <div class="landing-mobile-block">
                            Sorry, this system is not available on mobile devices.
                        </div>
                    `;
                },

                bootTheme() {
                    const canvas = document.getElementById('landing-bg');

                    if (!canvas) {
                        console.warn('[LandingPage] landing-bg canvas not found.');
                        return;
                    }

                    if (
                        window.LandingTheme &&
                        typeof window.LandingTheme.init === 'function'
                    ) {
                        window.LandingTheme.init(canvas);
                        return;
                    }

                    console.warn('[LandingPage] LandingTheme not found. Check landing-script bundle.');
                },

                destroyTheme() {
                    if (
                        window.LandingTheme &&
                        typeof window.LandingTheme.destroy === 'function'
                    ) {
                        window.LandingTheme.destroy();
                    }
                },

                init() {
                    if (this.isMobileDevice()) {
                        this.blockMobile();
                        return;
                    }

                    this.bootTheme();
                }
            };

            window.addEventListener('load', () => LandingPage.init());
            window.addEventListener('beforeunload', () => LandingPage.destroyTheme());
        })();
    </script>

</body>

</html>