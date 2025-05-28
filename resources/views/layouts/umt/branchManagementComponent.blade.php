<style>
    .btn-action{
        min-width:83px;
    }
</style>

<div id="_um_branchManagementComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex mt-3 gap-3">
        <div class="input-group input-group-sm flex-nowrap width--search-inner shadow justify-content-start">
            <input type="search" class="form-control filter-field h-100" placeholder="Search branch" id="_um_search_branch"/>
            <div class="input-group-text">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
        <button id="_bm_btn_new" class="btn text-nowrap justify-content-end text-white" style="background-color:#38373a;" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class=" text-nowrap" vslang="buttons.New Branch"></span>
        </button>
        
    </div>
    <div class="d-flex justify-content-end w-100">
        <button id="_um_btn_pdf" class="d-none btn btn-sm btn-danger" type="button">
            <span class="" vslang="buttons.PDF"></span>
        </button>
    </div>
    <div class="table-responsive mt-3 table-responsive-hover">
        <div id="_branch_container" class=""></div>
    </div>
    <div class="py-2" id="container_pagination_um"></div>
</div>

<div class="modal fade" id="dlg_um_" tabindex="-1" aria-labelledby="dlg_um_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close"  data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer border-top-0">
                <button id="dlg_um_btn_close" type="button" class="btn btn-sm btn-secondary rounded-5" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_um_btn_save" type="button" class="btn btn-sm btn-primary rounded-5">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>