"use strict";

var BillPaymentComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Payment Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_payment_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBillPayment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill_payment");

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `$ ${value.toFixed(2)}`;
    };
    mThis.cols = [
        { title: "", className: "align-middle" },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => `<span class="text-nowrap text-prm-custom">${data.bill_number ?? ""}</span>`,
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.vendor_name}</span>`,
        },
        {
            transTitle: "titles.Phone Number",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.phone_number}</span>
                             <span class="d-block text-prm-custom">${data.email ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Reference No",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.ref_no ?? "_"}</span>`,
        },
        {
            title: "Bill Date",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom text-nowrap">${data.bill_date}</span>`,
        },
        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.total_amount)}</span>`,
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`,
        },
        {
            title: "Description",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.remark ?? "__"}</span>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status_id = data.status_id;
                let cls = "badge text-warning bg-danger-subtle border border-danger";
                if (status_id == 3) cls = "badge text-warning bg-warning-subtle border border-warning";
                else if (status_id == 2) cls = "badge text-success bg-success-subtle border border-success";
                else if (status_id == 1) cls = "badge text-danger bg-danger-subtle border border-danger";
                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">${data.status ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data) => `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom fw-semibold">${data.update_user ?? ""}</span>
                <span class="text-muted">${data.updated_at ?? ""}</span>
            </div>`,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action"
                        data-id="${data.id}" data-vendorId="${data.vendor_id}"
                        data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillPaymentListView = new ListView("_bill_payment_list", {
            fetchApi: `${main_view.base_url}/prm/bill/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                tr.dataset.vendorid = data.vendor_id;
                tr.dataset.fileurl = data.file_image_url ?? "";
                tr.classList.add("bill");
                tr.setAttribute("id", `bill_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
            };
            BillPaymentDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillPaymentListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => { sh_parent.style.maxHeight = window.innerHeight - 200 + "px"; };

        const tblBill = mThis.BillPaymentListView.getTable();
        if (!tblBill.id) tblBill.id = "_bill_payment_list_table";
        mThis.initDropdownMenus(tblBill);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
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
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
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
                    html: '<span class="ps-2" vslang="titles.Modify Bill Record"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Bill Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
                {
                    html: '<span class="ps-2">View Attachment</span>',
                    icon: `<i class="fa-regular fa-eye fa-lg" style="color:rgb(56,49,111);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_attachment",
                },
                {
                    html: '<span class="ps-2">Bill Payment</span>',
                    icon: `<i class="fa-solid fa-sack-dollar" style="color:rgb(22,80,137);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "bill_payment",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_bill":   mThis.editBill(id, menuLink); break;
                    case "delete_bill":   mThis.deleteBill(id, menuLink); break;
                    case "view_attachment": mThis.viewAttachment(id);
                    case "bill_payment":  mThis.billPayment(id);
                    default: break;
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const op = {
            id: parseInt(id, 10),
            vendorid: tr?.dataset.vendorid || null,
            btn: menuLink,
            onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        };
        BillPaymentDialog.show(op);
    };

    mThis.deleteBill = (id, menuLink) => {
        cv_interact.confirm("Delete this Bill Record?",
            { transTitle: "Delete Bill Record", context: "delete", confirmButtonText: "Delete" },
            function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/prm/bill/delete`, { id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(res.message || "Bill record has been deleted.");
                                mThis.BillPaymentListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message || "Failed to delete bill record.");
                            }
                        });
                }
            }
        );
    };

    mThis.viewAttachment = (id) => {
        vsapi.call(`${main_view.base_url}/prm/bill/view-attachment`, { id }, false, false, false)
            .then((res) => {
                if (res.status_code !== 200) { cv_interact.error(res.error_message || "No attachment found."); return; }
                const { data_url, ext } = res.data;
                const overlay = document.createElement("div");
                overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;justify-content:center;align-items:center;cursor:pointer;";
                const wrapper = document.createElement("div");
                wrapper.style.cssText = "position:relative;max-width:90vw;max-height:90vh;";
                const isImage = ["png","jpg","jpeg"].includes(ext);
                const isPdf   = ext === "pdf";
                if (isImage) {
                    const img = document.createElement("img");
                    img.src = data_url;
                    img.style.cssText = "max-width:100%;max-height:90vh;border-radius:8px;box-shadow:0 4px 32px #000;";
                    wrapper.appendChild(img);
                } else if (isPdf) {
                    const iframe = document.createElement("iframe");
                    iframe.src = data_url;
                    iframe.style.cssText = "width:80vw;height:85vh;border:none;border-radius:8px;";
                    wrapper.appendChild(iframe);
                } else {
                    document.body.removeChild(overlay);
                    window.open(data_url, "_blank");
                    return;
                }
                const btnClose = document.createElement("button");
                btnClose.style.cssText = "position:absolute;top:-16px;right:-16px;border:none;background:#fff;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;line-height:1;";
                btnClose.innerHTML = "&times;";
                btnClose.onclick = (e) => { e.stopPropagation(); document.body.removeChild(overlay); };
                wrapper.appendChild(btnClose);
                overlay.appendChild(wrapper);
                overlay.onclick = () => document.body.removeChild(overlay);
                document.body.appendChild(overlay);
            });
    };

    // mThis.billPayment = (id, menuLink) => {
    //     let op = {
    //         id: null,
    //         btn: menuLink,
    //         onClose: () => mThis.BillPaymentListView.showPage(),
    //     };
    //     alert("coming soon!");
    // };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/bill/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, "id", "vendor", "", "All Vendor", "");
                VSUtil.setComboItems(mThis.elFilter_status, d.bill_statuses, "id", "bill_status", "", "All Statuses", "");
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillPaymentListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();




const BillPaymentDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <input name="vendorid" class="d-none data-input form-control" data-field="vendor_id">
                            <div class=" col-md-5 ">
                                <div class=" material-input outlined">
                                    <input  name="vendor" class="data-input form-control" data-field="vendor_name" placeholder="Payee(Vendor)"></input>
                                    <label style="color:#777777;padding-left:6px; display:none;"></label>
                                </div>
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Contact</label>
                                </div>
                            </div>
                            <div class="col-md-2 "></div>
                            <div class="col-md-5 align-items-end">
                                <div class=" material-input outlined">
                                    <input type="text" data-type="date" name="bill_date" required class="data-input form-control form_input" data-field="bill_date" />
                                    <label style="color:#777777;padding-left:6px;">Bill Date</label>
                                </div>
                                <div class="material-input outlined">
                                    <input name="bill_number" class="data-input form-control" data-field="bill_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Bill Number</label>
                                </div>
                            </div>   
                               
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <input name="total_amount" class="data-input form-control" data-field="total_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Total Amount</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <input name="paid_amount" class="data-input form-control" data-field="paid_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Amount Paid</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <input name="paid_amount"style="cursor: not-allowed;" class="data-input form-control" data-field="balance" placeholder=" " readonly />
                                    <label style="color:#777777; padding-left:6px;">Balance</label>
                                </div>
                            </div>
                            
                            <div class="col-12 ">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="remark" placeholder=" "></textarea>
                                    <label style="color:#777777;padding-left:6px;">Description</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined d-none">
                                    <input name="bill_number" class="data-input form-control" data-field="bill_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Bill Number</label>
                                </div>
                            </div>
                            
                        </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    const applyVendorInfo = (vendorId) => {
                        me._selectedVendorId = vendorId || '';
                        if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                        if (!vendorId) {
                            if (me.controls.phone_number) me.controls.phone_number.value = '';
                            // if (me.controls.po_number) me.controls.po_number.value = '';
                            return;
                        }
                        vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                            .then(res => {
                                const d = res.data || {};
                                const v = d.vendor || {};
                                if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                                // if (me.controls.po_number) me.controls.po_number.value = v.po_number     || '';
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
                                return (Array.isArray(vendors) ? vendors : []).map(v => ({ ...v,
                                    vendor: v.vendor || v.name || v.vendor_name || v.code || '',
                                    phone_number: v.phone_number || v.contact_phone || v.phone || '',
                                    // po_number: v.po_number || v.purchase_order_number || v.purchase_order || ''
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
                    me.controls.btn_chooseFile.onclick = () => {
                        FileChooser.chooseFile(
                            {
                                accept: ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
                            },
                            (d) => {
                                // console.log("FileChooser returned:", d);
                                me.fileData = d;
                                me.controls.documents.value = d.fileName;
                                me.controls.documents.classList.remove('d-none');
                            },
                        );
                    };
                },

                configSelect: [
                    
                    // {
                    //     name: "bill_statuses",
                    //     data: "bill_statuses",
                    //     textField: "bill_status",
                    //     valueField: "id",
                    // },
                ],

                prepareFormOptions: {
                    createTitle: "Bill Payment Voucher",
                    modifyTitle: "Modify Bill Record",
                    targetProp: "bill_details",
                    api: {
                        endpoint: [
                            main_view.base_url, "/prm/bill/form-options",  ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
               
                onPrepareForm: (me, data) => {
                    const header = me.divModal.querySelector(".modal-header");
                    const btnClose = header.querySelector("button[data-bs-dismiss]",);
                    if (btnClose) btnClose.classList.add("d-none");

                    const details = data?.bill_details;
                    if (details?.file_image) {
                        me.controls.documents.value = details.file_image;
                        me.controls.documents.classList.remove('d-none');
                    }
                    if (details?.vendor_id) {
                        me._selectedVendorId = details.vendor_id;
                        if (me.controls.vendor_id) me.controls.vendor_id.value = details.vendor_id;
                        if (me.controls.vendor)    me.controls.vendor.value    = details.vendor_name || '';
                        if (me.controls.phone_number) me.controls.phone_number.value = details.phone_number || '';
                    }
                },
              
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            console.log(444,me.dataOptions);
                            
                            if (me._selectedVendorId != null && me._selectedVendorId !== undefined) {
                                // op.vendor_id = me.dataOptions.vendorid;
                                op.vendor_id = me._selectedVendorId;
                            }

                            if (me.fileData) {
                                op.photo = me.fileData.base64 
                                    || me.fileData.data 
                                    || me.fileData.fileData 
                                    || me.fileData.content 
                                    || null;

                                op.ext = me.fileData.ext
                                    || me.fileData.fileType
                                    || me.fileData.extension
                                    || null;    
                                // console.log("photo being sent:", op.photo ? op.photo.substring(0, 50) : "NULL");
                            }
                            vsapi
                                .call([ main_view.base_url, "/prm/bill/save",].join(""), op, btn, null)
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Bill has been updated successfully",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New bill has been added successfully",
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
    };
    return self;
})()