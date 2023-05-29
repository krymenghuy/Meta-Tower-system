<style>
    .report-wrapper{
        border: 1.5px dotted grey;
        border-radius: 7px;
        padding: 15px;
        display: flex;
        flex-direction: row;
    }

    .div-table{
        display: block;
    }

    .div-row{
        display: block;
    }

    .div-cell{
        display: inline-block;
    }

    .report-text{
        color: #000;
        font-size: 1.1em;
        padding: 5px;
        font-weight: bold;
        display: inline-block;
        cursor: pointer;
    }

    .report-icon{
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
        padding-left: 15px !important;
        padding: 3px;
        text-align: left;
        font-weight: bold;
        color: orange;
        font-size: 1.2em;
        width: 90%;
        margin-top: -10px;
    }
</style>

<div id="_rpc_reportCenterComponent" class="mobile-padding" style="display:none">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-6">
                <div class="report-wrapper" style="margin-bottom:15px">
                    <div class="div-table" id="_rpc_reportlist"></div>
                    <div style="position:absolute;width:35%;height:90%;right:0">
                        <img src="{{ asset('assets/images/icons/report.png') }}" alt="" style="width:12vw;float:right;margin-right:10%;opacity:0.7"/>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="d-block report-wrapper" style="height:35vw">
                    <div class="row" id="_rpc_filter_fields"></div>
                    <div class="form-group col-lg-12">
                        <div class="d-flex align-items-center gap-2">
                            <button style="display:none" type="button" id="_rpc_btnExport" class="btn btn-sm btn-outline-success">
                                <i class="fa fa-file-excel"></i>
                                Export
                            </button>
                            <button type="button" id="_rpc_btnRunReport" class="btn btn-sm btn-outline-primary text-nowrap">
                                <i class="fa fa-list-alt"></i>
                                Run Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="height:15px;"></div>
        <div class="row">
            <div class="col-lg-6"></div>
        </div>
    </div>
</div>