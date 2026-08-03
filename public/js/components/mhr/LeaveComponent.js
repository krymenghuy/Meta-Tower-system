"use strict";

var LeaveComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Leave Request";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_emp_leave_component");

    mThis.btnAdd = mThis.self.querySelector("#_btnAddLeave");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_emp_leave");
    // mThis.elFilter_leaveType = mThis.self.querySelector('#el_leave_type');
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_leave");

    mThis.cols = [
        {
            transTitle: "",
            className: 'align-middle',
        },
        {
            transTitle: "titles.Employee ID",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<span>${data.emp_code ?? '-'}</span>`;
             }
        },

        {
            transTitle: "titles.Employee Name",
            className: "align-middle text-nowrap",
            data: (data, index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.employee_name ?? "-"}
                            <span class="d-block text-muted" style="font-size:12px;">${data.position ?? "-"}</span>
                        </div>`;
            },
        },

        {
            transTitle: "titles.Leave Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.leave_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.start_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.End Date",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar-check me-1"></i>
                        ${data.end_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Leave Duration",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                const days = Number(data.leave_days ?? 0);
                return `
                    <span style="min-width: 100px;" class="badge bg-light text-danger-emphasis border px-2 py-2">
                        <i class="fa-regular fa-clock me-1"></i>
                        ${days} ${days === 1 ? "Day" : "Days"}
                    </span>
                `;
            }
        },
          {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = data.status_id;
                const statusKey = (data.status ?? "").toLowerCase();
                const map = {
                    1: {
                        text: "Pending",
                        cls: "bg-warning-subtle text-warning border border-warning",
                    },
                    2: {
                        text: "Approved",
                        cls: "bg-success-subtle text-success border border-success",
                    },
                    3: {
                        text: "Rejected",
                        cls: "bg-danger-subtle text-danger border border-danger",
                    },
                };
                const byName = {
                    pending:
                        "bg-warning-subtle text-warning border border-warning",
                    approved: "bg-success-subtle text-success border border-success",
                    rejected:
                        "bg-danger-subtle text-danger border border-danger",
                };
                const m = map[statusId] || null;
                const label =
                    m?.text ||
                    (statusKey === "terminated"
                        ? "Terminated"
                        : (data.status ?? "—"));
                const cls =
                    m?.cls || byName[statusKey] || "bg-light text-muted";
                return `<span class="badge ${cls}" style="min-width: 100px;" data-status_id="${data.status_id}">${label}</span>`;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:250px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
                    </div>
                `;
            },
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView('_leave_request_list',{
            fetchApi : `${main_view.base_url}/mhr/leave/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
              tr.dataset.statusid = data.status_id;
              tr.classList.add('leave');
              tr.setAttribute('id',['leave_id',data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            LeaveRequestDialog.show(op);
        };

        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);
        mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
        }

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{

            el.onchange =  (e) => {
           e.preventDefault();
           mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
       });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
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

    mThis.initDropdownMenus = (table)=>{
        const menuOptions = {
            containerElement: table,
            actionButtonClass:"btn_leave_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                // {
                //     html:'<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                //     icon:`<i class="fa fa-exchange fs-5"></i>`,

                //     cssClass:"border-bottom pb-2",
                //     name:"change_leave_request_status"
                // },
                 {
                        html: '<span class="ps-2" vslang="titles.Accept"></span>',
                        icon: `<i class="fa-regular fa-square-check fs-5 text-primary"></i>`,
                        name: "accept_request",
                        cssClass: "border-bottom pb-2"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Reject"></span>',
                    icon: `<i class="fa-regular fa-rectangle-xmark fs-5 text-danger-emphasis"></i>`,
                    name: "reject_request",
                    cssClass: "border-bottom pb-2"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Leave"></span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_leave"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Leave"></span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_leave"
                },
            ],

            onShow:(me,container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                menu.accept_request.style.display = (status_id >= 2) ? 'none' : 'block';
                menu.reject_request.style.display = (status_id >= 2) ? 'none' : 'block';
                // menu.edit_request.style.display = (status_id = 2) ? 'none' : 'block';
                // menu.delete_leave.style.display = (status_id >= 2) ? 'none' : 'block';

            },


            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_leave':{
                      mThis.editLeave(id, menuLink);
                      break;
                    }
                    case 'accept_request':{
                        mThis.acceptRequest(id, menuLink);
                        break;
                    }
                    case 'reject_request':{
                        mThis.rejectRequest(id, menuLink);
                        break;
                    }
                    // case 'change_leave_request_status':{
                    //     mThis.changeStatus(id,menuLink);
                    //     break;
                    // }
                    case 'delete_leave':{
                        mThis.deleteLeave(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptions);
    }


    mThis.rejectRequest = (id, menuLink) => {
        let op = {
            id: id
        };

        if (!AuthManager.allowed(259, false)) return;

        Swal.fire({
            input: "textarea",
            inputLabel: " ",
            inputPlaceholder: "Please enter reason why reject this request",
            reverseButtons: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "Remark required!";
                } else {
                    op.remarks = value;
                    // Pass menuLink instead of null to match structural view behavior
                    vsapi.call(`${main_view.base_url}/mhr/leave/reject-leave`, op, menuLink).then((res) => {
                        if (res.status_code === 200) {
                            mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                            cv_interact.success(res.message || "Rejected successfully");
                        } else {
                            cv_interact.error(res.error_message || "Something went wrong!");
                        }
                    });
                }
            },
        });
    };

    mThis.acceptRequest = (id, menuLink) => {
        if (!AuthManager.allowed(260, false)) return;
        cv_interact.confirm(
            'accept_request',
            {
                'langSection': "message_box_default",
                'translate': true,
                // 'title': "accepted",
                'context': 'update',
                'confirmButtonText': LocaleManager.trans('Accept', 'buttons')
            },
            (e) => {
                if (!e) return;
                vsapi.call(
                    `${main_view.base_url}/mhr/leave/accept-leave`,
                    { id },
                    false
                )
                .then(res => {
                    if (res.status_code === 200) {
                        // FIXED: Changed from ServiceRequestListView to LeaveRequestListView
                        mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                        cv_interact.success(LocaleManager.trans('complete_success_request', 'message_box_default'));
                    } else {
                        cv_interact.error(res.error_message || 'Something went wrong');
                    }
                })
                .catch((err) => {
                    // Log the actual error to the console for easier future debugging
                    console.error("Accept request failed: ", err);
                    cv_interact.error('Network error');
                });
            }
        );
    };




    mThis.editLeave = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(241)) return;
        LeaveRequestDialog.show(op);
    }

    mThis.deleteLeave = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('delete_leave_request',{
            title: 'Delete Leave Request',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/leave/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted successfully');
                        mThis.LeaveRequestListView.showPage();
                    } else {
                        cv_interact.error(res.error_message || 'An error occurred while deleting');
                    }
                })
            }
        });
    }

     mThis.changeStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";
        // if (!AuthManager.allowed(268,false)) return;
        const inputOptions = {
            context: "success",
            title: `${LocaleManager.trans('Change Status', "titles")}`,
            label: "Leave Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: `${LocaleManager.trans('Save', "buttons")}`,
            cancelButtonText: `${LocaleManager.trans('Close', "buttons")}`,
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Pending" },
                { status_id: "2", name: "Approved" },
                { status_id: "3", name: "Rejected" },
            ],
            defaultValue: status_id,
            onConfirm: (status, btn, me) => {
                const payload = { id, status_id: status.status_id };
                vsapi
                    .post(
                        `${mThis.base_url}/mhr/leave/update-status`,
                        payload,
                        { loader: false, agent: btn },
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success("update_success_status");
                            mThis.LeaveRequestListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            me.setError(res.error_message);
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };

    mThis.prepareFormOptions = () => {
        vsapi.call(`${main_view.base_url}/mhr/leave/form-options`, null, null, null)
            .then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elFilter_status,d.status,'id','leave_status',"",LocaleManager.trans("All Statuses", "titles"),"");
            VSUtil.setComboItems(mThis.elLeaveType,d.leave_types,'id','leave_type',"",LocaleManager.trans("All Types", "titles"),"");
        })
    }

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
           main_view.setContentView(mThis.self, mThis.title_prop);
        });
    }
    return mThis;
})();

const LeaveRequestDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <select data-style="material" name="employee_id" class="form-control data-input" placeholder="${LocaleManager.trans('Employee', 'labels')}"  data-field="emp_id"></select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="leave_type" class="form-control data-input" placeholder="${LocaleManager.trans('Leave Type', 'labels')}"  data-field="leave_type_id"></select>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="start_date" class="form-control data-input" data-field="start_date" required />
                                    <label vslang="labels.Start Date"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="end_date" class="form-control data-input" data-field="end_date" required />
                                    <label vslang="labels.End Date"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>`,].join("");
                },
                contentCreated: (me) => {
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
                        // textField:"name",
                        valueField: "id",
                    },
                    {
                        name: "leave_type",
                        data: "leave_types",
                        textField: "leave_type",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            const payload = {
                                ...p,
                                status_id: me.dataOptions.id ? p.status_id : 1
                            }

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/leave/save"].join(
                                        ""
                                    ),
                                    payload,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_set_leave_successfully");
                                        }
                                        else
                                        {
                                            cv_interact.success("set_leave_successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Leave Request",
                    modifyTitle: "vslang:titles.Modify Leave",
                    targetProp: "leave_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/leave/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
     }

    return self;
})();
//end:: LeaveRequestDialog
