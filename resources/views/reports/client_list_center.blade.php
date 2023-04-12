<div class="d-block w-100 p-3">
    <div class="d-flex flex-column align-items-center">
        <h2>
            <?php echo $title; ?>
        </h2>
    </div>
    <table class="table table-hover table-striped">
        <thead>
            <tr>
                <th>No</th>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Phone Number</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            <?php
                $cnt = 1;
                foreach($client_list as $clist){
                    echo "<tr>
                        <td>".$cnt++."</td>
                        <td>".$clist->patient_id."</td>
                        <td>".$clist->name."</td>
                        <td>".$clist->gender."</td>
                        <td>".$clist->phone_number."</td>
                        <td>".$clist->email."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>