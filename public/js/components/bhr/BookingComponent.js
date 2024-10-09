'use strict';


var BookingComponent = new function(){
    const mThis = this;
    this.title_prop = "Booking";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_main_bookingComponent');
    this.self = this.jm[0];
    this.btnNewBooking = mThis.self.querySelector('#_btn_new_booking');
    this.btnBackToBooking = mThis.self.querySelector('#_btn_backTo_booking');
    this.elSearch = mThis.self.querySelector('#_search_booking');

    // this.btnViewImageBooking = mThis.self.querySelector('#_btn_view_image_booking');

    // this.containerPagination = mThis.self.querySelector('#_booking_container_pagination');

    this.init = () => {
        if(mThis.initAlready) return;

        mThis.bookingListView = new ListView('_booking_container', {
            fetchApi: `${main_view.base_url}/api/merchant/v2/delivery-orders`,
            clientSidePagination: true,
            perPage: 10,
            // paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems: (items, list_container) => {
                mThis.renderBookingList(list_container, items);
            },
            listContainerClass: null
        });


        mThis.btnNewBooking.onclick = function (e) {
            e.preventDefault();
            let content = mThis.bookingListView.getListContainer();

            let op = {
                id: null,
                sender_id:AuthManager.user.official_id,
                title: 'Vehicle Type',
                btn: e.target,
                onClose: () => {
                    // content.parentElement.classList.remove('d-none');
                    mThis.bookingListView.showPage(mThis.getFilterData());
                }
            };
            // content.parentElement.classList.add('d-none');

            BookingDialog.show(op);
        };

        mThis.btnBackToBooking.onclick = function (e){
            e.preventDefault();
            let sub_content = mThis.self.querySelector('#sub_content');
            sub_content.classList.remove('d-none');
            let btnBack = mThis.self.querySelector('#btn_back');
            btnBack.classList.add('d-none');
            let sub_view_image = mThis.self.querySelector('#sub_view_image');
            sub_view_image.classList.add('d-none');
        }
        let timeOut = null ;
        mThis.elSearch.onkeyup = function(e){
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
            mThis.bookingListView.showPage(mThis.getFilterData());

            },250)
        }
        mThis.bookingListView.showPage(mThis.getFilterData());


        this.listContainer = mThis.bookingListView.getListContainer();
        mThis.initDropdownMenus(mThis.listContainer);

        mThis.initAlready = true;
    }
    this.getFilterData = ()=>{
        let p ={
            'official_id':AuthManager.user.official_id,
            'search_value':mThis.elSearch.value

        }
        return p;

    }
    this.viewImage = (id, lnk) => {
        let sub_content = mThis.self.querySelector('#sub_content');
        sub_content.classList.add('d-none');

        let btnBack = mThis.self.querySelector('#btn_back');
        btnBack.classList.remove('d-none');


        let sub_view_image = mThis.self.querySelector('#sub_view_image');
        sub_view_image.classList.remove('d-none');

        let titleViewImage = mThis.self.querySelector('#_title_view_image');
        titleViewImage.classList.remove('d-none');

        let titleViewPackage = mThis.self.querySelector('#_title_view_package');
        titleViewPackage.classList.add('d-none');

        let div = sub_view_image.querySelector('#_view_image_container');

        let p = {
            order_id: lnk.dataset.id
        };

        vsapi.call(`${mThis.base_url}/api/merchant/v2/order-images`, p, false, false, null).then(res => {
            if (res.status_code == 200) {
                let d = res.data;
                console.log(123, d);
                mThis.renderViewImage(d, div);
            }
        });
    };
    this.renderViewImage = (data = null, div) => {
        data = data ?? [];
        let html = '';

        if (data.length > 0) {
            html += `<div class="row gap-3">`;
            data.forEach(d => {
                html += `
                    <div class="col-2 p-0 bg-white overflow-hidden" style="height:142px;">
                        <img src="${d.image_url}" class="w-100 h-100" alt="">
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html = `<p class="text-center text-muted">No images available to display.</p>`;
        }

        div.innerHTML = html;
    };
    this.viewPackage = (id, lnk)=>{
        let sub_content = mThis.self.querySelector('#sub_content');
        sub_content.classList.add('d-none');

        let btnBack = mThis.self.querySelector('#btn_back');
        btnBack.classList.remove('d-none');

        let sub_view_image = mThis.self.querySelector('#sub_view_image');
        sub_view_image.classList.remove('d-none');

        let titleViewPackage = mThis.self.querySelector('#_title_view_package');
        titleViewPackage.classList.remove('d-none');

        let titleViewImage = mThis.self.querySelector('#_title_view_image');
        titleViewImage.classList.add('d-none');

        let div = sub_view_image.querySelector('#_view_image_container');
        mThis.displayOrderItems(div,id,lnk.dataset.sender_id,lnk);

    }
    this.displayOrderItems = (div, order_id, sender_id, btn = null) => {
        let p = { 'order_id': order_id };

        vsapi.call([mThis.base_url, '/dms/order/package-list'].join(''), p, btn, false, null).then(res => {
            if (res.status_code === 200) {
                let packages = StringSanitizer.sanitizeObject(res.data, null, ['size']);
                let data = packages;
                console.log(123, data);
                let cmt = 0;
                let html = `
                <div class="rounded-2 mt-3  bg-white p-0 overflow-hidden">
                    <table class="table table-header-custom header-uppercase">
                        <thead>
                            <tr>
                                <th scope="col">RECEIVER PHONE</th>
                                <th scope="col">RECEIVER ADDRESS</th>
                                <th scope="col">PRICE</th>
                                <th scope="col">COD</th>
                                <th scope="col">WEIGHT</th>
                                <th scope="col">Noted</th>
                                <th scope="col">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white" style="color:rgba(0, 0, 0, 0.7);">`;

                data.forEach(d => {
                    let cod_display = d.cod == 1 ? 'Yes' : `$${d.cod}`;

                    html += `
                        <tr>
                            <td class="align-middle">${d.receiver_phone}</td>
                            <td class="align-middle">${d.receiver_address}</td>
                            <td class="align-middle">$${d.price}</td>
                            <td class="align-middle">${cod_display}</td>
                            <td class="align-middle">${d.weight_kg ? d.weight_kg: '0.00'} kg</td>
                            <td class="align-middle">${d.remarks ? d.remarks:'Thanks You!!!'}</td>
                            <td class="align-middle">$${d.driver_total}</td>
                        </tr>`;
                        cmt++;
                });
                if(cmt === 0){
                    html +=`
                        <tr><td colspan="100%"><span class="d-flex justify-content-center" style="font-size:12px;">This Booking doesn't have package.</span></td></tr>
                    `;
                }

                html += `</tbody></table></div>`;
                div.innerHTML = html;
            }
        });
    };
    this.initDropdownMenus = (Container)=>{
        const menuOptopns = {
            containerElement: Container,
            actionButtonClass:"btn_um_action",
            cssClass:"bg-white rounded-4 shadow",
            //menuItemClass:"",
            menus:[
                {
                html:'<span class="ps-3" vslang="titles.View Image"></span>',
                icon:`<img src="assets/images/icons/gallery.svg" />`,
                cssClass:"viewImage pb-2",
                name:"viewImage"
                },
                {
                html:'<span class="ps-3" vslang="titles.View Package"></span>',
                icon:`<img src="assets/images/icons/package_icon.svg" />`,
                cssClass:"viewPackage pb-2",
                name:"viewPackage"
                },


            ],
            // adjustPosition:{
            //         top:-90
            // },
            onShow:(instance, menuContainer)=>{
                // console.log('open: ', instance.getMenus());
                let statusId = menuContainer.dataset.statusid;
                // console.log(111,menuContainer,222,statusId);
                if(Number(statusId)<2)
                    menuContainer.querySelector('a.viewImage').classList.add('d-none');
                else
                    menuContainer.querySelector('a.viewImage').classList.remove('d-none');

            },
            // onClose:(instance, menus)=>{
            // },
            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'viewImage':{
                        mThis.viewImage(id, menuLink); //Not yet defined
                        break;
                      }
                    case 'viewPackage':{
                      mThis.viewPackage(id, menuLink); //Not yet defined
                      break;
                    }
                    default:{
                      break;
                    }
                }
            }
        }

        new VSDropdownMenu(menuOptopns);
    }
    this.renderBookingList = (div,items) => {

        items = items ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then(user => {
            // console.log(user);
           mThis.beginRenderBooking(div,items,user)
        });
    }
    this.renderHeaderList = () => {
        return [
            `<div data-roleid="" class="w-100 rounded-3 p-3 pb-0 shadow text-white text-center mb-3 position-relative" style="background-color:#ec1616;">
                <div class="d-flex row text-center">
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Date</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Order ID</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Vehicle</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Category</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Quantity</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Pickup Address</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Driver</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Status</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Order By</span>
                            </h6>
                        </div>
                    </div>
                      <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize"></span>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>`
        ].join('');
    };
    this.beginRenderBooking = (div, items, current_user) => {
        const d = current_user;
        let html = '';

        html += this.renderHeaderList(); // Include the header

        html += `<div id="_scroll_booking">`;
        let cmt = 0;

        items.forEach(data => {
            const html_image_count = data.image_count > 0
                ? `<i class="fa fa-image"></i> ${data.image_count} images`
                : '';
            html += `
                <div class="card w-100 rounded-3 border-start border-5 border-danger-custom px-2 shadow bg-white mb-3  position-relative">
                    <div class="d-flex row align-items-center text-center" style="color:rgba(0, 0, 0, 0.7);">
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span class="pl-request_date text-nowrap">${data.request_date}</span>
                                    <span class="pl-request_time">${data.request_time}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.order_code ? data.order_code : "មិនទាន់មាន"}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.request_vehicle_type ? data.request_vehicle_type : "null"}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span class="d-block product-type">${data.product_type}</span>
                                    <span class="pkl-img-count d-block text-danger">${html_image_count}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span class="text-danger border border-success px-2 rounded-5">${data.qty ? data.qty : "null"}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span>${data.pickup_address ? data.pickup_address : 'No pickup address'}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span class="text-muted">${data.driver_name ? data.driver_name : "មិនទាន់មាន"}</span>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <a class="change-order-status order-status" data-statusid="${data.status_id}" data-id="${data.order_id}" data-senderid="${data.sender_id}" href="javascript:void(0)">
                                        <span class="order_status text-danger">${data.order_status ? data.order_status : '?'}</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-block">
                                <p class="m-0">
                                    <span class="d-block text-primary fw-semibold">${data.create_user}</span>
                                    <span class="d-block p-1"><small>${data.create_date}</small></span>
                                </p>
                            </div>
                        </div>


                        <div class="col d-flex justify-content-center align-items-center">
                            <div class="text-center gap-2 d-flex flex-wrap">
                                 <a href="javascript:void(0)" class="btn_um_action btn_pickup_action" data-id="${data.id}" data-orderid="${data.id}" data-senderid="${data.sender_id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <img src="${main_view.asset_url}/images/icons/Dot.svg" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`;
                cmt++;
        });
        if(cmt ===0){
            html +=`
             <div class="card w-100 rounded-3 border-start border-5 border-danger-custom py-2 shadow bg-white mb-3 p-3 position-relative">
                    <div class="d-flex row align-items-center text-center" style="color:rgba(0, 0, 0, 0.7);">
                        <div class="col">
                            <div class="d-block">
                               <span class="text-muted pb-3">No data to display.</span>
                            </div>
                        </div>
                  </div>
                </div>
            `;

        }

        html += `</div>`;
        div.innerHTML = html;

        const sh_parent = div.querySelector('#_scroll_booking');
        sh_parent.style.height = (window.innerHeight - 350) + 'px';
        sh_parent.classList.add('overflow-y-auto');
        sh_parent.classList.add('overflow-x-hidden');

        window.onresize = function(e) {
            e.preventDefault();
            sh_parent.style.height = (window.innerHeight - 350) + 'px';
        };
    };

    this.show = (options) => {

        mThis.init();
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
            mThis.bookingListView.showPage(mThis.getFilterData());
                mThis.jm.siblings().hide();
                mThis.jm.fadeIn(250);
    }
}
const BookingDialog = (()=>{
    const self = {};
    let dialog = null;
      self.show = (op)=>{
         dialog = dialog || new GeneralDialog({
             title: "",
             cssClass:"modal-lg",
             createContent: () => {
                return [`<div class="d-flex flex-column align-items-center">
                      <div class="text-center mb-4">
                            <button style="width:100px; height:100px; font-size:10px; background-color:#dd2424;"
                                    name="btn-moto"
                                    id="motoBtn"
                                    class="btn btn-lg rounded-circle mx-3 choice-btn"
                                    data-type="Moto">
                                <img src="${main_view.asset_url}/images/icons/moto.svg" alt="Moto" style="width: 50px; height: 50px;">
                                <span class="mt-1 mb-0 text-white">Moto</span>
                            </button>
                            <button style="width:100px; height:100px; font-size:10px; background-color:#dd2424;"
                                    name="btn-tuktuk"
                                    id="tukTukBtn"
                                    class="btn btn-lg rounded-circle mx-3 choice-btn"
                                    data-type="Tuk Tuk">
                                <img src="${main_view.asset_url}/images/icons/tok_tok.svg" alt="Tuk Tuk" style="width: 50px; height: 50px;">
                                <p class="mt-1 mb-0 text-white">Tuk Tuk</p>
                            </button>
                        </div>

                <div class="text-center">
                    <h5>Booking Info</h5>
                </div>
                <div class="booking-info w-100 d-flex flex-column align-items-center">
                    <div class="w-50 mb-3">
                        <label for="productType" class="form-label">Product Type<span class="text-danger">*</span></label>
                            <select name="product_type" class="form-control data-input p-3 px-5 rounded-4" data-field="product_type" id="productType">
                            </select>
                    </div>
                    <div class="w-50 d-none mb-3">
                        <label for="deliveryTYpe" class="form-label">Delivery Type<span class="text-danger">*</span></label>
                            <select name="delivery_type" value="normal" class="form-control data-input p-3 px-5 rounded-4" data-field="delivery_type" id="deliveryType">

                            </select>
                    </div>


                    <div class="w-50 mb-3">
                        <label for="packageNumber" class="form-label">Number of Package<span class="text-danger">*</span></label>
                        <div >
                            <img src="${main_view.asset_url}/images/icons/package_form.svg" style="position: absolute; margin: 10px">
                            <input type="number" class="form-control ps-5 data-input" data-field="qty"  placeholder="Number of Package">
                        </div>
                    </div>
                    <div class="w-50 mb-3">
                        <label for="pickupAddress" class="form-label">Pick Up Address<span class="text-danger">*</span></label>
                        <div>
                            <img src="${main_view.asset_url}/images/icons/map_form.svg" style="position: absolute; margin: 10px">
                            <input type="text" class="form-control ps-5 data-input" data-field="pickup_address" placeholder="Pick Up Address">
                        </div>
                    </div>
                    <div class="d-flex justify-content-around w-50">
                        <div class="text-center">
                            <button name="add_detail" id="_btn_add_detail" class="btn d-block mx-2">
                                <img src="${main_view.asset_url}/images/icons/x-circle_white.svg" />
                            </button>
                            <span vslang="buttons.Add Detail">Add Detail</span>
                        </div>
                        <div class="text-center">
                            <button name="take_photo" id="_btn_take_photo" class="btn d-block mx-2">
                                <img src="${main_view.asset_url}/images/icons/Camira_Icons_UIA.svg" />
                            </button>
                            <span vslang="buttons.Take Photo">Take Photo</span>
                        </div>
                    </div>
                </div>
            </div>
            `].join('');
            },
            contentCreated: (me) => {
                const header  = me.divModal.querySelector('.modal-header');
                VSUtil.initSelect(me.controls.product_type,null,null,{
                    "prependHTML":' <img src="http://127.0.0.1:8000/assets/images/icons/kube_form.svg" style="margin: 10px" >',
                    "containerClass":'mac-select d-flex border border-secondary rounded-4 align-items-center',
                });
                VSUtil.initSelect(me.controls.delivery_type,null,null,{
                    "prependHTML":' <img src="http://127.0.0.1:8000/assets/images/icons/kube_form.svg" style="margin: 10px" >',
                    "containerClass":'mac-select d-flex border border-secondary rounded-4 align-items-center',
                });
                const headerTitle = me.divModal.querySelector('.modal-header .modal-title');
                header.classList.add('bg-danger-custom','modal-header-custom');
                const footer = me.divModal.querySelector('.modal-footer');

                footer.classList.add('justify-content-between','border-0');
                headerTitle.classList.add('justify-content-center','text-white','w-100','d-flex');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style='border-radius: 25px !important;';
                let arrDetail = [];
                me.storeArrDetail = (arr,getData)=>{
                    if(!getData){
                        arrDetail = arr;
                    }
                    return arrDetail;
                }

                const buttons = me.divModal.querySelectorAll('.choice-btn');

                buttons.forEach(button => {
                    button.addEventListener('click', function() {
                        buttons.forEach(btn =>{
                             btn.style.backgroundColor = '#dd2424';
                             btn.classList.remove('active');

                        });
                        this.style.borderColor = '#ffffff'; // Set the desired border color
        // this.style.borderWidth = '1px'; // Optional: Set border width if needed
        // this.style.borderStyle = 'solid'; // Optional: Ensure the border style is solid
                        this.style.backgroundColor = '#007bff'; // Active color
                        this.classList.add('active');


                    });
                });
                // Event listener for Add Detail button
                //me.controls.add_detail.onclick = e =>
                //me.divModal.querySelector('#_btn_add_detail').onclick = e =>
                me.controls.add_detail.onclick = e =>{
                    e.preventDefault();


                    // Hide BookingDialog
                    dialog.hide(false);
                    let p = me.getData();

                    const buttons = me.divModal.querySelector('button.active');
                    p.sender_id = me.dataOptions.sender_id;
                    p.request_vehicle_type = 'moto';
                    p.delivery_type = 'Normal';

                    if(buttons){
                        p.request_vehicle_type = buttons.dataset.type ?? null;

                    }



                    let op ={
                        bookInfo: p,
                    //    sender_id: me.dataOptions.sender_id,
                        onClose:(arr)=>{
                            let k = me.storeArrDetail(arr,false);
                       }
                    };
                    console.log(123456,op);
                    if(p.product_type  && p.qty && p.pickup_address && p.request_vehicle_type)
                    AddDetailDialog.show(op);
                    else{
                        MessageDialog.show("Data can not be empty.");
                    }
                };
                me.controls.take_photo.onclick = e => {
                    e.preventDefault();

                    dialog.hide(false);

                    CameraDialog.show(op);
                };
            },
             // extendMethods:{
             //     "getData":(me,dataOptions)=>{
             //        return {"photo":me.controls.userImageBox.getImage()};
             //     }
             // },
            //  prepareFormOptions:{
            //      modifyTitle:"Modify Branch",
            //      createTitle:"Create Branch",
            //     api:{
            //        targetProp:"branch",
            //        endpoint:[main_view.base_url,'/api/branch/form-options'].join(''),
            //        params:(dataOptions)=>{
            //           return {id:dataOptions.id};
            //        }
            //          // params: {id:3}
            //     }
            //  },
            prepareFormOptions:{
                modifyTitle:"Modify Branch",
                createTitle:"Vehicle Type",
                api:{
                targetProp:"",
                endpoint:`${main_view.base_url}/api/merchant/v2/options-product-type`,
                    params:(dataOptions)=>{
                        return {id:dataOptions.id};
                    }
                }
            },
            onPrepareForm:(me,data,fields,divModal)=>{
                 LocaleManager.translateZone(me.divModal);
                 me.options.title = me.dataOptions.title||"Vehicle Type";

                VSUtil.setComboItems(fields.product_type, data,'code','product_type',true,'(Select Product Type*)',null);
                // VSUtil.setComboItems(fields.delivery_type, data,'code','delivery_type',false,'(Select delivery Type*)','Normal');

                const buttons = me.divModal.querySelectorAll('.choice-btn');
                buttons.forEach(btn =>{
                    btn.style.backgroundColor = '#dd2424';
                    btn.classList.remove('active');

               });
                const btnClose = me.divModal.querySelector('.modal-header button');
                btnClose.classList.add('d-none');
            },
            buttons: [
                {
                    label: 'Back',
                    cssClass: 'btn btn-outline-danger-custom mx-5 rounded-5',
                    click:(me)=>{
                        me.hide(false);
                    }
                },
                {
                    label: 'Book Now',
                    cssClass: 'btn btn-danger-custom mx-5 rounded-5',
                    click: (me) => {
                        let p = me.getData();
                        const buttons = me.divModal.querySelector('button.active');

                        p.sender_id = me.dataOptions.sender_id;
                        p.request_vehicle_type = 'moto';
                        p.delivery_type = 'Normal';

                        if(buttons){
                            p.request_vehicle_type = buttons.dataset.type ?? null;
                        }
                        p.packages = me.storeArrDetail(null,true);

                        console.log(123,p);


                        // vsapi.call(`${main_view.base_url}/api/merchant/v2/create-delivery-order`,p,false).then(res=>{
                        vsapi.call(`${main_view.base_url}/api/merchant/v2/create-delivery-order`,p,false).then(res=>{

                            if(res.status_code == 200){
                                MessageDialog.show('New Booking is Create Already.','success');
                                me.hide(true,p);

                            }else cv_interact.error(res.error_message);
                        });
                    }
                }

            ],
            onClose:(canceled)=>{
                // let content = BookingComponent.bookingListView.getListContainer();
                // content.parentElement.classList.remove('d-none');


            }

          });

         dialog.show(op);
      }
    return self;
 })();

