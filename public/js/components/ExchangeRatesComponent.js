"use strict";
let ExchangeRatesComponent = new function(){
    let mThis = this;
    this.title_prop = "Exchange Rates";
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_exchangeRatesComponent');
    this.title_prop = "Exchange Rate";
    this.btnNew = $('#_ecr_btnNew');
    this.tblRate = $('#tbl_ecr_exchangeRate');
    this.filter_month = $('#_ecr_list_select');
    this.filter_pair = $('#_ecr_list_pair');
    this.btnNew_Currency = $('#_ecr_currency');

    this.loadFilter_options_month = ()=>{
        vsapi.call(`${mThis.base_url}/api/x-rate/options-month`,null).then(res=>{
            if(res.status_code===200){
                let items = res.data;
                let latest_mnonth = null; // (items || []).first().year_month;
                let items1 = [];
                (items || []).map(m=>{
                    let sts = (m.year_month+'').split('.');
                    let xYear = sts[0];
                    let x_month = DateHelper.getMonthName(sts[1]);
                    let year_month_name = [x_month,' (',xYear,')'].join(''); 
                    items1.push({"year_month":m.year_month,"year_month_name":year_month_name});        
                }); 
                VSUtil.setComboItems(mThis.filter_month,items1,'year_month','year_month_name',false,'(Select month)',latest_mnonth); 
            }
        });
    }

    this.init = () => {
        mThis.btnNew_Currency.on('click',function(e){
            e.preventDefault();
            let op = {
                title: "New Currency",
                label: "Currency"
            };

            InputBox1.show(op,(d)=>{
                let p = {'currency_pair':d};
                vsapi.call(`${mThis.base_url}/api/x-rate/create-currency-pair`,p).then(res => {
                    if(res.status_code === 200){
                    }
                });
            });
        });

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let cur_pair = mThis.filter_pair.find('option:selected').text();
            let op = {
                'id': 0,
                "onClose":(e) => {
                    if(e){
                        mThis.displayExchangeRate();
                    }
                },
                "currency_pair":cur_pair
            };
            ExchangeRatesDialog.show(op);
        });

        mThis.filter_month.on('change',function(e){
            e.preventDefault();
            mThis.displayExchangeRate();
        });

        mThis.filter_pair.on('change',function(e){
            e.preventDefault();
            mThis.displayExchangeRate();
        });

        mThis.tblRate.on('click','.btn-ecr-modify',function(e){
            e.preventDefault();
            let cur_pair = mThis.filter_pair.find('option:selected').text();
            let op = {
                id: $(this).data('id'),
                'currency_pair':cur_pair,
                'onClose': (e) => {
                    if(e){
                        mThis.displayExchangeRate();
                    }
                }
            };
            ExchangeRatesDialog.show(op);
        });
        
        mThis.tblRate.on('click','.btn-ecr-delete',function(e){
            e.preventDefault();
            let  p ={id: $(this).data('id')};
            cv_interact.confirm('Delete this exchange rate?',{title:'delete rate',context:'delete'},e => {
                if(e){
                    vsapi.call(`${mThis.base_url}/api/x-rate/delete`,p).then(res => {
                        if(res.status_code === 200){
                            mThis.displayExchangeRate();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });
    }

    this.displayExchangeRate = () => {
        let p = {'x_month':mThis.filter_month.val(),'currency_pair':mThis.filter_pair.val()};
        vsapi.call(`${mThis.base_url}/api/x-rate/list`,p).then(res => {
            if(mThis.table){
                mThis.tblRate.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblRate.empty();
                //alert('destroyed => '+  mThis.tblPackages.html());
                mThis.table = null;
            }

            let data = StringSanitizer.sanitizeObject(res.data);

            let cols = [{
                title: "Date",
                data: "x_date",
                ordering: true,
            },
            {
                title: "Currency Pair",
                data: "currency_pair"
                //,ordering: true
            },
            {
                title: "Buy Rate",
                data: "buy_rate"
            },
            {
                title: "Sell Rate",
                data: "sell_rate"
            },
            {
                title: "Action",
                data: function(data,a,b){
                    let html = [`<div class="d-flex align-items-center gap-2">
                        <a data-id="${data.id}" href="javascript:void(0)" class="btn-ecr-modify">
                            <i class="fa-regular fa-pen-to-square text-warning"></i>
                        </a>
                        <a data-id="${data.id}" href="javascript:void(0)" class="btn-ecr-delete">
                            <i class="fa-solid fa-trash-can text-danger"></i>
                        </a>
                    </div>`].join('');
    
                    return html;
                }
            }];
    
            if(!mThis.table){
                mThis.table = mThis.tblRate.DataTable({
                    searching:false,
                    destroy:true,
                    paging:true,
                    retrieve: true,
                    //scrollY:390,
                    //scrollX:500,
                    //pagingType:'numbers',
                    info:true,
                    bLengthChange:false,
                    saveState:true,
                    'processing': false,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": "No data to display"
                    },
                    data: data,
                    columns: cols
                    ,"createdRow": function(row, data, dataIndex){
                        let tr = $(row);
                        tr.data('id',data.id);   
                    }
                });
            }
        });
    }

    this.show = (option) => {
        mThis.loadFilter_options_month();
        mThis.displayExchangeRate();
        mThis.self.show().siblings().hide();
        main_view.setTitle(mThis.title_prop);
    }
}

let ExchangeRatesDialog = new function(){
    let mThis = this;
    this.self = $('#_ecr_dlgExchangeRate');
    this.elCurrencyPair = $('#_ecr_currency_pair');
    
    //this.init = () => {}

    this.formUtil = new FormUntil({
        "itemName":"Exchange Rate",
        "formId":'_ecr_dlgExchangeRate',
        //"titleId":"_apl_dlgAppt_title",
        //"errorId":"_apl_dlgAppt_error",
        //"saveButtonId":"_ecr_dlgExchangeRate_btnSave",
        "instance":this,
        "apiSave":`${main_view.base_url}/api/x-rate/save`,
        "apiGet":`${main_view.base_url}/api/x-rate/info`,
        //"identityProp":"id",
        "modifyTitle":"Modify Exchange Rate",
        "createTitle":"New Exchange Rate",
        "identityProps":['id'],
        //Set additional data props for getFormData() to collect on gathering data inputs from this form,
        // "form_data_props":['lead_id','client_id'],
        // "sub_prop":"chief_complaint_items",
        // "sub_prop_function":mThis.getChiefComplaints,
        // "sanitize_excepts":['email','client_email','arrival_time'],
         'use_alert_error':true,
        // "init":""
    });

    this.show = (option) => {
        mThis.elCurrencyPair.html(option.currency_pair);
        mThis.formUtil.show(option);
    }
}

window.addEventListener('DOMContentLoaded',()=>{
    ExchangeRatesComponent.init();
});