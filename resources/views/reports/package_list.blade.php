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
        color:#000;
        font-size:0.8em;
        text-transform:uppercase;
        font-weight:600;
    }
    table.rpt-package-list > tbody td{
        font-size:0.8em;
    }
</style>
<?php
    function createPackageRow_html($row,$numero) {
        $status_class = 'fw-semibold';
        $str_notes = '';
        if($row->status_id ==8){
            $status_class ='fw-semibold text-success';
            $str_notes = '<span class="d-block"><smal>'.$row->delivery_notes.'</small></span>';
        }
        else if ($row->status_id ==9) {
            $status_class ='fw-semibold text-danger';
            $str_notes = '<span class="d-block"><smal>'.$row->failure_notes.'</small></span>';
        }
        else if ($row->status_id ==11) {
            $status_class ='fw-semibold text-muted';
            $str_notes = '<span class="d-block"><smal>'.$row->return_notes.'</small></span>';
        }
        $status ='<span class="'.$status_class.'">'.$row->status.'</span>';
        $str_status = (in_array($row->status_id,[8,9,11]))? $status.'<span class="d-block"><small>'.$row->delivery_time.'</small></span>':$status; 
        
        $cur ='$';
        $cod_amount = 0;
        $driver_total = 0;
        $fees = $row->delivery_fee + $row->base_fee;

        if(strtolower($row->df_payer=='receiver')) $driver_total = $fees;
        $driver_total -= $row->forwarding_cost;
        if($row->cod ==1){
            $cod_amount = $row->price;
            $driver_total += $cod_amount;
        }
        
        return '<tr>'.
        '<td>'.$numero.'</td>'.
        '<td>'.$row->barcode.'</td>'.
        '<td>'.$row->sender_name.'</td>'.
        '<td>'.$row->sender_phone.'</td>'.
        '<td>'.(empty($row->product_type)?'Generic':$row->product_type).'</td>'.
        '<td><div class="d-flex flex-column"><span class="d-block">'.$row->receiver_phone.'</span><span class="d-block">'.$row->zone_name.'</span></div></td>'.
        '<td>'.$cur.$cod_amount.'</td>'.
        '<td>'.$cur.$fees.'</td>'.
        '<td>'.$row->driver_name.'</td>'.
        '<td>'.$cur.$driver_total.'</td>'.
        '<td>'.$cur.$row->sender_total.'</td>'.
        '<td><div class="d-flex flex-column">'.$str_status.'</div></td>'.
        '<td>'.$str_notes.'</td>'.
        '</tr>';
    }

    $prev_cat = null;
    $numero = 0;
    foreach($items as $row){
        $this_cat = $row->arrival_date;
        $numero++;
        if($this_cat != $prev_cat){
            if ($prev_cat != null){ 
                echo'</tbody></table>';
            }

            echo '<div class="rpt-section-divider"><span class="fw-semibold">'.$this_cat.'</span></div>';
            echo '<table class="table rpt-package-list">
            <thead>
                <tr>
                    <th class="border-0  small font-weight-bold">No</th>
                    <th class="border-0  small font-weight-bold">Barcode</th>
                    <th class="border-0  small font-weight-bold">Merchant</th>
                    <th class="border-0  small font-weight-bold">Merchant Phone</th>
                    <th class="border-0  small font-weight-bold">Product Type</th>
                    <th class="border-0  small font-weight-bold">Receiver Phone</th>
                    <th class="border-0  small font-weight-bold">COD</th>
                    <th class="border-0  small font-weight-bold">Fees</th>
                    <th class="border-0  small font-weight-bold">Driver</th>
                    <th class="border-0  small font-weight-bold">Driver Total</th>
                    <th class="border-0  small font-weight-bold">Merchant Total</th>
                    <th class="border-0 small font-weight-bold">Status</th>
                    <th class="border-0 small font-weight-bold">Notes</th>
                </tr>
            </thead><tbody>';
            echo createPackageRow_html($row,$numero);
            $prev_cat = $this_cat;
        }
        else{
            echo createPackageRow_html($row,$numero);
        }
    }
?>