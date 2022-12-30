'use strict'
//begin::BorrowerListComponent
var BorrowerListComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_borrowerListComponent');
    this.base_url = $('#__base_url').val();
 
    this.elFilter_loan = $('#_bor_loan_item');
    this.tblBorrowers = $('#_tblBorrowers');
  
    this.btnCreateLogins = $('#_bor_btn_create_logins');
    this.btnFind = $('#_bor_btnSearch');
    this.elSearch = $('#_bor_search');

    this.btnPrint = $('#_bor_btnPrint');
    this.btnPDF = $('#_bor_btnPDF');
    this.btnExcel = $('#_bor_btnExcel');
  
    this.createLogin_quick =(d)=>{
        let p = {};
        p.role_id =3; /* 3 = Student role */
        p.login_name = d.login_name
        p.user_class = d.user_class;
        //use login name as Official code. because login name is email or phone number
        p.official_code = d.login_name;
        p.official_id = d.official_id;
        p.full_name = d.login_name;

        //Password and confirm Password are required for New User only
        p.password = d.password;
        //p.confirmPwd = mThis.elConfirmPwd.val();

        //optional fields
         p.phone_number = d.phone_number;
         p.email = d.email; 
         p.work_location_id = null;
        if(!p.user_id) p.user_id = 0;
        // if (mThis.elPassword.val() != mThis.elConfirmPwd.val()) {

        //     mThis.elError.html("The password and confirmed password do not match!");
        //     return;
        // }

        if (!p.login_name) {
            cv_interact.alert('User Name cannot be empty','','error');
            return;
        }
     
        if(p.user_class !='admin'){
            if(!p.official_code || p.official_code =='')
            {
                cv_interact.alert('User other than Admin, must have a valid Official ID');
                return;
            }
        }
 
        post_ajax([mThis.base_url,'/api/saveUser'].join(''),p,function(result) { 
            if (result.status =='OK'){
                cv_interact.alert('Login name has been created!');
            } else cv_interact.alert(result.error_message,'','error');
        });

    }

     this.createDropdownMenuHtml_borrower =(borrower_id,borrower_code,email,phone_number,loan_id,status_id)=> {
         let html = ['<div class="dropdown-menu" data-borrowerid="',borrower_id,'" data-loanid="',loan_id,'" data-statusid="',status_id,'">',
         '<a  data-borrowerid="',borrower_id,'" class="dropdown-item bor_btn_person_profile" href="javascript:void(0)"><i class="fas fa-edit" style="margin-top:3px;font-size:1em;color:orange"></i>Personal Details</a>',
         //'<a   data-borrowerid="',borrower_id,'" class="dropdown-item _trx_delete" href="javascript:void(0)"><i class="fas fa-times" style="color:red;font-size:1.1em;margin-top:2px;"></i>Delete</a>',
         '<div class="dropdown-divider"></div>',
         '<a data-statusid="',status_id,'" data-trxid="',loan_id,'" data-borrowerid="',borrower_id,'" data-borrowercode="',borrower_code,'" data-email="',email,'" data-phone="',phone_number,'"  class="dropdown-item bor_btn_create_login" href="javascript:void(0)"><i class="fa fa-user-check" style="color:green;font-size:1em"></i> Create Login</a>',
         //'<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_disburse" href="javascript:void(0)"><i class="fa fa-envelope" style="color:orange"></i> Send By Email</a>',
         //'<a data-id="',trx_id,'" data-trxid="',trx_id,'" data-borrowerid="',borrower_id,'" class="dropdown-item _trx_create_pmt_schedule" href="#"><i class="fa fa-envelope" aria-hidden="true" style="color:#1BBEE7"></i>Send by Telegram</a>',
        '</div>'].join('');
        return html;
     } 
     
     this.init = () => {

                mThis.btnExcel.on('click',(e)=>{
                    e.preventDefault();
                    let data = mThis.process_export_data_excel(mThis.data);
                    JsonToExcel.exportToExcel(data,'borrowers',true);
                });

                mThis.btnFind.on('click',(e)=>{
                    e.preventDefault();
                    mThis.displayBorrowers();
                });

                mThis.elSearch.on('keyup',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayBorrowers();
                    
                });

                mThis.elSearch.on('change',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayBorrowers();
                    
                });
  
                 mThis.tblBorrowers.on('click','.bor_btn_person_profile',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    //let status_id = tr.data('statusid');
                    let person_id = $(this).data('borrowerid');
                    let op = {'title':'Person Profile','person_id':person_id,'previous_view':mThis,'previous_view_option':{'title':'Borrowers'}};
                    PersonComponent.show(op); 
                     
                 });

                 mThis.tblBorrowers.on('click','.bor_btn_create_login',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    //let person_id = $(this).data('borrowerid');
                    let borrower_code = $(this).data('borrowercode');
                    let email = $(this).data('email');
                    //let email = tr.find('td.email').text();
                    let phone_number = tr.find('td.phone_number').text();

                    let op = {'title':'Create Student Login','btnOKText':'Create','dataLabel':'Enter Login name','defaultValue':borrower_code,'blankErrorMessage':'Login name is not valid!'};
                    InputBox1.show(op,(d)=>{
                       if(d){
                          //create login name and password the same; 
                          let p = {'official_id':tr.data('borrowerid'),'login_name':d,'password':d,'email':email,'phone_number':phone_number,'user_class':'Borrower'} 
                          mThis.createLogin_quick(p);
                       }
                    }); 
                    
                 });
  
                //  mThis.tblBorrowers.on('click','._trx_print',function(e){
                //     e.preventDefault();
                //     let tr = $(this).closest('tr');
                //     let trx_id = tr.data('trxid');
                //     mThis.getReceiptData(trx_id,(d)=>{
                //         if(!d) return;
                //         let op = {'copies_per_page':1};
                //         if(!d.receipt_number) d.receipt_number ='NA';
                //         PDFReceipt.show(d,op);
                //      });
                //  });

                //  mThis.tblBorrowers.on('click','._trx_send_email',function(e){
                //     e.preventDefault();
                //     let tr = $(this).closest('tr');
                //     let status_id = tr.data('statusid');
                //     let trx_id = tr.data('id');
                //     let loan_id = tr.data('loanid');
                 
                //     let borrower_id = tr.data('borrowerid');
                //     //let op = {'title':'Receive Payment','loan_id':id,'borrower_id':borrower_id,'previous_view':mThis,'previous_view_option':mThis.options};
                //     //ReceivePaymentComponent.show(op);
                //  });


                //  mThis.tblBorrowers.on('click','._trx_send_telegram',function(e){
                //     e.preventDefault();
                //     let tr = $(this).closest('tr');
                //     let status_id = tr.data('statusid');
                //     let trx_id = tr.data('id');
                //     let loan_id = tr.data('loanid');
                 
                //     let borrower_id = tr.data('borrowerid');
                      
                  
                //  });

                mThis.btnCreateLogins.on('click',function(){
                    post_ajax(`${mThis.base_url}/api/users/create-logins`,null,function(res){
                        cv_interact.alert(`${res.success_count} where created!`);
                    });
                });

                 //##BEGIN:: tblPackages dropdown menu
                 mThis.tblBorrowers.on('click','a.btn_borrower_action',function(e) {
                     e.preventDefault();
                     let p = $(this).parent();
                     let x = $(this);
                     let tr = x.closest('tr');
                      
                     let loan_id = tr.data('loanid');
                     let status_id = tr.data('statusid');
                     let borrower_id = tr.data('borrowerid');
                     let borrower_code= tr.data('borrowercode');
                     let email = tr.find('td.email').text();
                     let phone_number = tr.find('td.phone_number').text();
                     let dropdownMenu = p.find('.dropdown-menu');
 
                     if (!dropdownMenu || dropdownMenu.length <= 0) {  
                         p.append(mThis.createDropdownMenuHtml_borrower(borrower_id,borrower_code,email,phone_number,loan_id,status_id));
                         dropdownMenu = p.find('.dropdown-menu');
                     }
                     //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                     if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');
 
                     dropdownMenu.toggleClass('show');
                     if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;
 
                 });
 
                 $(document).on('click',function(e){
                     //e.preventDefault();
                     let x = mThis.tblBorrowers.find('div.dropdown-menu'); 
                     let container =  x.parent(); 
                     //mThis.package_dropdown_menu.parent(); // div.dropdown
                     
                     if(container){
                         if (!container.is(e.target) && container.has(e.target).length === 0) {
                             //mThis.package_dropdown_menu.removeClass('show');
                             x.removeClass('show'); 
                         } 
                     }
                 });
                 
                 mThis.tblBorrowers.on('mouseover','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
 
                     col_action.find('a.btn_borrower_action>i').addClass('action-button-zoomin');    
                 }).on('mouseleave','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
                     col_action.find('a.btn_borrower_action>i').removeClass('action-button-zoomin');
                     col_action.find('div.dropdown-menu').removeClass('show');  
                 });
                 
        //##END:: tblPmts dropdown menu
                  
     }
  
     this.displayBorrowers = function()
     { 
         var p = {'search_value':mThis.elSearch.val()};
         post_ajax([mThis.base_url, '/api/loan/borrowers'].join(''),p,function(data) {  
             if(typeof data =='string') console.error(data);
             
             if (mThis.table){
                     mThis.tblBorrowers.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblBorrowers.empty();
                     //alert('destroyed => '+  mThis.tblBorrowers.html());
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
                              '<a href="#" data-id="',data.borrower_id,'" data-statusid="',data.status_id,'" class="btn_borrower_action" aria-haspopup="true" aria-expanded="false">',
                              '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                              //' Action',
                              '</a>',
                             '</div>'].join('');
                             return html;
                        
                         } 
                     },
                     {
                        className:'borrower_code', 
                        data:'borrower_code',
                        title: 'ID'
                     },
                     {
                         data:'name',
                         title: 'Borrower Name'
                     },
                     {
                        data:'sex',
                        title:'Sex'
                     },
                     {
                        className:'phone_number', 
                        data:'phone_number',
                        title:'Phone Number'
                     },
                    //  {
                    //     className:'email', 
                    //     data:'email',
                    //     title:'email'
                    //  },
                     {
                         data: function(data,a,b){
                             let cur = data.currency?data.currency:'$';
                             return [cur,data.principal].join('');
                         },
                         title: 'Principal'
                     },
                     {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            let outstanding_principle = data.principal - data.principal_paid;
                            if(isNaN(outstanding_principle)) outstanding_principle =0;
                            return [cur,outstanding_principle.toFixed(2)].join('');
                        },
                        title: 'Outstanding'
                    },

                    {
                        data:'status',
                        title:'status'

                    },
                 ];
                 //END Define colum
                  
             if (!mThis.table)
             mThis.table = mThis.tblBorrowers.DataTable({
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
                         "emptyTable": "No borrowers found!"
                     },
                     data:data,
                     columns:my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('borrowerid',data.borrower_id);
                            tr.data('borrowercode',data.borrower_code);
                            tr.data('email',data.email);
                            tr.data('loanid',data.loan_id);
                            tr.data('statusid',data.status_id);
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
 
     this.show = (option) => {
         //LoanAppListComponent.self.show().siblings().hide();
         if(!option) option={};
         mThis.options = option;
         mThis.elScreenTitle.text(option.title);
         mThis.self.show().siblings().hide();
         mThis.displayBorrowers();
     }
 
  };
 //end::BorrowerListComponent
   
$(document).ready(function(){
    BorrowerListComponent.init();
});