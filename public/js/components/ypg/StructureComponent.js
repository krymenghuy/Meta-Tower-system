"use strict";

var StructureComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Association Structure";
    mThis.self = main_view.VSAppContent.querySelector("#_main_structure_component");
    mThis.structureContainer = mThis.self.querySelector('#structureContainer');
    mThis.init = () => {
        if (mThis.initAlready) return;

       

        mThis.initAlready = true;
    };
    this.renderStructure = ()=>{
        let html = '';
        html = [`
            <div class="structure-frame">
      <div class="structure-front-image">
        <img class="img-structure" src="${main_view.asset_url}/images/yavpheng/Structure_ypg.jpg"/>
      </div>
    </div>
            `].join('');
            mThis.structureContainer.innerHTML = html;
    }

    mThis.show = () => {
        mThis.init();
        mThis.renderStructure();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();
