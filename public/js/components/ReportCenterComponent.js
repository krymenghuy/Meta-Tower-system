'use strict'
let ReportCenterComponent = new function(){
    let mThis = this;
    this.title_prop ="Report Center";
    this.self = $('#_rpc_reportCenterComponent');
    this.base_url = $('#__base_url').val();
    this.api_fetch_report_list = [this.base_url,'/api/report-center/report-list'].join('');
    this.api_fetch_report_filter_options = [this.base_url,'/api/report-center/filter-options'].join('');

    this.api_fetch_level = [this.base_url,'/api/getComboItems_level'].join('');
    this.report_url =[this.base_url,'/api/genreport'].join('');

    this.div_report_list = $('#_rpc_reportlist');
    this.div_filter_fields = $('#_rpc_filter_fields');
    this.no_filter_wrapper = $('#_rpc_no_filter_text_wrapper');
    this.selected_report_name = $('#_rpc_selected_report_name');

    this.btnRunReport = $('#_rpc_btnRunReport');
 
    //Array list of filter field objects {name,element,value_field,text_field}
    this.filter_fields = [
       {
          element:$('#_rpc_filter_user'),
          'name':'users',
          'value_field':'user_id',
          'text_field':'user_name'
       }
    //   , {
    //     element:$('#_rpc_filter_program'),
    //     'name':'programs',
    //     'value_field':'program_id',
    //     'text_field':'program_name'
    //   }
    ];
 
    this.init = ()=>{
        mThis.loadReportItems();

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
            window.open(`${mThis.report_url}?${qstring}${sp}rptcode=${rpt.code}`,'_blank');
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
         vsapi.call(mThis.api_fetch_report_list,null).then((res)=>{ 
            
             mThis.div_report_list.empty();
             let items = [];

             if (res.status_code ===200){
                items = res.data;
             }else{
                mThis.div_report_list.append(`<span>No report options have been configured</span>`);
             }

             let i=0,c;
           
             //alert(JSON.stringify(items));
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

             if (typeof onFinish ==='function') onFinish();
             mThis.reports = items;

         });
    }

     
        //loadReportFilterOptions() based on the defined array "mThis.filter_fields" (that is a list of filter field objects)
        this.loadFilterOptions = (def ={},onFinish=null)=>{
            if(!def) def = {};
            vsapi.call(`${mThis.api_fetch_report_filter_options}`,null).then((d)=>{
               
               //Cashiers or receivers 
               d.users = StringSanitizer.sanitizeObject(d.users);
               mThis.filter_fields.map((e,i)=>{
                  VSUtil.setComboItems(e.element,d[e.name],e.value_field,e.text_field,true,'(All)',def[e.value_field]);
               });

               if (typeof onFinish ==='function') onFinish();
            });
        } 
 
    //begin: custom function    
        this.init_custom = ()=>{
            let elProgram = $('#_rpc_filter_program');
            let elLevel = $('#_rpc_filter_level');

            elProgram.on('change',(e)=>{
                let p = {'program_id':elProgram.val()}; 
                vsapi.call(mThis.api_fetch_level,p).then((res)=>{
                    if(res.status_code===200){
                        let levels = res.data;
                        VSUtil.setComboItems(elLevel,levels,'level_id','level_name',null);
                    }
                });

            });
            
        }
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
                 el.parent().parent().show();
                 filter_count++;
             }else{
                 el.data('used',0);
                  //Hide the filter element (.e: textbox or select box) and also hide its label too. So go to parent element and hide the parent DIV
                 el.parent().parent().hide();
             }
        }); 

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
 
         mThis.loadFilterOptions({},()=>{
            mThis.self.show().siblings().hide();
            main_view.setTitle(mThis.title_prop);
         });
        
    }

    this.hide = function(){
        mThis.self.hide();
    }

}

$(document).ready(()=>{
    ReportCenterComponent.init();
});

