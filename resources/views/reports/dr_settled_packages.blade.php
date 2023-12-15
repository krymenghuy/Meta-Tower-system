<div>
    <table class="table">
       <thead>
          <tr>
            <th>No.</th>
            <th>Barcode</th>
            <th>Driver Name</th>
            <th>Customer/Receiver</th>
            <th>Dates</th>
            <th>Delivery Type</th>
            <th>COD</th>
            <th>Price</th>
            <th>Fee payer</th>
            <th>Fees</th>
            <th>Taxi</th>
            <th>Amount</th>
            <th>Remarks</th>
          </tr>
       </thead>
        <tbody>
           <?php
            $cnt = 0; 
            $total = 0;
            foreach($data->items as $row){
               $cod = $row->cod==1? 'Yes':'No';
               $cur = isset($row->currency_code)?$row->currency_code:'$';
               $fees = $row->delivery_fee + $row->base_fee;
               $driver_total = 0;
               if($row->cod ==1) $driver_total = $row->price - $row->cod_fee; 
               if(strtolower($row->df_payer) =='receiver') $driver_total += $fees;
               $driver_total -= $row->forwarding_cost;
               $cnt++;
               $total +=$driver_total;
               $status_remarks = $row->driver_pmt_status_id ==1? 'Paid':'Pending';
               $cls_remark_class = $row->driver_pmt_status_id ==1? 'text-success':'text-warning'; 
               echo '<tr>
               <td>'.$cnt.'</td>
               <td>'.$row->barcode.'</td>
               <td><span class="d-block">'.$row->driver_name.'</span></td>
               <td><span class="d-block p-1">'.$row->receiver_phone.'</span><span class="d-block p-1">'.$row->receiver_address.'</span></td>
               <td><span class="d-block p-1 text-primary">Arrived: '.$row->arrival_date.'</span><span class="d-block p-1 text-success">Finished: '.$row->finish_date.'</span></td>
               <td>'.$row->delivery_type.'</td>
               <td>'.$cod.'</td>
               <td>'.$cur.number_format($row->price,2,'.','').'</td>
               <td>'.$row->df_payer.'</td>
               <td>'.$cur.number_format($fees,2,'.','').'</td>
               <td>'.$cur.number_format($row->forwarding_cost,2,'.','').'</td>
               <td>'.$cur.$driver_total.'</td>
               <td><span class="d-block text-success">'.$row->status.'</span><span class="d-block '.$cls_remark_class.'">'.$status_remarks.'</span</td>
              </tr>';
            } 
            
           ?>
        </tbody>
    </table>     
</div>