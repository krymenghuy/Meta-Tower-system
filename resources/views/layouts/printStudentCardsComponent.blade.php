<div id="_main_printStudentCardComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-block p-3 bg-white rounded-4">
        <p class="trans-text fs-5" data-langprop="titles.Filter Class to Printing"></p>
        <div class="row row-cols-lg-4">
            <div class="col">
                <div class="form-group">
                    <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <select class="modal-select2 form-control data-input" data-field="campus"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="type" class="form-label trans-text" data-langprop="titles.Type"></label>
                    <select class="modal-select2 form-control data-input" data-field="type"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <select class="modal-select2 form-control data-input" data-field="class"></select>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                    <select class="modal-select2 form-control data-input" data-field="section"></select>
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