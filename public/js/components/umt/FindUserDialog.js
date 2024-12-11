"use strict";
//begin:: FindUserDialog
window.FindUserDialog = window.FindUserDialog || new function () {
    let mThis = this;
    this.self = main_view.VSAppContent.querySelector('#_um_dlgFindUser');
    this.modal = new bootstrap.Modal(this.self);
    this.elTitle = this.self.querySelector('.modal-title');
    this.elSearch = this.self.querySelector('.search-user');
    this.btnOK = this.self.querySelector('#_um_dlgFindUser_btnOK');
 
    this.options = {};
    const found_student_cols = [
       {
         "title":"Login Name",
         "data":(data,index,tr)=>{
            return data.login_name;
         }
       },
       {
        "title":"Full Name",
        "data":(data,index,tr)=>{
           return data.full_name;
        }
      },
      {
        "title":"ID",
        "data":(data,index,tr)=>{
           return data.official_code;
        }
      },
      {
        "title":"Phone Number",
        "data":(data,index,tr)=>{
           return data.phone_number;
        }
      },
      {
        "title":"User Class",
        "data":(data,index,tr)=>{
           return data.user_class;
        }
      },
      {
        "title":"Role Name",
        "data":(data,index,tr)=>{
           return data.role_name;
        }
      }
    ];

    this.foundUserList = new ListView('_um_role_found_user_list',{
         columns:found_student_cols,
         fetchApi:[main_view.base_url, '/api/user/list-paginate'].join(''),
         apiCluster:null,
         clientSidePagination:false,
         perPage:5,
         rowCreated:(data,index,tr)=>{
            tr.dataset.id = data.id || data.user_id;
            tr.dataset.login =  data.login_name;
            tr.dataset.name = data.full_name;
            tr.dataset.officialcode = data.official_code;
            tr.dataset.phonenumber = data.phone_number;
            tr.dataset.email = data.email;
            tr.dataset.rolename = data.role_name;
            tr.dataset.roleid = data.role_id;
            tr.dataset.userclass = data.user_class;
         }
    });

    mThis.tblUsers = this.foundUserList.getTable();

    /** find User on FindUserDialog */
    mThis.elSearch.addEventListener('keyup', e => {
        e.preventDefault();
        setTimeout(()=>{
            mThis.foundUserList.showPage({"search_value":mThis.elSearch.value});
        },250);
       
    });

    this.tblUsers.addEventListener('click', e => {
        e.preventDefault();
        let tr = e.target.closest('tr');
        if (tr) {
            tr.classList.toggle('selected');
            tr.querySelector('td:first-child').classList.toggle('checked');
        }
    });
    
 
    this.btnOK.onclick =  e => {
        e.preventDefault();
        let users = mThis.getSelection();
        if (!users[0]) {
            cv_interact.warning("No users selected");
            return;
        }
        if (typeof mThis.options.onClose === 'function') mThis.options.onClose(users);
        //if (mThis.modal)
         mThis.modal.hide(); 
        //else mThis.jm.modal('hide');
    };

    this.getSelection = () => {
        let ps = [];
        mThis.tblUsers.querySelectorAll('tr.selected').forEach(tr => {
            const d = tr.dataset;
            ps.push({ "id": d.id, "login_name":d.login, "name": d.name, "user_class": d.userclass, "role_name":d.rolename, "role_id":d.roleid });
        }); 
        return ps;
    }
  
    this.renderUsers = (users = []) => {
        const tbody = mThis.tblUsers.querySelector('tbody');
        tbody.innerHTML = '';
        let cnt = 0;
        let html = '';
        (users || []).map(user => {
            html = [html, `<tr data-id="${user.id}"><td class="checkbox"></td>`,
            `<td>`, user.login_name, `</td>`,
            `<td>`, user.full_name, `</td>`,
            `<td>`, user.phone_number ? user.phone_number : 'Not Available', `</td>`,
            `<td>`, user.user_class, `</td>`,
            `<td>`,user.role_name,`</td>`,
            `</tr>`].join('');
            cnt++;
        });
        if (cnt === 0) html = `<tr><td colspan="100%"><div class="p-3 text-center text-secondary w-100"> No matched users!</div></td></tr>`;
        tbody.innerHTML = html;
    }
 
    this.show = (options = null) => {
        options = options || {};
        mThis.options = options;
        mThis.onSelect = options.onSelect;
        mThis.elSearch.value  = '';
        //mThis.tblUsers.querySelector('tbody').innerHTML = '<tr><td colspan="100%"><div class="w-100 d-flex flex-wrap justify-content-center p-3"><h5>Search for users</h5> </div></td></tr>';

        //if (mThis.modal) 
        mThis.modal.show(); 
        // mThis.jm.modal({
        //     'backdrop': "static"
        // });
    }
}
//end:: FindUserDialog
