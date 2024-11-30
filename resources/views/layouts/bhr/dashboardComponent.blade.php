<div id="_main_dashboardComponent" style="display:none;padding:10px 0 0; overflow:auto;">
    <div class="dashboard_top" id="_dashboard_top">
    </div>

    <div class="dashboard_middle" id="_dashboard_middle"></div>

    <div class="dashboard_center" id="_dashboard_center">
    </div>

    <div class="dashboard_bottom" id="_dashboard_bottom">

        <div class="bottom_left" id="_dashboard_bottom_left">
        </div>

        <div class="bottom_right" id="_dashboard_bottom_right">
        </div>

    </div>
    <div class="dashboard_chart" >
        <canvas id="myChart"></canvas>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
<script>
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Staffs', 'Internship', 'In Probation'],
        datasets: [{
        //   label: '# of Votes',
          data: [10, 29, 52],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top', // Position of the legend
          },
          tooltip: {
            enabled: true // Enable tooltips
          },
          datalabels: {
            color: '#000', // Text color
            font: {
              size: 12, // Font size
              weight: 'bold'
            },
            formatter: function (value, context) {
              // Display label name and value
              return context.chart.data.labels[context.dataIndex] + '\n' + value;
            }
          }
        }
      },
      plugins: [ChartDataLabels] // Register the Data Labels plugin
    });
</script>
<style>
    #_main_dashboardComponent {
        display: flex;
        flex-direction: column;
        height: 550px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_main_dashboardComponent tr:hover {
        background-color: skyblue;
        cursor: pointer;
    }

    .dashboard_top {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 20px;
        padding: 20px;
        background-color: #f4f4f4;
    }

    .dashboard_middle {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 20px;
        padding: 20px;
        background-color: #f4f4f4;
    }

    .employees {
        background-color: white;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(66, 66, 66, 0.255);
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .total_employee {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .total_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .total_title {
        font-size: 1rem;
        font-weight: bold;
    }

    .total_bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .total_number {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .total_icon {
        font-size: 1.2rem;
    }

    .fa-ellipsis-v {
        cursor: pointer;
    }

    /* div.employees:hover {
    background-color: #0079FF !important;
    cursor: pointer !important;
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
        /* margin: 20px; */
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
    .dashboard_chart{
        display: flex;
        box-shadow: 0px 0px 10px rgba(66, 66, 66, 0.255);
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: #E1ECF7;
        width: 47.5%; /* Set the desired width of the container */
        height: 400px;
        padding: 10px;
        margin: 20px;
        border-radius: 20px;
    }
</style>
