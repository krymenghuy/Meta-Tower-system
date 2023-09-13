'use strict';
var ProgramComponent = new function(){
    let mThis = this;
    this.title_prop = "Program";
    this.self = main_view.appContent.children('#_main_programComponent');

    this.btnNew = mThis.self.find('#_pgm_btn_new');

    this.cols = [
        {
        title: "Program Name",
        data: (data,index,tr)=>{
            return ['<span class="fw-semibold">',data.name,'</span>'].join('');
        }
    },
    {
        title: "Previous",
        data: (data,index,tr)=>{
            return ['<span class="fw-semibold">',data.prev_program ? data.prev_program : 'None','</span>'].join('');
        }
    },
    {
        title: "Description",
        data: (data, index, tr)=>{
            return data.description ? data.description : 'N/A';
        }
    },
    {
        title: "Updated",
        data: (data,index,tr)=>{
            return ['<span class="d-block fw-semibold">',data.update_user,'<span><span class="d-block text-left p-1 text-muted"><small>',data.updated_at,'</small></span>'].join('');
        }
    },
    {
        title: "Action",
        data: (data, index, tr) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-pgm-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-pgm-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {
        mThis.programListView = new ListView('_program_list',{
            'fetchApi':`${main_view.base_url}/api/program/list-paginate`,
            'perPage':10,
            'columns':mThis.cols,
            // 'renderItems':(items,list_container) => {
            //     mThis.renderStudents(list_container,items);
            // },
            'rowCreated':(data,index,tr)=>{
               tr.dataset.id = data.id;
            },
            'listContainerClass':null
        });

        mThis.tblProgram = mThis.programListView.getTable();

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.programListView.showPage(mThis.getFilterData());
                }
            };
            ProgramDialog.show(op);
        });
        
        mThis.tblProgram.addEventListener('click',e=>{
            e.preventDefault();
            let lnk = VSUtil.clickOnClass(e.target,'btn-pgm-modify');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id,
                    'onClose': () => {
                        mThis.programListView.showPage(mThis.getFilterData());
                    }
                };
                ProgramDialog.show(op);
                return;
            }

            lnk = VSUtil.clickOnClass(e.target,'btn-pgm-delete');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id
                };
                cv_interact.confirm('Delete this program?',{title: 'Delete Program', context: 'delete'},(e) => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/program/delete`,op,null).then(res => {
                            if(res.status_code === 200){
                                mThis.programListView.showPage(mThis.getFilterData());
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
                return;
            }
        });
 
        mThis.cfg = new ExpandableRowConfig(mThis.tblProgram.getAttribute('id'), {
            'dontExpandByClickingOn': ['btn-pgm-modify', 'btn-pgm-delete'],
            'onOpen': (container, detail_tr, parent_tr) => {
                let id = parent_tr.dataset.id;
                if(id > 0) mThis.displayProgramLevel(container, id);
            }
        });
    }

    this.displayProgramLevel = (container, id) => {
        //let tr_id = ['_pgm_tbl_detail_',id].join('');
        //tr.setAttribute('id', tr_id);
        //let div_wrapper = $(tr).find('.expandable-row-container');
        let html = null;
        container.innerHTML = '';
        vsapi.call(`${main_view.base_url}/api/program-level/list`,{'id': id},null).then(res => {
            const data = res.status_code === 200 ? res.data : [];
            html = [`<div class="rounded-3 p-2 bg-white">
                <button data-programid="${id}" class="btn-add-level btn btn-sm btn-outline-primary btn-sm" type="button">
                    <span class="trans-text">${LocaleManager.trans('Add Level','buttons')}</span>
                </button>
            </div>
            <div class="table-responsive p-1">
            <table class="table tbl_pgm_level">
            <thead>
                <tr>
                    <th>${LocaleManager.trans('Level')}</th>
                    <th>${LocaleManager.trans('Previous Level')}</th>
                    <th>${LocaleManager.trans('Action')}</th>
                </tr>
            </thead>
            <tbody></tbody>`].join('');

            html = [html,`</table></div>`].join('');
            container.innerHTML =  html;

            const tbody = container.querySelector('table.tbl_pgm_level > tbody');
            const btnNewLevel = container.querySelector('.btn-add-level');
            
            btnNewLevel.addEventListener('click',e=>{
                e.preventDefault();
                let prog_id = btnNewLevel.dataset.programid;
                let op = {
                    'id': null,
                    'program_id':prog_id,
                    'onClose': (levels) => {
                        mThis.renderLevelList(tbody,levels);
                    }
                };
                ProgramLevelDialog.show(op);
            });

            mThis.renderLevelList(tbody, data);
        });
    }

    this.setActionHandlers = (tbody) => {
        tbody.addEventListener('click',e=>{
            e.preventDefault();
            let lnk = VSUtil.clickOnClass(e.target,'btn-level-modify');
            if(lnk){
                let prog_id = lnk.dataset.programid;
                let op = {
                    'id': lnk.dataset.id,
                    'program_id':prog_id,
                    'onClose': (levels) => {
                        mThis.renderLevelList(tbody,levels);
                    }
                };
                ProgramLevelDialog.show(op);
                return;
            }

            lnk = VSUtil.clickOnClass(e.target,'btn-level-delete');
            if(lnk){
                const prog_id = lnk.dataset.programid;
                const level_id = lnk.dataset.id;
                const p = {
                    'program_id':prog_id,
                    'id':level_id
                };
                cv_interact.confirm('Delete this level?',{title: 'Delete Level', context: 'delete'},e => {
                    if(e){
                        vsapi.call(`${main_view.base_url}/api/program-level/delete`,p,null,false).then(res => {
                            if(res.status_code === 200){
                                mThis.renderLevelList(tbody,res.data.levels)
                            }
                            else
                                cv_interact.error(res.error_message);
                        });
                    }
                });
                return;
            }
        });
    }

    this.renderLevelList = (tbody, data) => {
        let html = null;
        if(!data) data = [];
        data.map(level => {
            html = [html,`<tr>
                <td>${level.name}</td>
                <td>${level.prev_level}</td>
                <td>
                    <div class="d-flex gap-2">
                        <a href="javascript:void(0)" class="btn-level-modify" data-programid ="${level.program_id}" data-id="${level.id}">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" class="btn-level-delete" data-programid ="${level.program_id}" data-id="${level.id}">
                            <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                        </a>
                    </div>
                </td>
            </tr>`].join('');
        });
        tbody.innerHTML = html;
        mThis.setActionHandlers(tbody);
    }
 
    this.getFilterData = () => {
        return null;
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.programListView.showPage(mThis.getFilterData(),null,()=>{
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        }); 
    }
}

const ProgramDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_pgm_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_pgm_btn_save');
    this.elProgram = mThis.self.find('#dlg_pgm_program');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/program/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose(res.data.levels);
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = (silent=false) => {
        let p = {
            'id': mThis.options.id,
            'program_id':mThis.options.program_id
        };
        let has_error = false;
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.data('error')==1){
                if(!silent) cv_interact.warning([Validator.properCase(f),' is not correct'].join(''));
                has_error = true;
                return false;
            }
            p[f] = el.val();
        });
        return has_error? null : p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        Validator.clearErrors(mThis.self);
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            el.val(d[f]);
        });
    }

    this.loadFormDetails = (options) => {
        vsapi.call(`${main_view.base_url}/api/program/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOptions = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/option/prev-program`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elProgram,d,'id','program',true,'None',0);
            if(typeof onFinish === 'function') onFinish();
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;
        
        mThis.prepareFormOptions(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify','titles'));
                mThis.loadFormDetails(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop:'static'
            });
        });
    }
}

const ProgramLevelDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_detail_pgm_');
    this.options = {};

    this.btnSave = this.self.find('#dlg_pgm_detail_btn_save');
    this.elTitle = mThis.self.find('.modal-title');
    this.elLevel = mThis.self.find('#dlg_detail_pgm_level');
    
    this.btnSave.on('click',function(){
        let p =mThis.getDataForm(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/program-level/save`,p,null,false).then(res=>{
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose(res.data.levels);
            }
            else
                cv_interact.error(res.error_message);
        });
    });

    this.getDataForm = (silent = false) => {
        let p = {
            'id': mThis.options.id,
            'program_id':mThis.options.program_id
        };
         let has_error = false;
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.data('error')==1){
                if(!silent) cv_interact.warning([Validator.properCase(f),' is not correct'].join(''));
                has_error =true;
                return false;
            }
            p[f] = el.val();
        });
        return has_error? null: p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        Validator.clearErrors(mThis.self);
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            el.val(d[f]);
        });
    }

    this.loadFormDetails = (options) => {
        vsapi.call(`${main_view.base_url}/api/program-level/details`,{'id': options.id},null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.setDataForm(data);
        });
    }

    this.prepareFormOptions = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/option/prev-program-level`,null,null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            VSUtil.setComboItems(mThis.elLevel,d,'id','level',true,'None',0);
            if(typeof onFinish === 'function') onFinish();
        });
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            if(options.id > 0){
                mThis.elTitle.text(LocaleManager.trans('Modify','titles'));
                mThis.loadFormDetails(options);
            }
            else{
                mThis.elTitle.text(LocaleManager.trans('New','titles'));
                mThis.setDataForm(null);
            }
    
            mThis.self.modal({
                backdrop: 'static'
            });
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ProgramComponent.init();
});