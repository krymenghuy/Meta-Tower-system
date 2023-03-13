'use strict'
var DashboardComponent = new function(){
    let mThis = this;
    this.self = $('#_main_dashboardComponent');
    this.elScreenTitle = $('#screen_title');

    this.init = ()=>{
       return null;
    }

    this.show = (option)=>{
       mThis.elScreenTitle.html(option.title);
       mThis.self.show().siblings().hide();
    }
  
}

$(document).ready(function(){
   DashboardComponent.init();
});
