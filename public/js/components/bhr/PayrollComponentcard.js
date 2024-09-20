'use strict';

var PayrollComponent = new function () {
    const mThis = this;
    this.title_prop = "Pay Roll";
    this.base_url = main_view.base_url;
    this.jm= main_view.appContent.children('#_main_payrollComponent');
    this.self = this.jm[0];


    this.init = () => {
        if(mThis.initAlready) return;

        mThis.payrollListView = new ListView('_payroll_list', {
            fetchApi : `${main_view.base_url}/hr/payroll/list-paginate`,
            clientSidePagination: true,
            perPage: 10,
            // paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            processResponse: (res) => {
                return res.data.data;
            },
            renderItems: (items, list_container) => {
                console.log(123,items);

                mThis.renderPayrollList(list_container, items);
            },
            listContainerClass: null
        });





        this.listContainer = mThis.payrollListView.getListContainer();

        mThis.initAlready = true;
    }


    this.renderPayrollList = (div,items) => {

        items = items ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then(user => {
            // console.log(user);
           mThis.beginRenderPayroll(div,items,user)
        });
    }
    this.renderHeaderList = () => {
        return [
            `<div data-roleid="" class="w-100 rounded-3 p-3 pb-0 shadow text-white text-center mb-3 position-relative" style="background-color:#ec1616;">
                <div class="d-flex row text-center">
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Name</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Position</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Rate</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Period</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Working Hours</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Status</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Action</span>
                            </h6>
                        </div>
                    </div>
                      <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize"></span>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>`
        ].join('');
    };
    this.beginRenderPayroll = (div, items, current_user) => {
        const d = current_user;
        let html = '';

        html += this.renderHeaderList(); // Include the header

        html += `<div id="_scroll_booking">`;
        let cmt = 0;

        items.forEach(data => {

            html += `
                <div class="card w-100 rounded-3 border-start border-5 border-danger-custom px-2 shadow bg-white mb-3  position-relative">
                    <div class="d-flex row align-items-center text-center" style="color:rgba(0, 0, 0, 0.7);">

                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.name ? data.name : "មិនទាន់មាន"}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.position ? data.position : "null"}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.rate ? data.rate : "null"}</span>

                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.rate ? data.rate : "null"}</span>
                                    <span>${data.rate ? data.rate : "null"}</span>

                                </p>
                            </div>
                        </div>

                         <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.working_hours ? data.working_hours : "null"}</span>
                                </p>
                            </div>
                        </div>
                         <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.salary ? data.salary : "null"}</span>
                                </p>
                            </div>
                        </div>

                         <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.status ? data.status : "null"}</span>
                                </p>
                            </div>
                        </div>


                        <div class="col d-flex justify-content-center align-items-center">
                            <div class="text-center gap-2 d-flex flex-wrap">
                                 <a href="javascript:void(0)" class="btn_um_action btn_pickup_action" data-id="${data.id}" data-orderid="${data.id}" data-senderid="${data.sender_id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <img src="${main_view.asset_url}/images/icons/Dot.svg" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`;
                cmt++;
        });
        if(cmt ===0){
            html +=`
             <div class="card w-100 rounded-3 border-start border-5 border-danger-custom py-2 shadow bg-white mb-3 p-3 position-relative">
                    <div class="d-flex row align-items-center text-center" style="color:rgba(0, 0, 0, 0.7);">
                        <div class="col">
                            <div class="d-block">
                               <span class="text-muted pb-3">No data to display.</span>
                            </div>
                        </div>
                  </div>
                </div>
            `;

        }

        html += `</div>`;
        div.innerHTML = html;

        const sh_parent = div.querySelector('#_scroll_booking');
        sh_parent.style.height = (window.innerHeight - 350) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        window.onresize = function(e) {
            e.preventDefault();
            sh_parent.style.height = (window.innerHeight - 350) + 'px';
        };
    };

    this.show = (options) => {

        mThis.init();
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
            mThis.payrollListView.showPage();
                mThis.jm.siblings().hide();
                mThis.jm.fadeIn(250);
    }
}
