'use strict'
var LoanInfoComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#_bor_loaninfo_title');
    this.self = $('#_bor_loanInfoComponent');
    this.base_url = $('#__base_url').val();

    this.init = ()=>{
       return;
    }

    this.show = (op)=>{
      if(!op) op = {};
      if(op.title) mThis.elScreenTitle.html(op.title);   
      mThis.self.show().siblings().hide();
    }
}

$(document).ready(()=>{
   LoanInfoComponent.init();
});
 