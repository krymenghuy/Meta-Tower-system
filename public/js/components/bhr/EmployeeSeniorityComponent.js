"use strict";

var EmployeeSeniorityComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_seniorityComponent");
    this.self = this.jm[0];
    this.title_prop = "Employee Seniority";
    this.btnAdd = this.self.querySelector("#_btnAddseniority");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_seniority");
    this.elSortBy = this.self.querySelector('#el_sort_by');
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');

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
            title: "Period",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.period ?? ''}</p>`;
            }
        },
        {
            title: "Description",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.description ?? ''}</p>`;
            }
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.amount ?? ''}</p>`;
            }
        },
        {
            title: "Action",
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_seniority_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                            </a>
                        </div>
                    </div>
                `;
            }
        }

    ];
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.SeniorityListView = new ListView('_seniority_list',{
            fetchApi : `${main_view.base_url}/hr/seniorities/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white overflow-hidden  header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                btn: e.target,
                onClose: () => {
                    mThis.SeniorityListView.showPage();
                }
            };

            SeniorityDialog.show(op);
        };

        const pr_tbl = mThis.SeniorityListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.SeniorityListView.showPage(mThis.getDataFormFilter());
        })

        // mThis.setAction(pr_tbl);

        mThis.initAlready = true;

    };

    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.SeniorityListView) {
                mThis.SeniorityListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("Employee Seniority is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = e => {
        if (mThis.SeniorityListView) {
            mThis.SeniorityListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("Employee Seniority  is not defined");
        }
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        p.sort_by = mThis.elSortBy.value;
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
            actionButtonClass:"btn_seniority_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[

                {
                    html:'<span class="ps-2  " vslang="titles.Modify Employee Seniority">Modify Employee Seniority</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_seniority"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Employee Seniority">Delete Employee Seniority</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_seniority"
                },

            ],

            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'edit_seniority':{
                      mThis.editSeniority(id, menuLink);
                      break;
                    }
                    case 'delete_seniority':{
                        mThis.deleteSeniority(id, menuLink);
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
    this.editSeniority = (id, menuLink) => {
        let op = {
            id: id, // Pass the ID to fetch the data
            btn: menuLink,
            onClose: () => {
                mThis.SeniorityListView.showPage(); // Refresh the list after editing
            }
        };

        SeniorityDialog.show(op);
    }


    this.deleteSeniority = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SeniorityListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Employee Seniority?',{
            title: 'Delete Employee Seniority',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/seniorities/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.SeniorityListView.showPage();
                    }
                })
            }
        });

    }
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/seniorities/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elSortBy);

            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'All', null);
            // VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All',null);
        })
    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.SeniorityListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
    };
})


const SeniorityDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                return [`<div class="row">
                    <div class="form-group col-md-12">
                    <label class="form-label" vslang="titles.Employee">Employee</label>
                    <div><select name="emp_id" class="data-input" data-field="emp_id"></select></div>
                    </div>

                    <div class="form-group col-md-12">
                    <label class="form-label" vslang="titles.Period"> Period </label>
                    <div><input name="period" class="form-control data-input" data-field="period"/></div>
                    </div>

                    <div class="form-group col-md-12">
                    <label class="form-label" vslang="titles.Description"> Description </label>
                    <div><input name="description" class="form-control data-input" data-field="description"/></div>
                    </div>

                    <div class="form-group col-md-12">
                    <label class="form-label" vslang="titles.Amount">Amount</label>
                    <div><input name="amount" class="form-control data-input" data-field="amount"/></div>
                    </div>

                    </div>`
                ].join('');
            },
            buttons:[
                {
                   label:"<span>Cancel</span>",
                   cssClass:"btn btn-warning",
                   click:(me)=>{
                      me.hide(false);
                   }
                },
                {
                   label:"<span>Save</span>",
                   cssClass:"btn btn-primary",
                   click:(me)=>{
                      let p = me.getData();
                      p.image = me.userImageBox? me.userImageBox.getImage(): '';
                      console.log(222,p);
                      vsapi.call([main_view.base_url,'/hr/seniorities/save'].join(''),p,false,false).then(res =>{
                          if(res.status_code ==200){
                              me.modal.hide(true,p);
                          }else cv_interact.error(res.error_message);
                      });
                   }
                }
             ],
            configSelect: [
                {
                    name: "emp_id",
                    data: "employees",
                    valueField: "id",
                    textField:(me, d)=> {return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`; },
                    filterData: (data, res) => {

                        return data;
                    }
                }
            ],
            prepareFormOptions: {
                createTitle: "New Employee Seniority",
                modifyTitle: "Edit Employee Seniority",
                targetProp: "seniority",
                api: {
                    endpoint: `${main_view.base_url}/hr/seniorities/form-options`,
                    params: (op) => {
                        console.log(4444,op);

                        return { id: op.id };  // Pass ID to fetch data for edit
                    },
                    onResponse: (me, res) => {
                        console.log(1111111111,me,1,res);

                        if (op.id) {
                            // Populate form with existing data for edit mode
                            // me.setValue('emp_id', res.data.emp_id);
                            // me.setValue('period', res.data.period);
                            // me.setValue('description', res.data.description);
                            // me.setValue('amount', res.data.amount);
                        }
                    }
                }
            },
            onShow: (me) => {
                // Any additional actions on dialog show can be placed here
            }
        });

        dialog.show(op);
    }
    return self;
})();
