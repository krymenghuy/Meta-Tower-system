'use strict';
var SenderPaymentComponent = new function() {
    let xThis = this;
    this.title_prop = "Merchant Transactions";
    this.self = main_view.appContent.children('#_main_senderPmtComponent');
    this.base_url = main_view.base_url; //$('#__base_url').val();
    this.cur_view = 'spmt_deliveries';

    this.show = (options=null)=>{
        xThis.form_data = false;
        main_view.setTitle(xThis.title_prop); 
        xThis.self.siblings().hide();
        xThis.self.fadeIn(200);
        SenderTabView.setActiveTab(xThis.cur_view);
    } 
}

var SenderTabView = new function(){
    let mThis = this;
    this.self = SenderPaymentComponent.self.find('#_spmt_senderTabView');
    this.base_url = main_view.base_url;
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

    this.self.on('click','div.tab-header>a.tab-button',function(e){
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
  
    this.initContentView = (view_name)=>{
        if (view_name=='spmt_deliveries'){
            mThis.TabPanel_deliveries.show(); 
        }
        else if(view_name=='spmt_payments'){
            mThis.TabPanel_payments.show(); 
        }
        else if(view_name=='spmt_reports'){
            mThis.TabPanel_reports.show();  
        }
    };

    this.TabPanel_deliveries = new function(){
        let mThis = this;
        this.self = SenderPaymentComponent.self.find('#_spmt_panel_deliveries');
        this.base_url =main_view.base_url;

        const div = this.self;
        this.tblItems = div.find('#_spmt_tblItems');
        this.elFilter_warehouse = div.find('#_spmt_filter_deliveries_warehouse');
        this.elFilter_warehouse .hide();
        this.elFilter_sender = div.find('#_spmt_filter_deliveries_sender');
        this.elFilter_start_date = div.find('#_spmt_filter_start_date');
        this.elFilter_end_date = div.find('#_spmt_filter_end_date');
        this.filterPanel = div.find('#_spmt_filter_panel');
        
        this.elSearchPackage = div.find('#_spmt_search');
        this.btnSearch = div.find('#_spmt_btnSearch');
        this.btnToggleFilter = div.find('#_spmt_btnToggleFilter');
        
        this.btnPrint = div.find('#_spmt_btnPrint');
        this.btnPDF = div.find('#_spmt_btnPDF');
        this.btnExcel = div.find('#_spmt_btnExcel');

        this.btnSelectAll = div.find('#_spmt_btnSelectAll');
        this.btnPay = div.find('#_spmt_btnPay');
        this.btnReceivePmt = div.find('#_spmt_btnReceivePmt');
        this.btnSettleZero = div.find('#_spmt_btnSettleZero');
        this.elTotalDue = div.find('#_spmt_balance_due');
        
        this.getMerchantBankInfo = (id)=>{
            mThis.sender_bank_info ='';
            let p = {'sender_id':id};
            vsapi.call(`${mThis.base_url}/api/getMerchantBankInfo`,p).then(res=>{
                if(res.status_code ===200){
                    let d = StringSanitizer.sanitizeObject(res.data);
                    mThis.sender_bank_info = [d.bank_name,'  ',d.account_number,'  (',d.account_name,')'].join('');
                }
            });
        }

        this.init = ()=>{
            if (mThis.initAlready) return;

            if (main_view.MULTI_WAREHOUSE_OP ==0) {
                mThis.elFilter_warehouse.hide();
            }
            else 
                mThis.elFilter_warehouse.show();
         
            mThis.loadFilterData();
            mThis.elFilter_sender.on('change',function(e){
                //if(mThis.form_loaded){
                    mThis.getMerchantBankInfo($(this).val());  
                    mThis.displayDeliveryItemsBySender();
                //}
            });

            mThis.btnToggleFilter.on('click',(e)=>{
                let sender_name = mThis.elFilter_sender.find('option:selected').text();
                if (!mThis.elFilter_sender.val()) {
                    cv_interact.warning('One driver should be selected');
                    return;
                }
                let op = {'title':'Filter Transactions','sender_name':sender_name};
                FilterDialog_spmt.show(op,(d)=>{
                    if(d) {
                        mThis.displayDeliveryItemsBySender(d);
                    }
                });
            });
    
            mThis.filterPanel.find('.spmt_filter_field').on('change',function(e){
                if (mThis.elFilter_sender.val() > 0 && mThis.unpaidItemCount > 0){
                    mThis.btnSelectAll.show();
                }else mThis.btnSelectAll.hide();

                if (mThis.filter_enabled) mThis.displayDeliveryItemsBySender();
            });

            mThis.btnSearch.on('click',function(){
                mThis.displayDeliveryItemsBySender();
            });

            mThis.elSearchPackage.on('keyup',function(e){
               clearTimeout(mThis.search_timeout);
               mThis.search_timeout = setTimeout(()=>{
                 mThis.displayDeliveryItemsBySender();  
               },250); 
            });

            mThis.btnSelectAll.on('click',function(e){
                e.preventDefault();
                let sel = mThis.btnSelectAll.data('select');
                mThis.selectAllRows(!(sel==1));
            });

            mThis.btnSettleZero.on('click',function(e){
                e.preventDefault();
                mThis.btnPay.trigger('click');
            });

            mThis.btnPay.on('click',function(e){
                e.preventDefault();
                mThis.beginPaymentProcess(mThis.btnPay);
            });
 
            mThis.btnReceivePmt.on('click',e=>{
                e.preventDefault();
                mThis.beginPaymentProcess(mThis.btnReceivePmt);
            });

            mThis.tblItems.on('click','a._spmt_print_barcode',function(e){
                e.preventDefault();
                let barcode = $(this).data('barcode');
                window.open([mThis.base_url,'/package_barcode/',barcode].join(''),'_blank'); 
            });
            
            mThis.tblItems.on('change','input._spmt_check',function(e){
                e.preventDefault();
                let checked = $(this).is(':checked');
                let tr = $(this).closest('tr');
                let status_id = tr.data('statusid');
                
                mThis.displayTotalBalance();

                if(status_id != 8) {
                    $(this).prop('checked',false);
                    cv_interact.warning('សូមជ្រើសរើសយកតែទំនិញដែលបានដឺកហើយ!');
                    return;
                }
                let td = tr.find('td.total');
                if(td) td.toggleClass('billing-paid-text');
                mThis.setRowReadOnly(tr,checked?false:true);
            });

            mThis.tblItems.on('keyup','tbody>tr>td.adjustment>input.col-input',function(e){
                let tr = $(this).closest('tr');
                mThis.calculateTotal(tr);
            });

           mThis.initAlready = true;
        }
       //End:: init Deliveries tab

        this.loadFilterData = (onFinish)=>{ 
            let def =  mThis.remembered_filter? mThis.remembered_filter:{};
            if(!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
            if (mThis.form_data && mThis.form_data.senders) {
                VSUtil.setComboItems(mThis.elFilter_warehouse,mThis.form_data.warehouses,'id','warehouse_name',null,'(Select Warehouse)',def.warehouse_id);
                VSUtil.setComboItems(mThis.elFilter_sender,mThis.form_data.senders,'id','sender_name',null,'(Choose merchant)',def.sender_id);
                if(typeof onFinish =='function') onFinish();
                return;   
            }

            vsapi.call([mThis.base_url,'/api/merchant/filter-options'].join(''),null,null,false,null).then(res=>{
                if(res.status_code ==200){
                    let data = StringSanitizer.sanitizeObject(res.data,null,['sender_name']);
                    //(data.senders || []).unshift({'id':null,'sender_name':'(Choose merchant)'});
                    (data.senders || []).unshift( {'id':-1,'sender_name':'(All Merchants)'});   
                
                    VSUtil.setComboItems(mThis.elFilter_warehouse,data.warehouses,'id','warehouse_name',false,'(Select Warehouse)',def.warehouse_id);
                    VSUtil.setComboItems(mThis.elFilter_sender,data.senders,'id','sender_name',false,'(Choose merchant)',def.sender_id);
                    mThis.form_data = data;
                    if(typeof onFinish ==='function') onFinish();
                }
            });
        };

        this.setRowReadOnly= (tr,readOnly)=>{
            let elAmount = tr.find('td.adjustment>input.col-input');
            let elNotes = tr.find('td.notes>input.col-input');
            elAmount.prop('readOnly',readOnly);
            elNotes.prop('readOnly',readOnly);    
        }

        this.displayTotalBalance = ()=>{
            let sel = mThis.getSelectionInfo();
            let cur ='$';
            
            if (sel.total ==0) {
                mThis.elTotalDue.html([cur,Math.abs(sel.total)].join(''));
                mThis.elTotalDue.css('color','green');
                mThis.btnSettleZero.show().siblings().hide();
            }
            else if (sel.total <0){
                mThis.elTotalDue.html(['(',cur,Math.abs(sel.total),')'].join(''));
                mThis.elTotalDue.css('color','green');
                mThis.btnReceivePmt.show().siblings().hide();
            }
            else{ 
                mThis.elTotalDue.html([cur,sel.total].join(''));
                mThis.elTotalDue.css('color','orange');
                mThis.btnPay.show().siblings().hide();
            }

            mThis.elTotalDue.html([cur,sel.total].join(''));
        }

        this.calculateTotal = (tr)=>{
            if(!tr) return;
            let cur = tr.data('cursymbol');
            let df_payer = tr.data('dfp'); 
            if(!cur) cur='$';
            let elAdjust = tr.find('td.adjustment>input.col-input');
            let elCOD = tr.find('td.cod_amount>span.value');
            let elFees = tr.find('td.fees>span.value');
            let elForwardingCost = tr.find('td.forwarding_cost>span.value');
            let elTotal = tr.find('td.total>span.value');
            let adjust_fee = parseFloat(elAdjust.val());
            if(isNaN(adjust_fee)) adjust_fee =0;
            
            let fees =0;
            if((df_payer+'').toLowerCase() =='sender') fees = elFees.text(); 

            let cod_amount = elCOD.text();
            let forwarding_cost = elForwardingCost.text();
            let total =  parseFloat(cod_amount) + adjust_fee - parseFloat(fees) - parseFloat(forwarding_cost);
            elTotal.html(Number(total).toFixed(2));
            tr.data('totalnet',Number(total).toFixed(2));
        };

            
        this.selectAllRows = function (selected = true) {
            if (!mThis.table) return;
 
            const sel_max = 500;
            const rows = mThis.table.rows().nodes();
            let i = 0, c;
            do {
                let tr =  $(rows[i]);
                c = tr.find('._spmt_check');
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
            mThis.displayTotalBalance();
            mThis.btnSelectAll.data('select', (selected) ? 1 : 0);
        }

        /** Depending on the selected items's Total amount of cash, this function will Process Receiving payment or making payment process by showing a correct Dialog for Receipt or Disbursement purpose */
        this.beginPaymentProcess = (btnOK)=>{
                //getSelectionInfo() return json object {'ids','total','packages','error_message'}
                //error when user select wrong status such as "Failed" for receiving payment
                let allowed_status = 8; //Allow user to select on Delivered packages for paying to merchants
                let sel = mThis.getSelectionInfo(allowed_status, 'សូមជ្រើសរើសយកតែទំនិញដែលបានដឹកហើយ!');
                let ids = sel.ids;
                //if sel.total < 0 => it is Receivable or needs to receive money from Merchant, otherwise it is Payable or pay to merhant 
                let trans_type = sel.total < 0? 'receive': 'pay';

                //Ensure the the amount is always positive to avoid weird user feeling
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
                let sender_id = mThis.elFilter_sender.val();
                let sender_name = mThis.elFilter_sender.find('option:selected').text();
                if (sender_id <= 0 || !sender_id) {
                    cv_interact.warning('No merchant selected');
                    return;
                }
             
                if (amount ==0 && sender_id > 0){
                    let p = {
                      "packages":sel.ids, /** sel.ids is, for example : "124,27878,45678, ... "*/
                      "sender_id":id,
                      "package_count":sel.package_count,
                      "currency_code":"USD",
                      "total":amount
                      //"remarks":"Zero settlement"
                    };
                    cv_interact.confirm(`ទូទាត់បញ្ចប់ទឹកប្រាក់ 0 USD សំរាប់ ${sel.package_count} កញ្ចប់`,{"context":"update","title":"Merchant Settlement"},e=>{
                        if(e){
                             vsapi.call(`${main_view.base_url}/api/merchant/payment/settle-zero`,p,btnOK,false).then(res=>{
                                if(res.status_code ===200){
                                    mThis.displayDeliveryItemsBySender();
                                    cv_interact.success(['Settlement for zero amount for ',d.success_count,' items completed'].join(''));
                                }else cv_interact.error(res.error_message);
                             });
                        }
                    });
                    return;
                  }
  
                  const op = {
                    "id":sender_id,
                    "prep_api":`${main_view.base_url}/api/merchant/payment/form-options`,
                    "type":trans_type, /* "receive" or "pay" */
                    "agent_name":sender_name,
                    "showCheck":false,
                    "primaryMethod":{
                        name:"ABA",
                        image:"",
                        currencies:[
                          {
                            code:"USD",
                            amount:amount,
                          },
                          {
                            code:"KHR",
                            amount:0,
                          }  
                        ]
                    },
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
                      p.agent_id = sender_id;
                      p.agent_type='Merchant';
                      p.package_count = sel.package_count;
                      p.packages = sel.ids;
                      const api_method = trans_type =='receive'? 'receive':'pay';
                      vsapi.call(`${main_view.base_url}/api/merchant/payment/${api_method}`,p,btnOK,false).then(res=>{
                          if(res.status_code ===200){ 
                              mThis.displayDeliveryItemsBySender(); 
                              PmtDialog.close();
                              cv_interact.success('Merchant Payment succeeded!');
                          }else cv_interact.warning(res.error_message);
                      });
                    }
                }
                PmtDialog.show(op);
        }

        this.getSelectionInfo = (context, allowed_status_id, error_message)=>{
            let ids = '';
            let total_sum = 0 ;
            let err = null;
            let sel_pacakges = [];
            let sel_row_count =0;

            let rows = mThis.table.rows().nodes();
            let i =0;
            let tr = null;
            do{
                tr = rows[i];
                if(!tr) break;
                tr = $(tr);
                if(tr.length ===0) break;
                let el = tr.find('td.checkbox>input[type="checkbox"]');
                let elAdjustAmount = tr.find('td.adjustment>input.col-input');
                let elAdjustNotes  = tr.find('td.notes>input.col-input');
                let spanTaxiFee = tr.find('td.forwarding_cost .value');
                //let sender_confirmed = tr.data('senderconfirmed');
                if(el){
                    if(el.is(':checked')) { 
                        let id = tr.data('pid');
                        let total_net = tr.data('totalnet');
                        let status_id = tr.data('statusid');
                        if(allowed_status_id && status_id != allowed_status_id){
                            if(!err || err =='') err = error_message;   
                        }
                        
                        sel_pacakges.push({'package_id':id,'forwarding_cost':spanTaxiFee.text(),'adjust_amount':elAdjustAmount.val(), 'adjust_notes':elAdjustNotes.val()});
                        ids = [ids,ids?',':null,id].join('');
                        total_sum += parseFloat(total_net);
                        sel_row_count++;
                    }
                }
                i++;
            }while(tr);

            return {'ids':ids,'package_count':sel_row_count,'total':Number(total_sum).toFixed(2),'packages':sel_pacakges,'error_message':err};
        }
                                        
        this.displayDeliveryItemsBySender = (onFinish=null) =>{   
            let p = FilterDialog_spmt.getData();
            p.search_value = mThis.elSearchPackage.val();
            vsapi.call([mThis.base_url, '/api/merchant/delivery-items'].join(''),p,null,null,main_view.apiCluster).then(res=>{
                if (mThis.table){
                    mThis.tblItems.DataTable().clear().destroy();
                    mThis.tblItems.empty();
                    mThis.table = null;
                }

                let data = [];
                if (res.status_code ===200) data = StringSanitizer.sanitizeObject(res.data,null,['cur']);
                let my_columns = [
                    { 
                        className:'checkbox',
                        data:function(data,a,b){
                            if (data.sender_pmt_status_id ==1)
                                return ['<i class="fas fa-check" style="color:green;font-weight:bold;font-size:1.3em"></i>'].join();  
                            else
                                return ['<input type="checkbox" class="checkbox-lg _spmt_check">'].join();
                        },
                        title:'#'
                    },
                    {
                        data:function(data,a,b){
                            return ['<div style="display:flex;flex-direction:row">',
                            '<a data-pid="',data.package_id,'" data-barcode="',data.barcode,'" href="javascript:void(0)" class="_spmt_print_barcode"><i class="fa fa-barcode"></i></a>',
                            '</div>'].join('');
                        },
                        title:'Barcode'
                    },
                    {
                        className:'delivery_date', 
                        data:'delivery_date',
                        title:'Delivery Date'
                    },
                    {
                        className:'receiver',
                        data:function(data,a,b) {   
                            return data.receiver_phone;
                        },
                        title:'Receiver'
                    },
                    {
                        className:'df_payer',
                        data:function(data,a,b) {   
                            let cls_sender_confirm ='dms-sender_confirmed';
                            if (data.sender_confirmed !=1) cls_sender_confirm ='dms-sender_not_confirmed';
                            return [data.df_payer,'<span class="',cls_sender_confirm,'"></span>'].join('');
                        },
                        title:'Fee Payer'
                    },
                    {
                        className:'status',
                        data:function(data,a,b){
                            let btn_class;
                            if(data.status_id ==9)
                                btn_class ="btn btn-sm btn-outline-danger";
                            else if(data.status_id ==8) 
                                btn_class ="btn btn-sm btn-outline-success";
                            else
                                btn_class ="btn btn-sm btn-outline-primary";

                            return ['<button data-statusid="',data.status_id,'" role-"button" class="',btn_class,'">',data.status,'</button>'
                            ].join('');
                        },
                        title:'Status'
                    },
                    {
                        className:'cod_amount',
                        data:function(data,a,b){
                            return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.cod_amount,'</span>'].join('');
                        },
                        title:'COD'
                    },
                    {
                        className:'fees',
                        data:function(data,a,b){
                            let v_value = 0;
                            if(data.base_fee <0 || data.delivery_fee <0) 
                                return '<span style="color:red;font-size:0.8em">មិនទាន់កំណត់</span>';                           
                            else{
                                let fees =0;
                                if ((data.df_payer+'').toLowerCase() =='sender')
                                    fees = parseFloat(data.base_fee) + parseFloat(data.delivery_fee);
                                return ['<span class="bl-currency">',data.cur,'</span><span class="value">',Number(fees).toFixed(2),'</span>'].join('');
                            }
                        },
                        title:'Fees'
                    },
                    {
                        className:'forwarding_cost',
                        data:function(data,a,b){
                            return ['<span class="bl-currency">',data.cur,'</span><span class="value">',data.forwarding_cost,'</span>'].join('');
                        },
                        title:'Taxi'
                    },
                    {
                        className:'adjustment',
                        data:function(data,a,b){
                            data.sender_adjust_amount=data.sender_adjust_amount?data.sender_adjust_amount:0;  
                            if(data.sender_pmt_status_id==1)
                                return ['<span class="billing-adjust-amount">',data.cur,data.sender_adjust_amount,'</span>'].join('');
                            else
                                return ['<input type="number" class="form-control col-input" value="',data.sender_adjust_amount,'" readOnly="true">'].join('');
                        },
                        title:'Adjustmemt'
                    },
                    {
                        className:'notes',
                        data:function(data,a,b){
                            if(data.sender_pmt_status_id==1)
                                return ['<span class="billing-pmt-notes">',data.sender_pmt_notes,'</span>'].join('');
                            else
                                return ['<input type="text" class="col-input form-control" value="',data.sender_pmt_notes,'" readOnly="true">'].join('');  
                        },
                        title:'Notes'
                    },
                    {
                        className:'total',
                        data:function(data,a,b){
                            if(!data.cur) data.cur='$';
                            if (isNaN(data.price)) data.price =0;
                            if(isNaN(data.sender_adjust_amount)) data.sender_adjust_amount =0;
                            if (isNaN(data.forwarding_cost)) data.forwarding_cost = 0 ;
                            let fees = isNaN(data.fees)? 0:data.fees;
                            if ((data.df_payer+'').toLowerCase() =='receiver') fees = 0;
                            if(isNaN(data.cod_fee)) data.cod_fee =0;
                            if (isNaN(data.cod_amount)) data.cod_amount =0;
                            let amount_to_sender = parseFloat(data.cod_amount) - parseFloat(fees) - parseFloat(data.forwarding_cost) +  parseFloat(data.sender_adjust_amount);
                                
                            if (data.sender_pmt_status_id ==1)
                                return ['<span class="currency billing-paid-text">',data.cur,'</span><span class="value billing-paid-text">',amount_to_sender,'</span>'].join('');
                            else
                                return ['<span class="bl-currency">',data.cur,'</span><span class="value">',Number(amount_to_sender).toFixed(2),'</span>'].join('');
                        },
                        title:'Total'
                    },
                    {
                        className:'pmt-status',
                        data:function(data,a,b){
                            if (data.sender_pmt_status_id ==1)
                                return ['<span class="billing-paid-text">Paid</span>'].join('');
                            else
                                return ['<span class="billing-unpaid-text">Unpaid</span>'].join('')
                        },
                        title:'Pmt'
                    },
                ];
                    
                if (!mThis.table){
                    mThis.table = mThis.tblItems.DataTable({
                        searching:false,
                        destroy:true,
                        paging:true,
                        pageLength:10,
                        ordering:false,
                        retrieve: true,
                        info:true,
                        bLengthChange:false,
                        saveState:true,
                        'processing': true,
                        'language': {
                            'loadingRecords': '&nbsp;',
                            'processing': 'Loading...',
                            "emptyTable": "No packages found!"
                        },
                        data:data,
                        columns:my_columns
                        ,"createdRow": function(row, data, dataIndex){
                            let tr = $(row);
                            if(isNaN(data.sender_adjust_amount)) data.sender_adjust_amount =0;
                            let fees = $.isNumeric(data.fees)? data.fees:0;
                            if ((data.df_payer+'').toLowerCase() =='receiver') fees = 0;
                            if (isNaN(data.cod_amount)) data.cod_amount =0;
                            let total_net = parseFloat(data.cod_amount) + parseFloat(data.sender_adjust_amount) - parseFloat(fees) - parseFloat(data.forwarding_cost);
                            tr.addClass('package_header'); 
                            tr.data('dfp',data.df_payer);
                            tr.data('senderconfirmed',data.sender_confirmed); 
                            tr.data('pid',data.package_id);
                            tr.data('cursymbol',data.cur);
                            tr.data('adjustamount',data.sender_adjust_amount);
                            tr.data('totalnet',total_net);       
                            tr.data('did',data.delivery_id);
                            tr.data('senderid',data.sender_id);
                            tr.data('statusid',data.status_id);
                            tr.data('driverpmtstatusid',data.sender_pmt_status_id);
                            let selected = tr.data('selected');
                            selected = (selected==1)?true:false;
                            if(selected== 1)  tr.find('._dpmt_check').prop('checked',selected);
                        }     								
                    });
                }
            
                let is_selected_all = mThis.btnSelectAll.data('select');
                if (is_selected_all==1) mThis.selectAllRows(1); 
                mThis.form_loaded = true;
                if(typeof onFinish ==='function') onFinish();            
            });
        };

        this.show = (options=null)=>{
            mThis.filter_enabled = false;
            mThis.init();
            mThis.displayDeliveryItemsBySender(()=>{
                mThis.filter_enabled = true;
            });
           
        }
    };

    this.TabPanel_payments = new function(){
        let mThis = this;
        this.base_url = main_view.base_url;
        const div = SenderPaymentComponent.self;
        this.self = div.find('#_spmt_panel_payments');
        mThis.tblItems = div.find('#_spmt_tblPmts');
        
        this.filter_panel = div.find('#_spmt_filter_panel');
        this.elFilter_trx_startdate = div.find('#_spmt_filter_pmt_startdate');
        this.elFilter_trx_enddate = div.find('#_spmt_filter_pmt_enddate');
        this.elFilter_trx_sender = div.find('#_spmt_filter_pmt_sender');
        this.elFilter_trx_type =div.find('#_spmt_filter_trx_type');
         
        this.elPmtBreakdown = this.self.find('#_spmt_pmt_breakdown');
        this.elTrxCount = this.self.find('#_spmt_pmt_count');
        this.elTrxTotal = this.self.find('#_spmt_pmt_total');
        this.btnApproveAll = this.self.find('#_spmt_btnApproveAll');
        this.btnPrintTrx = this.self.find('#_spmt_btnPrint');
        this.btnApproveAll.hide();
        
        this.cols = [
            {
                title:"Payment Date",
                data:(data,index,tr)=>{
                    return data.payment_date;
                }
            },
            {
                title:"Merchant",
                data:(data,index,tr)=>{
                    return data.agent_name;
                }
            },
            {
                title:"PCS",
                data:(data,index,tr)=>{
                    return [data.package_count,' pcs'].join('');
                }
            },
            {
                title:"Amount",
                className:"amount",
                data:(data,index,tr)=>{
                    let cls_amount = (data.trx_type || '').toLowerCase() =='disbursement'? 'text-danger':'text-success';
                    const amount = Number(data.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    return ['<span data-notes="',data.pmt_breakdowns,'" class="amount fw-semibold ',cls_amount,'">',amount,' ','<small>',data.currency_code,'</small></span>'].join('');
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
            },{
                title:"Bank Account",
                data:(data,index,tr)=>{
                  return [`<span>`,data.bank_account_info,`</span>`].join('');   
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
                    let trx_type = (data.trx_type+'').toLowerCase() =='disbursement'? `<span class="d-block text-center border rounded-4 p-1 bg-danger text-white">Payment</span>`: `<span class="d-block text-center border rounded-4 p-1 bg-success text-white">Received</span>`;
                    return [trx_type,'<span class="d-block p-1">',data.remarks,'</span>'].join('');
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
                   //let html = data.authorized ==1? `<span style="margin-top:-5px" class="text-success p-1 text-center border border-success rounded-4"><i class="fa fa-check"></i></span>` : [`<a data-id="`,data.trx_id,`" data-trxtype="`,data.trx_type,`" href="javascript:void(0)" class="lnk-approve-pmt"><span class="p-1 border border-success rounded-3">Approve</span></a>`].join('');
                    return [`<div class="d-flex gap-2">`,
                    `<a data-id="`,data.trx_id,`" data-trxtype="`,data.trx_type,`" href="javascript:void(0)" class="lnk-delete-pmt"><i class="fa fa-regular fa-trash-can text-danger fs-5"></i></a>`,
                    `</div>`].join('');
                }
            }
        ];
 
        this.getPmtBreakdown_html = (pmt_breakdowns) => {
            let bs = '';
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
        
  
        this.init = ()=>{
            //this.fileChooser.hide();
            if (mThis.initAlready) return;
            
            mThis.pmtListView = new ListView('_spmt_pmt_list', {
                'columns':mThis.cols,
                // 'clientSidePagination':true,
                // 'processResponse':(res)=>{ 
                //   return res.data.data;
                // },
                //'paginationContainer': document.querySelector('#test_div'),
                'apiCluster':main_view.apiCluster,
                'fetchApi': `${main_view.base_url}/api/merchant/payment/list`,
                'processResponse':(res)=>{
                    let d = res.status_code ===200? res.data:{};
                    //console.log(d.pmt_breakdowns);
                    mThis.elTrxCount.text(d.payment_count);
                    const bs = mThis.getPmtBreakdown_html(d.pmt_breakdowns);
                    mThis.elPmtBreakdown.html(bs);
                    // d.pmt_breakdowns.map(b=>{
                    //     console.log(typeof b, b);
                    //     //mThis.elPmtBreakdown.text();
                    // });  
                   

                    //if (d.unauth_count > 0) mThis.btnApproveAll.show(); else mThis.btnApproveAll.hide();
                    const total = Number(d.total).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      });
                    mThis.elTrxTotal.html([total,`<small> `,d.currency_code,`</small>`].join(''));
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


            SenderTabView.TabPanel_reports.prepareData(null,(ds)=>{
                (ds || []).unshift( {'id':-1,'sender_name':'(All Merchants)'});
                VSUtil.setComboItems(mThis.elFilter_trx_sender,ds,'id','sender_name',false,null,null);
                mThis.senders = ds;
            });

            mThis.btnPrintTrx.on('click',e=>{
               e.preventDefault();
               let p = mThis.getFilterData();
               p.use_paginate =0;
               //NOTE: that WebReportController route accept "wid" as "warehouse_id"
               p.wid = p.warehouse_id;
               p.type = 'all'; /** borth types: Receipt and Disbursement */
          
               //    vsapi.call(`${main_view.base_url}/api/merchant/payment/list`,p,null,false).then(res=>{
                
            //       if(res.status_code ===200){
            //         console.log(res); 
            //         //Todo: open and view pdf
            //       }else cv_interact.warning('Failed to retrieve merchant transaction list');  
            //    });


            let qstring = ReportCenterComponent.translateToQueryString(p);
            let data = {"data":['rtype=vd_transactions&',qstring].join('')};
             
            vsapi.call(`${main_view.base_url}/api/encryptData`,data,false,false).then(res=>{
                let d = {};
                if(res.error_message){
                    cv_interact.error(res.error_message);
                    return false;  
                }else {
                    d = res.data? res.data: res;
                }
                
                window.open([main_view.base_url,'/dms-gen-report/',d].join(''),'_blank');
                return false;
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
                                vsapi.call([main_view.base_url, '/api/merchant/payment/delete'].join(''), p).then(res => {
                                    if (res.status_code === 200) {
                                       mThis.pmtListView.showPage(mThis.getFilterData()); 
                                    }
                                    else cv_interact.error(res.error_message);
                                });
                            }
                        }); 
                    return;    
                } 
  

            });
           
            mThis.elFilter_trx_type .on('change',function(e){
                e.preventDefault();
                 mThis.pmtListView.showPage(mThis.getFilterData());
            });
            mThis.elFilter_trx_sender .on('change',function(e){
                e.preventDefault();
                 mThis.pmtListView.showPage(mThis.getFilterData());
            });

            mThis.elFilter_trx_startdate .on('change',function(e){
                e.preventDefault();
                 mThis.pmtListView.showPage(mThis.getFilterData());
            });

            mThis.elFilter_trx_enddate.on('change',function(e){
                e.preventDefault();
                 mThis.pmtListView.showPage(mThis.getFilterData());
            });

            mThis.initAlready = true;
        }

        this.displayTransactionPhoto = (tr,image_url)=>{
            if(!tr) return;
            let img = tr.find('td.attachment img.thumbnail');
            if (img) {
                img.prop('src',image_url);
            } 
        }

        this.deleteTransactionPhoto = (tr)=>{
            if(!tr) return;
            let trx_id = tr.data('trxid');
            let trx_type = tr.data('trxtype');
            let p = {'trx_id':trx_id,'trx_type':trx_type,'user_class':'merchant'};
            
            vsapi.call([mThis.base_url,'/api/deleteTransactionPhoto'].join(''),p).then(res=>{
                if(res.status_code ===200){
                    let img = tr.find('img.trx-img');
                    img.prop('src',null);
                }
                else cv_interact.error(res.error_message);
            }); 
        }
 
        mThis.getFilterData = ()=>{
            let p = {'warehouse_id':1,
            'search_value':null,
            'start_date':mThis.elFilter_trx_startdate.val(), 
            'end_date':mThis.elFilter_trx_enddate.val(), 
            'sender_id':mThis.elFilter_trx_sender.val(),
            'trx_type':mThis.elFilter_trx_type.val()
            };
           
            return p;
        }

        this.show = ()=>{
            mThis.init();   
            mThis.pmtListView.showPage(mThis.getFilterData());
        }
    }

    this.TabPanel_reports = new function(){
        let mThis = this;
        this.self =  SenderPaymentComponent.self.find('#_spmt_panel_reports');
        this.btnRunReport = this.self.find('#_spmt_btnRunReport');

        this.elFilter_report_sender = this.self.find('#_spmt_rptfilter_sender');
        this.elFilter_report_sender_pmt_status =  this.self.find('#_spmt_rptfilter_sender_pmt_status');
        
        this.elFilter_report_start_date = this.self.find('#_spmt_rptfilter_start_date');
        this.elFilter_report_end_date = this.self.find('#_spmt_rptfilter_end_date');
    
        this.getData =()=>{
            let p = {
                'warehouse_id':1,
                'report_name':'vd_summary',
                'sender_id':mThis.elFilter_report_sender.val(),
                'sender_pmt_status_id':mThis.elFilter_report_sender_pmt_status.val(),
                'start_date':mThis.elFilter_report_start_date.val(),
                'end_date':mThis.elFilter_report_end_date.val(),
                'sender_name':mThis.elFilter_report_sender.find('option:selected').text()
            };

            if (!p.report_name){
                cv_interact.warning('No report selected!');
                return null;
            }
            if (!p.sender_id){
                cv_interact.warning('No merchant selected!');
                return null;
            }
            return p;
        }

        this.prepareData = (def ={},onFinish)=>{
            if(!def) def = {}; 
            if (mThis.senders) {
                SenderTabView.TabPanel_payments.senders = mThis.senders;
                VSUtil.setComboItems(mThis.elFilter_report_sender,mThis.senders,'id','sender_name',false,null,def.driver_id);
                if(typeof onFinish =='function') onFinish(mThis.senders);
                return;
            }
            
            vsapi.call([main_view.base_url,'/api/getComboItems_sender'].join(''),null).then(res=>{ 
                if(res.status_code ===200){
                    let rows = StringSanitizer.sanitizeObject(res.data);
                    VSUtil.setComboItems(mThis.elFilter_report_sender,rows,'id','sender_name',false,null,def.driver_id);
                    if(typeof onFinish ==='function') onFinish(rows);
                    mThis.senders = rows;
                    SenderTabView.TabPanel_payments.senders = mThis.senders;
                }
            });
        }

        this.init = ()=>{
            if(mThis.initAlready) return;
            mThis.prepareData();
            this.reportItems = mThis.self.find('#_spmt_report_list');
            
            mThis.reportItems.on('click','a.report-item',function(e){
                if (mThis.prev_report_item) mThis.prev_report_item.removeClass('bl-report-selected');
                $(this).addClass('bl-report-selected');
                mThis.selected_rpt_name = 'vd_summary';
                mThis.prev_report_item = $(this);
            });

            this.btnRunReport.on('click',function(e){
                e.preventDefault();
                
                let p = mThis.getData();
                if (!p) return;
    
                //This hs_mermchant_invoice route recognize "wid" as warehouse_id
                p.wid = p.warehouse_id;
                if(!p.sender_id){
                    cv_interact.warning('Please select a merchant');
                    return;
                }

                let qstring = ReportCenterComponent.translateToQueryString(p);
                let data = {"data":['rtype=hs_merchant_invoice&',qstring].join('')};
    
                vsapi.call(`${main_view.base_url}/api/encryptData`,data,false,false).then(res=>{
                    let d = {};
                    if(res.error_message){
                        cv_interact.error(res.error_message);
                        return false;  
                    }else {
                        d = res.data? res.data: res;
                    }
                    
                    window.open([main_view.base_url,'/hs-merchant-invoice/',d].join(''),'_blank');
                    return false;
                });
 
            });

            mThis.initAlready = true;
        }

        this.show = ()=>{
            mThis.init();

        }
    }
}
 
var FilterDialog_spmt = new function(){
    let mThis = this;
    this.self = $('#_spmt_dlgFilter');
    this.elTitle = $('#_spmt_dlgFilterTitle');
    this.btnOK = $('#_spmt_dlgFilter_btnOK');
    this.lblDriverName = $('#_spmt_filter_sender_name'); 

    this.getData = ()=>{
        let p = {};
        mThis.self.find('.spmt_filter_field').each(function(){
            let el = $(this);
            let dataMember = el.data('field');
            p[dataMember] = el.val();  
        });

        let panel = SenderTabView.TabPanel_deliveries;
        p.sender_id = panel.elFilter_sender.val();
        p.warehouse_id = panel.elFilter_warehouse.val();
        return p;
    }

    this.btnOK.on('click',(e)=>{
        e.preventDefault();
        mThis.self.modal('hide');
        let p = mThis.getData();
        let xp = SenderTabView.TabPanel_deliveries;
        p.warehouse_id = xp.elFilter_warehouse.val();
        p.driver_id =  xp.elFilter_sender.val();
        if (typeof mThis.onClose =='function') mThis.onClose(p);
    });

    this.show = (op={}, onClose)=>{
        mThis.elTitle.html(op.title);
        mThis.onClose = onClose;
        mThis.lblDriverName.text(op.sender_name);
        mThis.self.modal({
            backdrop:'static'
        });
    }
}