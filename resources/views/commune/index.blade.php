@extends('master')
@section('page_title', 'Commune')
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
                                Commune List
                            </h3>
                        </div>
                        <div class="kt-portlet__head-toolbar">
                            <div class="btn-group">
                                <button type="button" class="btn btn-brand">
                                    <a href="{{ route('commune.create') }}" style="color: #fff;">
                                        <i class="la la-plus"></i>
                                        <span class="kt-hidden-mobile">New Commune</span>
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
                                    <th>Country</th>
                                    <th>City</th>
                                    <th>District</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php $n = 1; ?>
                                @foreach($commune as $rows)
                                    <tr>
                                        <td>{{ $n }}</td>
                                        <td>{{ $rows->country->country }}</td>
                                        <td>{{ $rows->city->name }}</td>
                                        <td>{{ $rows->district->name }}</td>
                                        <td>{{ $rows->name }}</td>
                                        <td>
                                            <a href="{{ route('commune.edit', $rows->id) }}" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit">
                                                <i class="la la-edit"></i>
                                            </a>

                                            {!! Form::open(['method' => 'DELETE', 'style'=>'display: inline;', 'route' => ['commune.destroy', $rows->id] ]) !!}
                                                {!! Form::button('<i class="la la-trash"></i>', array(
                                                    'type' => 'submit',
                                                    'class'=> 'btn btn-sm btn-clean btn-icon btn-icon-md',
                                                    'onclick'=>'return confirm("Are you sure?")'
                                                )); !!}
                                            {!! Form::close() !!}
                                        </td>
                                    </tr>
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
@endsection