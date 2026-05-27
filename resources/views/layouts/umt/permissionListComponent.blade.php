<div id="_um_userListComponent" style="width:auto;display:none">
  <div id="_um_userListPanel">
    <div class="row">
      <div class="col-lg-12">
        <div id="_um_filter_panel" style="display:none">
          <div style="height:15px"></div>            
          <a href="javascript:void(0)" id="_loc_lnkUser">
            <i class="fa fa-plus" style="color:green"></i>
            New User
          </a>
          <div class="table_wrapper">
            <table id="_um_tblUsers" class="table" style="width:100%">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Staff ID</th>  
                  <th>Login Name</th>
                  <th>WorkLocation</th> 
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Status</th>                  
                </tr>
              </thead>
              <tbody id="_um_tblUsers_body"></tbody>
            </table>
          </div>                  
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:15px;">
      <div class="col-lg-12">
        <button type="button" class="btn btn-primary" id="_um_btnCloseUserList" style="float:right">
        <i class="fa fa-times"></i>
        Close
      </button>
      </div>
    </div>
  </div>
</div>
<script defer src="{{ asset('js/UserListComponent.js') }}"></script>