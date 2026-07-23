"use strict";

var TenantProfileComponent = (() => {
    const mThis = {};
    const PLACEHOLDER_IMG = `${main_view.base_url}/assets/images/default/placeholder.svg`;

    mThis.title_prop = "Profile Overview";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_tenant_profile_component",
    );
    mThis.profileData = null;

    mThis._val = (v) => {
        if (v == null || v === "") return "_";
        return String(v);
    };

    mThis._esc = (v) => {
        return mThis
            ._val(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
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

    mThis._statusMeta = (statusId, statusText) => {
        const byId = {
            1: { label: "Pending", cls: "is-pending" },
            2: { label: "Active", cls: "is-active" },
            3: { label: "Inactive", cls: "is-inactive" },
        };
        if (statusId != null && byId[Number(statusId)]) {
            return byId[Number(statusId)];
        }
        if (statusText === "Active") return { label: "Active", cls: "is-active" };
        if (statusText === "Pending") {
            return { label: "Pending", cls: "is-pending" };
        }
        if (statusText === "Inactive") {
            return { label: "Inactive", cls: "is-inactive" };
        }
        return { label: mThis._val(statusText), cls: "" };
    };

    mThis._fieldCard = (icon, labelKey, labelFallback, value, opts = {}) => {
        const col = opts.full ? "col-12" : "col-md-4";
        const valueClass = opts.capitalize
            ? "tp-field-value text-capitalize"
            : "tp-field-value";
        return `
            <div class="${col}">
                <div class="tp-field-card">
                    <div class="tp-field-icon"><i class="fa ${icon}"></i></div>
                    <div>
                        <small class="tp-field-label" vslang="labels.${labelKey}">${labelFallback}</small>
                        <div class="${valueClass}">${mThis._esc(value)}</div>
                    </div>
                </div>
            </div>
        `;
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        const setHeight = () => {
            mThis.self.style.maxHeight = window.innerHeight - 160 + "px";
        };
        setHeight();
        mThis.self.classList.add("overflow-y-auto", "overflow-x-hidden");
        if (!mThis.resizeBound) {
            window.addEventListener("resize", setHeight);
            mThis.resizeBound = true;
        }

        mThis.initAlready = true;
    };

    mThis.showLoading = () => {
        mThis.self.innerHTML = `
            <div class="tp-loading">
                <i class="fa fa-spinner"></i>
                <span vslang="labels.Loading">Loading...</span>
            </div>
        `;
        LocaleManager.translateZone(mThis.self);
    };

    mThis.showError = (message) => {
        mThis.self.innerHTML = `
            <div class="tp-loading">
                <span>${mThis._esc(message || "Unable to load profile")}</span>
            </div>
        `;
    };

    mThis.renderProfile = (data) => {
        mThis.profileData = data || {};
        const d = mThis.profileData;
        const status = mThis._statusMeta(d.status_id, d.status);
        const imageUrl = d.image_url || PLACEHOLDER_IMG;

        const infoFieldsHtml = [
            mThis._fieldCard("fa-user", "Full Name", "Full Name", d.name, {
                capitalize: true,
            }),
            mThis._fieldCard(
                "fa-venus-mars",
                "Gender",
                "Gender",
                mThis._sexLabel(d.sex),
            ),
            mThis._fieldCard(
                "fa-briefcase",
                "Legal Name",
                "Legal Name",
                d.legal_name,
            ),
            mThis._fieldCard(
                "fa-calendar",
                "Date of Birth",
                "Date of Birth",
                d.date_of_birth,
            ),
            mThis._fieldCard(
                "fa-id-card",
                "National ID",
                "National ID",
                d.national_id,
            ),
            mThis._fieldCard("fa-envelope", "Email", "Email", d.email),
            mThis._fieldCard(
                "fa-passport",
                "Passport Number",
                "Passport Number",
                d.passport_number,
            ),
            mThis._fieldCard(
                "fa-users",
                "Relationship",
                "Relationship",
                mThis._tenantTypeLabel(d.tenant_type),
            ),
            mThis._fieldCard("fa-phone", "Phone", "Phone", d.phone_number),
            mThis._fieldCard(
                "fa-location-dot",
                "Address",
                "Address",
                d.address,
                { full: true, capitalize: true },
            ),
        ].join("");

        mThis.self.innerHTML = `
            <div class="tp-profile">
                <section class="tp-hero">
                    <div class="tp-hero-inner">
                        <div class="tp-hero-main">
                            <div class="tp-avatar-wrap">
                                <img src="${mThis._esc(imageUrl)}"
                                    class="tp-avatar"
                                    id="_tp_profile_avatar"
                                    alt="Profile">
                                <button type="button" class="tp-avatar-camera" id="_tp_avatar_camera" title="Upload photo">
                                    <i class="fa fa-camera"></i>
                                </button>
                                <input type="file" id="_tp_photo_input" accept="image/*" style="display:none;">
                            </div>
                            <div class="tp-hero-info">
                                <div class="tp-hero-name-row">
                                    <h2 class="tp-hero-name">${mThis._esc(d.name)}</h2>
                                    <span class="tp-status-badge ${status.cls}">${mThis._esc(status.label)}</span>
                                </div>
                                <div class="tp-hero-pills">
                                    <span class="tp-pill">
                                        <i class="fa fa-phone"></i>
                                        <span>${mThis._esc(d.phone_number)}</span>
                                    </span>
                                    <span class="tp-pill">
                                        <i class="fa fa-envelope"></i>
                                        <span>${mThis._esc(d.email)}</span>
                                    </span>
                                    <span class="tp-pill">
                                        <i class="fa fa-location-dot"></i>
                                        <span>${mThis._esc(d.address)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="tp-hero-stats">
                            <div class="tp-stat-card">
                                <i class="fa fa-id-card"></i>
                                <div class="tp-stat-label" vslang="labels.Tenant ID">Tenant ID</div>
                                <div class="tp-stat-value">${mThis._esc(d.code)}</div>
                            </div>
                            <div class="tp-stat-card">
                                <i class="fa fa-building"></i>
                                <div class="tp-stat-label" vslang="labels.Unit">Unit</div>
                                <div class="tp-stat-value">${mThis._esc(d.space_code)}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="tp-personal">
                    <div class="tp-personal-header">
                        <h5 class="tp-personal-title">
                            <i class="fa fa-user"></i>
                            <span vslang="titles.Personal Information">Personal Information</span>
                        </h5>
                        <p class="tp-personal-subtitle" vslang="labels.Basic tenant details for this account">
                            Basic tenant details for this account
                        </p>
                    </div>
                    <div class="row g-3">
                        ${infoFieldsHtml}
                    </div>
                </section>
            </div>
        `;

        mThis.bindPhotoUpload();
        LocaleManager.translateZone(mThis.self);
    };

    mThis.bindPhotoUpload = () => {
        const cameraBtn = mThis.self.querySelector("#_tp_avatar_camera");
        const photoInput = mThis.self.querySelector("#_tp_photo_input");
        const avatar = mThis.self.querySelector("#_tp_profile_avatar");

        if (avatar) {
            avatar.onerror = () => {
                avatar.src = PLACEHOLDER_IMG;
            };
        }

        if (!cameraBtn || !photoInput) return;

        cameraBtn.onclick = () => photoInput.click();

        photoInput.onchange = () => {
            const file = photoInput.files && photoInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const fullResult = e.target.result;
                if (avatar) avatar.src = fullResult;
                mThis.saveProfilePhoto(fullResult);
            };
            reader.readAsDataURL(file);
            photoInput.value = "";
        };
    };

    mThis.updateAvatar = (imageUrl) => {
        const avatar = mThis.self.querySelector("#_tp_profile_avatar");
        if (avatar) avatar.src = imageUrl;
        if (mThis.profileData) mThis.profileData.image_url = imageUrl;
    };

    mThis.saveProfilePhoto = (photo) => {
        const id = mThis.profileData && mThis.profileData.id;
        if (!id) return;

        vsapi
            .call(
                `${mThis.base_url}/tenant/tenantProfile/profile/photo/create`,
                { photo: photo, id: id },
                false,
            )
            .then((res) => {
                if (res.status_code === 200) {
                    const imageUrl =
                        (res.data && res.data.image_url) ||
                        (typeof res.data === "string" ? res.data : null);

                    if (imageUrl) {
                        mThis.updateAvatar(imageUrl);
                    } else {
                        vsapi
                            .call(
                                `${mThis.base_url}/tenant/tenantProfile/profile/photo`,
                                { id: id },
                                false,
                            )
                            .then((photoRes) => {
                                if (
                                    photoRes.status_code === 200 &&
                                    photoRes.data
                                ) {
                                    const url =
                                        typeof photoRes.data === "string"
                                            ? photoRes.data
                                            : photoRes.data.image_url;
                                    if (url) mThis.updateAvatar(url);
                                }
                            })
                            .catch(() => {});
                    }
                    cv_interact.success("Profile photo was saved!");
                } else {
                    cv_interact.error(
                        res.error_message || "Failed to save photo",
                    );
                }
            })
            .catch(() => {
                cv_interact.error("Failed to save photo");
            });
    };

    mThis.loadProfile = () => {
        mThis.showLoading();

        vsapi
            .call(
                `${mThis.base_url}/tenant/tenantProfile/details`,
                {},
                false,
            )
            .then((res) => {
                if (res.status_code === 200 && res.data) {
                    mThis.renderProfile(res.data);
                } else {
                    mThis.showError(
                        res.error_message || "Unable to load profile",
                    );
                    if (res.error_message) {
                        cv_interact.error(res.error_message);
                    }
                }
            })
            .catch(() => {
                mThis.showError("Unable to load profile");
                cv_interact.error("Unable to load profile");
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadProfile();
    };

    return mThis;
})();
