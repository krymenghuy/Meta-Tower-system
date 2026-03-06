"use strict";
var ReservationComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Reservation Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_reservation_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnReservation");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_reservation");
    mThis.elFilter_status = mThis.self.querySelector('#_reservation_status');
    mThis.elAmenity = mThis.self.querySelector('#amenity_id');
    mThis.elSearch = mThis.self.querySelector("#_search_reservation");


    mThis.cols = [

        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            transTitle: "titles.Amenity",
            className: "align-middle",
           data: (data) => {
                return `<span class="text-primary-custom">${data.amenity_name ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Tenant Name",
            className: "align-middle",
           data: (data) => {
                return `<span class="text-primary-custom">${data.tenant_name ?? ''}</span>
                        <small class="d-block text-muted">${data.phone_number ?? ''}</small>`;
            }
        },
        {
            transTitle: "titles.Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.date ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Start-End Time",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.start_time ?? ''} - ${data.end_time ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Title",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.title ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Description",
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
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'text-info';

                if (status == 'inactive') {
                    cls = 'text-white px-3 py-1 rounded-3 bg-danger d-inline-block';
                } else if (status == 'active') {
                    cls = 'text-white px-3 py-1 rounded-3 bg-success d-inline-block';
                }

                return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle : "titles.Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ReservationListView = new ListView('_reservation_list', {
            fetchApi: `${main_view.base_url}/prm/reservation/list-paginate`,
            perPage: 8,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
               rowCreated:(data,index,tr)=>{


              tr.dataset.statusid = data.status_id;
              tr.classList.add('reservation');
              tr.setAttribute('id',['reservation_id',data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ReservationListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreateReservationDialog.show(op);
        };


        mThis.pr_tbl = mThis.ReservationListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblReservation = mThis.ReservationListView.getTable();

        mThis.initDropdownMenus(mThis.tblReservation);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.ReservationListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {

        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "change_status"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify "></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_reservation"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_reservation"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {

                    case 'change_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'edit_reservation': {
                        mThis.editReservation(id, menuLink);
                        break;
                    }
                    case 'delete_reservation': {
                        mThis.deleteReservation(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    mThis.editReservation = (id, menulink) =>{
        let op = {
            id:id,
            btn:menulink,
            onClose:()=>{;
                mThis.ReservationListView.showPage(mThis.getFilterData());
            }
        };

        CreateReservationDialog.show(op);
    }
     mThis.deleteReservation = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Reservation??', {
            transTitle: 'Delete Reservation',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/reservation/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.ReservationListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    };
    
    
    mThis.changeStatus = (id, link) =>{
        const tr = link.closest('tr');
        const status_id = VSUtil.properCase(tr?.dataset.statusid || "");

        const inputOptions = {
            context:'success',
            transTitle: 'Change Status',
            label: "Reservation Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: "Save",
            requiredMessage: 'Status is not correct!',
            //blankErrorMessage: "Status is not correct!",
            data:[
                {status_id:"1",name:"Available"},
                {status_id:"2",name:"Booked"},
            ],
            defaultValue: status_id,
            onConfirm:(status,btn, me)=>{
                    //if(!AuthManager.allowed(321)) return;
                    const payload = {id, status_id :status.id};
                    vsapi.post(`${mThis.base_url}/prm/reservation/update-status`,payload,{loader:false,agent:btn}).then(res=>{
                        if(res.status_code ===200){
                            me.close();
                            cv_interact.success('Reservation Status has been updated');
                            mThis.ReservationListView.showPage(mThis.getFilterData());
                        }else{
                            me.setError(res.error_message || 'Unable to update status');
                            //cv_interact.error(res.error_message || 'Unable to update status');
                        }
                    });
            }
        };
        InputBox.show(inputOptions);
    };

    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/prm/reservation/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'reservation_status', true, 'Statuses', null);
                VSUtil.setComboItems(mThis.elAmenity, d.amenities, 'id', 'amenity', true, 'Amenities', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ReservationListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();

const CreateReservationDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
               createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                            
                            <div class="col-6">
                                <label style="padding-left:6px;" for="amenity">Amenity</label>
                                <div class="material-input outlined">
                                    <select name="amenity" class="data-input form-control" data-field="amenity_id">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="color:#777777;padding-left:6px;" for="tenant">Tenant</label>
                                <div class="material-input outlined">
                                <input name="tenant" class="data-input form-control" data-field="tenant_id">
                            <!--       <select name="c" class="data-input form-control" data-field="tenant_name"> </select>-->
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="padding-left:6px;">Phone Number</label>
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control"data-field="phone_number"></input>
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="padding-left:6px;">Title / Event</label>
                                <div class="material-input outlined">
                                    <input name="title" class="data-input form-control" data-field="title"></input>
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="padding-left:6px;" for="date">Date</label>
                                <div class="material-input outlined">
                                    <input type="date" name="date" required class="data-input form-control form_input" data-field="date" />
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="padding-left:6px;">Start Time</label>
                                <div class=" material-input outlined">
                                    <input type="time" name="start_time" required class="data-input form-control form_input" data-field="start_time" />
                                </div>
                            </div>
                            <div class="col-6">
                                <label style="padding-left:6px;">End Time</label>
                                <div class=" material-input outlined">
                                    <input type="time" name="end_time" required class="data-input form-control form_input" data-field="end_time" />
                                </div>
                            </div>

                            <div class="col-12">
                                <label style="padding-left:6px;">Description</label>
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                </div>
                            </div>
                        </div>`
                    ].join("");
                },


                contentCreated: (me) => {
                        me.searchTenant= VSSearchInput.init(me.controls.tenant,{
                        type: 'select',
                        prefetch: true,
                        // api:
                        query: {
                            from: 'tenants',
                            select: ['id', 'name','phone_number'],
                            searchFields: { name: 'LIKE',phone_number:'LIKE' }
                        },
                        // showColumnHeader: false,
                        columns:{
                            name: "Name",
                            phone_number: "Phone Number",
                        },

                        onSelect: (tenant) => {
                            me._selectedTenantId = tenant.id;
                            vsapi.post(`${main_view.base_url}/prm/tenant/options-tenant-info`, { tenant_id: tenant.id }, {})
                                .then(res => {
                                    const d = res.data || {};
                                    me.controls.phone_number.value = d.tenant?.phone_number || '';
                                    // me.controls.email.value        = d.tenant?.email || '';
                                    // VSUtil.setComboItems(me.controls.space, d.spaces || [], 'id', 'space_code', '', '-- Select Room / Space --');
                                });
                        }
                    });
                },
                configSelect: [
                    {
                        name: "amenity_id",
                        data: "amenities",
                        textField: "amenity",
                        valueField: "id",
                    },

                    {
                        name: "category_id",
                        data: "amenities",
                        textField: "category",
                        valueField: "id",
                    },
                   

                ],
                prepareFormOptions: {
                    createTitle: "Create Reservation",
                    modifyTitle: "Modify Reservation",
                    targetProp: "reservation_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/reservation/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    // LocaleManager.translateZone(me.divModal);
                    // console.log(12,data);
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if(btnClose) btnClose.classList.add('d-none');
                },


                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: 'btn btn-secondary',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: 'btn btn-primary',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            vsapi.call([main_view.base_url, "/prm/reservation/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Reservation has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New reservation has been added successfully"
                                        );
                                    }
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                        },
                    },
                ],
            });
        dialog.show(op);
    };
    return self;
})();





