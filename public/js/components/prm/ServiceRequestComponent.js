"use strict";
var ServiceRequestComponent = (function () {

    const mThis = {};
    mThis.title_prop = "Service Request Component";
    mThis.self = main_view.VSAppContent.querySelector("#_main_service_request_component");

    // mThis.btnAdd   = mThis.self.querySelector("#_btnAdd");
    // mThis.elSearch = mThis.self.querySelector("#_search_service_request");
    // mThis.elServiceStatus = mThis.self.querySelector("#_search_service_request");
    // mThis.divFilter = mThis.self.querySelector("#_filter");

    mThis.columns = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.name ?? ''}</span>`;
            }
        },
        {
            title: "Category",
            className: "align-middle",
                data: (data) => {
                return `<span class="text-primary-custom">${data.service_type ?? ''}</span>`;
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
        //     }
        // },

        {
            title: "Remarks",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? 'N/A'}</span>
                    </div>
                `;
            }
        },

        // {
        //     title: "Status",
        //     className: "align-middle",
        //     data: (data) => {
        //         const status = (data.status ?? '').toLowerCase();
        //         let cls = 'text-info';

        //         if (status == 'inactive') {
        //             cls = 'text-white px-3 py-1 rounded-3 bg-danger d-inline-block';
        //         } else if (status == 'active') {
        //             cls = 'text-white px-3 py-1 rounded-3 bg-success d-inline-block';
        //         }

        //         return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
        //     },
        // },
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

    /* =====================================================
     * 3. INITIALIZATION
     * ===================================================== */
    mThis.init = () => {
        if (mThis._initAlready) return;

        mThis.listView = new ListView('_service_request_list', {
            fetchApi: `${main_view.base_url}/prm/service-request/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.columns,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
                tr.classList.add('service-request');
                tr.setAttribute('id',['service_request_id',data.id].join(''));
            },
            listContainerClass: null

        });
        // mThis._bindEvents();
        // mThis._initDropdowns();

        mThis._initAlready = true;

        mThis.getFilterData = () =>{
            let p ={

            }
        }
    };

    /* =====================================================
     * 4. EVENTS
     * ===================================================== */
    // mThis._bindEvents = () => {

    //     mThis.btnAdd.onclick = (e) => {
    //         e.preventDefault();
    //         SampleDialog.show({
    //             onClose: () => mThis.reload()
    //         });
    //     };

    //     mThis.elSearch.onkeyup = () => {
    //         clearTimeout(mThis._searchTimer);
    //         mThis._searchTimer = setTimeout(mThis.reload, 300);
    //     };

    //     // mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
    //     //     el.onchange = mThis.reload;
    //     // });
    // };

    /* =====================================================
     * 5. FILTER PAYLOAD
     * ===================================================== */
    // mThis.getFilterData = () => {
    //     const p = { search: mThis.elSearch.value };

    //     mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
    //         p[el.dataset.field] = el.value;
    //     });

    //     return p;
    // };

    /* =====================================================
     * 6. DROPDOWN ACTIONS
     * ===================================================== */
    // mThis._initDropdowns = () => {
    //     new VSDropdownMenu({
    //         containerElement: mThis.self,
    //         actionButtonClass: "btn_action",
    //         menus: [
    //             { name: "edit", html: "Edit", icon: "fa fa-edit" },
    //             { name: "delete", html: "Delete", icon: "fa fa-trash" }
    //         ],
    //         onClick: (btn, id, action) => {
    //             if (action === "edit") mThis.edit(id, btn);
    //             if (action === "delete") mThis.delete(id, btn);
    //         }
    //     });
    // };

    /* =====================================================
     * 7. ACTION HANDLERS
     * ===================================================== */
    // mThis.edit = (id, btn) => {
    //     SampleDialog.show({
    //         id,
    //         btn,
    //         onClose: mThis.reload
    //     });
    // };

    // mThis.delete = (id, btn) => {
    //     if (!AuthManager.allowed(999)) return;

    //     cv_interact.confirm("Delete this item?", {}, (ok) => {
    //         if (!ok) return;

    //         vsapi.call(`${main_view.base_url}/sample/delete`, { id })
    //             .then(() => mThis.reload());
    //     });
    // };

    /* =====================================================
     * 8. HELPERS
     * ===================================================== */
    mThis.reload = () => {
        mThis.listView.showPage(mThis.getFilterData());
    };

    /* =====================================================
     * 9. ENTRY POINT
     * ===================================================== */
    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.reload();
    };

    return mThis;
})();
