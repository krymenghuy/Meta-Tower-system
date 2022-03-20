<div id="_mainGuarantorsComponent" style="display:none;">
    <div class="d-flex justify-content-between" style="padding:15px;">
        <div class="d-flex col-md-6">
          <button style="margin-right:10px;background:#d5e9f6;font-weight:bold;" class="btn btn-default" id="btnAddGuarantorList">+ New Guarantor</button>
          <input style="width:50%;margin-right:10px;" type="text" class="form-control" placeholder="Search guarantor">
          <a style="padding:5px 10px 0 10px;border-radius:3px;background:#e6ecff;margin-right:10px;" href="#"><i class="fas fa-sync-alt"></i></a>
        </div>

        <div class="d-flex justify-content-end col-md-6">
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#e6ecff;margin-right:10px;" href="#"><i class="fa-solid fas fa-print"></i> Print</a>
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#ffe6e6;margin-right:10px;" href="#"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#ccffcc;" href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a>
        </div>
    </div>
    

    <div style="padding-left:15px;padding-right:15px;">
        <table class="table" id="_mainGuarantorsComponent_table"></table>
    </div>
</div>


  <!-- Modal -->
  <div class="modal fade" id="modalAddGuarantor" tabindex="-1" role="dialog" aria-labelledby="modalAddGuarantor_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="mmodalAddGuarantor_title">Guarantors List</h5>
          <button type="button" class="close" data-dismiss="modal"></button>
        </div>
        <div  class="modal-body">
            <div class="row">
                <div class="col-md-12" style="display:flex;">
                  <div style="width:100%">
                      <label for="">First Name</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div>

                  <div style="width:100%;margin-left:10px;margin-right:10px;">
                      <label for="">Last Name</label>
                      <input type="text" data-required="1" class="form-control data-input">
                  </div>

                  <div style="width:100%">
                      <label for="">Email</label>
                      <input type="text" data-field="n_id" data-required="1" class="form-control data-input">
                  </div>   
                </div>
            </div>

            <div class="row" style="margin-top:15px;">
                <div class="col-md-12" style="display:flex;">
                  <div style="width:100%">
                      <label for="">Phone number</label>
                      <input type="text" data-required="1" class="form-control data-input">
                  </div> 

                  <div style="width:100%;margin-left:10px;margin-right:10px;">
                      <label for="">Sex</label>
                      <select class="form-control">
                          <option value="">Male</option>
                          <option value="">Female</option>
                          <option value="">Others</option>
                      </select>
                  </div>

                  <div style="width:100%;">
                      <label for="">DateOfBirth</label>
                      <input type="date" data-required="1" class="form-control data-input">
                  </div>

                   
                </div>
            </div>


            <div class="row" style="margin-top:15px;">
                <div class="col-md-12" style="display:flex;">
                  <div style="width:100%">
                      <label for="">Student ID</label>
                      <input type="text" data-required="1" class="form-control data-input">
                  </div> 

                  <div style="width:100%;margin-left:10px;margin-right:10px;">
                      <label for="">Phone number</label>
                      <input type="text" data-required="1" class="form-control data-input">
                  </div>

                  <div style="width:100%;">
                      <label for="">Level Of Study</label>
                      <select class="form-control">
                          <option value="">Major</option>
                      </select>
                  </div>

                   
                </div>

            </div>

            <div class="row" style="margin-top:15px;">
                <div class="col-md-12" style="display:flex;">
                  <div style="width:100%;margin-right:10px;">
                      <label for="">Income Section</label>
                      <input type="text" class="form-control">
                  </div>

                  <div style="width:100%;">
                      <label for="">Loan Type</label>
                      <select class="form-control">
                          <option value="">Student Loan</option>
                      </select>
                  </div>

                  <div style="width:100%;margin-left:10px;margin-right:10px;">
                      <label for="">Last GPA</label>
                      <select class="form-control">
                          <option value="">4.0</option>
                          <option value="">3.7</option>
                          <option value="">3.3</option>
                          <option value="">3.0</option>
                      </select>
                  </div> 

                  <div style="width:100%;">
                      <label for="">Status</label>
                      <select class="form-control">
                          <option value="">Pending</option>
                          <option value="">Approved</option>
                          <option value="">Disbursed</option>
                      </select>
                  </div>

                </div>

            </div>


            <div class="row" style="margin-top:15px;">
                <div class="col-md-12" style="display:flex;">
                  <div style="width:68%">
                      <label for="">Address</label>
                      <textarea cols="5" rows="3" class="form-control"></textarea>
                  </div> 
                  <div style="margin-left:10px;">
                      <label for="">Attached Doc</label>
                      <input type="file">
                  </div>
                </div>
            </div>



        </div>
        <div class="modal-footer">
          <span class="error_text" id="modalAddWaitingList_error"></span>
          <button type="button" class="btn btn-default" id="modalAddWaitingList_btnSave">Save</button>
        </div>
      </div>
      
    </div>
  </div>

<script  src="{{ asset('js/GuarantorsComponent.js') }}"></script>