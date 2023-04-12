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
                <th>ID</th>
                <th>Name</th>
                <th>Sex</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
            </tr>
        </thead>
        <tbody>
            <?php
                $cnt = 1;
                foreach($staff_list as $slist){
                    echo "<tr>
                        <td>".$cnt++."</td>
                        <td>".$slist->id."</td>
                        <td>".$slist->name."</td>
                        <td>".$slist->sex."</td>
                        <td>".$slist->email."</td>
                        <td>".$slist->phone_number."</td>
                        <td>".$slist->date_of_birth."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>