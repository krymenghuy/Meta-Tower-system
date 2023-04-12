<div class="d-block w-100 p-3">
    <div class="d-flex flex-column align-items-center">
        <h2>
            <?php echo $title; ?>
        </h2>
        <p>
            <?php echo "ចាប់ពី ".$date->start_date." ដល់ ".$date->end_date; ?>
        </p>
    </div>
    <table class="table table-hover table-striped">
        <thead>
            <tr>
                <th>Date</th>
                <th>Customer ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Tax</th>
                <th>Discount(%)</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <?php
                foreach($invoice_list as $inv){
                    echo "<tr>
                        <td>".$inv->date."</td>
                        <td>".$inv->customer_id."</td>
                        <td>".$inv->customer."</td>
                        <td>".$inv->phone."</td>
                        <td>".$inv->tax."</td>
                        <td>".$inv->discount."</td>
                        <td>".$inv->amount."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>