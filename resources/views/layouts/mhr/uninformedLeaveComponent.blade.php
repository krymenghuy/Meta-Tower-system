
<div id="_main_leave_uninformed_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_leave" class="bg-white shadow p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_uninformed_leave_search" 
                placeholder="Search by name or employee code" >
            </div>
            <div class="col-md-6 col-lg-2">
                <select id="el_work_shift" name="shifts" class="filter-field data-input" data-field="shifts"></select>
            </div>
                
            <div class="col-md-6 col-lg-2">
                <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="start_date" />
                    <label vslang="titles.Start Date" class="form-label">Start Date</label>
                </div>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="end_date" />
                    <label vslang="titles.End Date" class="form-label">End Date</label>
                </div>
            </div>
            
           <!-- <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddLeave" title="Add Uninformed Leave">
                    <i class="fa-right-from-bracket fa-solid" style="color: rgb(255, 255, 255);"></i>
                    <span vslang="buttons.Add Uninformed Leave"></span>
                </button>
            </div> -->
        </div>
    </div>
    <div id="_leave_uninformed_list" class="mt-3"></div>
</div>

<style>
</style>

