
 <div id="_main_customersComponent"  style="display:none;">
    <div class="d-flex w-100  justify-content-between bg-white shadow rounded-3  p-3" id="_cus_filter_fields">
        <div class="d-flex flex-row gap-2  ">
            <div class="d-flex flex-row gap-1">
            <input type="text" class="form-control" id="_cul_search_customer" placeholder="Search Customer">
            <button id="_cul_btnSearch" class="btn btn-primary ml-2 mr-2" type="button"><i class="fa fa-search"></i></button>
        </div>
    
            <div class="d-flex gap-2 ">
            
            <select  id="_cul_filter_customer_status" class="modal-select2 filter-field" data-field="status_code">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
            </select>
            </div>
        </div>

        <div class="d-flex gap-2">
            <button id="_cul_btnNew" class="btn btn-primary mr-3" type="button"><i class="fa fa-user-plus"></i> <span class="trans-text" data-langprop="buttons.New Customer"></span></button>
            <button id="_cul_btnPrint" class="btn btn-warning mr-3" type="button"><i class="fa fa-print"></i> <span class="trans-text" data-langprop="buttons.Print"></span></button>
        </div>

    </div>

  
    <div class="shadow rounded-3 bg-white mt-3 p-2 overflow-hidden">
        <div id="_cul_customer_list" class="p-2"></div>
    </div>
    
</div> 

 <div class="modal fade" id="CustomerDialog" tabindex="-1" role="dialog" aria-labelledby="_cul_dlgCustomerTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_cul_dlgCustomerTitle">New Customer</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                 <div class="row" id="_cul_dlgCustomer_body">
                    <div class="col-xs-12 col-md-12 col-lg-3">
                        <div class="d-flex align-items-center"> <div id="_customer_profile_photo" style="height:165px" class="mt-2 border border-primary"></div></div>
                     </div>

                     <div class="col-9">
                        <div class="row">
                            <div class="form-group col-lg-6">
                                <label for="code" class="form-label trans-text" data-langprop="titles. Customer ID"></label>
                                <input type="text" class="form-control text-primary data-input" data-field="code" placeholder="AUTO" readonly/>
                            </div>

                            <div class="form-group col-lg-6">
                                <label for="name" class="form-label trans-text" data-langprop="titles.Customer Name"></label>
                                <input type="text" class="form-control text-primary data-input" placeholder="name" data-field="name"/>
                            </div>

                            <div class="form-group col-lg-12">
                                <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                                <input type="email" class="form-control text-primary data-input" placeholder="example@gmail.com" data-field="email"/>
                            </div>

                           
                        </div>
                     </div>

                

                    <div class="form-group col-lg-6 mt-3">
                        
                        <label for="business_type" class="form-label trans-text" data-langprop="titles. Business"></label>
                        <span class="text-primary" > *(ប្រភេទឥវ៉ាន់)</span>
                        <select class="modal-select2 text-primary data-input" data-field="business_type" id="_cul_business_type"></select>
                    </div>
                    <div class="form-group col-lg-6 mt-3">
                        <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                        <span class="text-danger" > *(accept only number)</span>
                        <input class="form-control text-primary data-input" type="number" placeholder="phone number" data-field="phone_number"/>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="customer_type" class="form-label trans-text" data-langprop="titles.Customer Type"></label>
                        <select id="_cul_sender_type" class="modal-select2 text-primary data-input"  data-field="sender_type_id"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="price_list_id" class="form-label trans-text" data-langprop="titles.Price List"></label>
                        <select id="_cul_price_list" class="modal-select2 text-primary data-input"  data-field="price_list_id"></select>
                    </div>

                    <div class="form-group col-lg-12">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                        <textarea class="form-control data-input text-primary" placeholder="input address" data-field="address"></textarea>
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

