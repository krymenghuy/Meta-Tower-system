'use strict';



var InvoicesComponent = new function () {
    const mThis = this;
    this.title_prop = "Invoices";
    this.self = main_view.appContent.children('#_main_invoicesComponent');
    this.base_url = main_view.base_url;

    this.elSearch = this.self.find('#_invoice_search');
    this.btnSearch = this.self.find('#_btnSearch');
    // this.tblInvoices_body = mThis.self.find('#_idl_invoice_body');
    this.div_filter_fields = mThis.self[0].querySelector('#_idl_filter_fields');
    this.btnCreateInvoice = this.self.find('#_create_invoice_btn');

    this.btnPrint = this.self.find('#_invoice_btnPrint');
    this.btnPDF = this.self.find('#_invoice_btnPDF');
    this.btnExcel = this.self.find('#_invoice_btnExcel');



    mThis.cols = [

        {
            className: "invoice_no align-middle",
            data: function (data, index, tr) {
                return ['<div><span class="rounded-3">', data.code, '</span></div>'].join('');
            },
            title: 'Invoice No'
        },
        {
            className: "customer_name align-middle",
            data: (data, index, tr) => {
                const customer_info = ['<span class="customer-name d-block text-primary text-capitalize">', data.name, '</span>'].join('');
                return customer_info;
            },
            title: 'Customer'
        },
        {
            title: "Customer Contact",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return ['<div class="d-flex p-1"><i class="fas text-danger  fa-phone p-2"></i><span class="  sender-name d-block p-1 ">', data.phone_number, '</span></div>', '<div class="d-flex p-2" ><i class="fas p-2 text-success fa-envelope"></i><span class=" text-primary sender-name d-block p-1">', (data.email || 'គ្មាន'),
                    '</span></div>'].join('');
            }
        },
        {
            className: "shipment_count align-middle text-muted",
            data: (data, index, tr) => {
                return [`<div style="display:block;width:40px;"  class="border ml-4 rounded-5 border-danger text-success text-center ">`, data.shipment_count, `</div>`,'<div class="d-flex " ><span class=" text-primary sender-name d-block p-1">', (data.invoice_type || 'គ្មាន'),
                    '</span></div>'].join('');
            },
            title: 'Shipment Number',
        },
        {
            title: "DUE",
            className: "due_date align-middle text-muted",
            data: (data, index, tr) => {
                return [`<div>`,data.due_date,`</div>`].join('');
                
            },
        },
        {
            className: "discount_percentage align-middle text-center",
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
            title: 'Discount %'

        },
        {
            title: "Total Amount",
            className: "total_amount align-middle",
            data: (data, index, tr) => {
                const cur_symbol = data.currency_symbol || "$";
                const amount_due = Number(data.amount_due).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                return [
                    "<span><span>",
                    cur_symbol,
                    ' </span><span class="amount">',
                    amount_due,
                    "</span></span>",
                ].join("");
            },
        },
        
       
        
        {
            className: "pmt_terms align-middle text-uppercase",
            data: (data, index, tr) => {
                return [`<div class="text-danger">`, data.pmt_terms || 'N/A', `</div>`].join('');
            },
            title: 'Payment Terms',
        },



        {
            title: "Last Update ",
            className: 'last_update align-middle',
            data: (data, index, tr) => {
                return [`<span class="sender-name text-danger d-block p-1">`, data.update_user, `</span>`, `<span class="d-block p-1 text-success">`, data.create_date, `</span>`].join('');
            }
        },

        {
            className: "status align-middle",
            title: 'Status',
            data: (data, index, tr) => {
                const cls_class = (data.status || '').toLowerCase() === 'paid' ? 'border-success text-success text-center' : 'border-danger text-center text-danger';
                // const item_type = data.item_type ? VSUtil.properCase(data.item_type) : 'non_doc';
                const status = data.status ? data.status.toUpperCase() : 'unpaid';
                // return [`<div class="d-flex gap-2"><span class="text-nowrap">`,data.item_type,`</span></div>`].join('');
                return ['<a class="d-block" data-status="', status, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class="border rounded-5   ${cls_class} ">`, status, '</span></a>'].join('');

            },
        },
        {
            className: 'col_action align-middle',
            data:(data, index, tr)=> {
                let html = ['<div class="d-flex gap-2 flex-wrap">',
                    '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-name="', data.name, '"data-status="', data.status_code, '" class="btn_invoice_action">',
                     '<i style="color:#8DC63F;font-size:1.5em" class="fa-sharp fa-solid fa-caret-down"></i>',
                    '</a>',
                    '</div>'].join('');
                return html;
            },
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
            listContainerClass: null,
        });

       
        mThis.btnCreateInvoice.on('click', function (e) {
            e.preventDefault();
            let op = {
                'id': null,
                'onClose': (d) => {
                    mThis.invoiceListView.showPage(mThis.getFilterData());

                }
            };
            CreateInvoiceDialog.show(op);
        });
       
       
        mThis.tblInvoices = mThis.invoiceListView.getTable();

        mThis.initDropdownMenus(mThis.tblInvoices);

        this.sh_container = mThis.invoiceListView.getListContainer();

        const sh_parent = mThis.sh_container.parentElement;
        sh_parent.style.height = (window.innerHeight - 190) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 190) + 'px';
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

    // this.editInvoice = (lnk,invoice_id)=>{
    //     // alert('Edit customer'); 
    //     if (lnk) {
    //         console.log(lnk);
    //         let op = {
    //             id: lnk.dataset.id,
    //             onClose: () => {
    //                 mThis.invoiceListView.showPage(mThis.getFilterData());
    //             }
    //         };
    //         CreateInvoiceDialog.show(op);
    //         return;
    //     }
    //   //todo: Write code to show dialog to edit customer
    // }
    this.deleteInvoice = (lnk,invoice_id)=>{
        if(lnk){
            const id = lnk.dataset.id;
            let status_code = lnk.dataset.status;
            let p ={
                id:id,
                status_code : status_code
            };
            cv_interact.confirm('Delete this invoice?', {
                title: 'Delete Invoice',
                context: 'delete'
            }, function (e) {
                if (e) {
                    vsapi.call(`${mThis.base_url}/abm/invoice/delete`, {
                        id: id
                    }, null).then(res => {
                        if (res.status_code === 200) {
                            mThis.invoiceListView.showPage(mThis.getFilterData());
                        }
                        else
                            cv_interact.error(res.error_message);
                    });
                }
            });
            return;
        }

    }
    this.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_invoice_action",
            cssClass:"bg-gray",
            //menuItemClass:"",
            menus:[
            
              
               {
                //text:"",
                html:'<span class=" trans-text text-danger" data-langprop="titles.DELETE INVOICE">Delete</span>',
                icon:`<i class="text-danger fa-regular fa-trash-can fs-5"></i>`,
                cssClass:"border  rounded-3",
                name:"delete-invoice"
               },
            ],
            adjustPosition:{
                 top:-200 ,
                 left:-300
            },
            onShow:(instance, menuContainer)=>{
                console.log('open: ', instance.getMenus());
            },
            // onClose:(instance, menus)=>{

            // },
            onClick:(menuLink, id, name)=>{
               switch(name){
                
                 case 'delete-invoice':{
                    mThis.deleteInvoice(menuLink,id); //Not yet defined
                    break;
                 }
                 default:{
                    break;
                 }
               }
            }
        }
        new VSDropdownMenu(menuOptopns);
    
    }
    this.getFilterData = () => {
        let p = {
            // search_value: mThis.elSearch.val(),
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
            let f = el.dataset.field;
            p[f] = el.value;
        });
        console.log('p', p);
        p.search_value = mThis.elSearch.val();

        return p;
    }


    this.show = (options = {}) => {
        mThis.init(); // NOTE: init once only based on mThis.initAlready = true or false

        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        mThis.invoiceListView.showPage(mThis.getFilterData(), null, () => {
            mThis.self.siblings().hide();
            mThis.self.hide().fadeIn(250);
        });


    }




}
const CreateInvoiceDialog = new function () {
    let mThis = this;
    this.base_url = main_view.base_url; //** || document.querySelector('meta[name="base_url"]').getAttribute('content');*/
    this.self = main_view.appContent.find('#_create_invoice_dlgFilter')[0];
    this.modal = new bootstrap.Modal(this.self);
    this.options = {};

    this.elTitle = this.self.querySelector('#_create_invoice_dlgFilterTitle');
    this.btnCreate = this.self.querySelector('#_invoice_create_dlgFilter_btnOK');

    this.elStartDate = this.self.querySelector('#_pl_filter_startdate');
    this.elEndDate = this.self.querySelector('#_pl_filter_enddate');
    this.elCustomer = this.self.querySelector('#_name_customer');
    this.body = this.self.querySelector('.modal-body');

    this.div_invoice_info = this.body.querySelector('#_invoice_dlg_body');
    this.onClose = null;
    this.form_data = {};
    this.remembered_filter;
    let shipments_id = null;

    this.self.querySelector('.dl_filter_field').onchange= e => {
        mThis.remembered_filter = mThis.getFormData();
    };
    this.prepareFormOptions = (id, onFinish) => {

        vsapi.call(`${mThis.base_url}/abm/invoice/form-options`, { id: id }, null).then(res => {
            let d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data) : {};
            // VSUtil.setComboItems(mThis.el_from_country, d.from_country,'id', 'country_name', true, '(select )' , null);
            // mThis.elWarehouse.val(d.warehouses[0].id).trigger('change'); 
            // VSUtil.setComboItems(mThis.elSelseAgentType, d.agent_types, 'id', 'agent_type', false, '', null);
            VSUtil.setComboItems(mThis.elCustomer, d.customer, 'id', 'sender', true, '(All Customer)', null);

            onFinish(d);
        });
    }

    this.btnCreate.onclick = e => {
        e.preventDefault();
        const p = mThis.getFormData();
        p['id'] = shipments_id;
        console.log(p);

        if (!p) return;
        vsapi.call(`${mThis.base_url}/abm/invoice/save`, p, mThis.btnCreate).then(res => {
            if (res.status_code === 200) {
                // cv_interact.success('Invoice is Created'); 
                mThis.modal.hide();
                // InvoicesComponent.invoiceListView.showPage();

                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

            } else cv_interact.error(res.error_message);
        });


    };



    this.show = (options, onClose) => {
        options = options ? options : {};
        mThis.options = options;
        let p = options.id;
        shipments_id = p;
        console.log('p', p);
        // mThis.checkAlert(message);
        mThis.prepareFormOptions(18, d => {
            console.log("d", d);
            if (d.os_shipment) {
                mThis.setData(d.os_shipment);
            }
          mThis.modal.show();
        });
    }

    this.getFormData = () => {
        let p = {};
        p.start_date = mThis.elStartDate.value;
        p.end_date = mThis.elEndDate.value;
        mThis.div_invoice_info.querySelectorAll('.data-input').forEach(el => {
            // const el = $(this);
            let data_member = el.dataset.field;
           
            p[data_member] = el.value;
        });
        return p;
    }

    this.setData = (d) => {
        // mThis.body.querySelectorAll('.data-input').forEach(el => {
        //     // el.value = null;
        //     if (el.tagName.toLowerCase() === 'select') {
        //         el.dispatchEvent(new Event('change'));
        //     }
        // });
        if (!d) return;
        // console.log(4,mThis.self);
        d = d || {};
        mThis.div_invoice_info.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;

            el.value = d[data_member] ?? '';
            // console.log(5,el);

            if (el.tagName.toLowerCase() === 'select') {
                el.dispatchEvent(new Event('change'));
            }
        });

    }
}


