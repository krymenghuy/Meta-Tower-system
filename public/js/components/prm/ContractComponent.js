"use strict";

var ContractComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.btnPDF = mThis.self.querySelector('#_asusp_btn_pdf');
    // mThis.elTenant = mThis.self.querySelector('#tenant_id');
    mThis.elBusinessType = mThis.self.querySelector('#business_type_id');
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
            data: (data,index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.tenant_name ?? ''}
                            <hr class="m-0 border border-secondary border-3 opacity-75">
                           ${data.phone_number ?? ''}
                        </div>`;
                }
        },
         {
            transTitle: "titles.Start Date",
            className: "align-middle",
            data: (data, index, tr) => {
                // const displayDate = (data.last_renewal_date && data.last_renewal_date.trim()) ? data.last_renewal_date : (data.start_date ?? '');
                const displayDate = data.start_date ?? '';
                return `<small class="px-2 py-2 bg-body-secondary text-nowrap text-muted rounded-2"><i class="fa-regular fa-clock"></i> ${displayDate}</small>`;
            }
        },
         {
            transTitle: "titles.End Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<small class="px-2 py-2 bg-body-secondary text-muted text-nowrap rounded-2"><i class="fa-regular fa-clock"></i> ${data.end_date ?? ''}</smaLL>`;
            }
        },
        {
            transTitle: "titles.Business",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.business_type ?? ''}</span>`;
            }
        },
         {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.space_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<span class="px-2 py-1 bg-prm-custom text-nowrap text-white rounded font-medium">${data.space_code ?? ''}</span>`;
            }
        },

        {
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                const price = VSMoney.formatAmount(data.price,data.currency_code ?? 'USD');

                if (data.price_type === 'total') {
                    return `
                        <span class="text-nowrap w-semibold">${price} <small class="text-nowrap text-muted">/mon</small></span>
                        <div class="text-nowrap text-muted small">Whole Room</div>
                    `;
                }

                return `
                    <span class="text-nowrap text-primary-custom">
                            ${price}
                        <small class="text-nowrap text-muted">/sqm</small>
                    </span>
                    <div class="text-nowrap text-muted small">
                        ${data.sqm_size ?? '-'} sqm
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Deposit",
            className: "align-middle",
            data: (data) => {
               const deposit = VSMoney.formatAmount(data.deposit, data.currency_code ?? 'USD');
                return `<span class="text-prm-custom">${deposit}</span>`;
            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? '__'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {

                const status = (data.status ?? '').toLowerCase();

                let cls  = 'badge border border-warning text-warning bg-warning-subtle';
                let icon = 'bi-check-circle-fill';
                let dot  = 'bg-warning';

                if (status === 'active') {
                    cls  = 'badge border border-success text-success bg-success-subtle';
                    icon = 'fa-regular fa-circle-check';
                    dot  = 'bg-success';
                }
                else if (status === 'pending') {
                    cls  = 'badge border border-warning text-warning bg-warning-subtle';
                    icon = 'fa-regular fa-hourglass-half';
                    dot  = 'bg-warning';
                }
                else if (status === 'expired') {
                    cls  = 'badge border border-danger text-danger bg-danger-subtle';
                    icon = 'fa-regular fa-clock';
                    dot  = 'bg-danger';
                }
                else if (status === 'terminated') {
                    cls  = 'badge border border-danger text-danger bg-danger-subtle';
                    icon = 'fa-regular fa-circle-xmark';
                    dot  = 'bg-danger';
                }

                const statusLabel = (status === 'terminated') ? 'Terminated' : (data.status ?? '');
                return `
                    <span class="badge ${cls}"
                        style="min-width:110px"
                        data-status_id="${data.status_id}">
                        <i class="${icon}" style="font-size:13px;"></i>

                        <span class="text-capitalize">${statusLabel}</span>
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ''}</span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn_contract_action" data-id="${data.id}" data-statusid="${data.status_id}" data-status="${data.status ?? ''}" data-end-date="${data.end_date ?? ''}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm  rounded-2 text-nowrap">
                            <span>
                                <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                            </span>
                       </button>
                    </a>
                </div>`
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView('_contract_list', {
            fetchApi: `${main_view.base_url}/prm/contract/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.dataset.status = data.status ?? '';
                tr.dataset.endDate = data.end_date ?? '';
                tr.classList.add('contract');
                tr.setAttribute('id', ['contract_invoice_id', data.id].join(''));
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ContractListView.showPage(mThis.getFilterData());
                }
            };
            ContractDialog.show(op);
        };

        mThis.pr_tbl = mThis.ContractListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.tblContract = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblContract);

        if (!mThis.tblContract.id) mThis.tblContract.id = '_contract_list_table';
        new ExpandableRowConfig(mThis.tblContract.id, {
            dontExpandByClickingOn: ['btn_contract_action'],
            onOpen: (container, detail_tr, parent_tr) => {
                const rawId = parent_tr.getAttribute('id') || '';
                const id = rawId.replace(/^contract_invoice_id/, '');
                if (id && !Number.isNaN(Number(id))) mThis.displayContractDetail(container, id);
            }
        });

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
            search_value: mThis.elSearch.value,
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

    mThis.displayContractDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        Promise.all([
            vsapi.call(`${main_view.base_url}/prm/contract/details`, { id }, null, null),
            vsapi.call(`${main_view.base_url}/prm/contract/list-renewals`, { contract_id: id, per_page: 50 }, null, null)
        ])
            .then(([detailsRes, renewalsRes]) => {
                if (detailsRes.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load contract details</div>`;
                    return;
                }
                const renewals = (renewalsRes.status_code === 200 && renewalsRes.data && renewalsRes.data.data) ? renewalsRes.data.data : [];
                mThis.renderContractDetail(container, detailsRes.data || {}, id, renewals);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading contract details</div>`;
            });
    };

    mThis.renderContractDetail = (container, d, contractId, renewals) => {
        // const cur = (d.cur_symbol != null) ? d.cur_symbol : '$';
        // const priceLabel = (d.price_type === 'total') ? 'Whole Room' : 'Per sqm';
        // const priceVal = d.price != null ? Number(d.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
        // const depositVal = (d.deposit != null && d.deposit !== '') ? Number(d.deposit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

        const renewalsList = Array.isArray(renewals) ? renewals : [];
        const currentSpaceCode = (d.space_code ?? '').trim();
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
                const spaceCode = (r.space_code ?? '').trim() || '—';
                const unitChanged = currentSpaceCode && spaceCode !== '—' && spaceCode !== currentSpaceCode;
                const unitCell = unitChanged
                    ? `<span class="d-inline-flex align-items-center gap-1"><span class="${unitPillClass}">${escapeHtml(spaceCode)}</span><span class="badge bg-info text-white" style="font-size:0.7rem;">New unit</span></span>`
                    : `<span class="${unitPillClass}">${escapeHtml(spaceCode)}</span>`;
                return `
                <tr>
                    <td class="align-middle">${(r.renewal_date ?? '').trim() || '—'}</td>
                    <td class="align-middle">${(r.start_date ?? '').trim() || '—'}</td>
                    <td class="align-middle">${(r.end_date ?? '').trim() || '—'}</td>
                    <td class="align-middle">${unitCell}</td>
                    <td class="text-break align-middle">${(r.remarks ?? '').trim() || '—'}</td>
                    <td class="align-middle"><div class="d-flex flex-column"><span class="text-capitalize fw-semibold">${escapeHtml((r.update_user ?? '').trim()) || '—'}</span><small class="text-muted">${(r.updated_at ?? '').trim() || ''}</small></div></td>
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
                                            <th class="text-nowrap  py-2 px-3">Remarks</th>
                                            <th class="text-nowrap  py-2 px-3">Updated by</th>
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

        container.innerHTML = `

                 ${renewalTableHtml}`;

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
                    name: "edit_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Renew Contract"></span>',
                    icon: `<i class="fa-solid fa-arrow-up-right-from-square fs-5 text-prm-custom"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "renew_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Terminate Contract"></span>',
                    icon: `<i class="fa-regular fa-circle-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "terminate_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Print Contract"></span>',
                    icon: `<i class="fa-solid fa-print fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete Contract"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_contract"
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const row = container.closest('tr');
                const statusId = Number(container.dataset.statusid ?? row?.dataset?.statusid);
                const statusText = String(container.dataset.status ?? row?.dataset?.status ?? '').trim().toLowerCase();
                const isActive = statusText === 'active' || statusId === 2;
                const endDate = mThis.parseSafeDate(container.dataset.endDate ?? row?.dataset?.endDate ?? '');
                const isPending = statusText === 'pending';
                const isExpired = statusText === 'expired';
                const isTerminated = statusText === 'terminated';
                              // show renew only when status is active and end date is within next 3 months (not for pending)
                              const showRenew = isActive && endDate && mThis.isWithinNextThreeMonths(endDate);
                const canModify = !isActive && !isExpired && !isTerminated;

                menu.edit_contract.style.display = canModify ? 'block' : 'none';
                menu.print_contract.style.display ='none';
                menu.renew_contract.style.display = showRenew ? 'block' : 'none';
                if (menu.terminate_contract) {
                    // show terminate only when status is active
                    menu.terminate_contract.style.display = isActive ? 'block' : 'none';
                }
                if (menu.delete_contract) {
                    // show delete when status is pending, expired, or terminated
                    menu.delete_contract.style.display = (isPending || isExpired || isTerminated) ? 'block' : 'none';
                }
            },
            onClick: (menuLink, id, name) => {
                switch (name) {

                    case 'edit_contract': {
                        mThis.editContract(id, menuLink);
                        break;
                    }
                    case 'renew_contract': {
                        mThis.renewContract(id, menuLink);
                        break;
                    }
                    case 'terminate_contract': {
                        mThis.terminateContract(id, menuLink);
                        break;
                    }
                    case 'print_contract': {
                        mThis.printContract(id, menuLink);
                        break;
                    }
                    case 'delete_contract': {
                        mThis.deleteContract(id, menuLink);
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

    mThis.printContract = (id, menulink) => {
        if (!id) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            cv_interact.error('Unable to open print window. Please allow popups and try again.');
            return;
        }

        const escapeHtml = (value) => {
            const str = String(value ?? '');
            return str
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
        };

        const formatMoney = (amount) => {
            const n = Number(amount || 0);
            return Number.isNaN(n) ? '0.00' : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        vsapi.call(`${main_view.base_url}/prm/contract/details`, { id }, null, null)
            .then((res) => {
                if (res.status_code !== 200 || !res.data) {
                    printWindow.close();
                    cv_interact.error(res.error_message || 'Unable to load contract data for print.');
                    return;
                }

                const d = res.data;
                const unitPriceLabel = (d.price_type === 'total') ? 'Whole Room' : 'Per Square Meter';
                const html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Contract #${escapeHtml(d.id)}</title>
    <style>
        body { font-family: Arial, sans-serif; color: #222; margin: 24px; }
        .header { margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
        .title { font-size: 22px; font-weight: 700; margin: 0; }
        .sub { color: #555; margin-top: 4px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-top: 16px; }
        .row b { display: inline-block; min-width: 120px; }
        .section { margin-top: 20px; }
        .box { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
        .remarks { min-height: 90px; white-space: pre-wrap; }
        .sign { margin-top: 44px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .line { margin-top: 48px; border-top: 1px solid #666; padding-top: 8px; color: #444; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <p class="title">Contract Agreement</p>
        <div class="sub">Contract ID: #${escapeHtml(d.id)}</div>
    </div>

    <div class="grid">
        <div class="row"><b>Tenant</b> ${escapeHtml(d.tenant_name)}</div>
        <div class="row"><b>Legal Name</b> ${escapeHtml(d.legal_name)}</div>
        <div class="row"><b>Unit Code</b> ${escapeHtml(d.space_code)}</div>
        <div class="row"><b>Business Type</b> ${escapeHtml(d.business_name)}</div>
        <div class="row"><b>Unit Type</b> ${escapeHtml(d.space_name)}</div>
        <div class="row"><b>Size (m2)</b> ${escapeHtml(d.sqm_size)}</div>
        <div class="row"><b>Start Date</b> ${escapeHtml(d.start_date)}</div>
        <div class="row"><b>End Date</b> ${escapeHtml(d.end_date)}</div>
        <div class="row"><b>Unit Price</b> ${escapeHtml(unitPriceLabel)}</div>
        <div class="row"><b>Price</b> $${formatMoney(d.price)}</div>
    </div>

    <div class="section">
        <div class="box">
            <b>Remarks</b>
            <div class="remarks">${escapeHtml(d.remarks || '-')}</div>
        </div>
    </div>

    <div class="sign">
        <div class="line">Landlord Signature</div>
        <div class="line">Tenant Signature</div>
    </div>
</body>
</html>`;

                printWindow.document.open();
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => {
                    printWindow.print();
                }, 300);
            })
            .catch(() => {
                printWindow.close();
                cv_interact.error('Failed to prepare contract print.');
            });
    }

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
const ContractDialog = (() => {
    const self = {};
    let dialog = null;
    const parseDateInput = (value) => {
        if (!value) return null;
        const raw = String(value).trim();
        if (!raw) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            const [year, month, day] = raw.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) {
            const [dayStr, monthStr, yearStr] = raw.split('-');
            const monthMap = {
                Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
            const month = monthMap[monthStr];
            if (month === undefined) return null;
            return new Date(Number(yearStr), month, Number(dayStr));
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const [day, month, year] = raw.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        const parsed = new Date(raw);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

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
                                <input type="text" inputmode="decimal" name="deposit" class="data-input form-control" data-field="deposit" placeholder=" " />
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
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" placeholder=" " />
                                    <label>Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " />
                                    <label>Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price_type" class="data-input form-control" data-field="price_type" placeholder=" " />
                                    <label>Unit Price</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " />
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

                me.controls.deposit.addEventListener('input', (e) => {
                    let v = e.target.value;
                    v = v.replace(/[^0-9.]/g, '');

                    const parts = v.split('.');
                    if (parts.length > 2) {
                        v = parts[0] + '.' + parts[1];
                    }
                    if (parts[1] !== undefined) {
                        v = parts[0] + '.' + parts[1].slice(0, 2);
                    }

                    e.target.value = v;
                });
                me.controls.deposit.addEventListener('blur', (e) => {
                    let v = parseFloat(e.target.value);

                    if (isNaN(v) || v <= 0) {
                        e.target.value = '';
                        return;
                    }
                    e.target.value = v;
                });

                applyNumberInput(me.controls.deposit);
                applyNumberInput(me.controls.sqm_size);
                applyNumberInput(me.controls.price);

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
                console.log(123,data);

                const isReadOnly = me.dataOptions.tenant_id > 0 || data.prefill_tenant_id;
                me.controls.tenant.disabled = isReadOnly;

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
                const toggleUnitInputs = (isDisabled) => {
                    ['space_name', 'sqm_size', 'price_type', 'price'].forEach((field) => {
                        if (me.controls[field]) {
                            me.controls[field].disabled = isDisabled;
                        }
                    });
                };
                const spaceTypes = Array.isArray(data?.space_types) ? data.space_types : [];
                const getSpaceTypeName = (spaceTypeId) => {
                    const row = spaceTypes.find((x) => String(x.id) === String(spaceTypeId));
                    return row?.space_type ?? '';
                };
                const applyUnitData = (spaceId) => {
                    const selected = spaceRows.find((row) => String(row.id) === String(spaceId));
                    if (!selected) {
                        me._createContractSpaceTypeId = null;
                        toggleUnitInputs(false);
                        return;
                    }
                    me._createContractSpaceTypeId = selected.space_type_id ?? null;
                    if (me.controls.space_name) {
                        me.controls.space_name.value = selected.space_type ?? getSpaceTypeName(selected.space_type_id) ?? '';
                    }
                    if (me.controls.sqm_size) me.controls.sqm_size.value = selected.sqm_size ?? '';
                    if (me.controls.price_type) me.controls.price_type.value = selected.price_type ?? '';
                    if (me.controls.price) me.controls.price.value = selected.price ?? '';
                    toggleUnitInputs(true);
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
                    } else {
                        toggleUnitInputs(false);
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
                        // const depositCtrl = me.controls?.deposit;
                        // const depositVal = depositCtrl ? String(depositCtrl.value || "").trim() : "";
                        // if (!depositVal) {
                        //     cv_interact.error("Deposit is required.");
                        //     if (depositCtrl) depositCtrl.focus();
                        //     return;
                        // }

                        const op = me.getData();
                        if (me._createContractSpaceTypeId !== undefined && me._createContractSpaceTypeId !== null) {
                            op.space_type_id = me._createContractSpaceTypeId;
                        }
                        op.tenant_id = me.tenant_id;
                        op.id = me.dataOptions.id;
                        op.tenant_id = me.tenant_id;

                        console.log(123,op);
                        vsapi.call([main_view.base_url, "/prm/contract/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Contract has been updated successfully.");
                                } else {
                                    cv_interact.success("New contract has been added successfully.");
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
                                            <label>Remarks</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-lg">
                                <h6 class="mb-3 text-golden">Create Contract</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" placeholder=" " readonly disabled />
                                    <label>Unit Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " readonly disabled />
                                    <label>Size (m²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price_type" class="data-input form-control" data-field="price_type" placeholder=" " readonly disabled />
                                    <label>Unit Price</label>
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
                const oldStartIso = normalizeContractDateToIso(det.start_date);
                const oldEndIso = normalizeContractDateToIso(det.end_date);
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
                if (me.controls.price) me.controls.price.value = "";
                if (me.controls.price_type) me.controls.price_type.value = "";
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
                const setUnitFields = (unitData) => {
                    if (!unitData) return;
                    if (me.controls.space_name) {
                        me.controls.space_name.value = unitData.space_type ?? getSpaceTypeName(unitData.space_type_id);
                    }
                    if (me.controls.sqm_size) me.controls.sqm_size.value = unitData.sqm_size ?? '';
                    if (me.controls.price_type) me.controls.price_type.value = unitData.price_type ?? '';
                    if (me.controls.price) me.controls.price.value = unitData.price ?? '';
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
                // me.controls.price.value = data.contract_details.price;
                // me.controls.price_type.value = data.contract_details.price_type;
                // me.controls.remarks.value = data.contract_details.remarks;
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
