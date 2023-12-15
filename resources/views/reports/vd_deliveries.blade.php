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

    table.rpt-package-list > thead th {
        color:grey;
        font-size:0.8em;
        text-transform:uppercase;
        font-weight:normal;
    }

    table.rpt-package-list > tbody td{
        font-size:0.8em;
    }

    .dr-unpaid{
      color:red;
      font-weight:bold;   
    }

    .dr-paid{
      color:green;
      font-weight:bold;   
    }

    .dvs-delivered{
        color:green;
    }

    .dvs-failed{
        color:red;
    }

    .dvs-ctd{
        color:orange;
    }

    .dvs-returned{
        color:grey;
    }

    .dvs-on-delivery{
        color:blue;
    }

    .dvs-warehouse{
        color:#FFC300;
    }

    tr.total > td{
        padding:3px;
        font-weight:bold;
        text-align:center;
    }

    td.col-total{
      text-align:right !important;
      padding-right:15px;
    }
</style>
<?php           
    function createPackageRow_html($row,$numero){
        $total = 0 ;
        $fees =0;
        $base_fee = isset($row->base_fee)?$row->base_fee:0;
        $delivery_fee = isset($row->delivery_fee)?$row->delivery_fee:0;
        $cod_fee = isset($row->cod_fee)?$row->cod_fee:0;
        
        if (strtolower($row->df_payer) =='sender') $fees = $base_fee + $delivery_fee;
        $cod_amount = isset( $row->cod_amount)? $row->cod_amount:0;
        $adjust_amount = isset($row->sender_adjust_amount)?$row->sender_adjust_amount:0;
        $total = $cod_amount - $fees + $adjust_amount;

        $pmt_class="dr-unpaid";
        $mpt_status ='Unpaid';
        $d_class ='dvs-delivered';
        if ($row->status_id ==9) $d_class ='dvs-failed';
        else if ($row->status_id ==5) $d_class ='dvs-warehouse';
        else if ($row->status_id ==10) $d_class ='dvs-ctd';
        else if ($row->status_id ==11) $d_class ='dvs-returned';
        else if ($row->status_id ==6)  $d_class ='dvs-on-delivery';
        if ($row->sender_pmt_status_id ==1) {
            $mpt_status ='Paid';
            $pmt_class ="dr-paid";
        }
        return '<tr>'.
        '<td>'.$numero.'</td>'.
        '<td>'.$row->delivery_type.'</td>'.
        '<td>'.$row->barcode.'</td>'.
        '<td>'.$row->receiver_phone.'</td>'.
        '<td>'.$row->zone_name.'</td>'.
        '<td>'.$row->df_payer.'</td>'.
        '<td>'.(isset($row->cod_amount)?$row->cod_amount:0).'</td>'.
        '<td>'.$fees.'</td>'.
        '<td>'.$adjust_amount.'</td>'.
        '<td>'.$total.'</td>'.
        '<td class="'.$d_class.'">'.$row->status.'</td>'.
        '<td class="'.$pmt_class.'">'.$mpt_status.'</td>'.
        '</tr>';
    }

    $total_cod_fee =0;
    $total_fees =0;
    $total_cod =0;
    $total_adjust =0;
    $total_amount=0;

    $prev_cat = null;
    $numero =0;
    $row_index =0;
    foreach($items as $row){
        $this_cat = $row->delivery_date;
        $this_cat = $this_cat;
        $numero++;
        if (strtolower($this_cat) != strtolower($prev_cat)) {
            if ($prev_cat != null){
                $total_line ='<tr class="total"><td colspan="5" class="col-total">TOTAL</td><td>'.$total_cod.'</td><td>'.$total_fees.'</td><td>'.$total_adjust.'</td><td>'.$total_amount.'</td><td colspan="2"></td></tr>';
                echo $total_line;  
                echo '</tbody></table>';

                $total_cod_fee =0;
                $total_fees =0;
                $total_cod =0;
                $total_adjust =0;
                $total_amount=0;
            } 

            echo '<div class="rpt-section-divider"><span>'.$this_cat.'</span></div>';
            echo '<table class="table rpt-package-list">
            <thead>
                <tr>
                    <th class="border-0  small font-weight-bold">No</th>
                    <th class="border-0  small font-weight-bold">Type</th>
                    <th class="border-0  small font-weight-bold">Barcode</th>
                    <th class="border-0  small font-weight-bold">Receiver Phone</th>
                    <th class="border-0  small font-weight-bold">Destination</th>
                    <th class="border-0  small font-weight-bold">Fee Payer</th>
                    <th class="border-0  small font-weight-bold">COD</th>
                    <th class="border-0  small font-weight-bold">Fees</th>
                    <th class="border-0  small font-weight-bold">Adjust</th>
                    <th class="border-0 small font-weight-bold">Total</th>
                    <th class="border-0 small font-weight-bold">D-Status</th>
                    <th class="border-0 small font-weight-bold">P-Status</th>
                </tr>
            </thead><tbody>';
            echo createPackageRow_html($row,$numero);
            $prev_cat = strtolower($this_cat);
        }
        else{
            echo createPackageRow_html($row,$numero);
        }
        $row_index++;                       
    }
    if ($numero ==0) {
        echo '<table class="table rpt-package-list">
        <thead>
            <tr>
            <th class="border-0  small font-weight-bold">No</th>
            <th class="border-0  small font-weight-bold">Type</th>
            <th class="border-0  small font-weight-bold">Barcode</th>
            <th class="border-0  small font-weight-bold">Receiver Phone</th>
            <th class="border-0  small font-weight-bold">Destination</th>
            <th class="border-0  small font-weight-bold">Fee Payer</th>
            <th class="border-0  small font-weight-bold">COD</th>
            <th class="border-0  small font-weight-bold">Fees</th>
            <th class="border-0  small font-weight-bold">Adjust</th>
            <th class="border-0 small font-weight-bold">Total</th>
            <th class="border-0 small font-weight-bold">D-Status</th>
            <th class="border-0 small font-weight-bold">P-Status</th>
            </tr>
        </thead></table>';
        echo '<div class="flat-alert-box">No items found! You may choose different filter options</div>';
    }
    else{
        echo '</tbody></table>';
    } 
?>