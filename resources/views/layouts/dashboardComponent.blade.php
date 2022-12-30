<style>
  .dbc-card-period{
    padding:3px;
    display:inline-block;
    font-size:0.9em;
    color:gray;
    font-style:italic;
  }
  .small-box>.inner{
    height: 10vw;
    opacity:0.6;
  }
  .dbc-card-title{
    margin-top:-3px;
    font-size:1.2em;
    color:#444747;
    font-weight:bold;
  }
  .dashboard-title{
    font-size:1.2em;
    color:grey;
    display:inline-block;
    padding:0px !important;
  }
  .dbc-card-line{
    text-transform:uppercase;
    width:100%;
    margin-top:-2px;
    border-top:1px solid #E4EAEB;
    margin:auto;
  }
  .dbc-card-percent{
     font-size:1em;
     color:green;

  }
  
  .card{
    overflow:auto;
  } 
  .oval-top-left-danger{
    border-top:3px dotted red;
    border-top-left-radius:25px;
  }

  .oval-top-left-primary{
    border-top:3px dotted #5DE2CE;
    border-top-left-radius:25px;
  }

  .oval-top-left-warning{
    border-top:3px dotted orange;
    border-top-left-radius:25px;
  }
  .oval-top-left-blue{
    border-top:3px dotted #46B1EE;
    border-top-left-radius:25px;
  }

  .oval-top-left-muted{
    border-top:3px dotted #9AB8B4;
    border-top-left-radius:25px;
  }

  .card::-webkit-scrollbar {
   height:4px;
   width:4px;
}
.card::-webkit-scrollbar-thumb {
  background-color:#D8F3F4;
  outline: 0px !important;  
}
.dbc-currency{
  padding:3px;
  font-size:0.6em;
  color:grey;
}

