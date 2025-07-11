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
        scrollContainer.className = 'policy-scroll-container';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'policy-img-wrapper';

        const imgChinese = document.createElement('img');
        imgChinese.src = '/assets/images/yavpheng/policy_chinese.jpg';
        imgChinese.className = 'policy-img policy-img-left';
        imgContainer.appendChild(imgChinese);

        const imgKhmer = document.createElement('img');
        imgKhmer.src = '/assets/images/yavpheng/policy_khmer.jpg';
        imgKhmer.className = 'policy-img';
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
