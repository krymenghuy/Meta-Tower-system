"use strict";
var TenantComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Tenant Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_member_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddMember");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_member");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elSearch = mThis.self.querySelector("#_search_member");

    mThis.cols = [

        {
            title: "",
            className: "align-middle ",
        },
      
        {
            title: "Name",
            className: "align-middle   ",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class=" d-block text-yp-custom  text-break" style="width:128px; word-break:break-word;"><small>${data.name ?? ''}</small></span>
                        <small class="text-muted">${sexLabel}</small>`;
            }
        },
        {
            title: "Nationality",
            className: "align-middle ",
            data: (data) => `<span class="text-nowrap text-yp-custom"><small>${data.nationality ?? ''}</small></span>`,
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) => {
                const phone = data.phone_number || 'N/A';

                let telegramHTML = '<span class="text-muted">Telegram: N/A</span>';
                if (data.telegram_link && data.telegram_link.trim() !== '') {
                    const url = data.telegram_link.trim();
                    const displayText = url.replace(/^https?:\/\/t\.me\//, '');

                    const deepLink = displayText.startsWith('+')
                        ? `tg://resolve?phone=${displayText.replace(/^\+/, '')}`
                        : `tg://resolve?domain=${displayText}`;

                    telegramHTML = `
                        <a href="${url}"
                        onclick="event.preventDefault(); window.location='${deepLink}';"
                        class="text-decoration-none d-inline-flex align-items-center mt-1"
                        target="_blank"
                        title="Open in Telegram"
                        aria-label="Telegram">
                            <small><i class="fa-brands fa-telegram me-1" style="color:#229ED9;"></i></small>
                            <small class="text-nowrap">${displayText}</small>
                        </a>`;
                }

                return `
                    <div class="d-flex flex-column">
                        <div><small><i class="fa-solid fa-phone me-1 text-success"></i></small><small class="text-nowrap text-yp-custom">${phone}</small></div>
                        <div>${telegramHTML}</div>
                    </div>`;
            }
        },




        {
            title: "Business Type",
            className: "align-middle ",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <small><i class="fa-solid fa-location-dot text-primary me-2"></i></small><small class="text-wrap text-break" style ="word-break:break-word;">${data.address ?? 'N/A'}</small>
                    </div>
                `;
            }
        },

        {
            title: "Company Name",
            className: "align-middle ",
            data: (data) => `<span class="text-yp-custom"><small>${data.deceased_name ?? ''}</small></span>`,
        },
        {
            title: "Leased Date",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                  
                    <small class="text-center text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },

        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'text-info';

                if (status === 'inactive') {
                    cls = 'text-danger px-2 py-1 d-inline-block';
                } else if (status === 'active') {
                    cls = 'text-success px-2 py-1 d-inline-block';
                }

                return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
            },
        },
        //    {
        //         title: "Status",
        //         className: "align-middle",
        //         data: (data) => {
        //             const status = (data.status ?? '').toLowerCase();
        //             let cls = 'text-info';

        //             if (status === 'inactive') {
        //                 cls = 'text-danger border border-danger rounded px-2 py-1 d-inline-block';
        //             } else if (status === 'active') {
        //                 cls = 'text-success border border-success rounded px-2 py-1 d-inline-block';
        //             }

        //             return `<span class="${cls} text-capitalize">${data.status ?? ''}</span>`;
        //         },
        //     },

        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-center text-yp-custom fw-semibold"><small>${data.update_user ?? ''}</small></span>
                    <small class="text-center text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-outline-yp-custom rounded-2 text-nowrap">
                           <span><i class="fa fa-pencil"></i></span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.MemberListView = new ListView('_member_list', {
            fetchApi: `${main_view.base_url}/ypg/member/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
               rowCreated:(data,index,tr)=>{
                
              
              tr.dataset.statusid = data.status_id;
              tr.classList.add('member');
              tr.setAttribute('id',['member_id',data.id].join('')); 

            }, 
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.MemberListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            MemberDialog.show(op);
        };


        mThis.pr_tbl = mThis.MemberListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblMembers = mThis.MemberListView.getTable();
        mThis.initDropdownMenus(mThis.tblMembers);




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.MemberListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.MemberListView.showPage(mThis.getFilterData());
            }, 250);
        });
        mThis.tblMembers.addEventListener("click", function (e) {
            let btn = e.target.closest(".btn-view-member-photo");
            if (btn) {
                ImageBox.viewPhoto({
                    imageUrl:btn.src,
                    features:['zoom','rotate','brightness','contrast'],
                    imageClass:'',
                    dialogClass:'',
                    dialogSize:'lg',
                    freeZoom:true,
                    //imageClass:"",
                    //photoViewSize: "lg", //lg or xl
                    //freeZoom:false,
                   
                });

                // let op = {
                //     id: btn.dataset.member_id,
                //     image_url: btn.src
                // };
                // PreViewMemberDialog.show(op);
                return;
            }
        })

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa fa-exchange fs-5 text-info"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "change_status"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_member"
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_member"
                },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {

                    case 'change_status': {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
                    case 'edit_member': {
                        mThis.editMember(id, menuLink);
                        break;
                    }
                    case 'delete_member': {
                        mThis.deleteMember(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    mThis.changeStatus = (id, lnk) => {
    const tr = lnk.closest('tr');
    console.log(1234,tr);
    
    const status_id = VSUtil.properCase(tr?.dataset.statusid || "");
    const inputOptions = {
        title: 'Change Status',
        dataLabel: "Member status",
        valueMember: "status_id",
        textMember: "name",
        confirmButtonText: "Save",
        blankErrorMessage: "Status is not correct!",
        data: [
            { status_id: "1", name: "Active" },
            { status_id: "2", name: "Inactive" }
        ],
        defaultValue: status_id 
    };

    InputBox2.show(inputOptions, (selected) => {
        if (!selected) return;
        if (!AuthManager.allowed(321)) return;

        const payload = { id, status_id: selected.value };

        vsapi.call(`${mThis.base_url}/ypg/member/update-status`, payload).then(res => {
            if (res.status_code === 200) {
                InputBox2.close();
                cv_interact.success('The member status has been updated');
                mThis.MemberListView.showPage(mThis.getFilterData());
            } else {
                cv_interact.error(res.error_message || 'Unable to update status');
            }
        });
    });
    };
    mThis.editMember = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.MemberListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(241)) return;
        MemberDialog.show(op);
    }
    mThis.deleteMember = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.MemberListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this member?', {
            title: 'Delete Member',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/ypg/member/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.MemberListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }
    mThis.prepareFormOptions = (onFinish) => {

        vsapi.call(`${main_view.base_url}/ypg/member/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'member_status', true, 'All Statuses', null);
                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.MemberListView.showPage(mThis.getFilterData());
        });

    };
    return mThis;
})();


const MemberDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<form>
                            <div class="row justify-content-center">
                                <div class="col-3">
                                    <div class="data-input border border-ypg-custom rounded-3 d-flex justify-content-center align-items-center mx-auto" style="width:120px; height:120px;">
                                    <div name="div_member_photo" class="data-input h-100 w-100" data-field="photo"></div>
                                    </div>
                                    <label class="mt-2 text-muted small d-block text-center">Profile Photo</label>
                                </div>
                                </div>

                            <div class="col-12">
                                <div class="material-input outlined">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label>Member Name</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <select required  placeholder=" " class="data-input form-control" data-field="sex">
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                    <label class="d-none">Gender</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <select   name="nationality_id" required placeholder=" " class="data-input form-control" data-field="nationality_id">
                                    <option value="">Select Expiration</option>
                                    </select>
                                    <label class="d-none">Nationality</label>
                                </div>
                            </div>
                            <div class="col-12">    
                                <div class="material-input outlined">
                                    <input type="tel" name="phone_number" required class="data-input form-control" data-field="phone_number" placeholder=" " />
                                    <label>Phone Number</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <select name="is_expired" class="data-input form-control" data-field="is_expired" required placeholder=" ">
                                        <option value="0">Permanent</option>
                                        <option value="1">Will Expire</option>
                                    </select>
                                    <label class="d-none" >Expiration</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined expiry-wrapper" style="display: none;">
                                    <input name="expiration_date" type="vsdate" class="data-input form-control" data-field="expiration_date" placeholder=" " />
                                    <label class="d-none">Expiration Date</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="d-none material-input outlined">
                                    <input name="status_id" class="data-input form-control" data-field="status_id" placeholder=" " />
                                    <label>Status ID</label>
                                </div>
                            </div>  
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                    <label>Address</label>
                                </div>
                            </div>
                    </form>`
                    ].join("");

                },

                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.expiration_date);
                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');

                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none');
                    header.classList.add('bg-yp-custom', 'modal-header-custom');
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important;';

                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

                    // const logo = document.createElement('img');
                    // logo.src = '/assets/images/yavpheng/logo_yp.jpg';
                    // logo.alt = 'Logo';
                    // logo.classList.add('img-logo', 'mb-2');
                    // logo.style.height = '80px';

                    headerTitle.classList.add('text-white', 'text-center', 'w-100');
                    // headerWrapper.appendChild(logo);
                    headerWrapper.appendChild(headerTitle);

                    header.innerHTML = '';
                    header.appendChild(headerWrapper);

                    const div_member_photo = me.controls.div_member_photo;

                    me.memberImageBox = new ImageBox(div_member_photo, {
                        defaultPhotoName: "default-skill",
                        containerClass: "member-profile-container",
                        imgClass: "data-input",
                        dataset: {
                            "field": "photo",
                        } /** please set field: photo so that we can use for both Edit and Create easily */,
                        //dataset: { field: "image_url" },
                        beforeDeleteImage: async () => {
                            if (me.dataOptions.id > 0) {
                                const yes = await cv_interact.confirm(
                                    "Are you sure to delete this profile photo?",
                                    { title: "Delete Photo", context: "delete" }
                                );
                                if (yes) {
                                    //delete member's photo from backend
                                    me.deleteProfilePhoto(me.dataOptions.id);
                                    return true;
                                } else return false;
                            }else{
                                 //Case of Create new member, just clear photo
                                 me.memberImageBox.setImage(null);
                            }
                            return true;
                        },
                        //When user browse new photo and loads it in the IMG element
                        onOpenImage: (img) => {
                            if (me.dataOptions.id > 0) {
                                //This is case of Editing Existing member information
                                me.saveProfilePhoto(img, me.dataOptions.id);
                            }
                        },
                        // onImageLoaded: (img)=>{
                        //    if(me.dataOptions.id > 0){
                        //         const p = {"photo":me.empImageBox.getImage(), "id" : me.dataOptions.id};
                        //         vsapi.call([main_view.base_url,'/bhr/employee/profile-photo/save'].join(''), p,false).then(res =>{
                        //             if(res.status_code == 200){
                        //             cv_interact.info('Profile photo was deleted!');
                        //             }else cv_interact.error(res.error_message);
                        //         });
                        //    }
                        // }
                    });

                    me.deleteProfilePhoto = (id) => {
                        const p = { id: id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/ypg/member/profile/photo/delete",
                                ].join(""),
                                p,
                                false,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.memberImageBox.setImage(null);
                                    cv_interact.info(
                                        "Profile photo was deleted!"
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };

                    me.saveProfilePhoto = (photo, id) => {
                        const p = { "photo": photo, "id": id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/ypg/member/profile/photo/save",
                                ].join(""),
                                p,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.memberImageBox.setImage(res.data.image_url);
                                    cv_interact.success(
                                        "Profile photo was saved!"
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };
                    me.controls.is_expired.onchange = (e) => {
                        const expiryWrapper = me.controls.expiration_date.closest('.expiry-wrapper');
                        if (expiryWrapper) {
                            expiryWrapper.style.display = e.target.value == "1" ? "block" : "none";
                        }
                    };


                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationality",
                        textField: "nationality",
                        valueField: "id",
                    },

                ],
                prepareFormOptions: {
                    createTitle: "Add Yeav Pheng Member",
                    modifyTitle: "Edit Yeav Pheng Member",
                    targetProp: "member_details",
                    api: {
                        endpoint: [main_view.base_url, "/ypg/member/form-options",].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    //LocaleManager.translateZone(me.divModal); //Translation is automatic!
                    const header = me.divModal.querySelector('.modal-header');
                    const btnClose = header.querySelector('button');
                    if(btnClose) btnClose.classList.add('d-none');
                },

                extendMethod: {
                    setData: (me, data) => {
                        me.memberImageBox.setImage(data.image_url);
                    }
                },
                buttons: [
                    {
                        label: '<span class="text-white">Cancel</span>',
                        cssClass: 'btn btn-sm btn-warning',
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span class= "text-white">Submit</span>',
                        cssClass: 'btn btn-sm btn-yp-custom',
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            op.photo = me.memberImageBox ? me.memberImageBox.getImage() : '';

                            vsapi.call([main_view.base_url, "/ypg/member/save",].join(""), op, btn, null).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "Member has been updated successfully"
                                        );
                                    } else {
                                        cv_interact.success(
                                            "New member has been added successfully"
                                        );
                                    }
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                        },
                    },
                ],
            });
        dialog.show(op);
    };

    return self;
})();

