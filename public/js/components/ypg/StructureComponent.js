"use strict";

var StructureComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Company Structure";
    mThis.self  = main_view.VSAppContent.querySelector("#_main_structure_component");

    mThis.init = () => {
        if (mThis.initAlready) return;

        const imageBox = mThis.self.querySelector("#imageStructureBox");
        imageBox.innerHTML = '';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.maxHeight = '85vh'; 
        scrollContainer.style.padding = '10px';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'd-flex justify-content-center';

        const img = document.createElement('img');
        img.src = '/assets/images/yavpheng/Structure_ypg.jpg';
        img.style.width  = '70%';
        img.style.height = 'auto';

        imgContainer.appendChild(img);
        scrollContainer.appendChild(imgContainer);
        imageBox.appendChild(scrollContainer);

        mThis.initAlready = true;
    };

    mThis.show = () => {
        mThis.init();
        mThis.self.style.display = 'flex';
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();
