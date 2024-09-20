'use strict';


var ReferralZoneComponent = new function () {
    const mThis = this;
    this.title_prop = "Referral Zone";
    this.jm= main_view.appContent.children('#_main_referralZoneComponent');
    this.self = this.jm[0];
    this.base_url = main_view.base_url;

    this.init = () =>{
        if(mThis.initAlready) return;
        mThis.referralZoneListView = new ListView('_list_referralZone',{
            fetchApi: `${main_view.base_url}/mac/referral/list`,
            prePage:10,
            // paginationContainer:mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems:(data,list_container)=>{
                mThis.renderReferralZoneList(list_container,data);
            },
            listContainerClass:null
        });
 
    
        this.listContainer = mThis.referralZoneListView.getListContainer();
        mThis.initAlready = true;
    }
    this.renderReferralZoneList = (container,data)=>{
        data = data ?? [];
        if(!AuthManager){
            console.error('Authentication Management does not seems to work properly. You may need to refresh page.');
            return ;

        }
        AuthManager.init().then(user=>{
            mThis.beginRenderReferralZone(container,data,user);
        });

    }
    this.RenderHeaderList = () =>{
        return [
            `<div class="w-100 rounded-3  p-3 pb-0 shadow text-white text-center mb-3 position-relative" style="background-color:#ec1616;">
                <div class="d-flex row text-center ">
                    <div class="col ">
                        <h6>ID</h6>
                    </div>
                    <div class="col">
                        <h6>NAME</h6>
                    </div>
                    <div class="col">
                        <h6>EMAIL</h6>
                    </div>
                    <div class="col">
                        <h6>PHONE NUMBER</h6>
                    </div>
                    <div class="col">
                        <h6>POSITION</h6>
                    </div>
                    <div class="col">
                        <h6>START DATE</h6>
                    </div>
                    
                    <div class="col">
                        <h6>STATUS</h6>
                    </div>
                      
                       
                </div>
            </div>`].join('');
    };

    this.beginRenderReferralZone = (container, data = [], current_user) => {
        const d = current_user;
        let html = '';
        html += this.RenderHeaderList();
        html += `<div id="scroll_referral">`;
        let cmt = 0;
    
        (data ?? []).forEach(item => {
            html += `
                <div class="w-100 rounded-3 border-start text-center border-5 border-danger-custom p-3 shadow bg-white mb-3 position-relative">
                    <div class="row">
                        <div class="col ">${item.code}</div>
                        <div class="col">${item.name}</div>
                        <div class="col"><span class="d-block text-nowrap text-primary">${item.email}</span></div>
                        <div class="col">${item.phone_number}</div>
                        <div class="col">${item.position_title}</div>
                        <div class="col">${item.start_date}</div>
                        
                        <div class="col">
                            <div class="d-block border bg-success shadow rounded-4 text-white p-1 text-center" style="min-width:40px">
                                ${item.status_code || ''}
                            </div>
                        </div>
                    </div>
                </div>`;
            cmt++;
        });
    
        if (cmt === 0) {
            html += `
                <div class="w-100 rounded-3 text-center border-5 p-3 shadow bg-white mb-3 position-relative">
                    <div class="row">
                        <div class="w-100">No Data to Display Here.</div>
                    </div>
                </div>`;
        }
    
        html += `</div>`;
        container.innerHTML = html;
    };
    
    


    this.getFilterData = () =>{
        let p = {
            "sender_id":AuthManager.user.official_id,
        };
        return p;

    }
    this.show= (options)=>{
       mThis.init();
        if (!options) options = {};
            main_view.setTitle(mThis.title_prop);   
            mThis.referralZoneListView.showPage(mThis.getFilterData());
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
       
    }
}
