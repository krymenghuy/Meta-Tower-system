<hr class="my-2">
<table class="table">
    <thead>
        <tr>
            <th class="border-0 text-uppercase small font-weight-bold">No.</th>
            <th class="border-0 text-uppercase small font-weight-bold">Barcode</th>
            <th class="border-0 text-uppercase small font-weight-bold">Merchant</th>
            <th class="border-0 text-uppercase small font-weight-bold">Merchant Phone</th>
            <th class="border-0 text-uppercase small font-weight-bold">Product Type</th>
            <th class="border-0 text-uppercase small font-weight-bold">Receiver Phone</th>
            <th class="border-0 text-uppercase small font-weight-bold">Receiver Address</th>
            <th class="border-0 text-uppercase small font-weight-bold">COD</th>
            <th class="border-0 text-uppercase small font-weight-bold">Remarks</th>
        </tr>
    </thead>
    <tbody>
       <?php
        $total_cod = 0 ;
        $cur = '$';
        $i = 0;
        foreach($items as $row){
            echo '<tr>
            <td>'.($i+1).'</td>
            <td>'.$row->barcode.'</td>
            <td>'.$row->sender_name.'</td>
            <td>'.$row->sender_phone.'</td>
            <td>'.($row->product_type?$row->product_type:'General').'</td>
            <td>'.$row->receiver_phone.'</td>
            <td>'.$row->receiver_address.'</td>
            <td>'.$cur.$row->cod_amount.'</td>
            <td>'.$row->remarks.'</td>
            </tr>';
            $total_cod += $row->cod_amount;
            $i++;
        }
        echo '<tr class="total-row"><td colspan="7"><span class="fw-semibold text-right p-1">TOTAL: </span></td> <td colspan="1"><span class="p-1 fw-semibold text-left">'.$cur. number_format($total_cod,2,'.','').'</span></td></tr>';
       ?>
    </tbody>
</table>