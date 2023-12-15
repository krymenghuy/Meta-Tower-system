<style>
   .tbl-pmts th{
       text-transform: uppercase;
       color:black;
   }
   tr.total td{
    font-weight:600;
   }
   tr.total td:first{
     text-align: right;
   }
</style>
<?php
  $html_head ='<table class="table table tbl-pmts"><thead><tr>
  <th class="border-0  small font-weight-bold">No</th>
  <th class="border-0  small font-weight-bold">Trx. Type</th>
  <th class="border-0  small font-weight-bold">Driver Name</th>
  <th class="border-0  small font-weight-bold">Payment Date</th>
  <th class="border-0  small font-weight-bold">PCS</th>
  <th class="border-0  small font-weight-bold">Amount</th>
  <th class="border-0  small font-weight-bold">Breakdowns</th>
  <th class="border-0  small font-weight-bold">Remarks</th>
  <th class="border-0  small font-weight-bold">Booked By</th>
  </tr></thead>';

  $html_body = '<tbody>';
  $numero =0;
  $total = 0;
  $data->currency_code;
  //$data->exchange_rate='';
  foreach($data->data AS $row){
    $numero++; 
    $bs_notes = '';
    $sts = explode('|',$row->pmt_breakdowns);
    foreach($sts as $b){
      $bs_notes .= '<span class="d-block">'.$b.'</span>';
    }
    $total += $row->amount; 
    $cls_amount = strtolower($row->trx_type) =='disbursement'? 'text-danger':'text-success';
    $html_tr = '<tr>'.
    '<td>'.$numero.'</td>'.
    '<td>'.$row->trx_type.'</td>'.
    '<td>'.$row->agent_name.'</td>'.
    '<td>'.$row->payment_date.'</td>'.
    '<td>'.$row->package_count.' pcs</td>'.
    '<td><span class="'.$cls_amount.' fw-semibold">'.number_format($row->amount,2,'.','').' <small>USD</small></span></td>'.
    '<td class="'.$cls_amount .'">'.$bs_notes.'</td>'.
    //'<td><span class="fw-semibold '.$cls_amount .'">'.($row->bank_account_info? $row->bank_account_info:'No bank account').'</span></td>'.
    '<td>'.$row->remarks.'</td>'.
    '<td>'.$row->create_user.'</td>'.  
    '</tr>';
    $html_body .= $html_tr; 
  }
  
  if ($numero ==0){
    $html_body .= '</tbody></table>'; 
    $html_body .='<div class="flat-alert-box">Looks like no matched transactions found!</div>';
  }else{
    $html_body .='<tr class="total"><td colspan ="5">Total: </td> <td>'.number_format($total,2,'.','').' USD'.'</td><td></td><td></td><td></td><td></td></tr>';
    $html_body .= '</tbody></table>'; 
  } 
  echo $html_head.$html_body;
?>