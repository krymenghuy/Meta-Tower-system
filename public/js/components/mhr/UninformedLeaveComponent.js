// "use strict";

// var UninformedLeaveComponent = (function () {
//     const mThis = {};
//     mThis.title_prop = "Uninformed Leave";
//     mThis.base_url = main_view.base_url;
//     mThis.self = main_view.VSAppContent.querySelector("#_main_emp_Uninform_leave_component");
    
//     mThis.btnAdd = mThis.self.querySelector("#_btnAddLeave");
//     mThis.divFilter = mThis.self.querySelector("#_divFilter_emp_leave");
//     // mThis.elFilter_leaveType = mThis.self.querySelector('#el_leave_type');
//     mThis.elFilter_status = mThis.self.querySelector('#el_status');
//     mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
//     mThis.elSearch = mThis.self.querySelector("#_search_leave");

//     mThis.cols = [
//         {
//             transTitle: "",
//             className: 'align-middle',
//         },
//         {
//             transTitle: "titles.Employee ID",
//             className: 'align-middle text-nowrap',
//             data: (data, index, tr) => {
//                 return `<span>${data.emp_code ?? '-'}</span>`;
//              }
//         },

//         {
//             transTitle: "titles.Name",
//             className: "align-middle text-nowrap",
//             data: (data, index) => {
//                 return `
//                         <div class="d-flex flex-column">
//                             ${data.employee_name ?? "-"}
//                             <span class="d-block text-muted" style="font-size:12px;">${data.position ?? "-"}</span>
//                         </div>`;
//             },
//         },

//         {
//             transTitle: "titles.Leave Type",
//             className: "align-middle text-nowrap",
//             data: (data, index, tr) => {
//                 return `<span class="text-nowrap text-prm-custom">${data.leave_type ?? ''}</span>`;
//             }
//         },
//         {
//             transTitle: "titles.Start Date",
//             className: "align-middle text-center text-nowrap",
//             data: (data) => {
//                 return `
//                     <span class="badge bg-light text-prm-custom border px-3 py-2">
//                         <i class="fa-regular fa-calendar me-1"></i>
//                         ${data.start_date ?? "-"}
//                     </span>
//                 `;
//             },
//         },
//         {
//             transTitle: "titles.End Date",
//             className: "align-middle text-center text-nowrap",
//             data: (data) => {
//                 return `
//                     <span class="badge bg-light text-prm-custom border px-3 py-2">
//                         <i class="fa-regular fa-calendar-check me-1"></i>
//                         ${data.end_date ?? "-"}
//                     </span>
//                 `;
//             },
//         },
//         {
//             transTitle: "titles.Leave Duration",
//             className: "align-middle text-center text-nowrap",
//             data: (data) => {
//                 const days = Number(data.leave_days ?? 0);
//                 return `
//                     <span style="min-width: 100px;" class="badge bg-light text-danger-emphasis border px-2 py-2">
//                         <i class="fa-regular fa-clock me-1"></i>
//                         ${days} ${days === 1 ? "Day" : "Days"}
//                     </span>
//                 `;
//             }
//         },
//         {
//             transTitle: "titles.Remark",
//             className: "align-middle text-nowrap",
//             data: (data, index, tr) => {
//                 return `
//                     <div class="text-primary-prm text-capitalize" style="width:250px;">
//                         <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
//                     </div>
//                 `;
//             },
//         },
//         {
//             transTitle: "titles.Status",
//             className: "align-middle",
//             data: (data) => {
//                 const statusId = data.status_id;
//                 const statusKey = (data.status ?? "").toLowerCase();
//                 const map = {
//                     1: {
//                         text: "Pending",
//                         cls: "bg-warning-subtle text-warning border border-warning",
//                     },
//                     2: {
//                         text: "Approved",
//                         cls: "bg-success-subtle text-success border border-success",
//                     },
//                     3: {
//                         text: "Rejected",
//                         cls: "bg-danger-subtle text-danger border border-danger",
//                     },
//                 };
//                 const byName = {
//                     pending:
//                         "bg-warning-subtle text-warning border border-warning",
//                     approved: "bg-success-subtle text-success border border-success",
//                     rejected:
//                         "bg-danger-subtle text-danger border border-danger",
//                 };
//                 const m = map[statusId] || null;
//                 const label =
//                     m?.text ||
//                     (statusKey === "terminated"
//                         ? "Terminated"
//                         : (data.status ?? "—"));
//                 const cls =
//                     m?.cls || byName[statusKey] || "bg-light text-muted";
//                 return `<span class="badge ${cls}" style="min-width: 100px;" data-status_id="${data.status_id}">${label}</span>`;
//             },
//         },
//         {
//             transTitle: "titles.Last Updated",
//             className: "align-middle text-nowrap",
//             data: (data, index, tr) => {
//                 return `<div class="d-flex flex-column">
//                     <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
//                     <small class="text-muted">${data.updated_at ?? ""}</small>
//                 </div>`;
//             },
//         },
//         {
//             className: 'col_action align-middle',
//             data: function (data, row, display) {
//                 return `
//                     <div class="d-flex justify-content-center align-items-center">
//                         <div class="text-center gap-2 d-flex flex-wrap">
//                                 <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
//                                     <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
//                             </a>
//                         </div>
//                     </div>
//                 `;
//             }
//         },

