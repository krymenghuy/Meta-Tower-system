"use strict";

var LeaveComponent = new function () {
    let mThis = this;
    this.title_prop = "Leave Requests";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_leave_component");
    this.self = this.jm[0];
    this.btnAdd = this.self.querySelector("#_btnAddLeave");
    this.divFilter = this.self.querySelector("#_divFilter_leave");
    // this.elFilter_leaveType = this.self.querySelector('#el_leave_type');
    this.elFilter_status = this.self.querySelector('#el_status');
    this.elSearch = this.self.querySelector("#_sdl_search_leave");

    this.cols = [
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
                         <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 12px; font-weight: bold;">${data.employee ??''}</span>
                                <br/>
                                <span class="text-muted" style="font-size: 11px; ">${data.title ?? ''}</span>
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
            className: 'status text-nowrap text-center align-middle',
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

                return `<a class="d-flex justify-content-center" data-status="${data.status}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:80px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.status}
                            </span>
                        </a>`;
            }
        },
        

    ];


    this.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView('_leave_request_list',{
            fetchApi : `${main_view.base_url}/hr/leave/list-paginate`,
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
                    mThis.LeaveRequestListView.showPage();
                }
            };

            LeaveRequestDialog.show(op);
        };


        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();
        mThis.initDropdownMenus(mThis.tblLeaves);
        this.sh_container = mThis.LeaveRequestListView.getListContainer();

        const sh_parent = mThis.sh_container.parentElement;
        sh_parent.style.height = (window.innerHeight - 245) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 190) + 'px';
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
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,


        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
                const f = el.dataset.field;
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
                console.log(90,menuLink,80,id,70,name);
                
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
                vsapi.call(`${main_view.base_url}/hr/leave/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.LeaveRequestListView.showPage();
                    }
                })
            }
        });

    }



    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/leave/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};

            VSUtil.setComboItems(mThis.elFilter_status,d.status,'id','leave_status',true,'All Statuses',null);
        })
    }


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(250);
            });
                
    }


};

//begin::LeaveRequestDialog using GeneralDialog
const LeaveRequestDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-md',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-12">
                     <label for="employee" class="form-label" vslang="titles.Employee"></label>
                     <select name="employee" class="form-control data-input"  data-field="emp_id"></select>
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
                 textField:(me, d)=> 
                    `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
                // textField:"name",
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

                    p.id = me.dataOptions.id; //get "id" from op

                    vsapi.call( [main_view.base_url,'/hr/leave/save'].join(''), p,btn,null).then(res=>{
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
                 endpoint: [main_view.base_url,'/hr/leave/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
            //    onResponse: (me, res)=>{
            //      console.log('result from api "/form-options": ', res);
            //    }
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
