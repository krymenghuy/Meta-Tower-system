<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            @media print{
                html,
                body{
                    margin:0;
                }
            }

            @page{
                margin:0;
            }

            @page:footer{
                display:none;
            }

            @page:header{
                display:none;
            }
        </style>
    </head>
    <body>
        <div class="w-100 p-3">
            <div class="d-flex justify-content-center w-100">
                <h4>Service Tracking Report</h4>
            </div>
            <div>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Service</th>
                            <th>Done By</th>
                            <th>Price</th>
                            <th>Commission</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            for($i = 0; $i < 30; $i++){
                                echo "<tr>
                                    <td>20-11-2021</td>
                                    <td>Stephen</td>
                                    <td>Test Blood</td>
                                    <td>Doctor A</td>
                                    <td>30 $</td>
                                    <td>5 $</td>
                                </tr>";
                            }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
</html>