// 'use strict';
// var AccountingComponent = new function(){
//     const mThis = this;
//     this.title_prop = "Accounting";
//     this.form_data = null;
//     this.self = main_view.appContent.children('#_main_accountingComponent');
//     this.base_url = main_view.base_url;
//     this.btnNewInvoice = this.self.find('#_new_invoice');

//     this.elFilter_start_date = this.self.find('#_invoice_filter_start_date');
//     this.elFilter_end_date = this.self.find('#_invoice_filter_end_date');
//     this.elFilter_invoice_type = this.self[0].querySelector('#_filter_invoice_type');
//     this.elFilter_customer_status = this.self[0].querySelector('#_filter_status_type');
//     this.elSearch = this.self.find('#_search_invoice');
//     this.btnSearch = this.self.find('#_btnSearch');
//     this.btnPrint = this.self.find('#_invoice_btnPrint');
//     this.btnPDF = this.self.find('#_invoice_btnPDF');
//     this.btnExcel = this.self.find('#_invoice_btnExcel');

//     this.div_filter_fields = this.self[0].querySelector('#_cus_filter_fields');


//     mThis.cols = [
        
//         {
//             className: 'col_action align-middle',
//             data: function (data, row, display) {
//                 let html = ['<div class="dropdown d-block ">',
//                     '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-name="', data.name, '"data-status="', data.status_code, '"     class="btn_pickup_action " aria-haspopup="true" aria-expanded="false">',
//                     '<i class="fa-solid fa-list" style="color:#8DC63F;font-size:1.5em"></i>',
//                     '</a>',
//                     '</div>'].join('');
//                 return html;
//             },
//         },
//         {
//             title:"Date",
//             data:(data,index,tr)=>{
//               return [`<span class="d-block fw-semibold">`,data.create_user,`</span><span class="d-block p-1"><small>`,data.create_date,`</small></span>`].join('');
//             }
//          },
//             {
//                 className: "customer_code",
//                 data: function (data,index,tr) {
//                     return ['<div><span class="rounded-3 customer-code">', data.customer_code, '</span></div>'].join('');
//                 },
//                 title: 'ID'
//             },
//             {
//                 className: "customer_name",
//                 data: (data,index,tr)=>{
//                     const customer_info = ['<span class="customer-name d-block">',data.customer_name,'</span>','<span class="sender-code d-block text-center text-info">',data.sender_code,'</span>'].join('');
//                     return customer_info;
//                 },
//                 title: 'Name'
//             },
//             {
//                 className: "invoice_type",
//                 title: 'Invoice Type',
//                 data: (data,index,tr)=>{
//                     return [`<div class="d-flex gap-2"><i class="fa fa-motobike"></i><span class="text-nowrap">`,data.invoice_type,`</span></div>`].join('');
//                 },
//             },
//             {
//                 title: "Amount",
//                 className: "amount",
//                 data: (data, index, tr) => {
//                     const cur_symbol = data.currency_symbol || "$";
//                     const amount = Number(data.amount).toLocaleString("en-US", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                     });
//                     return [
//                         "<span><span>",
//                         cur_symbol,
//                         ' </span><span class="amount">',
//                         amount,
//                         "</span></span>",
//                     ].join("");
//                 },
//             },
        
   
//             {
//                 className: "discount_percent",
//                 data: (data, index, tr) => {
//                     let pickup_address = mThis.transformPickupAddress(data.pickup_address,data.map_url,data.sender_phone);
//                     return [`<span class="long-text-wrap-250">`,(pickup_address?pickup_address:'No pickup address'),`</span>`].join('');
//                 },
//                 title: 'Dis %'
//             },
//             {
//                 className: "discount_amount",
//                 data: (data, index, tr) => {
//                     let pickup_address = mThis.transformPickupAddress(data.pickup_address,data.map_url,data.sender_phone);
//                     return [`<span class="long-text-wrap-250">`,(pickup_address?pickup_address:'No pickup address'),`</span>`].join('');
//                 },
//                 title: 'Dis $'
//             },
//             {
//                 className: "discount_type",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'Dis Type'
//             },
//             {
//                 className: "amount_due",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'Amount Due'
//             },
//             {
//                 className: "issue_date",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'Dis Issue_date'
//             },
//             {
//                 className: "due_date",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'Due_date'
//             },
//             {
//                 className: "pmt_terms",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'pmt_terms'
//             },
//             {
//                 className: "public_remarks",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'public_remarks'
//             },
//             {
//                 className: "private_remarks",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'private_remarks'
//             },
//             {
//                 className: "due_date",
//                 data: (data, index, tr) => {
//                     return [`<span class="long-text-wrap-250">`,pickup_address,`</span>`].join('');
//                 },
//                 title: 'Dis Due_date'
//             },
       
          
//             {
//                 className: "order_status status",
//                 data: function (data, index, tr) {
//                     if (!data.order_status || data.order_status == '') data.order_status = '?';
//                     const color_class = mThis.getOrderStatusColorClass(data.status_id);
//                     return ['<a class="change-order-status order-status" data-statusid="', data.status_id, '" data-id="', data.order_id, '" data-senderid="', data.sender_id, '" href="javascript:void(0)"><span class="order_status ',color_class,'">', data.order_status, '</span></a>'].join('');
//                 },
//                 title: 'Status'
//             }
        
//     ];

  
    

//     this.init = () => {
//         if (mThis.initAlready) return;
//         mThis.invoiceListView = new ListView('_invoice_list', {
//             'fetchApi': `${main_view.base_url}/abm/customers/list`,
//             'columns': mThis.cols,
//             'apiCluster': main_view.apiCluster,
//             'tableClass': "table header-light-blue header-uppercase",
//             'rowCreated': (data, index, tr) => {
//                 tr.dataset.id = data.id;
//                 mThis.store_agents[data.id] = {
//                     code: data.code,
//                     name: data.name,
//                     user_id: data.user_id,
//                     phone_number: data.phone_number
//                 };
//             },
//             'beforeRender': () => { }
//         });

       


       
//         mThis.tblInvoices = mThis.invoiceListView.getTable();

    


//         mThis.initAlready = true;
//     }
  
//     this.show = (options = {}) => {
//         mThis.init(); // NOTE: init once only based on mThis.initAlready = true or false
//         mThis.options = options;
//         main_view.setTitle(mThis.title_prop);
//             mThis.invoiceListView.showPage()
//                 mThis.self.siblings().hide();
//                 mThis.self.hide().fadeIn(250);
            
//     }




// }
'use strict';
var InvoicesComponent = new function(){
    const mThis = this;
    this.title_prop = "Invoices";
    this.self = main_view.appContent.children('#_main_invoicesComponent')[0];
   

    this.headerList = [];

    this.init = () => {
        if(mThis.initAlready) return;


        


        mThis.initAlready = true;
    }



    this.show = (options) => {
        mThis.init();
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            
        
    }
}
