"use strict";

var RegisterDeceasedComponent = (function () {
    const mThis = {};
    mThis.title_prop = " Register Deceased";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_register_deceased_component");
    mThis.self = mThis.jm[0];
    mThis.btnAdd = mThis.self.querySelector("#_btnRegisterDeceased");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_register_deceased");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_register_deceased");

    mThis.cols = [

        {
            title: "Register Deceased",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.code ?? 'null'}</span>`,
        },
        {
            title: "Section / Zone",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.name ?? ''}</span>`,
        },
        {
            title: "Row and Position",
            className: "align-middle text-capitalize",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="text-primary-custom">${sexLabel}</span>`;
            }
        },

        {
            title: "Location Note",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.phone_number ?? ''}</span>`,
        },
        {
            title: " Reserved By",

            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.email ?? ''}</span>`,
        },
        {
            title: "Used by",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.email ?? ''}</span>`,
        },

        {
            title: "Status",
            className: "align-middle",
            data: (data, a, b) => {
                const cls = data.status ? data.status.toLowerCase() === 'inactive' ? 'text-warning' : (data.status.toLowerCase() === 'active' ? 'text-success' : 'text-info') : 'text-info';
                return `<span class="p-2 ${cls} text-white rounded-3 text-capitalize">${data.status ?? ''}</span>`;
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

        mThis.RegisterDeceasedListView = new ListView('_register_deceased_list', {
            fetchApi: `${main_view.base_url}/ypg/member/list-paginate`,
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
                    mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            // MemberDialog.show(op);
        };

        mThis.tblLeaves = mThis.RegisterDeceasedListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);


        mThis.pl_container = mThis.RegisterDeceasedListView.getListContainer();
        const pl_parent = mThis.pl_container.parentElement;
        pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        window.onresize = () => {
            pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
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
                    name: "edit_member"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_member"
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
                    case 'edit_member': {
                        mThis.editMember(id, menuLink);
                        break;
                    }
                    case 'delete_member': {
                        mThis.deleteMember(id, menuLink);
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
            dataLabel: "Member status",
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
                vsapi.call(`${mThis.base_url}/ypg/member/update-status`, p).then(res => {
                    if (res.status_code === 200) {
                        // mThis.elFilter_leave_request_status.value = d.value;
                        InputBox2.close();
                        // mThis.elFilter_leave_request_status.dispatchEvent ( new Event('change'));
                        cv_interact.success('The leave request status has been updated');
                        // if(tr) tr.dataset.statuscode = d.value;
                        mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }

    mThis.editMember = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(241)) return;
        RegisterDeceasedDialog
            .show(op);
    }

    mThis.deleteMember = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this member?', {
            title: 'Delete Member',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/ypg/member/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        cv_interact.success('Deleted successfully');
                        mThis.RegisterDeceasedListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/ypg/member/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'member_status', true, 'All Statuses', null);
            })
    }

    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.RegisterDeceasedListView.showPage(mThis.getFilterData(), null, () => {
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(200);
        });
    }
    return mThis;
})();


const RegisterDeceasedDialog
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
                            <div class="form-group col-4">
                                <label for="name" class="form-label" vslang="titles.Name"></label>
                                <input id="name" name="name" class="form-control data-input" data-field="name">
                            </div>
                            <div class="form-group col-4">
                                <label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>
                                <select id="sex" class="form-control data-input" data-field="sex">
                                    <option value="">(Select Sex)</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group col-4">
                                <label for="nationality_id" class="form-label" vslang="titles.Nationality"></label>
                                <select id="nationality_id" name="nationality_id" class="form-control data-input" data-field="nationality_id"></select>
                            </div>
                            <div class="form-group col-4">
                                <label for="email" class="form-label" vslang="titles.Email"></label>
                                <input id="email" name="email" class="form-control data-input" data-field="email">
                            </div>
                            <div class="form-group col-4">
                                <label for="phone_number" class="form-label" vslang="titles.Phone"></label>
                                <input id="phone_number" type="number" name="phone_number" class="form-control data-input" data-field="phone_number">
                            </div>
                            <div class="form-group col-4">
                                <label for="is_expiry" class="form-label text-primary-custom" vslang="titles.Expiry"></label>
                                <select id="is_expiry" name="is_expiry" class="form-control data-input" data-field="is_expiry">
                                    <option value="">(Select)</option>
                                    <option value="0">Forever</option>
                                    <option value="1">Expiry</option>
                                </select>
                            </div>
                            <div class="form-group col-6 expiry-wrapper" style="display: none;">
                                <label for="expiry_date" class="form-label" vslang="titles.Expiry Date"></label>
                                <input id="expiry_date" name="expiry_date" class="form-control data-input" data-field="expiry_date">
                            </div>
                            <div class="form-group col-12">
                                <label for="address" class="form-label" vslang="titles.Address"></label>
                                <textarea id="address" class="form-control data-input" data-field="address"></textarea>
                            </div>
                        </div>`
                        ].join("");
                    },

                    contentCreated: (me) => {
                        DateTimePicker.init(me.controls.expiry_date);

                        me.controls.is_expiry.onchange = (e) => {
                            const expiryWrapper = me.controls.expiry_date.closest('.expiry-wrapper');
                            if (expiryWrapper) {
                                expiryWrapper.style.display = e.target.value == "1" ? "block" : "none";
                            }
                        };


                    },
                    configSelect: [
                        {
                            name: "nationality_id",
                            data: "countries",
                            textField: "country",
                            valueField: "id",
                        },

                    ],
                    prepareFormOptions: {
                        createTitle: "Add Slot",
                        modifyTitle: "Edit Slot",
                        targetProp: "slot_details",
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
