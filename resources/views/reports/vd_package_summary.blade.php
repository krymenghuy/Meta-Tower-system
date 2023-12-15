<style>
    div.rpt-section-divider{
       display:block;
       width:50%;
       padding:10px;
       margin-top:7px;
       border-bottom:1.5px double green; 
    }

    div.rpt-section-divider span{
       display:block;
       padding:2px;
       font-size:1em;
       font-weight:bold;
       color:green;
    }

    table.rpt-package-list{
        margin-bottom:-7px;
    }

    table.rpt-package-list > thead th {
        color:grey;
        font-size:0.8em;
        text-transform:uppercase;
        font-weight:normal;
    }

    table.rpt-package-list > tbody td{
        font-size:0.8em;
    }
</style>
<?php
    function createPackageRow_html($row,$numero) {
        $package_count_by_status ='';
        $drivers ='';
        return '<tr>'.
        '<td>'.$numero.'</td>'.
        '<td>'.$row->sender_code.'</td>'.
        '<td>'.$row->sender_name.'</td>'.
        '<td>'.$row->package_count.'</td>'.
        '<td>'.$package_count_by_status.'</td>'.
        '<td>'.$drivers.'</td>'.
        '</tr>';
    }

    $prev_cat = null;
    $numero = 0;
    foreach($items as $row){
        $this_cat = $row->arrival_date.$row->sender_id;
        $numero++;
        if($this_cat != $prev_cat){
            if ($prev_cat != null){ 
                echo'</tbody></table>';
            }

            echo '<div class="rpt-section-divider"><span>'.$row->arrival_date.'</span></div>';
            echo '<table class="table rpt-package-list">
            <thead>
                <tr>
                    <th class="border-0  small font-weight-bold">No</th>
                    <th class="border-0  small font-weight-bold">Merchant ID</th>
                    <th class="border-0  small font-weight-bold">Merchant Name</th>
                    <th class="border-0  small font-weight-bold">Phone Number</th>
                    <th class="border-0  small font-weight-bold">Package Count</th>
                    <th class="border-0  small font-weight-bold">Package Status</th>
                    <th class="border-0  small font-weight-bold">Drivers</th>
                </tr>
            </thead><tbody>';
            echo createPackageRow_html($row,$numero);
            $prev_cat = $this_cat;
        }
        else{
            echo createPackageRow_html($row,$numero);
        }
    }
?>