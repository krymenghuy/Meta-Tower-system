'use strict';
var AcademicYearComponent = new function(){
    let mThis = this;
    this.title_prop = 'Academic Year';
    this.self = $('#_main_academicYearComponent');

    this.tblAcademic = mThis.self.find('#_adm_tbl');
    this.btnNew = mThis.self.find('#_adm_btn_new');

    this.init = () => {
        mThis.btnNew.on('click',function(e){
            e.preventDefault();
            let op = {
                'id': 0,
                'onClose': () => {
                    mThis.displayAcademic();
                }
            };
            AcademicDialog.show(op);
        });

        mThis.tblAcademic.on('click','a.btn-adm-modify',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id'),
                'onClose': () => {
                    mThis.displayAcademic();
                }
            };
            AcademicDialog.show(op);
        });

        mThis.tblAcademic.on('click','a.btn-adm-delete',function(e){
            e.preventDefault();
            let op = {
                'id': $(this).data('id')
            };
            cv_interact.confirm('Delete this academic year?',{ title: 'Delete Academic Year', context: 'delete'},(e) => {
                if(e){
                    vsapi.call(`${main_view.base_url}/api/academic-year/delete`,op,null).then(res => {
                        if(res.status_code === 200){
                            mThis.displayAcademic();
                        }
                    });
                }
            });
        });
    }

    this.displayAcademic = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [
                {
                title: "Academic Year",
                data: "academic_year"
            },
            {
                title: "Start Date",
                data: "start_date"
            },
            {
                title: "End Date",
                data: "end_date"
            },
            // {
            //     title: "Dropout Students",
            //     data: "dropout_count"
            // },
            {
                title: "Updated By",
                data: (data,index,tr)=>{
                    return ['<div class="d-flex flex-column"><span class="fw-semibold">',data.update_user,'</span><span class="text-left text-muted" style="font-size:0.9em">',data.updated_at,'</span></div>'].join('');
                }
            },
            {
                title: "Action",
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

            if(mThis.table){
                mThis.tblAcademic.DataTable().clear().destroy();
                mThis.tblAcademic.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblAcademic.DataTable({
                    searching: false,
                    destroy: true,
                    paging: true,
                    ordering: false,
                    retrieve: true,
                    info: true,
                    pageLength: 10,
                    bLengthChange: false,
                    saveState: true,
                    processing: true,
                    language: {
                        loadingRecords: '&nbsp;',
                        processing: 'Loading...',
                        emptyTable: LocaleManager.trans('No data to display', 'datatable')
                    },
                    data: data,
                    columns: cols,
                    createdRow: function (row, data, dataIndex) {
                        let tr = $(row);
                        tr.data('id', data.id);
                    }
                });
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayAcademic(() => {
            main_view.setTitle(mThis.title_prop);
            let x = mThis.self.siblings(':visible');
            x.fadeOut('fast',function(){
                mThis.self.hide().fadeIn(300);
            });
        });
    }
}

let AcademicDialog = new function(){
    let mThis = this;
    this.self = $('#dlg_adm_');
    this.options = {};

    this.elTitle = mThis.self.find('.modal-title');
    this.btnSave = mThis.self.find('#dlg_adm_btn_save');

    this.btnSave.on('click',e=>{
        let p = mThis.getDataForm();
        vsapi.call(`${main_view.base_url}/api/academic-year/save`,p,null,false).then(res => {
            let data = {};
            if(res.status_code === 200){
                 if(typeof mThis.options.onClose ==='function') mThis.options.onClose();
                 mThis.self.modal('hide');
            }else cv_interact.error(res.error_message);
        });
    });

    this.getDataForm = () => {
        let p = {
            'id': mThis.options.id
        };
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            p[f] = el.val();
        });
        return p;
    }

    this.setDataForm = (d) => {
        d = d ? d : {};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
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