'use strict';
var SuppliersComponent = new function(){
    const mThis = this;
    this.title_prop = "Supplier";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_suppliersComponent');
    this.elFilter_supplier_status = mThis.self.find('#_sdl_filter_supplier_status');
    this.div_filter_fields = mThis.self.find('#_sdl_filter_fields')[0];

    this.btnNewSupplier = mThis.self.find('#_sdl_btnNewSupplier');
    this.elSearch = mThis.self.find('#_sdl_search_supplier');
    this.btnSearch = mThis.self.find('#_sdl_btnSearch');
    this.tblSenders_body = mThis.self.find('#_sdl_supplier_body');
    this.sender_dropdown_menu = this.self.find('div.dropdown');

    this.btnPrint = mThis.self.find('#_sdl_btnPrint');
    this.btnPDF = mThis.self.find('#_sdl_btnPDF');

    this.setSupplierPriceList = (supplier_id,name=null,span=null,def_price_list_id=null) => {
        mThis.getPriceListItems((items)=>{
            items.unshift({
                id: null,
                name: 'Select price list'
            });

            let option = {
                title: `Set Price List for ${name ? name : 'Supplier'}`,
                dataLabel: "Price list name",
                valueMember: "id",
                textMember: "name",
                blankErrorMessage: "Please a price list",
                data: items,
                defaultValue: def_price_list_id
            };

            InputBox2.show(option,(d)=>{
                if(d) {
                    let p = {
                        supplier_id: supplier_id,
                        price_list_id: d.value
                    };
                    // console.log(p); 
                    vsapi.call(`${mThis.base_url}/abm/os_suppliers/set-price-list`,p,null).then(res => {
                        // console.log(res.status_code);
                        if(res.status_code === 200){
                            let d = StringSanitizer.sanitizeObject(res.data);
                            span.textContent = d.list_name; 
                            cv_interact.success('Price list ' + d.list_name + ' has been assigned to the supplier successfully');
                            
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
            className: 'col_action align-middle',
            data: function (data, row, display) {
                let html = ['<div class="dropdown">',
                    '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-name="', data.name, '" class="btn_pickup_action " aria-haspopup="true" aria-expanded="false">',
                    '<i class="fa fa-chevron-down " style="color:grey;font-size:1.4em"></i>',
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
                const sender_info = ['<div class="d-flex p-1 text-capitalize" ><span class="d-block p-1">',(data.name || 'គ្មាន'),'</span></div>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'Supplier Name '
        },
        {
            title: "Contact Info",
            className: "align-middle ",
            data: (data,index,tr)=>{
                return ['<div class="d-flex p-1" ><i class="fas mt-2 text-success fa-envelope"></i><span class="d-block p-1">',(data.email || 'គ្មាន'),'</span></div>','<div class="d-flex p-1"><i class="fas text-warning fa-phone mt-2"></i><span class="d-block p-1 text-primary">',data.phone_number,'</span></div>'].join('');
            }
        },
      
        {
            className: "price_list_name align-middle ",
            data: (data,index,tr)=>{
                let price_list_html = data.price_list_name ? `<span class="supplier-price-list">${data.price_list_name}</span>` : `គ្មាន <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="set-price-list">
                <i class="fa-solid fa-pencil text-danger"></i></a>`;
                const sender_info = ['<span class="sender-name text-primary d-block">',price_list_html,'</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'Price List '
        },

        // {
        //     className: "sales_agent_id align-middle",
        //     data: function (data, index, tr) {
        //         return ['<span class="pl-request_date text-capitalize d-block">',data.referrer||"NA", '</span>','<span class="text-muted">',data.agent_type,'</span>'].join('');
        //     },
        //     title: 'Sales Agent'
        //     // title: mThis.trans('Created Date')
        // },
        
        {
            className: "created_by align-middle",
            data: function (data, index, tr) {
                return ['<span class="pl-request_date d-block">',data.create_user||"NA", '</span>','<span class="text-success">',data.created_at,'</span>'].join('');
            },
            title: 'Create By'
            // title: mThis.trans('Created Date')
        },
        {
            className: 'status align-middle',
            data: function (data, index, tr) {
                const cls_class = (data.status_code || '').toLowerCase() === 'active' ? ' text-success text-center' : ' text-danger text-center';
                const status_code = data.status_code ? VSUtil.properCase(data.status_code) : 'Inactive';
                return ['<a class="d-block" data-status="', status_code, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class=" p-2  ${cls_class} ">`, status_code, '</span></a>'].join('');
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
                        vsapi.call(`${main_view.base_url}/abm/os_suppliers/save-profile-picture`,{
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
                        vsapi.call(`${main_view.base_url}/abm/os_suppliers/delete-profile-picture`,{
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

    this.setEvents = (container) => {
        const div =  container.find('.table');
        console.log(container);
        // const div =  container.find('.col_action');
        const btn = container.find('.btn-options');

        btn.off('click').on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });
  
        container.off('click').on('click',e => {
            e.preventDefault();
             
           
 
            //click on Set Price List
            let lnk = VSUtil.getElementByClass(e.target,'set-price-list');
            if(lnk){
                // console.log(lnk);
                mThis.setSupplierPriceList(lnk.dataset.id,lnk.dataset.name,lnk.parentElement,null);
                return;
            }
         });

        if(div.length !== 0){
            

            div.off('click').on('click',(e) => {
                e.preventDefault();
                

                let lnk = VSUtil.getElementByClass(e.target,'btn-supplier-edit');
                if(lnk){
                
                    let op = {
                        id: lnk.dataset.id,
                        title : 'Modify Supplier',
                        onClose:()=>{
                            mThis.listView.showPage(mThis.getFilterData());
                        }
                    };
                    SupplierDialog.show(op);                     
                    return;
                }
                // Click on Set Price List
                lnk = VSUtil.getElementByClass(e.target,'btn-set-price-list');
                if(lnk){
                    const id = lnk.dataset.id;
                    let pl_id = lnk.dataset.pricelistid;
                    let name = lnk.dataset.name;
                    let span = container.find('.supplier-price-list')[0];
                    mThis.setSupplierPriceList(id,name, span ? span.parentElement : null ,pl_id); 
                    return;
                }
                //Click on Delete Merchant
                lnk = VSUtil.getElementByClass(e.target,'btn-supplier-delete');
                if(lnk){
                    const id = lnk.dataset.id;
                    let status_code = lnk.dataset.status;
                    let p = {
                        id: id,
                        status_code: status_code
                    };
                    cv_interact.confirm('Delete this Supplier?',{
                        title: 'Delete Supplier',
                        context: 'delete'
                    },function(e){
                        if(e){
                            vsapi.call(`${mThis.base_url}/abm/os_suppliers/delete`,{
                                id: id
                            },null).then(res => {
                                if(res.status_code === 200){
                                    mThis.listView.showPage(mThis.getFilterData());
                                }
                                else
                                    cv_interact.error(res.error_message);
                            });
                        }
                    });
                    return;
                }
 
                
 
                //Click on Set Price List
                lnk = VSUtil.getElementByClass(e.target,'btn-set-price-list');
                if(lnk){
                    const id = lnk.dataset.id;
                    let pl_id = lnk.dataset.pricelistid;
                    let name = lnk.dataset.name;
                    let span = container.find('.supplier-price-list')[0];
                    mThis.setSupplierPriceList(id,name, span ? span.parentElement : null ,pl_id); 
                    return;
                }

                //Click on Change Status
                lnk = VSUtil.getElementByClass(e.target,'btn-supplier-status');
                if(lnk){
                    let supplier_id = lnk.dataset.id;
                    let status_code = Validator.properCase(lnk.dataset.status);
                    let option = {
                        title: 'Set Supplier Status',
                        dataLabel: "Supplier status",
                        valueMember: "status_code",
                        textMember: "name",
                        blankErrorMessage: "Please select a correct Status",
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

                    InputBox2.show(option,(d)=>{
                        if(d){
                            let p = {
                                id: supplier_id,
                                status_code: d.value
                            };

                            vsapi.call(`${mThis.base_url}/abm/os_suppliers/update-status`,p).then(res => {
                                if(res.status_code === 200){
                                    mThis.elFilter_supplier_status.val(d.value).trigger('change');
                                    cv_interact.success('The status has been updated');
                                    mThis.listView.showPage(mThis.getFilterData());
                                }
                                else
                                    cv_interact.error(res.error_message); 
                            });
                        }
                    });
                    return;
                }

              
            });
        }
    }

    this.loadFilterData = (onFinish) => {
        mThis.def_filter = mThis.def_filter || {};
        mThis.def_filter.status_code = mThis.def_filter.status_code || 'Active';

        //Do not allow filter to be applied yet. I means that filter SELECT's change event wont refresh the merchant list
        mThis.allow_filter = false;
        vsapi.call(`${mThis.base_url}/abm/os_suppliers/form-options`, null,null,main_view.apiCluster).then(res => {
            let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
            VSUtil.setComboItems(mThis.elFilter_supplier_status, d.sender_statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
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
            fetchApi: `${main_view.base_url}/abm/os_suppliers/list-paginate`,
            apiCluster: main_view.apiCluster,
            tableClass: "table header-uppercase",
            perPage: 10,
            columns: mThis.cols,
            rowCreated:(data,index,tr)=>{
                
              tr.dataset.id = data.id;  
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

        this.container = mThis.listView.getListContainer();
        mThis.setEvents($(mThis.container));
        // console.log(mThis.container.parentElement); 
        const parent = mThis.container.parentElement;
            parent.style.height = (window.innerHeight - 190)+'px';
            parent.classList.add('overflow-y-auto');
            window.onresize = () => {
            parent.style.height = (window.innerHeight - 190)+'px';
        }

        mThis.tblSenders = mThis.listView.getListContainer();

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                console.log(1,mThis.getFilterData());

                    mThis.listView.showPage(mThis.getFilterData());
               
            };
        });

        this.btnNewSupplier.on('click', function(e){
            e.preventDefault();
            let op = {
                id: null,
                onClose: (d) =>{
                    mThis.listView.showPage(mThis.getFilterData());  
                }
            } ;
            SupplierDialog.show(op);
        });

        mThis.tblSPY = mThis.listView.getTable();
        mThis.tblSuppliers = $(mThis.tblSPY);
        console.log(mThis.tblSuppliers);

        mThis.tblSuppliers[0].addEventListener('click', e => {
            e.preventDefault();
            // Click on Pickup Action button | drop down action
            let btn = VSUtil.closestLimited(e.target, '.btn_pickup_action');
            if (btn) {
                let p = btn.parentElement;
                let supplier_id = btn.dataset.id;
                let pricelist_id = btn.dataset.pricelistid;
                let supplier_name = btn.dataset.name;
                let status_code = btn.dataset.status;
                console.log(supplier_id,pricelist_id,supplier_name,status_code);
        
                let dropdownMenu = p.querySelector('.dropdown-menu');
                if (!dropdownMenu || dropdownMenu.length === 0) {
                    p.insertAdjacentHTML('afterbegin', mThis.createDropdownMenuHtml_pickup(supplier_id, pricelist_id, supplier_name ,status_code));
                    dropdownMenu = p.querySelector('.dropdown-menu');
                    dropdownMenu.setAttribute('style',` right: -130px;`);
                }
        
                if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
                    mThis.prev_dropdownMenu.classList.remove('show');
                }
        
                dropdownMenu.classList.toggle('show');
                if (dropdownMenu.classList.contains('show')) {
                    mThis.prev_dropdownMenu = dropdownMenu;
                }
                return;
            }

          
        });

        mThis.tblSenders.addEventListener('click', e => {
            e.preventDefault();
            //Click on action button;
            let btn = VSUtil.getElementByClass(e.target, 'btn_sender_action');
            if(btn){
                return;
            }
        });

        document.addEventListener('click', e => {
            let container = mThis.sender_dropdown_menu.parent();
            if(container){
                if(!container.is(e.target) && container.has(e.target).length === 0){
                    mThis.sender_dropdown_menu.removeClass('show');
                }
            }
        });

        mThis.elSearch.on('keyup', () => {

            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.listView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.btnSearch.on('click', function(){
            mThis.listView.showPage(mThis.getFilterData());
        });

        mThis.initAlready = true;
    }

    this.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.val(),
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
        console.log(mThis.getFilterData());
        mThis.loadFilterData(() => {
            mThis.listView.showPage(mThis.getFilterData(),null,() => {
                mThis.self.siblings().hide();
                mThis.self.hide().fadeIn(300);
            });
        });
    }

    this.hide = () => {
        mThis.self.hide();
    }

    this.changeSenderStatus = () => {
        return;
    }
    
    this.createDropdownMenuHtml_pickup = function (supplier_id, pricelist_id, name ,status) {
        let html = [
            '<div class="dropdown-menu bg-white shadow" data-id="', supplier_id, '" data-pricelistid="', pricelist_id, '" data-name="', name, '">',
            // '<a class="dropdown-item _pl_pa_assign_driver" href="javascript:void(0)"><i class="fa fa-biking" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '"></i> Assign Driver (Pickup)</a>',
            `<a href="javascript:void(0)" class="dropdown-item btn-set-price-list border-bottom pb-2" data-id="${supplier_id}" data-pricelistid="${pricelist_id}" data-name="${name}" data-status="${status}">
                <i class="fa-regular fa-list-alt fs-5"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Set Price List">Set Price List</span>
            </a>`,
            `<a href="javascript:void(0)" class="dropdown-item btn-supplier-edit border-bottom pb-2" data-id="${supplier_id}" >
                <i class="fa-regular fa-pen-to-square fs-5 text-success"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Modify Supplier">Modify Supplier</span>
            </a>`,
            `<a href="javascript:void(0)" class="dropdown-item btn-supplier-delete border-bottom pb-2" data-id="${supplier_id}" data-status="${status}">
                <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Delete Supplier">Delete Supplier</span>
            </a>`,    
            `<a href="javascript:void(0)" class="dropdown-item btn-supplier-status border-bottom pb-2" data-id="${supplier_id}" data-status="${status}">
                <i class="fa-regular fa-circle-stop fs-5 text-primary"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Change Status">Change Status</span>
            </a>`,
            // '<a class="dropdown-item _pl_pa_change_driver" href="javascript:void(0)"><i class="fa fa-user"></i> Change Driver (Pickup)</a>',
            '</div>'].join('');
        return html;
    };
}


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
            vsapi.call(`${main_view.base_url}/abm/os_suppliers/save-profile-picture`,p,null,null,false).then(res =>{
                if(res.status_code ===200){
                    mThis.imgBox.setImage(photo);
                   // cv_interact.success('Photo has been saved');
                }else cv_interact.error(res.error_message);
            });
        },
        "deleteAPI":{
            "endPoint":`${main_view.base_url}/abm/os_suppliers/delete-profile-picture`,
            "params":()=>{
                return {"id": mThis.options.id,"supplier_id":mThis.options.id}
            }
        }
    });
    

    this.prepareData = (id,def, onFinish) => {
        // console.log(id);
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/abm/os_suppliers/form-options`,{
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
        vsapi.call(`${mThis.base_url}/abm/os_suppliers/save`, p).then(res => {
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
            // mThis.elTitle[0].innerHTML = "Suppliers Details";
            let p = {'id':mThis.options.id};
            vsapi.call([main_view.base_url,'/abm/os_suppliers/form-options'].join(''),p,null).then(res=>{
                
                if(res.status_code === 200){
                    let d = res.data.supplier;
                console.log(d);

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

