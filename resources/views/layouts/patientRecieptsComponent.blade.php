<div id="_main_patientRecieptsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_prc_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text" data-langprop="buttons.Add New"></span>
                </div>
            </button>
            <div class="d-flex align-items-center gap-2">
                <div class="input-group flex-nowrap">
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                    <input id="_prc_search" type="search" class="form-control custom-width" placeholder="Search..."/>
                </div>
                <button id="_prc_filtergroup" class="btn btn-outline-primary" type="button">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <button class="vs-btn-custom-secondary" type="button" id="_prc_btnExport">
                <span class="trans-text" data-langprop="buttons.Export"></span>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase" id="_prc_tblReciept"></table>
        </div>
    </div>
</div>

<div id="_prc_dlgReciept" class="modal fade" tabindex="-1" aria-labelledby="_prc_dlgReciept_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="moda-title" id="_prc_dlgReciept_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="patient" class="form-label trans-text" data-langprop="patient.Patient"></label>
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
                        <label for="email" class="form-label trans-text" data-langprop="patient.Email"></label>
                        <input type="text" class="form-control" placeholder="email..."/>
                    </div>
                    <div class="col-lg-3">
                        <label for="bilingAddress" class="form-label trans-text" data-langprop="patient.Billing Address"></label>
                        <textarea class="form-control" placeholder="Billing Address"></textarea>
                    </div>
                    <div class="col-lg-3">
                        <div class="d-flex align-items-center-center justify-content-center">
                            <div class="d-block">
                                <label for="amount" class="form-label fw-bold trans-text" data-langprop="patient.Amount"></label>
                                <p class="fw-bold">$ 0.00</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="receiptDate" class="form-label trans-text" data-langprop="patient.Receipt Date"></label>
                        <input data-select="datepicker" class="input-sm form-control" placeholder="Filter Date"/>
                    </div>
                    <div class="col-lg-3">
                        <div for="d-flex align-items-center gap-2">
                            <label for="paymentMethod" class="form-label trans-text" data-langprop="patient.Payment Method"></label>
                            <i class="fa-solid fa-plus text-primary"></i>
                        </div>
                        <select class="modal-select2"></select>
                    </div>
                    <div class="col-lg-3">
                        <label for="referenceNumber" class="form-label trans-text" data-langprop="patient.Reference Number"></label>
                        <input type="text" class="form-control" placeholder="reference number"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="depositeTo" class="form-label trans-text" data-langprop="patient.Deposite To"></label>
                        <select class="modal-select2"></select>
                    </div>
                </div>
                <div class="py-3" id="_receipt_panel"></div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="description" class="form-label trans-text" data-langprop="patient.Description"></label>
                        <textarea class="form-control"></textarea>
                    </div>
                    <div class="col-lg-6">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="d-block">
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="fw-bold trans-text text-nowrap" data-langprop="patient.Sub Total"></p>
                                    </div>
                                    <div class="col-6">
                                        <p class="fw-bold text-nowrap">$ 0.00</p>
                                    </div>
                                </div>
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="fw-bold trans-text text-nowrap" data-langprop="patient.Discount(%)"></p>
                                    </div>
                                    <div class="col-6">
                                        <input type="number" class="form-control form-control-sm invisable-input"/>
                                    </div>
                                </div>
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="fw-bold trans-text text-nowrap" data-langprop="patient.Tax"></p>
                                    </div>
                                    <div class="col-6">
                                        <p class="fw-bold text-nowrap">$ 0.00</p>
                                    </div>
                                </div>
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="fw-bold text-nowrap trans-text" data-langprop="patient.Grand Total"></p>
                                    </div>
                                    <div class="col-6">
                                        <p class="fw-bold text-nowrap">$ 0.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="messageOfReceipt" class="form-label trans-text" data-langprop="patient.Message Desplayed On Reciept"></label>
                        <textarea class="form-control"></textarea>
                    </div>
                </div>
                <div id="_prc_dlgReciept_error" class="dialog-error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_prc_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>