'use strict'
var DriverProfileComponent = new function(){
    let mThis = this;
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_driverProfileComponent');

    this.init = ()=>{


    }
    //end::init()

    this.show = (option)=>{
      mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }	  

 
}

$(document).ready(function() {
    DriverProfileComponent.init();
});