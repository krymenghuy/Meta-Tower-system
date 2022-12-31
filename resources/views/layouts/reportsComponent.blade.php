<style>
    .rpt-filter-panel {
        width: 50%;
        height: 100%;
        margin-top: 10px;
        border: 0.8px solid #E1E7E6;
        border-radius: 8px;
        padding: 20px;
    }

    .rpt-date-range {
        display: flex;
        flex-direction: row;
        align-items: justify-content;
    }

</style>
<div id="_main_reportsComponent" style="display:none;width;100%;background:#fff;">
    <div style="height:35px"></div>
    <div id="_rpt_filter_panel" style="border:1.1px solid #84E4EF;padding:3px;margin:35px;border-radius:5px">
        <div style="margin:35px;width:100%">
            <span class="simple-label">Select report</span>
            <div style="width:90%">
                <select id="rpt_report" class="modal-select2" id="_rpt_report_id">
                    <!-- <option value="rpt_loan_apps">Loan Applications</option> -->
                    <option value="rpt_loans">Active loans</option>
                    <option value="rpt_finished_loans">Finished loans</option>
                    <option value="rpt_loan_collections">Loan Collections</option>
                    <option value="rpt_borrowers">Active Borrowers</option>
                    <!-- <option value="rpt_adjustments"> Adjustments Report</option> -->
                    <option value="rpt_never_pay">Never-pay loans</option>
                    <option value="rpt_first_pmt_due"> First Payment Due (in 15 days)</option>
                </select>
            </div>

        </div>
        <div style="margin:35px;width:100%;">

            <div class="form-inline" style="margin-top:15px">
                <label>Date Range: </label>&nbsp;
                <select class="form-control" id="_rpt_filter_daterange"
                    style="border:1.5px solid grey;-webkit-border:1.5px solid grey;font-weight:bold;border-radius:5px;">
                    <option value="1">Date to Date</option>
                    <option value="0">All Dates</option>
                </select>
            </div>

            <div class="div-line" style="border-color:#C2EEEC;width:50%;border-width:0.8px;margin-top:5px;"></div>

            <div class="form-inline" id="_opt_filter_dates">
                <div>
                    <span class="simple-label">From</span>
                    <div><input id="_rpt_filter_startdate" class="form-control" data-select="datepicker"></div>
                </div>
                <div style="width:35px"></div>
                <div>
                    <span class="simple-label">To</span>
                    <div><input id="_rpt_filter_enddate" class="form-control" data-select="datepicker"></div>
                </div>
            </div>

            <div class="form-inline">
                <div class="rpt_loan_collections" style="display:none">
                    <span class="simple-label">Select loan</span>
                    <div><select class="select2" id="_rpt_filter_loan"></select></div>
                </div>

                <div class="rpt_loan_collections rpt_adjustments" style="display:none">
                    <span class="simple-label">Receiver</span>
                    <div><select class="select2" id="_rpt_filter_user"></select></div>
                </div>
            </div>

            <div class="form-inline" style="margin-top:20px;width:100%">
                <!-- <button id="rpt_btnReset" type="button" class="btn btn-default"> Reset</button>               -->
                <button id="_rpt_btnRunReport" type="button" class="btn btn-primary" style="float:right"><i
                        class="fa fa-list-alt"></i> Run Report</button>
                &nbsp; &nbsp;
                <button id="_rpt_btnExport_excel" type="button" class="btn btn-success" style="float:right"><i
                        class="fa fa-file-excel"></i> Excel</button>
            </div>

        </div>
    </div>
</div>
<script async src="{{ asset('js/ReportsComponent.js') }}"></script>
