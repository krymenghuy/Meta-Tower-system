"use strict";

var MemberComponent = new (function () {
    const mThis = this;
    
    this.title_prop = "Member Management";
    this.base_url = main_view.base_url;
    this.self = main_view.VSAppContent.querySelector("#_main_member_component");
    this.btnAdd = mThis.self.querySelector("#_btnAddMember");
    this.divFilter = mThis.self.querySelector("#_divFilter_member");
    this.elFilter_status = mThis.self.querySelector('#el_status');
    this.elLeaveType = mThis.self.querySelector("#el_leave_type");
    this.elSearch = mThis.self.querySelector("#_search_member");

    this.cols = [

        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "photo",
            className: "align-middle",
            data:(data) => `<img class="image-student-tbl" src="${data.image_url || `${main_view.base_url}/assets/images/logo/logo_add.png`}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>`,
        },
        {
            title: "Member ID",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-yp-custom">${data.code ?? 'N/A'}</span>`,
        },
        {
            title: "Name",
            className: "align-middle  text-capitalize ",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class=" d-block text-yp-custom  text-break" style="width:128px; word-break:break-word;">${data.name ?? ''}</span>
                        <small class="text-muted">${sexLabel}</small>`;
            }
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data, index, tr) => {

                return `<div class="d-flex flex-column">
                            <div class="d-flex">
                                <span class="text-nowrap text-yp-custom">${data.phone_number}</span>
                            </div>
                            
                        </div>`;
            },

        },
    
        {
            title: "Telegram",
            className: "align-middle",
            data: (data) => {
                if (data.telegram_link && data.telegram_link.trim() !== '') {
                    const url = data.telegram_link.trim();
                    const displayText = url.replace(/^https?:\/\/t\.me\//, '');

                    const deepLink = displayText.startsWith('+')
                        ? `tg://resolve?phone=${displayText.replace(/^\+/, '')}`
                        : `tg://resolve?domain=${displayText}`;

                    return `<a href="${url}"
                            onclick="event.preventDefault(); window.location='${deepLink}';"
                            class="text-decoration-none"
                            target="_blank"
                            title="Open in Telegram"
                            aria-label="Telegram">
                                <i class="fa-brands fa-telegram" style="font-size:1.2rem; color:#229ED9;"></i>
                            </a>`;
                }

                return '<span class="text-muted">N/A</span>';
            }
        },

        {
            title: "Nationality",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-nowrap text-yp-custom">${data.nationality ?? ''}</span>`,
        }, 
       
       {
            title: "Address",
            className: "align-middle text-capitalize",
            data: (data, index, tr) => {
                return `
                    <div class="text-break text-yp-custom" style="width:150px; word-break:break-word;">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i>${data.address ?? 'N/A'}
                    </div>
                `;
            }
        },

        {
            title: "Expiration",
            className: "align-middle text-capitalize",
            data: (data) => {
                if (data.is_expiry == 0) {
                    return `<span class="text-yp-custom">Permanent</span>`;
                }
                const dateStr = data.expiration_date ?? '';
                if (!dateStr) {
                    return `<span class="text-muted">N/A</span>`;
                }
                const today = new Date().setHours(0, 0, 0, 0);
                const expiration_date = new Date(dateStr).setHours(0, 0, 0, 0);
                if (expiration_date < today) {
                    return `<span class="text-yp-custom"><i class="fas fa-exclamation-circle me-1 text-danger"></i>${dateStr} <p class="p-0 mb-0"><small class="text-danger">(Expired Date)</small></p></span>`;
                }
                if (expiration_date === today) {
                    return `<span class="text-warning"><i class="fas fa-exclamation-triangle me-1"></i>${dateStr} (Expires Today)</span>`;
                }
                return `<span class="text-yp-custom">${dateStr}</span>`;
            },
        },
        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'text-info';

                if (status === 'inactive') {
                    cls = 'text-danger border border-danger rounded px-2 py-1 d-inline-block';
                } else if (status === 'active') {
                    cls = 'text-success border border-success rounded px-2 py-1 d-inline-block';
                }

                return `<span class="${cls} text-capitalize">${data.status ?? ''}</span>`;
            },
        },
        //    {
        //         title: "Status",
        //         className: "align-middle",
        //         data: (data) => {
        //             const status = (data.status ?? '').toLowerCase();
        //             let cls = 'text-info';

        //             if (status === 'inactive') {
        //                 cls = 'text-danger border border-danger rounded px-2 py-1 d-inline-block';
        //             } else if (status === 'active') {
        //                 cls = 'text-success border border-success rounded px-2 py-1 d-inline-block';
        //             }

        //             return `<span class="${cls} text-capitalize">${data.status ?? ''}</span>`;
        //         },
        //     },

        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold">${data.update_user ?? ''}</span>
                    <small class="text-left text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            // data: function (data, row, display) {
            //     return `
            //        <div class="d-flex justify-content-center align-items-center">
            //             <div class="text-center gap-2 d-flex flex-wrap">
            //                <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
            //                     <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
            //                 </a>
            //             </div>
            //         </div>
            //     `;
            // }

            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-outline-yp-custom rounded-3 text-nowrap">
                           <span vslang="buttons.Actions">Action</span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.MemberListView = new ListView('_member_list', {
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
                    mThis.MemberListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            MemberDialog.show(op);
        };


        const pr_tbl = mThis.MemberListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 220) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 220) + 'px';
        }
        mThis.tblMembers = mThis.MemberListView.getTable();
        mThis.initDropdownMenus(mThis.tblMembers);


     

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.MemberListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.MemberListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    this.getFilterData = () => {
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

    this.initDropdownMenus = (table) => {
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

    this.changeStatus = (id, lnk) => {
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
                name: "Active"
            },
            {
                status_id: "2",
                name: "Inactive"
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
                        mThis.MemberListView.showPage(mThis.getFilterData());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }

    this.editMember = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.MemberListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(241)) return;
        MemberDialog.show(op);
    }

    this.deleteMember = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.MemberListView.showPage(mThis.getFilterData());
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
                        mThis.MemberListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    this.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/ypg/member/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'member_status', true, 'All Statuses', null);
                if(typeof onFinish ==='function') onFinish();
            })
    }

    this.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self,mThis.title_prop);
            mThis.MemberListView.showPage(mThis.getFilterData());
        });
        
    };
})();


