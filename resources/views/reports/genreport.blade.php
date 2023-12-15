<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            @media screen{
                body {
                    margin: 0;
                    color: #000;
                    background-color: #fff;
                }
            }

            @media print{
                body {
                    margin: 0;
                    box-shadow: 0;
                }
            }

            @page{
                width:100%;
                margin:0;
            }

            @page:footer{
                display: none;
            }

            @page:header{
                display: none;
            }

            div.flat-alert-box {
                box-shadow: border-box;
                border: 1.2px solid #CDD4D5;
                padding: 10px;
                margin: 10px;
                color: #A1E3EE;
                font-weight: 0.2em;
                font-size: 1.2em;
                border-radius: 2px;
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-title {
                display: inline-block;
                text-align: center;
                font-size: 1.2em !important;
                font-weight: bold;
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-sub-title1,
            .rpt-sub-title {
                display: inline-block;
                text-align: center;
                font-size: 0.9em;
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .center {
                margin-left: 50%;
                transform: translate(-50%);
            }
        </style>
    </head>
    <body>
        <div style="margin-left:0.5cm;margin-right:0.5cm;">
            <div style="display:flex;flex-direction:row;align-items:flex-start; width:100%;margin-top:10px">
                <div style="width:35px;height:35px;">
                    <img src="<?php echo isset($branch->logo_url)?$branch->logo_url:null; ?>" style="width:80px;height:80px;">
                </div>
                <div style="margin-left:100px;width:100%;display:flex;flex-direction:column">
                    <div style="padding:auto">
                        <span class="rpt-title font-weight-bold" style="width:100%">
                            <?php echo (isset($title)?$title:'(Report Title)'); ?>
                        </span>
                        <span class="rpt-sub-title" style="width:100%;padding:auto;">
                            <?php echo (isset($subtitle)?$subtitle:null); ?>
                        </span>
                        <span class="rpt-sub-title1" style="width:100%;padding:auto;">
                            <?php echo (isset($subtitle1)?$subtitle1:null); ?>
                        </span>
                    </div>
                </div>
            </div>
            <div style="height:25px"></div>
            <div style="width:100%">
                @switch($rtype)
                    @case('pickup_list')
                        @include('reports.pickup_list')
                        @break
                    @case('package_list')
                        @include('reports.package_list')
                        @break
                    @case('daily_packages')
                        @include('reports.daily_packages')
                        @break
                    @case('dr_unpaid_packages')
                        @include('reports.dr_unpaid_packages')
                        @break
                    @case('unpaid_packages')
                        @include('reports.unpaid_packages')
                        @break
                    @case('dr_settled_packages')
                        @include('reports.dr_settled_packages')
                        @break              
                    @case('active_merchants')
                        @include('reports.active_merchants')
                        @break
                    @case('active_drivers')
                        @include('reports.active_drivers')            
                    @case('fleet_list')
                        @include('reports.fleet_list')
                        @break
                    @case('driver_list')
                        @include('reports.driver_list')
                        @break
                    @case('active_senders')
                        @include('reports.active_senders')
                        @break    
                    @case('sender_list')
                        @include('reports.sender_list')
                        @break
                    @case('dr_package_list')
                        @include('reports.dr_package_list')
                        @break
                    @case('dr_summarized_deliveries')
                        @include('reports.dr_summarized_deliveries')
                        @break
                    @case('dr_driver_commissions')
                        @include('reports.dr_driver_commissions')
                        @break
                    @case('driver_collections')
                        @include('reports.dr_transactions')
                        @break    
                    @case('rpt_daily_summary')
                        @include('reports.rpt_daily_summary')
                        @break
                    @case('rpt_sales_commissions')
                        @include('reports.rpt_sales_commissions')
                        @break
                    @case('vd_summary')
                        @include('reports.vd_summary')
                        @break
                    @case('vd_deliveries')
                        @include('reports.vd_deliveries')
                        @break
                    @case('vd_summarized_deliveries')
                        @include('reports.vd_summarized_deliveries')
                        @break
                    @case('vd_transactions')
                        @include('reports.vd_transactions')
                        @break
                    @case('user_list')
                        @include('reports.user_list')
                        @break
                    @case('summarized_merchant_report')
                        @include('reports.summarized_merchant_report')
                        @break
                    @default
                        @break
                @endswitch
            </div>
        </div>
    </body>
</html>