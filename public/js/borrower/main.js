'use strict'
var main = new function(){
   let mThis = this;
   this.btnPayments = $('#_bor_btnPayments');
   this.btnLoanInfo = $('#_bor_btnLoanInfo'); 
   this.btnProfile = $('#_bor_btnProfile');
  
   this.btnLogOut = $('#_bor_btnLogout');

   this.deleteAllCookies = () => {
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
   }

   //begin::main.init()
    this.init = ()=>{
        mThis.btnLogOut.on('click',(e)=>{
            let base_url = $('#__base_url').val();
            //let cookie_name ='pem_session';
            //CommonLib.deleteCookie(cookie_name);
    
            // var d = new Date;
            // d.setTime(d.getTime() + 24*60*60*1000*days);
            // let name="pem_session";
            // document.cookie = name + "=;path=/;expires=" + d.toGMTString();
           mThis.deleteAllCookies();   
           //window.location = [base_url,'/logout'].join('');
           window.location.replace([base_url,'/logout-borrower'].join(''));
        });

        mThis.btnPayments.on('click',(e)=>{
            let op = {'title':'Student Grant Loan Payments'};
            PaymentListComponent.show(op);
        });

        mThis.btnLoanInfo.on('click',(e)=>{
            let op = {'title':'Active Loan Information'};
            LoanInfoComponent.show(op);
        });

        mThis.btnProfile.on('click',(e)=>{
            let op = {'title':'Personal Profile'};
            ProfileComponent.show(op);
        });
 

        $.fn.modal.Constructor.prototype._enforceFocus = function() { return;};
        //Convert normal Select box to Select2. css class "modal-select2" for Select box on modal dialog only,
         $(document).find('select.select2').select2({
           width:'resolve'
         });
         $(document).find('select.modal-select2').select2({
           width:'100%'
         });  
         
        //Show default view => "Payment Information" 
        let op = {'title':'Student Grant Loan Payments'};
        PaymentListComponent.show(op);
    }
    //end:: main.init()

    //does the same job as htmlspecialchars() PHP
  this.escapeHtml =(str)=>
  {
       let map =
       {
           '&': '&amp;',
           '<': '&lt;',
           '>': '&gt;',
           '"': '&quot;',
           "'": '&#039;'
       };
       return str.replace(/[&<>"']/g, function(m) {return map[m];});
  }

   //decode string that is encoded by htmlspecialchars() in php
   this.decodeHtml = (str)=>
   {
       let map =
       {
           '&amp;': '&',
           '&lt;': '<',
           '&gt;': '>',
           '&quot;': '"',
           '&#039;': "'"
       };
       return (str+'').replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
   }


}

main.init();

