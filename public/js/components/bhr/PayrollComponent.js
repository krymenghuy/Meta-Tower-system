"use strict";

var PayrollComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_payrollComponent");
    this.self = this.jm[0];
    this.title_prop = "Payroll";
    this.elSortBy = this.self.querySelector('#el_sort_by');
    this.elStatus = this.self.querySelector('#el_status');
    this.btnAdd = this.self.querySelector("#_btnAddSalary");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_payroll");
    this.btnSearch = mThis.self.querySelector('#_sdl_btnSearch');
    this.cols = [

        {
            title: "Photo",
            className: 'align-middle',
            data: (data, index, tr) => {
                return ` <img class="image-student-tbl" src="${data.image_url}" alt=""/>`;
            }
        },

        {
            title: "Name",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">
                            <span class="d-block">${data.name ?? ''}</span>
                            <span class="d-block">${data.email ?? 'null'}</span>
                            <span class="d-block">${data.phone_number ?? 'គ្មាន'}</span>
                        </p>`;
            }
        },
        {
            title: "Position",
            className: "align-middle",
            data: (data, index, tr) => {
                // Add custom styling or logic here
                let position = data.position ? data.position : 'N/A';
                return `<p style=" background: linear-gradient(97.44deg, #FFFFFF -6.65%, rgba(199, 231, 1, 0.66) 18.08%, rgba(199, 231, 1, 0.66) 32.5%);" class="p-0 m-0 text-white text-center border border-primary rounded-5 p-1">${position}</p>`;
            }
        },


        {
            title: "Rate",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.rate ?? ''}</p>`;
            }
        },
        {
            title: "Period",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.start_date.replace(/-/g, '/') ?? ''} - ${data.end_date.replace(/-/g, '/') ?? ''}</p>`;
            }
        },
        {
            title: "Working_hours",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.working_hours ?? ''}</p>`;
            }
        },
        {
            title: "Salary",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.salary ?? ''}</p>`;
            }
        },

        {
            title: "Status",
            className: 'status text-nowrap align-middle',
            data: function (data, index, tr) {
                let cls_class = 'text-danger text-center';
                let bg_color = ''; // Default background color

                if ((data.status || '').toLowerCase() === 'success') {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745'; // Green background for success
                } else if ((data.status || '').toLowerCase() === 'panding') {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#ffc107'; // Yellow background for pending
                } else if ((data.status || '').toLowerCase() === 'in progress') {
                    cls_class = 'text-white text-center border border-danger rounded-5 p-1';
                    bg_color = '#dc3545'; // Red background for in progress
                } else {
                    bg_color = '#6c757d'; // Default gray background for other statuses
                }

                return `<a class="d-block" data-status="${data.status}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:80px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.status}
                            </span>
                        </a>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_payroll_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                <img src="${main_view.asset_url}/images/icons/Dot.svg" />
                            </a>
                        </div>
                    </div>
                `;
            }
        }

    ];

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollListView = new ListView('_payroll_list',{
            fetchApi : `${main_view.base_url}/hr/payroll/list-paginate`,
            perPage: 10,
            //paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table  table--blue rounded-2   overflow-hidden  header-uppercase',
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            // let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                // id: 1,
                btn: e.target,
                onClose: () => {
                    // content.parentElement.classList.remove('d-none');
                    mThis.PayrollListView.showPage();
                }
            };
            // content.parentElement.classList.add('d-none');

            PayRollDailog.show(op);
        };

        const pr_tbl = mThis.PayrollListView.getListContainer();
        mThis.initDropdownMenus(pr_tbl);///

        mThis.divFilter.addEventListener('change', (e) => {
            e.preventDefault();
            mThis.PayrollListView.showPage(mThis.getDataFormFilter());
        })

        mThis.initAlready = true;

    };
    mThis.elSearch.addEventListener('keyup', (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.PayrollListView) {
                mThis.PayrollListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("PayrollListView is not defined");
            }
        }, 200);
    });

    mThis.btnSearch.onclick = e => {
        if (mThis.PayrollListView) {
            mThis.PayrollListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("listView is not defined");
        }
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.status_id = mThis.elStatus.value;
        p.sort_by = mThis.elSortBy.value;
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p);

        return p;
    };




    this.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_payroll_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[

                {
                    html:'<span class="ps-2  " vslang="titles.Modify Payroll">Modify Payroll</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_payroll"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Payroll">Delete Payroll</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_payroll"
                },

            ],
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick:(menuLink, id, name)=>{
                switch(name){

                    case 'edit_payroll':{
                      mThis.editPayroll(id, menuLink);
                      break;
                    }
                    case 'delete_payroll':{
                        mThis.deletePayroll(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    this.editPayroll = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            }
        };
        PayRollDailog.show(op);
    }

    this.deletePayroll = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            }
        };
        cv_interact.confirm('Delete this Payroll?',{
            title: 'Delete Payroll',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/hr/payroll/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted Successfully');
                        mThis.PayrollListView.showPage();
                    }
                })
            }
        });

    }
    this.prepareFormOptions = () => {

        vsapi.call(`${main_view.base_url}/hr/payroll/form-options`,null,null,null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            console.log(1111,this.elSortBy);

            VSUtil.setComboItems(mThis.elSortBy, d.sort_by, 'id', 'name', true, 'All', null);
            VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',true,'All',null);
        })
    }


    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
            mThis.PayrollListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };


});

const PayRollDailog = new function() {
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_sdl_add_Payroll');
    this.modal = new bootstrap.Modal(this.self);
    this.base_url = main_view.base_url;
    this.options = {};

    this.btnSave =  this.self.querySelector('#dlg_sdl_add_payroll_btn_save');
    this.elPositionId =  this.self.querySelector('#_sdl_position_id');
    this.elStatusId =  this.self.querySelector('#_sdl_status_id');
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.div_payroll_info = mThis.self.querySelector('#_sdl_payroll_info');
    this.btnChooser = mThis.self.querySelector('#dlg_image_chooser');

    this.btnSave.onclick =  e =>{
        e.preventDefault();
        let p = mThis.getDataForm();
        console.log(77777,p);

        vsapi.call(`${mThis.base_url}/hr/payroll/save`, p,mThis.btnSave,false).then(res => {
            if(res.status_code === 200){
                mThis.modal.hide();
                const d = res.data ?? {};
                cv_interact.success('Payroll Saved Success!');
                if (typeof mThis.options.onClose === 'function') mThis.options.onClose(p);
            }
            else
                cv_interact.error(res.error_message);
        });
    };

    this.prepareData = (id,def, onFinish) => {
        if(!def) def = {};
        console.log(555555);
        vsapi.call(`${mThis.base_url}/hr/payroll/form-options`,{
            id: id
        },null).then(res => {
            let d = res.status_code === 200 ?  res.data : {};

            // VSUtil.setComboItems(mThis.elSenderType, d.sender_types, 'id', 'sender_type', true, '(Select Merchant Type)', def.sender_type_id);
            // VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'business_type', 'business_type', true, '(Select Business Type)', def.business_type);
            // VSUtil.setComboItems(mThis.elPriceList, d.price_list, 'id', 'name', true, '(Price List)', def.price_list_id);
            VSUtil.setComboItems(mThis.elPositionId, d.positions, 'id', 'name', true, '(Select Position)', null);
            VSUtil.setComboItems(mThis.elStatusId, d.status, 'id', 'name', true, '(Select Status)', null);
            console.log(33333,d);
            onFinish(d);
        });
    }


    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
        let id = options.id??null;

        mThis.prepareData(id,{},data => {
            if(data.payrolls){
                mThis.elTitle.textContent =  "Modify payroll Information";
            }
            else{
                mThis.elTitle.textContent =  "Create Payroll";
            }
            console.log(6666);

            mThis.setData(data.payrolls);
            mThis.modal.show();
        });
    }

        mThis.btnChooser.onclick = function(e){
        e.preventDefault();
        FileChooser.chooseFile(null,(d) => {
            if(d){
                const parent = this.parentElement;
                mThis.setImage(parent,d.dataUrl);
            }
        });
    }

    this.setImage = (div,image=null) => {
        if(image){
            const html = `<image class="w-100 h-100 object-fit-scale data-input" src="${image}" alt="social-icon" data-field="photo"/>
            <div class="position-absolute top-0 end-0 p-2 rounded-2 bg-dark" role="button">
                <i class="fa-regular fa-trash-can text-danger fs-5"></i>
            </div>`;
            div.innerHTML = html;
            mThis.deleteImage(div);
        }
        else{
            const html = `<div id="dlg_image_chooser"
                                class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                <i class="fa-regular fa-image fs-4 text-muted"></i>
                            </div>`;
            div.innerHTML = html;
            mThis.chooseImage(div);
        }
    }

    this.deleteImage = (div) => {
        const btnDelete = div.querySelector('[role=\'button\']');
        btnDelete.onclick = function(e){
            e.preventDefault();
            const html = `<div id="dlg_image_chooser"
                                class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                <i class="fa-regular fa-image fs-4 text-muted"></i>
                            </div>`;
            div.innerHTML = html;
            mThis.chooseImage(div);
        }
    }

    this.chooseImage = (div) => {
        const btnChoose = div.querySelector('#dlg_image_chooser');
        btnChoose.onclick = function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    mThis.setImage(div,d.dataUrl);
                }
            });
        }
    }

    this.getDataForm = () => {
        const div = mThis.self;
        let p = {
            id: mThis.options.id
        };

        div.querySelectorAll('.data-input').forEach(el => {
            const data_member = el.dataset.field;
            if(el.tagName === 'IMG'){
                p[data_member] = el.src;
            }
            else{
                p[data_member] = el.value;
            }
        });

        return p;
    }
    this.setData = (d) => {
        d =d ?? {};
        const div = mThis.self,
    containerImage = div.querySelector('[aria-label=\'image\']');
        let elements = div.querySelectorAll('.data-input');
        mThis.setImage(containerImage,d.image_url);

        elements.forEach(el =>{
            const data_member = el.dataset.field;
            el.value = d[data_member] ? d[data_member] : '';


    });
}




}

