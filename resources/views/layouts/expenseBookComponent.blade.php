<div id="_main_expenseBookComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2">
            <button class="vs-btn-custom-primary" type="button" id="_epb_btnNew">
                <span class="trans-text text-nowrap" data-langprop="buttons.New Expense"></span>
            </button>
            <div class="input-group flex-nowrap">
                <input type="search" class="form-control custom-width" id="_epb_search_input"/>
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="titles.Search"></span>
                </div>
            </div>
        </div>
        <div>
            <table class="table" id="_epb_tblExpenseBook"></table>
        </div>
    </div>
</div>

<!--Begin::ExpenseBookDialog-->
<div id="_epb_dlgExpenseBook" class="modal fade" tabindex="-1" aria-labelledby="_epb_dlgExpenseBook_title" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_epb_dlgExpenseBook_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-3">
                        <label for="payee" class="form-label trans-text" data-langprop="expenses.Payee"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-solid fa-user"></i>
                            </div>
                            <select class="modal-select2"></select>
                            <div class="input-group-text">
                                <i class="fa-solid fa-plus"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="paymentAccount" class="form-label trans-text" data-langprop="expenses.Payment Account"></label>
                        <select class="modal-select2"></select>
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
                <div class="row gy-2">
                    <div class="col-lg-3">
                        <label for="paymentDate" class="form-label trans-text" data-langprop="expenses.Payment Date"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <input data-select="datepicker" class="form-control"/>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="paymentMethod" class="form-label trans-text" data-langprop="expenses.Payment Method"></label>
                        <select class="modal-select2"></select>
                    </div>
                    <div class="col-lg-3">
                        <label for="referenceNumber" class="form-label trans-text" data-langprop="expenses.Reference Number"></label>
                        <input type="text" class="form-control" placeholder="Reference Number"/>
                    </div>
                </div>
                <div class="dialog-error" id="_epb_dlgExpenseBook_error"></div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_epb_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--End::ExpenseBookDialog-->