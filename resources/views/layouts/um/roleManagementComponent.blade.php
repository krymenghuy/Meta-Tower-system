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
          <i class="fa fa-file-pdf"></i> <span class="trans-text" data-langprop="buttons.PDF"></span>
        </button>

        <button  id="_lnkNewRole" class="btn btn-sm btn-primary mr-5 btn-circle shadow text-nowrap " type="button">
            <i class="fa fa-user-plus"><span class="trans-text text-nowrap" data-langprop="buttons.New Role"></span></i>
        </button>
    </div>
  </div>

  <div id="_um_roleListPanel">
     <div class="row _row bg-white shadow ml-1 mt-4">
        <div id="_card">
      <!-- <div class="col-sm-2 box">
            <div class="card bg-white shadow p-3 border rounded-3 m-3">
              <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
                <span class="data-input text-success fs-5 fw-semibold" data-field="user_class">Customer</span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >User Class: Admin</span>
                <span class=" role_name_title"> 
                  <script>
                    document.write("Customer".charAt(0).toUpperCase());
                  </script>
                </span>
              </div>
                <span class="pg-alert-card-line" style="width:100%"></span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >Total Member: 31</span>
            </div> 
        </div>  -->
        </div>

      </div> 
  </div>

  <div class="d-flex flex-fow gap-2 justify-content-start mt-3 shadow border rounded-3 ">
    <!-- <div class="tab-header gap-2 set-parent-active m-3 p-2">
      <button class="btn-um-application btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
        <span class="text-nowrap">Application</span>
      </button>
      <button class="btn-um-module btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
          <span class="text-nowrap">Module</span>
      </button>
       <button class="btn-um-reports btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
          <span class="text-nowrap">Reports</span>
      </button>
      <button class="btn-um-permissions btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
          <span class="text-nowrap">Permissions</span>
      </button>
    </div> -->
    <div class="col-lg-12 ">
        <div class="tab-view" id="_um_roleTabView">
          <div class="tab-header gap-2 set-parent-active mt-3 ">
            <a href="javascript:void(0)" class="tab-button" data-viewname="appication" id="_um_roletab_button_application" data-target="tab_panel_application">
              <span class="bg-white p-2 mr-3  rounded-3">Application</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="modules" id="_um_roletab_button_modules" data-target="tab_panel_modules">
              <span class="bg-white p-2 mr-3 rounded-3">MODULES</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="report" id="_um_roletab_button_report" data-target="tab_panel_report">
              <span class="bg-white p-2 mr-3 rounded-3">Report</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="permissions" id="_um_roletab_button_prns" data-target="tab_panel_prns">
              <span class="bg-white rounded-3 p-2 mr-3">PERMISSIONS</span>
            </a>
          </div>
          <div class="tab-body">
            
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
                <input type="text" class="form-control" id="role_name" data-field="name" placeholder="Role name" />
              </div>
              <div class="form-group col-md-6">
                <label class="control-label ">User Class</label>
                <div class="min-width-select max-width-select">
                  <select class="modal-select2" id="user_class" data-field="user_class" placeholder="User Class"></select>
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