<div id="_main_invoicesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between bg-white rounded-3 mt-3 p-2 border border-white">


    </div>

    <div id="_idl_filter_fields" style="background-color:#e6e6e6;"
        class="d-flex justify-content-between  gap-2 p-3 mt-3">


        <div class="d-flex-gap-2">
            <button type="button" class="btn btn-success" id="_create_invoice_btn">
                <span>Create Invoice</span>
            </button>
        </div>

        <div class="d-flex gap-2">
            <div class="input-group flex-nowrap ">
                <!-- <input id="_search_invoice" type="text" class="form-control  height" placeholder="search name or phone"> -->
                <div><input type="text" id="_invoice_search" class="form-control min-width-search height"
                        placeholder="Search invoice" /></div>
                <div id="_btnSearch" class="btn btn-success rounded-1 input-group-text ml-2" role="button">
                    <i class="fa fa-search fs-5 text-white"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="shadow rounded-3 bg-white mt-3 p-2 overflow-hidden">
        <div id="_invoice_list" class="p-2">



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
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Customer Name">CUSTOMER NAME</label>
                            <select id="_name_customer" class="modal-select2 data-input"
                                data-field="customer"></select>
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="discount_percent" class="form-label trans-text" data-langprop="titles.Discount Percent">DISCOUNT PERCENT</label>
                        <input type="number" name="" id="_discount_percent" class="form-control data-input"
                            data-field="discount_percent" placeholder="">
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="from_date" class="form-label trans-text" data-langprop="Form Date">FROM DATE</label>
                        <input id="_pl_filter_startdate" class="form-control data-input dl_filter_field"
                                data-select="datepicker" autocomplete="off">
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="to_date" class="form-label trans-text" data-langprop="To Date">START DATE</label>
                        <input id="_pl_filter_enddate" class="form-control data-input dl_filter_field"
                                data-select="datepicker" autocomplete="off">
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