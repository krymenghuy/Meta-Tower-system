<div id="_main_service_request_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_service_request" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_service_request" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_service_request_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_service_request_type_id" class="data-input filter-field form-control" data-field="service_type_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnServiceRequest">
                        <i class="fa-solid fa-gears mr-2"></i>
                    <span vslang="buttons.Create Request"></span>
                </button>
            </div>
        </div>
    </div>


    <div id="_space_div_summary" class="container-fluid p-3">
    <div class="row g-2">
        <div class="col-12 col-sm-6 col-lg-2">
            <div class="metric-card-sm" style="border-left: 6px solid #5867dd;">
                <div class="metric-head-sm">
                    <span class="metric-dot bg-primary"></span>
                    <span>Total Units</span>
                </div>
                <div class="metric-value-sm">
                    10 <span class="trend up">+5%</span>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2">
            <div class="metric-card-sm" style="border-left: 6px solid #0abb87;">
                <div class="metric-head-sm">
                    <span class="metric-dot bg-success"></span>
                    <span>Occupancy</span>
                </div>
                <div class="metric-value-sm">
                    92.4% <span class="trend down">-1.2%</span>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2">
            <div class="metric-card-sm" style="border-left: 6px solid #fd397a;">
                <div class="metric-head-sm">
                    <span class="metric-dot bg-danger"></span>
                    <span>Available</span>
                </div>
                <div class="metric-value-sm">
                    3 <span class="pill danger">High Demand</span>
                </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2">
            <div class="metric-card-sm" style="border-left: 6px solid #ffb822;">
                <div class="metric-head-sm">
                    <span class="metric-dot bg-warning"></span>
                    <span>Pending</span>
                </div>
                <div class="metric-value-sm">
                    3 <span class="pill warning">2 Expiry Soon</span>
                </div>
            </div>
        </div>

    </div>
</div>

    <div id="_service_request_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
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


</style>
