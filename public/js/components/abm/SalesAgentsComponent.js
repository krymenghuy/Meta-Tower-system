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

    this.displaySalesAgents = (container, data=[]) =>{
        let i =1;
        console.log(data);
        let html = `
                    <table class="table table-light m-0">
                        <thead class="w-100 bg-info">
                            <tr>
                                <th scope="col" style=" width: 13.28%;">PHOTO</th>
                                <th scope="col" style=" width: 12.28%">ID</th>
                                <th scope="col" style=" width: 12.28%;">NAME</th>
                                <th scope="col" style=" width: 14.28%;">EMAIL</th> 
                                <th scope="col" style=" width: 13.28%;">TYPE</th>
                                <th scope="col" style=" width: 14.28%;">START DATE</th>
                                <th scope="col" style=" width: 12.28%;">TAGET COUNT</th>
                                <th scope="col" style=" width: 12.28%;">STATUS</th>
                                <th scope="col" style=" width: 12.28%;">ACTION</th>
                            </tr>
                        </thead>
                        
                    </table>

                    
                    `;
        (data ?? []).map(d => {
            // if(d.sprint_id==id){
                let image = d.image_url ? d.image_url : '';
                let cls_status = d.summary_type ==='closed'? 'text-danger':'text-info'; 
                let str_summary_status = [`<span class="${cls_status}">(`,d.summary_type,`)</span>`].join('');
                html +=`
                        <div class=" text-white rounded-3 mb-3 " style=" height: ;">
                            <div class="card-body p-0">
                            <div class="${d.status_code == 'Inactive'?" bg-light-gray ":"bg-white" } callout callout-info  p-0 m-0">
                                <table class="table table-white text-dark w-100 m-0" >
                                    <tbody>
                                        <tr >
                                            <td class="border-0 align-middle" style=" width: 12.28%;">
                                                <div class="d-flex align-items-center">
                                                    <div class="avatar-group d-flex align-items-center">
                                                        <a href="javascript:void(0)" class="avatar avatar-sm" data-toggle="tooltip"
                                                            data-original-title="Ryan Tompson">
                                                            <img class="image-student-tbl" src="${image}" alt=""/>
                                                        </a>
                                                    </div>
                                                </div> 
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 12.28%;">
                                                <div class="text-left d-flex align-items-center">
                                                    <div style="line-height: 10px;">
                                                        ${d.code}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 12.28%;">
                                                <div class="text-left d-flex align-items-center">
                                                <div style="line-height: 18px;">
                                                    ${d.name}
                                                    <div class="text-left ${d.status_id == 3?"text-light":"text-muted" }">
                                                        ${d.status_id == 1?"To Do":""}
                                                        ${d.status_id == 2?"Inprogress":""}
                                                        ${d.status_id == 3?"Done":""}
                                                    </div>
                                                </div>
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width:14.28%;">
                                                <div class=" align-items-center" style="line-height: 28px;">
                                                    <div class="d-flex" >
                                                        <i class="fas mt-2 me-1 fa-envelope"></i>${d.email || 'គ្មាន'}
                                                    </div>
                                                    <div class="d-flex text-left ${d.status_id == 3?"text-light":"text-muted" }">
                                                        <i class="fas text-secondary fa-phone mt-2 me-1"></i> ${d.phone_number}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 12.28%">
                                                <div class="text-left  d-flex align-items-center">
                                                    ${d.agent_type}    
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 14.28%">
                                                <div class="text-left d-flex align-items-center">
                                                    <div class="text-left d-flex align-items-center" style="line-height: 25px;"><i class="far fa-clock me-2 fs-5 text-warning"></i></div>
                                                    <div class="w-75" style="line-height: 25px;">
                                                        ${d.create_date}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 12.28%">
                                                <div class="text-left d-flex align-items-center">
                                                    <div class="w-100" style="line-height: 25px;">
                                                        <div class="d-flex flex-column"><span class="p-1 ">Achieved in ${d.current_month||''} ,${d.current_year||''}</span> <span class="p-1 text-nowrap">${d.target_count||''} ${d.count_type||'', str_summary_status||''}</span> </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 12.28%">
                                                <div class="text-left d-flex align-items-center">
                                                    <div class="w-75 ${d.status_code == "Inactive"? "text-danger" : "text-success"}"  style="line-height: 25px;">
                                                        ${d.status_code}
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="border-0 align-middle" style=" width: 14.28%">
                                                <div class="text-left d-flex align-items-center">
                                                    <div class="dropdown d-block ">
                                                        <a href="javascript:void(0)" data-pricelistid="${d.price_list_id}" data-id="${d.id}" data-suppliername="${d.name}" data-status="${data.status_code='active'? 1 : 2}" class="btn_action " aria-haspopup="true" aria-expanded="false">
                                                            <i class="fa fa-chevron-down" style="color:#8DC63F;font-size:1.5em"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                        `;
                        
                         i++;
            // } 
        });
        container.innerHTML = html;
        // mThis.taskBtnActionDialog(container);
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
            title: "ID",
            className: "align-middle text-capitalize text-nowrap",
            data:(data,index,tr)=>{
                return `<span class="code text-danger">#${data.code ? data.code:'N/A'}</span>`;
            }
        },
        {
            title: "Name",
            className: "align-middle text-capitalize text-nowrap",
            data: (data,index,tr)=>{
                let sex = data.sex === 'M' ? 'Male' : 'Female';
                return [`<span class="d-block p-1 fw-semibold">`,data.name,`</span><span class="d-block p-1 text-muted text-left">`,sex,`</span>`].join('');
            }
        },
        {
            title: "Email",
            className: "align-middle text-capitalize",
            data: (data,index,tr)=>{
                return ['<div class="d-flex p-1" ><i class="fas mt-2 text-success fa-envelope"></i><span class="d-block p-1">',(data.email || 'គ្មាន'),'</span></div>','<div class="d-flex p-1"><i class="fas text-warning fa-phone mt-2"></i><span class="d-block p-1 text-primary">',data.phone_number,'</span></div>'].join('');
            }
        },
    
        {
            title: "Type",
            className: 'align-middle text-capitalize',
            data: (data, index,tr) => {
                return data.agent_type;
            }
        },
        {
            title: "Start Date",
            className: 'align-middle text-capitalize',
            data: (data, index,tr) =>{
                return ['<span class="d-block text-nowrap">',data.create_date,'</span>'].join('');
            }
        },
    
        {
            title: "Target Count",
            className: 'align-middle text-capitalize',
            data: (data, index,tr) =>{
            let cls_status = data.summary_type ==='closed'? 'text-danger':'text-info'; 
            let str_summary_status = [`<span class="${cls_status}">(`,data.summary_type,`)</span>`].join('');
            return [`<div class="d-flex flex-column"><span class="p-1 text-success">Achieved in `,data.current_month,` ,`,data.current_year,`</span>`,`<span class="p-1 text-nowrap">`,data.target_count,` `,data.count_type, str_summary_status,`</span>`,`</div>`].join('');
            }  
        },
        {
            title: "Status",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
            const status_class = (data.status_code || '').toLowerCase()==='active'? 'border-success text-success text-center': 'border-danger text-danger text-center';  
            return ['<a href="javascript:void(0)" class="d-block lnk-agent-status" data-id ="',data.id,'" data-status="',data.status_code,'"><span style="display:block;width:80px;" class="border rounded-5 p-2 ',status_class,'">',data.status_code,'</span></a>'].join(''); 
            }
        },
        {
            // title: "Action",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
            //   return ['<div class="d-flex gap-2">',
            //   //'<a href="javascript:void(0)" class="btn-agent-status" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-dollar text-success fs-5"></i></a>',
            //   '<a href="javascript:void(0)" class="btn-agent-edit" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-edit text-primary fs-5"></i></a>',
            //   '<a href="javascript:void(0)" class="btn-agent-login" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-user text-primary fs-5"></i></a>',
            //   '<a href="javascript:void(0)" class="btn-agent-delete" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-trash-can text-danger fs-5"></i></a>',
            //   '</div>'].join(''); 
            let html = ['<div class="dropdown d-block ">',
                        '<a href="javascript:void(0)" data-pricelistid="', data.price_list_id, '" data-id="', data.id, '" data-suppliername="', data.name, '" data-status="', data.status_code='active'? 1 : 2, '" class="btn_action " aria-haspopup="true" aria-expanded="false">',
                        '<i class="fa fa-chevron-down" style="color:#8DC63F;font-size:1.5em"></i>',
                        '</a>',
                        '</div>'].join('');
                    return html;
            }
        }
    ];

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
            listContainerClass: null,
            'processResponse':(res)=>{
                console.log(res.data);
                return res.data;    
            },
            // 'rowCreated':(data, index, tr) => {
            //     tr.dataset.id = data.id;
            //     mThis.store_agents[data.id] = {
            //         code: data.code,
            //         name: data.name,
            //         user_id: data.user_id,
            //         phone_number: data.phone_number
            //     };
            // },
            renderItems: (items, list_container) => {
                // console.log(items);
                mThis.displaySalesAgents(list_container, items);
            },
            'beforeRender':()=>{}
        });
        mThis.tblSalesAgents = mThis.salesAgentsListView.getTable();
        
        this.container = mThis.salesAgentsListView.getListContainer();
        mThis.setEvents($(mThis.container));
        // console.log(mThis.container.parentElement); 
        const sh_parent = mThis.container.parentElement;
            sh_parent.style.height = (window.innerHeight - 190)+'px';
            sh_parent.classList.add('overflow-y-auto');
            window.onresize = () => {
                sh_parent.style.height = (window.innerHeight - 200)+'px';
        }
        
        this.btnNewSalesAgents.on('click',function(e){
            let op = {
                'id':null,
                'onClose':(d)=>{
                    mThis.salesAgentsListView.showPage(null);
                }
            };
            console.log(op);
            SalesAgentDialog.show(op);
        });

        // mThis.tblSPY = mThis.salesAgentsListView.getTable();
        // mThis.tblSale_agent = $(mThis.tblSalesAgents);//old
        mThis.tblSale_agent = $(mThis.container);

        mThis.tblSale_agent[0].addEventListener('click', e => {
            e.preventDefault();
            // Click on Pickup Action button | drop down action
            let btn = VSUtil.closestLimited(e.target, '.btn_action');
            if (btn) {
                let p = btn.parentElement;
                let agent_id = btn.dataset.id;
                let pricelist_id = btn.dataset.pricelistid;
                let agent_name = btn.dataset.agentname;
                let status_code = btn.dataset.status;
        
                let dropdownMenu = p.querySelector('.dropdown-menu');
                if (!dropdownMenu || dropdownMenu.length === 0) {
                    p.insertAdjacentHTML('afterbegin', mThis.createDropdownMenuHtml_pickup(agent_id, pricelist_id, agent_name ,status_code));
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
        
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.salesAgentsListView.showPage(mThis.getFilterData());
            }
        });
        
        mThis.initAlready = true;

    }

    this.setEvents = (container) => {
        const div =  container.find('.table');
        // console.log(container);
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

        if(container.length !== 0){
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

            container.off('click').on('click',(e) => {
                e.preventDefault();
                
                let lnk = VSUtil.getElementByClass(e.target,'btn-agent-edit');
                if(lnk){
                    console.log(lnk);
                    let op = {
                        id: lnk.dataset.id,
                        onClose:()=>{
                            mThis.salesAgentsListView.showPage(mThis.getFilterData());
                        }
                    };
                    SalesAgentDialog.show(op);                     
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
                lnk = VSUtil.getElementByClass(e.target,'btn-agent-delete');
                if(lnk){
                    const id = lnk.dataset.id;
                    let status_code = lnk.dataset.status;
                    let p = {
                        id: id,
                        status_code: status_code
                    };
                    cv_interact.confirm('Delete this SalesAgent?',{
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
                                            mThis.salesAgentsListView.showPage(mThis.getFilterData());
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
                lnk = VSUtil.getElementByClass(e.target,'btn-agent-status');
                if(lnk){
                    let supplier_id = lnk.dataset.id;
                    let status_code = Validator.properCase(lnk.dataset.status);
                    let option = {
                        title: 'Set Sale Agent Status',
                        dataLabel: "Agent status",
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

    this.createDropdownMenuHtml_pickup = function (agent_id, pricelist_id, agent_name ,status) {
        let html = [
            '<div class="dropdown-menu bg-white shadow" data-id="', agent_id, '" data-pricelistid="', pricelist_id, '" data-suppliername="', agent_name, '">',
            // '<a class="dropdown-item _pl_pa_assign_driver" href="javascript:void(0)"><i class="fa fa-biking" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '"></i> Assign Driver (Pickup)</a>',
            // `<a href="javascript:void(0)" class="dropdown-item btn-set-price-list border-bottom pb-2" data-id="${agent_id}" data-pricelistid="${pricelist_id}" data-suppliername="${agent_name}" data-status="${status}">
            //     <i class="fa-regular fa-list-alt fs-5"></i>
            //     <span class="ps-2 trans-text" data-langprop="titles.Set Price List">Set Price List</span>
            // </a>`,
            `<a href="javascript:void(0)" class="dropdown-item btn-agent-edit border-bottom pb-2" data-id="${agent_id}" >
                <i class="fa-regular fa-pen-to-square fs-5 text-success"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Modify Supplier">Modify Supplier</span>
            </a>`,
            `<a href="javascript:void(0)" class="dropdown-item btn-agent-delete border-bottom pb-2" data-id="${agent_id}" data-status="${status}">
                <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Delete">Delete</span>
            </a>`,    
            `<a href="javascript:void(0)" class="dropdown-item btn-agent-status border-bottom pb-2" data-id="${agent_id}" data-status="${status}">
                <i class="fa-regular fa-circle-stop fs-5 text-primary"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Change Status">Change Status</span>
            </a>`,
            // '<a class="dropdown-item _pl_pa_change_driver" href="javascript:void(0)"><i class="fa fa-user"></i> Change Driver (Pickup)</a>',
            '</div>'].join('');
        return html;
    };
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