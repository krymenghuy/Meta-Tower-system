// "use strict";

// var InvoicesComponent = (function () {
//     const mThis = this;
//     mThis.title_prop = " Invoice Management";
//     mThis.base_url = main_view.base_url;
//     mThis.self = main_view.VSAppContent.querySelector("#_main_invoices_component");

//     // const root = mThis.self;
//     // Object.assign(mThis, {
//     //     btnAddTest:  root.querySelector("#_btnInvoice_test"),
//     //     btnAdd:      root.querySelector("#_btnInvoices"),
//     //     divFilter:   root.querySelector("#_divFilter_invoices"),
//     //     elLeaveType: root.querySelector("#el_leave_type"),
//     //     elSearch:    root.querySelector("#_search_invoices"),
//     // });

//      mThis.btnAddTest = mThis.self.querySelector("#_btnInvoice_test");
//     mThis.btnAdd = mThis.self.querySelector("#_btnInvoices");
//     mThis.divFilter = mThis.self.querySelector("#_divFilter_invoices");
//     mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
//     mThis.elSearch = mThis.self.querySelector("#_search_invoices");

//      mThis.cols = [

//         {
//             title: "",
//             className: "align-middle text-capitalize",
//         },
//          {
//             title: "invoice number ",
//             className: "align-middle ",
//              data: (data, index) => `<span class="text-yp-custom">${inv100001 + index}</span>`,
//         },
//         {
//             title: "item",
//             className: "align-middle ",
//              data: (data, index, tr) => {
//                 return `
//                     <div class="text-yp-custom" style="width:50px;">
//                         <span class="text-wrap text-break" style ="word-break:break-word;">${data.date ?? 'N/A'}</span>
//                     </div>
//                 `;
//             }
//         },
//         {
//             title: "service type ",
//             className: "align-middle ",
//             data: (data) => `<span class="text-yp-custom"><small>${data.customer_id  ?? 'N/A'}</small></span>`,
//         },
//             {
//             title: " price ",
//             className: "align-middle ",
//             data: (data,index) => `<span class="text-yp-custom">${data.building_id ?? 'N/A'}</span>`,
//         },
//         {
//             title: "total amount($)",
//             className: "align-middle ",
//             data: (data) => {
//                 return `<span class="d-block text-yp-custom" style="width:75px;"><small>${data.invoice_type ?? 'N/A'}</small></span>`;
//             }
//         },
//         {
//             title: "remark",
//             className: "align-middle ",
//             data: (data,index) => `<span class="text-yp-custom">${data.building_id ?? 'N/A'}</span>`,
//         },

//         // {
//         //     title: "Category",
//         //     className: "align-middle",
//         //     data: (data, index, tr) => {
//         //         const cur_symbol = data.cur_symbol ?? '$', amount = data.paid_amount ?? 0;
//         //         return [cur_symbol, amount].join(' ');
//         //     }
//         // },
//         // {
//         //     title: "Description",
//         //     className: 'align-middle',
//         //     data: (data, index, tr) => {
//         //         return `
//         //            <div class="text-yp-custom" style="width:50px;">
//         //                 <span class="text-wrap text-break" style ="word-break:break-word;">${data.issue_date ?? 'N/A'}</span>
//         //             </div>`;
//         //     }
//         // },




//         {
//             title: " Status",
//             className: "align-middle",
//             data: (data) => {
//                 const status = (data.status ?? '').toLowerCase();
//                 let cls = 'text-info';

//                 if (status === 'unpaid') {
//                     cls = 'text-danger px-2 py-1 d-inline-block';
//                 } else if (status === 'paid') {
//                     cls = 'text-success px-2 py-1 d-inline-block';
//                 }

//                 return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
//             },
//         },
//             {
//                 title: "Paid date",
//                 className: 'align-middle',
//                 data: (data, index, tr) => {
//                     return `<div class="d-flex flex-column">
//                         <small class="text-muted">${data.update_at ?? ''}</small>
//                     </div>`;
//                 }
//             },
//             //{
//             //     title : "Action",
//             //     className: 'col_action align-middle',
//             //     data: (data) => `
//             //         <div class="d-flex justify-content-center align-items-end">
//             //             <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
//             //                <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
//             //             </a>
//             //         </div>`
//             // },

//     ];

