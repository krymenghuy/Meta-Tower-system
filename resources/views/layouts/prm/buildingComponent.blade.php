<div id="_main_building_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_building" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_building" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnAddBuilding">
                   <i class="fa-regular fa-building"></i>
                    <span vslang="buttons.Create Building"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_summary_cards" class="mt-3 rounded-2 "></div>
    <div id="_building_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>

</div>
<style>

    .tbl_list_floor thead th {
    font-weight: 600;
    color: #1A1647 !important;
    background-color: #e9eaea !important;


}

.tbl_list_floor tbody td {
    vertical-align: middle;
}

.tbl_list_floor tbody tr:hover {
    background-color: #f8f9fa;
}
</style>
