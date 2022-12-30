<style>
    

  table#_bor_tblBorrowers> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid orange;
     font-size:0.8em; 
  }
</style>

<div id="_main_borrowerListComponent" style="display:none;">
      <section class="content">
 
       <div class="container-fluid">
 
          <div class="d-flex justify-content-between" style="padding:10px">
              <div class="d-flex col-md-6">
                  <button class="vs-btn-md vs-btn-md-primary" id="_bor_btnNewLoanApp"><i class="fa fa-list-alt"></i>&nbsp;<span class="trans-text" data-langprop="buttons.New Loan">New Loan</span></button>
                  <input id="_bor_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search customer">
                  <a id="_bor_btnSearch" class="vs-btn-round vs-btn-success" href="javascript:void(0)" ><i class="fas fa-sync-alt"></i></a>
              </div>

              <div class="d-flex justify-content-end col-md-6">
                  <!-- <a id="_bor_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                  <!-- <a id="_bor_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                  <!-- <a id="_bor_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
              </div>
          </div>
          
          <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
              <table class="table" id="_bor_tblBorrowers" style="margin-top:-25px !important;"></table>
          </div>
 
      </div>
 
     </section>
  
 
 </div>

 