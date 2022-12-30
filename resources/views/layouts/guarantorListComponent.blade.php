<style>    
  table#_tblGuarantors> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid #86DDF3; 
     font-size:0.8em;
  }
</style>
<div id="_main_guarantorListComponent" style="display:none;">
            <div class="d-flex justify-content-between" style="padding:15px;">
                <div class="d-flex col-md-6">
                    <!-- <button class="vs-btn-md vs-btn-md-success" style="width:120px" id="_guar_btnTest"><i class="fa fa-list-alt"></i> Receive Borrower</button>  -->
                    <input id="_guar_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search Loan">
                    <a id="_guar_btnSearch" class="btn btn-sm btn-outline-success" href="javascript:void(0)"><i class="fas fa-sync-alt"></i></a>
                </div>

                <div class="d-flex justify-content-end col-md-6">
                    <a id="_guar_btnPrint" class="btn btn-sm btn-primary" style="border-radius:10px;" href="#"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp;
                    <a id="_guar_btnPDF" class="btn btn-sm btn-success" style="border-radius:10px" href="#"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp;
                    <!-- <a id="_guar_btnExcel" class="btn btn-sm btn-default" style="border-radius:10px" href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
                </div>
            </div>
            
            <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
                <table class="table" id="_tblGuarantors" style="margin-top:-25px !important;"></table>
            </div>
</div>
<script  src="{{ asset('js/GuarantorListComponent.js') }}"></script>