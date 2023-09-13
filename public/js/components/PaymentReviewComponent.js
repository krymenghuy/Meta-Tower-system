"use strict";
var PaymentReviewComponent = new function(){
    let mThis = this;
    this.title_prop = "Tuition Payments";
    this.self = main_view.appContent.children("#_main_paymentReviewComponent");

    this.filter_form = this.self.find('#_ppd_filer_form');
    this.elFilter_campus = this.filter_form.find("#_ppd_filter_campus")
    this.elFilter_status = this.filter_form.find("#_ppd_filter_status");
    this.elFilter_term = this.filter_form.find('#_ppd_filter_term');
    
    let cur_symbol = "$";
    this.cols = [
        {
            title: "Name",
            className: 'text-capitalize',
            data: (data,index,tr)=>{
                const new_student = data.is_new_student ==1? ['<span class="p-1 border rounded-5 border-warning">New</span>'].join(''): ['<span class="p-1 border rounded-5 border-warning">Old</span>'].join('');
                return ['<span class="fw-bold d-block p-1 mb-1">',data.name,'</span>',new_student].join('');
            },
        },
        {
            title: "Grade",
            className: '',
            data: (data,index,tr)=>{
                return ['<span class="d-block p-1">',data.level_name,'</span>'].join('');
            },
        },
        {
            title: "Tuition",
            data: (data, a, b) => {
                return [cur_symbol, data.tuition].join(" ");
            },
        },
        {
            title: "Tuition Due",
            data: (data, a, b) => {
                return [cur_symbol, data.tuition_due].join(" ");
            },
        },
        {
            title: "Tuition Paid",
            data: (data, a, b) => {
                return [cur_symbol, data.tuition_paid].join(" ");
            },
        },
        {
            title: "Status",
            data: (data, a, b) => {
                let cls = data.status === "pending" ? "bg-danger" : data.status === "verified" ? "bg-info" : data.status === 'expired' ? "bg-danger" : "bg-success";
                return [`<span class="p-2 ${cls} text-white rounded-3 text-capitalize"> ${data.status}</span>`].join('');
            },
        },
        {
            title: "Action",
            data: (data, a, b) => {
                let cls = data.status === "paid" ? "d-none" : "";
                return [`<div class="d-flex gap-2">
                    <a href="javascript:void(0)" class="btn-calculate-fee btn btn-sm btn-success ${cls} trans-text" data-langprop="titles.Calculate Tuition" data-isnewstudent="${data.is_new_student}" data-id="${data.id}">
                         Calculate Tuition
                    </a>
                </div>`].join('');
            },
        },
    ];
 
    this.init = () => {
        mThis.studentListView = new ListView("_ppd_tbl", {
            fetchApi: `${main_view.base_url}/api/tuition-review/list-paginate`,
            columns: mThis.cols,
            tableClass: "table header-light-blue header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
            },
            beforeRender: () => {},
        });

        mThis.tblPaymentPending = mThis.studentListView.getTable();

        mThis.tblPaymentPending.addEventListener("click",function (e) {
            e.preventDefault();
            let lnk = VSUtil.clickOnClass(e.target,'btn-calculate-fee');
            if(lnk){
                let op = {
                    id:lnk.dataset.id,
                    is_new_student:lnk.dataset.isnewstudent, 
                    onClose: () => {
                        mThis.studentListView.showPage(mThis.getFilterData());
                    },
                };
                TuitionCalculateDialog.show(op);
                return;
            }
            
        });

        mThis.filter_form.on('change','.filter-field',e=>{
           //const el = e.target;
           if(!mThis.disable_filter) mThis.studentListView.showPage(mThis.getFilterData());
        });
    };

    this.getFilterData = ()=>{
        let p = {};
        mThis.filter_form.find('.filter-field').each(function(){
            const el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.prepareOptions = (onFinish) => {
        mThis.disable_filter = true;
        vsapi.call(`${main_view.base_url}/api/tuition-review/form-options`,null,null).then((res) => {
            let d = res.status_code === 200? res.data: {};
            console.log(d);
            VSUtil.setComboItems(mThis.elFilter_term,d.terms,"id","term_name",null,null,d.terms[0].id);
            VSUtil.setComboItems(mThis.elFilter_status,d.pmt_statuses,"id","pmt_status",null,null,1);
            VSUtil.setComboItems(mThis.elFilter_campus,d.campuses,"id","campus_name",null,null,d.campuses[0]?d.campuses[0].id:null);
            mThis.disable_filter = false;
            onFinish();
        });
    };

    this.show = (options) =>{
        if (!options) options = {};

        mThis.prepareOptions(()=>{
            mThis.studentListView.showPage(mThis.getFilterData(), null,()=>{
                main_view.setTitle(mThis.title_prop);
                let x = mThis.self.siblings(":visible");
                x.hide();
                mThis.self.hide().fadeIn(200);
            });
        });
    };

};

const TuitionCalculateDialog = new function(){
    let mThis = this;
    this.self = main_view.appContent.find("#dlg_ppd_");
    this.options = {};
    let ref = {
        click: true
    };

    //btn Caculate Tuition Fee   
    this.btnSave = mThis.self.find("#dlg_ppd_btn_save");
    this.elPmtOption = mThis.self.find("#dlg_ppd_pmt");
    //input Panel DIV
    this.modalBody = mThis.self.find(".modal-body .row");
    this.discountPanel = this.self.find('#_dppt_discount_panel');
    this.startDatePanel  = this.modalBody.find('#_ppd_startdate_panel');

    mThis.elPmtOption.on("change",e=>{
        e.preventDefault();
        const el = e.target;
        const pmt_option_id = el.value;

        if(pmt_option_id > 3){
           const sel_option = el.options[el.selectedIndex];  
           mThis.modalBody.find('div.custom-pmt-field').each(function(){
            $(this).remove();
           });

           if(sel_option){ 
                const f_name = sel_option.text;
                mThis.modalBody.append([`<div class="form-group custom-pmt-field">
                    <label for="${f_name}" class="form-label text-capitalize">${f_name}</label>
                    <div><input type="number" class="form-control pmt-period" /></div>
                </div>`].join(''));
           }; 
          
        }else {
            //alert( mThis.modalBody.find('div.customer-pmt-field').length);
            mThis.modalBody.find('div.custom-pmt-field').each(function(){
                 $(this).remove();
            });
        }

        // vsapi.call(`${main_view.base_url}/api/settings/payment-options`,op,null,false).then((res) => {
        //     if(res.status_code === 200){
        //         console.log(res.data);
        //         let div = mThis.modalBody.children().last();
        //         div.after([`<div class="form-group">
        //             <label for="${res.data.name}" class="form-label text-capitalize">${res.data.name}</label>
        //             <input type="number" class="form-control data-input" data-field="${res.data.name}"/>
        //         </div>`].join(''));
        //         if(div.length > 0)
        //             div.remove();
        //     }
        // });
    });

    mThis.btnSave.on("click", function(e){
        e.preventDefault();
        let p = mThis.getDataForm();
        if(ref.click){
            vsapi.call(`${main_view.base_url}/api/price-list/update/pending-payment`,p,null).then((res) => {
                ref.click = false;
                if(res.status_code === 200){
                    mThis.self.modal("hide");
                    if(typeof mThis.options.onClose === "function")
                        mThis.options.onClose();
                    ref.click = true;
                }
                else{
                    cv_interact.error(res.error_message);
                    ref.click = true;
                }
            });
        }
    });
  
    mThis.modalBody.on('change','.pmt-factor',e=>{
        const el = e.target;
        let op = mThis.getDataForm();
        op.is_new_student = mThis.options.is_new_student;
        op.enrollment_id = mThis.options.id;
        mThis.showDiscountInfo(op);
    });


    /** Show discount info for old student only 
    * params {'is_new_student','pmt_option_id','enrollment_id','session_id','level_id',[program_id]}
    */
        this.showDiscountInfo = (d)=>{
            d= d?d:{};
            if (d.is_new_student==1 || d.is_new_student==true){
              mThis.discountPanel.hide();
              mThis.showStartDate(true);
              return;
            }
            mThis.showStartDate(false);
            vsapi.call(`${main_view.base_url}/api/tuition-review/student-discount`,d,null,false).then(res=>{
                 let data = (res.status_code === 200)? res.data: {};
                 mThis.discountPanel.find('.discount-field').each(function(){
                     const el = $(this);
                     const f = el.data('field');
                     if(f === 'price_list_name'){
                       el.text(data[f]?data[f]:'Not Found!');
                     }else{
                        //if(data.discount_type =='percentage') 
                        el.text([data[f]?data[f]:0,'%'].join(''));
                        //else el.html([data[f]?data[f]:0,' <span><small>',data.currency_code,'</small></span>'].join(''));
                     }
                    
                 });
                 mThis.discountPanel.show();
            });
            
         }
    this.getDataForm = () => {
        let p = {
            id: mThis.options.id,
        };

        mThis.self.find(".data-input").each(function () {
            let el = $(this);
            let f = el.data("field");
            p[f] = el.val();
        });
        return p;
    };

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.self.find(".data-input").each(function () {
            let el = $(this);
            let f = el.data("field");
            if(el.is("select"))
                el.val(d[f]).trigger("change");
            else
                el.val(d[f]);
        });
    };

    this.prepareFormOption = (id,onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/tuition-review/form-options`,{'id':id},null).then(res => {
            const d =res.status_code === 200? res.data: {};
            mThis.self.find(".data-input").each(function () {
                let el = $(this);
                let f = el.data("field");
                switch (f) {
                    case "pmt_option_id":
                        VSUtil.setComboItems(el,d.pmt_options,"id","pmt_option",null,null,null);
                        break;
                    case "session_id":
                        VSUtil.setComboItems(el,d.sessions,"id","session_name",null,null,null);
                        break;
                    case "level_id":
                        VSUtil.setComboItems(el,d.levels,"id","level_name",null,null,null);
                        break;
                    default:
                        break;
                }
            });
            onFinish(d);
        });
    };

    this.showStartDate = (e)=>{
        if(e) mThis.startDatePanel.show();
        else mThis.startDatePanel.hide();
    }

    // this.loadFormDetails = (options) => {
    //     vsapi.call(`${main_view.base_url}/api/price-list/pending-payment/details`,{ id: options.id },null).then((res) => {
    //         let data = {};
    //         if(res.status_code === 200){
    //             data = res.data;
    //         }
    //         mThis.setDataForm(data);
    //     });
    // };
 
    /** @options = {id,is_new_student,level_id,session}*/
    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
        //Remove custom field => "Number of days | number of weeks| number of months"
       
        mThis.modalBody.find('div.custom-pmt-field').each(function(){
            $(this).remove();
        });

        //On Form show => hide discount panel first, and wait after user select Pmt_option => to show discount for Old student only
        mThis.showDiscountInfo({'is_new_student':1});

        mThis.prepareFormOption(options.id,(d) => {
            //mThis.loadFormDetails(options);
            // if(d.studentInfo){
                
            // }else{

            // }
            //mThis.setDataForm(d.enrollment_info);
            mThis.self.modal({
                backdrop: "static",
            });
        });
    };
};

window.addEventListener("DOMContentLoaded", () => {
    PaymentReviewComponent.init();
});
