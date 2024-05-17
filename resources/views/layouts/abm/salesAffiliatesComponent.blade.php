<style>
    .nav-tabs .nav-item .nav-link.active{
        color: #595d6e;
    }
    .nav-tabs .nav-item .nav-link{
        color: #595d6e
    }
    table {
        border-collapse:separate; 
        border-spacing: 0 1em;
    }

</style>
<div id="_main_salesAffiliatesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between shadow rounded-3 pb-3 pt-3 p-2 bg-white">
        <div class=" d-flex align-items-center">    
            <div class="card-header border border-1 rounded-5 p-0 pb-1 bg-light-gray">
                <ul class="nav nav-tabs border border-0 m-0 vs-tab-header" id="custom-tabs-one-tab" role="tablist">
                    <li class="nav-item">
                    <!-- <a class="tab-button nav-link pt-2 pb-2 border border-0 rounded-5 active" data-view ="view_sales_agent" id="custom-tabs-one-tab" data-toggle="pill" href="#custom-tabs-one-sales-agent" role="tab" aria-controls="custom-tabs-one-sales-agent" aria-selected="false">Sales Agents</a> -->
                    <a class="tab-button view_sales_agent nav-link pt-2 pb-2 border border-0 rounded-5 active" data-view ="view_sales_agent" id="custom-tabs-one-tab" data-toggle="pill" href="#custom-tabs-one-sales-agent" role="tab" aria-controls="custom-tabs-one-sales-agent" aria-selected="false"><span class="trans-text" data-langprop="buttons.Sales Agents"></span></a>
                    </li>
                    <li class="nav-item">
                    <!-- <a class="tab-button nav-link pt-2 pb-2 border border-0 rounded-5 " data-view ="view_contact_person" id="custom-tabs-one-tab"  data-toggle="pill" href="#custom-tabs-one-contact-person" role="tab" aria-controls="custom-tabs-one-contact-person" aria-selected="true">Contact Person</a> -->
                    <a class="tab-button view_contact_person nav-link pt-2 pb-2 border border-0 rounded-5" data-view ="view_contact_person" id="custom-tabs-one-tab" data-toggle="pill" href="#custom-tabs-one-contact-person" role="tab" aria-controls="custom-tabs-one-contact-person" aria-selected="true"><span class="trans-text" data-langprop="buttons.Contact Persens"></span></a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="d-flex flex-row gap-2 ml-3">
            <input type="text" class="form-control" id="_sale_agent_search" placeholder="Search ">
            <button id="_sale_agent_btnSearch" class="btn btn-warning ml-3" type="button">
                <i class="fa fa-search"></i>
            </button>
        </div>
    </div>
        
        

    <!-- <div class="shadow rounded-3 bg-light mt-2">
        <div id="_sale_agent_list"></div>
    </div> -->

    <div class=" shadow rounded-3 bg-light mt-2 ">
        <!-- <div class="col-12 col-sm-12"> -->
            <!-- <div class="card card-primary card-tabs"> -->
              <!-- <div class="card-body"> -->
                  <div class="tab-content" id="custom-tabs-one-tabContent">
                    <div class="tab-pane fade show active" id="custom-tabs-one-sales-agent" role="tabpanel" aria-labelledby="custom-tabs-one-sales-agent">
                        <div class="d-flex justify-content-between border mt-3 rounded-2 p-2 bg-white">
                            <div class="d-flex gap-2 ">
                                <div class="d-flex flex-row gap2">
                                    <button id="_sale_agent_btnNew" class="btn btn-primary" type="button">
                                        <i class="fa fa-user-plus"></i>
                                        <span class="trans-text" data-langprop="buttons.New Agent"></span>
                                    </button>
                                </div>
                                
                            </div>
                            <div class="d-flex gap-2" id="_sdl_filter_fields_view_sales_agent">
                                <div class="d-flex flex-row gap2 ml-3">
                                    <select  id="_sale_agent_filter_type" class="modal-select2 filter-field" data-field="agent_type">
                                    </select>
                                </div>
                                <div class="d-flex flex-row gap-2 ml-3">
                                    <select  id="_sale_agent_filter_status" class="modal-select2 filter-field" data-field="status_code">
                                    </select>
                                </div>
                                <div class="d-flex flex-row gap-2 ml-3">
                                <button id="_sale_agent_btnPrint" class="btn btn-primary" type="button">
                                    <i class="fa fa-print"></i> 
                                    <span class="trans-text" data-langprop="buttons.Print"></span>
                                </button>
                                </div>
                            </div>
                        </div>
                        <div id="_sale_agent_list" class="mt-2"></div>
                    </div>
                    <div class="tab-pane fade " id="custom-tabs-one-contact-person" role="tabpanel" aria-labelledby="custom-tabs-one-tab">
                        <div class="d-flex justify-content-between border mt-3 rounded-2 p-2 bg-white">
                            <div class="d-flex gap-2 ">
                                <div class="d-flex flex-row gap2">
                                    <button id="_contact_person_btnNew" class="btn btn-primary" type="button">
                                        <i class="fa fa-user-plus"></i>
                                        <span class="trans-text" data-langprop="buttons.New Contact Presen"></span>
                                    </button>
                                </div>
                            </div>
                            <div class="d-flex gap-2" id="_sdl_filter_fields_view_contact_person">
                                <div class="d-flex flex-row gap2 ml-3">
                                    <select  id="_contact_persen_filter_type" class="modal-select2 filter-field" data-field="agent_type">
                                    </select>
                                </div>
                                <div class="d-flex flex-row gap-2 ml-3">
                                    <select  id="_contact_person_filter_status" class="modal-select2 filter-field" data-field="status_code">
                                    </select>
                                </div>
                                <div class="d-flex flex-row gap-2 ml-3">
                                <button id="_sale_agent_btnPrint" class="btn btn-primary" type="button">
                                    <i class="fa fa-print"></i> 
                                    <span class="trans-text" data-langprop="buttons.Print"></span>
                                </button>
                                </div>
                            </div>
                        </div>
                        <div id="_contact_person_list" class="mt-2"></div>
                        
                    </div>
                  </div>
              <!-- </div> -->
              <!-- /.card -->
            <!-- </div> -->
        <!-- </div> -->

    </div>


    <!-- <div style="display:none" class="mt-3 w-100 flex-column shadow-lg rounded-3 p-2 d-flex flex-row gap-3 bg-white vs-tab-view" id="_um_role_tab">
        <div class="d-flex flex-row gap-2 vs-tab-header">
             <a  href="javascript:void(0)" class="tab-button view_users active" data-target ="view_users"><span class="trans-text" data-langprop="buttons.SalesAgents"></span></a>
             <a  href="javascript:void(0)" class="tab-button view_apps" data-target="view_apps"><span class="trans-text" data-langprop="buttons.Contact Person"></span></a>
        </div>
        <div class="w-100 p-1 mt-2 vs-tab-body">
           <div id="view_users" data-view="view_users" class="tab-page w-100" style="display:none">
               <div class="h-100 d-flex flex-column flex-wrap pl-3 pr-3">
                  <div class="d-flex flex-row gap-2">
                     <div>
                        <input type="text" class="form-control form-control-sm rounded-4 border border-secondary" id="_um_role_search_user" placeholder="Search user">
                     </div>
                      <div class="d-flex pt-2 gap-2">
                        <a href="javascript:void(0)" id="_um_role_add_member" class=""><span class="trans-text pr-2 pl-2 p-1 bg-primary text-white border border-primary rounded-4" data-langprop="buttons.Add SalesAgent"></span></a>
                        <a href="javascript:void(0)" id="_um_role_create_user" class=""><span class="trans-text pr-2 pl-2 p-1 bg-primary text-white border border-primary rounded-4" data-langprop="buttons.Add Context Person"></span></a>
                      </div>
                  </div>
                  <div class=" shadow rounded-3 bg-light mt-2">
                    <div id="_sale_agent_list"></div>
                  </div>
               </div>
           </div>
           <div id="view_apps" data-view="view_apps" class="tab-page w-100" style="display:none">
               <div class="h-100">
                  <div class="" id="_um_role_app_list">
                     <div class="p-1 d-flex flex-column gap-3 justify-contents-start">
                         <div class="app-box d-flex justify-content-between">
                              <div class="d-flex gap-2 rounded-4 shadow-lg p-2 justify-contents-center align-items-center" style="width:410px">
                                    <img class="border border-secondary rounded-5" style="width:40px;height:40px" src="" alt=""> 
                                    <h5>Delivery Management System</h5>
                              </div>
                              <div class="d-flex gap-4 align-items-center justify-content-center">
                                   <i class="fa fa-check text-success fs-3 fw-bold"></i> 
                                   <div> <button class="btn btn-sm btn-primary rounded-4">Allow</button> </div>
                              </div>
                         </div> 
                      
                         <div class="app-box d-flex justify-content-between">
                              <div class="d-flex gap-2 rounded-4 shadow-lg p-2 justify-contents-center align-items-center" style="width:410px">
                                    <img class="border border-secondary rounded-5" style="width:40px;height:40px" src="" alt=""> 
                                    <h5>Airway Bill Management System</h5>
                              </div>
                              <div class="d-flex gap-4 align-items-center justify-content-center">
                                   <i class="fa fa-check text-success fs-3 fw-bold"></i> 
                                   <div> <button class="btn btn-sm btn-primary rounded-4">Allow</button> </div>
                              </div>
                         </div>

                     </div>
                  </div>
               </div>
           </div>
        </div>
    </div> -->
