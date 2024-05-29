<div id="_main_invoicesComponent" style="display:none; padding-right: 15px;">
    <div class="d-flex justify-content-between bg-white rounded-3 p-3 border">
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

    <div class="d-flex align-items-center gap-2 p-1 mt-3">
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
                <title>Invoice Table</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    /* th, td {
            border: 1px solid #ddd;
            padding: 8px;
        } */
                    th {
                        background-color: #f2f2f2;
                        text-align: left;
                    }

                    tr:hover {
                        background-color: #f1f1f1;
                    }

                    .action-buttons {
                        display: flex;
                        gap: 5px;
                    }
                </style>
            </head>

            <body>
                <table id="invoiceTable" class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Invoice ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Invoice Type</th>
                            <th scope="col">Amount, USD</th>
                            <th scope="col">Dis %</th>
                            <th scope="col">Amount Due</th>
                            <th scope="col">Issue Date</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-success">No100001</td>
                            <td>John Doe</td>
                            <td class="text-muted">tax</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                        <tr>
                            <td class="text-success">No100002</td>
                            <td>John Doe</td>
                            <td class="text-muted">informal</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                        <tr>
                            <td class="text-success">No100003</td>
                            <td>John Doe</td>
                            <td class="text-muted">commercial</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                        <tr>
                            <td class="text-success">No100004</td>
                            <td>John Doe</td>
                            <td class="text-muted">tax</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                        <tr>
                            <td class="text-success">commercial</td>
                            <td>John Doe</td>
                            <td class="text-muted">tax</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                        <tr>
                            <td class="text-success">No100006</td>
                            <td>John Doe</td>
                            <td class="text-muted">informal</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                        <tr>
                            <td class="text-success">No100007</td>
                            <td>John Doe</td>
                            <td class="text-muted">commercial</td>
                            <td>$1000</td>
                            <td>10%</td>
                            <td style="color:#fc0758;">$900</td>
                            <td>2024-05-01</td>
                            <td>2024-06-01</td>
                            <td class="text-danger">Unpaid</td>
                            <td>
                                <button class="btn btn-success ">Actions</button>
                            </td>


                        </tr>
                      
                    </tbody>
                </table>
            </body>

            </html>

        </div>
    </div>







</div>