"use strict";
var InvoiceSettingComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Setting";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_invoiceSetting_component"
    );

    // Element View Selectors
    mThis.elExchangeRate = mThis.self.querySelector("#_is_exchange_rate");
    mThis.elRepresentativeName = mThis.self.querySelector(
        "#_is_representative"
    );
    mThis.elRepresentativePhone = mThis.self.querySelector(
        "#_is_representative_phone"
    );
    mThis.elRepresentativeAddress = mThis.self.querySelector(
        "#_is_representative_address"
    );

    // Button Selectors
    mThis.btnEditRate = mThis.self.querySelector("#_btnEditInvoiceSetting");
    mThis.btnEditRep = mThis.self.querySelector("#_btnEditRepresentative");

    mThis.imgLogo = mThis.self.querySelector("#com_imgLogo");
    mThis.btnChooseLogo = mThis.self.querySelector("#com_btnChooseLogo");
    mThis.btnDeleteLogo = mThis.self.querySelector("#com_btnDeleteLogo");
    mThis.logoPlaceholder = mThis.self.querySelector("#_logo_placeholder");
    mThis.fields = [];

    // ── Helpers ────────────────────────────────────────────────────────────────
    mThis.showLogo = function() {
        mThis.imgLogo.style.display = "block";
        mThis.logoPlaceholder.style.display = "none";
    };

    mThis.hideLogo = function() {
        mThis.imgLogo.style.display = "none";
        mThis.imgLogo.src = "";
        mThis.logoPlaceholder.style.display = "flex";
        // ✅ Restore default placeholder content
        mThis.logoPlaceholder.innerHTML = `
            <i class="fa-regular fa-image cpn-logo-icon"></i>
            <span class="cpn-logo-text">Upload QR code</span>
        `;
    };

    mThis.showPdf = function(fileName) {
        mThis.imgLogo.style.display = "none";
        mThis.logoPlaceholder.style.display = "flex";
        mThis.logoPlaceholder.innerHTML = `
            <i class="fa-regular fa-file-pdf cpn-logo-icon" style="color:#e74c3c; font-size:48px;"></i>
            <span class="cpn-logo-text" style="font-size:12px; margin-top:6px; word-break:break-all; text-align:center;">
                ${fileName}
            </span>
        `;
    };

    // ── Render Data to Card Dashboard View ─────────────────────────────────────
    mThis.renderSummary = data => {
        if (!data) return;

        const rate = data.exchange_rate ?? "—";
        if (mThis.elExchangeRate) {
            mThis.elExchangeRate.textContent =
                rate !== "—" ? `${Number(rate).toLocaleString()} ៛` : "—";
        }

        if (mThis.elRepresentativeName)
            mThis.elRepresentativeName.textContent =
                data.build_representative || "—";
        if (mThis.elRepresentativePhone)
            mThis.elRepresentativePhone.textContent =
                data.representative_phone || "—";
        if (mThis.elRepresentativeAddress)
            mThis.elRepresentativeAddress.textContent =
                data.representative_address || "—";

        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            const field = input.getAttribute("data-field");
            if (field && data[field] !== undefined) {
                input.checked = parseInt(data[field]) === 1;
            } else if (
                field === "show_amount_paid" &&
                data.show_amount_piad !== undefined
            ) {
                input.checked = parseInt(data.show_amount_piad) === 1;
            }
        });
    };

    // ── Load Settings ──────────────────────────────────────────────────────────
  mThis.loadSettings = (onLoaded) => {
    vsapi
        .call([mThis.base_url, "/prm/invoice_setting/get"].join(""), {}, null, null)
        .then((res) => {
            const data = res.status_code === 200 ? (res.data?.settings ?? res.data) : null;
            mThis.renderSummary(data);

            if (data) {
                const qrPath = data.QR_file   ?? null;
                const qrName = data.QR_file_name ?? '';
                const isPdf  = qrName.toLowerCase().endsWith('.pdf');

                if (qrName) {
                    if (isPdf) {
                        mThis.showPdf(qrName);
                    } else {
                        mThis.imgLogo.src = qrPath;
                        mThis.showLogo();
                    }
                } else {
                    mThis.hideLogo();
                }
            }

            if (typeof onLoaded === "function") onLoaded(data);
        });
};
    // ── Init ───────────────────────────────────────────────────────────────────
    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;

        // Exchange Rate Dialog
        mThis.btnEditRate.onclick = e => {
            e.preventDefault();
            mThis.loadSettings(currentData => {
                mThis.exchangeRateDialog.show(currentData);
            });
        };

        // Representative Dialog
        mThis.btnEditRep.onclick = e => {
            e.preventDefault();
            mThis.loadSettings(currentData => {
                mThis.representativeDialog.show(currentData);
            });
        };

        // Toggle switches
        mThis.self.querySelectorAll(".toggle-setting").forEach(input => {
            input.onchange = () => {
                mThis.saveToggleButtons();
            };
        });

        // ── Upload QR ──────────────────────────────────────────────────────────
        mThis.btnChooseLogo.addEventListener("click", function(e) {
            e.preventDefault();
            if (!AuthManager.allowed(259)) return;

            // ✅ Set accept on hidden input before FileChooser opens it
            const fileInput = mThis.self.querySelector("#_logo_file_input");
            if (fileInput) {
                fileInput.accept = "image/*";
            }

            FileChooser.chooseFile(null, d => {
                console.log(12345, d);

                if (!d) return;

                    mThis.imgLogo.src = d.dataUrl;
                    mThis.showLogo();
  

                const payload = {
                    QR_file_name: d.fileName,
                    ext: d.fileType,
                    data: d.base64
                };

                vsapi
                    .call(
                        `${mThis.base_url}/prm/invoice_setting/save-QR`,
                        payload,
                        null,
                        false
                    )
                    .then(res => {
                        if (res.status_code === 200) {
                            console.log(23456789,res);
                            
                            cv_interact.success("QR code has been saved");

                        } else {
                            mThis.hideLogo();
                            cv_interact.warning(
                                res.error_message || "Failed to save QR code"
                            );
                        }
                    });
            });
        });

        // ── Delete QR ──────────────────────────────────────────────────────────
        mThis.btnDeleteLogo.addEventListener("click", function(e) {
            e.preventDefault();
            if (!AuthManager.allowed(259)) return;

            cv_interact.confirm(
                "Delete this QR code?",
                {
                    title: "Delete QR Code",
                    context: "delete"
                },
                confirmed => {
                    if (confirmed) {
                        vsapi
                            .call(
                                `${mThis.base_url}/prm/invoice_setting/delete-QR`,
                                null
                            )
                            .then(res => {
                                if (res.status_code === 200) {
                                    mThis.hideLogo();
                                    cv_interact.success("QR code deleted!");
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    }
                }
            );
        });

        mThis.initAlready = true;
    };

    // ── Show ───────────────────────────────────────────────────────────────────
    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadSettings(null);
    };

    // ── Save Toggle Buttons ────────────────────────────────────────────────────
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
                    const serverData = res.data?.settings ?? res.data;
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

    // ── Dialog: Exchange Rate ──────────────────────────────────────────────────
    const CreateExchangeRateDialog = () => {
        const self = {};
        let dialog = null;

        self.show = currentData => {
            dialog =
                dialog ||
                new GeneralDialog({
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
                    contentCreated: me => {
                        const d = me.dataOptions || {};
                        if (me.controls.exchange_rate) {
                            me.controls.exchange_rate.value =
                                d.exchange_rate ?? "";
                        }
                    },
                    buttons: [
                        {
                            label: '<span vslang="buttons.Cancel"></span>',
                            cssClass: "btn btn-secondary",
                            click: me => {
                                me.hide(false);
                            }
                        },
                        {
                            label: '<span vslang="buttons.Save"></span>',
                            cssClass: "btn btn-primary",
                            click: (me, btn) => {
                                const op = me.getData();
                                vsapi
                                    .call(
                                        [
                                            mThis.base_url,
                                            "/prm/invoice_setting/save"
                                        ].join(""),
                                        op,
                                        btn,
                                        null
                                    )
                                    .then(res => {
                                        if (res.status_code === 200) {
                                            me.hide(true, op);
                                            cv_interact.success(
                                                "Settings updated successfully."
                                            );
                                            mThis.loadSettings(null);
                                        } else {
                                            cv_interact.error(
                                                res.error_message
                                            );
                                        }
                                    });
                            }
                        }
                    ]
                });

            dialog.dataOptions = currentData || {};
            dialog.show();
        };

        return self;
    };

    // ── Dialog: Representative ─────────────────────────────────────────────────
    const CreateRepresentativeDialog = () => {
        const self = {};
        let dialog = null;

        self.show = currentData => {
            dialog =
                dialog ||
                new GeneralDialog({
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
                            <div class="material-input outlined style-main mb-3">
                                <textarea class="data-input form-control" data-field="representative_address" id="representative_address" name="representative_address" placeholder=" "></textarea>
                                <label>Representative Address</label>
                            </div>
                        </div>
                    `
                        ];
                    },
                    onPrepareForm: me => {
                        me.controls.build_representative.value =
                            me.dataOptions.build_representative || "";
                        me.controls.representative_phone.value =
                            me.dataOptions.representative_phone || "";
                        me.controls.representative_address.value =
                            me.dataOptions.representative_address || "";
                    },
                    buttons: [
                        {
                            label: '<span vslang="buttons.Cancel"></span>',
                            cssClass: "btn btn-secondary",
                            click: me => {
                                me.hide(false);
                            }
                        },
                        {
                            label: '<span vslang="buttons.Save"></span>',
                            cssClass: "btn btn-primary",
                            click: (me, btn) => {
                                const op = me.getData();
                                op.id = 1;

                                op.build_representative =
                                    op.build_representative ||
                                    me.dataOptions.build_representative;
                                op.representative_phone =
                                    op.representative_phone ||
                                    me.dataOptions.representative_phone;
                                op.representative_address =
                                    op.representative_address ||
                                    me.dataOptions.representative_address;

                                vsapi
                                    .call(
                                        [
                                            mThis.base_url,
                                            "/prm/invoice_setting/save-invoice-representative"
                                        ].join(""),
                                        op,
                                        btn,
                                        null
                                    )
                                    .then(res => {
                                        if (res.status_code === 200) {
                                            me.hide(true, op);
                                            cv_interact.success(
                                                "Representative information saved successfully."
                                            );
                                            mThis.loadSettings(null);
                                        } else {
                                            cv_interact.error(
                                                res.error_message ||
                                                    "Failed to update information."
                                            );
                                        }
                                    });
                            }
                        }
                    ]
                });

            dialog.dataOptions = currentData || {};
            dialog.show(currentData);
        };

        return self;
    };

    mThis.exchangeRateDialog = CreateExchangeRateDialog();
    mThis.representativeDialog = CreateRepresentativeDialog();

    return mThis;
})();
