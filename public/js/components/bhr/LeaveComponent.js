"use strict";

var LeaveComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_leave_component");
    this.self = this.jm[0];
    this.title_prop = "Leave Requests";
    this.elStatus = this.self.querySelector('#el_status');
    this.btnAdd = this.self.querySelector("#_btnAddLeave");
    this.divFilter = this.self.querySelector("#_divFilter_leave");
    this.elSearch = this.self.querySelector("#_sdl_search_leave");
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');

    this.cols = [
        {
            title: "No",
            className: 'align-middle text-capitalize text-nowrap',
            data: (data, index, i) => { return (index + 1) },

        },

        {
            title: "Name",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.employee ??''}</span>
                                <br/>
                                <span style="font-size: 12px; color: gray;">${data.title ?? ''}</span>
                            </div>
                        </div>`;
            }
        },

        {
            title: "Leave Type",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.leave_type ?? ''}</p>`;
            }
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.remarks ?? ''}</p>`;
            }
        },
        {
            title: "Duration",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
            }
        },
        {
            title: "Status",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = 'text-danger text-center';
                let bg_color = ''; // Default background color

                if ((data.status || '').toLowerCase() === 'approved') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745'; // Green background for success
                } else if ((data.status || '').toLowerCase() === 'pending') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107'; // Yellow background for pending
                } else if ((data.status || '').toLowerCase() === 'rejected') {
                    cls_class = 'text-white text-center border border-danger rounded-5 p-1';
                    bg_color = '#dc3545'; // Red background for in progress
                } else {
                    bg_color = '#6c757d'; // Default gray background for other statuses
                }

                return `<div><a class="d-flex justify-content-left" data-status="${data.status}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:80px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.status}
                            </span>
                        </a></div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                            </a>
                        </div>
                    </div>
                `;
            }
        }

    ];


    // Initialize
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView('_leave_request_list',{
            fetchApi : `${main_view.base_url}/hr/leaves/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white overflow-hidden  header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.LeaveRequestListView.showPage();
                }
            };

            LeaveRequestDailog.show(op);
        };

        const pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.LeaveRequestListView.showPage(mThis.getDataFormFilter());
        })


        mThis.initAlready = true;

    };

    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.LeaveRequestListView) {
                mThis.LeaveRequestListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("LeaveRequestListView is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = e => {
        if (mThis.LeaveRequestListView) {
            mThis.LeaveRequestListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("listView is not defined");
        }
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.status_id = mThis.elStatus.value;
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

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

    this.changeStatus = (id, lnk)=>{
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
                console.log(123,p);

                vsapi.call(`${mThis.base_url}/hr/leaves/update-status`,p).then(res => {
                    if(res.status_code === 200){
                        // mThis.elFilter_leave_request_status.value = d.value;
                        InputBox2.close();
                        // mThis.elFilter_leave_request_status.dispatchEvent ( new Event('change'));
                        cv_interact.success('The leave request status has been updated');
                        // if(tr) tr.dataset.statuscode = d.value;
                        mThis.LeaveRequestListView.showPage(mThis.getDataFormFilter());
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
        LeaveRequestDailog.show(op);
    }

    this.deleteLeaveRequest = (id, menuLink) => {
        let op = {
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
                vsapi.call(`${main_view.base_url}/hr/leaves/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.LeaveRequestListView.showPage();
                    }
                })
            }
        });

    }



    // Show the component
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/leaves/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elSortBy);

            VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All',null);
        })
    }


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.LeaveRequestListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };


});
 
//begin::LeaveRequestDialog using GeneralDialog
const LeaveRequestDailog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{
   
        dialog = dialog || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static', //User click outside form, do not close form 
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-12">
                     <label for="employee" class="form-label" vslang="titles.Name"></label>
                     <select name="employee" class=" data-input"  data-field="emp_id"></select>
                 </div>
                 <div class="form-group  col-12 d.none">
                     <div id="info"></div>
                 </div>
                 <div class="form-group col-6">
                    <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                    <input name="start_date" class="form-control data-input" data-field="start_date" />
                </div>
                <div class="form-group col-6">
                  <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                  <input name="end_date" class="form-control data-input" data-field="end_date" />
                </div>
                 <div class="form-group col-12">
                     <label for="leave_type" class="form-label" vslang="titles.Leave Type"></label>
                     <select name="leave_type" class=" data-input"  data-field="leave_type_id"></select>
                 </div>
                 <div class="form-group col-12">
                     <label for="reason" class="form-label"
                     vslang="titles.Reason"></label>
                     <textarea  type="text" class="form-control data-input" data-field="reason"></textarea>
                 </div>
                
              </div>`].join('');
            },
            contentCreated:(me)=>{
               //Convert field to be DatePicker : start_date and end_date 
               DateTimePicker.init(me.controls.start_date);
               DateTimePicker.init(me.controls.end_date);

            },
            configSelect:[
               {
                 name:"employee",
                 data:'employees',
                 textField:(me, d)=> {return `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.phone_number}</span></div></div>`; },
                 valueField:'id'
               },
               {
                name:"leave_type",
                data:'leave_types',
                textField:"leave_type",
                valueField:'id'
               }
            ],
            buttons:[
               {
                label:'<span class="text-warning">Cancel</span>',
                cssClass:'btn btn-default',
                click:(me,btn)=>{
                    //Close with Cancel button
                    me.hide(false);
                }
               },
               {
                label:'<span>Save</span>',
                cssClass:'btn btn-primary',
                click:(me,btn)=>{
                    const p = me.getData();
                    vsapi.call( [main_view.base_url,'hr/leaves/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Leave Request',
               modifyTitle:'Edit Leave Request',
               targetProp: 'leave_request', 
               api:{
                 endpoint: [main_view.base_url,'/hr/leaves/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               }, 
               onResponse: (me, res)=>{
                 console.log('result from api "/form-options": ', res);
               }  
            },

            onPrepareForm:(me, data)=>{
                 LocaleManager.translateZone(me.divModal);
            }

        });

        dialog.show(op);
     }

    return self;
})();
//end:: LeaveRequestDialog

// ////Previous LeaveRequestDialog to be removed
// const LeaveRequestDailog_old = new function() {
//     const mThis = this;
//     this.self = main_view.VSAppContent.querySelector('#dlg_sdl_add_Leave_Request');
//     this.modal = new bootstrap.Modal(this.self);
//     this.base_url = main_view.base_url;
//     this.options = {};

//     this.btnSave = this.self.querySelector('#dlg_sdl_add_Leave_Request_btn_save');
//     this.elEmployee = this.self.querySelector('#_sdl_name_id');
//     this.elLeaveType = this.self.querySelector('#_sdl_leave_type_id');
//     this.elInfo = this.self.querySelector('#info');
//     this.elTitle = mThis.self.querySelector('.modal-title');
//     this.div_Leave_Request_info = mThis.self.querySelector('#_sdl_Leave_Request_info');


//     this.btnSave.onclick = e => {
//         e.preventDefault();
//         let p = mThis.getDataForm();
         
//         vsapi.call(`${mThis.base_url}/hr/leaves/save`, p, mThis.btnSave, false).then(res => {
//             if (res.status_code === 200) {
//                 mThis.modal.hide();
//                 const d = res.data ?? {};
//                 cv_interact.success('Leave Request Saved Success!');
//                 if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
//             } else {
//                 cv_interact.error(res.error_message);
//             }
//         });
//     };

//     this.prepareData = (id, def, onFinish) => {
//         if (!def) def = {};
//         console.log(555555, id);
//         vsapi.call(`${mThis.base_url}/hr/leaves/form-options`, { id: id }, null).then(res => {
//             let d = res.status_code === 200 ? res.data : {};
//             mThis.elInfo.parentElement.classList.add('d-none');
//             VSUtil.setComboItems(mThis.elEmployee, d.employees, 'id', 'name', true, '(Select Employee)', null);
//             VSUtil.setComboItems(mThis.elLeaveType, d.leave_types, 'id', 'name', true, '(Select Leave Type)', null);
//             console.log(33333, d);
//             mThis.elEmployee.addEventListener('change', () => {
//                 let id = mThis.elEmployee.value;
//                 console.log(22222,id);

//                 vsapi.call(`${mThis.base_url}/hr/employee/details`, { id: id }, null).then(res => {
//                     let d = res.data || {};
//                     console.log(33344, d);

//                     if(d){
//                         mThis.elInfo.parentElement.classList.remove('d-none');
//                         mThis.elInfo.innerHTML =`<div class="d-block border border-info p-2">
//                                                     <div class="d-block ">
//                                                         <span >name :</span>
//                                                         <span >${ d.name }</span>
//                                                     </div>
//                                                     <div class="d-block ">
//                                                         <span >Position :</span>
//                                                         <span >${ d.position}</span>
//                                                     </div>
//                                                 </div>  `;
//                     }

//                 });
//             })
//             onFinish(d);
//         });
//     };

//     this.show = (options = {}) => {
//         mThis.options = options;
//         let id = options.id ?? null;
//         console.log(123);

//         mThis.prepareData(id, {}, (data) => {
//             if (data.leave) {
//                 mThis.elTitle.textContent = "Modify Leave Request Information";
//             } else {
//                 mThis.elTitle.textContent = "Create Leave Request";
//             }
//             mThis.setData(data.leave);
//             mThis.modal.show();
//         });
//     };



//     this.getDataForm = () => {
//         const div = mThis.self;
//         let p = { id: mThis.options.id };

//         div.querySelectorAll('.data-input').forEach(el => {
//             const data_member = el.dataset.field;
//             p[data_member] = el.value;
//         });

//         return p;
//     };

//     this.setData = (d = {}) => {
//         const div = mThis.self;
//         div.querySelectorAll('.data-input').forEach(el => {
//             const data_member = el.dataset.field;
//             console.log(7777,data_member,'|',el);
//             el.value ='';
//         });

      
//         if(!d) return;

//         div.querySelectorAll('.data-input').forEach(el => {
//             const data_member = el.dataset.field;
//             console.log(7777,data_member,'|',el);

//             el.value = d[data_member] || '';
//         });

//     };
// };

