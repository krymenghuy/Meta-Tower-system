'use strict';
var AccessControlComponent = new function(){


    const mThis = this;
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_access_Component");
    mThis.title_prop = "Access Control";



    this.init = () => {
        if(mThis.initAlready) return;


        mThis.initAlready = true;
    }

     mThis.show = function () {
        mThis.init();
        main_view.setContentView(mThis.self,mThis.title_prop);


    };

}
