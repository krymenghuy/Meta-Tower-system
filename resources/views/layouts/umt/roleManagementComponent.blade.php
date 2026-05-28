<style>
  
  /* .tr-disallowed td.prn-name {
    color: #000;
  } */
  .card-content:hover{
    cursor: pointer;
    border: 2px solid #194075 !important;
    
  }

.role-card{
  padding: 10px;
} 

.d-flex .app-box {
            flex: 0 0 30%; /* Each child takes up 1/3 of the row */
            box-sizing: border-box; /* Include padding and border in the width */
            padding: 10px; /* Optional padding */
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
div.role-card.selected > div.card-content {
   border:2px solid #194075 !important;
}

.user-table td{
  vertical-align: middle;
}
  
  tr.selected{
     background-color: #72B3E6;
  }
  tr.selected td{
      color:#fff;
  }
  #_um_rolelist{
    overflow:hidden;
  }
</style>

<div id="_um_roleManagementComponent" class="p-3" style="display:none">

    <div id="_um_rolelist_wraper" class="w-100 shadow-lg bg-white rounded-3 p-2 overflow-hidden mt-2">
       
        <div class="d-flex flex-row justify-content-between align-items-center p-1">
            <div class="d-flex flex-row justify-content-between align-items-center" style="min-width:40%">
                 <div>
                    <a data-state="1" href="javascript:void(0)" style="padding: 5px 5px 2px 5px;" class="bg-primary-custom shadow-lg rounded-3" id="um_lnk_toggle_list"></a>
                 </div> 
                 <div class="" id="um_search_widget"></div>
            </div>
            <div class="d-flex flex-row justify-content-between w-100">
                <div class="d-flex flex-row justify-content-start align-items-center p-2">
                    <!-- <span style="border:1.5px dotted blue;border-radius:40%;padding:5px;margin-top:-10px;min-width:30px" class="text-center">15</span> -->
                    <div class="d-flex flex-row justify-content-center align-items-start gap-2 text-primary-custom"><span class=""></span> <h5 id="um_selected_role"></h5></div>  
                </div>
               <div class="d-flex flex-row gap-2">
                      <div class="d-flex align-items-center">
                          <a href="javascript:void(0)" id="_lnkNewRole" class="btnAddNewEdv w-100">
                             <span class=" text-nowrap text-white" vslang="buttons.Add Role">Add Role</span>
                          </a>
                      </div>
                    
                      <div class="d-flex align-items-center">
                          <a href="javascript:void(0)" id="_um_btn_pdf" class="btn-print">
                              <i class="fa fa-print text-white me-2"></i> <span class="text-white" vslang="buttons.Print">Print</span>
                          </a>
                      </div>
               </div>
            </div>
        </div>

        <div id="_um_rolelist" class="w-90 d-flex flex-row bg-secondary gap-3 p-2">
        </div>    
    </div>
     
    <div style="display:none" class="mt-3 w-100 flex-column shadow-lg rounded-3 p-2 d-flex flex-row gap-3 bg-white vs-tab-view" id="_um_role_tab">
        <div class="d-flex flex-row gap-2 vs-tab-header">
             <a  href="javascript:void(0)" class="tab-button view_users active" data-target ="view_users"><span class="" vslang="buttons.Users"></span></a>
             <a  href="javascript:void(0)" class="tab-button view_apps" data-target="view_apps"><span class="" vslang="buttons.Applications"></span></a>
             <a  href="javascript:void(0)"  class="tab-button view_modules" data-target="view_modules"><span class="" vslang="buttons.Modules"></span></a>
             <a  href="javascript:void(0)" class="tab-button view_permissions" data-target="view_permissions"><span class="" vslang="buttons.Permissions"></span></a>
             <a   href="javascript:void(0)" class="tab-button view_reports" data-target="view_reports"><span class="" vslang="buttons.Reports"></span></a>
        </div>
        <div class="w-100 p-1 mt-2 vs-tab-body">
           <div id="view_users" data-view="view_users" class="tab-page w-100" style="display:none">
               <div class="h-100 d-flex flex-column flex-wrap pl-3 pr-3">
                  <div class="d-flex flex-row gap-3">
                     <div class="pt-2">
                        <input type="text" class="form-control" id="_um_role_search_user" placeholder="Search user">
                     </div>
                      <div class="d-flex pt-2">
                        <a href="javascript:void(0)" id="_um_role_add_member" class=""><span class="btnAddNewEdv d-none" vslang="buttons.Add Member">Add Member</span></a>
                        <a href="javascript:void(0)" id="_um_role_create_user" class=""><span class="btnAddNewEdv" vslang="buttons.New User">New User</span></a>
                      </div>
                      <div class="pt-2 gap-3">
                        <a href="javascript:void(0)" id="_um_role_print_user" class="btn-print"> <i class="fa fa-print text-white me-2"> </i><span class="text-white" vslang="buttons.Print Users">Print Users</span></a>
                      </div>
                  </div>
                  <div class="mt-2">
                     <div class="w-100" id="_um_role_user_list"></div>
                  </div>
               </div>
           </div>
           <div id="view_apps" data-view="view_apps" class="tab-page w-100" style="display:none">
               <div class="h-100">
                  <div class="d-flex flex-wrap gap-2 border rounded-2 border-secondary p-2 w-100" id="_um_role_app_list" style="overflow-y:auto;max-height:30vh">
                  </div>
               </div>
           </div>

           <div id="view_modules" data-view="view_modules" class="tab-page w-100" style="display:none">
               <div class="h-100">
                 <form action="">
                    <div id="mod_list" class="d-flex flex-column gap-2">
                        <div class="w-50 d-flex flex-row gap-2 justify-content-start align-items-center">
                           <div style="width:50%"><select class="modal-select2" id="mod_app_chooser"> </select> </div>
                            <div style="width:40%"><input class="form-control" id="mod_search_module" placeholder="search" /> </div>
                            <a href="javascript:void(0)" id="_um_role_print_module" class="btn-print"> <i class="fa fa-print text-white pe-2"> </i><span class=" " vslang="buttons.Modules"></span></a> 
                        </div> 
                        <div id="_um_role_mod_list" class="w-50 mt-2 p-3 m-1 border border-secondary" style="max-height:30vh;overflow-y:auto;"></div> 
                    </div>
                   </form>
               </div>
           </div>

           <div id="view_permissions" data-view="view_permissions" class="tab-page w-100" style="display:none">
               <div class="h-100">
                   <form action="">
                        <div id="mod_list" class="d-flex flex-column gap-2">
                            <div class="w-50 d-flex flex-row gap-2 justify-content-start align-items-center">
                                <div style="width:50%"><select class="modal-select2" id="prn_app_chooser"></select></div>
                                <div style="width:40%"><input id="prn_search" class="form-control" placeholder="Search by code or name" autocomplete="off"></div>
                                <a href="javascript:void(0)" id="_um_role_print_permission" class="btn-print ms-auto"> <i class="fa fa-print text-white pe-2"> </i><span class=" " vslang="buttons.Print"></span></a> 
                            </div>
                            <div id="_um_role_prn_list" class="p-3 w-50 m-1 border border-secondary" style="max-height:30vh;overflow-y:auto;"></div>
                        </div>
                   </form>
               </div>
           </div>

           <div id="view_reports" data-view="view_reports" class="tab-page w-100" style="display:none">
               <div class="h-100">
                 <div id="mod_list" class="d-flex flex-column gap-3">
                  <form action="">
                      <div class="w-50 d-flex flex-row justify-content-start align-items-center gap-2">
                          <div style="width:60%"> <select class="modal-select2" id="rpt_app_chooser"></select></div>
                          <div style="width:40%"><input id="rpt_search" type="text" class="form-control" placeholder="Search by code or name"></div>
                      </div>
                  </form>

                    <div id="_um_role_report_list" class="w-50 p-3 m-1 border border-secondary" style="max-height:30vh;overflow-y:auto;"></div>
                 </div>
               </div>
           </div>
           
        </div>
    </div>
        
