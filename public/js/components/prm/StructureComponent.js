"use strict";

var StructureComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Space Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_structure_component");
    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };
    this.renderStructure = ()=>{
	const div = mThis.self;
        let html = '';
        html = [`
            <div class="structure-container">
            <div class="box-structure">
                <img src="${main_view.asset_url}/images/yavpheng/Structure_ypg.jpg"/>
            </div>
            `].join('');
            div.innerHTML = html;
            Object.assign(div.style, {
                height: (window.innerHeight - 70) + "px",
                overflow: 'auto'
            });

            window.onresize = () => {
                Object.assign(div.style, {
                    height: (window.innerHeight - 70) + "px",
                    overflow: 'auto'
                });
            };
    }

    mThis.show = () => {
        mThis.init();
        mThis.renderStructure();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();
