"use strict";
class SearchWidget{
    constructor(container, options = null){
        const defaults = {
            searchIcon:'fa fa-search',
            inputClass: 'form-control border border-secondary rounded-3',
            onkeyup:()=>{ return;}
        }

       options = options || defaults;
       options.onkeyup = (typeof options.onkeyup ==='function')? options.onkeyup: defaults.onkeyup;
       options.searchIcon =   options.searchIcon || defaults.searchIcon;
       options.inputClass = options.inputClass || defaults.inputClass;
       this.options = options;
       this.container = container;
       this.container.innerHTML = '<a href="javascript:void(0)" class="sw-search-lnk"><i class="fa fa-search fs-5"></i></a>';
       this.state = 0; /** not in search mode */
       const that = this;

       this.container.dataset.state = 0;
       this.container.addEventListener('click', e=>{
          e.preventDefault();
          let lnk = e.target.closest('.sw-search-lnk');
          if (lnk){
            that.setState(null);
          }
          
       });
    }

    setState(state=null){
      if(state == 0){
        this.container.innerHTML = '<a href="javascript:void(0)" class="sw-search-lnk"><i class="fa fa-search fs-5"></i></a>';
      } else if (state==1){
        this.container.innerHTML = ['<input class="sw-search-input ',this.options.inputClass,'" placeholder="',this.options.placeHolder,'">'].join('');
        let el = this.container.querySelector('.sw-search-input');
        const that = this;
        if(el){
            el.focus();
            el.select();

             el.onkeyup = e=>{
                 e.preventDefault();
                 that.options.onkeyup(el.value, e);
             }
             el.onmouseenter = e=>{
                el.dataset.isfocus =1;
                clearTimeout(that.mTimeout);  
             }
             el.onmouseleave = e=>{
                e.preventDefault();
                el.dataset.isfocus =0; 
                let tog_state = this.state ==1? 0 : 1;
                if(!el.value || (tog_state + '').trim() ==''){
                    that.mTimeout =  setTimeout(()=>{
                        if (el.dataset.isfocus == 0) that.setState(0);
                     },1000);
                }
             }
        }
         
      } else{
         let tog_state = this.state ==1? 0 : 1;
         this.setState(tog_state);
      }
    }

    getState(){
      return this.state;
    }
    getValue(){
       if(this.state ==1){
         const el = this.container.querySelector('.sw-search-input');
         return el? el.value: null;
       }else return null;   
    }

    setValue(value){
        if(this.state ==1){
          const el = this.container.querySelector('.sw-search-input');
          el.value = value;
        }
     }

}
