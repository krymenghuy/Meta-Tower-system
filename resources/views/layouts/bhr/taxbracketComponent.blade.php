<div id="_main_taxBracketComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-4 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddTaxBracket">
                <i class="fas fa-plus"></i>
                <span>Add Tax Bracket</span>
            </button>
        </div>
    </div>
    <div id="_taxBracket_list" class="m-4"></div>
</div>
<style>
    #_taxBracket_list_paginator {
        bottom: 0;
    }
    #_taxBracket_list{
        height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
</style>