//     mThis.init = () => {
//         if (mThis.initAlready) return;

//         mThis.InvoicesListView = new ListView('__invoices_list', {
//             fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
//             perPage: 10,
//             // rememberCurrentPage: false,
//             apiCluster: main_view.apiCluster,
//             columns: mThis.cols,
//             tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
//                rowCreated:(data,index,tr)=>{


//               tr.dataset.statusid = data.status_id;
//               tr.classList.add('tenant');
//               tr.setAttribute('id',['tenant_id',data.id].join(''));

//             },
//             listContainerClass: null
//         });


//         mThis.btnAdd.onclick = function (e) {
//             e.preventDefault();
//             const op = {
//                 id: null,
//                 btn: e.target,
//                 onClose: () => {
//                     mThis.InvoicesListView.showPage(mThis.getFilterData());
//                 }
//             };
//             // if (!AuthManager.allowed(240)) return;
//             InvoicesDialog.show(op);
//         };

//         mThis.pr_tbl = mThis.InvoicesListView.getListContainer();
//         const sh_parent = mThis.pr_tbl.parentElement;
//         sh_parent.style.height = (window.innerHeight - 200) + 'px';
//         sh_parent.classList.add("overflow-y-auto");
//         sh_parent.classList.add("overflow-x-hidden");
//         window.onresize = () => {
//             sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
//         }
//         mThis.tblInvoices = mThis.InvoicesListView.getTable();
//         mThis.initDropdownMenus(mThis.tblInvoices);




//         mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

//             el.onchange = (e) => {
//                 e.preventDefault();
//                 mThis.InvoicesListView.showPage(mThis.getFilterData());
//             }
//         });

//         mThis.elSearch.addEventListener('keyup', (e) => {
//             e.preventDefault();
//             clearTimeout(mThis.search_timeout);
//             mThis.search_timeout = setTimeout(() => {
//                 mThis.InvoicesListView.showPage(mThis.getFilterData());
//             }, 250);
//         });


//         mThis.initAlready = true;
//     };

//     mThis.getFilterData = () => {
//         let p = {
//             // status_id: mThis.elFilter_status.value,
//             search_value: mThis.elSearch.value,
//         };

//         mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
//             const f = el.dataset.field;
//             p[f] = el.value;
//         });

//         return p;
//     };

//     mThis.initDropdownMenus = (table) => {
//         const menuOptopns = {
//             containerElement: table,
//             actionButtonClass: "btn_leave_action",
//             cssClass: "bg-white shadow",
//             //menuItemClass:"",
//             menus: [
//                 {
//                     html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
//                     icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,

//                     cssClass: "border-bottom pb-2",
//                     name: "change_status"
//                 },
//                 {
//                     html: '<span class="ps-2 " vslang="titles.Modify "></span>',
//                     icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
//                     cssClass: "border-bottom pb-2",
//                     name: "edit_invoice"
//                 },
//                 {
//                     html: '<span class="ps-2  " vslang="titles.Delete"></span>',
//                     icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
//                     cssClass: "border-bottom pb-2",
//                     name: "delete_invoice"
//                 },
//             ],
//             // adjustPosition: {
//             //     top: -200,
//             //     left: -300
//             // },

//             onClick: (menuLink, id, name) => {
//                 switch (name) {

//                     case 'change_status': {
//                         mThis.changeStatus(id, menuLink);
//                         break;
//                     }
//                     case 'edit_invoice': {
//                         mThis.editTenant(id, menuLink);
//                         break;
//                     }
//                     case 'delete_invoice': {
//                         mThis.deleteTenant(id, menuLink);
//                         break;
//                     }

//                     default: {
//                         break;
//                     }
//                 }
//             }
//         }
//         new VSDropdownMenu(menuOptopns);
//     }

//     mThis.editBilling = (id, menulink) =>{
//         let op = {
//             id:id,
//             btn:menulink,
//             onClose:()=>{;
//                 mThis.InvoicesListView.showPage(mThis.getFilterData());
//             }
//         };

