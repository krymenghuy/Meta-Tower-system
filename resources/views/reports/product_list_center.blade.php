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
                <th>No</th>
                <th>Code</th>
                <th>Name</th>
                <th>General Name</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody>
            <?php
                $cnt = 1;
                foreach($product_list as $plist){
                    echo "<tr>
                        <td>".$cnt++."</td>
                        <td>".$plist->code."</td>
                        <td>".$plist->name."</td>
                        <td>".$plist->general_name."</td>
                        <td>".$plist->category."</td>
                    </tr>";
                }
            ?>
        </tbody>
    </table>
</div>