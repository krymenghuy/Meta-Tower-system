"use strict";
let ExchangeRateComponent = new function(){
    let mThis = this;
    this.title_prop = 'Exchange Rate';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_exchangeRateComponent');
    this.btnNew = $('#_ecr_btnNew');
    this.btnNew_details = $('#_ecr_btnNew_title');
    this.elSearchDate = $('#_ecr_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_ecr_tblexchangeRate');
    this.tblexchangeRate_detail = $('#_ecr_exchangeRate_details');
    // this.form_data = {};

    this.col_titles = {
        "Code":"Code",
        "Name":"Name",
        "Symbol":"Symbol",
        "Symbol After":"Symbol After",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'currencies',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displayexchangeRate();
                    }
                }
            };
            ExchangeRateDialog.show(op);
        });

        mThis.btnNew_details.on('click',(e)=>{
            e.preventDefault();
            let op = {
                onClose: (e)=>{
                    if(e){
                        mThis.displayexchangeRate();
                    }
                }
            };
            ExchangeRateDetailsDialog.show(op);
        });

        mThis.elSearchDate.on('change',(e)=>{
            e.preventDefault();
            mThis.displayexchangeRate();
        });

        mThis.tblItems.on('click','.btn_ecr_modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                     //do something on dialog closed
                     if(e){
                         mThis.displayexchangeRate();
                     }
                }
            };
            ExchangeRateDialog.show(op);
        });

        mThis.tblItems.on('click','.btn_ecr_delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this currency?`,{title:"Delete Currency",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/currency/delete`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displayexchangeRate();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.tblexchangeRate_detail.on('click','.btn_ecr_modify_details',(e)=>{
            let rate_id = $(this).data("id");
            let op = {
                id: rate_id,
                onClose:(e)=>{
                    if(e){
                        mThis.displayexchangeRate();
                    }
                }
            };
        });

        mThis.tblexchangeRate_detail.on('click','.btn_ecr_delete_details',(e)=>{
            let rate_id = $(this).data('id');
            cv_interact.confirm(`Delete this rate?`,{title:"Delete Rate",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":rate_id};
                    vsapi.call(`${main_view.base_url}/api/exchange-rate/delete`,p).then(res => {
                        if(res.status_code === 200){
                            mThis.displayexchangeRate();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        this.cfg = new ExpandableRowConfig('_ecr_tblexchangeRate', {
            'dontExpandByClickingOn': ['btn_patient_modify', 'btn_patient_delete', 'btn_patient_action'],
            'tr_dataset':['patient_id'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen': (container, detail_tr, parent_tr) => {
                //alert(detail_tr.find('ul').html());
                let q_tr = $(parent_tr);
                //It is IMPORTANT to access patient_id using jquery object here because the "createdRow" event passes data-id atttribue using jquery method
                let rate_id = q_tr.data('id');  
                //Show Expandable Details of each rate
                mThis.displayExchangeRateDetails($(detail_tr),rate_id);
            }
        });
    }

    this.displayExchangeRateDetails = (detail_tr, appt_id=0)=>{
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0"></div>');
        let p = {'id':cur_id,'search_value':mThis.elSearchDate.val()};
        window.vsapi.call(`${main_view.base_url}/api/currency/details`,p,'POST',false).then((res)=>{ 
          let html=null;
          if (res.status_code === 200){
            let d = StringSanitizer.sanitizeObject(res.data);
            html = `<div class="d-flex align-items-center">
                <div class="input-group flex-nowrap">
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="currencies.Search"></span>
                    </div>
                    <input data-select="datepicker" class="form-control" id="_ecr_search"/>
                </div>
            </div>
            <div class="table-responsive">
            <table class="table" id="_ecr_exchangeRate_details">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Buy Rate</th>
                    <th>Sell Rate</th>
                </tr>
            </thead>
            <tbody>`;
            d.map(currency => {
                html = [html,`<tr>
                    <td>${currency.date}</td>
                    <td>${currency.buy_rate}</td>
                    <td>${currency.sell_rate}</td>
                    <td>
                        <a href="javascript:void(0)" class="btn-cur-modify-details" data-id="${d.id}">
                            <i class="fa fa-edit"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-cur-delete-details" data-id="${d.id}">
                            <i class="fa fa-trash" style="color:red"></i>
                        </a>
                    </td>
                </tr>`].join('');
            });
            html = [html,`</tbody></table></div>`].join('');
          }
          else{
            html =`<div class="expanded-row-error">${error_message}</div>`;
          }

          div_wrapper.html(html);
        });
    }

    this.displayexchangeRate = (onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {};
        window.vsapi.call(`${mThis.base_url}/api/currency/list`,p,'POST',null).then((result)=>{
            let data = [];
            if(result.status_code === 200) data = result.data;
            if (mThis.table){
                mThis.tblItems.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data,null);
            let cnt = 1;
            //begin::Set up columns
            let my_columns = [
                {
                    title: mThis.trans_title("No"),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data:"code",
                    title: mThis.trans_title('Code')
                },
                {
                    title: mThis.trans_title('Name'),
                    data:"name"
                },
                {
                    title: mThis.trans_title('Symbol'),
                    data:"cur_symbol"
                },
                {
                    title: mThis.trans_title('Symbol After'),
                    data: "symbol_after"
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(data,a,b){
                        let status_class = null; //mThis.getStatusClass(data.status_id);
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn_co_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                        `<a href="javascript:void(0)" class="btn_ecr_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0)" data-id="${data.id}" class="btn_ecr_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                        `&nbsp;<a href="javascript:void(0)" data-id="${data.id}" class="btn_ecr_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                        `</div>`
                       ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');
            
            if (!mThis.table)
            mThis.table = mThis.tblItems.DataTable({
                searching:false,
                destroy:true,
                paging:true,
                ordering:false,
                //dom: 'Bfrtip',
                retrieve: true,
                //scrollY:390,
                //scrollX:500,
                //pagingType:'numbers',
                info:true,
                pageLength: 10,
                bLengthChange:false,
                saveState:true,
                'processing': true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...',
                    "emptyTable": LocaleManager.trans('No data to display','datatable')
                    },
                'data':data,
                'columns':my_columns,
                "createdRow": function(row, data, dataIndex){
                    cnt++;
                    let tr = $(row);
                    tr.data('id',data.id);
                }						
            });
            if(typeof onFinish ==='function') onFinish();                
        });     
    };

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        mThis.displayexchangeRate(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::ExchangeRateDialog
let ExchangeRateDialog = new function(){
    let mThis = this;
    this.self = $(`#_ecr_dlgexchangeRate`);

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Currency",
        "formId":'_ecr_dlgexchangeRate',
        "titleId":"_ecr_dlgexchangeRate_title",
        //"errorId":"_msl_dlgService_error",
        "saveButtonId":"_ecr_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/currency/save`,
        "apiGet":`${main_view.base_url}/api/currency/details`,
        //"identityProp":"id",
        //"modifyTitle":"Modify Product Group",
        "createTitle":"New Currency",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        'beforeShow': () => {}
        // "init": ()=>{
            
        //  }
    });

    this.show = (options)=>{
        mThis.formUntil.show(options);
    }
}
//end::ExchangeRateDialog

//begin::ExchangeRateDialogDetails
let ExchangeRateDetailsDialog = new function(){
    let mThis = this;
    this.self = $(`#_ecr_dlgExchangeRate_detail`);

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Currency Rate",
        "formId":'_ecr_dlgExchangeRate_detail',
        "titleId":"_ecr_dlgExchangeRate_detail_title",
        //"errorId":"_msl_dlgService_error",
        "saveButtonId":"_ecr_detail_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/exchange-rate/save`,
        "apiGet":`${main_view.base_url}/api/exchange-rate/details`,
        //"identityProp":"id",
        "modifyTitle":"Modify Currency Rate",
        "createTitle":"New Currency Rate",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        'beforeShow': () => {}
        // "init": ()=>{
            
        //  }
    });

    this.show = (options)=>{
        mThis.formUntil.show(options);
    }
}
//end::ExchangeRateDetailsDialog

$(document).ready(function() {
    ExchangeRateComponent.init();
});