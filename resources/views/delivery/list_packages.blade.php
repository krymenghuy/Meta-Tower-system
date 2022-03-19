@extends('master')
@section('page_title', 'List Packages')
@section('admin_content')
<div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
    <!-- begin:: Content -->
    <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <div class="row">
            <div class="col-lg-12">

                <!--begin::Portlet-->
                <div class="kt-portlet kt-portlet--last kt-portlet--head-sm kt-portlet--responsive-mobile" id="kt_page_portlet">
                    <div class="kt-portlet__head kt-portlet__head--lg">
                        <div class="kt-portlet__head-label">
                            <span class="kt-portlet__head-icon">
                                <i class="fa fa-list"></i>
                            </span>
                            <h3 class="kt-portlet__head-title">
                                Packages List of order code ({{ $order->code }})
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        <!--begin: Datatable -->
                        <table class="table table-striped- table-bordered table-hover table-checkable" id="kt_table_1">
                            <thead>
                                <tr>
                                    <th>QR Code</th>
                                    <th>Packe Name</th>
                                    <th>Product Type</th>
                                    <th>QTY</th>
                                    <th>Receiver Name</th>
                                    <th>Receiver Address</th>
                                    <th>Receiver Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <form>
                                    @foreach($package as $rows)
                                        <tr>
                                            <td>{{ $rows->qr_code }}</td>
                                            <td>{{ $rows->package_name }}</td>
                                            <td>{{ $rows->product_type }}</td>
                                            <td>{{ $rows->package_qty }}</td>
                                            <td>{{ $rows->receiver_name }}</td>
                                            <td>{{ $rows->receiver_address }}</td>
                                            <td>{{ $rows->receiver_phone }}</td>
                                            <td>
                                                <label class="kt-checkbox kt-checkbox--bold kt-checkbox--brand">
                                                    <input type="checkbox" name="package_id[]"><span></span>
                                                </label>
                                                <a href="{{ url('edit_package/'.$rows->package_id) }}"><i class="fa fa-edit"></i></a>
                                            </td>
                                        </tr>
                                    @endforeach
                                    <tr>
                                        <td colspan="8">
                                            <button type="button" data-toggle="modal" data-target="#package_driver" class="btn btn-primary float-right">Driver</button>
                                        </td>    
                                    </tr>
                                    <div class="modal fade show" id="package_driver">
                                        <div class="modal-dialog modal-lg" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel"><i class="fa fa-edit"></i> Edit Package ({{ $rows->package_name }})</h5>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    </button>
                                                </div>
                                                <form action="{{ url('update_package/'.$rows->package_id) }}" method="post">
                                                    <div class="modal-body">
                                                        {{ csrf_field() }}
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <div class="form-group">
                                                                    <label>QR Code</label>
                                                                    <input type="text" class="form-control" value="{{ $rows->qr_code }}" name="qr_code" id="qr_code">
                                                                </div>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                        <button type="submit" class="btn btn-primary">Submit</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </tbody>
                        </table>
                        <!--end: Datatable -->
                    </div>
                </div>
                <!--end::Portlet-->
            </div>
        </div>
    </div>
    <!-- end:: Content -->
</div>
@endsection