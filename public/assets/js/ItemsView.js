"use strict";

/**** Dependencies
   - vsdom.js
   - vsutil.js for VSUtil.setSelect2_value(), setComboItems()
   - string_san.js,
   - LocaleManager.js for transaction. LocaleManager.trans()
****/
class ItemsView{

    /***
     options = {
        tableClass:'table',
        'numeroFormatter':function(numero,data) => { ... },
        'numeroHeaderText':"Numero",
        "rowClass" is the default row tr's class,
        "validateColumns":['name','qty','price'] This is to validate columns "name","qty","price" before allowing user to add new row
        columns:[
            {
                field:'name',
                title:'',
                dataType:'number',
            }
        ],

     } 
     ****/
     constructor(div_id,options=null){
        options=options?options:{};
        options.tableClass = options.tableClass?options.tableClass:'table header-light-blue header-uppercase';
        //Use dt_columns as default langProp
        if(!options.langProp) options.langProp ="dt_columns";
        
        //set default maxRows, Maximum rows to 15 rows
        this.maxRows = options.maxRows>0? options.maxRows:15;

        if(!options.addLineButtonClass) options.addLineButtonClass = 'btn btn-sm btn-primary';
        if(!options.addLineButtonText) options.addLineButtonText ='Add Line';
        
        if(this.isUndefined(options.showAddLineButton)) options.showAddLineButton = true;  
        if(this.isUndefined(options.showColumnHeaders)) options.showColumnHeaders = true;
 
        if(!options.columns) options.columns = this.getDefaultColumns(); 
        this.options = options;
        if (typeof(this.options.onItemChange) != 'function') this.options.onItemChange = (e)=>{ return;};
        if (typeof(this.options.onItemValidated) != 'function') this.options.onItemValidated = (e)=>{ return;};

        if(!this.options.onKeyUp) this.options.onKeyUp = this.options.keyup;
        if (typeof(this.options.onKeyUp) != 'function') this.options.onKeyUp = (e)=>{ return;};
        if (typeof(this.options.onInputChange) != 'function') this.options.onInputChange = (e)=>{ return;};
        if (typeof(this.options.onItemDeleted) != 'function') this.options.onItemDeleted = (e)=>{ return;};
        if (typeof(this.options.totalChange) != 'function') this.options.totalChange = (e)=>{ return;};

        this.self = document.querySelector(`#${div_id}`);
 
        this.table_id =`${div_id}_tblItems`;
        let addLineText = this.options.addLineButtonText;
        if(LocaleManager) addLineText = LocaleManager.trans(addLineText,this.options.langProp);
        let addLineButton_html = `<button class="${this.options.addLineButtonClass} btn-item-addline trans-text" type="button" data-langprop="${this.options.langProp}.${this.options.addLineButtonText}">${addLineText}</button>`;
        if(this.options.showAddLineButton != true) addLineButton_html ='';

        //NOTE: important to set "div.style.width =100%"" here for tprocessColumnWidths() to work correctly
        //function processColumnWidths() will determines width of each column as percentage
        this.processColumnWidths(this.options.columns);
        //console.error(JSON.stringify(this.options.columns)); 
        this.self.innerHTML =[
            `<div style="width:100%" id="${this.table_id}_wrapper"><table id="${this.table_id}" class="${options.tableClass}">`,
                this.createColumnHeaders_html(this.options.columns),
                `<tbody id="${this.table_id}_body"></tbody>`,
            `</table></div>`,
            `<div id="${this.table_id}_footer" class="form-inline">${addLineButton_html}</div>`
         ].join('');
        
        //this.self.appendChild(document.createTextNode(html));
        
        this.table = document.querySelector(`#${this.table_id}`);
        this.table_body = this.table.querySelector(`#${this.table_id}_body`);
        this.div_footer = document.querySelector(`#${this.table_id}_footer`);
 
        //Add initial empty Row
        this.addRow(null,0,false);
        
        let that = this;
        this.table.addEventListener('change',(e)=>{
          if(e.target.classList.contains('td-input')){
             let td = VSDOM.getClosestParentByType(e.target,'TD');
             let tr = td.parentNode;
             let item = that.getDataRow(tr);
             if (that.validateRow(tr,that.options.validateColumns,true)) that.options.onItemValidated(tr.dataset.id,item,tr); 
             that.options.onInputChange(e.target,td.dataset.name,td); 
          }
        });

        this.table.addEventListener('click',(e)=>{
            let tr = VSDOM.getClosestParentByType(e.target,'TR');
            if(tr){
                
                //Check if the clicked target was a link (<a href="#">)
                let el = VSDOM.getClosestParentByClass(e.target,'btn-item-delete');             
                if (el){
                        let that = this;
                        cv_interact.confirm("Delete this item?",{title:'Delete Item',OKButtonText:'Delete',context:'delete'},
                            (e)=>{
                              if(e){
                                  that.options.onItemDeleted(tr.dataset.id,tr); 
                                  tr.remove();
                                  that.resetNumero();
                                  that.displayEmptyMessage();
                                }
                            }
                         );
                     //return;  
                }else{
                   //If user click within INPUT (input.td-input or SELECT boxes)
                   if (e.target.classList.contains('td-input')){
                      e.target.select();
                      e.target.focus();
                   }else{
                       //begin edit row (change Row's state to "Editing mode" only if user Do not click on any link inside tr (row) )
                       this.changeRowState(tr,'edit');
                   }
                      
                }   

            } else {
               //Click outside row (tr)
               if (this.prev_edit_row) this.changeRowState(this.prev_edit_row,'readonly');
            } 
        });

        this.div_footer.addEventListener('click',(e)=>{
            e.preventDefault();
            let el = VSDOM.getClosestParentByClass(e.target,'btn-item-addline');        
            if (el){
                //true = validate cell inputs base on the given prop "validateColumns"
                //last param is "user_action_add" = true => it means when user click Add Line button
                this.addRow(null,null,true,true);
                //alert(JSON.stringify(this.getItems()));
                //this.resetNumero(); //addRow() will also resetNumero()
            } 
        });
   
        // document.addEventListener('click',(e)=>{
        //     e.preventDefault();
        //     alert('click doc');
        // });

        // this.table_body.addEventListener('focus',(e)=>{
        //    e.preventDefault(); 
        //    alert(typeof e.target);
        // });

        // this.table_body.addEventListener('blur',(e)=>{
        //     if(typeof (e.target) ==='TR') {
        //         if (this.prev_edit_row) this.changeRowState(this.prev_edit_row,'readonly');
        //     }
        // });

     }

