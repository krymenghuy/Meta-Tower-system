"use strict";
var DepartmentComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_departmentComponent");
 
    mThis.title_prop = "Departments";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddDepartment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    // mThis.elStatus = mThis.self.querySelector("#el_status");
    mThis.elSearch = mThis.self.querySelector("#_search_department");
    mThis.cols = [
        {
            title: "#",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            title: "Department",
            className: "align-middle text-capitalize p-3  text-left",
            data: (data) => `
                <span class="text-primary-custom">${data.name}</span>`,
        },
        {
            title: "Short Name",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) =>
                `<span class="text-warning ">${data.shortcut}</span>`,
        },
        {
            title: "Updated By",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class="text-muted" style="font-size: 14px;">${
                    data.update_user ?? ""
                }</span><br/>
            </div>`,
        },
        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class="text-primary-custom" style="font-size: 12px;">${
                    data.updated_at ?? ""
                }</span>
            </div>`,
        },

        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => `
           <div class="d-flex align-items-center gap-2">
                  <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-department-modify">
                    <i class="fa-regular fa-pen-to-square text-warning fs-6"></i>
                  </a>
                  <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-department-delete">
                    <i class="fa-solid fa-trash-can text-danger fs-6"></i>
                  </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.DepartmentListView = new ListView("_dep_list", {
            fetchApi: `${main_view.base_url}/mhr/department/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.DepartmentListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.DepartmentListView.showPage();
                },
            };
            if (!AuthManager.allowed(216)) return;
            DepartmentDialog.show(op);
        };
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.DepartmentListView) {
                    mThis.DepartmentListView.showPage(
                        mThis.getFilterData()
                    );
                } else {
                    console.error("Department List view is not defined");
                }
            }, 200);
        });


        mThis.pr_tbl = mThis.DepartmentListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }


        mThis.setActionListeners();
        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-department-modify");
            if (btn) {
                mThis.editDepartment(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-department-delete");
            if (btn) {
                mThis.deleteDepartment(btn.dataset.id, btn);
            }
        });
    };

    mThis.editDepartment = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage();
            },
        };
        if (!AuthManager.allowed(217)) return;
        DepartmentDialog.show(op);
    };

    mThis.deleteDepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage();
            },
        };
        if (!AuthManager.allowed(218)) return;
        cv_interact.confirm(
            "Delete this department?",
            {
                title: "Delete Department",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/department/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.DepartmentListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/department/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};

            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.DepartmentListView.showPage(mThis.getFilterData(),null,()=>{
           main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();

const DepartmentDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = new GeneralDialog({
            cssClass:'modal-md',
            backdrop: 'static',
            keyboard:true,
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-md-6">
                     <label for="name" class="form-label" vslang="titles.Department"></label>
                     <span class="text-danger">*</span>
                     <input  type="text" class="form-control data-input" data-field="name">
                 </div>
                 <div class="form-group col-md-6">
                     <label for="shortcut" class="form-label" vslang="titles.Short Name"></label>
                     <span class="text-danger">*</span>
                     <input  type="text" class="form-control data-input" data-field="shortcut">
                 </div>
                 <div class="form-group col-12">
                     <label for="description" class="form-label" vslang="titles.Description"></label>
                     <textarea  type="text" class="form-control data-input" data-field="description"></textarea>
                 </div>

              </div>`].join('');
            },

            // configSelect:[
            //    {
            //      name:"department",
            //      data:'departments',
            //      textField:"name",
            //      valueField:'id'
            //    },
            // ],
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

                    vsapi.call( [main_view.base_url,'/mhr/department/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                         if(me.dataOptions.id > 0)
                         {
                            cv_interact.success('Updated department successfully');
                         }
                         else
                         {
                            cv_interact.success('Added department successfully');
                         }
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Department',
               modifyTitle:'Edit Department',
               targetProp: 'departments',
               api:{
                 endpoint: [main_view.base_url,'/mhr/department/form-options'].join(''),
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

