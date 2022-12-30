'use strict'
var DisburseLoanComponent = new function(){
  let mThis = this;
  this.self = $('#_main_disburseLoanComponent');
  this.elScreenTitle = $('#screen_title');
  this.base_url = $('#__base_url').val();

  this.btnDisburse = $('#_disburse_btnSave');
  this.btnClose = $('#_disburse_btnClose');

  this.elProgram = $('#_disburse_program');
  this.elOccupation = $('#_disburse_occupation');

  this.elLoanType = $('#_disburse_loan_type');
  this.elPayBackOption = $('#_disburse_payback_option');
  this.elPurpose = $('#_disburse_loan_purpose');

  this.lnkFindPerson = $('#_disburse_lnkFindPerson');
 
  this.borrower_data_section = $('#_disburse_borrower_fields');
  this.loan_data_section = $('#_disburse_loan_fields');

  this.loadFormOptions = (def,onFinish)=>{
    if(!def) def ={};

             post_ajax(`${mThis.base_url}/api/loan-application/form-options`,null,(d)=>{
                 if(d){
                     mThis.setFormOptions(def,d);
                     if(typeof onFinish =='function') onFinish();
                 }
             });
      }

  this.setFormOptions = (def,d)=>{
      if (!def) def = {};
      if(!d) return;
      //d.cities = StringSanitizer.sanitizeObject(d.cities);
      d.programs= StringSanitizer.sanitizeObject(d.programs);
      //d.gpa_options= StringSanitizer.sanitizeObject(d.gpa_options);
      d.occupations= StringSanitizer.sanitizeObject(d.occupations);
      d.purposes= StringSanitizer.sanitizeObject(d.purposes);

      //CommonLib.setComboItems(mThis.elCity,d.cities,'id','city_name',def.city_id);
      if(d.programs) CommonLib.setComboItems(mThis.elProgram,d.programs,'id','name',def.program_id);
      //CommonLib.setComboItems(mThis.elGPA,d.gpa_options,'gpa','gpa',def.gpa);                          
      if (d.occupations) CommonLib.setComboItems(mThis.elOccupation,d.occupations,'id','occupation',def.occupation_id);
      if(d.purposes) CommonLib.setComboItems(mThis.elPurpose,d.purposes,'id','purpose',def.purpose_id);

      if(d.loan_types) CommonLib.setComboItems(mThis.elLoanType,d.loan_types,'id','loan_type',def.loan_type_id);
      if(d.payback_options) CommonLib.setComboItems(mThis.elPayBackOption,d.payback_options,'id','payback_option',def.purpose_id);

      if(def.program_id>0) mThis.elProgram.trigger('change');
      if(def.occupation_id>0) mThis.elOccupation.trigger('change');
      if(def.purpose_id>0) mThis.elPurpose.trigger('change');
      if(def.loan_type_id>0) mThis.elLoanType.trigger('change');
      if(def.payback_option_id>0) mThis.elPayBackOption.trigger('change');
  } 

  this.setInitialData = (loan_app_id,person_id,onFinish)=>{
    let p = {'loan_app_id':loan_app_id, 'person_id':person_id};
    post_ajax(`${mThis.base_url}/api/loan/loan-info-disburse`,p,(d)=>{
      if(d){
            //alert(JSON.stringify(d.loan_data));
            let borrower_data = StringSanitizer.sanitizeObject(d.borrower_data,'',['email']);
            let loan_data = StringSanitizer.sanitizeObject(d.loan_data);
           
              //d.programs = StringSanitizer.sanitizeObject(d.programs);
              //d.occupations = StringSanitizer.sanitizeObject(d.occupations);

             //d.purposes = StringSanitizer.sanitizeObject(d.purposes);
             //d.payback_options = StringSanitizer.sanitizeObject(d.payback_options);
             //d.loan_types = StringSanitizer.sanitizeObject(d.loan_types);

             //mThis.setFormOptions(null,d);
 
            mThis.borrower_data_section.find('.data-input').each(function(){
              let el = $(this);
              let f = el.data('field');
              el.val(borrower_data[f]?borrower_data[f]:null).prop('readOnly',true); 
            });
            mThis.elOccupation.prop('disabled',true).val(borrower_data.occupation_id).trigger('change');
            mThis.elProgram.prop('disabled',true).val(borrower_data.program_id).trigger('change');

            //display Loan details (initial loan details)
            mThis.loan_data_section.find('.data-input').each(function(){
                let el = $(this);
                let f = el.data('field');
                 //readOnly for loan fields
                let readOnly = (el.data('readonly')==1);
                el.val(loan_data[f]?loan_data[f]:null).prop('readOnly',readOnly); 
            });
            
            let readOnly = (mThis.elLoanType.data('readonly')==1);
            mThis.elLoanType.prop('disabled',readOnly).val(loan_data.loan_type_id).trigger('change');

            readOnly = (mThis.elPayBackOption.data('readonly')==1);
            mThis.elPayBackOption.prop('disabled',readOnly).val(loan_data.payback_method_id).trigger('change');

            readOnly = (mThis.elPurpose.data('readonly')==1);
            mThis.elPurpose.prop('disabled',readOnly).val(loan_data.purpose_id).trigger('change');

            //NOTE: loan_data.id is "loan_app_id"
            mThis.loan_app_id = loan_data.id; 
             //NOTE: borrower_data.id is "person_id"
            mThis.person_id = borrower_data.id; 
            onFinish();
            
      }

    });

  }

  // this.displayBorrowerInfo = (n_id)=>{
  //     p = {'nid':n_id};
  //     post_ajax(`${mThis.base_url}/api/loan-application/person-info`,p,(d)=>{
  //         if(d)
  //         {
  //           let div = $('#_disburse_borrower_fields');
  //           let personal_data = StringSanitizer.sanitizeObject(d.personal_data,null,['email']);
  //           let academic_data = StringSanitizer.sanitizeObject(d.academic_data,null);
  //           div.find('.data-input').each(function(){
  //             let el = $(this);
  //             let f = el.data('field');
  //             el.val(personal_data[f]?personal_data[f]:null); 
  //           });

  //           mThis.elProgram.val(academic_data.program_id).trigger('change');
  //         } 
  //     });
  // }

  this.init = ()=>{
    mThis.loadFormOptions();

     mThis.btnClose.on('click',(e)=>{
         e.preventDefault();
         mThis.back();
     });
  
     mThis.lnkFindPerson.on('click',(e)=>{
        e.preventDefault();
        let op = {'title':'Find Person','role':'all','singleSelect':true};
        FindPersonDialog.show(op,(ps)=>{
          
        });
     });

     mThis.btnDisburse.on('click',(e)=>{
        e.preventDefault();
        let p = mThis.getLoanData();
        post_ajax(`${mThis.base_url}/api/loan/disburse`,p,(result)=>{
            if(result.status =='OK'){
              mThis.back_to_ApplicationList();
            }else cv_interact.alert(result.error_message,'','error');
          
        });
     });

  }
 
  this.getLoanData = ()=>{
    let p = {};
    mThis.loan_data_section.find('.data-input').each(function(){
      let el = $(this);
      let f = el.data('field');
      p[f] = el.val();
      if(f=='item_full_price' || f =='price_loan_percentage'){
        if(!p.extended_details)  p.extended_details ={};
        p.extended_details[f] = el.val(); 
      }  
    });
    p.loan_app_id = mThis.loan_app_id;
    p.person_id = mThis.person_id;
    return p;
  }

  this.show =(op)=>{
     //if(!op) op = {};
     //alert(mThis.self.parent().attr('id'));
     mThis.setInitialData(op.loan_app_id,op.person_id,(d)=>{
        mThis.previous_view = op.previous_view;
        mThis.previous_view_option = op.previous_view_option;
        //alert(op.previous_view.self.parent().attr('id'));
        mThis.self.siblings().hide();
        mThis.self.show();
        mThis.elScreenTitle.html(op.title);
     });
  }

  this.back = ()=>{
      if(mThis.previous_view) mThis.previous_view.show(mThis.previous_view_option);
  }

  this.back_to_ApplicationList = ()=>{
     let op = {'title':'Loan Applications'};
     LoanAppListComponent.show(op);
  }

  this.setData =(d)=>{

  }

  this.getData = ()=>{

  }
 
}

window.addEventListener('load',()=>{
    DisburseLoanComponent.init();
});


