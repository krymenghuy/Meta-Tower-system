"use strict";
var DashboardComponent = new function (){
  let mThis = this;
  this.title_prop = "Dashboard";
  this.self = $('#_main_dashboardComponent');

  this.init = () => {}

  this.show = (options) => {
    if(!options) options = {};
    main_view.setTitle(mThis.title_prop);
    let x = mThis.self.siblings(':visible');
    if(x.length === 0){
      mThis.self.hide().fadeIn(300);
      return;
    }
    x.fadeOut('fast',function(){
      mThis.self.hide().fadeIn(300);
    });
  }
}

window.addEventListener('DOMContentLoaded',() => {
  DashboardComponent.init();
});