     isUndefined(d){
      if (d ==undefined || d ==null || d=='undefined') return true;
      return false;
     }

     //set maximun height of tbody in terms of Number of rows (tr)
     setMaxHeightRows(row_count=5,current_row_count=0){
        if(this.has_scroll) return; 
        let tbody = this.table_body;
        let thead = this.table.querySelector('thead');

        let row_height = tbody.rows[0]?tbody.rows[0].offsetHeight:60;
        if(row_height==0) row_height=60;
        current_row_count =current_row_count>0?current_row_count: tbody.rows.length;
        //console.error(`Current_rows = ${current_row_count} VS row_count =${row_count}`);
        
        if (current_row_count > row_count) {
          let tbodyHeight = parseFloat(row_height) * parseFloat(row_count);
          //console.error(`tbodyHeigt = ${tbodyHeight} rowHeight =${row_height} currentRowCount =${current_row_count}`);
          this.table.style.display = 'block';
          this.table.style.width = '100%';
          this.table.style.tableLayout = 'fixed';
          this.table.style.height = `${tbodyHeight + thead.offsetHeight}px`;
          this.table.style.overflowY = 'hidden';
          tbody.style.display = 'block';
          //tbody.style.width = '100%';
          tbody.style.height = `${tbodyHeight}px`;
          tbody.style.overflowY = 'scroll';
          //set this.has_scroll to true. "has_scroll" indicates whether the current Items table has scroll or not (for Fixed header style only) 
          this.has_scroll = true;
        }
        return;
     }
        
     //set maximun height of tbody in terms of Number of rows (tr)
     setMaxHeightPixel(max_height=350){
        let tbody = this.table_body;
        tbody.style.height = max_height; // Change this to the desired fixed height
        tbody.style.overflowY = 'scroll';
        return;
     }

