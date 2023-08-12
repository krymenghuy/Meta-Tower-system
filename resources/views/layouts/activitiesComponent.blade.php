<div id="_main_activitiesComponent" class="mobile-padding p-3" style="display:none">
    <div class="bg-white p-3 rounded-4">
        <div class="row row-cols-lg-4 gy-2">
            <div class="col">
                <div class="form-group">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="academic_year"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="campus"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="class"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                    <div class="width--filter-inner">
                        <select class="modal-select2 data-input" data-field="section"></select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3">
        <div id="div_att_hasList" class="div--att-hasList">
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary position-relative" type="button">
                    <i class="fa-solid fa-caret-down"></i>
                    <span class="trans-text" data-langprop="buttons.Activities"></span>
                    <div class="att-dropdown position-absolute shadow rounded-3 d-none">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <div class="input-group-text">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                    <input type="search" class="form-control form-control-sm" placeholder="Search..."/>
                                </div>
                            </li>
                        </ul>
                    </div>
                </button>
                <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
            </div>
            <div id="div_att_list" class="table-responsive mt-3 p-3 rounded-3 bg-white"></div>
        </div>
    </div>
</div>