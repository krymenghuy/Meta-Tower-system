'use strict';
var ReportCenterComponent = new function(){
    let mThis = this;
    this.title_prop = "Report Center";
    this.self = main_view.appContent.children('#_rpc_reportCenterComponent');
    this.base_url = main_view.base_url; 
    this.api_fetch_report_list = [this.base_url,'/dms/report-center/report-list'].join('');
    this.api_fetch_report_list_by_category = [this.base_url,'/api/report-center/reports-by-category'].join('');
    this.api_fetch_report_filter_options = [this.base_url,'/api/report-center/filter-options'].join('');

    //** This is default report route
    this.report_url =[this.base_url,'/dms-gen-report'].join(''); 

    //*** Special report route by report name or code
    this.special_routes = {
        'hs_merchant_invoice': [this.base_url,'/hs-merchant-invoice'].join(''),
        'hs_merchant_invoice_v2': [this.base_url,'/hs-merchant-invoice-v2'].join(''),
        'merchant_invoice': [this.base_url,'/merchant-invoice'].join(''),
        'salesmodule_lead_list': [this.base_url,'/sales-module-report'].join(''),
        'salesmodule_package_count_by_merchant': [this.base_url,'/sales-module-report'].join(''),
        'salesmodule_commission_summary': [this.base_url,'/sales-module-report'].join(''),
        'salessmodule_commission_payments': [this.base_url,'/sales-module-report'].join(''),
    };

    //*** Report route by category of report
    // //Route report by category. NOTE category name is Case -sensitive text
    this.routeByCategory = { 
       "Sales Module": [this.base_url,'/sales-module-report'].join('')
    };

    this.div_report_list = this.self.find('#_rpc_reportlist')[0];
    this.div_filter_fields = this.self.find('#_rpc_filter_fields');
    this.no_filter_wrapper = this.self.find('#_rpc_no_filter_text_wrapper');
    this.selected_report_name = this.self.find('#_rpc_selected_report_name');
    this.api_encrypt = [`${mThis.base_url}/api/vs-encrypt031181`].join('');
 
    /** object to store report information */
    this.reports = {};

    this.btnExportPackages = this.self.find('#_rpc_btnExport');
    this.btnRunReport = this.self.find('#_rpc_btnRunReport');
    this.filter_fields = [
        {
            'visible':false,
            'type':'select',
            'width':'full',
            'label':'Warehouse',
            'data':"warehouses",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-warehouse`,
            //'api_params':{},
            'name':'wid',
            'value_field':'id',
            'text_field':'warehouse_name'
        },
        {
            'type':'select',
            'label':'Driver',
            'data':"drivers",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-driver`,
            //'api_params':{},
            'multiple':false,
            'name':'driver_id',
            'value_field':'id',
            'text_field':'driver_name'
        }, 
        {
            type:'select',
            allow_choose_all:['All Merchant Status'],
            'data':"sender_statuses",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-sender`,
            //'api_params':{},
            'label':'Merchant Status',
            'name':'sender_status',
            'multiple':false,
            'value_field':'sender_status',
            'text_field':'sender_status'
        },
        {
            'type':'select',
            'allow_choose_all':['daily_packages'],
            'data':"senders",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-sender`,
            //'api_params':{},
            'label':'Merchant',
            'name':'sender_id',
            'multiple':false,
            'value_field':'id',
            'text_field':'sender_name'
        },
        {
            'name':'start_date',
            'label':'From',
            'width':'half'
        },
        {
            'name':'end_date',
            'label':'To',
            'width':'half'
        },
        {
            'type':'select',
            'name':'sender_pmt_status_id',
            'label':'Payment Status',
            'data':"pmt_statuses",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'pmt_status',
            'width':'half'
        },
        {
            'type':'select',
            'name':'driver_pmt_status_id',
            'label':'Payment Status',
            'data':"pmt_statuses",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'pmt_status',
            'width':'half'
        },
        {
            'type':'select',
            'name':'sales_agent_type',
            'label':'Agent Type',
            'data':"sales_agent_types",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'sales_agent_type_id',
            'text_field':'agent_type',
            'width':'half'
        },
        {
            'type':'select',
            'name':'sales_agent_id',
            'label':'Sales Agent',
            'data':"sales_agents",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'agent_name',
            'width':'half'
        },
        {
            'type':'select',
            'name':'delivery_status_id',
            'label':'Delivery Status',
            //'api_fetch':`${mThis.base_url}/dms/settings/options-delivery-status`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'delivery_status',
            'width':'half'
        },
        {
            'type':'select',
            'name':'agent_id',
            'label':'Sale Agent',
            'data':"sales_agents",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-sales-agent`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'agent_name',
            'width':'half'
        },
        {
            'type':'select',
            'name':'month_year',
            'label':'Month',
            'data':"months",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'month',
            'text_field':'month_year',
            'width':'half'
        },
        {
            'type':'select',
            'name':'start_month',
            'label':'From Month',
            'data':"months",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'month',
            'text_field':'month_year',
            'width':'half'
        },
        {
            'type':'select',
            'name':'end_month',
            'label':'To Month',
            'data':"months",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-pmt-status`,
            //'api_params':{},
            'value_field':'month',
            'text_field':'month_year',
            'width':'half'
        },
        {
            'type':'select',
            'name':'completed',
            'label':'Status',
            'data':"complete_statuses",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-complete-status`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'c_status',
            'width':'half'
        },
        {
            'type':'select',
            'name':'delivery_type',
            'label':'Delivery Type',
            'data':"drivers",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-driver`,
            //'api_params':{},
            'value_field':'id',
            'text_field':'driver_name',
            'width':'half'
        },
        {
            'type':'select',
            'name':'trx_type',
            'label':'Trans Type',
            'data':"trx_types",
            //'api_fetch':`${mThis.base_url}/dms/settings/options-trxtype`,
            //'api_params':{},
            'value_field':'trx_type',
            'text_field':'name',
            'width':'half'
        }
    ];

    mThis.required_filters = {
        'vd_summary':['sender_id'], /* This means that report named "vd_summary" requires filter option "sender_id" */
        'dr_summary':['driver_id']
    }

    this.loadFilterOptions = (filter_height) =>{
       vsapi.call(mThis.api_fetch_report_filter_options,null,false,null).then(res =>{
         if(res.status_code === 200){
            mThis.renderFilterFields(res.data,filter_height);
         }
       });
    }

    this.renderFilterFields =(d = {}, filterHeight=350)=>{
        let cnt =0;
        //mThis.div_filter_fields.hide();
        mThis.filter_fields.map(f=>{
            if (!f.id) f.id = [mThis.div_filter_fields.attr('id'),'-',(cnt+1)].join('');
            let width_class = 'col-lg-12';
            if(f.width ==='half') width_class= 'col-lg-6';

            let is_date='';
            if(f.type==='date' || f.name ==='start_date' || f.name ==='end_date' ){
                is_date = ` type="text"`; //  'date' => `data-select="datepicker"`;
                f.type ='date';
            }

            let html ="";
            if (f.type ==='select')
            {
                //let multiple = f.multiple? 'multiple':'';
                html = `<div style="display:none" class="form-group ${width_class}">
                <label for="">${f.label}</label>
                <div><select id="${f.id}" multiple class="modal-select2 rpt-filter"
                   data-field="${f.name?f.name:f.value_field}" data-used="1"></select> </div>
                </div>`;
            }
            else {
                html =`<div style="display:none" class="form-group ${width_class}">
                <label for="">${f.label}</label>
                <div><input id="${f.id}" ${is_date}
                        class="form-control rpt-filter height" data-field="${f.name? f.name:f.value_field}" autocomplete="off"></div>
                </div>`;
            }
                
             mThis.div_filter_fields.append(html);
             let el = mThis.div_filter_fields.find(`#${f.id}`);

             if(f.type ==='date'){
                //el.datePicker({'format':'dd M Y'});
                el.attr('autocomplete','off"');
                DateTimePicker.init(el);
                //el.attr('autocomplete','chrome-off"');
            
             }else if (f.type==='select'){
  
                 mThis.initSelect2(el,null,null,f.multiple);
                 const items = d[f.data]? d[f.data]: [];
                 if(f.multiple || f.multiple==1){
                     let option_all = {};
                     option_all[f.text_field] ='(All)';
                     option_all[f.value_field] =0;
                     items.unshift(option_all);
                 }
                 if(f.name =='sender_id') items.unshift({'id': 0, 'sender_name':'(All Merchants)'});
                 VSUtil.setComboItems(el,items,f.value_field,f.text_field,false,null,null);
                 if(!f.def_value) f.def_value = items[0]?items[0][f.value_field]:0; 
                 if(f.def_value) el.val(f.def_value).trigger('change');
                 else{
                     if(items[0] && !items[1]){
                         el.val(items[0][f.value_field]).trigger('change');    
                     }
                 }
                
             }
            
             cnt++;
        });

        if(cnt===0){
            mThis.div_filter_fields.html(
            `<div style="diplay:none" id="_rpc_no_filter_text_wrapper" class="form-group col-lg-12 no-filter-text-wrapper">
                <div class="alert alert-primary">
                    No filter required :)
                </div>
            </div>`);
        }
        mThis.div_filter_fields.css('height',[filterHeight,'px !important'].join(''));
        //mThis.div_filter_fields.show();
    }

     this.initSelect2 = (el,width,value=null,multiple=false) =>{
        if(!el) return;     
            let init_op ={width:width?width:'100%','multiple':multiple};
            el.select2(init_op);
            if(value) el.val(value).trigger('change');
     }


    /** Initialize reportCenter object only first user's click on Report Center menu */
    this.initOnce = ()=>{
        if (mThis.initAlready) return;
      
        mThis.loadReportsByCategory(() =>{
            mThis.loadFilterOptions(mThis.div_report_list.offsetHeight);
            //mThis.renderFilterFields(e.wrapper.height());
        });

        // mThis.loadReportItems((e)=>{

        // });

        mThis.div_report_list.addEventListener('click', e =>{
            e.preventDefault();
            let d = VSUtil.closestLimited(e.target,'a.rpc-group-header');
            if(d){
               const div = d.nextSibling; 
               mThis.toggleShow(div);
               return;
            }

            d = VSUtil.closestLimited(e.target,'a.rpc-report');
            if(d){
                let id = d.dataset.id; 
                let code = d.dataset.code;
                mThis.selectReportItem(id,code);
                return;
            }
        });

        mThis.div_report_list.addEventListener('mouseover', e =>{
            e.preventDefault();
            let d = VSUtil.closestLimited(e.target,'.div-row');
            if(d){
                mThis.setReportItemState(d,'hover');
            }
           
        });

        mThis.div_report_list.addEventListener('mouseleave',e=>{
            e.preventDefault();
            let d = VSUtil.closestLimited(e.target,'.div-row');
            mThis.setReportItemState(d,'normal');
        });

        // mThis.div_report_list.addEventListener('click','.div-row',function(e){
        //     e.preventDefault();
        //    mThis.selectReportItem($(this));
        // });
        
        this.btnExportPackages.on('click',(e)=>{
            e.preventDefault();
            let p = mThis.getReportFilterData();
            if (!p.start_date || !p.end_date){
                cv_interact.error('Start date and end date are required');
                return;
            } 
            vsapi.call(`${mThis.base_url}/dms/export/packages`,p).then(res=>{
                if (res.status_code===200){
                    let rows = res.data;
                    if(!rows[0]){
                        cv_interact.warning('No packages to export!');
                        return;
                    }
                    let file_name ='dms-packages';
                    let titles = null;
                    JsonToExcel.exportToCSV(rows,file_name,titles,true,[]);
                }
                else {
                    cv_interact.error(res.error_message);
                }
            });
        });

        mThis.btnRunReport.off('click').on('click',(e)=>{
            let rpt = mThis.getSelectedReport();
            let params = mThis.getReportFilterData();

            //Check required report filters
            let req_filters = mThis.required_filters[rpt.code];
            if(!req_filters || !req_filters[0]){
                mThis.showReport(rpt,params);
                return;
            }

            (req_filters || []).map(f=>{
                if(!params[f]){
                    cv_interact.warning(`${f.replace('_',' ')} is required`);
                    return false;
                }else{
                    this.showReport(rpt,params);
                    // let qstring = mThis.translateToQueryString(params);
                    // let sp = '';
                    // if (qstring) sp ='&';
                    // let p = {'data':`${qstring}${sp}rtype=${rpt.code}`};
                    // vsapi.call(mThis.api_encrypt,p,null,false).then(res=>{
                    //     let d = res.data?res.data:res; 
                    //     if(res.error_message){
                    //         cv_interact.error(res.error_message);
                    //         return false;  
                    //     }
 
                    //     window.open(`${mThis.report_url}/${d}`,'_blank');
                    //     return false;
                    // });
                }
            });
           
         
        });

        //mThis.init_custom();
        mThis.initAlready = true;
    }

    this.toggleShow = (div) => {
       let v_show = div.style.display;
       if(v_show ==='none'){
           div.classList.add('d-flex');
           div.style.display ='block';
       }else{
        div.classList.remove('d-flex');
        div.style.display ='none';
       } 
    }
    
    

        //rpt_params is object
        this.showReport = (rpt, rpt_params)=>{
            const rpt_code = rpt.code;
            let qstring = mThis.translateToQueryString(rpt_params);
            let sp = '';
            if (qstring) sp ='&';
            let p = {'data':`${qstring}${sp}rtype=${rpt_code}`};
            let report_route = mThis.routeByCategory[rpt.category];
            report_route = report_route ||  (mThis.special_routes[rpt_code] ? mThis.special_routes[rpt_code] : mThis.report_url);
            //report_route = mThis.special_routes[rpt_code] ? mThis.special_routes[rpt_code] : mThis.report_url;

            //console.error(`${report_route}/${p.data}`);
            vsapi.call(mThis.api_encrypt,p,null,false).then(res=>{
                let d = res.data?res.data:res; 
                if(res.error_message){
                    cv_interact.error(res.error_message);
                    return false;  
                }
                
                window.open(`${report_route}/${d}`,'_blank');
                return false;
            });
       }

    // this.showWebReport = (rpt_code, params="")=>{
    //     let qstring = mThis.translateToQueryString(params);
    //     let report_route = mThis.special_routes[rpt_code] ? mThis.special_routes[rpt_code] : mThis.report_url;
    //     let sp = '';
    //     if (qstring) sp ='&';
    //     let p = {'data':`${qstring}${sp}rtype=${rpt_code}`};
    //     vsapi.call(mThis.api_encrypt,p,null,false).then(res=>{
    //         let d = res.data?res.data:res; 
    //         if(res.error_message){
    //             cv_interact.error(res.error_message);
    //             return;  
    //         }
    //         window.open(`${report_route}/${d}`,'_blank');
    //     });
    // }
   
    this.translateToQueryString = (params)=>{
        let q ='';
        for(let prop in params){
            let sp = '';
            if (q) sp='&';
            let var_name = prop.replace(/_/g, '');
            q = [q,sp,var_name,'=',params[prop]].join('');
        }
        return q;
    }

    this.setReportItemState = (div_row,state_name ='hover')=>{
        if(!div_row) return;
        let hover_color ='orange';
        let normal_color = 'grey';

        let selected = div_row.classList.contains('report-selected');
        if (state_name ==='hover'){
            div_row.querySelector('span').style.color = hover_color;
        }
        else{
            div_row.querySelector('span').style.color = normal_color;
            if (!selected)
                div_row.querySelectorAll('i').forEach(x => {
                    x.classList.remove('fa-check');
                    x.classList.add('fa-list-alt');
                    x.style.color = normal_color;
                }); 
        }
    }
  
    this.selectReportItem = (report_id, rpt_code)=>{
        mThis.div_report_list.querySelectorAll('.rpc-report').forEach( el =>{
            let id = el.dataset.id;
            if(id == report_id){
                el.classList.add('report-selected');
            }else   el.classList.remove('report-selected');
        });
         
        // div_row.querySelectorAll('i').forEach(x =>{
        //     x.classList.remove('fa-list-alt');
        //     x.classList.add('fa-check');
        //     x.style.color = 'green';
        // });
        
        //const rpt_code = div_row.dataset.code;
        let rpt = mThis.reports[rpt_code];
        if(!rpt) return null; 
        mThis.selected_report_name.text(rpt.name); 
        mThis.showReportFilters(rpt.params);
    }

    /** render Reports V2 */
    this.loadReportsByCategory = (onFinish) => {
        mThis.div_report_list.innerHTML = '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><div class="animation-line" style="height:2px;margin:0;"></div></div>';
        vsapi.call(mThis.api_fetch_report_list_by_category, null, null, false)
        .then(res => {
            const data = res.status_code === 200 ? res.data : {};
            let html = '';
            Object.values(data).forEach(cat => {
                let item_html = '';
                cat.list.map(rpt =>{
                    item_html = [item_html,`<a class="rpc-report text-black" href="javascript:void(0)" data-code="`,rpt.code,`" data-id="`,rpt.id,`">`,'<i class="fs-5 fa fa-pointer text-muted"></i> ',rpt.name,`</a>`].join('');
                    mThis.reports[rpt.code] = rpt;
                });
                
                let group_html = ['<a href="javascript:void(0)" class="rpc-group-header fs-5 d-block" data-category="',cat.category,'" data-categoryid="',cat.id,'">','<span class="text-nowrap fw-semibold p-2">','<img class="rpc-category-icon" src="', main_view.asset_url,'/images/icons/report.png','"> ',cat.category,'</span>','</a>'].join('');
                group_html = [group_html,`<div class="rpc-reports d-flex flex-column gap-2 justify-content-start align-items-start flex-wrap p-2 overflow-hidden">`,item_html,`</div>`].join('');
                html = [html, group_html].join('');
            });
            mThis.div_report_list.innerHTML = html;
            onFinish();
        });
    }
    
    
    this.getSelectedReport = ()=>{
        let div_row = mThis.div_report_list.querySelector('.report-selected');
        const rpt_code = div_row.dataset.code;
        return mThis.reports[rpt_code];
    }

    this.loadReportItems = (onFinish)=>{
        vsapi.call(mThis.api_fetch_report_list,null).then(res=>{
            mThis.div_report_list.empty();
            let items = StringSanitizer.sanitizeObject(res.data,null,['params']);
            let i=0,c;
             
            do{
                c = items[i];
                if(!c) break;
                mThis.reports[c.code]= {
                  "id":c.id, 
                  "name":c.name,
                  "code":c.code,  
                  "params":c.params,
                  "category":c.category,
                  "module_id":c.module_id
                };
               
                mThis.div_report_list.append(`
                    <div class="div-row" data-code="${c.code}" data-id="${c.id}">
                        <div class="div-cell report-icon">
                            <i class="fa fa-list-alt"></i> 
                        </div>
                        <div class="div-cell">
                            <span class="report-text" data-category="${c.category}">${c.name}</span>
                        </div>
                    </div>`);
               i++;
            }while(c);
            mThis.div_report_list.css('min-height','350px');
            mThis.div_report_list.show();
            if (typeof onFinish ==='function') onFinish({'wrapper':mThis.div_report_list});
          
            //mThis.reports = items;
        });
    }
  
    // this.init_custom = ()=>{

    // }

    this.showReportFilters = (rpt_params='')=>{
        if(!rpt_params) rpt_params = '';
        let fields = rpt_params.split('|');
         
        let filter_count =0;
        mThis.no_filter_wrapper.hide();

        mThis.div_filter_fields.find('.rpt-filter').each(function(){
            let el = $(this);
            let field = (el.data('field')+'').trim().toLowerCase();

            if (fields.indexOf(field) >=0) {
                el.data('used',1);
                el.closest('div.form-group').show();
                filter_count++;
            }else{
                el.data('used',0);
                el.parent().parent().hide();
            }
        });

        mThis.div_filter_fields.show();
        if (filter_count === 0){
            mThis.no_filter_wrapper.show();
        }
    }

   //Return filter data in JSON format, depending on which filter (or param) is used (or not) by a currently selected report 
   this.getReportFilterData = ()=>{
    let p = {};
    mThis.div_filter_fields.find('.rpt-filter').each(function(){
        let el = $(this);
        let filter_is_used = el.data('used');
        if (filter_is_used){
           let field = el.data('field');
           let val = el.val();
           if(Array.isArray(val)){
              let c_val ='';
              val.map(v=>{
                   c_val = [c_val,(c_val?'|':''),v].join('');
              });
              p[field] = c_val;
           }else p[field] = val;
        } 
    });

    return p;
  }

 
    this.show = (option, onClose= null)=>{
        mThis.initOnce();
        if (!option) option={};
        mThis.onClose = onClose;
        mThis.filter = option.filter;
        mThis.self.siblings().hide();
        main_view.setTitle(mThis.title_prop);
        mThis.self.hide().fadeIn(250);
    }

    this.hide = function(){
        mThis.self.hide();
    }
}