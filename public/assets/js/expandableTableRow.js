"use strict";

/**
 *  This is default css class for .row-expanded for animation to hide or show expandable row
    .row-expanded {
        max-height: 500px;
        opacity: 1;
        transition: max-height 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease-in-out;
        overflow: hidden;
    }
    .row-expanded:not(.row-expanded) {
        max-height: 0;
        opacity: 0;
        transition: max-height 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease-in-out;
    }

 * **/
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
         //rowClass must always be 'expandable-row'
        this.rowClass ='detail-row';
        this.table_id = table_id;

        //tr_id is the incremental integer used to create element ID for each exapandable row (tr)
        this.tr_id = 0; 
        this.wrapperClass ='expandable-row-container'; //option.wrapperClass?option.wrapperClass:'expandable-row-content';

        //clicking on one of these elements => will not trigger Expanding row Panel. dontExpandByClickingOn is array of css classes, such as 'btn_item_edit'
        this.dontExpandByClickingOn = option.dontExpandByClickingOn?option.dontExpandByClickingOn:[];

        this.content = option.html?option.html:(option.content?option.content:'');
        this.panelHtml = [`<div class=" ${this.wrapperClass}">`,this.content,`</div>`].join('');
      
        //this.table = $(`#${table_id}`);
       
        this.table = document.querySelector(`table#${table_id}`);
        if(!this.table) throw(`Error: table ID ${this.table_id} is not found`);
       
        let that = this;
        this.option = option;

            //if(!this.table_body) throw(`Error: table ID ${this.table_id} does not have <tbody> inside it, or the table is missing`);    
           
            // this.table_body.removeEventListener('click',(e)=>{
            //     e.preventDefault();
            //     let tr = that.getClosestParentByType(e.target,'TR'); //e.target.clostest('TR');// .parentNode;
            //     // //*** the following code is for illustration about detecting click inside or outside target element ***/
            //     // let my_target_element = tr.find('.thumbnail-wrapper');
            //     // if (my_target_element.is(e.target) || my_target_element.has(e.target).length > 0) {
            //     //    //click inside the target element
            //     //    alert('click inside my_target_element');
            //     // }
            //     if (that.shouldExpand(tr,e.target)) that.toggleOpen(tr);
            // });

            this.table.addEventListener('click',(e)=>{
                e.preventDefault();
                //IMPORTANT NOTE: tr in sub table (i.e: tr belonging to table inside Expandable row, makes confusion in the Expanding behavior) => so we detects if the "tr" is inside expandable row or not?
                let tr = that.getClosestParentByType(e.target,'TR'); //e.target.clostest('TR');// .parentNode;
                if (!tr) return; 
                if(tr.parentNode.nodeName ==='TBODY'){
                    // //*** the following code is for illustration about detecting click inside or outside target element ***/
                    // let my_target_element = tr.find('.thumbnail-wrapper');
                    // if (my_target_element.is(e.target) || my_target_element.has(e.target).length > 0) {
                    //    //click inside the target element
                    //    alert('click inside my_target_element');
                    // }

                    /** Check if the "tr" belongs to sub table or table inside main table that may cause confusion in expanding behavior **/
                    let div = that.getClosestParentByClass(e.target,'expandable-row-container');
                    if(!div) if (that.shouldExpand(tr,e.target)) that.toggleOpen(tr);
                }
              
            });

    }

      //detecting clicked target element (e.target) within a given @tr. if the e.target (or clicking target element) is within the Exception array then should not expand the Expandable row details.
       shouldExpand(tr,target){
           let to_expand = true;
           if(!tr) return false;
           let that = this;
           //NOTE: this.dontExpandByClickingOn is array of css selector or classes such as ['btn_apt_edit','btn_apt_delete','btn_apt_print']. When user clicks one of these elements, there is no Expanding behavior (No toggleOpen() )
           (this.dontExpandByClickingOn || []).map((c)=>{
                if (that.getClosestParentByClass(target,c,5)){
                    //click inside the target element
                    to_expand = false;
                    return false;
                } 
           });
           return to_expand;
       }

        closeById(id=0){
           //let tr = this.table.find(`tr[data-id="${id}"]`); 
           let tr = document.querySelector(`[data-id="${id}"]`); 
           let next_tr = tr.nextSibling;
           if(next_tr.classList.contains(this.rowClass)){
            tr.classList.remove('row-expanded');
            next_tr.style.display ='none';
           }
        }

        close (){
            if(this.prev_expandable_row){
                //let tr = this.prev_expandable_row.prev();
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
                        const div_expandable_row_container = next_tr.querySelector(`.${that.wrapperClass}`);
                        if (typeof that.option.onClose ==='function'){
                            that.option.onClose(div_expandable_row_container, that.prev_expandable_row,tr);
                        }
                        that.prev_expandable_row.style.display ='none';
                        if (typeof that.option.afterClose ==='function') that.option.afterClose(div_expandable_row_container,next_tr,tr);

                        // if (typeof that.option.onClose ==='function'){
                        //      that.option.onClose();
                        //     //if(!a) return;
                        // }else{
                        //     that.prev_expandable_row.style.display='none';
                        //     if (typeof that.option.afterClose ==='function') that.option.afterClose();
                        // }
                    }
                }

                let vib = this.isVisible(next_tr);
                if (vib){
                    next_tr.style.display='none';
                    that.prev_expandable_row = null;
                    if (typeof that.option.onClose ==='function') {
                        const div_expandable_row_container = next_tr.querySelector(`.${that.wrapperClass}`);
                        that.option.onClose(div_expandable_row_container, next_tr,tr);
                    }
                    // if (typeof that.option.onClose ==='function'){
                    //     let a = that.option.onClose();
                    //     //if(!a) return;
                    //     next_tr.style.display='none';
                    //     that.prev_expandable_row = null;
                    //     if (typeof that.option.onClose ==='function') that.option.onClose();
                    // }else{
                    //     next_tr.style.display='none';
                    //     that.prev_expandable_row = null;
                    //     if (typeof that.option.onClose ==='function') that.option.onClose();
                    // }
                  
                } else {
                   
                    tr.classList.add('row-expanded');
                    //next_tr.slideDown(300);
                    
                    next_tr.style.display='table-row';
                    let div_expandable_row_container = next_tr.querySelector(`.${that.wrapperClass}`);
                    if (typeof that.option.onOpen ==='function') that.option.onOpen(div_expandable_row_container,next_tr,tr);
                    that.prev_expandable_row = next_tr;
                }
                 return;
            }
            // `<tr class="expandable-row"><td colspan="10"><div class="${cssClass}"></div><h4>This is a test expanded</h4></td></tr>`;  
            //let html = (typeof createHTML==='function')? createHTML():`</div><h4> This is default Panel for Expandable Row </h4></div>`; 
            
            if(that.prev_expandable_row){
                if(that.prev_expandable_row !== next_tr) that.prev_expandable_row.style.display='none';
            }

            that.tr_id++;
            let row_id = [that.table_id,'_tr_',that.tr_id].join('');
            let html_dataset= null;

            (that.tr_dataset || []).map((field)=>{
              let f = field.replace('_','');  
              //error @d is not defined
              //d = getDataRow(index);
              html_dataset = [html_dataset,`data-`,f,`="${d[field]}"`].join('');
            });
 
            //tr.after(`<tr id="${row_id}" ${html_dataset} class="${that.rowClass}"><td colspan="100%">${that.panelHtml}</td></tr>`);
            let new_tr = document.createElement('tr');
            new_tr.innerHTML = `<tr><td colspan="100%">${that.panelHtml}</td></tr>`;
            new_tr.setAttribute('id',row_id);
            new_tr.classList.add(that.rowClass);
            tr.classList.add('row-expanded');
            this.insertAfter(new_tr,tr);
         
            that.prev_expandable_row = new_tr;
            //that.prev_expandable_row = document.querySelector(`#${that.table_id} tr#${row_id}`);
            //that.prev_expandable_row.slideDown(300);
            let div = new_tr.querySelector(`.${that.wrapperClass}`);
            if (typeof that.option.onOpen ==='function') that.option.onOpen(div,new_tr,tr);
        }

        //Insert an element right after another element
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

        //This function will try recursively find parent up to 100 levels upward (by default)
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