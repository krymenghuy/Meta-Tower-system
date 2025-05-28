"use strict";

var RegisterDeceasedComponent = (function () {
    const mThis = {};
    mThis.title_prop = " Register Deceased";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_register_deceased_component");
    mThis.self = mThis.jm[0];
    mThis.btnAdd = mThis.self.querySelector("#_btnRegisterDeceased");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_register_deceased");
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_register_deceased");

    mThis.cols = [

        {
            title: "Member ID",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.code ?? 'null'}</span>`,
        },
        {
            title: "Member Name",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.member_name ?? ''}</span>`,
        },

        {
            title: "Name",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.name ?? ''}</span>`,
        },
        {
            title: "Gender",
            className: "align-middle text-capitalize",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="text-primary-custom">${sexLabel}</span>`;
            }
        },

        {
            title: "Relation",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.relation ?? ''}</span>`,
        },
        {
            title: " Date of Birth",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.date_of_birth ?? ''}</span>`,
        },
        {
            title: "Date of Death",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.date_of_death ?? ''}</span>`,
        },
         {
            title: "Burial Date",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.burial_date ?? ''}</span>`,
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
            fetchApi: `${main_view.base_url}/ypg/deceased-registration/list-paginate`,
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
            RegisterDeceasedDialog.show(op);
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
                    name: "edit_register_deceased"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_register_deceased"
                },
            ],
            adjustPosition: {
                top: -200,
                left: -300
            },

             onClick:(menuLink, id, name)=>{
                switch(name){


                    case 'edit_register_deceased':{
                      mThis.editRegister(id, menuLink);
                      break;
                    }
                    case 'delete_register_deceased':{
                        mThis.deleteRegister(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }


    mThis.editRegister = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
            }
        };

        if (!AuthManager.allowed(241)) return;
        RegisterDeceasedDialog.show(op);
    }

    mThis.deleteRegister = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.RegisterDeceasedListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this record?', {
            title: 'Delete record',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/ypg/deceased-registration/delete`, op, false, false, false).then(res => {
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
        vsapi.call(`${main_view.base_url}/ypg/deceased-registration/details`, null, null, null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
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


const RegisterDeceasedDialog = (() => {
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
                            <div class="form-group col-12">
                                <label for="member_id" class="form-label" vslang="titles.Member"></label>
                                 <span class="text-danger" >*</span>
                                <select id="member_id" name="nationality_id" class="form-control data-input" data-field="member_id"></select>
                            </div>
                            <div class="form-group col-4">
                                <label for="relation" class="form-label" vslang="titles.Relation"></label>
                                 <span class="text-danger" >*</span>
                                <input  name="relation" class="form-control data-input" data-field="relation">
                            </div>
                            <div class="form-group col-4">
                                <label for="name" class="form-label" vslang="titles.Name"></label>
                                 <span class="text-danger" >*</span>
                                <input id="name" name="name" class="form-control data-input" data-field="name">
                            </div>
                            <div class="form-group col-4">
                                <label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>
                                 <span class="text-danger" >*</span>
                                <select id="sex" class="form-control data-input" data-field="sex">
                                    <option value="">(Select Sex)</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>


                            <div class="form-group col-4">
                                <label for="date_of_birth" class="form-label" vslang="titles.Date of birth"></label>
                                 <span class="text-danger" >*</span>
                                <input  name="date_of_birth" class="form-control data-input" data-field="date_of_birth">
                            </div>
                             <div class="form-group col-4">
                                <label for="date_of_death" class="form-label" vslang="titles.Date of death"></label>
                                 <span class="text-danger" >*</span>
                                <input  name="date_of_death" class="form-control data-input" data-field="date_of_death">
                            </div>
                             <div class="form-group col-4">
                                <label for="burial_date" class="form-label" vslang="titles.Burial date"></label>
                                 <span class="text-danger" >*</span>
                                <input  name="burial_date" class="form-control data-input" data-field="burial_date">
                            </div>




                        </div>`
                        ].join("");
                    },

                    contentCreated: (me) => {
                        DateTimePicker.init(me.controls.burial_date);
                         DateTimePicker.init(me.controls.date_of_death);
                          DateTimePicker.init(me.controls.date_of_birth);




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
                        createTitle: "Register",
                        modifyTitle: "Edit register",
                        targetProp: "deceased_registration",
                        api: {
                            endpoint: [main_view.base_url, "/ypg/deceased-registration/form-options",].join(""),
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

                                vsapi.call([main_view.base_url, "/ypg/deceased-registration/save",].join(""), op, btn, null).then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Register has been updated successfully"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New register has been added successfully"
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
