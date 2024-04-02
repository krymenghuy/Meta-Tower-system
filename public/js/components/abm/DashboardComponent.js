'use strict';

var DashboardComponent = new function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.self = main_view.appContent.children('#_main_dashboardComponent');

    this.init= () => {
        if(mThis.initAlready) return;
        
        
        mThis.initAlready = true;

    }

    this.show= (options)=>{
        if (!options) options = {};
            mThis.options = options;    
        main_view.setTitle(mThis.title_prop);
        // mThis.workSpaceListView.showPage(null, null, () => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(204);
        // });
    }
}