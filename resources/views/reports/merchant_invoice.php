<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            @media screen{
                body {
                    margin: 0;
                    color: #000;
                    background-color: #fff;
                    font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
                }
            }

            @media print{
                body {
                    margin: 0;
                    box-shadow: 0;
                    zoom:59%;
                    font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
                    -webkit-print-color-adjust: exact;
                    -moz-print-color-adjust: exact;
                    -ms-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }

            @page{
                width:100%;
                margin:0;
            }

            @page: footer{
                display: none;
            }

            @page: header{
                display: none;
            }

            div.flat-alert-box {
                box-shadow: border-box;
                border: 1.2px solid #CDD4D5;
                padding: 10px;
                margin: 10px;
                color: #A1E3EE;
                font-weight: 0.2em;
                font-size: 1.2em;
                border-radius: 2px;
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-title {
                display: inline-block;
                text-align: center;
                font-size: 1.2em !important;
                font-weight: bold;
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-sub-title1,
            .rpt-sub-title {
                display: inline-block;
                text-align: center;
                font-size: 0.9em;
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .center {
                margin-left: 50%;
                transform: translate(-50%);
            }
        </style>
    </head>
    <body>
        <div class="invoice-hs border border-1 rounded-3 m-3 p-2">
            <div class="d-flex">
                <!-- <div class="d-block w-50">
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">Facebook Page:</p>
                        <p>
                            <?php echo "Hou Express"; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">Telegram:</p>
                        <p>
                            <?php echo "098928678"; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">H/P:</p>
                        <p>
                            <?php echo $branch->phone_number; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">Address:</p>
                        <p>
                            <?php echo $branch->address_kh; ?>
                        </p>
                    </div>
                </div> -->
                <!-- <div class="d-block w-50">
                    <div class="d-flex align-items-center justify-content-end">
                        <p class="fw-bold pe-2 text-start">ឈ្មោះគណនី:</p>
                        <p>
                            <?php echo "Pen Lida"; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                        <p class="fw-bold pe-2 text-start">Wing:</p>
                        <p>
                            <?php echo "04848402"; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                        <p class="fw-bold pe-2 text-start">ABA:</p>
                        <p>
                            <?php echo "069959694"; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                        <p class="fw-bold pe-2 text-start">ACLEDA/ទាន់ចិត្ត:</p>
                        <p>
                            <?php echo "069959694"; ?>
                        </p>
                    </div>
                </div> -->
            </div>
            <hr class="bg-dark" style="height:5px; opacity:1"/>
            <div class="d-flex w-100">
                <div class="d-block w-50">
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">ឈ្មោះអតិថិជន:</p>
                        <p>
                            <?php echo $data->merchant->name; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">លេខទូរស័ព្ទ:</p>
                        <p>
                            <?php echo $data->merchant->phone_number; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">អសយដ្ឋាន:</p>
                        <p>
                            <?php echo $data->merchant->address; ?>
                        </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">លេខគណនី:</p>
                        <p class="fs-5" style="color:var(--bs-red)">
                        <?php echo $merchant_bank? $merchant_bank->account_number." ($merchant_bank->bank_name)" :"គ្មាន"; ?>
                    </p>
                    </div>
                    <div class="d-flex align-items-center">
                        <p class="fw-semibold pe-2">ឈ្មោះគណនី:</p>
                        <p class="fs-5 text-success">
                            <?php echo $merchant_bank? $merchant_bank->account_name:"គ្មាន"; ?>
                        </p>
                    </div>
                </div>
                <div class="d-flex justify-content-end align-items-end w-50">
                    <div class="d-block">
                       <div class="d-flex align-items-center">
                            <p class="fw-semibold pe-2"><?php echo isset($pmt_status_title)?$pmt_status_title:null; ?></p>
                        </div>

                        <div class="d-flex align-items-center">
                            <p class="fw-semibold pe-2">កាលបរិច្ឆេទ:</p>
                            <p>
                                <?php echo isset($date) ? $date : null; ?>
                            </p>
                        </div>
                        <div class="d-flex align-items-center">
                            <p class="fw-semibold pe-2">អត្រាប្ដូប្រាក់:</p>
                            <p>
                                <?php echo $data->exchangeRateInfo->rate; ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="bg-dark" style="height:2px; opacity:0.6"/>
            <div>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="fw-bold bg-body-secondary">
                            <th></th>
                            <th>ចំនួនកញ្ចប់</th>
                            <th></th>
                            <th>សរុបតំលៃកញ្ចប់ទំនិញ</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>       
            </div>

            <div>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="fw-bold bg-body-secondary">
                            <th>ល.រ</th>
                            <th>លេខកញ្ចប់</th>
                            <th>លេខទូរស័ព្ទភ្ញៀវ</th>
                            <th>ទីតាំងភ្ញៀវ</th>
                            <th>ថ្ងៃទទួល</th>
                            <th>ប្រ.សេវាកម្ម</th>
                            <!-- <th>COD</th> -->
                            <th>COD</th>
                            <th>តំលៃដឹក</th>
                            <th>តំលៃឡាន</th>
                            <!-- <th>ស្ថានភាព</th> -->
                            <th>ទឹកប្រាក់ទូរទាត់</th>
                            <th>ចំណាំ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $no = 1;
                            $delivery_price = 0; $delivery_price_byCar = 0; $total_price = 0; $total_payment = 0;

                            $rows = $data->packages;
                            $cur ="$ ";
                            $total_fees =0;
                            $total_taxi =0;
                            $total_receiveable=0;
                            $total_prices =0;
                            $total_driver_total =0;
                            $sender_settled_amount =0;
                            $total_sender_settlement =0; 
                            foreach($rows as $row){
                                $admin_notes = $row->delivery_notes;
                                $fees = ($row->status_id ==8)? ($row->delivery_fee + $row->base_fee):0;
                                $sender_settled_amount =$row->driver_total - $fees - $row->forwarding_cost; //+ $row->adjustment
                                $receiveable = $sender_settled_amount < 0? $sender_settled_amount:0;  
                                $total_fees += $fees;
                                $total_taxi +=$row->forwarding_cost;
                                $total_receiveable +=$receiveable;
                                $total_prices += $row->price;
                                $total_driver_total += $row->driver_total;
                                if($row->status_id ==8) $total_sender_settlement += $sender_settled_amount;
                                $pg_staus = "<span class=\"text-primary\">$row->status</span>";
                                if($row->status_id ==8)  $pg_staus = "<span class=\"text-success\">$row->status</span>";
                                else if($row->status_id ==6 || $row->status_id ==5) $pg_staus = "<span class=\"text-warning\">$row->status</span>";
                                else if ($row->status_id ==9)  $pg_staus = "<span class=\"text-danger\">$row->status</span>";

                                $remarks = $row->status_id ==8? "<span class='d-block text-success'>Success</span><span class=\"d-block text-secondary\">$admin_notes</span>":$row->remarks;
                                echo '<tr><td>'.$no++.'</td>'.
                                '<td>'.$row->barcode.'</td>'.
                                '<td>'.$row->receiver_phone.'</td>'.
                                '<td>'.$row->receiver_address.'</td>'.
                                "<td><span class=\"d-block\">$row->arrival_date</span></td>".
                                '<td>'.$row->delivery_type.'</td>'.
                                //'<td>'.($row->cod==1?'Yes':'No').'</td>'.
                                '<td>'.$cur.$row->price.'</td>'.
                                '<td>'.$cur.$fees.'</td>'.
                                '<td>'.$cur.$row->forwarding_cost.'</td>'.
                                 //"<td>".$pg_staus."</td>".
                                "<td>".($row->status_id==8? $cur.$sender_settled_amount:"")."</td>".
                                '<td>'.$remarks.'</td>'.
                                '</tr>';
                                $delivery_price += ($row->delivery_fee + $row->base_fee);
                                $delivery_price_byCar += $row->forwarding_cost;
                                $total_price += ($row->price + $row->delivery_fee + $row->base_fee);
                                $total_payment += $row->price;
                            }
                        ?>
                        <tr class="fw-bold border border-0">
                            <td colspan="4" class="border border-bottom-0 border-start-0"></td>
                            <td colspan="2" class="bg-warning-subtle border-secondary-subtle border-bottom" align="center">សរុប៖</td>
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                                <?php echo $cur.$total_driver_total ?>
                            </td>
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                                <?php echo $cur.$total_fees ?>
                            </td>
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                                <?php echo $cur.$total_taxi ?>
                            </td>
                            <!-- <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                            </td> -->
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                               <?php echo $cur.$total_sender_settlement;?>
                            </td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
</html>