'use strict';
//begin:: LoanAppComponent (New Applicant / Modify Applicant)
 let LoanAppListComponent = new function(){
        let mThis = this;
        this.title_prop ='loan app list';
        this.self = $('#_main_AppListComponent');
        this.base_url = $('#__base_url').val();
        this.tblLoanApps = $('#_apl_tblLoanApps');
        this.elSearch = $('#_apl_search');
        //this.btnSave = $('#_loanapp_btnSave');
        //this.btnApprove = $('#_loanapp_btnApprove');

        this.btnNewLoanApp = $('#_apl_btnNewLoanApp');
        this.col_titles = {
              "App Code":"App Code",
              "Applicant Name":"Appliant name",
              "Sex":"Sex",
              "National ID":"National ID",
              "Phone Number":"Phone Number",
              "Loan Type":"Loan Type",
              "Amount":"Amount",
              "Interest":"Interest",
              "Loan Period":"Loan Period",
              "Collateral":"Colleral",
              "Status":"Status",
              "Action":"Action"

        };

        //Initialize langauge translation tasks (for dataTable columns headers)
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
        this.setLanguage = ()=>{
            //let d = 0;
            if (LocaleManager.lang !== mThis.lang){
                for (let prop in mThis.col_titles){
                    //if (mThis.col_titles.hasOwnProperty(prop)) {}
                     mThis.col_titles[prop] = LocaleManager.trans(prop,'dt_columns',LocaleManager.lang);
                }
                //d =1;
                mThis.lang = LocaleManager.lang;
            }
            //alert( (d==1?'translate => ':'No need translate=> ') + JSON.stringify(mThis.col_titles)); 
        }

        this.init = ()=>{
            LocaleManager.setLanguageChangeHandler((lang)=>{
                mThis.displayApplicationList();
            });
  
            mThis.elSearch.on('keyup',(e)=>{
                  mThis.displayApplicationList();
            });

            mThis.btnNewLoanApp.on('click', function (e) {
                e.preventDefault();
                //let res = cv_interact.inputBox('Enter your name','dsds','Your name','Samsethy');
                //alert(JSON.stringify(res));
                //return;
                LoanAppFormComponent.show();
            });
            
            mThis.tblLoanApps.on('click','a.btn_loanapp_action',(e)=>{
                e.preventDefault();
            });

            mThis.tblLoanApps.on('click','a.btn_loanapp_edit',function(e){
                e.preventDefault();
                let lnk = $(this);
                let op = {'loan_app_id':lnk.data('id')};
                LoanAppFormComponent.show(op);
            });

            mThis.tblLoanApps.on('click','a.btn_loanapp_delete',function(e){
                e.preventDefault();
                let lnk = $(this);
                let p = {'id':lnk.data('id')};
                cv_interact.confirm('Delete this loan application?',{"title":"Delete Loan Application","context":"delete","translate":true},(e)=>{
                    if(e){
                            post_ajax(`${mThis.base_url}/api/loanapp/delete`,p,(res)=>{
                                if(res.status_code === 200){
                                   mThis.displayApplicationList();    
                                }else cv_interact.error(res.error_message);
                            });
                    }
                });

            });
 
            // mThis.tblLoanApps.on('mouseover','tr',function(e){
            //    let btn = $(this).find('a.btn_loanapp_action');
      
            //    btn.find('i').css('color','red');
            // }).on('mouseleave','tr',function(e){
            //     let btn = $(this).find('a.btn_loanapp_action');
            //     btn.find('i').css('color','#E9E7E7');

            // });

        }
   
    this.trans_title = (title_prop='undefined')=>{
       return (mThis.col_titles[title_prop] || 'undefined');
    }

     this.displayApplicationList =(onFinish=null)=>
     { 
         //Initialize language for DataTable columns headers
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
         mThis.setLanguage();

         let p = {'search_value':mThis.elSearch.val()};
         post_ajax([mThis.base_url, '/api/loanapp/list'].join(''),p,function(result) {
             let data = [];
             if(result.status_code ===200) data = result.data;     
         
             if (mThis.table){
                     mThis.tblLoanApps.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblLoanApps.empty();
                     //alert('destroyed => '+  mThis.tblLoanApps.html());
                     mThis.table = null;
             }
             data = StringSanitizer.sanitizeObject(data);
 
             //begin::Set up columns
                 //let cnt = 1;
                 let my_columns = [
                    //  {
                    //      // data:function(data,type,meta) {
                    //      //     return cnt++;
                    //      // },
                    //      // title:'NO.'
                    //      className:'col_action',
                    //      data:function(data,row,display) {
                    //       let html =['<div class="action-menus dropdown" style="margin-top:-10px">',
                    //           '<a href="javascript:void(0)" data-id="',data.id,'" data-personid="',data.person_id,'" data-statusid="',data.status_id,'" class="btn_loanapp_action">',
                    //           '<i class="fa fa-tasks" style="color:#E9E7E7;font-size:1.1em"></i>',
                    //           //' Action',
                    //           '</a>',
                    //          '</div>'].join('');
                    //          return html;
                        
                    //      } 
                    //  },
                     {
                        data:function(data,a,b){
                            return ['<span style="display:block;padding:3px;">',data.loan_app_code,'</span>',
                            //'<a class="btn btn-sm btn-outline-primary loanapp-btn-action">Approve</a>'
                            ].join('');
                        },
                        title: mThis.trans_title('App Code')
                      },
                     {
                         data:'name',
                         title: mThis.trans_title('Applicant Name')
                     },
                     {
                         data: 'sex',
                         title: mThis.trans_title('Sex')
                     },
                     {
                         data: 'national_id',
                         title: mThis.trans_title('National ID')
                     },
                    //  {
                    //      data: 'email',
                    //      title: 'Email'
                    //  },
                     {
                         data: function(data,a,b){
                             return [data.phone_number,data.phone_number?' | ':null,data.phone_number1].join('');
                         },
                         title: mThis.trans_title('Phone Number')
                     },
                     {
                        className:'amount',
                         data: function(data,a,b){
                             let cur = data.currency?data.currency:'$';
                             return [cur,data.request_amount].join('');
                         },
                         title:mThis.trans_title('Amount')
                     },
                     {
                        className:'period_months',
                         data: function(data,a,b){
                             return [Number(data.period_months),' months'].join('');
                         },
                         title:mThis.trans_title('Loan Period')
                     },
                     {
                        className:'interest',
                         data: function(data,a,b){
                             return ['<span style="display:block">',Number(data.monthly_interest_rate),'%</span><span style="display:block;font-size:0.8em">monthly</span>'].join('');
                         },
                         title:mThis.trans_title('Interest')
                     },
                     {
                        className:'collateral',
                        data:function(data,a,b){
                        let has_collateral = data.has_collateral?'មាន':'គ្មាន';
                            return has_collateral;
                        },
                        title:mThis.trans_title('Collateral')
                     },
                     {
                         data: function(data,a,b){
                             let status_class = null; //mThis.getStatusClass(data.status_id);
                             return `<a href="javascript:void(0);" class="${status_class}">${data.status}</a>`;
                         },
                         title: mThis.trans_title('Status')
                     },
                     {
                        title:mThis.trans_title('Action'),
                        data: function(data,a,b){
                            let status_class = null; //mThis.getStatusClass(data.status_id);
                            return [`<div class="form-inline">`,
                            `<a href="#" class="btn_loanapp_print" data-id="${data.id}"><i class="fa fa-print"></i></a> &nbsp;`,
                            `<a href="#" class="btn_loanapp_edit" data-id="${data.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${data.id}" class="btn_loanapp_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                            `&nbsp;<a href="#" data-id="${data.id}" class="btn_loanapp_action"><i class="fa-solid fa-grip-vertical"></i></a>`,
                            `</div>`
                           ].join('');
                        }
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
             
             //translate column names
             //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

             if (!mThis.table)
             mThis.table = mThis.tblLoanApps.DataTable({
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
                 pageLength: 10,
                 bLengthChange:false,
                 saveState:true,
                  // rowReorder: {
                     // dataSrc: 'sequence'
                   // },
                    'processing': true,
                    'language': {
                         'loadingRecords': '&nbsp;',
                         'processing': 'Loading...',
                         "emptyTable": LocaleManager.trans('no data to display','datatable')
                     },
                     data:data,
                     columns:my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('loanappid',data.id);
                            tr.data('statusid',data.status_id);
                            tr.data('personid',data.person_id);
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
             // $('#_dl_tblLoanApps_wrapper>div.dt-buttons').prepend(div);
              if(typeof onFinish==='function') onFinish();                      
         }); //close post_ajax()
                  
     };
 
        this.show = (option=null)=>{
            //if(!option) option={};
            mThis.displayApplicationList(()=>{
                mThis.self.show().siblings().hide();
                main_view.setTitle(mThis.title_prop);
            });
        }

 }
 
$(document).ready(()=>{
    LoanAppListComponent.init();
});