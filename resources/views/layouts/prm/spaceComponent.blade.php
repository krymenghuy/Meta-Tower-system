<div id="_main_space_component" class="mobile-padding px-3" style="display:none;">
     <div id="_divFilter_space" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            {{-- <div class="col-12 col-md-4 col-lg-5">
                <div class="position-relative w-100">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_space" placeholder="Search by Unit Code">
                    <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
            </div>
            <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnSpace">
                    <i class="fa-brands fa-firstdraft"></i>
                    <span vslang="buttons.Create Space"></span>
                </button>
            </div> --}}

            <div class="col-12">
                <div class="row g-3 align-items-center">
                    <div class="col-12 col-md-3">
                        <select id="building_id"  class="data-input filter-field form-control" data-field="building_id" placeholder="Building"></select>
                    </div>
                    <div class="col-12 col-md-2">
                        <select id="floor_id" class="data-input filter-field form-control" data-field="floor_id" placeholder="Floor"></select>
                    </div>
                    <div class="col-12 col-md-2">
                        <select id="space_type_id" class="data-input filter-field form-control" data-field="space_type_id" placeholder="Type"></select>
                    </div>
                    <div class="col-12 col-md-2">
                        <select type="id" id="_space_status" class="data-input filter-field form-control" data-field="status_id" placeholder="Status"></select>
                    </div>
                    <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnSpace">
                    <i class="fa-brands fa-firstdraft me-2"></i>
                    <span vslang="buttons.Create Space"></span>
                </button>
            </div>
                </div>
            </div>
            <div class="col-12 col-md-4 col-lg-3">
                <div class="position-relative w-100">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_space" placeholder="Search by Unit Code">
                    <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
            </div>
        
        </div>
    </div>
 <div id="_space_div_summary" class="container-fluid bg-white rounded-2 shadow my-3 p-3">

</div>




    <div id="_space_list" class="table-responsive  mt-3 rounded-2"></div>
    <div id="space_container_pagination" class="px-3 d-flex justify-content-start"></div>

</div>
 <style>

.unit-card {
  background: #fff;
  border: 1px solid #dce0e5;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,.05);
  transition: box-shadow .2s;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 14px;
    transition: transform .25s ease, box-shadow .25s ease;
}

.unit-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}



.unit-status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0,0,0,.1);
}

.unit-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.progress {
  border-radius: 8px;
  overflow: hidden;
}

.unit-card-placeholder {
  background: #f8f9fa;
  border: 2px dashed #dce0e5;
  border-radius: 12px;
  transition: border-color .2s, color .2s;
}

.unit-card-placeholder:hover {
  border-color: #0d6efd;
  color: #0d6efd;
}
.metric-card-sm {
    height: 100%;
    padding: 10px 12px;
    border-radius: 14px;
    background: linear-gradient(
        91deg,
        rgba(255,255,255,0.95),
        rgb(26 22 71 / 31%)
    );
    /* border: 1px solid rgba(0,0,0,0.06); */
    backdrop-filter: blur(6px);
}

.metric-head-sm {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #6c757d;
    margin-bottom: 4px;
}

.metric-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.metric-value-sm {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 20px;
    font-weight: 800;
    color: #111418;
}

.trend {
    font-size: 11px;
    font-weight: 700;
}

.trend.up {
    color: #16a34a;
}

.trend.down {
    color: #dc2626;
}

.pill {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
}

.pill.danger {
    background: rgba(220,38,38,0.12);
    color: #dc2626;
}

.pill.warning {
    background: rgba(245,158,11,0.15);
    color: #d97706;
}



/* .unit-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to bottom,
        rgba(0,0,0,0.35),
        rgba(0,0,0,0.75)
    );
    z-index: 0;
} */

/* .unit-card > .p-4 {
    position: relative;
    z-index: 1;
    color: #fff;
} */

</style>
