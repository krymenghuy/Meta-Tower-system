"use strict";
var EmployeeComponent = new (function () {
    const mThis = {};
    mThis.title_prop = "Employee management";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_employeeComponent");
    mThis.self = mThis.jm[0];

    mThis.elEmployeeStatus = mThis.self.querySelector("#filter_employee_status");
    mThis.el_branch = mThis.self.querySelector("#el_branch");
    mThis.el_work_shift = mThis.self.querySelector("#el_work_shift");
    mThis.elEmployeeType = mThis.self.querySelector("#filter_employee_type");
    mThis.btnAdd = mThis.self.querySelector("#_btn_add_employee");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_employee");
    mThis.div_filter_fields = mThis.self.querySelector("#div_filter_filed");
    mThis.elSearch = mThis.self.querySelector("#_search_employee");
    mThis.profile_card_center = mThis.self.querySelector("#profile_card_center");
    mThis.profile_card_left = mThis.self.querySelector("#profile_card_left");
    mThis.profile_card_right = mThis.self.querySelector("#profile_card_right");
    mThis.tax_allowance_card = mThis.self.querySelector("#tax_allowance_card");
    mThis.emp_documents_card = mThis.self.querySelector("#emp_documents_card");
    mThis.profile_info_emp = mThis.self.querySelector("#profile_info_emp");
    mThis.divlistView = mThis.self.querySelector('#_employee_list');
    mThis.paginationContainer = mThis.self.querySelector("#container_pagination");
    mThis.store_filter = {};
    const div = mThis.self.querySelector("#_employee_list");

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

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView(mThis.divlistView, {
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

        mThis.listContainer = mThis.EmployeeListView.getListContainer();

        mThis.initDropdownMenus(div);
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.height = window.innerHeight - 220 + "px";
        };

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
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

    mThis.initDropdownMenus = (listContainer) => {
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
                    html: '<span class="ps-2" vslang="titles.Create Contract">Create Contract</span>',
                    icon: `<i class="fa-solid text-primary fa-download"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract",
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
                                menu[item].dataset.mnuaction === "edit_employee" ||
                                menu[item].dataset.mnuaction === "create_contract"
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
                    case "create_contract": {
                        mThis.CreateContract(id, menuLink);
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

    mThis.renderEmployeeList = (div, data) => {
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

    mThis.renderEmployee = (data) => {
        let html = "";
        html = [html,`<div class="row mb-3" style="background-color:;">`].join('');
        let cmt = 0;

        if (Array.isArray(data) && data[0]) {
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
                            `<div class="card-header p-3 px-3">`,
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
                                `<div class="overflow-hidden rounded-circle mx-auto p-auto d-flex justify-content-center border bg-white border-4 mb-3 " style="width: 120px; height: 120px;"> `,
                                    `<img src="${ d.image_url || (main_view.asset_url + "/images/default/default-staff.png")}" class="h-100" alt="Profile Picture" >`,
                                `</div>`,
                                `<div class="card-title">`,
                                    `<h5 class=" text-nowrap truncated-text text-primary-custom text-capitalize" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px">${d.name}</h5>`,
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
            html = [`<div class="w-100 rounded-3  text-center mt-3 mb-3 position-relative">`,
                    `<div class="d-flex bg-grey shadow rounded-5 p-3"><span class="d-flex align-items-center justify-content-center p-2 w-100 text-danger">Employee not found! </span></div>`,
            `</div>`].join('');
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

    mThis.renderProfile = (data) => {
        let html = [
            `<div class="employee-card d-flex bg-primary-custom h-info-employee mb-2" data-id="">`,
                `<div class="d-block w-100">`,
                    `<div class="row text-white mb-0">`,
                        `<div class="col-md-2">
                            <div class="div-img ms-3 mt-4">
                                <img src="${data.image_url || main_view.asset_url +"/images/default/default-staff.png"}" alt="Employee Image">
                            </div>
                            <div class="d-flex mt-3  justify-content-center">
                                <small class="text-nowrap" style="color:#28e07c;"># : <span class="text-white"> ${data.code}</span></small>
                            </div>
                            <div class="d-flex  justify-content-center">
                                <small class="text-nowrap" style="color:#cab54a;">${data.position}</small>
                            </div>
                                <div class="d-flex social-icons mt-3 w-100 justify-content-center">
                                <a href="https://www.facebook.com/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/facebook.svg" alt="Facebook"></a>
                                <a href="https://www.linkedin.com/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/linkedin.svg" alt="Linkedin"></a>
                                <a href="https://web.telegram.org/a/" class="bg-white rounded-5 mx-2"><img src="assets/images/bhr/telegram.svg" alt="Telegram"></a>
                            </div>

                        </div>`,
                        `<div class="col-md-10">`,
                            `<div class="row">`,
                                `<div class="col-md-4 mt-3">
                                    <div class="d-flex">
                                        <p class="text-nowrap  width-p">Name</p>
                                        <p class="px-2">:</p>
                                        <p class="text-white text-capitalize">${data.name}</p>
                                    </div>
                                    <div class="d-flex">
                                        <p class="text-nowrap  width-p">Name KH</p>
                                        <p class="px-2">:</p>
                                        <p class="text-white text-capitalize">${data.name_kh}</p>
                                    </div>
                                    <div class="d-flex">
                                        <p class="text-nowrap  width-p">Sex</p>
                                        <p class="px-2">:</p>
                                        <p class="text-white">${data.sex == "M" ? "Male" : ""}${data.sex == "F" ? "Female" : ""}${data.sex == "O" ? "Other" : ""}</p>
                                    </div>
                                    <div class="d-flex">
                                        <p class="text-nowrap  width-p">Nationality</p>
                                        <p class="px-2">:</p>
                                        <p class="text-white">${data.nationality}</p>
                                    </div>
                                    <div class="d-flex">
                                        <P class="text-nowrap width-p" vslang="titles.Marital Status">Marital Status</p>
                                        <P class="px-2">:</p>
                                        <P class="text-nowrap text-white">${data.marital_status}</p>
                                    </div>
                                </div>`,

                                `<div class="col-md-4 mt-3">
                                    <div class="d-flex">
                                        <P class="text-nowrap width-p">Staff Type</p>
                                        <P class="px-2">:</p>
                                        <P class="text-nowrap" style="color:#cab54a;">${data.type}</p>
                                    </div>
                                    <div class="d-flex">
                                        <P class="text-nowrap  width-p">Position</p>
                                        <P class="px-2">:</p>
                                        <P class="text-nowrap" style="color:#cab54a;">${data.position}</p>
                                    </div>

                                    <div class="d-flex">
                                        <P class="text-nowrap  width-p">Email</p>
                                        <P class="px-2">:</p>
                                        <P class="text-white" style="text-align:left; overflow:hidden; white-space:wrap; text-overflow:ellipsis; word-wrap:break-word; white-space:nowrap;" >${data.email}</p>
                                    </div>
                                    <div class="d-flex">
                                        <P class="text-nowrap width-p">Phone Number</p>
                                        <P class="px-2">:</p>
                                        <P class="text-nowrap text-white">${data.phone_number}</p>
                                    </div>
                                    <div class="d-flex">
                                        <P class="text-nowrap  width-p">Husband/Wife Name</p>
                                        <P class="pl-5 pr-2">:</p>
                                        <P class="text-white">${data.spouse_name ?? "not yet"}</p>
                                    </div>
                                </div>`,

                                `<div class="col-md-4 mt-3">
                                    <div class="d-flex">
                                        <p class="text-nowrap    width-p" vslang="titles.Identity Card">Identity Card</p>
                                        <p class="pl-5 pr-2">:</p>
                                        <p class="text-nowrap text-white">${data.nid}</p>
                                    </div>
                                    <div class="d-flex">
                                        <p class="text-nowrap    width-p" vslang="titles.Passport ID">Passport ID</p>
                                        <p class="pl-5 pr-2">:</p>
                                        <p class="text-nowrap text-white">${data.passport_number}</p>
                                    </div>
                                    <div class="d-flex">
                                        <p class="text-nowrap    width-p" vslang="titles.Passport ID">Passport ID</p>
                                        <p class="pl-5 pr-2">:</p>
                                        <p class="text-nowrap text-white">${data.passport_expiry_date ??"not yet have"}</p>
                                    </div>
                                    <div class="d-flex">
                                        <P class="text-nowrap width-p" vslang="titles.NSSF">NSSF</p>
                                        <P class="pl-5 pr-2">:</p>
                                        <P class="text-nowrap text-white">${data.nssf_id}</p>
                                    </div>
                                    <div class="d-flex">
                                        <P class="text-nowrap width-p " vslang="titles.Spouse Occupation">Spouse Occupation</p>
                                        <P class="pl-5 pr-2">:</p>
                                        <P class="text-white">${data.spouse_occ_code ?? "ទទេ"}</p>
                                    </div>

                                </div>
                                 </div>`,

                                `<hr class="bg-white">`,
                                `<div class="row mt-2">
                                    <div class="col-md-4">
                                        <div class="d-flex">
                                            <p class="text-nowrap  width-p">Date of Birth</p>
                                            <p class="px-2">:</p>
                                            <p class="text-white">${
                                                data.date_of_birth
                                            }</p>
                                        </div>
                                        <div class="d-flex">
                                            <p class="text-nowrap width-p" vslang="titles.Joining Date">Joining Date</p>
                                            <p class="px-2">:</p>
                                            <p class="text-nowrap text-" style="color:#cab54a;">${
                                                data.joining_date
                                            }</p>
                                        </div>
                                        <div class="d-flex">
                                            <p class="text-nowrap width-p">salary</p>
                                            <p class="px-2">:</p>
                                            <p class="text-white">
                                                ${VSMoney.formatAmount(data.salary, data.currency_code)}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="d-flex">
                                            <P class="text-nowrap  width-p">Work Shift</p>
                                            <P class="px-2">:</p>
                                            <P class="text-white">${
                                                data.work_shift
                                            }</p>
                                        </div>
                                        <div class="d-flex">
                                            <P class="text-nowrap  width-p">Payroll Tax</p>
                                            <P class="px-2">:</p>
                                            <P class="text-nowrap" style="color:#cab54a;">${data.apply_payroll_tax == "0" ? "Have Tax": ""}${data.apply_payroll_tax == "1" ? "Non Tax" : ""}</p>
                                        </div>
                                        <div class="d-flex">
                                            <P class="text-nowrap width-p" vslang="titles.Address">Address</p>
                                            <P class="px-2">:</p>
                                            <P class="text-nowrap" style="color:#cab54a;">${
                                                data.address
                                            }</p>
                                        </div>
                                    </div>



                                    <div class="col-md-4">
                                        <div class="d-flex justify-content-center gap-4 mt-2">
                                            <a href="javascript:void(0)" class="edit_emp_profile_info" data-id="${
                                                data.id
                                            }" data-status ="${data.status_id}">
                                                <i class="fa-regular fa-pen-to-square  fs-4 tool-tip" style="color:#fff;"><span class="tool-tiptext fs-6">Edit Profile</span></i>
                                            </a>
                                            <a href="javascript:void(0)" class="delete_employee" data-id="${
                                                data.id
                                            }" data-status ="${data.status_id}">
                                                <i class="fa-solid fa-user-xmark fs-4 tool-tip" style="color:#e21f2c;"><span class="tool-tiptext fs-6">Delete</span></i>
                                            </a>
                                            <a href="javascript:void(0)" class="set_resign" data-id="${
                                                data.id
                                            }" data-status ="${data.status_id}">
                                                <i class="fa-solid fa-circle-exclamation tool-tip fs-4" style="color:#efc84a;"><span class="tool-tiptext fs-6">Set Resign</span></i>
                                            </a>
                                            <a href="javascript:void(0)" class="movement" data-id="${
                                                data.id
                                            }" data-status ="${data.status_id}">
                                                <i class="fa-brands fa-stack-exchange tool-tip fs-4" style="color:#05ff77"><span class="tool-tiptext fs-6">movement</span></i>
                                            </a>

                                        </div>

                                </div>`,
                            `</div>`,
                        `</div>`,
                    `</div>`,
                `</div>`,
            `</div>`,
        ].join("");

        mThis.profile_info_emp.innerHTML = html;
        // mThis.initDropdownMenusInfo(mThis.profile_info_emp);
        mThis.setActionsProfileInfo(mThis.profile_info_emp);
    };

    // mThis.initDropdownMenusInfo = (listContainer) => {
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

    // // *** NOTE: Previous code that causes BIG trouble
    // mThis.setActionsProfileInfo = () => {
    //     addEventListener("click", (e) => {
    //         let btn = VSUtil.closestLimited(e.target, ".edit_emp_profile_info");
    //         if (btn) {
    //             mThis.editEmployee(btn.dataset.id, btn);
    //         }
    //         btn = VSUtil.closestLimited(e.target, ".delete_employee");
    //         if (btn) {
    //             mThis.deleteEmployee(btn.dataset.id, btn);
    //         }
    //         btn = VSUtil.closestLimited(e.target, ".set_resign");
    //         if (btn) {
    //             mThis.setResign(btn.dataset.id, btn);
    //         }
    //         btn = VSUtil.closestLimited(e.target, ".movement");
    //         if (btn) {
    //             mThis.movement(btn.dataset.id, btn);
    //         }
    //     });
    // };

    mThis.setActionsProfileInfo = (divProfile) => {
        divProfile.addEventListener('click', (e) => {
            let btn = VSUtil.closestLimited(e.target, ".edit_emp_profile_info");
            if (btn) {
                mThis.editEmployee(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".delete_employee");
            if (btn) {
                mThis.deleteEmployee(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".set_resign");
            if (btn) {
                mThis.setResign(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".movement");
            if (btn) {
                mThis.movement(btn.dataset.id, btn);
                return;
            }
        });
    };

    mThis.renderCardLeft = (employeeId) => {
        let p = {
            emp_id: employeeId,
        };
        let cmt = 0;

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
                    <div class="card" style="height:260px;">
                        <div class="card-header bg-primary-custom text-white">
                            <h6 class="mt-1">Skill</h6>
                            <div class="d-flex gap-2">
                                <a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-skill">
                                    (<i class="fa fa-plus-circle fs-7"></i>)
                                </a>
                            </div>
                        </div>
                        <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                        <div class="rounded-2" style="background-color:#dce5e5";>
                        <table class="table table-sm">
                            <thead class="">
                                <tr>
                                    <th style="color:#2b3991; font-size:12px;">Skill</th>
                                    <th style="color:#2b3991; font-size:12px;">Rate</th>
                                    <th style="color:#2b3991; font-size:12px;" class="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.map((d) => {
                    html =[html,`<tr>
                            <td>
                                <img class="bhr-icons me-2" src="${main_view.asset_url}/images/icons/skill.png" />
                                <small>${d.skill}</small>
                            </td>
                            <td>
                                <img class="bhr-icons me-2" src="${main_view.asset_url}/images/icons/rate.png" />
                                <small>${d.rate} %</small>
                            </td>
                            <td class="text-end">
                                <a href="javascript:void(0)" data-id="${d.id}" class="lnk-edit-skill me-2">
                                    <small><i class="fa-regular fa-pen-to-square fs-7 text-primary"></i></small>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-emp-id="${employeeId}" class="lnk-delete-skill">
                                    <small><i class="fa-solid fa-x fs-7 text-danger"></i></small>
                                </a>
                            </td>
                        </tr>
                    `].join('');
                    cmt++;
                });
                if(cmt === 0){
                    html += `<table class="table-sm"><thead><tbody><div class="w-100  text-center"><small class="rounded-5 bg-white p-1 px-3" >No data available.</small></div></tbody></thead></table>`;

                }

                html += `</tbody></table></div></div></div>`;
                mThis.profile_card_left.innerHTML = html;

                document
                    .querySelector(".lnk-add-skill")
                    .addEventListener("click", function (e) {
                        e.preventDefault();

                        let btn = document.querySelector(
                            ".lnk-add-skill"
                        );

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

                document
                    .querySelectorAll(".lnk-edit-skill")
                    .forEach((btn) => {
                        btn.addEventListener("click", function (e) {
                            e.preventDefault();
                            const id = e.target
                                .closest("a")
                                .getAttribute("data-id");
                            console.log(123,id);


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
                                "Delete this skill?",
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
                                                        "Deleted successfully"
                                                    );
                                                    // EmployeeComponent.EmployeeListView.showPage();
                                                    EmployeeComponent.renderCardLeft(
                                                        emp_id
                                                    );
                                                }
                                                else {
                                                    cv_interact.error(res.message);
                                                }
                                            });
                                    }
                                }
                            );
                        });
                    });
            });
    };

    // mThis.formatPeriod_exp =(d)=>{
    //    if(!d) return '';
    //    if(d.start_date && d.end_date) return [d.start_date, ' to ', d.end_date].join('');
    //    else if (d.period) return d.period;
    // }

    // mThis.formatPeriod_edu = (finish_year, period)=>{
    //     period = period || '';
    //     let sts = period.split('to');
    //     if(!sts[1]){
    //          sts = period.split('-');
    //     }
    //     const start = sts[0];
    //     const end = sts[1];
    //     if (!finish_year || finish_year =='') finish_year = end;
    //     if (sts[1]){
    //         return [start,' to ', end].join('');
    //     }else{
    //         return [start, ' until now'].join('');
    //     }
    // }

    mThis.formatFinishYear = (finish_year, period) =>{
        period = period || '';
        let sts = period.split('to');
        if(!sts[1]){
             sts = period.split('-');
        }
        const end = sts[1];
        if (sts[1]){
            return sts[1];
        }else{
            return finish_year? finish_year: '';
        }
    }

    mThis.renderCardCenter = (employeeId) => {
        const p = {
            emp_id: employeeId,
        };
        let cmt = 0;
        vsapi
            .call(
                `${main_view.base_url}/hr/education/list-all`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                const data = res.status_code === 200 ? res.data.data : [];
                let html = `<div class="card" style="height:260px;">
                <div class="card-header text-white bg-primary-custom">
                    <div class="d-flex gap-2">
                        <h6 class="mt-1">Education</h6>
                        <a href="javascript:void(0)" id="lnk_add_education">
                            (<i class="fa fa-plus-circle fs-7"></i>)
                        </a>
                    </div>
                    <div class="d-flex gap-2">
                        <h6 class="mt-1">School</h6>
                        <a href="javascript:void(0)" id="add_school">
                            (<i class="fa fa-plus-circle fs-7"></i>)
                        </a>
                    </div>
                </div>
                <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
            `;

                data.forEach((d) => {
                    html =[html,`
                <div class="row pt-2 border-bottom border-white education-item">
                    <div class="col-md-12 pb-2">
                        <div class="d-flex justify-content-between">
                            <h6 style="color:#2b3991;">${d.period}</h6>
                            <span class="text-nowrap text-dark" style="color:#2b3991;">${d.school}</span>
                        </div>
                        <p class="text-muted mb-0">
                            <img class="bhr-icons" src="${main_view.asset_url}/images/bhr/school_new.svg" /> <span>${d.edu_level}</span>
                        </p>
                        <div class="d-flex justify-content-between mt-1">
                            <span style="color:#cab54a;">
                                <img class="bhr-icons" src="${main_view.asset_url}/images/bhr/baggage-claim.svg" /><small> ${d.major} </small>
                            </span>
                            <div class="justify-content-end gap-2 action-buttons d-none">
                                <a href="javascript:void(0)" data-id="${d.id}" class="btn-education-modify">
                                    <small><i class="fa-regular fa-pen-to-square fs-7 text-primary"></i></small>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-empid="${employeeId}" class="btn-education-delete">
                                    <small><i class="fa-solid fa-x fs-7 text-danger"></i></small>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                `].join('');
                cmt++;
                });
                if(cmt === 0){
                    html += `<div class="w-100  text-center"><small class="rounded-5 bg-white p-1 px-3" >No data available.</small></div><hr class="bg-dark">`;

                }

                html += `</div></div>`;
                mThis.profile_card_center.innerHTML = html;

                document.querySelectorAll(".education-item").forEach((item) => {
                    item.addEventListener("mouseover", () => {
                        const actions = item.querySelector(".action-buttons");
                        if (actions) {
                            actions.classList.remove("d-none");
                            actions.classList.add('d-flex');
                        }
                    });

                    item.addEventListener("mouseout", () => {
                        const actions = item.querySelector(".action-buttons");
                        if (actions) {
                            actions.classList.add("d-none");
                            actions.classList.remove('d-flex');

                        }
                    });
                });


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
                            cv_interact.confirm(
                                "Delete this education?",
                                {
                                    title: "Delete Education",
                                    context: "delete",
                                    confirmButtonText: "Delete",
                                },
                                function (confirmDelete) {
                                    if (confirmDelete) {
                                        vsapi
                                            .call(
                                                `${main_view.base_url}/hr/education/delete`,
                                                { id: id },
                                                false,
                                                false,
                                                false
                                            )
                                            .then((res) => {
                                                if (res.status_code == 200) {
                                                    cv_interact.success(
                                                        "Deleted successfully"
                                                    );
                                                    EmployeeComponent.renderCardCenter(
                                                        emp_id
                                                    );
                                                } else {
                                                    cv_interact.error(
                                                        "Failed to delete the education."
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

                // Add delete functionality
                // document
                //     .querySelectorAll(".btn-education-delete")
                //     .forEach((btn) => {
                //         btn.addEventListener("click", function (e) {
                //             e.preventDefault();

                //             // Confirm delete action
                //             if (
                //                 confirm(
                //                     "Are you sure you want to delete mThis record?"
                //                 )
                //             ) {
                //                 // Get the correct data-id
                //                 let educationId = mThis.getAttribute("data-id");

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
                document
                    .getElementById("add_school")
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
                        AddSchool.show(op);
                    });
            });
    };

    mThis.renderCardRight = (employeeId) => {
        let p = {
            emp_id: employeeId,
        };
        let cmt = 0;

        vsapi
            .call(
                `${main_view.base_url}/hr/experience/list-all`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let data = res.status_code === 200 ? res.data : [];
                let html = `<div class="card" style="height:260px;">
                <div class="card-header text-white bg-primary-custom">
                    <h6 class="mt-1">Experience</h6>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" id="lnk_add_experience">
                           (<i class="fa fa-plus-circle fs-7 "></i>)
                        </a>
                    </div>
                </div>
                <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.forEach((d) => {
                    html =[html,`
                <div class="row pt-2 border-bottom border-white experience-item">
                    <div class="col-md-12 mb-2">
                        <div class="d-flex justify-content-between">
                            <h6 class="text-dark text-nowrap"> ${d.organization_id}</h6>
                            <div class="justify-content-end gap-2 action-buttons d-none">
                                <a href="javascript:void(0)" data-id="${d.id}" class="btn-experience-modify">
                                    <small><i class="fa-regular fa-pen-to-square fs-7 text-primary"></i></small>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-empid="${employeeId}" class="btn-experience-delete">
                                    <small><i class="fa-solid fa-x fs-7 text-danger"></i></small>
                                </a>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <h6 style="color:#2b3991;">${d.position}</h6>
                            <small class="text-muted" style="color:#3b3a36;">${d.period}</small>
                        </div>
                        <small class="pb-1 d-block" style="color:#293536;"> ${d.description || ''} </small>


                    </div>
                </div>
                    `].join('');
                    cmt++;
                });
                if(cmt === 0){
                    html += `<div class="w-100  text-center"><small class="rounded-5 bg-white p-1 px-3" >No data available.</small></div><hr class="bg-dark">`;

                }

                html += `</div></div>`;
                mThis.profile_card_right.innerHTML = html;
                document.querySelectorAll(".experience-item").forEach((item) => {
                    item.addEventListener("mouseover", () => {
                        const actions = item.querySelector(".action-buttons");
                        if (actions) {
                            actions.classList.remove("d-none");
                            actions.classList.add('d-flex');
                        }
                    });

                    item.addEventListener("mouseout", () => {
                        const actions = item.querySelector(".action-buttons");
                        if (actions) {
                            actions.classList.add("d-none");
                            actions.classList.remove('d-flex');

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
                                "Delete this experience?",
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
                                                        "Deleted successfully"
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

    mThis.renderCardTaxAllowance = (employeeId) => {
        const p = { emp_id: employeeId };
        let cmt = 0;
        vsapi
            .call(
                `${main_view.base_url}/hr/tax-allowance/list-all`,
                p,
                false,
                false,
                false
            )
            .then((res) => {
                const data = res.status_code === 200 ? res.data : [];

                let html = [
                    '<div class="card" style="height:260px;">',
                        '<div class="card-header bg-primary-custom text-white">',
                            '<h6 class="mt-1">Tax Allowance </h6>',
                            '<div class="d-flex"><a href="javascript:void(0)" data-empid="',employeeId,'" class=" lnk-add-tax-allowance">(<i class="fa fa-plus"></i>)</a></div>',

                        '</div>',
                        '<div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">',
                        '<div class="">',
                        '<table class="table table-sm">',
                            '<thead class="">',
                               '<tr>',
                                    //'<th style="color:#2b3991; font-size:12px;"></th>',
                                    '<th style="color:#2b3991; font-size:12px;">Qty</th>',
                                    '<th style="color:#2b3991; font-size:12px;">Unit Amt</th>',
                                    '<th style="color:#2b3991; font-size:12px;">Allowance</th>',
                                    '<th style="color:#2b3991; font-size:12px;">Action</th>',
                                '</tr>',
                            '</thead>',
                            '<tbody>'
                ].join('');

                data.map((d,index,i) => {
                    html += `
                        <tr>
                            <td><small>${d.qty}</small></td>
                            <td>
                                <small>
                                    ${VSMoney.formatAmount(d.amount,d.currency_code)}
                                </small>
                            </td>
                            <td>
                                <small>
                                    ${VSMoney.formatAmount(d.allowance,d.currency_code)}
                                </small>
                            </td>
                            <td class="text-start">
                                <a href="javascript:void(0)" data-id="${d.id}" class="lnk-edit-tax-allowance me-2">
                                    <small><i class="fa-regular fa-pen-to-square fs-7 text-primary"></i></small>
                                </a>
                                <a href="javascript:void(0)" data-id="${d.id}" data-emp-id="${employeeId}" class="lnk-delete-tax-allowance">
                                    <small><i class="fa-solid fa-x fs-7 text-danger"></i></small>
                                </a>
                            </td>
                        </tr>`;
                    cmt++;
                });

                if(cmt === 0){
                    html += `<table><tbody><div class="w-100  text-center"><small class="rounded-5 bg-white p-1 px-3" >No data available.</small></tbody></table></div>`;

                }


                html += `</tbody></table></div></div></div>`;
                mThis.tax_allowance_card.innerHTML = html;

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
                                "Delete this tax allowance?",
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
                                                        "Deleted successfully"
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

    mThis.renderEmpDocuments = (employeeId) => {
        let p = { emp_id: employeeId };
        let cmt = 0 ;

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
                    <div class="card" style="height:260px;">
                        <div class="card-header bg-primary-custom text-white">
                            <h6 class="mt-1">Document</h6>
                            <div class="d-flex"><a href="javascript:void(0)" data-empid="${employeeId}" class="lnk-add-emp-document">(<i class="fa fa-plus"></i>)</a>
                            </div>
                        </div>
                        <div class="card-body" style="overflow-y: auto; overflow-x: hidden; scrollbar-width: none;">
                `;

                data.map((d) => {
                    html = [
                        html,
                        `
                        <div class="row mt-2 border-bottom border-white">
                            <div class="col-md-12">
                                <div class="d-flex justify-content-between">
                                    <h6 style="color:#2b3991;">${d.name}</h6>
                                </div>
                                <small class="text-nowrap pb-1 d-block">
                                    <img class="bhr-icons" src="${main_view.base_url}/assets/images/bhr/folder.png" alt="" />
                                    ${d.file_name}
                                </small>
                                <div class="d-flex justify-content-end gap-2">
                                    <a href="${main_view.base_url}/hr/emp-document/download/${d.id}"
                                       class="lnk-download-emp-document"
                                       target="_blank"
                                       download="${d.file_name}">
                                    <a href="${d.file_url}"
                                       class="lnk-download-emp-document"
                                       target="_blank"
                                       download="${d.name}">
                                        <i class="fa fa-download fs-7 text-primary"></i>
                                    </a>
                                    <a href="javascript:void(0)"
                                       data-id="${d.id}"
                                       data-emp-id="${employeeId}"
                                       class="lnk-delete-emp-document ms-2">
                                       <i class="fa-regular fa-trash-can fs-7 text-danger"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        `,
                    ].join('');
                    cmt++;
                });

                if(cmt === 0){
                    html += `<div class="w-100  text-center"><small class="rounded-5 bg-white p-1 px-3" >No data available.</small></div><hr class="bg-dark">`;

                }

                html += `</div></div>`;
                mThis.emp_documents_card.innerHTML = html;

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
                                                        "Deleted successfully"
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

    mThis.movement = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.MovementDialog = mThis.MovementDialog || new GeneralDialog({
            title: LocaleManager.trans("Movement", "titles"),
            cssClass: "modal-lg",
            createContent: () => {
                return `
                    <div id="movement-options">
                        <div class="d-flex align-items-center gap-3 border-bottom ">
                            <input data-target="div_branch" name="change_branch" class="mb-2 change-option" type="checkbox" value="branch" />
                            <label for="change_branch" class="text-primary-custom">Change Branch</label>

                            <input data-target="div_position" name="change_position" class="mb-2 change-option data-input" data-field="position_id" type="checkbox"  value="position" />
                            <label for="change_position" class="text-primary-custom">Change Position</label>

                            <input data-target="div_salary" name="change_salary" class="mb-2 change-option" type="checkbox"  value="salary" />
                            <label for="change_salary" class="text-primary-custom">Change Salary</label>
                        </div>
                    </div>

                    <div name="div_branch" class="p-3  branch" style="display:none;">
                        <div class="row">
                            <div class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Current Branch"></label>
                                <span class="text-danger" >*</span>
                                <select name="branch" id="branch" class="form-control data-input" data-field="branch_id" disabled>

                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label class="form-label" vslang="titles.To Branch"></label>
                                <span class="text-danger" >*</span>
                                <select name="to_branch" id="to_branch" class="form-control data-input" data-field="to_branch_id" >

                                </select>
                            </div>
                            <div class=" form-group col-md-3">
                                <label class="form-label" vslang="titles.Effective Date">Effective Date</label>
                                <span class="text-danger" >*</span>
                                <input  name="effective_date" class="form-control data-input" data-field="effective_date"></input>
                            </div>
                            <div id="remarks" class="form-group col-md-3">
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
                                <select name="position" id="position" class="form-control data-input" data-field="position_id" disabled>

                                </select>
                            </div>
                             <div class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Change Position"></label>
                                <span class="text-danger" >*</span>
                                <select name="to_position" id="to_position" class="form-control data-input" data-field="to_position_id">

                                </select>
                            </div>
                              <div class=" form-group col-md-3">
                                <label class="form-label" vslang="titles.Start Date">Start Date</label>
                                <span class="text-danger" >*</span>
                                <input  name="start_date" class="form-control data-input" data-field="start_date"></input>
                            </div>
                            <div id="remarks" class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Remarks"></label>
                                <input name="position_remarks" class="form-control data-input" placeholder="" data-field="remarks" />
                            </div>
                        </div>
                    </div>


                    <div name="div_salary" class="p-2" style="display:none;">
                        <div class="row">
                            <div id="salary" class="form-group col-md-3">
                                <label class="form-label" vslang="titles.Original Salary"></label>
                                <input name="org_salary" class="form-control  data-input" placeholder="" data-field="salary" readonly/>
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
                    div.querySelectorAll("input.change-option").forEach((input) => {
                        console.log('hh1: ',input);
                        input.onchange = e => {
                            e.preventDefault();
                            console.log('change_d:1');
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
                    name: "to_branch",
                    data: "branches",
                    textField: "branch_name",
                    valueField: "id",
                },
                {
                    name: "to_position_id",
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
                        const p = me.getData();
                        p.emp_id = op.id;
                        const d = {};
                        d.emp_id = p.emp_id;
                        let change_branch = {},
                            change_position = {},
                            change_salary = {};

                        if (me.controls.change_branch.checked) {
                            change_branch.branch_id = p.branch_id || null;
                            change_branch.to_branch_id = p.to_branch_id || null;

                            change_branch.remarks =
                                me.controls.branch_remarks.value;
                            change_branch.effective_date = p.effective_date;
                        }
                        if (me.controls.change_position.checked) {
                            change_position.position_id = p.position_id;
                            change_position.to_position_id = p.to_position_id;
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

                        vsapi
                            .call(
                                `${main_view.base_url}/hr/staff-promotion/promote`,
                                d,
                                btn,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    cv_interact.success(
                                        "This employee has been promoted successfully!"
                                    );
                                    EmployeeComponent.self.querySelector('#_btn_backTo_employee').click();;
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "Employee Movement",
                modifyTitle: "Edit Movement",
                targetProp: "employee",
                api: {
                    endpoint: `${main_view.base_url}/hr/employee/form-options`,

                    params: (op) => {
                        return { id: op.id };
                    },
                    onResponse: (me, res) => {
                        console.log(123,me,321,res);

                    },
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                const op = {id: me.dataOptions.id};

                    vsapi.call(`${main_view.base_url}/hr/staff-promotion/form-options`,op,null,null).then((res) => {
                    const d = res.status_code == 200 ? res.data : {};
                        VSUtil.setComboItems(me.controls.branch,d.branches,"id","branch_name",null,null,d.employee.branch_id);
                        VSUtil.setComboItems(me.controls.position,d.positions,"id","title",null,null,d.employee.position_id);
                        me.controls.org_salary.value = d.employee.salary;

                    });
                // me.controls.branch.value = data.employee.branch_id;
                // me.controls.position.value = data.employee.position_id;
                // me.controls.org_salary.value = data.employee.salary;
                const divModal = me.divModal;
                divModal.querySelectorAll("input.change-option").forEach((input) => {
                    input.checked = false;
                    const divTarget = me.controls[input.dataset.target];
                    if (divTarget) {
                        divTarget.style.display = input.checked
                            ? "block"
                            : "none";
                    }
                });

                //me.setEvent(divModal);

            },
        });
        mThis.MovementDialog.show(op);
    };

    mThis.setResign = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.ResignDialog = mThis.ResignDialog || new GeneralDialog({
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
                                        "This employee has been resign successfully!"
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

    mThis.promoteToStaff = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };

        mThis.PromoteDialog = mThis.PromoteDialog || new GeneralDialog({
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
                        return { id: op.id };
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
                                `${main_view.base_url}/hr/non-staff-promotion/promote`,
                                p,
                                btn,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.modal.hide(true, p);
                                    cv_interact.success(
                                        "This employee has been promoted successfully!"
                                    );
                                    EmployeeComponent.EmployeeListView.showPage(EmployeeComponent.getFilterData());
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

    mThis.setTerminated = (id, lnk) => {
        let tr = lnk.closest("tr");
        const status_id = Validator.properCase(tr ? tr.dataset.status_id : "");

        const inputOptions = {
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
                const p = {
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
                                "The employee has been terminate"
                            );
                            // if(tr) tr.dataset.status_id = d.value;
                            // mThis.EmployeeListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
                    });
            }
        });
    };

    mThis.setRejoin = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            },
        };
        mThis.RejoinDialog = mThis.RejoinDialog || new GeneralDialog({
            title: LocaleManager.trans("Set Rejoin", "titles"),
            createContent: () => {
                return [
                    ` <div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Resign Date">Rejoin Date</label>
                            <div><input name="rejoin_date" class="form-control data-input" placeholder="" data-field="rejoin_date"/></div>
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
                                        "This employee has been join successfully!"
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
    mThis.editEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            },
        };
        EmployeeDialog.show(op);
    };
    mThis.CreateContract = (id) => {
        if(!mThis.el_branch.value ){
            cv_interact.error('Branch is empty. Please select branch!');
            return;
        }
        const op = {
            id:mThis.el_branch.value,
            emp_id: id,
            // branch_id: mThis.el_branch.value,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            },
        };

        CreateContractDialog.show(op);

        // const queryString = new URLSearchParams(op).toString();
        // const url = `${main_view.base_url}/create-contract?${queryString}`;

        // window.open(url, '_blank', 'noopener,noreferrer');
    };


    mThis.deleteEmployee = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this employee?",
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
                                cv_interact.success("Deleted successfully");
                                EmployeeComponent.self.querySelector('#_btn_backTo_employee').click();
                            }else cv_interact.error(res.error_message);

                        });
                }
            }
        );
    };

    mThis.prepareFormOptions = () => {
        // mThis.def_filter = mThis.def_filter || {};
        // mThis.def_filter.id = 10;
        // mThis.allow_filter = false;
        vsapi.call(`${main_view.base_url}/hr/employee/form-options`,null,null,null).then((res) => {
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

    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.EmployeeListView.showPage(mThis.getFilterData());
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);

    };
    return mThis;
})();

