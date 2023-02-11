'use strict';
let ReportCenterComponent = new function(){
    let mThis = this;
    this.self = $('#_rpc_reportCenterComponent');
    this.title_prop = "Report Center";
    this.elBaseUrl = document.querySelector('#__base_url');
    this.base_url = this.elBaseUrl ? this.elBaseUrl.textContent:main_view.base_url; 
    this.api_fetch_report_list = [this.base_url,'/api/report-center/report-list'].join('');
    this.api_fetch_report_filter_options = [this.base_url,'/api/report-center/filter-options'].join('');

    this.api_fetch_level = [this.base_url,'/api/getComboItems_level'].join('');
    this.report_url =[this.base_url,'/genreport'].join('');

    this.div_report_list = $('#_rpc_reportlist');
    this.div_filter_fields = $('#_rpc_filter_fields');
    this.no_filter_wrapper = $('#_rpc_no_filter_text_wrapper');
    this.selected_report_name = $('#_rpc_selected_report_name');
    this.api_encrypt = [`${main_view.base_url}/api/encryptData`].join('');

    this.btnRunReport = $('#_rpc_btnRunReport');

    //Array list of filter field objects {name,element,value_field,text_field}
    this.filter_fields = [
        {
            'type':'select',
            'width':'full',
            'label':'Warehouse',
            'api_fetch':`${main_view.base_url}/api/settings/options-warehouse`,
            'api_params':{},
            'name':'wid', //filter name or var name to be passed as parameter to report's fetch api
            'value_field':'id',
            'text_field':'warehouse_name'
         },
         {
          'type':'select',
          //'width':'full',
          'label':'Driver',
          'api_fetch':`${main_view.base_url}/api/settings/options-driver`,
          'api_params':{},
          'name':'driver_id', //filter name or var name to be passed as parameter to report's fetch api
          'value_field':'id',
          'text_field':'driver_name'
       }, 
      {
        'type':'select',
        'api_fetch':`${main_view.base_url}/api/settings/options-sender`,
        'api_params':{},
        'label':'Sender',
        'name':'sender_id',
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
      }
    ];
 
    this.renderFilterFields =(filterHeight=350)=>{
        let cnt =0;
        //mThis.div_filter_fields.hide();
        mThis.filter_fields.map(f=>{
            if (!f.id) f.id = [mThis.div_filter_fields.attr('id'),'-',(cnt+1)].join('');
            let width_class = 'col-lg-12';
            if(f.width ==='half') width_class= 'col-lg-6';

            let is_date='';
            if(f.type==='date' || f.name === 'start_date' || f.name === 'end_date' ){
                is_date = ` type="date"`; // `data-select="datepicker"`;
                f.type ='date';
            }

            let html ="";
            if (f.type ==='select')
             html = `<div style="display:none"   class="form-group ${width_class}">
             <label for="">${f.label}</label>
             <div><select id="${f.id}" class="modal-select2 rpt-filter height"
                data-field="${f.name?f.name:f.value_field}" data-used="1"></select> </div>
             </div>`;
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
                //el.attr('autocomplete','chrome-off"');
            
             }else if (f.type==='select'){
                mThis.initSelect2(el,null,null);
                vsapi.call(f.api_fetch,f.api_params,null,false).then(res=>{
                    if(res.status_code ===200){
                        let items = res.data;
                        VSUtil.setComboItems(el,items,f.value_field,f.text_field,false,'(All)',f.def_value);
                        if(f.def_value) el.val(f.def_value).trigger('change');
                    }
                 });
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
    }

    this.initSelect2 = (el,width,value=null) =>{
        if(!el) return;     
            let init_op ={width:width?width:'100%'};
            el.select2(init_op);
            if(value) el.val(value).trigger('change');
    }

    this.init = ()=>{
        mThis.loadReportItems((e)=>{
            mThis.renderFilterFields(e.wrapper.height());
        });
        
        mThis.div_report_list.on('mouseover','.div-row',function(e){
            mThis.setReportItemState($(this),'hover');
        });

        mThis.div_report_list.on('mouseleave','.div-row',function(e){
            mThis.setReportItemState($(this),'normal');
        });

        mThis.div_report_list.on('click','.div-row',function(e){
           mThis.selectReportItem($(this));
        });

        mThis.btnRunReport.on('click',(e)=>{
            let rpt = mThis.getSelectedReport();
 
            let params = mThis.getReportFilterData();
            let qstring = mThis.translateToQueryString(params);
            let sp = '';
            if (qstring) sp ='&';
            let p = {'data':`${qstring}${sp}rtype=${rpt.code}`};
            vsapi.call(mThis.api_encrypt,p,null,false).then(res=>{
                let d = res.data?res.data:res; 
                if(res.error_message){
                    cv_interact.error(res.error_message);
                    return;  
                }

                window.open(`${mThis.report_url}/${d}`,'_blank');
            });
        });

        //This is not general code. It is custom event handlers (or init code) that are sepcific to each project
        mThis.init_custom();
    }
    
    //params is a JSON object containing props. Each prop is a variable name in query string. 
    //translateToQueryString() removes underscore '_' char from prop name and used it as var in query string
    this.translateToQueryString = (params)=>{
       let q ='';
       for(let prop in params){
          let sp = '';
          if (q) sp='&';
          let var_name = prop.replace('_','');
          q = [q,sp,var_name,'=',params[prop]].join('');
       }
       return q; 
    }

    //Set Report name (text) ins the sate of Hover or Normal. while function 'selectReportItem()' will set report item in the Selected state.
    this.setReportItemState = (div_row,state_name ='hover')=>{
        //if (div_row.hasClass('report-selected')) return;
        let hover_color ='orange';
        let normal_color = 'grey';
     
        let selected = div_row.hasClass('report-selected');
        if (state_name ==='hover'){
            // mThis.div_report_list.find('.div-row').each(function(){
            //     if(!$(this).hasClass('report-selected')){
            //        $(this).find('i').removeClass('fa-check').addClass('fa-list-alt').css('color',normal_color);
            //     }
            //  });
     
             div_row.find('span').css('color',hover_color);
             //if (!selected) div_row.find('i').removeClass('fa-list-alt').addClass('fa-check').css('color',hover_color);
             //console.log('hover = > selected =' + selected);
        }else{
            div_row.find('span').css('color',normal_color);
            if (!selected) div_row.find('i').removeClass('fa-check').addClass('fa-list-alt').css('color',normal_color);
            //console.log('normal = > selected =' + selected);
        }
    }
  
    this.selectReportItem = (div_row)=>{
        mThis.div_report_list.find('.div-row').each(function(){
            $(this).removeClass('report-selected');
            mThis.setReportItemState($(this),'normal');
        });

        div_row.addClass('report-selected');
        
        div_row.find('i').removeClass('fa-list-alt').addClass('fa-check').css('color','green');

        //display selectd report name as header text on the Report Filter Panel on the right 
        mThis.selected_report_name.text(div_row.data('name'));

        //list of params or filter fields for a selected report
        let rpt_params = div_row.data('params'); 
        mThis.showReportFilters(rpt_params);
    }

    //Return a single report item as JSON. It is the currently selected report 
    this.getSelectedReport = ()=>{
        let div_row = mThis.div_report_list.find('.report-selected');
        return {
            'id':div_row.data('id'),
            'code':div_row.data('code'),
            'name':div_row.data('name')
        }
    }

    //Display report items from api
     this.loadReportItems = (onFinish)=>{
        vsapi.call(mThis.api_fetch_report_list,null).then(res=>{
            mThis.div_report_list.empty();

             let items = StringSanitizer.sanitizeObject(res.data,null,['params']);
             let i=0,c;

            do{
               c = items[i];
               if(!c) break;

               mThis.div_report_list.append(`
                       <div class="div-row" data-mid="${c.module_id}" data-params="${c.params}" data-category="${c.category}" data-code="${c.code}" data-name="${c.name}" data-id="${c.id}">
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
            if (typeof onFinish === 'function') onFinish({'wrapper':mThis.div_report_list});
            mThis.reports = items;
        });

    }
 
    //begin: custom function    
        this.init_custom = ()=>{}
    //end:: customer function 

    /** begin:: custom function to hide or show filter fields **/
       //example of rpt_params is "term_id|start_date|end_date
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
                 //Show the filter element (.e: textbox or select box) and also hide its label too. So go to parent element and hide the parent DIV
                 el.closest('div.form-group').show();
                 filter_count++;
             }else{
                 el.data('used',0);
                  //Hide the filter element (.e: textbox or select box) and also hide its label too. So go to parent element and hide the parent DIV
                 el.parent().parent().hide();
             }
        }); 

        mThis.div_filter_fields.show();
        if (filter_count === 0){
          mThis.no_filter_wrapper.show();
        }
     }
    /** end::custom function to hide or show filter fields **/

    //Return filter data in JSON format, depending on which filter (or param) is used (or not) by a currently selected report 
    this.getReportFilterData = ()=>{
        let p = {};
        mThis.div_filter_fields.find('.rpt-filter').each(function(){
            let el = $(this);
            let filter_is_used = el.data('used');
            if (filter_is_used){
               let field = el.data('field');
               p[field] = el.val();
            } 
        });

        return p;
    }
 
    this.show = (option, onClose= null)=>{
        if (!option) option={};
         mThis.onClose = onClose;
         //if "filter" is null => show all report names
         mThis.filter = option.filter;
         mThis.self.show().siblings().hide();
         main_view.setTitle(mThis.title_prop);
    }
    
    this.hide = function(){
        mThis.self.hide();
    }
}

$(document).ready(()=>{
    ReportCenterComponent.init();
});