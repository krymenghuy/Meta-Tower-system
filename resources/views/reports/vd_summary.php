<style>
  span.section-title{
    display:block;
    padding:5px;
    border-bottom:1.2px solid orange;
    font-weight:bold;
    font-family:'Khmer OS Content','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)'; 
  }

  .item-name{
    font-family:'Khmer OS Content','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
  }

  .rpt-body{
    width:100%;
  }

  table.rpt-data-table > thead th{
    padding:3px;
    font-size:0.8em;
  }

  table.rpt-data-table > tbody td{
    padding:3px;
    font-size:0.8em;
  }

  .rpt-info-header{
    padding:3px;
    font-weight:bold;
  }
</style> 
          
<div class="rpt-body">
  <div class="alert alert-info rpt-info-header">PACKAGE SUMMARY</div>
  <table class="table table-bordered rpt-data-table">
    <thead>
      <tr>
        <th></th>
        <th>Total</th>
        <th>Normal</th>
        <th>Fast</th>
      </tr>
    </thead>
    <tbody>
        <?php
          echo '<div class="d-flex align-items:center"><h5 class="p-2">This report is no longer available for DMS V2.0 </h5></div>'; 
          return;
          
          foreach($data->summary_items as $row){
            echo '<tr>
            <td>'.$row->name.'</td>
            <td>'.$row->total.'</td>
            <td>'.$row->normal_count.'</td>
            <td>'.$row->fast_count.'</td>
            </tr>';
          }
        ?>
    </tbody>
  </table>
  <div class="alert alert-info rpt-info-header">
    <?php
      if(!isset($data->transactions[0]))
        echo 'NO PAYMENT TRANSACTIONS';
      else
        echo 'MERCHANT TRANSACTIONS'
    ?>
  </div>
  <table class="table rpt-data-table">
    <thead>
      <?php
        if(isset($data->transactions[0])){
          echo '<tr>
          <th>NO</th>
          <th>DATE</th>
          <th>TYPE</th>
          <th>DESCRIPTION</th>
          <th>PMT METHOD</th>
          <th>AMOUNT</th>
          <th>PHOTO</th>
        </tr>';
        }
      ?>
    </thead>
    <tbody>
      <?php
        $i=0;
        $cur ="$";
        foreach($data->transactions as $row){
          echo '<tr>
              <td>'.($i+1).'</td>
              <td>'.$row->payment_date.'</td>
              <td>'.$row->trx_type.'</td>
              <td>'.$row->description.'</td>
              <td>'.$row->pmt_method.'</td>
              <td>'.$cur.$row->amount.'</td>
              <td><img style="width:35px;" src="'.$row->image_url.'"></img></td>
            </tr>';
        }
      ?>
    </tbody>
  </table>
  <div class="alert alert-warning rpt-info-header">
    <?php
      if(!isset($data->packages[0]))
        echo 'NO PACKAGES';
      else
        echo 'LIST OF PACKAGES';
    ?>
  </div>
  <table class="table rpt-data-table">
    <thead>
      <?php
        if(isset($data->packages[0])){
          echo '<tr>
            <th>NO</th>
            <th>DELIVERY TYPE</th>
            <th>DATE</th>
            <th>RECEIVER PHONE</th>
            <th>DESTINATION</th>
            <th>FEE PAYER</th>
            <th>COD</th>
            <th>FEES</th>
            <th>ADJUST</th>
            <th>TOTAL</th>
            <th>D-STATUS</th>
            <th>P-STATUS</th>
            <th>REMARKS</th>  
          </tr>';
        }
      ?>
    </thead>
    <tbody>
      <?php
        $i=0;
        $cur ='$';
        $total_to_sender =0;
        foreach($data->packages as $row){
          $i++;
          $fees =0;
          $cod_amount =0;
          if($row->cod==1) $cod_amount = $row->price - $row->cod_fee;
          $fees = $row->forwarding_cost;
          
          $pmt_status ='ទូទាត់ហើយ';
          $amount_to_sender=0;
          $fees += $row->cod_fee + $row->base_fee + $row->delivery_fee;
          
          if($row->sender_pmt_status_id !=1) $pmt_status ='មិនទាន់ទូទាត់';
          $sender_adjust_amount = $row->sender_adjust_amount - $row->forwarding_cost;
          if(strtolower($row->df_payer) ==='sender')
            $amount_to_sender = $cod_amount - $row->base_fee - $row->delivery_fee;  
          else
            $amount_to_sender = $cod_amount;
          
          $amount_to_sender +=  $sender_adjust_amount;
          $p_status_style ="color:orange;";
          if($row->sender_pmt_status_id === 1) $p_status_style="color:green"; 

          $d_status_style =null;
          if($row->status_id==8) $d_status_style="color:green"; 
          else if($row->status_id ==9) $d_status_style="color:red";
          else if($row->status_id ==11) $d_status_style="color:grey";

          if ($row->status_id ==8) $total_to_sender += $amount_to_sender; 
          $price = 0;
          if ($row->cod == 1) $price =$row->price;
          echo '<tr>
              <td>'.$i.'</td>
              <td>'.$row->delivery_type.'</td>
              <td>'.$row->arrival_date.'</td>
              <td>'.$row->receiver_phone.'</td>
              <td>'.$row->destination.'</td>
              <td>'.$row->df_payer.'</td>
              <td>'.$cur.$price.'</td>
              <td>'.$cur.$fees.'</td>
              <td>'.$cur.$sender_adjust_amount.'</td>
              <td>'.$cur.$amount_to_sender.'</td>
              <td style="'.$d_status_style.'">'.$row->status.'</td>
              <td style="'.$p_status_style.'">'.$pmt_status.'</td>
              <td>'.$row->remarks.'</td>
            </tr>
          ';
        }
        echo'<tr><td colspan="9"></td><td>'.$cur.$total_to_sender.'</td><td></td><td></td></tr>';
      ?>
    </tbody>
  </table>
</div>