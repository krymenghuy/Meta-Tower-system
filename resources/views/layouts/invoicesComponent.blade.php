<style>
    .invoice-pmt-wrapper{
        border:1px solid grey;
        border-radius:5px;
        padding:15px;
    }

    table.payment-table th{
      border-bottom:1.1px dotted orange !important;
      font-weight:bold;
    }

    .btn-pmt-status{
       width:120px;
    }
</style>
<div id="_main_invoicesComponent" style="display:none;padding-top:15px">
    <div class="d-flex align-item-center px-3 w-100 mt-3">
        <div class="d-flex align-items-center gap-2 w-100">
            <button id="_invs_btnNewInvoice" class="btn btn-primary d-flex flex-nowrap" type="button">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text text-nowrap fs-6" data-langprop="buttons.New Invoice"></span>
            </button>
            <div class="input-group flex-nowrap">
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="titles.Search">Search</span>
                </div>
                <input type="search" placeholder="Search" class="form-control" id="_inv_search_invoice"/>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100">
            <div>
                <button class="vs-btn-custom-export" type="button">
                    <i class="fa-solid fa-file-export"></i>
                    <span class="trans-text fs-6" data-langprop="buttons.Export"></span>
                </button>
            </div>
        </div>
    </div>
    <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
        <table class="table header-light-blue header-uppercase" id="_inv_tblInvoice"></table>
    </div>
</div>

<!--Modal of New Invoice-->
<div id="_invs_dlgNewInvoice" class="modal fade" tabindex="-1" aria-labelledby="_invs_dlgInvoice_title" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
               <div class="d-flex flex-flow w-100"> <h4 id="_invs_dlgInvoice_title" class="modal-title text-nowrap"></h4><span class="ml-2 text-left fw-bold fs-5" id="ivc_ref_number"></span></div>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-3">
                        <div class="d-flex flex-column">
                            <div class="w-100 my-2">
                                <label for="customer" class="form-label trans-text" data-langprop="customer.Customer"></label>
                                <div class="input-group flex-nowrap">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-user"></i>
                                    </div>
                                    <select class="modal-select2 data-input" data-field="customer_id" id="_inv_customers">
                                    </select>
                                    <div id="_invs_lnkAddInvoice" class="input-group-text" role="button">
                                        <i class="fa-solid fa-plus text-primary"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="w-100 my-2">
                                <label for="customer_type" class="form-label trans-text" data-langprop="customer.Customer Type"></label>
                                <div class="input-group flex-nowrap">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-user"></i>
                                    </div>
                                    <select class="modal-select2 data-input" data-field="customer_type" id="_inv_customers_type">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="d-flex flex-column">
                            <div class="w-100 mb-2">
                                <label for="customerPhone" class="form-label trans-text" data-langprop="customer.Customer Phone"></label>
                                <input type="text" placeholder="Enter your phone number" class="form-control data-input" data-field="customer_phone"/>
                            </div>
                            <div class="w-100 my-2">
                               <label for="emailAddress" class="form-label trans-text" data-langprop="customer.Email Address"></label>
                               <input type="email" name="email" placeholder="Enter your email" class="form-control data-input" data-field="email_address" required/>
                            </div>   
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="billingAddress" class="form-label trans-text" data-langprop="customer.Billing Addresss"></label>
                        <textarea class="form-control data-input" data-field="billing_address" placeholder="Billing Address" style="min-width:281px;height:105px"></textarea>
                    </div>
                    <div class="col-lg-3">
                        <div class="d-flex justify-content-center">
                            <div style="padding:10%; border-radius:50%; border:2.5px dotted grey;overflow:hidden">
                                <div class="d-block">
                                    <span for="balanceDue" class="h3 trans-text"
                                        data-langprop="titles.Balance Due"></span>
                                    <p class="h3 text-center fw-bold ivc-balance-due mt-2" id="ivc_balance_due">$ 0.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2 my-2">
                    <div class="col-lg-3">
                        <label for="terms" class="form-label trans-text" data-langprop="titles.Terms"></label>
                        <select class="modal-select2 data-input" data-field="terms" id="_inv_pmt_terms"></select>
                    </div>
                    <div class="col-lg-3">
                        <label for="issueDate" class="form-label trans-text" data-langprop="titles.Issue Date"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <input data-select="datepicker" class="form-control data-input" data-field="issue_date"/>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <label for="dueDate" class="form-label trans-text" data-langprop="titles.Due Date"></label>
                        <div class="input-group flex-nowrap">
                            <div class="input-group-text">
                                <i class="fa-regular fa-calendar-days"></i>
                            </div>
                            <input data-select="datepicker" name="dueDate" class="form-control data-input" data-field="due_date"/>
                        </div>
                    </div>
                </div>
                <div class="row mt-4 border border-2 border-success rounded-2 p-2">
                    <div class="d-flex align-items-center gap-2 px-2">
                        <p class="fw-semibold tab-item tab-item-product p-2 bg-success rounded-3" role="button" data-target="_ivc_product_panel" data-viewname="product">Product</p>
                        <p class="fw-semibold tab-item tab-item-service p-2 rounded-3" role="button" data-target="_ivc_service_panel" data-viewname="service">Service</p>
                    </div>
                    <div id="_ivc_items_panel">
                       <div style="display:none" data-viewname="product" id="_ivc_product_panel" class="col-12 table-responsive"></div>
                       <div style="display:none" data-viewname="service" id="_ivc_service_panel" class="col-12 table-responsive"></div>
                    </div>
                </div>
                <div class="row gy-2 mt-3">
                    <div class="col-lg-6">
                        <label for="description" class="form-label trans-text" data-langprop="titles.Description"></label>
                        <textarea class="form-control data-input" data-field="description"></textarea>
                    </div>
                    <div class="col-lg-6">
                        <div class="d-flex justify-content-center">
                            <div class="d-block">
                                <div class="row gy-2 gx-1">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap trans-text" data-langprop="titles.Sub Total:"></p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-nowrap"  id="ivc_sub_total">$ 0.00</p>
                                    </div>
                                </div>
                                <div class="row gy-2 gx-1">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap trans-text" data-langprop="titles.Discount(%):">
                                        </p>
                                    </div>
                                    <div class="col-6">
                                        <input id="ivc_discount" type="number" value="0" class="form-control form-control-sm width_at_input_discount data-input" data-field="discount"/>
                                    </div>
                                </div>
                                <div class="row gy-2 gx-1">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap trans-text" data-langprop="titles.Tax:"></p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-nowrap"  id="ivc_tax_amount">$ 0.00</p>
                                    </div>
                                </div>
                                <div class="row gy-2 gx-1">
                                    <div class="col-6 d-flex justify-content-end">
                                        <p class="text-nowrap trans-text" data-langprop="titles.Grand Total:">
                                        </p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-nowrap"  id="ivc_grand_total">$ 0.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="messageDisplayedOnInvoice" class="form-label trans-text" data-langprop="titles.Message Displayed On Invoice"></label>
                        <textarea class="form-control data-input" data-field="message_invoice"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="javascript:void(0)" style="font-size:1.2em">
                    <i class="fa fa-gears"></i>
                </a>
                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">
                   <i class="fa fa-times"></i> <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="_invs_dlgNewInvoice_btnSave" type="button" class="btn btn-success">
                   <i class="fa fa-save"></i> <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>


