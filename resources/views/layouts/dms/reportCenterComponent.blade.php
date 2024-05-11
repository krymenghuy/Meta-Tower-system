<style>
    .report-wrapper {
        border: 1.5px dotted grey;
        border-radius: 7px;
        padding: 15px;
        display: flex;
        flex-direction: row;
    }
    .rpc-report-icon{
        width:20px;
        height: 20px;
        border-radius: 3px;
        box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .rpc-reports{
        margin-left:25px;
    }
    .rpc-category-icon{
        width:20px;
        height: 20px;
        border-radius: 3px;
        box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.3);
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

    .report-selected {
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

<div id="_rpc_reportCenterComponent" class="m-3" style="display:none;">
    <div class="d-flex p-3 bg-white shadow-lg rounded-3 border">
        <div class="row w-100">
            <div class="col-lg-6 mb-2">
                <div class="report-wrapper w-100 justify-content-between">
                    <div class="div-table w-100 text-dark" id="_rpc_reportlist"></div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="report-wrapper">
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-column">
                            <div class="w-100 p-2">
                                <span id="_rpc_selected_report_name" class="selected-report-name text-nowrap text-center"></span>
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