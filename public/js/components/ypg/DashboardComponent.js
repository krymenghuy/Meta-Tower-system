"use strict";

var DashboardComponent =  (function () {
    const mThis = {};
    mThis.title_prop = "Dashboard";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_dashboardComponent");
    mThis.self = mThis.jm[0];



    mThis.init = () => {
      
        mThis.initAlready = true;
    };


   

   


    
    
  

    mThis.show = (options) => {
        mThis.init();
        options = options || {};
        main_view.setTitle(mThis.title_prop);
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(200);
       
    };

   
    return mThis;
})();