const AddDetailDialog = (() => {
    const self = {};
    let dialog = null;
    const updateDialogTitle = (title) => {
        if (dialog) {
            const modalTitle = dialog.divModal.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.innerText = title;
            }
        }
    };
    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            title: 'Add Detail',
            cssClass: 'modal-lg d-flex justify-content-center ',
            createContent: () => {
                return [`<div name="mainDlgAdd">`,
                            `<table name="tblListDetail"  class="table mt-3 d-none">`,
                                ``,
                            `</table>`,
                        `<form name="formAddDetail">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="receiverName">Receiver's Name<span class="text-danger">*</span></label>
                                    <div>
                                        <img src="${main_view.asset_url}/images/icons/user-2.svg" style="position: absolute; margin: 12px">
                                        <input type="text" class="form-control  ps-5 data-input" data-field="receiver_name" placeholder="Receiver's Name">
                                    </div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="phoneNumber">Phone Number<span class="text-danger">*</span></label>
                                    <div>
                                        <img src="${main_view.asset_url}/images/icons/Call_Ringing.svg" style="position: absolute; margin: 12px">
                                        <input type="number" class="form-control data-input ps-5" data-field="receiver_phone"  placeholder="Phone Number">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="receiverAddress">Receiver Address<span class="text-danger">*</span></label>
                                    <div>
                                        <img src="${main_view.asset_url}/images/icons/Locate.svg" style="position: absolute; margin: 12px">
                                        <input type="text" class="form-control data-input ps-5" data-field="receiver_address" placeholder="Receiver Address">
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="price">Price<span class="text-danger">*</span></label>
                                    <div>
                                        <img src="${main_view.asset_url}/images/icons/dollar-square.svg" style="position: absolute; margin: 12px">
                                        <input type="number" class="form-control data-input ps-5" data-field="price"  placeholder="Price">
                                    </div>
                                </div>
                              <div class="col-md-3 mb-3">
                                    <label for="cod">COD<span class="text-danger">*</span></label>
                                    <div class="d-flex pt-3">
                                        <div class="form-check mx-3">
                                            <input class="form-check-input" type="radio" name="codOptions" id="codYes" value="Yes">
                                            <label class="form-check-label" for="codYes">Yes</label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="codOptions" id="codNo" value="No">
                                            <label class="form-check-label" for="codNo">No</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="weight">Weight<span class="text-danger">*</span></label>
                                    <div>
                                        <img src="${main_view.asset_url}/images/icons/kg.svg" style="position: absolute; margin: 12px">
                                        <input type="number" class="form-control data-input ps-5" data-field="weight_kg"  placeholder="Weight">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="notes">Notes<span class="text-danger">*</span></label>
                                    <div>
                                        <img src="${main_view.asset_url}/images/icons/edit-2.svg" style="position: absolute; margin: 12px">
                                        <input type="text" class="form-control data-input ps-5" data-field="remarks"   placeholder="Notes">
                                    </div>
                                </div>
                                 <input type="hidden" class="form-control data-input ps-5" data-field="zone_code"   placeholder="Notes">
                                 <input type="hidden" class="form-control data-input ps-5" data-field="cod"   placeholder="Notes">

                            </div>
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <label for="total">Total Amount :</label>
                                    <div>
                                        <input type="number" class="form-control ps-5" data-field="total_amount"  readonly >

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>`].join('');
                        },
                        contentCreated: (me) => {
                            me.items = [];

                            me.btn = (name) => {
                                const btn_back = me.divModal.querySelector('.modal-footer .btn-back');
                                const btn_add = me.divModal.querySelector('.modal-footer .btn-add');
                                const btn_submit = me.divModal.querySelector('.modal-footer .btn-submit');
                                const btn_update = me.divModal.querySelector('.modal-footer .btn-update');
                                const btn_list = me.divModal.querySelector('.modal-footer .btn-list');
                                if (name == 'back') return btn_back;
                                else if (name == 'add') return btn_add;
                                else if (name == 'submit') return btn_submit;
                                else if (name == 'update') return btn_update;
                                else if (name == 'list') return btn_list;
                                else return;
                            };

                            me.storeListDetail = (data, getData) => {
                                if (!getData) {
                                    if (data.receiver_name && data.receiver_phone)
                                        me.items.push(data);
                                }
                                console.log(999, me.items);
                                return me.items;
                            };

                            me.editListDetail = (newData, i) => {
                                me.items[i] = newData;
                                console.log(111, newData, 222, i, 333, me.items[i], 444);
                                return me.items;
                            };

                            let index = 0;

                            me.getClickIndex = () => {
                                return index;
                            };

                            me.setClickIndex = (i) => {
                                index = i;
                            };

                            me.showListDetail = (data, tbl) => {
                                me.controls.formAddDetail.classList.add('d-none');
                                tbl.classList.remove('d-none');
                                tbl.innerHTML = '';
                                let thead = '';
                                let tbody = '';
                                let html = '';
                                let tr = '';

                                html = `
                                    <th>Receiver's Name</th>
                                    <th>Phone Number</th>
                                    <th>Receiver's Address</th>
                                    <th>Price</th>
                                    <th>Weight</th>
                                    <th>Total</th>
                                    <th></th>
                                `;
                                thead += `<thead><tr>${html}</tr></thead>`;
                                tbl.innerHTML += thead;

                                let k = 0;
                                data.map(c => {
                                    tr += `
                                        <tr>
                                            <td data-name="receiver_name"><span>${c.receiver_name}</span></td>
                                            <td data-name="receiver_phone"><span>${c.receiver_phone}</span></td>
                                            <td data-name="receiver_address"><span>${c.receiver_address}</span></td>
                                            <td data-name="price"><span>${c.price}</span></td>
                                            <td data-name="weight_kg"><span>${c.weight_kg}</span></td>
                                            <td data-name="total_amount"><span>${c.price}</span></td>
                                            <td data-index="${k}">
                                                <span><a class="edit-list-detail" href="javascript:void(0)"><i class="text-success fa fa-edit px-2"></i></a></span>
                                                <span><a class="delete-list-detail" href="javascript:void(0)"><i class="text-danger fa fa-trash"></i></a></span>
                                            </td>
                                        </tr>
                                    `;
                                    k++;
                                });

                                if (k == 0) {
                                    tr = `
                                        <tr>
                                            <td colspan="100%" class="text-center">No data available</td>
                                        </tr>
                                    `;
                                }

                                tbody += `<tbody>${tr}</tbody>`;
                                tbl.innerHTML += tbody;

                                me.controls.tblListDetail.querySelector('tbody').addEventListener('click', function(event) {
                                    let btn = VSUtil.closestLimited(event.target, 'tr .edit-list-detail');
                                    if (btn) {
                                        let item = {};
                                        let tds = null;
                                        let tr = VSUtil.closestLimited(event.target, 'tr');
                                        tds = tds || tr.querySelectorAll('td');
                                        tds.forEach(td => {
                                            item[td.dataset.name] = td.textContent;
                                            me.setClickIndex(Number(td.dataset.index));
                                        });

                                        item.id = tr.dataset.id;
                                        me.btn('back').classList.add('d-none');
                                        me.btn('add').classList.add('d-none');
                                        me.btn('submit').classList.add('d-none');
                                        me.btn('update').classList.remove('d-none');
                                        me.controls.formAddDetail.classList.remove('d-none');
                                        updateDialogTitle('Modify');
                                        me.controls.tblListDetail.classList.add('d-none');

                                        me.controls.formAddDetail.querySelectorAll('.data-input').forEach(el => {
                                            const f = el.dataset.field;
                                            el.value = item[f] ?? '';
                                        });

                                        // Call function to check COD based on price and update total
                                        me.checkCodBasedOnPrice();
                                    }
                                });
                            };


                            me.checkCodBasedOnPrice = () => {
                                const codYes = me.controls.formAddDetail.querySelector('#codYes');
                                const codNo = me.controls.formAddDetail.querySelector('#codNo');
                                const totalAmountInput = me.controls.formAddDetail.querySelector('[data-field="total_amount"]');
                                const priceInput = me.controls.formAddDetail.querySelector('[data-field="price"]');

                                if (priceInput && totalAmountInput) {
                                    const price = parseFloat(priceInput.value) || 0;
                                    const totalAmount = price;
                                    if (price > 0) {
                                        codYes.checked = true;
                                        totalAmountInput.value =  totalAmount.toFixed(2);
                                    } else {
                                        codNo.checked = true;
                                        totalAmountInput.value = '0.00';
                                    }
                                }
                            };



                            // Add event listener to the price input field to update COD selection and total amount when price changes
                            const priceInput = me.controls.formAddDetail.querySelector('[data-field="price"]');
                            if (priceInput) {
                                priceInput.addEventListener('input', () => {
                                    me.checkCodBasedOnPrice();
                                });
                            }

                        },


            buttons: [
                {
                    label: 'Add',
                    cssClass: 'btn btn-add btn-danger-custom mx-2 rounded-5',
                    // click: () => {

                        // dialog.hide();
                        // if (typeof op.onClose === 'function') op.onClose();
                    // }
                    click: (me) => {

                        let p = me.getData();
                             // p.id = null;
                             p.zone_code = "D018";
                             p.cod = 0;
                        if(!p.receiver_phone)
                            {
                            MessageDialog.show('Invalid receiver phone number.','error');
                            return;
                        }
                        me.btn('add').classList.add('d-none');
                        me.controls.formAddDetail.classList.add('d-none');

                        let getData;
                        let k = me.storeListDetail(p,getData = false);
                        me.controls.formAddDetail.querySelectorAll('.data-input').forEach(el =>{
                            const f = el.dataset.field;
                            el.value = '';
                         });
                         me.controls.formAddDetail.querySelectorAll('.form-check-input').forEach(el => {
                            el.checked = false;
                        });
                        // me.btn('back').classList.add('d-none');
                        // me.btn('submit').classList.add('d-none');
                        me.btn('list').classList.add('d-none');
                        me.controls.tblListDetail.classList.add('d-none');

                        updateDialogTitle('List Detail');
                        me.btn('submit').classList.remove('d-none');

                        me.btn('back').classList.remove('d-none');
                        let data = me.storeListDetail(null,true);
                        me.showListDetail(data,me.controls.tblListDetail);






                        //  //show list details
                        //  let data = me.storeListDetail(null,true);
                        //  me.showListDetail(data,me.controls.tblListDetail);

                    }
                },
                {
                    label: 'List',
                    cssClass: 'btn  d-none btn-list btn-danger-custom mx-2 rounded-5',
                    click : (me)=>{
                        updateDialogTitle('List Detail');
                        me.btn('list').classList.add('d-none');
                        me.btn('add').classList.add('d-none');
                        me.btn('submit').classList.remove('d-none');

                        me.btn('back').classList.remove('d-none');
                        let data = me.storeListDetail(null,true);
                        me.showListDetail(data,me.controls.tblListDetail);
                    }

                },
                {
                    label: 'Update',
                    cssClass: 'btn d-none btn-update btn-danger-custom mx-2 rounded-5',
                    // click: () => {

                        // dialog.hide();
                        // if (typeof op.onClose === 'function') op.onClose();
                    // }
                    click: (me) => {
                        updateDialogTitle('List Detail');
                        me.btn('back').classList.remove('d-none');
                        me.btn('submit').classList.remove('d-none');
                        me.controls.tblListDetail.classList.remove('d-none');

                        me.btn('add').classList.add('d-none');
                        me.btn('update').classList.add('d-none');
                        me.controls.formAddDetail.classList.add('d-none');
                        let p = me.getData();
                        p.zone_code = "D018";

                        let i = me.getClickIndex();
                        let k = me.editListDetail(p,i);
                        console.log(888,k);

                        let data = me.storeListDetail(null,true);
                         me.showListDetail(data,me.controls.tblListDetail);
                    }
                },
                {
                    label: 'Back',
                    cssClass: 'btn d-none btn-back btn-danger-custom mx-2 rounded-5',
                    icons: '<i class="fa fa-money"></i>',
                    click: (me) => {
                        updateDialogTitle('Add Detail');
                        me.btn('back').classList.add('d-none');
                        me.btn('submit').classList.remove('d-none');
                        me.controls.tblListDetail.classList.add('d-none');

                        me.controls.formAddDetail.classList.remove('d-none');
                        me.btn('add').classList.remove('d-none');

                        me.controls.formAddDetail.querySelectorAll('.data-input').forEach(el =>{
                            const f = el.dataset.field;

                            el.value = '';

                         });
                         me.controls.formAddDetail.querySelectorAll('[name="total_amount"]').forEach(el => {
                            el.value = '';
                        });

                    }
                },
                {
                    label: 'Submit',
                    cssClass: 'btn d-none btn-submit btn-danger-custom mx-2 rounded-5',
                    click: (me) => {
                     let p = {};
                    let k = me.storeListDetail(null,true);
                    p.sender_id = me.dataOptions.bookInfo.sender_id,
                    p.request_vehicle_type = me.dataOptions.bookInfo.request_vehicle_type,
                    p.product_type = me.dataOptions.bookInfo.product_type,
                    p.delivery_type = me.dataOptions.bookInfo.delivery_type,
                    p.pickup_address = me.dataOptions.bookInfo.pickup_address,
                    p.qty = me.dataOptions.bookInfo.qty,

                    p.packages = k;
                    // delete p.id;

                    console.log(1199,p);

                     vsapi.call(`${main_view.base_url}/api/merchant/v2/create-delivery-order`,p,false).then(res=>{

                            if(res.status_code == 200){
                                me.hide(true);
                                MessageDialog.show('New Booking is Create.','success');
                            }else MessageDialog.show(res.error_message,'error');
                        });
                    }
                },

            ],
            onClose:(canceled)=>{

            }
        });

        dialog.show(op);
    };

    return self;
})();

