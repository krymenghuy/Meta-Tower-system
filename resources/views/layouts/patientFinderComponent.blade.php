<style>
    table#_paf_tblPatients > thead th {
        font-weight: normal;
        text-transform: uppercase;
        border-bottom: 1px solid orange;
        font-size: 0.8em;
    }

    .patient-info-wrapper {
        padding: 10px;
        border-left: 1.5px dotted red;
        border-right: 1.5px dotted red;
    }
</style>

<div id="_main_patientFinderComponent" style="display:none">
    <div class="container-fluid">
        <div class="d-flex justify-content-between" style="padding:10px">
            <div class="d-flex col-md-6">
                <button class="btn btn-primary gap-0" id="_paf_btnNew">
                    <i class="fa-solid fa-plus" style="margin-right:-7px"></i>
                    <span class="trans-text ms-0 ps-0" data-langprop="buttons.Add New"></span>
                </button>
                <input id="_apl_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search patient"/>
                <a id="_apl_btnSearch" class="vs-btn-round vs-btn-success" href="javascript:void(0)">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </a>
            </div>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase" id="_paf_tblPatients" style="margin-top:-25px !important"></table>
        </div>
    </div>
</div>