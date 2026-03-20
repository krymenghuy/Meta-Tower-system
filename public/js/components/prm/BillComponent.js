"use strict";
var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bills";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector('#_bill_vendor_id');
    mThis.elFilter_status = mThis.self.querySelector('#_bill_status_id');
    mThis.elSearch = mThis.self.querySelector("#_search_bill");

    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        
        {
            transTitle: "titles.Vendor Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.vendor_name ?? ""}</span>`;
            }
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone_number ?? ""}</span>`
        },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom"> ${data.bill_number ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Bill Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.bill_date ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.due_date ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Sub-total",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.sub_total ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Grand Total",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.grand_total ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Description",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remark ?? '___'}</span>
                    </div>
                `;
            }
        }, 
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {

                const status = (data.status ?? '').toLowerCase();
                let cls = 'badge text-dark bg-warning-subtle border border-warning';
                if (status === 'active') {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }
                else if (status === 'inactive') {
                    cls = 'badge text-dark bg-danger-subtle border border-danger';
                }
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:70px">
                        ${data.status ?? ''}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_bill_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },


    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillListView = new ListView('_bill_list', {
            fetchApi: `${main_view.base_url}/prm/vendor/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add('vendor');
                tr.setAttribute('id', ['vendor_id', data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BillListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            showBillDialog(op);
        };


        mThis.pr_tbl = mThis.BillListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        }
        mThis.tblVendor = mThis.BillListView.getTable();
        mThis.initDropdownMenus(mThis.tblVendor);
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
           
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {

        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_bill_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-bolt fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_bill_status"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Bill"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Bill"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'change_bill_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'modify_bill': {
                        mThis.editBill(id, menuLink);
                        break;
                    }
                    case 'delete_bill': {
                        mThis.deleteBill(id, menuLink);
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
      mThis.changeStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";
        console.log(123,status_id);
        
        const inputOptions = {
            context: "success",
            title: "Change Status",
            label: "Vendor Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: "Save",
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Active" },
                { status_id: "2", name: "Inactive" },
            ],
            defaultValue: status_id,
            onConfirm: (status, btn, me) => {
                const payload = { id, status_id: status.status_id };
                vsapi
                    .post(
                        `${mThis.base_url}/prm/bill/update-status`,
                        payload,
                        { loader: false, agent: btn },
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success(
                                "Vendor status has been updated",
                            );
                            mThis.BillListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            me.setError(
                                res.error_message || "Unable to update status",
                            );
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };
    mThis.editBill = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };

        showBillDialog.show(op);
    }
    mThis.deleteBill = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Bill?', {
            transTitle: 'Delete Bill',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/bill/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.BillListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/vendor/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
               
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();



// const CreateBillDialog = (() => {
//     const self = {};
//     let dialog = null;

//     self.show = (op) => {
//         dialog =
//             dialog ||
//             new GeneralDialog({
//                 cssClass: "modal-lg vs-modal",
//                 backdrop: "static",
//                 keyboard: true,
//                 createContent: () => {
//                     return `
//                 <div class="vendor-form row p-1">
//                         <div class="col-12 row pb-3">
//                             <div class="col-6">
//                                 <div class="material-input outlined">
//                                     <select data-style="material" name="vendor_id" class="data-input form-control" data-field="vendor_id" placeholder="Vendor Name">
//                                     </select>
//                                 </div>
//                             </div>
//                             <div class="col-6">
//                                 <div class="material-input outlined">
//                                     <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" "></input>
//                                     <label style="color:#777777; padding-left:6px;">Vendor Contact</label>
//                                 </div>
//                             </div>
                            
//                             <div class="col-6">
//                                 <div class="material-input outlined">
//                                     <input type="text" name="name" class="data-input form-control" data-field="bill_number" placeholder=" " />
//                                     <label style="color:#777777;padding-left:6px;">Bill Number</label>
//                                 </div>
//                             </div>
//                             <div class="col-12 col-md-6">
//                                 <div class="material-input outlined">
//                                     <input type="file" name="file_image" class="data-input form-control" data-field="file_image" placeholder=" " />
//                                     <label style="color:#777777;padding-left:6px;">File Image </label>
//                                 </div>
//                             </div>
//                             <div class="col-6">
//                                 <div class="material-input outlined">
//                                     <input type="text" data-type="date" name="bill_date" required class="data-input form-control form_input" data-field="bill_date" />
//                                     <label style="color:#777777;padding-left:6px;">Bill Date</label>
//                                 </div>
//                             </div>
//                             <div class="col-6">
//                                 <div class="material-input outlined">
//                                     <input type="text" data-type="date" name="due_date" required class="data-input form-control form_input" data-field="due_date" />
//                                     <label style="color:#777777;padding-left:6px;">Due Date</label>
//                                 </div>
//                             </div>
                            

//                             <div class="col-12 col-md-6">
//                                 <div class="material-input outlined">
//                                     <input type="email" name="email" class="data-input form-control" data-field="sub_total" placeholder=" " />
//                                     <label style="color:#777777;padding-left:6px;">Subtotal</label>
//                                 </div>
//                             </div>
//                             <div class="col-12 col-md-6">
//                                 <div class="material-input outlined">
//                                     <input type="email" name="email" class="data-input form-control" data-field="grand_total" placeholder=" " />
//                                     <label style="color:#777777;padding-left:6px;">Grand Total</label>
//                                 </div>
//                             </div>
//                             <div class="col-12">
//                                 <div class="material-input outlined">
//                                     <textarea name="description" class="data-input form-control" data-field="remark" rows="3" placeholder="" ></textarea> 
//                                     <label style="color:#777777;padding-left:6px;">Remark</label>
//                                 </div>
//                             </div>
//                          </div>

//                 </div>
//                 `;

//                 },

//                 contentCreated: (me) => {
//                 },
//                 configSelect: [
//                     {
//                         name: "vendor_type_id",
//                         data: "types",
//                         textField: "vendor_type",
//                         valueField: "id",
//                     },
//                     {
//                         name: "vendor_category_id",
//                         data: "categories",
//                         textField: "vendor_category",
//                         valueField: "id",
//                     },

//                 ],
//                 prepareFormOptions: {
//                     createTitle: "Add New Bill",
//                     modifyTitle: "Modify Bill",
//                     targetProp: "bill_details",
//                     api: {
//                         endpoint: [main_view.base_url, "/prm/vendor/form-options",].join(""),
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
//                     if (btnClose) btnClose.classList.add('d-none');
//                 },


//                 buttons: [
//                     {
//                         label: '<span vslang="buttons.Cancel"></span>',
//                         cssClass: 'btn btn-secondary',
//                         click: (me, btn) => {
//                             me.hide(false);
//                         },
//                     },
//                     {
//                         label: '<span vslang="buttons.Save"></span>',
//                         cssClass: 'btn btn-primary',
//                         click: (me, btn) => {
//                             const op = me.getData();
//                             op.id = me.dataOptions.id;
//                             vsapi.call([main_view.base_url, "/prm/vendor/save",].join(""), op, btn, null).then((res) => {
//                                 if (res.status_code === 200) {
//                                     me.hide(true, op);
//                                     if (me.dataOptions.id > 0) {
//                                         cv_interact.success(
//                                             "Vendor has been updated successfully"
//                                         );
//                                     } else {
//                                         cv_interact.success(
//                                             "New vendor has been added successfully"
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



/**
 * Global variable to track current edit ID (similar to your PO logic)
 */
let _currentEditBillId = null;
let CreateBillDialog = null;


// const showBillDialog = (op) => {

//     const calcGrandTotal = (me) => {
//         const subTotal  = parseFloat(me.controls.sub_total?.value)    || 0;
//         const discVal   = parseFloat(me.controls.discount_val?.value) || 0;
//         const taxVal    = parseFloat(me.controls.tax_val?.value)      || 0;

//         const discType  = me._discountType || '$';   // '$' or '%'
//         const taxType   = me._taxType      || '%';   // '$' or '%'

//         const discAmt   = discType === '%' ? subTotal * (discVal / 100) : discVal;
//         const taxAmt    = taxType  === '%' ? subTotal * (taxVal  / 100) : taxVal;

//         const grand = Math.max(0, subTotal - discAmt + taxAmt);

//         // Write back to hidden grand_total
//         if (me.controls.grand_total) {
//             me.controls.grand_total.value = grand.toFixed(2);
//         }

//         // Update summary display labels
//         const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//         const subEl   = me.divModal.querySelector('.calc-sub-display');
//         const discEl  = me.divModal.querySelector('.calc-disc-display');
//         const taxEl   = me.divModal.querySelector('.calc-tax-display');
//         const grandEl = me.divModal.querySelector('.calc-grand-display');

//         if (subEl)   subEl.textContent   = `$ ${fmt(subTotal)}`;
//         if (discEl)  discEl.textContent  = discVal > 0 ? `\u2212 $ ${fmt(discAmt)}` : '\u2014';
//         if (taxEl)   taxEl.textContent   = taxVal  > 0 ? `+ $ ${fmt(taxAmt)}`       : '\u2014';
//         if (grandEl) grandEl.textContent = `$ ${fmt(grand)}`;

//         if (discEl) discEl.style.color = discVal > 0 ? '#d97706' : '#b0b8cc';
//         if (taxEl)  taxEl.style.color  = taxVal  > 0 ? '#22a06b' : '#b0b8cc';
//     };

//     // ─── Load for Edit ─────────────────────────────────────────────────────────
//     const loadBillForEdit = (me, editBillId) => {
//         if (!me || !editBillId) return Promise.resolve(null);

//         return vsapi.call(`${main_view.base_url}/prm/bill/form-options`, { id: editBillId }, null, false)
//             .then(formRes => {
//                 if (!formRes || formRes.status_code !== 200)
//                     throw new Error(formRes?.error_message || 'Failed to load bill details');

//                 const titleEl = me.divModal?.querySelector('.modal-title');
//                 if (titleEl) titleEl.innerHTML = '<h2 class="text-prm-custom text-start fw-bold">Modify Bill</h2>';

//                 const d = (formRes.data || {}).bill_details || {};

//                 if (me.controls.vendor_id)    me.controls.vendor_id.value    = d.vendor_id    || '';
//                 if (me.controls.vendor)       me.controls.vendor.value       = d.vendor_name  || '';
//                 if (me.controls.po_ref)       me.controls.po_ref.value       = d.po_number    || '';
//                 if (me.controls.bill_number)  me.controls.bill_number.value  = d.bill_number  || '';
//                 if (me.controls.receive_date) me.controls.receive_date.value = d.receive_date || '';
//                 if (me.controls.due_date)     me.controls.due_date.value     = d.due_date     || '';
//                 if (me.controls.sub_total)    me.controls.sub_total.value    = d.sub_total    || '';
//                 if (me.controls.discount_val) me.controls.discount_val.value = d.discount_val || '';
//                 if (me.controls.tax_val)      me.controls.tax_val.value      = d.tax_val      || '';
//                 if (me.controls.remark)       me.controls.remark.value       = d.remark       || '';
//                 if (me.controls.status)       me.controls.status.value       = d.status_id    || '0';

//                 // Restore toggle types
//                 me._discountType = d.discount_type || '$';
//                 me._taxType      = d.tax_type      || '%';
//                 const discBtn = me.divModal.querySelector('.disc-type-btn .type-label');
//                 const taxBtn  = me.divModal.querySelector('.tax-type-btn  .type-label');
//                 if (discBtn) discBtn.textContent = me._discountType;
//                 if (taxBtn)  taxBtn.textContent  = me._taxType;

//                 // Restore photo
//                 if (me.controls.photo_preview && d.photo_path) {
//                     me.controls.photo_preview.src = d.photo_path;
//                     me.controls.photo_preview.style.display = 'block';
//                     const hint = me.divModal.querySelector('.upload-hint');
//                     if (hint) hint.style.display = 'none';
//                     me.divModal.querySelector('.bill-upload-box')?.classList.add('has-image');
//                 }

//                 me._selectedVendorId = d.vendor_id;
//                 calcGrandTotal(me);
//             });
//     };

//     // ─── Dialog ────────────────────────────────────────────────────────────────
//     CreateBillDialog = CreateBillDialog || new GeneralDialog({
//         cssClass: "modal-lg vs-modal",
//         createContent: () => {
//             return `
//             <style>
//                 /* ══ Calculator Widget ══ */
//                 .calc-widget {
//                     background: #f8f9fb;
//                     border: 1px solid #e8ebf2;
//                     border-radius: 10px;
//                     padding: 12px 16px;
//                     margin-top: 8px;
//                 }
//                 .calc-row {
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     padding: 7px 0;
//                 }
//                 .calc-row + .calc-row { border-top: 1px dashed #eef0f4; }
//                 .calc-label {
//                     font-size: 13px;
//                     font-weight: 600;
//                     color: #4a5264;
//                     min-width: 75px;
//                 }
//                 .calc-right {
//                     display: flex;
//                     align-items: center;
//                     gap: 8px;
//                 }
//                 .calc-display-val {
//                     font-size: 13px;
//                     font-weight: 700;
//                     min-width: 90px;
//                     text-align: right;
//                     color: #9ba3b8;
//                     font-variant-numeric: tabular-nums;
//                     transition: color 0.2s;
//                 }
//                 .calc-sub-display  { color: #1e2333 !important; }
//                 .calc-grand-display {
//                     font-size: 15px !important;
//                     color: #4c72f0 !important;
//                 }
//                 .calc-row.grand-row {
//                     border-top: 1.5px solid #dde2ef !important;
//                     padding-top: 10px;
//                     margin-top: 2px;
//                 }

//                 /* ══ Input + type toggle ══ */
//                 .calc-input-wrap {
//                     display: flex;
//                     align-items: stretch;
//                     background: #fff;
//                     border: 1.5px solid #e8ebf2;
//                     border-radius: 8px;
//                     overflow: visible;       /* allow dropdown to escape */
//                     width: 158px;
//                     transition: border-color 0.2s, box-shadow 0.2s;
//                 }
//                 .calc-input-wrap:focus-within {
//                     border-color: #4c72f0;
//                     box-shadow: 0 0 0 3px rgba(76,114,240,0.1);
//                 }
//                 .calc-input-wrap input {
//                     border: none; outline: none; background: transparent;
//                     flex: 1; padding: 7px 10px;
//                     font-size: 13px; font-weight: 600; color: #1e2333;
//                     min-width: 0;
//                     font-variant-numeric: tabular-nums;
//                 }
//                 .calc-input-wrap input::placeholder { font-weight: 400; color: #c0c7d8; }

//                 /* Toggle button */
//                 .calc-type-btn {
//                     position: relative;
//                     display: flex; align-items: center; gap: 4px;
//                     padding: 7px 10px;
//                     background: #f1f4fb;
//                     border-left: 1.5px solid #e8ebf2;
//                     border-radius: 0 6px 6px 0;
//                     cursor: pointer;
//                     font-size: 11.5px; font-weight: 700; color: #4c72f0;
//                     user-select: none;
//                     transition: background 0.15s;
//                     white-space: nowrap;
//                 }
//                 .calc-type-btn:hover { background: #e6eaff; }
//                 .calc-type-btn .chevron { font-size: 8px; opacity: .65; }

//                 /* Dropdown */
//                 .calc-type-menu {
//                     display: none;
//                     position: absolute;
//                     right: 0; top: calc(100% + 5px);
//                     background: #fff;
//                     border: 1.5px solid #e8ebf2;
//                     border-radius: 8px;
//                     box-shadow: 0 8px 24px rgba(0,0,0,0.1);
//                     z-index: 9999;
//                     min-width: 130px;
//                     overflow: hidden;
//                 }
//                 .calc-type-option {
//                     padding: 9px 14px;
//                     font-size: 12.5px; font-weight: 600; color: #4a5264;
//                     cursor: pointer;
//                     display: flex; align-items: center; gap: 7px;
//                     transition: background 0.12s;
//                 }
//                 .calc-type-option:hover  { background: #f1f4ff; color: #4c72f0; }
//                 .calc-type-option.active { background: #eef1ff; color: #4c72f0; }

//                 /* ══ Upload box ══ */
//                 .bill-upload-box {
//                     border: 2px dashed #dde2ef;
//                     border-radius: 8px;
//                     height: 86px; cursor: pointer;
//                     display: flex; align-items: center; justify-content: center;
//                     background: #f8fafc;
//                     transition: all 0.2s;
//                     position: relative; overflow: hidden;
//                 }
//                 .bill-upload-box:hover { background: #f0f3ff; border-color: #4c72f0; }
//                 .bill-upload-box.has-image { border-style: solid; border-color: #e0e4ed; }
//                 .bill-upload-box img { width:100%; height:100%; object-fit:contain; }

//                 /* ══ Due warning ══ */
//                 .due-warning { font-size: 11px; margin-top: 3px; display:none; }
//                 .due-warning.show { display: block; }
//             </style>

//             <div class="row mb-2">

//                 <!-- ════ LEFT COLUMN ════ -->
//                 <div class="col-md-6">

//                     <div class="d-flex align-items-center mb-2">
//                         <span class="fw-bold" style="min-width:115px;">Vendor</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <input name="vendor" class="form-control flex-grow-1" placeholder="Search vendor…">
//                         <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
//                     </div>

//                     <div class="d-flex align-items-center mb-2">
//                         <span class="fw-bold" style="min-width:115px;">PO Ref</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <input type="text" name="po_ref" class="data-input form-control flex-grow-1" data-field="po_ref" placeholder="Linked PO #">
//                     </div>

//                     <div class="d-flex align-items-center mb-2">
//                         <span class="fw-bold" style="min-width:115px;">Bill #</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <input type="text" name="bill_number" class="data-input form-control flex-grow-1" data-field="bill_number" placeholder="INV-0000">
//                     </div>

//                     <div class="d-flex align-items-center mb-2">
//                         <span class="fw-bold" style="min-width:115px;">Receive Date</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <input type="date" name="receive_date" class="data-input form-control flex-grow-1" data-field="receive_date">
//                     </div>

//                     <div class="d-flex align-items-center mb-1">
//                         <span class="fw-bold" style="min-width:115px;">Due Date</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <input type="date" name="due_date" class="data-input form-control flex-grow-1" data-field="due_date">
//                     </div>
//                     <div class="due-warning ps-1">
//                         <i class="fa fa-exclamation-circle me-1"></i>
//                         <span class="due-warning-text"></span>
//                     </div>

//                     <div class="d-flex align-items-center mb-2 mt-2">
//                         <span class="fw-bold" style="min-width:115px;">Status</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <select name="status" class="data-input form-control flex-grow-1" data-field="status">
//                             <option value="0">Unpaid</option>
//                             <option value="1">Partial</option>
//                             <option value="2">Paid</option>
//                         </select>
//                     </div>

//                     <div class="d-flex align-items-start mb-2">
//                         <span class="fw-bold pt-2" style="min-width:115px;">Remark</span>
//                         <span class="mx-2 fw-bold text-muted pt-2">:</span>
//                         <textarea name="remark" class="data-input form-control flex-grow-1" data-field="remark" rows="2" placeholder="Internal notes…"></textarea>
//                     </div>

//                 </div>

//                 <div class="col-md-6">

//                     <div class="d-flex align-items-center mb-1">
//                         <span class="fw-bold" style="min-width:115px;">Total Amount</span>
//                         <span class="mx-2 fw-bold text-muted">:</span>
//                         <input type="number" name="sub_total" class="data-input form-control flex-grow-1"
//                                data-field="sub_total" placeholder="0.00" step="0.01" min="0">
//                     </div>

//                     <!-- ── Discount / Tax / Grand Total widget ── -->
//                     <div class="calc-widget">

//                         <div class="calc-row">
//                             <span class="calc-label">Total </span>
//                             <span class="calc-display-val calc-sub-display">$ 0.00</span>
//                         </div>

//                         <!-- Discount row -->
//                         <div class="calc-row">
//                             <span class="calc-label">Discount</span>
//                             <div class="calc-right">
//                                 <span class="calc-display-val calc-disc-display">—</span>
//                                 <div class="calc-input-wrap">
//                                     <input type="number" name="discount_val" class="data-input"
//                                            data-field="discount_val" placeholder="0" min="0" step="0.01">
//                                     <div class="calc-type-btn disc-type-btn">
//                                         <span class="type-label">$</span>
//                                         <i class="fa fa-chevron-down chevron"></i>
//                                         <div class="calc-type-menu">
//                                             <div class="calc-type-option active" data-type="$">
//                                                 <i class="fa fa-dollar"></i> Flat ($)
//                                             </div>
//                                             <div class="calc-type-option" data-type="%">
//                                                 <i class="fa fa-percent"></i> Percent (%)
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <!-- Tax row -->
//                         <div class="calc-row">
//                             <span class="calc-label">Tax</span>
//                             <div class="calc-right">
//                                 <span class="calc-display-val calc-tax-display">—</span>
//                                 <div class="calc-input-wrap">
//                                     <input type="number" name="tax_val" class="data-input"
//                                            data-field="tax_val" placeholder="0" min="0" step="0.01">
//                                     <div class="calc-type-btn tax-type-btn">
//                                         <span class="type-label">%</span>
//                                         <i class="fa fa-chevron-down chevron"></i>
//                                         <div class="calc-type-menu">
//                                             <div class="calc-type-option" data-type="$">
//                                                 <i class="fa fa-dollar"></i> Flat ($)
//                                             </div>
//                                             <div class="calc-type-option active" data-type="%">
//                                                 <i class="fa fa-percent"></i> Percent (%)
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <!-- Grand Total -->
//                         <div class="calc-row grand-row">
//                             <span class="calc-label fw-bold" style="color:#4c72f0;font-size:14px;">Grand Total</span>
//                             <span class="calc-display-val calc-grand-display">$ 0.00</span>
//                         </div>

//                         <!-- Hidden field submitted to API -->
//                         <input type="hidden" name="grand_total" class="data-input" data-field="grand_total" value="0">
//                     </div>

//                     <!-- Upload -->
//                     <div class="mt-3">
//                         <span class="fw-bold d-block mb-2" style="font-size:13px;">
//                             Bill Photo / Evidence
//                         </span>
//                         <div class="bill-upload-box" onclick="this.querySelector('input[type=file]').click()">
//                             <img name="photo_preview" src="" style="display:none;" alt="receipt">
//                             <div class="upload-hint text-muted" style="font-size:13px;">
//                                 <i class="fa fa-camera me-1"></i> Click to upload
//                             </div>
//                             <input type="file" name="bill_photo" class="d-none" accept="image/*"
//                                 onchange="
//                                     const box  = this.closest('.bill-upload-box');
//                                     const img  = box.querySelector('img');
//                                     const hint = box.querySelector('.upload-hint');
//                                     if(this.files[0]){
//                                         img.src = URL.createObjectURL(this.files[0]);
//                                         img.style.display  = 'block';
//                                         hint.style.display = 'none';
//                                         box.classList.add('has-image');
//                                     }
//                                 ">
//                         </div>
//                     </div>

//                 </div>
//             </div>`;
//         },

//         contentCreated: (me) => {
//             // Vendor autocomplete
//             if (me.controls.vendor) {
//                 me.searchVendor = VSSearchInput.init(me.controls.vendor, {
//                     type: 'select', prefetch: true,
//                     api: { endpoint: `${main_view.base_url}/prm/purchase/order/form-options` },
//                     onSelect: (vendor) => {
//                         me.controls.vendor_id.value = vendor?.id || '';
//                         me._selectedVendorId = vendor?.id;
//                     }
//                 });
//             }

//             // Default types
//             me._discountType = '$';
//             me._taxType      = '%';

//             // Type-menu option click handler
//             me.divModal.querySelectorAll('.calc-type-menu .calc-type-option').forEach(opt => {
//                 opt.addEventListener('click', function (e) {
//                     e.stopPropagation();
//                     const menu   = this.closest('.calc-type-menu');
//                     const btn    = menu.closest('.calc-type-btn');
//                     const type   = this.dataset.type;
//                     const isDisc = btn.classList.contains('disc-type-btn');

//                     if (isDisc) me._discountType = type;
//                     else        me._taxType      = type;

//                     btn.querySelector('.type-label').textContent = type;
//                     menu.querySelectorAll('.calc-type-option').forEach(o => o.classList.remove('active'));
//                     this.classList.add('active');
//                     menu.style.display = 'none';
//                     calcGrandTotal(me);
//                 });
//             });

//             // Toggle open/close on button click
//             me.divModal.querySelectorAll('.calc-type-btn').forEach(btn => {
//                 btn.addEventListener('click', function (e) {
//                     e.stopPropagation();
//                     const menu   = this.querySelector('.calc-type-menu');
//                     const isOpen = menu.style.display === 'block';
//                     me.divModal.querySelectorAll('.calc-type-menu').forEach(m => m.style.display = 'none');
//                     if (!isOpen) menu.style.display = 'block';
//                 });
//             });

//             // Close menus on outside click
//             document.addEventListener('click', () => {
//                 me.divModal?.querySelectorAll('.calc-type-menu').forEach(m => m.style.display = 'none');
//             });

//             // Live recalc
//             ['sub_total', 'discount_val', 'tax_val'].forEach(field => {
//                 me.controls[field]?.addEventListener('input', () => calcGrandTotal(me));
//             });

//             // Due date warning
//             const dueDateInput = me.controls.due_date;
//             const warnEl       = me.divModal.querySelector('.due-warning');
//             const warnText     = me.divModal.querySelector('.due-warning-text');
//             const checkDueDate = () => {
//                 if (!dueDateInput?.value) { warnEl.classList.remove('show'); return; }
//                 const today    = new Date(); today.setHours(0,0,0,0);
//                 const diffDays = Math.ceil((new Date(dueDateInput.value) - today) / 86400000);
//                 if (diffDays < 0) {
//                     warnText.textContent = `Overdue by ${Math.abs(diffDays)} day(s)`;
//                     warnEl.style.color   = '#d93025';
//                     warnEl.classList.add('show');
//                 } else if (diffDays <= 3) {
//                     warnText.textContent = `Due in ${diffDays} day(s)`;
//                     warnEl.style.color   = '#d97706';
//                     warnEl.classList.add('show');
//                 } else {
//                     warnEl.classList.remove('show');
//                 }
//             };
//             dueDateInput?.addEventListener('change', checkDueDate);
//         },

//         onShow: (me) => {
//             const editBillId = op.id || me._editBillId;
//             if (editBillId) {
//                 setTimeout(() => loadBillForEdit(me, editBillId), 100);
//             } else {
//                 me.clear();
//                 me._discountType = '$';
//                 me._taxType      = '%';

//                 // Reset toggle labels
//                 const dl = me.divModal.querySelector('.disc-type-btn .type-label');
//                 const tl = me.divModal.querySelector('.tax-type-btn .type-label');
//                 if (dl) dl.textContent = '$';
//                 if (tl) tl.textContent = '%';

//                 // Reset photo
//                 const box  = me.divModal.querySelector('.bill-upload-box');
//                 const hint = me.divModal.querySelector('.upload-hint');
//                 const prev = me.divModal.querySelector('img[name="photo_preview"]');
//                 if (box)  box.classList.remove('has-image');
//                 if (hint) hint.style.display = '';
//                 if (prev) prev.style.display = 'none';

//                 me.divModal.querySelector('.due-warning')?.classList.remove('show');
//                 calcGrandTotal(me);
//             }
//         },

//         buttons: [
//             {
//                 label: "Cancel",
//                 cssClass: "btn btn-warning",
//                 click: (me) => me.hide(false)
//             },
//             {
//                 label: "<span>Save Bill</span>",
//                 cssClass: "btn btn-primary",
//                 click: (me) => {
//                     calcGrandTotal(me); // ensure latest value
//                     const formData = new FormData();
//                     const p = me.getData();

//                     p.vendor_id     = me._selectedVendorId;
//                     p.discount_type = me._discountType || '$';
//                     p.tax_type      = me._taxType      || '%';

//                     Object.keys(p).forEach(key => formData.append(key, p[key]));

//                     const fileInput = me.divModal.querySelector('input[name="bill_photo"]');
//                     if (fileInput?.files[0]) formData.append('photo', fileInput.files[0]);

//                     vsapi.post(`${main_view.base_url}/prm/purchase/bill/save`, formData).then(res => {
//                         if (res.status_code == 200) {
//                             cv_interact.success('Bill saved successfully.');
//                             me.hide(true);
//                             if (typeof op.onClose === 'function') op.onClose();
//                         } else {
//                             cv_interact.warning(res.error_message);
//                         }
//                     });
//                 }
//             }
//         ]
//     });

//     CreateBillDialog.show(op);
// };


const showBillDialog = (op) => {
    const loadBillForEdit = (me, editBillId) => {
        if (!me || !editBillId) return Promise.resolve(null);

        return vsapi.call(`${main_view.base_url}/prm/bill/form-options`, { id: editBillId }, null, false)
            .then(formRes => {
                if (!formRes || formRes.status_code !== 200) {
                    throw new Error(formRes?.error_message || 'Failed to load bill details');
                }

                const titleEl = me.divModal?.querySelector('.modal-title');
                if (titleEl) titleEl.innerHTML = '<span class="fw-semibold">Modify Bill</span>';

                const billDetails = (formRes.data || {}).bill_details || {};

                if (me.controls.vendor_id)    me.controls.vendor_id.value    = billDetails.vendor_id    || '';
                if (me.controls.vendor)       me.controls.vendor.value       = billDetails.vendor_name  || '';
                if (me.controls.po_ref)       me.controls.po_ref.value       = billDetails.po_number    || '';
                if (me.controls.bill_number)  me.controls.bill_number.value  = billDetails.bill_number  || '';
                if (me.controls.receive_date) me.controls.receive_date.value = billDetails.receive_date || '';
                if (me.controls.due_date)     me.controls.due_date.value     = billDetails.due_date     || '';
                if (me.controls.sub_total)    me.controls.sub_total.value    = billDetails.sub_total    || '';
                if (me.controls.amount_paid)  me.controls.amount_paid.value  = billDetails.amount_paid  || '';
                if (me.controls.remark)       me.controls.remark.value       = billDetails.remark       || '';

                if (me.controls.photo_preview && billDetails.photo_path) {
                    me.controls.photo_preview.src = billDetails.photo_path;
                    me.controls.photo_preview.style.display = 'block';
                    const placeholder = me.divModal.querySelector('.upload-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                }

                me._selectedVendorId = billDetails.vendor_id;

                // Recalc after loading edit data
                if (typeof me.calcPayment === 'function') me.calcPayment();
            });
    };

    CreateBillDialog = CreateBillDialog || new GeneralDialog({
        cssClass: "modal-lg vs-modal",
        createContent: () => {
            return `
            <style>
                .bill-section-title {
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid #e9ecef;
                }
                .bill-field-group {
                    margin-bottom: 14px;
                }
                .bill-field-group label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 4px;
                }
                .bill-field-group .form-control,
                .bill-field-group select {
                    font-size: 13px;
                    height: 36px;
                    border-color: #dee2e6;
                    border-radius: 6px;
                    background-color: #fff;
                    transition: border-color 0.15s ease;
                }
                .bill-field-group textarea.form-control {
                    height: auto;
                }
                .bill-field-group .form-control:focus,
                .bill-field-group select:focus {
                    border-color: #86b7fe;
                    box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
                }
                .bill-card {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    padding: 18px 20px;
                    margin-bottom: 16px;
                }
                .bill-upload-box {
                    border: 2px dashed #ced4da;
                    border-radius: 8px;
                    background: #fff;
                    height: 90px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #adb5bd;
                    font-size: 13px;
                    transition: border-color 0.2s, color 0.2s;
                }
                .bill-upload-box:hover {
                    border-color: #86b7fe;
                    color: #0d6efd;
                }
                .bill-upload-box img {
                    max-height: 80px;
                    border-radius: 4px;
                    display: none;
                }
                .bill-summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 0;
                    font-size: 13px;
                }
                .bill-summary-row .label {
                    color: #6c757d;
                    font-weight: 500;
                }
                .bill-divider {
                    border: none;
                    border-top: 1px solid #e9ecef;
                    margin: 8px 0;
                }
                .bill-amount-input {
                    width: 130px;
                    border-radius: 6px;
                    font-size: 13px;
                    text-align: right;
                    height: 34px;
                    border: 1px solid #dee2e6;
                    padding: 0 10px;
                    transition: border-color 0.15s ease;
                }
                .bill-amount-input:focus {
                    outline: none;
                    border-color: #86b7fe;
                    box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
                }
            </style>

            <div class="row g-3 px-1 pt-1">

                <!-- LEFT COLUMN -->
                <div class="col-md-7">

                    <!-- Vendor Info -->
                    <div class="bill-card">
                        <div class="bill-section-title">Vendor Info</div>
                        <div class="bill-field-group">
                            <label>Vendor</label>
                            <input name="vendor" class="form-control" placeholder="Search vendor...">
                            <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                        </div>
                        <div class="row g-2">
                            <div class="col-6 bill-field-group">
                                <label>PO Reference</label>
                                <input type="text" name="po_ref" class="data-input form-control"
                                    data-field="po_ref" placeholder="Linked PO #">
                            </div>
                            <div class="col-6 bill-field-group mb-0">
                                <label>Bill Number</label>
                                <input type="text" name="bill_number" class="data-input form-control"
                                    data-field="bill_number" placeholder="e.g. INV-0001">
                            </div>
                        </div>
                    </div>

                    <!-- Dates -->
                    <div class="bill-card">
                        <div class="bill-section-title">Dates</div>
                        <div class="row g-2">
                            <div class="col-6 bill-field-group mb-0">
                                <label>Receive Date</label>
                                <input type="date" name="receive_date" class="data-input form-control"
                                    data-field="receive_date">
                            </div>
                            <div class="col-6 bill-field-group mb-0">
                                <label>Due Date</label>
                                <input type="date" name="due_date" class="data-input form-control"
                                    data-field="due_date">
                            </div>
                        </div>
                    </div>

                    <!-- Remark -->
                    <div class="bill-card mb-0">
                        <div class="bill-section-title">Remark</div>
                        <div class="bill-field-group mb-0">
                            <textarea name="remark" class="data-input form-control" data-field="remark"
                                rows="3" placeholder="Optional note..."></textarea>
                        </div>
                    </div>

                </div>

                <!-- RIGHT COLUMN -->
                <div class="col-md-5">

                    <!-- Payment -->
                    <div class="bill-card">
                        <div class="bill-section-title">Payment</div>

                        <!-- Sub Total -->
                        <div class="bill-summary-row mb-2">
                            <span class="label">Total Amount:</span>
                            <input type="number" name="sub_total"
                                class="data-input bill-amount-input"
                                data-field="sub_total" placeholder="0.00" min="0" step="0.01">
                        </div>

                        <hr class="bill-divider">

                        <!-- Amount Paid -->
                        <div class="bill-summary-row mb-2">
                            <span class="label">Amount Paid :</span>
                            <input type="number" name="amount_paid"
                                class="data-input bill-amount-input"
                                data-field="amount_paid" placeholder="0.00" min="0" step="0.01">
                        </div>

                        <hr class="bill-divider">

                        <!-- Balance Due -->
                        <div class="bill-summary-row mb-2">
                            <span class="label" style="color:#dc3545; font-weight:600;">Balance Due :</span>
                            <span id="bill_balance_display"
                                style="font-weight:700; font-size:14px; color:#dc3545;">$ 0.00</span>
                            <input type="hidden" name="grand_total" class="data-input"
                                data-field="grand_total" value="0">
                        </div>

                        <hr class="bill-divider">

                        <!-- Auto Status Badge -->
                        <div class="bill-summary-row mt-1">
                            <span class="label">Status :</span>
                            <span id="bill_status_badge"
                                class="badge rounded-pill px-3 py-2"
                                style="font-size:12px; background:#fff0f0; color:#dc3545; border:1px solid #dc3545;">
                                 Unpaid
                            </span>
                            <input type="hidden" name="status" class="data-input"
                                data-field="status" value="0">
                        </div>
                    </div>

                    <!-- Photo Upload -->
                    <div class="bill-card mb-0">
                        <div class="bill-section-title">Bill Photo / Evidence</div>
                        <div class="bill-upload-box" onclick="this.querySelector('input').click()">
                            <img name="photo_preview" src="">
                            <span class="upload-placeholder">
                                <i class="fa fa-camera me-1"></i> Click to upload
                            </span>
                            <input type="file" name="bill_photo" class="d-none" accept="image/*"
                                onchange="
                                    const img = this.parentElement.querySelector('img');
                                    const ph  = this.parentElement.querySelector('.upload-placeholder');
                                    img.src = URL.createObjectURL(this.files[0]);
                                    img.style.display = 'block';
                                    if (ph) ph.style.display = 'none';
                                ">
                        </div>
                    </div>

                </div>
            </div>`;
        },

        contentCreated: (me) => {
            // Vendor search
            if (me.controls.vendor) {
                me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                    type: 'select',
                    prefetch: true,
                    api: { endpoint: `${main_view.base_url}/prm/purchase/order/form-options` },
                    onSelect: (vendor) => {
                        me.controls.vendor_id.value = vendor?.id || '';
                        me._selectedVendorId = vendor?.id;
                    }
                });
            }

            // Payment calculation logic
            me.calcPayment = () => {
                const modal      = me.divModal;
                const subTotal   = parseFloat(modal.querySelector('[name="sub_total"]')?.value)   || 0;
                const amtPaid    = parseFloat(modal.querySelector('[name="amount_paid"]')?.value) || 0;
                const balance    = Math.max(0, subTotal - amtPaid);

                // Update balance display
                const balanceEl = modal.querySelector('#bill_balance_display');
                if (balanceEl) balanceEl.textContent = '$ ' + balance.toFixed(2);

                // Update grand_total hidden field
                const gtInput = modal.querySelector('[name="grand_total"]');
                if (gtInput) gtInput.value = subTotal.toFixed(2);

                // Auto-detect status
                let statusVal  = '0';
                let badgeStyle = 'background:#fff0f0; color:#dc3545; border:1px solid #dc3545;';
                let badgeText  = ' Unpaid';

                if (subTotal > 0 && amtPaid >= subTotal) {
                    statusVal  = '2';
                    badgeStyle = 'background:#f0fff4; color:#15803d; border:1px solid #22c55e;';
                    badgeText  = ' Paid';
                } else if (amtPaid > 0 && amtPaid < subTotal) {
                    statusVal  = '1';
                    badgeStyle = 'background:#fff8e1; color:#b45309; border:1px solid #f59e0b;';
                    badgeText  = ' Partially Paid';
                }

                const badge       = modal.querySelector('#bill_status_badge');
                const statusInput = modal.querySelector('[name="status"]');
                if (badge) {
                    badge.textContent = badgeText;
                    badge.setAttribute('style', `font-size:12px; ${badgeStyle}`);
                }
                if (statusInput) statusInput.value = statusVal;
            };

            // Attach input listeners
            ['sub_total', 'amount_paid'].forEach(name => {
                const el = me.divModal.querySelector(`[name="${name}"]`);
                if (el) el.addEventListener('input', () => me.calcPayment());
            });
        },

        onShow: (me) => {
            const editBillId = op.id || me._editBillId;
            if (editBillId) {
                setTimeout(() => loadBillForEdit(me, editBillId), 100);
            } else {
                me.clear();
            }
        },

        buttons: [
            {
                label: "Cancel",
                cssClass: "btn btn-light border",
                click: (me) => me.hide(false)
            },
            {
                label: '<i class="fa fa-save me-1"></i> Save Bill',
                cssClass: "btn btn-primary px-4",
                click: (me) => {
                    const formData = new FormData();
                    const p = me.getData();
                    p.vendor_id = me._selectedVendorId;

                    Object.keys(p).forEach(key => formData.append(key, p[key]));

                    const fileInput = me.divModal.querySelector('input[name="bill_photo"]');
                    if (fileInput?.files[0]) formData.append('photo', fileInput.files[0]);

                    vsapi.post(`${main_view.base_url}/prm/purchase/bill/save`, formData).then(res => {
                        if (res.status_code == 200) {
                            cv_interact.success('Bill saved successfully.');
                            me.hide(true);
                            if (typeof op.onClose === 'function') op.onClose();
                        } else {
                            cv_interact.warning(res.error_message);
                        }
                    });
                }
            }
        ]
    });

    CreateBillDialog.show(op);
};