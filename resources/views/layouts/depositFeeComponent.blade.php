<div id="_main_depositFeeComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2">
        <button class="btn btn-sm btn-primary btn--new" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.New Deposit"></span>
        </button>
        <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
    </div>
    <div class="table-responsive mt-3 p-3">
        <table class="table tbl_dpf"></table>
    </div>
</div>

<div id="dlg__dpf" class="modal fade" tabindex="-1" aria-labelledby="dlg__dpf_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-block">
                    <h5 class="modal-title"></h5>
                    <small class="modal-title--sm"></small>
                </div>
                <button class="btn-close" aria-label="Close" type="button" data-dismiss="modal"></button>
            </div>
            <div class="div--tab d-flex gap-2">
                <div class="div--tab-inner p-2">
                    <a href="javascript:void(0)" class="btn-tab" data-name="new">
                        <span class="trans-text" data-langprop="titles.New Student"></span>
                    </a>
                </div>
                <div class="p-2">
                    <a href="javascript:void(0)" class="btn-tab" data-name="old">
                        <span class="trans-text" data-langprop="titles.Old Student"></span>
                    </a>
                </div>
            </div>
            <div class="modal-body">
                <div class="dpf-new-student">
                    <div class="form-group">
                        <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                        <select class="modal-select2 form-control data-input" data-field="campus"></select>
                    </div>
                    <div class="form-group">
                        <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                        <select class="modal-select2 form-control data-input" data-field="class"></select>
                    </div>
                    <div class="form-group">
                        <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                        <select class="modal-select2 form-control data-input" data-field="section"></select>
                    </div>
                    <div class="form-group">
                        <label for="student_name" class="form-label trans-text" data-langprop="titles.Student Name"></label>
                        <input type="text" class="form-control data-input" data-field="student_name"/>
                    </div>
                    <div class="form-group">
                        <label for="parent_phone" class="form-label trans-text" data-langprop="titles.Parent Phone"></label>
                        <input type="text" class="form-control data-input" data-field="parent_phone"/>
                    </div>
                    <div class="form-group">
                        <label for="amount" class="form-label trans-text" data-langprop="titles.Amount"></label>
                        <input type="number" class="form-control data-input" data-field="amount"/>
                    </div>
                    <div class="form-group">
                        <label for="note" class="form-label trans-text" data-langprop="titles.Note"></label>
                        <textarea class="form-control data-input" data-field="note"></textarea>
                    </div>
                </div>
                <div class="dpf-old-student" style="display:none">
                    <div class="form-group">
                        <label for="student_name" class="form-label trans-text" data-langprop="titles.Student Name"></label>
                        <select class="modal-select2 form-control data-input tr-select" data-field="student_name"></select>
                    </div>
                    <div class="form-group">
                        <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                        <select class="modal-select2 form-control data-input" data-field="campus"></select>
                    </div>
                    <div class="form-group">
                        <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                        <select class="modal-select2 form-control data-input" data-field="class"></select>
                    </div>
                    <div class="form-group">
                        <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                        <select class="modal-select2 form-control data-input" data-field="section"></select>
                    </div>
                    <div class="form-group">
                        <label for="parent_phone" class="form-label trans-text" data-langprop="titles.Parent Phone"></label>
                        <input type="text" class="form-control data-input" data-field="parent_phone"/>
                    </div>
                    <div class="form-group">
                        <label for="amount" class="form-label trans-text" data-langprop="titles.Amount"></label>
                        <input type="number" class="form-control data-input" data-field="amount"/>
                    </div>
                    <div class="form-group">
                        <label for="note" class="form-label trans-text" data-langprop="titles.Note"></label>
                        <textarea class="form-control data-input" data-field="note"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-sm btn-primary btn--save" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>