     displayEmptyMessage(){
        if (this.options.emptyMessage){
          let el = this.table_body.firstChild;
          //if there is no rows remaining => then add empty-row, if the "this.options.emptyMessage" is supplied
            if(!el) {
              let empty_row = document.createElement('tr');
              empty_row.classList.add('empty-row');
              empty_row.innerHTML = `<td colspan="100%">${this.options.emptyMessage}</td>`;
              this.table_body.appendChild(empty_row);
            }
        }
     }

     resetNumero(){
       let index =0;
       let that = this;
       this.table_body.querySelectorAll('tr').forEach(tr=>{
             let num = "";
             //tr.dataset.index = index;
             if (typeof that.options.numeroFormatter ==='function') 
                num = that.options.numeroFormatter(index+1,null);
             else
                num = index +1;

             let td = tr.querySelector('td.item-numero');
             if (td) td.innerHTML = num; 
          index++;
       }); 
     }

     getColumnPropsByName(colName =''){
        let i=0,c;
        do{
          c = this.options.columns[i];
          if(!c) break;
           if(c.name == colName) return c;
          i++;
        }while(c);
        return null;
     }

     //Change row's state to {'edit','readonly'}
     changeRowState(tr,state='edit'){
       if (state==='edit'){
        if (this.prev_edit_row && this.prev_edit_row !== tr){
            this.changeRowState(this.prev_edit_row,'readonly');
        }
        if(tr.dataset.editing==1) return;
         
        tr.querySelectorAll('td').forEach(td => {
            let col_name = td.dataset.name;
            let text = td.dataset.text;
            let value = td.dataset.value;
            if(!text) text= value;
          //let data_type = td.dataset.datatype;
           
          //let display_type = td.dataset.displaytype;
            let col = this.getColumnPropsByName(col_name);
            if(col){
                let def_class ='form-control';
                let select2_cssClass ='modal-select3';
                let is_read_only= "";
                if (col.readOnly){
                   if(col.displayType === 'select') is_read_only="disabled";
                   else is_read_only="readonly";
                }
                if(!col) throw `Error ItemsView.getColumnPropsByName(@colName) failed to find column by name ${col_name}`;
                col.cssClass =col.cssClass?col.cssClass:'';
                let html = `<input style="width:100%" type="text" class="${def_class} ${col.cssClass} td-input" value="${text}" ${is_read_only}/>`;
                
                //If there is col.selectOptions => then set displayType = 'select'
                if (col.selectOptions) col.displayType ='select';

                if (col.displayType ==='select'){
                    if(!col.selectOptions) col.selectOptions = col.selectItems;
                    col.selectOptions = col.selectOptions?col.selectOptions:[];
                    let el = document.createElement('select');
                    el.style.width ='100%';
                    el.classList.add(select2_cssClass,`td-input`);
                    el.innerHTML = this.createSelectOptions(col_name,null);
                    td.innerHTML=null;
                    td.appendChild(el);
                    this.initSelect2(el,td,{"value":value,"width":"100%",items:col.selectOptions});
                    // html = [`<select class="${select2_cssClass} td-input" value="${value}" ${is_read_only}>`,
                    //         this.createSelectOptions(col_name,value),
                    //       `</select>`].join('');
                     
                }else {
                    //Set detault data type to string
                    if(!col.dataType) col.dataType ='string';
                    if (col.dataType ==='date'){
                       //So far, use default HTML input type="date"
                       html = `<input style="width:100%" type="date" class="${def_class} ${col.cssClass} td-input" value="${text}" data-select="datepicker" ${is_read_only}/>`;
                    }else if (col.dataType ==='time'){
                      html = `<input style="width:100%" type="date" class="${def_class} ${col.cssClass} td-input" value="${text}" data-select="datepicker" ${is_read_only}/>`;
                    }else{
                      let dType = (col.dataType ==='string')? 'text':'number';

                      //Set detault editor value to zero for Number field 
                      if(dType==='number' && !text) text="0"; 
                      html = `<input style="width:100%" type="${dType}" class="${def_class} ${col.cssClass} td-input" value="${text}" ${is_read_only}/>`;
                    }
                    td.innerHTML= html;   
                }
                //If the displayType is SELECT,and we use select2 with "modal-select2" class => so we need to init select2 script to transform standard SELECT to SELECT2
                
                // if (col.displayType ==='select'){
                //     let cb = td.querySelector('select.td-input');
                //     this.initSelect2(cb,td,{"value":value,"width":col.width});
                // }
                
            } 
            ////this.adjustHeaderWidths();
         });
         
         let that = this;
         tr.querySelectorAll('td>input.td-input').forEach(el=>{
            if(el.nodeName ==='INPUT'){
                el.addEventListener('keyup',e=>{
                  let td = VSDOM.getClosestParentByType(e.target,'TD');
                  that.options.onKeyUp(e,td.dataset.name,td);
                });
            }
         });

         tr.dataset.editing =1;
         this.prev_edit_row = tr
          
       }else{
         //Change row state to "readonly"
         tr.querySelectorAll('td').forEach(td => {
           let el = td.querySelector('.td-input');
           if(el){
              let col_name = td.dataset.name;
              let value = el.value;
              let text = el.value;
              let col = this.getColumnPropsByName(col_name);
              if(!col) throw "Error ItemsView.getColumnPropsByName(@colName) failed to find column by name " + col_name;
              let html = text;
              
              if(col.displayType ==='select'){
                  value = el.value;
                  text = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text:'';
                //   let select2_dropdowns = td.querySelectorAll('.select2-container');
                //   select2_dropdowns.forEach(d =>{
                //     d.classList.add('hidden');
                //   }); 
              }

              //set default numeric value to zero | default value
              if(col.dataType==='number' && !value) value =0; 
              if (col.isPercentage || col.displayAsPercentage) 
                html = [value,'%'].join('');
              else{
                 if (col.currencySymbol) 
                    html = [col.currencySymbol,text].join('');
                 else html = text;   
              }
              td.innerHTML = html;
              if(this.prev_edit_row) this.prev_edit_row.dataset.editing = 0;
              this.prev_edit_row = null; 
              
              td.dataset.value = value;
              td.dataset.text = text;
           }

         });

       }

     }

