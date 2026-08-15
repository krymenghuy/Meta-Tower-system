<div id="_main_dashboardComponent" class="px-3 mobile-padding" style="display:none;">
    <div class="dbChart_all_top" id="dbChart_all_top">
    </div>
    <div class="db_cards" id="db_cards">
 
    </div>
    <div class="db_card_bottom" id="_db_card_bottom">


    </div>
</div>
<style>/* ================================
   Dashboard Layout
================================ */

.dbChart_all_top,
.db_cards,
.db_card_bottom {
    width: 100%;
}

.dashboard_chart {
    width: 100%;
    height: 100%;
    min-height: 100%;

    background: #fff;
    border: 1px solid #e9edf2;
    border-radius: 12px;

    box-shadow: 0 2px 8px rgba(66, 66, 66, 0.08);

    padding: 16px;

    display: flex;
    flex-direction: column;

    transition: all .2s ease;
}

.dashboard_chart:hover {
    box-shadow: 0 5px 16px rgba(66, 66, 66, 0.12);
    transform: translateY(-1px);
}


/* ================================
   Chart Header
================================ */

.dashboard_chart > .chart-title,
.dashboard_chart > span {
    width: 100%;
    display: block;

    margin-bottom: 10px;

    color: #2b3991;
    font-size: 15px;
    font-weight: 600;

    text-align: left;
}


/* ================================
   Chart Canvas
================================ */

.dashboard_chart canvas {
    width: 100% !important;
    max-width: 100%;

    flex: 1;
    min-height: 0;
}


/* ================================
   Small Dashboard Cards
================================ */

.card-db {
    width: 100%;
    min-height: 100px;

    background: #fff;

    border: 1px solid #edf0f4;
    border-radius: 12px;

    padding: 14px;

    display: flex;
    align-items: center;

    box-shadow: 0 2px 8px rgba(66, 66, 66, .07);

    transition: all .2s ease;
}

.card-db:hover {
    box-shadow: 0 5px 15px rgba(66, 66, 66, .12);
    transform: translateY(-1px);
}


/* ================================
   Circular Indicator
================================ */

.circular-chart {
    width: 60px;
    height: 60px;
}

.card-db .position-relative {
    flex-shrink: 0;
}


/* ================================
   Bottom Cards
================================ */

.card-container {
    width: 100%;
    height: 100%;

    background: #fff;

    border: 1px solid #e9edf2;
    border-radius: 12px;

    padding: 16px;

    box-shadow: 0 2px 8px rgba(66, 66, 66, .08);

    display: flex;
    flex-direction: column;
}


/* ================================
   Tables
================================ */

.dashboard-table {
    width: 100%;
    overflow: auto;

    border: 1px solid #edf0f3;
    border-radius: 8px;
}

.dashboard-table table {
    width: 100%;
    margin-bottom: 0;
}

.dashboard-table thead {
    position: sticky;
    top: 0;
    z-index: 2;

    background: #fff;
}

.dashboard-table th {
    color: #2b3991;
    font-size: 12px;
    font-weight: 600;

    white-space: nowrap;
}

.dashboard-table td {
    font-size: 12px;
    vertical-align: middle;
}


/* ================================
   Payroll / Wallet Summary
================================ */

.dashboard-summary {
    width: 100%;

    display: flex;
    align-items: center;

    padding: 10px;

    margin-bottom: 10px;

    background: #fff;

    border: 1px solid #edf0f3;
    border-radius: 10px;

    box-shadow: 0 1px 5px rgba(0,0,0,.05);
}

.dashboard-summary-chart {
    width: 90px;
    height: 90px;

    flex-shrink: 0;
}

.dashboard-summary-content {
    flex: 1;
    padding-left: 12px;
}


/* ================================
   Icon
================================ */

.bg--icon {
    width: 52px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #f3f6fa;

    border-radius: 10px;

    flex-shrink: 0;
}

.img--size {
    width: 38px;
    height: 38px;

    object-fit: contain;
}
.dashboard-movement-card {
    display: flex;
    align-items: center;

    padding: 10px;

    background: #f8fafc;

    border: 1px solid #edf0f3;
    border-radius: 10px;

    transition: all .2s ease;
}

.dashboard-movement-card:hover {
    background: #fff;
    box-shadow: 0 3px 10px rgba(0,0,0,.06);
}


/* ================================
   Responsive
================================ */

@media (max-width: 991.98px) {

    .dashboard_chart {
        min-height: 320px;
    }

 

}

@media (max-width: 767.98px) {

    .dashboard_chart {
        min-height: 280px;
        padding: 12px;
    }



    .card-db {
        min-height: 90px;
    }

}</style>

<!-- <style>
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
    }

    .card-row {
        display: flex;
        flex-direction: row;
        gap: 5px;
        min-height: 200px;
        align-items: stretch;
    }

    .chart-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border: 1px solid #ddd;
        background: #f9f9f9;
        height: 100%;
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

    }


    .dashboard_chart {
        box-shadow: 0 2px 8px rgba(66, 66, 66, 0.12);
        align-items: center;
        background-color: #ffffff;
        border: 1px solid #eef0f2;
        border-radius: 12px;
        overflow: hidden;
    }

    canvas {
        max-width: 100%;
        height: auto;
    }

    .img--size {
        width: 60px;
        height: 50px;
    }

    /* Card body adjustments */
    .card-body {
        padding: 1rem;
    }
</style> -->
