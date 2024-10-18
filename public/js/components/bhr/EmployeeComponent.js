"use strict";

var EmployeeComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeComponent");
    this.self = this.jm[0];
    this.title_prop = "Employee management";
    this.elStatus = this.self.querySelector('#el_status');
    this.elRole = this.self.querySelector('#el_role');
    this.btnAdd = this.self.querySelector("#_btnAddEmployee");
    this.btnBack = this.self.querySelector('#_btn_backTo_employee');
    this.divFilter = this.self.querySelector("#_divFilter_emp");
    this.elSearch = this.self.querySelector("#_sdl_search_employee");
    this.containerPagination = mThis.self.querySelector('#container_pagination');
    this.profile_card_center = mThis.self.querySelector('#profile_card_center');
    this.profile_card_left = mThis.self.querySelector('#profile_card_left');
    this.profile_info_emp = mThis.self.querySelector('#profile_info_emp');

    let div = mThis.self.querySelector('#_employee_list');
    this.init= () => {
        if(mThis.initAlready) return;

        mThis.EmployeeListView = new ListView('_employee_list', {
            fetchApi: `${main_view.base_url}/hr/employee/list-paginate`,
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
        mThis.initDropdownMenus(content);
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

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

            EmployeeDialog.show(op);
        };
        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            // let view_profile_info = mThis.self.querySelector('#sub_view_profile');
            // view_profile_info.classList.add('d-none');
            let btnBack = mThis.self.querySelector('#btn_back');
            btnBack.classList.add('d-none');
            let sub_content = mThis.self.querySelector('#sub_content');
            sub_content.classList.remove('d-none');

        }


        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.EmployeeListView.showPage(mThis.getDataFormFilter());
        });



        mThis.initAlready = true;
    }
    this.renderEmployeeList = (div,data) => {
        data = data ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }

        AuthManager.init().then(user => {
           mThis.renderEmployee(data,user)
        });
    }
    this.renderEmployee = (data) => {
        let html = '';
        html += `<div id="_scroll_emp" class="row px-3">`;
        let cmt = 0;
    
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                const status = d.status || 'Active';
                let statusColor;
    
                switch (status) {
                    case 'Terminated':
                        statusColor = 'background-color: #dc3545;'; // Red for Terminated
                        break;
                    case 'Resigned':
                        statusColor = 'background-color: #ffc107;'; // Yellow for Resigned
                        break;
                    default:
                        statusColor = 'background-color: #2B3991;'; // Blue for Active
                        break;
                }
    
                html += `
                    <div class="col-md-3 mt-5 mb-3 employee-card" data-employee-id="${d.id}">
                        <div class="card">
                            <div class="card-header">
                                <div class="status_employee" style="${statusColor} color: white; padding: 3px; border-radius: 20px;">
                                    <span>${status}</span>
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0)" class="btn_employee_action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false">
                                        <img src="${main_view.asset_url}/images/bhr/more_vert.svg">
                                    </a>
                                </div>
                            </div>
                            <div class="card-body text-center">
                                <img src="${d.image_url || '../uploads/public/1_data/default/images/mr.avif'}" class="rounded-circle mb-3"
                                    alt="Profile Picture" style="width: 100px; height: 100px;">
                                <div class="card-title">
                                    <h5>${d.name}</h5>
                                </div>
                                <div class="card_container">
                                    <div class="employee_id">#: ${d.code || ''}</div>
                                    <div class="container_top">
                                        <div class="position">
                                            <i class="fa-solid fa-dashboard"></i> <span>${d.position || 'Web Developer'}</span>
                                        </div>
                                        <div class="me-3">
                                            <i class="fa-solid fa-clock"></i> <span>${d.role || ' Staff'}</span>
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
                                <div class="card_bottom pt-3">
                                    <div class="joining">Joining Date: ${d.joining_date || '01/Aug/2024'}</div>
                                    <a href="javascript:void(0)" class="see-detail" data-id="${d.id}" aria-haspopup="true" aria-expanded="false">view info</a>
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
    
        html += `</div>`;
        div.innerHTML = html;
    
        const sh_parent = div.querySelector('#_scroll_emp');
        sh_parent.style.height = (window.innerHeight - 195) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');
    
        // Handle resize
        window.onresize = function(e) {
            e.preventDefault();
            sh_parent.style.height = (window.innerHeight - 100) + 'px';
        };
    
        const seeProfileInfo = div.querySelectorAll('.see-detail');
        seeProfileInfo.forEach(link => {
    
            link.addEventListener('click', (e) => {
                const employeeId = e.target.dataset.id;
    
                const employeeData = data.find(emp => emp.id == employeeId);
    
                if (employeeData) {
                    let sub_content = mThis.self.querySelector('#sub_content');
                    sub_content.classList.add('d-none');
                    let btnBack = mThis.self.querySelector('#btn_back');
                    btnBack.classList.remove('d-none');
    
                    mThis.renderProfile(employeeData);
                    mThis.renderCardCenter(employeeId);
                    mThis.renderCardLeft(employeeId);
                } else {
                    console.error('Employee data not found for ID:', employeeId);
                }
            });
        });
    };
    


    this.renderProfile = (data) => {
        let html = `
                    <div class="d-block ms-3 w-100">
                        <div class="row row-cols-3 mb-0">
                            <div class="col-2">
                                <div class="div-img">
                                    <img src="${data.image_url || '../uploads/public/1_data/default/images/mr.avif'}" alt="Employee Image">
                                </div>
                                <div class="social-icons d-flex justify-content-start mt-3">
                                    <a href="#" class="mx-2"><img src="assets/images/bhr/facebook.svg" alt="Facebook"></a>
                                    <a href="#" class="mx-2"><img src="assets/images/bhr/linkedin.svg" alt="Linkedin"></a>
                                    <a href="#" class="mx-2"><img src="assets/images/bhr/telegram.svg" alt="Telegram"></a>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Name</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.name}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">KH Name</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.name_kh}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Sex</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.sex == 'M' ? 'Male' : ''}${data.sex == 'F' ? 'Female' : ''}${data.sex == 'O' ? 'Other' : ''}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Position</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.position || ''}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Email</p>
                                    <p class="px-2">:</p>
                                    <p class="text-primary">${data.email || ''}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Tel</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.phone_number || ''}</p>
                                </div>
                                  <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">ID</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.code || ''}</p>
                                </div>

                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Role</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.role || ''}</p>
                                </div>
                                                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Work Shift</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.work_shift || ''}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Nationality</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.nationality || ''}</p>
                                </div>

                                <div class="d-flex">
                                    <p class="text-nowrap text-muted width-p">Date of Birth</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.date_of_birth || ''}</p>
                                </div>
                                <div class="d-flex align-items-center">
                                    <p class="text-nowrap text-muted   width-bp" vslang="titles.Address">Address</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.address}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.NSSF">NSSF</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.nssf_id}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Identity Card">Identity Card</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.nid}</p>
                                </div>
                            </div>
                        </div>
                    </div>
        `;

        this.profile_info_emp.innerHTML = html;
    };




    this.renderCardLeft = (employeeId) => {
        let html = '';
        
        html = [`
             <div class="card" style="height:487px;">
                            <div class="card-header">
                                <h4>Skills</h4>
                                <span class="ellipsis">...</span>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <p>PHP</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 85%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>JavaScript</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 70%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Node.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 50%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Vue.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 65%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Laravel</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 60%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>OOP</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 80%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Next.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 40%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>React.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 60%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
            `].join('');
            this.profile_card_left.innerHTML = html;


    }
    this.renderCardCenter = (employeeId) => {
        let p = {
            'emp_id': employeeId,
        };
        console.log(1, p);
    
        vsapi.call(`${main_view.base_url}/hr/education/list-all`, p, null, false, false).then(res => {
            let data = (res.status_code === 200) ? res.data.data : [];
            console.log(123456, data);
            let html = `<div class="card" style="height:487px;">
                <div class="card-header">
                    <h4>Education</h4>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" data="id" id="lnk_add_education">
                            <i class="fa fa-plus-circle fs-5 text-success"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body">
            `;
            data.map(d => {
                html += `
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <h5>${d.period}</h5>
                            <p class="text-warning">${d.edu_level}</p>
                            <p class="text-nowrap">${d.major}</p>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="d-flex justify-content-end">
                                <div class="d-flex gap-2 mt-4">
                                    <span class="text-muted">${d.school}</span>

                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
    
            html += `</div></div>`;
            this.profile_card_center.innerHTML = html;
    
            document.getElementById('lnk_add_education').addEventListener('click', function (e) {
                e.preventDefault();
                let op = {
                    id: null,
                    emp_id: employeeId,
                    btn: e.target,
                    title: "New Education",
                    onClose: () => {
                        mThis.EmployeeListView.showPage();
                    }
                };
                console.log(op);
                AddEducation.show(op);
            });
    
          
        });
    }
    


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
        p.role_id = mThis.elRole.value;
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
                    html:'<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon:`<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass:"border-bottom pb-2",
                    name:"change_employee_status"
                },

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

                    case 'change_employee_status':{
                        mThis.changeStatus(id,menuLink);
                        break;
                    }
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

    this.changeStatus = (id, lnk)=>{
        // if(!AuthManager.allowed(337,false))
        //         return;
        //let status_code = Validator.properCase(lnk.dataset.status);
        let tr = lnk.closest('tr');
        let status_id = Validator.properCase(tr? tr.dataset.status_id: "");
        let inputOptions = {
            title: 'Set Employee Status',
            dataLabel: "Employee status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText:"Save",
            blankErrorMessage: "Status is not correct!",
            data: [{
                status_id: "10",
                name: "Active"
            },
            {
                status_id: "20",
                name: "Resigned"
            },
            {
                status_id: "21",
                name: "Terminated"
            }
        ],
            defaultValue: status_id
        };

        InputBox2.show(inputOptions,(d)=>{
            if(d){
                let p = {
                    id: id,
                    status_id: d.value
                };
                console.log(123,p);

                vsapi.call(`${mThis.base_url}/hr/employee/update-status`,p).then(res => {
                    if(res.status_code === 200){

                        InputBox2.close();
                        cv_interact.success('The Employee status has been updated');
                        mThis.EmployeeListView.showPage(mThis.getDataFormFilter());
                    }
                    else
                        cv_interact.error(res.error_message);
                });
            }
        });
    }
    this.editEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            }
        };
        EmployeeDialog.show(op);
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
            VSUtil.setComboItems(mThis.elRole,d.roles,'id','name',true,'All',null);
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

