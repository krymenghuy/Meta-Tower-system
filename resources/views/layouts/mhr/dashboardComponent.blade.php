<div id="_main_dashboardComponent" class="px-2 mobile-padding" style="display:none;">
    <div class="dbChart_all_top mt-3 px-2" id="dbChart_all_top">
    </div>
    <div class="db_cards">
        <div class="row px-3" style="" id="db_cards">

        </div>
    </div>
    <div class="db_card_bottom" id="_db_card_bottom">


    </div>
</div>

<style>
    pre {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
    }

    code {
        height: calc(100% - 45px);
        margin-top: -20px;
    }

    .github {
        position: absolute;
        text-align: center;
        left: 0;
        right: 0;
        top: 5px;
        margin: auto;
        font-size: 0.9rem;
        text-transform: uppercase;
    }

    .github a {
        text-decoration: none;
    }

    .github a:hover {
        border-bottom: 1px solid salmon;
    }

    [data-pie-index="0"] {
        position: relative;
        border-radius: 50%;
        box-shadow: inset 0 0 25px 10px #a2caff;
    }

    [data-pie-index="1"] {
        position: relative;
        border-radius: 50%;
        box-shadow: inset 0 0 25px 10px #f2e784;
    }

    [data-pie-index="2"] {
        position: relative;
        border-radius: 50%;
        box-shadow: inset 0 0 25px 10px #a2caff;
    }

    [data-pie-index="3"] {
        position: relative;
        border-radius: 50%;
        box-shadow: inset 0 0 25px 10px #f50057;
    }

    [data-pie-index="17"] {
        position: relative;
        border-radius: 50%;
        box-shadow: inset 0 0 25px 10px #f50057;
    }


    .pie {
        width: 100px !important;
        height: 100px !important;
    }

    .pie svg {
        width: 100px;
        height: 100px;
    }

    .chart-row {
        display: flex;
        flex-direction: row;
        gap: 5px;
        min-height: 340px;
        align-items: stretch;
        /* Ensures all children are the same height */
    }

    .card-row {
        display: flex;
        flex-direction: row;
        gap: 5px;
        min-height: 200px;
        align-items: stretch;
        /* Ensures all children are the same height */
    }

    .chart-container {
        flex: 1;
        /* All DIVs get equal width */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border: 1px solid #ddd;
        /* Optional styling */
        background: #f9f9f9;
        /* Optional styling */
        height: 100%;
        /* Prevents overflow */
    }

    .card-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #dce5e5;
        padding: 10px;
        border-radius: 8px;
        height: 100%;
        /* Prevents overflow */

    }

    .dashboard_chart {

        box-shadow: 0px 0px 5px rgba(66, 66, 66, 0.255);
        align-items: center;
        background-color: #c6c6c62e;
    }

    canvas {
        max-width: 100%;
        height: auto;
        /* Maintains aspect ratio */
    }

    #_main_dashboardComponent {
        display: flex;
        flex-direction: column;
        height: 680px;
        /* background-color: #fff; */
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    /* #_main_dashboardComponent tr:hover {
        background-color: skyblue;
        cursor: pointer;
    } */
    /* .dashboard_top {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 20px;
        padding: 20px;
        background-color: #f4f4f4;
    } */



    .dashboard_center {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 20px 0px;
        gap: 1rem;
    }









    /* Icon size control */
    .img--size {
        width: 60px;
        height: 50px;
    }

    /* Card body adjustments */
    .card-body {
        padding: 1rem;
    }
</style>
