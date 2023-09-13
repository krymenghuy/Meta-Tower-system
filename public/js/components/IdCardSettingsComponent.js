"use strict";
var IdCardSettingsComponent = new function(){
    let mThis = this;
    this.title_prop = "ID Card Settings";
    this.self = main_view.appContent.children('#_main_idCardSettingsComponent');

    this.tblIdCardSettings = mThis.self.find('.panel-card-student');
    this.containerFilter = mThis.self.find('#container_ics_filter');

    this.init = () => {}

    this.prepareOptions = (onFinish = null) => {
        let div = mThis.containerFilter;
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null,false).then(res => {
            if(res.status_code === 200){
                let d = res.data;
                if(d && !($.isEmptyObject(d))){
                    div.find('.data-input').each(function(){
                        let el = $(this);
                        let f = el.data('field');
                        switch(f){
                            case 'campus_id':
                                VSUtil.setComboItems(el,d.campuses,'id','campus',null,null,null);
                                break;
                            case 'level_id':
                                VSUtil.setComboItems(el,d.levels,'id','level',null,null,null);
                                break;
                            case 'session_id':
                                VSUtil.setComboItems(el,d.sessions,'id','name',null,null,null);
                                break;
                            default:
                                break;
                        }
                    });
                }
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.prepareOptions(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    IdCardSettingsComponent.init();
});