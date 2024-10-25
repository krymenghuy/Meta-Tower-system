"use strict";

var PayrollComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_payrollComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll";
    this.elStatus = this.self.querySelector('#el_status');
    this.btnAdd = this.self.querySelector("#_btnAddpayroll");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_payroll");

    this.cols = [
        {
            title: "No",
            className: 'align-middle text-capitalize text-nowrap',
            data: (data, index) => index + 1,
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.name ?? ''}</p>`
        },
        {
            title: "Month",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.p_month ?? ''}</p>`
        },
        {
            title: "Year",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.p_year ?? ''}</p>`
        },
        {
            title: "Duration",
            className: "align-middle w-15",
            data: (data) => `<p class="p-0 m-0">${data.start_date?? ''}​ - ${data.end_date ?? ''}</p>`
        },
        {
            title: "Employee",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.p_number ?? ''}</p>`
        },
        {
            title: "Total",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.total ?? ''}</p>`
        },
        {
            title: "Currency",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.currency_code ?? ''}</p>`
        },
        {
            title: "Exchange Rate",
            className: "align-middle",
            data: (data) => `<p class="p-0 m-0">${data.exchange_rate ?? ''}</p>`
        },
          {
            title: "Authorize",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = ''; // Default background color

                if ((data.authorized || '').toLowerCase() === 'approved') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745'; // Green background for success
                } else if ((data.authorized || '').toLowerCase() === 'pending') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107'; // Yellow background for pending
                }

                return `<div><a class="d-block" data-status="${data.authorized}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.authorized}
                            </span>
                        </a></div>`;
            }
        },
        {
            title: "Disbursed",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = ''; // Default background color

                if ((data.disbursed || '').toLowerCase() === 'success') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745'; // Green background for success
                } else if ((data.disbursed || '').toLowerCase() === 'pending') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107'; // Yellow background for pending
                }

                return `<div><a class="d-block" data-status="${data.disbursed}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.disbursed}
                            </span>
                        </a></div>`;
            }
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <a href="javascript:void(0)"
                       class="${data.action_id > 1 ? "d-none" : "btn_payroll_action"}"
                       data-id="${data.id}" data-statusid="${data.status_id}">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>`
        },
    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollListView = new ListView('_payroll_list', {
            fetchApi: `${main_view.base_url}/hr/payroll/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            // let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                // id: 1,
                btn: e.target,
                onClose: () => {
                    cv_interact.success('Added Payroll Successfully');
                    mThis.PayrollListView.showPage();
                }
            };
            // content.parentElement.classList.add('d-none');

            AddPayRollListDailog.show(op);
        };

        const pr_tbl = mThis.PayrollListView.getListContainer();
        pr_tbl.style.height = `${window.innerHeight - 225}px`;
        pr_tbl.classList.add('overflow-y-auto', 'overflow-x-hidden');

        mThis.initDropdownMenus(pr_tbl);
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.PayrollListView.showPage(mThis.getDataFormFilter());
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.PayrollListView.showPage(mThis.getDataFormFilter());
            }, 200);
        });

        mThis.initAlready = true;
    };

    this.getDataFormFilter = () => {
        let filters = {
            status_id: mThis.elStatus.value,
            sort_by: mThis.elSortBy.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            filters[el.dataset.field] = el.value;
        });
        return filters;
    };

    this.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_payroll_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2">Change Status</span>',
                    icon: '<i class="fa-regular fa-exchange fs-5"></i>',
                    name: "change_payroll_status"
                },
                {
                    html: '<span class="ps-2">Modify Payroll</span>',
                    icon: '<i class="fa-regular fa-edit fs-5"></i>',
                    name: "edit_payroll"
                },
                {
                    html: '<span class="ps-2">Delete Payroll</span>',
                    icon: '<i class="fa-regular fa-trash-can fs-5"></i>',
                    name: "delete_payroll"
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'change_payroll_status':
                        mThis.changeStatus(id, menuLink);
                        break;
                    case 'edit_payroll':
                        mThis.editPayroll(id, menuLink);
                        break;
                    case 'delete_payroll':
                        mThis.deletePayroll(id, menuLink);
                        break;
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        // mThis.prepareFormOptions();
            mThis.PayrollListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };


});

const AddPayRollListDailog = (()=>{

    const self = {};
    let dialogAdd = null;
     self.show = (op)=>{
    console.log(999,op);

    dialogAdd = dialogAdd || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static', //User click outside form, do not close form
            keyboard:true, //prevent user from using ESC key
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-12">
                    <label for="name" class="form-label" vslang="titles.Name "></label>
                    <input name="name" class="form-control data-input" data-field="name" />
                </div>
                <div class="form-group col-6">
                    <label for="p_month" class="form-label" vslang="titles.Payroll Month"></label>
                        <select class="modal-select data-input" data-field="p_month">
                            <option value="">(Select Month)</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                </div>
                <div class="form-group col-6">
                    <label for="p_year" class="form-label" vslang="titles.Payroll Year "></label>
                    <input name="p_year" class="form-control data-input" data-field="p_year" />
                </div>
                 <div class="form-group col-6">
                    <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                    <input name="start_date" class="form-control data-input" data-field="start_date" />
                </div>
                <div class="form-group col-6">
                  <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                  <input name="end_date" class="form-control data-input" data-field="end_date" />
                </div>
                <div class="form-group col-4">
                    <label for="p_number" class="form-label" vslang="titles.Payroll Number "></label>
                    <input type="number" name="p_number" class="form-control data-input" data-field="p_number" />
                </div>
                <div class="form-group col-4">
                    <label for="currency_code" class="form-label" vslang="titles.Currency"></label>
                        <select class="modal-select data-input" data-field="currency_code">
                            <option value="">(Select Currency)</option>
                            <option value="USD">USD</option>
                            <option value="KHR">KHR</option>
                        </select>
                </div>
                <div class="form-group col-4">
                    <label for="exchange_rate" class="form-label" vslang="titles.Exchange Rate "></label>
                    <input name="exchange_rate" class="form-control data-input" data-field="exchange_rate" />
                </div>
                <div class="form-group col-4">
                    <label for="authorized" class="form-label" vslang="titles.Authorized"></label>
                        <select class="modal-select data-input" data-field="authorized">
                            <option value="0">Panding</option>
                            <option value="1">Approved</option>
                        </select>
                </div>
                <div class="form-group col-4">
                    <label for="disbursed" class="form-label" vslang="titles.Disbursed"></label>
                        <select class="modal-select data-input" data-field="disbursed">
                            <option value="0">Panding</option>
                            <option value="1">Success</option>
                        </select>
                </div>
                <div class="form-group col-4">
                    <label for="total" class="form-label" vslang="titles.Total "></label>
                    <input name="total" class="form-control data-input" data-field="total" />
                </div>
              </div>`].join('');
            },
            contentCreated:(me)=>{
                //Convert field to be DatePicker : start_date and end_date
                DateTimePicker.init(me.controls.start_date);
                DateTimePicker.init(me.controls.end_date);

             },
            // configSelect:[
            //    {
            //      name:"payroll_name",
            //      data:'payrolls',
            //      textField:"name",
            //      valueField:'id'
            //    },
            // ],
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

                    vsapi.call( [main_view.base_url,'/hr/payroll/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Payroll',
               modifyTitle:'Edit Payroll',
               targetProp: 'payrolls',
               api:{
                 endpoint: [main_view.base_url,'/hr/payroll/form-options'].join(''),
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

        dialogAdd.show(op);
     }

    return self;
})();
