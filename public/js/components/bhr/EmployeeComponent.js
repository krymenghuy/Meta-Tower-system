"use strict";

var EmployeeComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_employeeComponent");
    this.self = this.jm[0];
    this.title_prop = "Employee";
    this.elSortBy = this.self.querySelector('#el_sort_by');
    this.elStatus = this.self.querySelector('#el_status');
    this.btnAdd = this.self.querySelector("#_btnAddEmployee");
    this.divFilter = this.self.querySelector("#_divFilter_emp");
    this.elSearch = this.self.querySelector("#_sdl_search_employee");
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');
    this.employee_detail = mThis.self.querySelector('#_employee_detail');
    let div = mThis.self.querySelector('#_employee_list');
    this.init= () => {
        if(mThis.initAlready) return;

        mThis.EmployeeListView = new ListView('_employee_list', {
            fetchApi: `${main_view.base_url}/hr/employee/list-paginate`,
            // clientSidePagination: true,
            perPage: 10,
            // paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            processResponse:(res)=>{
                console.log(res.data);
                return res.data;
            },
            renderItems: (data,list_container) => {

                mThis.renderEmployeeList(list_container, data);
            },
            listContainerClass: null
        });
        this.listContainer = mThis.EmployeeListView.getListContainer();
        mThis.initAlready = true;
    }
    this.renderEmployeeList = (div,data) => {
        console.log(666,div,777,data);



        data = data ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then(user => {
            // console.log(user);
           mThis.renderEmployee(data,user)
        });
    }
    this.renderEmployee = (data) => {
        console.log(777, data);

        let html = '';
        html += `<div id="_scroll_emp">
            <div id="_employee_detail" class="d-flex flex-wrap gap-3 p-2 justify-content-start" style="width: 100%;">
        `;

        let cmt = 0;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(d => {

                // Determine the status and assign the background color accordingly
                const status = d.status || 'Active';
                const statusColor = status === 'Inactive' ? 'background-color: #dc3545;' : 'background-color: #2B3991;'; // #dc3545 is Bootstrap's danger color

                html += `
                <div class="card" style="flex: 1 1 calc(25% - 1rem); max-width: calc(25% - 1rem); box-sizing: border-box;">
                    <div class="card-header">
                        <div class="status_employee" style="${statusColor} color: white; padding: 5px; border-radius: 5px;">
                            <span>${status}</span>
                        </div>
                        <i class="fa fa-ellipsis-v"></i>
                    </div>
                    <div class="card-body text-center">
                        <img src="${d.image_url || '../uploads/public/1_data/default/images/mr.avif'}" class="rounded-circle mb-3"
                            alt="Profile Picture" style="width: 100px; height: 100px;">
                        <h5 class="card-title">${d.first_name || 'John'} ${d.last_name || 'John Doe'}</h5>
                        <div class="card_container">
                            <div class="employee_id">#: ${d.id || ''}</div>
                            <div class="container_top">
                                <div class="position">
                                    <i class="fa-solid fa-dashboard"></i> <span>${d.position || 'Web Developer'}</span>
                                </div>
                                <div class="me-3">
                                    <i class="fa-solid fa-clock"></i> <span>${d.session || 'Full Time'}</span>
                                </div>
                            </div>
                            <div class="container_bottom">
                                <div class="email">
                                    <i class="fas fa-envelope"></i> <span>${d.email || 'email@example.com'}</span>
                                </div>
                                <div class="phone">
                                    <i class="fas fa-phone"></i> <span>${d.phone_number || '012345678'}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card_bottom">
                            <div class="joining">Joining Date: ${d.joining_date || '01/Aug/2024'}</div>
                            <a href="#" class="detail">See Detail</a>
                        </div>
                    </div>
                </div>
                `;
                cmt++;
            });
        }

        if (cmt === 0) {
            html += `<div class="w-100 rounded-3 border-start text-center border-5 border-danger-custom p-3 shadow bg-white mb-3 position-relative">
            <div class="row">
                <div class="col">No Data Found</div>
            </div>
            </div>`;
        }

        html += `</div></div>`;
        div.innerHTML = html;
    };





    this.show= (options)=>{
        mThis.init();
        if (!options) options = {};
            mThis.options = options;
            main_view.setTitle(mThis.title_prop);
            mThis.EmployeeListView.showPage();
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);

    }


});


