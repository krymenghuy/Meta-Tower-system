<div id="_main_fleetListComponent" style="display:none"> 
      <!--begin:: fleetList Portlet-->
      <div class="kt-portlet kt-portlet--last kt-portlet--head-sm kt-portlet--responsive-mobile" id="_fle_deliveryListPanel" style="display:none">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-toolbar form-inline">
               <input type="text" id="_fle_search" class="form-control" placeholder="Search packages"> &nbsp;
                  <div class="btn-group">
                      <button id="_fle_lnkNewDelivery" type="button" class="btn btn-brand">
                          <a href="#" data-toggle="modal" class="btn btn-primary">
                              <i class="la la-plus"></i>
                              <span class="kt-hidden-mobile">New Delivery</span>
                          </a>
                      </button>
                  </div>
            </div>
        </div>
        
        <div class="kt-portlet__body">
              <div class="form-inline" id="_fle_d_filter_panel">
                <div class="v-control-group">
                      <span class="v-label">Warehouse</span>
                      <select id="_fle_filter_warehouse" class="v-select form-control dl_filter_field"></select> &nbsp;
                  </div>&nbsp;&nbsp;
                  <div class="v-control-group">
                      <span class="v-label">Date</span>
                      <input id="_fle_filter_date" class="v-select form-control dl_filter_field" data-select="datepicker" autocomplete="off"> &nbsp;
                  </div>&nbsp;&nbsp;
                  <div class="v-control-group">
                    <span class="v-label">Merchant</span>
                      <select id="_fle_filter_sender" class="v-select form-control dl_filter_field"></select>&nbsp;
                  </div>&nbsp;&nbsp;
                  <div class="v-control-group">
                      <span class="v-label">Driver</span>
                      <select id="_fle_filter_driver" class="v-select form-control dl_filter_field"></select>&nbsp;
                  </div>&nbsp;&nbsp;
                  <div class="v-control-group">
                      <span class="v-label">Zone</span>
                      <select id="_fle_filter_zone" class="v-select form-control dl_filter_field"></select>&nbsp;
                  </div>
                  <div class="v-control-group">
                      <span class="v-label">Status</span>
                      <select id="_fle_filter_status" class="v-select form-control dl_filter_field"></select>&nbsp;
                  </div>&nbsp;&nbsp;
            </div>

              <table id="_fle_tblFleets" class="table table-striped- table-bordered">  
              </table>
        
        </div>
      </div>
      <!--end:: fleetList Portlet-->

        <!--begin::new_fleet_panel-->
        <div id="_fle_new_fleet_panel" style="display:none;padding:15px;">
                 <div class="row">
                     <div class="col-lg-6">
                         <label class="label-control">Origin Warehouse</label>
                         <input id ="_fle_ft_origin" class="form-control" placeholder="Warehouse">
                     </div>
                     <div class="col-lg-6">
                         <label class="label-control">Delivery Date</label>
                         <input class="form-control" placeholder="Delivery Date" date-select="datepicker">
                     </div>
                  </div>

                  <div class="row">
                      <div class="col-lg-6">
                         <label class="label-control">Driver</label> &nbsp; &nbsp;<a href="#" class="btn btn-sm btn-outline-success"><i class="fa fa-search" style="font-size:green;font-ize:1.3em"></i></a>
                         <select class="form-control" placeholder="Driver"></select>
                       </div>
                       <div class="col-lg-6">
                         <label class="label-control">Destination Zone</label> &nbsp; &nbsp;<a href="#" class="btn btn-sm btn-outline-success"><i class="fa fa-search" style="font-size:green;font-ize:1.3em"></i></a>
                         <select class="form-control" placeholder="Zone"></select>
                       </div>
                 </div>
    
                <table id="_fle_ft_tblPackages" class="table table-bordered">
                </table>
        </div>
       <!--end::new_fleet_panel -->

 <script defer src="{{ asset('js/FleetListComponent.js') }}"></script>
