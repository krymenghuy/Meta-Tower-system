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
</style>

<div id="_um_roleManagementComponent" style="width:auto;display:none;margin:15px 15px 15px">
  <div id="_um_roleListPanel" style="display:none">
    <div class="row">
      <div class="col-lg-4">
        <div class="bg-white p-3 rounded-top-3">
          <span class="fs-bold p-1 text-body-secondary">AVAILABLE ROLES</span>
          <a href="javascript:void(0)" id="_um_lnkNewRole">
            <i class="fa fa-plus-circle text-success fs-5"></i>
          </a>
        </div>
        <div class="d-flex flex-column p-3 bg-white rounded-bottom-3" style="height:40vw">
          <div class="d-flex flex-row gap-2">
             <input id="_um_search_user_role" type="text" class="form-control" placeholder="Search user or role">
          </div>
          <div class="d-flex table-responsive-hover mt-2">
            <table id="_um_tblRoles" class="table">
                <tbody id="_um_tblRoles_body"></tbody>
              </table>
          </div>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="tab-view" id="_um_roleTabView">
          <div class="tab-header gap-2 set-parent-active">
            <a href="javascript:void(0)" class="tab-button" data-viewname="users" id="_um_roletab_button_users" data-target="tab_panel_users">
              <span class="bg-white p-2 rounded-3">USERS</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="modules" id="_um_roletab_button_modules" data-target="tab_panel_modules">
              <span class="bg-white p-2 rounded-3">MODULES</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="permissions" id="_um_roletab_button_prns" data-target="tab_panel_prns">
              <span class="bg-white rounded-3 p-2">PERMISSIONS</span>
            </a>
          </div>
          <div class="tab-body">
            <div class="tab-panel border-style1 p-3 bg-white mt-4 rounded-3" data-viewname="users" id="_um_tab_panel_users" style="height:40vw">
              <span class="text-body-secondary fw-bold fs-6" id="_um_roletab_users_text">Members of the selected role</span>
              <a href="javascript:void(0)" id="_um_lnkAddRemMember">
                (<i class="fa fa-plus fs-5 text-success"></i>)
              </a>
              <div class="border p-3 mt-2 rounded-3">
                 <div class="w-100" id="_div_role_members"></div>
              </div>
            </div>
            <div class="tab-panel border-style1 p-3 rounded-3 bg-white mt-4" data-viewname="modules" id="_um_tab_panel_modules" style="height:40vw">
              <span class="text-body-secondary fw-bold" id="_um_roletab_module_text">Accessible modules</span>
              <a href="javascript:void(0)" id="_um_lnkAddModule">
                (<i class="fa fa-plus fs-5 text-success"></i>)
              </a>
              <div style="height:10px;border-bottom:1.2px solid orange;margin-bottom:15px"></div>
              <div class="table-responsive table-responsive-hover border rounded-3" style="height:90%">
                <table id="_um_tblRoleModules" class="table fixed-body-table no-cell-border">
                  <tbody id="_um_tblRoleModules_body"></tbody>
                </table>
              </div>
            </div>
            <div class="tab-panel border-style1 bg-white rounded-3 mt-4" data-viewname="permissions" id="_um_tab_panel_prns" style="height:40vw">
              <div class="d-flex align-items-center px-2">
                <a href="javascript:void(0)" id="_um_roleprn_lnk_add">
                  <i class="fa fa-plus fs-5 text-success"></i>
                  <span>Manage</span>
                </a>
              </div>
              <div style="height:10px;border-bottom:1.2px solid green"></div>
              <div class="table-responsive table-responsive-hover mt-2 rounded-3">
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
  </div>
  
  <div id="_um_edit_role" style="display:none">
    <div class="bg-white p-3 rounded-3">
      <div class="row">
        <div class="col-lg-6">
          <a href="javascript:void(0)" id="_um_role_backToRoleList">
            <i class="fa fa-chevron-left text-primary"></i>
            <span class="p-2 bg-warning-subtle rounded-3">Back</span>
          </a>
          <div style="height:20px"></div>
          <span id="_um_edit_role_title" class="text-dark p-2"></span>
          <div class="border border-rounded p-3 rounded-3 mt-2">
            <div class="form-group">
              <label class="control-label">Role Name</label>
              <input type="text" class="form-control" id="_um_edit_role_name" placeholder="Role name" />
            </div>
            <div class="form-group">
              <label class="control-label">User Class</label>
              <div class="min-width-select max-width-select">
                <select class="modal-select2" id="_um_edit_userclass" placeholder="User Class"></select>
              </div>
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
              <span>Back</span>
            </button>
            <button type="button" class="btn btn-primary" id="_um_btnSaveRole">
              <i class="fa fa-save"></i>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="_um_permissionList">
    <div class="row">
      <div class="col-lg-12">
        <a id="_um_prnlist_backToRoleList" href="javascript:void(0)">
          <i class="fa fa-angle-double-left text-success"></i>
          <span>Back</span>
        </a>
        <span id="_um_prnlist_lblTitle" class="text-body-secondary">Permission List</span>
        <a href="javascript:void(0)" id="_um_prnlist_lnkAddPrn">
          (<i class="fa fa-plus text-primary"></i>)
        </a>
        <a id="_um_prnlist_lnkCreatePrn" href="javascript:void(0)" style="float:right">Create permission</a>
        <a id="_um_prnlist_lnkRefeshPrn" href="javascript:void(0)" style="float:right">Refresh Prns</a>
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
</div>


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
    .set-parent-active .active span {
    border:1px solid #ffb822 !important;
    background-color: #dfdfdf87 !important;
    color: #0022ff;
}
  
 
</style>