<!--begin::PaymentDialog-->
<div class="modal fade" id="_ivc_dlgPayment" tabindex="-1" role="dialog" aria-labelledby="_ivc_dlgPayment_title"
     aria-hidden="true">
     <div class="modal-dialog modal-lg" role="dialog">
         <div class="modal-content">
             <div class="modal-header">
                 <h5 class="modal-title​ trans-text" data-langprop="titles.New Payment"
                     id="_ivc_dlgPayment_title"></h5>
                 <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
             </div>
             <div class="modal-body">
                 <div id="_ivc_dlgPayment_invoice_info" class="border border-rouded border-lg border-warning p-2">
                        <div class="row">
                            <div class="form-group col-lg-3">
                                <span class="simple-label trans-text" data-langprop="invoice.Invoice"></span>
                                <span class="fw-bold display-field" data-name="ref_number">2324343</span>  
                            </div>
                            <div class="form-group col-lg-3">
                                <span class="simple-label trans-text" data-langprop="invoice.Amount Due"></span>
                                <span class="fw-bold display-field" data-name="amount_due">2324343</span>  
                            </div>
                            <div class="form-group col-lg-3">
                            <span class="simple-label trans-text" data-langprop="invoice.Paid"></span>
                                <span class="fw-bold display-field" data-name="amount_paid">2324343</span>  
                            </div>
                            <div class="form-group col-lg-3">
                            <span class="simple-label trans-text" data-langprop="invoice.Open"></span>
                                <span class="fw-bold display-field" data-name="open_amount">2324343</span>  
                            </div>
                        </div>
                 </div>
                 <div class="row" id="_ivc_dlgPayment_body">
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="payment.Payment Date"></span>
                         <div>
                             <input data-required="1" data-field="payment_date" data-ffield="Payment Date"
                                 class="form-control data-input" data-select="datepicker"/>
                         </div>
                     </div>
                     <div class="form-group col-lg-6">
                         <span class="simple-label trans-text" data-langprop="payment.amount"></span>
                         <div>
                             <input type="number" data-field="amount" data-ffield="Amount"
                                 class="form-control data-input"/>
                         </div>
                     </div>

                     <div class="form-group col-lg-12">
                         <span class="simple-label trans-text" data-langprop="payment.notes">Notes</span>
                         <div><input type="text" data-field="notes" data-ffield="Notes"
                                 class="form-control data-input"></div>
                     </div>
  
                 </div>
                 <!--Close row-->
             </div>
             <!--close body-->
             <div class="modal-footer">
                 <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal"><i class="fa fa-times"></i> <span
                         class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                 <button type="button" class="btn btn-primary" id="_ivc_dlgPayment_btnSave"><i
                         class="fa fa-save"></i><span class="trans-text"
                         data-langprop="buttons.Save">Save</span></button>
             </div>
         </div>
         <!--close Content-->
     </div>
 </div>
 
<!--end::PaymentDialog-->