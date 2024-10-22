<div id="_main_employee_benefit_component" class="pt-2">
    <!-- Search and Filters -->
    <div id="_benefit_top">
        <div id="_group_btns">
            <div id="_top_btn_action">
                <button class="bonus btn-success">Bonuses</button>
                <button class="seniority">Seniorities</button>
            </div>

            <div id="_search_benefits">
                <input type="text" id="_search_benefit" placeholder="Search benefit here ........." aria-label="Search">
            </div>
        </div>
    </div>

    <!-- Filters and Actions -->
    <div id="_benefit_center">
        <div>
            <button class="_benefit_center_left btn-success" id="_btn_add_benefit"><i class="fas fa-plus"></i> Add Benefit</button>
        </div>
        <div class="_benefit_center_right">
            <select class="form-select benefit_type" aria-label="Benefit Type">
                <option selected>benefit types</option>
                <option value="Bonus">Bonus</option>
                <option value="Seniority">Seniority</option>
                <!-- Add other options -->
            </select>
            <button class="benefit_print btn-primary"><i class="fas fa-print"></i> Print</button>
        </div>
    </div>
    <div id="_employee_benefit_list"></div>
</div>
<style>
    #_main_employee_benefit_component {
        height: 100vh;
        width: 100%;
        background-color: #fff;
    }

    #_benefit_top {
        display: flex;
        width: 100%;
        padding: 20px;
        justify-content: space-between;
    }

    #_group_btns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    #_top_btn_action {
        display: flex;
        padding: 2px;
        width: 350px;
        gap: 5px;
        border-radius: 50px;
        border: 1px solid #ccc;
        align-items: center;
    }

    .bonus,
    .seniority {
        width: 50%;
        padding: 10px;
        border-radius: 50px;
        border: none;
    }
    #_search_benefits{
        width: 500px;
        border-radius: 50px;
    }
    #_search_benefit{
        border: 1px solid #ccc;
        width: 100%;
        padding: 10px;
        border-radius: 50px;
        outline: none;
    }
    #_benefit_center{
        display: flex;
        justify-content: flex-start;
        top: 0;
        gap: 10px;
        padding: 0px 20px 20px 20px;
        width: 100%;
        justify-content: space-between;
    }
    ._benefit_center_left{
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    #_btn_add_benefit{
        display: flex;
        width: 170px;
        border-radius: 20px;
        padding: 10px;
        border: none;
    }
    ._benefit_center_right{
        display: flex;
        width: 500px;
        gap: 5px;
        justify-content: flex-end;
    }
    .benefit_type{
        width: 250px;
        padding: 10px;
    }
    .benefit_print{
        width: 250px;
        padding: 10px;
        border-radius: 10px;
        border: none;
        color: #fff;
        text-align: center;
        cursor: pointer;
    }
    #_employee_benefit_list{
        padding: 20px;
        width: 100%;
        height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
    #_employee_benefit_list_paginator{
        display: flex;
        position: fixed;
        bottom: 0;
    }
    .choices__list{
        max-height: 320px;
        overflow-y: auto;
        margin-bottom: 30px;
        width: 100%;
    }
</style>