const MemberDialog = (() => {
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
                                <label for="name" class="form-label" vslang="titles.Name"></label>
                                <input name="name" class="form-control data-input" data-field="name">
                            </div>
                              <div class="form-group col-6">
                                <label for="phone_number" class="form-label" vslang="titles.Phone"></label>
                                <input type="number" name="phone_number" class="form-control data-input" data-field="phone_number">
                            </div>
                            <div class="form-group col-4">
                                <label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>
                                <select class="form-control data-input" data-field="sex">
                                    <option value="">(Select Sex)</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group col-4">
                                <label for="nationality_id" class="form-label" vslang="titles.Nationality"></label>
                                <select name="nationality_id" class="form-control data-input" data-field="nationality_id"></select>
                            </div>
                          
                            <div class="form-group col-4">
                                <label for="is_expiry" class="form-label text-primary-custom" vslang="titles.Expiration"></label>
                                <select name="is_expiry" class="form-control data-input" data-field="is_expiry">
                                    <option value="">(Select)</option>
                                    <option value="0">Permanent</option>
                                    <option value="1">Will Expire</option>
                                </select>
                            </div>
                            <div class="form-group col-4 expiry-wrapper" style="display: none;">
                                <label for="expiration" class="form-label" vslang="titles.Expiration"></label>
                                <input name="expiration" class="form-control data-input" data-field="expiration">
                            </div>
                            <div class="form-group col-6 d-none" >
                                <label for="status_id" class="form-label" vslang="titles.Status_id"></label>
                                <input  name="status_id" class="form-control data-input" data-field="status_id">
                            </div>
                            <div class="form-group col-12">
                                <label for="address" class="form-label" vslang="titles.Address"></label>
                                <textarea  class="form-control data-input" data-field="address"></textarea>
                            </div>
                        </div>`
                    ].join("");
                },

                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.expiration);

                    me.controls.is_expiry.onchange = (e) => {
                        const expiryWrapper = me.controls.expiration.closest('.expiry-wrapper');
                        if (expiryWrapper) {
                            expiryWrapper.style.display = e.target.value == "1" ? "block" : "none";
                        }
                    };


                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationality",
                        textField: "nationality",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Add Member",
                    modifyTitle: "Edit Member",
                    targetProp: "member_details",
                    api: {
                        endpoint: [main_view.base_url, "/ypg/member/form-options",].join(""),
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

                            vsapi.call([main_view.base_url, "/ypg/member/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Member has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New member has been added successfully"
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
