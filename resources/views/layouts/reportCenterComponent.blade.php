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

    /* .report-name:hover{
        color:orange;
    } */
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
    <div class="container-fluid" style="padding:35px;">
        <div class="row">
            <div class="col-lg-6">
                <div class="report-wrapper" style="margin-bottom:15px">
                    <div class="div-table" id="_rpc_reportlist">

                    </div>
                    <div style="position:absolute;width:35%;height:90%;right:0"><img
                            src="{{ asset('assets/images/icons/report.png') }}" alt=""
                            style="width:12vw;float:right;margin-right:10%;opacity:0.7"></div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="report-wrapper" style="height:35vw">
                    <div class="row" id="_rpc_filter_fields">
                        <div style="width:100%">
                            <span id="_rpc_selected_report_name" class="selected-report-name">Loans</span>
                        </div>
                        <div id="_rpc_no_filter_text_wrapper" class="form-group col-lg-12 no-filter-text-wrapper"
                            style="display:none">
                            <div class="alert alert-primary">
                                No filter required :)
                            </div>
                        </div>

                        <div class="form-group col-lg-12">
                            <label for="">User</label>
                            <div><select id="_rpc_filter_user" class="modal-select2 rpt-filter" data-field="user_id"
                                    data-used="1"></select> </div>
                        </div>

                        <div class="form-group col-lg-12">
                            <label for="">Loan Type</label>
                            <div><select id="_rpc_filter_loantype" class="modal-select2 rpt-filter"
                                    data-field="loan_type_id"></select> </div>
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="">From</label>
                            <div><input id="_rpc_filter_startdate" data-select="datepicker"
                                    class="form-control rpt-filter" data-field="start_date"></div>
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="">To</label>
                            <div><input id="_rpc_filter_enddate" data-select="datepicker"
                                    class="form-control rpt-filter" data-field="end_date"></div>
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="">Maturity Date</label>
                            <div><select id="_rpc_filter_maturitydate" class="modal-select2 rpt-filter"
                                    data-field="maturity_date"></select></div>
                        </div>


                        <div class="form-group col-lg-12">
                            <div class="form-inline" style="margin-left:25%">
                                <button style="display:none" type="button" id="_rpc_btnExport"
                                    class="btn btn-sm btn-outline-success"><i class="fa fa-file-excel"></i>
                                    Export</button>&nbsp;
                                <button type="button" id="_rpc_btnRunReport" class="btn btn-sm btn-outline-primary"> <i
                                        class="fa fa-list-alt"></i> Run Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div style="height:15px;"></div>
        <div class="row">
            <div class="col-lg-6">

            </div>
        </div>
    </div>
    <!--close div.container-fluid -->
</div>
