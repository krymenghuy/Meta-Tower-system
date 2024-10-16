"use strict";

var EmployeeBonusComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_bonusComponent");
    this.self = this.jm[0];
    this.title_prop = "Employee Bonus";
    this.btnAdd = this.self.querySelector("#_btnAddBonus");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_bonus");
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');


    this.cols = [

        {
            title: "No",
            className: 'align-middle text-capitalize text-nowrap',
            data: (data, index, i) => { return (index + 1) },

        },
        {
            title: "Category",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.name ?? ''}</p>`;
            }
        },
        {
            title: "Remark",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.remark ?? ''}</p>`;
            }
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${main_view.currency.symbol +data.amount ?? ''}</p>`;
            }
        },
        {
            title: "Action",
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-start align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <button class="btn btn-sm btn-primary b-btn-edit" data-id="${data.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                                <button class="btn btn-sm btn-danger b-btn-delete" data-id="${data.id}"><i class="fa-regular fa-trash-can"></i></button>
                            </a>
                        </div>
                    </div>
                `;
            }
        }
    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.BenefitListView = new ListView('_bonus_list',{
            fetchApi : `${main_view.base_url}/hr/benefit/list-paginate`,
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
                    mThis.BenefitListView.showPage();
                }
            };

            BenefitDailog.show(op);
        };

        const pr_tbl = mThis.BenefitListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        // mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.BenefitListView.showPage(mThis.getDataFormFilter());
        })

        mThis.setAction(pr_tbl);

        mThis.initAlready = true;

    };

    this.setAction = (tbl)=>{
        tbl.addEventListener('click', (e) => {

            let btn = VSUtil.closestLimited(e.target,'button.b-btn-delete');
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target,'button.b-btn-edit');
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
            console.log(123,btn);
        })
    }

    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.BenefitListView) {
                mThis.BenefitListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("Employee Benefit is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = e => {
        if (mThis.BenefitListView) {
            mThis.BenefitListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("Employee Benefit  is not defined");
        }
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

        return p;
    };



    this.editBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BenefitListView.showPage();
            }
        };
        console.log(333,op);

        BenefitDailog.show(op);
    }

    this.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BenefitListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Employee Benefit?',{
            title: 'Delete Employee Benefit',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/benefit/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.BenefitListView.showPage();
                    }
                })
            }
        });

    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        // mThis.prepareFormOptions();
            mThis.BenefitListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };
})

const BenefitDailog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
    cssClass:"",
    createContent:()=>{
      return [
       `<div class="form-group col-md-12">`,
          `<label class="form-label" vslang="titles.Category_id">Category</label>`,
          `<div><select name="category_id" class="form-control data-input" data-field="category_id"/></div>`,
       `</div>`,

        `<div class="form-group col-md-12">`,
          `<label class="form-label" vslang="titles.Remark"> Remark </label>`,
          `<div><input name="remark" class="form-control data-input" data-field="remark"/></div>`,
       `</div>`,

       `<div class="form-group col-md-12">`,
       `<label class="form-label" vslang="titles.Amount ">Amount</label>`,
       `<div><input name="amount" class="form-control data-input" data-field="amount"/></div>`,
    `</div>`,
     ].join('');
    },
    buttons:[
        {
           label:"<span>Cancel</span>",
           cssClass:"btn btn-warning",
           click:(me)=>{
              me.hide(false);
           }
        },
        {
           label:"<span>Save</span>",
           cssClass:"btn btn-primary",
           click:(me)=>{
              let p = me.getData();
              p.image = me.userImageBox? me.userImageBox.getImage(): '';
              console.log(222,p);
              vsapi.call([main_view.base_url,'/hr/benefit/save'].join(''),p,false,false).then(res =>{
                  if(res.status_code ==200){
                      me.modal.hide(true,p);
                  }else cv_interact.error(res.error_message);
              });
           }
        }
     ],
    // configSelect:[
    //    {
    //        name: "app",
    //        data:"apps",
    //        filterData:(data,res)=>{
    //            return data.options;
    //        }
    //    },
    //    {
    //      name:"category",
    //      data:"categories",
    //      textField:"category",
    //      valueField:"category"
    //    },
    //    {
    //        name:"module",
    //        data:"modules",
    //        filterOptions:{
    //            triggerBy:"app",
    //            filter:(me,data,controls)=>{
    //              return data.filter(x =>{
    //                 return x.app_id === controls.app.value;
    //              });
    //            }
    //        },

    //        valueField:"id",
    //        textField:"name",
    //        depends:{
    //            triggerBy:"app",
    //            api:{
    //                endpoint:`${main_view.base_url}/api/module/list`,
    //                params: (me,dataOptions,controls)=>{
    //                    return {"app_id": controls.app.value};
    //                },
    //                onResponse:(me,res)=>{
    //                     console.log(111,res.data);
    //                }
    //            }

    //        }
    //    }
    // ],
    prepareFormOptions:{
       createTitle:"New Employee Benefit",
       modifyTitle:"Edit Employee Benefit",
       targetProp:"benefit",
       api:{
           endpoint:`${main_view.base_url}/hr/benefit/form-options`,
           params:(op)=>{
               return {id: op.id};
           },
           onResponse:(me,res)=>{
           }
       }
    },
    onShow:(me)=>{
    //   me.controls.name.focus();
    //   me.controls.name.select();
    }
});
dialog.show(op);
    }
    return self;
})();
