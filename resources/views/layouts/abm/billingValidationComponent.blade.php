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
         <div class="d-flex gap-2 w-50" >
            <div class="d-flex flex-row w-75 gap-2 ml-2">
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
                        
                        <!-- <input id="file-upload" type="file" /> -->
                        <!-- <button id="com_btnDeleteLogo" class="btn btn-outline-danger">
                            <i class="fa-regular fa-trash-can fs-5"></i>
                            <span></span>
                        </button> -->
                           
                    </div>
                </div>
            </div>
            <div class="d-flex flex-row w-50 gap-2 ">
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
        <div class="d-flex gap-2 w-50" id="_sdl_filter_fields_date">
            <div class="d-flex flex-row w-100 gap-2 ">
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
<div class="modal fade" id="ErrorModalLong" tabindex="-1" role="dialog" aria-labelledby="ErrorModalLongTitle" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header d-flex justify-content-center border-0">
        <!-- <h5 class="modal-title" id="ErrorModalLongTitle">Error Validation</h5> -->
        <i class="fa-regular fa-circle-xmark text-danger" style="font-size: 80px;"></i>
        <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button> -->
      </div>
      <div class="modal-body ps-4 pe-4 pt-0 pb-0">

      </div>
      <div class="modal-footer d-flex justify-content-center border-0">
        <!-- <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
        <button type="button" id="_sdl_btnOk" class="btn btn-primary">Ok</button>
      </div>
    </div>
  </div>
</div>