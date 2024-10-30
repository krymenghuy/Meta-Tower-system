"use strict";

var EmployeeComponent = new function () {
    let mThis = this;
    this.title_prop = "Employee management";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeComponent");
    this.self = this.jm[0];

    this.elEmployeeStatus = this.self.querySelector("#filter_employee_status");
    this.elEmployeeType = this.self.querySelector("#filter_employee_type");
    this.btnAdd = this.self.querySelector("#_btn_add_employee");
    this.btnBack = this.self.querySelector("#_btn_backTo_employee");
    this.div_filter_fields = this.self.querySelector("#div_filter_filed");
    this.elSearch = this.self.querySelector("#_search_employee");
    this.profile_card_center = mThis.self.querySelector("#profile_card_center");
    this.profile_card_left = mThis.self.querySelector("#profile_card_left");
    this.profile_card_right = mThis.self.querySelector("#profile_card_right");
    this.tax_allownce_card = mThis.self.querySelector("#tax_allownce_card");
    this.profile_info_emp = mThis.self.querySelector("#profile_info_emp");
    this.paginationContainer = mThis.self.querySelector('#container_pagination');
    let div = mThis.self.querySelector("#_employee_list");
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView("_employee_list", {
            fetchApi: `${main_view.base_url}/hr/employee/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.paginationContainer,

            apiCluster: main_view.apiCluster,
            processResponse: (res) => {
                console.log(1234,res.data.data);

                    return res.data;
            },
            renderItems: (data, list_container) => {
                mThis.renderEmployeeList(list_container, data);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeListView.showPage();
                },
            };

            EmployeeDialog.show(op);
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            let view_see_info = mThis.self.querySelector("#view_see_info__");
            view_see_info.classList.add("d-none");
            let sub_content = mThis.self.querySelector("#sub_content");
            sub_content.classList.remove("d-none");
            mThis.EmployeeListView.showPage(mThis.getFilterData());
        };

        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = e =>{
                e.preventDefault();
                mThis.EmployeeListView.showPage(mThis.getFilterData());

            }
        });
        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },250);

        };
         this.listContainer = mThis.EmployeeListView.getListContainer();
         console.log(12,mThis.listContainer);
         mThis.initDropdownMenus(div);


         const sh_parent = mThis.listContainer.parentElement;
         sh_parent.style.height = (window.innerHeight - 200) + 'px';
         sh_parent.classList.add('overflow-y-auto');
         window.onresize = () =>{
             sh_parent.style.height = (window.innerHeight - 190) + 'px';
         }


        mThis.initAlready = true;
    };

    this.getFilterData = () => {
        let p = {};
            p.status_id = mThis.elEmployeeStatus.value;
            p.emp_type_id = mThis.elEmployeeType.value;
            p.search_value = mThis.elSearch.value;
            mThis.div_filter_fields.querySelectorAll('.filter-field').forEach( el => {
                let f = el.dataset.field;
                p[f] = el.value;
            });

        return p;
    };
    this.initDropdownMenus = (listContainer) => {
        console.log(listContainer);

        const menuOptopns = {
            containerElement: listContainer,
            actionButtonClass: "btn_employee_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "change_employee_status",
                },

                {
                    html: '<span class="ps-2  " vslang="titles.Modify Employee">Modify Employee</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_employee",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Employee">Delete Employee</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_employee",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_employee_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case "edit_employee": {
                        mThis.editEmployee(id, menuLink);
                        break;
                    }
                    case "delete_employee": {
                        mThis.deleteEmployee(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    this.renderEmployeeList = (div, data) => {
        data = data ?? [];
        if (!AuthManager) {
            console.error(
                "Authentication Management does not seems to work properly. You may need to refresh page"
            );
            return;
        }

        AuthManager.init().then((user) => {
            mThis.renderEmployee(data, user);
        });
    };
    this.renderEmployee = (data) => {
        let html = "";
        html += `<div  class="row px-3">`;
        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                const status = d.status || "Active";
                let statusColor;

                switch (status) {
                    case "Terminated":
                        statusColor = "background-color: #dc3545;";
                        break;
                    case "Resigned":
                        statusColor = "background-color: #ffc107;";
                        break;
                    default:
                        statusColor = "background-color: #2B3991;";
                        break;
                }

                html += `
                    <div class="col-md-3 mt-2 mb-3 employee-card" data-employee-id="${d.id
                    }">
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
                                <img src="${d.image_url || "../assets/images/logo/default_image_user.avif" }" class="rounded-circle mb-3"
                                    alt="Profile Picture" style="width: 100px; height: 100px;">
                                <div class="card-title">
                                    <h5 class="text-success">${d.name}</h5>
                                </div>
                                <div class="card_container">
                                    <div class="employee_id text-primary">#: <span class="ms-1">${d.code || "null"}</span></div>
                                    <div class="container_top">
                                        <div class="position">
                                            <i class="text-danger  fa-solid fa-dashboard"></i> <span class="ms-1"> ${d.position || "null"}</span>
                                        </div>
                                        <div class="me-3">
                                            <i class=" text-primary fa-solid fa-clock"></i> <span>${d.type || "null"}</span>
                                        </div>
                                    </div>
                                    <div class="container_bottom">
                                        <div class="email">
                                            <i class="text-warning fas fa-envelope"></i> <span>${d.email || "null"}</span>
                                        </div>
                                        <div class="phone">
                                            <i class="text-primary fas fa-phone"></i> <span>${d.phone_number || "null"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="card_bottom pt-3">
                                    <div class="text-muted" style="font-size:11px;">Joining Date: <span class="text-dark">${d.joining_date || "null"}</span></div>
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
            html += `<div class="w-100 rounded-3  text-center mt-3 mb-3 position-relative">
                    <div class="d-flex bg-grey shadow rounded-5 p-3"><span class="d-flex align-items-center justify-content-center p-2 w-100 text-danger">Employee not found! </span></div>
            </div>`;
        }

        html += `</div>`;
        div.innerHTML = html;

        // const sh_parent = div.querySelector("#_scroll_emp");
        // sh_parent.style.height = window.innerHeight - 195 + "px";
        // sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");

        // // Handle resize
        // window.onresize = function (e) {
        //     e.preventDefault();
        //     sh_parent.style.height = window.innerHeight - 100 + "px";
        // };

        const seeProfileInfo = div.querySelectorAll(".see-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                const employeeId = e.target.dataset.id;

                const employeeData = data.find((emp) => emp.id == employeeId);

                if (employeeData) {
                    let sub_content = mThis.self.querySelector("#sub_content");
                    sub_content.classList.add("d-none");
                    let view_see_info = mThis.self.querySelector("#view_see_info__");
                    view_see_info.classList.remove("d-none");


                    mThis.renderProfile(employeeData);
                    mThis.renderCardCenter(employeeId);
                    mThis.renderCardLeft(employeeId);
                    mThis.renderCardRight(employeeId);
                    mThis.renderCardTaxAllowance(employeeId);
                } else {
                    console.error(
                        "Employee data not found for ID:",
                        employeeId
                    );
                }
            });
        });
    };

    this.renderProfile = (data) => {
        let html = `<div class="employee-card d-flex p-3 bg-primary-custom h-info-student mb-2" data-id="">
                    <div class="d-block ms-3 w-100">
                        <div class="row text-white mb-0">
                            <div class="col-md-3">
                                <div class="div-img ms-2">
                                    <img src="${data.image_url || "../uploads/public/1_data/default/images/mr.avif"}" alt="Employee Image">
                                </div>
                                <div class="d-flex mt-3 ms-5 justify-content-start">
                                    <span class="text-white">ID : ${data.code || ""}</span>
                                </div>
                                
                            </div>
                            <div class="col-md-3">
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Name</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.name}</p>
                                </div>
                               
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Sex</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.sex == "M" ? "Male" : ""}${data.sex == "F" ? "Female" : ""}${data.sex == "O" ? "Other" : ""}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Nationality</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.nationality || ""}</p>
                                </div>
                                 <div class="d-flex">
                                    <p class="text-nowrap    width-p" vslang="titles.Identity Card">Identity Card</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.nid}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Date of Birth</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.date_of_birth || ""}</p>
                                </div>
                               
                                  

                            </div>
                            <div class="col-md-3">
                            
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Position</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.position || ""}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Work Shift</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.work_shift || "" }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Employee Type</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.type || ""}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Tel</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.phone_number || ""}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Email</p>
                                    <p class="px-2">:</p>
                                    <p class="text-primary">${data.email || ""}</p>
                                </div>
                        
                               
                            </div>

                            <div class="col-md-3">
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Salary Base</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">៛​${data.salary_base || ""}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Payroll Tax</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${data.apply_payroll_tax == "0" ? "Have Tax" : ""}${data.apply_payroll_tax == "1" ? "Non Tax" : ""}</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap    width-p" vslang="titles.NSSF">NSSF</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.nssf_id}</p>
                                </div>
                               <div class="d-flex align-items-center">
                                    <p class="text-nowrap    width-bp" vslang="titles.Address">Address</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${data.address}</p>
                                </div>
                            
                            </div>
                           

                        </div>
                        <div class="d-flex justify-content-between px-2">
                            <div class="social-icons d-flex justify-content-start mt-3">
                                <a href="https://www.facebook.com" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/facebook.svg" alt="Facebook"></a>
                                <a href="https://www.linkedin.com" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/linkedin.svg" alt="Linkedin"></a>
                                <a href="https://web.telegram.org/a/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/telegram.svg" alt="Telegram"></a>
                            </div>
                            <div>
                                <button class="btn_movement_action btn btn-light rounded-3 btn-options position-relative text-nowrap" data-id="${data.id}" data-pricelistid="${data.price_list_id}" data-status ="${data.status_id}" type="button">
                                    <span class="text-nowrap text-primary-custom" vslang="buttons.Movement">Movement</span>
                                    <i class="fa-solid text-primary-custom fa-caret-down ps-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    </div>
        `;

        this.profile_info_emp.innerHTML = html;
        mThis.initDropdownMenusInfo(mThis.profile_info_emp);

    };
    this.initDropdownMenusInfo = (listContainer) => {
        console.log(listContainer);

        const menuOptopns = {
            containerElement: listContainer,
            actionButtonClass: "btn_movement_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Edit Profile">Edit Profile</span>',
                    icon: `<i class="fa-regular fa-pencil fs-5"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "edit_emp_profile_info",
                },

                {
                    html: '<span class="ps-2  " vslang="titles.Promotion Employee">Promotion Employee</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "promotion_employee",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Change Branch Employee">Change Branch Employee</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "branch_transfer",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_employee_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case "edit_emp_profile_info": {
                        mThis.editEmployee(id, menuLink);
                        break;
                    }
                    case "delete_employee": {
                        mThis.deleteEmployee(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }
    this.renderCardLeft = (employeeId) => {
        let html = "";

        html = [
            `
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
            `,
        ].join("");
        this.profile_card_left.innerHTML = html;
    };
    this.renderCardCenter = (employeeId) => {
        let p = {
            emp_id: employeeId,
        };
        console.log(1, p);

        vsapi
            .call(
                `${main_view.base_url}/hr/education/list-all`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let data = res.status_code === 200 ? res.data.data : [];
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
                <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
            `;
                data.map((d) => {
                    html += `
                    <div class="row mt-2 py-4 border-bottom">
                        <div class="col-md-6">
                            <h6 style="width:180px; height:20px overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap">${d.period}</h6>
                            <p class="text-success" style="width:180px; height:20px">${d.edu_level}</p>
                            <p class="text-nowrap" style="width:180px; height:20px">${d.major}</p>
                        </div>

                        <div class="col-md-6">
                            <div class="d-flex justify-content-end">
                                <div class="d-flex gap-2 mt-4">
                                    <span class="">${d.school}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                });

                html += `</div></div>`;
                this.profile_card_center.innerHTML = html;

                document
                    .getElementById("lnk_add_education")
                    .addEventListener("click", function (e) {
                        e.preventDefault();
                        let op = {
                            id: null,
                            emp_id: employeeId,
                            btn: e.target,
                            title: "New Education",
                            onClose: () => {
                                mThis.EmployeeListView.showPage();
                            },
                        };
                        console.log(op);
                        AddEducation.show(op);
                    });
            });
    };
    this.renderCardRight = (employeeId) => {
        let p = {
            emp_id: employeeId,
        };
        console.log(1, p);

        vsapi
            .call(
                `${main_view.base_url}/hr/experience/list-all`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let data = res.status_code === 200 ? res.data.data : [];
                console.log(123456, data);
                let html = `<div class="card" style="height:487px;">
            <div class="card-header">
                <h4>Experience</h4>
                <div class="d-flex gap-2">
                    <a href="javascript:void(0)" data="id" id="lnk_add_experience">
                        <i class="fa fa-plus-circle fs-5 text-warning"></i>
                    </a>
                </div>
            </div>
            <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
        `;

                data.map((d) => {
                    html += `
                <div class="row py-3 border-bottom border-info">
                    <div class="col-md-6" style="display: flex; flex-direction: column; gap:10px">
                        <div class="experience-toggle" data-experience-id="${d.id}"
                            style="display:flex; justify-content:space-between; width:350px; cursor: pointer;">
                            <div style="display:flex; width:350px; justify-content:space-between">
                                <p class="text-primary" style="font-size:14px;width:125px;display:flex;justify-content:start; overflow-y: hidden; overflow-x: auto; scrollbar-width: none; align-items: flex-start; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap;">
                                    📢${d.position}
                                </p>
                                <div class="date_join" style="width:200px;display:flex;justify-content:end;align-items:end;text-align:right; overflow-y: hidden; overflow-x: auto; scrollbar-width: none;">
                                    <p>: (${d.start_date}</p>
                                    <p class="text-danger ml-2 mr-2">-</p>
                                    <p>${d.end_date})</p>
                                </div>
                            </div>
                        </div>
                        <div class="experience-details" id="details_${d.id}"
                            style="display: none; flex-direction: column; gap:10px; transition: all 0.3s ease;">
                            <p class="text-success">Position: ${d.position}</p>
                            <div style="display:flex">
                                <p class="text-nowrap mr-2">Detail: </p>
                                <p class="text-nowrap"> ${d.description}</p>
                            </div>
                            <p class="text-nowrap">Duration: ${d.period_type}</p>
                            <p class="text-nowrap text-primary">Company: ${d.organization_id}</p>
                        </div>
                    </div>
                </div>
            `;
                });

                html += `</div></div>`;
                this.profile_card_right.innerHTML = html;

                let activeExperienceId = null; // Track currently active experience

                // Add event listeners for toggle functionality
                document
                    .querySelectorAll(".experience-toggle")
                    .forEach((element) => {
                        element.addEventListener("click", function () {
                            let experienceId =
                                this.getAttribute("data-experience-id");
                            let detailsDiv = document.getElementById(
                                `details_${experienceId}`
                            );
                            let isVisible = detailsDiv.style.display === "flex";

                            // If there's an active experience and it's not the same one, close it
                            if (
                                activeExperienceId &&
                                activeExperienceId !== experienceId
                            ) {
                                let activeDetailsDiv = document.getElementById(
                                    `details_${activeExperienceId}`
                                );
                                if (activeDetailsDiv) {
                                    activeDetailsDiv.style.display = "none";
                                    let activeIcon = document.querySelector(
                                        `[data-experience-id="${activeExperienceId}"] i`
                                    );
                                    activeIcon.classList.remove(
                                        "fa-chevron-up"
                                    );
                                    activeIcon.classList.add("fa-chevron-down");
                                }
                            }

                            // Toggle the current clicked experience
                            if (isVisible) {
                                detailsDiv.style.display = "none"; // Hide details
                                activeExperienceId = null; // Clear active experience
                                let icon = this.querySelector("i");
                                icon.classList.remove("fa-chevron-up");
                                icon.classList.add("fa-chevron-down");
                            } else {
                                detailsDiv.style.display = "flex"; // Show details
                                activeExperienceId = experienceId; // Set active experience
                                let icon = this.querySelector("i");
                                icon.classList.remove("fa-chevron-down");
                                icon.classList.add("fa-chevron-up");
                            }
                        });
                    });

                // Add click event listener for "Add Experience"
                document
                    .getElementById("lnk_add_experience")
                    .addEventListener("click", function (e) {
                        e.preventDefault();
                        let op = {
                            id: null,
                            emp_id: employeeId,
                            btn: e.target,
                            title: "New Experience",
                            onClose: () => {
                                mThis.EmployeeListView.showPage();
                            },
                        };
                        console.log(op);
                        AddExperience.show(op);
                    });
            });
    };
    this.renderCardTaxAllowance = (employeeId) => {
        let p = { emp_id: employeeId };
        console.log(1122, p);

        vsapi
            .call(
                `${main_view.base_url}/hr/tax-allowance/list-paginate`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let data = res.status_code === 200 ? res.data.data : [];
                console.log(1212, data);

                let html = `
                    <div class="card" style="height:487px;">
                        <div class="card-header">
                            <h4>Tax Allowance</h4>
                            <div class="d-flex gap-2">
                                <a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-tax-allowance">
                                    <i class="fa fa-plus-circle fs-5 text-success"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.map((d) => {
                    html += `
                        <div class="row mt-2 py-4 border-bottom">
                            <div class="col-md-8">
                                <p class="text-success" style="width:180px; height:20px">Amount: ${d.amount}</p>
                                <p class="text-nowrap" style="width:180px; height:20px">Remarks: ${d.remarks}</p>
                            </div>
                            <div class="col-md-4 text-end">
                                <a href="javascript:void(0)" data-id="${d.id}" class="lnk-edit-tax-allowance">
                                    <i class="fa fa-edit fs-5 text-primary"></i>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-emp-id="${employeeId}" class="lnk-delete-tax-allowance">
                                    <i class="fa fa-trash fs-5 text-danger"></i>
                                </a>
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
                this.tax_allownce_card.innerHTML = html;

                // Add event listener for "Add" button
                document.querySelector(".lnk-add-tax-allowance").addEventListener("click", function (e) {
                    e.preventDefault();

                    let btn = document.querySelector(".lnk-add-tax-allowance");
                    console.log(333, btn.dataset);

                    let op = {
                        id: null,
                        emp_id: btn.dataset.empid,

                        btn: e.target,
                        title: "New Tax Allowance",
                        onClose: () => {
                            mThis.EmployeeListView.showPage();
                        },
                    };
                    console.log(op);
                    AddTaxAllowance.show(op);
                });

                // Add event listeners for all "Edit" buttons
                document.querySelectorAll(".lnk-edit-tax-allowance").forEach((btn) => {
                    btn.addEventListener("click", function (e) {
                        e.preventDefault();
                        const id = e.target.closest('a').getAttribute("data-id");

                        let op = {
                            id: id,
                            emp_id: employeeId,
                            btn: e.target,
                            title: "Edit Tax Allowance",
                            onClose: () => {
                                mThis.renderCardTaxAllowance.showPage();
                            },
                        };
                        console.log("Edit operation:", op);
                        AddTaxAllowance.show(op);
                    });
                });

                document.querySelectorAll(".lnk-delete-tax-allowance").forEach((btn) => {
                    btn.addEventListener("click", function (e) {
                        e.preventDefault();
                        const id = e.target.closest('a').getAttribute("data-id");
                        const emp_id = e.target.closest('a').getAttribute("data-emp-id");
                        let op ={
                            id: id,
                            btn: e.target,
                            onClose: () => {

                            },
                        };
                        cv_interact.confirm(
                            "Delete this Employee?",
                            {
                                title: "Delete Employee",
                                context: "delete",
                                confirmButtonText: "Delete",
                            },
                            function (e) {
                                if (e) {
                                    vsapi
                                        .call(
                                            `${main_view.base_url}/hr/tax-allowance/delete`,
                                            op,
                                            false,
                                            false,
                                            false
                                        )
                                        .then((res) => {
                                            if (res.status_code == 200) {
                                                cv_interact.success("Deleted Successfully");
                                                // EmployeeComponent.EmployeeListView.showPage();
                                                EmployeeComponent.renderCardTaxAllowance(emp_id);

                                            }
                                        });
                                }
                            }
                        );


                    });
                });
            });


    };

    this.changeStatus = (id, lnk) => {

        let tr = lnk.closest("tr");
        console.log(1,tr);
        let status_id = Validator.properCase(tr ? tr.dataset.status_id : "");
        console.log(123,status_id);

        let inputOptions = {
            title: "Set Employee Status",
            dataLabel: "Employee status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                {
                    status_id: "10",
                    name: "Active",
                },
                {
                    status_id: "20",
                    name: "Resigned",
                },
                {
                    status_id: "21",
                    name: "Terminated",
                },
            ],
            defaultValue: status_id,
        };

        InputBox2.show(inputOptions, (d) => {
            if (d) {
                let p = {
                    id: id,
                    status_id: d.value,
                };
                console.log(123, p);

                vsapi
                    .call(`${mThis.base_url}/hr/employee/update-status`, p)
                    .then((res) => {
                        if (res.status_code === 200) {
                            mThis.elEmployeeStatus.value = parseInt(d.value);
                            InputBox2.close();
                            mThis.elEmployeeStatus.dispatchEvent ( new Event('change'));
                            cv_interact.success("The Employee status has been updated");
                            // if(tr) tr.dataset.status_id = d.value;
                            // mThis.EmployeeListView.showPage(mThis.getFilterData());
                        } else
                        cv_interact.error(res.error_message);
                    });
            }
        });
    };
    this.editEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            },
        };
        EmployeeDialog.show(op);
    };

    this.deleteEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Employee?",
            {
                title: "Delete Employee",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/employee/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.EmployeeListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        // mThis.def_filter = mThis.def_filter || {};
        // mThis.def_filter.id = 10;
        // mThis.allow_filter = false;
        vsapi
            .call(
                `${main_view.base_url}/hr/employee/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(
                    mThis.elEmployeeStatus,
                    d.status,
                    "id",
                    "name",
                    null,
                    null,
                    10
                );
                VSUtil.setComboItems(
                    mThis.elEmployeeType,
                    d.types,
                    "id",
                    "name",
                    false,
                    null,
                    3
                );
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.EmployeeListView.showPage(mThis.getFilterData());
            mThis.jm.siblings().hide();
            mThis.jm.hide().fadeIn(250);


    }
};

const AddEducation = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                title: op.id
                    ? "Edit Employee Seniority"
                    : "New Employee Seniority", // Dynamically set title
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="row">
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.School">School</label>
                            <span class="text-danger" >*</span>
                            <div><select name="school_id" class="data-input" data-field="school_id"></select></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.Level">Level</label>
                            <span class="text-danger" >*</span>
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
                            <label class="form-label" vslang="titles.End Year">Finish Year</label>
                            <div><input name="end_year" class="form-control data-input" data-field="end_year"/></div>
                        </div>

                        <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Diploma">Diploma</label>
                            <div><input name="diploma" class="form-control data-input" data-field="diploma"/></div>
                        </div>
                    </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: "<span>Cancel</span>",
                        cssClass: "btn btn-warning text-white",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me) => {
                            let p = me.getData();
                            p.emp_id = op.emp_id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/education/save",
                                    ].join(""),
                                    p,
                                    false,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.modal.hide(true, p);
                                        EmployeeComponent.renderCardCenter(me.dataOptions.emp_id);

                                        EmployeeComponent.renderCardCenter(
                                            me.dataOptions.emp_id
                                        );
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                configSelect: [
                    {
                        name: "school_id",
                        data: "schools",
                        valueField: "id",
                        textField: "name",
                        filterData: (data, res) => {
                            return data;
                        },
                    },
                    {
                        name: "edu_level_id",
                        data: "edu_levels",
                        valueField: "id",
                        textField: "name",
                        filterData: (data, res) => {
                            return data;
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "New Education",
                    modifyTitle: "Edit Education",
                    targetProp: "Education",
                    api: {
                        endpoint: `${main_view.base_url}/hr/education/form-options`,
                        params: (op) => {
                            return { id: op.id }; // Pass ID to fetch data for edit
                        },
                        onResponse: (me, res) => {
                            if (op.id) {
                                // Populate form with existing data for edit mode
                                // me.setValue('emp_id', res.data.emp_id);
                                // me.setValue('period', res.data.period);
                                // me.setValue('description', res.data.description);
                                // me.setValue('amount', res.data.amount);
                            }
                        },
                    },
                },
                onShow: (me) => {
                },
            });

        dialog.show(op);
    };
    return self;
})();
const AddExperience = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.Start Date">Start Date</label>
                            <div><input type="date" name="start_date" class=" form-control data-input" data-field="start_date"></input></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.End Date">End Date</label>
                            <div><input type="date" name="end_date" class=" form-control data-input" data-field="end_date"></input></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.Position">Position</label>
                            <div><select name="position_id" class="data-input" data-field="position_id"></select></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Organization">Organization</label>
                            <div><select name="organization_id" class="form-control data-input" data-field="organization_id"></select></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.Period">Period</label>
                            <div><input name="period_type" class="form-control data-input" data-field="period_type"></input></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Description">Description</label>
                            <div><input type="text" name="description" class="form-control data-input" data-field="description"/></div>
                        </div>

                    </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: "<span>Cancel</span>",
                        cssClass: "btn btn-warning text-white",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            let p = me.getData();
                            p.emp_id = op.emp_id;
                            // console.log(928762, p);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/experience/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.modal.hide(true, p);
                                        EmployeeComponent.renderCardRight(
                                            me.dataOptions.emp_id
                                        );
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                configSelect: [
                    {
                        name: "position_id",
                        data: "positions",
                        textField: "title",
                        valueField: "id",
                        filterData: (data, res) => {
                            return data;
                        },
                    },
                    {
                        name: "organization_id",
                        data: "organizations",
                        valueField: "id",
                        textField: "name",
                        filterData: (data, res) => {
                            return data;
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "New Experience",
                    modifyTitle: "Edit Experience",
                    targetProp: "emp_experience",
                    api: {
                        endpoint: `${main_view.base_url}/hr/experience/form-options`,
                        params: (op) => {
                            return { id: op.id }; // Pass ID to fetch data for edit
                        },
                    },
                    onResponse: (me, res) => {
                        console.log('result from api "/form-options": ', res);
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };
    return self;
})();

const AddTaxAllowance = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        console.log(9999,op);

        dialog =
            dialog ||
            new GeneralDialog({
                title: op.id
                    ? "Add Tax Allowance"
                    : " Edit Tax Allowance ",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="row">

                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Amount">Amount</label>
                            <div><input name="amount" class="form-control data-input" data-field="amount"/></div>
                        </div>
                        <div class="form-group col-12">
                            <label for="remarks" class="form-label"
                            vslang="titles.Remarks">Remarks</label>
                            <textarea  type="text" class="form-control data-input" data-field="remarks"></textarea>
                        </div>

                    </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: "<span>Cancel</span>",
                        cssClass: "btn btn-warning text-white",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me) => {
                            let p = me.getData();
                            p.emp_id = me.dataOptions.emp_id;
                            console.log(7777,p);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/tax-allowance/save",
                                    ].join(""),
                                    p,
                                    false,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.modal.hide(true, p);
                                        EmployeeComponent.renderCardTaxAllowance(me.dataOptions.emp_id);


                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],

                prepareFormOptions: {
                    createTitle: "New Tax Allowance",
                    modifyTitle: "Edit Tax Allowance",
                    targetProp: "tax_allowance",
                    api: {
                        endpoint: `${main_view.base_url}/hr/tax-allowance/form-options`,
                        params: (op) => {
                            return { id: op.id }; // Pass ID to fetch data for edit
                        },
                        onResponse: (me, res) => {
                            if (op.id) {
                                // Populate form with existing data for edit mode
                                // me.setValue('emp_id', res.data.emp_id);
                                // me.setValue('period', res.data.period);
                                // me.setValue('description', res.data.description);
                                // me.setValue('amount', res.data.amount);
                            }
                        },
                    },
                },
                onShow: (me) => {
                },
            });

        dialog.show(op);
    };
    return self;
})();

const EmployeeDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="col-3">
                                <div name="div_emp_photo" class="data-input" data-field="image_url" role="button"></div>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <div class="form-group col-4">
                                        <label for="name" class="form-label" vslang="titles.Name"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="name" class="form-control data-input" data-field="name" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="name_kh" class="form-label" vslang="titles.Name KH"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="name_kh" class="form-control data-input" data-field="name_kh" />
                                    </div>

                                    <div class="form-group col-4">
                                        <label for="nssf_id" class="form-label" vslang="titles.NSSF ID"></label>
                                        <input name="nssf_id" class="form-control data-input" data-field="nssf_id" />
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
                                        <span class="text-danger" >*</span>
                                        <input name="date_of_birth" class="form-control data-input" data-field="date_of_birth" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="nationality" class="form-label" vslang="titles.Nationality"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="nationality" class="form-control data-input" data-field="nationality" />
                                    </div>

                                </div>
                            </div>
                            <div class="form-group col-4">
                                <label for="phone_number" class="form-label" vslang="titles.Phone"></label>
                                <span class="text-danger" >*</span>
                                <input name="phone_number" class="form-control data-input" data-field="phone_number" />
                            </div>
                            <div class="form-group col-5">
                                <label for="email" class="form-label" vslang="titles.Email"></label>
                                <span class="text-danger" >*</span>
                                <input type="email" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />
                            </div>
                            <div class="form-group col-3">
                                    <label for="nid" class="form-label" vslang="titles.Identity Card"></label>
                                    <span class="text-danger" >*</span>
                                    <input name="nid" class="form-control data-input" data-field="nid" />
                            </div>
                            <div class="form-group col-5">
                                <label for="joining_date" class="form-label" vslang="titles.Joining Date"></label>
                                <input name="joining_date" class="form-control data-input" data-field="joining_date" />
                            </div>
                        <div class="form-group col-4">
                            <label for="position" class="form-label" vslang="titles.Position"></label>
                            <span class="text-danger" >*</span>
                            <select name="position" class=" data-input"  data-field="position_id"></select>
                        </div>
                            <div class="form-group col-3">
                                <label for="salary_base" class="form-label" vslang="titles.Salary Base"></label>
                                <input name="salary_base" class="form-control data-input" data-field="salary_base" />
                            </div>

                        <div class="form-group col-6">
                           <label for="type" class="form-label" vslang="titles.Employee Type"></label>
                           <span class="text-danger" >*</span>
                            <select name="type" class=" data-input"  data-field="emp_type_id"></select>
                        </div>
                        <div class="form-group col-6">
                            <label for="work_shift" class="form-label" vslang="titles.Work Shift"></label>
                            <span class="text-danger" >*</span>
                            <select name="work_shift" class=" data-input"  data-field="work_shift_id"></select>
                        </div>


                        <div class="form-group col-12">
                            <label for="address" class="form-label" vslang="titles.Address">Address</label>
                            <textarea name="address" id="address" class="form-control data-input" data-field="address"></textarea>
                        </div>


              </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    //Convert field to be DatePicker : start_date and end_date
                    DateTimePicker.init(me.controls.date_of_birth);
                    DateTimePicker.init(me.controls.joining_date);
                    console.log(444);
                    LocaleManager.translateZone(me.divModal);
                    let div_emp_photo = me.divModal.querySelector(
                        '[name="div_emp_photo"]'
                    );
                    me.userImageBox = new ImageBox(div_emp_photo, {
                        containerclass: "emp-profile-container",
                        imgClass: "data-input",
                        dataset: { field: "image_url" },
                    });
                    console.log(999, op);

                    me.showProfile = (code) => {
                        let fields = [];
                        let p = { id: code };
                        console.log(4545, me);

                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/hr/employee/form-options",
                                ].join(""),
                                p,
                                false,
                                false
                            )
                            .then((res) => {
                                let d = res.status_code == 200 ? res.data : {};
                                d = d.employee || {};

                                me.divModal
                                    .querySelectorAll(".data-input")
                                    .forEach((el) => {
                                        const f = el.dataset.field;
                                        console.log(7788899, d);

                                        if (fields.indexOf(f) >= 0) {
                                            el.value = d[f] || "";
                                        } else if (f === "image_url") {
                                            if (me.dataOptions.id)
                                                el.innerHTML = `<img name="div_emp_photo" class="w-100" src="${d[f] || ""
                                                    }"/>`;
                                        }
                                    });
                            });
                    };
                    me.deleteImage = (div) => {
                        const btnDelete = div; //.querySelector('[role=\'button\']');
                        btnDelete.onclick = function (e) {
                            e.preventDefault();
                            const html = `<div id="dlg_image_chooser"
                                            class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                            <i class="fa-regular fa-image fs-4 text-muted"></i>
                                        </div>`;
                            div.innerHTML = html;
                            // mThis.chooseImage(div);
                            // let div_emp_photo = div.querySelector('[name="div_emp_photo"]');
                            me.userImageBox = new ImageBox(div, {
                                containerclass: "emp-profile-container",
                                imgClass: "data-input",
                                dataset: { field: "image_url" },
                            });
                        };
                    };

                    me.deleteImage(div_emp_photo);

                    me.showProfile(me.dataOptions.id);
                },
                configSelect: [
                    {
                        name: "position",
                        data: "positions",
                        textField: "title",
                        valueField: "id",
                    },
                    {
                        name: "type",
                        data: "types",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "work_shift",
                        data: "work_shifts",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            let p = me.getData();
                            p.photo = me.userImageBox
                                ? me.userImageBox.getImage()
                                : "";
                            console.log(222444, p);
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/employee/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    false,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Employee",
                    modifyTitle: "Edit Employee",
                    targetProp: "employee",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/employee/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (me, res) => {
                        console.log('result from api "/form-options": ', res);
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
