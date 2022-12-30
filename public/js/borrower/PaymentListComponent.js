var PaymentListComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#_bor_payments_title');
    this.self = $('#_bor_paymentListComponent');
    this.base_url = $('#__base_url').val();
    this.btnLogout = $('#btnLogout');
    this.btnChangePwd = $('#btnChangePwd');
    this.btnRefresh = $('#btnRefresh');

    this.tblPmts = $('#_bor_tblPmts');
    this.elSearch = $('#_bor_search_pmt');
    this.elFilter_loan = $('#_bor_pmts_filter_loan');
    this.loanInfoFields = $('#_bor_loan_info_fields');

    this.elBorrower = $('#_bor_borrwer_name');

    this.init = ()=>{

       mThis.btnChangePwd.on('click',(e)=>{
         let op = {'title':'Change Password'};  
         ChangePwd.show(op,(e)=>{
             if(e){
                 cv_interact.alert('Password has been changed!','','success');
             }
         });
       }); 

       mThis.btnRefresh.on('click',(e)=>{
           e.preventDefault();
           mThis.displayPaymentList();
       });

      mThis.elSearch.on('keyup',function(e){
        e.preventDefault();
        mThis.displayPaymentList();
      }); 

      mThis.elFilter_loan.on('change',(e)=>{
         //let id = mThis.elFilter_loan.val();
         mThis.displayPaymentList();
      });

      mThis.tblPmts.on('click','._trx_print',function(e){
        e.preventDefault();
        let tr = $(this).closest('tr');
        let trx_id = tr.data('trxid');
        mThis.getReceiptData(trx_id,(d)=>{
            if(!d) return;
            let op = {'copies_per_page':1};
            if(!d.receipt_number) d.receipt_number ='NA';
            PDFReceipt.show(d,op);
         });
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
                let borrower_id = tr.data('borrowerid');
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

    this.createDropdownMenuHtml_pmt =(trx_id,loan_id,status_id,borrower_id)=> {
       return null;
      // let html = ['<div class="dropdown-menu" data-id="',trx_id,'" data-trxid="',trx_id,'" data-loanid="',loan_id,'" data-statusid="',status_id,'">',
      // '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_modify" href="javascript:void(0)"><i class="fas fa-edit" style="margin-top:3px;"></i> <span> Modify</span</a>',
      // '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_delete" href="javascript:void(0)"><i class="fas fa-times" style="color:red;font-size:1.1em;margin-top:2px;"></i>Delete</a>',

      // '<div class="dropdown-divider"></div>',
      // '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_print" href="javascript:void(0)"><i class="fa fa-print" style="color:green"></i> Print Receipt</a>',
      // '<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_disburse" href="javascript:void(0)"><i class="fa fa-envelope" style="color:orange"></i> Send By Email</a>',
      // //'<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_create_pmt_schedule" href="#"><i class="fa fa-envelope" aria-hidden="true" style="color:#1BBEE7"></i>Send by Telegram</a>',
      // '</div>'].join('');
      // return html;
    } 


    this.show = (op)=>{
      if(!op) op = {};
      if(op.title) mThis.elScreenTitle.html(op.title);
      mThis.loadLoanList(()=>{
          //mThis.displayPaymentList(); //use event mThis.filter_loan.trigger('change')
          let id = mThis.elFilter_loan.val();
          if(id > 0) mThis.displayLoanInfo(id);
          mThis.self.show().siblings().hide();
      });
    
    }

    this.displayLoanInfo = (id)=> {
        let i =0,c;
        if(!mThis.loans) mThis.loans =[];
        //let found = false;
        do{
            c = mThis.loans[i];
            if(!c) break;
               if(c.id == id){
                   mThis.loanInfoFields.find('.item-value').each(function(){
                       let el = $(this);
                       let f = el.data('field');
                       let dtype = el.data('disptype');
                       let cur = c.currency=='USD'?'$':'$';
                       if(dtype=='currency') el.html([cur,c[f]].join(''));
                       else if (dtype =='percent') el.html([c[f],'%'].join('')); 
                       else  el.html(c[f]);
                   });

                   mThis.elBorrower.text([c.borrower_name,' (',c.student_code,')'].join(''));
                   //found = true;
                   return;
               }
            i++;
        }while(c);
  
        mThis.loanInfoFields.find('.item-value').each(function(){
            let el = $(this);
            let f = el.data('field');
            let dtype = el.data('disptype');
            let cur ='$';
            if(dtype=='currency') el.html([cur,0].join(''));
            else if (dtype =='percent') el.html([0,'%'].join('')); 
            else  el.html('');
        });
    }

   this.loadLoanList = (onFinish)=>{
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
      if (seconds_ago <=600 &&  mThis.loans){
          def_loan_id = mThis.elFilter_loan.val();
          CommonLib.setComboItems(mThis.elFilter_loan,mThis.loans,'id','loan_name',true,'Select Loan',def_loan_id);
          if(def_loan_id>0) mThis.elFilter_loan.trigger('change');
          onFinish();
        }else {
            post_ajax([mThis.base_url, '/api/borrower/loan-list'].join(''),null,function(rows) { 
                if(!rows) rows =[];
                rows = StringSanitizer.sanitizeObject(rows,null,['currency']);
                let i=0,c;
                do{
                   c = rows[i];
                   if(!c) break;
                   let cur = c.currency=='USD'?'$':'$';
                   let status = (c.status_id ==1)?'Active': (c.status_id==2?'Finished':'');
                   c.loan_name = ['Loan: ',c.loan_code,' (',cur,c.principal,') ',status].join(''); 
                   let outstanding_principal = parseFloat(c.principal) - parseFloat(c.discount_principal) - parseFloat(c.principal_paid);  
                   c.outstanding_balance = parseFloat(outstanding_principal) + parseFloat(c.penalty_due) + parseFloat(c.interest_due);

                   i++;
                }while(c);

                let def_loan_id = rows[0]?rows[0].id:null; 
                CommonLib.setComboItems(mThis.elFilter_loan,rows,'id','loan_name',true,'Select Loan',def_loan_id);
                mThis.elFilter_loan.trigger('change');
                mThis.last_call_time = new Date();
                mThis.loans = rows;
                onFinish();
            });
      }

     

   }
    
    this.displayPaymentList = function()
     { 
         let id = mThis.elFilter_loan.val();
         let p = {'search_value':mThis.elSearch.val(), 'loan_id':id};
         mThis.displayLoanInfo(id);
         post_ajax([mThis.base_url, '/api/borrower/payment-list'].join(''),p,function(data) {  
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
                              //'<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                              `<button class="btn btn-sm btn-outline-danger" style="border-radius:50px">`,cnt,`</button>`,
                              '</a>',
                             '</div>'].join('');
                             return html;
                        
                         } 
                     },
                     {
                        data:'payment_date',
                        title: 'Payment Date'
                     },
                     {
                         data:'receipt_number',
                         title: 'Receipt#'
                     },
                     {
                      data:'issue_date',
                      title: 'Issue Date'
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
                             return [cur,data.amount].join('');
                         },
                         title: 'Amount'
                     },
                     {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            return [cur,data.principal_amount].join('');
                        },
                        title: 'Principal Pmt'
                    },
                    {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            return [cur,data.interest_amount].join('');
                        },
                        title: 'Interest Pmt'
                    },
                    {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            return [cur,data.outstanding_principal].join('');
                        },
                        title:'Outs. Principal'
                    },
                    {
                      data:function(data,a,b){
                        return [`<button class="btn btn-sm btn-outline-success _trx_print"><i class="fa fa-print"></i></button>`].join();
                      },
                      title:'Action'
                    }
                    // {
                    //     data:'create_user',
                    //     title:'Received By'
                    // }

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
                            cnt++;
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
             
             // let div = $('#_dl_d_filter_panel');  
             // $('#_dl_tblPmts_wrapper>div.dt-buttons').prepend(div);
                                    
         }); //close post_ajax()
                  
     };
     
     this.getStatusClass =(status_id)=>{
        if(status_id <=1) return 'btn btn-sm btn-outline-warning';
        else if (status_id ==2) return 'btn btn-sm btn-outline-primary';
        else if (status_id ==3)  return 'btn btn-sm btn-outline-success';
        else return 'btn btn-sm btn-outline-warning';
     }

     this.getReceiptData = (trx_id,onFinish)=>{
      let p = {'trx_id':trx_id};
      post_ajax([mThis.base_url,'/api/loan/receipt-info'].join(''),p,(d)=>{
          onFinish(d);
      });  
    }
 
}

