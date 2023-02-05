<style>
</style>

<div id="_main_dashboardComponent" style="display:none;padding:35px">
    <div class="row g-4">
        <div class="col-lg-6">
            <div class="w-100 shadow rounded-4 chart-container position-relative p-3">
                <div class="d-flex align-items-center py-2">
                    <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Monthly Revenues Trend (Over Last 12 Months)"></p>
                </div>
                <canvas id="_dash_barChart"></canvas>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="d-block w-100">
                <div class="w-100 shadow rounded-4 chart-container position-relative p-3">
                    <div class="d-flex align-items-center py-2">
                        <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Revenues By Category"></p>
                    </div>
                    <canvas id="_dash_pieChart"></canvas>
                </div>
            </div>
        </div>
    </div>
    <div class="row gy-3 mt-3">
        <div class="col-lg-3">
            <div class="w-100 d-flex flex-column shadow rounded-4 p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-start pt-3 w-100">
                        <p class="fw-bold trans-text" data-langprop="dashboard.Number of Appointments"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100 position-relative">
                        <canvas id="_dash_sm_lineChart"></canvas>
                    </div>
                </div>
                <div class="d-block">
                    <div class="d-flex align-items-start">
                        <p class="fw-bold fs-5">0.00 USD</p>
                    </div>
                    <div class="d-flex align-items-center border-top border-secondary border-1 py-2">
                        <p>last 3 months</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <div class="w-100 d-flex flex-column shadow rounded-4 p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-start pt-3 w-100">
                        <p class="fw-bold trans-text" data-langprop="dashboard.Total Revenues"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <canvas id="_dash_sm_barChart"></canvas>
                    </div>
                </div>
                <div class="d-block">
                    <div class="d-flex align-items-start">
                        <p class="fw-bold fs-5">0.00 USD</p>
                    </div>
                    <div class="d-flex align-items-center border-top border-secondary border-1 py-2">
                        <p class="text-muted">last 3 months</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <div class="w-100 d-flex flex-column shadow rounded-4 p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-start pt-3 w-100">
                        <p class="fw-bold trans-text" data-langprop="dashboard.Total Number of Patients"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <canvas id="_dash_sm_doughnutChart"></canvas>
                    </div>
                </div>
                <div class="d-block">
                    <div class="d-flex align-items-start">
                        <p class="fw-bold fs-5">0.00 USD</p>
                    </div>
                    <div class="d-flex align-items-center border-top border-secondary border-1 py-2">
                        <p class="text-muted">last 3 months</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <div class="w-100 d-flex flex-column shadow rounded-4 p-3">
                <div class="d-flex w-100">
                    <div class="d-flex align-items-start pt-3 w-100">
                        <p class="fw-bold trans-text" data-langprop="dashboard.Number of Consultants/Doctors"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <canvas id="_dash_sm_polyAreaChart"></canvas>
                    </div>
                </div>
                <div class="d-block">
                    <div class="d-flex align-items-start">
                        <p class="fw-bold fs-5">0.00 USD</p>
                    </div>
                    <div class="d-flex align-items-center border-top border-secondary border-1 py-2">
                        <p class="text-muted">last 3 months</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table" id="_dash_tblDashboard"></table>
    </div>
</div>