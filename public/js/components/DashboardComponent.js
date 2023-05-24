"use strict";
var DashboardComponent = new function (){
  let mThis = this;
  this.title_prop = "Dashboard";
  this.self = $('#_main_dashboardComponent');

  this.init = () => {}

  this.show = (options) => {
    if(!options) options = {};
    main_view.setTitle(mThis.title_prop);
    mThis.self.show().siblings().hide();
  }
}

window.addEventListener('DOMContentLoaded',() => {
  DashboardComponent.init();
});