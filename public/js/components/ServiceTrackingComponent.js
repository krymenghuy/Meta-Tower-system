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
                    if(e) mThis.displayServiceTracks();
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

    this.loadServiceTracks = (onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/service-track/list`,null).then(res => {
            if(res.status_code === 200){
                let data = StringSanitizer.sanitizeObject(res.data);
                mThis.displayServiceTracks(data);
                if(typeof onFinish==='function') onFinish(data);
            }
        });
    }

    
    this.displayServiceTracks = (data) => {
        
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
        mThis.loadServiceTracks(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ServiceTrackingDialog = new function(){
    let mThis = this;
    this.self = $('#st_dlgService_Tracking');
    this.btnSave = $('#st_dlgService_Tracking_btnSave');
    this.dlgTitle = $('#st_dlgService_Tracking_title');
    this.elService = $('#st_dlgService_service');
    this.elServicePlan = $('#st_dlgService_service_plan');
    this.elDoctor = $('#st_dlgService_doctor');
    this.elFirstNurse = $('#st_dlgService_first_nurse');
    this.elClient = $('#st_dlgService_client');

    mThis.btnSave.on('click',(e) => {
        e.preventDefault();
        let p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/service-track/save`,p,null,false).then(res => {
            if(res.status_code === 200){
                cv_interact.success("Service track saved!");
                mThis.self.modal('hide');
                ServiceTrackingComponent.loadServiceTracks();
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.getDataForm = () => {
        let p = {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        p.id = mThis.service_track_id;
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
    
    this.loadFormOptions =(id,onFinish)=>{
       vsapi.call(`${main_view.base_url}/api/serive-track/form-options`,{'id':id},null,false).then(res=>{
            if(res.status_code===200){
                //data ={'service_track','option_service','option_service_plan'}
                //data.service_track is the service_track details in case of "Edit" mode
                let data = res.data;
                onFinish(data);
            }
       });
    }

    this.show = (options) => {
        if(!options) options = {};
        //This "id" is used in case of Update
        mThis.service_track_id = options.id;

        //if options.id is supplied, then d.data is available with details of service_track
        mThis.loadFormOptions(options.id,(d)=>{
            VSUtil.setComboItems(mThis.elService,d.options_service,'id','service_name',null,null,null);
            VSUtil.setComboItems(mThis.elServicePlan,d.options_service_plan,'id','service_plan_name',null,null,null);
            VSUtil.setComboItems(mThis.elDoctor,d.options_doctor,'id','name',null,null,null);
            VSUtil.setComboItems(mThis.elFirstNurse,d.options_nurse,'id','name',null,null,null);
            VSUtil.setComboItems(mThis.elClient,d.options_client,'id','client_name',null,null,null);

            if(d.service_track){
                mThis.dlgTitle.text("Modify Service Track");
            }else{
                mThis.dlgTitle.text("New Service Track");
            }
            mThis.setDataForm(d.data);
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ServiceTrackingComponent.init();
});