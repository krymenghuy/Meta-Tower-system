<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            body{
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .rpt-body {
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
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
        <div class="rpt-body">
            @switch($rtype)
                @case('patient_profile')
                    @include('reports.patient_profile')
                    @break
                @case('employee_profile')
                    @include('reports.employee_profile')
                    @break
                @default
                    @include('reports.no_report') 
                    @break
            @endswitch
        </div>
    </body>
</html>