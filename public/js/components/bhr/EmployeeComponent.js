'use strict';
var EmployeeComponent = new function(){
    const mThis = this;
    this.title_prop = "Employee";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_main_employeeComponent');
    this.self = this.jm[0];
    //this.elFilter_business_type = mThis.self.find('#_sdl_filter_business_type');
    // this.elFilter_employee_status = mThis.self.querySelector('#_sdl_filter_employee_status');
    this.div_filter_fields = mThis.self.querySelector('#_sdl_filter_fields');

    this.btnNewSender = mThis.self.querySelector('#_sdl_btnNewSender');
    this.btnFilter = mThis.self.querySelector('#_sdl_btnFilter');
    this.elSearch = mThis.self.querySelector('#_sdl_search_sender');
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');

    this.form_data = {};
 
    this.renderMerchant = (container, data) => {
        let html = '';
        let cnt = 0;
        container.style.display = 'none';
        mThis.store_senders = {};
        (data || []).map(item => {
            mThis.store_senders[item.id] = {
                code: item.code,
                name: item.name,
                phone_number: item.phone_number
            };
            let bank_account_html = `<span class="fw-semibold text-danger">គ្មាន</span>`;
            let created_by = `<span class="d-block fw-sembold">${item.create_user}</span>
            <pan class="d-block">
                <small>${item.created_at}</small>
            </span>`;

            (item.bank_accounts || []).map(ac => {
                if(ac.is_primary == 1 || !item.bank_accounts[1])
                    bank_account_html = `<span class="fw-semibold d-block">${ac.bank_name} (${ac.account_number})</span>
                    <span>${ac.account_name}</span`;
            });

            let status_class = (item.status_code || '').toLowerCase() === 'active' ? 'text-capitalize p-2 text-center border border-success rounded-5 text-success' : 'text-capitalize p-2 text-center border border-danger rounded-5 text-danger';
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

            // let price_list_html = item.price_list_name ? `<span class="merchant-price-list">${item.price_list_name}</span>` : `គ្មាន <a href="javascript:void(0)" data-id="${item.id}" data-merchantname="${item.name}" class="set-price-list">
            //     <i class="fa fa-pencil"></i>
            // </a>`;

            let price_list_html = [`<span class="merchant-price-list">${item.price_list_name ||'មិនទាន់មាន' }</span>`,`<a href="javascript:void(0)" data-pricelistid="`,item.price_list_id,`"  data-id="${item.id}" data-merchantname="${item.name}" class="set-price-list">
            <i class="fa fa-pencil"></i>
        </a>`].join('');

            html += `<div class="merchant-card d-flex p-3 bg-white h-info-student mb-2" data-id="${item.id}" data-merchantname="${item.name}" data-pricelistid="${item.price_list_id}">
                <div class="div-img" data-id="${item.id}" data-imageurl="${item.image_url}"></div>
                <div class="d-block ms-3 w-100">
                    <div class="row row-cols-3 mb-0">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Merchant ID"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get" data-field="official_id">${item.code}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Name"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get" data-field="full_name">${item.name}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Phone Number"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get" data-field="phone_number">${item.phone_number}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Client Type"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.sender_type}</p>
                           </div>
                        </div>
                        <div class="col">
                           <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Business"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.business_type ? item.business_type : 'NA'}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Price List"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${price_list_html}</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <p class="text-nowrap text-muted   width-bp" vslang="titles.COD"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.cod == 1 ? 'Yes' : 'No'}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-p" vslang="titles.Referred By"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize"><a href="javascript:void(0)" data-referrerid ="${item.referrer_id}">${item.referrer_name ? item.referrer_name : 'គ្មាន'}</a></p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="flex-nowrap text-muted  width-p" vslang="titles.Bank Account"></p>
                                <p class="px-2">:</p>
                                <p class="text-capitalize">${bank_account_html}</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <p class="text-nowrap text-muted   width-bp" vslang="titles.App Account"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${mobile_login}</p>
                            </div>
                        </div>
                        <div class="col position-relative">
                            <div class="d-flex align-items-start justify-content-end gap-2">
                                <button class="btn_merchant_action btn btn-sm btn-danger rounded-3 btn-options position-relative text-nowrap" data-loginname="${item.mobile_login ? item.mobile_login.login_name :''}" data-userid="${item.mobile_login? item.mobile_login.id : ''}" data-id="${item.id}" data-pricelistid="${item.price_list_id}" data-status ="${item.status_code}" type="button">
                                    <span class="text-nowrap  " vslang="buttons.Action"></span>
                                    <i class="fa-solid fa-caret-down ps-2"></i>
                                </button>
                            </div>
                            <div class="d-flex justify-content-end align-items-center h-100">
                                <div class="d-block position-relative">
                                    <span class="${status_class}" data-id="${item.id}" data-status="${item.status_code}">${item.status_code}</span>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="bg-dark m-1 p-0"/>
                    <div class="row row-cols-5 mt-2">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-bp" vslang="titles.Address"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.address ? item.address : 'គ្មាន'}</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted   width-bp" vslang="titles.Created By"></p>
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
                <h5>${LocaleManager.trans('No data to display!','titles')}</h5>
            </div>`;
        }

        container.innerHTML = html;
        const merchant_cards = container.querySelectorAll('.merchant-card');
        mThis.initCardEvents(merchant_cards);
        /** Display profile photos for all displayed merchants */
        mThis.initImageBoxes(merchant_cards);  
        // mThis.initDropdownMenus(merchant_cards);///
        // mThis.jmContainer = mThis.jmContainer || $(container);
        // mThis.setEvents(mThis.jmContainer);
        LocaleManager.translateZone(container,{"hide":true},()=>{
            container.style.display= 'block';
        });
         
        const parent = container.parentElement;
        parent.style.height = (window.innerHeight - 210)+'px';
        parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 210)+'px';
        }
    };


    this.deleteMerchant =(id,lnk)=>{
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
                // vsapi.call(`${mThis.base_url}/dms/merchant/delete`,{
                //     id: id
                // },null).then(res => {
                //     if(res.status_code === 200){
                //         mThis.listView.showPage(mThis.getFitlerData());
                //     }
                //     else
                //         cv_interact.error(res.error_message);
                // });
            }
        });
    }
  
    this.deleteMerchantSpecial = (id,lnk)=>{
        let status_code = lnk.dataset.status;
        let p = {
            id: id,
            status_code: status_code
        };
        let confirm_count = 0;
    
        const confirmDelete = () => {
            cv_interact.confirm([
                'html:Are you sure to delete this merchant <span class="text-danger fw-semibold">permanently?</span>',
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
                        // vsapi.call(`${mThis.base_url}/dms/merchant/delete-special`, {
                        //     id: id
                        // }, null).then(res => {
                        //     if (res.status_code === 200) {
                        //         mThis.listView.showPage(mThis.getFitlerData());
                        //     } else {
                        //         cv_interact.error(res.error_message);
                        //     }
                        // });
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

    mThis.reverseToLead = (id,lnk = null)=>{
        //let status_code = lnk.dataset.status;
        let p = {
            id: id
            //status_code: status_code
        };
        cv_interact.confirm('Are you sure to reverse this client back to be a lead or prospect?',{'context':'update','title':'Reverse To Lead',confirmButtonText:'Reverse Now'},e =>{
             if(e){
                 vsapi.call([main_view.base_url,'/dms/merchant/reverse-to-lead'].join(''),p,null,null).then(res =>{
                     if(res.status_code ==200){
                        cv_interact.success('Now the merchant has been reversed back to be a lead with status "in Review"');
                        mThis.listView.showPage(mThis.getFitlerData());
                     }else cv_interact.error(res.error_message);
                 });
             }
        });
    }
 
    //Set event handlers for some clickable elements on each Merchant Card
    this.initCardEvents = (cards)=>{
       cards.forEach(card =>{
        card.addEventListener('click',e=>{
            e.preventDefault();
             //Click on Set Price List shortcut icon
             let btn = VSUtil.closestLimited(e.target,'a.set-price-list');
             if(btn){
                mThis.setMerchantPriceList(btn.dataset.id,card);
                return;
             }

           }); 
 
       }); 
     
    }

    this.initImageBoxes = (cards)=>{
        //const elements = container.querySelectorAll('.div-img');
        cards.forEach(card =>{
            const divImg = card.querySelector('.div-img');
            if(divImg){
                let imgBox = new ImageBox(divImg,{
                    containerClass:null, 
                    cssClass:"border border-secondary rounded-3",
                    //emptyClass:"border border-secondary rounded-3", 
                    saveAPI:{
                      endPoint:`${main_view.base_url}/dms/merchant/save-profile-picture`,
                      params:(photo)=>{ 
                        return { "id": divImg.dataset.id,"photo":photo}; 
                      } 
                    },
                    deleteAPI:{
                      endPoint:`${main_view.base_url}/dms/merchant/delete-profile-picture`,
                      params:()=>{
                         return {"id": divImg.dataset.id};
                      }
                    },
                    onLoadImage:null,
                    onDeleteImage:null,
                    onImageLoaded:(img)=>{
                       return;
                    }
                });
                 
                imgBox.setImage(divImg.dataset.imageurl);
            }
        });

       
    }

    /** initDropdown menus , merchant's dropdown menus */
    this.initDropdownMenus = (cards)=>{
        mThis.storeMenus = null;
        //let elements = container.querySelectorAll('.btn_merchant_action');
        cards.forEach(card =>{
 
          const actionButton = card.querySelector('.btn_merchant_action'); 
          let storeMenu =  new VSDropdownButton(actionButton,{
             menus:[
                {
                    label:` <i class="fa-regular fa-pen-to-square fs-5"></i><span class="ps-2  " vslang="titles.Modify Merchant"></span>`,
                    name:"edit_merchant"
                },
                {
                    label:'<i class="fa-regular fa-list-alt fs-5"></i><span class="ps-2 menu-text" vslang="titles.Set Price List"></span>',
                    name:"set_price_list"
                },
                {
                    label:' <i class="fa-regular fa-trash-can fs-5 text-warning"></i><span class="ps-2  " vslang="titles.Delete Merchant"></span>',
                    name:"delete_merchant"
                },
                {
                    label:' <i class="fa-regular fa-refresh fs-5 text-warning"></i><span class="ps-2  " vslang="titles.Reverse to Prospect"></span>',
                    name:"reverse_to_lead"
                },
                {
                    label:' <i class="fa-regular fa-trash-can fs-5 text-danger"></i><span class="ps-2  " vslang="titles.Delete Special"></span>',
                    name:'delete_merchant_special'
                },
                {
                    label:'<i class="fa-regular fa-circle-stop fs-5"></i><span class="menu-text ps-2" vslang="titles.Change Status"></span>',
                    name:'set_status'
                },
                {
                    label:'<i class="fa-solid fa-mobile fs-5"></i><span class="menu-text ps-2" vslang="titles.Create App Account"></span>',
                    name:'create_login'
                },
                {
                    label:'<i class="fa fa-times text-danger fs-5"></i><span class="menu-text ps-2  " vslang="titles.Delete Login"></span>',
                    name:'delete_login'
                },
                {
                    label:'<i class="fa fa-key text-primary fs-5"></i><span class="menu-text ps-2" vslang="titles.Change Password"></span>',
                    name:'change_password'
                },
                {
                    label:'<i class="fa fa-user fs-5"></i><span class="menu-text ps-2  " vslang="titles.Change Login Name"></span>',
                    name:'change_login_name'
                }
             ],
             click: (me, action, btn) =>{
                 switch(action){
                    case "edit_merchant":{
                        let op = {
                            id: btn.dataset.id,
                            onClose:()=>{
                                mThis.listView.showPage(mThis.getFitlerData());
                            }
                        };
                        SenderDialog.show(op);
                        break;
                    }
                    case "set_price_list":{
                        let sender_id = btn.dataset.id;
                        // let span = card.querySelector('.merchant-price-list');
                        mThis.setMerchantPriceList(sender_id,card); 
                        break;
                    }
                    case "reverse_to_lead":{
                        mThis.reverseToLead(btn.dataset.id, btn);
                        break;
                    }
                    case "delete_merchant":{
                        mThis.deleteMerchant(btn.dataset.id,btn);
                        break;
                    }
                    case "delete_merchant_special":{
                        mThis.deleteMerchantSpecial(btn.dataset.id,btn);
                        break;
                    }
                    case "set_status":{
                        mThis.setMerchantStatus(btn.dataset.id, btn);
                        break;
                    }
                    case 'delete_login':{
                        mThis.deleteLogin(btn.dataset.id,btn,()=>{
                            let elements = card.querySelectorAll([data-userid]);
                            elements.forEach(el =>{
                                el.dataset.userid = "";
                            });
                            elements = card.querySelectorAll([data-loginname]);
                            elements.forEach(el =>{
                                el.dataset.loginname ="";
                            });
                            
                        });
                        break;
                    }
                   
                    case 'change_password':{
                        let op = {
                            id:btn.dataset.userid,
                            login_name:btn.dataset.loginname,
                            onClose:(p)=>{
                              return;
                            }
                        };
                        if(!op.id){
                            cv_interact.warning('User ID is unepectedly missing!');
                            return;
                        }
                        SetPasswordDialog.show(op); 
                        break;
                    }
                    case 'change_login_name':{
                        let user_id = btn.dataset.userid;
                        let prev_login_name = btn.dataset.loginname;
                        let op = {
                            id : user_id,
                            login_name: prev_login_name,
                            onClose:(p)=>{
                               //NOTE: only if p.login_name is a phone number of merchant, so the search will result correctly 
                               mThis.elSearch.value = p.login_name;
                               mThis.listView.showPage({"search_value":p.login_name});
                               if(!p.login_name){
                                    let elements = card.querySelectorAll('[data-loginname]');
                                      elements.forEach(e =>{
                                      e.dataset.loginname = p.login_name;
                                    });
                               }
                             
                            }
                        }
                        ChangeLoginNameDialog.show(op);
                        break;
                    }
                    default:{
                        break;
                    }
                 }
             },
             onOpen:(me,dataset,dropdownContainer)=>{
                 //let d =dropdownContainer;
                 const menus = me.getMenus();
                 let set_price_menu = menus.set_price_list.querySelector('.menu-text');
                 if (dataset.pricelistid > 0 && set_price_menu){
                    set_price_menu.textContent ='Change Price List';
                 }else set_price_menu.textContent ='Set Price List';
                 
                 menus.create_login.style.display = showIt(!dataset.loginname);
                 menus.delete_login.style.display = showIt(dataset.loginname);
                 menus.change_password.style.display = showIt(dataset.loginname);
                 menus.change_login_name.style.display = showIt(dataset.loginname);
             }

           });

            //This storeMenus object need to be disposed when reload Merchant listView
            mThis.storeMenus = mThis.storeMenus || [];
            mThis.storeMenus.push(storeMenu);
        });

       
    }
  
    //Hide/Show menu Item for Merchant Action Menus
    function showIt(yes){
       if(yes) return 'flex';
       else return 'none'; 
    }

    this.loadFilterData = (onFinish) => {
        mThis.def_filter = mThis.def_filter || {};
        mThis.def_filter.status_code = mThis.def_filter.status_code || 'Active';

        //Do not allow filter to be applied yet. I means that filter SELECT's change event wont refresh the merchant list
        mThis.allow_filter = false;
        // vsapi.call(`${mThis.base_url}/bhr/merchant/form-options`, null,null,main_view.apiCluster).then(res => {
        //     let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
        //     VSUtil.setComboItems(mThis.elFilter_employee_status, d.sender_statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
        //     //VSUtil.setComboItems(mThis.elFilter_business_type, d.business_types, 'business_type', 'business_type', true, '(All Business Types)', 0);
        //     VSUtil.setComboItems(SenderDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
        //     onFinish();
           
        //     (d.sales_agents || []).unshift({"id":-1,"agent_name":"(No Agent)"});
        //     (d.sales_agents || []).unshift({"id":null,"agent_name":"(All Sales Agents)"});

        //     (d.business_types || []).unshift({"code":null,"business_type":"(All Business Types)"});
        //     (d.sender_statuses || []).unshift({"status_code":null,"status_name":"(All Statuses)"});
        //     mThis.form_data = d;
        //     mThis.allow_filter = true;
        // });
    }

    this.getPriceListItems = (onFinish) => {
        //getComboItems_price_list
        // vsapi.call(`${mThis.base_url}/dms/price-list/options-price-list`,null,false).then(res => {
        //     let items = res.status_code ===200? res.data: [];
        //     onFinish(items); 
        // });
    }

    this.initOnce = () => {
        if(mThis.initAlready) return;

        mThis.listView = new ListView('_sdl_employee_list', {
            fetchApi: `${main_view.base_url}/hr/employee/list`,
            apiCluster: main_view.apiCluster,
            perPage: 3,
            renderItems: (items, list_container) => {
                mThis.renderMerchant(list_container, items);
            },
            listContainerClass: null
        });

        mThis.tblSenders = mThis.listView.getListContainer();

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                if(mThis.allow_filter){
                    mThis.listView.showPage(mThis.getFitlerData());
                }
            };
        });

        this.btnFilter.addEventListener('click', e=>{
            const options = {
                "title":"Filter Merchants",
                "filterButton":mThis.btnFilter,
                "fields": {
                    "branch_id": {
                        "label": "Branch",
                        "type": "select",
                        "required": 1,
                        "value_field": "id",
                        "text_field": "branch_name",
                        "data": mThis.form_data.branches,
                        //"defaultValue": mThis.last_filter.branch_id || 1
                    },
                    "status_code": {
                        "label": "Status",
                        "type": "select",
                        "required": 0,
                        "value_field": "status_code",
                        "text_field": "status_name",
                        "data": mThis.form_data.sender_statuses,
                        //"defaultValue": mThis.last_filter.status_code || mThis.elFilter_employee_status.value
                    },
                    "business_type": {
                        "label": "Business Type",
                        "type": "select",
                        "value_field": "code",
                        "text_field": "business_type",
                        "data":mThis.form_data.business_types,
                        //"defaultValue": mThis.last_filter.business_type
                    },
                    "sales_agent_id": {
                        "label": "Referred By",
                        "type": "select",
                        "value_field": "id",
                        "text_field": "agent_name",
                        "data": mThis.form_data.sales_agents,
                        //"defaultValue": mThis.last_filter.sales_agent_id
                    }
                },
                'onClose': d => {
                    //mThis.last_filter = d.data;
                    // mThis.elFilter_employee_status.value =  d.data.status_code;
                    // mThis.elFilter_employee_status.dispatchEvent(new Event('change'));
                }
            };
            DMSFilterDialog.show(options);
        });

        this.btnNewSender.addEventListener('click', function(e){
            e.preventDefault();
            let op = {
                id: null,
                onClose: (d) =>{
                    mThis.listView.showPage(mThis.getFitlerData());  
                }
            }
            // if (mThis.form_data && op.fields){
            //     op.fields['business_type'].data = mThis.form_data.business_types;
            //     op.fields['sales_agent_id'].data = mThis.form_data.sales_agents;
            // } 
            SenderDialog.show(op);
        });

        mThis.elSearch.addEventListener('keyup',(e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.listView.showPage(mThis.getFitlerData());
            }, 200);
        });

        mThis.btnSearch.onclick = e =>{
            mThis.listView.showPage(mThis.getFitlerData());
        };

        mThis.initAlready = true;
    }

    this.getFitlerData = () => {
        // let p = DMSFilterDialog.getData();
        let p={};
        p.search_value = mThis.elSearch.value;
        // p.status_code = mThis.elFilter_employee_status.value;
        let main_filters = mThis.div_filter_fields.querySelectorAll('.filter-field');
        main_filters.forEach(el=>{
            const f= el.dataset.field;
            p[f] = el.value;
            //Remember last selected filter that is the combition between filter fields on SenderListComponent and the filter fields on DMSFilterDialog as well;
            //mThis.last_filter[f] = el.value;
        });
        return p;
    }

    this.show = (option) => {
        mThis.initOnce();
        mThis.option = option;
        main_view.setTitle(mThis.title_prop);
        // mThis.loadFilterData(() => {
            mThis.listView.showPage(mThis.getFitlerData(),null,() => {
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(300);
            });
        // });
    }

    this.hide = () => {
        mThis.self.style.display = 'none';
    }
}

