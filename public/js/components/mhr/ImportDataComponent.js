'use strict';



var ImportDataComponent = new function(){
    const mThis = this;
    this.title_prop = "import_data";
    mThis.self = main_view.VSAppContent.querySelector('#_main_importDataComponent');
    mThis.btnNew = mThis.self.querySelector('#_iht_btn_new');
    mThis.btnNewBenefit = mThis.self.querySelector('#_iht_btn_new_benefit');
    mThis.btnOld = mThis.self.querySelector('#_iht_btn_old');

    mThis.cols = [{
        transTitle: "titles.Name",
        className: "align-middle",
        data: "title"
    },
    {
        transTitle: "titles.File Name",
        className: "align-middle",
        data: "file_name"
    },
    {
        transTitle: "titles.File Type",
        className: "align-middle text-uppercase",
        data: "type"
    },
    {
        transTitle: "titles.Imported By",
        className: "align-middle",
        data: (data, index, tr) => {
            return `<p class="pb-0 mb-1 text-capitalize">${data.create_user ?? ''}</p>
            <small class="text-capitalize">${data.imported_date ?? ''}</small>`;
        }
    }];

    this.init = () => {
        if(mThis.initAlready) return;

        mThis.itemView = new ListView("_iht_container_tbl", {
            fetchApi: `${main_view.base_url}/mhr/employee/imported-file-history`,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass: "table header-light-blue header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
            },
            beforeRender: () => {}
        });

         mThis.btnNew.onclick = (e) =>{
            e.preventDefault();
            
            // if(!AuthManager.allowed(407)) return;
            FileChooser.chooseFile({
                accept: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },(d) => {
                if(d){
                    vsapi.call(`${main_view.base_url}/mhr/employee/import`,{
                        file: d.dataUrl
                    },false).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                            cv_interact.success('import_success');
                        }
                        else{
                            cv_interact.error(res.error_message );
                        }
                    });
                }
            });
        };
         mThis.btnNewBenefit.onclick = (e) =>{
            e.preventDefault();
            
            // if(!AuthManager.allowed(407)) return;
            FileChooser.chooseFile({
                accept: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },(d) => {
                if(d){
                    vsapi.call(`${main_view.base_url}/mhr/emp-benefit/import-emp-benefits`,{
                        file: d.dataUrl
                    },false).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                            cv_interact.success('import_success');
                        }
                        else{
                            cv_interact.error(res.error_message );
                        }
                    });
                }
            });
        };

        mThis.btnOld.onclick = function(e){
            e.preventDefault();
            FileChooser.chooseFile({
                accept: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },(d) => {
                if(d){
                    vsapi.call(`${main_view.base_url}/`,{
                        file: d.dataUrl
                    },null).then(res => {
                        if(res.status_code === 200){
                            mThis.itemView.showPage(null);
                            cv_interact.success(res.error_message );
                        }
                        else{
                            cv_interact.error(res.error_message );
                        }
                    });
                }
            });
        };
   
        mThis.pr_tbl = mThis.itemView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.initAlready = true;
    }
 
    this.show = (options) => {
        mThis.init();
        if(!options) options = {};
        main_view.setContentView(mThis.self,mThis.title_prop);
        mThis.itemView.showPage();
    }
}