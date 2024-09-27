'use strict';
    var CustomersComponent = new function () {
    const mThis = this;
    this.title_prop = "Customers";

    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_main_customersComponent');
    this.self = this.jm[0];

    this.elFilter_customer_type = this.self.querySelector('#_cul_filter_customer_type');
    this.elFilter_customer_status = this.self.querySelector('#_cul_filter_customer_status');
    this.btnNewCustomer = this.self.querySelector('#_cul_btnNew');
    this.elSearch = this.self.querySelector('#_cul_search_customer');
    //this.btnPrint = this.self.querySelector('#_cul_btnPrint');
    this.div_filter_fields = this.self.querySelector('#_cus_filter_fields');
    this.form_data = {};
    this.store_agents = {};

        /** Hide or show element with class $target_class when user puts mouse over tr or td with class $td_class */
        function setInstanceVisible(tr, td_class, target_class) {
            if (!tr) return;

            const td = td_class ? tr.querySelector(`td.${td_class}`) : null;
            const target = tr.querySelector(`.${target_class}`);

            if (!target) return;

            const showTarget = () => {
                target.style.visibility = 'visible';
            };

            const hideTarget = () => {
                target.style.visibility = 'hidden';
            };

            if (td) {
                td.addEventListener('mouseenter', showTarget);
                td.addEventListener('mouseleave', hideTarget);
            } else {
                tr.addEventListener('mouseenter', showTarget);
                tr.addEventListener('mouseleave', hideTarget);
            }
        }

        this.setCustomerPriceList = (id,tr) => {
            mThis.getPriceListItems((items) => {
                items.unshift({
                    id: null,
                    name: 'Select price list'
                });
                let customer_name = tr.dataset.customername;
                let pl_list_id = tr.dataset.pricelistid;
                let option = {
                    title: `Set price list for ${customer_name ? customer_name : 'Customer'}`,
                    dataLabel: "Price list name",
                    valueMember: "id",
                    textMember: "name",
                    blankErrorMessage: "Please a price list",
                    data: items,
                    defaultValue: pl_list_id
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
                                if(tr) tr.dataset.pricelistid = d.price_list_id;
                                InputBox2.close();
                                cv_interact.success('Customer Price list ' + d.list_name + ' has been assigned');
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
                         '<i class="fa-solid fa-list" style="color:#08391A;font-size:1.5em"></i>',
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
                    return [`<img class="image-student-tbl ml-3" src="${image}" alt=""/>`,'<p class="d-flex text- mb-0 p-1 ms-2 ">',(data.code || 'N/A'),'</p>',].join('');
                    //'<div class="d-flex p-1 ms-3 "><span class="d-block p-1  text-primary">',data.name,'</span></div>']
                }
            },
            {
                title: "Name",
                className: "align-middle text-capitalize",
                data: (data, index, tr) => {
                    return ['<div class="d-flex flex-column" >',
                                '<span class="sender-name">', (data.name || 'គ្មាន'), '</span>',
                                '<div class="d-flex flex-row gap-2">',
                                    '<i class="fa-solid text-success fa-user"></i>',
                                    '<span class="text-">', data.sender_type || 'Normal', '</span>',
                                '</div>',
                            '</div>'].join('');
                }

            },
            {
                title: "Contact",
                className: "align-middle text-nowrap",
                data: (data, index, tr) => {
                    return ['<div class="d-flex gap-2"><i class="fas fa-phone text-primary mt-1"></i><span class="">', data.phone_number, '</span></div>','<div class="d-flex gap-2" ><i class="fas text-success fa-envelope mt-1"></i><span class="text- sender-name">', (data.email || 'គ្មាន'),
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
                    let edit_pl_list = `<a style="visibility:hidden" href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="lnk_set_price_list text-danger"><i class="fa-solid fa-pencil"></i></a>`;
                    const sender_info = ['<div class="d-flex gap-2">','<span class="text-">',(data.price_list_name || 'មិនទាន់មាន'), '</span>',edit_pl_list,'</div>'].join('');
                    return sender_info;
                },
                title: 'price list '
            },
            {
                title: "Last Updated",
                className: 'align-middle text-capitalize',
                data: (data, index, tr) => {
                    return ['<span class=" sender-name d-block p-0 " >', data.update_user, '</span>', '<span class="d-block p-0 text-muted"><small>', data.update_date, '</small></span>'].join('');
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

        this.editCustomer = (customer_id, lnk)=>{
            if(!AuthManager.allowed(303,false))
                return ;
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

        this.setPriceList = (customer_id,lnk)=>{
            let tr = VSUtil.closestLimited(lnk,'tr');
            mThis.setCustomerPriceList(customer_id, tr);
        }

        this.deleteCustomer = (customer_id, lnk)=>{
            if (lnk) {
                if(!AuthManager.allowed(301,false))
                return ;
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
                    html:'<span class="ps-2 " vslang="titles.Set Price List">Set Price List</span>',
                    icon:`<i class="fa-regular fa-list-alt fs-5 text-success"></i>`,

                    cssClass:"border-bottom pb-2",
                    name:"set_price_list"
                    },
                    {
                    html:'<span class="ps-2  " vslang="titles.Modify Customer">Modify Customer</span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_customer"
                    },
                    {
                    html:'<span class="ps-2  " vslang="titles.Delete Customer">Delete Customer</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_customer"
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
                            mThis.setPriceList(id,menuLink); // NOT yet defined
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
                    tr.dataset.customername = data.name;
                    tr.dataset.statuscode = data.status_code;
                    mThis.store_agents[data.id] = {
                        code: data.code,
                        name: data.name,
                        user_id: data.user_id,
                        phone_number: data.phone_number
                    };
                   setInstanceVisible(tr,'price_list_name','lnk_set_price_list');
                },
                'beforeRender': () => { }
            });

            mThis.btnNewCustomer.onclick = (e) =>{
                e.preventDefault();
                // console.log('a',AuthManager.allowed(302));
                if(!AuthManager.allowed(302))
                return ;
                let op = {
                    'id': null,
                    'onClose': (d) => {
                        mThis.customerListView.showPage(mThis.getFilterData());
                    }
                };
                CustomerDialog.show(op);
            };

            mThis.tblCustomers = mThis.customerListView.getTable();
            mThis.initDropdownMenus(mThis.tblCustomers);
            console.log(12,mThis.tblCustomers);

            mThis.tblCustomers.onclick = e=>{
                e.preventDefault();
                let lnk = VSUtil.closestLimited(e.target,'.lnk_set_price_list');
                if(lnk){
                     let id = lnk.dataset.id;
                     mThis.setPriceList(id,lnk);
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

            mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.customerListView.showPage(mThis.getFilterData());
                }
            });

            mThis.elSearch.addEventListener('keyup', function (e) {
                e.preventDefault();
                clearTimeout(mThis.search_timeout);
                mThis.search_timeout = setTimeout(() => {
                    mThis.customerListView.showPage(mThis.getFilterData());
                }, 250);
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
            console.log('check user info : ', AuthManager.user);
            mThis.init(); // NOTE: init once only based on mThis.initAlready = true or false
            mThis.options = options;
            main_view.setTitle(mThis.title_prop);
            mThis.loadFilterData(() => {
                mThis.customerListView.showPage(mThis.getFilterData(), null, () => {
                    mThis.jm.siblings().hide();
                    mThis.jm.hide().fadeIn(250);
                });
            });
        }

        this.changeSenderStatus = () => {
            return;
        }

    };


    const CustomerDialog = new function () {
        const mThis = this;
        this.jm = main_view.appContent.find('#_cul_dlgCustomer');
        this.self = this.jm[0];
        this.modal = new bootstrap.Modal(this.self);
        this.base_url = main_view.base_url;
        this.options = {};

        this.elTitle = this.self.querySelector('#_cul_dlgCustomerTitle');
        this.btnSave = this.self.querySelector('#_cul_dlgCustomer_btnSave');

        this.elBusinessType = this.self.querySelector('#_cul_business_type');
        //this.elSalesAgent = this.self.querySelector('#_cul_sales_agent');
        this.elPriceList = this.self.querySelector('#_cul_price_list');
        this.elCustomerType = this.self.querySelector('#_cul_sender_type');
        this.elPrimary_cp = this.self.querySelector('#_primary_cp_id');
        this.elSecondary_cp = this.self.querySelector('#_secondary_cp_id');

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
                let p = {"id": mThis.options.id,"id":mThis.options.id,"photo":photo};
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
                    return {"id":mThis.options.id}
                }
            }
        });
        this.prepreFormOptions = (op,onFinish)=>{
            let p = {'id': op.id || op.customer_id};
            vsapi.call([main_view.base_url,'/abm/customers/form-options'].join(''),p,false,false,false).then(res=>{
                let d = res.status_code ==200? res.data :{};
                let customer = StringSanitizer.sanitizeObject(d.customer,null,['email','address','image_url','photo']);
                VSUtil.setComboItems(mThis.elBusinessType,d.business_types,'business_type','business_type',true,'(select)',null);
                VSUtil.setComboItems(mThis.elCustomerType,d.customer_types,'id','customer_type',true,'(select)',null);
                VSUtil.setComboItems(mThis.elPrimary_cp,d.primary_cp,'id','primary_cp_name',true,'(select)',null);
                VSUtil.setComboItems(mThis.elSecondary_cp,d.secondary_cp,'id','secondary_cp_name',true,'(select)',null);
                VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'price_list_name', true, '(Price List)', null);

                d.customer = customer;
                onFinish(d);
            });
        }

        // this.prepareData = (id, def, onFinish) => {
        //     if (!def) def = {};
        //     vsapi.call(`${mThis.base_url}/abm/customers/form-options`, { id: id }, null).then(res => {
        //         let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
        //         //VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No Sales Agent)', def.sales_agent_id);set
        //         VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
        //         VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'price_list', true, '(Price List)', def.price_list_id);
        //         VSUtil.setComboItems(mThis.elCustomerType, d.sender_types, 'id', 'sender_type', true, '(Customer Type)', def.sender_type_id);
        //         mThis.form_data = d;
        //         onFinish(d);
        //     });
        // }
        this.btnSave.onclick = e => {
            e.preventDefault();
            let p = mThis.getData();
            vsapi.call(`${mThis.base_url}/abm/customers/save`, p,mThis.btnSave).then(res => {
                if (res.status_code === 200) {
                    mThis.modal.hide();
                    if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

                    // mThis.options.onClose(p);
                }
                else
                    cv_interact.error(res.error_message);
            });
        };



        this.show = (options)=>{
            mThis.options = options || {};
            mThis.prepreFormOptions(options, (d)=>{
                let title = LocaleManager? LocaleManager.trans('New Customer','titles'): 'New Customer';
                if(d.customer) title = LocaleManager? LocaleManager.trans('Modify Customer','titles'): 'Modify Customer';
                mThis.elTitle.innerHTML = title;
                mThis.setData(d.customer);
                mThis.modal.show();
            });
        }


        this.setData = (d) => {
            d = d || {};
            mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
                const data_member = el.dataset.field;
                el.value = d[data_member] ?? '';
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
            p.id = mThis.options.id || mThis.options.customer_id;
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


