"use strict";
let ItemGroupsComponent = new function(){
    let mThis = this;
    this.title_prop = 'Products Group';
    this.base_url = $('#__base_url').val();
    this.self = $('#_main_itemGroupsComponent');
    this.btnNew = $('#_pdg_btnNew');
    this.elSearchItem = $('#_pdg_search');
    // this.elFilter_department = $('#_msl_filter_service');
    this.tblItems = null;
    this.groupListView = null;

    this.form_data = {};

    this.col_titles = {
        "No":"No",
        "Code":"Code",
        "Name":"Name",
        "Description":"Description",
        "Created By":"Created By",
        "Action":"Action"
    };

    this.trans_title = (title_prop='undefined')=>{
        return (mThis.col_titles[title_prop]?mThis.col_titles[title_prop]:title_prop);
    }
    
    this.setLanguage = ()=>{
        if (LocaleManager.lang !== mThis.lang){
            for (let prop in mThis.col_titles){
                mThis.col_titles[prop] = LocaleManager.trans(prop,'items',LocaleManager.lang);
            }
            mThis.lang = LocaleManager.lang;
        }
    }

     this.group_columns = [
        // {
        //     title: mThis.trans_title("No"),
        //     data: (data,index,tr) => {
        //         return (index+1);
        //     }
        // },
        {
            title: mThis.trans_title("Code"),
            data: (data,a,b) => {
                return data.code?data.code:"N.A.";
            }
        },
        {
            data:(item,a,b) =>{
                return [`<div>${item.name}</div>`].join('');
            },
            title: mThis.trans_title('Name')
        },
        {
            title: mThis.trans_title('Description'),
            data:(data,a,b)=>{
                return data.description?data.description:"(No Description)";
            }
        },
        {
            title: mThis.trans_title('UOM'),
            data: "uom"
        },
        {
            title: mThis.trans_title('Created By'),
            data: "create_user"
        },
        {
            title:mThis.trans_title('Action'),
            data: function(item,a,b){
                return [`<div class="form-inline">`,
                `<a href="javascript:void(0)" class="btn_item_modify" data-id="${item.id}"><i class="fa fa-edit"></i></a> &nbsp;`,
                `<a href="javascript:void(0);" data-id="${item.id}" class="btn_item_delete"><i class="fa fa-trash" style="color:red"></i></a>`,
                `</div>`
                ].join('');
            }
        }
    ];

    this.init = () => {

        mThis.groupListView = new ListView('_pdg_list_container',{
         'fetchApi':`${main_view.base_url}/api/inventory/group/list-paginate`,
         'columns':this.group_columns,
         'tableClass':'table header-light-blue header-uppercase',
         'rowCreated':(data,index,tr)=>{
            tr.dataset.id = data.id;
         },
         'beforeRender':()=>{
            mThis.setLanguage();
         }
        });

        mThis.tblItems = $(mThis.groupListView.getTable());

        mThis.btnNew.on('click',(e)=>{
            let op = {
                onClose:(e)=>{
                     if(e){
                        mThis.groupListView.showPage(null);
                     }
                }
            };
            ItemGroupDialog.show(op);
        });

        mThis.tblItems.on('click','.btn_item_modify',function(e){
            let item_id = $(this).data("id");
            let op = {
                id:item_id,
                onClose:(e)=>{
                     if(e){
                        mThis.groupListView.showPage({'search_value':mThis.elSearchItem.val()});
                     }
                }
            };
            ItemGroupDialog.show(op);
        });

        mThis.tblItems.on('click','.btn_item_delete',function(e){
            let item_id = $(this).data("id");
            cv_interact.confirm(`Delete this department?`,{title:"Delete Department",context:"delete"},(yes)=>{
                if(yes){
                    let p = {"id":item_id};
                    vsapi.call(`${main_view.base_url}/api/inventory/group/delete`,p).then(res=>{
                       if(res.status_code === 200){
                          mThis.groupListView.showPage({'search_value':mThis.elSearchItem.val()});
                       }else cv_interact.error(res.error_message);
                    });
                }
            });
        });

        mThis.elSearchItem.on('keyup',(e)=>{
            mThis.groupListView.showPage({'search_value':mThis.elSearchItem.val()});
        });

        // this.cfg = new ExpandableRowConfig('_pdg_tblProductGroup', {
        //     'dontExpandByClickingOn': ['btn_item_modify', 'btn_item_delete', 'btn_item_action'],
        //     //'content':`<div class="alert alert-info">Loading details</div>`,
        //     'onOpen': (container, detail_tr, parent_tr) => {
        //         //alert(detail_tr.find('ul').html());
        //         let q_tr = $(parent_tr);
        //         //It is IMPORTANT to access patient_id using jquery object here because the "createdRow" event passes data-id atttribue using jquery method
        //         let group_id = q_tr.data('id');  
        //         //Show Expandable Details of each rate
        //         mThis.displayProductsGroupDetails($(detail_tr),group_id);
        //     }
        // });
    }

    this.displayProductsGroupDetails = (detail_tr, group_id=0)=>{
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0"></div>');
        let p = {'id':group_id};
        window.vsapi.call(`${main_view.base_url}/api/inventory/group-details`,p,'POST',false).then((res)=>{ 
          let html=null;
          let canvas_Barid = null, canvas_Pieid = null, canvas_Doughnutid = null;
          if (res.status_code === 200){
            let d = StringSanitizer.sanitizeObject(res.data);
            canvas_Barid = `_pdg_SmbarChart_${group_id}`;
            canvas_Pieid = `_pdg_SmpieChart_${group_id}`;
            canvas_Doughnutid = `_pdg_SmdoughnutChart_${group_id}`;

            html = [`<div class="row py-2 w-100 gy-2">
                <div class="col-xl-4">
                    <div class="shadow-sm rounded w-100 py-2">
                        <canvas id="${canvas_Barid}"></canvas>
                    </div>
                </div>
                <div class="col-xl-4">
                    <div class="shadow-sm rounded w-100 py-2">
                        <canvas id="${canvas_Pieid}"></canvas>
                    </div>
                </div>
                <div class="col-xl-4">
                    <div class="shadow-sm rounded w-100 py-2">
                        <canvas id="${canvas_Doughnutid}"></canvas>
                    </div>
                </div>
            </div>`].join('');
          }
          else{
            html =`<div class="expanded-row-error">${error_message}</div>`;
          }
          div_wrapper.html(html);
          let bardata = [12, 74, 63], piedata = [10, 20, 30, 74, 45, 93], doughnutdata = [10, 47, 63, 65, 43, 48];
          if(canvas_Barid) this.initBarChart(canvas_Barid,bardata);
          if(canvas_Pieid) this.initPieChart(canvas_Pieid,piedata);
          if(canvas_Doughnutid) this.initDoughnutChart(canvas_Doughnutid,doughnutdata);
        });
    }

    this.initBarChart = (canvas_id,data) => {
        new Chart(canvas_id,{
            type: 'bar',
            data: {
                labels: ['January','February','March'],
                datasets: [{
                    data: data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales:{
                    yAxes: [{
                        ticks: {
                          beginAtZero: true
                        }
                    }],
                },
                legend: {
                    display: false
                }
            }
        });
    }

    this.initPieChart = (canvas_id,data) => {
        new Chart(canvas_id,{
            type: 'pie',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(0, 255, 255, 0.6)',
                      'rgba(255, 0, 255, 0.6)',
                      'rgba(0, 191, 255, 0.6)'
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(0, 255, 255, 1)',
                      'rgba(255, 0, 255, 1)',
                      'rgba(0, 191, 255, 1)'
                    ],
                    borderWidth: 1
                }],
                labels: ['Labotory', 'Skin Car', 'Surchery']
            },
            options: {}
        });
    };

    this.initDoughnutChart = (canvas_id,data) => {
        new Chart(canvas_id,{
            type: 'doughnut',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 191, 255, 0.6)'
                    ],
                    borderWidth: 1
                }],
                labels: ['Labotory', 'Skin Car', 'Surchery', 'Selling Products']
            },
            options: {}
        });
    }

     
    this.show = (options=null) => {
        if(!options) options={};
        mThis.options = options;
        mThis.groupListView.showPage(null,null,() => {
            main_view.setTitle(mThis.title_prop);
            mThis.self.show().siblings().hide();
        });
    }
}

