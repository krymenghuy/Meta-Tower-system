<div>
 <style>
   .total-row td{
     font-weight:600;
     padding:3px;
   }
 </style>
 <?php
 
   function createItemRows($rows){
      $cnt =0;
      $html = '';
      $total =0;
      $total_delivered =0;
      $total_returned =0;
      $total_other =0;

      foreach($rows as $row){
         $other_count = $row->at_warehouse_count + $row->on_delivery_count + $row->failed_count;
         $total_other += $other_count;
         $total += $row->package_count;
         $total_delivered += $row->delivered_count;
         $total_returned += $row->returned_count;
         $cnt++;
         $html .='<tr><td>'.$cnt.'</td><td>'.$row->sender_code.'</td><td>'.$row->sender_name.'</td><td>'.$row->phone_number.'</td><td>'.$row->package_count.' pcs</td><td>'.$row->delivered_count.' pcs</td><td>'.$row->returned_count.' pcs</td><td>'.$other_count.'</td></tr>'; 
      }
      $html .='<tr class="total-row"><td colspan="4" class="text-right"></td><td>'.$total.' pcs</td><td>'.$total_delivered.' pcs</td><td>'.$total_returned.' pcs</td><td>'.$total_other.' pcs</td></tr>';
      return $html;  
   }
   $cnt = 0;
   foreach($items as $date =>$date_group_items){
      echo '<h5>'.$date.'</h5>';
        echo '<table class="table">
        <thead>
        <tr>
        <th>No</th>
        <th>Merchant ID</th>
        <th>Merchant Name</th>
        <th>Phone Number</th>
        <th>Package QTY</th>
        <th>Delivered</th>
        <th>Returned</th>
        <th>Outstanding</th>
        </tr>
        </thead>
        <tbody>'.
        createItemRows($date_group_items)
        .'</tbody>
        </table>';
        $cnt++;       
   }
  if($cnt ===0) {
    echo '<table class="table">
    <thead>
    <tr>
    <th>No</th>
    <th>Merchant ID</th>
    <th>Merchant Name</th>
    <th>Phone Number</th>
    <th>Package QTY</th>
    <th>Delivered</th>
    <th>Returned</th>
    <th>Outstanding</th>
    </tr>
    </thead>
    <tbody>'.
    '<tr><td colspan ="100%"><div class="d-flex align-items:center"> <h5>There are no matched data to display!</h5></div></td></tr>' 
    .'</tbody>
    </table>';
  }
 ?>
</div>