"use strict";

var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.dashboard_top = mThis.self.querySelector('#_dashboard_top');
    this.dashboard_center = mThis.self.querySelector('#_dashboard_center');
    this.dashboard_Bottom  = mThis.self.querySelector('#_dashboard_bottom');
    // this.initAlready = false;

    // Initialize component
    this.init =  () => {
        if (mThis.initAlready) return;


        mThis.initAlready = true;
    };
    this.renderDashboardTop = () => {
        let html = '';
        html = [
            `  <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Total Employee</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">1200</span>
                    <i class="fa fa-users text-success" style="font-size: 2rem;"></i>
                </div>
            </div>
        </div>
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">New Staffs</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">100</span>
                    <i class="fa fa-users text-success" style="font-size: 2rem;"></i>
                </div>
            </div>
        </div>
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Staff in Probation</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">400</span>
                    <i class="fa fa-users text-success" style="font-size: 2rem;"></i>
                </div>
            </div>
        </div>
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Resigned Staff</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">200</span>
                    <i class="fa fa-users text-success" style="font-size: 2rem;"></i>
                </div>
            </div>
        </div>
            `
        ].join('');
        mThis.dashboard_top.innerHTML = html;

    }
  
    this.loadCards = (onFinish)=>{
        let p={};
  
        vsapi.call(`${main_view.base_url}/api/merchant/v2/order-summary-counts`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data) : {};
            console.log(123,data);   

            mThis.renderDashboardTop();

            onFinish();
          });
    }
    this.prepareFormOptions = (data, onFinish) =>{
        
        mThis.loadCards(onFinish);

    }
    this.setDashboardScroll = ()=>{
        const parent = mThis.self;
        parent.style.height = (window.innerHeight - 100)+'px';
        parent.classList.add('overflow-y-auto');
        parent.classList.add('overflow-x-hidden');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 100)+'px';
        }
    }
    this.show =  (options) => {
        mThis.setDashboardScroll();
        mThis.init();
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(null , d => {
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
        });
    };
    
})();

