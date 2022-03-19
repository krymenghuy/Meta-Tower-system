@extends('master')
@section('page_title', 'Edit Package')
@section('admin_content')
<div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
    <!-- begin:: Content -->
    <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <div class="row">
            <div class="col-lg-12">

                <!--begin::Portlet-->
                <div class="kt-portlet kt-portlet--last kt-portlet--head-sm kt-portlet--responsive-mobile" id="kt_page_portlet">
                    <div class="kt-portlet__head kt-portlet__head--sm">
                        <div class="kt-portlet__head-label">
                            <span class="kt-portlet__head-icon">
                                <i class="la la-plus"></i>
                            </span>
                            <h3 class="kt-portlet__head-title">
                                Edit Package
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        {{ Form::model($package, array('url' => array('update_package', $package->package_id), 'method' => 'POST', 'class' => 'kt-form', 'enctype' => 'multipart/form-data')) }}
                            <input type="hidden" name="order_id" value="{{ $package->order_id }}">
                            <div class="kt-portlet__body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>QR Code</label>
                                            <input type="text" class="form-control" value="{{ $package->qr_code }}" name="qr_code" id="qr_code">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Package Name</label>
                                            <input type="text" class="form-control" value="{{ $package->package_name }}" name="package_name" id="package_name">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Product Type</label>
                                            <input type="text" class="form-control" value="{{ $package->product_type }}" name="product_type" id="product_type">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>QTY</label>
                                            <input type="text" class="form-control" value="{{ $package->package_qty }}" name="qty" id="qty">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Dimension</label>
                                            <input type="text" class="form-control" value="{{ $package->dimension_x }}" name="dimension_x" id="dimension_x">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Weight KG</label>
                                            <input type="text" class="form-control" value="{{ $package->weight_kg }}" name="weight_kg" id="weight_kg">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Price</label>
                                            <input type="text" class="form-control" value="{{ $package->price }}" name="price" id="price">
                                        </div>
                                    </div>
                                    <div class="col-md-3" style="display:none;">
                                        <div class="form-group">
                                            <label>Dimension Y</label>
                                            <input type="text" class="form-control" value="{{ $package->dimension_y }}" name="dimension_y" id="dimension_y">
                                        </div>
                                    </div>
                                    <div class="col-md-3" style="display:none;">
                                        <div class="form-group">
                                            <label>Dimension Z</label>
                                            <input type="text" class="form-control" value="{{ $package->dimension_z }}" name="dimension_z" id="dimension_z">
                                        </div>
                                    </div>
                                    <div class="col-md-3" style="display:none;">
                                        <div class="form-group">
                                            <label>Size(M3)</label>
                                            <input type="text" class="form-control" value="{{ $package->cubic_meter_size }}" name="cubic_meter_size" id="cubic_meter_size">
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-group">
                                            <label>Delivery Fee</label>
                                            <input type="text" class="form-control" value="{{ $package->delivery_fee }}" name="delivery_fee" id="delivery_fee">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Receiver Name</label>
                                            <input type="text" class="form-control" value="{{ $package->receiver_name }}" name="receiver_name" id="receiver_name">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Receiver Phone</label>
                                            <input type="text" class="form-control" value="{{ $package->receiver_phone }}" name="receiver_phone" id="receiver_phone">
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Receiver Address</label>
                                            <input type="text" class="form-control" value="{{ $package->receiver_address }}" name="receiver_address" id="receiver_address">
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('ra_country_id', 'Country', array('class' => 'required')) !!}
                                            <select name="ra_country_id"​ id="country_id" class="form-control">
                                                <option value="">Pick a country...</option>
                                                @foreach($countries as $c_tries)
                                                    @if($c_tries->id == $package->ra_country_id)
                                                        <option selected value="{{ $c_tries->id }}">{{ $c_tries->country }}</option>
                                                    @else
                                                        <option value="{{ $c_tries->id }}">{{ $c_tries->country }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('ra_country_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('ra_city_id', 'City', array('class' => 'required')) !!}
                                            <select name="ra_city_id"​ id="city_id" class="form-control">
                                                <option value="">Pick a city...</option>
                                                @foreach($cities as $city)
                                                    @if($city->id == $package->ra_city_id)
                                                        <option selected value="{{ $city->id }}">{{ $city->name }}</option>
                                                    @else
                                                        <option value="{{ $city->id }}">{{ $city->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('ra_city_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('ra_district_id', 'District', array('class' => 'required')) !!}
                                            <select name="ra_district_id"​ id="adr_district_id" class="form-control">
                                                <option value="">Pick a district...</option>
                                                @foreach($districts as $districts)
                                                    @if($districts->id == $package->ra_district_id)
                                                        <option selected value="{{ $districts->id }}">{{ $districts->name }}</option>
                                                    @else
                                                        <option value="{{ $districts->id }}">{{ $districts->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('ra_district_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('ra_commune_id', 'Commune', array('class' => 'required')) !!}
                                            <select name="ra_commune_id"​ id="adr_commune_id" class="form-control">
                                                <option value="">Pick a commune...</option>
                                                @foreach($communes as $communes)
                                                    @if($communes->id == $package->ra_commune_id)
                                                        <option selected value="{{ $communes->id }}">{{ $communes->name }}</option>
                                                    @else
                                                        <option value="{{ $communes->id }}">{{ $communes->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('ra_commune_id') }}</samp>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="kt-portlet__foot">
                                <div class="kt-form__actions">
                                    {{ Form::button('<i class="fa fa-plus"></i> Edit Package', array('type' => 'submit', 'class' => 'btn btn-brand mb-2')) }}
                                    <a href="{{ url('list_packages/'.$package->order_id) }}" class="btn btn-warning btn-elevate btn-icon-sm mb-2"><i class="fa fa-backward"></i>Go Back</a>
                                </div>
                            </div>
                        {{ Form::close() }}
                    </div>
                </div>
                <!--end::Portlet-->
            </div>
        </div>
    </div>
    <!-- end:: Content -->
</div>

<script>
    $('#country_id').change(function() {
        var country_id = $('#country_id').val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        $.ajax({
            url: "{{ url('/getCity') }}",
            type: "POST",
            data: { country_id: country_id },
            cache: false,
            success: function(dataResult){
                $("#city_id").html(dataResult); 
            }
        });
    });

    $('#city_id').change(function() {
        var city_id = $('#city_id').val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        $.ajax({
            url: "{{ url('/getDistrict') }}",
            type: "POST",
            data: { city_id: city_id },
            cache: false,
            success: function(dataResult){
                $("#adr_district_id").html(dataResult); 
            }
        });
    });

    $('#adr_district_id').change(function() {
        var adr_district_id = $('#adr_district_id').val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        $.ajax({
            url: "{{ url('/getCommune') }}",
            type: "POST",
            data: { adr_district_id: adr_district_id },
            cache: false,
            success: function(dataResult){
                $("#adr_commune_id").html(dataResult); 
            }
        });
    });
</script>
@endsection