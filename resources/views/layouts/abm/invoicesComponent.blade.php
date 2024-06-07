<div id="_main_invoicesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between bg-white rounded-3 mt-3 p-2 border border-white">
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

        <div class="d-flex gap-2 ">
            <button id="_invoice_btnPrint" type="button" class="btn btn-warning mr-3 text-nowrap text-white">
                <i class="fas fa-print fs-5"></i>
                <span>Print</span>
            </button>
            <button id="_invoice_btnPDF" type="button" class="btn btn-primary mr-3 text-nowrap">
                <i class="fas fa-file-pdf fs-5"></i>
                <span>PDF</span>
            </button>
            <button id="_invoice_btnExcel" type="button" class="btn btn-success mr-5 text-nowrap">
                <i class="fas fa-file-excel fs-5"></i>
                <span>Excel</span>
            </button>
        </div>
    </div>

    <div id="_idl_filter_fields" style="background-color:#e6e6e6;"
        class="d-flex justify-content-between  gap-2 p-3 mt-3">

        <div class="d-flex gap-2 ">
            <button id="_new_invoice" data-toggle="modal" class="btn btn-primary text-nowrap">
                <i class="fa fa-user-plus"></i>
                <span class="kt-hidden-mobile text-nowrap">Create Invoice</span>
            </button>

        </div>


        <div class="d-flex gap-4">
            <div class="input-group flex-nowrap">
                <div class="input-group-text rounded-2 mr-2">
                    <span class="trans-text" data-langprop="titles.Start Date">Start Date</span>
                </div>
                <div class="w-100">
                    <input data-select="datepicker" class="form-control filter-field" placeholder="Start Date"
                        id="_invoice_filter_start_date" />
                </div>
            </div>
            <div class="input-group flex-nowrap">
                <div class="input-group-text rounded-2 mr-2">
                    <span class="trans-text" data-langprop="titles.End Date">End Date</span>
                </div>
                <div class="w-100">
                    <input data-select="datepicker" class="form-control filter-field" placeholder="End Date"
                        id="_invoice_filter_end_date" />
                </div>
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
<div class="modal fade" id="_idl_dlgInvoice" tabindex="-1" role="dialog" aria-labelledby="_idl_dlgInvoiceTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" id="_idl_dlgInvoiceTitle" data-langprop="titles.New Invoice"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row" id="_idl_invoice_body">

                    <div class="form-group col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="titles. INVOICE No"></label>
                        <input type="text" class="form-control text-primary data-input" data-field="code"
                            placeholder="AUTO" readonly />
                    </div>
                        <div class="form-group col-lg-6">

                            <label for="name" class="form-label trans-text"
                                data-langprop="titles. CUSTOMER NAME"></label>
                            <select class="modal-select2 text-primary data-input" data-field="name" id="_name"></select>
                        </div>



                        <div class="form-group col-lg-6">

                            <label for="shipment" class="form-label trans-text"
                                data-langprop="titles. SHIPMENT"></label>
                            <select class="modal-select2 text-primary data-input" data-field="shipment"
                                id="_shipment"></select>
                        </div>


                        <div class="form-group col-lg-6">

                            <label for="invoice_type" class="form-label trans-text"
                                data-langprop="titles. INVOICE TYPE"></label>
                            <select class="modal-select2 text-primary data-input" data-field="invoice_type"
                                id="_invoice_type"></select>
                        </div>
                        <div class="form-group col-lg-6">

                            <label for="type" class="form-label trans-text"
                                data-langprop="titles. DISCOUNT TYPE"></label>
                            <select class="modal-select2 text-primary data-input" data-field="discount_type"
                                id="_discount_type"></select>
                        </div>
                        

                    <div class="form-group col-lg-6">

                            <label for="name" class="form-label trans-text"
                                data-langprop="titles.DISCOUNT PERCENTAGE"></label>
                            <input type="text" class="form-control text-primary data-input" placeholder="name"
                                data-field="discount_percentage" />
                        </div>






                    <div class="form-group col-lg-6">

                        <label for="number" class="form-label trans-text"
                            data-langprop="titles. DISCOUNT AMOUNT"></label>
                        <select class="modal-select2 text-primary data-input" data-field="discount_amount"
                            id="_discount_amount"></select>
                    </div>



                    <div class="form-group col-lg-6">
                        <label for="pmt_terms" class="form-label trans-text" data-langprop="titles.pmt Terms"></label>
                        <input type="text" class="form-control text-primary data-input" placeholder=""
                            data-field="pmt_terms" />
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="public_remarks" class="form-label trans-text"
                            data-langprop="titles.PUBLIC REMARK"></label>
                        <input type="text" class="form-control text-primary data-input" placeholder=""
                            data-field="public_remarks" />
                    </div>

                    <div class="form-group col-lg-12">
                        <label for="private_remarks" class="form-label trans-text"
                            data-langprop="titles.PRIVATE REMARK"></label>
                        <input type="text" class="form-control text-primary data-input" placeholder=""
                            data-field="private_remarks" />
                    </div>





                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-default height" data-dismiss="modal"><span
                        class="trans-text" data-langprop="buttons.Cancel"></span></button>
                <button type="button" class="btn btn-primary height" id="_idl_invoice_btn_ok"><span class="trans-text"
                        data-langprop="buttons.Create"></span></button>
            </div>
        </div>
    </div>
</div>