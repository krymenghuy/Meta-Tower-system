"use strict";
var InvoiceSettingComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Setting";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_invoiceSetting_component");

    mThis.elExchangeRate  = mThis.self.querySelector("#_is_exchange_rate");
    mThis.btnEdit         = mThis.self.querySelector("#_btnEditInvoiceSetting");

    // ── Helpers ────────────────────────────────────────────────────────────────

    // FIXED: This now changes the checkbox state directly instead of injecting old HTML badges
    mThis.renderSummary = (data) => {
        if (!data) return;

        // 1. Render Exchange Rate Text
        const rate = data.exchange_rate ?? "—";
        mThis.elExchangeRate.textContent = rate !== "—"
            ? `${Number(rate).toLocaleString()} ៛`
            : "—";

        // 2. Loop through all checkboxes on the page and match them with server data
        const container = mThis.self;
        container.querySelectorAll(".toggle-setting").forEach(input => {
            const field = input.getAttribute("data-field");
            
            if (field && data[field] !== undefined) {
                input.checked = parseInt(data[field]) === 1;
            } else if (field && field === "show_amount_paid" && data.show_amount_piad !== undefined) {
                // Safe check for the database typo fallback '_piad'
                input.checked = parseInt(data.show_amount_piad) === 1;
            }
        });
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
            mThis.loadSettings((currentData) => {
                mThis.exchangeRateDialog.show(currentData);
            });
        };

        // FIXED: Listens to the switch interaction and sends full payload state to backend
        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            input.onchange = (e) => {
                mThis.saveToggleButtons();
            };
        });
    };

    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadSettings(null);
    };

    // ── Save Action Gateway ──────────────────────────────────────────────────
    mThis.saveToggleButtons = () => {
        const payload = { id: 1 }; 

        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            const field = input.getAttribute("data-field");
            if (field) {
                payload[field] = input.checked ? 1 : 0;
            }
        });

        vsapi
            .call(
                `${mThis.base_url}/prm/invoice_setting/update-toggle-button`,
                payload,
                null
            )
            .then(res => {
                if (res && res.status_code === 200) {
                    // cv_interact.success("Display options altered successfully.");
                    
                    // Pull either settings wrapper or the data root directly
                    const serverData = res.data && res.data.settings ? res.data.settings : res.data;
                    mThis.renderSummary(serverData);
                } else {
                    // cv_interact.error(res.error_message || "An error occurred while saving.");
                    mThis.loadSettings(null); // Reset layout to original data if failed
                }
            })
            .catch(err => {
                console.error("AJAX Gateway Exception:", err);
                mThis.loadSettings(null);
            });
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
                        click: (me) => { me.hide(false); },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
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
                                        mThis.loadSettings(null);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });

            dialog.dataOptions = currentData || {};
            dialog.show();
        };

        return self;
    };

    mThis.exchangeRateDialog = CreateExchangeRateDialog();

    return mThis;
})();