"use strict";

var SlotInfoComponent = (function () {
    const mThis = {};
    mThis.title_prop = " Slot Info";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_slot_info_component");
    mThis.self = mThis.jm[0];
    mThis.btnAdd = mThis.self.querySelector("#_btnSlotInfo");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_slot_info");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_slot_info");

    mThis.cols = [

        {
            title: "Slot Number",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.slot_number ?? 'null'}</span>`,
        },
        {
            title: "Section / Zone",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.zone ?? ''}</span>`,
        },
        {
            title: "Grav Row ",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.grave_row ?? ''}</span>`,
        },
         {
            title: "Position ",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.position ?? ''}</span>`,
        },

        {
            title: "Location Note",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.location_note ?? ''}</span>`,
        },
        {
            title: " Reserved By",

            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.reversed_id ?? ''}</span>`,
        },
        {
            title: "Used by",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.used_id ?? ''}</span>`,
        },

        {
            title: "Status",
            className: "align-middle",
            data: (data, a, b) => {
                const cls = data.status ? data.status.toLowerCase() === 'inactive' ? 'text-warning' : (data.status.toLowerCase() === 'active' ? 'text-success' : 'text-info') : 'text-info';
                return `<span class="p-2 ${cls} text-white rounded-3 text-capitalize">${data.status_id ?? ''}</span>`;
            },
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                            </a>
                        </div>
                    </div>
                `;
            }
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.SlotInfoListView = new ListView('_slot_info_list', {
            fetchApi: `${main_view.base_url}/ypg/grave-slot/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-3 overflow-hidden header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SlotInfoListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            SlotInfoDialog.show(op); 
        };

        mThis.tblLeaves = mThis.SlotInfoListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);


        mThis.pl_container = mThis.SlotInfoListView.getListContainer();
        const pl_parent = mThis.pl_container.parentElement;
        pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        window.onresize = () => {
            pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.SlotInfoListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.SlotInfoListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            // leave_type_id: mThis.elFilter_leaveType.value,
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
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_slot_info"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_slot_info"
                },
            ],
            adjustPosition: {
                top: -200,
                left: -300
            },

            onClick: (menuLink, id, name) => {
                switch (name) {

                    case 'change_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'edit_slot_info': {
                        mThis.editSlotInfo(id, menuLink);
                        break;
                    }
                    case 'delete_slot_info': {
                        mThis.deleteSlotInfo(id, menuLink);
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

    mThis.changeStatus = (id, lnk) => {
        // if(!AuthManager.allowed(337,false))
        //         return;
        //let status_code = Validator.properCase(lnk.dataset.status);
        let tr = lnk.closest('tr');

        let status_id = Validator.properCase(tr ? tr.dataset.status_id : "");

        let inputOptions = {
            title: 'Change Status',
            dataLabel: "Slot Info Status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [{
                status_id: "1",
                name: "Available"
            },
            {
                status_id: "2",
                name: "Reserved"
            }],
            defaultValue: status_id
        };

        InputBox2.show(inputOptions, (d) => {
            if (d) {
                let p = {
                    id: id,
                    status_id: d.value
                };
                if (!AuthManager.allowed(321)) return;
                vsapi.call(`${mThis.base_url}/ypg/grave-slot/update-status`, p).then(res => {
                    if (res.status_code === 200) {
                        // mThis.elFilter_leave_request_status.value = d.value;
                        InputBox2.close();
                        // mThis.elFilter_leave_request_status.dispatchEvent ( new Event('change'));
                        cv_interact.success('The leave request status has been updated');
                        // if(tr) tr.dataset.statuscode = d.value;
                        mThis.SlotInfoListView.showPage(mThis.getFilterData());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }

    mThis.editSlotInfo = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SlotInfoListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(241)) return;
        SlotInfoDialog.show(op);
    }

    mThis.deleteSlotInfo = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SlotInfoListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this slot?', {
            title: 'Delete slot',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/ypg/grave-slot/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        cv_interact.success('Deleted successfully');
                        mThis.SlotInfoListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/ypg/grave-slot/details`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'slot_info_status', true, 'All Statuses', null);
            })
    }

    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.SlotInfoListView.showPage(mThis.getFilterData(), null, () => {
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(200);
        });
    }
    return mThis;
})();


const SlotInfoDialog
    = (() => {
        const self = {};
        let dialog = null;

        self.show = (op) => {
            dialog =
                dialog ||
                new GeneralDialog({
                    cssClass: "modal-lg",
                    backdrop: "static",
                    keyboard: true,
                    createContent: () => {
                        return [
                            `<div class="row">
                            <div class="form-group col-6">
                                <label for="slot_number" class="form-label" vslang="titles.Slot_number"></label>
                                <input id="slot_number" name="slot_number" class="form-control data-input" data-field="slot_number">
                            </div>
                            
                           <div class="form-group col-6">
                                <label for="zone" class="form-label" vslang="titles.Zone"></label>
                                <input  name="zone" class="form-control data-input" data-field="zone">
                            </div>
                            <div class="form-group col-6">
                                <label for="grave_row" class="form-label" vslang="titles.Grave_Row"></label>
                                <input  name="grave_row" class="form-control data-input" data-field="grave_row">
                            </div>
                            
                             <div class="form-group col-6">
                                <label for="position" class="form-label" vslang="titles.Position"></label>
                                <input  name="position" class="form-control data-input" data-field="position">
                            </div>
                            <div class="form-group col-6">
                                <label for="location_note" class="form-label" vslang="titles.Location_note"></label>
                                <input  name="location_note" class="form-control data-input" data-field="location_note">
                            </div>
                            <div class="form-group col-6">
                                <label for="reversed_id" class="form-label" vslang="titles.Reversed_id"></label>
                                <input  name="reversed_id" class="form-control data-input" data-field="reversed_id">
                            </div>
                            <div class="form-group col-6">
                                <label for="used_id" class="form-label" vslang="titles.Used_id"></label>
                                <input  name="used_id" class="form-control data-input" data-field="used_id">
                            </div>
                            <div class="form-group col-6">
                                <label for="status_id" class="form-label" vslang="titles.Status_id"></label>
                                <input  name="status_id" class="form-control data-input" data-field="status_id">
                            </div>
                            

                            
                           
                        </div>`
                        ].join("");
                    },

                    contentCreated: (me) => {
                        // DateTimePicker.init(me.controls.expiry_date);

                    
                    },
                    configSelect: [
                        {
                            name: "member_id",
                            data: "members",
                            textField: "member_name",
                            valueField: "id",
                        },

                    ],
                    prepareFormOptions: {
                        createTitle: "Add Slot",
                        modifyTitle: "Edit Slot",
                        targetProp: "grave_slot",
                        api: {
                            endpoint: [main_view.base_url, "/ypg/slotinfo/form-options",].join(""),
                            params: (op) => {
                                return { id: op.id };
                            },
                        },
                    },

                    onPrepareForm: (me, data) => {
                        LocaleManager.translateZone(me.divModal);
                    },

                    buttons: [
                        {
                            label: '<span class="text-white">Cancel</span>',
                            cssClass: 'btn btn-sm btn-warning',
                            click: (me, btn) => {
                                me.hide(false);
                            },
                        },
                        {
                            label: '<span>Save</span>',
                            cssClass: 'btn btn-sm btn-primary',
                            click: (me, btn) => {
                                const op = me.getData();
                                op.id = me.dataOptions.id;

                                console.log(11, JSON.stringify(op, null, 2));

                                vsapi.call([main_view.base_url, "/ypg/slotinfo/save",].join(""), op, btn, null).then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Slot has been updated successfully"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New slot has been added successfully"
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
