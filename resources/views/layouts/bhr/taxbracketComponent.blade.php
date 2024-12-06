<div id="_main_taxBracketComponent" style="display:none;padding:20px">
    <div class="d-flex py-3 mt-3 shadow rounded-3  justify-content-between w-100 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start px-3 w-100">
            <button type="button" class="btn_add" id="_btnAddTaxBracket">
                <span>Create Tax Bracket</span>
            </button>
        </div>
    </div>
    <div id="_taxBracket_list" class="mt-4"></div>
</div>
<style>
    #_taxBracket_list_paginator {
        bottom: 0;
    }
    #_taxBracket_list{
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        max-height: 500px;
    }
</style>