     initSelect2(el,td,op={}){
        if(!el) return;
        //op.value=null,op.items =null
        let select2_dropdowns = td.querySelectorAll('span.select2-container');
        select2_dropdowns.forEach(d =>{
                  if(d){
                    if(d.classList.style) d.classList.style.display='none';
                  }
        });

            let x = $(el);
            if(op.items) VSUtil.setComboItems(x,op.items,'value','text',null,null,null);

            let init_op ={width:'100%'};
            if(op.width) init_op.width =op.width; 
            x.select2(init_op);

            if(op.value !== undefined){
              el.value = op.value;
              td.dataset.value =op.value;
              x.val(op.value).trigger('change');
            }
            //x.val(op.value);

            let that = this;
            //x.off('change') is important to avoid dubplicate event firing. "onItemChange"
            x.off('change').on('change',e=>{
              e.preventDefault();
              let nextSib = el.nextSibling;
              //We can also use "if (nextSib) ..." in order to avoid error when nextSib is NULL
              //if(nextSib){
                 //console.error(nextSib.innerHTML);
                  nextSib.querySelector('.select2-selection__rendered');
                  let span = nextSib.querySelector('.select2-selection__rendered');
                  if(span){
                    let item_text = x.find('option:selected').text();
                    span.setAttribute('title',item_text);
                    span.textContent = item_text;
                  }
             //}
            
              let tr = td.parentNode;
              let row_id = tr.dataset.id; //tr?tr.dataset.id:null;
              let new_item = this.getDataRow(tr);
              if (that.validateRow(tr,that.options.validateColumns,true)) that.options.onItemValidated(row_id,new_item,tr); 
              that.options.onItemChange(row_id,new_item,td.dataset.name,td,tr); 
            });
     }
  
     //@items is array = [{value,text}, {value,text}, ...] 
     setSelectOptions(col_name='', items=[],selectedValue=null){
       let col = this.getColumnPropsByName(col_name);
       if(col){
         col.displayType = 'select';
         col.selectOptions = items;
         col.selectedValue = selectedValue;

         if (this.prev_edit_row){
            //ivc stands for "Item View Column"
            let td = this.prev_edit_row.querySelector(`td.ivc-${col_name}`);
            if(td){
              let cb = td.querySelector(`select.td-input`);
              if(cb) this.initSelect2(cb,td,{value:selectedValue,items:col.selectOptions,width:"100%"});
              //cb.setAttribute('disabled',false);
            }
           
         }
         
         return true; 
       }
       //console.error(`Eror: at ItemViews =>setSelectOptions failed to find column named ${col_name} for setting select options`);
       return false;
     }
     
