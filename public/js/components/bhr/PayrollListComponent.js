"use strict";

var PayrollListComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_payrollListComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll List";
    this.elFilter = this.self.querySelector('#el_filter_payrollList');
    this.elFilterBranch = this.self.querySelector('#el_filter_branch');
    this.btnInsert = this.self.querySelector("#_btnInsert");
    this.btnImport = this.self.querySelector("#_btnImport");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSortBy = this.self.querySelector("#el_sort_by");
    this.btnCalculate = this.self.querySelector("#_btnCalculate");

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
                                <span style="font-size: 12px">${data.emp_position ?? ''}</span>

                            </div>
                        </div>`;
            }
        },

        {
            title: "Salary Base",
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
            title: "Desuction",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.deduction ?? '0.00'}</p>`;
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
            title: "Tax Allowance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.tax_allowance ?? '0.00'}</p>`;
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
                           class="${data.disburse === 1 ? "d-none" : "btn_payroll_list_action"}"
                           data-id="${data.id}"
                           data-statusid="${data.status_id}"
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
        mThis.btnInsert.onclick = function (e) {
            e.preventDefault();
            // let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                // id: 1,
                btn: e.target,
                onClose: () => {
                    cv_interact.success('Inserted Successfully');
                    mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                }
            };
            // content.parentElement.classList.add('d-none');

            PayRollListDialog.show(op);
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

        const pr_tbl = mThis.PayrollList_ListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

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

            onClick:(menuLink, id, name)=>{
                switch(name){

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
        cv_interact.confirm('Disburse this Payroll List?',{
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
        p.sort_by = mThis.elSortBy.value;

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
            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'Default', null);

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
                 return [`<div class="row">
                 <div class="form-group col-12">
                     <label for="employee" class="form-label" vslang="titles.Name"></label>
                     <select name="employee" class=" data-input"  data-field="emp_id"></select>
                 </div>
                 <div class="form-group  col-12 d.none">
                     <div id="info"></div>
                 </div>
                <div class="form-group col-6">
                     <label for="payroll_name" class="form-label" vslang="titles.Payroll Name"></label>
                     <select name="payroll_name" class=" data-input"  data-field="payroll_id"></select>
                 </div>
                <div class="form-group col-6">
                  <label for="benefit" class="form-label" vslang="titles.Benefit"></label>
                  <input name="benefit" class="form-control data-input" data-field="benefit" />
                </div>
                <div class="form-group col-6">
                  <label for="desuction" class="form-label" vslang="titles.Desuction"></label>
                  <input name="desuction" class="form-control data-input" data-field="deduction" />
                </div>
              </div>`].join('');
            },

            configSelect:[
               {
                 name:"employee",
                 data:'employees',
                 textField:(me, d)=> {return `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span> <span>${d.email}</span><span>${d.phone_number}</span><span> ${d.position} </span> </div></div>`; },
                // textField:"name",
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