//     ];

//     mThis.init = () => {
//         if (mThis.initAlready) return;

//         mThis.LeaveRequestListView = new ListView('_leave_request_list',{
//             fetchApi : `${main_view.base_url}/mhr/leave/list-paginate`,
//             perPage: 10,
//             apiCluster: main_view.apiCluster,
//             columns: mThis.cols,
//             tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
//             rowCreated:(data,index,tr)=>{
//               tr.dataset.statusid = data.status_id;
//               tr.classList.add('leave');
//               tr.setAttribute('id',['leave_id',data.id].join('')); 

//             }, 
//             listContainerClass: null
//         });

//         mThis.btnAdd.onclick = function (e) {
//             e.preventDefault();

//             let op = {
//                 id: null,
//                 btn: e.target,
//                 onClose: () => {
//                     mThis.LeaveRequestListView.showPage(mThis.getFilterData());
//                 }
//             };
//             // if (!AuthManager.allowed(240)) return;
//             LeaveRequestDialog.show(op);
//         };

//         mThis.tblLeaves = mThis.LeaveRequestListView.getTable();

//         mThis.initDropdownMenus(mThis.tblLeaves);
//         mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
//         const sh_parent = mThis.pr_tbl.parentElement;
//         sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
//         sh_parent.classList.add("overflow-y-auto");
//         window.onresize = () => {
//             sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
//         }

//         mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{

//             el.onchange =  (e) => {
//            e.preventDefault();
//            mThis.LeaveRequestListView.showPage(mThis.getFilterData());
//             }
//        });

//         mThis.elSearch.addEventListener('keyup', (e) => {
//             e.preventDefault();
//             clearTimeout(mThis.search_timeout);
//             mThis.search_timeout = setTimeout(() => {
//                 mThis.LeaveRequestListView.showPage(mThis.getFilterData());
//             }, 250);
//         });

//         mThis.initAlready = true;
//     };

//     mThis.getFilterData = () => {
//         let p = {
//             status_id: mThis.elFilter_status.value,
//             // leave_type_id: mThis.elFilter_leaveType.value,
//             search_value: mThis.elSearch.value,
//         };

//         mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
//                 const f = el.dataset.field;
//                 p[f] = el.value;
//         });

//         return p;
//     };

//     mThis.initDropdownMenus = (table)=>{
//         const menuOptopns = {
//             containerElement: table,
//             actionButtonClass:"btn_leave_action",
//             cssClass:"bg-white shadow",
//             //menuItemClass:"",
//             menus:[
//                 {
//                     html:'<span class="ps-2  " vslang="titles.Modify Leave">Modify Leave</span>',
//                     icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
//                     cssClass:"border-bottom pb-2",
//                     name:"edit_leave"
//                 },
//                 {
//                     html:'<span class="ps-2  " vslang="titles.Delete Leave">Delete Leave</span>',
//                     icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
//                     cssClass:"border-bottom pb-2",
//                     name:"delete_leave"
//                 },
//             ],
//         //     adjustPosition:{
//         //         top:-200 ,
//         //         left:-300
//         //    },

//             onClick:(menuLink, id, name)=>{
//                 switch(name){
//                     case 'edit_leave':{
//                       mThis.editLeave(id, menuLink);
//                       break;
//                     }
//                     case 'delete_leave':{
//                         mThis.deleteLeave(id, menuLink);
//                         break;
//                       }

