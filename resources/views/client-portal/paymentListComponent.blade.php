<style>
    #_bor_tblPmts th {
        font-size: 1.1em;
        font-weight: normal !important;
        font-weight: bold;
        border-bottom: 1.2px solid orange;
    }

    #_bor_tblPmts td {
        font-size: 1em;
    }

    .loan-info-item {
        padding: 3px;
        display: flex;
        flex-direction: row;
        align-items: justify;
    }

    .loan-info-item .item-label {
        display: inline-block;
        padding: 3px;
        font-size: 1.1em;
        color: grey;
    }

    .loan-info-item .item-value {
        padding: 3px;
        font-size: 1.1em;
        color: #000;
        display: inline-block;
    }

    .pmt-table-title,
    .borrower-name {
        display: table;
        margin: 0 auto;
    }

    .pmt-table-title {
        color: #000;
        font-size: 1.8em;
        font-weight: bold;
    }

    .borrower-name {
        color: green;
        font-size: 1.5em;
    }

</style>
<div id="_bor_paymentListComponent" style="display:none">
    <div class="container pt-3">
        <div style="width:100%;"><span id="_bor_payments_title" class="pmt-table-title">Student Grant Loan
                Payments</span></div>
        <div style="width:100%;"><span id="_bor_borrwer_name" class="borrower-name"></span></div>

    </div>
    <div class="container pt-3" style="overflow:hidden">
        <div class="form-inline" style="float:left;margin-left:15px;">
            <div><select class="select2" id="_bor_pmts_filter_loan"></select></div>
            <div> <input type="text" class="form-control" id="_bor_search_pmt"
                    placeholder="Search receipt number/ date"></div>
            &nbsp;&nbsp;<button id="btnRefresh" type="button" class="btn btn-primary"><i class="fas fa-list-alt"></i>
                Refresh</button>
            &nbsp;&nbsp;<button type="button" id="btnChangePwd" class="btn btn-success"><i class="fa fa-lock"></i>
                Change Password</button>
        </div>
    </div>

    <div class="container pt-3" style="overflow:hidden">
        <div id="_bor_loan_info_fields"
            style="display:flex;flex-direction:row;border:1px solid grey; padding:5px;border-radius:5px;margin-left:15px;margin-right:15px">
            <div class="loan-info-item">
                <span class="item-label">
                    Principal
                </span>
                <span class="item-value" data-field="principal" data-disptype="currency">$0</span>
            </div>

            <div class="loan-info-item">
                <span class="item-label">
                    First pmt date
                </span>
                <span class="item-value" data-field="first_pmt_date" data-disptype="date"></span>
            </div>

            <div class="loan-info-item">
                <span class="item-label">
                    Min. installment
                </span>
                <span class="item-value" data-field="minimum_installment" data-disptype="currency">$0</span>
            </div>

            <div class="loan-info-item">
                <span class="item-label">
                    Principal paid
                </span>
                <span class="item-value" data-field="principal_paid" data-disptype="currency">$0</span>
            </div>

            <div class="loan-info-item">
                <span class="item-label">
                    Prin. Discount
                </span>
                <span class="item-value" data-field="discount_principal" data-disptype="currency">$0</span>
            </div>


            <div class="loan-info-item">
                <span class="item-label">
                    Penalty Due
                </span>
                <span class="item-value" data-field="penalty_due" data-disptype="currency">$0</span>
            </div>

            <div class="loan-info-item">
                <span class="item-label">
                    Outs. Balance
                </span>
                <span class="item-value" data-field="outstanding_balance" data-disptype="currency">$0</span>
            </div>

        </div>
    </div>

    <div class="container pt-3 table-responsive">
        <table id="_bor_tblPmts" class="table table-hover" style="width:100%">
        </table>
    </div>
</div>

<!--begin::changePwd-->
<div class="modal fade" id="_dlgChangePwd" tabindex="-1" role="dialog" aria-labelledby="_dlgChangePwd_title"
    aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_dlgChangePwd_title">Change Password</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-form-label">Old Password</label>
                    <input id="_cpwd_old_password" type="password" class="form-control">
                </div>

                <div class="form-group">
                    <label class="col-form-label">New Password</label>
                    <input id="_cpwd_password" type="password" class="form-control">
                </div>

                <div class="form-group">
                    <label class="col-form-label">Confirm Pwd</label>
                    <input id="_cpwd_confirm" type="password" class="form-control">
                </div>
                <div>
                    <span id="_dlgChangePwd_error" style="color:red"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="_dlgChangePwd_btnOK">Change Now</button>
            </div>
        </div>
    </div>
</div>
<!--end::ChangePwd -->

<script src="{{ asset('js/borrower/PaymentListComponent.js') }}"></script>
