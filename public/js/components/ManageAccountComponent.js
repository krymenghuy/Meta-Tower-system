"use strict";
var ManageAccountComponent = new function(){
    let mThis = this;
    this.title_prop = "Manage Account";
    this.self = $('#_main_manageAccountComponent');

    this.tblManageAccount = mThis.self.find('.tbl__mna');
    this.btnAdd = mThis.self.find('.btn--add');

    this.init = () => {
        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'onClose': (e) => {
                    if(e){
                        mThis.displayManageAccount();
                    }
                }
            };
            ManageAccountDialog.show(op);
        });
    }

    this.displayManageAccount = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }

            let cols = [{
                title: "No",
                data: (data, a, b) => {
                    return [`<span>${cnt++}</span>`].join('');
                }
            },
            {
                title: "Name",
                data: "name"
            },
            {
                title: "Email",
                data: "email"
            },
            {
                title: "Phone",
                data: "phone"
            },
            {
                title: "Parent ID Card",
                data: "parent_id_card"
            },
            {
                title: "Profession",
                data: "profession"
            },
            {
                title: "Childs",
                data: (data, a, b) => {
                    return [`<button class="btn btn-sm btn-success" type="button">
                        <span class="trans-text" data-langprop="buttons.Connected Students"></span>
                    </button>`].join('');
                }
            },
            {
                title: "Reset Password",
                data: (data, a, b) => {
                    return [`<button class="btn btn-sm btn-primary" type="button">
                        <span class="trans-text" data-langprop="buttons.Reset Password"></span>
                    </button>`].join('');
                }
            },
            {
                title: "Actions",
                data: (data, a, b) => {
                    return [`<button class="btn btn-sm btn-danger" type="button">
                        <span class="trans-text" data-langprop="buttons.Options"></span>
                        <i class="fa-solid fa-caret-down"></i>
                    </button>`].join('');
                }
            }];

            if(mThis.table){
                mThis.tblManageAccount.DataTable().clear().destroy();
                mThis.tblManageAccount.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblManageAccount.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    processing: true,
                    language: {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
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