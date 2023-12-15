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
</style>
<?php
    function createPackageRow_html($row,$numero) {
        $total = 0 ;
        $fees =0;
        $base_fee = isset($row->base_fee)?$row->base_fee:0;
        $delivery_fee = isset($row->delivery_fee)?$row->delivery_fee:0;
        $cod_fee = isset($row->cod_fee)?$row->cod_fee:0;
        $forwarding_cost = isset($row->forwarding_cost)?$row->forwarding_cost:0;
        
        if (strtolower($row->df_payer) ==='receiver') $fees = $base_fee + $delivery_fee;
        $cod_amount = isset($row->cod_amount)? $row->cod_amount:0;
        $adjust_amount = isset($row->driver_adjust_amount)?$row->driver_adjust_amount:0;
        $adjust_amount -= $forwarding_cost;
        $total = $cod_amount + $fees + $adjust_amount;
        $pmt_class="dr-unpaid";
        $mpt_status ='Unpaid';
        if ($row->driver_pmt_status_id ==1) {
            $mpt_status ='Paid';
            $pmt_class ="dr-paid";
        }
        
        return '<tr>'.
        '<td>'.$numero.'</td>'.
        '<td>'.$row->delivery_type.'</td>'.
        '<td>'.$row->barcode.'</td>'.
        '<td>'.$row->sender_name.'</td>'.
        '<td>'.$row->sender_phone.'</td>'.
        '<td>'.$row->receiver_phone.'</td>'.
        '<td>'.$row->zone_name.'</td>'.
        '<td>'.(isset($row->cod_amount)?$row->cod_amount:0).'</td>'.
        '<td>'.$fees.'</td>'.
        '<td>'.$adjust_amount.'</td>'.
        '<td>'.$total.'</td>'.
        '<td class="'.$pmt_class.'">'.$mpt_status.'</td>'.
        '</tr>';
    }

    $prev_cat = null;
    $numero =0;
    foreach($items as $row){
        $this_cat = $row->delivery_date;
        $numero++;
        if (strtolower($this_cat) != $prev_cat) {
            if ($prev_cat != null) { 
                echo'</tbody></table>';
            }

            echo '<div class="rpt-section-divider"><span> Arrival: '.$this_cat.'</span></div>';
            echo '<table class="table rpt-package-list">
            <thead>
                <tr>
                    <th class="border-0  small font-weight-bold">No</th>
                    <th class="border-0  small font-weight-bold">Type</th>
                    <th class="border-0  small font-weight-bold">Barcode</th>
                    <th class="border-0  small font-weight-bold">Merchant</th>
                    <th class="border-0  small font-weight-bold">Merchant Phone</th>
                    <th class="border-0  small font-weight-bold">Receiver Phone</th>
                    <th class="border-0  small font-weight-bold">Destination</th>
                    <th class="border-0  small font-weight-bold">COD</th>
                    <th class="border-0  small font-weight-bold">Fees</th>
                    <th class="border-0  small font-weight-bold">Adjust</th>
                    <th class="border-0 small font-weight-bold">Total</th>
                    <th class="border-0 small font-weight-bold">Status</th>
                </tr>
            </thead><tbody>';
            echo createPackageRow_html($row,$numero);
            $prev_cat = strtolower($this_cat);
        }
        else{
            echo createPackageRow_html($row,$numero);
        }
    }

    if ($numero ==0) {
        echo '<table class="table rpt-package-list">
        <thead>
            <tr>
                <th class="border-0  small font-weight-bold">No</th>
                <th class="border-0  small font-weight-bold">Type</th>
                <th class="border-0  small font-weight-bold">Barcode</th>
                <th class="border-0  small font-weight-bold">Merchant</th>
                <th class="border-0  small font-weight-bold">Merchant Phone</th>
                <th class="border-0  small font-weight-bold">Receiver Phone</th>
                <th class="border-0  small font-weight-bold">Destination</th>
                <th class="border-0  small font-weight-bold">COD</th>
                <th class="border-0  small font-weight-bold">Fees</th>
                <th class="border-0  small font-weight-bold">Adjust</th>
                <th class="border-0 small font-weight-bold">Total</th>
                <th class="border-0 small font-weight-bold">Status</th>
            </tr>
        </thead></table>';
        echo '<div class="flat-alert-box">No items found! You may choose different filter options</div>';
    }
?>