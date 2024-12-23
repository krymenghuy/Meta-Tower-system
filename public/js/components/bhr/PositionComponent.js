"use strict";

var PositionComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_positionComponent");
    this.self = this.jm[0];
    this.title_prop = "Positions";
    this.btnAdd = this.self.querySelector("#_btnAddPosition");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_position");

    this.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "",
        },
        {
            title: "Position",
            className: "align-middle text-capitalize",
            data:(data)=>`<span class="text-primary-custom">${data.title}</span>`,
        },
        {
            title: "Job Level",
            className: "align-middle text-capitalize",
            data:(data)=>`<span class="text-capitalize text-primary-custom">${data.level}</span>`,
        },
        
        {
            title: "Department",
            className: "align-middle text-capitalize text-nowrap text-left",
            data:(data)=>`<span class="text-primary-custom ">${data.department}</span>`
        },
        {
            title: "Salary",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => {
                const formattedSalary = data.salary
                    ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          .format(data.salary)
                          .replace(',', '.')
                    : "";

                return `
                    <span class="text-primary-custom" style="font-weight: bold;">
                        ${formattedSalary} <span class="text-danger">(KHR)</span>
                    </span>
                `;
            },
        },

        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? ""}</span><br/>
                <small >${data.updated_at ?? ""}</small>
            </div>`,
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-start align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_position_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>x
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
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.PositionListView.showPage(mThis.getFilterData());
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
            PositionDialog.show(op);
        };
        const listContainer = mThis.PositionListView.getListContainer();
        const sh_parent = listContainer;
        sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.PositionListView) {
                    mThis.PositionListView.showPage(mThis.getFilterData());
                } else {
                    console.error("PositionListView is not defined");
                }
            }, 200);
        });



        mThis.initDropdownMenus(listContainer);

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
        // console.log(222, p);

        return p;
    };

    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_position_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Position">Modify Position</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_position",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Position">Delete Position</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_position",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_position": {
                        mThis.editPosition(id, menuLink);
                        break;
                    }
                    case "delete_position": {
                        mThis.deletePosition(id, menuLink);
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

    this.editPosition = (id, menuLink) => {
        console.log(234, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage();
            },
        };
        PositionDialog.show(op);
    };

    this.deletePosition = (id, menuLink) => {
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


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.PositionListView.showPage(mThis.getFilterData(),null,()=>{
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(250);

        });

    };
})();

const PositionDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = new GeneralDialog({
            cssClass:'modal-md',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-md-12">
                     <label for="department" class="form-label" vslang="titles.Department"></label>
                     <span class="text-danger" >*</span>
                     <select name="department" class="data-input"  data-field="department_id"></select>
                 </div>
                 <div class="form-group col-md-12">
                     <label for="job_level" class="form-label" vslang="titles.Job Level"></label>
                     <span class="text-danger" >*</span>
                     <select name="job_level" class="data-input"  data-field="job_level_id"></select>
                 </div>
                 <div class="form-group col-md-6">
                     <label for="title" class="form-label" vslang="titles.Position"></label>
                     <span class="text-danger" >*</span>
                     <input type="text" class="form-control data-input" data-field="title">
                 </div>
                 <div class="form-group col-md-6">
                        <label for="salary" class="form-label" vslang="titles.Salary"></label>
                        <span class="text-danger" >*</span>
                        <input  type="number" class="form-control data-input" data-field="salary">
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
               {
                name:"job_level",
                data:"job_levels",
                textField:"level",
                valueField:'id'
               }
            ],
            buttons:[
               {
                label:'<span class=""><i class="fa-solid text-danger fa-xmark"></i></span>',
                cssClass:'btn btn-sm-outline rounded-3',
                click:(me,btn)=>{
                    //Close with Cancel button
                    me.hide(false);
                }
            },
               {
                label:'<span><i class="fa-solid text-success fa-check"></i></span>',
                cssClass:'btn btn-sm-outline rounded-3',
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

