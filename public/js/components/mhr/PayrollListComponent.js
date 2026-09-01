"use strict";

var PayrollListComponent = (()=> {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_payrollListComponent");
    
    mThis.title_prop = "payroll_list";
    mThis.elFilter = mThis.self.querySelector('#el_filter_payrollList');
    mThis.elFilterBranch = mThis.self.querySelector('#el_filter_branch');
    mThis.btnImport = mThis.self.querySelector("#_btnImport");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_payroll_list");
    mThis.btnCalculate = mThis.self.querySelector("#_btnCalculate");
    mThis.btnAuthorized = mThis.self.querySelector("#_btnAuthorized");
    mThis.btnBackToPayroll = mThis.self.querySelector("#_btnBackToPayroll");
    mThis.btnDisburse = mThis.self.querySelector("#_btnDisburse");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_payrollList");
    mThis.payment_info = mThis.self.querySelector("#payment_info");
    mThis.btnPrint = mThis.self.querySelector("#_print_pay_slip");
    mThis.btnReverse = mThis.self.querySelector("#_btnReverseTransactions");
    mThis.div_payrollList = mThis.self.querySelector('#_payrollList_list');
    mThis.btnIssues = mThis.self.querySelector("#_btn_issues");
    mThis.issues_list = mThis.self.querySelector("#_issues_list");

    mThis.cols = [
    // Row / Selection column
    {
        title: "",
        className: "align-middle text-center text-nowrap",
    },

    // Employee
    {
        transTitle: "titles.Employee",
        className: "align-middle text-nowrap",
        data: (data) => {
            const defaultImage =
                `${main_view.asset_url}/images/default/default-staff.png`;

            const imageUrl = data.image_url || defaultImage;

            return `
                <div class="d-flex align-items-center">
                    <img
                        src="${imageUrl}"
                        class="rounded-circle border shadow-sm me-3"
                        alt="${data.emp_name ?? "Employee"}"
                        style="width:42px;height:42px;object-fit:cover;"
                        onerror="this.src='${defaultImage}'"
                    >

                    <div class="d-flex flex-column">
                        <span class="text-prm-custom fw-medium text-nowrap">
                            ${data.emp_name ?? "-"}
                        </span>

                        <small class="text-muted text-nowrap">
                            ${data.emp_position ?? "-"}
                        </small>
                    </div>
                </div>
            `;
        },
    },

    // Base Salary
    {
        transTitle: "titles.Base Salary",
        className: "align-middle text-nowrap text-end",
        data: (data) => `
            <span class="text-prm-custom">
                ${VSMoney.formatAmount(
                    data.salary ?? 0,
                    data.currency_code
                )}
            </span>
        `,
    },

    // Taxable Benefits
    {
        transTitle: "titles.Taxable Benefits",
        className: "align-middle text-nowrap text-end",
        data: (data) => {
            const amount =
                data.taxable_benefit ??
                data.benefit_taxable ??
                0;

            return `
                <span class="text-prm-custom">
                    ${VSMoney.formatAmount(
                        amount,
                        data.currency_code
                    )}
                </span>
            `;
        },
    },

    // Non-Taxable Benefits
    {
        transTitle: "titles.Non-Taxable Benefits",
        className: "align-middle text-nowrap text-end",
        data: (data) => {
            const amount =
                data.nontaxable_benefit ??
                data.benefit_non_tax ??
                0;

            return `
                <span class="text-prm-custom">
                    ${VSMoney.formatAmount(
                        amount,
                        data.currency_code
                    )}
                </span>
            `;
        },
    },

    // Flat-Rate Benefits
    {
        transTitle: "titles.Flat-Rate Benefits",
        className: "align-middle text-nowrap text-end",
        data: (data) => {
            const usedAmount = data.used_amount;

            if (
                !usedAmount ||
                Object.keys(usedAmount).length === 0
            ) {
                return `
                    <span class="text-muted">
                        ${VSMoney.formatAmount(
                            0,
                            data.currency_code
                        )}
                    </span>
                `;
            }

            const details = Object.entries(usedAmount)
                .map(([taxRate, amount]) => {
                    return `
                        <div class="text-nowrap">
                            ${VSMoney.formatAmount(
                                amount ?? 0,
                                data.currency_code
                            )}
                            <small class="text-muted">
                                (${taxRate}%)
                            </small>
                        </div>
                    `;
                })
                .join("");

            return `
                <div class="text-prm-custom">
                    ${details}
                </div>
            `;
        },
    },

    // Deductions
    {
        transTitle: "titles.Deductions",
        className: "align-middle text-nowrap text-end",
        data: (data) => `
            <span class="text-danger">
                ${VSMoney.formatAmount(
                    data.deduction ?? 0,
                    data.currency_code
                )}
            </span>
        `,
    },

    // Tax Allowance
    {
        transTitle: "titles.Tax Allowance",
        className: "align-middle text-nowrap text-end",
        data: (data) => `
            <span class="text-prm-custom">
                ${VSMoney.formatAmount(
                    data.allowance ?? 0,
                    data.currency_code
                )}
            </span>
        `,
    },

    // Tax Rate
    {
        transTitle: "titles.Tax Rate",
        className: "align-middle text-nowrap text-center",
        data: (data) => `
            <span class="text-prm-custom">
                ${data.tax_rate ?? 0}%
            </span>
        `,
    },

    // Tax Offset / Bias
    {
        transTitle: "titles.Tax Offset / Bias",
        className: "align-middle text-nowrap text-end",
        data: (data) => `
            <span class="text-prm-custom">
                ${VSMoney.formatAmount(
                    data.bias ?? 0,
                    data.currency_code
                )}
            </span>
        `,
    },

    // Income Tax
    {
        transTitle: "titles.Tax Base",
        className: "align-middle text-nowrap text-end",
        data: (data) => `
            <span class="text-danger">
                ${VSMoney.formatAmount(
                    data.tax_base ?? 0,
                    data.currency_code
                )}
            </span>
        `,
    },

    // Benefit Tax
    {
        transTitle: "titles.Benefit Tax",
        className: "align-middle text-nowrap text-end",
        data: (data) => {
            const amount =
                data.benefit_tax ?? 0;

            return `
                <span class="text-danger">
                    ${VSMoney.formatAmount(
                        amount,
                        data.currency_code
                    )}
                </span>
            `;
        },
    },

    // Net Pay
    {
        transTitle: "titles.Net Pay",
        className: "align-middle text-nowrap text-end",
        data: (data) => {
            const isDisbursed =
                String(data.disbursed) === "1";

            return `
                <span class="fw-semibold ${
                    isDisbursed
                        ? "text-success"
                        : "text-prm-custom"
                }">
                    ${VSMoney.formatAmount(
                        data.total_salary ?? 0,
                        data.currency_code
                    )}
                </span>
            `;
        },
    },

    // Actions
    {
        transTitle: "titles.Actions",
        className: "col_action align-middle text-center",
        data: (data) => `
            <div class="d-flex justify-content-center align-items-center">
                <a
                    href="javascript:void(0)"
                    class="btn_payroll_list_action"
                    data-id="${data.id}"
                    data-empid="${data.emp_id}"
                    data-payrollid="${data.payroll_id}"
                    data-disbursed="${data.disbursed ?? 0}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    title="Actions"
                >
                    <i class="fa-solid fa-ellipsis-vertical fs-4 text-prm-custom"></i>
                </a>
            </div>
        `,
    },
];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollList_ListView = new ListView(mThis.div_payrollList,{
            fetchApi : `${main_view.base_url}/mhr/payroll/staff/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            rowCreated:(data,index,tr)=>{
               tr.dataset.id = data.id;
               tr.dataset.payrollid = data.payroll_id;
               tr.dataset.empid = data.emp_id;
            },
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            listContainerClass: null
        });

        mThis.btnCalculate.onclick = function (e) {
            e.preventDefault();
            const op = {
                payroll_id: mThis.getFilterData().payroll_id
            };
            if (!AuthManager.allowed(362,false)) return;
            cv_interact.confirm('html:<span class="fw-semibold d-block">Calculate this payroll list?</span><small>This process will calculate net payment including their salary and other benefits for all staffs in the payroll</small>', {
                title: 'Calculate Payroll List',
                context: 'calculate',
                confirmButtonText: "Calculate"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/mhr/payroll/calculate'].join(''), op, false, null).then(res => {
                        if (res.status_code === 200) {
                            const d = res.data || {};
                            const error_count = d.error_count || 0;
                            const error_message = error_count > 0 ? `${error_count} cases failed`:'';
                            cv_interact.success([`Payroll has been calculated : ${d.success_count || 0 } cases affected! ${d.issues_count}`].join(''));
                            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                            mThis.showIssues(d);

                        } else {
                            cv_interact.warning(res.error_message);
                        }
                    });
                }
            });
        };

        mThis.showIssues = function (d) {
            let issues_count = d.issues_count || 0;
            if (issues_count > 0) {
                mThis.btnIssues.classList.remove('d-none');

                let html = '';
                d.issues.forEach((issue) => {
                    html += `
                    <div class="d-flex flex-wrap gap-2">
                        <span>Name: ${issue.name ?? 'N/A'}</span>
                        <span>Issue: ${issue.issue ?? 'N/A'}</span>
                        <div class="border w-100"></div>
                    </div>`;
                });
                mThis.issues_list.innerHTML = html;
            } else {
                mThis.btnIssues.classList.add('d-none');
                mThis.issues_list.innerHTML = null;
                mThis.issues_list.parentElement.classList.remove('show');
            }

        }
        mThis.btnBackToPayroll.onclick = function (e) {
            e.preventDefault();
            let lnk = VSUtil.closestLimited(e.target, "#_btnBackToPayroll");
            if (lnk) {
                VSRoute.showComponent("PayrollComponent");
                return;
            }
        }
        mThis.btnDisburse.onclick = function (e) {
            e.preventDefault();

            const op = {
                payroll_id: mThis.elFilter.value
            };
            if (!AuthManager.allowed(358,false)) return;
            cv_interact.confirm('html:<span class="d-block fw-semibold text-success">Disburse this payroll list? </span><small>This process will transfer cash to all employee`s payroll accounts</small>', {
                title: 'Disburse Payroll List',
                context: 'update',
                confirmButtonText: "Disburse"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/mhr/payroll/disburse-all'].join(''), op, false, null).then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('salary_disbursement_successful');
                            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        };

        mThis.btnAuthorized.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: mThis.elFilter.value
            };
            if (!AuthManager.allowed(357,false)) return;
             cv_interact.confirm(
                 'html:<span class="d-block fw-semibold text-success">Authorize this payroll list? </span><small>This process will authorize payroll list</small>',
                 {
                     title: "Authorize Payroll",
                     context: "authorize",
                     confirmButtonText: "Authorize",
                 },
                 function (e) {
                     if (e) {
                         vsapi
                             .call(`${mThis.base_url}/mhr/payroll/authorize`, op)
                             .then((res) => {
                                 if (res.status_code === 200) {
                                     cv_interact.success("payroll_already_authorized");
                                    //  mThis.PayrollList_ListView.showPage();
                                 } else cv_interact.error(res.error_message);
                             });
                     }
                 }
             );
        }
        mThis.btnReverse.onclick = function (e) {
            e.preventDefault();

            const op = {
                payroll_id: mThis.elFilter.value
            };
            if (!AuthManager.allowed(363,false)) return;
            cv_interact.confirm('html:<span class="d-block fw-semibold text-success">Reverse this payroll list? </span><small>This process will transfer cash back to all master accounts</small>', {
                title: 'Reverse Payroll List',
                context: 'update',
                confirmButtonText: "Reverse Payroll List?"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/mhr/payroll/reverse'].join(''), op, false, null).then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('salary_reversed_successfully');
                            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        };

        mThis.btnImport.onclick = function (e) {
            e.preventDefault();

            const op = {
                id: null,
                payroll_id: PayrollListComponent.elFilter.value,
                // btn: e.target,
                onClose: () => {
                    mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(361,false)) return;
            PayRollImportDialog.show(op);
        };
        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            const sub_content = mThis.self.querySelector("#sub_content");
            sub_content.classList.remove("d-none");
            const pay_slip = mThis.self.querySelector("#pay_slip");
            pay_slip.classList.add("d-none");
        };

        const pr_tbl = mThis.PayrollList_ListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 230) + 'px';
        sh_parent.classList.add("overflow-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 230) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);///

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange =  (e) => {
           e.preventDefault();
           mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            }
       });
       let timeOut = null;
       mThis.elSearch.onkeyup = function (e) {
        e.preventDefault();
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
        }, 250);
    };

        mThis.initAlready = true;

    };

    mThis.initDropdownMenus = (table)=>{
        const menuOptions = {
            containerElement: table,
            actionButtonClass:"btn_payroll_list_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html: '<span class="ps-2 " vslang="titles.View Pay Slip"></span>',
                    icon: `<i class="fa-regular fa-eye fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "pay_slip",
                },
                // {
                //     html:'<span class="ps-2  " vslang="titles.Disburse"></span>',
                //     icon:`<i class="fa-solid fa-square-check"></i>`,
                //     cssClass:"border-bottom pb-2",
                //     name:"disburse_payroll_list"
                // },
                // {
                //     html:'<span class="ps-2  " vslang="titles.Add Deduction">Add Deduction</span>',
                //     icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                //     cssClass:"border-bottom pb-2",
                //     name:"add_deduction"
                // },
                {
                    html:'<span class="ps-2  " vslang="titles.Remove from List"></span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_payroll_list"
                },

            ],
            onShow: (me, container) => {

                const menu = me.getActiveMenus(container);
                const disburse = container.dataset.disbursed;


                if (disburse == 1) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display = (menu[item].dataset.mnuaction === 'delete_payroll_list' || menu[item].dataset.mnuaction === 'add_deduction' || menu[item].dataset.mnuaction === 'disburse_payroll_list') ? 'none' : 'block';
                        }

                    }
                }

            },
            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'pay_slip':{
                      mThis.viewPayment(id, menuLink);
                      break;
                    }
                    case 'add_deduction':{
                      mThis.addDeduction(id, menuLink);
                      break;
                    }

                    case 'disburse_payroll_list':{
                      const id = menuLink.dataset.id;
                      //const payroll_id = menuLink.dataset.payrollid;
                      mThis.disburseOne(id, null, null, menuLink);
                      break;
                    }
                    case 'delete_payroll_list':{
                        mThis.deletePayrollList(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptions);
    }

    mThis.renderPayment = (data) => {
       let html = '';
       let benefit_flat_rate = null;
       let div_BFT  = '';

       if (data.benefit_flat_rate != null) {
            const parts = data.benefit_flat_rate.split('|').filter(part => part);

            benefit_flat_rate = parts.map(part => {
                const [bft, bftr] = part.split('@');
                return { BFT: bft, BFTR: bftr };
            });

            div_BFT = benefit_flat_rate
            .map(value => {
                return `${VSMoney.formatAmount(value.BFT,data.currency_code)} (${value.BFTR} %)`;
            })
            .join(' & ');

        }
         html += `
        <style>
            .payment_card {

            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 10px;
            width: 98%;


            }
            .payment_details {
                display: flex;
                justify-content: center;
                height: 510px;
            }

            .payment-header {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                padding: 10px;
                padding-bottom: 20px;
            }
            .payment-logo {
                position: absolute;
                left: 0;
            }

            .payment-title {
                text-align: center;
                flex-grow: 1;
            }
            .payment_profile {
                gap: 10px;
                justify-content: center;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
            }

            .payment_img {
                display: flex;
                justify-content: center;
                width: 80px;
                height: 80px;
                overflow: hidden;
                border-radius: 50%;

            }

            .payment_table{
                display: flex;
                padding: 10px;
            }

        </style>
            <div class="payment_card overflow-y-auto overflow-x-hidden">
                <div class="payment-header">
                    <div class="payment-logo d-none">
                        <img src="${main_view.base_url}/assets/images/meta/Meta_logo1.png" alt="Company Logo">
                        </div>
                        <div class="payment-title">
                        <h4>Pay Slip : ${data.start_date} - ${data.end_date}</h4>
                        </div>
                        
                        </div>
                        
                        <div class="payment_profile">
                        <div class="row cols-2 mb-0">
                        <div class="col-2">
                        <div class="payment_img" data-id="" data-imageurl="">
                        <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;"/>
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Name</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize data-get">${data.emp_name}</p>
                            </div>

                           <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Sex</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">
                                    ${data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other'}
                                </p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Code</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap">${data.emp_code}</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Phone Number</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${data.phone_number}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Position</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${data.emp_position}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Join Date</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${data.joining_date}</p>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="payment_table row "style="display: flex !important">
                <div class="col-6">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> Salary </td>
                                <td>${VSMoney.formatAmount(data.p_salary,data.currency_code)}</td>
                            </tr>
                             <tr>
                                <td>Period</td>
                                <td>${data.count_day} days</td>
                            </tr>
                            <tr>
                                <td>Taxable Benefits</td>
                                <td class="text-success">${VSMoney.formatAmount(data.benefit_taxable, data.currency_code)}</td>
                            </tr>
                            <tr>
                                <td>Other Benefits</td>
                                <td class="text-success">${div_BFT || 0.00}</td>
                            </tr>
                            <tr>
                                <td>Deduction</td>
                                <td class="text-danger">${VSMoney.formatAmount(data.deduction, data.currency_code)}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="col-6">

                    <table class="table ">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>Allowance</td>
                                <td>${VSMoney.formatAmount(data.p_allowance, data.currency_code)}</td>
                            </tr>

                             <tr>
                                <td>Tax Rate</td>
                                <td>${data.tax_rate }%</td>
                            </tr>
                            <tr>
                                <td>Nontaxable Benefits</td>
                                <td class="text-success">${VSMoney.formatAmount((data.nontaxable_benefit || data.benefit_non_tax), data.currency_code)}</td>
                            </tr>
                            <tr>
                                <td>Benefit Tax</td>
                                <td class="text-danger">${VSMoney.formatAmount( (data.taxable_benefits || data.benefit_tax), data.currency_code)}</td>
                            </tr>
                            <tr>
                                <td>Tax Base</td>
                                <td class ="text-danger">${VSMoney.formatAmount(data.tax_base, data.currency_code)}</td>
                            </tr>
                        </tbody>

                    </table>
                    </div>
                       <div class="col-12 d-flex justify-content-center pb-1">
                            <p class=" text-success rounded-5 m-0 border p-2 bg-light">Total Salary : ${VSMoney.formatAmount(data.total_salary, data.currency_code)}</p>
                       </div>
                </div>

            </div>`;

        mThis.payment_info.innerHTML = html;
    };

    mThis.btnPrint.addEventListener('click', () => {
        windowPrintPayrollList(mThis.payment_info.innerHTML);
        // window.print();
    })


    mThis.viewPayment = (id, menuLink) => {

        const sub_content = mThis.self.querySelector("#sub_content");
        sub_content.classList.add("d-none");
        const pay_slip = mThis.self.querySelector("#pay_slip");
        pay_slip.classList.remove("d-none");
        let op = {
            id: id,
        }
         if (!AuthManager.allowed(364,false)) return;
        vsapi.call(`${main_view.base_url}/mhr/payroll/staff/pay-slip`,op,false,false,false).then(res => {
            if(res.status_code == 200){
                let d = res.data;
                mThis.renderPayment(d);
            }
        })

    }
    mThis.addDeduction = (id, menuLink) => {
        if (!AuthManager.allowed(366,false)) return;

        // Fetch payroll list row details first to pre-fill the dialog correctly
        vsapi.call([main_view.base_url, '/mhr/payroll/staff/form-options'].join(''), { id: id }, menuLink, null)
            .then(res => {
                if (res.status_code !== 200) {
                    cv_interact.error(res.error_message);
                    return;
                }

                const payroll_list = res.data.payroll_list;
                if (!payroll_list) {
                    cv_interact.error("Payroll record not found.");
                    return;
                }

                const op = {
                    id: res.data.emp_deduct_id || null, // set to existing emp_deduct_id if it exists, otherwise null
                    emp_id: payroll_list.emp_id,
                    deduct_amount: res.data.emp_deduct_amount || "",
                    deduct_date: "",
                    issues: "",
                    remarks: "",
                    silentSuccess: true,
                    btn: menuLink,
                };

                const showDialog = () => {
                    // Temporarily disable the employee select field so they cannot change the employee
                    let oldOnPrepare = op.onPrepareForm;
                    op.onPrepareForm = (me, data) => {
                        if (typeof oldOnPrepare === "function") oldOnPrepare(me, data);
                        let empSelect = me.divModal.querySelector('[name="employee_id"]');
                        if (empSelect) {
                            empSelect.disabled = true;
                        }
                    };

                    let temp_deduct = op.deduct_amount || 0.0;
                    let temp_remarks = op.issues;

                    const onInputDeduct = (e) => {
                        if (e.target) {
                            if (e.target.name === "deduct_amount") {
                                temp_deduct = e.target.value;
                            }
                            if (e.target.name === "issues") {
                                temp_remarks = e.target.value;
                            }
                        }
                    };
                    document.addEventListener("input", onInputDeduct);
                    document.addEventListener("change", onInputDeduct);

                    op.onClose = (arg1, arg2) => {
                        document.removeEventListener("input", onInputDeduct);
                        document.removeEventListener("change", onInputDeduct);

                        let saved = false;
                        if (typeof arg1 === "boolean") {
                            saved = arg1;
                        } else if (arg1 && typeof arg1 === "object") {
                            saved = true;
                        }

                        if (!saved) return;

                        let final_deduct = temp_deduct;
                        let final_remarks = temp_remarks;

                        // Fallback: read directly from modal inputs if still in DOM
                        const domDeduct = document.querySelector('.vs-modal [name="deduct_amount"]');
                        const domRemarks = document.querySelector('.vs-modal [name="issues"]');
                        if (domDeduct && domDeduct.value) final_deduct = domDeduct.value;
                        if (domRemarks && domRemarks.value) final_remarks = domRemarks.value;

                        // Save the deduction value to payroll_list row
                        const payload = {
                            id: id,
                            emp_id: payroll_list.emp_id,
                            payroll_id: payroll_list.payroll_id,
                            deduction: final_deduct || 0.0,
                            skip_db_deduct: true // skip writing to emp_deductions because DeductDialog already did it
                        };

                        vsapi.call([main_view.base_url, '/mhr/payroll/staff/add-deduction'].join(''), payload, menuLink, null)
                            .then(saveRes => {
                                if (saveRes.status_code === 200) {
                                    cv_interact.success("deduction_saved_successfully");
                                    mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                                } else {
                                    cv_interact.error(saveRes.error_message);
                                }
                            });
                    };

                    DeductionComponent.DeductDialog.show(op);
                };

                if (typeof DeductionComponent === "undefined" || !DeductionComponent.DeductDialog) {
                    const script = document.createElement("script");
                    script.src = `${main_view.base_url}/js/components/mhr/DeductionComponent.js`;
                    script.onload = showDialog;
                    script.onerror = () => {
                        cv_interact.error("Failed to load deduction component.");
                    };
                    document.body.appendChild(script);
                } else {
                    showDialog();
                }
            });
    }

    mThis.disburseOne = (id, emp_id,payroll_id, menuLink) => {
        const p = {
            id: id,
            //emp_id:emp_id,
            //payroll_id:payroll_id
            // btn: menuLink,
            // onClose: () => {
            //     mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            // }
        };
        cv_interact.confirm('confirm_disburse_payroll',{
            title: 'Disburse Payroll List',
            context: 'disburse',
            confirmButtonText:"Disburse"
        }, e =>{
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/payroll/disburse-one`, p, false, false, false).then(res => {

                    if(res.status_code == 200){
                        cv_interact.success('payroll_disbursement_successful');
                        mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                    }
                    else{
                        cv_interact.error(res.error_message);
                    }
                })
            }
        });

    }

    mThis.deletePayrollList = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            }
        };
         if (!AuthManager.allowed(365,false)) return;
        cv_interact.confirm('confirm_remove_staff_from_payroll',{
            title: 'Remove Staff from Payroll',
            context: 'delete',
            confirmButtonText:"Remove"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/payroll/staff/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('staff_removed_from_payroll');
                        mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });

    }

    mThis.getFilterData = () => {

        let p = {};

        p.payroll_id = mThis.elFilter.value;
        p.branch_id = mThis.elFilterBranch.value;
        // p.disbursed = mThis.elFilterDisburse.value;
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(123,p);
        
        return p;
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/mhr/payroll/staff/form-options`, null, null, null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            
            let payroll_id = null;
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();

            d.payrolls.forEach(payroll => {
                if (payroll.month === currentMonth && payroll.year === currentYear) {
                    payroll_id = payroll.id;

                }


            });


            VSUtil.setComboItems(mThis.elFilter,d.payrolls,'id','payroll_name',null,null,payroll_id);
            VSUtil.setComboItems(mThis.elFilterBranch, d.branches, 'id', 'branch_name', "", 'All Branches', "");
            // VSUtil.setComboItems(mThis.elFilterDisburse, d.disbursed, 'id', 'name', true, 'Default', null);
            onFinish(d);
        });
    };

    mThis.show = (options)=> {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.PayrollList_ListView.showPage(mThis.getFilterData());

        });
    };
    return mThis;
})();


const PayRollImportDialog = (()=>{
    const self = {};
    let dialogImport = null;
     self.show = (op)=>{

        dialogImport = dialogImport || new GeneralDialog({
            cssClass:'modal-md vs-modal',
            backdrop: 'static',
            keyboard:true,
            createContent:()=>{
                 return [`<div class="row">
                 <div class="col-md-12">
                     <select data-style="material" name="payroll_name" class="form-control data-input"  data-field="payroll_id" placeholder="Payroll"></select>
                 </div>

              </div>`].join('');
            },
            configSelect:[
               {
                 name:"payroll_name",
                 data:'payrolls',
                 textField:"payroll_name",
                 valueField:'id'
               },
            ],
            buttons:[
               {
                label:'<span vslang="buttons.Cancel"></span>',
                cssClass:'btn-vs-cancel',
                click:(me,btn)=>{
                    me.hide(false);
                }
               },
               {
                label:'<span vslang="buttons.Import"></span>',
                cssClass:'btn-vs-save',
                click:(me,btn)=>{
                    const p = me.getData();

                    p.id = me.dataOptions.id;
                    console.log(44,p);
                    
                    vsapi.call( [main_view.base_url,'/mhr/payroll/import-staff'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         const successCount = res.data.success_count ?? 0;
                          if(successCount > 0) cv_interact.success([successCount, ' staff have been enlisted to this payroll'].join(''));
                          else cv_interact.warning('No staff imported! This may be because all of them are already in the payroll, or there are no staff profiles');
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'vslang:titles.Import Staff List',
               modifyTitle:'Edit',
               targetProp: 'payroll_list',
               api:{
                 endpoint: [main_view.base_url,'/mhr/payroll/staff/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
            },

            onPrepareForm:(me, data)=>{
                 me.controls.payroll_name.value = me.dataOptions.payroll_id;
                 me.controls.payroll_name.setAttribute('disabled',true);
            }
        });

        dialogImport.show(op);
     }

    return self;
})();

function windowPrintPayrollList(html=null)
{
    let HtmlString = null;
    HtmlString = html ? html : HtmlString;
    if(HtmlString)
    {
        let myWindow = window.open('','PRINT');
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Pay Slip</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                 <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/bhr_style.css"/>
                <style>
                     *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    table{
                        width: 100%;
                        border-collapse: collapse;
                    }

                </style>

            </head>
            <body>${HtmlString}</body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        },500);
    }
    else
        cv_interact.warning('Select run report before print!');
}
