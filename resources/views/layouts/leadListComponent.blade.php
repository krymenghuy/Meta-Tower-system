<style>
    .vs-btn-md{
        font-size:0.9em;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
        border-radius:15px;
        border:none;
        padding:7px 10px 7px 10px;
         
    }

    .vs-btn-md-success{
        background-color:#149220;
        color:#fff;
    }
    .vs-btn-md-primary{
       background-color:#27BFD8;
       color:#fff;
    }

    .vs-btn-md-danger{
        background-color:#F73004;
        color:#fff;
    }
    .vs-btn-md-default{
        background-color:#E2DD8D;
        color:#fff;
    }

    .vs-btn-md-primary:hover{
       background-color:#0EC1C3; 
       transition-property: background-color;
       transition-timing-function:0.5s ease-in-out;
    }
    .vs-btn-round{
        display:block;
        font-size:0.9em;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
        border-radius:20px;
        min-width:35px;
        text-align:center;
        padding:7px;
    }
    .vs-btn-round-success{
        background-color:#149220;
        font-size:0.8em !important;
        color:#fff;
    }

  table#_apl_tblLoanApps> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid orange;
     font-size:0.8em; 
  }
</style>
<div id="_main_leadListComponent" style="display:none;">
            <div class="d-flex justify-content-between" style="padding:15px;">
                <div class="d-flex col-md-6">
                    <button class="vs-btn-md vs-btn-md-primary" id="_leadlist_btnNewLead"><i class="fa fa-list-alt"></i> New Lead</button>
                    <input id="_leadlist_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search lead">
                    <a id="_leadlist_btnSearch" class="vs-btn-round vs-btn-round-success" href="javascript:void(0)"><i class="fas fa-sync-alt"></i></a>
                </div>

                <div class="d-flex justify-content-end col-md-6">
                    <!-- <a id="_apl_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                    <!-- <a id="_apl_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                    <!-- <a id="_apl_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
                </div>
            </div>
            
            <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
                <table class="table" id="_leadlist_tblLeads" style="margin-top:-25px !important;"></table>
            </div>
</div>
<script  src="{{ asset('js/LeadListComponent.js') }}"></script>