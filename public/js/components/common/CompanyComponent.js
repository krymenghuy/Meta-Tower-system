'use strict';
var CompanyComponent = (function(){
    const mThis = {};
	mThis.title_prop = "company_profile";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector('#_main_companyComponent');
    mThis.divScroll = mThis.self.querySelector('#_div_cpn_scroll');
    mThis.btnSave = mThis.self.querySelector('#_main_comp_btnSaveProfile');

	mThis.imgLogo = mThis.self.querySelector('#com_imgLogo');
	mThis.btnChooseLogo = mThis.self.querySelector('#com_btnChooseLogo');
	mThis.btnDeleteLogo = mThis.self.querySelector('#com_btnDeleteLogo');
	mThis.fields = [];

	mThis.displayCompanyInfo = ()=>{
		vsapi.call(`${mThis.base_url}/api/company/details`,false,null,main_view.apiCluster).then(res => {
			if(res.status_code ==200){
				const d = res.data;
				mThis.setData(d);
			}
		});
	}

	// mThis.setScroll = ()=>{
    //     const parent = mThis.divScroll;
    //     parent.style.height = (window.innerHeight - 100)+'px';
    //     parent.classList.add('overflow-y-auto');
    //     parent.classList.add('overflow-x-hidden');
    //     window.onresize = () => {
    //         parent.style.height = (window.innerHeight - 100)+'px';
    //     }
    // }

	//begin:: CompanyComponent.init()
    mThis.init = ()=>{
		if (mThis.initAlready) return;
		//mThis.setScroll();

		mThis.btnSave.addEventListener('click', function(e) {
            e.preventDefault();
            const p = mThis.getData();
            if (!AuthManager.allowed(259)) return;

            vsapi.call(`${mThis.base_url}/api/company/save-details`, p, null).then(res => {
                if (res.status_code === 200) {
                    cv_interact.success('Company information updated!', '', 'info');
                } else {
                    cv_interact.error(res.error_message);
                }
            });
        });

		mThis.self.querySelectorAll('.data-input').forEach(function(e){
			mThis.fields.push({
				element: e,
				dataMember: e.dataset.field
			});
		});

        mThis.btnDeleteLogo.addEventListener('click',function(e){

			e.preventDefault();

			if(!AuthManager.allowed(259)) return;
			cv_interact.confirm('Delete this logo?',{
				title:'Delete Logo',
				context: 'delete'
			},e => {
				if(e){
					vsapi.call(`${mThis.base_url}/api/company/delete-logo`,null).then((res)=> {
						if(res.status_code === 200){
							mThis.imgLogo.prop('src','');
							cv_interact.success('Logo deleted!');
						}
						else
							cv_interact.error(res.error_message );
					});
				}
			});
		});

        mThis.btnChooseLogo.addEventListener('click', function(e) {
            e.preventDefault();

            if (!AuthManager.allowed(259)) return;

            FileChooser.chooseFile(null, d => {
                if (d) {
                    mThis.imgLogo.src = d.dataUrl;

                    let p = {
                        photo_data: d.dataUrl,
                        file_type: d.file_type
                    };

                    console.log(11, JSON.stringify(p, null, 2));

                    vsapi.call(`${main_view.base_url}/api/company/save-logo`, p, null, false).then(res => {
                        if (res.status_code === 200) {
                            let d = res.data;
                            cv_interact.success('Logo has been saved');
                            mThis.imgLogo.src = d.logo_url; // Update image from server
                        } else {
                            cv_interact.warning(res.error_message);
                        }
                    });
                }
            });
        });


		mThis.initAlready = true;
    }
    //end:: CompanyComponent.init()

    mThis.show = (option)=>{
		mThis.init(); //init one time only
		if(!option) option = {};
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.displayCompanyInfo();
    }

    mThis.hide = () => {
        mThis.self.hide();
    }

    mThis.setData = function(com) {
        let i = 0, c;
        console.log(123, com);

        do {
            c = mThis.fields[i];
            if (!c) break;

            const el = c.element; // DOM element
            const value = com[c.dataMember] ?? '';

            if (el.tagName === 'IMG') {
                el.src = com.logo_url ?? '';
            } else if (el.tagName === 'SELECT') {
                el.value = value;
                el.dispatchEvent(new Event('change')); // trigger change event manually
            } else {
                el.value = value;
            }

            i++;
        } while (c);
    };


	//NOTE: getData() does NOT include logo data with its returned object.
	mThis.getData = function() {
        let i = 0, c;
        let d = {};

        do {
            c = mThis.fields[i];
            if (!c) break;

            const el = c.element;

            // If it's an input/select/textarea, get the value
            if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
                d[c.dataMember] = el.value;
            } else if (el.tagName === 'IMG') {
                d[c.dataMember] = el.src;
            } else {
                d[c.dataMember] = '';
            }

            i++;
        } while (c);

        // Clean up phone numbers
        ['phone_number', 'first_cp_phone'].forEach(key => {
            if (d[key]) {
                d[key] = d[key].replace(/\D/g, '').trim();
            } else {
                d[key] = '';
            }
        });

        return d;
    };

	return mThis;
})();

