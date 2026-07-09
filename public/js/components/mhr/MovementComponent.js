var MovementComponent = (()=> {
    const mThis = {};
    mThis.title_prop = "Movements";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employeeMovementComponent");
 
    // mThis.btnAdd = mThis.self.querySelector("#_btnAddMovement");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_emp_movement");
    mThis.elEvent = mThis.self.querySelector('#el_event');
    mThis.elEmployee = mThis.self.querySelector('#el_employee');

    mThis.cols = [

        {
            title: "",
            className: 'align-middle',
            // data: (data, index, i) => { return (index + 1) },

        },
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url ||main_view.asset_url + "/images/default/default-staff.png"}" alt=""style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${
                                    data.emp_name ?? ""
                                }</span>
                                <br/>
                                <span style="font-size: 10px; color: #2b3991;">${
                                    data.position ?? ""
                                }</span>
                            </div>
                        </div>`;
            }
        },

        {
            title: "Event",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.event ?? ''}</p>`;
            }
        },
        {
            title: "Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.event_date ?? ""}</p>`;
            }
        },

        {
            title: "last Updated",
            className: "align-middle",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 10px; color: #2b3991;">${data.updated_at ?? ""}</span>
            </div>`,
        },

        {
            title: "Impact",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = '';

                if ((data.impact || '').toLowerCase() === 'positive') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745';
                } else if ((data.impact || '').toLowerCase() === 'neutral') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107';
                } else if ((data.impact || '').toLowerCase() === 'negative') {
                    cls_class = 'text-white text-center border border-danger rounded-5 p-1';
                    bg_color = '#dc3545';
                } else {
                    bg_color = '#6c757d';
                }

                return `<div><a class="d-block" data-status="${data.impact}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:100px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.impact}
                            </span>
                        </a></div>`;
            }
        },


    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.MovementListView = new ListView('_emp_movement_list',{
            fetchApi : `${main_view.base_url}/mhr/emp-event/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white overflow-hidden rounded-3 header-uppercase',
            listContainerClass: null
        });

        // mThis.btnAdd.onclick = function (e) {
        //     e.preventDefault();
        //     let op = {
        //         id: null,
        //         btn: e.target,
        //         onClose: () => {
        //             mThis.MovementListView.showPage();
        //         }
        //     };
        //     MovementDialog.show(op);
        // };
        mThis.tblMovement = mThis.MovementListView.getTable();
        mThis.initDropdownMenus(mThis.tblMovement);
        mThis.sh_container  = mThis.MovementListView.getListContainer();

        mThis.pr_tbl = mThis.MovementListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }


        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) =>{
                e.preventDefault();
                mThis.MovementListView.showPage(mThis.getFilterData());
            }

        });
        let timeOut = null;
        mThis.elSearch.onkeyup = function(e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
                mThis.MovementListView.showPage(mThis.getFilterData());
            },250);

        };


        mThis.initAlready = true;

    };



    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            event: mThis.elEvent.value,
            employee:mThis.elEmployee.value,
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el=>{
            let f = el.dataset.field;
            p[f] = el.value;
        })
        return p;
    };


    mThis.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_movement_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[

                {
                    html:'<span class="ps-2  " vslang="titles.Modify Movement">Modify Movement</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_movement"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Movement">Delete Movement</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_movement"
                },

            ],

            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_movement':{
                      mThis.editMovement(id, menuLink);
                      break;
                    }
                    case 'delete_movement':{
                        mThis.deleteMovement(id, menuLink);
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

    mThis.editMovement = (movement_id, menuLink) => {
        let op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage(); // Refresh the list after editing
            }
        };

        MovementDialog.show(op);
    }

    mThis.deleteMovement = (movement_id, menuLink) => {
        const op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage();
            }
        };
        cv_interact.confirm('Delete this employee movement?',{
            title: 'Delete Employee Movement',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/emp-event/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted successfully');
                        mThis.MovementListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });

    }
    mThis.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/mhr/emp-event/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elEvent,d.events,'id','name',true,'All Movements',null);
            VSUtil.setComboItems(mThis.elEmployee,d.employees,'id','name',true,'All Employee',null);

        })
    }
    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
            mThis.MovementListView.showPage(mThis.getFilterData());
            main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const MovementDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [
                     `<div class="row">
                    <div class="form-group col-12">
                        <label for="employee" class="form-label" vslang="titles.Employee"></label>
                        <select name="employee" class=" data-input"  data-field="emp_id"></select>
                    </div>
                    <div class="form-group  col-12 d.none">
                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="event" class="form-label" vslang="titles.Movement Type"></label>
                        <select name="event" class=" data-input"  data-field="event_id"></select>
                    </div>
                    <div class="form-group col-6">
                        <label for="event_date" class="form-label" vslang="titles.Date"></label>
                        <input name="event_date" class="form-control data-input form_input" data-field="event_date" />
                    </div>
                    <div class="form-group col-12">
                        <label for="remarks" class="form-label"
                        vslang="titles.Remarks"></label>
                        <textarea  type="text" class="form-control data-input" data-field="remarks"></textarea>
                    </div>

              </div>`,
                 ].join("");
            },
            contentCreated:(me)=>{
               //Convert field to be DatePicker : start_date and end_date
               DateTimePicker.init(me.controls.event_date);

            },
            configSelect:[
               {
                 name:"employee",
                 data:'employees',
                 textField:(me, d)=> {return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`; },
                // textField:"name",
                 valueField:'id'
               },
               {
                name:"event",
                data:'events',
                textField:"name",
                valueField:'id'
               },
               {
                name:"status",
                data:'impacts',
                textField:"name",
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

                    vsapi.call( [main_view.base_url,'/mhr/emp-event/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Employee Movement',
               modifyTitle:'Edit Employee Movement',
               targetProp: 'emp_event',
               api:{
                 endpoint: [main_view.base_url,'/mhr/emp-event/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
            },

            onPrepareForm:(me, data)=>{
                 LocaleManager.translateZone(me.divModal);
            }

        });

        dialog.show(op);
     }

    return self;
})();
