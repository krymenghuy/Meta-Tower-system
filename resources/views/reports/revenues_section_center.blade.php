<div class="d-block w-100 p-3">
    <div class="d-flex flex-column align-items-center">
        <h2>
            <?php echo isset($department_name) ? $title." ".$department_name : $title; ?>
        </h2>
        <p>
            <?php echo "ចាប់ពី ".$date->start_date." ដល់ ".$date->end_date; ?>
        </p>
    </div>
    <table class="table table-hover table-striped">
        <thead>
            <tr>
                <th>Date</th>
                <th>Doctor Name</th>
                <th>Service Name</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <?php
                foreach($revenue_by_category as $rev_category){
                    echo "<tr>
                        <td>".$rev_category->date."</td>
                        <td>".$rev_category->doctor_name."</td>
                        <td>".$rev_category->service_name."</td>
                        <td>".$rev_category->amount."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>