     getCurrentRow(){
        return this.prev_edit_row;
     }

     //setColumnValue() | setValue()
     setCellValue(tr,col_name=null,value=null){
       if(!col_name) return null;
       let td = tr.querySelector(`td.ivc-${col_name}`);
       if(td){
         let input = td.querySelector('.td-input');
         if(input){
            if(td.dataset.editortype==='select'){
                $(input).val(value).trigger('change');
            }else{
                input.value = value;
            } 
         }else {
           //In case of Non-Editing Mode (View only)
           td.innerHTML = value;
         }
        
       }

     }

     /** 
          @check_cols = ['name','price','qty'];
       or @check_cols = ['name|string','price|number','qty|positive'];
      *  **/
     //validateCols()
     validateRow(tr=null,validateColumns=null,silent_mode=false){
        if(!tr) tr=this.prev_edit_row;
        //if (this.self.getAttribute('id') ==='_consult_cc_list') 
        if(!tr) return true;
        if (!validateColumns) return true;
        //  let check_cols1 = [];
        //  (check_cols || []).map(rule=>{
        //     let parts = (rule+'').split('|');
        //     let f_name = parts[0];
        //     let v_item = {"col_name":f_name,};
        //     if(f_name) check_cols1.push({f_name}); 
        //  });

        //if (!tr.children[1].dataset.value) return false;

        let validate_succeed =true;
        let cols =[];
        tr.querySelectorAll(`td`).forEach(td=>{
           let col_name =td.dataset.name;
           let v_rule = validateColumns[col_name];

           if(v_rule){
            cols.push(col_name.replace(/_/g,' '));
            if(typeof(v_rule)==='function')
            {
              let input = td.querySelector('.td-input');
              let val =input?input.value:td.dataset.value;
              return v_rule(val,td,tr);
            }
            else{
              //***if v_rule is not a function
                let input = td.querySelector('.td-input');
                let val = input?input.value:td.dataset.value; 
                      switch(v_rule){
                        case 'positive':{
                          if(col_name ==='service_id') console.error(`v_rule = ${v_rule} | value =${val}`);
                          if(!(val>0)){
                                validate_succeed= false;
                                //exit forEach (td)
                                return false;
                          }
                          break;
                        }
                        case 'number':{
        
                          if(!(val>=0 || val <0)){
                            validate_succeed= false;
                            //exit forEach (td)
                            return false;
                          }
                          break;
                        }
                        case 'string':{
        
                          if(!val || (val+'').trim() ===''){
                            validate_succeed= false;
                            //exit forEach (td)
                            return false;
                          }
                          break;
                        }
                        default:{
                          if(!val || (val+'').trim() ===''){
                            validate_succeed= false;
                            //exit forEach (td)
                            return false;
                          }
                          break;
                        }
                      } 
                  } 
           }
           //end:: If (v_rule or validate_rule is supplied)
          
        });
        //end::forEach loop through (td in tr)

        if(!silent_mode && !validate_succeed) cv_interact.warning(['Please fill in required fields ',cols.join(', ')].join(''));
        return validate_succeed;
     }

     //option = {value,text}
     createSelectOptions(col_name){
        let col = this.getColumnPropsByName(col_name);
        if(col){
           let ops = col.selectOptions?col.selectOptions:[];
           let html = [`<option value="">`,LocaleManager.trans('None',this.options.langProp),`</option>`].join('');
           ops.map(item =>{
              let justSelect ="";
              if(col.selectedValue == item.value) justSelect ="selected";
              html = [html,`<option value="${item.value} ${justSelect}">`,item.text,`</option>`].join('');
           });
           return html;   
        }
        return '';
     }
 
