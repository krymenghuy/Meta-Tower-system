    <style>
     .rpt-label{
       display:inline-block;
       font-weight:bold;
       color:grey;
       width:150px;
     }
     .rpt-label-value{
       display:inline-block;
       color:#000;
     }
     .rpt-label-value::before{
      content:' : ';
     }
     .rpt-label-item{
       display:flex;
       flex-direction:row;
     }
     .pmt-table th{
        font-size:1em;
     }
    .pmt-table td{
        font-size:0.9em; 
     }
    </style> 
    <div style="display:flex;flex-direction:row;width:100%">
        <div style="width:30%">
            <div class="rpt-label-item">
              <span class="rpt-label">Loan Number</span>
              <span class="rpt-label-value"><?php echo isset($loan->code)?$loan->code:'NA'; ?></span>
           </div>
           <div class="rpt-label-item">
              <span class="rpt-label">Principal</span>
              <span class="rpt-label-value"><?php echo $loan->cur_symbol.number_format($loan->principal,2); ?></span>
           </div>
            
           <div class="rpt-label-item">
              <span class="rpt-label">Tenure</span>
              <span class="rpt-label-value"><?php $periods = (double)($loan->loan_tenure); echo $periods." ".$loan->loan_tenure_unit; ?></span>
           </div>

           <div class="rpt-label-item">
              <span class="rpt-label">Interest Rate</span>
              <span class="rpt-label-value"><?php $rate = (double)($loan->period_interest_rate)/100; echo $rate." ".$loan->compound_cycle; ?></span>
           </div>
        </div>

        <div style="width:30%">
            <div class="rpt-label-item">
              <span class="rpt-label">Start date</span>
              <span class="rpt-label-value"><?php echo $loan->start_date; ?></span>
           </div>
           <div class="rpt-label-item">
              <span class="rpt-label">First pmt date</span>
              <span class="rpt-label-value"><?php echo $loan->first_pmt_date; ?></span>
           </div>
            
           <div class="rpt-label-item">
              <span class="rpt-label">Payback method</span>
              <span class="rpt-label-value"><?php echo $loan->payback_method; ?></span>
           </div>

           <div class="rpt-label-item">
              <span class="rpt-label">Remarks</span>
              <span class="rpt-label-value"><?php echo $loan->remarks; ?></span>
           </div>
        </div>

        <div style="width:30%">

           <div class="rpt-label-item">
              <span class="rpt-label">Contract Number</span>
              <span class="rpt-label-value"><?php echo $loan->contract_number; ?></span>
           </div>

           <div class="rpt-label-item">
              <span class="rpt-label">Customer</span>
              <span class="rpt-label-value"><?php echo $loan->borrower_name; ?></span>
           </div>

            <div class="rpt-label-item">
              <span class="rpt-label">Phone number</span>
              <span class="rpt-label-value"><?php echo $loan->borrower_phone; ?></span>
           </div>

           <div class="rpt-label-item">
              <span class="rpt-label">Address</span>
              <span class="rpt-label-value"><?php echo $loan->borrower_address; ?></span>
           </div>

       </div> 
    </div>
    <table class="table pmt-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Interest</th>
            <th>Principal</th>
            <th>Amount</th>
            <th>Remaining Principal</th>
          </tr>
        </thead>
        <tbody>
        <?php
        $i=0;
        $cur = '$';
        $payments = $loan->payments;
         foreach($payments as $item){
          $i++;
          if($i===1) $cur = $item->currency_symbol; 
          $interest = number_format($item->interest,2);
          $principal =number_format($item->principal,2);
          $amount = number_format($item->amount,2);
          $rem_principal = number_format($item->remaining_principal,2);
          echo "<tr><td>$i</td><td>$item->payment_date</td><td>$cur$interest</td><td>$cur$principal</td><td>$cur$amount</td><td>$cur$rem_principal</td></tr>";
         }
        ?>
        </tbody>
    </table>
  
                        