"use strict";

var TaxBracketComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_taxBracketComponent");
    this.self = this.jm[0];
    this.title_prop = "Tax Bracket";
    this.btnAdd = this.self.querySelector("#_btnAddTaxBracket");
    this.divFilter = this.self.querySelector("#_divFilter");

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

    this.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap text-left",
            // data: (data, index, i) => {
            //     return index + 1;
            // },
        },
        {
            title: "Lower Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol + formattedNumber(data.lower_amount) ?? '0.00'}</p>`;
            }
        },

        {
            title: "Upper Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                let upperAmount = Number(data.upper_amount) === -1 ? '∞' : (main_view.currency.symbol + formattedNumber(data.upper_amount) ?? '0.00');
                return `<p class="p-0 m-0">${upperAmount}</p>`;
            }
        },


        {
            title: "Rate",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.rate ?? '0.00'} %</p>`;
            }
        },
        {
            title: "Bias",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol + formattedNumber(data.bias)}</p>`;
            }
        },
        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? ""}</span><br/>
                <small >${data.update_date ?? ""}</small>
            </div>`,
        },

        {
            title: "",
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
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

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.TaxBracketListView = new ListView("_taxBracket_list", {
            fetchApi: `${main_view.base_url}/hr/tax-bracket/list-paginate`,
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
            TaxBracketDailog.show(op);
        };
        const pr_tbl = mThis.TaxBracketListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 215) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 215) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);

        mThis.initAlready = true;
    };

    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_taxBracket_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Tax Bracket">Modify Tax Bracket</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_taxBracket",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Tax Bracket">Delete Tax Bracket</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
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

    this.editTaxBracket = (id, menuLink) => {
        console.log(234, id);

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            },
        };
        TaxBracketDailog.show(op);
    };

    this.deleteTaxBracket = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Tax Bracket?",
            {
                title: "Delete Tax Bracket",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/tax-bracket/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.TaxBracketListView.showPage();
                            }
                            else {
                                cv_interact.error(res.message);
                            }
                        });
                }
            }
        );
    };


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        // mThis.prepareFormOptions();
        mThis.TaxBracketListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };

})

const TaxBracketDailog = (()=>{

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
                <div class="form-group col-6">
                  <label for="rate" class="form-label" vslang="titles.Rate"></label>
                  <input name="rate" class="form-control data-input" data-field="rate" />
                </div>
                <div class="form-group col-6">
                  <label for="bias" class="form-label" vslang="titles.Bias"></label>
                  <input name="bias" class="form-control data-input" data-field="bias" />
                </div>

              </div>`].join('');
            },

            buttons:[
               {
                label:'<span class="text-warning">Cancel</span>',
                cssClass:'btn btn-default',
                click:(me,btn)=>{
                    //Close with Cancel button
                    me.hide(false);
                }
               },
               {
                label:'<span>Save</span>',
                cssClass:'btn btn-primary',
                click:(me,btn)=>{
                    const p = me.getData();

                    p.id = me.dataOptions.id; //get "id" from op

                    vsapi.call( [main_view.base_url,'/hr/tax-bracket/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Tax Bracket',
               modifyTitle:'Edit Tax Bracket',
               targetProp: 'tax_bracket',
               api:{
                 endpoint: [main_view.base_url,'/hr/tax-bracket/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
            //    onResponse: (me, res)=>{
            //      console.log('result from api "/form-options": ', res);
            //    }
            },

            onPrepareForm:(me, data)=>{
                 LocaleManager.translateZone(me.divModal);
            }

        });

        dialog.show(op);
     }

    return self;
})();
