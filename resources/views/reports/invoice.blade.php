<!DOCTYPE html>
<html>
<head>
    <?php StyleManager::render('report-styles'); ?>
    <?php ScriptManager::render('report-scripts'); ?>
    <style>
        body {
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }
        .rpt-body {
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
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
        }
    </style>
</head>

<body>
    <?php
      if ($invoice->currency_code === 'USD') $cur_symbol ='$';
      else if ($invoice->currency_code == 'KHR') $cur_symbol ='រ';
    ?>

    <div class="border border-1 border-success rounded m-2">
        <div class="rpt-body">
            <div class="d-block px-3">
                <div class="d-block w-100">
                    <div class="d-flex align-items-center w-100 py-2">
                        <div class="d-flex align-items-center">
                            <div>
                                <img style="width: 120px" class="img-thumbnail" src="<?php echo isset($branch->logo_url) ? $branch->logo_url : null ?>"/>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-center w-100">
                            <div class="px-2">
                                <h4 class="fw-bold fs-2">
                                    <?php echo isset($title) ? $title:null; ?>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center flex-column w-100">
                        <div class="d-flex align-items-center">
                            <p><?php echo "The Premier Land Sensok, SteetA, House N #74, 78, Vilage Bayab"?></p>
                        </div>
                        <div class="d-flex align-items-center">
                            <p><?php echo "Commune, Sangkat Phnom Pehn Thmey, Khan Sensok, Phnom Penh"?></p>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="pe-2">Tel</p>
                            <p>
                                <span><?php echo "Cellcard 077 220 089"?></span>
                                <span><?php echo "Smart 098 422 000"?></span>
                            </p>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="pe-2">Email:</p>
                            <p><?php echo "Esthemdermsurgeryclinic@gmail.com"?></p>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center w-100 flex-column">
                    <div class="d-flex align-items-center w-100">
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Patient ID:</p>
                            </div>
                            <p><?php echo "P000408-2-010183"?></p>
                        </div>
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Invoice No:</p>
                            </div>
                            <p><?php echo "2310000282"?></p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center w-100">
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Patient's Name:</p>
                            </div>
                            <p><?php echo "Oeung Houng"?></p>
                        </div>
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Invoice Date:</p>
                            </div>
                            <p><?php echo "21/02/2023"?></p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center w-100">
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Age:</p>
                            </div>
                            <p><?php echo "40Y - 1M - 20D"?></p>
                        </div>
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Sex:</p>
                            </div>
                            <p><?php echo "Female"?></p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center w-100">
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Telephone:</p>
                            </div>
                            <p><?php echo "099999922"?></p>
                        </div>
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Address:</p>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center w-100">
                        <div class="d-flex align-items-center w-50">
                            <div style="width: 200px">
                                <p>Card ID:</p>
                            </div>
                            <p><?php echo ""?></p>
                        </div>
                    </div>
                </div>
                <div class="border-responsive border rounded mt-5">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>MEDICINE</th>
                                <th>DETAIL</th>
                                <th>USAGE</th>
                                <th>QTY</th>
                                <th>PRICE</th>
                                <th>DISCOUNT</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($invoice->items as $item)
                                <tr>
                                    <td><?php $cnt = 1; echo $cnt++ ?></td>
                                    <td>{{ $item->item_name }}</td>
                                    <td></td>
                                    <td>The term medical is used when something has to do with medicine or the field of medicine. Medical can often be heard when discussing locations, drugs, or practices involving hospitals, doctors, and pharmacies.</td>
                                    <td><?php echo number_format((float)$item->qty,0); ?></td>
                                    <td>{{$cur_symbol}} {{$item->price }}</td>
                                    <td>{{$item->discount_percent}}%</td>
                                    <td>{{$cur_symbol}}{{ $item->line_total }}</td>
                                </tr>
                            @endforeach
                            <tr>
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Subtotal</td>
                                <td>{{$cur_symbol}}{{$invoice->amount}}</td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Discount</td>
                                <td><?php echo $invoice->discount_percent."%"; ?></td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Sales Tax</td>
                                <td><?php echo $cur_symbol.$invoice->tax_amount; ?></td>
                            </tr>
                            <tr class="border-bottom border border-0">
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Total</td>
                                <td><?php echo $cur_symbol.$invoice->amount_due; ?></td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>SERVICE</th>
                                <th>QTY</th>
                                <th>PRICE</th>
                                <th>DISCOUNT</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                              $cur = $invoice->currency_code==='KHR'?'$':"$";
                              $cnt =0;
                              $numero = 0;
                              foreach($invoice->service_items as $item){
                               $numero++;
                               $qty = $item->qty.$item->sku;
                               $price = $cur.$item->price;
                               $line_total = $cur.$item->line_total;
                                 echo "<tr>
                                 <td>$numero</td>
                                 <td>$item->name</td>
                                 <td>$qty</td>
                                 <td>$price</td>
                                 <td>$line_total</td>
                                 </tr>";
                               $cnt++;
                              }
                            ?>
                        </tbody>
                    </table>
                </div>
                <div class="d-block mt-5">
                    <div class="d-flex align-items-end justify-content-end">
                        <div class="d-block">
                            <p class="fw-bold">PAYMENT INFORMATION</p>
                            <p><?php echo "Terms: ".$invoice->terms; ?></p>
                            <p>PAYMENT TO: </p>
                            <p>
                                <span class="d-block"><?php echo "Account number: ".$invoice->pmt_account_number; ?></span>
                                <span class="d-block"><?php echo "Holder name: ".$invoice->pmt_account_name; ?></span>
                                <span class="d-block"><?php echo "Bank Name: ".$invoice->pmt_bank_name; ?></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
