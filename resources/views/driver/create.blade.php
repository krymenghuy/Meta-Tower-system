@extends('master')
@section('page_title', 'Create Driver')
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
                                Create New Driver
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        {{ Form::open(array('route' => 'driver.store', 'class' => 'kt-form', 'enctype' => 'multipart/form-data', 'files'=>'true')) }}
                            <div class="kt-portlet__body">
                                <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('name', 'Name', array('class' => 'required')) }}
                                            {{ Form::text('name', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('name') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('date_of_birth', 'Date Of Birth', array('class' => 'required')) }}
                                            {{ Form::text('date_of_birth', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('date_of_birth') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('phone_number', 'Phone Number', array('class' => 'required')) }}
                                            {{ Form::text('phone_number', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('phone_number') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('emergency_contact_phone', 'Emergency Contact', array('class' => 'required')) }}
                                            {{ Form::text('emergency_contact_phone', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('emergency_contact_phone') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('national_id', 'Nationality', array('class' => 'required')) }}
                                            {{ Form::text('national_id', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('national_id') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('driver_license_number', 'Driver License Number', array('class' => 'required')) }}
                                            {{ Form::text('driver_license_number', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('driver_license_number') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('current_address', 'Current Address', array('class' => 'required')) }}
                                            {{ Form::text('current_address', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('current_address') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('vehicle_type', 'Vehicle Type', array('class' => 'required')) }}
                                            <select name="vehicle_type" class="form-control">
                                                <option value="">Pick a vehicle type...</option>
                                                <option value="car">Car</option>
                                                <option value="toktok">TokTok</option>
                                                <option value="motobike">Motobike</option>
                                            </select>
                                            <samp class="text-danger">{{ $errors->first('vehicle_type') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('vehicle_number', 'Vehicle Type', array('class' => 'required')) }}
                                            {{ Form::text('vehicle_number', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('vehicle_number') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('vehicle_make', 'Vehicle Make', array('class' => 'required')) }}
                                            {{ Form::text('vehicle_make', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('vehicle_make') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('vehicle_year', 'Vehicle Year', array('class' => 'required')) }}
                                            {{ Form::text('vehicle_year', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('vehicle_year') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('vehicle_des', 'Vehicle Description', array('class' => 'required')) }}
                                            {{ Form::text('vehicle_des', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('vehicle_des') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('employment_type', 'Employment Type', array('class' => 'required')) }}
                                            {{ Form::text('employment_type', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('employment_type') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('salary', 'Salary', array('class' => 'required')) }}
                                            {{ Form::text('salary', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('salary') }}</samp>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            {{ Form::label('commission_percent', 'Commission Percent', array('class' => 'required')) }}
                                            {{ Form::text('commission_percent', '', array('class' => 'form-control')) }}
                                            <samp class="text-danger">{{ $errors->first('commission_percent') }}</samp>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="kt-portlet__foot">
                                <div class="kt-form__actions">
                                    {{ Form::button('<i class="fa fa-plus"></i> Add Driver', array('type' => 'submit', 'class' => 'btn btn-brand mb-2')) }}
                                    <button type="reset" class="btn btn-secondary mb-2"><i class="fa fa-redo"></i>Reset</button>
                                    <a href="{{ route('driver.index') }}" class="btn btn-warning btn-elevate btn-icon-sm mb-2"><i class="fa fa-backward"></i>Go Back</a>
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

@endsection