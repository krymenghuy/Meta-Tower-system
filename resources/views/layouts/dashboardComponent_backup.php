

<div id="_main_dashboardComponent" style="display:none;padding:35px">
 

 <section class="content">
 
       <div class="container-fluid">
 
         <!-- Small boxes (Stat box) -->
 
         <div class="row">
 
           <!-- Start::Colum1 -->
 
           <div class="col-lg-4">
  
 
             <div class="card">
 
                 <div class="card-header" style="border:none;background:none;padding:0px;">
 
                   <div style="text-align:center;">
 
                     <h3 class="card-title" style="font-size:18px;display:none;">Top 3 Merchants</h3>
 
                     <a class="titleApplicantPrice" href="javascript:void(0);" style="text-align:center;padding:0px;">5000  USD</a>
 
                   </div>
 
                 </div>
 
                 <!-- /.card-header -->
 
                 <div class="card-body pt-0" style="text-align:center;">
 
                   <div class="row">
 
                     <div class="col-md-12">
 
                       <div class="chart-responsive"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
 
                         <div class="piechartPanel">
 
                             <div class="titlePieChart">
 
                                   <h1>40%</h1><br>
 
                                   <span><img src="{{asset('assets/images/icons/person1.png')}}" alt=""></span>
 
                               </div>
 
                             <canvas id="myPieChart" height="120" width="260" class="chartjs-render-monitor">
  
                             </canvas>
 
                             <div>
 
                                 <h1 class="titleTotalCollected">TOTAL COLLECTED</h1>
 
                                 <p class="titleLastDay">Last 90 Days</p>
 
                             </div>
 
                           </div>
 
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
 
 
 
           </div> 
 
           <!-- END::Colum1 -->
 
 
 
           <div class="col-lg-4">
 
           
 
               
 
             <div class="card">
 
                 <div class="card-header" style="border:none;background:none;">
 
                   <div style="text-align:center;">
 
                     <h3 class="card-title" style="font-size:18px;">Top 3 Merchants</h3>
 
                     <a class="titleApplicantPrice" href="javascript:void(0);" style="display:none;">5000  USD</a>
 
                   </div>
 
                 </div>
 
                 <!-- /.card-header -->
 
                 <div class="card-body pt-0">
 
                   <div class="row">
 
                     <div class="col-md-12" style="overflow:hidden;">
 
                         <div id="chartContainer" style="height: 255px; width: 100%;"></div>
 
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
 
                         <canvas id="myStackedBar1" height="175" width="260" style="display: block; width: 130px; height: 65px;" class="chartjs-render-monitor"></canvas>
 
                       </div>
 
                       <!-- ./chart-responsive -->
 
                     </div>
 
                     
 
                   </div>
 
                   <!-- /.row -->
 
                 </div>
 
 
 
 
 
 
 
 
 
             </div>
 
 
 
           </div>
 
 
 
           <div class="col-lg-4">
 
                   
 
            <div class="card" style="border:none;">
 
               <div class="card-header border-0" style="background:none;">
 
                 <div class="d-flex justify-content-between">
 
                   <h3 class="card-title" style="font-size:18px">Services by Types</h3>
 
                   <a style="display:none" href="javascript:void(0);">View Report</a>
 
                 </div>
 
               </div>
 
               <div class="card-body">
 
                 <!-- <div class="d-flex">
 
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
 
                 </div> -->
 
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
 
           </div>
 
 
 
 
 
           </div>
 
 
 
 
 
 
 
           
 
          
 
           <!-- ./col -->
 
         </div>
 
         <!-- /.row -->
 
         <!-- Main row -->
 
         <div class="row" style="margin-top:20px;">
 
           <!--Start::Left Sidebar -->
 
           <div class="col-md-6">
 
               <div class="card" style="border:none;">
 
                   <div class="card-header border-0" style="background:none;">
 
                     <div class="d-flex justify-content-between">
 
                       <h3 class="card-title" style="font-size:18px">All Reports</h3>
 
                       <a style="display:none" href="javascript:void(0);">View Report</a>
 
                     </div>
 
                   </div>
 
                   <div class="card-body">
 
                       <div class="d-flex">
 
                         <!-- Start::Left Panel -->
 
                         <div class="col-md-4 panelAllReportLeftSideBar">
 
                             <div class="img-left-sidebar">
 
                                 <div class="bg-white">
 
                                     <img src="{{asset('assets/images/icons/icon-bar.png')}}" alt="">
 
                                 </div>
 
                             </div>
 
                         </div>
 
                         <!-- END::Left panel -->
 
 
 
                         <div class="col-md-8">
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/person.png')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Total Borrowers</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
 
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/principle.png')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Total Principle Collected</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
 
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/interest.png')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Total Interest Collected</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
 
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/barchart.jpg')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Average Amount Paid By Student</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
 
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/late payment.png')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Total Late Payment Students</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
 
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/finished loan.png')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Total Finished Loans Students</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
 
 
                             <div class="card-totalBorrowers">
 
                                 <div class="d-flex">
 
                                     <div class="icon">
 
                                       <img src="{{asset('assets/images/icons/never pay.png')}}" alt="">
 
                                     </div>
 
                                     <div class="title">
 
                                         <p>Total Students Who Never Pay</p>
 
                                         <h4>2000USD</h4>
 
                                     </div>
 
                                 </div>
 
                             </div>
 
                         </div>
 
                       </div>
 
                   </div>
 
               </div>
 
           </div>
 
           <!--END::Left SideBar -->
 
 
 
           <div class="col-md-6">
 
               <div class="card" style="border:none;">
 
                   <div class="card-header border-0" style="background:none;">
 
                     <div class="d-flex justify-content-between">
 
                       <h3 class="card-title" style="font-size:18px">Pending Applicants</h3>
 
                       <a class="titleApplicantPrice" href="javascript:void(0);"><span class="titleApplicantTotalAmount">Total Amount: </span>5000  USD</a>
 
                     </div>
 
                   </div>
 
                   <div class="card-body pt-0">
 
                       <table class="table table-responsive table-hover">
 
                         <thead>
 
                           <tr>
 
                             <th>No</th>
 
                             <th>Applicant Name</th>
 
                             <th>Email</th>
 
                             <th>Program</th>
 
                             <th>Amount</th>
 
                             <th>Status</th>
 
                           </tr>
 
                         </thead>
 
                         <tbody>
 
                             <tr>
 
                               <td>1</td>
 
                               <td>SAK Ravuth</td>
 
                               <td>sakravuth@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>2</td>
 
                               <td>Vannak</td>
 
                               <td>vannak@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard-Approved">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>1</td>
 
                               <td>SAK Ravuth</td>
 
                               <td>sakravuth@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>2</td>
 
                               <td>Vannak</td>
 
                               <td>vannak@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard-Approved">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>1</td>
 
                               <td>SAK Ravuth</td>
 
                               <td>sakravuth@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>2</td>
 
                               <td>Vannak</td>
 
                               <td>vannak@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard-Approved">PENDING</button></td>
 
                             </tr><tr>
 
                               <td>1</td>
 
                               <td>SAK Ravuth</td>
 
                               <td>sakravuth@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>2</td>
 
                               <td>Vannak</td>
 
                               <td>vannak@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard-Approved">PENDING</button></td>
 
                             </tr><tr>
 
                               <td>1</td>
 
                               <td>SAK Ravuth</td>
 
                               <td>sakravuth@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard">PENDING</button></td>
 
                             </tr>
 
                             <tr>
 
                               <td>2</td>
 
                               <td>Vannak</td>
 
                               <td>vannak@gmail.com</td>
 
                               <td>Master</td>
 
                               <td>5000USD</td>
 
                               <td><button class="btnTableDashboard-Approved">PENDING</button></td>
 
                             </tr>
 
                         </tbody>
 
                       </table>
 
                   </div>
 
               </div>
 
           </div>
 
  
 
         </div>
 
         <!-- /.row (main row) -->
 
       </div><!-- /.container-fluid -->
 </div>
 
     </section>
 
  
 
 </div>
  
 
 <script async src="{{ asset('js/DashboardComponent.js') }}"></script>
 