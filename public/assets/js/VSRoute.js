"use strict";
var UnauthComponent = new function(){
    const mThis = this;
    this.title_prop = 'Access Forbidden';
    this.divInfo = {};

    this.init = () => {
        if (mThis.initAlready) return;
        const app = document.querySelector('#_app_content');
        let c = app.querySelector('#_main_unauthcomponent');
        if(!c){
            const div = document.createElement('div');
            div.setAttribute('id', '_main_unauthcomponent');
            div.style.display = 'none';
            div.style.margin = '25px';
            div.innerHTML = '<div id="_div_unauth_info" class="p-2 w-100 border rounded-2 border-secondary shadow"></div>';
            app.appendChild(div);
            mThis.self = $(div);
        }

        this.divInfo = this.self.find('#_div_unauth_info');
        mThis.initAlready = true;
    }

    this.show = (options) => {
        mThis.init();
        options = options ? options : {};
        if(!options.title) options.title = mThis.title_prop;
        if(!options.html) options.html = '<h5 class="text-center text-dark p-2">Previlege is required to view content</h5>';
        if(jQuery !== "undefined" && mThis.divInfo instanceof jQuery)
            mThis.divInfo.html(options.html);
        else
            mThis.divInfo.innerHTML = options.html;
        main_view.setTitle(options.title);

        mThis.self.siblings().hide();
        mThis.self.fadeIn(200);
    }
}

window.addEventListener('DOMContentLoaded',() => {
    VSRoute.loadScript(`${main_view.asset_url}/js/AuthManager.js?v=1`).then(() => {
        AuthManager.init(() => {
            const el = main_view.appContent.find('#defaultComponent')[0];
            let comp = null;
            if(el) comp = el.value;
            comp = comp || VSRoute.getDefaultComponent();
            VSRoute.showComponent(comp);
        });
    });
});

const VSRoute = (function(){
    let scriptPromises = {};
    let baseRoute = 'dms';
    let modules = [];
    let menuItems = [];
    let currentComponent = null;
    let firstComponent = 'DashboardComponent1';
    //Remember last time user clicks on Module menu
    //let lastClickTime = null;

    function closestLimited(element, selector, maxLevels=10) {
        let currentElement = element;
        for (let i = 0; i < maxLevels; i++) {
            if (currentElement.matches(selector)) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
            if (!currentElement) {
                break;  // Reached the root of the document
            }
        }
        return null;  // No matching ancestor within the specified number of levels
    }

    function hilightMenu(componentName) {
        const selected_class = "menu-selected";
        const parent_menu_class = "kt-menu__item.kt-menu__item--submenu";
        const parent_menu_class_open = "kt-menu__item--open";
    
        menuItems.forEach(lnk => {
            const com_name = lnk.getAttribute("href");
    
            if (com_name === componentName) {
                if (!lnk.classList.contains(selected_class)) lnk.classList.add(selected_class);
    
                const parent_lnk = closestLimited(lnk, ['.', parent_menu_class].join(''), 10);
                if (parent_lnk) {
                    if (!parent_lnk.classList.contains(parent_menu_class_open)) {
                        parent_lnk.classList.add(parent_menu_class_open);
                    }
    
                    // Scroll to the selected menu item
                    lnk.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            } else {
                lnk.classList.remove(selected_class);
            }
        });
    }
 
    function setUrl(newComponentName){
        let base_url = window.location.origin;
        base_url = base_url.replace(/\/+$/, '');
        let newURL = [base_url, baseRoute, newComponentName].join('/');
        hilightMenu(newComponentName);
        window.history.pushState({}, '', newURL);
    }
  
    function loadScript(src){
        if(!scriptPromises[src]){
            scriptPromises[src] = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;

                script.onload = () => {
                    resolve();
                };

                script.onerror = (error) => {
                    reject(error);
                };

                document.head.appendChild(script);
            });
        }
        return scriptPromises[src];
    }

    function showComponent(componentName){
        // const now = new Date().getTime();
        // if (now - lastClickTime < 300) {
        //     return false;
        // }
        // lastClickTime = now;

        /** This line depends on "main_view.apiCluster" that is used to group all apis to load componenents at their first .show() call */
        if(vsapi.isLoading(main_view.apiCluster)) return false;
        const comp = window[componentName];
        if(!comp){
            const html = `<h5 class="p-2">Module named ${componentName} was not found!</h5>`;
            UnauthComponent.show({ 'html': html, 'title': 'Missing Module' });
            currentComponent = UnauthComponent;
            return;
        }

        if(!comp.module_id){
            let m = modules.find(obj => obj.name === componentName);
            comp.module_id = m ? m.module_id : null;
        }

        if (!AuthManager.access_mod(comp.module_id, true)) return;
        comp.show(null);
        setUrl(componentName);
        currentComponent = comp;
    }

    function init(menuLinks, defaultComponent = null){
        if (defaultComponent) firstComponent = defaultComponent;

        menuLinks.forEach(lnk => {
            const href = lnk.getAttribute("href");
            const mod_id = lnk.getAttribute('modid');
            const img = lnk.querySelector('img');
            const des = lnk.querySelector('span.kt-menu__link-text').textContent;
            modules.push({
                module_id: mod_id,
                name: href,
                icon_url: img ? img.getAttribute('src') : "",
                descriptive_name: des
            });

            lnk.addEventListener('click', e => {
                e.preventDefault();
                const href = lnk.getAttribute("href");
                showComponent(href);
            });
        });

        menuItems = menuLinks;
    }

    function getDefaultComponent(){
        return firstComponent;
    }

    return {
        setUrl,
        loadScript,
        showComponent,
        init,
        modules,
        menuItems,
        currentComponent,
        getDefaultComponent
    };
})();

window.addEventListener('beforeunload', function (event) {
    let navigation = performance.getEntriesByType("navigation")[0];
    if (navigation.type === navigation.TYPE_RELOAD) {
        event.preventDefault();
        alert('User refreshes');
    }
});

window.onunload = function(){
    let navigation = performance.getEntriesByType("navigation")[0];
    if(navigation.type === navigation.TYPE_RELOAD) {
        alert("User refreshed the page by clicking Refresh button or pressing Enter in the address bar.");
    }
};