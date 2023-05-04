<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <style>
            body{
                font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
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
    <body>
        <div class="p-3 border border-success rounded-3 m-3">
            <div class="d-flex align-items-center gap-4">
                <div class="d-flex align-items-center">
                    <img class="rounded-circle photo-profile" src="https://imgs.search.brave.com/BlA4BUOCyjFCvte6DEr2hPO5KdlIhysfHHd4K8JuYtc/rs:fit:1200:1080:1/g:ce/aHR0cHM6Ly9waG90/b2NhdGNodGhlbW9t/ZW50LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNi8wMS9i/dXNpbmVzc19oZWFk/c2hvdF9saW5rZWRJ/bl9wcm9maWxlLXBp/Y3R1cmVfRHVibGlu/X1JhZmFlbC1QaG90/b2dyYXBoeS5qcGc" alt="profile"/>
                </div>
                <div class="d-flex align-items-center">
                    <div class="d-block">
                        <div class="d-flex py-0 my-0">
                            <p class="text-muted pe-3">Employee ID</p>
                            <p class="text-muted"><?php echo $employee->code; ?></p>
                        </div>
                        <div class="d-flex py-0 my-0">
                            <p class="fw-bold fs-5"><?php echo $employee->name; ?></p>
                        </div>
                        <div class="d-flex align-items-center text-muted py-0 my-0">
                            <p class="pe-3"><?php echo $employee->sex; ?></p>
                            <div class="vr" style="height:20px; opacity:1"></div>
                            <p class="ps-3"><?php echo $employee->date_of_birth; ?></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-block mt-5">
                <h5 class="pb-2 fw-bold">Personal Information</h5>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Date of Birth</p>
                    <p><?php echo $employee->date_of_birth; ?></p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Mobile No</p>
                    <p><?php echo $employee->phone_number;?></p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Email ID</p>
                    <p><?php echo $employee->email; ?></p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Position</p>
                    <p><?php echo $employee->position_title; ?></p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Department</p>
                    <p><?php echo $employee->department; ?></p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Address</p>
                    <p><?php echo ($employee->address?$employee->address:'Not Available'); ?></p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Nationality</p>
                    <p><?php echo $employee->nationality; ?></p>
                </div>
            </div>
            <!-- <div class="d-block mt-3">
                <h5 class="pb-2 fw-bold">Experiences</h5>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Experience Title</p>
                    <p>AAA</p>
                </div>
                <div class="d-flex align-items-center">
                    <p class="width-paragraph">Assistant</p>
                    <p>AAA</p>
                </div>
            </div> -->
        </div>
    </body>
</html>