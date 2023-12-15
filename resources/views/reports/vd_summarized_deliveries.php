<style>
  span.section-title{
    display:block;
    padding:5px;
    border-bottom:1.2px solid orange;
    font-weight:bold;
    font-family: 'Khmer OS Content','Francois One','Bayon';
  }

  .item-name{
    font-family: 'Khmer OS Content','Francois One','Bayon';
  }
</style>
<?php
  function createTable1($p_items) {
    $tr_html=null;
    $html = '<table class="table"><thead><tr>'.
    '<td></td>'.
    '<td>COUNT</td>'.
    '<td>NORMAL</td>'.
    '<td>FAST</td>'.
    '</tr></thead>';

    foreach($p_items as $row) {
      $cur ="$";
      if(isset($row->cur)) $cur = $row->cur;
      $total = $row->normal + $row->fast;
      $tr_html .= '<tr>'.
      '<td class="item-name">'.$row->item_name.'</td>'.
      '<td>'.$total.'</td>'.
      '<td>'.$row->delviery_type.'</td>'. 
      '<td>'.$row->fast.'</td>'.  
      '</tr>';
    }

    $html .='<tbody>'.$tr_html.'</tbody></table>';
    return $html;
  }
                    
  function createTable2($d) {
    $cur = '$';
    $html = '<table class="table"><thead><tr>'.
    '<td></td>'.
    '<td>AMOUNT (USD)</td>'.
    '<td>AMOUNT (KHR)</td>'.
    '</tr></thead>';
    $xrate = $d->exchange_rate;
    $tr_html = null;
    foreach($c_items as $row){
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
<div class="row">
  <div class="col-md-6">
    <span class="section-title">SUMMARY OF PACKAGES</span>    
    <?php 
      echo createTable1($data->p_items);
    ?>
  </div>

  <div class="col-md-6">
    <span class="section-title">CASH SUMMARY</span> 
  </div>
</div>