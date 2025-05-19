"use strict";
var SkillsComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_skillsComponent");
    mThis.self = mThis.jm[0];
    mThis.title_prop = "Skills";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddSkill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_skill");
    mThis.elSearch = mThis.self.querySelector("#_search_skill");
    let div = mThis.self.querySelector("#_skill_list");
    mThis.paginationContainer = mThis.self.querySelector("#skill_container_pagination");


    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.SkillListView = new ListView('_skill_list', {
            fetchApi: `${main_view.base_url}/ypg/skills/list-paginate`,
            apiCluster: main_view.apiCluster,
            perPage:12,
            paginationContainer: mThis.paginationContainer,
            processResponse: (res) => {
                return res.data;
            },
            renderItems: (data,list_container) => {
                mThis.renderSkillCard(list_container, data);

            },
            listContainerClass: null
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SkillListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(201)) return;
            SkillDialog.show(op);
        };
        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.SkillListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.SkillListView) {
                    mThis.SkillListView.showPage(mThis.getFilterData());
                }
            }, 200);
        });
        mThis.listContainer = mThis.SkillListView.getListContainer();
        mThis.setAction(div);
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 235) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 235) + 'px';
        }



        mThis.initAlready = true;
    };
    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.setAction = (tbl)=>{
        tbl.addEventListener('click', (e) => {

            let btn = VSUtil.closestLimited(e.target,'.btn-delete-skill');
            if (btn) {
                mThis.deleteSkill(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target,'.btn-edit-skill');
            if (btn) {
                mThis.editSkill(btn.dataset.id, btn);
            }
        })
    }

    mThis.renderSkillCard = (div,data) => {
        data = data ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }

        AuthManager.init().then(user => {
           mThis.renderSkill(data,user)
        });
    }
    mThis.renderSkill = (data) => {
        let html = `<div class="row ">`;
        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                html += `
                    <div class="col-md-3 container-skill-item mb-3">
                        <div class="card-container-skill">
                            <div class="w-100 d-flex flex-row justify-content-center align-items-center shadow rounded-3 card-skill-hover" style="background-color: #2b3991;">
                                <div class="section-title fs-6 text-start w-100">
                                    <div class="card-body bg-white rounded-3 text-center">
                                        <div class="overflow-hidden rounded-circle mx-auto d-flex justify-content-center border bg-white border-4 mb-3" style="width: 70px; height: 70px;">
                                            <img src="${d.image_url || (main_view.asset_url + "/images/default/default-skill.svg")}" class="h-100" alt="Profile Picture">
                                        </div>
                                        <p class="fs-6" style="color: #2b3991;">${d.title}</p>
                                        <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 100%;">
                                        <div class="d-flex justify-content-between px-2">
                                            <small class="fw-semibold text-muted px-2">Count: <span class="text-primary">${d.count_member}</span></small>
                                            <div class="justify-content-end action-buttons d-none gap-2">
                                                <a href="javascript:void(0)" data-id="${d.id}" class="text-primary btn-edit-skill text-decoration-none">
                                                    <small><i class="fa-regular fa-pen-to-square fs-7"></i></small>
                                                </a>
                                                <a href="javascript:void(0)" data-id="${d.id}" class="text-danger btn-delete-skill text-decoration-none">
                                                    <small><i class="fa-regular fa-trash-can fs-7"></i></small>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cmt++;
            });
        }

        if (cmt === 0) {
            html = `
                <div class="w-100 rounded-4 h-25 bg-white d-flex flex-column justify-content-end align-items-center">
                    <div class="text-info pb-1">No Skill Available!</div>
                </div>`;
        }


        html += `</div>`;
        div.innerHTML = html;
    };


    document.querySelectorAll(".container-skill-item").forEach((item) => {
        item.addEventListener("mouseover", () => {
            const actions = item.querySelector(".action-buttons");
            if (actions) {
                actions.classList.remove("d-none");
                actions.classList.add('d-flex');
            }
        });

        item.addEventListener("mouseout", () => {
            const actions = item.querySelector(".action-buttons");
            if (actions) {
                actions.classList.add("d-none");
                actions.classList.remove('d-flex');

            }
        });
    });


    mThis.editSkill = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SkillListView.showPage();
            }
        };
        if (!AuthManager.allowed(202)) return;
        SkillDialog.show(op);
    }

    mThis.deleteSkill = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SkillListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(203)) return;
        cv_interact.confirm(
            'Delete this skill?',
            {
                title: 'Delete Skill',
                context: 'delete',
                confirmButtonText: "Delete"
            },
            function(e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/ypg/skills/delete`, op, false, false, false)
                        .then(res => {
                            if (res.status_code === 200) {
                                cv_interact.success('Deleted successfully');
                                mThis.SkillListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error('Failed to delete the skill.');
                            }
                        })

                }
            }
        );
    };


    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.SkillListView.showPage();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
    };
    return mThis;
})();
const SkillDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
        cssClass: 'modal-md',
        backdrop: 'static',
        keyboard:true,
        createContent: () => {
        return [
            `<div class="row">`,
                `<div class="col-md-3">`,
                    `<div style="height:130px;" class="data-input border border-SECONDARY rounded-3 justify-content-center align-items-center">`,
                        `<div name="div_skill_photo" class="data-input h-100" data-field="image_url">

                        </div>`,
                    `</div>`,
                `</div>`,
                `<div class="col-md-9">`,
                    `<div class="form-group col-md-12">`,
                        `<label class="form-label" vslang="titles.Title"> Title </label>`,
                        `<div><input name="title" class="form-control data-input" data-field="title"/></div>`,
                    `</div>`,
                    `<div class="form-group col-md-12">`,
                        `<label class="form-label" vslang="titles.Description"> Description </label>`,
                        `<div><input name="description" class="form-control data-input" data-field="description"/></div>`,
                        `</div>`,
                    `</div>`,
                `</div>`,
            `</div>`,].join('');
    },
    contentCreated: (me) =>{
        const div_skill_photo = me.controls.div_skill_photo;
        me.userImageBox = new ImageBox(div_skill_photo,{
            defaultPhotoName:'default-skill',
            containerClass:'skill-profile-container',
            imgClass:"data-input",
            dataset:{"field" :"image_url"},
            beforeDeleteImage: async ()=> {
                if(me.dataOptions.id > 0){
                    const answer = await cv_interact.confirm('Are you sure to delete this skill photo?', {title:'Delete Photo','context':'delete'});
                    if(answer){
                         me.deleteSkillPhoto(me.dataOptions.id);
                         return true;
                    } else return false;

                }
                return true;
             },
             onOpenImage: (img)=>{
                if(me.dataOptions.id > 0){
                  me.saveSkillPhoto(img, me.dataOptions.id);
               }
            },
        });
        me.deleteSkillPhoto = (id) => {
            const p = {"id":id};
            vsapi.call([main_view.base_url,'/ypg/skills/delete/skill/photo'].join(''),p,false,false).then(res =>{
                if(res.status_code == 200){
                  me.userImageBox.setImage(null);
                  cv_interact.info('Profile photo was deleted!');
                }else cv_interact.error(res.error_message);
            });
        }
        me.saveSkillPhoto =  (photo,id) =>{
            let p = {'photo':photo,'id':id};
            vsapi.call([main_view.base_url,'/ypg/skills/save/skill/photo'].join(''),p,false).then(res =>{
               if(res.status_code ==200){
                me.userImageBox.setImage(res.data.image_url);
               cv_interact.success('Profile photo was deleted!');
             }else cv_interact.error(res.error_message);
            });
         };






    },
    overrideMethod:{
        "setData":(me, data)=> {
            const id = me.dataOptions.id;
                    const fields = me.fields;
                    //fields to be reasOnly or disabled when Editing employee
                    for(const name in fields){
                        const el = fields[name];

                        el.value = data[name] ?? '';
                    }
            me.userImageBox.setImage(data.image_url);
        },
    },

    buttons:[
        {
           label:'<span><i class="fa-solid text-danger fa-xmark"></i></span>',
           cssClass:"btn btn-sm-outline rounded-3",
           click:(me)=>{
              me.hide(false);
           }
        },
        {
           label:'<span><i class="fa-solid text-success fa-check"></i></span>',
           cssClass:"btn btn-sm-outline rounded-3",
           click:(me)=>{
              let p = me.getData();
              p.image = me.userImageBox? me.userImageBox.getImage(): '';
              vsapi.call([main_view.base_url,'/ypg/skills/save'].join(''),p,false,false).then(res =>{
                  if(res.status_code ==200){
                      me.modal.hide(true,p);
                  }else cv_interact.error(res.error_message);
              });
           }
        }
     ],

    prepareFormOptions: {
        createTitle: "New Employee Skill",
        modifyTitle: "Edit Employee Skill",
        targetProp: "skill",
        api: {
            endpoint: `${main_view.base_url}/ypg/skills/form-options`,
            params: (op) => {
                return { id: op.id };
            },
            onResponse: (me, res) => {
            }
        }
    },
    onPrepareForm:(me)=>{
        LocaleManager.translateZone(me.divModal);
     },


});

dialog.show(op);
    }
    return self;
})();
