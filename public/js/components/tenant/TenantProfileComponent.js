"use strict";

var TenantProfileComponent = (() => {
    const mThis = {};
    const PLACEHOLDER_IMG = `${main_view.base_url}/assets/images/default/placeholder.svg`;

    mThis.title_prop = "Profile Overview";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_profile_component");
    mThis.profileData = null;

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.elLoading = mThis.self.querySelector("#_tp_loading");
        mThis.elContent = mThis.self.querySelector("#_tp_profile_content");
        mThis.elAvatar = mThis.self.querySelector("#_tp_profile_avatar");
        mThis.elCameraBtn = mThis.self.querySelector("#_tp_avatar_camera");
        mThis.elPhotoInput = mThis.self.querySelector("#_tp_photo_input");
        mThis.elHeroName = mThis.self.querySelector("#_tp_hero_name");
        mThis.elStatusBadge = mThis.self.querySelector("#_tp_status_badge");
        mThis.elPillPhone = mThis.self.querySelector("#_tp_pill_phone");
        mThis.elPillEmail = mThis.self.querySelector("#_tp_pill_email");
        mThis.elPillAddress = mThis.self.querySelector("#_tp_pill_address");
        mThis.elStatCode = mThis.self.querySelector("#_tp_stat_code");
        mThis.elStatUnit = mThis.self.querySelector("#_tp_stat_unit");
        mThis.elFieldName = mThis.self.querySelector("#_tp_field_name");
        mThis.elFieldGender = mThis.self.querySelector("#_tp_field_gender");
        mThis.elFieldLegalName = mThis.self.querySelector("#_tp_field_legal_name");
        mThis.elFieldDob = mThis.self.querySelector("#_tp_field_dob");
        mThis.elFieldNationalId = mThis.self.querySelector("#_tp_field_national_id");
        mThis.elFieldEmail = mThis.self.querySelector("#_tp_field_email");
        mThis.elFieldPassport = mThis.self.querySelector("#_tp_field_passport");
        mThis.elFieldRelationship = mThis.self.querySelector("#_tp_field_relationship");
        mThis.elFieldPhone = mThis.self.querySelector("#_tp_field_phone");
        mThis.elFieldAddress = mThis.self.querySelector("#_tp_field_address");

        mThis.bindPhotoUpload();
        mThis.initAlready = true;
    };

    mThis._val = (v) => {
        if (v == null || v === "") return "_";
        return String(v);
    };

    mThis._sexLabel = (sex) => {
        if (sex === "M") return LocaleManager.trans("Male", "labels");
        if (sex === "F") return LocaleManager.trans("Female", "labels");
        return "_";
    };

    mThis._tenantTypeLabel = (tenantType) => {
        if (!tenantType) return "_";
        return LocaleManager.trans(tenantType, "labels");
    };

    mThis._statusBadgeClass = (status) => {
        if (status === "Active") return "is-active";
        if (status === "Pending") return "is-pending";
        if (status === "Inactive") return "is-inactive";
        return "";
    };

    mThis._setText = (el, value) => {
        if (el) el.textContent = mThis._val(value);
    };

    mThis.showLoading = () => {
        if (mThis.elLoading) mThis.elLoading.style.display = "flex";
        if (mThis.elContent) mThis.elContent.style.display = "none";
    };

    mThis.showContent = () => {
        if (mThis.elLoading) mThis.elLoading.style.display = "none";
        if (mThis.elContent) mThis.elContent.style.display = "block";
    };

    mThis.renderTenantProfile = (data) => {
        mThis.profileData = data || {};
        const d = mThis.profileData;

        if (mThis.elAvatar) {
            mThis.elAvatar.src = d.image_url || PLACEHOLDER_IMG;
        }

        mThis._setText(mThis.elHeroName, d.name);

        if (mThis.elStatusBadge) {
            mThis.elStatusBadge.textContent = mThis._val(d.status);
            mThis.elStatusBadge.className = `tp-status-badge ${mThis._statusBadgeClass(d.status)}`;
        }

        mThis._setText(mThis.elPillPhone, d.phone_number);
        mThis._setText(mThis.elPillEmail, d.email);
        mThis._setText(mThis.elPillAddress, d.address);
        mThis._setText(mThis.elStatCode, d.code);
        mThis._setText(mThis.elStatUnit, d.space_code);
        mThis._setText(mThis.elFieldName, d.name);
        mThis._setText(mThis.elFieldGender, mThis._sexLabel(d.sex));
        mThis._setText(mThis.elFieldLegalName, d.legal_name);
        mThis._setText(mThis.elFieldDob, d.date_of_birth);
        mThis._setText(mThis.elFieldNationalId, d.national_id);
        mThis._setText(mThis.elFieldEmail, d.email);
        mThis._setText(mThis.elFieldPassport, d.passport_number);
        mThis._setText(mThis.elFieldRelationship, mThis._tenantTypeLabel(d.tenant_type));
        mThis._setText(mThis.elFieldPhone, d.phone_number);
        mThis._setText(mThis.elFieldAddress, d.address);

        mThis.showContent();
        LocaleManager.translateZone(mThis.self);
    };

    mThis.bindPhotoUpload = () => {
        if (!mThis.elCameraBtn || !mThis.elPhotoInput || mThis.photoBound) return;
        mThis.photoBound = true;

        mThis.elCameraBtn.addEventListener("click", () => mThis.elPhotoInput.click());

        mThis.elPhotoInput.addEventListener("change", () => {
            const file = mThis.elPhotoInput.files && mThis.elPhotoInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const fullResult = e.target.result;
                if (mThis.elAvatar) mThis.elAvatar.src = fullResult;
                mThis.saveProfilePhoto(fullResult);
            };
            reader.readAsDataURL(file);
            mThis.elPhotoInput.value = "";
        });
    };

    mThis._updateAvatar = (imageUrl) => {
        if (mThis.elAvatar) mThis.elAvatar.src = imageUrl;
        if (mThis.profileData) mThis.profileData.image_url = imageUrl;
    };

    mThis.saveProfilePhoto = (photo) => {
        const id = mThis.profileData && mThis.profileData.id;
        if (!id) return;

        vsapi
            .call(
                `${main_view.base_url}/tenant/tenant/tenantProfile/profile/photo/create`,
                { photo: photo, id: id },
                false
            )
            .then((res) => {
                if (res.status_code === 200) {
                    const imageUrl =
                        (res.data && res.data.image_url) ||
                        (typeof res.data === "string" ? res.data : null);

                    if (imageUrl) {
                        mThis._updateAvatar(imageUrl);
                    } else {
                        vsapi
                            .call(
                                `${main_view.base_url}/tenant/tenant/tenantProfile/profile/photo`,
                                { id: id },
                                false
                            )
                            .then((photoRes) => {
                                if (photoRes.status_code === 200 && photoRes.data) {
                                    const url =
                                        typeof photoRes.data === "string"
                                            ? photoRes.data
                                            : photoRes.data.image_url;
                                    if (url) mThis._updateAvatar(url);
                                }
                            });
                    }
                    cv_interact.success("Profile photo was saved!");
                } else {
                    cv_interact.error(res.error_message || "Failed to save photo");
                }
            });
    };

    mThis.loadProfile = () => {
        mThis.showLoading();

        vsapi
            .call(`${main_view.base_url}/tenant/tenant/tenantProfile/details`, {}, false)
            .then((res) => {
                if (res.status_code === 200 && res.data) {
                    mThis.renderTenantProfile(res.data);
                } else {
                    if (mThis.elLoading) {
                        mThis.elLoading.innerHTML = `<span>${mThis._val(res.error_message || "Unable to load profile")}</span>`;
                    }
                    if (res.error_message) cv_interact.error(res.error_message);
                }
            });
    };

    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadProfile();
    };

    return mThis;
})();
