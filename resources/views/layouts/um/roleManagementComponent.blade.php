<style>
  
  /* .tr-disallowed td.prn-name {
    color: #000;
  } */
  .card:hover{
    cursor: pointer;
    border:1px solid #ffb822 !important;
    
  }

  /* ._row{
    width: 100%;
    flex-wrap:nowrap;
    overflow: scroll;
  }
  
 
  .box{
    width: 3000px;
  } */
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
   
 /* Tab header link styles */
.vs-tab-header a {
    text-decoration: none;
    color: #555;
    padding: 5px 10px;
    font-size: 14px;
    transition: color 0.3s ease;
    position: relative; /* Ensure the :after pseudo-element is positioned relative to the link */
}

/* Highlight active tab */
.vs-tab-header a.active {
    color: #007bff; /* Change to your preferred active color */
}

/* Underline effect on span */
.vs-tab-header a span::after {
    content: '';
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 80%; /* Adjust as needed */
    height: 2px; /* Adjust as needed */
    background-color: #007bff; /* Change to your preferred active color */
    transition: width 0.3s ease; /* Smooth transition for underline */
    transform: scaleX(0); /* Initially hide the underline */
    transform-origin: left; /* Start the underline from the left */
}

.vs-tab-header a.active span::after {
    transform: scaleX(1); /* Show the underline for active tab */
}

/* Optional hover effect */
.vs-tab-header a:hover {
    background-color: #f5f5f5; /* Change to your preferred hover background color */
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
        <div id="_um_rolelist" class="w-90 d-flex flex-row bg-secondary gap-3 p-2" style="overflow-y:hidden; overflow-x:auto">
        </div>    
     </div>
     
    <div class="mt-3 w-100 d-flex flex-column shadow-lg rounded-3 p-2 d-flex flex-row gap-3 bg-white vs-tab-view" id="_um_role_tab">
        <div class="d-flex flex-row gap-2 vs-tab-header">
             <a  href="javascript:void(0)" class="tab-button view_users active" data-target ="view_users"><span class="trans-text" data-langprop="buttons.Users"></span></a>
             <a  href="javascript:void(0)" class="tab-button view_apps" data-target="view_apps"><span class="trans-text" data-langprop="buttons.Applications"></span></a>
             <a  href="javascript:void(0)"  class="tab-button view_modules" data-target="view_modules"><span class="trans-text" data-langprop="buttons.Modules"></span></a>
             <a  href="javascript:void(0)" class="tab-button view_permissions" data-target="view_permissions"><span class="trans-text" data-langprop="buttons.Permissions"></span></a>
             <a   href="javascript:void(0)" class="tab-button view_reports" data-target="view_reports"><span class="trans-text" data-langprop="buttons.Reports"></span></a>
        </div>
        <div class="w-100 p-1 mt-2 vs-tab-body">
           <div id="view_users" data-view="view_users" class="tab-page w-100" style="display:none">
               <div class="h-100 d-flex flex-column flex-wrap p-3">
                  <div class="d-flex flex-row gap-2">
                      <button class="btn btn-sm btn-primary rounded-4"><span class="trans-text" data-langprop="buttons.Add Member"></span></button>
                      <button class="btn btn-sm btn-info rounded-4"><span class="trans-text" data-langprop="buttons.Create User"></span></button>
                  </div>
                  <div class="">
                     <div class="w-100" id="_um_role_user_list"></div>
                  </div>
               </div>
           </div>
           <div id="view_apps" data-view="view_apps" class="tab-page w-100" style="display:none">
               <div class="h-100">
                  <div class="" id="_um_role_app_list"></div>
               </div>
           </div>
           <div id="view_modules" data-view="view_modules" class="tab-page w-100" style="display:none">
               <div class="h-100">
                  <div class="" id="_um_role_mod_list"></div>
               </div>
           </div>
           <div id="view_permissions" data-view="view_permissions" class="tab-page w-100" style="display:none">
               <div class="h-100">
                  <div class="" id="_um_role_prn_list"></div>
               </div>
           </div>
           <div id="view_reports" data-view="view_reports" class="tab-page w-100" style="display:none">
               <div class="h-100">
                  <div class="" id="_um_role_report_list"></div>
               </div>
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