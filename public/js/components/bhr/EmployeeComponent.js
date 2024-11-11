"use strict";

var EmployeeComponent = new (function () {
    let mThis = this;
    this.title_prop = "Employee management";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeComponent");
    this.self = this.jm[0];

    this.elEmployeeStatus = this.self.querySelector("#filter_employee_status");
    this.el_branch = this.self.querySelector("#el_branch");
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
    this.paginationContainer = mThis.self.querySelector(
        "#container_pagination"
    );
    let div = mThis.self.querySelector("#_employee_list");
    this.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView("_employee_list", {
            fetchApi: `${main_view.base_url}/hr/employee/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.paginationContainer,

            apiCluster: main_view.apiCluster,
            processResponse: (res) => {
                console.log(1234, res.data.data);

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
                    cv_interact.success("Employee Added Successfully");
                    mThis.EmployeeListView.showPage(mThis.getFilterData());
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
            // mThis.EmployeeListView.showPage(mThis.getFilterData());
        };
        mThis.EmployeeListView.showPage(mThis.getFilterData());

        mThis.div_filter_fields
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.EmployeeListView.showPage(mThis.getFilterData());
                };
            });
        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            }, 250);
        };

        this.listContainer = mThis.EmployeeListView.getListContainer();
        console.log(12, mThis.listContainer);

        mThis.initDropdownMenus(div);

        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.height = window.innerHeight - 190 + "px";
        };

        mThis.initAlready = true;
    };

    this.getFilterData = () => {
        let p = {};
        p.status_id = mThis.elEmployeeStatus.value;
        p.emp_type_id = mThis.elEmployeeType.value;
        p.branch_id = mThis.el_branch.value;
        p.search_value = mThis.elSearch.value;
        mThis.div_filter_fields
            .querySelectorAll(".filter-field")
            .forEach((el) => {
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
                    html: '<span class="ps-2  " vslang="titles.Modify Employee">Modify Employee</span>',
                    icon: `<i class="fa-solid text-success fa-pen-to-square"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_employee",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Employee">Delete Employee</span>',
                    icon: `<i class="fa-solid text-danger fa-user-xmark"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_employee",
                },

                {
                    html: '<span class="ps-2  " vslang="titles.Set Resign">Set Resign</span>',
                    icon: `<i class="fa-solid text-warning fa-pen-nib"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_resign",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Set Rejoin">Set Rejoin</span>',
                    icon: `<i class="fa-solid text-primary fa-rotate-right"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_rejoin",
                },
                {
                    html: '<span class="ps-2 text-" vslang="titles.Set Terminated">Set Terminated</span>',
                    icon: `<i class="fa-solid text-dark fa-rocket"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_terminated",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Promote to Staff">Promote to Staff</span>',
                    icon: `<i class="fa-solid text-success fa-bolt"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "promote_to_staff",
                },
            ],
            onShow: (me, container) => {
                // console.log(123,me.getActiveMenus(container).set_rejoin);
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                const emp_type_id = container.dataset.typeid;
                menu.set_terminated.style.display='none';

                menu.set_rejoin.style.display = status_id == 10? 'none':'block';
                menu.promote_to_staff.style.display = emp_type_id ==  3? 'none':'block;'

                // switch(status_id){
                //     case 10:{
                //         menu.set_rejoin.style.display='none';
                //         break;
                //     }
                // }
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_employee": {
                        mThis.editEmployee(id, menuLink);
                        break;
                    }
                    case "delete_employee": {
                        mThis.deleteEmployee(id, menuLink);
                        break;
                    }
                    case "set_resign": {
                        mThis.setResign(id, menuLink);
                        break;
                    }
                    case "set_terminated": {
                        mThis.setTerminated(id, menuLink);
                        break;
                    }
                    case "set_rejoin": {
                        mThis.setRejoin(id, menuLink);
                        break;
                    }
                    case "promote_to_staff": {
                        mThis.promoteToStaff(id, menuLink);
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
        html += `<div  class="row mb-5">`;
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
                        statusColor = "background-color: #cab54a;";
                        break;
                    default:
                        statusColor = "background-color: #2B3991;";
                        break;
                }

                html += `
                    <div class="col-md-3 mt-2 mb-3 employee-card" data-employee-id="${
                        d.id
                    }">
                        <div class="card d-flex">
                            <div class="card-header">
                                <div class="status_employee" style="${statusColor} color: white; padding: 3px; border-radius: 20px;">
                                    <span>${status}</span>
                                </div>
                                <div class="dropdown">
                                    <a href="javascript:void(0)" class="btn_employee_action" data-id="${
                                        d.id
                                    }" data-statusid="${
                    d.status_id
                }" data-typeid="${
                    d.emp_type_id
                }" aria-haspopup="true" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-4 tool-tip"> <span class="tool-tiptext fs-6">Actions</span></i>
                                    </a>
                                </div>
                            </div>
                            <div class="card-body text-center j">
                                <img src="${
                                    d.image_url ||
                                    "../assets/images/logo/default_image_user.avif"
                                }" class="rounded-circle mb-3"
                                    alt="Profile Picture" style="width: 100px; height: 100px;">
                                <div class="card-title">
                                    <h5 class="text-success">${d.name}</h5>
                                </div>
                                <div class="card_container gap-2 p-4 bg">
                                    <div class="employee_id text-primary-custom">#: <span class="ms-2">${
                                        d.code || "null"
                                    }</span></div>
                                    <div class="container_top">
                                        <div class="position">
                                            <i class="text-danger  fa-solid fa-dashboard"></i> <span class="ms-1"> ${
                                                d.type || "null"
                                            }</span>
                                        </div>
                                        <div class="me-3">
                                            <i class=" text-primary-custom fa-solid fa-clock"></i> <span>${
                                                d.position || "null"
                                            }</span>
                                        </div>
                                    </div>
                                    <div class="container_bottom">
                                        <div class="phone text-success">
                                            <div class=" d-flex rounded-5 gap-2"><i class="text-success m-1 fas fa-phone"></i><span> ${
                                                d.phone_number || "null"
                                            }</span></div>
                                        </div>
                                        <div class="email text-primary">
                                            <div class="d-flex rounded-5 gap-2"><i class="text-primary m-1 fas fa-envelope"></i><span>${
                                                d.email || "null"
                                            }</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card_bottom pt-3">
                                    <div class="text-muted" style="font-size:11px;">Joining Date : <span class="text-primary-custom">${
                                        d.joining_date || "null"
                                    }</span></div>
                                    <a href="javascript:void(0)" class="see-detail text-primary-custom" data-id="${
                                        d.id
                                    }" aria-haspopup="true" aria-expanded="false">
                                        <i data-id="${
                                            d.id
                                        }" class="fa-regular  fa-eye text-primary-custom fs-6 tool-tip"><span class="tool-tiptext fs-6">see info</span></i>
                                    </a>
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

        const seeProfileInfo = div.querySelectorAll(".see-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                const employeeId = e.target.dataset.id;
                const employeeData = data.find((emp) => emp.id == employeeId);

                if (employeeData) {
                    let sub_content = mThis.self.querySelector("#sub_content");
                    sub_content.classList.add("d-none");
                    let view_see_info =
                        mThis.self.querySelector("#view_see_info__");
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
                                    <img src="${
                                        data.image_url ||
                                        "../uploads/public/1_data/default/images/mr.avif"
                                    }" alt="Employee Image">
                                </div>
                                <div class="d-flex mt-3 ms-5 justify-content-start">
                                    <span class="text-white">ID : ${
                                        data.code || ""
                                    }</span>
                                </div>

                            </div>
                            <div class="col-md-3 mt-3">
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Name</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.name
                                    }</p>
                                </div>

                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Sex</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.sex == "M" ? "Male" : ""
                                    }${data.sex == "F" ? "Female" : ""}${
            data.sex == "O" ? "Other" : ""
        }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Nationality</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.nationality || ""
                                    }</p>
                                </div>
                                 <div class="d-flex">
                                    <p class="text-nowrap    width-p" vslang="titles.Identity Card">Identity Card</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.nid
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Date of Birth</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.date_of_birth || ""
                                    }</p>
                                </div>



                            </div>
                            <div class="col-md-3 mt-3">

                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Position</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.position || ""
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Work Shift</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.work_shift || ""
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Employee Type</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.type || ""
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Tel</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.phone_number || ""
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Email</p>
                                    <p class="px-2">:</p>
                                    <p class="text-">${data.email || ""}</p>
                                </div>


                            </div>

                            <div class="col-md-3 mt-3">
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">salary</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">​${
                                        data.salary || "0.00"
                                    }(KHR)</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Payroll Tax</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.apply_payroll_tax == "0"
                                            ? "Have Tax"
                                            : ""
                                    }${
            data.apply_payroll_tax == "1" ? "Non Tax" : ""
        }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap    width-p" vslang="titles.NSSF">NSSF</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.nssf_id
                                    }</p>
                                </div>
                               <div class="d-flex align-items-center">
                                    <p class="text-nowrap width-bp" vslang="titles.Address">Address</p>
                                    <p class="px-2">:</p>
                                    <p class="address text-nowrap text-capitalize">${
                                        data.address
                                    }</p>
                                </div>

                            </div>


                        </div>
                        <div class="d-flex justify-content-between w-100 px-2 pt-1">
                            <div class="social-icons d-flex w-25 justify-content-start">
                                <a href="https://www.facebook.com/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/facebook.svg" alt="Facebook"></a>
                                <a href="https://www.linkedin.com/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/linkedin.svg" alt="Linkedin"></a>
                                <a href="https://web.telegram.org/a/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/telegram.svg" alt="Telegram"></a>
                            </div>
                            
                            <div class="d-flex justify-content-end gap-3 px-5 w-75">
                                <a href="javascript:void(0)" class="edit_emp_profile_info" data-id="${
                                    data.id
                                }" data-status ="${data.status_id}">
                                    <i class="fa-regular fa-pen-to-square text-success fs-5 tool-tip"><span class="tool-tiptext fs-6">Edit Profile</span></i>
                                </a>
                                <a href="javascript:void(0)" class="delete_employee" data-id="${
                                    data.id
                                }" data-status ="${data.status_id}">
                                    <i class="fa-solid text-danger fa-user-xmark fs-5 tool-tip"><span class="tool-tiptext fs-6">Delete</span></i>
                                </a>
                                <a href="javascript:void(0)" class="set_resign" data-id="${
                                    data.id
                                }" data-status ="${data.status_id}">
                                    <i class="fa-solid fa-triangle-exclamation text-warning tool-tip fs-5"><span class="tool-tiptext fs-6">Set Resign</span></i>
                                </a>
                                <a href="javascript:void(0)" class="movement" data-id="${
                                    data.id
                                }" data-status ="${data.status_id}">
                                    <i class="fa-brands fa-stack-exchange text-white tool-tip fs-5"><span class="tool-tiptext fs-6">movement</span></i>
                                </a>
                                 <!-- 
                                <a href="javascript:void(0)" class="btn_movement_action" data-id="${
                                    data.id
                                }" data-statusid="${
            data.status_id
        }" data-typeid="${
            data.emp_type_id
        }" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-secondary fs-5 tool-tip"><span class="tool-tiptext fs-6">Actions</span></i>
                                </a>
                               <button class="btn_movement_action btn btn-light rounded-3 mx-3 btn-options position-relative text-nowrap" data-id="${
                                    data.id
                                }"  data-status ="${
            data.status_id
        }" type="button">
                                    <span class="text-nowrap text-primary-custom" vslang="buttons.Movement">Movement</span>
                                    <i class="fa-solid text-primary-custom fa-caret-down ps-2"></i>
                                </button> -->   
                            </div>
                        </div>
                    </div>

                    </div>
        `;

        this.profile_info_emp.innerHTML = html;
        // mThis.initDropdownMenusInfo(mThis.profile_info_emp);
        mThis.setActionsProfileInfo(mThis.profile_info_emp);
    };

    // this.initDropdownMenusInfo = (listContainer) => {
    //     const menuOptopns = {
    //         containerElement: listContainer,
    //         actionButtonClass: "btn_movement_action",
    //         cssClass: "bg-white shadow",
    //         menus: [
    //             {
    //                 html: '<span class="ps-2" vslang="titles.Modify Profile Info">Modify Profile Info</span>',
    //                 icon: `<i class="fa-regular text-primary fa-edit fs-5"></i>`,
    //                 cssClass: "border-bottom pb-2",
    //                 name: "edit_emp_profile_info",
    //             },
    //             {
    //                 html: '<span class="ps-2  " vslang="titles.Set Resign">Set Resign</span>',
    //                 icon: `<i class="fa-solid text-warning fa-pen-nib"></i>`,
    //                 cssClass: "border-bottom pb-2",
    //                 name: "set_resign",
    //             },

    //             {
    //                 html: '<span class="ps-2  " vslang="titles.Movement">Movement</span>',
    //                 icon: `<i class="fa-solid text-success fa-bolt"></i>`,
    //                 cssClass: "border-bottom pb-2",
    //                 name: "movement",
    //             },

    //         ],
    //         onClick: (menuLink, id, name) => {
    //             switch (name) {
    //                 case "movement": {
    //                     mThis.movementEmployee(id, menuLink);
    //                     break;
    //                 }
    //                 case "set_resign":{
    //                     mThis.setResign(id,menuLink);
    //                     break;
    //                 }
    //                 case "edit_emp_profile_info": {
    //                     mThis.editEmployee(id, menuLink);
    //                     break;
    //                 }
                   

    //                 default: {
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    //     new VSDropdownMenu(menuOptopns);
    // };
    this.setActionsProfileInfo = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".edit_emp_profile_info");
            if (btn) {
                mThis.editEmployee(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target,".delete_employee");
            if (btn) {
                mThis.deleteEmployee(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".set_resign");
            if (btn) {
                mThis.setResign(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target,".movement")
            if (btn) {
                mThis.movement(btn.dataset.id, btn);
            }
        });
    };

    this.renderCardLeft = (employeeId) => {
        let html = "";

        html = [
            `
             <div class="card pb-3" style="height:390px;">
                            <div class="card-header bg-primary-custom text-white">
                                <h4>Skills</h4>

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
                let html = `<div class="card pb-3" style="height:390px;">
                <div class="card-header text-white bg-primary-custom">
                    <h4>Education</h4>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" data="id" id="lnk_add_education">
                            <i class="fa fa-plus-circle fs-5 text-white"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
            `;
                data.map((d) => {
                    html += `
                    <div class="row py-2 border-bottom border-primary">
                        <div class="col-md-6">
                            <h6 class="text-" style="width:180px; height:22px overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap">${d.period}</h6>
                            <p class="text-primary-custom" style="width:180px; height:20px"><img class="bhr-icons" src="${main_view.asset_url}/images/icons/graduate.svg" /> ${d.edu_level}</p>
                            <p class="text-muted" style="width:180px; height:20px;overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap"><img class="bhr-icons" src="${main_view.asset_url}/images/icons/radio.svg" /> ${d.major}</p>
                        </div>

                        <div class="col-md-6">
                            <div class="d-flex justify-content-start">
                                <div class="d-flex gap-2 mt-4" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                                    <span>${d.school}</span>
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
        console.log(123456789, p);

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
                console.log(12345600000, data);
                let html = `<div class="card pb-3" style="height:390px;">
            <div class="card-header text-white bg-primary-custom">
                <h4>Experience</h4>
                <div class="d-flex gap-2">
                    <a href="javascript:void(0)" data="id" id="lnk_add_experience">
                        <img class="bhr-" src="${main_view.asset_url}/images/icons/dot.svg" />
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
                                <p class="text-primary-custom" style="font-size:14px;width:175px;display:flex;justify-content:start; overflow-y: hidden; overflow-x: auto; scrollbar-width: none; align-items: flex-start; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap;">
                                    📢 ${d.department}
                                </p>

                            </div>
                        </div>
                        <div style="display:flex; width:350px; justify-content:space-between">
                            <div class="date_join text-muted" style="width:65%;display:flex;justify-content:start;align-items:start;text-align:right; overflow-y: hidden; overflow-x: auto; scrollbar-width: none;">
                                <img class="bhr-icons" src="${main_view.asset_url}/images/icons/calender.svg" />
                                <p>(${d.start_date}</p><p class="text-danger ml-2 mr-2">-</p><p>${d.end_date})</p>
                            </div>
                            <p class="text-primary-custom text-nowrap" style="width:35%"><img class="bhr-icons" src="${main_view.asset_url}/images/icons/bag.svg" /> ${d.position}</p>

                        </div>


                        <div class="experience-details" id="details_${d.id}"
                            style="display: none; flex-direction: column; gap:10px; transition: all 0.3s ease;">
                            <p class="text-nowrap text-primary-custom">Company : ${d.organization_id}</p>
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
                    <div class="card pb-3" style="height:390px;">
                        <div class="card-header bg-primary-custom text-white">
                            <h4>Tax Allowance</h4>
                            <div class="d-flex gap-2">
                                <a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-tax-allowance">
                                    <i class="fa fa-plus-circle fs-5 text-white"></i>
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
                                <p class="text-success" style="width:180px; height:20px">Quantity: ${d.qty}</p>
                                <p class="text-success" style="width:180px; height:20px">Allowance: ${d.allowance}</p>

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
                document
                    .querySelector(".lnk-add-tax-allowance")
                    .addEventListener("click", function (e) {
                        e.preventDefault();

                        let btn = document.querySelector(
                            ".lnk-add-tax-allowance"
                        );
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
                document
                    .querySelectorAll(".lnk-edit-tax-allowance")
                    .forEach((btn) => {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            const id = e.target
                                .closest("a")
                                .getAttribute("data-id");

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

                document
                    .querySelectorAll(".lnk-delete-tax-allowance")
                    .forEach((btn) => {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            const id = e.target
                                .closest("a")
                                .getAttribute("data-id");
                            const emp_id = e.target
                                .closest("a")
                                .getAttribute("data-emp-id");
                            let op = {
                                id: id,
                                btn: e.target,
                                onClose: () => {},
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
                                                    cv_interact.success(
                                                        "Deleted Successfully"
                                                    );
                                                    // EmployeeComponent.EmployeeListView.showPage();
                                                    EmployeeComponent.renderCardTaxAllowance(
                                                        emp_id
                                                    );
                                                }
                                            });
                                    }
                                }
                            );
                        });
                    });
            });
    };
    this.movement = (id,menuLink)=>{

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        console.log(909090,op);

        mThis.MovementDialog =  new GeneralDialog({
            title: LocaleManager.trans("Movement","titles"),
            createContent:()=>{
                return [
                     `<div class="form-group col-md-12">
                        <label for="branch" class="form-label" vslang="titles.Branch"></label>
                        <span class="text-danger" >*</span>
                        <select name="branch" class="form-control data-input"  data-field="branch_id"></select>
                      </div>
                      <div class="form-group col-md-12">
                        <label for="position" class="form-label" vslang="titles.Position"></label>
                        <span class="text-danger" >*</span>
                        <select name="position" class="form-control data-input"  data-field="position_id"></select>
                      </div>
                      <div class="form-group col-md-12">
                        <label for="salary" class="form-label" vslang="titles.Salary"></label>
                        <span class="text-danger" >*</span>
                        <select name="salary" class="form-control data-input"  data-field="salary"></select>
                      </div>
                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Promote Date">Promote Date</label>
                        <div><input  name="promote_date" class="form-control data-input" placeholder="" data-field="promotion_date"/></div>
                      </div>
                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Remarks">Remarks</label>
                        <textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>
                      </div>

                   `
                ].join('');
            },
            contentCreated:(me)=>{




             },

             configSelect:[
                {
                    // name: "type",
                    // data: "types",
                    // textField: "name",
                    // valueField: "id",
                },
             ],
             prepareFormOptions: {
                createTitle: "Movement",
                modifyTitle: "Movement",
                targetProp: "Movement",
                api: {
                    endpoint: `${main_view.base_url}/hr/employee/form-options`,
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
             buttons:[
                {
                    label: "<span>Cancel</span>",
                    cssClass: "btn btn-warning text-white",
                    click: (me) => {
                        me.hide(false);
                    },
                },
                {
                    cssClass:"btn btn-primary",
                    label:"<span>Save</span",
                    click:(me, btn,divModal)=>{
                         let p = me.getData();
                        //  p.emp_id = op.id;
                         console.log(111,p);
                         vsapi.call(`${main_view.base_url}/hr/employee/promote-staff`,p,btn,false).then(res =>{
                              if(res.status_code ==200){
                                me.modal.hide(true, p);
                                cv_interact.success('This Employee has been promoted successfully!');
                                EmployeeComponent.EmployeeListView.showPage();
                              }else cv_interact.error(res.error_message);
                         });
                    }
                }
             ],
             onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);


            },
            //  prepareFormOptions:{
            //      modifyTitle:"",
            //      createTitle:"Set Resign",
            //      api:{
            //         targetProp:"Set Resign",
            //         endpoint: `${main_view.base_url}`,
            //         params:(dataOption)=>{
            //             return {"id":dataOption.id};
            //         },
            //      }
            //  },
            //  onShow:(me)=>{
            //     me.controls.name.focus();
            //     me.controls.name.select();
            // },
            //  onPrepareForm:(me,data)=>{
            //      let fields = me.getFields();

            //     //  const app_types = [
            //     //     {value:0, label:"Web Application"},
            //     //     {value:1, label:"Mobile App"}
            //     //  ];
            //     //  VSUtil.setComboItems(fields.app_id,data.apps,"id","app_name",null,null,0);
            //  }
        });
        mThis.MovementDialog.show(op);
    }

    this.setResign = (id,menuLink)=>{

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.ResignDialog =  new GeneralDialog({
            title: LocaleManager.trans("Set Resign","titles"),
            createContent:()=>{
                return [
                   ` <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Resign Date">Resign Date</label>
                            <div><input  name="resign_date" class="form-control data-input" placeholder="" data-field="resign_date"/></div>
                        </div>
                        <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Effective Date">Effective Date</label>
                            <div><input  name="effective_date" class="form-control data-input" placeholder="" data-field="effective_date"/></div>
                        </div>
                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Remarks">Remarks</label>
                        <textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>
                      </div>

                   `
                ].join('');
            },
            contentCreated:(me)=>{
                DateTimePicker.init(me.controls.resign_date);
                DateTimePicker.init(me.controls.effective_date);




             },

             configSelect:[

             ],
             buttons:[
                {
                    label: "<span>Cancel</span>",
                    cssClass: "btn btn-warning text-white",
                    click: (me) => {
                        me.hide(false);
                    },
                },
                {
                    cssClass:"btn btn-primary",
                    label:"<span>Resign Now</span",
                    click:(me, btn,divModal)=>{
                         let p = me.getData();
                        //  p.emp_id = op.id;
                         console.log(111,p);
                         vsapi.call(`${main_view.base_url}/hr/employee/set-resign-status`,p,btn,false).then(res =>{
                              if(res.status_code ==200){
                                me.modal.hide(true, p);
                                cv_interact.success('This Employee has been resign successfully!');
                                EmployeeComponent.EmployeeListView.showPage();
                              }else cv_interact.error(res.error_message);
                         });
                    }
                }
             ],
             onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);


            },
            //  prepareFormOptions:{
            //      modifyTitle:"",
            //      createTitle:"Set Resign",
            //      api:{
            //         targetProp:"Set Resign",
            //         endpoint: `${main_view.base_url}`,
            //         params:(dataOption)=>{
            //             return {"id":dataOption.id};
            //         },
            //      }
            //  },
            //  onShow:(me)=>{
            //     me.controls.name.focus();
            //     me.controls.name.select();
            // },
            //  onPrepareForm:(me,data)=>{
            //      let fields = me.getFields();

            //     //  const app_types = [
            //     //     {value:0, label:"Web Application"},
            //     //     {value:1, label:"Mobile App"}
            //     //  ];
            //     //  VSUtil.setComboItems(fields.app_id,data.apps,"id","app_name",null,null,0);
            //  }
        });
        mThis.ResignDialog.show(op);
    }

    this.promoteToStaff = (id,menuLink)=>{

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        console.log(909090, op);

        mThis.PromoteDialog = new GeneralDialog({
            title: LocaleManager.trans("Promote Staff", "titles"),
            createContent: () => {
                return [
                    `<div class="form-group col-md-12">
                        <label for="type" class="form-label" vslang="titles.Employee Type"></label>
                        <span class="text-danger" >*</span>
                        <select name="type" class=" data-input"  data-field="emp_type_id"></select>
                      </div>
                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Event Date">Event Date</label>
                        <div><input  name="event_date" class="form-control data-input" placeholder="" data-field="event_date"/></div>
                      </div>
                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Remarks">Remarks</label>
                        <textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>
                      </div>

                   `,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.event_date);
            },

            configSelect: [
                {
                    name: "type",
                    data: "types",
                    textField: "name",
                    valueField: "id",
                },
             ],
             prepareFormOptions: {
                createTitle: "Promote",
                modifyTitle: "Promote",
                targetProp: "Promote",
                api: {
                    endpoint: `${main_view.base_url}/hr/employee/form-options`,
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
            buttons: [
                {
                    label: "<span>Cancel</span>",
                    cssClass: "btn btn-warning text-white",
                    click: (me) => {
                        me.hide(false);
                    },
                },
                {
                    cssClass: "btn btn-primary",
                    label: "<span>Promote Now</span",
                    click: (me, btn, divModal) => {
                        let p = me.getData();
                        //  p.emp_id = op.id;
                        console.log(111, p);
                        vsapi
                            .call(
                                `${main_view.base_url}/hr/employee/promote-staff`,
                                p,
                                btn,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    cv_interact.success(
                                        "This Employee has been promoted successfully!"
                                    );
                                    EmployeeComponent.EmployeeListView.showPage();
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
            //  prepareFormOptions:{
            //      modifyTitle:"",
            //      createTitle:"Set Resign",
            //      api:{
            //         targetProp:"Set Resign",
            //         endpoint: `${main_view.base_url}`,
            //         params:(dataOption)=>{
            //             return {"id":dataOption.id};
            //         },
            //      }
            //  },
            //  onShow:(me)=>{
            //     me.controls.name.focus();
            //     me.controls.name.select();
            // },
            //  onPrepareForm:(me,data)=>{
            //      let fields = me.getFields();

            //     //  const app_types = [
            //     //     {value:0, label:"Web Application"},
            //     //     {value:1, label:"Mobile App"}
            //     //  ];
            //     //  VSUtil.setComboItems(fields.app_id,data.apps,"id","app_name",null,null,0);
            //  }
        });
        mThis.PromoteDialog.show(op);
    };

    this.setTerminated = (id, lnk) => {
        let tr = lnk.closest("tr");
        console.log(1, tr);
        let status_id = Validator.properCase(tr ? tr.dataset.status_id : "");
        console.log(123, status_id);

        let inputOptions = {
            title: "Set Employee Terminate",
            dataLabel: "Employee status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                {
                    status_id: "30",
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
                            mThis.elEmployeeStatus.dispatchEvent(
                                new Event("change")
                            );
                            cv_interact.success(
                                "The Employee has been Terminate"
                            );
                            // if(tr) tr.dataset.status_id = d.value;
                            // mThis.EmployeeListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
                    });
            }
        });
    };

    this.setRejoin = (id, lnk) => {
        let tr = lnk.closest("tr");
        console.log(1, tr);
        let status_id = Validator.properCase(tr ? tr.dataset.status_id : "");
        console.log(123, status_id);

        let inputOptions = {
            title: "Set Employee Rejoin",
            dataLabel: "Employee status",
            valueMember: "status_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                {
                    status_id: "10",
                    name: "Rejoin",
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
                            mThis.elEmployeeStatus.dispatchEvent(
                                new Event("change")
                            );
                            cv_interact.success(
                                "The Employee has been rejoin to work"
                            );
                            // if(tr) tr.dataset.status_id = d.value;
                            // mThis.EmployeeListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
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
                VSUtil.setComboItems(
                    mThis.el_branch,
                    d.branches,
                    "id",
                    "branch_name",
                    true,
                    "All Branch",
                    null
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
    };
})();

const AddEducation = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                title: op.id ? "Edit Education" : "New Education",
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
                            <div><input name="period" class="form-control data-input" placeholder="(2020-2024)" data-field="period"/></div>
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
                                        EmployeeComponent.renderCardCenter(
                                            me.dataOptions.emp_id
                                        );

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
                onShow: (me) => {},
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
                            <div><input  name="start_date" class=" form-control data-input" data-field="start_date"></input></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.End Date">End Date</label>
                            <div><input  name="end_date" class=" form-control data-input" data-field="end_date"></input></div>
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
                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.start_date);
                    DateTimePicker.init(me.controls.end_date);
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
        console.log(9999, op);

        dialog =
            dialog ||
            new GeneralDialog({
                title: op.id ? "Add Tax Allowance" : " Edit Tax Allowance ",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="row">

                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Amount">Amount</label>
                            <div><input name="amount" class="form-control data-input" data-field="amount"/></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Amount">Quantity</label>
                            <div><input name="qty" class="form-control data-input" data-field="qty"/></div>
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
                            console.log(7777, p);

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
                                        EmployeeComponent.renderCardTaxAllowance(
                                            me.dataOptions.emp_id
                                        );
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
                onShow: (me) => {},
            });

        dialog.show(op);
    };
    return self;
})();

const EmployeeDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        console.log(999, op);

        dialog = new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static", //User click outside form, do not close form
            keyboard: true, //prevent user from using ESC key
            createContent: () => {
                return [
                    `<div class="row">
                            <div class="col-3">
                                <div name="div_emp_photo" style="height:165px" class="data-input border border-primary" data-field="image_url" role="button"></div>
                            </div>
                            <div class="col-9">
                                <div class="row">
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label" vslang="titles.Name"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="name" class="form-control data-input" data-field="name" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="nid" class="form-label" vslang="titles.Identity Card"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="nid" class="form-control data-input" data-field="nid" />
                                    </div>

                                    <div class="form-group col-6">
                                        <label for="date_of_birth" class="form-label" vslang="titles.Date Of Birth"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="date_of_birth" class="form-control data-input" data-field="date_of_birth" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="nationality" class="form-label" vslang="titles.Nationality"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="nationality" class="form-control data-input" data-field="nationality" />
                                    </div>
                                </div>
                            </div>
                                <div class="row">
                                  <div class="form-group col-6">
                                        <label for="phone_number" class="form-label" vslang="titles.Phone"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="phone_number" class="form-control data-input" data-field="phone_number" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="email" class="form-label" vslang="titles.Email"></label>
                                        <span class="text-danger" >*</span>
                                        <input type="email" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />
                                    </div>
                                    <div class="form-group col-3">
                                       <label for="sex" class="form-label" vslang="titles.Sex"></label>
                                            <select class="modal-select data-input" data-field="sex">
                                                <option value="">(Select Sex)</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="O">Other</option>
                                            </select>
                                    </div>
                                    <div class="form-group col-3">
                                        <label for="nssf_id" class="form-label" vslang="titles.NSSF ID"></label>
                                        <input name="nssf_id" class="form-control data-input form_input" data-field="nssf_id" />
                                    </div>
                                    <div class="form-group col-3">
                                        <label for="type" class="form-label" vslang="titles.Employee Type"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="type" class=" data-input"  data-field="emp_type_id"></select>
                                    </div>
                                    <div class="form-group col-3">
                                        <label for="position" class="form-label" vslang="titles.Position"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="position" class="data-input"  data-field="position_id"></select>
                                    </div>
                                    <div class="form-group salary col-3">
                                        <label for="salary" class="form-label" vslang="titles.salary"></label>
                                        <input name="salary" id="salary" class="form-control  data-input"  data-field="salary" />
                                    </div>


                                    <div class="form-group col-3">
                                        <label for="joining_date" class="form-label" vslang="titles.Joining Date"></label>
                                        <input name="joining_date" class="form-control data-input form_input" data-field="joining_date" />
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

                                </div>

                        </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                const salary = me.divModal.querySelector(".salary");
                console.log(1234, salary);
                salary.classList.add("d-none");
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
                                            el.innerHTML = `<img name="div_emp_photo" class="w-100" src="${
                                                d[f] || ""
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
                console.log(13, me.dataOptions.id);
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
                        console.log(123, p);

                        p.photo = me.userImageBox
                            ? me.userImageBox.getImage()
                            : "";
                        vsapi
                            .call(
                                [main_view.base_url, "/hr/employee/save"].join(
                                    ""
                                ),
                                p,
                                btn,
                                false,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
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
                me.divModal.querySelectorAll(".data-input").forEach((el) => {
                    const data_member = el.dataset.field;
                    console.log(90, op.id);
                    const salary = me.divModal.querySelector(".salary");

                    let id = op.id;

                    if (id) {
                        salary.classList.remove("d-none");
                        if (el.tagName.toLowerCase() === "select") {
                            if (
                                data_member == "position_id" ||
                                data_member == "work_shift_id" ||
                                data_member == "emp_type_id"
                            ) {
                                el.setAttribute("disabled", true);
                                // el.disabled = true;
                            }
                        }
                        if (data_member == "salary" || data_member == "nid") {
                            console.log(12, el);
                            el.disabled = true;
                        }

                        id = null;
                    }
                });
            },
            onClose: (canceled) => {},
        });

        dialog.show(op);
    };

    return self;
})();
