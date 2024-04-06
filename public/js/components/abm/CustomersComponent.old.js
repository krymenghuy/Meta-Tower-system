'use strict';
var CustomersComponent = new function(){
    const mThis = this;
    this.title_prop = "Customers";
    this.self = main_view.appContent.children('#_main_customersComponent')[0];
   

    this.headerList = [];

    this.init = () => {
        if(mThis.initAlready) return;


        

        mThis.initAlready = true;
    }



    this.show = (options) => {
        mThis.init();
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            
        
    }
}
