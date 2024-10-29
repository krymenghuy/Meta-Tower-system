var EmployeeMovementComponent = new (function () {
    let mThis = this;
    this.title_prop = "Employee Movement";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeMovementComponent");
    this.self = this.jm[0];
    this.btnAdd = this.self.querySelector("#_btnAddMovement");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_emp_movement");
    this.elSortBy = this.self.querySelector('#el_sort_by');
    this.elFilter_event = this.self.querySelector('#el_event');

    this.cols = [

        {
            title: "No",
            className: 'align-middle',
            data: (data, index, i) => { return (index + 1) },

        },
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.emp_name ?? ''}</span>
                                <br/>
                                <span style="font-size: 12px; color: gray;">${data.position ?? ''}</span>
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
                return `<p class="p-0 m-0">${data.date ?? ''}</p>`;
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
            title: "Impact",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = ''; // Default background color

                if ((data.impact || '').toLowerCase() === 'positive') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745'; // Green background for success
                } else if ((data.impact || '').toLowerCase() === 'neutral') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107'; // Yellow background for pending
                } else if ((data.impact || '').toLowerCase() === 'negative') {
                    cls_class = 'text-white text-center border border-danger rounded-5 p-1';
                    bg_color = '#dc3545'; // Red background for in progress
                } else {
                    bg_color = '#6c757d'; // Default gray background for other statuses
                }

                return `<div><a class="d-block" data-status="${data.impact}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.impact}
                            </span>
                        </a></div>`;
            }
        },

        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_movement_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.MovementListView = new ListView('_emp_movement_list',{
            fetchApi : `${main_view.base_url}/hr/emp-event/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white overflow-hidden rounded-3 header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.MovementListView.showPage();
                }
            };
            MovementDialog.show(op);
        };
        mThis.tblMovement = mThis.MovementListView.getTable();
        mThis.initDropdownMenus(mThis.tblMovement);
        this.sh_container  = mThis.MovementListView.getListContainer();

        const sh_parent = mThis.sh_container.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');
        window.onresize = () => {
            sh_parent.style.height = (window.innerHeight - 190) + 'px';
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

   

    this.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            sort_by: mThis.elSortBy.value,
            event_id: mThis.elFilter_event.value,
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el=>{
            let f = el.dataset.field;
            p[f] = el.value;
        })
        return p;
    };




    this.initDropdownMenus = (table)=>{
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
                console.log(90,menuLink,80,id,70,name);

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

    this.editMovement = (movement_id, menuLink) => {
        let op = {
            id: movement_id, 
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage(); // Refresh the list after editing
            }
        };
        console.log(123,op);
        

        MovementDialog.show(op);
    }

    this.deleteMovement = (movement_id, menuLink) => {
        let op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Employee Movement?',{
            title: 'Delete Employee Movement',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/emp-event/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.MovementListView.showPage();
                    }
                })
            }
        });

    }
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/emp-event/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'All', null);
            VSUtil.setComboItems(mThis.elFilter_event,d.events,'id','name',true,'All Movements',null);
        })
    }
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.MovementListView.showPage(mThis.getFilterData(),null,()=>{
                mThis.jm.siblings().hide();
                mThis.jm.hide().fadeIn(250);

            });
                
    }

})()

const MovementDialog = (()=>{

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
                        <label for="date" class="form-label" vslang="titles.Date"></label>
                        <input name="date" class="form-control data-input" data-field="date" />
                    </div>
                    <div class="form-group col-12">
                        <label for="remarks" class="form-label"
                        vslang="titles.Remarks"></label>
                        <textarea  type="text" class="form-control data-input" data-field="remarks"></textarea>
                    </div>

              </div>`].join('');
            },
            contentCreated:(me)=>{
               //Convert field to be DatePicker : start_date and end_date
               DateTimePicker.init(me.controls.date);

            },
            configSelect:[
               {
                 name:"employee",
                 data:'employees',
                 textField:(me, d)=> {return `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`; },
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

                    vsapi.call( [main_view.base_url,'/hr/emp-event/save'].join(''), p,btn,null).then(res=>{
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
                 endpoint: [main_view.base_url,'/hr/emp-event/form-options'].join(''),
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
