@extends('master')
@section('page_title', 'Delivery')
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
                                <i class="fa fa-university"></i>
                            </span>
                            <h3 class="kt-portlet__head-title">
                                Delivery List
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        <!--begin: Datatable -->
                        <table class="table table-striped- table-bordered table-hover table-checkable" id="kt_table_1">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Order ID</th>
                                    <th>Merchant Type</th>
                                    <th>Merchant</th>
                                    <th>Vehicle Type</th>
                                    <th>product Type</th>
                                    <th>QTY</th>
                                    <th>Pickup Address</th>
                                    <th>Pickup Location</th>
                                    <th>Request Date</th>
                                    <th>Driver</th>
                                    <th>Pickup Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="delivery_tbody">
                                <?php $n = 1; ?>
                                @foreach($order as $rows)
                                    @if(in_array($rows->order_status_id, [4,5,6]))
                                        <tr style="cursor:pointer;" data-id="{{ $rows->id }}">
                                            <td>{{ $n }} <a href="{{ url('list_packages/'.$rows->id) }}"><i class="fa fa-list"></i></a></td>
                                            <td>{{ $rows->code }}</td>
                                            <td>{{ $rows->sender_type }}</td>
                                            <td>{{ $rows->sender_name }}</td>
                                            <td>{{ $rows->request_vehicle_type }}</td>
                                            <td>{{ $rows->product_type }}</td>
                                            <td>{{ $rows->qty }}</td>
                                            <td>{{ $rows->pickup_address }}</td>
                                            <td>{{ $rows->pickup_location }}</td>
                                            <td>{{ $rows->request_date }}</td>
                                            <td>{{ $rows->driver_name }}</td>
                                            <td>{{ $rows->pickup_time }}</td>
                                            <td>
                                                @if($rows->order_status_id == 1)
                                                    <span class="kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill">{{ $rows->order_status }}</span>
                                                @elseif($rows->order_status_id == 2)
                                                    <span class="kt-badge  kt-badge--warning kt-badge--inline kt-badge--pill">{{ $rows->order_status }}</span>
                                                @elseif($rows->order_status_id == 3)
                                                    <span class="kt-badge  kt-badge--info kt-badge--inline kt-badge--pill">{{ $rows->order_status }}</span>
                                                @elseif($rows->order_status_id == 4)
                                                    <span class="kt-badge  kt-badge--success kt-badge--inline kt-badge--pill">{{ $rows->order_status }}</span>
                                                @elseif($rows->order_status_id == 5)
                                                    <span class="kt-badge  kt-badge--success kt-badge--inline kt-badge--pill">{{ $rows->order_status }}</span>
                                                @else
                                                    <span class="kt-badge  kt-badge--success kt-badge--inline kt-badge--pill">{{ $rows->order_status }}</span>
                                                @endif
                                            </td>
                                        </tr>
                                    @endif
                                    <?php $n++; ?>
                                @endforeach
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

<script>
    // $('#delivery_tbody').on('click','tr', function(e){
    //     var delivery_id = $(this).data("id");
    //     var url_data = 'list_package/' + delivery_id;
    //     window.location.href = url_data;
    // });
</script>

@endsection