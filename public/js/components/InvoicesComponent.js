"use strict";
let InvoiceSettings = new function(){
   this.currency = {'code':'USD','symbol':'$'};
   this.default_discount_type = 'percentage';
   // this.default_price_type ='retail' => use retail price, Not wholesaleprice
   this.default_price_type ='retail'; /** {'retail','wholesale'} **/
   this.init = ()=>{
     //todo: load invoice's defualt currency info from api
     //todl: load default discount type from api
     return;
   }
}

let InvoicesComponent = new function () {
    //By default set invoice to be Retail Sales invoice, so the item's price is retail price
    this.retail_sales =1;
    let mThis = this;
    this.title_prop = 'Invoices';
    this.self = $('#_main_invoicesComponent');
    this.tblInvoice = $('#_inv_tblInvoice');
    this.elSearchInvoice = $('#_inv_search_invoice');
    
    this.base_url = $('#__base_url').val();
    this.form_data = {};

    this.btnNewReceipt = $('#_invs_btnNewInvoice');
    this.col_titles = {
        "No":"No",
        "Ref Number":"Invoice Number",
        "Customer":"Customer",
        "Issue Date":"Issue Date",
        "Due Date":"Due Date",
        "Amount Due":"Amount Due",
        "Paid":"Paid",
        "Pmt Status":"Pmt Status",
        "Action":"Action"
    };
    
    this.formatInvoiceAmount = (currency_code = 'USD', amount = 0)=>{
       let cur_symbol = ExchangeManager.currencies[currency_code].symbol;
       return [cur_symbol,amount].join('');
    }
 
    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'invoice', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.trans_title = (title_prop = 'undefined') => {
       return (mThis.col_titles[title_prop] || 'Undefined');
    }
 
    this.init = () => {
        InvoiceSettings.init();
        this.tblInvoice.on('click','a.btn-ivc-delete',function(e){
           e.preventDefault();
           let invoice_id = $(this).data('id');
           let tr = $(this).closest('tr');
           let p = {'id':invoice_id};
           cv_interact.confirm('Delete this invoice?',{'title':"Delete Invoice",'context':'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/invoice/delete`,p,null,null).then(res=>{
                        if(res.status_code ===200){
                        mThis.refreshInvoiceInfo(tr.prev(),res.data); 
                        mThis.displayInvoices();    
                        }else cv_interact.error(res.error_message);
                    });
                }
           });
        });

        this.tblInvoice.on('click','a.btn-ivc-modify', function(e){
           e.preventDefault();
           let invoice_id = $(this).data('id');
           let tr = $(this).closest('tr');
           let op = { 'id': invoice_id, 
                 'onClose': function(data){
                    mThis.displayInvoices();
                  } 
           };
           InvoiceDialog.show(op);
         });

        this.tblInvoice.on('click','a.btn-ivc-receivepmt',function(e){
            e.preventDefault();
            let x = $(this);
            let invoice_id = x.data('id');
            let tr = x.closest('tr');
            let op = {
                'invoice_id':invoice_id,
                'id':null,
                'onClose':function(data){
                    mThis.refreshInvoiceInfo(invoice_id,data);
                    mThis.displayInvoicePayments(tr.next(),invoice_id);
                }
            };
            PaymentDialog.show(op);
        });

        this.tblInvoice.on('click','a.btn_print_invoice',function(e){
            e.preventDefault();
            let id = $(this).data('id');
            let qString = ['rtype=rpt_invoice&id=', id].join('');
            main_view.getEncryptData(qString, (d) => {
                window.open([main_view.base_url, '/geninvoice/', d].join(''), '_blank');
            });
        });

        this.btnNewReceipt.on('click', (e) => {
            e.preventDefault();
            let op = {
                onClose: (data) => {
                    if (data) {
                        mThis.displayInvoices();
                    }
                }
            };
            InvoiceDialog.show(op);
        });

        this.elSearchInvoice.on('keyup',function(e){
            e.preventDefault();
            let d = mThis.elSearchInvoice.val();
            if((d+'').length>=3 || !d) mThis.displayInvoices();
        });

        this.cfg = new ExpandableRowConfig('_inv_tblInvoice',{
            'dontExpandByClickingOn': ['btn_print_invoice', 'btn-ivc-receivepmt', 'btn-ivc-modify', 'btn-ivc-delete'],
            'wrapperClass':'invoice-pmt-wrapper',
            'onOpen':(container, detail_tr, parent_tr) =>{
                let qtr = $(parent_tr);
                let invoice_id = qtr.data('id');
                mThis.displayInvoicePayments($(detail_tr),invoice_id);
            }
        });
 
        //begin:: init events in Expandable Row View
                mThis.tblInvoice.on('click','a.ivc-pmt-edit',function(e){
                    let pmt_id = $(this).data('id');
                    let invoice_id =$(this).data('invoiceid');
                    let tblPmts = $(this).closest('table');
                    let tr = tblPmts.closest('tr'); 
                    let op = {"id":pmt_id,'invoice_id':invoice_id,
                    'onClose':function(data){ 
                            //"data" is data returned from api. data = {currency_code,amount_paid,amount_due}
                             mThis.refreshInvoiceInfo(invoice_id,data);
                             mThis.displayInvoicePayments(tr,invoice_id);
                        }
                    };
                    PaymentDialog.show(op);
                }); 

                mThis.tblInvoice.on('click','a.ivc-pmt-delete',function(e){
                    let x = $(this);
                    let pmt_id =x.data('id');
                    let invoice_id = x.data('invoiceid');
                    let p = {"id":pmt_id};
                    let pmtTable = $(this).closest('table');
                    let tr = pmtTable.closest('tr');

                    cv_interact.confirm("Delete this payment?",{"title":"Delete payment",'context':"delete"},e=>{
                        if(e){
                            vsapi.call(`${main_view.base_url}/api/invoice-payment/delete`,p).then(res=>{
                                if(res.status_code===200){
                                    let invoiceInfo = StringSanitizer.sanitizeObject(res.data);
                                    mThis.refreshInvoiceInfo(invoiceInfo.id,invoiceInfo);
                                    mThis.displayInvoicePayments(tr,invoice_id);
                                }
                            }); 
                        }
                    });
                }); 

                mThis.tblInvoice.on('click','.ivc-pmt-print',function(e){
                    let pmt_id = $(this).data('id');
                    let qString = ['id=', pmt_id].join('');
                    main_view.getEncryptData(qString, (d) => {
                        window.open([main_view.base_url, '/genreceipt/', d].join(''), '_blank');
                    });
                }); 
        //end:: init events in Expandable Row View
    };
     
    this.displayInvoicePayments = (detail_tr, invoice_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = { 'invoice_id': invoice_id };
        let div_id = ['ivc_pmt_wrapper_',invoice_id].join('');
        window.vsapi.call(`${main_view.base_url}/api/invoice/payments-with-summary`, p,null, false).then((res) => {
            let html = null;
            if (res.status_code === 200) {

                let d = StringSanitizer.sanitizeObject(res.data);
                if(!d){
                    div_wrapper.html(`<span class="fw-bold text-secondary text-center text-wrap">There are no payments yet</span>`);
                    return;
                }
                //begin:: refresh display of total amount paid
                    let tr = detail_tr.prev();
                    tr.find('.amount-paid').text(d.amount_paid);
                    tr.find('.pmt-status').text(d.pmt_status);
                //end::refresh display of total amount paid

                html = `<div id="${div_id}" data-invoiceid="${d.invoice_id}" data-pmtstatus="${d.pmt_status}" class="invoice-pmt-wrapper shadow-lg d-flex" style="width:100%;">
                        <div class="d-flex" style="width:100%">
                           <table class="table payment-table">
                           <thead>
                             <tr>
                                 <th>Ref Number</th>
                                 <th>Payment Date</th>
                                 <th>Amount</th>
                                 <th>Tax Amount</th>
                                 <th>Received By</th>
                                 <th></th>
                             </tr>
                           </thead>
                           
                           <tbody>
                              ${mThis.generatePaymentRows(d.currency_code,d.payments)}
                           </tbody>
                           
                           </table>       
                        </div>
                    </div>`;

            } else {
                html = `<div class="expanded-row-error">${res.error_message}</div>`;
            }
            div_wrapper.html(html);
        });
    }

    this.generatePaymentRows = (currency_code,rows = [])=>{
       let html = ""; 
       let cur_symbol = ExchangeManager.currencies[currency_code].symbol;
       rows.map(c=>{
         html = [html,`<tr><td><a href="javascript:void(0)" class="btn_print_pmt fw-bold" data-id="${c.id}">${c.ref_number}</a></td><td>${c.payment_date}</td><td>${cur_symbol}${c.amount}</td><td>${cur_symbol}${c.tax_amount}</td><td><span class="d-block">${c.create_user}</span><span class="d-block text-secondary text-sm-left p-2">${c.notes?c.notes:''}</span></td>
         <td class="col-action">
         <a href="javascript:void(0)" class="ivc-pmt-edit" data-id="${c.id}" data-invoiceid="${c.invoice_id}"><i class="fa fa-solid fa-edit"></i></a>
         <a href="javascript:void(0)" class="ivc-pmt-delete" data-id="${c.id}" data-invoiceid="${c.invoice_id}"><i class="fa fa-solid fa-trash"></i></a>
         <a href="javascript:void(0)" class="ivc-pmt-print" data-id="${c.id}" data-invoiceid="${c.invoice_id}"><i class="fa fa-solid fa-print"></i></a>
         </td></tr>`].join('');
       });
       return html;
    }

    this.displayInvoices = (onFinish = null) => {
        let p = {'search_value': mThis.elSearchInvoice.val()};
        window.vsapi.call(`${mThis.base_url}/api/invoice/list`,p).then(res => {
            let data = [];
            if(res.status_code === 200) data = StringSanitizer.sanitizeObject(res.data,null,['ref_number']);
             
            if(mThis.table){
                mThis.tblInvoice.DataTable().clear().destroy();
                mThis.tblInvoice.empty();
                mThis.table = null;
            }
            
            let columns = [
            {
                title: mThis.trans_title("Ref Number"),
                data:(data,a,b)=>{
                    return `<a href="javascript:void(0)" class="btn_print_invoice fw-bold" data-id="${data.id}" data-refnumber="${data.ref_number}"><i class="fa fa-print"></i>&nbsp;${data.ref_number}</a>`;
                }
            }, {
                title: mThis.trans_title("Customer"),
                data: (data,a,b)=>{
                    return [`<span class="d-block fw-bold customer-name">`,data.customer_name,`</span>`,
                `<is class="fa fa-solid fa-square-phone p-1"></i><span class="small text-left p-1">`,data.customer_phone,`</span>`].join('');
                }
            },
            {
                title: mThis.trans_title("Issue Date"),
                data: "issue_date"
            },
            {
                title: mThis.trans_title("Due Date"),
                data: "due_date"
            },
            {
                title: mThis.trans_title("Amount Due"),
                data: (data,a,b)=>{
                    return this.formatInvoiceAmount(data.currency_code,data.amount_due);
                }
            },
            {
                className:'col-amount-paid',
                title: mThis.trans_title("Paid"),
                data: (data,a,b)=>{
                    return this.formatInvoiceAmount(data.currency_code,data.amount_paid);
                }
            },
            {
                className:"col-pmt-status",
                title: mThis.trans_title("Pmt Status"),
                data: (data,a,b)=>{
                   return mThis.generatePmtStatus(data);
                }
            },
            {
                title: mThis.trans_title("Action"),
                data: (data, a, b) => {
                    let html = [`<div class="d-flex align-items-center gap-2">
                        <a href="javascript:void(0)" class="btn-ivc-receivepmt" data-id="${data.id}">
                        <i class="fa fa-credit-card text-success"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ivc-modify" data-id="${data.id}">
                            <i class="fa-regular fa-pen-to-square text-warning"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-ivc-delete" data-id="${data.id}">
                            <i class="fa-solid fa-trash-can"></i>
                        </a>
                    </div>`].join();
                    return html;
                }
            }];

            if (!mThis.table) {
                mThis.table = mThis.tblInvoice.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    //dom: 'Bfrtip',
                    retrieve: true,
                    //scrollY:390,
                    //scrollX:500,
                    //pagingType:'numbers',
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    // rowReorder: {
                    // dataSrc: 'sequence'
                    // },
                    'processing': true,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    'data': data,
                    'columns': columns,
                    "createdRow": function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.attr('id',`ivc_${data.id}`);
                        tr.data('id', data.id);
                    }
                });
            }
            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.generatePmtStatus = (d)=>{
        let amount_paid = Number(d.amount_paid);
        let pmt_status = (Number(d.amount_due) <= amount_paid) ? 'Paid' : (amount_paid > 0? 'Partially Paid':'Unpaid');
        return [`<button class="btn btn-sm ${mThis.getPmtStatusClass(pmt_status)} btn-pmt-status">`,pmt_status,`</button>`].join('');
    }

    this.getPmtStatusClass = (s)=>{
        let p = (s || '').toLowerCase();
        switch(p){
            case 'paid':{
                return 'btn-outline-success';
            }

            case 'partially paid':{
                return 'btn-outline-primary';
            }

            case 'partially-paid':{
                return 'btn-outline-primary';
            }
            default:{
                //unpaid
                return 'btn-outline-danger';
            }
        }
    }
    
    //@params $d = {amount_due,amount_paid,currency_code}
    this.refreshInvoiceInfo = (invoice_id,d)=>{
        if (!d) return;
        let cur_symbol = (ExchangeManager.currencies[d.currency_code] || {}).symbol;
        if(!cur_symbol) cur_symbol='CUR?';

        //correct prop name if necessary from amount_paid to total_paid. Both of these fields are used here
        if (!d.amount_paid) d.amount_paid = d.total_paid;
        let tr = mThis.tblInvoice.find(`tbody>tr#ivc_${invoice_id}`);
        tr.find('td.col-amount-paid').html([cur_symbol, d.amount_paid].join(''));
        tr.find('td.col-pmt-status').html(mThis.generatePmtStatus(d)); 
    }

    this.show = (option = null) => {
        mThis.displayInvoices(() => {
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
        });
    }
}
/*End of Invoice Component*/

