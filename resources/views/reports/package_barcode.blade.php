<!DOCTYPE html>
<html>
 <head>
    <link href="{{ base_url('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css"/>
    <script src="{{ base_url('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script defer src="{{ base_url('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
     <!------ Include the above in your HEAD tag ---------->
    <style>
        body {
            background: grey;
            margin-top: 10px;
            margin-bottom:0;
            width:75mm;
        }
        div.barcode-logo{
          margin:auto;
        }
        table.barcode-layout-table>tbody>tr>td{
          padding:2px; 
        }
        span.company-name{
            display:block;
            margin:auto;
            padding:5px;
            text-transform:uppercase;
            font-weight:bold;
            font-size:0.9em;
            color:#000;
            font-family: 'Khmer','Suwannaphum','DaunPenh','Code2000', 'Khmer OS Content','Francois One','Bayon';
        }
         span.barcode-text{
           font-size:0.7em;
           display:block;
         }
         span.card-title{
             margin-top:-25px;
             font-family: 'Khmer OS Content','DaunPenh','Francois One','Bayon';
             font-weight:bold;
             font-size:0.6em;
             color:#000;
         }
         td.item-label{
             font-family: 'Khmer OS Content','DaunPenh','Francois One','Bayon';
             color:#373635;
             font-size:0.7em;
             width:100px;
         } 
         td.item-text, p.delivery-notes-text, p.terms-text, p.company-address{
             font-family: 'Khmer OS Content','DaunPenh','Francois One','Bayon';
             font-size:0.7em;
             margin-top:-20px;
         }
         td.item-text{
           max-width:50px;
         }
         p.item-text
         { 
             font-family: 'Khmer OS Content','DaunPenh','Francois One','Bayon';
             font-size:0.7em;
         }
         p.delivery-notes-text, p.terms-text{
           display:block;
           font-size:0.7em;
          
         }
         p.delivery-notes-text {
          font-weight:bold;
         }
         span.center{
            display:inline-block;
            margin-left:50%;
            transform:translate(-50%);
         }
         .bs-divider{
          margin-top:3px;
          margin-bottom:3px;
          color:#BFC9CA;
          height:1.5px
         }
         span.company-phone, span.company-address{
            font-size:0.3em;
         }
    </style>
 </head>
 <body>   
<div class="container">  
    <div class="row">
        <div class="col-12">
            <div class="card" style="padding:6px;">
                      <div class="barcode-logo">
                       <img src="<?php echo isset($branch->logo_data)?$branch->logo_data:null; ?>" style="max-width:60px;max-height:60px;">
                     </div> 
              <span class="company-name" ><?php echo isset($branch->name_kh)?$branch->name_kh:null; ?></span>
              <div style="width:100%;margin-top:5px">
                    <div style="width:100%;display:flex;flex-direction:column;width:100%">
                       <span class="card-title" style="margin:auto">​លេខកូដកញ្ចប់</span> 
                       <span class="barcode-text" style="margin:auto"><?php echo $barcode; ?></span> 
                       <div class="p-barcode" style="margin:auto">{!! DNS1D::getBarcodeHTML($barcode, 'C128B',1,20) !!}</div>   
                    </div>
              </div>
              
              <div style="margin-top:3px;display:flex;flex-direction:row;width:100%">
                    <div style="width:100%;">
                     <div style="width:100%;display:flex;flex-direction:column">
                      <!-- <span class="card-title center">អក្នផ្ញើរ</span> -->
                      <table class="barcode-layout-table">
                          <tr>
                            <td class="item-label">អ្នកផ្ញើរ</td>
                            <td class="item-text"><?php echo $p->sender_name; ?></td>
                          </tr>
                          <tr>
                            <td class="item-label">ទូរសព្ទ័អ្នកផ្ញើរ</td>
                            <td class="item-text"><?php echo $p->sender_phone; ?></td>
                          </tr>
                          <tr>
                            <td class="item-label">ប្រភេទទំនិញ</td>
                            <td class="item-text"><?php echo (isset($p->product_type)?$p->product_type:'ទូទៅ'); ?></td>
                          </tr>
                       </table>
                      <hr class="bs-divider">   
                    </div>
                    </div>
              </div>

              <div style="display:flex;flex-direction:row;width:100%">
                    <div style="width:100%;display:flex;flex-direction:column">
                      <!-- <span class="card-title center">អក្នទទួល</span> -->
                      <table class="barcode-layout-table">
                          <tr>
                            <td class="item-label">អ្នកទទួល</td>
                            <td class="item-text"><?php if (empty($p->receiver_phone)) echo 'មិនដឹង'; else echo $p->receiver_phone; ?></td>
                          </tr>
                          <tr>
                            <td class="item-label">តំបន់</td>
                            <td class="item-text"><?php echo ('('.(isset($p->zone_code)?$p->zone_code:null).')'.$p->zone_name); ?></td>
                          </tr>
                          <tr>
                            <td class="item-label">អាសយដ្ឋាន</td>
                            <td class="item-text"><?php echo (isset($p->receiver_address)?$p->receiver_address:'...'); ?></td>
                          </tr>
                          <tr>
                            <td class="item-label">ប្រភេទសេវា</td>
                            <td class="item-text"><?php $delivery_type = strtolower($p->delivery_type); if ($delivery_type =='normal') $delivery_type ='ធម្មតា'; else $delivery_type ='រហស័';  echo ($delivery_type)?$delivery_type:'មិនកំណត់'; ?></td>
                          </tr>
                      </table>
                       <hr class="bs-divider">
                    </div>
              </div>
              <div style="display:flex;flex-direction:row;width:100%">
                    <div style="width:100%;display:flex;flex-direction:column">
                      <!-- <span class="card-title center">​តំលៃនិងសេវាផ្សេងៗ</span> -->
                      <table class="barcode-layout-table">
                          <tr>
                            <td class="item-label" style="width:100px">ថ្លៃទំនិញ(COD)</td>
                            <td class="item-text"><?php echo "$ ".$p->price;?></td>
                            <td class="item-text"><?php echo "KHR ".($p->price * $p->exchange_rate); ?></td>
                          </tr>
                          <tr>
                            <td class="item-label" style="width:100px">ថ្លៃសេវាផ្សេងៗ</td>
                            <td class="item-text"><?php echo "$ ".(isset($p->total_delivery_fee)?$p->total_delivery_fee:0); ?></td>
                            <td class="item-text"><?php echo "KHR ".(isset($p->total_delivery_fee)?$p->total_delivery_fee:0 * $p->exchange_rate); ?></td>
                          </tr>
                      </table>
                      <!-- <hr class="bs-divider"> -->
                    </div>
              </div>
              
              <div style="display:flex;flex-direction:row;width:100%">
                    <div style="width:100%;display:flex;flex-direction:column">
                     <?php
                        $delivery_notes = isset($p->delivery_notes)?$p->delivery_notes:null;
                        if(!empty($delivery_notes)) {
                          echo '​<p class="delivery-notes-text">&nbsp;'.$delivery_notes.'&nbsp;</p>';
                        }
                        $term_text = isset($branch->terms_text)?$branch->terms_text:null;
                        if(!empty($term_text)) {
                           echo '<hr class="bs-divider">​'.
                           //'<p class="terms-text" style="font-weight:bold;padding-bottom:5px;">ចំណាំ៖</p>'.
                           '<p class="terms-text">'.$term_text.'</p>';
                        }
                        $address_kh = isset($branch->address_kh)?$branch->address_kh:null;
                        if(!empty($address_kh)) {
                           echo '<hr class="bs-divider" style="margin-top:-9px">​'.
                           '<p class="company-address"><i>'.$address_kh.'.Tel: '.$branch->phone_number.'</i></p>';
                        }
                     ?>
                    </div>
              </div>

            </div> <!--end::card-->  
        </div> <!--end::col-12-->
     </div> <!--end:row-->
    </div> <!--end::card-->
 
</body>
</html>