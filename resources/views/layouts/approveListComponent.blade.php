<div id="_mainApproveListComponent" style="display:none;">

    <div class="d-flex justify-content-between" style="padding:15px;">
        <div class="d-flex col-md-6">
          <button style="margin-right:10px;background:#d5e9f6;font-weight:bold;" class="btn btn-default" id="btnAddWaitingList">+ Approve List</button>
          <input style="width:50%;margin-right:10px;" type="text" class="form-control" placeholder="Search applicant">
          <a style="padding:5px 10px 0 10px;border-radius:3px;background:#e6ecff;margin-right:10px;" href="#"><i class="fas fa-sync-alt"></i></a>
        </div>

        <div class="d-flex justify-content-end col-md-6">
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#e6ecff;margin-right:10px;" href="#"><i class="fa-solid fas fa-print"></i> Print</a>
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#ffe6e6;margin-right:10px;" href="#"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#ccffcc;" href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a>
        </div>
    </div>
    

    <div style="padding-left:15px;padding-right:15px;">
        <table class="table" id="_mainApproveListComponent_table"></table>
    </div>
</div>

<script  src="{{ asset('js/ApproveListComponent.js') }}"></script>