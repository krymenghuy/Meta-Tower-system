"use strict";
var ChargeableComponent =   ( () => {
    const mThis = {};
    mThis.title_prop = " P A Y M E N T I T E M S M A N A G E M E N T";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_chargeable_component");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_chargeable");
    mThis.elSearch = mThis.self.querySelector("#_search_chargeable");

    mThis.cols = [
        {
            title: "Name",
            className: "align-middle",
        },
        {
            title: "Description",
            className: "align-middle",
        },
        {
            title: "Amount",
            className: "align-middle",
        },
        {
            title: "Action",
            className: "align-middle",
        },


    ]

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ChargeableListView = new ListView('_service_list', {
            fetchApi: `${main_view.base_url}/prm/chargeable/list-paginate`,
            perPage: 8,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.classList.add('chargeable');
                tr.setAttribute('id', ['service_id', data.id].join(''));
            },
            listContainerClass: null
        });

  

        mThis.initAlready = true;
    };


    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
   

    };
    return mThis;
})();



