 <!--begin::ProgramDialog-->
 <div class="modal fade" id="_apl_programDialog" tabindex="-1" role="dialog" aria-labelledby="_apl_programDialog_title" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_apl_programDialog_title">New Program</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
           <div class="row">
              <div class="form-group col-lg-6">
                  <span class="simple-label">Level</label>
                  <div> <select id="_apl_programDialog_level" class="form-control data-input" data-required="1" data-field="level_id"></select></div>
              </div>
              <div class="form-group col-lg-6">
                  <span class="simple-label">Degree Name</label>
                  <!-- <div> <input class="form-control data-input" data-required="1" data-field="degree_name"></div> -->
                  <div> <select id="_apl_programDialog_degname" class="form-control data-input modal-select2" data-required="1" data-field="degree_name"></select></div>
              </div>
              <div class="form-group col-lg-12">
                  <span class="simple-label">Major Name</label>
                  <div> <input id="_apl_programDialog_major" class="form-control data-input" data-required="1" data-field="major_name"></div>
              </div>
              <div class="form-group col-lg-12">
                  <span class="simple-label">Program name</label>
                  <div> <input id="_apl_programDialog_program" class="form-control" readOnly></div>
              </div>
              <div class="row">
                 <div class="form-group col-lg-12">
                     <span id="_apl_programDialog_error" class="server-error-text" style="margin-left:15px"></span>  
                 </div>
              </div>
          </div>         
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-primary" id="_apl_programDialog_btnOK">Save</button>
      </div>
    </div>
  </div>
</div>
 <!--end::ProgramDialog-->
 <script  src="{{ asset('js/ProgramDialog.js') }}"></script>