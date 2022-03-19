<div id="_main_driverProfileComponent" style="display:none;">
    <!--begin::Portlet-->
    <div class="kt-portlet kt-portlet--last kt-portlet--head-sm kt-portlet--responsive-mobile" id="kt_page_portlet">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="fa fa-university"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    Merchant Profile
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <div class="btn-group">
                    <button type="button" class="btn btn-brand">
                        <a href="" data-toggle="modal" class="btn btn-primary">
                            <i class="la la-plus"></i>
                            <span class="kt-hidden-mobile">New Driver</span>
                        </a>
                    </button>
                </div>
            </div>
        </div>

        <div class="kt-portlet__body">
            <!--begin: Datatable -->
            <table class="table table-striped- table-bordered table-hover table-checkable" id="kt_table_1">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Emergency Contact</th>
                        <th>Emplo-Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
            <!--end: Datatable -->
        </div>
    </div>
    <!--end::Portlet-->

</div>

<script async src="{{ asset('js/DriverProfileComponent.js') }}"></script>