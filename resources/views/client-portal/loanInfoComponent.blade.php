<style>
    .loan-info-item {
        display: block;
        padding: 3px;
        margin-bottom: 3px;
    }

    .loan-info-label {
        width: 120px;
        color: #B6BDBD;
        display: inline-block;
        text-align: right;
        font-size: 1.2em;
        padding: 3px;
    }

    .loan-info-value {
        color: #4D4C4C;
        display: inline-block;
        padding: 3px;
        font-size: 1.2em;
    }

    .loan-info-value::before {
        content: ': ';
    }

    .card-loan-info {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #3BE5E3;
    }

</style>
<div id="_bor_loanInfoComponent" style="display:none">
    <div style="width:100%;">
        <span id="_bor_loaninfo_title" class="component-title">Student Loan Information</span>
    </div>

    <div class="container pt-3" style="overflow:hidden">
        <div><span style="font-weight:bold;font-size:1.2em;display:inline-block;">Loan number: 6576877</span></div>
        <div class="card-loan-info"
            style="width:80%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;">
            <div style="margin-left:20px">

                <span class="loan-info-item">
                    <span class="loan-info-label">Name</span>
                    <span class="loan-info-value" data-field="borrower_name">$0</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">ID</span>
                    <span class="loan-info-value" data-field="student_code"></span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">Phone Number</span>
                    <span class="loan-info-value" data-field="phone_number"></span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">National ID</span>
                    <span class="loan-info-value" data-field="address"></span>
                </span>

            </div>

            <div style="margin-left:20px">

                <span class="loan-info-item">
                    <span class="loan-info-label">Principal</span>
                    <span class="loan-info-value" data-field="principal">$0</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">Monthly Rate</span>
                    <span class="loan-info-value" data-field="monthly_interest_rate">0%</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">First Pmt Date</span>
                    <span class="loan-info-value" data-field="first_pmt_date">$0</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">Min. Installment</span>
                    <span class="loan-info-value" data-field="minimum_installment">$0</span>
                </span>

            </div>

            <div style="margin-left:20px">
                <span class="loan-info-item">
                    <span class="loan-info-label">Principal Paid</span>
                    <span class="loan-info-value" data-field="principal_paid">$0</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">Penalty Due</span>
                    <span class="loan-info-value" data-field="penalty_due">$0</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">Interest Due</span>
                    <span class="loan-info-value" data-field="interest_due">$0</span>
                </span>

                <span class="loan-info-item">
                    <span class="loan-info-label">Outs. Balance</span>
                    <span class="loan-info-value" data-field="outstanding_balance">$0</span>
                </span>

            </div>


        </div>
    </div>
</div>
<script async src="{{ asset('js/borrower/LoanInfoComponent.js') }}"></script>
