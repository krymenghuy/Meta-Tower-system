<style>
  /* .tr-disallowed td.prn-name {
    color: #000;
  } */
  .card:hover {
    cursor: pointer;
    border: 1px solid #ffb822 !important;

  }

  /* ._row{
    width: 100%;
    flex-wrap:nowrap;
    overflow: scroll;
  }
  
 
  .box{
    width: 3000px;
  } */
  .role_name_title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 75px;
    height: 70px;
    border-radius: 10px;
    background-color: #ffb822;
    color: white;
    font-size: 20px;

  }

  /* Tab header link styles */
  .vs-tab-header a {
    text-decoration: none;
    color: #555;
    padding: 5px 10px;
    font-size: 14px;
    transition: color 0.3s ease;
    position: relative;
    /* Ensure the :after pseudo-element is positioned relative to the link */
  }

  /* Highlight active tab */
  .vs-tab-header a.active {
    color: #007bff;
    /* Change to your preferred active color */
  }

  /* Underline effect on span */
  .vs-tab-header a span::after {
    content: '';
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 80%;
    /* Adjust as needed */
    height: 2px;
    /* Adjust as needed */
    background-color: #007bff;
    /* Change to your preferred active color */
    transition: width 0.3s ease;
    /* Smooth transition for underline */
    transform: scaleX(0);
    /* Initially hide the underline */
    transform-origin: left;
    /* Start the underline from the left */
  }

  .vs-tab-header a.active span::after {
    transform: scaleX(1);
    /* Show the underline for active tab */
  }

  /* Optional hover effect */
  .vs-tab-header a:hover {
    background-color: #f5f5f5;
    /* Change to your preferred hover background color */
  }

  div.role-card.selected>div.card-content {
    border: 2px solid green !important;
  }

  .user-table td {
    vertical-align: middle;
  }

  tr.selected {
    background-color: #72B3E6;
  }

  tr.selected td {
    color: #fff;
  }

  #_um_rolelist {
    overflow: hidden;
  }

  #_um_rolelist:hover {
    overflow: auto;
  }
</style>