const AddEducation = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
                title: op.id ? "Edit Education" : "New Education",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="row">
                        <div class=" form-group col-md-12">
                            <label class="form-label" vslang="titles.School">School</label>
                            <span class="text-danger" >*</span>
                            <div><select name="school_id" class="data-input" data-field="school_id"></select></div>
                        </div>
                        <div class=" form-group col-md-12">
                            <label class="form-label" vslang="titles.Level">Level</label>
                            <span class="text-danger" >*</span>
                            <div><select name="edu_level_id" class="data-input" data-field="edu_level_id"></select></div>
                        </div>`,
                        `<div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Start Year">Start Year</label>
                            <div><input name="start_year" class="form-control data-input" data-field="start_year"/></div>
                        </div>`,
                        `<div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Finish Year">Finish Year</label>
                            <div><input name="finish_year" class="form-control data-input" data-field="finish_year"/></div>
                        </div>`,
                        // `<div class="form-group col-md-6">
                        //     <label class="form-label" vslang="titles.Period">Period</label>
                        //     <div><input name="period" class="form-control data-input" placeholder="(2020-2024)" data-field="period"/></div>
                        // </div>`,
                        `<div class="form-group col-md-12">
                            <label class="form-label" vslang="titles.Major">Major</label>
                            <div><input name="major" class="form-control data-input" data-field="major"/></div>
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
                        label: '<span><i class="fa-solid text-danger fa-xmark"></i></span>' ,
                        cssClass: "btn btn-sm btn-outline",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span><i class="fa-solid text-success fa-check"></i></span>',
                        cssClass: "btn btn-sm btn-outline",
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
const AddSchool = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
                title: op.id ? "Edit School" : "New School",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="form-group">
                            <label class="form-label" vslang="titles.School Name">School Name</label>
                            <div><input name="school_name" class=" form-control data-input" data-field="name"></input></div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" vslang="titles.Location">Location</label>
                            <div><input name="location" class=" form-control data-input" data-field="location"></input></div>
                        </div>
                        `,
                    ].join("");
                },
                // contentCreated: (me) => {
                //     DateTimePicker.init(me.controls.established_year);
                // },
                buttons: [
                    {
                        label: '<span><i class="fa-solid text-danger fa-xmark"></i></span>',
                        cssClass: "btn btn-sm btn-outline",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span><i class="fa-solid text-success fa-check"></i></span>',
                        cssClass: "btn btn-sm btn-outline",
                        click: (me) => {
                            let p = me.getData();
                            p.emp_id = me.dataOptions.emp_id;
                            console.log(11, p);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/school/save",
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
                prepareFormOptions: {
                    createTitle: "New School",
                    modifyTitle: "Edit School",
                    targetProp: "education",
                    api: {
                        endpoint: `${main_view.base_url}/hr/school/form-options`,
                        params: (op) => {
                            return { id: op.id };
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
                        <div class=" form-group col-md-12">
                            <label class="form-label" vslang="titles.Period (if no dates)">Period</label>
                            <div><input name="period" class="form-control data-input" data-field="period"></input></div>
                        </div>
                        <div class=" form-group col-md-6">
                            <label class="form-label" vslang="titles.Position">Position</label>
                            <div><input name="position" class="data-input form-control" data-field="position" /></div>
                        </div>
                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Organization">Organization</label>
                            <div><select name="organization_id" class="form-control data-input" data-field="organization_id"></select></div>
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

                        <div class="form-group col-md-4">
                            <label class="form-label" vslang="titles.Amount">Amount</label>
                            <div><input name="amount" class="form-control data-input" data-field="amount"/></div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="form-label" vslang="titles.Amount">Quantity</label>
                            <div><input name="qty" class="form-control data-input" data-field="qty"/></div>
                        </div>
                        <div class="form-group col-4">
                            <label for="currency_code" class="form-label" vslang="titles.Currency">Currency</label>
                            <select id="currency_code" class="modal-select data-input" name="currency_code" data-field="currency_code">
                                <option value="${main_view.base_currency}">${main_view.base_currency}</option>
                                <option value="USD">USD</option>
                            </select>
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
                // configSelect: [

                //     {
                //         name: "currency_code",
                //         data: "currency_codes",
                //         textField: "code",
                //         valueField: "code",
                //     }
                // ],
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

        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    '<div class="row">',
                        '<div class="col-3">',
                            '<div style="height:165px;" class="data-input border border-secondary rounded-3 justify-content-center align-items-center">',
                                '<div name="div_emp_photo" data-field="photo" class="h-100"></div>',
                            '</div>',
                        '</div>',
                        '<div class="col-9">',
                            '<div class="row">',
                                '<div class="form-group col-6">',
                                    '<label for="name" class="form-label text-primary-custom" vslang="titles.Name"></label>',
                                    '<span class="text-danger">*</span>',
                                    '<input name="name" class="form-control data-input" data-field="name"/>',
                                '</div>',
                                '<div class="form-group col-6">',
                                    '<label for="name_kh" class="form-label text-primary-custom" vslang="titles.Khmer Name"></label>',
                                    '<span class="text-danger">*</span>',
                                    '<input name="name_kh" class="form-control data-input" data-field="name_kh" />',
                                '</div>',
                                '<div class="form-group col-4">',
                                    '<label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>',
                                    '<select class="form-control data-input" data-field="sex">',
                                        '<option value="">(Select Sex)</option>',
                                        '<option value="M">Male</option>',
                                        '<option value="F">Female</option>',
                                        '<option value="O">Other</option>',
                                    '</select>',
                                '</div>',
                                '<div class="form-group col-4">',
                                    '<label for="marital_status" class="form-label text-primary-custom" vslang="titles.Marital Status"></label>',
                                    '<span class="text-danger">*</span>',
                                    '<select name="marital_status" class="form-control data-input" data-field="marital_status">',
                                        '<option value="Single">Single</option>',
                                        '<option value="Married">Married</option>',
                                        '<option value="Divorced">Divorced</option>',
                                        '<option value="Not Disclosed">Not Disclosed</option>',
                                    '</select>',
                                '</div>',
                                '<div class="form-group col-4">',
                                    '<label for="date_of_birth" class="form-label text-primary-custom" vslang="titles.Date Of Birth"></label>',
                                    '<span class="text-danger">*</span>',
                                    '<input name="date_of_birth"  class="form-control data-input" data-field="date_of_birth" />',
                                '</div>',
                                '<hr style="border: none; border-top: 2px solid #6e7272;"></hr>',

                            '</div>',

                        '</div>',

                        '<div class="row">',
                            '<div class="form-group col-4">',
                                '<label for="nationality" class="form-label text-primary-custom" vslang="titles.Nationality"></label>',
                                '<span class="text-danger">*</span>',
                                '<select name="nationality_id" class="form-control data-input" data-field="nationality_id"></select>',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="nid" class="form-label text-primary-custom" vslang="titles.Identity Card"></label>',
                                '<span class="text-danger">*</span>',
                                '<input name="nid" class="form-control data-input" data-field="nid" placeholder="CAM100001" />',
                            '</div>',

                            '<div class="form-group col-4">',
                                '<label for="nid_expiry_date" class="form-label text-primary-custom" vslang="titles.Identity Card Expiry"></label>',
                                '<span class="text-danger" >*</span>',
                                '<input name="nid_expiry_date" class="form-control  data-input" data-field="nid_expiry_date" />',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="nssf_id" class="form-label text-primary-custom" vslang="titles.NSSF ID"></label>',
                                '<input name="nssf_id" class="form-control data-input" data-field="nssf_id" placeholder="NSSF100001" />',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="passport_number" class="form-label text-primary-custom" vslang="titles.Passport Number"></label>',
                                '<input name="passport_number" class="form-control data-input" data-field="passport_number" />',
                            '</div>',

                            '<div class="form-group col-4">',
                                  '<label for="passport_expiry_date" class="form-label text-primary-custom" vslang="titles.Passport Expiry"></label>',
                                    '<span class="text-danger" >*</span>',
                                    '<input name="passport_expiry_date" class="form-control  data-input" data-field="passport_expiry_date" />',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="birth_city_id" class="form-label text-primary-custom" vslang="titles.Place of Birth"></label>',
                                '<select name="birth_city_id" class="form-control data-input" data-field="birth_city_id"></select>',
                            '</div>',

                            '<div class="form-group col-4">',
                                '<label for="type" class="form-label text-primary-custom" vslang="titles.Employee Type"></label>',
                                '<span class="text-danger">*</span>',
                                '<select name="type" class="form-control data-input" data-field="emp_type_id"></select>',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="position" class="form-label text-primary-custom" vslang="titles.Position"></label>',
                                '<span class="text-danger">*</span>',
                                '<select name="position" class="form-control data-input" data-field="position_id"></select>',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="phone_number" class="form-label text-primary-custom" vslang="titles.Phone"></label>',
                                '<span class="text-danger">*</span>',
                                '<input name="phone_number" class="form-control data-input" data-field="phone_number" />',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="email" class="form-label text-primary-custom" vslang="titles.Email"></label>',
                                '<span class="text-danger">*</span>',
                                '<input type="email" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />',
                            '</div>',

                            '<div class="form-group salary col-4">',
                                '<label for="salary" class="form-label text-primary-custom" vslang="titles.salary"></label> <span>(',VSMoney.symbol,')</span>',
                                '<input name="salary" id="salary" class="form-control  data-input"  data-field="salary" />',
                            '</div>',
                            '<div class="form-group col-6">',
                                '<label for="work_shift" class="form-label text-primary-custom" vslang="titles.Work Shift"></label>',
                                '<span class="text-danger">*</span>',
                                '<select name="work_shift" class="form-control data-input" data-field="work_shift_id"></select>',
                            '</div>',
                           '<div class="form-group col-6">',
                                '<label for="joining_date" class="form-label text-primary-custom" vslang="titles.Joining Date"></label>',
                                '<span class="text-danger">*</span>',
                                '<input name="joining_date"  class="form-control data-input" data-field="joining_date" />',
                            '</div>',

                            '<div class="form-group col-4">',
                                '<label for="spouse_name" class="form-label text-primary-custom" vslang="titles.Spouse Name"></label>',
                                '<input name="spouse_name" class="form-control data-input" data-field="spouse_name" />',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="spouse_emp_id" class="form-label text-primary-custom" vslang="titles.Spouse Employee"></label>',
                                '<select name="spouse_emp_id" class="form-control data-input" data-field="spouse_emp_id"></select>',
                            '</div>',
                            '<div class="form-group col-4">',
                                '<label for="spouse_occ_code" class="form-label text-primary-custom" vslang="titles.Spouse Occupation"></label>',
                                '<input name="spouse_occ_code" id="spouse_occ_code" class="form-control data-input" data-field="spouse_occ_code" />',
                            '</div>',
                            '<div class="form-group col-12">',
                                '<label for="address" class="form-label text-primary-custom" vslang="titles.Address">Address</label>',
                                '<textarea name="address" id="address" class="form-control data-input" data-field="address"></textarea>',
                            '</div>',
                        '</div>',
                    '</div>',
                ].join('');
            },
            contentCreated: (me) => {
                // const salary = me.divModal.querySelector(".salary");
                // console.log(123,salary);

                // salary.classList.add("d-none");
                //Convert field to be DatePicker : start_date and end_date
                DateTimePicker.init(me.controls.date_of_birth);
                DateTimePicker.init(me.controls.joining_date);
                DateTimePicker.init(me.controls.nid_expiry_date);
                DateTimePicker.init(me.controls.passport_expiry_date);
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
                           const answer = await cv_interact.confirm('Are you sure to delete mThis profile photo?', {title:'Delete Photo','context':'delete'});
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
                    firstOption: {"id": '',"name":"None"},
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
                            }else el.setAttribute('readonly',true);
                        }
                    }else{
                        if (el.tagName.toLowerCase() === "select") {
                            el.setAttribute("disabled", false);
                        }else el.removeAttribute('readonly');
                    }
                    el.value = data[name] ?? '';

                }

                    me.empImageBox.setImage(data.image_url);
                    me.controls.type.value = data.emp_type_id;
                },
            },
            buttons: [
                {
                    label: '<span class="text-white">Cancel</span>',
                    cssClass: "btn btn-sm btn-danger",
                    click: (me, btn) => {
                        //Close with Cancel button
                        me.hide(false);
                    },
                },
                {
                    label: "<span>Save</span>",
                    cssClass: "btn btn-sm btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();
                        // console.log(1234,JSON.stringify(p));

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
                                    if(me.dataOptions.id > 0)
                                    {
                                        cv_interact.success("Updated employee successfully");
                                        EmployeeComponent.self.querySelector('#_btn_backTo_employee').click();;
                                    }
                                    else{
                                        cv_interact.success("Added employee successfully");
                                    }
                                    //EmployeeComponent.btnBack.click();
                                    // EmployeeDialog.show(me.dataOptions);
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "Create Employee",
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
            //     if(me.dataOptions.id>0){
            //         me.controls.salary.setAttribute('readonly',true);


            // }else me.controls.salary.removeAttribute('readonly');

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

        dialog = dialog || new GeneralDialog({
                title: op.id ? "Add Skill" : " Edit Skill ",
                cssClass: "modal-md d-flex justify-content-center",
                createContent: () => {
                    return [
                        `<div class="row">

                        <div class="form-group col-md-6">
                            <label class="form-label" vslang="titles.Skill">Skill</label>
                             <select name="skill_id" class="data-input"  data-field="skill_id"></select>
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
                        name: "skill_id",
                        data: "skills",
                        textField: "skill",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span><i class="fa-solid text-danger fa-xmark"></i></span>' ,
                        cssClass: "btn btn-sm btn-outline",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span><i class="fa-solid text-success fa-check"></i></span>',
                        cssClass: "btn btn-sm btn-outline",
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
        dialog = dialog ||
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
                    // fileInput.onchange = (e) => {
                    //     const file = e.target.files[0];
                    //     if (file) {
                    //         const reader = new FileReader();
                    //         reader.onload = (event) => {
                    //             me.fileData = {
                    //                 file: event.target.result.split(",")[1], // Base64 content
                    //                 ext: file.name.split(".").pop(),
                    //                 name: file.name,
                    //             };
                    //             // document.getElementById("fileNameDisplay").textContent = `Selected file: ${file.name}`;
                    //         };
                    //         reader.readAsDataURL(file);
                    //     } else {
                    //         me.fileData = null;
                    //         document.getElementById("fileNameDisplay").textContent = "No file chosen";
                    //     }
                    // };
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
