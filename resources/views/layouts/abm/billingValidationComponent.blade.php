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
            <div class="d-flex flex-row w-75 gap-2 ml-2">
                <div class="col-lg-12" id="">
                    <label class="form-label trans-text">DHL Shipment</label>
                    <!-- <select id="_sal_agent_type" class="modal-select2 data-input" data-field="agent_types_id"></select> -->
                    <!-- <select class="form-control data-input" id="_sal_agent_type" data-field="agent_types_id"></select> -->
                    <div class="d-flex flex-row gap-2 ">
                        <label for="excel" class="w-50 custom-file-upload btn btn-outline-success">
                            <i class="fa fa-file fs-5"></i>
                            <span>Uploard file</span>
                        </label>
                        <input type="file" name="upload_excel" id="excel" class="d-none" />

                        <label typle= "buttom" id="com_btn_uploard_file" class=" btn btn-outline-success">
                            <!-- <i class="fa fa-file fs-5"></i> -->
                            <span>Validate</span>
                        </label>
                        
                        <!-- <input id="file-upload" type="file" /> -->
                        <!-- <button id="com_btnDeleteLogo" class="btn btn-outline-danger">
                            <i class="fa-regular fa-trash-can fs-5"></i>
                            <span></span>
                        </button> -->
                        <label type="button" id="_pl_btnRefress" class="btn btn-primary height">
                            <i class="fa fa-sync-alt"></i>
                        </label>    
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex gap-2 w-50" id="_sdl_filter_fields_date">
            <div class="d-flex flex-row w-50 gap2 ">
                <div class="col-lg-12" id="">
                    <label class="form-label trans-text" data-langprop="titles.Start Date">Start Date</label>
                    <input data-select="datepicker" class="form-control filter-field" data-field="start_date" placeholder="Start Date" id="_shm_filter_start_date" />
                </div>
            </div>
            <div class="d-flex flex-row w-50 gap2 ">
                <div class="col-lg-12" id="">
                    <label class="form-label trans-text" data-langprop="titles.End Date">End Date</label>
                    <input data-select="datepicker" class="form-control filter-field" data-field="end_date" placeholder="End Date" id="_shm_fliter_end_date" />
                </div>
            </div>
        </div>
        
    </div>

   
        
    <div class="shadow rounded-3 bg-light mt-2">
        <div id="_billValidation_list"></div>
    </div>

    <!-- <div class="shadow rounded-3 bg-light mt-2">
        <table class="table bill_Validate table-bordered">
            <caption>List of Bill Validation</caption>
            <thead>
                <tr>
                    <th scope="col" class="" rowspan="2">Waybill No.</th>
                    <th scope="col" rowspan="2">Shipment Date</th>
                    <th scope="col" rowspan="2">Dest Country</th>
                    <th scope="col" rowspan="2">Product</th>
                
                    <th scope="col" class="text-center bg-" colspan="3"> Weight (Kg) </th>
                    <th scope="col" class="text-center bg-" colspan="3"> Amount (USD) </th>
                </tr>
                <tr>
                    
                    <th scope="col" class="success"> JTO </th>
                    <th scope="col" class="warning">DHL</th>
                    <th scope="col"> Diff. </th>
                    <th scope="col" class="success"> JTO </th>
                    <th scope="col" class="warning">DHL</th>
                    <th scope="col"> Diff. </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1957271702</th>
                <td>18-01-2022</td>
                <td>CHINA</td>
                <td>NDOC</td>
                <td  class="success"> 2.0 </td>
                <td class="warning"> 2.0 </td>
                <td> -   </td>
                <td  class="success"> 44.26 </td>
                <td class="warning"> 44.27 </td>
                <td>  (0.01) </td>
                </tr>
                <tr>
                <th scope="row">6648201755</th>
                <td>25-01-2022</td>
                <td>CHINA</td>
                <td>DOC</td>
                <td  class="success">  0.5  </td>
                <td class="warning"> 0.5 </td>
                <td> - </td>
                <td  class="success"> 24.16  </td>
                <td class="warning"> 24.15  </td>
                <td> 0.01 </td>
                </tr>
                <tr>
                <th scope="row">1957271702</th>
                <td>18-01-2022</td>
                <td>CHINA</td>
                <td>NDOC</td>
                <td  class="success"> 2.0 </td>
                <td class="warning"> 2.0 </td>
                <td> -   </td>
                <td  class="success"> 44.26 </td>
                <td class="warning"> 44.27 </td>
                <td>  (0.01) </td>
                </tr>
                <tr>
                <th scope="row">6648201755</th>
                <td>25-01-2022</td>
                <td>CHINA</td>
                <td>DOC</td>
                <td  class="success">  0.5  </td>
                <td class="warning"> 0.5 </td>
                <td> - </td>
                <td class="success"> 24.16  </td>
                <td class="warning"> 24.15  </td>
                <td> 0.01 </td>
                </tr>
                <tr>
                <th scope="row">1957271702</th>
                <td>18-01-2022</td>
                <td>CHINA</td>
                <td>NDOC</td>
                <td class="success"> 2.0 </td>
                <td class="warning"> 2.0 </td>
                <td> -   </td>
                <td class="success"> 44.26 </td>
                <td class="warning"> 44.27 </td>
                <td>  (0.01) </td>
                </tr>
                <tr>
                <th scope="row">6648201755</th>
                <td>25-01-2022</td>
                <td>CHINA</td>
                <td>DOC</td>
                <td class="success">  0.5  </td>
                <td class="warning"> 0.5 </td>
                <td> - </td>
                <td class="success"> 24.16  </td>
                <td class="warning"> 24.15  </td>
                <td> 0.01 </td>
                </tr>
            </tbody>
        </table>
    </div> -->


</div>