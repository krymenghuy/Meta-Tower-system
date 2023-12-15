
<div class="w-100 p-2">
    <table class="table">
         <thead>
             <tr>
                <th>No</th>
                <th>Merchant Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>PCS Count</th>
               
                <th>Bank Account</th>
             </tr>
         </thead>
         <tbody>
             <?php
                $cnt =0;
                foreach($senders as $s){
                    $bank_info =$s->bank_info?$s->bank_info:'NA';
                    $s->unpaid_amount =0;
                    $cnt++;
                    echo '<tr><td>'.$cnt.'</td><td>'.$s->name.'</td><td>'.$s->phone_number.'</td><td>'.$s->email.'</td><td>'.$s->package_count.' pcs</td><td>'.$bank_info.'</td></tr>';
                }
               
             ?>
         </tbody>
    </table>
</div>