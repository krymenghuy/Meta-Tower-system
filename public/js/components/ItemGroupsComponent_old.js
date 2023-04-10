"use strict";
let ItemGroupsComponent = new function () {
    let mThis = this;
    this.title_prop = 'Products Group';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_itemGroupsComponent');
    this.btnNew = $('#_pdg_btnNew');
    this.elSearchItem = $('#_pdg_search');
    this.tblItems = $('#_pdg_tblProductGroup');
    this.form_data = {};

    this.col_titles = {
        "No.": "No.",
        "Code": "Code",
        "Name": "Name",
        "Description": "Description",
        "Created By": "Created By",
        "Action": "Action"
    };

    this.trans_title = (title_prop = 'undefined') => {
        return (mThis.col_titles[title_prop] || 'undefined');
    }

    this.setLanguage = () => {
        if (LocaleManager.lang !== mThis.lang) {
            for (let prop in mThis.col_titles) {
                mThis.col_titles[prop] = LocaleManager.trans(prop, 'items', LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

    this.init = () => {
        mThis.btnNew.on('click', (e) => {
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayProductsGroup();
                    }
                }
            };
            ItemGroupDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayProductsGroup();
                    }
                }
            };
            ItemGroupDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn_item_delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this department?`, { title: "Delete Department", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-group`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayProductsGroup();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displayProductsGroup();
        });

        this.cfg = new ExpandableRowConfig('_pdg_tblProductGroup', {
            'dontExpandByClickingOn': ['btn_item_modify', 'btn_item_delete', 'btn_item_action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let group_id = q_tr.data('id');
                mThis.displayProductsGroupDetails($(detail_tr), group_id);
            }
        });
    }

    this.displayProductsGroupDetails = (detail_tr, group_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0"></div>');
        let p = { 'id': group_id };
        window.vsapi.call(`${main_view.base_url}/api/inventory/group-details`, p, 'POST', false).then((res) => {
            let html = null;
            let canvas_Barid = null, canvas_Pieid = null, canvas_Doughnutid = null;
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                canvas_Barid = `_pdg_SmbarChart_${group_id}`;
                canvas_Pieid = `_pdg_SmpieChart_${group_id}`;
                canvas_Doughnutid = `_pdg_SmdoughnutChart_${group_id}`;

                html = [`<div class="row py-2 w-100 gy-2">
                <div class="col-xl-4">
                    <div class="shadow-sm rounded w-100 py-2">
                        <canvas id="${canvas_Barid}"></canvas>
                    </div>
                </div>
                <div class="col-xl-4">
                    <div class="shadow-sm rounded w-100 py-2">
                        <canvas id="${canvas_Pieid}"></canvas>
                    </div>
                </div>
                <div class="col-xl-4">
                    <div class="shadow-sm rounded w-100 py-2">
                        <canvas id="${canvas_Doughnutid}"></canvas>
                    </div>
                </div>
            </div>`].join('');
            }
            else {
                html = `<div class="expanded-row-error">${error_message}</div>`;
            }
            div_wrapper.html(html);
            let bardata = [12, 74, 63], piedata = [10, 20, 30, 74, 45, 93], doughnutdata = [10, 47, 63, 65, 43, 48];
            if (canvas_Barid) this.initBarChart(canvas_Barid, bardata);
            if (canvas_Pieid) this.initPieChart(canvas_Pieid, piedata);
            if (canvas_Doughnutid) this.initDoughnutChart(canvas_Doughnutid, doughnutdata);
        });
    }

    this.initBarChart = (canvas_id, data) => {
        new Chart(canvas_id, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March'],
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                },
                legend: {
                    display: false
                }
            }
        });
    }

    this.initPieChart = (canvas_id, data) => {
        new Chart(canvas_id, {
            type: 'pie',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(0, 255, 255, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(255, 0, 255, 1)',
                        'rgba(0, 191, 255, 1)'
                    ],
                    borderWidth: 1
                }],
                labels: ['Labotory', 'Skin Car', 'Surchery']
            },
            options: {}
        });
    };

    this.initDoughnutChart = (canvas_id, data) => {
        new Chart(canvas_id, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)'
                    ],
                    borderWidth: 1
                }],
                labels: ['Labotory', 'Skin Car', 'Surchery', 'Selling Products']
            },
            options: {}
        });
    }

    this.displayProductsGroup = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val() };
        window.vsapi.call(`${mThis.base_url}/api/inventory/groups`, p, 'POST', null).then((result) => {
            let data = [];
            if (result.status_code === 200) data = result.data;
            if (mThis.table) {
                mThis.tblItems.DataTable().clear().destroy();
                mThis.tblItems.empty();
                mThis.table = null;
            }

            data = StringSanitizer.sanitizeObject(data, null);
            let cnt = 1;
            let my_columns = [
                {
                    title: mThis.trans_title("No."),
                    data: (data, a, b) => {
                        return cnt;
                    }
                },
                {
                    title: mThis.trans_title("Code"),
                    data: (data, a, b) => {
                        return data.code ? data.code : "N.A.";
                    }
                },
                {
                    data: (item, a, b) => {
                        return [`<div>${item.name}</div>`].join('');
                    },
                    title: mThis.trans_title('Name')
                },
                {
                    title: mThis.trans_title('Description'),
                    data: (data, a, b) => {
                        return data.description ? data.description : "(No Description)";
                    }
                },
                {
                    title: mThis.trans_title('Created By'),
                    data: "create_user"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (item, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn_item_modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn_item_delete"><i class="fa-solid fa-trash-can text-danger"></i></i></a>`,
                            `</div>`
                        ].join('');
                    }
                }
            ];

            if (!mThis.table)
                mThis.table = mThis.tblItems.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    'processing': true,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": LocaleManager.trans('No data to display', 'datatable')
                    },
                    'data': data,
                    'columns': my_columns,
                    "createdRow": function (row, data, dataIndex) {
                        cnt++;
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            if (typeof onFinish === 'function') onFinish();
        });
    };

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;
        mThis.displayProductsGroup(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ItemGroupDialog = new function () {
    let mThis = this;
    this.self = $(`#_pdg_dlgProductGroup`);
    this.elCat = $(`#_pdg_dlgProductGroup_cat`);
    this.elSKU = $(`#_pdg_dlgProductGroup_unit`);

    this.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/api/group/form-options`, null).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                onFinish(d);
            }
        });
    }

    this.formUntil = new FormUntil({
        "itemName": "Item Group",
        "formId": '_pdg_dlgProductGroup',
        "titleId": "_pdg_dlgProductGroup_title",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/inventory/save-group`,
        "apiGet": `${main_view.base_url}/api/inventory/group-details`,
        "modifyTitle": "Modify Product Group",
        "createTitle": "New Product Group",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
    });

    this.show = (options) => {
        mThis.prepareFormOptions(d => {
            let cats = d.categories;
            let units = d.units;
            VSUtil.setComboItems(mThis.elCat, cats, 'id', 'category', true, '(select category)', null);
            VSUtil.setComboItems(mThis.elSKU, units, 'id', 'unit_name', true, '(select sku)', null);
            mThis.formUntil.show(options);
        });
    }
}

$(document).ready(function () {
    ItemGroupsComponent.init();
});