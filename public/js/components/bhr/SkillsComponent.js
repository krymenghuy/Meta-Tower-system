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
    this.paginationContainer = mThis.self.querySelector("#skill_container_pagination");


    this.init = () => {
        if (mThis.initAlready) return;

        mThis.SkillListView = new ListView('_skill_list', {
            fetchApi: `${main_view.base_url}/hr/skills/list-paginate`,
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
        sh_parent.style.height = (window.innerHeight - 220) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 220) + 'px';
        }
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
        let html = "";
        html = [html,`<div class="row">`].join('');
        let cmt = 0;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {
                html = [html,`<div class="col-md-3 mb-3 ">
                        <div class="card-container-skill">
                            <div class="w-100 d-flex flex-row justify-content-center align-items-center shadow rounded-3" style="background-color: #2b3991;">
                                <div class="section-title fs-6 text-start w-100">
                                    <div class="card-body bg-white rounded-3 text-center">
                                        <div class="overflow-hidden rounded-circle mx-auto p-auto d-flex justify-content-center border bg-white border-4 mb-3 " style="width: 70px; height: 70px;"> 
                                        <img src="${ d.image_url || (main_view.asset_url + "/images/default/default-staff.png")}" class="h-100" alt="Profile Picture" >
                                        </div>
                                        <p class="fs-6" style="color: #2b3991;">${d.title}</p>
                                        <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 100%;">
                                        <div class="d-flex justify-content-between">
                                        
                                            <div class="d-flex justify-content-end gap-2">
                                                <a href="javascript:void(0)" data-id="${d.id}" class="text-primary b-btn-edit text-decoration-none" >
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
                    </div>
                `].join('');
                cmt++;
            });
        } 
        if(cmt === 0 ){
            html = [`<div class="w-100 rounded-4 text-center p-3">No Skills</div>`].join('');
        }
        html += `</div>`;
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
