"use strict";

var TenantProfileComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "My Profile";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_tenant_profile_component",
    );
    mThis.content = mThis.self
        ? mThis.self.querySelector("#_tenant_profile_content")
        : null;
    mThis.profileData = null;

    mThis.escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const div = document.createElement("div");
        div.textContent = String(str);
        return div.innerHTML;
    };

    mThis.emptyValueHtml = (text = "—") => {
        return `<span class="tp-field-value tp-field-value--empty">${mThis.escapeHtml(text)}</span>`;
    };

    mThis.valueHtml = (val, emptyText = "—") => {
        if (val == null || String(val).trim() === "" || val === "—") {
            return mThis.emptyValueHtml(emptyText);
        }
        return `<span>${mThis.escapeHtml(String(val))}</span>`;
    };

    mThis.getStatusMeta = (data) => {
        const statusId = parseInt(data.status_id, 10);
        const map = {
            1: { label: "Pending", cls: "tp-status is-pending" },
            2: { label: "Active", cls: "tp-status" },
            3: { label: "Inactive", cls: "tp-status is-inactive" },
        };
        const m = map[statusId] || null;
        return {
            label: m?.label || data.status || "—",
            cls: m?.cls || "tp-status is-pending",
        };
    };

    mThis.getSexLabel = (sex) => {
        if (sex === "M") return LocaleManager.trans("Male", "labels");
        if (sex === "F") return LocaleManager.trans("Female", "labels");
        return null;
    };

    mThis.getLocationLabel = (address) => {
        if (address == null || String(address).trim() === "") return null;
        const parts = String(address)
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
        if (parts.length >= 2) {
            return parts[parts.length - 2] || parts[parts.length - 1];
        }
        return parts[0] || null;
    };

    mThis.renderInfoField = (label, icon, valueHtml) => {
        return `
            <div class="tp-field">
                <span class="tp-field-label" vslang="labels.${label}">${label}</span>
                <div class="tp-field-value">
                    <i class="${icon}"></i>
                    ${valueHtml}
                </div>
            </div>`;
    };

    mThis.renderMetaItem = (icon, valueHtml) => {
        return `
            <div class="tp-meta-item">
                <i class="fa-solid ${icon}"></i>
                ${valueHtml}
            </div>`;
    };

    mThis.renderStatCard = (label, value) => {
        return `
            <div class="tp-stat-card">
                <span class="tp-stat-label" vslang="labels.${label}">${label}</span>
                <div class="tp-stat-value">${mThis.valueHtml(value)}</div>
            </div>`;
    };

    mThis.buildHeroHtml = (data) => {
        const status = mThis.getStatusMeta(data);
        const placeholder = `${main_view.base_url}/assets/images/default/placeholder.svg`;
        const imageUrl = data.image_url || data.photo || placeholder;
        const location = mThis.getLocationLabel(data.address);

        return `
            <div class="tp-hero">
                <div class="tp-hero-left">
                    <div class="tp-avatar-wrap">
                        <img class="tp-avatar"
                            src="${mThis.escapeHtml(imageUrl)}"
                            alt=""
                            loading="lazy">
                        <button type="button"
                            class="tp-avatar-cam"
                            id="_tp_btn_photo"
                            title="Change photo"
                            aria-label="Change photo">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>
                    <div class="tp-hero-main">
                        <div class="tp-hero-name-row">
                            <h2 class="tp-hero-name text-capitalize">${mThis.valueHtml(data.name)}</h2>
                            <span class="${status.cls}">${mThis.escapeHtml(status.label)}</span>
                        </div>
                        <div class="tp-meta">
                            <div class="tp-meta-row">
                                ${mThis.renderMetaItem("fa-phone", mThis.valueHtml(data.phone_number))}
                                ${mThis.renderMetaItem("fa-envelope", mThis.valueHtml(data.email))}
                            </div>
                            <div class="tp-meta-row">
                                ${mThis.renderMetaItem("fa-location-dot", mThis.valueHtml(location))}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tp-hero-stats">
                    ${mThis.renderStatCard("Tenant ID", data.code)}
                    ${mThis.renderStatCard("Unit", data.space_code)}
                </div>
            </div>`;
    };

    mThis.buildInfoCardHtml = (data) => {
        const fieldsHtml = [
            mThis.renderInfoField(
                "Full Name",
                "fa-regular fa-id-card",
                mThis.valueHtml(data.name),
            ),
            mThis.renderInfoField(
                "Gender",
                "fa-solid fa-venus-mars",
                mThis.valueHtml(mThis.getSexLabel(data.sex)),
            ),
            mThis.renderInfoField(
                "Date of Birth",
                "fa-regular fa-calendar",
                mThis.valueHtml(data.date_of_birth),
            ),
            mThis.renderInfoField(
                "National ID",
                "fa-regular fa-address-card",
                mThis.valueHtml(data.national_id),
            ),
            mThis.renderInfoField(
                "Passport Number",
                "fa-regular fa-file-lines",
                mThis.valueHtml(data.passport_number),
            ),
            mThis.renderInfoField(
                "Current Address",
                "fa-solid fa-house",
                mThis.valueHtml(data.address),
            ),
        ].join("");

        return `
            <div class="tp-info-card is-open" id="_tp_info_card">
                <div class="tp-info-head" id="_tp_info_head">
                    <div class="tp-info-icon"><i class="fa-regular fa-user"></i></div>
                    <div class="tp-info-titles">
                        <h3 class="tp-info-title" vslang="titles.Personal Information">Personal Information</h3>
                        <p class="tp-info-sub" vslang="titles.General details and identification">General details and identification</p>
                    </div>
                    <i class="fa-solid fa-chevron-down tp-info-chevron"></i>
                </div>
                <div class="tp-info-body">
                    <div class="tp-grid">
                        ${fieldsHtml}
                    </div>
                </div>
            </div>`;
    };

    mThis.buildProfileHtml = (data) => {
        return `
            ${mThis.buildHeroHtml(data)}
            ${mThis.buildInfoCardHtml(data)}
        `;
    };

    mThis.bindInfoToggle = (container) => {
        if (!container) return;
        const card = container.querySelector("#_tp_info_card");
        const head = container.querySelector("#_tp_info_head");
        if (!card || !head) return;

        head.onclick = (e) => {
            e.preventDefault();
            card.classList.toggle("is-open");
        };
    };

    mThis.bindProfileEvents = (container) => {
        if (!container) return;

        const avatarImg = container.querySelector(".tp-avatar");
        if (avatarImg) {
            avatarImg.addEventListener("error", () => {
                avatarImg.src = `${main_view.base_url}/assets/images/default/placeholder.svg`;
            });
        }

        mThis.bindInfoToggle(container);
    };

    mThis.renderProfile = (data) => {
        if (!mThis.content) return;
        mThis.profileData = data;
        mThis.content.innerHTML = mThis.buildProfileHtml(data);
        LocaleManager.translateZone(mThis.content);
        mThis.bindProfileEvents(mThis.content);
    };

    mThis.loadProfile = () => {
        if (!mThis.content) return;

        mThis.content.innerHTML = `
            <div class="text-center py-5 text-muted" id="_tenant_profile_loading">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 mb-0" vslang="titles.Loading">Loading...</p>
            </div>`;

        vsapi
            .call(
                `${main_view.base_url}/tenant/tenantProfile/details`,
                null,
                null,
                null,
            )
            .then((res) => {
                if (res.status_code === 200 && res.data) {
                    mThis.renderProfile(res.data);
                    return;
                }
                mThis.content.innerHTML = `
                    <div class="alert alert-warning mb-0">
                        ${mThis.escapeHtml(
                            res?.error_message || "Profile not found.",
                        )}
                    </div>`;
            })
            .catch(() => {
                mThis.content.innerHTML = `
                    <div class="alert alert-danger mb-0">Failed to load profile.</div>`;
            });
    };

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.loadProfile();
    };

    return mThis;
})();
