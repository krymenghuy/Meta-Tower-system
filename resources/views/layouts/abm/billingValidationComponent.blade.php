<style>
    table.bill_Validate th.success,table.bill_Validate td.success{
        background: #c4ecca;
    }
    table.bill_Validate th.warning,table.bill_Validate td.warning{
        background: #ecdd62;
    }
    table.bill_Validate th {
        vertical-align: middle; /* Vertically center the content */
        /* text-align: center; Horizontally center the content */
        padding: 0 10px;
    }
    /* table.bill_Validate th{
        width: 100px;
    } */
    table.bill_Validate th div {
        color: #0e75d9 !important;
    }
    table.bill_Validate td {
        padding: 0 10px;
    }

</style>
<div id="_main_billingValidationComponent" style="display:none; padding-right: 15px;">


    <div class="d-flex justify-content-between shadow rounded-3 pb-3 pt-3 p-2 bg-white" id="_sdl_filter_fields">
         <!-- <div class="d-flex flex-row gap2">
            <button id="_sale_agent_btnNew" class="btn btn-primary" type="button">
                  <i class="fa fa-plus"></i>
                  <span class="trans-text" data-langprop="buttons.New "></span>
            </button>
         </div> -->
         <div class="d-flex gap- w-50" >
            <div class="d-flex flex-row w-75 gap- ml-2">
                <div class="col-lg-12" id="">
                    <label class="form-label trans-text">DHL Shipment</label>
                    <!-- <select id="_sal_agent_type" class="modal-select2 data-input" data-field="agent_types_id"></select> -->
                    <!-- <select class="form-control data-input" id="_sal_agent_type" data-field="agent_types_id"></select> -->
                    <div class="d-flex flex-row gap-2 ">
                        <label for="excel" class="w-50 custom-file-upload btn btn-outline-success d-flex align-items-center">
                            <i class="fa fa-file fs-5"></i>
                            <span>Uploard file</span>
                        </label>
                        <input type="file" name="upload_excel" id="excel" class="d-none" />

                        <label typle= "buttom" id="com_btn_uploard_file" class=" btn btn-outline-success d-flex align-items-center">
                            <!-- <i class="fa fa-file fs-5"></i> -->
                            <span>Validate</span>
                        </label>
                        <!-- Button trigger modal -->
                        <label type="button" id="_btn_pay_many" class="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
                            Payment
                        </label>
                        
                        <!-- <input id="file-upload" type="file" /> -->
                        <!-- <button id="com_btnDeleteLogo" class="btn btn-outline-danger">
                            <i class="fa-regular fa-trash-can fs-5"></i>
                            <span></span>
                        </button> -->
                           
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row w-50 gap- ">
                <div class="col-lg-12" id="">
                    <label class="form-label trans-text">JTO Shipment</label>
                    <!-- <select id="_sal_agent_type" class="modal-select2 data-input" data-field="agent_types_id"></select> -->
                    <!-- <select class="form-control data-input" id="_sal_agent_type" data-field="agent_types_id"></select> -->
                    <select id="_select_shipment_No" class="modal-select2 filter-field" data-field="shipment_no">
                    <!-- <option selected>(Select JTO shipment No.)</option>
                    <option value="1">#00001</option>
                    <option value="2">#00002</option>
                    <option value="3">#00003</option> -->
                    </select>
                </div>
            </div>
        </div>
        <div class="d-flex gap- w-50" id="_sdl_filter_fields_date">
            <div class="d-flex flex-row w-100 gap- ">
                <div class="col-lg-5" id="">
                    <label class="form-label trans-text" data-langprop="titles.Start Date">Start Date</label>
                    <input data-select="datepicker" class="form-control filter-field" data-field="start_date" placeholder="Start Date" id="_shm_filter_start_date" />
                </div>
                <div class="col-lg-5" id="">
                    <label class="form-label trans-text" data-langprop="titles.End Date">End Date</label>
                    <input data-select="datepicker" class="form-control filter-field" data-field="end_date" placeholder="End Date" id="_shm_fliter_end_date" />
                </div>
                <div class="col-lg-2">
                    <label class="form-label text-white" >Refress</label>
                    <label type="button" id="_pl_btnRefress" class="btn btn-primary height ">
                        <i class="fa fa-sync-alt"></i>
                    </label> 
                </div>
            </div>
            <!-- <div class="d-flex flex-row w-50 gap-2 ">
                
            </div> -->
            
        </div>
        
        
    </div>

        
    <div class="shadow rounded-3 bg-light mt-2">
        <div id="_billValidation_list"></div>
    </div>

