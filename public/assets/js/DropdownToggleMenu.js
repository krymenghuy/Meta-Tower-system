"use strict";
/**
  options = {
     wraperClass:"",
     menuItemClass:"",
     actionButtonClass:"",
     clickClass:"",
     menus:[

     ],

     dataset:[
       {name:"userid",value:"7"}
     ],
     onClick:(lnk, lnk_class) => {
       // Write code to handle click event
     }
  }
*/

  /** menus = [
    {
      "text":"",
      "action":"",
      "icon":"<i class="fa fa-edit text-danger"></i>"
    }
   ]
  */

class VSDropdow {
  constructor(options = {}) {
    this.options = options;
    this.options.containerElement =  this.options.containerElement || this.options.table;
    this.init();
  }
 
  /** menus = [
    {
      "text":"",
      "action":"",
      "icon":"<i class="fa fa-edit text-danger"></i>"
    }
   ]
  */
  createUserActionMenus(link, menus, datasets){
    let id = link.dataset.id;
    let str_data = id ? `data-id ="${id}" `: "";
    for(let d in datasets){
       if(datasets.hasOwnProperty(d)){
        str_data = [str_data,' data-',d.name,'="',d.value,'" '].join('');
       }
    }
    let menu_html = '';
    menus.map(m =>{
      menu_html = [menu_html,' <a class="dropdown-item" ',str_data,' data-action="',m.action,'" href="javascript:void(0)">',m.icon,' ',m.text,'</a>'].join('');
    });
    let cssClass = this.options.wrapperClass || "bg-white shadow";
    return [`<div class="dropdown-menu ${cssClass}" ${str_data}>`,
     menu_html , '</div>'].join('');
 }

  init() {
    const that = this;
    const lnk = this.options.actionButton;
    if (lnk) {
      that.setClickEvent(lnk);
    } else {
      const container = that.options.containerElement;
      let actionButtonClass = that.options.actionButtonClass || that.options.clickClass;
      if (container) {
        container.addEventListener('click', e => {
          e.preventDefault();
          let btn = e.target.closest(`.${actionButtonClass}`);
          if (btn) {
            that.setClickEvent(btn, e);
          }
        });
      } 
    }

    document.addEventListener('click', function (e) {
      const container = that.options.containerElement;
      container.querySelectorAll('div.dropdown-menu').forEach(dropdownMenu => {
        if (!dropdownMenu.parentElement.contains(e.target)) {
          dropdownMenu.classList.remove('show');
        }
      });
    });
  }

  setClickEvent(lnk, event = null) {
    const that = this;
    let p = lnk.parentElement;
    let dropdownMenu = p.querySelector('.dropdown-menu');
 
    if (!dropdownMenu || dropdownMenu.length <= 0) {
      const dropdownMenuHtml = this.createUserActionMenus(lnk,this.options.menus,this.options.dataset);
      p.insertAdjacentHTML('beforeend', dropdownMenuHtml);
      dropdownMenu = p.querySelector('.dropdown-menu');
 
      // Set menu's click event
      dropdownMenu.querySelectorAll('a').forEach(menuItemLnk => {
        menuItemLnk.onclick = e => {
          e.preventDefault();
          let id = menuItemLnk.dataset.id;
          let action = menuItemLnk.dataset.action;
          that.options.onClick(menuItemLnk, id, action);
        };
      });
    }
 
    
    // Calculate the position of the dropdown menu relative to the viewport
    const rect = lnk.getBoundingClientRect();
    //const dropdownRect = dropdownMenu.getBoundingClientRect();
    const lnkWidth = rect.width;
 
     // Style for "dropdown-menu" class
     dropdownMenu.classList.toggle('show');
     this.dropdownRect = dropdownMenu.getBoundingClientRect();
     const dropdownWidth= this.dropdownRect.width;
    // Calculate the remaining space to the left and right of the action button within the container
    const containerRect = this.options.containerElement.getBoundingClientRect();
    const spaceToLeft = rect.left - containerRect.left;
    const spaceToRight = containerRect.right - rect.right;

    // Set the position of the dropdown menu
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = `${rect.bottom}px`;
 
    // Determine whether to position the dropdown to the left or right based on available space
    if (spaceToRight < dropdownWidth && spaceToLeft >= dropdownWidth) {
      // Position to the left if not enough space on the right and enough space on the left
      dropdownMenu.style.left = `${rect.left - dropdownWidth + rect.width}px`;
    } else {
      // Position to the right if there is enough space
      dropdownMenu.style.left = `${rect.left - dropdownWidth}px`;
      //dropdownMenu.style.left = `${rect.left}px`;
    }

    // Set the width of the dropdown menu to match the action button
    dropdownMenu.style.minWidth = `${lnkWidth}px`;
 

    // Remove 'show' class from the previous dropdown menu if it exists
    if (this.prev_dropdownMenu && this.prev_dropdownMenu !== dropdownMenu) {
      this.prev_dropdownMenu.classList.remove('show');
    }

    // Store the current dropdown menu as the previous one
    if (dropdownMenu.classList.contains('show')) {
      this.prev_dropdownMenu = dropdownMenu;
    }
  }
}
