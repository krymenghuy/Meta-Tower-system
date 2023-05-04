"use strict";
let CategoriesComponent = new function () {
    let mThis = this;
    this.title_prop = 'Categories';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_categoriesComponent');
    this.btnNew = $('#_cat_btnNew');
    this.elSearchItem = $('#_pdg_search');
    this.tblItems = $('#_cat_tblCategories');
    this.form_data = {};

    this.col_titles = {
        "No.": "No.",
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
                        mThis.displayCategories();
                    }
                }
            };
            CategoryDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn-cat-modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayCategories();
                    }
                }
            };
            CategoryDialog.show(op);
        });

        mThis.tblItems.on('click', '.btn-cat-delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this category?`, { title: "Delete Category", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/inventory/category/delete`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayCategories();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displayCategories();
        });

        this.cfg = new ExpandableRowConfig('_cat_tblCategories', {
            'dontExpandByClickingOn': ['btn-cat-modify', 'btn-cat-delete', 'btn-cat-action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let q_tr = $(parent_tr);
                let group_id = q_tr.data('id');
                mThis.displayCategoryDetails($(detail_tr), group_id);
            }
        });
    }

    this.displayCategoryDetails = (detail_tr, group_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-containter');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0"></div>');
        let p = { 'id': group_id };
        window.vsapi.call(`${main_view.base_url}/api/inventory/category/details`, p, 'POST', false).then((res) => {
            let html = null;
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                html = [``].join('');
            }
            else {
                html = `<div class="expanded-row-error">${error_message}</div>`;
            }
            div_wrapper.html(html);
        });
    }

    this.displayCategories = (onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val() };
        window.vsapi.call(`${mThis.base_url}/api/inventory/category/list`, p, 'POST', null).then((result) => {
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
                    data: () => {
                        return cnt;
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
                    data: "description"
                },
                {
                    title: mThis.trans_title('Created By'),
                    data: "create_user"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (item, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn-cat-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn-cat-delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
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
        mThis.displayCategories(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let CategoryDialog = new function () {
    let mThis = this;
    this.self = $(`#_pdg_dlgProductGroup`);

    this.formUntil = new FormUntil({
        "itemName": "Category",
        "formId": '_cat_dlgCategory',
        "titleId": "_cat_dlgCategory_title",
        "instance": this,
        "apiSave": `${main_view.base_url}/api/inventory/category/save`,
        "apiGet": `${main_view.base_url}/api/inventory/category/details`,
        "modifyTitle": "Modify Category",
        "createTitle": "New Category",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        'beforeShow': () => {}
    });

    this.show = (options) => {
        mThis.formUntil.show(options);
    }
}

$(document).ready(function () {
    CategoriesComponent.init();
});