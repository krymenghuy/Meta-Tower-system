<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            body {
                background: grey;
                margin-top: 120px;
                margin-bottom: 120px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body p-0">
                            <div class="row p-5">
                                <div class="col-md-6">
                                <img src="<?php echo isset($branch->logo_data)?$branch->logo_data:null; ?>" style="width:60px;height:60px;">
                                </div>
                                <div class="col-md-6 text-right">
                                    <p class="font-weight-bold mb-1" style="font-size:1.5em">
                                        <?php echo $branch->name; ?>
                                    </p>
                                    <p class="text-muted">
                                        <?php echo $branch->address ?>
                                    </p>
                                </div>
                            </div>
                            <hr class="my-2">
                            <div class="row p-3">
                                <div class="col-md-12">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th class="border-0 text-uppercase small font-weight-bold">Date</th>
                                                <th class="border-0 text-uppercase small font-weight-bold">Order ID</th>
                                                <th class="border-0 text-uppercase small font-weight-bold">Merchant</th>
                                                <th class="border-0 text-uppercase small font-weight-bold">Vehicle Type</th>
                                                <th class="border-0 text-uppercase small font-weight-bold">Qty</th>
                                                <th class="border-0 text-uppercase small font-weight-bold">Driver Name</th>
                                                <th class="border-0 text-uppercase small font-weight-bold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                                foreach($items as $c) {
                                                    echo '<tr>
                                                    <td>'.$c->request_date.'</td>
                                                    <td>',$c->order_code,'</td>
                                                    <td>',$c->sender_name,'</td>
                                                    <td>',$c->vehicle_type,'</td>
                                                    <td>'.$c->qty.'</td>
                                                    <td>'.$c->driver_name.'</td>
                                                    <td>'.$c->status.'</td>
                                                    </tr>';  
                                                }   
                                            ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>