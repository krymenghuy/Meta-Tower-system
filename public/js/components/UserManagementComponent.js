'use strict';
var UserManagementComponent = new function () {
    let mThis = this;
    this.title_prop = "User Management";
    mThis.base_url = $('#__base_url').val();
    mThis.initialized = false;

    this.init = function(){
        mThis.title = 'Manage Users';
        mThis.self = $('#_um_userManagementComponent');

        mThis.initialized = true;
    };

    this.show = function(options){
        if(!mThis.initialized)
            alert('UserManagementComponent.init() is not called for inialization');

        if(options){
            if(options.title)
                mThis.title = options.title;
            mThis.onClose = options.onClose;
        }
        main_view.setTitle(mThis.title_prop);

        let x = mThis.self.siblings(':visible');
        x.fadeOut('fast', function(){
            mThis.self.hide().fadeIn(200);
        });
        UserListPanel.show();
    };

    this.hide = function(){
        mThis.self.hide();
    };
};

let UserListPanel = new function () {
    let mThis = this;
    this.self = $('#_um_userListPanel');
    mThis.base_url = $('#__base_url').val();
    this.lnkNewUser = $('#_um_lnkNewUser');

    this.elFilter_userclass = $('#_um_filter_user_class');
    this.elSearch = $('#_um_userlist_search');

    this.tblUsers = $('#_um_tblUsers');
    this.div_extended_detail = $('#_um_extended_details_panel');

    vsapi.call(`${this.base_url}/api/user/options-user-class`, null).then(res => {
        if(res.status_code === 200){
            let items = StringSanitizer.sanitizeObject(res.data);
            items.unshift({ 'user_class': null, 'user_class_name': '(All Classes)' });
            VSUtil.setComboItems(mThis.elFilter_userclass, items, 'user_class', 'user_class_name', null, null, null);
        }
    });

    this.lnkNewUser.on('click', function(e){
        e.preventDefault();
        let op = {
            user_class: mThis.elFilter_userclass.val()
        };
        AddUserPanel.show(op);
    });

    mThis.tblUsers.on('mouseover', 'tr', function(e){
        e.preventDefault();
        let el = $(this).find('._um_item_action_button');
        el.show();
    }).on('mouseleave', 'tr',function(e){
        e.preventDefault();
        let el = $(this).find('._um_item_action_button');
        el.hide();
    });

    this.elFilter_userclass.on('change',(e) => {
        e.preventDefault();
        mThis.displayUserList();
    });

    this.elSearch.on('keyup',function(e){
        e.preventDefault();
        let d = $(this).val();
        mThis.displayUserList(d);
    });

    mThis.tblUsers.on('click', 'a.btn-user-setpwd',(e) => {
        e.preventDefault();
        let tr = $(e.target).closest('tr');
        let id = tr.data('id');
        let login_name = tr.data('loginname');
        if(!login_name || login_name == ''){
            cv_interact.error("Login name is empty or invalid");
            return;
        }

        let op = { "login_name": login_name, "user_id": id };
        SetPasswordDialog.show(op);   
    });

    mThis.tblUsers.on('click', 'a.btn-user-delete',(e) => {
        e.preventDefault();
        let tr = $(e.target).closest('tr');
        let id = tr.data('id');
        cv_interact.confirm('Delete this user?', { title: 'Delete user', context: 'delete' }, (e) => {
            if(e){
                mThis.deleteUser(id);
            }
        });
    });

    mThis.tblUsers.on('click', 'a.btn-user-modify',(e) => {
        e.preventDefault();

        let tr = $(e.target).closest('tr');
        let login_name = tr.find('.login_name-text').text();
        mThis.changeLoginName(login_name, tr);
    });

    $(document).on('click', function (e) {
        let container = mThis.tblUsers.find('.dropdown');
        if(container){
            if(!container.is(e.target) && container.has(e.target).length === 0){
                mThis.tblUsers.find('.dropdown-menu').each(function () {
                    $(this).removeClass('show');
                });
            }
        }
        e.stopPropagation();
    });

    mThis.tblUsers.on('click', '.btn-user-action', function(e){
        e.preventDefault();
        let p = $(this).parent();
        let user_id = $(this).data('userid');
        let login_name = $(this).data('loginname');

        let dropdownMenu = p.find('.dropdown-menu');
        if(!dropdownMenu || dropdownMenu.length <= 0){
            p.append(mThis.createDropdownMenuHtml_user(user_id, login_name));
            dropdownMenu = p.find('.dropdown-menu');
        }
        if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) == false) mThis.prev_dropdownMenu.removeClass('show');

        dropdownMenu.toggleClass('show');
        if(dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

        let is_locked = $(this).closest('tr').data('islocked');
        let span = $(this).parent().find('a._um_ua_lock span.menu-text');
        if (is_locked == 1 || is_locked == true)
            span.text('Unlock User');
        else
            span.text('Lock User');
    });

    this.createDropdownMenuHtml_user = function(user_id, loginname){
        let html = ['<div class="dropdown-menu" data-userid="', user_id, '" data-loginname="', loginname, '">',
            '<a class="dropdown-item _um_ua_delete" href="javascript:void(0)"><i class="fa fa-times" style="color:red"></i> Delete User</a>',
            '<a class="dropdown-item _um_ua_change_name" href="javascript:void(0)"><i class="fa fa-user" style="color:grey"></i> Change Login Name</a>',
            '<a class="dropdown-item _um_ua_lock" href="javascript:void(0)"><i class="fa fa-lock" style="color:red"></i> <span class="menu-text">Lock User</span></a>',
            '<a class="dropdown-item _um_ua_setpwd" href="javascript:void(0)"><i class="fa fa-lock" style="color:blue"></i>  Set Password</a>',
            '<div class="dropdown-divider"></div>',
            '</div>'].join('');
        return html;
    }

    mThis.tblUsers.on('click', 'tr>td.col_action a._um_ua_delete', function(e){
        e.preventDefault();
        let user_id = $(this).parent().data('userid');
        if (!user_id) user_id = 0;
        cv_interact.confirm('Delete this user?', { title: 'Delete User', context: 'delete' }, function (e){
            if(e){
                mThis.deleteUser(user_id);
            }
        });
    });

    mThis.tblUsers.on('click', 'tr>td.col_action a._um_ua_change_name', function(e){
        e.preventDefault();
        let login_name = $(this).parent().data('loginname');
        let tr = $(this).closest('tr');
        mThis.changeLoginName(login_name, tr);
    });

    mThis.tblUsers.on('click', 'tr>td.col_action a._um_ua_setpwd', function(e){
        e.preventDefault();
        let login_name = $(this).parent().data('loginname');
        SetPasswordDialog.show(login_name);
    });

    mThis.tblUsers.on('click', 'tr>td.col_action a._um_ua_lock', function(e){
        e.preventDefault();
        let is_locked = $(this).closest('tr').data('islocked');
        let action = 'lock';
        if(is_locked == 1 || is_locked == true){
            $(this).find('span.menu-text').text('Unlock User');
            action = 'unlock';
        }
        else{
            $(this).find('span.menu-text').text('Lock User');
        }

        let p = {};
        p.user_id = $(this).parent().data('userid');

        if (!p.user_id) p.user_id = 0;
        let msg = 'Unlock this user?';
        p.action = 'unlock';

        if (action == 'lock') {
            msg = 'Lock this user?';
            p.action = 'lock';
        }
        cv_interact.confirm(msg, 'User Lockout', function(e){
            if(e){
                vsapi.call([mThis.base_url, '/api/user/set-lock-status'].join(''), p).then(res => {
                    if(res.status_code === 200){
                        mThis.displayUserList(mThis.elSearch.val());
                    }
                    else
                        cv_interact.error(re.error_message);
                });
            }
        });
    });

    mThis.show = function (option) {
        mThis.displayUserList();
        mThis.self.show().siblings().hide();
    }

    this.changeLoginName = (login_name, tr) => {
        let option = {
            'blankErrorMessage': 'Login name cannot be blank',
            'btnOKText': 'Commit Change',
            'defaultValue': login_name,
            'title': 'Change Login Name',
            'dataLabel': 'New login name'
        };
        InputBox1.show(option, function(d){
            if(d){
                if (d !== login_name) {
                    let p = {};
                    p.login_name = login_name;
                    p.new_login_name = d;
                    vsapi.call([mThis.base_url, '/api/user/security/change-login'].join(''), p).then(res => {
                        if(res.status_code === 200){
                            mThis.displayUserList();
                            if(tr)
                                tr.data('loginname', login_name);
                        }
                        else
                            cv_interact.error(res.error_message);
                    });
                }
            }
        });

    }

    this.displayUserList = function (search_value = null) {
        let p = {};
        p.search_value = search_value ? search_value : mThis.elSearch.val();
        p.user_class = mThis.elFilter_userclass.val();
        vsapi.call([mThis.base_url, '/api/getUserList'].join(''), p).then(res => {
            if (res.status_code === 200) {
                if(mThis.table){
                    mThis.tblUsers.DataTable().clear().destroy();
                    mThis.tblUsers.empty();
                    mThis.table = null;
                }

                let data = [];
                if (res.status_code === 200) data = StringSanitizer.sanitizeObject(res.data, null, ['login_name', 'email']);
                let cnt = 1;
                let my_columns = [
                    {
                        title: "No",
                        data: () => {
                            return cnt;
                        }
                    },
                    {
                        className: "login_name login_name-text",
                        data: (user, a, b) => {
                            return ['<span class="fw-semibold text-dark">', user.login_name, '</span>'].join('');
                        },
                        title: 'Login Name'
                    },
                    {
                        title: 'User Class',
                        data: (user, a, b) => {
                            return ['<span style="fw-bold text-secondary">', user.user_class, `</span>`].join('');
                        }
                    },
                    {
                        title: 'Full Name',
                        data: (user, a, b) => {
                            return user.full_name ? user.full_name : 'Unspecified';
                        }
                    },
                    {
                        title: "Official ID",
                        data: (user, a, b) => {
                            return ['<span class="dark-text fw-semibold p-1">', user.official_code ? user.official_code : 'None', '</span>'].join('');
                        }
                    },
                    {
                        className: "status",
                        title: "Status",
                        data: (user, a, b) => {
                            return user.status;
                        }
                    },
                    {
                        title: "Action",
                        className: "col_action",
                        data: function (user, a, b) {
                            return [`<div class="form-inline">`,
                                `<a href="javascript:void(0)" class="btn-user-modify" data-id="${user.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                                `<a href="javascript:void(0);" data-id="${user.id}" class="btn-user-setpwd"><i class="fa fa-user-lock" style="color:orange"></i></a> &nbsp;`,
                                `<a href="javascript:void(0);" data-id="${user.id}" class="btn-user-delete"><i class="fa fa-trash" style="color:red"></i></a> &nbsp;`,
                                `<a style="display:none" href="javascript:void(0);" data-id="${user.id}" class="btn-user-action"><i class="fa fa-list-alt"></i></a>`,
                                `</div>`
                            ].join('');
                        }
                    }
                ];

                if (!mThis.table) {
                    mThis.table = mThis.tblUsers.DataTable({
                        searching: false,
                        destroy: true,
                        paging: true,
                        ordering: false,
                        retrieve: true,
                        info: true,
                        pageLength: 10,
                        bLengthChange: false,
                        saveState: true,
                        processing: true,
                        language: {
                            loadingRecords: '&nbsp;',
                            processing: 'Loading...',
                            emptyTable: 'No data to display'
                        },
                        data: data,
                        columns: my_columns,
                        createdRow: function (row, data, dataIndex) {
                            cnt++;
                            let tr = $(row);
                            tr.data('id', data.id);
                            tr.data('loginname', data.login_name);
                        }
                    });
                }
            }
        });
    }

    this.deleteUser = function(user_id = 0){
        let p = {
            'user_id': user_id
        };
        vsapi.call([mThis.base_url, '/api/user/delete'].join(''), p).then(res => {
            if(res.status_code === 200){
                mThis.displayUserList();
            }
            else
                cv_interact.error(res.error_message);
        });
    }
};

let AddUserPanel = new function () {
    let mThis = this;

    this.self = $('#_um_addUserPanel');
    this.base_url = $('#__base_url').val();
    this.lnkBackToUserList = $('#_um_lnkbackToUserList');
    this.goBackFunction = null;
    this.lnkFindPerson = $('#_um_adduser_linkFindPerson');

    this.btnBack = $('#_um_btnBackToUserList');
    this.btnSave = $('#_um_btnSaveUser');

    this.elError = $('#_um_adduser_error');

    this.elRole = $('#_um_adduser_role');
    this.elUserClass = $('#_um_adduser_userclass');
    this.elLoginName = $('#_um_adduser_loginname');
    this.elOfficialCode = $('#_um_adduser_officialcode');
    this.elFullName = $('#_um_adduser_fullname');

    this.elPassword = $('#_um_adduser_pwd');
    this.elConfirmPwd = $('#_um_adduser_confirmpwd');

    this.elPhoneNumber = $('#_um_adduser_phone');
    this.elEmail = $('#_um_adduser_email');
    this.elWorkLoc = $('#_um_adduser_workloc');
    this.elWorkLoc_type = $('#_um_adduser_workloc_type');
    this.elWorkLoc_map = $('#_um_adduser_workloc_map');

    this.div_extended_detail = $('#_um_extended_details_panel');

    vsapi.call(`${this.base_url}/api/user/options-user-class`, null).then(res => {
        if (res.status_code === 200) {
            let items = StringSanitizer.sanitizeObject(res.data);
            items.unshift({ 'user_class': null, 'user_class_name': '(Choose user class)' });
            VSUtil.setComboItems(mThis.elUserClass, items, 'user_class', 'user_class_name', null, null, null);
        }
    });

    this.lnkBackToUserList.on('click', function (e) {
        e.preventDefault();
        if(typeof mThis.goBackFunction == 'function'){
            mThis.goBackFunction();
        }
        else{
            let options = {};
            options.title = "Manage Users";
            UserListPanel.show(options);
        }
    });

    mThis.lnkFindPerson.on('click', (e) => {
        e.preventDefault();
        let allowed_find_userclasses = ['driver', 'merchant', 'sender'];

        let user_class = mThis.elUserClass.val();
        if (!user_class) {
            cv_interact.error("Please select one user class");
            return;
        }
        user_class = (user_class + '').toLowerCase();
        let title = null;
        if (allowed_find_userclasses.indexOf(user_class) >= 0)
            title = `Find ${user_class}`;
        else{
            cv_interact.error('Admin Support users do not need to have profile details');
            return;
        }

        if (user_class === 'merchant') user_class = 'sender';
        let option = {
            'title': title,
            'role': user_class,
            'singleSelect': true,
            'previousDialog': null
        };
        FindPersonDialog.show(option, (ps) => {
            if(ps[0]){
                let p = ps[0];
                mThis.elOfficialCode.val(p.code).trigger('blur');
                mThis.elFullName.val(p.name);
                mThis.elLoginName.val(p.phone_number);
                mThis.elPhoneNumber.val(p.phone_number);
            }
        });
    });

    mThis.btnBack.on('click', function(e){
        e.preventDefault();
        mThis.lnkBackToUserList.trigger('click');
    });

    mThis.elUserClass.on('change',(e) => {
        e.preventDefault();
        let p = {
            "user_class": mThis.elUserClass.val()
        };
        vsapi.call([mThis.base_url, '/api/role/options-role'].join(''), p).then(res => {
            let rows = StringSanitizer.sanitizeObject(res.data);
            VSUtil.setComboItems(mThis.elRole, rows, 'id', 'name', true, '(Select Role)', 0);
            if(rows[0] && !rows[1])
                mThis.elRole.val(rows[0].id);
        });
    });

    mThis.btnSave.on('click', function(e){
        e.preveventDefault();
        mThis.elError.html(null);
        let p = {};
        p.user_id = mThis.user_id;
        p.role_id = mThis.elRole.val();
        p.login_name = mThis.elLoginName.val();
        p.user_class = mThis.elUserClass.val();
        p.official_code = mThis.elOfficialCode.val();
        p.full_name = mThis.elFullName.val();

        p.password = mThis.elPassword.val();
        p.phone_number = mThis.elPhoneNumber.val();
        p.email = mThis.elEmail.val();
        p.work_location_id = mThis.elWorkLoc.val();

        if (!p.user_id) p.user_id = 0;
        if (!p.login_name) {
            cv_interact.error('User Name cannot be empty');
            return;
        }

        vsapi.call([mThis.base_url, '/api/user/save'].join(''), p).then(res => {
            if(res.status_code === 200){
                mThis.lnkBackToUserList.trigger('click');
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.show = function (option, onClose) {
        mThis.goBackFunction = null;
        if (!option) option = {};
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.goBackFunction = option.goBackFunction;
        mThis.user_id = option.user_id;

        if(mThis.user_id > 0){
            mThis.displayUserDetail(mThis.user_id);
        }
        else{
            mThis.clearForm(null);
        }

        if(option.official_code){
            mThis.elOfficialCode.val(option.official_code).prop('readOnly', true);
            mThis.elLoginName.val(option.phone_number);
            mThis.elFullName.val(option.full_name);
            mThis.elUserClass.val(option.user_class).trigger('change');
        }
        else{
            mThis.elOfficialCode.val(null).prop('readOnly', false);
            mThis.elLoginName.val(null);
            mThis.elFullName.val(null);
            mThis.elUserClass.val(option.user_class).trigger('change');
        }

        mThis.self.parent().show().siblings().hide();
        mThis.self.show().siblings().hide();
    }

    this.loadRoleList = function(role_id, onFinish){
        vsapi.call([mThis.base_url, '/api/role/options-role'].join(''), null).then(res => {
            if(res.status_code === 200){
                let rows = StringSanitizer.sanitizeObject(res.data);
                VSUtil.setComboItems(mThis.elRole, rows, 'id', 'name', true, '(Select User Role)', role_id);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.loadWorkLocationList = function(loc_id, onFinish){
        vsapi.call([mThis.base_url, '/api/user/options-work-location'].join(''), null).then(res => {
            if(res.status_code === 200){
                let rows = res.data;
                VSUtil.setComboItems(mThis.elWorkLoc, rows, 'id', 'name', true, '(Select Work Location)', loc_id);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.clearForm = (option) => {
        mThis.elLoginName.val(null);
        mThis.elFullName.val(null);
    }

    this.displayUserDetail = function(){
        let p = {};
        p.user_id = mThis.user_id;
        p.id = mThis.user_id;
        vsapi.call([mThis.base_url, '/api/user/details'].join(''), p).then(res => {
            if (res.status_code === 200) {
                let d = StringSanitizer.sanitizeObject(res.data);

                mThis.div_extended_detail.show();
                mThis.elUserClass.val(StringSanitizer.sanitizeOut(d.user_class));
                mThis.elLoginName.val(StringSanitizer.sanitizeOut(d.login_name));
                mThis.elFullName.val(StringSanitizer.sanitizeOut(d.full_name));
                mThis.elRole.val(StringSanitizer.sanitizeOut(d.role_id));
            }
        });
    }
};

let SetPasswordDialog = new function () {
    let mThis = this;
    this.self = $('#_um_dlgSetPwd');
    this.elTitle = $('#_um_dlgSetPwd_title');
    this.elPwd = $('#_um_setpwd_newpwd');
    this.elConfirmPwd = $('#_um_setpwd_confirmpwd');

    this.btnSave = $('#_um_setpwd_btnSave');
    mThis.elError = $('#_um_setpwd_error');
    mThis.base_url = $('#__base_url').val();

    this.btnSave.on('click',function(e){
        e.preventDefault();
        mThis.elError.html(null);
        let p = {};
        p.login_name = mThis.login_name;
        p.newPwd = mThis.elPwd.val();
        if(p.newPwd != mThis.elConfirmPwd.val()){
            cv_interact.error('New password and confirm password do not match');
            return;
        }

        vsapi.call([mThis.base_url, '/api/user/security/set-pwd'].join(''), p).then(res => {
            if(res.status_code === 200)
                mThis.self.modal('hide');
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.show = function (option = null) {
        if (!option) option = {};
        mThis.login_name = option.login_name;
        mThis.user_id = option.user_id;
        mThis.elError.html(null);
        mThis.elPwd.val(null);
        mThis.elConfirmPwd.val(null);
        mThis.elTitle.html(`Set Password for ${mThis.login_name}`);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded', function () {
    UserManagementComponent.init();
});