<div id="_main_dashboardComponent" style="display:none;padding:35px">

<section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <div class="row">
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box">
              <div class="inner" style="height:90px">
                <h3 id="spaTotalFee_highlight">$0</h3>
                <p>Total Fees</p>
              </div>
              <canvas id="spaTotalFee" style="height:40px"></canvas>
              <div class="icon">
              <i class="ion ion-stats-bars"></i>
              </div>
              <!-- <a href="#" class="small-box-footer" style="background:#007bff">More info <i class="fas fa-arrow-circle-right"></i></a> -->
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="shadow-md small-box">
              <div class="inner" style="height:90px">
                <h3 id="spaTotalDoneDeliveries_highlight">53<sup style="font-size: 20px"></sup></h3>

                <p>Total Done Deliveries</p>
              </div>
              <canvas id="spaTotalDoneDeliveries" style="height:40px"></canvas>
              <div class="icon">
                <i class="ion ion-android-bicycle"></i>
              </div>
              
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box">
              <div class="inner" style="height:90px">
                <h3 id="spaTotalReturnToMerchants_highlight">44</h3>

                <p>Total Returns to Vendors </p>
                
              </div>
              <canvas id="spaTotalReturnToMerchants" style="height:40px"></canvas>
              <div class="icon">
                <i class="ion ion-loop"></i>
              </div>
              
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box">
              <div class="inner" style="height:90px">
                <h3 id="spaTotalContinueToDeliver_highlight">65</h3>

                <p>Total Continue to Deliver </p>
                
              </div>
              <canvas id="spaTotalContinueToDeliver" style="height:40px"></canvas>
              <div class="icon">
                <i class="ion ion-model-s"></i>
              </div>
              
            </div>
          </div>
          <!-- ./col -->
        </div>
        <!-- /.row -->
        <!-- Main row -->
        <div class="row" style="margin-top:20px;">
          <!-- Left col -->
          <section class="col-lg-6 connectedSortable ui-sortable">
            <!-- Custom tabs (Charts with tabs)-->
            <div class="card" style="background:none;">
              <div class="card-header border-0" style="border:none;background:none;">
                <div class="d-flex justify-content-between">
                  <h3 class="card-title" style="font-size:18px">Revenues VS deliveries</h3>
                  <a style="display:none" href="javascript:void(0);">View Report</a>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex">
                  <p class="d-flex flex-column">
                    <span class="text-bold text-lg">820</span>
                    <span>Revenues over time</span>
                  </p>
                  <p class="ml-auto d-flex flex-column text-right">
                    <span class="text-success">
                      <i class="fas fa-arrow-up"></i> 12.5%
                    </span>
                    <span class="text-muted">Since last quarter</span>
                  </p>
                </div>
                <!-- /.d-flex -->
                
                <div class="position-relative mb-4"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                  <canvas id="myNewChart" height="300" width="712" style="display: block; width: 356px; height: 200px;" class="chartjs-render-monitor">
                 </canvas>
                </div>


                <div class="d-flex flex-row justify-content-end">
                  <span class="mr-2">
                    <i class="fas fa-square text-primary"></i> Revenues
                  </span>

                  <span>
                    <i class="fas fa-square text-gray"></i> Deliveries
                  </span>
                </div>
              </div>
            </div>
            <!-- /.card -->
           <!-- /.card -->


           <div class="card" style="margin-top:30px;border:none;">
              <div class="card-header border-0" style="background:none;">
                <div class="d-flex justify-content-between">
                  <h3 class="card-title" style="font-size:18px">Services by Types</h3>
                  <a style="display:none" href="javascript:void(0);">View Report</a>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex">
                  <p class="d-flex flex-column">
                    <span class="text-bold text-lg">$0</span>
                    <span>Sales over Time</span>
                  </p>
                  <p class="ml-auto d-flex flex-column text-right">
                    <span class="text-success">
                      <i class="fas fa-arrow-up"></i> 33.1%
                    </span>
                    <span class="text-muted">Since last quarter</span>
                  </p>
                </div>
                <!-- /.d-flex -->

                <div class="position-relative mb-4"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                  <canvas id="myBarChart" height="800" style="display: block; width: 721px; height: 200px;" width="1442" class="chartjs-render-monitor"></canvas>
                </div>

                <div class="d-flex flex-row justify-content-end">
                  <span class="mr-2">
                    <i class="fas fa-square text-primary"></i> Fast
                  </span>

                  <span>
                    <i class="fas fa-square text-gray"></i> Normal
                  </span>
                </div>
              </div>
            </div>


          </section>
          <!-- /.Left col -->
 
          <!-- right col (We are only adding the ID to make the widgets sortable)-->
          <section class="col-lg-6 connectedSortable ui-sortable">

          <div class="card">
              <div class="card-header" style="border:none;background:none;">
                <h3 class="card-title" style="font-size:18px">Top 3 Merchants</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="chart-responsive"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                      <canvas id="myPieChart" height="110" width="260" style="display: block; width: 130px; height: 65px;" class="chartjs-render-monitor"></canvas>
                    </div>
                    <!-- ./chart-responsive -->
                  </div>
                  
                </div>
                <!-- /.row -->
              </div>
              <!-- /.card-body -->
              <div class="card-footer bg-light p-0" style="display:none">
                <ul class="nav nav-pills flex-column">
                  <li class="nav-item">
                    <a href="javascript:;" class="nav-link">
                     Store One
                      <span class="float-right text-danger">
                        <i class="fas fa-arrow-down text-sm"></i>
                        12%</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="javascript:;" class="nav-link">
                      Store Two
                      <span class="float-right text-success">
                        <i class="fas fa-arrow-up text-sm"></i> 4%
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a href="javascript:;" class="nav-link">
                     Store Three
                      <span class="float-right text-warning">
                        <i class="fas fa-arrow-left text-sm"></i> 0%
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <!-- /.footer -->

              
              

            </div>


            <div class="card" style="margin-top:30px;display:none">
              <div class="card-header" style="border:none;background:none;">
                <h3 class="card-title" style="font-size:18px">Browser Usage</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <div class="chart-responsive"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                      <canvas id="myStackedBar" height="175" width="260" style="display: block; width: 130px; height: 65px;" class="chartjs-render-monitor"></canvas>
                    </div>
                    <!-- ./chart-responsive -->
                  </div>
                  
                </div>
                <!-- /.row -->
              </div>
 
            </div>
          
        
          
        </section>
          <!-- right col -->
        </div>
        <!-- /.row (main row) -->
      </div><!-- /.container-fluid -->
    </section>
 
</div>
<script async src="{{ asset('js/DashboardComponent.js') }}"></script>


