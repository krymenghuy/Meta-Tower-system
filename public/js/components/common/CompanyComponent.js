'use strict';
var CompanyComponent = (function(){
    const mThis = {};
    mThis.title_prop = "Company Profile";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector('#_main_companyComponent');
    mThis.divScroll = mThis.self.querySelector('#_div_cpn_scroll');
    mThis.btnSave = mThis.self.querySelector('#_main_comp_btnSaveProfile');

    mThis.imgLogo = mThis.self.querySelector('#com_imgLogo');
    mThis.btnChooseLogo = mThis.self.querySelector('#com_btnChooseLogo');
    mThis.btnDeleteLogo = mThis.self.querySelector('#com_btnDeleteLogo');
    mThis.logoPlaceholder = mThis.self.querySelector('#_logo_placeholder'); // ✅ cache it once
    mThis.fields = [];


        mThis.showLogo = function() {
            console.log(222);
            
            mThis.imgLogo.style.display = 'block';
            mThis.logoPlaceholder.style.display = 'none';
        };

        mThis.hideLogo = function() {
            console.log(111);
            
            mThis.imgLogo.style.display = 'none';
            mThis.imgLogo.src = '';
            mThis.logoPlaceholder.style.display = 'flex';
        };

    // ─── Load company info ────────────────────────────────────────────────────
    mThis.displayCompanyInfo = () => {
        vsapi.call(`${mThis.base_url}/api/company/details`, false, null, main_view.apiCluster).then(res => {
            if (res.status_code == 200) {
                mThis.setData(res.data);
            }
        });
    };

    // ─── setData ──────────────────────────────────────────────────────────────
    mThis.setData = function(com) {
        let i = 0, c;

        do {
            c = mThis.fields[i];
            if (!c) break;

            const el = c.element;
            const value = com[c.dataMember] ?? '';

            if (el.tagName === 'IMG') {
                const logoUrl = com.logo_url ?? '';
                if (logoUrl && logoUrl !== '') {
                    el.src = logoUrl;
                    mThis.showLogo(); // ✅ Has logo → show image, hide placeholder
                } else {
                    mThis.hideLogo(); // ✅ No logo → hide image, show placeholder
                }
            } else if (el.tagName === 'SELECT') {
                el.value = value;
                el.dispatchEvent(new Event('change'));
            } else {
                el.value = value;
            }

            i++;
        } while (c);
    };

    // ─── getData ──────────────────────────────────────────────────────────────
    mThis.getData = function() {
        let i = 0, c;
        let d = {};

        do {
            c = mThis.fields[i];
            if (!c) break;

            const el = c.element;

            if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
                d[c.dataMember] = el.value;
            } else if (el.tagName === 'IMG') {
                d[c.dataMember] = el.src;
            } else {
                d[c.dataMember] = '';
            }

            i++;
        } while (c);

        ['phone_number', 'first_cp_phone'].forEach(key => {
            d[key] = d[key] ? d[key].replace(/\D/g, '').trim() : '';
        });

        return d;
    };

    // ─── init ─────────────────────────────────────────────────────────────────
    mThis.init = () => {
        if (mThis.initAlready) return;

        // Collect all data-input fields
        mThis.self.querySelectorAll('.data-input').forEach(function(e) {
            mThis.fields.push({
                element: e,
                dataMember: e.dataset.field
            });
        });

        // Save profile
        mThis.btnSave.addEventListener('click', function(e) {
            e.preventDefault();
            if (!AuthManager.allowed(209)) return;
            const p = mThis.getData();
            vsapi.call(`${mThis.base_url}/api/company/save-details`, p, null).then(res => {
                if (res.status_code === 200) {
                    cv_interact.success('Company information updated!', '', 'info');
                } else {
                    cv_interact.error(res.error_message);
                }
            });
        });

        // Upload logo
        mThis.btnChooseLogo.addEventListener('click', function(e) {
            e.preventDefault();
            if (!AuthManager.allowed(259)) return;

            FileChooser.chooseFile(null, d => {
                if (d) {
                    mThis.imgLogo.src = d.dataUrl;
                    mThis.showLogo(); // ✅ Show image, hide placeholder

                    let p = {
                        photo_data: d.dataUrl,
                        file_type: d.file_type
                    };

                    vsapi.call(`${mThis.base_url}/api/company/save-logo`, p, null, false).then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('Logo has been saved');
                            mThis.imgLogo.src = res.data.logo_url; // ✅ Update to server URL
                        } else {
                            mThis.hideLogo(); // ✅ Revert on failure
                            cv_interact.warning(res.error_message || 'Failed to save logo');
                        }
                    });
                }
            });
        });

        // Delete logo
        mThis.btnDeleteLogo.addEventListener('click', function(e) {
            e.preventDefault();
            if (!AuthManager.allowed(259)) return;

            cv_interact.confirm('Delete this logo?', {
                title: 'Delete Logo',
                context: 'delete'
            }, confirmed => {
                if (confirmed) {
                    vsapi.call(`${mThis.base_url}/api/company/delete-logo`, null).then((res) => {
                        if (res.status_code === 200) {
                            mThis.hideLogo(); // ✅ Hide image, show placeholder
                            cv_interact.success('Logo deleted!');
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });
        });

        mThis.initAlready = true;
    };

    // ─── show / hide ──────────────────────────────────────────────────────────
    mThis.show = (option) => {
        mThis.init();
        if (!option) option = {};
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.displayCompanyInfo();
    };

    mThis.hide = () => {
        mThis.self.hide();
    };

    return mThis;
})();