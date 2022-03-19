'use strict'
var ReportsComponent = new function() {
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_reportsComponent');
    this.elStartDate =$('#_rc_filter_startdate');
    this.elEndDate =$('#_rc_filter_enddate');
    this.elAgent;
    this.elAgenType;
    this.is_daily_report = false;
    this.btnRunReport = $('#_rc_filter_btnRunReport');

    this.init = ()=>{
        
        /** check out file pe-link.js instead for this code block **/
        // $('#go-to-pem').on('click',(e)=>{
        //     var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
        //     var iv =  CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
 
        //     var a = "D";
        //     //var hex_D = a.charCodeAt(0).toString(16);
        //     //var binary_D = a.charCodeAt(0).toString(2);
        //     let secret ="login=admin@gmail.com&pwd=123456"; 
        //     var encrypted = CryptoJS.AES.encrypt(secret, key, {iv:iv});
        //     //and the ciphertext put to base64
        //     //encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Base64);    

        //    alert(encrypted);
        //     /** On Server side **/
        //     //$encrypted = $_POST['decrypt'];
        //     //$decrypted = openssl_decrypt($encrypted, 'AES-128-CBC', $key, OPENSSL_ZERO_PADDING, iv);

        // });

        // mThis.elStartDate.on('change',function(){
        //     // if (mThis.is_daily_report) 
        //     //   mThis.elEndDate.val($(this).val()).prop('readonly',true); 
        //     // else mThis.elEndDate.prop('readOnly',false);
        // });
        
        this.btnRunReport.on('click',function(){
            let d = FilterDialog_package.getData(); 
            let params = ['rtype=rpt_daily_summary&&wid=',d.warehouse_id,'&startdate=',mThis.elStartDate.val(),'&enddate=',mThis.elEndDate.val()].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/dms_gen_report/',d].join(''),'_blank'); 
            });
        });
    }

    this.show = (option)=>{
       if (!option) option = {};
       mThis.elScreenTitle.html(option.title); 
       mThis.reportGroup = option.reportGroup; // {'General','Financials'}
       if ((mThis.reportGroup+'').toLowerCase() =='general') mThis.is_daily_report =1;
       mThis.self.show().siblings().hide();
    }
}

$(document).ready(()=>{
    ReportsComponent.init();
});
