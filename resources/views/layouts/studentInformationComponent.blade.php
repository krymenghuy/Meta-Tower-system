<div id="_main_studentInformationComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2">
        <div class="height-select2">
            <select id="el_sin_filter" class="modal-select2"></select>
        </div>
        <input type="search" id="el_sin_search" class="form-control width--search-inner"/>
        <button class="btn btn-sm btn-primary" type="button">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="trans-text" data-langprop="buttons.Find"></span>
        </button>
    </div>
    <div id="tbl--sin" class="table-responsive mt-3 p-3 rounded-3 bg-white table-responsive-hover"></div>
</div>

<div class="modal fade" id="dlg_sin_" tabindex="-1" aria-labelledby="dlg_sin_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Modify Student Info"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-4">
                        <div class="image-dialog-container">
                            <div id="dlg_sin_choose_image" class="dlg-sin-clickable">
                                <i class="fa-regular fa-image fs-2 text-muted"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="form-group">
                            <label for="name_kh" class="form-label trans-text" data-langprop="titles.Name (KH)"></label>
                            <input type="text" class="form-control data-input" data-field="name_kh"/>
                        </div>
                        <div class="form-group">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                            <input type="text" class="form-control data-input" data-field="name"/>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-lg-2 gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="sex" class="form-label trans-text" data-langprop="titles.Sex"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input" data-field="sex">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="date_of_birth" class="form-label trans-text" data-langprop="titles.Date Of Birth"></label>
                            <input data-select="datepicker" class="form-control data-input" data-field="date_of_birth"/>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-lg-2 gy-2">
                    <div class="col">
                        <div class="form-group">
                            <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                            <input type="text" class="form-control data-input" data-field="phone_number"/>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                            <input type="email" class="form-control data-input" data-field="email"/>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                    <textarea class="form-control data-input" data-field="address"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="titles.Cancel"></span>
                </button>
                <button id="dlg_sin_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="titles.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dlg_sin_audio" tabindex="-1" aria-labelledby="dlg_sin_audio_title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>