"use strict";

/**
  options = {
     wrapperClass: "", // NOTE cssClass also works
     menuItemClass: "",
     actionButtonClass: "", // NOTE: clickClass also works 
     menus: [
         {
            text: "",
            action: "",
            icon: "",
         },
     ],
     adjustPosition:{
        left:50,
        top:20
     }
     menuCreated: (menuLink, actionButton) => {},
     onShow: (data, menus) => { .. },
     onClose: (data, menus) => { ... },
     onClick: (lnk, id, action) => {
       // Write code to handle click event
     }
  }
*/

class VSDropdownMenu {
  constructor(options = {}) {
    this.options = options;
    this.options.containerElement = this.options.containerElement || this.options.table;
    this.init();
  }

  createUserActionMenus(link, menus, datasets) {
    let id = link.dataset.id;
    const that = this;
    let str_data = id ? `data-id="${id}" ` : "";
    
    // Loop through datasets object and append key-value pairs to str_data
    for (let key in datasets) {
      if (datasets.hasOwnProperty(key)) {
        str_data += `data-${key}="${datasets[key] || ''}" `;
      }
    }
    
    let menu_html = [];
    menus.forEach(m => {
      let menuClass = (m.cssClass || m.className) || '';
      let menuText = m.html ? m.html : m.text;
      let mnu_name = m.name || m.action;
      menu_html.push(`<a class="dropdown-item ${that.options.menuItemClass || ""} ${menuClass}" ${str_data} data-mnuaction="${mnu_name}" href="javascript:void(0)">${m.icon} ${menuText}</a>`);
    });

    let wrapperClass = (this.options.wrapperClass || this.options.cssClass) || that.options.className;
    let cssClass = wrapperClass || "bg-white shadow";
    return [`<div class="dropdown-menu ${cssClass}" ${str_data}>`, ...menu_html, '</div>'].join('');
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

  getMenus(){
    let div = this.options.containerElement.querySelector('.dropdown-menu');
    if(!div) return {};
    let menus = {};
    div.querySelectorAll('.dropdown-item').forEach(m =>{
       let action_name = m.dataset.mnuaction;
        menus[action_name] = m;
    });
    return menus;
  }
  
  getMenuItems(){
    return this.getMenus();
  }

  getMenuData(){
    let div = this.options.containerElement.querySelector('.dropdown-menu');
    if(!div) return {};
    return div.dataset; 
  }

  setClickEvent(lnk, event = null) {
    const that = this;
    let p = lnk.parentElement;
    let dropdownMenu = p.querySelector('.dropdown-menu');
    
    if (!dropdownMenu || dropdownMenu.length <= 0) {
      let datasets = lnk.dataset;
      const dropdownMenuHtml = this.createUserActionMenus(lnk, this.options.menus, datasets);
      p.insertAdjacentHTML('beforeend', dropdownMenuHtml);
      if (typeof LocaleManager !== 'undefined') LocaleManager.translateZone(p);
      dropdownMenu = p.querySelector('.dropdown-menu');

      // Set menu's click event
      dropdownMenu.querySelectorAll('a').forEach(menuItemLnk => {
        menuItemLnk.onclick = e => {
          e.preventDefault();
          let id = menuItemLnk.dataset.id;
          let d = menuItemLnk.dataset;
          let name = d.mnuaction;
          that.options.onClick(menuItemLnk, id, name);
        };
      });
    }

    // Calculate the position of the dropdown menu relative to the viewport
    const rect = lnk.getBoundingClientRect();
    const lnkWidth = rect.width;

    if (!dropdownMenu.classList.contains('show')) {
      if(that.options.onShow) that.options.onShow(that,dropdownMenu);
      dropdownMenu.classList.add('show');
      this.prev_dropdownMenu = dropdownMenu;
    }else{
       if(that.options.onClose) that.options.onClose(that,dropdownMenu);
       dropdownMenu.classList.remove('show');
    }

    // // Style for "dropdown-menu" class
    // dropdownMenu.classList.toggle('show');

    const dropdownRect = dropdownMenu.getBoundingClientRect();
    const dropdownWidth = dropdownRect.width;
    
    // Calculate the remaining space to the left and right of the action button within the container
    const containerRect = this.options.containerElement.getBoundingClientRect();
    const spaceToLeft = rect.left - containerRect.left;
    const spaceToRight = containerRect.right - rect.right;
    const adjustPosition = that.options.adjustPosition || {left:0,top:0};

    adjustPosition.left = isNaN(adjustPosition.left)? 0: adjustPosition.left; 
    adjustPosition.top = isNaN(adjustPosition.top)? 0: adjustPosition.top; 

    // Set the position of the dropdown menu
    dropdownMenu.style.position = 'absolute';
    //dropdownMenu.style.top = `${rect.bottom  + adjustPosition.top}px`;
    dropdownMenu.style.top = `${rect.bottom + adjustPosition.top}px`;

    // const computedStyle = window.getComputedStyle(this.options.containerElement);
    // const marginRight =  computedStyle.getPropertyValue('padding');
    // const marginRightValue = parseInt(marginRight, 10);
    // console.log('margin right = ',marginRightValue);
   
    // Determine whether to position the dropdown to the left or right based on available space
    if (spaceToRight < dropdownWidth && spaceToLeft >= dropdownWidth) {
      // Position to the left if not enough space on the right and enough space on the left
      dropdownMenu.style.left = `${rect.left - dropdownWidth + rect.width + adjustPosition.left -15}px`;
    } else {
        dropdownMenu.style.top = `${rect.bottom - rect.top + adjustPosition.top}px`;
        dropdownMenu.style.left = `${rect.right + adjustPosition.left}px`;
        // Position to the right if there is enough space
        dropdownMenu.style.left = `${15 + rect.width +  rect.right - containerRect.left + adjustPosition.left}px`; // `${rect.left - dropdownWidth - rect.width}px`;
    }

    // Set the width of the dropdown menu to match the action button
    dropdownMenu.style.minWidth = `${lnkWidth}px`;
    // Remove 'show' class from the previous dropdown menu if it exists
    if (this.prev_dropdownMenu && this.prev_dropdownMenu !== dropdownMenu) {
      if(that.options.onClose) that.options.onClose(that,prev_dropdownMenu);
      this.prev_dropdownMenu.classList.remove('show');
    }

    // // Store the current dropdown menu as the previous one
    // if (dropdownMenu.classList.contains('show')) {
    //    this.prev_dropdownMenu = dropdownMenu;
    // }else{
    //   if(that.options.onClose) that.options.onClose(that,dropdownMenu);
    // }
  }
}