<div id="_main_invoicesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between bg-white rounded-3 mt-3 p-2 border border-white">


    </div>

    <div id="_idl_filter_fields" style="background-color:#e6e6e6;"
        class="d-flex justify-content-between  gap-2 p-3 mt-3">


        <div class="d-flex-gap-2">
            <button type="button" class="btn btn-primary height" id="_create_invoice_btn">
                <label>CREATE INVOICE</label>
            </button>

        </div>





        <div class="d-flex gap-2">

            <div class="input-group flex-nowrap ">
                <!-- <input id="_search_invoice" type="text" class="form-control  height" placeholder="search name or phone"> -->
                <div><input type="text" id="_invoice_search" class="form-control min-width-search height"
                        placeholder="Search invoice" /></div>

                <div id="_btnSearch" class="btn btn-primary rounded-1 input-group-text ml-2" role="button">
                    <i class="fa fa-search fs-5 text-white"></i>
                    <span>FIND</span>
                </div>
                <!-- <button id="_btn_Search" class="btn btn-primary rounded-1 ml-2 mr-2" type="button"><i class="fa fa-search"></i></button> -->
            </div>


        </div>


    </div>


    <div class="shadow rounded-3 bg-white mt-3 p-2 overflow-hidden">
        <div id="_invoice_list" class="p-2">


            <!-- <body>
                <div class="">
                    <table id="invoiceTable" class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Invoice No</th>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Send To Country</th>
                                <th scope="col">Item Type</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Total Weight</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Special Charge</th>
                                <th scope="col">Total Amount</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-success">No100001</td>
                                <td>John Doe</td>
                                <td class="text-muted">England<p class="text-success">tax</p></td>
                                <td>5</td>
                                <td>100 kg</td>
                                <td>$1000</td>
                                <td>10%</td>
                                <td>$50</td>
                                <td class="amount-cell">$950</td>
                                <td class="text-danger">Unpaid</td>
                                <td>
                                    <button class="btn btn-success">Actions</button>
                                </td>
                            </tr>
                           
                            
                            
                        </tbody>
                    </table>
                </div>
            </body> -->



        </div>
    </div>








</div>
<div class="modal fade" id="_create_invoice_dlgFilter" tabindex="-1" role="dialog"
    aria-labelledby="_create_invoice_dlgFilterTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_create_invoice_dlgFilterTitle">Create Invoices</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="_cul_dlgCustomer_body">
                <div class="row">
                    <div class="form-group col-md-6">
                        <label class="form-label trans-text">CUSTOMER NAME</label>
                        <div>
                            <select id="_name_customer" class="modal-select2 data-input" data-field="customer"></select>
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <label class="form-label trans-text">INVOICE TYPE</label>
                        <div>
                            <select id="_invoice_type" class="modal-select2 data-input" data-field="invoice_type"></select>
                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <label class="form-label trans-text">FROM DATE</label>
                        <div><input id="_pl_filter_startdate" class="form-control data-input dl_filter_field"
                                data-select="datepicker" autocomplete="off"></div>
                    </div>
                    <div class="form-group col-md-6">
                        <label class="form-label   trans-text">START DATE</label>
                        <div><input id="_pl_filter_enddate" class="form-control data-input dl_filter_field"
                                data-select="datepicker" autocomplete="off"></div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary height" id="_invoice_create_dlgFilter_btnOK">OK</button>
            </div>
        </div>
    </div>
</div>