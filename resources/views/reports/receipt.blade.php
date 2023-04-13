<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            body {
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-body {
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            @media print{
                @page{
                    margin: 0;
                }

                .print-pm{
                    width:100% !important;
                }
            }

            body {
                width: 100vw;
                zoom: 97%;
                font-size: 16px;
                padding: 10px;
                margin: 10px;
            }
        </style>
    </head>
    <body>
        <div class="d-flex justify-content-center w-100">
            <div class="w-50 print-pm">
                <div class="d-flex flex-column w-100">
                    <div class="d-flex justify-content-center">
                        <div class="text-center">
                            <h4 class="fw-bold">Receipt of Payment</h4>
                            <p class="fw-semibold">
                                <span class="pe-2">Reference Number:</span>
                                <span><?php echo $receipt->ref_number; ?></span>
                            </p>
                        </div>
                    </div>
                    <div class="py-2">
                        <span class="pe-2 fw-semibold">អាសយដ្ឋាន: </span>
                        <span>
                            <?php echo isset($branch->address_kh) ? $branch->address_kh : "គ្មាន" ?>
                        </span>
                    </div>
                    <div class="py-2">
                        <span class="pe-2 fw-semibold">លេខទូរស័ព្ទ: </span>
                        <span>
                            <?php echo isset($branch->phone_number) ? $branch->phone_number : "គ្មាន" ?>
                        </span>
                    </div>
                </div>
                <hr style="border: 1.5px solid black; opacity: 0.7; border-radius: 10px"/>
                <div class="d-flex pb-2">
                    <span class="pe-2 fw-semibold">Receipt Date:</span>
                    <span>
                        <?php echo isset($receipt->payment_date) ? $receipt->payment_date : "គ្មាន" ?>
                    </span>
                </div>
                <div class="d-flex py-2">
                    <span class="pe-2 fw-semibold">Amount</span>
                    <span>
                        <?php echo isset($receipt->amount) ? $receipt->amount." ".$receipt->currency_code : "គ្មាន" ?>
                    </span>
                </div>
                <div class="d-block">
                    <div class="d-flex w-100 py-2">
                        <span class="pe-2 fw-semibold text-nowrap">Receive From</span>
                        <div class="d-flex justify-content-center w-100">
                            <span>
                                <?php echo isset($receipt->payer_name) ? $receipt->payer_name : "គ្មាន" ?>
                            </span>
                        </div>
                    </div>
                    <div class="d-flex w-100 py-2">
                        <span class="pe-2 fw-semibold text-nowrap">On settlement of</span>
                        <div class="d-flex justify-content-center w-100">
                            <span>
                                <?php echo "invoice ".$receipt->ref_number; ?>
                            </span>
                        </div>
                    </div>
                    <div class="d-flex w-100 py-2">
                        <span class="pe-2 fw-semibold text-nowrap">Payment Method:</span>
                        <div class="d-flex justify-content-center w-100">
                            <span>
                                <?php echo isset($receipt->payment_method) ? $receipt->payment_method : "Cash"; ?>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="d-flex w-100 py-2 mt-3">
                    <span class="pe-2 fw-semibold text-nowrap">Received By</span>
                    <div class="d-flex justify-content-center w-100">
                        <span>
                            <?php echo isset($receipt->create_user) ? $receipt->create_user : "N/A"; ?>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>