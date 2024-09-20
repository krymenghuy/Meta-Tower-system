'use strict';

var DepartmentComponent = new function() {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_main_departmentComponent');
    this.self = this.jm[0];
    this.title_prop = 'Department';
    this.btnAdd = this.self.querySelector("#_btnAddDepartment");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elStatus = this.self.querySelector('#el_status');
    this.elSearch = this.self.querySelector("#_sdl_search_department");
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');
    this.cols = [
        {
            title: "Logo",
            className: 'align-middle',
            data: (data) => {
                return `<img class="image-student-tbl" src="${data.image_url}" alt=""/>`;
            }
        },
        {
            title: "Department Name",
            className: 'align-middle text-capitalize text-nowrap',
            data: "name"
        },
        {
            title: "Status",
            className: 'align-middle',
            data: (data) => {
                let cls_class = 'text-danger text-center';
                let bg_color = '#6c757d'; // Default gray background color

                const status = (data.status || '').toLowerCase();

                if (status === 'active') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745';
                } else if (status === 'inactive') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107';
                }

                return `
                    <a class="d-flex justify-content-center" data-status="${data.status}" data-id="${data.id}" href="javascript:void(0)">
                        <span style="display:block;width:80px;background:${bg_color};" class="${cls_class}">
                            ${data.status}
                        </span>
                    </a>`;
            }
        },
        {
            title:"Action",
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_payroll_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                <img src="${main_view.asset_url}/images/icons/Dot.svg" />
                            </a>
                        </div>
                    </div>
                `;
            }
        }
    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.DepartmentListView = new ListView('_dep_list', {
            fetchApi: `${main_view.base_url}/hr/department/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--blue rounded-2 overflow-hidden header-uppercase',
            listContainerClass: null
        });




        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.DepartmentListView.showPage(mThis.getDataFormFilter());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.DepartmentListView.showPage();
                }
            };
            DepartmentDilog.show(op);
        };
        mThis.elSearch.addEventListener('keyup', (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.DepartmentListView) {
                    mThis.DepartmentListView.showPage(mThis.getDataFormFilter());
                } else {
                    console.error("DepartmentListview is not defined");
                }
            }, 200);
        });

        mThis.btnSearch.onclick = e => {
            if (mThis.DepartmentListView) {
                mThis.DepartmentListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("listView is not defined");
            }
        };
        const pr_tbl = mThis.DepartmentListView.getListContainer();
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
                    html:'<span class="ps-2  " vslang="titles.Modify Department">Modify Department</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_department"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Department">Delete Department</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_department"
                },

            ],

            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'edit_department':{
                      mThis.editdepartment(id, menuLink);
                      break;
                    }
                    case 'delete_department':{
                        mThis.deletedepartment(id, menuLink);
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

    this.editdepartment = (id, menuLink) => {
        console.log(234,id );

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage();
            }
        };
        DepartmentDilog.show(op);
    }

    this.deletedepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Department?',{
            title: 'Delete Department',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/department/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.DepartmentListView.showPage();
                    }
                })
            }
        });

    }
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/department/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elStatus);

            VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All',null);
        })
    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.DepartmentListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };
};

const DepartmentDilog = new function() {
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_sdl_add_Department');
    this.modal = new bootstrap.Modal(this.self);
    this.base_url = main_view.base_url;
    this.options = {};

    this.btnSave =  this.self.querySelector('#dlg_sdl_add_department_btn_save');
    this.elStatusId =  this.self.querySelector('#_sdl_status_id');
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.div_department_info = mThis.self.querySelector('#_sdl_department_info');
    this.btnChooser = mThis.self.querySelector('#dlg_image_chooser_department');


        this.btnSave.onclick = e => {
        e.preventDefault();
        let p = mThis.getDataForm();
        console.log(77777,p);

        vsapi.call(`${mThis.base_url}/hr/department/save`, p,mThis.btnSave,false).then(res => {
            if(res.status_code === 200){
                mThis.modal.hide();
                const d = res.data ?? {};
                cv_interact.success('Department Saved Success!');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            }
            else
                cv_interact.error(res.error_message);
        });
    }

    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        console.log(555555,id);
        vsapi.call(`${mThis.base_url}/hr/department/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  res.data : {};

            VSUtil.setComboItems(mThis.elStatusId, d.status, 'id', 'name', true, '(Select Status)', null);
            console.log(33333,d);
            onFinish(d);
        });
    }


    this.show = (options = {}) => {
        mThis.options = options;
        let id = options.id ?? null;
        console.log(123);

        mThis.prepareData(id, {}, (data) => {
            if (data.departments) {
                mThis.elTitle.textContent = "Modify Department Information";

            } else {
                mThis.elTitle.textContent = "Create Department";
            }
            mThis.setData(data.departments);
            mThis.modal.show();
        });
    };

    this.btnChooser.onclick = (e) => {
        e.preventDefault();
        FileChooser.chooseFile(null, (d) => {
            if (d) {
                const parent = mThis.btnChooser.parentElement;
                mThis.setImage(parent, d.dataUrl);
            }
        });
    };

    this.setImage = (div, image = null) => {
        if (image) {
            div.innerHTML = `
                <img class="w-100 h-100 object-fit-scale data-input" src="${image}" alt="department-icon" data-field="photo"/>
                <div class="position-absolute top-0 end-0 p-2 rounded-2 bg-dark" role="button">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </div>`;
            mThis.deleteImage(div);
        } else {
            div.innerHTML = `
                <div id="dlg_image_chooser" class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                    <i class="fa-regular fa-image fs-4 text-muted"></i>
                </div>`;
            mThis.chooseImage(div);
        }
    };

    this.deleteImage = (div) => {
        const btnDelete = div.querySelector('[role="button"]');
        btnDelete.onclick = (e) => {
            e.preventDefault();
            mThis.setImage(div);
        };
    };

    this.chooseImage = (div) => {
        const btnChoose = div.querySelector('#dlg_image_chooser');
        btnChoose.onclick = (e) => {
            e.preventDefault();
            FileChooser.chooseFile(null, (d) => {
                if (d) {
                    mThis.setImage(div, d.dataUrl);
                }
            });
        };
    };

    this.getDataForm = () => {
        const div = mThis.self;
        let p = { id: mThis.options.id };

        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            p[data_member] = (el.tagName === 'IMG') ? el.src : el.value;
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
        const containerImage = div.querySelector('[aria-label="image"]');
        console.log(4444,d);
        if(!d) return;
        mThis.setImage(containerImage, d.image_url);
        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            console.log(7777,data_member,'|',el);

            el.value = d[data_member] || '';
        });

    };
};
