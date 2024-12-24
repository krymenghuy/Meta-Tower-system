"use strict";

var SkillsComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_skillsComponent");
    this.self = this.jm[0];
    this.title_prop = "Skills";
    this.btnAdd = this.self.querySelector("#_btnAddSkill");
    this.divFilter = this.self.querySelector("#_divFilter_skill");
    this.elSearch = this.self.querySelector("#_search_skill");
    let div = mThis.self.querySelector("#_skill_list");


    this.init = () => {
        if (mThis.initAlready) return;

        mThis.SkillListView = new ListView('_skill_list', {
            fetchApi: `${main_view.base_url}/hr/skills/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
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
        this.listContainer = mThis.SkillListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        mThis.setAction(sh_parent);

        

        mThis.initAlready = true;
    };
    this.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    this.setAction = (tbl)=>{
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

    this.renderSkillCard = (div,data) => {
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
    this.renderSkill = (data) => {
        let html = `
            <div class="card-row-skill">
        `;
    
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                html += `
                    <div class="col-md-3 mt-3">
                        <div class="card-container">
                            <div class="w-100 d-flex flex-row justify-content-center align-items-center p-1 mb-2 shadow rounded-3" style="background-color: #ffffff;">
                                <!-- <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                    <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                        <path class="circle-bg" d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831" 
                                            fill="none" stroke="#2b3991" stroke-width="4" />
                                        <path class="circle" d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831" 
                                            fill="none" stroke="#cab54a" stroke-width="4" 
                                            stroke-dasharray="100, 100" stroke-linecap="round" />
                                    </svg>
                                    <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle" 
                                        style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                        <p class="fs-6 m-0">${d.count_member}</p>
                                        <small>Members</small>
                                    </div>
                                </div> -->
                                <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                    <div class="w-100">
                                        <p class="fs-6" style="color: #2b3991;">${d.title}</p>
                                        <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                        <div class="d-flex">
                                            <a href="javascript:void(0)" data-id="${d.id}" class="me-3 text-warning b-btn-edit text-decoration-none" >
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </a>
                                            <a href="javascript:void(0)" data-id="${d.id}" class="text-danger b-btn-delete text-decoration-none">
                                                <i class="fa-regular fa-trash-can"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="col-12 text-center">
                    <div class="alert alert-info" role="alert">
                        No skills available to display.
                    </div>
                </div>
            `;
        }
    
        html += `
            </div>
        `;
    
        div.innerHTML = html;
    };
    
    
   
  
    // this.editSkill = (id, menuLink) => {

    //     let op = {
    //         id: id,
    //         btn: menuLink,
    //         onClose: () => {
    //             mThis.SkillListView.showPage();
    //         }
    //     };
    //     console.log(333,op);

    //     SkillDialog.show(op);
    // }

    // this.deleteSkill = (id, menuLink) => {
    //     let op = {
    //         id: id,
    //         btn: menuLink,
    //         onClose: () => {
    //             mThis.SkillListView.showPage();
    //         }
    //     };
    //     cv_interact.confirm('Delete this Skill?',{
    //         title: 'Delete Skill',
    //         context: 'delete',
    //         confirmButtonText:"Delete"
    //     },function(e){
    //         if(e){
    //             vsapi.call(`${main_view.base_url}/hr/skills/delete`,op,false,false,false).then(res => {
    //                 if(res.status_code == 200){
    //                     cv_interact.success('Deleted Successfully');
    //                     mThis.SkillListView.showPage();
    //                 }
    //             })
    //         }
    //     });

    // }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.SkillListView.showPage(null, null, () => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(200);
        });
    };
})();
const SkillDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
    cssClass: "",
    createContent: () => {
        return [
            `<div class="w-100 d-flex flex-wrap flex-row align-items-center justify-content-center gap-2">
                 <div name="div_skill_photo" class="data-input" data-field="image_url" role="button"></div>
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
