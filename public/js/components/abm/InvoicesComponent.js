'use strict';
var InvoicesComponent = new function(){
    const mThis = this;
    this.title_prop = "Invoices";
    this.self = main_view.appContent.children('#_main_invoicesComponent');
    this.base_url = main_view.base_url;
    this.btnNewInvoice = this.self.find('#_new_invoice');

    this.elFilter_start_date = this.self.find('#_invoice_filter_start_date');
    this.elFilter_end_date = this.self.find('#_invoice_filter_end_date');
    this.elSearch = this.self.find('#_invoice_search');
    this.btnSearch = this.self.find('#_btnSearch');
    // this.tblInvoices_body = mThis.self.find('#_idl_invoice_body');
    this.div_filter_fields = mThis.self[0].querySelector('#_idl_filter_fields');

    this.btnPrint = this.self.find('#_invoice_btnPrint');
    this.btnPDF = this.self.find('#_invoice_btnPDF');
    this.btnExcel = this.self.find('#_invoice_btnExcel');



    mThis.cols = [
            
       
            {
                className: "invoice_no align-middle",
                data: function (data,index,tr) {
                    return ['<div><span class="rounded-3 text-warning">', data.code, '</span></div>'].join('');
                },
                title: 'Invoice No'
            },
            {
                className: "customer_name align-middle",
                data: (data,index,tr)=>{
                    const customer_info = ['<span class="customer-name d-block text-primary text-capitalize">',data.name,'</span>'].join('');
                    return customer_info;
                },
                title: 'Customer'
            },
            {
                className: "send_to_country align-middle text-muted",
                data:(data,index,tr)=>{
                    return[`<div>`,data.country,`</div>`].join('');
                },
                title: 'Send To Country',
            },
            {
                className: "items_type align-middle",
                title: 'Item Type',
                data: (data,index,tr)=>{
                    const cls_class =(data.item_type || '').toLowerCase() === 'doc' ? 'border-success text-center' : 'border-warning text-center text-primary';
                    // const item_type = data.item_type ? VSUtil.properCase(data.item_type) : 'non_doc';
                    const item_type = data.item_type ? data.item_type.toUpperCase() : 'NON_DOC';
                    // return [`<div class="d-flex gap-2"><span class="text-nowrap">`,data.item_type,`</span></div>`].join('');
                    return ['<a class="d-block" data-item_type="',item_type, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class="border rounded-5 p-2   ${cls_class} ">`,item_type, '</span></a>'].join('');

                },
            },
       
          
            {
                className: "qty align-middle",
                data: (data,index,tr)=>{
                    return [`<span class="item-qty">`,data.package_qty,`</span>`].join('');
                },
                title:'Package QTY'

            },
            {
                className: "total_weight align-middle",
                data: (data, index, tr) => {
                    const cur_symbol = data.currency_symbol || "kg";
                    const weight = Number(data.total_weight).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return [
                        "<span><span>",
                         weight,
                        ' </span><span class="amount">',
                        cur_symbol,
                        "</span></span>",
                    ].join("");
                },
                title:'Total Weight'

            },
            {
                className: "special_charge align-middle",
                data:(data,index,tr)=>{
                    return [`<span class="spacial_charge">`,data.total_special_charge,`</span>`].join('');
                },
                title:'Spacial Charge'

            },
            {
                title: "Total Amount",
                className: "total_amount align-middle",
                data: (data, index, tr) => {
                    const cur_symbol = data.currency_symbol || "$";
                    const amount = Number(data.total_price).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return [
                        "<span><span>",
                        cur_symbol,
                        ' </span><span class="amount">',
                        amount,
                        "</span></span>",
                    ].join("");
                },
            },
        
        
      
           
            {
                title: "Last Update ",
                className: 'last_update align-middle',
                data: (data, index, tr) => {
                    return [`<span class="sender-name text-danger d-block p-1">`,data.update_user,`</span>`, `<span class="d-block p-1 text-success">`,data.create_date,`</span>`].join('');
                }
            },
         
            {
                className: "status align-middle",
                title: 'Status',
                data: (data,index,tr)=>{
                    const cls_class =(data.status || '').toLowerCase() === 'paid' ? 'border-success text-success text-center' : 'border-danger text-center text-danger';
                    // const item_type = data.item_type ? VSUtil.properCase(data.item_type) : 'non_doc';
                    const status = data.status ? data.status.toUpperCase() : 'unpaid';
                    // return [`<div class="d-flex gap-2"><span class="text-nowrap">`,data.item_type,`</span></div>`].join('');
                    return ['<a class="d-block" data-status="',status, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class="border rounded-5   ${cls_class} ">`,status, '</span></a>'].join('');

                },
            },
            {
                title: "Action",
                className: 'align-middle text-capitalize',
                data: (data, index, tr) => {
            
                let html = ['<div class="dropdown d-block ">',
                            '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-suppliername="', data.name, '" data-status="', data.status_code='active'? 1 : 2, '" class="btn_action " aria-haspopup="true" aria-expanded="false">',
                            '<i class="fa fa-chevron-down" style="color:#8DC63F;font-size:1.5em"></i>',
                            '</a>',
                            '</div>'].join('');
                        return html;
                }
                
            },
           
     
         
        
    ];

  
    

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.invoiceListView = new ListView('_invoice_list', {
            'fetchApi': `${main_view.base_url}/abm/invoice/list-paginate`,
            'columns': mThis.cols,
            'apiCluster': main_view.apiCluster,
            'perPage': 10,
            'tableClass': "table header-light-blue header-uppercase",
            'rowCreated': (data, index, tr) => {
                tr.dataset.id = data.id;
               
            },
            listContainerClass:null,
        });
        mThis.btnNewInvoice.on('click', function (e) {
            e.preventDefault();
            let op = {
                'id': null,
                'onClose': (d) => {
                    mThis.invoiceListView.showPage(mThis.getFilterData());
                }
            };
            InvoiceDialog.show(op);
        });
        this.sh_container = mThis.invoiceListView.getListContainer();
        const sh_parent = mThis.sh_container.parentElement;
        sh_parent.style.height = (window.innerHeight - 190)+'px';
        sh_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 190)+'px';
    }
    mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
        el.onchange = (e) => {
            e.preventDefault();
            mThis.invoiceListView.showPage(mThis.getFilterData());
            console.log(mThis.getFilterData());
        }
    });
    
    mThis.elSearch.on('keyup', function (e) {
        e.preventDefault();
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            mThis.invoiceListView.showPage(mThis.getFilterData());
        }, 250);
    });
    mThis.btnSearch.on('click', function () {
        mThis.invoiceListView.showPage(mThis.getFilterData());
    });






        mThis.initAlready = true;
        
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
        p.search_value = mThis.elSearch.val();
        p.start_date = mThis.elFilter_start_date.val();
        p.end_date = mThis.elFilter_end_date.val();

        return p;
    }
    

    this.show = (options = {}) => {
        mThis.init(); // NOTE: init once only based on mThis.initAlready = true or false

        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
            mThis.invoiceListView.showPage(mThis.getFilterData(),null,()=>{
                mThis.self.siblings().hide();
                mThis.self.hide().fadeIn(250);
            });
                
            
    }




}
const InvoiceDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_idl_dlgInvoice');
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.find('#_idl_dlgInvoiceTitle');
    this.btnSave =  this.self.find('#_idl_invoice_btn_ok');
    // console.log(mThis.btnSave);
    // this.elSalesAgent =  this.self.find('#_sdl_sales_agent');

    // this.elPriceList =  this.self.find('#_sdl_price_list');
    // this.elCOD =  this.self.find('#_sdl_cod');
    // this.elCODFee =  this.self.find('#_sdl_cod_fee');
    // console.log(mThis.divPhoto);
    this.onClose = null;

    this.body =  this.self.find('.modal-body')[0];
    this.div_sender_info =  this.body.querySelector('#_idl_invoice_body');
   
    

    // this.prepareData = (id,def, onFinish) => {
    //     // console.log(id);
    //     if(!def) def = {};
    //     vsapi.call(`${mThis.base_url}/abm/os_suppliers/form-options`,{
    //         id: id
    //     },null).then(res => {
    //         let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
    //         // console.log(d);
    //         // d.bank_accounts = d.bank_accounts || [];
    //         // VSUtil.setComboItems(mThis.elSenderType, d.sender_types, 'id', 'sender_type', true, '(Select Merchant Type)', def.sender_type_id);
    //         // VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
    //         VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', def.price_list_id);
    //         VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', def.sales_agent_id);
    //         onFinish(d);
    //     });
    // }

    // this.btnSave.on('click', function(e){
    //     e.preventDefault();
    //     let p = mThis.getData();
    //     vsapi.call(`${mThis.base_url}/abm/os_suppliers/save`, p).then(res => {
    //         if(res.status_code === 200){
    //             mThis.self.modal('hide');
    //             if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
    //         }
    //         else
    //             cv_interact.error(res.error_message);
    //     });
    // });

    // this.show = (options) => {
    //     // console.log(options);
    //     if (!options) options = {};
    //     mThis.options = options;
         
    //     mThis.prepareData(mThis.options.id,{},data => { 
    //         if(data.supplier){
    //             mThis.elTitle.text("Modify Supplier Information");
    //         }
    //         else{
    //             mThis.elTitle.text("Create Supplier");
    //         }
    //         mThis.setData(data.supplier);
    //         mThis.self.modal({
    //             backdrop: 'static'
    //         });
    //     });
    // }
    this.show = (options)=>{
        mThis.options = options || {};
        mThis.elTitle.innerHTML = options.title;
        console.log(mThis.options.id);
        // if (mThis.options.id > 0) {
        //     mThis.elTitle.innerHTML = "Suppliers Details";
        //     let p = {'id':mThis.options.id};
        //     vsapi.call([main_view.base_url,'/abm/os_suppliers/form-options'].join(''),p,null).then(res=>{
                
        //         if(res.status_code === 200){
        //             let d = res.data.supplier;
        //         console.log(d);

        //             d = StringSanitizer.sanitizeObject(d,null,['email','address','image_url','photo']);
        //             mThis.prepareData(d, {}, data => {
        //                 mThis.setData(d);
        //                 mThis.self.modal({
        //                     backdrop:'static'
        //                 });
        //             });
        //         }
        //     });
        // }
        // else{
        //     mThis.elTitle.innerHTML =  "New Customers";
        //     mThis.prepareData({'id':1},{},data =>{
        //         mThis.setData(null);
        //         mThis.self.modal({
        //             backdrop:'static'
        //         });       
        //     });
        // }
        mThis.self.modal({
            backdrop:'static'
        });
    }

    // this.setData = (d) => {
    //     // mThis.body.querySelectorAll('.data-input').forEach(el => {
    //     //     el.value = null;
    //     // });
    //     // if (!d) return;
    //     d = d || {};
    //     mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
    //         const data_member = el.dataset.field;
    //         el.value = d[data_member] ?? '';
    //         console.log(d[data_member]);

    //         if (el.tagName.toLowerCase() === 'select') {
    //             el.dispatchEvent(new Event('change'));
    //         }else if(el.tagName ==='IMG'){
    //             el.setAttribute('src',d[data_member] || '');
    //         }
                
           
    //     });
    //     console.log(d);
    // mThis.imgBox.setImage(d.photo || d.image_url);

    // }
    // this.getData = () => {
    //     let p = {};
    //     p.id = mThis.options.id;
    //     mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
    //         let data_member = el.dataset.field;
            
    //        if(el.tagName ==='IMG') 
    //             p[data_member] = el.getAttribute('src');
    //         else 
    //             p[data_member] = el.value;
    //     });
    //     // p.banks = mThis.getBanks();
    //     return p;
    // }

    
}

