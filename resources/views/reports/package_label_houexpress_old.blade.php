<!DOCTYPE html>
<html>
  <head>
    <?php StyleManager::render('report-styles'); ?>
    <?php ScriptManager::render('report-scripts'); ?>
    <style>
      body{
        background: #fff;
        margin-top: 10px;
        margin-bottom:0;
        width:75mm;
      }

      @media screen {
        body {
          margin: auto;
          color: #000;
          background-color: #fff;
        }
      }
 
      @media print {
        body{
          margin-top:5mm;
          box-shadow: 0;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        @page { 
          margin:0;
          width:77mm;
          height:100mm; 
        }

        @page :footer { 
          display: none
        }

        @page :header { 
          display: none
        }
      }

      div.barcode-logo{
        display:block;
        margin:auto;
        text-align:center;
      }
      table.barcode-layout-table{
        width:100%;
      }
      table.barcode-layout-table>tbody>tr.total td{
        font-weight:bold;
        padding:3px;
      }
      table.barcode-layout-table>tbody td{
        padding:3px;
      }

      span.company-name{
        display:block;
        text-align:center;
        padding:1.2px;
        text-transform:uppercase;
        font-weight:bold;
        font-size:0.8em;
        color:#000;
        font-family: 'Khmer','Suwannaphum','Code2000', 'Khmer OS Content','Francois One','Bayon';
      }

      span.barcode-text{
        padding-top:5px;
        font-size:0.8em;
        display:block;
      }
      
      .p-barcode{
        display:inline-block;
        margin:auto;
        font-family: 'IDAHC39M Code 39 Barcode', Times, serif;
        font-size:2em;
      }

      span.card-title{
        font-family: 'Khmer OS Content','Francois One','Bayon';
        font-weight:bold;
        font-size:1em;
        color:#000;
      }

      td.item-label{
        font-family: 'Khmer OS Content','Francois One','Bayon';
        color:#373635;
        font-size:0.6em;
        width:100px;
      }

      td.item-text,
      p.delivery-notes-text,
      p.terms-text,
      p.company-address{
        font-family: 'Khmer OS Content','Francois One','Bayon';
        font-size:0.6em;
      }

      td.item-text{
        max-width:50px;
      }

      td.item-text{ 
        font-family: 'Khmer OS Content','Francois One','Bayon';
      }

      p.delivery-notes-text,
      p.terms-text{
        margin-top:-20px;
        display:block;
        font-size:0.6em;
      }

      p.delivery-notes-text {
        font-weight:bold;
      }

      .bs-divider{
        margin-top:1.2px;
        margin-bottom:1.2px;
        color:#BFC9CA;
        height:1px;
      }

      .company-phone,
      .company-address{
        font-size:0.55em !important;
        text-align:center;
      }
    </style>
  </head>
  <body>
    <?php
      function createBarcodeHTML($barcodeText){
        $barcodeText = 'ABC123456789';
        $barcodeType = 'CODE39';
        $barcodeOptions = array('text' => $barcodeText);
        
        $barcode = new \Milon\Barcode\DNS1D($barcodeType);
        return $barcode->getBarcodeHTML($barcodeText, $barcodeType, $barcodeOptions);
      }
    ?>
    <div class="container" style="margin-top:5px;margin:auto">  
      <div style="display:flex;flex-direction:row">
          <div class="barcode-logo">
              <img src="<?php echo isset($branch->logo_url)?$branch->logo_url:null; ?>" style="height:60px">
          </div>
          <div style="width:100%">
            <span class="company-name" style="margin-left:-15px !important">
              <?php echo isset($branch->name_kh)?$branch->name_kh:null; ?>
            </span>
            <?php $address_kh = isset($branch->address_kh)?$branch->address_kh:null;
              if(!empty($address_kh)) {
                echo '<hr class="bs-divider">'.
                '<p class="company-address">'.$address_kh.'.Tel: '.$branch->phone_number.'</p>';
              }
            ?>
          </div>
      </div>
      <div style="width:100%;display:flex;flex-direction:column;width:100%;margin-top:-15px">
        <div style="height:8px"></div>
        <span class="barcode-text" style="margin:auto">
          <?php echo $barcode; ?>
        </span>
        <span class="p-barcode" style="margin:auto">{!! DNS1D::getBarcodeHTML($barcode, 'C128B',1,25) !!}</span>    
      </div>
      <div style="height:10px"></div>
      <table class="barcode-layout-table">
        <tr>
          <td class="item-label">អ្នកផ្ញើរ</td>
          <td class="item-text">
            <?php echo $p->sender_name; ?>
          </td>
        </tr>
        <tr>
          <td class="item-label">ទូរសព្ទ័អ្នកផ្ញើរ</td>
          <td class="item-text">
            <?php echo $p->sender_phone; ?>
          </td>
        </tr>
      </table>
      <hr class="bs-divider">
      <table class="barcode-layout-table">
        <tr>
          <td class="item-label">អ្នកទទួល</td>
          <td class="item-text">
            <?php if (empty($p->receiver_phone)) echo 'មិនដឹង'; else echo $p->receiver_phone; ?>
          </td>
        </tr>
        <tr>
          <td class="item-label">អ្នកដឹកចូល</td>
          <td class="item-text">
            <?php echo (isset($p->pickup_driver_name)?$p->pickup_driver_name:"គ្មាន"); ?>
          </td>
        </tr>
        <tr>
          <td class="item-label">តំបន់</td>
          <td class="item-text">
            <?php echo ('('.(isset($p->zone_code)?$p->zone_code:null).')'.$p->zone_name); ?>
          </td>
        </tr>
        <tr>
          <td class="item-label">អាសយដ្ឋាន</td>
          <td class="item-text">
            <?php echo (isset($p->receiver_address)?$p->receiver_address:'...'); ?>
          </td>
        </tr>
        <tr>
          <td class="item-label">ប្រភេទសេវា</td>
          <td class="item-text">
            <?php
              $delivery_type = strtolower(isset($p->delivery_type)?$p->delivery_type:null);
              if ($delivery_type =='normal') $delivery_type = 'ធម្មតា';
              else $delivery_type ='រហស័';
              echo ($delivery_type)?$delivery_type:'មិនកំណត់';
            ?>
          </td>
        </tr>
      </table>
      <hr class="bs-divider">
      <table class="barcode-layout-table">
        <tr>
          <td class="item-label" style="width:100px">ថ្លៃទំនិញ(COD)</td>
          <td class="item-text">
            <?php echo "$ ".$p->price;?>
          </td>
        </tr>
        <tr>
          <td class="item-label" style="width:100px">ថ្លៃសេវាផ្សេងៗ</td>
          <td class="item-text">
            <?php echo "$ ".(isset($p->total_delivery_fee)?$p->total_delivery_fee:0); ?>
          </td>
        </tr>
        <tr class="total">
          <td class="item-label" style="width:100px">សរុប</td>
          <td class="item-text">
            <?php $totalUSD = $p->price + $p->total_delivery_fee; echo "$".$totalUSD; ?>
          </td>
        </tr>
      </table>
      <?php
        $delivery_notes = isset($p->delivery_notes)?$p->delivery_notes:null;
        if(!empty($delivery_notes)) {
          echo '​<p class="delivery-notes-text">&nbsp;'.$delivery_notes.'&nbsp;</p>';
        }
        $term_text = isset($branch->terms_text)?$branch->terms_text:null;
        if(!empty($term_text)) {
          echo '<hr class="bs-divider">​'.'<p class="terms-text">'.$term_text.'</p>';
        }
      ?>
    </div>
    <script>
      window.addEventListener('DOMContentLoaded', function(event){
        window.print();
      });
    </script>
  </body>
</html>