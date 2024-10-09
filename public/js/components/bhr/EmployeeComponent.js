"use strict";

var EmployeeComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeComponent");
    this.self = this.jm[0];
    this.title_prop = "Employee management";
    this.elStatus = this.self.querySelector('#el_status');
    this.btnAdd = this.self.querySelector("#_btnAddEmployee");
    this.divFilter = this.self.querySelector("#_divFilter_emp");
    this.elSearch = this.self.querySelector("#_sdl_search_employee");
    this.employee_detail = mThis.self.querySelector('#_employee_detail');
    this.containerPagination = mThis.self.querySelector('#container_pagination');




    let div = mThis.self.querySelector('#_employee_list');
    this.init= () => {
        if(mThis.initAlready) return;

        mThis.EmployeeListView = new ListView('_employee_list', {
            fetchApi: `${main_view.base_url}/hr/employee/list-paginate`,
            // clientSidePagination: true,
            perPage: 8,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            processResponse:(res)=>{
                return res.data;
            },
            renderItems: (data,list_container) => {

                mThis.renderEmployeeList(list_container, data);
            },
            listContainerClass: null
        });
        this.listContainer = mThis.EmployeeListView.getListContainer();


        let content = mThis.self.querySelector('#_employee_list');
        console.log(2222,content);
        mThis.initDropdownMenus(content);///
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            // let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                // id: 1,
                btn: e.target,
                onClose: () => {
                    // content.parentElement.classList.remove('d-none');
                    mThis.EmployeeListView.showPage();
                }
            };
            // content.parentElement.classList.add('d-none');

            EmployeeDailog.show(op);
        };

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.EmployeeListView.showPage(mThis.getDataFormFilter());
        })

        mThis.initAlready = true;
    }
    this.renderEmployeeList = (div,data) => {
        console.log(666,div,777,data);


        data = data ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then(user => {
            // console.log(user);
           mThis.renderEmployee(data,user)
        });
    }
    this.renderEmployee = (data) => {
        console.log(777, data);

        let html = '';
        html += `<div id="_scroll_emp">
            <div id="_employee_detail" class="row px-3">
        `;

        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                const status = d.status || 'Active';
                // Determine the status and assign the background color accordingly
                const statusColor = status === 'Inactive' ? 'background-color: #dc3545;' : 'background-color: #2B3991;'; // #dc3545 is Bootstrap's danger color

                html += `
                    <div class="col-md-3 mt-3 mb-3">
                        <div class="card">
                            <div class="card-header">
                                <div class="status_employee" style="${statusColor} color: white; padding: 5px; border-radius: 5px;">
                                    <span>${status}</span>
                                </div>

                                <div class="dropdown">
                                    <a href="javascript:void(0)" class="btn_employee_action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="card-body text-center">
                                <img src="${d.image_url || '../uploads/public/1_data/default/images/mr.avif'}" class="rounded-circle mb-3"
                                    alt="Profile Picture" style="width: 100px; height: 100px;">
                                <h5 class="card-title">${d.first_name || 'John'} ${d.last_name || 'John Doe'}</h5>
                                <div class="card_container">
                                    <div class="employee_id">#: ${d.code || ''}</div>
                                    <div class="container_top">
                                        <div class="position">
                                            <i class="fa-solid fa-dashboard"></i> <span>${d.position || 'Web Developer'}</span>
                                        </div>
                                        <div class="me-3">
                                            <i class="fa-solid fa-clock"></i> <span>${d.session || 'Full Time'}</span>
                                        </div>
                                    </div>
                                    <div class="container_bottom">
                                        <div class="email">
                                            <i class="fas fa-envelope"></i> <span>${d.email || 'email@example.com'}</span>
                                        </div>
                                        <div class="phone">
                                            <i class="fas fa-phone"></i> <span>${d.phone_number || '012345678'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card_bottom">
                                    <div class="joining">Joining Date: ${d.joining_date || '01/Aug/2024'}</div>
                                    <a href="#" class="detail">See Detail</a>
                                </div>
                            </div>
                        </div>
                    </div>

                `;
                cmt++;
            });
        }

        if (cmt === 0) {
            html += `<div class="w-100 rounded-3 border-start text-center border-5 border-danger-custom p-3 shadow bg-white mb-3 position-relative">
            <div class="row">
                <div class="col">No Data Found</div>
            </div>
            </div>`;
        }

        html += `</div></div>`;
        div.innerHTML = html;
        const sh_parent = div.querySelector('#_scroll_emp');
        sh_parent.style.height = (window.innerHeight - 150) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        window.onresize = function(e) {
            e.preventDefault();
            sh_parent.style.height = (window.innerHeight - 150) + 'px';
        };
    };
    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.EmployeeListView) {
                mThis.EmployeeListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("EmployeeListView is not defined");
            }
        }, 200);
    });



    this.getDataFormFilter = () => {
        let p = {};
        p.status_id = mThis.elStatus.value;
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
        console.log(3333,table);

        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_employee_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[

                {
                    html:'<span class="ps-2  " vslang="titles.Modify Employee">Modify Employee</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_employee"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Employee">Delete Employee</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_employee"
                },

            ],
            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'edit_employee':{
                      mThis.editEmployee(id, menuLink);
                      break;
                    }
                    case 'delete_employee':{
                        mThis.deleteEmployee(id, menuLink);
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
    this.editEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            }
        };
        EmployeeDailog.show(op);
    }

    this.deleteEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Employee?',{
            title: 'Delete Employee',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/employee/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.EmployeeListView.showPage();
                    }
                })
            }
        });

    }

    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/employee/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};

            VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All',null);
        })
    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.EmployeeListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(250);
            };


});

