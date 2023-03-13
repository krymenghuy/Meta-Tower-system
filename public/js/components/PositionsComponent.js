"use strict";
let PositionsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Positions';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_positionsComponent');
    this.btnNew = $('#_pos_btnNew');
    this.elSearchItem = $('#_pos_search');
    this.tblPosition = $('#_pos_tblPosition');
    this.form_data = {};

    this.col_titles = {
        "No":"No",
        "Position":"Position",
        "Department":"Department",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'employees',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.displaypositions();
                    }
                }
            };
            PositionsDialog.show(op);
        });

        mThis.elSearchItem.on('keyup',(e)=>{
            if(e.keyCode === 13) mThis.displaypositions();
        });

        mThis.tblPosition.on('click','.btn-pos-modify',(e)=>{
            e.preventDefault();
            let position_id = $(this).data('id');
            let op = {
                id: position_id,
                onClose:(e)=>{
                    if(e)
                        mThis.displaypositions();
                }
            };
            PositionsDialog.show(op);
        });

        mThis.tblPosition.on('click','.btn-pos-delete',(e)=>{
            e.preventDefault();
            let position_id = $(this).data("id");
            cv_interact.confirm(`Delete this Position?`,{title:"Delete Position",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":position_id};
                    vsapi.call(`${main_view.base_url}/api/position/delete`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.displaypositions();
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });
    }

    this.displaypositions = (onFinish=null)=>
    { 
        //Initialize language for DataTable columns headers
        //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
        //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        mThis.setLanguage();
        let p = {'search_value':mThis.elSearchItem.val()};
        window.vsapi.call(`${mThis.base_url}/api/position/list`,p,'POST',null).then((result)=>{
            let data = [];
            if(result.status_code === 200) data = result.data;
            if (mThis.table){
                mThis.tblPosition.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblPosition.empty();
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
                    data:"position",
                    title: mThis.trans_title('Position')
                },
                {
                    title: mThis.trans_title('Department'),
                    data:"department"
                },
                {
                    title:mThis.trans_title('Action'),
                    data: function(data,a,b){
                        let status_class = null; //mThis.getStatusClass(data.status_id);
                        return [`<div class="form-inline">`,
                        `<a href="javascript:void(0)" class="btn_pos_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                        `<a href="javascript:void(0)" class="btn_pos_modify" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                        `<a href="javascript:void(0);" data-id="${data.id}" class="btn_pos_delete"><i class="fa-solid fa-trash-can text-danger"></i></i></a>`,
                        `&nbsp;<a href="#" data-id="${data.id}" class="btn_pos_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                        `</div>`
                       ].join('');
                    }
                }
            ];
            //END Define colum

            //translate column names
            //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');
            
            if (!mThis.table)
            mThis.table = mThis.tblPosition.DataTable({
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
        mThis.displaypositions(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let PositionsDialog = new function(){
    let mThis = this;
    this.self = $(`#_pos_dlgPosition`);

    this.formUntil = new FormUntil({
        "itemName":"Position",
        "formId":'_pos_dlgPosition',
        "titleId":"_pos_dlgPosition_title",
        //"errorId":"_msl_dlgService_error",
        //"saveButtonId":"_msl_dlgService_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/position/save`,
        "apiGet":`${main_view.base_url}/api/position/list`,
        //"identityProp":"id",
        "modifyTitle":"Modify Position",
        "createTitle":"New Position",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        "form_data_props":['id'],
        //"sub_prop":"chief_complaint_items",
        //"sub_prop_function":mThis.getChiefComplaints,
        "sanitize_excepts":[],
        'use_alert_error':true,
        'beforeShow': () => {}
    });

    this.show = (options)=>{
        mThis.formUntil.show(options);
    }
}

$(document).ready(function() {
    PositionsComponent.init();
});