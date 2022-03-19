<style>
  table#_um_tblRoles>tbody tr:hover{
     pointer:hand;
  }
</style>
<div id="_um_userManagementComponent" style="width:auto;display:none">
      <!--begin::div#_um_userListPanel -->
      <div id="_um_userListPanel" style="display:none;padding:15px 15px 15px">
          <div class="row">
              <div class="col-lg-12">
                      <div class="form-inline">
                            <a href="#" id="_um_lnkNewUser"><i class="fa fa-plus" style="color:green;"></i> New User</a>               
                              <div class="input-group mb-3" style="margin-top:10px;margin-left:15px">
                                <div class="input-group-prepend">
                                  <span class="input-group-text" id="_um_search_panel"><i class="fa fa-search" style="color:orange"></i></span>
                                </div>
                                <input id="_um_userlist_search" class="form-control form-control-sm" placeholder="Search user" aria-describedby="_um_search_panel"/>
                              </div>
                      </div>
                      <div style="height:15px;width:30%;border-bottom:1.5px solid orange;margin-top:-10px;"></div>     
                      <div id="_um_tblUsers_wrapper"  class="table_wrapper border-style1">
                              <table id="_um_tblUsers" class="table" style="width:100%">
                                          <thead>
                                            <tr>
                                              <th>Login Name</th>
                                              <th></th>
                                              <th>User Class</th>
                                              <th>Full Name</th>
                                              <th>Official ID</th>  
                                              <th>Phone Number</th>
                                              <th>Email</th>
                                              <th>Status</th>       
                                            </tr>
                                            </thead>
                                  <tbody id="_um_tblUsers_body">
                                  </tbody>   
                              </table>
                      </div>                  
              
                </div> <!--end::div.col-lg-12-->
            </div> <!--end::div.row -->
      </div>
      <!--end::div#_um_userListpanel-->

      <!--begin::div#_um_addUserPanel-->
      <div id="_um_addUserPanel" class="border-style1" style="width:auto;display:none;padding:15px">
            <a href="#" id="_um_lnkbackToUserList"><i class="fa fa-chevron-left" style="color:blue"></i> Back</a> 
            <div style="height:15px;width:50%;border-bottom:1.5px solid green;margin-bottom:15px"></div>  
          <div class="row">          
            <div class="col-lg-6"> 
                  <div class="form-group">
                    <label class="control-label">User Class</label>
                    <select type="text" class="form-control" id="_um_adduser_userclass" data-placeholder="User Type">
                      <option value="merchant">Merchant</option>
                      <option value="driver">Driver</option>
                      <option value="admin_support">Admin Support</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="control-label">Login Name</label>
                    <input type="text" class="form-control" id="_um_adduser_loginname" placeholder="Login name" />
                  </div>
                  <div class="form-group">
                    <label class="control-label">Official ID</label> &nbsp;<span style="color:grey;">ID of driver or merchant</span> &nbsp; <a id="_um_adduser_linkFindPerson" href="javascript:void(0)" style="color:green"><i class="fa fa-search"></i></a>
                    <input type="text" class="form-control" id="_um_adduser_officialcode" placeholder="Staff ID/ Official ID" />
                  </div>
                    <!--begin::div extended details -->
                  <div id="_um_extended_details_panel" style="display:none">
                      <div class="form-group">
                        <label class="control-label">Full Name</label>
                        <input type="text" class="form-control" id="_um_adduser_fullname" placeholder="Full name" />
                      </div>
                      
                      <div class="form-group">
                        <label class="control-label">Email</label>
                        <input type="text" class="form-control" id="_um_adduser_email" placeholder="Email" />
                      </div>
                      
                      <div class="form-group">
                        <label class="control-label">Phone Number</label>
                        <input type="text" class="form-control" id="_um_adduser_phone" placeholder="Phone number" />
                      </div>
                  </div>
                    <!--end::div extended details -->
                  
                  </div> 

              <div class="col-lg-6">
                  <div class="form-group">
                    <label class="control-label">Role</label>
                    <select type="text" class="form-control" id="_um_adduser_role" data-placeholder="Role">
                    </select>
                  </div>
                  
                  <div class="form-group" style="display:none">
                        <label class="control-label">Work Location</label>
                        <select type="text" class="form-control" id="_um_adduser_workloc" data-placeholder="Work Location">
                        </select>
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

          <div class="row" style="margin-top:15px;">
          <div class="col-lg-6">
              <div style="float:left">
                  <span id="_um_adduser_error" class="error_text"></span>
                </div> 
          </div>
            <div class="col-lg-6">
              
                <div style="float:right">
                  <button type="button" class="btn btn-warning" id="_um_btnBackToUserList"><i class="fa fa-chevron-left" style="color:blue"></i> Back</button>
                  <button type="button" class="btn btn-primary" id="_um_btnSaveUser"><i class="fa fa-save"></i> Create</button>
                </div>
            </div>
        </div>

      </div>
      <!--end::div#_um_addUserPanel-->

</div> <!--end::div#_um_userManagementComponent --->

<div class="modal fade" id="_um_dlgSetPwd" tabindex="-1" role="dialog" aria-labelledby="_um_dlgSetPwdTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_um_dlgSetPwdTitle">Set Password</h5>
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
        </form>
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
<script async="async" src="{{ asset('js/UserManagementComponent.js') }}"></script>