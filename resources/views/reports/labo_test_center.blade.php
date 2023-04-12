<div class="d-block p-3 w-100">
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
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Test Name</th>
                <th>Labo Name</th>
                <th>Doctor Name</th>
            </tr>
        </thead>
        <tbody>
            <?php
                foreach($labo_list as $labo){
                    echo "<tr>
                        <td>".$labo->date."</td>
                        <td>".$labo->patient_id."</td>
                        <td>".$labo->patient_name."</td>
                        <td>".$labo->test_name."</td>
                        <td>".$labo->labo_name."</td>
                        <td>".$labo->doctor_name."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>