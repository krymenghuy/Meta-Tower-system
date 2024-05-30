
'use strict';


const FilterDialog_pickup = new function () {
    let mThis = this;
    this.base_url = main_view.base_url; //** || document.querySelector('meta[name="base_url"]').getAttribute('content');*/
    this.self = main_view.appContent.find('#_pl_dlgFilter');
    this.elTitle = this.self.find('#_pl_dlgFilterTitle');
    this.elFilter_start_date = this.self.find('#_pl_filter_startdate');
    this.elFilter_end_date = this.self.find('#_pl_filter_enddate');
    this.elFilter_sender = this.self.find('#_pl_filter_sender');
    this.elFilter_driver = this.self.find('#_pl_filter_driver');
    this.elFilter_delivery_type = this.self.find('#_pl_filter_dtype');
    this.elFilter_status = this.self.find('#_pl_filter_status');
    this.elFilter_warehouse = this.self.find('#_pl_filter_warehouse');

    this.form_data = {};
    this.remembered_filter;
    this.btnOK = this.self.find('#_pl_dlgFilter_btnOK');

    this.self.find('.dl_filter_field').on('change', (e) => {
        mThis.remembered_filter = mThis.getData();
    });

    this.btnOK.on('click', (e) => {
        mThis.self.modal('hide');
        let p = mThis.getData();
        if (typeof mThis.onClose == 'function') mThis.onClose(p);
    });

    this.loadFilterData = (onFinish) => {
        let def = mThis.remembered_filter ? mThis.remembered_filter : {};
        if (!def.status_id) def.status_id = -1; // Use "All Statuses" As default status filter
        if (!def.sender_id) def.sender_id = null;
        if (!def.driver_id) def.driver_id = null;
        if (!def.warehouse_id) def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;

        let data = ShipmentsComponent.form_data;
        if (data) {
            VSUtil.setComboItems(mThis.elFilter_warehouse, data.warehouses, 'id', 'warehouse_name', false, '(Select Warehouse)', def.warehouse_id);
            VSUtil.setComboItems(mThis.elFilter_sender, data.senders, 'id', 'sender_name', false, null, def.sender_id);
            // VSUtil.setComboItems(mThis.elFilter_driver, data.drivers, 'id', 'driver_name', false, null, def.driver_id);
            VSUtil.setComboItems(mThis.elFilter_status, data.shipment_status, 'status_id', 'status_name', false, '(All Status)', def.status_id);
            if (typeof onFinish == 'function') onFinish(data);
            return;
        }

        vsapi.call([mThis.base_url, '/abm/oversea_shipments/form-options'].join(''), null).then(res => {
            if (res.status_code === 200) {
                let data = res.data;
                // data.warehouses = StringSanitizer.sanitizeObject(data.warehouses);
                data.senders = StringSanitizer.sanitizeObject(data.senders);
                data.shipment_status = StringSanitizer.sanitizeObject(data.shipment_status);
                // data.drivers = StringSanitizer.sanitizeObject(data.drivers);
                // data.zones = StringSanitizer.sanitizeObject(data.zones);
                (data.shipment_status || []).unshift({ "status_id": "-1", "status_name": "(All Statuses)" });
                (data.senders || []).unshift({ "id": null, "sender_name": "(All Merchants)" });
                // (data.drivers || []).unshift({ "id": null, "driver_name": "(All Drivers)" });
                // VSUtil.setComboItems(mThis.elFilter_warehouse, data.warehouses, 'id', 'warehouse_name', false, '(Select Warehouse)', def.warehouse_id);
                VSUtil.setComboItems(mThis.elFilter_sender, data.senders, 'id', 'sender_name', false, null, def.sender_id);
                // VSUtil.setComboItems(mThis.elFilter_driver, data.drivers, 'id', 'driver_name', false, null, def.driver_id);
                VSUtil.setComboItems(mThis.elFilter_status, data.shipment_status, 'status_id', 'status_name', false, null, def.status_id);
                mThis.form_data = data;
                if (typeof onFinish === 'function') onFinish(data);
                ShipmentsComponent.form_data = data;
            }
        });
    }

    this.show = (option, onClose) => {
        if (option) {
            let title_text = LocaleManager.trans(option.title);
            mThis.elTitle.text(title_text);
        }
        mThis.onClose = onClose;
        mThis.loadFilterData(() => {
            if (main_view.MULTI_WAREHOUSE_OP == 0) mThis.elFilter_warehouse.parent().hide();
            mThis.self.modal({
                backdrop: 'static'
            });
        });

    }

    this.getData = () => {
        let p = {};
        p.start_date = mThis.elFilter_start_date.val();
        p.end_date = mThis.elFilter_end_date.val();
        //if (!p.request_date) p.request_date =p.date;
        p.sender_id = mThis.elFilter_sender.val();
        p.driver_id = mThis.elFilter_driver.val();
        p.delivery_type = mThis.elFilter_delivery_type.val();
        p.status_id = mThis.elFilter_status.val();
        p.warehouse_id = mThis.elFilter_warehouse.val(); //receiving warehouse
        mThis.remembered_filter = p; //remember previous selection
        return p;
    }
}
//### end::FiterDialog_pickup

