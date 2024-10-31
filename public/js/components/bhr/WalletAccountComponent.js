var WalletAccountComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_walletAccountComponent");
    this.self = this.jm[0];
    this.title_prop = "Wallet Account";

    this.btnAdd = this.self.querySelector("#_btnWalletAddAccount");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_wallet_account");
    this.elSortBy = this.self.querySelector('#el_sort_by');

    this.cols = [

        {
            title: "No",
            className: 'align-middle',
            data: (data, index, i) => { return (index + 1) },

        },
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap w-15",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.emp_name ?? ''}</span>
                                <br/>
                                <span style="font-size: 12px; color: gray;">${data.position ?? ''}</span>
                            </div>
                        </div>`;
            }
        },
        {
            title: "Account Type",
            className: "align-middle",
            data: (data, index, tr) => {
                const accountType = mThis.AccountTypeMap[data.account_type_id] || "Payroll";
                const backgroundColor = accountType === "Wallet" ? "info" : "success";
                return `<p class="p-2 text-center rounded-5 m-0 border text-white w-50 bg-${backgroundColor}">${accountType}</p>`;
            }
        },

        {
            title: "Account Number",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.account_number ?? ''}</p>`;
            }
        },


        {
            title: "Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.balance ?? ''}</p>`;
            }
        },
        {
            title: "Last Balance Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.last_balance_date ?? ''}</p>`;
            }
        },
        {
            title: "Currency",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.currency ?? ''}</p>`;
            }
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${data.action_id > 1 ? "d-none" : "btn_wallet_account_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.WalletAccountListView = new ListView('_wallet_account_list',{
            fetchApi : `${main_view.base_url}/hr/wallet-account/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white overflow-hidden  header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                btn: e.target,
                onClose: () => {
                    mThis.WalletAccountListView.showPage();
                }
            };

            WalletAccountDialog.show(op);
        };

        const pr_tbl = mThis.WalletAccountListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.WalletAccountListView.showPage(mThis.getDataFormFilter());
        })

        mThis.initAlready = true;

    };
    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WalletAccountListView) {
                mThis.WalletAccountListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("Wallet account is not defined");
            }
        }, 200);
    });

    this.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_wallet_account_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[

                {
                    html:'<span class="ps-2  " vslang="titles.Modify Account">Modify Account</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_wallet_account"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Account">Delete Account</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_wallet_account"
                },

            ],

            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_wallet_account':{
                      mThis.editWalletAccount(id, menuLink);
                      break;
                    }
                    case 'delete_wallet_account':{
                        mThis.deleteWalletAccount(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    this.editWalletAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WalletAccountListView.showPage();
            }
        };

        WalletAccountDialog.show(op);
    }

    this.deleteWalletAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WalletAccountListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Account?',{
            title: 'Delete Account',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/wallet-account/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.WalletAccountListView.showPage();
                    }
                })
            }
        });

    }

    this.getDataFormFilter = () => {
        let p = {};

        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

        return p;
    };
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/wallet-account/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elSortBy);

            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'Default', null);

            mThis.AccountTypeMap = d.account_types.reduce((map, account_type) => {
                map[account_type.id] = account_type.account_type;
                return map;
            })
        })
    }


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.WalletAccountListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };

})()

const WalletAccountDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog = dialog || new GeneralDialog({
            cssClass:'modal-lg',
            backdrop: 'static',
            keyboard:true,
            createContent:()=>{
                 return [`<div class="row">
                    <div class="form-group col-12">
                        <label for="employee" class="form-label" vslang="titles.Employee"></label>
                        <select name="employee" class=" data-input"  data-field="emp_id"></select>
                    </div>
                    <div class="form-group  col-12 d.none">
                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="account_type" class="form-label" vslang="titles.Account Type"></label>
                        <select name="account_type" class=" data-input"  data-field="account_type_id"></select>
                    </div>
                    <div class="form-group col-6">
                        <label for="account_number" class="form-label" vslang="titles.Account Number"></label>
                        <input name="account_number" class="form-control data-input" data-field="account_number" />
                    </div>
                    <div class="form-group col-6">
                        <label for="ballance" class="form-label" vslang="titles.Balance"></label>
                        <input name="ballance" class="form-control data-input" data-field="balance" />
                    </div>
                    <div class="form-group col-6">
                        <label for="currency" class="form-label" vslang="titles.Currency"></label>
                        <input name="currency" class="form-control data-input" data-field="currency" />
                    </div>
                    </div>


              </div>`].join('');
            },

            configSelect:[
               {
                 name:"employee",
                 data:'employees',
                 textField:(me, d)=> {return `<div class="d-flex gap-2"><img style="width:35px;height:35px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`; },
                // textField:"name",
                 valueField:'id'
               },
               {
                name:"account_type",
                data:'account_types',
                textField:"account_type",
                valueField:'id'
               },

            ],
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

                    vsapi.call( [main_view.base_url,'/hr/wallet-account/save'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Add Account',
               modifyTitle:'Edit Account',
               targetProp: 'wallet_account',
               api:{
                 endpoint: [main_view.base_url,'/hr/wallet-account/form-options'].join(''),
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