</div>
  
<div class="modal fade" id="_um_dlgUser" tabindex="-1" role="dialog" aria-labelledby="_um_dlgUser_title" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title " id="_um_dlgUser_title" vslang="titles.Create user">Create User</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="w-100 d-flex flex-wrap flex-row align-items-center justify-content-center gap-2">
          <div id="_um_user_photo"></div>
          <div style="visibility:hidden" class="d-none d-fle x align-items-center justify-content-center border border-secondary rounded-5 p-3 flex-grow">
            <h5 class="p-2">User may have an official profile details</h5>
          </div>
        </div>

        <div class="row mt-2">
           <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Role Name"></label>
                <select id="_um_nu_role" class="modal-select2 data-input" data-field="role_id"></select>
            </div>
            <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Branch Name"></label>
                <select id="_um_nu_branch_id" class="modal-select2 data-input" data-field="branch_id"></select>
            </div>
            <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.User Class"></label>
                <select id="um_nu_user_class" class="modal-select2 data-input" data-field="user_class"></select>
            </div>
          
             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Official ID"></label>
                <input id="_um_nu_official_code" class="form-control data-input" data-field="official_code" />
             </div>

             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Full Name"></label>
                <input class="form-control data-input" data-field="full_name" />
             </div>

             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Phone Number"></label>
                <input class="form-control data-input" data-field="phone_number" />
             </div>

             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Email"></label>
                <input class="form-control data-input" data-field="email" />
             </div>
             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Login Name"></label>
                <input class="form-control data-input" data-field="login_name" />
             </div>
        </div>

        <div class="row">
             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Password"></label>
                <input type="password" class="form-control data-input" data-field="password" />
             </div>
             <div class="form-group col-6">
                <label for="" class="form-label " vslang="titles.Confirm Password"></label>
                <input type="password" class="form-control data-input" data-field="confirm_password" />
             </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary " data-bs-dismiss="modal" vslang="buttons.Cancel"></button>
        <button type="button" class="btn btn-primary " id="_um_dlgUser_btnSave" vslang="buttons.save"></button>
      </div>
    </div>
  </div>
