<!DOCTYPE html>
<html>
 <head>
   <link href="{{ base_url('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css"/>
    <script src="{{ base_url('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script defer src="{{ base_url('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
    <!------ Include the above in your HEAD tag ---------->
    <style>
        body {
        background: grey;
        margin-top: 120px;
        margin-bottom: 120px;
    }
    div.flat-alert-box{
     box-shadow:border-box;
     border:1.2px solid #CDD4D5;
     padding:10px;
     margin:10px;
     color:#A1E3EE;
     font-weight:0.2em;
     font-size:1.2em;
     border-radius:2px;
    }            
    .rpt-title{
        display:inline-block;
        font-size:1.2em !important;
        font-weight:bold;
        margin-left:45%;
        transform:translate(-75%);
    }
    .rpt-sub-title1, .rpt-sub-title{
        display:inline-block;
        margin-top:-5px;
        margin-left:50%;
        transform:translate(-75%);
        font-size:0.9em;
    }
    .center {
       margin-left:50%;
       transform:translate(-50%);
    }
    </style>
 </head>
 <body>   
<div class="container">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body p-0">
                    <div class="row p-4">
                        <div class="col-md-2">
                           <img src="<?php echo isset($branch->logo_data)?$branch->logo_data:null; ?>" style="width:80px;height:80px;">
                        </div>
                        <div class="col-md-10">
                            <div style="content-align:center">
                                <span class="rpt-title font-weight-bold mb-1"><?php echo (isset($title)?$title:'(Report Title)'); ?></span>
                                <span class="rpt-sub-title text-muted mb-1"><?php echo (isset($subtitle)?$subtitle:null); ?></span>
                                <span class="rpt-sub-title1 text-muted mb-1"><?php echo (isset($subtitle1)?$subtitle1:null); ?></span>
                            </div>
                        </div>
                    </div>
                    <div class="row p-3">
                        <div class="col-md-12">
                          @switch ($rtype)
                            @case('pickuplist')
                                   @include('reports.pickup_list')
                                   @break
                            @case('packagelist')
                                @include('reports.package_list')
                                @break
                            @case('fleetlist')
                                   @include('reports.fleet_list')
                                   @break
                            
                            @case('driverlist')
                                   @include('reports.driver_list')
                                   @break
                            
                            @case('senderlist')
                                @include('reports.sender_list')
                               break
                            @case ('dr_package_list')
                               @include('reports.dr_package_list')
                               @break 
                            @case ('dr_summarized_deliveries')
                               @include('reports.dr_summarized_deliveries')
                               @break 
                            @case ('dr_driver_commissions')
                               @include('reports.dr_driver_commissions')
                               @break 
                            @case ('dr_driver_pmts')
                               @include('reports.dr_driver_pmts')
                               @break     
                            @case ('rpt_daily_summary')
                               @include('reports.rpt_daily_summary')
                               @break       
                            @case ('rpt_sales_commissions')
                              @include('reports.rpt_sales_commissions')
                              @break
                            @case ('vd_deliveries')
                              @include('reports.vd_deliveries')
                              @break   
                            @case ('vd_summarized_deliveries')
                              @include('reports.vd_summarized_deliveries')
                              @break
                            @case ('vd_transactions')
                              @include('reports.vd_transactions')
                              @break     
                            @case ('userlist')
                              @include('reports.user_list')
                              @break                              
                            @default
                               @break
 
                      @endswitch
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