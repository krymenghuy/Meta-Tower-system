<div id="_main_dashboardComponent" style="display:none;padding:20px;">
    <div class="dashboard_top" id="_dashboard_top">

    </div>


    <div class="dashboard_center" id="_dashboard_center">
    </div>

    <div class="dashboard_bottom" id="_dashboard_bottom">
        <div class="bottom_left" id="_dashboard_bottom_left">
        </div>

        <div class="bottom_right" id="_dashboard_bottom_right">
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
<script>
    const ctx = document.getElementById('empChart');
    const compareChart = document.getElementById('compareChart');
    const acc = document.getElementById('myChart');

</script>
<style>
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
        padding: 20px;
        gap: 1rem;
    }

    .bottom_left {
        box-shadow: 0px 0px 10px rgba(66, 66, 66, 0.255);
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: #E1ECF7;
        width: 50%;
        padding: 10px;
        border-radius: 20px;
    }

    .bottom_right {
        display: flex;
        box-shadow: 0px 0px 10px rgba(66, 66, 66, 0.255);
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: #E1ECF7;
        width: 50%;
        height: 270px;
        padding: 10px;
        border-radius: 20px;
    }

    .dashboard_bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding: 20px;

    }

    .em_departement {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        background-color: #E1ECF7;

        border-radius: 8px;
        padding: 20px;
        box-shadow: 0px 0px 10px rgba(66, 66, 66, 0.255);
    }

    .dashboard_chart {
        display: flex;
        box-shadow: 0px 0px 10px rgba(66, 66, 66, 0.255);
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: #E1ECF7;
        width: 100%;
        height: 300px;
        padding: 10px;
        border-radius: 20px;
    }

</style>
