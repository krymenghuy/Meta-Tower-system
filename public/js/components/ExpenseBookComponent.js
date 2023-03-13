"use strict";
let ExpenseBookComponent = new function(){
    let mThis = this;
    this.title_prop = 'Expense Book';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_expenseBookComponent');
    this.btnNew = $('#_epb_btnNew');
    this.elSearchPartner = $('#_epb_input_search');
    this.tblPartners = $('#_epb_tblExpenseBook');
    // this.form_data = {};

    this.col_titles = {
        "No":"No",
        "Date":"Date",
        "Pay To":"Pay To",
        "Amount":"Amount",
        "Phone":"Phone",
        "Payment Account":"Payment Account",
        "Payment Method":"Payment Method",
        "Ref. Number":"Ref. Number",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'expenses',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displayExpenses();
                    }
                }
            };
            ExpenseBookDialog.show(op);
        });

        mThis.elSearchPartner.on('keyup',(e)=>{
            e.preventDefault();
            if(e.keyCode === 13) mThis.displayExpenses();
        });

        mThis.tblPartners.on('click','.btn_epb_modify',function(e){
            e.preventDefault();
            let expense_id = $(this).data('id');
            let op = {
                id: expense_id,
                onClose:(e)=>{
                    if(e)
                        mThis.displayExpenses();
                }
            };
            ExpenseBookDialog.show(op);
        });

        mThis.tblPartners.on('click','.btn_epb_delete',function(e){
            e.preventDefault();
            let expense_id = $(this).data("id");
            cv_interact.confirm(`Delete this Expense?`,{title:"Delete Expense",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":expense_id};
                    vsapi.call(`${main_view.base_url}/api/partner/delete`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displayExpenses();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.displayExpenses = (onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchPartner.val()};
        window.vsapi.call(`${mThis.base_url}/api/partner/list`,p,'POST',null).then((result)=>{
            let data = [];
            if(result.status_code === 200) data = result.data;
            //console.log(JSON.stringify(data));
            if (mThis.table){
                mThis.tblPartners.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblPartners.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data,null,["cp_email","email"]);
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
                    data:"date",
                    title: mThis.trans_title('Date')
                },
                {
                    title: mThis.trans_title('Pay To'),
                    data:"pay_to"
                },
                {
                    title: mThis.trans_title('Amount'),
                    data: "amount"
                },
                {
                    title: mThis.trans_title('Payment Account'),
                    data: "payment_account"
                },
                {
                    title: mThis.trans_title('Payment Method'),
                    data: "payment_method"
                },
                {
                    title: mThis.trans_title('Ref. Number'),
                    data: "ref_number"
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(data,a,b){
                        let status_class = null; //mThis.getStatusClass(data.status_id);
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn_lbp_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                        `<a href="javascript:void(0)" class="btn_lbp_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0);" data-id="${data.id}" class="btn_lbp_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                        `&nbsp;<a href="#" data-id="${data.id}" class="btn_lbp_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                        `</div>`
                       ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');
            
            if (!mThis.table)
            mThis.table = mThis.tblPartners.DataTable({
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
            if(typeof onFinish === 'function') onFinish();                
        });     
    };

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        mThis.displayExpenses(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::ExpenseBookDialog
let ExpenseBookDialog = new function(){
    let mThis = this;
    this.self = $(`#_epb_dlgExpenseBook`);

    mThis.columns = [
        {
            "name": "name",
            "title": "Category",
            "dataType": "string",
            "displayType": "select",
            "cssClass": "",
            //"selectOptions":[] 
        },
        {
            "name": "description",
            "title": "Description",
            "dataType": "string",
            "displayType": "input",
            // "data":(value,row)=>{
            //     return "";
            // }
        },
        {
            "name": "amount",
            "title": "Amount",
            "dataType": "number",
            "displayType": "input"
        }
    ];

    //ExpenseBookDialog
    this.formUntil = new FormUntil({
        "itemName":"Expense Book",
        "formId":'_epb_dlgExpenseBook',
        "titleId":"_epb_dlgExpenseBook_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_epb_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/partner/save`,
        "apiGet":`${main_view.base_url}/api/partner/details`,
        //"identityProp":"id",
        "modifyTitle":"Modify Expense Book",
        "createTitle":"New Expense Book",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":["cp_email","email"],
        'use_alert_error':true,
        // 'beforeShow': () => {}
        "init": ()=>{
            let  itemConfig = new ItemsView('_epb_panel',{
                columns: mThis.columns,
                "showColumnHeaders":true,
                "showAddLineButton":true
            });
         }
    });

    this.show = (options)=>{
        mThis.formUntil.show(options);
    }
}
//end::ExpenseBookDialog

$(document).ready(function() {
    ExpenseBookComponent.init();
});