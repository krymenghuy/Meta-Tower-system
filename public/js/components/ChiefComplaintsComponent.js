"use strict";
let ChiefComplaintsComponent = new function () {
    let mThis = this;
    this.title_prop = 'Chief Complaints';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_chiefComplaintsComponent');
    this.form_data = {};

    this.init = () => {
        mThis.columns = [
            {
                "name": "name",
                "dataType": "string",
                "displayType": "select",
                "cssClass": "",
            },
        ];

        let itemConfig = new ItemsView('_ccp_panel', {
            columns: mThis.columns,
            "showColumnHeaders": true,
            "showAddLineButton": true,
            "validateColumns": { 'name': 'string' }
        });
    }

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

$(document).ready(function () {
    ChiefComplaintsComponent.init();
});