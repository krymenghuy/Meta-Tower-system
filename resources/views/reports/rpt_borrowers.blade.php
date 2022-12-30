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
    </style> 
                <?php
                  echo '<table class="table rpt-package-list"><thead><tr>
                  <th class="border-0  small font-weight-bold">No</th>
                  <th class="border-0  small font-weight-bold">Name</th>
                  <th class="border-0  small font-weight-bold">Loan#</th>
                  <th class="border-0  small font-weight-bold">Phone Number</th>
                  <th class="border-0  small font-weight-bold">Email</th>
                  <th class="border-0  small font-weight-bold">Principal</th>
                  <th class="border-0  small font-weight-bold">Interest(%)</th>
                  <th class="border-0  small font-weight-bold">Outs. Principal</th>
                  <th class="border-0  small font-weight-bold">Disbursed By</th>
                 </tr></thead>';

                 echo '<tbody>';
                  $numero =0;
                  foreach($items AS $row) {
                    $numero++;
                    $cur = isset($row->currency)?$row->currency:'$';
                    $outstanding_principal = $row->principal - $row->principal_paid;  
                    echo '<tr>'.
                    '<td>'.$numero.'</td>'.
                    '<td>'.$row->borrower_name.'</td>'.
                    '<td>'.$row->loan_code.'</td>'.
                    '<td>'.$row->phone_number.'</td>'.
                    '<td>'.$row->email.'</td>'.
                    '<td>'.$cur.$row->principal.'</td>'.
                    '<td>'.$row->monthly_interest_rate.'%</td>'.
                    '<td>'.$cur.number_format($outstanding_principal,2).'</td>'.
                    '<td>'.$row->disbursed_by.'</td>'.  
                    '</tr>';
                  }
                   
                  echo '</tbody></table>';
                  if ($numero ==0) {
                     echo '<div class="flat-alert-box">No items found! You may choose different filter options</div>';
                 } 
        
                ?>
                        