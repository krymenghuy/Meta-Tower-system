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
                  <th class="border-0  small font-weight-bold">Student ID</th>
                  <th class="border-0  small font-weight-bold">Student Name</th>
                  <th class="border-0  small font-weight-bold">First Pmt</th>
                  <th class="border-0  small font-weight-bold">Principal</th>
                  <th class="border-0  small font-weight-bold">Min Installment</th>
                  <th class="border-0  small font-weight-bold">Monthly Interest</th>
                  <th class="border-0  small font-weight-bold">Oustanding</th>
                  <th class="border-0  small font-weight-bold">Disbursed By</th>
                 </tr></thead>';

                 echo '<tbody>';
                  $numero =0;
                   
                  foreach($items AS $row) {
                    $numero++;
                    $outstanding_principal = $row->principal - $row->principal_paid;
                    $cur = isset($row->currency)?$row->currency:'$';
                    $p_date = new DateTime(convertDate($row->first_pmt_date));
                    $today = new DateTime(date('Y-m-d'));
                    $diff = $today->diff($p_date);
                    $date_style ='style="color:orange;"';
                    if($diff->days > 0) $date_style ='style="color:red;"';
                    if($cur) $cur='$';  
                    echo '<tr>'.
                    '<td>'.$numero.'</td>'.
                    '<td>'.$row->student_code.'</td>'.
                    '<td>'.$row->borrower_name.'</td>'.
                    '<td '.$date_style.'>'.$row->first_pmt_date.'</td>'.
                    '<td>'.$cur.$row->principal.'</td>'.
                    '<td '.$date_style.'>'.$cur.$row->minimum_installment.'</td>'.
                    '<td>'.$row->monthly_interest_rate.'%</td>'.
                    '<td>'.$cur.number_format($outstanding_principal,2).'</td>'.
                    //'<td>'.$row->remarks.'</td>'.
                    '<td>'.$row->disbursed_by.'</td>'.  
                    '</tr>';
 
                  }
                  echo '</tbody></table>';
                  if ($numero ==0) {
                    echo '<div class="flat-alert-box">No items found! You may choose different filter options</div>';
                 } 
                  
                ?>
                        