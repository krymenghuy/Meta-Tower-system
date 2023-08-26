<div id="_main_paymentPendingComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 rounded-3 bg-white">
        <div class="width--search-inner">
            <select id="_ppd_search" class="modal-select2"></select>
        </div>
    </div>
    <div id="_ppd_tbl" class="table-responsive p-3 bg-white rounded-3 mt-3"></div>
</div>

<div class="modal fade" id="dlg_ppd_" tabindex="-1" aria-labelledby="dlg_ppd_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title trans-text" data-langprop="titles.Preview Payment"></h1>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="pmt_option_id" class="form-label trans-text" data-langprop="titles.Payment Option"></label>
                    <div class="width-select-dialog">
                        <select id="dlg_ppd_pmt" class="modal-select2 data-input" data-field="pmt_option_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="session_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="level_id"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="start_date" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                    <input data-select="datepicker" class="form-control data-input" data-field="start_date"/>
                </div>
                <div class="form-group">
                    <label for="months" class="form-label trans-text" data-langprop="titles.Months"></label>
                    <input type="number" class="form-control data-input" data-field="months"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_ppd_btn_save" type="button" class="btn btn-primary btn-sm btn-animate">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>