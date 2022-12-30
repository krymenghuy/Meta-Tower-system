"use strict";
/****
  option = {
    "content":'html content or any text',
    "wrapperClass":'loaninfo-wrapper',
    "tr_dataset":['id','person_id'] //These are field_names, whose values become the values of tr's data attribute. For example, "person_id" will become <tr data-personid=data['person_id'] 
    "onOpen":function(parent_tr,details_tr){ ... },
    "onClose":function(parent_tr,details_tr){ ... },
    "afterClose":function(parent_tr,details_tr){ ... },
    "dontExpandByClickingOn":['btn_item_edit']
  }

  "dontExpandByClickingOn" is array of css classes of the elements, on which the user's click will not expand or hide the Expandable panel. For example, the Edit button `<a href="#"" class=`btn_item_edit" ...`  When user clicks on this Edit button, there is no Expanding behavior
 
  ***/
  class ExpandableRowConfig{
    constructor(table_id,option = null){
        if(!option) option = {};
        this.rowClass ='detail-row';
        this.table_id = table_id;
 
        this.tr_id = 0; 
        this.wrapperClass ='expandable-row-containter';
        this.dontExpandByClickingOn = option.dontExpandByClickingOn?option.dontExpandByClickingOn:[];

        this.content = option.html?option.html:(option.content?option.content:'');
        this.panelHtml = [`<div class=" ${this.wrapperClass}">`,this.content,`</div>`].join('');
       
        this.table = document.querySelector(`table#${table_id}`);
        if(!this.table) throw(`Error: table ID ${this.table_id} is not found`);
       
        let that = this;
        this.option = option;
  
            // this.table.addEventListener('click',(e)=>{
            //     e.preventDefault();
            //     let tr = that.getClosestParentByType(e.target,'TR');
            //     if (!tr) return; 
            //     if(tr.parentNode.nodeName ==='TBODY'){
            //         if (that.shouldExpand(tr,e.target)) that.toggleOpen(tr);
            //     }
              
            // });

    }

       shouldExpand(tr,target){
           let to_expand = true;
           if(!tr) return false;
           let that = this;
           (this.dontExpandByClickingOn || []).map((c)=>{
                if (that.getClosestParentByClass(target,c,5)){
                    to_expand = false;
                    return false;
                } 
           });
           return to_expand;
       }

        closeById(id=0){
           let tr = document.querySelector(`[data-id="${id}"]`); 
           let next_tr = tr.nextSibling;
           if(next_tr.classList.contains(this.rowClass)){
            tr.classList.remove('row-expanded');
            next_tr.style.display ='none';
           }
        }

        close (){
            if(this.prev_expandable_row){
                let tr = this.prev_expandable_row.nextElementSibling;
                tr.classList.remove('row-expanded');
                this.prev_expandable_row.style.display='none';
                this.prev_expandable_row = null;
            }
        }

        open(tr,callBack=null){
            if(this.prev_expandable_row){
                this.prev_expandable_row.style.display='none';
                this.prev_expandable_row = null;
            }
            this.toggleOpen(tr);
            if(tr) if (typeof callBack ==='function') callBack();    
        }
 
        //For NextJS project, we use State Management instead of addEventListener('click')
        handleExpansionState(tr,event){
            if (this.shouldExpand(tr,event.target)) this.toggleOpen(tr);
        }

        toggleOpen(tr){
            if(!tr || tr.nodeName !=='TR') return;
            let that = this;
            tr.classList.remove('row-expanded');
            if (tr.classList.contains(that.rowClass)) return;

            let next_tr = tr.nextElementSibling;
             
            if (next_tr && next_tr.classList.contains(that.rowClass)){
                if(that.prev_expandable_row){
                    if(that.prev_expandable_row !== next_tr){
                       
                        if (typeof that.option.onClose ==='function')  that.option.onClose();
                        that.prev_expandable_row.style.display ='none';
                        if (typeof that.option.afterClose ==='function') that.option.afterClose();
                    }
                }

                let vib = this.isVisible(next_tr);
                if (vib){
                    next_tr.style.display='none';
                    that.prev_expandable_row = null;
                    if (typeof that.option.onClose ==='function') that.option.onClose();  
                  
                } else {
                   
                    tr.classList.add('row-expanded');
                     
                    next_tr.style.display='table-row';
                    let div_expandable_row_container = next_tr.querySelector(`.${that.wrapperClass}`);
                    if (typeof that.option.onOpen ==='function') that.option.onOpen(div_expandable_row_container,next_tr,tr);
                    that.prev_expandable_row = next_tr;
                }
                 return;
            }
            
            if(that.prev_expandable_row){
                if(that.prev_expandable_row !== next_tr) that.prev_expandable_row.style.display='none';
            }

            that.tr_id++;
            let row_id = [that.table_id,'_tr_',that.tr_id].join('');
            let html_dataset= null;

            (that.tr_dataset || []).map((field)=>{
              let f = field.replace('_','');  
              
              html_dataset = [html_dataset,`data-`,f,`="${d[field]}"`].join('');
            });
  
            let new_tr = document.createElement('tr');
            new_tr.innerHTML = `<tr><td colspan="100%">${that.panelHtml}</td></tr>`;
            new_tr.setAttribute('id',row_id);
            new_tr.classList.add(that.rowClass);
            this.insertAfter(new_tr,tr);
            tr.classList.add('row-expanded');
            that.prev_expandable_row = new_tr;
           
            let div = new_tr.querySelector(`.${that.wrapperClass}`);
            if (typeof that.option.onOpen ==='function') that.option.onOpen(div,new_tr,tr);
        }
 
        insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(newNode, existingNode.nextElementSibling);
        }

        isHidden(el) {
            let style = window.getComputedStyle(el);
            return (style.display === 'none')
        }

        isVisible(el=null){
            if(!el) return;
            let style = window.getComputedStyle(el);
            if (style.display === 'none') return false;
            if (style.visibility !== 'visible') return false;

            const elemCenter   = {
                x: el.getBoundingClientRect().left + el.offsetWidth / 2,
                y: el.getBoundingClientRect().top + el.offsetHeight / 2
            };
            if (elemCenter.x < 0) return false;
            if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
            if (elemCenter.y < 0) return false;
            return true;
        }
 
        getClosestParentByType(el, elementType='',try_count=null){
            if(!try_count || try_count<=0) try_count = 100;  
            if(!el) return null;  
           if(el.nodeName ===elementType) return el;
           let p = el.parentNode;
           if(p){
             if(p.nodeName ===elementType) 
                return p;
             else{
                let i = 0;
                for(i=0;i<try_count;i++){
                   p = p.parentNode;
                   if(p){
                       if (p.nodeName ===elementType) return p;
                   }else return null;
                }
                  return null;
               
             }   
           } else return null; 

        }

        getClosestParentByClass(el, className ='',try_count=null){
            if(!try_count || try_count<=0) try_count = 100;
            if(!el || el.nodeType === Node.TEXT_NODE) return null;  
           if(el.classList.contains(className)) return el;
           let p = el.parentNode;
           if(p){
             if(p.classList.contains(className)) 
                return p;
             else{
                let i = 0;
                for(i=0;i<try_count;i++){
                   p = p.parentNode;
                   if(p && p.nodeType !== Node.TEXT_NODE){
                       if (p.classList) if (p.classList.contains(className)) return p;
                   }else return null;
                }
                  return null;
               
             }   
           } else return null; 

        }


 }
