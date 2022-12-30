<!DOCTYPE html>
<html>
 <head>
    <link href="{{ base_url('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css"/>
       <!------ Include the above in your HEAD tag ---------->
    <style>
        body {
        background: #fff;
        margin-top: 15px;
        margin-bottom: 15px;
        margin-left:15px;
        margin-right:15px;
    }

    @media screen {
    body {
      margin-left:15px;
      margin-right:15px;
      color: #000;
      background-color: #fff;
    }
}
 
@media print {
  body{
    margin-top:1mm;
    box-shadow: 0;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  @page { 
    margin-top:15px;
    size:'A4';
    margin-left:15px;
    margin-right:15px;
    margin:0;
	}
  @page :footer { 
		display: none
	}
	@page :header { 
		display: none
	}
}
 
    div.flat-alert-box{
     box-shadow:border-box;
     border:1.2px solid #CDD4D5;
     padding:10px;
     margin:10px;
     color:#A1E3EE;
     font-weight:0.2em;
     font-size:1.2em;
     border-radius:2px;
    }            
    .rcpt-header{
        width:100%;
        display:flex;
        flex-direction:row;
    }
    .rcpt-title-area{
        flex-grow:1;
    }
    
    .rcpt-title-area span{
            display:inline-block;
            white-space: nowrap ;
            margin-left:50%;
            transform:translate(-60%);
    }
    /* div.rcpt-logo{
      background:green;
    } */
    .rpt-title{
        white-space: nowrap ;
        font-family: 'Khmer','Suwannaphum','DaunPenh','Code2000', 'Khmer OS Content','Francois One','Bayon';
        display:inline-block;
        padding:3px;
        font-weight:bold;
        font-size:1.2em;
    }
    .rpt-subtitle{
        font-family: 'Khmer','Suwannaphum','DaunPenh','Code2000', 'Khmer OS Content','Francois One','Bayon';
        display:inline-block;
        font-weight:bold;
        font-size:1.1em;
    } 
    
    .rcpt-table{
        width:100%;
    }
    .rcpt-table th{
        padding:5px;
        border:0.8px solid grey;
    }
    .rcpt-table td {
        padding:5px;
        border-bottom:0.7px solid grey !important;
        border-left:0.7px solid grey !important;
        border-right:0.7px solid grey !important;
    }
    .inline-label{
      display:inline-block;
      padding:3px;
      width:130px; 
      color:grey;
    }
    .signature-area{
      margin-top:20px;
      float:right;
    }
    .rcpt-signature{
       display:block;
       padding:4px;
    }
    .rcpt-receiver-name{
       display:block;
       padding:4px;
    }
    .rcpt-total-row{
      font-weight:bold;
      font-sie:1.1em;
    }
    </style>

    <script defer src="{{ base_url('public/assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script defer src="{{ base_url('public/assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>


 </head>
 <body>
   <?php 
     $r = $receipt->data; 
     $logo = isset($receipt->logo)?$receipt->logo:null; 
   ?>      
   <div class="container" style="margin-top:45px">

        <div class="rcpt-header">
             <div class="rcpt-logo" style="width:300px;transform:translate:5%;">
               <img src="<?php echo $logo; ?>" style="width:80px;float:right">          
             </div>
             <div class="rcpt-title-area">
                   <span class="rpt-title center">សាកលវិទ្យាល័យបញ្ញាសាស្ត្រកម្ពុជា</span>
                   <span class="rpt-title center">Pannasastra University of Cambodia</span>
                   <span class="rpt-subtitle center">Grant Loan Repayment Receipt</span> 
             </div>
        </div>
         <div class="rcpt-body">
              <div style="width:100%;">
                  <div style="float:left;margin-left:20px">
                      <div style="display:table-row">
                         <span class="inline-label">Student Name</span>
                         <span>: <?php echo $r->payer_name ; ?></span>
                       </div>

                       <div style="display:table-row">
                         <span class="inline-label">Student's ID</span>
                         <span>: <?php echo $r->payer_code; ?></span>
                       </div>

                       <div style="display:table-row">
                       <span class="inline-label">Phone Number</span>
                         <span>: <?php echo $r->phone_number; ?></span>
                       </div>

                  </div>
                  
                  <div style="float:right;margin-right:20px">
                      <div style="display:table-row">
                         <span class="inline-label">Receipt Number</span>
                         <span>: <?php echo $r->receipt_number; ?></span>
                       </div>

                       <div style="display:table-row">
                       <span class="inline-label">Payment Date</span>
                         <span>: <?php echo $r->payment_date; ?></span>
                       </div>

                       <div style="display:table-row">
                       <span class="inline-label">Issue Date</span>
                         <span>: <?php echo $r->issue_date; ?></span>
                       </div>
                  </div> 
              </div>
             
              <table cellspacing="0" class="rcpt-table" style="margin-top:20px">
                  <thead>
                      <tr>
                          <th style="width:10%">No</th>
                          <th style="width:50%">Description</th>
                          <th style="width:30%">Pmt Method</th>
                          <th style="width:30%">Amount</th>
                      </tr>
                  </thead>
                  <tbody>
                     <?php
                      $cur = isset($r->currency)?$r->currency:'$';
                      if($cur =='USD') $cur ='$';
                      if (!$cur) $cur='$';
                        $i =0;
                        foreach($r->items as $item){
                                $amount = $cur.$item->amount;
                                if(strtolower($item->description) =='discount amount' || strtolower($item->description) =='discount')
                                $amount = '('.$cur.$item->amount.')';
                                $i++;

                             echo "<tr>
                                    <td>$i</td>
                                    <td>$item->description</td>
                                    <td>$item->pmt_method</td>
                                    <td>$amount</td>
                               </tr>";
                        }
                     ?>
                     <tr class="rcpt-total-row"><td colspan="3" style="text-align:right;padding:3px">Total</td><td><?php $cur = isset($r->currency)?$r->currency:'$'; if($cur) $cur='$'; echo $cur.$r->total; ?></td></tr> 
                  </tbody>
              </table>
                <div class="signature-area">
                   <span class="rcpt-signature">Receiver`s signature:......................................</span>
                   <span class="rcpt-receiver-name">Name: <?php $r->create_user; ?></span>
                </div>
         </div>
     </div>
   </body>
</html>
