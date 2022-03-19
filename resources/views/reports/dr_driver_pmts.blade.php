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
        font-weight:normal;
    }
    table.rpt-package-list>tbody td{
        font-size:0.8em;
        fontsize:normal; 
    }
    td.total-text{
        text-align:right;
        font-weight:bold;
        padding-right:15px;
    }
    td.total-value{
        font-weight:bold;
    }         
    </style> 
                <?php
                    function createTableRow_html($row, $cur =null) {
                        if(isset($row->cur)) $cur = $row->cur;
                        if(!$cur) $cur ='$';
                        return '<tr>'.
                        '<td>'.$row->payment_date.'</td>'.
                        '<td>'.$row->payer_name.'</td>'.
                        '<td>'.($row->description?$row->description:'Payment from '.$row->payer_name).'</td>'.
                        '<td>'.$row->pmt_method.'</td>'.
                        '<td>'.$cur.$row->amount.'</td>'.
                        '<td>'.$row->cashier_name.'</td>'.
                        '<td></td>'.
                        '</tr>';
                    }
                   
                    function displayPaymentTable($items){
                        echo '<table class="table table-bordered">';
                        echo '<thead>
                                <tr>
                                    <th class="border-0  small font-weight-bold">DATE</th>
                                    <th class="border-0  small font-weight-bold">PAYER NAME</th>
                                    <th class="border-0  small font-weight-bold">DECRIPTION</th>
                                    <th class="border-0  small font-weight-bold">PMT METHOD</th>
                                    <th class="border-0  small font-weight-bold">AMOUNT</th>
                                    <th class="border-0  small font-weight-bold">BOOKED BY</th>
                                    <th class="border-0 small font-weight-bold">REMARKS</th> 
                                </tr>
                            </thead><tbody>';
                        $total = 0;
                        $cur= null;
                        $row_cnt = 0;     
                        foreach($items as $row){
                            $cur = isset($row->cur)?$row->cur:'$';
                            $amt = $row->amount;
                            $total += $amt;
                            echo createTableRow_html($row); 
                            $row_cnt++;
                        }
                        if ($row_cnt > 0) echo '<tr><td class="total-text" colspan="4" style="border:none">Total Payment: </td><td class="total-value" style="border:none">'.$cur.$total.'</td><td colspan="2" style="border:none"></td></tr>';
                        echo '</tbody></table>';
                        if ($row_cnt <=0) echo '<div class="flat-alert-box">No data found! You may choose different filter options</div>';
                    }
                    displayPaymentTable($pmt_items);
                 ?>
                        