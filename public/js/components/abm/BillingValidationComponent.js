'use strict';

var BillingValidationComponent = new function () {
    const mThis = this;
    this.title_prop = "Billing Validation";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_billingValidationComponent');
    this.elFilter_shipment_no = this.self.find('#_select_shipment_No');
    this.div_filter_fields = mThis.self.find('#_sdl_filter_fields')[0];
    this.btnRefress = this.self.find('#_pl_btnRefress');
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
       
        ];

        mThis.billValidationListView = new ListView("_billValidation_list", {
            // clientSidePagination: true,
            fetchApi: `${main_view.base_url}/abm/oversea_shipments/Shipment-list-BillValidate`,
            apiCluster: main_view.apiCluster,
            tableClass: "table bill_Validate table-bordered header-uppercase bg-white",
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

        // mThis.tblOrders = mThis.billValidationListView.getTable();
    // mThis.tblShipments = $(mThis.tblOrders);

    this.sh_container = mThis.billValidationListView.getListContainer();
    // mThis.setEvents($(mThis.container));
    // console.log(mThis.container.parentElement); 
    const sh_parent = mThis.sh_container.parentElement;
        sh_parent.style.height = (window.innerHeight - 190)+'px';
        sh_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 190)+'px';
    }

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


    this.header =  this.self.find('h.header')[0];
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
            mThis.header.innerHTML = '<h5 class="ps-4 pe-4 text-center">Validate Now?</h5>';
            mThis.btnCancel[0].classList.add('d-block');
            mThis.btnCancel[0].classList.remove('d-none');
            mThis.scrollable[0].classList.remove('modal-dialog-scrollable');
            mThis.body.innerHTM = '';
        }else if(message == 'saved'){
            mThis.elTitle.innerHTML = `<i class="far fa-check-circle text-success" style="font-size: 80px;"></i>`;
            alert = 0;
            mThis.header.innerHTML = '<h5 class="ps-4 pe-4 text-center">File saved and Validated</h5>';
            mThis.btnCancel[0].classList.add('d-none');
            mThis.btnCancel[0].classList.remove('d-block');
            mThis.scrollable[0].classList.remove('modal-dialog-scrollable');
        }else {
            mThis.elTitle.innerHTML = `<i class="fa-regular fa-circle-xmark text-danger" style="font-size: 80px;"></i>`;
            alert = 0;
            mThis.header.innerHTML = '<h6 class="ps-4 pe-4">' + message + '</h6>';
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