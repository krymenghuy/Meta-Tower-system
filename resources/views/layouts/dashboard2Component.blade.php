<div id="_main_dashboard2Component" style="display:none;padding:35px">
    <div class="row gy-2">
        <div class="col-lg-4">
            <div class="d-block w-100 shadow rounded-4 p-2">
                <div class="d-flex w-100">
                    <div class="d-flex justify-content-start w-100">
                        <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Total Revenues"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <img class="img-thumbnail width-icons-custom" src="{{ asset('assets/images/icons/average.png') }}"/>
                    </div>
                </div>
                <div class="d-flex w-100">
                    <p class="fs-5 fw-bold">0.00 USD</p>
                </div>
                <div class="d-flex w-100 py-2 border-top border-secondary border-1">
                    <p class="text-muted trans-text" data-langprop="dashboard.Last 3 months"></p>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="d-block w-100 shadow rounded-4 p-2">
                <div class="d-flex w-100">
                    <div class="d-flex justify-content-start w-100">
                        <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Avarage Production"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <img class="img-thumbnail width-icons-custom" src="{{ asset('assets/images/icons/average.png') }}"/>
                    </div>
                </div>
                <div class="d-flex w-100">
                    <p class="fs-5 fw-bold">0.00 USD</p>
                </div>
                <div class="d-flex w-100 py-2 border-top border-secondary border-1">
                    <p class="text-muted trans-text" data-langprop="dashboard.Last 3 months"></p>
                </div>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="d-block w-100 shadow rounded-4 p-2">
                <div class="d-flex w-100">
                    <div class="d-flex justify-content-start w-100">
                        <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Total Cash"></p>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <img class="img-thumbnail width-icons-custom" src="{{ asset('assets/images/icons/average.png') }}"/>
                    </div>
                </div>
                <div class="d-flex w-100">
                    <p class="fs-5 fw-bold">0.00 USD</p>
                </div>
                <div class="d-flex w-100 py-2 border-top border-secondary border-1">
                    <p class="text-muted trans-text" data-langprop="dashboard.Last 3 months"></p>
                </div>
            </div>
        </div>
    </div>
    <div class="row gy-2 pt-3">
        <div class="col-lg-6">
            <div class="d-block shadow rounded-4 p-2">
                <div class="d-flex align-items-center">
                    <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Total Revenues and Quatity"></p>
                </div>
                <canvas id="_dash2_barChart"></canvas>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="d-block shadow rounded-4 p-2">
                <div class="d-flex align-items-center">
                    <p class="fs-5 fw-bold text-muted trans-text" data-langprop="dashboard.Average Production Level"></p>
                </div>
                <canvas id="_dash2_pieChart"></canvas>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="table-responsive">
                <table class="table" id="_dash2_tblDashboard2"></table>
            </div>
        </div>
    </div>
</div>