const EmployeeDailog = new function() {
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_sdl_add_employee');
    this.modal = new bootstrap.Modal(this.self);
    this.base_url = main_view.base_url;
    this.options = {};

    this.btnSave =  this.self.querySelector('#dlg_sdl_add_employee_btn_save');
    this.elPositionId =  this.self.querySelector('#_sdl_position_id');
    this.elSessionId =  this.self.querySelector('#_sdl_session_id');
    this.elStatusId =  this.self.querySelector('#_sdl_status_id');
    this.elGenderId =  this.self.querySelector('#_sdl_gender_id');
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.div_employee_info = mThis.self.querySelector('#_sdl_employee_info');
    this.btnChooser = mThis.self.querySelector('#dlg_image_chooser');

    this.btnSave.onclick =  e =>{
        e.preventDefault();
        let p = mThis.getDataForm();
        console.log(77777,p);

        vsapi.call(`${mThis.base_url}/hr/employee/save`, p,mThis.btnSave,false).then(res => {
            if(res.status_code === 200){
                mThis.modal.hide();
                const d = res.data ?? {};
                cv_interact.success('Employee Saved Success!');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            }
            else
                cv_interact.error(res.error_message);
        });
    };

    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        console.log(555555);
        vsapi.call(`${mThis.base_url}/hr/employee/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  res.data : {};


            VSUtil.setComboItems(mThis.elPositionId, d.positions, 'id', 'name', true, '(Select Position)', null);
            VSUtil.setComboItems(mThis.elStatusId, d.status, 'id', 'name', true, '(Select Status)', null);
            VSUtil.setComboItems(mThis.elSessionId, d.sessions, 'id', 'name', true, '(Select Session)', null);
            VSUtil.setComboItems(mThis.elGenderId, d.genders, 'id', 'name', true, '(Select Gender)', null);
            console.log(33333,d);
            onFinish(d);
        });
    }


    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
        let id = options.id??null;

        mThis.prepareData(id,{},data => {
            if(data.employee){
                mThis.elTitle.textContent =  "Modify Employee Information";
            }
            else{
                mThis.elTitle.textContent =  "Create Employee ";
            }
            console.log(6666);

            mThis.setData(data.employee);
            mThis.modal.show();
        });
    }

        mThis.btnChooser.onclick = function(e){
        e.preventDefault();
        FileChooser.chooseFile(null,(d) => {
            if(d){
                const parent = this.parentElement;
                mThis.setImage(parent,d.dataUrl);
            }
        });
    }

    this.setImage = (div,image=null) => {
        if(image){
            const html = `<image class="w-100 h-100 object-fit-scale data-input" src="${image}" alt="social-icon" data-field="photo"/>
            <div class="position-absolute top-0 end-0 p-2 rounded-2 bg-dark" role="button">
                <i class="fa-regular fa-trash-can text-danger fs-5"></i>
            </div>`;
            div.innerHTML = html;
            mThis.deleteImage(div);
        }
        else{
            const html = `<div id="dlg_image_chooser"
                                class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                <i class="fa-regular fa-image fs-4 text-muted"></i>
                            </div>`;
            div.innerHTML = html;
            mThis.chooseImage(div);
        }
    }

    this.deleteImage = (div) => {
        const btnDelete = div.querySelector('[role=\'button\']');
        btnDelete.onclick = function(e){
            e.preventDefault();
            const html = `<div id="dlg_image_chooser"
                                class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                <i class="fa-regular fa-image fs-4 text-muted"></i>
                            </div>`;
            div.innerHTML = html;
            mThis.chooseImage(div);
        }
    }

    this.chooseImage = (div) => {
        const btnChoose = div.querySelector('#dlg_image_chooser');
        btnChoose.onclick = function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    mThis.setImage(div,d.dataUrl);
                }
            });
        }
    }

    this.getDataForm = () => {
        const div = mThis.self;
        let p = {
            id: mThis.options.id
        };

        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            if(el.tagName === 'IMG'){
                p[data_member] = el.src;
            }
            else{
                p[data_member] = el.value;
            }
        });

        return p;
    }
    this.setData = (d) => {
        d =d ?? {};
        const div = mThis.self,
    containerImage = div.querySelector('[aria-label=\'image\']');
        let elements = div.querySelectorAll('.data-input');
        mThis.setImage(containerImage,d.image_url);

        elements.forEach(el =>{
            const data_member = el.dataset.field;
            el.value = d[data_member] ? d[data_member] : '';


    });
}

}
