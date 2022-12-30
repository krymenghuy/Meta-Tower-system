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
        font-size:1.2em !important;
        font-weight:bold;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }
    .rpt-sub-title1, .rpt-sub-title{
        display:inline-block;
        text-align:center;
        font-size:0.9em;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }
    .center {
       margin-left:50%;
       transform:translate(-50%);
    }
    </style>
 </head>
 <body>   
<div style="margin-left:0.5cm;margin-right:0.5cm;">
    <div style="display:flex;flex-direction:row;align-items:flex-start; width:100%;margin-top:10px">
        <div style="width:35px;height:35px;">
            <img src="<?php echo isset($branch->logo_url)?$branch->logo_url:null; ?>" style="width:80px;height:80px;">
        </div>
 
            <div style="margin-left:100px;width:100%;display:flex;flex-direction:column">
                 <div style="padding:auto">
                        <span class="rpt-title font-weight-bold" style="width:100%"><?php echo (isset($title)?$title:'(Report Title)'); ?></span>
                        <span class="rpt-sub-title" style="width:100%;padding:auto;"><?php echo (isset($subtitle)?$subtitle:null); ?></span>
                        <span class="rpt-sub-title1" style="width:100%;padding:auto;" ><?php echo (isset($subtitle1)?$subtitle1:null); ?></span>
                 </div>       
            </div>
    
         
    </div>
 <div style="height:25px"></div>
      <div style="width:100%">
              <?php
                echo "This is loan contract details";
              ?>
      </div>
  </div>
</body>