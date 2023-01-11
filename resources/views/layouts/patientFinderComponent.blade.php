 <style>
     table#_paf_tblPatients>thead th {
         font-weight: normal;
         text-transform: uppercase;
         border-bottom: 1px solid orange;
         font-size: 0.8em;
     }

     .patient-info-wrapper {
         padding: 10px;
         border-left: 1.5px dotted red;
         border-right: 1.5px dotted red;
     }

 </style>

 <div id="_main_patientFinderComponent" style="display:none;">
     <section class="content">

         <div class="container-fluid">

             <div class="d-flex justify-content-between" style="padding:10px">
                 <div class="d-flex col-md-6">
                    <button class="btn btn-primary" id="_paf_btnNew"></button>
                     <input id="_apl_search" style="width:50%;margin-right:10px;margin-left:10px" type="text"
                         class="form-control" placeholder="Search patient">
                     <a id="_apl_btnSearch" class="vs-btn-round vs-btn-success" href="javascript:void(0)"><i
                             class="fas fa-sync-alt"></i></a>
                 </div>

                 <div class="d-flex justify-content-end col-md-6">
                     <!-- <a id="_apl_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                     <!-- <a id="_apl_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                     <!-- <a id="_apl_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
                 </div>
             </div>

             <div class="flat-box"
                 style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
                 <table class="table" id="_paf_tblPatients" style="margin-top:-25px !important;"></table>
             </div>

         </div>

     </section>
 </div>
