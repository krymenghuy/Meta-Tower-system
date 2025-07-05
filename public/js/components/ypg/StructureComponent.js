"use strict";

var StructureComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Association Structure";
    mThis.self = main_view.VSAppContent.querySelector("#_main_structure_component");

    mThis.init = () => {
        if (mThis.initAlready) return;

       

        mThis.initAlready = true;
    };

    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();
