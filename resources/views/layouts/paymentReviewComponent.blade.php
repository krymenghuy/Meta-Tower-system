<div id="_main_paymentReviewComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 rounded-3 bg-white">
        <div id="_ppd_filer_form" class="d-flex gap-2 justify-content-start">
            <select id="_ppd_filter_term" class="modal-select2 filter-field" data-field="term_id"></select>
            <select id="_ppd_filter_campus" class="modal-select2 filter-field" data-field="campus_id"></select>
            <select id="_ppd_filter_status" class="modal-select2 filter-field" data-field="status_id"></select>
        </div>
    </div>
    <div id="_ppd_tbl" class="table-responsive p-3 bg-white rounded-3 mt-3 table-responsive-hover"></div>
</div>

<div class="modal fade" id="dlg_ppd_" tabindex="-1" aria-labelledby="dlg_ppd_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title trans-text" data-langprop="titles.Calculate Tuition"></h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                        <div class="form-group col-lg-6">
                            <label for="pmt_option_id" class="form-label trans-text" data-langprop="titles.Payment Option"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_ppd_pmt" class="modal-select2 data-input pmt-factor" data-field="pmt_option_id"></select>
                            </div>
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Grade"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input pmt-factor" data-field="level_id"></select>
                            </div>
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input pmt-factor" data-field="session_id"></select>
                            </div>
                        </div>

                        <div class="form-group" style="display:none" id="_dppt_discount_panel">
                           <div class="d-flex flex-row">
                               <div class="d-flex flex-column"><span class="p-2">Price List</span> <span class="p-2 discount-field" data-field="price_list_name"></span></div>
                               <div class="d-flex flex-column"><span class="p-2">Monthly Tuition</span> <span class="p-2 discount-field" data-field="monthly_tuition"></span></div>
                               <div class="d-flex flex-column"><span class="p-2">Policy Discount</span> <span class="p-2 discount-field" data-field="policy_discount"></span></div>
                               <div class="d-flex flex-column"><span class="p-2">Special Discount</span> <span class="p-2 discount-field" data-field="special_discount"></span></div>  
                               <div class="d-flex flex-column"><span class="p-2">Other Discount</span> <span class="p-2 discount-field" data-field="other_discount"></span></div>  
                           </div>
                        </div>
                        
                        <div class="form-group col-lg-6" id="_ppd_startdate_panel">
                            <label for="start_date" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                            <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                        </div>
                        <!-- <div class="form-group custom-pmt-field">
                            <label for="months" class="form-label trans-text" data-langprop="titles.Months"></label>
                            <input type="number" class="form-control data-input" data-field="months"/>
                        </div> -->
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_ppd_btn_save" type="button" class="btn btn-primary btn-sm btn-animate">
                    <span class="trans-text" data-langprop="buttons.Calculate"></span>
                </button>
            </div>
        </div>
    </div>
</div>