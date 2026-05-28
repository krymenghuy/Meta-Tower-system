"use strict";
var InvoiceSettingComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Setting";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_invoiceSetting_component");

    // DOM refs for summary display cards
    mThis.elExchangeRate  = mThis.self.querySelector("#_is_exchange_rate");
    mThis.elShowCommTax   = mThis.self.querySelector("#_is_show_comm_tax");
    mThis.elShowPayStatus = mThis.self.querySelector("#_is_show_pay_status");
    mThis.elShowBaland    = mThis.self.querySelector("#_is_show_baland");
    mThis.btnEdit         = mThis.self.querySelector("#_btnEditInvoiceSetting");

    // ── Helpers ────────────────────────────────────────────────────────────────

    const renderToggleBadge = (el, value) => {
        const on = parseInt(value) === 1;
        el.innerHTML   = on
            ? '<i class="fa-solid fa-check" style="font-size:11px"></i> On'
            : '<i class="fa-solid fa-minus" style="font-size:11px"></i> Off';
        el.className   = on ? "is-badge-on" : "is-badge-off";
    };
    // Populate the summary cards with data returned from the API
    mThis.renderSummary = (data) => {
        if (!data) return;
        const rate = data.exchange_rate ?? "—";
        mThis.elExchangeRate.textContent = rate !== "—"
            ? `${Number(rate).toLocaleString()} ៛`
            : "—";
        renderToggleBadge(mThis.elShowCommTax,   data.show_comm_tax);
        renderToggleBadge(mThis.elShowPayStatus, data.show_pay_status);
        renderToggleBadge(mThis.elShowBaland,    data.show_baland);
    };

    // Fetch current settings from API, then run callback with data
    mThis.loadSettings = (onLoaded) => {
        vsapi
            .call(
                [mThis.base_url, "/prm/invoice_setting/get"].join(""),
                {},
                null,
                null
            )
            .then((res) => {
                const data = res.status_code === 200 ? res.data : null;
                mThis.renderSummary(data);
                if (typeof onLoaded === "function") onLoaded(data);
            });
    };

    // ── Init ───────────────────────────────────────────────────────────────────

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;

        mThis.btnEdit.onclick = (e) => {
            e.preventDefault();
            // Fetch latest before opening so the form is pre-filled
            mThis.loadSettings((currentData) => {
                mThis.exchangeRateDialog.show(currentData);
            });
        };
    };

    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadSettings(null);
    };

    // ── Dialog ─────────────────────────────────────────────────────────────────

    const CreateExchangeRateDialog = () => {
        const self = {};
        let dialog = null;

        self.show = (currentData) => {
            dialog = dialog || new GeneralDialog({
                title: "Exchange Rate",
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
               createContent: () => {
                    return [
                        `
                        <div class="p-2">
                            <div class="row align-items-center">
                                <div class="col-12 col-md-5 mb-2 mb-md-0">
                                    <label for="exchange_rate" class="fw-semibold mb-0" style="font-size:14px;">Exchange Rate (KHR)</label>
                                    <div class="text-muted mt-1" style="font-size:12px;">1 USD = ? KHR</div>
                                </div>
                                <div class="col-12 col-md-7">
                                    <div style="display:flex;flex-direction:row;align-items:stretch;border:1px solid #ced4da;border-radius:8px;overflow:hidden;">
                                        <span style="display:flex;align-items:center;padding:0 12px;background:#f8f9fa;border-right:1px solid #ced4da;color:#185FA5;font-size:15px;white-space:nowrap;">៛</span>
                                        <input type="number"
                                            class="data-input"
                                            id="exchange_rate"
                                            name="exchange_rate"
                                            data-field="exchange_rate"
                                            placeholder="e.g. 4000"
                                            min="1"
                                            step="any"
                                            style="flex:1;border:none;outline:none;padding:8px 12px;font-size:14px;background:#fff;min-width:0;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    ];
                },
                // Pre-fill form fields after the DOM is created
                contentCreated: (me) => {
                    const d = me.dataOptions || {};
                    if (me.controls.exchange_rate) {
                        me.controls.exchange_rate.value = d.exchange_rate ?? "";
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
                            // op.id = 1; // invoice_settings always uses id = 1

                            vsapi
                                .call(
                                    [mThis.base_url, "/prm/invoice_setting/save"].join(""),
                                    op,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        cv_interact.success("Settings updated successfully.");
                                        // Refresh the summary cards
                                        mThis.loadSettings(null);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });

            // Store current data as options so contentCreated can pre-fill fields
            dialog.dataOptions = currentData || {};
            dialog.show();
        };

        return self;
    };

    const changeToggleButtonInvoiceDialog = () => {
        const self = {};
        let dialog = null;

        self.show = (currentData) => {
            dialog = dialog || new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `
                        <div class="p-2">
                            <h6 class="mb-4 text-primary-custom border-bottom pb-2 fw-semibold">
                                <i class="fa-solid fa-file-invoice me-2"></i>Invoice Settings
                            </h6>

                            <!-- Exchange Rate -->
                            <div class="row g-3 align-items-center mb-3">
                                <div class="col-12 col-md-5">
                                    <label for="exchange_rate" class="form-label fw-semibold mb-0">Exchange Rate (KHR)</label>
                                    <div class="small text-muted">1 USD = ? KHR</div>
                                </div>
                                <div class="col-12 col-md-7">
                                    <div class="input-group">
                                        <span class="input-group-text">៛</span>
                                        <input type="number"
                                            class="form-control data-input"
                                            id="exchange_rate"
                                            name="exchange_rate"
                                            data-field="exchange_rate"
                                            placeholder="e.g. 4000"
                                            min="1"
                                            step="any">
                                    </div>
                                </div>
                            </div>

                            <!-- Show Commission Tax -->
                            <div class="row g-3 align-items-center mb-3 border-top pt-3">
                                <div class="col-12 col-md-5">
                                    <label class="form-label fw-semibold mb-0">Show Commission Tax</label>
                                </div>
                                <div class="col-12 col-md-7">
                                    <select class="form-select data-input"
                                        id="show_comm_tax"
                                        name="show_comm_tax"
                                        data-field="show_comm_tax">
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Show Payment Status -->
                            <div class="row g-3 align-items-center mb-3 border-top pt-3">
                                <div class="col-12 col-md-5">
                                    <label class="form-label fw-semibold mb-0">Show Payment Status</label>
                                </div>
                                <div class="col-12 col-md-7">
                                    <select class="form-select data-input"
                                        id="show_pay_status"
                                        name="show_pay_status"
                                        data-field="show_pay_status">
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Show Balance -->
                            <div class="row g-3 align-items-center border-top pt-3">
                                <div class="col-12 col-md-5">
                                    <label class="form-label fw-semibold mb-0">Show Balance</label>
                                </div>
                                <div class="col-12 col-md-7">
                                    <select class="form-select data-input"
                                        id="show_baland"
                                        name="show_baland"
                                        data-field="show_baland">
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        `
                    ];
                },

                // Pre-fill form fields after the DOM is created
                contentCreated: (me) => {
                    const d = me.dataOptions || {};
                    if (me.controls.exchange_rate) {
                        me.controls.exchange_rate.value = d.exchange_rate ?? "";
                    }
                    if (me.controls.show_comm_tax) {
                        me.controls.show_comm_tax.value = (d.show_comm_tax != null) ? String(d.show_comm_tax) : "0";
                    }
                    if (me.controls.show_pay_status) {
                        me.controls.show_pay_status.value = (d.show_pay_status != null) ? String(d.show_pay_status) : "0";
                    }
                    if (me.controls.show_baland) {
                        me.controls.show_baland.value = (d.show_baland != null) ? String(d.show_baland) : "0";
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
                            op.id = 1; // invoice_settings always uses id = 1

                            vsapi
                                .call(
                                    [mThis.base_url, "/prm/invoice_setting/save"].join(""),
                                    op,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        cv_interact.success("Settings updated successfully.");
                                        // Refresh the summary cards
                                        mThis.loadSettings(null);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });

            // Store current data as options so contentCreated can pre-fill fields
            dialog.dataOptions = currentData || {};
            dialog.show();
        };

        return self;
    };

    mThis.exchangeRateDialog = CreateExchangeRateDialog();

    return mThis;
})();