</div>

<div class="modal fade" id="_sale_agent_dlg" tabindex="-1" role="dialog" aria-labelledby="_sale_agent_dlgTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_sale_agent_dlgTitle">Sales Agents</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_sale_agent_dlg_body">
                <div class="row">
                    <div class="form-group col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="titles. ID"></label>
                        <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readonly/>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles. Name" ></label>
                        <input type="text" class="form-control data-input" data-field="name">
                    </div>
                  

                </div>
                <div class="row">
                    <div class="form-group col-lg-3">
                        <label for="sex" class="form-label trans-text">Sex</label>
                        <div class="">
                            <select class="modal-select2 data-input" data-field="sex">
                                <option value="">(Select gender)</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-3" id="el_agent_type">
                            <label class="form-label trans-text">Agent Type</label>
                            <!-- <select id="_sal_agent_type" class="modal-select2 data-input" data-field="agent_types_id"></select> -->
                            <!-- <select class="form-control data-input" id="_sal_agent_type" data-field="agent_types_id"></select> -->
                            <select class="modal-select2 data-input" data-field="agent_type">
                                <option selected>(Select SalesAgent Type)</option>
                                <option value="client_affiliate">client-affiliate</option>
                                <option value="freelancer">freelancer</option>
                                <option value="full_time">full-time</option>
                            </select>
                    </div>
                    <div class="col-lg-3" id="el_cp_type">
                            <label class="form-label trans-text">Contact Person Type</label>
                            <!-- <select id="_sal_agent_type" class="modal-select2 data-input" data-field="agent_types_id"></select> -->
                            <!-- <select class="form-control data-input" id="_sal_agent_type" data-field="agent_types_id"></select> -->
                            <select class="modal-select2 data-input" data-field="cp_type">
                                <option hidden value="default">(Select SalesAgent Type)</option>
                                <option value="primary">primary</option>
                                <option value="secondary">secondary</option>
                            </select>
                    </div>
                    <div class="col-lg-6">
                            <label class="form-label trans-text">Phone Number</label>
                            <input class="form-control data-input" data-field="phone_number" />
                    </div>
                    <div class="col-lg-6">
                            <label class="form-label trans-text">Email</label>
                            <input class="form-control data-input" data-field="email">
                    </div>
                    <div class="col-lg-6">
                            <label class="form-label trans-text">Position </label>
                            <input type="position" class="form-control data-input" data-field="position_title">
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-xs-12 col-md-12 col-lg-3">
                        <div class="d-flex align-items-center"> <div id="_saleAgent_profile_photo" style="height:165px" class="mt-2"></div></div>
                    </div>
                    <div class="col-lg-9 mt-4">
                        <label class="form-label trans-text">Address</label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>
                </div>
            
            </div>
            <div class="modal-footer">
                <span id="_sal_agent_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-success" id="_sale_agent_dlg_btnSave">
                <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
