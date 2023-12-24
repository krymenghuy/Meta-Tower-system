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
               if($row->cod_changed ==1) $cod = '<span class="text-danger fw-semibold">'.$cod.'</span>';
               $cur = isset($row->currency_code)?$row->currency_code:'$';
               $fees = $row->delivery_fee + $row->base_fee;
               $driver_total = 0;
               if($row->cod ==1) $driver_total = $row->price - $row->cod_fee; 
               if(strtolower($row->df_payer) =='receiver') $driver_total += $fees;
               $driver_total -= $row->forwarding_cost;
               $status = '<span class="d-block text-black">'.$row->status.'</span>';
               $cls_pmt_status = 'text-black'; 
               switch(strtolower($row->driver_pmt_status)){
                  case 'pending':
                     $cls_pmt_status = 'text-warning'; 
                     break;
                  case 'unpaid':
                     $cls_pmt_status = 'text-danger'; 
                     break;
                  case 'paid':
                     $cls_pmt_status = 'text-success'; 
                     break;
                  default:
                  $cls_pmt_status = 'text-black'; 
                  break;
               }
               
               if($row->status_id == 8)  $status = '<span class="d-block"><span class="text-success">'.$row->status.'</span> <span class="'.$cls_pmt_status.'">('.$row->driver_pmt_status.')</span></span>';
               $cod_notes = $row->cod_changed ==1? '<span class="d-block p-1 text-danger">'.$row->cod_notes.'</span>':'';
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
               <td>'.$status.$cod_notes.'</td>
              </tr>';
            } 
            
           ?>
        </tbody>
    </table>     
</div>