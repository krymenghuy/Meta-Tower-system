<div id="_main_customersComponent" class="m-2" style="display:none;">
    <div class="w-100">
        <div class="d-flex flex-row justify-content-between bg-white shadow-lg rounded-3 p-3 mb-2" id="div_filter_fields">
            <div class="d-flex gap-2">
              <div class="d-flex flex-row gap-1">
                <input type="text" class="form-control" id="_cul_search_agent" placeholder="Search agent">
                <button id="_cul_btnSearch" class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
             </div>
              <div class="d-flex gap-2">
                <select  id="_cul_filter_agent_type" class="modal-select2 filter-field" data-field="agent_type_id"></select>
                <select  id="_cul_filter_agent_status" class="modal-select2 filter-field" data-field="status_code"></select>
              </div>
            </div>
            <div class="d-flex gap-2">
               <button id="_cul_btnNewAgent" class="btn btn-primary" type="button"><i class="fa fa-user-plus"></i> <span class="trans-text" data-langprop="buttons.New Agent"></span></button>
               <button id="_cul_btnPrint" class="btn btn-secondary" type="button"><i class="fa fa-print"></i> <span class="trans-text" data-langprop="buttons.Print"></span></button>
            </div>
        </div>
        <div class="d-flex flex-row justify-content-between bg-white shadow-lg rounded-3 p-3 mb-2" id="_cul_filter_fields">
            <div class="d-flex gap-2">
            </div>
           
            <div class="d-flex gap-2">
            </div>
        </div>
        <div class="shadow rounded-3 bg-white mt-3 p-2 overflow-hidden">
            <div id="_cul_customer_list" class="p-2"></div>
        </div>
    </div>
</div>

<div class="modal fade" id="_cul_dlgCustomer" tabindex="-1" role="dialog" aria-labelledby="_cul_dlgCustomerTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_cul_dlgCustomerTitle">New Customer</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_cul_dlgSalesAgent_body">
                <div id="_cul_dlgSalesAgent_fields" class="d-flex flex-column">
                   <div class="row">
                     <div class="col-xs-12 col-md-12 col-lg-3">
                        <div class="d-flex align-items-center"> <div id="_agent_profile_photo" style="height:230px" class="mt-2"></div></div>
                     </div>
                     <div class="col-xs-12 col-lg-9">
                        <div class="row">
                            <div class="col-xs-12 col-lg-6">
                                <label class="form-label">Agent ID</label>
                                <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readOnly>
                            </div>
                            <div class="col-xs-12 col-lg-6">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control data-input" data-field="name">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-xs-12 col-lg-6">
                                       <label class="form-label">Sex</label>
                                        <select class="modal-select2 data-input" data-field="sex">
                                            <option value="F">Female</option>
                                            <option value="M">Male</option>
                                            <option value="O">Other</option>
                                        </select>
                            </div>
                            <div class="col-xs-12 col-lg-6">
                                 <label class="form-label">Agent Type</label>
                                 <select class="modal-select2 data-input" id="_cul_agent_type" data-field="agent_type_id"></select>
                            </div>
                        </div>
                        
                     </div>
                   </div>
 
                    <div class="row">
                        <div class="form-group col-lg-6">
                            <label class="form-label">Phone Number</label>
                            <input id="_cul_phone_number" class="form-control data-input" data-field="phone_number" />
                        </div>
                        <div class="form-group col-lg-6">
                            <label class="form-label">Email</label>
                            <input class="form-control data-input" data-field="email">
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-lg-12">
                            <label class="form-label">Address</label>
                            <textarea class="form-control data-input" data-field="address"></textarea>
                        </div>
                    </div>
                    <div class="div_login_info p-2">
                        <div class="p-2 d-flex gap-2">
                            <i class="fa fa-mobile fs-5 mt-1"></i> <span class="fs-5 fw-semibold">Mobile App Account</span>
                        </div> 
                        <div class="d-flex flex-row gap-2 mt-1">
                              <div>
                                 <label class="form-label">Login name</label>
                                 <input id="_cul_login_name" class="form-control data-input" data-field="login_name" placeholder="Phone number">
                              </div> 
                              <div>
                                 <label class="form-label">Password</label>
                                 <input id="_cul_password" type="password" class="form-control data-input" data-field="password">
                              </div>
                        </div>
                      
                    </div>
                   
                </div>
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-secondary height" data-dismiss="modal"><span class="trans-text" data-langprop="buttons.Cancel"></span></button>
                <button type="button" class="btn btn-success height" id="_cul_dlgCustomer_btnSave"><span class="trans-text" data-langprop="buttons.Save"></span></button>
            </div>
        </div>
    </div>
</div>