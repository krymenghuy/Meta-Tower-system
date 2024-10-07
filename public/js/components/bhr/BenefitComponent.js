"use strict";

var EmployeeBenefitComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_benefitComponent");
    this.self = this.jm[0];
    this.title_prop = "Employee Benefit";
    this.btnAdd = this.self.querySelector("#_btnAddBenefit");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_benefit");
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
                return `<p class="p-0 m-0">${data.category ?? ''}</p>`;
            }
        },
        {
            title: "Description",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.description ?? ''}</p>`;
            }
        },
        {
            title: "Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.amount ?? ''}</p>`;
            }
        },
        {
            title: "Action",
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
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

        mThis.BenefitListView = new ListView('_benefit_list',{
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

            mThis.BenefitDailog.show(op);
        };

        const pr_tbl = mThis.BenefitListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 150) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        window.onresize = function(e) {
            e.preventDefault();
            sh_parent.style.height = (window.innerHeight - 150) + 'px';
        };
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

    this.BenefitDailog = mThis.BenefitDailog || new GeneralDialog({
        cssClass:"",
        createContent:()=>{
          return [
           `<div class="form-group col-md-12">`,
              `<label class="form-label" vslang="titles.Category">Category</label>`,
              `<div><input name="category" class="form-control data-input" data-field="category"/></div>`,
           `</div>`,

            `<div class="form-group col-md-12">`,
              `<label class="form-label" vslang="titles.Description"> Description </label>`,
              `<div><input name="description" class="form-control data-input" data-field="description"/></div>`,
           `</div>`,

           `<div class="form-group col-md-12">`,
           `<label class="form-label" vslang="titles.Amount ">Amount</label>`,
           `<div><input name="amount" class="form-control data-input" data-field="amount"/></div>`,
        `</div>`,
         ].join('');
        },
        showCancelButton:true,
        buttons:[
             {
               label:"<span>Save</span>",
               click:(me,btn, divModal)=>{
                   let p = me.getData();
                   console.log(111,p);

                   vsapi.call(`${main_view.base_url}/hr/benefit/save`,p,false, false,false).then(res =>{
                       if(res.status_code ==200){
                           me.hide();
                        //   let app_id =  me.controls.app.value;
                        //   if(app_id){
                        //     that.elAppFilter.value = app_id;
                        //     that.elAppFilter.dispatchEvent(new Event("change"));
                        //   }
                          cv_interact.success(['Benefit has been saved'].join(''));
                       }else cv_interact.error(res.error_message);
                   })
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
                    console.log(111,res);
               }
           }
        },
        onShow:(me)=>{
        //   me.controls.name.focus();
        //   me.controls.name.select();
        }
    });

    // this.BenefitDailog.show(op);



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




    // this.initDropdownMenus = (table)=>{
    //     const menuOptopns = {
    //         containerElement: table,
    //         actionButtonClass:"btn_benefit_action",
    //         cssClass:"bg-white shadow",
    //         //menuItemClass:"",
    //         menus:[

    //             {
    //                 html:'<span class="ps-2  " vslang="titles.Modify Employee Benefit">Modify Employee Benefit</span>',
    //                 icon:`<i class="fa-regular fa-edit fs-5"></i>`,
    //                 cssClass:"border-bottom pb-2",
    //                 name:"edit_benefit"
    //             },
    //             {
    //                 html:'<span class="ps-2  " vslang="titles.Delete Employee Benefit">Delete Employee Benefit</span>',
    //                 icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
    //                 cssClass:"border-bottom pb-2",
    //                 name:"delete_benefit"
    //             },

    //         ],

    //         onClick:(menuLink, id, name)=>{
    //             switch(name){

    //                 case 'edit_benefit':{
    //                   mThis.editBenefit(id, menuLink);
    //                   break;
    //                 }
    //                 case 'delete_benefit':{
    //                     mThis.deleteBenefit(id, menuLink);
    //                     break;
    //                   }

    //                 default:{
    //                   break;
    //                 }
    //             }
    //         }
    //     }
    //     new VSDropdownMenu(menuOptopns);
    // }

    this.editBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BenefitListView.showPage();
            }
        };
        console.log(333,op);

        mThis.BenefitDailog.show(op);
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
