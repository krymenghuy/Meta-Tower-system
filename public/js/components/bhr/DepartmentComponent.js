"use strict";

var DepartmentComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_departmentComponent");
    this.self = this.jm[0];
    this.title_prop = "Departments";
    this.btnAdd = this.self.querySelector("#_btnAddDepartment");
    this.divFilter = this.self.querySelector("#_divFilter");
    // this.elStatus = this.self.querySelector("#el_status");
    this.elSearch = this.self.querySelector("#_search_department");
    this.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "",
        },
        {
            title: "Department",
            className: "align-middle text-capitalize p-3  text-left",
            data: (data)=>`
                <span class="text-primary-custom">${data.name}</span>`,
        
        },
        {
            title: "Short Name",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data)=>
                `<span class="text-warning ">${data.shortcut}</span>`,
            
        },
        {
            title: "Updated By",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class="text-muted" style="font-size: 14px;">${data.update_user ?? ""}</span><br/>
            </div>`,
        },
        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class="text-primary-custom" style="font-size: 12px;">${data.updated_at ??""}</span>
            </div>`,
        },
       
        {
            title: "Actions",
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

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.DepartmentListView = new ListView("_dep_list", {
            fetchApi: `${main_view.base_url}/hr/department/list-paginate`,
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

      
        const listContainer = mThis.DepartmentListView.getListContainer();
        mThis.setActionListeners();
        mThis.initAlready = true;
    };

    this.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    this.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-department-modify");
            if (btn) {
                mThis.editDepartment(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-department-delete");
            if (btn) {
                mThis.deleteDepartment(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };

    this.editDepartment = (id, menuLink) => {
        console.log(234, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage();
            },
        };
        DepartmentDialog.show(op);
    };

    this.deleteDepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Department?",
            {
                title: "Delete Department",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/department/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.DepartmentListView.showPage();
                            }
                        });
                }
            }
        );
    };
    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/department/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
               
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.DepartmentListView.showPage(mThis.getFilterData(),null,()=>{
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(250);
        });
       
    };
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

                    vsapi.call( [main_view.base_url,'/hr/department/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
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
                 endpoint: [main_view.base_url,'/hr/department/form-options'].join(''),
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
// const DepartmentDialog = new (function () {
//     const mThis = this;
//     this.self = main_view.VSAppContent.querySelector("#dlg_sdl_add_Department");
//     this.modal = new bootstrap.Modal(this.self);
//     this.base_url = main_view.base_url;
//     this.options = {};

//     this.btnSave = this.self.querySelector("#dlg_sdl_add_department_btn_save");
//     // this.elStatusId = this.self.querySelector("#_sdl_status_id");
//     this.elTitle = mThis.self.querySelector(".modal-title");
//     this.div_department_info = mThis.self.querySelector(
//         "#_sdl_department_info"
//     );

//     this.btnSave.onclick = (e) => {
//         e.preventDefault();
//         let p = mThis.getDataForm();
//         console.log(77777, p);

//         vsapi
//             .call(
//                 `${mThis.base_url}/hr/department/save`,
//                 p,
//                 mThis.btnSave,
//                 false
//             )
//             .then((res) => {
//                 if (res.status_code === 200) {
//                     mThis.modal.hide();
//                     const d = res.data ?? {};
//                     cv_interact.success("Department Saved Success!");
//                     if (typeof mThis.options.onClose === "function")
//                         mThis.options.onClose(p);
//                 } else {
//                     cv_interact.error(res.error_message);
//                 }
//             });
//     };

//     this.prepareData = (id, def, onFinish) => {
//         if (!def) def = {};
//         console.log(555555, id);
//         vsapi
//             .call(
//                 `${mThis.base_url}/hr/department/form-options`,
//                 { id: id },
//                 null
//             )
//             .then((res) => {
//                 let d = res.status_code === 200 ? res.data : {};
//                 // VSUtil.setComboItems(
//                 //     mThis.elStatusId,
//                 //     d.status,
//                 //     "id",
//                 //     "name",
//                 //     true,
//                 //     "(Select Status)",
//                 //     null
//                 // );
//                 console.log(33333, d);
//                 onFinish(d);
//             });
//     };

//     this.show = (options = {}) => {
//         mThis.options = options;
//         let id = options.id ?? null;
//         console.log(123);

//         mThis.prepareData(id, {}, (data) => {
//             if (data.departments) {
//                 mThis.elTitle.textContent = "Modify Department Information";
//             } else {
//                 mThis.elTitle.textContent = "Create Department";
//             }
//             mThis.setData(data.departments);
//             mThis.modal.show();
//         });
//     };

//     this.getDataForm = () => {
//         const div = mThis.self;
//         let p = { id: mThis.options.id };

//         div.querySelectorAll(".data-input").forEach((el) => {
//             const data_member = el.dataset.field;
//             p[data_member] = el.value;
//         });

//         return p;
//     };

//     this.setData = (d = {}) => {
//         const div = mThis.self;
//         div.querySelectorAll(".data-input").forEach((el) => {
//             const data_member = el.dataset.field;
//             console.log(7777, data_member, "|", el);
//             el.value = "";
//         });

//         console.log(4444, d);
//         if (!d) return;

//         div.querySelectorAll(".data-input").forEach((el) => {
//             const data_member = el.dataset.field;
//             console.log(7777, data_member, "|", el);

//             el.value = d[data_member] || "";
//         });
//     };
// })();