//begin::ItemGroupDialog
let ItemGroupDialog = new function(){
    let mThis = this;
    this.self = $(`#_pdg_dlgProductGroup`);
    this.elTitle = $('#_pdg_dlgProductGroup_title');
     this.elCat = $(`#_pdg_dlgProductGroup_cat`);
     //elUnit
     this.elUOM = $(`#_pdg_dlgProductGroup_unit`);
     this.elBrand = $(`#_pdg_brand`);
     this.elManufacturer = $(`#_pdg_manufacturer`);
     this.btnSave = $('#_pdg_dlgProductGroup_btnSave');
     
     this.uom_label = new OptionEditor('_pdg_label_uom',{
         "selectElement":mThis.elUOM,
         'label':"UOM",
         "buttons":['add','delete'],
         "value_field":"uom",
         "text_field":"uom",
         "dataprop":"units",
         "langprop":"item_group",
         "apiSave":{
            "endpoint":`${main_view.base_url}/api/inventory/settings/save-uom`
            ,"params":(oldValue,newValue)=>{
                return {'uom':newValue,"item_class":"MI"};
            }
         },
         "apiDelete":{
            "endpoint":`${main_view.base_url}/api/inventory/settings/delete-uom`
         }
     });

     this.band_label = new OptionEditor('_pdg_label_brand',{
        "selectElement":mThis.elBrand,
        'label':"Brand",
        "text_field":"brand_name",
        "dataprop":"brands",
        "langprop":"item_group",
        "apiSave":{
            "endpoint":`${main_view.base_url}/api/inventory/settings/save-brand`
        },
        "apiDelete":{
            "endpoint":`${main_view.base_url}/api/inventory/settings/delete-brand`
        }
    });

    this.uom_label = new OptionEditor('_pdg_label_manufacturer',{
        "selectElement":mThis.elManufacturer,
        'label':"Manufacturer",
        //"buttons":['add','edit','delete'],
        "langprop":"item_group",
        "text_field":"manufacturer",
        "dataprop":"manufacturers",
        "apiSave":{
            "endpoint":`${main_view.base_url}/api/inventory/settings/save-manufacturer`,
        },
        "apiDelete":{
            "endpoint":`${main_view.base_url}/api/inventory/settings/delete-manufacturer`
        }
    });
     
     this.btnSave.on('click',e=>{
        let p = mThis.getFormData();
        vsapi.call(`${main_view.base_url}/api/inventory/group/save`,p,null,false).then(res=>{
           if(res.status_code ===200){
              if (typeof mThis.onClose ==='function') mThis.onClose(true);
              mThis.self.modal('hide');
           }else cv_interact.warning(res.error_message); 
        });
     });

     this.setFormData =(d)=>{
        d = d?d:{};
        mThis.id = d.id;
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('img')) p[f] = el.prop('src',d[f]);
            else if(el.is('select')) el.val(d[f]).trigger('change');
            else el.val(d[f]);
        });
     }

     this.getFormData = ()=>{
        let p ={};
        mThis.self.find('.data-input').each(function(){
            let el = $(this);
            let f = el.data('field');
            if(el.is('img')) p[f] = el.prop('src');
            else p[f] = el.val();
        });
        p.id = mThis.id;
        return p;
     }

     this.prepareFormOptions = (id,onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/inventory/group/form-options`,{'id':id}).then(res=>{
            if(res.status_code===200){
                const group = res.data.group;
                res.data.group = null;
                let d = StringSanitizer.sanitizeObject(res.data);
                d.group = group;
                VSUtil.setComboItems(mThis.elCat,d.categories,'id','category',true,'(Category)',null);
                VSUtil.setComboItems(mThis.elUOM,d.units,'uom','uom',true,'(UOM)',null);
                VSUtil.setComboItems(mThis.elBrand,d.brands,'id','brand_name',true,'(Brand name)',null);
                VSUtil.setComboItems(mThis.elManufacturer,d.manufacturers,'id','manufacturer',true,'(Manufacturer)',null);
                //if (id>0) d.group is available
                onFinish(d);
            }
        });
    }

    this.show = (options)=>{
        options = options?options:{};
        mThis.onClose = options.onClose;
        mThis.prepareFormOptions(options.id,(d)=>{
         let title = "New Product Group";  
         if(d.group){
             title = "Modify Product Group";  
             mThis.setFormData(d.group);
         }else{
            mThis.setFormData(null);
         }

         mThis.elTitle.text(LocaleManager.trans(title,"titles"));   
         mThis.self.modal({
            'backdrop':'static'
         });
       });
    }
}
//end::ItemgroupDialog
 
window.addEventListener('DOMContentLoaded',e=>{
    ItemGroupsComponent.init();
});