<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <style>
            @media print{
                @page{
                    margin:0;
                }
            }

            body{
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .fs-style{
                font-family:"Khmer OS Moul", 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }
        </style>
    </head>
    <body>
        <div class="d-block w-100 p-3">
            <div class="d-flex flex-column align-items-center">
                <h2 class="fs-style">វេជ្ចបញ្ជា</h2>
                <p class="fs-5 fw-semibold">PRESCRIPTION (Home Medication)</p>
            </div>
            <div class="d-flex my-3">
                <div class="d-block w-50">
                    <p>
                        <span class="pe-2">ឈ្មោះអ្នកជំងឺ:</span>
                        <span>
                            <?php echo isset($patient_info->patient_name) ? $patient_info->patient_name : null; ?>
                        </span>
                    </p>
                    <p>
                        <span class="pe-2">Diagnostic:</span>
                        <span>
                            <?php echo isset($patient_info->diagnostic) ? $patient_info->diagnostic : null; ?>
                        </span>
                    </p>
                    <p>
                        <span class="pe-2">លេខកូដវេជ្ជបញ្ជា:</span>
                        <span>
                            <?php echo isset($patient_info->code) ? $patient_info->code : null; ?>
                        </span>
                    </p>
                </div>
                <div class="d-block w-50">
                    <p>
                        <span class="pe-2">ភេទ:</span>
                        <span>
                            <?php echo isset($patient_info->sex) ? $patient_info->sex : null; ?>
                        </span>
                    </p>
                    <p>
                        <span class="pe-2">អាយុ:</span>
                        <span>
                            <?php echo isset($patient_info->age) ? $patient_info->age : null; ?>
                        </span>
                    </p>
                    <p>
                        <span class="pe-2">ទម្ងន់:</span>
                        <span>
                            <?php echo isset($patient_info->weight) ? $patient_info->weight : null; ?>
                        </span>
                    </p>
                </div>
            </div>
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th>ល.រ</th>
                        <th>ឈ្មោះទំនិញ</th>
                        <th>បរិមាណ</th>
                        <th>ខ្នាត</th>
                        <th>DOSAGE</th>
                        <th>FREQUENCY</th>
                        <th>QURATION</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        $cnt = 1;
                        foreach($prescription_list as $pre_list){
                            echo "<tr>
                                <td>".$cnt++."</td>
                                <td>".$pre_list->product_name."</td>
                                <td>".$pre_list->qty."</td>
                                <td>".$pre_list->unit."</td>
                                <td>".$pre_list->dosage."</td>
                                <td>".$pre_list->frequency."</td>
                                <td>".$pre_list->duration."</td>
                            </tr>";
                        }
                    ?>
                </tbody>
            </table>
            <div class="d-flex justify-content-end w-100">
                <div class="d-block">
                    <p>
                        <span class="pe-2">ភ្នំពេញថ្ងៃទី</span>
                        <span><?php echo isset($patient_info->date) ? $patient_info->date : null; ?></span>
                    </p>
                    <p>
                        <?php echo isset($patient_info->doctor_name) ? $patient_info->doctor_name : null; ?>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>