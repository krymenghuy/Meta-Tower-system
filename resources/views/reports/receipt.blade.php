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
                size: A4 portrait;
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
        <div class="d-flex align-items-center w-100">
            <div class="d-block w-100">
               <div class="d-flex justify-content-center w-100">
                <h3 class="text-center fw-bold">
                    <?php echo "sdfdsgdfg"; ?>
                </h3>
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
                <div class="py-2">
                    <span>
                        <?php echo isset($branch->website) ? $branch->website : null ?>
                    </span>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end w-100">
                <div>
                    <img style="width: 120px" class="img-thumbnail" src="<?php echo isset($branch->logo_url) ? $branch->logo_url : null ?>"/>
                </div>
            </div>
        </div>
        <hr style="border: 2px solid black; opacity: 0.7; border-radius: 10px"/>
        <div class="d-flex align-items-center justify-content-center">
            <div>
                <h3>
                    <?php echo isset($title) ? $title : null ?>
                </h3>
            </div>
        </div>
        <div class="d-flex align-items-center w-100">
            <div class="d-flex align-items-end">
                <span class="pe-2 fw-semibold">Amount</span>
                <span>
                    <?php echo isset($payment->amount) ? $payment->amount : "គ្មាន" ?>
                </span>
            </div>
            <div class="d-flex justify-content-end w-100">
                <div class="d-block">
                    <p class="fs-5 fw-semibold">No.</p>
                    <p>
                        <span class="pe-2 fw-semibold">Date: </span>
                        <span>
                            <?php echo isset($payment->payment_date) ? $payment->payment_date : "គ្មាន" ?>
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="d-block">
            <div class="d-flex align-items-center w-100 py-2">
                <span class="pe-2 fw-semibold text-nowrap">Receive From</span>
                <div class="d-flex align-items-center justify-content-center w-100">
                    <span>
                        <?php echo isset($payment->payer_name) ? : "គ្មាន" ?>
                    </span>
                </div>
            </div>
            <div class="d-flex align-items-center w-100 py-2">
                <span class="pe-2 fw-semibold text-nowrap">The sum of</span>
                <div class="d-flex align-items-center justify-content-center w-100">
                    <span>
                        <?php echo "គ្មាន" ?>
                    </span>
                </div>
            </div>
            <div class="d-flex align-items-center w-100 py-2">
                <span class="pe-2 fw-semibold text-nowrap">On settlement of</span>
                <div class="d-flex align-items-center justify-content-center w-100">
                    <span>
                        <?php echo "គ្មាន" ?>
                    </span>
                </div>
            </div>
            <div class="d-flex align-items-center w-100 py-2">
                <div class="d-flex align-items-center w-50">
                    <span class="pe-2 fw-semibold text-nowrap">Cheque No.</span>
                    <div class="d-flex align-items-center justify-content-center w-100">
                        <span>
                            <?php echo "គ្មាន" ?>
                        </span>
                    </div>
                </div>
                <div class="d-flex align-items-center w-50">
                    <span class="pe-2 fw-semibold">Cash</span>
                    <div class="d-flex align-items-center justify-content-center w-100">
                        <span>
                            <?php echo "គ្មាន" ?>
                        </span>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center w-100 py-2">
                <div class="d-flex align-items-center w-50">
                    <span class="pe-2 fw-semibold">Bank</span>
                    <div class="d-flex align-items-center justify-content-center w-100">
                        <span>
                            <?php echo "គ្មាន" ?>
                        </span>
                    </div>
                </div>
                <div class="d-flex align-items-center w-50">
                    <span class="pe-2 fw-semibold">Dated</span>
                    <div class="d-flex align-items-center justify-content-center w-100">
                        <span>
                            <?php echo "គ្មាន" ?>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center w-100 py-2 mt-5">
            <div class="d-flex align-items-center w-50">
                <span class="pe-2 fw-semibold text-nowrap">Received By</span>
                <div class="d-flex align-items-center justify-content-center w-100">
                    <span>
                        <?php echo "គ្មាន" ?>
                    </span>
                </div>
            </div>
            <div class="d-flex align-items-center w-50">
                <span class="pe-2 fw-semibold">Cashier</span>
                <div class="d-flex align-items-center justify-content-center w-100">
                    <span>
                        <?php echo "គ្មាន" ?>
                    </span>
                </div>
            </div>
        </div>
    </body>
</html>