//         CreateInvoicesDialog.show(op);
//     }
//      mThis.deleteBilling = (id, menuLink) => {
//         let op = {
//             id: id,
//             btn: menuLink,
//             onClose: () => {
//                 mThis.InvoicesListView.showPage(mThis.getFilterData());
//             }
//         };
//         if (!AuthManager.allowed(242)) return;
//         cv_interact.confirm('Delete this Space??', {
//             title: 'Delete Space',
//             context: 'delete',
//             confirmButtonText: "Delete"
//         }, function (e) {
//             if (e) {
//                 vsapi.call(`${main_view.base_url}/prm/tenant/delete`, op, false, false, false).then(res => {
//                     if (res.status_code == 200) {
//                         mThis.InvoicesListView.showPage();
//                     }
//                 })
//             }
//             else {
//                 cv_interact.error(res.error_message);
//             }
//         });
//     }

//       mThis.changeStatus = (id, lnk) =>{
//         const tr = lnk.closest('tr');
//         const status_id = VSUtil.properCase(tr?.dataset.statusid || "");
//         // console.log(123,status_id);

//         const inputOptions = {
//             title: 'Change Status',
//             dataLabel: "Invoice Status",
//             valueMember: "invoice_id",
//             textMember: "name",
//             confirmButtonText: "Save",
//             blankErrorMessage: "Status is not correct!",
//             data:[
//                 {status_id:"1",name:"Paid"},
//                 {status_id:"2",name:"Unpaid"},
//             ],
//             defaultValue: status_id
//         };
//         InputBox2.show(inputOptions,(selected)=>{
//             if(!selected) return;
//             if(!AuthManager.allowed(321)) return;
//             const status = {id,status_id:selected.value};
//             vsapi.call(`${mThis.base_url}/prm/tenant/update-status`,status).then(res=>{
//                 if(res.status_code ===200){
//                     InputBox2.close();
//                     cv_interact.success('Invoice Status has been updated');
//                     mThis.InvoicesListView.showPage(mThis.getFilterData());

//                 }else{
//                     cv_interact.error(res.error_message || 'Unable to update status');
//                 }
//             });
//         });

//     };
//     mThis.prepareFormOptions = (onFinish) => {

//         vsapi.call(`${main_view.base_url}/prm/tenant/form-options`, null, null, null)
//             .then(res => {
//                 const d = res.status_code == 200 ? res.data : {};
//                 // VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'tenant_status', true, 'All Statuses', null);
//                 if (typeof onFinish === 'function') onFinish();
//             })
//     }

//     mThis.show = (options) => {
//         mThis.init();
//         mThis.options = options;
//         mThis.prepareFormOptions(()=>{
//             main_view.setContentView(mThis.self, mThis.title_prop);
//             mThis.InvoicesListView.showPage(mThis.getFilterData());
//         });

//     };
//     return mThis;
// })();

// const InvoicesDialog = (() => {
//     const self = {};
//     let dialog = null;

//     self.show = (op) => {
//         dialog =
//             dialog ||
//             new GeneralDialog({
//                 cssClass: "modal-lg",
//                 backdrop: "static",
//                 keyboard: true,
//                createContent: () => {
//                        const today = new Date();
//                         const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//                         const day = String(today.getDate()).padStart(2,'0');
//                         const month = months[today.getMonth()];
//                         const year = today.getFullYear();
//                         const formattedDate = `${day}-${month}-${year}`;

//                         return [
//                             `<div class="row justify-content-center">
//                                 <div class="col-6">
//                                     <div class="material-input outlined">
//                                        <input name="paid_date" type="text" class="form-control form-control-sm" value="${new Date().toLocaleDateString()}" readonly />
//                                         <label>Paid Date</label>
//                                     </div>
//                                 </div>
//                                  <div class="col-6">
//                                     <div class="material-input outlined">
//                                         <select name="from_account" placeholder=" " class="data-input form-control" data-field="from_account">
//                                             <option value="">Select Account</option>
//                                             <option value="1">Financial Account: KHR 69,853 </option>
//                                             <option value="2">Accounting officer: $ 51,941 </option>
//                                             <option value="3">Expense Account: KHR 21222.69 </option>

//                                         </select>
//                                         <label class="d-none">Select Account</label>
//                                     </div>
//                                 </div>
//                                  <div class="col-6">
//                                     <div class="material-input outlined">
//                                         <input type="number" name="building_id" required class="data-input form-control" data-field="building_id" placeholder=" " />
//                                         <label> Available Balance: 228168.88 KHR </label>


