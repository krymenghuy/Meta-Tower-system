<style>
    table#_um_tblRoleModules>tbody td {
        padding: 5px;
        font-size: 18px;
        margin-top: 5px;
        font-weight: bold;

    }

    table#_um_tblRoles td {
        vertical-align: 'middle';
    }

    #_um_roleManagementComponent table td,
    #_um_roleManagementComponent table th {
        font-size: 0.9em;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';

    }

    table#_um_addprn_tblPrns>thead th {
        font-size: 1em;
        font-weight: normal;
        text-transform: uppercase;
    }

    .prn_btn_action {
        width: 64px;
    }

    .tr-allowed td.prn-name {
        color: green;
    }

    .tr-allowed td.prn-icon::before {
        content: 'Allowed';
    }

    .tr-disallowed td.prn-icon::before {
        content: 'Not Allowed';
    }

    .tr-disallowed td.prn-name {
        color: #000;
    }

    .btn_role_action {
        width: 35px;
    }

</style>

<div id="_um_roleManagementComponent" style="width:auto;display:none;margin:15px 15px 15px">
    <!--begin::div.row  RoleList-->
    <div id="_um_roleListPanel" style="width:auto;display:none">
        <div class="row">
            <div class="col-lg-4">
                <div class="form-inline">
                    <span style="font-size:0.9em;font-weight:bold;display:block;padding:2px;color:grey;"
                        class="trans-text" data-langprop="titles.available roles">AVAILABLE ROLES</span>
                    &nbsp;<a href="javascript:void(0)"
                        style="min-width:35px;text-align:center;border-radius:50%;border:1.1px dotted green;padding:3px;margin:5px;"
                        id="_um_lnkNewRole"><i class="fa fa-plus" style="color:green;"></i></a>
                </div>
                <div class="table_wrapper" style="height:40vw;border-radius:3px;">
                    <table id="_um_tblRoles" data-toggle="dropdown" class="table fixed-body-table">
                        <tbody id="_um_tblRoles_body" style="max-height:39vw">
                        </tbody>
                    </table>
                </div>
            </div>
            <!--end: div.col-lg-6-->

            <div class="col-lg-8">
                <div class="tab-view" id="_um_roleTabView">
                    <div class="tab-header">
                        <a href="#" class="tab-button" data-viewname="users" id="_um_roletab_button_users"
                            data-target="tab_panel_users">USERS</a>
                        <a href="#" class="tab-button" data-viewname="modules" id="_um_roletab_button_modules"
                            data-target="tab_panel_modules">MODULES</a>
                        <a href="#" class="tab-button" data-viewname="permissions" id="_um_roletab_button_prns"
                            data-target="tab_panel_prns">PERMISSIONS</a>
                    </div>
                    <div style="height:5px;"></div>
                    <div class="tab-body">
                        <div class="tab-panel border-3d" data-viewname="users" id="_um_tab_panel_users"
                            style="height:40vw;padding:15px;">
                            <span style="color:grey;font-weight:bold;font-size:12px" id="_um_roletab_users_text">Members
                                of the selected role</span>
                            &nbsp;<a href="#" id="_um_lnkAddRemMember">(<i class="fa fa-plus"
                                    style="color:green"></i>)</a>
                            <div style="height:10px;border-bottom:1px dotted red"></div>
                            <table id="_um_tblRoleMembers" class="table fixed-body-table">
                                <thead>
                                    <tr>
                                        <th>Login</th>
                                        <th>Full Name</th>
                                        <th>Official ID</th>
                                        <th>Phone</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="_um_tblRoleMembers_body" style="height:30vw">
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-panel border-3d" data-viewname="modules" id="_um_tab_panel_modules"
                            style="height:40vw;padding:15px;">
                            <span style="color:grey;font-weight:bold;font-size:12px"
                                id="_um_roletab_module_text">Accessible modules</span>
                            &nbsp;<a href="#" id="_um_lnkAddModule">(<i class="fa fa-plus" style="color:green"></i>)</a>
                            <div style="height:10px;border-bottom:1px dotted orange;margin-bottom:15px"></div>
                            <table id="_um_tblRoleModules" class="table fixed-body-table no-cell-border">
                                <tbody id="_um_tblRoleModules_body" style="height:30vw">
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-panel border-3d" data-viewname="permissions" id="_um_tab_panel_prns"
                            style="height:40vw;padding:15px;">
                            <a href="#" id="_um_roleprn_lnk_add"><i class="fa fa-plus" style="color:green"></i>
                                Manage</a>
                            &nbsp;&nbsp;<a href="#" id="_um_roleprn_lnkLargeView"><i class="fa fa-list-alt"
                                    style="color:orange"></i> Advanced</a>
                            <div style="height:10px;border-bottom:1px dotted green"></div>
                            <table id="_um_roleprn_tblPrns" class="table fixed-body-table">
                                <thead>
                                    <tr>
                                        <th style="width:25%">Code</th>
                                        <th style="width:50%">Description</th>
                                        <!-- <th>Module Name</th>   -->
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="_um_roleprn_tblPrns_body" style="height:25vw;">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!--end:div.tab-body-->
                </div>
            </div>
        </div>
    </div>
    <!--end:: div#_um_roleListPanel-->

    <!--begin::div#_um_edit_role-->
    <div id="_um_edit_role" style="width:auto;border-radius:3px;border:2px dotted #A4ABAF;padding:15px;display:none">

        <a href="#" id="_um_role_backToRoleList"><i class="fa fa-chevron-left" style="color:blue;"></i> Back</a>

        <div class="row">
            <div class="col-lg-6">
                <div style="height:15px;width:60%;border-bottom:1.5px dotted orange;margin-bottom:10px"></div>
                <div class="form-group">
                    <label class="control-label">Role Name</label>
                    <input type="text" class="form-control" id="_um_edit_role_name" placeholder="Role name" />
                </div>
                <div class="form-group">
                    <label class="control-label">User Class</label>
                    <select class="form-control" id="_um_edit_userclass" placeholder="User Class"></select>
                </div>
            </div>
        </div>

        <div class="row" style="margin-top:15px;">
            <div class="col-lg-6">
                <div style="float:left">
                    <span id="_um_edit_role_error" class="error_text"></span>
                </div>
                <div style="float:right">
                    <button type="button" class="btn btn-warning" id="_um_btnBackToRoleList"><i
                            class="fa fa-chevron-left" style="color:blue"></i> Back</button>
                    <button type="button" class="btn btn-primary" id="_um_btnSaveRole"><i class="fa fa-save"></i>
                        Save</button>
                </div>
            </div>
        </div>

    </div>
    <!--end::div#_um_edit_role-->

    <!--begin::PermissionList-->
    <div id="_um_permissionList">
        <div class="row">
            <div class="col-lg-12">
                <a id="_um_prnlist_backToRoleList" href="#"><i class="fa fa-angle-double-left"
                        style="color:green"></i>Back&nbsp;&nbsp;</a><span id="_um_prnlist_lblTitle"
                    style="color:grey;font-weight:bold;font-size:15px">&nbsp; Permission List</span><a href="#"
                    id="_um_prnlist_lnkAddPrn"> (<i class="fa fa-plus" style="color:blue"></i>)</a>
                <a id="_um_prnlist_lnkCreatePrn" href="#" style="float:right">Create permission</a>
                <a id="_um_prnlist_lnkRefeshPrn" href="#" style="float:right">Refresh Prns</a>&nbsp;&nbsp;
                <div style="margin-bottom:10px;height:5px;border-bottom:1.5px solid #DBEEE1"></div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-8">
                <div class="border-style1 table_wrapper">
                    <table class="table fixed-body-table">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Descriptive Name</th>
                                <th>Module Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="_um_tblPrns_body" style="height:410px"></tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
    <!--end::PermissionList-->

