<div>
    <table class="table">
       <thead>
          <tr>
            <th>No.</th>
            <th>Barcode</th>
            <th>Driver</th>
            <th>Receiver Phone</th>
            <th>Receiver Address</th>
            <th>Arrival Date</th>
            <th>Finish Date</th>
            <th>Delivery Type</th>
            <th>COD</th>
            <th>Price</th>
            <th>Fee payer</th>
            <th>Fees</th>
            <th>Taxi</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
       </thead>
        <tbody>
           <?php
            $cnt = 0; 
            foreach($data->items as $row){
               $cod = $row->cod==1? 'Yes':'No';
               $cur = isset($row->currency_code)?$row->currency_code:'$';
               $fees = $row->delivery_fee + $row->base_fee;
               $driver_total = 0;
               if($row->cod ==1) $driver_total = $row->price - $row->cod_fee; 
               if(strtolower($row->df_payer) =='receiver') $driver_total += $fees;
               $driver_total -= $row->forwarding_cost;
               $cnt++;
               echo '<tr>
               <td>'.$cnt.'</td>
               <td>'.$row->barcode.'</td>
               <td>'.$row->driver_name.'</td>
               <td>'.$row->receiver_phone.'</td>
               <td>'.$row->receiver_address.'</td>
               <td>'.$row->arrival_date.'</td>
               <td>'.$row->finish_date.'</td>
               <td>'.$row->delivery_type.'</td>
               <td>'.$cod.'</td>
               <td>'.$cur.$row->price.'</td>
               <td>'.$row->df_payer.'</td>
               <td>'.$cur.$fees.'</td>
               <td>'.$cur.$row->forwarding_cost.'</td>
               <td>'.$cur.$driver_total.'</td>
               <td>'.$row->status.'</td>
              </tr>';
            } 
            
           ?>
        </tbody>
    </table>     
</div>