    //compute coloumns' width based on scenario that some columns have specified Width value, some some column do not. Some columns have specified value in percentage, and some in "px"
    //and the self.clientWidth is max table's width in px that is contraint in this method, based on which to determine column width 
    processColumnWidths(columns){
        // const columns = [
        //   { name: "Name", width: "150px" },
        //   { name: "Age", width: "10%" },
        //   { name: "Address" },
        //   { name: "Phone", width: "20%" },
        // ];
        const that = this;
        let tableWidth = this.self.clientWidth; // total width of table in pixels
        if(tableWidth==0) tableWidth = this.self.parentNode.clientWidth;
        if(tableWidth==0) tableWidth = this.self.parentNode.parentNode.clientWidth;
        //console.error(`Column width = ${tableWidth}`);
        if(!(tableWidth > 0)) return;

        let totalWidth = 0; // total width of all specified columns in pixels
        //console.error('total witdh = '+tableWidth);
        let unspecifiedColumnsCount = 0;
        columns.forEach((column) => {
          column.width = column.width+'';
          if (column.width && column.width !=='undefined') {
            //console.error('specified col = '+column.width);
            if (column.width.endsWith("px")) {
              totalWidth += parseInt(column.width);
            } else //if (column.width.endsWith("%")) 
            {
               let w = parseInt(column.width);
               if(w <100){
                 totalWidth += tableWidth * w / 100;
               }else{
                   totalWidth += w;
               }
             
            } 
          } else {
            unspecifiedColumnsCount++;
          }
        });
        
        const remainingWidth = tableWidth - totalWidth;
        const unspecifiedWidth = (unspecifiedColumnsCount ==0)? 0 : remainingWidth / unspecifiedColumnsCount;

        let user_col_index =0;
        const columnWidths = columns.map((column) => {
          column.width = column.width+'';
          if (column.width && column.width !=='undefined') {
            if (column.width.endsWith("px")) {
               that.options.columns[user_col_index].width =`${parseInt(column.width)/ tableWidth * 100}%`;  
               //return `${parseInt(column.width)/ window.innerWidth * 100}%`;
            } else //if (column.width.endsWith("%"))
            {
              let w = parseInt(column.width);
              if(w < 100)
                 that.options.columns[user_col_index].width =`${w}%`;
              else that.options.columns[user_col_index].width =`${w/ tableWidth * 100}%`;
                 //return column.width;
            } 
          }else that.options.columns[user_col_index].width =`${unspecifiedWidth/tableWidth * 100}%`;  
           user_col_index++;
           //return `${unspecifiedWidth / window.innerWidth * 100}%`;
        });
        console.error("inside => " + JSON.stringify(that.options.columns));
        //return console.log(columnWidths); // Output: ["18.75%", "10%", "25%", "46.25%"]
    }

     createColumnHeaders_html(columns =[]){
        if(!this.options.showColumnHeaders) return '';
        let this_th = '';
        let that = this;
        let i =0;
        columns.map(col=>{
            ////col.width = col.width?col.width.match(/\d+/)[0]:def_width; //col.width>0? col.width : def_width;
            ////that.options.columns[i].width = col.width;
            if(!col.langProp) col.langProp = that.options.langProp;
            this_th = [this_th,`<th style="width:${col.width}" class="trans-text" data-langprop="${col.langProp}">`,col.title,`</th>`].join('');
            i++;
        });

        let numeroHeaderText =this.options.numeroHeaderText? this.options.numeroHeaderText:"";
        let numero_header =`<th style="width:5%" class="" data-langprop="">${numeroHeaderText}</th>`;
        return [`<thead><tr>`,numero_header,this_th,`<th style="width:5%" class="trans-text" data-langprop="dt_columns.Action"></th></tr></thead>`].join('');
     }
 
     getDefaultColumns(){
        return [
        //   {
        //     cssClass:'item-numero',
        //     title:'Number',
        //     name:'numero',
        //     langProp:'dt_columns',
        //     'readOnly':true,
        //     'dataType':'number',
        //      //data:(item)=>{ return item.numero; }
        //   },
          {
            cssClass:'item-name',
            title:'Item Name', /** item value or Item Id **/
            name:'item_id',
            displayName:'item_name', /** item's text or Item Name to be displayed **/
            langProp:'dt_columns',
            displayType:'select'
          },
          {
            cssClass:'item-description',
            title:'Description',
            name:'description',
            langProp:'dt_columns',
            'dataType':'string'
          },
          {
            cssClass:'item-qty',
            name:'qty',
            title:'Quantity',
            langProp:'dt_columns',
            'dataType':'number'
          },
          {
            name:'price',
            cssClass:'item-price',
            title:'Price',
            langProp:'dt_columns',
            currencySymbol:'$',
            'dataType':'number'
          },
          {
            name:'discount',
            cssClass:'item-discount',
            title:'Discount',
            langProp:'dt_columns',
            isPercentage:true, /** or 'showPercentage': true **/
            'dataType':'number'
          },
          {
            name:'total',
            cssClass:'item-total',
            title:'Line Total',
            readOnly:true,
            langProp:'dt_columns',
            currencySymbol:'$',
            'dataType':'number'
          }

        ];
     }
     
