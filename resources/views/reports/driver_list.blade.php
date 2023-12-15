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
        font-weight:normal;
    }

    table.rpt-package-list > tbody td{
        font-size:0.8em;
    } 
</style> 
<?php
    function createPackageRow_html($row) {
        return '<tr>'.
        '<td>'.$row->code.'</td>'.
        '<td>'.$row->name.'</td>'.
        '<td>'.$row->sex.'</td>'.
        '<td>'.$row->shift.'</td>'.
        '<td>'.$row->phone_number.'</td>'.
        '<td>'.$row->email.'</td>'.
        '<td>'.$row->vehicle_type.'</td>'.
        '<td>'.$row->vehicle_number.'</td>'.
        '<td>'.$row->delivery_commission_type.'</td>'.
        '<td>'.$row->status_code.'</td>'.
        '</tr>';
    }

    $prev_cat = null;
    foreach($items as $row){
        $warehouse_name = isset($row->warehouse_name) ? $row->warehouse_name:null;
        if (strtolower( $warehouse_name) =='na') $this_cat = $row->emp_type;
        else $this_cat = $warehouse_name.' \\'.$row->emp_type;
        if ($this_cat != $prev_cat) {
            if ($prev_cat != null) {
                echo'</tbody></table>';
            }

            echo '<div class="rpt-section-divider"><span>'.$this_cat.'</span></div>';
            echo '<table class="table rpt-package-list">
            <thead>
                <tr>
                    <th class="border-0 small font-weight-bold">ID</th>
                    <th class="border-0 small font-weight-bold">Name</th>
                    <th class="border-0 small font-weight-bold">Sex</th>
                    <th class="border-0 small font-weight-bold">Shift</th>
                    <th class="border-0 small font-weight-bold">Phone Number</th>
                    <th class="border-0 small font-weight-bold">Email</th>
                    <th class="border-0 small font-weight-bold">Vehicle Type</th>
                    <th class="border-0 small font-weight-bold">Vehicle Number</th>
                    <th class="border-0 small font-weight-bold">Commission Type</th>
                    <th class="border-0 small font-weight-bold">Status</th>
                </tr>
            </thead><tbody>';
            echo createPackageRow_html($row);
            $prev_cat = $this_cat;
        }
        else{
            echo createPackageRow_html($row);
        }
    }
?>