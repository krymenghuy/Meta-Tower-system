
'use strict';

// Future-ready for module-based environments (MJS compliant)
// Classic IIFE fallback for now
var ReportComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Report Center";

    const containerId = '_main_reportCenterComponent';
    let container = document.querySelector(`#${containerId}`);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'main-container';
        main_view.VSAppContent.appendChild(container);
    }
    mThis.self = container;

    mThis.options = {};
    mThis.permissionID = 1;
    mThis.initAlready = false;

    mThis.init = async () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };

    mThis.filter_fields = [
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'group_id',
            value_field: 'id',
            text_field: 'name',
            required: true,
            dot_object: 'groups'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/reports/options-receiver`,
            api_params: {},
            name: 'receiver_uid',
            value_field: 'id',
            text_field: 'name',
            required: false
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/prm/form-option`,
            api_params: {},
            name: 'status_id',
            value_field: 'status_id',
            text_field: 'name',
            required: false,
            dot_object:'statuses'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'campus_id',
            value_field: 'id',
            text_field: 'campus',
            required: false,
            dot_object: 'campuses'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'from_campus_id',
            value_field: 'id',
            text_field: 'campus',
            required: false,
            dot_object: 'campuses'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'to_campus_id',
            value_field: 'id',
            text_field: 'campus',
            required: false,
            dot_object: 'campuses'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/prm/form-option`,
            api_params: {},
            name: 'building_id',
            value_field: 'id',
            text_field: 'building',
            required: false,
            dot_object: 'buildings'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'level_id',
            value_field: 'id',
            text_field: 'level',
            required: false,
            dot_object: 'levels'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'leave_type_id',
            value_field: 'id',
            text_field: 'name',
            required: false,
            dot_object: 'leave_types'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/prm/form-option`,
            api_params: {},
            name: 'vendor_id',
            value_field: 'id',
            text_field: 'vendor',
            required: false,
            dot_object: 'vendors'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'term_id',
            value_field: 'id',
            text_field: 'term_program',
            required: false,
            dot_object: 'terms'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'ac_year_id',
            value_field: 'academic_year',
            text_field: 'academic_year',
            required: false,
            dot_object: 'academic_years'
        },
        {
            type: 'select',
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: 'request_type_id',
            value_field: 'id',
            text_field: 'name',
            required: false,
            dot_object: 'request_type'
        },
        {
            type: 'date',
            name: 'start_date'
        },
        {
            type: 'date',
            name: 'end_date'
        }
    ];

    function adjustTableHeight(container) {
        if (container) {
            container.style.height = `${window.innerHeight - 240}px`;
        }
    }

    function buildFilterInputHTML(filter, itemName, labelText) {
        const id = `select_${filter.name}`;
        mThis.queueDataOption(filter, id);

        if (filter.type === 'select') {
            return `
                <div class="el_filter col-lg-6">
                    <div class="form-group">
                        <label for="${id}" class="form-label text-capitalize" vslang="titles.${labelText}"></label>
                        <div class="width-select-in-form">
                            <select id="${id}" class="${filter.name} modal-select2 data-input data-filter" data-field="${itemName}"></select>
                        </div>
                    </div>
                </div>`;
        }
        if (filter.type === 'date') {
            return `
                <div class="el_filter col-lg-6">
                    <div class="form-group">
                        <label for="${itemName}" class="form-label text-capitalize" vslang="titles.${labelText}"></label>
                        <input data-select="datepicker" class="form-control data-input data-filter" data-field="${itemName}" />
                    </div>
                </div>`;
        }
        return '';
    }

    mThis.queueDataOption = (filter, domId) => {
        mThis.options.params = mThis.options.params || [];
        mThis.options.params.push({
            api: filter.api_fetch,
            param: filter.api_params,
            value: filter.value_field,
            text: filter.text_field,
            required: filter.required,
            dot_object: filter.dot_object,
            dom_id: domId
        });
    };

    mThis.renderFilters = (div, p = {}) => {
        console.log(p.param);
        const paramKeys = (p.param || '').split('|').map(k => k.trim());
        const html = paramKeys.map(key => {
            console.log(3,key);

            const filter = mThis.filter_fields.find(f => f.name === key);
            if (!filter) return '';
            return buildFilterInputHTML(filter, key, mThis.getFormGroupLabelText(key));
        }).join('');

        div.innerHTML = `
            <div class="row card-report m-0" style="display: none;">
                <div id="_div_filter" class="row d-flex -row-cols-lg-2 justify-content-between align-items-center">
                    <div id="_rpt_btn_list" class="col p-0 text-start" style="display: none; width: 80px">
                        <button class="btn-filter" type="button">
                            <span vslang="buttons.Choose Report"></span>
                        </button>
                    </div>
                    ${html || '<div class="col"><h4 class="text-muted text-center">No Filter</h4></div>'}
                    <div id="_rpt_btn_print" class="col text-nowrap" style="display: none;">
                        <div class= "d-flex gap-3">
                            <button data-name="btn_pdf" class="btn-print d-flex gap-2 align-items-center" type="button">
                                <i class="fa-solid fa-print"></i><span vslang="buttons.Print"></span>
                            </button>
                            <button data-name="btn_excel" class="btn-excel d-flex gap-2 align-items-center" type="button">
                                <i class="fa-solid fa-file-excel"></i><span vslang="buttons.Export"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div><button id="_rpt_btn_report" class="btn-filter d-none" type="button"><span vslang="buttons.Run Report"></span></button></div>`;

        mThis.div_filter_field = mThis.self.querySelector('#_rpt_input_filter');
        mThis.btn_run_reoirt = div.querySelector('#_rpt_btn_report');
        mThis.btn_run_reoirt.onclick = mThis.runReport;
        // mThis.btn_run_reoirt.onclick = mThis.runReport();
        // mThis.runReport(div, p.code);
        mThis.renderOption(div, p.code);
        mThis.controlPanel(div);

        div.querySelectorAll("[data-select='datepicker']").forEach(el => DateTimePicker.init(el));
        LocaleManager.translateZone(mThis.self.querySelector('#_rpt_input_filter'));
    };

    mThis.translateToQueryString = (params)=>{
        let q ='';
        for(let prop in params){
            let sp = '';
            if (q) sp='&';
            let var_name = prop.replace(/_/g, '');
            q = [q,sp,var_name,'=',params[prop]].join('');
        }
        return q;
    }

    // mThis.runReport = (div, code) => {
    //     const runBtn = mThis.btn_run_reoirt;
    //     if (!runBtn) return;

    //     runBtn.onclick = e => {
    //         e.preventDefault();

    //         const params = {};
    //         const inputs = div.querySelectorAll('.data-input');
    //         let missingField = null;

    //         inputs.forEach(el => {
    //             const key = el.dataset.field;
    //             const required = el.dataset.required === '1';
    //             const value = el.value?.trim();
    //             const label = el.previousElementSibling?.textContent?.trim() || el.parentElement?.previousElementSibling?.textContent?.trim() || key;

    //             if (required && !value && !missingField) {
    //                 missingField = `${label} cannot be empty!`;
    //             }

    //             params[key] = value;
    //         });

    //         if (missingField) {
    //             cv_interact.warning(missingField);
    //             return;
    //         }

    //         params.code = code;


    //         const containerTable = div.closest('#_main_reportCenterComponent')?.querySelector('#_rpt_table');
    //         if (!containerTable) return;

    //         adjustTableHeight(containerTable);
    //         containerTable.innerHTML = `<div class="p-3 text-muted">Loading report...</div>`;

    //         vsapi.call(`${main_view.base_url}/api/reports/${code}`, params, null, { loader: false }).then(res => {
    //             containerTable.innerHTML = res.status_code === 200 ? res.data.html || '<div class="p-3">No result</div>' : `<div class="p-3 text-danger">${res.error_message || 'Failed to load report.'}</div>`;
    //         });
    //     };

    //     const filters = div.querySelectorAll('.data-filter');
    //     filters.forEach(el => {
    //         el.onchange = () => runBtn?.dispatchEvent(new Event('click'));
    //     });
    // };

    mThis.runReport = (e = null,runReport = true) =>{
        console.log(1,e);
        
        // const code = e? (e.target.dataset?.code) : mThis.selected_report?.code;
        const code = mThis.selected_report?.code;
        if(!code) return;
        const params = mThis.getDataFilter() || {};
        // const inputs = mThis.div_filter_field.querySelectorAll('.data-input');
        let missingField = null;

        // inputs.forEach(el => {
        //     const key = el.dataset.field;
        //     const required = el.dataset.required === '1';
        //     const value = el.value?.trim();
        //     const label = el.previousElementSibling?.textContent?.trim() || el.parentElement?.previousElementSibling?.textContent?.trim() || key;

        //     if (required && !value && !missingField) {
        //         missingField = `${label} cannot be empty!`;
        //     }

        //     params[key] = value;
        // });

        if (missingField) {
            cv_interact.warning(missingField);
            return;
        }
        
        params.code = code;
        console.log(7777,params);
        
        const containerTable = mThis.div_filter_field.closest('#_main_reportCenterComponent')?.querySelector('#_rpt_table');
        if (!containerTable) return;

        adjustTableHeight(containerTable);
        containerTable.innerHTML = `<div class="p-3 text-muted">Loading report...</div>`;
        vsapi.call(`${main_view.base_url}/mhr/reports/${code}`, params, null, { loader: false }).then(res => {
            console.log(2,res);
            let d = {};
            if(res.status_code === 200){
                d = res.data;
            console.log(2333,d);
                // incomeByCategoryTable(containerTable,d);
                switch(code){
                    case 'simple':
                        jsonToTable(containerTable,d);
                        break;
                    case 'tenant_list':
                        tenantList(containerTable,d);
                        break;
                    case 'deposit_list':
                        depositList(containerTable,d);
                        break;
                    case 'school_fee':
                    case 'non_tuition':
                        nonTuitionFeeTable(containerTable,d);
                        break;
                    case 'income_by_category':
                        incomeByCategoryTable(containerTable,d);
                        break;
                    case 'total_payment':
                        totalPaymentByYear(containerTable,d);
                        break;
                    case 'total_payment_history':
                        totalPaymentHistory(containerTable,d);
                        break;
                    case 'leave_student':
                        leaveStudent(containerTable,d);
                        break;
                    case 'vendor_payment_list':
                        VendorPayments(containerTable,d);
                        break;
                    case 'income_by_class':
                        incomeByClassTable(containerTable,d);
                        break;
                    case 'student_change_campus':
                        studentChangeCampus(containerTable,d);
                        break;
                    case 'cross_year_payment':
                        crossYearPayment(containerTable, d);
                        break;
                    case 'upgrade_fee':
                        upgradeFee(containerTable,d);
                        break;
                    case 'ar_list':
                        accountReceivableTable(containerTable,d);
                        break;
                    case 'promoted_students':
                        promotedStudentTable(containerTable,d);
                        break;
                    case 'student-statistic-by-campus':
                        renderStudentStatisticByCampus(containerTable,d);
                        break;
                    case 'student-statistic-by-class':
                        renderStudentStatisticByClass(containerTable,d);
                        break;
                    case 'score_list':
                        renderScoreList(containerTable,d);
                        break;
                    case 'student_profile':
                        renderStudentProfile(containerTable,d);
                        break;
                    case 'student_contact_list':
                        renderStudentContactList(containerTable,d);
                        break;
                    case 'student_absent_record_by_name':
                        renderStudentAbsentRecordByName(containerTable,d);
                        break;
                    case 'student_absent_record_by_grade':
                        renderStudentAbsentRecordByGrade(containerTable,d);
                        break;
                    case 'class_attendence_list':
                        renderClassAttendenceList(containerTable,d);
                        break;
                    default:
                        // studentAttendance(containerTable,d);
                        jsonToTable(containerTable,d);
                        break;
                }
                if(runReport) mThis.self.querySelector('#_rpt_filter')?.click();
                // containerTable.innerHTML = res.status_code === 200 ? res.data.html || '<div class="p-3">No result</div>' : `<div class="p-3 text-danger">${res.error_message || 'Failed to load report.'}</div>`;
            }
        });
    }

    mThis.renderOption = (div, code = null) => {
        mThis.options.params?.forEach((item, index, array) => {
            console.log(item);
            if(item.api){
                vsapi.call(item.api, item.param, null, { leader: false, useCache: false, cacheTTL: 3000 }).then(res => {
                    if (res.status_code !== 200) return;
                    const data = item.dot_object ? res.data[item.dot_object] : res.data;
                    const el = div.querySelector(`#${item.dom_id}`);

                    if (!el) return;

                    el.setAttribute('data-required', item.required ? '1' : '0');
                    VSUtil.setComboItems(el, data || [], item.value, item.text);

                    if (el.classList.contains('fee_type_id')) {
                        [...el.options].forEach(option => {
                            if ((option.textContent || '').trim().toLowerCase() === 'tuition fee') {
                                option.remove();
                            }
                        });
                    }
                    console.log(index);
                    if (index === array.length - 1) {
                        mThis.runReport();
                    }
                });

            }else{
                if (index === array.length - 1) {
                    mThis.runReport();

                }
            }

        });
    };

    mThis.getFormGroupLabelText = (key) => {
        const labels = {
            'vendor_id': 'Vendor', 'building_id': 'Building', 'campus_id': 'Campus', 'level_id': 'Level',
            'leave_type_id': 'Leave Type', 'status_id': 'All Statuses','term_id': 'Term','ac_year_id': 'Academic Year',
            'from_campus_id': 'From Campus', 'to_campus_id': 'To Campus',
            'fee_type_id': 'Fee Type', 'start_date': 'Start Date', 'end_date': 'End Date',
            'group_id': 'Group'
        };
        return labels[key] || key;
    };

    mThis.show = async (options = {}) => {
        await mThis.init();

        if (typeof options === 'object') {
            Object.assign(mThis.options, options);
        }

        mThis.displayMainOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.self?.scrollTo?.(0, 0);
            LocaleManager.translateZone(mThis.self);
            // mThis.checkPermissions();
        });
    };

    mThis.defaultPermissions = ['print', 'excel'];
    mThis.displayMainOptions = (onFinish = null) => {
    const payload = { app_id: main_view.app_id };
    vsapi.call(`${main_view.base_url}/api/report-center/report-list`, payload, null, null, main_view.apiCluster)
        
        .then(res => {
            const data = res.status_code === 200 ? res.data : [];
            mThis.renderPanelBox(data);

                if (typeof onFinish === 'function') onFinish();
            });
    }; 

    mThis.checkPermissions = () => {
        mThis.defaultPermissions.forEach(action => {
            const btn = mThis.self.querySelector(`#_rpt_${action}`);
            const isAllowed = AuthManager.allowed(`${mThis.permissionID}.${action}`);
            if (btn) btn.style.display = isAllowed ? 'inline-block' : 'none';
        });
    };

    // Ready for ES module export in the future
    // export default ReportCenterComponent;
    mThis.renderPanelBox = (data = []) => {
        const html = `
            <div id="_div_filter" class="d-none">
                <div class="d-flex p-3 justify-content-between align-items-center bg-white rounded-3 overflow-hidden">
                    <div>
                        <button id="_rpt_filter" class="btn-filter me-2" style="width: 80px;" type="button">
                            <span vslang="buttons.Choose Report"></span>
                        </button>
                    </div>
                    <div id="_div_filter_top" style="max-width: 80%; overflow-y: scroll;"></div>
                    <div>
                        <div class="d-flex justify-content-end gap-2">
                            <button id="_rpt_pdf" class="btn-print gap-2" type="button">
                                <i class="fa-solid fa-print"></i>
                                <span vslang="buttons.Print"></span>
                            </button>
                            <button id="_rpt_excel" class="btn-excel pap-2" type="button">
                                <i class="fa-solid fa-file-excel"></i>
                                <span vslang="buttons.Export"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="_rpt_container" style="position: ; z-index: 99;">
                <div class="row -row-cols-lg-2 gy-2 d-flex">
                    <div id="_rpt_list" class="col-sm-12 col-md-12 col-lg-12">
                        <div class="card-report">
                            <div class="row gy-2 w-100 h-100">
                                <div id="_rpt_name" class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                    <h5 class="text-uppercase" vslang="titles.List of report">List of report</h5>
                                    <ul class="del-marker h-100" style="max-height: ${(window.innerHeight - 160)}px;">
                                        ${mThis.renderReportType(data)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div id="_rpt_input_filter" class="d-block"></div>
                    </div>
                </div>
            </div>
            <div id="_rpt_table" class="container-table overflow-hover-auto pt-0"></div>`;

        mThis.self.innerHTML = html;
        mThis.getValueWhenClick(mThis.self.querySelector('#_rpt_name'));
        mThis.controlPanel(mThis.self);
        LocaleManager.translateZone(mThis.self);
    };



    

    mThis.renderReportType = (list = []) => {
        return list.map(item => {
            const filter = JSON.stringify(item.params || {}).replace(/"/g, "");
            return `
                <li class="report-name" data-filter="${filter}" data-code="${item.code}" data-name="${item.name}" data-permissionid="${item.permission_id}">
                    <i class="fa-regular fa-rectangle-list"></i>
                    <span class="text-capitalize">${item.name || ''}</span>
                </li>`;
        }).join('');
    };

    mThis.getValueWhenClick = (div) => {
        div.onclick = e => {
            e.preventDefault();
            const target = VSUtil.closestLimited(e.target, 'li.report-name');
            if (!target) return;
            mThis.selected_report = {code: target.dataset.code,name : target.dataset.name};
            mThis.permissionID = target.dataset.permissionid;
            let params = target.dataset.filter?.replaceAll("'", '"');
            try {
                params =  params;
            } catch (err) {
                params = '';
            }

            const siblings = target.parentElement.children;
            for (let i = 0; i < siblings.length; i++) {
                siblings[i].classList.toggle('text-primary', siblings[i] === target);
            }

            const p = {
                code: target.dataset.code,
                param: params
            };
            mThis.options.params = [];
            mThis.divReportFilter = mThis.self.querySelector('#_rpt_input_filter');
            mThis.divFilterTop = mThis.self.querySelector('#_div_filter_top');
            mThis.divFilterTop.innerHTML = '<div></div>';
            mThis.renderFilters(mThis.divReportFilter, p);
        };
    };

    mThis.getDataFilter = (div = null) => {
        div = div || mThis.self.querySelector('#_rpt_input_filter');
        let p = {};
        div.querySelectorAll('.data-input').forEach(function (el) {
            // title replacement for jQuery logic
            let title;
            if (el.tagName.toLowerCase() === 'input') {
                title = el.previousElementSibling?.textContent || '';
            } else {
                title = el.parentElement?.previousElementSibling?.textContent || '';
            }
            const f = el.dataset.field;
            // required
            if (el.dataset.required !== undefined) {
                p.required = {
                    text: `${title} cannot empty!`,
                    value: el.value
                };
            }
            // form type
            if (el.dataset.form === 'simple') {
                p.simple = true;
            }
            // value
            p[f] = el.value;
        });

        return p;
    };


    mThis.controlPanel = (div) => {
        const containerTable = div.querySelector('#_rpt_table');
        const tbl = containerTable?.children;
        if (!tbl || tbl.length === 0) window.HtmlString = null;

        div.querySelector('#_rpt_filter')?.addEventListener('click', e => {
            e.preventDefault();
            console.log(3);
            
            const rptList = div.querySelector('#_rpt_list');
            const divFilter = div.querySelector('#_div_filter');
            const rptInputFilter = div.querySelector('#_rpt_input_filter');

            slideToggle(rptList);
            divFilter.style.display = divFilter.style.display === 'block' ? 'none' : 'block';

            rptInputFilter.querySelectorAll('div.el_filter').forEach(el => {
                el.classList.toggle('col-lg-2');
                el.classList.toggle('col-lg-6');
            });

            slideToggle(rptInputFilter.querySelector('#_rpt_btn_list'));
            slideToggle(rptInputFilter.querySelector('#_rpt_btn_print'));

            [...rptInputFilter.children].forEach(el => slideToggle(el));
        });

        div.querySelector('.btn-filter')?.addEventListener('click', e => {
            e.preventDefault();
            console.log(34,e);
            mThis.self.querySelector('#_rpt_filter')?.click();
        });

        div.querySelector('.btn-print')?.addEventListener('click', e => {
            e.preventDefault();
            if (!AuthManager.allowed(`${mThis.permissionID}.Print`)) return;
            windowPrint();
        });

        div.querySelector('.btn-excel')?.addEventListener('click', e => {
            e.preventDefault();
            if (!AuthManager.allowed(`${mThis.permissionID}.Excel`)) return;
            exportToExcel();
        });

        div.querySelectorAll('.data-filter').forEach(el =>{
            el.onchange = (e) => {
                e.preventDefault();
                let op = mThis.getDataFilter(); 
                if(e.target.dataset.field == 'start_date' || e.target.dataset.field == 'end_date'){
                    if(op.start_date == '' || op.end_date == '') return;
                        mThis.runReport(null,false);
                }
                else{
                    mThis.runReport(null,false);
                }
                    
            }
        });

        adjustTableHeight(containerTable);
        let resizeTimer;
        window.onresize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => adjustTableHeight(containerTable), 100);
        };
    };

    return mThis;
})();

function slideToggle(element, duration = 400) {
    if (!element) return;
    const style = element.style;
    const computed = window.getComputedStyle(element);
    const isHidden = computed.display === 'none';

    if (isHidden) {
        style.removeProperty('display');
        style.display = computed.display === 'none' ? 'block' : computed.display;
        const height = element.scrollHeight + 'px';
        style.overflow = 'hidden';
        style.height = '0px';
        element.offsetHeight;
        style.transition = `height ${duration}ms ease`;
        style.height = height;
        setTimeout(() => {
            style.removeProperty('height');
            style.removeProperty('overflow');
            style.removeProperty('transition');
        }, duration);
    } else {
        const height = element.scrollHeight + 'px';
        style.height = height;
        style.overflow = 'hidden';
        element.offsetHeight;
        style.transition = `height ${duration}ms ease`;
        style.height = '0px';
        setTimeout(() => {
            style.display = 'none';
            style.removeProperty('height');
            style.removeProperty('overflow');
            style.removeProperty('transition');
        }, duration);
    }
}


