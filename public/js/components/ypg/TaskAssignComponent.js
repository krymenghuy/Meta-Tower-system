"use strict";

var TaskAssignComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Task Assign";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_task_assign_component");
    mThis.self = mThis.jm[0];
    mThis.btnAdd = mThis.self.querySelector("#_btnTaskAssign");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_task_assign");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_task_assign");

    mThis.cols = [


        {
            title: "Member Name",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.member_name ?? ''}</span>`,
        },

        {
            title: "Task Title",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-primary-custom">${data.task_type_title ?? ''}</span>`,
        },

       {
            title: "Assigned Date",
            className: "align-middle text-capitalize",
            data: (data) => {
                return `<span class="text-primary-custom">${
                     (data.assign_date ?? '')
                }</span>`;
            },
        },


        {
            title: "Status",
            className: "align-middle",
            data: (data, a, b) => {
                const cls = data.status ? data.status.toLowerCase() === 'pending' ? 'text-warning' : (data.status.toLowerCase() === 'done' ? 'text-success' : 'text-info') : 'text-info';
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

        mThis.TaskAssignListView = new ListView('_task_assign_list',{
            fetchApi : `${main_view.base_url}/ypg/task-assign/list-paginate`,
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
                    mThis.TaskAssignListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            TaskAssignDialog.show(op);
        };

        mThis.tblLeaves = mThis.TaskAssignListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);


        mThis.pl_container = mThis.TaskAssignListView.getListContainer();
        const pl_parent = mThis.pl_container.parentElement;
        pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        window.onresize = () => {
            pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{

            el.onchange =  (e) => {
           e.preventDefault();
           mThis.TaskAssignListView.showPage(mThis.getFilterData());
            }
       });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.TaskAssignListView.showPage(mThis.getFilterData());
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
                    icon:`<i class="fa fa-exchange fs-5 text-info"></i>`,

                    cssClass:"border-bottom pb-2",
                    name:"change_status"
                },
                {
                    html:'<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_member"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_member"
                },
            ],
            adjustPosition:{
                top:-200 ,
                left:-300
           },

            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'change_status':{
                        mThis.changeStatus(id,menuLink);
                        break;
                    }
                    case 'edit_member':{
                      mThis.editMember(id, menuLink);
                      break;
                    }
                    case 'delete_member':{
                        mThis.deleteMember(id, menuLink);
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

        let status_id = Validator.properCase(tr? tr.dataset.status_id: "");

        let inputOptions = {
            title: 'Change Status',
            dataLabel: "Task assign status",
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
                name: "In progress"
            },
            {
                status_id: "3",
                name: "Done"
            },
        ],
            defaultValue: status_id
        };

        InputBox2.show(inputOptions,(d)=>{
            if(d){
                let p = {
                    id: id,
                    status_id: d.value
                };
                if (!AuthManager.allowed(321)) return;
                vsapi.call(`${mThis.base_url}/ypg/task-assign/update-status`,p).then(res => {
                    if(res.status_code === 200){
                        // mThis.elFilter_leave_request_status.value = d.value;
                        InputBox2.close();
                        // mThis.elFilter_leave_request_status.dispatchEvent ( new Event('change'));
                        cv_interact.success('The leave request status has been updated');
                        // if(tr) tr.dataset.statuscode = d.value;
                        mThis.TaskAssignListView.showPage(mThis.getFilterData());
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
                mThis.TaskAssignListView.showPage(mThis.getFilterData());
            }
        };
        console.log(11,op);

        if (!AuthManager.allowed(241)) return;
         TaskAssignDialog.show(op);
    }

    mThis.deleteMember = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaskAssignListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this task assign?',{
            title: 'Delete Task Assign',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/ypg/task-assign/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted successfully');
                        mThis.TaskAssignListView.showPage();
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
            VSUtil.setComboItems(mThis.elFilter_status,d.statuses,'id','member_status',true,'All Statuses',null);
        })
    }

    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.TaskAssignListView.showPage(mThis.getFilterData(), null,()=>{
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(200);
        });
    }
    return mThis;
})();


const TaskAssignDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="member_id" class="form-label" vslang="titles.Member"></label>
                                 <span class="text-danger" >*</span>
                                <select  name="member_id" class="form-control data-input" data-field="member_id"></select>
                            </div>

                            <div class="form-group col-6">
                                <label for="task_type_id" class="form-label" vslang="titles.Task Type"></label>
                                 <span class="text-danger" >*</span>
                                <select  name="task_type_id" class="form-control data-input" data-field="task_type_id"></select>
                            </div>
                            <div class="form-group col-6 d-none" >
                                <label for="status_id" class="form-label" vslang="titles.Status_id"></label>
                                <input  name="status_id" class="form-control data-input" data-field="status_id">
                            </div>
                            <div class="form-group col-6 expiry-wrapper">
                                <label for="assign_date" class="form-label" vslang="titles.Assign Date"></label>
                                 <span class="text-danger" >*</span>
                                <input  name="assign_date" class="form-control data-input" data-field="assign_date">
                            </div>

                        </div>`
                    ].join("");
                },

                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.assign_date);


                },
                configSelect: [
                    {
                        name: "member_id",
                        data: "members",
                        textField: "member_name",
                        valueField: "id",
                    },

                    {
                        name: "task_type_id",
                        data: "task_types",
                        textField: "task_type_title",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Add Task",
                    modifyTitle: "Edit Task",
                    targetProp: "task_assign",
                    api: {
                        endpoint: [ main_view.base_url,"/ypg/task-assign/form-options",].join(""),
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
                        label:'<span class="text-white">Cancel</span>',
                        cssClass:'btn btn-sm btn-warning',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label:'<span>Save</span>',
                        cssClass:'btn btn-sm btn-primary',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;

                            vsapi.call([main_view.base_url,"/ypg/task-assign/save",].join(""),op,btn,null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Assign task has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New task has been added successfully"
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
