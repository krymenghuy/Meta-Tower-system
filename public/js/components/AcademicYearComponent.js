'use strict';
var AcademicYearComponent = new function(){
    let mThis = this;
    this.title_prop = 'Academic Year';
    this.self = $('#_main_academicYearComponent');

    this.tblAcademic = mThis.self.find('#_adm_tbl');

    this.init = () => {}

    this.displayAcademic = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/academic-year/list`,null,null).then(res => {
            let data = {};
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [{
                title: "Academic Year",
                data: "academic_year"
            },
            {
                title: "Created By",
                data: "create_user"
            },
            {
                title: "Date",
                data: "date"
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
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    AcademicYearComponent.init();
});