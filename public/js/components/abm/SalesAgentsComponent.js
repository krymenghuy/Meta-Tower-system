'use strict';

var SalesAgentsComponent = new function () {
    const mThis = this;
    this.title_prop = "Sales Agents";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_salesAgentsComponent');
    this.elFilter_sale_agent_type = this.self[0].querySelector('#_sale_agent_filter_type');
    this.elFilter_sale_agent_status = this.self[0].querySelector('#_sale_agent_filter_status');

    this.btnNewSalesAgents = this.self.find('#_sale_agent_btnNew');
    this.elSearch = this.self.find('#_sale_agent_search');
    this.btnSearch = this.self.find('#_sale_agent_btnSearch');
    this.btnPrint = this.self.find('#_sale_agent_btnPrint');

    this.div_filter_fields = this.self[0].querySelector('#_sdl_filter_fields');
    this.form_data={};
    this.store_agents = {};

    this.displaySalesAgents = (container, data) =>{
        let html = '';
        let cnt = 0;
        container.style.display = 'none';
        mThis.store_agents = {};
        (data || []).map(item => {
            mThis.store_agents[item.id] = {
                code: item.code,
                name: item.name,
                phone_number: item.phone_number
            };
           
            let status_class = (item.status_code +'').toLowerCase() === 'active' ? 'text-capitalize p-2 text-center border border-success rounded-5 text-success' : 'text-capitalize p-2 text-center border border-danger rounded-5 text-danger';

           

            html = [html,`<div class="d-flex p-3 bg-secondary h-info-student  mb-3">
                <div class="div-img" data-id="${item.id}" data-imageurl="${item.image_url}"></div>
                    <div class="d-block  ms-3 w-100">
                        <div class="row text-uppercase row-cols-3 mb-0">
                            <div class="col ">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.ID"></p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-danger  data-get" data-field="official_id">${item.code}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize   data-get" data-field="full_name">${item.name}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Gender"></p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-capitalize   data-get" data-field="full_name">${item.sex ? item.sex :'??'}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Phone"></p>
                                    <p class="px-3">:</p>
                                    <p class="text-nowrap text-primary  data-get" data-field="phone_number" >${item.phone_number}</p>
                                </div>
                            </div>

                            <div class="col ">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Position"></p>
                                    <p class="px-4">:</p>
                                    <p class="text-nowrap text-capitalize">${item.position_title ? item.position_title : 'N/A'}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Email"></p>
                                    <p class="px-4">:</p>
                                    <p class="text-nowrap text-lowercase ">${item.email ? item.email : 'គ្មាន'}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Agent Type"></p>
                                    <p class="px-4">:</p>
                                    <p class="text-nowrap text-capitalize ">${item.agent_type}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.StartDate"></p>
                                    <p class="px-4">:</p>
                                    <p text-capitalize class="text-primary">${item.start_date ? item.start_date : 'គ្មាន'}</p>
                                </div>
                            </div>

                            <div class="col ">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Address"></p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${item.address}</p>
                                </div>
                                <div class="d-flex">

                                    <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Created By"></p>
                                    <p class="px-2">:</p>
                                    <p  class="text-nowrap text-capitalize ">${item.create_user}</p>
                                </div>
                               
                            </div>
                            <div class="col">
                            <div class="d-flex align-items-start  justify-content-end gap-2">
                            <button class="btn btn-sm bg-warning  rounded-3 btn-options position-relative text-nowrap" type="button">
                                <span class="text-nowrap text-white  trans-text" data-langprop="buttons.Options"></span>
                                <i class="fa-solid text-success fa-caret-down ps-2"></i>
                                <div class=" w-options  gap-2 shadow p-3 rounded-3"  style="display:none" data-id="${item.agent_id}" data-name="${item.agent_name}">
                                    
                                    <a href="javascript:void(0)" class="dropdown-item btn-agent-edit border-bottom pb-2" data-id="${item.agent_id}" >
                                        <i class="fa-regular fa-pen-to-square fs-5 text-success"></i>
                                        <span class="ps-2 trans-text" data-langprop="titles.Modify Supplier">Modify Supplier</span>
                                    </a>
                                    <a href="javascript:void(0)" class="dropdown-item btn-agent-delete border-bottom pb-2" data-id="${item.agent_id}" data-status="${item.status}">
                                        <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                                        <span class="ps-2 trans-text" data-langprop="titles.Delete">Delete</span>
                                    </a>  
                                    <a href="javascript:void(0)" class="dropdown-item btn-agent-status border-bottom pb-2" data-id="${item.agent_id}" data-status="${item.status}">
                                        <i class="fa-regular fa-circle-stop fs-5 text-primary"></i>
                                        <span class="ps-2 trans-text" data-langprop="titles.Change Status">Change Status</span>
                                    </a>
                                </div>
                            </button>
                        </div>
                            </div>
                        </div>
                            
                    <hr class="bg-success m-1 p-0"/>
                    <div class="row row-cols-5 mt-2">
                        <div class="col ml-5">
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
                        vsapi.call(`${main_view.base_url}/api/customer/save-profile-picture`,{
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
            <div class="d-flex-hover position-absolute top-0 end-0 p-2 rounded-3 bg-danger">
                <a href="javascript:void(0)" class="img-sdl-delete">
                    <i class="fa-regular fa-trash-can fs-5 text-white"></i>
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
                        vsapi.call(`${main_view.base_url}/api/customer/delete-profile-picture`,{
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
  

    this.loadFilterData = (onFinish) => {
        mThis.def_filter = mThis.def_filter || {};
        mThis.def_filter.status_code = mThis.def_filter.status_code || 'Active';

        //Do not allow filter to be applied yet. I means that filter SELECT's change event wont refresh the merchant list
        mThis.allow_filter = false;
        vsapi.call(`${mThis.base_url}/abm/os-sales-agents/form-options`, null,null,main_view.apiCluster).then(res => {
            let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
            VSUtil.setComboItems(mThis.elFilter_sale_agent_status, d.statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
            VSUtil.setComboItems(mThis.elFilter_sale_agent_type, d.agent_types, 'id', 'agent_type', true, '(All Agent Types)', 0);
            // VSUtil.setComboItems(SupplierDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
            onFinish();
            mThis.allow_filter = true;
        });
    }


    this.init= () => {
        if(mThis.initAlready) return;

        mThis.salesAgentsListView = new ListView('_sale_agent_list',{
            'fetchApi':`${main_view.base_url}/abm/os-sales-agents/list`,
            'apiCluster':main_view.apiCluster,
            // 'columns': mThis.cols,
            // 'tableClass':"table header-light-blue header-uppercase",
            perPage:10,

           
            renderItems: (items, list_container) => {
                // console.log(items);
                mThis.displaySalesAgents(list_container, items);
            },
            listContainerClass: null

        });
        mThis.tblSalesAgents = mThis.salesAgentsListView.getListContainer();
        
        // mThis.setEvents($(mThis.container));
        // // console.log(mThis.container.parentElement); 
        // const sh_parent = mThis.container.parentElement;
        //     sh_parent.style.height = (window.innerHeight - 190)+'px';
        //     sh_parent.classList.add('overflow-y-auto');
        //     window.onresize = () => {
        //         sh_parent.style.height = (window.innerHeight - 200)+'px';
        // }
        
        this.btnNewSalesAgents.on('click',function(e){
            let op = {
                'id':null,
                'onClose':(d)=>{
                    mThis.salesAgentsListView.showPage(mThis.getFilterData());
                }
            };
            SalesAgentDialog.show(op);
        });

      

        mThis.tblSalesAgents.addEventListener('click', e => {
            e.preventDefault();
            // Click on Pickup Action button | drop down action
            let btn = VSUtil.closestLimited(e.target, '.btn_action');
            if (btn) {
                // let p = btn.parentElement;
                // let agent_id = btn.dataset.id;
                // let pricelist_id = btn.dataset.pricelistid;
                // let agent_name = btn.dataset.agentname;
                // let status_code = btn.dataset.status;
        
                // let dropdownMenu = p.querySelector('.dropdown-menu');
                // if (!dropdownMenu || dropdownMenu.length === 0) {
                //     p.insertAdjacentHTML('afterbegin', mThis.createDropdownMenuHtml_pickup(agent_id, pricelist_id, agent_name ,status_code));
                //     dropdownMenu = p.querySelector('.dropdown-menu');
                //     dropdownMenu.setAttribute('style',` left: 330px;`);
                // }
        
                // if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
                //     mThis.prev_dropdownMenu.classList.remove('show');
                // }
        
                // dropdownMenu.classList.toggle('show');
                // if (dropdownMenu.classList.contains('show')) {
                //     mThis.prev_dropdownMenu = dropdownMenu;
                // }
                return;
            }

        

        });
        document.addEventListener('click', e => {
            //e.preventDefault();
            if(!mThis.sales_agent_dropdown_menu) return;
            let container = mThis.sales_agent_dropdown_menu.parent();
            if(container){
                if(!container.is(e.target) && container.has(e.target).length === 0){
                    mThis.sales_agent_dropdown_menu.removeClass('show');
                }
            }
        });
        
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.salesAgentsListView.showPage(mThis.getFilterData());
            }
        });
        mThis.elSearch.on('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.salesAgentsListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.btnSearch.on('click', function(){
            mThis.salesAgentsListView.showPage(mThis.getFilterData());
        });
        
        mThis.initAlready = true;


    }
    // this.setEvents = (container) => {
    //     // console.log(container);
    //     // const div =  container.find('.col_action');
    //     const btn = container.find('.btn-options');

    //     btn.off('click').on('click',function(e){
    //         e.preventDefault();
    //         $(this).find('.w-options').toggle('fast');
    //     });
  
    //     container.off('click').on('click',e => {
    //         e.preventDefault();
             
          
 
    //         //click on Set Price List
    //         let lnk = VSUtil.getElementByClass(e.target,'set-price-list');
    //         if(lnk){
    //             // console.log(lnk);
    //             mThis.setSupplierPriceList(lnk.dataset.id,lnk.dataset.suppliername,lnk.parentElement,null);
    //             return;
    //         }
    //      });

    //     if(container.length !== 0){
    //         // let prev_div = null;
    //         // prev_div = div.find('.dropdown-menu');
    //         // console.log(prev_div);
    //         // $(document).off('click').on('mouseup',function(e){
    //         //     e.preventDefault();
    //         //     if((!div.is(e.target) && div.has(e.target).length === 0) && prev_div){
    //         //         prev_div.hide('fast');
    //         //     }
    //         //     else{
    //         //         if((!div.is(e.target) && div.has(e.target).length === 0) && (!btn.is(e.target) && btn.has(e.target).length === 0)){
    //         //             prev_div = div;
    //         //             div.hide('fast');
    //         //         }
    //         //     }
    //         // });

    //         container.off('click').on('click',(e) => {
    //             e.preventDefault();
                
    //             let lnk = VSUtil.getElementByClass(e.target,'btn-agent-edit');
    //             if(lnk){
    //                 console.log(lnk);
    //                 let op = {
    //                     id: lnk.dataset.id,
    //                     onClose:()=>{
    //                         mThis.salesAgentsListView.showPage(mThis.getFilterData());
    //                     }
    //                 };
    //                 SalesAgentDialog.show(op);                     
    //                 return;
    //             }
               
    //             //Click on Delete Merchant
    //             lnk = VSUtil.getElementByClass(e.target,'btn-agent-delete');
    //             if(lnk){
    //                 const id = lnk.dataset.id;
    //                 let status_code = lnk.dataset.status;
    //                 let p = {
    //                     id: id,
    //                     status_code: status_code
    //                 };
    //                 cv_interact.confirm('Delete this SalesAgent?',{
    //                     title: 'Delete SalesAgent',
    //                     context: 'delete'
    //                 },function(e){
    //                     if(e){
    //                         vsapi.call(`${mThis.base_url}/abm/os-sales-agents/delete`,{
    //                             id: id
    //                         },null).then(res => {
    //                             if(res.status_code === 200){
    //                                 mThis.salesAgentsListView.showPage(mThis.getFilterData());
    //                             }
    //                             else
    //                                 cv_interact.error(res.error_message);
    //                         });
    //                     }
    //                 });
    //                 return;
    //             }
 
               
    //             //Click on Change Status
    //             lnk = VSUtil.getElementByClass(e.target,'btn-agent-status');
    //             if(lnk){
    //                 let supplier_id = lnk.dataset.id;
    //                 let status_code = Validator.properCase(lnk.dataset.status);
    //                 let option = {
    //                     title: 'Set Sale Agent Status',
    //                     dataLabel: "Agent status",
    //                     valueMember: "status_code",
    //                     textMember: "name",
    //                     blankErrorMessage: "Please select a correct Status",
    //                     data: [{
    //                         status_code: "Active",
    //                         name: "Active"
    //                     },
    //                     {
    //                         status_code: "Inactive",
    //                         name: "Inactive"
    //                     }],
    //                     defaultValue: status_code
    //                 };

    //                 InputBox2.show(option,(d)=>{
    //                     if(d) {
    //                         let p = {
    //                             id: supplier_id,
    //                             status_code: d.value
    //                         };

    //                         vsapi.call(`${mThis.base_url}/abm/os-sales-agents/update-status`,p).then(res => {
    //                             if(res.status_code === 200){
    //                                 console.log(mThis.elFilter_sale_agent_status);
    //                                 // mThis.elFilter_sale_agent_status.val(d.value).trigger('change');
    //                                 mThis.elFilter_sale_agent_status.val(d.value).trigger('change');
    //                                 cv_interact.success('The status has been updated');
    //                                 mThis.salesAgentsListView.showPage(mThis.getFilterData());
    //                             }
    //                             else
    //                                 cv_interact.error(res.error_message); 
    //                         });
    //                     }
    //                 });
    //                 return;
    //             }

              
                
    //         });
    //     }
    // }

    

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

                let lnk = VSUtil.getElementByClass(e.target,'btn-agent-edit');
                if(lnk){
                    //const status_code =lnk.dataset.id; 
                    let op = {
                        id: lnk.dataset.id,
                        
                        //status_id: status_id,
                        onClose:()=>{
                            mThis.salesAgentsListView.showPage(mThis.getFilterData());
                        }
                    };
                    SalesAgentDialog.show(op);                     
                    return;
                }
            
                //Click on Delete Merchant
                lnk = VSUtil.getElementByClass(e.target,'btn-agent-delete');
                if(lnk){
                    const id = lnk.dataset.id;
                    let status_code = lnk.dataset.status;
                    let p = {
                        id: id,
                        status_code: status_code
                    };
                    cv_interact.confirm('Delete this salesAgent?',{
                        title: 'Delete SalesAgent',
                        context: 'delete'
                    },function(e){
                        if(e){
                            vsapi.call(`${mThis.base_url}/abm/os-sales-agents/delete`,{
                                id: id
                            },null).then(res => {
                                if(res.status_code === 200){
                                    mThis.salesAgentsListView.showPage(mThis.getFilterData());
                                }
                                else
                                    cv_interact.error(res.error_message);
                            });
                        }
                    });
                    return;
                }
           
 
               

                //Click on Change Status
                lnk = VSUtil.closestLimited(e.target,'.btn-agent-status');
                if(lnk){
                    let salesAgent_id = lnk.dataset.id;
                    let status_code = Validator.properCase(lnk.dataset.status);
                    console.log(lnk.dataset.status); 
                    let option = {
                        confirmButtonText:'OK',
                        title: 'Set SalesAgent Status',
                        dataLabel: "SalesAgent Status",
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
                                id: salesAgent_id,
                                status_code: d.value
                            };

                            vsapi.call(`${mThis.base_url}/abm/os-sales-agents/update-status`,p).then(res => {
                                if(res.status_code === 200){
                                    console.log(mThis.elFilter_sale_agent_status);
                                    // mThis.elFilter_sale_agent_status.val(d.value).trigger('change');
                                    mThis.elFilter_sale_agent_status.val(d.value).trigger('change');
                                    cv_interact.success('The status has been updated');
                                    mThis.salesAgentsListView.showPage(mThis.getFilterData());
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
    

    this.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.val(),
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            let f= el.dataset.field;
            p[f] = el.value;
        });
        console.log(p);

        return p;
    }

    this.show= (options)=>{
        mThis.init();
        if (!options) options = {};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        // console.log(mThis.getFilterData());
        mThis.loadFilterData(() => {    
            mThis.salesAgentsListView.showPage(mThis.getFilterData(),null,() => {
                mThis.self.siblings().hide();
                mThis.self.hide().fadeIn(300);
            });

            // $(mThis.self).siblings().hide();
            // $(mThis.self).fadeIn(204);
        });
    }


}


const SalesAgentDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_sale_agent_dlg');
    console.log(mThis.self);
    this.base_url =main_view.base_url;
    this.options = {};
    this.elTitle = this.self.find('#_sale_agent_dlgTitle');
    this.btnSave =  this.self.find('#_sale_agent_dlg_btnSave');
    // this.elAgentType =  this.self.find('#_sal_agent_type');
    this.onClose = null;
    this.body =  this.self.find('.modal-body')[0];

    this.prepareData = (id,def, onFinish) => {
        // console.log(id);
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/abm/os-sales-agents/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
            // console.log(d);
            // d.bank_accounts = d.bank_accounts || [];
            // VSUtil.setComboItems(mThis.elAgentType, d.agent_types, 'id', 'agent_type', true, '(Select agent_types Type)', def.agent_types_id);
            // VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
            // VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', def.price_list_id);
            // VSUtil.setComboItems(mThis.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', def.sales_agent_id);
            onFinish(d);
        });
    }

    mThis.btnSave.on('click', function(e){
        e.preventDefault();
        let p = mThis.getData();
        console.log(p);
        vsapi.call(`${mThis.base_url}/abm/os-sales-agents/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

            }
            else
                cv_interact.error(res.error_message);
        });
        
     });

    this.show = (options)=>{
        if (!options) options = {};
        mThis.options = options;

        mThis.prepareData(mThis.options.id,{},data => { 
            if(data.details){
                mThis.elTitle.text("Modify SalesAgent Information");
            }
            else{
                mThis.elTitle.text("Create SalesAgent");
            }
            mThis.setData(data.details);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
        // mThis.setData();
        // mThis.self.modal({
        //     backdrop:'static'
        // });
                    
    }

    this.setData = (d)=>{
        d = d || {};
        mThis.body.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            if(el.tagName.toLowerCase() ==='select'){

                 el.value = d[f];
                 let event = new Event('change',{
                    bubbles: true,
                    cancelable: true
                 });
                 el.dispatchEvent(event);
            }else{
                el.value = d[f]?? '';
            }
        });

    }

    this.getData = ()=>{
        let p = {};
        p.id = mThis.options.id;
        mThis.self[0].querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    }
}