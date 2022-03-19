<style>
   table#_um_tblRoleModules>tbody td{
       padding:5px;
       font-size:18px;
       margin-top:5px;
       font-weight:bold;
       
   }
</style>

<div id="_um_roleManagementComponent" style="width:auto;display:none;margin:15px 15px 15px">
    <!--begin::div.row  RoleList-->
        <div id="_um_roleListPanel" style="width:auto;display:none">
          <div class="row">
            <div class="col-lg-6">
                    <div style="height:20px"></div>            
                    <a href="#" id="_um_lnkNewRole"><i class="fa fa-plus" style="color:green;"></i> New Role</a>
                    <div style="height:10px"></div>    
                    <div class="table_wrapper border-style1" style="height:420px">
                            <table id="_um_tblRoles" class="table fixed-body-table no-cell-border">
                                        <thead>
                                          <tr>                         
                                            <th>Role Name</th>
                                            <th>Users</th>      
                                            <th></th>         
                                          </tr>
                                          </thead>
                                <tbody id="_um_tblRoles_body" style="height:370px;">
                                </tbody>   
                            </table>
                    </div>                  
            </div><!--end: div.col-lg-6-->

              <div class="col-lg-6">
                    <div class="tab-view" id="_um_roleTabView"> 
                      <div class="tab-header">
                        <a href="#" class="tab-button" data-viewname="users" id="_um_roletab_button_users" data-target="tab_panel_users">USERS</a>
                        <a href="#" class="tab-button" data-viewname="modules" id="_um_roletab_button_modules" data-target="tab_panel_modules">MODULES</a>
                        <a href="#" class="tab-button" data-viewname="permissions" id="_um_roletab_button_prns" data-target="tab_panel_prns">PERMISSIONS</a>
                      </div>
                      <div class="tab-body">
                          <div class="tab-panel border-style1" data-viewname="users" id="_um_tab_panel_users" style="height:420px;padding:15px">
                                <span style="color:grey;font-weight:bold;font-size:12px" id="_um_roletab_users_text">Members of the selected role</span>
                                &nbsp;<a href="#" id="_um_lnkAddRemMember">(<i class="fa fa-plus" style="color:green"></i>)</a>    
                                <div style="height:10px;border-bottom:1.2px solid red"></div>
                                <table id="_um_tblRoleMembers" class="table fixed-body-table">
                                              <thead>
                                                <tr>                         
                                                  <th>Login</th>
                                                  <th>Full Name</th>
                                                  <th>Official ID</th>
                                                  <th>Phone</th>   
                                                  <th></th>         
                                                </tr>
                                                </thead>
                                      <tbody id="_um_tblRoleMembers_body" style="height:320px;">
                                      </tbody>   
                                  </table>
                          </div>
                          <div class="tab-panel border-style1" data-viewname="modules" id="_um_tab_panel_modules" style="height:420px;padding:15px">
                              <span style="color:grey;font-weight:bold;font-size:12px" id="_um_roletab_module_text">Accessible modules</span> 
                              &nbsp;<a href="#" id="_um_lnkAddModule">(<i class="fa fa-plus" style="color:green"></i>)</a>  
                                <div style="height:10px;border-bottom:1.2px solid orange;margin-bottom:15px"></div>
                              <table id="_um_tblRoleModules" class="table fixed-body-table no-cell-border">
                                <tbody id="_um_tblRoleModules_body" style="height:350px"> 
                                </tbody>
                              </table>
                          </div>
                          <div class="tab-panel border-style1" data-viewname="permissions" id="_um_tab_panel_prns" style="height:420px;padding:15px">
                                <a href="#" id="_um_roleprn_lnk_add"><i class="fa fa-plus" style="color:green"></i> Add Permission</a>
                                &nbsp;&nbsp;<a href="#" id="_um_roleprn_lnkLargeView"><i class="fa fa-list-alt" style="color:orange"></i> Larger view</a>    
                                <div style="height:10px;border-bottom:1.2px solid green"></div>
                                <table id="_um_roleprn_tblPrns" class="table fixed-body-table">
                                              <thead>
                                                <tr>                         
                                                  <th style="width:70px">Number</th>
                                                  <th>Description</th>
                                                  <!-- <th>Module Name</th>   -->
                                                  <th></th>         
                                                </tr>
                                                </thead>
                                      <tbody id="_um_roleprn_tblPrns_body" style="height:320px;">
                                      </tbody>   
                                  </table>
                          </div>
                      </div><!--end:div.tab-body-->
                  </div>                 
              </div>
          </div>

          <div class="row" style="margin-top:15px;">
              <div class="col-lg-12">
                  <div style="float:right">
                    <button type="button" class="btn btn-primary" id="_um_btnCloseRoleList"><i class="fa fa-times"></i> Close </button>
                  </div>
              </div>
          </div>
        </div>
    <!--end:: div#_um_roleListPanel-->

      <!--begin::div#_um_edit_role-->
      <div id="_um_edit_role" style="width:auto;display:none">
          <div class="row">
              <div class="col-lg-6">
                  <a href="#" id="_um_role_backToRoleList"><i class="fa fa-chevron-left" style="color:blue"></i> Back</a> 
                  <div style="height:15px;width:60%;border-bottom:1.5px solid green;"></div>  
                  <div class="form-group">
                    <label class="control-label">Role Name</label>
                    <input type="text" class="form-control" id="_um_edit_role_name" placeholder="Role name" />
                  </div>
                  <div class="form-group">
                    <label class="control-label">User Class</label>
                    <select class="form-control" id="_um_edit_userclass" placeholder="User Class"></select>
                  </div>
              </div>
          </div> 

          <div class="row" style="margin-top:15px;">
            <div class="col-lg-6">
                <div style="float:left">
                  <span id="_um_edit_role_error" class="error_text"></span>
                </div> 
                <div style="float:right">
                  <button type="button" class="btn btn-warning" id="_um_btnBackToRoleList"><i class="fa fa-chevron-left" style="color:blue"></i> Back</button>
                  <button type="button" class="btn btn-primary" id="_um_btnSaveRole"><i class="fa fa-save"></i> Save</button>
                </div>
            </div>
        </div>

      </div>
      <!--end::div#_um_edit_role-->

      <!--begin::PermissionList-->
      <div id="_um_permissionList">
        <div class="row">
          <div class="col-lg-12">
              <a id="_um_prnlist_backToRoleList" href="#"><i class="fa fa-angle-double-left" style="color:green"></i>Back&nbsp;&nbsp;</a><span id="_um_prnlist_lblTitle" style="color:grey;font-weight:bold;font-size:15px">&nbsp; Permission List</span><a href="#" id="_um_prnlist_lnkAddPrn"> (<i class="fa fa-plus" style="color:blue"></i>)</a> 
              <a id="_um_prnlist_lnkCreatePrn" href="#" style="float:right">Create permission</a>
              <a id="_um_prnlist_lnkRefeshPrn" href="#" style="float:right">Refresh Prns</a>&nbsp;&nbsp; 
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
      <!--end::PermissionList-->

