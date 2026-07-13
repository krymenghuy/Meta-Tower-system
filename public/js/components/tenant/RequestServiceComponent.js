"use strict";

var RequestServiceComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Request Service";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_service_request_component",
    );
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service_request");
    mThis.elService_category = mThis.self.querySelector(
        "#_service_request_category_id",
    );
    mThis.elStatus = mThis.self.querySelector("#_service_request_status");
    mThis.elSearch = mThis.self.querySelector("#_search_service_request");
    mThis.elBtnCreate = mThis.self.querySelector("#_btnServiceRequest");

    mThis.escapeHtml = (str) => {
        if (str == null || str === "") return "";
        const div = document.createElement("div");
        div.textContent = String(str);
        return div.innerHTML;
    };

    mThis.to12h = (time) => {
        if (!time) return "";
        const parts = String(time).split(":");
        const hour = parseInt(parts[0], 10);
        const minute = (parts[1] ?? "00").padStart(2, "0");
        if (isNaN(hour)) return "";
        const ampm = hour >= 12 ? "PM" : "AM";
        const h12 = hour % 12 || 12;
        return `${h12}:${minute} ${ampm}`;
    };

    mThis.formatDurationDisplay = (data) => {
        const unitType = String(data?.unit_type ?? "").toLowerCase();
        const isHourly =
            unitType === "2" || unitType === "hour" || unitType === "hourly";
        const hours = parseFloat(data?.duration_hours);

        if (
            isHourly &&
            data?.duration_hours != null &&
            data.duration_hours !== "" &&
            !isNaN(hours)
        ) {
            return `${hours % 1 === 0 ? hours.toFixed(0) : hours}H`;
        }

        const unitMap = {
            1: "One Time",
            2: "Hour",
            3: "One Time",
            "one time": "One Time",
            one_time: "One Time",
            once: "One Time",
            hour: "Hour",
            hourly: "Hour",
            unit: "One Time",
            per_unit: "One Time",
        };

        return unitMap[unitType] || data?.unit_type || "—";
    };

    mThis.formatChargeAsDisplay = (data) => {
        const unitMap = {
            1: "once",
            2: "hour",
            3: "unit",
            "one time": "once",
            one_time: "once",
            once: "once",
            hour: "hour",
            hourly: "hour",
            unit: "unit",
            per_unit: "unit",
            month: "month",
            monthly: "month",
        };

        const unitType = String(data?.unit_type ?? "").toLowerCase();
        const unit = unitMap[unitType] || unitType || "-";
        const price = parseFloat(data?.service_price ?? data?.price ?? 0);
        const formattedPrice =
            price > 0
                ? VSMoney.formatAmount(price, data?.currency_code ?? "USD")
                : "—";

        if (unit === "-") return formattedPrice;

        return `<span class="sr-card__fee-amount">${formattedPrice}</span><span class="sr-card__fee-unit">/${unit}</span>`;
    };

    mThis.formatSchedule = (data) => {
        const date = (data.scheduled_date ?? "").trim();
        const time = mThis.to12h(data.start_time);
        if (!date && !time) return "—";
        if (date && time) return `${date} (${time})`;
        return date || time;
    };

    mThis.getStatusMeta = (data) => {
        const status = (data.status_name ?? "").toLowerCase();
        const map = {
            pending: {
                label: "Pending",
                cardCls: "sr-card--pending",
                badgeCls:
                    "sr-card__status-badge sr-card__status-badge--pending",
            },
            accepted: {
                label: "Accepted",
                cardCls: "sr-card--accepted",
                badgeCls:
                    "sr-card__status-badge sr-card__status-badge--accepted",
            },
            completed: {
                label: "Completed",
                cardCls: "sr-card--completed",
                badgeCls:
                    "sr-card__status-badge sr-card__status-badge--completed",
            },
            rejected: {
                label: "Rejected",
                cardCls: "sr-card--rejected",
                badgeCls:
                    "sr-card__status-badge sr-card__status-badge--rejected",
            },
            expired: {
                label: "Expired",
                cardCls: "sr-card--expired",
                badgeCls: "sr-card__status-badge sr-card__status-badge--expired",
            },
            cancelled: {
                label: "Cancelled",
                cardCls: "sr-card--cancelled",
                badgeCls:
                    "sr-card__status-badge sr-card__status-badge--cancelled",
            },
        };
        return (
            map[status] ?? {
                label: data.status_name ?? "—",
                cardCls: "",
                badgeCls: "sr-card__status-badge",
            }
        );
    };

    mThis.renderServiceRequestAction = (data) => {
        if (data.action_id > 1) return "";
        if (Number(data.status_id) !== 1) return "";
        return `<a href="javascript:void(0)"
            class="btn_service_request_action sr-card__menu-btn ${data.action_id > 1 ? "d-none" : ""}"
            data-id="${data.id}"
            data-statusid="${data.status_id ?? ""}"
            data-status-id="${data.request_status_id ?? ""}"
            aria-haspopup="true"
            aria-expanded="false"
            title="More options">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </a>`;
    };

    mThis.renderServiceRequestList = (container, items) => {
        items = items ?? [];
        container.innerHTML = "";

        if (!items.length) {
            container.innerHTML = `
                <div class="sr-list-empty text-center py-5 px-3">
                    <span class="sr-list-empty__icon d-inline-flex align-items-center justify-content-center mb-3">
                        <i class="fa-regular fa-clipboard"></i>
                    </span>
                    <p class="mb-1 fw-semibold text-prm-custom">No service requests found</p>
                    <small class="text-muted">Try adjusting your search or filters.</small>
                </div>`;
            return;
        }

        let rowsHtml = "";
        items.forEach((data) => {
            const status = mThis.getStatusMeta(data);
            const rowCls = status.cardCls ? ` ${status.cardCls}` : "";
            const category = mThis.escapeHtml(
                data.service_category ?? "Service",
            );
            const serviceName = mThis.escapeHtml(data.service_name ?? "—");
            const code = mThis.escapeHtml(data.code ?? "N/A");
            const duration = mThis.escapeHtml(
                mThis.formatDurationDisplay(data),
            );
            const schedule = mThis.escapeHtml(mThis.formatSchedule(data));
            const remarksRaw = (data.remarks ?? "").trim();
            const remarks = remarksRaw
                ? mThis.escapeHtml(remarksRaw)
                : "No additional notes added";
            const totalFee = mThis.formatChargeAsDisplay(data);
            const statusLabel = mThis.escapeHtml(status.label);

            rowsHtml += `
            <div class="sr-card${rowCls} service-request" id="service_request_id_${data.id}" data-statusid="${data.status_id ?? ""}">
                <div class="sr-card__accent"></div>
                <div class="sr-card__body">
                    <div class="sr-card__main">
                        <div class="sr-card__header">
                            <div>
                                <h3 class="sr-card__title">${category}</h3>
                                <p class="sr-card__subtitle">${serviceName}</p>
                            </div>
                            <span class="sr-card__code">${code}</span>
                        </div>
                        <div class="sr-card__divider"></div>
                        <div class="sr-card__meta">
                            <div class="sr-card__meta-item">
                                <span class="sr-card__meta-icon-wrap">
                                    <i class="fa-regular fa-clock sr-card__meta-icon"></i>
                                </span>
                                <div class="sr-card__meta-content">
                                    <span class="sr-card__meta-label">${LocaleManager.trans('Duration', 'titles')}</span>
                                    <span class="sr-card__meta-value"> ${duration}</span>
                                </div>
                            </div>
                            <div class="sr-card__meta-item">
                                <span class="sr-card__meta-icon-wrap">
                                    <i class="fa-regular fa-calendar sr-card__meta-icon"></i>
                                </span>
                                <div class="sr-card__meta-content">
                                    <span class="sr-card__meta-label">${LocaleManager.trans('Schedule Date', 'titles')}</span>
                                    <span class="sr-card__meta-value">${schedule}</span>
                                </div>
                            </div>
                            <div class="sr-card__meta-item">
                                <span class="sr-card__meta-icon-wrap">
                                    <i class="fa-regular fa-comment sr-card__meta-icon"></i>
                                </span>
                                <div class="sr-card__meta-content">
                                    <span class="sr-card__meta-label">${LocaleManager.trans('Remarks', 'labels')}</span>
                                    <span class="sr-card__meta-value">${remarks}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sr-card__stub">
                        <div class="sr-card__stub-top">
                            <div class="sr-card__fee-wrap">
                                <span class="sr-card__fee-label"> ${LocaleManager.trans('Total Fee', 'titles')}</span>
                                <span class="sr-card__fee-value">${totalFee}</span>
                            </div>
                            ${mThis.renderServiceRequestAction(data)}
                        </div>
                        <span class="${status.badgeCls}">
                            <span class="sr-card__status-dot"></span>
                            ${statusLabel}
                        </span>
                    </div>
                </div>
            </div>`;
        });

        container.innerHTML = `<div class="sr-list"><div class="sr-list__rows">${rowsHtml}</div></div>`;
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.divListView =
            mThis.divListView ||
            mThis.self.querySelector("#_service_request_list");
        mThis.ServiceRequestListView = new ListView(mThis.divListView, {
            api: {
                endpoint: `${main_view.base_url}/tenant/request-service/list`,
                method: "POST",
                cacheTTL: 3000,
            },
            perPage: 10,
            apiCluster: main_view.apiCluster,
            renderItems: (items, container) => {
                mThis.renderServiceRequestList(container, items);
            },
            listContainerClass: null,
        });

        if (mThis.elBtnCreate) {
            mThis.elBtnCreate.onclick = (e) => {
                e.preventDefault();
                CreateServiceRequestDialog.show({
                    id: null,
                    btn: e.target,
                    onClose: () =>
                        mThis.ServiceRequestListView.showPage(
                            mThis.getFilterData(),
                        ),
                });
            };
        }

        mThis.listContainer = mThis.ServiceRequestListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        };

        mThis.tblServiceRequest = mThis.ServiceRequestListView.getListContainer();

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
            }, 250);
        };

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });

        mThis.initDropdownMenus(mThis.tblServiceRequest);
        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elStatus.value,
            category_id: mThis.elService_category?.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_service_request_action",
            cssClass: "sr-card__dropdown bg-white shadow",
            menus: [
                // {
                //     html: '<span class="ps-2" vslang="title.Accept"></span>',
                //     icon: `<i class="fa-regular fa-square-check fs-5 text-primary"></i>`,
                //     name: "accept_request",
                //     cssClass: "border-bottom pb-2",
                // },
                // {
                //     html: '<span class="ps-2" vslang="title.Complete"></span>',
                //     icon: `<i class="fa-solid fa-circle-check fs-5 text-success"></i>`,
                //     name: "complete_request",
                //     cssClass: "border-bottom pb-2",
                // },
                // {
                //     html: '<span class="ps-2" vslang="title.Reject"></span>',
                //     icon: `<i class="fa-regular fa-rectangle-xmark fs-5 text-danger-emphasis"></i>`,
                //     name: "reject_request",
                //     cssClass: "border-bottom pb-2",
                // },
                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    name: "edit_request",
                    cssClass: "border-bottom pb-2",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Cancel"></span>',
                    icon: `<i class="fa-solid fa-square-xmark fs-5 text-danger"></i>`,
                    name: "cancel_request",
                    cssClass: "border-bottom pb-2",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = Number(container.dataset.statusid);
                const isPending = status_id === 1;
                if (menu.edit_request) {
                    menu.edit_request.style.display = isPending ? "block" : "none";
                }
                if (menu.cancel_request) {
                    menu.cancel_request.style.display = isPending
                        ? "block"
                        : "none";
                }
            },
            onClick: (menuLink, id, name) => {
                if (name === "accept_request")
                    mThis.acceptRequest(id, menuLink);
                if (name === "complete_request")
                    mThis.completeRequest(id, menuLink);
                if (name === "reject_request")
                    mThis.rejectRequest(id, menuLink);
                if (name === "edit_request")
                    mThis.editServiceRequest(id, menuLink);
                if (name === "cancel_request")
                    mThis.cancelRequest(id, menuLink);
                if (name === "delete_request")
                    mThis.deleteRequest(id, menuLink);
            },
        });
    };

    mThis.rejectRequest = (id, menuLink) => {
        let op = { id };
        Swal.fire({
            input: "textarea",
            inputLabel: " ",
            inputPlaceholder: "Please enter reason why reject this request",
            reverseButtons: true,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) return "Remark required!";
                op.remarks = value;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/service-request/reject`,
                        op,
                        null,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            mThis.ServiceRequestListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            cv_interact.error(
                                res.error_message ?? "Something went wrong!",
                            );
                        }
                    });
            },
        });
    };

    mThis.acceptRequest = (id, menuLink) => {
        cv_interact.confirm(
            "Are you sure you want to accept this service request?",
            {
                title: "Accept Service Request",
                context: "update",
                confirmButtonText: "Accept",
            },
            (e) => {
                if (!e) return;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/service-request/accept`,
                        { id },
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            mThis.ServiceRequestListView.showPage(
                                mThis.getFilterData(),
                            );
                            cv_interact.success(
                                "Service Request has been accepted!",
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Something went wrong",
                            );
                        }
                    })
                    .catch(() => cv_interact.error("Network error"));
            },
        );
    };

    mThis.completeRequest = (id, menuLink) => {
        cv_interact.confirm(
            "Are you sure you want to complete this service request?",
            {
                title: "Complete Service Request",
                context: "update",
                confirmButtonText: "Complete",
            },
            (e) => {
                if (!e) return;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/service-request/complete`,
                        { id },
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            mThis.ServiceRequestListView.showPage(
                                mThis.getFilterData(),
                            );
                            cv_interact.success(
                                "Service Request has been completed!",
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Something went wrong",
                            );
                        }
                    })
                    .catch(() => cv_interact.error("Network error"));
            },
        );
    };

    mThis.editServiceRequest = (id, menuLink) => {
        CreateServiceRequestDialog.show({
            id: id,
            btn: menuLink,
            onClose: () =>
                mThis.ServiceRequestListView.showPage(mThis.getFilterData()),
        });
    };

    mThis.cancelRequest = (id, menuLink) => {
        cv_interact.confirm(
            "Are you sure you want to cancel this service request?",
            {
                title: "Cancel Service Request",
                context: "delete",
                confirmButtonText: "Cancel Request",
            },
            (confirmed) => {
                if (!confirmed) return;
                vsapi
                    .call(
                        `${main_view.base_url}/tenant/request-service/cancel`,
                        { id },
                        menuLink,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success(
                                "Service request has been cancelled.",
                            );
                            mThis.ServiceRequestListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Cancel failed",
                            );
                        }
                    })
                    .catch(() => cv_interact.error("Network error"));
            },
        );
    };

    mThis.deleteRequest = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this Service Request?",
            {
                transTitle: "Delete Service Request",
                confirmButtonText: "Delete",
            },
            (confirmed) => {
                if (confirmed) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/service-request/delete`,
                            { id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Service request deleted.");
                                mThis.ServiceRequestListView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/service-request/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.request_statuses,
                    "id",
                    "name",
                    "",
                     LocaleManager.trans('All Statuses', 'titles'),
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elService_category,
                    d.service_categories,
                    "id",
                    "service_category",
                    "",
                     LocaleManager.trans('All Categories', 'titles'),
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ServiceRequestListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const CreateServiceRequestDialog = (() => {
    const self = {};
    let dialog = null;

    const _updatePricePreview = (me) => {
        const unit = me.controls.unit_type?.value || "";
        const showDuration = unit === "2";

        const durationRow = me.divModal.querySelector(".select-type-time");
        const previewRow = me.divModal.querySelector("#price-preview-row");
        const unitWrapper = me.divModal.querySelector(".unit-type-wrapper");

        if (unitWrapper) {
            unitWrapper.classList.remove("col-md-3", "col-md-6");
            unitWrapper.classList.add(showDuration ? "col-md-3" : "col-md-6");
        }
        if (durationRow) durationRow.style.display = showDuration ? "" : "none";

        if (!showDuration) {
            if (me.controls.duration_hours)
                me.controls.duration_hours.value = "";
            if (previewRow) previewRow.style.display = "none";
            return;
        }

        const hours = parseFloat(me.controls.duration_hours?.value || 0);
        const price = parseFloat(me.servicePrice || 0);

        if (hours > 0 && price > 0) {
            const total = price * hours;
            const elTotal = me.divModal.querySelector("#calc-total");
            const elBreakdown = me.divModal.querySelector("#calc-breakdown");
            if (elTotal) elTotal.textContent = `$${total.toFixed(2)}`;
            if (elBreakdown)
                elBreakdown.textContent = `$${price.toFixed(2)} × ${hours}h`;
            if (previewRow) previewRow.style.display = "";
        } else {
            if (previewRow) previewRow.style.display = "none";
        }
    };

    // const _populateCategoryAndService = (me, services,restoreValues = null,) => {
    //     const categoryMap = {};
    //     services.forEach((s) => {
    //         const cid = s.category_id;
    //         const cname = s.service_category ?? "";
    //         if (cid && !categoryMap[cid])
    //             categoryMap[cid] = { id: cid, name: cname };
    //     });
    //     const categories = Object.values(categoryMap);

    //     VSUtil.setComboItems(
    //         me.controls.category_id,
    //         categories,
    //         "id",
    //         "name",
    //         "",
    //         "Select Category",
    //     );

    //     if (restoreValues?.category_id) {
    //         me.controls.category_id.value = String(restoreValues.category_id);
    //     }

    //     const activeCategoryId = me.controls.category_id.value;
    //     const filtered = activeCategoryId
    //         ? services.filter((s) => String(s.category_id) === activeCategoryId)
    //         : services;

    //     VSUtil.setComboItems(
    //         me.controls.service_id,
    //         filtered,
    //         "id",
    //         "service_name",
    //         "",
    //         "Select Service",
    //     );

    //     if (restoreValues?.service_id) {
    //         me.controls.service_id.value = String(restoreValues.service_id);

    //         const svc = services.find(
    //             (s) => String(s.id) === String(restoreValues.service_id),
    //         );
    //         if (svc) me.servicePrice = parseFloat(svc.price) || 0;
    //     }
    // };

    const _populateCategoryAndService = (
        me,
        services,
        restoreValues = null,
    ) => {
        const categoryMap = {};
        services.forEach((s) => {
            const cid = s.category_id;
            const cname = s.service_category ?? "";
            if (cid && !categoryMap[cid])
                categoryMap[cid] = { id: cid, name: cname };
        });

        VSUtil.setComboItems(
            me.controls.category_id,
            Object.values(categoryMap),
            "id",
            "name",
            "",
            "Select Category",
        );

        if (restoreValues?.category_id) {
            me.controls.category_id.value = String(restoreValues.category_id);
        }

        const activeCategoryId = me.controls.category_id.value;
        const filtered = activeCategoryId
            ? services.filter((s) => String(s.category_id) === activeCategoryId)
            : services;

        VSUtil.setComboItems(
            me.controls.service_id,
            filtered,
            "id",
            "service_name",
            "",
            "Select Service",
        );

        if (restoreValues?.service_id) {
            me.controls.service_id.value = String(restoreValues.service_id);
            const svc = services.find(
                (s) => String(s.id) === String(restoreValues.service_id),
            );
            if (svc) me.servicePrice = parseFloat(svc.price) || 0;
        }
        me.controls.category_id.dispatchEvent(new Event("input"));
        me.controls.service_id.dispatchEvent(new Event("input"));
    };

    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3 mb-3">
                        <div class="col-12 col-md-4">
                            <select data-style="material" name="space_id" class="data-input form-control" data-field="space_id" required placeholder="${LocaleManager.trans('Unit', 'titles')}"></select>
                        </div>
                        <div class="col-12 col-md-4">
                            <select data-style="material" name="category_id" class="data-input form-control" data-field="category_id" required placeholder="${LocaleManager.trans('Service Category', 'labels')}"></select>
                        </div>
                        <div class="col-12 col-md-4">
                            <select data-style="material" name="service_id" class="data-input form-control" data-field="service_id" placeholder="${LocaleManager.trans('Service', 'titles')}"></select>
                        </div>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-3 unit-type-wrapper">
                            <select data-style="material" name="unit_type" class="data-input form-control" data-field="unit_type" disabled placeholder="${LocaleManager.trans('Charge As', 'titles')}">
                                <option value="">${LocaleManager.trans('Charge As', 'titles')}</option>
                                <option value="1">${LocaleManager.trans('One Time', 'labels')}</option>
                                <option value="2">${LocaleManager.trans('Hour', 'labels')}</option>
                                <option value="3">${LocaleManager.trans('Unit', 'titles')}</option>
                            </select>
                        </div>
                        <div class="col-md-3 select-type-time" style="display:none;">
                            <select name="duration_hours" data-style="material" class="data-input form-control" data-field="duration_hours" placeholder="Duration (hours)">
                                <option value="">${LocaleManager.trans('Select Duration', 'labels')}</option>
                                    <option value="0.5">${LocaleManager.trans('30 minutes', 'labels')}</option>
                                    <option value="1.0">${LocaleManager.trans('1 hour', 'labels')}</option>
                                    <option value="1.5">${LocaleManager.trans('1.5 hours', 'labels')}</option>
                                    <option value="2.0">${LocaleManager.trans('2 hours', 'labels')}</option>
                                    <option value="2.5">${LocaleManager.trans('2.5 hours', 'labels')}</option>
                                    <option value="3.0">${LocaleManager.trans('3 hours', 'labels')}</option>
                                    <option value="4.0">${LocaleManager.trans('4 hours', 'labels')}</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <div class="vs-material-field">
                                <input data-type="date" name="scheduled_date" class="form-control data-input" data-field="scheduled_date" required />
                                <label vslang="labels.Scheduled Date"></label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="vs-material-field">
                                <input type="time" name="start_time" class="form-control data-input" data-field="start_time" placeholder=" " />
                                <label vslang="labels.Start Time">Start Time</label>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3 mb-3" id="price-preview-row" style="display:none;">
                        <div class="col-12">
                            <div class="alert alert-secondary d-flex align-items-center justify-content-between shadow-sm">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-calculator fa-2x me-3 text-primary"></i>
                                    <div>
                                        <small class="text-muted d-block mb-1"${LocaleManager.trans('Amount', 'titles')}</small>
                                        <strong class="fs-4 text-primary" id="calc-total">$0.00</strong>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <small class="text-muted d-block">${LocaleManager.trans('Price x Duration', 'labels')}</small>
                                    <span class="badge bg-primary" id="calc-breakdown">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                <label vslang="labels.Remark">Remark</label>
                            </div>
                        </div>
                    </div>
                </div>
            `,

            contentCreated: (me) => {
                // service change → auto-set unit_type & price
                me.controls.service_id?.addEventListener("change", () => {
                    const svc = (me._availableServices || []).find(
                        (s) => String(s.id) === me.controls.service_id.value,
                    );
                    if (svc) {
                        me.servicePrice = parseFloat(svc.price) || 0;
                        me.controls.unit_type.value =
                            svc.charge_as === "hour"
                                ? "2"
                                : svc.charge_as === "per_unit"
                                  ? "3"
                                  : "1";
                        _updatePricePreview(me);
                    }
                });

                ["unit_type", "duration_hours"].forEach((f) => {
                    me.controls[f]?.addEventListener("change", () =>
                        _updatePricePreview(me),
                    );
                });
            },

            onPrepareForm: (me, data) => {
                const d = data || {};

                me.controls.category_id?.addEventListener("change", () => {
                    const categoryId = me.controls.category_id.value;
                    const all = me._availableServices || [];
                    const filtered = categoryId
                        ? all.filter(
                              (s) =>
                                  String(s.category_id) === String(categoryId),
                          )
                        : all;

                    VSUtil.setComboItems(
                        me.controls.service_id,
                        filtered,
                        "id",
                        "service_name",
                        "",
                        "Select Service",
                    );

                    me.servicePrice = 0;
                    _updatePricePreview(me);
                });

                // me.controls.service_id.value = "";

                const spaces = d.building_spaces || [];
                VSUtil.setComboItems(
                    me.controls.space_id,
                    spaces,
                    "id",
                    "code",
                    "",
                    "Select Unit",
                );

                me._availableServices = d.services || [];
                console.log("First service object:", me._availableServices[0]);

                _populateCategoryAndService(me, me._availableServices);

                const detail = d.request_details || null;
                if (detail) {
                    if (detail.space_id) {
                        me.controls.space_id.value = String(detail.space_id);
                    }

                    _populateCategoryAndService(me, me._availableServices, {
                        category_id: detail.category_id,
                        service_id: detail.service_id,
                    });

                    if (me.controls.unit_type && detail.unit_type) {
                        me.controls.unit_type.value = String(detail.unit_type);
                    }

                    if (me.controls.duration_hours && detail.duration_hours) {
                        me.controls.duration_hours.value = String(
                            detail.duration_hours,
                        );
                    }

                    if (me.controls.scheduled_date && detail.scheduled_date) {
                        me.controls.scheduled_date.value =
                            detail.scheduled_date;
                    }
                    if (me.controls.start_time && detail.start_time) {
                        me.controls.start_time.value =
                            detail.start_time.substring(0, 5);
                    }

                    // Restore remarks
                    if (me.controls.remarks && detail.remarks) {
                        me.controls.remarks.value = detail.remarks;
                    }

                    _updatePricePreview(me);
                }
            },

            prepareFormOptions: {
                createTitle: "vslang:titles.Create Service Request",
                modifyTitle: "vslang:titles.Modify Service Request",
                targetProp: "request_details",
                api: {
                    endpoint: `${main_view.base_url}/tenant/request-service/form-options`,
                    params: (op) => ({ id: op.id }),
                },
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => me.hide(false),
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const data = me.getData();
                        data.id = op?.id || null;
                        const saveFailedMessage =
                            "Failed to save service request.";
                        vsapi
                            .call(
                                `${main_view.base_url}/tenant/request-service/save`,
                                data,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, data);
                                    cv_interact.success(
                                        data.id
                                            ? "Service Request has been updated!"
                                            : "Service Request has been created.",
                                    );
                                } else {
                                    cv_interact.error(
                                        res.error_message || saveFailedMessage,
                                    );
                                }
                            })
                            .catch(() => cv_interact.error(saveFailedMessage));
                    },
                },
            ],
        });

        dialog.show(op);
    };

    return self;
})();
