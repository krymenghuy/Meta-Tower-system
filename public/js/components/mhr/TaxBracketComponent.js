"use strict";
var TaxBracketComponent = (function() {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_taxBracketComponent"
    );

    mThis.title_prop = "Tax Bracket";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTaxBracket");
    mThis.divFilter =
        mThis.self.querySelector("#_divFilter_taxBracketComponent") ||
        mThis.self.querySelector("#_divFilter");

    const formattedNumber = number => {
        number = Number(number) || 0;
        return number
            .toLocaleString("en-US", {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            .replace(/,/g, " ");
    };

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>`,
        },
        {
            transTitle: "titles.Salary Range",
            className: "align-middle  text-nowrap ",
            data: (data, index, tr) => {
                const currency = data.currency_code || '';
                const lowerAmount = data.lower_amount;
                
                // Handle open-ended ranges (e.g., "$5,000 and upwards") 
                // vs bounded ranges (e.g., "$1,000 to $5,000 USD")
                const rangeText = data.upper_amount == -1 
                    ? `${lowerAmount} ${currency} ${LocaleManager.trans('and upwards', 'titles')}`
                    : `${LocaleManager.trans('Salary ranges from', 'titles')} ${lowerAmount} ${LocaleManager.trans('to', 'titles')} ${data.upper_amount} ${currency}`;

                return `<p class="p-0 m-0">${rangeText}</p>`;
            }
        },

        {
            transTitle: "titles.Rate",
            className: "align-middle  text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="text-danger p-0 m-0">${data.rate} %</p>`;
            }
        },
        {
            transTitle: "titles.Bias",
            className: "align-middle  text-nowrap ",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.bias,
                    data.currency_code
                )}</p>`;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle  text-nowrap ",
            data: data => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ??
                    ""}</span><br/>
                <small class="text-primary">${data.updated_at ?? ""}</small>
            </div>`
        },

        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_taxBracket_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.TaxBracketListView = new ListView("_taxBracket_list", {
            fetchApi: `${main_view.base_url}/mhr/tax-bracket/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null
        });

        if (mThis.divFilter) {
            mThis.divFilter.addEventListener("change", e => {
                e.preventDefault();
                mThis.TaxBracketListView.showPage(mThis.getDataFormFilter());
            });
        }
        mThis.btnAdd.onclick = function(e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.TaxBracketListView.showPage();
                }
            };
            // if (!AuthManager.allowed(253)) return;
            TaxBracketDialog.show(op);
        };
        mThis.pr_tbl = mThis.TaxBracketListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_taxBracket_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Tax Bracket</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_taxBracket"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Tax Bracket</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_taxBracket"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_taxBracket": {
                        mThis.editTaxBracket(id, menuLink);
                        break;
                    }
                    case "delete_taxBracket": {
                        mThis.deleteTaxBracket(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editTaxBracket = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            }
        };
        // if (!AuthManager.allowed(254)) return;
        TaxBracketDialog.show(op);
    };

    mThis.deleteTaxBracket = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            }
        };
        // if (!AuthManager.allowed(255)) return;
        cv_interact.confirm(
            "Delete this tax bracket?",
            {
                title: "Delete Tax Bracket",
                context: "delete",
                confirmButtonText: "Delete"
            },
            function(e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/tax-bracket/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then(res => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.TaxBracketListView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getDataFormFilter = () => {
        let p = {};
        if (mThis.divFilter) {
            mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
                const f = el.dataset.field;
                if (f) {
                    p[f] = el.value;
                }
            });
        }
        return p;
    };

    mThis.show = function() {
        mThis.init();

        // mThis.prepareFormOptions();
        mThis.TaxBracketListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const TaxBracketDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = op => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text"  name="lower_amount" class="form-control data-input" data-field="lower_amount" />
                                    <label vslang="titles.Lower Amount"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                     <input type="text"  name="upper_amount" class="form-control data-input" data-field="upper_amount" />
                                    <label vslang="titles.Upper Amount"></label>
                                </div>
                            </div>
                             <div class="col-6">
                                <div class="vs-material-field">
                                     <input type="text"  name="rate" class="form-control data-input" data-field="rate" />
                                    <label vslang="titles.Rate"></label>
                                </div>
                            </div>
                             <div class="col-6">
                                <div class="vs-material-field">
                                     <input type="text"  name="bias" class="form-control data-input" data-field="bias" />
                                    <label vslang="titles.Bias"></label>
                                </div>
                            </div>
                             <div class="col-6">
                                     <select  data-style="material" class="form-control data-input" name="currency_code" data-field="currency_code" placeholder="${LocaleManager.trans('Currency Code', 'labels')}">
                                     </select>
                                </div>
                            </div>

                        </div>`
                    ].join("");
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            me.hide(false);
                        }
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/tax-bracket/save"
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then(res => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success_tax_bracket",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_success_tax_bracket",
                                            );
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        }
                    }
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Tax Bracket",
                    modifyTitle: "vslang:titles.Modify Tax Bracket",
                    targetProp: "tax_bracket",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/tax-bracket/form-options"
                        ].join(""),
                        params: op => {
                            return { id: op.id };
                        }
                    }
                    //    onResponse: (me, res)=>{
                    //      console.log('result from api "/form-options": ', res);
                    //    }
                },
                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code"
                    }
                ],
                onPrepareForm: (me, data) => {
                    // me.controls.currency_code.value = VSMoney.getCurrency().code;
                }
            });

        dialog.show(op);
    };
    return self;
})();
