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

    mThis.emptyValueHtml = (text = "Not provided") => {
        return `<span class="text-muted fw-normal">${mThis.escapeHtml(text)}</span>`;
    };

    mThis.valueHtml = (val, emptyText = "Not provided") => {
        if (val == null || String(val).trim() === "" || val === "—") {
            return mThis.emptyValueHtml(emptyText);
        }
        return `<span>${mThis.escapeHtml(String(val))}</span>`;
    };

    mThis.getStatusMeta = (data) => {
        const statusId = parseInt(data.status_id, 10);
        const map = {
            1: { label: "Pending", cls: "tp-status is-pending" },
            2: { label: "Active", cls: "tp-status is-active" },
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

    mThis.getInitials = (name) => {
        if (!name || String(name).trim() === "") return "?";
        const parts = String(name).trim().split(/\s+/).filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    mThis.renderInfoField = (label, icon, valueHtml) => {
        return `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="small text-uppercase text-muted fw-semibold mb-2" style="letter-spacing:.08em;" vslang="labels.${label}">${label}</div>
                <div class="d-flex align-items-start gap-2 tp-serif fw-semibold text-dark">
                    <i class="${icon} tp-gold mt-1 flex-shrink-0"></i>
                    <div class="text-break">${valueHtml}</div>
                </div>
            </div>`;
    };

    mThis.renderMetaItem = (icon, valueHtml) => {
        return `
            <div class="d-inline-flex align-items-center gap-2 small text-white-50">
                <i class="fa-solid ${icon} tp-gold"></i>
                <span class="text-white-50">${valueHtml}</span>
            </div>`;
    };

    mThis.renderStatCard = (label, value) => {
        return `
            <div class="tp-stat rounded-3 px-3 py-2">
                <span class="d-block small text-uppercase text-white-50 fw-semibold mb-1" style="letter-spacing:.1em;font-size:10px;" vslang="labels.${label}">${label}</span>
                <div class="tp-serif fw-bold text-white text-break">${mThis.valueHtml(value, "—")}</div>
            </div>`;
    };

    mThis.buildHeroHtml = (data) => {
        const status = mThis.getStatusMeta(data);
        const hasPhoto = !!(
            data.has_photo ||
            (data.image_url &&
                !String(data.image_url).includes("placeholder.svg"))
        );
        const imageUrl = data.image_url || data.photo || "";
        const location = mThis.getLocationLabel(data.address);
        const initials = mThis.getInitials(data.name);
        const code = data.code || "";

        return `
            <div class="tp-hero text-white p-4 position-relative">
                <input type="file"
                    id="_tp_photo_input"
                    name="documents"
                    class="d-none"
                    accept=".png,.jpg,.jpeg">
                <div class="d-flex align-items-center justify-content-between gap-3 position-relative">
                    <div class="d-flex align-items-center gap-3 min-w-0 flex-grow-1 flex-column flex-sm-row align-items-sm-center">
                        <div class="position-relative flex-shrink-0 tp-avatar-wrap" id="_tp_avatar_wrap">
                            ${
                                hasPhoto
                                    ? `<img class="tp-avatar rounded-4 object-fit-cover"
                                        id="_tp_avatar_img"
                                        src="${mThis.escapeHtml(imageUrl)}"
                                        alt=""
                                        loading="lazy"
                                        data-initials="${mThis.escapeHtml(initials)}"
                                        title="Click to change photo"
                                        style="cursor:pointer;">`
                                    : `<div class="tp-avatar tp-avatar--initials rounded-4 d-flex align-items-center justify-content-center tp-serif fw-bold"
                                        id="_tp_avatar_fallback"
                                        data-initials="${mThis.escapeHtml(initials)}"
                                        title="Click to change photo"
                                        style="cursor:pointer;">${mThis.escapeHtml(initials)}</div>`
                            }
                            <button type="button"
                                class="btn btn-light btn-sm rounded-circle position-absolute p-0 d-inline-flex align-items-center justify-content-center tp-avatar-cam"
                                id="_tp_btn_photo"
                                title="Change photo"
                                aria-label="Change photo">
                                <i class="fa-solid fa-camera"></i>
                            </button>
                        </div>
                        <div class="min-w-0">
                            <h2 class="tp-serif fw-bold text-white text-capitalize mb-1 fs-2">${mThis.valueHtml(data.name, "—")}</h2>
                            <p class="mb-2 small text-white-50">
                                <span vslang="titles.Tenant profile">Tenant profile</span>
                                ${code ? ` · ${mThis.escapeHtml(String(code))}` : ""}
                            </p>
                            <span class="${status.cls} badge rounded-pill d-inline-flex align-items-center gap-2">
                                <span class="tp-status-dot rounded-circle"></span>
                                ${mThis.escapeHtml(status.label)}
                            </span>
                        </div>
                    </div>
                    <button type="button"
                        class="btn btn-outline-light rounded-circle flex-shrink-0 p-0 d-inline-flex align-items-center justify-content-center tp-toggle-btn"
                        id="_tp_toggle_body"
                        aria-expanded="true"
                        aria-controls="_tp_hero_details _tp_card_body"
                        title="Toggle details">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
                <div class="collapse show tp-collapse" id="_tp_hero_details">
                    <div class="d-flex align-items-center justify-content-between gap-3 pt-4 flex-column flex-lg-row align-items-lg-center">
                        <div class="d-flex align-items-center flex-wrap gap-4 min-w-0">
                            ${mThis.renderMetaItem("fa-phone", mThis.valueHtml(data.phone_number, "—"))}
                            ${mThis.renderMetaItem("fa-envelope", mThis.valueHtml(data.email, "—"))}
                            ${mThis.renderMetaItem("fa-location-dot", mThis.valueHtml(location, "—"))}
                        </div>
                        <div class="d-flex flex-wrap gap-2 flex-shrink-0 ms-lg-auto">
                            ${mThis.renderStatCard("Tenant ID", data.code)}
                            ${mThis.renderStatCard("Unit", data.space_code)}
                        </div>
                    </div>
                </div>
            </div>`;
    };

    mThis.buildInfoBodyHtml = (data) => {
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
            <div class="collapse show tp-collapse bg-white" id="_tp_card_body">
                <div class="d-flex align-items-center gap-3 px-4 pt-4 pb-2">
                    <div class="tp-info-icon rounded-3 d-inline-flex align-items-center justify-content-center flex-shrink-0">
                        <i class="fa-regular fa-user"></i>
                    </div>
                    <div class="min-w-0">
                        <h3 class="tp-serif fw-bold mb-0 fs-5" vslang="titles.Personal Information">Personal information</h3>
                        <p class="mb-0 small text-muted" vslang="titles.General details and identification">General details and identification</p>
                    </div>
                </div>
                <div class="px-4 pb-4 pt-2">
                    <div class="row g-4">
                        ${fieldsHtml}
                    </div>
                </div>
            </div>`;
    };

    mThis.buildProfileHtml = (data) => {
        return `
            <div class="rounded-4 overflow-hidden shadow tp-card is-open" id="_tp_card">
                ${mThis.buildHeroHtml(data)}
                ${mThis.buildInfoBodyHtml(data)}
            </div>
        `;
    };

    mThis.syncOpenState = (card, btn, isOpen) => {
        if (card) card.classList.toggle("is-open", isOpen);
        if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    mThis.bindBodyToggle = (container) => {
        if (!container) return;
        const card = container.querySelector("#_tp_card");
        const btn = container.querySelector("#_tp_toggle_body");
        if (!card || !btn) return;

        const collapses = [...container.querySelectorAll(".tp-collapse")];

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !card.classList.contains("is-open");
            collapses.forEach((el) => el.classList.toggle("show", willOpen));
            mThis.syncOpenState(card, btn, willOpen);
        };
    };

    mThis.renderTenantImage = (container) => {
        if (!container) return;
        const wrap = container.querySelector("#_tp_avatar_wrap");
        const previewImg = container.querySelector("#_tp_avatar_img");
        const fallback = container.querySelector("#_tp_avatar_fallback");
        if (!wrap) return;

        const initials = mThis.getInitials(mThis.profileData?.name);
        let src = "";
        if (previewImg && previewImg.src) {
            src = previewImg.src.split("/").pop();
        }
        const isPlaceholder = src === "placeholder.svg" || src === "";

        if (!mThis.fileBase64 || isPlaceholder) {
            if (previewImg) previewImg.remove();
            if (!wrap.querySelector("#_tp_avatar_fallback")) {
                const el = document.createElement("div");
                el.id = "_tp_avatar_fallback";
                el.className =
                    "tp-avatar tp-avatar--initials rounded-4 d-flex align-items-center justify-content-center tp-serif fw-bold";
                el.dataset.initials = initials;
                el.textContent = initials;
                el.title = "Click to change photo";
                el.style.cursor = "pointer";
                wrap.insertBefore(el, wrap.firstChild);
                el.onclick = () => mThis.uploadInput?.click();
            }
            if (mThis.uploadInput) mThis.uploadInput.value = "";
        } else {
            if (fallback) fallback.remove();
            let img = wrap.querySelector("#_tp_avatar_img");
            if (!img) {
                img = document.createElement("img");
                img.id = "_tp_avatar_img";
                img.className = "tp-avatar rounded-4 object-fit-cover";
                img.alt = "";
                img.title = "Click to change photo";
                img.style.cursor = "pointer";
                img.dataset.initials = initials;
                wrap.insertBefore(img, wrap.firstChild);
                img.onclick = () => mThis.uploadInput?.click();
            }
            if (mThis.previewSrc) img.src = mThis.previewSrc;
        }
    };

    mThis.saveProfilePhoto = (photo, id) => {
        const p = { photo: photo, id: id };
        vsapi
            .call(
                [
                    main_view.base_url,
                    "/tenant/tenantProfile/profile/photo/save",
                ].join(""),
                p,
                false,
            )
            .then((res) => {
                if (res.status_code == 200) {
                    if (res.data?.image_url) {
                        mThis.previewSrc = res.data.image_url;
                        if (mThis.profileData) {
                            mThis.profileData.image_url = res.data.image_url;
                            mThis.profileData.photo = res.data.image_url;
                            mThis.profileData.has_photo = true;
                        }
                    }
                    cv_interact.success("Profile photo was saved!");
                } else cv_interact.error(res.error_message);
            });
    };

    mThis.bindPhotoUpload = (container) => {
        if (!container) return;

        mThis.uploadInput = container.querySelector("#_tp_photo_input");
        mThis.controls = mThis.controls || {};
        mThis.controls.btn_chooseFile = container.querySelector("#_tp_btn_photo");

        mThis.fileBase64 = null;
        mThis.ext = null;
        mThis.previewSrc = null;

        const imageUrl =
            mThis.profileData?.image_url || mThis.profileData?.photo || "";
        const hasPhoto = !!(
            mThis.profileData?.has_photo ||
            (imageUrl && !String(imageUrl).includes("placeholder.svg"))
        );
        if (hasPhoto && imageUrl) {
            mThis.fileBase64 = imageUrl;
            mThis.previewSrc = imageUrl;
        }

        if (!mThis.uploadInput || !mThis.controls.btn_chooseFile) return;

        mThis.controls.btn_chooseFile.onclick = () => {
            mThis.uploadInput.click();
        };

        const previewImg = container.querySelector("#_tp_avatar_img");
        const fallback = container.querySelector("#_tp_avatar_fallback");
        if (previewImg) {
            previewImg.style.cursor = "pointer";
            previewImg.title = "Click to change photo";
            previewImg.onclick = () => {
                mThis.uploadInput.click();
            };
        }
        if (fallback) {
            fallback.style.cursor = "pointer";
            fallback.title = "Click to change photo";
            fallback.onclick = () => {
                mThis.uploadInput.click();
            };
        }

        mThis.uploadInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const extension = file.name.split(".").pop().toLowerCase();

                if (!["jpg", "jpeg", "png"].includes(extension)) {
                    cv_interact.error(
                        "Please select a valid image file (.jpg, .jpeg, .png)",
                    );
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const fullResult = event.target.result;

                    mThis.fileBase64 = null;

                    mThis.fileBase64 = fullResult.split(",")[1];
                    let detectedExt = fullResult.split(";")[0].split(":")[1];
                    mThis.ext = detectedExt.split("/")[1];

                    mThis.previewSrc = fullResult;
                    mThis.renderTenantImage(container);

                    const id = mThis.profileData?.id;
                    if (id > 0) {
                        mThis.saveProfilePhoto(fullResult, id);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        mThis.renderTenantImage(container);
    };

    mThis.bindProfileEvents = (container) => {
        if (!container) return;

        const avatarImg = container.querySelector("img.tp-avatar");
        if (avatarImg) {
            avatarImg.addEventListener("error", () => {
                mThis.fileBase64 = null;
                mThis.previewSrc = null;
                mThis.renderTenantImage(container);
            });
        }

        mThis.bindBodyToggle(container);
        mThis.bindPhotoUpload(container);
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
