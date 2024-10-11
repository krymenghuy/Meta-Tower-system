'use strict';

var PositionComponent = new function() {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_main_positionComponent');
    this.self = this.jm[0];
    this.title_prop = 'Position';
    this.btnAdd = this.self.querySelector("#_btnAddPosition");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elStatus = this.self.querySelector('#el_status');
    this.elSearch = this.self.querySelector("#_sdl_search_position");
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');

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
            title: "Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                let cls_class = "text-danger text-center";
                let bg_color = "#6c757d"; // Default gray background color

                const status = (data.status || "").toLowerCase();

                if (status === "active") {
                    cls_class =
                        "text-white text-center border border-success rounded-5 p-1";
                    bg_color = "#28a745";
                } else if (status === "inactive") {
                    cls_class =
                        "text-white text-center border border-warning rounded-5 p-1";
                    bg_color = "#ffc107";
                }

                return `
                    <a class="d-flex justify-content-left" data-status="${data.status}" data-id="${data.id}" href="javascript:void(0)">
                        <span style="display:block;width:80px;background:${bg_color};" class="${cls_class}">
                            ${data.status}
                        </span>
                    </a>`;
            },
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

        mThis.PositionListView = new ListView('_position_list', {
            fetchApi: `${main_view.base_url}/hr/position/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            listContainerClass: null
        });

        mThis.divFilter.addEventListener('change', (e) => {
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
                }
            };
            PositionDilog.show(op);
        };
        const pr_tbl = mThis.PositionListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 275) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        mThis.elSearch.addEventListener('keyup', (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.PositionListView) {
                    mThis.PositionListView.showPage(mThis.getDataFormFilter());
                } else {
                    console.error("PositionListView is not defined");
                }
            }, 200);
        });

        mThis.btnSearch.onclick = e => {
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
                    html:'<span class="ps-2  " vslang="titles.Modify Position">Modify Position</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_position"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Position">Delete Position</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_position"
                },

            ],

            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'edit_position':{
                      mThis.editposition(id, menuLink);
                      break;
                    }
                    case 'delete_position':{
                        mThis.deleteposition(id, menuLink);
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

    this.editposition = (id, menuLink) => {
        console.log(234,id );

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage();
            }
        };
        PositionDilog.show(op);
    }

    this.deleteposition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Position?',{
            title: 'Delete Position',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/position/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.PositionListView.showPage();
                    }
                })
            }
        });

    }
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/position/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elStatus);

            VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All',null);
        })
    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.PositionListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };
};

const PositionDilog = new function() {
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_sdl_add_Position');
    this.modal = new bootstrap.Modal(this.self);
    this.base_url = main_view.base_url;
    this.options = {};

    this.btnSave = this.self.querySelector('#dlg_sdl_add_position_btn_save');
    this.elStatusId = this.self.querySelector('#_sdl_status_id');
    this.elDepartmentId = this.self.querySelector('#_sdl_department_id');
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.div_position_info = mThis.self.querySelector('#_sdl_position_info');


    this.btnSave.onclick = e => {
        e.preventDefault();
        let p = mThis.getDataForm();
        console.log(77777, p);

        vsapi.call(`${mThis.base_url}/hr/position/save`, p, mThis.btnSave, false).then(res => {
            if (res.status_code === 200) {
                mThis.modal.hide();
                const d = res.data ?? {};
                cv_interact.success('Position Saved Success!');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            } else {
                cv_interact.error(res.error_message);
            }
        });
    };

    this.prepareData = (id, def, onFinish) => {
        if (!def) def = {};
        console.log(555555, id);
        vsapi.call(`${mThis.base_url}/hr/position/form-options`, { id: id }, null).then(res => {
            let d = res.status_code === 200 ? res.data : {};

            VSUtil.setComboItems(mThis.elStatusId, d.status, 'id', 'title', true, '(Select Status)', null);
            VSUtil.setComboItems(mThis.elDepartmentId, d.departments, 'id', 'name', true, '(Select Department)', null);
            console.log(33333, d);
            onFinish(d);
        });
    };

    this.show = (options = {}) => {
        mThis.options = options;
        let id = options.id ?? null;
        console.log(123);

        mThis.prepareData(id, {}, (data) => {
            if (data.positions) {
                mThis.elTitle.textContent = "Modify Position Information";
            } else {
                mThis.elTitle.textContent = "Create Position";
            }
            mThis.setData(data.positions);
            mThis.modal.show();
        });
    };



    this.getDataForm = () => {
        const div = mThis.self;
        let p = { id: mThis.options.id };

        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            p[data_member] = el.value;
        });

        return p;
    };

    this.setData = (d = {}) => {
        const div = mThis.self;
        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            console.log(7777,data_member,'|',el);
            el.value ='';
        });

        console.log(4444,d);
        if(!d) return;

        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            console.log(7777,data_member,'|',el);

            el.value = d[data_member] || '';
        });

    };
};
