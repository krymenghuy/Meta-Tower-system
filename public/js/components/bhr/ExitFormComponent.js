"use strict";

var ExitFormComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_exit_form_component");
    this.self = this.jm[0];
    this.title_prop = "Exit Form";
    this.btnAdd = this.self.querySelector("#_btnAddExitForm");
    // this.btnPrint = this.self.querySelector("#_btnPrintExitForm");
    this.elSearch = this.self.querySelector("#_exit_form_search");
    this.divFilter = this.self.querySelector("#container_exit_form");
    this.viewExitForm = this.self.querySelector("#view_exit_form_");
    this.cols = [
        {
            title: "Name",
            className: "align-middle text-start w-25",
            data: (data) => {
                return `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${
                        data.image_url
                    }" alt=""
                        style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.emp_name ?? ""
                        }</span><br/>
                        <span style="font-size: 12px; color: gray;">${
                            data.email ?? ""
                        }</span>
                    </div>
                </div>`;
            },
        },
        {
            title: "Postion",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${data.position}</span>`,
        },
        {
            title: "Form Name",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.name ?? "Null"
                }</span>`,
        },
        {
            title: "Amount",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.amount ?? "Null"
                }</span>`,
        },
        {
            title: "Remarks",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.remarks ?? "Null"
                }</span>`,
        },
        {
            title: "Status",
            className: "status text-nowrap align-middle",
            data: (data) => {
                let statusText = "text-white text-center border rounded-5";
                let statusClass = "";

                if (data.status == "1") {
                    statusText = "Done";
                    statusClass =
                        "text-white text-center bg-success border border-info rounded-5 p-1";
                } else if (data.status == "2") {
                    statusText = "Not Yet";
                    statusClass =
                        "text-white text-center bg-warning border border-info rounded-5 p-1";
                }

                return `
            <p class="p-0 m-0 text-white ${statusClass}" style="border-radius: 5px; padding: 5px;">
                ${statusText}
            </p>
        `;
            },
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-exit_form-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-exit_form-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-success btn-exit_form-view" data-id="${data.id}" data-emp_id="${data.emp_id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-eye"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.ExitFormListView = new ListView("_exit_form_list", {
            fetchApi: `${mThis.base_url}/hr/exit-form/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormListView.showPage();
                },
            };
            ExitFormDialog.show(op);
        };
        // mThis.btnPrint.onclick = function (e) {
        //     e.preventDefault();
        //     window.print();
        // };
        const pr_tbl = mThis.ExitFormListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.ExitFormListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.ExitFormListView) {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            } else {
                console.error("Exit Form is not defined");
            }
        }, 200);
    });

    this.setFilterPeriod = (p) => {
        return p;
    };

    this.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-exit_form-modify");
            if (btn) {
                mThis.edit_exit_form(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form-delete");
            if (btn) {
                mThis.delete_exit_form(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-exit_form-view");
            if (btn) {
                mThis.view_exit_form(btn.dataset.emp_id, btn);
            }
            console.log(123, btn);
        });
    };
    this.edit_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        console.log(20020, op);

        ExitFormDialog.show(op);
    };
    this.delete_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Item Status?",
            {
                title: "Delete this Item Status?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/exit-form/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Item Status Delete Successfully"
                                );
                                mThis.ExitFormListView.showPage();
                            }
                        });
                }
            }
        );
    };
    this.view_exit_form = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage();
            },
        };
        ViewExitFormDialog.show(op);
    };

    this.prepareFormOptions = () => {
        vsapi.call(
            `${main_view.base_url}/hr/exit-form/form-options`,
            null,
            null,
            null
        );
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.ExitFormListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const ExitFormDialog = (() => {
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
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class="form-control data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="form_name" class="form-label" vslang="titles.Form Name"></label>
                                <input name="form_name" class="form-control data-input" data-field="name" id="form_name">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="amount" class="form-label" vslang="titles.amount"></label>
                                <input name="amount" class="form-control data-input" data-field="amount" id="amount">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                                <input name="remarks" class="form-control data-input" data-field="remarks" id="amount">
                            </div>
                            <div class="form-group col-md-12">
                                <label for="status" class="form-label" vslang="titles.Status"></label>
                                <select name="status" class="modal-select data-input" data-field="status" id="amount">
                                    <option value="1">Done</option>
                                    <option value="2">Not Yet</option>
                                </select>
                            </div>
                            
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class=""><i class="fa-solid text-danger fa-xmark"></i></span>',
                        cssClass: "btn btn-sm-outline rounded-3",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span><i class="fa-solid text-success fa-check"></i></span>',
                        cssClass: "btn btn-sm-outline rounded-3",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/exit-form/save",
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
                contentCreated: (me, divModal) => {
                    me.saveBenefitDisburse = (bd) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add Exit Form",
                    modifyTitle: "Edit Exit Form",
                    targetProp: "exit_forms",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/exit-form/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (me, res) => {
                        console.log("API Response:", res);
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

const renderExitForm = (data) => {
    //  return [
    //      `<h5 class="text-center justify-center mb-4">ឯកសារដែលត្រូវនាំមកជូន</h5>
    //                     <div class="row mb-3">
    //                         <div class="form-group col-md-12">
    //                             <label for="employee" class="form-label" vslang="titles.ឈ្មោះបុគ្គលិក"></label>
    //                             <div name="employee" class="form-control data-input"  data-field="emp_id"></div>
    //                         </div>
    //                         <div>
    //                             <label>អត្តលេខ:</label>
    //                             <div type="text" class="form-control data-input" data-field="code"></div>
    //                         </div>
    //                         <div class="form-group col-6">
    //                             <label for="start_date" class="form-label" vslang="titles.កាលបរិច្ឆេទចូលធ្វើការ៖"></label>
    //                             <div name="start_date" class="form-control data-input form_input" data-field="start_date"></div>
    //                         </div>
    //                     </div>
    //                     <div class="row mb-3">
    //                         <div class="col-md-6">
    //                             <label>នាយកដ្ឋាន ឬសាខា៖</label>
    //                             <div type="text" class="form-control data-input" data-field="branch_name"></div>
    //                         </div>
    //                         <div class="form-group col-6">
    //                             <label for="effective_date" class="form-label" vslang="titles.កាលបរិច្ឆេទបិទការងារ៖"></label>
    //                             <div name="effective_date" class="form-control data-input form_input" data-field="effective_date" <div/>
    //                         </div>
    //                     </div>
    //                     <div class="row mb-3 justify-center">
    //                         <div class="col-md-12">
    //                             <label>គោលបំណង:</label>
    //                             <div class="form-check form-check-inline">
    //                                 <input class="form-check-input data-input" data-field="status_id" type="checkbox" id="status_id">
    //                                 <label class="form-check-label" for="status_id">ការលាលែងពីតំណែង</label>
    //                             </div>
    //                             <div class="form-check form-check-inline">
    //                                 <input class="form-check-input data-input" data-field="terminate" type="checkbox" id="terminate">
    //                                 <label class="form-check-label" for="terminate">ការបញ្ចប់</label>
    //                             </div>
    //                             <div class="form-check form-check-inline">
    //                                 <input class="form-check-input" type="checkbox" id="purpose3">
    //                                 <label class="form-check-label" for="purpose3">ផ្សេងៗ  (សូមបញ្ជាក់)៖</label>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <table class="table table-bordered">
    //                         <thead>
    //                             <tr>
    //                                 <th>អ្នកទទួលខុសត្រូវ</th>
    //                                 <th class="col-4">បរិយាយព័ត៌មានលំអិត</th>
    //                                 <th>កាលបរិច្ឆេទត្រូវបានជម្រះ</th>
    //                                 <th>ទឹកប្រាក់ទូទាត់</th>
    //                                 <th>ចំណាំ</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             <tr>
    //                                 <td rowspan="2" class="text-center justify-center align-center">បេឡាធិការ</td>
    //                                 <td>
    //                                     <div class="form-check">
    //                                         <label class="form-check-label text-dark" for="doc1">ប្រគល់សម្ភារៈ និងបរិក្ខារផ្សេងៗ៖ </label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc1">កាតាប </label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc2">មួកសុវត្តិភាព</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc2">សៀវភៅកត់ត្រា</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc2">ID Card</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc2">អាវយឺត</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc2">អាវក្រៅ</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc1">
    //                                         <label class="form-check-label" for="doc2">ត្រាឈ្មោះ</label>
    //                                     </div>
    //                                 </td>
    //                                 <td></td>
    //                                 <td></td>
    //                             </tr>
    //                             <tr>
    //                                 <td>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc2">
    //                                         <label class="form-check-label" for="doc2">ប្រគល់ស៊ីមកាត</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc2">
    //                                         <label class="form-check-label" for="doc2">ឯកសារកម្ចី</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc2">
    //                                         <label class="form-check-label" for="doc2">ផ្សេងៗ ចូររៀបរាប់៖ </label>
    //                                     </div>
    //                                 </td>
    //                                 <td></td>
    //                                 <td></td>
    //                             </tr>
    //                             <tr>
    //                                 <td rowspan="2" class="text-center justify-center align-center">នាយកសាខា/ថ្នាក់គ្រប់គ្រងផ្ទាល់</td>
    //                                 <td>
    //                                     <div class="form-check">
    //                                         <label class="form-check-label" for="doc3">កូនសោដែលជំពាក់៖</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ការិយាល័យ</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ទូដែក</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ទូដាក់ឯកសារ ។ល។</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ទូដាក់ឯកសារ ។ល។</label>
    //                                     </div>
    //                                 </td>
    //                                 <td></td>
    //                                 <td></td>
    //                             </tr>
    //                             <tr>
    //                                 <td>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc4">
    //                                         <label class="form-check-label" for="doc4">កុំព្យូទ័រ Laptop</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc4">
    //                                         <label class="form-check-label" for="doc4">ការទូទាត់ប្រាក់កម្ចី</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc4">
    //                                         <label class="form-check-label" for="doc4">ការផាកពិន័យលើកិច្ចសន្យាការងារ</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc4">
    //                                         <label class="form-check-label" for="doc4">ប្រាក់សំណងលើការកេងបន្លំ</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc4">
    //                                         <label class="form-check-label" for="doc4">ផ្សេងៗ ចូររៀបរាប់៖</label>
    //                                     </div>
    //                                 </td>
    //                                 <td></td>
    //                                 <td></td>
    //                             </tr>
    //                             <tr>
    //                                 <td class="text-center justify-center align-center">មន្រ្តីធនធានមនុស្ស</td>
    //                                 <td>
    //                                     <label class="form-check-label" for="doc3">គណនីអ៊ីមែលត្រូវបានដកចេញ</label>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ការលុបចោលធានារ៉ាប់រង និងកាត</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ការឈប់សម្រាកប្រចាំឆ្នាំ (សល់ ឬជំពាក់)</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ប្រាក់សោធននិវត្តន៍៣%</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ប្រាក់សោធននិវត្តន៍៥%</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ប្រាក់បៀវត្ស (ចំនួនថ្ងៃការងារ)/label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ប្រាក់ជួលម៉ូតូ</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ប្រាក់លើកទឹកចិត្ត</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ជាប់កិច្ចសន្យាវគ្គបណ្តុះបណ្តាល</label>
    //                                     </div>
    //                                     <div class="form-check">
    //                                         <input class="form-check-input" type="checkbox" id="doc3">
    //                                         <label class="form-check-label" for="doc3">ផ្សេងៗ ចូររៀបរាប់៖</label>
    //                                     </div>
    //                                 </td>
    //                                 <td></td>
    //                                 <td></td>
    //                             </tr>
    //                             <tr>
    //                                 <td class="text-center justify-center align-center">
    //                                     <label class=" form-check-label text-center justify-center align-center" for="doc5">យោបល់ផ្សេងទៀត៖</label>
    //                                 </td>
    //                                 <td colspan="4">
    //                                     <input class="form-check-label" style="width:100%; padding:10px; border:none; outline:none; color:grey; font-width:normal" for="doc5" placeholder="បញ្ចេញមតិយោបលនៅទីនេះ...">
    //                                 </td>
    //                             </tr>
    //                             <hr />
    //                             </tbody>
    //                         </table>
    //                         <table class="table table-bordered">
    //                             <thead>
    //                                 <th>បុគ្គលិក</th>
    //                                 <th>បញ្ជាក់ដោយ</th>
    //                                 <th>បញ្ជាក់ដោយ</th>
    //                                 <th>បញ្ជាក់ដោយ</th>
    //                                 <th>អនុម័តដោយ</th>
    //                             </thead>
    //                             <tbody>
    //                             <tr>
    //                                 <td><span>.........................................</span></td>
    //                                 <td><span>.........................................</span></td>
    //                                 <td><span>.........................................</span></td>
    //                                 <td><span>.........................................</span></td>
    //                                 <td><span>.........................................</span></td>
    //                             </tr>
    //                             <tr>
    //                                 <td>ហត្ថលេខា</td>
    //                                 <td>ហត្ថលេខា</td>
    //                                 <td>ហត្ថលេខា</td>
    //                                 <td>ហត្ថលេខា</td>
    //                                 <td>ហត្ថលេខា</td>
    //                             </tr>
    //                             <tr>
    //                                 <td>ឈ្មោះ ................................</td>
    //                                 <td>ឈ្មោះ ................................</td>
    //                                 <td>ឈ្មោះ ................................</td>
    //                                 <td>ឈ្មោះ ................................</td>
    //                                 <td>ឈ្មោះ ................................</td>
    //                             </tr>
    //                             <tr>
    //                                 <td>តំណែង ..............................</td>
    //                                 <td>តំណែង ..............................</td>
    //                                 <td>តំណែង ..............................</td>
    //                                 <td>តំណែង ..............................</td>
    //                                 <td>តំណែង ..............................</td>
    //                             </tr>
    //                             <tr>
    //                                 <td>
    //                                     <div class="align-left">
    //                                         <label for="date" class="form-label" vslang="titles.កាលបរិច្ឆេទ"></label>
    //                                         <input name="date" class="form-control data-input" data-field="date" />
    //                                     </div>
    //                                 </td>
    //                                 <td>
    //                                     <div class="align-left">
    //                                         <label for="date" class="form-label" vslang="titles.កាលបរិច្ឆេទ"></label>
    //                                         <input name="date" class="form-control data-input" data-field="date" />
    //                                     </div>
    //                                 </td>
    //                                 <td>
    //                                     <div class="align-left">
    //                                         <label for="date" class="form-label" vslang="titles.កាលបរិច្ឆេទ"></label>
    //                                         <input name="date" class="form-control data-input" data-field="date" />
    //                                     </div>
    //                                 </td>
    //                                 <td>
    //                                     <div class="align-left">
    //                                         <label for="date" class="form-label" vslang="titles.កាលបរិច្ឆេទ"></label>
    //                                         <input name="date" class="form-control data-input" data-field="date" />
    //                                     </div>
    //                                 </td>
    //                                 <td>
    //                                     <div class="align-left">
    //                                         <label for="date" class="form-label" vslang="titles.កាលបរិច្ឆេទ"></label>
    //                                         <input name="date" class="form-control data-input" data-field="date" />
    //                                     </div>
    //                                 </td>
    //                             </tr>
    //                         </tbody>
    //                     </table>`,
    //  ].join("");
};

const ViewExitFormDialog = (() => {
    const self = {};
    let dialog = null;

    const generateTableHeaders = (thead) => {
        return thead
            .map((t) => {
                const headerName = t.name.toLowerCase();
                const displayName =
                    headerName === "starting date"
                        ? "Admission Date"
                        : headerName === "tuition fee"
                        ? "School Fee"
                        : t.name ?? "";

                return `
                    <th class="table-header bg bg-secondary">
                        ${displayName}
                    </th>`;
            })
            .join("");
    };

    const generateTableBody = (tbody, thead) => {
        return Object.entries(tbody)
            .map(([key, d]) => {
                const rowData = thead
                    .map((k) => {
                        const cellData = d[k.key] ?? "";

                        if (k.key === "name") {
                            return `<td class="text-capitalize">${cellData}</td>`;
                        }

                        if (Array.isArray(cellData)) {
                            const divContent = cellData
                                .map((item) => {
                                    const itemName =
                                        typeof item === "object" &&
                                        item !== null
                                            ? item.item_name ?? ""
                                            : item;

                                    return `
                                    <div class="d-flex align-items-center justify-center">
                                        <input type="checkbox" class="form-check-input disabled" checked />
                                        <span class="ms-2">${itemName}</span>
                                    </div>`;
                                })
                                .join("");

                            return `<td class="text-start">${divContent}</td>`;
                        }
                        return `<td class="text-start">${cellData}</td>`;
                    })
                    .join("");

                return `<tr class="table-row">${rowData}</tr>`;
            })
            .join("");
    };
const generateEmployeeInfo = (employeeInfo) => {
    console.log(123, employeeInfo);
    
    const {
        emp_name = "",
        position = "",
        code = "",
        start_date = "",
        branch_name = "",
        effective_date = "",
        purpose = "resignation",
    } = employeeInfo[0];

    return `
                <div class="employee-info-section d-block">
                    <div class="d-flex" style="justify-content:space-between; width:100%">
                        <div style="width:33%; justify-content:flex-start; align-self:left">ឈ្មោះបុគ្គលិក៖ ${emp_name}</div>
                        <div style="width:33%; justify-content:flex-start; align-self:left">អត្តលេខ៖ ${code}</div>
                        <div style="width:33%; justify-content:flex-start; align-self:left">កាលបរិច្ឆេទចូលធ្វើការ៖ ${start_date}</div>
                    </div>
                    <div class="d-flex mt-4" style="justify-content:space-between; width:100%">
                        <div style="width:33%; justify-content:flex-start; align-self:left">ផ្នែក៖ ${position}</div>
                        <div style="width:33%; justify-content:flex-start; align-self:left">នាយកដ្ឋាន ឬសាខា៖ ${branch_name}</div>
                        <div style="width:33%; justify-content:flex-start; align-self:left">កាលបរិច្ឆេទបិទការងារ៖ ${effective_date}</div>
                    </div>
                    
                    <div class="d-flex mt-4 text-center gap-5">
                        <span>គោលបំណង៖</span>
                        <div class="d-flex disabled">
                            <div class="form-check me-3">
                                <input class="form-check-input" type="checkbox" id="resignation" checked />
                                <label class="form-check-label" for="resignation">ការលាលែងពីតំណែង</label>
                            </div>
                            <div class="form-check me-3">
                                <input class="form-check-input" type="checkbox" id="terminate" />
                                <label class="form-check-label" for="terminate">ការបញ្ចប់</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="other" />
                                <label class="form-check-label" for="other">ផ្សេងៗ  (សូមបញ្ជាក់)៖</label>
                            </div>
                        </div>
                    </div>
            </div>`;
};
    self.show = (op) => {
        vsapi
            .call(`${main_view.base_url}/hr/exit-form-item/list-all`, {
                emp_id: op.id,
            })
            .then((res) => {
                if (res.status_code === 200) {
                    const d = res.data ?? {};
                    const {
                        header: thead = [],
                        list: tbody = [],
                        title = "",
                        
                    } = d;
                    const employee = d.employee ?? {};
                    let htmlString = `
                        <div class="d-block position-relative min-height-top">
                            <div class="d-flex flex-column gap-2 justify-content-center align-items-center">
                                <h4 class="text-center text-uppercase">${title}</h4>
                            </div>
                            <div class="employee-info-section mt-4">
                                ${generateEmployeeInfo(employee)}
                            </div>
                        </div>
                        <div class="table-responsive mt-3 pt-3 pb-3 bg-white">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>${generateTableHeaders(thead)}</tr>
                                </thead>
                                <tbody>${generateTableBody(
                                    tbody,
                                    thead
                                )}</tbody>
                            </table>
                            <table class="table table-bordered mt-5">
                                     <thead class="bg bg-secondary">
                                         <th>បុគ្គលិក</th>
                                         <th>បញ្ជាក់ដោយ</th>
                                         <th>បញ្ជាក់ដោយ</th>
                                         <th>បញ្ជាក់ដោយ</th>
                                         <th>អនុម័តដោយ</th>
                                     </thead>
                                     <tbody>
                                        <tr>
                                            <td class="p-5"></td>
                                            <td class="p-5"></td>
                                            <td class="p-5"></td>
                                            <td class="p-5"></td>
                                            <td class="p-5"></td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                            <td class="align-left">ហត្ថលេខា ......................................</td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                            <td class="align-left">ឈ្មោះ ..............................................</td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                            <td class="align-left">តំណែង ...........................................</td>
                                        </tr>
                                        <tr>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                            <td class="align-left">កាលបរិច្ឆេទ ....................................</td>
                                        </tr>
                                     
                                 </tbody>
                             </table>
                        </div>
                    `;

                    dialog = new GeneralDialog({
                        cssClass: "modal-lg custom-modal-size",
                        backdrop: "static",
                        keyboard: true,
                        createContent: () => htmlString,
                        buttons: [
                            {
                                label: '<span><i class="fa-solid text-danger fa-xmark"></i></span>',
                                cssClass: "btn btn-sm-outline rounded-3",
                                click: (me) => me.hide(true, null),
                            },
                            {
                                label: '<span id="_btnPrintExitForm"><i class="fa-solid text-success fa-print"></i></span>',
                                cssClass: "btn btn-sm-outline rounded-3",
                                click: (me, btn) => {
                                    const p = {
                                        ...me.getData(),
                                        id: me.dataOptions.id,
                                    };

                                    vsapi
                                        .call(
                                            `${main_view.base_url}/hr/exit-form/details`,
                                            p,
                                            btn
                                        )
                                        .then((res) => {
                                            if (res.status_code === 200) {
                                                windowPrint(htmlString);
                                            } else {
                                                cv_interact.error(
                                                    res.error_message
                                                );
                                            }
                                        });
                                },
                            },
                        ],
                        prepareFormOptions: {
                            createTitle: "View Exit Form",
                            modifyTitle: "View Exit Form",
                            targetProp: "exit_forms",
                            api: {
                                endpoint: [
                                    main_view.base_url,
                                    "/hr/exit-form/form-options",
                                ].join(""),
                                params: (op) => {
                                    return { id: op.id };
                                },
                            },
                            onResponse: (me, res) => {
                                console.log("API Response:", res);
                            },
                        },
                    });

                    dialog.show(op);
                } else {
                    cv_interact.error(res.error_message);
                }
            });
    };

    return self;
})();
