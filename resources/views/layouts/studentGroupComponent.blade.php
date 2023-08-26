<div id="_main_studentGroupComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 bg-white rounded-3">
        <div class="d-flex flex-row justify-content-between">
           <div class="d-flex flex-row gap-2">
                <div class="width-select-dialog">
                    <select id="_sdg_filter_term" class="modal-select2"></select>
                </div>
                <div class="width-select-dialog">
                    <select id="_sdg_filter_program" class="modal-select2"></select>
                </div>
                <div class="width-select-dialog">
                    <select id="_sdg_filter_session" class="modal-select2"></select>
                </div>
           </div>
           <button id="_sdg_btn_new" class="btn btn-primary btn-sm" type="button">
               <i class="fa-solid fa-plus"></i>
               <span class="trans-text" data-langprop="buttons.Add Group"></span>
           </button>
       </div>

    </div>
    <div id = "div_group_list" class="p-3 mt-3 rounded-3 bg-white">
    </div>
</div>

<div id="dlg_sdg_" class="modal fade" tabindex="-1" aria-labelledby="dlg_sdg_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
               <div class="row">
                        <div class="form-group col-lg-6">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Group Name"></label>
                            <input type="text" data-required="false" class="form-control data-input" data-field="descriptive_name"/>
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Strict Name"></label>
                            <input id="dlg_sdg_name" type="text" data-required="false" class="form-control data-input" data-field="name" readonly placeholder="AUTO"/>
                        </div>

                        <div class="form-group col-lg-4">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_campus" class="modal-select2 data-input" data-field="campus_shortcut"></select>
                            </div>
                        </div>

                        <div class="form-group col-lg-4">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_academic_year" class="modal-select2 data-input" data-field="academic_year"></select>
                            </div>
                        </div>

                        <div class="form-group col-lg-4">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Semester"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_term" class="modal-select2 data-input" data-field="term_id"></select>
                            </div>
                        </div>
        
                        <div class="form-group col-lg-6">
                            <label for="dlg_sdg_program" class="form-label trans-text" data-langprop="titles.Program"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_program" class="modal-select2 data-input" data-field="program_id"></select>
                            </div>
                        </div>
                        <div class="form-group col-lg-6">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Level"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_level" class="modal-select2 data-input" data-field="level_id"></select>
                            </div>
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                            <div class="width-select-dialog">
                                <select id="dlg_sdg_session" class="modal-select2 data-input" data-field="session_shortcut"></select>
                            </div>
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="" class="form-label trans-text" data-langprop="titles.Checkin Time"></label>
                            <div class="width-select-dialog">
                               <input type="time" class="form-control data-input" data-field="checkin_time"/>
                            </div>
                        </div>
                        <div class="form-group col-lg-6">
                            <label for="level_id" class="form-label trans-text" data-langprop="titles.Checkout Time"></label>
                            <div class="width-select-dialog">
                                <input type="time" class="form-control data-input" data-field="checkout_time"/>
                            </div>
                        </div>
                        <div class="form-group col-lg-12">
                            <label for="remarks" class="form-label trans-text" data-langprop="titles.Remarks"></label>
                            <input  type="text" data-required="false" class="form-control data-input" data-field="remarks"/>
                        </div>
               </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_sdg_btn_save" class="btn btn-primary btn-sm" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>