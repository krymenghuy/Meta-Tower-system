@extends('master')
@section('page_title', 'District')
@section('admin_content')
<div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
    <div id="app">  
        <router-view></router-view>
    </div>
</div>
@endsection