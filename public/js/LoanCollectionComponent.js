'use strict'
//begin::LoanCollectionComponent
var LoanCollectionComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_loanCollectionComponent');
    this.base_url = $('#__base_url').val();
  
    this.tblPmts = $('#_tblPmts');
    this.btnBack = $('#_collect_back');
    this.btnNewPmt = $('#_collect_btnNewPmt');
    this.btnFind = $('#_collect_btnSearch');
    this.elSearch = $('#_collect_search');
    this.elFilter_loan = $('#_collect_filter_loan');

    this.lnkNewPmt = $('#pmts_lnkNewPmt');
    this.btnPayOff = $('#pmts_lnkPayOff');
    this.btnExcel = $('#_collect_btnExcel');
    this.btnPDF = $('#_collect_btnPDF');
    this.btnExcel = $('#_collect_btnExcel');
    this.div_loan_fields = $('#pmt_loan_fields');
    this.div_loan_fields.parent().hide();

    this.createDropdownMenuHtml_pmt =(trx_id,loan_id,status_id,borrower_id)=> {
         let html = ['<div class="dropdown-menu" data-id="',trx_id,'" data-trxid="',trx_id,'" data-loanid="',loan_id,'" data-statusid="',status_id,'">',
         //'<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_modify" href="javascript:void(0)"><i class="fas fa-edit" style="margin-top:3px;"></i> <span> Modify</span</a>',
       '<div class="dropdown-divider"></div>',
         '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_print" href="javascript:void(0)"><i class="fa fa-print" style="color:green"></i> Print Receipt</a>',
         '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_send_email" href="javascript:void(0)"><i class="fa fa-envelope" style="color:orange"></i> Send By Email</a>',
         //'<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_create_pmt_schedule" href="#"><i class="fa fa-envelope" aria-hidden="true" style="color:#1BBEE7"></i>Send by Telegram</a>',
         '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _loanlist_person_profile" href="javascript:void(0)"><i class="fas fa-user" style="color:grey;font-size:1.1em;margin-top:2px;"></i>Borrower Details</a>',
         '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_delete" href="javascript:void(0)"><i class="fas fa-times" style="color:red;font-size:1.1em;margin-top:2px;"></i>Delete</a>',
         
         '</div>'].join('');
         return html;
     } 
     
     this.init = () => {

          mThis.elFilter_loan.on('change',function(e){
                e.preventDefault();
                mThis.displayLoanInfo();
                mThis.displayPaymentList();
          });

                mThis.btnBack.on('click',(e)=>{
                    mThis.back();
                });

                mThis.btnFind.on('click',(e)=>{
                    e.preventDefault();
                    mThis.displayPaymentList();
                });

                mThis.elSearch.on('keyup',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayPaymentList();
                    
                });

                mThis.elSearch.on('change',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayPaymentList();
                    
                });

                 mThis.btnNewPmt.on('click', function(e){
                    let op = {title:'Receive Payment','loan_id':mThis.elFilter_loan.val(),'previous_view':mThis};
                    op.previous_view = mThis;
                    op.previous_view_option = {'title':"Loan Collection",'loan_id':mThis.elFilter_loan.val()};
                    ReceivePaymentComponent.show(op);    
                 });
                 
                 mThis.lnkNewPmt.on('click',function(e){
                    let op = {title:'Receive Payment','loan_id':mThis.elFilter_loan.val(),'previous_view':mThis};
                    if(op.loan_id ==0 || !op.loan_id) {
                        cv_interact.alert('No loan is selected!');
                        return;
                    }
                    op.previous_view = mThis;
                    op.previous_view_option = {'title':"Loan Collections",'loan_id':mThis.elFilter_loan.val()};
                    ReceivePaymentComponent.show(op); 
                 });

                 mThis.btnExcel.on('click',(e)=>{
                     e.preventDefault();
                     let data = mThis.process_export_data_excel(mThis.data);
                     JsonToExcel.exportToExcel(data,'payments',true);
                 });
 
                 mThis.tblPmts.on('click','._trx_edit',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    //let status_id = tr.data('statusid');
                    let trx_id = $(this).data('id');
                    // if (status_id>1) {
                    //     cv_interact.alert('Cannot edit because the Loan Application is already approved!');   
                    // } 
                    
                    let op = {'title':'Modify Payment','trx_id':trx_id,'previous_view':mThis,'previous_view_option':{'title':'Loan Collection'}};
                    ReceivePaymentComponent.show(op);
                 });
 
                 mThis.btnPayOff.on('click',(e)=>{
                     e.preventDefault();
                    let loan_id = mThis.elFilter_loan.val();
                   if(!loan_id || loan_id<=0){
                    cv_interact.alert('No loan is selected!');
                    return;
                   }
                    let op = {'title':'Pay Off Loan','loan_id':loan_id,'borrower_id':null,'previous_view':mThis,'previous_view_option':{'title':'Loan Collections'}};
                    PayoffComponent.show(op);
                 });

                 mThis.tblPmts.on('click','._loanlist_person_profile',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let loan_id = tr.data('loanid');
                    let borrower_id = tr.data('borrowerid');
                    let op = {'title':'Person Profile','person_id':borrower_id,'previous_view':mThis,'previous_view_option':{'title':'Loan Collections','loan_id':loan_id}};
                    PersonComponent.show(op); 
                 });

                 mThis.tblPmts.on('click','._trx_delete',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let status_id = tr.data('statusid');
                    let loan_id = tr.data('loanid');
                    let trx_id = tr.data('id');
                    if (!AuthManager.allowed(206)) cv_interact.alert('No permission to delete payment');   
                    
                    cv_interact.confirm('Delete this payment?','Delete Payment',(e)=>{
                        if(e){
                             let p ={'trx_id':trx_id,'loan_id':loan_id};
                             post_ajax(`${mThis.base_url}/api/loan/delete-payment`,p,(res)=>{
                               if(res.status =='OK')
                                   tr.remove();
                               else cv_interact.alert(res.error_message,'','error');
                             });
                        }
                    },'Delete',null,'delete');
                 });
                  
                 mThis.tblPmts.on('click','._trx_modify',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let trx_id = tr.data('trxid');
                    cv_interact.alert('Currently now allowed!');
                 });

                 mThis.tblPmts.on('click','._trx_print',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let trx_id = tr.data('trxid');
                    mThis.getReceiptData(trx_id,(d)=>{
                        if(!d) return;
                        let op = {'copies_per_page':2};
                        if(!d.receipt_number) d.receipt_number ='NA';
                        PDFReceipt.show(d,op);
                     });
                 });

                 mThis.tblPmts.on('click','._trx_send_email',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let status_id = tr.data('statusid');
                    let trx_id = tr.data('id');
                    let loan_id = tr.data('loanid');
                 
                    let borrower_id = tr.data('borrowerid');
                    let p = {'loan_id':loan_id,'trx_id':trx_id,'borrower_id':borrower_id};

                    mThis.mailReceipt(p,(res)=>{
                        if (res.status =='OK'){
                            cv_interact.alert('Mail has been sent!','','info');
                        }else cv_interact.alert(res.error_message,'','error');
                    });
                 });


                 mThis.tblPmts.on('click','._trx_send_telegram',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let status_id = tr.data('statusid');
                    let trx_id = tr.data('id');
                    let loan_id = tr.data('loanid');
                 
                    let borrower_id = tr.data('borrowerid');
                      
                  
                 });

                 //##BEGIN:: tblPackages dropdown menu
                 mThis.tblPmts.on('click','a.btn_pmt_action',function(e) {
                     e.preventDefault();
                     let p = $(this).parent();
                     let x = $(this);
                     let tr = x.closest('tr');
                      
                     let trx_id = tr.data('trxid');
                     
                     let loan_id = tr.data('loanid');
                     let status_id = tr.data('statusid');
                     let borrower_id = x.data('borrowerid');
                     let dropdownMenu = p.find('.dropdown-menu');
 
                     if (!dropdownMenu || dropdownMenu.length <= 0) {  
                         p.append(mThis.createDropdownMenuHtml_pmt(trx_id,loan_id,status_id,borrower_id));
                         dropdownMenu = p.find('.dropdown-menu');
                     }
                     //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                     if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');
 
                     dropdownMenu.toggleClass('show');
                     if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;
 
                 });
 
                 $(document).on('click',function(e){
                     //e.preventDefault();
                     let x = mThis.tblPmts.find('div.dropdown-menu'); 
                     let container =  x.parent(); 
                     //mThis.package_dropdown_menu.parent(); // div.dropdown
                     
                     if(container){
                         if (!container.is(e.target) && container.has(e.target).length === 0) {
                             //mThis.package_dropdown_menu.removeClass('show');
                             x.removeClass('show'); 
                         } 
                     }
                 });
                 
                 mThis.tblPmts.on('mouseover','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
 
                     col_action.find('a.btn_pmt_action>i').addClass('action-button-zoomin');    
                 }).on('mouseleave','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
                     col_action.find('a.btn_pmt_action>i').removeClass('action-button-zoomin');
                     col_action.find('div.dropdown-menu').removeClass('show');  
                 });
                 
        //##END:: tblPmts dropdown menu
                  
     }
 
     this.getReceiptData = (trx_id,onFinish)=>{
        let p = {'trx_id':trx_id};
        post_ajax([mThis.base_url,'/api/loan/receipt-info'].join(''),p,(d)=>{
            onFinish(d);
        });  
    }

    this.displayLoanInfo = ()=>{
        let p = {'loan_id':mThis.elFilter_loan.val()};
        if(p.loan_id <=0 || !p.loan_id) {
            mThis.div_loan_fields.parent().hide();
            return;
        }
        post_ajax(`${mThis.base_url}/api/loan/info`,p,(d)=>{
           if(!d) console.error(`loan_id provided is "${loan_id}" but the loan info is NULL`); 
           let cur = d.currency? d.currency:'$'; 
           d = StringSanitizer.sanitizeObject(d,null,['email']);

           d.outstanding_total = parseFloat(d.interest_due) +  parseFloat(d.outstanding_principal) +  parseFloat(d.penalty_due);
           d.outstanding_total = [cur,$.isNumeric(d.outstanding_total)?d.outstanding_total:0].join('');
           d.outstanding_principal = [cur,d.outstanding_principal].join('');
           d.principal = [cur,d.principal].join('');
           //d.net_principal = [cur,d.principal - parseFloat(d.discount_principal)].join('');
           d.interest_due = [cur,d.interest_due].join('');
           d.total_paid = [cur, (parseFloat(d.principal_paid) + parseFloat(d.interest_paid) + parseFloat(d.penalty_fee) - parseFloat(d.discount_amount))].join('');
           d.principal_paid = [cur, d.principal_paid - parseFloat(d.discount_principal)].join('');
           
           d.discount_principal = [cur,d.discount_principal].join('');
           mThis.div_loan_fields.find('.loan-info-value').each(function(){
               let el = $(this);
               let f = el.data('field');
               el.text(d[f]); 
           });

            //mThis.div_loan_fields.addClass('animate-slide-up');
            mThis.div_loan_fields.parent().show();
            //mThis.div_loan_fields.removeClass('animate-slide-up');
            
           //if (typeof onFinish =='function') onFinish();
        });
     }

     this.displayPaymentList = function()
     { 
         let p = {'search_value':mThis.elSearch.val(), 'loan_id':mThis.elFilter_loan.val()};

         if(p.loan_id <=0 || !p.loan_id) {
            mThis.div_loan_fields.parent().hide();
         }

         post_ajax([mThis.base_url, '/api/loan/payment-list'].join(''),p,function(data) {  
             if(typeof data =='string') console.error(data);
             if (mThis.table){
                     mThis.tblPmts.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblPmts.empty();
                     //alert('destroyed => '+  mThis.tblPmts.html());
                     mThis.table = null;
             }
             data = StringSanitizer.sanitizeObject(data,null,['email']);

             //begin::Set up columns
                 let cnt = 1;
                 let my_columns = [
                     {
                         // data:function(data,type,meta) {
                         //     return cnt++;
                         // },
                         // title:'NO.'
                         className:'col_action',
                         data:function(data,row,display) {
                          let html =['<div class="dropdown">',
                              '<a href="#" data-id="',data.id,'" data-statusid="',data.status_id,'" data-borrowerid="',data.borrower_id,'" class="btn_pmt_action" aria-haspopup="true" aria-expanded="false">',
                              '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                              //' Action',
                              '</a>',
                             '</div>'].join('');
                             return html;
                        
                         } 
                     },
                    //  {
                    //     data:'loan_code',
                    //     title: 'Loan#'
                    //  },
                     {
                        data:'receipt_number',
                        title: 'Receipt#'
                     },
                     {
                         data:'borrower_name',
                         title: 'Borrower'
                     },
                     {
                        data:function(data,a,b){
                            return['<div class="lc-pmt-date">',data.payment_date,'</div>'].join('');
                        },
                        title: 'Payment Date'
                    },
                     {
                        data:'pmt_method',
                        title:'Pmt method'
                     },
                     {
                        data:'pmt_type',
                        title:'Type'
                     },
                    //  {
                    //      data: 'n_id',
                    //      title: 'National ID'
                    //  },
                    //  {
                    //      data: function(data,a,b){
                    //          return [data.phone_number,data.phone_number?' | ':null,data.phone_number1].join('');
                    //      },
                    //      title: 'Phone Number'
                    //  },
                     {
                         data: function(data,a,b){
                             let cur = data.currency?data.currency:'$';
                             return['<div class="lc-amount">',cur,data.net_amount,'</div>'].join('');
                         },
                         title: 'Amount'
                     },
                    //  {
                    //     data: function(data,a,b){
                    //         let cur = data.currency?data.currency:'$';
                    //         return [cur,data.principal_amount].join('');
                    //     },
                    //     title: 'Principal Amount'
                    // },
                    {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            return [cur,data.interest_amount].join('');
                        },
                        title: 'Interest'
                    },
                    {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            return [cur,data.outstanding_principal].join('');
                        },
                        title:'Outstanding'

                    },
                    {
                        data:'booking_date',
                        title: 'Booking Date'
                    },
                    {
                        data:'create_user',
                        title:'Received By'
                    },
                    {
                        data:'remarks',
                        title:'remarks'
                    }
                     // {
                     //       className:'name', //css class "total" is used for accessing value and update values of totals in <td>
                     //       data:function(data,a,b){
                     //         return ['<div style="display:flex;flex-direction:column">',
                     //             '<div class="pg-total_driver"><span class="total-label">Driver:</span><span class="total-value driver-total">',data.driver_total,'</span></div>',
                     //             '<div class="pg-total_sender"><span class="total-label">Sender:</span><span class="total-value sender-total">',data.sender_total,'</span></div>',
                     //         '</div>'].join(''); 
                     //     },
                     //     title:'Totals'
                     // }
                 ];
                 //END Define colum
                  
             if (!mThis.table)
             mThis.table = mThis.tblPmts.DataTable({
                 searching:false,
                 destroy:true,
                 paging:true,
                 ordering:false,
                 //dom: 'Bfrtip',
                 retrieve: true,
                 //scrollY:390,
                 //scrollX:500,
                 //pagingType:'numbers',
                 info:true,
                 bLengthChange:false,
                 saveState:true,
                  // rowReorder: {
                     // dataSrc: 'sequence'
                   // },
                    'processing': true,
                    'language': {
                         'loadingRecords': '&nbsp;',
                         'processing': 'Loading...',
                         "emptyTable": "No payments found!"
                     },
                     data:data,
                     columns:my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('id',data.id);
                            tr.data('trxid',data.id);
                            tr.data('loanid',data.loan_id);
                            tr.data('statusid',data.status_id);
                            tr.data('borrowerid',data.borrower_id);
                       }
 
                 //    ,"cellCreated":function(td,data,colIndex) {
                 //        alert('test');
                 //      if(colIndex==9){
                 //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                 //         $(td).html(html); 
                 //      }
                 //   }							
             });
             
             mThis.data = data;
             // let div = $('#_dl_d_filter_panel');  
             // $('#_dl_tblPmts_wrapper>div.dt-buttons').prepend(div);
                                    
         }); //close post_ajax()
                  
     };
     
     this.process_export_data_excel = (data)=>{
        //let cols =['receipt_number','payment_date','booking_date','pmt_method','amount','principal_amount','interest_amount','penalty_fee','outstanding_principal','create_user','remarks'];
        //  let disp_cols =['Receipt Number','Payment Date','Booking Date','Pmt method','Amount','Principal Payment','Interest payment','Penalty Fee','Outstanding Principal','Receieved By','Remarks'];
        //  let first_item = data[0];
        //  if(first_item){
        //     for (let prop of Object.keys(first_item)) {
        //         first_item[prop]
        //     }
        //  }
       
        return data;
     }

     this.getStatusClass =(status_id)=>{
        if(status_id <=1) return 'btn btn-sm btn-outline-warning';
        else if (status_id ==2) return 'btn btn-sm btn-outline-primary';
        else if (status_id ==3)  return 'btn btn-sm btn-outline-success';
        else return 'btn btn-sm btn-outline-warning';
     }
 
     this.show = (option) => {
         //LoanAppListComponent.self.show().siblings().hide();
         if(!option) option={};
         mThis.options = option;
         mThis.elScreenTitle.text(option.title);
         if (option.previous_view) {
            mThis.btnBack.show();
            mThis.previous_view = option.previous_view;
            mThis.previous_view_option = option.previous_view_option;
         } else mThis.btnBack.hide();

         mThis.loadFilters(option.loan_id,()=>{
            mThis.self.show().siblings().hide();
            mThis.displayPaymentList();
         });
        
     }

     this.loadFilters = (loan_id,onFinish,refresh=false)=>{
           //get time elapesed since last call of this method 
           let now = new Date();
           let seconds_ago =0;
           if(mThis.last_call_time){
               let  timeDiff = now - mThis.last_call_time;
               // strip the ms
               timeDiff /= 1000;
               seconds_ago = Math.round(timeDiff);
           }
       //end:: get time elapsed since last call of this method
        if (seconds_ago <=600 &&  mThis.loan_options && !refresh){
            CommonLib.setComboItems(mThis.elFilter_loan,mThis.loan_options,'id','loan_name',true,'Select Loan',0);
            if(loan_id> 0) mThis.elFilter_loan.val(loan_id).trigger('change');
            if(onFinish) onFinish();
        }else{
            post_ajax(`${mThis.base_url}/api/loan/filter-options`,null,(items)=>{
          
                if(items){
                    CommonLib.setComboItems(mThis.elFilter_loan,items,'id','loan_name',true,'Select Loan',0);
                    if(loan_id> 0) mThis.elFilter_loan.val(loan_id).trigger('change');
                    mThis.loan_options = items;
                    if(onFinish) onFinish();
                }
           }); 
        }
      
    }

    // p = {'trx_id',[loan_id],[borrower_id]}
      this.mailReceipt =(p,onFinish)=>{
        //let p = {'trx_id':trx_id};
        /**
          NOTE: that  "api/email/send-receipt" will use @trx_id to get receipt data in JSON format, and post this json data to email's html page (that is "resources/views/mail.blade.php"), where there is link to download.
          Once student clicks on the Link to download then the javascript script on email's page (i.e: rcpt.js) will use the JSON data to formulate receipt PDF view. 
        **/
        post_ajax(`${mThis.base_url}/api/email/send-receipt`,p,function(res){
            onFinish(res);
        });
      }

     this.back = ()=>{
         if(mThis.previous_view) mThis.previous_view.show(mThis.previous_view_option);
     }
 
  };
 //end::LoanCollectionComponent
   
$(document).ready(function(){
    LoanCollectionComponent.init();
});