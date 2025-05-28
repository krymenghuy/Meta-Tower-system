"use strict";
var DashboardComponent = new function () {
  const mThis = this;
  this.title_prop = "Dashboard";
  this.self = main_view.appContent.children('#_main_dashboardComponent');

  this.init = () => {
    if (mThis.initAlready) return;
   
      mThis.renderDashboard();
    mThis.initAlready = true;
  }



  this.renderDashboard = (d) => {
    const div = mThis.self;
   

    const html = [`<div class="mt-2 text-primary-custom"><h3>Welcome</h3> <h5> >>> YAV PHENG ASSOCIATION</h5> </div>
                `].join('');
    div.html(html);
    

    
   
  }



  this.show = (options) => {
    mThis.init();
    if (!options) options = {};
    main_view.setTitle(mThis.title_prop);

      mThis.renderDashboard();
      mThis.self.siblings().hide();
      mThis.self.fadeIn(250);
  }
}
