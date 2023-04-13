<div class="d-block w-100 p-3">
    <div class="d-flex flex-column align-items-center">
        <h2>
            <?php echo isset($staff_name) ? $title." ".$staff_name : $title; ?>
        </h2>
        <p>
            <?php echo "ចាប់ពី ".$date->start_date." ដល់ ".$date->end_date; ?>
        </p>
    </div>
    <div>
        <table class="table table-hover table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Service</th>
                    <th>Done By</th>
                    <th>Price</th>
                    <th>Commission</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    foreach($service_list as $slist){
                        echo "<tr>
                            <td>".$slist->date."</td>
                            <td>".$slist->customer_name."</td>
                            <td>".$slist->service."</td>
                            <td>".$slist->done_by."</td>
                            <td>".$slist->price."</td>
                            <td>".$slist->commission."</td>
                        </tr>";
                    }
                ?>
            </tbody>
        </table>
    </div>
</div>