"use strict";

var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.btnDocument = mThis.self.querySelector("#_btnDocument");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill");

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
                return `<span class="text-nowrap text-prm-custom">${data.bill_number ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.vendor_name}</span>`;
            },
        },
        {
            transTitle: "titles.Phone Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.phone_number}</span>
                        <span class="d-block text-prm-custom">${data.email ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Po Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.po_number ?? "_"}</span>`;
            },
        },
        {
            title: "Bill Date",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom text-nowrap">${data.bill_date}</span>`,
        },

        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.total_amount)}</span>`;
            },
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`;
            },
        },
        {
            title: "Description  ",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.remark ?? "__"}</span>`;
            }

        },
        // {
        //     title: "Balance",
        //     className: "align-middle text-end",
        //     data: (data) => {
        //         const balance = Number(data.balance || 0);
        //         const total = Number(data.total_amount || 0);
        //         const paid = Number(data.paid_amount || 0);
        //         const color =
        //             balance > 0
        //                 ? "#dc2626"
        //                 : total > 0 && paid >= total
        //                   ? "#15803d"
        //                   : "#94a3b8";

        //         return `
        //             <span class="d-block fw-semibold" style="color:${color};">
        //                 ${formatCurrency(data.balance)}
        //             </span>`;
        //     },
        // },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status_id = data.status_id;
                let cls =
                    "badge text-warning bg-danger-subtle border border-danger";

                if (status_id == 3) {
                    cls =
                        "badge text-warning bg-warning-subtle border border-warning";
                } else if (status_id == 2) {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (status_id == 1) {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">
                        ${data.status ?? ""}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom fw-semibold"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-vendorId="${data.vendor_id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillListView = new ListView("_bill_list", {
            fetchApi: `${main_view.base_url}/prm/bill/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
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
                onClose: () => {
                    mThis.BillListView.showPage(mThis.getFilterData());
                },
            };
            // if (!AuthManager.allowed(240)) return;
            BillDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        const tblBill = mThis.BillListView.getTable();
        if (!tblBill.id) tblBill.id = "_bill_list_table";
        mThis.initDropdownMenus(tblBill);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
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

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
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
                    name: "modify_bill",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Bill Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
                {
                    html: '<span class="ps-2">View Attachment</span>',
                    icon: `<i class="fa-regular fa-eye"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_attachment",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_bill": {
                        mThis.editBill(id, menuLink);
                        break;
                    }
                    case "delete_bill": {
                        mThis.deleteBill(id, menuLink);
                        break;
                    }
                    case "view_attachment": {
                        mThis.viewAttachment(id);
                    }
                    default: {
                        break;
                    }

                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");

        let vendor_id = tr?.dataset.vendorid || null;
        console.log(33333, vendor_id);

        const op = {
            id: parseInt(id, 10),
            vendorid: vendor_id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            },
        };
        BillDialog.show(op);
    };

    mThis.deleteBill = (id, menuLink) => {
        cv_interact.confirm(
            "Delete this Bill Record?",
            {
                transTitle: "Delete Bill Record",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/bill/delete`,
                            { id: id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    res.message ||
                                        "Bill record has been deleted.",
                                );
                                mThis.BillListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    res.error_message ||
                                        "Failed to delete bill record.",
                                );
                            }
                        });
                }
            },
        );
    };

    mThis.viewAttachment = (id) => {
        vsapi.call(`${main_view.base_url}/prm/bill/view-attachment`, { id: id }, false, false, false)
            .then((res) => {
                if (res.status_code !== 200) {
                    cv_interact.error(res.error_message || 'No attachment found.');
                    return;
                }

                const { data_url, ext, mime_type } = res.data;

                const overlay = document.createElement('div');
                overlay.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; cursor:pointer;`;

                const wrapper = document.createElement('div');
                wrapper.style.cssText = `position:relative; max-width:90vw; max-height:90vh;`;

                // Show image or iframe depending on file type
                const isImage = ['png', 'jpg', 'jpeg'].includes(ext);
                const isPdf   = ext === 'pdf';

                if (isImage) {
                    const img = document.createElement('img');
                    img.src = data_url;
                    img.style.cssText = `max-width:100%; max-height:90vh; border-radius:8px; box-shadow:0 4px 32px #000;`;
                    wrapper.appendChild(img);
                } else if (isPdf) {
                    const iframe = document.createElement('iframe');
                    iframe.src = data_url;
                    iframe.style.cssText = `width:80vw; height:85vh; border:none; border-radius:8px;`;
                    wrapper.appendChild(iframe);
                } else {
                    // For doc/xls etc — just open in new tab
                    overlay.onclick = null;
                    document.body.removeChild(overlay);
                    window.open(data_url, '_blank');
                    return;
                }

                const btnClose = document.createElement('button');
                btnClose.style.cssText = `position:absolute; top:-16px; right:-16px; border:none; background:#fff; border-radius:50%; width:32px; height:32px; font-size:18px; cursor:pointer; line-height:1;`;
                btnClose.innerHTML = '&times;';
                btnClose.onclick = (e) => { e.stopPropagation(); document.body.removeChild(overlay); };

                wrapper.appendChild(btnClose);
                overlay.appendChild(wrapper);
                overlay.onclick = () => document.body.removeChild(overlay);
                document.body.appendChild(overlay);
            });
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/bill/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                console.log("form-options data:", d); 
                VSUtil.setComboItems(
                    mThis.elFilter_vendor,
                    d.vendors,
                    "id",
                    "vendor",
                    "",
                    "All Vendor",
                    "",
                );
                VSUtil.setComboItems( mThis.elFilter_status, d.bill_statuses, "id", "bill_status", "", "All Statuses", "",
                );
                if (typeof onFinish === "function") onFinish();
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

const BillDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        console.log("DEBUG 1: Opening Dialog with op:", op);

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row justify-content-center">
                                <input name="vendorid" class="d-none data-input form-control" data-field="vendor_id">
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input  name="vendor" class="data-input form-control" data-field="vendor_name" placeholder="Vendor Name "></input>
                                    <label style="color:#777777;padding-left:6px; display:none;">Vendor</label>
                                </div>
                            </div>
                            
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Phone Number</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="po_number" class="data-input form-control" data-field="po_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">PO Number</label>
                                </div>
                            </div>
                            
                            
                            <div class="col-6">
                                <div class=" material-input outlined">
                                    <input type="text" data-type="date" name="bill_date" required class="data-input form-control form_input" data-field="bill_date" />
                                    <label style="color:#777777;padding-left:6px;">Bill Date</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="total_amount" class="data-input form-control" data-field="total_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Total Amount</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="paid_amount" class="data-input form-control" data-field="paid_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Amount Paid</label>
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="material-input outlined d-flex ">
                                    <button name ="btn_chooseFile"  class="btn btn-block" style="background-color: #e1e5f2; padding: 0.5rem 0.75rem !important;">Choose File </button>
                                    <label style="display:none;color:#777777;padding-left:6px;">File</label>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="material-input outlined d-flex ">
                                    <input type="text" name="documents" class="d-none form-control " accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                                    <label style="display:none;color:#777777;padding-left:6px;">File</label>
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
                            if (me.controls.po_number) me.controls.po_number.value = '';
                            return;
                        }
                        vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                            .then(res => {
                                const d = res.data || {};
                                const v = d.vendor || {};
                                if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                                if (me.controls.po_number) me.controls.po_number.value = v.po_number     || '';
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

                    me.uploadInput = me.divModal.querySelector(
                        'input[name="documents"]',
                    );
                    me.fileBase64 = null; // Store base64 data here
                    me.controls.btn_chooseFile.onclick = () => {
                        FileChooser.chooseFile(
                            {
                                accept: ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
                            },
                            (d) => {
                                console.log("FileChooser returned:", d);
                                me.fileData = d;
                                me.controls.documents.value = d.fileName;
                                me.controls.documents.classList.remove('d-none');
                            },
                        );
                    };
                },

                configSelect: [
                    
                    {
                        name: "bill_statuses",
                        data: "bill_statuses",
                        textField: "bill_status",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Add New Bill Record",
                    modifyTitle: "Modify Bill Record",
                    targetProp: "bill_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/bill/form-options",
                        ].join(""),
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
                    

                // onPrepareForm: (me, data) => {
                //     const header = me.divModal.querySelector(".modal-header");
                //     const btnClose = header.querySelector("button[data-bs-dismiss]");
                //     if (btnClose) btnClose.classList.add("d-none");

                //     // Always reset first — prevents leftover vendor from previous session
                //     me._selectedVendorId = null;
                //     if (me.controls.vendor)       me.controls.vendor.value       = '';
                //     if (me.controls.vendor_id)    me.controls.vendor_id.value    = '';
                //     if (me.controls.phone_number) me.controls.phone_number.value = '';   
                //     me.fileData = null;
                //     if (me.controls.documents) {
                //         me.controls.documents.value = '';
                //         me.controls.documents.classList.add('d-none');
                //     }

                //     const details = data?.bill_details;

                //     if (details?.vendor_id) {
                //         me._selectedVendorId = details.vendor_id;
                //         if (me.controls.vendor_id)    me.controls.vendor_id.value    = details.vendor_id;
                //         if (me.controls.phone_number) me.controls.phone_number.value = details.phone_number || '';

                //         setTimeout(() => {
                //             if (me.controls.vendor) me.controls.vendor.value = details.vendor_name || '';
                //         }, 100);
                //     }

                //     if (details?.file_image) {
                //         me.controls.documents.value = details.file_image;
                //         me.controls.documents.classList.remove('d-none');
                //     }
                // },
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
                            // console.log("fileData object:", op);

                            // if (me.fileData && me.fileData.base64){
                            //     op.photo = me.fileData.base64;
                            // }

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
                                console.log("photo being sent:", op.photo ? op.photo.substring(0, 50) : "NULL");
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
})();