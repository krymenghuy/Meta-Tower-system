"use strict";
let LaboPartnersComponent = new function(){
    let mThis = this;
    this.title_prop = 'Labo Partners';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_laboPartnersComponent');
    this.btnNew = $('#_lbp_btnNew');
    this.elSearchPartner = $('#_lbp_input_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblPartners = $('#_lbp_tblLaboPartners');
    // this.form_data = {};

    this.col_titles = {
        "ID":"ID",
        "Name":"Name",
        "Name":"Name",
        "Email":"Email",
        "Phone":"Phone",
        "CP Name":"CP Name",
        "CP Phone":"CP Phone",
        "Partner Type":"Partner Type",
        "Address":"Address",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'partners',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displaylaboPartners();
                    }
                }
            };
            LaboPartnersDialog.show(op);
        });

        mThis.elSearchPartner.on('keyup',(e)=>{
            e.preventDefault();
            if(e.keyCode === 13) {mThis.displaylaboPartners();}
        });

        mThis.tblPartners.on('click','.btn_lbp_modify',function(e){
            e.preventDefault();
            let item_id = $(this).data('id');
            let op = {
                id: item_id,
                onClose:(e)=>{
                    if(e)
                        mThis.displaylaboPartners();
                }
            };
            LaboPartnersDialog.show(op);
        });

        mThis.tblPartners.on('click','.btn_lbp_delete',function(e){
            e.preventDefault();
            let partner_id = $(this).data("id");
            cv_interact.confirm(`Delete this partner?`,{title:"Delete Partner",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":partner_id};
                    vsapi.call(`${main_view.base_url}/api/partner/delete`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displaylaboPartners();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.displaylaboPartners = (onFinish=null)=>
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
                    title: mThis.trans_title("ID"),
                    data: () => {
                        return cnt;
                    }
                },
                {
                    data:"name",
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Email'),
                    data:"email"
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
                    data: "address"
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
        mThis.displaylaboPartners(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::LaboPartnersDialog
let LaboPartnersDialog = new function(){
    let mThis = this;
    this.self = $(`#_lbp_dlgPartners`);

    //AppointmentDialog
    this.formUntil = new FormUntil({
        "itemName":"Partner",
        "formId":'_lbp_dlgPartners',
        "titleId":"_lbp_dlgPartners_title",
        //"errorId":"_msl_dlgService_error",
        "saveButtonId":"_lbp_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/partner/save`,
        "apiGet":`${main_view.base_url}/api/partner/details`,
        //"identityProp":"id",
        "modifyTitle":"Modify Product Group",
        "createTitle":"New Partner",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":["cp_email","email"],
        'use_alert_error':true,
        'beforeShow': () => {}
        // "init": ()=>{
        //  }
    });

    this.show = (options)=>{
        mThis.formUntil.show(options);
    }
}
//end::LaboPartnersDialog

$(document).ready(function() {
    LaboPartnersComponent.init();
});