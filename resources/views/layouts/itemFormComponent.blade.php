<style>
    #_main_itemFormComponent .simple-label {
        font-size: 0.8em;
        text-transform: uppercase;
    }

    .vs-card {
        padding: 15px;
        margin: 15px !important;
        width: 100%;
        border-color: grey !important;
    }

    input.solid-check[type="checkbox"] {
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
        margin: 0;
    }

    input.solid-check[type="checkbox"] {
        appearance: none;
        background-color: #fff;
        margin: 0;
        font: inherit;
        color: currentColor;
        width: 1.15em;
        height: 1.15em;
        border: 0.15em solid currentColor;
        border-radius: 0.15em;
        transform: translateY(-0.075em);
    }

    .form-control+.form-control {
        margin-top: 1em;
    }

    input.solid-check[type="checkbox"] {
        display: grid;
        place-content: center;
    }

    input.solid-check[type="checkbox"] {
        display: grid;
        place-content: center;
    }

    input.solid-check[type="checkbox"]::before {
        content: "";
        width: 0.65em;
        height: 0.65em;
        transform: scale(0);
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em var(--form-control-color);
    }

    input.solid-check[type="checkbox"]:checked::before {
        transform: scale(1);
    }

    input.solid-check[type="checkbox"]::before {
        background-color: CanvasText;
    }

    .checkbox-label {
        font-weight: bold;
        font-size: 1.1em;
        margin-left: 5px;
    }
</style>

<div id="_main_itemFormComponent" class="mobile-padding" style="display:none">
    <div style="width:100%">
        <div id="_itemform_general_info" class="card vs-card">
            <div class="row">
                <div class="form-group col-lg-12">
                    <div class="form-inline" id="_itemform_div_itemtype">
                        <span class="form-inline">
                            <input type="checkbox" class="solid-check checkbox m-checkbox">
                            <span class="checkbox-label">Good</span>
                        </span>
                        <div style="width:25px"></div>
                        <span class="form-inline">
                            <input type="checkbox" class="solid-check checkbox m-checkbox">
                            <span class="checkbox-label">Service</span>
                        </span>
                    </div>
                </div>
                <div class="form-group col-lg-3">
                    <span class="simple-label">Name</span>
                    <div>
                        <input type="text" data-ffield="name" data-field="name" data-required="1" class="form-control data-input">
                    </div>
                </div>
                <div class="form-group col-lg-3">
                    <span class="simple-label">Item Group</span>
                    <div>
                        <select type="text" data-field="group_id" data-ffield="Item Group" data-datatype="number" data-required="1" class="modal-select2 data-input"></select>
                    </div>
                </div>
                <div class="form-group col-lg-3">
                    <span class="simple-label">Category</span>
                    <div>
                        <select type="text" data-field="cat_id" data-ffield="category" data-datatype="number" data-required="1" class="modal-select2 data-input"></select>
                    </div>
                </div>
                <div class="form-group col-lg-3">
                    <span class="simple-label">Detailed Type</span>
                    <div>
                        <select type="text" data-field="detail_type_id" data-ffield="detailed type" data-datatype="number" data-required="1" class="modal-select2 data-input"></select>
                    </div>
                </div>
                <div class="form-group col-lg-12">
                    <span class="simple-label">Description</span>
                    <div>
                        <input type="text" data-ffield="description" data-field="description" data-datatype="string" data-required="1" class="form-control data-input">
                    </div>
                </div>
            </div>
        </div>
        <div style="width:100%;margin-top:10px">
            <div class="card vs-card">
                <h5>Purchase Information</h5>
                <div id="_itemform_purchase_info">
                    <div class="row">
                        <div class="form-group col-lg-5">
                            <span class="simple-label">
                                Cost price
                                &nbsp;
                                <a id="_itemform_lnkNewOrg" href="javascript:void(0)">View History</a>
                            </span>
                            <div>
                                <input type="number" class="form-control data-input">
                            </div>
                        </div>
                        <div class="form-group col-lg-4">
                            <span class="simple-label">Cost Account</span>
                            <div>
                                <select class="modal-select2 data-input"></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="width:100%;position:fixed;bottom:15px">
            <div class="form-inline" style="float:left;margin-left:7vw">
                <button id="_itemform_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px">
                    <i class="fa fa-times"></i>
                    Close
                </button>
                &nbsp;
                <button id="_itemform_btnSave" type="button" class="vs-btn-lg vs-btn-primary" style="min-width:100px">
                    <i class="fa fa-save"></i>
                    Save
                </button>
                &nbsp;
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dlgNewOrg" tabindex="-1" role="dialog" aria-labelledby="dlgCategoryTitle" aria-hidden="true">
    <div class="modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <img src="{{ asset('/assets/images/icons/category_icon.png') }}" style="width:38px">
                &nbsp;
                <h5 class="modal-title" id="dlgCategoryTitle">New Category</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Organization Name</span>
                        <div>
                            <input id="_new_org_name" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Organization Type</span>
                        <div>
                            <select id="_new_org_type" type="text" class="modal-select2">
                                <option value="0">Inspecific</option>
                                <option value="1">Private Sector</option>
                                <option value="2">Public Sector / Government</option>
                                <option value="3">Non-Government / NGOs</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-12">
                        <span class="simple-label">Industry</span>
                        <div>
                            <select id="_new_org_industry" type="text" class="modal-select2"></select>
                        </div>
                    </div>
                    <div>
                        <span style="margin-left:15px" id="dlgNewOrg_error" class="error_text"></span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">
                        <i class="fa fa-times"></i>
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary" id="dlgNewOrg_btnOK">
                        <i class="fa fa-check"></i>
                        Create
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="{{ asset('js/ItemFormComponent.js') }}"></script>