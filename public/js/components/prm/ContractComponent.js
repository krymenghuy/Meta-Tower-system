"use strict";

var ContractComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_contract_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.btnPDF = mThis.self.querySelector("#_asusp_btn_pdf");
    // mThis.elTenant = mThis.self.querySelector('#tenant_id');
    mThis.elBusinessType = mThis.self.querySelector("#business_type_id");
    // mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elStatus = mThis.self.querySelector("#el_contract_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle text-nowrap",
            data: (data, index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.tenant_name ?? ""}
                            <span class="d-block text-primary" style="font-size:12px;">${data.phone_number ?? ""}</span>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle",
            data: (data, index, tr) => {
                // const displayDate = (data.last_renewal_date && data.last_renewal_date.trim()) ? data.last_renewal_date : (data.start_date ?? '');
                const displayDate = data.start_date ?? "";
                return `<small class="px-2 py-2 bg-body-secondary text-nowrap text-muted rounded-2"><i class="fa-regular fa-clock"></i> ${displayDate}</small>`;
            },
        },
        {
            transTitle: "titles.End Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<small class="px-2 py-2 bg-body-secondary text-muted text-nowrap rounded-2"><i class="fa-regular fa-clock"></i> ${data.end_date ?? ""}</smaLL>`;
            },
        },
        {
            transTitle: "titles.Business",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.business_type ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.space_type ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<span class="px-2 py-1 bg-prm-custom text-nowrap text-white rounded font-medium">${data.space_code ?? ""}</span>`;
            },
        },

        {
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                const price = VSMoney.formatAmount(
                    data.price,
                    data.currency_code ?? "USD",
                );

                if (data.price_type === "total") {
                    return `
                        <span class="text-nowrap w-semibold">${price} <small class="text-nowrap text-muted">/mon</small></span>
                        <span class="d-block text-primary" style="font-size:12px;">Whole Room</span>
                    `;
                }

                return `
                    <span class="text-nowrap text-primary-custom">
                            ${price}
                        <small class="text-nowrap text-muted"> /m²</small>
                    </span>
                    <span class="d-block text-primary" style="font-size:12px;">${data.sqm_size ?? "-"} m²</span>
                `;
            },
        },
        {
            transTitle: "titles.Deposit",
            className: "align-middle",
            data: (data) => {
                const deposit = VSMoney.formatAmount(
                    data.deposit,
                    data.currency_code ?? "USD",
                );
                return `<div class="text-primary-prm text-capitalize" style="width:90px;">
                        <span class="text-prm-custom" >${deposit}</span>
                    </div>`;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:300px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "_"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = parseInt(data.status_id, 10);
                const statusKey = (data.status ?? "").toLowerCase();
                const map = {
                    1: {
                        text: "Pending",
                        cls: "bg-warning-subtle text-warning border border-warning",
                    },
                    2: {
                        text: "Active",
                        cls: "bg-success-subtle text-success border border-success",
                    },
                    3: {
                        text: "Expired",
                        cls: "bg-danger-subtle text-danger border border-danger",
                    },
                    4: {
                        text: "Terminated",
                        cls: "bg-danger-subtle text-danger border border-danger",
                    },
                };
                const byName = {
                    pending:
                        "bg-warning-subtle text-warning border border-warning",
                    active: "bg-success-subtle text-success border border-success",
                    expired:
                        "bg-danger-subtle text-danger border border-danger",
                    terminated:
                        "bg-danger-subtle text-danger border border-danger",
                };
                const m = map[statusId] || null;
                const label =
                    m?.text ||
                    (statusKey === "terminated"
                        ? "Terminated"
                        : (data.status ?? "—"));
                const cls =
                    m?.cls || byName[statusKey] || "bg-light text-muted";
                return `<span class="badge ${cls}" style="min-width: 100px;" data-status_id="${data.status_id}">${label}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn_contract_action" data-id="${data.id}" data-tenantid="${data.tenant_id}" data-statusid="${data.status_id}" data-status="${data.status ?? ""}" data-end-date="${data.end_date ?? ""}" aria-haspopup="true" aria-expanded="false" style="padding: 0 10px;">
                       <span>
                            <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                       </span>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView("_contract_list", {
            fetchApi: `${main_view.base_url}/prm/contract/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.dataset.tenantid = data.tenant_id;
                tr.dataset.status = data.status ?? "";
                tr.dataset.endDate = data.end_date ?? "";
                tr.classList.add("contract");
                tr.setAttribute(
                    "id",
                    ["contract_invoice_id", data.id].join(""),
                );
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ContractListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(227, false)) return;
            ContractDialog.show(op);
        };

        mThis.pr_tbl = mThis.ContractListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };

        mThis.tblContract = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblContract);

        if (!mThis.tblContract.id)
            mThis.tblContract.id = "_contract_list_table";
        new ExpandableRowConfig(mThis.tblContract.id, {
            dontExpandByClickingOn: ["btn_contract_action"],
            onOpen: (container, detail_tr, parent_tr) => {
                const rawId = parent_tr.getAttribute("id") || "";
                const id = rawId.replace(/^contract_invoice_id/, "");
                if (id && !Number.isNaN(Number(id)))
                    mThis.displayContractDetail(container, id);
            },
        });

        // Filter change handler with tooltip reinitialization
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after filter
                // setTimeout(() => {
                //     $('[data-bs-toggle="tooltip"]').tooltip();
                // }, 500);
            };
        });

        // Search handler with tooltip reinitialization
        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }, 500);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.parseSafeDate = (value) => {
        if (!value) return null;
        const raw = String(value).trim();
        if (!raw) return null;

        const monthMap = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
        };

        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            const [year, month, day] = raw.split("-").map(Number);
            return new Date(year, month - 1, day);
        }

        if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) {
            const [dayStr, monthStr, yearStr] = raw.split("-");
            const month = monthMap[monthStr.toLowerCase()];
            if (month === undefined) return null;
            return new Date(Number(yearStr), month, Number(dayStr));
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const [day, month, year] = raw.split("/").map(Number);
            return new Date(year, month - 1, day);
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return null;
        return new Date(
            parsed.getFullYear(),
            parsed.getMonth(),
            parsed.getDate(),
        );
    };

    mThis.isWithinNextThreeMonths = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);

        return date >= today && date <= maxDate;
    };

    mThis.displayContractDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        Promise.all([
            vsapi.call(
                `${main_view.base_url}/prm/contract/details`,
                { id },
                null,
                null,
            ),
            vsapi.call(
                `${main_view.base_url}/prm/contract/list-renewals`,
                { contract_id: id, per_page: 50 },
                null,
                null,
            ),
        ])
            .then(([detailsRes, renewalsRes]) => {
                if (detailsRes.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load contract details</div>`;
                    return;
                }
                const renewals =
                    renewalsRes.status_code === 200 &&
                    renewalsRes.data &&
                    renewalsRes.data.data
                        ? renewalsRes.data.data
                        : [];
                mThis.renderContractDetail(
                    container,
                    detailsRes.data || {},
                    id,
                    renewals,
                );
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading contract details</div>`;
            });
    };

    mThis.renderContractDetail = (container, d, contractId, renewals) => {
        const renewalsList = Array.isArray(renewals) ? renewals : [];
        const escapeHtml = (str) => {
            if (!str) return "";
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        };
        let renewalTableHtml = "";
        if (renewalsList.length > 0) {
            const unitPillClass =
                "px-2 py-1 bg-prm-custom text-white rounded font-medium ";
            const rows = renewalsList
                .map((r) => {
                    const spaceCode = (r.space_code ?? "").trim();
                    const unitCell = `<span class="${unitPillClass}">${escapeHtml(spaceCode)}</span>`;
                    return `
                <tr>
                    <td class="align-middle text-nowrap">${(r.renewal_date ?? "").trim()}</td>
                    <td class="align-middle text-nowrap">${(r.start_date ?? "").trim()}</td>
                    <td class="align-middle text-nowrap">${(r.end_date ?? "").trim()}</td>
                    <td class="align-middle text-nowrap">${unitCell}</td>
                    <td class="text-break align-middle" style="width: 300px;">${escapeHtml((r.remarks ?? "_").trim())}</td>
                    <td class="align-middle text-nowrap"><div class="d-flex flex-column"><span class="text-capitalize">${escapeHtml((r.update_user ?? "").trim()) || "_"}</span><small class="text-muted">${(r.updated_at ?? "").trim() || ""}</small></div></td>
                </tr>`;
                })
                .join("");
            renewalTableHtml = `
                    <div class="card  shadow-sm overflow-hidden">
                        <div class="card-body p-0">
                            <div class="table-responsive ">
                                <table class="table table-hover table-sm mb-0 align-middle table--dropdown">
                                    <thead>
                                        <tr class="table-light">
                                            <th class="text-nowrap  py-2 px-3">Renewal date</th>
                                            <th class="text-nowrap  py-2 px-3">Start date</th>
                                            <th class="text-nowrap  py-2 px-3">End date</th>
                                            <th class="text-nowrap  py-2 px-3">Unit</th>
                                            <th class="text-nowrap  py-2 px-3">Remark</th>
                                            <th class="text-nowrap  py-2 px-3">Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top">${rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
        } else {
            renewalTableHtml = `
                    <div class="card  shadow-sm">
                        <div class="card-body text-center py-4">
                            <span class="rounded-circle d-inline-flex align-items-center justify-content-center bg-light text-muted mb-2" style="width:48px;height:48px;"><i class="fa-solid fa-rotate-right fa-lg"></i></span>
                            <p class="text-muted mb-0">No renewal history for this contract.</p>
                            <small class="text-muted">Renewals will appear here when the contract is renewed.</small>
                        </div>
                    </div>`;
        }
        container.innerHTML = renewalTableHtml;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_contract_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_contract",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Print Contract">Print Contract</span>',
                    icon: `<i class="fa-solid text-success fa-print fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_contract",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Renew Contract"></span>',
                    icon: `<i class="fa-solid fa-arrow-up-right-from-square fs-5 text-prm-custom"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "renew_contract",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Terminate Contract"></span>',
                    icon: `<i class="fa-regular fa-circle-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "terminate_contract",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete Contract"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_contract",
                },
                {
                    html: '<span class="ps-2">View Refund</span>',
                    icon: `<i class="fa-regular fa-eye fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_refund",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const row = container.closest("tr");
                const statusId = Number(
                    container.dataset.statusid ?? row?.dataset?.statusid,
                );
                const statusText = String(
                    container.dataset.status ?? row?.dataset?.status ?? "",
                )
                    .trim()
                    .toLowerCase();
                const isActive = statusText === "active" || statusId === 2;
                const endDate = mThis.parseSafeDate(
                    container.dataset.endDate ?? row?.dataset?.endDate ?? "",
                );
                const isPending = statusText === "pending";
                const isExpired = statusText === "expired";
                const isTerminated = statusText === "terminated";
                // show renew only when status is active and end date is within next 3 months (not for pending)
                const showRenew =
                    isActive &&
                    endDate &&
                    mThis.isWithinNextThreeMonths(endDate);
                const canModify = !isExpired && !isTerminated;
                menu.print_contract.style.display =
                    statusId !== 2 ? "none" : "block";
                menu.edit_contract.style.display = canModify ? "block" : "none";
                menu.renew_contract.style.display = showRenew
                    ? "block"
                    : "none";
                if (menu.terminate_contract) {
                    // show terminate only when status is active
                    menu.terminate_contract.style.display = isActive
                        ? "block"
                        : "none";
                }
                if (menu.delete_contract) {
                    // show delete when status is pending, expired, or terminated
                    menu.delete_contract.style.display =
                        isPending || isExpired || isTerminated
                            ? "block"
                            : "none";
                }
                if (menu.view_refund) {
                    menu.view_refund.style.display = isTerminated
                        ? "block"
                        : "none";
                }
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_contract": {
                        mThis.editContract(id, menuLink);
                        break;
                    }
                    case "print_contract": {
                        mThis.printContract(id, menuLink);
                        break;
                    }
                    case "renew_contract": {
                        mThis.renewContract(id, menuLink);
                        break;
                    }
                    case "terminate_contract": {
                        mThis.terminateContract(id, menuLink);
                        break;
                    }
                    case "delete_contract": {
                        mThis.deleteContract(id, menuLink);
                        break;
                    }
                    case "view_refund": {
                        mThis.viewRefund(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.viewRefund = (id, menuLink) => {
        RefundDetailsDialog.show({
            contract_id: id,
            onSuccess: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.editContract = (id, menulink) => {
        if (!id) return;
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            },
        };

        if (!AuthManager.allowed(228, false)) return;
        ContractDialog.show(op);
    };
    mThis.printContract = (id, menulink) => {
        const tr = menulink.closest("tr");
        const tenant_id = tr?.dataset.tenantid;
        let op = {
            id: id,
            tenant_id: tenant_id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(229, false)) return;
        CreateContractDialog.show(op);
    };
    mThis.renewContract = (id, menulink) => {
        if (!id) return;

        let op = {
            id: id,
            contract_id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(230, false)) return;
        RenewDialog.show(op);
    };
    mThis.terminateContract = (id, menuLink) => {
        if (!id) return;

        if (!AuthManager.allowed(231, false)) return;

        TerminateContractDialog.show({
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            },
        });
    };

    // mThis.terminateContract = (id, menuLink) => {
    //     if (!id) return;

    //     const op = {
    //         id: id,
    //         btn: menuLink,
    //     };
    //     if (!AuthManager.allowed(231,false)) return;
    //     cv_interact.confirm(
    //         "confirm_terminate",
    //         {
    //             title: "terminated",
    //             context: "delete",
    //             confirmButtonText: "Terminate",
    //         },
    //         (yes) => {
    //             if (!yes) return;
    //             vsapi
    //                 .call(
    //                     [main_view.base_url, "/prm/contract/terminate"].join(""),
    //                     op,
    //                     menuLink,
    //                     null,
    //                 )
    //                 .then((res) => {
    //                     if (res.status_code === 200) {
    //                         cv_interact.success("contract_terminated");
    //                         if (mThis.ContractListView) {
    //                             mThis.ContractListView.showPage(mThis.getFilterData());
    //                         }
    //                     } else {
    //                         cv_interact.error(res.error_message);
    //                     }
    //                 });
    //         },
    //     );
    // };
    mThis.deleteContract = (id, menuLink) => {
        if (!id) return;
        if (!AuthManager.allowed(232, false)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "deleted",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (yes) => {
                if (!yes) return;
                vsapi
                    .call(
                        [main_view.base_url, "/prm/contract/delete"].join(""),
                        { id },
                        menuLink,
                        null,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("delete_success_contract");
                            if (mThis.ContractListView) {
                                mThis.ContractListView.showPage(
                                    mThis.getFilterData(),
                                );
                            }
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/contract/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenants', null);
                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.statuses,
                    "id",
                    "status_name",
                    "",
                    "All Statuses",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elBusinessType,
                    d.business_types,
                    "id",
                    "business_type",
                    "",
                    "All Business Types",
                    "",
                );

                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ContractListView.showPage(mThis.getFilterData());

            // Initialize tooltips after table loads
            // setTimeout(() => {
            //     $('[data-bs-toggle="tooltip"]').tooltip();
            // }, 800);

            // Auto-refresh every hour to update contract statuses
            if (!mThis.autoRefreshInterval) {
                mThis.autoRefreshInterval = setInterval(() => {
                    console.log("Auto-refreshing contracts...");
                    mThis.ContractListView.showPage(mThis.getFilterData());

                    // Re-initialize tooltips after refresh
                    // setTimeout(() => {
                    //     $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    //     $('[data-bs-toggle="tooltip"]').tooltip();
                    // }, 800);
                }, 3600000); // 1 hour = 3600000ms
            }
        });
    };

    return mThis;
})();
const ContractDialog = (() => {
    const self = {};
    let dialog = null;

    const clearStrayModalBackdrop = () => {
        document
            .querySelectorAll(".modal-backdrop")
            .forEach((el) => el.remove());
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
    };

    const wrapDialogOp = (op) => {
        if (!op) return op;
        const onClose = op.onClose;
        return {
            ...op,
            onClose: (...args) => {
                clearStrayModalBackdrop();
                if (typeof onClose === "function") onClose(...args);
            },
        };
    };
    // const parseDateInput = (value) => {
    //     if (!value) return null;
    //     const raw = String(value).trim();
    //     if (!raw) return null;
    //     if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    //         const [year, month, day] = raw.split('-').map(Number);
    //         return new Date(year, month - 1, day);
    //     }

    //     if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) {
    //         const [dayStr, monthStr, yearStr] = raw.split('-');
    //         const monthMap = {
    //             Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    //             Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    //         };
    //         const month = monthMap[monthStr];
    //         if (month === undefined) return null;
    //         return new Date(Number(yearStr), month, Number(dayStr));
    //     }

    //     if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    //         const [day, month, year] = raw.split('/').map(Number);
    //         return new Date(year, month - 1, day);
    //     }

    //     const parsed = new Date(raw);
    //     return Number.isNaN(parsed.getTime()) ? null : parsed;
    // };

    self.show = (op) => {
        console.log(6666, op);

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-start">
                <div class="">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input name="tenant" class="data-input form-control" data-field="tenant_name"  placeholder="Tenant" />
                                <label vslang="labels.Tenant">Tenant</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input name="legal_name" class="data-input form-control" disabled data-field="legal_name" placeholder=" " />
                                <label vslang="labels.Legal Name">Legal Name</label>
                            </div>
                        </div>

                        <div class="col-6">
                            <select data-style="material" placeholder="Business Type" name="business_type_id" class="data-input form-control" data-field="business_type_id"> </select>
                        </div>
                        <div class="col-3">
                            <select data-style="material" placeholder="Unit Code" name="code" class="data-input form-control" data-field="space_id"> </select>
                        </div>
                        <div class="col-3">
                            <div class="vs-material-field">
                                <input type="text" name="deposit" class="data-input form-control" data-field="deposit" placeholder=" " />
                                <label vslang="labels.Deposit">Deposit</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                <label vslang="labels.Start Date">Start Date</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" placeholder=" " />
                                <label vslang="labels.End Date">End Date</label>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 bg-white border rounded shadow-sm">
                        <h6 class="mb-3 text-golden" vslang="labels.Unit Details">Unit Details</h6>
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" disabled />
                                    <label vslang="labels.Type">Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" disabled />
                                    <label vslang="labels.Size (m²)">Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="hidden" name="price_type" class="data-input form-control" data-field="price_type" disabled />
                                    <input type="text" name="price_type_label" class="data-input form-control" data-field="price_type" style="background-color: rgb(255, 255, 255);" disabled />
                                    <label vslang="labels.Charge As">Charge As</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" disabled />
                                    <label vslang="labels.Price">Price</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div class="col-12 mt-3">
                        <div class="vs-material-field">
                            <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                            <label vslang="labels.Remark">Remark</label>
                        </div>
                    </div>
                </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                        type: "select",
                        prefetch: true,
                        maxDropdownHeight: "380px",
                        // api:
                        query: {
                            from: "tenants",
                            select: ["id", "name", "code", "legal_name"],
                            searchFields: {
                                name: "LIKE",
                                code: "=",
                                legal_name: "LIKE",
                            },
                            orderBy: [["id", "desc"]],
                        },
                        showColumnHeader: true,
                        columns: {
                            code: "Code",
                            name: "Name",
                            // legal_name: "Legal Name"
                        },
                        onSelect: (item) => {
                            const tenantId = item?.id || "";
                            const tenantName = item?.name || "";
                            const tenantCode = item?.code || "";
                            me.controls.tenant.value = tenantCode
                                ? `${tenantName} (${tenantCode})`
                                : tenantName;
                            me.controls.tenant.dataset.tenantId = tenantId;
                            me.tenant_id = tenantId;
                            me.controls.legal_name.value =
                                item?.legal_name || "";
                        },
                    });
                    applyNumberInput(me.controls.deposit);
                },

                configSelect: [
                    {
                        name: "tenant_id",
                        data: "tenants",
                        textField: "tenant",
                        valueField: "id",
                    },
                    {
                        name: "business_type_id",
                        data: "business_types",
                        textField: "business_type",
                        valueField: "id",
                    },
                    {
                        name: "code",
                        data: "building_spaces",
                        textField: "code",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Contract",
                    modifyTitle: "vslang:titles.Modify Contract",
                    targetProp: "contract_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/contract/form-options",
                        ].join(""),
                        params: (me, op) => {
                            return {
                                id: op.id,
                                space_id: op.space_id ?? null,
                                tenant_id: op.tenant_id ?? null,
                            };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const isModify = me.dataOptions?.id > 0;
                    const det = data?.contract_details || {};
                    const statusId = Number(det.status_id);
                    const statusText = String(det.status ?? "")
                        .trim()
                        .toLowerCase();
                    const isActive = statusText === "active" || statusId === 2;

                    if (isModify) {
                        me.setReadOnly(true, ["start_date", "end_date"]);
                        if (isActive) {
                            me.setReadOnly(true, ["code"]);
                        }
                    } else {
                        const hasPrefillSpace = me.dataOptions.space_id > 0;
                        me.setReadOnly(hasPrefillSpace, ["code"]);
                    }

                    const tenantLocked = isModify || !!data?.prefill_tenant_id;
                    me.controls.tenant.disabled = tenantLocked;

                    const prepareOpts = me.options?.prepareFormOptions;
                    if (isModify && me.elTitle && prepareOpts?.modifyTitle) {
                        me.elTitle.innerHTML = prepareOpts.modifyTitle;
                    } else if (
                        !isModify &&
                        me.elTitle &&
                        prepareOpts?.createTitle
                    ) {
                        me.elTitle.innerHTML = prepareOpts.createTitle;
                    }

                    if (
                        me.searchTenant &&
                        typeof me.searchTenant.reset === "function"
                    ) {
                        me.searchTenant.reset();
                    }
                    // Preselect tenant when coming from TenantComponent or from booked unit phone-match.
                    const prefillTenantId = !isModify
                        ? (me.dataOptions.tenant_id ??
                          data?.prefill_tenant_id ??
                          null)
                        : null;
                    if (prefillTenantId) {
                        me.tenant_id = prefillTenantId;
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/prm/tenant/details",
                                ].join(""),
                                { id: prefillTenantId },
                                false,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code === 200 && res.data) {
                                    const t = res.data;
                                    const tenantInput =
                                        me.divModal.querySelector(
                                            'input[name="tenant"]',
                                        );
                                    if (tenantInput) {
                                        const tenantCode = t.code || "";
                                        tenantInput.value = tenantCode
                                            ? `${t.name || ""} (${tenantCode})`
                                            : t.name || "";
                                        tenantInput.dataset.tenantId =
                                            prefillTenantId;
                                    }
                                    if (me.controls.legal_name) {
                                        me.controls.legal_name.value =
                                            t.legal_name || "";
                                    }
                                }
                            })
                            .catch(() => {});
                    } else {
                        me.tenant_id =
                            data?.contract_details?.tenant_id ?? null;
                    }
                    const unitSelect = me.divModal.querySelector(
                        '[data-field="space_id"]',
                    );
                    const spaceRows = Array.isArray(data?.building_spaces)
                        ? data.building_spaces
                        : [];

                    const spaceTypes = Array.isArray(data?.space_types)
                        ? data.space_types
                        : [];
                    const getSpaceTypeName = (spaceTypeId) => {
                        const row = spaceTypes.find(
                            (x) => String(x.id) === String(spaceTypeId),
                        );
                        return row?.space_type ?? "";
                    };
                    const applyUnitData = (spaceId) => {
                        const selected = spaceRows.find(
                            (row) => String(row.id) === String(spaceId),
                        );
                        if (!selected) {
                            me._createContractSpaceTypeId = null;
                            return;
                        }
                        me._createContractSpaceTypeId =
                            selected.space_type_id ?? null;
                        if (me.controls.space_name) {
                            me.controls.space_name.value =
                                selected.space_type ??
                                getSpaceTypeName(selected.space_type_id) ??
                                "";
                        }
                        if (me.controls.sqm_size)
                            me.controls.sqm_size.value =
                                selected.sqm_size ?? "";
                        if (
                            me.controls.price_type &&
                            me.controls.price_type_label
                        ) {
                            me.controls.price_type.value =
                                selected.price_type ?? "";

                            me.controls.price_type_label.value =
                                selected.price_type === "sqm"
                                    ? "m²"
                                    : selected.price_type === "total"
                                      ? "Unit"
                                      : "";
                        }
                        if (me.controls.price)
                            me.controls.price.value = selected.price ?? "";
                    };

                    if (unitSelect) {
                        unitSelect.onchange = (e) => {
                            applyUnitData(e.target.value);
                        };
                        const prefillSpaces = Array.isArray(
                            data?.prefill_spaces,
                        )
                            ? data.prefill_spaces
                            : [];
                        const prefillSpaceIds = prefillSpaces
                            .map((s) => String(s?.id ?? "").trim())
                            .filter((v) => v !== "");
                        const defaultSpaceId =
                            me.dataOptions?.space_id ??
                            data?.contract_details?.space_id ??
                            prefillSpaceIds[0] ??
                            "";
                        if (defaultSpaceId) {
                            unitSelect.value = defaultSpaceId;
                            applyUnitData(defaultSpaceId);
                        } else if (unitSelect.value) {
                            applyUnitData(unitSelect.value);
                        }
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
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            // if (!me.tenant_id) {
                            //     cv_interact.error("Please select a tenant.");
                            //     return;
                            // }
                            // if (!op.business_type_id) {
                            //     cv_interact.error("Please select a business type.");
                            //     return;
                            // }
                            if (
                                me._createContractSpaceTypeId !== undefined &&
                                me._createContractSpaceTypeId !== null
                            ) {
                                op.space_type_id =
                                    me._createContractSpaceTypeId;
                            }
                            op.tenant_id = me.tenant_id;
                            op.id = me.dataOptions.id;
                            // op.tenant_id = me.tenant_id;

                            // if (!op.id) {
                            //     const endDt = parseDateInput(op.end_date);
                            //     if (!endDt || Number.isNaN(endDt.getTime())) {
                            //         cv_interact.error("Please enter a valid End Date.");
                            //         return;
                            //     }
                            //     const endDay = new Date(
                            //         endDt.getFullYear(),
                            //         endDt.getMonth(),
                            //         endDt.getDate(),
                            //     );
                            //     const today = new Date();
                            //     today.setHours(0, 0, 0, 0);
                            //     if (endDay < today) {
                            //         cv_interact.error("End date cannot be in the past.");
                            //         return;
                            //     }
                            // }

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/contract/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success_contract",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_success_contract",
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
        dialog.show(wrapDialogOp(op));
    };
    return self;
})();

