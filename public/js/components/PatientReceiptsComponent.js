let PatientReceiptsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Patient Receipts';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_patientReceiptsComponent');
    this.btnNew = $('#_pdc_btnNew');
    //this.elSearchItem = $('#_pcd_search');
    // this.elFilter_department = $('#_msl_filter_service');
    //this.tblItems = $('#_pdc_tblItem');
    
    this.init = () => {}

    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        mThis.self.show().siblings().hide();
    }
}

$(document).ready(function() {
    PatientReceiptsComponent.init();
});