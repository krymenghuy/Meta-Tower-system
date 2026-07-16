"use strict";
var TaxBracketComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_taxBracketComponent");
    
    mThis.title_prop = "Tax Bracket";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTaxBracket");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");

    const formattedNumber = (number) => {
        number = Number(number) || 0;
        return number
            .toLocaleString('en-US', {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
            .replace(/,/g, ' ');
    };

    mThis.cols = [
        {
            title: "#",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color:#1f386b; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            title: "Salary Range",
            className: "align-middle text-dark",
            data: (data, index, tr) => {
                const lowerAmount = data.lower_amount;
                const upperAmount = data.upper_amount == -1 ? 'ឡើងទៅ' : `ដល់ ${data.upper_amount} រៀល`;

                return `<p class="p-0 m-0">ប្រាក់ខែចាប់ពី ${lowerAmount} ${upperAmount}</p>`;
            }
        },
        {
            title: "Rate",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="text-danger p-0 m-0">${data.rate} %</p>`;
            }
        },
        {
            title: "Bias",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.bias, data.currency_code)}</p>`;
            }
        },
        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? ""}</span><br/>
                <small class="text-primary">${data.updated_at ?? ""}</small>
            </div>`,
        },

        {
            title: "",
            className: "col_action align-middle",
            data: (data) => `
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
            </div>`,
        },

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
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.TaxBracketListView.showPage(mThis.getDataFormFilter());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.TaxBracketListView.showPage();
                },
            };
            if (!AuthManager.allowed(253)) return;
            TaxBracketDialog.show(op);
        };
        mThis.pr_tbl = mThis.TaxBracketListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_taxBracket_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Edit">Modify Tax Bracket</span>',
                    icon: `<i class="fa-regular text-primary fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_taxBracket",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete">Delete Tax Bracket</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_taxBracket",
                },
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
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editTaxBracket = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            },
        };
        if (!AuthManager.allowed(254)) return;
        TaxBracketDialog.show(op);
    };

    mThis.deleteTaxBracket = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            },
        };
        if (!AuthManager.allowed(255)) return;
        cv_interact.confirm(
            "Delete this tax bracket?",
            {
                title: "Delete Tax Bracket",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/tax-bracket/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.TaxBracketListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };


    mThis.show = function () {
        mThis.init();
        
        // mThis.prepareFormOptions();
        mThis.TaxBracketListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const TaxBracketDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-md',
            backdrop: 'static',
            keyboard:true,
            createContent:()=>{
                 return [`<div class="row">
                <div class="form-group col-6">
                  <label for="lower_amount" class="form-label" vslang="titles.Lower Amount"></label>
                  <input name="lower_amount" class="form-control data-input" data-field="lower_amount" />
                </div>
                <div class="form-group col-6">
                  <label for="upper_amount" class="form-label" vslang="titles.Upper Amount"></label>
                  <input name="upper_amount" class="form-control data-input" data-field="upper_amount" />
                </div>
                <div class="form-group col-4">
                  <label for="rate" class="form-label" vslang="titles.Rate"></label>
                  <input name="rate" class="form-control data-input" data-field="rate" />
                </div>
                <div class="form-group col-4">
                  <label for="bias" class="form-label" vslang="titles.Bias"></label>
                  <input name="bias" class="form-control data-input" data-field="bias" />
                </div>
                <div class="form-group col-4">
                    <label for="currency_code" class="form-label" vslang="titles.Currency">Currency</label>
                    <select  class="modal-select data-input" name="currency_code" data-field="currency_code" disabled>
                    </select>
                </div>

              </div>`].join('');
            },

            buttons:[
               {
                label:'<span class="text-white">Cancel</span>',
                cssClass:'btn btn-sm btn-warning',
                click:(me,btn)=>{
                    //Close with Cancel button
                    me.hide(false);
                }
               },
               {
                label:'<span>Save</span>',
                cssClass:'btn btn-sm btn-primary',
                click:(me,btn)=>{
                    const p = me.getData();

                    p.id = me.dataOptions.id;
                    vsapi.call( [main_view.base_url,'/mhr/tax-bracket/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Create Tax Bracket',
               modifyTitle:'Edit Tax Bracket',
               targetProp: 'tax_bracket',
               api:{
                 endpoint: [main_view.base_url,'/mhr/tax-bracket/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
            //    onResponse: (me, res)=>{
            //      console.log('result from api "/form-options": ', res);
            //    }
            },
            configSelect: [
                {
                    name: "currency_code",
                    data: "currency_codes",
                    textField: "code",
                    valueField: "code",
                }
            ],
            onPrepareForm:(me, data)=>{
                 LocaleManager.translateZone(me.divModal);
                 me.controls.currency_code.value = VSMoney.getCurrency().code;
            }
        });

        dialog.show(op);
     }
    return self;
})();
