"use strict";

var LeaveComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Leave Requests";
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
            title: "Employee ID",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
                return `<span style="font-size: 12px; class=""><span class="text-primary-custom">${data.emp_code ?? 'null'}</span></span>`;
             }
        },

        {
            title: "Employee Info",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                         <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png" }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 12px; font-weight: bold;">${
                                    data.employee ?? ""
                                }</span>
                                <br/>
                                <span class="text-muted" style="font-size: 11px; ">${
                                    data.title ?? ""
                                }</span>
                            </div>
                        </div>`;
            }
        },

        {
            title: "Leave Type",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<span style="font-size: 12px; class="p-0 m-0">${data.leave_type ?? ''}</span>`;
            }
        },

        {
            title: "Duration",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                            <small class="p-0 m-0 text-primary" style="font-size:11px;">${data.start_date} - ${data.end_date}</small>
                            <span class="text-success" style="font-size:11px;">(${data.leave_days} day)</span>
                        </div>`;
            }
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<span style="font-size: 12px; class="p-0 m-0">${data.remarks ?? 'No remarks'}</span>`;
            }
        },
        {
            title: "Created By",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                    <span class="fw-semibold">${data.update_user}</span>
                    <span>
                        <small class="text-muted">${data.update_date}</small>
                    </span>
                </div>`;

            }
        },
       {
            title: "Status",
            className: 'align-middle status',
            data: function (data, index, tr) {
                const status = (data.status || '').toLowerCase();
                let bgColor = '#dee2e6';
                let textColor = '#000';

                if (status === 'approved') {
                    bgColor = '#d4edda';
                    textColor = '#155724';
                } else if (status === 'pending') {
                    bgColor = '#fff3cd';
                    textColor = '#856404';
                } else if (status === 'rejected') {
                    bgColor = '#f8d7da';
                    textColor = '#721c24';
                }

                return `
                    <span 
                        class="d-inline-block text-center text-capitalize" 
                        style="
                            background-color: ${bgColor};
                            color: ${textColor};
                            padding: 4px 12px;
                            border-radius: 20px;
                            font-size: 0.875rem;
                            min-width: 90px;
                        "
                        data-status="${data.status}" 
                        data-statusid="${data.status_id}" 
                        data-id="${data.id}">
                        ${data.status}
                    </span>
                `;
            }
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

        mThis.LeaveRequestListView = new ListView('_leave_request_list',{
            fetchApi : `${main_view.base_url}/mhr/leave/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-3 overflow-hidden header-uppercase',
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
            if (!AuthManager.allowed(240)) return;
            LeaveRequestDialog.show(op);
        };

        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);
        mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
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
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_leave_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon:`<i class="fa fa-exchange fs-5"></i>`,

                    cssClass:"border-bottom pb-2",
                    name:"change_leave_request_status"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Leave Request">Modify Leave Request</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_leave_request"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Leave Request">Delete Leave Request</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_leave_request"
                },
            ],
            adjustPosition:{
                top:-200 ,
                left:-300
           },

            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'change_leave_request_status':{
                        mThis.changeStatus(id,menuLink);
                        break;
                    }
                    case 'edit_leave_request':{
                      mThis.editLeaveRequest(id, menuLink);
                      break;
                    }
                    case 'delete_leave_request':{
                        mThis.deleteLeaveRequest(id, menuLink);
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

    mThis.changeStatus = (id, lnk)=>{
        // if(!AuthManager.allowed(337,false))
        //         return;
        //let status_code = Validator.properCase(lnk.dataset.status);
        let tr = lnk.closest('tr');

        let status_id = VSUtil.properCase(tr?.dataset.statusid || "");
        console.log(123,status_id);
        

        let inputOptions = {
            title: 'Set Leave Request Status',
            dataLabel: "Leave status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText:"Save",
            blankErrorMessage: "Status is not correct!",
            data: [{
                status_id: "1",
                name: "Pending"
            },
            {
                status_id: "2",
                name: "Approved"
            },
            {
                status_id: "3",
                name: "Rejected"
            }],
            defaultValue: status_id
        };

        InputBox2.show(inputOptions,(d)=>{
            if(d){
                let p = {
                    id: id,
                    status_id: d.value
                };
                if (!AuthManager.allowed(321)) return;
                vsapi.call(`${mThis.base_url}/mhr/leave/update-status`,p).then(res => {
                    if(res.status_code === 200){
                        // mThis.elFilter_leave_request_status.value = d.value;
                        InputBox2.close();
                        // mThis.elFilter_leave_request_status.dispatchEvent ( new Event('change'));
                        cv_interact.success('The leave request status has been updated');
                        // if(tr) tr.dataset.statuscode = d.value;
                        mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }

    mThis.editLeaveRequest = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(241)) return;
        LeaveRequestDialog.show(op);
    }

    mThis.deleteLeaveRequest = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this leave request?',{
            title: 'Delete Leave Request',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/leave/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted successfully');
                        mThis.LeaveRequestListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/mhr/leave/form-options`, null, null, null)
            .then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elFilter_status,d.status,'id','leave_status',true,'All Statuses',null);
            VSUtil.setComboItems(mThis.elLeaveType,d.leave_types,'id','leave_type',true,'All Types',null);
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

//begin::LeaveRequestDialog using GeneralDialog
const LeaveRequestDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                    <div class="form-group col-12">
                        <label for="employee" class="form-label" vslang="titles.Employee"></label>
                        <select name="employee" class="form-control data-input"  data-field="emp_id"></select>
                    </div>
                    <div class="form-group  col-12 d.none">
                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                        <input type="vsdate" name="start_date" class="form-control data-input" data-field="start_date" placeholder="select start date" />
                    </div>
                    <div class="form-group col-6">
                      <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                      <input type="vsdate" name="end_date" class="form-control data-input" data-field="end_date" placeholder="select end date"  />
                    </div>
                    <div class="form-group col-12">
                      <label for="remarks" class="form-label" vslang="titles.remarks"></label>
                      <input name="remarks" class="form-control data-input" data-field="remarks" />
                    </div>
                    <div class="form-group col-12">
                        <label for="leave_type" class="form-label" vslang="titles.Leave Type"></label>
                        <select name="leave_type" class=" data-input"  data-field="leave_type_id"></select>
                    </div>
              </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    //Convert field to be DatePicker : start_date and end_date
                    DateTimePicker.init(me.controls.start_date);
                    DateTimePicker.init(me.controls.end_date);
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
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/leave/save"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated leave request successfully");
                                        }
                                        else
                                        {
                                            cv_interact.success("Added leave request successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Leave Request",
                    modifyTitle: "Edit Leave Request",
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
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
     }

    return self;
})();
//end:: LeaveRequestDialog
