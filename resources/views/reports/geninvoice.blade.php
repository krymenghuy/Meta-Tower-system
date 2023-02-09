<!DOCTYPE html>
<html>
<head>
    <link href="{{ base_url('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css" />
    <script src="{{ base_url('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script defer src="{{ base_url('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
    <style>
        body {
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }

        .rpt-body {
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }

        @media print{
            @page {
                margin: 0;
            }
            
            body{
                margin: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="border border-1 border-success rounded m-2">
        <div class="rpt-body">
            @switch($rtype)
                @case('invoice_report')
                    @include('reports.invoice_report')
                    @break;
                @default
                    @break
            @endswitch
        </div>
    </div>
</body>
