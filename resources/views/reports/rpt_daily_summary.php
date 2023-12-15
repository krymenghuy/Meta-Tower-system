<style>
  body a{
    text-decoration: none;
  }

  span.section-title{
    display:block;
    padding:5px;
    border-bottom:1.2px solid orange;
    font-weight:bold;
    font-family: 'Khmer OS Content','Francois One','Bayon';
  }

  table.tbl-counts > thead td,
  table.tbl-cash > thead td{
    font-family: 'Khmer OS Content','Francois One','Bayon';
    font-size:0.8em;
    padding:5px;
  }

  table.tbl-counts > tbody td,
  table.tbl-cash > tbody td{
    padding:5px;
  }

  td.item-name{
    font-family: 'Khmer OS Content','Francois One','Bayon';
    text-align:right !important;
    padding-right:15px !important;
  }
  tr.is_leftover td{
    color:#FF8D33;
  }
  tr.is_past td{
    color:#3287CA;
  }
</style>

<?php
  use Illuminate\Support\Facades\Crypt; // Import the Crypt class
  //$encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
  $p1 = $params;
  $p1->rtype = 'active_senders';
  $str_params = null;
  foreach ($p1 as $key => $val) {
      $str_params .= ($str_params ? '&' : '') . $key . '=' . $val;
  }
  $str_params = Crypt::encrypt($str_params,false); // Use Crypt::encrypt() method
?>

<?php
 
  function createTable1($d,$str_params){
    $cur = '$';
    
    $html = '<table class="table tbl-counts"><thead><tr>'.
    '<td></td>'.
    '<td style="align:center">COUNT</td>'.
    //'<td style="align:center">TOTAL</td>'.
    //'<td style="align:center">FAST</td>'.
    '</tr></thead>';

    $tr_html = '<tr>'.
      '<td class="item-name">ចំនួនអតិថិជន</td>'.
      '<td><span class="fw-semibold"><a href="/dms-gen-report/'.$str_params.'">'.$d->sender_count.'</a</span></td>'.
      '<td></td><td></td>'. 
      '</tr>';
    
    $rows = (array) $d->package_counts;
    foreach($rows as $row) {
      if(isset($row->cur)) $cur = $row->cur;
      if(!$cur) $cur ='$';
      $total = $row->normal + $row->fast;
      $tr_class =  $row->is_past==1? 'is_past': ($row->is_past==2? 'is_leftover':'');
      $tr_html .= '<tr class="'.$tr_class.'">'.
      '<td class="item-name">'.$row->item_name.'</td>'.
      '<td><span class="fw-semibold">'.$total.'</span></td>'.
      //'<td>'.$row->normal.'</td>'. 
      //'<td>'.$row->fast.'</td>'.  
      '</tr>';
    }
    
    $html .='<tbody>'.$tr_html.'</tbody></table>';
    return $html;
  }

  function createTable2($d){
    $cur = '$';
    $html = '<table class="table tbl-cash"><thead><tr>'.
    '<td></td>'.
    '<td>AMOUNT (USD)</td>'.
    '<td>AMOUNT (KHR)</td>'.
    '</tr></thead>';

    $xrate = $d->exchange_rate;
    $tr_html = null;
    $rows = (array)$d->payments;
    foreach($rows as $row){
      if(isset($row->cur)) $cur = $row->cur;
      if(!$cur) $cur ='$';
      $amount_kh = $xrate * $row->amount;
      $tr_html .= '<tr>'.
      '<td class="item-name">'.$row->item_name.'</td>'.
      '<td>'.$cur.$row->amount.'</td>'. 
      '<td>'.'KHR '.$amount_kh.'</td>'.  
      '</tr>';
    }

    $html .='<tbody>'.$tr_html.'</tbody></table>';
    return $html;
  }
?>
<div class="d-flex flex-row">
  <div style="width:50%">
    <span class="section-title" style="margin-right:25px">Operation Summary</span>
    <?php
      echo createTable1(isset($data)?$data:null,$str_params);
    ?>
  </div>
  <div style="width:50%">
    <span class="section-title">Transaction Summary</span> 
    <?php
      echo createTable2(isset($data)?$data:null);
    ?>
  </div>
</div>