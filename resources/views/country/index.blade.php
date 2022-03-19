@extends('master')
@section('page_title', 'Country')
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
                                Country List
                            </h3>
                        </div>
                        <div class="kt-portlet__head-toolbar">
                            <div class="btn-group">
                                <button type="button" class="btn btn-brand">
                                    <a href="#add-country" data-toggle="modal" style="color: #fff;">
                                        <i class="la la-plus"></i>
                                        <span class="kt-hidden-mobile">New Country</span>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $n = 1; ?>
                                @foreach($country as $rows)
                                    <tr>
                                        <td>{{ $n }}</td>
                                        <td>{{ $rows->country }}</td>
                                        <td>
                                            <a href="#edit{{ $rows->id }}" data-toggle="modal" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit">
                                                <i class="la la-edit"></i>
                                            </a>

                                            {!! Form::open(['method' => 'DELETE', 'style'=>'display: inline;', 'route' => ['country.destroy', $rows->id] ]) !!}
                                                {!! Form::button('<i class="la la-trash"></i>', array(
                                                    'type' => 'submit',
                                                    'class'=> 'btn btn-sm btn-clean btn-icon btn-icon-md',
                                                    'onclick'=>'return confirm("Are you sure?")'
                                                )); !!}
                                            {!! Form::close() !!}
                                        </td>
                                    </tr>
                                    <?php $n++; ?>

                                    <div class="modal" id="edit{{ $rows->id }}" data-backdrop="static" data-keyboard="false">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <!-- Modal Header -->
                                                <div class="modal-header">
                                                    <h4 class="modal-title"><i class="fa fa-times" aria-hidden="true"></i> Edit Country</h4>
                                                    <button type="button" class="close" data-dismiss="modal"></button>
                                                </div>
                                                {{ Form::model($rows, array('url' => array('country', $rows->id), 'method' => 'PUT', 'enctype' => 'multipart/form-data')) }}
                                                    <div class="modal-body">
                                                        <div class="row">
                                                            <div class="col-md-12">
                                                                <div class="form-group">
                                                                    {{ Form::label('name', 'Name', array('class' => 'required')) }}
                                                                    {{ Form::text('name', $rows->country, array('class' => 'form-control', 'required')) }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <!-- Modal footer -->
                                                    <div class="modal-footer">
                                                        <button type="submit" class="btn btn-primary" id="checking_cancel"><i class="fa fa-check"></i>Submit</button>
                                                        <button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i>Close</button>
                                                    </div>
                                                {{ Form::close() }}
                                            </div>
                                        </div>
                                    </div>

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

<div class="modal" id="add-country" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
                <h4 class="modal-title"><i class="fa fa-times" aria-hidden="true"></i> Add Country</h4>
                <button type="button" class="close" data-dismiss="modal"></button>
            </div>
            {{ Form::open(array('url' => 'country', 'class' => 'kt-form', 'enctype' => 'multipart/form-data')) }}
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                {{ Form::label('name', 'Name', array('class' => 'required')) }}
                                {{ Form::text('name', null, array('class' => 'form-control', 'required')) }}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="checking_cancel"><i class="fa fa-check"></i>Submit</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-times" aria-hidden="true"></i>Close</button>
                </div>
            {{ Form::close() }}
        </div>
    </div>
</div>
@endsection