 <style>
  table#_qul_tblTickets> thead th{
     height:38px;
     padding-bottom:3px;
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid #F4DCAD;
     font-size:0.8em;
     font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)'; 
  }
  .ticket-info-wrapper{
    margin-top:-15px;
    padding:15px;
    border-radius:5px;
    display:flex;
    flex-direction:column;
  }
  .ticket-patient-info .thumbnail-wrapper{
     height:160px !important;
  }
  .ticket-patient-info{
     display:flex;
     flex-direction:row;
     padding:10px; 
  }
  .qul-ticket-number{
    display:block;
    padding:3px;
    color:#0D1905;
    font-size:1.3em;
    font-weight:bold;
  }
  .qul-arrival-time{
     color:grey;
     font-size:1em;
     display:block;
     padding:3px;
  }
  .btn-ticket-tab{
    padding:5px;
    min-width:100px;
    border-radius:15px;
    border:1.2px solid grey;
    text-align:center;
    margin-right:10px;
    transform:scale(0.9);
  }
  /* .btn-ticket-tab:hover{
     transition-property:border-width;
     transform:scale(1.2);
  } */
  .btn-ticket-tab--active{
    border:1.8px solid #5AC612;
    color:#4CB506 !important;
    font-weight:bold;
    transform:scale(1);
  }
</style>

<div id="_main_queueComponent" style="display:none;padding-top:15px">
      <section class="content">
 
       <div class="container-fluid">
 
          <div class="d-flex justify-content-between" style="padding:10px">
              <div class="d-flex col-md-6">
                  <button class="btn btn-outline-primary border border-primary rounded-pill" id="_qul_btnNewAppointment"><i class="fa fa-calendar-check"></i> &nbsp;<span class="trans-text" data-langprop="buttons.Add Ticket">Add Ticket</span></button>
                  <input id="_qul_search_ticket" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search ticket">
                  <a id="_qul_btnFindTicket" class="btn btn-outline-success" href="javascript:void(0)" ><i class="fas fa-sync-alt"></i></a>
              </div>

              <div class="d-flex justify-content-end col-md-4">
                  <input type="date" class="input-sm form-control" placeholder="Filter date" id="_qul_filter_date" autocomplete="off">&nbsp;
                  <select class="input-sm" placeholder="Status" id="_qul_filter_status">
                  </select>
                  <!-- <a id="_qul_btnPrint" href="javascript:void(0)"  class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                  <!-- <a id="_qul_btnPDF" href="javascript:void(0)" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp; -->
                  <!-- <a id="_qul_btnExcel" href="javascript:void(0)"  class="btn btn-sm btn-default" style="border-radius:10px"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
              </div>
          </div>
          
          <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#A0DFF3;min-height:350px;">
              <table class="table" id="_qul_tblTickets" style="margin-top:-25px !important;"></table>
          </div>

      </div>
 
     </section>
 </div>
  
