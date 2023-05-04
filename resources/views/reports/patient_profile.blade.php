<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            body{
                font-family: 'Khmer OS Battambang', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
            }

            .width-paragraph{
                width:150px;
                font-weight:500;
            }

            .photo-profile{
                width:10vw;
                height:10vw;
                min-width:130px;
                min-height:130px
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
            }
        </style>
    </head>

    <div class="p-3 border border-success rounded-3 m-3">
        <div class="d-flex align-items-center gap-4">
            <div class="d-flex align-items-center">
                <img class="rounded-circle photo-profile" src="<?php echo $patient->basic_info->image_url; ?>" alt="profile"/>
            </div>
            <div class="d-flex align-items-center">
                <div class="d-block">
                    <div class="d-flex py-0 my-0">
                        <p class="text-muted pe-3">Patient ID</p>
                        <p class="text-muted">{{ $patient->basic_info->code }}</p>
                    </div>
                    <div class="d-flex py-0 my-0">
                        <p class="fw-bold fs-5">{{ $patient->basic_info->name }}</p>
                    </div>
                    <div class="d-flex align-items-center text-muted py-0 my-0">
                        <p class="pe-3"><?php echo $patient->basic_info->sex==='M'? "Male":"Female"; ?></p>
                        <div class="vr" style="height:20px; opacity:1"></div>
                        <p class="ps-3"><?php echo $patient->basic_info->date_of_birth. " ".($patient->basic_info->age>0? "(".$patient->basic_info->age.")" : ""); ?></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-block mt-5">
            <h5 class="pb-2 fw-bold">Personal Information</h5>
            <div class="d-flex align-items-center">
                <p class="width-paragraph">Type</p>
                <p>{{ $patient->basic_info->patient_type }}</p>
            </div>

            <div class="d-flex align-items-center">
                <p class="width-paragraph">Nationality</p>
                <p>{{ $patient->basic_info->nationality }}</p>
            </div>
            <div class="d-flex align-items-center">
                <p class="width-paragraph">Date of Birth</p>
                <p>{{ $patient->basic_info->date_of_birth }}</p>
            </div>
            <div class="d-flex align-items-center">
                <p class="width-paragraph">Mobile No</p>
                <p>{{ $patient->basic_info->phone_number }}</p>
            </div>
            <div class="d-flex align-items-center">
                <p class="width-paragraph">Email ID</p>
                <p><?php echo ($patient->basic_info->email?$patient->basic_info->email:'Not Available'); ?></p>
            </div>
            <!-- <div class="d-flex align-items-center">
                <p class="width-paragraph">Height</p>
                <p>{{ $patient->basic_info->height }}</p>
            </div>
            <div class="d-flex align-items-center">
                <p class="width-paragraph">Weight</p>
                <p>{{ $patient->basic_info->weight }}</p>
            </div> -->
            <div class="d-flex align-items-center">
                <p class="width-paragraph">Address</p>
                <p><?php echo ($patient->basic_info->address?$patient->basic_info->address:'Not Available'); ?></p>
            </div>
           
            <!-- <div class="d-block mt-3">
                <h5 class="pb-2 fw-bold">Medication Details</h5>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Doctor</p>
                    <p>Dr.Madhav Baug</p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Assistant</p>
                    <p>Dr.Smitha Thorat</p>
                </div>
            </div> -->

        </div>
    </div>
</html>