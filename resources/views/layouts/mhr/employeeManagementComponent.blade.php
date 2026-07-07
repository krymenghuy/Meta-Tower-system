<div id="_main_employee_management_component" class="mobile-padding px-3" style="display:none;">
    <div id="_divFilter_employee" class="emp-mgmt-header">
        <div class="emp-mgmt-toolbar">
            <div class="emp-mgmt-controls">
                <label class="emp-mgmt-search" for="_search_employee">
                    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                    <input
                        type="text"
                        class="emp-mgmt-search__input emp-filter-control"
                        id="_search_employee"
                        data-field="search_value"
                        placeholder="Search..."
                        autocomplete="off"
                    />
                </label>

                <div class="emp-mgmt-filter">
                    <select id="_emp_branch_id" class="emp-mgmt-filter__select emp-filter-control" data-field="branch_id">
                        <option value="">All Branches</option>
                    </select>
                </div>

                <div class="emp-mgmt-filter">
                    <select id="_emp_status_id" class="emp-mgmt-filter__select emp-filter-control" data-field="status_id">
                        <option value="">All Statuses</option>
                    </select>
                </div>

                <div class="emp-mgmt-filter">
                    <select id="_emp_type_id" class="emp-mgmt-filter__select emp-filter-control" data-field="emp_type_id">
                        <option value="">All Types</option>
                    </select>
                </div>
            </div>

            <button
                type="button"
                class="emp-mgmt-fab"
                id="_btnAddEmployee"
                aria-label="Create Employee"
                title="Create Employee"
            >
                <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
            </button>
        </div>
    </div>

    <div id="_employee_list" class="table-responsive mt-3 rounded-2"></div>
    <div id="employee_container_pagination" class="px-3 d-flex justify-content-start"></div>
</div>

<style>
    #_main_employee_management_component .emp-mgmt-header {
        background: #f8f9fa;
        border: 1px solid #eceff3;
        border-radius: 16px;
        padding: 12px 14px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    }

    #_main_employee_management_component .emp-mgmt-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    #_main_employee_management_component .emp-mgmt-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1 1 auto;
        min-width: 0;
        overflow-x: auto;
        scrollbar-width: thin;
    }

    #_main_employee_management_component .emp-mgmt-controls::-webkit-scrollbar {
        height: 4px;
    }

    #_main_employee_management_component .emp-mgmt-search {
        position: relative;
        display: inline-flex;
        align-items: center;
        flex: 0 0 210px;
        min-width: 180px;
        margin: 0;
    }

    #_main_employee_management_component .emp-mgmt-search i {
        position: absolute;
        left: 14px;
        color: #94a3b8;
        font-size: 13px;
        pointer-events: none;
    }

    #_main_employee_management_component .emp-mgmt-search__input {
        width: 100%;
        height: 38px;
        padding: 0 14px 0 36px;
        border: 1px solid #e2e8f0;
        border-radius: 999px;
        background: #ffffff;
        color: #1e293b;
        font-size: 13px;
        font-weight: 500;
        outline: none;
        box-shadow: none;
    }

    #_main_employee_management_component .emp-mgmt-search__input::placeholder {
        color: #94a3b8;
        font-weight: 400;
    }

    #_main_employee_management_component .emp-mgmt-search__input:focus {
        border-color: #cbd5e1;
        box-shadow: 0 0 0 3px rgba(29, 43, 77, 0.06);
    }

    #_main_employee_management_component .emp-mgmt-filter {
        position: relative;
        flex: 0 0 auto;
    }

    #_main_employee_management_component .emp-mgmt-filter::after {
        content: "";
        position: absolute;
        right: 14px;
        top: 50%;
        width: 10px;
        height: 10px;
        transform: translateY(-50%);
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 10px;
    }

    #_main_employee_management_component .emp-mgmt-filter__select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        display: block;
        height: 38px;
        min-width: 128px;
        max-width: 150px;
        padding: 0 32px 0 14px;
        border: 1px solid #e2e8f0;
        border-radius: 999px;
        background: #ffffff;
        color: #1e293b;
        font-size: 13px;
        font-weight: 500;
        line-height: 38px;
        outline: none;
        cursor: pointer;
        box-shadow: none;
    }

    #_main_employee_management_component .emp-mgmt-filter__select:focus {
        border-color: #cbd5e1;
        box-shadow: 0 0 0 3px rgba(29, 43, 77, 0.06);
    }

    #_main_employee_management_component .emp-mgmt-fab {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        margin-left: 4px;
        border: none;
        border-radius: 50%;
        background: #1d2b4d;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 6px 16px rgba(29, 43, 77, 0.22);
        transition: background-color 0.15s ease, transform 0.15s ease;
    }

    #_main_employee_management_component .emp-mgmt-fab:hover {
        background: #152038;
        transform: translateY(-1px);
    }

    #_main_employee_management_component .emp-mgmt-fab i {
        font-size: 15px;
        line-height: 1;
    }

    @media (max-width: 1199.98px) {
        #_main_employee_management_component .emp-mgmt-toolbar {
            flex-wrap: wrap;
        }

        #_main_employee_management_component .emp-mgmt-controls {
            flex-wrap: wrap;
            overflow: visible;
        }

        #_main_employee_management_component .emp-mgmt-search {
            flex: 1 1 100%;
            max-width: none;
        }

        #_main_employee_management_component .emp-mgmt-filter__select {
            min-width: calc(50% - 4px);
            max-width: none;
        }

        #_main_employee_management_component .emp-mgmt-fab {
            margin-left: auto;
        }
    }
</style>