let InvoiceDialog = new function () {
    let mThis = this;
    this.self = $('#_invs_dlgNewInvoice');
    this.Invoice_Title = $('#_invs_dlgInvoice_title');
    this.elReceiptNumber = $('#ivc_ref_number');

    this.btnSave = $('#_invs_dlgNewInvoice_btnSave');
    this.lnkAddInvoice = $('#_invs_lnkAddInvoice');
    this.base_url = $('#__base_url').val();
    this.SelectPmtTerms = $('#_inv_pmt_terms');
    this.SelectCustomer = $('#_inv_customers');
    this.options = {};

    this.elSummary_balanceDue = $('#ivc_balance_due');
    this.elSummary_subTotal = $('#ivc_sub_total');
    this.elSummary_discount = $('#ivc_discount'); //discount as percent
    this.elSummary_taxAmount = $('#ivc_tax_amount');
    this.elSummary_grandTotal = $('#ivc_grand_total');
   
    this.cols_product = [{
        "name":"item_id",
        "displayName":"item_name", /** used with Dropdown column only because dropdown column has options = {value,text}**/
        "title":"Item Name",
        "dataType":"string",
        "displayType":"select",
        "width":"250px"
    },
    {
        "name":"qty",
        "title":"Quantity",
        "dataType":"number",
        "defaultValue":1,
        "displayType":"input"
    },
    {
        "name":"sku",
        "title":"SKU",
        "dataType":"string",
        "displayType":"input",
        "readOnly":true
    },
    {
        "currencySymbol":mThis.cur_symbol,
        "name":"price",
        "title":"Price",
        "dataType":"number",
        "displayType":"input"
    },
    {
        "showPercentage":true,
        "name":"discount_percent",
        "title":"Discount (%)",
        "dataType":"number",
        "displayType":"input"
    },
    {
        "isPercentage":true,
        "name":"tax_rate",
        "title":"Tax (%)",
        "dataType":"number",
        "displayType":"input"
    },
    {
        "currencySymbol":mThis.cur_symbol,
        "name":"line_total",
        "title":"Line Total",
        "dataType":"number",
        "displayType":"input",
        "readOnly": true
    }];

    this.cols_service = [{
        "name":"service_id",
        "title":"Service",
        "dataType":"string",
        "displayType":"select"
    },{
        "name":"qty",
        "title":"Qty",
        "dataType":"number",
        "displayType":"input"
    },{
        "name":"price",
        "title":"Price",
        "dataType":"number",
        "displayType":"input"
    }];

    this.initItemsView = ()=>{
        mThis.tblItemProduct();

        mThis.self.on('click','.tab-item',function(e){
            e.preventDefault();
            el = $(this).data("viewname");

            switch(el){
                case 'product':{
                    mThis.tblItemProduct();
                    $('.tab-item').css({"backgroundColor":"transparent",
                    "border":"none"});
                    $(this).css({"border-bottom":"1.5px solid green",
                    "backgroundColor":"rgb(228 242 228)",
                    "padding":"10px",
                    "borderRadius":"10px"});
                    break;
                }
                case 'service':{
                    mThis.tblItemService();
                    $('.tab-item').css({"backgroundColor":"transparent","border":"none"});
                    $(this).css({"border-bottom":"1.5px solid green","backgroundColor":"rgb(228 242 228)","padding":"10px","borderRadius":"10px"});
                    break;
                }
                default:
                    mThis.tblItemProduct();
            }
        });
    }

    this.tblItemService = () => {
        mThis.tblServiceItems = new ItemsView('_inv_items_panel',{
            columns: mThis.cols_service,
            showColumnHeaders: true,
            showAddLineButton: true,
            validateColumns: {'item_id':'string','qty':'number','price':'number'},
        });
    }

    this.tblItemProduct = () => {
        mThis.tblProductItems = new ItemsView('_inv_items_panel',
        {
            columns: mThis.cols_product,
            showColumnHeaders: true,
            showAddLineButton: true,
            validateColumns: {'item_id':'string','qty':'number','price':'number'},
            onItemChange:(selOp, col_name, td) => { 
                //todo: It seems this event is fired two times and need to be fixed
                let tr = td.parentNode;
                //set item sku  
                mThis.setItemInfo(col_name, tr);
            },
            onInputChange:(el,col_name,td)=>{
                let tr = td.parentNode;  
                mThis.setLineTotal(tr);
            },
                onItemDeleted:(tr)=>{
                mThis.setTotals(null);
            }
        });
    }

        //setInvoiceItemInfo()
        this.setItemInfo = (col_name, tr) => {
            if (col_name === 'item_id') {
                let d = mThis.tblProductItems.getDataRow(tr);
                let p = { 'id': d.item_id };
    
                vsapi.call(`${main_view.base_url}/api/inventory/item-info`, p).then(res => {
                    if (res.status_code === 200){
                        let item = res.data?res.data:{};
                        mThis.tblProductItems.setCellValue(tr, 'sku', StringSanitizer.sanitizeOut(item.sku));
                        let price = item.ws_selling_price;
                        if (InvoiceSettings.default_price_type ==='retail') price = item.selling_price;  
                        mThis.tblProductItems.setCellValue(tr, 'price',price);
                        mThis.tblProductItems.setCellValue(tr, 'qty',1);
                        mThis.tblProductItems.setCellValue(tr, 'tax_rate',item.sales_tax_rate>=0? item.sales_tax_rate:0);
                        mThis.setLineTotal(tr);
                    }
                });
            }
        }
    
        this.calculateInvoiceDiscount = (discount=0,sub_total=0) =>{
            discount = isNaN(discount)?0:discount;
            //sub_total = isNaN(sub_total)?0:sub_total;
           let discount_type = InvoiceSettings.default_discount_type;

           if(discount_type==='percentage' || discount_type==='percent'){
              return {
                'discount_type':'percentage',
                'discount_percent':discount,
                'discount_amount': Number((sub_total * discount/100))
              };
           }else{
                return {
                    'discount_type':'amount',
                    'discount_percent':Number((discount * 100)/sub_total),
                    'discount_amount': discount
                };
           }
        }

      
        this.getCurrencySymbol = (l)=>{
            //mThis.currency_symbol is the currently displayed invoice's currency_symbol
            return mThis.currency_symbol? mThis.currency_symbol:InvoiceSettings.currency.symbol;
        }
    
        this.setLineTotal = (tr)=>{
            let cur_symbol = mThis.getCurrencySymbol(); 
            let d = mThis.tblProductItems.getDataRow(tr);
            
            let price = parseFloat(d.price); 
            let qty = parseFloat(d.qty);
            let discount_percent = parseFloat(d.discount_percent);
            let line_total = price * qty;
            let discount_amt = line_total * discount_percent/100;
            
            let tax_rate = parseFloat(d.tax_rate); //Not sales_tax_rate here
            let tax_amount = (line_total - discount_amt) * tax_rate/100; 
            line_total = isNaN(line_total)? 0:line_total - discount_amt + tax_amount;
            d.line_total = line_total;
            mThis.tblProductItems.setCellValue(tr, 'line_total',d.line_total);
            mThis.setTotals(cur_symbol);
        }
     
        //Calculate Totals on invoice form. Totals include: sub_total, total tax amount, invoice's discount, grand_total
        this.setTotals = (cur_symbol =null)=>{
            if (!cur_symbol) cur_symbol = mThis.getCurrencySymbol(); 
            let sub_total =0;
            let total_tax =0;
            let items = mThis.tblProductItems.getItems();
            (items || []).map(i =>{
                //*** IMPORTANT NOTE: i.line_total inludes Discount and Tax Amount for each item
              
                let line_total = parseFloat(i.line_total);
                let tax_rate = parseFloat(i.tax_rate);
                let amount_before_tax = (line_total*100)/(100+tax_rate);
                let tax_amt = line_total - amount_before_tax;
                total_tax += parseFloat(tax_amt);
                sub_total += parseFloat(line_total);
            });
            sub_total = isNaN(sub_total)? 0:sub_total;
            total_tax = isNaN(total_tax)? 0:total_tax;
            
            //Invoice discount is applied on Invoice's total before tax (that means base amount not including tax yet)
            //discountInfo holds info about invoice's overall discount only (discount_type, discount_amount, discount_percent)
            let discount_base = sub_total - total_tax;
            let discountInfo = mThis.calculateInvoiceDiscount(mThis.elSummary_discount.val(),Number(discount_base));

            //if(isNaN(invoice_discount_percent)) invoice_discount_percent =0;
            //let invoice_discount_amt = sub_total * invoice_discount_percent/100;
            //if(isNaN(invoice_discount_amt)) invoice_discount_amt =0;
            let grand_total = Number(sub_total - discountInfo.discount_amount).toFixed(2);
            //sub_total already includes tax amount. so "total_tax" is just ONLY displayed at bottom invoice
            mThis.elSummary_subTotal.text([cur_symbol,' ',sub_total].join(''));
            mThis.elSummary_taxAmount.text([cur_symbol,' ',Number(total_tax).toFixed(2)].join('')); //display ONLY for user's information
            mThis.elSummary_grandTotal.text([cur_symbol,' ',grand_total].join(''));
            mThis.elSummary_balanceDue.text([cur_symbol,' ',grand_total].join(''));
        }
        
    //Call to function to initialize ItemsView
    this.initItemsView();
 
    this.elSummary_discount.on('keyup',(e)=>{
        //refresh total amounts and amount Due
        mThis.setTotals();
    });

    //When user click on Plus sign to create new customer on the fly
    this.lnkAddInvoice.on('click', (e) => {
        e.preventDefault();
        let op = {
            'id': 0,
            //Show this Receipt Dialog again after closing the CustomerDialog
            "previousComponent": mThis,
            "previousComponentOptions": mThis.options,
            "onClose": res => {
                if (res.status_code === 200) {
                    alert('New Customer created => ' + JSON.stringify(res));
                }
            }
        };
        CustomerDialog.show(op);
    });

    //btnSaveInvoice
    this.btnSave.on('click', (e) => {
        e.preventDefault();
        let p = mThis.getDataForm();
        let api_endpoint = `${mThis.base_url}/api/invoice/create`;
        if(p.id>0) api_endpoint = `${mThis.base_url}/api/invoice/update`;
        vsapi.call(api_endpoint,p,'POST',null).then(res => {
            if(res.status_code === 200)
            {
                p.created = !p.id;
                if(p.created)
                    cv_interact.success(['Invoice ',res.data.ref_number,' created!'].join(''));
                else cv_interact.info(['Invoice ',res.data.ref_number,' updated!'].join(''));
                if (typeof mThis.onClose === 'function') mThis.onClose(p);
                mThis.self.modal('hide');
            }
            else
                cv_interact.error(res.error_message);
        });
       
    });

    this.loadInvoiceFormOptions = (onFinish = null) => {
        vsapi.call(`${mThis.base_url}/api/inventory/settings/invoice-form-options`,null).then(res => {
            if(res.status_code === 200){
                let data = res.data;
                onFinish(data);
            }
        });
    }

    //set d = NULL for clearing form
    this.setData = (d=null) => {
        if(!d) d ={};
        //if(d.currency_code) cur_symbol = ExchangeManager.currencies[d.currency_code].symbol;
        let cur_symbol = d.currency_symbol? d.currency_symbol:InvoiceSettings.currency.symbol;
        //Store currency symbol for use in other places
        mThis.currency_symbol = cur_symbol;
        mThis.elReceiptNumber.html(d.ref_number);
        mThis.self.find('.data-input').each(function (){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select')) el.val(d[f]).trigger('change');
            else el.val(d[f]);
        });
        //if (!d.items) d.items = [];  
        mThis.tblProductItems.setData(d.items);

        //NOTE: in database table invoices.amount represent the invoice's SubTotal
        d.sub_total = d.amount;
        d.grand_total = d.amount_due;

        mThis.elSummary_discount.val(d.discount_type ==='percentage'? d.discount_percent : d.discount_amount);
        mThis.elSummary_subTotal.text([cur_symbol,' ',d.sub_total].join(''));
        mThis.elSummary_taxAmount.text([cur_symbol,' ',Number(d.tax_amount)].join('')); //display ONLY for user's information
        mThis.elSummary_grandTotal.text([cur_symbol,' ',d.grand_total].join(''));
        mThis.elSummary_balanceDue.text([cur_symbol,' ',d.grand_total].join(''));
    }

    //getFormData() for createing and updating invoice
    this.getDataForm = () => {
        let p = {
            'id':(mThis.options || {}).id
        };

        mThis.self.find('.data-input').each(function () {
            let el = $(this);
            let f = el.data('field');

            p[f] = el.val();
        });
        p.discount = mThis.elSummary_discount.val();
        p.discount_type = InvoiceSettings.default_discount_type;
        p.items = mThis.tblInvoiceItems.getItems();
        return p;
        //NOTE To DARA: this line cause error invalid data input. No need of data prop
        //return {'data': p};
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.onClose = options.onClose;
        mThis.options = options;

        mThis.loadInvoiceFormOptions((d) => {
            mThis.tblProductItems.setSelectOptions('item_id',d.items);
            VSUtil.setComboItems(mThis.SelectPmtTerms,d.pmt_terms,'code','description',true,'(select terms)',null);
            VSUtil.setComboItems(mThis.SelectCustomer,d.customers,'id','customer_name',true,'(select customer)',null);

            if(options.id>0){
                mThis.Invoice_Title.text("Modify Invoice");
                let p = {'id':options.id};
                vsapi.call(`${mThis.base_url}/api/invoice/details`,p).then(res => {
                    if(res.status_code === 200){
                        let d = res.data;
                        let items = StringSanitizer.sanitizeObject(d.items);
                        d.items = null;
                        let invoice = StringSanitizer.sanitizeObject(d);
                        invoice.items = items;
                        mThis.setData(invoice);
                        mThis.self.modal({
                            backdrop: 'static'
                        });
                    }
                });
            }else{
                mThis.Invoice_Title.text("New Invoice");
                mThis.setData(null);
                mThis.self.modal({
                    backdrop: 'static'
                });
            }
        });
    }
}
/*End of Invoice Dialog*/

