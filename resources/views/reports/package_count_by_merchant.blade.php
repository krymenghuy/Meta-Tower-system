<div>
 <style>
   .total-row td{
     font-weight:600;
     padding:3px;
   }
 </style>

 <div class="w-100">
  <table class="table">
        <thead>
        <tr>
        <th>Merchant ID</th>
        <th>Merchant Name</th>
        <th>Phone Number</th>
        <th>Package QTY</th>
        <th>Delivered</th>
        <th>Returned</th>
        <th>Outstanding</th>
        </tr>
        </thead>
        <tbody>
           <?php
             foreach($items as $row){
              echo '<tr>'.
              '<td>'.$row->sender_code.'</td>'.
              '<td>'.$row->sender_name.'</td>'.
              '<td>'.$row->phone_number.'</td>'.
              '<td>'.$row->package_count.'</td>'.
              '<td>'.$row->delivered_count.'</td>'.
              '<td>'.$row->returned_count.'</td>'.
              '<td>'.($row->failed_count + $row->at_warehouse_count).'</td>'.          
              '</tr>';
             }
           ?>
        </tbody>
    </table>
 </div>
 
 