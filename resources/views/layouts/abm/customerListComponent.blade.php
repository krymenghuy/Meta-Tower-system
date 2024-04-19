<div id="_main_customerListComponent" style="display:none;">
    <div class="d-flex justify-content-between shadow rounded-3 mt-3 p-3 bg-white">
        <div class="d-flex gap-2">
           <div class="d-flex flex-row gap-2" >
                <button  id="_cuslist__btnNewCustomer" data-toggle="modal" class="btn bg-primary  text-white">
                    <i class="la la-plus fs-5"></i>
                    <span  class="kt-hidden-mobile trans-text" data-langprop="titles.New Customer"></span>
                </button>
            </div>
        </div>
        <div class="d-flex gap-2" id="_cuslist_filter_fields">
            <div class="min-width-select">
                <select id="_cuslist_filter_business_type" class="d-none modal-select2 filter-field" data-field="business_type">

                </select>
            </div>
           
            <div class="min-width-select">
                <select id="_cuslist_filter_customer_status" class="modal-select2 filter-field" data-field="status_code">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                 
            </div>
            
            
        </div>
    </div>

    <div class="d-flex justify-content-between shadow rounded-3 p-3 bg-white mt-2">
        <div class="d-flex gap-2">
            <div class="d-flex gap-1">
                <input type="text" id="_cuslist_Search" class="form-control " placeholder="Search customer">
                <button id="_cuslist_btnSearch" role="button" class="btn btn-primary ml-3">
                    <i class="la la-search"></i>
                </button>
                 
            </div>
        </div>
        <div class="d-flex flex-row gap-2">
        </div>
        <div class="d-flex gap-2">
            <button id="_cuslist_btnPrint" class="btn btn-sm btn-outline-success">
                <i class="fa fa-print fs-5"></i>
                <span class="trans-text" data-langprop="buttons.Print"></span>
            </button>
            <button id="_cuslist_btnExcel" class="btn btn-sm btn-outline-primary">
                <i class="fa fa-file-excel fs-5"></i>
                <span class="trans-text" data-langprop="buttons.Excel"></span>
            </button>
        </div>
    </div>
   
    <div class="rounded-3 mt-3 p-2">
        <div id="_cuslist_customer_list"></div>
    </div>
</div>


<div class="modal fade" id="_cuslist_dlgCustomer" tabindex="-1" role="dialog" aria-labelledby="_cuslist_dlgCustomerTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title trans-text " id="_cuslist_dlgCustomerTitle" data-langprop="titles.New Customer"></h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row" id="div_merchant_info">
                    <div class="form-group col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="titles. ID"></label>
                        <input type="text" class="form-control data-input" data-field="code" placeholder="AUTO" readonly/>
                    </div>
<!-- 
                    <div class="form-group col-lg-6">
                        <label for="sender_class" class="form-label trans-text" data-langprop="titles. Sender Class"></label>
                        <input type="text" class="form-control data-input" data-field="sender_class"/>
                    </div> -->


                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles. Name"></label>
                        <input type="text" class="form-control data-input" data-field="name"/>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                        <input type="email" class="form-control data-input" data-field="email"/>
                    </div>

                    <div class="form-group col-lg-3">
                        <label for="sender_type" class="form-label trans-text" data-langprop="titles.Customer Type"></label>
                        <select class="modal-select2 data-input" id="_cuslist_sender_type" data-field="sender_type_id"></select>
                    </div>

                    <div class="form-group col-lg-3">
                        <label for="business_type" class="form-label trans-text" data-langprop="titles.Business"></label>
                        <select class="modal-select2 data-input" data-field="business_type" id="_cuslist_business_type"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                        <input class="form-control data-input" type="text" data-field="phone_number"/>
                    </div>


                    <div class="form-group col-lg-3">
                        <label for="price_list_id" class="form-label trans-text" data-langprop="titles.Price List"></label>
                        <select id="_cuslist_price_list" class="modal-select2 data-input" data-field="price_list_id"></select>
                    </div>
                    
                    <div class="form-group col-lg-3">
                        <label for="sales_agent_id" class="form-label trans-text" data-langprop="titles.Referrer"></label>
                        <select id="_cuslist_sales_agent" class="modal-select2 data-input" data-field="sales_agent_id"></select>
                    </div>

                    
                    <div class="form-group col-lg-12">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                        <textarea class="form-control data-input" data-field="address"></textarea>
                    </div>

                </div>
         
                
            </div>
            <div class="modal-footer">
                <span id="_cuslist_sender_error" class="error_text"></span>
                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-success" id="_cuslist_dlgCustomer_btnSave">
                <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>


