@extends('master')
@section('page_title', 'Create Commune')
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
                                Create New Commune
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        {{ Form::open(array('route' => 'commune.store', 'class' => 'kt-form', 'enctype' => 'multipart/form-data', 'files'=>'true')) }}
                            <div class="kt-portlet__body">
                                <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('country_id', 'Country', array('class' => 'required')) !!}
                                            <select name="country_id"​ id="country_id" class="form-control">
                                                <option value="">Pick a country...</option>
                                                @foreach($country as $countries)
                                                    <option value="{{ $countries->id }}">{{ $countries->country }}</option>
                                                @endforeach
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('country_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('city_id', 'City', array('class' => 'required')) !!}
                                            <select name="city_id"​ id="city_id" class="form-control">
                                                <option value="">Pick a city...</option>
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('city_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {!! Form::label('district_id', 'District', array('class' => 'required')) !!}
                                            <select name="district_id"​ id="district_id" class="form-control">
                                                <option value="">Pick a district...</option>
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('district_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('name', 'Name', array('class' => 'required')) }}
                                            {{ Form::text('name', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('name') }}</samp>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="kt-portlet__foot">
                                <div class="kt-form__actions">
                                    {{ Form::button('<i class="fa fa-plus"></i> Add Commune', array('type' => 'submit', 'class' => 'btn btn-brand mb-2')) }}
                                    <button type="reset" class="btn btn-secondary mb-2"><i class="fa fa-redo"></i>Reset</button>
                                    <a href="{{ route('commune.index') }}" class="btn btn-warning btn-elevate btn-icon-sm mb-2"><i class="fa fa-backward"></i>Go Back</a>
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
                $("#district_id").html(dataResult); 
            }
        });
    });
</script>
@endsection