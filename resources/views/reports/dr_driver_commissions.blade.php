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
                        $unit_amount = $row->unit_amount;
                        $item_count = $row->item_count;
                        $total = $unit_amount * $item_count;
                        $remarks = isset($row->remarks)?$row->remarks:null;
                        $cat = strtolower($row->category);
                        $item_name=null;
                        if ($cat=='pickup') {
                            $item_name = 'packages'; //pickup_cmm_type ="per_item"
                            if(strtolower($row->cmm_type) =='per_pickup') $item_name ='pickups';
                        }
                        else if ($cat =='delivery') {
                            $item_name ='packages'; // deliery_cmm_type ="per_item"
                            if(strtolower($row->cmm_type) =='per_trip') $item_name ='trips';
                        }
                        return '<tr>'.
                        '<td>'.$row->category.'</td>'.
                        '<td>'.$row->delivery_type.'</td>'.
                        '<td>'.$row->item_count." ".$item_name.'</td>'.
                        '<td>'.$cur.$row->unit_amount.'</td>'.
                        '<td>'.$cur.$total.'</td>'.
                        '<td>'.$row->remarks.'</td>'.
                        '</tr>';
                    }
                   
                    function displayCommissionTable($items){
                        echo '<table class="table table-bordered">';
                        echo '<thead>
                                <tr>
                                    <th class="border-0  small font-weight-bold">CATEGORY</th>
                                    <th class="border-0  small font-weight-bold">TYPE</th>
                                    <th class="border-0  small font-weight-bold">COUNT</th>
                                    <th class="border-0  small font-weight-bold">UNIT</th>
                                    <th class="border-0  small font-weight-bold">TOTAL</th>
                                    <th class="border-0 small font-weight-bold">REMARKS</th> 
                                </tr>
                            </thead><tbody>';
                        $total = 0;
                        $cur= null;
                        $row_cnt = 0;     
                        foreach($items as $row){
                            $cur = isset($row->cur)?$row->cur:'$';
                            $unit_amount = $row->unit_amount;
                            $item_count = $row->item_count;
                            $line_total = $unit_amount * $item_count;
                            $total += $line_total;
                            echo createTableRow_html($row); 
                            $row_cnt++;
                        }
                        if ($row_cnt > 0) echo '<tr><td class="total-text" colspan="4">Total</td><td class="total-value">'.$cur.$total.'</td><td></td></tr>';
                        echo '</tbody></table>';
                        if ($row_cnt <=0) echo '<div class="flat-alert-box">No commissions found. You choose different filter options</div>';
                    }
                    displayCommissionTable($commission_items);
                 ?>
                        