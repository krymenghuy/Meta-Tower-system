"use strict";
var AnnouncementComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Annountcement Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_announ_component");
     mThis.btnAdd = mThis.self.querySelector("#_btnAddAnnoun");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_announ");
    mThis.elSearch = mThis.self.querySelector("#_search_announ_info");
    mThis.elFilter_status = mThis.self.querySelector("#el_status");


    mThis.cols = [

        {
            title: "",
            className: "align-middle",
        },
        {
            title: " ID",
            className: "align-middle",
            data: (data, index) => `<span class="text-yp-custom">${data.id}</span>`,
        },
        {
            title: " tenant",
            className: "align-middle",
            data: (data, index) => `<span class="text-primary-custom">${data.tenant_name}</span>`,
        },
        {
            title: "Business Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-yp-custom" style="width:75px;">${data.business_type}</span>`;
            }
        },
        {
            title: "Space Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-yp-custom" style="width:75px;">${data.space_type}</span>`;
            }
        },
        {
            title: "start date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.start_date ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "end date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.end_date ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "space code",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.space_code ?? 'N/A'}</span>
                    </div>
                `;
            }
        },

        {
            title: "Size",
            className: "align-middle",
            data: (data) => {
                return data.price_type === 'total'
                    ? `<span class="text-primary-custom">Whole Room</span>`
                    : `<span class="text-primary-custom">${data.sqm_size ?? '-'} <small class="text-danger">(sqm)</small></span>`;
            }
        },
        {
            title: "Price",
            className: "align-middle",
            data: (data) => {
                const cur_symbol = data.cur_symbol ?? '$';
                const formattedPrice = data.price ? Number(data.price).toLocaleString() : '-';

                return data.price_type === 'total'
                    ? `<span class="fw-semibold">${cur_symbol} ${formattedPrice} <small class="text-muted">/monthly</small></span>`
                    : `<span class="text-primary-custom">${cur_symbol} ${formattedPrice} <small class="text-muted">/sqm</small></span>`;
            }
        },
        
        {
            title: "remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:50px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><span>${data.update_user ?? ''}</span></span>
                    <span class="text-muted">${data.updated_at ?? ''}</span>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-yp-custom rounded-2 text-nowrap">
                           <span><i class="fa fa-pencil"></i></span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ContractListView = new ListView('_announ_info_list', {
            fetchApi: `${main_view.base_url}/prm/contracts/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,  

         apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
  

        // mThis.initAlready = true;
    });
    };
    mThis.init();
    mThis.btnAdd.addEventListener('click', () => {
        main_view.setContentView(mThis.self, mThis.title_prop);
        main_view.VSAppContent.querySelector('#_main_announ_component').querySelector('#_btnAddAnnoun').click();
    });


    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
   

    };
    return mThis;
})();



