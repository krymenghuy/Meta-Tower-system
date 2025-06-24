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

    mThis.cols = [
         {
            title: "Numero",
            className: "align-middle",
            data:(data,index)=>{
                return `<p class="p-0 mb-0 text-center">${index+1}</p>`;
            }
        },
        {
            title: "photo",
            className: "align-middle",
            data:(data) => `<img class="image-student-tbl" src="${data.image_url || `${main_view.base_url}/assets/images/yavpheng/bg_ok2.webp`}" alt="" style="width: 40px; height: 40px; border-radius: 10%; margin-right: 10px;"/>`,
        },
        {
            title: "Grave Slot",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-yp-custom">${data.slot_number ?? 'null'}</span>`,
        },
        {
            title: "Deceased Name",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-yp-custom">${data.deceased_name ?? ''}</span>`,
        },
        {
            title: "Size",
            className: "align-middle text-capitalize",
            data: (data) => `
                <span class="badge bg-light text-warning border border-warning fw-bold d-block text-center py-1">
                    ${data.size ?? ''}
                </span>
            `,
        },

        {
            title: "Recommender",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-yp-custom">${data.recommender ?? ''}</span>`,
        },
        {
            title: "Remarks",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-yp-custom">${data.location_note ?? 'N/A'}</span>`,
        },
        {
            title: "Last Updated ",
            className: "align-middle text-capitalize",
            data: (data) => `
            <p class="p-0 mb-0 text-yp-custom">${data.update_user}</p>
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
                        statusClass = 'text-danger border border-danger rounded px-2 py-1 d-inline-block';
                        break;
                    case 'Available':
                        statusClass = 'text-success border border-success rounded px-2 py-1 d-inline-block';
                        break;
                }

                return `<span class="${statusClass}">${status}</span>`;
            },
        },

        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn-grave-action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-outline-yp-custom rounded-3 text-nowrap">
                           <span vslang="buttons.Actions">Action</span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.GraveInfoListView = new ListView('_grave_info_list', {
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
        pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        pl_parent.classList.add("overflow-y-auto");
        pl_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            pl_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
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
            cssClass: "bg-white shadow",
            //menuItemClass:"",
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
               vsapi.call(`${main_view.base_url}/ypg/grave-slot/delete`, op,{ useCache:false }).then(res => {
                    if (res.status_code == 200) {
                        mThis.GraveInfoListView.showPage();
                    }
                });


vsapi.call(`${main_view.base_url}/ypg/grave-slot/delete`, op,{ }).then(res => {
                    if (res.status_code == 200) {
                        mThis.GraveInfoListView.showPage();
                    }
                });


            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/ypg/grave-slot/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                console.log(12,res.data);
                
                VSUtil.setComboItems(mThis.elFilter_status, d.statuses, 'id', 'grave_status', true, 'All Statuses', null);
               if(typeof onFinish ==='function') onFinish();
            })
    }

    mThis.show = function () {
        mThis.init();
        main_view.setContentView(mThis.self,mThis.title_prop);
        mThis.prepareFormOptions(()=>{
        mThis.GraveInfoListView.showPage(mThis.getFilterData());
        });
    }
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
                        return [
                            `<div class="row">
                                <div class="col-3">
                                    <div style="height:180px;" class="data-input border border-secondary rounded-3 justify-content-center align-items-center">
                                        <div name="div_grave_photo" class="data-input h-100" data-field="photo">

                                        </div>
                                    </div>                            
                                </div>
                                <div class="col-9">
                                    <div class="row">
                                        <div class="form-group col-6">
                                            <label for="slot_number" class="form-label" vslang="titles.Grave Slot"></label>
                                            <span class="text-danger" >*</span>
                                            <input name="slot_number" class="form-control data-input" data-field="slot_number" />
                                        </div>
                                        <div class="form-group col-6">
                                            <label for="Deceased_name" class="form-label" vslang="titles.Deceased Name"></label>
                                            <span class="text-danger" >*</span>
                                            <input  name="Deceased_name" class="form-control data-input" data-field="deceased_name" />
                                        </div>
                                        <div class="form-group col-6">
                                            <label for="size" class="form-label" vslang="titles.Size">Size</label>
                                            <span class="text-danger">*</span>
                                            <select name="size" class="form-control data-input" data-field="size" required>
                                                <option value="">-- Select Size --</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-6">
                                            <label for="recommender" class="form-label" vslang="titles.Recommender"></label>
                                            <select name="recommender_id" class="form-control data-input" data-field="recommender_id"></select>
                                        </div>
                            
                                    </div>
                                </div>
                                <div class="form-group col-12">
                                    <label for="location_note" class="form-label" vslang="titles.Remarks"></label>
                                    <textarea  name="location_note" class="form-control data-input" data-field="location_note">
                                </div>



                        </div>`
                        ].join("");
                    },

                      contentCreated: (me) =>{
                        const div_grave_photo = me.controls.div_grave_photo;
                        me.graveImageBox = new ImageBox(div_grave_photo,{
                            defaultPhotoName:'default-skill',
                            containerClass:'grave-profile-container',
                            imgClass:"data-input",
                            dataset:{"field" :"photo"},
                            beforeDeleteImage: async ()=> {
                                if(me.dataOptions.id > 0){
                                    const answer = await cv_interact.confirm('Are you sure to delete this grave photo?', {title:'Delete Photo','context':'delete'});
                                    if(answer){
                                        me.deleteGravePhoto(me.dataOptions.id);
                                        return true;
                                    } else return false;

                                }
                                return true;
                            },
                            onOpenImage: (img)=>{
                                if(me.dataOptions.id > 0){
                                me.saveGravePhoto(img, me.dataOptions.id);
                            }
                            },
                        });
                        me.deleteGravePhoto = (id) => {
                            const p = {"id":id};
                            vsapi.call([main_view.base_url,'/ypg/grave-slot/photo/delete'].join(''),p,false,false).then(res =>{
                                if(res.status_code == 200){
                                me.graveImageBox.setImage(null);
                                cv_interact.info('Profile photo was deleted!');
                                }else cv_interact.error(res.error_message);
                            });
                        }
                        me.saveGravePhoto =  (photo,id) =>{
                            let p = {'photo':photo,'id':id};
                            vsapi.call([main_view.base_url,'/ypg/grave-slot/photo/save'].join(''),p,false).then(res =>{
                            if(res.status_code ==200){
                                me.graveImageBox.setImage(res.data.image_url);
                            cv_interact.success('Grave photo was saved!');
                            }else cv_interact.error(res.error_message);
                            });
                        };






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
                        createTitle: "Add Grave",
                        modifyTitle: "Edit Grave",
                        targetProp: "grave_slot",
                        api: {
                            endpoint: [main_view.base_url, "/ypg/grave-slot/form-options",].join(""),
                            params: (op) => {
                                return { id: op.id };
                            },
                        },
                    },

                    onPrepareForm: (me, data) => {
                        console.log(12,data);
                        
                        LocaleManager.translateZone(me.divModal);
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
                            label: '<span>Save</span>',
                            cssClass: 'btn btn-sm btn-primary',
                            click: (me, btn) => {
                                const op = me.getData();
                                op.id = me.dataOptions.id;
                                op.photo = me.graveImageBox? me.graveImageBox.getImage(): '';
                                console.log(1234,op);

                                vsapi.call([main_view.base_url, "/ypg/grave-slot/save",].join(""), op, btn, null).then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Grave has been updated successfully"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New Grave has been saved successfully"
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