</div>

<!-- Button trigger modal -->
<!-- <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ErrorModalLong">
  Launch demo modal
</button> -->

<!-- Modal -->
<div class="modal fade" id="ErrorModalLong" tabindex="-1" role="dialog" aria-labelledby="AlertModalLongTitle" aria-hidden="true">
  <div class="modal-dialog" id="modal-dialog" role="document" style="max-width: 400px; margin: 10rem auto;">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-center border-0">
        <div class="" id="AlertModalLongTitle"> 
            
        </div>
        <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button> -->
      </div>
      <div class="modal-body ps-4 pe-3 pt-0 pb-0">
        <h class="header"></h>
        <p class="body ps-5 pe-4"></p>
      </div>
      <div class="modal-footer d-flex justify-content-center border-0">
        <button type="button" id="_sdl_btnCancel"class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" id="_sdl_btnOk" class="btn btn-primary">Ok</button>
      </div>
    </div>
  </div>
</div>



<!-- Modal -->
<div class="modal fade" id="PaymentModalDialog" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="PaymentModalDialogTitle">Payment</h5>   
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row ">
            <!-- <div class="form-group col-md-6">
                <span class="simple-label">Payment No.</span>
                <input id="_plq_pikcup_address" class="form-control data-input" placeholder="AUTO" data-field="payment_no" readOnly />
            </div> -->

            <div class="filter-date row pe-0">
                <div class="form-group from_date col-md-6 d-none" >
                    <span class="simple-label ">From Date</span>
                    <input data-select="datepicker" class="form-control data-input filter-field" data-field="from_date" placeholder="From Date" id="_shm_filter_from_date" />
                    <!-- <input type="number" class="form-control data-input" data-field="to_country_id" />   -->
                </div>
                <div class="form-group to_date col-md-6 pe-0 d-none" >
                    <span class="simple-label ">To Date</span>
                    <input data-select="datepicker" class="form-control data-input filter-field" data-field="to_date" placeholder="To Date" id="_shm_filter_to_date" />
                    <!-- <input type="number" class="form-control data-input" data-field="to_country_id" />   -->
                </div>
                <div class="form-group col-md-6 ">
                    <span class="simple-label">Supplier</span>
                    <select id="_plq_supplier" class="modal-select2 data-input filter-field" data-field="payee_id"></select>
                </div>
                <div class="form-group col-md-6">
                    <span class="simple-label ">Payment Date</span>
                    <input data-select="datepicker" class="form-control data-input" data-field="payment_date" placeholder="Payment Date" id="_shm_filter_payment_date" />
                    <!-- <input type="number" class="form-control data-input" data-field="to_country_id" />   -->
                </div>
            </div>
            <!-- <div class="form-group col-md-6">
                <span class="simple-label">Supplier Type</span>
                <div>
                    <select id="_plq_supplier_type" class="modal-select2 data-input" data-field="from_country_id"></select>
                </div>
            </div> -->
            <!-- <input type="hidden" id="_input_supplier" class="form-control data-input" data-field="payee_id" />   -->
            <!-- <div class="form-group col-md-6">
                <span class="simple-label">Customer</span>
                <div>
                    <select id="_plq_Customer" class="modal-select2 data-input" data-field="payer_id"></select>
                </div>
            </div> -->
            <div class=" row pe-0">
            <div class="form-group col-md-6">
                <span class="simple-label">Amount</span>
                <input type="" class="form-control data-input " data-field="amount" />  
            </div>
            <div class="form-group col-md-6">
                <span class="simple-label">Currency Code</span>
                <div>
                    <select id ="_plq_currency_code" class="modal-select2 data-input" data-field="currency_code"></select>
                </div>
            </div>
            <div class="form-group col-md-6">
                <span class="simple-label">Payment Method</span>
                <div>
                    <select id ="_plq_pmt_method" class="modal-select2 data-input" data-field="pmt_method"></select>
                </div>
            </div>
            
            <div class="form-group col-md-6">
                <span class="simple-label">Reshape Number</span>
                <input type="text" class="form-control data-input" data-field="reshape_number" />
            </div>
            <div class="form-group col-md-12">
                <span class="simple-label">Remarks</span>
                <input id="_plq_pikcup_address" class="form-control data-input" data-field="remarks" />
            </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" id="_sdl_btnPay" class="btn btn-primary">Pay</button>
      </div>
    </div>
  </div>
</div>