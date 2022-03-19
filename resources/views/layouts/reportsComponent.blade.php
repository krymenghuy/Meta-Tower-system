<div id="_main_reportsComponent" style="display:none;width;100%;background:#fff;">
  <div style="margin:auto;width:90%">
       <div style="border:1.2px solid green;padding:15px;border-radius:3px;margin-top:35px;">
                 <div class="row">
                    <div class="col-lg-12">
                        <h2>Filter</h2>
                    </div>
                 </div>  
                  <div class="row">
                     <div class="col-lg-6">
                         <ul>
                              <li>Sales Commpissions</li>
                              <li>Daily Summary Report</li>
                         </ul>
                     </div> 
                     <div​ class="col-lg-6">
                           <span class="simple-label">Start Date</span>
                           <input id="_rc_filter_startdate" class="form-control" data-select="datepicker">
                            <span class="simple-label">End Date</span>
                            <input id="_rc_filter_enddate" class="form-control" data-select="datepicker">
                        </div>
                  </div>     
                          
                        <div style="margin-top:15px">
                           <button id="_rc_filter_btnRunReport" class="btn btn-primary"><i class="fa fa-list-alt"></i> Run Report</button>
                           <button id="go-to-pem" class="btn btn-default">Open PEMS</button> 
                        </div>               
        </div>
  </div>
</div>
<script async src="{{ asset('js/ReportsComponent.js') }}"></script>
<!-- <script defer src="{{ asset('assets/js/crypto-js.js') }}" type="text/javascript"></script>
<script defer src="{{ asset('assets/js/aes.min.js') }}" type="text/javascript"></script>
<script async src="{{ asset('js/pe-link.js') }}"></script> -->