     getLastRow_tr(){
       return this.table_body.lastElementChild;
     }

     //params @user_action_add = true (It means that user clicks Add Line button to add new row)
     addRow(d=null,rowIndex = 0,validateItem=true,user_action_add = false){
            let html_cols = "";
            d = d?d:{};
            rowIndex = rowIndex?rowIndex:0; 
             //Validate currently editing row based on the provided "this.options.validateColumns" , if validation is successful then can add new row
             if(validateItem) if (!this.validateRow(null,this.options.validateColumns)) return;

            //before adding any new row, Remove empty row, if exists.
              let empty_row = this.table_body.firstChild;
              if(empty_row){
                 if (empty_row.classList.contains('empty-row')) empty_row.remove();
              }

            if(user_action_add){
              let last_tr = this.getLastRow_tr();
              let aa = this.validateRow(last_tr,this.options.validateColumns,true);
              if(!aa){
                  this.changeRowState(last_tr,'edit');
                  return;
              } 
            } 
             
            (this.options.columns || []).map(col=>{
                let value ='';
              
                if (typeof col.data ==='function')
                  value = col.data(d[col.name],d); 
                else{
                    
                    //if col.selectOptons is supplied or given => then automically set col.displayType to be "select" that means the column is a Dropdown-list column 
                     if(col.selectOptions) col.displayType ='select';
                  
                     //In case the column is to display formatted or display value or text value (i.e: Combo comlumn)
                     //for example, col.name ="item_id" and col.displayName ="item_name" for "Item Name" dropdown column   
                     if (col.displayName)
                       //{
                        value = d[col.displayName]; 
                        //alert(col.displayName);
                       //}           
                    else if (col.displayType==='select'){
                           //For SELECT or Dropdown column, if the col.displayName is not supplied or given= > then get display text from column's selectOptions "col.selectOptions" array
                            //if (!col.selectOptions) console.error(`selectOptions is required for column ${col.name}`); 
                            let items = (col.selectOptions || []).filter(e=>{
                              return (e.value ==d[col.name]);
                            });
                            if (items[0]) value = items[0].text; 
                    }else {
                        //this case: col.displayName is NULL and col.displayType != 'select'
                        ////value = d[col.displayName? col.displayName : col.name];
                        value = d[col.name];
                        if(col.isPercentage || col.showPercentage || col.showAsPercentage) 
                          value = [value,'%'].join('');
                        else if(col.currencySymbol)
                          value = [col.currencySymbol,value].join('');
                        }
                }

                let style_width="";
                if(col.width) style_width =['style="width:',col.width,'"'].join('');
                if(!value) if(col.dataType === 'number') value =col.defaultValue?col.defaultValue:0;
                html_cols = [html_cols,
                              `<td ${style_width} class="ivc-`,col.name,' ',col.cssClass,`" data-name="`,col.name,`" data-editortype="${col.displayType?col.displayType:""}" data-text="`,d[col.displayName],`" data-value="`,d[col.name],`">`,value,`</td>`
                            ].join('');
              });

                //console.error(`Row ` + (rowIndex+1) + " => "+ html_cols);
                let item_id = d.id?d.id:'';
                //Add automatic Nunero column at beginning
                let numero = rowIndex + 1;
                if(typeof this.options.numeroFormatter ==='function') numero = this.options.numeroFormatter(numero,d);
                let numero_col = `<td style="width:5%" class="item-numero" style="text-align:center">${numero}</td>`;
                let tr = document.createElement('tr');
                tr.dataset.rowIndex = rowIndex;
                tr.dataset.id = item_id;
                tr.dataset.editing =0;
                if (this.options.rowClass) tr.classList.add(this.options.rowClass);
                let action_col =[`<td style="width:5%"><div class="form-inline"><a href="javascript:void(0)" class="btn-item-delete"><i class="fa fa-trash" style="color:red"></i></a></div></td>`].join('');
                tr.innerHTML = [numero_col,html_cols,action_col].join('');
                this.table_body.appendChild(tr);
                if (!d.id) this.changeRowState(tr,'edit');
                this.setFieldFocus(tr,null); 
                this.resetNumero();
                
                //If user clicks Add Line button in order to add a new row => then check Scroll
                //NOTE: @has_scroll = true => means that the current Items table already has fixed body scroll
                if(user_action_add){
                   if (!this.has_scroll) this.setMaxHeightRows(this.maxRows);
                   //Scroll to the bottom empty element (.g: empty tr)
                   this.table_body.scrollTop = this.table_body.scrollHeight;
                }
     }