const SenderDialog = new function(){
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#_sdl_dlgSender');
    this.modal = new bootstrap.Modal(this.self);
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.querySelector('#_sdl_dlgSenderTitle');
    this.btnSave =  this.self.querySelector('#_sdl_sender_btnSave');
    this.elSenderType =  this.self.querySelector('#_sdl_sender_sendertype');
    this.elBusinessType =  this.self.querySelector('#_sdl_sender_businesstype');
    this.elSalesAgent =  this.self.querySelector('#_sdl_sales_agent');

    this.elPriceList =  this.self.querySelector('#_sdl_price_list');
    this.elCOD =  this.self.querySelector('#_sdl_cod');
    this.elCODFee =  this.self.querySelector('#_sdl_cod_fee');

    this.onClose = null;
    this.elError =  this.self.querySelector('#_sdl_sender_error');

    this.body =  this.self.querySelector('.modal-body');
    this.div_sender_info =  this.body.querySelector('#div_merchant_info');
    this.div_bank_account = this.body.querySelector('#div_bank_account');

    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        
        // vsapi.call(`${mThis.base_url}/bhr/merchant/form-options`,{
        //     id: id
        // },null).then(res => {
        //     let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
        //     d.bank_accounts = d.bank_accounts || [];
            
        //     VSUtil.setComboItems(mThis.elSenderType, d.sender_types, 'id', 'sender_type', true, '(Select Merchant Type)', def.sender_type_id);
        //     VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
        //     VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', def.price_list_id);
        //     VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(referral)', def.sales_agent_id);

        //     mThis.form_data = d;
        //     onFinish(d);
        // });
    }

    this.btnSave.onclick =  e =>{
        e.preventDefault();
        let p = mThis.getData();
        // vsapi.call(`${mThis.base_url}/dms/merchant/save`, p,mThis.btnSave,false).then(res => {
        //     if(res.status_code === 200){
        //         mThis.modal.hide();
        //         const d = res.data ?? {};
        //         if(d.info_message) cv_interact.info(d.info_message);
        //         if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
        //     }
        //     else
        //         cv_interact.error(res.error_message);
        // });
    };

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
         
        mThis.prepareData(mThis.options.id,{},data => {
            if(data.sender){
                mThis.elTitle.textContent =  "Modify Merchant Information";
            }
            else{
                mThis.elTitle.textContent =  "Create Merchant";
            }
            mThis.setData(data.sender);
            mThis.modal.show({backdrop:true}); 
        });
    }

    this.setData = (d) => {
        d =d ?? {};
        let elements = mThis.body.querySelectorAll('.data-input');
        elements.forEach(el =>{
            el.value = null;
        });
        if(!d) return;

        let bank_accounts = d.bank_accounts;
        d.bank_accounts = null;

        elements = mThis.div_sender_info.querySelectorAll('.data-input');
        elements.forEach(el =>{ 
            const data_member = el.dataset.field;
            if(el.tagName.toLowerCase() === 'select'){
                el.value = d[data_member];
                let event = new Event('change',{
                    bubbles: true,
                    cancelable: true
                });
                el.dispatchEvent(event);
            } else if (el.tagName ==='IMG'){
                el.setAttribute('src',d[f] || '');
            }
            else{
                el.value = d[data_member] || '';
            }
        });

        let i = 0, c = null;
        bank_accounts = bank_accounts ?? [];
        do{
            c = bank_accounts[i];
            if(!c) break;
            let css_class = 'primary_bank_panel';
            if(c.is_primary == 0) css_class = 'secondary_bank_panel';
            let div = mThis.body.querySelector('div.'+css_class);
            div.dataset.id = c.id;
            div.querySelectorAll('.data-input').forEach(el => {
                let dataMember = el.dataset.field;
                el.value = c[dataMember];
            });
            i++;
        }while(c);

        //if (d.id > 0){
            mThis.remember_original_bank_info(d); /** remember original bank account info and will compare this value with the last update values before user click Save button */
        //}
    }

    this.getData = () => {
        let p = {};
        p.id = mThis.options.id;
        mThis.div_sender_info.querySelectorAll('.data-input').forEach(el => {
            let data_member = el.dataset.field;
            p[data_member] = el.value;
        });
        p.banks = mThis.getBanks();
        p.bank_account_changed = (mThis.org_bank_account_info && mThis.org_bank_account_info != mThis.new_bank_account_info);
        p.bank_account_changed =  p.bank_account_changed? 1:0;
        return p;
    }

    /** d is bank_accounts */
    this.remember_original_bank_info = (d) => {
        mThis.org_bank_account_info = null;
        //pernission 285 to change bank account
        let readOnly =true;
        if (!d) readOnly =false;
        else if (AuthManager.allowed(285)) readOnly = false;
        let div = mThis.div_bank_account.querySelector('div.primary_bank_panel');
        div.querySelectorAll('.data-input').forEach(el => {
            mThis.org_bank_account_info = [mThis.org_bank_account_info,el.value].join('');
            el.readOnly = readOnly;
        });
   
        div = mThis.div_bank_account.querySelector('div.secondary_bank_panel');
   
        div.querySelectorAll('.data-input').forEach(el =>{
            mThis.org_bank_account_info = [mThis.org_bank_account_info,el.value].join('');
            el.readOnly = readOnly;
        });
    }

    this.getBanks = () => {
        let ps = [];
        let p = {};
        p.is_primary = 1;
        mThis.new_bank_account_info = null;
        let div = mThis.div_bank_account.querySelector('div.primary_bank_panel');
        div.querySelectorAll('.data-input').forEach(el => {
            let f = el.dataset.field;
            p[f] = el.value;
            mThis.new_bank_account_info = [mThis.new_bank_account_info,el.value].join('');
        });
        p.id = div.dataset.id;
        ps.push(p);

        div = mThis.div_bank_account.querySelector('div.secondary_bank_panel');
        let p1 = {};
        p1.is_primary = 0;
        div.querySelectorAll('.data-input').forEach(el =>{
            let f = el.dataset.field;
            p1[f] = el.value;
            mThis.new_bank_account_info = [mThis.new_bank_account_info,el.value].join('');
        });
        p1.id = div.dataset.id;
        ps.push(p1);
        return ps;
    }
}