//begin::PaymentDialog
let PaymentDialog = new function (){
    let mThis = this;
    this.self = $(`#_ivc_dlgPayment`);
    this.btnSave = $('#_ivc_dlgPayment_btnSave');
    this.invoiceInfoPanel = $('#_ivc_dlgPayment_invoice_info');
    this.elTitle = $('#_ivc_dlgPayment_title');
    this.options = null;

    this.btnSave.on('click',(e)=>{
       let api_end_point =`${main_view.base_url}/api/invoice-payment/receive`; 
       if(mThis.options.id>0) api_end_point =`${main_view.base_url}/api/invoice-payment/update`;
       //else api_end_point =`${main_view.base_url}/api/invoice-payment/receive`;

       let p = mThis.getFormData();
       vsapi.call(api_end_point,p).then(res=>{
          if(res.status_code ===200){
             if (typeof mThis.options.onClose ==='function') mThis.options.onClose(res.data);
             mThis.self.modal('hide');
          }else cv_interact.error(res.error_message);
       });
    });

    this.prepareFormOptions = (invoice_id,onFinish)=>{
        let d = {};
        onFinish(d);
    }

    this.getFormData = ()=>{
       let p = {'id':mThis.options.id};
       p.invoice_id = mThis.options.invoice_id;
       mThis.self.find('.data-input').each(function(){
         let el = $(this);
         let f = el.data('field');
         p[f] = el.val(); 
       });
       return p;
    }

    //display data for Edit case
    this.displayPaymentData = (d ={})=>{
       let invoice = (d ||{}).invoice;
     if (!invoice) invoice = {};
         let open_amount = parseFloat(invoice.amount_due) - parseFloat(invoice.amount_paid);
         let cur_symbol = (ExchangeManager.currencies[invoice.currency_code] || {}).symbol;
         if(!cur_symbol) cur_symbol='$';
         open_amount = (open_amount>=0 || open_amount <0)? open_amount:0;
         invoice.open_amount = [cur_symbol, open_amount].join('');
         invoice.amount_due = [cur_symbol, invoice.amount_due].join('');
         invoice.amount_paid = [cur_symbol, invoice.amount_paid?invoice.amount_paid:0].join('');
       
       mThis.invoiceInfoPanel.find('.display-field').each(function(){
        let span = $(this);
        let f = span.data('name');
        span.html(invoice[f]);
       });

       let pmt = (d || {}).payment;
       mThis.self.find('.data-input').each(function(){
         let el = $(this);
         let f = el.data('field');
         if(el.is('select')) el.val(pmt[f]).trigger('change');
         else el.val(pmt[f]);
       });
    }

    this.show =(options)=>{
       if(!options) options = {};
       mThis.options = options;
       let title ="Receive Payment";
       if(options.id > 0){
          title ="Modify Payment";
       }

       mThis.prepareFormOptions(options.invoice_id,(d)=>{
         if (options.id > 0){
                let p = {'id':options.id,'invoice_id':options.invoice_id};
                vsapi.call(`${main_view.base_url}/api/invoice-payment/details-with-summary`,p).then(res=>{
                    if(res.status_code ===200){
                        let d = res.data;
                        d.invoice = StringSanitizer.sanitizeObject(d.invoice);
                        d.payment = StringSanitizer.sanitizeObject(d.payment);
                        mThis.displayPaymentData(d);
                        mThis.self.modal({
                        'backdrop':'static'
                        });
                        mThis.elTitle.html(LocaleManager.trans(title,'titles'));
    
                    }else cv_interact.error(res.error_message);
                });
                return;
            }

            //get basic info of the invoice (ref_number, amount_due, amount_paid)
            let p = {'id':options.invoice_id};
            vsapi.call(`${main_view.base_url}/api/invoice/basic-info`,p).then(res=>{
                if(res.status_code===200){
                    let d = {};
                    d.invoice = StringSanitizer.sanitizeObject(res.data);
                    d.payment = {};
                    mThis.displayPaymentData(d);
                    mThis.self.modal({
                        'backdrop':'static'
                    });
                    mThis.elTitle.html(LocaleManager.trans(title,'titles'));
                }else cv_interact.error(res.error_message);
            }); 
       });
    }
}
//end::PaymentDialog

document.addEventListener('DOMContentLoaded',(e)=>{
    InvoicesComponent.init();
});