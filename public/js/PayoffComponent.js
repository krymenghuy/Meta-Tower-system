'use strict'
var PayoffComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_payoffComponent');
    this.base_url = $('#__base_url').val();
    
    this.elPmtMethod = $('#payoff_pmt_method');
    this.div_loan_fields = $('#_payoff_loan_fields');
    this.div_pmt_fields = $('#_payoff_input_fields');
    this.btnSave = $('#_payoff_btnSave');
    this.btnSavePrint = $('#_payoff_btnPrint');
    this.btnSaveAndSendEmail =$('#_payoff_btnSaveAndSendEmail');
    this.btnSaveAndSendTelegram =$('#_payoff_btnSaveAndSendTelegram');
    this.elDiscountPercent = $('#_payoff_discount_percent');
    this.elAmount = $('#_payoff_total');
    this.elMonthlyRate = $('#_payoff_monthly_rate');
    this.elAmount_net = $('#_payoff_total_net');
    this.elPrincipal = $('#_payoff_principal_amount');
    this.elInterestAmount = $('#_payoff_interest_amount');
    this.elPaymentDate = $('#_payoff_pmt_date');
    this.elInterestRate = $('#_payoff_monthly_rate'); 

    this.btnClose = $('#_payoff_btnClose');

    this.displayPayOffData = (payment_date,onFinish)=>{
      let p = {'loan_id':mThis.loan_id,'payment_date':payment_date};
      post_ajax(`${mThis.base_url}/api/loan/payoff-data`,p,(d)=>{  
          d = StringSanitizer.sanitizeObject(d,null,[]);
          mThis.elInterestRate.val(d.monthly_interest_rate);
          mThis.elAmount.val(d.amount);
          mThis.elPrincipal.val(d.principal_amount);
          mThis.elInterestAmount.val(d.interest_amount);
          mThis.elDiscountPercent.val(d.elDiscountPercent);
          mThis.elAmount_net.val(d.net_amount);
          onFinish(d);
      });
    }

    this.init = ()=>{
       mThis.loadFormOptions();

       mThis.btnClose.on('click',(e)=>{
          e.preventDefault();
          mThis.back();
       });
 
       mThis.elPaymentDate.on('change',function(e){
          mThis.displayPayOffData($(this).val(),(d)=>{
              //do nothing
              return;
          });
       });

       mThis.elDiscountPercent.on('keyup',function(e){
          e.preventDefault();
          let total = mThis.elAmount.val();
          let disc_percent = mThis.elDiscountPercent.val();
          let outstanding_principal = mThis.elPrincipal.val();
          outstanding_principal = $.isNumeric(outstanding_principal)?outstanding_principal:0;
          disc_percent = $.isNumeric(disc_percent)?disc_percent:0;
          let net = total - outstanding_principal * disc_percent/100;
          mThis.elAmount_net.val(net.toFixed(2));
       });

       mThis.btnSaveAndSendEmail.on('click',(e)=>{
                e.preventDefault();
                if(mThis.trx_id >0){
                        mThis.getReceiptData(mThis.trx_id,(d)=>{
                            if(d){
                                let op = {'copies_per_page':2};
                                PDFReceipt.show(d,op);
                            }
                            
                        });
                }else  
                mThis.savePayment(false,1,(d)=>{
                     //Refresh loan list Combo Items on LoanCollectionComponent 
                     let loan_id = LoanCollectionComponent.elFilter_loan.val();
                     LoanCollectionComponent.loadFilters(loan_id,null,true);
                     return;
                });
       
       });

       mThis.btnSavePrint.on('click',(e)=>{
          e.preventDefault();
          if(mThis.trx_id >0){
                    mThis.getReceiptData(mThis.trx_id,(d)=>{
                        if(d){
                            let op = {'copies_per_page':2};
                            PDFReceipt.show(d,op);
                        }
                       
                    });
          }else  
            mThis.savePayment(true,null,(d)=>{
                  //Refresh loan list Combo Items on LoanCollectionComponent 
                  let loan_id = LoanCollectionComponent.elFilter_loan.val();
                  LoanCollectionComponent.loadFilters(loan_id,null,true);
            });
          
       });

       mThis.btnSave.on('click',(e)=>{
           e.preventDefault();
          mThis.savePayment(null,null,(d)=>{
                //Refresh loan list Combo Items on LoanCollectionComponent 
                let loan_id = LoanCollectionComponent.elFilter_loan.val();
                LoanCollectionComponent.loadFilters(loan_id,null,true);
          });
       });

    }

    this.savePayment = (print=false,send_email=0,onSuccess=null)=>{
        let p = mThis.getData();
        if(!p){
          cv_interact.alert('Cannot save payment because the input data are not complete yet!');    
          return;
        }
        
        //installment amount
        //p.interest_amount =p.interest_amount|0;
        //p.principal_amount = p.principal_amount|0;
        let total = parseFloat(p.interest_amount) + parseFloat(p.principal_amount);
        if(Number(p.amount).toFixed(2) != total.toFixed(2) ){
            cv_interact.alert(`The amount you entered are not correct! <span style="display:block">total amount is ${p.amount} vs the calculated total is ${total}</span>`);  
            return;
        }
        
        //p.send_email=p.send_email?p.send_email:0; 
        p.send_email = (send_email || send_email==1)?1:0;    
        post_ajax(`${mThis.base_url}/api/loan/payoff`,p,(res)=>{
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
           let cur = d.currency?d.currency:'$'; 
           d = StringSanitizer.sanitizeObject(d,null,['email']);
           d.outstanding_total = parseFloat(d.interest_due) +  parseFloat(d.outstanding_principal) +  parseFloat(d.penalty_due);
           d.outstanding_total = [cur,$.isNumeric(d.outstanding_total)?d.outstanding_total:0].join('');
           d.outstanding_principal = [cur,d.outstanding_principal].join('');
           d.principal = [cur,d.principal].join('');
           d.interest_due = [cur,d.interest_due].join('');
           d.total_paid = [cur, (parseFloat(d.principal_paid) + parseFloat(d.interest_paid) + parseFloat(d.penalty_fee))].join('');

           mThis.div_loan_fields.find('.loan-info-value').each(function(){
               let el = $(this);
               let f = el.data('field');
               if(f=='sex') {
                if (d[f]=='F') d[f] ='Female'; else if(d[f]=='M') d[f] ='Male';
               }else if (f=='period_months') d[f] =`${d[f]} months`;
               else if (f=='monthly_interest_rate') d[f] =`${d[f]}%`;
               el.text(d[f]); 
           });
           if(typeof onFinish =='function') onFinish();
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
  
        mThis.displayLoanInfo(mThis.loan_id,null);
        mThis.displayPayOffData(mThis.elPaymentDate.val(),(d)=>{
            mThis.self.show().siblings().hide();
        });
       
    }

    this.back = ()=>{
        if(typeof mThis.onClose =='function') mThis.onClose();
        mThis.previous_view_option.loan_id = mThis.loan_id; 
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

$(document).ready(function(){
     PayoffComponent.init();
});