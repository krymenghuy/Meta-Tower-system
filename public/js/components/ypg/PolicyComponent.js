"use strict";

var PolicyComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Association Policy";
    mThis.self = main_view.VSAppContent.querySelector("#_main_policy_component");

    mThis.init = () => {
        if (mThis.initAlready) return;

        const imageBox = mThis.self.querySelector("#imageStructureBox");
        imageBox.innerHTML = '';

        const scrollContainer = document.createElement('div');
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.maxHeight = '85vh';
        scrollContainer.style.padding = '10px';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'd-flex justify-content-center align-items-start'; 

        const imgChinese = document.createElement('img');
        imgChinese.src = '/assets/images/yavpheng/Policy-Chinese.jpg';
        imgChinese.style.width = '47%'; 
        imgChinese.style.height = 'auto';
        imgChinese.style.marginRight = '15px'; 
        imgContainer.appendChild(imgChinese);

        const imgKhmer = document.createElement('img');
        imgKhmer.src = '/assets/images/yavpheng/Policy-Khmer.jpg';
        imgKhmer.style.width = '47%'; 
        imgKhmer.style.height = 'auto';
        imgContainer.appendChild(imgKhmer);

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