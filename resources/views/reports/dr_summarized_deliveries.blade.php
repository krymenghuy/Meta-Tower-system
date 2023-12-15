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
    }    
</style> 
<?php
    function createPackageRow_html($row) {
        $cod_amount = $row->cod_amount;
        $fees = $row->fees;
        $adjust_amount = $row->adjust_amount;
        $total = $cod_amount + $fees + $adjust_amount;
        $cur = $row->currency;
        return '<tr>'.
        '<td>'.$row->delivery_type.'</td>'.
        '<td>'.$row->package_count.' pcs</td>'.
        '<td>'.$cur.$row->cod_amount.'</td>'.
        '<td>'.$cur.$row->fees.'</td>'.
        '<td>'.$cur.$adjust_amount.'</td>'.
        '<td>'.$cur.$total.'</td>'.
        '<td>'.$row->remarks.'</td>'.
        '</tr>';
    }

    echo '<table class="table table-bordered">';
    echo '<thead>
            <tr>
                <th class="border-0  small font-weight-bold">DELIVERY TYPE</th>
                <th class="border-0  small font-weight-bold">PACKAGE COUNT</th>
                <th class="border-0  small font-weight-bold">COD</th>
                <th class="border-0  small font-weight-bold">FEES</th>
                <th class="border-0  small font-weight-bold">ADJUST</th>
                <th class="border-0  small font-weight-bold">TOTAL</th>
                <th class="border-0 small font-weight-bold">REMARKS</th> 
            </tr>
        </thead><tbody>';
    $cnt = 0 ;    
    foreach($items as $row){ 
        echo createPackageRow_html($row); 
        $cnt++;
    }
    echo '</tbody></table>';
    if($cnt===0) echo '<div class="flat-alert-box">No data found! You may choose different filter options</div>';
?>