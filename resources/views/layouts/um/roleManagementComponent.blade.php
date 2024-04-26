<style>
  table#_um_tblRoleModules>tbody td {
    padding: 5px;
    font-size: 18px;
    margin-top: 5px;
    font-weight: bold;
  }

  table#_um_tblRoles td {
    vertical-align: 'middle';
    border-top: none;
    border-bottom: 1px solid #D7DBDB;
  }
  tr.user-found td{
    color:green !important;
  }
  table#_um_addprn_tblPrns>thead th {
    font-size: 1em;
    font-weight: normal;
    text-transform: uppercase;
  }

  .prn_btn_action {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tr-allowed td.prn-name {
    color: green;
  }

  .tr-allowed td.prn-icon::before {
    content: 'Allowed';
  }

  .tr-disallowed td.prn-icon::before {
    content: 'Not Allowed';
  }

  .tr-disallowed td.prn-name {
    color: #000;
  }
  .card:hover{
    cursor: pointer;
    border:1px solid #ffb822 !important;
    
  }

  ._row{
    width: 100%;
    flex-wrap:nowrap;
    overflow: scroll;
  }
  
 
  .box{
    width: 3000px;
  }
  .role_name_title{
        display:flex;
        justify-content:center;
        align-items:center;
        width:75px;
        height:70px;
        border-radius:10px;
        background-color: #ffb822 ;
        color:white;
        font-size: 20px;
        
    }
   
</style>

<div id="_um_roleManagementComponent" class="p-3" style="display:none">
   <div class="d-flex flex-row flex-wrap justify-content-between align-items-between p-1 bg-white shadow rounded-3 p-3"  id="div_filter_fields" >
          <div class="d-flex flex-row gap-2">
             <input type="search" class="form-control " placeholder="Search role" id="_search_role"/>
          </div>
          <div class="d-flex flex-row gap-2">
              <button  id="_lnkNewRole" class="btn btn-sm btn-primary rounded-5" type="button">
                 <span class="trans-text text-nowrap" data-langprop="buttons.Add Role"></span></i>
              </button>
              <button id="_um_btn_pdf" class="btn btn-sm btn-danger mr-5 rounded-5" type="button">
                <i class="fa fa-file-pdf"></i>&nbsp;<span class="trans-text text-white" data-langprop="buttons.PDF"></span>
              </button>
        </div>
    </div>
 
    <div id="_um_rolelist_wraper" class="w-100 shadow-lg bg-white rounded-3 p-2 overflow-hidden mt-2">
        <div id="_um_rolelist" class="w-90 d-flex flex-row bg-secondary gap-3 p-1" style="overflow-y:hidden; overflow-x:auto">
        </div>    
     </div>
     
    <div id="_um_card" class="mt-3 w-100 shadow-lg rounded-3 p-2 d-flex flex-row gap-3 bg-white">
        <div id="card1" class="row w-100 d-flex  flex-column gap-4  p-3">
       
        </div>

</div> 

<div class="modal fade" id="roleDialog" tabindex="-1" role="dialog" aria-labelledby="_role_dlgTitle" aria-hidden="true">
    <div class="modal-dialog modal-md vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" id="_role_dlgTitle" data-langprop="titles.Creating a new role"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row" id="_role_dlg_body">

              <div class="form-group col-md-6">
                  <label class="control-label ">ID</label>
                  <input type="text" class="form-control data-input" data-field="id" placeholder="Auto" readonly/>

              </div>
              <div class="form-group col-md-6">
                <label class="control-label">Role Name</label>
                <input type="text" class="form-control data-input" id="role_name" data-field="name" placeholder="Role name" />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label ">User Class</label>
                <div class="min-width-select max-width-select">
                  <select class="modal-select2 data-input" id="user_class" data-field="user_class" placeholder="User Class"></select>
                </div>
              </div>
                    
                  
                    
                    
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal"><span class="trans-text" data-langprop="buttons.Cancel"></span></button>
                <button type="button" class="btn btn-primary height" id="_role_dlg_btnOK"><span class="trans-text" data-langprop="buttons.Create"></span></button>
            </div>
        </div>
    </div>
</div>
  
  

      
  
  


<!-- <div class="modal fade" id="_um_dlgCreatePrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgCreatePrnTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgCreatePrnTitle">Create Permission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-md-6">
            <label for="_um_createprn_module" class="col-form-label">Permission Number</label>
            <input type="number" class="form-control" id="_um_createprn_prn_id">
          </div>
          <div class="form-group col-md-6">
            <label for="_um_createprn_module" class="col-form-label">Permission Name</label>
            <input type="text" class="form-control" id="_um_createprn_prn">
          </div>
          <div class="form-group col-md-12">
            <label for="_um_createprn_module" class="col-form-label">This permission belongs to</label>
            <div class="min-width-select max-width-select">
              <select class="modal-select2" id="_um_createprn_module"></select>
            </div>
          </div>
        </div>
        <div>
          <span id="_um_createprn_error" class="error_text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          <span>Cancel</span>
        </button>
        <button type="button" class="btn btn-primary" id="_um_createprn_btnOK">
          <span>Create Now</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="_um_dlgAddPrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgAddPrnTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgAddPrnTitle">Add/Remove Permissions</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <input type="text" class="form-control" id="_um_addprn_search" placeholder="Search permission number or name">
        </div>
        <div class="table_wrapper">
          <table id="_um_addprn_tblPrns" class="table fixed-body-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Code</th>
                <th>Permission</th>
                <th>Module</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="_um_addprn_tblPrns_body" style="max-height:35vw"></tbody>
          </table>
        </div>
        <div>
          <span id="_um_addprn_error" class="error_text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary height" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div> -->