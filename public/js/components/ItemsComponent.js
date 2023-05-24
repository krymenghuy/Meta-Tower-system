"use strict";
let ItemsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Products';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_itemsComponent');
    this.btnNew = $('#_itm_btnNew');
    this.elSearchItem = $('#_itm_search');
    this.elFilter_category = $('#_itm_filter_category');

    // this.elFilter_department = $('#_msl_filter_service');
    this.itemView = null;
    this.tblItems = null;
    // this.form_data = {};
    this.icon_url = [VSUtil.asset_url(),'/images/icons'].join('');

    this.col_titles = {
        "No":"No",
        "Code":"Code",
        "Name":"Name",
        "Category":"Category",
        "General Name":"General Name",
        "Action":"Action"
    };
 
    this.getCurSymbol = (cur_code)=>{
        const c = ExchangeManager.currencies[cur_code];
        return c?c.symbol:'$';
    }

    this.displayProductsDetails = (detail_tr, item_id=0)=>{
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = {'id':item_id}; 
        window.vsapi.call(`${main_view.base_url}/api/inventory/item/details`,p,null,false).then((res) =>{
          let html=null;
          if (res.status_code === 200){
            if(!res.data){
                div_wrapper.html(null);
                return;
            }
            let d =res.data;
             //d.chief_complaints = d.chief_complaints?d.chief_complaints:[];
             let img= d? (d.images? d.images[0] : null):{};
             if (!img) img = {'id':'','image_url':`${mThis.icon_url}/client-girl.png`};
             // make sure, we get images array before sanitizing object to avoid url sanitization errror
             d.images = null;
            
             /***
              * $priceInfo = {
                  "retailPrices":[
                     {'price':7.5,'currency_code':'USD','uom':'box'},
                     {'price':1.2,'currency_code':'USD','uom':'bottle'},
                  ],
                 "wholesalePrices":[
                    {'price':6.5,'currency_code':'USD','uom':'box'},
                    {'price':0.8,'currency_code':'USD','uom':'bottle'},
                 ]
              }

              * $costInfo =[
                  {'price':3.5,'currency_code':'USD','uom':'box'},
                  {'price':0.3,'currency_code':'USD','uom':'bottle'},
               ]
               * accountInfo = [
                 {'account_id','account_name','label':"Income Account"},
                 {'account_id','account_name','label':"Cost Account"},
                 {'account_id','account_name','label':"Inventory Account"}
               ]
                
             **/
           
             const priceInfo = d.priceInfo? d.priceInfo:{};
             d = StringSanitizer.sanitizeObject(d);
             d.priceInfo = null;
             let retailPrices = priceInfo.retailPrices?priceInfo.retailPrices:[];
             let wholesalePrices = priceInfo.wholesalePrices?priceInfo.wholesalePrices:[];
             let costInfo = d.costInfo?d.costInfo:[];

             //For simiplity => get only the first element of the three respective arrays: retailPrices, wholesalePrices, purchaseInfo
              let retail = retailPrices[0]?retailPrices[0]:{};
              let wholesale = wholesalePrices[0]?wholesalePrices[0]:{};
              let purchase = costInfo[0]?costInfo[0]:{};
             
             let acc = d.accountInfo?d.accountInfo:{};
             //begin:: refresh display of Client name and client code
               //let tr = detail_tr.prev();
               //tr.find('.client-name').text(d.client_name);
               //tr.find('.client-code').text(d.patient_code);
             //end::refresh display of Client name and client code
             retail.cur_symbol = mThis.getCurSymbol(retail.currency_code);
             wholesale.cur_symbol = mThis.getCurSymbol(wholesale.currency_code);
             purchase.cur_symbol = mThis.getCurSymbol(purchase.currency_code);
             purchase.cost =purchase.cost>=0?purchase.cost:0;
             html =`
             <div class="container border rounded p-3 shadow" style="border-color:#F2F5F5">
             <div class="row">
               <div class="col-md-4 d-flex justify-content-center align-items-center flex-column">
                 <div class="d-flex flex-row product-photos">
                    <div class="rounded-circle bg-secondary overflow-hidden mb-3" style="width: 200px; height: 200px;">
                      <img src="${img.image_url}" data-photoid="${img.id}" alt="Product Photo Description" class="product-img img-fluid">
                    </div>
                    <a href="javascript:void(0)" class="btn-choose-product-photo" data-photoid="${img.id}" data-itemid="${d.id}"><i class="fa fa-edit"></i></a>
                 </div>
                 <h5 class="text-center mb-2">${d.name}</h5>
                 <h5 class="text-center text-muted mb-4">${retail.cur_symbol}${retail.price?retail.price:0}  (${retail.uom?retail.uom:"Unit"})</h5>
               </div>
               <div class="col-md-4">
                 <h5 class="mb-3 font-weight-bold">Product Information</h5>
                 <hr class="mb-4" style="margin-top:-10px;border-top: 2px solid #73ADCC;">
                 <div class="row mb-3">
                   <div class="col-5">
                     <p class="font-weight-bold mb-0">Product Group:</p>
                   </div>
                   <div class="col-7">
                     <p class="mb-0">${d.group_name}</p>
                   </div>
                 </div>
                 <div class="row mb-3">
                   <div class="col-5">
                     <p class="font-weight-bold mb-0">Category:</p>
                   </div>
                   <div class="col-7">
                     <p class="mb-0">${d.category}</p>
                   </div>
                 </div>
                 <div class="row mb-3">
                   <div class="col-5">
                     <p class="font-weight-bold mb-0">Retail Unit:</p>
                   </div>
                   <div class="col-7">
                     <p class="mb-0">${retail.uom?retail.uom:'Unit'}</p>
                   </div>
                 </div>

                <div class="row mb-3">
                 <div class="col-5">
                   <p class="font-weight-bold mb-0">Unit Cost:</p>
                 </div>
                 <div class="col-7">
                   <p class="mb-0">${purchase.cur_symbol}${purchase.cost} (${purchase.uom?purchase.uom:'Unit'})</p>
                 </div>
               </div>

               <div class="row mb-3">
                 <div class="col-5">
                   <p class="font-weight-bold mb-0">VAT:</p>
                 </div>
                 <div class="col-7">
                   <p class="mb-0">${d.sales_tax_rate}%</p>
                 </div>
               </div>
 
               </div>
               <div class="col-md-4">
                 <h5 class="mb-3 font-weight-bold">Account Information</h5>
                 <hr class="mb-4" style="border-top: 2px solid #73ADCC;margin-top:-10px">
                 <div class="row mb-3">
                   <div class="col-5">
                     <p class="font-weight-bold mb-0">Cost account:</p>
                   </div>
                   <div class="col-7">
                     <p class="mb-0">${acc.cost_account_name?acc.cost_account_name:"NA"}</p>
                   </div>
                 </div>
                 <div class="row mb-3">
                   <div class="col-5">
                     <p class="font-weight-bold mb-0">Income Account:</p>
                   </div>
                   <div class="col-7">
                     <p class="mb-0">${acc.revenue_account_name?acc.revenue_account_name:"NA"}</p>
                   </div>
                 </div>
                 
                 <div class="row mb-3">
                    <div class="col-5">
                    <p class="font-weight-bold mb-0">Inventory account:</p>
                    </div>
                    <div class="col-7">
                    <p class="mb-0">${acc.inventory_account_name?acc.inventory_account_name:"NA"}</p>
                    </div>
                 </div>
 
                 <div class="row mb-3">
                    <div class="col-5">
                    <p class="font-weight-bold mb-0">Tax account:</p>
                    </div>
                    <div class="col-7">
                    <p class="mb-0">${acc.tax_account_name?acc.tax_account_name:"NA"}</p>
                    </div>
                 </div>

               </div>
             </div>
            </div>  
               `;
            //  html = [`<div data-apptid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="appt-info-wrapper shadow-lg d-flex p-2" style="width:100%;">`,
                    
            //         //  `<div class="thumbnail-wrapper">
            //         //   <img src="" class="profile-thumbnail">
            //         //  </div>`,
            //          `<div class="rounded-circle bg-secondary d-flex justify-content-center align-items-center" style="width: 200px; height: 200px;">
            //             <img src="${mThis.icon_url}/client-girl.png" alt="Product Photo" style="max-width: 100%; max-height: 100%;">
            //          </div>`,

            //         `<div class="d-flex" style="width:100%">
            //                 <div style="width:50%" class="p-2">
            //                     <h2>Product Name</h2>
            //                     <ul class="list-group list-group-flush">
            //                         <li class="list-group-item"><strong>Product Group:</strong> Electronics</li>
            //                         <li class="list-group-item"><strong>Category:</strong> Computers & Accessories</li>
            //                         <li class="list-group-item"><strong>SKU:</strong> PROD123</li>
            //                         <li class="list-group-item"><strong>Selling Price:</strong> $999.99</li>
            //                         <li class="list-group-item"><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            //                     </ul>
            //                 </div>

            //                 <div style="width:50%" class="p-2">
            //                      <h3>sdfdsfdf</h3>
            //                 </div>
            //         </div> 
                
            //     </div>`].join('');
          
          }else{
            html =`<div class="expanded-row-error">${error_message}</div>`;
          }

          div_wrapper.html(html);

          div_wrapper.off('click').on('click','.btn-choose-product-photo',function(e){
            e.preventDefault();
            let lnk = $(this);
            //get product ID or Item ID
            const item_id = lnk.data('itemid');
            FileChooser.chooseFile(null,(x)=>{
                let p = {'id':item_id,'photo_id':lnk.data('photoid'),'photo':x.dataUrl};
                vsapi.call(`${main_view.base_url}/api/inventory/item/save-photo`,p,null,false).then(res=>{
                    if(res.status_code ===200){
                        lnk.closest('.product-photos').find('img.product-img').prop('src',x.dataUrl);
                        cv_interact.success('Product image has been saved!'); 
                    }else cv_interact.error(res.error_message);
                });
                
            });
 
          });

          //div_wrapper.slideDown(500);
        });
    }

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop] || 'undefined');
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'items',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.item_columns = [
        // {
        //     title: mThis.trans_title("No"),
        //     data: (data,index,tr) => {
        //         return (index+1);
        //     }
        // },
        {
            title: mThis.trans_title("Code"),
            data:(data,a,b)=>{
                return [
                    `<span class="fw-bold d-block">`,data.code,`</span>`
                ].join('');
            }
        },
        {
            title: mThis.trans_title('Name'),
            data:(data,a,b)=>{
                return [
                    `<span class="d-block fw-bold">`,data.name,`</span>`
                ].join('');
            }
        },
        {
            title: mThis.trans_title('General Name'),
            data:(data,a,b)=>{
                return [
                    `<span class="d-block fw-bold">`,data.group_name,`</span>`,
                    `<span class="text-secondary text-right fs-6">Group code: </span><span class="text-success p-2 fs-6 fw-normal">`,data.group_code,`</span>`
                ].join('');
            }
        },
        {
            title: mThis.trans_title('Category'),
            data:"category"
        },
        {
            title:mThis.trans_title('Action'),
            data: function(item,a,b){
                return [`<div class="form-inline">`,
                `<a href="javascript:void(0)" class="btn-item-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                `<a href="javascript:void(0);" data-id="${item.id}" class="btn-item-delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                `</div>`
                ].join('');
            }
        }
    ];

    this.init = () => {
        mThis.itemView = new ListView('_itm_list_container',{
            'fetchApi':`${main_view.base_url}/api/inventory/items-paginate`,
            'columns':this.item_columns,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data,index,tr)=>{
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{
               mThis.setLanguage();
            }
        });

        //obtain and convert mThis.itemView's table into jquery object that references to that table for jquery operation such as "mThis.tblItems.on('click','.btn-modify',()=>{ .... })
        mThis.tblItems = $(mThis.itemView.getTable());

        const tbl_id = mThis.tblItems.attr('id');
        this.cfg = new ExpandableRowConfig(tbl_id,{
            'dontExpandByClickingOn':['btn-item-modify','btn-item-delete','btn-item-action'],
            //'content':`<div class="alert alert-info">Loading details</div>`,
            'onOpen':(container,detail_tr,parent_tr)=>{
                //alert(detail_tr.find('ul').html());
                let qtr = $(parent_tr);
                let appt_id = qtr.data('id');
                mThis.displayProductsDetails($(detail_tr),appt_id);
             }
        });

        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                    if(e){
                        mThis.itemView.showPage({'search_value':mThis.elSearchItem.val(),'category_id':mThis.elFilter_category.val()});
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.tblItems.on('click','a.btn-item-modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                    //do something on dialog closed
                    if(e){
                        mThis.itemView.showPage({'search_value':mThis.elSearchItem.val(),'category_id':mThis.elFilter_category.val()});
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.tblItems.on('click','a.btn-item-delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this product?`,{title:"Delete Product",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-item`,p).then(res=>{
                       if(res.status_code === 200){
                        mThis.itemView.showPage({'search_value':mThis.elSearchItem.val(),'category_id':mThis.elFilter_category.val()});
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });
 
        mThis.elSearchItem.on('keyup',(e)=>{
            mThis.itemView.showPage({'search_value':mThis.elSearchItem.val(),'category_id':mThis.elFilter_category.val()});
        });

        mThis.elFilter_category.on('change',(e)=>{
            e.preventDefault();
            //let cat_id = mThis.elFilter_category.val();
            mThis.itemView.showPage({'search_value':mThis.elSearchItem.val(),'category_id':mThis.elFilter_category.val()});
        });
    }
      
     //prepareOptions()| prepareFormOptions() for StockTrackingComponent.show()
     this.prepareOptions = (onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/inventory/settings/options-category`,null).then(res=>{
           if(res.status_code === 200){
             let cats = StringSanitizer.sanitizeObject(res.data);
             let d = {
                "categories":cats
               };  
             onFinish(d);  
           } 
          
        });
    }
 
    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        mThis.prepareOptions(d=>{
            let cats = d.categories;
            VSUtil.setComboItems(mThis.elFilter_category,cats,'id','category',true,'(All categories)',0);
            //VSUtil.setComboItems(mThis.elFilter_category,d.stock_classes,'id','stock_class',true,'(All Classes)',0);
            mThis.itemView.showPage(null,null,()=>{
                main_view.setTitle(mThis.title_prop);
                mThis.self.show().siblings().hide();
            });
        });
    }
}

let ItemDialog = new function(){
    let mThis = this;
    this.form_data = {};
    this.self = $(`#_itm_dlgProduct`);
    this.elItemCode = $('#_itm_item_code');
    this.elItemGroup = $('#_itm_item_group');
    this.elCategory = $(`#_itm_item_category`);
    this.elBrand = $(`#_itm_item_brand`);
    this.elManufacturer = $(`#_itm_item_manufacturer`);
    this.elDetailType = $(`#_itm_item_detail_type`);
    this.elUnit = $('#_itm_item_unit');
    this.detail_type_panel = $('#_itm_detail_type_panel');
    this.lnkAddGroup = $(`#_itm_lnkAddGroup`);
    this.lnkAddCategory = $(`#_itm_lnkAddCategory`);
    this.lnkAddUnit = $(`#_itm_lnkAddUnit`);
    this.lnkAddManufacturer = $(`#_itm_lnkAddManufacturer`);
    //this.div_account = document.querySelector('#_itm_account_info');
    this.elPurchaseUOM = $('#_itm_purchase_uom');
    this.elRetailUOM = $('#_itm_retail_uom');
    this.elWholesaleUOM = $('#_itm_wholesale_uom');
    this.btnSave = $('#_itm_dlgProduct_btnSave');
 
    this.uoms = {
        "bottles":"bottle",
        "bottle":"bottle",
        "pcs":"pcs",
        "pills":"pill",
        "pill":"pill",
        "boxes":"box",
        "box":"box",
        "ampul":"ampul",
        "ampuls":"ampul" 
     };
 
     //processUnit() or processUOM() converts UOM info such as "box = 10 bottles" into JSON object such as {uom:"box","sub_uom":"bottle","sub_uom_qty":10}
     //unitInfo can be  "box =10 bottles" or "bottle = 60 pills"
     this.processUnit = (unitInfo=null)=>{
        if(!unitInfo) return {};
        let parts = unitInfo.split('=');
        let unit_name = parts[0];
        //let part1 = (parts[1]?parts[1]:'').split(' ');
        let sub_unit_name ='';
        let sub_unit_qty = 0;
 
        //let i =0, c =null;
        //NOTE: make sure there must NEVER be NULL in the middle of string "unitInfo"
        let sts = (parts[1]+'').trim().split(' ');
        sub_unit_qty = sts[0];
        sub_unit_name = [sts[1],sts[2]].join('');
        if(!(sub_unit_qty>0 || sub_unit_qty <=0)) sub_unit_qty =0;
        let translated_unit_name = mThis.uoms[sub_unit_name];
 
        return {
         'error': null, //translated_unit_name?null:`Unit name ${sub_unit_name} is not allowed`,
         'uom':unit_name,
         'sub_uom':sub_unit_name,
         'sub_uom_qty':sub_unit_qty
        }
     }

    //begin:: ItemDialog.init()
    this.init = ()=>{

        this.elRetailUOM.on('change',e=>{
            const uom = mThis.elRetailUOM.val();
            mThis.elWholesaleUOM.val(uom).prop('disabled',true).trigger('change');
            mThis.elPurchaseUOM.val(uom).prop('disabled',true).trigger('change');
        });

        this.btnSave.on('click',e=>{
            e.preventDefault();
            let p = mThis.getFormData(); 
            vsapi.call(`${main_view.base_url}/api/inventory/item/save`,p,null,null,false).then(res=>{
               if(res.status_code ===200){
                  if(typeof mThis.onClose ==='function') mThis.onClose(p);
                  mThis.self.modal('hide');
               }else cv_interact.warning(res.error_message);
            });
        });

        mThis.elCategory.on('change',function(e){
            e.preventDefault();
            let p = {"category_id":$(this).val()};
            vsapi.call(`${main_view.base_url}/api/inventory/settings/options-detail-type`,p,null,false).then(res=>{
                if(res.status_code===200){
                    let items = StringSanitizer.sanitizeObject(res.data);
                   
                    if(!items[0]){
                        mThis.detail_type_panel.hide()
                    }else{
                        VSUtil.setComboItems(mThis.elDetailType,items,'id','detail_type',false,null);
                        mThis.detail_type_panel.show();
                        if(!items[1]){
                          mThis.elDetailType.val(items[0]).trigger('change');   
                        } 
                    } 
                } 
            });
        });
         
        let se = new SimpleItemEditor({
            'label':'Enter new name',
            'title':'Rename Product Group',
            //'editLinkId':'_itm_lnkEditGroup',
            //'deleteLinkId':'_itm_lnkDeleteGroup',
            'editLink':$('#_itm_lnkEditGroup'),
            'deleteLink':$('#_itm_lnkDeleteGroup'),
            'displayElement':mThis.elItemGroup, /** diaplayElement must be a Select element **/
            'defaultValue':()=>{
                return mThis.elItemGroup.find('option:selected').text();
            },
            'api_delete':{
                'data':()=>{
                    return {id:mThis.elItemGroup.val()};
                },
                'endpoint':`${main_view.base_url}/api/inventory/group/delete`
                ,'onItemDeleted':(item)=>{ 
                   mThis.refreshOptions('group',null,null);
                }
            },
            'api_save':{
                //NOTE that data or params object is defined in SimpleItemEditor as JSON object {id,name} 
                //'data':{id:mThis.elItemGroup.val(),'name':???},
                'endpoint':`${main_view.base_url}/api/inventory/group/rename`
                ,'onItemSaved':()=>{
                    mThis.refreshOptions('group',mThis.elItemGroup.val(),null);
                }
            }      
        });

        mThis.lnkAddGroup.on('click',(e)=>{
            //General name = "Product Line" or "Variance Group" or "Product Name" in which, there can be more than one variances of the product
             let op = {
                previousDialog:mThis.self,
                title:"Add General Name",
                label:`<span style="display:block">Enter new product line</span>
                <span class="text-secondary">You must enter product code, for example, D1001:Doliprane</span>`,
                allowBlankValue:false,
                manualClosing:true 
             };

             InputBox1.show(op,d=>{
                 if(d){
                    let parts = d.split(':');
                    let code = parts[0];
                    let group_name = parts[1];
                    let p = {code:code,name:group_name};
                    //if input string does not contains ":" then use the first part of string as "name" and code is to be auto-generated by backend
                    if(!p.name && p.code){
                        p.name = p.code;
                        //Make sure that p.code is empty => api will auto generate code for the item_group
                        p.code = null; 
                    }

                    //inventory/group/save
                    vsapi.call(`${main_view.base_url}/api/inventory/group/save`,p).then(res=>{
                        if(res.status_code ===200){
                            let new_id= res.data.id;
                            InputBox1.close();  
                            mThis.refreshOptions('group',new_id,null); 
                        }else cv_interact.error(res.error_message);
                    });
                 }
             });
        });

        mThis.lnkAddCategory.on('click',(e)=>{
            //General name = "Product Line" or "Variance Group" or "Product Name" in which, there can be more than one variances of the product
             let op = {
                previousDialog:mThis.self,
                title:"Add Category",
                label:`<span style="display:block">Enter new category</span>
                <span class="text-secondary">You can also add detail type by inputting like this iMac desktop:Brand New iMac</span>`,
                allowBlankValue:false,
                manualClosing:true 
             };

             InputBox1.show(op,d=>{
                 if(d){
                    let parts = d.split(':');
                    let category_name = parts[0];
                    let detail_type = parts[1];

                    if(detail_type) detail_type = detail_type.trim();   
                    let p = {name:category_name,detail_type:detail_type};
                    vsapi.call(`${main_view.base_url}/api/inventory/category/save`,p).then(res=>{
                        if(res.status_code ===200){
                            let new_id= res.data.id;
                            mThis.refreshOptions('category',new_id,null);
                            InputBox1.close();    
                        }else cv_interact.error(res.error_message);
                    });
                 }
             });
        });

        //Add New SKU
        mThis.lnkAddUnit.on('click',(e)=>{
            //example input is "box=10 bottles"
           let op = {
                previousDialog:mThis.self,
                title:"Add Unit (UOM)",
                label:`<span style="display:block">Enter new SKU</span>
                <span class="text-secondary">Example:box =10 bottles</span>`,
                allowBlankValue:false,
                manualClosing:true, //wait until we call "InputBox1.close()"
             };

             InputBox1.show(op,d=>{
                 if(d){
                    //mThis.processUnit(string) => processes the given string such as "box= 10 bottles" into JSON object such as {name:box,sub_unit_name:bottles,sub_unit_qty:10}
                    let unit = mThis.processUnit(d);
                    if(unit.error){
                        cv_interact.warning(unit.error);
                        return;
                    }
                    //let p = {name:unit.name,sub_unit_name:unit.sub_unit_name,sub_unit_qty:unit.sub_unit_qty,'item_class':'MI'};
                    let p = {"uom":unit.uom,"item_class":'MI'};
                    vsapi.call(`${main_view.base_url}/api/inventory/settings/uom/save`,p).then(res=>{
                        if(res.status_code ===200){
                            let new_id= res.data.id;
                            InputBox1.close(); 
                            mThis.refreshOptions('uom',new_id,null); 
                        }else cv_interact.error(res.error_message);
                    });
                 }
             });
        });


        //Add New manufacturer
         mThis.lnkAddManufacturer.on('click',(e)=>{
                    //example input is "box=10 bottles"
                   let op = {
                        previousDialog:mThis.self,
                        title:"Add Manufacturer",
                        label:`<span style="display:block">Enter new manufacturer</span>`,
                        allowBlankValue:false,
                        manualClosing:true, //wait until we call "InputBox1.close()"
                     };
    
                     InputBox1.show(op,d=>{
                         if(d){
                             
                            let p = {'name':d};
                            vsapi.call(`${main_view.base_url}/api/inventory/settings/manufacturer/save`,p).then(res=>{
                                if(res.status_code ===200){
                                    let new_id= res.data.id;
                                    mThis.refreshOptions('manufacturer',new_id,null);
                                    InputBox1.close();  
                                }else cv_interact.error(res.error_message);
                            });
                         }
                     });
                });

    }
    //end:: ItemDialog.init()
    
    mThis.init();

    //ItemDialog.getFormData()
    this.getFormData = ()=>{
        let p = {'id':mThis.item_id?mThis.item_id:mThis.id}; 
        mThis.self.find('.data-input').each(function(){
            const el = $(this);
            let f = el.data('field');
            /**
             " let cat = el.data('category') " is to get additional prop of the "p" object. such as =>  p.retail_price_info = {"price":150,"uom":"box","currency_code":"USD"}
             * **/
            let cat = el.data('category');
            if(cat){
              if(!p[cat]) p[cat]={};  
              p[cat][f]= el.val();
            }
            if(el.is('img')){
              p[f] = el.prop('src');
            } else p[f] = el.val();  
       });
       return p;
    }

    this.loadFormOptions = (item_id,onFinish)=>{
       vsapi.call(`${main_view.base_url}/api/inventory/item/form-options`,{'item_id':item_id},null,false).then(res=>{
          if(res.status_code ===200){
             let d = res.data;
             //d = {'units':[],'item'};
             // "unit" = [{uom,....}]
             //"item" is item details if the item_id > 0
             VSUtil.setComboItems(mThis.elPurchaseUOM,d.units,'uom','uom',true,'(Selec UOM)',null);
             VSUtil.setComboItems(mThis.elRetailUOM,d.units,'uom','uom',true,'(Selec UOM)',null);
             VSUtil.setComboItems(mThis.elWholesaleUOM,d.units,'uom','uom',true,'(Selec UOM)',null);

             VSUtil.setComboItems(mThis.elItemGroup,d.groups,'id','group_name',true,'(Select Group)',null);
             VSUtil.setComboItems(mThis.elCategory,d.categories,'id','category',true,'(Selec Category)',null);
             VSUtil.setComboItems(mThis.elManufacturer,d.manufacturers,'id','manufacturer',true,'(Selec Producer)',null);
             VSUtil.setComboItems(mThis.elBrand,d.brands,'id','brand_name',true,'(Selec Brand)',null);
             onFinish(d);
          }
       });    
    }

    this.renderAccountInfo=(d=null)=>{
        return null; 
        // if(!d) d = [
        //     {
        //       "field": "revenue_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "revenue account"
        //     },
        //     {
        //       "field": "cogs_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "COGS account"
        //     },
        //     {
        //       "field": "inventory_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "inventory account"
        //     },
        //     {
        //       "field": "receivable_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "receivable account"
        //     },
        //     {
        //       "field": "tax_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "tax account"
        //     },
        //     {
        //       "field": "freight_expense_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "freight expense account"
        //     },
        //     {
        //       "field": "puchase_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "puchase account"
        //     },
        //     {
        //       "field": "payable_account_id",
        //       "account_id": null,
        //       "account_name": "មិនទាន់កំណត់",
        //       "label": "payable account"
        //     }
        //   ];

        // this.div_account.innerHTML ='';
        // let html = '';
        // (d || []).map(a=>{
        //   html = [html, `<div class="forn-group col-lg-3">
        //   <span class="simple-label"><span class="trans-text" data-langprop="item.${a.label}"></span> 
        //     <div><select class="modal-select2 data-input" data-field="${a.field}" data-ffield="${a.label}"></select></div>
        //   </div>`].join('');
        // });
        // mThis.div_account.innerHTML = html;
    }
    
    //setData() on ItemDialog or Product Dialog
    this.setData = (d)=>{
        mThis.renderAccountInfo(d.accountInfo);
        const priceInfo = d.priceInfo || [];

        let retail = {};
        if(priceInfo.retailPrices) retail = priceInfo.retailPrices[0]?priceInfo.retailPrices[0]:{};

        let wholesale = {};
        if(priceInfo.wholesalePrices) wholesale = priceInfo.wholesalePrices[0]?priceInfo.wholesalePrices[0]:{};
        let costInfo_first = {};
        if (d.costInfo) costInfo_first = d.costInfo[0]?d.costInfo[0]:{};
        //let accountInfo = d.accountInfo;

        mThis.self.find('.data-input').each(function(){
             const el = $(this);
             let f = el.data('field');
             let cat = el.data('category');
             if(!cat){
                if(el.is('img')){
                    el.prop('src',d[f]);
                 } else el.val(d[f]);
             }else{
                if (cat =='retail_price_info') el.val(retail[f]); 
                else if (cat =='wholesale_price_info') el.val(wholesale[f]);
                else if (cat.toLowerCase()==='costinfo' || cat.toLowerCase()==='cost_info') el.val(costInfo_first[f]);
             }
          
        });
        //display Price info
          
        //display Cost info
    }

    this.refreshOptions = (field_name,def_value=0,onFinish=null)=>{
        let method_name ='';
        let el = null;
        let text_field ='';
        //data_prop is property name of mThis.form_data such as mThis.form_data[data_prop] => example mThis.form_data.categories that is used to remmember categories options
        let data_prop ='';
        let els = [];
         switch(field_name){
                    case 'group':
                    {
                        el = mThis.elItemGroup;
                        text_field ='group_name';
                        data_prop ='groups';
                        method_name = 'api/inventory/settings/options-group';
                        break;
                    }
                    case 'category':{

                        el = mThis.elCategory;
                        text_field ='category';
                        data_prop ='categories';
                        method_name = 'api/inventory/settings/options-category';
                        break;
                    }
                    case 'uom':{

                        els  = [mThis.elRetailUOM, mThis.elWholesaleUOM, mThis.elPurchaseUOM];
                        text_field ='uom';
                        data_prop ='units';
                        method_name = 'api/inventory/settings/options-uom';
                        break;
                    }    
                
                case 'manufacturer':{
                    el = mThis.elManufacturer;
                    text_field ='manufacturer'
                    data_prop ='manufacturers';
                    method_name = 'api/inventory/settings/options-manufacturer';
                    break;
                }
                case 'brand':{
                    el = mThis.elManufacturer;
                    text_field ='brand_name'
                    data_prop ='brands';
                    method_name = 'api/inventory/settings/options-brand';
                    break;
                }
                default:{
                    method_name = 'api/settings/unknown???';
                    data_prop ='unknown';
                    break;
                }
        }

         vsapi.call(`${main_view.base_url}/${method_name}`,null).then(res=>{
            if(res.status_code===200){
                let items = StringSanitizer.sanitizeObject(res.data);
                mThis.form_data[data_prop] = items;
                if(els[0]){
                   els.map(el=>{
                       def_value = el.val();
                       VSUtil.setComboItems(el,items,'uom',text_field,false,null,null);
                       if(def_value) el.val(def_value).trigger('change');
                   });
                }
                else{
                    VSUtil.setComboItems(el,items,'id',text_field,false,null,null);
                    if(def_value) el.val(def_value).trigger('change');
                }
              
                if(typeof onFinish === 'function') onFinish();
            }
         });

    } 

    this.show = (options=null)=>{
      options = options?options:{};
      mThis.onClose = options.onClose;
      mThis.item_id = options.id;
      mThis.loadFormOptions(options.id,(data)=>{
        let item = data.item?data.item:{};
        this.setData(item);
        this.self.modal({
            'backdrop':"static"
          });
      })
      
    }
}
 
window.addEventListener('DOMContentLoaded',e=>{
    ItemsComponent.init();
});