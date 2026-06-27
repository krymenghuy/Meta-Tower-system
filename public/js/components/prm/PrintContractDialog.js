"use strict";
const CreateContractDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    ` <div class="row g-3 justify-content-start">
                        <!-- Left Column (Original) -->
                        <div class="col-md-6">
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
                                            <input type="text" name="position" class="data-input form-control form_input" data-field="position" placeholder=" " />
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
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <h6 class="mb-3 text-golden" vslang="labels.Owner Details">Owner Details</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input name="com_rep_name" class="data-input form-control" data-field="com_rep_name" placeholder=" " />
                                            <label vslang="labels.Company Representative">Company Representative</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <select data-style="material" name="com_rep_sex" class="data-input form-control" data-field="com_rep_sex" placeholder="${LocaleManager.trans("Gender", "labels")}">
                                            <option value="M">${LocaleManager.trans("Male", "labels")}</option>
                                            <option value="F">${LocaleManager.trans("Female", "labels")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
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
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="com_rep_position" class="data-input form-control form_input" data-field="com_rep_position" placeholder=" " value="Company Representative" />
                                            <label vslang="labels.Position"></label>
                                        </div>
                                    </div>
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
                        <div class="col-md-6">
                            <div class="p-3 bg-white border rounded shadow-sm mb-3">
                                <h6 class="mb-3 text-golden" vslang="labels.Objective"></h6>
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

                            <div class="p-3 bg-white border rounded shadow-sm mb-3">
                                <h6 class="mb-3 text-golden" vslang="labels.Rental Price and Lease Period"></h6>
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

                            <div class="p-3 bg-white border rounded shadow-sm mb-3">
                                <h6 class="mb-3 text-golden" vslang="labels.Payment Terms"></h6>
                                <div class="row g-3 justify-content-center">
                                    
                                    <div class="col-12">
                                        <div class="vs-material-field">
                                            <input type="text" name="deposit" class="data-input form-control" data-field="deposit" disabled placeholder=" "></input>
                                            <label vslang="labels.Deposit">Deposit</label>
                                        </div>
                                        <div class="mt-2 p-2 bg-light border rounded text-muted" id="deposit_agreement_preview" style="font-size: 0.82rem; line-height: 1.4; border-left: 3px solid #bda25c !important;">
                                            Loading deposit terms...
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                </div>`,
                ].join("");
            },
            contentCreated:(me)=>{
                if (typeof DateTimePicker !== 'undefined' && typeof DateTimePicker.initAll === 'function') {
                    DateTimePicker.initAll(me.divModal);
                }
                const calculateDuration = (startVal, endVal) => {
                    const startInput = me.divModal.querySelector('input[name="start_date"]:not([disabled])') || me.divModal.querySelector('input[name="start_date"]');
                    const endInput = me.divModal.querySelector('input[name="end_date"]:not([disabled])') || me.divModal.querySelector('input[name="end_date"]');
                    const durationInput = me.divModal.querySelector('[name="duration"]');
                    
                    if (!startInput || !endInput || !durationInput) return;
                    
                    if (startVal === undefined) startVal = startInput.value;
                    if (endVal === undefined) endVal = endInput.value;
                    
                    if (startVal && endVal) {
                        const start = new Date(startVal);
                        const end = new Date(endVal);
                        
                        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                            // Add 1 day to end date to include the last day
                            const endWithOffset = new Date(end);
                            endWithOffset.setDate(endWithOffset.getDate() + 1);
                            
                            let years = endWithOffset.getFullYear() - start.getFullYear();
                            let months = endWithOffset.getMonth() - start.getMonth();
                            let diffMonths = years * 12 + months;
                            
                            if (endWithOffset.getDate() < start.getDate()) {
                                diffMonths--;
                            }
                            if (diffMonths < 0) diffMonths = 0;
                            
                            const formatted = diffMonths + ' ខែ';
                            durationInput.value = formatted;
                            
                            // Also update lease_term if present
                            const leaseTermInput = me.divModal.querySelector('[name="lease_term"]');
                            if (leaseTermInput) {
                                leaseTermInput.value = formatted;
                            }
                        } else {
                            durationInput.value = '';
                        }
                    } else {
                        durationInput.value = '';
                    }
                };

                const numberToEnglishWords = (amount) => {
                    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                        'Seventeen', 'Eighteen', 'Nineteen'];
                    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
                    
                    if (amount === 0) return 'Zero';
                    
                    const dollars = Math.floor(amount);
                    
                    const toWords = (n) => {
                        if (n === 0) return '';
                        if (n < 20) return ones[n] + ' ';
                        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '') + ' ';
                        return ones[Math.floor(n / 100)] + ' Hundred ' + toWords(n % 100);
                    };
                    
                    const millions = Math.floor(dollars / 1000000);
                    const thousands = Math.floor((dollars % 1000000) / 1000);
                    const remainder = dollars % 1000;
                    
                    let result = '';
                    if (millions > 0) result += toWords(millions) + 'Million ';
                    if (thousands > 0) result += toWords(thousands) + 'Thousand ';
                    if (remainder > 0) result += toWords(remainder);
                    
                    return result.trim();
                };

                const convertToKhmerNumerals = (num) => {
                    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
                    return String(num).split('').map(digit => khmerDigits[parseInt(digit)] || digit).join('');
                };

                const convertToKhmerWords = (number) => {
                    const ones = ['', 'មួយ', 'ពីរ', 'បី', 'បួន', 'ប្រាំ', 'ប្រាំមួយ', 'ប្រាំពីរ', 'ប្រាំបី', 'ប្រាំបួន'];
                    
                    number = parseInt(String(number).replace(/,/g, '')) || 0;
                    if (number === 0) return 'សូន្យ';
                    
                    const convertBelow1000 = (num) => {
                        let res = '';
                        const hundreds = Math.floor(num / 100);
                        if (hundreds > 0) {
                            res += ones[hundreds] + 'រយ';
                            num %= 100;
                        }
                        
                        const tens = Math.floor(num / 10);
                        if (tens > 0) {
                            if (tens === 1) {
                                res += 'ដប់';
                            } else {
                                res += ones[tens] + 'សិប';
                            }
                            num %= 10;
                        }
                        
                        if (num > 0) {
                            res += ones[num];
                        }
                        return res;
                    };
                    
                    let result = '';
                    const millions = Math.floor(number / 1000000);
                    if (millions > 0) {
                        result += convertToKhmerWords(millions) + 'លាន';
                        number %= 1000000;
                    }
                    
                    const thousands = Math.floor(number / 1000);
                    if (thousands > 0) {
                        result += convertBelow1000(thousands) + 'ពាន់';
                        number %= 1000;
                    }
                    
                    if (number > 0) {
                        result += convertBelow1000(number);
                    }
                    
                    return result.trim();
                };

                const updateDepositDescription = (priceVal, depositVal) => {
                    const priceInput = me.divModal.querySelector('[name="price_per_month"]');
                    const depositInput = me.divModal.querySelector('[name="deposit"]');
                    const previewDiv = me.divModal.querySelector('#deposit_agreement_preview');
                    
                    if (!priceInput || !depositInput || !previewDiv) return;
                    
                    if (priceVal === undefined) {
                        priceVal = parseFloat(priceInput.value.replace(/[^0-9.]/g, '')) || 0;
                    }
                    if (depositVal === undefined) {
                        depositVal = parseFloat(depositInput.value.replace(/[^0-9.]/g, '')) || 0;
                    }
                    
                    if (priceVal > 0 && depositVal > 0) {
                        const ratio = Math.round(depositVal / priceVal);
                        
                        // English
                        const numberWords = [
                            'zero (0)', 'one (1)', 'two (2)', 'three (3)', 'four (4)', 'five (5)',
                            'six (6)', 'seven (7)', 'eight (8)', 'nine (9)', 'ten (10)',
                            'eleven (11)', 'twelve (12)'
                        ];
                        const ratioWord = ratio < numberWords.length ? numberWords[ratio] : `${ratio} (${ratio})`;
                        
                        const formattedDeposit = new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }).format(depositVal);
                        
                        const depositWords = numberToEnglishWords(depositVal);
                        const enDesc = `The Tenant agrees to pay ${ratioWord} months security deposit in advance of rental price which is equal to $${formattedDeposit} (${depositWords} United States Dollars) to guarantee the lease.`;
                        
                        // Khmer
                        const ratioKhmer = convertToKhmerNumerals(ratio);
                        const depositKhmerWords = convertToKhmerWords(depositVal);
                        const khDesc = `ភតិកៈយល់ព្រមបង់ប្រាក់កក់ចំនួន ${ratioKhmer} ខែ ជាមុន នៃតម្លៃជួល ដែលស្មើនឹង $${formattedDeposit}(${depositKhmerWords}ដុល្លារសហរដ្ឋអាមេរិក) ដើម្បីធានាទៅលើការជួល។`;
                        
                        previewDiv.innerHTML = `
                            <div style="font-family: 'Inter', sans-serif; font-size: 0.82rem; color: #555;">
                                <strong style="color: #bda25c;">Deposit Rule:</strong> ${enDesc}
                            </div>
                            <div class="mt-2" style="font-family: 'Noto Sans Khmer', 'Battambang', sans-serif; font-style: normal; font-weight: normal; font-size: 0.85rem; color: #2B2F3C; border-top: 1px dashed #ddd; padding-top: 8px;">
                                <strong style="color: #bda25c;">លក្ខខណ្ឌប្រាក់កក់:</strong> ${khDesc}
                            </div>
                        `;
                     } else {
                        previewDiv.innerHTML = 'Rental price or deposit value not specified.';
                    }
                };

                const inputs = me.divModal.querySelectorAll('.data-input');
                inputs.forEach(input => {
                    const syncValues = (e) => {
                        const target = e.target;
                        const fieldName = target.getAttribute('name');
                        if (!fieldName) return;
                        
                        // Sync duplicate names
                        const peers = me.divModal.querySelectorAll(`[name="${fieldName}"]`);
                        peers.forEach(peer => {
                            if (peer !== target && peer.value !== target.value) {
                                peer.value = target.value;
                            }
                        });
                        
                        if (fieldName === 'start_date' || fieldName === 'end_date') {
                            calculateDuration();
                        }
                        if (fieldName === 'price_per_month' || fieldName === 'deposit' || fieldName === 'monthly_price' || fieldName === 'price') {
                            updateDepositDescription();
                        }
                    };
                    input.addEventListener('input', syncValues);
                    input.addEventListener('change', syncValues);
                });
                
                me.calculateDuration = calculateDuration;
                me.updateDepositDescription = updateDepositDescription;
                
                setTimeout(() => {
                    calculateDuration();
                    updateDepositDescription();
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
            prepareFormOptions:{
                modifyTitle:"vslang:titles.Prepare Print Contract",
                createTitle:"vslang:titles.Print Contract",
                targetProp:"contractInfo",
               api: {
                endpoint: [
                    main_view.base_url,
                    "/prm/tenant/contract-form-option",
                ].join(""),
                params: (me,op) => {
                    // console.log(444,op);
                    return { id: op.id,tenant_id:op.tenant_id};
                },
            },
            },
            onPrepareForm:(me,data)=>{
            //   console.log(5555,data);
 
              me.dataOptions.tenant_id = data.contractInfo.id;
              
              // Sync loaded data from left elements to right elements
              const leftInputs = me.divModal.querySelectorAll('.data-input:not([name$="_right"])');
              leftInputs.forEach(leftInput => {
                  const name = leftInput.getAttribute('name');
                  if (name) {
                      const rightInput = me.divModal.querySelector(`[name="${name}_right"]`);
                      if (rightInput) {
                          rightInput.value = leftInput.value;
                          rightInput.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                  }
              });

              // Run calculations immediately using server data to avoid any delay from inputs population
              const info = data.contractInfo || {};
              const initialPrice = parseFloat(info.price) || 0;
              const initialDeposit = parseFloat(info.deposit) || 0;
              
              if (typeof me.calculateDuration === 'function') {
                  me.calculateDuration(info.start_date, info.end_date);
              }
              if (typeof me.updateDepositDescription === 'function') {
                  me.updateDepositDescription(initialPrice, initialDeposit);
              }
            },

            buttons:[
               {
                 label:'<span vslang="buttons.Cancel"></span>',
                 cssClass:"btn btn-secondary",
                 click:(me)=>{
                    me.hide(false);
                 }
               },
               {
                label:'<span vslang="buttons.Print"></span>',
                cssClass:"btn btn-primary",
                click:(me)=>{
                let op = me.getData();
                op.id= me.dataOptions.tenant_id;
                console.log(555555,op);

                const queryString = new URLSearchParams(op).toString();
                main_view.getEncryptData(queryString,d=>{
                    const url = `${main_view.base_url}/create-contract/${d}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                     me.hide(true, op);
                });



                }
              }
            ],

         });

        dialog.show(op);
     }

   return self;
})();
