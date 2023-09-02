"use strict";
var ManageAccountComponent = new function(){
    let mThis = this;
    this.title_prop = "Manage Account";
    this.self = $('#_main_manageAccountComponent');

    this.btnAdd = mThis.self.find('#_mna_btn_new');

    this.cols = [{
        title: "Name",
        data: (data, index, tr) => {
            let father_name = data.parents && data.parents[0].name ? data.parents[0].name : '',
            mother_name = data.parents && data.parents[1].name ? data.parents[1].name : '', father_photo = data.parents && data.parents[0].image_url ? data.parents[0].image_url : '', mother_photo = data.parents && data.parents[1].image_url ? data.parents[1].image_url : '';

            return [`<div class="d-flex align-items-center gap-2">
                <img class="image-student-tbl" src="${father_photo}" alt=""/>
                <p class="pb-0 mb-1 text-capitalize">${father_name}</p>
            </div>
            <hr class="p-0"/>
            <div class="d-flex align-items-center gap-2">
                <img class="image-student-tbl" src="${mother_photo}" alt=""/>
                <p class="pb-0 mb-1 text-capitalize">${mother_name}</p>
            </div>`].join('');
        }
    },
    {
        title: "Phone Number",
        className: "align-middle",
        data: (data, a, b) => {
            let father_phone = data.parents && data.parents[0].phone_number ? data.parents[0].phone_number : '', mother_phone = data.parents && data.parents[1].phone_number ? data.parents[1].phone_number : '';
            return [`<p class="pb-0 mb-1">${father_phone}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_phone}</p>`].join('');
        }
    },
    {
        title: "Email",
        className: "align-middle",
        data: (data, a, b) => {
            let father_email = data.parents && data.parents[0].email ? data.parents[0].email : '', mother_email = data.parents && data.parents[1].email ? data.parents[1].email : '';
            return [`<p class="pb-0 mb-1">${father_email}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_email}</p>`].join('');
        }
    },
    {
        title: "National Card ID",
        className: "align-middle",
        data: (data, a, b) => {
            let father_nid = data.parents && data.parents[0].n_id ? data.parents[0].n_id : '', mother_nid = data.parents && data.parents[1].n_id ? data.parents[1].n_id : '';
            return [`<p class="pb-0 mb-1">${father_nid}</p>
            <hr class="p-0"/>
            <p class="pb-0 mb-1">${mother_nid}</p>`].join('');
        }
    },
    {
        title: "Family ID",
        className: "align-middle",
        data: (data, index, tr) => {
            let family_code = data.family_code ? data.family_code : '';
            return family_code;
        }
    },
    {
        title: "Action",
        className: "align-middle",
        data: (data, a, b) => {
            let father_id = data.parents && data.parents[0].id, mother_id = data.parents && data.parents[1].id
            parent = [father_id,mother_id].join('-');
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-mna-add_img" data-id="${parent}">
                    <i class="fa-solid fa-image-portrait text-info fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-mna-details" data-id="${data.family_code}">
                    <i class="fa-solid fa-up-right-from-square text-success fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.itemView = new ListView('tbl__mna',{
            'fetchApi':`${main_view.base_url}/api/guardian/list`,
            'columns': mThis.cols,
            'tableClass':"table header-light-blue header-uppercase",
            'rowCreated':(data, index, tr) => {
                tr.dataset.id = data.id;
            },
            'beforeRender':()=>{}
        });
        mThis.tblParent = $(mThis.itemView.getTable());

        mThis.tblParent.on('click','a.btn-mna-add_img',function(e){
            e.preventDefault();
            let parent = $(this).data('id'),
            id = parent.split('-');
            let op = {
                'father_id': id[0],
                'mother_id': id[1],
                'action': 'add-photo',
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            ManageAccountDialog.show(op);
        });

        mThis.tblParent.on('click','a.btn-mna-details',function(e){
            e.preventDefault();
            let op = {
                'family_id': $(this).data('id'),
                'action': 'get-child',
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            ManageAccountDialog.show(op);
        });

        mThis.btnAdd.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.itemView.showPage(null);
                }
            };
            ManageAccountDialog.show(op);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.itemView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

let ManageAccountDialog = new function(){
    let mThis = this;
    this.self = $('#dlg__mna');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.elBody = mThis.self.find('#dlg_mna_body');
    this.btnSave = mThis.self.find('#dlg_mna_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = {};
        if(mThis.options.action === 'add-photo'){
            p = mThis.getImage(mThis.elBody);
            vsapi.call(`${main_view.base_url}/api/guardian/save`,p,null).then(res => {
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onClose === 'function')
                        mThis.options.onClose();
                }
                else{
                    cv_interact.error(res.error_message);
                }
            });
        }
    });

    this.inputParentPhoto = (div,options) => {
        let dialog = div.closest('.modal-dialog');
        dialog.removeClass('modal-lg');
        dialog.find('.modal-footer').show();
        let html = [`<div class="row row-cols-lg-2 gy-2">
            <div class="col">
                <div class="form-group">
                    <label for="father_photo" class="form-label trans-text" data-langprop="titles.Father Photo"></label>
                    <div class="border w-100 rounded-3 height-photo">
                        <div class="add-photo d-flex align-items-center justify-content-center w-100 h-100">
                            <i class="fa-solid fa-image-portrait fs-3 text-muted"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label for="mother_photo" class="form-label trans-text" data-langprop="titles.Mother Photo"></label>
                    <div class="border w-100 rounded-3 height-photo">
                        <div class="add-photo d-flex align-items-center justify-content-center w-100 h-100">
                            <i class="fa-solid fa-image-portrait fs-3 text-muted"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>`].join('');

        div.html(html);
        mThis.chooseImage(div,options);
        LocaleManager.translateZone('dlg_mna_body');
    }

    this.chooseImage = (div,op) => {
        div.find('.add-photo').on('click',function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    let parent = $(this).parent(), label = parent.siblings().attr('for');
                    let html = [`<img class="w-100 h-100 object-fit-contain rounded data-input" src="${d.dataUrl}" alt="${d.file_type}" data-id="${op[`${label.split('_')[0]}_id`]}"/>
                    <div class="btn-delete position-absolute rounded bg-dark p-2 top-0 end-0">
                        <a href="javascript:void(0)" class="photo-delete">
                            <i class="fa-regular fa-trash-can fs-5 text-danger" role="button"></i>
                        </a>
                    </div>`].join('');
                    parent.html(html);
                    mThis.deleteImage(parent,op);
                }
            });
        });
    }

    this.deleteImage = (div,op) => {
        div.on('click','a.photo-delete',function(e){
            e.preventDefault();
            let html = [`<div class="add-photo d-flex align-items-center justify-content-center w-100 h-100">
                <i class="fa-solid fa-image-portrait fs-3 text-muted"></i>
            </div>`].join('');
            div.html(html);
            mThis.chooseImage(div,op);
        });
    }

    this.getImage = (div) => {
        let p = {
            'parent_info': []
        };
        div.find('.data-input').each(function(){
            let el = $(this);
            p.parent_info.push({
                'photo': el.attr('src'),
                'id': el.data('id')
            });
        });
        return p;
    }

    this.displayChildren = (div,op) => {
        let dialog = div.closest('.modal-dialog');
        if(!(dialog.hasClass('modal-lg'))) dialog.addClass('modal-lg');
        dialog.find('.modal-footer').hide();
        div.empty();
        mThis.getChildren(div,op);
    }

    this.getChildren = (div,op) => {
        vsapi.call(`${main_view.base_url}/api/guardian/children-details`,{'family_id': op.family_id},null,false).then(res => {
            let d = [];
            if(res.status_code === 200){
                d = res.data;
            }
            let html = null, inner_html = null;
            html = [`<div class="table-responsive p-3 tbl-on-hover-to-scroll">
                <table class="table">
                    <thead>
                        <tr class="text-nowrap text-primary">
                            <td>Student ID</td>
                            <td>Photo</td>
                            <td>Student Name</td>
                            <td>Student Name (KH)</td>
                            <td>Date Of Birth</td>
                            <td>Sex</td>
                            <td>Place Of Birth</td>
                            <td>Address</td>
                            <td>Phone Number</td>
                        </tr>
                    </thead>
                    <tbody>
                        ${inner_html=null,d.map(child => {
                            inner_html = [inner_html,`<tr class="text-nowrap">
                                <td class="align-middle">${child.code ? child.code : ''}</td>
                                <td>
                                    <img class="image-student-tbl" src="${child.image_url ? child.image_url : ''}" alt=""/>
                                </td>
                                <td class="align-middle">${child.name ? child.name : ''}</td>
                                <td class="align-middle">${child.name_kh ? child.name_kh : ''}</td>
                                <td class="align-middle">${child.date_of_birth ? new Date(child.date_of_birth).toLocaleDateString('km-KH',{
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }).replaceAll(' ','-').replace(',','') : ''}</td>
                                <td class="align-middle">${child.sex === 'M' ? 'Male' : 'Female'}</td>
                                <td class="align-middle">${child.place_of_birth ? child.place_of_birth : ''}</td>
                                <td class="align-middle">${child.address ? child.address : ''}</td>
                                <td class="align-middle">${child.phone_number ? child.phone_number : 'N/A'}</td>
                            </tr>`].join('');
                        }),inner_html}
                    </tbody>
                </table>
            </div>`].join('');
            div.html(html);
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if((options.father_id > 0) || (options.mother_id > 0)){
            mThis.elTitle.text(LocaleManager.trans('Add Photo','titles'));
            mThis.inputParentPhoto(mThis.elBody,options);
        }
        else if(options.family_id){
            mThis.elTitle.text(LocaleManager.trans('Children','titles'));
            mThis.displayChildren(mThis.elBody,options);
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('Connected Students','titles'));
        }
        mThis.self.modal({
            backdrop: 'static',
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ManageAccountComponent.init();
});