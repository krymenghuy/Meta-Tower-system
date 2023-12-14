<div id="_main_reportsComponent" style="display:none;width:100%;background:#fff">
    <div style="margin:auto;width:90%">
        <div style="border:1.2px solid green;padding:15px;border-radius:3px;margin-top:35px">
            <div class="row">
                <div​ class="col-lg-6">
                    <span class="simple-label">Start Date</span>
                    <div>
                        <input id="_rc_filter_startdate" class="form-control" data-select="datepicker">
                    </div>
                    <span class="simple-label">End Date</span>
                    <div>
                        <input id="_rc_filter_enddate" class="form-control" data-select="datepicker">
                    </div>
                    <div style="height:15px"></div>
                    <button id="_rc_btnExportPacakges" class="btn btn-default">
                        <i class="fa fa-file-excel"></i>
                        Export
                    </button>
                    <button id="_rc_filter_btnRunReport" class="btn btn-primary">
                        <i class="fa fa-list-alt"></i>
                        Run Report
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script async src="{{ asset('js/ReportsComponent.js') }}"></script>