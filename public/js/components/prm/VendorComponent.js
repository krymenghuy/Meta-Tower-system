"use strict";
var VendorComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Vendors";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_vendor_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnVendor");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_vendor");
    mThis.elFilter_type = mThis.self.querySelector('#_vendor_type_id');
    mThis.elFilter_category = mThis.self.querySelector('#_category_id');
    mThis.elSearch = mThis.self.querySelector("#_search_vendor");


    mThis.cols = [

        {
            title: "",
            className: "align-middle text-capitalize",
        },
        // {
        //     transTitle: "titles.ID",
        //     className: "align-middle",
        //     data: (data) => {
        //         return `<span class="text-primary-custom">${data.code ?? ''}</span>`;
        //     }
        // },
        {
            transTitle: "titles.Vendor Name",
            className: "align-middle",
            data: (data) => {

                const name = data.name ?? '';
                const code = data.code ?? '';

                const initials = name.split(' ')
                    .map(w => w[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                let bgClass = 'bg-secondary-subtle text-secondary';

                if (code === 'equipment') {
                    bgClass = 'bg-primary-subtle text-primary';
                } else if (code === 'maintenance') {
                    bgClass = 'bg-warning-subtle text-warning';
                } else if (code === 'cleaning') {
                    bgClass = 'bg-info-subtle text-info';
                } else if (code === 'security') {
                    bgClass = 'bg-danger-subtle text-danger';
                } else if (code === 'utility') {
                    bgClass = 'bg-success-subtle text-success';
                } else if (code === 'internet') {
                    bgClass = 'bg-info-subtle text-info';
                }

                return `
            <div class="d-flex align-items-center gap-2">
                <div class="rounded ${bgClass} d-flex align-items-center justify-content-center fw-bold small" style="width:32px;height:32px;">
                    ${initials}
                </div>
                <span class="fw-semibold text-dark">
                    ${name}
                </span>
            </div>
        `;
            }
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone ?? ""}</span>
                 <span class="d-block text-primary"><i class="fa-solid text-primary px-1 fa-envelope" style="font-size:12px;"></i> ${data.email ?? ""}</span>`,
        },
        {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.type ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Category",
            className: "align-middle",
            data: (data) => {

                const code = data.code ?? '';
                const name = data.category ?? '';

                let bgClass = 'bg-secondary-subtle text-secondary';

                if (code === 'equipment') {
                    bgClass = 'bg-primary-subtle text-primary';
                } else if (code === 'maintenance') {
                    bgClass = 'bg-warning-subtle text-warning';
                } else if (code === 'cleaning') {
                    bgClass = 'bg-info-subtle text-info';
                } else if (code === 'security') {
                    bgClass = 'bg-danger-subtle text-danger';
                } else if (code === 'utility') {
                    bgClass = 'bg-success-subtle text-success';
                } else if (code === 'internet') {
                    bgClass = 'bg-info-subtle text-info';
                }

                return `<span class="badge ${bgClass} text-uppercase fw-bold">
                    ${name}
                </span>`;
            }
        },
        {
            transTitle: "titles.Contact Person",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.contact_person ?? ""}</span>
                         <span class="d-block text-prm-custom"> ${data.contact_phone ?? ""}</span>`;
            }
        },
         {
            transTitle: "titles.Tax Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.tax_number ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Address",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? '...'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle',
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
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },


    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.VendorListView = new ListView('_vendor_list', {
            fetchApi: `${main_view.base_url}/prm/vendor/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
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
                    mThis.VendorListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreateVendorDialog.show(op);
        };


        mThis.pr_tbl = mThis.VendorListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblVendor = mThis.VendorListView.getTable();

        mThis.initDropdownMenus(mThis.tblVendor);

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.VendorListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.VendorListView.showPage(mThis.getFilterData());
            }, 250);
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            vendor_type_id: mThis.elFilter_type.value,
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
                    html: '<span class="ps-2 " vslang="titles.Modify Vendor"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_vendor"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Vendor"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_vendor"
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
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

    mThis.editVendor = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.VendorListView.showPage(mThis.getFilterData());
            }
        };

        CreateVendorDialog.show(op);
    }
    mThis.deleteVendor = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.VendorListView.showPage(mThis.getFilterData());
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
                        mThis.VendorListView.showPage();
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
                VSUtil.setComboItems(mThis.elFilter_type, d.vendor_types, 'id', 'vendor_type', true, 'All Type', null);
                VSUtil.setComboItems(mThis.elFilter_category, d.vendor_categories, 'id', 'vendor_category', true, 'All Category', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.VendorListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();



const CreateVendorDialog = (() => {
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
                    return `
                <div class="vendor-form row p-1">
                        <div class="col-12 row pb-3">
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Name</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="name"
                                        class="data-input form-control"
                                        data-field="name"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Type</label>
                                <div class="material-input outlined">
                                    <select name="vendor_type_id" class="data-input form-control" data-field="vendor_type_id"></select>
                                </div>
                            </div>
                             <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Category</label>
                                <div class="material-input outlined">
                                    <select name="vendor_category_id" class="data-input form-control" data-field="category_id"></select>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Tax Number (optional)</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="tax_number"
                                        class="data-input form-control"
                                        data-field="tax_number"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Phone Number </label>
                                <div class="material-input outlined">
                                    <input type="number"
                                        name="phone"
                                        class="data-input form-control"
                                        data-field="phone"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Email</label>
                                <div class="material-input outlined">
                                    <input type="email"
                                        name="email"
                                        class="data-input form-control"
                                        data-field="email"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Contact Person</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="contact_person"
                                        class="data-input form-control"
                                        data-field="contact_person"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Contact Phone</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="contact_phone"
                                        class="data-input form-control"
                                        data-field="contact_phone"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12">
                                <label style="color:#777777;padding-left:6px;">Address</label>
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control"
                                        data-field="address"
                                        rows="3"
                                        placeholder=" ">
                                    </textarea>
                                </div>
                            </div>
                         </div>
                        
                        


                </div>
                `;

                },

                contentCreated: (me) => {
                },
                configSelect: [
                    {
                        name: "vendor_type_id",
                        data: "vendor_types",
                        textField: "vendor_type",
                        valueField: "id",
                    },
                    {
                        name: "vendor_category_id",
                        data: "vendor_categories",
                        textField: "vendor_category",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Create Vendor",
                    modifyTitle: "Modify Vendor",
                    targetProp: "vendor_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/vendor/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    // LocaleManager.translateZone(me.divModal);
                    // console.log(12,data);
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if (btnClose) btnClose.classList.add('d-none');
                },


                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: 'btn btn-secondary',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: 'btn btn-primary',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            vsapi.call([main_view.base_url, "/prm/vendor/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Vendor has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New vendor has been added successfully"
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



