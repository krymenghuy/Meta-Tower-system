<div id="_main_employee_benefit_component" style="display:none; padding: 20px;">
    <div class="d-flex justify-content-between rounded-3 pt-2">
        <div class="d-flex gap-2">
            <div class="card-header shadow border border-1 rounded-5 p-1 bg-light-gray">
                <ul class="nav nav-tabs border border-0 m-0 tab-header" id="benefit-tabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <a class="tab-button view_bonus nav-link pt-2 pb-2 border border-0 rounded-5 active" data-view="view_bonus" id="bonus-tab" data-bs-toggle="tab" data-bs-target="#bonus-pane" type="button" role="tab" aria-controls="bonus-pane" aria-selected="true">
                            Bonuses
                        </a>
                    </li>
                    <li class="nav-item" role="presentation">
                        <a class="tab-button view_seniority nav-link pt-2 pb-2 border border-0 rounded-5" data-view="view_seniority" id="seniority-tab" data-bs-toggle="tab" data-bs-target="#seniority-pane" type="button" role="tab" aria-controls="seniority-pane" aria-selected="false">
                            Seniorities
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="d-flex gap-1">
            <input type="text" class="form-control filter-field" id="_search_benefit" placeholder="Search benefit here ........." aria-label="Search">
        </div>
    </div>

    <div class="shadow rounded-3 mt-4">
        <div class="tab-content" id="benefit-tabs-content">
            <div class="tab-pane fade show active" id="bonus-pane" role="tabpanel" aria-labelledby="bonus-tab" tabindex="0">
                <div class="d-flex justify-content-between rounded-3 p-0 mt-3">
                    <div class="d-flex gap-2">
                        <button id="_btn_add_benefit" class="btn text-white" style="background-color: #16A34A;" type="button">
                            <i class="fa fa-plus"></i> Add Benefit
                        </button>
                    </div>
                    <div class="d-flex gap-2" id="_sdl_filter_fields_benefit_type">
                        <div class="d-flex flex-row gap-2 ml-3 rounded-3">
                            <select id="benefit_type" class="modal-select2 filter-field">
                                <option selected>Benefit Types</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Seniority">Seniority</option>
                            </select>
                        </div>
                        <div class="d-flex flex-row gap-2 ml-3">
                            <button id="_btn_print_benefit" class="btn btn-primary" type="button">
                                <i class="fa fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                </div>
                <div id="_bonus_list" class="mt-5"></div>
            </div>

            <div class="tab-pane fade" id="seniority-pane" role="tabpanel" aria-labelledby="seniority-tab" tabindex="0">
                <div class="d-flex justify-content-between my-3 rounded-2 p-2">
                    <button id="_btn_add_seniority" class="btn btn-primary" type="button">
                        <i class="fa fa-user-plus"></i> Add Seniority
                    </button>
                    <div class="d-flex gap-2" id="_sdl_filter_fields_seniority_type">
                        <div class="d-flex flex-row gap-2 ml-3 rounded-3">
                            <select id="seniority_type" class="modal-select2 filter-field">
                                <option selected>Benefit Types</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Seniority">Seniority</option>
                            </select>
                        </div>
                        <div class="d-flex flex-row gap-2 ml-3">
                            <button id="_btn_print_seniority" class="btn btn-primary" type="button">
                                <i class="fa fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                </div>
                <div id="_seniority_list" class="mt-3"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .nav-tabs .nav-item .nav-link.active {
        color: white;
        background-color: #16A34A;
    }

    .nav-tabs .nav-item .nav-link {
        color: #595d6e;
    }

    .modal-select2 {
        padding: 10px;
        width: 250px;
    }

    #_main_employee_benefit_component {
        height: 100vh;
        width: 100%;
    }

    #_employee_bonus_list {
        width: 100%;
        height: 425px;
    }

    .btn {
        border-radius: 10px;
        padding: 10px;
    }

    #_search_benefit {
        padding: 10px;
        border-radius: 50px;
        border: 1px solid #ccc;
        outline: none;
    }

    #_btn_add_benefit, #_btn_add_seniority {
        width: 170px;
        border-radius: 20px;
    }

    #_btn_print_benefit {
        border-radius: 10px;
        color: #fff;
    }

    .tab-content {
        padding-top: 20px;
    }
    #_employee_bonus_list_paginator{
        display: flex;
        position: fixed;
        bottom: -10px;
    }
</style>
