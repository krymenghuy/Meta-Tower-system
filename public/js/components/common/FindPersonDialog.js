"use strict";
const FindContext = (()=>{
   const self = {};

    self.fetchApis = {
        "staff":`${main_view.base_url}/api/employee/find`,
        "employee":`${main_view.base_url}/hr/employee/list`,
        // "parent":`${main_view.base_url}/api/guardian/find`,
        //"user":`${main_view.base_url}/api/user/find`  
    };  

    self.getTitle = (role)=>{
       switch(role){
          case  'sfaff':
          case 'employee':  
            return "Find Staff";
          default:{
            return 'Find Someone'
          }  
       }
    };

    self.getColumns = (role)=>{
        switch(role){
            case 'staff': 
            case 'employee':
               {
                   return [
                     {
                        title:"Emp_ID",
                        data:"id"
                     },
                    {
                        title:"ID",
                        data:"code"
                     },
                     {
                        title:"Name",
                        data:"name"
                     },
                     {
                        title:"Sex",
                        data:"sex"
                     },
                     {
                        title:"Email",
                        data:"email"
                     },
                     {
                        title:"Position",
                        name:"position",
                        data:(data,index,tr)=>{
                           return [`<span class="text-primary">`,data.position_id,` </span>`].join('');
                        } 
                     },
                   ];
                   
               }
               
            case 'user':  
            case 'login':{
                return [
                     {
                        title:"Login",
                        data:"login_name"
                     },
                     {
                        title:"Full Name",
                        data:"full_name"
                     },
                     {
                        title:"Type",
                        data:"user_class"
                     },
                     {
                        title:"Role",
                        data:"role"
                     },
                     {
                        title:"email",
                        data:"email"
                     },
                     {
                        title:"Phone",
                        data:"phone_number"
                     }
                   ];
            }
            default:{
               return [];
            } 
         }
    };


    self.getContext = (role)=>{
        return {
            "title": self.getTitle(role),
            "columns": self.getColumns(role),
            "fetchApi":self.fetchApis[role],
        };
    };

    return self;
})();

const FindPersonDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        //let dTitle = 'Find Someone';
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-lg",
            createContent:(me)=>{
                return [
                  `<div class="d-flex flex-column">`,
                      `<div class="d-flex">`,
                        `<input name="search_value" class="form-control" placeholder="Search" />`,
                      `</div>`,
                      `<div class="w-100">`,
                         `<table name="tblPersons" id="tblPersons" class="table mt-3">`,
                             
                         `<thead></thead><tbody></tbody>`,
                         `</table>`,
                       `</div>`,
                   `</div>`,
               ].join('');
            },
            contentCreated:(me)=>{
                me.renderColumns = (tbl, cols) => {
                  
                    const thead = tbl.querySelector('thead');
                    const tbody = tbl.querySelector('tbody');
                    thead.innerHTML = '';
                    tbody.innerHTML = '';
                    let rows =``;
                    let html = '';
                    cols.map(c =>{
                        html = [html, '<th>',c.title,'</th>'].join('');
                    });
                    thead.innerHTML = ['<tr>',html,'</tr>'].join('');
                    
                    rows = [rows ,`<tr>
                                 <td colspan="100%" >
                                    <span class="d-flex align-items-center justify-content-center">Search for someone here</span>
                                 </td>
                              </tr>`].join('');
                    tbody.innerHTML = rows;
                    // tbody.addEventListener('click', function(event) 
                    tbody.onclick = (event) =>{
                     let tr = VSUtil.closestLimited(event.target,'tr');
                     if (tr) {
                        tr.classList.toggle('row-selected'); 
                        if(me.dataOptions.singleSelect && tr.classList.contains('row-selected')){
                           if(me.prev_selected_tr) me.prev_selected_tr.classList.remove('row-selected');
                        }
                        me.prev_selected_tr = tr;
                     }
                  };
                };
              
               me.getSelection = (tbl, cols)=>{
                 //const tbl = me.controls.tblPersons;
                 //const context = FindContext.getColumns(me.dataOptions.role);`
                 let tbody = tbl.querySelector('tbody');
                 let ps = [];
                 let tds = null;
                 tbody.querySelectorAll('tr').forEach(tr =>{
                     if(tr.classList.contains('row-selected')){
                        tds = tds||tr.querySelectorAll('td') 
                        let item = {};
                        tds.forEach(td=>{
                           item[td.dataset.name] = td.textContent;
                        });
                        item.emp_id = tr.dataset.id;
                        item.id = tr.dataset.id;
                        ps.push(item);
                     }
                 });
                 return ps;
               }

               me.beginSearch = (search_value,tbl,context) =>{
                   let p = {"search_value":search_value};
                   vsapi.call(context.fetchApi,p,false,false).then(res =>{
                     let data = res.status_code ==200 ? res.data : [];
                     me.renderItems(data,tbl,context.columns);
                   });
               }

               me.renderItems = (data,tbl,cols)=>{
                  const tbody = tbl.querySelector('tbody');
                   tbody.innerHTML = '';
                   let index =0;
                   let html = '';
                   data.map(item =>{
                     let row_html ='';
                        cols.map(c =>{
                           let name = c.name;
                           let val = typeof c.data == 'function' ? c.data(item,index) : (item[c.data || c.name]);
                           
                           row_html = [row_html,'<td data-name="',name,'">',val,'</td>'].join('');
                        });
                        html += ['<tr data-id="',item.id,'">',row_html,'</tr>'].join('');
                        index++;
                   });
                   tbody.innerHTML = html;
               }

               me.controls.search_value.onkeyup = e =>{
                  setTimeout(()=>{
                     me.beginSearch(e.target.value,me.controls.tblPersons,me.context);
                  },300);
               };
            },
            // extendMethods:{
            //     "getData":(me,dataOptions)=>{
            //        return {"photo":me.controls.userImageBox.getImage()};
            //     }
            // },
            prepareFormOptions:{
               createTitle: "Find Someone",
            },
            onPrepareForm:(me,data,fields,divModal)=>{
               const context = FindContext.getContext(me.dataOptions.role);
               me.context = context;
               divModal.querySelector('.modal-header').classList.add('border-0','pb-0');
               divModal.querySelector('.modal-footer').classList.add('border-0','pt-0');
               me.renderColumns(me.controls.tblPersons, context.columns);
               const elTitle = divModal.querySelector('.modal-content .modal-title');
               if(elTitle){
                  elTitle.textContent = context.title; 
               }
               LocaleManager.translateZone(me.divModal);
            },
            buttons:[
               {
                 label:"<span>Cancel</span>",
                 cssClass:"btn btn-warning",
                 click:(me)=>{
                    me.hide(false);
                 }
               },
               {
                label:'<span vslang="DataTransferItemList.OK"></span>',
                cssClass:'btn btn-primary',
                click:(me)=>{
                  me.context = me.context || FindContext.getContext(me.dataOptions.role);  
                  const p = me.getSelection(me.controls.tblPersons,me.context.columns);
                  if (!p || !p[0]){
                     cv_interact.warning('No one is selected!');
                     return;
                  }
                  const d = me.dataOptions.singleSelect ? p[0]: p;
                  me.hide(true,d);
                }
              }  
            ],
        
         });
        dialog.show(op);
     }

   return self;
})();