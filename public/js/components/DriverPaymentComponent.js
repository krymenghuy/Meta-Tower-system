'use strict'
//## begin::DriverPaymentComponent
var DriverPaymentComponent = new function () {
    let xThis = this;
    this.title_prop = "Driver Transactions";
    this.self = main_view.appContent.children('#_main_driverPmtComponent');
    this.base_url = main_view.base_url;
    this.cur_view ='dpmt_deliveries'; 
    
    this.show = (options = null) => {
        main_view.setTitle(xThis.title_prop);
        xThis.self.siblings().hide();
        xThis.self.fadeIn(200);
        DriverTabView.setActiveTab(xThis.cur_view);
    }
}
//## end::DriverPaymentComponent

//begin::DriverTabView DriverPaymentTabView
var DriverTabView = new function () {
    let mThis = this;
    this.self = DriverPaymentComponent.self.find('#_dpmt_driverTabView');
    this.base_url = main_view.base_url;
    this.cur_view = '';
    this.tabs = {};
 
    /** Collect javascript object "mThis.tabs" that contains tab elements 
     tabs = { 
        "dpmt_deliveries": {"tabButton","tabView"},
        "dpmt_payments":{...},
        "dpmt_reports":{ ... } 
     } 
     * 
    */
    mThis.self[0].querySelectorAll('div.tab-header > a').forEach(tabButton =>{
        mThis.tabs[tabButton.dataset.viewname] ={
            "tabButton":tabButton,
            "tabView": mThis.self[0].querySelector(['#',tabButton.dataset.target].join(''))
        }
    });

    this.self.on('click', 'div.tab-header>a.tab-button', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        let view_name = $(this).data('viewname').toLowerCase();
        mThis.setActiveTab(view_name);
    });

    /** Set active tab view */
    this.setActiveTab = (view_name)=>{
        for(let key in mThis.tabs){
            let t = mThis.tabs[key];
            if(key ==view_name){
                 t.tabButton.classList.add('active');
                 t.tabView.style.display='block';
                 mThis.initContentView(view_name);
            }else{
                t.tabButton.classList.remove('active');
                t.tabView.style.display='none';
            }
        }
    }

    this.initContentView = (view_name) => {
        if (view_name == 'dpmt_deliveries') {
            mThis.TabPanel_deliveries.show();
        } else if (view_name == 'dpmt_payments') {
            mThis.TabPanel_payments.show();
        } else if (view_name == 'dpmt_reports') {
            mThis.TabPanel_reports.show();
        }
    };

    //##BEGIN::tabPanel Defintions
    //begin::Deliveries tabview | DeliveriesTab
    this.TabPanel_deliveries = new function () {
        let mThis = this;
        this.base_url = main_view.base_url;
        this.self = DriverPaymentComponent.self.find('#_dpmt_panel_deliveries');
        this.tblItems = this.self.find('#_dpmt_tblItems');

        this.elFilter_warehouse = this.self.find('#_dpmt_filter_warehouse');
        this.elFilter_driver = this.self.find('#_dpmt_filter_driver');
        this.elFilter_start_date = this.self.find('#_dpmt_filter_start_date');
        this.elFilter_end_date = this.self.find('#_dpmt_filter_end_date');
        this.filterPanel = this.self.find('#_dpmt_filter_panel');

        this.elSearchPackage = this.self.find('#_dpmt_search');
        this.btnSearch = this.self.find('#_dpmt_btnSearch');
        this.btnToggleFilter = this.self.find('#_dpmt_btnToggleFilter');

        this.btnPrint = this.self.find('#_dpmt_btnPrint');
        this.btnPDF = this.self.find('#_dpmt_btnPDF');
        this.btnExcel = this.self.find('#_dpmt_btnExcel');

        this.btnSelectAll = this.self.find('#_dpmt_btnSelectAll');
        this.btnReceivePmt = this.self.find('#_dpmt_btnReceivePmt');
        this.lblBalanceDue = this.self.find('#_dpmt_balance_due');

        //this.tblItems_body = $('this.tblItems_body');


        //begin::init() Deliveries Tab Panel
        this.init = () => {
            if (mThis.initAlready) return;
            if (main_view.MULTI_WAREHOUSE_OP == 0) mThis.elFilter_warehouse.hide();
            mThis.loadFilterData();

            mThis.btnToggleFilter.on('click', (e) => {
                let driver_name = mThis.elFilter_driver.find('option:selected').text();
                if (!mThis.elFilter_driver.val()) {
                    cv_interact.warning('One driver should be selected');
                    return;
                }
                let op = { 'title': 'Filter Transactions', 'driver_name': driver_name };
                FilterDialog_dpmt.show(op, (d) => {
                    if (d) {
                        mThis.displayDeliveryItemsByDriver(null,2);
                    }
                });
            });

            mThis.filterPanel.find('.dpmt_filter_field').on('change', function (e) {
                if (mThis.elFilter_driver.val() > 0 && mThis.unpaidItemCount > 0){
                      mThis.btnSelectAll.show();
                }else  mThis.btnSelectAll.hide();
                if (mThis.filter_enabled) mThis.displayDeliveryItemsByDriver(null,3);
            });

            mThis.btnSearch.on('click', function () {
                mThis.displayDeliveryItemsByDriver(null,4);
            });

            mThis.elSearchPackage.on('keyup', function (e) {
                e.preventDefault();
                clearTimeout(mThis.search_timeout);
                mThis.search_timeout = setTimeout(() => {
                    mThis.displayDeliveryItemsByDriver(null,5);
                }, 250);
            });

            mThis.btnSelectAll.on('click', function (e) {
                e.preventDefault();
                let sel = mThis.btnSelectAll.data('select');
                mThis.selectAllRows(!(sel == 1));
            });

            mThis.btnReceivePmt.on('click', function (e) {
                e.preventDefault();
                //getSelectionInfo() return json object {'ids','total','packages','error_message'}
                //error when user select wrong status such as "Failed" for receiving payment
                let allowed_status = 8; //Allow user to select on Delivered packages for receiving payment
                let sel = mThis.getSelectionInfo(allowed_status, 'សូមជ្រើសរើសយកតែទំនិញដែលបានដឹកហើយ!');
                let ids = sel.ids;
                let trans_type = sel.total >= 0 ? 'receive':'pay';
                let amount = Math.abs(sel.total);
                //pacakges = sel.pacakges // array of {'package_id','adjust_amount','adjust_notes'} to be updated to table "pacakge"
                if (!ids) {
                    cv_interact.warning('សូមជ្រើសរើសទំនិញដែលបានដឺកហើយ!');
                    return;
                }
                if (sel.error_message) {
                    cv_interact.error(sel.error_message);
                    return;
                }
                let driver_id = mThis.elFilter_driver.val();
                let driver_name = mThis.elFilter_driver.find('option:selected').text();
                if (driver_id <= 0 || !driver_id) {
                    cv_interact.warning('No driver selected');
                    return;
                }
             
                if (amount ==0 && driver_id > 0){
                    let p = {
                      "packages":sel.ids, /** sel.ids = 122,1256,2567, ... */
                      "driver_id":driver_id,
                      "package_count":sel.package_count,
                      "currency_code":"USD",
                      "total":amount
                      //"remarks":"Zero settlement"
                    };
                    cv_interact.confirm(`ទូទាត់បញ្ចប់ទឹកប្រាក់ 0 USD សំរាប់ ${sel.package_count} កញ្ចប់`,{"context":"update","title":"Driver Settlement"},e=>{
                        if(e){
                             vsapi.call(`${main_view.base_url}/api/driver/payment/settle-zero`,p,null,null).then(res=>{
                                if(res.status_code ===200){
                                    mThis.displayDeliveryItemsByDriver(null,6); 
                                    cv_interact.info(['Settlement for zero amount for ',d.success_count,' items but in waiting for approval'].join(''));
                                }else cv_interact.error(res.error_message);
                             });
                        }
                    });
                    return;
                  }
  
                  const op = {
                    "id":driver_id,
                    "prep_api":`${main_view.base_url}/api/driver/payment/form-options`,
                    "type":trans_type,
                    "agent_name":driver_name,
                    "showCheck":false,
                    //"currency":mThis.currency_code,
                    "amount":amount,
                    // "exchangeInfo":{
                    //    "currencyPair":"USDKHR",
                    //    "buyRate":"4100"
                    // },
                    "extraField":{
                        "label":"Package Count: ",
                        "value":[sel.package_count,' pcs'].join(''),
                      }, 
                    "autoClose":false,
                    "onClose":(p,btnOK)=>{
                      p.agent_id = driver_id;
                      p.agent_type='Driver';
                      p.package_count = sel.package_count;
                      p.packages = sel.ids;

                      const api_method = trans_type =='receive'? 'receive':'pay';
                      vsapi.call(`${main_view.base_url}/api/driver/payment/${api_method}`,p,btnOK,null).then(res=>{
                          if(res.status_code ===200){ 
                              mThis.displayDeliveryItemsByDriver(null,7); 
                              PmtDialog.close();
                              cv_interact.success('Driver Payment succeeded!');
                          }else cv_interact.warning(res.error_message);
                      });
                    }
                }
                PmtDialog.show(op);
            });

            //print trip's information (Depart time, destination, status, package count)
            mThis.tblItems.on('click', 'a._dpmt_print_barcode', function (e) {
                e.preventDefault();
                let barcode = $(this).data('barcode');
                window.open([main_view.base_url, '/package_barcode/', barcode].join(''), '_blank');
            });

            mThis.tblItems.on('change', 'input._dpmt_check', function (e) {
                e.preventDefault();
                let checked = $(this).is(':checked');
                let tr = $(this).closest('tr');
                let td = tr.find('td.total');
                if (td) td.toggleClass('billing-paid-text');
 
                //td.checkbox>input[type="checkbox"
                mThis.setRowReadOnly(tr, checked ? false : true);
            });

            mThis.tblItems.on('change', 'tbody>tr>td.df_payer> .col-input', function (e) {
                let tr = $(this).closest('tr');
                mThis.calculateTotal(tr, 'df_payer');
            });

            // mThis.tblItems.on('keyup','tbody>tr>td.fees>input.col-input',function(e){
            //     let tr = $(this).closest('tr');
            //     mThis.calculateTotal(tr);
            // });

            mThis.tblItems.on('keyup', 'tbody>tr>td.cod_amount>input.col-input', function (e) {
                let tr = $(this).closest('tr');
                mThis.calculateTotal(tr, 'cod_amount');
            });

            mThis.tblItems.on('keyup', 'tbody>tr>td.forwarding_cost>input.col-input', function (e) {
                let tr = $(this).closest('tr');
                mThis.calculateTotal(tr, 'forwarding_cost');
            });

            // mThis.tblItems.on('keyup','tbody>tr>td.total>input.col-input',function(e){
            //     let tr = $(this).closest('tr');
            //     mThis.calculateTotal(tr,$(this).val());
            // });

            mThis.initAlready = true; //Prevent second time initializtion
        }
        //end:: init() Deliveries Tab Panel

        this.loadFilterData = (onFinish) => {
            //DriverPaymentComponent.remembered_filter  
            let def = mThis.remembered_filter ? mThis.remembered_filter : {};
            if (!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;

            if (mThis.form_data) {
                VSUtil.setComboItems(mThis.elFilter_warehouse, mThis.form_data.warehouses, 'id', 'warehouse_name', false, '(Select Warehouse)', def.warehouse_id);
                VSUtil.setComboItems(mThis.elFilter_driver, mThis.form_data.drivers, 'id', 'driver_name', false, '(Select Driver)', def.driver_id);
                //VSUtil.setComboItems(mThis.elFilter_status,mThis.form_data.statuses,'status_id','status_name',false,'(All Status)',def.status_id); 
                if (typeof onFinish == 'function') onFinish();
                return;
            }
            vsapi.call([main_view.base_url, '/api/merchant/filter-options'].join(''), null,null,main_view.apiCluster).then(res => {
                if (res.status_code === 200) {
                    const data =  StringSanitizer.sanitizeObject(res.data,null,['sender_name']);
                    (data.drivers || []).unshift({ 'id': -1, 'driver_name': '(All Drivers)' });
                    (data.drivers || []).unshift({ 'id': null, 'driver_name': '(Select Driver)' });

                    VSUtil.setComboItems(mThis.elFilter_warehouse, data.warehouses, 'id', 'warehouse_name', false, '(Select Warehouse)', def.warehouse_id);
                    VSUtil.setComboItems(mThis.elFilter_driver, data.drivers, 'id', 'driver_name', false, '(Select Driver)', def.driver_id);
                    //VSUtil.setComboItems(mThis.elFilter_status,data.statuses,'status_id','status_name',false,null,def.status_id);
                    mThis.form_data = data;
                    if (typeof onFinish == 'function') onFinish();
                }
            });
        };

        this.setRowReadOnly = (tr, readOnly) => {
            let elCODAmount = tr.find('td.cod_amount>input.col-input');
            let elAmount = tr.find('td.forwarding_cost>input.col-input');
            let elNotes = tr.find('td.notes>input.col-input');
            let elDFP = tr.find('td.df_payer>.col-input');
            //driver_total
            let elTotal = tr.find('td.total>input.col-input');
            elCODAmount.prop('readOnly', readOnly);
            elAmount.prop('readOnly', readOnly);
            elNotes.prop('readOnly', readOnly);
            //elTotal.prop('readOnly',readOnly);
            elDFP.prop('disabled', readOnly);
        }

        /** if driver_total > 0 then use @driver_total as basis to adjust value of COD (depending on df_payer) **/
        this.calculateTotal = (tr, col_name = null) => {
            if (!tr) return;
            let cur = tr.data('cursymbol');
            if (!cur) cur = '$';
            let elTaxiFee = tr.find('td.forwarding_cost>input.col-input');
            let elCODAmount = tr.find('td.cod_amount>input.col-input'); // tr.find('td.cod_amount>span.value');
            let elFees = tr.find('td.fees>input.col-input');
            let elTotal = tr.find('td.total>.col-input');
            let elDFP = tr.find('td.df_payer> .col-input');

            let total = 0; // parseFloat(elTotal.val());

            //let elTotal = (driver_total> 0)?driver_total:tr.find('td.total>span.value');
            let df_payer = (elDFP.val() + '').toLowerCase();
            let taxi_fee = Math.abs(parseFloat(elTaxiFee.val()));
            if (isNaN(taxi_fee)) taxi_fee = 0;
            let fees = parseFloat(elFees.val()); //<input type ="number" ...

            //let cod_amount = elCODAmount.val(); //<input> 
            if (df_payer === 'sender') fees = 0;
            let cod_amount = parseFloat(elCODAmount.val());
            total = cod_amount + fees - taxi_fee;
            elTotal.val(Number(total).toFixed(2));
            //elTotal.val(Number(driver_total).toFixed(2));
            //elTotal.data('value',total);
            tr.data('totalnet', Number(total).toFixed(2));
        };

        //select all datatable rows even rows on next paginated pages
        this.selectAllRows = function (selected = true) {
            if (!mThis.table) return;
 
            const sel_max = 500;
            const rows = mThis.table.rows().nodes();
            let i = 0, c;
            do {
                let tr =  $(rows[i]);
                c = tr.find('._dpmt_check');
                if(c.length ===0 || !c) break;
               
                if (i > sel_max -1 && selected) {
                    cv_interact.warning(['Only ', i, ' items selected. ដោយសារវាមានច្រើនលើសពីធម្មតា!'].join(''));
                    break; // This will break out of the do-while loop
                }
            
                c.prop('checked', selected);
                tr.data('selected', selected ? 1 : 0);
                mThis.setRowReadOnly(tr, !selected);
                i++;
            } while (c.length > 0);
            mThis.btnSelectAll.data('select', (selected) ? 1 : 0);
        }


        // this.selectAll = (select) =>{
        //     mThis.tblItems.find('tbody>tr').each(function(){
        //         let x = $(this);
        //         if(select)
        //           x.find('td.checkbox>input[type="checkbox"]').prop('checked',true);
        //         else
        //           x.find('td.checkbox>input[type="checkbox"]').prop('checked',false);
        //         mThis.setRowReadOnly(x,false);  
        //     });
        //   }

        //returns json object {total:0,"packages"'ids':'123,235,...'}
        // NOTE @ids is the array of pacakge_ids to be updated
        //packages is array of {'pacakge_id','driver_adjust_amount','driver_adjust_notes'} for driver only, Not sender
        this.getSelectionInfo = (allowed_status_id, error_message) => {
            let ids = '';
            let total_sum = 0;
            let sel_row_count = 0;
            let err = null;
            let sel_pacakges = [];
            //mThis.tblItems.find('tbody>tr').each() ....;
            let rows = mThis.table.rows().nodes();
            let i = 0;
            let tr = null;
            do {
                tr = rows[i];
                if (!tr) break;
                tr = $(tr);
                if (tr.length === 0) break;
                let el = tr.find('td.checkbox>input[type="checkbox"]');
                let elCODAmount = tr.find('td.cod_amount>input.col-input');
                let elDFP = tr.find('td.df_payer>.col-input');
                let elTaxiFee = tr.find('td.forwarding_cost>.col-input');
                let elRemarks = tr.find('td.notes>input.col-input');
                //let td_net = tr.find('td.total');
                if (el) {
                    if (el.is(':checked')) {
                        let id = tr.data('pid');

                        //let adjust_amount = tr.data('adjustamount'); //driver's adjustment admount
                        let total_net = tr.data('totalnet');
                        //if(td_net) total_net = td_net.data('value'); //total_net = driver_total - adjustment_amount (such as taxi fee that driver paid his cash) 
                        let status_id = tr.data('statusid');
                        if (allowed_status_id && status_id != allowed_status_id) {
                            if (!err || err == '') err = error_message;
                        }
                        //alert(id + ' => '+ total_net);
                        sel_pacakges.push({ 'package_id': id, 'price': elCODAmount.val(), 'driver_total': total_net, 'df_payer': elDFP.val(), 'cod_amount': elCODAmount.val(), 'forwarding_cost': elTaxiFee.val(), 'notes': elRemarks.val() });
                        ids = [ids, ids ? ',' : null, id].join('');
                        total_sum += parseFloat(total_net);
                        sel_row_count++;
                    }
                }
                i++;
            } while (tr);

            //  mThis.table.rows().nodes().each(function(){

            //});
            return { 'ids': ids, 'package_count': sel_row_count, 'total': Number(total_sum).toFixed(2), 'packages': sel_pacakges, 'error_message': err };
        }

        this.displayDeliveryItemsByDriver = function (onFinish = null,called_from=null) {
            mThis.unpaidItemCount = 0;
            let p = FilterDialog_dpmt.getData();
            p.search_value = mThis.elSearchPackage.val();
            //displayItems() | displayPackages() | Packages delivered by driver  get merchant or vendor transactions payments
            vsapi.call([main_view.base_url, '/api/driver/delivery-items'].join(''), p, null, null, main_view.apiCluster).then(res => {
                if (mThis.table) {
                    mThis.tblItems.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblItems.empty();
                    //alert('destroyed => '+  mThis.tblItems.html());
                    mThis.table = null;
                }

                let data = [];

                if (res.status_code === 200) data = StringSanitizer.sanitizeObject(res.data, null, ['cur', 'arrival_time', 'depart_time', 'delivery_time', 'driver_pmt_info', 'sender_pmt_info']); //sanitize except field "cur" currency symbol
                //begin::Set up columns
                //let cnt = 1;
                let my_columns = [
                    {
                        className: 'checkbox dt-body-center',
                        data: function (data, index, tr) {
                            if (data.driver_pmt_status_id == 1 && data.driver_trx_id)
                                return ['<i class="fas fa-check" style="color:green;font-weight:bold;font-size:1em"></i>'].join();
                            else{
                                if ((data.driver_pmt_status_id ==0 || !data.driver_pmt_status_id) && !data.driver_trx_id){
                                    return ['<input type="checkbox" class="checkbox-lg _dpmt_check">'].join();
                                }else
                                  return [`<span class="text-warning fw-semibold p-1">Pending</span>`].join('');  
                            }
                        },
                        title: '#'

                    },
                    {
                        data: function (data, a, b) {
                            return ['<div class="d-flex flex-column">',
                                //'<span style="display:block;margin-right:20px">',data.barcode,'</span>',
                                '<a data-pid="', data.package_id, '" data-barcode="', data.barcode, '" href="javascript:void(0)" class="_dpmt_print_barcode"><i class="fa fa-barcode"></i></a>',
                                //'<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:;" class="_dpmt_check_issue"><i class="fa fa-info" style="font-size:1.2emp; color:green;margin-left:15px"></i> </a>',
                                '<span class="text-left text-muted" style="font-size:0.7em">', data.barcode, '</span>',
                                '</div>'].join('');
                        },
                        title: 'Barcode'
                    },
                    {
                        className: 'driver',
                        data: function (data, index, tr) {
                            return ['<div class="d-flex flex-column" style=";min-width:150px">',
                                '<span class="fw-semibold">', data.driver_name, '</span>',
                                '<span style="font-size:0.8em"><span class="d-block">ដឹកចេញោ </span>',
                                '<button class="btn-dates btn btn-sm btn-outline-success"><span class="fw-semibold">', data.depart_time, '</span></button>',
                                '</div>'].join('');
                            //return ['<div class="d-flex flex-column" style=";min-width:150px"><span class="text-nowrap fw-semibold" style="font-size:0.8em">មកដល់: ',data.arrival_time,'</span><span class="text-nowrap fw-semibold" style="font-size:0.8em">ដឹកចេញ: ',data.depart_time,'</span><span class="text-nowrap fw-semibold" style="font-size:0.8em">ដឹកបាន: ',data.delivery_time,'</span></div>'].join('');
                        },
                        title: 'Driver'
                    },
                    {
                        className: 'sender',
                        data: function (data, a, b) {
                            return data.sender_name;
                        },
                        title: 'Sender'
                    },
                    {
                        className: 'receiver', //class is very important for retrieving value @delivery_type to start trip
                        data: function (data, a, b) {
                            return data.receiver_phone;
                        },
                        title: 'Receiver'
                    },
                    {
                        className: 'status',
                        data: function (data, a, b) {
                            let btn_class;
                            if (data.status_id == 9) btn_class = "btn btn-sm btn-outline-danger";
                            else if (data.status_id == 8)
                                btn_class = "btn btn-sm btn-outline-success";
                            else
                                btn_class = "btn btn-sm btn-outline-primary";
                            return ['<button data-statusid="', data.status_id, '" role-"button" class="btn-status ', btn_class, '">', data.status, '</button>'].join('');
                        },
                        title: 'Status'
                    },
                    // {
                    //     className:'cod_amount',
                    //     data:function(data,a,b){
                    //         return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.cod_amount,'</span>'].join('');
                    //     },
                    //     title:'COD'
                    // },
                    {
                        className: 'cod_amount', //This cssClass is very important to access Adjustment amount
                        data: function (data, a, b) {
                            if (data.driver_pmt_status_id == 1) {
                                data.cod_amount = Number(data.cod_amount).toFixed(2);
                                return ['<span class="billing-cod_amount">', data.cur, data.cod_amount, '</span>'].join('');
                            }
                            else return ['<input type="number" style="min-width:80px" class="form-control col-input" value="', data.cod_amount, '" readOnly="true">'].join('');
                        },
                        title: 'COD'
                    },
                    {
                        className: 'df_payer',
                        data: function (data, a, b) {
                            //NOTE: on rowCreated event => set value of this cell to 'Sender' or 'Receiver' 
                            return ['<select class="form-control col-input" disabled="true" style="min-width:85px">',
                                '<option value="sender">Sender</option>',
                                '<option value="receiver">Receiver</option>',
                                '</select>'].join('');
                            //return data.df_payer;
                        },
                        title: 'DFP'
                    },
                    {
                        className: 'fees',
                        data: function (data, a, b) {
                            let fees = Number(data.fees).toFixed(2);
                            //if ((data.df_payer+'').toLowerCase() =='receiver') fees =  parseFloat(data.base_fee) + parseFloat(data.delivery_fee);
                            //fees = Number(fees).toFixed(2); 
                            if (data.driver_pmt_status_id == 1)
                                return ['<span class="bl-currency">', data.cur, '</span><span class="value">', fees, '</span>'].join('');
                            else
                                return ['<input type="number" style="min-width:80px" class="form-control col-input" value="', fees, '" readOnly="true">'].join('');

                        },
                        title: 'Fees'
                    },
                    {
                        className: 'forwarding_cost', //This cssClass is very important to access Adjustment amount
                        data: function (data, a, b) {
                            data.forwarding_cost = $.isNumeric(data.forwarding_cost) ? data.forwarding_cost : 0;
                            //data.forwarding_cost is Taxi Fee, which is supposed to be negative for Driver side.
                            //if(data.forwarding_cost > 0) data.forwarding_cost = - data.forwarding_cost;
                            let forwarding_cost = data.forwarding_cost + parseFloat(data.driver_adjust_amount);
                            if (data.driver_pmt_status_id == 1)
                                return ['<span class="billing-forwarding-cost">', data.cur, forwarding_cost, '</span>'].join('');
                            else return ['<input type="number" style="min-width:80px" class="form-control col-input" value="', forwarding_cost, '" readOnly="true">'].join('');
                        },
                        title: 'Taxi'
                    },
                    {
                        className: 'notes', //This cssclass is of critial importance
                        data: function (data, a, b) {
                            if (data.driver_pmt_status_id == 1) return ['<span class="billing-pmt-notes">', data.cod_change_notes, '</span>'].join('');
                            else return ['<input type="text" style="min-width:150px" class="col-input form-control" value="', data.cod_change_notes, '" readOnly="true">'].join('');
                        },
                        title: 'Remarks'
                    },
                    {
                        //Total driver
                        className: 'total',
                        data: function (data, a, b) {
                            if (!data.cur) data.cur = '$';
                            if (!$.isNumeric(data.driver_adjust_amount)) data.driver_adjust_amount = 0;
                            if (!$.isNumeric(data.fees)) data.fees = 0;
                            if (!$.isNumeric(data.cod_amount)) data.cod_amount = 0;
                            //let fees = 0 ;
                            //if((data.df_payer+'').toLowerCase() =='receiver') fees = parseFloat(data.fees);
                            //let driver_total = parseFloat(data.cod_amount) + fees;
                            let total_net = data.driver_total - parseFloat(data.forwarding_cost) + parseFloat(data.driver_adjust_amount);
                            total_net = Number(total_net).toFixed(2);
                            if (data.driver_pmt_status_id === 1) return ['<span class="currency billing-paid-text">', data.cur, '</span><span class="value billing-paid-text">', total_net, '</span>'].join('');
                            else return ['<input type="number" style="min-width:90px" class="form-control col-input" value="', total_net, '" readOnly="true">'].join('');
                            //return ['<span class="bl-currency">',data.cur,'</span><span class="value">',total_net,'</span>'].join('');
                        },
                        title: 'Total'
                    },
                    {
                        className: 'pmt-status',
                        data: function (data, a, b) {
                            if (data.driver_pmt_status_id == 1) return ['<span class="billing-paid-text">Paid</span>'].join('');
                            else return ['<span class="billing-unpaid-text">Unpaid</span>'].join('')
                        },
                        title: 'Pmt'
                    },

                    //,{
                    //     className:'col_action',
                    //     data:function(data,row,display) {
                    //      let html =['<div class="dropdown">',
                    //          '<a href="#" data-did="',data.delivery_id,'" data-pid="',data.package_id,'" data-driverid="',data.driver_id,'" data-tknumber="',data.fleet_tracking_number,'" data-statusid="',data.status_id,'" class="btn_dpmt_action" aria-haspopup="true" aria-expanded="false">',
                    //          '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                    //          //' Action',
                    //          '</a>',
                    //         '</div>'].join('');
                    //         return html;

                    //     } 
                    // }
                ];

                if (!mThis.table)
                    mThis.table = mThis.tblItems.DataTable({
                        searching: false,
                        //destroy:true,
                        paging: true,
                        pageLength: 10,
                        ordering: false,
                        //dom: 'Bfrtip',
                        //retrieve: true,
                        //scrollY:390,
                        //scrollX:500,
                        //pagingType:'numbers',
                        info: true,
                        bLengthChange: false,
                        saveState: true,
                        select: true,
                        // rowReorder: {
                        // dataSrc: 'sequence'
                        // },
                        'processing': true,
                        'language': {
                            "loadingRecords": '&nbsp;',
                            "processing": 'Loading...',
                            "emptyTable": "No packages found!"
                        },
                        data: data,
                        columns: my_columns
                        , "createdRow": function (row, data, dataIndex) {
                            let tr = $(row);
                            if (data.driver_pmt_status_id !=1) mThis.unpaidItemCount++;
                            if (isNaN(data.driver_adjust_amount)) data.driver_adjust_amount = 0;
                            if (isNaN(data.fees)) data.fees = 0;
                            if (isNaN(data.cod_amount)) data.cod_amount = 0;
                            if (isNaN(data.forwarding_cost)) data.forwarding_cost = 0;
                            let fees = 0;
                
                            data.df_payer = (data.df_payer + '').toLowerCase();
                            if (data.df_payer === 'receiver') fees = parseFloat(data.fees);

                            tr.find('td.df_payer> .col-input').val(data.df_payer);

                            let driver_total = parseFloat(data.cod_amount) + fees - data.forwarding_cost;
                            let total_net = driver_total;
                            //NOTE: the following line: data.forwarding_cost is taxi fee that Express company has to pay back to drivers
                            //let total_net = driver_total - parseFloat(data.forwarding_cost) + parseFloat(data.driver_adjust_amount);
                            tr.addClass('package_header');
                            tr.data('pid', data.package_id); //package_id  

                            tr.find('td.total> .col-input').val(total_net);

                            tr.data('cursymbol', data.cur); //Currency symbol, usually $
                            tr.data('drivertotal', driver_total); //driver_total
                            tr.data('codnotes', data.cod_change_notes); //driver_total
                            tr.data('adjustamount', data.driver_adjust_amount);
                            tr.data('totalnet', total_net);
                            tr.data('did', data.delivery_id); //delivery_id             
                            //tr.data('tknumber',data.fleet_tracking_number);
                            tr.data('driverid', data.driver_id); //driver_id
                            tr.data('statusid', data.status_id);
                            tr.data('driverpmtstatusid', data.driver_pmt_status_id);

                            let selected = tr.data('selected');
                            selected = (selected == 1) ? true : false;
                            if (selected == 1) tr.find('._dpmt_check').prop('checked', selected);

                            let delivery_time = data.delivery_time ? data.delivery_time : 'NA';
                            let notes = [
                                '<div class="d-flext flex-column">',
                                '<span class="d-block">មកដល់ <b>', data.arrival_time, '</b></span>',
                                '<span class="d-block">ដឹកចេញ <b>', data.depart_time, '</b></span>',
                                data.status_id == 8 ? `<span class="d-block text-success">ដឹកបាន <b>${delivery_time}</b></span>` : `<span class="text-muted">ដឹកបាន ${delivery_time}</span>`,
                                '</div>'
                            ].join('');

                            //let g = tr.find('.btn-dates');
                            //console.error(g.html());
                            tr.find('.btn-dates').popover({
                                html: true,
                                trigger: "hover",
                                title: ["<span class='pg-remarks-title'>Dates</span>"].join(''),
                                content: notes
                            });
                        }

                        //    ,"cellCreated":function(td,data,colIndex) {
                        //        alert('test');
                        //      if(colIndex==9){
                        //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                        //         $(td).html(html); 
                        //      }
                        //   }      								
                    });

                // let div = $('"_dpmt_d_filter_panel');  
                // $('"_dpmt_tblPackages_wrapper>div.dt-buttons').prepend(div);
                if (mThis.unpaidItemCount > 0) mThis.btnSelectAll.show(); else mThis.btnSelectAll.hide(); 
                let is_selected_all = mThis.btnSelectAll.data('select');
                if (is_selected_all == 1) mThis.selectAllRows(1);
               
                if (typeof onFinish ==='function') onFinish();
            }); //close post_ajax()


        };

        //Show Content of Deliveries Tab Panel 
        this.show = (option = null) => {
            mThis.filter_enabled = false; /** To prevent unnecessary repeated call to "api/driver/delivery-items" */
            mThis.init(); //Init() will check itself to Execute only once
            mThis.displayDeliveryItemsByDriver(()=>{
                //After component is shown, enable package filter options to allow firing of "Change" event for "elFilter_sender"
                mThis.filter_enabled = true;
            },888);
        }

    };
    //end::Deliveries tabview

    //begin::Payments tabview
    this.TabPanel_payments = new function () {
        let mThis = this;
        this.base_url = main_view.base_url;
        this.self = DriverPaymentComponent.self.find('#_dpmt_panel_payments');
        this.tblItems = this.self.find('#_dpmt_tblPmts');

        this.filter_panel = this.self.find('#_dpmt_filter_panel');
        this.elStartDate = this.self.find('#_dpmt_filter_pmt_startdate');
        this.elEndDate = this.self.find('#_dpmt_filter_pmt_enddate');
        this.elDriver = this.self.find('#_dpmt_filter_pmt_driver');
        this.elFilter_status = this.self.find('#_dpmt_filter_trx_status');

        this.elPmtBreakdown = this.self.find('#_dpmt_pmt_breakdown');
        this.elTrxCount = this.self.find('#_dpmt_pmt_count');
        this.elTrxTotal = this.self.find('#_dpmt_pmt_total');
        this.btnApproveAll = this.self.find('#_dpmt_btnApproveAll');

        this.cols = [
            {
                title:"Payment Date",
                data:(data,index,tr)=>{
                    let trx_type = (data.trx_type || '').toLowerCase();
                    const cls_type = trx_type =='disbursement'? 'text-danger':'text-success';
                    return ['<span class="d-block">',data.payment_date,'</span><span class="d-block p-1 text-left ',cls_type,'"><small>',data.trx_type,'</small></span>'].join('');
                }
            },
            {
                title:"Driver",
                data:(data,index,tr)=>{
                    return data.agent_name;
                }
            },
            {
                title:"PCS",
                data:(data,index,tr)=>{
                    return [`<a href="javascript:void(0)" data-trxtype="`,data.trx_type,`" data-id="`,data.trx_id,`" data-agentid="`,data.agent_id,`" data-agentname="`,data.agent_name,`" data-agenttype="`,data.agent_type,`" class="lnk-view-paid-packages"><span class="fw-semibold p-1">`,data.package_count,` pcs`,`</span></a>`].join('');
                }
            },
            {
                title:"Amount",
                className:"amount",
                data:(data,index,tr)=>{
                    const amount = Number(data.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    let cls_amount = (data.trx_type+'').toLowerCase() =='receipt'? 'text-success':'text-danger';   
                    return ['<span data-notes="',data.pmt_breakdowns,'" data-trxtype="',data.trx_type,'" class="amount fw-semibold ',cls_amount,'">',amount,' ','<small>',data.currency_code,'</small></span>'].join('');
                }
            },
            {
                title:"Breakdowns",
                className:"breakdown",
                data:(data,index,tr)=>{
                    let ps = (data.pmt_breakdowns || '').split('|');
                    let html = null;
                    ps.map(b =>{
                       if(b) html = [html,`<li>`,b,`</li>`].join('');
                    });
                    if(!html) return '<span class="d-block p-2 text-center text-muted">N/A</span>';
                    return ['<ul>',html,'</ul>'].join('');
                }
            },
            {
                title:"Booked By",
                data:(data,index,tr)=>{
                    return [`<span class="d-block fw-semibold">`,data.create_user,'</span>','<span class="d-block text-muted"><small>',data.create_date,'</small></span>'].join('');
                }
            },
            {
                title:"Remarks",
                data:(data,index,tr)=>{
                    let approval_status = data.authorized ==1 ? `<span class="d-block p-1 text-center border bg-success rounded-4 text-white fw-semibold"><span class="d-block">Approved By</span><span class="d-block">${data.auth_user}</span><span class="d-block"><small>${data.auth_date}</small</span></span>`: '<span class="d-block p-1 border bg-danger text-center rounded-4 text-white fw-semibold">Pending</span>';
                    return [approval_status,'<span class="d-block p-1">',data.remarks,'</span>'].join('');
                }
            },
            // {
            //     title:"image",
            //     data:(data,index,tr)=>{
            //         return data.image_url;
            //     }
            // },
            {
                title:"Action",
                data:(data,index,tr)=>{
                    let html = data.authorized ==1? `<span style="margin-top:-5px" class="text-success p-1 text-center border border-success rounded-4"><i class="fa fa-check"></i></span>` : [`<a data-id="`,data.trx_id,`" data-trxtype="`,data.trx_type,`" href="javascript:void(0)" class="lnk-approve-pmt"><span class="p-1 border border-success rounded-3">Approve</span></a>`].join('');
                    return [`<div class="d-flex gap-2">`,
                    html,
                    `<a data-id="`,data.trx_id,`" data-trxtype="`,data.trx_type,`" href="javascript:void(0)" class="lnk-delete-pmt"><i class="fa fa-regular fa-trash-can text-danger fs-5"></i></a>`,
                    `</div>`].join('');
                }
            }
        ];

        this.getPmtBreakdown_html = (pmt_breakdowns) => {
            let bs = '';
            if(!pmt_breakdowns) return null;
            const methodColors = ['#0F8339', '#3141D7']; // Add more colors as needed
        
            for (let [index, pmt_method] of Object.keys(pmt_breakdowns).entries()) {
                let methodDisplay = `<span style="color: ${methodColors[index % methodColors.length]};">${pmt_method}: </span>`;
        
                for (let currency_code of Object.keys(pmt_breakdowns[pmt_method])) {
                    let amount = Math.abs(pmt_breakdowns[pmt_method][currency_code]);
                    methodDisplay += `<span style="color: ${methodColors[index % methodColors.length]};">${amount} ${currency_code}</span> `;
                }
                bs = [bs, `<span>`, methodDisplay, `</span>`].join('');
            }
        
            return bs;
        }

        this.init = () => {
            if (mThis.initialized) return;

            mThis.pmtListView = new ListView('_dpmt_pmt_list', {
                'columns':mThis.cols,
                // 'clientSidePagination':true,
                // 'processResponse':(res)=>{ 
                //   return res.data.data;
                // },
                //'paginationContainer': document.querySelector('#test_div'),
                'apiCluster':main_view.apiCluster,
                'fetchApi': `${main_view.base_url}/api/driver/payment/list`,
                'processResponse':(res)=>{
                    let d = res.status_code ===200? res.data:{};
                    if (!mThis.elStartDate.val() && d.start_date) mThis.elStartDate.val(d.start_date);
                    if(!mThis.elEndDate.val() && d.end_date) mThis.elEndDate.val(d.end_date);
                    mThis.elTrxCount.text(d.payment_count);
                    const bs = mThis.getPmtBreakdown_html(d.pmt_breakdowns);
                    mThis.elPmtBreakdown.html(bs);

                    if (d.unauth_count > 0) mThis.btnApproveAll.show(); else mThis.btnApproveAll.hide();
                    const total_amount = Number(d.total).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    mThis.elTrxTotal.html([total_amount,`<small> `,d.currency_code,`</small>`].join(''));
                    return d.data; 
                },
                'apiCluster': main_view.apiCluster,
                'tableClass':'header-uppercase table',
                'perPage': 10,
                'rowCreated':(data,index,tr) =>{
                    tr.dataset.id = data.trx_id;
                    tr.dataset.trxtype = data.trx_type;

                    //begin::init Popover view
                        const spanAmount = tr.querySelector('td.amount>.amount');
                        //if(btnStatus){
                            let notes = spanAmount.dataset.notes;
                            let pmts = (notes || '').split('|');
                            let rem;
                            pmts.map( x =>{
                              rem = [rem,'<span class="d-block p-1 border-bottom border-secondary">',x,'</span>'].join('');
                            });
                            //const status_id = btnStatus.dataset.statusid;
                            if (notes) {
                                $(spanAmount).popover({
                                    html: true,
                                    trigger: "hover",
                                    title: ["<span class='pg-remarks-title'>Remarks</span>"].join(''),
                                    content: rem
                                });
                            }
                        //} 
                    //end::Init Popover view
                },
                'listContainerClass': null
            });
     
            mThis.tblPmts = mThis.pmtListView.getTable();

            /** here to be changed */
            DriverTabView.TabPanel_reports.prepareData(null, (ds) => {
                //ds.unshift( {'id':-1,'driver_name':'(All Drivers)'});
                //ds.unshift({'id':null,'driver_name':'(Choose driver)'});
                VSUtil.setComboItems(mThis.elDriver, ds, 'id', 'driver_name', false, null, null);
                mThis.drivers = ds;
            });

            mThis.btnApproveAll.on('click',e => {
                e.preventDefault();
               
                cv_interact.confirm('Are you sure to approve all pending transactions?', { title: 'Approve All', confirmButtonText: "Approve All", cancelButtonText: "Cancel" }, function (e) {
                    if (e) {
                        let p = mThis.getFilterData();
                        //p.trx_type = 'receipt';
                        vsapi.call([main_view.base_url, '/api/driver/payment/bulk-authorize'].join(''), p).then(res => {
                            console.log(res);
                            if (res.status_code === 200) {
                                let d = res.data;
                                let total = Number(d.total).toFixed(2);
                                cv_interact.success(['html:','<span class="d-block">',d.affected_trx_count,' transactions approved with the total amount of ',total,' ',d.currency_code,'</span>','<span class="d-block fw-seimbold p-1">',d.start_date,' to ',d.end_date,' for driver: ',d.driver_name,'</span>'].join('')); 
                                mThis.pmtListView.showPage(mThis.getFilterData()); 
                            }
                            else cv_interact.error(res.error_message);
                        });
                    }
                });
            });

            mThis.tblPmts.addEventListener('click',  e => {
                e.preventDefault();

                //Click on Delete tranaction
                let btn = VSUtil.getElementByClass(e.target,'lnk-delete-pmt');
                if(btn){
                        let trx_id = btn.dataset.id;
                        let trx_type = btn.dataset.trxtype;
                        cv_interact.confirm('Delete this payment?', { title: 'Delete Payment', confirmButtonText: "Delete", cancelButtonText: "Cancel" }, function (e) {
                            if (e) {
                                //let trx_type ='receipt';
                                let p = { 'trx_id': trx_id, 'trx_type': trx_type };
                                vsapi.call([main_view.base_url, '/api/driver/payment/delete'].join(''), p).then(res => {
                                    if (res.status_code === 200) {
                                       mThis.pmtListView.showPage(mThis.getFilterData()); 
                                    }
                                    else cv_interact.error(res.error_message);
                                });
                            }
                        }); 
                    return;    
                } 
 
                //Click on View paid packages by Driver
                btn = VSUtil.getElementByClass(e.target,'lnk-view-paid-packages');
                if(btn){
                        let trx_id = btn.dataset.id;
                        //let trx_type = btn.dataset.trxtype;
                        let p = {
                           "trx_id":trx_id,
                           'trx_type':btn.dataset.trxtype, 
                           //"warehouse_id":1, /** default static warehouse 1*/
                           "agent_id":btn.dataset.agentid,
                           "agent_name":btn.dataset.agentname,
                           "agent_type":"Driver"
                        };
                        let params = ['rtype=dr_settled_packages&trxid=', p.trx_id, '&trxtype=',p.trx_type,'&agentid=', p.agent_id,'&agentname=', p.agent_name].join('');
                        pdfReport.getEncryptData(encodeURI(params), (d) => {
                            window.open([main_view.base_url, '/dms-gen-report/', d].join(''), '_blank');
                        });

                    return;    
                } 


                    //Click on Approve tranaction
                    btn = VSUtil.getElementByClass(e.target,'lnk-approve-pmt');
                    if(btn){
                            let trx_id = btn.dataset.id;
                            let trx_type = btn.dataset.trxtype;
                            cv_interact.confirm('Approve this payment?', { title: 'Approval', confirmButtonText: "Approve Now", cancelButtonText: "Cancel" }, function (e) {
                                if (e) {
                                    //let trx_type ='receipt';
                                    let p = { 'trx_id': trx_id, 'trx_type': trx_type };
                                    vsapi.call([main_view.base_url, '/api/driver/payment/authorize'].join(''), p).then(res => {
                                        if (res.status_code === 200) {
                                           let d = StringSanitizer.sanitizeObject(res.data); 
                                           mThis.pmtListView.showPage(mThis.getFilterData());
                                           cv_interact.success(['Payment approved and ',d.affected_count,' packages affected!'].join('')); 
                                        }
                                        else cv_interact.error(res.error_message);
                                    });
                                }
                            }); 
                        return;    
                    } 

            });
 
            mThis.elFilter_status.on('change',e=>{
                e.preventDefault();
                mThis.pmtListView.showPage(mThis.getFilterData());
            });

            mThis.elDriver.on('change', function (e) {
                e.preventDefault();
                mThis.pmtListView.showPage(mThis.getFilterData());
            });
            mThis.elEndDate.on('change', function (e) {
                e.preventDefault();
                mThis.pmtListView.showPage(mThis.getFilterData());
            });
            mThis.elStartDate.on('change', function (e) {
                e.preventDefault();
                mThis.pmtListView.showPage(mThis.getFilterData());
            });

            mThis.initialized = true;
        }
 
        mThis.getFilterData = () => {
            let p = {'trx_type':'','status_id':mThis.elFilter_status.val(),'start_date': mThis.elStartDate.val(), 'end_date': mThis.elEndDate.val(), 'driver_id': mThis.elDriver.val() };
            return p;
        }
          
        this.show = () => {
            mThis.init();
            mThis.pmtListView.showPage(mThis.getFilterData());
        }
    }
    //end::Payments tabview

    //begin::Reports tabview
    this.TabPanel_reports = new function () {
        let mThis = this;
        this.self = DriverPaymentComponent.self.find('#_dpmt_panel_reports');
        this.btnRunReport = this.self.find('#_dpmt_btnRunReport');

        this.elFilter_report_driver = this.self.find('#_dpmt_rptfilter_driver');
        this.elFilter_report_start_date = this.self.find('#_dpmt_rptfilter_start_date');
        this.elFilter_report_end_date = this.self.find('#_dpmt_rptfilter_end_date');

        this.getData = () => {
            let p = {
                'report_name': mThis.selected_rpt_name,
                'driver_id': mThis.elFilter_report_driver.val(),
                'start_date': mThis.elFilter_report_start_date.val(),
                'end_date': mThis.elFilter_report_end_date.val(),
                'driver_name': mThis.elFilter_report_driver.find('option:selected').text()
            };

            if (!p.report_name) {
                cv_interact.warning('No report selected!');
                return null;
            }
            if (!p.driver_id) {
                cv_interact.warning('No driver selected!');
                return null;
            }
            return p;
        }

        this.prepareData = (def = {}, onFinish) => {
            if (!def) def = {};
            if (mThis.drivers) {
                //mThis.drivers = DriverTabView.TabPanel_deliveries.drivers;
                DriverTabView.TabPanel_payments.drivers = mThis.drivers;

                //The following line has error if mThis.drivers is not array
                //mThis.drivers.unshift({'id':null,'driver_name':'(All Drivers)'});
                VSUtil.setComboItems(mThis.elFilter_report_driver, mThis.drivers, 'id', 'driver_name', false, null, def.driver_id);
                if (typeof onFinish === 'function') onFinish(mThis.drivers);
                return;
            }

            vsapi.call([main_view.base_url, '/api/getComboItems_driver'].join(''), null).then(res => {
                if (res.status_code === 200) {
                    let rows = StringSanitizer.sanitizeObject(res.data);
                    //The following line has error if if  "rows" is not array
                    (rows || []).unshift({ 'id': -1, 'driver_name': '(All Drivers)' });
                    VSUtil.setComboItems(mThis.elFilter_report_driver, rows, 'id', 'driver_name', false, null, def.driver_id);
                    if (typeof onFinish == 'function') onFinish(rows);
                    mThis.drivers = rows;
                    DriverTabView.TabPanel_payments.drivers = mThis.drivers;
                }
            });
        }

        this.init = () => {
            if (mThis.initialized) return;
            mThis.prepareData();
            this.reportItems = DriverTabView.self.find('#_dpmt_report_list');

            mThis.reportItems.on('click', 'a.report-item', function (e) {
                if (mThis.prev_report_item) mThis.prev_report_item.removeClass('bl-report-selected');
                $(this).addClass('bl-report-selected');
                mThis.selected_rpt_name = $(this).data('rptname'); //remember currently selected report name
                mThis.prev_report_item = $(this);
            });

            this.btnRunReport.on('click', function (e) {
                e.preventDefault();
                let p = mThis.getData();
                if (!p) return;

                if (p.report_name === 'dr_driver_commissions' || p.report_name === 'driver_commissions') {
                    if (!p.driver_id || mThis.drivers === 0) {
                        cv_interact.warning('Commission Report for all drivers is not avaiable. Please select a driver');
                        return;
                    }
                }

                let params = ['rtype=', p.report_name, '&wid=', p.warehouse_id, '&driverid=', p.driver_id, '&startdate=', p.start_date, '&enddate=', p.end_date, '&dtype=', p.delivery_type, '&drivername=', p.driver_name].join('');
                pdfReport.getEncryptData(encodeURI(params), (d) => {
                    window.open([main_view.base_url, '/dms-gen-report/', d].join(''), '_blank');
                });
                //dr_package_list  
            });


            mThis.initialized = true;

        }

        //show Repor Panel content
        this.show = () => {
            mThis.init();
        }
    }
    //end::Reports tabview

    //##END::Tabpanel defintions

}
//end::DriverTabView

//begin::FilterDialog_dpmt
const FilterDialog_dpmt = new function () {
    let mThis = this;
    this.self = main_view.appContent.children('#_dpmt_dlgFilter');
    this.elTitle = this.self.find('#_dpmt_dlgFilterTitle');
    this.btnOK = this.self.find('#_dpmt_dlgFilter_btnOK');
    this.lblDriverName = this.self.find('#_dpmt_filter_driver_name');

    this.getData = () => {
        let p = {};
        //start popupate filter data from Dialog fields (Package Status, Driver pmt status, startdate, enddate)
        mThis.self.find('.dpmt_filter_field').each(function () {
            let el = $(this);
            let dataMember = el.data('field');
            p[dataMember] = el.val();
        });

        let panel = DriverTabView.TabPanel_deliveries;
        p.driver_id = panel.elFilter_driver.val();
        p.warehouse_id = panel.elFilter_warehouse.val();
        if (!p.driver_pmt_status_id) {
            cv_interact.warning('It seems the filter data are not correct');
            console.log('It seems the filter data are not correct. Please check the css class "dpmt_filter_field" in file DriverPaymentComponent.blade.php');
            return null;
        }
        return p;
    }
    this.btnOK.on('click', (e) => {
        e.preventDefault();
        mThis.self.modal('hide');
        let p = mThis.getData();
        let xp = DriverTabView.TabPanel_deliveries;
        p.warehouse_id = xp.elFilter_warehouse.val();
        p.driver_id = xp.elFilter_driver.val();
        if (typeof mThis.onClose == 'function') mThis.onClose(p);
    });

    this.show = (op = {}, onClose) => {
        mThis.elTitle.html(op.title);
        mThis.onClose = onClose;
        mThis.lblDriverName.text(op.driver_name);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}
//end::FilterDialog_dpmt