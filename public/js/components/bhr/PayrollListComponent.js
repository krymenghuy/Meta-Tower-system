"use strict";

var PayrollListComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_payrollListComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll List";
    this.elFilter = this.self.querySelector('#el_filter_payrollList');
    this.elFilterBranch = this.self.querySelector('#el_filter_branch');
    this.btnImport = this.self.querySelector("#_btnImport");
    this.divFilter = this.self.querySelector("#_divFilter");
    // this.elSortBy = this.self.querySelector("#el_sort_by");
    this.elFilterDisburse = this.self.querySelector("#el_filter_disburse");
    this.btnCalculate = this.self.querySelector("#_btnCalculate");
    this.btnDisburse = this.self.querySelector("#_btnDisburse");
    this.btnBack = this.self.querySelector("#_btn_backTo_payrollList");
    this.payment_info = this.self.querySelector("#payment_info");
    this.btnPrint = this.self.querySelector("#_btnPrint");


    this.cols = [

        {
            title: "No",
            className: 'align-middle text-capitalize text-nowrap',
            data: (data, index, i) => { return (index + 1) },

        },
        {
            title: "Employee",
            className: "align-middle text-start w-15",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.emp_name ?? ''}</span>
                                <br/>
                                <span style="font-size: 11px; color: gray;">${data.emp_position ?? ''}</span>

                            </div>
                        </div>`;
            }
        },

        {
            title: "Salary",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.salary ?? '0.00'}</p>`;
            }
        },
        {
            title: "Benefit",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.benefit ?? '0.00'}</p>`;
            }
        },

        {
            title: "Deduction",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.deduction ?? '0.00'}</p>`;
            }
        },
        {
            title: "Allowance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.allowance ?? '0.00'}</p>`;
            }
        },

        {
            title: "Tax Rate",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.tax_rate ?? ''} %</p>`;
            }
        },
        {
            title: "Bias",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.bias ?? '0.00'}</p>`;
            }
        },


        {
            title: "Tax Base",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.tax_base ?? '0.00'}</p>`;
            }
        },
        {
            title: "Tax Benefit",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.tax_benefit ?? '0.00'}</p>`;
            }
        },
        {
            title: "Total",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.total_salary ?? '0.00'}</p>`;
            }
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)"
                           class="btn_payroll_list_action"
                           data-id="${data.id}"
                           data-disburse="${data.disburse}"
                           aria-haspopup="true"
                           aria-expanded="false">
                            <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                        </a>
                    </div>
                </div>`,
        },

    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollList_ListView = new ListView('_payrollList_list',{
            fetchApi : `${main_view.base_url}/hr/payroll-list/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table  table--white rounded-2   overflow-hidden  header-uppercase',
            listContainerClass: null
        });
        mThis.btnCalculate.onclick = function (e) {

            e.preventDefault();



            let op = {
                payroll_id : mThis.getFilterData().payroll_id,

            }
            console.log(444, op);
            vsapi.call( [main_view.base_url,'/hr/payroll-list/calculate'].join(''), op,null,null).then(res=>{
               if(res.status_code ==200){
                 mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                 alert(res.data);
               }else cv_interact.error(res.error_message);
            });
        };
        mThis.btnDisburse.onclick = function (e) {
            e.preventDefault();

            let op = {
                payroll_id: mThis.getFilterData().payroll_id,
            };

            cv_interact.confirm('Disburse this Payroll List?', {
                title: 'Disburse Payroll List',
                context: 'disburse',
                confirmButtonText: "Disburse"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/hr/payroll-list/disburse-all'].join(''), op, null, null).then(res => {
                        if (res.status_code === 200) {
                            if (res.data && res.data.message === 'Payroll List Already Disbursed') {
                                cv_interact.error('Payroll List Already Disbursed');
                            } else {
                                cv_interact.success('Disbursed Successfully');
                                mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                            }
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        };



        mThis.btnImport.onclick = function (e) {
            e.preventDefault();
            // let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                // id: 1,
                // btn: e.target,
                onClose: () => {
                    cv_interact.success('Import Payroll Successfully');
                    mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                }
            };
            // content.parentElement.classList.add('d-none');

            PayRollImportDailog.show(op);
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
        // sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);///

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{


            el.onchange =  (e) => {
           e.preventDefault();
           mThis.PayrollList_ListView.showPage(mThis.getFilterData());
           console.log(777777, mThis.getFilterData());
            }
       });

        mThis.initAlready = true;

    };

    this.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_payroll_list_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html: '<span class="ps-2  " vslang="titles.View Pay Slip">View Pay Slip</span>',
                    icon: `<i class="fa-regular fa-eye"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "pay_slip",
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Disburse"></span>',
                    icon:`<i class="fa-solid fa-square-check"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"disburse_payroll_list"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Payroll List">Modify Payroll List</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_payroll_list"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Payroll List">Delete Payroll List</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_payroll_list"
                },

            ],
            onShow: (me, container) => {

                const menu = me.getActiveMenus(container);
                const disburse = container.dataset.disburse;


                if (disburse == 1) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display = (menu[item].dataset.mnuaction === 'delete_payroll_list' || menu[item].dataset.mnuaction === 'edit_payroll_list' || menu[item].dataset.mnuaction === 'disburse_payroll_list') ? 'none' : 'block';
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
                    case 'edit_payroll_list':{
                      mThis.editPayrollList(id, menuLink);
                      break;
                    }

                    case 'disburse_payroll_list':{
                      mThis.disbursePayrollList(id, menuLink);
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
        new VSDropdownMenu(menuOptopns);
    }
    this.renderPayment = (data) => {
       let html = '';
         html += `
        <style>
            .payment_card {

            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 10px;
            width: 1000px;


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
            <div class="payment_card">
                <div class="payment-header">
                    <div class="payment-logo">
                        <img src="${main_view.base_url}/assets/images/logo/lc_logo.svg" alt="Company Logo">
                    </div>


                    <div class="payment-title">
                        <h3> ℙ𝕒𝕪 𝕊𝕝𝕚𝕡 </h3>
                    </div>
                </div>


                <div class="payment_profile">
                    <div class="row cols-2 mb-0">
                        <div class="col-2">
                            <div class="payment_img" data-id="" data-imageurl="">
                                <img src="${data.image_url}" alt="Profile Image">
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get">${data.emp_name}</p>
                            </div>
                           <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Sex</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">
                                    ${data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other'}
                                </p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee ID</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">${data.emp_code}</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Branch</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${data.branch_name}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Position</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">${data.emp_position}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Join Date</p>
                                <p class="px-2">:</p>
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
                                <td>Bese Salary</td>
                                <td>${data.salary}</td>
                            </tr>
                            <tr>
                                <td>Base Allowance</td>
                                <td>${data.allowance || 0.00} </td>
                            </tr>
                            <tr>
                                <td>Base Bias</td>
                                <td>${data.bias}</td>
                            </tr>
                             <tr>
                                <td>Days</td>
                                <td>${data.count_day}</td>
                            </tr>
                            <tr>
                                <td>Benefit</td>
                                <td class="text-success">${data.benefit}</td>
                            </tr>
                            <tr>
                                <td>Deduction</td>
                                <td class="text-danger">${data.deduction}</td>
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
                                <td> Salary </td>
                                <td>${data.p_salary}</td>
                            </tr>
                            <tr>
                                <td>Allowance</td>
                                <td>${data.p_allowance}</td>
                            </tr>
                            <tr>
                                <td>Bias</td>
                                <td>${data.p_bias}</td>
                            </tr>
                             <tr>
                                <td>Tax Rate</td>
                                <td>${data.tax_rate }%</td>
                            </tr>
                            <tr>
                                <td>Tax Benefit</td>
                                <td class="text-danger">${data.tax_benefit}</td>
                            </tr>
                            <tr>
                                <td>Tax Base</td>
                                <td class ="text-danger">${data.tax_base}</td>
                            </tr>
                        </tbody>

                    </table>
                    </div>
                       <div class="col-12 d-flex justify-content-center pb-1">
                            <p class=" text-success rounded-5 m-0 border p-2 bg-light">Total Salary : ${data.total_salary ?? ""}</p>
                       </div>

                </div>

            </div>`;

        this.payment_info.innerHTML = html;
        // let btnPrint = this.payment_info.querySelector('#_btnPrint');
        console.log(444, this.payment_info);



    };
    this.btnPrint.addEventListener('click', () => {
        windowPrint(this.payment_info.innerHTML);
        // window.print();
    })


    this.viewPayment = (id, menuLink) => {

        const sub_content = this.self.querySelector("#sub_content");
        sub_content.classList.add("d-none");
        const pay_slip = this.self.querySelector("#pay_slip");
        pay_slip.classList.remove("d-none");
        let op = {
            id: id,
        }
        vsapi.call(`${main_view.base_url}/hr/payroll-list/pay-slip`,op,false,false,false).then(res => {
            console.log(666,res);

            if(res.status_code == 200){
                let d = res.data;
                console.log(555,d);

                mThis.renderPayment(d)
            }
        })

    }
    this.editPayrollList = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success('Updated Successfully');
                mThis.PayrollList_ListView.showPage(mThis.getFilterData());

            }
        };

        PayRollListDialog.show(op);
    }

    this.disbursePayrollList = (id, menuLink) => {
        console.log(123, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            }
        };
        cv_interact.confirm('Disburse this Payroll ?',{
            title: 'Disburse Payroll List',
            context: 'disburse',
            confirmButtonText:"Disburse"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/payroll-list/disburse`,op,false,false,false).then(res => {
                    console.log(321,res);

                    if(res.status_code == 200){
                        cv_interact.success('Disbursed Successfully');
                        mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                    }
                    else{
                        cv_interact.error(res.error_message);
                    }
                })
            }
        });

    }

    this.deletePayrollList = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            }
        };
        cv_interact.confirm('Delete this Payroll List?',{
            title: 'Delete Payroll List',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/payroll-list/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                    }
                })
            }
        });

    }

    this.getFilterData = () => {
        let p = {};
        p.payroll_id = mThis.elFilter.value;
        p.branch_id = mThis.elFilterBranch.value;
        // p.sort_by = mThis.elSortBy.value;
        p.disburse = mThis.elFilterDisburse.value;

        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

        return p;
    };
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/payroll-list/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            const today = new Date();
            const year = today.getFullYear();
            const month = today.toLocaleString('default', { month: 'long' }); // "October"
            const formattedDate = `${month} ${year}`;
            let payroll_id = null;

            d.payrolls.forEach(payroll => {
                if(payroll.payroll_name == formattedDate){
                    payroll_id = payroll.id;
                }
            })

            VSUtil.setComboItems(mThis.elFilter,d.payrolls,'id','payroll_name',false,null,payroll_id);
            VSUtil.setComboItems(mThis.elFilterBranch,d.branches,'id','branch_name',true,'All Branch',null);
            // VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'Default', null);
            VSUtil.setComboItems(mThis.elFilterDisburse, d.disburse, 'id', 'name',  true, 'Default', null);

        })
    }


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.PayrollList_ListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };


});

const PayRollListDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [
                     `<div class="row">
                 <div class="form-group col-6">
                     <label for="employee" class="form-label" vslang="titles.Name"></label>
                     <select name="employee" class=" data-input"  data-field="emp_id"></select>
                 </div>

                <div class="form-group col-6">
                     <label for="payroll_name" class="form-label" vslang="titles.Payroll Name"></label>
                     <select name="payroll_name" class=" data-input"  data-field="payroll_id"></select>
                 </div>
                <div class="form-group col-6">
                  <label for="benefit" class="form-label" vslang="titles.Benefit"></label>
                  <input name="benefit" class="form-control data-input form_input" data-field="benefit" />
                </div>
                <div class="form-group col-6">
                  <label for="desuction" class="form-label" vslang="titles.Desuction"></label>
                  <input name="desuction" class="form-control data-input" data-field="deduction" />
                </div>
              </div>`,
                 ].join("");
            },

            configSelect:[
               {
                 name:"employee",
                 data:'employees',
                 textField: (me, d) => {
                    return `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                },
                 valueField:'id'
               },
               {
                 name:"payroll_name",
                 data:'payrolls',
                 textField:"payroll_name",
                 valueField:'id'
               }
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
                    const p = me.getData();

                    p.id = me.dataOptions.id; //get "id" from op

                    vsapi.call( [main_view.base_url,'/hr/payroll-list/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Insert Payroll ',
               modifyTitle:'Edit Payroll',
               targetProp: 'payroll_lists',
               api:{
                 endpoint: [main_view.base_url,'/hr/payroll-list/form-options'].join(''),
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

const PayRollImportDailog = (()=>{

    const self = {};
    let dialogImport = null;
     self.show = (op)=>{
console.log(999,op);

        dialogImport = dialogImport || new GeneralDialog({
            cssClass:'modal-md',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-12">
                     <label for="payroll_name" class="form-label" vslang="titles.Payroll"></label>
                     <select name="payroll_name" class=" data-input"  data-field="payroll_id"></select>
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
                    const p = me.getData();

                    p.id = me.dataOptions.id; //get "id" from op

                    vsapi.call( [main_view.base_url,'/hr/payroll-list/import'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Payroll By Import Employee',
               modifyTitle:'Edit Payroll By Import Payroll',
               targetProp: 'payroll_lists',
               api:{
                 endpoint: [main_view.base_url,'/hr/payroll-list/form-options'].join(''),
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

        dialogImport.show(op);
     }

    return self;
})();


function windowPrint(html=null)
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
        cv_interact.warning('Select Run Report Before Print!');
}
