'use strict';
var CompanyComponent = new function () {
	let mThis = this;
	this.title_prop = "Company Profile";
	this.base_url = $('#__base_url').val();
	this.self = $('#_main_companyComponent');
	this.btnSave = $('#_main_comp_btnSaveProfile');

	this.imgLogo = $('#com_imgLogo');
	this.btnChooseLogo = $('#com_btnChooseLogo');
	this.btnDeleteLogo = $('#com_btnDeleteLogo');
	this.fields = [];

	this.btnSave.on('click', function (e) {
		let p = mThis.getData();

		vsapi.call(`${main_view.base_url}/api/company/save-profile`, p).then(res => {
			if(res.status_code === 200) {
				cv_interact.info('Company information updated!');
			}
			else cv_interact.error(res.error_message);
		});
	});

	this.displayCompanyInfo = () => {
		vsapi.call(`${main_view.base_url}/api/company/profile`, null).then(res => {
			if (res.status_code === 200) {
				let d = StringSanitizer.sanitizeObject(res.data, ['email']);
				mThis.setData(d);
			}
		});
	}

	this.init = () => {
		mThis.self.find('.data-input').each(function () {
			mThis.fields.push({ "element": $(this), "dataMember": $(this).data('field') });
		});
        
		this.btnDeleteLogo.off('click').on('click', function (e) {
			e.preventDefault();
			cv_interact.confirm('Delete this logo?', { title: 'Delete Logo', context: 'delete' }, function (e) {
				if (e) {
					vsapi.call(`${main_view.base_url}/api/company/delete-logo`, null).then(res => {
						if (res.status_code === 200) {
							mThis.imgLogo.prop('src', null);
							cv_interact.info('Logo deleted!');
						}
						else cv_interact.error(res.error_message);
					});
				}
			});
		});

		this.btnChooseLogo.off('click').on('click', function (e) {
			e.preventDefault();
			FileChooser.chooseFile({accept:`image/.*`}, data=>{
				if(data){
					mThis.imgLogo.prop('src',data.dataUrl);
					let p ={'fileType':data.ext,'photo':data.dataUrl};
					vsapi.call(`${main_view.base_url}/api/company/save-logo`, p).then(res => {
						if (res.status_code === 200) {
							mThis.imgLogo.prop('src', data.dataUrl);
							cv_interact.info('Logo uploaded');
						}
						else cv_interact.error(res.error_message);
						mThis.logoFileChooser.val(null);
					});
				}
			});
		});
	}

	this.show = (option) => {
		if(!option) option = {};
		main_view.setTitle(mThis.title_prop);
		mThis.displayCompanyInfo();
		mThis.self.show().siblings().hide();
	}

	this.hide = () => {
		mThis.self.hide();
	}

	this.setData = function (com) {
		var i = 0, c;
		do {
			c = mThis.fields[i];
			if (!c) break;
			if (com.hasOwnProperty(c.dataMember)) c.element.val(com[c.dataMember]);
			i++;
		} while (c);
		mThis.displayLogo();
	};

	this.displayLogo = function () {
		vsapi.call(`${main_view.base_url}/api/company/logo`, null).then(res => {
			let d = res.data;
			mThis.imgLogo.prop('src', d);
		});
	}

	this.getData = function () {
		var i = 0, c;
		var d = {};
		do{
			c = mThis.fields[i];
			if (!c) break;
			d[c.dataMember] = c.element.val();
			i++;
		} while (c);
		return d;
	};
}

window.addEventListener('DOMContentLoaded', () => {
	CompanyComponent.init();
});