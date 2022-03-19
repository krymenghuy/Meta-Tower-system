<!DOCTYPE html>
<html>
 <head>
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css"/>
    <script src="{{ asset('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
     <!------ Include the above in your HEAD tag ---------->
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
                            <p class="font-weight-bold mb-1" style="font-size:1.5em"><?php echo $branch->name; ?></p>
                            <p class="text-muted"><?php echo $branch->address ?></p>
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

                    <div class="d-flex flex-row-reverse text-white p-4">
                        <!-- <div class="py-3 px-5 text-right">
                            <div class="mb-2">Grand Total</div>
                            <div class="h2 font-weight-light">$234,234</div>
                        </div>

                        <div class="py-3 px-5 text-right">
                            <div class="mb-2">Discount</div>
                            <div class="h2 font-weight-light">10%</div>
                        </div>

                        <div class="py-3 px-5 text-right">
                            <div class="mb-2">Sub - Total amount</div>
                            <div class="h2 font-weight-light">$32,432</div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
     
</div>
</body>