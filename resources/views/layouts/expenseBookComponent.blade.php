<div id="_main_expenseBookComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_epb_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text text-nowrap" data-langprop="buttons.Add New"></span>
                </div>
            </button>
            <div class="input-group flex-nowrap">
                <input type="search" class="form-control custom-width" id="_epb_search_input"/>
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="titles.Search"></span>
                </div>
            </div>
        </div>
        <div class="flat-box" style="margin:17px; padding:15px; overflow:auto; min-height:350px">
            <table class="table header-light-blue header-uppercase table-hover" id="_epb_tblExpenseBook"></table>
        </div>
    </div>
</div>

<!--Begin::ExpenseBookDialog-->
<div id="_epb_dlgExpenseBook" class="modal fade" tabindex="-1" aria-labelledby="_epb_dlgExpenseBook_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_epb_dlgExpenseBook_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="payee" class="form-label trans-text" data-langprop="expenses.Payee"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-solid fa-user"></i>
                            </div>
                            <select class="modal-select2 data-input" data-field="payee" data-required="1" data-ffield="Payee"></select>
                            <div class="input-group-text">
                                <i class="fa-solid fa-plus"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="paymentAccount" class="form-label trans-text" data-langprop="expenses.Payment Account"></label>
                        <select class="modal-select2 data-input" data-field="payment_account" data-required="1" data-ffield="Payment Account"></select>
                    </div>
                    <div class="col-lg-3 d-flex align-items-end">
                        <label for="balance" class="form-label trans-text" data-langprop="expenses.Balance"></label>
                        <p class="ms-3 mb-1">0.00 USD</p>
                    </div>
                    <div class="col-lg-3 d-flex justify-content-center">
                        <div class="d-block">
                            <label for="amount" class="form-label trans-text border-2 border-success border-bottom pe-4" data-langprop="expenses.Amount"></label>
                            <p class="fs-5 fw-bold">0.00 USD</p>
                        </div>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="paymentDate" class="form-label trans-text" data-langprop="expenses.Payment Date"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <input data-select="datepicker" class="form-control data-input" data-field="payment_date" data-required="1" data-ffield="Payment Date"/>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="paymentMethod" class="form-label trans-text" data-langprop="expenses.Payment Method"></label>
                        <select class="modal-select2 data-input" data-field="payment_method" data-required="1" data-ffield="Payment Method"></select>
                    </div>
                    <div class="col-lg-3">
                        <label for="referenceNumber" class="form-label trans-text" data-langprop="expenses.Reference Number"></label>
                        <input type="text" class="form-control data-input" data-field="reference_number" data-required="1" data-ffield="Reference Number" placeholder="Reference Number"/>
                    </div>
                </div>
                <div class="py-3" id="_epb_panel"></div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="description" class="form-label trans-text" data-langprop="expenses.Description"></label>
                        <textarea class="form-control data-input" data-field="description" data-required="1" data-ffield="Description" placeholder="Description"></textarea>
                    </div>
                </div>
                <div class="dialog-error" id="_epb_dlgExpenseBook_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_epb_dlgExpenseBook_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--End::ExpenseBookDialog-->