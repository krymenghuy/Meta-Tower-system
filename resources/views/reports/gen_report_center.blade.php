<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="X-UA-Compatible" content="IE=edge"/>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
    </head>
    <body>
        @switch($rtype)
            @case('revenues')
                @include('reports.revenues_center')
                @break
            @case('rev_by_category')
                @include('reports.revenues_section_center')
                @break
            @case('rev_by_client')
                @include('reports.revenues_client_center')
                @break;
            @case('invoice_list')
                @include('reports.invoice_center')
                @break
            @case('profit_and_losss')
                @break
            @case('product_list')
                @include('reports.product_list_center')
                @break
            @case('staff_list')
                @include('reports.staff_list_center')
                @break
            @case('client_list')
                @include('reports.client_list_center')
                @break
            @case('on_hand_stocks')
                @break
            @case('labo_tests')
                @include('reports.labo_test_center')
                @break
            @case('services')
                @break
            @default:
                @break
        @endswitch
    </body>
</html>