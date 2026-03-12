"use strict";
var PurchaseOrdersComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Purchase Orders";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_purchases_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnPurchases");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_purchases");
    mThis.elFilter_type = mThis.self.querySelector('#_purchases _type_id');
    mThis.elFilter_category = mThis.self.querySelector('#_purchases_category_id');
    mThis.elSearch = mThis.self.querySelector("#_search_purchases");


    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Po Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom"> ${data.tax_number ?? ""}</span>`;
            }
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom"> ${data.type ?? ""}</span>`;
            }
        },
        {
            title: "Po Date",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap"><i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i> ${data.phone ?? ""}</span>`,
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
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        },


    ];


    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PoListView = new ListView('_purchases_list', {
            fetchApi: `${main_view.base_url}/prm/vendor/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.PoListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            CreatePurchasesOrderDialog.show(op);
        };


        mThis.pr_tbl = mThis.PoListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + "px";
        }
        const tblPo = mThis.PoListView.getTable();
        mThis.initDropdownMenus(tblPo);
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.PoListView.showPage(mThis.getFilterData());
            }, 250);
        });
        mThis.Acfg = new ExpandableRowConfig(tblPo.id, {
            dontExpandByClickingOn: [
                'dropdown-menu',
                "btn-po-action"
            ],
            onOpen: (container, detail_tr, parent_tr) => {
                const qtr = parent_tr;
                let op = {
                    id: qtr.dataset.id,
                    // block_code: qtr.dataset.blockcode,
                    // request_type_id: qtr.dataset.request_typeid,
                    // request_id: qtr.dataset.requestid,
                };
                // op[qtr.dataset.field] = qtr.dataset.toid;
                // if(op.student_id > 0 && op.request_type_id > 0)
                // mThis.displayApprovalActivityDetails(detail_tr, op);
                const div_wrapper = detail_tr.querySelector(".expandable-row-container");
                renderPoItem(op, div_wrapper);
            },
        });


        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            // vendor_type_id: mThis.elFilter_type.value,
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
     const renderPoItem = (d, elBody, onFinish = null , expandableRow = true) => {
    vsapi.call(`${main_view.base_url}/prm/vendor/list-paginate`,{
      id: d.id
    },null,false).then((res) => {
        let info = {};
        if(res.status_code === 200)
        {
            let data = res.data;
            info = data;
            //(3232,info);
        // console.log(999888,d);
        }
        let html = ``;
        const tHead = `
          <thead>
              <tr>
                  <th class="text-nowrap">Code</th>
                  <th class="text-nowrap">Item</th>
                  <th class="text-nowrap">QTY</th>
                  <th class="text-nowrap">Unit Price</th>
                  <th class="text-nowrap">Total Price</th>
                  <th class="text-nowrap">Accept QTY</th>
              </tr>
          </thead>
        `;
        let tBody = ``;
        if(info.length > 0){
          info.map(item => {
            tBody += `<tr>
                        <th class="text-nowrap">123</th>
                        <th class="text-nowrap">Book</th>
                        <th class="text-nowrap">ITM-10001</th>
                        <th class="text-nowrap">10</th>
                        <th class="text-nowrap">7</th>
                    </tr>`
          });
        }else
        tBody = ' <tr><th colspan="100%" class="text-nowrap text-center">No item</th></tr>'

        tBody ='<tbody>' + tBody + '</tbody>';
        html += '<table class = "table w-100" >' + tHead + tBody + '</table>';

        elBody.innerHTML = html;

        elBody.classList.add("p-3","rounded-3","table-secondary");
        if(!expandableRow){
          elBody.querySelectorAll("select.modal-select2").forEach(el => {
              $(el).select2({
                  tags: true
              });
          });
          // const elGroup = mThis.elBody.querySelector('.opt_group');
          // elGroup.onchange = (e) => {
          //     e.preventDefault();
          //     mThis.options.group_id = e.target.value;
          // };
          // ApprovalDialog.setOption(elBody,d,elBody.querySelector("#pre_price"));
          if (typeof onFinish === "function") onFinish();
        }

    });
  };

    mThis.editVendor = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                ;
                mThis.PoListView.showPage(mThis.getFilterData());
            }
        };

        CreateVendorDialog.show(op);
    }
    mThis.deleteVendor = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PoListView.showPage(mThis.getFilterData());
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
                        mThis.PoListView.showPage();
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
            mThis.PoListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();



const CreatePurchasesOrderDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                <div class="vendor-form row p-1">
                        <div class="col-12 row pb-3">
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Vendor</label>
                                <div class="material-input outlined">
                                    <select name="vendor_id" class="data-input form-control" data-field="vendor_id"></select>
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
                    createTitle: "Create Purchase Order",
                    modifyTitle: "Modify Purchase Order",
                    targetProp: "purchase_order_details",
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



