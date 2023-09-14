'use strict';
var ReportCenterComponent = new function(){
    let mThis = this;
    this.title_prop = "Report Center";
    this.self = main_view.appContent.children('#_main_reportCenterComponent');
    this.options = {};

    this.init = () => {}

    this.filter_fields = [{
        'type': 'select',
        'api_fetch': `${main_view.base_url}/api/form-option`,
        'api_params': {},
        'name': 'group_id',
        'value_field': 'id',
        'text_field': 'name',
        'required': 'true',
        'dot_object': 'groups'
    },
    {
        'type': 'select',
        'api_fetch': `${main_view.base_url}/api/form-option`,
        'api_params': {},
        'name': 'term_id',
        'value_field': 'id',
        'text_field': 'term',
        'required': 'true',
        'dot_object': 'terms'
    },
    {
        'type': 'date',
        'name': 'start_date'
    },
    {
        'type':'date',
        'name':'end_date'
    }];

    this.displayMainOptions = (onFinish = null) => {
        vsapi.call(`${main_view.base_url}/api/report-center/report-list`,null,null).then(res => {
            let data = [];
            if(res.status_code === 200){
                data = res.data;
            }
            mThis.renderPanelBox(data);
        });
        if(typeof onFinish === 'function') onFinish();
    }

    this.renderPanelBox = (data) => {
        let html = [`<div class="d-flex p-3 bg-white rounded-3">
            <button id="_rpt_filter" class="btn-filter" type="button">
                <span class="trans-text" data-langprop="buttons.Filter"></span>
            </button>
            <div class="d-flex justify-content-end gap-2 w-100">
                <button id="_rpt_pdf" class="btn-print" type="button">
                    <span class="trans-text" data-langprop="buttons.Print"></span>
                    <i class="fa-solid fa-print"></i>
                </button>
                <button id="_rpt_excel" class="btn-pdf" type="button">
                    <span class="trans-text" data-langprop="buttons.Export"></span>
                    <i class="fa-regular fa-file-pdf"></i>
                </button>
            </div>
        </div>
        <div id="_rpt_container">
            <div class="row row-cols-lg-2 gy-2 mt-3">
                <div class="col">
                    <div class="card-report">
                        <div class="row gy-2 w-100">
                            <div id="_rpt_name" class="col">
                                <ul class="del-marker">
                                    ${mThis.renderReportType(data) ? mThis.renderReportType(data) : ''}
                                </ul>
                            </div>
                            <div class="col">
                                <div class="h-img-report">
                                    <img src="${main_view.base_url}/assets/images/logo/report.png" alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div id="_rpt_input_filter" class="card-report d-block"></div>
                </div>
            </div>
        </div>
        <div id="_rpt_table" class="container-table"></div>`].join('');

        mThis.self.html(html);
        mThis.getValueWhenClick(mThis.self.find('#_rpt_name'));
        mThis.controlPanel(mThis.self);
        LocaleManager.translateZone('_main_reportCenterComponent');
    }

    this.controlPanel = (div) => {
        const tbl = div.find('#_rpt_table').children();
        if(tbl.length === 0)
            HtmlString = null;

        div.find('#_rpt_filter').on('click',function(e){
            e.preventDefault();
            div.find('#_rpt_container').toggle('slow');
        });

        div.find('#_rpt_pdf').off('click').on('click',function(e){
            e.preventDefault();
            windowPrint();
        });

        div.find('#_rpt_excel').off('click').on('click',function(e){
            e.preventDefault();
            exportToExcel();
        });
    }

    this.renderReportType = (d) => {
        d = d ? d : [];
        let html = null;

        d.map(item => {
            html = [html, `<li class="report-name" data-param="${item.params}" data-code="${item.code}">
                <i class="fa-regular fa-rectangle-list"></i>
                <span class="text-capitalize">${item.name}</span>
            </li>`].join('');
        });
        return html;
    }

    this.renderFilters = (div, p) => {
        p = p ? p : {};
        let html = null, inner_html = null;
        if(p.param){
            p.param.map(item => {
                const title = item.replace('_id','').split('_').join(' ');
                mThis.filter_fields.map(f => {
                    if(f.type === 'select' && f.name === item){
                        const id = ['select_',f.name].join('');
                        inner_html = [inner_html, `<div class="col-lg-6">
                            <div class="form-group">
                                <label for="${item}" class="form-label text-capitalize trans-text" data-langprop="titles.${title}"></label>
                                <div class="width-select-in-form">
                                    <select id="${id}" class="${f.name} modal-select2 data-input" data-field="${item}"></select>
                                </div>
                            </div>
                        </div>`].join('');
                        mThis.getDataOption(f.api_fetch, f.api_params, f.value_field, f.text_field, f.required, f.dot_object, f.form, id);
                    }
                    else if(f.type === 'date' && f.name === item){
                        inner_html = [inner_html, `<div class="col-lg-6">
                            <div class="form-group">
                                <label for="${item}" class="form-label text-capitalize trans-text" data-langprop="titles.${title}"></label>
                                <input data-select="datepicker" class="form-control data-input" data-field="${item}"/>
                            </div>
                        </div>`].join('');
                    }
                });
            });
        }
        else{
            inner_html = [`<div class="col">
                <div class="d-flex align-items-center justify-content-center">
                    <h4 class="text-muted">No Filter</h4>
                </div>
            </div>`].join('');
        }

        html = [`<div class="row row-cols-lg-2 w-100">
            ${inner_html ? inner_html : `<div class="col">
                <h4 class="text-muted text-center">No Filter</h4>
            </div>`}
        </div>
        <div class="form-group mt-3">
            <button id="_rpt_btn_report" class="btn-filter" type="button">
                <span class="trans-text" data-langprop="buttons.Run Report"></span>
            </button>
        </div>`].join('');

        div.html(html);
        mThis.runReport(div,p.code);
        mThis.renderSelect(div);

        div.find("[data-select='datepicker']").each(function(){
			DateTimePicker.init($(this));
		});
        div.find('select.modal-select2').select2();
        LocaleManager.translateZone('_rpt_input_filter');
    }

    this.getDataOption = (api, param, value, text, required, dot_object, form, id) => {
        mThis.options.params = mThis.options.params ? mThis.options.params : [];
        mThis.options.params.push({
            'api': api,
            'param': param,
            'value': value,
            'text': text,
            'required': required,
            'dot_object': dot_object,
            'form': form,
            'dom_id': id
        });
    }

    this.renderSelect = (div) => {
        mThis.options.params.map(item => {
            let data = [];
            vsapi.call(item.api, item.param, null, false).then(res => {
                if(res.status_code === 200){
                    data = res.data;
                    item.dot_object ? data = data[`${item.dot_object}`] : data = data;
                    const el = div.find(`#${item.dom_id}`);
                    item.required ? el.attr('data-required',item.required) : false;
                    item.form ? el.attr('data-form',item.form) : false;
                    VSUtil.setComboItems(el, data, item.value, item.text, null, null, null);
                }
            });
        });
    }

    this.runReport = (div,code) => {
        div.find('#_rpt_btn_report').on('click',function(e){
            e.preventDefault();
            let p = {};
            div.find('.data-input').each(function(){
                const el = $(this);
                const f = el.data('field');
                if(el.data('required')){
                    p['required'] = {
                        'text': [mThis.capitalize(f.replaceAll('_id','')),'cannot empty!'].join(' '),
                        'value': el.val()
                    };
                }
                if(el.data('form') == 'simple'){
                    p['simple'] = true;
                }
                p[f] = el.val();
                p.code = code;
            });

            if(p.required && !(p.required.value) && p.required.text){
                cv_interact.warning(p.required.text);
            }
            else{
                mThis.getDataTable(div.closest('.main-container'),p);
            }
        });
    }

    this.capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

    this.getDataTable = (div, p) => {
        let end_point = null;
        switch(p.code){
            case 'student_attendance':
                end_point = 'api/reports/enrollment/attendance/list';
                break;
            case 'student_list':
                end_point = 'api/reports/finance/daily-cash-list';
                break;
            default:
                end_point = null;
                break;
        }
        if(end_point){
            vsapi.call(`${main_view.base_url}/${end_point}`,p,null,false).then(res => {
                let d = {};
                if(res.status_code === 200){
                    d = res.data;
                }
                if(d.form === 'simple'){
                    jsonToTable(div.find('#_rpt_table'),d);
                }
                else{
                    renderTable(div.find('#_rpt_table'),d);
                }
            });
        }
    }

    this.getValueWhenClick = (div) => {
        div.on('click','li.report-name',function(e){
            e.preventDefault();
            let params = $(this).data('param');
            mThis.options.params = [];
            $(this).addClass('text-primary').siblings().removeClass('text-primary');
            if(params) params = params.split('|');
            let p = {
                'code': $(this).data('code'),
                'param': params
            };
            mThis.renderFilters(mThis.self.find('#_rpt_input_filter'), p);
        });
        div.find('li.report-name').first().trigger('click');
    }

    this.show = (options) => {
        if(!options) options = {};
        mThis.displayMainOptions(() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

window.addEventListener('DOMContentLoaded',() => {
    ReportCenterComponent.init();
});