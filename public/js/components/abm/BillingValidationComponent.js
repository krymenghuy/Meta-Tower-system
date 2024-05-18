'use strict';

var BillingValidationComponent = new function () {
    const mThis = this;
    this.title_prop = "Billing Validation";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_billingValidationComponent');

    this.init= () => {
        if(mThis.initAlready) return;
        
        // this.btnNewSalesAgents.on('click',function(e){
        //     let op = {
        //         'id':null,
        //         'as':'sa',
        //         'onClose':(d)=>{
        //             // mThis.salesAgentsListView.showPage(null);
        //             mThis.initListView('view_sales_agent');
        //         }
        //     };
        //     // console.log(op);
        //     SalesAgentDialog.show(op);
        // });

        // this.btnNewContactPerson.on('click',function(e){
        //     let op = {
        //         'id':null,
        //         'as':'', 
        //         'onClose':(d)=>{
        //             // mThis.salesAgentsListView.showPage(null);
        //             mThis.initListView('view_contact_person');
        //         }
        //     };
        //     // console.log(op);
        //     SalesAgentDialog.show(op);
        // });

        
        mThis.initAlready = true;

    }

    this.show= (options)=>{
        mThis.init();
        if (!options) options = {};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
            mThis.self.siblings().hide();
            mThis.self.hide().fadeIn(300);
      
    }
}