let ChangePwd = new function(){
    let mThis = this;
    this.base_url = $('#__base_url').val();
    this.btnOK = $('#_dlgChangePwd_btnOK');
    this.elError = $('#_dlgChangePwd_error');
    this.self = $('#_dlgChangePwd');

    this.elOldPwd = $('#_cpwd_old_password');
    this.elConfirmPwd = $('#_cpwd_confirm');
    this.elPwd = $('#_cpwd_password');
   
    this.btnOK.on('click',(e)=>{
        e.preventDefault();
        mThis.elError.html(null);
          
        let p = {'login_name':mThis.login_name,'oldPwd':mThis.elOldPwd.val(),'newPwd':mThis.elPwd.val(),'confirmPwd':mThis.elConfirmPwd.val()};

        //NOTE: p.login_name is option because api/changePassword() will use the currrently logged in user identity to change password
        if(!p.newPwd) {
            mThis.elError.text('New password cannot be empty!');
            return;
        }
         
        if(p.newPwd != p.confirmPwd){
            mThis.elError.text('Password and confirmed password do not much!');
            return;
        }
 
        post_ajax(`${mThis.base_url}/api/changePassword`,p,(res)=>{
            if(res.status =='OK'){
                if(typeof mThis.onClose =='function') mThis.onClose(true);
                mThis.self.modal('hide');
            } else mThis.elError.text(res.error_message,'','error');  
        });
    });

    this.show = (op, onClose)=>{
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.login_name = op.login_name;
        if(!op.login_name) console.error('Problem: Loading Change Password Dialog, but the particular login name is not provided for Change Password operation');
        mThis.self.modal({
            backdrop:'static'
        });
    }
}

$(document).ready(()=>{
  PaymentListComponent.init();
});