'use strict'
//begin::LoanListComponent
let LoanListComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_loanListComponent');
    this.base_url = $('#__base_url').val();
 
    this.tblLoanList = $('#_tblLoanList');
    this.btnNewLoan = $('#_loanlist_btnNewLoan');
    this.btnFind = $('#_loanlist_btnSearch');
    this.elSearch = $('#_loanlist_search');
    
    this.btnPrint = $('#_loanlist_btnPrint');
    this.btnPDF = $('#_loanlist_btnPDF');
    this.btnExcel = $('#_loanlist_btnExcel');
  
     this.createDropdownMenuHtml_loan =(loan_id,status_id,borrowerid)=> {
         //cla = 'class_list_action' = > cla_delete, cla_modify,...
         let html = ['<div class="dropdown-menu" data-id="',loan_id,'" data-statusid="',status_id,'">',
         '<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_receive_pmt" href="javascript:void(0)"><i class="fas fa-file-invoice-dollar" style="margin-top:3px;"></i>Receive Payment</a>',
         '<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_payoff" href="javascript:void(0)"><i class="fas fa-file-invoice-dollar" style="margin-top:3px;"></i>Pay Off</a>',
         '<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_person_profile" href="javascript:void(0)"><i class="fas fa-list-alt" style="color:grey;font-size:1.1em;margin-top:2px;"></i>Borrower Profile</a>',
 
         '<div class="dropdown-divider"></div>',
         '<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_pmt_history" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:orange"></i> Repayment History</a>',
         '<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_discount_principal" href="javascript:void(0)"><i class="fas fa-credit-card" style="color:grey;font-size:1.1em;margin-top:2px;"></i>Discount Principal</a>',
         //'<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_create_pmt_schedule" href="#"><i class="fa fa-list" style="color:green"></i> Pay Off</a>',
         //'<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_create_pmt_schedule" href="#"><i class="fa fa-list" style="color:green"></i> Write off</a>',
        // '<a data-id="',loan_id,'" data-personid="',person_id,'" class="dropdown-item _loanlist_change_status" href="#"><i class="fa fa-tasks" style="color:grey;margin-top:3px;font-size:1.1em"></i> <span>Change Status</span</a>',
         '<a data-id="',loan_id,'" data-borrowerid="',borrowerid,'" class="dropdown-item _loanlist_delete" href="#"><i class="fa fa-times" style="color:red;margin-top:3px;"></i> <span>Delete Loan</span</a>',
         '</div>'].join('');
         return html;
     } 

     this.refreshLoanAmounts = (tr,d)=>{
         if(!tr) return;
         tr.find('td.principal').text(d.principal);
         tr.find('td.monthly_interest_rate').text([d.monthly_interest_rate,'%'].join(''));
         let outstanding = d.principal - d.principal_paid;
         tr.find('td.outstanding').text(Number(outstanding).toFixed(2));
     }
     
     this.init = () => {
  
         mThis.btnExcel.on('click',(e)=>{
            e.preventDefault();
            let data = mThis.process_export_data_excel(mThis.data);
            JsonToExcel.exportToExcel(data,'loans',true);
        });
                mThis.btnFind.on('click',(e)=>{
                    e.preventDefault();
                    mThis.displayLoanList();
                });
 
                mThis.elSearch.on('keyup',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayLoanList();
                    
                });

                mThis.elSearch.on('change',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayLoanList();
                    
                });

                 mThis.btnNewLoan.on('click', (e) => {
                    let op = {title:'New Loan Application','previous_view':mThis};
                    op.previous_view = mThis;
                    op.previous_view_option = {'title':"Active Loans"};
                    //op.loan_app_id = null;
                    LoanAppComponent.show(op);    
                 });

                 
                 mThis.tblLoanList.on('click','._loanlist_discount_principal',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    //let borrower_id = tr.data('borrowerid');
                    let loan_id = tr.data('id');
                    let loan_code = tr.data('code');
                    //alert('todo: Discount');
                    let op = {'loan_id':loan_id,'title':'Discount Principal on Loan #' + loan_code};
                    DiscountDialog.show(op,(p)=>{
                        if(p){
                           post_ajax(`${mThis.base_url}/api/loan/discount-principal`,p,(res)=>{
                               if(res.status =='OK'){
                                  mThis.refreshLoanAmounts(tr,res);
                               }else cv_interact.alert(res.error_message,'','error');
                           }); 
                        }
                    });
                 });

                 mThis.tblLoanList.on('click','._loanlist_pmt_history',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let borrower_id = tr.data('borrowerid');
                    let loan_id = tr.data('id');
                    let op = {'title':'Payment History','loan_id':loan_id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':{'title':'Active Loans'}};
                    LoanCollectionComponent.show(op);
                 });

                 mThis.tblLoanList.on('click','.btn_receive_pmt',function(e){
                     e.preventDefault();
                     let tr = $(this).closest('tr');
                     let id = tr.data('id');
                     let borrower_id = tr.data('borrowerid');
                     let op = {'title':'Receive Payment','loan_id':id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':mThis.options};
                     ReceivePaymentComponent.show(op); 
                 });
 
                 mThis.tblLoanList.on('click','.btn_payoff',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let borrower_id = tr.data('borrowerid');
                    let loan_id = tr.data('id');
                   
                    let op = {'title':'Pay Off Loan','loan_id':loan_id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':{'title':'Active Loans'}};
                    PayoffComponent.show(op);
                });

                 mThis.tblLoanList.on('click','.btn_pmt_history',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let borrower_id = tr.data('borrowerid');
                    let loan_id = tr.data('id');
                   
                    let op = {'title':'Payment History','loan_id':loan_id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':{'title':'Active Loans'}};
                    LoanCollectionComponent.show(op);
                });

                 mThis.tblLoanList.on('click','._loanlist_person_profile',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let borrower_id = tr.data('borrowerid');
                   
                    let op = {'title':'Person Profile','person_id':borrower_id,'previous_view':mThis,'previous_view_option':{'title':'Active Loans'}};
                    PersonComponent.show(op); 
                 });
 
                 mThis.tblLoanList.on('click','._loanlist_edit',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    //let status_id = tr.data('statusid');
                    let loan_app_id = $(this).data('id');
                    // if (status_id>1) {
                    //     cv_interact.alert('Cannot edit because the Loan Application is already approved!');   
                    // } 
                    
                    let op = {'title':'Loan Details','loan_app_id':loan_app_id,'previous_view':mThis,'previous_view_option':{'title':'Active Loans'}};
                    //LoanAppComponent.show(op); 
                 });
 
                 mThis.tblLoanList.on('click','._loanlist_delete',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let status_id = tr.data('statusid');
                    let loan_id = $(this).data('id');
                    if (AuthManager.allowed(10)) cv_interact.alert('Cannot delete because the Loan is already approved!');   
                    
                    cv_interact.confirm('Delete this Loan?','Delete Loan',(e)=>{
                        if(e){
                             let p ={'loan_id':loan_id};
                             post_ajax(`${mThis.base_url}/api/loan/delete`,p,(res)=>{
                               if(res.status =='OK')
                                   tr.remove();
                               else cv_interact.alert(res.error_message,'','error');
                             });
                        }
                    },'Delete',null,'delete');
                 });
 
                 mThis.tblLoanList.on('click','._loanlist_receive_pmt',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let id = tr.data('id');
                    let borrower_id = tr.data('borrowerid');
                    let op = {'title':'Receive Payment','loan_id':id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':mThis.options};
                    ReceivePaymentComponent.show(op);
                 });

                 mThis.tblLoanList.on('click','._loanlist_payoff',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let id = tr.data('id');
                    let borrower_id = tr.data('borrowerid');
                    let op = {'title':'Pay Off','loan_id':id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':mThis.options};
                    PayoffComponent.show(op);
                 });


                 mThis.tblLoanList.on('click','._loanlist_disburse',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let status_id = tr.data('statusid');
                    let loan_id = $(this).data('id');
                    if (status_id==3) {
                        cv_interact.alert('This loan is already disbursed!');
                        return;
                    }
                    // else if(status_id !=2) {
                    //     cv_interact.alert('This Loan is not yet approved!');
                    //     return;
                    // } 
                    let op = {'title':'Disburse Loan','loan_id':loan_id,'previous_view':mThis,'previous_view_option':{'title':'Active Loans'}};
                    DisburseLoanComponent.show(op);
                  
                 });

                 //##BEGIN:: tblPackages dropdown menu
                 mThis.tblLoanList.on('click','a.btn_loan_action',function(e) {
                     e.preventDefault();
                     let p = $(this).parent();
                     let x = $(this);
                      
                     let loan_id = x.data('id');
                     let status_id = x.data('statusid');
                     let borrowerid = x.data('borrowerid');
                     let dropdownMenu = p.find('.dropdown-menu');
                     if (!dropdownMenu || dropdownMenu.length <= 0) {
                         p.append(mThis.createDropdownMenuHtml_loan(loan_id,status_id,borrowerid));
                         dropdownMenu = p.find('.dropdown-menu');
                     }
                     //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                     if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');
 
                     dropdownMenu.toggleClass('show');
                     if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;
 
                 });
 
                 $(document).on('click',function(e){
                     //e.preventDefault();
                     let x = mThis.tblLoanList.find('div.dropdown-menu'); 
                     let container =  x.parent(); 
                     //mThis.package_dropdown_menu.parent(); // div.dropdown
                     
                     if(container){
                         if (!container.is(e.target) && container.has(e.target).length === 0) {
                             //mThis.package_dropdown_menu.removeClass('show');
                             x.removeClass('show'); 
                         } 
                     }
                 });
                 
                 mThis.tblLoanList.on('mouseover','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
 
                     col_action.find('a.btn_loan_action>i').addClass('action-button-zoomin');    
                 }).on('mouseleave','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
                     col_action.find('a.btn_loan_action>i').removeClass('action-button-zoomin');
                     col_action.find('div.dropdown-menu').removeClass('show');  
                 });
                 
        //##END:: tblLoanList dropdown menu
                  
     }
 
     this.displayLoanList = function()
     { 
         var p = {'search_value':mThis.elSearch.val()};
         post_ajax([mThis.base_url, '/api/loan/list'].join(''),p,function(data) {  
             if(typeof data =='string') console.error(data);

             if (mThis.table){
                     mThis.tblLoanList.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblLoanList.empty();
                     //alert('destroyed => '+  mThis.tblLoanList.html());
                     mThis.table = null;
             }
             data = StringSanitizer.sanitizeObject(data);

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
                              '<a href="#" data-id="',data.id,'" data-statusid="',data.status_id,'" data-borrowerid="',data.borrower_id,'" class="btn_loan_action" aria-haspopup="true" aria-expanded="false">',
                              '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                              //' Action',
                              '</a>',
                             '</div>'].join('');
                             return html;
                        
                         } 
                     },
                     {
                        className:'code', 
                        data:function(data,a,b){
                            return ['<span class="loanlist-loancode">',data.code,'</span>',
                            '<div class="pmt-bttons">',
                            '<a href="#" class="btn_receive_pmt has-popover" data-id="',data.id,'" data-poptext="Receive payment" data-borrowerid="',data.borrower_id,'"><i class="fas fa-file-invoice-dollar" style="color:green;font-size:1.2em"></i></a>', 
                            '&nbsp;&nbsp;<a href="#" class="btn_pmt_history has-popover" data-poptext="Payment history" data-id="',data.id,'" data-borrowerid="',data.borrower_id,'"><i class="fa fa-list-alt" style="color:orange;font-size:1.2em"></i></a>',
                            '&nbsp;&nbsp;<a href="#" class="btn_payoff has-popover" data-poptext="Pay Off" data-id="',data.id,'" data-borrowerid="',data.borrower_id,'"><i class="fas fa-file-invoice-dollar" style="color:blue;font-size:1.2em"></i></a>',
                            
                            '</div>'].join('');
                        },
                        title: 'Loan Number'
                      },
                     {
                        className:'borrower',
                         data:function(data,a,b){
                             return ['<span class="loanlist-borrower-name">',data.borrower_name,'</span>',
                            '<span class="loanlist-studentcode">',data.student_code,'</span>'].join('');
                         },
                         title: 'Borrower'
                     },
                     {
                        data: 'program_name',
                        title: 'Program'
                    },
                    //  {
                    //      data: 'n_id',
                    //      title: 'National ID'
                    //  },
                     {
                         data: function(data,a,b){
                             return [data.phone_number,data.phone_number?' | ':null,data.phone_number1].join('');
                         },
                         title: 'Phone Number'
                     },
                     {
                         className:'principal',
                         data: function(data,a,b){
                             let cur = data.currency?data.currency:'$';
                             return [cur,data.principal].join('');
                         },
                         title: 'Principal'
                     },
                     {
                        className:'momthly_interest_rate',
                        data:function(data,a,b){
                            return [data.monthly_interest_rate,'%'].join('');
                        },
                        title: 'Monthly Rate'
                     },
                     {
                        className:'outstanding', 
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            let outstanding = parseFloat(data.principal) - parseFloat(data.principal_paid);
                            return [cur,$.isNumeric(outstanding)?outstanding.toFixed(2):0].join('');
                        },
                        title: 'outstanding'
                    },
                    // {
                    //     data: function(data,a,b){
                    //         let cur = data.currency?data.currency:'$';
                    //         return [cur,data.interest_due].join('');
                    //     },
                    //     title: 'Interest Due'
                    // },
                     {
                         data: function(data,a,b){
                             let status_class = mThis.getStatusClass(data.status_id);
                             return `<a href="javascript:void(0);" class="${status_class}">${data.status}</a>`;
                         },
                         title: 'Status'
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
             mThis.table = mThis.tblLoanList.DataTable({
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
                         "emptyTable": "No active loans found!"
                     },
                     data:data,
                     columns:my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('loanid',data.id);
                            tr.data('id',data.id);
                            tr.data('code',data.code);
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
             
             // let div = $('#_dl_d_filter_panel');  
             // $('#_dl_tblLoanList_wrapper>div.dt-buttons').prepend(div);
                      mThis.data = data;                
         }); //close post_ajax()
                  
     };

     this.process_export_data_excel = (data)=>{
        return data;
     }
     
     this.getStatusClass =(status_id)=>{
        if(status_id <=1) return 'btn btn-sm btn-outline-warning';
        else if (status_id ==2) return 'btn btn-sm btn-outline-primary';
        else if (status_id ==3)  return 'btn btn-sm btn-outline-success';
        else return 'btn btn-sm btn-outline-warning';
     }

     //displayLoanDetails in within tblLoanList (expanded View)
     this.displayLoanDetails = (loan_id,table,data)=>{
        if(!table) return;
        let p = {'loan_id':loan_id};
       let tbody = table.find('tbody');
        tbody.empty();
        post_ajax([mThis.base_url,'/api/loan/info'].join(''),p,function(d){
            if(d) {
                //display loan details here from server 
            }
           
        });
      }
 
     this.show = (option) => {
         //LoanAppListComponent.self.show().siblings().hide();
         if(!option) option={};
         mThis.options = option;
         mThis.elScreenTitle.text(option.title);
         mThis.displayLoanList();
         mThis.self.show().siblings().hide();
     }
  
  };
 //end::LoanListComponent
   
 let DiscountDialog = new function(){
     let mThis = this;
     this.self = $('#_dlgDiscountPrincipal');
     this.elAmount = $('#_dp_amount');
     this.elRemarks= $('#_dp_remarks');
     this.elTitle = $('#_dlgDiscountPrincipal_title');
     this.onClose;

     this.btnOK = $('#_dlgDiscountPrincipal_btnOK');
     this.elError = $('#_dlgDiscountPrincipal_error');

     this.btnOK.on('click',(e)=>{
         e.preventDefault();
         mThis.elError.html(null);
         let p = {
             'loan_id':mThis.loan_id,
             'amount':mThis.elAmount.val(),
             'remarks':mThis.elRemarks.val()
         }
         let err =null;
         if(!p.loan_id) err ='Loan identity is not valid';
         if(p.amount <=0 || !p.amount) err ='Discount amount is not valid';
         if(err) {
             mThis.elError.html(err);
             return;
         } 

         mThis.self.modal('hide');
         mThis.onClose(p);
     });

     this.show = (op, onClose)=>{
         mThis.elError.html(null);
         mThis.onClose = onClose;
         mThis.elTitle.html(op.title);
         mThis.loan_id = op.loan_id;

         mThis.self.modal({
             backdrop:'static'
         });
     }

 }
$(document).ready(function(){
    LoanListComponent.init();
});