"use strict";

var SkillsComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_skillsComponent");
    this.self = this.jm[0];
    this.title_prop = "Skills";
    this.btnAdd = this.self.querySelector("#_btnAddSkill");
    this.divFilter = this.self.querySelector("#_divFilter_skill");
    this.elSearch = this.self.querySelector("#_sdl_search_skill");
    this.containerPagination = mThis.self.querySelector('#container_pagination');



    this.init = () => {
        if (mThis.initAlready) return;

        mThis.SkillsListView = new ListView('_skill_list', {
            fetchApi: `${main_view.base_url}/hr/skills/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            processResponse: (res) => {
                console.log(123,res.data);

                return res.data;
            },
            renderItems: (data,list_container) => {

                mThis.renderskillsList(list_container, data);

            },
            listContainerClass: null
        });
        this.listContainer = mThis.SkillsListView.getListContainer();

        let content = mThis.self.querySelector('#_skill_list');
        // console.log(2222, content);

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SkillsListView.showPage();
                }
            };


            SkillDailog.show(op);
        };
        const pr_tbl = mThis.SkillsListView.getListContainer();
        const sh_parent = pr_tbl;


        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.SkillsListView.showPage(mThis.getDataFormFilter());
        });

        mThis.initAlready = true;
    };
    this.setAction = (tbl)=>{
        console.log(9999,tbl);

        tbl.addEventListener('click', (e) => {

            let btn = VSUtil.closestLimited(e.target,'button.b-btn-delete');
            if (btn) {
                mThis.deleteSkill(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target,'button.b-btn-edit');
            console.log(3344,btn);

            if (btn) {
                mThis.editSkill(btn.dataset.id, btn);
            }
        })
    }

    this.renderskillsList = (div,data) => {
        console.log(666,div,777,data);
        data = data ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then(user => {
            // console.log(user);
           mThis.renderskills(data,user)
        });
    }
    this.renderskills = (data) => {
        console.log(777, data);

        let div = mThis.self.querySelector("#_skill_list");
        let html = `
            <div id="_scroll_skill">
                <div id="_skill_detail" class="row">
        `;

        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                console.log(5555,d);

                html += `
                        <div class="skills col-3">
                        <div class="default">
                            <div class="card_header">
                                <h3 id="title">${d.title}</h3>
                                <img src="${d.image_url}" alt="">
                            </div>
                            <p>${d.description}</p>
                            <div class="count_staff">
                                <div class="count">
                                    <i class="fa fa-users"></i>
                                    <span>${d.count_member}</span>
                                </div>
                                <div class="action">
                                    <button class="btn btn-sm btn-primary b-btn-edit" data-id="${d.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                                    <button class="btn btn-sm btn-danger b-btn-delete" data-id="${d.id}"><i class="fa-regular fa-trash-can"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cmt++;
            });
        }

        if (cmt === 0) {
            html += `
                <div class="w-100 rounded-3 border-start text-center border-5 border-danger-custom p-3 shadow bg-white mb-3 position-relative">
                    <div class="row">
                        <div class="col">No Data Found</div>
                    </div>
                </div>`;
        }

        html += `</div></div>`;
        div.innerHTML = html;


        const sh_parent = div.querySelector('#_scroll_skill');
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        mThis.setAction(sh_parent);


    };
    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.SkillsListView) {
                mThis.SkillsListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("SkillsListView is not defined");
            }
        }, 200);
    });
    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

        return p;
    };
    this.editSkill = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SkillsListView.showPage();
            }
        };
        console.log(333,op);

        SkillDailog.show(op);
    }

    this.deleteSkill = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.SkillsListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Skill?',{
            title: 'Delete Skill',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/skills/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.SkillsListView.showPage();
                    }
                })
            }
        });

    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.SkillsListView.showPage(null, null, () => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(200);
        });
    };
})();
const SkillDailog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
    cssClass: "",
    createContent: () => {
        return [
            `<div class="w-100 d-flex flex-wrap flex-row align-items-center justify-content-center gap-2">
                 <div name="div_skill_photo" class="data-input" data-field="image_url" role="button">></div>
            </div>`,

            `<div class="form-group col-md-12">`,
            `<label class="form-label" vslang="titles.title"> Title </label>`,
            `<div><input name="title" class="form-control data-input" data-field="title"/></div>`,
            `</div>`,

            `<div class="form-group col-md-12">`,
            `<label class="form-label" vslang="titles.Description"> Description </label>`,
            `<div><input name="description" class="form-control data-input" data-field="description"/></div>`,
            `</div>`,

        ].join('');
    },
    onPrepareForm:(me)=>{
        LocaleManager.translateZone(me.divModal);
        let div_skill_photo = me.divModal.querySelector('[name="div_skill_photo"]');
        console.log(444,div_skill_photo);
        me.userImageBox = new ImageBox(div_skill_photo,{containerclass:'skill-profile-container',imgClass:"data-input",dataset:{"field" :"image_url"}});
        console.log(999,op);

        me.showProfile =  (code) =>{
           let fields = [];
           let p = {'id':code};
           console.log(4545,me);

           vsapi.call([main_view.base_url,'/hr/skills/form-options'].join(''),p,false,false).then(res =>{
              let d = res.status_code ==200? res.data: {};
              d = d.skill || {};

              me.divModal.querySelectorAll('.data-input').forEach(el =>{
                 const f =el.dataset.field;
                 console.log(7788899,d);

                 if(fields.indexOf(f)>=0){
                       el.value = d[f] || "";
                 }
                else if(f ==='image_url'){
                    if (me.dataOptions.id)
                    el.innerHTML = `<img name="div_skill_photo" class="w-100" src="${d[f] || ''}"/>`;
                }
              });
           });
        };
        me.deleteImage = (div) => {
            const btnDelete = div;//.querySelector('[role=\'button\']');
            btnDelete.onclick = function(e){
                e.preventDefault();
                const html = `<div id="dlg_image_chooser"
                                    class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                    <i class="fa-regular fa-image fs-4 text-muted"></i>
                                </div>`;
                div.innerHTML = html;
                // mThis.chooseImage(div);
                // let div_skill_photo = div.querySelector('[name="div_skill_photo"]');
                me.userImageBox = new ImageBox(div,{containerclass:'skill-profile-container',imgClass:"data-input",dataset:{"field" :"image_url"}});
            }
        }

        me.deleteImage(div_skill_photo);


        me.showProfile(me.dataOptions.id);


     },
    buttons:[
        {
           label:"<span>Cancel</span>",
           cssClass:"btn btn-warning",
           click:(me)=>{
              me.hide(false);
           }
        },
        {
           label:"<span>Save</span>",
           cssClass:"btn btn-primary",
           click:(me)=>{
              let p = me.getData();
              p.image = me.userImageBox? me.userImageBox.getImage(): '';
              console.log(222,p);
              vsapi.call([main_view.base_url,'/hr/skills/save'].join(''),p,false,false).then(res =>{
                  if(res.status_code ==200){
                      me.modal.hide(true,p);
                  }else cv_interact.error(res.error_message);
              });
           }
        }
     ],
    // configSelect: [
    //     {
    //         name: "emp_id",
    //         data:"employees",
    //         valueField: "id",
    //         textField: "name",
    //         filterData:(data,res)=>{
    //             return data.options;
    //         }
    //     },
    //     {
    //         name: "module",
    //         data: "modules",
    //         filterOptions: {
    //             triggerBy: "emp",
    //             filter: (me, data, controls) => {
    //                 return data.filter(x => x.emp_id === controls.emp.value);
    //             }
    //         },
    //         valueField: "id",
    //         textField: "name",
    //         depends: {
    //             triggerBy: "emp",
    //             api: {
    //                 endpoint: `${main_view.base_url}/api/module/list`,
    //                 params: (me, dataOptions, controls) => {
    //                     return { "emp_id": controls.emp.value };
    //                 },
    //                 onResponse: (me, res) => {
    //                     console.log(111, res.data);
    //                 }
    //             }
    //         }
    //     }
    // ],
    prepareFormOptions: {
        createTitle: "New Employee Skill",
        modifyTitle: "Edit Employee Skill",
        targetProp: "skill",
        api: {
            endpoint: `${main_view.base_url}/hr/skills/form-options`,
            params: (op) => {
                return { id: op.id };
            },
            onResponse: (me, res) => {
                console.log(111, res);
            }
        }
    },
    onShow: (me) => {
        // me.controls.emp.focus();
        // me.controls.emp.select();
    }

});
console.log(888,op);

dialog.show(op);
    }
    return self;
})();
