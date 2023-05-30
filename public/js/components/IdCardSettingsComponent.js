"use strict";
var IdCardSettingsComponent = new function(){
    let mThis = this;
    this.title_prop = "ID Card Settings";
    this.self = $('#_main_idCardSettingsComponent');

    this.tblIdCardSettings = mThis.self.find('.panel-card-student');

    this.init = () => {}

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

window.addEventListener('DOMContentLoaded',() => {
    IdCardSettingsComponent.init();
});