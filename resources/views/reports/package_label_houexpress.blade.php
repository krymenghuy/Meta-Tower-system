<!DOCTYPE html>
<html>
    <head>
        <?php StyleManager::render('report-styles'); ?>
        <?php ScriptManager::render('report-scripts'); ?>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style type="text/css">
            .label-sm{
                width:500px;
                padding:15px;
                border:1px solid #0000003f;
                border-radius:10px;
            }

            *,
            html{
                margin:0;
                padding:0;
            }

            body{
                font-family: "Khmer OS Battambang",'Francois One','Bayon';
                padding:20px;
                font-size:16px;
            }

            .height-line{
                height:1.5px;
            }

            .width-label{
                width:120px;
            }

            .fs--6{
                font-size:x-small;
            }

            .width-total{
                width:50%;
                text-align:end;
            }
            
            .border--1{
                border:1px solid #0000003f;
                padding:10px 5px;
                vertical-align: middle;
                height:75px;
            }

            .border--1 > *{
                padding:0;
                margin:0;
            }

            .fs-terms{
                font-size:0.87rem;
            }

            .width-logo{
                width:50%;
                height:120px;
                display:flex;
            }

            .width-logo img{
                width:100px;
            }

            .width-barcode{
                width:100%;
                margin-top:10px;
                display:flex;
                align-items:center;
                justify-content:end;
            }

            @media print{
                body{
                    margin:0;
                    padding:0;
                    -webkit-print-color-adjust: exact !important;
                    -moz-print-color-adjust: exact !important;
                    -ms-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    zoom:87%;
                }

                .label-sm{
                    border:none;
                }

                *,
                html{
                    margin:0;
                    padding:0;
                }

                .height-line{
                    height:1.5px;
                    opacity:1;
                }

                .fs-terms{
                    padding:0;
                    margin:0;
                }

                .border--1{
                    border:1px solid #000;
                }

                .vr{
                    opacity:1;
                }

                @page :footer {
                    display: none;
                }
            
                @page :header {
                    display: none;
                }

                @page{
                    margin:2mm 0mm 0mm 0mm;
                    size: 3in 4in;
                }
            }
            
            @page{
                margin:2mm 0mm 0mm 0mm;
                size:3in 4in;
            }

            @page :footer {
                display: none;
            }
            
            @page :header {
                display: none;
            }
        </style>
    </head>
    <body>
        <?php if (!isset($p->barcode)){  
          echo "Barcode is not valid or does not exist in the system";
          return;  
        }?>
        <div class="label-sm">
            <div class="d-flex w-100 my-0">
                <div class="width-logo">
                    <img class="img-thumbnail" src="<?php echo isset($branch) ? $branch->logo_url : null ?>" alt="Company Logo"/>
                </div>
                <div class="width-barcode">
                    <div class="d-flex justify-content-center flex-column text-center p-0 m-0">
                        <div class="d-flex justify-content-center">{!! DNS2D::getBarcodeHTML($p->barcode, 'QRCODE',5,5) !!}</div>
                        <p class="pt-2 fs--6 p-0 m-0">ស្គែនទីនេះដើម្បីបញ្ចប់ការដឹកជញ្ជូន</p>
                    </div>
                </div>
            </div>
            <hr class="bg-dark height-line"/>
            <div class="d-flex">
                <div class="d-block w-50">
                    <div class="d-flex">
                        <p class="pe-3">អ្នកដឹកចូល:</p>
                        <p>
                            <?php echo isset($p->pickup_driver_name) ? $p->pickup_driver_name : "គ្មាន"; ?>
                        </p>
                    </div>
                    <div class="d-flex">
                        <p class="pe-3">អ្នកផ្ញើ:</p>
                        <p>
                            <?php echo $p->sender_name; ?>
                        </p>
                    </div>
                    <div class="d-flex">
                        <p class="pe-3">លេខទូរស័ព្ទ:</p>
                        <p>
                            <?php echo $p->sender_phone; ?>
                        </p>
                    </div>
                </div>
                <div class="d-block w-50">
                    <div class="d-flex justify-content-end w-100">
                        <p class="pe-3">កាលបរិច្ឆេទ:</p>
                        <p>
                            <?php echo $p->booking_date; ?>
                        </p>
                    </div>
                </div>
            </div>
            <hr class="bg-dark height-line"/>
            <div class="d-flex">
                <div class="d-block w-50">
                    <div class="d-flex justify-content-end">
                        <p>លេខទូរស័ព្ទ:</p>
                        <p class="width-label text-end">
                            <?php
                                if(empty($p->receiver_phone))
                                    echo 'មិនដឹង';
                                else
                                    echo $p->receiver_phone;
                            ?>
                        </p>
                    </div>
                    <div class="d-flex justify-content-end">
                        <p>ទីតាំង:</p>
                        <p class="width-label text-end">
                            <?php
                                echo isset($p->zone_name) ? $p->zone_name : '...';
                            ?>
                        </p>
                    </div>
                </div>
                <div class="vr mx-2"></div>
                <div class="d-block w-50">
                    <div class="d-flex justify-content-end">
                        <p>តម្លៃឥវ៉ាន់:</p>
                        <p class="width-label text-end">
                            <?php echo "$ ".$p->price; ?>
                        </p>
                    </div>
                    <div class="d-flex justify-content-end">
                        <p>សេវាកម្ម:</p>
                        <p class="width-label text-end">
                            <?php
                                $delivery_type = strtolower(isset($p->delivery_type) ? $p->delivery_type : null);
                                if ($delivery_type =='normal')
                                    $delivery_type = 'ធម្មតា';
                                else
                                    $delivery_type ='រហស័';
                                echo ($delivery_type) ? $delivery_type : 'មិនកំណត់';
                            ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-start">
                <p style="display:ninline-block;margin-left:5px">សំគាល់:</p>
                <p style="display:inline-block;margin-left:5px;">
                    <?php
                        echo $p->receiver_address;
                    ?>
                </p>
            </div>
            <div class="d-flex align-items-center justify-content-end border--1">
                <p>តម្លៃសរុប:</p>
                <p class="width-total">
                    <?php
                        $totalUSD = $p->price + $p->total_delivery_fee;
                        echo "$ ".$totalUSD;
                    ?>
                </p>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <p class="pt-2 fs-terms">
                    <?php echo isset($branch) ? $branch->terms_text : null; ?>
                </p>
            </div>
        </div>
        <script type="text/javascript">
            window.addEventListener('DOMContentLoaded',function(){
                this.print();
            });
        </script>
    </body>
</html>