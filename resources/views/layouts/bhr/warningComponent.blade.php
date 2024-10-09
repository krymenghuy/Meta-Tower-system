<div id="_main_warningComponent" style="display:none;padding:20px 0 0">
    <div class="warning_top">
        <div class="search">
            <input class="filter-field" type="text" id="_warning_search" placeholder="Search Warning Here ........">
        </div>
        <div class="top_actions">
            <div class="btnAddWarning" data-bs-toggle="modal" data-bs-target="#addWarningModal" id="_btnAddWarning">
                <i class="fa fa-plus"></i>Add Warning
            </div>
            <div class="btnExportWarning"><i class="fa fa-download"></i>Export Warning</div>
        </div>
    </div>
    <div id="_warning_list"></div>
</div>

<style>
    #_main_warningComponent {
        /* padding: 40px 20px; */
    }

    #_warning_list {
        max-width: 100%;
        margin: 15px;
    }

    .warning_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px;
    }

    #_warning_search {
        width: 500px;
        padding: 10px 20px;
        border-radius: 20px;
        border: 1px solid #ccc;
        background-color: #fff;
        display: flex;
        align-items: center;
        outline: none;
        gap: 10px;
    }

    .top_actions {
        display: flex;
        align-items: center;
        margin-right: 5px;
        gap: 20px;
    }

    .btnAddWarning,
    .btnExportWarning {
        padding: 10px 20px;
        background-color: #2b5f92;
        color: #fff;
        border: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .btnAddWarning:hover,
    .btnExportWarning:hover {
        background-color: #2989b8;
    }

    .warning_header {
        display: grid;
        grid-template-columns: 1.5fr 1fr 2fr 1fr 1fr 50px;
        padding: 10px 20px;
        margin-top: 10px;
        border-bottom: 1px solid #ccc;
        background-color: #2B3992;
        border-radius: 10px;
        color: #fff;
    }

    .warning_header .name {
        margin-left: 0px;
    }

    .warning_header .position {
        margin-left: 5px;
    }

    .warning_header .promises {
        margin-left: -5px;
    }

    .warning_header .date {
        margin-left: -10px;
    }

    .warning_header .name:hover,
    .warning_header .position:hover,
    .warning_header .issues:hover,
    .warning_header .promises:hover,
    .warning_header .warning:hover {
        color: rgb(243, 219, 0);
        text-decoration: underline;
        transition: color 0.3s ease-in-out;
        cursor: pointer;
    }
</style>
