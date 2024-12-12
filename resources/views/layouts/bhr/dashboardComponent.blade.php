<div id="_main_dashboardComponent" style="display:none;">
    <div class="dbChart_all_top mt-3 px-2" id="dbChart_all_top">
    </div>
    <div class="db_cards">
        <div class="row px-3 pb-3" style="" id="db_cards">
        </div>
    </div>
    <!-- <div class="dashboard_center" id="_dashboard_center">
    </div> -->
    <div class="dashboard_bottom" id="_dashboard_bottom">
        <div class="bottom_left" id="_db_card_onLeave">
        </div>
    </div>
</div>

<style>
    .l-bg-cherry {
    background: linear-gradient(to right, #493240, #f09) !important;
    color: #fff;
}

    .chart-row {
    display: flex;
    flex-direction: roe;
    gap: 5px;
    min-height: 340px;
    align-items: stretch; /* Ensures all children are the same height */
}

.chart-container {
    flex: 1; /* All DIVs get equal width */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd; /* Optional styling */
    background: #f9f9f9; /* Optional styling */
    height: 100%; /* Prevents overflow */
}
.dashboard_chart {
        
        box-shadow: 0px 0px 5px rgba(66, 66, 66, 0.255);
        align-items: center;
        background-color: #c6c6c62e;
    }

canvas {
    max-width: 100%;
    height: auto; /* Maintains aspect ratio */
}
    
    #_main_dashboardComponent {
        display: flex;
        flex-direction: column;
        height: 550px;
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



    .bottom_left {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #dce5e5;
        width: 50%;
        height: 300px;
        padding: 10px;
        border-radius: 8px;
    }

    .dashboard_bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 20px;

    }


   
/* Icon size control */
.img--size {
    width: 40px;
    height: 40px;
}

/* Card body adjustments */
.card-body {
    padding: 1rem;
}






</style>
