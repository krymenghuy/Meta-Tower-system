<div id="_main_invoicesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between bg-white rounded-3 p-2 border">
        <div class="d-flex gap-2">

            <div class="input-group flex-nowrap">
                <input id="_search_invoice" type="text" class="form-control height" placeholder="search name or phone">
                <div id="_btnSearch" class="input-group-text" role="button">
                    <i class="fa fa-sync-alt fs-5 text-success"></i>
                </div>
            </div>
            <div class="min-width-select">
                <select id="_filter_invoice_type" class="modal-select2 _filter_invoice_type"></select>
            </div>

        </div>
        <div class="d-flex gap-2">

            <div class="d-flex gap-2">
                <button id="_invoice_btnPrint" type="button" class="btn btn-warning text-nowrap text-white">
                    <i class="fas fa-print fs-5"></i>
                    <span>Print</span>
                </button>
                <button id="_invoice_btnPDF" type="button" class="btn btn-primary text-nowrap">
                    <i class="fas fa-file-pdf fs-5"></i>
                    <span>PDF</span>
                </button>
                <button id="_invoice_btnExcel" type="button" class="btn btn-success text-nowrap">
                    <i class="fas fa-file-excel fs-5"></i>
                    <span>Excel</span>
                </button>
            </div>
        </div>
    </div>

    <div style="background-color:#e6e6e6;" class="d-flex align-items-center  gap-2 p-2 mt-3">
        <button id="_new_invoice" data-toggle="modal" class="btn btn-primary text-nowrap">
            <i class="fa fa-user-plus"></i>
            <span class="kt-hidden-mobile text-nowrap">Add Invoice</span>
        </button>

        <div class="input-group flex-nowrap">
            <div class="input-group-text">
                <span class="trans-text" data-langprop="titles.Start Date">Start Date</span>
            </div>
            <div class="w-100">
                <input data-select="datepicker" class="form-control" placeholder="Start Date"
                    id="_invoice_filter_start_date" />
            </div>
        </div>
        <div class="input-group flex-nowrap">
            <div class="input-group-text">
                <span class="trans-text" data-langprop="titles.End Date">End Date</span>
            </div>
            <div class="w-100">
                <input data-select="datepicker" class="form-control" placeholder="End Date"
                    id="_invoice_filter_end_date" />
            </div>
        </div>
        <div class="min-width-select">
            <select id="_filter_status_type" class="modal-select2 _filter_status_type"></select>
        </div>

    </div>


    <div class="shadow rounded-3 bg-white mt-3 p-2 overflow-hidden">
        <div id="_invoice_list" class="p-2">
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
                <title>Invoice Table</title>
                <style>
                    .amount-cell {
                        color: #fc0758;
                    }
                </style>
            </head>

            <body>
                <div class="">
                    <table id="invoiceTable" class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Invoice No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Invoice Type</th>
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
                                <td class="text-muted">tax</td>
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
                            <tr>
                                <td class="text-success">No100001</td>
                                <td>John Doe</td>
                                <td class="text-muted">tax</td>
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
                            <tr>
                                <td class="text-success">No100001</td>
                                <td>John Doe</td>
                                <td class="text-muted">tax</td>
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
                            
                            <!-- Additional rows can be added here -->
                        </tbody>
                    </table>
                </div>
            </body>

            </html>


        </div>
    </div>







</div>