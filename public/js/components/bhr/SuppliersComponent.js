'use strict';
var SuppliersComponent = new function(){
    const mThis = this;
    this.title_prop = "Suppliers";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_main_suppliersComponent');
    this.self = this.jm[0];
    this.elFilter_supplier_status = mThis.self.querySelector('#_sdl_filter_supplier_status');
    this.div_filter_fields = mThis.self.querySelector('#_sdl_filter_fields');

    this.btnNewSupplier = mThis.self.querySelector('#_sdl_btnNewSupplier');
    this.elSearch = mThis.self.querySelector('#_sdl_search_supplier');
     
    this.setSupplierPriceList = (supplier_id,tr) => {
        mThis.getPriceListItems((items)=>{
            items.unshift({
                id: null,
                name: 'Select price list'
            });
            let supplier_name = tr.dataset.suppliername;
            let pl_list_id = tr.dataset.pricelistid;

            let option = {
                title: `Set Price List for ${supplier_name? supplier_name : 'Supplier'}`,
                dataLabel: "Price list name",
                valueMember: "id",
                textMember: "name",
                //OKButtonText:"Save",
                blankErrorMessage: "Please a price list",
                data: items,
                defaultValue: pl_list_id
            };

            InputBox2.show(option,(d)=>{
                if(d) {
                    let p = {
                        supplier_id: supplier_id,
                        price_list_id: d.value
                    };
                    // console.log(p); 
                    vsapi.call(`${mThis.base_url}/abm/suppliers/set-price-list`,p,null).then(res => {
                        // console.log(res.status_code);
                        if(res.status_code === 200){
                            let d = StringSanitizer.sanitizeObject(res.data);
                            tr.querySelector('span.price_list_name').textContent = d.list_name; 
                            InputBox2.close();
                            cv_interact.success('Price list ' + d.list_name + ' has been assigned');
                            
                        }
                        else
                            cv_interact.error(res.error_message); 
                    });
                   
                }
               
            });
        });
    }

    this.cols = [
        {
            title:'',
            className:"",
            data:(data,index,tr)=>{
                return ;
            }
           
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                let html = ['<div class="dropdown">',
                    '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-name="', data.name, '" class="btn_supplier_action " aria-haspopup="true" aria-expanded="false">',
                    '<i class="fa fa-chevron-down " style="color:#08391A;font-size:1.4em"></i>',
                    '</a>',
                    '</div>'].join('');
                return html;
            }
        },
        {
            title:'Supplier ID',
            className:" align-middle",
            data:(data,index,tr)=>{
                return `<span class="">${data.code ? data.code: 'N/A'}</span>`;
            }
           
        },
        {
            className: "name align-middle",
            data: (data,index,tr)=>{
                const sender_info = ['<div class="d-flex p-1 text-capitalize" ><span class="">',(data.name || 'គ្មាន'),'</span></div>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'Supplier Name '
        },
        {
            title: "Contact Info",
            className: "align-middle ",
            data: (data,index,tr)=>{
                return ['<div class="d-flex gap-2" ><i class="fas text-success fa-envelope mt-1"></i><span class="">',(data.email || 'គ្មាន'),'</span></div>','<div class="d-flex gap-2"><i class="fas text-primary fa-phone mt-2"></i><span class="p-1 text-">',data.phone_number,'</span></div>'].join('');
            }
        },
      
        {
            className: "price_list_name align-middle ",
            data: (data,index,tr)=>{
                // console.log(data);
                let price_list_html = data.price_list_name ? `<span class="supplier-price-list">${data.price_list_name}</span>` : `គ្មាន <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="set-price-list">
                <i class="fa-solid fa-pencil text-danger"></i></a>`;
                const sender_info = ['<span class="price_list_name text-primary d-block">',price_list_html,'</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'Price List '
        },
        {
            className: "last_updated align-middle",
            data: function (data, index, tr) {
                return ['<span class="d-block">',data.create_user || "NA", '</span>','<span class=""><small>',(data.update_date || data.create_date),'</small></span>'].join('');
            },
            title: 'Last Updated'
            // title: mThis.trans('Created Date')
        },
        {
            className: 'status align-middle',
            data: function (data, index, tr) {
                const cls_class = (data.status_code || '').toLowerCase() === 'active' ? ' text-success text-center border border-success rounded-5 p-1' : ' text-danger text-center';
                const status_code = data.status_code ? VSUtil.properCase(data.status_code) : 'Inactive';
                return ['<a class="d-block" data-status="', status_code, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class=" p-1  ${cls_class} ">`, status_code, '</span></a>'].join('');
            },
            title: 'Status'
        },
        
        {
            title: "Photo",
            className: ' align-middle',
            data: (data, a, b) => {
                let image = data.image_url ? data.image_url : '';
                return [`<img class="image-supplier-tbl" src="${image}" alt=""/>`].join('');
            }
        }
        
    ];
   
    this.setPriceList = (supplier_id, lnk)=>{
        if(!AuthManager.allowed(336,false))
                return ;
        let tr = VSUtil.closestLimited(lnk,'tr');
        mThis.setSupplierPriceList(supplier_id,tr);
    }
    
    this.editSupplier = (supplier_id, lnk)=>{
        if(!AuthManager.allowed(306))
        return ;
        let op = {
            id: supplier_id,
            title : 'Modify Supplier',
            onClose:()=>{
                mThis.listView.showPage(mThis.getFilterData());
            }
        };
        SupplierDialog.show(op);  
    }

    this.deleteSupplier = (supplier_id, lnk)=>{
        if(!AuthManager.allowed(307))
        return ;
        cv_interact.confirm('Delete this supplier?',{
            title: 'Delete Supplier',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${mThis.base_url}/abm/suppliers/delete`,{
                    id: supplier_id
                },null).then(res => {
                    if(res.status_code === 200){
                        mThis.listView.showPage(mThis.getFilterData());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }

    this.changeSupplierStatus = (supplier_id, lnk)=>{
        if(!AuthManager.allowed(337,false))
                return ;
        //let status_code = Validator.properCase(lnk.dataset.status);
        let tr = lnk.closest('tr');
        let status_code = Validator.properCase(tr? tr.dataset.statuscode: "");
        let inputOptions = {
            title: 'Set Supplier Status',
            dataLabel: "Supplier status",
            valueMember: "status_code",
            textMember: "name",
            confirmButtonText:"Save",
            blankErrorMessage: "Status is not correct!",
            data: [{
                status_code: "Active",
                name: "Active"
            },
            {
                status_code: "Inactive",
                name: "Inactive"
            }],
            defaultValue: status_code
        };

        InputBox2.show(inputOptions,(d)=>{
            if(d){
                let p = {
                    id: supplier_id,
                    status_code: d.value
                };
                vsapi.call(`${mThis.base_url}/abm/suppliers/update-status`,p).then(res => {
                    if(res.status_code === 200){
                        mThis.elFilter_supplier_status.value = d.value;
                        InputBox2.close();
                        mThis.elFilter_supplier_status.dispatchEvent ( new Event('change'));
                        cv_interact.success('The supplier status has been updated');
                        if(tr) tr.dataset.statuscode = d.value;
                        mThis.listView.showPage(mThis.getFilterData());
                    }
                    else
                        cv_interact.error(res.error_message); 
                });
            }
        });
    }

    this.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_supplier_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    //text:"",
                    html:'<span class="ps-2  " vslang="titles.Set Price List">Set Price List</span>',
                    icon:`<i class="fa-regular fa-list-alt fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"set_price_list"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Supplier">Modify Supplier</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_supplier"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Customer">Delete Supplier</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_supplier"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon:`<i class="fa-regular fa-exchange fs-5"></i>`,
 
                    cssClass:"border-bottom pb-2",
                    name:"change_supplier_status"
                },  
            ],
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'set_price_list':{
                        mThis.setPriceList(id,menuLink);
                        break;
                    }
                    case 'edit_supplier':{
                      mThis.editSupplier(id, menuLink);
                      break;
                    }
                    case 'delete_supplier':{
                        mThis.deleteSupplier(id, menuLink);
                        break;
                      }
                    case 'change_supplier_status':{
                        mThis.changeSupplierStatus(id,menuLink);
                        break;
                    }  
                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    this.chooseImage = (div) => {
        div.onclick = function(e){
            e.preventDefault();
            e.stopPropagation();
            const img = VSUtil.getElementByClass(e.target,'img-sup-show');
            if(img){
                FileChooser.chooseFile(null,(d) => {
                    if(d){
                        const imgContainer = img.parentElement;
                        mThis.setImage(imgContainer,d.dataUrl);
                        vsapi.call(`${main_view.base_url}/abm/suppliers/save-profile-picture`,{
                            id: imgContainer.dataset.id,
                            photo: d.dataUrl
                        },false).then(res => {
                            if(res.status_code === 200){
                                cv_interact.success('Photo Uploaded Successfully!');
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
                return;
            }
        }
    }

    this.setImage = (div,image) => {
        if(image){
            const html = `<img class="data-get" src="${image}" alt="" data-field="photo"/>
            <div class="d-flex-hover position-absolute top-0 end-0 p-2 rounded-3 bg-dark">
                <a href="javascript:void(0)" class="img-sup-delete">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`;
            div.innerHTML = html;
            mThis.setImageDeleteEvent(div);
        }
        else{
            const html = `<div class="img-sup-show border rounded-3 h-100 w-100 d-flex align-items-center justify-content-center" role="button">
                <i class="fa-regular fa-image fs-3 text-muted"></i>
            </div>`;
            div.innerHTML = html;
            mThis.chooseImage(div);
        }
    }

    this.setImageDeleteEvent = (div) => {
        let lnk = div.querySelector('.img-sup-delete');
        if(lnk){
            lnk.onclick = (e) => {
                e.preventDefault();
                cv_interact.confirm('Delete this profile picture now?',{
                    context: 'delete',
                    title: 'Delete Photo'
                },(e) => {
                    if(e){
                        const imgContainer = lnk.closest('.div-img');
                        vsapi.call(`${main_view.base_url}/abm/suppliers/delete-profile-picture`,{
                            id: imgContainer.dataset.id
                        },false).then(res => {
                            if(res.status_code === 200){
                                const html = `<div class="img-sup-show border rounded-3 h-100 w-100 d-flex align-items-center justify-content-center" role="button">
                                    <i class="fa-regular fa-image fs-3 text-muted"></i>
                                </div>`;
                                imgContainer.innerHTML = html;
                                mThis.chooseImage(imgContainer);
                                cv_interact.info('Photo was deleted!');
                            }
                        });
                    }
                });
                return;
            }
        }
    }
 
    this.loadFilterData = (onFinish) => {
        mThis.def_filter = mThis.def_filter || {};
        mThis.def_filter.status_code = 'Active';

        //Do not allow filter to be applied yet. I means that filter SELECT's change event wont refresh the merchant list
        mThis.allow_filter = false;
        vsapi.call(`${mThis.base_url}/abm/suppliers/form-options`, null,null,main_view.apiCluster).then(res => {
            let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
            VSUtil.setComboItems(mThis.elFilter_supplier_status, d.supplier_statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
            // VSUtil.setComboItems(mThis.elFilter_business_type, d.business_types, 'business_type', 'business_type', true, '(All Business Types)', 0);
            // VSUtil.setComboItems(SupplierDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
            onFinish();
            

            mThis.allow_filter = true;
        });
    }

    this.getPriceListItems = (onFinish) => {
        vsapi.call(`${mThis.base_url}/abm/getComboItems_supplier_price_list`,null,false).then(res => {
            let items = res.status_code ===200? res.data: [];
            onFinish(items); 
        });
    }

    this.initOnce = () => {
        if(mThis.initAlready) return;

        mThis.listView = new ListView('_sdl_supplier_list', {
            fetchApi: `${main_view.base_url}/abm/suppliers/list`,
            apiCluster: main_view.apiCluster,
            tableClass: "table header-uppercase",
            perPage: 10,
            columns: mThis.cols,
            rowCreated:(data,index,tr)=>{
                
              tr.dataset.id = data.id;  
              tr.dataset.suppliername = data.name;
              tr.dataset.pricelistid = data.price_list_id;
              tr.dataset.statuscode = data.status_code;
              tr.classList.add('supplier');
              tr.setAttribute('id',['supplier_id',data.id].join('')); 
            //   tr.dataset.statusid = data.status_id;
            //   tr.dataset.senderid = data.sender_id;
            //   tr.dataset.driverid = data.driver_id?data.driver_id:''; 
            }, 
            // renderItems: (items, list_container) => {
            //     console.log(list_container);
            //     mThis.renderMerchant(list_container, items);
            // },
            listContainerClass: null
        });

        //this.container = mThis.listView.getListContainer();
          
        // mThis.tblSenders = mThis.listView.getListContainer();

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                // console.log(123,mThis.getFilterData());
                mThis.listView.showPage(mThis.getFilterData());
               
            };
        });

        this.btnNewSupplier.addEventListener('click', function(e){
            e.preventDefault();
            if(!AuthManager.allowed(305))
                return ;
            let op = {
                id: null,
                onClose: (d) =>{
                    mThis.listView.showPage(mThis.getFilterData());  
                }
            } ;
            SupplierDialog.show(op);
        });

        mThis.tblSuppliers = mThis.listView.getTable();
        mThis.initDropdownMenus(mThis.tblSuppliers);

        this.container = mThis.listView.getListContainer();
        const parent = mThis.container.parentElement;
        parent.style.height = (window.innerHeight - 190) + 'px';
        parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 190) + 'px';
        }
         
        mThis.elSearch.addEventListener('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.listView.showPage(mThis.getFilterData());
            }, 250);
        });
 
        mThis.initAlready = true;
    }
   //end:init of SuppliersComponent

    this.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            let f= el.dataset.field;
            p[f] = el.value;
        });

        return p;
    }

    this.show = (option) => {
        mThis.initOnce();
        mThis.option = option;
        main_view.setTitle(mThis.title_prop);

        mThis.loadFilterData(() => {
            mThis.listView.showPage(mThis.getFilterData(),null,()=>{
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(250);
            });
            
        });
    }

    // this.hide = () => {
    //     mThis.jm.hide();
    // }
      
};
 
const SupplierDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_sdl_dlgSupplier')[0];
    this.modal = new bootstrap.Modal(this.self);
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.querySelector('#_sdl_dlgSupplierTitle');
    this.btnSave =  this.self.querySelector('#_sdl_supplier_btnSave');
    // this.elSenderType =  this.self.find('#_sdl_sender_sendertype');
    // this.elBusinessType =  this.self.find('#_sdl_sender_businesstype');
    this.elSalesAgent =  this.self.querySelector('#_sdl_sales_agent');

    this.elPriceList =  this.self.querySelector('#_sdl_price_list');
    // this.elCOD =  this.self.find('#_sdl_cod');
    // this.elCODFee =  this.self.find('#_sdl_cod_fee');
    // console.log(mThis.divPhoto);
    this.onClose = null;
    this.elError =  this.self.querySelector('#_sdl_sender_error');

    this.body =  this.self.querySelector('.modal-body');
    this.divPhoto = this.self.querySelector('#_supplier_profile_photo');

    this.div_sender_info =  this.body.querySelector('#_sdl_supplier_body');
    // this.div_bank_account = this.body.querySelector('#div_bank_account');
    mThis.imgBox = new ImageBox(mThis.divPhoto,{
        "dataField":"photo",
        "cssClass":"data-input border",
        containerClass:null,
        // onDeleteImage:()=>{
        //   alert('Deleting image');
        //   return false;
        // },
        "onLoadImage":(photo) =>{
            let p = {"id":mThis.options.id,"supplier_id":mThis.options.id,"photo":photo};
            if(!p.id) return; 
            vsapi.call(`${main_view.base_url}/abm/suppliers/save-profile-picture`,p,null,null,false).then(res =>{
                if(res.status_code ===200){
                    mThis.imgBox.setImage(photo);
                   // cv_interact.success('Photo has been saved');
                }else cv_interact.error(res.error_message);
            });
        },
        "deleteAPI":{
            "endPoint":`${main_view.base_url}/abm/suppliers/delete-profile-picture`,
            "params":()=>{
                return {"id": mThis.options.id,"supplier_id":mThis.options.id}
            }
        }
    });
    

    this.prepareData = (id,def, onFinish) => {
        // console.log(id);
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/abm/suppliers/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
            // console.log(d);
            // d.bank_accounts = d.bank_accounts || [];
            // VSUtil.setComboItems(mThis.elSenderType, d.sender_types, 'id', 'sender_type', true, '(Select Merchant Type)', def.sender_type_id);
            // VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
            VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', null);
            onFinish(d);
        });
    }

    this.btnSave.onclick = e =>{
        e.preventDefault();
        let p = mThis.getData();
        vsapi.call(`${mThis.base_url}/abm/suppliers/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.modal.hide();
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            }
            else
                cv_interact.error(res.error_message);
        });
    }
    

    // this.show = (options) => {
    //     // console.log(options);
    //     if (!options) options = {};
    //     mThis.options = options;
         
    //     mThis.prepareData(mThis.options.id,{},data => { 
    //         if(data.supplier){
    //             mThis.elTitle.text("Modify Supplier Information");
    //         }
    //         else{
    //             mThis.elTitle.text("Create Supplier");
    //         }
    //         mThis.setData(data.supplier);
    //         mThis.self.modal({
    //             backdrop: 'static'
    //         });
    //     });
    // }
    this.show = (options)=>{
        mThis.options = options || {};
        mThis.elTitle.innerHTML = options.title;
        if (mThis.options.id > 0) {
            mThis.elTitle.innerHTML = "Modify Supplier";
            let p = {'id':mThis.options.id};
            vsapi.call([main_view.base_url,'/abm/suppliers/form-options'].join(''),p,null).then(res=>{
                
                if(res.status_code === 200){
                    let d = res.data.supplier;

                    d = StringSanitizer.sanitizeObject(d,null,['email','address','image_url','photo']);
                    mThis.prepareData(d, {}, data => {
                        mThis.setData(d);
                        mThis.modal.show();
                    });
                }
            });
        }
        else{
            mThis.elTitle.innerHTML =  "New Supplier";
            mThis.prepareData({'id':1},{},data =>{
                mThis.setData();
               mThis.modal.show(); 
            });
        }
    }

    this.setData = (d) => {
        // mThis.body.querySelectorAll('.data-input').forEach(el => {
        //     el.value = null;
        // }); 
        d = d || {};
        mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            el.value = d[data_member] ?? '';
            console.log(d[data_member]);

            if (el.tagName.toLowerCase() === 'select') {
                el.dispatchEvent(new Event('change'));
            }else if(el.tagName ==='IMG'){
                el.setAttribute('src',d[data_member] || '');
            }
                
           
        });
        console.log(d);
    mThis.imgBox.setImage(d.photo || d.image_url);

    }
    this.getData = () => {
        let p = {};
        p.id = mThis.options.id;
        mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
            let data_member = el.dataset.field;
           if(el.tagName ==='IMG') 
                p[data_member] = el.getAttribute('src');
            else 
                p[data_member] = el.value;
        });
        // p.banks = mThis.getBanks();
        return p;
    }

    
}

