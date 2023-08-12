"use strict";
var ActivitiesComponent = new function(){
    let mThis = this;
    this.title_prop = "Activities";
    this.self = $('#_main_activitiesComponent');

    this.panelActivities = mThis.self.find('#div_att_hasList');
    this.tblActivities = mThis.panelActivities.find('#div_att_list');

    let cnt = 1;
    this.cols = [{
        title: "No",
        data: () => {
            return cnt++;
        }
    },
    {
        title: `<input type="checkbox" class="form-check-input"/>`,
        data: () => {
            return [`<input type="checkbox" class="form-check-input"/>`].join('');
        }
    },
    {
        title: "Image",
        data: (data, a, b) => {
            let image = data.image_url ? data.image_url : '';
            return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
        }
    },
    {
        title: "School",
        data: ""
    }];

    this.init = () => {
        mThis.itemView = new ListView('div_att_list',{
            'fetchApi':`${main_view.base_url}/api/activity/list-paginate`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ActivitiesComponent.init();
});