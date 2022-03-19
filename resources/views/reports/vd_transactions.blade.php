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
                  $html_head ='<table class="table rpt-package-list"><thead><tr>
                  <th class="border-0  small font-weight-bold">No</th>
                  <th class="border-0  small font-weight-bold">Type</th>
                  <th class="border-0  small font-weight-bold">Payment Date</th>
                  <th class="border-0  small font-weight-bold">Description</th>
                  <th class="border-0  small font-weight-bold">Payment Method</th>
                  <th class="border-0  small font-weight-bold">Amount</th>
                  <th class="border-0  small font-weight-bold">Remarks</th>
                  <th class="border-0  small font-weight-bold">Booked By</th>
                 </tr></thead>';

                  $html_body = '<tbody>';
                  $numero =0;
                  foreach($items AS $row) {
                    $numero++;  
                    $html_tr = '<tr>'.
                    '<td>'.$numero.'</td>'.
                    '<td>'.$row->trx_type.'</td>'.
                    '<td>'.$row->payment_date.'</td>'.
                    '<td>'.$row->special_notes.'</td>'.
                    '<td>'.$row->pmt_method.'</td>'.
                    '<td>'.$row->amount.'</td>'.
                    '<td>'.$row->description.'</td>'.
                    '<td>'.$row->cashier_name.'</td>'.  
                    '</tr>';
                    $html_body .= $html_tr; 
                  }
                   
                  $html_body .= '</tbody></table>';
                  if ($numero ==0) {
                    $html_body .='<div class="flat-alert-box">No items found! You may choose different filter options</div>';
                 } 
                  echo $html_head.$html_body;
                ?>
                        