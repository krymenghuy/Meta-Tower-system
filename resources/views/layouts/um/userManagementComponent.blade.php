<style>
    table#_um_tblRoles>tbody tr:hover {
        pointer: hand;
    }

    #_um_tblUsers td.col_action,
    #_um_tblUsers th.col_action {
        width: 50px;
    }

    #_um_tblUsers td {
        font-size: 0.9em;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }

    #_um_tblUsers>thead th {
        text-transform: uppercase;
        font-weight: normal;
        font-size: 0.9em;
    }

    .action-icon-active {
        color: red !important;
    }

</style>
<div id="_um_userManagementComponent" style="width:auto;display:none">
    <!--begin::div#_um_userListPanel -->
    <div id="_um_userListPanel" style="display:none;padding:15px 15px 15px">
        <div class="row">
            <div class="col-lg-12">
                <div class="form-inline">
                    <a href="#" id="_um_lnkNewUser" class="btn btn-sm btn-outline-success"><i
                            class="fa fa-user-plus"></i> New User</a>
                    <div class="input-group mb-3" style="margin-top:10px;margin-left:15px">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="_um_search_panel"><i class="fa fa-search"
                                    style="color:orange"></i></span>
                        </div>
                        <input id="_um_userlist_search" class="form-control form-control-sm" placeholder="Search user"
                            aria-describedby="_um_search_panel" />
                    </div>
                </div>
                <!-- <div style="height:15px;width:30%;border-bottom:1.5px solid orange;margin-top:-10px;"></div>      -->
                <div id="_um_tblUsers_wrapper" class="table_wrapper"
                    style="padding:15px;border:1px dotted grey;border-radius:5px;">
                    <table id="_um_tblUsers" class="table fixed-body-table" style="width:100%">
                        <thead>
                            <tr>
                                <th class="col_action"></th>
                                <th>Login Name</th>
                                <th>User Class</th>
                                <th>Full Name</th>
                                <th>Official ID</th>
                                <!-- <th>Phone Number</th>
                                              <th>Email</th> -->
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="_um_tblUsers_body" style="height:40vw">
                        </tbody>
                    </table>
                </div>

            </div>
            <!--end::div.col-lg-12-->
        </div>
        <!--end::div.row -->
    </div>
    <!--end::div#_um_userListpanel-->

    <!--begin::div#_um_addUserPanel-->
    <div id="_um_addUserPanel" class="border-style1" style="width:auto;display:none;padding:15px">
        <a href="#" id="_um_lnkbackToUserList" class="btn btn-sm btn-outline-primary"><i class="fa fa-chevron-left"></i>
            Back</a>
        <div style="height:15px;width:50%;border-bottom:1.5px solid green;margin-bottom:15px"></div>
        <div class="flat-box" style="padding:15px;margin:25px">

            <div class="row">
                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="control-label">User Class</label>
                        <select type="text" class="form-control" id="_um_adduser_userclass"
                            data-placeholder="User Type">
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="borrower">Borrower</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Login Name <span class="text text-muted" style="font-size:0.7em">
                                (Phone number or email)</span></label>
                        <input type="text" class="form-control" id="_um_adduser_loginname"
                            placeholder="phone number or email" />
                    </div>

                    <div class="form-group">
                        <label class="control-label">Full Name</label>
                        <input type="text" class="form-control" id="_um_adduser_fullname" placeholder="" />
                    </div>


                </div>

                <div class="col-lg-6">
                    <div class="form-group">
                        <label class="control-label">Role</label>
                        <select type="text" class="form-control" id="_um_adduser_role" data-placeholder="Role">
                        </select>
                    </div>

                    <div class="form-group" style="display:none">
                        <label class="control-label">Work Location</label>
                        <select type="text" class="form-control" id="_um_adduser_workloc"
                            data-placeholder="Work Location">
                        </select>
                    </div>

                    <div id="_um_div_password">
                        <div class="form-group">
                            <label class="control-label">Password</label>
                            <input type="password" class="form-control" id="_um_adduser_pwd" placeholder="Password" />
                        </div>
                        <div class="form-group">
                            <label class="control-label">Confirm Password</label>
                            <input type="password" class="form-control" id="_um_adduser_confirmpwd"
                                placeholder="Confirm password" />
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
                    <div style="float:right;">
                        <button type="button" class="btn btn-warning" id="_um_btnBackToUserList"><i
                                class="fa fa-chevron-left" style="color:blue"></i> Back</button>
                        <button type="button" class="btn btn-primary" id="_um_btnSaveUser"><i class="fa fa-save"></i>
                            Create</button>
                    </div>
                </div>

            </div>

        </div>
        <!--close flat-box -->

    </div>
    <!--end::div#_um_addUserPanel-->

</div>
<!--end::div#_um_userManagementComponent --->

<div class="modal fade" id="_um_dlgSetPwd" tabindex="-1" role="dialog" aria-labelledby="_um_dlgSetPwdTitle"
    aria-hidden="true">
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
<!-- <script async="async" src="{{ asset('js/UserManagementComponent.js') }}"></script> -->
