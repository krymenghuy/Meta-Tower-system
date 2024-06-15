'use strict';

var DashboardComponent = new function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_dashboardComponent');
    this.circle_card_row = mThis.self[0].querySelector('#db_circle_card');
    this.normal_card_row = mThis.self[0].querySelector('#db_normal_cards');
    this.card_header = mThis.self[0].querySelector('#card-header');
    this.card_body = mThis.self[0].querySelector('#card-body');
    

    this.init= () => {
        if(mThis.initAlready) return;
        
        
        mThis.initAlready = true;

    }
    this.initCircleCards = (div)=>{
            const pie = div.querySelectorAll(".pie");

                // start the animation when the element is in the page view
                const elements = [].slice.call(pie);
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

                const infoCode = div.querySelectorAll(".info-code");
                infoCode.forEach((info) => {
                    info.addEventListener("click", (e) => {
                        e.target.closest("section").classList.toggle("show-code");
                    });
                });
    }
    this.renderCircleCards = (d) => {
        let html = '';
        d.map(c =>{
             html += `<div class="col-4 overview-section">
             <div class="bg-white d-flex justify-item-center align-items-center p-3 shadow rounded-3 ">
                <div class="card-content d-flex justify-content-center w-100">
                
                    <div class="section-title mb-0 fs-5 text-center w-100 d-flex align-items-center"><div class="w-100 fs-6" style="color: #9B96A2;">Shipment <p class="fs-5 m-0" style="color: ${c.colorSlice};">${c.status}</p> <p class="fs-5"style="color: ${c.colorSlice};">${c.value}</p></div>  </div>
                    <div class="pie"
                        data-pie='{ "animationSmooth": "1s ease-out", "percent": ${c.percentage} , "colorSlice" : "${c.colorSlice}", "colorCircle": "#f1f1f1" }'>
                    </div>
                    <div class="code">
                        <pre>
                            <code class="language-json">data-pie='{ 
                                "animationSmooth": "1s ease-out",
                                "percent": ${c.percentage},
                                "colorSlice": "${c.colorSlice}",
                                "colorCircle": "#f1f1f1",
                                "fontWeight": 50
                                }'
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>`;
        });
        this.circle_card_row.innerHTML = html;
        this.initCircleCards(this.circle_card_row);
    }
    this.rederNormalCards = (d) => {
        let html = '';
        d.map(c =>{
            html = [html,`<div class="col-md-4 ">
            <div class="overview-card card">
                <div class="w-100 d-flex justify-content-between ">
                    <p class="section-title mb-2 fs-5">${c.title}</p>`,
                    // `<i class="fas fa-ellipsis-v fs-5"></i>`,
                `</div>
                <div class="w-100 d-flex justify-content-between ">
                    <p class="text-center fs-2">${c.value}</p>
                    ${c.icon}
                </div>
            </div>
            </div>`].join('');
        });

        this.normal_card_row.innerHTML = html;
                                
    }

    this.loadCards = (onFinish)=>{
        let p={};
        vsapi.call(`${mThis.base_url}/abm/dashboard/cards`, p , null,false,false).then(res => {
            console.log('d2',res.data);
            let d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data,null,['icon']) : {};
            mThis.renderCircleCards(d.circle_cards);
            mThis.rederNormalCards(d.normal_cards);
            onFinish();
        });
    }

    this.prepareFormOptions = ( data, onFinish) => {
        // let p={'id' : data.id }
        mThis.loadCards(onFinish);
    }

    this.show= (options)=>{
        if (!options) options = {};
            mThis.options = options;    
        main_view.setTitle(mThis.title_prop);   
        mThis.prepareFormOptions( null , d => {
        // mThis.workSpaceListView.showPage(null, null, () => {
            mThis.self.siblings().hide();
            mThis.self.fadeIn(204);
        // });
        });
    }
}