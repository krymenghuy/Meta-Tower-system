'use strict';
var StudentGroupComponent = new function(){
    let mThis = this;
    this.title_prop = 'Student Group';
    this.self = $('#_main_studentGroupComponent');

    this.tblStudentGroup = mThis.self.find('#_sdg_tbl');

    this.init = () => {}

    this.displayStudentGroup = (onFinish = null) => {
        window.vsapi.call(`${main_view.base_url}/api/student-group/list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }

            let cols = [{
                title: "Name",
                data: "name"
            }];

            if(mThis.table){
                mThis.tblStudentGroup.DataTable().clear().destroy();
                mThis.tblStudentGroup.empty();
                mThis.table = null;
            }

            if(!mThis.table){
                mThis.table = mThis.tblStudentGroup.DataTable({
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
                        row.setAttribute('data-id',data.id);
                    }
                });
            }

            if(typeof onFinish === 'function') onFinish();
        });
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayStudentGroup(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    StudentGroupComponent.init();
});