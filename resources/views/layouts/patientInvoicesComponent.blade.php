<div id="_main_patientInvoicesComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_pic_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text" data-langprop="patient.Add New"></span>
                </div>
            </button>
            <div class="d-flex align-items-center gap-2">
                <div class="input-group flex-nowrap">
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                    <input id="_pic_search" type="search" class="form-control custom-width" placeholder="search..."/>
                </div>
                <button id="_pic_group_filter" type="button" class="btn btn-outline-primary">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <button class="vs-btn-custom-secondary" type="button" id="_pic_btnExport">
                <span class="trans-text" data-langprop="patient.Export"></span>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px">
            <table class="table header-light-blue header-uppercase" id="_pic_tblInvoice"></table>
        </div>
    </div>
</div>

<div id="_pic_dlgInvoice" class="modal fade" tabindex="-1" aria-labelledby="_pic_dlgInvoice_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_pic_dlgInvoice_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="patient" class="form-label trans-text" data-langprop="patient.Patient"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-solid fa-user"></i>
                            </div>
                            <select class="modal-select2 data-input" data-field="patient" data-required="1" data-ffield="Patient">
                                <option value="1">Test</option>
                            </select>
                            <div class="input-group-text">
                                <i class="fa-solid fa-plus"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="email_address" class="form-label trans-text" data-langprop="patient.Email Address"></label>
                        <input type="email" class="form-control data-input" data-field="email_address" data-required="1" data-ffield="Email Address" placeholder="Email Address"/>
                    </div>
                    <div class="col-lg-3">
                        <label for="billing_address" class="form-label trans-text" data-langprop="patient.Billing Address"></label>
                        <textarea class="form-control data-input" data-field="billing_address" data-required="1" data-ffield="Billing Address" placeholder="Billing Address"></textarea>
                    </div>
                    <div class="col-lg-3">
                        <div class="d-block">
                            <label for="balance_due" class="form-label pe-4 border-2 border-bottom border-success trans-text" data-langprop="patient.Amount Due"></label>
                            <p class="fw-bold">$ 0.00</p>
                        </div>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <label for="invoice_date" class="form-label trans-text" data-langprop="patient.Invoice Date"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <input data-select="datepicker" class="form-control data-input" data-field="invoice_date" data-required="1" data-ffield="Invoice Date"/>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="terms" class="form-label trans-text" data-langprop="patient.Terms"></label>
                        <input type="text" class="form-control data-input" data-field="terms" data-required="1" data-ffield="Terms"/>
                    </div>
                    <div class="col-lg-3">
                        <label for="due_date" class="form-label trans-text" data-langprop="patient.Due Date"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <input data-select="datepicker" class="form-control data-input" data-field="due_date" data-required="1" data-ffield="Due Date"/>
                        </div>
                    </div>
                </div>
                <div class="py-3" id="_pic_panel"></div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="description" class="form-label trans-text" data-langprop="patient.Description"></label>
                        <textarea class="form-control data-input" data-field="description" data-required="1" data-ffield="Description" placeholder="Description"></textarea>
                    </div>
                    <div class="col-lg-6">
                        <div class="d-flex justify-content-center">
                            <div class="d-block">
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap">Sub Total</p>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-nowrap">$ 0.00</div>
                                    </div>
                                </div>
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap">Discount(%)</p>
                                    </div>
                                    <div class="col-6">
                                        <input type="number" class="form-control-sm data-input invisable-input" data-field="discount" data-required="0" data-ffield="Discount"/>
                                    </div>
                                </div>
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap">Tax</p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-nowrap">$ 0.00</p>
                                    </div>
                                </div>
                                <div class="row gy-2">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap">Grand Total</p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-nowrap">$ 0.00</p>
                                    </div>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="message_displayed_on_invoice" class="form-label trans-text" data-langprop="patient.Message Displayed On Invoice"></label>
                        <textarea class="form-control data-input" data-field="message_displayed_on_invoice" data-required="1" data-ffield="Message Displayed On Invoice" placeholder="Message Displayed On Invoice"></textarea>
                    </div>
                </div>
                <div id="_pic_dlgInvoice_error" class="dialog-error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_pic_dlgInvoice_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="_pic_dlgFilterInvoice" class="modal fade" tabindex="-1" aria-labelledby="_pic_dlgFilterInvoice_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_pic_dlgFilterInvoice_title" class="modal-title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-3">
                        <p class="trans-text" data-langprop="invoice.Start Date"></p>
                    </div>
                    <div class="col-9">
                        <input data-select="datepicker" id="_pic_dlgFilterInvoice_StartDate" class="form-control" placeholder="Start Date"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-3">
                        <p class="trans-text" data-langprop="invoice.End Date"></p>
                    </div>
                    <div class="col-9">
                        <input data-select="datepicker" id="_pic_dlgFilterInvoice_EndDate" class="form-control" placeholder="End Date"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-3">
                        <p class="trans-text" data-langprop="invoice.Patient"></p>
                    </div>
                    <div class="col-9">
                        <input type="text" id="_pic_dlgFilterInvoice_Patient" class="form-control" placeholder="Patient"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-3">
                        <p class="trans-text" data-langprop="invoice.Status"></p>
                    </div>
                    <div class="col-9">
                        <select class="modal-select2" id="_pic_dlgFilterInvoice_Status">
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_pic_dlgFilterInvoice_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>