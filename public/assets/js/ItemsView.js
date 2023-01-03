"use strict";

/**** Dependencies
   - vsdom.js
   - vsutil.js for VSUtil.setSelect2_value()
   - string_san.js,
   - LocaleManager.js for transaction. LocaleManager.trans()
****/

class ItemsView{

    /***
     options = {
        tableClass:'table',
        'numeroFormatter':function(numero,data) => { ... },
        'numeroHeaderText':"Numero",
        "rowClass" is the default row tr's class
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
        if(!options.addLineButtonClass) options.addLineButtonClass = 'btn btn-sm btn-primary';
        if(!options.addLineButtonText) options.addLineButtonText ='Add Line';

        if(options.showAddLineButton =='undefined') options.showAddLineButton = true;  
        if(options.showColumnHeaders == 'undefined') options.showColumnHeaders = true;
       
        if(!options.columns) options.columns = this.getDefaultColumns(); 
        this.options = options;
        this.self = document.querySelector(`#${div_id}`);
 
        this.table_id =`${div_id}_tblItems`;
        let addLineText = this.options.addLineButtonText;
        if(LocaleManager) addLineText = LocaleManager.trans(addLineText,this.options.langProp);
        let addLineButton_html = `<button class="${this.options.addLineButtonClass} btn-item-addline trans-text" type="button" data-langprop="${this.options.langProp}.${this.options.addLineButtonText}">${addLineText}</button>`;
        if(this.options.showAddLineButton != true) addLineButton_html ='';

        this.self.innerHTML =[
            `<div id="${this.table_id}_wrapper"><table id="${this.table_id}" class="${options.tableClass}">`,
                this.createColumnHeaders_html(options.columns),
                `<tbody id="${this.table_id}_body"></tbody>`,
            `</table></div>`,
            `<div id="${this.table_id}_footer" class="form-inline">${addLineButton_html}</div>`
         ].join('');
        
        //this.self.appendChild(document.createTextNode(html));
        
        this.table = document.querySelector(`#${this.table_id}`);
        this.table_body = this.table.querySelector(`#${this.table_id}_body`);
        this.div_footer = document.querySelector(`#${this.table_id}_footer`);
 
        //Add initial empty Row
        this.addRow(null);

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
                                  tr.remove();
                                  that.resetNumero();
                                  that.displayEmptyMessage();
                                }
                            }
                         );
                     //return;  
                }else{
                   
                   //begin edit row (change Row's state to "Editing mode" only if user Do not click on any link inside tr (row) )
                   this.changeRowState(tr,'edit');
                }   

            } else {
               //Click outside row (tr)
               if (this.prev_edit_row) this.changeRowState(prev_edit_row,'readonly');
            } 
        });

        this.div_footer.addEventListener('click',(e)=>{
            e.preventDefault();
            let el = VSDOM.getClosestParentByClass(e.target,'btn-item-addline');        
            if (el){
                this.addRow(null);
                //this.resetNumero(); //addRow() will also resetNumero()
            } 
        });
   
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
          //   let data_type = td.dataset.datatype;
         
          
          // let display_type = td.dataset.displaytype;
            let col = this.getColumnPropsByName(col_name);
            if(col && !col.readOnly){
                let def_class ='form-control';
                let select2_cssClass ='modal-select3';
                if(!col) throw "Error ItemsView.getColumnPropsByName(@colName) failed to find column by name " + col_name;
                col.cssClass =col.cssClass?col.cssClass:'';
                let html = `<input type="text" class="${def_class} ${col.cssClass} td-input" value="${text}"/>`;
      
                if (col.displayType =='select'){
                    if(!col.selectOptions) col.selectOptions = col.selectItems;
                    col.selectOptions = col.selectOptions?col.selectOptions:[];
                    html = [`<select class="${select2_cssClass} td-input" value="${value}">`,
                            this.createSelectOptions(col_name,value),
                          `</select>`].join('');
                     
                }else {
                    if (col.dataType =='date'){
                       html = `<input class="${def_class} ${col.cssClass} td-input" value="${text}" data-select="datepicker"/>`;
                    }else if (col.dataType =='time'){
                      html = `<input class="${def_class} ${col.cssClass} td-input" value="${text}" data-select="datepicker"/>`;
                    }else{
                      let dType = (col.dataType =='string')? 'text':'number'; 
                      html = `<input type="${dType}" class="${def_class} ${col.cssClass} td-input" value="${text}"/>`;
                    }
                    
                }

                td.innerHTML= html;
                //If the displayType is SELECT,and we use select2 with "modal-select2" class => so we need to init select2 script to transform standard SELECT to SELECT2
               

                if (col.displayType =='select'){
                    let cb = td.querySelector('select.td-input');
                    //cb.setAttribute('disabled',false);
                    this.initSelect2(cb,td);
                } //else cb.setAttribute('readOnly',false);
               
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

     initSelect2(el,td){
        let select2_dropdowns = td.querySelectorAll('span.select2-container');
        select2_dropdowns.forEach(d =>{
                  d.classList.style.display='none';
        }); 

          //NOTE: el must be converted to $(el) because .select2() is jquery function
            $(el).select2({
                width:'100%'
            });
 
     }
  
     //@items is array = [{value,text}, {value,text}, ...] 
     setSelectOptions(col_name='', items=[],selectedValue=null){
       let col = this.getColumnPropsByName(col_name);
       if(col){
         col.displayType = 'select';
         col.selectOptions = items;
         col.selectedValue = selectedValue;
         return true; 
       }
       return false;
     }

     //option = {value,text}
     createSelectOptions(col_name){
        let col = this.getColumnPropsByName(col_name);
        if(col){
           let ops = col.selectOptions?col.selectOptions:[];
           let html = '';
           ops.map(item =>{
              let justSelect ="";
              if(col.selectedValue == item.value) justSelect ="selected";
              html = [html,`<option value="${item.value} ${justSelect}">`,item.text,`</option>`].join('');
           });
           return html;   
        }
        return '';
     }

     createColumnHeaders_html(columns =[]){
        if(!this.options.showColumnHeaders) return '';
        let this_th = '';
        columns.map(col=>{
            this_th = [this_th,`<th class="trans-text" data-langprop="${col.langProp}">`,col.title,`</th>`].join('');
        });

        let numeroHeaderText =this.options.numeroHeaderText? this.options.numeroHeaderText:"";
        let numero_header =`<th class="" data-langprop="">${numeroHeaderText}</th>`;
        return [`<thead><tr>`,numero_header,this_th,`<th class="trans-text" data-langprop="dt_columns.Action"></th></tr></thead>`].join('');
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
            title:'Item Name',
            name:'name',
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
            isPercentage:true,
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

     addRow(d=null,rowIndex = 0){
            let html_cols = "";
            d = d?d:{};

            //before adding any new row, Remove empty row, if exists.
              let empty_row = this.table_body.firstChild;
              if(empty_row){
                 if (empty_row.classList.contains('empty-row')) empty_row.remove();
              }

            (this.options.columns || []).map(col=>{
                let value ='';
                if (typeof col.data ==='function') value = col.data(d[col.name],d); 
                else{
                    value = d[col.name];
                    if(col.isPercentage || col.showAsPercentage) 
                    value = [value,'%'].join('');
                    else if(col.currencySymbol)
                    value = [col.currencySymbol,value].join('');
                }
                //In case the column is to display formated or display value or text value (Combo comlumn)   
                if (!col.displayName) col.displayName = col.name; 
                html_cols = [html_cols,
                              `<td class="${col.cssClass}" data-name="`,col.name,`" data-text="`,d[col.displayName],`" data-value="`,d[col.name],`">`,value,`</td>`
                            ].join('');
              });

                //console.error(`Row ` + (rowIndex+1) + " => "+ html_cols);
                let item_id = d.id?d.id:'';
                //Add automatic Nunero column at beginning
                let numero = rowIndex + 1;
                if(typeof this.options.numeroFormatter ==='function') numero = this.options.numeroFormatter(numero,d);
                let numero_col = `<td class="item-numero" style="text-align:center">${numero}</td>`;
                let tr = document.createElement('tr');
                tr.dataset.rowIndex = rowIndex;
                tr.dataset.id = item_id;
                tr.dataset.editing =0;
                if (this.options.rowClass) tr.classList.add(this.options.rowClass);
                let action_col =[`<td><div class="form-inline"><a href="javascript:void" class="btn-item-delete"><i class="fa fa-trash" style="color:red"></i></a></div></td>`].join('');
                tr.innerHTML = [numero_col,html_cols,action_col].join('');
                this.table_body.appendChild(tr);
                if (!d.id) this.changeRowState(tr,'edit'); 

                this.resetNumero();
     }

     setData(rows){
       
       let rowIndex= 0;
       this.table_body.innerHTML = null;
       let html = ""; 
       (rows || []).map(d =>{
            this.addRow(d,rowIndex); 
            rowIndex++;
      });
          
     }

     getTotal(){
        return 10;
     }

     getGrandTotal(){
        return 11;
     }

     getTotalTax(){
        return 0;
     }

     getTotalCost(){
        return 0;  
     }


}