'use strict';

// const UMCampusDialog = new function(){
//     const mThis = this;
//     mThis.self = main_view.VSAppContent.querySelector('#dlg_cps_um');
//     mThis.modal = new bootstrap.Modal(mThis.self);
//     mThis.elTitle = mThis.self.querySelector('.modal-title');
//     mThis.divBody = mThis.self.querySelector('#div_cps_body');
//     mThis.btnSave = mThis.self.querySelector('#dlg_cps_um_btn_save');

//     mThis.btnSave.onclick = function(e){
//         e.preventDefault();
//         const p = mThis.getDataForm(false);
//         if(!p) return;
//         vsapi.call(`${main_view.base_url}/api/branch/save`,p,{loade:false,agent:null}).then(res => {
//             if(res.status_code === 200){
//                 mThis.self.modal('hide');
//                 if(typeof mThis.options.onClose === 'function')
//                     mThis.options.onClose();
//             }
//             else{
//                 cv_interact.error(res.error_message);
//             }
//         });
//     };

//     mThis.getDataForm = (silent = false) => {
//         let p = { id: mThis.options.id };
//         let has_error = false;
//         const inputs = mThis.divBody.querySelectorAll('.data-input');

//         inputs.forEach(input => {
//             const field = input.getAttribute('data-field');
//             const hasError = input.getAttribute('data-error') == 1;

//             if (hasError) {
//                 has_error = true;
//                 if (!silent) {
//                     cv_interact.warning(`${Validator.properCase(field)} is not correct`);
//                 }
//                 return;
//             }

//             p[field] = input.value;
//         });

//         return has_error ? null : p;
//     }

//     mThis.setDataForm = (d) => {
//         d = d ?? {};
//         // Validator.clearErrors(mThis.self);
//         const inputs = mThis.divBody.querySelectorAll('.data-input');

//         inputs.forEach(input => {
//             const field = input.getAttribute('data-field');
//             input.value = d[field] ?? '';
//         });
//     }

//     mThis.loadFormDetail = (options) => {
//         vsapi.call(`${main_view.base_url}/api/branch/form-options`,{
//             id: options.id
//         },null).then(res => {
//             let d = {};
//             if(res.status_code === 200){
//                 d = res.data.branch??null;
//             }
//             mThis.setDataForm(d);
//         });
//     }

//     mThis.show = (options) => {
//         if(!options) options = {};
//         mThis.options = options;
//         if(options.id > 0){
//             mThis.elTitle.textContent =LocaleManager.trans('Modify Campus','titles');
//             mThis.loadFormDetail(options);
//         }
//         else{
//             mThis.elTitle.textContent = LocaleManager.trans('New Campus', 'titles');
//             mThis.setDataForm(null);
//         }
//         // mThis.self.modal({
//         //     backdrop: 'static'
//         // });
//         mThis.modal.show();
//     }
// }

var CampusManagementComponent = (()=>{
    const mThis = {};
    mThis.title_prop = 'Campus Management';
    mThis.self = main_view.VSAppContent.querySelector('#_main_campusManagementComponent');
    mThis.tblBrnach = {};
    mThis.btnNew = mThis.self.querySelector('#_cps_btn_new');

    mThis.cols = [
    {
        title: "Campus Name",
        className: 'align-middle',
        data: "name"
    },
    {
        title: "Phone Number",
        className: 'align-middle',
        data: (d,index,tr)=>{
            return d.phone_number ?? '';
        }
    },
    {
        title: "Address",
        className: 'align-middle',
        data: (d, index, tr) => {
            const truncate = (str, len = 25) => {
                if (!str) return '';
                return str.length > len ? str.substring(0, len) + '...' : str;
            };

            const addressKh = truncate(d.address_kh ?? '');
            const address = truncate(d.address ?? d.address_en ?? '');

            return `<span class="d-block">${addressKh}</span>
                    <span class="d-block">${address}</span>`;
       }
    },
    {
        title: "Shortcut",
        className: 'align-middle',
        data: "shortcut"
    },
    {
        title: "Last Updated",
        data:(data, index, tr) => {
            return `<span class="d-block fw-semibold">${data.update_user ?? ''}</span>
            <span>
                <small>${data.updated_at ?? ''}</small>
            </span>`;
        }
    },
    {
        title: "Action",
        className: 'align-middle',
        data: (data, index, tr) => {
            return `<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-edit-branch" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-delete-branch" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`;
        }
    }];

    mThis.init = () => {
        if(mThis.initAlready) return;
        mThis.divBranchList = mThis.divBranchList || mThis.self.querySelector('#_campus_list');
        mThis.branchListView = new ListView(mThis.divBranchList,{
            fetchApi: `${main_view.base_url}/api/branch/list`,
            perPage: 5,
            'tableClass': "table header-light-blue header-uppercase",
            columns: mThis.cols,
            rowCreated: (data, index, tr) => {
               tr.dataset.id = data.id;
            },
            listContainerClass: null
        });
        const pl_container = mThis.branchListView.getListContainer();
        const sh_parent = pl_container.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };
        mThis.tblBrnach = mThis.branchListView.getTable();

        mThis.btnNew.onclick =function(e){
            e.preventDefault();
            const op = {
                id: null,
                onClose: () => {
                    mThis.branchListView.showPage(null);
                }
            };

            if(!AuthManager.allowed(260)) return;
            BranchDialog.show(op);
        };

        mThis.tblBrnach.addEventListener('click',(e) => {
            e.preventDefault();
            let lnk = VSUtil.getElementByClass(e.target,'btn-edit-branch');
            if(lnk){
                const op = {
                    id: lnk.dataset.id,
                    onClose: () => {
                        mThis.branchListView.showPage(null);
                    }
                };

                if(!AuthManager.allowed(261)) return;
                BranchDialog.show(op);
                return;
            }

            lnk = VSUtil.getElementByClass(e.target,'btn-delete-branch');
            if(lnk){
                let op = {
                    id: lnk.dataset.id
                };

                if(!AuthManager.allowed(262)) return;
                cv_interact.confirm('Delete this campus?',{
                    title: 'Delete Campus',
                    context: 'delete'
                },(e) => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/branch/delete`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.branchListView.showPage(null);
                            }
                            else
                                cv_interact.warning(res.error_message );
                        });
                    }
                });
                return;
            }
        });

        mThis.initAlready = true;
    }

    mThis.show = (options) => {
         mThis.init();
        if(!options) options = {};
        main_view.setContentView(mThis.self,mThis.title_prop);
        mThis.branchListView.showPage(null,null,()=>{
        });
    }
    return mThis;
})();

