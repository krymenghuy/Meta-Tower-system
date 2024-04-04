'use strict';
var CustomerListComponent = new function(){
    const mThis = this;
    this.title_prop = "Customers";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_customerListComponent');
    this.elFilter_agent = mThis.self.find('#_cuslist_filter_agent');
    //this.elFilter_business_type = mThis.self.find('#_cuslist__filter_business_type');
    this.elFilter_lead_status = mThis.self.find('#_cuslist_filter_customer_status');
    this.div_filter_fields = mThis.self.find('#_cuslist_filter_fields')[0];

    this.btnNewLead = mThis.self.find('#_cuslist__btnNewCustomer');
    this.elSearch = mThis.self.find('#_cuslist_Search');
    this.btnSearch = mThis.self.find('#_cuslist_btnSearch');
    //this.tblLeads = mThis.self.find('#_cuslist__tblLeads');
    //this.tblLeads_body = mThis.self.find('#_cuslist__tblLeads_body');
    //this.lead_dropdown_menu = mThis.tblLeads.find('div.dropdown');

    this.btnPrint = mThis.self.find('#_cuslist_btnPrint');
    this.btnPDF = mThis.self.find('#_cuslist_btnPDF');
 
    this.renderCustomers = (container, data) => {
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
            let bank_account_html = `<span class="fw-semibold text-danger">គ្មាន</span>`;
            let created_by = `<span class="d-block fw-sembold">${item.create_user}</span>
            <pan class="d-block">
                <small>${item.create_date}</small>
            </span>`;

            (item.bank_accounts || []).map(ac => {
                if(ac.is_primary == 1 || !item.bank_accounts[1])
                    bank_account_html = `<span class="fw-semibold">${ac.bank_name}/${ac.account_number}</span>
                    <span> /${ac.account_name}</span`;
            });

            let status_class = mThis.getStatusClass(item.status_id);
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

            let price_list_html = item.price_list_name ? `<span class="merchant-price-list">${item.price_list_name}</span>` : [`គ្មាន`
            //  ,`<a href="javascript:void(0)" data-id="${item.id}" data-merchantname="${item.name}" class="set-price-list">
            //     <i class="fa fa-edit fs-5"></i>
            //   </a>`
           ].join('');

            html = [html,`<div class="d-flex p-3 bg-white h-info-student shadow-lg mb-3">
                <div class="div-img" data-id="${item.id}" data-imageurl="${item.image_url}"></div>
                <div class="d-block ms-3 w-100">
                    <div class="row row-cols-3 mb-0">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Lead ID"></p>
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
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Category"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.category}</p>
                           </div>
                        </div>
                        <div class="col">
                           <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Business"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.business_type ? item.business_type : 'NA'}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Price List"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${price_list_html}</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.COD"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${item.cod == 1 ? 'Yes' : 'No'}</p>
                            </div>`,
                            `<div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Email"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize"><a href="javascript:void(0)">${item.email ? item.email : 'គ្មាន'}</a></p>
                            </div>`,
                        `</div>`,
                        `<div class="col">`,
                            `<div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Referred By"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize"><a href="javascript:void(0)" data-referrerid ="${item.referrer_id}">${item.referrer_name ? item.referrer_name : 'គ្មាន'}</a></p>
                            </div>`,
                            `<div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Bank Account"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${bank_account_html}</p>
                            </div>`,
                            `<div class="d-flex align-items-center">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.App Account"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${mobile_login}</p>
                            </div>`,
                           `<div class="d-flex align-items-center">
    
                           </div>`,
                        `</div>
                        <div class="col">
                            <div class="d-flex align-items-start justify-content-end gap-2">
                                <button class="btn btn-sm btn-danger rounded-3 btn-options position-relative text-nowrap" type="button">
                                    <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                    <i class="fa-solid fa-caret-down ps-2"></i>
                                    <div class="w-options gap-2 shadow p-3 rounded-3" style="display:none">`,
                                        (item.status_id != 5? `<a href="javascript:void(0)" class="btn-lead-edit border-bottom pb-2" data-id="${item.id}" data-statusid ="${item.status_id}">
                                            <i class="fa-regular fa-pen-to-square fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Modify Lead"></span>
                                        </a>` : ''),
                                        // `<a href="javascript:void(0)" class="btn-set-price-list border-bottom pb-2" data-id="${item.id}" data-pricelistid="${item.price_list_id}" data-merchantname="${item.name}" data-statusid="${item.status_id}">
                                        //     <i class="fa-regular fa-list-alt fs-5"></i>
                                        //     <span class="ps-2 trans-text" data-langprop="titles.Set Price List"></span>
                                        // </a>`,
                                        `<a href="javascript:void(0)" class="btn-lead-delete border-bottom pb-2" data-id="${item.id}" data-statusid="${item.status_id}">
                                            <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Delete Lead"></span>
                                        </a>
                                        <a href="javascript:void(0)" class="btn-lead-delete-special border-bottom pb-2" data-id="${item.id}" data-statusid="${item.status_id}">
                                          <i class="fa-regular fa-trash-can fs-5 text-warning"></i>
                                          <span class="ps-2 trans-text" data-langprop="titles.Delete Special"></span>
                                       </a>
                                        <a href="javascript:void(0)" class="btn-lead-status border-bottom pb-2" data-id="${item.id}" data-statusid="${item.status_id}">
                                            <i class="fa-regular fa-circle-stop fs-5"></i>
                                            <span class="ps-2 trans-text" data-langprop="titles.Change Status"></span>
                                        </a>`,
                                        // `<a href="javascript:void(0)" class="btn-create-app-account border-bottom pb-2" data-id="${item.id}">
                                        //     <i class="fa-solid fa-mobile fs-5"></i>
                                        //     <span class="ps-2 trans-text" data-langprop="titles.Create App Account"></span>
                                        // </a>`,
                                    `</div>
                                </button>
                            </div>
                            <div class="d-flex justify-content-end align-items-center h-100">
                                <div class="d-block position-relative">
                                    <a href="javascript:void(0)" class="lnk-lead-status ${status_class}" data-id="${item.id}" data-statusid="${item.status_id}">${item.status}</a>  
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
                    <div class="d-flex flex-row gap-2">`,
                     (item.status_id !=5 ? `<a data-id="${item.id}" data-statusid ="${item.status_id}" href="javascript:void(0)" class="btn-convert-to-merchant btn btn-sm btn-info rounded-3"><span>Convert to merchant</span></a>` : ``), 
                    `</div
                </div>
            </div></div>`].join('');
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
                        vsapi.call(`${main_view.base_url}/api/sales-module/lead/save-profile-picture`,{
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
                        vsapi.call(`${main_view.base_url}/api/sales-module/lead/delete-profile-picture`,{
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
 
            //Click on Convert to merchant
            lnk = VSUtil.closestLimited(e.target,'.btn-convert-to-merchant');
            if(lnk){
                cv_interact.confirm(`Convert this prospect to merchant now?`,{'context':'update',title:'Convert to Merchant','confirmButtonText':'Convert Now'},e =>{
                     if(e){
                         let p = {'id':lnk.dataset.id};
                         vsapi.call(`${main_view.base_url}/api/sales-module/lead/convert-to-merchant`,p,lnk,null).then(res =>{
                             if(res.status_code ==200){
                                 mThis.listView.showPage(mThis.getFitlerData());
                                 cv_interact.success('The prospect has now become a merchant'); 
                             }else cv_interact.warning(res.error_message);
                         });
                     }
                });
                return;
            }

            //click on Set Price List
            lnk = VSUtil.getElementByClass(e.target,'set-price-list');
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

                let lnk = VSUtil.getElementByClass(e.target,'btn-lead-edit');
                if(lnk){
                    const status_id =lnk.dataset.statusid; 
                    let op = {
                        id: lnk.dataset.id,
                        status_id: status_id,
                        onClose:()=>{
                            mThis.listView.showPage(mThis.getFitlerData());
                        }
                    };
                    LeadDialog.show(op);                     
                    return;
                }
            
                //Click on Delete Merchant
                lnk = VSUtil.getElementByClass(e.target,'btn-lead-delete');
                if(lnk){
                    const id = lnk.dataset.id;
                    let status_code = lnk.dataset.status;
                    let p = {
                        id: id,
                        status_code: status_code
                    };
                    cv_interact.confirm('Delete this lead?',{
                        title: 'Delete Lead',
                        context: 'delete'
                    },function(e){
                        if(e){
                            vsapi.call(`${mThis.base_url}/api/sales-module/lead/delete`,{
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
                lnk = VSUtil.closestLimited(e.target, '.btn-lead-delete-special');

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
                            'Are you sure to delete this lead <span class="text-danger fw-semibold">permanently?</span>',
                            '<span class="d-block text-black mt-2">You will need to confirm 7 times before deleting. <span class="d-block fs-4 fw-semibold text-danger">',
                            (confirm_count + 1 ==7? 'This you LAST confirmation!': ['Confirm Count: ',(confirm_count +1)].join('')),
                            '</span></span>'
                        ].join(''), {
                            title: 'Delete Lead Special',
                            context: 'delete'
                        }, e => {
                            if (e) {
                                confirm_count++;
                
                                if (confirm_count === 7) {
                                    vsapi.call(`${mThis.base_url}/api/sales-module/lead/delete-special`, {
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
 
                // //Click on Set Price List
                // lnk = VSUtil.getElementByClass(e.target,'btn-set-price-list');
                // if(lnk){
                //     const id = lnk.dataset.id;
                //     let pl_id = lnk.dataset.pricelistid;
                //     let name = lnk.dataset.merchantname;
                //     let span = container.find('.merchant-price-list')[0];
                //     mThis.setMerchantPriceList(id,name, span ? span.parentElement : null ,pl_id); 
                //     return;
                // }

                //Click on Change Status
                lnk = VSUtil.closestLimited(e.target,'.btn-lead-status');
                if (!lnk) lnk= VSUtil.closestLimited(e.target,'.lnk-lead-status');
                if(lnk){
                    let lead_id = lnk.dataset.id;
                    let status_id = Validator.properCase(lnk.dataset.statusid);
                    let option = {
                        confirmButtonText:'OK',
                        title: 'Set Lead Status',
                        dataLabel: "Status",
                        valueMember: "id",
                        textMember: "status",
                        blankErrorMessage: "Please select a correct status",
                        //data: [],
                        defaultValue: status_id
                    };
                    
                    this.getLeadStatuses().then(statuses => {
                        option.data = statuses;
                        InputBox2.show(option,(d)=>{
                            if(d) {
                                let p = {
                                    id: lead_id,
                                    status_id: d.value
                                };
    
                                vsapi.call(`${mThis.base_url}/api/sales-module/lead/update-status`,p).then(res => {
                                    if(res.status_code === 200){
                                        mThis.elFilter_lead_status.val(d.value).trigger('change');
                                        //mThis.elFilter_sender_status.dispatchEvent(new Event('change'));
                                        const new_status = res.data? `to ${res.data.new_status}`: null;
                                        cv_interact.info([`Lead status has been changed `,d.new_status].join(''));
                                    }
                                    else
                                        cv_interact.error(res.error_message); 
                                });
                            }
                        });
                    });
                    return;
                }

                // //Click on create mobile app account
                // lnk = VSUtil.getElementByClass(e.target,'btn-create-app-account');
                // if(lnk){
                //     mThis.createAppAccount(lnk.dataset.id);
                //     return;
                // }

                //Click on "Delete Special" => Force delete lead information and related data
                lnk = VSUtil.getElementByClass(e.target,'btn-lead-delete-sepcial');
                if(lnk){
                    let op = {
                        id: lnk.dataset.studentid
                    };

                    cv_interact.confirm('You are about to delete this lead permanently. Are you sure to proceed?',{
                        title: 'Delete Lead Permanently',
                        context: 'delete'
                    },(e) => {
                        if(e){
                            vsapi.call(`${main_view.base_url}/api/sales-module/lead/delete-special`,op,null).then(res => {
                                if(res.status_code === 200){
                                    cv_interact.success('The lead has been deleted permanently');
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
 
    this.getStatusClass = (status_id)=>{
        switch(status_id){
             case 2:{
                return 'text-capitalize p-2 text-center border border-warning rounded-5 text-warning';
             }
             case 3:{
                return 'text-capitalize p-2 text-center border border-info rounded-5 text-info';
             }
             case 4:
                return 'text-capitalize p-2 text-center border border-danger rounded-5 text-danger';
             case 5:
                return 'text-capitalize p-2 text-center border border-success rounded-5 text-success';
             case 6:
              return 'text-capitalize p-2 text-center border border-danger rounded-5 text-danger';
             default:
              return 'text-capitalize p-2 text-center border border-success rounded-5 text-success';       
        }
    }

    this.getLeadStatuses = () => {
        if(mThis.form_data.lead_statuses){
            return new Promise((resolve) =>{
                resolve( mThis.form_data.lead_statuses);
            });
        }

        return new Promise((resolve, reject) => {
            vsapi.call(`${main_view.base_url}/api/settings/options-lead-status`, null, false).then(res => {
               if(res.status_code == 200){
                mThis.form_data.lead_statuses = res.data.filter(x =>{
                    return ([2,3,4,6].indexOf(x.id) >= 0 ); 
                 });
                 resolve(mThis.form_data.lead_statuses);
               }else{
                cv_interact.error(res.error_message);
               }
            }).catch(error => {
                cv_interact.error('Failed to load status options');
                reject(error); // Reject with the error
            });
        });
    }
 
    this.loadFilterData = (onFinish) => {
        mThis.def_filter = mThis.def_filter || {};
        mThis.def_filter.status_code = mThis.def_filter.status_code || 'Active';

        //Do not allow filter to be applied yet. I means that filter SELECT's change event wont refresh the merchant list
        mThis.allow_filter = false;
        vsapi.call(`${mThis.base_url}/api/sales-module/lead/form-options`, null,null,main_view.apiCluster).then(res => {
            let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
            d.lead_statuses = d.lead_statuses.filter(x =>{
                return ([2,3,4,5,6].indexOf(x.id) >=0) ;
            });
            VSUtil.setComboItems(mThis.elFilter_lead_status, d.lead_statuses, 'id', 'status', true, '(All Statuses)', mThis.def_filter.status_id);
            //VSUtil.setComboItems(mThis.elFilter_business_type, d.business_types, 'business_type', 'business_type', true, '(All Business Types)', 0);
            VSUtil.setComboItems(mThis.elFilter_agent, d.sales_agents, 'id', 'agent_name', true, '(All)', null);
            //VSUtil.setComboItems(LeadDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
            mThis.form_data = d;
            onFinish();
            mThis.allow_filter = true;
        });
    }

    // this.getPriceListItems = (onFinish) => {
    //     vsapi.call(`${mThis.base_url}/api/getComboItems_price_list`,null,false).then(res => {
    //         let items = res.status_code ===200? res.data: [];
    //         onFinish(items); 
    //     });
    // }

    this.initOnce = () => {
        if(mThis.initAlready) return;

        mThis.listView = new ListView('_cuslist_customer_list', {
            fetchApi: `${main_view.base_url}/api/customers/list`,
            apiCluster: main_view.apiCluster,
            perPage: 3,
            renderItems: (items, list_container) => {
                mThis.renderCustomers(list_container, items);
            },
            listContainerClass: null
        });

        mThis.tblLeads = mThis.listView.getListContainer();

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                if(mThis.allow_filter){
                    mThis.listView.showPage(mThis.getFitlerData());
                }
            };
        });

        this.btnNewLead.on('click', function(e){
            e.preventDefault();
            let op = {
                id: null,
                onClose: (d) =>{
                    mThis.listView.showPage(mThis.getFitlerData());  
                }
            } 
            LeadDialog.show(op);
        });

        mThis.tblLeads.addEventListener('click', e => {
            e.preventDefault();
            //Click on action button;
            let btn = VSUtil.getElementByClass(e.target, 'btn_lead_action');
            if(btn){
                return;
            }
        });

        document.addEventListener('click', e => {
            //e.preventDefault();
            if(!mThis.lead_dropdown_menu) return;
            let container = mThis.lead_dropdown_menu.parent();
            if(container){
                if(!container.is(e.target) && container.has(e.target).length === 0){
                    mThis.lead_dropdown_menu.removeClass('show');
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
            mThis.listView.showPage(mThis.getFitlerData(),null,() => {
                mThis.self.siblings().hide();
                mThis.self.hide().fadeIn(300);
            });
        });
    }

    this.hide = () => {
        mThis.self.hide();
    }

    this.changeLeadStatus = () => {
        return;
    }
}

const LeadDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_cuslist_dlgCustomer');
    this.base_url = main_view.base_url;
    this.options = {};
    
    this.elTitle = this.self.find('.modal-title');
    this.btnSave =  this.self.find('#_cuslist__dlgLead_btnSave');
    this.elCategory =  this.self.find('#_cuslist__category');
    this.elBusinessType =  this.self.find('#_cuslist__lead_businesstype');
    this.elSalesAgent =  this.self.find('#_cuslist__sales_agent');

    this.elPriceList =  this.self.find('#_cuslist__price_list');
    this.elCOD =  this.self.find('#_cuslist__cod');
    this.elCODFee =  this.self.find('#_cuslist__cod_fee');
    this.onClose = null;
    
    this.body = this.self.find('.modal-body')[0];
  
    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/api/sales-module/lead/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
            VSUtil.setComboItems(mThis.elCategory, d.categories, 'id', 'category', true, '(Select Category)', def.category_id);
            VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No Sales Agent)', def.sales_agent_id);
            VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
            //VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', def.price_list_id);
            mThis.form_data = d;
            onFinish(d);
        });
    }

    this.btnSave.on('click', function(e){
        e.preventDefault();
        let p = mThis.getData();
        console.log(p);
        vsapi.call(`${mThis.base_url}/api/sales-module/lead/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
         
        mThis.prepareData(mThis.options.id,{},data => {
            if(data.sender){
                mThis.elTitle.text("Modify Lead Information");
            }
            else{
                mThis.elTitle.text("Create Lead");
            }
            mThis.setData(data.lead);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }

    this.setData = (d) => {
        d = d || {};
        mThis.body.querySelectorAll('.data-input').forEach(el =>{
            el.value = null;
        });

  
        mThis.setBankAccountInfo(d.bank_account_info);
    }

    this.getData = () => {
        let p = {
            "status_id":mThis.options.status_id
        };
        if(!p.status_id || p.status_id ==1){
            //cv_interact.info('It seems the status ID is invalid, so the default status "In Review" will be used instead');
            // return null;
            p.status_id =2;
        }

        p.id = mThis.options.id;
       
        
        return p;
    }

  
}
 