<div id="_main_salesAgentsComponent" style="display:none;">
    <div class="d-flex justify-content-between shadow rounded-3 mt-3 p-3 bg-white">
        <div class="d-flex gap-2">
            <div class="d-flex flex-row gap2">
                <button id="_sale_agent_btnNew" class="btn btn-primary" type="button">
                    <i class="fa fa-user-plus"></i>
                     <span class="trans-text" data-langprop="buttons.New Agent"></span>
                </button>
            </div>
            <div class="d-flex flex-row gap-2 ml-3">
            <input type="text" class="form-control" id="_sale_agent_search" placeholder="Search sales agent">
                <button id="_sale_agent_btnSearch" class="btn btn-warning ml-3" type="button">
                    <i class="fa fa-search"></i>
                </button>
            </div>
        </div>
       
        <div class="d-flex gap-2">
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

    <div class="p-2 shadow rounded-3 bg-white mt-2">
            <div id="_sale_agent_list"></div>
        </div>
</div>

<div class="modal fade" id="_sale_agent_dlg" tabindex="-1" role="dialog" aria-labelledby="_sale_agent_dlgTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_sale_agent_dlgTitle">New Sales Agents</h5>
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
                                <option value=""></option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-3">
                            <label class="form-label trans-text">Agent Type</label>
                            <select class="form-control data-input" id="_sal_agent_type" data-field="agent_type_id"></select>
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
                        <div class="col-lg-12">
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