var ShipmentsComponent = new function () {
    let mThis = this;
    this.title_prop = "Shipment";
    /** NOTE: PickupListComponent.form_data must be initially NULL, so that this prop will be loaded properly by api fetch on Component start */
    this.form_data = null;
    this.self = main_view.appContent.find('#_main_shipmentsComponent');
    this.base_url = main_view.base_url;

    this.order_list_wrapper = this.self.find('#order_list_wrapper');

    this.btnNewRequest = this.self.find('#_pl_btnNewPickup');
    this.btnNewShipment = this.self.find('#btn_newQuickOrder');

    this.elSearchPickup = this.self.find('#_pl_search');
    this.btnRefresh = this.self.find('#_pl_btnRefresh');

    this.btnToggleFilter = this.self.find('#_pl_btnToggleFilter');
    this.div_filter_fields = mThis.self.find('#_sdl_filter_fields')[0];

    this.btnPrint = this.self.find('#_pl_btnPrint');
    this.btnPDF = this.self.find('#_pl_btnPDF');
    this.lnkDailyPackages = this.self.find('#_pl_lnkDailyPackages');
 
    this.resizeItemListPanel = () => {
        mThis.tblShipments.find('.package_list_wrapper').each(function () {
            let div = $(this);
            if (div.is(':visible')) {
                div.width(mThis.order_list_wrapper.width());
                return false;
            }
        });
    }

    this.orderCreated_eventHandler = (d) => {
        if(!mThis.tblOrders) return;
        if (mThis.tblOrders.style.display != 'none') {
            let filter_status_id = FilterDialog_pickup.elFilter_status.val();
            if (filter_status_id == 1 || filter_status_id == -1) mThis.live_addOrderRow(d.data);
        }
    }

    this.savePrices = (that, div) => {
        let btnEdit = div.find('a.ps-btn-edit-prices');
        let has_error = false;
        let p = {};
        let f ;
        console.log(1,div[0]);

        div.find('.dd-field').each(function () {
            // console.log(2,'hello');
            let field = $(this);
            let span = field.find('.dd-value');
            let input = field.find('.dd-input');
            input.removeClass('has-error');
            f = field.data('field');
            let val = (input.val() + '').toLowerCase().trim();

            if (f == 'carrier_total_weight') {
                if (!val || val < 0) {
                    input.addClass('has-error');
                    has_error = true;
                    return false;
                }
            }
            else if(f == 'carrier_cost') {
                if (!val || val < 0) {
                    input.addClass('has-error');
                    has_error = true;
                    return false;
                }
            }
            p[f] = input.val();
            if (!has_error) {
                div.find('.dd-value').show();
                span.text(input.val());
                input.remove();
            }
        });

        if (!has_error) {
            // let price_list_id = mThis.elFilter_price_list.val();
            //let x =  div.closest('div.ps-zones');
            console.log(2,p[f]);
            //need to modify html
            //need to modify html
            let item_type = that.data('dtype');
            let carrier_total_weight = that.data('carrier_total_weight');
            let carrier_cost = that.data('carrier_cost');
            let total_carrier_cost = that.data('total_carrier_cost');
            let carrier_special_charge = that.data('carrier_special_charge');
            console.log(3,f);
            p.id = that.data('id');
            f=='carrier_total_weight'? p.carrier_total_weight = parseFloat(p[f]) : p.carrier_total_weight = carrier_total_weight;
            f=='carrier_cost'? p.carrier_cost = parseFloat(p[f]) : p.carrier_cost = carrier_cost;
            f=='carrier_cost'? p.total_carrier_cost = (parseFloat(p[f]) + carrier_special_charge) : p.total_carrier_cost = total_carrier_cost;
            p.item_type = item_type;
            console.log(4,p);
            vsapi.call(`${mThis.base_url}/abm/oversea_shipments/update-carrier-info`, p).then(res => {
                if (res.status_code === 200) {
                    // that.data('id', res.id);
                    mThis.shipmentListView.showPage(mThis.getFilterData()); 
                } else cv_interact.error(res.error_message);
            });

            //hide btnSave
            that.hide();

            //Show back btnEdit
            btnEdit.show();
        }
    }

    /** set each block of div.ps-fast or div.ps-normal to be in Edit mode **/
    //div is div.ps-fast or div.ps-normal
    this.setEditMode = (me, div) => {
        let btnSave = div.find('a.ps-btn-save-prices');
        //Hide btnEdit
        me.hide();
    
        //remove existing inputs if the target div is already in Edit mode
        div.find('.dd-input').remove();
    
        //Show btnSave
        btnSave.show();
        div.find('.dd-value').each(function () {
            let el = $(this);
            el.after($('<input class="dd-input" style="outline:none;margin-top:0px;width:80px"/>').val(el.text()));
            el.hide();
        });
    }

    this.show = function (option = null) {
        mThis.loadFilterData();
        mThis.self.siblings().hide();
        main_view.setTitle(mThis.title_prop);
        mThis.self.fadeIn(250);
    }

    this.hide = function () {
        mThis.self.hide();
    }
 
    this.init = function () {
        if (mThis.initAlready) return;

        this.cols = [
            {
                className: 'col_action',
                data: function (data, row, display) {
                    let html = ['<div class="dropdown">',
                        '<a href="javascript:void(0)" data-shipmentid="', data.shipment_id, '" data-senderid="', data.sender_id, '" data-statusid="', data.status_id, '" class="btn_shipment_action" aria-haspopup="true" aria-expanded="false">',
                        '<i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i>',
                        '</a>',
                        '</div>',].join('');
                    return html;
                }
            },
            {
                className: "Order Date",
                data: function (data, index, tr) {
                    return ['<span class="d-block p-1">', data.create_date||"NA", '</span>',
                        '<span class=" pl-request_time d-block p-1">', data.request_time||"NA", '</span>'].join('');
                },
                title: 'Booking Date'
                // title: mThis.trans('Created Date')
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.code||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'shipment no'
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.name||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'Customer Name'
            },
            {
                className: "from country",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.from_country||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'from country'
            },
            {
                className: "to_country",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.to_country||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'to country '
            },
            {
                className: "to_country",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.item_type||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'item type '
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = [
                        `<span class="d-block p-1" >`, data.primary_cp_name||'NA', ` (`,data.primary_cp_phone||'NA',`)`,` </span>`,
                        `<span class="d-block p-1" >`, data.secondary_cp_name||'NA',` (`,data.secondary_cp_phone||'NA',`)`, ` </span>`
                    ].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: ' contact persens'
            },
            {
                className: "actual_weight",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.actual_weight||'NA',' USD </span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'actual weight'
            },
            {
                className: "markup_weight",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.markup_weight||'NA',' USD </span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'markup weight'
            },
            {
                className: "total_weight",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.total_weight||'NA',' USD </span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'total weight'
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.total_price||'NA',' USD </span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'total price'
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<div class="" > ',
                        '<span class = "dd-field d-flex " data-field="carrier_total_weight">',
                            ' <span class="sender-name dd-value fs-5-08 me-1">',data.carrier_total_weight||'NA','</span> USD ',
                            `<a href="javascript:void(0)" data-id="`,data.id,`" class="ps-btn-edit-prices ms-2 `,data.status_id == 1 ? 'd-none' : '',`">    
                                <i class="fa fa-edit text-warning fs-5"></i>
                            </a>
                            <a style="display:none" href="javascript:void(0)" class="ps-btn-save-prices ms-2"
                                data-id="`,data.id,`" 
                                data-carrier_total_weight="`,parseFloat(data.carrier_total_weight),`" 
                                data-carrier_cost="`,parseFloat(data.carrier_cost),`" 
                                data-total_carrier_cost="`,parseFloat(data.total_carrier_cost),`" 
                                data-carrier_special_charge="`,parseFloat(data.carrier_special_charge),`" 
                                data-dtype="`,data.item_type,`" 
                            >
                                <i class="fa fa-save fs-5"></i>
                            </a> `,
                        `</span> `,
                    `</div>`].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: `<div class='d-b'>carrier tw</div><div class='d-n'>carrier total weight</div>`
            },
            
            {
                className: "carrier_cost",
                data: (data,index,tr)=>{
                    const sender_info = ['<div class=""> ',
                        '<span class="dd-field d-flex" data-field="carrier_cost">',
                            '<span class="sender-name  dd-value fs-5-08 me-1">',data.carrier_cost||'NA',' </span> USD',
                            `<a href="javascript:void(0)" data-id="" class="ps-btn-edit-prices ms-2 `,data.status_id == 1 ? 'd-none' : '',`">
                            <i class="fa fa-edit text-warning fs-5"></i>
                            </a>
                            <a style="display:none" href="javascript:void(0)" class="ps-btn-save-prices ms-2"
                                data-id="`,data.id,`" 
                                data-carrier_total_weight="`,parseFloat(data.carrier_total_weight),`" 
                                data-carrier_cost="`,parseFloat(data.carrier_cost),`" 
                                data-total_carrier_cost="`,parseFloat(data.total_carrier_cost),`" 
                                data-carrier_special_charge="`,parseFloat(data.carrier_special_charge),`" 
                                data-dtype="`,data.item_type,`" 
                            >
                                <i class="fa fa-save fs-5"></i>
                            </a>`,
                        `</span>`,
                    ` </div>`].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'carrier cost'
            },

            {
                className: "",
                data: function (data, row, display) {
                    let html = ['<div class="dropdown sender-name d-block ">',
                        '<a href="javascript:void(0)" data-orderid="', data.zone_code, '" data-senderid="', data.sender_id, '" data-id="', data.id, '" class="btn_special_charge d-flex gap-3" aria-haspopup="true" aria-expanded="false">',
                        data.carrier_special_charge||'0.00',' USD ',
                        '<i class="fa fa-chevron-down " style="font-size:1.5em"></i>',
                        '</a>',
                        '</div>'].join('');
                    return html;
                },
                // title: mThis.trans('Sender ID')
                title: `<div class='d-b'>special charge</div><div class='d-n'>special charge</div>`
            },
            {
                className: "",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name dd-value me-1">',data.total_carrier_cost||').00','</span> USD',`</a> `].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: `<div class='d-b'>carrier tc</div><div class='d-n'>carrier total cost</div>`
            },
            {
                className: "receiver_name",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.receiver_name||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'receiver name'
            },
            {
                className: "receiver_address",
                data: (data,index,tr)=>{
                    const sender_info = ['<span class="sender-name d-block">',data.receiver_address||'NA','</span>'].join('');
                    return sender_info;
                },
                // title: mThis.trans('Sender ID')
                title: 'receiver address'
            },
            
            
            {
                title:"Remarks",
                data:(data,index,tr)=>{
                  return [`<span class="d-block fw-semibold">`,data.remarks||"NA",'</span>'].join('');
                }
             },

            {
                title:"pacakges qty",
                data:(data,index,tr)=>{
                    return [`<span class="d-block fw-semibold">`,data.package_qty||0,'</span>'].join('');
                }
            },
            
            {
               title:"Status",
               data:(data,index,tr)=>{
                 return [`<span class="d-flex fw-semibold  text-info">`,data.status||"NA",'</span>'].join('');
               }
            },
        ];

        mThis.shipmentListView = new ListView("_shm_div_order_list", {
            // clientSidePagination: true,
            fetchApi: `${main_view.base_url}/abm/oversea_shipments/Shipment-list-paginate`,
            apiCluster: main_view.apiCluster,
            tableClass: "table shipment header-uppercase bg-white",
            perPage: 10,
            columns: mThis.cols,
            // processResponse: (res) => {
            //     console.log(res.data);
            //     return res.data;
            // },
            rowCreated:(data,index,tr)=>{
                //console.log(data);
              tr.dataset.id = data.id;  
              tr.classList.add('order');
              tr.classList.add('shipment');
              
              tr.setAttribute('id',['shipment_',data.id].join('')); 
              tr.dataset.statusid = data.status_id;
              tr.dataset.senderid = data.sender_id;
              tr.dataset.country_zone = data.zone_code;
              tr.dataset.country_id = data.to_country_id;
              tr.dataset.price_list_id = data.price_list_id;
              tr.dataset.item_type = data.item_type;
            //   tr.dataset.driverid = data.driver_id?data.driver_id:''; 
            }, 

            
            listContainerClass: null,
        });


        

        /** NOTE: tblOrder is Vanila javascript object, whereas mThis.tblPickups is Jquery Object that represents the same table */
        mThis.tblOrders = mThis.shipmentListView.getTable();
        mThis.tblShipments = $(mThis.tblOrders);


        this.sh_container = mThis.shipmentListView.getListContainer();
        // mThis.setEvents($(mThis.container));
        // console.log(mThis.container.parentElement); 
        const sh_parent = mThis.sh_container.parentElement;
            sh_parent.style.height = (window.innerHeight - 190)+'px';
            sh_parent.classList.add('overflow-y-auto');
            window.onresize = () => {
                sh_parent.style.height = (window.innerHeight - 190)+'px';
        }

        mThis.cfg = new ExpandableRowConfig(mThis.tblShipments.attr('id'), {
            dontExpandByClickingOn: ['pkl_btn_receive','ps-btn-save-prices','dd-input','ps-btn-edit-prices','pkl_btn_pick','btn_shipment_action','btn-show','btn_special_charge','lnk-assign-driver','lnk-set-address','dropdown-menu'],
            onOpen: (container, detail_tr, parent_tr) => {
                mThis.shm_prev_editing_row = null;
                const view_name = parent_tr.dataset.view; 
                let shipment_id = parent_tr.dataset.id;
                let status_id = parent_tr.dataset.status_id;
                //let sender_pmt_statu_id = parent_tr.dataset.senderpmtstatusid;
                //let driver_pmt_statu_id = parent_tr.dataset.driverpmtstatusid;
                if(!shipment_id) return;
                container.dataset.id = shipment_id;
                container.dataset.statusid = status_id;
                detail_tr.dataset.statusid = status_id;
                detail_tr.dataset.orderid = shipment_id;
                mThis.displayShipmentDetails(container,parent_tr,view_name);
                mThis.showQuickButtons(parent_tr);
            },
            onClose:(container, detail_tr, parent_tr)=>{
               mThis.hideQuickButtons(parent_tr)
            } 
        });

        
        mThis.tblShipments.on('click', 'a.ps-btn-edit-prices', function (e) {
            e.preventDefault();
            let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
            console.log('div',div);
            mThis.setEditMode($(this), div);
        });
    
        mThis.tblShipments.on('click', 'a.ps-btn-save-prices', function (e) {
            e.preventDefault();
            let div = $(this).closest('div'); /** div.ps-fast or div.ps-normal **/
            mThis.savePrices($(this), div);
        });
        

        
        // LocaleManager.setLanguageChangeHandler((lang) => {
        //     mThis.setTableLanguage();
        //     mThis.displayPickupList();
        // });

        // mThis.pickup_dropdown_menu = mThis.tblPickups.find('div.dropdown-menu');
        // if (main_view.MULTI_WAREHOUSE_OP == 1) {
        //     PerformPickupDialog.elToWarehouse.parent().show();
        //     VerifyPackageDialog.elToWarehouse.parent().show();
        // }
        // else {
        //     PerformPickupDialog.elToWarehouse.parent().hide();
        //     VerifyPackageDialog.elToWarehouse.parent().hide();
        // }

        FilterDialog_pickup.loadFilterData();

        this.lnkDailyPackages.on('click', e => {
            //e.preventDefault();
            const options = {
                "title":"Filter Merchant Packages",
                "fields": {
                    "start_date": {
                        "label": "Start Date",

                        "type": "date"
                    },
                    "end_date": {
                        "label": "End Date",
                        "type": "date"
                    },
                    "sender_id": {
                        "label": "Merchant",
                        "type": "select",
                        "value_field": "id",
                        "text_field": "sender_name",
                        "data": mThis.form_data.senders,
                        "defaultValue": 0
                    },
                    "wid": {
                        "label": "Warehouse",
                        "type": "select",
                        "required": 1,
                        "value_field": "id",
                        "text_field": "warehouse_name",
                        "data": [{ "id": "1", "warehouse_name": "Main Warehouse" }],
                        "defaultValue": "1"
                    }
                },
                'onClose': d => {
                    let params = ['rtype=daily_packages&', d.paramString].join('');
                    pdfReport.getEncryptData(encodeURI(params), (d) => {
                        window.open([mThis.base_url, '/dms-gen-report/', d].join(''), '_blank');
                    });
                }
            };
            DMSFilterDialog.show(options);
        });

        mThis.btnPrint.on('click', function (e) {
            let d = FilterDialog_pickup.getData();
            let params = ['rtype=pickup_list&wid=', d.warehouse_id, '&date=', d.date, '&search=', mThis.elSearchPickup.val(), '&sid=', d.sender_id, '&dtype=', d.delivery_type, '&stid=', d.status_id].join('');
            pdfReport.getEncryptData(encodeURI(params), (d) => {
                window.open([mThis.base_url, '/dms-gen-report/', d].join(''), '_blank');
            });
        });

        mThis.btnToggleFilter.on('click', () => {
            FilterDialog_pickup.show(null, (d) => {
                if (d) mThis.shipmentListView.showPage(mThis.getFilterData()); 
            });
        });

        mThis.btnRefresh.on('click', (e) => {
            mThis.shipmentListView.showPage(mThis.getFilterData()); 
        });
        mThis.elSearchPickup.on('keyup', function (e) {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.shipmentListView.showPage(mThis.getFilterData()); 
            },200);
        });
 
        //mThis.tblPickups.addEventlistener
        mThis.tblShipments[0].addEventListener('click', e => {
            e.preventDefault();
            // Click on Pickup Action button | drop down action
            let btn = VSUtil.closestLimited(e.target, '.btn_shipment_action');
            if (btn) {
                let p = btn.parentElement;
                let shipment_id = btn.dataset.id;
                let sender_id = btn.dataset.senderid;
                let status_id = btn.dataset.statusid;
        
                let dropdownMenu = p.querySelector('.dropdown-menu');
                if (!dropdownMenu || dropdownMenu.length === 0) {
                    p.insertAdjacentHTML('beforeend', mThis.createDropdownMenuHtml_shipment(shipment_id, sender_id, status_id));
                    dropdownMenu = p.querySelector('.dropdown-menu');
                }
        
                if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
                    mThis.prev_dropdownMenu.classList.remove('show');
                }
        
                dropdownMenu.classList.toggle('show');
                if (dropdownMenu.classList.contains('show')) {
                    mThis.prev_dropdownMenu = dropdownMenu;
                }
                return;
            }

            btn = VSUtil.closestLimited(e.target, '.btn_special_charge');
            if (btn) {
                let p = btn.parentElement;
                let shipment_id = btn.dataset.id;
                let sender_id = btn.dataset.senderid;
                let status_id = btn.dataset.statusid;
                let pt ={'shipment_id':shipment_id}
                //console.log('pt',pt);
                let dropdownMenu = p.querySelector('.dropdown-menu');
                
                vsapi.call([mThis.base_url, '/abm/special-charge/list-paginate'].join(''), pt,null,null).then(res => {
                    if (res.status_code === 200) {
                        let data = res.data.data;
                        //console.log('data',data);
                        if (!dropdownMenu || dropdownMenu.length === 0) {
                            p.insertAdjacentHTML('beforeend', mThis.createDropdownMenuHtml_special_charge(shipment_id, sender_id, status_id,data));
                            dropdownMenu = p.querySelector('.dropdown-menu');
                        }
                        if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu !== dropdownMenu) {
                            mThis.prev_dropdownMenu.classList.remove('show');
                        }
                
                        dropdownMenu.classList.toggle('show');
                        if (dropdownMenu.classList.contains('show')) {
                            mThis.prev_dropdownMenu = dropdownMenu;
                        }
                        return;
                    }
                    else {
                        if (typeof onFinish == 'function') onFinish(false,{});
                        cv_interact.error(res.error_message);
                    }
                });
        
                
            }

            //Click on "Arrive" button, the shortcut button in shipment_tr
            btn = VSUtil.closestLimited(e.target,'.pkl_btn_receive');
            if(btn){
                        if(!AuthManager.allowed(222)) return;
                        const shipment_tr = btn.closest('tr');
                        cv_interact.confirm('ទទួលទំនិញទាំងអស់ក្នុងបញ្ជាមួយនេះ?',{'context':"update"},e =>{
                            if(e){
                               if (mThis.shm_prev_editing_row) {
                                   mThis.saveItem(mThis.shm_prev_editing_row, btn, success => {
                                       if (success){
                                          mThis.receiveItems_all(shipment_tr, null);
                                       }
                                   });
                               }
                               else mThis.receiveItems_all(shipment_tr, null);
                            }
                  });
                return;
            }

            //Click on Pick button | Pick Order
            btn = VSUtil.closestLimited(e.target,'.pkl_btn_pick');
            if(btn){
                //if(!AuthManager.allowed() ) return; 
                const shipment_tr = btn.closest('tr');
                if (mThis.shm_prev_editing_row) {
                    mThis.saveItem(mThis.shm_prev_editing_row, (item_saved) => {
                        if (item_saved) {
                            mThis.pickItems(shipment_tr, btn, (sucess,d) => {
                                if (sucess){
                                    shipment_tr.dataset.statusid = d.status_id;
                                    btn.style.display ='none';
                                }
                            });
                        }
                    });
                }
                else {
                    mThis.pickItems(shipment_tr,(success,d) => {
                        if (success){
                            shipment_tr.dataset.statusid = d.status_id;
                            btn.style.display ='none';
                        }
                    });
                }
                return;
            }

            //Click on Change Status
            btn = VSUtil.closestLimited(e.target,'.change-order-status');
            if(btn){
                let tr = btn.closest('tr');
                mThis.changeShipmentStatus(tr);
                return;
            }

            //Click on Dropdown menu item : "Change Status"
            btn = VSUtil.closestLimited(e.target,'._pl_pa_change_status');
            if(btn){
                let tr = btn.closest('tr');
                console.log('tr',tr);
                mThis.changeShipmentStatus(tr);
                return;
            }

            //Click on Dropdown menu item : "Assign Driver"
            btn = VSUtil.closestLimited(e.target,'._pl_pa_add_special_charge');
            if(btn){
                let tr = btn.closest('tr');
                // console.log('tr.id',tr.dataset.id);
                let op = { 'title': 'Add Special Charge' ,'shipment_id':tr.dataset.id };
                SpecialChargeDialog.show(op, (new_id) => {
                    if (new_id) {
                        //console.log('new_id',new_id);
                        mThis.shipmentListView.showPage(mThis.getFilterData());
                    // mThis.loadFilterData(new_id);
                    }
                });
                return;
            } 
            btn = VSUtil.closestLimited(e.target,'._pl_pa_motify_special_charge');
            if(btn){
                let tr = btn.closest('tr');
                //console.log('btn.id',btn.dataset.sc_id);
                let op = { 'title': 'Motify Special Charge' ,
                            'shipment_id':tr.dataset.id ,
                            'id':btn.dataset.sc_id,
                            'category':btn.dataset.category,
                            'charge':btn.dataset.charge,
                            'remarks':btn.dataset.remarks,
                        };
                SpecialChargeDialog.show(op, (new_id) => {
                    //console.log('new_id',new_id);
                    if (new_id) {
                        //console.log('new_id',new_id);
                    // mThis.loadFilterData(new_id);
                    mThis.shipmentListView.showPage();
                    }
                });
                
                return;
            } 

            btn = VSUtil.closestLimited(e.target,'._pl_pa_delete_special_charge');
            if(btn){
                let tr = btn.closest('tr');
                //console.log('btn.id',btn.dataset.sc_id);
                let p = {
                            'shipment_id':tr.dataset.id ,
                            'id':btn.dataset.sc_id,
                        };
                //console.log('p',p);
                vsapi.call([mThis.base_url, '/abm/special-charge/delete-special-charge'].join(''), p).then(res => {
                    if (res.status_code === 200) {
                        //console.log('me');
                    // let d = res.data;
                    // if (typeof mThis.onClose === 'function') {
                        mThis.shipmentListView.showPage(mThis.getFilterData());
                        // mThis.onClose(d.id);
                    // }
                    // mThis.self.modal('hide');
                    } else mThis.elError.text(res.error_message);
                });
                return;
            } 

              //Click Driver lnk to quickly assign driver  "Quick Assign Driver" by clicking on Pencil icon
              btn = VSUtil.closestLimited(e.target,'.lnk-assign-driver');
              if(btn){
                  if(!AuthManager.allowed(221)) return;
                  let tr = btn.closest('tr');
                  //console.log(tr);
                  mThis.assignDriver(tr,btn);
                  return;
              }
                
            //Click on Delete Order: Dropdown menu item
            btn = VSUtil.getElementByClass(e.target,'_pl_pa_delete');
            if(btn){
                if (!AuthManager.allowed(229)) return;
                let tr = btn.closest('tr');
                mThis.deleteOrder(tr); 
                return;
            }

            //Click on Motify button
            btn = VSUtil.getElementByClass(e.target,'_pl_pa_motify');
            if(btn){
                let shipment_tr = btn.closest('tr');
                // let op = {'id' : shipment_tr.dataset.id}
                const op = {
                    'title': 'Motify',
                    'id' : shipment_tr.dataset.id,
                    'onClose': () => {
                       mThis.shipmentListView.showPage(mThis.getFilterData());
                    }
                };
                ShipmentDialog.show(op);
                return;
            }

            //Click on Arrive button
            btn = VSUtil.getElementByClass(e.target,'_pl_pa_receive');
            if(btn){
                let shipment_tr = btn.closest('tr');
                cv_interact.confirm('ទទួលទំនិញទាំងអស់ក្នុងបញ្ជាមួយនេះ?',{'context':"update"},e =>{
                     if(e){
                        if (mThis.shm_prev_editing_row) {
                            mThis.saveItem(mThis.shm_prev_editing_row, null, (success) => {
                                if (success){
                                    mThis.receiveItems_all(shipment_tr, null);
                                }
                            });
                        }
                        else mThis.receiveItems_all(shipment_tr, null);
                     }
                });
                return;
            }

            //Click on Save item
            btn = VSUtil.getElementByClass(e.target,'pkl_btn_save');
            if(btn){
                let tr = btn.closest('tr');
                //console.log('tr',tr);
                mThis.saveItem(tr, btn,(e) =>{
                    if(e){
                        btn.closest('div.edit-actions').remove();
                    }
                });
                return;
            }

             //Click on Delete item
             btn = VSUtil.getElementByClass(e.target,'pkl_btn_delete');
             if(btn){
                 let tr = btn.closest('tr');
                 mThis.deleteItem(tr);
                 return;
             }

             //Click on Delete item
             btn = VSUtil.getElementByClass(e.target,'pkl_btn_cancel_edit');
             if(btn){
                 let tr = btn.closest('tr');
                 mThis.setItemReadOnly(tr, true, null);
                 return;
             }

             //Click on map_link
             btn = VSUtil.getElementByClass(e.target,'lnk_map_link');
             if (btn){
                 const href = btn.getAttribute('href');
                 window.open(href,'_blank');
                 return;
             }

             btn = VSUtil.getElementByClass(e.target,'pkl_btn_edit');
             if (btn){
                 const tr = btn.closest('tr');
                 //console.log('btn',btn);
                 mThis.beginEditItem(tr,null,btn);
                 return;
             }
             
             btn = VSUtil.getElementByClass(e.target,'pkl_btn_print_barcode');
             if (btn){
                 const tr = btn.closest('tr');
                 let barcode = tr.dataset.barcode;
                 window.open([main_view.base_url, '/package_barcode/', barcode ? barcode : 'unknown'].join(''), '_blank');
                 return;
             }
 
            //  const clickOnElement = e.target.tagName;
            //  if (['TR','TD'].indexOf(clickOnElement) >= 0){
            //     mThis.showQuickButtons(VSUtil.closestLimited(e.target,'tr.order'));
            //  }
        });
  
        mThis.tblShipments.on('mouseover','tr',function(e){
            let x = $(this);
            let col_action = x.find('td.col_action');
            let btn_barcode = x.find('a._cpl_pa_quick_btn_barcode');
            btn_barcode.show();
            col_action.find('a.btn_shipment_action>i').addClass('action-button-zoomin');    
        }).on('mouseleave','tr',function(e) {
            let x = $(this);
            let col_action = x.find('td.col_action');
            let btn_barcode = x.find('a._cpl_pa_quick_btn_barcode');
            btn_barcode.hide();
            col_action.find('a.btn_shipment_action>i').removeClass('action-button-zoomin');
            // col_action.find('div.dropdown-menu').removeClass('show');  
        });

        document.addEventListener('click', function (e) {
            mThis.tblShipments[0].querySelectorAll('div.dropdown-menu').forEach(dropdownMenu => {
                if (!dropdownMenu.parentElement.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        });
 
        mThis.btnNewShipment.on('click', (e) => {
            if(!AuthManager.allowed(220)) return;
            const options = {
                'title': 'Booking',
                'onClose': () => {
                   mThis.shipmentListView.showPage(mThis.getFilterData());
                }
            };
            ShipmentDialog.show(options);
        });

        mThis.btnNewRequest.on('click', function (e) {
            let option = { 'title': 'New Pickup Request' };
            let onClose = (d) => {
                mThis.shipmentListView.showPage(mThis.getFilterData());
            };

            PickupRequestDialog.show(option, onClose);
        });
    
        mThis.initAlready = true;
    }
    //End:: PickupListComponent.init()

    this.changeShipmentStatus = (tr)=>{
            let shipment_id = tr.dataset.id;
            let def_status_id = tr.dataset.statusid;
               
                let sender_name = tr.querySelector('td.Customer-Name .sender-name').textContent;
                let shipment_code = tr.querySelector('td.shipment-no .sender-name').textContent;
                // let driver_id = tr.dataset.driverid;
                let shipment = { 'shipment_id': shipment_id, 'shipment_code': shipment_code, 'sender_name': sender_name, 'status_id': def_status_id };
                ShipmentStatusDialog.show(shipment, d => {
                    if (d) {
                        console.log(shipment);
                        mThis.updateShipmentStatus(tr, d);
                    }
                });
    };

    this.deleteOrder = (tr)=>{  
            let shipment_id = tr.dataset.id || tr.dataset.orderid;
            let status_id = tr.dataset.statusid;
            //let driver_id = tr.dataset.driverid;
            //let sender_id = tr.dataset.senderid;
            let p = { 'id': shipment_id, 'status_id': status_id };
            cv_interact.confirm('Delete this order?', { title: 'Delete Order', cancelButtonText: "Close", confirmButtonText: "Delete", context: "delete" }, function (e) {
                if (e) {
                    vsapi.call([mThis.base_url, '/dms/order/delete'].join(''), p).then(res => {
                        if (res.status_code === 200) {
                           mThis.shipmentListView.showPage(mThis.getFilterData()); 
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
    };

    this.assignDriver = (tr,btn)=>{
        let order_id = tr.dataset.id;
        let status_id = tr.dataset.statusid;
        const prev_driver_id = tr.dataset.driverid;
        let p = { 'order_id': order_id, 'status_id': status_id };
        if (status_id == 0) {
            cv_interact.error('Cannot assign driver because this pickup request is canceled!');
            return;
        }
        if (!order_id || order_id == 0) {
            cv_interact.error('Invalid order identity');
            return;
        }
        if(!mThis.form_data.drivers) console.error('Failed to fetch driver list for Assign Driver form (pickup)');
        let option = {manualClosing:btn? false:true, title: 'Assign Driver (Pickup)', 'confirmButtonText':'Assign Now', 'dataLabel': 'Select a driver', 'valueMember': 'id', 'textMember': 'driver_name', 'data': mThis.form_data.drivers, 'blankErrorMessage': "Choose one driver for Pickup Assignment","defaultValue":prev_driver_id};
        InputBox2.show(option, (data,btnAssign) => {
            if (data) {
                p.driver_id = data.value;
                vsapi.call([mThis.base_url, '/dms/order/assign-driver'].join(''), p,(btn || btnAssign),null).then(res => {
                    if (res.status_code === 200) {
                        const d = StringSanitizer.sanitizeObject(res.data);
                        let statusInfo =d.statusInfo;
                        tr.dataset.driverid  = d.driver_id;
                        tr.querySelector('td.driver_name .driver-name').textContent = d.driver_name;
                        mThis.updateShipmentStatus(tr, statusInfo);
                        if(option.manualClosing) InputBox2.close();
                        cv_interact.success(['The driver ',data.text,' got assigned successfully!'].join(''));
                    }
                    else cv_interact.error(res.error_message);
                });
            }
        });

    }

    this.assignDriver = (tr,btn)=>{
        let order_id = tr.dataset.id;
        let status_id = tr.dataset.statusid;
        const prev_driver_id = tr.dataset.driverid;
        let p = { 'order_id': order_id, 'status_id': status_id };
        if (status_id == 0) {
            cv_interact.error('Cannot assign driver because this pickup request is canceled!');
            return;
        }
        if (!order_id || order_id == 0) {
            cv_interact.error('Invalid order identity');
            return;
        }
        if(!mThis.form_data.drivers) console.error('Failed to fetch driver list for Assign Driver form (pickup)');
        let option = {manualClosing:btn? false:true, title: 'Assign Driver (Pickup)', 'confirmButtonText':'Assign Now', 'dataLabel': 'Select a driver', 'valueMember': 'id', 'textMember': 'driver_name', 'data': mThis.form_data.drivers, 'blankErrorMessage': "Choose one driver for Pickup Assignment","defaultValue":prev_driver_id};
        InputBox2.show(option, (data,btnAssign) => {
            if (data) {
                p.driver_id = data.value;
                vsapi.call([mThis.base_url, '/dms/order/assign-driver'].join(''), p,(btn || btnAssign),null).then(res => {
                    if (res.status_code === 200) {
                        const d = StringSanitizer.sanitizeObject(res.data);
                        let statusInfo =d.statusInfo;
                        tr.dataset.driverid  = d.driver_id;
                        tr.querySelector('td.driver_name .driver-name').textContent = d.driver_name;
                        mThis.updateShipmentStatus(tr, statusInfo);
                        if(option.manualClosing) InputBox2.close();
                        cv_interact.success(['The driver ',data.text,' got assigned successfully!'].join(''));
                    }
                    else cv_interact.error(res.error_message);
                });
            }
        });

    }

    //receiveItems | receivePackages
    this.receiveItems_all = (tr, onFinish = null) => {
        let p = {};
        if(!tr) return;
        let order_id = tr.dataset.id || tr.dataset.orderid
        let sender_id = tr.dataset.senderid;
        p.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
        p.id = order_id;
        //p.order_id = order_id;
        p.sender_id = sender_id;
        p.allow_create_order = 0;
        vsapi.call([mThis.base_url, '/dms/order/receive'].join(''), p,null,null,null).then(res => {
            if(res.status_code ==200){
               mThis.hideOrderRow(tr);
               cv_interact.success("Packages arrived at warehouse!");
               if(typeof onFinish ==='function') onFinish();
            }else cv_interact.warning(res.error_message);
        });
    }

    this.hideOrderRow = (tr) => {
        const next_tr = tr.nextElementSibling;
        if(next_tr){
            if(next_tr.classList.contains('detail-row')){
                next_tr.remove();
            }
        }
        tr.remove();
    }

    this.pickItems = (tr, onFinish) => {
        if (!tr || tr.length === 0) return;
        let p = { 'packages': mThis.getItems(tr) };
        p.pickup_date = null;
        p.order_id = tr.dataset.id;
        p.driver_id = null;
        cv_interact.confirm('Pick this order now?',{'context':'update',title:'Pick Order'}, e =>{
             if(e){
                vsapi.call([mThis.base_url, '/dms/order/pick'].join(''), p,null,null).then(res => {
                    if (res.status_code === 200) {
                        let d = StringSanitizer.sanitizeObject(res.data);
                        mThis.updateShipmentStatus(tr, d);
                        if (typeof onFinish === 'function') onFinish(true,d);
                    }
                    else {
                        if (typeof onFinish == 'function') onFinish(false,{});
                        cv_interact.error(res.error_message);
                    }
                });
             }
        });
    }

    this.deleteItem = (tr) => {
        if (!tr || tr.length === 0) return;
        let item_id = tr.dataset.id || tr.dataset.pid;
        let status_id = tr.dataset.statusid;
        let shipment_id = tr.dataset.shipmentid;
         
        if (status_id > 5) {
            cv_interact.warning('Cannot delete this package');
            return;
        }
        if (!item_id)
            tr.remove();
        else {
            cv_interact.confirm('Delete this package?', { title: 'Delete Package', context: 'delete' }, function (e) {
                if (e) {
                    let p = {'shipment_id': shipment_id, 'item_id': item_id,'id': item_id };
                    //console.log('p',p);
                    vsapi.call([mThis.base_url, '/abm/oversea_shipments/delete-item'].join(''), p).then(res => {
                        if (res.status_code === 200) {
                            let d = res.data?res.data:{};
                            tr.remove();
                            mThis.setItemCount(shipment_id, d.package_count);
                        }
                        else cv_interact.error(res.error_message);
                    });
                }
            });
        }
    }

    /** Create html string for "tr" <tr>...</tr> for each given data row 
     * IMPORTANT:  @d = {"order_id","sender_id","status_id",["barcode"]}
    */
    this.createItemRow_html = (d ={},tr_id=null) => {
        const display_cols = ['item_type' , 'size' , 'price_per_kg', 'price' , 'actual_weight' , 'billed_weight' , 'allocated_kg'  , 'item_total'];
        let i = 0, c=null;
        let html_row = null;
        // console.log(d);
        do {
            c = display_cols[i];
            if (!c) break;  
            let val = null;
            if (c != 'size') 
                val = StringSanitizer.sanitizeOut(d[c]);
            else 
                val = DUtil.sanitizePackageSize(d[c]);
            let iType = 'text';
            if (['item_type'].indexOf(c) >= 0) iType = 'select';
            // else if (c === 'zone_code') iType = 'select2';
            // else if (c === 'receiver_phone') iType = 'phone';
            else if (['billed_weight', 'actual_weight','allocated_kg','price', 'price_per_kg','item_total'].indexOf(c) >= 0) iType = 'number';

            let disp_value = val;
            if (c === 'item_type') {
                // console.log('val',val);
                // console.log(DUtil.properCase(d.item_type));
                // disp_value = DUtil.properCase(d.item_type);
                disp_value = 'Doc';
                if (val == 'non_doc') disp_value = 'Non-Doc';
            }
            // else if (c === 'zone_name' || c === 'zone_code') {
            //     val = d.zone_code;
            //     disp_value = d.zone_name;
            // }
            // else if (c === 'delivery_type')
            //     disp_value = DUtil.properCase(d.delivery_type);
            else if (c === 'size')
                disp_value = DUtil.getFriendlySize(d.size);
            else if (['price_per_kg','price','item_total'].indexOf(c) >=0)
             {
                d.currency_code = d.currency_code || 'USD';
                disp_value = [d[c],' ',d.currency_code].join('');
             }
             else if (['billed_weight','actual_weight','allocated_kg'].indexOf(c) >=0){
                disp_value = [d[c],' kg'].join('');  
                // console.log('allocated_kg',disp_value);
             }
            let readOnly = "0";
            
            // console.log(val);
            html_row = [html_row, '<td data-value="', val, '" data-field="', c, '" data-readonly="', readOnly, '" data-inputtype="', iType, '" class="', c, ' text-nowrap">', disp_value, '</td>'].join('');
            i++;
        } while (c);
        // console.log('country_id',d.country_id);
        d.id = d.id || d.package_id;
        let td_action = ['<td class="col_action"><div class="view-actions d-flex gap-3">',
            (d.status_id <= 5) ? '<a href="javascript:void(0)" class="pkl_btn_delete" data-toggle="tooltip" data-placement="right" data-title="Delete package"><i class="fa fa-trash fs-5 text-danger"></i></a>' : null,
            (d.status_id != 11) ? '<a href="javascript:void(0)" class="pkl_btn_edit" data-toggle="tooltip" data-placement="right" data-title="Edit package"><i class="fas fa-edit fs-5 text-primary"></i></a>' : null,
            `<a href="javascript:void(0)" class="pkl_btn_print_barcode" data-barcode="${d.barcode}" data-toggle="tooltip" data-placement="right" data-title="Print barcode"><i class="fa fa-barcode text-success fs-5"></i></a>`,
            , '</div></td>'].join('');
        tr_id = tr_id || DUtil.createGUID();
        return ['<tr id="', tr_id, '" data-barcode="', d.barcode, '"  data-shipmentid="', d.shipment_id, '" data-country_zone="', d.country_zone,'" data-country_id="', d.country_id,'" data-price_list_id="', d.price_list_id,'"  data-item_type="', d.item_type,'" data-senderid="', d.sender_id, '" data-id="', d.id, '" data-statusid="', d.status_id, '" class="pkl-package-row pkl_', (d.id?d.id:0), '">', td_action, html_row, '</tr>'].join('');
    }

    this.createPackageTable_thead_html = (shipment_id,sender_id,country_zone,country_id,price_list_id,item_type)=>{
        //console.log('price_list_id',price_list_id,'country_id',country_id);
        let thead_html = ['<thead><tr>',
            '<th>',
                '<div class="d-flex justify-content-between align-items-center gap-2">',
                '<a data-senderid="', sender_id, '" data-item_type="', item_type, '" data-country_zone="', country_zone, '"  data-shipmentid="', shipment_id,'" data-price_list_id="', price_list_id,'" data-country_id="', country_id,'" href="javascript:void(0)" style="font-weight:bold;width:50px" class="pkl-lnk_add_item"><div class="d-flex align-items-center gap-2"><i class="fa-solid fa-circle-plus fs-5 text-success"></i><span class="fs-5-08">Add</span></div></a>',
                //   '<a data-senderid="', sender_id, '" data-orderid="', order_id, '" href="javascript:void(0)" class="pkl_btn_magic_entry"><i class="fa fa-cube fs-5 text-warning"></i></a>',
                '</div>',
            '</th>', 
            '<th>TYPE</th>',
            '<th>SIZE</th>',
        //   '<th>HEIGHT</th>',
        //   '<th>WEIGHT</th>',
        //   '<th>LENGTH</th>',
            '<th>PRICE PER KG</th>',
            '<th>PRICE</th>',
            '<th>ACTUAL KG</th>',
            '<th>BILLED KG</th>',
            '<th>ALLOC. KG</th>',
            '<th>TOTAL</th>',
          '</tr></thead>'].join(''); 
         return thead_html; 
      }

    this.createPackageTable_html = (shipment_id,sender_id,country_zone,country_id,price_list_id,item_type)=>{
       let html = [`<table class="pkl-package-table table">`,mThis.createPackageTable_thead_html(shipment_id,sender_id,country_zone,country_id,price_list_id,item_type),`<tbody></tbody>`,`</table>`].join('');
       return html; 
    }

    this.addItemRow = (div, d=null, edit_mode = false, refresh_count = false) => {   
        if (!div) return;
        let shipment_id = div.dataset.shipmentid;
        let sender_id = div.dataset.senderid;
        let country_zone = div.dataset.country_zone;
        let country_id = div.dataset.country_id;
        //console.log('country_id',country_id);
        let price_list_id = div.dataset.price_list_id;
        let item_type = div.dataset.item_type;
        let table = div.querySelector('table.pkl-package-table');
        if(!table){
            div.innerHTML = mThis.createPackageTable_html(shipment_id,sender_id,country_zone,country_id,price_list_id,item_type);
            table = div.querySelector('table.pkl-package-table'); 
        } 
        let tbody = table.querySelector('tbody');
        let tr_id = DUtil.createGUID();
        
        /**
         * Set defeault object "d" that must be at least {"order_id","sender_id","status_id",[barcode]}
         * price = 0, fees =0  are all default values when creating new item
        */
        
        if (!d) d = {"sender_id":sender_id,"shipment_id":shipment_id,"status_id":1,"country_zone":country_zone,"country_id":country_id,"price_list_id":price_list_id ,"item_type":item_type,"price":0 ,"price_per_kg":0,"item_total":0,"billed_weight":0};
        let html_row = this.createItemRow_html(d,tr_id);
        //prepend html string to tbody
        tbody.insertAdjacentHTML('afterbegin',html_row);
        let new_tr = tbody.querySelector(['tr#', tr_id].join(''));
        //console.log('new_tr',new_tr);
        if (edit_mode) mThis.beginEditItem(new_tr);
        if (refresh_count) {
            mThis.refresh_item_count(order_id,tbody);
        }
        return new_tr;
    }

    this.getExpandedRow_tr = ()=>{
        if(!mThis.tblOrders) return null;
        return mThis.tblOrders.querySelector('tr.detail-row');  
    }
    /** Returns the instance of package table that is currently being opened, which can be in Edit  Item mode or View Mode */
    this.getActivePackageTable = ()=>{
        if(!mThis.tblOrders) return null;
        const tbl = mThis.tblOrders.querySelector('table.pkl-package-table');
        if(!tbl) return null;
        else if (tbl.style.display !='none') return tbl; 
    }

    /** setQtyByOrderId() 
     * 
    */
    this.setItemCount =(order_id,package_count =0)=>{
        const tr =  mThis.tblShipments[0].querySelector(`tr.order_${order_id}`);
        if(!tr) return;
        const span = tr.querySelector('td.qty .package_count');
        if (span) span.textContent = package_count;
    }

    /** 
     * Refresh item count by counting the table rows locally, Not calling API to get package_count from server
     * "tbody" is the tab;e's body of the package-table
    */
    this.refresh_item_count = (order_id,tbody) => {
       let count = tbody.querySelectorAll('tr').length;
       mThis.setItemCount(order_id,count); 
    //    const span =  mThis.tblPickups.querySelector(`tr.order_${order_id}>td.qty .package_count`);
    //    if (span) span.textContent = count;
    }
    
    this.displayShipmentDetails = (container,shipment_tr,def_view='items')=>{
        container.innerHTML = null;
        //console.log('shipment',shipment_tr);
        const shipment_id = shipment_tr.dataset.id;
        const sender_id = shipment_tr.dataset.senderid;
        const country_zone = shipment_tr.dataset.country_zone;
        const country_id = shipment_tr.dataset.country_id;
        const price_list_id = shipment_tr.dataset.price_list_id;
        const item_type = shipment_tr.dataset.item_type;
        //console.log('price_list_id',price_list_id,'country_id',country_id);

        let html = [
        `<div class="d-flex flex-column p-2 w-100">`,
          `<div class="pkl-header-panel d-flex flex-row justify-content-between w-100">`,
            `<div class="d-flex flex-row gap-2">`,
                `<button type="button" data-id="`,shipment_id,`" data-viewname="items" class="btn-show btn-show-items btn btn-sm btn-secondary"><span>Items</span></button>`, 
                // `<button type="button" data-id="`,order_id,`" data-viewname="images" class="btn-show btn-show-images btn btn-sm btn-primary"><span>Photos</span></button>`, 
            `</div>`,
            
            `<div>`,
            `<button class="btn btn-sm btn-success"><i class="fa fa-print"></i></button>`,
            `</div>`,
         `</div>`, 
          `<div style="margin:15px;"> <div data-id="`,shipment_id,`" class="pkl-order-content p-1 mt-2">This is content</div></div>`,
        `</div>`].join('');
        container.innerHTML = html;
        
        const div = container.querySelector('div.pkl-order-content');
        if(def_view ==='items'){
             mThis.displayOverseaItems(div,shipment_id,sender_id,country_zone,country_id,price_list_id,item_type);
        }else{
            mThis.displayOrderImages(div,shipment_id,sender_id);
        }

        const div_header = container.querySelector('div.pkl-header-panel');
        div_header.onclick =  e=>{
            e.preventDefault();
            let btn = VSUtil.closestLimited(e.target,'.btn-show');
            if (btn){
                const viewname = btn.dataset.viewname;
                if (viewname ==='items'){
                     mThis.displayOverseaItems(div,shipment_id,sender_id,country_zone,country_id,price_list_id,item_type,btn);
                }else{
                    mThis.displayOrderImages(div,shipment_id,sender_id,btn);
                }
                shipment_tr.dataset.view= viewname; 
                return;
            }

        };
        
        div.onclick = e =>{
            e.preventDefault();
            //Click on Add Item button. Quick Add Item button
            let btn = VSUtil.closestLimited(e.target,'.pkl-lnk_add_item');
            if(btn){
                let shipment_id = btn.dataset.shipmentid;
                let sender_id = btn.dataset.senderid;
                let country_zone = btn.dataset.country_zone;
                div.dataset.shipmentid = shipment_id;
                div.dataset.senderid = sender_id;
                div.dataset.country_zone = country_zone;
                div.dataset.country_id = btn.dataset.country_id;
                div.dataset.price_list_id = btn.dataset.price_list_id;
                div.dataset.item_type = btn.dataset.item_type;
                //console.log('div',div);
                // console.log(div.dataset.senderid);
                //const item_table = btn.closest('table.pkl-package-table');  
                //const editing_tr = mThis.getCurrentEditingRow(item_table);
                if (mThis.shm_prev_editing_row){
                    mThis.saveItem(mThis.shm_prev_editing_row,btn,(success)=>{
                        if(success) mThis.addItemRow(div,null,true);
                    });
                    return;
                } else mThis.addItemRow(div,null,true);
                return;
            }
            
 
            mThis.tblShipments.on('click', 'a.pkl_btn_magic_entry', function (e) {
                e.preventDefault();
                let x = $(this);
                let tr = x.closest('tr');
                let shipment_id = x.data('orderid');
                let sender_id = x.data('senderid');
                let op = { 'title': 'Magic Entry', 'sender_id': sender_id, 'shipment_id': shipment_id, 'tr': tr };

                MagicEntryDialog.show(op, (e) => {
                        let package_list_table = $(['#_pkl_wrapper_', shipment_id, ' > .pkl-package-list-table'].join(''));
                        mThis.displayItemList(shipment_id, sender_id, package_list_table);
                });
            });

        }
    }

    this.setDeliveryPrices_item = (tr) => {
        let p = mThis.getItem(tr);
        if(!p) return;
        p.sender_id = tr.dataset.senderid;
        vsapi.call([mThis.base_url, '/dms/package/price-info'].join(''), p,null,false).then(res => {
            if (res.status_code === 200) {
                let cod_fee = 0;
                let delivery_fee = 0;
                let base_fee = 0;
                let df_payer = 'sender';

                let d = StringSanitizer.sanitizeObject(res.data);

                EditableTable.setCellValue(tr, 'base_fee', d.base_fee);
                EditableTable.setCellValue(tr, 'delivery_fee', Number(d.delivery_fee).toFixed(2));

                let price = EditableTable.getCellValue(tr, 'price', true);
                //let cod = 0;
                base_fee = parseFloat(d.base_fee);
                delivery_fee = parseFloat(d.delivery_fee);
                df_payer = EditableTable.getCellValue(tr, 'df_payer',false).toLowerCase();

                if (!price || price <= 0) {
                    EditableTable.setCellValue(tr, 'cod', 0);
                    EditableTable.setCellValue(tr, 'cod_fee', 0);
                }
                else {
                    EditableTable.setCellValue(tr, 'cod', 1);
                    cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent / 100;
                    EditableTable.setCellValue(tr, 'cod_fee', Number(cod_fee).toFixed(2));
                }
                let fees = base_fee + delivery_fee;

                let driver_total = parseFloat((df_payer == 'receiver') ? fees : 0) + parseFloat(price);
                EditableTable.setCellValue(tr, 'fees', Number(fees).toFixed(2));
                EditableTable.setCellValue(tr, 'driver_total', Number(driver_total).toFixed(2));
            }
        });
    }

    this.getCurrentEditingRow = (tbl = null)=>{
      tbl = tbl || mThis.getActivePackageTable();
      if(tbl){
         tbl.querySelectorAll('tbody > tr').forEach(tr =>{
             const editing = tr.dataset.editing;
            if(editing ==1 || editing == true) return tr;
         });
         return null;
      }
      return null;
    }
    //displayItemList  | renderPackageTable
    this.displayOverseaItems = (div, shipment_id,sender_id,country_zone,country_id,price_list_id,item_type,btn=null) => {
        let p = { 'id':  shipment_id};
        //console.log(p);
        // const content_panel_class = 'pkl-order-content';
        // const div = container.querySelector(content_panel_class);
        //div.style.display= 'none';
        div.innerHTML = '<div class="d-flex justify-content-center flex-column align-items-center animation-line" style="height:2px;margin:0;"></div>';
        let html = '';
        //console.log('price_list_id',price_list_id,'country_id',country_id);

        const header_cols = mThis.createPackageTable_thead_html(shipment_id,sender_id,country_zone,country_id,price_list_id,item_type);
        vsapi.call([mThis.base_url, '/abm/oversea_shipments/item-list'].join(''), p,null,null,null).then(res => {
            if (res.status_code === 200) {
                let packages = StringSanitizer.sanitizeObject(res.data,null,['size']);
                let i = 0, c =null;
                // console.log(packages);
                do {
                    c = packages[i];
                    if (!c) break;
                    c.shipment_id = shipment_id;
                    c.country_zone = country_zone;
                    c.country_id = country_id;
                    c.price_list_id = price_list_id;
                    //console.log('c',c);
                    html = [html,mThis.createItemRow_html(c,null)].join('');
                    i++;
                } while (c);
                if (i > 0){
                   html = [`<table class="table pkl-package-table">`,header_cols,`<tbody>`, html ,`</tbody></table>`].join('');
                }else{
                    mThis.shm_prev_editing_row = null;
                    html = [`<div class="p-2 d-flex justify-content-center gap-2"><span class="h5 text-center p-1 fw-semibold">មិនទាន់បញ្ចូលកញ្ចប់ទំនិញ</span><a href="javascript:void(0)" data-shipmentid="`,shipment_id,`"  data-item_type="`,item_type,`" data-price_list_id="`,price_list_id,`" data-country_id="`,country_id,`" data-country_zone="`,country_zone,`" data-senderid ="`,sender_id,`" class="pkl-lnk_add_item mt-2"><span class="p-2 border border-primary rounded-4">Add Item</span></a></div>`].join('');
                }
                div.innerHTML = html;
                //div.style.display ='block';
                //if (i > 0) mThis.setItemCount(order_id)
            }
        });
    }
 
    /** displayOrderItems | renderPackagePhotos | renderItemsPhotos */
    // this.displayOrderImages = (div,order_id,sender_id=null,btn = null)=>{
    //     div.innerHTML = '<div class="animation-line" style="height:2px;margin:0;"></div>';
    //     let p = {'id': order_id};
    //     vsapi.call(`${mThis.base_url}/api/order/package-photos`,p,btn,false,null).then(res => {
    //         let html = null;
    //         let cnt =0;
    //         if(res.status_code === 200){
    //             let imgs = StringSanitizer.sanitizeObject(res.data,null,["image_url"]);
    //             let image_html = "";
    //             imgs.map(item => {
    //                 //class="d-flex flex-column pe-4"
    //                 const cls_border = item.barcode? 'border border-danger':'';
    //                 image_html = [image_html,`<div class="img-box position-relative">
    //                     <img data-orderid ="`,order_id,`" data-senderid="`,sender_id,`" data-id="`,item.id,`" data-pid="`,item.package_id,`" class="item-img `,cls_border,`" style="width:150px; height:150px;" src="${item.image_url}" data-url="${item.image_url}"/>`,

    //                     `<div style="visibility:hidden;background-color: rgba(0, 0, 0, 0.6);position:absolute;bottom: 2px; right: 2px;" class="img-actions bg-secondary rounded-3 d-flex flex-row gap-2 p-1">`,
    //                     //   `<a href="javascript:void(0)" class="btn-edit-img full-opacity" data-id="${item.id}">
    //                     //    <i class="fa fa-regular fa-edit text-warning fs-5"></i>
    //                     //   </a>`,  
    //                       `<a href="javascript:void(0)" class="btn-delete-img full-opacity" data-id="${item.id}">
    //                           <i class="fa fa-regular fa-trash-can text-danger fs-5"></i>
    //                         </a>`,
    //                     `</div>`,
    //                 `</div>`].join('');
    //                 cnt++;
    //                 mThis.current_images = imgs;
    //             });
                
    //             let container_id = ['oi_order_',order_id].join(''); 
    //             if (cnt>0) 
    //                html = [`<div class="d-flex align-items-center gap-2 pb-4 p-3 my-3 mb-4" style="overflow-x: auto; width:86vw;" id="${container_id}">`,image_html,`</div>`].join('');
    //             else
    //             {
    //                 let empty_text = LocaleManager.trans('No item images to display'); 
    //                 html = [`<div class="d-flex justify-content-center" id="${container_id}"> <span class ="no-image-text p-3 d-block border rounded-5 border-warning fw-bold">${empty_text}</span> </div>`].join('');
    //             }
    //         }
    //         else{
    //             html =`<div class="expanded-row-error">${res.error_message}</div>`;
    //         }
    //         div.innerHTML = html;
            
    //         div.addEventListener('click',e=>{
    //            e.preventDefault();

    //            //** Click on Image to Start Data Entry */
    //            let img = VSUtil.closestLimited(e.target,'.item-img');
    //            if(img){
    //               const img_id = img.dataset.id;
    //               const order_id = img.dataset.orderid;
    //               const sender_id = img.dataset.senderid;
    //               let op = {
    //                 //currentView:"images", /** For refresh display When user close the Dialog */
    //                 title:"Package Details",
    //                 order_id:order_id,
    //                 items : mThis.current_images,
    //                 id:img_id,
    //                 image_url: img.getAttribute('src'),
    //                 onClose:(d)=>{
    //                   //Refresh image list. If No more images left, then display Items Tab instead
    //                   mThis.displayOrderImages(div,order_id,sender_id); 
    //                 }
    //               }
    //               ItemEntryDialog.show(op);
    //               return;   
    //            }

    //            //*** Click on Delete image
    //            let btn = VSUtil.closestLimited(e.target,'a.btn-delete-img');
    //            if(btn){
    //               cv_interact.confirm('Delete this image?',{"title":"Delete Photo","context":"delete"},e=>{
    //                  if(e){
    //                     const img_id = btn.dataset.id;
    //                      let p = {"photo_ids":img_id};
    //                      vsapi.call(`${main_view.base_url}/api/order/delete-photos`,p,null).then(res=>{
    //                         mThis.displayOrderImages(div,order_id,sender_id,btn); 
    //                      });
    //                  }
    //               });

    //               return;
    //            }
    //         });

    //         div.querySelectorAll('.img-box').forEach(div_img => {
    //             div_img.addEventListener('mouseover', e => {
    //                 e.preventDefault();
    //                 const p_div = VSUtil.closestLimited(e.target, '.img-box', 10);
    //                 if (p_div) {
    //                     const div_actions = p_div.querySelector('.img-actions');
    //                     div_actions.style.visibility = 'visible';
    //                     //console.log('mouse over ', div_actions.dataset.id);
    //                 }
    //             });
            
    //             div_img.addEventListener('mouseout', e => {
    //                 e.preventDefault();
    //                 const p_div = VSUtil.closestLimited(e.target, '.img-box', 10);
    //                 if (p_div) {
    //                     const div_actions = p_div.querySelector('.img-actions');
    //                     div_actions.style.visibility = 'hidden';
    //                     //console.log('mouse leave ', div_actions.dataset.id);
    //                 }
    //             });
    //         });
             
    //     });
    // }
 
    this.getItems = (header_tr) => {
        if (!header_tr) return null;
        let order_id = header_tr.dataset.id || header_tr.dataset.orderid;
        let prev_tr = header_tr.nextSiblingElement;
        let parts = [];
        if(!prev_tr) return [];
        if (prev_tr.classList.contains('detail-row') && prev_tr.dataset.id == order_id) {
            let tbl = prev_tr.querySelector('table.pkl-package-table');
            if(!tbl) return [];
            let row_index = 0;
            let rows = [];

            let cnt = 0;
            tbl.querySelector('tbody>tr').forEach(tr => {
                cnt++;
                let row = mThis.getItem(tr);
                if (row) rows.push(row);
                if (cnt === 35) {
                    parts.push(rows);
                    rows = [];
                    cnt = 0;
                }
                row_index++;
            });
            if (row_index + 1 < 35 || cnt < 35) parts.push(rows);
            return parts;
        }
        return [];
    }

    this.getItem = (tr) => {
        if(!tr || !tr.innerHTML) return null;
        let i = 0;
        let p = {};
        let reqiured_fields = ['item_type']
        let is_editing_mode = tr.dataset.editing;
        if (is_editing_mode == 1 || is_editing_mode == true) {
            p.barcode = tr.dataset.barcode;

            tr.querySelectorAll('td').forEach(td =>{  
                td.classList.remove('td-has_error');
                if (i > 0) {
                    let f = td.dataset.field;
                    let el = td.querySelector('.col-input');
                    if(el){
                        p[f] = el.value;
                        if (f == 'delivery_type')
                            p.delivery_type = DUtil.properCase(p.delivery_type);
                        else if (f == 'zone_code' || f == 'zone_name') {
                            p.zone_code = p[f];
                            p.zone_name = el.options[el.selectedIndex]? el.options[el.selectedIndex].text : '';
                        }
                        else if (f == 'size') {
                                p.size = DUtil.processPackageSize(p.size);
                                if (!p.size) {
                                    td.classList.add('td-has_error');
                                    return null;
                                }
                        }
                        if (reqiured_fields.indexOf(f) >= 0) {
                            if (!p[f]) {
                                td.classList.add('td-has_error');
                                return null;
                            }
                        }
                    }              
                }
                i++;
            });
            p.price = p.price >=0? p.price :0;
            return p;
        }
        else {
            p.barcode = tr.dataset.barcode;
            p.shipment_id = tr.dataset.shipmentid;
            tr.querySelectorAll('td').forEach(td =>{
                td.classList.remove('td-has_error');
                if (i > 0) {
                    let f = td.dataset.field;
                    p[f] = td.dataset.value;
                    if (f == 'item_type')
                        p.item_type = DUtil.properCase(p.item_type);
                    else if (f == 'size') {
                        if (p.size) {
                            p.size = DUtil.processPackageSize(p.size);
                            if (!p.size) {
                                td.classList.add('td-has_error');
                                return null;
                            }
                        }
                    }

                    if (reqiured_fields.indexOf(f) >= 0) {
                        if (!p[f]) {
                            td.classList.add('td-has_error');
                            return null;
                        }
                    }
                }
                i++;
            });
 
        }
        return p;
    }

    this.setItemReadOnly = (tr, refresh = false, data =null) => {
        if (refresh) data = null;
        //console.log('data:',data);
        //console.log('tr:',tr);
        let ship_id = tr.dataset.shipmentid;
        let item_id = tr.dataset.id;
        let p = { 'shipment_id': ship_id, 'item_id': item_id };
        if (!ship_id || ship_id <= 0) {
            cv_interact.confirm('Are you sure to discard this item?', { title: 'Discard Item', context: 'delete' }, e => {
                if (e) {
                    tr.remove();
                    mThis.shm_prev_editing_row = null;
                }
            });
            return;
        }

        let index = 0;
        if (!refresh) {
            let status_id = tr.dataset.statusid;
            if (!status_id) status_id = 1;
            data = data ? data : mThis.getItem(tr);
            if (!data) data = {};

            tr.dataset.editing = 0;
            tr.querySelectorAll('td').forEach(td =>{
                let col_name = td.dataset.field;
                if (index == 0) {
                    let html_buttons = ['<div class="d-flex flex-row gap-3">',
                        (status_id <= 5) ? '<a href="javascript:void(0)" class="pkl_btn_delete" data-toggle="tooltip" data-placement="right" data-title="Delete package"><i class="fa fa-trash fs-5 text-danger"></i></a>' : null,
                        (status_id != 11) ? '<a href="javascript:void(0)" class="pkl_btn_edit" data-toggle="tooltip" data-placement="right" data-title="Edit package"><i class="fa fa-edit text-primary fs-5"></i></a>' : null,
                        '<a href="javascript:void(0)" class="pkl_btn_print_barcode" data-toggle="tooltip" data-placement="right" data-title="Print barcode"><i class="fa fa-barcode text-success fs-5"></i></a>',
                        '</div>'].join('');
                    td.innerHTML = html_buttons;
                }
                else {
                    let val = data[col_name];
                    let disp_value = val;

                    if (col_name == 'item_type') {
                        val = data.item_type;
                        disp_value = DUtil.properCase(data.item_type);
                    }
                    else if (col_name == 'billed_weight') {
                        val = data.billed_weight;
                        disp_value = [data.billed_weight,' kg'].join('');
                    }
                    else if (col_name == 'actual_weight') {
                        val = data.actual_weight;
                        disp_value = [data.actual_weight,' kg'].join('');
                    }
                    else if (col_name == 'allocated_kg') {
                        val = data.allocated_kg;
                        disp_value = [data.allocated_kg,' kg'].join('');
                    }
                    else if (col_name == 'price') {
                        val = data.price;
                        disp_value = [data.price,' USD'].join('');
                    }
                    else if (col_name == 'price_per_kg') {
                        val = data.price_per_kg;
                        disp_value = [data.price_per_kg,' USD'].join('');
                    }
                    else if (col_name == 'item_total') {
                        val = data.item_total;
                        disp_value = [data.item_total,' USD'].join('');
                    }
                    else if (col_name == 'size') {
                        console.log('data.size',data.size);
                        if (data.size || typeof data.size === 'string')
                            disp_value = DUtil.getFriendlySize(data.size);
                        else if(data.size) {
                            val = [data.size.width, ' ', data.size.length, ' ', data.size.height].join('');
                            disp_value = DUtil.getFriendlySize(val);
                        }
                    }
                    td.dataset.value =  val;
                    td.innerHTML =  disp_value;
                }
                index++;
            });
            tr.dataset.editing = 0;
            mThis.shm_prev_editing_row = null;
            return;
        }
        //console.log('p',p);
        vsapi.call([main_view.base_url, '/abm/oversea_shipments/item-details'].join(''), p).then(res => {
            if (res) {
                //console.log(res);
                if (res.data == null) {
                    cv_interact.confirm('Are you sure to discard this item?', { title: 'Discard Item', context: 'delete' }, e => {
                        if (e) {
                            tr.remove();
                            mThis.shm_prev_editing_row = null;
                        }
                    });
                    return;
                }
                let data = StringSanitizer.sanitizeObject(res.data,null,['size']);
                if (!data.status_id) data.status_id = 1;
                tr.querySelectorAll('td').forEach(td =>{
                let col_name = td.dataset.field;
                    if (index === 0) {
                        let html_buttons = ['<div class="d-flex flex-row gap-3">',
                            (data.status_id <= 5) ? '<a href="javascript:void(0)" class="pkl_btn_delete" data-toggle="tooltip" data-placement="right" data-title="Delete package"><i class="fa fa-trash text-danger fs-5"></i></a>' : null,
                            (data.status_id != 11) ? '<a href="javascript:void(0)" class="pkl_btn_edit" data-toggle="tooltip" data-placement="right" data-title="Edit package"><i class="fa fa-edit text-primary fs-5"></i></a>' : null,
                            '<a href="javascript:void(0)" class="pkl_btn_print_barcode" data-barcode="', data.barcode, '" data-toggle="tooltip" data-placement="right" data-title="Print barcode fs-5"><i class="fa fa-barcode text-success fs-5"></i></a>',
                            '</div>'].join('');
                        //td.innerHTML = null;
                        //td.insertAdjacentHTML('beforeend',html_buttons);
                        td.innerHTML = html_buttons;
                    }
                    else {
                        let val = data[col_name];
                        let disp_value = val;
    
                        if (col_name == 'item_type') {
                            val = data.item_type;
                            disp_value = DUtil.properCase(data.item_type);
                        }
                        else if (col_name == 'billed_weight') {
                            val = data.billed_weight;
                            disp_value = [data.billed_weight,' kg'].join('');
                        }
                        else if (col_name == 'actual_weight') {
                            val = data.actual_weight;
                            disp_value = [data.actual_weight,' kg'].join('');
                        }
                        else if (col_name == 'allocated_kg') {
                            val = data.allocated_kg;
                            disp_value = [data.allocated_kg,' kg'].join('');
                        }
                        else if (col_name == 'price') {
                            val = data.price;
                            disp_value = [data.price,' USD'].join('');
                        }
                        else if (col_name == 'price_per_kg') {
                            val = data.price_per_kg;
                            disp_value = [data.price_per_kg,' USD'].join('');
                        }
                        else if (col_name == 'item_total') {
                            val = data.item_total;
                            disp_value = [data.item_total,' USD'].join('');
                        }
                        else if (col_name == 'size') {
                            //console.log('data.size',data.size);
                            if (data.size || typeof data.size === 'string')
                                disp_value = DUtil.getFriendlySize(data.size);
                            else if(data.size) {
                                val = [data.size.width, ' ', data.size.length, ' ', data.size.height].join('');
                                disp_value = DUtil.getFriendlySize(val);
                            }
                        }
                        td.dataset.value =  val;
                        td.innerHTML =  disp_value;
                    }
                    index++;
                });
            }
            /* This is important to set editing mode back to 0 when Canceling Edit view */
            tr.dataset.editing= 0;
        });
    }

    /** return TRUE if user is editing item or package */
    this.isEditingItem = (tbl) => {
        if(!tbl) return false;
        tbl.querySelectorAll('tbody>tr').forEach(tr => {
            let r = tr.dataset.editing;
            if (r == 1 || r == true) return true;
        });
        return false;
    }

    this.saveItem = (tr, lnk = null, onFinish = null) => {
        if (!tr) return;
        //tr is the package tr , NOT shipment_tr
        let p = mThis.getItem(tr);

        //console.log('tr',tr);
        p.shipment_id = tr.dataset.shipmentid;
        // //console.log(tr.dataset.shipmentid);
        p.id = tr.dataset.id;
        //console.log('p',p);

        vsapi.call([mThis.base_url, '/abm/oversea_shipments/create-item'].join(''), p, lnk).then(res => {
            if (res.status_code === 200) {
                let data = res.data;
                let packageInfo = StringSanitizer.sanitizeObject(data.package,null,['size']);
                //console.log(packageInfo);
                //console.log('item',data.package.item_type);
                if (!data.package.item_type) console.error('Problem in api/order/save-package because this method returns delivery_type (result.data.delivery_type) as NULL or empty');
                // data.item_type = (packageInfo.item_type || '').toLowerCase();

                // tr.dataset.id = packageInfo.package_id;
                // tr.dataset.codfee = packageInfo.cof_fee;
                // tr.dataset.barcode = packageInfo.barcode;
                const lnk_barcode = tr.querySelector('td.col_action .pkl_btn_print_barcode');
                if(lnk_barcode) lnk_barcode.dataset.barcode = packageInfo.barcode;
                if (data.price_error) cv_interact.warning(data.price_error);
                mThis.setItemReadOnly(tr, false, packageInfo);
                //Refresh Order's QTY
                mThis.setItemCount(p.order_id, data.package_count);
                if (typeof onFinish === 'function') onFinish(true);
            }
            else {
                cv_interact.error(res.error_message);
                if (typeof onFinish === 'function') onFinish(false);
            }
        });
    }

    // this.setEditor_events = (tr)=>{
    //     if(!tr) return;
    //     tr.querySelectorAll('td').forEach(td=>{
    //         const f = td.dataset.field;
    //         const el = td.querySelector('.col-input');
    //         if(el){
    //             if(f=='item_type'){
    //                 el.onchange =(e)=>{
    //                     e.preventDefault();
    //                     EditableTable.setCellValue(tr, 'price_per_kg',100);
    //                 }
    //             }
    //         }
    //     })
    // }

    this.beginEditItem = (tr, data =null,lnk = null) => {
        if (!tr) return;  
        if (!data) data = mThis.getItem(tr);
        if (!data.status_id) data.status_id = 1;


        /** If there is another item being open for Editing or being in Edit mode, then close it first before converting this row (tr) into Edit mode  */
        if (mThis.shm_prev_editing_row) {
            if (mThis.shm_prev_editing_row.dataset.barcode && mThis.shm_prev_editing_row.dataset.id != tr.dataset.id) {
                //if (!mThis.getItem(tr)) return;
                let refresh_from_database = false;
                if (!mThis.org_item_data || !mThis.org_item_data.delivery_type) refresh_from_database = true;
                
                // mThis.setItemReadOnly(mThis.shm_prev_editing_row, refresh_from_database, mThis.org_item_data);
                mThis.makeRowEditable(tr,data);

                // mThis.saveItem(mThis.pkl_prev_editing_row,lnk,(success)=>{
                //    if (success){
                //       //console.log(mThis.pkl_prev_editing_row);
                //       //mThis.setItemReadOnly(mThis.pkl_prev_editing_row, false, mThis.org_item_data); 
                //       mThis.makeRowEditable(tr,data);
                //    }
                // });
               
            } else if (!mThis.shm_prev_editing_row.dataset.barcode){
                /** This case: happends When user click on Add Item button, but did not enter details, and then click on Edit item another item below, so automatically delete the empty item above, and start Editing row on the targeted item row */
                cv_interact.confirm('ចង់លុបកញ្ចប់ខាងលើ មែនទេ?',{"context":"delete","title":"Cancel Edit"},e=>{
                    if(e){
                        mThis.shm_prev_editing_row.remove();
                        mThis.makeRowEditable(tr,data);
                }
                });
               
            } else mThis.makeRowEditable(tr,data);
        } else mThis.makeRowEditable(tr,data);
        mThis.setEditor_events(tr);

   }

    /** make item row editable */
    this.makeRowEditable = (tr,data)=>{
        const readOnlyFields = ['item_type','price_per_kg','price','billed_weight','item_total'];
        const def_min_width ='90px';
        //console.log('tr',tr);
        const minWidths = {
            // "cod":"100px",
            "item_type":"150px",
            "billed_weight":"200px",
            "actual_weight":"200px",
            "allocated_kg":"200px",
            "heigth":"200px",
            "weigth":"200px",
            // "remarks":"250px",
            "length":"200px",
            "price":"120px",
            "price_per_kg":"120px"
        };
         
        let i = 0;
        tr.querySelectorAll('td').forEach(td =>{
            let col_name = td.dataset.field;
            // console.log('col_name',col_name);

            if (i === 0) {
                let html_buttons;
                html_buttons = ['<div class="edit-actions d-flex flex-row gap-2 mt-3">',
                    '<a href="javascript:void(0)" class="pkl_btn_cancel_edit" style="color:orange"><i class="fa fa-times fs-5"></i></a>',
                    '<a href="javascript:void(0)" class="pkl_btn_save" style="color:green"><i class="fa fa-save fs-5"></i></a>',
                    '<a href="javascript:void(0)" data-barcode="', data.barcode, '" class="pkl_btn_print_barcode" style="color:green"><i class="fa fa-barcode-alt fs-5"></i></a>',
                    '</div>'].join('');
                td.innerHTML = null;
                td.insertAdjacentHTML('beforeend',html_buttons);
            }

            if (i > 0) {
                let val = data[col_name];
                let disp_value = val;
                switch (col_name) {
                    case 'cod': {
                        val = data.cod;
                        disp_value = 'Yes';
                        if (val == 0) disp_value = 'No';
                        break;
                    }
                    case 'zone_code': {
                        val = data.zone_code;
                        disp_value = data.zone_name;
                        break;
                    }
                    case 'zone_name': {
                        val = data.zone_code;
                        disp_value = data.zone_name;
                        break;

                    }
                    case 'delivery_type': {
                        disp_value = DUtil.properCase(disp_value);
                        break;
                    }
                    case 'size': {
                        disp_value = null;
                        if (typeof val === 'string')
                            disp_value = DUtil.getFriendlySize(val);
                        else if (val) {
                            val = [val.width, ' ', val.length, ' ', val.height].join('');
                            disp_value = DUtil.getFriendlySize(val);
                        }
                        break;
                    }
                    case 'df_payer': {
                        val = (disp_value + '').toLowerCase();
                        break;
                    }
                    default: {
                        break;
                    }
                }

                td.innerHTML = null;
                let field_name = td.dataset.field;
                let inputType = td.dataset.inputtype;
                //console.log(inputType);
                let input_html;
                let is_readOnly = null;
                let readOnly = 0;

                if (readOnlyFields.indexOf(col_name) >= 0) readOnly = 1;
                if (readOnly == 1 || readOnly==true) {
                    if (['number','phone','email','input','text'].indexOf(inputType) >=0 || !inputType)
                        is_readOnly = " readonly";
                    else if (['select2','select'].indexOf(inputType) >=0) is_readOnly = " disabled";
                }
                let style_min_width = minWidths[field_name]? [' style="min-width: ',minWidths[field_name],';"'].join('') : ['style="min-width:',def_min_width,'" '].join('');
                if (inputType === 'number')
                    input_html = ['<input type="number" class="form-control col-input" value="', val, '" ',style_min_width, is_readOnly, '>'].join('');
                else if (inputType === 'select2')
                    input_html = ['<div><select class="col-input modal-select2"',style_min_width, is_readOnly, '></select></div>'].join('');
                else if (inputType === 'select')
                    input_html = ['<select class="form-control col-input" ',style_min_width, is_readOnly, '></select>'].join('');
                else if (inputType === 'phone')
                    input_html = ['<input type="text" class="form-control col-input" value="', val, '" ',style_min_width, is_readOnly, '>'].join('');
                else
                    input_html = ['<input type="text" class="form-control col-input" value="', val, '" ',style_min_width, is_readOnly, '>'].join('');
                td.insertAdjacentHTML('beforeend',input_html);
                
                if (['select2','select'].indexOf(inputType) >=0) {
                    td.style.minWidth = minWidths[field_name] || def_min_width; 
                    let el = td.querySelector('select.col-input');
                    el.innerHTML = null;
                    let items;
                    let def = val;

                    if (field_name === 'cod') {
                        items = [{ 'id': 1, 'text': 'Yes' }, { 'id': 0, 'text': 'No' }];
                        if (!def) def = 1;
                    }
                    else if (field_name === 'item_type') {
                        items = [{ 'id': '0', 'text': 'Select item type' },{ 'id': 'doc', 'text': 'doc' }, { 'id': 'non_doc', 'text': 'non-doc' }];
                        def = data.item_type ? (data.item_type + '').toLowerCase() : null;
                        if (!def) def = '0';
                    }
                    
                    if (items) VSUtil.setComboItems(el, items, 'id', 'text', false, null, def);
                    if (field_name === 'df_payer' || field_name === 'cod') {
                        td.dataset.value = val;
                    };
   
                       if (field_name === 'zone_name' || field_name === 'zone_code') {
                           let zone_code = td.dataset.value;
                           if (!mThis.form_data) {
                               mThis.form_data = {};
                               mThis.form_data.zones = [];
                               console.error('Error at ShipmentsComponent.js => this.beginEditItem() => problem: "mThis.form_data" is NULL ');
                           };
                           VSUtil.setComboItems(el, mThis.form_data.zones, 'zone_code', 'zone_name', false, null, zone_code);
                           el.dispatchEvent (new Event('change'));
                       }
                       $(el).select2({
                           width: '100%'
                       });

                }
            }
            i++;
        });
  
        //Set onChange, onClick, onBlur event handler for SELECT, INPUT elements on this row "tr" for editing item
        mThis.setEditor_events(tr);

        tr.dataset.editing = 1;
        mThis.shm_prev_editing_row = tr;

        if (data) {
            if (!data.delivery_type) data = null;
        }
        mThis.org_item_data = data;
    }

    /** Set calcuated billed KG on Expandable Item list */
    this.setBilledKg = (tr, size_string = null) => {
        if (!size_string) size_string = EditableTable.getCellValue(tr, 'size',false);
        if (!size_string) return;
     
        let size = DUtil.processPackageSize(size_string);
        if (!size) {
            return;
        }
        //console.log('tr',tr);
        //console.log('size',size);

        if (!size.length) return;
        let kg = 0;
        let b = size.length * size.width * size.height;
        b = Number(b /5000);
        let actual_kg = EditableTable.getCellValue(tr, 'actual_weight',true);
        if (b > actual_kg) kg = b; else kg = actual_kg;
        //console.log('kg',kg);
        EditableTable.setCellValue(tr, 'billed_weight', Number(kg).toFixed(2));
        let alloc_kg = EditableTable.getCellValue(tr, 'allocated_kg',true);
        let total_kg = kg + alloc_kg;
        let price_per_kg =  EditableTable.getCellValue(tr, 'price_per_kg',true);
        let price = kg * price_per_kg;
        EditableTable.setCellValue(tr, 'price', Number(price).toFixed(2));
        let total_price = price_per_kg * total_kg;
        EditableTable.setCellValue(tr, 'item_total', Number(total_price).toFixed(2));
        //console.log('total price',total_price);

    }

    /** When turning item row into Edit mode, this method will set onChange, and onClick event handlers for INPUT, SELECT elements. This method called inside mThis.beginEditItem() */
    this.setEditor_events = (tr)=>{
        //Event handler for Edit package on sub table inside tblpIckup
        let item_type = EditableTable.getCellValue(tr,'item_type',false); 
        //console.log('item',item_type);
        mThis.showPrice_per_kg(tr,item_type);
        tr.querySelectorAll('.col-input').forEach( input => {
           const td = input.closest('td'); 
           const col_name = td.dataset.field;
           //todo: we can set data-field for the input.col-input for faster query selector
           
           input.onchange =  e =>{
              e.preventDefault();
              td.dataset.value = input.value;

               if (col_name == 'item_type') {
                    // let price_per_kg = 1.5;
                    let billed_kg = EditableTable.getCellValue(tr,'billed_weight',true); 
                    
                    // item_type =='doc' ? item_type='doc_items' : item_type='non_doc_items';
                    
                    let price_per_kg = EditableTable.getCellValue(tr,'price_per_kg',true); 
                    //console.log(price_per_kg);
                    let price = price_per_kg * billed_kg;
                    EditableTable.setCellValue(tr,'item_total',Number(price).toFixed(2));
                }
                else if (['size','actual_weight'].indexOf(col_name) >=0){
                    mThis.setBilledKg(tr); 
                }
                else if (col_name == 'allocated_kg'){
                    mThis.setBilledKg(tr); 
                    // mThis.setDeliveryPrices_item(tr);
                }
           }; 

           input.addEventListener('keyup', e => {
                e.preventDefault();
                if (col_name ==='price'){
                    if (input.value > 0) EditableTable.setCellValue(tr,'cod',1);
                    else EditableTable.setCellValue(tr,'cod',0);
                }
                // else if (col_name =='actual_kg'){
                //     mThis.setBilledKg(tr);
                // }

                // setTimeout(() => {
                //     mThis.setDeliveryPrices_item(tr);
                // }, 250);
          });
         
        });

    }

    this.showPrice_per_kg = (tr,item_type = null) =>{
        let p = {"price_list_id": tr.dataset.price_list_id,
                    "country_id": tr.dataset.country_id ,
                    "zone_codes": tr.dataset.country_zone};
        // let item_type
        //console.log('p',p);
        vsapi.call([mThis.base_url, '/abm/getPriceList_data'].join(''), p, null).then(res => {
            let price_per_kg =0;
            if (res.status_code === 200) {
                if(item_type=='doc'){
                    price_per_kg = res.data.data.doc_items.price_per_kg;
                }
                else if(item_type=='non_doc'){
                    price_per_kg = res.data.data.non_doc_items.price_per_kg;
                }
                else{
                    price_per_kg = 0 ;
                }
            }
            else cv_interact.warning(res.error_message);
            EditableTable.setCellValue(tr,'price_per_kg',price_per_kg);
            //console.log(price_per_kg);
        });
    }
  
    this.resizePackageList = () => {
        let div = mThis.tblShipments.closest('div.border-style1');
        let w = div.width();
        mThis.self.find('dv.package_list_wrapper').css('width', [w, 'px !important'].join(''));
    }

    this.hideQuickButtons = (tr)=>{
        // console.log(tr);
        // let td = tr.querySelector('td.request_date');
        let td = tr.querySelector('td.Booking-Date');
        //console.log(td);
            let dx = td.querySelector('div.pkl-quick_action_buttons');
        if (dx){
            dx.remove();
        }
    }

    this.showQuickButtons = (tr) => {
        let sender_id = tr.dataset.senderid;
        let order_id = tr.dataset.id;
        let status_id = tr.dataset.statusid;
        if (mThis.prev_quick_buttons) mThis.prev_quick_buttons.style.visibility = 'hidden';
        // let td = tr.querySelector('td.request_date');
        let td = tr.querySelector('td.Booking-Date');
        let dx = td.querySelector('div.pkl-quick_action_buttons');
        if (dx) {
            if (status_id > 3){
                const btn = dx.querySelector('.pkl_btn_pick');
                if(btn) btn.style.visibility='hidden';
            } else{
                const btn = dx.querySelector('.pkl_btn_pick');
                // btn.style.visibility='visible';
            }
            dx.style.visibility='visible';
            mThis.prev_quick_buttons = dx;
            return;
        }

        td.insertAdjacentHTML('afterbegin',['<div id="pkl_quick_buttons_', order_id, '" class="d-flex flex-row gap-2 pkl-quick_action_buttons">',
                (status_id < 3) ? ['<a href="javascript:void(0)" data-senderid="', sender_id, '" data-orderid="', order_id, '" class="pkl_btn_pick pl-1 pr-1 border rounded-3 border-primary">Pick</a>'].join('') : null,
                (status_id < 5) ? ['<a href="javascript:void(0)" data-senderid="', sender_id, '" data-orderid="', order_id, '" class="pkl_btn_receive fw-semi-bold text-success ml-2 border rounded-2 pl-1 pr-1 border-success">Arrive</a>'].join('') : null,
                '</div>'].join(''));
        mThis.prev_quick_buttons  = td.querySelector(['#pkl_quick_buttons_',order_id].join(''));
    }

    this.getFilterData = ()=>{
     return {"search_value":mThis.elSearchPickup.val()};
    }

    this.getFilterData = () => {
        let p = {
            // search_value: mThis.elSearch.val(),
        };
        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            let f= el.dataset.field;
            p[f] = el.value;
        });

        return p;
    }

    this.show = (options = null) => {
        mThis.init(); //InitOnce one time only
        if(AuthManager.allowed(220,true)) mThis.btnNewShipment.show(); else mThis.btnNewShipment.hide();
        mThis.shipmentListView.showPage(mThis.getFilterData());
        mThis.self.siblings().hide();
        main_view.setTitle(mThis.title_prop);
        mThis.self.fadeIn(250);
    }

    this.hide = () => {
        mThis.self.hide();
    }

    this.getOrderStatusColorClass = (status_id) => {
        if (status_id == 0) return 'text-danger';
        else if (status_id == 1) return 'text-danger';
        else if (status_id == 2) return 'text-info';
        else if (status_id == 3) return 'text-info';
        else if (status_id == 4) return 'text-success';
        else return 'text-info';
    }

    this.updateShipmentStatus = (tr, status_info) => {
        if (!tr || !status_info) return;
        let div_dropdown = tr.querySelector('td.col_action div.dropdown');
        let el = div_dropdown.querySelector('a.btn_shipment_action');

        tr.dataset.statusid = status_info.status_id;
        if(el) el.dataset.statusid =  status_info.status_id;

        el = div_dropdown.querySelector('div.dropdown-menu');
        if(el){
            el.dataset.statusid =  status_info.status_id;
        }
  
        let completed = status_info.completed;
        tr.dataset.completed = completed ? completed : 0;

        el = tr.querySelector('td.order_status .order-status');
        el.classList.add(mThis.getOrderStatusColorClass(status_info.status_id));
        el.textContent =  status_info.status;  
        el = tr.querySelector('td.order_status a');
        el.dataset.statusid = status_info.status_id;

        // let div = tr.querySelector('td.order_code').find('div.pl-order-special-status');
        // div.empty();
        //let cls_special_order_class = mThis.getSpecialStatusClass(status_info.status_id);
        //div.append(['<span class="', cls_special_order_class, '"></span>'].join(''));

        // if (!status_info.driver_name) status_info.driver_name = 'មិនទាន់មាន';
        // if (status_info.driver_name) {
        //     tr.dataset.driverid =  status_info.driver_id;
        //     tr.querySelector('td.driver_name .driver-name').textContent =  status_info.driver_name;
        // }
    }

    this.createDropdownMenuHtml_shipment = function (shipment_id, sender_id, status_id) {
        let html = ['<div class="dropdown-menu bg-white shadow" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '">',
            '<a class="dropdown-item _pl_pa_motify" href="javascript:void(0)"><i class="fa fa-edit" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '"></i>Motify</a>',
            // '<a class="dropdown-item _pl_pa_receive" href="javascript:void(0)"><i class="fa fa-shipping-fast"></i> Arrive</a>',
            '<div class="dropdown-divider"></div>',
            '<a class="dropdown-item _pl_pa_delete" href="javascript:void(0)"><i class="fa fa-trash" style="color:red"></i> Delete Shipment</a>',
            '<a class="dropdown-item _pl_pa_change_status" href="javascript:void(0)"><i class="fa fa-edit" style="color:blue"></i> Change Status</a>',
            // '<a class="dropdown-item _pl_pa_change_driver" href="javascript:void(0)"><i class="fa fa-user"></i> Change Driver (Pickup)</a>',
            '</div>'].join('');
        return html;
    };

    this.createDropdownMenuHtml_special_charge = function (shipment_id, sender_id, status_id,data = []) {
        let html = ['<div class="dropdown-menu bg-white shadow" data-orderid="', shipment_id, '" data-senderid="', sender_id, '" data-statusid="', status_id, '">',
            '<div class="dropdown-item _pl_pa_add_special_charge" href="javascript:void(0)">Add special charge <i class="fa fa-plus-circle ms-2 text-success"></i></div>',
            '<div class="dropdown-divider"></div>'].join('');
        let amount = 0.00;
        let i=0;
        // data = [1,2,3];
        (data ?? []).map(d => {
            html +=[
                    '<div class=" d-flex gap-3 ps-3 pe-3" >',
                        '<div class=" " href="javascript:void(0)" style="width: 215px;"> <span style="width:120px ;display: inline flow-root list-item;"> ',d.category||'NA',' </span> : <span style="width:80px ;display: inline flow-root list-item;"> ',d.charge||'0.00',' USD </span></div>',
                        '<div class="_pl_pa_motify_special_charge "  href="javascript:void(0)" data-sc_id="', d.id, '" data-charge="', d.charge, '" data-category="', d.category, '" data-remarks="', d.remarks, '"> <i class="fa fa-edit text-warning"></i> </div>',
                        '<div class="_pl_pa_delete_special_charge" href="javascript:void(0)" data-sc_id="', d.id, '"> <i class="fa fa-minus-circle text-danger"></i> </div>',
                    '</div>',
                    '<div class="dropdown-divider"></div>',
                    ].join('');
                    amount += parseFloat(d.charge);
                    i++;
        });
        // console.log('amount',amount);
        html +=['<a class="dropdown-item " href="javascript:void(0)"><span style="width:120px"> Amount </span>: ',amount||'0.00',' USD </a></div>'].join('');
        // console.log('html',html);
        return html;
    };

    //begin::translate Column headers
    this.col_titles = {
        'Request Date': 'Request Date',
        'Order ID': 'Order ID',
        'Merchant': 'Merchant',
        'Vehicle': 'Vehicle',
        'Product Type': 'Product Type',
        'Quantity': 'Quantity',
        'Pickup Address': 'Pickup Address',
        'Collector': 'Collector',
        'Driver': 'Collector',
        'Status': 'Status'
    };

    this.trans = (col_title = '') => {
        return mThis.col_titles[col_title];
    }
    this.setTableLanguage = () => {
        for (let prop in mThis.col_titles) {
            mThis.col_titles[prop] = LocaleManager.trans(prop, 'dt_columns');
        }
    }
    //end:: translate column headers

    // this.renderOrders = (orders = []) => {
    //     if (mThis.table) {
    //         mThis.tblPickups.DataTable().clear().destroy();
    //         mThis.tblPickups.empty();
    //         mThis.table = null;
    //     }

    //     orders = StringSanitizer.sanitizeObject(orders, null, ['create_date', 'email','pickup_address','address_link','address_url','map_url','address']);

    //     //let cnt = 1;
       
    //     if (!mThis.table) {
    //         mThis.table = mThis.tblPickups.DataTable({
    //             searching: false,
    //             destroy: true,
    //             paging: true,
    //             retrieve: true,
    //             info: true,
    //             bLengthChange: false,
    //             saveState: true,
    //             'processing': true,
    //             'language': {
    //                 'loadingRecords': '&nbsp;',
    //                 'processing': 'Loading...',
    //                 "emptyTable": "មិនមានទំនិញត្រូវទៅយក!"
    //             },
    //             data: orders,
    //             columns: my_columns
    //             , "createdRow": function (row, data, dataIndex) {
    //                 let tr = $(row);
    //                 tr.addClass('order_header');
    //                 tr.addClass('order_' + data.order_id);
    //                 tr.data('orderid', data.order_id);
    //                 tr.data('completed', data.completed);
    //                 tr.data('statusid', data.status_id);
    //                 tr.data('driverid', data.driver_id);
    //                 tr.data('senderid', data.sender_id);
    //             }
    //         });
    //     }
    // }
 
    this.findRowByOrdderId = (order_id) => {
        if(!mThis.tblOrders) return null;
        const tbody = mThis.tblOrders.querySelector('tbody');
        if(tbody){
            //header row tr contains css class "order" as well 
            return tbody.querySelector(['tr#order_', order_id].join(''));
        }
       return null;
    }

    this.isURL = (url) => {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
        return urlRegex.test(url);
    };

    this.transformPickupAddress = (pickup_address,map_url,sender_phone) => {
        if (mThis.isURL(pickup_address)) {
            return `<a class="lnk_map_link pickup-address" href="${pickup_address}"><span class="d-block">តាមផែនទី</span><span class="d-block fw-semibold">Tel: ${sender_phone || ''}</span></a>`;
        } else {
            if (map_url){
                return `<a class="lnk_map_link pickup-address" href="${map_url}"><span class="d-block">`,pickup_address,`</span><span class="d-block fw-semibold">Tel: ${sender_phone || ''}</span></a>`;
            }
            else return pickup_address;
        }
    };

   this.setImageCount = (order_id,count = null)=>{
    if(!mThis.tblOrders) return;
     const order_element_id = ['order_',order_id].join('');
     const tr = mThis.tblOrders.querySelector(['#',order_element_id].join(''));
     if(!tr) return;
     const td = tr.querySelector('td.product_type');
     if(td){
         const span = td.querySelector('.pkl-img-count');
         if(!count) span.innerHTML = null;
         span.innerHTML =   ['<i class="fa fa-image"></i> ',count,' images'].join('');
     }
   }

    /** insert new tr when new order is created in real time */  
    this.live_addOrderRow = (d) => {
        if(!mThis.tblOrders) return;
        if (!d.order_id) d.order_id = d.id;
        if (!d.order_code) d.order_code = d.code;
        if (!d.vehicle_type) d.vehicle_type = d.request_vehicle_type;
        //let css_display_order = ['order_', d.order_id].join('');
        const order_id = d.id?d.id:d.order_id;
        //const pickup_address = mThis.transformPickupAddress(d.pickup_address,d.map_url,d.sender_phone);
        let pickup_address = mThis.transformPickupAddress(d.pickup_address,d.map_url,d.sender_phone);
        const pickup_address_span = [`<span class="long-text-wrap-250">`,(pickup_address?pickup_address:'No pickup address'),`</span>`].join('');
 
        const booking_channel = (d.booking_channel || '').toLowerCase();
        let channel_bg = '';
        if(booking_channel == 'merchant') channel_bg ='bg-success';
        else if(booking_channel == 'driver') channel_bg ='bg-warning';
        let is_from_mobile = (booking_channel == 'merchant' || booking_channel == 'driver') ? `<div class="d-flex flex-column"><span class="d-block p-2"><i style="color:green" class="fas fa-mobile-alt fs-4"></i></span><span class="d-block border ${channel_bg} shadow rounded-4 text-white p-1  text-center" style="min-width:70.5px">${VSUtil.properCase(booking_channel)}</span></div>` : ``;
        let qty_html =  ['<div class="d-flex justify-content-between"><span class="fw-semibold package_count mt-1">', d.qty, '</span>', is_from_mobile, '</div>'].join('');
        
        let html_tr = [`<tr data-id="`,order_id,`" class="order" id="order_`,order_id,`" data-statusid="`,d.status_id,`" data-senderid="`,d.sender_id,`" data-driverid="`,d.driver_id,`">`,
        `<td class="col_action"><div class="dropdown"><a href="javascript:void(0)" data-orderid="`,order_id,`" data-senderid="`,d.sender_id,`" data-statusid="`,d.status_id,`" class="btn_shipment_action" aria-haspopup="true" aria-expanded="false"><i class="fa fa-chevron-down" style="color:#E9E7E7;font-size:1.5em"></i></a></div></td>`,
        `<td class="request_date Request-Date"><span class="pl-request_date">`,d.request_date,`</span><span class="pl-request_time">`,d.request_time,`</span></td>`,
        `<td class="order_code Order-ID"><div><div class="pl-order-special-status"><span class="rounded-3 pl-order-special-status-text pl-order-status-1"></span></div><span class="rounded-3 order-code">`,d.code,`</span></div></td>`,
        `<td class="sender_name Merchant"><span class="sender-name d-block">`,d.sender_name,`</span><span class="sender-code d-block text-center text-info">`,d.sender_code,`</span></td>`,
        `<td class="col_vehicletype Vehicle"><div class="d-flex gap-2"><i class="fa fa-motobike"></i><span>`,d.vehicle_type,`</span></div></td>`,
        `<td class="product_type Product-Type"><span class="product-type">`,d.product_type,`</span></td>`,
        `<td class="qty Quantity">`,qty_html,`</td>`,
        `<td class="pickup_address Pickup-Address">`,pickup_address_span,`</td>`,
        `<td class="driver_name Collector"><div class="d-flex gap-1"><span class="driver-name text-nowrap">`,d.driver_name || `មិនទាន់មាន`,`</span><a href="javascript:void(0)" class="lnk-assign-driver"><span class="shadow-lg bg-white p-1"><i class="fa fa-pencil"></i></span></a></div></td>`,
        `<td class=" Created-By"><span class="d-block fw-semibold">`,d.create_user,`</span><span class="d-block p-1">`,d.create_date,`</span></td>`,
        `<td class="order_status status Status"><a class="change-order-status order-status" data-statusid="`,d.status_id,`" data-id="`,order_id,`" data-senderid="`,d.sender_id,`" href="javascript:void(0)"><span class="order_status text-danger">`,d.status,`</span></a></td>`,
       `</tr>`].join('');
        mThis.tblOrders.querySelector('tbody').insertAdjacentHTML('afterbegin',html_tr);
    };

    this.getSpecialStatusClass = (status_id) => {
        let cls_completed = 'pl-order-pending';
        if (status_id == 5)
            cls_completed = 'pl-order-status-5';
        else {
            if (status_id == 2 || status_id == 1 || status_id == 0) cls_completed = 'pl-order-status-' + status_id;
        }
        return cls_completed;
    }
}

const ShipmentStatusDialog = new function () {
    let mThis = this;
    this.self = main_view.appContent.children('#_pl_dlgPickupStatus');
    this.base_url = main_view.base_url;
    this.btnOK = this.self.find('#_pl_ps_btnOK');

    this.elSenderName = this.self.find('#_pl_ps_sender_name');
    this.elShipmentCode = this.self.find('#_pl_ps_shipment_code');
    this.elShipment = this.self.find('#_pl_ps_shipment_id');

    this.div_select_fields = this.self[0].querySelector('#div_select_fields');
    this.elQrCode = this.self.find('#_pl_ps_qr_code');
    this.elStatus = this.self.find('#_pl_ps_status');
    this.elNotes = this.self.find('#_pl_ps_notes');
    this.elError = this.self.find('#_pl_ps_error');

    this.div_select_fields.querySelectorAll('.status-field').forEach(el =>{
        el.onchange = e => {
            e.preventDefault();
            let status_id = mThis.elStatus.val();
            // mThis.body.querySelectorAll('.data-input').forEach(el => {
        //     el.value = null;
        // });
            if (status_id == 1) {
                mThis.div_select_fields.querySelector('.qr_code').classList.remove('d-block');    
                mThis.div_select_fields.querySelector('.qr_code').classList.add('d-none');     
            }
            else{
                // mThis.div_select_fields.querySelector('#_pl_ps_qr_code').value = null;   
                mThis.div_select_fields.querySelector('.qr_code').classList.remove('d-none');    
                mThis.div_select_fields.querySelector('.qr_code').classList.add('d-block');    
            }
        };
    });

    this.btnOK.on('click', function (e) {
        e.preventDefault();
        let status_id = mThis.elStatus.val();
        let qr_code = mThis.elQrCode.val();

        if (status_id == 1) {
            qr_code = null;
        }

        let p = { 'shipment_id': mThis.shipment_id, 'qr_code': qr_code, 'status_id': status_id };
        console.log('p',p);
        vsapi.call([mThis.base_url, '/abm/oversea_shipments/update-status'].join(''), p, mThis.btnOK).then(res => {
            if (res.status_code === 200) {
                let result = StringSanitizer.sanitizeObject(res.data);
                if (typeof mThis.onClose === 'function') mThis.onClose();
                mThis.self.modal('hide');
            }
            else cv_interact.warning(res.error_message);
        });
    });

    this.show = (shipment, onClose) => {
        shipment = shipment || {};
        console.log('shipment',shipment);
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.shipment_id = shipment.shipment_id;
        mThis.shipment = shipment;
        mThis.form_data = ShipmentsComponent.form_data;
        console.log('form_data',mThis.form_data);
        mThis.elShipment.val(shipment.id || shipment.shipment_id);
        mThis.elSenderName.val(shipment.sender_name);
        mThis.elShipmentCode.val(shipment.shipment_code);
        mThis.prepreData(shipment, (d) => {
            mThis.elQrCode.val(d);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }

    this.prepreData = (def, onFinish) => {
        if (!def) def = {};
        if (!mThis.form_data) {
            FilterDialog_pickup.loadFilterData((d) => {
                mThis.form_data = d;
                if (!mThis.form_data) mThis.form_data = {};
                VSUtil.setComboItems(mThis.elStatus, mThis.form_data.shipment_status, 'status_id', 'status_name', false, '(Select status)', def.status_id);
                // VSUtil.setComboItems(mThis.elDriver, mThis.form_data.drivers, 'id', 'driver_name', true, '(Select a driver)', def.driver_id);

                if (typeof onFinish == 'function') onFinish();
            });
        }
        else {
            vsapi.call(`${mThis.base_url}/abm/oversea_shipments/form-options`,{
                id: def.shipment_id
            },null).then(res => {
                let d = res.status_code === 200 ?  StringSanitizer.sanitizeObject(res.data) : {};
                VSUtil.setComboItems(mThis.elStatus, d.shipment_status, 'status_id', 'status_name', false, '(Select status)', def.status_id);
                onFinish(d.shipment.qr_code);
            });

            // VSUtil.setComboItems(mThis.elDriver, mThis.form_data.drivers, 'id', 'driver_name', true, '(Select a driver)', def.driver_id);
            // if (typeof onFinish == 'function') onFinish();
        }
    }
}

let PickupRequestDialog = new function () {
    let mThis = this;
    this.self = main_view.appContent.children('#_pl_dlgPickupRequest');
    this.model_body = this.self.find('#_pl_dlgPickupRequest');
    this.base_url = main_view.base_url;
    this.elTitle = this.self.find('#_pl_dlgPickupRequestTitle');

    this.btnAddPackage = this.self.find('#_pl_pr_add_package');
    this.btnSaveRequest = this.self.find('#_pl_pr_btnSaveRequest');

    this.elShipment = this.self.find('#_pl_pr_order_id');
    this.elShipmentCode = this.self.find('#_pl_pr_order_code');

    this.elSender = this.self.find('#_pl_pr_sender');

    this.elSenderId = this.self.find('#_pl_pr_sender_id');
    this.elSenderName = this.self.find('#_pl_pr_sender_name');
    this.elSenderCode = this.self.find('#_pl_pr_sender_code');
    this.elSenderId = this.self.find('#_pl_pr_sender_id');

    this.elRequestDate = this.self.find('#_pl_pr_request_date');
    this.elPickupDate = this.self.find('#_pl_pr_pickup_date');

    this.elVechicleType = this.self.find('#_pl_pr_vehicle_type');
    this.elCondition = this.self.find('#_pl_pr_delivery_condition');
    this.elDeliveryType = this.self.find('#_pl_pr_delivery_type');
    this.elProductType = this.self.find('#_pl_pr_product_type');
    this.elPickupAddress = this.self.find('#_pl_pr_pickup_address');
    this.elQty = this.self.find('#_pl_pr_qty');
    this.lnkFindSender = this.self.find('#_pl_pr_lnkFindSender');
    this.tblPackages = this.self.find('#_pl_pr_tblPackages');

    this.package_columns = [
        {
            className: "col_action",
            data: function (data,index,tr) {
                return ['<div class="d-flex align-items-center gap-3">',
                    '<a href="javascript:void(0)" class="_pl_pr_print_barcode disabled" data-barcode="', data.barcode, '" data-pid="', data.package_id, '" data-senderid="', data.sender_id, '"><i class="fa fa-list-alt fs-5 text-success"></i></a>',
                    '<a href="javascript:void(0)" class="_pl_remove_package" data-barcode="', data.barcode, '" data-pid="', data.package_id, '"><i class="fa fa-times fs-5 text-warning"></i></a>',
                    '</div>'].join('');
            },
            title: ''
        },
        {
            className: "zone_name",
            data: function (data,index,tr) {
                let d = { "inputType": "select2", "data": data, "columnName": "zone_name", "cssClass": "modal-select2", "combo_items": mThis.form_options.zones, "valueMember": "zone_code", "textMember": "zone_name" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Zone', 'titles')
        },
        {
            className: "receiver_phone",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "receiver_phone", "cssClass": "phone", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Receiver Phone', 'titles')
        },
        {
            className: "price",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "price", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Price', 'titles')
        },
        {
            className: "cod",
            data: function (data,index,tr) {
                let items = [{ "id": "0", "name": "No" }, { "id": "1", "name": "Yes" }];
                let d = { "inputType": "select2", "data": data, "columnName": "cod", "readOnly": false, "combo_items": items, "valueMember": "id", "textMamber": "name", "defaultValue": 1 };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('COD', 'titles')
        },
        {
            className: "df_payer",
            data: function (data,index,tr) {
                let items = [{ "name": "Sender" }, { "name": "Receiver" }];
                let d = { "inputType": "select2", "data": data, "columnName": "df_payer", "readOnly": false, "combo_items": items, "valueMember": "name", "textMamber": "name", "defaultValue": "Sender" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Fee Payer', 'titles')
        },
        {
            className: "fees",
            data: function (data,index,tr) {
                if (!data.fees) data.fees = parseFloat(data.base_fee) + parseFloat(data.delivery_fee);
                data.fees = Number(data.fees).toFixed(2);
                let d = { "inputType": "number", "data": data, "columnName": "fees", "readOnly": true, "defaultValue": 0 };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Fees', 'titles')
        },
        {
            className: 'receiver_address',
            data: function (data,index,tr) {
                let d = { "inputType": "input", "data": data, "columnName": "receiver_address", "cssClass": "address", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Receiver Address', 'titles')
        },
        {
            className: "base_fee",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "base_fee", "readOnly": true };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Base Fee', 'titles')
        },
        {
            className: "delivery_fee",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "delivery_fee", "readOnly": true };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Additional', 'titles')
        },
        {
            className: "size",
            data: function (data,index,tr) {
                if (data.size instanceof Object && data.size) {
                    data.size = [data.size.length, ' ', data.size.width, ' ', data.size.height].join('');
                }
                let d = { "inputType": "input", "data": data, "columnName": "size", "readOnly": false, "placeholder": "eg: 10 9.5 11" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Size', 'titles')
        },
        {
            className: "actual_kg",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "actual_kg", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Actual KG', 'titles')
        },
        {
            className: "billed_kg",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "billed_kg", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Billed KG', 'titles')
        },
        {
            className: 'total',
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "total", "readOnly": true };
                return EditableTable.makeTableCellEditor(d);
            },
            title: LocaleManager.trans('Total', 'titles')
        }
    ];

    this.elSender.on('change', (e) => {
        let m = { 'sender_id': mThis.elSender.val() };
        vsapi.call([mThis.base_url, '/api/getVendorAddress'].join(''), m).then(res => {
            let address = "";
            if (res.status_code === 200) address = StringSanitizer.sanitizeOut(address);
            mThis.elPickupAddress.val(address);
        });
    });

    mThis.btnSaveRequest.off('click').on('click', function (e) {
        $(this).prop('disabled', true);

        let p = mThis.getData();
        if (!p) {
            cv_interact.error("It seems data input is not correct!");
            mThis.btnSaveRequest.prop('disabled', false);
            return;
        }

        if (!p.request_date) p.request_date = '';
        if (!p.pickup_date) p.pickup_date = '';

        if (!p) {
            mThis.btnSaveRequest.prop('disabled', false);
            return;
        }

        vsapi.call([mThis.base_url, '/api/savePickupRequest'].join(''), p).then(res => {
            if (res.status_code === 200) {
                mThis.self.modal('hide');
                mThis.btnSaveRequest.prop('disabled', false);

                if (typeof mThis.onClose === 'function') mThis.onClose(true);
            }
            else {
                mThis.btnSaveRequest.prop('disabled', false);
                cv_interact.error(res.error_message);
            }
        });
    });

    mThis.tblPackages.on('blur', 'td.size>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
    });

    mThis.tblPackages.on('blur', 'td.actual_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
    });

    this.setBilledKg = (tr, size_string) => {
        if (!size_string) size_string = EditableTable.getCellValue(tr, 'size', false);
        if (!size_string) return;
        if (!size.length) return;

        let size = DUtil.processPackageSize(size_string);
        let kg = 0;
        let b = size.length * size.width * size.height;
        b = Number(b / 6015);
        let actual_kg = EditableTable.getCellValue(tr, 'actual_kg',true);
        if (b > actual_kg)
            kg = b;
        else
            kg = actual_kg;
        EditableTable.setCellValue(tr, 'billed_kg', kg);
    }

    mThis.btnAddPackage.off('click').on('click', function (e) {
        e.preventDefault();
        mThis.addPackageRow();
    });

    mThis.tblPackages.on('click', 'td.col_action a._pl_remove_package', function (e) {
        let tr = $(this).closest('tr');
        mThis.packages = mThis.removePackageRow(tr);
        tr.remove();
    });

    mThis.tblPackages.on('change', 'td.delivery_type>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'delivery_type');
    });

    mThis.tblPackages.on('change', 'td.zone_name>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'zone_name');
    });

    mThis.tblPackages.on('change', 'td.billed_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'billed_kg');
    });

    mThis.tblPackages.on('keyup', 'td.actual_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr, 'actual_kg');
    });

    mThis.tblPackages.on('blur', 'td.size>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr, 'size');
    });

    //Change Price td.price on "Create Order" form
    mThis.tblPackages.on('change', 'td.price>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'price');
    });

    mThis.tblPackages.on('keyup', 'td.price>.col-input', function (e) {
        setTimeout(() => {
            let tr = $(this).closest('tr');
            mThis.setDeliveryPrices(tr, 'price');
        }, 300);

    });

    mThis.tblPackages.on('change', 'td.cod>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'cod');
    });

    mThis.tblPackages.on('change', 'td.df_payer>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'cod');
    });

    this.setDeliveryPrices = (tr, change_agent, error_span = null) => {
        let sender_id = mThis.elSender.val();
        let zone_code, billed_kg = 0, price = 0, cod;
        let delivery_type = EditableTable.getCellValue(tr, 'delivery_type',false);
        zone_code = EditableTable.getCellValue(tr, 'zone_name',false);
        billed_kg = EditableTable.getCellValue(tr, 'billed_kg', true);

        price = EditableTable.getCellValue(tr, 'price',true);
        if (price > 0) {
            cod = 1;
        } else cod = 0; //EditableTable.getCellValue(tr, 'cod');

        EditableTable.setCellValue(tr, 'cod', cod);

        if (!delivery_type) delivery_type = mThis.elDeliveryType.val();
        let p = { 'sender_id': sender_id, 'delivery_type': delivery_type, 'zone_code': zone_code, 'billed_kg': billed_kg, 'cod': cod };

        vsapi.call([mThis.base_url, '/api/package/price-info'].join(''), p, null, false).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                let base_fee = 0;
                let delivery_fee = 0;
                let cod_fee = 0;
                EditableTable.setCellValue(tr, 'base_fee', d.base_fee);
                EditableTable.setCellValue(tr, 'delivery_fee', Number(d.delivery_fee).toFixed(2));
                price = EditableTable.getCellValue(tr, 'price', true);

                base_fee = EditableTable.getCellValue(tr, 'base_fee', true);
                delivery_fee = EditableTable.getCellValue(tr, 'delivery_fee', true);
                let df_payer = (EditableTable.getCellValue(tr, 'df_payer', false) + '').toLowerCase();

                if (cod == 0) {
                    cod_fee = 0;
                    price = 0;
                }
                else
                    cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent / 100;

                EditableTable.setCellValue(tr, 'cod_fee', Number(cod_fee).toFixed(2));
                let fees = base_fee + delivery_fee;
                EditableTable.setCellValue(tr, 'fees', Number(fees).toFixed(2));
                if (df_payer === 'sender') fees = 0;
                let total = fees + price;
                EditableTable.setCellValue(tr, 'total', total);
                if (d.status === 'Error') {
                    EditableTable.handlePriceError(tr, d, error_span);
                }
            }
        });
    }

    this.validatePackage = (p) => {
        if (Validator.isNullOrEmpty(p.receiver_phone)) {
            return 'Some packages does not have receiver`s phone number';
        }

        if (Validator.isNullOrEmpty(p.zone_code)) {
            return 'Some packages does not have destination zone name';
        }

        if (p.cod == 1) {
            if (p.price <= 0 || !p.price) {
                return 'In case of Cash On Delivery (COD), the package`s price cannot be zero';
            }
        }

        if (p.base_fee > 0 || p.delivery_fee > 0) {
            let dfp = (p.df_payer + '').toLowerCase();
            if (dfp != 'sender' && dfp != 'receiver') {
                return 'Delivery Fee Payer (DFP) must be Sender or Receiver';
            }
        }
        return null;
    }

    this.setBilledKg = (tr, size_string = null) => {
        if (!size_string) size_string = EditableTable.getCellValue(tr, 'size',false);
        if (!size_string) return;
        let size = DUtil.processPackageSize(size_string);
        if (!size) {
            return;
        }
        if (!size.length) return;
        let kg = 0;
        let b = size.length * size.width * size.height;
        b = Number(b / 6015);
        let actual_kg = EditableTable.getCellValue(tr, 'actual_kg',true);
        if (b > actual_kg) kg = b; else kg = actual_kg;
        EditableTable.setCellValue(tr, 'billed_kg', Number(kg).toFixed(2));
    }

    this.show = (option, onClose) => {
        if (!option) option = {};
        mThis.onClose = onClose;
        mThis.sender_id = option.sender_id;
        mThis.btnSaveRequest.prop('disabled', false);

        let title_text = LocaleManager.trans('New Pickup Request');
        mThis.elTitle.html(option.title ? option.title : title_text);
        mThis.prepareFormData(null, () => {
            mThis.elRequestDate.val(DateHelper.getTodayDate());
            mThis.elDeliveryType.val('normal');
            mThis.elVechicleType.val('moto bike');
            mThis.displayPackages(null);
            mThis.self.modal({
                backdrop: 'static'
            });
        });

    }

    this.prepareFormData = (def, onFinish) => {
        if (!def) def = {};
        if (!def.delivery_condition) def.delivery_condition = 'None';
        if (mThis.form_options) {
            VSUtil.setComboItems(mThis.elSender, mThis.form_options.senders, 'id', 'name', true, '(Select a merchant)', def.sender_id);
            VSUtil.setComboItems(mThis.elVechicleType, mThis.form_options.vehicle_types, 'code', 'vehicle_type', true, '(Select Vehicle Type)', def.request_vehicle_type);
            VSUtil.setComboItems(mThis.elCondition, mThis.form_options.conditions, 'name', 'name', true, '(Select Condition)', def.delivery_condition);
            VSUtil.setComboItems(mThis.elProductType, mThis.form_options.product_types, 'product_type', 'product_type', true, '(Select Product Type)', def.product_type);
            onFinish();
            return;
        }
        vsapi.call([mThis.base_url, '/api/getFormData_pickup_request'].join(''), null, null).then(res => {
            if (res.status_code === 200) {
                let data = res.data;
                data.vehicle_types = StringSanitizer.sanitizeObject(data.vehicle_types);
                data.conditions = StringSanitizer.sanitizeObject(data.conditions);
                data.zones = StringSanitizer.sanitizeObject(data.zones);
                data.senders = StringSanitizer.sanitizeObject(data.senders);
                VSUtil.setComboItems(mThis.elSender, data.senders, 'id', 'name', true, '(Select a merchant)', def.sender_id);
                VSUtil.setComboItems(mThis.elVechicleType, data.vehicle_types, 'code', 'vehicle_type', true, '(Select Vehicle Type)', def.request_vehicle_type);
                VSUtil.setComboItems(mThis.elCondition, data.conditions, 'name', 'name', true, '(Select Condition)', def.delivery_condition);
                VSUtil.setComboItems(mThis.elProductType, data.product_types, 'product_type', 'product_type', true, '(Select Product Type)', def.product_type);
                mThis.form_options = data;
                onFinish();
            }
        });
    }

    this.addPackageRow = () => {
        let def_base_fee = 0;
        if (mThis.senderInfo) def_base_fee = mThis.senderInfo.base_fee;
        let row_data_blank = { 'barcode': null, 'zone_name': null, 'receiver_phone': null, 'price': 0, 'df_payer': 'sender', 'fees': 0, 'receiver_address': null, 'cod': 1, 'base_fee': 0, 'delivery_fee': 0, 'size': null, 'actual_kg': 0, 'billed_kg': 0, 'total': 0 };
        let rows = mThis.getPackages();
        rows.splice(0, 0, row_data_blank);
        mThis.displayPackages(rows);
    }

    this.removePackageRow = (tr) => {
        let rows = mThis.getPackages();
        let index = tr.data('index');
        rows.splice(index, 1);
        mThis.elQty.val(rows.length);
        return rows;
    }

    this.getData = function () {
        let p = {};
        p.order_id = mThis.order_id;
        p.order_code = mThis.elShipmentCode.val();
        p.sender_id = mThis.elSender.val();
        p.pickup_date = mThis.elPickupDate.val();
        p.request_date = mThis.elRequestDate.val();
        p.delivery_type = mThis.elDeliveryType.val();
        p.delivery_condition = mThis.elCondition.val();
        p.qty = mThis.elQty.val();
        p.product_type = mThis.elProductType.val();
        p.pickup_address = mThis.elPickupAddress.val();
        p.request_vehicle_type = mThis.elVechicleType.val();

        p.packages = mThis.getPackages(p.delivery_type);

        let i = 0, c;
        do {
            c = p.packages[i];
            if (!c) break;
            let error = mThis.validatePackage(c);
            if (error) {
                cv_interact.error(error);
                return null;
            }
            i++;
        } while (c);
        return p;
    }

    this.getPackages = (delivery_type) => {
        let data = [];
        mThis.tblPackages.find('>tbody>tr').each(function () {
            let row = {};
            let tr = $(this);
            let btn_barcode = tr.find('td.col_action button._pl_print_barcode');
            row.barcode = btn_barcode.data('barcode');
            tr.find('td>.col-input').each(function () {
                let x = $(this);
                let col_name = x.data('field');

                if (col_name == 'size') {
                    row.size = DUtil.processPackageSize(x.val());
                }
                else {
                    row[col_name] = x.val();
                }
            });
            row.delivery_type = delivery_type;
            if (!row.zone_code) row.zone_code = row.zone_name;
            data.push(row);
        });
        return data;
    }

  
}

