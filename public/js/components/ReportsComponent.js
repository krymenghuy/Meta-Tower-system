'use strict'
var ReportsComponent = new function() {
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_reportsComponent');
    this.elStartDate =$('#_rpt_filter_startdate');
    this.elEndDate =$('#_rpt_filter_enddate');
    this.is_daily_report = false;
    this.elReport = $('#rpt_report');
    this.btnRunReport = $('#_rpt_btnRunReport');
    this.btnExcel = $('#_rpt_btnExport_excel');

    this.filterPanel = $('#_rpt_filter_panel');
    this.elFilter_loan = $('#_rpt_filter_loan');
    this.elFilter_user = $('#_rpt_filter_user');
    this.elDateRange = $('#_rpt_filter_daterange');
    //this.elFilter_month = $('#_rpt_filter_month');  
    this.showRelevantFilters = (cls_report_name, show=false)=>{
       if(show)
          mThis.filterPanel.find(['.',cls_report_name].join('')).show();
       else 
          mThis.filterPanel.find(['.',cls_report_name].join('')).hide();

    }

    this.showFilter_dates = (show=false)=>{
        $('#_opt_filter_dates').css('display',show?'block':'none');
    }

    this.loadReport_filters = ()=>{
        post_ajax(`${mThis.base_url}/api/settings/report-filter-options`,null,(d)=>{
            if(d){
                let loans = StringSanitizer.sanitizeObject(d.loans);
                let staffs = StringSanitizer.sanitizeObject(d.staffs);
                VSUtil.setComboItems(mThis.elFilter_loan,loans,'id','loan_name',true,'(All Loans)',0);
                mThis.elFilter_loan.trigger('change');

                VSUtil.setComboItems(mThis.elFilter_user, staffs,'id','staff_name',true,'(All Staff)',0);
                mThis.elFilter_user.trigger('change');
            }
        });
    }

    this.init = ()=>{
        mThis.loadReport_filters();

        mThis.elReport.on('change',function(e){
            let report_name = $(this).val();
            let show = (report_name =='rpt_loan_collections');
            //report_name is css class such as rpt_loans or rpt_loan_collections
            mThis.showRelevantFilters(report_name,show);
        });

        mThis.elDateRange.on('change',function(e){
            mThis.showFilter_dates($(this).val() ==1);
        });

        this.btnExcel.on('click',function(){
             let rpt_name =mThis.elReport.val();
             let use_all_dates = (mThis.elDateRange.val()==1)? 0:1;
             let loan_name = mThis.elFilter_loan.find('option:selected').text();
             //let sel_month = mThis.elFilter_month.val();
             let p = {'rpt_name':rpt_name,'start_date':mThis.elStartDate.val(),'end_date':mThis.elEndDate.val(),'use_all_dates':use_all_dates,'user_id':mThis.elFilter_user.val(), 'loan_id':mThis.elFilter_loan.val(),'loan_name':loan_name};
             post_ajax(`${mThis.base_url}/api/loan/rpt-export-data-excel`,p,(data)=>{
                 if(data){
                    if (data[0]) JsonToExcel.exportToExcel(data,rpt_name); else cv_interact.alert('No data for reporting!');
                 }
             });           
        });

        this.btnRunReport.on('click',function(){
            let use_all_dates = (mThis.elDateRange.val()==0)?1:0;
            let loan_name = mThis.elFilter_loan.find('option:selected').text();
            let p = {'start_date':mThis.elStartDate.val(), 'end_date':mThis.elEndDate.val(),'use_all_dates':use_all_dates,'loan_id':mThis.elFilter_loan.val()}; 
            let rpt_name = mThis.elReport.val();
            if (!DateHelper.isDate(p.start_date) || !DateHelper.isDate(p.start_date)){
                p.start_date=null;
                p.end_date= null;
                p.use_all_dates =1;
            }
            let uid = mThis.elFilter_user.val();
            let params = ['rtype=',rpt_name,'&wid=','&startdate=',p.start_date,'&enddate=',p.end_date,'&usealldates=',p.use_all_dates,'&loanid=',p.loan_id,'&loanname=',loan_name,'&uid=',uid].join('');
            pdfReport.getEncryptData(encodeURI(params),(d)=>{
                window.open([mThis.base_url,'/gen_report/',d].join(''),'_blank'); 
            });
        });
    }

    this.show = (option)=>{
       if (!option) option = {};
       mThis.elScreenTitle.html(option.title); 
       mThis.reportGroup = option.reportGroup; // {'General','Financials'}
       if ((mThis.reportGroup+'').toLowerCase() =='general') mThis.is_daily_report =1;
       mThis.self.show().siblings().hide();
    }
}

$(document).ready(()=>{
    ReportsComponent.init();
});
