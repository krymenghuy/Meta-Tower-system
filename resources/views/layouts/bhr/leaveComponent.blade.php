<div id="_main_leave_component" style="display:none;padding:20px 0 0;">
    <div id="_divFilter_leave">
        <div class="d-flex w-100 gap-2 p-2">
            <div class="d-flex px-3 w-50">
                <button type="button" style="background-color:#2b3991; color:white;" class="btn " id="_btnAddLeave">
                    <!-- <i class="fas fa-plus"></i> -->
                    <span>Leave Request</span>
                </button>
            </div>
            <div class="d-flex justify-content-end gap-3 w-50">
                <div class="d-flex align-items-center w-50">
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="start_date" placeholder="Start Date" id="_leave_filter_start_date" />
                </div>
                <div class="d-flex align-items-center w-50">
                    <input data-select="datepicker" class="form-control filter-field rounded-5" data-field="end_date" placeholder="End Date" id="_leave_fliter_end_date" />
                </div>
            
            </div>
           
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100 p-3">
                <div class="d-flex w-50">
                    <div class="d-flex align-items-center w-50">
                        <input type="text" class="form-control filter-field rounded-5" id="_sdl_search_leave" placeholder="Search">
                    </div>
                </div>
                <div class="d-flex justify-content-end  w-50">
                    <div class="d-flex align-items-center w-25 gap-2">
                        <select id="el_status" class="data-input filter-field " data-field="status"></select>
                    </div>
                    <!-- <div class="d-flex align-items-center w-50 gap-2">
                        <select id="el_leave_type" class="data-input filter-field " data-field="leave_type"></select>
                    </div> -->
                
                </div>
               
            
            
        </div>
    </div>
    <div class="shadow mt-2 overflow-hidden">
        <div id="_leave_request_list" class="px-3"></div>
    </div>
</div>


<style>
  
</style>