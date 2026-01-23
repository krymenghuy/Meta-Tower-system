"use strict";
var ServiceRequestComponent = (function () {

    const mThis = {};
    mThis.title_prop = "Service Request Component";
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_request_component");
    mThis.elSearch = mThis.self.querySelector("#_search_service_request");
    mThis.elServiceRequest_status = mThis.self.querySelector("#_service_request_status");
    mThis.elService_type = mThis.self.querySelector("#_service_request_type_id");
    mThis.elBtnCreate = mThis.self.querySelector("#__btnServiceRequest")
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service_request");

    mThis.columns = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.tenant_name ?? ''}</span>`;
            }
        },
        {
            title: "Building",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.building_space_building_id ?? ''}</span>`;
            }
        },
        {
            title: "Floor",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.building_space_floor_id ?? ''}</span>`;
            }
        },
        {
            title: "Service",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.service_name ?? ''}</span>`;
            }
        },
        {
            title: "Category",
            className: "align-middle",
                data: (data) => {
                return `<span class="text-primary-custom">${data.service_status_code ?? ''}</span>`;
            }
        },
        {
            title: "Price",
            className: "align-middle",
                data: (data) => {
                return `<span class="text-primary-custom">${data.service_price ?? ''}</span>`;
            }
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const request_status_name = (data.request_status_name ?? '').toLowerCase();
                let cls = 'text-info';

                if (request_status_name == 'inactive') {
                    cls = 'text-white px-3 py-1 rounded-3 bg-danger d-inline-block';
                } else if (request_status_name == 'active') {
                    cls = 'text-white px-3 py-1 rounded-3 bg-success d-inline-block';
                }
                return `<span class="${cls} text-capitalize" data-status_id="${data.request_status_id}"><small>${data.request_status_name ?? ''}</small></span>`;
            },
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-primary-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            title : "Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                    class="btn--Options ${data.action_id > 1 ? 'd-none'
                        : 'btn_leave_action'}" data-id="${data.id}"
                        data-statusid="${data.request_status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
                    </a>
                </div>`
        },
    ];

    /* =====================================================
     * 3. INITIALIZATION
     * ===================================================== */
    mThis.init = () => {
        if (mThis._initAlready) return;

        mThis.listView = new ListView('_service_request_list', {
            fetchApi: `${main_view.base_url}/prm/service-request/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.columns,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
                tr.classList.add('service-request');
                tr.setAttribute('id',['service_request_id',data.id].join(''));
            },
            listContainerClass: null

        });
        // mThis._bindEvents();
        // mThis._initDropdowns();

        mThis._initAlready = true;

        mThis.getFilterData = () =>{
            let p ={
                request_status_id: mThis.elServiceRequest_status.value,
                service_request_type_id:elService_type,
                search_value: mThis.elSearch
            }
            mThis.divFilter.querySelectorAll('.filter-field').forEach(el=>{
                const f= el.dataset.filled;
                p[f]= el.value;
            });

            return p;
        }
    };

    /* =====================================================
     * 4. EVENTS
     * ===================================================== */
    // mThis._bindEvents = () => {

    //     mThis.btnAdd.onclick = (e) => {
    //         e.preventDefault();
    //         SampleDialog.show({
    //             onClose: () => mThis.reload()
    //         });
    //     };

    //     mThis.elSearch.onkeyup = () => {
    //         clearTimeout(mThis._searchTimer);
    //         mThis._searchTimer = setTimeout(mThis.reload, 300);
    //     };

    //     // mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
    //     //     el.onchange = mThis.reload;
    //     // });
    // };

    /* =====================================================
     * 5. FILTER PAYLOAD
     * ===================================================== */
    // mThis.getFilterData = () => {
    //     const p = { search: mThis.elSearch.value };

    //     mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
    //         p[el.dataset.field] = el.value;
    //     });

    //     return p;
    // };

    /* =====================================================
     * 6. DROPDOWN ACTIONS
     * ===================================================== */
    mThis._initDropdownsMenu = (table) => {
        const menuOptions = {
            containElement: table,
            actionButtonClass: "btn_leave_action ",
            cssClass: "bg-white shadow",
            menus:[
                {
                    html:'<span class="ps-2" vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2 ",
                    name:"change_status"
                },
                {
                    html:'<span class="ps-2" vslang="Modify">Modify</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2 ",
                    name:"edit_request"
                },
                {
                    html:'<span class="ps-2" vslang="Delete">Delete</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2 ",
                    name:"delete_request"
                }
            ],

            onClick: (menuLink, id, name)=>{
                switch (name){
                    case 'change_status':{
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case'edit_request':{
                        mThis.editServiceRequest(id, menuLink);
                        break;
                    }
                    case'delete_request':{
                        mThis.deleteRequest(id,menuLink)
                        break;
                    }
                    default:{
                        break;
                    }
                }
            }

        }
        new VSDropdownMenu(menuOptions)
    }

    mThis.editServiceRequest =(id,menuLink) =>{
        let op = {
            id:id,
            btn:menuLink,
            onClose:()=>{
                mThis.listView.showPage(mThis.getFilterData());
            }
        }
        CreateServiceRequestDialog.show(op)
    }
    mThis.deleteRequest = (id, menuLink) =>{
        let op ={
            id: id,
            btn: menuLink,
            onClose: () =>{
                mThis.ListView.showPage(mThis.getFilterData());
            }
        }
        if (!AuthManager.allowed(242))
            return ;
        cv_interact.confirm('Delete this Service Request??',{
            title: 'Delete Service Request',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e){
                if (e) {
                    vsapi.call(`${main_view.base_url}/prm/service/delete`, op, false, false, false).then(res => {
                        if (res.status_code == 200) {
                            mThis.ListView.showPage();
                        }
                        else {
                            cv_interact.error(res.error_massage);
                        }
                    })
                }
            }
        )
    }

    mThis.changeStatus = (id,link) =>{
        const tr = link.closet('tr');
        const status_id = VSUtil.properCase(tr?.dataset.statusid || "");
        const inputOptions = {
            title:'Change Statue',
            dataLabel: "Service Request Status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtontext: "Save",
            blankErrorMessage: "Status is not correct !",
            data:[
                {status_id: "1", name: "Approved"},
                {status_id: "2", name: "Rejected"},
                {status_id: "3", name: "Pending"},
                {status_id: "4", name: "In Progress"},
                {status_id: "5", name: "Completed"},
            ],
            defaultValue: status_id
        };
        InputBox2.show(inputOptions, (selected)=>{
            if(!select)return;
            if(AuthManager.allowed(321)) return;
            const payload = {id,status_id:selected.value};
            vsapi.call(`${mThis.base_url}/prm/service/update-status`,payload).then(res=>{
                if(res.status_code ===200){
                    InputBox2.close();
                    cv_interact.success('Service Status has been updated');
                    mThis.ServiceListView.showPage(mThis.getFilterData());
                }else{
                    cv_interact.error(res.error_message || 'Unable to update status');
                }
            });
        })
    }

    // this.prepareFormOptions =(onFinish) =>{
    //     vsapi.call(`${main_view.base_url}/prm/service/form-options`, null, null, null)
    //         .then(res => {
    //             const d = res.status_code == 200 ? res.data : {};
    //             VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'service_status', true, 'All Statuses', null);
    //             VSUtil.setComboItems(mThis.elFilter_type, d.service_types, 'id', 'service_type', true, 'All Services type', null);
    //             if (typeof onFinish === 'function') onFinish();
    //         })
    // }

    const CreateServiceRequestDialog = (()=>{
        const self ={};
        let dialog = null;
        ssrCompileToFunctions.show = (op)=>{
            dialog = dialog ||
                    new GeneralDialog({
                        cssClass: "modal-md",
                        backdrop: "static",
                        keyboard: true,
                        createContent:() =>{
                            return[
                                `
                                <div class="row justify-content-center">
                                    <div class="col-12">
                                        <label style="padding-left:6px;" for="service_name">Category</label>
                                        <div class="material-input outlined">
                                            <select name="service_name" class="data-input form-control" data-field="service_type_id">
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label style="padding-left:6px;">Service</label>
                                        <div class="material-input outlined">
                                            <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <label style="padding-left:6px;">Price</label>
                                        <div class="material-input outlined">
                                            <input type="number" name="price" required class="data-input form-control" data-field="price" placeholder=" " />
                                        </div>
                                    </div>
                                        <div class="col-8">
                                            <label style="padding-left:6px;" for="service_types">Charge As</label>
                                            <div class="material-input outlined">
                                                <select name="unit_type" class="data-input form-control" data-field="unit_type">
                                                    <option value="hour">Price Per Hour</option>
                                                    <option value="month">Price Per Month</option>
                                                    <option value="time">Per Usage / Per Time</option>
                                                    <option value="one_time">One-time Service</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-none material-input outlined">
                                                <input name="status_id" class="data-input form-control" data-field="status_id" placeholder=" " />
                                                <label>Status ID</label>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <label style="padding-left:6px;">Remarks</label>
                                            <div class="material-input outlined">
                                                <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                            </div>
                                        </div>
                                    </div>
                                `
                            ]
                        }
                    })
        }
    })

    mThis.reload = () => {
        mThis.listView.showPage(mThis.getFilterData());
    };

    /* =====================================================
     * 9. ENTRY POINT
     * ===================================================== */
    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.reload();
    };

    return mThis;
})();
