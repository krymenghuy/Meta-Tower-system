'use strict'
var ReceivePaymentComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_receivePmtComponent');
    this.base_url = $('#__base_url').val();
    
    this.elPmtMethod = $('#_pmt_pmt_method');
    this.div_loan_fields = $('#_pmt_loan_fields');
    this.div_pmt_fields = $('#_pmt_input_fields');
    this.btnSave = $('#_pmt_btnSave');
    this.btnPrint = $('#_pmt_btnPrint');
    this.btnSaveAndSendEmail =$('#_pmt_btnSaveAndSendEmail');
    this.btnSaveAndSendTelegram =$('#_pmt_btnSaveAndSendTelegram');

    this.elPaymentDate = $('#_pmt_pmt_date');
    this.elInterestRate = $('#_pmt_interest_rate');
    this.elLastPmtDate = $('#_pmt_last_pmt_date');
    this.elAmount = $('#_pmt_amount');
    this.elprincipalAmt = $('#_pmt_principal_amt');
    this.elInterestAmt= $('#_pmt_interest_amt');
    this.elPenaltyFee = $('#_pmt_penalty');
    this.elMinInstallment = $('#_pmt_min_installment');
   this.elPmtType = $('#_pmt_pmt_type'); 
    this.el_os_interest_date = $('#_pmt_interest_date');

    this.btnClose = $('#_pmt_btnClose');
    this.lnkChangeInterest = $('#_pmt_lnlChangeInterest');

    this.init = ()=>{
       mThis.loadFormOptions();

       mThis.lnkChangeInterest.on('click',(e)=>{
           let op = {'loan_id':mThis.loan_id};
           InterestDialog.show(op,(p)=>{
               if(p){
                  mThis.elInterestRate.val(p.monthly_interest_rate);
                  mThis.elLastPmtDate.val(p.os_interest_date);  
                  mThis.calculatePmt();
               }
           });
       });

       mThis.elAmount.on('blur',function(e){
          mThis.calculatePmt();
       });

       mThis.elPaymentDate.on('change',function(){
        mThis.calculatePmt();
       }); 

       mThis.btnClose.on('click',(e)=>{
          e.preventDefault();
          mThis.back();
       });
 
       mThis.btnPrint.on('click',(e)=>{
          e.preventDefault();
          if(mThis.trx_id >0){
                    mThis.getReceiptData(mThis.trx_id,(d)=>{
                        if(d){
                            let op = {'copies_per_page':2};
                            PDFReceipt.show(d,op);
                        }
                       
                    });
          }else  
            mThis.savePayment(true);
          
       });

       mThis.btnSaveAndSendEmail.on('click',function(e){
           e.preventDefault();
        //    let onSuccess = function(data){
        //       mThis.mailReceipt(data.trx_id);  
        //    };

           mThis.savePayment(false,1,(res)=>{
               if(res.status =='OK') cv_interact.alert('Receipt has been sent to student by email!','','info');
           });
       });

       mThis.btnSave.on('click',(e)=>{
           e.preventDefault();
          mThis.savePayment();
       });

    }
 
    this.calculatePmt = (auto_fill_amount=false)=>{
        if((mThis.elPmtType.val() + '').toLowerCase() =='adjustment') return;
        let p = {'loan_id':mThis.loan_id,'amount':mThis.elAmount.val(), 'payment_date':mThis.elPaymentDate.val()};
       
        post_ajax(`${mThis.base_url}/api/loan/calculate-pmt`,p,(d)=>{
            if(d){
                d = StringSanitizer.sanitizeObject(d);
                if(auto_fill_amount) mThis.elAmount.val(d.minimum_installment); 
                mThis.elInterestRate.val(d.monthly_interest_rate);
                mThis.elLastPmtDate.val(d.os_interest_date);
                mThis.elprincipalAmt.val(d.principal_amount);
                mThis.elInterestAmt.val(d.interest_amount);
                mThis.elMinInstallment.val(d.minimum_installment);
                //mThis.el_os_interest_date.text(d.os_interest_date);
            }
        });
    }

    this.mailReceipt =(trx_id)=>{
      let p = {'trx_id':trx_id};
      /**
        NOTE: that  "api/email/send-receipt" will use @trx_id to get receipt data in JSON format, and post this json data to email's html page (that is "resources/views/mail.blade.php"), where there is link to download.
        Once student clicks on the Link to download then the javascript script on email's page (i.e: rcpt.js) will use the JSON data to formulate receipt PDF view. 
      **/
      post_ajax(`${mThis.base_url}/api/email/send-receipt`,p,function(res){
          if(res.status =='OK'){
              cv_interact.alert('Email has been sent!','','info');  
          }else cv_interact.alert(res.error_message,'','error');
      });
    }

    this.savePayment = (print=false,send_email=0,onSuccess=null)=>{
        let p = mThis.getData();
        if(!p){
          cv_interact.alert('Cannot save payment because the input data are not complete yet!');    
          return;
        }
        if(!p.pmt_method_id || p.pmt_method_id ==0){
            cv_interact.alert('Payment method is not correct!');    
            return;
        }
         
        //p.interest_amount =p.interest_amount|0;
        //p.principal_amount = p.principal_amount|0;
    
        let total = parseFloat(p.interest_amount) + parseFloat(p.principal_amount);
        if(Number(p.amount).toFixed(2) != total.toFixed(2) ){
            cv_interact.alert(`The amount you entered are not correct! <span style="display:block">total amount is ${p.amount} vs the calculated total is ${total}</span>`);  
            return;
        }
         
        //p.send_email=p.send_email?p.send_email:0; 
        p.send_email = (send_email || send_email==1)?1:0;    
        post_ajax(`${mThis.base_url}/api/loan/save-payment`,p,(res)=>{
            if(res.status=='OK'){
                if (print) {
                        mThis.getReceiptData(res.trx_id,(d)=>{
                            if(d){
                                let op = {'copies_per_page':2};
                                PDFReceipt.show(d,op);
                            }
                        });
                }else{
                    mThis.getReceiptData(res.trx_id,(d)=>{
                        if(d){
                            let pmt_date = StringSanitizer.sanitizeOut(d.payment_date);
                            pmt_date = (d.payment_date+'').replace(' ','_');
                            let file_name =[pmt_date,'-',d.borrower_name,'-',d.payer_code,'-',d.receipt_number].join('');
                            let op = {'copies_per_page':2,'file_name':file_name};
                            PDFReceipt.download(d,op);
                        }
                    });
                }

               if (typeof onSuccess =='function') onSuccess(res); 
               mThis.back();
            }else cv_interact.alert(res.error_message,'','error');
        });
    }

    this.displayLoanInfo = (loan_id,onFinish)=>{
        let p = {'loan_id':loan_id};
        post_ajax(`${mThis.base_url}/api/loan/info`,p,(d)=>{
           if(!d) console.error(`loan_id provided is "${loan_id}" but the loan info is NULL`); 
           mThis.elMinInstallment.val(d.minimum_installment);
           mThis.elAmount.val(d.minimum_installment);
           if (d.minimum_installment >0) mThis.elAmount.trigger('blur');
           let cur = d.currency?d.currency:'$'; 
           d = StringSanitizer.sanitizeObject(d,null,['email']);
           d.outstanding_total = parseFloat(d.interest_due) +  parseFloat(d.outstanding_principal) +  parseFloat(d.penalty_due);
           d.outstanding_total = [cur,$.isNumeric(d.outstanding_total)?d.outstanding_total:0].join('');
           d.outstanding_principal = [cur,d.outstanding_principal].join('');
           d.principal = [cur,d.principal].join('');
           d.interest_due = [cur,d.interest_due].join('');
           d.total_paid = [cur, (parseFloat(d.principal_paid) + parseFloat(d.interest_paid) + parseFloat(d.penalty_fee) -parseFloat(d.discount_amount) )].join('');
            
           if(!d.first_pmt_date) d.first_pmt_date ='NA';
            mThis.div_loan_fields.find('.loan-info-value').each(function(){
               let el = $(this);
               let f = el.data('field');
               if(f=='sex') {
                if (d[f]=='F') d[f] ='Female'; else if(d[f]=='M') d[f] ='Male';
               }else if (f=='period_months') d[f] =`${d[f]} months`;
               else if (f=='monthly_interest_rate') d[f] =`${d[f]}%`;
               el.text(d[f]); 
           });
           onFinish();
        });
    }
    
    this.getReceiptData = (trx_id,onFinish)=>{
        let p = {'trx_id':trx_id};
        post_ajax([mThis.base_url,'/api/loan/receipt-info'].join(''),p,(d)=>{
            onFinish(d);
        });  
    }

    this.getData = ()=>{
       let p = {'loan_id':mThis.loan_id,'borrower_id':mThis.borrower_id};
       let has_error = false; 
       mThis.div_pmt_fields.find('.data-input').each(function(){
           let el = $(this);
        //    if (Validator.getError(el)) {
        //        has_error = true;
        //        return false;
        //    } 
           let f = el.data('field');
           p[f] = el.val();
       });
       return p;
    }

    this.show = (op,onClose)=>{
        if(!op) op = {};
        mThis.elScreenTitle.text(op.title);
        mThis.loan_id = op.loan_id;
        mThis.borrower_id = op.borrower_id;
        mThis.onClose = onClose;
        main_view.current_view = mThis;
        main_view.current_view_option = op;

        mThis.previous_view_option = op.previous_view_option;
        mThis.previous_view = op.previous_view;
        
        mThis.div_pmt_fields.find('.data-input').each(function(){
           $(this).val(null);
        });

        mThis.elPmtMethod.val(null).trigger('change');
        mThis.elInterestRate.val(0);
        mThis.elPmtType.val('installment');
        mThis.displayLoanInfo(mThis.loan_id,()=>{
            // mThis.elAmount.val(0);
            // mThis.elPaymentDate.val(null);
            // mThis.elPmtMethod.val(null);
            // mThis.elprincipalAmt.val(0);
            // mThis.elInterestAmt.val(0);
            // mThis.elPenaltyFee.val(0);

            mThis.self.show().siblings().hide();
        })
       
    }

    this.back = ()=>{
        if(typeof mThis.onClose =='function') mThis.onClose();
        if(mThis.previous_view) mThis.previous_view.show(mThis.previous_view_option);
    }

    this.loadFormOptions = (def,onFinish)=>{
       if(!def) def={};
       post_ajax(`${mThis.base_url}/api/settings/payment-form-options`,null,(d)=>{
           CommonLib.setComboItems(mThis.elPmtMethod,d.pmt_methods,'id','pmt_method',def.pmt_method_id);
           if(typeof onFinish =='function') onFinish();
       });
    }
}