// const CameraDialog = (() => {
//     const self = {};
//     let dialog = null;
//     let video = null;
//     let canvas = null;
//     let context = null;

//     function initCamera(me) {
//         video = me.divModal.querySelector('#video');
//         canvas = me.divModal.querySelector('#canvas');
//         if (!canvas) {
//             canvas = document.createElement('canvas');
//         }
//         context = canvas.getContext('2d');

//         function handleSuccess(stream) {
//             video.srcObject = stream;
//             video.play();
//         }

//         function handleError(error) {
//             console.log('Error: ' + error.message);
//             const text = 'Failed to access the camera. Please check your camera permissions and try again';
//             if (cv_interact) cv_interact.warning(text); else alert(text);
//         }

//         if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//             navigator.mediaDevices.getUserMedia({ video: true })
//                 .then(handleSuccess)
//                 .catch(handleError);
//         } else {
//             console.log('getUserMedia is not supported in this browser.');
//             const text = 'Your browser does not support camera access. Please use a different browser to access the camera.';
//             if (cv_interact) cv_interact.warning(text); else alert(text);
//         }
//     }

//     function captureImage() {
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
//         const dataURL = canvas.toDataURL('image/png');
//         if (typeof self.onClose === 'function') self.onClose({ 'image': dataURL, 'remarks': '' });
//         dialog.hide(false);
//     }

//     self.show = (options = {}) => {
//         dialog = dialog || new GeneralDialog({
//             title: options.title || 'Camera',
//             cssClass: 'modal-lg',
//             createContent: () => {
//                 return `
//                     <div>
//                         <video id="video" autoplay></video>
//                         <canvas id="canvas" style="display:none;"></canvas>
//                     </div>
//                 `;
//             },
//             contentCreated: (me) => {
//                 initCamera(me);
//             },
//             buttons: [
//                 {
//                     label: 'Capture',
//                     cssClass: 'btn btn-capture btn-primary',
//                     click: (me, e) => {
//                         e.preventDefault();
//                         captureImage();
//                     }
//                 },
//                 {
//                     label: 'Close',
//                     cssClass: 'btn btn-secondary',
//                     click: (me) => {
//                         dialog.hide(false);
//                     }
//                 }
//             ],
//             onClose: (canceled) => {
//                 if (!canceled) {
//                     video.pause();
//                     video.srcObject = null;
//                 }
//             }
//         });

//         self.onClose = options.onClose;
//         dialog.show(options);
//     };

//     return self;
// })();




