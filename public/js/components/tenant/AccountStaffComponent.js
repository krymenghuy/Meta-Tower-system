"use strict";
var AccountStaffComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = "Account & Staff";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_accountStaff_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddAccountStaff");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_accountStaff");
    mThis.elSearch = mThis.self.querySelector("#_search_accountStaff_info");

    mThis.cols = [

        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            title: "Staff ID",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-yp-custom"><small>${data.code ?? 'N/A'}</small></span>`,
        },
        {
            title: "Name",
            className: "align-middle  text-capitalize ",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class=" d-block text-yp-custom  text-break" style="width:128px; word-break:break-word;"><small>${data.name ?? ''}</small></span>
                        <small class="text-muted">${sexLabel}</small>`;
            }
        },
        {
            title: "Position",
            className: "align-middle text-capitalize",
            data: (data) => `<span class="text-nowrap text-yp-custom"><small>${data.role ?? ''}</small></span>`,
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) => {
                const phone = data.phone_number || 'N/A';

                let telegramHTML = '<span class="text-muted">Telegram: N/A</span>';
                if (data.telegram_link && data.telegram_link.trim() !== '') {
                    const url = data.telegram_link.trim();
                    const displayText = url.replace(/^https?:\/\/t\.me\//, '');

                    const deepLink = displayText.startsWith('+')
                        ? `tg://resolve?phone=${displayText.replace(/^\+/, '')}`
                        : `tg://resolve?domain=${displayText}`;

                    telegramHTML = `
                        <a href="${url}"
                        onclick="event.preventDefault(); window.location='${deepLink}';"
                        class="text-decoration-none d-inline-flex align-items-center mt-1"
                        target="_blank"
                        title="Open in Telegram"
                        aria-label="Telegram">
                            <small><i class="fa-brands fa-telegram me-1" style="color:#229ED9;"></i></small>
                            <small class="text-nowrap">${displayText}</small>
                        </a>`;
                }

                return `
                    <div class="d-flex flex-column">
                        <div><small><i class="fa-solid fa-phone me-1 text-success"></i></small><small class="text-nowrap text-yp-custom">${phone}</small></div>
                        <div>${telegramHTML}</div>
                    </div>`;
            }
        },




        {
            title: "Zone",
            className: "align-middle text-capitalize",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <small><i class="fa-solid fa-location-dot text-primary me-2"></i></small><small class="text-wrap text-break" style ="word-break:break-word;">${data.zones ?? 'N/A'}</small>
                    </div>
                `;
            }
        },
           {
            title: "Floor",
            className: "align-middle text-capitalize",
            data: (data, index, tr) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <small class="text-wrap text-break" style ="word-break:break-word;">${data.floors ?? 'N/A'}</small>
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

                if (status === 'inactive') {
                    cls = 'text-danger px-2 py-1 d-inline-block';
                } else if (status === 'active') {
                    cls = 'text-success px-2 py-1 d-inline-block';
                }

                return `<span class="${cls} text-capitalize" data-status_id="${data.status_id}"><small>${data.status ?? ''}</small></span>`;
            },
        },
        //    {
        //         title: "Status",
        //         className: "align-middle",
        //         data: (data) => {
        //             const status = (data.status ?? '').toLowerCase();
        //             let cls = 'text-info';

        //             if (status === 'inactive') {
        //                 cls = 'text-danger border border-danger rounded px-2 py-1 d-inline-block';
        //             } else if (status === 'active') {
        //                 cls = 'text-success border border-success rounded px-2 py-1 d-inline-block';
        //             }

        //             return `<span class="${cls} text-capitalize">${data.status ?? ''}</span>`;
        //         },
        //     },

        {
            title: "Updated By",
            className: 'align-middle',
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-center text-yp-custom fw-semibold"><small>${data.update_user ?? ''}</small></span>
                    <small class="text-center text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <button class="btn btn-sm btn-outline-yp-custom rounded-2 text-nowrap">
                           <span><i class="fa fa-pencil"></i></span>
                           <i class="fa-solid fa-caret-down"></i>
                       </button>
                    </a>
                </div>`
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.AccStaffListView = new ListView('_staffAccount_info_list', {
            fetchApi: `${main_view.base_url}/prm/account-staff/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
               rowCreated:(data,index,tr)=>{
                
              
              tr.dataset.statusid = data.status_id;
              tr.classList.add('member');
              tr.setAttribute('id',['member_id',data.id].join('')); 

            }, 
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.AccStaffListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(240)) return;
            MemberDialog.show(op);
        };


        mThis.pr_tbl = mThis.AccStaffListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }
        mThis.tblMembers = mThis.AccStaffListView.getTable();




        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {

            el.onchange = (e) => {
                e.preventDefault();
                mThis.AccStaffListView.showPage(mThis.getFilterData());
            }
        });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.AccStaffListView.showPage(mThis.getFilterData());
            }, 250);
        });
     

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

  

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.AccStaffListView.showPage();
    };
    return mThis;
})();