let PerformPickupDialog = new function () {
    let mThis = this;
    this.self = main_view.appContent.children('#_pl_dlgPerformPickup');
    this.base_url = main_view.base_url;
    this.elTitle = this.self.find('#_pl_dlgPerformPickupTitle');
    this.lnkFindDriver = this.self.find('#_pl_pp_lnkFindDriver');
    this.btnAddPackage = this.self.find('#_pl_pp_add_package');
    this.btnPickup = this.self.find('#_pl_pp_btnPickup');
    this.btnPickupOnArrival = this.self.find('#_pl_pp_btnPickOnArrival');

    this.elDriver = this.self.find('#_pl_dd_driver');
    this.elDriverCode = this.self.find('#_pl_dd_driver_code');

    this.elShipment = this.self.find('#_pl_dd_order_id');
    this.elShipmentCode = this.self.find('#_pl_dd_order_code');
    this.elSenderId = this.self.find('#_pl_dd_sender_id');
    this.elSenderName = this.self.find('#_pl_dd_sender_name');
    this.elSenderCode = this.self.find('#_pl_dd_sender_code');
    this.elPickupDate = this.self.find('#_pl_dd_pickup_date');
    this.elDeliveryType = this.self.find('#_pl_dd_delivery_type');
    this.elToWarehouse = this.self.find('#_pl_dd_to_warehouse');

    this.elPickupContext = this.self.find('#_pl_dd_pickup_context');
    this.elPickupType = this.self.find('#_pl_dd_pickup_type');
    this.tblPackages = this.self.find('#_pl_dd_tblPackages');

    this.package_columns = [
        {
            className: "col_action",
            data: function (data,index,tr) {
                return ['<div class="form-inline">',
                    '<button type="button" class="_pl_print_barcode btn btn-sm btn-outline-primary disabled" data-barcode="', data.barcode, '" data-pid="', data.package_id, '" data-senderid="', data.sender_id, '"><i class="fa fa-list-alt" style="color:green"></i></button>&nbsp;',
                    '<button type="button" class="_pl_remove_package btn btn-sm btn-outline-danger" data-barcode="', data.barcode, '" data-pid="', data.package_id, '"><i class="fa fa-times" style="color:orange"></i></button>',
                    '</div>'].join('');
            },
            title: ''
        },
        {
            className: "item_type",
            data: function (data,index,tr) {
                let items = [{ 'item_type': 'doc' }, { 'delivery_type': 'non-doc' }];
                data.item_type = (data.item_type + '').toLowerCase();
                let d = { "inputType": "select2", "data": data, "cssClass": "", "columnName": "item_type", "combo_items": items, "valueMember": "item_type", "textMember": "item_type" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Item Type'
        },
        {
            className: "zone_name",
            data: function (data,index,tr) {
                let d = { "inputType": "select2", "data": data, "cssClass": "modal-select2", "columnName": "zone_name", "combo_items": ShipmentsComponent.form_data.zones, "valueMember": "zone_code", "textMember": "zone_name" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Destination'
        },
        {
            className: "receiver_phone",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "receiver_phone", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Receiver Phone'
        },
        {
            className: "price",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "price", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Price'
        },
        {
            className: "df_payer",
            data: function (data,index,tr) {
                let items = [{ "name": "Sender" }, { "name": "Receiver" }];
                let d = { "inputType": "select2", "data": data, "columnName": "df_payer", "readOnly": false, "combo_items": items, "valueMember": "name", "textMamber": "name", "defaultValue": "Sender" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'DFP'
        },
        {
            className: "fees",
            data: function (data,index,tr) {
                if (!data.fees) data.fees = parseFloat(data.base_fees) + parseFloat(data.delivery_fee);
                data.fees = Number(data.fees).toFixed(2);
                let d = { "inputType": "number", "data": data, "columnName": "fees", "readOnly": true, "defaultValue": 0 };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Fees'
        },
        {
            className: "receiver_address",
            data: function (data,index,tr) {
                let d = { "inputType": "input", "data": data, "columnName": "receiver_address", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Receiver Address'
        },
        {
            className: "cod",
            data: function (data,index,tr) {
                let items = [{ "id": "0", "name": "No" }, { "id": "1", "name": "Yes" }];
                let d = { "inputType": "select2", "data": data, "columnName": "cod", "readOnly": false, "combo_items": items, "valueMember": "id", "textMamber": "name", "defaultValue": 1 };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'COD'
        },
        {
            className: "base_fee",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "base_fee", "defaultValue": 0, "readOnly": true };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Base Fee'
        },
        {
            className: "delivery_fee",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "delivery_fee", "defaultValue": 0, "readOnly": true };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Additional'
        },
        {
            className: "size",
            data: function (data,index,tr) {
                if (data.size instanceof Object && data.size) {
                    data.size = [data.size.length, ' ', data.size.width, ' ', data.size.height].join('');
                }
                let d = { "inputType": "input", "data": data, "columnName": "size", "readOnly": false, "defaultValue": null, "placeholder": "eg: 10 9.5 11" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Size'
        },
        {
            className: "actual_kg",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "actual_kg", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Actual KG'
        },
        {
            className: "billed_kg",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "billed_kg", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Billed KG'
        }
    ];

    mThis.btnPickup.on('click', function (e) {
        let pick_on_arrival = 0;
        mThis.performPickup(pick_on_arrival, mThis.tr_row);
    });

    mThis.btnPickupOnArrival.on('click', function (e) {
        let pick_on_arrival = 1;
        mThis.performPickup(pick_on_arrival, mThis.tr_row);
    });

    mThis.btnPickup.on('mouseover', (e) => {
        mThis.elPickupType.html('You are about to book pickup on behalf of a driver and goods not yet Arrive At Warehouse');
        mThis.elPickupType.css('color', 'orange');
    }).on('mouseleave', () => {
        mThis.elPickupType.html(null);
    });

    mThis.btnPickupOnArrival.on('mouseover', (e) => {
        mThis.elPickupType.html('You are about to book packages on Arrival At Warehouse');
        mThis.elPickupType.css('color', 'green');
    }).on('mouseleave', () => {
        mThis.elPickupType.html(null);
    });

    mThis.elDriver.on('change', function (e) {
        let driver_id = $(this).val();
        mThis.btnPickup.prop('disabled', (driver_id <= 0 || !driver_id) ? true : false);

        if (driver_id <= 0 || !driver_id) {
            mThis.elPickupContext.html('The following packages are NOT picked up by an agent or driver');
            mThis.elPickupContext.css('color', 'orange');
        }
        else {
            let driver_name = mThis.elDriver.find('option:selected').text();
            mThis.elPickupContext.html(['The following packages are picked up by an agent named ', driver_name].join(''));
            mThis.elPickupContext.css('color', 'green');
        }
    });

    mThis.lnkFindDriver.on('click', function (e) {
        e.preventDefault();
        let onClose = (ds) => {
            if (ds[0]) {
                let d = ds[0];
                mThis.elDriver.val(d.id);
                if (!mThis.elDriver.val()) {
                    mThis.elDriver.append($('<option/>').val(d.id).text(d.name)).val(d.id);
                }
                mThis.elDriverCode.val(d.code);
                mThis.elDriver.trigger('change');
            }
        };

        let option = { 'title': 'Find Driver', 'role': 'driver', 'singleSelect': true, 'previousDialog': mThis.self };
        FindPersonDialog.show(option, onClose);
    });

    mThis.btnAddPackage.on('click', function (e) {
        e.preventDefault();
        mThis.addPackageRow();
    });

    mThis.tblPackages.on('click', 'td.col_action button._pl_remove_package', function (e) {
        let tr = $(this).closest('tr');
        mThis.packages = mThis.removePackageRow(tr);
        tr.remove();
    });

    mThis.tblPackages.on('click', 'td.col_action a._pl_print_barcode', function (e) {
        let barcode = $(this).data('barcode');
        if (!barcode)
            cv_interact.warning('Bar code is not yet created');
        else
            window.open([mThis.base_url, '/package_barcode/', barcode].join(''), '_blank');
    });

    mThis.tblPackages.on('change', 'td.delivery_type>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'delivery_type', mThis.elError);
    });

    mThis.tblPackages.on('change', 'td.zone_name>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'zone_name', mThis.elError);
    });

    mThis.tblPackages.on('change', 'td.billed_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'billed_kg', mThis.elError);
    });

    mThis.tblPackages.on('keyup', 'td.actual_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr, 'actual_kg', mThis.elError);
    });

    mThis.tblPackages.on('blur', 'td.size>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr, 'size', mThis.elError);
    });

    mThis.tblPackages.on('change', 'td.price>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'price', mThis.elError);
    });

    mThis.tblPackages.on('change', 'td.cod>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'cod', mThis.elError);
    });

    this.setDeliveryPrices = (tr, change_agent) => {
        let sender_id = mThis.elSender.val();
        let zone_code, billed_kg = 0, price = 0, cod;
        zone_code = EditableTable.getCellValue(tr, 'zone_name',false);
        let delivery_type = EditableTable.getCellValue(tr, 'delivery_type',false);
        billed_kg = EditableTable.getCellValue(tr, 'billed_kg', true);
        cod = EditableTable.getCellValue(tr, 'cod',true);

        if (!sender_id) {
            mThis.elError.html('សូមជ្រើសរើសអ្នកលក់ដើម្បីកំណត់តំលៃសេវា');
            return;
        }

        if (!zone_code) {
            mThis.elError.html('សូមជ្រើសរើសតំបន់ដើម្បីកំណត់តំលៃសេវា');
            return;
        }
        if (!delivery_type) {
            mThis.elError.html('សូមជ្រើសរើសប្រភេទសេវាដើម្បីកំណត់តំលៃសេវា');
            return;
        }
        let p = { 'sender_id': sender_id, 'delivery_type': delivery_type, 'zone_code': zone_code, 'billed_kg': billed_kg, 'cod': cod };
        vsapi.call([mThis.base_url, '/api/package/price-info'].join(''), p).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                EditableTable.setCellValue(tr, 'base_fee', d.base_fee);
                EditableTable.setCellValue(tr, 'delivery_fee', Number(d.delivery_fee).toFixed(2));
                price = EditableTable.getCellValue(tr, 'price', true);

                if (cod == 0)
                    EditableTable.setCellValue(tr, 'cod_fee', 0);
                else {
                    let base_fee = EditableTable.getCellValue(tr, 'base_fee', true);
                    let delivery_fee = EditableTable.getCellValue(tr, 'delivery_fee', true);
                    let cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent / 100;
                    EditableTable.setCellValue(tr, 'cod_fee', Number(cod_fee).toFixed(2));
                    let fees = base_fee + delivery_fee;
                    EditableTable.setCellValue(tr, 'fees', Number(fees).toFixed(2));
                }

                if (d.status == 'Error') {
                    EditableTable.handlePriceError(tr, d, mThis.elError);
                }
            } else cv_interact.warning(res.error_message);
        });
    }

    this.validatePackage = (p) => {
        let error = {};
        if (Validator.isNullOrEmpty(p.receiver_phone)) {
            error.message = 'Some packages does not have receiver`s phone number';
            return error;
        }
        if (Validator.isNullOrEmpty(p.zone_code)) {
            error.message = 'Some packages does not have a correct destination Zone';
            return error;
        }

        if (p.cod == 1) {
            if (p.price <= 0 || !p.price) {
                error.message = 'In case of Cash On Delivery (COD), the package`s price cannot be zero';
                return error;
            }
        }
        if (p.delivery_fee > 0) {
            let dfp = (p.df_payer + '').toLowerCase();
            if (dfp != 'sender' && dfp != 'receiver') {
                error.message = 'Delivery Fee Payer (DFP) must be Sender or Receiver';
                return error;
            }
        }
        return null;
    }

    this.setBilledKg = (tr, size_string) => {
        if (!size_string) size_string = EditableTable.getCellValue(tr, 'size',false);
        if (!size_string) return;
        let size = DUtil.processPackageSize(size_string);
        if (!size.length) return;
        let kg = 0;
        let b = size.length * size.width * size.height;
        b = Number(b / 6015);
        let actual_kg = EditableTable.getCellValue(tr, 'actual_kg',true);
        if (b > actual_kg)
            kg = b;
        else
            kg = actual_kg;
        EditableTable.setCellValue(tr, 'billed_kg', kg);
    }

    this.show = (option, onClose) => {
        if (!option) option = {};
        mThis.onClose = onClose;
        mThis.order_id = option.order_id;
        mThis.sender_id = option.sender_id;
        mThis.tr_row = option.tr_row;
        mThis.elTitle.html(option.title ? option.title : ' Perform Pickup');

        mThis.prepareFormData({ 'driver_id': 0 });
        mThis.elPickupContext.html(null);
        if (mThis.order_id > 0) {
            mThis.loadOrderInfo(mThis.order_id, function (e) {
                mThis.self.modal({
                    backdrop: 'static'
                });
            });
        }
    }

    this.prepareFormData = (def, onFinish) => {
        if (!def) def = {};
        def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
        VSUtil.setComboItems(mThis.elToWarehouse, ShipmentsComponent.form_data.warehouses, 'id', 'warehouse_name', false, null, def.warehouse_id);
        vsapi.call([mThis.base_url, '/api/getComboItems_driver'].join(''), null).then(res => {
            if (res.status_code === 200) {
                let rows = StringSanitizer.sanitizeObject(res.data);
                let text1 = LocaleManager.trans('Not picked by driver');
                VSUtil.setComboItems(mThis.elDriver, rows, 'id', 'driver_name', true, `(${text1})`, def.driver_id);
                if (typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.loadOrderInfo = (order_id, onFinish) => {
        let p = { 'order_id': order_id ? order_id : 0, "context": "0" };
        vsapi.call([mThis.base_url, '/api/order/info'].join(''), p).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                let packages = d.packages ? d.packages : [];
                packages = StringSanitizer.sanitizeObject(packages);

                mThis.order_id = d.order_id;
                mThis.elShipmentCode.val(d.order_code);
                mThis.elSenderName.val(d.sender_name);
                mThis.elSenderId.val(d.sender_id);
                mThis.elSenderCode.val(d.sender_code);
                mThis.displayPackages(packages, null);
                if (typeof onFinish == 'function') onFinish();
            }
        });
    }

    this.performPickup = (pick_on_arrival = false, tr = null) => {
        let p = mThis.getData();
        if (!p) return;
        if (!p.pickup_date) p.pickup_date = '';
        if (!p.driver_id) p.driver_id = 0;
        p.pick_on_arrival = (pick_on_arrival == true) ? 1 : 0;

        vsapi.call([mThis.base_url, '/api/performPickup'].join(''), p).then(res => {
            if (res.status_code === 200) {

                let d = StringSanitizer.sanitizeObject(res.data);

                mThis.self.modal('hide');
                if (typeof mThis.onClose == 'function') mThis.onClose(true);
                if (d.error_count > 0) {
                    let i = 0, c;
                    let html = null;
                    do {
                        c = d.errors[i];
                        if (!c) break;
                        html = [html, '<li><span style="color:red;">', c, '</span></li>'].join('');
                        i++;
                    } while (c);
                    if (d.success_count > 0) {
                        if (html) html = ['<span style="color:red;font-weight:bold">There are ', (i + 1), ' problems as follows:</span><br><ul>', html, '</ul>'].join('');
                        cv_interact.warning(html);
                    }
                    else {
                        if (html) html = ['<span style="color:red;font-weight:bold">No packages are picked up. See the following problems:</span><br><ul>', html, '</ul>'].join('');
                        cv_interact.warning(html);
                    }
                } else if (d.success_count > 0) {
                    if (pick_on_arrival == 1) {
                        tr.remove();
                    }
                    cv_interact.success(['<span style="font-weight:bold;color:green">Pickup action succeeded!'].join(''));
                }
                else cv_interact.warning(['<span style="font-weight:bold;color:red">', d.success_count ? d.success_count : 0, ' packages received'].join(''));
                if (d.success_count > 0) ShipmentsComponent.updateShipmentStatus(tr, { 'status_id': d.status_id, 'status': d.status, 'completed': d.completed });
            }
        });
    }

    this.addPackageRow = () => {
        let row_data_blank = { 'barcode': null, 'zone_name': null, 'receiver_phone': null, 'price': 0, 'df_payer': 'sender', 'fees': 0, 'receiver_address': null, 'cod': 1, 'base_fee': 0, 'delivery_fee': 0, 'size': null, 'actual_kg': 0, 'billed_kg': 0 };
        let rows = mThis.getPackages();
        rows.splice(0, 0, row_data_blank);
        mThis.displayPackages(rows);
    }

    this.removePackageRow = (tr) => {
        let rows = mThis.getPackages();
        let index = tr.data('index');
        rows.splice(index, 1);
        return rows;
    }

    this.getData = function () {
        let p = {};
        p.order_id = mThis.order_id;
        p.order_code = mThis.elShipmentCode.val();
        p.sender_id = mThis.elSenderId.val();
        p.sender_code = mThis.elSenderCode.val();
        p.pickup_date = mThis.elPickupDate.val();
        p.to_warehouse_id = mThis.elToWarehouse.val();
        p.packages = mThis.getPackages(p.to_warehouse_id, p.delivery_type);

        let i = 0, c;
        do {
            c = p.packages[i];
            if (!c) break;
            let error = mThis.validatePackage(c);
            if (error) {
                cv_interact.error(error.message);
                return null;
            }
            i++;
        } while (c);
        p.size = DUtil.processPackageSize(p.size);
        return p;
    }

    this.getPackages = (to_warehouse_id) => {
        let data = [];
        mThis.tblPackages.find('tbody>tr').each(function () {
            let row = {};
            let tr = $(this);
            let btn_barcode = tr.find('td.col_action a._pl_print_barcode');
            row.barcode = btn_barcode.data('barcode');
            row.to_warehouse_id = to_warehouse_id;
            tr.find('td>.col-input').each(function () {
                let x = $(this);
                let col_name = x.data('field');
                if (col_name == 'size') {
                    row['size'] = DUtil.processPackageSize(x.val());
                }
                else {
                    row[col_name] = x.val();
                }
            });

            if (!row.zone_code) row.zone_code = row.zone_name;
            data.push(row);
        });
        return data;
    }

    this.displayPackages = function (data, onFinish, d) {
        if (!data || !data[0]) {
            data = [{ 'barcode': null, 'delivery_type': 'normal', 'zone_name': null, 'receiver_phone': null, 'price': 0, 'df_payer': 'sender', 'fees': 0, 'receiver_address': null, 'cod': 1, 'size': null, 'actual_kg': 0, 'billed_kg': 0, 'delivery_fee': 0, 'cod_fee': 0, 'forwarding_cost': '0' }];
        }

        if (mThis.table) {
            mThis.tblPackages.DataTable().clear().destroy();
            mThis.tblPackages.empty();
            mThis.table = null;
        }

        if (!mThis.table)
            mThis.table = mThis.tblPackages.DataTable({
                searching: false,
                destroy: true,
                'ordering': false,
                scrollCollapse: true,
                paging: false,
                bLengthChange: false,
                saveState: true,
                'processing': true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...',
                    "emptyTable": "No pacakges found"
                },
                data: data,
                columns: mThis.package_columns,
                "createdRow": function (row, data, dataIndex) {
                    let tr = $(row);
                    tr.data('pid', data.package_id);
                    tr.data('senderid', data.sender_id);
                    tr.data('barcode', data.barcode);
                    let i = 0;
                    tr.find('td').each(function () {
                        let td = $(this);
                        if (i == 1 || i == 2) {
                            td.find('select.modal-select2').select2({ width: '100%' });
                        }

                        if (i == 0) td.css('min-width', '75px');
                        else if (i == 1) td.css('min-width', '180px');
                        else if (i == 2) td.css('min-width', '180px');
                        else if (i == 3) td.css('min-width', '180px');
                        else if (i > 0) td.css('min-width', '130px');
                        i++;
                    });
                }
            });

        mThis.packages = data;
        if (typeof onFinish == 'function') onFinish();
    };
}

let VerifyPackageDialog = new function () {
    let mThis = this;
    this.self = main_view.appContent.children('#_pl_dlgReceivePackages');
    this.base_url = main_view.base_url;
    this.elTitle = this.self.find('#_pl_dlgReceivePackagesTitle');
    this.lnkFindDriver = this.self.find('#_pl_rps_lnkFindDriver');
    this.btnAddPackage = this.self.find('#_pl_rps_add_package');
    this.btnVerifyPackages = this.self.find('#_pl_rps_btnVerify');

    this.elDriver = this.self.find('#_pl_rps_driver');
    this.elDriverCode = this.self.find('#_pl_rps_driver_code');

    this.elShipment = this.self.find('#_pl_rps_order_id');
    this.elShipmentCode = this.self.find('#_pl_rps_order_code');
    this.elSenderId = this.self.find('#_pl_rps_sender_id');
    this.elSenderName = this.self.find('#_pl_rps_sender_name');
    this.elSenderCode = this.self.find('#_pl_rps_sender_code');
    this.elDeliveryDate = this.self.find('#_pl_rps_delivery_date');
    this.elDeliveryType = this.self.find('#_pl_rps_delivery_type');
    this.elToWarehouse = this.self.find('#_pl_rps_to_warehouse');

    this.tblPackages = this.self.find('#_pl_rps_tblPackages');
    this.elError = this.self.find('#_pl_rps_error');

    this.lnkFindSender = this.self.find('#_pl_rps_lnkFindSender');

    this.lnkFindSender.on('click', function (e) {
        e.preventDefault();
        let option = { 'title': "Find Merchant", "role": "sender", "singleSelect": true, "previousDialog": mThis.self };
        FindPersonDialog.show(option, (persons) => {
            if (persons[0]) {
                let p = persons[0];
                mThis.elSenderName.val(p.name);
                mThis.elSenderCode.val(p.code);
                mThis.elSenderId.val(p.id);
            }
        });
    });

    this.package_columns = [
        {
            className: "col_action",
            data: function (data,index,tr) {
                return ['<div style="width:65px">',
                    '<button type="button" class="_pl_print_barcode btn btn-sm btn-outline-primary" data-barcode="', data.barcode, '" data-pid="', data.package_id, '" data-senderid="', data.sender_id, '"><i class="fa fa-list-alt" style="color:green"></i></button>&nbsp;',
                    '<button type="button" class="_pl_remove_package btn btn-sm btn-outline-danger" data-barcode="', data.barcode, '" data-pid="', data.package_id, '"><i class="fa fa-times" style="color:orange"></i></button>',
                    '</div>'].join('');
            },
            title: ''
        },
        {
            className: "item_type",
            data: function (data,index,tr) {
                let items = [{ 'item_type': 'doc' }, { 'item_type': 'non-doc' }];
                data.item_type = (data.item_type + '').toLowerCase();
                let d = { "inputType": "select2", "data": data, "cssClass": "form-control", "columnName": "item_type", "combo_items": items, "valueMember": "item_type", "textMember": "item_type" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Item Type'
        },
        {
            className: "zone_name",
            data: function (data,index,tr) {
                let d = { "inputType": "select2", "data": data, "cssClass": "modal-select2", "columnName": "zone_name", "combo_items": ShipmentsComponent.form_data.zones, "valueMember": "zone_code", "textMember": "zone_name" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Destination'
        },
        {
            className: "receiver_phone",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "receiver_phone", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Receiver Phone'
        },
        {
            className: "price",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "price", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Price'
        },
        {
            className: "df_payer",
            data: function (data,index,tr) {
                let items = [{ "name": "Sender" }, { "name": "Receiver" }];
                let d = { "inputType": "select2", "data": data, "columnName": "df_payer", "readOnly": false, "combo_items": items, "valueMember": "name", "textMamber": "name", "defaultValue": "Sender" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'DFP'
        },
        {
            className: "fees",
            data: function (data,index,tr) {
                if (!data.fees) data.fees = parseFloat(data.base_fees) + parseFloat(data.delivery_fee);
                data.fees = Number(data.fees).toFixed(2);
                let d = { "inputType": "number", "data": data, "columnName": "fees", "readOnly": false, "defaultValue": 0 };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Fees'
        },
        {
            className: "receiver_address",
            data: function (data,index,tr) {
                let d = { "inputType": "input", "data": data, "columnName": "receiver_address", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Receiver Address'
        },
        {
            className: "cod",
            data: function (data,index,tr) {
                let items = [{ "id": "0", "name": "No" }, { "id": "1", "name": "Yes" }];
                let d = { "inputType": "select2", "data": data, "columnName": "cod", "readOnly": false, "combo_items": items, "valueMember": "id", "textMamber": "name", "defaultValue": 1 };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'COD'
        },
        {
            className: "size",
            data: function (data,index,tr) {
                if (data.size instanceof Object && data.size) {
                    data.size = [data.size.length, ' ', data.size.width, ' ', data.size.height].join('');
                }
                let d = { "inputType": "input", "data": data, "columnName": "size", "readOnly": false, "defaultValue": null, "placeholder": "eg: 10 9.5 11" };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Size'
        },
        {
            className: "actual_kg",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "actual_kg", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Actual KG'
        },
        {
            className: "billed_kg",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "billed_kg", "readOnly": false };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'Billed KG'
        },
        {
            className: "cod_fee",
            data: function (data,index,tr) {
                let d = { "inputType": "number", "data": data, "columnName": "cod_fee", "readOnly": true };
                return EditableTable.makeTableCellEditor(d);
            },
            title: 'COD Fee'
        },
    ];

    mThis.btnVerifyPackages.on('click', function (e) {
        mThis.receivePackages(null);
    });

    mThis.lnkFindDriver.on('click', function (e) {
        e.preventDefault();
        let onClose = (ds) => {
            if (ds[0]) {
                let d = ds[0];
                mThis.elDriver.val(d.id);
                if (!mThis.elDriver.val()) {
                    mThis.elDriver.append($('<option/>').val(d.id).text(d.name)).val(d.id);
                }
                mThis.elDriverCode.val(d.code);
                mThis.elDriver.trigger('change');
            }
        };

        let option = { 'title': 'Find Driver', 'role': 'driver', 'singleSelect': true, 'previousDialog': mThis.self };
        FindPersonDialog.show(option, onClose);
    });

    mThis.btnAddPackage.on('click', function (e) {
        e.preventDefault();
        mThis.addPackageRow();

    });

    mThis.tblPackages.on('click', 'td.col_action button._pl_remove_package', function (e) {
        let x = $(this);
        let tr = x.closest('tr');
        let barcode = x.data('barcode');
        let package_id = x.data('pid');

        if (barcode) {
            cv_interact.confirm('Are you sure to delete this package?', { title: 'Delete Package', confirmButtonText: 'Delete', cancelButtonText: 'Close', context: 'delete' }, function (e) {
                if (e) {
                    let p = { 'barcode': barcode, 'package_id': package_id };
                    vsapi.call([mThis.base_url, '/dms/deletePackage'].join(''), p).then(res => {
                        if (res.status_code === 200) {
                            mThis.packages = mThis.removePackageRow(tr);
                            tr.remove();
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
            return;
        }

        mThis.packages = mThis.removePackageRow(tr);
        tr.remove();
    });

    mThis.tblPackages.on('click', 'td.col_action button._pl_print_barcode', function (e) {
        e.preventDefault();
        let tr = $(this).closest('tr');
        let btn_print_barcode = $(this);
        let barcode = $(this).data('barcode');
        if (!barcode)
            cv_interact.confirm('No barcode yet! Do you want to save this package?', { title: 'Print Barcode', context: 'view', confirmButtonText: 'Print', cancelButtonText: 'Close' }, function (e) {
                if (e) {
                    let onDone = (result) => {
                        if (result.success_count > 0) {
                            barcode = result.last_new_barcode;
                            btn_print_barcode.data('barcode', barcode);
                            tr.find('td.col_action button._pl_remove_package').data('barcode', barcode);
                            window.open([mThis.base_url, '/package_barcode/', barcode ? barcode : 'unknown'].join(''), '_blank');
                        }
                        else {
                            if (result.errors) {
                                if (result.errors[0]) {
                                    mThis.elError.text(result.errors[0]);
                                }
                            }
                        }
                    };

                    mThis.receivePackages(tr, onDone);
                }
            });
        else
            window.open([mThis.base_url, '/package_barcode/', barcode ? barcode : 'unknown'].join(''), '_blank');
    });

    mThis.tblPackages.on('change', 'td.zone_name>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'zone_name');
    });

    mThis.tblPackages.on('change', 'td.billed_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'billed_kg');
    });

    mThis.tblPackages.on('keyup', 'td.actual_kg>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr, 'actual_kg');
    });

    mThis.tblPackages.on('blur', 'td.size>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setBilledKg(tr);
        mThis.setDeliveryPrices(tr, 'size');
    });

    mThis.tblPackages.on('change', 'td.price>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'price');
    });

    mThis.tblPackages.on('change', 'td.cod>.col-input', function (e) {
        let tr = $(this).closest('tr');
        mThis.setDeliveryPrices(tr, 'cod');
    });

    this.setDeliveryPrices = (tr, change_agent) => {
        let sender_id = mThis.elSenderId.val();
        let delivery_type = mThis.elDeliveryType.val();
        let zone_code, billed_kg = 0, price = 0, cod;
        zone_code = EditableTable.getCellValue(tr, 'zone_name',false);
        billed_kg = EditableTable.getCellValue(tr, 'billed_kg', true);
        cod = EditableTable.getCellValue(tr, 'cod',true);

        if (!sender_id) {
            mThis.elError.html('សូមជ្រើសរើសអ្នកលក់ដើម្បីកំណត់តំលៃសេវា');
            return;
        }

        if (!zone_code) {
            mThis.elError.html('សូមជ្រើសរើសតំបន់ដើម្បីកំណត់តំលៃសេវា');
            return;
        }
        if (!delivery_type) {
            mThis.elError.html('សូមជ្រើសរើសប្រភេទសេវាដើម្បីកំណត់តំលៃសេវា');
            return;
        }

        let p = { 'sender_id': sender_id, 'delivery_type': delivery_type, 'zone_code': zone_code, 'billed_kg': billed_kg, 'cod': cod };
        vsapi.call([mThis.base_url, '/dms/package/price-info'].join(''), p).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                EditableTable.setCellValue(tr, 'base_fee', d.base_fee);
                EditableTable.setCellValue(tr, 'delivery_fee', Number(d.delivery_fee).toFixed(2));
                price = EditableTable.getCellValue(tr, 'price', true);
                if (cod == 0)
                    EditableTable.setCellValue(tr, 'cod_fee', 0);
                else {
                    let base_fee = EditableTable.getCellValue(tr, 'base_fee', true);
                    let delivery_fee = EditableTable.getCellValue(tr, 'delivery_fee', true);
                    let cod_fee = (price + base_fee + delivery_fee) * d.cod_fee_percent / 100;
                    EditableTable.setCellValue(tr, 'cod_fee', Number(cod_fee).toFixed(2));
                }

                if (d.status === 'Error') {
                    EditableTable.handlePriceError(tr, d);
                }
            }
        });
    }

    this.setBilledKg = (tr, size_string) => {
        if (!size_string) size_string = EditableTable.getCellValue(tr, 'size',false);
        if (!size_string) return;

        let size = DUtil.processPackageSize(size_string);
        if (!size.length) return;

        let kg = 0;
        let b = size.length * size.width * size.height;
        b = Number(b / 6015);
        let actual_kg = EditableTable.getCellValue(tr, 'actual_kg',true);
        if (b > actual_kg)
            kg = b;
        else
            kg = actual_kg;
        EditableTable.setCellValue(tr, 'billed_kg',Number(kg).toFixed(2));
    }

    this.show = (option, onClose) => {
        if (!option) option = {};
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.order_id = option.order_id;
        mThis.sender_id = option.sender_id;
        mThis.tr_row = option.tr_row;
        mThis.elTitle.html(option.title ? option.title : 'Verify Packages');

        mThis.prepareFormData({ 'driver_id': 0 });

        if (mThis.order_id > 0) {
            mThis.lnkFindSender.hide();
            mThis.loadOrderInfo(mThis.order_id, function (e) {
                mThis.self.modal({
                    backdrop: 'static'
                });
            });
        }
        else {
            if (!option.allow_find_sender)
                return;
            else {
                mThis.lnkFindSender.show();
                mThis.elSenderName.val(null);
                mThis.elSenderId.val(null);
                mThis.elSenderCode.val(null);
                mThis.elShipmentCode.val(null);
                mThis.elShipment.val(null);
                mThis.tblPackages.find('tbody').empty();
                mThis.addPackageRow();
                mThis.self.modal({
                    backdrop: 'static'
                });
            }
        }
    }

    this.prepareFormData = (def, onFinish) => {
        if (!def) def = {};
        def.warehouse_id = main_view.DEF_TO_WAREHOUSE_ID;
        VSUtil.setComboItems(mThis.elToWarehouse, ShipmentsComponent.form_data.warehouses, 'id', 'warehouse_name', false, 0, def.warehouse_id);
        vsapi.call([mThis.base_url, '/dms/getComboItems_driver'].join(''), null).then(res => {
            if (res.status_code === 200) {
                let items = StringSanitizer.sanitizeObject(res.data);
                let text1 = LocaleManager.trans('To Be Assigned');
                VSUtil.setComboItems(mThis.elDriver, items, 'id', 'driver_name', true, `(${text1})`, def.driver_id);
                if (typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.loadOrderInfo = (order_id, onFinish) => {
        let p = { 'order_id': order_id ? order_id : 0, "context": 1 };
        vsapi.call([mThis.base_url, '/dms/getOrderInfo'].join(''), p).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);
                let packages = d.packages ? d.packages : [];
                packages = StringSanitizer.sanitizeObject(packages, null, ['size']);
                mThis.order_id = d.order_id;
                mThis.elShipmentCode.val(d.order_code);
                mThis.elSenderName.val(d.sender_name);
                mThis.elSenderId.val(d.sender_id);
                mThis.elSenderCode.val(d.sender_code);

                mThis.displayPackages(packages, null);
                if (typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.receivePackages = (tr_package = null, onDone = null) => {
        mThis.elError.html(null);
        let p = mThis.getData(tr_package);
        if (!p) return;
        if (!p.pickup_date) p.pickup_date = '';
        if (!p.driver_id) p.driver_id = 0;
        //p.id = order_id;
        p.allow_create_order = 1;
        vsapi.call([mThis.base_url, '/dms/delivery-order/receive'].join(''), p,null).then(res => {
            if (res.status_code === 200) {
                if (typeof onDone === 'function')
                    onDone(res.data);
                else {
                    let d = res.data;

                    if (d) {
                        if (d.error_message) {
                            cv_interact.error(d.error_message);
                            return;
                        }
                        if (d.error_count > 0) {
                            let i = 0, c;
                            let html = null;
                            do {
                                c = d.errors[i];
                                if (!c) break;
                                html = [html, '<li><span style="color:green;font-weight:bold">', c, '</span></li>'].join('');
                                i++;
                            } while (c);
                            if (html) html = ['<ul>', html, '</ul>'].join('');
                            cv_interact.warning(html);
                        }
                        else if (result.success_count > 0) {
                            mThis.self.modal('hide');
                            if (typeof mThis.onClose == 'function') mThis.onClose(true);
                            cv_interact.info(['<span style="font-weight:bold;color:green">', d.success_count, ' packages received!'].join(''));
                        }
                        else cv_interact.warning(['<span style="font-weight:bold;color:red">', d.success_count, ' packages received'].join(''));

                    }
                }
            }
        });
    }

    this.addPackageRow = () => {
        let def_base_fee = 0;
        if (mThis.senderInfo) def_base_fee = mThis.senderInfo.base_fee;
        let row_data_blank = { 'barcode': null, 'zone_name': null, 'receiver_phone': null, 'price': 0, 'df_payer': 'sender', 'fees': 0, 'receiver_address': null, 'cod': 1, 'base_fee': 0, 'delivery_fee': 0, 'size': null, 'actual_kg': 0, 'billed_kg': 0 };
        let rows = mThis.getPackages();
        rows.splice(0, 0, row_data_blank);
        mThis.displayPackages(rows);
    }

    this.removePackageRow = (tr) => {
        let rows = mThis.getPackages();
        let index = tr.data('index');
        rows.splice(index, 1);
        return rows;
    }

    this.getData = function (package_tr = null) {
        let p = {};
        p.warehouse_id = mThis.elToWarehouse.val();
        p.delivery_type = mThis.elDeliveryType.val();
        p.id = mThis.order_id;
        //p.order_id = mThis.order_id;
        p.order_code = mThis.elShipmentCode.val();
        p.sender_id = mThis.elSenderId.val();
        p.sender_code = mThis.elSenderCode.val();
        p.delivery_date = mThis.elDeliveryDate.val();
        p.packages = mThis.getPackages(package_tr, p.delivery_type);
        if (!p.warehouse_id) {
            cv_interact.error('Warehouse identity is not correct');
            return null;
        }

        if (!p.packages) return null;
        return p;
    }

    this.getPackages = (tr, delivery_type) => {
        let ps = [];
        if (tr) {
            let p = mThis.getPackageObject(tr);
            let err = mThis.validatePackage(p);
            if (err) {
                mThis.elError.text(err);
                return null;
            }
            else {
                p.delivery_type = delivery_type;
                p.size = DUtil.processPackageSize(p.size);
                ps.push(p);
            }
            return ps;
        }

        mThis.tblPackages.find('tbody>tr').each(function () {
            let p = mThis.getPackageObject($(this));
            let err = mThis.validatePackage(p);
            if (err) {
                mThis.elError.text(err);
                return null;
            }
            else {
                p.size = DUtil.processPackageSize(p.size);
                ps.push(p);
            }

        });
        return ps;
    }

    this.getPackageObject = function (tr) {
        let row = {};
        let to_warehouse_id = mThis.elToWarehouse.val();
        let btn_barcode = tr.find('td.col_action button._pl_print_barcode');
        row.barcode = btn_barcode.data('barcode');
        tr.find('td>.col-input').each(function () {
            let x = $(this);
            let col_name = x.data('field');

            if (col_name == 'size') {
                let size = DUtil.processPackageSize(x.val());
                if (size) {
                    if (size.width > 0) {
                        row[col_name] = [size.length, ' ', size.width, ' ', size.height].join('');
                    } else row[col_name] = null;

                } else row[col_name] = null;
            } else {
                row[col_name] = x.val();
            }
        });
        if (!row.zone_code) row.zone_code = row.zone_name;
        row.to_warehouse_id = to_warehouse_id;
        row.warehouse_id = to_warehouse_id;
        row.delivery_type = mThis.elDeliveryType.val();
        return row;
    }

    this.validatePackage = (p) => {
        if (Validator.isNullOrEmpty(p.to_warehouse_id)) {
            return 'Receiving warehouse information is not correct';
        }
        if (!p.to_warehouse_id || p.to_warehouse_id <= 0) {
            return 'Receiving warehouse information is not correct';
        }
        if (Validator.isNullOrEmpty(p.receiver_phone)) {
            return 'Some packages does not have receiver`s phone number';
        }

        if (Validator.isNullOrEmpty(p.zone_code)) {
            return 'Some packages does not have destination zone';
        }
        if (p.cod == 1) {
            if (p.price <= 0 || !p.price) {
                return 'In case of Cash On Delivery (COD), the package`s price cannot be zero';
            }
        }
        if (p.base_fee > 0 || p.delivery_fee > 0) {
            let dfp = (p.df_payer + '').toLowerCase();
            if (dfp != 'sender' && dfp != 'receiver') {
                return 'Delivery Fee Payer (DFP) must be Sender or Receiver';
            }
        }
        return null;
    }

    this.processPackageSize = (size_str) => {
        size_str = (size_str + '').trim();
        if (size_str == '') return { 'length': 0, 'width': 0, 'height': 0 };
        let parts = size_str.split(' ');
        if (!parts[0])
            return false;
        else if (parts[0] && !parts[2]) {
            return false;
        } else if (!$.isNumeric(parts[2]) || !$.isNumeric(parts[1]) || !$.isNumeric(parts[0]))
            return false;
        else {
            let length = parseFloat(parts[0]);
            let width = parseFloat(parts[1]);
            let height = parseFloat(parts[2]);
            return { 'length': length, 'width': width, 'height': height };
        }
        return null;
    }

    this.displayPackages = function (data, onFinish, d) {
        if (!data || !data[0]) {
            data = [{ 'barcode': null, 'zone_name': null, 'receiver_phone': null, 'price': 0, 'df_payer': 'sender', 'fees': 0, 'receiver_address': null, 'cod': 1, 'size': null, 'actual_kg': 0, 'billed_kg': 0, 'delivery_fee': 0, 'cod_fee': 0, 'forwarding_cost': '0' }];
        }

        if (mThis.table) {

            mThis.tblPackages.DataTable().clear().destroy();
            mThis.tblPackages.empty();
            mThis.table = null;
        }

        if (!mThis.table)
            mThis.table = mThis.tblPackages.DataTable({
                searching: false,
                destroy: true,
                paging: true,
                pageLength: 5,
                'ordering': false,
                scrollCollapse: true,
                paging: false,
                bLengthChange: false,
                saveState: true,
                'processing': true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...',
                    "emptyTable": "No pacakges found"
                },
                data: data,
                columns: mThis.package_columns,
                "createdRow": function (row, data, dataIndex) {
                    let tr = $(row);
                    tr.data('pid', data.package_id);
                    tr.data('senderid', data.sender_id);
                    tr.data('barcode', data.barcode);
                    let i = 0;
                    tr.find('td').each(function () {
                        let td = $(this);
                        if (i > 0 && i <= 3) {
                            td.css('min-width', '180px');
                            td.find('select.modal-select2').select2({ width: '100%' });
                        }
                        else if (i > 0)
                            td.css('min-width', '100px');
                        else if (i == 9)
                            td.css('min-width', '100px');
                        i++;
                    });
                }
            });
        mThis.packages = data;
        if (typeof onFinish == 'function') onFinish();
    };
}



const EditableTable = new function () {
    this.handlePriceError = (tr, d, display_span = null) => {
        if (display_span)
            display_span.text(d.error_message);
        else cv_interact.error(d.error_message);
    }

    this.getCellValue = (tr, col_name, is_numeric =true) => {
        if (!tr){
             if(is_numeric) return 0; else return null;
        };
        const td = tr.querySelector(`td.${col_name}`);
        if(!td){
            if(is_numeric) return 0; else return null;
        }
        const cell_editor = td.querySelector('.col-input');
        if(!cell_editor) {
            return td.textContent;
        }else{
            let value = cell_editor.value;
            if (is_numeric) {
                return isNaN(value) ? 0 :Number(value);
            }
            else return value;
        }
    };
 
    //set cell value in sub table in tblPickups
    this.setCellValue = (tr, col_name, value) => {
        if (!tr) return;
        const td = tr.querySelector(`td.${col_name}`);
        if(!td) return;
        const cell_editor = td.querySelector('.col-input');
        if (cell_editor) {
            td.dataset.value = value;
            if (cell_editor.tagName === 'SELECT') {
                cell_editor.value = value;
                cell_editor.dispatchEvent(new Event('change'));
            } else {
                cell_editor.value = value;
            }
        }
    };
 
    // this.setAutoComplete = function (tr, col_name, option) {
    //     if (!tr) return;
    //     let selector = ['td.', col_name, ' .col-input'].join('');
    //     let textbox = tr.find(selector);
    //     if (textbox.length === 0 || !textbox) return;
    //     if (!option) option = {};
    //     let new_id = col_name + "_1";

    //     textbox.attr('id', new_id);
    //     let config =
    //     {
    //         selector: "#" + new_id,
    //         placeHolder: "Search for Food...",
    //         data: {
    //             src: ["Sauce - Thousand Island", "Wild Boar - Tenderloin", "Goat - Whole Cut"],
    //             cache: true,
    //         },
    //         resultsList: {
    //             element: (list, data) => {
    //                 if (!data.results.length) {
    //                     const message = document.createElement("div");
    //                     message.setAttribute("class", "no_result");
    //                     message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
    //                     list.prepend(message);
    //                 }
    //             },
    //             noResults: true,
    //         },
    //         resultItem: {
    //             highlight: {
    //                 render: true
    //             }
    //         }
    //     }

    //     const ttt = new autoComplete(config);
    // };

    this.makeTableCellEditor = (option) => {

        if (option.inputType == 'date' || option.inputType == 'input' || option.inputType == 'number') {
            let input_readOnly = '', data_select = null;
            if (option.readOnly == true) input_readOnly = ' readOnly';
            let input_type = ' type="text"';
            if (option.inputType == 'number') input_type = ' type ="number"';
            if (option.input_type == 'date') {
                data_select = ' data-select="datepicker" autocomplete="off"';
                input_type = null;
            }

            let el_style = null;
            if (option.width) el_style = [' style = "width:', option.width, '" '].join('');
            let el_placeholder = null;
            if (option.placeholder) el_placeholder = [' placeholder="', option.placeholder, '"'].join('');
            return ['<td data-field="', option.columnName, '" class="', option.columnName, '"><input data-field="', option.columnName, '"', input_type, '" class="form-control col-input ', option.cssClass, '"', el_style, ' value="', option.data[option.columnName], '"', input_readOnly, el_placeholder, data_select, '></td>',].join('');
        }
        else if (option.inputType == 'select') {
            let input_readOnly = '', html_options = '';
            if (option.readOnly == true) input_readOnly = ' disabled';
            if (option.combo_items) {
                let i = 0, c;
                do {
                    c = option.combo_items[i];
                    if (!c) break;
                    let value_m = option.valueMember ? option.valueMember : 'id';
                    let text_m = option.textMember ? option.textMember : 'name';
                    let cell_value = option.data[option.columnName];
                    let selected = '';
                    if ((cell_value + '').toLowerCase() == (c[value_m] + '').toLowerCase()) selected = " selected";
                    let o_html = ['<option value="', c[value_m], '" ', selected, '>', c[text_m], '</option>'].join('');
                    html_options = [html_options, o_html].join('');

                    i++;
                } while (c);
            }
            let el_style = null;
            if (option.width) el_style = [' style = "width:', option.width, '" '].join('');
            let el_placeholder = null;
            if (option.placeholder) el_placeholder = [' placeholder="', option.placeholder, '"'].join('');
            return ['<td data-field="', option.columnName, '" class="', option.columnName, '"><select data-field="', option.columnName, '" class="form-control col-input ', option.cssClass, '" ', el_style, input_readOnly, el_placeholder, '>', html_options, '</select></td>',].join('');
        }
    };
}

const ShipmentDialog = new function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_pl_dlgEmptyOrder');
    this.btnCreate = this.self.find('#_pl_dlgEmptyOrder_btnOK');
    this.el_from_country = this.self.find('#_plq_from_country');
    this.elSender = this.self.find('#_plq_sender');
    this.el_to_country = this.self.find('#_plq_to_country');
    this.el_primary_cp = this.self.find('#_plq_primary_cp');
    this.el_secondary_cp = this.self.find('#_plq_secondary_cp');

    this.prepareFormOptions = ( id, onFinish) => {
        vsapi.call(`${mThis.base_url}/abm/oversea_shipments/form-options`, {id : id}, null).then(res => {
            console.log('d2',res.data.to_country);
            let d = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data , null, ['country_name','cp_name'] ) : {};
            // VSUtil.setComboItems(mThis.el_from_country, d.from_country, 'id', 'country_name', true, '(select )' , null);
            // mThis.elWarehouse.val(d.warehouses[0].id).trigger('change'); 
            VSUtil.setComboItems(mThis.elSender, d.senders, 'id', 'sender_name', true, '(select )', null);
            VSUtil.setComboItems(mThis.el_to_country, d.to_country, 'id', 'country_name', true, '(select country)', null);
            VSUtil.setComboItems(mThis.el_primary_cp, d.primary_cp, 'id', 'cp_name', true, '(select primary cp)', null);
            VSUtil.setComboItems(mThis.el_secondary_cp, d.secondary_cp, 'id', 'cp_name', true, '(select secondary cp)', null);
            // VSUtil.setComboItems(mThis.elVehicleType, d.vehicle_types, 'code', 'vehicle_type', null, null,d.vehicle_types[0]?d.vehicle_types[0].code:'');
            onFinish(d);
        });
    }

    this.getFormData = (silent = false) => {
        let has_error = false;
        let p = {};
        mThis.self.find('.data-input').each(function () {
            const el = $(this);
            const f = el.data('field');
            if (el.data('error') == 1) {
                has_error = true;
                return false;
            }
            p[f] = el.val();
        });
        return has_error ? null : p;
    }

    this.setData = (d) => {
        // mThis.body.querySelectorAll('.data-input').forEach(el => {
        //     el.value = null;
        // });
        // if (!d) return;
        d = d || {};
        mThis.self[0].querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            el.value = d[data_member] ?? '';
            console.log(d[data_member]);

            if (el.tagName.toLowerCase() === 'select') {
                el.dispatchEvent(new Event('change'));
            }
        });

    }

    // this.elSender.on('change', (e) => {
    //     let m = { 'sender_id': mThis.elSender.val() };
    //     vsapi.call([mThis.base_url, '/dms/merchant/address'].join(''), m).then(res => {
    //         let address = (res.status_code === 200) ? res.data : '';
    //         mThis.elPickupAddress.val(address);
    //     });
    // });

    this.btnCreate.on('click', (e) => {
        const p = mThis.getFormData(false);
        //console.log('p',p);
        if (!p) return;
        vsapi.call(`${mThis.base_url}/abm/oversea_shipments/save`, p, mThis.btnCreate).then(res => {
            if (res.status_code === 200) {
                cv_interact.success('New shipment created');
                mThis.self.modal('hide');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose();
            } else cv_interact.error(res.error_message);
        });
    });

    this.show = (options) => {
        options = options ? options : {};
        mThis.options = options;
        let p = options.id;
        console.log('p',p);
        mThis.prepareFormOptions( p , d => {
            console.log("d",d);
            if(d.shipment){
                mThis.setData(d.shipment);
            }
            mThis.self.modal({
                'backdrop': 'static'
            });
        });

    }
}
 
const ItemEntryDialog = new function(){
    this.self = main_view.appContent.children('#pkl_dlgPackage');
    const mThis = this;
    this.elTitle = this.self[0].querySelector('.modal-title');
    this.btnSave = this.self[0].querySelector('#pkl_dlgPackage_btnSave');
    this.btnClose = this.self[0].querySelector('#pkl_dlgPackage_btnClose');
    this.btnSaveAndNext = this.self[0].querySelector('#pkl_dlgPackage_btnSaveAndNext');
    this.btnPrev = this.self[0].querySelector('#pkl_dlgPackage_btnPrev');

    this.modalBody = this.self[0].querySelector('div.modal-body');
    this.inputPanel = this.modalBody.querySelector('.div-item-details');
    this.photoview = this.modalBody.querySelector('#pkl_dlgPackage_item_photo');
    this.elZone = this.modalBody.querySelector('#pkl_dlgPackage_zone');
    this.span_nav_info = this.modalBody.querySelector('#nav_info_text');

    this.form_data = {};
    this.options = {};
 
    this.api_details_in_progress = false;

    /** Click on Modal's body modal body click */
    this.modalBody.addEventListener('click',e=>{
       e.preventDefault();
       let btn = VSUtil.closestLimited(e.target,'.btn-move');
       if(btn){
         const moveType = btn.dataset.movetype;
         mThis.navigateImage(moveType,null);    
         return;
       }
    });

    this.btnPrev.addEventListener('click',e=>{
        e.preventDefault();
        mThis.navigateImage('prev',this.btnPrev);
    });

    this.btnSave.addEventListener('click',e=>{
        e.preventDefault();
        mThis.savePackage(mThis.btnSave,mThis.options.onClose,true);
    });

    this.btnClose.addEventListener('click',e=>{
       e.preventDefault();
       if (typeof mThis.options.onClose ==='function') mThis.options.onClose();
       mThis.self.modal('hide');  
    });

    this.btnSaveAndNext.addEventListener('click',e=>{
        e.preventDefault();
        mThis.savePackage(mThis.btnSaveAndNext,()=>{
            mThis.navigateImage('next');
        },false);
        
        // let p = mThis.getInput();
        // vsapi.call(`${main_view.base_url}/api/order/save-package`,p,mThis.btnSaveAndNext,null).then(res =>{
        //      if(res.status_code ===200){
        //         const d = res.data;
        //         if(mThis.current_index >=0){
        //             let x = mThis.options.items[mThis.current_index];
        //             if(x){
        //                 x.package_id = d.package_id;
        //                 x.barcode = d.barcode;
        //             }
        //        }
        //        mThis.navigateImage('next');     
        //      }else cv_interact.warning(res.error_message);
        // });
        // //alert('Save and move next to item details'); 
    });
  
    this.savePackage =(btn,onFinish = null,closeDialog=true)=>{
        let p = mThis.getInput();
        vsapi.call(`${main_view.base_url}/dms/order/save-package`,p,btn,null).then(res =>{
            if(res.status_code ===200){
                const d = res.data;
                if(mThis.current_index >=0){
                    let item = mThis.options.items[mThis.current_index];
                    if(item){
                        item.package_id = d.package_id;
                        item.barcode = d.barcode;
                        console.log('image_id = ',item.id,'save success barcode = ' + mThis.options.items[mThis.current_index].barcode);
                    }
                }
                if (closeDialog){
                    if (typeof onFinish ==='function') onFinish();
                    mThis.self.modal('hide');
                }else{
                    if (mThis.current_index >= mThis.img_count-1){
                        cv_interact.warning('This is the last item');
                        return;
                    }  
                     //If not close Dialog, then move to next image
                     mThis.navigateImage('next'); 
                   
                }
            }else cv_interact.warning(res.error_message);
       });
    }

    /** getData() | getFormData() */
    this.getInput = ()=>{
        const item = mThis.options.items[mThis.current_index];
        const current_package_id = item? item.package_id : null;
        const current_barcode = item? item.barcode : null;
        let p = {
            "order_id":mThis.options.order_id,
            "package_id": current_package_id,
            "barcode":current_barcode,
            "image_id":item.id
        };
        this.modalBody.querySelectorAll('.data-input').forEach(el =>{
            const f = el.dataset.field;
            p[f] = el.value;  
        });
        return p;
    }

    /** direction = "prev|next"*/
    this.navigateImage = (direction,btn=null)=>{
        if(!mThis.current_index) mThis.current_index = 0;
         
        if(direction ==='prev'){
             mThis.current_index--;
          }else{
             mThis.current_index++;
          }
          if(mThis.current_index <0 ) mThis.current_index = 0;
          else if(mThis.current_index > mThis.img_count-1) mThis.current_index = mThis.img_count-1;
          //mThis.span_nav_info.textContent = [(mThis.current_index +1),' of ',mThis.img_count].join('');
       mThis.displayItemDetails(mThis.current_index,btn);
    }

    this.displayItemDetails = (index,btn)=>{
       const item = mThis.options.items[index];
       if(item){
         mThis.photoview.setAttribute('src',item.image_url);
         if (item.package_id){
             let x = {"order_id":mThis.options.order_id,"package_id": item.package_id};
             if (mThis.api_details_in_progress){
                setTimeout(()=>{
                    mThis.displayItemDetails(index);
                },350);
                return;
             }
             mThis.api_details_in_progress = true;
             vsapi.call(`${main_view.base_url}/dms/order/package-details`,x,btn,false).then(res=>{
                 if(res.status_code ===200){
                    const d = res.data;
                    mThis.setPackageDetails(d);
                 }else cv_interact.error(res.error_message);
                 mThis.api_details_in_progress = false;
             });  
         }else{
            //No package_id => clear form
            mThis.setPackageDetails(null);
         }
         mThis.span_nav_info.textContent = [(mThis.current_index +1),' of ',mThis.img_count].join('');
       } 
    }

    //set package details
    this.setPackageDetails =(d)=>{
       /** Set default values for item */ 
       d = d || {
         "delivery_type":"normal",
         "df_payer":"sender"
       };
       mThis.inputPanel.querySelectorAll('.data-input').forEach(el =>{
          const f = el.dataset.field;
          if(el.tagName ==='SELECT'){
            el.value = d[f] || '';
            el.dispatchEvent(new Event('change'));
          }else{
            el.value = d[f] || '';
          }
       });
       Validator.clearErrors(mThis.inputPanel);
    }

    this.prepareFormOptions = (def,onFinish)=>{
       def = def || {};
       if(mThis.form_data.delivery_zones){
         onFinish();
       }else{
           vsapi.call(`${main_view.base_url}/dms/settings/options-delivery-zone`,null,null,false).then(res=>{
            if(res.status_code ==200){
                mThis.form_data.delivery_zones = res.data;
                VSUtil.setComboItems(mThis.elZone,mThis.form_data.delivery_zones,'zone_code','zone_name',null,'Select Zone',null);
                onFinish();
             }else cv_interact.error('Failed to get form options or zone list');
           });
       }
    }

    this.show = (options =null)=>{
        mThis.options = options;
        if(options.title) mThis.elTitle.textContent = options.title;
        mThis.prepareFormOptions(null,() => {
            mThis.img_count = options.items.length;
            mThis.current_img_id = options.id || options.image_id;
            const index = options.items.findIndex(item => item.id == mThis.current_img_id);
            mThis.current_index = index;
            mThis.displayItemDetails(index);
            mThis.self.modal({
                'backdrop':'static'
            });  
        });

    }
}

const SpecialChargeDialog = new function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#ps_dlgSpecialCharge');
    this.btnOK = this.self.find('#ps_dlgSpecialCharge_btnOK');
    this.elError = this.self.find('#ps_dlgSpecialCharge_error');
    this.elTitle = this.self.find('#ps_dlgSpecialChargeTitle');
  
    this.elCategory = this.self.find('#ps-newsc_category');
    this.elCharge = this.self.find('#ps-newsc_charge');
    this.elShipmentID = this.self.find('#ps-shipment_id');
    this.elScID = this.self.find('#ps-sc_id');
    this.elRemarks = this.self.find('#ps-remarks');
  
    this.btnOK.on('click', (e) => {
      let p = mThis.getData();
      if (!p.category) {
        mThis.elError.html('Category cannot be empty');
        return;
      }
  
      if (!$.isNumeric(p.charge)) {
        mThis.elError.html('Charge is not valid');
        return;
      }
      //console.log('p',p);
      vsapi.call([mThis.base_url, '/abm/special-charge/save'].join(''), p).then(res => {
        if (res.status_code === 200) {
            //console.log('me');
          let d = res.data;
          if (typeof mThis.onClose === 'function') {
            mThis.onClose(d.id);
        }
        ShipmentsComponent.shipmentListView.showPage();
        mThis.self.modal('hide');
        } else mThis.elError.text(res.error_message);
      });
  
    });
  
    this.getData = () => {
      let p = {};
      p.category = mThis.elCategory.val();
      p.charge = mThis.elCharge.val();
      p.shipment_id = mThis.elShipmentID.val();
      p.id = mThis.elScID.val();
      p.remarks = mThis.elRemarks.val();
    
      return p;
    }
  
    this.show = (option, onClose) => {
    // console.log('option.shipment_id',option.shipment_id);
    mThis.elShipmentID.val(option.shipment_id);
    mThis.elScID.val('');
    mThis.elRemarks.val('');
    mThis.elCategory.val('');
    mThis.elCharge.val('');
    //console.log('this is me',option);
    if(option.id){
    mThis.elScID.val(option.id);
    mThis.elRemarks.val(option.remarks);
    mThis.elCategory.val(option.category);
    mThis.elCharge.val(option.charge);
    } 
    //   console.log(mThis.elCharge.val());
      mThis.elError.html(null);
      mThis.elTitle.html(option.title)
      mThis.onClose = onClose;
  
      mThis.self.modal({
        backdrop: 'static'
      });
    }
}

