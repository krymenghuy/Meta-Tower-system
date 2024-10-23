"use strict";

var EmployeeBenefitComponent = new (function () {
    const mThis = this;
    this.title_prop = "Employee Benefits";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employee_benefit_component");
    this.self = this.jm[0];

    this.btnAdd = this.self.querySelector("#_btn_add_benefit");
    this.form_data={};
    this.store_agents = {};
    this.listViewConfig = {};
    this.last_view_name = 'view_bonus';
    this.tabs = mThis.self.querySelector('ul#benefit-tabs');
    this.tabHeader = this.tabs;

    this.initListView = (view_name = null)=>{
        view_name = view_name || mThis.last_view_name;
        
        
        this.listViewConfig[view_name] =  new ListView(mThis.getContentList(view_name),{
            'fetchApi': `${main_view.base_url}/hr/employee/benefit/bonus-list`,
            'apiCluster': main_view.apiCluster,
            'columns': mThis.getColumns(view_name),
            'tableClass':"table  header-light-blue header-uppercase  bg-white ",
            // 'tableClass':"table styled-table ",
            listContainerClass: null,
            'processResponse':(res)=>{
               console.log(1,res.data.data);
                return res.data;    
            },
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
                mThis.setTrClassList(tr,view_name);
                // tr.classList.add("table-primary");
                // tr.classList.add("shadow");
                mThis.store_agents[data.id] = {
                    code: data.code,
                    name: data.name,
                    user_id: data.user_id,
                    phone_number: data.phone_number
                };
            },
            // renderItems: (items, list_container) => {
            //     // console.log(items);
            //     mThis.displaySalesAgents(list_container, items);
            // },
            'beforeRender':()=>{}
        });

        this.listViewConfig[view_name].showPage();
        const tbl = mThis.listViewConfig[view_name].getTable();


        this.container = mThis.listViewConfig[view_name].getListContainer();

        // mThis.setEvents(tbl,view_name);

        // // console.log('container',mThis.container.parentElement); 
        // const sh_parent = mThis.container.parentElement;
        // sh_parent.style.height = (window.innerHeight - 250)+'px';
        // sh_parent.classList.add('overflow-y-auto');
        // window.onresize = () => {
        //     sh_parent.style.height = (window.innerHeight - 250)+'px';
        // }
    }



    this.init = function () {
        if (mThis.initAlready) return;
        this.tabHeader.addEventListener('click', e=>{
            e.preventDefault();
            const lnk = VSUtil.closestLimited(e.target,'a.tab-button');
            
            if(lnk){

                let view_name = lnk.dataset.target || lnk.dataset.view;
            console.log(90,view_name);
                
                mThis.initListView(view_name);
                return;
            }
            
        });
       
        mThis.initListView(mThis.last_view_name);
      
        mThis.initAlready = true;
    };

    this.setTrClassList = (tr,view_name)=>{
        if(view_name == 'view_seniority'){
            // tr.classList.add("table");
            // tr.classList.add("shadow");
        }
        else{
            // tr.classList.add("table");
            // tr.classList.add("shadow");
        }
    }
    this.getEndPoint = (view_name) =>{
        if(view_name == 'view_seniority')
            return `${main_view.base_url}/hr/employee/benefit/seniority-list`;
        else 
            return `${main_view.base_url}/hr/employee/benefit/bonus-list`;
    }

   
    this.getContentList = (view_name) => {
        if(view_name == 'view_seniority')
            return '_seniority_list';
        else 
            return '_bonus_list'
    }
    this.getColumns = (view_name) =>{
        if(view_name == 'view_seniority')
            return mThis.seniority_cols;
        else return mThis.bonus_cols;
    }
    this.bonus_cols = [
        {
            title: "Photo",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                        </div>`;
            },
        },
        {
            title: "Benefit",
            className: "align-middle",
            data: "benefit_id",
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: "remarks",
        },
        {
            title: "Create date",
            className: "align-middle",
            data: "create_date",
        },
        {
            title: "Create By",
            className: "align-middle",
            data: "update_user",
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1
                                ? "d-none"
                                : "btn_employee_benefit_action"
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

    this.seniority_cols = [
        {
            title: "Photo",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                        </div>`;
            },
        },
        {
            title: "Seniority",
            className: "align-middle",
            data: "benefit_id",
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: "remarks",
        },
        {
            title: "Start date",
            className: "align-middle",
            data: "start_date",
        },
        {
            title: "End date",
            className: "align-middle",
            data: "create_date",
        },
        {
            title: "Create By",
            className: "align-middle",
            data: "update_user",
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <div class="text-end gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1
                                ? "d-none"
                                : "btn_employee_benefit_action"
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


    this.show = (options) => {
        mThis.init();
        if (!options) options = {};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        mThis.initListView(mThis.last_view_name);
        console.log(123,this.last_view_name);
        
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const EmployeeBenefitDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Name"></label>
                                <select name="employee" class=" data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group  col-12 d.none">
                            <div id="info"></div>
                            </div>
                            
                            <div class="form-group col-12">
                                <label for="benefit_type_id" class="form-label" vslang="titles.Benefit Type"></label>
                                <input type="number" name="benefit_type_id" class=" form-control data-input"  data-field="benefit_type_id"></input>
                            </div>
                        
                            <div class="form-group col-12">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <textarea  type="number" class="form-control data-input" data-field="amount"></textarea>
                            </div>
                            <div class="form-group col-12">
                                <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                                <textarea  type="text" class="form-control data-input" data-field="remarks"></textarea>
                            </div>

                         </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2 py-2"><img style="width:80px;height:50px margin-top:100px;margin-right:10px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span> <span>${d.email}</span><span> ${d.position} </span> </div></div>`;
                        },
                        // textField:"name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/benefit/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Employee Benefits",
                    modifyTitle: "Edit Employee Benefits",
                    targetProp: "benefit",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/benefit/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (me, res) => {
                        console.log('result from api "/form-options": ', res);
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