</div>
  
<!-- <div class="modal fade" id="_um_dlgRole" tabindex="-1" role="dialog" aria-labelledby="_um_dlgRole_title" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title " id="_um_dlgRole_title" vslang="titles.Add Role">New Role</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
            <div class="form-group col-12">
                <label for="" class="form-label " vslang="titles.Role Group"></label>
                <select id="um_new_role_group" class="modal-select2"></select>
            </div>
            <div class="form-group col-12">
                <label for="" class="form-label " vslang="titles.Role Name"></label>
               <div><input type="text" class="form-control" id="um_new_role_name"> </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary " data-bs-dismiss="modal" vslang="buttons.Cancel"></button>
        <button type="button" class="btn btn-primary " id="_um_dlgRole_btnSave" vslang="buttons.save"></button>
      </div>
    </div>
  </div>
</div> -->

<div class="modal fade" id="_um_dlgFindUser" tabindex="-1" role="dialog" aria-labelledby="_um_dlgFindUser_title" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title " id="_um_dlgFindUser_title" vslang="titles.Find Users">Find Users</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form action="">
                 <div class="d-flex flex-row gap-2">
                    <input type="text" class="form-control search-user" placeholder="Search user" />
                  </div>
    
                <div class="p-2 m-2 w-100">
                  <div id="_um_role_found_user_list">
                    <h4>Here, you can find existing users!</h4>
                  </div>
                </div>
        </form> 
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary " data-bs-dismiss="modal" vslang="buttons.Cancel"></button>
        <button type="button" class="btn btn-primary " id="_um_dlgFindUser_btnOK" vslang="buttons.OK"></button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="dlg_print_" tabindex="-1" aria-labelledby="dlg_print_title" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="dlg_print_elBody" class="modal-body"></div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-vs-cancel" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_print_btn" type="button" class="btn btn-vs-save">
                    <span class="" vslang="buttons.Print Now"></span>
                </button>
            </div>
        </div>
    </div>
</div>