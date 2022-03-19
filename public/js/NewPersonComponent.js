'use strict'
var NewPersonComponent = new function() {
    let mThis = this;
    this.self = $('#_main_newPersonComponent');
    this.elScreenTitle = $('#screen_title');
 
    this.init = ()=>{
       
    }
    
    this.show = (option)=>{
        if (!option) option = {};
        mThis.elScreenTitle.html(option.title);
        //mThis.displaySummaries();
        mThis.self.show().siblings().hide();
    }

    this.hide = ()=>{
        mThis.self.hide();
    }

    //User choose Filter data (Date, Merchant Name or Driver Name) => then display summarized data daily
    this.displaySummaries = function()
    { 
        let p = {};
        p.date = mThis.elFilter_date.val();
        p.agent_type = mThis.elFilter_agent_type.val(); //{merchant,driver}
        p.agent_id = mThis.elFilter_agent.val();
         
        post_ajax([mThis.base_url, '/api/rpt/rpt_getSummaryData'].join(''),p,function(data) {  
            if(typeof data =='string') alert(data);
            
            if (mThis.table){
                 
                    mThis.tblSummaries.DataTable().clear().destroy();
                    //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                    mThis.tblSummaries.empty();
                    //alert('destroyed => '+  mThis.tblSummaries.html());
                    mThis.table = null;
                
            }
              
            data = StringSanitizer.sanitizeObject(data);
            
            //begin::Set up columns
                // let cnt = 1;
                let my_columns= [];
                if(p.agent_type =='merchant') {
                    my_columns = [
                        {
                            data:"delivery_date",
                            title:'Delivery Date'
                        },
                        {
                            data:"package_count",
                            title:'Total packages'
                        },
                        {
                            data:"delivered_count",
                            title:'Delivered#'
                        },
                        {
                            data:"failed_count",
                            title:'Failed#'
                        },
                        {
                            data:"returned_count",
                            title:'Returned#'
                        },
                        {
                            data:"total_delivery_fee",
                            title:'Delivery Fee'
                        },
                        {
                            data:"total_cod",
                            title:'COD'
                        }   
                    ];

                }else if (p.agent_type=='driver') {
                    my_columns = [
                        {
                            data:"delivery_date",
                            title:'Delivery Date'
                        },
                        {
                            data:"package_count",
                            title:'Packages Assigned'
                        },
                        {
                            data:"delivered_count",
                            title:'Packages Delivered'
                        },
                        {
                            data:"failed_count",
                            title:'Failed#'
                        },
                        {
                            data:"returned_count",
                            title:'Returned#'
                        },
                        {
                            data:"total_delivery_fee",
                            title:'Delivery Fee'
                        },
                        {
                            data:"total_cod",
                            title:'COD'
                        }   
                    ];

                } else {

                }
                  
            if (!mThis.table)
            mThis.table = mThis.tblSummaries.DataTable({
                searching:false,
                destroy:true,
                paging:true,
                dom: 'Bfrtip',
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
                        "emptyTable": "No data found"
                    },
                    data:data,
                    columns:my_columns 
                // ,"createdRow": function(row, data, dataIndex)
                // {
                //           $(this).data('driverid',data.id); //driver_id
                //           $(this).data('statuscode',data.status_code); //status_code
                         
                //  }

                //    ,"cellCreated":function(td,data,colIndex) {
                //        alert('test');
                //      if(colIndex==9){
                //         let html = ['<div><a href="#" data-ceid="',data[0], '" data-studentid ="',data[2],'" data-classid="',data[1],'" class="scl_gl_delete_ceid"><i class="fa fa-trash" style="color:red"></i></a></div>'].join('');
                //         $(td).html(html); 
                //      }
                //   }      								
            });
           				  
        }); //close post_ajax()
                 
    };

}

$(document).ready(function(){
    BillingComponent.init();
});

