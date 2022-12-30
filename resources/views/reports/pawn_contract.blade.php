<!DOCTYPE html>
<html>
 <head>
   <link href="{{ base_url('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css"/>
    <script src="{{ base_url('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script defer src="{{ base_url('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
    <!------ Include the above in your HEAD tag ---------->
    <style>

      /* main.css */

   body {
        background: rgb(204,204,204); 
    }

/* on-screen styles */
@media screen {
    body {
      margin:0;
      color: #000;
      background-color: #fff;
    }
}
 
@media print {
  body {
    margin: 0;
    box-shadow: 0;
  }
  @page { 
    width:100%;
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
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }            
    .rpt-title{
        display:inline-block;
        text-align:center;
        font-size:1.1em !important;
        font-weight:bold;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }
    .rpt-sub-title, .rpt-sub-title1{
        display:inline-block;
        text-align:center;
        font-size:0.9em;
        font-weight:bold;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }
    .center {
       margin-left:50%;
       transform:translate(-50%);
    }
    .table1{
      width:100%;
    }
    .table1 td{
       border:0.9px solid grey;
       font-size:0.8em;
    }
    .rpt-label{
      display:block;
      font-size:0.8em;
      font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    } 
    .rpt-description, .con-item, .rpt-text{
      display:block;
      font-size:0.7em;
      font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }
    .rpt-text{
       font-weight:bold;
    }
    </style>
 </head>
 <body>
  <?php
    $title ="កិច្ចសន្យាទទួលប្រាតិភោគដោយអនុប្បទាន";
    $subtitle1 ="Special Pawn Ticket";
   
   
   ?>
<div style="margin-left:0.5cm;margin-right:0.5cm;">
    <div style="display:none;flex-direction:row;align-items:flex-start; width:100%;margin-top:10px">
        <!-- <div style="width:35px;height:35px;">
            <img src="<?php echo isset($branch->logo_url)?$branch->logo_url:null; ?>" style="width:80px;height:80px;">
        </div> -->
 
            <!-- <div style="margin-left:100px;width:100%;display:flex;flex-direction:column">
                 <div style="padding:auto">
                        <span class="rpt-title font-weight-bold" style="width:100%"><?php echo (isset($title)?$title:'(Report Title)'); ?></span>
                        <span class="rpt-sub-title" style="width:100%;padding:auto;"><?php echo (isset($subtitle)?$subtitle:null); ?></span>
                        <span class="rpt-sub-title1" style="width:100%;padding:auto;" ><?php echo (isset($subtitle1)?$subtitle1:null); ?></span>
                 </div>       
            </div> -->
    
         
    </div>
        <div style="height:25px;"></div>
        <div style="width:100%">
          <div style="width:100%;height:60px;border:1px solid grey;">
             
          </div>

            <div style="width:100%;height:auto;border:1px solid grey;padding:10px">
                  <span class="rpt-title font-weight-bold" style="width:100%"><?php echo (isset($title)?$title:'(Contract Agreement)'); ?></span>
                  <span class="rpt-sub-title1 font-weight-bold" style="width:100%"><?php echo (isset($subtitle1)?$subtitle1:'Sub Title'); ?></span>
            </div>

            <div style="width:100%;height:auto;overflow:hdden;">
            <table class="table1">
                   <tbody>
                     <tr>
                        <td rowspan="3" style="width:60%;">
                          <span class="rpt-label" style="top:1px;">ពិពណ៏នាទ្រព្យ: Description of the special article pawned</span>
                          <span class="rpt-text"> <?php echo $contract->collateral_description; ?></span>
                        </td>
                        <td style="width:20%">
                             <span class="rpt-label">លេខកិច្ចសន្យា</span>
                             <span class="rpt-label">Contract Number</span>
                        </td>
                        <td style="width:20%">
                           <span class="rpt-text"> <?php echo $contract->contract_number; ?> </span>
                        </td>
                     </tr>

                     <tr>
                        <td style="width:20%">
                           <span class="rpt-label">លេខអត្តសញ្ញាណបណ្ណ</span>
                           <span class="rpt-label">National ID</span>
                        </td>
                      
                        <td style="width:20%">
                        <span class="rpt-text"> <?php echo $contract->borrower_nid; ?></span>
                        </td>
                     </tr>
                     <tr>
                        <td style="width:20%">
                           <span class="rpt-label">លេខទូរសព្ទ័</span>
                           <span class="rpt-label">Phone Number</span>
                        </td>
                        <td style="width:20%">
                           <span class="rpt-text"> <?php echo $contract->borrower_phone; ?></span>
                        </td>
                     </tr>
                   </tbody>
               </table>
            </div>
 
            <div style="display:flex;flex-direction:row;height:60px;border-top:none !important;border:1px solid grey;">
                 <div style="width:30%;padding:3px">
                        <span class="rpt-label">ឈ្មោះអ្នកដាក់ទ្រព្យ</span>
                        <span class="rpt-label">Name of Special Pawner</span>
                        <span class="rpt-text"><?php echo $contract->borrower_name; ?></span>
                  </div>
                 <div style="width:70%;border-left:1px solid grey;padding:3px">
                        <span class="rpt-label">អសយដ្ធានអ្នកដាក់ទ្រព្យ</span>
                        <span class="rpt-label">Address of special pawner</span>
                        <span class="rpt-text"><?php echo $contract->borrower_address; ?></span>
                 </div>
            </div>

            <div style="display:flex;flex-direction:row;height:60px;border:1px solid grey;">
                 <div style="height:100%;width:33%;padding:3px">
                        <span class="rpt-label">កាលបរិច្ចេទអោយខ្ចី</span>
                        <span class="rpt-label">Effective Date</span>
                        <span class="rpt-text"><?php echo $contract->start_date; ?></span>
                  </div>
                  <div style="height:100%;width:33%;padding:3px;border-left:1px solid grey;">
                        <span class="rpt-label">រយះពេល</span>
                        <span class="rpt-label">Redeemption Period</span>
                        <span class="rpt-label"><?php echo $contract->loan_tenure." ".isset($contract->loan_tenure_unit)?$contract->loan_tenure_unit:'months?'; ?></span>
                  </div>
                  <div style="height:100%;width:33%;padding:3px;border-left:1px solid grey;">
                        <span class="rpt-label">កាលបរិច្ចេទផុតកំណត់</span>
                        <span class="rpt-label">Maturity Date</span>
                        <span class="rpt-text"><?php echo $contract->maturity_date; ?></span>
                  </div>
            </div>
            <div style="display:flex;flex-direction:row;height:60px;border:1px solid grey;">
                 <div style="height:100%;width:33%;padding:3px">
                        <span class="rpt-label">ចំនួនប្រាក់កម្ចី</span>
                        <span class="rpt-label">Amount of Loan</span>
                        <span class="rpt-text"><?php echo $contract->cur_symbol.$contract->principal; ?></span>
                  </div>
                  <div style="height:100%;width:33%;padding:3px;border-left:1px solid grey;">
                        <span class="rpt-label">ឈ្មោះនិងអសយដ្ធានអ្នកធានា</span>
                        <span class="rpt-label">Name and Address of Guarantor</span>
                        <span class="rpt-text"><?php echo $contract->guarantor_name.", ".$contract->guarantor_address; ?></span>
                  </div>
                  <div style="height:100%;width:33%;padding:3px;border-left:1px solid grey;">
                        <span class="rpt-label">អត្រាការប្រាក់</span>
                        <span class="rpt-label">Interest Rate</span>
                        <span class="rpt-text"><?php $rate = (double)($contract->period_interest_rate); echo $rate."% ".$contract->compound_cycle; ?></span>
                  </div>
            </div>

            <div style="display:row;height:auto;border:1px solid grey;overflow:hidden">
               <span style="font-weight:bold;display:block;margin-left:10px">លក្ខខណ្ឌ (Terms and Conditions)</span>
               <ol>
                 <li>
                   <span class="con-item">កិច្ចសន្យាប្រាតិភោគអនុប្បទានមានកំលៃប្រើប្រាស់ស្របច្បាប់ លុះត្រាមានប្រថាប់ត្រាពីការិយាល័យគ្រប់គ្រងអាជីវកម្មទទួលបញ្ចាំ នៃក្រសួងសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ។</span>
                   <span class="con-item">(Special pawn ticket is considered legal only with the stamp of Pawn Supervision Division of Ministry of Economy and Finance on the ticket.)</span> 
                  </li>

                  <li>
                   <span class="con-item">អ្នកដាក់ទ្រព្យត្រូវធានាអះអាងថា ខ្លួនពិតជាម្ចាស់កម្មសិទ្ធិស្របច្បាប់នៃទ្រព្យដែលបានដាក់ប្រាតិភោគដោយអនុប្បទានពិតប្រាកដមែន។</span>
                   <span class="con-item">(Special Pawnee shall assure that he/she is the legal owner of article special pawned)</span> 
                  </li>

                  <li>
                   <span class="con-item">ក្នុងករណីដែលទ្រព្យដាក់ប្រាតិភោគដោយអនុប្បទានជាប់ពាក់ព័ន្ធអំពើរចោរកម្ម ឬអំពើឆបោក អាជីវករមានសិទ្ធិចាត់វិធានការណ៍តាមនីតិវិធីច្បាប់។</span>
                   <span class="con-item"> (In the event that articles special pawned is stolen or fraudulently acquired , special pawnbroker reserves the right to take appropriate legal action.)</span> 
                  </li>

                  <li>
                   <span class="con-item">កិច្ចសន្យាទទួលប្រាតិភោគដោយអនុប្បទានមានរយៈពេលយ៉ាងយូរ៤ខែ (ចាប់ពីកាលបរិច្ឆេទដាក់ប្រាតិភោគដោយអនុប្បទាន និងអាចបន្តសុពលភាពបាន)</span>
                   <span class="con-item">(Every pledge shall be redeemed or renewed within four (4) months from the date of special pawning.)</span> 
                  </li>

                  <li>
                   <span class="con-item"> អ្នកដាក់ទ្រព្យត្រូវបង្ហាញកិច្ចសន្យាទទួលប្រាតិភោគដោយអនុប្បទានដោយផ្ទាល់ ឬធ្វើលិខិតប្រគល់សិទ្ធស្របច្បាប់អោយបុគ្គលណាមួយជំនួសនៅពេលមកលុសទ្រព្យរបស់ខ្លួន។</span>
                   <span class="con-item">(Special Pawnee personally or the person with power-delegating letter from special Pawnee shall produce special pawn on pledge redemption.)</span> 
                  </li>

                  <li>
                   <span class="con-item">ក្នុងករណីបាត់កិច្ចសន្យាទទួលប្រាតិភោគដោយអនុប្បទាន អ្នកដាក់ទ្រព្យត្រូវជូនដំណឹងជាបន្ទាន់ដល់កន្លែងទទួលប្រាតិភោគដោយអនុប្បទាន។</span>
                   <span class="con-item">(In case of loss of special pawn ticket, special Pawnee shall immediately inform special pawnbroker.)</span> 
                  </li>

                  <li>
                   <span class="con-item">ក្នុងករណីបាត់កិច្ចសន្យាទទួលប្រាតិភោគដោយអនុប្បទាន អ្នកដាក់ទ្រព្យត្រូវជូនដំណឹងជាបន្ទាន់ដល់កន្លែងទទួលប្រាតិភោគដោយអនុប្បទាន។</span>
                   <span class="con-item">(In case of loss of special pawn ticket, special Pawnee shall immediately inform special pawnbroker.)</span> 
                  </li>

                  <li>
                   <span class="con-item">អ្នកដាក់ទ្រព្យយល់ព្រមទទួលនៅលក្ខខណ្ឌទាំងទ្បាយដែលមានចែងក្នុងកិច្ចសន្យាទទួលប្រាតិភោគដោយអនុប្បទាន នៅពេលចុះហត្ថលេខា ឬផ្តិតមេដៃ។</span>
                   <span class="con-item">(Special Pawnee’s signature or thumb print on special pawn ticket constitute his/her acceptance of the above terms and condition. )</span> 
                  </li>

               </ol>
              
            </div>

            <div style="display:flex;flex-direction:row;height:150px;border:1px solid grey;">
                  <div style="height:100%;width:25%;padding:10px">
                        <span class="rpt-label">កំណត់សំគាល់</span>
                        <span class="rpt-label">Remarks</span>
                  </div>
                  <div style="height:100%;width:25%;padding:10px;border-left:1px solid grey;">
                        <span class="rpt-label">ស្នាមមេដៃនិងហត្ថលេខា</span>
                        <span class="rpt-label">Thumb Print and Signature</span>
                  </div>
                  <div style="height:100%;width:25%;padding:10px;border-left:1px solid grey;">
                        <span class="rpt-label">ស្នាមមេដៃនិងហត្ថលេខា</span>
                        <span class="rpt-label">Thumb Print and Signature</span>
                  </div>
                  <div style="height:100%;width:25%;padding:10px;border-left:1px solid grey;">
                        <span class="rpt-label">ស្នាមមេដៃនិងហត្ថលេខា</span>
                        <span class="rpt-label">Thumb Print and Signature</span>
                  </div>
            </div>


        </div>
  </div>
</body>