<div>
   <table class="table table-responsive">
      <thead>
        <tr>
            <th>Date</th>
            <th>PCS</th>
            <th>Cash</th>
            <th>Bank</th>
            <th>Total</th>
            <th>Driver Count</th>
        </tr>
      </thead>
      <tbody>
        <?php
            $cnt = 0;
            $cur = "$";
            foreach($items as $item){
               $cnt++;
               echo "<tr>
                  <td>".$item->payment_date."</td>
                  <td>".$item->package_count." pcs</td>
                  <td>".$cur.$item->cash."</td>
                  <td>".$cur.$item->bank."</td>
                  <td>".$cur.$item->total."</td>
                  <td>".$item->driver_count."</td>
               </tr>";
            }
        ?>
      </tbody>
   </table>   
</div>