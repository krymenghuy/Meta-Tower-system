<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            body {
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-body {
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }
            
            .no-item-text{
                color:grey;
                font-style: italic;
            }
            @media print{
                @page{
                    margin: 0;
                    size: A4 portrait;
                }

                body{
                    width: 100%;
                    height: 100%;
                    zoom: 88%;
                    font-size: 16px;
                }

                .mt-5{
                    margin-top:10px;
                }
            }
            
            .hor-label-value::before{
                  content:': '; 
            } 
        </style>
    </head>
    <body>
        <?php
            if ($invoice->currency_code === 'USD') $cur_symbol ='$';
            else if ($invoice->currency_code == 'KHR') $cur_symbol ='រ';
        ?>
        <div class="m-2">
            <div class="rpt-body">
                <div class="d-block px-3">
                    <div class="d-block w-100">
                        <div class="d-flex w-100 py-2">
                            <div class="d-flex">
                                <div>
                                    <img style="width: 200px" class="img-thumbnail" src="<?php echo isset($branch->logo_url) ? $branch->logo_url : null ?>"/>
                                </div>
                            </div>
                            <div class="d-block w-100">
                                <div class="d-flex px-2 justify-content-center">
                                    <h4 class="fw-bold fs-2" style="color:hsl(51, 100%, 40%);">
                                        <?php echo isset($title) ? $title : null; ?>
                                    </h4>
                                </div>
                                <div class="d-flex justify-content-center" style="color:#96958F;font-style:italic;">
                                    <p>
                                        <?php echo $branch->address; ?>
                                    </p>
                                </div>
                                <div class="d-flex justify-content-center" style="margin-top:-15px;color:#96958F;font-style:italic;">
                                    <p class="pe-2">Tel</p>
                                    <p>
                                        <?php echo $branch->phone_number; ?>
                                    </p>
                                </div>
                                <div class="d-flex justify-content-center" style="margin-top:-15px;color:#96958F;font-style:italic;">
                                    <p class="pe-2">Email:</p>
                                    <p>
                                        <?php echo $branch->email; ?>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center w-100 flex-column">
                        <div class="d-flex align-items-center w-100">
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Patient ID</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->customer_code; ?>
                                </p>
                            </div>
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Invoice No</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->ref_number; ?>
                                </p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center w-100">
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Patient's Name</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->customer_name; ?>
                                </p>
                            </div>
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Invoice Date</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->issue_date; ?>
                                </p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center w-100">
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Age</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->age; ?>
                                </p>
                            </div>
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Sex</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->sex; ?>
                                </p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center w-100">
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Telephone</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->customer_phone; ?>
                                </p>
                            </div>
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Address</p>
                                </div>
                                <p class="hor-label-value">
                                    <?php echo $invoice->billing_address?$invoice->billing_address:"NA"; ?>
                                </p>
                            </div>
                        </div>
                        <!-- <div class="d-flex align-items-center w-100">
                            <div class="d-flex align-items-center w-50">
                                <div style="width: 200px">
                                    <p>Card ID</p>
                                </div>
                            </div>
                        </div> -->
                    </div>
                    <div class="table-responsive mt-3">
                        <table class="table border mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th class="w-25">MEDICINE</th>
                                    <th class="w-15">QTY</th>
                                    <th class="w-15">PRICE</th>
                                    <th class="w-15">DISCOUNT</th>
                                    <th class="w-15">VAT</th>
                                    <th class="w-15">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                    $cnt = 1;
                                    $total_product = 0;
                                    $total_discount_percent = 0;
                                    $total_tax_rate = 0;
                                    $style_def_width="style=\"width:15%\"";
                                    $p_cnt =0;
                                    foreach($invoice->products as $item){
                                        echo "<tr>
                                            <td>".$cnt++."</td>
                                            <td style=\"width:25%\">".$item->item_name."</td>
                                            <td $style_def_width>".number_format((float)$item->qty,0)." ".$item->sku."</td>
                                            <td $style_def_width>".$cur_symbol." ".$item->price."</td>
                                            <td $style_def_width>".$item->discount_percent." %</td>
                                            <td $style_def_width>".$item->tax_rate." %</td>
                                            <td $style_def_width>".$cur_symbol." ".$item->line_total."</td>
                                        </tr>";
                                        $total_product += $item->line_total;
                                        $total_discount_percent += $item->discount_percent;
                                        $total_tax_rate += $item->tax_rate;
                                        $p_cnt++;
                                    }
                                    if($p_cnt==0) echo "<tr><td class=\"no-item-text\" colspan=\"100%\">There are no medicine or items here</td></tr>";
                                ?>
                            </tbody>
                        </table>
                        <table class="table border mt-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th style="width:25%">SERVICE</th>
                                    <th style="width:15%">QTY</th>
                                    <th style="width:15%">PRICE</th>
                                    <th style="width:15%">DISCOUNT</th>
                                    <th style="width:15%">VAT</th>
                                    <th style="width:15%">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                    $cur = $invoice->currency_code === 'KHR' ? '៛' :"$";
                                    $numero = 0;
                                    $total_service = 0;
                                    $style_def_width="style=\"width:15%\"";
                                    $srv_cnt =0;
                                    foreach($invoice->services as $item){
                                        $numero++;
                                        $qty = $item->qty;
                                        $price = $cur." ".$item->price;
                                        $line_total = $cur." ".$item->line_total;
                                        echo "<tr>
                                            <td>".$numero."</td>
                                            <td style=\"width:25%\">".$item->item_name."</td>
                                            <td $style_def_width>".$qty."</td>
                                            <td  $style_def_width>".$price."</td>
                                            <td $style_def_width>".$item->discount_percent." %</td>
                                            <td $style_def_width>".$item->tax_rate." %</td>
                                            <td $style_def_width>".$line_total."</td>
                                        </tr>";
                                        $total_service += $item->line_total;
                                        $total_discount_percent += $item->discount_percent;
                                        $total_tax_rate += $item->tax_rate;
                                        $srv_cnt++;
                                    }
                                    if($srv_cnt==0) echo "<tr><td class=\"no-item-text\" colspan=\"100%\">There are no services here</td></tr>";
                                ?>
                                <tr>
                                    <td colspan="5" rowspan="3" style="border:none">
                                      <div class="d-block p-1">
                                            <p class="fw-bold">PAYMENT TO</p>
                                                <span class="d-block">
                                                    <?php echo "Bank Name: ".$invoice->pmt_bank_name; ?>
                                                </span>
                                                <span class="d-block">
                                                    <?php echo "Account number: ".$invoice->pmt_account_number; ?>
                                                </span>
                                                <span class="d-block">
                                                    <?php echo "Holder name: ".$invoice->pmt_account_name; ?>
                                                </span>
                                               
                                        </div>
                                    </td>
                                    <td class="fw-semibold">Subtotal</td>
                                    <td><?php echo $cur_symbol." ".$total_product + $total_service ?></td>
                                </tr>
                                <tr>
                                    <!-- <td colspan="5" style="border:none"></td> -->
                                    <td class="fw-semibold">Discount</td>
                                    <td>
                                        <?php echo $total_discount_percent." %"; ?>
                                    </td>
                                </tr>
                                <tr>
                                    <!-- <td colspan="5" style="border:none"></td> -->
                                    <td class="fw-semibold">VAT</td>
                                    <td>
                                        <?php echo $cur_symbol." ".$total_tax_rate; ?>
                                    </td>
                                </tr>
                                <tr class="border-bottom border border-0">
                                    <td colspan="5" style="border:none"></td>
                                    <td class="fw-semibold">Total</td>
                                    <td>
                                        <?php echo $cur_symbol." ".$invoice->amount_due; ?>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="d-block mt-5">
                        <div class="d-flex align-items-end justify-content-end">
                    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>