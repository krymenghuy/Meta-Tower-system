"use strict";
let LaboPartnersComponent = new function () {
    let mThis = this;
    this.title_prop = 'Labo Partners';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_laboPartnersComponent');
    this.btnNew = $('#_lbp_btnNew');
    this.elSearchPartner = $('#_lbp_input_search');
    this.tblPartners = $('#_lbp_tblLaboPartners');
    this.form_data = {};

    this.col_titles = {
        "ID": "ID",
        "Name": "Name",
        "Name": "Name",
        "Email": "Email",
        "Phone": "Phone",
        "CP Name": "CP Name",
        "CP Phone": "CP Phone",
        "Partner Type": "Type",
        "Address": "Address",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop]);
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'partners', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.initExpandableRow =()=>{
        this.tblLaboTests = new ExpandableRowConfig('_lbp_tblLaboPartners', {
            'dontExpandByClickingOn': ['pn-add-test','btn_lbp_modify','btn_lbp_delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let partner_id = q_tr.data('id');
                let status_id = q_tr.data('statusid');
                if (partner_id > 0)
                LaboTestList.show($(container), {
                    'labo_id': partner_id,
                    'status_id':status_id
                });
            }
        });
    }

    this.init = () => {
        mThis.initExpandableRow();
        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displaylaboPartners();
                    }
                }
            };
            LaboPartnersDialog.show(op);
        });

        mThis.elSearchPartner.on('keyup', (e) => {
            e.preventDefault();
            if (e.keyCode === 13) { mThis.displaylaboPartners(); }
        });

        mThis.tblPartners.on('click', '.btn_lbp_modify', function (e) {
            e.preventDefault();
            let item_id = $(this).data('id');
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e)
                        mThis.displaylaboPartners();
                }
            };
            LaboPartnersDialog.show(op);
        });

        mThis.tblPartners.on('click', '.btn_lbp_delete', function (e) {
            e.preventDefault();
            let partner_id = $(this).data("id");
            cv_interact.confirm(`Delete this partner?`, { title: "Delete Partner", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": partner_id };
                    vsapi.call(`${main_view.base_url}/api/partner/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displaylaboPartners();
                        }
                        else
                            cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.displaylaboPartners = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchPartner.val() };
        window.vsapi.call(`${mThis.base_url}/api/partner/list`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblPartners.DataTable().clear().destroy();
                mThis.tblPartners.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null, ["cp_email", "email"]);
            let cnt = 1;
            let my_columns = [
                {
                    title: mThis.trans_title("ID"),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data: "name",
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Email'),
                    data: "email"
                },
                {
                    title: mThis.trans_title('Phone'),
                    data: "phone_number"
                },
                {
                    title: mThis.trans_title('CP Name'),
                    data: "cp_name"
                },
                {
                    title: mThis.trans_title('CP Phone'),
                    data: "cp_phone_number"
                },
                {
                    title: mThis.trans_title('Partner Type'),
                    data: "partner_type"
                },
                {
                    title: mThis.trans_title('Address'),
                    data: (data,a,b)=>{
                        return data.address ? data.address:'(Address not available)';
                    }
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (data, a, b) {
                        return [`<div class="d-flex flex-row flex-nowrap">`,
                            `<a href="javascript:void(0)" class="pn-add-test" data-id="${data.id}"><i class="fa fa-plus-circle"></i></a> &nbsp;`,
                            `<a href="javascript:void(0)" class="btn_lbp_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_lbp_delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblPartners.DataTable({
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
                        tr.data('statusid', data.status_id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;
        mThis.displaylaboPartners(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let LaboPartnersDialog = new function () {
    let mThis = this;
    this.self = $(`#_lbp_dlgPartners`);

    this.formUntil = new FormUntil({
        "itemName": "Partner",
        "formId": '_lbp_dlgPartners',
        "titleId": "_lbp_dlgPartners_title",
        "saveButtonId": "_lbp_btnSave",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/partner/save`,
        "apiGet": `${main_view.base_url}/api/partner/details`,
        "modifyTitle": "Modify Parnter",
        "createTitle": "New Partner",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": ["cp_email", "email"],
        'use_alert_error': true,
        'beforeShow': () => { }
    });

    this.show = (options) => {
        mThis.formUntil.show(options);
    }
}

const LaboTestList = new function(){
   let mThis = this;
   LaboPartnersComponent.tblPartners.on('click','.pn-add-test',function(e){
     let labo_id =$(this).data('id');
     
     let container = $(this).closest('div.expandable-row-container');
     if (container.length === 0){
        let tr = $(this).closest('tr');
        container = tr.next().find('div.expandable-row-container');
     }
     let op = {'labo_id':labo_id,onClose:(items)=>{
        if(items){
            LaboTestList.displayTestList(labo_id,container,items);
        }
     }};

     SelectTestDialog.show(op);
   });

   LaboPartnersComponent.tblPartners.on('click','.btn-remove-parnter-test',function(e){
    let labo_id =$(this).data('laboid');
    let test_id =$(this).data('testid');
    let id = $(this).data('id');
    let container = $(this).closest('div.expandable-row-container');
    cv_interact.confirm(`Remove this test?`,{title:'Remove Partner Test','context':'delete'},(e)=>{
        if(e){
            let p = {'labo_id':labo_id,'test_id':test_id,'id':id};
            vsapi.call(`${main_view.base_url}/api/partner-labo/remove-test`,p,null,false).then(res=>{
                if(res.status_code === 200){
                    LaboTestList.displayTestList(labo_id,container,res.data);
                }
            });
        }
    });
  });

   this.show = (container,options)=>{
      let labo_id = options.labo_id;
      let div_test_list_id = `pn_test_list_${labo_id}`;
      let div_test_list = container.find(`#${div_test_list_id}`);

      let p = {'labo_id':labo_id};
       vsapi.call(`${main_view.base_url}/api/partner-labo/tests`,p,null,false).then(res=>{
          if(res.status_code===200){
                let items = res.data;
                mThis.displayTestList(labo_id,container,items);
                LaboPartnersComponent.tblPartners.find('.card-height:first-child').each(function(){
                    $(this).siblings('button').css({
                        height: $(this).height()/3,
                        width: $(this).height()/3
                    }).addClass('rounded-circle').children().addClass('fs-5');
                });
          }else{
            div_test_list.html(`<span class="text-center text-warning">${res.error_message}</span>`);
          }
       });
   }
 
   this.displayTestList = (labo_id,container,items=[])=>{
        let cnt=0;
        let html_tests = null;;
        items.map(i=>{
            let c = ExchangeManager.currencies[i.currency_code];
            let cur_symbol = c ? c.symbol:'$';
            let price = [cur_symbol,i.price].join('');
            html_tests =[html_tests,`<div data-id="${i.id}" data-testid="${i.test_id}" class="pn-test-item card-height">
                <div class="border border-1 rounded-2 position-relative">
                    <div class="border border-1 p-2">
                        <h5 class="card-title text-uppercase fw-semibold align-middle">${i.name}</h5>
                    </div>
                    <div class="py-3">
                        <span class="d-block text-center fw-bold">${price}</span>
                    </div>
                    <div class="position-relative">
                        <a data-id="${i.id}" data-testid="${i.test_id}" data-laboid="${i.labo_id}" class="btn-remove-parnter-test" href="javascript:void(0)">
                            <i class="fa fa-times vs-text-danger"></i>
                        </a>
                    </div>
                </div>
            </div>`].join('');
            cnt++;
        });

        html_tests = [html_tests,`<button data-id="${labo_id}" class="pn-add-test border border-primary btn btn-primary p-2">
            <i class="fa fa-solid fa-plus pe-0"></i>
        </button>`].join('');
        let div_test_list_id = `pn_test_list_${labo_id}`;
        let div_test_list = container.find(`#${div_test_list_id}`);
 
        let empty_html =`<button data-id="${labo_id}" class="pn-add-test border border-primary btn btn-primary p-2 height-button">
            <i class="fa fa-solid fa-plus pe-0"></i>
        </button>`;

        if (cnt === 0) html_tests = empty_html;

        if (div_test_list.length >0){
            div_test_list.html(html_tests);
            return;
        }

        html_tests = [`<div id="${div_test_list_id}" class="labo-test-list-container">`,html_tests,`</div>`].join('');
        if (cnt > 0) 
            container.html(html_tests);
        else {
            container.html(empty_html);
        }
   }
}

const SelectTestDialog = new function(){
   let mThis = this;
   this.self = $('#_lbp_dlgTestSelector');
   this.elTest = $('#_lbp_test');
   this.elPrice = $('#_lbp_test_price');
   this.btnOK = $('#_lbp_dlgTestSelector_btnOK');
   
    this.btnOK.on('click',(e)=>{
        e.preventDefault();
        let p = {
            'labo_id':mThis.labo_id,
            'test_id':mThis.elTest.val(),
            'price':mThis.elPrice.val()
        }
        vsapi.call(`${main_view.base_url}/api/partner-labo/add-test`,p,null,false).then(res =>{
            if(res.status_code===200){
                let items =StringSanitizer.sanitizeObject(res.data);
                if(typeof mThis.onClose === 'function') mThis.onClose(items);
                mThis.self.modal('hide');
            }
            else cv_interact.error(res.error_message);
        });     
    });

    this.loadTests =(onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/settings/options-labo-test`,null,null,false).then(res=>{
            onFinish(res.data);
        });
    }

   this.show =(options)=>{
        mThis.labo_id = options.labo_id;
        mThis.onClose = options.onClose;
        mThis.loadTests((tests)=>{
            VSUtil.setComboItems(mThis.elTest,tests,'id','test_name',false,false,null);
            mThis.self.modal({
                backdrop:'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',function (e) {
    LaboPartnersComponent.init();
});