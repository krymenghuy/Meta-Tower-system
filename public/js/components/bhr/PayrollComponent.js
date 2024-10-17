"use strict";

var PayrollComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_payrollComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll";
    this.elSortBy = this.self.querySelector('#el_sort_by');
    this.elStatus = this.self.querySelector('#el_status');
    this.btnAdd = this.self.querySelector("#_btnAddSalary");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_payroll");

    this.cols = [

        {
            title: "No",
            className: 'align-middle text-capitalize text-nowrap',
            data: (data, index, i) => { return (index + 1) },

        },
        {
            title: "Employee",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.name ?? ''}</span>
                                <br/>
                                <span style="font-size: 12px">${data.email ?? ''}</span><br/>
                                <span style="font-size: 12px">${data.phone_number ?? ''}</span>
                            </div>
                        </div>`;
            }
        },
        {
            title: "Position",
            className: "align-middle",
            data: (data, index, tr) => {
                // Add custom styling or logic here
                let position = data.position ? data.position : 'N/A';
                return `<p style=" background: linear-gradient(97.44deg, #FFFFFF -6.65%, rgba(199, 231, 1, 0.66) 18.08%, rgba(199, 231, 1, 0.66) 32.5%);" class="p-0 m-0 text-primary text-center border border-primary rounded-5 p-1">${position}</p>`;
            }
        },


        {
            title: "Rate",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.rate ?? ''}</p>`;
            }
        },
        {
            title: "Period",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.start_date.replace(/-/g, '/') ?? ''} - ${data.end_date.replace(/-/g, '/') ?? ''}</p>`;
            }
        },
        {
            title: "Salary",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol + data.salary ?? ''}</p>`;
            }
        },

        {
            title: "Status",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = 'text-danger text-center';
                let bg_color = ''; // Default background color

                if ((data.status || '').toLowerCase() === 'success') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745'; // Green background for success
                } else if ((data.status || '').toLowerCase() === 'panding') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107'; // Yellow background for pending
                } else if ((data.status || '').toLowerCase() === 'in progress') {
                    cls_class = 'text-white text-center border border-danger rounded-5 p-1';
                    bg_color = '#dc3545'; // Red background for in progress
                } else {
                    bg_color = '#6c757d'; // Default gray background for other statuses
                }

                return `<div><a class="d-block" data-status="${data.status}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:80px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.status}
                            </span>
                        </a></div>`;
            }
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-center gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_payroll_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },

    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollListView = new ListView('_payroll_list',{
            fetchApi : `${main_view.base_url}/hr/payroll/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table  table--white rounded-2   overflow-hidden  header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            // let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                // id: 1,
                btn: e.target,
                onClose: () => {
                    // content.parentElement.classList.remove('d-none');
                    mThis.PayrollListView.showPage();
                }
            };
            // content.parentElement.classList.add('d-none');

            PayRollDailog.show(op);
        };

        const pr_tbl = mThis.PayrollListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        mThis.initDropdownMenus(pr_tbl);///

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.PayrollListView.showPage(mThis.getDataFormFilter());
        })

        mThis.initAlready = true;

    };
    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.PayrollListView) {
                mThis.PayrollListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("PayrollListView is not defined");
            }
        }, 200);
    });

    this.getDataFormFilter = () => {
        let p = {};
        p.status_id = mThis.elStatus.value;
        p.sort_by = mThis.elSortBy.value;
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
            actionButtonClass:"btn_payroll_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[

                {
                    html:'<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon:`<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass:"border-bottom pb-2",
                    name:"change_payroll_status"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Payroll">Modify Payroll</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_payroll"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Payroll">Delete Payroll</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_payroll"
                },

            ],
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'change_payroll_status':{
                        mThis.changeStatus(id,menuLink);
                        break;
                    }
                    case 'edit_payroll':{
                      mThis.editPayroll(id, menuLink);
                      break;
                    }
                    case 'delete_payroll':{
                        mThis.deletePayroll(id, menuLink);
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
            title: 'Set Payroll Status',
            dataLabel: "Payroll status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText:"Save",
            blankErrorMessage: "Status is not correct!",
            data: [{
                status_id: "3",
                name: "Success"
            },
            {
                status_id: "2",
                name: "Inprogress"
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

                vsapi.call(`${mThis.base_url}/hr/payroll/update-status`,p).then(res => {
                    if(res.status_code === 200){

                        InputBox2.close();
                        cv_interact.success('The Payroll status has been updated');
                        mThis.PayrollListView.showPage(mThis.getDataFormFilter());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }

    this.editPayroll = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            }
        };
        PayRollDailog.show(op);
    }

    this.deletePayroll = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Payroll?',{
            title: 'Delete Payroll',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/payroll/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.PayrollListView.showPage();
                    }
                })
            }
        });

    }
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/payroll/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elSortBy);

            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'All Sort', null);
            VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All Status',null);
        })
    }


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.PayrollListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };


});

const PayRollDailog = (()=>{

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
                <div class="form-group col-6">
                     <label for="rate" class="form-label"
                     vslang="titles.Rate"></label>
                     <textarea  type="text" class="form-control data-input" data-field="rate"></textarea>
                 </div>
                 <div class="form-group col-6">
                     <label for="salary" class="form-label"
                     vslang="titles.Salary"></label>
                     <textarea  type="text" class="form-control data-input" data-field="salary"></textarea>
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
                 textField:(me, d)=> {return `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span> <span>${d.email}</span><span>${d.phone_number}</span><span> ${d.position} </span> </div></div>`; },
                // textField:"name",
                 valueField:'id'
               },
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

                    vsapi.call( [main_view.base_url,'/hr/payroll/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Payroll',
               modifyTitle:'Edit Payroll',
               targetProp: 'payrolls',
               api:{
                 endpoint: [main_view.base_url,'/hr/payroll/form-options'].join(''),
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

