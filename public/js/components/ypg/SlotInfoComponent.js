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
            title: "",
            className: "align-middle text-capitalize",
        },

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
            title: "Grave Row ",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.grave_row ?? ''}</span>`,
        },
         {
            title: "Position ",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.position ?? ''}</span>`,
        },

        {
            title: " Reserved By",

            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.reversed_by ?? 'N/A'}</span>`,
        },
        {
            title: "Used by",
            className: "align-middle text-capitalize ",
            data: (data) => `<span class="text-primary-custom  ">${data.used_by ?? 'N/A'}</span>`,
        },
        {
            title: "Location Note",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.location_note ?? 'N/A'}</span>`,
        },

       {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                let status = data.status ?? '';
                let statusClass = '';

                switch (status) {
                    case 'Used':
                        statusClass = 'text-warning';
                        break;
                    case 'Available':
                        statusClass = 'text-success';
                        break;
                    case 'Reserved':
                        statusClass = 'text-info';
                        break;
                    default:
                        statusClass = 'text-primary-custom';
                }

                return `<span class="${statusClass}">${status}</span>`;
            },
        },

        {
            className: 'col_action align-middle',
            // data: function (data, row, display) {
            //     return `
            //        <div class="d-flex justify-content-center align-items-center">
            //             <div class="text-center gap-2 d-flex flex-wrap">
            //                     <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
            //                     <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
            //                 </a>
            //             </div>
            //         </div>
            //     `;
            // }

            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-outline-dark-custom rounded-3 text-nowrap">
                           <span vslang="buttons.Actions">Action</span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
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


const SlotInfoDialog = (() => {
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
                                <label for="slot_number" class="form-label" vslang="titles.Slot number"></label>
                                 <span class="text-danger" >*</span>
                                <input name="slot_number" class="form-control data-input" data-field="slot_number">
                            </div>
                           <div class="form-group col-6">
                                <label for="zone" class="form-label" vslang="titles.Zone"></label>
                                 <span class="text-danger" >*</span>
                                <input name="zone" class="form-control data-input" data-field="zone">
                            </div>
                            <div class="form-group col-6">
                                <label for="grave_row" class="form-label" vslang="titles.Grave_Row"></label>
                                 <span class="text-danger" >*</span>
                                <input  name="grave_row" class="form-control data-input" data-field="grave_row">
                            </div>

                             <div class="form-group col-6">
                                <label for="position" class="form-label" vslang="titles.Position"></label>
                                 <span class="text-danger" >*</span>
                                <input name="position" class="form-control data-input" data-field="position">
                            </div>
                            <div class="form-group col-6">
                                <label for="reversed_id" class="form-label" vslang="titles.Reversed By"></label>
                                <select name="reversed_id" class="form-control data-input" data-field="reversed_id"></select>
                            </div>

                            <div class="form-group col-6">
                                <label for="used_id" class="form-label" vslang="titles.Used By"></label>
                                <select  name="used_id" class="form-control data-input" data-field="used_id"></select>
                            </div>

                            <div class="form-group col-12">
                                <label for="location_note" class="form-label" vslang="titles.Location_note"></label>
                                <textarea  name="location_note" class="form-control data-input" data-field="location_note">
                            </div>



                        </div>`
                        ].join("");
                    },

                    contentCreated: (me) => {

                    },
                    configSelect: [
                        {
                            name: "reversed_id",
                            data: "members",
                            textField: "member_name",
                            valueField: "id",
                        },
                        {
                            name: "used_id",
                            data: "deceased_names",
                            textField: "deceased_name",
                            valueField: "id",
                        },

                    ],
                    prepareFormOptions: {
                        createTitle: "Add Slot",
                        modifyTitle: "Edit Slot",
                        targetProp: "grave_slot",
                        api: {
                            endpoint: [main_view.base_url, "/ypg/grave-slot/form-options",].join(""),
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
                                op.status_id = 1;

                                if(me.controls.reversed_id.value > 0){
                                   op.status_id = 2;
                                }
                                if(me.controls.used_id.value > 0){
                                    op.status_id = 3;
                                }

                                vsapi.call([main_view.base_url, "/ypg/grave-slot/save",].join(""), op, btn, null).then((res) => {
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
