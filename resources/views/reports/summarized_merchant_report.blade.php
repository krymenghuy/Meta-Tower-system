<?php
    function createTable_summarized_merchant($data){
        $html = '<table class="table" style="width:98vw;">
        <thead>
            <tr style="background-color:#C4FCEF">
                <th></th>
                <th>Total</th>
                <th>Normal</th>
                <th>Fast</th>
            </tr>
        </thead>';

        $tr_html = '<tr>
            <td>Collected packageages</td>
            <td>10</td>
            <td>5</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Delivered packageages</td>
            <td>10</td>
            <td>5</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Failed packages</td>
            <td>10</td>
            <td>5</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Continue to delivery packages</td>
            <td>10</td>
            <td>5</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Returned Packages</td>
            <td>10</td>
            <td>5</td>
            <td>5</td>
        </tr>';

        $html .= '<tbody>'.$tr_html.'</tbody></table>';

        return $html;
    }

    function createTable_summarized_merchant_transaction($data){
        $html = '<table style="width:98vw">
        <thead>
            <tr style="background-color:#C4FCEF">
                <th>MERCHANT TRANSACTION</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            <tr>
                <th>No</th>
                <th>PAYMENT DATE</th>
                <th>TYPE</th>
                <th>DESCRIPTION</th>
                <th>METHOD</th>
                <th>AMOUNT</th>
                <th>ATTACHMENT</th>
                <th>BOOKED BY</th>
            </tr>
        </thead>';
        $tr_html = null;
        $rows = (array)$data;
        foreach($rows as $row){
            $count = 1;
            $tr_html = '<tr>'.
                '<td>'.$count.'</td>'.
                '<td>'.$row->payment_date.'</td>'.
                '<td>'.$row->type.'</td>'.
                '<td>'.$row->description.'</td>'.
                '<td>'.$row->method.'</td>'.
                '<td>'.$row->amount.'</td>'.
                '<td>'.$row->attachment.'</td>'.
                '<td>'.$row->booked_by.'</td>'
            .'</tr>';
        }

        $html .= '<tbody>'.$tr_html.'</tbody></table>';
        return $html;
    }

    function createTable_summarized_merchant_details_packages($data){
        $html = '<table style="width:98vw">
        <thead>
            <tr>
                <th></th>
            </tr>
        </thead>';
        return $html;
    }
?>

<div class="d-flex align-items-center" style="flex-direction:column">
    <div class="table-responsive">
        <?php
            echo createTable_summarized_merchant(isset($data)?$data:null);
        ?>
    </div>
    <div class="table-responsive">
        <?php
            echo createTable_summarized_merchant_transaction(isset($data)?$data:null);
        ?>
    </div>
</div>