var InterestDialog = new function(){
    let mThis = this;
    this.self = $('#_loan_dlgChangeInterest');
    this.elInterestRate = $('#_loan_m_interest');
    this.elLastPmtDate = $('#_loan_last_pmt_date');
    this.elError = $('#_loan_dlgChangeInterest_error');
    this.base_url = $('#__base_url').val();

    this.btnOK = $('#_loan_dlgChangeInterest_btnSave');

    this.btnOK.on('click',(e)=>{
       e.preventDefault();
       if(!Validator.isNumber1(mThis.elInterestRate)) {
           mThis.elError.text('Invalid interest rate!');
           return;
       }
       if(!Validator.isDate1(mThis.elLastPmtDate)) {
        mThis.elError.text('Invalid interest rate!');
        return;
    }
       let p = {'loan_id':mThis.loan_id,'monthly_interest_rate':mThis.elInterestRate.val(),'os_interest_date':mThis.elLastPmtDate.val()};
       post_ajax(`${mThis.base_url}/api/loan/update-interest`,p,(res)=>{
         if(res.status =='OK'){
            if(typeof mThis.onClose =='function') mThis.onClose(p);
            mThis.self.modal('hide');
         }else cv_interact.alert(res.error_message,'','error'); 
       });
    });

    this.show = (op,onClose)=>{
       mThis.onClose = onClose; 
       mThis.loan_id = op.loan_id; 
       mThis.elError.html(null); 
       mThis.self.modal({
           backdrop:'static' 
       }); 
    }
}

$(document).ready(function(){
     ReceivePaymentComponent.init();
});