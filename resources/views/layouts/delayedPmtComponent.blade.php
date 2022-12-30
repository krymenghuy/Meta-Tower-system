<style>    
  table#_tblDelayedPmts> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid orange;
     font-size:0.8em; 
  }
  /* .dropdown-menu{  
    position: absolute; transform: translate3d(0px, -300px, 0px); top: 0px; left: 0px;
    will-change: transform;
  } */
</style>
<div id="_main_delayedPaymentsComponent" style="display:none;">
            <div class="d-flex justify-content-between" style="padding:15px;">
                <div class="d-flex col-md-6">
                    <input id="_dpmt__search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search">
                    <a id="_dpmt__btnSearch" class="btn btn-sm btn-outline-success" href="javascript:void(0)"><i class="fas fa-sync-alt"></i></a>
                </div>

                <div class="d-flex justify-content-end col-md-6">
                    <!-- <a id="_dpmt__btnPrint" class="btn btn-sm btn-primary" style="border-radius:10px;" href="#"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                    <a id="_dpmt__btnPDF" class="btn btn-sm btn-success" style="border-radius:10px" href="#"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp;
                    <a id="_dpmt__btnExcel" class="btn btn-sm btn-default" style="border-radius:10px" href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a>
                </div>
            </div>
            
            <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
                <table class="table" id="_tblDelayedPmts" style="margin-top:-25px !important;"></table>
            </div>
</div>
<script  src="{{ asset('js/DelayedPaymentsComponent.js') }}"></script>