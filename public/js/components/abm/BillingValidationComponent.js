'use strict';

var BillingValidationComponent = new function () {
    const mThis = this;
    this.title_prop = "Billing Validation";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_billingValidationComponent');
    this.elFilter_shipment_no = this.self.find('#_select_shipment_No');
    this.div_filter_fields = mThis.self.find('#_sdl_filter_fields')[0];
    this.btnRefress = this.self.find('#_pl_btnRefress');
    this.btnPaymany = this.self.find('#_btn_pay_many');
    this.btnUploard = this.self[0].querySelector('#com_btn_uploard_file');

    let selectedFile;
    this.self[0].querySelector("#excel").addEventListener("change", (event) => {
        selectedFile = event.target.files[0];
        console.log(selectedFile);
        if(selectedFile){
            let message = 'alert';
            AlertMesageDialog.show(message);
        }
    });
    this.btnUploard.addEventListener("click", (e) => {
        e.preventDefault();
        let fileReader = new FileReader();
        if(!selectedFile) {
            alert('Not yet select file.');
            return ;
        }
        fileReader.readAsBinaryString(selectedFile);
        if(!fileReader) {
            alert('File error!');
            return;
        }
        fileReader.onload = (event) => { 
            let fileData = event.target.result;
            console.log('file',btoa(fileData));
            let p = {'file':btoa(fileData)};
            console.log(1,p);
            if(!p.file) return; 
            vsapi.call(`${main_view.base_url}/abm/oversea_shipments/import`,p,null,null,false).then(res =>{
                console.log('data',res);
                if(res.status_code ===200){
                    console.log('data',res.data);
                    let p = { "count" : res.data.match_count,"session_id" : res.data.session_id }
                    AlertMesageDialog.show('saved');
                    // cv_interact.success('File saved and Validated');    
                    BillingValidationComponent.billValidationListView.showPage(p); 
                }
                else{
                    AlertMesageDialog.show(res.error_message,res.data);
                } 
            });
           
        };
    });


    // this.btnUploard.addEventListener('click',function(e) {
    //     e.preventDefault();
    //     FileChooser.chooseFile(null,d=>{
    //         console.log('d',d);
    //          if(d){
    //             console.log('d',d);
    //              mThis.imgLogo.prop('src',d.dataUrl);
    //              let p = {'photo_data':d.dataUrl,'file_type':d.file_type};
    //              vsapi.call(`${mThis.base_url}/dms/company/save-logo`,p,null,false).then(res=>{
    //                  if(res.status_code ===200){
    //                      let d = res.data;
    //                      mThis.imgLogo.prop('src',d.logo_url);
    //                      cv_interact.success('Logo has been saved');
    //                  }else cv_interact.warning(res.error_message);
    //              });
    //          }
    //     }); 
    // });

    this.init= () => {
        if(mThis.initAlready) return;
        
        this.cols = [
            
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.code||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'Waybill No.'
            },

            {
                className: "Shipment Date",
                data: function (data, index, tr) {
                    return ['<span class="sender-name d-block">', data.create_date||"NA", '</span>'].join('');
                },
                title: 'Shipment Date'
                // title: mThis.trans('Created Date')
            },
            {
                className: "to_country",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.to_country||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'Dest Country'
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.item_type||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'product'
            },
            {
                className: "total_weight border-0",
                data: (data,index,tr)=>{
                    let weight_diff = 0;
                    data.weight_diff < 0 ? weight_diff = data.weight_diff * -1 : weight_diff = data.weight_diff;
                    const sender_info = [`<div class="row">`,
                            `<div class='col-4 table-success'><span class="sender-name d-block">`,data.total_weight||`NA`,` </span></div>`,
                            `<div class='col-4 table-warning'><span class="sender-name d-block">`,data.carrier_total_weight||`NA`,` </span></div>`,
                            `<div class='col-4 table-'><span class="sender-name `,weight_diff > 0.03 ? "text-danger" : "text-success",` d-block">`,weight_diff||`-`,` </span></div>`,
                        `</div>`].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: ` <div class='row'>
                            <div class='col-12 text-center p-2'>Weight (Kg)</div>
                            <div class='col-4 table-success p-2'>JTO</div>
                            <div class='col-4 table-warning p-2'>DHL</div>
                            <div class='col-4 table- p-2'>Diff.</div>
                        </div>`
            },
            // {
            //     className: "s",
            //     data: (data,index,tr)=>{
            //         const sender_info = ['<span class="sender-name d-block">',data.carrier_total_weight||'NA',' USD </span>'].join('');
            //         return sender_info;
            //     },
            //     // title: mThis.trans('Sender ID')
            //     title: `<div class='d-b'>carrier tw</div><div class='d-n'>carrier total weight</div>`
            // },
            {
                className: "total_amount border-0",
                data: (data,index,tr)=>{
                    let price_diff = 0;
                    data.price_diff < 0 ? price_diff = data.price_diff * -1 : price_diff = data.price_diff;
                    const sender_info = [`<div class="row">`,
                            `<div class='col-4 table-success'><span class="sender-name d-block">`,data.total_price||`NA`,` </span></div>`,
                            `<div class='col-4 table-warning'><span class="sender-name d-block">`,data.total_carrier_cost||`NA`,` </span></div>`,
                            `<div class='col-4 table-'><span class="sender-name `,price_diff > 0.03 ? "text-danger" : "",` d-block ">`,price_diff||`-`,` </span></div>`,
                        `</div>`].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: ` <div class='row'>
                            <div class='col-12 text-center p-2'>Amount (USD) </div>
                            <div class='col-4 table-success p-2'>JTO</div>
                            <div class='col-4 table-warning p-2'>DHL</div>
                            <div class='col-4  p-2'>Diff.</div>
                        </div>`
            },

            {
                className: "unacceptable" ,
                data: (data,index,tr)=>{
                    const sender_info = [`<div class="row ">`,
                            `<div class='col-3 table-secondary'><span class="sender-name `,data.unacceptable_weight > 0 ? "text-danger" : "text-success",` d-block"> <i class="fas fa-check `,data.unacceptable_weight > 0 ? "d-none" : "",`"></i> <i class="fas fa-times `,data.unacceptable_weight == 0 ? "d-none" : "",`"></i> </span></div>`,
                            `<div class='col-3 table-secondary'><span class="sender-name `,data.unacceptable_price > 0 ? "text-danger" : "text-success",` d-block"><i class="fas fa-check `,data.unacceptable_price > 0 ? "d-none" : "",`"></i> <i class="fas fa-times `,data.unacceptable_price == 0 ? "d-none" : "",`"></i>  </span></div>`,
                            `<div class='col-3 table-secondary'><span class="sender-name `,data.wrong_type > 0 ? "text-danger" : "text-success",` d-block "><i class="fas fa-check `,data.wrong_type > 0 ? "d-none" : "",`"></i> <i class="fas fa-times `,data.wrong_type == 0 ? "d-none" : "",`"></i>  </span></div>`,
                            `<div class='col-3 table-secondary'><span class="sender-name `,data.wrong_country > 0 ? "text-danger" : "text-success",` d-block "><i class="fas fa-check `,data.wrong_country > 0 ? "d-none" : "",`"></i> <i class="fas fa-times `,data.wrong_country == 0 ? "d-none" : "",`"></i>  </span></div>`,
                        `</div>`].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: ` <div class='row '>
                            <div class='col-12 text-center p-2'> unacceptable </div>
                            <div class='col-3 table-secondary p-2'>weight</div>
                            <div class='col-3 table-secondary p-2'>price</div>
                            <div class='col-3 table-secondary p-2'>type</div>
                            <div class='col-3 table-secondary p-2'>coun.</div>
                        </div> `
            },

            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<div class="sender-name d-block" data-id="', data.id, '">',
                        data.paid_status_id >= 2?'<img width="28" height="20" src="https://img.icons8.com/color/48/paid.png" alt="paid"/>':'<span href="javascript:void(0)" class ="btn-payment btn btn-sm pt-0 pb-0 ps-1 pe-1 btn-outline-danger" >UNPAID</span>',
                    '</div>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'payment'
            },
            // {
            //     className: "",
            //     data: (data,index,tr)=>{
            //         const sender_info = ['<span class="sender-name d-block">',data.total_price||'NA',' USD </span>'].join('');
            //         return sender_info;
            //     },
            //     // title: mThis.trans('Sender ID')
            //     title: 'total price'
            // },
            // {
            //     className: "",
            //     data: (data,index,tr)=>{
            //         const sender_info = ['<span class="sender-name d-block">',data.total_carrier_cost||'NA',' USD </span>'].join('');
            //         return sender_info;
            //     },
            //     // title: mThis.trans('Sender ID')
            //     title: `<div class='d-b'>total cc</div><div class='d-n'>total carrier cost</div>`
            // }
            
        ];

        mThis.billValidationListView = new ListView("_billValidation_list", {
            // clientSidePagination: true,
            fetchApi: `${main_view.base_url}/abm/oversea_shipments/Shipment-list-BillValidate`,
            apiCluster: main_view.apiCluster,
            tableClass: "table bill_Validate header-uppercase bg-white",
            perPage: 10,
            columns: mThis.cols,
            // processResponse: (res) => {
            //     console.log(res.data);
            //     return res.data;
            // },
            rowCreated:(data,index,tr)=>{
                
              tr.dataset.id = data.id;  
              tr.classList.add('order');
              tr.classList.add('shipment');
              tr.setAttribute('id',['shipment_',data.id].join('')); 
            //   tr.dataset.statusid = data.status_id;
              tr.dataset.senderid = data.sender_id;
              tr.dataset.country_zone = data.zone_code;
              tr.dataset.country_id = data.to_country_id;
              tr.dataset.price_list_id = data.price_list_id;
            //   tr.dataset.driverid = data.driver_id?data.driver_id:''; 
            }, 

            
            listContainerClass: null,
        });


        mThis.initAlready = true;

    mThis.tblOrders = mThis.billValidationListView.getTable();
    mThis.tblValidation = $(mThis.tblOrders);

    this.sh_container = mThis.billValidationListView.getListContainer();
    // mThis.setEvents($(mThis.container));
    // console.log(mThis.container.parentElement); 
    const sh_parent = mThis.sh_container.parentElement;
        sh_parent.style.height = (window.innerHeight - 190)+'px';
        sh_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 190)+'px';
    }

    mThis.tblValidation.on('click', 'span.btn-payment', function (e) {
        e.preventDefault();
        let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
        // console.log(1,$(this),2,div);
        let p ={'id' : div[0].dataset.id};
        PaymentDialog.show(p);
        // mThis.savePrices($(this), div); 
    });

    this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
        el.onchange = e => { 
            e.preventDefault();
            if(mThis.allow_filter){
                mThis.billValidationListView.showPage(mThis.getFilterData());
            }
        };
    });

    mThis.btnRefress.on('click', (e) => {
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            // console.log('el',el.value);
            el.value = null;
        });
        mThis.refreshPriceListOptions(null);
        mThis.billValidationListView.showPage(mThis.getFilterData()); 
        
    });

    mThis.btnPaymany.on('click', function (e) {
        e.preventDefault();
        let p = {'id': null}
        PaymentDialog.show(p);
        const dlg = new GeneralDialog({
            title:"Bill Payments", 
            cssClass:"modal-lg",
            // fields:[
            //     {
            //         name:"from_date",
            //         label:"From Date",
            //         type:"string",
            //         required:true
            //     },
            //     {
            //         name:"to_date",
            //         label:"To Date",
            //         type:"string",
            //         required:true
            //     },
            //    {
            //      name:"amount",
            //      label:"Amount",
            //      type:"number",
            //      required:true
            //    },
            //    {
            //     name:"currency_code",
            //     label:"Currency",
            //     // type:"string",
            //     displayType:"select",
            //     required:true,
            //     // config:{
            //     //     data:'currency_code',
            //     //     valueField:'currency_code',
            //     //     textField:'currency_code',
            //     //     default:'USD',
            //     // }
            //    }
            // ],
            createFields:() =>{
                return `<div class="row">
                            <div class="form-group col-md-6">
                                <span class="simple-label">Amount</span>
                                <input type="" class="form-control data-input" data-field="amount" />  
                            </div>
                            <div class="form-group col-md-6">
                                <span class="simple-label">Currency Code</span>
                                <div>
                                    <select id ="_plq_currency_code" class="modal-select2 data-input" data-field="currency_code"></select>
                                </div>
                            </div>
                            <div class="form-group from_date col-md-6 " >
                                <span class="simple-label ">From Date</span>
                                <div>
                                <input data-type="date"  class="form-control data-input filter-field" data-field="from_date" placeholder="From Date" id="_shm_filter_from_date" />
                                </div>
                            </div>
                            <div class="form-group to_date col-md-6 pe-0 " >
                                <span class="simple-label ">To Date</span>
                                <div>
                                <input data-type="date" class="form-control data-input filter-field" data-field="to_date" placeholder="To Date" id="_shm_filter_to_date" />
                                </div>
                            </div>
                        
                        </div>`;
            },
            configSelect:[
                {
                    name:"currency_code",
                    data:'currency_code',
                    valueField:'currency_code',
                    textField:'currency_code',
                    default:'USD',
                    onChange:(selectElement,value)=>{}
                }
            ],
            prepareFormOptions:{
                createTitle:"Create Account",
                modifyTitle:"Edit Account",
                api:{
                   targetProp:"data.os_shipment",
                   endpoint:`${mThis.base_url}/abm/oversea_shipments/form-options-payment`,
                //    params:()=>{
                //         return {'id':1};
                //     }
                    // params: {id:1}
                }
             },
            buttons:[
             {
                 label:"Cancel",
                 cssClass:"btn btn-secondary",
                 action:"cancel",
                 dismissModal:true,
                 icon:""
             },
             {
                 label:"Ok",
                 cssClass:"btn btn-info",
                 icon:"",
                 click:(me,btn,divModal)=>{
                    // alert(dlg.getData())
                    console.log(me.getData());
                    // vsapi.call(${main_view,base_url}/api/service/set-password,p,false,false,false).then(res=>{
                      me.hide();
                    // }); 
                 }
             }
            ],
            onPrepareForm:(instance,data,fields,divModal)=>{
                console.log('fields',fields);
                fields.from_date.onchange = (e)=>{
                    console.log('date chang');
                }
                // VSUtil.setComboItems(fields.currency_code, data.currency_code ,'currency_code','currency_code',false,null,null);
            },
            onClose:(canceled)=>{
            //   alert(' Closing with cancel = ' + canceled);
            }
         });
 
        //  dlg.show({'id':1}); 
    });

    }

    this.loadFilterData = (def_shipment_no) => {
        mThis.refreshPriceListOptions(def_shipment_no);
    };

    this.refreshPriceListOptions = (def_shipment_no = null) => {
        mThis.allow_filter = false;
        vsapi.call(`${mThis.base_url}/abm/oversea_shipments/form-options`, null).then(res => {
          if (res.status_code === 200) {
            console.log(res.data.shipment_code);
            let shipment_code = StringSanitizer.sanitizeObject(res.data.shipment_code);
            let b = def_shipment_no;
            if (!b) b = mThis.elFilter_shipment_no.val();
            VSUtil.setComboItems(mThis.elFilter_shipment_no, shipment_code,'id', 'shipment_code', true, '(all shipment)', b);
            mThis.allow_filter = true;
            // if (mThis.elFilter_shipment_no.val() > 0) 
            mThis.billValidationListView.showPage(mThis.getFilterData()); 
          }
        });
    }

    this.show= (options)=>{
        mThis.init();
        if (!options) options = {};
        mThis.options = options;
        mThis.loadFilterData();
        main_view.setTitle(mThis.title_prop);
            mThis.self.siblings().hide();
            mThis.self.hide().fadeIn(300);
      
    }

    this.getFilterData = () => {
        let p = {
            // search_value: mThis.elSearch.val(),
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            let f= el.dataset.field;
            p[f] = el.value;
        });
        console.log('p',p);
        return p;
    }
}

const AlertMesageDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#ErrorModalLong');

    this.scrollable = this.self.find('#modal-dialog');
    this.elTitle = this.self.find('#AlertModalLongTitle')[0];
    this.btnOk =  this.self.find('#_sdl_btnOk');
    this.btnCancel =  this.self.find('#_sdl_btnCancel');
    // console.log(mThis.btnSave);
    // this.elSenderType =  this.self.find('#_sdl_sender_sendertype');
    // this.elBusinessType =  this.self.find('#_sdl_sender_businesstype');
    
    this.onClose = null;
    let alert = null;


    this.bodyHeader =  this.self.find('h.header')[0];
    this.body =  this.self.find('p.body')[0];
 
    this.btnOk.on('click', function(e){
        e.preventDefault();
        console.log(4,alert);
        if(alert)
            BillingValidationComponent.btnUploard.click();
        else
            mThis.self.modal('hide');
    });

    this.checkAlert = (message) =>{
        if(message == 'alert'){
            mThis.elTitle.innerHTML = `<i class="far fa-question-circle text-info" style="font-size: 80px;"></i>`;
            alert = message;
            mThis.bodyHeader.innerHTML = '<h5 class="ps-4 pe-4 text-center">Validate Now?</h5>';
            mThis.btnCancel[0].classList.add('d-block');
            mThis.btnCancel[0].classList.remove('d-none');
            mThis.scrollable[0].classList.remove('modal-dialog-scrollable');
            mThis.body.innerHTM = '';
        }else if(message == 'saved'){
            mThis.elTitle.innerHTML = `<i class="far fa-check-circle text-success" style="font-size: 80px;"></i>`;
            alert = 0;
            mThis.bodyHeader.innerHTML = '<h5 class="ps-4 pe-4 text-center">File saved and Validated</h5>';
            mThis.btnCancel[0].classList.add('d-none');
            mThis.btnCancel[0].classList.remove('d-block');
            mThis.scrollable[0].classList.remove('modal-dialog-scrollable');
        }else {
            mThis.elTitle.innerHTML = `<i class="fa-regular fa-circle-xmark text-danger" style="font-size: 80px;"></i>`;
            alert = 0;
            mThis.bodyHeader.innerHTML = '<h6 class="ps-4 pe-4">' + message + '</h6>';
            mThis.btnCancel[0].classList.add('d-none');
            mThis.btnCancel[0].classList.remove('d-block');
            // mThis.scrollable[0].classList.remove('modal-dialog-scrollable');
        }
    }

    this.show = (message, d) => {
        console.log(1,message ,2, d);
        console.log(3,mThis.elTitle);
        // console.log(4,mThis.btnOk[0]);
        if (!message) message = {};
           
        mThis.checkAlert(message);

        let html = '<span >- Supplyer QR : <br>';
        if(d){
            mThis.scrollable[0].classList.add('modal-dialog-scrollable');
            mThis.scrollable[0].style.margin = '';
            d.forEach(element => {
                html += element + ` , `;
            });
            html += `</span>`;
            mThis.body.innerHTML = html;
        }else{
            mThis.body.innerHTML = null;
            mThis.scrollable[0].classList.remove('modal-dialog-scrollable');
            mThis.scrollable[0].style.margin = '10rem auto';
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}



const PaymentDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#PaymentModalDialog')[0];
    this.base_url = main_view.base_url;
    this.modal = new bootstrap.Modal(this.self);
    this.options ={};

    

    this.scrollable = this.self.querySelector('#modal-dialog');
    this.elTitle = this.self.querySelector('#PaymentModalDialogTitle');
    this.btnPay =  this.self.querySelector('#_sdl_btnPay');
    this.btnCancel =  this.self.querySelector('#_sdl_btnCancel');
    // console.log(mThis.btnSave);
    // this.elSelseAgentType =  this.self.querySelector('#_plq_salse_agent_type');
    this.elSupplier =  this.self.querySelector('#_plq_supplier');
    
    this.elCurrencyCode =  this.self.querySelector('#_plq_currency_code');
    this.elPmtMethod =  this.self.querySelector('#_plq_pmt_method');
    this.elCustomer =  this.self.querySelector('#_plq_Customer');
    this.divFromDate =  this.self.querySelector('div.from_date');
    this.divToDate =  this.self.querySelector('div.to_date');
    this.elFromDate =  this.self.querySelector('#_shm_filter_from_date');
    this.elToDate =  this.self.querySelector('#_shm_filter_to_date');
    this.inputSupplier =  this.self.querySelector('#_input_supplier');
    this.elFromDate =  this.self.querySelector('#_shm_filter_from_date');
    this.elToDate =  this.self.querySelector('#_shm_filter_to_date');
    
    this.onClose = null;
    let shipments_id = null;

    this.bodyHeader =  this.self.querySelector('h.header');
    this.body = this.self.querySelector('.modal-body');
    this.div_payment_info = this.body.querySelector('#_payment_dlg_body');

    this.div_filter_fields = this.self.querySelector('div.filter-date');
    this.getFilterData = () => {
        let p = {
            // search_value: mThis.elSearch.val(),
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            let f= el.dataset.field;
            p[f] = el.value;
        });
        // console.log('p23',p);
        return p;
    }
    this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
        // let p = mThis.getFilterData();
        let p={};
        el.onchange = e => { 
            e.preventDefault();
            mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
                let f= el.dataset.field;
                p[f] = el.value;
            });

            console.log('pp',p);
            vsapi.call(`${mThis.base_url}/abm/payment/details`, p , null).then(res => {
                let d = (res.status_code === 200) ? res.data.amount : {};
                if(shipments_id == null)
                    mThis.self[0].querySelectorAll('.data-input').forEach(el => {
                        if(el.dataset.field == 'amount')
                            el.value = d || '0.00';
                    });
            });
            // mThis.prepareFormOptions( p , d => {
            //     console.log("d2",d);
            //     if(d.os_shipment != null){
            //         mThis.setData(d.os_shipment);
            //     }
            //     // mThis.self.modal({
            //     //     'backdrop': 'static'
            //     // });
            // });
        };
    });

    this.prepareFormOptions = ( data, onFinish) => {
        // let p={'id' : data.id }
        vsapi.call(`${mThis.base_url}/abm/oversea_shipments/form-options-payment`, data , null).then(res => {
            console.log('d2',res.data.to_country);
            let d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data , null, ['country_name','cp_name'] ) : {};
            // VSUtil.setComboItems(mThis.el_from_country, d.from_country,'id', 'country_name', true, '(select )' , null);
            // mThis.elWarehouse.val(d.warehouses[0].id).trigger('change'); 
            // VSUtil.setComboItems(mThis.elSelseAgentType, d.agent_types, 'id', 'agent_type', false, '', null);
            // let payee_id = d.os_shipment.payee_id ? d.os_shipment.payee_id : null;
            VSUtil.setComboItems(mThis.elSupplier, d.supplier, 'id', 'supplier_name', true, '(select Supplier)', null);
            VSUtil.setComboItems(mThis.elCurrencyCode, d.currency_code, 'id', 'currency_code', true, '(select currency code)', 'USD');
            VSUtil.setComboItems(mThis.elPmtMethod, d.payment_method, 'id', 'payment_method', true, '(select payment by)', 1);
            // VSUtil.setComboItems(mThis.elCustomer, d.senders, 'id', 'sender_name', true, '(select Customer)', null);
            onFinish(d);
        });
    }
 
    this.btnPay.onclick = e => {
        e.preventDefault();
        // console.log(4,alert);
        // if(alert)
        //     // BillingValidationComponent.btnUploard.click();
        //     ;
        // else
        //     mThis.self.modal('hide');
        let p = mThis.getFormData(false);
        p.shipment_id = shipments_id;
        console.log('p',p);
        if (!p) return;
        if(shipments_id == null){
            vsapi.call(`${mThis.base_url}/abm/payment/save-many`, p, mThis.btnCreate).then(res => {
                if (res.status_code === 200) {
                    cv_interact.success('Payment saved'); 
                    mThis.modal.hide();
                    if (typeof mThis.options.onClose === 'function') mThis.options.onClose();
                } else cv_interact.error('html:'+res.error_message);
            });
        }else{
            vsapi.call(`${mThis.base_url}/abm/payment/save`, p, mThis.btnCreate).then(res => {
                if (res.status_code === 200) {
                    cv_interact.success('Payment saved'); 
                    mThis.modal.hide();
                    if (typeof mThis.options.onClose === 'function') mThis.options.onClose();
                } else cv_interact.error(res.error_message);
            });
        }
        
    };

    this.show = (options) => {
        options = options ? options : {};
        mThis.options = options;
        console.log(123,mThis.div_filter_fields);
        let p = options.id;
        if (p == null){
            mThis.divFromDate.classList.remove('d-none');
            mThis.divToDate.classList.remove('d-none');
            mThis.divFromDate.classList.add('d-block');
            mThis.divToDate.classList.add('d-block');
            // console.log(1,mThis.divFromDate ,2,mThis.divToDate);
            mThis.elFromDate.value = null;
            mThis.elToDate.value = null;
        }
        else{
            mThis.divFromDate.classList.remove('d-block');
            mThis.divToDate.classList.remove('d-block');
            mThis.divFromDate.classList.add('d-none');
            mThis.divToDate.classList.add('d-none');
            mThis.elFromDate.value = null;
            mThis.elToDate.value = null;
        }
        shipments_id = p;
        console.log('p',p);
        // mThis.checkAlert(message);
        mThis.prepareFormOptions( {'id': p} , d => {
            if(d.os_shipment != null){
                mThis.setData(d.os_shipment);
            }
            mThis.modal.show();
        });
        

        // mThis.self.modal({
        //     backdrop: 'static'
        // });
    }

    this.getFormData = () => {
        
        let p = {};
        // const el = '';
        mThis.div_payment_info.querySelectorAll('.data-input').forEach(el => {
            let data_member = el.dataset.field;
            p[data_member] = el.value;
            
        });
        // mThis.self.querySelector('.filter-field').each(function () {
        //     const el = $(this);
        //     const f = el.data('field');
        //     if (el.data('error') == 1) {
        //         has_error = true;
        //         return false;
        //     }
        //     p[f] = el.val();
        //     // console.log(12,p[f],13,f);
        // });
        // // console.log(12,p[f],13,f);
        return p;
    }

    this.setData = (d) => {
        if(shipments_id == null)
        mThis.div_payment_info.querySelectorAll('.data-input').forEach(el => {
            if(el.dataset.field == 'amount')
                el.value = '0.00';
            if(el.dataset.field == 'payment_date'){
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth()).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                // console.log(formatDate(new Date(year, month, day)));
                el.value = formatDate(new Date(year, month, day));
            }
            // console.log(getFormattedDate());
            // if (el.tagName.toLowerCase() === 'select') {
            //     el.dispatchEvent(new Event('change'));
            // }
        });
        if (!d) return;
        console.log(4,d.amount);
        d = d || {};
        mThis.div_payment_info.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;

            el.value = d[data_member] ?? '';
            // console.log(5,el);
            if(el.dataset.field == 'currency_code')
                el.value = 1;
            if(el.dataset.field == 'pmt_method')
                el.value = 1;
            if(el.dataset.field == 'payment_date'){
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth()).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                console.log(formatDate(new Date(year, month, day)));
                el.value = formatDate(new Date(year, month, day));
            }
            if (el.tagName.toLowerCase() === 'select') {
                el.dispatchEvent(new Event('change'));
            }
        });
        // mThis.self[0].querySelectorAll('.filter-field').forEach(el => {
        //     const data_member = el.dataset.field;

        //     el.value = d[data_member] ?? '';
        //     // console.log(5,el);
        //     if(el.dataset.field == 'currency_code')
        //         el.value = 1;
        //     if(el.dataset.field == 'pmt_method')
        //         el.value = 1;
        //     if (el.tagName.toLowerCase() === 'select') {
        //         el.dispatchEvent(new Event('change'));
        //     }
        // });

    }
}



function formatDate(date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}