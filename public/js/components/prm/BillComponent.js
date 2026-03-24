"use strict";

var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector('#_bill_vendor_id');
    mThis.elFilter_status = mThis.self.querySelector('#_bill_status_id');
    mThis.elSearch = mThis.self.querySelector("#_search_bill");
    let BillDialog = null;
    let _currentEditBill_Id = null;

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `$ ${value.toFixed(2)}`;
    };
    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.bill_number ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.vendor_name}</span>`;
            }
        },
        {
            title: "Bill Date",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.bill_date}</span>`,
        },
        {
            title: "Attachment",
            className: "align-middle text-center",
            data: (data) => {
                if (!data.file_image) {
                    return `<span class="text-muted" style="font-size:12px;">—</span>`;
                }
                return `
                    <a href="${data.file_image}" target="_blank" title="View Attachment">
                        <img src="${data.file_image}"
                            style="width:36px; height:36px; object-fit:cover; border-radius:4px; border:1px solid #ddd;"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                        <i class="fa fa-file-alt text-muted" style="display:none; font-size:18px;"></i>
                    </a>
                `;
            }
        },

        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.total_amount)}</span>`;
            }
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`;
            }
        },
        {
            title: "Balance",
            className: "align-middle text-end",
            data: (data) => {
                const balance = Number(data.balance || 0);
                const total   = Number(data.total_amount || 0);
                const paid    = Number(data.paid_amount || 0);
                const color = balance > 0 ? '#dc2626' : total > 0 && paid >= total ? '#15803d' : '#94a3b8';         

                return `
                    <span class="d-block fw-semibold" style="color:${color};">
                        ${formatCurrency(data.balance)}
                    </span>`;
            }
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {

                const status_id = data.status_id;
                let cls = 'badge text-warning bg-danger-subtle border border-danger';

                if (status_id == 3) {
                    cls = 'badge text-warning bg-warning-subtle border border-warning';
                }
                else if (status_id == 2) {
                    cls = 'badge text-success bg-success-subtle border border-success';
                }
                
                else if (status_id == 1) {
                    cls = 'badge text-danger bg-danger-subtle border border-danger';
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">
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
                    <span class="text-capitalize text-start text-prm-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            transTitle: "titles.Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },


    ];


    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillListView = new ListView('_bill_list', {
            fetchApi: `${main_view.base_url}/prm/bill/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                tr.classList.add("bill");
                tr.setAttribute("id", `bill_id${data.id}`);

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
        const tblBill = mThis.BillListView.getTable();
        if (!tblBill.id) tblBill.id = '_bill_list_table';
        mThis.initDropdownMenus(tblBill);
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
            vendor_id: mThis.elFilter_vendor.value,
            status_id: mThis.elFilter_status.value,
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
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Bill Record"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Bill Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'modify_bill': {
                        mThis.editBill(id, menuLink);
                        break;
                    }
                    case 'delete_bill': {
                        mThis.deleteBill(id, menuLink);
                        break;
                    }
                    case 'modify_vendor': {
                        mThis.editVendor(id, menuLink);
                        break;
                    }
                    case 'delete_vendor': {
                        mThis.deleteVendor(id, menuLink);
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

    mThis.editBill = (id, menuLink) => {
        let billId = id;
        if (!billId && menuLink) {
            const btn = typeof menuLink === 'object' && menuLink.target ? menuLink.target : menuLink;
            const el = (btn && btn.closest) ? btn.closest('[data-id]') : null;
            if (el && el.dataset && el.dataset.id) billId = el.dataset.id;
            const row = (btn && btn.closest) ? btn.closest('tr') : null;
            if (!billId && row && row.dataset && row.dataset.id) billId = row.dataset.id;
        }
        const op = {
            id: billId || id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };
        showBillDialog(op);
    };

    mThis.editVendor = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };

        showBillDialog(op);
    }
    mThis.deleteBill = (id, menuLink) => {
        cv_interact.confirm('Delete this Bill Record?', {
            transTitle: 'Delete Bill Record',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/bill/delete`, { id: id }, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        cv_interact.success(res.message || 'Bill record has been deleted.');
                        mThis.BillListView.showPage(mThis.getFilterData());
                    } else {
                        cv_interact.error(res.error_message || 'Failed to delete bill record.');
                    }
                });
            }
        });
    };

    mThis.deleteVendor = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Vendor?', {
            transTitle: 'Delete Vendor',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/vendor/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.BillListView.showPage();
                    } else {
                        cv_interact.error(res.error_message);
                    }
                })
            }

        });
    };

  const showBillDialog = (op) => {
    const loadBillForEdit = (me, editBillId) => {
    if (!me || !editBillId) return Promise.resolve(null);

    return vsapi.call(`${main_view.base_url}/prm/bill/form-options`, { id: editBillId }, null, false)
        .then(formRes => {
            if (!formRes || formRes.status_code !== 200) {
                throw new Error(formRes?.error_message || 'Failed to load bill details');
            }

            const titleEl = me.divModal?.querySelector('.modal-title');
            if (titleEl) titleEl.innerHTML = '<h5 class="text-prm-custom text-center fw-bold">Modify Bill</h5>';

            const formData  = formRes.data || {};
            const d         = formData.bill_details || {};
            const vendors   = formData.vendors || [];
            const vendorId  = d.vendor_id;
            const vendor    = vendors.find(v => Number(v.id) === Number(vendorId));

            if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
            if (me.controls.vendor)    me.controls.vendor.value    = vendor
                ? (vendor.vendor || vendor.name || vendor.vendor_name || vendor.code || '')
                : '';

            me._selectedVendorId = vendorId;

            if (vendorId && (me.controls.phone_number)) {
                vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                    .then(r => {
                        const v = (r.data || {}).vendor || {};
                        if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                    })
                    .catch(() => {});
            }
            const set = (name, val) => {
                const el = me.divModal.querySelector(`[name="${name}"]`);
                if (el) el.value = val || '';
            };

            set('bill_number',    d.bill_number);
            set('bill_date',    d.bill_date);
            set('total_amount', d.total_amount);
            set('paid_amount',  d.paid_amount);
            set('remark',       d.remark);

            const currencySel = me.divModal.querySelector('[name="currency_code"]');
            if (currencySel && d.currency_code) currencySel.value = d.currency_code;

            if (typeof me.calcPayment === 'function') me.calcPayment();

            if (d.file_image) {
                const previewEl = me.divModal.querySelector('.bill-photo-preview');
                const hintEl    = me.divModal.querySelector('.bill-upload-hint');
                if (previewEl) { previewEl.src = d.file_image; previewEl.style.display = 'block'; }
                if (hintEl)    hintEl.style.display = 'none';
                me.divModal.querySelector('.bill-upload-box')?.classList.add('has-image');
            }
        });
};
    BillDialog = BillDialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",

            createContent: () => {
                return `
                <div class="row mb-2">
                    <div class="col-md-6">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:100px;">Vendor</span>
                            <span class="mx-2 fw-bold text-muted">:</span>
                            <input name="vendor" class="form-control flex-grow-1" placeholder="Search vendor…">
                            <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:100px;">Contact</span>
                            <span class="mx-2 fw-bold text-muted">:</span>
                            <input type="text" name="phone_number"
                                class="data-input form-control flex-grow-1"
                                data-field="phone_number" placeholder="">
                        </div>
                    </div>
                    <div class="col-md-6 mt-3 mt-md-0 d-flex flex-column align-items-end">
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:100px;">Bill Date</span>
                            <span class="mx-2 fw-bold text-muted">:</span>
                            <input data-type="date" name="bill_date"
                                class="data-input form-control flex-grow-1"
                                data-field="bill_date">
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <span class="fw-bold" style="min-width:100px;">Bill Number</span>
                            <span class="mx-2 fw-bold text-muted">:</span>
                            <input type="text" name="bill_number" class="data-input form-control flex-grow-1" data-field="bill_number" placeholder="">
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <label class="fw-bold d-block mb-1" style="font-size:13px; display:none; padding-left:6px;">File Name</label>
                        <div class="material-input outlined d-flex ">
                            <input type="file" name="file_image" class="data-input form-control " accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" d/>
                        </div>
                    </div>

                       <div class="col-4">
                            <label class="input-group-text cursor-pointer" 
                                style="background-color: #e1e5f2;justify-content: center;" 
                                for="inputFile">
                                Browse
                            </label>
                        </div>
                        <div class="col-8">    
                            <input type="file" class="form-control" id="inputFile" style="display:none;" 
                                onchange="document.getElementById('file-name').textContent = this.files[0] ? this.files[0].name : 'No file chosen'">
                            
                            <span class="form-control text-muted bg-white d-flex align-items-center" id="file-name">
                                No file chosen
                            </span>
                        </div>
                    <div class="col-12">
                        <label class="fw-bold d-block mb-1" style="font-size:13px; padding-left:6px;">Description</label>
                        <div class="material-input outlined">
                            <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                        </div>
                    </div>
                </div>

                <div class="row mt-3 p-1">
                    <div class="col-lg-12 d-flex justify-content-end">
                        <div class="p-3 rounded-3 shadow-sm border" style="background:#fff; min-width:320px;">

                            <div class="d-flex align-items-center mb-2 p-1">
                                <span class="fw-bold" style="min-width:100px;">Total Amount</span>
                                <span class="mx-2 fw-bold">:</span>
                                <input type="number"
                                    name="total_amount"
                                    class="data-input form-control mx-2"
                                    data-field="total_amount"
                                    style="width:130px"
                                    value="0" min="0" step="0.01"
                                    placeholder="0">
                                <select name="currency_code"
                                        class="form-select"
                                        style="width:auto;">
                                    <option value="USD">USD($)</option>
                                    <option value="KHR">KHR(៛)</option>
                                </select>
                            </div>

                            <div class="p-3 rounded-3 shadow-sm border mt-2" style="background:#fff; min-width:280px;">
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:100px;">Total Amount</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <span class="bill-total-display ms-1 fw-bold">$ 0.00</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:100px;">Amount Paid</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <span class="bill-currency-symbol input-group-text"
                                        style="font-size:13px; padding:4px 6px;">$</span>
                                    <input type="number"
                                        name="paid_amount"
                                        class="data-input form-control ms-1"
                                        data-field="paid_amount"
                                        style="width:100px"
                                        value="0" min="0" step="0.01"
                                        placeholder="0">
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:100px; color:#ff0000;">Balance</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <span class="bill-balance-display ms-1 fw-bold text-danger">$ 0.00</span>
                                    <input type="hidden" name="balance_amount" class="bill-balance-value">
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:100px;">Grand Total</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <span class="bill-grand-display ms-1 fw-bold">$ 0.00</span>
                                </div>
                            </div>

                            <hr class="my-2">

                            <div class="d-flex align-items-center">
                                <span class="fw-bold" style="min-width:120px;">Payment Status</span>
                                <span class="mx-2 fw-bold text-muted">:</span>
                                <span class="bill-status-badge ms-1 badge bg-danger px-3 py-2">Unpaid</span>
                                <input type="hidden" name="payment_status"
                                    class="data-input bill-status-value"
                                    data-field="payment_status" value="unpaid">
                            </div>
                        </div>
                    </div>
                </div>
            `; 
        },
        configSelect:[
            // {
            // name: "vendor_id",
            // data: "vendors",
            // textField: "vendor_id",
            // valueField: "id",
            // },
            // {
            // name: "currency_code",
            // data: "currencies",
            // textField: "code",
            // valueField: "code",
            // },
        ],

            contentCreated: (me) => {
                const applyVendorInfo = (vendorId) => {
                    me._selectedVendorId = vendorId || '';
                    if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                    if (!vendorId) {
                        if (me.controls.phone_number) me.controls.phone_number.value = '';
                        if (me.controls.address) me.controls.address.value = '';
                        return;
                    }
                    vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                        .then(res => {
                            const d = res.data || {};
                            const v = d.vendor || {};
                            if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                            if (me.controls.address) me.controls.address.value = v.address || '';
                        })
                        .catch(() => {});
                };
                if (me.controls.vendor) {
                    me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                        type: 'select',
                        prefetch: true,
                        minChars: 0,
                        api: {
                            endpoint: `${main_view.base_url}/prm/bill/form-options`,
                        },
                        processResponse: (res) => {
                            const vendors = res?.data?.vendors || [];
                            return (Array.isArray(vendors) ? vendors : []).map(v => ({
                                ...v,
                                vendor: v.vendor || v.name || v.vendor_name || v.code || '',
                                phone_number: v.phone_number || v.contact_phone || v.phone || ''
                            }));
                        },
                        columns: { vendor: 'VENDOR', phone_number: 'PHONE' },
                        showColumnHeader: true,
                        placeholder: 'Search vendor',
                        onSelect: (vendor) => {
                            const id = vendor?.id || '';
                            me.controls.vendor.value = vendor?.vendor || '';
                            applyVendorInfo(id);
                        }
                    });

                    // prefill in modify mode
                    if (me._selectedVendorId) {
                        applyVendorInfo(me._selectedVendorId);
                    }
                }

                me.CURRENCIES = {
                    USD: { symbol: "$", decimals: 2 },
                    KHR: { symbol: "៛", decimals: 0 },
                };

                me.formatMoney = (amount, currencyCode) => {
                    const { symbol, decimals } =
                        me.CURRENCIES[currencyCode] ?? me.CURRENCIES.USD;
                    return `${symbol} ${amount.toFixed(decimals)}`;
                };
                me.calcPayment = () => {
                    const modal = me.divModal;
                    if (!modal) return;

                    const currencyCode =
                        modal.querySelector('[name="currency_code"]')?.value ||
                        "USD";
                    const currency =
                        me.CURRENCIES[currencyCode] ?? me.CURRENCIES.USD;

                    const total =
                        parseFloat(
                            modal.querySelector('[name="total_amount"]')?.value,
                        ) || 0;
                    const paidRaw =
                        parseFloat(
                            modal.querySelector('[name="paid_amount"]')?.value,
                        ) || 0;
                    const safePaid = Math.min(paidRaw, total);
                    const balance = Math.max(0, total - safePaid);

                    modal
                        .querySelectorAll(".bill-currency-symbol")
                        .forEach((el) => {
                            el.textContent = currency.symbol;
                        });

                    modal
                        .querySelectorAll(".bill-total-display")
                        .forEach((el) => {
                            el.textContent = me.formatMoney(
                                total,
                                currencyCode,
                            );
                        });

                    modal
                        .querySelectorAll(".bill-grand-display")
                        .forEach((el) => {
                            el.textContent = me.formatMoney(
                                total,
                                currencyCode,
                            );
                        });

                    const balanceEl = modal.querySelector(
                        ".bill-balance-display",
                    );
                    const balanceInput = modal.querySelector(
                        ".bill-balance-value",
                    );
                    if (balanceInput)
                        balanceInput.value = balance.toFixed(currency.decimals);
                    if (balanceEl) {
                        balanceEl.textContent = me.formatMoney(
                            balance,
                            currencyCode,
                        );
                        balanceEl.className =
                            "bill-balance-display ms-1 fw-bold " +
                            (balance > 0
                                ? "text-danger"
                                : total > 0
                                  ? "text-success"
                                  : "text-muted");
                    }

                    const badge = modal.querySelector(".bill-status-badge");
                    const statusInput =
                        modal.querySelector(".bill-status-value");

                    let badgeClass =
                        "bill-status-badge ms-1 badge px-3 py-2 bg-danger";
                    let badgeText = "Unpaid";
                    let statusVal = "unpaid";

                    if (total > 0 && safePaid >= total) {
                        badgeClass =
                            "bill-status-badge ms-1 badge px-3 py-2 bg-success";
                        badgeText = "Paid";
                        statusVal = "paid";
                    } else if (safePaid > 0 && safePaid < total) {
                        badgeClass =
                            "bill-status-badge ms-1 badge px-3 py-2 bg-warning text-dark";
                        badgeText = "Partially Paid";
                        statusVal = "partially_paid";
                    }

                    if (badge) {
                        badge.className = badgeClass;
                        badge.textContent = badgeText;
                    }
                    if (statusInput) statusInput.value = statusVal;
                };
                ["total_amount", "paid_amount"].forEach((name) => {
                    const el = me.divModal.querySelector(`[name="${name}"]`);
                    if (el)
                        el.addEventListener("input", () => me.calcPayment());
                });

                const currencySel = me.divModal.querySelector(
                    '[name="currency_code"]',
                );
                if (currencySel)
                    currencySel.addEventListener("change", () =>
                        me.calcPayment(),
                    );

                me.calcPayment();
            },

            onShow: (me) => {
                const editBillId = _currentEditBill_Id ?? me?._editBill_Id ?? (BillDialog && BillDialog._editBill_Id) ?? (me?.dataOptions && me.dataOptions.id);

                if (editBillId) {
                    setTimeout(() => loadBillForEdit(me, editBillId), 100);
                } else {
                    // me.clear();
                    me._selectedVendorId = null;

                    const uploadBox =
                        me.divModal.querySelector(".bill-upload-box");
                    const previewImg = me.divModal.querySelector(
                        ".bill-photo-preview",
                    );
                    const uploadHint =
                        me.divModal.querySelector(".bill-upload-hint");
                    if (uploadBox) uploadBox.classList.remove("has-image");
                    if (previewImg) {
                        previewImg.src = "";
                        previewImg.style.display = "none";
                    }
                    if (uploadHint) uploadHint.style.display = "";

                    // Reset currency to USD on new bill
                    const currencySel = me.divModal.querySelector(
                        '[name="currency_code"]',
                    );
                    if (currencySel) currencySel.value = "USD";

                    if (typeof me.calcPayment === "function") me.calcPayment();
                }
            },

            buttons: [
                {
                    label: "Cancel",
                    cssClass: "btn btn-light border",
                    click: (me) => me.hide(false),
                },
                {
                    label: "<span>Save</span>",
                    cssClass: "btn btn-primary",
                    click: (me) => {
                        let p = me.getData();
                        p.vendor_id = me._selectedVendorId;
                        const saveBillId = _currentEditBill_Id ?? me._editBillId ?? (me.dataOptions && me.dataOptions.id);
                        if (saveBillId) p.id = saveBillId;
                        vsapi.call(`${main_view.base_url}/prm/bill/save`, p, false).then(res => {
                            if (res.status_code == 200) {
                                cv_interact.success(saveBillId ? 'Bill record updated.' : 'Bill record created.');
                                me.hide(true);
                                mThis.BillListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.warning(res.error_message);
                            }
                        });
                    }
                }
            ],

            onPrepareForm: (me, data) => {
                const editPoId = _currentEditBill_Id ?? me._editBillId ?? (BillDialog && BillDialog._editBillId) ?? (me.dataOptions && me.dataOptions.id);
                const isModify = !!editPoId;

                const titleEl = me.divModal.querySelector('.modal-title');
                if (titleEl) {
                    titleEl.innerHTML = isModify
                        ? '<h2 class="text-prm-custom text-start fw-bold">Modify Bill</h2>'
                        : '<h2 class="text-prm-custom text-start fw-bold">Create Bill</h2>';
                }

                if (!isModify) {
                    _currentEditBill_Id = null;
                    if (typeof me.clear === 'function') me.clear();
                }
            },
            prepareFormOptions:{
                modifyTitle: "Bill Record",
                createTitle: "Bill Record",
                targetProp:"bill_details",
                api:{
                    endpoint: [ main_view.base_url, "/prm/bill/form-options",].join(""),
                    params:(dataOptions)=>{
                    return { id: dataOptions.id };
                    }
                }
            }
            
        });

    BillDialog.show(op);
};
    // mThis.prepareFormOptions = (onFinish) => {
    //     vsapi.call(`${main_view.base_url}/prm/bill/form-options`, null, null, null)
    //         .then(res => {
    //             const d = res.status_code == 200 ? res.data : {};
    //             VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, 'id', 'vendor', '', 'All Vendor', '');
    //             VSUtil.setComboItems(mThis.elFilter_status, d.bill_statuses, 'id', 'name', '', 'All Statuses', '');
    //             if (typeof onFinish === 'function') onFinish();
    //         })
    // }

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/bill/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                console.log('form-options data:', d);  // ← add this
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, 'id', 'vendor', '', 'All Vendor', '');
                VSUtil.setComboItems(mThis.elFilter_status, d.bill_statuses, 'id', 'bill_status', '', 'All Statuses', '');
                if (typeof onFinish === 'function') onFinish();
            });
    };

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