const PreViewMemberDialog = (() => {
    const self = {};

    self.show = (op) => {
        const imageUrl = op?.image_url || '';

        const dialog = new GeneralDialog({
            cssClass: "modal-md modal-content-vs-dialog",
            backdrop: false,
            keyboard: true,
            title: "Member Photo",
                createContent: () => {
                    return `
                        <div class="text-center">
                            <img 
                                src="${imageUrl}" 
                                alt="Preview" 
                                style="
                                    width: 100%;
                                    max-width: 550px;
                                    height: auto;
                                    max-height: 400px;
                                    border-radius: 10px;
                                    object-fit: cover;
                                " 
                            />
                        </div>
                    `;
                },


            contentCreated: (me) => {
                const footer = me.divModal.querySelector('.modal-footer');
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = me.divModal.querySelector('.modal-header .modal-title');
                const btnClose = me.divModal.querySelector('.modal-header button');

                // បង្ហាញ "View Profile" នៅក្នុង modal-title
                headerTitle.textContent = "View Profile";

                btnClose.classList.add('text-white');
                footer.classList.add('d-none');
                headerTitle.classList.add('justify-content-center', 'text-white', 'w-100', 'd-flex');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';
                header.classList.add('bg-yp-custom', 'modal-header-custom');
            },
            prepareFormOptions: {},
            onPrepareForm: (me, data) => {},
            buttons: [],
        });

        dialog.show(op);
    };

    return self;
})();