//                     default:{
//                       break;
//                     }
//                 }
//             }
//         }
//         new VSDropdownMenu(menuOptopns);
//     }

   

//     mThis.editLeave = (id, menuLink) => {

//         let op = {
//             id: id,
//             btn: menuLink,
//             onClose: () => {
//                 mThis.LeaveRequestListView.showPage(mThis.getFilterData());
//             }
//         };
//         // if (!AuthManager.allowed(241)) return;
//         LeaveRequestDialog.show(op);
//     }

//     mThis.deleteLeave = (id, menuLink) => {
//         let op = {
//             id: id,
//             btn: menuLink,
//             onClose: () => {
//                 mThis.LeaveRequestListView.showPage(mThis.getFilterData());
//             }
//         };
//         // if (!AuthManager.allowed(242)) return;
//         cv_interact.confirm('Delete this leave request?',{
//             title: 'Delete Leave Request',
//             context: 'delete',
//             confirmButtonText:"Delete"
//         },function(e){
//             if(e){
//                 vsapi.call(`${main_view.base_url}/mhr/leave/delete`,op,false,false,false).then(res => {
//                     if(res.status_code == 200){
//                         cv_interact.success('Deleted successfully');
//                         mThis.LeaveRequestListView.showPage();
//                     }
//                 })
//             }
//             else {
//                 cv_interact.error(res.error_message);
//             }
//         });
//     }

//     mThis.prepareFormOptions = () => {
//         vsapi.call(`${main_view.base_url}/mhr/leave/form-options`, null, null, null)
//             .then(res => {
//             const d = res.status_code == 200 ? res.data : {};
//             VSUtil.setComboItems(mThis.elFilter_status,d.status,'id','leave_status',"",LocaleManager.trans("All Statuses", "titles"),"");
//             VSUtil.setComboItems(mThis.elLeaveType,d.leave_types,'id','leave_type',"",LocaleManager.trans("All Types", "titles"),"");
//         })
//     }

//     mThis.show = function () {
//         mThis.init();
        
//         mThis.prepareFormOptions();
//         mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
//            main_view.setContentView(mThis.self, mThis.title_prop);
//         });
//     }
//     return mThis;
// })();


"use strict";
var UninformedLeaveComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Uninformed Leaves";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_leave_unform_component");
    
    // mThis.btnAdd = mThis.self.querySelector("#_btnAddLeave");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_leave");
    // mThis.elFilter_leaveType = mThis.self.querySelector('#el_leave_type');
    mThis.elFilter_wark_shift = mThis.self.querySelector('#el_wark_shift');
    // mThis.elFilter_session = mThis.self.querySelector('#el_leave_session');
    mThis.elSearch = mThis.self.querySelector("#_search_uninform_leave");
    mThis.divListView = mThis.self.querySelector('#_leave_unform_list');

    mThis.cols = [

        {
            title: "Day",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
                const employees = data.employees ?? [];
            let rows = '';

            const day = `<div class="d-flex align-items-center" style="min-width:205px; height:72px;"><span class="text-primary-custom">${data.day}</span></div>`;
            employees.forEach(() => {
                rows += day;
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

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView(mThis.divListView,{
            fetchApi : `${main_view.base_url}/mhr/leave/uninformed`,
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
        mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-auto");
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

    mThis.initDropdownMenus = (table)=>{
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

        let status_id = Validator.properCase(tr? tr.dataset.status_id: "");

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
                mThis.LeaveRequestListView.showPage();
            }
        };

        LeaveRequestDialog.show(op);
    }

    mThis.deleteLeaveRequest = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage();
            }
        };
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

    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/mhr/leave/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};

            VSUtil.setComboItems(mThis.elFilter_wark_shift,d.work_shifts,'id','name',true,'All Work Shifts',d.work_shifts[0].id);
            // VSUtil.setComboItems(mThis.elFilter_session,d.sessions,'id','session',true,'All Sessions',null);
            // VSUtil.setComboItems(mThis.elFilter_leaveType,d.leave_types,'id','leave_type',true,'All',null);
            onFinish(null);
        })
    }

    mThis.show = function () {
        mThis.init();
        
        mThis.prepareFormOptions(()=>{
            mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
                main_view.setContentView(mThis.self, mThis.title_prop);
            });
        });
    };
    return mThis;
})();


