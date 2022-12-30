'use strict'
//begin::ItemListComponent
let ItemListComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.self = $('#_main_itemListComponent');
    this.base_url = $('#__base_url').val();
 
    this.tblItems = $('#_itemlist_tblItems');
    this.btnNewItem = $('#_itemlist_btnNew');
    this.btnFind = $('#_itemlist_btnSearch');
    this.elSearch = $('#_itemlist_search');
    
    this.btnPrint = $('#_itemlist_btnPrint');
    this.btnPDF = $('#_itemlist_btnPDF');
    this.btnExcel = $('#_itemlist_btnExcel');
  
     this.createDropdownMenuHtml_item =(id,status_id,group_id)=> {
         //cla = 'class_list_action' = > cla_delete, cla_modify,...
         let html = ['<div class="dropdown-menu" data-id="',id,'" data-statusid="',status_id,'">',
         '<a data-groupid="',group_id,'" data-id="',id,'" class="dropdown-item _itemlist_receive_pmt" href="javascript:void(0)"><i class="fas fa-file-invoice-dollar" style="margin-top:3px;"></i>Sales History</a>',
         '<a data-groupid="',group_id,'" data-id="',id,'" class="dropdown-item _itemlist_payoff" href="javascript:void(0)"><i class="fas fa-file-invoice-dollar" style="margin-top:3px;"></i>Change History</a>',
         '<a data-groupid="',group_id,'" data-id="',id,'" class="dropdown-item _itemlist_person_profile" href="javascript:void(0)"><i class="fas fa-list-alt" style="color:grey;font-size:1.1em;margin-top:2px;"></i></a>',
         '<div class="dropdown-divider"></div>',
        '</div>'].join('');
         return html;
     } 
   
     this.init = () => {

         mThis.btnExcel.on('click',(e)=>{
            e.preventDefault();
            let data = mThis.process_export_data_excel(mThis.data);
            JsonToExcel.exportToExcel(data,'loans',true);
        });
                mThis.btnFind.on('click',(e)=>{
                    e.preventDefault();
                    mThis.displayItemList();
                });
 
                mThis.elSearch.on('keyup',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayItemList();
                    
                });

                mThis.elSearch.on('change',(e)=>{
                    e.preventDefault();
                    if(e.keyCode ==13) mThis.displayItemList();
                    
                });

                 mThis.btnNewItem.on('click', (e) => {
                    let op = {title:'New Item'};
                    op.previous_view = mThis;
                    op.previous_view_option = {'title':"Items"};
                    //op.loan_app_id = null;
                    ItemFormComponent.show(op);    
                 });

                 
                 mThis.tblItems.on('click','._itemlist_sales_history',function(e){
                    e.preventDefault();
                    let tr = $(this).closest('tr');
                    let id = tr.data('id');
                    let group_id = tr.data('groupid');
              
                 });
 
                 //##BEGIN:: tblPackages dropdown menu
                 mThis.tblItems.on('click','a.btn_item_action',function(e) {
                     e.preventDefault();
                     let p = $(this).parent();
                     let x = $(this);
                      
                     let id = x.data('id');
                     let status_id = x.data('statusid');
                     let group_id = x.data('groupid');
                     let dropdownMenu = p.find('.dropdown-menu');
                     if (!dropdownMenu || dropdownMenu.length <= 0) {
                         p.append(mThis.createDropdownMenuHtml_item(id,group_id,status_id));
                         dropdownMenu = p.find('.dropdown-menu');
                     }
                     //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
                     if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');
 
                     dropdownMenu.toggleClass('show');
                     if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;
 
                 });
 
                 $(document).on('click',function(e){
                     //e.preventDefault();
                     let x = mThis.tblItems.find('div.dropdown-menu'); 
                     let container =  x.parent(); 
                     //mThis.package_dropdown_menu.parent(); // div.dropdown
                     
                     if(container){
                         if (!container.is(e.target) && container.has(e.target).length === 0) {
                             //mThis.package_dropdown_menu.removeClass('show');
                             x.removeClass('show'); 
                         } 
                     }
                 });
                 
                 mThis.tblItems.on('mouseover','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
 
                     col_action.find('a.btn_item_action>i').addClass('action-button-zoomin');    
                 }).on('mouseleave','tr',function(e){
                     let x = $(this);
                     let col_action = x.find('td.col_action');
                     col_action.find('a.btn_item_action>i').removeClass('action-button-zoomin');
                     col_action.find('div.dropdown-menu').removeClass('show');  
                 });
                 
        //##END:: tblItems dropdown menu
                  
     }
 
     this.displayItemList = function()
     { 
         let p = {'search_value':mThis.elSearch.val()};
         post_ajax([mThis.base_url, '/api/item/item-list'].join(''),p,function(result) { 
             let data = []; 
             if (result.status_code ===200) data = result.data;

             if (mThis.table){
                     mThis.tblItems.DataTable().clear().destroy();
                     //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                     mThis.tblItems.empty();
                     //alert('destroyed => '+  mThis.tblItems.html());
                     mThis.table = null;
             }
             data = StringSanitizer.sanitizeObject(data);

             //begin::Set up columns
                 //let cnt = 1;
                 let my_columns = [
                     {
                         // data:function(data,type,meta) {
                         //     return cnt++;
                         // },
                         // title:'NO.'
                         className:'col_action',
                         data:function(data,row,display) {
                          let html =['<div class="dropdown">',
                              '<a href="#" data-id="',data.id,'" data-statusid="',data.status_id,'" data-groupid="',data.group_id,'" class="btn_item_action" aria-haspopup="true" aria-expanded="false">',
                              '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                              //' Action',
                              '</a>',
                             '</div>'].join('');
                             return html;
                        
                         } 
                     },
                     {
                        className:'item-name', 
                        data:'name', 
                        title: 'Description'
                      },
                     {
                        className:'item-group',
                         data:'group_name', 
                         title: 'Item Group'
                     },
                     {
                        data: 'item_type',
                        title: 'Type'
                    },
                    
                     {
                         data: function(data,a,b){
                             let status_class = mThis.getStatusClass(data.status_id);
                             return `<a href="javascript:void(0);" class="${status_class}">${data.status}</a>`;
                         },
                         title: 'Status'
                     }
                     
                 ];
                 //END Define colum
                  
             if (!mThis.table)
             mThis.table = mThis.tblItems.DataTable({
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
                         "emptyTable": "No data to display!"
                     },
                     data:data,
                     columns:my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                    {
                            let tr = $(row);
                            tr.data('id',data.id);
                            tr.data('groupid',data.group_id);
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
             // $('#_dl_tblItems_wrapper>div.dt-buttons').prepend(div);
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

     //displayItemDetails in within tblItems (expanded View)
     this.displayItemDetails = (loan_id,table,data)=>{
        if(!table) return;
        let p = {'loan_id':loan_id};
       let tbody = table.find('tbody');
        tbody.empty();
        post_ajax([mThis.base_url,'/api/item/item-details'].join(''),p,function(d){
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
         mThis.displayItemList();
         mThis.self.show().siblings().hide();
     }
  
  };
 //end::ItemListComponent
   
 let DiscountDialog = new function(){
     let mThis = this;
     this.self = $('#_dlgDiscountPrincipal');
     this.elAmount = $('#_dp_amount');
     this.elRemarks= $('#_dp_remarks');
     this.elTitle = $('#_dlgDiscountPrincipal_title');
     this.onClose;

     this.btnOK = $('#_dlgDiscountPrincipal_btnOK');
     this.elError = $('#_dlgDiscountPrincipal_error');

     this.btnOK.on('click',(e)=>{
         e.preventDefault();
         mThis.elError.html(null);
         let p = {
             'loan_id':mThis.loan_id,
             'amount':mThis.elAmount.val(),
             'remarks':mThis.elRemarks.val()
         }
         let err =null;
         if(!p.loan_id) err ='Loan identity is not valid';
         if(p.amount <=0 || !p.amount) err ='Discount amount is not valid';
         if(err) {
             mThis.elError.html(err);
             return;
         } 

         mThis.self.modal('hide');
         mThis.onClose(p);
     });

     this.show = (op, onClose)=>{
         mThis.elError.html(null);
         mThis.onClose = onClose;
         mThis.elTitle.html(op.title);
         mThis.loan_id = op.loan_id;

         mThis.self.modal({
             backdrop:'static'
         });
     }

 }

$(document).ready(function(){
    ItemListComponent.init();
});