<div id="_um_roleManagementComponent" class="p-3" style="display:none">
  <div class="d-flex flex-row flex-wrap justify-content-between align-items-between p-1 bg-white shadow rounded-3 p-3"
    id="div_filter_fields">
    <div class="d-flex flex-row gap-2">
      <input type="search" class="form-control border border-secondary rounded-4" placeholder="Search role "
        id="_search_role" />
    </div>
    <div class="d-flex flex-row gap-2">
      <button id="_lnkNewRole" class="btn btn-sm btn-primary rounded-5" type="button">
        <span class="trans-text text-nowrap" data-langprop="buttons.Add Role"></span></i>
      </button>
      <button id="_um_btn_pdf" class="btn btn-sm btn-danger mr-5 rounded-5" type="button">
        <i class="fa fa-file-pdf"></i>&nbsp;<span class="trans-text text-white" data-langprop="buttons.PDF"></span>
      </button>
    </div>
  </div>

  <div id="_um_rolelist_wraper" class="w-100 shadow-lg bg-white rounded-3 p-2 overflow-hidden mt-2">
    <div id="_um_rolelist" class="w-90 d-flex flex-row bg-secondary gap-3 p-2">
    </div>
  </div>

  <div style="display:none"
    class="mt-3 w-100 flex-column shadow-lg rounded-3 p-2 d-flex flex-row gap-3 bg-white vs-tab-view" id="_um_role_tab">
    <div class="d-flex flex-row gap-2 vs-tab-header">
      <a href="javascript:void(0)" class="tab-button view_users active" data-target="view_users"><span
          class="trans-text rounded-3  p-2" data-langprop="buttons.Users">Users</span></a>
      <a href="javascript:void(0)" class="tab-button view_apps" data-target="view_apps"><span class="trans-text"
          data-langprop="buttons.Applications"></span></a>
      <a href="javascript:void(0)" class="tab-button view_modules" data-target="view_modules"><span class="trans-text"
          data-langprop="buttons.Modules"></span></a>
      <a href="javascript:void(0)" class="tab-button view_permissions" data-target="view_permissions"><span
          class="trans-text" data-langprop="buttons.Permissions"></span></a>
      <a href="javascript:void(0)" class="tab-button view_reports" data-target="view_reports"><span class="trans-text"
          data-langprop="buttons.Reports"></span></a>
    </div>
    <div class="w-100 p-2 m-3 vs-tab-body">
   
      <div id="view_users" data-view="view_users" class="tab-page w-100" style="display:none">
        <div class="h-100 d-flex flex-column flex-wrap pl-3 pr-3">
          <div class="d-flex flex-row gap-2">
            <div>
              <input type="text" class="form-control form-control-sm rounded-4 border border-secondary"
                id="_um_role_search_user" placeholder="Search user">
            </div>
            <div class="d-flex pt-2 gap-2">
              <a href="javascript:void(0)" id="_um_role_add_member" class=""><span
                  class="trans-text pr-2 pl-2 p-1 bg-primary text-white border border-primary rounded-4"
                  data-langprop="buttons.Add Member"></span></a>
              <a href="javascript:void(0)" id="_um_role_create_user" class=""><span
                  class="trans-text pr-2 pl-2 p-1 bg-primary text-white border border-primary rounded-4"
                  data-langprop="buttons.Create User"></span></a>
            </div>
          </div>
          <div class="mt-2">

            <div id="_um_role_user_list" class="w-100 overflow-y-auto" style="height:400px;" ></div>
          </div>
        </div>
      </div>

      <div id="view_apps" data-view="view_apps" class="tab-page overflow-y-auto w-100" style="height:400px;">
        <div class="h-100">
       
          <div class="w-50 p-4" id="_um_role_app_list">
            <!-- <div class="p-1 d-flex flex-column gap-3 justify-contents-start">
              <div class="app-box d-flex justify-content-between">
                <div class="d-flex gap-2 rounded-4 shadow-lg p-2 justify-contents-center align-items-center"
                  style="width:370px">
                  <img class="border border-secondary rounded-5" style="width:40px;height:40px"
                    src="/uploads/public/1_data/default/images/mr1.jpg" alt="">
                  <h5 class="">Delivery Management System</h5>
                </div>
                <div class="d-flex gap-4 align-items-center justify-content-center">
                  <span class=" border border-secondary " style="width:30px;height:30px"><i
                      class="fa fa-check text-success fs-3 fw-bold "></i></span>
                  <div> <button class="btn btn-sm btn-primary rounded-4">Allow</button> </div>
                </div>
              </div>



            </div> -->
          </div>
        </div>
      </div>
      <div id="view_modules" data-view="view_modules" class="tab-page overflow-y-auto w-100" style="height:400px;">
        <div class="h-100">
          <div class="p-2" id="_um_role_list_container">
            <div id="_um_role_mod_list" class="w-50 p-2">
             

            </div>
          </div>
        </div>
      </div>
      <div id="view_permissions" data-view="view_permissions" class="tab-page overflow-y-auto w-100"
        style="height:400px;">
        <div class="h-100">
          <div class="w-50 p-4" id="_um_role_prn_list"></div>
        </div>
      </div>
      <div id="view_reports" data-view="view_reports" class="tab-page overflow-y-auto w-100" style="height:400px;">

        <div class="h-100">
          <div id="_um_role_report_list" class="w-50 p-4 "></div>
        </div>
      </div>

    </div>
  </div>


</div>


<div class="modal fade" id="_um_dlgFindUser" tabindex="-1" role="dialog" aria-labelledby="_um_dlgFindUser_title"
  aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title trans-text" id="_um_dlgFindUser_title" data-langprop="titles.Find Users">Find Users</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-6">
            <div class="input-group">
              <input type="text" class="form-control search-user" placeholder="Search user" />
            </div>
          </div>
        </div>

        <div class="p-2 m-2 w-100">
          <div id="_um_role_found_user_list"></div>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary trans-text" data-dismiss="modal"
          data-langprop="buttons.Cancel"></button>
        <button type="button" class="btn btn-primary trans-text" id="_um_dlgFindUser_btnOK"
          data-langprop="buttons.OK"></button>
      </div>
    </div>
  </div>
</div