"use strict";

var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.dashboard_top = mThis.self.querySelector('#_dashboard_top');
    this.dashboard_center = mThis.self.querySelector('#_dashboard_center');
    this.dashboard_Bottom  = mThis.self.querySelector('#_dashboard_bottom');


    // Initialize component
    this.init= () => {
        if(mThis.initAlready) return;

        mThis.initAlready = true;
    }

    this.renderDashboardTop = (data) => {
        if (!data) return;

        let empTypesStaff = data.emp_types.find((type) => type.name === "Staff") || { count: 0 };
        let empTypesInProbation = data.emp_types.find((type) => type.name === "In Probation") || { count: 0 };
        let empTypesInternship = data.emp_types.find((type) => type.name === "Internship") || { count: 0 };

        let html = `
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Departments</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">${data.count_department}</span>
                   <i class="fa-solid fa-building-user text-success" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>
         <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Positions</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">${data.count_position}</span>
                   <i class="fa-solid fa-building-user text-success" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Active Employees</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number text-success">${data.active}</span>
                    <i class="fa fa-users text-success" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Resigned Staff</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number text-danger">${data.resigned}</span>
                    <i class="fa fa-users-slash text-danger" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>

         <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Internship</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">${empTypesInternship.count}</span>
                    <i class="fa fa-users text-success" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>
        <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">In Probation</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number">${empTypesInProbation.count}</span>
                    <i class="fa fa-users text-success" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>

         <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">New Employees</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number text-success">${data.new_employees}</span>
                    <i class="fa fa-users text-success" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>
         <div class="employees">
            <div class="total_employee">
                <div class="total_top">
                    <span class="total_title">Terminated</span>
                    <i class="fa fa-ellipsis-v total_icon"></i>
                </div>
                <div class="total_bottom">
                    <span class="total_number text-danger">${data.terminated}</span>
                    <i class="fa fa-users-slash text-danger" style="font-size: 1.5rem;"></i>
                </div>
            </div>
        </div>
        `;

        mThis.dashboard_top.innerHTML = html;
    };

    this.renderDashboardCenter = data => {
        if (!data || !data.department_data) return;


        let rowsHtml = data.department_data
          .map(department => `
            <tr>
              <td>${department.department_name}</td>
              <td>${department.position_title}</td>
              <td>${department.staff_count}</td>
              <td>${department.internship_count}</td>
              <td>${department.in_probation_count}</td>
              <td>${department.total_employee_count}</td>
            </tr>
          `)
          .join("");


        let html = `
          <div class="em_departement">
            <h3 class="d-flex align-items-start">Employee By Department</h3>
            <table class="table bg-white rounded-4">
              <thead>
                <tr>
                  <th class="w-25">Department</th>
                  <th>Position</th>
                  <th>Staff</th>
                  <th>Internship</th>
                  <th>In Probation</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        `;
        mThis.dashboard_center.innerHTML = html;
      };


    this.loadCards = (onFinish)=>{
        let p={};

        vsapi.call(`${main_view.base_url}/hr/dashboard/count-employees`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data) : {};
            // console.log(123,data);

            mThis.renderDashboardTop(data);


            onFinish();
          });
    }
    this.loadCardsCenter = (onFinish)=>{
        let p={};

        vsapi.call(`${main_view.base_url}/hr/dashboard/get-departments`,p, null,false,false).then(res => {
            let data = (res.status_code === 200) ? StringSanitizer.sanitizeObject(res.data) : {};
            // console.log(123,data);

            mThis.renderDashboardCenter(data);


            onFinish();
          });
    }
    this.prepareFormOptions = (data, onFinish) =>{

        mThis.loadCards(onFinish);
        mThis.loadCardsCenter(onFinish);

    }
    this.setDashboardScroll = ()=>{
        const parent = mThis.self;
        parent.style.height = (window.innerHeight - 100)+'px';
        parent.classList.add('overflow-y-auto');
        parent.classList.add('overflow-x-hidden');
        window.onresize = () => {
            parent.style.height = (window.innerHeight - 100)+'px';
        }
    }
    this.show = (options) => {
        mThis.setDashboardScroll();
        mThis.init();
        if (!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(null, (d) => {
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
        });
    };
})();
