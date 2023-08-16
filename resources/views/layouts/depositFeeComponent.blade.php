<div id="_main_depositFeeComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2 bg-white rounded-3 p-3">
        <button id="dpf_btn_new" class="btn btn-sm btn-primary" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.New Deposit"></span>
        </button>
        <input id="_dpf_elSearch" type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
    </div>
    <div class="table-responsive mt-3 p-3 bg-white rounded-3">
        <table id="tbl_dpf_" class="table"></table>
    </div>
</div>

<div id="dlg_dpf" class="modal fade" tabindex="-1" aria-labelledby="dlg_dpf_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
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
                <div id="dpf-new-student" class="dpf-new-student">
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 data-input" data-field="campus_id"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 data-input" data-field="level_id"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="session" class="form-label trans-text" data-langprop="titles.Session"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 data-input" data-field="session_id"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="student_name" class="form-label trans-text" data-langprop="titles.Student Name"></label>
                                <input type="text" class="form-control data-input" data-field="student_name"/>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="date_of_birth" class="form-label trans-text" data-langprop="titles.Date of Birth"></label>
                                <input data-select="datepicker" class="form-control data-input" data-field="date_of_birth"/>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="expire_date" class="form-label trans-text" data-langprop="titles.Expire Date"></label>
                                <input data-select="datepicker" class="form-control data-input" data-field="expire_date"/>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="parent_phone" class="form-label trans-text" data-langprop="titles.Parent Phone"></label>
                                <input type="text" class="form-control data-input" data-field="parent_phone"/>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="amount" class="form-label trans-text" data-langprop="titles.Amount"></label>
                                <input type="number" class="form-control data-input" data-field="amount"/>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="note" class="form-label trans-text" data-langprop="titles.Note"></label>
                        <textarea class="form-control data-input" data-field="note"></textarea>
                    </div>
                </div>
                <div id="dpf-old-student" class="dpf-old-student" style="display:none">
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="student_id" class="form-label trans-text" data-langprop="titles.Student Name"></label>
                                <div class="width-select-dialog">
                                    <select id="dlg_dpf_student" class="modal-select2 data-input tr-select" data-field="student_id"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 data-input" data-field="campus_id"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 data-input" data-field="level_id"></select>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 data-input" data-field="session_id"></select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="date_of_birth" class="form-label trans-text" data-langprop="titles.Date of Birth"></label>
                                <input data-select="datepicker" class="form-control data-input" data-field="date_of_birth"/>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="expire_date" class="form-label trans-text" data-langprop="titles.Expire Date"></label>
                                <input data-select="datepicker" class="form-control data-input" data-field="expire_date"/>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="parent_phone" class="form-label trans-text" data-langprop="titles.Parent Phone"></label>
                                <input type="text" class="form-control data-input" data-field="parent_phone"/>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="amount" class="form-label trans-text" data-langprop="titles.Amount"></label>
                                <input type="number" class="form-control data-input" data-field="amount"/>
                            </div>
                        </div>
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
                <button id="dlg_dpf_btn_save" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>