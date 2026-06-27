"use strict";

var Contracts2Component = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract 2";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract2_component");
    mThis.elBusinessType = mThis.self.querySelector("#business_type2_id");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract2");
    mThis.elStatus = mThis.self.querySelector("#el_contract2_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_contract2");
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
            1: { text: "Pending", cls: "contract2-status contract2-status--pending" },
            2: { text: "Active", cls: "contract2-status contract2-status--active" },
            3: { text: "Expired", cls: "contract2-status contract2-status--expired" },
            4: { text: "Terminated", cls: "contract2-status contract2-status--terminated" },
        };
        const m = map[statusId] || null;
        const label =
            m?.text ||
            (statusKey === "terminated" ? "Terminated" : data.status ?? "—");
        const cls = m?.cls || "contract2-status";
        return { label, cls };
    };

    mThis.formatContractCode = (id) => {
        const num = parseInt(id, 10);
        if (!num) return "—";
        return `C-${String(num).padStart(5, "0")}`;
    };

    mThis.formatPriceInline = (data) => {
        const price = VSMoney.formatAmount(
            data.price,
            data.currency_code ?? "USD",
        );
        const suffix = data.price_type === "total" ? "/mon" : "/m²";
        return `${price}<small>${suffix}</small>`;
    };

    mThis.formatDeposit = (data) => {
        return VSMoney.formatAmount(
            data.deposit,
            data.currency_code ?? "USD",
        );
    };

    mThis.formatPriceDetail = (data) => {
        const price = VSMoney.formatAmount(
            data.price,
            data.currency_code ?? "USD",
        );
        const suffix = data.price_type === "total" ? "/mon" : "/m²";
        return `${price}&nbsp;<small>${suffix}</small>`;
    };

    mThis.formatAreaDetail = (sqm) => {
        if (sqm == null || sqm === "") return null;
        const n = parseFloat(sqm);
        if (Number.isNaN(n)) return String(sqm);
        return `${n.toFixed(2)} m²`;
    };

    mThis.emptyValueHtml = (text = "N/A") => {
        return `<span class="contract2-detail__field-value contract2-detail__field-value--empty">${mThis.escapeHtml(text)}</span>`;
    };

    mThis.valueHtml = (val, emptyText = "N/A") => {
        if (val == null || String(val).trim() === "" || val === "—") {
            return mThis.emptyValueHtml(emptyText);
        }
        return `<span class="contract2-detail__field-value">${mThis.escapeHtml(String(val))}</span>`;
    };

    mThis.renderDetailField = (label, valueHtml) => {
        return `
            <div class="contract2-detail__field">
                <span class="contract2-detail__field-label">${label}</span>
                ${valueHtml}
            </div>`;
    };

    mThis.formatDateRange = (start, end) => {
        const s = (start ?? "").trim() || "—";
        const e = (end ?? "").trim() || "—";
        return `${s} – ${e}`;
    };

    mThis.parseDisplayDate = (dateStr) => {
        if (dateStr == null || String(dateStr).trim() === "") return null;
        const parts = String(dateStr)
            .trim()
            .replace(/-/g, " ")
            .split(/\s+/);
        if (parts.length < 3) return null;
        const day = parts[0];
        const monthRaw = parts[1];
        const month =
            monthRaw.length > 3
                ? monthRaw.charAt(0).toUpperCase() +
                  monthRaw.slice(1, 3).toLowerCase()
                : monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1).toLowerCase();
        const year = parts[2];
        return { day, month, year };
    };

    mThis.formatRenewalActionDate = (dateStr) => {
        const parsed = mThis.parseDisplayDate(dateStr);
        if (!parsed) return "—";
        return `${parsed.day} ${parsed.month} ${parsed.year}`;
    };

    mThis.formatTermRangeCompact = (start, end) => {
        const startParsed = mThis.parseDisplayDate(start);
        const endParsed = mThis.parseDisplayDate(end);
        if (!startParsed || !endParsed) {
            return mThis.formatDateRange(start, end);
        }
        const shortYear =
            endParsed.year.length > 2
                ? endParsed.year.slice(-2)
                : endParsed.year;
        return `${startParsed.day} ${startParsed.month} – ${endParsed.day} ${endParsed.month} ${shortYear}`;
    };

    mThis.formatPriceRenewal = (data) => {
        const price = VSMoney.formatAmount(
            data.price,
            data.currency_code ?? "USD",
        );
        const suffix = data.price_type === "total" ? "/mon" : "/m²";
        return `${price}${suffix}`;
    };

    mThis.formatDepositRenewal = (data) => {
        return VSMoney.formatAmount(data.deposit, data.currency_code ?? "USD");
    };

    mThis.renderContractRows = (container, items) => {
        items = items ?? [];
        mThis.contractItemsMap = {};
        container.innerHTML = "";

        if (!items.length) {
            container.innerHTML = `
                <div class="contract2-list-empty text-center py-5 px-3">
                    <span class="d-inline-flex align-items-center justify-content-center mb-3 rounded-3 bg-light text-primary"
                        style="width:44px;height:44px;border:1px solid #e5e7eb;">
                        <i class="fa-regular fa-file-lines"></i>
                    </span>
                    <p class="mb-1 fw-semibold text-prm-custom">No contracts found</p>
                    <small class="text-muted">Try adjusting your search or filters.</small>
                </div>`;
            return;
        }

        let html = '<div class="contract2-list">';
        items.forEach((data) => {
            mThis.contractItemsMap[data.id] = data;
            const status = mThis.getStatusMeta(data);
            const unitLabel = mThis.escapeHtml(data.space_code ?? "Unit");
            const subtitle = `${mThis.escapeHtml(data.business_type ?? "—")} · ${mThis.escapeHtml(
                mThis.formatDateRange(data.start_date, data.end_date),
            )}`;

            html += `
            <div class="contract2-row" data-contract-id="${data.id}">
                <span class="contract2-row__icon">
                    <i class="fa-solid fa-building-columns"></i>
                </span>
                <div class="contract2-row__main">
                    <div class="contract2-row__title-row">
                        <span class="contract2-row__title">${unitLabel}</span>
                        <span class="${status.cls}">${mThis.escapeHtml(status.label)}</span>
                    </div>
                    <div class="contract2-row__subtitle">${subtitle}</div>
                </div>
                <div class="contract2-row__price">
                    <span class="contract2-row__price-value">${mThis.formatPriceInline(data)}</span>
                </div>
                <div class="contract2-row__menu-wrap">
                    <a href="javascript:void(0)" class="btn_contract2_action contract2-row__menu-btn"
                        data-id="${data.id}"
                        data-statusid="${data.status_id ?? ""}"
                        aria-haspopup="true" aria-expanded="false"
                        title="More options">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </a>
                </div>
            </div>`;
        });
        html += "</div>";
        container.innerHTML = html;
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.Contract2ListView = new ListView("_contract2_list", {
            fetchApi: `${main_view.base_url}/tenant/contract/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            renderItems: (items, container) => {
                mThis.renderContractRows(container, items);
            },
            listContainerClass: null,
        });

        mThis.pr_tbl = mThis.Contract2ListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.Contract2ListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.Contract2ListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        const p = {
            search_value: (mThis.elSearch.value || "").trim(),
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });
        return p;
    };

    mThis.buildDetailHtml = (data) => {
        const status = mThis.getStatusMeta(data);
        const unitLabel = mThis.escapeHtml(data.space_code ?? "Unit");
        const area = mThis.formatAreaDetail(data.sqm_size);
        const areaHtml = area
            ? `<span class="contract2-detail__field-value">${mThis.escapeHtml(area)}</span>`
            : mThis.emptyValueHtml("N/A");
        const priceHtml = `<span class="contract2-detail__field-value">${mThis.formatPriceDetail(data)}</span>`;
        const depositHtml = `<span class="contract2-detail__field-value">${mThis.formatDeposit(data)}</span>`;
        const remarkHtml = mThis.valueHtml(data.remarks, "No remarks");

        return `
            <div class="contract2-detail" id="_contract2_detail_root">
                <button type="button" class="contract2-detail__close-btn" aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <aside class="contract2-detail__sidebar">
                    <div class="contract2-detail__profile">
                        <div class="contract2-detail__avatar">
                            <i class="fa-solid fa-building-columns"></i>
                        </div>
                        <div class="contract2-detail__unit">${unitLabel}</div>
                        <div class="contract2-detail__status-wrap">
                            <span class="${status.cls}">${mThis.escapeHtml(status.label)}</span>
                        </div>
                    </div>
                    <div class="contract2-detail__mini-grid">
                        <div class="contract2-detail__mini-box">
                            <span class="contract2-detail__mini-label">Contract id</span>
                            <span class="contract2-detail__mini-value">${mThis.escapeHtml(mThis.formatContractCode(data.id))}</span>
                        </div>
                        <div class="contract2-detail__mini-box">
                            <span class="contract2-detail__mini-label">Tenant</span>
                            <span class="contract2-detail__mini-value">${mThis.escapeHtml(data.tenant_name ?? "—")}</span>
                        </div>
                    </div>
                    <div class="contract2-detail__lease-box">
                        <div class="contract2-detail__lease-title">Lease terms</div>
                        <div class="contract2-detail__lease-split">
                            <div class="contract2-detail__lease-col">
                                <span class="contract2-detail__mini-label">Start date</span>
                                <span class="contract2-detail__lease-value">${mThis.escapeHtml(data.start_date ?? "—")}</span>
                            </div>
                            <div class="contract2-detail__lease-col">
                                <span class="contract2-detail__mini-label">End date</span>
                                <span class="contract2-detail__lease-value">${mThis.escapeHtml(data.end_date ?? "—")}</span>
                            </div>
                        </div>
                    </div>
                </aside>
                <section class="contract2-detail__main">
                    <div class="contract2-detail__tabs">
                        <button type="button" class="contract2-detail__tab is-active" data-tab="overview">Overview</button>
                        <button type="button" class="contract2-detail__tab" data-tab="tenant">Tenant</button>
                        <button type="button" class="contract2-detail__tab" data-tab="documents">Documents</button>
                    </div>
                    <div class="contract2-detail__panel">
                        <div class="contract2-detail__tab-panel" data-panel="overview">
                            <div class="contract2-detail__section-card">
                                <div class="contract2-detail__section-head">
                                    <span class="contract2-detail__section-icon"><i class="fa-regular fa-file-lines"></i></span>
                                    <span>Lease information</span>
                                </div>
                                <div class="contract2-detail__info-rows">
                                    <div class="contract2-detail__info-grid">
                                        ${mThis.renderDetailField("Business type", mThis.valueHtml(data.business_type))}
                                        ${mThis.renderDetailField("Property type", mThis.valueHtml(data.space_type))}
                                        ${mThis.renderDetailField("Area", areaHtml)}
                                    </div>
                                    <div class="contract2-detail__info-grid">
                                        ${mThis.renderDetailField("Price", priceHtml)}
                                        ${mThis.renderDetailField("Deposit", depositHtml)}
                                        ${mThis.renderDetailField("Last updated", mThis.valueHtml(data.updated_at))}
                                    </div>
                                </div>
                            </div>
                            <div class="contract2-detail__section-card">
                                <div class="contract2-detail__section-head">
                                    <span class="contract2-detail__section-icon"><i class="fa-regular fa-credit-card"></i></span>
                                    <span>Payment</span>
                                </div>
                                <div class="contract2-detail__info-grid contract2-detail__info-grid--single">
                                    ${mThis.renderDetailField("Last payment", mThis.valueHtml(data.last_renewal_date, "No payment yet"))}
                                    ${mThis.renderDetailField("Next due", mThis.valueHtml(data.end_date))}
                                    ${mThis.renderDetailField("Remark", remarkHtml)}
                                </div>
                            </div>
                        </div>
                        <div class="contract2-detail__tab-panel d-none" data-panel="tenant">
                            <div class="contract2-detail__section-card">
                                <div class="contract2-detail__section-head">
                                    <span class="contract2-detail__section-icon"><i class="fa-regular fa-user"></i></span>
                                    <span>Tenant information</span>
                                </div>
                                <div class="contract2-detail__info-grid">
                                    ${mThis.renderDetailField("Name", mThis.valueHtml(data.tenant_name))}
                                    ${mThis.renderDetailField("Phone", mThis.valueHtml(data.phone_number))}
                                    ${mThis.renderDetailField("Email", mThis.valueHtml(data.email))}
                                    ${mThis.renderDetailField("Legal name", mThis.valueHtml(data.legal_name))}
                                    ${mThis.renderDetailField("Tenant code", mThis.valueHtml(data.code))}
                                </div>
                            </div>
                        </div>
                        <div class="contract2-detail__tab-panel d-none" data-panel="documents">
                            <div class="contract2-detail__empty-tab">
                                <span class="contract2-detail__empty-icon"><i class="fa-regular fa-folder-open"></i></span>
                                <p class="mb-1 fw-semibold text-dark">No documents yet</p>
                                <small>No documents linked to this contract.</small>
                            </div>
                        </div>
                    </div>
                </section>
            </div>`;
    };

    mThis.bindDetailTabs = (root, onClose) => {
        if (!root) return;
        const tabs = root.querySelectorAll(".contract2-detail__tab");
        const panels = root.querySelectorAll(".contract2-detail__tab-panel");
        tabs.forEach((tab) => {
            tab.onclick = () => {
                const name = tab.dataset.tab;
                tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
                panels.forEach((panel) => {
                    panel.classList.toggle("d-none", panel.dataset.panel !== name);
                });
            };
        });

        const closeBtn = root.querySelector(".contract2-detail__close-btn");
        if (closeBtn && typeof onClose === "function") {
            closeBtn.onclick = (e) => {
                e.preventDefault();
                onClose();
            };
        }
    };

    mThis.showContractDetailDialog = (id) => {
        const data = mThis.contractItemsMap[id];
        if (!data) return;

        Contract2ViewDialog.show({
            title: "",
            contentHtml: mThis.buildDetailHtml(data),
            dialogClass: "contract2-detail-modal",
            hideFooter: true,
            hideHeader: true,
            onReady: (root, hide) => {
                mThis.bindDetailTabs(root, hide);
            },
        });
    };

    mThis.buildRenewalTimelineHtml = (data, renewals) => {
        const unitLabel = mThis.escapeHtml(data.space_code ?? "Unit");
        const renewalsList = Array.isArray(renewals) ? renewals : [];
        const totalEntries = 1 + renewalsList.length;
        const isActive =
            parseInt(data.status_id, 10) === 2 ||
            String(data.status ?? "").toLowerCase() === "active";
        const activeBadge = isActive
            ? `<span class="contract2-renewal__active-badge">Currently active</span>`
            : "";

        const priceText = mThis.formatPriceRenewal(data);
        const depositText = mThis.formatDepositRenewal(data);

        const renderItemBox = (term, price, deposit, changedBy) => `
            <div class="contract2-renewal__item-box">
                <div class="contract2-renewal__item-field">
                    <span class="contract2-renewal__field-label">Term</span>
                    <span class="contract2-renewal__field-value">${mThis.escapeHtml(term)}</span>
                </div>
                <div class="contract2-renewal__item-field">
                    <span class="contract2-renewal__field-label">Price</span>
                    <span class="contract2-renewal__field-value">${mThis.escapeHtml(price)}</span>
                </div>
                <div class="contract2-renewal__item-field">
                    <span class="contract2-renewal__field-label">Deposit</span>
                    <span class="contract2-renewal__field-value">${mThis.escapeHtml(deposit)}</span>
                </div>
                <div class="contract2-renewal__item-field">
                    <span class="contract2-renewal__field-label">Changed by</span>
                    <span class="contract2-renewal__field-value">${mThis.escapeHtml(changedBy ?? "Admin")}</span>
                </div>
            </div>`;

        const currentRenewedDate = data.last_renewal_date || data.updated_at || "";
        const currentDateLabel = currentRenewedDate
            ? `renewed ${mThis.formatRenewalActionDate(currentRenewedDate)}`
            : "—";

        let timelineHtml = `
            <div class="contract2-renewal__item is-current">
                <span class="contract2-renewal__dot"></span>
                <div class="contract2-renewal__item-head">
                    <span class="contract2-renewal__item-label">Current term</span>
                    <span class="contract2-renewal__item-date">${mThis.escapeHtml(currentDateLabel)}</span>
                </div>
                ${renderItemBox(
                    mThis.formatTermRangeCompact(data.start_date, data.end_date),
                    priceText,
                    depositText,
                    data.update_user,
                )}
            </div>`;

        renewalsList.forEach((row, index) => {
            const isLast = index === renewalsList.length - 1;
            const label = isLast
                ? "Original contract"
                : `Renewal ${renewalsList.length - index}`;
            const actionDate = isLast
                ? row.start_date ?? row.renewal_date ?? ""
                : row.renewal_date ?? "";
            const actionVerb = isLast ? "signed" : "renewed";
            const dateLabel = actionDate
                ? `${actionVerb} ${mThis.formatRenewalActionDate(actionDate)}`
                : "—";

            timelineHtml += `
            <div class="contract2-renewal__item${isLast ? " is-original" : ""}">
                <span class="contract2-renewal__dot"></span>
                <div class="contract2-renewal__item-head">
                    <span class="contract2-renewal__item-label">${label}</span>
                    <span class="contract2-renewal__item-date">${mThis.escapeHtml(dateLabel)}</span>
                </div>
                ${renderItemBox(
                    mThis.formatTermRangeCompact(row.start_date, row.end_date),
                    priceText,
                    depositText,
                    row.update_user,
                )}
            </div>`;
        });

        return `
            <div class="contract2-renewal-shell">
                <button type="button" class="contract2-renewal__close-btn" aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="contract2-renewal">
                    <div class="contract2-renewal__head">
                        <div>
                            <div class="contract2-renewal__title">${unitLabel} · renewal history</div>
                            <div class="contract2-renewal__sub">${totalEntries} renewal${totalEntries === 1 ? "" : "s"} on record</div>
                        </div>
                        ${activeBadge}
                    </div>
                    <div class="contract2-renewal__timeline">${timelineHtml}</div>
                    <div class="contract2-renewal__foot">
                        <button type="button" class="contract2-renewal__scroll-hint" tabindex="-1" aria-hidden="true">
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    };

    mThis.loadRenewalHistory = (container, id, onClose) => {
        const data = mThis.contractItemsMap[id];
        if (!data) return;

        container.innerHTML = `<div class="contract2-renewal-loading"><div class="spinner-border text-primary" role="status"></div></div>`;

        vsapi
            .call(
                `${main_view.base_url}/prm/contract/list-renewals`,
                { contract_id: id, per_page: 50 },
                null,
                null,
            )
            .then((res) => {
                const renewals =
                    res.status_code === 200 && res.data && res.data.data
                        ? res.data.data
                        : [];
                container.innerHTML = mThis.buildRenewalTimelineHtml(data, renewals);
                mThis.bindRenewalDialog(container, onClose);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-0">Failed to load renewal history.</div>`;
            });
    };

    mThis.bindRenewalDialog = (container, onClose) => {
        if (!container) return;
        const closeBtn = container.querySelector(".contract2-renewal__close-btn");
        if (closeBtn && typeof onClose === "function") {
            closeBtn.onclick = (e) => {
                e.preventDefault();
                onClose();
            };
        }
    };

    mThis.showRenewRecordDialog = (id) => {
        const data = mThis.contractItemsMap[id];
        if (!data) return;

        Contract2ViewDialog.show({
            title: "",
            contentHtml: `<div id="_contract2_renewal_panel"></div>`,
            dialogClass: "contract2-renewal-modal",
            hideFooter: true,
            hideHeader: true,
            onReady: (panel, hide) => {
                mThis.loadRenewalHistory(panel, id, hide);
            },
        });
    };

    mThis.downloadAgreement = (id) => {
        cv_interact.info("Agreement download is not available for this contract yet.");
    };

    mThis.initDropdownMenus = (listContainer) => {
        new VSDropdownMenu({
            containerElement: listContainer,
            actionButtonClass: "btn_contract2_action",
            cssClass: "contract2-row__dropdown shadow-sm",
            adjustPosition: { top: 4 },
            menus: [
                {
                    html: '<span class="ps-2">View detail</span>',
                    icon: `<i class="fa-regular fa-eye fs-6 text-prm-custom"></i>`,
                    cssClass: "contract2-row__dropdown-item",
                    name: "view_detail",
                },
                {
                    html: '<span class="ps-2">View renew record</span>',
                    icon: `<i class="fa-solid fa-clock-rotate-left fs-6 text-prm-custom"></i>`,
                    cssClass: "contract2-row__dropdown-item",
                    name: "view_renew_record",
                },
                {
                    html: '<span class="ps-2">Download agreement</span>',
                    icon: `<i class="fa-solid fa-download fs-6 text-prm-custom"></i>`,
                    cssClass: "contract2-row__dropdown-item menu-item--divider",
                    name: "download_agreement",
                },
            ],
            onClick: (menuLink, id, name) => {
                if (name === "view_detail") {
                    mThis.showContractDetailDialog(id);
                } else if (name === "view_renew_record") {
                    mThis.showRenewRecordDialog(id);
                } else if (name === "download_agreement") {
                    mThis.downloadAgreement(id);
                }
            },
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/tenant/contract/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
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
            mThis.Contract2ListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const Contract2ViewDialog = (() => {
    const self = {};

    self.show = (op) => {
        const dialogClass = op.dialogClass || "contract2-detail-modal";
        const buttons = op.hideFooter
            ? []
            : [
                  {
                      label: "<span>Close</span>",
                      cssClass: "btn btn-secondary",
                      click: (me) => me.hide(false),
                  },
              ];
        const dialog = new GeneralDialog({
            title: op.title ?? "Contract Detail",
            cssClass: `modal-xl vs-modal vs-modal--compact ${dialogClass}`,
            backdrop: "static",
            keyboard: true,
            createContent: () => op.contentHtml || "",
            contentCreated: (me) => {
                const hideDialog = () => me.hide(false);

                if (!op.hideHeader) {
                    const closeBtn = me.divModal.querySelector(".btn-close");
                    if (closeBtn) {
                        closeBtn.addEventListener("click", (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            hideDialog();
                        });
                    }
                }

                const customClose = me.divModal.querySelector(
                    ".contract2-detail__close-btn, .contract2-renewal__close-btn",
                );
                if (customClose) {
                    customClose.onclick = (e) => {
                        e.preventDefault();
                        hideDialog();
                    };
                }

                if (typeof op.onReady === "function") {
                    const panel =
                        me.divModal.querySelector("#_contract2_renewal_panel") ||
                        me.divModal.querySelector("#_contract2_detail_root") ||
                        me.divModal.querySelector(".contract2-detail") ||
                        me.divModal.querySelector(".modal-body");
                    op.onReady(panel, hideDialog);
                }
            },
            buttons,
        });
        dialog.show(op);
    };

    return self;
})();
