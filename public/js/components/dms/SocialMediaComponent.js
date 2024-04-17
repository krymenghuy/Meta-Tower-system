"use strict";
var SocialMediaComponent = new function(){
    const mThis = this;
    this.title_prop = "Social Media";
    this.self = main_view.appContent.children('#_main_socialMediaComponent');
    this.btnNew = mThis.self.find('#_scm_btn_new');

    this.cols = [
        {
            title: "Logo",
            data: (data, index, tr) => {
                return `<div class="image-logo-tbl">
                    <a href="${data.url ?? 'javascript:void(0)'}" target="_blank">
                        <img class="w-100 h-100 rounded-circle" src="${data.image_url ?? ''}" alt=""/>
                    </a>
                </div>`;
            }
        },
        {
            title: "Social Name",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
                return `<a class="text-dark" href="${data.url ?? 'javascript:void(0)'}" target="_blank">${data.name ?? ''}</a>`;
            }
        },
        {
            title: "Social URL",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<a href="${data.url ?? 'javascript:void(0)'}" target="_blank">${data.url ?? ''}</a>`;
            }
        },
        {
            title: "Created By",
            data: (data, index, tr) => {
                return `<p class="pb-0 mb-1">${data.update_user ?? ''}</p>
                <small class="text-success">${data.updated_at ?? ''}</small>`;
            }
        },
        {
            title: "Action",
            className: 'align-middle text-capitalize',
            data: (data, index, tr) => {
                return `<div class="d-flex gap-2">
                    <a href="javascript:void(0)" class="btn-scm-modify" data-id="${data.id}">
                        <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                    </a>
                    <a href="javascript:void(0)" class="btn-scm-delete" data-id="${data.id}">
                        <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                    </a>
                </div>`;
            }
        }
    ];

    this.init = () => {
        if(mThis.initAlready) return;
        
        mThis.socialListView = new ListView("container_tbl_scm", {
            fetchApi: `${main_view.base_url}/dms/mobile-settings/social-media/list-all`,
            clientSidePagination:true,
            perPage:10,
            processResponse:(res)=>{
                return res.data;
            },
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass: "table header-light-blue header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id
            },
            beforeRender: () => {},
        });

        mThis.tblSocialMedia = mThis.socialListView.getTable();

        mThis.btnNew.on('click',function(e)
        {
            e.preventDefault();
            let op = {
                id: null,
                onClose: () => {
                    mThis.socialListView.showPage(null);
                }
            };

            if(!AuthManager.allowed(293)) return;
            SocialMediaDialog.show(op);
        });

        mThis.tblSocialMedia.addEventListener('click',function(e)
        {
            let btn = VSUtil.getElementByClass(e.target,'btn-scm-modify');
            if(btn)
            {
                e.preventDefault();
                let op = {
                    id: btn.dataset.id,
                    onClose: () => {
                        mThis.socialListView.showPage(null);
                    }
                };
                if(!AuthManager.allowed(294)) return;
                SocialMediaDialog.show(op);
                return;
            }

            btn = VSUtil.getElementByClass(e.target,'btn-scm-delete');
            if(btn)
            {
                e.preventDefault();
                let op = {
                    id: btn.dataset.id
                };
                if(!AuthManager.allowed(295)) return;
                cv_interact.confirm('Delete this social media?',
                {
                    title: 'Delete Social',
                    context: 'delete'
                },
                (e) => {
                    if(e)
                    {
                        vsapi.call(`${main_view.base_url}/dms/mobile-settings/social-media/delete`,op,null).then(res => {
                            if(res.status_code === 200)
                            {
                                mThis.socialListView.showPage(null);
                            }
                            else
                            {
                                cv_interact.error(res.error_message ?? 'Failed to delete social media!');
                            }
                        });
                    }
                });
                return;
            }
        });

        mThis.initAlready = true;
    }

    this.show = (options) => {
        mThis.init();//one time init only
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.socialListView.showPage(null);
        mThis.self.siblings().hide();
        mThis.self.fadeIn(200);
    }
}

const SocialMediaDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.children('#dlg_scm_');
    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_scm_btn_save');
    this.btnChoose = mThis.self.find('#dlg_scm_logo_social');

    this.chooseImage = (div,options) => {
        div.on('click',function(e)
        {
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    const parent = div.parent();
                    mThis.setImage(parent,options,d.dataUrl);
                }
            });
        });

        mThis.btnSave.off('click').on('click',function(e)
        {
            e.preventDefault();
            let p = mThis.getDataForm(options);
            vsapi.call(`${main_view.base_url}/dms/mobile-settings/social-media/save`,p,null).then(res => {
                if(res.status_code === 200)
                {
                    mThis.self.modal('hide');
                    if(typeof options.onClose === 'function') options.onClose();
                }
                else
                {
                    cv_interact.error(res.error_message ?? 'Something went wrong!');
                }
            });
        });
    }

    this.setImage = (div,options,image=null) => {
        if(image)
        {
            const html = `<img class="w-100 h-100 object-fit-scale data-input" src="${image}" alt="" data-field="photo"/>
            <div class="on-hover-display position-absolute p-2 bg-dark rounded-3 top-0 end-0">
                <a href="javascript:void(0)" class="btn-scm-delete">
                    <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                </a>
            </div>`;
            div.html(html);
            mThis.deleteImage(div,options);
        }
        else
        {
            const html = `<div id="dlg_scm_logo_social" class="d-flex align-items-center justify-content-center w-100 h-100">
                <i class="fa-regular fa-image fs-4 text-muted"></i>
            </div>`;
            div.html(html);
            mThis.chooseImage(div.find('#dlg_scm_logo_social'),options);
        }
    }

    this.deleteImage = (div,options) => {
        div.on('click','a.btn-scm-delete',function(e)
        {
            e.preventDefault();
            const html = `<div id="dlg_scm_logo_social" class="d-flex align-items-center justify-content-center w-100 h-100">
                <i class="fa-regular fa-image fs-4 text-muted"></i>
            </div>`;
            div.html(html);
            mThis.chooseImage(div.find('#dlg_scm_logo_social'),options);
        });
    }

    this.getDataForm = (options) => {
        const div = mThis.self;
        let p = {
            id: options.id
        };
        div.find('.data-input').each(function()
        {
            const el = $(this);
            const f = el.data('field');
            if(el.is('img'))
                p[f] = el.attr('src');
            else
                p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d,options) => {
        d = d ?? {};
        const div = mThis.self,
        containerIcon = div.find('.logo-social-media');
        mThis.setImage(containerIcon,options,d.image_url);
        div.find('.data-input').each(function()
        {
            const el = $(this);
            const f = el.data('field');
            el.val(d[f] ?? '');
        });
    }

    this.loadFormDetails = (options,onFinish=null) => {
        vsapi.call(`${main_view.base_url}/dms/mobile-settings/social-media/details`,{
            id: options.id
        },null).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data;
                mThis.setDataForm(d,options);
                if(typeof onFinish === 'function') onFinish();
            }
            else
            {
                cv_interact.error(res.error_message ?? 'Failed to load data!');
            }
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        
        if(options.id > 0)
        {
            mThis.elTitle.text(LocaleManager.trans('Modify Social','titles'));
            mThis.loadFormDetails(options);
        }
        else
        {
            mThis.elTitle.text(LocaleManager.trans('New Social','titles'));
            mThis.setDataForm(null);
        }
        mThis.chooseImage(mThis.btnChoose,options);
        mThis.self.modal({
            backdrop: 'static'
        });
    }
}