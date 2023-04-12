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
                <th>ID</th>
                <th>Department Name</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <?php
                foreach($revenue_list as $revenue){
                    echo "<tr>
                        <td>".$revenue->id."</td>
                        <td>".$revenue->department_name."</td>
                        <td>".$revenue->amount."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>