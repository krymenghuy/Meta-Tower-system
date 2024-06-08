'use strict';

const FilterDialog = new function () {
    let mThis = this;
    this.base_url = main_view.base_url; //** || document.querySelector('meta[name="base_url"]').getAttribute('content');*/
    this.self = main_view.appContent.find('#_create_invoice_dlgFilter');
    this.elTitle = this.self.find('#_create_invoice_dlgFilterTitle');
    this.elFilter_start_date = this.self.find('#_pl_filter_startdate');
    this.elFilter_end_date = this.self.find('#_pl_filter_enddate');
   
    this.form_data = {};
    this.remembered_filter;
    this.btnOK = this.self.find('#_invoice_create_dlgFilter_btnOK');

    this.self.find('.dl_filter_field').on('change', (e) => {
        mThis.remembered_filter = mThis.getData();
    });

    this.btnOK.on('click', (e) => {
        mThis.self.modal('hide');
        let p = mThis.getData();
        if (typeof mThis.onClose == 'function') mThis.onClose(p);
    });

   

    this.show = (option, onClose) => {
        if (option) {
            let title_text = LocaleManager.trans(option.title);
            mThis.elTitle.text(title_text);
        }
        mThis.onClose = onClose;
            mThis.self.modal({
                backdrop: 'static'
            });

    }

    this.getData = () => {
        let p = {};
        p.start_date = mThis.elFilter_start_date.val();
        p.end_date = mThis.elFilter_end_date.val();
        mThis.remembered_filter = p; //remember previous selection
        return p;
    }
}

var InvoicesComponent = new function(){
    const mThis = this;
    this.title_prop = "Invoices";
    this.self = main_view.appContent.children('#_main_invoicesComponent');
    this.base_url = main_view.base_url;

    this.elFilter_start_date = this.self.find('#_invoice_filter_start_date');
    this.elFilter_end_date = this.self.find('#_invoice_filter_end_date');
    this.elSearch = this.self.find('#_invoice_search');
    this.btnSearch = this.self.find('#_btnSearch');
    // this.tblInvoices_body = mThis.self.find('#_idl_invoice_body');
    this.div_filter_fields = mThis.self[0].querySelector('#_idl_filter_fields');
    this.btnToggleFilter = this.self.find('#_pl_btnToggleFilter');

    this.btnPrint = this.self.find('#_invoice_btnPrint');
    this.btnPDF = this.self.find('#_invoice_btnPDF');
    this.btnExcel = this.self.find('#_invoice_btnExcel');



    mThis.cols = [
            
       
            {
                className: "invoice_no align-middle",
                data: function (data,index,tr) {
                    return ['<div><span class="rounded-3">', data.code, '</span></div>'].join('');
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
                title: "Customer Contact",
                className: "align-middle text-nowrap",
                data: (data, index, tr) => {
                    return ['<div class="d-flex p-1"><i class="fas text-danger  fa-phone p-2"></i><span class="  sender-name d-block p-1 ">', data.phone_number, '</span></div>','<div class="d-flex p-2" ><i class="fas p-2 text-success fa-envelope"></i><span class=" text-primary sender-name d-block p-1">', (data.email || 'គ្មាន'),
                        '</span></div>'].join('');
                }
            },
            {
                className: "invoice_type align-middle text-muted",
                data:(data,index,tr)=>{
                    return[`<div>`,data.invoice_type,`</div>`].join('');
                },
                title: 'InVoice TYpe',
            },
        
            // {
            //     className: "items_type align-middle",
            //     title: 'Item Type',
            //     data: (data,index,tr)=>{
            //         const cls_class =(data.item_type || '').toLowerCase() === 'doc' ? 'border-success text-center' : 'border-warning text-center text-primary';
            //         // const item_type = data.item_type ? VSUtil.properCase(data.item_type) : 'non_doc';
            //         const item_type = data.item_type ? data.item_type.toUpperCase() : 'NON_DOC';
            //         // return [`<div class="d-flex gap-2"><span class="text-nowrap">`,data.item_type,`</span></div>`].join('');
            //         return ['<a class="d-block" data-item_type="',item_type, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class="border rounded-5 p-2   ${cls_class} ">`,item_type, '</span></a>'].join('');

            //     },
            // },
       
          
            // {
            //     className: "qty align-middle text-center",
            //     data: (data,index,tr)=>{
            //         return [`<span class="item-qty">`,data.package_qty,`</span>`].join('');
            //     },
            //     title:'Package QTY'

            // },
           
            // {
            //     className: "special_charge align-middle",
            //     data:(data,index,tr)=>{
            //         return [`<span class="spacial_charge">`,data.total_special_charge,`</span>`].join('');
            //     },
            //     title:'Spacial Charge'

            // },
            {
                title: "Total Amount",
                className: "total_amount align-middle",
                data: (data, index, tr) => {
                    const cur_symbol = data.currency_symbol || "$";
                    const amount = Number(data.amount).toLocaleString("en-US", {
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
                className: "discount_percentage align-middle",
                data: (data, index, tr) => {
                    const cur_symbol = data.currency_symbol || "%";
                    const percent = Number(data.discount_percent).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return [
                        "<span><span>",
                        percent,
                        ' </span><span class="amount">',
                        cur_symbol,
                        "</span></span>",
                    ].join("");
                },
                title:'Discount Percent'

            },
            {
                title: "Discount Amount",
                className: "discount_amount align-middle",
                data: (data, index, tr) => {
                    const cur_symbol = data.currency_symbol || "$";
                    const dis_amount = Number(data.discount_amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return [
                        "<span><span>",
                        cur_symbol,
                        ' </span><span class="amount">',
                        dis_amount,
                        "</span></span>",
                    ].join("");
                },
            },
            {
                title: "Amount Due",
                className: "due_amount align-middle",
                data: (data, index, tr) => {
                    const cur_symbol = data.currency_symbol || "$";
                    const due_amount = Number(data.amount_due).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    });
                    return [
                        "<span><span>",
                        cur_symbol,
                        ' </span><span class="amount">',
                        due_amount,
                        "</span></span>",
                    ].join("");
                },
            },
            {
                className: "pmt_terms align-middle text-uppercase",
                data:(data,index,tr)=>{
                    return[`<div class="text-danger">`,data.pmt_terms  || 'គ្មាន',`</div>`].join('');
                },
                title: 'Payment Terms',
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
    mThis.btnToggleFilter.on('click', () => {
        FilterDialog.show(null, (d) => {
            if (d) mThis.invoiceListView.showPage(mThis.getFilterData()); 
        });
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


