"use strict";
const CreateContractDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        ` <div class="row g-3 justify-content-start">
                        <!-- Left Column (Original) -->
                        <div class="col-md-6 d-flex flex-column">
                            <div class="p-3 bg-white border rounded shadow-sm mb-3">
                                <h6 class="mb-3 text-golden" vslang="labels.Tenant Details">Tenant Details</h6>
                                <div class="row g-3 justify-content-center">
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="name" class="data-input form-control" data-field="name" disabled placeholder="" />
                                            <label vslang="labels.Tenant">Tenant</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <select data-style="material" name="sex" class="data-input form-control" data-field="sex" placeholder="${LocaleManager.trans("Gender", "labels")}">
                                            <option value="M">${LocaleManager.trans("Male", "labels")}</option>
                                            <option value="F">${LocaleManager.trans("Female", "labels")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="date_of_birth" class="data-input form-control form_input" disabled data-field="date_of_birth" placeholder=" " />
                                            <label vslang="labels.Date of Birth">Date of Birth</label>
                                        </div>
                                    </div>
                                    <!-- <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="legal_name" class="data-input form-control" data-field="legal_name" disabled placeholder=" " />
                                            <label vslang="labels.Legal Name">Legal Name</label>
                                        </div>
                                    </div> -->
                                    <div class="col-md-6">
                                        <select data-style="material" name="nationality_id" class="data-input form-control" data-field="nationality_id" disabled placeholder="${LocaleManager.trans("Nationality", "labels")}"></select>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="national_id" class="data-input form-control" data-field="national_id" disabled placeholder=" " />
                                            <label vslang="labels.National ID"></label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="nid_issue_date" class="data-input form-control form_input" data-field="nid_issue_date" disabled placeholder=" " />
                                            <label vslang="labels.Issue Date"></label>
                                        </div>
                                    </div>
                                    <div class="col-6 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="lease_term" class="data-input form-control form_input" data-field="lease_term" disabled placeholder=" " />
                                            <label vslang="labels.Duration">Duration</label>
                                        </div>
                                    </div>
                                    
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" disabled placeholder=" " />
                                            <label vslang="labels.Start Date">Start Date</label>
                                        </div>
                                    </div>
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" disabled placeholder=" " />
                                            <label vslang="labels.End Date">End Date</label>
                                        </div>
                                    </div>
                                     <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="space_code" class="data-input form-control form_input" data-field="space_code" disabled placeholder=" " />
                                            <label vslang="labels.Unit Code"></label>
                                        </div>
                                    </div>
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="monthly_price" class="data-input form-control form_input" data-field="monthly_price" disabled placeholder=" " />
                                            <label vslang="labels.Monthly Price">Monthly Price</label>
                                        </div>
                                    </div>
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="deposit" class="data-input form-control form_input" data-field="deposit" disabled placeholder=" " />
                                            <label vslang="labels.Deposit">Deposit</label>
                                        </div>
                                    </div>
                                    
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="position" class="data-input form-control form_input" data-field="tenant_position" placeholder=" " />
                                            <label vslang="labels.Position"></label>
                                        </div>
                                    </div>
                                    
                                    <div class="col-12 pt-2">
                                        <div class="vs-material-field">
                                            <textarea name="address" class="data-input form-control" data-field="address" rows="3" disabled placeholder=" "></textarea>
                                            <label vslang="labels.Current Address">Current Address</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="p-3 bg-white border rounded shadow-sm flex-grow-1">
                                <h6 class="mb-3 text-golden" vslang="labels.Owner Details">Owner Details</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input name="com_rep_name" class="data-input form-control" data-field="com_rep_name" placeholder=" " />
                                            <label vslang="labels.Company Representative">Company Representative</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <select data-style="material" name="com_rep_sex" class="data-input form-control" data-field="com_rep_sex" placeholder="${LocaleManager.trans("Gender", "labels")}">
                                            <option value="M">${LocaleManager.trans("Male", "labels")}</option>
                                            <option value="F">${LocaleManager.trans("Female", "labels")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="com_rep_dob" class="data-input form-control form_input" disabled data-field="com_rep_dob" placeholder=" " />
                                            <label vslang="labels.Date of Birth">Date of Birth</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="com_rep_nationality" class="data-input form-control" data-field="com_rep_nationality" placeholder=" " value="Khmer" />
                                            <label vslang="labels.Nationality">Nationality</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="com_rep_national_id" class="data-input form-control" data-field="com_rep_nid" disabled placeholder=" " />
                                            <label vslang="labels.National ID">National ID</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="com_rep_nid_issue_date" class="data-input form-control form_input" data-field="com_rep_nid_issue_date" disabled placeholder=" " />
                                            <label vslang="labels.Issue Date"></label>
                                        </div>
                                    </div>
                                    <!-- <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="first_cp_position" class="data-input form-control form_input" data-field="first_cp_position" placeholder=" " value="Company Representative" />
                                            <label vslang="labels.Position"></label>
                                        </div>
                                    </div> -->
                                    <div class="col-12 pt-2">
                                        <div class="vs-material-field">
                                            <textarea name="com_rep_address" class="data-input form-control" data-field="com_rep_address" rows="3" disabled placeholder=" "></textarea>
                                            <label vslang="labels.Current Address">Current Address</label>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>


                        <!-- Right Column -->
                        <div class="col-md-6 d-flex flex-column">
                            <div class="p-3 bg-white border rounded shadow-sm flex-grow-1">
                                <h6 class="mb-3 text-golden border-bottom pb-2 text-uppercase fw-bold" vslang="labels.Lease Terms and Conditions">LEASE TERMS AND CONDITIONS</h6>
                                
                                <!-- Objective Section -->
                                <div class="mb-4">
                                    <h6 class="mb-3 text-golden" style="font-size: 0.85rem;" vslang="labels.Objective"></h6>
                                    <div class="row g-3 justify-content-center">
                                        <div class="col-6">
                                             <div class="vs-material-field">
                                                 <input type="text" name="space_code" class="data-input form-control form_input" data-field="space_code" disabled placeholder=" " />
                                                 <label vslang="labels.Unit Code">Unit Code</label>
                                             </div>
                                         </div>
                                         <div class="col-6">
                                             <div class="vs-material-field">
                                                 <input type="text" name="floor_name" class="data-input form-control form_input" data-field="floor_name" disabled placeholder=" " />
                                                 <label vslang="labels.Floor">Floor</label>
                                             </div>
                                         </div>
                                        <div class="col-12 pt-2">
                                            <div class="vs-material-field">
                                                <textarea name="address_kh" class="data-input form-control" data-field="address_kh" rows="3" disabled placeholder=" "></textarea>
                                                <label vslang="labels.Building Address">Building Address</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Rental Price and Lease Period Section -->
                                <div class="mb-4 border-top pt-3">
                                    <h6 class="mb-3 text-golden" style="font-size: 0.85rem;" vslang="labels.Rental Price and Lease Period"></h6>
                                    <div class="row g-3 justify-content-center">
                                        <div class="col-6">
                                            <div class="vs-material-field">
                                                <input type="text" name="price_per_month" class="data-input form-control form_input" data-field="price" disabled placeholder=" "  />
                                                <label vslang="labels.Rental Price">Rental Price</label>
                                            </div>    
                                        </div>
                                        <div class="col-6">
                                            <div class="vs-material-field">
                                                <input type="text" name="duration" class="data-input form-control form_input" data-field="duration" disabled placeholder=" "  />
                                                <label vslang="labels.Lease Period"></label>
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

                                <!-- Payment Terms Section -->
                                <div class="border-top pt-3">
                                    <h6 class="mb-3 text-golden" style="font-size: 0.85rem;" vslang="labels.Payment Terms"></h6>
                                    <div class="row g-3 justify-content-center">
                                         <div class="col-12">
                                             <div class="vs-material-field">
                                                 <input type="text" name="deposit" class="data-input form-control" data-field="deposit" disabled placeholder=" "></input>
                                                 <label vslang="labels.Deposit">Deposit</label>
                                             </div>
                                             <div id="deposit_agreement_preview" class="mt-3 p-3 bg-light border rounded text-muted d-flex align-items-start" style="border-left: 4px solid #d1d5db;">
                                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2 mt-0.5 flex-shrink-0">
                                                     <circle cx="12" cy="12" r="10"></circle>
                                                     <line x1="12" y1="8" x2="12" y2="12"></line>
                                                     <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                                 </svg>
                                                 <div style="font-size: 0.82rem; line-height: 1.4; font-family: 'Inter', sans-serif; color: #64748b;">
                                                     Upon execution of this Lease Agreement the Tenant shall pay a security deposit equal to three (3) times the monthly rental amount.
                                                     The security deposit shall serve as security for the Tenant's full and faithful performance of all obligations, convenants, and conditions 
                                                     contained in this Lease Agreement.
                                                 </div>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    if (
                        typeof DateTimePicker !== "undefined" &&
                        typeof DateTimePicker.initAll === "function"
                    ) {
                        DateTimePicker.initAll(me.divModal);
                    }
                    const calculateDuration = (startVal, endVal) => {
                        const startInput =
                            me.divModal.querySelector(
                                'input[name="start_date"]:not([disabled])',
                            ) ||
                            me.divModal.querySelector(
                                'input[name="start_date"]',
                            );
                        const endInput =
                            me.divModal.querySelector(
                                'input[name="end_date"]:not([disabled])',
                            ) ||
                            me.divModal.querySelector('input[name="end_date"]');
                        const durationInput =
                            me.divModal.querySelector('[name="duration"]');

                        if (!startInput || !endInput || !durationInput) return;

                        if (startVal === undefined) startVal = startInput.value;
                        if (endVal === undefined) endVal = endInput.value;

                        if (startVal && endVal) {
                            const start = new Date(startVal);
                            const end = new Date(endVal);

                            if (
                                !isNaN(start.getTime()) &&
                                !isNaN(end.getTime())
                            ) {
                                // Add 1 day to end date to include the last day
                                const endWithOffset = new Date(end);
                                endWithOffset.setDate(
                                    endWithOffset.getDate() + 1,
                                );

                                let years =
                                    endWithOffset.getFullYear() -
                                    start.getFullYear();
                                let months =
                                    endWithOffset.getMonth() - start.getMonth();
                                let diffMonths = years * 12 + months;

                                if (endWithOffset.getDate() < start.getDate()) {
                                    diffMonths--;
                                }
                                if (diffMonths < 0) diffMonths = 0;

                                const formatted = diffMonths + " ខែ";
                                durationInput.value = formatted;

                                // Also update lease_term if present
                                const leaseTermInput =
                                    me.divModal.querySelector(
                                        '[name="lease_term"]',
                                    );
                                if (leaseTermInput) {
                                    leaseTermInput.value = formatted;
                                }
                            } else {
                                durationInput.value = "";
                            }
                        } else {
                            durationInput.value = "";
                        }
                    };



                    const inputs = me.divModal.querySelectorAll(".data-input");
                    inputs.forEach((input) => {
                        const syncValues = (e) => {
                            const target = e.target;
                            const fieldName = target.getAttribute("name");
                            if (!fieldName) return;

                            // Sync duplicate names
                            const peers = me.divModal.querySelectorAll(
                                `[name="${fieldName}"]`,
                            );
                            peers.forEach((peer) => {
                                if (
                                    peer !== target &&
                                    peer.value !== target.value
                                ) {
                                    peer.value = target.value;
                                }
                            });

                            if (
                                fieldName === "start_date" ||
                                fieldName === "end_date"
                            ) {
                                calculateDuration();
                            }
                        };
                        input.addEventListener("input", syncValues);
                        input.addEventListener("change", syncValues);
                    });

                    me.calculateDuration = calculateDuration;

                    setTimeout(() => {
                        calculateDuration();
                    }, 300);
                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationalities",
                        textField: "nationality",
                        valueField: "id",
                    },
                    {
                        name: "nationality_id_right",
                        data: "nationalities",
                        textField: "nationality",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    modifyTitle: "vslang:titles.Prepare Print Contract",
                    createTitle: "vslang:titles.Print Contract",
                    targetProp: "contractInfo",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/tenant/contract-form-option",
                        ].join(""),
                        params: (me, op) => {
                            // console.log(444,op);
                            return { id: op.id, tenant_id: op.tenant_id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    //   console.log(5555,data);

                    me.dataOptions.tenant_id = data.contractInfo.id;

                    // Sync loaded data from left elements to right elements
                    const leftInputs = me.divModal.querySelectorAll(
                        '.data-input:not([name$="_right"])',
                    );
                    leftInputs.forEach((leftInput) => {
                        const name = leftInput.getAttribute("name");
                        if (name) {
                            const rightInput = me.divModal.querySelector(
                                `[name="${name}_right"]`,
                            );
                            if (rightInput) {
                                rightInput.value = leftInput.value;
                                rightInput.dispatchEvent(
                                    new Event("change", { bubbles: true }),
                                );
                            }
                        }
                    });

                    // Run calculations immediately using server data to avoid any delay from inputs population
                    const info = data.contractInfo || {};

                    if (typeof me.calculateDuration === "function") {
                        me.calculateDuration(info.start_date, info.end_date);
                    }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Print"></span>',
                        cssClass: "btn btn-primary",
                        click: (me) => {
                            const positionInput = me.divModal.querySelector('input[name="position"]');
                            if (positionInput && !positionInput.value.trim()) {
                                const isKhmer = typeof LocaleManager !== 'undefined' && (LocaleManager.lang === 'kh' || LocaleManager.lang === 'km');
                                const msg = isKhmer 
                                    ? "សូមបញ្ចូលតួនាទី។" 
                                    : "Please enter the position.";
                                if (typeof cv_interact !== 'undefined' && cv_interact.error) {
                                    cv_interact.error(msg);
                                } else {
                                    alert(msg);
                                }
                                positionInput.focus();
                                return;
                            }

                            let op = me.getData();
                            op.id = me.dataOptions.tenant_id;
                            // console.log(555555, op);

                            const queryString = new URLSearchParams(
                                op,
                            ).toString();
                            main_view.getEncryptData(queryString, (d) => {
                                const url = `${main_view.base_url}/create-contract/${d}`;
                                window.open(
                                    url,
                                    "_blank",
                                    "noopener,noreferrer",
                                );
                                me.hide(true, op);
                            });
                        },
                    },
                ],
            });

        dialog.show(op);
    };

    return self;
})();
