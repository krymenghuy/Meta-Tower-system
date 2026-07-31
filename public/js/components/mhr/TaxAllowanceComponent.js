"use strict";

var TaxAllowanceComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._formatMoney = (value, currency) => {
        if (typeof VSMoney !== "undefined" && VSMoney.formatAmount) {
            return VSMoney.formatAmount(value, currency || "USD");
        }
        const num = Number(value) || 0;
        return `$ ${num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    mThis._bindActions = (container, empId, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_tax_allowance_btn_add");
        if (addBtn) {
            addBtn.onclick = function (e) {
                e.preventDefault();
                TaxAllowanceDialog.show({
                    id: null,
                    btn: e.target,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        }

        container.querySelectorAll(".emp-tax-allowance-action-btn-edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                TaxAllowanceDialog.show({
                    id: btn.dataset.id,
                    btn: btn,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-tax-allowance-action-btn-delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                mThis.deleteTaxAllowance(btn.dataset.id, btn, refresh);
            };
        });
    };

    mThis.deleteTaxAllowance = (id, menulink, refresh) => {
        let op = {
            id: id,
            btn: menulink,
        };

        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/tax-allowance/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success");
                                if (typeof refresh === "function") {
                                    refresh();
                                }
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            menulink.disabled = false;
                        });
                } else {
                    menulink.disabled = false;
                }
            }
        );
    };

    mThis.render = (container, allowances, empId, onRefresh) => {
        if (!container) return;

        const allowanceList = Array.isArray(allowances) ? allowances : [];

        const rowsHtml = allowanceList.length
            ? allowanceList
                  .map(
                      (row) => `
                <div class="emp-tax-allowance-row" data-allowance-id="${row.id}">
                    <div class="emp-tax-allowance-col-qty">${mThis._escapeHtml(String(row.qty ?? 0))}</div>
                    <div class="emp-tax-allowance-col-amount">${mThis._escapeHtml(mThis._formatMoney(row.amount, row.currency_code))}</div>
                    <div class="emp-tax-allowance-col-allowance">${mThis._escapeHtml(mThis._formatMoney(row.allowance, row.currency_code))}</div>
                    <div class="emp-tax-allowance-col-action">
                        <div class="d-flex justify-content-center align-items-middle">
                            <div class="text-middle gap-2 d-flex flex-wrap">
                                <button type="button" class="emp-skill-action-btn emp-tax-allowance-action-btn-edit" data-id="${row.id}">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </button>
                                <button type="button" class="emp-skill-action-btn emp-tax-allowance-action-btn-delete" data-id="${row.id}">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`
                  )
                  .join("")
            : `<div class="emp-tax-allowance-empty">
                    <i class="fa-solid fa-receipt emp-tax-allowance-empty-icon"></i>
                    <span class="emp-tax-allowance-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-tax-allowance-card">
                    <div class="emp-tax-allowance-header">
                        <div class="emp-tax-allowance-header-title">
                            <span class="emp-tax-allowance-header-icon">
                                <i class="fa-solid fa-hand-holding-dollar"></i>
                            </span>
                            <span class="emp-tax-allowance-header-label" vslang="titles.Tax Allowance">Tax Allowance</span>
                        </div>
                        <button type="button" class="emp-skill-add-btn" id="_emp_tax_allowance_btn_add" title="Add" aria-label="Add tax allowance">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-tax-allowance-body">
                        <div class="emp-tax-allowance-cols">
                            <span vslang="titles.QTY">QTY</span>
                            <span vslang="titles.Unit Amt">Unit Amount</span>
                            <span vslang="titles.Allowance">Allowance</span>
                            <span vslang="titles.Action">Action</span>
                        </div>
                        <div class="emp-tax-allowance-list">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, onRefresh);
    };

    return mThis;
})();

const TaxAllowanceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="number" name="qty" required class="data-input form-control" data-field="qty" min="0" step="1" placeholder=" " />
                                    <label vslang="titles.Qty"></label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="number" name="amount" required class="data-input form-control" data-field="amount" min="0" step="0.01" placeholder=" " />
                                    <label vslang="labels.Amount"></label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <select data-style="material" name="currency_code" class="form-control data-input" data-field="currency_code" placeholder="${LocaleManager.trans('Currency','labels')}"></select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" rows="4" placeholder=" "></textarea>
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/tax-allowance/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (
                                            typeof me.dataOptions.onClose ===
                                            "function"
                                        ) {
                                            me.dataOptions.onClose(p);
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_tax_allowance_success"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_tax_allowance_success"
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Tax Allowance",
                    modifyTitle: "vslang:titles.Edit Tax Allowance",
                    targetProp: "tax_allowance",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/tax-allowance/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    },
                ],
                onPrepareForm: (me, data) => {
                   
                },
            });

        dialog.show(op);
    };

    return self;
})();
