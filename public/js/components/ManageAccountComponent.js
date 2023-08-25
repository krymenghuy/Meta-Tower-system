"use strict";
var ManageAccountComponent = new function(){
    let mThis = this;
    this.title_prop = "Manage Account";
    this.self = $('#_main_manageAccountComponent');

    this.btnAdd = mThis.self.find('#_mna_btn_new');

    this.cols = [{
        title: "Name",
        data: (data, a, b) => {
            let father_name = data.parents && data.parents[0].name ? data.parents[0].name : '',
            mother_name = data.parents && data.parents[1].name ? data.parents[1].name : '';
            return [`<p class="pb-0 mb-1">${father_name}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_name}</p>`].join('');
        }
    },
    {
        title: "Phone Number",
        data: (data, a, b) => {
            let father_phone = data.parents && data.parents[0].phone_number ? data.parents[0].phone_number : '', mother_phone = data.parents && data.parents[1].phone_number ? data.parents[1].phone_number : '';
            return [`<p class="pb-0 mb-1">${father_phone}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_phone}</p>`].join('');
        }
    },
    {
        title: "Email",
        data: (data, a, b) => {
            let father_email = data.parents && data.parents[0].email ? data.parents[0].email : '', mother_email = data.parents && data.parents[1].email ? data.parents[1].email : '';
            return [`<p class="pb-0 mb-1">${father_email}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_email}</p>`].join('');
        }
    },
    {
        title: "National Card ID",
        data: (data, a, b) => {
            let father_nid = data.parents && data.parents[0].n_id ? data.parents[0].n_id : '', mother_nid = data.parents && data.parents[1].n_id ? data.parents[1].n_id : '';
            return [`<p class="pb-0 mb-1">${father_nid}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_nid}</p>`].join('');
        }
    },
    {
        title: "Family ID",
        className: "align-middle",
        data: "family_code"
    },
    {
        title: "Action",
        className: "align-middle",
        data: (data, a, b) => {
            let father_id = data.parents && data.parents[0].id, mother_id = data.parents && data.parents[1].id
            parent = [father_id,mother_id].join('-');
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-mna-add_img" data-id="${parent}">
                    <i class="fa-solid fa-image-portrait text-info fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-mna-details" data-id="${data.family_code}">
                    <i class="fa-solid fa-up-right-from-square text-success fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl__mna',{
            'fetchApi':`${main_view.base_url}/api/guardian/list`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });
        mThis.tblParent = $(mThis.itemView.getTable());

        mThis.tblParent.on('click','a.btn-mna-add_img',function(e){
            e.preventDefault();
            let parent = $(this).data('id');
            console.log(parent);
        });

        mThis.tblParent.on('click','a.btn-mna-details',function(e){
            e.preventDefault();
            let family = $(this).data('id');
            console.log(family);
        });

        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            ManageAccountDialog.show(op);
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

let ManageAccountDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__mna');

    this.elTitle = mThis.self.find('.modal-title');

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){}
        else{
            mThis.elTitle.text(LocaleManager.trans('Connected Students','titles'));
        }

        mThis.self.modal({
            backdrop: 'static',
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ManageAccountComponent.init();
});