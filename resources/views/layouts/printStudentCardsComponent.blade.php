<div id="_main_printStudentCardComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-block p-3 bg-white rounded-3">
        <p class="trans-text fs-5" data-langprop="titles.Filter Class to Printing"></p>
        <div id="container_psc_filter" class="row row-cols-lg-4">
            <div class="col">
                <div class="form-group">
                    <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="campus_id"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="type" class="form-label trans-text" data-langprop="titles.Type"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="type"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="level_id"></select>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="session_id"></select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-3">
        <div class="div-cardStudent-empty">
            <div class="d-flex flex-column gap-2">
                <img src="{{ asset('assets/images/icons/no-data.png') }}" alt=""/>
                <p class="trans-text" data-langprop="titles.No Data Display"></p>
            </div>
        </div>
        <div class="div-cardStudent-hasData"></div>
    </div>
</div>