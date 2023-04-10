"use strict";
let VendorListComponent = new function () {
    let mThis = this;
    this.title_prop = 'Vendors';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_vendorListComponent');
    this.btnNew = $('#_vdr_btnNew');
    this.elSearchItem = $('#_vdr_search');

    this.tblVendors = $('#_vdr_tblVendors');

    this.col_titles = {
        "No": "No",
        "Name": "Name",
        "Vendor Type": "Vendor Type",
        "Address": "Address",
        "Tax Number": "Tax Number",
        "Email": "Email",
        "Phone Number": "Phone Number",
        "Contact Person": "Contact Person",
        "Currency": "Currency",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop]?mThis.col_titles[title_prop]:title_prop);
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'vendors', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        this.expandableConfig = new ExpandableRowConfig('_vdr_tblVendors', {
            'dontExpandByClickingOn': ['btn-vdr-modify', 'btn-vdr-delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let id = qtr.data('id');
                mThis.displayVendorsDetails($(detail_tr), { 'id': id });
            }
        });

        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayVendors();
                    }
                }
            };
            VendorDialog.show(op);
        });

        mThis.tblVendors.on('click', 'a.btn-vdr-modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayVendors();
                    }
                }
            };
            VendorDialog.show(op);
        });

        mThis.tblVendors.on('click', 'a.btn-vdr-delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this vendor?`, { title: "Delete Vendor", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/vendor/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayVendors();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elSearchItem.on('keyup', (e) => {
            let d = mThis.elSearchItem.val();
            if (!d || d.length > 2 || e.keyCode === 13) mThis.displayVendors();
        });
    }

    this.displayVendorsDetails = (detail_tr, options) => {
        let id = options.id;
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html("");
    }

    this.createTableRow = (items) => {
        let tr = null;
        for(let i=0; i<items.length; i++){
            tr = [tr,`<tr>
                <td>${items[i].code ? items[i].code : ""}</td>
                <td>${items[i].name ? items[i].name : ""}</td>
                <td>${items[i].description ? items[i].description : ""}</td>
                <td>${items[i].qty ? items[i].qty : ""}</td>
                <td>${items[i].last_updated ? items[i].last_updated : ""}</td>
            </tr>`].join('');
        }
        return tr;
    }

    this.displayVendors = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val() };
        window.vsapi.call(`${mThis.base_url}/api/vendor/list`, p,null,null).then(res=> {
            let data = [];
            if (res.status_code === 200) data = res.data;
            if (mThis.table) {
                mThis.tblVendors.DataTable().clear().destroy();
                mThis.tblVendors.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null);
            let cnt = 1;
            let my_columns = [
                {
                    title: mThis.trans_title("Name"),
                    data: "name"
                },
                {
                    title: mThis.trans_title("Phone Number"),
                    data: "phone_number"
                },
                {
                    title: mThis.trans_title("Email"),
                    data: "email"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (item, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn-vdr-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn-vdr-delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblVendors.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    'processing': true,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    'data': data,
                    'columns': my_columns,
                    "createdRow": function (row, data, dataIndex) {
                        cnt++;
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;
        mThis.displayVendors(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let VendorDialog = new function () {
    let mThis = this;
    this.self = $('#_vdr_dlgVendors');
    this.elVendorType = $('#_ven_vendor_type');
    this.form_data = {};

    this.lnkAddVendorType = $('#_ven_lnk_add_vendor_type');

    this.refreshOptions_vendor_type = (onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/bill/settings/options-vendor-type`,null,null,false).then(res=>{
          if(res.status_code ===200){
             let items = res.data;
             mThis.form_data.vendor_types = items;
             VSUtil.setComboItems(mThis.elVendorType,items,'id','vendor_type',null,null);
             if(typeof onFinish ==='function') onFinish(items); 
          }
        });
    }
   
    this.lnkAddVendorType.on('click',e=>{
         cv_interact.inputBox('New Vendor Type','Enter new name','text',null,{OKButtonText:'Add'}).then(d=>{
            if(d.isConfirmed && d.value){
                let p = {'name':d.value,'id':null};
                vsapi.call(`${main_view.base_url}/api/bill/settings/save-vendor-type`,p,null,false).then(res=>{
                    if(res.status_code ===200){
                       let d = res.data;
                       VSUtil.setComboItems(mThis.elVendorType,d.items,'id','vendor_type',null,null,null);
                       mThis.elVendorType.val(d.id).trigger('change');
                       mThis.form_data.vendor_types = d.items;  
                    }
                  });
            }
         });
    });
 
    this.formUntil = new FormUntil({
        "itemName": "Vendor",
        "formId": '_vdr_dlgVendors',
        "titleId": "_vdr_dlgVendors_title",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/vendor/save`,
        "apiGet": `${main_view.base_url}/api/vendor/details`,
        "modifyTitle": "Modify Vendor",
        "createTitle": "New Vendor",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => {},
        'init':()=>{
            mThis.refreshOptions_vendor_type();

            let se = new SimpleItemEditor({
                'label':'Enter new name',
                'title':'Vendor Type',
                'editLink':$('#_ven_lnk_edit_vendor_type'),
                'deleteLink':$('#_ven_lnk_delete_vendor_type'),
                'displayElement':mThis.elVendorType, /** diaplayElement must be a Select element **/
                'defaultValue':()=>{
                    return mThis.elVendorType.find('option:selected').text();
                },
                'api_delete':{
                    'data':()=>{
                        return {id:mThis.elVendorType.val()};
                    },
                    'endpoint':`${main_view.base_url}/api/bill/settings/delete-vendor-type`
                    ,'onItemDeleted':(item)=>{ 
                       mThis.refreshOptions_vendor_type();
                    }
                },
                'api_save':{
                    'endpoint':`${main_view.base_url}/api/bill/settings/save-vendor-type`
                    ,'onItemSaved':()=>{
                        let def_val = mThis.elVendorType.val();
                        mThis.refreshOptions_vendor_type(()=>{
                            mThis.elVendorType.val(def_val).trigger('change');
                        });
                    }
                }      
            });
            
        }
    });
 
    this.show = (options) => {
        VSUtil.setComboItems(mThis.elVendorType,mThis.form_data.vendor_types,'id','vendor_type',null,null);
        mThis.formUntil.show(options);
    }
}

window.addEventListener('DOMContentLoaded', e=>{
    VendorListComponent.init();
});