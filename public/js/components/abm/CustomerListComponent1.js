'use strict';
var CustomerListComponent = new function(){
    const mThis = this;
    this.title_prop = "Customers";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_customerListComponent');
    this.elFilter_customer_status = mThis.self.find('#_cuslist_filter_customer_status');
    this.elFilter_customer_business_type = mThis.self.find('#_cuslist_filter_business_type');

    this.div_filter_fields = mThis.self.find('#_cuslist_filter_fields')[0];
    this.btnNewCustomer = mThis.self.find('#_cuslist__btnNewCustomer');
    this.elSearch = mThis.self.find('#_cuslist_Search');
    this.btnSearch = mThis.self.find('#_cuslist_btnSearch');
    this.btnPrint = mThis.self.find('#_cuslist_btnPrint');
    this.btnPDF = mThis.self.find('#_cuslist_btnPDF');

   


    this.setMerchantPriceList = (sender_id,name=null,span=null,def_price_list_id=null) => {
        mThis.getPriceListItems((items)=>{
            // console.log();
            items.unshift({
                id: null,
                name: 'Select price list'
            });

            let option = {
                title: `Set Price List for ${name ? name : 'Customer'}`,
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
                        sender_id: sender_id,
                        price_list_id: d.value
                    };

                    vsapi.call(`${mThis.base_url}/api/merchant/set-price-list`,p,null).then(res => {
                        if(res.status_code === 200){
                            let d = StringSanitizer.sanitizeObject(res.data);
                            span.textContent =d.list_name; 
                            //InputBox2.hide(); 
                            
                            //mThis.listView.showPage(mThis.getFilterData());
                
                            cv_interact.success('Price list ' + d.list_name + ' has been assigned to the customer successfully');
                            
                        }
                        else
                            cv_interact.error(res.error_message); 
                    });
                    
                }
                return;
                
            });
    
            
        });
    }
 
    this.renderCustomers = (container, data) => {
       // console.log(data);
        let html = '';
        let cnt = 0;
        container.style.display = 'none';
        mThis.store_customers = {};
        (data || []).map(item => {
            mThis.store_customers[item.id] = {
                code: item.code,
                name: item.name,
                phone_number: item.phone_number
            };
           // let bank_account_html = `<span class="fw-semibold text-danger">គ្មាន</span>`;
            let created_by = `<span class="d-block fw-sembold">${item.create_user}</span>
            <span class="d-block">
                <small>${item.created_at}</small>
            </span>`;

            // (item.bank_accounts || []).map(ac => {
            //     if(ac.is_primary == 1 || !item.bank_accounts[1])
            //         bank_account_html = `<span class="fw-semibold">${ac.bank_name}/${ac.account_number}</span>
            //         <span> /${ac.account_name}</span`;
            // });

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
                mobile_login = [`<span class="p-2 text-danger">គ្មាន</span>`
                // ,`<span>
                //     <a href="javascript:void(0)" data-id="${item.id}" class="btn-app-login btn btn-sm btn-outline-primary">
                //         <i class="la la-mobile fs-4"></i> 
                //         <span>Create</span>
                //     </a>
                //  </span>`
               ].join('');
            }

            let price_list_html = item.price_list_name ? `<span class="merchant-price-list ">${item.price_list_name}</span>` : [`គ្មាន`
             ,`<a href="javascript:void(0)" data-id="${item.id}" data-merchantname="${item.name}" class="set-price-list">
                <i class="fa fa-edit fs-5"></i>
              </a>`
           ].join('');

            html = [html,`<div class="d-flex p-3 bg-white h-info-student shadow-lg mb-3">

                <div class="div-img" data-id="${item.id}" data-imageurl="${item.image_url}"></div>
                    <div class="d-block  ms-3 w-100">
                        <div class="row row-cols-3 mb-0">
                            <div class="col ml-5">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.ID"></p>
                                    <p class="px-3">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap  data-get" data-field="official_id">${item.id}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                    <p class="px-3">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap   data-get" data-field="full_name">${item.name}</p>
                                </div>

                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Email"></p>
                                    <p class="px-3">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap "><a href="javascript:void(0)">${item.email ? item.email : 'គ្មាន'}</a></p>
                                </div>
                       
                            </div>

                            <div class="col ml-5">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Customer Type"></p>
                                    <p class="px-4">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap ">${item.sender_type}</p>
                                </div>
                          
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Business Type"></p>
                                    <p class="px-4">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap ">${item.business_type ? item.business_type : 'N/A'}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Phone Number"></p>
                                    <p class="px-4">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap  data-get" data-field="phone_number" >${item.phone_number}</p>
                                </div>
                            </div>

                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Price List"></p>
                                    <p class="px-4">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap">${price_list_html}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Referred By"></p>
                                    <p class="px-2">:</p>
                                    <p style="color: #8DC63F;" class="text-nowrap"><a href="javascript:void(0)" data-referrerid ="${item.referrer_id}">${item.referrer_name ? item.referrer_name : 'គ្មាន'}</a></p>
                                </div>
                            </div>


                            <div class="col m-3">
                                <div class="d-flex align-items-start  justify-content-end gap-2">
                                    <button style="background-color: #8DC63F;" class="btn btn-sm  rounded-3 btn-options position-relative text-nowrap" type="button">
                                        <span class="text-nowrap text-white  trans-text" data-langprop="buttons.Options"></span>
                                            <i class="fa-solid text-success fa-caret-down ps-2"></i>
                                        <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">
                                            <a href="javascript:void(0)" class="btn-customer-edit border-bottom pb-2" data-id="${item.id}" >
                                                <i class="fa-regular fa-pen-to-square fs-5 text-success"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Modify Customer"></span>
                                            </a>

                                            <a href="javascript:void(0)" class="btn-set-price-list border-bottom pb-2" data-id="${item.id}" data-pricelistid="${item.price_list_id}" data-merchantname="${item.name}" data-status="${item.status_code}">
                                                <i class="fa-regular fa-list-alt fs-5 text-warning"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Set Price List"></span>
                                            </a>

                                            <a href="javascript:void(0)" class="btn-customer-delete border-bottom pb-2" data-id="${item.id}" data-status="${item.status_code}">
                                                <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Delete Customer"></span>
                                            </a>
                                        
                                            <a href="javascript:void(0)" class="btn-customer-status border-bottom pb-2" data-id="${item.id}" data-status="${item.status_code}">
                                                <i class="fa-regular fa-circle-stop fs-5 text-primary"></i>
                                                <span class="ps-2 trans-text" data-langprop="titles.Change Status"></span>
                                            </a>
                                            
                                        </div>
                                    </button>
                                </div>

                                <div class="d-flex justify-content-end align-items-center h-100">
                                    <div class="d-block mb-3 position-relative">
                                        <a href="javascript:void(0)" class="lnk-customer-status ${status_class}" data-id="${item.id}" data-status="${item.status_code}">${item.status_code}</a>  
                                    </div>
                                </div>
                        </div>

                    </div>

                    <hr class="bg-warning m-1 p-0"/>
                    <div class="row row-cols-5 mt-2">
                        <div class="col ml-5">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Address"></p>
                                <p class="px-1">:</p>
                                <p style="color: #8DC63F;" class="text-nowrap ">${item.address}</p>
                            </div>
                        </div>

                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Created By"></p>
                                <p class="px-2">:</p>
                                <p style="color: #8DC63F;" class="text-nowrap ">${created_by}</p>
                            </div>
                       </div>

                    </div>
                 
                </div>
        </div>`].join('');
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
                        vsapi.call(`${main_view.base_url}/api/merchant/save-profile-picture`,{
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
                        vsapi.call(`${main_view.base_url}/api/merchant/delete-profile-picture`,{
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
        const div =  container.find('.w-options');
        const btn = container.find('.btn-options');
       // console.log(div.length);

        btn.off('click').on('click',function(e){
            e.preventDefault();
            $(this).find('.w-options').toggle('fast');
        });
  
        container.off('click').on('click',e => {
            e.preventDefault();
             
    

           // click on Set Price List
           let lnk = VSUtil.getElementByClass(e.target,'set-price-list');
            if(lnk){
                mThis.setMerchantPriceList(lnk.dataset.id,lnk.dataset.merchantname,lnk.parentElement,null);
                return;
            }
         });

        if(div.length !== 0){
            let prev_div = null;
            $(document).off('click').on('mouseup',function(e){
                e.preventDefault();
                if((!div.is(e.target) && div.has(e.target).length === 0) && prev_div){
                    prev_div.hide('fast');
                }
                else{
                    if((!div.is(e.target) && div.has(e.target).length === 0) && (!btn.is(e.target) && btn.has(e.target).length === 0)){
                        prev_div = div;
                        div.hide('fast');
                    }
                }
            });

            div.off('click').on('click',(e) => {
                e.preventDefault();

                let lnk = VSUtil.getElementByClass(e.target,'btn-customer-edit');
                if(lnk){
                    //const status_code =lnk.dataset.id; 
                    let op = {
                        id: lnk.dataset.id,
                        
                        //status_id: status_id,
                        onClose:()=>{
                            mThis.listView.showPage(mThis.getFilterData());
                        }
                    };
                    CustomerDialog.show(op);                     
                    return;
                }
            
                //Click on Delete Merchant
                lnk = VSUtil.getElementByClass(e.target,'btn-customer-delete');
                if(lnk){
                    const id = lnk.dataset.id;
                    let status_code = lnk.dataset.status;
                    let p = {
                        id: id,
                        status_code: status_code
                    };
                    cv_interact.confirm('Delete this customer?',{
                        title: 'Delete Customer',
                        context: 'delete'
                    },function(e){
                        if(e){
                            vsapi.call(`${mThis.base_url}/api/customer/delete`,{
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
               // console.log(lnk);
                if(lnk){
                    const id = lnk.dataset.id;
                    let pl_id = lnk.dataset.pricelistid;
                    let name = lnk.dataset.merchantname;
                    let span = container.find('.merchant-price-list')[0];
                    mThis.setMerchantPriceList(id,name, span ? span.parentElement : null ,pl_id); 

                    return;
                }
 
               

                //Click on Change Status
                lnk = VSUtil.closestLimited(e.target,'.btn-customer-status');
                if (!lnk) lnk= VSUtil.closestLimited(e.target,'.lnk-lead-status');
                if(lnk){
                    let sender_id = lnk.dataset.id;
                    let status_code = Validator.properCase(lnk.dataset.status);
                    let option = {
                        confirmButtonText:'OK',
                        title: 'Set Customer Status',
                        dataLabel: "Customer Status",
                        valueMember: "status_code",
                        textMember: "name",
                        blankErrorMessage: "Please select a correct status",
                        data:[{
                            status_code: "Active",
                            name: "Active"
                        },
                        {
                            status_code: "Inactive",
                            name: "Inactive"
                        }
                    ],
                        //data: [],
                        defaultValue: status_code
                    };
                    InputBox2.show(option,(d)=>{
                        if(d) {
                            let p = {
                                id: sender_id,
                                status_code: d.value
                            };

                            vsapi.call(`${mThis.base_url}/api/merchant/update-status`,p).then(res => {
                                if(res.status_code === 200){
                                   mThis.elFilter_customer_status.val(d.value).trigger('change');
                                    //mThis.listView.showPage(mThis.getFilterData()); 
                                    const new_status = res.data? `to ${res.data.new_status}`: null;
                                    cv_interact.info([`Customer status has been changed `,d.new_status].join(''));
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
        vsapi.call(`${mThis.base_url}/api/customer/form-options`, null,null,main_view.apiCluster).then(res => {
            let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
           
            VSUtil.setComboItems(mThis.elFilter_customer_status, d.customer_statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
            VSUtil.setComboItems(mThis.elFilter_customer_business_type, d.business_types, 'business_type', 'business_type', true, 'ប្រភេទ​ ទំនិញ (All Business Types)', 0);
            //VSUtil.setComboItems(mThis.elFilter_agent, d.sales_agents, 'id', 'agent_name', true, '(All)', null);
        //VSUtil.setComboItems(CustomerDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
            onFinish();
            mThis.allow_filter = true;
        });
    }
    this.getPriceListItems = (onFinish) => {
        vsapi.call(`${mThis.base_url}/api/getComboItems_price_list`,null,false).then(res => {
            let items = res.status_code ===200? res.data: [];
            onFinish(items); 
        });
    }

    this.initOnce = () => {
        if(mThis.initAlready) return;

        mThis.listView = new ListView('_cuslist_customer_list', {
            fetchApi: `${main_view.base_url}/api/customer/list`,
            apiCluster: main_view.apiCluster,
            perPage: 3,
            renderItems: (items, list_container) => {
                mThis.renderCustomers(list_container, items);
            },
            listContainerClass: null
        });
        mThis.tblCustomers = mThis.listView.getListContainer();

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                if(mThis.allow_filter){
                    mThis.listView.showPage(mThis.getFilterData());
                }
            };
        });

        this.btnNewCustomer.on('click', function(e){
            e.preventDefault();
            let op = {
                id: '',
                onClose: (d) =>{
                    mThis.listView.showPage(mThis.getFilterData());  
                }
            } 
            CustomerDialog.show(op);
        });
       

        mThis.tblCustomers.addEventListener('click', e => {
            e.preventDefault();
            //Click on action button;
            let btn = VSUtil.getElementByClass(e.target, 'btn_sender_action');
            //console.log(btn);
            if(btn){
                return;
            }
        });

        document.addEventListener('click', e => {
            //e.preventDefault();
            if(!mThis.customer_dropdown_menu) return;
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
            search_value: mThis.elSearch.val()
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
            mThis.listView.showPage(mThis.getFilterData(),null,() => {
                mThis.self.siblings().hide();
                mThis.self.hide().fadeIn(300);
            });
        });
    }

    this.hide = () => {
        mThis.self.hide();
    }

    
}

const CustomerDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_cuslist_dlgCustomer');
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.find('.modal-_cuslist_dlgCustomer');
    this.btnSave =  this.self.find('#_cuslist_dlgCustomer_btnSave');
    this.elBusinessType =  this.self.find('#_cuslist_business_type');
    this.elSalesAgent =  this.self.find('#_cuslist_sales_agent');
    this.elPriceList =  this.self.find('#_cuslist_price_list');
    this.elCustomerType = this.self.find('#_cuslist_sender_type') ;
    this.onClose = null;
     this.body =  this.self.find('.modal-body')[0];
    this.div_sender_info =  this.body.querySelector('#div_merchant_info');
    
    // this.body = this.self.find('.modal-body')[0];
  
    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/api/customer/form-options`,{id: id },null).then(res => {
            let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
            VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No Sales Agent)', def.sales_agent_id);
            VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
            VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'price_list', true, '(Price List)', def.price_list_id);
            VSUtil.setComboItems(mThis.elCustomerType,d.sender_types,'id','sender_type',true,'(Customer Type)',def.sender_type_id);
            console.log(d);

            mThis.form_data = d;
            onFinish(d);
        });
    }

    this.btnSave.on('click', function(e){
        e.preventDefault();
        let p = mThis.getData();
        vsapi.call(`${mThis.base_url}/api/customer/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

            }
            else
                cv_interact.error(res.error_message);
        });
     });
      this.setData = (d) => {
        d = d || {};
        console.log(d);
        // mThis.body.querySelectorAll('.data-input').forEach(el =>{
        //     el.value = null;
        // });
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
                el.value = d[data_member]?? '';
            }
        });
  
       
    }

    this.getData = () => {
        let p = {};
        p.id = mThis.options.id;
        mThis.self[0].querySelectorAll('.data-input').forEach(el=>{
            let f = el.dataset.field;
            
            p [f] = el.value;
        });
        
        
        return p;
    }

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
       // console.log('grth');
         
        mThis.prepareData(mThis.options.id,{},data => {
            if(data.sender){
                
                mThis.elTitle.text("Modify Customer");
            }
            else{
                mThis.elTitle.text("Create Customer");
            }
// console.log(data.customer);
            mThis.setData(data.sender);

            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }

  

  
}


 