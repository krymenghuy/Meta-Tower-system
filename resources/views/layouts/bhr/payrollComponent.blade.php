<div id="_main_payrollComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-4" id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2 ">
            <div class="w-50">
                <input type="text" class="form-control filter-field d-flex p-2" id="_sdl_search_payroll"
                    placeholder="Search Payroll" />
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-25">
                <select type="id" id="el_authorized" class="data-input filter-field"
                    data-field="authorized"></select>
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-25">
                <select type="id" id="el_disbursed" class="data-input filter-field"
                    data-field="disbursed"></select>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50 text-nowrap">
            <button type="button" class="btn btn-primary" id="_btnAddpayroll">
                <i class="fas fa-plus"></i>
                <span>Add Payroll</span>
            </button>
        </div>

    </div>
    <div id="_payroll_list" class="m-4"></div>
</div>

<style>
    #_payroll_list{
        height: 520px;
        padding-bottom: 60px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }
    #_payroll_list_paginator {
        bottom: 0;
        display: flex;
        position: fixed;
    }
    th,
    td {
        padding: 10px;
        vertical-align: middle;
        text-align: left;
        overflow: hidden;
        white-space: wrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 100px;
    }
</style>
