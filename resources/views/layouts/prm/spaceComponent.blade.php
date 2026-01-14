<div id="_main_space_component" class="mobile-padding p-3" style="display:none;">
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
                <select id="floor_number" class="data-input filter-field form-control" data-field="floor_number"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_space_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnSpace">
                    <i class="fa fa-user-plus me-2"></i>
                    <span vslang="buttons.Create Space"></span>
                </button>
            </div>
        </div>
    </div> 
    <div class="container-fluid rounded-2 bg-white shadow-sm">
        <div class="row mt-3 pb-3 g-3">
        <div class="col-12 col-sm-6 col-lg-2">
            <div class="stat-card">
            <p class="stat-label">Total Units</p>
            <div class="d-flex align-items-baseline gap-2">
                <p class="stat-value">450</p>
                <p class="stat-up">+5%</p>
            </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2">
            <div class="stat-card">
            <p class="stat-label">Occupancy Rate</p>
            <div class="d-flex align-items-baseline gap-2">
                <p class="stat-value">92.4%</p>
                <p class="stat-down">-1.2%</p>
            </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2">
            <div class="stat-card">
            <p class="stat-label">Vacant Units</p>
            <div class="d-flex align-items-baseline gap-2">
                <p class="stat-value">34</p>
                <p class="badge badge-demand">High Demand</p>
            </div>
            </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-2">
            <div class="stat-card">
            <p class="stat-label">Pending Leases</p>
            <div class="d-flex align-items-baseline gap-2">
                <p class="stat-value">12</p>
                <p class="text-warning small fw-semibold">8 Expiring Soon</p>
            </div>
            </div>
        </div>
        </div>
    </div>

    <div id="_space_list" class="mt-3 px-3"></div>
</div>
 <style>
 .stat-card {
  background: #f5f5f5;
  border: 1px solid #dce0e5;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
}

.stat-label {
  font-size: .85rem;
  font-weight: 500;
  color: #637588;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111418;
  margin: 0;
}

.stat-up { color: #078838; font-size: .75rem; font-weight: 700; }
.stat-down { color: #e73908; font-size: .75rem; font-weight: 700; }

.badge-demand {
  background: #e6f4ea;
  color: #1e7e34;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 6px;
  border-radius: 6px;

}

.filter-card {
  background: #fff;
  border: 1px solid #dce0e5;
  border-radius: 12px;
  padding: 16px;
}

.filter-group {
  background: #f1f3f5;
  padding: 4px;
  border-radius: 8px;
}

.filter-group .btn {
  border: none;
  font-size: .75rem;
  font-weight: 600;
}

.filter-group .btn.active {
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.1);
}

.filter-input {
  background: #f1f3f5;
  border: none;
  font-size: .8rem;
  font-weight: 500;
}

.filter-input:focus {
  background: #fff;
  box-shadow: 0 0 0 .15rem rgba(17,20,24,.15);
}

.search-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.divider {
  width: 1px;
  height: 24px;
  background: #dee2e6;
}

.status-select {
  background: #f1f3f5;
  border: none;
  font-size: .75rem;
  font-weight: 600;
}
.unit-card {
  background: #fff;
  border: 1px solid #dce0e5;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,.05);
  transition: box-shadow .2s;
}

.unit-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}

.unit-name { font-size: 1rem; font-weight: 700; }
.unit-floor { color: #637588; }

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

</style>