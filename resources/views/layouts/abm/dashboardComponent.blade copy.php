<!-- <style>
    .dbc-card-period {
        padding: 3px;
        display: inline-block;
        font-size: 0.9em;
        color: gray;
        font-style: italic;
    }

    .small-box>.inner {
        min-height: 160px;
        max-height: 166px;
    }

    .dbc-card-title {
        margin-top: -3px;
        font-size: 1.2em;
        color: #ACB4B4;
        font-weight: bold;
    }

    .dashboard-title {
        font-size: 1.2em;
        color: grey;
        display: inline-block;
        padding: 0px !important;
    }

    .dbc-card-line {
        width: 100%;
        margin-top: -2px;
        border-top: 1px solid #E4EAEB;
        margin: auto;
    }

    .dbc-card-percent-delivered {
        font-size: 0.6em;
        color: green;
    }

    div.dbc-no-rows-found {
        border-radius: 5px;
        border: 1.2px solid solid #90ECD5;
        color: #A9BBB4;
        font-size: 1.2em;
        padding: 4px;
    }

    .dbc-card-percent-returned {
        font-size: 0.6em;
        color: red;
    }

    .card {
        overflow: auto;
    }

    .card::-webkit-scrollbar {
        height: 4px;
        width: 4px;
    }

    .card::-webkit-scrollbar-thumb {
        background-color: #D8F3F4;
        outline: 0px !important;
    }

    .dbc-currency {
        padding: 3px;
        font-size: 0.6em;
        color: grey;
    }
</style> -->

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
    }

    .content {
        margin: 10px;
        padding: 10px;
    }

    .navbar {
        margin-left: 10px;
        background-color: #fff;
        border-bottom: 1px solid #dee2e6;
    }

    .card {
        margin-bottom: 20px;
    }

    .status-success {
        color: #28a745;
    }

    .status-pending {
        color: #ffc107;
    }

    .status-failed {
        color: #dc3545;
    }
</style>
<div id="_main_dashboardComponent" style="display:none;padding:15px">



    <body>

        <body>



            Main content
            <div class="content">



                <!-- Dashboard Widgets -->
                <div class=" mt-4">
                    <div class="row">
                        <!-- Widget 1: Active Shipments -->
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <i class="fas fa-shipping-fast"></i> Active Shipments
                                </div>
                                <div class="card-body">
                                    <ul class="list-group">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Shipment #12345
                                            <span class="badge badge-success badge-pill">On Schedule</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Shipment #67890
                                            <span class="badge badge-warning badge-pill">Delayed</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Shipment #11223
                                            <span class="badge badge-success badge-pill">In Transit</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- Widget 2: Recent Orders -->
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <i class="fas fa-box"></i> Recent Orders
                                </div>
                                <div class="card-body">
                                    <ul class="list-group">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Order #54321
                                            <span class="badge badge-success badge-pill">Completed</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Order #09876
                                            <span class="badge badge-warning badge-pill">Pending</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            Order #33445
                                            <span class="badge badge-danger badge-pill">Failed</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Shipment Map -->
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card mt-4">
                                <div class="card-header">
                                    <i class="fas fa-map-marked-alt"></i> Shipment Tracking Map
                                </div>
                                <div class="card-body">
                                    <!-- You can integrate a map here using a service like Google Maps or Mapbox -->
                                    <div id="map" style="height: 400px; background-color: #e9ecef;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </body>




</div>
