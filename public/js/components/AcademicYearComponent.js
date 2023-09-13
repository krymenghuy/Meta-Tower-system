'use strict';
var AcademicYearComponent = new function(){
    let mThis = this;
    this.title_prop = 'Academic Years';
    this.self = $('#_main_academicYearComponent');

    this.tblAcademic = {};
    this.btnNew = mThis.self.find('#_adm_btn_new');

    this.cols = [{
        title: "Academic Year",
        className: 'align-middle',
        data: "academic_year"
    },
    {
        title: "Start Date",
        className: 'align-middle',
        data: "start_date"
    },
    {
        title: "End Date",
        className: 'align-middle',
        data: "end_date"
    },
    {
        title: "Updated By",
        className: 'align-middle',
        data: (data, index, tr)=>{
            return ['<div class="d-flex flex-column"><span class="text-capitalize fw-semibold">',data.update_user,'</span><span class="text-left text-muted" style="font-size:0.9em">',data.updated_at,'</span></div>'].join('');
        }
    },
    {
        title: "Action",
        className: 'align-middle',
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-adm-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-adm-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.getFilterData = () => {
        return null;
    }

    this.init = () => {
        mThis.acadYearListView = new ListView('_acad_year_list',{
            'fetchApi':`${main_view.base_url}/api/academic-year/list-paginate`,
            'perPage':10,
            'columns':mThis.cols,
            // 'renderItems':(items,list_container) => {
            //     mThis.renderStudents(list_container,items);
            // },
            'listContainerClass':null
        });

        mThis.tblAcademic = $(mThis.acadYearListView.getTable());

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.acadYearListView.showPage(mThis.getFilterData());
                }
            };
            AcademicDialog.show(op);
        });

        mThis.tblAcademic.on('click',(e) => {
            e.preventDefault();
            //Click event for Modify Academic Year
            let lnk = VSUtil.clickOnClass(e.target,'btn-adm-modify');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id,
                    'onClose': () => {
                        mThis.acadYearListView.showPage(mThis.getFilterData());
                    }
                };
                AcademicDialog.show(op);
                return;
            }

            //Click event for Delete Academic Year
            lnk = VSUtil.clickOnClass(e.target,'btn-adm-delete');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id
                };
                cv_interact.confirm('Delete this academic year?',{ title: 'Delete Academic Year', context: 'delete'},(e) => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/academic-year/delete`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.acadYearListView.showPage(mThis.getFilterData());
                            }
                            else 
                                cv_interact.warning(res.error_message);
                        });
                    }
                });
                return;
            }
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.acadYearListView.showPage(mThis.getFilterData(),null,()=>{
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

const AcademicDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_adm_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_adm_btn_save');

    this.btnSave.on('click',(e) => {
        e.preventDefault();
        const p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/academic-year/save`,p,null,false).then(res => {
            let data = res.data?res.data:{};
            if(res.status_code === 200){
                data.id = mThis.options.id;
                if(typeof mThis.options.onClose ==='function')
                    mThis.options.onClose(data);
                mThis.self.modal('hide');
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.self.on('show.bs.modal',(e) => {
        e.preventDefault();
        if(mThis.options.previousDialog) 
            mThis.options.previousDialog.self.modal('hide');
    });

    this.self.on('hide.bs.modal',(e) => {
        e.preventDefault();
        if(mThis.options.previousDialog){
            mThis.options.previousDialog.show(mThis.previousDialog_options); 
            if(typeof mThis.options.onClose ==='function')
                mThis.options.onClose({'id':mThis.options.id});
        }
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id
        };
        mThis.self.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.self.find('.data-input').each(function(){
            const el = $(this);
            const f = el.data('field');
            el.val(d[f]);
        });
    }

    this.loadFormDetail = (options) => {
        vsapi.call(`${main_view.base_url}/api/academic-year/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
        });
    }
    
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Modify Academic Year','titles'));
            mThis.loadFormDetail(options);
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('New Academic Year','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop: "static"
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    AcademicYearComponent.init();
});