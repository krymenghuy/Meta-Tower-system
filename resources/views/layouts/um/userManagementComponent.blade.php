<style>
  table#_um_tblRoles > tbody tr:hover{
    pointer:hand;
  }

  #_um_tblUsers > thead th{
    color:grey !important;
    text-transform:uppercase;
    border-bottom:none;
    font-size:0.9em;
  }

  #_um_tblUsers > tbody td{
    font-size:0.9em;
  }

  #_um_tblUsers > tbody tr i:hover{
    color:grey;
  }
</style>

<div id="_um_userManagementComponent" class="mobile-padding" style="display:none">
  <div id="_um_userListPanel" style="display:none">
    <div class="row">
      <div class="col-lg-12">
        <div class="form-inline">
          <a href="javascript:void(0)" class="btn btn-outline-success" id="_um_lnkNewUser">
            <i class="fa fa-user-plus" style="color:green"></i>
            New User
          </a>            
          <div class="input-group mb-3" style="margin-top:13px;margin-left:15px">
            <div class="input-group-prepend">
              <span class="input-group-text" id="_um_search_panel">
                <i class="fa fa-search" style="color:orange"></i>
              </span>
            </div>
            <input id="_um_userlist_search" class="form-control" placeholder="Search user" aria-describedby="_um_search_panel"/>
          </div>
          <div class="form-group" style="margin-left:15px">
            <select id="_um_filter_user_class" class="modal-select2 form-control"></select>
          </div>
        </div>
        <div id="_um_tblUsers_wrapper" class="table_wrapper border-style1">
          <table id="_um_tblUsers" class="table table-hover" style="width:100%"></table>
        </div>
      </div>
    </div>
  </div>
  <div id="_um_addUserPanel" class="p-5" style="width:auto;display:none">
    <a href="javascript:void(0)" id="_um_lnkbackToUserList" class="fw-bold btn btn-sm btn-outline-primary">
      <i class="fa fa-chevron-left" style="color:blue"></i>
      Back
    </a>
    <div class="row border border-rounded p-5 mt-3">       
      <div class="col-lg-6">
        <div class="form-group">
          <label class="control-label">User Class</label>
          <select type="text" class="form-select modal-select2" id="_um_adduser_userclass" data-placeholder="User Type">
            <option value="merchant">Merchant</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin Support</option>
          </select>
        </div>
        <div class="form-group">
          <label class="control-label">Login Name</label>
          <input type="text" class="form-control" id="_um_adduser_loginname" placeholder="Login name" />
        </div>
        <div class="form-group">
          <label class="control-label">Official ID</label>
          &nbsp;
          <span style="color:grey">ID of driver or merchant</span>
          &nbsp;
          <a id="_um_adduser_linkFindPerson" class="btn btn-sm btn-outline-success" href="javascript:void(0)" style="color:green">
            <i class="fa fa-search"></i>
          </a>
          <input type="text" class="form-control" id="_um_adduser_officialcode" placeholder="Staff ID/ Official ID" />
        </div>
        <div id="_um_extended_details_panel">
          <div class="form-group">
            <label class="control-label">Full Name</label>
            <input type="text" class="form-control" id="_um_adduser_fullname" placeholder="Full name" />
          </div>
          <div class="form-group" style="display:none">
            <label class="control-label">Email</label>
            <input type="text" class="form-control" id="_um_adduser_email" placeholder="Email" />
          </div>
          <div class="form-group">
            <label class="control-label">Phone Number</label>
            <input type="text" class="form-control" id="_um_adduser_phone" placeholder="Phone number" />
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <label class="control-label">Role</label>
          <select type="text" class="form-select modal-select2" id="_um_adduser_role" data-placeholder="Role"></select>
        </div>
        <div class="form-group" style="display:none">
          <label class="control-label">Work Location</label>
          <select type="text" class="form-control" id="_um_adduser_workloc" data-placeholder="Work Location"></select>
        </div>
        <div id="_um_div_password">
          <div class="form-group">
            <label class="control-label">Password</label>
            <input type="password" class="form-control" id="_um_adduser_pwd" placeholder="Password" />
          </div>
          <div class="form-group">
            <label class="control-label">Confirm Password</label>
            <input type="password" class="form-control" id="_um_adduser_confirmpwd" placeholder="Confirm password" />
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top:15px">
      <div class="col-lg-6">
        <div style="float:left">
          <span id="_um_adduser_error" class="error_text"></span>
        </div>
      </div>
      <div class="col-lg-6">
        <div style="float:right">
          <button type="button" class="btn btn-warning" id="_um_btnBackToUserList">
            <i class="fa fa-chevron-left" style="color:blue"></i>
            Back
          </button>
          <button type="button" class="btn btn-primary" id="_um_btnSaveUser">
            <i class="fa fa-save"></i>
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="_um_dlgSetPwd" tabindex="-1" role="dialog" aria-labelledby="_um_dlgSetPwd_title" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgSetPwd_title">Set Password</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="message-text" class="col-form-label">New Password</label>
          <input type="password" class="form-control" id="_um_setpwd_newpwd">
        </div>
        <div class="form-group">
            <label for="message-text" class="col-form-label">Confirm New Password</label>
            <input type="password" class="form-control" id="_um_setpwd_confirmpwd">
        </div>
      </div>
      <div style="padding-left:15px;padding-right:15px">
        <span id="_um_setpwd_error" class="error_text"></span>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_um_setpwd_btnSave">OK</button>
      </div>
    </div>
  </div>
</div>