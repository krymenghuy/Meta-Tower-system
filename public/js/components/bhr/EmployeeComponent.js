"use strict";

var EmployeeComponent = new (function () {
    const mThis = this;
    this.title_prop = "Employee management";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeComponent");
    this.self = this.jm[0];

    this.elEmployeeStatus = this.self.querySelector("#filter_employee_status");
    this.el_branch = this.self.querySelector("#el_branch");
    this.el_work_shift = this.self.querySelector("#el_work_shift");
    this.elEmployeeType = this.self.querySelector("#filter_employee_type");
    this.btnAdd = this.self.querySelector("#_btn_add_employee");
    this.btnBack = this.self.querySelector("#_btn_backTo_employee");
    this.div_filter_fields = this.self.querySelector("#div_filter_filed");
    this.elSearch = this.self.querySelector("#_search_employee");
    this.profile_card_center = mThis.self.querySelector("#profile_card_center");
    this.profile_card_left = mThis.self.querySelector("#profile_card_left");
    this.profile_card_right = mThis.self.querySelector("#profile_card_right");
    this.tax_allowance_card = mThis.self.querySelector("#tax_allowance_card");
    this.emp_documents_card = mThis.self.querySelector("#emp_documents_card");
    this.profile_info_emp = mThis.self.querySelector("#profile_info_emp");
    this.paginationContainer = mThis.self.querySelector(
        "#container_pagination"
    );
    mThis.store_filter = {};
    let div = mThis.self.querySelector("#_employee_list");

    const formattedNumber = (number) => {
        number = Number(number) || 0;
        return number
            .toLocaleString('en-US', {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            .replace(/,/g, ' ');
    };

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView("_employee_list", {
            fetchApi: `${main_view.base_url}/hr/employee/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.paginationContainer,

            apiCluster: main_view.apiCluster,
            processResponse: (res) => {

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

        mThis.initDropdownMenus(div);
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        // window.onresize = () => {
        //     sh_parent.style.height = window.innerHeight - 190 + "px";
        // };

        mThis.initAlready = true;
    };

    this.getFilterData = () => {
        const p = {};
        p.status_id = mThis.elEmployeeStatus.value;
        p.emp_type_id = mThis.elEmployeeType.value;
        p.branch_id = mThis.el_branch.value;
        p.work_shift_id = mThis.el_work_shift.value;
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
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                const emp_type_id = container.dataset.typeid;
                // menu.set_resign.style.display= status_id == 20? 'none' :'block';
                // menu.set_rejoin.style.display = status_id == 10? 'none':'block';
                // menu.set_terminated.style.display = status_id == 10? 'none':'block';

                // menu.promote_to_staff.style.display = emp_type_id ==  3? 'none':'block;'

                if (status_id == 10) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display =
                                menu[item].dataset.mnuaction === "set_resign" ||
                                menu[item].dataset.mnuaction === "edit_employee"
                                    ? "block"
                                    : "none";
                        }
                        if (
                            (emp_type_id == 1 || emp_type_id == 2) &&
                            menu[item].dataset.mnuaction === "promote_to_staff"
                        ) {
                            menu[item].style.display = "block";
                        }
                    }
                } else if (status_id == 20) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display =
                                menu[item].dataset.mnuaction === "set_rejoin" ||
                                menu[item].dataset.mnuaction ===
                                    "set_terminated"
                                    ? "block"
                                    : "none";
                        }
                    }
                } else
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display =
                                menu[item].dataset.mnuaction === "set_rejoin" ||
                                menu[item].dataset.mnuaction ===
                                    "delete_employee"
                                    ? "block"
                                    : "none";
                        }
                    }

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
        html = [html,`<div class="row mb-3" style="background-color:;">`].join('');
        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                const status = d.status || "Active";
                let statusColor;

                switch (status) {
                    case "Terminated":
                        statusColor = "background-color: #24315b; color: #fff; border:1px solid rgb(201, 38, 17);";
                        break;
                    case "Resigned":
                        statusColor = "background-color: #24315b; color: #fff; border:1px solid rgb(225, 225, 14);";
                        break;
                    default:
                        statusColor = "background-color:#24315b; color: #fff; border:1px solid #fffbff;";
                        break;
                }

                html =[html, 
                    `<div class="col-md-3 mt-2 mb-3 employee-card" data-employee-id="${
                        d.id
                    }">`,
                        `<div class="card d-flex">`,
                            `<div class="card-header px-3">`,
                                `<div class="status_employee" style="${statusColor}; padding: 3px; border-radius: 20px;">`,
                                    `<span>${status}</span>`,
                                `</div>`,
                                `<div class="dropdown">`,
                                    `<a href="javascript:void(0)" class="btn_employee_action" data-id="${ d.id}" data-statusid="${d.status_id}" data-typeid="${d.emp_type_id}" aria-haspopup="true" aria-expanded="false">`,
                                      `<i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>`,
                                    `</a>`,
                                `</div>`,
                            `</div>`,
                            `<div class="card-body text-center" style="">`,
                                `<img src="${ d.image_url || (main_view.asset_url + "/images/logo/default_image_user.avif")}" class="rounded-circle mb-3" alt="Profile Picture" style="width: 100px; height: 100px;">`,
                                `<div class="card-title">`,
                                    `<h5 class="text-black text-nowrap truncated-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px">${d.name}</h5>`,
                                `</div>`,
                                `<div class="card_container gap-2 p-4 text-white">
                                    <div class="employee_id">#: <span class="ms-2">${
                                        d.code || "?"
                                    }</span></div>
                                    <div class="container_top">
                                        <div class="position">
                                            <i class="fa-solid fa-dashboard"></i> <span class="ms-2"> ${
                                                d.position || "?"
                                            }</span>
                                        </div>
                                        <div class="me-3">
                                            <i class="fa-solid fa-clock"></i> <span class="ms-2">${
                                                d.type || "?"
                                            }</span>
                                        </div>
                                    </div>
                                    <div class="container_bottom mt-1">
                                        <div class="phone text-muted">
                                            <div class=" d-flex rounded-5 gap-2"><i class="text-success m-1 fas fa-phone"></i><span> ${
                                                d.phone_number || "?"
                                            }</span></div>
                                        </div>
                                        <div class="email text-primary-custom">
                                            <div class="d-flex rounded-5 gap-2"><i class="text-warning m-1 fas fa-envelope"></i><span>${
                                                d.email || "?"
                                            }</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card_bottom pt-3 pe-3">
                                    <div class="text-dark">Joining Date : <span class="text-muted">${
                                        d.joining_date || "?"
                                    }</span></div>
                                    <a href="javascript:void(0)" class="see-detail text-primary-custom" data-id="${
                                        d.id
                                    }" aria-haspopup="true" aria-expanded="false">
                                        <i data-id="${
                                            d.id
                                        }" class="fa-regular fa-eye fs-6 tool-tip"><span class="tool-tiptext fs-6">see info</span></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `].join('');
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
                    mThis.renderEmpDocuments(employeeId);
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
                                <div class="div-img ms-2 mt-5">
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
                                    <p class="text-nowrap  width-p">Name KH</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.name_kh
                                    }</p>
                                </div>

                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Sex</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">
                                    ${data.sex == "M" ? "Male" : ""}${
            data.sex == "F" ? "Female" : ""
        }${data.sex == "O" ? "Other" : ""}</p>
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
                                <div class="d-flex">
                                    <p class="text-nowrap    width-p" vslang="titles.Joining Date">Joining Date</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.joining_date
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
                                    <p class="text-nowrap width-p">Employee Type</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">${
                                        data.type || ""
                                    }</p>
                                </div>
                                 <div class="d-flex">
                                    <p class="text-nowrap width-p">salary</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">​${
                                        data.salary || "0.00"
                                    }(KHR)</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap  width-p">Payroll Tax</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">
                                    ${data.apply_payroll_tax == "0"? "Have Tax": ""}${ data.apply_payroll_tax == "1" ? "Non Tax" : ""}
                                    </p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap width-p">Tel</p>
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
                                    <p class="text-nowrap width-p" vslang="titles.NSSF">NSSF</p>
                                    <p class="pl-5 pr-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.nssf_id
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap width-p" vslang="titles.Passport">Passport</p>
                                    <p class="pl-5 pr-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.passport_number
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap width-p" vslang="titles.Marital Status">Marital Status</p>
                                    <p class="pl-5 pr-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.marital_status
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap width-p" vslang="titles.Spouse Name">Spouse Name</p>
                                    <p class="pl-5 pr-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.spouse_name
                                    }</p>
                                </div>

                                <div class="d-flex">
                                    <p class="text-nowrap width-p " vslang="titles.Spouse Occupation">Spouse Occupation</p>
                                    <p class="pl-5 pr-2">:</p>
                                    <p class="text-nowrap text-capitalize">${
                                        data.spouse_occ_code
                                    }</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap width-p" vslang="titles.Address">Address</p>
                                    <p class="pl-5 pr-2">:</p>
                                    <p class="text-nowrap text-capitalize" style="overflow: hidden; text-overflow: ellipsis;">${
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
            btn = VSUtil.closestLimited(e.target, ".delete_employee");
            if (btn) {
                mThis.deleteEmployee(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".set_resign");
            if (btn) {
                mThis.setResign(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".movement");
            if (btn) {
                mThis.movement(btn.dataset.id, btn);
            }
        });
    };

    this.renderCardLeft = (employeeId) => {
        let html = "";

        let p = { emp_id: employeeId };

        vsapi
            .call(
                `${main_view.base_url}/hr/emp-skill/list-paginate`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let data = res.status_code === 200 ? res.data.data : [];

                let html = `
                    <div class="card pb-3" style="height:390px;">
                        <div class="card-header bg-primary-custom text-white">
                            <h5 class="mt-1">Skill</h5>
                            <div class="d-flex gap-2">
                                <a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-skill">
                                    <i class="fa fa-plus-circle fs-5 text-white"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body " style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.map((d) => {
                    html += `
                        <div class="row mt-2 py-3 border-bottom border-white">
                            <div class="col-md-8">
                                <div>
                                    <p class="text-primary-custom" style="width:250px; height:20px">
                                        <img class="bhr-icons" src="${main_view.asset_url}/images/icons/skill.png" />
                                        <span class="text-black-50"> Skill </span>
                                        <span class="px-2"> : </span>
                                        ${d.skill}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-primary-custom" style="width:250px; height:20px">
                                        <img class="bhr-icons" src="${main_view.asset_url}/images/icons/rate.png" />
                                        <span class="text-black-50"> Rate</span>
                                        <span class="px-2"> : </span>
                                        ${d.rate} %
                                    </p>
                                </div>
                            </div>
                           <div class="col-md-4 text-end">
                                <a href="javascript:void(0)" data-id="${d.id}" class="lnk-edit-skill">
                                    <i class="fa fa-edit fs-7 text-primary"></i>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-emp-id="${employeeId}" class="lnk-delete-skill ms-2">
                                    <i class="fa fa-trash fs-7 text-danger"></i>
                                </a>
                            </div>

                        </div>
                    `;
                });

                html += `</div></div>`;
                this.profile_card_left.innerHTML = html;

                // Add event listener for "Add" button
                document
                    .querySelector(".lnk-add-skill")
                    .addEventListener("click", function (e) {
                        e.preventDefault();

                        let btn = document.querySelector(
                            ".lnk-add-skill"
                        );
                        console.log(333, btn.dataset);

                        let op = {
                            id: null,
                            emp_id: btn.dataset.empid,

                            btn: e.target,
                            title: "New Skill",
                            onClose: () => {
                                mThis.EmployeeListView.showPage();
                            },
                        };
                        AddSkillDialog.show(op);
                    });

                // Add event listeners for all "Edit" buttons
                document
                    .querySelectorAll(".lnk-edit-skill")
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
                                title: "Edit Skill",
                                onClose: () => {
                                    mThis.renderCardLeft.showPage();
                                },
                            };
                            console.log("Edit operation:", op);
                            AddSkillDialog.show(op);
                        });
                    });

                document
                    .querySelectorAll(".lnk-delete-skill")
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
                                "Delete this Skill?",
                                {
                                    title: "Delete Skill",
                                    context: "delete",
                                    confirmButtonText: "Delete",
                                },
                                function (e) {
                                    if (e) {
                                        vsapi
                                            .call(
                                                `${main_view.base_url}/hr/emp-skill/delete`,
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
                                                    EmployeeComponent.renderCardLeft(
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

    this.renderCardCenter = (employeeId) => {
        let p = {
            emp_id: employeeId,
        };

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
                let html = `<div class="card pb-3" style="height:390px;">
                <div class="card-header text-white bg-primary-custom">
                    <h5 class="mt-1">Education</h5>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" id="lnk_add_education">
                            <i class="fa fa-plus-circle fs-5 text-white"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
            `;

                data.forEach((d) => {
                    html += `
                <div class="experience_item py-2 border-bottom border-white" style="display:flex">
                    <div class="col-md-6">
                        <h6 class="text-" style="width:180px; height:22px; overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap">${d.period}</h6>
                        <p class="text-primary-custom" style="width:170px; height:20px"><img class="bhr-icons" src="${main_view.asset_url}/images/icons/graduate.svg" /> ${d.edu_level}</p>
                        <p class="text-muted" style="width:160px; height:20px; overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; white-space: nowrap"><img class="bhr-icons" src="${main_view.asset_url}/images/icons/radio.svg" /> ${d.major}</p>
                    </div>

                    <div class="col-md-6">
                        <div class="d-flex justify-content-start">
                            <div class="d-flex gap-2 mt-4" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                                <span>${d.school}</span>
                            </div>
                        </div>
                    </div>
                    <div class="education_actions align-items-center gap-3 mr-2" style="display:flex; flex-direction:column; justify-content:center">
                        <a href="javascript:void(0)" data-id="${d.id}" class="btn-education-modify">
                            <i class="fa-regular fa-pen-to-square text-warning fs-10"></i>
                        </a>
                        <a href="javascript:void(0)" data-id="${d.id}" data-empid="{employeeId}" class="btn-education-delete">
                            <i class="fa-solid fa-trash-can text-danger fs-10"></i>
                        </a>
                    </div>
                </div>
                `;
                });

                html += `</div></div>`;
                this.profile_card_center.innerHTML = html;

                // Add new education
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
                        AddEducation.show(op);
                    });

                document
                    .querySelectorAll(".btn-education-modify")
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
                                title: "Edit",
                                onClose: () => {
                                    mThis.renderCardCenter.showPage();
                                },
                            };
                            console.log("Edit operation:", op);
                            AddEducation.show(op);
                        });
                    });
                document
                    .querySelectorAll(".btn-education-delete")
                    .forEach((btn) => {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            const id = e.target
                                .closest("a")
                                .getAttribute("data-id");
                            const emp_id = e.target
                                .closest("a")
                                .getAttribute("data-empid");
                            let op = {
                                id: id,
                                btn: e.target,
                                onClose: () => {},
                            };
                            cv_interact.confirm(
                                "Delete this Education?",
                                {
                                    title: "Delete Education",
                                    context: "delete",
                                    confirmButtonText: "Delete",
                                },
                                function (e) {
                                    if (e) {
                                        vsapi
                                            .call(
                                                `${main_view.base_url}/hr/education/delete`,
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
                                                        EmployeeComponent.renderCardCenter(emp_id);
                                                }
                                            });
                                    }
                                }
                            );
                        });
                    });

                // Add delete functionality
                // document
                //     .querySelectorAll(".btn-education-delete")
                //     .forEach((btn) => {
                //         btn.addEventListener("click", function (e) {
                //             e.preventDefault();

                //             // Confirm delete action
                //             if (
                //                 confirm(
                //                     "Are you sure you want to delete this record?"
                //                 )
                //             ) {
                //                 // Get the correct data-id
                //                 let educationId = this.getAttribute("data-id");

                //                 // Send delete request to API
                //                 vsapi
                //                     .call(
                //                         `${main_view.base_url}/hr/education/delete`,
                //                         { id: educationId },
                //                         null,
                //                         false,
                //                         false
                //                     )
                //                     .then((deleteRes) => {
                //                         if (deleteRes.status_code === 200) {
                //                             // Refresh the education list
                //                             mThis.renderCardCenter(employeeId);
                //                         } else {
                //                             console.error(
                //                                 "Failed to delete education:",
                //                                 deleteRes.message
                //                             );
                //                         }
                //                     })
                //                     .catch((err) =>
                //                         console.error(
                //                             "Error deleting education:",
                //                             err
                //                         )
                //                     );
                //             }
                //         });
                //     });
            });
    };

    this.renderCardRight = (employeeId) => {
        let p = {
            emp_id: employeeId,
        };

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
                let html = `<div class="card pb-3" style="height:390px;">
                <div class="card-header text-white bg-primary-custom">
                    <h5 class="mt-1">Experience</h5>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" id="lnk_add_experience">
                            <i class="fa fa-plus-circle fs-5 text-white"></i>
                        </a>
                    </div>
                </div>
                <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.forEach((d) => {
                    html += `
                <div class="row py-3 border-bottom border-white">
                    <div class="col-md-6" style="display: flex; flex-direction: column; gap:10px">
                        <div class="experience-toggle" data-experience-id="${d.id}"
                            style="display:flex; justify-content:space-between; width:350px; cursor: pointer;">
                            <div style="display:flex; width:350px; justify-content:space-between">
                                <p class="text-primary-custom" style="font-size:14px;width:195px;display:flex;justify-content:start; overflow-x: auto;scrollbar-width: none; text-overflow: ellipsis; white-space: nowrap;">
                                    📢 ${d.department}
                                </p>
                            </div>
                        </div>
                        <div style="display:flex; width:350px; justify-content:space-between">
                            <div class="date_join text-muted" style="width:230px;display:flex;align-items:start;">
                                <img class="bhr-icons" src="${main_view.asset_url}/images/icons/calender.svg" />
                                <p>(${d.start_date}</p><p class="text-danger ml-2 mr-2">-</p><p>${d.end_date})</p>
                            </div>
                            <p class="text-primary-custom text-nowrap" style="width:120px; justify-content:start;text-overflow: ellipsis;word-wrap: break-word;">
                                <img class="bhr-icons" src="${main_view.asset_url}/images/icons/bag.svg" /> ${d.position}
                            </p>
                        </div>
                        <div class="experience-details" id="details_${d.id}" style="display:none;flex-direction:column; gap:10px; transition: all 0.3s ease;">
                            <div class="experience-details-dropdown" style="display:flex;width:350px; justify-content:space-between">
                                <p class="text-primary-custom text-nowrap" style="width:230px;">Company: ${d.organization_id}</p>
                                <div class="d-flex gap-3" style="width:120px;justify-content:start;">
                                    <a href="javascript:void(0)" data-id="${d.id}" class="btn-experience-modify">
                                        <i class="fa-regular fa-pen-to-square text-success fs-10"></i>
                                    </a>
                                    <a href="javascript:void(0)" data-id="${d.id}" data-empid="${employeeId}" class="btn-experience-delete">
                                        <i class="fa-solid fa-trash-can text-info fs-10"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    `;
                });

                html += `</div></div>`;
                this.profile_card_right.innerHTML = html;
                document
                    .querySelectorAll(".experience-toggle")
                    .forEach((toggle) => {
                        toggle.addEventListener("click", function () {
                            const experienceId =
                                this.getAttribute("data-experience-id");
                            const detailsDiv = document.getElementById(
                                `details_${experienceId}`
                            );
                            const isVisible =
                                detailsDiv.style.display === "flex";
                            if (isVisible) {
                                detailsDiv.style.display = "none"; // Hide dropdown
                            } else {
                                document
                                    .querySelectorAll(".experience-details")
                                    .forEach((el) => {
                                        el.style.display = "none";
                                    });
                                detailsDiv.style.display = "flex"; // Show dropdown
                            }
                        });
                    });
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
                        AddExperience.show(op);
                    });
                document
                    .querySelectorAll(".btn-experience-modify")
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
                                title: "Edit",
                                onClose: () => {
                                    mThis.renderCardRight.showPage();
                                },
                            };
                            console.log("Edit operation:", op);
                            AddExperience.show(op);
                        });
                    });
                document
                    .querySelectorAll(".btn-experience-delete")
                    .forEach((btn) => {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            const id = e.target
                                .closest("a")
                                .getAttribute("data-id");
                            const emp_id = e.target
                                .closest("a")
                                .getAttribute("data-empid");

                            // Confirm deletion
                            cv_interact.confirm(
                                "Delete this Experience?",
                                {
                                    title: "Delete Experience",
                                    context: "delete",
                                    confirmButtonText: "Delete",
                                },
                                function (confirmDelete) {
                                    if (confirmDelete) {
                                        // Call API to delete the experience
                                        vsapi
                                            .call(
                                                `${main_view.base_url}/hr/experience/delete`,
                                                { id: id },
                                                false,
                                                false,
                                                false
                                            )
                                            .then((res) => {
                                                if (res.status_code === 200) {
                                                    cv_interact.success(
                                                        "Deleted Successfully"
                                                    );

                                                    // Refresh the experience list
                                                    EmployeeComponent.renderCardRight(
                                                        emp_id
                                                    );
                                                } else {
                                                    cv_interact.error(
                                                        "Failed to delete the experience."
                                                    );
                                                }
                                            })
                                            .catch((err) => {
                                                console.error(
                                                    "Error during deletion:",
                                                    err
                                                );
                                                cv_interact.error(
                                                    "An error occurred."
                                                );
                                            });
                                    }
                                }
                            );
                        });
                    });

            });
    };

    this.renderCardTaxAllowance = (employeeId) => {
        let p = { emp_id: employeeId };

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

                let html = `
                    <div class="card pb-3" style="height:390px;">
                        <div class="card-header bg-primary-custom text-white">
                            <h5 class="mt-1">Tax Allowance</h5>
                            <div class="d-flex gap-2">
                                <a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-tax-allowance">
                                    <i class="fa fa-plus-circle fs-5 text-white"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.map((d) => {
                    html = [html,`
                        <div class="row mt-2 py-3 border-bottom border-white">
                            <div class="col-md-8">`,
                                // `<div class="d-flex">
                                //     <p class="text-primary-custom" style="width:250px; height:20px; margin-bottom:10px;">
                                //         <img class="bhr-icons" src="${main_view.asset_url}/images/icons/amount.png" />
                                //         <span class="text-black-50">Amount</span>
                                //         <span class="px-2">:</span>
                                //         ${main_view.currency.symbol} ${formattedNumber(d.amount ?? 0)}
                                //     </p>
                                // </div>`,
                            //    `<div class="d-flex">
                            //         <p class="text-primary-custom" style="width:250px; height:20px; margin-bottom:10px;">
                            //             <img class="bhr-icons" src="${main_view.asset_url}/images/icons/qty.png" />
                            //             <span class="text-black-50">Quantity</span>
                            //             <span class="px-2">:</span>
                            //             ${d.qty}
                            //         </p>
                            //     </div>`,
                               `<div class="d-flex">
                                    <p class="text-primary-custom" style="width:250px; height:20px; margin-bottom:10px;">
                                        <img class="bhr-icons" src="${main_view.asset_url}/images/icons/amount.png" />
                                        <span class="text-black-50">Allowance (${d.qty})</span>
                                        <span class="px-2">:</span>
                                        ${main_view.currency.symbol} ${formattedNumber(d.allowance ?? 0)}
                                    </p>
                               </div>`,
                               `<div class="d-flex">
                                    <p class="text-primary-custom" style="width:250px; height:20px; margin-bottom:10px;">
                                        <img class="bhr-icons" src="${main_view.asset_url}/images/icons/remarks.png" />
                                        <span class="text-black-50">Remarks</span>
                                        <span class="px-2">:</span>
                                        ${d.remarks}
                                    </p>
                               </div>
                            </div>

                            <div class="col-md-4 text-end">
                                <a href="javascript:void(0)" data-id="${d.id}" class="lnk-edit-tax-allowance">
                                    <i class="fa fa-edit fs-7 text-primary"></i>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-emp-id="${employeeId}" class="lnk-delete-tax-allowance ms-2">
                                    <i class="fa fa-trash fs-7 text-danger"></i>
                                </a>
                            </div>
                        </div>
                    `].join('');
                });

                html += `</div></div>`;
                this.tax_allowance_card.innerHTML = html;

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
                                "Delete this Tax Allowance?",
                                {
                                    title: "Delete Tax Allowance",
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
    this.renderEmpDocuments = (employeeId) => {
        let p = { emp_id: employeeId };

        vsapi
            .call(
                `${main_view.base_url}/hr/emp-document/list-paginate`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let data = res.status_code === 200 ? res.data.data : [];

                let html = `
                    <div class="card pb-3" style="height:390px;">
                        <div class="card-header bg-primary-custom text-white">
                            <h5 class="mt-1">Employee Documents</h5>
                            <div class="d-flex gap-2">
                                <a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-emp-document">
                                    <i class="fa fa-plus-circle fs-5 text-white"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.map((d) => {
                    html = [html,`
                        <div class="row mt-2 py-3 border-bottom border-white">
                            <div class="col-md-10">`,

                               `<div class="d-block">
                                    <p class="text-primary-custom" style="width:400px; height:20px; margin-bottom:10px;">
                                        <img class="bhr-icons" src="${main_view.base_url}/assets/images/bhr/name.png" alt="" />
                                        <span class="text-black-50">Name File</span>
                                        <span class="px-2">:</span>
                                        ${d.name}
                                    </p>
                               </div>`,
                               `<div class="d-block">
                                    <p class="text-primary-custom" style="width:600px; height:20px; margin-bottom:10px;">
                                        <img class="bhr-icons" src="${main_view.base_url}/assets/images/bhr/folder.png" alt=""" />
                                        <span class="text-black-50">File</span>
                                        <span class="px-2">:</span>
                                        ${d.file_name}
                                    </p>
                               </div>
                            </div>

                            <div class="col-md-2 text-end">
                                <a href="javascript:void(0)" data-id="${d.id}" class="lnk-download-emp-document">
                                    <i class="fa fa-download fs-7 text-primary"></i>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-emp-id="${employeeId}" class="lnk-delete-emp-document ms-2">
                                    <i class="fa fa-trash fs-7 text-danger"></i>
                                </a>
                            </div>
                        </div>
                    `].join('');
                });

                html += `</div></div>`;
                this.emp_documents_card.innerHTML = html;

                // Add event listener for "Add" button
                document
                    .querySelector(".lnk-add-emp-document")
                    .addEventListener("click", function (e) {
                        e.preventDefault();

                        let btn = document.querySelector(
                            ".lnk-add-emp-document"
                        );
                        console.log(333, btn.dataset);

                        let op = {
                            id: null,
                            emp_id: btn.dataset.empid,

                            btn: e.target,
                            title: "New Employee Document",
                            onClose: () => {
                                mThis.EmployeeListView.showPage();
                            },
                        };
                        AddEmployeeDocumentDialog.show(op);
                    });

                    document
                    .querySelector(".lnk-add-emp-document")
                    .addEventListener("click", function (e) {
                        e.preventDefault();

                        let btn = document.querySelector(".lnk-add-emp-document");
                        console.log(333, btn.dataset);

                        let op = {
                            id: null,
                            emp_id: btn.dataset.empid,
                            btn: e.target,
                            title: "New Employee Document",
                            onClose: () => {
                                mThis.EmployeeListView.showPage();
                            },
                        };
                        AddEmployeeDocumentDialog.show(op);
                    });

                // Add event listeners for all "download" buttons
                document
                    .querySelectorAll(".lnk-download-emp-document")
                    .forEach((btn) => {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();

                            const id = e.target.closest("a").getAttribute("data-id");
                            const fileType = e.target.closest("a").getAttribute("data-type"); // You should have a `data-type` attribute (e.g., pdf, image)

                            if (!id || !fileType) {
                                console.error("No document ID or file type found for download.");
                                return;
                            }

                            const downloadUrl = `${main_view.base_url}/hr/emp-document/download?id=${id}&type=${fileType}`;

                            const link = document.createElement("a");
                            link.target = "_blank"; // Open in a new tab or trigger download

                            if (fileType === 'pdf') {
                                // For PDF files
                                link.href = downloadUrl;
                                link.download = `employee-document-${id}.pdf`; // Set the PDF file name
                            } else if (fileType === 'image') {
                                // For image files (jpg, png, etc.)
                                link.href = downloadUrl;
                                link.download = `employee-document-${id}.jpg`; // Adjust this to match the image format (jpg, png, etc.)
                            } else {
                                console.error("Unsupported file type");
                                return;
                            }

                            // Triggering download
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                    });




                document
                    .querySelectorAll(".lnk-delete-emp-document")
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
                                "Delete this document?",
                                {
                                    title: "Delete Employee Document",
                                    context: "delete",
                                    confirmButtonText: "Delete",
                                },
                                function (e) {
                                    if (e) {
                                        vsapi
                                            .call(
                                                `${main_view.base_url}/hr/emp-document/delete`,
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
                                                    EmployeeComponent.renderEmpDocuments(
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
    this.movement = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.MovementDialog = new GeneralDialog({
            title: LocaleManager.trans("Movement", "titles"),
            cssClass: "modal-lg",
            createContent: () => {
                return `
                    <div id="movement-options">
                        <div class="d-flex align-items-center gap-3 border-bottom">
                            <input data-target="div_branch" name="change_branch" class="mb-2 change-option" type="checkbox" id="branch" name="items" value="branch" />
                            <label for="branch" class="text-primary-custom">Change Branch</label>

                            <input data-target="div_position" name="change_position" class="mb-2 change-option data-input" data-field="position_id" type="checkbox" id="position" name="items" value="position" />
                            <label for="position" class="text-primary-custom">Change Position</label>

                            <input data-target="div_salary" name="change_salary" class="mb-2 change-option" type="checkbox" id="salary" name="items" value="salary" />
                            <label for="salary" class="text-primary-custom">Change Salary</label>
                        </div>
                    </div>

                    <div name="div_branch" class="p-3  branch" style="display:none;">
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Change Branch"></label>
                                <span class="text-danger" >*</span>
                                <select name="branch" id="branch" class="form-control data-input" data-field="branch_id">

                                </select>
                            </div>
                            <div class=" form-group col-md-4">
                                <label class="form-label" vslang="titles.Effective Date">Effective Date</label>
                                <span class="text-danger" >*</span>
                                <input  name="effective_date" class="form-control data-input" data-field="effective_date"></input>
                            </div>
                            <div id="remarks" class="form-group col-md-5">
                                <label class="form-label" vslang="titles.Remarks"></label>
                                <input name="branch_remarks" class="form-control  data-input" placeholder="" data-field="remarks">
                            </div>
                        </div>

                    </div>
                    <div name="div_position" class="p-2" style="display:none;">
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Change Position"></label>
                                <span class="text-danger" >*</span>
                                <select name="position" id="position" class="form-control data-input" data-field="position_id">

                                </select>
                            </div>
                              <div class=" form-group col-md-4">
                                <label class="form-label" vslang="titles.Start Date">Start Date</label>
                                <span class="text-danger" >*</span>
                                <input  name="start_date" class="form-control data-input" data-field="start_date"></input>
                            </div>
                            <div id="remarks" class="form-group col-md-5">
                                <label class="form-label" vslang="titles.Remarks"></label>
                                <input name="position_remarks" class="form-control data-input" placeholder="" data-field="remarks" />
                            </div>
                        </div>
                    </div>


                    <div name="div_salary" class="p-2" style="display:none;">
                        <div class="row">
                            <div id="salary" class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Original Salary"></label>
                                <input name="org_salary" class="form-control  data-input" placeholder="" data-field="salary" />
                            </div>
                            <div id="salary" class="form-group col-md-4">
                                <label class="form-label" vslang="titles.New Salary"></label>
                                <span class="text-danger" >*</span>
                                <input name="new_salary" class="form-control  data-input" placeholder="" data-field="new_salary" />
                            </div>

                            <div id="remarks" class="form-group col-md-5">
                                <label class="form-label" vslang="titles.Remarks"></label>
                                <input name="salary_remarks" class="form-control  data-input" placeholder="" data-field="remarks" />
                            </div>
                        </div>
                    </div>
                `;
            },
            // overrideMethod:{
            //       "getData":(me,divModal) =>{
            //           return {
            //             'emp_id':me.dataOptions.id,
            //             "change_branch":{'branch_id':me.controls.branch.value,'remarks':me.controls.branch_remarks.value,'effective_date':me.controls.effective_date.value},
            //             "change_position":{'position_id':me.controls.position.value,'remarks':me.controls.position_remarks.value,'start_date':me.controls.start_date.value},
            //             "change_salary":{'new_salary':me.controls.position.value,'remarks':me.controls.salary_remarks.value}

            //           };
            //       }
            // },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.effective_date);
                DateTimePicker.init(me.controls.start_date);

                me.setEvent = (div) => {
                    div.querySelectorAll("input").forEach((input) => {
                        input.onchange = (e) => {
                            const divTarget = me.controls[input.dataset.target];
                            if (divTarget) {
                                divTarget.style.display = input.checked
                                    ? "block"
                                    : "none";
                            }
                        };
                    });
                };
                me.setEvent(me.divModal);
            },

            configSelect: [
                {
                    name: "branch",
                    data: "branches",
                    textField: "branch_name",
                    valueField: "id",
                },
                {
                    name: "position",
                    data: "positions",
                    textField: "title",
                    valueField: "id",
                },
            ],
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
                    label: "<span>Save</span",
                    click: (me, btn, divModal) => {
                        let p = me.getData();
                        p.emp_id = op.id;
                        console.log(321, p);
                        let d = {};
                        d.emp_id = p.emp_id;
                        let change_branch = {},
                            change_position = {},
                            change_salary = {};

                        if (me.controls.change_branch.checked) {
                            change_branch.branch_id = p.branch_id;
                            change_branch.remarks =
                                me.controls.branch_remarks.value;
                            change_branch.effective_date = p.effective_date;
                        }
                        if (me.controls.change_position.checked) {
                            change_position.position_id = p.position_id;
                            change_position.remarks =
                                me.controls.position_remarks.value;
                            change_position.start_date = p.start_date;
                        }
                        if (me.controls.change_salary.checked) {
                            change_salary.new_salary = p.new_salary;
                            change_salary.remarks =
                                me.controls.salary_remarks.value;
                            change_salary.org_salary = p.salary;
                            change_salary.org_position_id = p.position_id;
                            change_salary.new_position_id = p.position_id;
                        }

                        d.change_branch = change_branch;
                        d.change_position = change_position;
                        d.change_salary = change_salary;
                        console.log(12301, d);

                        vsapi
                            .call(
                                `${main_view.base_url}/hr/employee/promote-staff`,
                                d,
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
            prepareFormOptions: {
                createTitle: "Employee Movement",
                modifyTitle: "Edit Movement",
                targetProp: "Employee Movement",
                api: {
                    endpoint: `${main_view.base_url}/hr/employee/form-options`,

                    params: (op) => {
                        return { id: op.id };
                    },
                    onResponse: (me, res) => {},
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.controls.branch.value = data.employee.branch_id;
                me.controls.position.value = data.employee.position_id;
                me.controls.org_salary.value = data.employee.salary;
            },
        });
        mThis.MovementDialog.show(op);
    };

    this.setResign = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.ResignDialog = new GeneralDialog({
            title: LocaleManager.trans("Set Resign", "titles"),
            createContent: () => {
                return [
                    ` <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Resign Date">Resign Date</label>
                            <span class="text-danger" >*</span>
                            <div><input  name="resign_date" class="form-control data-input" placeholder="" data-field="resign_date"/></div>
                        </div>
                        <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Effective Date">Effective Date</label>
                            <span class="text-danger" >*</span>
                            <div><input  name="effective_date" class="form-control data-input" placeholder="" data-field="effective_date"/></div>
                        </div>
                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Remarks">Remarks</label>
                        <textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>
                      </div>

                   `,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.resign_date);
                DateTimePicker.init(me.controls.effective_date);
            },

            configSelect: [],
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
                    label: "<span>Resign Now</span",
                    click: (me, btn, divModal) => {
                        let p = me.getData();
                        //  p.emp_id = op.id;
                        console.log(111, p);
                        vsapi
                            .call(
                                `${main_view.base_url}/hr/employee/set-resign-status`,
                                p,
                                btn,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    cv_interact.success(
                                        "This Employee has been resign successfully!"
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
        mThis.ResignDialog.show(op);
    };

    this.promoteToStaff = (id, menuLink) => {
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
        let status_id = Validator.properCase(tr ? tr.dataset.status_id : "");

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
    this.setRejoin = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.RejoinDialog = new GeneralDialog({
            title: LocaleManager.trans("Set Rejoin", "titles"),
            createContent: () => {
                return [
                    ` <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Resign Date">Rejoin Date</label>
                            <div><input  name="rejoin_date" class="form-control data-input" placeholder="" data-field="rejoin_date"/></div>
                        </div>

                      <div class="form-group col-md-12">
                        <label class="form-label" vslang="titles.Remarks">Remarks</label>
                        <textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>
                      </div>

                   `,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.rejoin_date);
            },

            configSelect: [],
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
                    label: "<span>Join Now</span",
                    click: (me, btn, divModal) => {
                        let p = me.getData();
                        //  p.emp_id = op.id;
                        vsapi
                            .call(
                                `${main_view.base_url}/hr/employee/set-rejoin-status`,
                                p,
                                btn,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    cv_interact.success(
                                        "This Employee has been join successfully!"
                                    );
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
        mThis.RejoinDialog.show(op);
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
                VSUtil.setComboItems(
                    mThis.el_work_shift,
                    d.work_shifts,
                    "id",
                    "name",
                    true,
                    "All Shift",
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
                            <label class="form-label" vslang="titles.Start Year">Start Year</label>
                            <div><input name="start_year" class="form-control data-input" data-field="start_year"/></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Finish Year">Finish Year</label>
                            <div><input name="finish_year" class="form-control data-input" data-field="finish_year"/></div>
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
                            p.emp_id = me.dataOptions.emp_id;
                            console.log(11, p);

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
                    targetProp: "education",
                    api: {
                        endpoint: `${main_view.base_url}/hr/education/form-options`,
                        params: (op) => {
                            return { id: op.id }; // Pass ID to fetch data for edit
                        },
                        // onResponse: (me, res) => {
                        //     if (op.id) {
                        //         // Populate form with existing data for edit mode
                        //         // me.setValue('emp_id', res.data.emp_id);
                        //         // me.setValue('period', res.data.period);
                        //         // me.setValue('description', res.data.description);
                        //         // me.setValue('amount', res.data.amount);
                        //     }
                        // },
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
                        <div class=" form-group col-md-12">
                            <label class="form-label" vslang="titles.Period">Period</label>
                            <div><input name="period_type" class="form-control data-input" data-field="period_type"></input></div>
                        </div>
                        <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Description">Description</label>
                            <input type="text" name="description" class="form-control data-input" data-field="description"/>
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

        dialog = new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row">`,
                            `<div class="col-3">`,
                                `<div style="height:165px;" class="data-input border border-secondary rouded-3 justify-items-center align-items-center">`,
                                    `<div name="div_emp_photo" data-field="photo" class="h-100"></div>`,
                                `</div>`, 
                            `</div>`,
                            `<div class="col-9">`,
                                `<div class="row">`,
                                    `<div class="form-group col-4">
                                        <label for="name" class="form-label text-primary-custom" vslang="titles.Name"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="name" class="form-control  data-input" data-field="name" />
                                    </div>
                                     <div class="form-group col-4">
                                        <label for="name_kh" class="form-label text-primary-custom" vslang="titles.Khmer Name"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="name_kh" class="form-control  data-input" data-field="name_kh" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="nid" class="form-label text-primary-custom" vslang="titles.Identity Card"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="nid" class="form-control  data-input" data-field="nid" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="nationality" class="form-label text-primary-custom" vslang="titles.Nationality"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="nationality_id" class="data-input" data-field="nationality_id"></select>
                                    </div>
                                    <div class="form-group col-4">
                                       <label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>
                                            <select class="modal-select data-input" data-field="sex">
                                                <option value="">(Select Sex)</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="O">Other</option>
                                            </select>
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="date_of_birth" class="form-label text-primary-custom" vslang="titles.Date Of Birth"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="date_of_birth" class="form-control  data-input" data-field="date_of_birth" />
                                    </div>

                                </div>
                            </div>
                                <div class="row">
                                    <div class="form-group col-4">
                                        <label for="phone_number" class="form-label text-primary-custom" vslang="titles.Phone"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="phone_number" class="form-control data-input" data-field="phone_number" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="email" class="form-label text-primary-custom" vslang="titles.Email"></label>
                                        <span class="text-danger" >*</span>
                                        <input type="email" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />
                                    </div>

                                     <div class="form-group col-4">
                                        <label for="nssf_id" class="form-label text-primary-custom" vslang="titles.NSSF ID"></label>
                                        <input name="nssf_id" class="form-control data-input" data-field="nssf_id" />
                                    </div>

                                     <div class="form-group col-4">
                                        <label for="passport_number" class="form-label text-primary-custom" vslang="titles.Passport Number"></label>
                                        <input name="passport_number" class="form-control data-input" placeholder="" data-field="passport_number" />
                                    </div>

                                    <div class="form-group col-4">
                                        <label for="birth_city_id" class="form-label text-primary-custom" vslang="titles.Place of Birth"></label>
                                        <select name="birth_city_id" class="modal-select2 data-input" placeholder="" data-field="birth_city_id"></select>
                                    </div>

                                    <div class="form-group col-4">
                                        <label for="marital_status" class="form-label text-primary-custom" vslang="titles.Marital Status"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="marital_status" class="modal-select2 data-input" placeholder="" data-field="marital_status">
                                          <option value="Single">Single</option>
                                          <option value="Married">Married</option>
                                          <option value="Divorced">Divorced</option>
                                          <option value="Not Disclosed">Not Disclosed</option>
                                        </select>
                                    </div>

                                    <div class="form-group col-3">
                                        <label for="spouse_name" class="form-label text-primary-custom" vslang="titles.Spouse Name"></label>
                                        <input name="spouse_name" class="form-control data-input" placeholder="" data-field="spouse_name" />
                                    </div>

                                    <div class="form-group col-3">
                                        <label for="spouse_occ_code" class="form-label text-primary-custom" vslang="titles.Spouse Occupation"></label>
                                        <input name="spouse_occ_code" id="spouse_occ_code" class="form-control data-input"  data-field="spouse_occ_code" />
                                    </div>

                                    <div class="form-group col-3">
                                        <label for="spouse_emp_id" class="form-label text-primary-custom" vslang="titles.Spouse Employee"></label>
                                         <select name="spouse_emp_id" class=" data-input"  data-field="spouse_emp_id"></select>
                                    </div>
                                    <div class="form-group col-3">
                                        <label for="type" class="form-label text-primary-custom " vslang="titles.Employee Type"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="type" class="data-input"  data-field="emp_type_id"></select>
                                    </div>
                                    <div class="form-group salary col-4">
                                        <label for="salary" class="form-label text-primary-custom" vslang="titles.salary"></label>
                                        <input name="salary" id="salary" class="form-control data-input"  data-field="salary" />
                                    </div>

                                    <div class="form-group col-4">
                                        <label for="position" class="form-label text-primary-custom " vslang="titles.Position"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="position" class="data-input" data-field="position_id"></select>
                                    </div>

                                    <div class="form-group col-4">
                                        <label for="work_shift" class="form-label text-primary-custom " vslang="titles.Work Shift"></label>
                                        <span class="text-danger" >*</span>
                                        <select name="work_shift" class="work_shift data-input"  data-field="work_shift_id"></select>
                                    </div>
                                      <div class="form-group col-4">
                                        <label for="joining_date" class="form-label text-primary-custom " vslang="titles.Joining Date"></label>
                                        <span class="text-danger" >*</span>
                                        <input name="joining_date" class="form-control data-input " data-field="joining_date" />
                                    </div>
                                    <div class="form-group col-12">
                                        <label for="address" class="form-label text-primary-custom" vslang="titles.Address">Address</label>
                                        <textarea name="address" id="address" class="form-control  data-input" data-field="address"></textarea>
                                    </div>

                                </div>

                        </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                const salary = me.divModal.querySelector(".salary");
                salary.classList.add("d-none");
                //Convert field to be DatePicker : start_date and end_date
                DateTimePicker.init(me.controls.date_of_birth);
                DateTimePicker.init(me.controls.joining_date);
                LocaleManager.translateZone(me.divModal);
                const div_emp_photo = me.controls.div_emp_photo;

                me.empImageBox = new ImageBox(div_emp_photo, {
                    defaultPhotoName:'default-staff',
                    containerClass: "emp-profile-container",
                    imgClass: "data-input",
                    dataset: { field: "photo" }, /** please set field: photo so that we can use for both Edit and Create easily */
                    //dataset: { field: "image_url" },
                    beforeDeleteImage: async ()=> {
                       if(me.dataOptions.id > 0){
                           const answer = await cv_interact.confirm('Are you sure to delete this profile photo?', {title:'Delete Photo','context':'delete'});
                           if(answer){
                                me.deleteProfilePhoto(me.dataOptions.id);
                                return true;
                           } else return false;

                       } 
                       return true;
                    },
                    //When user browse new photo and loads it in
                    onOpenImage: (img)=>{
                        if(me.dataOptions.id > 0){
                          me.saveProfilePhoto(img, me.dataOptions.id);
                       }
                    },
                    // onImageLoaded: (img)=>{
                    //    if(me.dataOptions.id > 0){
                    //         const p = {"photo":me.empImageBox.getImage(), "id" : me.dataOptions.id};
                    //         vsapi.call([main_view.base_url,'/bhr/employee/profile-photo/save'].join(''), p,false).then(res =>{
                    //             if(res.status_code == 200){
                    //             cv_interact.info('Profile photo was deleted!');
                    //             }else cv_interact.error(res.error_message);
                    //         });  
                    //    } 
                    // }
                });

                me.deleteProfilePhoto = (emp_id)=>{
                    const p = {"id":emp_id};
                    vsapi.call([main_view.base_url,'/hr/employee/profile/photo/delete'].join(''),p,false,false).then(res =>{
                        if(res.status_code == 200){
                          me.empImageBox.setImage(null);   
                          cv_interact.info('Profile photo was deleted!');
                        }else cv_interact.error(res.error_message);
                    });
                };

                me.saveProfilePhoto = (photo, emp_id)=>{
                    const p = {"photo": photo, "id" : emp_id};
                    vsapi.call([main_view.base_url,'/hr/employee/profile/photo/save'].join(''), p,false).then(res =>{
                        if(res.status_code == 200){
                          me.empImageBox.setImage(res.data.image_url);
                          cv_interact.success('Profile photo was deleted!');
                        }else cv_interact.error(res.error_message);
                   });  
                };

                // me.showProfile = (code) => {
                //     let fields = [];
                //     let p = { id: code };

                //     vsapi
                //         .call(
                //             [main_view.base_url,"/hr/employee/form-options"].join(""),
                //             p,
                //             false,
                //             false
                //         )
                //         .then((res) => {
                //             let d = res.status_code == 200 ? res.data : {};
                //             d = d.employee || {};

                //             me.divModal
                //                 .querySelectorAll(".data-input")
                //                 .forEach((el) => {
                //                     const f = el.dataset.field;

                //                     if (fields.indexOf(f) >= 0) {
                //                         el.value = d[f] || "";
                //                     } else if (f === "image_url") {
                //                         if (me.dataOptions.id)
                //                             el.innerHTML = `<img name="div_emp_photo" class="w-100" src="${
                //                                 d[f] || ""
                //                             }"/>`;
                //                     }
                //                 });
                //         });
                // };
                
                // me.deleteImage = (div) => {
                //     const btnDelete = div; //.querySelector('[role=\'button\']');
                //     btnDelete.onclick = function (e) {
                //         e.preventDefault();
                //         const html = `<div id="dlg_image_chooser"
                //                             class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                //                             <i class="fa-regular fa-image fs-4 text-muted"></i>
                //                         </div>`;
                //         div.innerHTML = html;
                //         // mThis.chooseImage(div);
                //         // let div_emp_photo = div.querySelector('[name="div_emp_photo"]');
                //         me.userImageBox = new ImageBox(div, {
                //             containerClass: "emp-profile-container",
                //             imgClass: "data-input",
                //             dataset: { field: "image_url" },
                //         });
                //     };
                // };
                //me.deleteImage(div_emp_photo);

                //me.showProfile(me.dataOptions.id);
            },
            configSelect: [
                {
                    name: "nationality_id",
                    data: "nationalities",
                    textField: "nationality",
                    valueField: "id", // "id" is the country_id
                },
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
                {
                    name: "branch_id",
                    data: "branches",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "birth_city_id",
                    data: "cities",
                    textField: "name",
                    valueField: "country_id",
                },
                {
                    name: "spouse_emp_id",
                    data: "employees",
                    //firstOption: {"value": 0,"label":"None"},
                    textField: (me, d) => {
                        return `<div class="d-flex gap-2"><span> ${d.name} </span></div>`;
                    },
                    valueField: "id",
                },
            ],
            overrideMethod:{
                "setData":(me, data)=> {
                    const id = me.dataOptions.id;
                    const fields = me.fields;
                    //fields to be reasOnly or disabled when Editing employee
                    const disabled_fields = ['salary','position_id','work_shift_id','department_id','emp_type_id'];
                    for(const name in fields){
                        const el = fields[name];
                        if (id > 0){
                            if (disabled_fields.indexOf(name) >=0) {
                                if (el.tagName.toLowerCase() === "select") {
                                    el.setAttribute("disabled", true);
                                }else el.setAttribute('readOnly',true);
                            }
                        }
                        el.value = data[name] ?? '';
                    }
                    me.empImageBox.setImage(data.image_url);
                    me.controls.type.value = data.emp_type_id;
                },
            },
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
                        const p = me.getData();
                        p.photo = me.empImageBox
                            ? me.empImageBox.getImage()
                            : '';
                        vsapi
                            .call(
                                [main_view.base_url, "/hr/employee/save"].join(""),
                                p,
                                btn,
                                false,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    //EmployeeComponent.btnBack.click();
                                    // EmployeeDialog.show(me.dataOptions);
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
                    endpoint:[main_view.base_url,"/hr/employee/form-options"].join(""),
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
            //onClose: (canceled) => {},
        });

        dialog.show(op);
    };

    return self;
})();

const AddSkillDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {

        dialog =
            dialog ||
            new GeneralDialog({
                title: op.id ? "Add Skill" : " Edit Skill ",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="row">

                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Skill">Skill</label>
                             <select name="skill" class=" data-input"  data-field="skill_id"></select>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Rate">Rate</label>
                            <div><input name="rate" class="form-control data-input" data-field="rate"/></div>
                        </div>

                    </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "skill",
                        data: "skills",
                        textField: "skill",
                        valueField: "id",
                    },
                ],
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
                            console.log(111,p);
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/emp-skill/save",
                                    ].join(""),
                                    p,
                                    false,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.modal.hide(true, p);
                                        EmployeeComponent.renderCardLeft(
                                            me.dataOptions.emp_id
                                        );
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],

                prepareFormOptions: {
                    createTitle: "New Skill",
                    modifyTitle: "Edit Skill",
                    targetProp: "emp_skill",
                    api: {
                        endpoint: `${main_view.base_url}/hr/emp-skill/form-options`,
                        params: (op) => {
                            return { id: op.id }; // Pass ID to fetch data for edit
                        },
                        onResponse: (me, res) => {
                            if (op.id) {

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

const AddEmployeeDocumentDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                title: op.id ? "Edit Employee Document" : "Add Employee Document",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return `
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="form-label" vslang="titles.Name File">Name File</label>
                                <div>
                                    <input name="name" class="form-control data-input" data-field="name" />
                                </div>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-label" vslang="titles.File">File</label>
                                <div>
                                    <input type="file" name="btn_file" class="form-control data-input" data-field="file_name" />

                                </div>
                            </div>
                        </div>`;
                },
                contentCreated: (me) => {
                    me.fileData = null;

                    const fileInput = me.controls.btn_file;
                    fileInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                me.fileData = {
                                    file: event.target.result.split(",")[1], // Base64 content
                                    ext: file.name.split(".").pop(),
                                    name: file.name,
                                };
                                // document.getElementById("fileNameDisplay").textContent = `Selected file: ${file.name}`;
                            };
                            reader.readAsDataURL(file);
                        } else {
                            me.fileData = null;
                            document.getElementById("fileNameDisplay").textContent = "No file chosen";
                        }
                    };
                },
                buttons: [
                    {
                        label: "<span>Cancel</span>",
                        cssClass: "btn btn-warning text-white",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me) => {
                            const data = me.getData();
                            if (!data.name || !me.fileData) {
                                return cv_interact.error("Please fill all required fields and select a file.");
                            }

                            data.emp_id = me.dataOptions.emp_id;
                            data.ext = me.fileData.ext;
                            data.file_name = me.fileData.file;

                            vsapi
                                .call(
                                    `${main_view.base_url}/hr/emp-document/save`,
                                    data,
                                    false,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.modal.hide(true, data);
                                        EmployeeComponent.renderEmpDocuments(me.dataOptions.emp_id);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "New Employee Document",
                    modifyTitle: "Edit Employee Document",
                    targetProp: "emp_document",
                    api: {
                        endpoint: `${main_view.base_url}/hr/emp-document/form-options`,
                        params: (op) => ({ id: op.id }), // Pass ID to fetch data for edit
                        onResponse: (me, res) => {
                            if (op.id) {
                                const doc = res.data;
                                me.controls.name.value = doc.name || "";
                                document.getElementById("fileNameDisplay").textContent = doc.file_name || "No file chosen";
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