const AddEducation = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            title: op.id ? "Edit Employee Seniority" : "New Employee Seniority",  // Dynamically set title
            cssClass: "modal-md d-flex justify-content-center",
            createContent: () => {
                return [
                    `<div class="row">
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.School">School</label>
                            <div><select name="school_id" class="data-input" data-field="school_id"></select></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.Level">Level</label>
                            <div><select name="edu_level_id" class="data-input" data-field="edu_level_id"></select></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Period">Period</label>
                            <div><input name="period" class="form-control data-input" data-field="period"/></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Major">Major</label>
                            <div><input name="major" class="form-control data-input" data-field="major"/></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Start Year">Start Year</label>
                            <div><input name="start_year" class="form-control data-input" data-field="start_year"/></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.End Year">Finish Year</label>
                            <div><input name="end_year" class="form-control data-input" data-field="end_year"/></div>
                        </div>

                        <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Diploma">Diploma</label>
                            <div><input name="diploma" class="form-control data-input" data-field="diploma"/></div>
                        </div>
                    </div>`

                ].join('');
            },
            buttons:[
                {
                   label:"<span>Cancel</span>",
                   cssClass:"btn btn-warning text-white",
                   click:(me)=>{
                      me.hide(false);
                   }
                },
                {
                   label:"<span>Save</span>",
                   cssClass:"btn btn-primary",
                   click:(me)=>{

                      let p = me.getData();
                          p.emp_id = op.emp_id; 
                      vsapi.call([main_view.base_url,'/hr/education/save'].join(''),p,false,false).then(res =>{
                          if(res.status_code ==200){
                              me.modal.hide(true,p);
                              console.log(111,me.dataOptions);
                              EmployeeComponent.renderCardCenter(me.dataOptions.emp_id);
                          }else 
                          cv_interact.error(res.error_message);
                      });
                   }
                }
             ],
            configSelect: [
                {
                    name: "school_id",
                    data: "schools",
                    valueField: "id",
                    textField: "name",
                    filterData: (data, res) => {

                        return data;
                    }
                },
                {
                    name: "edu_level_id",
                    data: "edu_levels",
                    valueField: "id",
                    textField: "name",
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
                    endpoint: `${main_view.base_url}/hr/education/form-options`,
                    params: (op) => {
                        return { id: op.id };  // Pass ID to fetch data for edit
                    },
                    onResponse: (me, res) => {
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

const EmployeeDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [`<div class="row">
                            <div class="col-3">
                                <div name="div_emp_photo" class="data-input" data-field="image_url" role="button"></div>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label" vslang="titles.Name"></label>
                                        <input name="name" class="form-control data-input" data-field="name" />
                                    </div>

                                    <div class="form-group col-6">
                                        <label for="name_kh" class="form-label" vslang="titles.Name Kh"></label>
                                        <input name="name_kh" class="form-control data-input" data-field="name_kh" />
                                    </div>
                                    <div class="form-group col-4">
                                       <label for="sex" class="form-label" vslang="titles.Sex"></label>
                                            <select class="modal-select data-input" data-field="sex">
                                                <option value="">(Select Sex)</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="O">Other</option>
                                            </select>

                                    </div>
                                    <div class="form-group col-4">
                                        <label for="date_of_birth" class="form-label" vslang="titles.Date Of Birth"></label>
                                        <input name="date_of_birth" class="form-control data-input" data-field="date_of_birth" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="nationality" class="form-label" vslang="titles.Nationality"></label>
                                        <input name="nationality" class="form-control data-input" data-field="nationality" />
                                    </div>

                                </div>
                            </div>
                           <div class="form-group col-3">
                                    <label for="nid" class="form-label" vslang="titles.Identity Card"></label>
                                    <input name="nid" class="form-control data-input" data-field="nid" />
                            </div>
                            <div class="form-group col-4">
                                <label for="phone_number" class="form-label" vslang="titles.Phone"></label>
                                <input name="phone_number" class="form-control data-input" data-field="phone_number" />
                            </div>
                            <div class="form-group col-5">
                                <label for="email" class="form-label" vslang="titles.Email"></label>
                                <input type="email" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />
                            </div>
                            <div class="form-group col-6">
                                <label for="joining_date" class="form-label" vslang="titles.Joining Date"></label>
                                <input name="joining_date" class="form-control data-input" data-field="joining_date" />
                            </div>
                        <div class="form-group col-6">
                            <label for="position" class="form-label" vslang="titles.Position"></label>
                            <select name="position" class=" data-input"  data-field="positions_id"></select>
                        </div>

                        <div class="form-group col-6">
                           <label for="role" class="form-label" vslang="titles.Role"></label>
                            <select name="role" class=" data-input"  data-field="emp_role_id"></select>
                        </div>
                        <div class="form-group col-6">
                            <label for="work_shift" class="form-label" vslang="titles.Work Shift"></label>
                            <select name="work_shift" class=" data-input"  data-field="work_shift_id"></select>
                        </div>

                        <div class="form-group col-6">
                            <label for="nssf_id" class="form-label" vslang="titles.NSSF ID"></label>
                            <input name="nssf_id" class="form-control data-input" data-field="nssf_id" />
                        </div>
                        <div class="form-group col-6">
                            <label for="address" class="form-label" vslang="titles.Address"></label>
                            <input name="address" class="form-control data-input" data-field="address" />
                        </div>

              </div>`].join('');
            },
            contentCreated:(me)=>{
               //Convert field to be DatePicker : start_date and end_date
               DateTimePicker.init(me.controls.date_of_birth);
               DateTimePicker.init(me.controls.joining_date);
               console.log(444);
               LocaleManager.translateZone(me.divModal);
                let div_emp_photo = me.divModal.querySelector('[name="div_emp_photo"]');
                me.userImageBox = new ImageBox(div_emp_photo,{containerclass:'emp-profile-container',imgClass:"data-input",dataset:{"field" :"image_url"}});
                console.log(999,op);

                me.showProfile =  (code) =>{
                   let fields = [];
                   let p = {'id':code};
                   console.log(4545,me);

                   vsapi.call([main_view.base_url,'/hr/employee/form-options'].join(''),p,false,false).then(res =>{
                      let d = res.status_code ==200? res.data: {};
                      d = d.employee || {};

                      me.divModal.querySelectorAll('.data-input').forEach(el =>{
                         const f =el.dataset.field;
                         console.log(7788899,d);

                         if(fields.indexOf(f)>=0){
                               el.value = d[f] || "";
                         }
                        else if(f ==='image_url'){
                            if (me.dataOptions.id)
                            el.innerHTML = `<img name="div_emp_photo" class="w-100" src="${d[f] || ''}"/>`;
                        }
                      });
                   });
                };
                me.deleteImage = (div) => {
                    const btnDelete = div;//.querySelector('[role=\'button\']');
                    btnDelete.onclick = function(e){
                        e.preventDefault();
                        const html = `<div id="dlg_image_chooser"
                                            class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                            <i class="fa-regular fa-image fs-4 text-muted"></i>
                                        </div>`;
                        div.innerHTML = html;
                        // mThis.chooseImage(div);
                        // let div_emp_photo = div.querySelector('[name="div_emp_photo"]');
                        me.userImageBox = new ImageBox(div,{containerclass:'emp-profile-container',imgClass:"data-input",dataset:{"field" :"image_url"}});
                    }
                }

                me.deleteImage(div_emp_photo);


                me.showProfile(me.dataOptions.id);


            },
            configSelect:[
               {
                 name:"position",
                 data:'positions',
                 textField:"title",
                 valueField:'id'
               },
               {
                name:"role",
                data:'roles',
                textField:"name",
                valueField:'id'
               },
               {
                name:"work_shift",
                data:'work_shifts',
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
                    let p = me.getData();
                    p.photo = me.userImageBox? me.userImageBox.getImage(): '';
                    console.log(222444,p);
                    vsapi.call( [main_view.base_url,'/hr/employee/save'].join(''), p,btn,false,false).then(res =>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Employee',
               modifyTitle:'Edit Employee',
               targetProp: 'employee',
               api:{
                endpoint: [main_view.base_url,'/hr/employee/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
               onResponse: (me, res)=>{
                 console.log('result from api "/form-options": ', res);
               }
            },

            onPrepareForm:(me, data)=>{
                 LocaleManager.translateZone(me.divModal);
            }

        });

        dialog.show(op);
     }

    return self;
})();