.barchart-summary-value-title{
  color:grey;
  font-size:0.8em;
}
.barchart-summary-value{
  color:#72797F;
  font-size:0.8em;
}
</style>
<div id="_main_dashboardComponent" style="display:none;padding:35px">
<section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box)-->
        <div class="row">

        <div class="col-md-4">
               <div class="card" style="height:34.5vw">
                      <div class="card-header" style="border:none;background:none;">
                        <h3 class="card-title dashboard-title">Prospects By Program / Interest</h3>
                      </div>
                      <!-- /.card-header -->
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-12">
                              <div class="chart-responsive"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                                <canvas id="myPieChart" height="380vw" style="display: block;" class="chartjs-render-monitor"></canvas>
                              </div>
                            <!-- ./chart-responsive -->
                          </div>
                          
                        </div>
                        <!-- /.row -->
                      </div>
                      <!-- /.card-body -->
                      <!-- /.footer -->

                    </div>
          </div>



          <div class="col-md-8">

             <!--begin: first inner row -->
             <div class="row">
 
                              <div class="col-lg-6 col-6">
                              <!-- small box -->
                              <div class="small-box oval-top-left-danger" style="border-bottom: 7px solid #F63A07;">
                                <div class="inner">
                                  <h3 id="dbc_principal" class="dbc-card-value"  data-field="principal" style="font-size:1.2em;margin-bottom:2.8vw;">$0</h3>
                                  <p class="dbc-card-title">Total Principal</p>
                                  <div class="dbc-card-line"></div>
                                  <span class="dbc-card-period">last 12 months</span>
                                </div>
                                <div class="icon">
                                  <i class="ion"><img class="ion" src="{{asset('assets/images/icons/principal.png')}}" style="height:3.5vw;margin-top:-3vw;"></i>
                                </div>
                                <!-- <a href="#" class="small-box-footer" style="background:#007bff">More info <i class="fas fa-arrow-circle-right"></i></a> -->
                              </div>
                            </div>
                            <!-- ./col -->
                            <div class="col-lg-6 col-6">
                              <!-- small box -->
                              <div class="small-box oval-top-left-warning" style="border-bottom: 7px solid orange;">
                                <div class="inner">
                                    <h3 id="dbc_total_earnings" class="dbc-card-value"  data-field="discount_principal" data-item="amount" data-unit="usd" style="font-size:1.2em;margin-bottom:2.8vw;">$0</h3>
                                    <p class="dbc-card-title">Discount Principal</p>
                                    <div class="dbc-card-line"></div>
                                    <span class="dbc-card-period">last 12 months</span>
                                </div>
                                <div class="icon">
                                  <i class="ion"><img class="ion" src="{{asset('assets/images/icons/discount_percent.png')}}" style="height:3.5vw;margin-top:-3vw;"></i>
                                </div>
                                
                              </div>
                            </div>
                            <!-- ./col -->
             </div>
             <!--end:: first innner row-->

              <!--begin:: second inner row-->
               <div class="row">

                          <div class="col-lg-6 col-6">
                        <!-- small box -->
                        <div class="small-box oval-top-left-primary" style="border-bottom: 7px solid rgba(20, 255, 0, 0.3);">
                          <div class="inner">
                            <h3 id="dbc_merchant_count" class="dbc-card-value"  data-field="principal_paid" data-item="amount" style="font-size:1.2em;margin-bottom:2.8vw;">0</h3>
                            <p class="dbc-card-title">Paid Principal <span class="dbc-card-value" data-field="principal_paid_percent" style="color:green;padding:3px;font-size:1.2em;font-weight:bold"></span></p>
                            <div class="dbc-card-line"></div>
                            <span class="dbc-card-period">last 12 months</span>
                          </div>
                          <div class="icon">
                              <i class="ion"><img class="ion" src="{{asset('assets/images/icons/interest.png')}}"  style="height:3vw;margin-top:-3vw;"></i>
                          </div>
                          
                        </div>
                      </div>
                      <!-- ./col -->
                      <div class="col-lg-6 col-6">
                        <!-- small box -->
                        <div class="small-box oval-top-left-primary" style="border-bottom: 7px solid rgba(0, 255, 209, 0.3);">
                          <div class="inner">
                            <h3 id="dbc_earnings" class="dbc-card-value"  data-field="earnings" data-item="amount" data-unit="usd" style="font-size:1.2em;margin-bottom:2.8vw;">0</h3>
                            <p class="dbc-card-title">Earnings</p>
                            <div class="dbc-card-line"></div>
                            <span class="dbc-card-period">last 12 months</span>
                          </div>
                          <div class="icon">
                            <!-- <i class="ion ion-model-s" style="font-size:3rem;"></i> -->
                            <i class="ion"><img class="ion" src="{{asset('assets/images/icons/earnings.png')}}"  style="height:3vw;margin-top:-3vw;"></i>
                          </div>
                          
                        </div>
                      </div>
                      <!-- ./col -->

               </div>
              <!--end::second inner row-->

              <!--begin:: third inner row-->
              <div class="row">

                          <!-- ./col -->
                            <div class="col-lg-6 col-6">
                            <!-- small box -->
                            <div class="small-box oval-top-left-blue" style="border-bottom: 7px solid rgba(255, 245, 0, 0.3);">
                              <div class="inner">
                                <h3 id="dbc_borrower_count" class="dbc-card-value"  data-field="borrower_count" data-item="count" style="font-size:1.2em;margin-bottom:2.8vw;">0</h3>

                                <p class="dbc-card-title">Borrower Count</p>
                                <div class="dbc-card-line"></div>
                                <span class="dbc-card-period">last 12 months</span> 
                              </div>
                              <div class="icon">
                                <i class="ion"><img class="ion" src="{{asset('assets/images/icons/person1.png')}}"  style="height:3vw;margin-top:-3vw;"></i>
                              </div>
                              
                            </div>
                          </div>
                          <!-- ./col -->
                          
                          <!-- ./col -->
                          <div class="col-lg-6 col-6">
                            <!-- small box -->
                            <div class="small-box oval-top-left-blue" style="border-bottom: 7px solid rgba(88, 105, 95, 0.3);">
                              <div class="inner">
                                <h3 id="dbc_finished_loan_count" class="dbc-card-value"  data-field="finished_loan_count" data-item="count" data-unit="loans" style="font-size:1.2em;margin-bottom:2.8vw;">0</h3>

                                <p class="dbc-card-title">Finished Loans</p>
                                <div class="dbc-card-line"></div>
                                <span class="dbc-card-period">last 12 months</span>
                              </div>
                              <div class="icon">
                                  <i class="ion"><img class="ion" src="{{asset('assets/images/icons/finished loan.png')}}"  style="height:3.5vw;margin-top:-3vw;"></i>
                              </div>
                              
                            </div>
                          </div>
                          <!-- ./col -->
                        </div>
                        
              </div>
              <!--end::third inner row -->
          </div>
    
       
        <!-- /.row -->
        <!-- Main row -->
        <div class="row">
          <!-- Left col -->
          <section class="col-lg-12 connectedSortable ui-sortable">
            <!-- Custom tabs (Charts with tabs)-->
        
            <!-- /.card -->
           <!-- /.card -->
 
           <div class="card" style="border:none;min-height:495px;height:auto;">
            
                <div class="position-relative mb-4"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                  <canvas id="myBarChart" height="120vw" style="display:block" class="chartjs-render-monitor"></canvas>
                </div>
                 
                <div class="card-header border-0" style="background:none;">
                <div class="d-flex justify-content-between">
                      <h3 class="card-title dashboard-title">Collections over last 12 months</h3>
                      <a style="display:none" href="javascript:void(0);">View Report</a>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex">
                  <p class="d-flex flex-column">
                    <span id="dbc_barchart_summary_value" class="text-bold text-lg barchart-summary-value">$0</span>
                    <span id="dbc_barchart_summary_title" class="barchart-summary-value-title">Latest Earnings</span>
                  </p>
                  <p id="barchart_change_info" class="ml-auto d-flex flex-column text-right">
                    <span class="barchart-change-percent text-success">
                      <i class="fas fa-arrow-up"></i>0%
                    </span>
                    <span class="text-muted barchart-period-text">Since last quarter</span>
                  </p>
                </div>
                <!-- /.d-flex -->
   
              </div>
            </div>


          </section>
          <!-- /.Left col -->
  

          <!-- right col -->
        </div>
        <!-- /.row (main row) -->
        <div class="row">
             
            <!--begin::first column-->
            <div class="col-md-12">
                      <div class="card">
                            <div class="card-header" style="border:none;background:none;padding-bottom:0px">
                              <span id="dbc_monthly_pmt_title" class="card-title dashboard-title">Last 12 Months Collections</span>
                            </div>
                            <div class="card-body" style="padding-top:0px">
                                    <table class="table" id="dbc_tblMonthlyPmts">
                                      <thead>
                                        <th style="font-weight:normal;">Month</th>
                                        <th style="font-weight:normal;">Amount</th>
                                        <th style="font-weight:normal;">Change</th>
                                        <th style="font-weight:normal;">Principal</th>
                                        <th style="font-weight:normal;">Interest</th>
                                        <th style="font-weight:normal;">#count</th>
                                      </thead>
                                      <tbody>
                                      </tbody>
                                    </table>
                            </div>
                        </div>
              </div>
            <!--end::first column-->


            <!--begin::second column or second table-->
               <div class="col-md-12">
                      <div class="card">
                            <div class="card-header" style="border:none;background:none;padding-bottom:0px">
                              <span id="dbc_daily_pmt_title" class="card-title dashboard-title">Pending Applications</span>
                            </div>
                            <div class="card-body" style="padding-top:0px">
                                    <table class="table" id="dbc_tblLoanApps">
                                      <thead>
                                        <th style="font-weight:normal;">Date</th>
                                        <th style="font-weight:normal;">Name</th>
                                        <th style="font-weight:normal;">Amount</th>
                                        <th style="font-weight:normal;">Interest</th>
                                        <th style="font-weight:normal;">Status</th>
                                      </thead>
                                      <tbody>
                                      </tbody>
                                    </table>
                            </div>
                        </div>
              </div>
            <!--end::second column or second table-->


        </div>
      </div> <!--container-fluid-->
    </section>
 
</div>
 
 