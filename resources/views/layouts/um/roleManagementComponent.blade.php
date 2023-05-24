<style>
  table#_um_tblRoleModules > tbody td{
    padding:5px;
    font-size:18px;
    margin-top:5px;
    font-weight:bold; 
  }

  table#_um_tblRoles .row-selected{
    background-color:#D6EAF8;
  }

  table#_um_tblRoles td{
    vertical-align:middle;
  }

  table#_um_addprn_tblPrns > thead th{
    font-size:1em;
    font-weight:normal;
    text-transform:uppercase;
  }

  .prn_btn_action{
    width:64px;
  }

  .tr-allowed td.prn-name{
    color:green;
  }

  .tr-allowed td.prn-icon::before{
    content:'Allowed';
  }

  .tr-disallowed td.prn-icon::before{
    content:'Not Allowed';
  }

  .tr-disallowed td.prn-name{
    color:#000;
  }
</style>

<div id="_um_roleManagementComponent" class="mobile-padding" style="width:auto;display:none;margin:15px 15px 15px">
  <div id="_um_roleListPanel" style="width:auto;display:none">
    <div class="row">
      <div class="col-lg-4">           
        <div>
          <span style="font-size:0.9em;font-weight:bold;padding:2px;color:grey">AVAILABLE ROLES</span>
          &nbsp;
          <a href="javascript:void(0)" id="_um_lnkNewRole">
            <i class="fa fa-plus-circle" style="color:green"></i>
          </a>
        </div>  
        <div class="table_wrapper border-style1" style="height:40vw">
          <table id="_um_tblRoles" class="table">
            <tbody id="_um_tblRoles_body"></tbody>   
          </table>
        </div>                  
      </div>
      <div class="col-lg-8">
        <div class="tab-view" id="_um_roleTabView"> 
          <div class="tab-header">
            <a style="color:#000;" href="javascript:void(0)" class="tab-button dark-text" data-viewname="users" id="_um_roletab_button_users" data-target="tab_panel_users">USERS</a>
            <a style="color:#000;" href="javascript:void(0)" class="tab-button dark-text" data-viewname="modules" id="_um_roletab_button_modules" data-target="tab_panel_modules">MODULES</a>
            <a style="color:#000;" href="javascript:void(0)" class="tab-button dark-text" data-viewname="permissions" id="_um_roletab_button_prns" data-target="tab_panel_prns">PERMISSIONS</a>
          </div>
          <div class="tab-body">
            <div class="tab-panel border-style1" data-viewname="users" id="_um_tab_panel_users" style="height:40vw;padding:15px">
              <span style="color:grey;font-weight:bold;font-size:1em;margin-top:10px" id="_um_roletab_users_text">
                Members of the selected role
              </span>
              &nbsp;
              <a href="javascript:void(0)" id="_um_lnkAddRemMember">
                (<i class="fa fa-plus" style="color:green"></i>)
              </a> 
              <table id="_um_tblRoleMembers" class="table"></table>
            </div>
            <div class="tab-panel border-style1" data-viewname="modules" id="_um_tab_panel_modules" style="height:40vw;padding:15px">
                <span style="color:grey;font-weight:bold;font-size:12px" id="_um_roletab_module_text">
                  Accessible modules
                </span>
                &nbsp;
                <a href="javascript:void(0)" id="_um_lnkAddModule">
                  (<i class="fa fa-plus" style="color:green"></i>)
                </a>
                <div style="height:10px;border-bottom:1.2px solid orange;margin-bottom:15px"></div>
                <table id="_um_tblRoleModules" class="table fixed-body-table no-cell-border">
                  <tbody id="_um_tblRoleModules_body" style="height:30vw"></tbody>
                </table>
            </div>
            <div class="tab-panel border-style1" data-viewname="permissions" id="_um_tab_panel_prns" style="height:40vw;padding:15px">
              <a href="javascript:void(0)" style="color:green" id="_um_roleprn_lnk_add">
                <i class="fa fa-plus" style="color:green"></i>
                Manage
              </a>
              &nbsp;&nbsp;
              <a style="display:none" href="javascript:void(0)" style="color:orange" id="_um_roleprn_lnkLargeView">
                <i class="fa fa-list-alt" style="color:orange"></i>
                Advanced
              </a>    
              <div style="height:10px;border-bottom:1.2px solid green"></div>
              <table id="_um_roleprn_tblPrns" class="table fixed-body-table">
                <thead>
                  <tr>                         
                    <th style="width:25%">Code</th>
                    <th style="width:50%">Description</th>
                    <th></th>         
                  </tr>
                </thead>
                <tbody id="_um_roleprn_tblPrns_body" style="height:25vw"></tbody>
              </table>
            </div>
          </div>
        </div>           
      </div>
    </div>
  </div>
  <div id="_um_edit_role" style="width:auto;display:none">
    <div class="row">
      <div class="col-lg-6">
          <a href="javascript:void(0)" id="_um_role_backToRoleList">
            <i class="fa fa-chevron-left" style="color:blue"></i>
            Back
          </a>
          <div style="height:20px"></div>
          <span id="_um_edit_role_title" class="text-secondary d-block p-2"></span>
          <div class="border border-rounded shadow-lg p-3">
            <div class="form-group">
              <label class="control-label">Role Name</label>
              <input type="text" class="form-control" id="_um_edit_role_name" placeholder="Role name" />
            </div>
            <div class="form-group">
              <label class="control-label">User Class</label>
              <select class="form-select modal-select2" id="_um_edit_userclass" placeholder="User Class"></select>
            </div>
          </div>
      </div>
    </div>
    <div class="row" style="margin-top:15px">
      <div class="col-lg-6">
        <div style="float:left">
          <span id="_um_edit_role_error" class="error_text"></span>
        </div> 
        <div style="float:right">
          <button type="button" class="btn btn-warning" id="_um_btnBackToRoleList">
            <i class="fa fa-chevron-left" style="color:blue"></i>
            Back
          </button>
          <button type="button" class="btn btn-primary" id="_um_btnSaveRole">
            <i class="fa fa-save"></i>
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="_um_permissionList">
    <div class="row">
      <div class="col-lg-12">
        <a id="_um_prnlist_backToRoleList" href="javascript:void(0)">
          <i class="fa fa-angle-double-left" style="color:green"></i>
          Back
          &nbsp;&nbsp;
        </a>
        <span id="_um_prnlist_lblTitle" style="color:grey;font-weight:bold;font-size:15px">
          &nbsp;
          Permission List
        </span>
        <a href="javascript:void(0)" id="_um_prnlist_lnkAddPrn">
          (<i class="fa fa-plus" style="color:blue"></i>)
        </a>
        <a id="_um_prnlist_lnkCreatePrn" href="javascript:void(0)" style="float:right">Create permission</a>
        <a id="_um_prnlist_lnkRefeshPrn" href="javascript:void(0)" style="float:right">Refresh Prns</a>
        &nbsp;&nbsp; 
        <div style="margin-bottom:10px;height:5px;border-bottom:1.5px solid #DBEEE1"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8">
        <div class="border-style1 table_wrapper">
          <table class="table fixed-body-table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Descriptive Name</th>
                  <th>Module Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="_um_tblPrns_body" style="height:410px"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="_um_dlgCreatePrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgCreatePrnTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgCreatePrnTitle">Create Permission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-md-6">
            <label for="_um_createprn_module" class="col-form-label" >Permission Number</label>
            <div>
              <input type="number" class="form-control" id="_um_createprn_prn_id">
            </div>
          </div>
          <div class="form-group col-md-6">
            <label for="_um_createprn_module" class="col-form-label" >Permission Name</label>
            <div>
              <input type="text" class="form-control" id="_um_createprn_prn">
            </div>
          </div>
          <div class="form-group col-md-12">
            <label for="_um_createprn_module" class="col-form-label">This permission belongs to</label>
            <div>
              <select class="form-control" id="_um_createprn_module"></select>
            </div>
          </div>
        </div>
        <div>
          <span id="_um_createprn_error" class="error_text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_um_createprn_btnOK">Create Now</button>
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
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>