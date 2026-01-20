"use strict";
var ServiceRequestComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Service Request Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_request_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnServiceRequest");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_service_request");
    mThis.elFilter_status = mThis.self.querySelector('#_service_request_status');
    mThis.elFilter_type = mThis.self.querySelector('#_service_request_type_id');
    mThis.elSearch = mThis.self.querySelector("#_search_service_request");


    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "Tenant",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.tenant_id ?? ''}</span>`;
            }
        },
         {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.name ?? ''}</span>`;
            }
        },
        {
            title: "Floor",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.floor_id ?? ''}</span>`;
            }
        },
        {
            title: "Building",
            className: "align-middle",
           data: (data) => {
                return `<span class="text-primary-custom">${data.building_id ?? ''}</span>`;
            }
        },
        // {
        //     title: "Price",
        //     className: "align-middle",
        //     data: (data) => {
        //         const cur_symbol = data.cur_symbol ?? '$';
        //         const formattedPrice = data.price ? Number(data.price).toLocaleString() : '-';

        //         const unitLabel = data.unit_type ? `/ ${data.unit_type}` : '';

        //         return `<span class="fw-semibold">${cur_symbol} ${formattedPrice} <small class="text-muted">${unitLabel}</small></span>`;
        //  }
        // },

        {
            title: "Service Type",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.service_type ?? 'N/A'}</span>
                    </div>
                `;
            }
        },

        {
            title: "Status",
            className: "align-middle",
            data: (data) => {
                const status = (data.status ?? '').toLowerCase();
                let cls = 'text-info';

                if (status == 'inactive') {
                    cls = 'text-white px-3 py-1 rounded-3 bg-danger d-inline-block';
                } else if (status == 'active') {
                    cls = 'text-white px-3 py-1 rounded-3 bg-success d-inline-block';
                }

                return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
            },
        },


       {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-primary-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            title : "Action",
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-white fs-5"></i>
                    </a>
                </div>`
        },

    ];
     mThis.init = () => {
        if (mThis.initAlready) return;

         mThis.requestListView = new ListView('_service_request_list', {
            fetchApi: `${main_view.base_url}/prm/service-request/list-service-request`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
              tr.dataset.id = data.id;
            //   tr.dataset.statusid = data.status_id;
            //   tr.classList.add('service');
            //   tr.setAttribute('id',['service_id',data.id].join(''));

            },
            listContainerClass: null
        });

        // const table =  mThis.requestListView.getTable();

        mThis.initAlready=true;
     };
     mThis.btnAdd

     mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
       // mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ServiceListView.showPage(mThis.getFilterData());
        //});

    };
     return mThis;
     // return self
})();
