<style>
    

  table#_col_tblco> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid orange;
     font-size:0.8em; 
  }
</style>

<div id="_main_creditOfficerListComponent" style="display:none;">
      <section class="content">
 
       <div class="container-fluid">
 
          <div class="d-flex justify-content-between" style="padding:10px">
              <div class="d-flex col-md-6">
                  <button class="vs-btn-md vs-btn-md-primary" id="_col_btnNewCO"><i class="fa fa-list-alt"></i>&nbsp;<span class="trans-text" data-langprop="buttons.New CO">New Officer</span></button>
                  <input id="_col_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search officer">
                  <a id="_col_btnSearch" class="vs-btn-round vs-btn-success" href="javascript:void(0)" ><i class="fas fa-sync-alt"></i></a>
              </div>

              <div class="d-flex justify-content-end col-md-6">
                  <!-- <a id="_col_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                  <!-- <a id="_col_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                  <!-- <a id="_col_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
              </div>
          </div>
          
          <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
              <table class="table" id="_col_tblCOList" style="margin-top:-25px !important;"></table>
          </div>
 
      </div>
 
     </section>
 </div>

 <!--begin::CODialog -->
<div class="modal fade" id="_col_dlgCO" tabindex="-1" role="dialog" aria-labelledby="_col_dlgCO" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
      <h5 class="modal-title​ trans-text" data-langprop="titles.New CO" id="_col_dlgCO_title">New Credit Officer</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
        <div class="row" id="dlgCO_body">
                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="person.Name">Name</span> 
                            <div><input type="text" data-required="1" data-field="name" data-ffield="name" class="form-control data-input" id="_co_name"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="person.Sex">Sex</span> 
                            <div><select data-field="sex" data-ffield="sex" class="form-control data-input">
                              <option value="M">Male</option>
                              <option value="M">Female</option>
                            </select></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="person.Phone Number.">Phone Number</span> 
                            <div><input type="text" data-type="phone" data-required="1" data-ffield="Phone number" data-field="phone_number" class="form-control data-input" id="_col_phone_number"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="person.Address">Address</span> 
                            <div><input type="text" data-field="address" data-ffield="address" class="form-control data-input" id="_col_address"></div> 
                        </div>
 
                        <div>
                           <span style="margin-left:15px" id="_col_dlgCO_error" class="error_text"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                        <button type="button" class="btn btn-primary" id="_col_dlgCO_btnSave"><i class="fa fa-check"></i><span class="trans-text" data-langprop="buttons.Save"></span></button>
                    </div>
        </div>
    </div>
  </div>
</div>
<!--end::CODialogDialog -->

 