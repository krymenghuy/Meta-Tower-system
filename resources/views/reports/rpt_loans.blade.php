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
        fontsize:normal; 
    }     
    .total-row td{
      font-weight:bold;
    }    
    </style> 
                <?php
                  echo '<table class="table rpt-package-list"><thead><tr>
                  <th class="border-0  small font-weight-bold">No</th>
                  <th class="border-0  small font-weight-bold">Loan Number</th>
                  <th class="border-0  small font-weight-bold">Borrower Name</th>
                  <th class="border-0  small font-weight-bold">Disburse Date</th>
                  <th class="border-0  small font-weight-bold">Principal</th>
                  <th class="border-0  small font-weight-bold">Prin. Discount</th>
                  <th class="border-0  small font-weight-bold">Net Principal</th>
                  <th class="border-0  small font-weight-bold">Principal Paid</th>
                  <th class="border-0  small font-weight-bold">Interest Earned</th>
                  <th class="border-0  small font-weight-bold">Monthly Interest</th>
                  <th class="border-0  small font-weight-bold">Oustanding</th>
                  <th class="border-0  small font-weight-bold">Disbursed By</th>
                 </tr></thead>';

                 echo '<tbody>';
                  $numero =0;
                  $total = 0;
                  $total_interest_paid =0;
                  $total_paid = 0;
                  $total_net_principal = 0;
                  $total_principal_disc = 0;

                  foreach($items AS $row) {
                    $numero++;
                    $outstanding_principal = $row->principal - $row->principal_paid;
                    $cur = isset($row->currency)?$row->currency:'$';
                    if($cur) $cur='$';  
                    echo '<tr>'.
                    '<td>'.$numero.'</td>'.
                    '<td>'.$row->loan_code.'</td>'.
                    '<td>'.$row->borrower_name.'</td>'.
                    '<td>'.$row->disburse_date.'</td>'.
                    '<td>'.$cur.$row->principal.'</td>'.
                    '<td>'.$cur.$row->discount_principal.'</td>'.
                    '<td>'.$cur.$row->net_principal.'</td>'.
                    '<td>'.$cur.$row->principal_paid.'</td>'.
                    '<td>'.$cur.$row->interest_paid.'</td>'.
                    '<td>'.$row->monthly_interest_rate.'%</td>'.
                    '<td>'.$cur.number_format($outstanding_principal,2).'</td>'.
                    //'<td>'.$row->remarks.'</td>'.
                    '<td>'.$row->disbursed_by.'</td>'.  
                    '</tr>';

                    $total += $row->principal;
                    $total_principal_disc += $row->discount_principal;
                    $total_net_principal += $row->net_principal;
                    $total_paid += $row->principal_paid;
                    $total_interest_paid += $row->interest_paid;

                  }
                  echo '<tr class="total-row"><td colspan="4" style="text-align:right">Total: </td><td>'.$cur.$total.'</td><td>'.$cur.$total_principal_disc.'</td><td>'.$cur.$total_net_principal.'</td><td>'.$cur.$total_paid.'</td><td>'.$cur.$total_interest_paid.'</td></tr>'; 
                  echo '</tbody></table>';
                  if ($numero ==0) {
                    echo '<div class="flat-alert-box">No items found! You may choose different filter options</div>';
                 } 
                  
                ?>
                        