</div> <!--end::div#_um_roleListComponent--->
 
<!--begin::CreatePermissionDialog-->
<div class="modal fade" id="_um_dlgCreatePrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgCreatePrnTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgCreatePrnTitle">Create Permission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
         <div class="form-group">
            <label for="_um_createprn_module" class="col-form-label" >Permission Name</label>
            <input type="text" class="form-control" id="_um_createprn_prn">
          </div>
         <div class="form-group">
            <label for="_um_createprn_module" class="col-form-label" >This permission belongs to</label>
            <select class="form-control" id="_um_createprn_module"></select>
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
<!--endn::CreatePermissionDialog-->

<!--begin::AddPermissionDialog-->
<div class="modal fade" id="_um_dlgAddPrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgAddPrnTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgAddPrnTitle">Add Permission</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
         <div class="form-group">
            <label class="col-form-label" >Permission Number</label>
            <input type="text" class="form-control" id="_um_addprn_search">
          </div>
         <div class="table_wrapper">
            <table id="_um_addprn_tblPrns" class="table fixed-body-table">
             <thead>
               <tr>
                 <th></th>
                 <th>Code</th>
                 <th>Name</th>
               </tr>
             </thead>
             <tbody id="_um_addprn_tblPrns_body" style="max-height:350px">
             </tbody>
            </table> 
          </div>
        <div>
          <span id="_um_addprn_error" class="error_text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_um_addprn_btnOK">Add Now</button>
      </div>
    </div>
  </div>
</div>
<!--endn::AddPermissionDialog-->

<script defer src="{{ asset('js/RoleManagementComponent.js') }}"></script>