<div id="_um_roleManagementComponent" class="p-3">
  <div class="d-flex bg-white shadow p-3" id="div_filter_fields">
    <div class="d-flex gap-2" >
      <div class="input-group input-group-sm flex-nowrap width--search-inner shadow d-none d-sm-none d-md-flex d-lg-flex">
        <input type="search" class="form-control " placeholder="Search role" id="_search_role"/>
       
        <button id="_role_btnSearch" class="btn btn-primary" type="button"><i class="fa fa-search text-white"></i></button>

      </div>
      
    </div>
    <div class="justify-content-end w-100 d-none d-sm-none d-md-flex d-lg-flex">
        <button id="_um_btn_pdf" class="btn btn-sm btn-primary mr-5 rounded-5" type="button">
          <i class="fa fa-file-pdf"></i> <span class="" vslang="buttons.PDF"></span>
        </button>

        <button  id="_lnkNewRole" class="btn btn-sm btn-primary mr-5 btn-circle shadow text-nowrap " type="button">
            <i class="fa fa-user-plus"><span class=" text-nowrap" vslang="buttons.New Role"></span></i>
        </button>
    </div>
  </div>

  <div id="_um_roleListPanel">
     <div class="row _row bg-white shadow ml-1 mt-4">
        <div id="_card">
    
        </div>

      </div> 
  </div>

  <div class="d-flex flex-fow gap-2 justify-content-start mt-3 shadow border rounded-3 ">

    
    <div class="col-lg-12" id="_um_tblRoles" >
        <div class="tab-view" id="_um_roleTabView">
          <div class="tab-header gap-2 set-parent-active mt-3 ">
            <a href="javascript:void(0)" class="tab-button" data-viewname="users" id="_um_roletab_button_users" data-target="tab_panel_users">
                <span class="bg-white p-2 mr-3 rounded-3">USERS</span>
              </a>
            
            <a href="javascript:void(0)" class="tab-button" data-viewname="applications" id="_um_roletab_button_applications" data-target="tab_panel_application">
              <span class="bg-white p-2 mr-3  rounded-3">APPLICATIONS</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="permissions" id="_um_roletab_button_prns" data-target="tab_panel_prns">
              <span class="bg-white rounded-3 p-2 mr-3">PERMISSIONS</span>
            </a>
           
            <a href="javascript:void(0)" class="tab-button" data-viewname="reports" id="_um_roletab_button_report" data-target="tab_panel_report">
              <span class="bg-white p-2 mr-3 rounded-3">REPORTS</span>
            </a>
            
          </div>
          <div class="tab-body">


            <div class="tab-panel border-style1 p-3 bg-white mt-4 rounded-3" data-viewname="users" id="_um_tab_panel_users" style="height:40vw">
             
            <span class="text-body-secondary fw-bold fs-6" id="_um_roletab_users_text">Members of the selected role</span>
              <a href="javascript:void(0)"  id="_um_lnkAddRemMember">
                <span>(<i class="fa fa-plus fs-5 text-success"></i>)</span>
              </a>
              <div class="border p-3 mt-2 rounded-3">
                 <div class="w-100  _member_scroll overflow-auto " id="_div_role_members"style="height:300px;"></div>
              </div>
            </div>

          <!-- <div class="tab-panel border-style1 p-3 rounded-3 bg-white mt-4" data-viewname="applications" id="_um_tab_panel_applications" style="height:40vw">
              <span class="text-body-secondary fw-bold" id="_um_roletab_module_text">Application</span>
              <a href="javascript:void(0)" id="_um_lnkAddModule">
                (<i class="fa fa-plus fs-5 text-success"></i>)
              </a>
              <div style="height:10px;border-bottom:1.2px solid orange;margin-bottom:15px"></div>
              <div class="table-responsive table-responsive-hover border rounded-3" style="height:90%">
                <table id="_um_tblRoleModules" class="table fixed-body-table no-cell-border">
                  <tbody id="_um_tblRoleModules_body">
                  
                  </tbody>
                </table>
              </div>
            </div> -->
            <div class="tab-panel border-style1 p-3 rounded-3 bg-white mt-4" data-viewname="applications" id="_um_tab_panel_applications" style="height:40vw">
              <span class="text-body-secondary fw-bold" id="_um_roletab_application_text">Application</span>
              <a href="javascript:void(0)" id="_um_lnkAddApplication">
                (<i class="fa fa-plus fs-5 text-success"></i>)
              </a>
              <div style="height:10px;border-bottom:1.2px solid orange;margin-bottom:15px"></div>
              <div class="table-responsive table-responsive-hover border rounded-3" style="height:90%">
                <table id="_um_tblRoleApplications" class="table fixed-body-table no-cell-border">
                  <tbody id="_um_tblRoleApplication_body">
                    <div class="app p-3 m-3">
                    <div class="form-check ">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                      <label class="form-check-label" for="flexRadioDefault1">
                        DMS
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                      <label class="form-check-label" for="flexRadioDefault2">
                        ABM
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                      <label class="form-check-label" for="flexRadioDefault2">
                        
                      </label>
                    </div>
                    </div>

                  
                  </tbody>
                </table>
              </div>
            </div>

            
            
          <div class="tab-panel border-style1 bg-white rounded-3 mt-4" data-viewname="permissions" id="_um_tab_panel_prns" style="height:40vw">
              <div class="d-flex align-items-center px-2">
                <a href="javascript:void(0)" id="_um_roleprn_lnk_add">
                  <i class="fa fa-plus fs-5 text-success"></i>
                  <span>Manage</span>
                </a>
              </div>
              <div style="height:10px;border-bottom:1.2px solid green"></div>
              <div class="table-responsive table-responsive-hover mt-2 rounded-3">
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

            
          <div class="tab-panel border-style1 p-3 rounded-3 bg-white mt-4" data-viewname="reports" id="_um_tab_panel_reports" style="height:40vw">
              <span class="text-body-secondary fw-bold" id="_um_roletab_module_text">Report</span>
              <a href="javascript:void(0)" id="_um_lnkAddModule">
                (<i class="fa fa-plus fs-5 text-success"></i>)
              </a>
              <div style="height:10px;border-bottom:1.2px solid orange;margin-bottom:15px"></div>
              <div class="table-responsive table-responsive-hover border rounded-3" style="height:90%">
                <table id="_um_tblRoleModules" class="table fixed-body-table no-cell-border">
                  <tbody id="_um_tblRoleModules_body"></tbody>
                </table>
              </div>
          </div>

          </div>
        </div>
      </div>
  </div>

  

</div> 

<div class="modal fade" id="roleDialog" tabindex="-1" role="dialog" aria-labelledby="_role_dlgTitle" aria-hidden="true">
    <div class="modal-dialog modal-md vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " id="_role_dlgTitle" vslang="titles.Creating a new role"></h5>
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
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal"><span class="" vslang="buttons.Cancel"></span></button>
                <button type="button" class="btn btn-primary height" id="_role_dlg_btnOK"><span class="" vslang="buttons.Create"></span></button>
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