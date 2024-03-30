<style>
    .report-wrapper {
        border: 1.5px dotted grey;
        border-radius: 7px;
        padding: 15px;
        display: flex;
        flex-direction: row;
    }

    .div-table {
        display: block;
    }

    .div-row {
        display: block;
    }

    .div-cell {
        display: inline-block;
    }

    .report-text {
        color: #000;
        font-size: 1.1em;
        padding: 5px;
        font-weight: bold;
        display: inline-block;
        cursor: pointer;
    }

    .report-icon {
        width: 35px;
    }

    .report-selected i .report-text {
        color: green;
    }

    .report-selected .report-text {
        color: green !important;
    }

    .no-filter-text-wrapper {
        padding: 15px;
        text-align: center;
    }

    .selected-report-name {
        display: block;
        padding: 3px;
        text-align: left;
        font-weight: bold;
        color: orange;
        font-size: 1.2em;
        width: 90%;
        margin-top: -10px;
    }
</style>

<div id="_rpc_reportCenterComponent" style="display:none;padding:15px">
    <div class="d-flex p-3 bg-white rounded-3 border">
        <div class="row w-100">
            <div class="col-lg-6">
                <div class="report-wrapper w-100 justify-content-between">
                    <div class="div-table w-100 text-dark" id="_rpc_reportlist"></div>
                    <div class="d-flex align-items-center justify-content-center w-100 h-100">
                        <img src="{{ asset('assets/images/icons/report.png') }}" alt="" style="width:12vw" />
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="report-wrapper">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-column">
                            <div class="w-100 p-2">
                                <span id="_rpc_selected_report_name" class="selected-report-name"></span>
                            </div>
                            <div class="row" id="_rpc_filter_fields"></div>
                        </div>
                        <div class="rpt-filter-footer d-flex gap-2">
                            <button type="button" id="_rpc_btnExport" class="btn btn-sm btn-outline-success">
                                <i class="fa fa-file-excel fs-5"></i>
                                <span>Export</span>
                            </button>
                            <button type="button" id="_rpc_btnRunReport" class="btn btn-sm btn-outline-primary">
                                <i class="fa fa-list-alt fs-5"></i>
                                <span>Run Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>