//                                     </div>
//                                 </div>
//                                 <div class="col-6">
//                                     <div class="material-input outlined">
//                                         <input type="code" name="building_id" required class="data-input form-control" data-field="building_id" placeholder=" " />
//                                         <label>Reciever Account Number </label>
//                                     </div>
//                                 </div>

//                                 <div class="col-6">
//                                     <div class="material-input outlined">
//                                         <input type="number" name="due_amount" required class="data-input form-control" data-field="due_amount" placeholder=" " />
//                                         <label>Amount</label>
//                                     </div>
//                                 </div>
//                                 <div class="col-6">
//                                     <div class="material-input outlined">
//                                         <input type="text" name="due_amount" required class="data-input form-control" data-field="due_amount" placeholder=" " />
//                                         <label>Category</label>
//                                     </div>
//                                 </div>



//                                 <table class="table header-light-blue">
//                         <thead name="tuition_payment_thead">
//                             <tr>
//                                 <th class="text-nowrap ">Category</th>
//                                 <th class="text-nowrap">Amount</th>
//                                 <th class="text-nowrap ">From Account</th>
//                                 <th class="text-nowrap">To Account</th>
//                                 <th colspan="2" class="text text-nowrap">Remark</th>
//                             </tr>
//                         </thead>
//                         <tbody name="tuition_payment_tbody"></tbody>
//                         <tfoot>
//                             <tr>
//                                 <td colspan="11">

//                                 </td>
//                             </tr>
//                         </tfoot>
//                     </table>


//                             </div>`
//                     ].join("");
//                 },


//                 contentCreated: (me) => {
//                     const footer = me.divModal.querySelector('.modal-footer');
//                     const header = me.divModal.querySelector('.modal-header');

//                     const headerTitle = header.querySelector('.modal-title');
//                     const btnClose = header.querySelector('button');

//                     btnClose.classList.add('d-none');
//                     header.classList.add('bg-yp-custom', 'modal-header-custom');
//                     header.parentElement.classList.add('overflow-hidden');
//                     header.parentElement.style = 'border-radius: 20px !important;';

//                     const headerWrapper = document.createElement('div');
//                     headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');



//                     headerTitle.classList.add('text-white', 'text-center', 'w-100');
//                     headerWrapper.appendChild(headerTitle);

//                     header.innerHTML = '';
//                     header.appendChild(headerWrapper);





//                 },
//                 // configSelect: [
//                 //     {
//                 //         name: "nationality_id",
//                 //         data: "nationality",
//                 //         textField: "nationality",
//                 //         valueField: "id",
//                 //     },

//                 // ],
//                 prepareFormOptions: {
//                     createTitle: "New Expanse",
//                     modifyTitle: "Modify Space ",
//                     targetProp: "building_details",
//                     api: {
//                         endpoint: [main_view.base_url, "/prm/building/form-options",].join(""),
//                         params: (op) => {
//                             return { id: op.id };
//                         },
//                     },
//                 },

//                 onPrepareForm: (me, data) => {
//                     // LocaleManager.translateZone(me.divModal);
//                     // console.log(12,data);
//                     const header = me.divModal.querySelector('.modal-header');
//                     const btnClose = header.querySelector('button');
//                     if(btnClose) btnClose.classList.add('d-none');
//                 },


//                 buttons: [
//                     {
//                         label: '<span>Cancel</span>',
//                         cssClass: 'btn-vs-cancel',
//                         click: (me, btn) => {
//                             me.hide(false);
//                         },
//                     },
//                     {
//                         label: '<span>Submit</span>',
//                         cssClass: 'btn-vs-save',
//                         click: (me, btn) => {
//                             const op = me.getData();
//                             op.id = me.dataOptions.id;
//                             vsapi.call([main_view.base_url, "/prm/tenant/create",].join(""), op, btn, null).then((res) => {
//                                 if (res.status_code === 200) {
//                                     me.hide(true, op);
//                                     if (me.dataOptions.id > 0) {
//                                         cv_interact.success(
//                                             "Billing has been updated successfully"
//                                         );
//                                     } else {
//                                         cv_interact.success(
//                                             "New Billing has been added successfully"
//                                         );
//                                     }
//                                 } else {
//                                     cv_interact.error(res.error_message);
//                                 }
//                             });
//                         },
//                     },
//                 ],
//             });
//         dialog.show(op);
//     };


//     return self;
// })();


