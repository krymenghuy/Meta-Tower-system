              <style>
    div.rpt-section-divider{
       display:block;
       width:50%;
       padding:10px;
       margin-top:7px;
       border-bottom:1.5px double green; 
    }
    div.rpt-section-divider span{
       display:block;
       padding:2px;
       font-size:1em;
       font-weight:bold;
       color:green;
    }
    table.rpt-package-list{
        margin-bottom:-7px;
    }
    table.rpt-package-list>thead th {
        color:grey;
        font-size:0.8em;
        text-transform:uppercase;
        font-weight:normal;
    }
    table.rpt-package-list>tbody td{
        font-size:0.8em;
        font-size:normal; 
    }       
    .rpt-adjustment td{
      color:orange;
    }
    .total-row td{
        font-weight:bold;
    }  
    </style> 
                <?php
                 echo '<table class="table rpt-package-list"><thead><tr>
                  <th class="border-0  small font-weight-bold">No</th>
                  <th class="border-0  small font-weight-bold">Loan#</th>
                  <th class="border-0  small font-weight-bold">Borrower Name</th>
                  <th class="border-0  small font-weight-bold">Pmt. Date</th>
                  <th class="border-0  small font-weight-bold">Pmt. Method</th>
                  <th class="border-0  small font-weight-bold">Type</th>
                  <th class="border-0  small font-weight-bold">Amt (Net)</th>
                  <th class="border-0  small font-weight-bold">Discount(%)</th>
                  <th class="border-0  small font-weight-bold">Principal</th>
                  <th class="border-0  small font-weight-bold">Interest</th>
                  <th class="border-0  small font-weight-bold">Penalty</th>
                  <th class="border-0  small font-weight-bold">Outs. Principal</th>
                  <th class="border-0  small font-weight-bold">Received By</th>
                  <th class="border-0  small font-weight-bold">Booking Date</th>
                 </tr></thead>';

                 echo '<tbody>';
                  $numero =0;
                  $total=0;
                  $total_principal =0;
                  $total_interest = 0;
                  $total_penalty = 0;
                  $cur = '$';
                  foreach($items AS $row) {
                    $numero++;
                    $cur = isset($row->currency)?$row->currency:'$';
                    $row_style = null;
                    if(strtolower($row->pmt_type) =='adjustment') $row_style = 'rpt-adjustment';
                    echo '<tr class='.$row_style.'>'.
                    '<td>'.$numero.'</td>'.
                    '<td>'.$row->loan_code.'</td>'.
                    '<td>'.$row->borrower_name.'</td>'.
                    '<td>'.$row->payment_date.'</td>'.
                    '<td>'.$row->pmt_method.'</td>'.
                    '<td>'.$row->pmt_type.'</td>'.
                    '<td>'.$cur.$row->net_amount.'</td>'.
                    '<td>'.$row->discount_percent.'%</td>'.
                    '<td>'.$cur.$row->principal_amount.'</td>'.
                    '<td>'.$cur.$row->interest_amount.'</td>'.
                    '<td>'.$cur.$row->penalty_fee.'</td>'.
                    '<td>'.$cur.$row->outstanding_principal.'</td>'.
                    '<td>'.$row->receiver_name.'</td>'.
                    '<td>'.$row->booking_date.'</td>'.   
                    '</tr>';
                    $total += $row->net_amount;
                    $total_principal += $row->principal_amount;
                    $total_interest += $row->interest_amount;
                    $total_penalty += $row->penalty_fee;
                  }
                  echo '<tr class="total-row"><td colspan="6" style="text-align:right">Total: </td><td>'.$cur.$total.'</td><td></td><td>'.$cur.$total_principal.'</td><td>'.$cur.$total_interest.'</td><td>'.$cur.$total_penalty.'</td></tr>'; 
                  echo '</tbody></table>';
                  if ($numero ==0) {
                   echo '<div class="flat-alert-box">No items found! You may choose different filter options</div>';
                 }
                ?>
                        