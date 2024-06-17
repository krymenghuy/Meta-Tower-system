

<style>
    body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
        }
        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .card-header {
            background-color: #ffffff;
            border-bottom: none;
            font-weight: bold;
        }
        .progress {
            height: 15px;
        }
        .progress-bar {
            border-radius: 10px;
        }
        .progress-bar-interactive {
            background-color: #6c63ff;
        }
        .progress-bar-page {
            background-color: #ff6c63;
        }
        .icon {
            font-size: 20px;
            margin-right: 5px;
        }
        .overview-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 20px;
        }
        .overview-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
        }
        .overview-card div {
            flex: 1;
            text-align: center;
        }
        .links-overview {
            display: flex;
            justify-content: space-between;
        }
        .links-overview div {
            text-align: center;
        }
        *:before,
        *:after {
            box-sizing: border-box;
        }

        /* html,
        body {
            margin: 0;
            padding: 0;
        }

        html {
            height: 100%;
        } */

        /* body {
            position: relative;
            min-height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
                sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
            background: #eceff1;
        } */

        h1 {
            margin: auto;
            text-transform: uppercase;
            text-align: center;
            padding-top: 30px;
        }

        .flex {
            display: flex;
        }

        .container {
            flex-wrap: wrap;
            justify-content: center;
            max-width: 100%;
            margin: auto;
        }

        .info {
            justify-content: space-between;
            border-bottom: 1px solid #e6e6e6;
            padding: 10px 0;
            text-transform: uppercase;
            font-size: 90%;
            margin: auto -15px 30px;
        }

        .info-code {
            cursor: pointer;
        }

        .info-code:hover {
            color: salmon;
        }

        .progress-wrapper {
            max-width: 350px;
            justify-content: space-between;
            margin: auto;
            padding: 20px;
            text-transform: uppercase;
        }

        [type="range"] {
            width: 200px;
        }

        div.card-content {
            position: relative;
            background-color: #fff;
            /* border-radius: 7px; */
            /* padding: 5px 30px 30px;
            margin: 20px;
            width: 200px; */
            height: 100px;
        }

        .card-content .code {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            width: 260px;
            height: 0;
            left: 0;
            margin: auto;
            line-height: 1.6;
            transition: visibility 0s, opacity 0.5s linear;
        }

        /* .show-code .code {
            visibility: visible;
            opacity: 1;
            height: 100%;
            top: 45px;
        } */

        pre {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        code {
            height: calc(100% - 45px);
            margin-top: -20px;
        }

        .github {
            position: absolute;
            text-align: center;
            left: 0;
            right: 0;
            top: 5px;
            margin: auto;
            font-size: 0.9rem;
            text-transform: uppercase;
        }

        .github a {
            text-decoration: none;
        }

        .github a:hover {
            border-bottom: 1px solid salmon;
        }

        [data-pie-index="0"] {
            position: relative;
            border-radius: 50%;
            box-shadow: inset 0 0 25px 10px #a2caff;
        } 

        [data-pie-index="1"] {
            position: relative;
            border-radius: 50%;
            box-shadow: inset 0 0 25px 10px #a2caff;
        } 

        [data-pie-index="2"] {
            position: relative;
            border-radius: 50%;
            box-shadow: inset 0 0 25px 10px #a2caff;
        } 

         [data-pie-index="16"] {
            position: relative;
            border-radius: 50%;
            box-shadow: inset 0 0 25px 10px #f50057;
        }
        [data-pie-index="17"] {
            position: relative;
            border-radius: 50%;
            box-shadow: inset 0 0 25px 10px #f50057;
        }

        .pie{
            width: 100px !important;
            height: 100px !important;
        }

        .pie svg {
            width: 100px;
            height: 100px;
            /* margin: 0px 60px 20px; */
        }

        @keyframes heart {
            0% {
                transform: scale(1.07);
            }

            80% {
                transform: scale(1);
            }

            100% {
                transform: scale(0.8);
            }
        }
</style>
<div id="_main_dashboardComponent" style="display:none;padding:px">

    <body>
        <div class=" bg-ligth m-0">
            <div class="row">
                <div class="col-md-12 ps-0 pe-2">
                    <div class="card" style="background-color: whitesmoke;">
                        <div class="card-header" style="background-color: whitesmoke;">
                            <div id="db_circle_card" class="row">   
                               
                                
                                <!-- <div class="col-4 overview-section">
                                    <section class="d-flex justify-content-center">
                                        
                                        <div class="section-title mb-0 fs-5 text-center w-100 d-flex align-items-center"><div class="w-100 text-secondary">Shipment <p style="color: #6200EA;">Shipping</p></div>  </div>
                                        <div class="pie"
                                            data-pie='{ "animationSmooth": "1s ease-out", "percent": 70, "colorSlice": "#6200EA", "colorCircle": "#f1f1f1" }'>
                                        </div>
                                        <div class="code">
                                            <pre>
                                                <code class="language-json">data-pie='{ 
                                                    "animationSmooth": "1s ease-out",
                                                    "percent": 70,
                                                    "colorSlice": "#6200EA",
                                                    "colorCircle": "#f1f1f1"
                                                    }'
                                                </code>
                                            </pre>
                                        </div>
                                    </section>
                                </div>
                                <div class="col-4 overview-section">
                                    <section class="d-flex justify-content-center">
                                        
                                        <div class="section-title mb-0 fs-5 text-center w-100 d-flex align-items-center"><div class="w-100 text-secondary">Shipment <p style="color: #6200EA;">Validated</p></div>  </div>
                                        <div class="pie"
                                            data-pie='{ "animationSmooth": "1s ease-out", "percent": 30, "colorSlice": "#AB47BC", "colorCircle": "#f1f1f1" }'>
                                        </div>
                                        <div class="code">
                                            <pre>
                                                <code class="language-json">data-pie='{ 
                                                    "animationSmooth": "1s ease-out",
                                                    "percent": 30,
                                                    "colorSlice": "#AB47BC",
                                                    "colorCircle": "#f1f1f1"
                                                    }'
                                                </code>
                                            </pre>
                                        </div>
                                    </section>
                                </div> -->
                            </div>
                            
                            <div id="db_normal_cards" class="row">
                                <div class="col-md-4 ">
                                    <div class="overview-card card">
                                        <div class="w-100 d-flex justify-content-between ">
                                            <p class="section-title mb-2 fs-5">Total Customers</p>
                                            <i class="fas fa-ellipsis-v fs-5"></i>
                                        </div>
                                        <div class="w-100 d-flex justify-content-between ">
                                            <p class="text-center fs-2">1240</p>
                                            <i class="fas fa-user-plus text-info" style="font-size: 3rem;width: 100px;"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 ">
                                    <div class="overview-card card">
                                        <div class="w-100 d-flex justify-content-between ">
                                            <p class="section-title mb-2 fs-5">Active Customers</p>
                                            <i class="fas fa-ellipsis-v fs-5"></i>
                                        </div>
                                        <div class="w-100 d-flex justify-content-between ">
                                            <p class="text-center fs-2">140</p>
                                            <i class="fas fa-user text-success"  style="font-size: 3rem;width: 100px;"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 ">
                                    <div class="overview-card card">
                                        <div class="w-100 d-flex justify-content-between ">
                                            <p class="section-title mb-2 fs-5">Active Sales Agents</p>
                                            <i class="fas fa-ellipsis-v fs-5"></i>
                                        </div>
                                        <div class="w-100 d-flex justify-content-between ">
                                            <p class="text-center fs-2">120</p>
                                            <i class="fa fa-users text-success"  style="font-size: 3rem;width: 100px;"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row ">
                                <div id="db_progress_cards" class="col-md-6 overview-section">
                                    <div class="card">
                                        <div class="card-header">
                                            <p class="section-title mb-0 fs-5">Accounting</p>
                                        </div>
                                        <div class="card-body">
                                            <p>Overview the Invoice Amount (%)</p>
                                            <div class="progress">
                                                <div class="progress-bar progress-bar-interactive" role="progressbar" style="width: 95%;" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100">95% - Invoice</div>
                                            </div><br>
                                            <p>Overview the Payment Amount (%)</p>
                                            <div class="progress mt-2">
                                                <div class="progress-bar progress-bar-page" role="progressbar" style="width: 67%;" aria-valuenow="67" aria-valuemin="0" aria-valuemax="100">67% - Payment</div>
                                            </div>
                                            <p>Overview the Payment Amount (%)</p>
                                            <div class="progress mt-2">
                                                <div class="progress-bar progress-bar-page" role="progressbar" style="width: 67%;" aria-valuenow="67" aria-valuemin="0" aria-valuemax="100">67% - Payment</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="db_country_cards" class="col-md-6 overview-section">
                                    <div class="card">
                                        <div class="card-header">
                                            <p class="section-title mb-0 fs-5">Shipments by country</p>
                                        </div>
                                            
                                        <div class="card-body ">
                                            <div class=" gap-3 d-flex">
                                                <div class="links-overview d-block text-start w-50 p-0">
                                                    <p class="w-50 p-0">Country</p>
                                                    <div class="w-100 d-flex justify-content-between"><p>Nofollow:</p> <p>23</p></div>
                                                    <div class="w-100 d-flex justify-content-between"><p>Dofollow: </p> <p></p>663</div>
                                                    <div class="w-100 d-flex justify-content-between"><p>Noreferrer: </p> <p>45</p></div>
                                                    <div class="w-100 d-flex justify-content-between"><p>Noopener: </p> <p>102</p></div>
                                                </div>
                                                <div class="links-overview d-block w-50 p-0">
                                                    <p class="w-50 p-0">Shippments</p>
                                                    <div class="w-100 d-flex justify-content-between"><p>Internal: </p> <p>154</p></div>
                                                    <div class="w-100 d-flex justify-content-between"><p>External: </p> <p>35</p></div>
                                                    <div class="w-100 d-flex justify-content-between"><p>Anchor: </p> <p>19</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                            <div class="row ">
                                <div id="db_supplier_cards" class="col-md-12 overview-section">
                                    <div class="card">
                                        <div class="card-header">
                                            <p class="section-title mb-0 fs-5">Shippments by carrier</p>
                                        </div>
                                        <div class="card-body">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">URL</th>
                                                        <th scope="col">DA</th>
                                                        <th scope="col">PA</th>
                                                        <th scope="col">CF</th>
                                                        <th scope="col">TF</th>
                                                        <th scope="col">FB</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td class="d-flex gap-2"><i class="fa-brands fa-youtube fs-5 text-danger"></i><a href="#">https://www.youtube.com/watch?v=sZdmkif8csY</a></td>
                                                        <td>100</td>
                                                        <td>25</td>
                                                        <td>58</td>
                                                        <td>31</td>
                                                        <td>22M</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="d-flex gap-2"><i class="fa-brands fa-facebook fs-5 text-info"></i><a href="#">https://www.forbes.com/sh?v=7f6ccdca2254</a></td>
                                                        <td>65</td>
                                                        <td>65</td>
                                                        <td>96</td>
                                                        <td>62</td>
                                                        <td>24K</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="d-flex gap-2"><i class="fa-brands fa-youtube fs-5 text-danger"></i><a href="#">https://www.uikit.to/sh?v=7f6ccdca2254</a></td>
                                                        <td>76</td>
                                                        <td>75</td>
                                                        <td>47</td>
                                                        <td>42</td>
                                                        <td>11M</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <script>
            window.addEventListener("DOMContentLoaded", () => {
                // update circle when range change
                const pie = document.querySelectorAll(".pie");

                // start the animation when the element is in the page view
                const elements = [].slice.call(document.querySelectorAll(".pie"));
                const circle = new CircularProgressBar("pie");

                // circle.initial();

                if ("IntersectionObserver" in window) {
                    const config = {
                        root: null,
                        rootMargin: "0px",
                        threshold: 0.75
                    };

                    const ovserver = new IntersectionObserver((entries, observer) => {
                        entries.map((entry) => {
                            if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
                                circle.initial(entry.target);
                                observer.unobserve(entry.target);
                            }
                        });
                    }, config);

                    elements.map((item) => {
                        ovserver.observe(item);
                    });
                } else {
                    elements.map((element) => {
                        circle.initial(element);
                    });
                }

                setInterval(() => {
                    const typeFont = [100, 200, 300, 400, 500, 600, 700];
                    const colorHex = `#${Math.floor((Math.random() * 0xffffff) << 0).toString(
                        16
                    )}`;
                    const options = {
                        index: 17,
                        percent: Math.floor(Math.random() * 100 + 1),
                        colorSlice: colorHex,
                        fontColor: colorHex,
                        fontSize: `${Math.floor(Math.random() * (1.4 - 1 + 1) + 1)}rem`,
                        fontWeight: typeFont[Math.floor(Math.random() * typeFont.length)]
                    };
                    circle.animationTo(options);
                }, 3000);

                // global configuration
                const globalConfig = {
                    speed: 30,
                    animationSmooth: "1s ease-out",
                    strokeBottom: 5,
                    colorSlice: "#FF6D00",
                    colorCircle: "#f1f1f1",
                    round: true
                };

                const global = new CircularProgressBar("global", globalConfig);
                global.initial();

                // update global example when change range
                // t

                const infoCode = document.querySelectorAll(".info-code");
                infoCode.forEach((info) => {
                    info.addEventListener("click", (e) => {
                        e.target.closest("section").classList.toggle("show-code");
                    });
                });
            });

        </script> -->
        
    </body>
</div>
