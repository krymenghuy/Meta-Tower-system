'use strict';

var DashboardComponent = new function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.self = main_view.appContent.children('#_main_dashboardComponent');

    this.init= () => {
        if(mThis.initAlready) return;
        
        
        mThis.initAlready = true;

    }

    this.prepareFormOptions = ( data, onFinish) => {
        // let p={'id' : data.id }
        vsapi.call(`${mThis.base_url}/abm/oversea_shipments/form-options-payment`, data , null).then(res => {
            console.log('d2',res.data.to_country);
            let d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data , null, ['country_name','cp_name'] ) : {};
            
            onFinish(d);
        });
    }

    this.show= (options)=>{
        if (!options) options = {};
            mThis.options = options;    
        main_view.setTitle(mThis.title_prop);   
        // mThis.prepareFormOptions( {'id': p} , d => {
        // mThis.workSpaceListView.showPage(null, null, () => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(204);
        // });
        // });
    }
}