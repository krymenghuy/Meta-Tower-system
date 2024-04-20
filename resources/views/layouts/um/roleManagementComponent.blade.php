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

  .row{
    width: 100%;
    flex-wrap:nowrap;
    overflow-x: scroll;
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
    .btn-circle {
      width: 100px; /* Set width */
      height: 100px; /* Set height */
      border-radius: 50%; /* Make it circular */
      font-size: 24px; /* Set font size */
    }
  
 
</style>

<div id="_um_roleManagementComponent">
  <div class="d-flex">
    <div class="d-flex gap-2">
      <div class="input-group input-group-sm flex-nowrap width--search-inner shadow d-none d-sm-none d-md-flex d-lg-flex">
        <input type="search" class="form-control form-control-sm" placeholder="Search role" id="_um_search_user"/>
        <div class="input-group-text">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <div class="width--search-inner-sm d-none d-sm-none d-md-none d-lg-block shadow">
          <select id="_um_filter_userclass" class="modal-select2"></select>
      </div>
    </div>
    <div class="justify-content-end w-100 d-none d-sm-none d-md-flex d-lg-flex">
        <button id="_um_btn_pdf" class="btn btn-sm btn-danger rounded-5" type="button">
          <i class="fa fa-file-pdf"></i> <span class="trans-text" data-langprop="buttons.PDF"></span>
        </button>
    </div>
  </div>

  <div id="_um_roleListPanel">
    <div class="row bg-white shadow mt-4">
      <div class="col-sm-2 box">

        <div id="_cord"></div>
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
      </div> 

        <div class="add  p-5">
          <button id="_um_btn_new" class="btn btn-sm btn-danger  btn-circle shadow text-nowrap " type="button">
                      <i class="fa fa-user-plus"><span class="trans-text text-nowrap" data-langprop="buttons.New Role"></span></i>
          </button>
        </div>
    </div>
      
  </div>

  <div class="d-flex flex-fow gap-2 justify-content-start m-3 shadow border rounded-3 ">
    <div class="tab-header gap-2 set-parent-active m-3 p-2">
      <button class="btn-um-application btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
        <span class="text-nowrap">Application</span>
      </button>
      <button class="btn-um-module btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
          <span class="text-nowrap">Module</span>
      </button>
      <button class="btn-um-permissions btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
          <span class="text-nowrap">Permissions</span>
      </button>
      
      <button class="btn-um-reports btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="360" data-user="01234567890">
          <span class="text-nowrap">Reports</span>
      </button>
      <button class="btn-um-lock btn btn-sm btn-outline-danger rounded-4 mr-3" data-id="761" data-user="013777999" data-lock="lock">
          <span class="text-nowrap">Lock</span>
      </button>
      <button class="btn-um-set-password btn btn-sm btn-outline-danger rounded-4 mr3" data-id="761" data-user="013777999" data-lock="lock">
          <span class="text-nowrap">Set Password</span>
      </button>
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