</div>
<!--end::div#_um_roleListComponent--->

<!--begin::CreatePermissionDialog-->
<div class="modal fade" id="_um_dlgCreatePrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgCreatePrnTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_um_dlgCreatePrnTitle">Create Permission</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-md-6">
                        <label for="_um_createprn_module" class="col-form-label">Permission Number</label>
                        <div> <input type="number" class="form-control" id="_um_createprn_prn_id"></div>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="_um_createprn_module" class="col-form-label">Permission Name</label>
                        <div> <input type="text" class="form-control" id="_um_createprn_prn"></div>
                    </div>

                    <div class="form-group col-md-12">
                        <label for="_um_createprn_module" class="col-form-label">This permission belongs to</label>
                        <div><select class="form-control" id="_um_createprn_module"></select></div>
                    </div>
                </div>
                <div>
                    <span id="_um_createprn_error" class="error_text"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="_um_createprn_btnOK">Create Now</button>
            </div>
        </div>
    </div>
</div>
<!--endn::CreatePermissionDialog-->

<!--begin::AddPermissionDialog-->
<div class="modal fade" id="_um_dlgAddPrn" tabindex="-1" role="dialog" aria-labelledby="_um_dlgAddPrnTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-lg" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_um_dlgAddPrnTitle">Add/Remove Permissions</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input type="text" class="form-control" id="_um_addprn_search"
                        placeholder="Search permission number or name">
                </div>
                <div class="table_wrapper">
                    <table id="_um_addprn_tblPrns" class="table fixed-body-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Code</th>
                                <th>Permission</th>
                                <th>Module</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="_um_addprn_tblPrns_body" style="max-height:35vw">
                        </tbody>
                    </table>
                </div>
                <div>
                    <span id="_um_addprn_error" class="error_text"></span>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<!--endn::AddPermissionDialog-->
<!-- <script defer src="{{ asset('js/RoleManagementComponent.js') }}"></script> -->
