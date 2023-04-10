"use strict";
let ItemsComponent = new function () {
    let mThis = this;
    this.title_prop = 'Products';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_itemsComponent');
    this.btnNew = $('#_itm_btnNew');
    this.elSearchItem = $('#_itm_search');
    this.elFilter_category = $('#_itm_filter_category');

    this.DlgFilter_Product = $('#_itm_btnFilterProduct');
    this.tblItems = $('#_itm_tblItems');
    this.form_data = {};
    this.icon_url = [VSUtil.asset_url(), '/images/icons'].join('');

    this.col_titles = {
        "No.": "No.",
        "Code": "Code",
        "Name": "Name",
        "Category": "Category",
        "Type": "Type",
        "Action": "Action"
    };

    this.displayProductsDetails = (detail_tr, appt_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = { 'id': appt_id };
        window.vsapi.call(`${main_view.base_url}/api/inventory/item-details`, p, 'POST', false).then((res) => {
            let html = null;
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                d.patient_code = d.patient_code ? d.patient_code : 'N.A.';
                d.consultant_name = d.consultant_name ? d.consultant_name : 'Any';

                let tr = detail_tr.prev();
                tr.find('.client-name').text(d.client_name);
                tr.find('.client-code').text(d.patient_code);

                html = `<div data-apptid="${d.id}" data-leadid="${d.lead_id}" data-statusid="${d.status_id}" class="appt-info-wrapper shadow-lg d-flex" style="width:100%;">
                    <div class="thumbnail-wrapper">
                    <img src="${mThis.icon_url}/client-girl.png" class="profile-thumbnail img-thumbnail">
                    </div>

                    <div class="d-flex" style="width:100%">
                        <div style="width:50%">   
                        </div>
                        <div style="width:50%">
                        </div>
                    </div> 
                </div>`;
            } else {
                html = `<div class="expanded-row-error">${error_message}</div>`;
            }
            div_wrapper.html(html);
        });
    }

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
                        mThis.displayItems();
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.DlgFilter_Product.on('click', function (e) {
            e.preventDefault();
            let op = {
                onClose: (e) => {
                    if (e) {
                        mThis.displayItems(e);
                    }
                }
            };
            FilterDialog_Product.show(op);
        });

        mThis.tblItems.on('click', 'a.btn-item-modify', function (e) {
            let item_id = $(this).data("id");
            let op = {
                id: item_id,
                onClose: (e) => {
                    if (e) {
                        mThis.displayItems();
                    }
                }
            };
            ItemDialog.show(op);
        });

        mThis.tblItems.on('click', 'a.btn-item-delete', function (e) {
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this product?`, { title: "Delete Product", context: "delete" }, (yes) => {
                if (yes) {
                    let p = { "id": item_id };
                    vsapi.call(`${main_view.base_url}/api/inventory/delete-item`, p).then(res => {
                        if (res.status_code === 200) {
                            mThis.displayItems();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        this.cfg = new ExpandableRowConfig('_itm_tblItems', {
            'dontExpandByClickingOn': ['btn-item-modify', 'btn-item-delete', 'btn-item-action'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let qtr = $(parent_tr);
                let appt_id = qtr.data('id');
                mThis.displayProductsDetails($(detail_tr), appt_id);
            }
        });

        mThis.elSearchItem.on('keyup', (e) => {
            if (e.keyCode === 13) mThis.displayItems();
        });

        mThis.elFilter_category.on('change', (e) => {
            e.preventDefault();
            mThis.displayItems();
        });
    }

    this.displayItems = (options, onFinish = null) => {
        mThis.setLanguage();
        let p = { 'search_value': mThis.elSearchItem.val(), 'category_id': mThis.elFilter_category.val(), 'code': options.code, 'name': options.name, 'type': options.type };
        window.vsapi.call(`${mThis.base_url}/api/inventory/items`, p, 'POST', null).then((result) => {
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
                    title: mThis.trans_title("Code"),
                    data: (data, a, b) => {
                        return [
                            `<span class="fw-bold d-block">`, data.code, `</span>`,
                            `<span class="text-secondary">group: `, data.group_code, `</span>`
                        ].join('');
                    }
                },
                {
                    title: mThis.trans_title('Name'),
                    data: (data, a, b) => {
                        return [
                            `<span class="d-block">`, data.name, `</span>`,
                            `<span class="text-secondary fs-bold">Group: `, data.group_name, `</span>`
                        ].join('');
                    }
                },
                {
                    title: mThis.trans_title('Category'),
                    data: "category"
                },
                {
                    title: mThis.trans_title('Type'),
                    data: "item_type"
                },
                {
                    title: mThis.trans_title('Action'),
                    data: function (item, a, b) {
                        return [`<div class="form-inline">`,
                            `<a href="javascript:void(0)" class="btn-item-modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                            `<a href="javascript:void(0);" data-id="${item.id}" class="btn-item-delete"><i class="fa-solid fa-trash-can text-danger"></i></a>`,
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

    this.prepareOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/api/inventory/settings/options-category`, null).then(res => {
            if (res.status_code === 200) {
                let cats = StringSanitizer.sanitizeObject(res.data);
                let d = {
                    "categories": cats
                };
                onFinish(d);
            }
        });
    }

    this.show = (options = null) => {
        if (!options) options = {};
        mThis.options = options;
        mThis.prepareOptions(d => {
            let cats = d.categories;
            VSUtil.setComboItems(mThis.elFilter_category, cats, 'id', 'category', true, '(All categories)', 0);
            mThis.displayItems(options, () => {
                main_view.setTitle(mThis.title_prop);
                mThis.self.show().siblings().hide();
            });
        });
    }
}

let ItemDialog = new function () {
    let mThis = this;
    this.form_data = {};
    this.self = $(`#_itm_dlgProduct`);
    this.elItemCode = $('#_itm_item_code');
    this.elItemGroup = $('#_itm_item_group');
    this.elCategory = $(`#_itm_item_category`);
    this.elManufacturer = $(`#_itm_item_manufacturer`);
    this.elDetailType = $(`#_itm_item_detail_type`);
    this.elUnit = $('#_itm_item_unit');
    this.detail_type_panel = $('#_itm_detail_type_panel');
    this.lnkAddGroup = $(`#_itm_lnkAddGroup`);
    this.lnkAddCategory = $(`#_itm_lnkAddCategory`);
    this.lnkAddUnit = $(`#_itm_lnkAddUnit`);
    this.lnkAddManufacturer = $(`#_itm_lnkAddManufacturer`);

    this.prepareOptions = (def = {}, onFinish) => {
        if (!def) def = {};
        if (mThis.form_data.groups) {
            onFinish(mThis.form_data);
            return;
        }
 
        vsapi.call(`${main_view.base_url}/api/inventory/settings/item-form-options`, null).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                mThis.form_data.groups = d.groups;
                mThis.form_data.units = d.units;
                mThis.form_data.categories = d.categories;
                mThis.form_data.manufacturers = d.manufacturers;
                onFinish(mThis.form_data);
            }
        });
    }

    this.formUntil = new FormUntil({
        "itemName": "Products",
        "formId": '_itm_dlgProduct',
        "instance": this,
        "apiSave": `${main_view.base_url}/api/inventory/save-item`,
        "apiGet": `${main_view.base_url}/api/inventory/item-details`,
        "modifyTitle": "Modify Product",
        "createTitle": "New Product",
        "identityProps": ['id'],
        "form_data_props": ['id'],
        "sanitize_excepts": [],
        'use_alert_error': true,
        "init": () => {
            mThis.elCategory.on('change', function (e) {
                e.preventDefault();
                let p = { "category_id": $(this).val() };
                vsapi.call(`${main_view.base_url}/api/setings/options-detail-type`, p).then(res => {
                    if (res.status_code === 200) {
                        let items = StringSanitizer.sanitizeObject(res.data);

                        if (!items[0]) {
                            mThis.detail_type_panel.hide()
                        } else {
                            VSUtil.setComboItems(mThis.elDetailType, items, 'id', 'detail_type', false, null);
                            mThis.detail_type_panel.show();
                            if (!items[1]) {
                                mThis.elDetailType.val(items[0]).trigger('change');
                            }
                        }
                    }
                });
            });

            mThis.lnkAddGroup.on('click', (e) => {
                let op = {
                    previousDialog: mThis.self,
                    title: "Add General Name",
                    label: `<span style="display:block">Enter new product line</span>
                    <span class="text-secondary">You must enter product code, for example, D1001:Doliprane</span>`,
                    allowBlankValue: false,
                    manualClosing: true
                };

                InputBox1.show(op, d => {
                    if (d) {
                        let parts = d.split(':');
                        let code = parts[0];
                        let group_name = parts[1];
                        let p = { code: code, name: group_name };
                        if (!p.name && p.code) {
                            p.name = p.code;
                            p.code = null;
                        }

                        vsapi.call(`${main_view.base_url}/api/inventory/save-group`, p).then(res => {
                            if (res.status_code === 200) {
                                let new_id = res.data.id;
                                InputBox1.close();
                                mThis.refreshOptions('group', new_id, null);
                            } else cv_interact.error(res.error_message);
                        });
                    }
                });
            });

            mThis.lnkAddCategory.on('click', (e) => {
                let op = {
                    previousDialog: mThis.self,
                    title: "Add Category",
                    label: `<span style="display:block">Enter new category</span>
                    <span class="text-secondary">You can also add detail type by inputting like this iMac desktop:Brand New iMac</span>`,
                    allowBlankValue: false,
                    manualClosing: true
                };

                InputBox1.show(op, d => {
                    if (d) {
                        let parts = d.split(':');
                        let category_name = parts[0];
                        let detail_type = parts[1];

                        if (detail_type) detail_type = detail_type.trim();
                        let p = { name: category_name, detail_type: detail_type };
                        vsapi.call(`${main_view.base_url}/api/category/save`, p).then(res => {
                            if (res.status_code === 200) {
                                let new_id = res.data.id;
                                mThis.refreshOptions('category', new_id, null);
                                InputBox1.close();
                            } else cv_interact.error(res.error_message);
                        });
                    }
                });
            });

            mThis.lnkAddUnit.on('click', (e) => {
                let op = {
                    previousDialog: mThis.self,
                    title: "Add SKU",
                    label: `<span style="display:block">Enter new SKU</span>
                    <span class="text-secondary">Example:box =10 bottles</span>`,
                    allowBlankValue: false,
                    manualClosing: true,
                };

                InputBox1.show(op, d => {
                    if (d) {
                        let unit = mThis.processUnit(d);
                        if (unit.error) {
                            cv_interact.warning(unit.error);
                            return;
                        }
                        let p = { name: unit.name, sub_unit_name: unit.sub_unit_name, sub_unit_qty: unit.sub_unit_qty };
                        vsapi.call(`${main_view.base_url}/api/inventory/settings/unit/save`, p).then(res => {
                            if (res.status_code === 200) {
                                let new_id = res.data.id;
                                InputBox1.close();
                                mThis.refreshOptions('sku', new_id, null);
                            } else cv_interact.error(res.error_message);
                        });
                    }
                });
            });

            mThis.lnkAddManufacturer.on('click', (e) => {
                let op = {
                    previousDialog: mThis.self,
                    title: "Add Manufacturer",
                    label: `<span style="display:block">Enter new manufacturer</span>`,
                    allowBlankValue: false,
                    manualClosing: true,
                };

                InputBox1.show(op, d => {
                    if (d) {
                        let p = { 'name': d };
                        vsapi.call(`${main_view.base_url}/api/inventory/settings/manufacturer/save`, p).then(res => {
                            if (res.status_code === 200) {
                                let new_id = res.data.id;
                                mThis.refreshOptions('manufacturer', new_id, null);
                                InputBox1.close();
                            } else cv_interact.error(res.error_message);
                        });
                    }
                });
            });
        }
    });

    this.refreshOptions = (field_name, def_value = 0, onFinish = null) => {
        let method_name = '';
        let el = null;
        let text_field = '';
        let data_prop = '';
        switch (field_name) {
            case 'group':
                {
                    el = mThis.elItemGroup;
                    text_field = 'group_name';
                    data_prop = 'groups';
                    method_name = 'api/inventory/settings/options-group';
                    break;
                }
            case 'category': {

                el = mThis.elCategory;
                text_field = 'category';
                data_prop = 'categories';
                method_name = 'api/inventory/settings/options-category';
                break;
            }
            case 'sku': {

                el = mThis.elUnit;
                text_field = 'unit_name';
                data_prop = 'units';
                method_name = 'api/inventory/settings/options-sku';
                break;
            }

            case 'manufacturer': {
                el = mThis.elManufacturer;
                text_field = 'manufacturer'
                data_prop = 'manufacturers';
                method_name = 'api/inventory/settings/options-manufacturer';
                break;
            }
            case 'brand': {
                el = mThis.elManufacturer;
                text_field = 'brand_name'
                data_prop = 'brands';
                method_name = 'api/inventory/settings/options-brand';
                break;
            }
            default: {
                method_name = 'api/settings/unknown???';
                data_prop = 'unknown';
                break;
            }
        }
        vsapi.call(`${main_view.base_url}/${method_name}`, null).then(res => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                mThis.form_data[data_prop] = items;
                VSUtil.setComboItems(el, items, 'id', text_field, false, null, def_value);
                if (typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.unitNames = {
        "bottles": "bottle",
        "bottle": "bottle",
        "pcs": "pcs",
        "pills": "pill",
        "pill": "pill",
        "boxes": "box",
        "box": "box",
        "ampul": "ampul",
        "ampuls": "ampul"
    };

    this.processUnit = (unitInfo = null) => {
        if (!unitInfo) return {};
        let parts = unitInfo.split('=');
        let unit_name = parts[0];
        let part1 = (parts[1] ? parts[1] : '').split(' ');
        let sub_unit_name = '';
        let sub_unit_qty = 0;

        let i = 0, c = null;
        let sts = (parts[1] + '').trim().split(' ');
        sub_unit_qty = sts[0];
        sub_unit_name = [sts[1], sts[2]].join('');
        if (!$.isNumeric(sub_unit_qty)) sub_unit_qty = 0;
        let translated_unit_name = mThis.unitNames[sub_unit_name];

        return {
            'error': null,
            'name': unit_name,
            'sub_unit_name': sub_unit_name,
            'sub_unit_qty': sub_unit_qty
        }
    }

    this.show = (options) => {
        if (!options.default_input) options.default_input = {};
        mThis.prepareOptions(options.default_input, (d) => {
            VSUtil.setComboItems(mThis.elItemGroup, d.groups, 'id', 'group_name', false, null, options.default_input.group_id);
            VSUtil.setComboItems(mThis.elCategory, d.categories, 'id', 'category', false, null, options.default_input.category_id);
            VSUtil.setComboItems(mThis.elUnit, d.units, 'id', 'unit_name', false, null, options.default_input.unit_id);
            VSUtil.setComboItems(mThis.elManufacturer, d.manufacturers, 'id', 'manufacturer', false, null, options.default_input.manufacturer_id);
            mThis.formUntil.show(options);
        });
    }
}

let FilterDialog_Product = new function () {
    let mThis = this;
    this.self = $('#_itm_dlgFilterProduct');
    this.modalTitle = $('#_itm_dlgFilterProduct_title');
    this.btnSave = $('#_itm_dlgFilterProduct_btnSave');

    this.elFitlerItemCode = $('#_itm_dlgFilterProduct_Code');
    this.elFilterItemName = $('#_itm_dlgFilterProduct_Name');
    this.elFilterItemType = $('#_itm_dlgFilterProduct_Type');

    this.btnSave.on('click', function (e) {
        e.preventDefault();
        let op = {
            'code': mThis.elFitlerItemCode.val(),
            'name': mThis.elFilterItemName.val(),
            'type': mThis.elFilterItemType.val()
        };
        if (typeof mThis.onClose === 'function') mThis.onClose(op);
        mThis.self.modal('hide');
    });

    this.show = (options) => {
        if (!options) options = {};
        mThis.modalTitle.text("Filter Product");
        mThis.onClose = options.onClose;
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

$(document).ready(function () {
    ItemsComponent.init();
});