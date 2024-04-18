"use strict";
var OrderImagesComponent = new function(){
    let mThis = this;
    this.self = main_view.appContent.children('#_main_orderImageComponent');
    this.title_prop = "Order Images";
    this.base_url = main_view.base_url || document.querySelector('meta[name="base_url"]').getAttribute('content');
  
    this.tblOrderImage = this.self.find('#_ido_tblOrderImage');
    this.elSearch = this.self.find('#_odi_search_input');
    this.btnSearch = this.self.find('#_odi_btnSearch');
    this.elFilter_start_date = this.self.find('#_odi_filter_start_date');
    this.elFilter_end_date = this.self.find('#_odi_fliter_end_date');
    this.elFilter_sender = this.self.find('#_ido_filter_sender');
    this.dlgViewImg = this.self.find('#_odi_dlgOrderImages');
    this.dlgAddImage = this.self.find('#_ido_insert_image');

    this.initOnce = ()=>{
        if (mThis.initAlready) return;

        this.cfg = new ExpandableRowConfig('_ido_tblOrderImage',{
            'dontExpandByClickingOn':['btn_odi_modify','btn-odi-delete','btn_odi_action','btn_odi_print'],
            'onOpen':(container,detail_tr,parent_tr)=>{
                let qtr = $(parent_tr);
                let orderImage_id = qtr.data('id');
                let empty_row = parent_tr.querySelector('td.dataTables_empty');
                //Display details only when parent row is NOT the empty row 
                if (!empty_row) mThis.displayOrderImagesDetails($(detail_tr),orderImage_id);
             }
        });
        
        mThis.tblOrderImage[0].addEventListener('click',e =>{
          e.preventDefault();

          //Click on Delete image
          let btn = VSUtil.closestLimited(e.target,'.btn-delete-img');
          if(btn){
                let id = btn.dataset.id;
                let p = {'id':id};
                cv_interact.confirm("Delete this image?",{title:"Delete Image",context:"delete"},e => {
                if(e){
                    vsapi.call(`${mThis.base_url}/dms/img-order/delete-image`,p).then(res=>{
                        if(res.status_code ===200){
                            let tr = btn.closest('tr');
                            const prev_tr = tr.previousElementSibling;
                            if(prev_tr){
                                let order_id = prev_tr.dataset.id;
                                mThis.displayOrderImagesDetails(tr,order_id);
                            }
                           
                        }else cv_interact.error(res.error_message);
                     });
                  }
                });
            return;
          }

          //Click on View Image
          btn = VSUtil.closestLimited(e.target,'.btn-view-img');
          if(btn){
            const image_url = btn.dataset.url;
            let img_view = [`<img class="rounded" style="background-size:cover; background-repeat:no-repeat; width:100%; height:100%" src="${image_url}"/>`].join('');
            mThis.dlgAddImage.html(img_view);
            ViewImgDialog.show();
            return;
          }

          //Click on Thumbnail
          btn = VSUtil.closestLimited(e.target,'.img-thumbnail',10);
          if(btn){
                let image_url = btn.dataset.url;
                let img_view = [`<img class="rounded" style="background-size:cover; background-repeat:no-repeat; width:100%; height:100%" src="${image_url}"/>`].join('');
                mThis.dlgAddImage.html(img_view);
                ViewImgDialog.show();
          }

          //Click on Delete Order
          btn = VSUtil.closestLimited(e.target,'.btn-odi-delete',10);
          if(btn){
                let id = btn.dataset.id;
                let p = {'id': id};
                cv_interact.confirm("Delete this order?",{title:"Delete Order",context:"delete"},e => {
                    if(e){
                    vsapi.call(`${mThis.base_url}/dms/img-order/delete-order`,p).then(res=>{
                        if(res.status_code ===200){
                            mThis.displayOrderImages();
                        }else cv_interact.error(res.error_message);
                        });
                    }
                });
             return;
          }
        });
      
        mThis.elSearch.on('keyup',function(e){
            e.preventDefault();
            if(e.keyCode === 13) mThis.displayOrderImages();
        });

        mThis.btnSearch.on('click',function(e){
            e.preventDefault();
            if(mThis.elSearch.val()) mThis.displayOrderImages();
        });

        mThis.elFilter_start_date.on('change',function(e){
            e.preventDefault();
            mThis.displayOrderImages();
        });

        mThis.elFilter_end_date.on('change',function(e){
            e.preventDefault();
            mThis.displayOrderImages();
        });

        mThis.elFilter_sender.on('change',function(e){
            e.preventDefault();
            mThis.displayOrderImages();
        });
       
       mThis.initAlready = true;  
    }

    this.displayOrderImagesDetails = (detail_tr,orderImage_id = 0) => {
        let div_wrapper = detail_tr.find('div.expandable-row-container');
        div_wrapper.html('<div class="animation-line" style="height:2px;margin:0;"></div>');
        let p = {'id': orderImage_id};
        vsapi.call(`${mThis.base_url}/dms/img-order/images`,p,null,false).then(res => {
            let html = null;
            let cnt =0;
            if(res.status_code === 200){
                let imgs = StringSanitizer.sanitizeObject(res.data,null,["image_url"]);
                let image_html = "";
                imgs.map(item => {
                    image_html = [image_html,`<div class="d-flex flex-column pe-4">
                        <img data-id="${item.id}" class="img-thumbnail" style="width:285px; height:177px; min-width: 285px;" src="${item.image_url}" data-url="${item.image_url}"/>
                        <div class="d-flex align-items-center pt-2 w-100 px-2 bootstrap-custom">
                            <div>
                                <button class="btn btn-warning btn-view-img" type="button" data-id="${item.id}" data-url="${item.image_url}">
                                    <span class="trans-text" data-langprop="buttons.View">View</span>
                                </button>
                            </div>
                            <div class="d-flex justify-content-end w-100">
                                <button class="btn btn-danger btn-delete-img" type="button" data-id="${item.id}">
                                    <span class="trans-text" data-langprop="buttons.Delete">Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>`].join('');
                    cnt++;
                });
                
                let container_id = ['oi_order_',orderImage_id].join(''); 
                if (cnt>0) 
                   html = [`<div class="d-flex align-items-center pb-4 shadow border rounded-3 p-3 my-3 mb-4" style="overflow-x: auto; width:86vw;" id="${container_id}">`,image_html,`</div>`].join('');
                else
                {
                    let empty_text = LocaleManager.trans('No images to display'); 
                    html = [`<div class="d-flex align-items-center" id="${container_id}"> <span class ="no-image-text p-3 d-block border border-rounded border-warning fw-bold">${empty_text}</span> </div>`].join('');
                }
            }
            else{
                html =`<div class="expanded-row-error">${res.error_message}</div>`;
            }
            div_wrapper.html(html);
        });
    }

    this.addImage = (order_id,img,count=0)=>{
       let div = $(`div#oi_order_${order_id}`);
       div.find('.no-image-text').remove();
       div.append(`<div class="d-flex flex-column pe-4">
            <img class ="img-thumbnail" style="width:285px; height:177px; min-width: 285px;" data-id="${img.id}" src="${img.image_url}" data-url="${img.image_url}"/>
            <div class="d-flex align-items-center pt-2 w-100 px-2 bootstrap-custom">
                <div>
                    <button class="btn btn-warning btn-view-img" type="button" data-url="${img.image_url}" data-id="${img.id}">
                        <span class="trans-text" data-langprop="buttons.View">View</span>
                    </button>
                </div>
                <div class="d-flex justify-content-end w-100">
                    <button class="btn btn-danger btn-delete-img" type="button" data-id="${img.id}">
                        <span class="trans-text" data-langprop="buttons.Delete">Delete</span>
                    </button>
                </div>
            </div>
       </div>`);
       let tr = div.closest('tr');
       if(tr.length>0){
           let ptr = tr.prev();
           ptr.find('td.col-qty>.col-qty-text').text(count);
       }
    }

    this.removeImage = (order_id,id=0,count=0)=>{
        let div = $(`div#oi_order_${order_id}`);
        div.find('img.img-thumbnail').each(function(){
           let img = $(this); 
           if (img.data('id') == id){
               img.remove();

               let tr = div.closest('tr');
               if(tr.length>0){
                   let ptr = tr.prev();
                   if (count<=0){
                        //delete the Order when there are No images or items
                        tr.remove();
                        ptr.remove();
                        return false;
                   }
                   ptr.find('td.col-qty>.col-qty-text').text(count);
               }
               return false;
           }
        });
    }

    this.displayOrderImages = () => {
        let p = {'search_value': mThis.elSearch.val(),'start_date': mThis.elFilter_start_date.val(),'end_date': mThis.elFilter_end_date.val(),'sender_name': mThis.elFilter_sender.val()};
        vsapi.call(`${mThis.base_url}/dms/img-order/list`,p,null,null).then(res => {
            if(res.status_code === 200){
                if(mThis.table){
                    mThis.tblOrderImage.DataTable().clear().destroy();
                    mThis.tblOrderImage.empty();
                    mThis.table = null;
                }

                let data = StringSanitizer.sanitizeObject(res.data);

                let columns = [{
                    title: "Order Time",
                    data:(data,a,b)=>{
                        return [`<span class="fw-bold d-block">${data.order_date}</span><span class="text-secondary p-2">${data.order_time}</span>`].join('');
                    }
                },{
                    title: "Merchant",
                    data:(data,a,b)=>{
                        let sender_phone = data.sender_phone?data.sender_phone:"Tel: (Not Avaialble)";
                        return [`<span class ="text-success fw-bold d-block">${data.sender_name}</span><span class="p-2">${sender_phone}</span>`].join('');
                    }
                },{
                    title: "Order Number",
                    data: "code"
                },
                {
                    className:'col-qty',
                    title: "Qty",
                    data: (data,a,b)=>{
                        return `<span class="fw-bold p-2 col-qty-text">${data.qty}</span> pcs`;
                    }
                },
                {
                    title: "Pickup Address",
                    data:(data,a,b)=>{
                        return data.address?data.address:`(${LocaleManager.trans('Not Avaialble')})`;
                    }
                },{
                    title: "Action",
                    data: (data,a,b) => {
                        let html = [`<div>
                            <a href="javascript:void(0)" data-id="${data.id}" class="text-danger fs-5 btn-odi-delete">
                                <i class="fa-solid fa-trash-can"></i>
                            </a>
                        </div>`].join('');
                        return html;
                    }
                }];

                if(!mThis.table)
                mThis.table = mThis.tblOrderImage.DataTable({
                    searching:false,
                    ordering:false,
                    destroy:true,
                    paging:true,
                    retrieve: true,
                    //scrollY:390,
                    //scrollX:500,
                    //pagingType:'numbers',
                    info:true,
                    bLengthChange:false,
                    saveState:true,
                    'processing': false,
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        "emptyTable": "No data to display"
                    },
                    data:data,
                    columns: columns
                    ,"createdRow": function(row, data, dataIndex){
                        let tr = $(row);
                        tr.data('id',data.id);   
                    }
                });
            }
        });

        // let p = {"search_value":mThis.elSearch.val(), "order_date":mThis.elFilter_date.val(),"sender":mThis.elFilter_sender.val()};
        // vsapi.call(`${main_view.base_url}/dms/merchant/v2/order-images`,null).then(res=>{
        //     if(res.status_code === 200){
        //          let data = res.data;
        //     }
        // });
    }

    this.show = (options= null)=>{
        mThis.initOnce();
        mThis.displayOrderImages();
        mThis.self.siblings().hide();
        main_view.setTitle(mThis.title_prop);
        mThis.self.fadeIn(250);
    }
}

let ViewImgDialog = new function(){
    let mThis = this;
    this.self = main_view.appContent.children('#_odi_dlgOrderImages');

    this.show = (option) => {
        mThis.self.modal({
            backdrop: true
        });
    }
}