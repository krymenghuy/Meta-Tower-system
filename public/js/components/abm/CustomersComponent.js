'use strict';


    var CustomersComponent = new function () {
    const mThis = this;
    this.title_prop = "Customers";

    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_customersComponent')[0];

    this.elFilter_customer_type = this.self.querySelector('#_cul_filter_customer_type');
    this.elFilter_customer_status = this.self.querySelector('#_cul_filter_customer_status');
    this.btnNewCustomer = this.self.querySelector('#_cul_btnNew');
    this.elSearch = this.self.querySelector('#_cul_search_customer');
    this.btnSearch = this.self.querySelector('#_cul_btnSearch');
    this.btnPrint = this.self.querySelector('#_cul_btnPrint');
    this.div_filter_fields = this.self.querySelector('#_cus_filter_fields');
    this.form_data = {};
    this.store_agents = {};
 
        this.setCustomerPriceList = (id,name=null,span=null,def_price_list_id=null, lnk = null) => {
            mThis.getPriceListItems((items) => {
                items.unshift({
                    id: null,
                    name: 'Select price list'
                });
                let option = {
                    title: `Set price list for ${name ? name : 'Customer'}`,
                    dataLabel: "Price list name",
                    valueMember: "id",
                    textMember: "name",
                    blankErrorMessage: "Please a price list",
                    data: items,
                    defaultValue: def_price_list_id
                };
                InputBox2.show(option, (d) => {
                    if (d) {
                        let p = {
                            id: id,
                            price_list_id: d.value
                        };
                        vsapi.call(`${mThis.base_url}/abm/customers/set-price-list`, p, null).then(res => {
                            if (res.status_code == 200) {
                                let d = StringSanitizer.sanitizeObject(res.data);
                                // span.textContent = d.list_name;
                                mThis.customerListView.showPage(mThis.getFilterData());
                                if (lnk){
                                     const tr = lnk.closest('tr');
                                     if(tr) tr.dataset.pricelistid = d.price_list_id;
                                     lnk.dataset.pricelistid = d.price_list_id;
                                }
                                InputBox2.close();
                                cv_interact.success('Price list ' + d.list_name + ' has been assigned to the customer successfully');
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
                data:(data, index, tr)=> {
                    let html = ['<div class="d-flex gap-2 flex-wrap">',
                        '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-name="', data.name, '"data-status="', data.status_code, '" class="btn_customer_action">',
                         '<i class="fa-solid fa-list" style="color:#8DC63F;font-size:1.5em"></i>',
                        '</a>',
                        '</div>'].join('');
                    return html;
                },
            },
            {
                title: "Photo",
                className: ' align-middle',
                data: (data, index, tr) => {
                    let image = data.image_url ? data.image_url : '';
                    return [`<img class="image-student-tbl" src="${image}" alt=""/>`,'<p class="d-flex text-success p-1 ms-2 ">',(data.code || 'N/A'),'</p>',].join('');
                    //'<div class="d-flex p-1 ms-3 "><span class="d-block p-1  text-primary">',data.name,'</span></div>']
                }
            },
            {
                title: "Name",
                className: "align-middle text-capitalize text-nowrap",
                data: (data, index, tr) => {
                    return ['<div class="d-flex p-1" ><span class=" sender-name d-block p-1">', (data.name || 'គ្មាន'), '</span></div>',
                        '<div class="d-flex p-1"><i class="fa-solid p-2 text-warning fa-user"></i><span class=" sender-name d-block p-1 text-success">', data.sender_type || 'Normal', '</span></div>'].join('');

                }

            },
            {
                title: "Contact",
                className: "align-middle text-nowrap",
                data: (data, index, tr) => {
                    return ['<div class="d-flex p-1"><i class="fas text-danger  fa-phone p-2"></i><span class="  sender-name d-block p-1 ">', data.phone_number, '</span></div>','<div class="d-flex p-2" ><i class="fas p-2 fa-envelope"></i><span class=" sender-name d-block p-1">', (data.email || 'គ្មាន'),
                        '</span></div>'].join('');
                }
            },
            {
                title: "Business Type",
                className: 'align-middle text-capitalize',
                data: (data, index, tr) => {
                    return ['<span class=" sender-name d-block text-nowrap">', (data.business_type ? data.business_type : 'ផ្សេងៗ'), '</span>'].join('');
                }
            },
            // {
            //     title: "Sale Agent",
            //     className: 'align-middle text-capitalize',
            //     data: (data, index, tr) => {
            //         return ['<span class=" sender-name d-block text-nowrap">', (data.referrer_name ? data.referrer_name : 'ផ្សេងៗ'), '</span>'].join('');
            //     }
            // },
            {
                className: "price_list_name align-middle",
                data: (data, index, tr) => {
                    let price_list_html = data.price_list_name ? `<span class="customer-price-list">${data.price_list_name}</span>` : `គ្មាន <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="lnk_set_price_list text-danger"><i class="fa-solid fa-pencil"></i></a>`;
                    const sender_info = ['<span class="sender- text-primary d-block">', price_list_html, '</span>'].join('');
                    return sender_info;
                },
                title: 'price list '
            },
            {
                title: "Create By",
                className: 'align-middle text-capitalize',
                data: (data, index, tr) => {
                    return ['<span class=" sender-name d-block p-1 " >', data.create_user, '</span>', '<span class="d-block p-1 text-muted"><small>', data.created_at, '</small></span>'].join('');
                }
            },
            {
                className: 'status align-middle',
                data: function (data, index, tr) {
                    const cls_class = (data.status_code || '').toLowerCase() === 'active' ? 'border-success text-success text-center' : 'border-danger text-danger text-center';
                    const status_code = data.status_code ? VSUtil.properCase(data.status_code) : 'Inactive';
                    return ['<a class="d-block" data-status="', status_code, '" data-id="', data.id, `" href="javascript:void(0)"><span style="display:block;width:80px;"  class="border rounded-5 p-2  ${cls_class} ">`, status_code, '</span></a>'].join('');
                },
                title: 'Status'
            },
            
        ];
        this.chooseImage = (div) => {
            div.onclick = function(e){
                e.preventDefault();
                e.stopPropagation();
                const img = VSUtil.getElementByClass(e.target,'image-student-tbl');
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
                const html = `<img class="data-get"  src="${image}" alt="" data-field="photo"/>
                <div class="d-flex-hover position-absolute top-0 end-0 p-2 rounded-3 bg-dark">
                    <a href="javascript:void(0)" class="img-cus-delete">
                        <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                    </a>
                </div>`;
                div.innerHTML = html;
                mThis.setImageDeleteEvent(div);
            }
            else{
                const html = `<div class="img-cus-show border rounded-3 h-100 w-100 d-flex align-items-center justify-content-center" role="button">
                    <i class="fa-regular fa-image fs-3 text-muted"></i>
                </div>`;
                div.innerHTML = html;
                mThis.chooseImage(div);
            }
        }
    
        this.setImageDeleteEvent = (div) => {
            let lnk = div.querySelector('.img-cus-delete');
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

        this.editCustomer = (customer_id, lnk)=>{
            
            // alert('Edit customer'); 
            if (lnk) {
                let op = {
                    id: customer_id,
                    onClose: () => {
                        mThis.customerListView.showPage(mThis.getFilterData());
                    }
                };
                CustomerDialog.show(op);
                return;
            }
          //todo: Write code to show dialog to edit customer
        }
        
        this.setPriceList = (customer_id, customer_name,  default_price_list_id, lnk = null)=>{
            // const id = lnk.dataset.id;
            // let pl_id = lnk.dataset.pricelistid;
            customer_name = customer_name || (lnk? lnk.dataset.name: null);
            // let span = lnk.find('.customer-price-list')[0];
            mThis.setCustomerPriceList(customer_id, name, null, default_price_list_id);
        }

        this.deleteCustomer = (customer_id, lnk)=>{
            if (lnk) {
                const id = lnk.dataset.id;
                let status_code = lnk.dataset.status;
                let p = {
                    id: id,
                    status_code: status_code
                };
                cv_interact.confirm('Delete this customer?', {
                    title: 'Delete Customer',
                    context: 'delete'
                }, function (e) {
                    if (e) {
                        vsapi.call(`${mThis.base_url}/abm/customers/delete`, {
                            id: id
                        }, null).then(res => {
                            if (res.status_code === 200) {
                                mThis.customerListView.showPage(mThis.getFilterData());
                            }
                            else
                                cv_interact.error(res.error_message);
                        });
                    }
                });
                return;
            }
        }

        this.initDropdownMenus = (table)=>{
            const menuOptopns = {
                containerElement: table,
                actionButtonClass:"btn_customer_action",
                cssClass:"bg-white shadow",
                //menuItemClass:"",
                menus:[
                    {
                    //text:"",
                    html:'<span class="ps-2 trans-text" data-langprop="titles.Set Price List">Set Price List</span>',
                    icon:`<i class="fa-regular fa-list-alt fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"set_price_list"
                    },
                    {
                    html:'<span class="ps-2 trans-text" data-langprop="titles.Modify Customer">Modify Customer</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_customer"
                    },
                    {
                        html:'<span class="ps-2 trans-text" data-langprop="titles.Delete Customer">Delete Customer</span>',
                        icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                        cssClass:"border-bottom pb-2",
                        name:"delete_customer"
                    }
                        
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
                            let customer_name = menuLink.dataset.customername;
                            let def_price_list_id = menuLink.dataset.pricelistid;
                            mThis.setPriceList(id, customer_name,def_price_list_id, menuLink); // NOT yet defined
                            break;
                        }
                        case 'edit_customer':{
                          mThis.editCustomer(id, menuLink); //Not yet defined
                          break;
                        }
                        case 'delete_customer':{
                            mThis.deleteCustomer(id, menuLink); //Not yet defined
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
    

        this.setEvents = (container) => {

            const div = container.find('.table');
            const btn = container.find('.btn-options');

            btn.off('click').on('click', function (e) {
                e.preventDefault();
                $(this).find('.w-options').toggle('fast');
            });

            container.off('click').on('click', e => {
                e.preventDefault();
            });

            if (container.length !== 0) {
                container.off('click').on('click', (e) => {
                    e.preventDefault();
                    let lnk = VSUtil.getElementByClass(e.target, 'btn-customer-edit');
                    if (lnk) {
                        console.log(lnk);
                        let op = {
                            id: lnk.dataset.id,
                            onClose: () => {
                                mThis.customerListView.showPage(mThis.getFilterData());
                            }
                        };
                        CustomerDialog.show(op);
                        return;
                    }
                    // Click on Set Price List
                    lnk = VSUtil.getElementByClass(e.target, 'btn-set-price-list');
                    console.log("hello");
                    if (lnk) {
                        const id = lnk.dataset.id;
                        let pl_id = lnk.dataset.pricelistid;
                        let name = lnk.dataset.name;
                        let span = container.find('.customer-price-list')[0];
                        mThis.setCustomerPriceList(id, name, span ? span.parentElement : null, pl_id);
                        return;
                    }
                    //Click on Delete Merchant
                    lnk = VSUtil.getElementByClass(e.target, 'btn-customer-delete');
                    if (lnk) {
                        const id = lnk.dataset.id;
                        let status_code = lnk.dataset.status;
                        let p = {
                            id: id,
                            status_code: status_code
                        };
                        cv_interact.confirm('Delete this customer?', {
                            title: 'Delete Customer',
                            context: 'delete'
                        }, function (e) {
                            if (e) {
                                vsapi.call(`${mThis.base_url}/abm/customers/delete`, {
                                    id: id
                                }, null).then(res => {
                                    if (res.status_code === 200) {
                                        mThis.customerListView.showPage(mThis.getFilterData());
                                    }
                                    else
                                        cv_interact.error(res.error_message);
                                });
                            }
                        });
                        return;
                    }

                    //Click on Set Price List
                    lnk = VSUtil.getElementByClass(e.target, 'set-price-list');
                    if (lnk) {
                        const id = lnk.dataset.id;
                        let pl_id = lnk.dataset.pricelistid;
                        let name = lnk.dataset.name;
                        let span = container.find('.customer-price-list')[0];
                        mThis.setCustomerPriceList(id, name, span ? span.parentElement : null, pl_id);
                        return;
                    }
                    //Click on Change Status
                    lnk = VSUtil.getElementByClass(e.target, 'btn-customer-status');
                    if (lnk) {
                        let id = lnk.dataset.id;
                        let status_code = Validator.properCase(lnk.dataset.status);
                        console.log(status_code);
                        let option = {
                            title: 'Set Customer Status',
                            dataLabel: "Customer status",
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

                        InputBox2.show(option, (d) => {
                            if (d) {
                                let p = {
                                    id: id,
                                    status_code: d.value
                                };

                                vsapi.call(`${mThis.base_url}/dms/merchant/update-status`, p).then(res => {
                                    if (res.status_code === 200) {
                                        //mThis.elFilter_customer_status.val(d.value).trigger('change');
                                        mThis.customerListView.showPage(mThis.getFilterData());
                                        cv_interact.success('The status has been updated');

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
            mThis.def_filter.status_code = 'Active';
            mThis.allow_filter = false;

            vsapi.call([mThis.base_url, '/abm/customers/form-options'].join(''), { 'id': null }, null, main_view.apiCluster).then(res => {
                let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
                VSUtil.setComboItems(mThis.elFilter_customer_status, d.customer_statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
                onFinish();
                (d.customer_statuses || []).unshift({ "status_code": null, "status_name": "(All Statuses)" });
                mThis.form_data = d;
                mThis.allow_filter = true;

            });
        }
      

        this.init = () => {
            if (mThis.initAlready) return;
            mThis.customerListView = new ListView('_cul_customer_list', {
                'fetchApi': `${main_view.base_url}/abm/customers/list`,
                'columns': mThis.cols,
                'apiCluster': main_view.apiCluster,
                'tableClass': "table header-light-blue header-uppercase",
                'rowCreated': (data, index, tr) => {
                    tr.dataset.id = data.id;
                    tr.dataset.pricelistid = data.price_list_id;
                    mThis.store_agents[data.id] = {
                        code: data.code,
                        name: data.name,
                        user_id: data.user_id,
                        phone_number: data.phone_number
                    };
                },
                'beforeRender': () => { }
            });
              
            mThis.btnNewCustomer.addEventListener('click', function (e) {
                e.preventDefault();
                let op = {
                    'id': null,
                    'onClose': (d) => {
                        mThis.customerListView.showPage(mThis.getFilterData());
                    }
                };
                CustomerDialog.show(op);
            });
            
            mThis.tblCustomers = mThis.customerListView.getTable();
            mThis.initDropdownMenus(mThis.tblCustomers);
            // mThis.setEvents($(mThis.tblCustomers));
            mThis.tblCustomers.onclick = e=>{
                e.preventDefault();
                let lnk = VSUtil.closestLimited(e.target,'.lnk_set_price_list');
                if(lnk){
                     let id = lnk.dataset.id;
                     let cust_name = lnk.dataset.customername;
                     let def_price_list_id = lnk.closest('tr').dataset.pricelistid;
                     mThis.setPriceList(id,cust_name,def_price_list_id,lnk);
                     return;
                }
            } 
            this.sh_container = mThis.customerListView.getListContainer();

            const sh_parent = mThis.sh_container.parentElement;
            sh_parent.style.height = (window.innerHeight - 190) + 'px';
            sh_parent.classList.add('overflow-y-auto');
            window.onresize = () => {
                sh_parent.style.height = (window.innerHeight - 190) + 'px';
            }
            // mThis.tblCustomers.addEventListener('click', e => {
            //     e.preventDefault();
            //     // Click on Pickup Action button | drop down action
            //     let btn = VSUtil.closestLimited(e.target, '.btn_pickup_action');
            //     if (btn) {
            //         let p = btn.parentElement;
            //         let id = btn.dataset.id;
            //         let pricelist_id = btn.dataset.pricelistid;
            //         let name = btn.dataset.name;
            //         let status_code = btn.dataset.status;
            //        console.log(id, pricelist_id, name, status_code);
            //         let dropdownMenu = p.querySelector('.dropdown-menu');
            //         if (!dropdownMenu || dropdownMenu.length === 0) {
            //             p.insertAdjacentHTML('afterbegin', mThis.createDropdownMenuHtml_pickup(id, pricelist_id, name, status_code));
            //             dropdownMenu = p.querySelector('.dropdown-menu');
            //             //dropdownMenu.setAttribute('style', ` left: -130px;`);
            //         }

            //         if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
            //             mThis.prev_dropdownMenu.classList.remove('show');
            //         }
            //         dropdownMenu.classList.toggle('show');
            //         if (dropdownMenu.classList.contains('show')) {
            //             mThis.prev_dropdownMenu = dropdownMenu;
            //         }
            //         return;
            //     }
            // });
            mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.customerListView.showPage(mThis.getFilterData());
                }
            });
            
            mThis.elSearch.addEventListener('keyup',  (e) => {
                e.preventDefault();
                clearTimeout(mThis.search_timeout);
                mThis.search_timeout = setTimeout(() => {
                    mThis.customerListView.showPage(mThis.getFilterData());
                }, 250);
            });
            mThis.btnSearch.addEventListener('click', function (e) {
                e.preventDefault();
                mThis.customerListView.showPage(mThis.getFilterData());
            });

            mThis.initAlready = true;
        }
        //END: CustomerComponent.init() 


        this.getFilterData = () => {
            let p = {};
            mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
                let f = el.dataset.field;
                p[f] = el.value;
            });
            p.search_value = mThis.elSearch.value;
            return p;
        }
        this.getPriceListItems = (onFinish) => {
            vsapi.call(`${mThis.base_url}/abm/getComboItems_price_list`, null, false).then(res => {
                let items = res.status_code === 200 ? res.data : [];
                onFinish(items);
            });
        }
        this.show = (options = {}) => {
            mThis.init(); // NOTE: init once only based on mThis.initAlready = true or false
            mThis.options = options;
            main_view.setTitle(mThis.title_prop);
            mThis.loadFilterData(() => {
                mThis.customerListView.showPage(mThis.getFilterData(), null, () => {
                    mThis.jm = mThis.jm || $(mThis.self);
                    mThis.jm.siblings().hide();
                    mThis.jm.hide().fadeIn(250);
                });
            });
        }
        this.hide = () => {
            mThis.self.hide();
        }
        this.changeSenderStatus = () => {
            return;
        }
  
        // this.createDropdownMenuHtml_pickup = function (id, pricelist_id, name, status) {
        //     let html = [
        //         '<div class="dropdown-menu bg-white shadow"  data-id="', id, '" data-pricelistid="', pricelist_id, '" data-name="', name, '">',
        //         // '<a class="dropdown-item _pl_pa_assign_driver" href="javascript:void(0)"><i class="fa fa-biking" data-orderid="', shipment_id, '"priceli data-senderid="', sender_id, '" data-statusid="', status_id, '"></i> Assign Driver (Pickup)</a>',
        //         `<a href="javascript:void(0)" class="dropdown-item btn-set-price-list border-bottom pb-2" data-id="${id}" data-pricelistid="${pricelist_id}" data-name="${name}" data-status="${status}">
        //             <i class="fa-regular fa-list-alt fs-5"></i>
        //             <span class="ps-2 trans-text" data-langprop="titles.Set Price List">Set Price List</span>
        //         </a>`,
        //         `<a href="javascript:void(0)" class="dropdown-item btn-customer-edit border-bottom pb-2" data-id="${id}" >
        //             <i class="fa-regular fa-pen-to-square fs-5 text-success"></i>
        //             <span class="ps-2 trans-text" data-langprop="titles.Modify Customer">Modify Customer</span>
        //         </a>`,
        //         `<a href="javascript:void(0)" class="dropdown-item btn-customer-delete border-bottom pb-2" data-id="${id}" data-status="${status}">
        //             <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
        //             <span class="ps-2 trans-text" data-langprop="titles.Delete Customer">Delete Customer</span>
        //         </a>`,
        //         `<a href="javascript:void(0)" class="dropdown-item btn-customer-status border-bottom pb-2" data-id="${id}" data-status="${status}">
        //             <i class="fa-regular fa-circle-stop fs-5 text-primary"></i>
        //             <span class="ps-2 trans-text" data-langprop="titles.Change Status">Change Status</span>
        //         </a>`,
        //         // '<a class="dropdown-item _pl_pa_change_driver" href="javascript:void(0)"><i class="fa fa-user"></i> Change Driver (Pickup)</a>',
        //         '</div>'].join('');
        //     return html;
        // };

    };
    
    const CustomerDialog = new function () {
        const mThis = this;
        this.self = main_view.appContent.find('#_cul_dlgCustomer')[0];
        this.modal = new bootstrap.Modal(this.self);
        this.base_url = main_view.base_url;
        this.options = {};
        
        this.elTitle = this.self.querySelector('#_cul_dlgCustomerTitle');
        this.btnSave = this.self.querySelector('#_cul_dlgCustomer_btnSave');
    
        this.elBusinessType = this.self.querySelector('#_cul_business_type');
        //this.elSalesAgent = this.self.find('#_cul_sales_agent');
        this.elPriceList = this.self.querySelector('#_cul_price_list');
        this.elCustomerType = this.self.querySelector('#_cul_sender_type');
    
        this.onClose = null;
        this.body = this.self.querySelector('.modal-body');
        this.divPhoto = this.self.querySelector('#_customer_profile_photo');
    
        this.div_sender_info = this.body.querySelector('#_cul_dlgCustomer_body');
    
        mThis.imgBox = new ImageBox(mThis.divPhoto,{
            "dataField":"photo",
            "cssClass":"data-input border border-success ",
            containerClass:null,
            // onDeleteImage:()=>{
            //   alert('Deleting image');
            //   return false;
            // },
            "onLoadImage":(photo) =>{
                let p = {"id":mThis.options.id,"id":mThis.options.id,"photo":photo};
                if(!p.id) return; 
                vsapi.call(`${main_view.base_url}/abm/customers/save-profile-picture`,p,null,null,false).then(res =>{
                    if(res.status_code ===200){
                        mThis.imgBox.setImage(photo);
                        //cv_interact.success('Photo has been saved');
                    }else cv_interact.error(res.error_message);
                });
            },
            "deleteAPI":{
                "endPoint":`${main_view.base_url}/abm/customers/delete-profile-picture`,
                "params":()=>{
                    return {"id": mThis.options.id,"id":mThis.options.id}
                }
            }
        });
        
        this.prepareData = (id, def, onFinish) => {
            if (!def) def = {};
            vsapi.call(`${mThis.base_url}/abm/customers/form-options`, { id: id }, null).then(res => {
                let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
                //VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No Sales Agent)', def.sales_agent_id);
                VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
                VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'price_list', true, '(Price List)', def.price_list_id);
                VSUtil.setComboItems(mThis.elCustomerType, d.sender_types, 'id', 'sender_type', true, '(Customer Type)', def.sender_type_id);
                mThis.form_data = d;
                onFinish(d);
            });
        }
        this.btnSave.onclick = e => {
            e.preventDefault();
            let p = mThis.getData();
            vsapi.call(`${mThis.base_url}/abm/customers/save`, p).then(res => {
                if (res.status_code === 200) {
                    mThis.modal.hide();
                    if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
                }
                else
                    cv_interact.error(res.error_message);
            });
        };
      
       
        // this.show = (options) => {
        //     if (!options) options = {};
        //     mThis.options = options;
        //     mThis.prepareData(mThis.options.id, {}, data => {
        //         if (data.sender) {
    
        //             mThis.elTitle.text("Modify Customer");
        //         }
        //         else {
        //             mThis.elTitle.text("Create Customer");
        //         }
        //         mThis.setData(data.sender);
        //         mThis.self.modal({
        //             backdrop: 'static'
        //         });
        //     });
        // }
        this.show = (options)=>{
            mThis.options = options || {};
            mThis.elTitle.innerHTML = options.title;
            if (mThis.options.id > 0) {
                mThis.elTitle.innerHTML = "Customers Details";
                let p = {'id':mThis.options.id};
                vsapi.call([main_view.base_url,'/abm/customers/form-options'].join(''),p,null).then(res=>{
                    
                    if(res.status_code === 200){
                        let d = res.data.sender;
                     
                        d = StringSanitizer.sanitizeObject(d,null,['email','address','image_url','photo']);
                        mThis.prepareData(d, {}, data => {
                            mThis.setData(d);
                            mThis.modal.show();
                        });
                    }
                });
            }
            else{
                mThis.elTitle.innerHTML =  "New Customers";
                mThis.prepareData({'id':1},{},data =>{
                    mThis.setData(null);
                    mThis.modal.show();    
                });
            }
        }
    

        this.setData = (d) => {
            // mThis.body.querySelectorAll('.data-input').forEach(el => {
            //     el.value = null;
            // });
            // if (!d) return;
            d = d || {};
            mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
                const data_member = el.dataset.field;
                el.value = d[data_member] ?? '';
                // console.log(d[]);

                if (el.tagName.toLowerCase() === 'select') {
                    el.dispatchEvent(new Event('change'));
                }else if(el.tagName ==='IMG'){
                    el.setAttribute('src',d[data_member] || '');
                }
                    
               
            });
        mThis.imgBox.setImage(d.photo || d.image_url);

        }
        this.getData = () => {
            let p = {};
            p.id = mThis.options.id;
            mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
                let data_member = el.dataset.field;
                if (el.tagName === 'IMG')
                    p[data_member] = el.getAttribute('src');
                else
                    p[data_member] = el.value;
            });
            return p;
        }
       
    }


