"use strict";

var PositionComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_positionComponent");
    this.self = this.jm[0];
    this.title_prop = "Position";
    this.btnAdd = this.self.querySelector("#_btnAddPosition");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elStatus = this.self.querySelector("#el_status");
    this.elSearch = this.self.querySelector("#_sdl_search_position");
    this.btnSearch = mThis.self.querySelector("#_sdl_btnSearch");

    this.cols = [
        {
            title: "No",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Position title",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "title",
        },
        {
            title: "Department Name",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "department",
        },
        {
            title: "Salary",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data)=>`
                  <span class="text-primary-custom" style="font-weight: bold;">${data.salary ?? ""}<span class="text-danger"> (រៀល) </span></span>
            `,
        },
        {
            title: "Create By",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${
                    data.update_user ?? ""
                }</span><br/>
                <span style="font-size: 12px; color: #2b3991;">${
                    data.updated_at ?? ""
                }</span>
            </div>`,
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_payroll_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.PositionListView = new ListView("_position_list", {
            fetchApi: `${main_view.base_url}/hr/position/list-paginate`,
            perPage:10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.PositionListView.showPage(mThis.getDataFormFilter());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.PositionListView.showPage();
                },
            };
            PositionDilog.show(op);
        };
        const pr_tbl = mThis.PositionListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = window.innerHeight - 275 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.PositionListView) {
                    mThis.PositionListView.showPage(mThis.getDataFormFilter());
                } else {
                    console.error("PositionListView is not defined");
                }
            }, 200);
        });

        mThis.btnSearch.onclick = (e) => {
            if (mThis.PositionListView) {
                mThis.PositionListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("listView is not defined");
            }
        };

        mThis.initDropdownMenus(pr_tbl);

        mThis.initAlready = true;
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        p.status_id = mThis.elStatus.value;
        let main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

        return p;
    };

    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_payroll_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Position">Modify Position</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_position",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Position">Delete Position</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_position",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_position": {
                        mThis.editposition(id, menuLink);
                        break;
                    }
                    case "delete_position": {
                        mThis.deleteposition(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    this.editposition = (id, menuLink) => {
        console.log(234, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage();
            },
        };
        PositionDilog.show(op);
    };

    this.deleteposition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Position?",
            {
                title: "Delete Position",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/position/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.PositionListView.showPage();
                            }
                        });
                }
            }
        );
    };
    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/position/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                console.log(1111, this.elStatus);

                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.status,
                    "id",
                    "name",
                    true,
                    "All",
                    null
                );
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.PositionListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const PositionDilog = (()=>{

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
                     <label for="department" class="form-label" vslang="titles.Department"></label>
                     <select name="department" class=" data-input"  data-field="department_id"></select>
                 </div>
                 <div class="form-group  col-12 d.none">
                     <div id="info"></div>
                 </div>
                <div class="form-group col-12">
                     <label for="salary" class="form-label"
                     vslang="titles.Salary"></label>
                     <input  type="number" class="form-control data-input" data-field="salary">               </div>
                 <div class="form-group col-12">
                     <label for="title" class="form-label"
                     vslang="titles.Title"></label>
                     <textarea  type="text" class="form-control data-input" data-field="title"></textarea>
                 </div>

              </div>`].join('');
            },

            configSelect:[
               {
                 name:"department",
                 data:'departments',
                 textField:"name",
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

                    vsapi.call( [main_view.base_url,'/hr/position/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Position',
               modifyTitle:'Edit Position',
               targetProp: 'positions',
               api:{
                 endpoint: [main_view.base_url,'/hr/position/form-options'].join(''),
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

