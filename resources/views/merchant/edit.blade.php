@extends('master')
@section('page_title', 'Edit Merchant')
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
                                Edit Merchant
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        {{ Form::model($merchant, array('route' => array('merchant.update', $merchant->id), 'method' => 'PUT', 'class' => 'kt-form', 'id' => 'kt_form_1', 'enctype' => 'multipart/form-data')) }}
                            <div class="kt-portlet__body">
                                <div class="row">
                                    <div class="col-md-12 col-sm-12">
                                        <div class="form-group">
                                            {!! Form::label('sender_type_id', 'Merchant Type', array('class' => 'required')) !!}
                                            <select name="sender_type_id"​ id="sender_type_id" class="form-control">
                                                <option value="">Pick a country...</option>
                                                @foreach($sendertype as $sendertypes)
                                                    @if($sendertypes->id == $merchant->sender_type_id)
                                                        <option selected value="{{ $sendertypes->id }}">{{ $sendertypes->name }}</option>
                                                    @else
                                                        <option value="{{ $sendertypes->id }}">{{ $sendertypes->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('sender_type_id') }}</samp>
                                            <input type="hidden" name="sender_type" value="merchant"/>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('name', 'Name', array('class' => 'required')) }}
                                            {{ Form::text('name', null, array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('name') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('name_kh', 'Name(KH)', array('class' => 'required')) }}
                                            {{ Form::text('name_kh', null, array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('name_kh') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('phone_number', 'Phone', array('class' => 'required')) }}
                                            {{ Form::text('phone_number', null, array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('phone_number') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('email', 'Email', array('class' => 'required')) }}
                                            {{ Form::text('email', null, array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('email') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('country_id', 'Country', array('class' => 'required')) !!}
                                            <select name="country_id"​ id="country_id" class="form-control">
                                                <option value="">Pick a country...</option>
                                                @foreach($countries as $c_tries)
                                                    @if($c_tries->id == $merchant->country_id)
                                                        <option selected value="{{ $c_tries->id }}">{{ $c_tries->country }}</option>
                                                    @else
                                                        <option value="{{ $c_tries->id }}">{{ $c_tries->country }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('country_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('adr_city_id', 'City', array('class' => 'required')) !!}
                                            <select name="adr_city_id"​ id="city_id" class="form-control">
                                                <option value="">Pick a city...</option>
                                                @foreach($cities as $city)
                                                    @if($city->id == $merchant->adr_city_id)
                                                        <option selected value="{{ $city->id }}">{{ $city->name }}</option>
                                                    @else
                                                        <option value="{{ $city->id }}">{{ $city->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('adr_city_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('adr_district_id', 'District', array('class' => 'required')) !!}
                                            <select name="adr_district_id"​ id="adr_district_id" class="form-control">
                                                <option value="">Pick a district...</option>
                                                @foreach($district as $districts)
                                                    @if($districts->id == $merchant->adr_district_id)
                                                        <option selected value="{{ $districts->id }}">{{ $districts->name }}</option>
                                                    @else
                                                        <option value="{{ $districts->id }}">{{ $districts->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('adr_district_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('adr_commune_id', 'Commune', array('class' => 'required')) !!}
                                            <select name="adr_commune_id"​ id="adr_commune_id" class="form-control">
                                                <option value="">Pick a commune...</option>
                                                @foreach($commune as $communes)
                                                    @if($communes->id == $merchant->adr_commune_id)
                                                        <option selected value="{{ $communes->id }}">{{ $communes->name }}</option>
                                                    @else
                                                        <option value="{{ $communes->id }}">{{ $communes->name }}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('adr_commune_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('business_type', 'Business Type', array('class' => 'required')) }}
                                            {{ Form::text('business_type', null, array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('business_type') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('address', 'Address', array('class' => 'required')) }}
                                            {{ Form::text('address', null, array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('address') }}</samp>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="kt-portlet__foot">
                                <div class="kt-form__actions">
                                    {{ Form::button('<i class="fa fa-plus"></i> Edit Merchant', array('type' => 'submit', 'class' => 'btn btn-brand mb-2')) }}
                                    <button type="reset" class="btn btn-secondary mb-2"><i class="fa fa-redo"></i>Reset</button>
                                    <a href="{{ route('merchant.index') }}" class="btn btn-warning btn-elevate btn-icon-sm mb-2"><i class="fa fa-backward"></i>Go Back</a>
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