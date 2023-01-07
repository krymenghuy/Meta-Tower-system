"use strict";

let DermatologyComponent = new function(){
    let mThis = this;
    this.title_prop = 'Dermatology';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_dermatologyComponent');
    this.btnNew = $('#_dml_btnNew');
    this.elSearchItem = $('#_dml_search');
    this.tblItems = $('#_dml_tblItems');

    this.col_titles = {
        "Numero":"No.",
        "Name":"Name",
        "Description":"Description",
        "Price":"Price",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
     }

    this.setLanguage = ()=>{
        //let d = 0;
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                //if (mThis.col_titles.hasOwnProperty(prop)) {}
                 mThis.col_titles[prop] = LocaleManager.trans(prop,'service',LocaleManager.lang);
            }
            //d =1;
            mThis.lang = LocaleManager.lang;
        }
        //alert( (d==1?'translate => ':'No need translate=> ') + JSON.stringify(mThis.col_titles)); 
    }

    this.init = () => {
        mThis.tblItems.on('click','.btn_item_modify',function(e){
            let item_id = $(this).data("id");

            //todo: delete this item_id

        });
    }

    this.dermatologyList =(onFinish=null)=>
     { 
         //Initialize language for DataTable columns headers
         //setLanguage() will set correct current language in JSON object "mThis.col_titles" that is used to by function mThis.trans_title() to translate column title
         //Wise thing about "setLanguage()" is that, after its first call, it will always check if there is change in the current langauge set in  "LocaleManager.lang". Only if current language has changed => it will do translation again 
         mThis.setLanguage();
         let p = {'search_value':mThis.elSearchItem.val()};
         window.vsapi.call(`${mThis.base_url}/api/service/items`,p,'POST',null).then((result)=>{
            let data = [];
            if(result.status_code ===200) data = result.data;
            if (mThis.table){
                mThis.tblItems.DataTable().clear().destroy();
                //NOTE that ...DataTable().clear() will clear only tbody, and NOT <thead> section, so we need to ensure that the target table is cleared all, remmining only tags "<table></table>"
                mThis.tblItems.empty();
                //alert('destroyed => '+  mThis.tblItems.html());
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data,null,['display_price']);
             //begin::Set up columns
                //let cnt = 1;
                //data = [ {name: "sffdf", description:"sddfsf",price:100, cur_symbol:"$"},{}, ... ]
                let my_columns = [
                    {
                        data:(item,a,b)=>{
                            return 1;
                        },
                        title: mThis.trans_title('Numero')
                    },
                    {
                        data:(item,a,b) =>{
                            return [`<div>${item.name}</div>`].join('');
                        },
                        title: mThis.trans_title('Name')
                    },
                    {
                        title: mThis.trans_title('Description'),
                        data:"description"
                    },
                    {
                        title: mThis.trans_title('Price'),
                        data:'display_price'
                        // data:(item,a,b)=>{
                        //     return [item.cur_symbol,item.price].join('');
                        // }
                    },
                    {
                        title:mThis.trans_title('Action'),
                        data: function(item,a,b){
                            return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_item_modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn_item_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                            `</div>`
                           ].join('');
                        }
                    }
                ];
                //END Define colum

             //translate column names
             //let trans_cols = LocaleManager.trans_object_array(my_columns,['title'],'dt_columns');

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
                         "emptyTable": LocaleManager.trans('No data to display','datatable')
                     },
                     'data':data,
                     'columns':my_columns 
                     ,"createdRow": function(row, data, dataIndex)
                       {
                            let tr = $(row);
                            tr.data('id',data.id); //appt_id
                            //tr.data('personid',data.person_id);
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
              if(typeof onFinish ==='function') onFinish();      
              //mThis.cfg.open(mThis.tblItems.find(`tr:last`));                
         });     
     };

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        mThis.dermatologyList(()=>{
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
        
    }
}

$(document).ready(function() {
    DermatologyComponent.init();
});