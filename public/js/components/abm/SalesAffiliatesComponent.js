'use strict';

// const { join } = require("lodash");

var SalesAffiliatesComponent = new function () {
    const mThis = this;
    this.title_prop = "Sales Affiliates";
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_main_salesAffiliatesComponent');
    this.elFilter_sale_agent_type = this.self[0].querySelector('#_sale_agent_filter_type');
    this.elFilter_sale_agent_status = this.self[0].querySelector('#_sale_agent_filter_status');
    this.elFilter_contact_person_status = this.self[0].querySelector('#_contact_person_filter_status');
    this.elFilter_contact_person_type = this.self[0].querySelector('#_contact_persen_filter_type');

    this.btnNewSalesAgents = this.self.find('#_sale_agent_btnNew');
    this.btnNewContactPerson = this.self.find('#_contact_person_btnNew');
    this.elSearch = this.self.find('#_sale_agent_search');
    this.btnSearch = this.self.find('#_sale_agent_btnSearch');
    this.btnPrint = this.self.find('#_sale_agent_btnPrint');

    this.form_data={};
    this.store_agents = {};
    this.listViewConfig = {};

    this.tabs = this.self[0].querySelector('ul#custom-tabs-one-tab');
    
    this.tabHeader = this.tabs;
    this.tabBody = this.tabs.querySelector('ul.vs-tab-body');
    // this.tabPages = {};
    this.last_view_name = 'view_sales_agent';

    this.initListView = (view_name=null)=>{
        view_name=view_name || mThis.last_view_name;
        this.listViewConfig[view_name] =  new ListView(mThis.getContentList(view_name),{
            'fetchApi': mThis.getEndPoint(view_name),
            'apiCluster': main_view.apiCluster,
            'columns': mThis.getColumns(view_name),
            'tableClass':"table affiliate header-light-blue header-uppercase  bg-white ",
            listContainerClass: null,
            'processResponse':(res)=>{
                console.log(1,res.data);
                return res.data;    
            },
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
                mThis.setTrClassList(tr,view_name);
                // tr.classList.add("table-primary");
                // tr.classList.add("shadow");
                mThis.store_agents[data.id] = {
                    code: data.code,
                    name: data.name,
                    user_id: data.user_id,
                    phone_number: data.phone_number
                };
            },
            // renderItems: (items, list_container) => {
            //     // console.log(items);
            //     mThis.displaySalesAgents(list_container, items);
            // },
            'beforeRender':()=>{}
        });

        this.div_filter_fields = this.self[0].querySelector(['#_sdl_filter_fields_',view_name].join(''));

        this.div_filter_fields.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange = e => {
                e.preventDefault();
                if(mThis.allow_filter){
                    mThis.listViewConfig[view_name].showPage(mThis.getFilterData());
                }
            };
        });

        mThis.elSearch.on('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.listViewConfig[view_name].showPage(mThis.getFilterData());
            }, 250);
        });

        this.listViewConfig[view_name].showPage(mThis.getFilterData());
        const tbl = mThis.listViewConfig[view_name].getTable();

        tbl.addEventListener('click', e => {
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
                    p.insertAdjacentHTML('afterbegin', mThis.createDropdownMenuHtml_pickup(agent_id, pricelist_id, agent_name ,status_code,view_name));
                    dropdownMenu = p.querySelector('.dropdown-menu');
                    dropdownMenu.setAttribute('style',` left: -160px;`);
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

        // this.getFilterData = (view_name)=>{

        //     return{};
        // }

        this.container = mThis.listViewConfig[view_name].getListContainer();

        mThis.setEvents(tbl,view_name);

        // console.log('container',mThis.container.parentElement); 
        const sh_parent = mThis.container.parentElement;
        sh_parent.style.height = (window.innerHeight - 250)+'px';
        sh_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 250)+'px';
        }
    }

    


    this.displaySalesAgents = (container, data=[]) =>{
        let i =1;
        console.log(data);
        let html = `
                    <table class="table m-0">
                        <thead class="w-100">
                            <tr>
                                <th scope="col" style=" width: 13.28%;">PHOTO</th>
                                <th scope="col" style=" width: 12.28%">ID</th>
                                <th scope="col" style=" width: 12.28%;">NAME</th>
                                <th scope="col" style=" width: 14.28%;">EMAIL</th> 
                                <th scope="col" style=" width: 13.28%;">TYPE</th>
                                <th scope="col" style=" width: 14.28%;">START DATE</th>
                                <th scope="col" style=" width: 12.28%;">TARGET COUNT</th>
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

    this.loadFilterData = (onFinish) => {
        mThis.def_filter = mThis.def_filter || {};
        mThis.def_filter.status_code = mThis.def_filter.status_code || 'Active';

        //Do not allow filter to be applied yet. I means that filter SELECT's change event wont refresh the merchant list
        mThis.allow_filter = false;
        vsapi.call(`${mThis.base_url}/abm/os-sales-agents/form-options`, null,null,main_view.apiCluster).then(res => {
            let d = res.status_code === 200 ? StringSanitizer.sanitizeObject(res.data) : {};
            VSUtil.setComboItems(mThis.elFilter_sale_agent_status, d.statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
            VSUtil.setComboItems(mThis.elFilter_sale_agent_type, d.agent_types, 'id', 'agent_type', true, '(All Agent Types)', 0);
            VSUtil.setComboItems(mThis.elFilter_contact_person_status, d.statuses, 'status_code', 'status_name', true, '(All Status)', mThis.def_filter.status_code);
            VSUtil.setComboItems(mThis.elFilter_contact_person_type, d.cp_types, 'id', 'cp_types', true, '(All cp Types)', 0);
            // VSUtil.setComboItems(SupplierDialog.elSalesAgent, d.sales_agents, 'id', 'agent_name', true, '(No referral)', null);
            onFinish();
            mThis.allow_filter = true;
        });
    }

    this.getColumns = (view_name)=>{
        if(view_name == 'view_contact_person')
            return mThis.cp_cols;
        else
            return mThis.sales_agent_cols;
    }

    this.setTrClassList = (tr,view_name)=>{
        if(view_name == 'view_contact_person'){
            tr.classList.add("table");
            tr.classList.add("shadow");
        }
        else{
            tr.classList.add("table");
            tr.classList.add("shadow");
        }
    }

    this.getContentList = (view_name)=>{
        if(view_name == 'view_contact_person')
            return '_contact_person_list';
        else
            return '_sale_agent_list';
    }

    this.getEndPoint = (view_name)=>{
        if(view_name == 'view_contact_person')
            return `${main_view.base_url}/abm/os-sales-agents/cp-list`;
        else
            return `${main_view.base_url}/abm/os-sales-agents/sa-list`;
    }


    this.init= () => {
        if(mThis.initAlready) return;


        this.tabHeader.addEventListener('click', e=>{
            e.preventDefault();
            const lnk = VSUtil.closestLimited(e.target,'a.tab-button');
            if(lnk){
                let view_name = lnk.dataset.target || lnk.dataset.view;
                mThis.initListView(view_name);
                return;
            }
            
        });
        mThis.initListView(mThis.last_view_name);
        
        this.btnNewSalesAgents.on('click',function(e){
            let op = {
                'id':null,
                'as':'sa',
                'onClose':(d)=>{
                    // mThis.salesAgentsListView.showPage(null);
                    mThis.initListView('view_sales_agent');
                }
            };
            // console.log(op);
            SalesAgentDialog.show(op);
        });

        this.btnNewContactPerson.on('click',function(e){
            let op = {
                'id':null,
                'as':'', 
                'onClose':(d)=>{
                    // mThis.salesAgentsListView.showPage(null);
                    mThis.initListView('view_contact_person');
                }
            };
            // console.log(op);
            SalesAgentDialog.show(op);
        });

     
        mThis.initAlready = true;

    }

    this.setEvents = (div,view_name) => {
        // console.log('div',div,'view_name',view_name);
        
        // const div =  container.querySelector('.table');
        // console.log(container);
        // const div =  container.find('.col_action');
        // const btn = div.querySelector('.btn-options')[0];

        // btn.addEventListener('click',function(e){
        //     e.preventDefault();
        //     // $(e.target).find('.w-options').toggle('fast');
        //     e.target.querySelector('.w-options').classList.toggle('fast');
        // });
  
        div.addEventListener('click',e => {
            e.preventDefault();
             
            let lnk = VSUtil.closestLimited(e.target,'.btn-app-login');
            if(lnk){
                mThis.createAppAccount(lnk.dataset.id);
                return;
            }
 
            //click on Set Price List
            lnk = VSUtil.closestLimited(e.target,'.set-price-list');
            if(lnk){
                // console.log(lnk);
                mThis.setSupplierPriceList(lnk.dataset.id,lnk.dataset.suppliername,lnk.parentElement,null);
                return;
            }
         });
         let v_name = 'agent';
        //  this.getBtnEdit = (view_name)=>{
            if(view_name == 'view_contact_person')
                v_name = 'cp';
            else
                v_name = 'agent';
        // }
        if(div){
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

            div.addEventListener('click',(e) => {
                e.preventDefault();
                
                let lnk = VSUtil.getElementByClass(e.target,['btn-',v_name,'-edit'].join(''));
                // console.log('btn',['btn-',v_name,'-edit'].join(''),'lnk',lnk);
                if(lnk){
                    let op = {
                        id: lnk.dataset.id,
                        as:'sa',
                        onClose:()=>{
                            // mThis.salesAgentsmThis.initListView('view_sales_agent');
                            mThis.initListView(view_name);
                        }
                    };
                    if(v_name=='cp')
                        op.as = '';
                    // console.log('op',op);
                    SalesAgentDialog.show(op);                     
                    return;
                }
                // Click on Set Price List
                lnk = VSUtil.getElementByClass(e.target,'btn-set-price-list');
                if(lnk){
                    const id = lnk.dataset.id;
                    let pl_id = lnk.dataset.pricelistid;
                    let name = lnk.dataset.suppliername;
                    let span = div.find('.supplier-price-list')[0];
                    mThis.setSupplierPriceList(id,name, span ? span.parentElement : null ,pl_id); 
                    return ;
                }
                //Click on Delete Merchant
                lnk = VSUtil.getElementByClass(e.target,['btn-',v_name,'-delete'].join(''));
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
                            let p = {
                                    id: id,
                                    as: 'sa',
                                }
                            if(v_name=='cp')
                            p.as = '';
                            // console.log('op',p);
                            vsapi.call(`${mThis.base_url}/abm/os-sales-agents/delete`,p,null).then(res => {
                                if(res.status_code === 200){
                                    mThis.initListView(view_name);
                            // mThis.salesAgentsListView.showPage(mThis.getFilterData());
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

                //Click on Change Status
                lnk = VSUtil.getElementByClass(e.target,['btn-',v_name,'-status'].join(''));
                if(lnk){
                    let id = lnk.dataset.id;
                    let status_code = Validator.properCase(lnk.dataset.status);
                    // console.log(lnk.dataset.status); 
                    let option = {
                        title: 'Set new Status',
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
                        defaultValue: status_code,
                    };

                    InputBox2.show(option,(d)=>{
                        if(d) {
                            let p = {
                                id: id,
                                as: 'sa',
                                status_code: d.value
                            };
                            if(v_name=='cp')
                            p.as = '';
                            // console.log('op',p);
                            vsapi.call(`${mThis.base_url}/abm/os-sales-agents/update-status`,p).then(res => {
                                if(res.status_code === 200){
                                    // console.log(mThis.elFilter_sale_agent_status);
                                    // mThis.elFilter_sale_agent_status.val(d.value).trigger('change');
                                    // mThis.elFilter_sale_agent_status.val(d.value).trigger('change');
                                    cv_interact.success('The status has been updated');
                                    mThis.initListView(view_name);
                                // mThis.salesAgentsListView.showPage(mThis.getFilterData());
                                    // return mThis.initListView(view_name);
                                }
                                else
                                    cv_interact.error(res.error_message); 
                            });
                        }
                    });
                    return ;
                }
            });
        }
    }

    this.getFilterData = () => {

        let p = {
            search_value: mThis.elSearch.val(),
            // status_code: mThis.elFilter_sale_agent_status.val()
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            let f= el.dataset.field;
            p[f] = el.value;
        });
        console.log('p',p); 
        return p;
    }

    this.show= (options)=>{
        mThis.init();
        if (!options) options = {};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        mThis.loadFilterData(() => {    
            mThis.initListView(mThis.last_view_name);

            // mThis.   .showPage(mThis.getFilterData(),null,() => {
                mThis.self.siblings().hide();
                mThis.self.hide().fadeIn(300);
            // });
        });
        // console.log('1',mThis.getFilterData());

        // $(mThis.self).siblings().hide();
        // $(mThis.self).fadeIn(204);
    }

    this.createDropdownMenuHtml_pickup = function (agent_id, pricelist_id, agent_name ,status,view_name) {
        let v_name = 'agent';
        if(view_name == 'view_contact_person'){
            v_name = 'cp';
        }
        let html = [
            '<div class="dropdown-menu bg-white shadow" data-id="', agent_id, '" data-pricelistid="', pricelist_id, '" data-suppliername="', agent_name, '">',
            // '<a class="dropdown-item _pl_pa_assign_driver" href="javascript:void(0)"><i class="fa fa-biking" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '"></i> Assign Driver (Pickup)</a>',
            // `<a href="javascript:void(0)" class="dropdown-item btn-set-price-list border-bottom pb-2" data-id="${agent_id}" data-pricelistid="${pricelist_id}" data-suppliername="${agent_name}" data-status="${status}">
            //     <i class="fa-regular fa-list-alt fs-5"></i>
            //     <span class="ps-2 trans-text" data-langprop="titles.Set Price List">Set Price List</span>
            // </a>`,
            `<a href="javascript:void(0)" class="dropdown-item btn-`,v_name,`-edit border-bottom pb-2" data-id="${agent_id}" >
                <i class="fa-regular fa-pen-to-square fs-5 text-success"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Modify Supplier">Modify Supplier</span>
            </a>`,
            `<a href="javascript:void(0)" class="dropdown-item btn-`,v_name,`-delete border-bottom pb-2" data-id="${agent_id}" data-status="${status}">
                <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Delete">Delete</span>
            </a>`,    
            `<a href="javascript:void(0)" class="dropdown-item btn-`,v_name,`-status border-bottom pb-2" data-id="${agent_id}" data-status="${status}">
                <i class="fa-regular fa-circle-stop fs-5 text-primary"></i>
                <span class="ps-2 trans-text" data-langprop="titles.Change Status">Change Status</span>
            </a>`,
            // '<a class="dropdown-item _pl_pa_change_driver" href="javascript:void(0)"><i class="fa fa-user"></i> Change Driver (Pickup)</a>',
            '</div>'].join('');
        return html;
    };

    this.sales_agent_cols = [
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
                return `<span class="code text-success">${data.code ? data.code:'N/A'}</span>`;
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
            className: 'align-middle ',
            data: (data, index,tr) => {
                return data.type_from_affilliate_type||"NA";
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
            //   '<a href="javascript:void(0)" class="btn-agent-status" data-id="',data.id,'" data-status="',data.status_code,'"><i class="fa fa-dollar text-success fs-5"></i></a>',
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

    this.cp_cols = [
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
                return `<span class="code text-info">${data.code ? data.code:'N/A'}</span>`;
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
                return data.type_from_affilliate_type||"NA";
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
            className: 'align-middle text-capitalize btn-options',
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
}


const SalesAgentDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.find('#_sale_agent_dlg');
    // console.log(mThis.self);
    this.base_url =main_view.base_url;
    this.options = {};
    this.elTitle = this.self.find('#_sale_agent_dlgTitle');
    this.btnSave =  this.self.find('#_sale_agent_dlg_btnSave');
    this.elType = {};

    // this.elAgentType =  this.self.find('#_sal_agent_type');
    this.onClose = null;
    this.body =  this.self.find('.modal-body')[0];
    this.divPhoto = this.self[0].querySelector('#_saleAffiliate_profile_photo');


    mThis.imgBox = new ImageBox(mThis.divPhoto,{
        "dataField":"photo",
        "cssClass":"data-input",
        containerClass:null,
        // onDeleteImage:()=>{
        //   alert('Deleting image');
        //   return false;
        // },
        "onLoadImage":(photo) =>{
            let p = {"id":mThis.options.id,"affiliate_id":mThis.options.id,"photo":photo};
            console.log(p);
            
            if(!p.id) return; 

            vsapi.call(`${main_view.base_url}/abm/os-sales-agents/save-profile-picture`,p,null,null,false).then(res =>{
                if(res.status_code ===200){
                    mThis.imgBox.setImage(photo);
                    cv_interact.success('Photo has been saved');
                }else cv_interact.error(res.error_message);
            });
        },
        "deleteAPI":{
            "endPoint":`${main_view.base_url}/abm/os-sales-agents/delete-profile-picture`,
            "params":()=>{
                return {"id": mThis.options.id,"affiliate_id":mThis.options.id}
            }
        }
    });

    this.prepareData = (id,def, onFinish) => {
        // console.log(id);
        if(!def) def = {};
        vsapi.call(`${mThis.base_url}/abm/os-sales-agents/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data,null,['email','address','image_url','photo']) : {};
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
        // console.log(1,p);
        vsapi.call(`${mThis.base_url}/abm/os-sales-agents/save`, p).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);

            }
            else
                cv_interact.error(res.error_message);
        });
        
     });

    this.el_Type = (agent=null)=>{
        let type ='';
        agent == 'sa'? type = '#el_cp_type' : type = '#el_agent_type';
        mThis.elType = mThis.self[0].querySelector(type);
        mThis.elType.classList.add("d-none");
        // console.log(2,mThis.elType,3,type);

        agent == 'sa'? type = '#el_agent_type' : type = '#el_cp_type';
        mThis.elType = mThis.self[0].querySelector(type);
        mThis.elType.classList.remove("d-none");
        // console.log(4,mThis.elType,5,type);
        return ;
    }

    this.show = (options)=>{
        if (!options) options = {};
        mThis.options = options;
        console.log(options);
        let title ='';
        options.as == 'sa'? title = 'Sales Agent' : title = 'Contact Person';
        mThis.el_Type(options.as);
        
        
        mThis.prepareData(mThis.options.id,{},data => { 
            if(data.details){
                mThis.elTitle.text(`Modify ${title} Information`);
            }
            else{
                mThis.elTitle.text(`Create ${title}`);
            }
            mThis.setData(data.details);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
 
    }
    // this.show = (options)=>{
    //     mThis.options = options || {};
    //     mThis.elTitle.innerHTML = options.title;
    //     console.log(mThis.options.id);
    //     if (mThis.options.id > 0) {
    //         mThis.elTitle.innerHTML = "Affiliate Details";
    //         let p = {'id':mThis.options.id};
    //         vsapi.call([main_view.base_url,'/abm/os-sales-agents/form-options'].join(''),p,null).then(res=>{
                
    //             if(res.status_code === 200){
    //                 let d = res.data.affiliate;
    //             console.log(d);

    //                 d = StringSanitizer.sanitizeObject(d,null,['email','address','image_url','photo']);
    //                 mThis.prepareData(d, {}, data => {
    //                     mThis.setData(d);
    //                     mThis.self.modal({
    //                         backdrop:'static'
    //                     });
    //                 });
    //             }
    //         });
    //     }
    //     else{
    //         mThis.elTitle.innerHTML =  "New Customers";
    //         mThis.prepareData({'id':1},{},data =>{
    //             mThis.setData(null);
    //             mThis.self.modal({
    //                 backdrop:'static'
    //             });       
    //         });
    //     }
    // }

    this.setData = (d)=>{
        d = d || {};
        mThis.body.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            el.value = d [f] ?? '';
            // if(el.tagName.toLowerCase() ==='select'){

            //      el.value = d[f];
            //      let event = new Event('change',{
            //         bubbles: true,
            //         cancelable: true
            //      });
            //      el.dispatchEvent(event);
            // }else{
            //     el.value = d[f]?? '';
            // }
            if (el.tagName.toLowerCase() === 'select') {
                el.dispatchEvent(new Event('change'));
            }else if(el.tagName ==='IMG'){
                el.setAttribute('src',d[f] || '');
            }
        });
        console.log(d);
        mThis.imgBox.setImage(d.photo || d.image_url);


    }

    this.getData = ()=>{
        let p = {};
        p.id = mThis.options.id;
        mThis.self[0].querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            if(el.tagName ==='IMG') 
                p[f] = el.getAttribute('src');
            else 
                p[f] = el.value;
        });
        // console.log(mThis.elTitle.text()); 
        if(mThis.elTitle.text() == 'Create Sales Agent' || mThis.elTitle.text() =='Modify Sales Agent Information'){
            p.as = 'sa';   //as mean save affiliate as sales agent(sa) or contacr person(cp)
        }else
            p.as = '';

        return p;
    }
}