@extends('master')
@section('page_title', 'Create Slide')
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
                                Create New Slide
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        {{ Form::open(array('url' => 'uploadslide', 'class' => 'kt-form', 'id' => 'kt_form_1', 'enctype' => 'multipart/form-data', 'files'=>'true')) }}
                            <input type="hidden" id="edit" value="0">
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
                                            {{ Form::label('image', 'Image', array('class' => 'required')) }}
                                            <div class="custom-file"> 
                                                {{ Form::file('image', array('class' => 'custom-file-input', 'required')) }}
                                                {{ Form::label('', '', array('class' => 'custom-file-label')) }}
                                            </div>
                                            <samp class="text-danger">{{ $errors->first('image') }}</samp>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                            <div class="kt-portlet__foot">
                                <div class="kt-form__actions">
                                    {{ Form::button('<i class="fa fa-plus"></i> Add Slide', array('type' => 'submit', 'class' => 'btn btn-brand mb-2')) }}
                                    <button type="reset" class="btn btn-secondary mb-2"><i class="fa fa-redo"></i>Reset</button>
                                    <a href="{{ route('slides.index') }}" class="btn btn-warning btn-elevate btn-icon-sm mb-2"><i class="fa fa-backward"></i>Go Back</a>
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