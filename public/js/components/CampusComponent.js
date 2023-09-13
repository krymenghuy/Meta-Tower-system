'use strict';
var CampusComponent = new function(){
    let mThis = this;
    this.title_prop = 'Campus';
    this.self = main_view.appContent.children('#_main_campusComponent');

    this.tblCampus ={};
    this.btnNew = mThis.self.find('#_cps_btn_new');

    this.cols = [
        {
        title: "Campus Name",
        data: "name"
    },
    {
        title: "Shortcut",
        data: "shortcut"
    },
    {
        title: "Action",
        data: (data, a, b) => {
            return [`<div class="d-flex gap-2">
                <a href="javascript:void(0)" class="btn-cps-modify" data-id="${data.id}">
                    <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                </a>
                <a href="javascript:void(0)" class="btn-cps-delete" data-id="${data.id}">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`].join('');
        }
    }];

    this.init = () => {

        mThis.campusListView = new ListView('_campus_list',{
            'fetchApi':`${main_view.base_url}/api/campus/list-paginate`,
            'perPage':5,
            'columns':mThis.cols,
            // 'renderItems':(items,list_container) => {
            //     mThis.renderStudents(list_container,items);
            // },
            'rowCreated':(data,index,tr)=>{
               tr.dataset.id = data.id;
            },
            'listContainerClass':null
        });

        mThis.tblCampus = mThis.campusListView.getTable();

        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.campusListView.showPage(null);
                }
            };
            CampusDialog.show(op);
        });

        mThis.tblCampus.addEventListener('click',e=>{
            e.preventDefault();

            let lnk = VSUtil.clickOnClass(e.target,'btn-cps-modify');
            if(lnk){
                let op = {
                    'id': lnk.dataset.id,
                    'onClose': () => {
                        mThis.campusListView.showPage(null);
                    }
                };
                CampusDialog.show(op);
                return;
            }

          lnk = VSUtil.clickOnClass(e.target,'btn-cps-delete');
          if(lnk){
            let op = {
                'id': lnk.dataset.id
            };
            cv_interact.confirm('Delete this campus?',{title: 'Delete Campus', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/campus/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.campusListView.showPage(null);
                        }
                    });
                }
            });
            return;
          }
           
        });

       
    }
 
    this.show = (options) => {
        if(!options) options = {};
        mThis.campusListView.showPage(null,null,()=>{
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.hide(0,function(){
                mThis.self.hide().fadeIn(200);
            });
        });
    }
}

const CampusDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_cps_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_cps_btn_save');

    mThis.btnSave.on('click',function(e){
        e.preventDefault();
        let p = mThis.getDataForm(false);
        if(!p) return;
        vsapi.call(`${main_view.base_url}/api/campus/save`,p,null).then(res => {
            if(res.status_code === 200){
                mThis.self.modal('hide');
                if(typeof mThis.options.onClose === 'function')
                    mThis.options.onClose();
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    });

    this.getDataForm = (silent =false) => {
        let p = {
            'id': mThis.options.id
        };
        let has_error = false;
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.data('error')==1){
                has_error = true;
                if(!silent) cv_interact.warning([Validator.properCase(f),' is not correct'].join(''));
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

    this.loadFormDetail = (options) => {
        vsapi.call(`${main_view.base_url}/api/campus/details`,{'id': options.id},null).then(res => {
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            }
            mThis.setDataForm(d);
        });
    }
    this.show = (options) => {
        if(!options) options = {};
        mThis.options = options;

        if(options.id > 0){
            mThis.elTitle.text(LocaleManager.trans('Modify Campus','titles'));
            mThis.loadFormDetail(options);
        }
        else{
            mThis.elTitle.text(LocaleManager.trans('New Campus','titles'));
            mThis.setDataForm(null);
        }

        mThis.self.modal({
            backdrop: 'static'
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    CampusComponent.init();
});