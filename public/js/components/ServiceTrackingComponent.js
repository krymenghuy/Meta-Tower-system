"use strict";
let ServiceTrackingComponent = new function(){
    let mThis = this;
    this.title_prop = 'Service Tracking';
    this.self = $('#_main_serviceTrackingComponent');
    this.tblServiceTracking = $('#_tbl_service_tracking');
    this.btnNew = $('#st_btnNew');

    this.init = () => {
        mThis.btnNew.on('click',(e) => {
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': (e) => {
                    if(e) mThis.displayServiceTracking();
                }
            };
            ServiceTrackingDialog.show(op);
        });

        mThis.tblServiceTracking.on('click','a.st-btn-modify',(e) => {
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            ServiceTrackingDialog.show(op);
        });
    }

    this.displayServiceTracking = () => {
        let data = [];
        vsapi.call(`${main_view.base_url}/api/service-track/list`,null).then(res => {
            if(res.status_code === 200){
                data = StringSanitizer.sanitizeObject(res.data);
            }
        });

        let columns = [{
            title: "Date",
            data: "date",
        },
        {
            title: "Client Name",
            data: "customer_name"
        },
        {
            title: "Service",
            data: "service"
        },
        {
            title: "Doctor",
            data: "doctor_name"
        },
        {
            title: "Nurse",
            data: "first_nurse"
        },
        {
            title: "Price",
            data: "price"
        },
        {
            title: "Commission",
            data: "commission"
        },
        {
            title: "Action",
            data: (data, a, b) => {
                let html = `<div class="d-flex align-items-center gap-2">
                    <a href="javascript:void(0)" class="st-btn-modify" data-id="${data.id}">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </a>
                </div>`;
                return html;
            }
        }];

        if(mThis.table){
            mThis.tblServiceTracking.DataTable().clear().destroy();
            mThis.tblServiceTracking.empty();
            mThis.table = null;
        }

        if(!mThis.table){
            mThis.table = mThis.tblServiceTracking.DataTable({
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
                'columns': columns,
                "createdRow": function (row, data, dataIndex) {
                    let tr = $(row);
                    tr.data('id', data.id);
                }
            });
        }
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayServiceTracking(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ServiceTrackingDialog = new function(){
    let mThis = this;
    this.self = $('#st_dlg_Service_Tracking');
    this.btnSave = $('#st_dlg_Service_Tracking_btnSave');
    this.dlgTitle = $('#st_dlg_Service_Tracking_title');

    mThis.btnSave.on('click',(e) => {
        e.preventDefault();
        let p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/service-tracking-save`,p).then(res => {
            if(res.status_code === 200){
                cv_interact.success("Service Saved Success!");
                mThis.self.modal('hide');
                ServiceTrackingComponent.displayServiceTracking();
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.getDataForm = () => {
        let p = [];
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        if(!d || d === null) d = {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('select'))
                el.val(d[f] ? d[f] : "").trigger("change");
            el.val(d[f] ? d[f] : "");
        });
    }
    
    this.show = (options) => {
        if(!options) options = {};
        if(options.id > 0){
            let data = [];
            mThis.dlgTitle.text("Modify Service Tracking");
            vsapi.call(`${main_view.base_url}/api/service-tracking-details`,options.id,null,false).then(res => {
                if(res.status_code === 200){
                    data = StringSanitizer.sanitizeObject(res.data);
                }
                else
                    cv_interact.error(res.error_message);
            });
            mThis.setDataForm(data);
            mThis.self.modal({
                backdrop: 'static'
            });
        }
        else{
            mThis.dlgTitle.text("New Service Tracking");
            mThis.setDataForm(null);
            mThis.self.modal({
                backdrop: 'static'
            });
        }
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ServiceTrackingComponent.init();
});