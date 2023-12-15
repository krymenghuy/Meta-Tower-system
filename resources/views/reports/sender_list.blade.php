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
    if(!function_exists('createSenderRow')){
        function createSenderRow($row) {
            return '<tr>'.
            '<td>'.$row->code.'</td>'.
            '<td>'.$row->name.'</td>'.
            '<td>'.$row->phone_number.'</td>'.
            '<td>'.$row->email.'</td>'.
            '<td>'.$row->address.'</td>'.
            '<td>'.$row->business_type.'</td>'.
            '<td>'.$row->bank_name.'</td>'.
            '<td>'.$row->account_number.'</td>'.
            '<td>'.$row->account_name.'</td>'.
            '<td>'.$row->status_code.'</td>'.
            '</tr>';
        }
    }
                   
    $prev_cat = null;
    foreach($items as $row){
        $warehouse_name = isset($row->warehouse_name)?$row->warehouse_name:null;
        if (strtolower( $warehouse_name) =='na') $this_cat = $row->sender_type; else $this_cat = $warehouse_name.' \\'.$row->sender_type;
        if ($this_cat != $prev_cat){
            if ($prev_cat != null){ 
                echo'</tbody></table>';
            }
            echo '<div class="rpt-section-divider"><span>'.$this_cat.'</span></div>';
            echo '<table class="table rpt-package-list">
            <thead>
                <tr>
                    <th class="border-0  small font-weight-bold">ID</th>
                    <th class="border-0  small font-weight-bold">Name</th>
                    <th class="border-0  small font-weight-bold">Phone Number</th>
                    <th class="border-0  small font-weight-bold">Email</th>
                    <th class="border-0  small font-weight-bold">Address</th>
                    <th class="border-0  small font-weight-bold">Business Type</th>
                    <th class="border-0  small font-weight-bold">Bank</th>
                    <th class="border-0  small font-weight-bold">Account Number</th>
                    <th class="border-0  small font-weight-bold">Account Name</th>
                    <th class="border-0 small font-weight-bold">Status</th> 
                </tr>
            </thead><tbody>';
            echo createSenderRow($row);
            $prev_cat = $this_cat;
        }
        else{
            echo createSenderRow($row);
        }
    }
?>