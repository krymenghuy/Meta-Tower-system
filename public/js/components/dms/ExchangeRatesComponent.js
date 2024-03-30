"use strict";
var ExchangeRatesComponent = new function(){
    let mThis = this;
    this.title_prop = "Exchange Rates";
    this.base_url =main_view.base_url;
    this.self = main_view.appContent.children('#_main_exchangeRatesComponent');
    this.title_prop = "Exchange Rate";
    this.btnNew = this.self.find('#_ecr_btnNew');
    this.tblRate = this.self.find('#tbl_ecr_exchangeRate');
    this.filter_month = this.self.find('#_ecr_list_select');
    this.filter_pair = this.self.find('#_ecr_list_pair');
    this.btnNew_Currency = this.self.find('#_ecr_currency');

    this.loadFilter_options_month = ()=>{
        vsapi.call(`${mThis.base_url}/api/currency/options-month`,null,false).then(res=>{
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
                //let def = mThis.filter_month.val();
                latest_mnonth = latest_mnonth || mThis.filter_month.val();
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
                vsapi.call(`${mThis.base_url}/api/currency/create-currency-pair`,p).then(res => {
                    if(res.status_code === 200){
                         //here
                    }
                });
            });
        });

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let cur_pair = mThis.filter_pair.find('option:selected').text();
            let op = {
                'id': null,
                "onClose":(e) => {
                    if(e){
                        mThis.loadFilter_options_month();
                        //mThis.displayExchangeRate();
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

        mThis.tblRate.on('click',e=>{
            e.preventDefault();

            //Click on Edit
            let btn = VSUtil.getElementByClass(e.target,'btn-ecr-modify');
            if(btn){
                let cur_pair = mThis.filter_pair.find('option:selected').text();
                let op = {
                    id: btn.dataset.id,
                    'currency_pair':cur_pair,
                    'onClose': (e) => {
                        if(e){
                            mThis.displayExchangeRate();
                        }
                    }
                };
                ExchangeRatesDialog.show(op);
                return;
            }

            //Click on Delete
            btn = VSUtil.getElementByClass(e.target,'btn-ecr-delete');
            if(btn){
                let  p ={id: btn.dataset.id};
                cv_interact.confirm('Delete this exchange rate?',{title:'delete rate',context:'delete'},e => {
                    if(e){
                        vsapi.call(`${mThis.base_url}/api/currency/delete-exchange-rate`,p).then(res => {
                            if(res.status_code === 200){
                                mThis.displayExchangeRate();
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
                return;
            }

            //Click on Apply Exhange Rate
            btn = VSUtil.getElementByClass(e.target,'btn-ecr-apply');
            if(btn){
                const x_date = btn.closest('tr').querySelector('td.x-date').textContent;
                const buy_rate = btn.closest('tr').querySelector('td.buy-rate').textContent;
                cv_interact.confirm(['ច្បាស់ឬអត់? ដាក់អត្រាប្តូរប្រាក់ ',buy_rate,' សំរាប់រាល់ទំនិញមកដល់ថ្ងៃ ',x_date,'?'].join(''),{context:'update','title':'Apply Exchange Rate'},e=>{
                    if(e){
                       let p = {'id':btn.dataset.id};
                       vsapi.call(`${main_view.base_url}/api/currency/apply-exchange-rate`,p,null).then(res=>{
                          if(res.status_code === 200){
                           let d = res.data;   
                           cv_interact.success(['Exchange rate ',d.buy_rate,' is applied to ',d.affected_count,' packages arrived on ',d.x_date].join(''));
                          }else cv_interact.warning(res.error_message);
                       });
                    }
                 });
                 return;
            }
          
        });
    }

    this.displayExchangeRate = () => {
        let p = {'x_month':mThis.filter_month.val(),'currency_pair':mThis.filter_pair.val()};
        vsapi.call(`${mThis.base_url}/api/currency/exchange-rate-list`,p).then(res => {
            if(mThis.table){
                mThis.tblRate.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblRate.empty();
                //alert('destroyed => '+  mThis.tblPackages.html());
                mThis.table = null;
            }

            let data = StringSanitizer.sanitizeObject(res.data,'',['x_date']);

            let cols = [{
                className:"x-date",
                title: "Date",
                data: "x_date",
                ordering: true,
            },
            {
                className:"currency-pair",
                title: "Currency Pair",
                data: "currency_pair"
                //,ordering: true
            },
            {
                className:"buy-rate",
                title: "Buy Rate",
                data: "buy_rate"
            },
            {
                className:"sell-rate",
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
                        <a data-id="${data.id}" href="javascript:void(0)" class="btn-ecr-apply btn btn-sm btn-primary">
                         Apply
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
        mThis.self.siblings().hide();
        mThis.self.fadeIn(200);
        main_view.setTitle(mThis.title_prop);
    }
}

const ExchangeRatesDialog = new function(){
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_ecr_dlgExchangeRate');
    this.elCurrencyPair = this.self.find('#_ecr_currency_pair');
    
    //this.init = () => {}

    this.formUtil = new FormUntil({
        "itemName":"Exchange Rate",
        "formId":'_ecr_dlgExchangeRate',
        //"titleId":"_apl_dlgAppt_title",
        //"errorId":"_apl_dlgAppt_error",
        //"saveButtonId":"_ecr_dlgExchangeRate_btnSave",
        "instance":this,
        "apiSave":`${mThis.base_url}/api/currency/save-exchange-rate`,
        "apiGet":`${mThis.base_url}/api/currency/exchange-rate-info`,
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