<style>
    .sp-member-table thead th{
       font-weight:bold;
       font-size:0.9em;
       text-transform: uppercase; 
    }
</style>
<div id="_main_servicePlansComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" id="_spl_btnNewPlan">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text" data-langprop="buttons.New Plan">New Plan</span>
            </button>
            <input type="search" class="search-box" id="_spl_search" placeholder="Search"/>
            <div class="custom-width" style="display:none">
                <select id="_spl_filter_status" class="modal-select2">
                    <option value="0">Active Plan</option>
                    <option value="1">Inactive Plan</option>
                </select>
            </div>
        </div>
        <div style="margin:17px;min-height:350px;" class="full-screen-height-scroll">
           <div id="service_plan_container" class="d-flex flex-column" style="overflow-y:auto;">
           </div>  
        </div>
    </div>
</div>

<div id="_spl_dlgServicePlan" class="modal fade" tabindex="-1" aria-labelledby="_spl_dlgServicePlan_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_spl_dlgServicePlan_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-12">
                        <label for="name" class="form-label trans-text" data-langprop="service.Plan Name"></label>
                        <input class="form-control data-input" data-field="name" data-required="1" data-ffield="Plan Name"/>
                    </div>
                    <div class="form-group col-6">
                        <label for="price" class="form-label trans-text" data-langprop="service.Price"></label>
                        <input type="number" class="form-control data-input" data-field="price" data-required="1" data-ffield="Price"/>
                    </div>
                    <div class="form-group col-6">
                        <label for="name" class="form-label trans-text" data-langprop="service.Currency"></label>
                        <input class="form-control" data-field="currency_code" data-required="0" data-ffield="Currency" value="USD" readOnly/>
                    </div>

                    <div class="form-group col-6">
                        <label for="description" class="form-label trans-text" data-langprop="service.Service"></label>
                        <select id="_spl_service" class="modal-select2 data-input" data-field="service_id" data-ffield="Service"></select>
                    </div>

                    <div class="form-group col-6">
                        <label for="name" class="form-label trans-text" data-langprop="service.Maximum Repeats"></label>
                        <input class="form-control data-input" type="number" data-field="max_sku" data-required="0" data-ffield="Maximum repeats"/>
                    </div>

                    <div class="form-group col-12">
                        <label for="description" class="form-label trans-text" data-langprop="service.Description"></label>
                        <input class="form-control data-input" data-field="description" data-ffield="Description"/>
                    </div>
                     
                    <div class="col-12">
                       <div class="dialog-error" id="_spl_dlgServicePlan_error">
                       </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="_spl_dlgServicePlan_btnSave" class="btn btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="st_dlgSubsribers" class="modal fade" tabindex="-1" aria-labelledby="st_dlgSubsribers_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title fs-5"><span class="trans-text" data-langprop="titles.Subscribers" id="st_dlgSubsribers_title">Members</span> &nbsp;<a href="javascript:void(0);" id="sp_btnNewMember"><i class="fa fa-plus-circle"></i></a></h5>
            </div>
            <div class="modal-body">
                <div class="div-show" id="st_div_add_member">
                   <div class="border border-rounded-3 border-secondary p-2" style="border-radius:5px">
                        <div class="row">
                                   <div class="form-group col-3">
                                        <span class="simple-label">Client Phone</span>
                                        <div><input id="st_add_member_phone" type="text" class="form-control data-input"></div>
                                    </div>
                                    <div class="form-group col-3">
                                        <span class="simple-label">Client Name</span>
                                        <div><input id="st_add_member_name" type="text" class="form-control data-input"></div>
                                    </div>
                                    <div class="form-group col-3">
                                        <span class="simple-label">Start Date</span>
                                        <div><input id="st_start_date" data-field="st_start_date" class="form-control data-input" data-select="datepicker" readOnly></div>
                                    </div>
                                    <div class="form-group col-3">
                                        <span class="simple-label">Expiration Date</span>
                                        <div><input id="st_expiration_date" data-field="expiration_date" type="text" class="form-control data-input" data-select="datepicker"></div>
                                    </div>
                                    <div class="form-group col-3">
                                        <span class="simple-label">Sales Agent</span>
                                        <div><select id="st_sales_agent" data-field="sales_agent_id" class="modal-select2 data-input"></select></div>
                                    </div>
                                    <div class="form-group col-3">
                                        <span class="simple-label">Commission($)</span>
                                        <div><input id="st_agent_commission" data-field="agent_commission" type="number" class="form-control data-input"></div>
                                    </div>
            
                                   

                                    <div style="display:none" class="form-group col-3">
                                        <span class="simple-label">Commission Type</span>
                                        <div><input id="st_expiration_date" data-field="commission_type" type="text" class="form-control data-input" value="amount"></div>
                                    </div>

                                    <div class="form-group col-12">
                                        <div class="form-inline" style="float:right">
                                         <button id="sp_btnCancelNewMember" class="btn btn-sm btn-outline-danger">Cancel</button>&nbsp;
                                         <button id="sp_btnAddMember" class="btn btn-sm btn-outline-primary">Add Member</button>
                                        </div>
                                    </div>
                        </div>
                   </div> 
                </div>
               <div class="sp-table-container">
                  <table id="sp_tblMembers" class="table sp-member-table">
                     <thead>
                        <tr>
                            <th>No</th>
                            <th>Client ID</th>
                            <th>Name</th>
                            <th>Sex</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                            <th>Sold By</th>
                            <th>Action</th>
                        </tr>
                     </thead>
                     <tbody id="sp_tblMembers_body">
                     </tbody>
                  </table>
               </div> 
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Close"></span>
                </button>
            </div>
        </div>
    </div>
</div>
 
