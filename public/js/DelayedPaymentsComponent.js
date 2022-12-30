'use strict'
//begin::DelayedPaymentsComponent
var DelayedPaymentsComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_delayedPaymentsComponent');
    this.base_url = $('#__base_url').val();
 
    this.tblPmts = $('#_tblDelayedPmts');
  
    this.btnFind = $('#_dpmt__btnSearch');
    this.elSearch = $('#_dpmt__search');
 
    this.btnPrint = $('#_dpmt__btnPrint');
    this.btnPDF = $('#_dpmt__btnPDF');
    this.btnExcel = $('#_dpmt__btnExcel');
  
     this.createDropdownMenuHtml_loan =(id,status)=> {
         //cla = 'class_list_action' = > cla_delete, cla_modify,...
           let html = ['<div class="dropdown-menu" data-id="',id,'" data-status="',status,'">',
            '<a data-id="',id,'" class="dropdown-item _dpmt_edit" href="javascript:void(0)"><i class="fas fa-edit" style="margin-top:3px;"></i>Edit</a>',
           '<a data-id="',id,'" class="dropdown-item _dpmt_delete" href="javascript:void(0)"><i class="fas fa-trash" style="color:red;font-size:1em;margin-top:2px;"></i> Delete</a>',
 
        //  '<div class="dropdown-divider"></div>',
        //  '<a data-id="',loan_id,'" data-personid="',person_id,'" class="dropdown-item _dpmt_disburse" href="javascript:void(0)"><i class="fa fa-list-alt" style="color:orange"></i> Payment History</a>',
        //  '<a data-id="',loan_id,'" data-personid="',person_id,'" class="dropdown-item _dpmt_create_pmt_schedule" href="#"><i class="fa fa-list" style="color:green"></i> Write off</a>',
        //  '<a data-id="',loan_id,'" data-personid="',person_id,'" class="dropdown-item _dpmt_change_status" href="#"><i class="fa fa-tasks" style="color:grey;margin-top:3px;font-size:1.1em"></i> <span>Change Status</span</a>',
        //  '<a data-id="',loan_id,'" data-personid="',person_id,'" class="dropdown-item _dpmt_delete" href="#"><i class="fa fa-times" style="color:red;margin-top:3px;"></i> <span>Delete Loan</span</a>',
         '</div>'].join('');
          return html;
     } 
     
     this.init = () => {
 
                mThis.btnExcel.on('click',(e)=>{
                    e.preventDefault();
                    let data = mThis.process_export_data_excel(mThis.data);
                    JsonToExcel.exportToExcel(data,'finished_loans',true);
                });
                mThis.btnFind.on('click',(e)=>{
                    e.preventDefault();
                    mThis.displayDelayedPayments();
                });

                mThis.elSearch.on('keyup',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayDelayedPayments();
                    
                });

                mThis.elSearch.on('change',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayDelayedPayments();
                    
                });
    
                mThis.tblPmts.on('click','.dpmt_approve',function(e){
                    e.preventDefault();
                    let id = $(this).data('id');
                    
                });

                //  mThis.tblPmts.on('click','._dpmt_delete',function(e){
                //     e.preventDefault();
                //     let tr = $(this).closest('tr');
                //     let status_id = tr.data('statusid');
                //     let loan_id = $(this).data('id');
                //     if (AuthManager.allowed(10)) cv_interact.alert('Cannot delete because the Loan is already approved!');   
                    
                //     cv_interact.confirm('Delete this Loan?','Delete Loan',(e)=>{
                //         if(e){
                //              let p ={'loan_id':loan_id};
                //              post_ajax(`${mThis.base_url}/api/loan/delete`,p,(res)=>{
                //                if(res.status =='OK')
                //                    tr.remove();
                //                else cv_interact.alert(res.error_message,'','error');
                //              });
                //         }
                //     },'Delete',null,'delete');
                //  });
   

                 //##BEGIN:: tblPackages dropdown menu
                 mThis.tblPmts.on('click','a.btn_dpmt_action',function(e) {
                     e.preventDefault();
                     let p = $(this).parent();
                     let x = $(this);
                      
                     let loan_id = x.data('id');
                     let status_id = x.data('statusid');
                     let person_id = x.data('personid');
                     let dropdownMenu = p.find('.dropdown-menu');
                     if (!dropdownMenu || dropdownMenu.length <= 0) {
                         p.append(mThis.createDropdownMenuHtml_loan(loan_id,status_id,person_id));
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
 
                     col_action.find('a.btn_dpmt_action>i').addClass('action-button-zoomin');    
                 }).on('mouseleave','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
                     col_action.find('a.btn_dpmt_action>i').removeClass('action-button-zoomin');
                     col_action.find('div.dropdown-menu').removeClass('show');  
                 });
                 
        //##END:: tblPmts dropdown menu
                  
     }
 
     this.displayDelayedPayments = function()
     { 
         var p = {'search_value':mThis.elSearch.val()};
         post_ajax([mThis.base_url, '/api/loan/delayed-payments'].join(''),p,function(data) {  
             if(typeof data =='string') console.error(data);

             if (mThis.table){
                     mThis.tblPmts.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblPmts.empty();
                     //alert('destroyed => '+  mThis.tblPmts.html());
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
                              '<a href="#" data-id="',data.id,'" data-statusid="',data.status_id,'" data-borrowerid="',data.borrower_id,'" class="btn_dpmt_action" aria-haspopup="true" aria-expanded="false">',
                              '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                              //' Action',
                              '</a>',
                             '</div>'].join('');
                             return html;
                        
                         } 
                     },
                     {
                        data:function(data,a,b){
                            return ['<span class="loanlist-loancode">',data.code,'</span>',
                            '<div class="pmt-bttons">',
                            '<a href="#" class="floan_btn_pmt_history has-popover" data-poptext="Payment history" data-id="',data.id,'" data-borrowerid="',data.borrower_id,'"><i class="fa fa-list-alt" style="color:green;font-size:1.1em"></i></a>',
                            '&nbsp;&nbsp;<a href="#" class="floan_email has-popover" data-poptext="Payment history" data-id="',data.id,'" data-borrowerid="',data.borrower_id,'"><i class="fa fa-envelope" style="color:orange;font-size:1.2em"></i></a>',
                            '</div>'].join('');
                        },
                        title: 'Loan#'
                      },
                      {
                        data:function(data,a,b){
                            return ['<span class="loanlist-borrower-name">',data.borrower_name,'</span>',
                           '<span class="loanlist-studentcode">',data.student_code,'</span>'].join('');
                        },
                        title: 'Borrower'
                    },
                     {
                         data: 'n_id',
                         title: 'National ID'
                     },
                     {
                         data: function(data,a,b){
                             return [data.phone_number,data.phone_number?' | ':null,data.phone_number1].join('');
                         },
                         title: 'Phone Number'
                     },
                     {
                         data: 'program_name',
                         title: 'Program'
                     },
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
                            return [cur,data.discount_principal?data.discount_principal:0].join('');
                        },
                        title: 'Disc Principal'
                    },
                     {
                        data: function(data,a,b){
                            let cur = data.currency?data.currency:'$';
                            return [cur,data.interest_paid?data.interest_paid:0].join('');
                        },
                        title: 'Interest Earned'
                    },
                    //  {
                    //      data: function(data,a,b){
                    //          let status_class = mThis.getStatusClass(data.status_id);
                    //          return `<a href="javascript:void(0);" class="${status_class}">${data.status}</a>`;
                    //      },
                    //      title: 'Status'
                    //  },
                     {
                        data:'remarks',
                        title: 'Remarks'
                    },
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
                         "emptyTable": "No finished loans found!"
                     },
                     data:data,
                     columns:my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('loanid',data.id);
                            tr.data('id',data.id);
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

     //displayLoanDetails in within tblPmts (expanded View)
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
         mThis.self.show().siblings().hide();
         mThis.displayDelayedPayments();
     }
 
  };
 //end::DelayedPaymentsComponent
   
$(document).ready(function(){
    DelayedPaymentsComponent.init();
});