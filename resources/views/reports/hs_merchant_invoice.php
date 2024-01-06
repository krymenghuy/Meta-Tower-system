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
            tr.status-9 td{
              color:#EF4234;
            }
            tr.status-5 td{
              color:#6C3483;
            }
            tr.status-6 td{
              color:#2E86C1;
            }
            tr.status-11 td{
                color:#EF7B34;
            }
            tr.total-row td{
                font-weight:600;
            }
        </style>
    </head>
    <body>
    <?php
          function renderGroupTable($rows,$date,&$grand_total_driver,&$grand_total_taxi,&$grand_total_fees,&$grand_total_merchant){
             $start_table = '<div class="w-100 bg-primary text-center p-2"><span class="p-2 text-white fw-semibold">'.date('d M Y',strtotime($date)).'</span></div><table class="table table-bordered table-hover">
                    <thead>
                        <tr class="fw-bold bg-body-secondary">
                            <th>ល.រ</th>
                            <th>លេខកញ្ចប់</th>
                            <th>លេខទូរស័ព្ទភ្ញៀវ</th>
                            <th>ទីតាំងភ្ញៀវ</th>
                            <th>ថ្ងៃទទួល</th>
                            <th>ថ្ងៃដឹកឬបញ្ចប់</th>
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
                    <tbody>';
                    
                    $no = 1;
                    $delivery_price = 0; $delivery_price_byCar = 0; $total_price = 0; $total_payment = 0;

                    $cur ="$ ";
                    $total_fees =0;
                    $total_taxi =0;
                    $total_receiveable=0;
                    $total_prices =0;
                    $total_driver_total =0;
                    $sender_settled_amount =0;
                    $total_sender_settlement =0;

                    $html_body ='';
                    foreach($rows as $row){
                        $admin_notes = isset($row->remarks)?$row->remarks:'';
                        $driver_total =0; 
                        $df_payer = strtolower($row->df_payer);
                        $fees = ($row->status_id ==8)? ($row->delivery_fee + $row->base_fee):0;
                        if (!$row->cod || $row->cod==0){
                            $driver_total = 0; 
                        }
                        //else $driver_total = $row->price; 
                        if($row->price > 0) $driver_total = $row->price;
                        if($df_payer =='receiver') $driver_total += $fees -$row->forwarding_cost;
                        else $driver_total -= $row->forwarding_cost;  
                        $irregular_notes = '<span class="d-block p-1 text-danger">'.((!$row->cod && $row->price > 0)? 'issue 101' : ($row->cod ==1 && $row->price <=0? 'issue 102':'')).'</span>';
                        $sender_settled_amount =$driver_total - $fees; //+ $row->adjustment
                        $receiveable = $sender_settled_amount < 0? $sender_settled_amount:0;  
                        $total_fees += $fees;
                        $total_taxi +=$row->forwarding_cost;
                        $total_receiveable +=$receiveable;
                        $total_prices += $row->price;
                        $total_driver_total += $driver_total;
                       
                        if($row->status_id ==8) $total_sender_settlement += $sender_settled_amount;
                        // $pg_staus = "<span class=\"text-primary\">$row->status</span>";
                        if($row->status_id ==8)  $pg_staus = "<span class=\"text-success\">$row->status</span>";
                        else if($row->status_id ==6 || $row->status_id ==5) $pg_staus = "<span class=\"text-warning\">$row->status</span>";
                        else if ($row->status_id ==9)  $pg_staus = "<span class=\"text-danger\">$row->status</span>";
                        $remarks = $row->status_id ==8? '<div class="d-flex flex-column"><span class="d-block text-success">Success</span><span style="font-size:0.8em">'.$row->delivery_time.'</span><span class="d-block text-secondary">'.$admin_notes.'</span></div>':$row->failure_notes;
                        $cus_address = isset($row->destination)?$row->destination:$row->receiver_address;
                        $html_body .= '<tr class="status-'.$row->status_id.'"><td>'.$no++.'</td>'.
                        '<td><div class="d-flex flex-column"><span>'.$row->barcode.'</span></div></td>'.
                        '<td>'.$row->receiver_phone.'</td>'.
                        '<td>'.$cus_address.'</td>'.
                        "<td><span class=\"d-block\">$row->arrival_date</span></td>".
                        '<td>'.$row->delivery_time.'</td>'.
                        '<td>'.$row->delivery_type.'</td>'.
                        //'<td>'.($row->cod==1?'Yes':'No').'</td>'.
                        '<td><span class="d-block">'.$cur.number_format($row->price,2,'.','').'</span>'.$irregular_notes.'</td>'.
                        '<td><span class="d-block">'.$cur.number_format($fees,2,'.','').'</span><span class="d-block w-100 text-right p-1 text-warning"><small>'.$row->df_payer.'</small></span></td>'.
                        '<td>'.$cur.number_format($row->forwarding_cost,2,'.','').'</td>'.
                         //"<td>".$pg_staus."</td>".
                        "<td>".($row->status_id==8? $cur.number_format($sender_settled_amount,2,'.',''):"")."</td>".
                        '<td>'.$remarks.'</td>'.
                        '</tr>';
                        $delivery_price += ($row->delivery_fee + $row->base_fee);
                        $delivery_price_byCar += $row->forwarding_cost;
                        $total_price += ($row->price + $row->delivery_fee + $row->base_fee);
                        $total_payment += $row->price;
                    }   

                    $grand_total_driver += $total_driver_total;
                    $grand_total_taxi += $total_taxi;
                    $grand_total_fees += $total_fees;
                    $grand_total_merchant += $total_sender_settlement;
                     $end_table = '<tr class="fw-bold border border-0">
                            <td colspan="5" class="border border-bottom-0 border-start-0"></td>
                            <td colspan="2" class="bg-warning-subtle border-secondary-subtle border-bottom" align="center">សរុប៖</td>
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                                '.$cur.number_format($total_driver_total,2,'.','').'
                            </td>
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                                '.$cur.number_format($total_fees,2,'.','.').'
                            </td>
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                                '.$cur.number_format($total_taxi,2,'.','').'
                            </td>
                            <!-- <td class="bg-warning-subtle border-secondary-subtle border-bottom">
                            </td> -->
                            <td class="bg-warning-subtle border-secondary-subtle border-bottom">'.
                               $cur.number_format($total_sender_settlement,2,'.','').'
                            </td> 
                        </tr>
                    </tbody>
                </table>';
                echo $start_table.$html_body.$end_table;
          }
        ?>

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
                        <div class="d-flex align-items-center">
                            <p class="text-danger fw-semibold"><small>Item listing is based on arrival date</small></p>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="bg-dark" style="height:2px; opacity:0.6"/>
            <div>
            <?php
                  $grand_total_driver =0;
                  $grand_total_taxi = 0;
                  $grand_total_fees = 0;
                  $grand_total_merchant =0; 
                  $cur =$data->currency_symbol;
                  foreach($data->packagesByDate as $date => $group_rows) renderGroupTable($group_rows,$date,  $grand_total_driver,  $grand_total_taxi, $grand_total_fees,$grand_total_merchant);
                  echo '<div class="bg-success d-flex justify-content-center">'.
                    '<div class="d-flex gap-5 pt-2"><span class="pt-3 text-right fw-semibold text-white">សរុបទាំងអស់៖ </span>'.
                    '<div class="d-flex flex-column"><span class="fw-semibold text-white p-1">COD</span><span class="text-white p-1 fw-semibold">'.$cur.number_format($grand_total_driver,2,'.','').'</span> </div>'.
                    '<div class="d-flex flex-column"><span class="fw-semibold text-white p-1">Taxi</span><span class="text-white p-1 fw-semibold">'.$cur.number_format($grand_total_taxi,2,'.','').'</span></div>'.
                    '<div class="d-flex flex-column"><span class="fw-semibold text-white p-1">Fees</span><span class="text-white p-1 fw-semibold">'.$cur.number_format($grand_total_fees,2,'.','').'</span></div>'.
                    '<div class="d-flex flex-column"><span class="fw-semibold text-white p-1">Amount</span><span class="text-white p-1 fw-semibold">'.$cur.number_format($grand_total_merchant,2,'.','').'</span></div>'.
                  '</div></div>';
               ?>
            </div>
        </div>
    </body>
</html>