<!--begin::InputBox1 (Free Typing value)-->
<div class="modal fade" id="_dlgInputBox1" tabindex="-1" role="dialog" aria-labelledby="_dlgInputBox1Title" aria-hidden="true">
  <div class="modal-dialog vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dlgInputBox1Title">Title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
          <div class="form-group">
            <label for="_inputbox1_value" class="col-form-label" id="_inputbox1_label" >Label</label>
            <input type="text" class="form-control" id="_inputbox1_input">
          </div>
          <div>
              <span id="_inputbox1_error" class="error_text"></span>
           </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_inputbox1_btnOK">OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::inputBox1 (Free typing value) -->

<!--begin::InputBox2 (Select One option or value)-->
<div class="modal fade" id="_dlgInputBox2" tabindex="-1" role="dialog" aria-labelledby="_dlgInputBox2Title" aria-hidden="true">
  <div class="modal-dialog vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dlgInputBox2Title">Title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
            <label for="_inputbox2_value" class="col-form-label" id="_inputbox2_label" >Label</label>
            <select class="form-control modal-select2" id="_inputbox2_select"></select>
          </div>
        <div>
          <span id="_inputbox2_error" class="error_text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_inputbox2_btnOK">OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::inputBox2 (Select One option or value)-->

<!--begin::FindPersonDialog-->
<div class="modal fade" id="dg_dlgFindPerson" tabindex="-1" role="dialog" aria-labelledby="dg_dlgFindPersonTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="dg_dlgFindPersonTitle">Find Person</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
           <div class="row">
                <div class="col-lg-6">
                  <input class="form-control" type="text" id="dg_person_search" placeholder="id, name, phone number"> 
                </div>
                <div class="col-lg-6">
                   <button type="button" id="dg_btnFindPerson" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </div>
           </div>

           <div class="row">
                <div class="col-lg-12">
                  <div style="height:15px"></div> 
                  <span style="font-weight:bold;font-size:1.3em">Looking for someone?</span>
                  <div class="div-line" style="width:50%;border-color:green"></div>
                  <div id="dg_tblPersons_wrapper">
                      <table id ="dg_tblPersons" class="table fixed-body-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Phone Number</th>
                              </tr>
                        </thead>
                        <tbody id="dg_tblPersons_body" style="height:250px"></tbody>
                      </table> 
                  </div>
                  <div><span style="font-size:1.3em;color:green;font-weight:bold" id="dg_lblInfo">No Person Found!</span></div>
                </div>
           </div>
      </div>
      <div class="modal-footer">
         <button type="button" class="btn btn-secondary" data-dismiss="modal" id="dg_findperson_btnClose">Cancel</button>
         <button type="button" class="btn btn-primary" id="dg_btnChoosePerson">OK</button>
      </div>
    </div>
  </div>
</div>
 <!--end::FindPersonDialog-->
