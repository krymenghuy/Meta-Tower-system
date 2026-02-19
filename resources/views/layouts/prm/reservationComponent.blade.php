<div id="_main_reservation_component" class="mobile-padding px-3" style="display:none;">
    <div id="_divFilter_space" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_space" placeholder="Search">
                    <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
           
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="building_id" class="data-input filter-field form-control" data-field="building_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="floor_id" class="data-input filter-field form-control" data-field="floor_id"></select>
            </div>
            
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnSpace">
                    <i class="fa fa-user-plus me-2"></i>
                    <span vslang="buttons.New Reservation"></span>
                </button>
            </div>
        </div>
    </div> 
 <div id="_reservation_div_summary" class="container-fluid bg-white rounded-2 shadow p-3">
    
</div>




    <div id="_reservation_list" class="px-3 pb-2"></div>
    <!-- <div id="space_container_pagination" class="px-3 d-flex justify-content-start"></div> -->

</div>
 <style>
    
  /* .main-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 2rem;
  }
  .sidebar {
      animation: fadeIn 0.8s ease 0.2s both;
  }
  .room-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(184, 134, 111, 0.08);
      border: 1px solid #e8dfd7;
      margin-bottom: 1.5rem;
  }
  .room-card h3 {
    font-size :1.3rem;
    font-weight : 600;
    color: #2c2419;
    margin-bottom : 1rem; 
    display : flex; 
    align-item: center;
    gap : 0.5rem;
  }
  .upcoming-list{
    display:flex;
    flex-direction: column;
    gap : 0.75rem;
    max-height:300px;
  }
  .calendar-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(184, 134, 111, 0.08);
    border: 1px solid #e8dfd7;
  } */

 </style>

