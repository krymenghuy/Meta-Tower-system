<!DOCTYPE html>
<html>

<head>
    <?php StyleManager::render('report-styles'); ?>
    <?php ScriptManager::render('report-scripts'); ?>
    <style>
        body{
            font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }

        .rpt-body {
            font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }

        @media print{
            @page {
                margin: 0;
            }
            
            body{
                margin: 20px;
                -webkit-print-color-adjust: exact;
                -moz-print-color-adjust: exact;
                -ms-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            div.vs-print-top{
                background-color:#05A8B5;
            }
        }
    </style>
</head>

<body>
    <div class="border border-1 border-success rounded mt-2" style="margin-left:0.5cm;margin-right:0.5cm;">
        <div class="d-block">
            @if($rtype != "general_report")
                <div class="vs-print-top d-flex align-items-center border border-1 border-success rounded" style="background-color: #05A8B5">
                    <div style="width: 108px; height:108px;">
                        <img class="img-thumbnail rounded w-100 h-100" src="<?php echo isset($branch->logo_url) ? $branch->logo_url:null; ?>"/>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <div class="px-2">
                            <h2>
                                <?php echo (isset($company_name) ? $company_name:null); ?>
                            </h2>
                        </div>
                    </div>
                </div>
                <div class="d-block mt-4 px-2">
                    <div class="d-flex align-items-center">
                        <h3 style="color: #05A8B5">
                            <?php echo (isset($company_name) ? $company_name:null); ?>
                        </h3>
                    </div>
                    <div class="d-flex align-items-center">
                        <h2>
                            <?php echo (isset($title) ? $title: '(Report Title)'); ?>
                        </h2>
                    </div>
                    <div class="d-flex align-items-center">
                        <h4>
                            <?php echo (isset($subtitle) ? $subtitle: null); ?>
                        </h4>
                    </div>
                </div>
            @else
                <div class="d-block mt-4 px-2">
                    <div class="d-flex align-items-center">
                        <h2>
                            <?php echo (isset($title) ? $title: '(Report Title)'); ?>
                        </h2>
                    </div>
                    <div class="d-flex align-items-center">
                        <h4>
                            <?php echo (isset($subtitle) ? $subtitle: null); ?>
                        </h4>
                    </div>
                </div>
            @endif
        </div>
        <div class="rpt-body">
            @switch($rtype)
                @case('patient_profile')
                    @include('reports.patient_profile')
                    @break
                @case('client_list')
                    @include('reports.client_list')
                    @break
                @case('employee_list')
                    @include('reports.employee_list')
                    @break
                @case('product_list')
                    @include('reports.product_list')
                    @break
                @case('medical_report')
                    @include('reports.medical_report')
                    @break
                @case('medical_certificate')
                    @include('reports.medical_certificate')
                    @break
                @case('invoice_report')
                    @include('reports.invoice_report')
                    @break
                @case('general_report')
                    @include('reports.general_report')
                    @break
                @default
                    @break
            @endswitch
        </div>
    </div>
</body>
