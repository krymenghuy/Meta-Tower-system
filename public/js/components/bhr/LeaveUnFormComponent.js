"use strict";

var LeaveUnFormComponent = new function () {
    const mThis = this;
    this.title_prop = "Uninformed Leaves";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_leave_unform_component");
    this.self = this.jm[0];
    // this.btnAdd = this.self.querySelector("#_btnAddLeave");
    this.divFilter = this.self.querySelector("#_divFilter_leave");
    // this.elFilter_leaveType = this.self.querySelector('#el_leave_type');
    this.elFilter_wark_shift = this.self.querySelector('#el_wark_shift');
    this.elFilter_session = this.self.querySelector('#el_leave_session');
    this.elSearch = this.self.querySelector("#_search_uninform_leave");
    this.divListView = this.self.querySelector('#_leave_unform_list');

    this.cols = [

        {
            title: "Day",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
                const employees = data.employees;
                let rows = '';

                const day = `<div class="d-flex align-items-center " style=" min-width:205px; height:72px;"><span class="text-primary-custom">${data.day}</span></div>`;
                employees.forEach((d,i) => {
                    rows = [rows,day].join('');
                });

                return rows;
             }
        },

        {
            title: "Staff Information",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                const employees = data.employees;
                let rows = '';
                rows = [rows,`<div class="row" style="background-color:; min-width:250px;" >`].join('');

                if (Array.isArray(employees) && employees.length > 0) {
                    employees.forEach((d,i) => {
                        rows = [rows,`
                        <div style="display: flex; align-items: center; height: 72px;">
                            <div class="overflow-hidden rounded-circle p-auto d-flex justify-content-center border bg-white border-4 me-2" style="width: 50px; height: 50px;">
                                <img class="h-100" src="${d.image_url}" alt="" />
                            </div>
                            <div>
                                <span style="font-size: 12px; font-weight: bold;">${d.employee ?? ''}</span>
                                <br/>
                                <span class="text-muted" style="font-size: 11px; ">${d.emp_code ?? ''}</span>
                            </div>
                        </div>
                        `].join('');

                    });
                }
                rows = [rows,`</div>`].join('');

                return rows;

                // return `<div style="display: flex; align-items: center;">
                //             <div class="overflow-hidden rounded-circle p-auto d-flex justify-content-center border bg-white border-4 me-2" style="width: 50px; height: 50px;">
                //                 <img class="h-100" src="${data.image_url}" alt="" />
                //             </div>
                //             <div>
                //                 <span style="font-size: 12px; font-weight: bold;">${data.employee ??''}</span>
                //                 <br/>
                //                 <span class="text-muted" style="font-size: 11px; ">${data.emp_code ?? 'null'}</span>
                //             </div>
                //         </div>`;
            }
        },

        {
            title: "Attendance Scan Information",
            className: "align-middle",
            data: (data, index, tr) => {
                const shifts = data.shifts,
                employees = data.employees ?? [];
                let shift_rows = '';
                let rows = '';
                rows = [rows,`<div class="d-flex gap-2 w-100" style="height: 72px;">`].join('');
                if (Array.isArray(shifts) && shifts.length > 0) {
                    shifts.forEach((shift,i) => {
                        const actionClass = shift.action === "Check In" || shift.action === "CheckIn" ? "bg-green" : shift.action === "Check Out" || shift.action === "CheckOut" ? "bg-gold" : "";
                        rows = [rows,`
                        <div class="shift_card ${actionClass} " style="width:150px !important;">
                            <div class="shift_element">
                                <div class="shift_time">${shift.time}</div>
                                <div class="shift_action">${shift.action}</div>
                            </div>
                            <div class="d-flex justify-content-start align-items-start">
                                <div class="text-end gap-2 d-flex flex-wrap">
                                </div>
                            </div>
                        </div>
                        `].join('');
                    });
                }
                else  {
                    let rows = '';
                    rows = [rows,`<div class="card p-4 bg-secondary no_shifts">No Shift</div>`].join('');
                    shift_rows = [shift_rows,rows].join('');
                }
                rows = [rows,`</div>`].join('');
                employees.forEach((d,i) => {
                    shift_rows = [shift_rows,rows].join('');
                });
                // rows = [rows,`</div>`].join('');

                return shift_rows;
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                // return `<div class="d-flex flex-column">
                //             <span class="text-success" style="font-size:11px;">${data.leave_date}</span>
                //         </div>`;
            }
        },

        // {
        //     className: 'col_action align-middle',
        //     data: function (data, row, display) {
        //         return `
        //            <div class="d-flex justify-content-center align-items-center">
        //                 <div class="text-center gap-2 d-flex flex-wrap">
        //                         <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
        //                         <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
        //                     </a>
        //                 </div>
        //             </div>
        //         `;
        //     }
        // },

    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView(mThis.divListView,{
            fetchApi : `${main_view.base_url}/hr/leave/uninformed`,
            perPage: 3,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table bg-white rounded-3 overflow-hidden header-uppercase',
            listContainerClass: null
        });

        // mThis.btnAdd.onclick = function (e) {
        //     e.preventDefault();

        //     let op = {
        //         id: null,
        //         btn: e.target,
        //         onClose: () => {
        //             mThis.LeaveRequestListView.showPage();
        //         }
        //     };

        //     LeaveRequestDialog.show(op);
        // };

        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();
        mThis.initDropdownMenus(mThis.tblLeaves);
        const pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 240) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 240) + 'px';
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

    this.getFilterData = () => {
        let p = {
            work_shift_id: mThis.elFilter_wark_shift.value,
            // leave_type_id: mThis.elFilter_leaveType.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
                const f = el.dataset.field;
                if(f == 'start_date') p['date'] = el.value;
                p[f] = el.value;
        });

        return p;
    };

    this.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_leave_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon:`<i class="fa-regular fa-exchange fs-5"></i>`,

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
                //console.log(90,menuLink,80,id,70,name);
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

    this.changeStatus = (id, lnk)=>{
        // if(!AuthManager.allowed(337,false))
        //         return;
        //let status_code = Validator.properCase(lnk.dataset.status);
        let tr = lnk.closest('tr');

        let status_id = Validator.properCase(tr? tr.dataset.status_id: "");
        console.log(321,tr,123,status_id);

        let inputOptions = {
            title: 'Set Leave Request Status',
            dataLabel: "Leave status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText:"Save",
            blankErrorMessage: "Status is not correct!",
            data: [{
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
                console.log(123,p);

                vsapi.call(`${mThis.base_url}/hr/leave/update-status`,p).then(res => {
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

    this.editLeaveRequest = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage();
            }
        };

        LeaveRequestDialog.show(op);
    }

    this.deleteLeaveRequest = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Leave Request?',{
            title: 'Delete Leave Request',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/leave/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.LeaveRequestListView.showPage();
                    }

                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    this.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/hr/leave/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};

            VSUtil.setComboItems(mThis.elFilter_wark_shift,d.work_shifts,'id','name',true,'All Work Shifts',d.work_shifts[0].id);
            VSUtil.setComboItems(mThis.elFilter_session,d.sessions,'id','session',true,'All Sessions',null);
            // VSUtil.setComboItems(mThis.elFilter_leaveType,d.leave_types,'id','leave_type',true,'All',null);
            onFinish(null);
        })
    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(()=>{
            mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(250);
            });
        });
    }

};