    //  //This function is to ensure that all header columns' width are equal to corresponding cell (td)
    //   adjustHeaderWidths() {
    //     const first_tr = this.table.querySelectorAll('tbody tr');
    //     const cells = first_tr[0].querySelectorAll('td');
    //     const headerCells = this.table.querySelectorAll('thead th');
    //     let i = 0;
    //     headerCells.forEach(h => {
    //       const bodyCellWidth  = cells[i].getBoundingClientRect().width;
    //       //const headerCellWidth = headerCells[i].getBoundingClientRect().width;
    //        //if (bodyCellWidth > headerCellWidth) {
    //           headerCells[i].style.width = `${bodyCellWidth}px`;
    //         //}else {
    //           //headerCells[i].style.width = '';
    //         //}
    //       i++; 
    //     });
    //  }

     setFieldFocus(tr,col_name =null){
       if(!tr || tr.length ===0) return null;
       let target_td = null;

       let cells = tr.querySelectorAll('td');
       let i=0,c;
       do{
           c = cells[i];
           if(!c) break;
           if(!col_name && i===1){
             target_td = c;
             break;
           }else if (col_name){
             if(c.dataset.name === col_name){
               target_td = c;
               break;
             }
           } 
           i++;
       }while(c);
       
          if(target_td){
                    
                  let el = target_td.querySelector('.td-input');  
                  if(el){
                    let displayType = target_td.dataset.editortype;
                    if(displayType ==='select'){
                      let select2_container = tr.querySelector('.select2-container');
                      if(select2_container){
                        select2_container.classList.add('select2-container--focus');
                        //select2_container.classList.add('select2-container--below');
                        //select2_container.classList.add('select2-container--open');
                      }

                    }else{
                        el.focus();
                        //el.value ="test";
                        el.select();
                    }
                 }
           
         }
    }

    setRowId(tr,id){
        tr.dataset.id = id;
    }

     //Set data for display in ItemView
     setData(rows = null){
       let rowIndex= 0;
       let that = this;
       this.table_body.innerHTML = null;
       //let html = ""; 
       if(!rows || !rows[0]) {
          this.addRow(null,0,false); 
          return ;
       }

       (rows || []).map(d =>{
            //add row without validate item data
            that.addRow(d,rowIndex,false); 
            rowIndex++;
           //Check if the current rowCount is greater than the option.maxRows. If so, set auto scroll of tbody
           that.setMaxHeightRows(that.maxRows,rowIndex);
      });   
     }

     getDataRow(tr){
       let items = this.getItems(tr);
       return items[0];
     }

     getItems(tr=null){
       let trs =null;
       if(tr){
         trs = [tr];
       }else trs = this.table_body.querySelectorAll('tr');

       let ps = [];
       trs.forEach(tr=>{
          let item = {};
          tr.querySelectorAll('td').forEach(td=>{
              let f = td.dataset.name;
              let input =td.querySelector('.td-input');
              let value =null;
              if(input)
                value = input.value;
              else value = td.dataset.value;
              if(f) item[f] = value; 
          });
          ps.push(item);
       });
       return ps;
     }

     getTotal(){
        return 111;
     }

     getGrandTotal(){
        return 111;
     }

     getTotalTax(){
        return 111;
     }

     getTotalCost(){
        return 0;  
     }


}