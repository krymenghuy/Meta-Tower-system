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
            fetchApi: `${main_view.base_url}/tenant/contract/list-paginate`,
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
                            <p class="text-muted mb-0" vslang="titles.No_renewal_history"></p>
                            <small class="text-muted" vslang="titles.Renewals_will_appear"></small>
                        </div>
                    </div>`;
        }

        container.innerHTML = renewalTableHtml;
        LocaleManager.translateZone(container);
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
                        [main_view.base_url, "/tenant/contract/terminate"].join(""),
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
                        [main_view.base_url, "/tenant/contract/delete"].join(""),
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
        vsapi.call(`${main_view.base_url}/tenant/contract/form-options`, null, null, null)
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
                    // console.log('Auto-refreshing contracts...');
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


