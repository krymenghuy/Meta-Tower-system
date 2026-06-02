"use strict";
var InvoiceSettingComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Setting";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_invoiceSetting_component");

    // Element View Selectors
    mThis.elExchangeRate          = mThis.self.querySelector("#_is_exchange_rate");
    mThis.elRepresentativeName    = mThis.self.querySelector("#_is_representative");
    mThis.elRepresentativePhone   = mThis.self.querySelector("#_is_representative_phone");
    mThis.elRepresentativeAddress = mThis.self.querySelector("#_is_representative_address");

    // Button Selectors
    mThis.btnEditRate = mThis.self.querySelector("#_btnEditInvoiceSetting");
    mThis.btnEditRep  = mThis.self.querySelector("#_btnEditRepresentative");

    // Render Data to Card Dashboard View
    mThis.renderSummary = (data) => {
        if (!data) return;

        // 1. Render Exchange Rate Text Box
        const rate = data.exchange_rate ?? "—";
        if (mThis.elExchangeRate) {
            mThis.elExchangeRate.textContent = rate !== "—"
                ? `${Number(rate).toLocaleString()} ៛`
                : "—";
        }

        // 2. Render Representative Info Text Elements (Mapped to schema keys)
        if (mThis.elRepresentativeName)    mThis.elRepresentativeName.textContent    = data.build_representative || "—";
        if (mThis.elRepresentativePhone)   mThis.elRepresentativePhone.textContent   = data.representative_phone          || "—";
        if (mThis.elRepresentativeAddress) mThis.elRepresentativeAddress.textContent = data.representative_address        || "—";

        // 3. Loop through all checkboxes and toggle states
        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            const field = input.getAttribute("data-field");
            if (field && data[field] !== undefined) {
                input.checked = parseInt(data[field]) === 1;
            } else if (field && field === "show_amount_paid" && data.show_amount_piad !== undefined) {
                input.checked = parseInt(data.show_amount_piad) === 1;
            }
        });
    };

    // Fetch setting data structure from backend gateway
    mThis.loadSettings = (onLoaded) => {
        vsapi
            .call(
                [mThis.base_url, "/prm/invoice_setting/get"].join(""),
                {},
                null,
                null
            )
            .then((res) => {
                const data = res.status_code === 200 ? (res.data?.settings ?? res.data) : null;
                mThis.renderSummary(data);
                if (typeof onLoaded === "function") onLoaded(data);
            });
    };

    // ── Init ───────────────────────────────────────────────────────────────────
    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;

        // Exchange Rate Dialog Show Trigger
        mThis.btnEditRate.onclick = (e) => {
            e.preventDefault();
            mThis.loadSettings((currentData) => {
                mThis.exchangeRateDialog.show(currentData);
            });
        };

        // Representative Info Dialog Show Trigger
        mThis.btnEditRep.onclick = (e) => {
            e.preventDefault();
            mThis.loadSettings((currentData) => {
                console.log(121222,currentData);

                mThis.representativeDialog.show(currentData);
            });
        };

        // Switch changes trigger immediate background database updates
        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            input.onchange = () => {
                mThis.saveToggleButtons();
            };
        });
    };

    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadSettings(null);
    };

    // ── Save Switches Gateway ──────────────────────────────────────────────────
    mThis.saveToggleButtons = () => {
        const payload = { id: 1 }; 

        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            const field = input.getAttribute("data-field");
            if (field) {
                payload[field] = input.checked ? 1 : 0;
            }
        });

        vsapi
            .call(`${mThis.base_url}/prm/invoice_setting/update-toggle-button`, payload, null)
            .then(res => {
                if (res && res.status_code === 200) {
                    const serverData = res.data && res.data.settings ? res.data.settings : res.data;
                    mThis.renderSummary(serverData);
                } else {
                    mThis.loadSettings(null);
                }
            })
            .catch(err => {
                console.error("AJAX Processing Error:", err);
                mThis.loadSettings(null);
            });
    };

    // ── Dialog Windows Factories ────────────────────────────────────────────────
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
                                .call([mThis.base_url, "/prm/invoice_setting/save"].join(""), op, btn, null)
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

    const CreateRepresentativeDialog = () => {
        const self = {};
        let dialog = null;

        self.show = (currentData) => {
            dialog = dialog || new GeneralDialog({
                title: "Representative Information",
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `
                        <div>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                <div class="material-input outlined style-main mb-3">
                                    <input class="data-input form-control" data-field="build_representative" id="build_representative" name="build_representative" type="text" placeholder=" ">
                                    <label>Representative Name</label>
                                </div>
                                <div class="material-input outlined style-main mb-3">
                                    <input class="data-input form-control" data-field="representative_phone" id="representative_phone" name="representative_phone" type="text" placeholder=" ">
                                    <label>Representative Phone</label>
                                </div>
                            </div>
                            <div class="material-input outlined style-main mb-3 ">
                                <textarea class="data-input form-control" data-field="representative_address" id="representative_address" name="representative_address" type="text" placeholder=" ">
                                <label>Representative Address</label>
                            </div>
                         </div>
                        `
                    ];
                },

                onPrepareForm : (me)=>{
                    console.log(777,me);
                    me.controls.build_representative.value = me.dataOptions.build_representative;
                    me.controls.representative_phone.value = me.dataOptions.representative_phone;
                    me.controls.representative_address.value = me.dataOptions.representative_address;
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
                            op.id = 1; // Explicit database identity anchor targeting row #1

                            op.build_representative = op.build_representative != ""  ? op.build_representative : me.dataOptions.build_representative;
                            op.representative_phone = op.representative_phone != ""  ? op.representative_phone : me.dataOptions.representative_phone;
                            op.representative_address = op.representative_address != ""  ? op.representative_address : me.dataOptions.representative_address;


                            vsapi
                                .call([mThis.base_url, "/prm/invoice_setting/save-buildign-representative"].join(""), op, btn, null)
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        cv_interact.success("Representative information saved successfully.");
                                        mThis.loadSettings(null); // Force screen update refresh
                                    } else {
                                        cv_interact.error(res.error_message || "Failed to update information.");
                                    }
                                });
                        },
                    },
                ],
            });

            dialog.dataOptions = currentData || {};
            dialog.show(currentData);
        };

        return self;
    };

    mThis.exchangeRateDialog  = CreateExchangeRateDialog();
    mThis.representativeDialog = CreateRepresentativeDialog();

    return mThis;
})();