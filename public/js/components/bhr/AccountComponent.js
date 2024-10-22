var AccountMenagmentComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_accountComponent");
    this.self = this.jm[0];
    this.title_prop = "Account Management";

    this.btnAdd = this.self.querySelector("#_btnAddAccount");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.elSearch = this.self.querySelector("#_sdl_search_account");
    this.elSortBy = this.self.querySelector('#el_sort_by');

    this.init= () => {
        if(mThis.initAlready) return;

        mThis.initAlready = true;
    }

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        // mThis.prepareFormOptions();
        //     mThis.AccountListView.showPage();
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            };

})()
