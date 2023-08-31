"use strict";
var PaymentPendingComponent = new function(){
    let mThis = this;
    this.title_prop = "Payment Pending";
    this.self = $("#_main_paymentPendingComponent");

    this.elSearch = mThis.self.find("#_ppd_search");

    let cur_symbol = "$";
    this.cols = [
        {
            title: "Name Khmer",
            data: "name_kh",
        },
        {
            title: "Name",
            data: "name",
        },
        {
            title: "Tuition",
            data: (data, a, b) => {
                return [cur_symbol, data.tuition].join(" ");
            },
        },
        {
            title: "Tuition Due",
            data: (data, a, b) => {
                return [cur_symbol, data.tuition_due].join(" ");
            },
        },
        {
            title: "Tuition Paid",
            data: (data, a, b) => {
                return [cur_symbol, data.tuition_paid].join(" ");
            },
        },
        {
            title: "Status",
            data: (data, a, b) => {
                let cls =
                    data.status === "pending"
                        ? "bg-danger"
                        : data.status === "verified"
                        ? "bg-info"
                        : "bg-success";
                return [
                    `<span class="p-2 ${cls} text-white rounded-3 text-capitalize"> ${data.status}</span>`,
                ].join("");
            },
        },
        {
            title: "Action",
            data: (data, a, b) => {
                let cls = data.status === "paid" ? "d-none" : "";
                return [
                    `<div class="d-flex gap-2">
                    <a href="javascript:void(0)" class="btn-ppd-modify ${cls}" data-id="${data.enrollment_id}">
                        <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                    </a>
                </div>`,
                ].join("");
            },
        },
    ];

    this.init = () => {
        mThis.itemView = new ListView("_ppd_tbl", {
            fetchApi: `${main_view.base_url}/api/price-list/pending/payment`,
            columns: mThis.cols,
            tableClass: "table header-light-blue header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
            },
            beforeRender: () => {},
        });

        mThis.tblPaymentPending = $(mThis.itemView.getTable());

        mThis.tblPaymentPending.on("click", "a.btn-ppd-modify", function (e) {
            e.preventDefault();
            let op = {
                id: $(this).data("id"),
                onClose: () => {
                    mThis.itemView.showPage(null);
                },
            };
            PaymentPendingDialog.show(op);
        });

        mThis.elSearch.on("change", function (e) {
            e.preventDefault();
            let op = {
                status_id: $(this).val(),
            };
            mThis.itemView.showPage(op);
        });
    };

    this.prepareOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/api/settings/status-options`,
                null,
                null
            )
            .then((res) => {
                let data = {};
                if (res.status_code === 200) {
                    data = res.data;
                }
                VSUtil.setComboItems(
                    mThis.elSearch,
                    data,
                    "id",
                    "name",
                    null,
                    null,
                    "4"
                );
            });
    };

    this.show = (options) => {
        if (!options) options = {};
        mThis.itemView.showPage(null, null, () => {
            mThis.prepareOptions();
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(":visible");
            x.fadeOut("fast", function () {
                mThis.self.hide().fadeIn(300);
            });
        });
    };
};

let PaymentPendingDialog = new function(){
    let mThis = this;
    this.self = $("#dlg_ppd_");
    this.options = {};

    this.btnSave = mThis.self.find("#dlg_ppd_btn_save");
    this.elPayment = mThis.self.find("#dlg_ppd_pmt");
    this.modalBody = mThis.self.find(".modal-body");

    mThis.elPayment.on("change",function(e){
        e.preventDefault();
        let op = {
            id: $(this).val(),
        };
        vsapi.call(`${main_view.base_url}/api/settings/payment-options`,op,null,false).then((res) => {
            if(res.status_code === 200){
                let div = mThis.modalBody.children().last();
                div.after([`<div class="form-group">
                    <label for="${res.data.name}" class="form-label text-capitalize">${res.data.name}</label>
                    <input type="number" class="form-control data-input" data-field="${res.data.name}"/>
                </div>`].join(''));
                if(div.length > 0)
                    div.remove();
            }
        });
    });

    mThis.btnSave.on("click", function (e) {
        e.preventDefault();
        mThis.validate.validator(() => {
            let p = mThis.getDataForm();
            vsapi.call(`${main_view.base_url}/api/price-list/update/pending-payment`,p,null).then((res) => {
                if(res.status_code === 200){
                    mThis.self.modal("hide");
                    if (typeof mThis.options.onClose === "function")
                        mThis.options.onClose();
                }
            });
        });
    });

    this.getDataForm = () => {
        let p = {
            id: mThis.options.id,
        };
        mThis.self.find(".data-input").each(function () {
            let el = $(this);
            let f = el.data("field");
            p[f] = el.val();
        });
        return p;
    };

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.validate.resetForm();
        mThis.self.find(".data-input").each(function () {
            let el = $(this);
            let f = el.data("field");
            if(el.is("select"))
                el.val(d[f]).trigger("change");
            else
                el.val(d[f]);
        });
    };

    this.prepareFormOption = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/form-option`,null,null).then((res) => {
            let d = {};
            if (res.status_code === 200) {
                d = res.data;
            }
            mThis.self.find(".data-input").each(function () {
                let el = $(this);
                let f = el.data("field");
                switch (f) {
                    case "pmt_option_id":
                        VSUtil.setComboItems(el,d.pmt_options,"id","name",null,null,null);
                        break;
                    case "session_id":
                        VSUtil.setComboItems(el,d.sessions,"id","name",null,null,null);
                        break;
                    case "level_id":
                        VSUtil.setComboItems(el,d.levels,"id","level",null,null,null);
                        break;
                    default:
                        break;
                }
            });

            if(typeof onFinish === "function") onFinish();
        });
    };

    this.loadFormDetails = (options) => {
        vsapi.call(`${main_view.base_url}/api/price-list/pending-payment/details`,{ id: options.id },null).then((res) => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
        });
    };

    this.validate = new FormValidator(mThis.self, {
        className: "data-input",
    });

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;

        mThis.prepareFormOption(() => {
            mThis.loadFormDetails(options);

            mThis.self.modal({
                backdrop: "static",
            });
        });
    };
};

window.addEventListener("DOMContentLoaded", () => {
    PaymentPendingComponent.init();
});
