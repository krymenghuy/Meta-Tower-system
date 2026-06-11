"use strict";

var ContractsComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.btnPDF = mThis.self.querySelector('#_asusp_btn_pdf');
    // mThis.elTenant = mThis.self.querySelector('#tenant_id');
    mThis.elBusinessType = mThis.self.querySelector('#business_type_id');
    // mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elStatus = mThis.self.querySelector("#el_contract_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");


    mThis.contractItemsMap = {};

    mThis.escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const div = document.createElement("div");
        div.textContent = String(str);
        return div.innerHTML;
    };

    mThis.getStatusMeta = (data) => {
        const statusId = parseInt(data.status_id, 10);
        const statusKey = (data.status ?? "").toLowerCase();
        const map = {
            1: {
                text: "Pending",
                cls: "contract-card__status contract-card__status--pending",
            },
            2: {
                text: "Active",
                cls: "contract-card__status contract-card__status--active",
            },
            3: {
                text: "Expired",
                cls: "contract-card__status contract-card__status--expired",
            },
            4: {
                text: "Terminated",
                cls: "contract-card__status contract-card__status--terminated",
            },
        };
        const m = map[statusId] || null;
        const label =
            m?.text ||
            (statusKey === "terminated" ? "Terminated" : data.status ?? "—");
        const cls = m?.cls || "contract-card__status";
        const showDot = statusId === 2 || statusKey === "active";
        return { label, cls, showDot };
    };

    mThis.formatPriceBlock = (data) => {
        const price = VSMoney.formatAmount(
            data.price,
            data.currency_code ?? "USD",
        );
        if (data.price_type === "total") {
            return `<span class="contract-card__price-value">${price}<small>/mon</small></span><span class="contract-card__price-sub">Whole Room</span>`;
        }
        return `<span class="contract-card__price-value">${price}<small>/m²</small></span><span class="contract-card__price-sub">${mThis.escapeHtml(data.sqm_size ?? "-")} m²</span>`;
    };

    mThis.renderContractCards = (container, items) => {
        items = items ?? [];
        mThis.contractItemsMap = {};
        container.innerHTML = "";

        if (!items.length) {
            container.innerHTML = `
                <div class="contract-card-empty text-center py-5 px-3">
                    <span class="contract-card-empty__icon d-inline-flex align-items-center justify-content-center mb-3">
                        <i class="fa-regular fa-file-lines"></i>
                    </span>
                    <p class="mb-1 fw-semibold text-prm-custom">No contracts found</p>
                    <small class="text-muted">Try adjusting your search or filters.</small>
                </div>`;
            return;
        }

        let html = '<div class="row g-3 contract-card-grid">';
        items.forEach((data) => {
            mThis.contractItemsMap[data.id] = data;
            const status = mThis.getStatusMeta(data);
            const deposit = VSMoney.formatAmount(
                data.deposit,
                data.currency_code ?? "USD",
            );
            const unitCode = mThis.escapeHtml(data.space_code ?? "—");
            const remarks = mThis.escapeHtml(data.remarks ?? "—");
            const statusDot = status.showDot
                ? '<span class="contract-card__status-dot"></span>'
                : "";

            html += `
            <div class="col-12 col-sm-6 col-lg-3">
                <div class="contract-card h-100" data-contract-id="${data.id}">
                    <div class="contract-card__header">
                        <div class="contract-card__header-main">
                            <span class="contract-card__title">Lease Application: (Unit <span class="contract-card__unit-pill">${unitCode}</span>)</span>
                            <span class="${status.cls}">${statusDot}${mThis.escapeHtml(status.label)}</span>
                        </div>
                        <div class="contract-card__menu-wrap">
                            <a href="javascript:void(0)" class="btn_contract_action contract-card__menu-btn"
                                data-id="${data.id}"
                                data-statusid="${data.status_id ?? ""}"
                                data-status="${mThis.escapeHtml(data.status ?? "")}"
                                data-end-date="${mThis.escapeHtml(data.end_date ?? "")}"
                                aria-haspopup="true" aria-expanded="false"
                                title="More options">
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </a>
                        </div>
                    </div>
                    <div class="contract-card__body">
                        <div class="contract-card__meta">
                            <div class="contract-card__meta-item">
                                <span class="contract-card__label">Business Type</span>
                                <span class="contract-card__business">${mThis.escapeHtml(data.business_type ?? "—")}</span>
                            </div>
                            <div class="contract-card__meta-item contract-card__meta-item--end">
                                <span class="contract-card__label">Type</span>
                                <span class="contract-card__type">${mThis.escapeHtml(data.space_type ?? "—")}</span>
                            </div>
                        </div>
                        <div class="contract-card__dates">
                            <div class="contract-card__date-box">
                                <i class="fa-regular fa-calendar contract-card__date-icon"></i>
                                <div>
                                    <span class="contract-card__label">Start</span>
                                    <span class="contract-card__date-value">${mThis.escapeHtml(data.start_date ?? "—")}</span>
                                </div>
                            </div>
                            <div class="contract-card__date-box">
                                <i class="fa-regular fa-calendar contract-card__date-icon"></i>
                                <div>
                                    <span class="contract-card__label">End</span>
                                    <span class="contract-card__date-value">${mThis.escapeHtml(data.end_date ?? "—")}</span>
                                </div>
                            </div>
                        </div>
                        <div class="contract-card__finance">
                            <div class="contract-card__finance-item">
                                <span class="contract-card__label">Price</span>
                                ${mThis.formatPriceBlock(data)}
                            </div>
                            <div class="contract-card__finance-item contract-card__finance-item--end">
                                <span class="contract-card__label">Deposit</span>
                                <span class="contract-card__deposit">${deposit}</span>
                            </div>
                        </div>
                        <div class="contract-card__comment">
                            <i class="fa-regular fa-comment-dots contract-card__comment-icon"></i>
                            <span class="contract-card__comment-text"><strong>Comment:</strong> ${remarks}</span>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        html += "</div>";
        container.innerHTML = html;
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView('_contract_list', {
            fetchApi: `${main_view.base_url}/prm/tenant/contract/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            renderItems: (items, container) => {
                mThis.renderContractCards(container, items);
            },
            listContainerClass: null
        });

        mThis.pr_tbl = mThis.ContractListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.initDropdownMenus(mThis.pr_tbl);

        // Filter change handler with tooltip reinitialization
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after filter
                setTimeout(() => {
                    // $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }
        });

        // Search handler with tooltip reinitialization
        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after search
                setTimeout(() => {
                    // $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: (mThis.elSearch.value || "").trim(),
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
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
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };

        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            const [year, month, day] = raw.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) {
            const [dayStr, monthStr, yearStr] = raw.split('-');
            const month = monthMap[monthStr.toLowerCase()];
            if (month === undefined) return null;
            return new Date(Number(yearStr), month, Number(dayStr));
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const [day, month, year] = raw.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return null;
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    };

    mThis.isWithinNextThreeMonths = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);

        return date >= today && date <= maxDate;
    };

    mThis.loadRenewalHistory = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        vsapi
            .call(
                `${main_view.base_url}/prm/contract/list-renewals`,
                { contract_id: id, per_page: 50 },
                null,
                null,
            )
            .then((renewalsRes) => {
                const renewals =
                    renewalsRes.status_code === 200 &&
                    renewalsRes.data &&
                    renewalsRes.data.data
                        ? renewalsRes.data.data
                        : [];
                mThis.renderRenewalHistory(container, renewals);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading renewal history</div>`;
            });
    };

    mThis.renderRenewalHistory = (container, renewals) => {
        // const cur = (d.cur_symbol != null) ? d.cur_symbol : '$';
        // const priceLabel = (d.price_type === 'total') ? 'Whole Room' : 'Per sqm';
        // const priceVal = d.price != null ? Number(d.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'â€”';
        // const depositVal = (d.deposit != null && d.deposit !== '') ? Number(d.deposit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'â€”';

        const renewalsList = Array.isArray(renewals) ? renewals : [];
        const escapeHtml = (str) => {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };
        let renewalTableHtml = '';
        if (renewalsList.length > 0) {
            const unitPillClass = 'px-2 py-1 bg-prm-custom text-white rounded font-medium ';
            const rows = renewalsList.map((r) => {
                const spaceCode = (r.space_code ?? '').trim();
                const unitCell = `<span class="${unitPillClass}">${escapeHtml(spaceCode)}</span>`;
                return `
                <tr>
                    <td class="align-middle text-nowrap">${(r.renewal_date ?? '').trim() }</td>
                    <td class="align-middle text-nowrap">${(r.start_date ?? '').trim() }</td>
                    <td class="align-middle text-nowrap">${(r.end_date ?? '').trim() }</td>
                    <td class="align-middle text-nowrap">${unitCell}</td>
                    <td class="text-break align-middle" style="width: 300px;">${escapeHtml((r.remarks ?? '_').trim())}</td>
                </tr>`;
            }).join('');
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

    mThis.buildContractDetailHtml = (data) => {
        if (!data) {
            return `<div class="alert alert-warning m-0">Contract not found.</div>`;
        }
        const status = mThis.getStatusMeta(data);
        const deposit = VSMoney.formatAmount(
            data.deposit,
            data.currency_code ?? "USD",
        );
        const price = VSMoney.formatAmount(
            data.price,
            data.currency_code ?? "USD",
        );
        const statusDot = status.showDot
            ? '<span class="contract-card__status-dot"></span>'
            : "";
        const priceLine =
            data.price_type === "total"
                ? `${price}<small>/mon</small>`
                : `${price}<small>/m²</small>`;
        const priceSub =
            data.price_type === "total"
                ? "Whole Room"
                : `${mThis.escapeHtml(data.sqm_size ?? "—")} m²`;

        return `
            <div class="contract-detail">
                <div class="contract-detail__hero">
                    <div class="contract-detail__hero-main">
                        <span class="contract-detail__hero-kicker">Lease Application</span>
                        <span class="contract-detail__hero-unit">Unit <span class="contract-card__unit-pill">${mThis.escapeHtml(data.space_code ?? "—")}</span></span>
                    </div>
                    <span class="${status.cls}">${statusDot}${mThis.escapeHtml(status.label)}</span>
                </div>
                <div class="contract-detail__grid">
                    <div class="contract-detail__cell">
                        <span class="contract-detail__label">Business Type</span>
                        <span class="contract-detail__value contract-detail__value--accent">${mThis.escapeHtml(data.business_type ?? "—")}</span>
                    </div>
                    <div class="contract-detail__cell contract-detail__cell--end">
                        <span class="contract-detail__label">Space Type</span>
                        <span class="contract-detail__value">${mThis.escapeHtml(data.space_type ?? "—")}</span>
                    </div>
                    <div class="contract-detail__cell">
                        <span class="contract-detail__label">Start Date</span>
                        <span class="contract-detail__value"><i class="fa-regular fa-calendar me-1 text-muted"></i>${mThis.escapeHtml(data.start_date ?? "—")}</span>
                    </div>
                    <div class="contract-detail__cell contract-detail__cell--end">
                        <span class="contract-detail__label">End Date</span>
                        <span class="contract-detail__value"><i class="fa-regular fa-calendar me-1 text-muted"></i>${mThis.escapeHtml(data.end_date ?? "—")}</span>
                    </div>
                    <div class="contract-detail__cell">
                        <span class="contract-detail__label">Price</span>
                        <span class="contract-detail__value contract-detail__value--price">${priceLine}</span>
                        <span class="contract-detail__sub">${priceSub}</span>
                    </div>
                    <div class="contract-detail__cell contract-detail__cell--end">
                        <span class="contract-detail__label">Deposit</span>
                        <span class="contract-detail__value contract-detail__value--price">${deposit}</span>
                    </div>
                </div>
                <div class="contract-detail__comment">
                    <i class="fa-regular fa-comment-dots"></i>
                    <span><strong>Comment:</strong> ${mThis.escapeHtml(data.remarks ?? "—")}</span>
                </div>
            </div>`;
    };

    mThis.showContractDetailDialog = (id) => {
        const data = mThis.contractItemsMap[id];
        const unitCode = data?.space_code ?? "—";
        ContractViewDialog.show({
            title: `Unit ${unitCode} — Contract Detail`,
            contentHtml: mThis.buildContractDetailHtml(data),
            dialogClass: "contract-detail-modal",
        });
    };

    mThis.showRenewRecordDialog = (id) => {
        const data = mThis.contractItemsMap[id];
        const unitCode = data?.space_code ?? "—";
        ContractViewDialog.show({
            title: `Unit ${unitCode} — Renew Record`,
            contentHtml: `<div id="_contract_renewal_panel" class="contract-renewal-panel"></div>`,
            dialogClass: "contract-detail-modal",
            onReady: (panel) => {
                mThis.loadRenewalHistory(panel, id);
            },
        });
    };

    mThis.initDropdownMenus = (listContainer) => {
        const menuOptopns = {
            containerElement: listContainer,
            actionButtonClass: "btn_contract_action",
            cssClass: "contract-card__dropdown shadow-sm",
            adjustPosition: {
                top: 2,
            },
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.View Detail"></span>',
                    icon: `<i class="fa-regular fa-eye fs-6 text-prm-custom"></i>`,
                    cssClass: "contract-card__dropdown-item",
                    name: "view_detail",
                },
                {
                    html: '<span class="ps-2" vslang="titles.View Renew Record"></span>',
                    icon: `<i class="fa-solid fa-clock-rotate-left fs-6 text-prm-custom"></i>`,
                    cssClass: "contract-card__dropdown-item",
                    name: "view_renew_record",
                },
            ],
            onClick: (menuLink, id, name) => {
                if (name === "view_detail") {
                    mThis.showContractDetailDialog(id);
                } else if (name === "view_renew_record") {
                    mThis.showRenewRecordDialog(id);
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editContract = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };
        ContractDialog.show(op);
    }
    mThis.renewContract = (id, menulink) => {
        if (!id) return;

        let op = {
            id: id,
            contract_id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };

        RenewDialog.show(op);
    };

    mThis.terminateContract = (id, menuLink) => {
        if (!id) return;

        const op = {
            id: id,
            btn: menuLink,
        };

        cv_interact.confirm(
            "Terminate this contract?",
            {
                title: "Terminate Contract",
                context: "delete",
                confirmButtonText: "Terminate",
            },
            (yes) => {
                if (!yes) return;
                vsapi
                    .call(
                        [main_view.base_url, "/prm/contract/terminate"].join(""),
                        op,
                        menuLink,
                        null,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Contract has been terminated.");
                            if (mThis.ContractListView) {
                                mThis.ContractListView.showPage(mThis.getFilterData());
                            }
                        } else {
                            cv_interact.error(res.error_message || "Failed to terminate contract.");
                        }
                    });
            },
        );
    };
    mThis.deleteContract = (id, menuLink) => {
        if (!id) return;

        cv_interact.confirm(
            "Delete this contract?",
            {
                title: "Delete Contract",
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
                            cv_interact.success("Contract has been deleted.");
                            if (mThis.ContractListView) {
                                mThis.ContractListView.showPage(mThis.getFilterData());
                            }
                        } else {
                            cv_interact.error(res.error_message || "Failed to delete contract.");
                        }
                    });
            },
        );
    };


    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/contract/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenants', null);
                VSUtil.setComboItems(mThis.elStatus, d.statuses, 'id', 'status_name', '', 'All Statuses','');
                VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'id', 'business_type', '', 'All Business Types', '');

                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ContractListView.showPage(mThis.getFilterData());

            // Initialize tooltips after table loads
            setTimeout(() => {
                $('[data-bs-toggle="tooltip"]').tooltip();
                // console.log('Tooltips initialized');
            }, 800);

            // Auto-refresh every hour to update contract statuses
            if (!mThis.autoRefreshInterval) {
                mThis.autoRefreshInterval = setInterval(() => {
                    console.log('Auto-refreshing contracts...');
                    mThis.ContractListView.showPage(mThis.getFilterData());

                    // Re-initialize tooltips after refresh
                    setTimeout(() => {
                        $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }, 800);
                }, 3600000); // 1 hour = 3600000ms
            }
        });
    };

    return mThis;
})();

const ContractViewDialog = (() => {
    const self = {};

    self.show = (op) => {
        const dialogClass = op.dialogClass || "contract-detail-modal";
        const dialog = new GeneralDialog({
            title: op.title || "Contract Detail",
            cssClass: `modal-md vs-modal vs-modal--compact ${dialogClass}`,
            backdrop: "static",
            keyboard: true,
            createContent: () => op.contentHtml || "",
            contentCreated: (me) => {
                if (typeof op.onReady === "function") {
                    const panel = me.divModal.querySelector(
                        "#_contract_renewal_panel",
                    );
                    op.onReady(panel);
                }
            },
            buttons: [
                {
                    label: "<span>Close</span>",
                    cssClass: "btn btn-contract-detail-close",
                    click: (me) => me.hide(false),
                },
            ],
        });
        dialog.show(op);
    };

    return self;
})();

const ContractDialog = (() => {
    const self = {};
    let dialog = null;
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
        dialog = dialog || new GeneralDialog({
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
                                <label>Tenant</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input name="legal_name" class="data-input form-control" disabled data-field="legal_name" placeholder=" " />
                                <label>Legal Name</label>
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
                                <label>Deposit</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                <label>Start Date</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" placeholder=" " />
                                <label>End Date</label>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 bg-white border rounded shadow-sm">
                        <h6 class="mb-3 text-golden">Unit Details</h6>
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" disabled />
                                    <label>Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" disabled />
                                    <label>Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="hidden" name="price_type" class="data-input" data-field="price_type" />
                                    <input type="text" name="price_type_label" class="data-input form-control" disabled />
                                    <label>Charge As</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" disabled />
                                    <label>Price</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div class="col-12 mt-3">
                        <div class="vs-material-field">
                            <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                            <label>Remark</label>
                        </div>
                    </div>
                </div>`
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
                        searchFields: { name: "LIKE", code: "=", legal_name: "LIKE" },
                        orderBy: [["id", "desc"]]
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
                        me.controls.legal_name.value = item?.legal_name || "";
                    }
                });
                applyNumberInput(me.controls.deposit);

                // me.controls.deposit.addEventListener('input', (e) => {
                //     let v = e.target.value;
                //     v = v.replace(/[^0-9.]/g, '');

                //     const parts = v.split('.');
                //     if (parts.length > 2) {
                //         v = parts[0] + '.' + parts[1];
                //     }
                //     if (parts[1] !== undefined) {
                //         v = parts[0] + '.' + parts[1].slice(0, 2);
                //     }

                //     e.target.value = v;
                // });
                // me.controls.deposit.addEventListener('blur', (e) => {
                //     let v = parseFloat(e.target.value);

                //     if (isNaN(v) || v <= 0) {
                //         e.target.value = '';
                //         return;
                //     }
                //     e.target.value = v;
                // });
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
                createTitle: "Create Contract",
                modifyTitle: "Modify Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options",].join(""),
                    params: (op) => {
                        return {
                            id: op.id,
                            space_id: op.space_id ?? null,
                            tenant_id: op.tenant_id ?? null
                        };
                    },
                },
            },

            onPrepareForm: (me, data) => {
                const isReadOnly = me.dataOptions.id > 0 || data.prefill_tenant_id;
                console.log(123,me.dataOptions.id);
                me.controls.tenant.disabled = isReadOnly;
                if(me.dataOptions.id){
                    me.setReadOnly(true, ['code','start_date','end_date']);
                }

                // me.setReadOnly(true, ['code','start_date','end_date']);

                if (me.searchTenant && typeof me.searchTenant.reset === "function") {
                    me.searchTenant.reset();
                }
                // Preselect tenant when coming from TenantComponent or from booked unit phone-match.
                const prefillTenantId = !me.dataOptions.id
                    ? (me.dataOptions.tenant_id ?? data?.prefill_tenant_id ?? null)
                    : null;
                if (prefillTenantId) {
                    me.tenant_id = prefillTenantId;
                    vsapi
                        .call(
                            [main_view.base_url, "/prm/tenant/details"].join(""),
                            { id: prefillTenantId },
                            false,
                            null,
                        )
                        .then((res) => {
                            if (res.status_code === 200 && res.data) {
                                const t = res.data;
                                const tenantInput =
                                    me.divModal.querySelector('input[name="tenant"]');
                                if (tenantInput) {
                                    const tenantCode = t.code || "";
                                    tenantInput.value = tenantCode
                                        ? `${t.name || ""} (${tenantCode})`
                                        : (t.name || "");
                                    tenantInput.dataset.tenantId = prefillTenantId;
                                }
                                if (me.controls.legal_name) {
                                    me.controls.legal_name.value = t.legal_name || "";
                                }
                            }
                        })
                        .catch(() => {});
                } else {
                    me.tenant_id = data?.contract_details?.tenant_id ?? null;
                }
                const unitSelect = me.divModal.querySelector('[data-field="space_id"]');
                const spaceRows = Array.isArray(data?.building_spaces) ? data.building_spaces : [];

                const spaceTypes = Array.isArray(data?.space_types) ? data.space_types : [];
                const getSpaceTypeName = (spaceTypeId) => {
                    const row = spaceTypes.find((x) => String(x.id) === String(spaceTypeId));
                    return row?.space_type ?? '';
                };
                const applyUnitData = (spaceId) => {
                    const selected = spaceRows.find((row) => String(row.id) === String(spaceId));
                    if (!selected) {
                        me._createContractSpaceTypeId = null;
                        return;
                    }
                    me._createContractSpaceTypeId = selected.space_type_id ?? null;
                    if (me.controls.space_name) {
                        me.controls.space_name.value = selected.space_type ?? getSpaceTypeName(selected.space_type_id) ?? '';
                    }
                    if (me.controls.sqm_size) me.controls.sqm_size.value = selected.sqm_size ?? '';
                    if (me.controls.price_type && me.controls.price_type_label) {
                        me.controls.price_type.value = selected.price_type ?? '';

                        me.controls.price_type_label.value = selected.price_type === 'sqm' ? 'm²' : selected.price_type === 'total' ? 'Unit' : '';
                    }
                    if (me.controls.price) me.controls.price.value = selected.price ?? '';
                };

                if (unitSelect) {
                    unitSelect.onchange = (e) => {
                        applyUnitData(e.target.value);
                    };
                    const prefillSpaces = Array.isArray(data?.prefill_spaces) ? data.prefill_spaces : [];
                    const prefillSpaceIds = prefillSpaces
                        .map((s) => String(s?.id ?? "").trim())
                        .filter((v) => v !== "");
                    const defaultSpaceId = me.dataOptions?.space_id
                        ?? data?.contract_details?.space_id
                        ?? prefillSpaceIds[0]
                        ?? '';
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
                        // if (!me.tenant_id) {
                        //     cv_interact.error("Please select a tenant.");
                        //     return;
                        // }
                        // if (!op.business_type_id) {
                        //     cv_interact.error("Please select a business type.");
                        //     return;
                        // }
                        if (me._createContractSpaceTypeId !== undefined && me._createContractSpaceTypeId !== null) {
                            op.space_type_id = me._createContractSpaceTypeId;
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

                        vsapi.call([main_view.base_url, "/prm/contract/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Contract has been updated successfully.");
                                } else {
                                    cv_interact.success("New contract has been created successfully.");
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
            jan: 0,feb: 1,mar: 2,apr: 3,may: 4, jun: 5,jul: 6,aug: 7,sep: 8,oct: 9, nov: 10,dec: 11,
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
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
           createContent: () => {
                return `
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="p-3 border rounded">
                                <h6 class="mb-3 text-golden">Old Contract</h6>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="old_contract_start" class="data-input form-control" data-field="old_contract_start"  placeholder=" " disabled />
                                            <label>Start Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="old_contract_end" class="data-input form-control" data-field="old_contract_end" placeholder=" " disabled />
                                            <label>End Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="number" name="old_contract_price" class="data-input form-control" data-field="old_contract_price" placeholder=" " disabled />
                                            <label>Price</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <h6 class="mb-3 text-golden">Renew Contract</h6>
                                <div class="row g-3">
                                    <div class="col-4">
                                       <div class="vs-material-field">
                                           <input  data-style="material" type="date" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" " disabled />
                                             <label>Start Date</label>
                                       </div>
                                   </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="end_date" class="data-input form-control" data-field="end_date" placeholder=" " />
                                            <label>End Date</label>
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
                                            <label>Renewal Remark</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-lg">
                                <h6 class="mb-3 text-golden">Unit Details</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" placeholder=" " readonly disabled />
                                    <label>Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " readonly disabled />
                                    <label>Size</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price_type" class="data-input form-control" data-field="price_type" placeholder=" " readonly disabled />
                                    <label>Charge As</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " readonly disabled />
                                    <label>Price</label>
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
                createTitle: "Renew Contract",
                modifyTitle: "Renew Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options"].join(""),
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
                    me.controls.old_contract_start.value = det.start_date || "";
                }
                if (me.controls.old_contract_end) {
                    me.controls.old_contract_end.value = det.end_date || "";
                }
                if (me.controls.old_contract_price) {
                    me.controls.old_contract_price.value =
                        det.price != null && det.price !== "" ? det.price : "";
                }
                // Renew period starts the same calendar day as the current contract end_date.
                const renewStartIso = det.renew_start_date || "";

                if (me.controls.start_date) {
                    me.controls.start_date.value = renewStartIso;
                }
                if (me.controls.end_date) me.controls.end_date.value = "";
                if (me.controls.price) {
                    me.controls.price.value =
                        det.price != null && det.price !== "" ? det.price : "";
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
                const unitSelect = me.divModal.querySelector('[data-field="space_id"]');
                const spaceRows = Array.isArray(data?.building_spaces) ? data.building_spaces : [];
                const spaceTypes = Array.isArray(data?.space_types) ? data.space_types : [];
                const getSpaceTypeName = (spaceTypeId) => {
                    const row = spaceTypes.find((x) => String(x.id) === String(spaceTypeId));
                    return row?.space_type ?? '';
                };
                const applyContractPriceFields = () => {
                    if (me.controls.price_type) {
                        me.controls.price_type.value = det.price_type ?? "";
                    }
                    if (me.controls.price) {
                        me.controls.price.value =
                            det.price != null && det.price !== "" ? det.price : "";
                    }
                };
                const setUnitFields = (unitData) => {
                    if (!unitData) return;
                    if (me.controls.space_name) {
                        me.controls.space_name.value = unitData.space_type ?? getSpaceTypeName(unitData.space_type_id);
                    }
                    if (me.controls.sqm_size) me.controls.sqm_size.value = unitData.sqm_size ?? '';
                    // if (me.controls.price_type) me.controls.price_type.value = unitData.price_type ?? '';
                    if (me.controls.price_type) {
                        me.controls.price_type.value = unitData.price_type ?? '';
                        me.controls.price_type.value = unitData.price_type === 'sqm' ? 'm²' : unitData.price_type === 'total' ? 'Unit' : '';
                    }
                    if (me.controls.price) me.controls.price.value = unitData.price ?? '';
                    applyContractPriceFields();
                };
                const applyUnitData = (spaceId) => {
                    if (!spaceId) return;
                    const selected = spaceRows.find((row) => String(row.id) === String(spaceId));
                    if (selected) {
                        setUnitFields(selected);
                    }

                    // Refresh selected unit data from API when unit code changes.
                    vsapi.call(`${main_view.base_url}/prm/building-space/details`, { id: spaceId }, null, null)
                        .then((res) => {
                            if (res.status_code !== 200 || !res.data) return;
                            const merged = selected ? { ...selected, ...res.data } : res.data;
                            setUnitFields(merged);
                        })
                        .catch(() => {});
                };

                if (unitSelect) {
                    unitSelect.onchange = (e) => {
                        applyUnitData(e.target.value);
                    };

                    const defaultSpaceId = data?.contract_details?.space_id ?? '';
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
                    label: '<span>Cancel</span>',
                    cssClass: 'btn btn-secondary',
                    click: (me) => me.hide(false),
                },
                {
                    label: '<span>Renew</span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const op = me.getData();
                        const renewStart = op.start_date ? new Date(op.start_date) : null;
                        const renewEnd = op.end_date ? new Date(op.end_date) : null;
                        if (!renewEnd || Number.isNaN(renewEnd.getTime())) {
                            cv_interact.error("Please select a valid Renew End Date.");
                            return;
                        }
                        if (renewStart && !Number.isNaN(renewStart.getTime()) && renewEnd <= renewStart) {
                            cv_interact.error("Renew End Date must be after Renew Start Date.");
                            return;
                        }
                        delete op.old_contract_start;
                        delete op.old_contract_end;
                        delete op.old_contract_price;
                        delete op.price;
                        delete op.price_type;
                        op.id = me.dataOptions.id;
                        vsapi.call([main_view.base_url, "/prm/contract/renew"].join(""), op, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success("Contract has been renewed successfully");
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
