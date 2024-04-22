'use strict';
var SuppliersComponent = new function(){
    const mThis = this;
    this.title_prop = "Supplier";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_suppliersComponent');
    this.elFilter_business_type = mThis.self.find('#_sdl_filter_business_type');
    this.elFilter_sender_status = mThis.self.find('#_sdl_filter_sender_status');
    this.div_filter_fields = mThis.self.find('#_sdl_filter_fields')[0];

    this.btnNewSupplier = mThis.self.find('#_sdl_btnNewSupplier');
    this.elSearch = mThis.self.find('#_sdl_search_sender');
    this.btnSearch = mThis.self.find('#_sdl_btnSearch');
    this.tblSenders = mThis.self.find('#_sdl_tblSenders');
    this.tblSenders_body = mThis.self.find('#_sdl_tblSenders_body');
    this.sender_dropdown_menu = mThis.tblSenders.find('div.dropdown');

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
                    // vsapi.call(`${mThis.base_url}/abm/os_suppliers/set-price-list`,p,null).then(res => {
                    //     if(res.status_code === 200){
                    //         let d = StringSanitizer.sanitizeObject(res.data);
                    //         span.textContent =d.list_name; 
                    //         cv_interact.success('Price list ' + d.list_name + ' has been assigned to the merchant successfully');
                    //     }
                    //     else
                    //         cv_interact.error(res.error_message); 
                    // });
                }
                // mThis.self.siblings().hide();
                // mThis.self.hide().fadeIn(250);	
            });
        });
    }

    this.createAppAccount = (sender_id)=>{
        const sender = mThis.store_suppliers[sender_id] || {}; 
        const op = {
            user_id: null,
            open: 'add-user',
            default: {
                official_code: sender.code,
                user_class: "merchant",
                phone_number: sender.phone_number,
                full_name: sender.name
            },
            onClose: () => {
                mThis.elSearch.val(sender.phone_number);
                mThis.listView.showPage(mThis.getFilterData());
            }
        };
        if(!AuthManager.allowed(100)) return;
        AddUserDialog.show(op);
    }

    this.cols = [
        {
            className: "",
            data: (data,index,tr)=>{
                return "";
            },
            // title: mThis.trans('Sender ID')
            title: ' '
        },
        {
            title: "Photo",
            className: ' align-middle',
            data: (data, a, b) => {
                let image = data.image_url ? data.image_url : '';
                return [`<img class="image-student-tbl" src="${image}" alt=""/>`].join('');
            }
        },
        
        {
            className: "code align-middle",
            data: (data,index,tr)=>{
                const sender_info = ['<span class="sender-name d-block">#',data.code||'គ្មាន','</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'code '
        },
        {
            className: "name align-middle",
            data: (data,index,tr)=>{
                const sender_info = ['<span class="sender-name d-block">',data.name,'</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'Name '
        },
        {
            className: "phone_number align-middle",
            data: (data,index,tr)=>{
                const sender_info = ['<span class="sender-name d-block">',data.phone_number,'</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'phone number '
        },
        {
            className: "email align-middle",
            data: (data,index,tr)=>{
                const sender_info = ['<span class="sender-name d-block">',data.gmail||'NA','</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'email'
        },
        {
            className: "address align-middle",
            data: (data,index,tr)=>{
                const sender_info = ['<span class="sender-name d-block">',data.address||'NA','</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'address '
        },
        {
            className: "price_list_name align-middle",
            data: (data,index,tr)=>{
                let price_list_html = data.price_list_name ? `<span class="supplier-price-list">${data.price_list_name}</span>` : `គ្មាន <a href="javascript:void(0)" data-id="${data.id}" data-suppliername="${data.name}" class="set-price-list">
                <i class="fa fa-edit fs-5"></i></a>`;
                const sender_info = ['<span class="sender-name d-block">',price_list_html,'</span>'].join('');
                return sender_info;
            },
            // title: mThis.trans('Sender ID')
            title: 'price list '
        },

        {
            className: "sales_agent_id align-middle",
            data: function (data, index, tr) {
                return ['<span class="pl-request_date d-block">',data.sales_agent||"NA", '</span>'].join('');
            },
            title: 'Sales Agent'
            // title: mThis.trans('Created Date')
        },
        
        {
            className: "created_by align-middle",
            data: function (data, index, tr) {
                return ['<span class="pl-request_date d-block">',data.create_user||"NA", '</span>'].join('');
            },
            title: 'create by'
            // title: mThis.trans('Created Date')
        },
        {
            className: "status align-middle",
            data: function (data, index, tr) {
                return ['<div class="d-block">',data.status_code == 'Active'? '<span class="pl-request_date btn-act rounded-2">Ative</span>' : '<span class="pl-request_date btn-act-inactive rounded-2">Inactive</span>','</div>'].join('');
            },
            title: 'status'
            // title: mThis.trans('Created Date')
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                let html = ['<div class="dropdown d-block ">',
                    '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-suppliername="', data.name, '" data-status="', data.status_code='active'? 1 : 2, '"  class="btn_pickup_action " aria-haspopup="true" aria-expanded="false">',
                    '<i class="fa fa-chevron-down" style="color:#8DC63F;font-size:1.5em"></i>',
                    '</a>',
                    '</div>'].join('');
                return html;
            },
            // title: 'action'
        },
    ];

    this.renderMerchant = (container, data) => {
        let html = '';
        let cnt = 0;
        container.style.display = 'none';
        mThis.store_suppliers = {};
        (data || []).map(item => {
            mThis.store_suppliers[item.id] = {
                code: item.code,
                name: item.name,
                phone_number: item.phone_number
            };
            let sales_agent_id = `<span class=" ">${item.sales_agent_id}</span>`;
            let email = `<span class=" ">${item.email}</span>`;
            let created_by = `<span class="d-block fw-sembold">${item.create_user}</span>
            <pan class="d-block">
                <small>${item.created_at}</small>
            </span>`;

            (item.bank_accounts || []).map(ac => {
                if(ac.is_primary == 1 || !item.bank_accounts[1])
                    bank_account_html = `<span class="fw-semibold">${ac.bank_name}/${ac.account_number}</span>
                    <span> /${ac.account_name}</span`;
            });

            let status_class = (item.status_code +'').toLowerCase() === 'active' ? 'text-capitalize p-2 text-center border border-success rounded-5 text-success' : 'text-capitalize p-2 text-center border border-danger rounded-5 text-danger';
            let mobile_login = '';
            if(item.mobile_login){
                if(item.mobile_login.status.toLowerCase() == 'active'){
                    mobile_login = `<span class="text-success">${item.mobile_login.login_name}  (${item.mobile_login.status})</span>`;
                }
                else{
                    mobile_login = `<span class="text-dark p-1">${item.mobile_login.login_name}</span>
                    <span class="text-capitalize p-2 bg-danger rounded-5 text-white">${item.mobile_login.status}</span>`;
                }
            }
            else{
                mobile_login = `<span class="p-2 text-danger">គ្មាន</span>
                <span>
                    <a href="javascript:void(0)" data-id="${item.id}" class="btn-app-login btn btn-sm btn-outline-primary">
                        <i class="la la-mobile fs-4"></i> 
                        <span>Create</span>
                    </a>
                </span>`;
            }

            let price_list_html = item.price_list_name ? `<span class="merchant-price-list">${item.price_list_name}</span>` : `គ្មាន <a href="javascript:void(0)" data-id="${item.code}" data-merchantname="${item.name}" class="set-price-list">
                <i class="fa fa-edit fs-5"></i>
            </a>`;

            html += `<div class="d-flex p-3 bg-white h-info-student mb-2">
                <div class="div-img" data-id="${item.id}" data-imageurl="${item.image_url}"></div>
                <div class="d-block ms-3 w-100">
                    <div class="row row-cols-3 mb-0">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Supplier ID"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get" data-field="official_id">${item.code}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get" data-field="full_name">${item.name}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Phone Number"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get" data-field="phone_number">${item.phone_number}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Sales Agent"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.sales_agent_id? item.sales_agent_id:"គ្មាន"}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Price List"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${price_list_html}</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Email"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${email}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex align-items-center">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.App Account"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${mobile_login}</p>
                            </div>
                        </div>
                        <div class="col position-relative">
                            <div class="d-flex align-items-start justify-content-end gap-2">
                                <button class="btn btn-sm btn-danger rounded-3 btn-options position-relative text-nowrap" type="button">
                                    <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                    <i class="fa-solid fa-caret-down ps-2"></i>
                                    <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                        <a href="javascript:void(0)" class="btn-merchant-edit border-bottom pb-2" data-id="${item.id}">
                                            <i class="fa-regular fa-pen-to-square fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Modify Merchant"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-set-price-list border-bottom pb-2" data-id="${item.id}" data-pricelistid="${item.price_list_id}" data-merchantname="${item.name}" data-status="${item.status_code}">
                                            <i class="fa-regular fa-list-alt fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Set Price List"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-merchant-delete border-bottom pb-2" data-id="${item.id}" data-status="${item.status_code}">
                                            <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Delete Merchant"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-merchant-delete-special border-bottom pb-2" data-id="${item.id}" data-status="${item.status_code}">
                                          <i class="fa-regular fa-trash-can fs-5 text-warning"></i>
                                          <span class="ps-2 trans-text" data-langprop="titles.Delete Special"></span>
                                       </a>
                                        <a href="javascript:void(0)" class="btn-merchant-status border-bottom pb-2" data-id="${item.id}" data-status="${item.status_code}">
                                            <i class="fa-regular fa-circle-stop fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Change Status"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-create-app-account border-bottom pb-2" data-id="${item.id}">
                                            <i class="fa-solid fa-mobile fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Create App Account"></span>
                                        </a>
                                    </div>
                                </button>
                            </div>
                            <div class="d-flex justify-content-end align-items-center h-100">
                                <div class="d-block position-relative">
                                    <span class="${status_class}" data-id="${item.code}" data-status="${item.status_code}">${item.status_code}</span>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="bg-dark m-1 p-0"/>
                    <div class="row row-cols-5 mt-2">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Address"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.address ? item.address : 'គ្មាន'}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Created By"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${created_by}</p>
                            </div>
                       </div>
                    </div>
                </div>
            </div>`;
            cnt++;
        });

        if(cnt == 0){
            html = `<div class="d-flex bg-white p-3 rounded-3 align-items-center">
                <h5>${LocaleManager.trans('No data to display!')}</h5>
            </div>`;
        }

        container.innerHTML = html;
        
        /** Display profile photos for all displayed merchants */
        container.querySelectorAll('.div-img').forEach(div =>{
            mThis.setImage(div,div.dataset.imageurl);
        });
        
        mThis.setEvents($(container));
        LocaleManager.translateZone(container);
        setTimeout(() => {
            container.style.display = 'block';
        }, 200);

        const parent = container.parentElement;
        parent.style.height = (window.innerHeight - 210)+'px';
        parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 210)+'px';
        }
    };

    this.chooseImage = (div) => {
        div.onclick = function(e){
            e.preventDefault();
            e.stopPropagation();
            const img = VSUtil.getElementByClass(e.target,'img-sdl-show');
            if(img){
                FileChooser.chooseFile(null,(d) => {
                    if(d){
                        const imgContainer = img.parentElement;
                        mThis.setImage(imgContainer,d.dataUrl);
                        vsapi.call(`${main_view.base_url}/abm/merchant/save-profile-picture`,{
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
                <a href="javascript:void(0)" class="img-sdl-delete">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`;
            div.innerHTML = html;
            mThis.setImageDeleteEvent(div);
        }
        else{
            const html = `<div class="img-sdl-show border rounded-3 h-100 w-100 d-flex align-items-center justify-content-center" role="button">
                <i class="fa-regular fa-image fs-3 text-muted"></i>
            </div>`;
            div.innerHTML = html;
            mThis.chooseImage(div);
        }
    }

    this.setImageDeleteEvent = (div) => {
        let lnk = div.querySelector('.img-sdl-delete');
        if(lnk){
            lnk.onclick = (e) => {
                e.preventDefault();
                cv_interact.confirm('Delete this profile picture now?',{
                    context: 'delete',
                    title: 'Delete Photo'
                },(e) => {
                    if(e){
                        const imgContainer = lnk.closest('.div-img');
                        vsapi.call(`${main_view.base_url}/abm/merchant/delete-profile-picture`,{
                            id: imgContainer.dataset.id
                        },false).then(res => {
                            if(res.status_code === 200){
                                const html = `<div class="img-sdl-show border rounded-3 h-100 w-100 d-flex align-items-center justify-content-center" role="button">
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
             
            let lnk = VSUtil.getElementByClass(e.target,'btn-app-login');
            if(lnk){
                mThis.createAppAccount(lnk.dataset.id);
                return;
            }
 
            //click on Set Price List
            lnk = VSUtil.getElementByClass(e.target,'set-price-list');
            if(lnk){
                // console.log(lnk);
                mThis.setSupplierPriceList(lnk.dataset.id,lnk.dataset.suppliername,lnk.parentElement,null);
                return;
            }
         });

        if(div.length !== 0){
            // let prev_div = null;
            // prev_div = div.find('.dropdown-menu');
            // console.log(prev_div);
            // $(document).off('click').on('mouseup',function(e){
            //     e.preventDefault();
            //     if((!div.is(e.target) && div.has(e.target).length === 0) && prev_div){
            //         prev_div.hide('fast');
            //     }
            //     else{
            //         if((!div.is(e.target) && div.has(e.target).length === 0) && (!btn.is(e.target) && btn.has(e.target).length === 0)){
            //             prev_div = div;
            //             div.hide('fast');
            //         }
            //     }
            // });

            div.off('click').on('click',(e) => {
                e.preventDefault();
                

                let lnk = VSUtil.getElementByClass(e.target,'btn-supplier-edit');
                if(lnk){
                    console.log(lnk);
                    let op = {
                        id: lnk.dataset.id,
                        onClose:()=>{
                            mThis.listView.showPage(mThis.getFitlerData());
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
                    let name = lnk.dataset.suppliername;
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
                    cv_interact.confirm('Delete this merchant?',{
                        title: 'Delete Merchant',
                        context: 'delete'
                    },function(e){
                        if(e){
                            vsapi.call(`${mThis.base_url}/abm/merchant/delete`,{
                                id: id
                            },null).then(res => {
                                if(res.status_code === 200){
                                    mThis.listView.showPage(mThis.getFitlerData());
                                }
                                else
                                    cv_interact.error(res.error_message);
                            });
                        }
                    });
                    return;
                }
 
                //Click on Delete Merchant Special (Force delete everything about the merchant)
                lnk = VSUtil.getElementByClass(e.target, 'btn-merchant-delete-special');

                if (lnk) {
                    const id = lnk.dataset.id;
                    let status_code = lnk.dataset.status;
                    let p = {
                        id: id,
                        status_code: status_code
                    };
                    let confirm_count = 0;
                
                    const confirmDelete = () => {
                        cv_interact.confirm([
                            'Are you sure to delete this merchant <span class="text-danger fw-semibold">permanently?</span>',
                            '<span class="d-block text-black mt-2">You will need to confirm 7 times before deleting. <span class="d-block fs-4 fw-semibold text-danger">',
                            (confirm_count + 1 ==7? 'This you LAST confirmation!': ['Confirm Count: ',(confirm_count +1)].join('')),
                            '</span></span>'
                        ].join(''), {
                            title: 'Delete Merchant Special',
                            context: 'delete'
                        }, e => {
                            if (e) {
                                confirm_count++;
                
                                if (confirm_count === 7) {
                                    vsapi.call(`${mThis.base_url}/abm/merchant/delete-special`, {
                                        id: id
                                    }, null).then(res => {
                                        if (res.status_code === 200) {
                                            mThis.listView.showPage(mThis.getFitlerData());
                                        } else {
                                            cv_interact.error(res.error_message);
                                        }
                                    });
                                } else {
                                    confirmDelete();
                                }
                            } else {
                                confirm_count = 0;
                            }
                        });
                    };
                
                    confirmDelete();
                }
 
                //Click on Set Price List
                lnk = VSUtil.getElementByClass(e.target,'btn-set-price-list');
                if(lnk){
                    const id = lnk.dataset.id;
                    let pl_id = lnk.dataset.pricelistid;
                    let name = lnk.dataset.merchantname;
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
                        if(d) {
                            let p = {
                                id: supplier_id,
                                status_code: d.value
                            };

                            vsapi.call(`${mThis.base_url}/abm/os_suppliers/update-status`,p).then(res => {
                                if(res.status_code === 200){
                                    mThis.elFilter_sender_status.val(d.value).trigger('change');
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

                //Click on create mobile app account
                lnk = VSUtil.getElementByClass(e.target,'btn-create-app-account');
                if(lnk){
                    mThis.createAppAccount(lnk.dataset.id);
                    return;
                }

                //Click on "Delete Special" => Force delete merchant information and related data
                lnk = VSUtil.getElementByClass(e.target,'btn-merchant-delete-sepcial');
                if(lnk){
                    let op = {
                        id: lnk.dataset.studentid
                    };

                    cv_interact.confirm('You are about to delete this student permanently. All information including Enrollment and Attendance will be deleted. Are you sure to proceed?',{
                        title: 'Delete Student Permanently',
                        context: 'delete'
                    },(e) => {
                        if(e){
                            vsapi.call(`${main_view.base_url}/abm/student/delete-special`,op,null).then(res => {
                                if(res.status_code === 200){
                                    cv_interact.success('The student has been deleted permanently');
                                    mThis.ListView.showPage(mThis.getFilterData());
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
            VSUtil.setComboItems(mThis.elFilter_sender_status, d.sender_statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
            VSUtil.setComboItems(mThis.elFilter_business_type, d.business_types, 'business_type', 'business_type', true, '(All Business Types)', 0);
            // VSUtil.setComboItems(SupplierDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
            onFinish();
            mThis.allow_filter = true;
        });
    }

    this.getPriceListItems = (onFinish) => {
        vsapi.call(`${mThis.base_url}/dms/getComboItems_price_list`,null,false).then(res => {
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
              tr.setAttribute('id',['supplier_',data.id].join('')); 
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
            parent.style.height = (window.innerHeight - 210)+'px';
            parent.classList.add('overflow-y-auto');
            window.onresize = () => {
            parent.style.height = (window.innerHeight - 210)+'px';
        }

        mThis.tblSenders = mThis.listView.getListContainer();

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                if(mThis.allow_filter){
                    mThis.listView.showPage(mThis.getFitlerData());
                }
            };
        });

        this.btnNewSupplier.on('click', function(e){
            e.preventDefault();
            let op = {
                id: null,
                onClose: (d) =>{
                    mThis.listView.showPage(mThis.getFitlerData());  
                }
            } 
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
                let supplier_name = btn.dataset.suppliername;
                let status_code = btn.dataset.status;
        
                let dropdownMenu = p.querySelector('.dropdown-menu');
                if (!dropdownMenu || dropdownMenu.length === 0) {
                    p.insertAdjacentHTML('afterbegin', mThis.createDropdownMenuHtml_pickup(supplier_id, pricelist_id, supplier_name ,status_code));
                    dropdownMenu = p.querySelector('.dropdown-menu');
                    dropdownMenu.setAttribute('style',` left: -130px;`);
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

            //Click on "Arrive" button, the shortcut button in shipment_tr
            btn = VSUtil.closestLimited(e.target,'.pkl_btn_receive');
            if(btn){
                        if(!AuthManager.allowed(222)) return;
                        const shipment_tr = btn.closest('tr');
                        cv_interact.confirm('ទទួលទំនិញទាំងអស់ក្នុងបញ្ជាមួយនេះ?',{'context':"update"},e =>{
                            if(e){
                               if (mThis.shm_prev_editing_row) {
                                   mThis.saveItem(mThis.shm_prev_editing_row, btn, success => {
                                       if (success){
                                          mThis.receiveItems_all(shipment_tr, null);
                                       }
                                   });
                               }
                               else mThis.receiveItems_all(shipment_tr, null);
                            }
                  });
                return;
            }

            //Click on Pick button | Pick Order
            btn = VSUtil.closestLimited(e.target,'.pkl_btn_pick');
            if(btn){
                //if(!AuthManager.allowed() ) return; 
                const shipment_tr = btn.closest('tr');
                if (mThis.shm_prev_editing_row) {
                    mThis.saveItem(mThis.shm_prev_editing_row, (item_saved) => {
                        if (item_saved) {
                            mThis.pickItems(shipment_tr, btn, (sucess,d) => {
                                if (sucess){
                                    shipment_tr.dataset.statusid = d.status_id;
                                    btn.style.display ='none';
                                }
                            });
                        }
                    });
                }
                else {
                    mThis.pickItems(shipment_tr,(success,d) => {
                        if (success){
                            shipment_tr.dataset.statusid = d.status_id;
                            btn.style.display ='none';
                        }
                    });
                }
                return;
            }

            //Click on Change Status
            btn = VSUtil.closestLimited(e.target,'.change-order-status');
            if(btn){
                let tr = btn.closest('tr');
                mThis.changeOrderStatus(tr);
                return;
            }

            //Click on Dropdown menu item : "Change Status"
            btn = VSUtil.closestLimited(e.target,'._pl_pa_change_status');
            if(btn){
                let tr = btn.closest('tr');
                mThis.changeOrderStatus(tr);
                return;
            }

            //Click on Dropdown menu item : "Assign Driver"
            btn = VSUtil.closestLimited(e.target,'._pl_pa_assign_driver');
            if(btn){
                let tr = btn.closest('tr');
                mThis.assignDriver(tr,null);
                return;
            }

              //Click Driver lnk to quickly assign driver  "Quick Assign Driver" by clicking on Pencil icon
              btn = VSUtil.closestLimited(e.target,'.lnk-assign-driver');
              if(btn){
                  if(!AuthManager.allowed(221)) return;
                  let tr = btn.closest('tr');
                  console.log(tr);
                  mThis.assignDriver(tr,btn);
                  return;
              }
                
            //Click on Delete Order: Dropdown menu item
            btn = VSUtil.getElementByClass(e.target,'_pl_pa_delete');
            if(btn){
                if (!AuthManager.allowed(229)) return;
                let tr = btn.closest('tr');
                mThis.deleteOrder(tr); 
                return;
            }

            //Click on Arrive button
            btn = VSUtil.getElementByClass(e.target,'_pl_pa_receive');
            if(btn){
                let shipment_tr = btn.closest('tr');
                cv_interact.confirm('ទទួលទំនិញទាំងអស់ក្នុងបញ្ជាមួយនេះ?',{'context':"update"},e =>{
                     if(e){
                        if (mThis.shm_prev_editing_row) {
                            mThis.saveItem(mThis.shm_prev_editing_row, null, (success) => {
                                if (success){
                                    mThis.receiveItems_all(shipment_tr, null);
                                }
                            });
                        }
                        else mThis.receiveItems_all(shipment_tr, null);
                     }
                });
                return;
            }

            //Click on Save item
            btn = VSUtil.getElementByClass(e.target,'pkl_btn_save');
            if(btn){
                let tr = btn.closest('tr');
                mThis.saveItem(tr, btn,(e) =>{
                    if(e){
                        btn.closest('div.edit-actions').remove();
                    }
                });
                return;
            }

             //Click on Delete item
             btn = VSUtil.getElementByClass(e.target,'pkl_btn_delete');
             if(btn){
                 let tr = btn.closest('tr');
                 mThis.deleteItem(tr);
                 return;
             }

             //Click on Delete item
             btn = VSUtil.getElementByClass(e.target,'pkl_btn_cancel_edit');
             if(btn){
                 let tr = btn.closest('tr');
                 mThis.setItemReadOnly(tr, true, null);
                 return;
             }

             //Click on map_link
             btn = VSUtil.getElementByClass(e.target,'lnk_map_link');
             if (btn){
                 const href = btn.getAttribute('href');
                 window.open(href,'_blank');
                 return;
             }

             btn = VSUtil.getElementByClass(e.target,'pkl_btn_edit');
             if (btn){
                 const tr = btn.closest('tr');
                 mThis.beginEditItem(tr,null,btn);
                 return;
             }
             
             btn = VSUtil.getElementByClass(e.target,'pkl_btn_print_barcode');
             if (btn){
                 const tr = btn.closest('tr');
                 let barcode = tr.dataset.barcode;
                 window.open([main_view.base_url, '/package_barcode/', barcode ? barcode : 'unknown'].join(''), '_blank');
                 return;
             }
 
            //  const clickOnElement = e.target.tagName;
            //  if (['TR','TD'].indexOf(clickOnElement) >= 0){
            //     mThis.showQuickButtons(VSUtil.closestLimited(e.target,'tr.order'));
            //  }
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
                mThis.listView.showPage(mThis.getFitlerData());
            }, 250);
        });

        mThis.btnSearch.on('click', function(){
            mThis.listView.showPage(mThis.getFitlerData());
        });

        mThis.initAlready = true;
    }

    this.getFitlerData = () => {
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
        mThis.loadFilterData(() => {
            mThis.listView.showPage(mThis.getFitlerData(),null,() => {
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
    this.createDropdownMenuHtml_pickup = function (supplier_id, pricelist_id, supplier_name ,status) {
        let html = [
            '<div class="dropdown-menu bg-white shadow" data-id="', supplier_id, '" data-pricelistid="', pricelist_id, '" data-suppliername="', supplier_name, '">',
            // '<a class="dropdown-item _pl_pa_assign_driver" href="javascript:void(0)"><i class="fa fa-biking" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '"></i> Assign Driver (Pickup)</a>',
            `<a href="javascript:void(0)" class="dropdown-item btn-set-price-list border-bottom pb-2" data-id="${supplier_id}" data-pricelistid="${pricelist_id}" data-suppliername="${supplier_name}" data-status="${status}">
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
    this.self = main_view.appContent.find('#_sdl_dlgSupplier');
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.find('#_sdl_dlgSupplierTitle');
    this.btnSave =  this.self.find('#_sdl_supplier_btnSave');
    // this.elSenderType =  this.self.find('#_sdl_sender_sendertype');
    // this.elBusinessType =  this.self.find('#_sdl_sender_businesstype');
    this.elSalesAgent =  this.self.find('#_sdl_sales_agent');

    this.elPriceList =  this.self.find('#_sdl_price_list');
    // this.elCOD =  this.self.find('#_sdl_cod');
    // this.elCODFee =  this.self.find('#_sdl_cod_fee');
    this.divPhoto = this.self[0].querySelector('#_supplier_profile_photo');

    this.onClose = null;
    this.elError =  this.self.find('#_sdl_sender_error');

    this.body =  this.self.find('.modal-body')[0];
    this.div_sender_info =  this.body.querySelector('#div_merchant_info');
    // this.div_bank_account = this.body.querySelector('#div_bank_account');
    mThis.imgBox = new ImageBox(mThis.divPhoto,{
        "dataField":"photo",
        "cssClass":"data-input ",
        containerClass:null,
        // onDeleteImage:()=>{
        //   alert('Deleting image');
        //   return false;
        // },
        "onLoadImage":(photo) =>{
            let p = {"id":mThis.options.id,"supplier_id":mThis.options.id,"photo":photo};
            // console.log(p);
            if(!p.id) return; 
            vsapi.call(`${main_view.base_url}/abm/os_suppliers/save-profile-picture`,p,null,null,false).then(res =>{
                if(res.status_code ===200){
                    mThis.imgBox.setImage(photo);
                    cv_interact.success('Photo has been saved');
                }else cv_interact.error(res.error_message);
            });
        },
        "deleteAPI":{
            "endPoint":`${main_view.base_url}/dms/sales-app/agent/delete-profile-picture`,
            "params":()=>{
                return {"id": mThis.options.id,"sales_agent_id":mThis.options.id}
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
            VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', def.price_list_id);
            VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', def.sales_agent_id);
            onFinish(d);
        });
    }

    this.btnSave.on('click', function(e){
        e.preventDefault();
        let p = mThis.getData();
        vsapi.call(`${mThis.base_url}/abm/os_suppliers/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.show = (options) => {
        // console.log(options);
        if (!options) options = {};
        mThis.options = options;
         
        mThis.prepareData(mThis.options.id,{},data => { 
            if(data.supplier){
                mThis.elTitle.text("Modify Supplier Information");
            }
            else{
                mThis.elTitle.text("Create Supplier");
            }
            mThis.setData(data.supplier);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }

    this.setData = (d) => {
        mThis.body.querySelectorAll('.data-input').forEach(el =>{
            el.value = null;
        });
        if(!d) return;

        // let bank_accounts = d.bank_accounts;
        // d.bank_accounts = null;
        mThis.div_sender_info.querySelectorAll('.data-input').forEach(el =>{ 
            const data_member = el.dataset.field;
            if(el.tagName.toLowerCase() === 'select'){
                el.value = d[data_member];
                let event = new Event('change',{
                    bubbles: true,
                    cancelable: true
                });
                el.dispatchEvent(event);
            }
            else{
                el.value = d[data_member];
            }
        });

        // let i = 0, c = null;
        // do{
        //     c = bank_accounts[i];
        //     if(!c) break;
        //     let css_class = 'primary_bank_panel';
        //     if(c.is_primary == 0) css_class = 'secondary_bank_panel';
        //     let div = mThis.body.querySelector('div.'+css_class);
        //     div.dataset.id = c.id;
        //     div.querySelectorAll('.data-input').forEach(el => {
        //         let dataMember = el.dataset.field;
        //         el.value = c[dataMember];
        //     });
        //     i++;
        // }while(c);
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