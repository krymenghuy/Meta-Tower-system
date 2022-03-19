<div id="_main_saleAgentsComponent" style="display:none;margin:15px">
  <div style="width:100%;display:flex;flex-direction:column">
       <div class="dms-content-header form-inline">
                  <div class="form-inline" style="width:50%">
                      <a id="_sal_btnNewSalesAgent" href="javascript:;" data-toggle="modal" class="btn btn-primary">
                          <i class="la la-plus"></i>
                          <span class="kt-hidden-mobile">New Agent</span>
                      </a>
                      <div style="width:15px"></div>
                            <div class="v-control-group">
                                <span class="v-label">Agent Type</span>
                                <select id="_sal_filter_agent_type" class="v-select form-control _sal_filter_field"></select> &nbsp;
                            </div> &nbsp;
                            <div class="v-control-group" style="display:none">
                                <span class="v-label">Status</span>
                                <select id="_sal_filter_agent_status" class="v-select form-control _sal_filter_field"></select>&nbsp;
                            </div>&nbsp;
                  </div>
                  <div style="width:50%">
                      <div class="form-inline" style="float:right">
                        <input type="text" class="form-control" id="_sal_search" placeholder="&#xF002;search">&nbsp;
                        <button id="_sal_btnSearch" role="button" class="btn btn-primary"><i class="fa fa-sync-alt"></i></button>
                          <div style="width:25px"></div>
                          <div style="float:right">
                              <button id="_sal_btnPrint" class="btn btn-success"><i class="fa fa-print"></i></button>
                              <button id="_sal_btnPDF" class="btn btn-primary"><i class="fa fa-file-pdf"></i></button>
                              <button id="_sal_btnExcel" class="btn btn-default"><i class="fa fa-file-excel"></i></button>
                          </div>
                      </div>
                  </div>
       </div>
       <div class="dms-content-body border-style1">
            <table class="table table-striped- table-bordered table-hover" id="_sal_tblSalesAgents">   
               <tbody id="_sal_tblSalesAgents_body"></tbody>
            </table>
       </div> 
  </div>
</div>
 
 <!--begin::SenderDialog-->
 <div class="modal fade" id="_sal_dlgSalesAgent" tabindex="-1" role="dialog" aria-labelledby="_sal_dlgSalesAgentTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_sal_dlgSalesAgentTitle">New Sales Agent</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="_sal_dlgSalesAgent_body">
        <div id="_sal_dlgSalesAgent_fields">
        <div class="row">
             <div class="col-lg-6">
               <label class="simple-label">Agent ID</label>
               <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readOnly>
             </div>
              <div class="col-lg-6">
                  <label class="simple-label">Agent Type</label>
                  <select class="form-control data-input" id="_sal_agent_type" data-field="agent_type_id"></select>
               </div>
          </div>

          <div class="row">
               <div class="col-lg-3">
                   <label class="simple-label">Agent Name</label>
                   <input type="text" class="form-control data-input" data-field="name">
              </div>
                <div class="col-lg-3">
                    <label class="simple-label">Phone Number</label>
                    <input class="form-control data-input" data-field="phone_number"/>
                </div>  
                <div class="col-lg-3">
                    <label class="simple-label">Email</label>
                    <input class="form-control data-input" data-field="email">
                </div>
               
              <div class="col-lg-3">
                  <label class="simple-label">Commission (USD)</label>
                  <input type="number" class="form-control data-input" data-field="commission">
              </div>
          </div>
          <div class="row">
              <div class="col-lg-12">
              <label class="simple-label">Address</label>
              <textarea class="form-control data-input" data-field="address"></textarea>
              </div>
          </div>
        </div>
          <div class="row" style="display:none">
              <div class="col-lg-6" style="margin-top:15px">
                <span style="font-weight:bold;color:green;display:block">Primary Bank Account</span>
                <div class="div-line" style="border-color:green"></div>
                <div class="border-style1 primary_bank_panel" id="_sal_primary_bank_panel">
                   <div>
                     <span class="simple-label">Bank Name</span>
                     <input type="text" data-field="bank_name" class="form-control data-input" placeholder="">
                     <input class="data-input" data-field="id" type="hidden">
                   </div>
                   <div>
                     <span class="simple-label">Account Number</span>
                     <input type="number" data-field="account_number" class="form-control data-input" placeholder="">
                   </div>
                   <div>
                     <span class="simple-label">Account Name</span>
                     <input type="text" data-field="account_name" class="form-control data-input" placeholder="">
                   </div>           
                </div>
              </div>
          </div>

      </div>
      <div class="modal-footer">
         <span id="_sal_agent_error" class="error_text"></span> 
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-success" id="_sal_dlgSalesAgent_btnSave">Save</button>
      </div>
    </div>
  </div>
</div>
 <!--end::SenderDialog-->
<script async src="{{ asset('js/SalesAgentsComponent.js') }}"></script>