/**
 * Normalize contract dates from API or display (e.g. 30-Jun-2026) to YYYY-MM-DD for date inputs.
 */
function normalizeContractDateToIso(raw) {
    if (raw == null || raw === "") return "";
    const s = String(raw).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (m) {
        const months = {
            jan: 0,
            feb: 1,
            mar: 2,
            apr: 3,
            may: 4,
            jun: 5,
            jul: 6,
            aug: 7,
            sep: 8,
            oct: 9,
            nov: 10,
            dec: 11,
        };
        const mon = months[m[2].toLowerCase()];
        if (mon == null) return "";
        const d = new Date(parseInt(m[3], 10), mon, parseInt(m[1], 10));
        if (!Number.isNaN(d.getTime())) {
            return (
                d.getFullYear() +
                "-" +
                String(d.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(d.getDate()).padStart(2, "0")
            );
        }
        return "";
    }
    const d2 = new Date(s);
    if (!Number.isNaN(d2.getTime())) {
        return (
            d2.getFullYear() +
            "-" +
            String(d2.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d2.getDate()).padStart(2, "0")
        );
    }
    return "";
}

const RenewDialog = (() => {
    const self = {};
    let dialog = null;
    const hasAtLeastOneMonth = (startDate, endDate) => {
        const monthsDiff =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

        if (monthsDiff > 1) return true;
        if (monthsDiff < 1) return false;

        return endDate.getDate() >= startDate.getDate();
    };

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="p-3 border rounded">
                                <h6 class="mb-3 text-golden" vslang="titles.Old Contract">Old Contract</h6>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="old_contract_start" class="data-input form-control" data-field="old_contract_start"  placeholder=" " disabled />
                                            <label vslang="labels.Start Date">Start Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="old_contract_end" class="data-input form-control" data-field="old_contract_end" placeholder=" " disabled />
                                            <label vslang="labels.End Date">End Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="number" name="old_contract_price" class="data-input form-control" data-field="old_contract_price" placeholder=" " disabled />
                                            <label vslang="labels.Price">Price</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <h6 class="mb-3 text-golden" vslang="titles.Renew Contract">Renew Contract</h6>
                                <div class="row g-3">
                                    <div class="col-4">
                                       <div class="vs-material-field">
                                           <input  data-style="material" type="date" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" " disabled />
                                             <label vslang="labels.Start Date">Start Date</label>
                                       </div>
                                   </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="end_date" class="data-input form-control" data-field="end_date" placeholder=" " />
                                            <label vslang="labels.End Date">End Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <select placeholder="unit code" data-style="material" name="code" placeholder=" " class="data-input form-control" data-field="space_id">
                                            </select>
                                        </div>
                                    </div>
                                     <div class="col-12">
                                        <div class="vs-material-field">
                                            <textarea name="remarks" class="data-input form-control" data-field="remarks"></textarea>
                                            <label vslang="labels.Remark">Renewal Remark</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-lg">
                                <h6 class="mb-3 text-golden" vslang="labels.Unit Details">Unit Details</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" placeholder=" " readonly disabled />
                                    <label vslang="labels.Type">Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " readonly disabled />
                                    <label vslang="labels.Size (m²)">Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price_type" class="data-input form-control" data-field="price_type" placeholder=" " readonly disabled />
                                    <label vslang="labels.Charge As">Charge As</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " readonly disabled />
                                    <label vslang="labels.Price">Price</label>
                                </div>
                            </div>
                                </div>
                            </div>
                        </div>

                    </div>
                `;
                },
                contentCreated: (me) => {
                    DateTimePicker.initAll(me.divModal);
                },

                prepareFormOptions: {
                    createTitle: "vslang:titles.Renew Contract",
                    modifyTitle: "vslang:titles.Renew Contract",
                    targetProp: "contract_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/contract/form-options",
                        ].join(""),
                        params: (op) => ({ id: op.id }),
                    },
                },
                configSelect: [
                    {
                        name: "code",
                        data: "building_spaces",
                        textField: "code",
                        valueField: "id",
                    },
                ],

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    const det = data.contract_details || {};
                    // const oldStartIso = normalizeContractDateToIso(det.start_date);
                    // const oldEndIso = normalizeContractDateToIso(det.end_date);
                    if (me.controls.old_contract_start) {
                        me.controls.old_contract_start.value =
                            det.start_date || "";
                    }
                    if (me.controls.old_contract_end) {
                        me.controls.old_contract_end.value = det.end_date || "";
                    }
                    if (me.controls.old_contract_price) {
                        me.controls.old_contract_price.value =
                            det.price != null && det.price !== ""
                                ? det.price
                                : "";
                    }
                    // Renew period starts the same calendar day as the current contract end_date.
                    const renewStartIso = det.renew_start_date || "";

                    if (me.controls.start_date) {
                        me.controls.start_date.value = renewStartIso;
                    }
                    if (me.controls.end_date) me.controls.end_date.value = "";
                    if (me.controls.price) {
                        me.controls.price.value =
                            det.price != null && det.price !== ""
                                ? det.price
                                : "";
                    }
                    if (me.controls.price_type) {
                        me.controls.price_type.value = det.price_type ?? "";
                    }
                    if (me.controls.remarks) me.controls.remarks.value = "";
                    // DateTimePicker may attach after first paint; force final values.
                    setTimeout(() => {
                        if (me.controls.start_date && renewStartIso) {
                            me.controls.start_date.value = renewStartIso;
                        }
                        // Keep renew end_date empty by default (user must choose).
                        if (me.controls.end_date) {
                            me.controls.end_date.value = "";
                        }
                    }, 0);
                    const unitSelect = me.divModal.querySelector(
                        '[data-field="space_id"]',
                    );
                    const spaceRows = Array.isArray(data?.building_spaces)
                        ? data.building_spaces
                        : [];
                    const spaceTypes = Array.isArray(data?.space_types)
                        ? data.space_types
                        : [];
                    const getSpaceTypeName = (spaceTypeId) => {
                        const row = spaceTypes.find(
                            (x) => String(x.id) === String(spaceTypeId),
                        );
                        return row?.space_type ?? "";
                    };
                    const applyContractPriceFields = () => {
                        if (me.controls.price_type) {
                            me.controls.price_type.value = det.price_type ?? "";
                            me.controls.price_type.value =
                                det.price_type == "sqm"
                                    ? "m²"
                                    : det.price_type === "total"
                                      ? "Unit"
                                      : "";
                        }
                        if (me.controls.price) {
                            me.controls.price.value =
                                det.price != null && det.price !== ""
                                    ? det.price
                                    : "";
                        }
                    };
                    const setUnitFields = (unitData) => {
                        if (!unitData) return;
                        if (me.controls.space_name) {
                            me.controls.space_name.value =
                                unitData.space_type ??
                                getSpaceTypeName(unitData.space_type_id);
                        }
                        if (me.controls.sqm_size)
                            me.controls.sqm_size.value =
                                unitData.sqm_size ?? "";
                        // if (me.controls.price_type) me.controls.price_type.value = unitData.price_type ?? '';
                        if (me.controls.price_type) {
                            me.controls.price_type.value =
                                unitData.price_type ?? "";

                            console.log(3333, unitData.price_type);

                            me.controls.price_type.value =
                                unitData.price_type === "sqm"
                                    ? "m²"
                                    : unitData.price_type === "total"
                                      ? "Unit"
                                      : "";
                        }
                        if (me.controls.price)
                            me.controls.price.value = unitData.price ?? "";
                        applyContractPriceFields();
                    };
                    const applyUnitData = (spaceId) => {
                        if (!spaceId) return;
                        const selected = spaceRows.find(
                            (row) => String(row.id) === String(spaceId),
                        );
                        if (selected) {
                            setUnitFields(selected);
                        }

                        // Refresh selected unit data from API when unit code changes.
                        vsapi
                            .call(
                                `${main_view.base_url}/prm/building-space/details`,
                                { id: spaceId },
                                null,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code !== 200 || !res.data)
                                    return;
                                const merged = selected
                                    ? { ...selected, ...res.data }
                                    : res.data;
                                setUnitFields(merged);
                            })
                            .catch(() => {});
                    };

                    if (unitSelect) {
                        unitSelect.onchange = (e) => {
                            applyUnitData(e.target.value);
                        };

                        const defaultSpaceId =
                            data?.contract_details?.space_id ?? "";
                        if (defaultSpaceId) {
                            unitSelect.value = defaultSpaceId;
                            applyUnitData(defaultSpaceId);
                        }
                    }
                    applyContractPriceFields();
                    me.detail = data.contract_details;
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            const renewStart = op.start_date
                                ? new Date(op.start_date)
                                : null;
                            const renewEnd = op.end_date
                                ? new Date(op.end_date)
                                : null;
                            if (!renewEnd || Number.isNaN(renewEnd.getTime())) {
                                cv_interact.error(
                                    "Please select a valid Renew End Date.",
                                );
                                return;
                            }
                            if (
                                renewStart &&
                                !Number.isNaN(renewStart.getTime()) &&
                                renewEnd <= renewStart
                            ) {
                                cv_interact.error(
                                    "Renew End Date must be after Renew Start Date.",
                                );
                                return;
                            }
                            delete op.old_contract_start;
                            delete op.old_contract_end;
                            delete op.old_contract_price;
                            delete op.price;
                            delete op.price_type;
                            op.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/contract/renew",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        cv_interact.success(
                                            "Contract has been renewed successfully",
                                        );
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

const TerminateContractDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                title: `${LocaleManager.trans("Terminate Contract", "titles")}`,

                createContent: () => {
                    return `
                <div class="row g-3">

                    <div class="col-6">
                        <div class="vs-material-field">
                            <input  name="deposit_amount" placeholder=" " class="data-input form-control" data-field="deposit_amount" readonly />
                            <label>Deposit Amount</label>
                        </div>
                    </div>

                    <div class="col-6">
                        <div class="vs-material-field">
                            <input name="deduct_amount" placeholder=" " class="data-input form-control" data-field="deduct_amount" />
                            <label>Deduct Amount</label>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="vs-material-field">
                            <input name="refund_amount" placeholder=" " class="data-input form-control" data-field="refund_amount" readonly />
                            <label>Refund Amount</label>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="vs-material-field">
                            <textarea name="remarks" placeholder=" " class="data-input form-control" data-field="remarks"></textarea>
                            <label>Remark</label>
                        </div>
                    </div>

                </div>
                `;
                },

                contentCreated: (me) => {
                    applyNumberInput(me.controls.deduct_amount);

                    const calculateRefund = () => {
                        const deposit = parseFloat(
                            me.controls.deposit_amount.value || 0,
                        );

                        const deduct = parseFloat(
                            me.controls.deduct_amount.value || 0,
                        );

                        const refund = Math.max(0, deposit - deduct);

                        me.controls.refund_amount.value = refund.toFixed(2);
                    };

                    me.controls.deduct_amount.addEventListener(
                        "input",
                        calculateRefund,
                    );

                    me.calculateRefund = calculateRefund;
                },

                onPrepareForm: (me) => {
                    me.controls.deposit_amount.value = "";
                    me.controls.deduct_amount.value = "";
                    me.controls.refund_amount.value = "";
                    if (me.controls.remarks) me.controls.remarks.value = "";

                    vsapi
                        .call(
                            `${main_view.base_url}/prm/contract/details`,
                            { id: me.dataOptions.id },
                            null,
                            null,
                        )
                        .then((res) => {
                            if (res.status_code !== 200) return;

                            const data = res.data || {};

                            me.controls.deposit_amount.value =
                                data.deposit || 0;

                            me.controls.deduct_amount.value = 0;

                            me.calculateRefund();
                        });
                },

                buttons: [
                    {
                        label: "Cancel",
                        cssClass: "btn btn-secondary",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "Terminate",
                        cssClass: "btn btn-danger",
                        click: (me, btn) => {
                            const opSave = me.getData();

                            const deposit = parseFloat(
                                opSave.deposit_amount || 0,
                            );

                            const deduct = parseFloat(
                                opSave.deduct_amount || 0,
                            );

                            if (deduct > deposit) {
                                cv_interact.error(
                                    "Deduction cannot exceed deposit amount.",
                                );

                                return;
                            }

                            opSave.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    `${main_view.base_url}/prm/contract/terminate`,
                                    opSave,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        cv_interact.success(
                                            "contract_terminated",
                                        );

                                        me.hide(true);
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

window.RefundDetailsDialog =
    window.RefundDetailsDialog ||
    (() => {
        const self = {};

        self.show = ({ contract_id, onSuccess }) => {
            InputBox.resetInstance("refundDetailsView");

            InputBox.show({
                title: `Refund Details`,
                instanceKey: "refundDetailsView",
                context: "info",
                size: "lg",
                confirmButtonText: null,
                showconfirmButtonText: false,
                cancelButtonText: `Close`,

                createContent() {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <div id="_rdv_loader" class="text-center py-4">
                            <div class="spinner-border spinner-border-sm text-primary"></div>
                            <span class="ms-2 text-muted small">Loading...</span>
                        </div>

                        <div id="_rdv_content" class="d-none">
                            <div class="d-flex align-items-center mb-3">
                                <span id="_rdv_unit_header_badge" class="badge text-primary border border-primary bg-primary-subtle px-3 py-1 fs-6">
                                </span>
                                <div style="flex:1; height:1px; background:#e0e0e0; margin-left:10px;"></div>
                            </div>
                            <div class="card shadow-sm border border-danger-subtle overflow-hidden">
                                <div class="card-body p-0">
                                    <table class="table table-sm table--white mb-0 align-middle w-100">
                                        <thead class="header-uppercase table-light">
                                            <tr>
                                                <th class="text-start ps-3" vslang="titles.Tenant">Tenant</th>
                                                <th class="text-start" vslang="labels.Deposit Amount">Deposit Amount</th>
                                                <th class="text-start" vslang="labels.Deduct Amount">Deduct Amount</th>
                                                <th class="text-start" vslang="labels.Refund Amount">Refund Amount</th>
                                                <th class="text-start pe-3" vslang="labels.Remark">Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="align-middle ps-3 py-3" id="_rdv_tenant_cell"></td>
                                                <td class="align-middle text-start text-dark fw-semibold py-3" id="_rdv_deposit"></td>
                                                <td class="align-middle text-start text-danger fw-semibold py-3" id="_rdv_deduct"></td>
                                                <td class="align-middle text-start text-success fs-6 fw-bold py-3" id="_rdv_refund"></td>
                                                <td class="align-middle pe-3 py-3">
                                                    <div id="_rdv_remarks" class="text-prm-custom text-wrap text-break" style="font-size: 13px; max-width: 250px; word-break: break-word;"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="p-3 border-top bg-light d-flex justify-content-end align-items-center flex-wrap gap-2">
                                        <div id="_rdv_date" class="text-end"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    LocaleManager.translateZone(div);
                    return div;
                },

                onOpen(ibMe) {
                    const divInputboxCard = InputBox._store
                        .get("refundDetailsView")
                        .container.closest(".inputbox-card");
                    const btnOk =
                        divInputboxCard.querySelector(".inputbox-btn.ok");
                    btnOk.classList.add("d-none");

                    const restore = () => btnOk.classList.remove("d-none");
                    divInputboxCard.addEventListener(
                        "click",
                        function handler(e) {
                            const isClose = e.target.closest(
                                ".inputbox-btn.cancel, .inputbox-close, .btn-close, [data-dismiss]",
                            );
                            if (isClose) {
                                restore();
                                divInputboxCard.removeEventListener(
                                    "click",
                                    handler,
                                );
                            }
                        },
                    );

                    const loader = document.getElementById("_rdv_loader");
                    const content = document.getElementById("_rdv_content");
                    const depositEl = document.getElementById("_rdv_deposit");
                    const deductEl = document.getElementById("_rdv_deduct");
                    const refundEl = document.getElementById("_rdv_refund");
                    const remarksEl = document.getElementById("_rdv_remarks");
                    const dateEl = document.getElementById("_rdv_date");

                    vsapi
                        .call(
                            `${main_view.base_url}/prm/contract/details`,
                            { id: contract_id },
                            null,
                            null,
                        )
                        .then((res) => {
                            loader.classList.add("d-none");
                            content.classList.remove("d-none");

                            if (
                                res.status_code !== 200 ||
                                !res.data ||
                                !res.data.refund_details
                            ) {
                                content.innerHTML = `<div class="alert alert-danger mb-0">No refund details found for this contract.</div>`;
                                return;
                            }

                            const details = res.data;
                            const refund = details.refund_details;
                            const currency = details.currency_code ?? "USD";

                            const tenantInfo = `
                                <span class="d-block text-prm-custom text-nowrap text-capitalize fw-semibold">${details.tenant_name ?? ""}</span>
                                <small class="d-block text-muted text-nowrap">${details.phone_number ?? ""}</small>
                                <small class="d-block text-muted text-nowrap" style="font-size: 11px;">${details.email ?? ""}</small>
                            `;

                            document.getElementById(
                                "_rdv_tenant_cell",
                            ).innerHTML = tenantInfo;

                            const headerBadge = document.getElementById(
                                "_rdv_unit_header_badge",
                            );
                            if (headerBadge) {
                                headerBadge.textContent = details.space_code
                                    ? `Unit: ${details.space_code}`
                                    : "Unit Details";
                            }

                            depositEl.textContent = VSMoney.formatAmount(
                                refund.deposit_amount,
                                currency,
                            );
                            deductEl.textContent = VSMoney.formatAmount(
                                refund.deduct_amount,
                                currency,
                            );
                            refundEl.textContent = VSMoney.formatAmount(
                                refund.refund_amount,
                                currency,
                            );
                            remarksEl.textContent = refund.remarks || "_";

                            const statusKey = String(
                                refund.status,
                            ).toLowerCase();
                            let dateHtml = `<small class="text-muted d-block" style="font-size: 11px;">Refunded on: ${refund.created_at ?? ""}</small>`;
                            if (
                                statusKey === "refunded" ||
                                statusKey === "completed"
                            ) {
                                dateHtml += `<small class="text-success d-block mt-1" style="font-size: 11px;">Refunded on: ${refund.updated_at ?? ""}</small>`;
                            } else if (statusKey === "rejected") {
                                dateHtml += `<small class="text-danger d-block mt-1" style="font-size: 11px;">Rejected on: ${refund.updated_at ?? ""}</small>`;
                            }
                            dateEl.innerHTML = dateHtml;
                        })
                        .catch(() => {
                            loader.classList.add("d-none");
                            content.classList.remove("d-none");
                            content.innerHTML = `<div class="alert alert-danger mb-0">Failed to load refund details.</div>`;
                        });
                },
            });
        };

        return self;
    })();
