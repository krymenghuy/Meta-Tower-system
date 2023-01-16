"use strict";
let PatientInvoicesComponent = new function(){
    let mThis = this;
    this.title_prop = 'Patient Invoices';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_patientInvoicesComponent');
    this.btnNew = $('#_pic_btnNew');
    this.elSearchItem = $('#_pic_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = $('#_pic_tblInvoice');
    // this.form_data = {};

    this.col_titles = {
        "No.":"No.",
        "Invoice Number":"Invoice Number",
        "Patient":"Patient",
        "Invoice Date":"Invoice Date",
        "Due Date":"Due Date",
        "Amount":"Amount",
        "Paid":"Paid",
        "Status":"Status"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'patients',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displaypatientInvoices();
                    }
                }
            };
            PatientInvoicesDialog.show(op);
        });

        mThis.elSearchItem.on('keyup',(e)=>{
            if(e.keyCode === 13) mThis.displaypatientInvoices();
        });
    }

    this.displaypatientInvoices =(onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchItem.val()};
        window.vsapi.call(`${mThis.base_url}/api/inventory/items`,p,'POST',null).then((result)=>{
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
                    title: mThis.trans_title("No."),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data:"invoice_number",
                    title: mThis.trans_title('Invoice Number')
                },
                {
                    title: mThis.trans_title('Patient'),
                    data:"patient"
                },
                {
                    title: mThis.trans_title('Invoice Date'),
                    data:"invoice_date"
                },
                {
                    title: mThis.trans_title('Due Date'),
                    data:"due_date"
                },
                {
                    title: mThis.trans_title('Amount'),
                    data:"amount"
                },
                {
                    title: mThis.trans_title('Paid'),
                    data:"paid"
                },
                {
                    title: mThis.trans_title('Status'),
                    data:"status"
                },
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
        mThis.displaypatientInvoices(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::MedicalServiceDialog
let PatientInvoicesDialog = new function(){
    let mThis = this;
    this.self = $(`#_pic_dlgInvoice`);

    mThis.columns = [
        {
            "name": "name",
            "title": "Item Name",
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
            "name": "qty",
            "title": "Qty",
            "dataType": "number",
            "displayType": "input"
        },
        {
            "name":"price",
            "title":"Price",
            "dataType":"number",
            "displayType":"input"
        },
        {
            "name":"discount",
            "title":"Discount(%)",
            "dataType":"number",
            "displayType":"input"
        }
    ];

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Patient Invoices",
        "formId":'_pic_dlgInvoice',
        "titleId":"_pic_dlgInvoice-title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/inventory/save-item`,
        //"apiGet":`${main_view.base_url}/api/inventory/details-item`,
        //"identityProp":"id",
        //"modifyTitle":"Modify Product Group",
        "createTitle":"New Invoice",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        // 'beforeShow': () => {}
        "init": ()=>{
            let  itemConfig = new ItemsView('_pic_panel',{
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
//end::MedicalServiceDialog

$(document).ready(function() {
    PatientInvoicesComponent.init();
});