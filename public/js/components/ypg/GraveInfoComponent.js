"use strict";
var GraveInfoComponent = new (function () {
    const mThis = this;
    this.title_prop = "Grave List";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_grave_info_component");
    mThis.RegisterGrave = mThis.self.querySelector("#_btnRegisterGrave");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_grave_info");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elSearch = mThis.self.querySelector("#_search_grave_info");

//     mThis.cols = [
//         {
//             title: "",
//             className: "align-middle text-capitalize",
//         },
//         {
//             title: "Numero",
//             className: "align-middle",
//             data: (data, index) => {
//                 return `<p class="p-0 mb-0 text-center">${index + 1}</p>`;
//             }
//         },
//         {
//             title: "Photo",
//             className: "align-middle",
//             data: (data) => `
//                 <img
//                     class="btn-view-grave-photo"
//                     src="${data.image_url}"
//                     data-id="${data.id}"
//                     data-member_id="${data.recommender_id}"
//                     style="width: 40px; height: 40px; border-radius: 10%; margin-right: 10px; cursor: pointer; object-fit: cover;"
//                 />
//             `,
//         },
//         {
//             title: "Grave Slot",
//             className: "align-middle text-capitalize",
//             data: (data) => `<span class="text-yp-custom">${data.slot_number ?? 'null'}</span>`,
//         },
//         {
//             title: "Deceased Name",
//             className: "align-middle text-capitalize",
//             data: (data) => `<span class="text-yp-custom">${data.deceased_name ?? ''}</span>`,
//         },
//         {
//             title: "Size",
//             className: "align-middle text-capitalize",
//             data: (data) => `
//                 <span class="badge bg-light text-warning border border-warning fw-bold d-block text-center py-1 w-50px;">
//                     ${data.size ?? ''}
//                 </span>
//             `,
//         },
//         {
//             title: "Recommender",
//             className: "align-middle text-capitalize",
//             data: (data) => `<span class="text-yp-custom">${data.recommender ?? ''}</span>`,
//         },
//         {
//             title: "Remarks",
//             className: "align-middle text-capitalize",
//             data: (data) => `<span class="text-yp-custom">${data.location_note ?? 'N/A'}</span>`,
//         },
//         {
//             title: "Last Updated ",
//             className: "align-middle text-capitalize",
//             data: (data) => `
//             <p class="p-0 mb-0 text-yp-custom">${data.update_user}</p>
//             <small class="text-muted">${data.updated_at ?? ''}</small>`,
//         },
//         {
//             title: "Status",
//             className: "align-middle",
//             data: (data) => {
//                 let status = data.status ?? '';
//                 let statusClass = '';
//                 switch (status) {
//                     case 'Used':
//                         statusClass = 'text-danger border border-danger rounded px-2 py-1 d-inline-block';
//                         break;
//                     case 'Available':
//                         statusClass = 'text-success border border-success rounded px-2 py-1 d-inline-block';
//                         break;
//                 }
//                 return `<span class="${statusClass}">${status}</span>`;
//             },
//         },
//         {
//             className: 'col_action align-middle',
//             data: (data) => `
//                 <div class="d-flex justify-content-center align-items-end">
//                     <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn-grave-action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
//                        <button class="btn btn-sm btn-outline-yp-custom rounded-3 text-nowrap">
//                             <span vslang="buttons.Actions">Action</span>
//                             <i class="fa-solid fa-caret-down"></i>
//                        </button>
//                     </a>
//                 </div>`
//         },
//     ];

mThis.cols = [
    
    {
        title: "Numero",
        className: "align-middle",
        data: (data, index) => {
            return `<p class="p-0 mb-0 text-center"><small>${index + 1}</small></p>`;
        }
    },
    {
        title: "Photo",
        className: "align-middle",
        data: (data) => `
            <img
                class="btn-view-grave-photo"
                src="${data.image_url}"
                data-id="${data.id}"
                data-member_id="${data.recommender_id}"
                style="width: 40px; height: 40px; border-radius: 10%; margin-right: 10px;  align-items: center; cursor: pointer; object-fit: cover;"
            />
        `,
    },
    {
        title: "Grave Slot",
        className: "align-middle text-capitalize",
        data: (data) => `<span class="text-yp-custom"><small>${data.slot_number ?? 'null'}</small></span>`,
    },
    {
        title: "Deceased Name",
        className: "align-middle text-capitalize",
        data: (data) => `<span class="text-yp-custom"><small>${data.deceased_name ?? ''}</small></span>`,
    },
    {
        title: "Size",
        className: "align-middle text-capitalize",
        data: (data) => `
            <span class="badge bg-light text-warning border border-warning fw-bold d-block text-center py-1 w-50px;">
                ${data.size ?? ''}
            </span>
        `,
    },
    {
        title: "Recommender",
        className: "align-middle text-center text-capitalize ",
        data: (data) => `<small class="text-yp-custom ">${data.recommender ?? ''}</small>`,
    },
    {
        title: "Remarks",
        className: "align-middle text-capitalize",
        data: (data) => `<span class="text-yp-custom"><small>${data.location_note ?? 'N/A'}</small></span>`,
    },
    {
        title: "Last Updated",
        className: "align-middle text-capitalize",
        data: (data) => `
        <p class="p-0 mb-0 text-yp-custom"><small>${data.update_user}</small></p>
        <small class="text-muted">${data.updated_at ?? ''}</small>`,
    },
    {
        title: "Status",
        className: "align-middle",
        data: (data) => {
            let status = data.status ?? '';
            let statusClass = '';
            switch (status) {
                case 'Used':
                    statusClass = 'text-danger px-2 py-1 d-inline-block';
                    break;
                case 'Available':
                    statusClass = 'text-success px-2 py-1 d-inline-block';
                    break;
            }
            return `<span class="${statusClass}"><small>${status}</small></span>`;
        },
    },
    {
        className: 'col_action align-middle',
        data: (data) => `
            <div class="d-flex justify-content-center align-items-end">
                <a href="javascript:void(0)" class="${data.action_id > 1 ? 'd-none' : 'btn-grave-action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                   <button class="btn btn-sm btn-outline-yp-custom rounded-3 text-nowrap">
                        <span><i class="fa fa-pencil"></i></span>
                        <i class="fa-solid fa-caret-down"></i>
                   </button>
                </a>
            </div>`
    },
];

    mThis.init = () => {
        if (mThis.initAlready) return;
       mThis.gListView = mThis.gListView || mThis.self.querySelector('#_grave_info_list');
        mThis.GraveInfoListView = new ListView(mThis.gListView, {
            fetchApi: `${main_view.base_url}/ypg/grave-slot/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-3 overflow-hidden header-uppercase',
            listContainerClass: null
        });

        mThis.RegisterGrave.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.GraveInfoListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            RegisterGraveDialog.show(op);
        };

        mThis.pl_container = mThis.GraveInfoListView.getListContainer();
        const pl_parent = mThis.pl_container.parentElement;
        pl_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        pl_parent.classList.add("overflow-y-auto");
        pl_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            pl_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblGrave = mThis.GraveInfoListView.getTable();

        mThis.initDropdownMenus(mThis.tblGrave);
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.GraveInfoListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.GraveInfoListView.showPage(mThis.getFilterData());
            }, 250);
        });
        mThis.tblGrave.addEventListener("click", function (e) {
            let btn = e.target.closest(".btn-view-grave-photo");
            if (btn) {
//                 let op = {
//                     id: btn.dataset.id,
//                     member_id: btn.dataset.member_id,
//                     image_url: btn.src,
//                 };
//                 PreViewGraveDialog.show(op);
                ImageBox.viewPhoto({
                    image_url:btn.src,
                    photoViewSize: "lg", //lg or xl
                    //freeZoom:false,
                    features:['zoom','rotate','brightness','contrast']
                }); 
            }
        });

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
            actionButtonClass: "btn-grave-action",
            cssClass: "vsd-dropdown-menu bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Edit Grave"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_grave"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete Grave"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_grave"
                },
            ],
            adjustPosition: {
                top: -200,
                left: -300
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'edit_grave': {
                        mThis.editGrave(id, menuLink);
                        break;
                    }
                    case 'delete_grave': {
                        mThis.deleteGrave(id, menuLink);
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

    mThis.editGrave = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.GraveInfoListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(241)) return;
        RegisterGraveDialog.show(op);
    }

    mThis.deleteGrave = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.GraveInfoListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this slot?', {
            title: 'Delete slot',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/ypg/grave-slot/delete`, op, { useCache: false }).then(res => {
                    if (res.status_code == 200) {
                        mThis.GraveInfoListView.showPage();
                    }
                });
            } else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/ypg/grave-slot/form-options`, {}, {}).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'grave_status', true, 'All Statuses', null);
            if (typeof onFinish === 'function') onFinish();
        })
    }

    mThis.show = function () {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.prepareFormOptions(() => {
            mThis.GraveInfoListView.showPage(mThis.getFilterData());
        });
    }
})();

const PreViewGraveDialog = (() => {
    const self = {};
    self.show = (op) => {
        const imageUrl = op?.image_url || '';
        const dialog = new GeneralDialog({
            cssClass: "modal-md modal-content-vs-dialog",
            keyboard: true,
            title:"Grave Image",
            createContent: () => {
                return `
                    <div class="text-center">
                        <img src="${imageUrl}" alt="No image available." style="max-width: 100%; max-height: 80vh; border-radius: 10px;" />
                    </div>
                `;
            },
            contentCreated: (me) => {
                //DateTimePicker.init(me.controls.expiration_date,{}); // This line seems unrelated to PreViewGraveDialog and might be a copy-paste error.
                const footer = me.divModal.querySelector('.modal-footer');
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = me.divModal.querySelector('.modal-header .modal-title');
                const btnClose = me.divModal.querySelector('.modal-header button');
                btnClose.classList.add('text-white');
                footer.classList.add('d-none');
                headerTitle.classList.add('justify-content-center', 'text-white', 'w-100', 'd-flex');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style.borderRadius = '20px';
                header.classList.add('bg-yp-custom', 'modal-header-custom');
            },
            prepareFormOptions: {
            },
            onPrepareForm: (me, data) => {},
            buttons: [],
        });
        dialog.show(op);
    };
    return self;
})();


const RegisterGraveDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                        <div class="row p-2">
                            <div class="col-md-4 d-flex flex-column justify-content-center align-items-center mb-3">
                                <div class="border border-2 border-ypg-custom rounded-3 overflow-hidden d-flex flex-column align-items-center justify-content-center"
                                    style="width: 140px; height: 130px; cursor: pointer; background-color: #f8f8f8;">
                                    <div name="div_grave_photo"
                                        class="w-100 h-100"
                                        style="background-size: cover; background-position: center;">
                                    </div>
                                    <label class="mt-2 text-muted small d-block text-center">Grave Photo</label>
                                </div>
                            </div>

                            <div class="col-md-8">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <div class="material-input outlined">
                                            <input type="text" name="slot_number" required class="data-input form-control" data-field="slot_number" placeholder=" " />
                                            <label vslang="titles.Grave Slot">Grave Slot</label>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="material-input outlined">
                                            <input type="text" name="deceased_name" required class="data-input form-control" data-field="deceased_name" placeholder=" " />
                                            <label vslang="titles.Deceased Name">Deceased Name</label>
                                        </div>
                                    </div>
                                    

                                    
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <select name="size" required class="data-input form-select" data-field="size">
                                        <option value="">-- Select Size --</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                    </select>
                                    <label vslang="titles.Size" class="d-none">Size</label>
                                </div>
                            </div>
                                    

                            <div class="col-8">
                                <div class="material-input outlined">
                                    <select name="recommender_id" class="data-input form-select" data-field="recommender_id"></select>
                                    <label vslang="titles.Recommender" class="d-none">Recommender</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="material-input outlined">
                                    <textarea name="location_note" class="data-input form-control" data-field="location_note" placeholder=" "></textarea>
                                    <label vslang="titles.Remarks">Remarks</label>
                                </div>
                            </div>
                        </div>
                    `;
                },

                contentCreated: (me) => {
                    const div_grave_photo = me.controls.div_grave_photo;

                    me.graveImageBox = new ImageBox(div_grave_photo, {
                        defaultPhotoName: 'default-skill',
                        containerClass: 'w-100',
                        showPhotoView:false,
                        imgClass: ["w-100", "h-100", "object-fit-cover", "rounded-3"],
                        dataset: { "field": "photo" },
                        beforeDeleteImage: async () => {
                            if (me.dataOptions.id > 0) {
                                const yes = await cv_interact.confirm('Are you sure to delete this grave photo?', {
                                    title: 'Delete Photo',
                                    context: 'delete'
                                });
                                if (yes) {
                                    //delete Photo from database
                                    me.deleteGravePhoto(me.dataOptions.id);
                                    return true;
                                } else return false;
                            }else{
                                //Clear Photo when user clicks on Delete photo
                                me.graveImageBox.setImage(null);
                            }
                            return true;
                        },
                        onOpenImage: (img) => {
                            if (me.dataOptions.id > 0) {
                                me.saveGravePhoto(img, me.dataOptions.id);
                            }
                        },
                    });

                    me.deleteGravePhoto = (id) => {
                        const p = { "id": id };
                        vsapi.call([main_view.base_url, '/ypg/grave-slot/photo/delete'].join(''), p, {loader:false}).then(res => {
                            if (res.status_code == 200) {
                                me.graveImageBox.setImage(null);
                                cv_interact.info('Profile photo was deleted!');
                            } else cv_interact.error(res.error_message);
                        });
                    };

                    me.saveGravePhoto = (photo, id) => {
                        let p = { 'photo': photo, 'id': id };
                        vsapi.call([main_view.base_url, '/ypg/grave-slot/photo/save'].join(''), p, {loader:false}).then(res => {
                            if (res.status_code == 200) {
                                me.graveImageBox.setImage(res.data.image_url);
                                cv_interact.success('Grave photo was saved!');
                            } else cv_interact.error(res.error_message);
                        });
                    };

                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');
                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none'); 
                    header.classList.add('bg-yp-custom', 'modal-header-custom'); 
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important';

                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'align-items-center', 'w-100');

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
                    // === END: Header Styling ===

                },
                configSelect: [
                    {
                        name: "recommender_id",
                        data: "recommenders",
                        textField: "member_name",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Grave Slot",
                    modifyTitle: "Edit Grave Slot",
                    targetProp: "grave_slot",
                    api: {
                        endpoint: [main_view.base_url, "/ypg/grave-slot/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                   // LocaleManager.translateZone(me.divModal);
                    const header = me.divModal.querySelector('.modal-header');

                    const btnClose = header.querySelector('button');
                    if(btnClose) btnClose.classList.add('d-none');
                },
                extendMethod: {
                    setData: (me, data) => {
                        me.graveImageBox.setImage(data.image_url);
                    },
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
                        label: '<span class="text-white">Submit</span>', 
                        cssClass: 'btn btn-sm btn-yp-custom', 
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            op.photo = me.graveImageBox ? me.graveImageBox.getImage() : ''; 

                            vsapi.call([main_view.base_url, "/ypg/grave-slot/save"].join(""), op,{loader:false,agent:btn}).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success("Grave has been updated successfully");
                                    } else {
                                        cv_interact.success("New Grave has been saved successfully");
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